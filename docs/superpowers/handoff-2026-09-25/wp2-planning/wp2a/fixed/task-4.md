### Task 4: SEO foundation — OG image route, per-locale alternates, hreflang-aware language links, Article/JobPosting JSON-LD, sitemap/robots gating (W20/W31/W37/W38)

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website` (main @ ad58fb8, WP1 merged). Branch: the shared WP2a branch `wp2/foundation` (W22/W57). **Runs after Tasks 1, 2 and 3** and is written against the tree they leave: Task 3's `src/lib/seo/routes.ts` (`NOINDEX_PATHNAMES` with the two blog keys, `isNoindexPathname`, `noindexExternalPaths`, the exported `StaticPathname` type) and `src/app/robots.ts` (consumes `noindexExternalPaths`), Task 1's `src/lib/seo/metadata.ts` (`''` → fallback rule, its test appended inside `describe('buildMetadata')`) and `src/content/collections.ts` (`PAGE_KEYS`, 22 keys), Task 2's `src/messages/messages.test.ts` (tr/en key parity) and `vitest.config.mts` (`server-only` alias), Task 3's route groups `src/app/[locale]/(site)|(minimal)|(bare)/`. Every edit below is anchored on sentences/identifiers, never line numbers (W45).

Rulings in force: W4, W11, W17, W20, W23, W31, W37, W38, W45; R18 (browser facts through `useSyncExternalStore`, never setState-in-effect), R23 (SEO builders import `@/content/pure`, never the adapter), R56 (nothing under `src/**` imports `design-package/**` or `src/content/local/*`), R58 (`alternatePath` stays the fallback — this task adds the hreflang read on top, it does not remove it).

**What this task fixes (critique § foundation_fixes_first, "SEO foundation")**

- Every page's `og:image` is a 404 today (`/opengraph-image.png` does not exist) → a `next/og` route renders one PNG per page × locale from the bundle's page record; `buildMetadata` points `openGraph.images` and `twitter.images` at it.
- `localeAlternates(href)` emits the same slug for both locales, wrong for per-locale-slug detail pages (D16) → `buildMetadata` gains an `alternates` override.
- `LanguageSwitcher`/`LanguageHint` can only fall back to the parent index on a detail page → they now read the page's own `<link rel="alternate" hreflang>` tag in the browser (W17) and keep R58 as the fallback.
- No `Article`/`BlogPosting` or `JobPosting` builder exists → `articleJsonLd` + `jobPostingJsonLd`.
- The sitemap advertises 19 routes per locale that 404 and robots names paths that do not exist → `UNBUILT_PATHNAMES` (W20), consumed by the sitemap and, through `robotsDisallowPaths` (W37), by robots; a filesystem test forces every page task to delete its own entry; `DETAIL_SITEMAP_SOURCES` (W31) is the one door for blog/careers detail entries.
- `docs/PRD.md` § "Not yet built" (as reworded by Task 2) still lists OG image generation and the `Article`/`JobPosting` builders as missing → Task 4 appends the clause that they shipped (W45).

**Files**

Create:

- `src/lib/seo/sitemap-sources.ts`, `src/lib/seo/sitemap-sources.test.ts` (W31)
- `src/lib/seo/unbuilt.test.ts` (W20 filesystem test)
- `src/app/sitemap.test.ts`, `src/app/robots.test.ts`
- `src/lib/seo/og.ts`, `src/lib/seo/og.test.ts` (the pure OG copy readers, W38)
- `src/app/og/[locale]/[pageKey]/route.tsx`, `src/app/og/[locale]/[pageKey]/route.test.ts`
- `src/design/fonts/Archivo-Bold.ttf` (binary, 192,180 bytes — downloaded, Cycle 3), `src/design/fonts/OFL.txt` (SIL OFL 1.1, downloaded alongside), `src/design/fonts/README.md`, `src/design/fonts/fonts.test.ts`
- `src/design/chrome/use-alternate-path.ts`, `src/design/chrome/__tests__/use-alternate-path.test.ts`, `src/design/chrome/__tests__/LanguageSwitcher.test.tsx`

Modify (anchored on the text Tasks 1–3 leave):

- `src/lib/seo/routes.ts` — append after `localeAlternates` (`UNBUILT_PATHNAMES`, `robotsDisallowPaths`, `OG_PAGE_KEYS`, `pageOgImageUrl`); `StaticPathname` is already exported by Task 3 — no edit to it
- `src/lib/seo/routes.test.ts` — import list = the UNION of Task 3's names and Task 4's (W37); append three `describe`s
- `src/app/sitemap.ts` — whole file (async; `UNBUILT_PATHNAMES` excluded; `DETAIL_SITEMAP_SOURCES` awaited)
- `src/app/robots.ts` — whole file (consumes `robotsDisallowPaths`)
- `src/lib/seo/jsonld.ts` — first import line; append after `faqJsonLd`
- `src/lib/seo/jsonld.test.ts` — first two import lines; append at end of file
- `src/lib/seo/metadata.ts` — whole file (keeps Task 1's `''` → fallback lines verbatim)
- `src/lib/seo/metadata.test.ts` — first three import lines; append inside `describe('buildMetadata')` after Task 1's `''` case
- `src/messages/tr.json`, `src/messages/en.json` — new `sys.seo.ogTagline` (W38)
- `src/design/chrome/LanguageSwitcher.tsx` — whole file (WP1 base; no other WP2a task touches it)
- `src/design/chrome/LanguageHint.tsx` — imports, one hook line, the switch anchor, a `SWITCH` class constant (the outer `className` line Task 5 later edits for W18 is untouched)
- `src/design/chrome/__tests__/LanguageHint.test.tsx` — imports; append one `describe`
- `next.config.ts` — `outputFileTracingIncludes` for the OG route
- `e2e/seo.spec.ts` — append two tests at the end (Task 7 later rewrites the file and carries them, W37/W50)
- `docs/SEO.md` — § hreflang / x-default (new paragraph), § Sitemap (paragraph replaced), § Robots (paragraph replaced), § JSON-LD (first paragraph replaced, keeping Task 5's anchor sentence), § OG images (paragraph replaced)
- `docs/PRD.md` — § 11 "Not yet built, by design" sentence (Task 2's wording, amended + appended clause)
- `docs/ARCHITECTURE.md` — § Routing (one paragraph after the revalidate-route sentence), § Chrome (one paragraph after the `LanguageHint` stacking paragraph)
- `docs/CONTENT-MODEL.md` — § Bundle shape `pages` row (Task 1's note, appended), § Adding copy (Task 1's paragraph, appended), § Page records (appended sentence)

Test: the thirteen Vitest files named above (`unbuilt`, `routes`, `sitemap-sources`, `sitemap`, `robots`, `jsonld`, `og`, `route`, `fonts`, `metadata`, `use-alternate-path`, `LanguageSwitcher`, `LanguageHint`) plus two Playwright tests appended to `e2e/seo.spec.ts`. Every commit leaves `npm run verify` (tsc, eslint, prettier --check, vitest) green; every file below was formatted with the repo's Prettier config, type-checked and linted with the repo's `tsc`/`eslint` configs, and its tests were run once in an isolated mirror of the post-Task-3 tree (61 tests, 13 files, all green) before being written here.

**Interfaces**

Consumes (as built by WP1 and Tasks 1–3 — used unchanged):

- `pathnames`, `routing`, `locales`, `type Locale` from `@/i18n/routing` (22 internal keys; `routing.locales = ['tr','en']`, `routing.defaultLocale = 'tr'`; `localePrefix: 'as-needed'`).
- `getPathname`, `Link`, `usePathname`, `type Href` from `@/i18n/navigation`. next-intl's `Link` **always** prefixes when a `locale` prop is passed (`forcePrefix`), so the R58 fallback renders `/tr` for the Türkçe pill on an EN page and the middleware folds it to `/` — WP1 behaviour, asserted as such.
- From Task 3's `@/lib/seo/routes`: `SITE_URL`, `absoluteUrl(locale, href)`, `localeAlternates(href)`, `type Href`, `NOINDEX_PATHNAMES = ['/thank-you','/portal-login','/newsletter/confirm','/newsletter/unsubscribe','/blog','/blog/[slug]'] as const`, `isNoindexPathname(href)`, `noindexExternalPaths(locale): string[]` (localized, deduped, `/blog/[slug]` folded onto `/blog`), and `export type StaticPathname = Exclude<keyof typeof pathnames, \`${string}[${string}\`>` (Task 3 exports it with a doc comment; this task only consumes it).
- From Task 1's `@/content/collections`: `PAGE_KEYS` (`['home','hire','calc','wp','partner','about','contact','workers','stories','verify','careers','careersDetail','blog','blogArticle','portal','privacy','terms','kvkk','cookiePolicy','thankYou','newsletterConfirm','newsletterUnsubscribe'] as const`) — `bundle.pages` carries one record per key with `titleId`/`descriptionId` `''` where the package has no SEO string.
- From Task 1's `src/lib/seo/metadata.ts`: the two lines `const title = seo?.titleId ? t(seo.titleId) : args.fallbackTitle;` / `const description = seo?.descriptionId ? t(seo.descriptionId) : args.fallbackDescription;` and its test `uses the fallbacks when the page record's ids are ''` — kept verbatim (W38).
- `makeT(bundle)` from `@/content/pure` (throws on an unknown id outside production, returns `''` for a known empty one); `getBundle(locale)` from `@/content/adapter` (server-only, React `cache()`).
- `type Bundle`, `type Settings`, `BundleSchema` from `contract/website-bundle.v1`; `contract/website-bundle.v1.fixture.json` (TR, 20 strings, one page record `home = { titleId: 'home.017', descriptionId: 'home.018', ogImage: null, … }`; `home.017` = "İŞKUR lisanslı · sözleşmeler kurucu imzasıyla · işçiden ücret alınmaz", `home.018` = "Nitelikli işçi."; `settings.siteUrl = https://www.jobsadmire.com`).
- `alternatePath(internal)` from `src/design/chrome/alternate-path.ts` (R58).
- `renderWithIntl(ui, { locale? })` from `@/test/render`; `sys.languageHint.switch` = `"Switch to English"` in both message files; `src/messages/messages.test.ts` (Task 2) asserts tr/en key parity.
- `ImageResponse` from `next/og` (Next 16.3.5; `fonts: [{ name, data: Buffer | ArrayBuffer, weight, style }]`, options also accept `ResponseInit` headers). `NextConfig.outputFileTracingIncludes: Record<string, string[]>` (top-level in Next 16; keys are picomatch patterns matched with `contains: true` — `'/og/[locale]/[pageKey]'` matches the route, verified against `next/dist/build/collect-build-traces.js`).
- `tokens.color.navy '#0e1a37'`, `ink '#16202e'`, `sky '#7fd0f5'` — used as literals in the OG route (the route must stay free of the design barrel).
- Route groups (Task 3, W19): `src/app/[locale]/(site)/page.tsx`, `(site)/hire-workers/page.tsx`, `(site)/[...rest]/page.tsx`, `(site)/dev/gallery/page.tsx`, `(minimal)/thank-you/page.tsx` — the built keys are therefore `/`, `/hire-workers`, `/thank-you`.

Produces (frozen for WP2b — copy exactly):

```ts
// src/lib/seo/routes.ts (additions; SITE_URL/absoluteUrl/localeAlternates/NOINDEX_PATHNAMES/
//   isNoindexPathname/noindexExternalPaths unchanged from Task 3)
export type StaticPathname = Exclude<keyof typeof pathnames, `${string}[${string}`>; // exported by Task 3, unchanged
export const UNBUILT_PATHNAMES: ReadonlySet<keyof typeof pathnames>;
//   W20. Initial set (19): '/hiring-cost-calculator', '/partner-with-us', '/work-permit', '/about',
//   '/verify', '/careers', '/careers/[slug]', '/contact', '/available-workers', '/success-stories',
//   '/blog', '/blog/[slug]', '/portal-login', '/privacy', '/terms', '/kvkk', '/cookie-policy',
//   '/newsletter/confirm', '/newsletter/unsubscribe'.
//   Each page task DELETES its own key(s) in the commit that adds the page — src/lib/seo/unbuilt.test.ts
//   walks src/app/[locale]/**/page.tsx (route groups stripped) and fails when the set and the
//   filesystem disagree in either direction. T15 asserts the set is empty (Task 7's launch check).
export function robotsDisallowPaths(
  locale: Locale,
  unbuilt?: ReadonlySet<keyof typeof pathnames>, // default UNBUILT_PATHNAMES; tests only
): string[];
//   W37: noindexExternalPaths(locale) minus every NOINDEX key still in UNBUILT, deduped, subtracted
//   per key BEFORE the parent-prefix fold. app/robots.ts disallows ['/api/', ...tr, ...en] from it.
//   Today: ['/tesekkurler'] / ['/en/thank-you']; '/blog', '/portal-girisi', '/abone-onay',
//   '/abonelikten-cik' (and /en/…) appear by themselves when their page task deletes the key.
export const OG_PAGE_KEYS: ReadonlySet<string>;
//   'site' + every PAGE_KEYS entry (23): 'site','home','hire','calc','wp','partner','about','contact',
//   'workers','stories','verify','careers','careersDetail','blog','blogArticle','portal','privacy',
//   'terms','kvkk','cookiePolicy','thankYou','newsletterConfirm','newsletterUnsubscribe'.
//   routes.test.ts asserts OG_PAGE_KEYS === {'site', ...PAGE_KEYS}: a new page key is added to
//   PAGE_KEYS (Task 1) and here in the same commit. The `pageKey` a page passes to buildMetadata is
//   its PAGE_KEYS entry ('blogArticle' for /blog/[slug], 'careersDetail' for /careers/[slug]);
//   an unknown key renders the 'site' image.
export function pageOgImageUrl(locale: Locale, pageKey: string): string;
//   `${SITE_URL}/og/${locale}/${OG_PAGE_KEYS.has(pageKey) ? pageKey : 'site'}.png` — absolute.

// src/lib/seo/sitemap-sources.ts (W31)
export type SitemapSource = (locale: Locale) => Promise<MetadataRoute.Sitemap>;
export const DETAIL_SITEMAP_SOURCES: readonly SitemapSource[];   // Object.freeze([]) in the foundation (W70)
//   The careers page task edits the literal to add its imported openings source (one function, one
//   line, read from the bundle under its ISR tag; no runtime push — the array is frozen); blog joins
//   when it leaves NOINDEX (W4). Nothing else may add URLs.
export function detailSitemapEntries(locale: Locale, sources?: readonly SitemapSource[]): Promise<MetadataRoute.Sitemap>;
// src/app/sitemap.ts is now `async` and returns [...static (pathnames − NOINDEX − UNBUILT) × locales,
//   ...detailSitemapEntries(tr), ...detailSitemapEntries(en)].

// src/lib/seo/og.ts (pure, R23) — the OG copy readers the route wraps; page tasks do not call these
export type SysCopy = { t: (key: string) => string; has: (key: string) => boolean };
export const OG_WORDMARK = 'JobsAdmire'; export const OG_SUBLINE_MAX = 140;
export function ogTitle(bundle: Bundle, pageKey: string, sys: SysCopy): string;
//   record.titleId non-empty → t(titleId); else sys.seo.<pageKey>.title when present (W23); else the wordmark
export function ogSubline(bundle: Bundle, pageKey: string, sys: SysCopy): string;
//   record.descriptionId non-empty → t(descriptionId); else sys.seo.ogTagline (W38 — never home.188); word-clamped to 140
export function clampWords(text: string, max: number): string;

// src/messages/{tr,en}.json — new: sys.seo.ogTagline (the OG subline for a page whose record has no
//   description). Page tasks add their sys.seo.<pageKey>.{title,description} under the same `seo` object.

// src/app/og/[locale]/[pageKey]/route.tsx — GET /og/{tr|en}/{pageKey}.png → 1200×630 image/png,
//   Node runtime, `export const revalidate = 86400`, `Cache-Control: public, max-age=86400`,
//   Archivo Bold bytes from src/design/fonts/Archivo-Bold.ttf (vendored, OFL; fonts.test.ts pins the hash).
//   Title = ogTitle(), subline = ogSubline() (above). 404 for an unknown locale, a key outside
//   OG_PAGE_KEYS, or a missing `.png` suffix. The `.png` suffix is what keeps the URL out of
//   proxy.ts's matcher (`.*\..*`) — no matcher change. next.config.ts traces the font folder for it.

// src/lib/seo/metadata.ts
export type AlternateTarget = string | Exclude<Href, string>;
//   string = absolute URL or an already-localized external path ('/en/blog/x'); object = typed
//   dynamic Href ({ pathname: '/blog/[slug]', params: { slug } }) resolved for that locale.
//   A bare pathnames key as a string is NOT accepted (ambiguous) — static pages omit `alternates`.
export type MetadataOpenGraphOverride = {
  type?: 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  images?: string[]; // absolute; wins over the page record's ogImage and the generated route
};
export function buildMetadata(args: {
  locale: Locale;
  href: Href;
  bundle: Bundle;
  pageKey: string;              // a PAGE_KEYS entry
  fallbackTitle: string;        // the page's sys.seo.<pageKey>.title — used when the record's titleId is ''
  fallbackDescription: string;  // the page's sys.seo.<pageKey>.description — likewise
  alternates?: Partial<Record<Locale, AlternateTarget>>;
  openGraph?: MetadataOpenGraphOverride;
}): Metadata;
//   alternates given → languages = the given locales (+ the page's own locale from `href` when
//   omitted, self-reference is never optional) + x-default = tr when present else the page's own;
//   alternates omitted → localeAlternates(href) as in WP1.
//   openGraph.images: override → record.ogImage → pageOgImageUrl(locale, pageKey); twitter.images = same.
//   openGraph.type 'article' adds publishedTime/modifiedTime/authors; otherwise 'website'.

// src/lib/seo/jsonld.ts (additions; organizationJsonLd/websiteJsonLd/breadcrumbJsonLd/faqJsonLd unchanged)
export type ArticleJsonLdInput = {
  headline: string; description: string; url: string; image: string | string[];
  datePublished: string | Date; dateModified?: string | Date;
  authorName: string; authorType?: 'Person' | 'Organization';
  publisherSettings: Settings; locale: Locale;
};
export function articleJsonLd(input: ArticleJsonLdInput): BlogPosting node
//   { '@context','@type':'BlogPosting', headline, description, image, url,
//     mainEntityOfPage:{'@type':'WebPage','@id':url}, datePublished (ISO 8601), dateModified? (ISO),
//     author:{'@type':authorType??'Person', name}, publisher:{'@type':'Organization', name:'JobsAdmire',
//     url: settings.siteUrl, logo:{'@type':'ImageObject', url:`${siteUrl}/brand/ja-mark.png`}}, inLanguage: locale }
export type JobPostingJsonLdInput = {
  title: string; description: string; url: string;
  datePosted: string | Date; validThrough?: string | Date;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN' | 'OTHER';
  hiringOrganization: Settings;
  jobLocation: { city: string; country: string /* ISO-2 upper-case, W40 */ };
  baseSalary?: { currency: string; value: number | { min: number; max: number }; unitText: 'MONTH' | 'YEAR' | 'HOUR' };
  identifier?: string;
};
export function jobPostingJsonLd(input: JobPostingJsonLdInput): JobPosting node
//   { '@context','@type':'JobPosting', title, description, url, datePosted (ISO), validThrough? (ISO),
//     employmentType, hiringOrganization:{'@type':'Organization', name:'JobsAdmire', sameAs: siteUrl, logo},
//     jobLocation:{'@type':'Place', address:{'@type':'PostalAddress', addressLocality: city, addressCountry: country}},
//     baseSalary?:{'@type':'MonetaryAmount', currency, value:{'@type':'QuantitativeValue', value | minValue+maxValue, unitText}},
//     identifier?:{'@type':'PropertyValue', name:'JobsAdmire', value} }
//   Both builders: no key is ever `undefined` (compacted); an invalid date THROWS RangeError outside
//   production and is OMITTED in production (makeT's own dev-throw/prod-degrade rule).

// src/design/chrome/use-alternate-path.ts ('use client')
export function readAlternateHref(locale: Locale, doc?: Document): string | null; // the tag's href or null
export function alternateHrefToPath(href: string | null): string | null;        // pathname+search only; the host is dropped
export function useAlternatePath(locale: Locale): string | null;               // null on the server and until hydrated
// LanguageSwitcher / LanguageHint: props unchanged. When useAlternatePath(l) returns a path they render a
// next/link anchor to that path (W17); otherwise the WP1 next-intl <Link href={alternatePath(pathname)} locale={l}> (R58).

// next.config.ts — outputFileTracingIncludes: { '/og/[locale]/[pageKey]': ['./src/design/fonts/*.ttf'] }; nothing else changes.
```

---

- [ ] **Cycle 1 — `UNBUILT_PATHNAMES` + `robotsDisallowPaths` + `OG_PAGE_KEYS` + `pageOgImageUrl`; `DETAIL_SITEMAP_SOURCES`; sitemap and robots consume them (W20, W31, W37)**

- [ ] **Step 1: Write the failing tests**

`src/lib/seo/unbuilt.test.ts` (new):

```ts
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pathnames } from '@/i18n/routing';
import { UNBUILT_PATHNAMES } from './routes';

const APP_LOCALE_DIR = join(process.cwd(), 'src/app/[locale]');

/** Internal pathnames that have a `page.tsx` under `src/app/[locale]/`, with route-group
 *  segments (`(site)`, `(minimal)`, `(bare)`, W19) stripped — the app directory is keyed by
 *  the internal pathname; next-intl rewrites the external slug onto it. */
function builtKeys(dir = APP_LOCALE_DIR, prefix = ''): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) {
      if (name === 'page.tsx') out.push(prefix || '/');
      continue;
    }
    if (name.startsWith('_') || name.startsWith('@')) continue;
    const isGroup = name.startsWith('(') && name.endsWith(')');
    out.push(...builtKeys(full, isGroup ? prefix : `${prefix}/${name}`));
  }
  return out;
}

describe('UNBUILT_PATHNAMES (W20)', () => {
  it('is exactly the set of pathnames keys with no page.tsx yet — delete your key when your page lands', () => {
    const built = new Set(builtKeys());
    const expected = (Object.keys(pathnames) as (keyof typeof pathnames)[])
      .filter((key) => !built.has(key))
      .sort();
    expect([...UNBUILT_PATHNAMES].sort()).toEqual(expected);
  });

  it('only ever names pathnames keys', () => {
    for (const key of UNBUILT_PATHNAMES) expect(key in pathnames).toBe(true);
  });
});
```

`src/lib/seo/routes.test.ts` — replace the two import lines Task 3 left (`import { describe, expect, it } from 'vitest';` and `import { absoluteUrl, localeAlternates, NOINDEX_PATHNAMES, noindexExternalPaths } from './routes';`) with the UNION (W37):

```ts
import { describe, expect, it } from 'vitest';
import { PAGE_KEYS } from '@/content/collections';
import {
  absoluteUrl,
  localeAlternates,
  NOINDEX_PATHNAMES,
  noindexExternalPaths,
  OG_PAGE_KEYS,
  pageOgImageUrl,
  robotsDisallowPaths,
  UNBUILT_PATHNAMES,
} from './routes';
```

and append at the end of the file (after Task 3's `keeps the blog index and articles out of the index…` case's `describe` closes):

```ts
describe('robotsDisallowPaths (W20/W37)', () => {
  it('is noindexExternalPaths minus the unbuilt keys — today only the thank-you page', () => {
    // Guarded on the set itself so these cannot rot as page tasks delete their keys.
    const d = robotsDisallowPaths('tr');
    expect(d).toContain('/tesekkurler');
    if (UNBUILT_PATHNAMES.has('/portal-login')) expect(d).not.toContain('/portal-girisi');
    if (UNBUILT_PATHNAMES.has('/blog')) expect(d).not.toContain('/blog');
    for (const path of d) expect(noindexExternalPaths('tr')).toContain(path);
  });
  it('names the blog and the portal door once their pages exist (UNBUILT empty)', () => {
    expect(robotsDisallowPaths('tr', new Set())).toEqual(noindexExternalPaths('tr'));
    expect(robotsDisallowPaths('en', new Set())).toEqual(noindexExternalPaths('en'));
    expect(robotsDisallowPaths('en', new Set())).toContain('/en/blog');
  });
  it('subtracts per key, before the parent-prefix fold', () => {
    // /blog index built, articles not yet: the /blog prefix rule stays (it is a real path).
    expect(robotsDisallowPaths('tr', new Set(['/blog/[slug]']))).toContain('/blog');
    // Everything unbuilt: nothing to name.
    expect(robotsDisallowPaths('tr', new Set(NOINDEX_PATHNAMES))).toEqual([]);
  });
});

describe('pageOgImageUrl', () => {
  it('points at the generated PNG for a known page key, per locale', () => {
    expect(pageOgImageUrl('tr', 'home')).toBe('https://www.jobsadmire.com/og/tr/home.png');
    expect(pageOgImageUrl('en', 'hire')).toBe('https://www.jobsadmire.com/og/en/hire.png');
  });
  it('falls back to the site image for a key it does not know', () => {
    expect(OG_PAGE_KEYS.has('no-such-page')).toBe(false);
    expect(pageOgImageUrl('tr', 'no-such-page')).toBe('https://www.jobsadmire.com/og/tr/site.png');
  });
  it('is exactly PAGE_KEYS (every bundle.pages record the importer writes) plus `site`', () => {
    expect([...OG_PAGE_KEYS].sort()).toEqual(['site', ...PAGE_KEYS].sort());
  });
});
```

`src/lib/seo/sitemap-sources.test.ts` (new):

```ts
import { describe, expect, it } from 'vitest';
import {
  DETAIL_SITEMAP_SOURCES,
  detailSitemapEntries,
  type SitemapSource,
} from './sitemap-sources';

describe('DETAIL_SITEMAP_SOURCES (W31)', () => {
  it('is empty and frozen in the foundation — the careers page task edits the literal to add the first source (W70)', () => {
    expect(DETAIL_SITEMAP_SOURCES).toEqual([]);
    expect(Object.isFrozen(DETAIL_SITEMAP_SOURCES)).toBe(true);
  });

  it('concatenates every source for the locale, in registration order', async () => {
    const calls: string[] = [];
    const a: SitemapSource = async (locale) => {
      calls.push(`a:${locale}`);
      return [{ url: `https://www.jobsadmire.com/${locale}/a` }];
    };
    const b: SitemapSource = async (locale) => {
      calls.push(`b:${locale}`);
      return [
        { url: `https://www.jobsadmire.com/${locale}/b1` },
        { url: `https://www.jobsadmire.com/${locale}/b2` },
      ];
    };
    const entries = await detailSitemapEntries('en', [a, b]);
    expect(entries.map((e) => e.url)).toEqual([
      'https://www.jobsadmire.com/en/a',
      'https://www.jobsadmire.com/en/b1',
      'https://www.jobsadmire.com/en/b2',
    ]);
    expect(calls).toEqual(['a:en', 'b:en']);
    expect(await detailSitemapEntries('tr', [])).toEqual([]);
  });
});
```

`src/app/sitemap.test.ts` (new):

```ts
import { beforeAll, describe, expect, it } from 'vitest';
import sitemap from './sitemap';
import { pathnames, routing } from '@/i18n/routing';
import {
  absoluteUrl,
  NOINDEX_PATHNAMES,
  UNBUILT_PATHNAMES,
  type StaticPathname,
} from '@/lib/seo/routes';

const isStatic = (href: keyof typeof pathnames): href is StaticPathname => !href.includes('[');

let urls: string[] = [];
beforeAll(async () => {
  urls = (await sitemap()).map((entry) => entry.url);
});

describe('sitemap', () => {
  it('lists the built, indexable routes in both locales', () => {
    expect(urls).toContain('https://www.jobsadmire.com/');
    expect(urls).toContain('https://www.jobsadmire.com/en');
    expect(urls).toContain('https://www.jobsadmire.com/isci-talebi');
    expect(urls).toContain('https://www.jobsadmire.com/en/hire-workers');
  });

  it('omits every noindex route (M-3) and every unbuilt route (W20), in both locales', () => {
    const excluded = [...NOINDEX_PATHNAMES, ...UNBUILT_PATHNAMES].filter(isStatic);
    expect(excluded.length).toBeGreaterThan(0);
    for (const href of excluded)
      for (const locale of routing.locales) expect(urls).not.toContain(absoluteUrl(locale, href));
  });

  it('never emits a dynamic template', () => {
    for (const url of urls) expect(url).not.toContain('[');
  });

  it('is exactly (static keys − excluded) × locales while no detail source is registered', () => {
    const staticKeys = (Object.keys(pathnames) as (keyof typeof pathnames)[]).filter(
      (key) =>
        isStatic(key) &&
        !(NOINDEX_PATHNAMES as readonly string[]).includes(key) &&
        !UNBUILT_PATHNAMES.has(key),
    );
    expect(urls).toHaveLength(staticKeys.length * routing.locales.length);
  });
});
```

`src/app/robots.test.ts` (new):

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import robots from './robots';
import { routing } from '@/i18n/routing';
import { robotsDisallowPaths, UNBUILT_PATHNAMES } from '@/lib/seo/routes';

function disallow(): string[] {
  const rules = robots().rules;
  const rule = Array.isArray(rules) ? rules[0] : rules;
  const d = rule.disallow ?? [];
  return Array.isArray(d) ? d : [d];
}

describe('robots', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('disallows /api/ and robotsDisallowPaths() for both locales, and points at the sitemap', () => {
    const d = disallow();
    expect(d[0]).toBe('/api/');
    expect(d).toContain('/tesekkurler');
    expect(d).toContain('/en/thank-you');
    const expected = routing.locales.flatMap((locale) => robotsDisallowPaths(locale));
    expect(d.slice(1)).toEqual(expected);
    for (const path of d) expect(path).not.toContain('[');
    expect(robots().sitemap).toBe('https://www.jobsadmire.com/sitemap.xml');
  });

  it('never names a path that does not exist yet (W20)', () => {
    // Guarded on the set itself so this cannot rot when a page task builds the page and
    // deletes the key — the rule then appears by itself.
    const d = disallow();
    if (UNBUILT_PATHNAMES.has('/portal-login')) expect(d).not.toContain('/portal-girisi');
    if (UNBUILT_PATHNAMES.has('/blog')) expect(d).not.toContain('/blog');
    if (UNBUILT_PATHNAMES.has('/newsletter/confirm')) expect(d).not.toContain('/abone-onay');
  });

  it('blocks everything on a preview deployment', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(disallow()).toEqual(['/']);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```
npx vitest run src/lib/seo/unbuilt.test.ts src/lib/seo/routes.test.ts src/lib/seo/sitemap-sources.test.ts src/app/sitemap.test.ts src/app/robots.test.ts
```

Expected: `unbuilt.test.ts`, `routes.test.ts`, `sitemap.test.ts`, `robots.test.ts` fail at import — `SyntaxError: The requested module './routes' does not provide an export named 'UNBUILT_PATHNAMES'` (vitest reports each as a failed suite; Task 3's four `routes.test.ts` cases are not reached); `sitemap-sources.test.ts` fails with `Failed to load url ./sitemap-sources`.

- [ ] **Step 3: Implement**

`src/lib/seo/routes.ts` — one anchored edit on Task 3's file (`StaticPathname` is already `export`ed there with its doc comment — do not touch that line):

1. Append after `localeAlternates` (end of file):

```ts

/**
 * W20 — internal pathnames that have NO page yet. `app/sitemap.ts` omits them and
 * `app/robots.ts` does not name them (a robots rule for a path that does not exist is exactly
 * the drift the `NOINDEX_PATHNAMES` comment above forbids). Each page task deletes its own key
 * in the commit that adds the page — `unbuilt.test.ts` walks `src/app/[locale]/**` and fails
 * whenever this set and the filesystem disagree in either direction; T15 asserts it is empty.
 */
export const UNBUILT_PATHNAMES: ReadonlySet<keyof typeof pathnames> = new Set<
  keyof typeof pathnames
>([
  '/hiring-cost-calculator',
  '/partner-with-us',
  '/work-permit',
  '/about',
  '/verify',
  '/careers',
  '/careers/[slug]',
  '/contact',
  '/available-workers',
  '/success-stories',
  '/blog',
  '/blog/[slug]',
  '/portal-login',
  '/privacy',
  '/terms',
  '/kvkk',
  '/cookie-policy',
  '/newsletter/confirm',
  '/newsletter/unsubscribe',
]);

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
```

(`getPathname`, `pathnames`, `routing`, `Locale` are already imported at the top of Task 3's file — no import change.)

`src/lib/seo/sitemap-sources.ts` (new):

```ts
import type { MetadataRoute } from 'next';
import type { Locale } from '@/i18n/routing';

/** One detail-page sitemap source: the entries for one locale, read from the bundle or the
 *  Operations feed under that content's ISR tag (docs/SEO.md § Sitemap). */
export type SitemapSource = (locale: Locale) => Promise<MetadataRoute.Sitemap>;

/**
 * W31 — the detail entries `app/sitemap.ts` appends after the static routes. Empty in the
 * foundation: the careers page task edits this literal to add its imported openings source (one
 * function, one line — no runtime push, the array is frozen, W70); blog stays out while `/blog`
 * is noindex (W4) and joins when the Turkish threshold is met.
 * Nothing else may add sitemap URLs — the static table is the other, only, source.
 */
export const DETAIL_SITEMAP_SOURCES: readonly SitemapSource[] = Object.freeze([]);

/** Every source's entries for one locale, in registration order. */
export async function detailSitemapEntries(
  locale: Locale,
  sources: readonly SitemapSource[] = DETAIL_SITEMAP_SOURCES,
): Promise<MetadataRoute.Sitemap> {
  const lists = await Promise.all(sources.map((source) => source(locale)));
  return lists.flat();
}
```

`src/app/sitemap.ts` — whole file:

```ts
import type { MetadataRoute } from 'next';
import { pathnames, routing } from '@/i18n/routing';
import {
  absoluteUrl,
  localeAlternates,
  NOINDEX_PATHNAMES,
  UNBUILT_PATHNAMES,
  type StaticPathname,
} from '@/lib/seo/routes';
import { detailSitemapEntries } from '@/lib/seo/sitemap-sources';

export const revalidate = 900;

/** Listed nowhere: the never-indexed set `robots.ts` disallows (`NOINDEX_PATHNAMES`, M-3) plus
 *  the routes that have no page yet (`UNBUILT_PATHNAMES`, W20) — both from `routes.ts`, never a
 *  second copy here. */
const EXCLUDED: ReadonlySet<string> = new Set<string>([...NOINDEX_PATHNAMES, ...UNBUILT_PATHNAMES]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes here; the dynamic keys are filtered by pattern. Detail entries (careers
  // openings; blog once it leaves noindex, W4) come from DETAIL_SITEMAP_SOURCES (W31), read
  // from the bundle under their own ISR tags.
  const hrefs = (Object.keys(pathnames) as (keyof typeof pathnames)[]).filter(
    (href): href is StaticPathname => !href.includes('[') && !EXCLUDED.has(href),
  );
  const statics = routing.locales.flatMap((locale) =>
    hrefs.map((href) => ({
      url: absoluteUrl(locale, href),
      alternates: localeAlternates(href),
      changeFrequency: 'weekly' as const,
      priority: href === '/' ? 1 : 0.7,
    })),
  );
  const details = await Promise.all(routing.locales.map((locale) => detailSitemapEntries(locale)));
  return [...statics, ...details.flat()];
}
```

`src/app/robots.ts` — whole file (Task 3's file with `noindexExternalPaths` → `robotsDisallowPaths` and the comment extended):

```ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { robotsDisallowPaths, SITE_URL } from '@/lib/seo/routes';

export default function robots(): MetadataRoute.Robots {
  // Previews are additionally protected by Vercel Deployment Protection — robots is a hint,
  // not access control (docs/SEO.md).
  const preview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  return preview
    ? { rules: { userAgent: '*', disallow: '/' } }
    : {
        rules: {
          userAgent: '*',
          allow: '/',
          // `/api/` is literal — it is not a `pathnames` route. Everything else is derived
          // from the one `NOINDEX_PATHNAMES` set the sitemap excludes (M-3), in both locales,
          // minus the routes that have no page yet (`UNBUILT_PATHNAMES`, W20): a rule must
          // never name a path that does not exist. A page task deletes its key and the rule
          // appears here on its own.
          disallow: ['/api/', ...routing.locales.flatMap((locale) => robotsDisallowPaths(locale))],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
      };
}
```

- [ ] **Step 4: Run the tests + verify**

```
npx prettier --write src/lib/seo src/app/sitemap.ts src/app/sitemap.test.ts src/app/robots.ts src/app/robots.test.ts
npx vitest run src/lib/seo src/app/sitemap.test.ts src/app/robots.test.ts
npm run verify
```

Expected: `unbuilt` 2, `routes` 10 (4 existing + 3 robotsDisallowPaths + 3 pageOgImageUrl), `sitemap-sources` 2, `sitemap` 4, `robots` 3 — all green; `npm run verify` green. If `unbuilt.test.ts` reports a difference, the filesystem is right and the set is wrong — fix the set, never the walker (`(group)` folders are stripped; `[...rest]` and `dev/gallery` are walked but are not `pathnames` keys, so they never count). If the `OG_PAGE_KEYS === {'site', …PAGE_KEYS}` case fails, Task 1's `PAGE_KEYS` changed — mirror it in `OG_PAGE_KEYS`.

- [ ] **Step 5: Commit**

```
git add src/lib/seo/routes.ts src/lib/seo/routes.test.ts src/lib/seo/unbuilt.test.ts src/lib/seo/sitemap-sources.ts src/lib/seo/sitemap-sources.test.ts src/app/sitemap.ts src/app/sitemap.test.ts src/app/robots.ts src/app/robots.test.ts
git commit -m "feat(seo): gate sitemap and robots on UNBUILT_PATHNAMES (W20/W37); DETAIL_SITEMAP_SOURCES (W31); OG page keys

The sitemap advertised 19 routes per locale that 404 through the catch-all and robots named
paths that do not exist. UNBUILT_PATHNAMES lists them once; the sitemap omits them, robots
disallows robotsDisallowPaths() (noindex minus unbuilt), and a filesystem test forces every
page task to delete its own key. Detail sitemap entries get one door: DETAIL_SITEMAP_SOURCES.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 2 — `articleJsonLd` + `jobPostingJsonLd`**

- [ ] **Step 1: Write the failing tests**

`src/lib/seo/jsonld.test.ts` — replace the first two lines (`import { describe, expect, it } from 'vitest';` / `import { faqJsonLd, organizationJsonLd } from './jsonld';`) with:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { articleJsonLd, faqJsonLd, jobPostingJsonLd, organizationJsonLd } from './jsonld';
```

and append at the end of the file (after the existing `describe('jsonld', …)` closes; `settings` is the const the file already defines):

```ts
/** Deep check: JSON-LD is serialised with JSON.stringify, which silently drops `undefined`
 *  values — but a consumer reading the object (a test, a future validator) must never see one. */
function assertNoUndefined(node: unknown, path = '$'): void {
  if (node === undefined) throw new Error(`undefined at ${path}`);
  if (Array.isArray(node)) node.forEach((v, i) => assertNoUndefined(v, `${path}[${i}]`));
  else if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node)) assertNoUndefined(v, `${path}.${k}`);
}

describe('articleJsonLd', () => {
  const input = {
    headline: 'Sezonluk işgücü planı',
    description: 'Özet',
    url: 'https://www.jobsadmire.com/blog/sezonluk-isgucu',
    image: 'https://www.jobsadmire.com/og/tr/blogArticle.png',
    datePublished: '2026-01-12',
    dateModified: new Date('2026-02-01T10:00:00Z'),
    authorName: 'JobsAdmire Editorial',
    publisherSettings: settings,
    locale: 'tr' as const,
  };

  it('is a BlogPosting carrying the schema.org required fields with ISO dates', () => {
    const a = articleJsonLd(input);
    expect(a['@type']).toBe('BlogPosting');
    expect(a.headline).toBe(input.headline);
    expect(a.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': input.url });
    expect(a.datePublished).toBe('2026-01-12T00:00:00.000Z');
    expect(a.dateModified).toBe('2026-02-01T10:00:00.000Z');
    expect(a.author).toEqual({ '@type': 'Person', name: input.authorName });
    expect(a.publisher.logo.url).toBe(`${settings.siteUrl}/brand/ja-mark.png`);
    expect(a.inLanguage).toBe('tr');
    assertNoUndefined(a);
  });

  it('carries no undefined keys when the optional fields are absent', () => {
    const required = { ...input, dateModified: undefined };
    const a = articleJsonLd(required);
    expect('dateModified' in a).toBe(false);
    assertNoUndefined(a);
  });

  it('accepts an Organization author', () => {
    expect(articleJsonLd({ ...input, authorType: 'Organization' }).author['@type']).toBe(
      'Organization',
    );
  });

  it('rejects an invalid date outside production', () => {
    expect(() => articleJsonLd({ ...input, datePublished: 'not-a-date' })).toThrow(RangeError);
  });
});

describe('jobPostingJsonLd', () => {
  afterEach(() => vi.unstubAllEnvs());

  const input = {
    title: 'Sales Executive (Antalya)',
    description: 'Description',
    url: 'https://www.jobsadmire.com/en/careers/sales-executive-antalya',
    datePosted: '2026-03-01',
    employmentType: 'FULL_TIME' as const,
    hiringOrganization: settings,
    jobLocation: { city: 'Antalya', country: 'TR' },
  };

  it('is a JobPosting with title, description, datePosted, hiringOrganization and jobLocation', () => {
    const j = jobPostingJsonLd(input);
    expect(j['@type']).toBe('JobPosting');
    expect(j.datePosted).toBe('2026-03-01T00:00:00.000Z');
    expect(j.employmentType).toBe('FULL_TIME');
    expect(j.hiringOrganization).toMatchObject({ '@type': 'Organization', name: 'JobsAdmire' });
    expect(j.jobLocation.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Antalya',
      addressCountry: 'TR',
    });
    expect('validThrough' in j).toBe(false);
    expect('baseSalary' in j).toBe(false);
    assertNoUndefined(j);
  });

  it('renders validThrough, a salary range and an identifier when given', () => {
    const j = jobPostingJsonLd({
      ...input,
      validThrough: new Date('2026-04-30T23:59:59Z'),
      baseSalary: { currency: 'TRY', value: { min: 40000, max: 55000 }, unitText: 'MONTH' },
      identifier: 'sales-executive-antalya',
    });
    expect(j.validThrough).toBe('2026-04-30T23:59:59.000Z');
    expect(j.baseSalary).toEqual({
      '@type': 'MonetaryAmount',
      currency: 'TRY',
      value: { '@type': 'QuantitativeValue', minValue: 40000, maxValue: 55000, unitText: 'MONTH' },
    });
    expect(j.identifier).toEqual({
      '@type': 'PropertyValue',
      name: 'JobsAdmire',
      value: 'sales-executive-antalya',
    });
    assertNoUndefined(j);
  });

  it('renders a single salary value as `value`', () => {
    const j = jobPostingJsonLd({
      ...input,
      baseSalary: { currency: 'TRY', value: 45000, unitText: 'MONTH' },
    });
    expect(j.baseSalary?.value).toEqual({
      '@type': 'QuantitativeValue',
      value: 45000,
      unitText: 'MONTH',
    });
  });

  it('omits an invalid date in production instead of crashing the page', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const j = jobPostingJsonLd({ ...input, validThrough: 'never' });
    expect('validThrough' in j).toBe(false);
    assertNoUndefined(j);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```
npx vitest run src/lib/seo/jsonld.test.ts
```

Expected: suite fails at import — `SyntaxError: The requested module './jsonld' does not provide an export named 'articleJsonLd'`.

- [ ] **Step 3: Implement**

`src/lib/seo/jsonld.ts` — replace the first line (`import type { Settings } from '../../../contract/website-bundle.v1';`) with:

```ts
import type { Locale } from '@/i18n/routing';
import type { Settings } from '../../../contract/website-bundle.v1';
```

and append at the end of the file (after `faqJsonLd`):

```ts

/** Drops `undefined`-valued keys so a node never carries one — JSON.stringify would hide it,
 *  a validator or a test would not. Shallow: nested nodes are built through this too. */
function compact<T extends Record<string, unknown>>(node: T): T {
  return Object.fromEntries(Object.entries(node).filter(([, v]) => v !== undefined)) as T;
}

/** ISO 8601 for a schema.org date field. makeT's rule: an invalid value THROWS outside
 *  production (a data defect must fail the page locally) and is OMITTED in production (a bad
 *  CMS date must not take the page down — the node is merely less rich). */
function isoDate(value: string | Date | undefined, field: string): string | undefined {
  if (value === undefined) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    if (process.env.NODE_ENV !== 'production')
      throw new RangeError(`jsonld: ${field} is not a valid date: ${String(value)}`);
    return undefined;
  }
  return d.toISOString();
}

const publisherNode = (s: Settings) => ({
  '@type': 'Organization' as const,
  name: 'JobsAdmire',
  url: s.siteUrl,
  logo: { '@type': 'ImageObject' as const, url: `${s.siteUrl}/brand/ja-mark.png` },
});

export type ArticleJsonLdInput = {
  headline: string;
  description: string;
  url: string;
  image: string | string[];
  datePublished: string | Date;
  dateModified?: string | Date;
  authorName: string;
  authorType?: 'Person' | 'Organization';
  publisherSettings: Settings;
  locale: Locale;
};

/** Blog article pages only (docs/SEO.md § JSON-LD): a BlogPosting with the fields Google's
 *  article rich result reads. `url` is the page's canonical; `image` the OG image. */
export function articleJsonLd(input: ArticleJsonLdInput) {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting' as const,
    headline: input.headline,
    description: input.description,
    image: input.image,
    url: input.url,
    mainEntityOfPage: { '@type': 'WebPage' as const, '@id': input.url },
    datePublished: isoDate(input.datePublished, 'datePublished'),
    dateModified: isoDate(input.dateModified, 'dateModified'),
    author: { '@type': input.authorType ?? ('Person' as const), name: input.authorName },
    publisher: publisherNode(input.publisherSettings),
    inLanguage: input.locale,
  });
}

export type JobPostingJsonLdInput = {
  title: string;
  description: string;
  url: string;
  datePosted: string | Date;
  validThrough?: string | Date;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN' | 'OTHER';
  hiringOrganization: Settings;
  /** `country` is ISO-2 upper-case (`TR`, `PK`, W40) — the value the careers catalog carries. */
  jobLocation: { city: string; country: string };
  baseSalary?: {
    currency: string;
    value: number | { min: number; max: number };
    unitText: 'MONTH' | 'YEAR' | 'HOUR';
  };
  identifier?: string;
};

/** Careers DETAIL pages only, never the index (D15, docs/SEO.md § JSON-LD). */
export function jobPostingJsonLd(input: JobPostingJsonLdInput) {
  const s = input.hiringOrganization;
  const salary = input.baseSalary;
  return compact({
    '@context': 'https://schema.org',
    '@type': 'JobPosting' as const,
    title: input.title,
    description: input.description,
    url: input.url,
    datePosted: isoDate(input.datePosted, 'datePosted'),
    validThrough: isoDate(input.validThrough, 'validThrough'),
    employmentType: input.employmentType,
    hiringOrganization: {
      '@type': 'Organization' as const,
      name: 'JobsAdmire',
      sameAs: s.siteUrl,
      logo: `${s.siteUrl}/brand/ja-mark.png`,
    },
    jobLocation: {
      '@type': 'Place' as const,
      address: {
        '@type': 'PostalAddress' as const,
        addressLocality: input.jobLocation.city,
        addressCountry: input.jobLocation.country,
      },
    },
    baseSalary: salary
      ? {
          '@type': 'MonetaryAmount' as const,
          currency: salary.currency,
          value:
            typeof salary.value === 'number'
              ? {
                  '@type': 'QuantitativeValue' as const,
                  value: salary.value,
                  unitText: salary.unitText,
                }
              : {
                  '@type': 'QuantitativeValue' as const,
                  minValue: salary.value.min,
                  maxValue: salary.value.max,
                  unitText: salary.unitText,
                },
        }
      : undefined,
    identifier: input.identifier
      ? { '@type': 'PropertyValue' as const, name: 'JobsAdmire', value: input.identifier }
      : undefined,
  });
}
```

Note on typing: `compact` returns `T`, so `'validThrough' in j` and `j.baseSalary?.value` type-check; the runtime object simply lacks the key. The `{ ...input, dateModified: undefined }` test row exercises the compaction of an explicitly-undefined optional (no `_omit` destructure, so no unused-var lint question).

- [ ] **Step 4: Run the tests + verify**

```
npx prettier --write src/lib/seo/jsonld.ts src/lib/seo/jsonld.test.ts
npx vitest run src/lib/seo/jsonld.test.ts
npm run verify
```

Expected: 10 tests green (2 existing + 4 article + 4 job posting); verify green.

- [ ] **Step 5: Commit**

```
git add src/lib/seo/jsonld.ts src/lib/seo/jsonld.test.ts
git commit -m "feat(seo): articleJsonLd (BlogPosting) and jobPostingJsonLd builders

schema.org required fields, ISO 8601 dates, no undefined keys; an invalid date throws outside
production and is omitted in production, the same rule makeT applies to an unknown id.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 3 — Archivo Bold font asset, the pure OG copy readers (W38), the `next/og` image route, `sys.seo.ogTagline`, the OG route e2e**

Why a `.ttf` in the repo: `next/font/google` (the locale layout, `src/app/[locale]/layout.tsx`) self-hosts Archivo as woff2 inside `.next/` at build time — those bytes are not readable by a route handler, and Satori (the renderer behind `ImageResponse`) reads TTF/OTF/WOFF, not woff2. Google's own `ofl/archivo` ships only the variable font (`Archivo[wdth,wght].ttf`), which Satori would render at its default instance (Regular), not Bold. The upstream Omnibus-Type repository ships static instances; **Archivo-Bold.ttf** there is 192,180 bytes, licensed under the SIL OFL 1.1 (same licence as the Google Fonts copy). Both hashes below were re-verified against upstream on 2026-09-20.

- [ ] **Step 1: Write the failing tests**

`src/design/fonts/fonts.test.ts` (new):

```ts
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIR = join(process.cwd(), 'src/design/fonts');

describe('src/design/fonts (OG image font bytes)', () => {
  it('ships the static Archivo Bold instance the OG route reads, byte-exact', () => {
    const bytes = readFileSync(join(DIR, 'Archivo-Bold.ttf'));
    // TrueType magic — not an HTML error page saved as .ttf
    expect(bytes.subarray(0, 4)).toEqual(Buffer.from([0x00, 0x01, 0x00, 0x00]));
    expect(bytes.length).toBe(192180);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(
      '951a0ebab63b1bb0d90a26c27625bda803d570dace3851fa2f1eea65852d8983',
    );
  });

  it('ships the licence next to the font', () => {
    const ofl = readFileSync(join(DIR, 'OFL.txt'), 'utf8');
    expect(ofl).toContain('SIL Open Font License, Version 1.1');
    expect(ofl).toContain('Archivo');
    expect(createHash('sha256').update(ofl).digest('hex')).toBe(
      '108b4e57c9c796d3d38d0428ca7ee39de47ad93187302718d9b2d8864b9b716b',
    );
  });
});
```

`src/lib/seo/og.test.ts` (new — the TR fixture's actual text, and only ids the fixture carries, W38):

```ts
import { describe, expect, it } from 'vitest';
import { clampWords, OG_WORDMARK, ogSubline, ogTitle, type SysCopy } from './og';
import fixture from '../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema } from '../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. The golden fixture carries one page record (`home` →
// home.017/home.018) and both of those strings, which is every package id the OG copy reads.
const bundle = BundleSchema.parse(fixture);

/** A `sys` stub over a flat key → value map: `has` is membership, `t` returns the value. */
const sysOf = (messages: Record<string, string>): SysCopy => ({
  t: (key) => messages[key] ?? `MISSING:${key}`,
  has: (key) => key in messages,
});
const sys = sysOf({
  'seo.ogTagline': 'Lisanslı iş gücü temini — uçtan uca.',
  'seo.calc.title': 'İşçi maliyeti hesaplayıcı',
});

describe('ogTitle', () => {
  it('reads the page record when the package has an SEO string', () => {
    expect(ogTitle(bundle, 'home', sys)).toBe(
      'İŞKUR lisanslı · sözleşmeler kurucu imzasıyla · işçiden ücret alınmaz',
    );
  });
  it("falls back to sys.seo.<pageKey>.title when the record's titleId is '' (W38)", () => {
    const blank = {
      ...bundle,
      pages: { calc: { ...bundle.pages.home, titleId: '', descriptionId: '' } },
    };
    expect(ogTitle(blank, 'calc', sys)).toBe('İşçi maliyeti hesaplayıcı');
  });
  it('falls back to the wordmark when there is neither a record nor a sys title', () => {
    expect(ogTitle(bundle, 'hire', sys)).toBe(OG_WORDMARK);
    expect(ogTitle(bundle, 'calc', sysOf({}))).toBe(OG_WORDMARK);
  });
});

describe('ogSubline', () => {
  it("reads the record's description, else the site tagline — never home.188 (W38)", () => {
    expect(ogSubline(bundle, 'home', sys)).toBe('Nitelikli işçi.');
    expect(ogSubline(bundle, 'hire', sys)).toBe('Lisanslı iş gücü temini — uçtan uca.');
    const blank = { ...bundle, pages: { home: { ...bundle.pages.home, descriptionId: '' } } };
    expect(ogSubline(blank, 'home', sys)).toBe('Lisanslı iş gücü temini — uçtan uca.');
  });
  it('clamps a long description at a word boundary', () => {
    const long = { ...bundle, strings: { ...bundle.strings, 'home.018': 'kelime '.repeat(40) } };
    const out = ogSubline(long, 'home', sys);
    expect(out.length).toBeLessThanOrEqual(141);
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toContain('kelim…');
  });
});

describe('clampWords', () => {
  it('returns short text untouched, cuts at the last space otherwise', () => {
    expect(clampWords('short', 10)).toBe('short');
    expect(clampWords('one two three four', 10)).toBe('one two…');
    expect(clampWords('averyveryverylongsingleword next', 12)).toBe('averyveryver…');
  });
});
```

`src/app/og/[locale]/[pageKey]/route.test.ts` (new):

```ts
// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

// The renderer is mocked: this test proves the handler's contract (validation, cache
// contract, content-type, font bytes handed over) without rasterising anything.
const seen = vi.hoisted(() => ({
  calls: [] as { element: unknown; options: Record<string, unknown> }[],
}));

vi.mock('next/og', () => ({
  ImageResponse: class extends Response {
    constructor(element: unknown, options: Record<string, unknown>) {
      super(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), {
        status: 200,
        headers: { 'content-type': 'image/png' },
      });
      seen.calls.push({ element, options });
    }
  },
}));

// `@/content/adapter` is `server-only` and loads the generated bundles; the route gets the
// parsed golden fixture instead (R13/R23) — one page record (`home`), 20 strings.
vi.mock('@/content/adapter', async () => {
  const { BundleSchema } = await import('../../../../../contract/website-bundle.v1');
  const fixture = (await import('../../../../../contract/website-bundle.v1.fixture.json')).default;
  const bundle = BundleSchema.parse(fixture);
  return { getBundle: async () => bundle };
});

// `getTranslations` needs a request scope; the route only calls `has()` and `t()` on `sys`.
vi.mock('next-intl/server', () => ({
  getTranslations: async () =>
    Object.assign((key: string) => `sys:${key}`, {
      has: (key: string) => key === 'seo.calc.title',
    }),
}));

import { GET } from './route';

const ctx = (locale: string, pageKey: string) => ({ params: Promise.resolve({ locale, pageKey }) });
const req = new Request('https://www.jobsadmire.com/og/tr/home.png');
const lastElement = () => JSON.stringify(seen.calls.at(-1)!.element);

describe('GET /og/[locale]/[pageKey]', () => {
  it('answers a PNG for a known page in a known locale, from the bundle page record', async () => {
    const res = await GET(req, ctx('tr', 'home.png'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    const last = seen.calls.at(-1)!;
    // home.017 / home.018 of the TR fixture — the record's own SEO strings
    expect(lastElement()).toContain(
      'İŞKUR lisanslı · sözleşmeler kurucu imzasıyla · işçiden ücret alınmaz',
    );
    expect(lastElement()).toContain('Nitelikli işçi.');
    const fonts = last.options.fonts as { name: string; weight: number; data: Buffer }[];
    expect(fonts[0].name).toBe('Archivo');
    expect(fonts[0].weight).toBe(700);
    expect(fonts[0].data.length).toBe(192180);
    expect(last.options.width).toBe(1200);
    expect(last.options.height).toBe(630);
    expect(last.options.headers).toEqual({ 'Cache-Control': 'public, max-age=86400' });
  });

  it('falls back to sys.seo.<pageKey>.title, then the wordmark; subline = sys.seo.ogTagline (W38)', async () => {
    await GET(req, ctx('en', 'calc.png'));
    expect(lastElement()).toContain('sys:seo.calc.title');
    expect(lastElement()).toContain('sys:seo.ogTagline');
    await GET(req, ctx('en', 'hire.png'));
    expect(lastElement()).not.toContain('sys:seo.hire.title');
    expect(lastElement()).toContain('sys:seo.ogTagline');
    // the wordmark header plus the title fallback — never home.188
    expect(lastElement().match(/JobsAdmire/g)).toHaveLength(2);
    expect(lastElement()).not.toContain('home.188');
  });

  it('404s an unknown locale, a key outside OG_PAGE_KEYS, and a missing .png suffix', async () => {
    const before = seen.calls.length;
    expect((await GET(req, ctx('de', 'home.png'))).status).toBe(404);
    expect((await GET(req, ctx('tr', 'nope.png'))).status).toBe(404);
    expect((await GET(req, ctx('tr', 'home'))).status).toBe(404);
    expect((await GET(req, ctx('tr', 'home.jpg'))).status).toBe(404);
    expect(seen.calls.length).toBe(before);
  });
});
```

`e2e/seo.spec.ts` — append at the end of the file (after the `every page carries the Organization/EmploymentAgency node` test; `ORIGIN` is the const the file defines at the top):

```ts

test('the OG image route answers a PNG, is not locale-rewritten and rejects unknown keys', async ({
  request,
}) => {
  // Same host as the page under test, not ORIGIN: proves the route renders here, with its font.
  const res = await request.get('/og/tr/home.png');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
  expect((await res.body()).subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  expect((await request.get('/og/en/hire.png')).status()).toBe(200);
  expect((await request.get('/og/tr/not-a-page.png')).status()).toBe(404);
  expect((await request.get('/og/de/home.png')).status()).toBe(404);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```
npx vitest run src/design/fonts/fonts.test.ts src/lib/seo/og.test.ts "src/app/og/[locale]/[pageKey]/route.test.ts"
```

Expected: `fonts.test.ts` — `ENOENT: no such file or directory, open '.../src/design/fonts/Archivo-Bold.ttf'`; `og.test.ts` — `Failed to load url ./og`; `route.test.ts` — `Failed to load url ./route`.

The e2e red run needs a server (one build at a time — Mac Studio memory rule; nothing else may be building):

```
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/seo.spec.ts --project=desktop -g "OG image route"
kill $(cat /tmp/next.pid)
```

Expected: the new test fails — `expect(received).toBe(expected) // Expected: 200, Received: 404` on `/og/tr/home.png` (no route yet; the `.png` path is skipped by the proxy and answered by Next's 404).

- [ ] **Step 3: Implement**

Download the font and its licence (repo root; the checksums are the ones the test pins — a mismatch means the upstream file changed: stop and report rather than re-pinning):

```sh
mkdir -p src/design/fonts
curl -fsSL -o src/design/fonts/Archivo-Bold.ttf \
  https://raw.githubusercontent.com/Omnibus-Type/Archivo/master/fonts/ttf/Archivo-Bold.ttf
curl -fsSL -o src/design/fonts/OFL.txt \
  https://raw.githubusercontent.com/Omnibus-Type/Archivo/master/OFL.txt
shasum -a 256 src/design/fonts/Archivo-Bold.ttf src/design/fonts/OFL.txt
# expected:
# 951a0ebab63b1bb0d90a26c27625bda803d570dace3851fa2f1eea65852d8983  src/design/fonts/Archivo-Bold.ttf
# 108b4e57c9c796d3d38d0428ca7ee39de47ad93187302718d9b2d8864b9b716b  src/design/fonts/OFL.txt
```

`src/design/fonts/README.md` (new):

```md
# src/design/fonts

Font bytes read at request time by the Open Graph image route (`src/app/og/[locale]/[pageKey]/route.tsx`). The site's own text uses `next/font/google` (`src/app/[locale]/layout.tsx`); those self-hosted woff2 files live inside `.next/` and are neither readable by a route handler nor a format Satori (`next/og`) can rasterise, hence a static TTF here.

| File               | Source                                                                                                       | SHA-256                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `Archivo-Bold.ttf` | https://github.com/Omnibus-Type/Archivo — `fonts/ttf/Archivo-Bold.ttf` (static Bold instance, 192,180 bytes) | `951a0ebab63b1bb0d90a26c27625bda803d570dace3851fa2f1eea65852d8983` |
| `OFL.txt`          | same repository — SIL Open Font License 1.1 (Copyright 2020 The Archivo Project Authors)                     | `108b4e57c9c796d3d38d0428ca7ee39de47ad93187302718d9b2d8864b9b716b` |

`fonts.test.ts` pins both sizes and hashes. Google Fonts' copy of Archivo is the variable font only (`Archivo[wdth,wght].ttf`); Satori renders a variable font at its default (Regular) instance, which is why the static Bold is vendored from upstream instead. `next.config.ts` lists this folder in `outputFileTracingIncludes` for the route so the bytes always ship with the serverless function.
```

`src/messages/tr.json` — inside `"sys"`, directly after the `"languageHint": { … }` object, add:

```json
    "seo": {
      "ogTagline": "Türkiye'deki işverenler için lisanslı iş gücü temini — yurt dışından tedarik, kontrol ve çalışma izinleri."
    },
```

`src/messages/en.json` — same position:

```json
    "seo": {
      "ogTagline": "Licensed workforce recruitment for employers in Türkiye — overseas sourcing, vetting and work permits."
    },
```

(sys copy per W9/W23 — no package id is minted; page tasks add their `sys.seo.<pageKey>.{title,description}` under this same `seo` object. Task 2's `messages.test.ts` keeps the two files' key sets identical.)

`src/lib/seo/og.ts` (new):

```ts
// R23: `@/content/pure`, not the adapter — pure so `og.test.ts` runs without the server-only
// boundary and the route handler stays a thin shell around these two readers.
import { makeT } from '@/content/pure';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** The two `sys` reads the OG image makes, as a plain object: the route wraps next-intl's
 *  translator, the tests pass a stub, and neither depends on the translator's generic type. */
export type SysCopy = { t: (key: string) => string; has: (key: string) => boolean };

export const OG_WORDMARK = 'JobsAdmire';
export const OG_SUBLINE_MAX = 140;

/** Title: the page record's `titleId` when the package has an SEO string (`''` = it has none,
 *  T0b/W38) → the page's own `sys.seo.<pageKey>.title` (W23) → the wordmark. Never typed copy. */
export function ogTitle(bundle: Bundle, pageKey: string, sys: SysCopy): string {
  const seo = bundle.pages[pageKey];
  if (seo?.titleId) return makeT(bundle)(seo.titleId);
  const key = `seo.${pageKey}.title`;
  return sys.has(key) ? sys.t(key) : OG_WORDMARK;
}

/** Subline: the record's `descriptionId` when non-empty, else the site tagline
 *  `sys.seo.ogTagline` (W38 — never `home.188`), word-clamped so it fits the card. */
export function ogSubline(bundle: Bundle, pageKey: string, sys: SysCopy): string {
  const seo = bundle.pages[pageKey];
  const text = seo?.descriptionId ? makeT(bundle)(seo.descriptionId) : sys.t('seo.ogTagline');
  return clampWords(text, OG_SUBLINE_MAX);
}

/** Word-boundary clamp with an ellipsis; cuts mid-word only when the first word alone is
 *  longer than half the budget. */
export function clampWords(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(' ', max);
  return `${text.slice(0, cut > max / 2 ? cut : max).trimEnd()}…`;
}
```

`src/app/og/[locale]/[pageKey]/route.tsx` (new):

```tsx
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { ogSubline, ogTitle } from '@/lib/seo/og';
import { OG_PAGE_KEYS } from '@/lib/seo/routes';

/** One PNG per page × locale, cached a day (docs/SEO.md § OG images). A content change reaches
 *  the image on the next revalidation; nothing here is per-request. Node runtime (the default
 *  for route handlers): the font is read from disk, never fetched. */
export const revalidate = 86400;

const WIDTH = 1200;
const HEIGHT = 630;

// Design tokens as literals (tokens.color.navy / ink / sky): this route must not pull the
// design barrel into a Node route.
const NAVY = '#0e1a37';
const INK = '#16202e';
const SKY = '#7fd0f5';

let archivoBold: Promise<Buffer> | undefined;
/** Font bytes are read once per instance. `join(process.cwd(), '<literal>')` is the pattern
 *  Next's file tracer recognises, and `next.config.ts` lists the folder in
 *  `outputFileTracingIncludes` for this route as well, so the file ships with the function. */
function loadArchivoBold(): Promise<Buffer> {
  archivoBold ??= readFile(join(process.cwd(), 'src/design/fonts/Archivo-Bold.ttf'));
  return archivoBold;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; pageKey: string }> },
) {
  const { locale, pageKey: file } = await params;
  // The `.png` suffix keeps the URL out of proxy.ts's matcher (`.*\..*`) so next-intl never
  // rewrites it under a locale — docs/ARCHITECTURE.md § Routing.
  if (!hasLocale(routing.locales, locale) || !file.endsWith('.png'))
    return new Response(null, { status: 404 });
  const pageKey = file.slice(0, -'.png'.length);
  if (!OG_PAGE_KEYS.has(pageKey)) return new Response(null, { status: 404 });

  const [bundle, sys, font] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
    loadArchivoBold(),
  ]);
  const copy = { t: (key: string) => sys(key), has: (key: string) => sys.has(key) };
  const title = ogTitle(bundle, pageKey, copy);
  const subline = ogSubline(bundle, pageKey, copy);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: `linear-gradient(135deg, ${NAVY} 0%, ${INK} 100%)`,
        color: '#ffffff',
        fontFamily: 'Archivo',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>JobsAdmire</div>
        <div style={{ fontSize: 24, color: SKY }}>jobsadmire.com</div>
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: title.length > 56 ? 52 : 66,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: -1.5,
          maxWidth: 1040,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', fontSize: 26, lineHeight: 1.35, color: SKY, maxWidth: 1000 }}>
        {subline}
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: 'Archivo', data: font, weight: 700, style: 'normal' }],
      // ImageResponse's own default is a year, immutable; the CDN/browser lifetime follows the
      // ISR window instead so a title change reaches crawlers within a day.
      headers: { 'Cache-Control': `public, max-age=${revalidate}` },
    },
  );
}
```

Satori notes baked into the JSX above: every element with more than one child declares `display: 'flex'`; only the one weight shipped (700) is referenced; no `tw` prop (needs Tailwind-in-Satori, not configured). The route exports only `revalidate` and `GET` (Next's route type check refuses other exports — the pure readers live in `src/lib/seo/og.ts` for that reason and for R23).

`next.config.ts` — whole file:

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import legacy from './redirects/legacy.json';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The OG image route reads its font from disk at request time; the tracer resolves the
  // `join(process.cwd(), '…')` literal, this is the belt to that brace so a tracer change can
  // never ship the function without its bytes (docs/SEO.md § OG images).
  outputFileTracingIncludes: { '/og/[locale]/[pageKey]': ['./src/design/fonts/*.ttf'] },
  async redirects() {
    return (legacy as { from: string; to: string }[]).map((r) => ({
      source: r.from,
      destination: r.to,
      permanent: true,
    }));
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 4: Run the tests + verify + the local e2e green**

```
npx prettier --write "src/app/og/[locale]/[pageKey]/route.tsx" "src/app/og/[locale]/[pageKey]/route.test.ts" src/lib/seo/og.ts src/lib/seo/og.test.ts src/design/fonts/fonts.test.ts src/design/fonts/README.md src/messages/tr.json src/messages/en.json next.config.ts e2e/seo.spec.ts
npx vitest run src/design/fonts src/lib/seo/og.test.ts "src/app/og" src/messages
npm run verify
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/seo.spec.ts --project=desktop
```

Expected: `fonts` 2, `og` 6, `route` 3, `messages` (parity) green; verify green; the whole `seo.spec.ts` green including the new OG route test (`/og/tr/home.png` 200 `image/png` with the PNG magic, `/og/en/hire.png` 200, `/og/tr/not-a-page.png` and `/og/de/home.png` 404). **Leave the server on 3100 running** — Cycle 4's red run reuses it. `tsc` accepts `Buffer` for `fonts[].data` (`Buffer | ArrayBuffer` in Satori's `FontOptions`, verified).

- [ ] **Step 5: Commit**

```
git add src/design/fonts next.config.ts src/lib/seo/og.ts src/lib/seo/og.test.ts src/messages/tr.json src/messages/en.json "src/app/og/[locale]/[pageKey]/route.tsx" "src/app/og/[locale]/[pageKey]/route.test.ts" e2e/seo.spec.ts
git commit -m "feat(seo): next/og image route with vendored Archivo Bold (OFL); sys.seo.ogTagline (W38)

GET /og/{locale}/{pageKey}.png renders the page record's title (else sys.seo.<pageKey>.title,
else the wordmark) and its description (else sys.seo.ogTagline — never home.188) on the navy
gradient; Node runtime, revalidate 86400; the .png suffix keeps it outside proxy.ts's matcher.
Static Bold from Omnibus-Type/Archivo (Google's copy is the variable font, which Satori renders
Regular). e2e proves the PNG against next start.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 4 — `buildMetadata`: per-locale alternates, openGraph overrides, generated OG image (on top of Task 1's `''` rule, W38)**

- [ ] **Step 1: Write the failing tests**

`src/lib/seo/metadata.test.ts` — replace the first three lines (`import { describe, expect, it } from 'vitest';` / `import { buildMetadata } from './metadata';` / `import { absoluteUrl } from './routes';`) with:

```ts
import { describe, expect, it } from 'vitest';
import { buildMetadata } from './metadata';
import { absoluteUrl, pageOgImageUrl } from './routes';
```

and append inside `describe('buildMetadata', …)` — after Task 1's `uses the fallbacks when the page record's ids are ''` case, before the describe's closing `});`:

```ts

  it('points openGraph and twitter at the generated image when the record has no ogImage', () => {
    const md = buildMetadata({ ...base, pageKey: 'home' });
    expect(md.openGraph?.images).toEqual([pageOgImageUrl('tr', 'home')]);
    expect(md.openGraph?.images).toEqual(['https://www.jobsadmire.com/og/tr/home.png']);
    expect(md.twitter?.images).toEqual([pageOgImageUrl('tr', 'home')]);
    // no record at all → the generic site image, never a 404
    expect(buildMetadata({ ...base, pageKey: 'no-such-page' }).openGraph?.images).toEqual([
      'https://www.jobsadmire.com/og/tr/site.png',
    ]);
  });

  it('lets a record ogImage win over the generated one, and an explicit override win over both', () => {
    const withImage = {
      ...bundle,
      pages: {
        ...bundle.pages,
        home: { ...bundle.pages.home, ogImage: 'https://cdn.example/home.png' },
      },
    };
    expect(
      buildMetadata({ ...base, bundle: withImage, pageKey: 'home' }).openGraph?.images,
    ).toEqual(['https://cdn.example/home.png']);
    expect(
      buildMetadata({
        ...base,
        bundle: withImage,
        pageKey: 'home',
        openGraph: { images: ['https://cdn.example/override.png'] },
      }).openGraph?.images,
    ).toEqual(['https://cdn.example/override.png']);
  });

  it('honours per-locale alternates for a per-locale-slug detail page (D16)', () => {
    const md = buildMetadata({
      ...base,
      href: { pathname: '/blog/[slug]', params: { slug: 'sezonluk-isgucu' } },
      pageKey: 'blogArticle',
      alternates: {
        tr: { pathname: '/blog/[slug]', params: { slug: 'sezonluk-isgucu' } },
        en: { pathname: '/blog/[slug]', params: { slug: 'seasonal-workforce' } },
      },
    });
    expect(md.alternates?.canonical).toBe('https://www.jobsadmire.com/blog/sezonluk-isgucu');
    expect(md.alternates?.languages).toEqual({
      tr: 'https://www.jobsadmire.com/blog/sezonluk-isgucu',
      en: 'https://www.jobsadmire.com/en/blog/seasonal-workforce',
      'x-default': 'https://www.jobsadmire.com/blog/sezonluk-isgucu',
    });
  });

  it('keeps the self-reference and drops the missing locale for a single-language article', () => {
    const md = buildMetadata({
      ...base,
      locale: 'en',
      href: { pathname: '/blog/[slug]', params: { slug: 'only-in-english' } },
      pageKey: 'blogArticle',
      alternates: { en: '/en/blog/only-in-english' },
    });
    expect(md.alternates?.languages).toEqual({
      en: 'https://www.jobsadmire.com/en/blog/only-in-english',
      'x-default': 'https://www.jobsadmire.com/en/blog/only-in-english',
    });
    // an absolute string is used verbatim; the page's own locale is filled from `href` when omitted
    const self = buildMetadata({
      ...base,
      href: { pathname: '/careers/[slug]', params: { slug: 'satis' } },
      pageKey: 'careersDetail',
      alternates: { en: 'https://www.jobsadmire.com/en/careers/sales' },
    });
    expect(self.alternates?.languages).toEqual({
      tr: 'https://www.jobsadmire.com/kariyer/satis',
      en: 'https://www.jobsadmire.com/en/careers/sales',
      'x-default': 'https://www.jobsadmire.com/kariyer/satis',
    });
  });

  it('emits og:type article with its dates and authors on request, website otherwise', () => {
    const article = buildMetadata({
      ...base,
      pageKey: 'blogArticle',
      openGraph: {
        type: 'article',
        publishedTime: '2026-01-12T00:00:00.000Z',
        modifiedTime: '2026-02-01T10:00:00.000Z',
        authors: ['JobsAdmire Editorial'],
      },
    });
    expect(article.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-01-12T00:00:00.000Z',
      modifiedTime: '2026-02-01T10:00:00.000Z',
      authors: ['JobsAdmire Editorial'],
    });
    expect(buildMetadata({ ...base, pageKey: 'home' }).openGraph).toMatchObject({
      type: 'website',
    });
  });
```

`e2e/seo.spec.ts` — append at the end of the file (after the OG route test from Cycle 3):

```ts

test('the home page points og:image and twitter:image at the generated PNG', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/tr/home.png`,
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/tr/home.png`,
  );
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```
npx vitest run src/lib/seo/metadata.test.ts
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/seo.spec.ts --project=desktop -g "points og:image"
kill $(cat /tmp/next.pid)
```

Expected: the four existing cases (three WP1 + Task 1's `''` case) pass; the five new ones fail — first with `expected [ '/opengraph-image.png' ] to deeply equal [ 'https://www.jobsadmire.com/og/tr/home.png' ]`, the alternates cases with the WP1 same-slug map (`en: 'https://www.jobsadmire.com/en/blog/sezonluk-isgucu'`), the article case with `type: 'website'`. (`tsc` would also reject the unknown `alternates`/`openGraph` args — vitest does not type-check, so the run reaches the assertions.) The e2e case fails against the still-running Cycle 3 server: `meta[property="og:image"]` content is `https://www.jobsadmire.com/opengraph-image.png`.

- [ ] **Step 3: Implement**

`src/lib/seo/metadata.ts` — whole file. Task 1's two `''` → fallback lines and their comment are carried verbatim (W38):

```ts
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
// R23: `@/content/pure`, not the adapter — the adapter is `server-only` and would make this
// module unimportable from a unit test.
import { makeT } from '@/content/pure';
import { absoluteUrl, localeAlternates, pageOgImageUrl, SITE_URL, type Href } from './routes';

/**
 * One locale's alternate for a page whose slug is authored per locale (blog, careers — D16):
 * an absolute URL, an already-localized external path (`/en/blog/x`), or the typed dynamic
 * `Href` (`{ pathname: '/blog/[slug]', params: { slug } }`) resolved for that locale. A bare
 * `pathnames` key is deliberately NOT accepted as a string — it would be indistinguishable from
 * an external path. Static pages pass no `alternates` at all and get `localeAlternates(href)`.
 */
export type AlternateTarget = string | Exclude<Href, string>;

export type MetadataOpenGraphOverride = {
  type?: 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Absolute URLs. Wins over the page record's `ogImage` and over the generated route image. */
  images?: string[];
};

function resolveAlternate(locale: Locale, target: AlternateTarget): string {
  if (typeof target !== 'string') return absoluteUrl(locale, target);
  return /^https?:\/\//.test(target) ? target : `${SITE_URL}${target}`;
}

/** hreflang map from an explicit per-locale override: only the locales given, plus the page's
 *  own locale from `href` when the override omits it (a page missing its own locale is a
 *  defect — docs/SEO.md), plus `x-default` = TR when TR exists, else the page's own. */
function overrideAlternates(
  locale: Locale,
  href: Href,
  override: Partial<Record<Locale, AlternateTarget>>,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const target = override[l];
    if (target !== undefined) languages[l] = resolveAlternate(l, target);
    else if (l === locale) languages[l] = absoluteUrl(locale, href);
  }
  languages['x-default'] = languages[routing.defaultLocale] ?? languages[locale];
  return languages;
}

/** Page metadata from the content bundle's page record, with fallbacks for the Phase A pages
 *  the bundle has no record for yet (docs/SEO.md: no hard-typed metadata in components). */
export function buildMetadata(args: {
  locale: Locale;
  href: Href;
  bundle: Bundle;
  pageKey: string;
  fallbackTitle: string;
  fallbackDescription: string;
  alternates?: Partial<Record<Locale, AlternateTarget>>;
  openGraph?: MetadataOpenGraphOverride;
}): Metadata {
  const { locale, href, bundle, pageKey } = args;
  const t = makeT(bundle);
  const seo = bundle.pages[pageKey];
  // '' = the page record exists but the package has no SEO string for it (T0b); the page's
  // sys.seo.<pageKey>.* copy arrives as the fallback (W23).
  const title = seo?.titleId ? t(seo.titleId) : args.fallbackTitle;
  const description = seo?.descriptionId ? t(seo.descriptionId) : args.fallbackDescription;
  const canonical = seo?.canonical ?? absoluteUrl(locale, href);
  const languages = args.alternates
    ? overrideAlternates(locale, href, args.alternates)
    : localeAlternates(href).languages;
  // Explicit override → the record's own image → the generated route (docs/SEO.md § OG images).
  const images =
    args.openGraph?.images ?? (seo?.ogImage ? [seo.ogImage] : [pageOgImageUrl(locale, pageKey)]);
  const og = {
    title,
    description,
    url: canonical,
    siteName: 'JobsAdmire',
    locale: locale === 'tr' ? 'tr_TR' : 'en_US',
    images,
  };
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical, languages },
    robots:
      seo?.robots === 'noindex' ? { index: false, follow: false } : { index: true, follow: true },
    openGraph:
      args.openGraph?.type === 'article'
        ? {
            ...og,
            type: 'article',
            publishedTime: args.openGraph.publishedTime,
            modifiedTime: args.openGraph.modifiedTime,
            authors: args.openGraph.authors,
          }
        : { ...og, type: 'website' },
    // Twitter does not inherit `openGraph.images` once a `twitter` block is present.
    twitter: { card: 'summary_large_image', title, description, images },
  };
}
```

- [ ] **Step 4: Run the tests + verify + the local e2e green**

```
npx prettier --write src/lib/seo/metadata.ts src/lib/seo/metadata.test.ts e2e/seo.spec.ts
npx vitest run src/lib/seo/metadata.test.ts
npm run verify
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/seo.spec.ts --project=desktop; kill $(cat /tmp/next.pid)
```

Expected: 9 tests green (3 WP1 + 1 Task 1 + 5 new); verify green; `seo.spec.ts` fully green (the home page's `og:image`/`twitter:image` = `${ORIGIN}/og/tr/home.png`). `tsc` gotcha: Next's `Metadata['openGraph']` is a discriminated union — the two-branch ternary type-checks (verified); do not collapse it into one object with `type: args.openGraph?.type ?? 'website'` (that widens `type` to `string` and fails).

- [ ] **Step 5: Commit**

```
git add src/lib/seo/metadata.ts src/lib/seo/metadata.test.ts e2e/seo.spec.ts
git commit -m "feat(seo): buildMetadata per-locale alternates, og:type article, generated OG image

Detail pages with per-locale slugs (D16) pass 'alternates'; the same-slug map stays the default.
openGraph/twitter images point at /og/{locale}/{pageKey}.png unless the record or the caller
supplies one — the /opengraph-image.png 404 is gone on every page. Task 1's '' → fallback rule
is kept verbatim (W38); e2e asserts the home page's og:image.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 5 — `useAlternatePath` + `LanguageSwitcher`/`LanguageHint` follow the page's hreflang (W17)**

Why `useSyncExternalStore` and not `useEffect` + `setState`: `eslint-config-next` 16 turns on `react-hooks` 7's recommended set, which includes `set-state-in-effect` as an error; the repo already uses the store pattern for browser facts (`LanguageHint`, R18). A `MutationObserver` on `<head>` is the subscription, so a client-side navigation that swaps the metadata tags re-reads them without any state.

- [ ] **Step 1: Write the failing tests**

`src/design/chrome/__tests__/use-alternate-path.test.ts` (new):

```ts
import { afterEach, describe, expect, it } from 'vitest';
import { alternateHrefToPath, readAlternateHref } from '../use-alternate-path';

function addAlternate(hreflang: string, href: string) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'alternate');
  link.setAttribute('hreflang', hreflang);
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

afterEach(() => {
  document.head.querySelectorAll('link[rel="alternate"]').forEach((l) => l.remove());
});

describe('readAlternateHref (W17)', () => {
  it('returns the hreflang tag for the locale, or null when the page has none', () => {
    expect(readAlternateHref('en')).toBeNull();
    addAlternate('tr', 'https://www.jobsadmire.com/blog/sezonluk-isgucu');
    addAlternate('en', 'https://www.jobsadmire.com/en/blog/seasonal-workforce');
    addAlternate('x-default', 'https://www.jobsadmire.com/blog/sezonluk-isgucu');
    expect(readAlternateHref('en')).toBe('https://www.jobsadmire.com/en/blog/seasonal-workforce');
    expect(readAlternateHref('tr')).toBe('https://www.jobsadmire.com/blog/sezonluk-isgucu');
  });
});

describe('alternateHrefToPath', () => {
  it('keeps only the path and query, so a preview host never links to production', () => {
    expect(alternateHrefToPath('https://www.jobsadmire.com/en/blog/x?utm=1')).toBe(
      '/en/blog/x?utm=1',
    );
    expect(alternateHrefToPath('https://www.jobsadmire.com/')).toBe('/');
    expect(alternateHrefToPath('/en/about')).toBe('/en/about');
  });
  it('is null for nothing or garbage', () => {
    expect(alternateHrefToPath(null)).toBeNull();
    expect(alternateHrefToPath('')).toBeNull();
    expect(alternateHrefToPath('http://[')).toBeNull();
  });
});
```

`src/design/chrome/__tests__/LanguageSwitcher.test.tsx` (new):

```tsx
import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { renderWithIntl } from '@/test/render';

function addAlternate(hreflang: string, href: string) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'alternate');
  link.setAttribute('hreflang', hreflang);
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

afterEach(() => {
  document.head.querySelectorAll('link[rel="alternate"]').forEach((l) => l.remove());
});

describe('LanguageSwitcher', () => {
  it('falls back to the parent index when the page carries no hreflang tags (R58)', () => {
    renderWithIntl(<LanguageSwitcher locale="tr" label="Dil" />);
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en');
    expect(screen.getByRole('link', { name: 'Türkçe' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'English' })).not.toHaveAttribute('aria-current');
  });

  it("follows the page's own hreflang tags when they exist (W17)", () => {
    addAlternate('tr', 'https://www.jobsadmire.com/blog/sezonluk-isgucu');
    addAlternate('en', 'https://www.jobsadmire.com/en/blog/seasonal-workforce');
    renderWithIntl(<LanguageSwitcher locale="tr" label="Dil" />);
    const en = screen.getByRole('link', { name: 'English' });
    expect(en).toHaveAttribute('href', '/en/blog/seasonal-workforce');
    expect(en).toHaveAttribute('hreflang', 'en');
    expect(screen.getByRole('link', { name: 'Türkçe' })).toHaveAttribute(
      'href',
      '/blog/sezonluk-isgucu',
    );
  });

  it('uses the tag for one locale and the fallback for the other when only one tag exists', () => {
    addAlternate('en', 'https://www.jobsadmire.com/en/blog/only-in-english');
    renderWithIntl(<LanguageSwitcher locale="en" label="Language" />, { locale: 'en' });
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute(
      'href',
      '/en/blog/only-in-english',
    );
    // The R58 fallback is next-intl's <Link locale="tr">, which always carries the prefix when
    // `locale` is passed (`forcePrefix`); the middleware folds `/tr` back to `/` — WP1 behaviour.
    expect(screen.getByRole('link', { name: 'Türkçe' })).toHaveAttribute('href', '/tr');
  });
});
```

`src/design/chrome/__tests__/LanguageHint.test.tsx` — replace the first two lines (`import { describe, expect, it } from 'vitest';` / `import { shouldShowHint } from '../LanguageHint';`) with:

```tsx
import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LanguageHint, shouldShowHint } from '../LanguageHint';
import { renderWithIntl } from '@/test/render';
```

and append at the end of the file (after the `shouldShowHint` describe):

```tsx

describe('LanguageHint link target', () => {
  // jsdom reports navigator.languages = ['en-US', 'en'], so a TR page is eligible; the
  // dismissal read is inside try/catch (Node ≥ 23 stubs `localStorage` without `getItem`,
  // src/test/storage.ts), so the hint counts as "not dismissed".
  afterEach(() => {
    document.head.querySelectorAll('link[rel="alternate"]').forEach((l) => l.remove());
  });

  it('offers /en (the parent index) without hreflang tags — R58', () => {
    renderWithIntl(<LanguageHint locale="tr" />);
    expect(screen.getByRole('link', { name: 'Switch to English' })).toHaveAttribute('href', '/en');
  });

  it("offers the page's English alternate when the tag exists — W17", () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', 'en');
    link.setAttribute('href', 'https://www.jobsadmire.com/en/blog/seasonal-workforce');
    document.head.appendChild(link);
    renderWithIntl(<LanguageHint locale="tr" />);
    expect(screen.getByRole('link', { name: 'Switch to English' })).toHaveAttribute(
      'href',
      '/en/blog/seasonal-workforce',
    );
  });
});
```

(`'Switch to English'` is the literal value of `sys.languageHint.switch` in both message files — `grep -n '"switch"' src/messages/tr.json`.)

- [ ] **Step 2: Run the tests to verify they fail**

```
npx vitest run src/design/chrome/__tests__/use-alternate-path.test.ts src/design/chrome/__tests__/LanguageSwitcher.test.tsx src/design/chrome/__tests__/LanguageHint.test.tsx
```

Expected: `use-alternate-path.test.ts` — `Failed to load url ../use-alternate-path`; `LanguageSwitcher.test.tsx` — the R58 case passes, the two W17 cases fail with `expected … to have attribute 'href' with value '/en/blog/seasonal-workforce', received '/en'`; `LanguageHint.test.tsx` — the two `shouldShowHint` cases and the R58 case pass, the W17 case fails the same way (`received '/en'`).

- [ ] **Step 3: Implement**

`src/design/chrome/use-alternate-path.ts` (new):

```ts
'use client';
import { useCallback, useSyncExternalStore } from 'react';
import type { Locale } from '@/i18n/routing';

/**
 * W17 — the other-locale target of the two language links, read from the page's own
 * `<link rel="alternate" hreflang>` tags that `buildMetadata` renders. Static pages get the
 * same path the R58 fallback would produce; per-locale-slug detail pages (blog, careers) get
 * the real translated slug the server already knew — without any prop plumbing through the
 * group layouts, which pages cannot reach.
 *
 * Browser facts follow R18: never read during the server or hydrating render (the server
 * snapshot is `null`), then React re-renders with the live value. A MutationObserver on
 * `<head>` is the subscription, so a client-side navigation that swaps the metadata tags is
 * picked up without state. Pure readers are exported for tests.
 */
export function readAlternateHref(locale: Locale, doc: Document = document): string | null {
  const tag = doc.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${locale}"]`);
  return tag?.getAttribute('href') ?? null;
}

/** Path + query only — the host is dropped: the tag carries the production origin
 *  (SITE_URL), and a link that left a preview deployment for production would be a defect. */
export function alternateHrefToPath(href: string | null): string | null {
  if (!href) return null;
  try {
    const url = new URL(href, 'https://placeholder.invalid');
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'hreflang'],
  });
  return () => observer.disconnect();
}

const onServer = () => null;

export function useAlternatePath(locale: Locale): string | null {
  const getSnapshot = useCallback(() => alternateHrefToPath(readAlternateHref(locale)), [locale]);
  return useSyncExternalStore(subscribe, getSnapshot, onServer);
}
```

`src/design/chrome/LanguageSwitcher.tsx` — whole file (WP1's `ENDONYM`/`SHELL`/`ITEM`/`ACTIVE`/`IDLE` constants unchanged; the `.map` now renders a `LanguageLink` per locale so the hook is never called inside the callback):

```tsx
'use client';
import NextLink from 'next/link';
import { Link, usePathname, type Href } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { alternatePath } from './alternate-path';
import { useAlternatePath } from './use-alternate-path';

/** Endonyms, not copy: a switcher has to name the language you are switching *to*, so it
 *  cannot come from a `sys.*` string in the *current* locale — which is why no such key
 *  exists (M-10 removed the unused `sys.languageName`). */
const ENDONYM: Record<Locale, string> = { tr: 'Türkçe', en: 'English' };

const SHELL: Record<'light' | 'dark' | 'block', string> = {
  light: 'gap-1 rounded-pill border border-border-1 bg-pale-1 p-1',
  dark: 'gap-1 rounded-pill border border-white/20 bg-white/10 p-1',
  block: 'gap-2',
};

const ITEM =
  'inline-flex min-h-[44px] items-center rounded-pill px-3 text-body-sm font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

const ACTIVE: Record<'light' | 'dark' | 'block', string> = {
  light: 'bg-white text-ink shadow-card',
  dark: 'bg-white/90 text-navy',
  block: 'bg-navy text-white',
};

const IDLE: Record<'light' | 'dark' | 'block', string> = {
  light: 'text-text-secondary hover:text-blue-safe',
  dark: 'text-white/70 hover:text-white',
  block: 'border border-border-1 text-text-secondary hover:text-blue-safe',
};

/** Client-only: the switch has to keep the visitor on the page they are reading, and the
 *  current pathname is a browser fact. `usePathname` is `null` outside the App Router.
 *  On a dynamic route it returns the template, so `alternatePath` sends the switch to the
 *  parent index rather than a slug that does not exist in the other locale (R58) — unless
 *  the page's own hreflang tag names the real alternate, which wins once hydrated (W17). */
export function LanguageSwitcher({
  locale,
  label,
  variant = 'light',
}: {
  locale: Locale;
  label: string;
  variant?: 'light' | 'dark' | 'block';
}) {
  const target = alternatePath(usePathname() ?? '/');
  return (
    <div role="group" aria-label={label} className={`flex items-center ${SHELL[variant]}`}>
      {locales.map((l) => (
        <LanguageLink
          key={l}
          to={l}
          active={l === locale}
          fallback={target as Href}
          className={`${ITEM} ${l === locale ? ACTIVE[variant] : IDLE[variant]}`}
        />
      ))}
    </div>
  );
}

/** One pill. The hook is called here, once per locale, never inside the `.map` callback. */
function LanguageLink({
  to,
  active,
  fallback,
  className,
}: {
  to: Locale;
  active: boolean;
  fallback: Href;
  className: string;
}) {
  const alternate = useAlternatePath(to);
  const shared = {
    prefetch: false,
    hrefLang: to,
    'aria-current': active ? ('true' as const) : undefined,
    className,
  };
  // The tag's path is already localized, so it goes through next/link untouched; the
  // fallback is an internal pathname next-intl localizes for `to`.
  return alternate ? (
    <NextLink href={alternate} {...shared}>
      {ENDONYM[to]}
    </NextLink>
  ) : (
    <Link href={fallback} locale={to} {...shared}>
      {ENDONYM[to]}
    </Link>
  );
}
```

`src/design/chrome/LanguageHint.tsx` — four anchored edits:

1. Imports: after `import { useTranslations } from 'next-intl';` add `import NextLink from 'next/link';`, and after `import { alternatePath } from './alternate-path';` add `import { useAlternatePath } from './use-alternate-path';`.
2. Directly above the doc comment `/** English copy in both locales on purpose…` (i.e. after `readDismissal`) add the class constant — the string is the one that was inline on the switch `<Link>`, moved, not changed:

```tsx
const SWITCH =
  'inline-flex min-h-[44px] items-center rounded-pill bg-ink px-4 font-extrabold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
```

3. Replace the comment + line `// R58: on a dynamic route … offers the parent index instead.` / `const target = alternatePath(usePathname() ?? '/');` with:

```tsx
  // R58: on a dynamic route `usePathname()` is the template (`/blog/[slug]`); the English slug
  // is a different string the client cannot know, so the hint offers the parent index —
  // unless the page's own `hreflang="en"` tag names the real alternate (W17).
  const target = alternatePath(usePathname() ?? '/');
  const alternate = useAlternatePath('en');
```

4. Replace the `<Link href={target as Href} locale="en" prefetch={false} onClick={dismiss} className="inline-flex …">{sys('languageHint.switch')}</Link>` element with:

```tsx
        {alternate ? (
          <NextLink href={alternate} prefetch={false} onClick={dismiss} className={SWITCH}>
            {sys('languageHint.switch')}
          </NextLink>
        ) : (
          <Link
            href={target as Href}
            locale="en"
            prefetch={false}
            onClick={dismiss}
            className={SWITCH}
          >
            {sys('languageHint.switch')}
          </Link>
        )}
```

The outer `<div role="region" … className="fixed inset-x-3 bottom-[calc(74px+…)] …">` line is untouched — Task 5 edits it for W18 (`var(--sticky-cta-h, 0px)`).

- [ ] **Step 4: Run the tests + verify**

```
npx prettier --write src/design/chrome/use-alternate-path.ts src/design/chrome/LanguageSwitcher.tsx src/design/chrome/LanguageHint.tsx src/design/chrome/__tests__/use-alternate-path.test.ts src/design/chrome/__tests__/LanguageSwitcher.test.tsx src/design/chrome/__tests__/LanguageHint.test.tsx
npx vitest run src/design/chrome
npm run verify
```

Expected: all chrome tests green — `use-alternate-path` 3, `LanguageSwitcher` 3, `LanguageHint` 4 — including Task 3's unchanged `Header.test.tsx` (`aria-current` on Türkçe, none on English), `Footer.test.tsx`, `SlimBar.test.tsx`, `nav.test.ts`; verify green. Lint check specifically: no `react-hooks/set-state-in-effect`, no `react-hooks/rules-of-hooks` (the hook is called in `LanguageLink`, a component rendered per locale — never inside the `.map` callback body). Both were linted clean with the repo's config while drafting.

- [ ] **Step 5: Commit**

```
git add src/design/chrome/use-alternate-path.ts src/design/chrome/LanguageSwitcher.tsx src/design/chrome/LanguageHint.tsx src/design/chrome/__tests__/use-alternate-path.test.ts src/design/chrome/__tests__/LanguageSwitcher.test.tsx src/design/chrome/__tests__/LanguageHint.test.tsx
git commit -m "feat(chrome): language links follow the page's hreflang tag (W17), R58 stays the fallback

useAlternatePath reads link[rel=alternate][hreflang] through useSyncExternalStore + a head
MutationObserver — no props through the group layouts, no state in an effect, no hydration
mismatch. Path only, so a preview never links to production.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 6 — docs (SEO.md, PRD.md, ARCHITECTURE.md, CONTENT-MODEL.md) and the preview proof**

The code and its red→green e2e runs are complete after Cycle 4/5; this cycle carries the docs (a behaviour change ships with its docs in the same change set) and the binding preview run.

- [ ] **Step 1: The proof this cycle adds** — none in code: `e2e/seo.spec.ts` already carries the two OG tests (Cycles 3–4). The preview run in Step 4 is where the traced font is proven on Vercel; a local `next start` cannot prove file tracing.

- [ ] **Step 2: Nothing to run red** — go to Step 3.

- [ ] **Step 3: Implement (docs — every edit anchored on a sentence, W45)**

`docs/PRD.md` — § 11, the sentence beginning `**Not yet built, by design (WP2 and later):**` as Task 2 reworded it. Two edits inside that sentence:

1. Delete the phrase `OG image generation, the \`Article\`/\`JobPosting\` JSON-LD builders (\`BreadcrumbList\`/\`FAQPage\` exist in \`src/lib/seo/jsonld.ts\` since WP1 — written, not yet called), ` so the list reads `…, Sentry, the synthetic-lead cron and daily digest, …`.
2. Append, after that sentence's final period, this clause (W45 — appended, Task 2's wording otherwise intact):

```md
 OG image generation and the `Article`/`JobPosting` JSON-LD builders shipped in WP2a Task 4 (`src/app/og/[locale]/[pageKey]/route.tsx` — `/og/{locale}/{pageKey}.png` from the bundle's page record; `articleJsonLd`/`jobPostingJsonLd` in `src/lib/seo/jsonld.ts` beside the WP1 `BreadcrumbList`/`FAQPage` builders — all four written, called by the blocks and detail pages that need them).
```

`docs/SEO.md`:

- § hreflang / x-default — after the paragraph that ends `…and consumed by \`buildMetadata()\` (\`src/lib/seo/metadata.ts\`).` insert a new paragraph:

```md
**Per-locale slugs (D16).** Blog and careers detail pages pass `alternates: { tr, en }` to `buildMetadata()` — an absolute URL, an already-localized path, or the typed `{ pathname: '/blog/[slug]', params }` href resolved per locale — because `localeAlternates(href)` would otherwise emit the TR slug under `/en` and vice versa. Only the locales given are emitted (a single-language article has one hreflang plus `x-default`); the page's own locale is always filled from `href` if omitted. The two language links in the chrome (`LanguageSwitcher`, `LanguageHint`) read these rendered `<link rel="alternate" hreflang>` tags in the browser (`src/design/chrome/use-alternate-path.ts`) and link to that path, falling back to the parent index (R58) when a page has none — ruling W17.
```

- § Sitemap — replace the whole paragraph that begins `` `app/sitemap.ts` — as shipped in WP1, generated from the **static `pathnames` table** `` (as Task 3 left it, ending `…are WP2 work not yet started.`) with:

```md
`app/sitemap.ts` — generated from the **static `pathnames` table** (`src/i18n/routing.ts`) for both locales, minus two sets from `src/lib/seo/routes.ts`: `NOINDEX_PATHNAMES` (`/thank-you`, `/portal-login`, `/newsletter/confirm`, `/newsletter/unsubscribe`, `/blog`, `/blog/[slug]` — W4) and **`UNBUILT_PATHNAMES`** (ruling W20) — the routes that have no page yet. As of WP2a Task 4 the sitemap therefore lists exactly the built routes (`/`, `/en`, `/isci-talebi`, `/en/hire-workers` — **4 URLs**); each page task deletes its own key from `UNBUILT_PATHNAMES` in the commit that adds the page, `src/lib/seo/unbuilt.test.ts` fails whenever the set and `src/app/[locale]/**/page.tsx` disagree in either direction, and the launch gate (T15) asserts the set is empty before Gate A. Dynamic keys (`/careers/[slug]`, `/blog/[slug]`) are filtered by pattern; their detail entries come from **`DETAIL_SITEMAP_SOURCES`** (`src/lib/seo/sitemap-sources.ts`, ruling W31) — one function per source, awaited after the static entries, read from the bundle under that content's ISR tag. The careers page task edits the frozen literal to add its imported openings source (no runtime push, W70); blog joins when it leaves `NOINDEX_PATHNAMES`. `revalidate = 900`.
```

- § Robots — replace the whole paragraph that begins `` `app/robots.ts`. In any non-production `VERCEL_ENV` `` (as Task 3 left it, ending `…tracked as one of the three numbers watched in the 12-week post-launch window below.`) with:

```md
`app/robots.ts`. In any non-production `VERCEL_ENV` (preview; local dev has no `VERCEL_ENV` and falls through to the production rules, which is fine — nothing crawls localhost): `disallow: '/'` outright — enforced by `noindex` + Deployment Protection too, not robots alone, since robots is not access control. In production: allow everything except `/api/` and `robotsDisallowPaths(locale)` for both locales (`src/lib/seo/routes.ts`, ruling W37) — the `NOINDEX_PATHNAMES` set's localized prefixes (`noindexExternalPaths`, `/blog/[slug]` folded onto `/blog`) **minus every noindex key still in `UNBUILT_PATHNAMES`**: a robots rule must never name a path that does not exist. Today that is `/tesekkurler` and `/en/thank-you` only; `/blog`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik` and their `/en/…` forms appear by themselves when their page task deletes the key (W20), and `/blog` leaves the noindex set by hand once six Turkish bodies exist (W4). Plus a `sitemap:` pointer. A **verified-crawler allowlist** at the Firewall layer (Vercel Firewall rate rules, D13) — so legitimate high-frequency crawlers (Googlebot etc.) are never rate-limited into 429s, one of the old site's measured failure modes — is not yet configured in this repo; it is a WP0/Vercel-project-settings action, tracked as one of the three numbers watched in the 12-week post-launch window below.
```

- § JSON-LD — replace the paragraph that begins `**Shipped in WP1** (\`src/lib/seo/jsonld.ts\`)` (ending `…The table below is the full target set:`) with the following. The sentence `` `breadcrumbJsonLd` and `faqJsonLd` are written but not yet called from any page `` is kept **verbatim** because Task 5 anchors its own edit on it:

```md
**Shipped** (`src/lib/seo/jsonld.ts`): `organizationJsonLd` and `websiteJsonLd` (WP1), both rendered site-wide from `[locale]/layout.tsx` via `JsonLdScript.tsx`; `breadcrumbJsonLd` and `faqJsonLd` are written but not yet called from any page; `articleJsonLd` (WP2a Task 4 — a `BlogPosting` with headline, description, image, url, `mainEntityOfPage`, ISO `datePublished`/`dateModified`, author, publisher with logo, `inLanguage`) and `jobPostingJsonLd` (WP2a Task 4 — title, description, url, ISO `datePosted`/`validThrough`, `employmentType`, `hiringOrganization`, `jobLocation` as Place/PostalAddress with an ISO-2 country, optional `MonetaryAmount` `baseSalary` and `identifier`), called by the blog article and careers detail pages. Both new builders compact `undefined` keys away; an invalid date throws outside production and is omitted in production (makeT's own rule). The table below is the full target set:
```

- § OG images — replace the paragraph that begins `**Not built in WP1.**` with:

```md
**Built in WP2a Task 4.** `GET /og/{locale}/{pageKey}.png` (`src/app/og/[locale]/[pageKey]/route.tsx`) renders a 1200×630 PNG with `next/og` on the **Node runtime** — the title from the bundle's page record (`t(titleId)`), else the page's `sys.seo.<pageKey>.title` (W23), else the wordmark; the record's description, else `sys.seo.ogTagline` (never `home.188`, ruling W38), as the subline — the pure readers live in `src/lib/seo/og.ts`. Archivo Bold comes from the vendored `src/design/fonts/Archivo-Bold.ttf` (OFL; provenance and hashes in `src/design/fonts/README.md`, pinned by `fonts.test.ts`), never fetched at request time; `next.config.ts` lists the folder in `outputFileTracingIncludes` for the route so the bytes always ship with the function. `revalidate = 86400` and `Cache-Control: public, max-age=86400`. The `.png` suffix keeps the URL outside `proxy.ts`'s matcher (any path with an extension is skipped), so next-intl never rewrites it; `OG_PAGE_KEYS` (`src/lib/seo/routes.ts` — `site` + every `PAGE_KEYS` entry) bounds the cache to known keys × 2 locales and an unknown key 404s. `buildMetadata()` points `openGraph.images` and `twitter.images` at `pageOgImageUrl(locale, pageKey)` whenever the page record has no `ogImage` (a record image wins; a caller's `openGraph.images` override wins over both — detail pages use it for per-slug images).
```

`docs/ARCHITECTURE.md`:

- § Routing — after the paragraph `A tagged revalidate route (\`/api/revalidate\`) sits **outside** the proxy matcher — it must never be redirected or locale-rewritten.` add:

```md
The Open Graph image route (`/og/{locale}/{pageKey}.png`, `src/app/og/…`) also lives outside the locale tree and is skipped by the matcher **because of its `.png` extension**, not by name — the matcher itself is unchanged. Do not add an extension-less route outside `[locale]` without extending the matcher.
```

- § Chrome — after the `**\`LanguageHint\` renders out of flow**` paragraph (ending `…is worth knowing before assuming a stacking bug.`) add:

```md
**The two language links (`LanguageSwitcher`, the `LanguageHint` switch) read the page's own `<link rel="alternate" hreflang>` tags** (`src/design/chrome/use-alternate-path.ts`, ruling W17) through `useSyncExternalStore` with a `MutationObserver` on `<head>` as the subscription — the R18 pattern, and the only one `react-hooks`' `set-state-in-effect` rule allows. The server render and the hydrating render use `alternatePath()` (R58, parent index); once hydrated a tag wins, so blog/careers detail pages link to the real translated slug with no prop reaching the chrome through the group layouts. The tag-derived link renders through `next/link` (its path is already localized); the fallback stays next-intl's `<Link locale>`, which always carries the prefix when `locale` is passed (`/tr` folds to `/` in the middleware). Only the tag's path + query is used (never its host), so a preview deployment never links to production.
```

`docs/CONTENT-MODEL.md`:

- § Bundle shape, `pages` row — Task 1's note ends `…\`ogImage\`/\`canonical\` null (the \`next/og\` route fills OG in T0c).` Append to that note: `` The 22 keys plus the generic `site` are exactly `OG_PAGE_KEYS` (`src/lib/seo/routes.ts`); the OG image route renders one PNG per key × locale and 404s anything else, so a new page key is added to `PAGE_KEYS` and `OG_PAGE_KEYS` in the same commit (`routes.test.ts` asserts the two agree). ``
- § Adding copy (W9, W23) — Task 1's paragraph names `` `sys.seo.<pageKey>.{title,description}` (only where `bundle.pages[pageKey].titleId` is `''`) ``; directly after that parenthesis append: `` and `sys.seo.ogTagline` (the site tagline the OG image shows as its subline when a record carries no description — W38; the route also reads `sys.seo.<pageKey>.title` for its title) ``.
- § Page records — append to the paragraph (after `…the state machine becomes real in Phase B.`): `` The `pageKey` a page passes to `buildMetadata()` is its `PAGE_KEYS` entry (`blogArticle` for `/blog/[slug]`, `careersDetail` for `/careers/[slug]`); the OG image for that key is generated from the same record (docs/SEO.md § OG images). ``

- [ ] **Step 4: Verify + gate on the preview**

```
npx prettier --write docs/SEO.md docs/PRD.md docs/ARCHITECTURE.md docs/CONTENT-MODEL.md
npm run verify
```

Expected green. Then push `wp2/foundation`, let Vercel build the preview (the build runs `verify` again and `next build` — this is where the traced font is proven), and:

```
E2E_BASE_URL=https://<preview-url> npx playwright test e2e/seo.spec.ts --project=desktop
curl -sI https://<preview-url>/og/tr/home.png | grep -i "^HTTP\|content-type\|cache-control"
curl -sI https://<preview-url>/og/en/hire.png | grep -i "^HTTP\|content-type"
```

Expected: the two OG tests green alongside the rest of `seo.spec.ts`; both curls `HTTP/2 200` + `content-type: image/png`. A 500 here with `ENOENT … Archivo-Bold.ttf` in the Vercel function log means the tracer did not pick the file up — check the `outputFileTracingIncludes` key matches the route path exactly (`/og/[locale]/[pageKey]`) before anything else. Record the two curl lines in the WP2a ledger under T0c/Task 4.

- [ ] **Step 5: Commit**

```
git add docs/SEO.md docs/PRD.md docs/ARCHITECTURE.md docs/CONTENT-MODEL.md
git commit -m "docs(seo): OG route, alternates override, JSON-LD builders, W20/W31/W37 sitemap and robots gating

PRD §11 status sentence no longer lists OG generation and the Article/JobPosting builders as
unbuilt (appended clause, Task 2's wording kept); SEO.md sitemap/robots/JSON-LD/OG sections
rewritten; ARCHITECTURE routing + chrome paragraphs; CONTENT-MODEL page keys.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:**

- `docs/PRD.md` § 11, the sentence beginning `**Not yet built, by design (WP2 and later):**` — Task 2's wording kept; the `OG image generation, the Article/JobPosting JSON-LD builders (…)` phrase removed from the not-built list and the "shipped in WP2a Task 4" clause appended (W45). Task 4 owns this edit; Task 2's edit lands first.
- `docs/SEO.md` § hreflang / x-default — new paragraph "**Per-locale slugs (D16).**…" after the sentence ending `…consumed by \`buildMetadata()\` (\`src/lib/seo/metadata.ts\`).`
- `docs/SEO.md` § Sitemap — the paragraph beginning `` `app/sitemap.ts` — as shipped in WP1 `` replaced (UNBUILT_PATHNAMES/W20, 4 URLs today, the filesystem test, DETAIL_SITEMAP_SOURCES/W31, T15).
- `docs/SEO.md` § Robots — the paragraph beginning `` `app/robots.ts`. In any non-production `` replaced (`robotsDisallowPaths`/W37; built noindex routes only; the crawler-allowlist sentence kept).
- `docs/SEO.md` § JSON-LD — the paragraph beginning `**Shipped in WP1**` replaced; the sentence `` `breadcrumbJsonLd` and `faqJsonLd` are written but not yet called from any page `` kept verbatim for Task 5's anchor.
- `docs/SEO.md` § OG images — the paragraph beginning `**Not built in WP1.**` replaced.
- `docs/ARCHITECTURE.md` § Routing — one paragraph after the `A tagged revalidate route (\`/api/revalidate\`) sits **outside** the proxy matcher…` sentence.
- `docs/ARCHITECTURE.md` § Chrome — one paragraph after the `**\`LanguageHint\` renders out of flow**` paragraph.
- `docs/CONTENT-MODEL.md` § Bundle shape `pages` row (appended to Task 1's note), § Adding copy (appended to Task 1's `sys.seo.<pageKey>` clause), § Page records (appended sentence).
- `src/design/fonts/README.md` — new: provenance, licence, hashes (not under `docs/`, but the licence-file requirement lives there).
- Not touched, on purpose: `docs/ANALYTICS.md`, `docs/INTEGRATIONS.md`, `docs/DEPLOYMENT.md` (no env, no events, no Operations contract), `CLAUDE.md` (its docs table already routes SEO readers to `docs/SEO.md`).

**Produces — deviations:**

1. `pageOgImageUrl` returns `…/og/{locale}/{pageKey}.png` — the route path is the skeleton's `src/app/og/[locale]/[pageKey]/route.tsx` unchanged, but the URL carries a `.png` suffix (stripped inside the handler) so it stays outside `proxy.ts`'s matcher without touching the matcher. `OG_PAGE_KEYS` is an added export and is `'site'` + Task 1's 22 `PAGE_KEYS` (the earlier draft's 20-key list with a single `newsletter` key is gone — the page-record keys are `careersDetail`, `blogArticle`, `newsletterConfirm`, `newsletterUnsubscribe`); `routes.test.ts` pins the equality.
2. `robotsDisallowPaths(locale, unbuilt?)` (W37) carries an optional injectable `unbuilt` set so the unit test can prove the blog/portal rules with "UNBUILT empty" without `vi.mock`; the subtraction runs per key before the parent-prefix fold (so a built `/blog` index stays disallowed while `/blog/[slug]` is unbuilt). `StaticPathname` (exported by Task 3) is consumed for the tests' type guard.
3. `app/sitemap.ts` is `async` (W31): it awaits `detailSitemapEntries(locale)` per locale after the static entries; `DETAIL_SITEMAP_SOURCES` is a frozen literal (`Object.freeze([])`, W70) — the careers page task edits the literal to add its imported source (no runtime push). No `generateStaticParams` hook — the detail pages own theirs.
4. `src/lib/seo/og.ts` is an added pure module (`ogTitle`, `ogSubline`, `clampWords`, `SysCopy`, `OG_WORDMARK`, `OG_SUBLINE_MAX`) because a Next route file may export only handlers and segment config, and because W38's copy rules deserve fixture-backed unit tests without mocking the renderer; the route wraps next-intl's translator into a `{ t, has }` object. `sys.seo.ogTagline` is the new key (both locales). The route also sets `Cache-Control: public, max-age=86400` explicitly (ImageResponse's own default is a year, immutable).
5. `buildMetadata.alternates` value type is `AlternateTarget = string | Exclude<Href, string>` (the skeleton said `string`): a string is an absolute URL or an already-localized external path; the object form is the typed dynamic `Href` — a bare `pathnames` key string is deliberately not accepted. `openGraph` override additionally accepts `images?: string[]`; `twitter.images` is set alongside. Task 1's `''` → fallback lines are carried verbatim (W38).
6. `articleJsonLd` input adds optional `authorType?: 'Person' | 'Organization'`; `jobPostingJsonLd` adds optional `identifier?: string`; `employmentType` is the Google enum (`FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY | INTERN | OTHER`); `baseSalary.value` is `number | { min, max }` with `unitText`; invalid dates throw outside production and are omitted in production.
7. `LanguageSwitcher`/`LanguageHint` gain no props (W17: tag-read + `alternatePath` fallback); the tag-derived link renders through `next/link` (already-localized path), the fallback through next-intl's `Link` (which always prefixes when `locale` is passed — `/tr` on an EN page, folded by the middleware; WP1 behaviour, now asserted) — a new file `src/design/chrome/use-alternate-path.ts` exports `readAlternateHref`, `alternateHrefToPath`, `useAlternatePath`. `alternateHrefToPath` drops the host (the skeleton's "same host only" wording meant exactly that).
8. `next.config.ts` gains `outputFileTracingIncludes` for the OG route's font folder (belt-and-braces to the `join(process.cwd(), …)` tracer pattern); nothing else in the config changes.
9. The two OG e2e tests are appended to `e2e/seo.spec.ts` in Cycles 3 and 4 (each with a local red→green against `next start`), not in the docs cycle; Task 7's later rewrite of the file carries them (W37/W50).
