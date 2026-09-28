# Report — WP2a final review, fix round 2 of 2 (implementer Sonnet 5, 2026-09-28)

Base `a885a75` → HEAD `d3434b4`, branch `wp2/foundation`, 8 commits, not pushed. Suite 118 files / 775 tests (base 114 / 728); verify (`typecheck && lint && format && vitest --maxWorkers=1`) green before every commit, one heavy job at a time throughout.

## Commits

| # | sha | item | files / tests |
|---|---|---|---|
| 1 | `7931ece` | C — W154 voice sweep | 114 / 728 |
| 2 | `d3cbe3a` | I0 — W156 guard widening + `date/` split | 114 / 729 |
| 3 | `1545620` | D — docs + code comments | 114 / 729 |
| 4 | `809a28e` | E — W152 launch dead-target sweep | 115 / 745 |
| 5 | `9ab38aa` | F — a11y minors | 118 / 756 |
| 6 | `dd87a7f` | G — engine/schema/islands minors | 118 / 768 |
| 7 | `d04774c` | H — tests (phone selector, consent href, pixel N2) | 118 / 772 |
| 8 | `d3434b4` | I — security headers + form-beacon cap | 118 / 775 |

I0 was done before D because D's docs commit folds in the one ARCHITECTURE.md sentence I0 also names (grouped there instead of duplicated); the rest follow the brief's letter order.

## Item C — W154 voice sweep (`7931ece`)

`src/messages/tr.json`/`en.json`: the 23 strings in §5's table (`consent.body`; `thankYou.body`, `.whatsapp`, `.forms.{hire,contact,partner,careers,newsletter,callback,visit,calculator,fraud,workers}`), copied exactly — "JobsAdmire"/"JobsAdmire ekibi" as the subject, formal TR register. `src/messages/voice.test.ts` widened from `strings(file.sys.form)` to `strings(file.sys)`; `VISITOR_VOICE = ['form.fallback.whatsappIntro', 'whatsapp.prefill']`; describe renamed to `sys.*`.

RED (widened test against the old copy):
```
+ [
+   "sys.consent.body: kullanıyoruz",
+   "sys.thankYou.body: bize", "sys.thankYou.body: ekibimiz",
+   "sys.thankYou.forms.hire: aldık", "sys.thankYou.forms.hire: döneceğiz",
+   … (20 more, one per offending word) …
+ ]
```
(EN side: `we`/`us`/`our` × 18 hits.) Exactly the word list §5 predicted. GREEN after the copy fix: `Test Files 1 passed (1)`, `Tests 4 passed (4)`.

`e2e/thank-you.spec.ts` asserts no `thankYou.*`/`consent.*` copy text (checked, no change needed).

**Verify:** typecheck/lint/format clean; vitest 114 files / 728 tests.

## Item I0 — W156 guard widening (`d3cbe3a`, controller addition)

`src/design/__tests__/client-imports.test.ts`: added `allRoots` (every non-test module outside the gallery, no directive filter); check (a) now scans `allRoots` instead of the old `clientRoots` (kept, narrower, for check (b)'s client-reachability graph, which is a client-bundle-composition question and has no reason to widen). New regression case proves a directive-less module is now in scope where the old scan would have missed it (`Footer.tsx` is in `allRoots`, not in `clientRoots`).

RED against the real tree once check (a) used `allRoots`:
```
- []
+ [ "src/design/blocks/PostCard.tsx → @/lib/format/date" ]
```
Root cause: `PostCard` (a server block) imports `@/lib/format/date` (the whole module, `formatDate` + `formatReadMinutes`) — invisible to the old `'use client'`-only scan. Fix: split `src/lib/format/date.ts` into `src/lib/format/date/{formatDate,formatMonth,formatReadMinutes}.ts` + a barrel `index.ts` (kept for the gallery/tests only, per the existing pattern for primitives/blocks); `PostCard.tsx` now imports `formatDate`/`formatReadMinutes` by path. GREEN after: `Test Files 1 passed (1)`, `Tests 5 passed (5)`.

Docs: ARCHITECTURE.md § Design system — the barrel-leak paragraph now says "every module outside the dev gallery is guarded, server components included (W156)"; the `src/lib/format/date.ts` sentence rewritten for the new folder shape (lands in the D commit below, not duplicated).

**Verify:** typecheck/lint/format clean; vitest 114 files / 729 tests (+1).

## Item D — docs + code comments (`1545620`)

**ARCHITECTURE.md:** env row (`OPS_WEBSITE_WRITE_TOKEN` — "consumed by post.ts/uploads.ts/site-health/ops.ts", not "not yet consumed"); Repository layout rows for `scripts/` (added gate-routes.mjs, js-size.mjs, pixel-compare.ts, placeholder-count.ts, launch/, bypass.test.ts/face.test.ts), `src/lib/` (qr.ts, format/date/, calculator/), `e2e/` (helpers/, routes.ts), `src/design/` (contrast.ts); § Calculator engine D17 sentence (the lint covers metrics only, rate literals in `legal`-flagged strings are baselined for WP-C); § Routing gains the W151 sentence (the `__next_error__` shell pre-hydration); § Forms flow gains the `guardAction`-removes-no-JS-submission sentence (M22); the I0 barrel-leak/date.ts sentences (above).

**PRD.md:** §11 — "the gate has since been run against a Vercel preview twice (2026-09-28, W139–W141)" (was "has not yet been run"); islands count corrected to "ten components plus two hooks, twelve modules" (was "nine"); §3 D1 — `ja_locale` "written by the middleware on the next full navigation… a client-side switch does not write it" (M10); new §12 "Calculator rules" block (W2 exact floor, W58 opt-in support default off, 5:1 quota counting complete groups only, W150 dated-badge revalidate floor, D18 rounding once at the edge).

**DEPLOYMENT.md/README.md:** the W137 bypass-secret note now names `test-results/` alongside `.lighthouseci/`/`lighthouse-report/` (Playwright's `retain-on-failure` traces carry the same header, M12).

**Code comments:** `[...rest]/page.tsx:3-6` (no root `app/not-found.tsx` ever existed; Next's built-in `/_not-found` is what renders, M6); `FallbackPanel.tsx:110-114` (a modifier-click still fires `onClick` and opens the *prefilled* chat; only a genuine middle click reaches the bare href, M20); `visibility.test.tsx:48-56` (the "hidden never wins" framing over-generalised — today it beats block/flex/grid by alphabetical accident and only loses to inline-flex, M5); `copy-deltas.ts:1-11` (authoring-time-only, not for a page to import — `model` is computed from test fixtures, not the live `RateConfig`, M18).

`docs/WEBSITE-HANDOFF.md` and `produces-final.md`: skipped, controller-owned, per the brief.

**Verify:** typecheck/lint/format clean (two files needed `prettier --write` after the edits — table realignment only, content unchanged); vitest 114 files / 729 tests (unchanged).

## Item E — W152 launch dead-target sweep (`809a28e`)

`scripts/launch/dead-targets.ts` (new): pure, dependency-injected — `internalHrefs(html)` (regex-scans `href="/…"`, drops `/_next/`, scripts and comments stripped first), `hasElementId(html, id)`, `fetchRoute(base, path, f)` (manual redirects, W137 bypass header, 15s timeout), `deadTargets(base, routes, f)`, `missingCtaAnchor(base, locale, path, id, f)`.

`scripts/launch/dead-targets.launch-check.ts` (new, runs only under `vitest.launch.config.mts`): fetches every `GATE_ROUTES` page, collects internal hrefs, expects 200 on each; for every `CTA_BY_PATHNAME` key resolves both locale paths via `getPathname` and expects `id="<hash>"` in the HTML.

`scripts/launch/dead-targets.test.ts` (new, mocked fetch, part of the default suite): RED fixture — a page with one live and one dead link:
```ts
const dead = await deadTargets('https://example.test', ['/'], f);
expect(dead).toEqual(['/nowhere → 404']);
```
GREEN immediately (this is new pure logic, not a fix to existing broken code): `Test Files 1 passed (1)`, `Tests 12 passed (12)`. 11 more cases cover `internalHrefs`/`hasElementId`/`fetchRoute`/`missingCtaAnchor` edge cases.

`scripts/gate-routes.mjs`: `careersDetailRoutes` gains a `built` gate (default: `careersDetailPageBuilt()`, a plain `fs.existsSync` check over the App Router folder, route groups stripped) so careers detail rows are never appended while `/careers/[slug]` has no `page.tsx` — confirmed via `node scripts/gate-routes.mjs` printing `gate-routes: detail rows skipped (page not built — /careers/[slug])` on stderr and only the 4 real routes on stdout. **Deviation:** did *not* `tsImport` `src/lib/seo/routes.ts` for `UNBUILT_PATHNAMES` as the brief's wording implies — proved empirically (`node -e`, twice, with and without `tsx/esm` registered) that `next-intl/navigation`'s conditional package export (`react-server`/`react-client`) breaks `tsImport`'s resolver outside Next's own bundler (`ERR_MODULE_NOT_FOUND` on `next-intl/dist/esm/production/navigation.react-client.js`), so a filesystem check mirroring the exact fact `src/lib/seo/unbuilt.test.ts` keeps in sync with `UNBUILT_PATHNAMES` was used instead. `gate-routes.test.ts` gained a cross-check (`careersDetailPageBuilt()` must equal `!UNBUILT_PATHNAMES.has('/careers/[slug]')` on the real repo) plus isolated true/false cases and updated the four existing fetch-path tests to pass `built: true` explicitly (they'd otherwise short-circuit before ever calling fetch).

`scripts/gate.sh`: for `--profile=launch`, `npx vitest run --config vitest.launch.config.mts` (W20 + the new W152 sweep) now runs **before** `npx playwright test` instead of after Lighthouse — proved in the proof session below: the launch profile now fails in 0.6s printing both results, instead of only surfacing them after a multi-minute Playwright + Lighthouse run.

**Verify:** typecheck/lint/format clean; vitest 115 files / 745 tests (+1 file, +16).

## Item F — accessibility minors (`9ab38aa`)

- `SiteChrome.tsx`: `<main id="main" tabIndex={-1} className="focus:outline-none">` (M3).
- `MobileNav.tsx`: Escape closes the panel and refocuses the trigger button; a click outside the container (button + panel) closes it too (M2). Both listeners attach only while `open`.
- `SlimBar.tsx`: `role="region" aria-label={sys('nav.slimBar')}` on the outer bar (M1).
- `MobileBottomBar.tsx`: the outer `div` becomes `<nav aria-label={sys('nav.bottomBar')}>` (M1).
- Two new `sys.nav.*` keys, both locales: `slimBar` ("Contact and licence bar" / "İletişim ve lisans şeridi"), `bottomBar` ("Quick contact actions" / "Hızlı iletişim işlemleri") — no "we", checked by the widened voice test from item C.
- `LanguageHint.tsx`: the switch `NextLink` gains `hrefLang="en"` (M23).
- `Dialog.tsx`: `FOCUSABLE` gains `:not([disabled])` on `select`/`textarea` (M15).

Tests (jsdom), one new file each for the three chrome components with none before: `SiteChrome.test.tsx`, `MobileNav.test.tsx` (4 cases: Escape+refocus, outside click, inside click, Escape-while-closed no-op), `MobileBottomBar.test.tsx`; one new case each in `SlimBar.test.tsx`, `LanguageHint.test.tsx`, `Dialog.test.tsx`.

**Deviation (process, not scope):** these six fixes were implemented, then tested — not strict red-first TDD. They are small, additive DOM/prop changes (an attribute, a role, a listener) where I judged the risk of a wrong pre-fix assertion outweighed the value of a captured RED transcript; every test does fail if the corresponding line in the component is reverted (verified by inspection of each assertion against the pre-fix source, not by re-running against a reverted copy). The one place a real RED *did* surface is item H's FormShell case, reported there.

`eslint.config.mjs`'s exact D23 exemption list (bundle-fixture tests allowed to import `@/content/local/*`) grew by `SiteChrome.test.tsx` and `MobileBottomBar.test.tsx` — both needed the real parsed TR bundle, like the existing Header/Footer/SlimBar/visibility suites.

**Verify:** typecheck/lint/format clean; vitest 118 files / 756 tests (+3 files, +11).

## Item G — engine/schema/islands minors (`dd87a7f`)

- `money.ts`: `Intl.NumberFormat` cached per `(locale, digits)` in a module-level `Map`; `formatInt`/`formatTRY`/`formatPercent` keep their signatures. Call-count spy test (`vi.spyOn(Intl, 'NumberFormat')`, wrapped in a `function` expression — an arrow function fails vitest's "mock did not use function/class" constructor check, the one real hiccup in this item) proves repeats with the same key are free and a new key builds exactly one formatter.
- `collections.ts`: `CalculatorRoleSchema.multiplier: z.number().positive()` → `.min(1)` (M17 — a multiplier below 1 would floor a role under the legal minimum wage itself). `RateConfigSchema`'s three date fields gain `.refine(isCalendarDate)` — a local round-trip check (parse at UTC midnight, re-print, compare) reusing `labels.ts`'s W144(b) approach rather than importing it (`src/content/` importing `src/lib/calculator/` would invert the codebase's layering). Tests: multiplier accepts 1/1.5, rejects 0.9/0; dates accept a leap day and a 30-day month end, reject `2026-02-30` and the non-leap `2026-02-29` on every one of the three fields, and reject a syntactically-wrong string before the calendar check ever runs; both `bundle.tr.json`/`bundle.en.json` still parse (checked against the real committed files first: every multiplier is ≥ 1, every date is a real calendar date).
- `quota.ts`: `quotaBlocks`'s `cap` argument now runs through a `capOf` guard (non-negative integer or `CalculatorError`), mirroring `ratioOf`. Test: 0 is a valid cap (shows none), -1/2.5/NaN throw.
- `LazyIsland.tsx`: a rejected `load()` now `console.error`s outside production only (M14, matching `qrSvg`'s existing pattern) before falling back. Extended the existing rejected-load test with the exact call assertion, added a new "stays silent in production" case (`vi.stubEnv`/`vi.unstubAllEnvs`, added to the file's shared `afterEach` so a failed assertion can't leak the stub to later tests).
- `purity.test.ts`: new guard — no file outside `src/lib/calculator/` imports `copy-deltas.ts` by any spelling (M18). Grepped the whole tree first: nothing outside the folder references it today, so this is a green-from-day-one regression guard, not a fix to an existing violation; a small self-test proves the specifier-matcher itself is correct (`@/lib/calculator/copy-deltas` / `../calculator/copy-deltas` match, `@/lib/calculator/engine` does not).

**Verify:** typecheck/lint/format clean; vitest 118 files / 768 tests (+12, 0 new files).

## Item H — tests (`d04774c`)

- `e2e/chrome.spec.ts`: the W119 phone-visibility locator is now `.bg-navy a[href^="tel:"]` instead of `getByRole('link', { name: '+90 501 124 03 40' })` (M4) — confirmed `telLink()` emits exactly `tel:${phone}`, so the prefix match is correct; the stale "the slim bar has no landmark role" comment corrected (SlimBar is `role="region"` since item F). Not runnable directly (never `npm run e2e` per the memory rule) — proven by the proof session's Playwright run below (`✓ … the secondary CTA and the slim-bar contact links hide below their breakpoint …`).
- `FormShell.test.tsx`: **this is where a real RED surfaced.** My first attempt added the href assertion to the *existing* `/kvkk` `@ts-expect-error` case:
  ```
  Expected: href="/gizlilik"
  Received: href="/kvkk"
  ```
  This is correct behaviour, not a bug: `consentLinkHref`'s prop type (`'/privacy'` only) is what actually enforces "/privacy only" — at runtime, a value forced past the type checker is simply rendered as given. Asserting `/gizlilik` there was testing the wrong thing. Fixed by leaving that case as it was (proving the type-level rejection + a link renders) and adding two *new* cases against the component's **default**, untouched `consentLinkHref`: TR → `/gizlilik`, EN → `/en/privacy` (M21). GREEN: `Tests 24 passed (24)` (was 22).
- `scripts/pixel-compare.ts`: new `checkZoomedHeight(pageHeight, zoom, rectHeight)` — throws `PixelExit(…, 2)` when `pageHeight × zoom` (what `designClip`'s screenshot clip uses) disagrees with an independent measurement, the root element's own `getBoundingClientRect().height`, by more than 2px (N2); wired in right before the design screenshot, reading `rectHeight` in the same `evaluate()` call. Two new tests: agrees within tolerance (exact and a 1.4px rounding case) does not throw; disagreeing by more than 2px throws `PixelExit` code 2 with "N2" in the message.

**Verify:** typecheck/lint/format clean; vitest 118 files / 772 tests (+4, 0 new files).

## Item I — security headers (`d3434b4`)

**This item also produced a real, useful RED→GREEN, caught by direct verification against a running server rather than an automated test (Playwright specs cannot be run outside the proof session).**

First attempt: a general `/:path*` block with all four headers, plus a more specific `/og/:path*` block re-stating the other three and omitting `X-Frame-Options`. Started a dev server, curled `/og/tr/site.png`:
```
RED:  X-Frame-Options: DENY   (still present — wrong)
```
Next's own documented "header overriding" rule ("the last matching block wins per key") does not say what happens to a key a later, more specific block never mentions at all — empirically, it stays. Fixed by giving `X-Frame-Options` its own block with a negative-lookahead `source`: `/((?!og/).*)`  (note: standalone `require('path-to-regexp')` in a throwaway script compiles this pattern in a way that does not even match `/` — Next bundles and invokes the library differently internally, so only a real running server is trustworthy here). Restarted, curled again:
```
GREEN: /                 → Referrer-Policy, X-Content-Type-Options, Permissions-Policy, X-Frame-Options: DENY (all four)
       /en, /isci-talebi, /api/site-health → X-Frame-Options: DENY present
       /og/tr/site.png, /og/de/nope.png (404) → the other three present, X-Frame-Options absent
```
`e2e/headers.spec.ts` (new) pins all of this on every `GATE_ROUTES` entry plus the OG exception, and passed in the proof session's Playwright run (16 header assertions, all green — see below).

`src/app/api/form-beacon/route.ts`: a declared `Content-Length` over 4096 bytes is refused with 413 before `request.text()` ever runs (M11) — verified a real body can never come close to that size (`page` is capped at 300 chars by the `.strict()` schema). `beacon.test.ts` gained three cases (over the cap with `console.error`/`formBeaconCount` both untouched, at the 4096-byte cap, content-length absent/non-numeric falls through). Also curled directly: an oversized body → 413, a normal one → 204.

ARCHITECTURE.md: new "Security headers" paragraph in § Quality gate (with the RED→GREEN story above, condensed); the form-beacon bullet in § Forms flow gains the 413 clause.

**Verify:** typecheck/lint/format clean; vitest 118 files / 775 tests (+3, 0 new files).

## Proof session (after `d3434b4`, the last commit)

`NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`: green, 13 routes (unchanged shape from round 1). `git status` clean before and after (no stray `CLAUDE.md`/`nextjs-agent-rules` block from the build). One `npm run start` on :3000.

**`E2E_BASE_URL=http://localhost:3000 npm run gate` → `gate: OK`.** 224 passed, 4 skipped (the two `REVALIDATE_SECRET`-gated ops cases × 2 projects — expected, the secret was not exported for this local run, R43). All 16 new `e2e/headers.spec.ts` assertions passed (both projects × 5 gate routes + the OG case × 2 projects). Lighthouse: all four routes pass at the DevTools-throttled, median-of-3 method (W145); js-size table:

| route | script B (worst of 3) | headroom | LCP ms (median) | perf (median) |
| --- | ---: | ---: | ---: | ---: |
| / | 177,617 | 27,183 | 1,563 | 0.99 |
| /en | 174,133 | 30,667 | 1,557 | 0.99 |
| /en/hire-workers | 174,133 | 30,667 | 1,557 | 0.99 |
| /isci-talebi | 177,617 | 27,183 | 1,564 | 0.99 |

**`E2E_BASE_URL=http://localhost:3000 npm run gate:launch` → exit 1, RED by design.** With item E's reordering, the launch profile now fails in 0.6s (before Playwright/Lighthouse ever run), printing both results immediately:

- **W20:** `UNBUILT_PATHNAMES` is not empty — 19 entries: `/hiring-cost-calculator`, `/partner-with-us`, `/work-permit`, `/about`, `/verify`, `/careers`, `/careers/[slug]`, `/contact`, `/available-workers`, `/success-stories`, `/blog`, `/blog/[slug]`, `/portal-login`, `/privacy`, `/terms`, `/kvkk`, `/cookie-policy`, `/newsletter/confirm`, `/newsletter/unsubscribe`.
- **W152 dead-target list — 24 dead hrefs** (every unbuilt page's TR+EN chrome link, matching the review's I6 probe exactly): `/kariyer`, `/temsilci-dogrulama`, `/portal-girisi`, `/adaylar`, `/calisma-izni`, `/maliyet-hesaplayici`, `/hakkimizda`, `/basari-hikayeleri`, `/iletisim`, `/ortak-olun`, `/gizlilik`, `/kullanim-kosullari`, `/en/careers`, `/en/verify`, `/en/portal-login`, `/en/available-workers`, `/en/work-permit`, `/en/hiring-cost-calculator`, `/en/about`, `/en/success-stories`, `/en/contact`, `/en/partner-with-us`, `/en/privacy`, `/en/terms` — all 404.
- **W152 missing-anchor list — 14 entries:** `#proposal` absent on both `/` (tr) and `/en` (both answer 200 — the page exists, the anchor does not) — the review's I6 finding, still true; the other 12 are the `CTA_BY_PATHNAME` anchors for pages that do not exist yet at all (404), so their anchors are trivially also missing (`#calculator`, `#tracks`, `#permit-cta`, `#message`, `#report`, `#pool`, tr+en each).

Server killed after both runs. `ps -Ao pid,rss,command | grep -E 'vitest|next|playwright|chromium|lighthouse|lhci' | grep -v grep` → only an unrelated pre-existing `ChromeRemoteDesktopHost` system process, nothing of mine. `git status` clean.

## Deviations

1. I0 landed before D in commit order (both still land in this round); the ARCHITECTURE.md sentence I0's own brief line asks for is committed as part of D, not duplicated across two commits.
2. I0: fixing the real-tree offender (`PostCard.tsx`) required splitting `src/lib/format/date.ts` into a folder of by-path modules — bigger than a one-line move, but the only way to satisfy "no import of `@/lib/format/date`… by any spelling" for a server component that legitimately needs two of its three functions, without changing `PostCard`'s public props or the calculator's data flow.
3. Item E: `gate-routes.mjs`'s `/careers/[slug]`-unbuilt check uses `fs.existsSync` over the App Router folder, not a `tsImport` of `UNBUILT_PATHNAMES` from `src/lib/seo/routes.ts` — proved empirically that `tsImport` cannot load that file outside Next's bundler (`next-intl/navigation`'s conditional package export). Cross-checked against `UNBUILT_PATHNAMES` in a test so the two facts cannot silently drift.
4. Item E's `CTA_BY_PATHNAME` anchor check covers exactly the seven keys in that table, per the brief's literal wording — it does **not** check `DEFAULT_CTAS`'s own anchor (`#request-form` on `/hire-workers`, which has no `CTA_BY_PATHNAME` entry). The review's own I6 probe mentions `#request-form` absent on `/isci-talebi` as a finding; my sweep does not reproduce that specific line item because it is a different code path (the default, not the table). Noted as a concern below.
5. Item F: implemented-then-tested rather than strict red-first TDD for the six a11y fixes (reasoning in item F above).
6. Item H: `e2e/chrome.spec.ts`'s selector fix could not be run in isolation (never `npm run e2e` per the memory rule); it is proven only by the full proof-session Playwright run passing.
7. Item I: the working `next.config.ts` shape (a negative-lookahead `source` for `X-Frame-Options` alone) was reached after a first attempt was proven wrong against a running server, not from documentation — Next's own `headers()` docs do not cover this "except one path" case, and a standalone `path-to-regexp` test is actively misleading (Next uses its own bundled copy differently).
8. `scripts/gate.sh`'s launch-profile reordering (item E) means `gate:launch` no longer also runs the full default gate (Playwright/Lighthouse) once the source-level checks fail, which they still do today — a deliberate reading of "so both launch results print" as "print them fast," consistent with the proof-session recipe running `gate` and `gate:launch` as two separate invocations.

## Concerns

- Item E's dead-target sweep does not check `DEFAULT_CTAS`'s own anchor (deviation 4) — worth a follow-up ruling if Gate A wants `#request-form` on `/hire-workers` covered by the same automated sweep the review's manual probe caught it with.
- M12's `test-results/` note (item D) is descriptive only; no code change enforces deleting it, same as the two folders it joins.
- The six a11y fixes in item F are additive and low-risk, but were not proven red-first (deviation 5) — worth a second pair of eyes on `MobileNav.tsx`'s two new `document` listeners in particular (Escape + outside-click), since they are the only genuinely new *behaviour* in that item, not just an attribute.
- `next.config.ts`'s `headers()` negative-lookahead `source` (`/((?!og/).*)`) is proven correct against Next 16.3.5's dev and production servers today; it depends on Next's bundled `path-to-regexp` continuing to accept this syntax across future Next upgrades — flagged in the code comment so a future upgrade's test failure (via `e2e/headers.spec.ts`) points here first.
- Round 1's own concerns (W147 widened to server modules → now W156, done; the preview gate run; LCP-element-is-a-placeholder) are unchanged by this round except the first, now closed.

## Produces additions

- `src/lib/format/date/` (folder, was `date.ts`): `formatDate.ts`, `formatMonth.ts`, `formatReadMinutes.ts`, `index.ts` (barrel, gallery/tests only) — same three exported function names and signatures, new file locations; consumers outside the gallery import by path.
- `scripts/launch/dead-targets.ts` (new): `internalHrefs`, `hasElementId`, `fetchRoute`, `FetchResult`, `deadTargets`, `missingCtaAnchor`.
- `scripts/launch/dead-targets.launch-check.ts`, `scripts/launch/dead-targets.test.ts` (new).
- `scripts/gate-routes.mjs`: new export `careersDetailPageBuilt(appLocaleDir?)`; `careersDetailRoutes(env, f, built?)` gains a third parameter (default: the real check) — additive, existing two-argument call sites unaffected.
- `sys.nav.slimBar`, `sys.nav.bottomBar` (new keys, both locales) — additive to the `sys.nav.*` namespace; read by server components (`SlimBar`, `MobileBottomBar`), no `CLIENT_SYS` change needed.
- `SiteChrome`'s `<main>`: `tabIndex={-1}` + `focus:outline-none` — additive DOM attributes, no prop/API change.
- `Dialog.tsx`'s `FOCUSABLE` selector: now excludes `disabled` `select`/`textarea` — behaviour-narrowing (fewer elements match), no prop/API change.
- `CalculatorRoleSchema.multiplier`: `.positive()` → `.min(1)` — **contract narrowing**: a producer row with `0 < multiplier < 1` now fails validation where it previously passed. Both real bundles already comply.
- `RateConfigSchema`'s three date fields: regex-only → regex + calendar-validity — **contract narrowing**: a calendar-invalid date (e.g. `2026-02-30`) now fails validation where it previously passed (and would have thrown later, inside the calculator engine, per W144(b)). Both real bundles already comply.
- `quota.ts`'s `quotaBlocks(turkishStaff, quotaRatio, cap?)`: an invalid `cap` (not a non-negative integer) now throws `CalculatorError` where it previously produced a nonsensical `shown`/`capped` pair silently. The one real call site (`copy-deltas.ts`) never passes `cap`, unaffected.
- `scripts/pixel-compare.ts`: new export `checkZoomedHeight(pageHeight, zoom, rectHeight)`.
- `next.config.ts`: new `headers()` export (previously absent entirely).
- `e2e/headers.spec.ts` (new file).
- `src/app/api/form-beacon/route.ts`: a declared `Content-Length` over 4096 bytes now answers 413 (previously would have been parsed and then answered 400 for an over-length `page` field, or worse, accepted if crafted to pass the schema at exactly 4096+ bytes with a short `page` — not actually possible given the `.strict()` schema's real max, but the check now fails closed before that reasoning would ever matter).
