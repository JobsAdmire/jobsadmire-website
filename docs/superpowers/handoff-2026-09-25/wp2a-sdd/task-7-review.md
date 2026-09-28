# Task 7 review — Gate tooling (BASE 9e48725 → HEAD 9af7983, 7 commits)

**Spec compliance:** ❌ non-compliant — the brief landed faithfully (8 of its 16 full-file blocks are byte-identical on disk and the other 8 differ only by additive W91/W93/W94/W104 code; frozen Produces, item 0, W93, W94 and the docs are all in), but W91's preview path does not work: `lhci collect` never loads `lighthouserc.preview.json`, so every preview gate run fails `categories:seo` (reproduced), and two preview-facing consumers send no bypass header — the parts of T15 Cycle 1 that the additions moved into this task.
**Code quality:** ❌ changes required: 1 Critical, 4 Important, 8 Minor

Reviewer runs, one heavy job at a time, all at HEAD `9af7983` (clean tree before and after; nothing in the repo edited; the build appended no `nextjs-agent-rules` block):
- **Gate (low):** typecheck ✓, lint ✓, format ✓, vitest **103 files / 582 tests** ✓ (matches the report).
- **Build:** `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` exit 0; Next's Experiments log prints `cpus: 2` **and** `serverActions` (Task 2's `bodySizeLimit` survived); 13/13 pages on 2 workers; Turbopack cache warm (compile 0.4 s). `/robots.txt` is `○` (static — prerendered at build).
- **One `next start` on :3000** (with a throw-away `REVALIDATE_SECRET` on both sides): `npm run gate` ✓, `npm run gate:launch` ✗ by design, `placeholder-count.ts` ✓, `npm run js-size` ✓, `js-size --routes` ✓, `npm run pixel` for `hire` and `home` ✓ (+ two failure-mode probes), then killed.
- **Scratch-only probes** (under the review scratch dir): a W120 reconciliation script, a CORS/header probe with two local servers, a design-page load probe with and without the harness header, and a preview stand-in (a proxy in front of `next start` answering `robots.txt` with the preview face) driven by `gate.sh`'s own `lhci` commands.

## Spec compliance evidence

**Method.** A scratch script extracted every full-file code block from the brief (16 blocks; `gate.sh` rebuilt to its end state by applying the Cycle 2 and Cycle 4 inserts) and diffed each against disk.

| File | Result |
| --- | --- |
| `e2e/routes.ts`, `e2e/routing.spec.ts`, `scripts/placeholder-count.ts`, `scripts/placeholder-count.test.ts`, `scripts/pixel-compare.test.ts`, `scripts/launch/unbuilt-routes.launch-check.ts`, `vitest.launch.config.mts`, `lighthouserc.json` | **byte-identical** to the brief |
| `scripts/gate-routes.mjs` | brief body moved into a guarded `main()` + W93 `careersDetailRoutes` (additive; stdout contract unchanged) |
| `scripts/gate-routes.test.ts` | brief's 6 cases verbatim + 4 W93 cases; spawns strip `OPS_API_URL` |
| `scripts/gate.sh` | brief end state + W91 (warning, `LH_EXTRA_HEADERS`, `--extra-headers` on collect, `.vercel.app` → preview rc) — see C1 |
| `scripts/js-size.mjs` / `.test.ts` | brief verbatim + W94 `parseRoutesArg`/`collectExtra`; the ceiling pin also covers `lighthouserc.preview.json` |
| `e2e/seo.spec.ts` | brief verbatim except the robots test, made face-aware (W104) — see I3 |
| `scripts/pixel-compare.ts` | brief verbatim + W91 header on the shared context — see I1 |
| `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` | brief verbatim + one W91 sentence |

Inserts checked against the brief: the three h1s (`(site)/page.tsx`, `(site)/hire-workers/page.tsx`, `(minimal)/thank-you/page.tsx` → `data-testid="page-h1" data-lcp-slot="h1"`, no other references to `home-h1`/`hire-h1` remain); `package.json` (`gate:launch`, `js-size`, `pixel` inserted after `gate`, Task 6's `assets:*` untouched — W42; devDeps `pixelmatch ^5.3.0`, `pngjs ^7.0.0`, `@types/pixelmatch ^5.2.6`, `@types/pngjs ^6.0.5`); `.gitignore` (`.pixel/`, plus `.lighthouseci-extra/`); `lighthouserc.local.json` (204800 + the one appended sentence).

- **Produces (frozen) — intact.** `GateRoute`, `GATE_ROUTE_TABLE`, `GATE_ROUTES`, `INDEXABLE_GATE_ROUTES`; `gate-routes.mjs [--all] [--json]`, exit 2 on unknown flag; `gate.sh` default/launch order; both rc files at 204,800; `SCRIPT_CEILING`, `LAZY_LINE`, `JsSizeRow`, `summarizeLhrs`, `formatJsSizeTable`; `PlaceholderScan`, `RouteVerdict`, `scanPlaceholders`, `evaluateScan`, `formatReadinessTable`; launch check + `vitest.launch.config.mts` importing `./vitest.config.mjs` (W50); `PIXEL_WIDTHS`, `PixelLocale`, `PixelPageKey`, `PixelBundle`, `PIXEL_PAGES`, `resolvePixelRoute`, `comparePngs`, output naming and `report.json` shape. Matches `produces-final.md` § Task 7. Additions (`careersDetailRoutes`, `parseRoutesArg`, `expectedRobots`/`SiteFace`, `lighthouserc.preview.json`) are new names only.
- **Item 0 — ✓.** `next.config.ts:23` `cpus` merged into the existing `experimental` object (build log shows `cpus: 2` and `serverActions`); ARCHITECTURE § Run locally sentence; `.env.example` commented `# NEXT_BUILD_CPUS=2`. Parsing has no NaN guard (M5).
- **W91 — ❌ (partly).** `playwright.config.ts:13-18` `extraHTTPHeaders` exactly as the additions spell it ✓; `lighthouserc.preview.json` exists ✓ and `gate.sh` passes `--extra-headers` to every gate `lhci collect` ✓ — **but** the preview rc is only handed to `assert`, so its `skipAudits` never runs (C1); the placeholder counter and the W94 collector send no header (I2); the pixel harness sends it context-wide (I1). DEPLOYMENT/`.env.example` document the name only ✓ (no value anywhere in the 7 commits — scanned).
- **W91/W104 face-aware robots — ✓ with a deviation.** `e2e/helpers/face.ts` `expectedRobots(baseUrl, env)`; the seo spec uses it. Unset `NEXT_PUBLIC_SITE_FACE` → production, where the additions say `!== 'production'` → preview (⚠️ 1). Probe: the local build serves the **production** face (`Allow: /`, `Disallow: /api/`, `/tesekkurler`, `/en/thank-you`, `Sitemap:`), because `VERCEL_ENV` was unset at build; `src/app/robots.ts:8` renders `disallow: '/'` whenever `VERCEL_ENV` is set and not `production` (and `src/app/robots.test.ts:37` covers it) — verified and kept.
- **W93 — ✓.** `/kariyer/<slug>` + `/en/careers/<slug>` (match `pathnames` `'/careers/[slug]'`), 3 s `AbortSignal.timeout` covering headers and body, `try/catch` so no unhandled rejection, the skip line on **stderr** (so `gate.sh`'s `LH_PATHS` stays clean — seen in both gate runs), mocked-fetch unit tests. The response shape was checked against Operations (see deviation 3): it matches.
- **W94 — ✓ locally, ❌ on a preview.** `--routes=<a,b>` collects into `.lighthouseci-extra` and prints without assertions (ran it: 179,927 B for `/tesekkurler?form=hire`); no bypass header (I2b); the space-separated spelling the ruling uses is silently ignored (M2).
- **Tasks 3–6 as built — ✓.** One build (W126) + `next start` curls; gallery 404 in production (R41, curl and `e2e/ops.spec.ts`); route-group files edited in place; `routes.ts` exports consumed only by the launch check; `e2e/seo.spec.ts` keeps Task 4's two OG tests (merged, same assertions incl. `/og/de/home.png` → 404); `e2e/chrome.spec.ts` untouched, its five cases pass; `assets:*` scripts intact; no server code touched (W125/W119/W122/W129 not engaged); bypass secret read only from the env.
- **Docs (W45) — ✓ with two defects.** ARCHITECTURE § Quality gate rewritten from the heading through item 6 + page contract + pixel paragraph; from the D20 paragraph to EOF the file is **byte-identical** to BASE (checked with `cmp`). PRD §6/§11, OPERATING, README "Three more gate commands", CLAUDE.md JS bullet (200 KB / 204,800 B; the Cycle 6 grep prints nothing), doc-map row, DEPLOYMENT row (the 31-line diff is Prettier re-padding the table: `git diff -w` shows one added row). Defects: ARCHITECTURE.md:312 still says "the 180 KB budget" and the doc-map row's columns are swapped (M7); the W91 sentences describe C1/I1's behaviour as intended (fix with them). Nothing under `docs/superpowers/handoff-2026-09-25/`, the ruling log, the WP2a plan, `docs/WEBSITE-HANDOFF.md`, `docs/SEO.md`, `contract/`, `design-package/` or `src/content/local/` was modified (`git diff --stat` empty).

## Findings

### Critical

**C1. Preview runs never load `lighthouserc.preview.json` at collect time, so `is-crawlable` still runs and every preview gate run fails `categories:seo`.**
- **Where:** `scripts/gate.sh:64` — `npx lhci collect --additive --url=… --extra-headers=…` has no `--config`, so `lhci` reads `lighthouserc.json` from the working directory. `scripts/gate.sh:69-81` chooses the config only after collection; the comment at `:74` says "only `assert` changes here, never collect/upload". `lighthouserc.preview.json:2` (`_comment`: "gate.sh selects this config for assert…"). `docs/ARCHITECTURE.md:260` (item 5's W91 sentence) documents the same.
- **Why it fails:** `skipAudits` is a `collect.settings` key. Lighthouse computes category scores when it collects; `lhci assert` only reads the stored LHRs.
- **Scenario:** the first binding preview run (the sign-off run — D27, `docs/OPERATING.md`). The preview `robots.txt` is `Disallow: /`, so `is-crawlable` scores 0, SEO scores ≈ 0.69, and the preview assert still requires SEO = 1. The gate goes red for exactly the reason W91 exists.
- **Confirmed — reproduced with `gate.sh`'s own commands** against a local preview stand-in (a proxy in front of the reviewer's `next start` answering `/robots.txt` with `User-Agent: *` / `Disallow: /`), from a scratch directory holding copies of both rc files:
  - As built: the LHR has `configSettings.skipAudits: null`, `is-crawlable` score 0, `categories.seo` 0.69. `lhci assert --config=lighthouserc.preview.json` → `✘ categories.seo failure for minScore assertion — expected: >=1, found: 0.69`.
  - Control, with `--config=lighthouserc.preview.json` on collect: `skipAudits: ["is-crawlable"]`, the audit is absent, `categories.seo` = 1. Only the localhost LCP artefact (R50) remained.
  - The local gate's own LHRs also show `skipAudits: null`: collection always uses `lighthouserc.json`'s settings, whatever the face.
- **Prior warning:** T15 Cycle 1 — the cycle the additions moved into this task (W100) — spells out this trap: "`collect` reads the config from `lighthouserc.json` by default — so the `collect` loop … passes `--config="$LHCI_CONFIG"` too, otherwise the skip never reaches the run".
- **Fix:**
  - Move the three-way selection above the loop.
  - Collect with `npx lhci collect --additive --config="$LHCI_CONFIG" --extra-headers=… --url=…`. The local and production rc files have the same `collect` block as `lighthouserc.json`, so nothing else changes.
  - Correct the two `gate.sh` comments, the preview `_comment` and ARCHITECTURE item 5.

### Important

**I1. The pixel harness sets the bypass header on the context both pages share. That breaks the design side on every run, and on a preview run it would send the secret to six third-party hosts.**
- **Where:** `scripts/pixel-compare.ts:175-185` — `browser.newContext({ …, extraHTTPHeaders: { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? '' } })` is used for the design page and the built page alike.
- **What happens:** Playwright applies context headers to every request, cross-origin included. A non-safelisted header forces a CORS preflight on CORS-mode requests (web fonts, `fetch`). The header is always present — `?? ''` sends it empty when the secret is unset.
- **Confirmed:**
  - **Controlled probe (two local servers):** with the header set or empty, it reached the cross-origin CSS and script requests. A cross-origin `fetch()` was preflighted (`OPTIONS`, header absent) and failed with "Failed to fetch".
  - **The real design Homepage, loaded exactly as the harness loads it (390 px, reduced motion, `ja-lang`), with the harness's empty header:**
    - no web font loaded — both Archivo `.woff2` files from `fonts.gstatic.com` were blocked by CORS;
    - `cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json` (the map data) was blocked by CORS.
  - **The same page without the header:** Archivo loaded and nothing failed.
  - **Hosts that would receive the secret on a preview run:** the design page contacts `fonts.googleapis.com`, `fonts.gstatic.com`, `unpkg.com`, `cdn.jsdelivr.net`, `flagcdn.com` and `www.jobsadmire.com`.
- **Impact:** every design capture since `73abf7a` is rendered in a fallback font, and the Homepage capture has no map. Every `% match` in `.pixel/report.json` — the implementer's and the reviewer's — compares against a degraded design. Run as documented against a protected preview, the owner's bypass secret leaves for third parties.
- **Wrong claims to correct:** "on the built-route requests" / "the design side is our own throw-away local server" appears at `pixel-compare.ts:22-24` and `:180-181`, `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md:7-9`, `docs/DEPLOYMENT.md:45` and `docs/ARCHITECTURE.md:270`. "empty/unset is a no-op" appears at `playwright.config.ts:13-15`, `docs/ARCHITECTURE.md:251` and `docs/DEPLOYMENT.md:45`.
- **Fix:**
  - Send no header on the design side.
  - Inject it only for the built origin, and only when the secret is non-blank — e.g. `if (secret) await context.route(`${new URL(base).origin}/**`, (r) => r.continue({ headers: { ...r.request().headers(), 'x-vercel-protection-bypass': secret } }))`, or T15's `protectionBypassHeaders()`, which returns `{}` when blank.
  - Re-run `hire` once to confirm the design capture now uses Archivo.

**I2. Two preview-facing consumers never send the bypass header.**
- **(a) `scripts/placeholder-count.ts:96-100`:** `fetchRoute` sends `accept: 'text/html'` only.
  - The launch profile exists to run against the preview before Gate A. Against a protected preview every route answers 401 (or the SSO redirect, with `redirect: 'manual'`), so the content-readiness table would read `HTTP 401` on every row.
  - T15 Cycle 1, moved here, specified `headers: { accept: 'text/html', ...protectionBypassHeaders(process.env) }`.
- **(b) `scripts/js-size.mjs:120`:** W94's `collectExtra` runs `npx lhci collect --additive --url=…` without `--extra-headers`, although W91 says every `lhci collect` sends the header.
  - Against a protected preview, `js-size --routes` would measure the Vercel login page and print it as the route's figure — and W94 exists to fill T12/T13/T15 ledger cells from the preview.
- **Confirmed by:** reading both files. (b)'s collector otherwise works: the reviewer ran `--routes=/tesekkurler?form=hire` against localhost and got 179,927 B.
- **Fix:** one header builder (T15's `protectionBypassHeaders`), used in both places. For (b), pass `--extra-headers=<JSON.stringify(headers)>` when it is non-empty.

**I3. The robots test's preview branch cannot fail against a production body.**
- **Where:** `e2e/seo.spec.ts:91-93` — `if (face === 'preview') { expect(body).toContain('Disallow: /'); return; }`.
- **Scenario:** the production body contains `Disallow: /api/` and `Disallow: /tesekkurler`, so the substring always matches. A preview that wrongly serves the production (indexable) rules passes — and that is the regression the W104 face-aware test exists to catch.
- **Confirmed:** against the reviewer's `next start` `robots.txt` (production face), `body.includes('Disallow: /')` is `true`. The strict check `/^Disallow: \/$/m.test(body) && !/^Allow:/m.test(body)` is `false` on that body and `true` on the preview body.
- **Fix:** `expect(body).toMatch(/^Disallow: \/$/m); expect(body).not.toMatch(/^Allow:/m); expect(body).not.toContain('Sitemap:');` — T15's version asserted exactly this.

**I4. At 1440 the design capture is a 1920-px-wide canvas that is 43 % blank, so the 1440 score is not like-for-like (brief-inherited).**
- **Where:** `scripts/pixel-compare.ts:207`, `designPage.screenshot({ fullPage: true })`, under the design's `@media (min-width: 1101px) { html { zoom: 0.75 } }`. Playwright sizes the full-page shot in unzoomed CSS px (1440 / 0.75 = 1920 wide). `comparePngs` (`:83-86`) then pads the 1440-wide built capture to 1920.
- **Confirmed:**
  - `.pixel/hire-tr-1440-design.png` is **1920×7804**. Its non-white content ends at column 1448 and row 5852 (= 7804 × 0.75): **56.6 % of the canvas**.
  - The other 43 % is white on both sides and counts as matching.
  - The 390 and 900 captures are 390 and 900 px wide (the zoom starts at 1101 px).
  - The claim in the brief and at `docs/ARCHITECTURE.md:270` ("so 1440 compares like-for-like") holds for the content's scale, not for the canvas.
- **Impact:** the 1440 `% match` is inflated relative to 390/900. `hire` reports 91.66 %; the same diff over the content box is ≈ 85.2 %. Ledger rows would put unlike numbers side by side.
- **Fix:** in `main()` (no Produces change), clip the design shot to the zoomed box — read `scrollHeight` and the zoom from the page and pass `clip: { x: 0, y: 0, width: viewport.width, height: ⌈scrollHeight × zoom⌉ }` — or crop to the design's content bbox before `comparePngs`. Add a width-padding case to the tests; only height padding is tested today.

### Minor

**M1. `e2e/helpers/face.ts` is untested, and its rehearsal recipe is wrong.**
- **(a) No test.** The stated reason — `vitest.config.mts` doesn't include `e2e/**`, and Playwright would pick up an `e2e/*.test.ts` — is solved by putting the test under `scripts/`. It can import `../e2e/helpers/face` exactly as `scripts/gate-routes.test.ts:4` imports `../e2e/routes`. Three cases would pin the helper: a `vercel.app` host, the unset face, and a non-`production` face.
- **(b) Wrong recipe.** `face.ts:16-17` says `VERCEL_ENV=preview npm start` rehearses the preview face. `/robots.txt` is prerendered at build (`○ /robots.txt` in the build output), so only `VERCEL_ENV=preview npm run build` changes it.

**M2. W94's own spelling is silently ignored.**
- **Where:** `scripts/js-size.mjs:97-105` recognises only `--routes=`, and unknown arguments are never rejected.
- **Confirmed:** `node scripts/js-size.mjs --routes /foo,/bar` printed the previous gate table and exited 0.
- **Fix:** accept `--routes <list>` too, or exit 2 on an unknown argument.

**M3. `collectExtra` leaves the extra routes' HTML reports in the main `.lighthouseci`.**
- **Where:** `js-size.mjs:123-124` moves only `lhr-*.json`, but `lhci collect` also writes `lhr-*.html`.
- **Confirmed:** after the reviewer's `--routes` run, two new `.html` files remained in `.lighthouseci`. This is harmless to assert and upload (both read JSON only), but it contradicts "only THIS run's new files are moved out" (`:12-14`, `:109-113`).
- **Stale comment:** `js-size.test.ts:93-95` says the collector is "exercised manually (README § Running the gate)". The README never mentions `--routes`, and the report records no run.

**M4. The W93 skip message and the 3 s abort are untested.**
- **Where:** `scripts/gate-routes.test.ts:90` is titled "prints 'detail rows skipped (door not configured)' …" but asserts only `[]`. The message is printed in `main()` (`gate-routes.mjs:68-70`), and every CLI spawn discards stderr (`:12`). The "within 3s" case (`:85-87`) only checks that an `AbortSignal` was passed.
- **Fix:** add a spawn that captures stderr, plus a never-resolving fetch that honours the signal, under fake timers.

**M5. `NEXT_BUILD_CPUS` is unguarded.**
- **Where:** `next.config.ts:23`: `'abc'` → `NaN`, `'0'` → `0` and `'2.5'` → `2.5` all reach `experimental.cpus`. The parse was checked; Next's handling of these values was not exercised. `Number('')` is correctly avoided.
- **Fix:** `const n = Number(v); cpus: Number.isInteger(n) && n > 0 ? n : undefined`.

**M6. The pixel harness never checks either side's HTTP status.**
- **Where:** `scripts/pixel-compare.ts:198-210`.
- **Confirmed:** `--page=calc --widths=390`, run against the unbuilt `/maliyet-hesaplayici` (404), printed "50.40 % match" and exited 0.
- **Missing design file:** it would 404 on the local server and then wait 30 s on `waitForSelector('h1')` before a generic timeout.
- **Fix:** check `response?.ok()` on both `goto`s and exit 2 naming the URL.

**M7. Two doc defects.**
- **(a)** `docs/ARCHITECTURE.md:312` (§ Design system, the `ClientIslands` bullet) still reads "(Ruling R47, the 180 KB budget below)". The brief's Cycle 6 grep pattern doesn't match "180 KB budget", so the stale figure survived — and § Quality gate is above that bullet, not below it.
- **(b)** `CLAUDE.md:37`: the new doc-map row puts the path in the "Task / question" column and the description in "Doc & section". This is verbatim from the brief, but every other row runs question → doc.

**M8. `gate.sh` header handling nits.**
- **`:53`** builds the `--extra-headers` JSON by string interpolation, so a secret containing `"` or `\` would produce invalid JSON. Risk is low (Vercel secrets are alphanumeric), and `node -e` with `JSON.stringify` avoids it.
- **`:35-37`** prints the unset-secret warning on every localhost run; T15 warned only when the preview config is selected.
- Verified: with an empty secret the JSON is valid, and `lhci` accepted it in both gate runs.

## ⚠️ Design items needing a controller ruling

1. **What does an unset `NEXT_PUBLIC_SITE_FACE` mean?**
   - **Implementer (`face.ts:23`):** unset → production.
   - **Additions (`!== 'production'` → preview) and reconcile-rulings W91** (production rules "only when `VERCEL_ENV=production` or on localhost with `NEXT_PUBLIC_SITE_FACE=production`"): unset → preview.
   - **Facts:** the site never reads `NEXT_PUBLIC_SITE_FACE`. `robots.ts` is driven by `VERCEL_ENV` and prerendered at build, and a local build serves the production face (probed). The literal rule would turn every default local gate run red.
   - **Recommendation:** accept the implementer's default and amend the W91/W104 wording. The implementer described this in "What was implemented" but did not list it as a deviation.
2. **Which hosts are preview?**
   - `gate.sh:77` and `face.ts:22` recognise only `*.vercel.app`.
   - `staging.jobsadmire.com` is a documented Preview alias (`docs/ARCHITECTURE.md:352-355`, `README.md:61`). T15 Cycle 1 chose the preview rc for it, and T14 runs there (W92). A gate or full Playwright run against staging would assert production robots and fail `is-crawlable`.
   - **Recommendation:** add staging to both, through one shared helper.
3. **Which JS figure does the ledger carry from now on?**
   - W120's local proxy (gz-9 over the HTML `<script src>` set, `noModule` excluded) is **169,353 B** on `/` at `9af7983`, unchanged from Task 6.
   - `js-size.mjs` prints **177,782 B**: Lighthouse transfer size on localhost (reconciliation below).
   - **Recommendation:** from Task 7 on, the ledger records `js-size`'s figure — the same metric the gate asserts, and it counts post-hydration chunks the proxy misses — with this task's bridge (169,353 proxy ≡ 177,782 js-size local on `/`), and the preview run's `js-size` figure as binding once a preview exists.
   - The report labels 177,782 "W120 method — local `<script src>` proxy"; that label is wrong.
4. **Should the header be sent when the secret is unset?**
   - The additions spell Playwright's header as `?? ''`, which always sends it, empty or not. The probe shows an empty header still forces CORS preflights, which fail on hosts that don't allow it — that is what breaks the design page in I1.
   - On localhost the built site makes no cross-origin CORS-mode requests (216 passed); a preview with GTM/Turnstile may.
   - Context-wide headers in Playwright and Lighthouse also send the secret to whichever third parties the built page calls (GTM/Turnstile under W14).
   - **Recommendation:** use T15's `protectionBypassHeaders()` semantics (no header when blank) for Playwright, `lhci` and the placeholder counter; scope the pixel harness's header to the built origin (I1); and accept the residual third-party exposure knowingly, or use Vercel's `x-vercel-set-bypass-cookie` where a cookie can carry it.

## The implementer's deviations — verdicts

| # | Deviation | Verdict |
| --- | --- | --- |
| 1 | `gate.sh` landed in its end state in the Cycle 1 commit | **Accept.** No TDD signal lost; `gate:launch` was still added only in Cycle 4, once its files existed. |
| 2 | Preview rc = `collect.settings.skipAudits: ["is-crawlable"]` rather than dropping `categories:seo` | **Accept the design** (it matches T15 and W91's "drops the `is-crawlable` audit"); **reject the execution** (C1: the rc never reaches collect). |
| 3 | W93 response envelope guessed | **Accept — verified correct; details below.** The `{ data: [...] }` branch is the real one; the raw-array and `data.items` branches are dead but harmless (optional: drop them, since the fixture already uses the real shape). |
| 4 | `face.ts` has no Vitest test | **Reject** (M1). A `scripts/` test can import it, and I3 shows the preview branch is effectively unverified. |
| 5 | CLI spawns strip `OPS_API_URL` | **Accept.** Good hygiene. |
| 6 | `.lighthouseci-extra/` git-ignored | **Accept.** |
| — | *(unlisted)* `gate-routes.mjs` CLI moved into a guarded `main()` | **Accept.** The stdout contract is unchanged; the spawn tests and both gate runs confirm it. |
| — | *(unlisted)* unset face → production | **⚠️ 1.** |
| — | *(unlisted)* pixel header on the shared context | **Reject** (I1). |

**W93 shape, checked in Operations (read-only):**
- **Route:** `careers-public.controller.ts:48,60-62` — `@Controller('careers')` + `@Get('openings')` under `main.ts:55` `setGlobalPrefix('api')` → `GET /api/careers/openings`, public.
- **Envelope:** `careers-public.service.ts:533` returns `{ data: items.map(shapePublicOpening), meta: { total, page, limit, totalPages } }`, and each item carries `slug` (`:90`, renamed from `publicSlug`).
- **Filter and order:** `:488` filters to OPEN + publicly listed + `publicSlug` not null; `:500` orders by `createdAt desc`; the default limit is 20. So "first item" is sufficient.
- **Interceptor:** the global `AuditInterceptor` only `tap`s and returns early for unauthenticated requests, so nothing reshapes the response.

**Concerns:**
- **No preview exists:** true and pre-existing. But C1 and I1 did not need one — both reproduced locally with a stand-in.
- **W93 envelope:** resolved (matches).
- **`face.ts` untested:** agreed (M1, I3).
- **ARCHITECTURE wording:** the rewrite matches the brief, and from D20 to EOF the file is byte-identical. The woven-in W91 sentences in items 1 and 5 and in the pixel paragraph state C1's and I1's behaviour as intended — correct them together with those fixes.

## Gate run results

- **Default profile** (`REVALIDATE_SECRET=… E2E_BASE_URL=http://localhost:3000 npm run gate`): **exit 0, `gate: OK`** in 2 min 05 s.
  - Playwright, both projects: **216 passed** (26.7 s), none skipped.
  - `gate-routes: detail rows skipped (door not configured)` appeared on stderr.
  - Lighthouse: 4 routes × 2 runs, asserted with `lighthouserc.local.json`. Every error-level assertion passed; LCP was a warning at 2,855–3,008 ms (R50). Performance minimum was 0.95 on `/` and `/en` — at the threshold on localhost.
- **Launch profile** (`npm run gate:launch`): **exit 1, as designed**, in 2 min 05 s.
  - It re-ran the whole default gate: 216 passed, Lighthouse green, the same js-size table.
  - Then `gate: launch — every pathnames route is built (W20)` failed: `AssertionError: expected [ '/hiring-cost-calculator', …(18) ] to deeply equal []` — the 19 `UNBUILT_PATHNAMES` keys.
  - `set -e` stopped the run there: "content readiness" and "gate: OK" never printed, which is what the brief's script does.
  - The placeholder counter run standalone: **exit 0**. `/`, `/en`, `/isci-talebi`, `/en/hire-workers` and `/tesekkurler?form=hire` → 200, 0 placeholders, LCP slot `h1`, `ok` — the brief's predicted table. It wrote `lighthouse-report/content-readiness.json`.
- **Preview path** (stand-in proxy, C1): as built, `categories.seo` **0.69 ✘**; with `--config` on collect, **1.0 ✓**.
- **js-size** (method: Lighthouse `resource-summary` → the `script` row's `transferSize`, worst of 2 runs — the same number `resource-summary:script:size` asserts). `/`, `/en`, `/isci-talebi` and `/en/hire-workers` are each **177,782 B**, with 27,018 B headroom to 204,800 and below the 194,560 lazy line. `--routes=/tesekkurler?form=hire` gave **179,927 B** (24 s).
- **W120 reconciliation on `/`** — it closes to the byte:

  | Component | Bytes |
  | --- | ---: |
  | W120 proxy: gz-9 over the 10 `<script src>` files in `/`'s HTML, `noModule` polyfill (39,373 B gz-9) excluded — identical to the Task 6 re-review | 169,353 |
  | + one script Chrome fetched after hydration that is not in the HTML `<script src>` set (`3flqaayqa_-4c.js`, 6,770 B raw; most likely the `next/dynamic` client-islands chunk — not verified), gz-9 | +2,955 |
  | + `next start`'s runtime gzip (default level ≈ 6) and two sub-1 KB files it serves uncompressed (988 B + 803 B raw): wire bodies 173,437 vs gz-9 172,308 | +1,129 |
  | + HTTP response-header bytes (11 responses) that Chrome counts in `transferSize` (curl measured 4,107 B) | +4,345 |
  | **= Lighthouse `resource-summary:script:size` on localhost = what `js-size.mjs` prints** | **177,782** |

  - The summariser does **not** count the `noModule` polyfill. Chrome never fetches it — it is absent from both LHRs' `network-requests`. Counting it would give 208,726 B. So it follows W120's exclusion, and that is **not** a finding.
  - br-11 over the proxy set is 146,228 B. Vercel serves brotli and HTTP/2 compresses headers, so the binding preview figure should sit well below both local numbers.
  - **For the ledger:** Task 7 adds no client code. Carry **169,353 B** (W120 proxy, unchanged) plus **177,782 B** as the js-size local baseline; the method for WP2b is ⚠️ 3.
- **Pixel harness** (TR, `--base=http://localhost:3000`, ~16–17 s per page). Every design capture is degraded (fallback font, no map — I1), the 1440 figures are inflated by a 43 % blank canvas (I4), and the built side is still the spike, so these numbers exercise the mechanics only:

  | Page | 390 match / mismatch | 900 match / mismatch | 1440 match / mismatch | Heights (design / built) |
  | --- | --- | --- | --- | --- |
  | `hire` | 82.43 % / 17.57 % | 84.75 % / 15.25 % | 91.66 % / 8.34 % | 9988·12620·7804 / 971·951·900 |
  | `home` | 69.32 % / 30.68 % | 72.41 % / 27.59 % | 88.09 % / 11.91 % | 10776·12713·8690 / 996·975·900 |
  | `calc` (390 only) | 50.40 % / 49.60 % vs a **404** built page (M6) | — | — | 3823 / 1256 |
  | `blog-article` | not runnable: `Error: pixel: no blog body in tr — pass --route=/blog/<slug>`, exit 1 (as designed until T12) | | | |

  The implementer's `hire` run (82.43 / 84.76 / 91.75) agrees within capture noise.

## Parked (out of Task 7's scope, for the WP2a final review)

- **W93 detail rows reach Lighthouse only.**
  - axe, the width sweep, the placeholder counter and the page-contract and SEO loops import `GATE_ROUTES`/`INDEXABLE_GATE_ROUTES` from `e2e/routes.ts` directly.
  - `gate-routes.mjs` never consults `UNBUILT_PATHNAMES`. So an operator who exports `OPS_API_URL` before T11 ships `/careers/[slug]` makes Lighthouse audit a 404, and the gate fails.
- **Launch profile order.** The 0.2 s source-level W20 check runs after the ~2 min default gate. `set -e` then stops before the placeholder counter, so while `UNBUILT_PATHNAMES` is non-empty a launch run never prints the content-readiness table. Consider running the W20 check first and collecting both launch results before exiting.
- **The pixel `% match` is dominated by white padding when heights differ.** The unported `hire` spike still scores 82–92 %. The plan has no numeric pass mark, but the ledger row records the %. Consider logging the height ratio or a content-area match beside it.
- **Context-wide bypass headers in Playwright and Lighthouse** (⚠️ 4): on the first preview run, watch the console and best-practices audits for CORS failures from GTM/Turnstile, and for where the secret travels.
- **Production `*.vercel.app` aliases.** `face.ts` and `gate.sh` would classify the production deployment's own `*.vercel.app` alias as preview. This is an edge case — nobody gates that URL — but it is worth a comment where the hosts are listed.
- **Local performance is at the edge** (0.95 minimum on `/` and `/en` under Lantern on localhost); watch it on the preview.
