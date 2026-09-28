import { protectionBypassHeaders } from '../../e2e/helpers/bypass';

/**
 * W152 (§8 E, T3-4) — the pure, dependency-injectable half of the launch profile's dead-target
 * sweep: HTML scanning + one fetch helper, shared by `dead-targets.launch-check.ts` (real fetch
 * against `E2E_BASE_URL`, runs only under `vitest.launch.config.mts`) and `dead-targets.test.ts`
 * (a mocked fetch, part of the default suite). Kept in its own module, with no top-level
 * `E2E_BASE_URL` check, so the unit test can import it without ever touching the network.
 */

const HREF_RE = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

/** Every internal `href="/…"` the markup carries, `/_next/*` excluded, deduplicated, in
 *  first-seen order. A regex over the raw tag attribute — the same lightweight approach
 *  `scripts/placeholder-count.ts` uses; a full DOM parse is unnecessary for one attribute.
 *  Scripts and comments are stripped first so the RSC flight payload's escaped JSON (which can
 *  itself contain the substring `href":"/…`) is never mistaken for a rendered link. */
export function internalHrefs(html: string): string[] {
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  const seen = new Set<string>();
  for (const m of markup.matchAll(HREF_RE)) {
    const href = m[1] ?? m[2] ?? '';
    if (href.startsWith('/') && !href.startsWith('/_next/')) seen.add(href);
  }
  return [...seen];
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whether the HTML carries a real element with this id — the landing spot a CTA hash
 *  (`#proposal` → `proposal`, from `DEFAULT_CTAS` or `CTA_BY_PATHNAME`) must exist on its page
 *  (W17: "the page task that owns a key must render that element id"; W158). */
export function hasElementId(html: string, id: string): boolean {
  const re = new RegExp(`\\bid\\s*=\\s*(?:"${escapeRegExp(id)}"|'${escapeRegExp(id)}')`);
  return re.test(html);
}

export type FetchResult = { status: number | null; html: string };

/** GET `path` on `base`. Redirects are never followed (`redirect: 'manual'`): an internal chrome
 *  link should answer 200 directly, so a 3xx here is itself a finding, not a hop to chase — the
 *  same convention `placeholder-count.ts` uses. A 15s timeout and the W137 bypass header (only
 *  when the secret is non-blank) cover a protected preview target. `f` is dependency-injected so
 *  the unit test never touches the network. */
export async function fetchRoute(
  base: string,
  path: string,
  f: typeof fetch = fetch,
): Promise<FetchResult> {
  try {
    const res = await f(`${base}${path}`, {
      headers: { accept: 'text/html', ...protectionBypassHeaders() },
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
    });
    return { status: res.status, html: res.ok ? await res.text() : '' };
  } catch {
    return { status: null, html: '' };
  }
}

/** Every internal href reachable from `routes`, fetched once each, that does not itself answer
 *  200 — the dead-target list, one human-readable line per offender. */
export async function deadTargets(
  base: string,
  routes: readonly string[],
  f: typeof fetch = fetch,
): Promise<string[]> {
  const hrefs = new Set<string>();
  for (const route of routes) {
    const { html } = await fetchRoute(base, route, f);
    for (const href of internalHrefs(html)) hrefs.add(href);
  }
  const dead: string[] = [];
  for (const href of hrefs) {
    const { status } = await fetchRoute(base, href, f);
    if (status !== 200) dead.push(`${href} → ${status ?? 'no response'}`);
  }
  return dead;
}

/** For one CTA anchor id on one locale's page: `null` when the page answers 200 and carries the
 *  id, else a human-readable "what's missing" line. */
export async function missingCtaAnchor(
  base: string,
  locale: 'tr' | 'en',
  path: string,
  id: string,
  f: typeof fetch = fetch,
): Promise<string | null> {
  const { status, html } = await fetchRoute(base, path, f);
  if (status !== 200 || !hasElementId(html, id)) {
    return `${locale} ${path} → missing id="${id}" (status ${status ?? 'no response'})`;
  }
  return null;
}

/** A CTA link's `href` as `src/design/chrome/ctas.ts` declares it (next-intl's typed `Href`): an
 *  internal pathname, or an object with a `pathname` and an optional `hash` (`UrlObject`'s, so
 *  possibly `null`). Structural, so this module needs no next-intl import. */
export type CtaHref = string | { pathname: string; hash?: string | null };
export type CtaEntry = { primary: { href: CtaHref }; secondary?: { href: CtaHref } | null };
/** One in-page anchor a CTA link lands on: the table slot it came from, the internal pathname of
 *  the page that must render it, and the element id. */
export type CtaAnchorTarget = { source: string; pathname: string; id: string };

/** The page and element id a CTA href lands on, or `null` for a plain page link (no hash — its
 *  page answering 200 is the href sweep's job, not this one's). */
function anchorOf(href: CtaHref): { pathname: string; id: string } | null {
  const [pathname, hash = ''] =
    typeof href === 'string' ? href.split('#', 2) : [href.pathname, href.hash ?? ''];
  const id = hash.replace(/^#/, '');
  return id && pathname ? { pathname, id } : null;
}

/** W158: every in-page anchor a header CTA can land on — `DEFAULT_CTAS` (the CTA of every page
 *  without a table entry: Hire Workers itself, About, Careers, the legal pages, thank-you…) and
 *  every `CTA_BY_PATHNAME` entry, primary AND secondary. The page to check is the one the LINK
 *  points at (`href.pathname`), never the table key the entry sits under: identical for every
 *  entry today, but a cross-page CTA (a key whose link lands on another page's anchor) must be
 *  checked where it lands. */
export function ctaAnchorTargets(tables: {
  defaults: CtaEntry;
  byPathname: Partial<Record<string, CtaEntry>>;
}): CtaAnchorTarget[] {
  const entries: [string, CtaEntry | undefined][] = [
    ['DEFAULT_CTAS', tables.defaults],
    ...Object.entries(tables.byPathname).map(([key, entry]): [string, CtaEntry | undefined] => [
      `CTA_BY_PATHNAME['${key}']`,
      entry,
    ]),
  ];
  const out: CtaAnchorTarget[] = [];
  for (const [name, entry] of entries) {
    for (const slot of ['primary', 'secondary'] as const) {
      const link = entry?.[slot];
      const anchor = link ? anchorOf(link.href) : null;
      if (anchor) out.push({ source: `${name}.${slot}`, ...anchor });
    }
  }
  return out;
}

/** Every target whose id is absent from its page (or whose page does not answer 200), in both
 *  locales — `localize` maps the internal pathname to the locale's external path (the routing
 *  table, through next-intl's `getPathname`, in the launch check). One line per miss, naming
 *  the table slot and the anchor so the fix is obvious. */
export async function missingCtaAnchors(
  base: string,
  targets: readonly CtaAnchorTarget[],
  localize: (locale: 'tr' | 'en', pathname: string) => string,
  f: typeof fetch = fetch,
): Promise<string[]> {
  const missing: string[] = [];
  for (const target of targets) {
    for (const locale of ['tr', 'en'] as const) {
      const path = localize(locale, target.pathname);
      const line = await missingCtaAnchor(base, locale, path, target.id, f);
      if (line) missing.push(`${target.source} (${target.pathname}#${target.id}): ${line}`);
    }
  }
  return missing;
}
