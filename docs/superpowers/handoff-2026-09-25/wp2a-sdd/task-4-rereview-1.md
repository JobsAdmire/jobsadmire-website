# Task 4 — fix round 1 re-review (`b62c4af..e0b6add`: 74a9733, abd5b3c, dc34942, e0b6add)

**Fix round 1 verdict:** ✅ all findings addressed — I1 (W123), M1, M2, M3 and W124 are fixed, covered by tests and verified on the built app; one new Minor doc drift (`docs/ARCHITECTURE.md:289` still describes the removed `<Link locale>` / `/tr` fallback) and one comment nit remain, neither blocking.
**Regressions:** none — gate green at HEAD (58 files / 380 tests), build green, Playwright seo + chrome 24/24, no console or hydration errors on the four pages, JS ±0 B gz-9.

Reviewer: read-only on the repo. Worktree `jobsadmire-website-wp2` at `e0b6add` on `wp2/foundation`; `git status --porcelain` was empty before and after, and the build did not append to `CLAUDE.md`. Scratch: `/private/tmp/claude-501/-Users-agentfaraz-projects-admiregroup-jobsadmire/b66860be-3e05-4c03-954a-f55becea5a18/scratchpad/rereview-task4/` (`$RR`). Evidence files: `gate.log`, `build.log`, `pw.log`, `probe-og.txt`, `probe-r58.txt`, `probe-m1.mjs`/`probe-m1.txt`, `jsbudget.txt`, `mutation-old-code.log`, `mutation-w124.log`, `tscheck/`.

Heavy jobs ran one at a time: gate → build → `next start` (probes + e2e) → server killed. The two mutation runs are single-file Vitest runs in a scratch harness (`$RR/mut`, with `node_modules` symlinked, BASE code copied in); no repo file was touched.

## Per item (1–5)

### 1. W123 / I1 — OG images CDN-cached, not ISR — ✅
- **Code.**
  - `route.tsx:14` keeps `export const revalidate = 86400`.
  - `:97-99` sends `` `public, max-age=${revalidate}, s-maxage=${revalidate}, stale-while-revalidate=604800` ``.
  - The top comment (`:11-13`) contains the brief's sentence verbatim.
  - Neither `route.tsx` nor `route.test.ts` says "ISR" or "revalidation" any more.
- **On the wire** (`next start`, `$RR/probe-og.txt`).
  - `curl -I /og/tr/home.png` → `HTTP/1.1 200 OK`, `cache-control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800`, `content-type: image/png`.
  - GET gives the same headers, as does `/og/en/hire.png`. There is no `x-nextjs-cache`.
  - Next's `ImageResponse` merges option headers with `headers.set` (`next/dist/server/og/image-response.js:56-63`), so the route's value replaces the default instead of being appended to it. Confirmed on the wire.
- **404s.** `/og/tr/not-a-page.png` → 404, `/og/de/home.png` → 404, `/og/tr/home` → HTML 404.
- **PNG.** The signature is `89504e470d0a1a0a` and IHDR is `0x04b0 × 0x0276` = **1200×630**. Sizes are 61,381 B (`tr/home`) and 87,370 B (`en/hire`), byte-for-byte the first review's figures, so rendering is unchanged.
- **Build table:** `ƒ /og/[locale]/[pageKey]` with no Revalidate value, which is what W123 describes.
- **Docs.**
  - `docs/SEO.md:40` states `ƒ`, says "`revalidate = 86400` caches nothing at the Next layer (kept: frozen, harmless, feeds the header)", gives the full header and "bounds the CDN cache".
  - `docs/PRD.md:65` reads "CDN-cached a day, stale-while-revalidate a week (W123)".
  - No ISR claim is left in SEO.md § OG images or PRD § 4.
- **Test.** `route.test.ts:62-64` `toEqual`s the full header object.
  - The renderer is mocked, so the test pins the options handed to `ImageResponse`. The curl above proves the header that is actually delivered.

### 2. M1 — language pills render one element type — ✅ (docs: see N1)
- **Code.**
  - `LanguageSwitcher.tsx:86-97`: one `NextLink`, `href = alternate ?? getPathname({ href: fallback, locale: to })`, with `prefetch={false}`, `hrefLang={to}` and `aria-current` kept.
  - `LanguageHint.tsx:62,99-101`: `switchHref = alternate ?? getPathname({ href: target as Href, locale: 'en' })` and one `NextLink`.
  - All hooks still run unconditionally before the hint's early `return null`.
  - `getPathname` is only evaluated when there is no tag (`??`).
- **(a) Do the tests exercise the switch and assert node identity? Yes.**
  - Each test renders with no tag in `<head>`, so the component is in the fallback branch, and captures the `<a>`.
  - It then appends `<link rel="alternate" hreflang="en">`, which is exactly what `use-alternate-path.ts:34-43`'s `MutationObserver` subscription watches.
  - It `waitFor`s the tag's href. That proves the branch switched: the fallback `/en` ≠ `/en/blog/seasonal-workforce`.
  - Finally it asserts `toBe(before)`, i.e. `Object.is`.
- **Why the old code fails these tests.**
  - The old fallback was next-intl's `Link` → `BaseLink` → `LocaleChangingLink` (when switching locale) → `NextLink`. The tag branch was `NextLink` itself.
  - A different element type at the same position means React unmounts and mounts a new `<a>`.
  - **Empirically:** I ran HEAD's two test files against BASE `b62c4af`'s components in the scratch harness (`mutation-old-code.log`). Result: 3 failed / 6 passed.
    - Both M1 cases fail on `Object.is`. Switcher: `expected <a hreflang="en" …> to be <a hreflang="en" …>`. Hint: `expected <a …> to be <a hreflang="en" …>`; the old fallback got its `hreflang` from `LocaleChangingLink`.
    - The updated `/` assertion also fails, because the old code gives `/tr`.
  - The RED the implementer reported is reproduced.
- **(b) Browser, built app** (`probe-m1.txt`: a MutationObserver installed at document start that assigns every pill a sequence id when it is first added).
  - **`/`, `/en`, `/isci-talebi`, `/en/hire-workers`:**
    - 6 pill adds, all by the parser (`readyState` = `loading`), **0 removals, 0 `href` changes** after hydration.
    - The SSR pills = the hydrated pills = the hreflang tags' paths. Hydration now patches nothing: on static pages the fallback and the tag agree.
    - Before the fix (first review, `f14f635`), all 6 pills were removed and re-added about 50 ms after load, and the TR pill went from `/tr` in SSR to `/` after hydration.
  - **Focus.** In the same observer, the first pill the parser inserted was focused before any script ran.
    - After hydration + 600 ms it was still `document.activeElement`: the same node (id #1), still connected, on all four pages.
  - **The hint's switch link** (TR pages) mounts once after hydration, which is R18's design. Its href equals the `en` tag's path.
  - **Positive controls.**
    - A forced `replaceWith` of a pill was logged as `REMOVE #1` + `add #7`.
    - A forced pre-hydration text mismatch surfaced React #418 as a `pageerror`.
    - Both detectors are live.
  - **Console / pageerror:** none on the four pages.
- **(c) The R58 fallback change `/tr` → `/` is safe — not a regression.**
  - **Config.**
    - `src/i18n/routing.ts:35-37`: `localePrefix: 'as-needed'`, `localeDetection: false`, cookie `ja_locale`.
    - `src/proxy.ts` is the next-intl middleware behind a 410 pre-filter.
  - **Source.**
    - In next-intl 4.14.5, `middleware/resolveLocale.js` reads the cookie (prio 2) and Accept-Language (prio 3) only `if (routing.localeDetection)`, so an unprefixed path always resolves to `tr`.
    - `syncCookie.js` then rewrites an outdated cookie on document requests.
  - **curl** (`probe-r58.txt`).
    - `/` with `Cookie: ja_locale=en`, with `Accept-Language: en`, with `en-US,en;q=0.9`, and with the cookie plus Accept-Language: every case gives **200 `<html lang="tr"`**.
    - `curl -sI -H 'Cookie: ja_locale=en' /` gives `HTTP/1.1 200 OK`, **no Location**, `x-middleware-rewrite: /tr` and `set-cookie: ja_locale=tr`.
    - The old href `/tr` answers `308 location: /`, so the new href saves one hop.
  - **Browser, cookie `ja_locale=en` + `en-US`.**
    - With JS on: `/en` → TR pill `href="/"` → lands on `/`, `lang=tr`, no redirects, h1 "Ana sayfa". `/en/hire-workers` → `/isci-talebi`, `lang=tr`.
    - With JS off, where the SSR fallback href is what gets clicked: the same results, and the middleware synced the cookie to `tr`.
  - **The hreflang-tag branch** has been primary since 454d127 and links TR unprefixed as well. It shares the same dependency on `localeDetection: false` and is equally safe today.
    - If detection is ever enabled, both branches would need the default-locale prefix. Record this (N1).
- **Pill hrefs = hreflang tags** on all four pages (above).
- **404 pages** (`/en/does-not-exist`, `/yok-boyle-bir-sayfa`) are the only place the fallback stays live after hydration: there are no tags there.
  - They render `tr:/does-not-exist` and `en:/en/does-not-exist`, with no remount.
  - Their chrome is client-rendered: that is the known empty 404 shell, Task 3 review § Parked 1.

### 3. M2 — `NOINDEX_PATHNAMES` comment — ✅
- `src/lib/seo/routes.ts:19-30` now names `robotsDisallowPaths(locale)` as robots.txt's path (the UNBUILT fold).
- It names `noindexExternalPaths` as "the same fold with no UNBUILT subtraction — kept as the reference `routes.test.ts` pins `robotsDisallowPaths` against; it has no production caller".
- Verified:
  - `src/app/robots.ts:20` is the only production caller of `robotsDisallowPaths`.
  - `noindexExternalPaths` appears only in `routes.ts` and `routes.test.ts`. Those uses are `:39-47`, `:63`, and `:66-67`, the UNBUILT-empty equality pin.
- The change is comment-only; the `export` lines are identical to BASE.

### 4. M3 — PRD § 11 sitemap clause — ✅
- `docs/PRD.md:112` carries the brief's literal text: "(gated to the built routes since WP2a Task 4 — `UNBUILT_PATHNAMES`, W20; `docs/SEO.md`)".
- The "SEO scaffolding" bullet reads coherently.
- The inline WP2a amendment matches the style of the neighbouring "Content pipeline … **T0b (WP2a):**" bullet.
- § 4 (`:63`, P7) is untouched, as parked.

### 5. W124 — template page records pinned — ✅
- **The test.** `src/content/local-bundle.test.ts:94-110` checks `blogArticle` and `careersDetail` in both bundles. It asserts `titleId === ''`, `descriptionId === ''`, `canonical === null` and `ogImage === null`.
  - Those are the real `PageSeoSchema` names (`contract/website-bundle.v1.ts:58-62`).
- **It reads the committed bundles, not a fixture.** The file loads `src/content/local/bundle.{tr,en}.json` with `readFileSync` + `BundleSchema.parse`.
  - `getPageSeo` (`collections.ts:309-311`) returns the raw record.
  - A node read of both bundles shows the four fields empty/null for both keys today.
- **Mutation, run rather than only reasoned** (`mutation-w124.log`): a copy of the TR bundle with `pages.blogArticle.canonical = 'https://www.jobsadmire.com/blog'`.
  - The test fails with `blogArticle: expected 'https://www.jobsadmire.com/blog' to be null`; the file's other 5 cases pass.
  - An invalid canonical would fail `BundleSchema.parse` at load, so that case is red too.
- **CONTENT-MODEL.** `docs/CONTENT-MODEL.md:111` (§ Page records, the paragraph naming both keys) gained the brief's sentence verbatim.
- **Scope.** The pin guards the LOCAL bundles only. A Phase B OPS-served bundle is W124's WP5/WP6 item, as ruled.

### No regressions
- **Gate at HEAD** (`gate.log`):
  - `tsc --noEmit` ✓, `eslint .` ✓, `prettier --check .` ✓ ("All matched files use Prettier code style!").
  - Vitest: **58 files / 380 tests passed** (30.7 s), with no `act()` warnings. The only stderr line is the known Node 25 `--localstorage-file` warning.
- **Build** ✓ (Next 16.3.5 / Turbopack, 13 static pages).
- **Playwright** `e2e/seo.spec.ts` + `e2e/chrome.spec.ts` against `next start`: **24 passed** (12 mobile + 12 desktop). No other spec asserts a pill href.
- **Console / hydration:** none on `/`, `/en`, `/isci-talebi`, `/en/hire-workers`. The 404 probes log only the expected 404 document resource error.
- **Diff scope.** `git diff --stat b62c4af..HEAD` shows 11 files, all named by the brief.
  - Nothing is touched under `docs/superpowers/` (handoff, rulings, plans), `.superpowers/`, `contract/`, `src/content/local/` or `docs/WEBSITE-HANDOFF.md`.
  - One item per commit (3+4 shared). Messages cite W123/W124/M1–M3 and carry the `Claude Fable 5.1` trailer.
  - Every intermediate blob is Prettier-clean. Each TS file is touched by exactly one commit, together with its test.
- **Produces.** The `export` lines of `route.tsx`, `LanguageSwitcher.tsx`, `LanguageHint.tsx` and `routes.ts` are identical to BASE, and the props are unchanged. No export name, type or signature moved.
  - The frozen block's descriptive line "otherwise the WP1 next-intl `<Link href={alternatePath(pathname)} locale={l}>` (R58)" is now inaccurate. It is a comment, not a signature: see Parked (controller-owned `produces-final.md`).
- **Later briefs.**
  - Task 5's anchors are intact:
    - the `LanguageHint` sheet `className` string is unchanged;
    - its test appends after the `LanguageHint link target` describe;
    - the imports `screen`/`renderWithIntl`/`LanguageHint` are still present (plus `waitFor`).
  - Task 7's `HINT_KEY` reference is unaffected.
- **JS budget (W120 method,** gzip-9/brotli-11 over the `<script src>` set, `noModule` excluded; `jsbudget.txt`).
  - `/`, `/en`, `/isci-talebi`, `/en/hire-workers`: **167,851 B gz-9 (±0 vs `f14f635`) / 144,995 B br-11 (+17 B)**, 10 scripts, 556,637 B raw (−11 B).
  - `/tesekkurler?form=hire`: 168,242 / 145,351.
  - That is still 36,949 B under the 204,800 B ceiling.
  - Unchanged because next-intl's `Link` is still bundled through Button, NavLink, HeaderCtas, Header, ConsentBanner and FormShell. Dropping it from the two components removes no module.

## The implementer's deviations — verdicts
1. **Rewrote `route.tsx`'s header comment (`:93-96`) too — accept.** It carried the same false ISR claim I1 exists to remove.
   - Its retained first clause is wrong, though: see N2.
2. **Local `type Href = Parameters<typeof getPathname>[0]['href']` in both components — accept (sound); minor smell.**
   - **The premise is verified.** A scratch `tsc` program (`$RR/tscheck/`) shows that `@/i18n/navigation`'s `Href` passed to `getPathname` gives TS2322: `query: string | ParsedUrlQueryInput | null | undefined` is not assignable to `QueryParams | undefined`. The local alias, `routes.ts`'s `Href` and the `'/blog' as GP` cast all type-check.
   - **Why it is sound.** The alias is by definition `getPathname`'s parameter type. `target as Href` is the same sanctioned string→href cast as before (R17 pattern). An unknown pathname (a 404 page) passes through `getPathname` unchanged, as it did through `<Link>`.
   - **The smell is duplication.** `src/lib/seo/routes.ts:12` already exports the identical `Href`, so `import type { Href } from '@/lib/seo/routes'` (erased at compile time) would keep one definition.
   - The comment "NOT `next/link`'s own `Href`" is imprecise: the rejected type is `@/i18n/navigation`'s `Href`, i.e. next-intl `Link`'s href prop, whose object variant is `UrlObject`-based. Parked nit.
3. **TR fallback `/tr` → `/` — accept, with one correction to the report's reasoning.**
   - `getPathname` *does* accept `forcePrefix` (opt-in, `createSharedNavigationFns.js:61-86`), so `/tr` could have been kept with one element type. The brief's "preserve unless impossible" was therefore not strictly met.
   - Dropping the prefix is still the better choice, and the review's M1 recommendation explicitly allowed it:
     - the fallback now equals the tag branch, so there are zero hydration href patches (measured);
     - it saves a 308 hop;
     - it is proven safe while `localeDetection: false` (item 2c: curl, and the browser with JS on and off).
   - The coupling to `localeDetection` belongs in the docs (N1).
4. **M3 wording follows the brief's literal replacement over the review's paraphrase — accept.** The brief is binding, and the result reads coherently.

## New findings (Critical / Important / Minor)

### Critical
None.

### Important
None.

### Minor
**N1 — `docs/ARCHITECTURE.md:289` still describes the removed fallback.**
- **Current text:** "the fallback stays next-intl's `<Link locale>`, which always carries the prefix when `locale` is passed (`/tr` folds to `/` in the middleware)". This has been false since `abd5b3c`, and the M1 rationale (one element type) is recorded nowhere in the docs.
- **Why it matters:** the repo rule is that docs match the code in the same change set. The brief's M1 item listed no doc, so this is a brief gap, not implementer negligence.
- **Fix:** doc-only; a diff read is enough, no re-review needed. Replace that sentence with:
  > Both sources render the same `next/link` element — the tag's path as is (already localized), the fallback resolved through next-intl's `getPathname({ href: alternatePath(pathname), locale })` — so hydration never remounts a pill and a focused pill keeps focus (M1); on static pages the two agree, so hydration patches nothing. Both link the default locale unprefixed (`/`, `/isci-talebi`), which is correct only while `localeDetection: false`: with detection on, a bare `/` with an `en` cookie would bounce to `/en`, and both branches would need the default-locale prefix (`getPathname`'s `forcePrefix`, which next-intl's `<Link locale>` applies) plus a click-time cookie write.

**N2 (nit) — `route.tsx:93-96` comment premise.**
- **"ImageResponse's own default is a year, immutable" is wrong for `next/og` in Next 16.3.5.**
  - The actual default is `public, max-age=0, must-revalidate` in production and `no-cache, no-store` in dev (`node_modules/next/dist/server/og/image-response.js:56-63`).
  - The year-immutable header belongs to the inner `@vercel/og` response, whose headers Next discards.
  - Deleting the header would therefore mean no caching, not a year.
- **"without a cache miss ever blocking one" overstates stale-while-revalidate.** The first request after a deploy blocks, and so does the first after 8 idle days (s-maxage + SWR); each is about a 25 ms render.
- **Impact:** harmless, since the explicit header is right.
- **Fix:** fix it with N1 or in the final review. The same "(ImageResponse's own default is a year, immutable)" parenthetical sits in the plan and in `produces-final.md` (controller-owned).

## Parked for the WP2a final review
- **Controller — `produces-final.md`.** Three stale items:
  - the OG route's header line (W123);
  - the LanguageSwitcher/LanguageHint rendering line: the fallback is now `next/link` + `getPathname`, TR unprefixed, and the props are unchanged;
  - the "(ImageResponse's own default is a year, immutable)" parenthetical.
- **Controller — preview proof still pending.**
  - `x-vercel-cache: MISS` → `HIT` on `/og/tr/home.png` after the push.
  - The response also carries `vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch`, which Next adds and crawlers never trigger. Worth a glance in the same curl.
- **Locale cookie semantics.**
  - **What happens:** a pill click is now a plain `next/link` soft navigation, so `ja_locale` is not written on click; next-intl's `<Link locale>` used to write it client-side. The middleware rewrites it on the next document load. Observed: the cookie stayed `en` after the soft switch and became `tr` after a reload.
  - **When it started:** at 454d127 (the tag branch). This round only extends it to tagless (404) pages.
  - **Impact:** harmless while `localeDetection: false`, because nothing reads the cookie. It also makes PRD D1's "language choice persists in cookie `ja_locale`" nominal.
  - **Decision needed:** whether to keep D1's wording or add a click-time cookie write.
- **The `Href` alias**, now in three files, and its comment wording (deviation 2).
- **The hint's switch link has no `hrefLang="en"`** (P8). It is now uniformly absent; before the fix, the tagless fallback got it from `LocaleChangingLink`.
- **Known (Task 3 review § Parked 1): 404s are Next's `__next_error__` shell.**
  - The pills there are client-rendered and are the only R58 fallbacks still live after hydration.
  - They are verified correct and stable (`/does-not-exist`, `/en/does-not-exist`).
