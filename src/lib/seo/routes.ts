import { getPathname } from '@/i18n/navigation';
import { pathnames, routing, type Locale } from '@/i18n/routing';

/** Production origin; a trailing slash in the env value would double up in every URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.jobsadmire.com').replace(
  /\/$/,
  '',
);

/** The typed internal pathname `getPathname` accepts — a key of `pathnames`, or, for the
 *  dynamic routes, `{ pathname, params }`. */
export type Href = Parameters<typeof getPathname>[0]['href'];

/** A `pathnames` key with no dynamic segment — the only keys `getPathname` takes as a bare
 *  string. Exported for the sitemap/robots tests' type guards (W37). */
export type StaticPathname = Exclude<keyof typeof pathnames, `${string}[${string}`>;

/**
 * Internal pathnames that are never indexed: the conversion page (D13), the portal door, the
 * two newsletter one-shot pages, and — W4, until six Turkish article bodies exist — the blog
 * index and its articles. One set, two consumers (M-3): `app/sitemap.ts` excludes them and
 * `app/robots.ts` disallows their external form in both locales through
 * `robotsDisallowPaths(locale)` (below), which folds in `UNBUILT_PATHNAMES` so a robots rule
 * never names a path that does not exist yet. `noindexExternalPaths` is the same fold with no
 * UNBUILT subtraction — kept as the reference `routes.test.ts` pins `robotsDisallowPaths`
 * against; it has no production caller of its own. (`/api/` is disallowed literally there; it
 * is not a `pathnames` route.) Typed as keys, not `Href`s: '/blog/[slug]' is a key but not a
 * bare href, so never hand this set to `getPathname`/`absoluteUrl` directly — go through
 * `robotsDisallowPaths`. The blog flip back to index is a manual, reviewed step (T12/WP-C):
 * remove both entries here and nowhere else.
 */
export const NOINDEX_PATHNAMES = [
  '/thank-you',
  '/portal-login',
  '/newsletter/confirm',
  '/newsletter/unsubscribe',
  '/blog',
  '/blog/[slug]',
] as const satisfies readonly (keyof typeof pathnames)[];

export function isNoindexPathname(href: keyof typeof pathnames): boolean {
  return (NOINDEX_PATHNAMES as readonly string[]).includes(href);
}

/** The noindex set as localized external paths for robots.txt, deduped: a dynamic key is
 *  covered by its parent's prefix (`/blog/[slug]` → `/blog`), since robots matching is by
 *  prefix and a template can never be a real path. */
export function noindexExternalPaths(locale: Locale): string[] {
  const out = new Set<string>();
  for (const href of NOINDEX_PATHNAMES) {
    const key = (
      href.includes('[') ? href.slice(0, href.lastIndexOf('/')) : href
    ) as StaticPathname;
    out.add(getPathname({ locale, href: key }));
  }
  return [...out];
}

/** Absolute, locale-correct URL for an internal pathname. `getPathname` is synchronous when
 *  the locale is passed explicitly, and returns `/` for the TR root and `/en` for the EN one,
 *  so the TR root keeps its trailing slash and no other URL gains one. */
export function absoluteUrl(locale: Locale, href: Href): string {
  return `${SITE_URL}${getPathname({ locale, href })}`;
}

/** hreflang map for one page: both locales plus `x-default` = TR, self-reference included
 *  (a page missing its own locale here is a defect — docs/SEO.md). */
export function localeAlternates(href: Href): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = absoluteUrl(locale, href);
  languages['x-default'] = absoluteUrl(routing.defaultLocale, href);
  return { languages };
}

/**
 * W20 — internal pathnames that have NO page yet. `app/sitemap.ts` omits them and
 * `app/robots.ts` does not name them (a robots rule for a path that does not exist is exactly
 * the drift the `NOINDEX_PATHNAMES` comment above forbids). Each page task deletes its own key
 * in the commit that adds the page — `unbuilt.test.ts` walks `src/app/[locale]/**` and fails
 * whenever this set and the filesystem disagree in either direction; T15 asserts it is empty.
 */
export const UNBUILT_PATHNAMES: ReadonlySet<keyof typeof pathnames> = new Set<
  keyof typeof pathnames
>(['/blog', '/blog/[slug]']);

/**
 * W37 — what `app/robots.ts` disallows for one locale: `noindexExternalPaths(locale)` minus
 * every noindex key still in `UNBUILT_PATHNAMES`, de-duplicated. A robots rule must never name
 * a path that does not exist; the rule for a noindex page appears by itself in the commit that
 * builds the page and deletes its key. The subtraction runs per KEY, before the parent-prefix
 * fold, so a built `/blog` index stays disallowed while `/blog/[slug]` is still unbuilt (and
 * the other way round). `unbuilt` is injectable only so the unit test can prove the blog rule
 * without waiting for the blog page.
 */
export function robotsDisallowPaths(
  locale: Locale,
  unbuilt: ReadonlySet<keyof typeof pathnames> = UNBUILT_PATHNAMES,
): string[] {
  const out = new Set<string>();
  for (const href of NOINDEX_PATHNAMES) {
    if (unbuilt.has(href)) continue;
    const key = (
      href.includes('[') ? href.slice(0, href.lastIndexOf('/')) : href
    ) as StaticPathname;
    out.add(getPathname({ locale, href: key }));
  }
  return [...out];
}

/**
 * The page keys the OG image route renders (one cached PNG per key × locale): every
 * `PAGE_KEYS` entry the importer writes into `bundle.pages` (`src/content/collections.ts`,
 * 22 keys) plus `site`, the generic wordmark image an unknown key falls back to, so a page
 * whose record is not filled yet never 404s its image. `routes.test.ts` asserts the two lists
 * agree — a new page key is added to both in the same commit.
 */
export const OG_PAGE_KEYS: ReadonlySet<string> = new Set([
  'site',
  'home',
  'hire',
  'calc',
  'wp',
  'partner',
  'about',
  'contact',
  'workers',
  'stories',
  'verify',
  'careers',
  'careersDetail',
  'blog',
  'blogArticle',
  'portal',
  'privacy',
  'terms',
  'kvkk',
  'cookiePolicy',
  'thankYou',
  'newsletterConfirm',
  'newsletterUnsubscribe',
]);

/** Absolute URL of the generated Open Graph image for one page in one locale. The `.png`
 *  suffix is load-bearing: `proxy.ts`'s matcher skips any path with an extension, so the
 *  route under `app/og/` is never locale-rewritten (docs/ARCHITECTURE.md § Routing). */
export function pageOgImageUrl(locale: Locale, pageKey: string): string {
  return `${SITE_URL}/og/${locale}/${OG_PAGE_KEYS.has(pageKey) ? pageKey : 'site'}.png`;
}
