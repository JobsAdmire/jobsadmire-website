# Task 4 review — SEO foundation (OG image route, per-locale alternates, hreflang-aware language links, Article/JobPosting JSON-LD, sitemap/robots gating), `d763ac9..f14f635`

**Spec compliance:** ✅ compliant — every brief block is on disk verbatim or differs only by a recorded deviation with a sound reason. Of the 19 whole-file blocks, 17 are byte-identical; of the 26 partial blocks, 21 are exact. The frozen Produces surface is intact, and W17/W20/W31/W37/W38/W45/W90 are evidenced in code, tests and the running app.
**Code quality:** ❌ changes required: 0 Critical, 1 Important, 3 Minor

Reviewer: read-only on the repo. The worktree `jobsadmire-website-wp2` stayed at `f14f635`, and `git status --short` was empty before and after; only ignored build/test output was written. Scratch: `/private/tmp/claude-501/-Users-agentfaraz-projects-admiregroup-jobsadmire/b66860be-3e05-4c03-954a-f55becea5a18/scratchpad/review-task4/` (`$R` below).

## Spec compliance evidence

### Method and runs
- **Verbatim check.** `$R/extract.mjs` pulled the brief's 66 fenced blocks into `$R/blocks/` (index in `INDEX.txt`).
  - `$R/compare.sh` ran `diff -u` on the 19 whole-file blocks → `$R/full-compare.txt`.
  - `$R/contain.mjs` checked the 26 partial blocks (replaced import lines, appends, anchored doc paragraphs) for containment → `$R/contain.txt`.
  - The five misses were line- or word-diffed by hand (below).
- **Gate at HEAD, run once:** `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`.
  - tsc and eslint are clean, and Prettier reports "All matched files use Prettier code style!".
  - Vitest: **Test Files 58 passed (58) · Tests 377 passed (377)** (30.5 s; `$R/verify-head.log`).
  - Per-file counts equal the brief's: unbuilt 2, routes 10, sitemap-sources 2, sitemap 4, robots 3, jsonld 10, og 6, route 3, fonts 2, metadata 9, use-alternate-path 3, LanguageSwitcher 3, LanguageHint 4. That is +49 tests and +9 files over BASE (328 / 49).
  - The implementer's per-commit logs (`scratchpad/verify-c1…c6b.log`) read 345 → 353 → 364 → 369 → 377 → 377, as the report's table says. That is corroboration only; I ran the gate at HEAD alone.
- **One build:** `NODE_OPTIONS=--max-old-space-size=4096 npm run build`.
  - Next 16.3.5 (Turbopack) is green with no warnings.
  - The route table lists `ƒ /og/[locale]/[pageKey]` with no Revalidate value, `○ /robots.txt` and `○ /sitemap.xml` (15m).
  - `CLAUDE.md` is untouched (no `nextjs-agent-rules` block).
- **One Playwright run** against `next start` on :3000: `E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/seo.spec.ts e2e/chrome.spec.ts` → **24 passed**. That is seo 7 × 2 projects, including both new OG tests, and chrome 5 × 2 (`$R/pw.log`).
- **Scratch probes against the same server,** run one after another:
  - `$R/probe-http.sh`: OG headers and timings, 404 keys, sitemap, robots, head tags → `$R/probe-http.txt`.
  - `$R/jsbudget.mjs`: the W120 JS measurement.
  - `$R/probe-hydration.mjs`: SSR vs hydrated pills, hydration errors with a positive control, the hint's target, and the client-navigation window → `$R/probe-hydration.txt`.
- **Second server session.** After killing the server, I restarted `next start` once, with no rebuild and no Playwright test run, for `$R/probe-dynamic.mjs` → `$R/probe-dynamic.txt`. It covers the one `ƒ` page, `/tesekkurler`.
- I killed the server right after each session; no process of mine is left.

### Verbatim
- **Identical whole files (17):**
  - `src/lib/seo/`: `unbuilt.test.ts`, `sitemap-sources.ts` and its test, `og.ts` and its test.
  - `src/app/`: `sitemap.ts`, `robots.ts` and both their tests; `og/[locale]/[pageKey]/route.tsx` and its test.
  - `src/design/fonts/`: `fonts.test.ts`, `README.md`.
  - `src/design/chrome/`: `use-alternate-path.ts` and its test, `LanguageSwitcher.tsx` and its test.
- **`next.config.ts`** differs only by keeping Task 2's `experimental.serverActions.bodySizeLimit: '4mb'` block (W73/W116), which is present at BASE `d763ac9`. `git diff d763ac9..HEAD -- next.config.ts` is the tracing line plus its three comment lines, nothing else.
- **`metadata.ts`** differs by one comment line. The disk carries Task 1's actual text, `…(W23/W38). Task 4's rewrite keeps this.` (BASE `metadata.ts:23`), where the brief printed `…(W23).`
- **Partial blocks:** 21 are exact and 1 differs only by indentation (52). The other four:
  - 38 (`metadata.test.ts`): one `expect(buildMetadata(…).openGraph?.images).toEqual([…])` re-wrapped by Prettier; the line diff shows nothing else.
  - 53 (`LanguageHint` switch): Prettier's JSX wrap of the fallback `<Link>`, plus the brief's statement-form `;`. It is contained once whitespace and trailing commas are ignored.
  - 56 (the PRD § 11 clause) and 60 (SEO.md § JSON-LD): the word diff is `{+to be+}` before "called by", nothing else.
- **CONTENT-MODEL inline edits:** all three are present once each (the `pages` row sentence, the § Adding copy `sys.seo.ogTagline` clause, the § Page records `pageKey` sentence).

### Produces (frozen) — intact, nothing extra exported
- **`routes.ts`:**
  - `UNBUILT_PATHNAMES: ReadonlySet<keyof typeof pathnames>` holds the 19 keys.
  - `robotsDisallowPaths(locale, unbuilt = UNBUILT_PATHNAMES): string[]`.
  - `OG_PAGE_KEYS: ReadonlySet<string>` is `site` + the 22 `PAGE_KEYS`.
  - `pageOgImageUrl(locale, pageKey)`.
  - The `StaticPathname` line is byte-identical to BASE (Task 3's export). The file's diff is append-only, so `SITE_URL`, `absoluteUrl`, `localeAlternates`, `NOINDEX_PATHNAMES`, `isNoindexPathname` and `noindexExternalPaths` are untouched.
- **`sitemap-sources.ts`:** `SitemapSource`, `DETAIL_SITEMAP_SOURCES = Object.freeze([])` (W70), `detailSitemapEntries(locale, sources?)`.
- **`og.ts`:** `SysCopy`, `OG_WORDMARK`, `OG_SUBLINE_MAX = 140`, `ogTitle`, `ogSubline`, `clampWords`.
- **The route:** it exports only `revalidate = 86400` and `GET`; its params are `{ locale, pageKey }`, where `pageKey` carries the `.png`.
- **`metadata.ts`:** `AlternateTarget = string | Exclude<Href, string>`, `MetadataOpenGraphOverride` (with `images`), and `buildMetadata({ …, alternates?, openGraph? })`.
- **`jsonld.ts`:** `ArticleJsonLdInput`/`articleJsonLd` and `JobPostingJsonLdInput`/`jobPostingJsonLd`. The four WP1 builders are unchanged (append-only diff).
- **`use-alternate-path.ts`** (`'use client'`): `readAlternateHref`, `alternateHrefToPath`, `useAlternatePath`. The `LanguageSwitcher`/`LanguageHint` props are unchanged, and `LanguageLink` is module-private.
- **`next.config.ts` tracing key.** `outputFileTracingIncludes['/og/[locale]/[pageKey]']`: Next's bundled picomatch, with `contains: true`, matches this unescaped key against `/og/[locale]/[pageKey]`, `…/route` and `app/og/…/route`. So the belt applies; the tracing itself is provable only on the preview.

### W20 / W37 — sitemap and robots gating
- **`unbuilt.test.ts` is green.** The walker strips route groups, and the 19-key set equals `pathnames` minus `{/, /hire-workers, /thank-you}`.
- **`sitemap.ts`:**
  - It excludes `NOINDEX_PATHNAMES ∪ UNBUILT_PATHNAMES` and imports `StaticPathname` from `routes.ts`. **The parked local duplicate is gone:** the diff deletes `type StaticPathname = …` from sitemap.ts.
  - The live `/sitemap.xml` holds exactly 4 URLs (`/`, `/isci-talebi`, `/en`, `/en/hire-workers`), `weekly`, priority 1/0.7, with tr/en/x-default alternates. It has no unbuilt or noindex URL and no `[`.
- **Robots:**
  - `robotsDisallowPaths` subtracts per key before the parent fold, and `robots.ts` consumes it.
  - The live robots.txt reads `Allow: /`, `Disallow: /api/`, `Disallow: /tesekkurler`, `Disallow: /en/thank-you`, `Sitemap: https://www.jobsadmire.com/sitemap.xml`.
  - With UNBUILT empty it equals `noindexExternalPaths` (unit-pinned), `/en/blog` included.
- **No e2e asserts `Disallow: /blog`.** A grep of `e2e/` finds only `Disallow: /tesekkurler`.
- **`routes.test.ts` line 2 is extended, not replaced.** It keeps Task 3's four names, adds Task 4's four as the union, and adds the brief's `PAGE_KEYS` import line.

### W31 / R23 / R56
- **`DETAIL_SITEMAP_SOURCES` is frozen and empty.** `sitemap.ts` awaits `detailSitemapEntries` per locale after the static entries. No source exists yet, so the bundle-read rule is vacuous today (a heads-up for the careers task is under Parked, P6).
- **Imports:**
  - `og.ts` and `metadata.ts` use `@/content/pure`.
  - `jsonld.ts`, `sitemap-sources.ts` and `routes.ts` use neither the adapter nor pure.
  - The only adapter import is in the OG route handler, a server entry, as the brief prescribes.
  - No file under `src/` imports `design-package/**` or `src/content/local/*`.

### W38 / W14 / W90 — the OG route
- **Behaviour on the running app:**
  - Known keys answer 1200×630 `image/png`: 6 fetched, every PNG signature and IHDR checked.
  - An empty 404 answers `/og/tr/not-a-page.png`, `/og/de/home.png`, `/og/TR/home.png`, `/og/tr/home.jpg`, `/og/tr/HOME.png`, `/og/tr/home.png.png`, `/og/tr/.png`, `/og/tr/constructor.png`, `/og/tr/__proto__.png` and `/og/tr/hasOwnProperty.png`.
  - `/og/tr/home` and `/en/og/tr/home.png` 404 through the locale tree (HTML).
  - `/og/en/site.png` is 200, and HEAD is 200 `image/png`. Nothing returns a 500.
- **Copy follows the rule:**
  - TR/EN `home` and `site` show the wordmark title plus `sys.seo.ogTagline`, because the real home records carry `''`.
  - `hire` shows hire.264/hire.265, with the subline clamped at a word boundary and ending in `…`.
  - The EN images carry the EN tagline: the explicit `locale` reaches `request.ts`'s `requestLocale`.
  - I viewed `og-en-hire.png`, `og-tr-home.png` and `og-en-calc.png`: Archivo Bold, and the Turkish glyphs İ Ş ş ı ç ü render correctly.
- **`sys.seo.ogTagline`** is in both `tr.json` and `en.json`, and the parity test is green.
- **W90:** no client component reads `sys.seo.*`. A grep over `src/` finds only `og.ts` and the two message files, and the W90 picker strips `sys.seo` from the client provider.
- **Font:**
  - Recomputed `shasum -a 256` equals both pins (`951a0eba…8983`, `108b4e57…716b`). The file is 192,180 B with magic `00 01 00 00`.
  - It is the static Bold instance: the table directory has no `fvar`, `usWeightClass` is 700, and the name is "Archivo Bold".
  - `OFL.txt` is ASCII with LF endings; there is no `.gitattributes`, and `core.autocrlf` is unset.
- **W14:** every character of every current OG string (72 distinct, including ₺ İ ş — · …) is in the font's `cmap`, so no fallback-glyph fetch can be triggered today.
- **`next.config.ts`** carries only the tracing line and its comment; Task 2's `serverActions` block is intact.

### D16 — alternates, og:type
- **With an `alternates` override** (unit-tested, both D16 cases), `buildMetadata` emits only the given locales, plus the page's own locale from `href`, plus `x-default` = TR when present, else self.
- **Without an override,** `localeAlternates(href)` is unchanged. Live: `/isci-talebi` ↔ `/en/hire-workers`, with x-default TR.
- **`og:type article`** comes only from `openGraph.type: 'article'`, and no page passes it.
- **Live pages** show `og:type website`, and `og:image`/`twitter:image` = `https://www.jobsadmire.com/og/{locale}/{pageKey}.png`.

### W17 / R18 / R58 — the language links
- **The hook** is `useSyncExternalStore(subscribe, getSnapshot, () => null)`:
  - `subscribe` is module-level: one `MutationObserver` on `<head>`, disconnected on unmount.
  - `getSnapshot` is memoised per locale and returns a string or null. Primitives compare stably, so there is no render loop.
  - There is no `setState` in an effect, and lint is clean.
  - The fallback `alternatePath(usePathname())` stays (R58).
- **Built app, 4 routes:**
  - The SSR pills are the R58 form (`/tr`, `/en`, `/tr/isci-talebi`, `/en/hire-workers`). After hydration they carry the tag paths (`/`, `/en`, `/isci-talebi`, `/en/hire-workers`).
  - The hint on TR pages targets `/en` and `/en/hire-workers`.
  - **No console error and no pageerror.**
  - Positive control: a pre-hydration text change on a pill surfaced as `Minified React error #418`. The detector would have caught a mismatch, so SSR equals the first client render.
- **Client navigation** (`/` → `/isci-talebi`, `/en` → `/en/hire-workers`): the pills follow the new tags 0.5–0.6 ms after the head swap, timed by a MutationObserver; no painted frame is stale.
- **The one ƒ page** (`/tesekkurler`, `/en/thank-you`): the hreflang tags are in `<head>` for both a Chrome UA and a Googlebot UA, the pills and hint follow them, and there are no errors. The head-only subscription is therefore sufficient in the current tree.

### JSON-LD
- **`articleJsonLd`** is a BlogPosting with headline, description, image, url, `mainEntityOfPage` (WebPage), ISO `datePublished`/`dateModified`, an author (Person by default, or Organization), a publisher Organization with an ImageObject logo, and `inLanguage`.
- **`jobPostingJsonLd`** carries:
  - title, description and url; ISO `datePosted`/`validThrough`; the `employmentType` enum;
  - `hiringOrganization` (name, `sameAs` = siteUrl, logo);
  - `jobLocation` as Place/PostalAddress with an ISO-2 country;
  - optional `MonetaryAmount` (a value or min/max) and a `PropertyValue` identifier.
- **Both builders** compact away every `undefined` key. An invalid date throws a RangeError outside production and is omitted in production.
- **No visitor data.** Absolute URLs come from the caller and from `settings.siteUrl`, and the logo `public/brand/ja-mark.png` exists (the same URL as WP1's Organization node).

### Docs (W45) and ownership
- **SEO.md:**
  - The "Per-locale slugs (D16)" paragraph and the § Sitemap, § Robots and § OG images paragraphs are exact.
  - § JSON-LD is exact except for "to be called by". Task 5's anchor clause, "`breadcrumbJsonLd` and `faqJsonLd` are written but not yet called from any page", is verbatim (Task 5 brief L3799 anchors on it).
- **ARCHITECTURE:** the § Routing and § Chrome paragraphs are exact, plus three layout-tree fragments.
- **CONTENT-MODEL:** the three edits.
- **PRD § 11:** the phrase is removed and the clause appended after the final period.
- **`CLAUDE.md`** is untouched, which is correct: the brief lists it under "Not touched, on purpose".
- **Controller-owned paths are untouched:** `git diff --stat d763ac9..HEAD -- docs/superpowers/ docs/WEBSITE-HANDOFF.md CLAUDE.md contract/ design-package/ src/content/local/` is empty.
- **Later briefs:**
  - No Task 5–9 brief or addition anchors on any text Task 4 changed.
  - Task 5's `LanguageHint` anchors are intact: the outer `role="region"` className line is byte-identical to Task 5 brief L1400, and the `LanguageHint link target` describe is present.
  - Task 7's `seo.spec.ts` rewrite carries both OG tests with the same assertions.

### JS budget (W120)
- Method: gzip-9 over the `<script src>` set, the `noModule` polyfill excluded.
- `/`, `/en`, `/isci-talebi`, `/en/hire-workers`: **167,851 B** (br-11 144,978) each, 10 scripts, 556,648 B raw.
- `/tesekkurler?form=hire`: 168,242 / 145,334 (11 scripts).
- The report is confirmed exactly: +754 B over Task 3's 167,097 (BASE `d763ac9` has no `src` change after `6a22c01`), and 36,949 B under 204,800.

## Findings

### Critical
None.

### Important
**I1 — The OG image is not cached where the contract, the comment, SEO.md and the PRD say it is.**
- **Where:**
  - `src/app/og/[locale]/[pageKey]/route.tsx:11-14`: the comment says "cached a day … A content change reaches the image on the next revalidation; nothing here is per-request", above `export const revalidate = 86400`.
  - `route.tsx:95`: `Cache-Control: public, max-age=86400`.
  - `docs/SEO.md:40`: "`revalidate = 86400` … `OG_PAGE_KEYS` … bounds the cache to known keys × 2 locales".
  - `docs/PRD.md:65`: "OG images via `next/og` (Node runtime, bundled font bytes, ISR)".
- **Scenario:**
  - The handler has dynamic params and no `generateStaticParams`, so Next builds it as `ƒ`. `revalidate` does not cache it, and every request re-renders.
  - On Vercel, the documented way to give a function response a CDN lifetime is `s-maxage` in `Cache-Control`, or `CDN-Cache-Control`/`Vercel-CDN-Cache-Control`; every function-caching example in Vercel's docs uses one of these. With `public, max-age=86400` alone, whether the edge keeps the PNG is at best implicit, which is the implementer's concern 1.
  - If it does not, every crawler or unfurler fetch is a function invocation, and a burst against the 46 URLs is never absorbed at the edge.
  - Either way, the comment, SEO.md and PRD § 4 describe a Next-level ISR cache that does not exist.
- **How confirmed:**
  - The build table shows `ƒ /og/[locale]/[pageKey]` with no Revalidate value.
  - 16 sequential GETs (8 × `/og/tr/home.png`, 8 × `/og/en/hire.png`) took 20–27 ms each, with identical bytes and no `x-nextjs-cache` header.
  - The Vercel docs search covered the cache-control-headers and CDN-cache pages.
  - The render cost is small, so this is about contract honesty and edge absorption, not an outage.
- **Severity path.** If the preview shows `x-vercel-cache: HIT` on a repeat request, I1 reduces to the wording fixes. The explicit `s-maxage` is still recommended.
- **Fix:** ⚠️ 1. It touches a frozen Produces line, so it needs the ruling first.

### Minor
**M1 — Every language pill remounts once after hydration.**
- **Where:** `src/design/chrome/LanguageSwitcher.tsx:85-93` and `src/design/chrome/LanguageHint.tsx:90-104`.
- **Scenario:**
  - The tag branch (`next/link`) and the fallback branch (next-intl `Link`) are different component types, and every page carries hreflang tags.
  - So about 50 ms after load, React unmounts each SSR `<a>` and mounts a new one. That includes pills whose href does not change (`/en` → `/en`).
  - A pill focused at that instant loses focus, and assistive tech sees the element replaced.
- **Confirmed:** a document-start MutationObserver logged `remove` + `add` for all 6 pills on `/`, `/en`, `/isci-talebi` and `/en/hire-workers`. There was no console error. This is the implementer's concern 4.
- **Fix (final review):** render one element type in both branches, e.g. `next/link` with the fallback href computed through next-intl's `getPathname` for `to`. Hydration then only patches `href`.
  - The forced `/tr` form that R58's switcher test asserts is not needed for correctness: `localeDetection: false`, and the tag branch already links TR paths unprefixed.
  - Update that one assertion if the prefix is dropped.

**M2 — Stale `NOINDEX_PATHNAMES` doc comment.**
- **Where:** `src/lib/seo/routes.ts:19-29`. The comment still says robots.txt disallows the set "through `noindexExternalPaths`" and to "go through `noindexExternalPaths`".
- **Why stale:** since this task, `robots.ts` consumes `robotsDisallowPaths`, which repeats the fold itself. `noindexExternalPaths` now has no production caller; a grep finds `routes.test.ts` only.
- **Fix:** name `robotsDisallowPaths` as the robots path, and `noindexExternalPaths` as its UNBUILT-empty reference (pinned by `routes.test.ts`).

**M3 — PRD § 11 still says the sitemap is ungated.**
- **Where:** `docs/PRD.md:112`: "a `sitemap.ts` (not yet gated to real routes — `docs/SEO.md`)".
- **Why stale:** since Task 4 the sitemap lists the built routes only (4 URLs, W20).
- **Context:** the brief's doc list missed the sentence. But the repo rule is that docs match the code in the same change set, and the neighbouring § 11 bullets already carry WP2a amendments in this style.
- **Fix:** append "— gated to the built routes since WP2a Task 4 (`UNBUILT_PATHNAMES`, W20)".

## ⚠️ Design items needing a controller ruling

1. **OG caching (I1): recommend the CDN header now, not prerendering.**
   - **Change:**
     - Set `route.tsx:95` to `Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800`. Browsers keep the PNG a day; Vercel's CDN keeps it fresh a day, then serves it stale for up to a week while one background render refreshes it.
     - Update `route.test.ts:62`'s expectation.
     - Keep `export const revalidate = 86400`: it is frozen, harmless, and feeds the header.
   - **Correct the words:**
     - The route comment (`:11-13`) → "Next renders this handler per request (ƒ: dynamic params, no generateStaticParams); the day-long cache is the CDN's `s-maxage`".
     - `docs/SEO.md:40` → "bounds the CDN cache".
     - `docs/PRD.md:65` → replace "ISR" with "CDN-cached a day, stale-while-revalidate a week".
     - Task 4's route line in `produces-final.md`.
   - **Why not prerender** (`generateStaticParams` over `OG_PAGE_KEYS × locales` + `dynamicParams = false`):
     - It would make `revalidate` real and honour "ISR" literally, and 46 renders at ~25 ms each cost about 1–2 s of build.
     - But it needs a build spike to confirm two things: that Next 16 prerenders a route handler with dynamic params, and how Vercel treats the handler's own `Cache-Control` on an ISR output.
     - The header change is one line, certain, and proven on the preview by one `x-vercel-cache: MISS → HIT` pair. Prerendering stays available later with the same URLs.

2. **Detail pages and the shared template page record.** Not a Task 4 fix; rule before the first WP2b detail page.
   - **The contract:** Task 4 tells `/blog/[slug]` and `/careers/[slug]` to pass `pageKey: 'blogArticle' | 'careersDetail'`. That is one record per template, not per article.
   - **The precedence:** `buildMetadata` gives that record's `canonical`, `titleId` and `descriptionId` precedence over the caller's per-article `href`, `fallbackTitle` and `fallbackDescription`. There is no per-article title override; only `openGraph.images` has one.
   - **Today it is safe:** in both bundles the two records carry `titleId: ''`, `descriptionId: ''`, `canonical: null` and `ogImage: null`, checked.
   - **The failure mode:** a single non-null `pages.blogArticle.canonical` or non-empty `titleId`, for example an Ops CMS edit in Phase B, would collapse every article onto one canonical URL or one title.
   - **Recommendation now:** a unit test pinning those four fields for `blogArticle` and `careersDetail` in both bundles, plus one CONTENT-MODEL sentence: "template records never carry per-page SEO fields".
   - **Later, if Phase B lets editors fill template records:** make `buildMetadata` ignore the record's canonical, title and description when `href` is an object (dynamic) href.

## The implementer's concerns and deviations — verdicts

### Concerns
1. **The OG route is not ISR-cached, and Vercel may not cache on `max-age` — CONFIRMED.**
   - Locally the route is `ƒ`, renders per request (20–27 ms) and sends no `x-nextjs-cache`.
   - Vercel documents `s-maxage` or `CDN-Cache-Control` as the CDN TTL for function responses.
   - Ruling ⚠️ 1: `public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800` plus the comment, doc and PRD wording, not prerender.
2. **Preview proof pending — VALID, and controller-owned.** Run after the push, and after ⚠️ 1 if adopted.
   - **Access:** Deployment Protection is on for previews. Pass `x-vercel-protection-bypass: <automation secret>` or use a Vercel share link / the Vercel MCP fetch.
   - **Cache:** run `curl -s -o /dev/null -D - <preview>/og/tr/home.png` twice. Expect `200` and `content-type: image/png`, and note the Cache-Control as delivered and `x-vercel-cache`.
     - With ⚠️ 1 adopted, expect `MISS` then `HIT`.
     - With today's header, `MISS` twice is the ⚠️ 1 evidence.
   - **Bytes:** `curl -s <preview>/og/tr/home.png | head -c 24 | xxd` should show the PNG signature and IHDR `0x4b0 × 0x276` (1200×630). Sizes should be ≈ local: 61,381 B for `/og/tr/home.png`, 87,370 B for `/og/en/hire.png`.
   - **404s:** `/og/tr/not-a-page.png` and `/og/de/home.png` → `404`, never `500`; `/og/tr/home` → HTML `404`.
   - **Tracing:** the function log of the first request should show `200` and no `ENOENT … Archivo-Bold.ttf`.
   - **Playwright:** run only the OG pair (`-g "OG image|og:image"`), not the whole file.
     - Task 3's `robots.txt serves the production rules` case asserts `Disallow: /tesekkurler`.
     - A preview's static robots.txt is built with `VERCEL_ENV=preview` → `Disallow: /`; the unit test "blocks everything on a preview deployment" proves it. So that case is red on every preview by design.
     - `scripts/gate.sh` runs the whole suite against the given URL, so Task 7's gate will hit the same thing (Parked, P1).
   - **Ledger:** record the two curl lines under T0c/Task 4.
3. **Commit trailer `Claude Opus 5.5` vs the branch's `Claude Fable 5.1` — cosmetic, no action.** The six commits are unpushed; if uniformity is wanted, a message-only reword before the push changes no tree.
4. **Pill remount after hydration — CONFIRMED, Minor (M1).**
5. **The EN `hire` subline "we file every work permit…"** — this is package copy (hire.265), not Task 4's. It stays with WP-C's "never we" audit.

### Deviations
1. **`next.config.ts` merge — accept.** Required by the inherited tree: the brief's whole file predates W73/W116 and would have deleted `serverActions.bodySizeLimit`. Only the tracing line and its comment were added, confirmed against BASE.
2. **`metadata.ts` comment — accept.** Task 1's real comment is kept verbatim, which is the intent of the instruction; the brief misquoted it.
3. **"to be called by" — accept.** It is accurate, since no page calls the builders yet. No later brief anchors on those words, and Task 5's anchor clause is intact.
4. **ARCHITECTURE layout-tree rows — accept.** They keep the repository map true, and no later brief anchors on those lines.
5. **Vitest 4 RED-at-first-use — accept.** Same failing files, same cause; the RED evidence still shows the missing exports.
6. **The two Prettier re-wraps — accept.** Verified formatting-only (blocks 38 and 53).
7. **e2e once, on port 3000 — accept.** W69 and the memory rule allow it; I reproduced 24/24 on one build.
- **Also accepted:**
  - The PRD sentence shape (report deviation 8). The deletion leaves "…, Sentry, and the synthetic-lead cron and daily digest (…)." grammatical, and the clause is appended after the period.
  - The CONTENT-MODEL `. ` separator.

## Parked (out of Task 4's scope, for the WP2a final review)
- **P1 — Task 7 / gate.**
  - The `robots.txt serves the production rules` e2e case is local-only, and `scripts/gate.sh` runs every spec against a preview. Make it environment-aware in Task 7's seo.spec rewrite (assert `Disallow: /` on a preview).
  - The gate also needs a Deployment Protection bypass; neither `gate.sh` nor `playwright.config.ts` sends one.
- **P2 — The OG title and `og:title` can drift.**
  - The image reads `sys.seo.<pageKey>.title`; the page's `og:title` reads the caller's `fallbackTitle`.
  - It is visible today on `/tesekkurler`: `og:title` is "Teşekkürler", the image title is "JobsAdmire". That page is noindex.
  - WP2b pages that follow the Produces comment pass `sys('seo.<pageKey>.title')`. A page test, or deriving the fallback inside `buildMetadata`, would enforce it.
- **P3 — No `og:image:width`/`height`/`alt`.** The contract is `images?: string[]`. Emitting `{ url, width: 1200, height: 630, alt: title }` would help first-share rendering on Facebook and LinkedIn and give the image an alt text. That is a small contract extension.
- **P4 — No `lastModified` in the sitemap.** The WP1 static entries carry none, and Google reads only lastmod. The careers source should emit it from the bundle's dates.
- **P5 — Fallback glyphs.**
  - All current OG copy is covered by Archivo Bold. An emoji, or a symbol such as ✓, in future SEO copy is not.
  - The renderer then draws tofu or, per my understanding of `@vercel/og`'s dynamic asset loader, fetches a fallback font or emoji from a third-party CDN at render time (W14).
  - A unit test asserting that every OG string's code points are in the font's cmap, or stripping unsupported code points in `ogTitle`/`ogSubline`, makes W14 hold by construction.
- **P6 — The careers sitemap source (W31/R23).**
  - `SitemapSource` takes only `locale`, so the openings source must load the bundle itself through the server-only adapter.
  - Keep it beside the careers page, not in `src/lib/seo/`.
  - `sitemap-sources.test.ts` will then import it. Vitest aliases `server-only`, so it loads, but it reads the real bundle.
- **P7 — PRD § 4:63.** "sitemap generated from the tagged content bundle" is a target statement. As built, the static entries come from `pathnames`, and the bundle joins with the detail sources. Align it in the final doc pass.
- **P8 — Nits:**
  - `loadArchivoBold` caches a rejected read for the life of the instance: harmless for ENOENT, sticky for a transient error.
  - `compact`'s comment says nested nodes go through it; they don't, though none has an optional field today.
  - The title has no clamp, which is fine for SEO titles up to about 120 characters.
  - `route.test.ts` asserts `/JobsAdmire/g` occurs exactly twice in the serialized card, so any change to the wordmark markup breaks it.
  - The hint's switch link has no `hrefLang="en"` (a WP1 carry-over).
  - The card's wordmark literal duplicates `OG_WORDMARK`.
  - `robotsDisallowPaths` repeats `noindexExternalPaths`' fold; the UNBUILT-empty equality test pins them together.
