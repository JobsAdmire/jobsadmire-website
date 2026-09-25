# Task 10 report — SEO builders: metadata, alternates, sitemap, robots, JSON-LD

**Branch:** `wp1/foundation` (worktree `jobsadmire-website-wp1`) · **Commit:** `bb2bc94` · **Status:** DONE_WITH_CONCERNS (three deviations, all forced or verified; see below)

## What was implemented

| File | What it does |
| --- | --- |
| `src/lib/seo/routes.ts` | `SITE_URL` (trailing slash stripped from `NEXT_PUBLIC_SITE_URL`), `absoluteUrl(locale, href)`, `localeAlternates(href)` → `{ languages: { tr, en, 'x-default' } }` with the self-reference, exported `Href` type. |
| `src/lib/seo/metadata.ts` | `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` → title/description from the bundle page record via `makeT` (**R23:** imported from `@/content/pure`, not the `server-only` adapter), canonical (record override or `absoluteUrl`), alternates, robots, OG, Twitter. |
| `src/lib/seo/jsonld.ts` | `organizationJsonLd` (Organization+EmploymentAgency, İŞKUR permit 1730, tax no, 6 `sameAs`, two postal addresses), `websiteJsonLd`, `breadcrumbJsonLd`, `faqJsonLd` (AEO-only, per docs/SEO.md). |
| `src/lib/seo/JsonLdScript.tsx` | `<JsonLd data />` — `application/ld+json` script, `<` escaped to `<`. |
| `src/app/sitemap.ts` | Static `pathnames` keys (dynamic `[slug]` routes and the four noindex routes excluded) × both locales, each with `alternates` from `localeAlternates`, `changeFrequency: 'weekly'`, `priority` 1 for `/` else 0.7, no `lastModified`. `export const revalidate = 900`. One comment records that blog/careers entries come from the bundle in WP2 — nothing is fetched yet. |
| `src/app/robots.ts` | Preview (`VERCEL_ENV` set and ≠ production) → `Disallow: /`; otherwise allow-all minus `/api/`, both portal-entry paths and both thank-you paths, plus `Sitemap:`. |
| `src/app/[locale]/layout.tsx` | Kept everything Task 9 mounted; added `metadataBase: new URL(SITE_URL)` to the static `metadata`, and the Organization (name `JobsAdmire`, description `t('home.188')`) + WebSite JSON-LD at the top of `<body>`, before `SiteChrome`. |
| `src/app/[locale]/page.tsx` | Added `generateMetadata` calling `buildMetadata` with `pageKey: 'home'`; the `data-testid="home-h1"` heading and the hire `Link` are untouched (`e2e/routing.spec.ts` still passes). |
| `src/app/[locale]/hire-workers/page.tsx` | Added the same `generateMetadata` (`pageKey: 'hire'`, falls back) — see deviation 3. |
| Tests | `src/lib/seo/{routes,metadata,jsonld}.test.ts`, `e2e/seo.spec.ts`. |

## Exact strings `absoluteUrl` produces

```
absoluteUrl('tr', '/')              → https://www.jobsadmire.com/
absoluteUrl('en', '/')              → https://www.jobsadmire.com/en
absoluteUrl('tr', '/hire-workers')  → https://www.jobsadmire.com/isci-talebi
absoluteUrl('en', '/hire-workers')  → https://www.jobsadmire.com/en/hire-workers
absoluteUrl('tr', { pathname: '/blog/[slug]', params: { slug: 'isgucu' } })
                                    → https://www.jobsadmire.com/blog/isgucu
```

`getPathname` was verified synchronous against the installed types (`next-intl@4.14.5`, `createSharedNavigationFns.d.ts:358` — `(args) => string`) and empirically (`/`, `/en`, `/isci-talebi`, `/en/hire-workers`, `/blog/x`). Both helpers stayed synchronous, as ruled.

In the **sitemap** the root is emitted verbatim: `<loc>https://www.jobsadmire.com/</loc>`. In **rendered HTML** Next normalises the lone trailing slash away (`trailingSlash: false`), so the home canonical/hreflang tags read `https://www.jobsadmire.com` — same URL; documented in `e2e/seo.spec.ts`.

## RED → GREEN

RED (`npx vitest run src/lib/seo`, before any implementation file existed):

```
Error: Failed to resolve import "./jsonld" from "src/lib/seo/jsonld.test.ts". Does the file exist?
Error: Failed to resolve import "./metadata" from "src/lib/seo/metadata.test.ts". Does the file exist?
Error: Failed to resolve import "./routes" from "src/lib/seo/routes.test.ts". Does the file exist?
 Test Files  3 failed (3)
      Tests  no tests
```

GREEN (same command, after `routes.ts` / `metadata.ts` / `jsonld.ts` / `JsonLdScript.tsx`):

```
 Test Files  3 passed (3)
      Tests  8 passed (8)
```

## verify

`npm run verify` → typecheck clean, `eslint .` clean, `prettier --check .` "All matched files use Prettier code style!", `vitest run` **19 files / 73 tests passed**. Output pristine apart from the pre-existing Vitest `configLoader: 'native'` warning.

## build

`rm -rf .next && npm run build` — clean:

```
✓ Compiled successfully in 2.3s
  Finished TypeScript in 1544ms
✓ Generating static pages using 9 workers (10/10) in 385ms
├ ○ /robots.txt
└ ○ /sitemap.xml                   15m      1y
ƒ Proxy (Middleware)
```

No warnings beyond the expected `ƒ Proxy (Middleware)` line. `/tr`, `/en`, `/tr/hire-workers`, `/en/hire-workers` all prerendered (SSG); the sitemap carries the 15-minute revalidate.

## Playwright

`next start -p 3100` (pid file in the scratchpad), then
`E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/seo.spec.ts e2e/routing.spec.ts e2e/smoke.spec.ts --project=desktop`:

```
14 passed (1.7s)
  e2e/seo.spec.ts     5 passed
  e2e/routing.spec.ts 8 passed
  e2e/smoke.spec.ts   1 passed
```

Server killed afterwards (port 3100 confirmed closed).

Additional manual verification against the same server (not left as a test): the served `/sitemap.xml` has **32 `<loc>` entries** (16 static routes × 2 locales) and **zero** hits for `tesekkurler|thank-you|portal-girisi|portal-login|abone-onay|abonelikten-cik|newsletter|[slug]`; `/robots.txt` served the production ruleset with `Sitemap: https://www.jobsadmire.com/sitemap.xml`; the home HTML carries both JSON-LD nodes with the real TR tagline as the Organization description.

## Deviations from the brief (all deliberate)

1. **`JsonLd.tsx` → `JsonLdScript.tsx`.** The brief's two filenames, `src/lib/seo/jsonld.ts` and `src/lib/seo/JsonLd.tsx`, differ only in case and therefore collide on macOS' case-insensitive filesystem: `tsc` resolved `@/lib/seo/JsonLd` to `jsonld.ts` and failed with `TS2305` + `TS1149` ("File name … differs from already included file name … only in casing"). Renaming the **component file** was the smaller fix — the brief's `jsonld.test.ts` imports `./jsonld`, so the builders module had to keep its name, and the exported component keeps the brief's name (`<JsonLd data />`). The reason is a comment at the top of the file.
2. **The no-op ternary in `absoluteUrl` was dropped.** The brief's `path === '/' && locale === routing.defaultLocale ? '/' : path` returns `path` in every branch. Behaviour is identical; the trailing slash on the TR root comes from `getPathname` returning `/`, which is now pinned by `routes.test.ts` and stated in a comment.
3. **`src/app/[locale]/hire-workers/page.tsx` also got a `generateMetadata`** (not in the brief's modify list). The prescribed e2e assertion — `/en/hire-workers` canonical equals `https://www.jobsadmire.com/en/hire-workers` — cannot pass otherwise: without its own `generateMetadata` the page inherits only the layout's static `metadata`, which has no canonical. It uses `pageKey: 'hire'`, which has no bundle record yet, so it exercises the fallback path as a second real call site.

Minor, within the brief's latitude: `routes.test.ts` carries two assertions beyond the brief's (the EN root string, and a dynamic `[slug]` href) because the controller pinned the EN root value; `metadata.test.ts` asserts `robots` with `toMatchObject` rather than casting the `Metadata['robots']` union.

## Self-review

- **Completeness** — every file in the brief's list exists (one renamed, above); every helper in "Produces" is exported: `absoluteUrl`, `localeAlternates`, `buildMetadata`, `organizationJsonLd`, `websiteJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `<JsonLd data />`. `breadcrumbJsonLd` has no call site yet (WP2 mounts it on non-home pages, per docs/SEO.md) — it is in the brief's interface list, so it ships.
- **Rulings** — R23 (`makeT` from `@/content/pure`; `BundleSchema.parse(fixture).settings` in `jsonld.test.ts`) and R32 (the three `metadata.test.ts` cases; Organization description `t('home.188')`, name `'JobsAdmire'`) are applied as written.
- **Nothing extra** — no OG image route, no blog sitemap entries, no new dependency, no doc rewrite (docs/SEO.md already specifies exactly this behaviour, so the change set introduces no doc drift).
- **Tests are real behaviour** — the unit tests assert produced strings and the fallback/noindex branches; the e2e asserts served HTML, XML and text, not mocks.

## Concerns

1. **The sitemap lists 14 routes that do not exist yet** (`/hakkimizda`, `/adaylar`, …) because it iterates `pathnames`, as specified. Harmless on this branch (nothing is deployed), but before the Phase A cutover (WP7a) it must list only live pages or GSC will log 404s in the very Crawl-Stats number docs/SEO.md puts under a 12-week watch. Worth a WP7a checklist line.
2. **`openGraph.images` defaults to `/opengraph-image.png`, which does not exist yet** (as instructed — OG generation is WP2). Any preview shared before WP2 will show a broken OG image.
3. **`EXCLUDED` in `sitemap.ts` is a set of literal strings**, so a typo would silently fail to exclude a route. It is covered indirectly (the e2e asserts `/tesekkurler` is absent) and was verified exhaustively by hand against the built sitemap, but a typed `readonly StaticPathname[]` would make it compiler-checked — a one-line hardening if the controller wants it.
4. **`buildMetadata` sets `metadataBase` per page** as well as in the layout (per the brief). Redundant but harmless; if a page ever needs a different origin this is where it would be set.
