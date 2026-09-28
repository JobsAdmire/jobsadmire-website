# Report — WP2a final review, fix round 3 (micro), 2026-09-28

Base `41a33cd` → HEAD `425056a`, branch `wp2/foundation`, 4 commits, not pushed. Suite **120 files / 794 tests** (base 118 / 775). Verify (`typecheck && lint && format && vitest --maxWorkers=1`, 4 GB heap) green before every commit; one heavy job at a time; one proof session after the last commit. Logs: `…/scratchpad/r3/` (`verify-{1..4}.log`, `build.log`, `server.log`, `headers-proof.txt`, `gate.log`, `gate-launch.log`, `js-size.log`, `pixel.log`, `headers-precheck.cjs`).

## Commits

| # | sha | items | suite after |
| --- | --- | --- | --- |
| 1 | `3b9f885` | 1 (N1, W158 anchor sweep), 6 (N6, launch profile) | 119 / 781 |
| 2 | `ab6f42d` | 2 (N2, W158 guard), 3 (N3, docs), 5 (N5, bundle rows) | 119 / 783 |
| 3 | `51d59db` | 4 (N4, W157 header scope), 7 (N7, W158 streamed cap) | 119 / 787 |
| 4 | `425056a` | 8 (N8, landmarks), 9 (N9, rendered colours), 11 (N11, MobileNav) | 120 / 794 |

Item 10 (N10) is the proof session's pixel run.

## Per item

**1 — N1 / W158 anchor sweep.** `scripts/launch/dead-targets.ts:98-165`: structural `CtaHref`/`CtaEntry`/`CtaAnchorTarget` (no next-intl import; `hash?: string | null` because next-intl's `Href` object form is `UrlObject`'s), `anchorOf` (`:109`), `ctaAnchorTargets` (`:122` — `DEFAULT_CTAS` then every `CTA_BY_PATHNAME` entry, primary AND secondary; the page is the link's own `pathname`, never the table key), `missingCtaAnchors` (`:148` — both locales through an injected localizer, one line per miss naming the slot and the anchor). `dead-targets.launch-check.ts:44-56` sweeps the real tables with `getPathname` (non-vacuous: asserts `DEFAULT_CTAS.primary → /hire-workers#request-form` is in the set). Tests `dead-targets.test.ts:132-199` (3 cases, mocked fetch, real tables + real `getPathname` in the first). RED (the round-2 loop extracted unchanged into the module first, so the RED is the gap itself): `expected [] to deeply equal [ "DEFAULT_CTAS.primary (/hire-workers#request-form): tr /isci-talebi → missing id=\"request-form\" (status 200)" ]`; the key-vs-link case received `pathname: "/"` for a link to `/contact`; the walk case lacked `DEFAULT_CTAS.primary` and the secondary. GREEN: 15/15. Proof session: the launch list now carries both `DEFAULT_CTAS` misses (below).

**2 — N2 / W158 guard.** The module is `src/lib/format/date/formatReadMinutes.ts`. `src/design/__tests__/client-imports.test.ts`: file reads made injectable (`ModuleFs`, `:113-125`), check (b) factored into `clientOffenders` (`:211`), `clientForbidden` (`:179`) = the three barrels + `@/lib/format/date/formatReadMinutes` (`READ_MINUTES`, `:174`) + any `src/messages/*.json` (any spelling); forbidden targets are graph leaves. New in-memory fixture case (`:307`): a client module importing it by path, a client module reaching it through a directive-less helper (relative `.ts` spelling), a client module importing `@/messages/tr.json` → three offender lines; a type-only import and a server importer → none. RED (refactor first, rule absent): `expected [] to deeply equal [ …(3) ]`. GREEN 6/6; real tree green — no client module reaches it, so nothing had to move; the real-tree case now also pins that `PostCard` (the one real importer) is outside the client graph. `formatReadMinutes.ts` comment names the guard.

**3 — N3.** `docs/ARCHITECTURE.md:156` — the W90 denylist clause → "only the `sys.*` namespaces client components read: the allowlist `CLIENT_SYS` = consent, languageHint, errorTitle, errorRetry, form, pinned two-way by `client-messages.test.ts` …; W148, which inverted W90's denylist". Also the two nits the re-review filed under N3: `:299` "Nine page islands" → "Ten page islands … twelve modules with the two hooks" (`LazyIsland`, `useInView` added to the list); the scripts layout row (`:33-36`) no longer reads as if `bypass.test.ts`/`face.test.ts` were `build-flags.ts`'s tests (and lists `gate.test.ts`). Plus the W158 sentence in § Design system's guard paragraph.

**4 — N4 / W157.** `next.config.ts:36-65`: `X-Content-Type-Options: nosniff` on `/:path*`; `Referrer-Policy` + `Permissions-Policy` on `/((?!_next/static/|_next/image(?:/|$)).*)`; `X-Frame-Options` on `/((?!_next/static/|_next/image(?:/|$))(?!og/).*)` — each key set by exactly one block. Pre-checked in scratch through Next's own compiled `path-to-regexp` with the custom-route options (strict, case-insensitive, trailing-slash modifier): it reproduces the re-review's manifest regex for the old source (`^(?:\/((?!og\/).*))(?:\/)?$`) and splits 23 sample paths as intended. `e2e/headers.spec.ts:30-47`: a `/_next/static` chunk and a `/_next/image` URL taken from `/` carry `nosniff` and none of the three (the page loop and the OG case kept). Proven by curl and the gate (below). `docs/ARCHITECTURE.md` Security headers paragraph rewritten.

**5 — N5.** `src/content/collections.test.ts:229-249`: every committed `calculatorRoles`/`rateConfig` row of both bundles through `CalculatorRoleSchema.array()`/`RateConfigSchema.array()` (non-vacuous: ≥ 1 role, exactly one rate row), plus a negative control: a bundle with `multiplier: 0.9` and `effectiveFrom: '2026-02-30'` passes `BundleSchema` but fails both row schemas. RED (temporary case asserting the old check rejects that bundle): `AssertionError: expected [Function] to throw an error`. GREEN 22/22.

**6 — N6.** `scripts/gate.sh:59-83`: in `--profile=launch`, W20 (`vitest … scripts/launch/unbuilt-routes.launch-check.ts`), the W152/W158 sweep (`vitest … scripts/launch/dead-targets.launch-check.ts`) and the D26 table (`tsx scripts/placeholder-count.ts`) run before Playwright, each guarded with `||` so all three always run; then `gate: launch — FAILED: <names>` and exit 1 if any failed, else on into the default run; the trailing launch block is gone. `scripts/gate.test.ts` (new, 3 cases, node env): `npx` swapped for a logging stub on `PATH` (fails calls matching a pattern, always fails `playwright`, so no case reaches `rm -rf .lighthouseci`). RED against the old script: calls `["vitest run --config vitest.launch.config.mts"]` — the run ended at the first red check. GREEN 3/3 (~1.6 s). ARCHITECTURE § Quality gate item 6 + intro, README.

**7 — N7 / W158.** `src/app/api/form-beacon/route.ts:31-61` `readCapped` (used at `:68-69`): reads `request.body` chunk by chunk with a byte counter, cancels the reader and returns `null` → 413 once the count passes 4,096; a stream error reads as empty (→ 400, as before); decoded once at the end. The declared-`Content-Length` pre-check stays. Tests `beacon.test.ts:80-155` (4 cases, `ReadableStream` with `highWaterMark: 0`, `duplex: 'half'`, asserted no `content-length`): 5 × 1 KB → 413, nothing logged/counted; 100 × 1 KB → 413 after pulling exactly 5 chunks, stream cancelled; 4,096 bytes → 204, 4,097 → 413; a multi-byte `ş` split across chunks decodes. RED: `expected 400 to be 413` (×2) and `expected 204 to be 413` — a padded, valid 4,097-byte streamed beacon was accepted. GREEN 10/10. Live probe below.

**8 — N8.** `WhatsAppFab.tsx:10-31`: `<aside aria-label={sys('nav.whatsappFab')} className="hidden lg:block xl:hidden">` around the link, which keeps its position (`fixed …`) and loses its own visibility classes (`flex` now) — the landmark carries the 901–1100 px range, so it leaves the accessibility tree with the button (never an empty landmark); `SocialRail.tsx:59-86` root `div` → `<aside aria-label={sys('nav.socialRail')}>`. Both top-level siblings of header/main/footer. Keys: `sys.nav.socialRail` TR "Sosyal medya bağlantıları" / EN "Social media links", `sys.nav.whatsappFab` TR "WhatsApp kısayolu" / EN "WhatsApp shortcut" (`tr.json`/`en.json:16-17`; parity and voice tests green). Tests: `WhatsAppFab.test.tsx` +2 (per locale), `SocialRail.test.tsx` (new, 2). RED: `Unable to find an accessible element with the role "complementary" and name "WhatsApp kısayolu"` (×4). GREEN; W119 visibility sweep and W155 class scan green. Gate: `e2e/a11y.spec.ts:25-46` runs axe `withRules(['region'])` over the gate routes at 390/1000/1440 (the FAB's range is hit by neither project's viewport; desktop project only) — 5/5 clean. Docs: PRD §5, ARCHITECTURE (SiteChrome line, § Quality gate item 2), CONTENT-MODEL chrome keys.

**9 — N9.** `e2e/chrome.spec.ts:96-125` at 1440, desktop project (Tailwind 4 gates `hover:` behind `(hover: hover)`, which the touch-emulated mobile project never matches): header CTA `background-color` `rgb(22, 32, 46)` → hover `rgb(16, 115, 168)`; the two slim-bar pills (`/temsilci-dogrulama`, `/portal-girisi`, by href inside the bar's root) `color` `rgb(127, 208, 245)`; footer store badge `color` `rgb(255, 255, 255)` (`.filter({ visible: true })` — the footer renders its columns twice, desktop + accordion). Passed in the gate. ARCHITECTURE W155 paragraph notes it.

**10 — N10.** Run in the proof session; result below (exit 2).

**11 — N11.** `MobileNav.tsx:41-48` — `onPointerDown` → `onMouseDown`. `MobileNav.test.tsx`: "Escape while closed" now also asserts the trigger does not take focus; new describe (`:79`) spies on `document.addEventListener`/`removeEventListener`, driven by `fireEvent` so only the component's listeners reach the spies: nothing attached while closed and one keydown + one mousedown on open; Escape, then an outside mousedown, each remove exactly the pair their opening added; unmount while open removes both. Green against the (already correct) component, so RED by mutation: attaching while closed → 4 cases fail (the strengthened one included — the old version passed); dropping the cleanup → 2 fail; file restored (diff = the rename only).

## Verify per commit

| commit | typecheck | lint | format | vitest |
| --- | --- | --- | --- | --- |
| `3b9f885` | clean | clean | clean | 119 files / 781 tests, 66.8 s |
| `ab6f42d` | clean | clean | clean | 119 / 783, 63.9 s |
| `51d59db` | clean | clean | clean | 119 / 787, 65.1 s |
| `425056a` | clean | clean | clean | 120 / 794, 66.4 s |

## Proof session (after `425056a`)

- **Build:** `NEXT_BUILD_CPUS=2`, 4 GB — green (Turbopack cache, compiled in 717 ms), 13 routes; `git status` clean, `CLAUDE.md` untouched (no agent-rules block).
- **Server:** one `next start` on :3000.
- **Headers (curl):** `/`, `/en`, `/isci-talebi`, `/api/site-health` → all four; `/og/tr/home.png` → nosniff, Referrer-Policy, Permissions-Policy, no X-Frame-Options; `/_next/static/chunks/3b3nw8wjhpb3_.js` → `X-Content-Type-Options: nosniff` only; `/_next/image?url=%2Fbrand%2Fja-mark.png&w=96&q=75` → nosniff only.
- **Beacon (curl):** 5 KB, `Transfer-Encoding: chunked`, no `Content-Length` → **413** (re-review: 400); valid beacon chunked → 204; 5 KB with a length → 413.
- **`E2E_BASE_URL=http://localhost:3000 npm run gate` → `gate: OK`** (5 min 27 s). Playwright **232 passed / 10 skipped** (the 4 R43 ops cases; the 5 `region` cases and 1 colour case the mobile project skips by design), incl. the new chunk/image header case ×2, `region` 5/5, W155 colours. Lighthouse `lighthouserc.local.json`, 4 routes × 3 DevTools-throttled runs, every assertion passes on the median.
- **`npm run gate:launch` → exit 1 in 2.7 s, before Playwright — all three outputs printed:**
  - W20: `UNBUILT_PATHNAMES` 19 entries — `/hiring-cost-calculator`, `/partner-with-us`, `/work-permit`, `/about`, `/verify`, `/careers`, `/careers/[slug]`, `/contact`, `/available-workers`, `/success-stories`, `/blog`, `/blog/[slug]`, `/portal-login`, `/privacy`, `/terms`, `/kvkk`, `/cookie-policy`, `/newsletter/confirm`, `/newsletter/unsubscribe`.
  - Dead targets, 24 hrefs (all 404, unchanged): `/kariyer`, `/temsilci-dogrulama`, `/portal-girisi`, `/adaylar`, `/calisma-izni`, `/maliyet-hesaplayici`, `/hakkimizda`, `/basari-hikayeleri`, `/iletisim`, `/ortak-olun`, `/gizlilik`, `/kullanim-kosullari`, `/en/careers`, `/en/verify`, `/en/portal-login`, `/en/available-workers`, `/en/work-permit`, `/en/hiring-cost-calculator`, `/en/about`, `/en/success-stories`, `/en/contact`, `/en/partner-with-us`, `/en/privacy`, `/en/terms`.
  - Missing anchors, **16** (was 14): `DEFAULT_CTAS.primary (/hire-workers#request-form): tr /isci-talebi → missing id="request-form" (status 200)` and `… en /en/hire-workers …` (**new — N1**); `CTA_BY_PATHNAME['/'].primary (/#proposal)` on `/` and `/en` (200); `#calculator`, `#tracks`, `#permit-cta`, `#message`, `#report`, `#pool` × TR/EN on pages that 404.
  - D26 content readiness (first time printed during WP2b): `/`, `/en`, `/isci-talebi`, `/en/hire-workers`, `/tesekkurler?form=hire` — 200, 0 placeholders, LCP slot `h1`, all `ok`; `lighthouse-report/content-readiness.json` written.
  - Summary line: `gate: launch — FAILED: W20 dead-targets (Playwright and Lighthouse not run: npm run gate)`.
- **`npm run js-size`** (the default gate's runs):

  | route | script B (worst of 3) | headroom | LCP ms (median) | perf (median) |
  | --- | ---: | ---: | ---: | ---: |
  | `/` | 176,132 | 28,668 | 1,556 | 0.99 |
  | `/en` | 172,783 | 32,017 | 1,552 | 0.99 |
  | `/en/hire-workers` | 172,783 | 32,017 | 1,550 | 0.99 |
  | `/isci-talebi` | 176,132 | 28,668 | 1,551 | 0.99 |

  vs round 2 (177,617 / 174,133): −1,485 B TR (11 scripts × 135 B) and −1,350 B EN (10 × 135 B) — exactly the three document headers' bytes. TR is 176.1 KB, not 175.6 KB: vs round 1's 175,638 the residual +494 B is `nosniff` still on every script (11 × 33 B = 363 B, by design) plus round 2's ≈ 123 B of MobileNav listener code.
- **Pixel (N10): `npm run pixel -- --page=hire --widths=1440` → exit 2 in 4.9 s, nothing scored:**
  `pixel: pageHeight×zoom (5873) disagrees with the rendered height (900.0) by more than 2px — the zoom/height read is unreliable for this page (N2)`.
  The "independent" measurement, `html.getBoundingClientRect().height`, is exactly the capture viewport's height (900): on the real Hire Workers design page the root box does not span the content (the design's content overflows the root element), so round 2's `checkZoomedHeight` fires on a valid capture — the failure mode the re-review predicted. `pageHeight × zoom` = 7,830 × 0.75 → 5,873 is the same box W138 clipped successfully before the guard existed. Not fixed here (see Concerns).
- **Processes:** server killed (SIGTERM); `ps … | grep -E 'vitest|next|playwright|chromium|lighthouse|lhci'` → only the unrelated pre-existing ChromeRemoteDesktopHost; port 3000 free; `git status` clean.

## Deviations

1. **N3 nits fixed too** (islands count, scripts layout row) — the re-review filed them under N3; the brief names only the sentence. Docs only.
2. **N2 also forbids the message catalogues** (`src/messages/*.json`, any spelling) in the client graph, beside `formatReadMinutes` by path — the re-review's own suggested fix; check (a) (every module) is unchanged, so the server `PostCard` import stays legal.
3. **N6 fails fast after the three checks** (exit 1 before Playwright), rather than the re-review's "continue through the gate, exit at the end": it follows the brief's wording ("run … then exit non-zero if any failed") and keeps round 2's accepted fail-fast design; when all three pass, the profile continues into the full default run. The launch vitest is now two invocations (one per check) so the summary names each red one.
4. **N8:** `<aside>` (complementary) for both, not `<nav>` — neither is site navigation. The FAB's landmark carries only the visibility range; the link keeps `fixed …`, so the `a.fixed[href^="https://wa.me/"]` e2e locator and the W18 unit test stay valid.
5. **N8's gate check is the `region` rule alone, at explicit widths, desktop project only** — `best-practice` as a whole is still not in the sweep (other rules unaudited).
6. **N8 docs:** round 2's `nav.slimBar`/`nav.bottomBar` were missing from CONTENT-MODEL's chrome key list; added with the two new keys.
7. **RED by construction where the behaviour was already right or the change is test-only:** N11 by two mutations of `MobileNav.tsx` (restored); N5 by a temporary assertion; N1/N2 by extracting the current behaviour first so the RED is the gap itself.
8. **N4 pre-check** used Next's compiled `path-to-regexp` in a scratch script (not committed); the binding proof is curl + `e2e/headers.spec.ts` in the gate.
9. **N6 test** (`scripts/gate.test.ts`) spawns `bash` with a stub `npx` inside the default suite (~1.6 s); it only drives paths that stop at or before Playwright, so it never deletes or collects anything.

## Concerns

1. **The pixel harness cannot capture the Hire Workers design page at 1440 (N10 result).** Round 2's N2 guard (`checkZoomedHeight`, `scripts/pixel-compare.ts:146`) compares against `html.getBoundingClientRect().height`, which is viewport-sized on this page (900), so it exits 2 on a valid capture; the other pages and widths are unverified (one run, per the brief). Needs a ruling before the WP2b pixel pass (T2): measure the painted extent instead (e.g. the maximum `getBoundingClientRect().bottom` over the body's descendants plus `scrollY`), or compare against the captured PNG's own height, or drop the guard. Not patched here: the brief asks for the run and its result, and a harness change would need its own proof run after the last commit.
2. `gate:launch` stays RED by design until Gate A: W20 (19 routes), 24 dead hrefs, 16 anchors — T1 owns `id="proposal"`, T2 `id="request-form"` (now listed).
3. `best-practice` beyond `region` is still outside `a11y.spec.ts`.

Not touched: `produces-final.md`, the ruling log, `docs/WEBSITE-HANDOFF.md`, the review/re-review files, the briefs, `docs/superpowers/handoff-2026-09-25/**`.
