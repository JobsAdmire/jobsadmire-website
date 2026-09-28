# Report — WP2a final review, fix round 1 of 2 (implementer Opus, 2026-09-29; saved by the controller from the agent's final message — the harness blocked the agent's own file write)

Base `1f1e7f0` → HEAD `2593113`, branch `wp2/foundation`, 9 commits, not pushed. Suite 114 files / 728 tests (base 110 / 687); verify (`typecheck && lint && format && vitest --maxWorkers=1`) green before every commit.

## Commits
| # | sha | item | files / tests |
|---|---|---|---|
| 1 | `8621b05` | W145 gate method | 110 / 696 |
| 2 | `bb333a9` | W155 chrome cascade (nav variant, colourless bases) | 110 / 700 |
| 3 | `850fd30` | W155 static class-collision scan | 111 / 712 |
| 4 | `d0bfb6d` | W147 by-path imports in client modules + guard | 112 / 716 |
| 5 | `7abae5a` | W148 hint gating + `sys.*` allowlist | 113 / 726 |
| 6 | `32a4561` | W146 docs (GTM dark on the gated face) | 113 / 726 |
| 7 | `706829b` | follow-up to 3: fixture classes kept out of Tailwind's scan (`@source not '../test'`) | 114 / 728 |
| 8 | `798c4b0` | follow-up to 4: SERVER components import by path (found by proof run 1) | 114 / 728 |
| 9 | `2593113` | docs/comment corrections after the proof session | 114 / 728 |

## Item 1 — W145 (`8621b05`)
All three `lighthouserc*.json`: `collect.numberOfRuns: 3`, `collect.settings.throttlingMethod: "devtools"`, `assert.aggregationMethod: "median"`; assertion values unchanged; the preview rc keeps `skipAudits: ["is-crawlable", "robots-txt"]`; `lighthouserc.local.json` LCP `warn` → `error` (R50 retired; the local `ci` equals production). `scripts/js-size.mjs`: unrounded median, perf column = median run, method line read from the runs ("LCP and performance: devtools throttling, median of 3 (W145)"). lhci facts checked in node_modules (`@lhci/utils` assertions `median` = middle run; Lighthouse 12.6.1 `throttlingMethod: 'devtools' | 'simulate' | 'provided'`, default `simulate`). Tests: `scripts/face.test.ts:80-123`, `scripts/js-size.test.ts:62-80, 113-122` — RED 8 failed / 25 passed against the base configs, GREEN 33/33. Docs: ARCHITECTURE § Quality gate items 4–5 (the method and why: Lantern charges the whole initial waterfall to a resource-less text LCP), OPERATING § Work-package sign-off, README § Running the gate, PRD §11's R50 half-sentence.

## Item 2 — W155 chrome cascade (`bb333a9`)
`Button.tsx`: `ButtonVariant` gains `'nav'` = `bg-ink text-white hover:bg-blue-safe` (eight members). `HeaderCtas.tsx`: `buttonClassName('nav', 'md', 'whitespace-nowrap')`. `SlimBar.tsx`: `LINK_BASE` (no colour); `LINK` = base + `text-white/70 hover:text-white`; `PILL` = base + `rounded-pill px-3 text-sky hover:text-white`. `Footer.tsx`: `FLINK_BASE`; `FLINK` = base + `text-white/60 hover:text-sky`; `STORE` = base + `… text-white hover:text-sky`. Shared checker `src/test/class-collisions.ts`; `globals.css` `@source not '../test'`. Tests in Header/SlimBar/Footer/Button tests — RED 3 failed / 19 passed for exactly the three losers; GREEN after. Docs: D20 list ("the header CTA rests ink and hovers blue"), § Design system variant list, § Chrome.

## Item 3 — W155 static scan (`850fd30`, `706829b`)
`src/design/__tests__/class-collisions.test.ts` parses every non-test module under `src/design`, `src/app`, `src/forms`, `src/analytics` with the TypeScript compiler and evaluates the class strings each can produce (literals; templates resolved through the file's own consts; every branch of `?:`/`&&`/`||`/`??`; `[…].join(' ')` combinations; `buttonClassName(…)` and JSX `<Button>`/`<ContactCta>` over every variant/size). Fails on two utilities of one property group at one variant chain; property groups read from `globals.css`'s `@theme`; anything uncertain is never grouped. Compositions are evaluated because all three losers were composed across literals (a per-literal scan finds none). Diagnostic run before item 2 found exactly the three known losers (Footer.tsx:27/:50 text-white/60 vs text-white; HeaderCtas.tsx:8/:18 bg-blue-safe vs bg-ink + hover pair; SlimBar.tsx:20/:61/:63/:65 text-white/70 vs text-sky) and nothing else; the Task 3 re-review's "intended winners" are not collisions (`m-0`/`mb-*`, `focus:not-sr-only`/`focus:absolute` set different properties). No allowlist. `706829b`: fixture classes moved to `src/test/` (outside Tailwind's scan) — CSS back to 53,043 B raw.

## Item 4 — W147 (`d0bfb6d`, `798c4b0`)
By-path imports in `HeaderCtas`, `ConsentBanner`, `(site)/error.tsx`, `BottomSheet`, `PrintButton`, `FallbackPanel`, `Field`, `FormShell`, `StickyCtaBar` (type-only), `ContactCta` (reached via `StickyCtaBar`). Guard `src/design/__tests__/client-imports.test.ts`: (a) no `'use client'` module outside the dev gallery imports `@/design/primitives`, `@/design/blocks` or `@/lib/format/date` in any form; (b) no module a client module reaches through runtime imports does either. RED 9 direct offenders + `ContactCta`; GREEN after. **`798c4b0` (proof run 1 finding):** the TR routes moved only 177,782 → 177,671 B because SERVER components (`Footer`, `SiteChrome`, `(site)/not-found`, the thank-you page, and the blocks `FaqBlock`, `LogoMarquee`, `MetricStrip`, `ClosingCtaBand`) importing the barrel made every `'use client'` primitive a client reference of the route (manifest listed all seven; chunk 13,772 B gz held Dialog/Tabs/RadioChips/marquee). After moving them to by-path imports the manifest lists only `Accordion` and the chrome chunk is 11,741 B gz. Docs: ARCHITECTURE § Design system (rule, guard, the server-side leak with manifest evidence).

## Item 5 — W148 (`7abae5a`)
`src/design/chrome/hint-eligibility.ts` (no React): `HINT_KEY`, `shouldShowHint`, `hintEligibleHere(locale)`; `LanguageHint.tsx` re-exports `HINT_KEY`/`shouldShowHint`; `ClientIslands.tsx` reads eligibility after hydration (`useSyncExternalStore`, `false` server snapshot) and only then renders the dynamic `LanguageHint`. `ClientIslands.test.tsx` — RED 3 failed / 1 passed on the old code (hint requested on a Turkish browser, on an EN page, after dismissal); GREEN 4/4. `client-messages.ts`: `CLIENT_SYS = consent, languageHint, errorTitle, errorRetry, form` (built from a scan — `marquee` and `nav` are read by no client module); `pickClientMessages` keeps its signature; `client-messages.test.ts` two-way pin (every prefix read is listed, every listed namespace is read) — RED 2 failed / 6 passed against the denylist; GREEN 8/8. Client message payload: TR 7,109 → 5,628 B raw (3,009 → 2,425 gz); EN 6,749 → 5,371 B (2,740 → 2,193 gz). Docs: CONTENT-MODEL § Client subset, ARCHITECTURE entry points + § Chrome `ClientIslands`, the locale layout comment.

## Item 6 — docs (`32a4561`, `2593113`)
W146: ARCHITECTURE § Quality gate (first-party ceiling; analytics ids Production-only; production js-size informational); PRD §6/§7; ANALYTICS § How Phase A turns analytics on; DEPLOYMENT env rows (GTM, GA4, Ads id, conversion label: Production only; the Turnstile site key stays on Preview too — corrected in `2593113`). The Button `nav` comment states the D20 delta as ruled.

## Proof sessions (each: `NEXT_BUILD_CPUS=2` 4 GB build green 13 routes; one `next start`; the gate once; js-size; server killed; GTM dark; CLAUDE.md untouched)
Run 1 (`706829b`): Playwright 212 passed / 4 skipped; `gate: OK` with LCP an error; LCP median 1,554–1,562 ms, perf 0.99 every route; LCP element = the footer paragraph, LCP = FCP; TBT 0–4 ms, CLS 0, a11y/bp/SEO 1.0; `throttlingMethod = devtools` in the LHRs. Run 2 (`798c4b0`; HEAD adds docs only): Playwright 212 / 4; `gate: OK`.

| route | before (review, 24425d8): script B · LCP sim · perf | run 1 | final: script B · headroom · LCP median · perf median |
|---|---|---|---|
| / | 177,782 · 2,855 · 0.96 | 177,671 | 175,638 (−2,144) · 29,162 · 1,561 · 0.99 |
| /en | 177,782 · 2,855 · 0.96 | 174,364 | 172,331 (−5,451) · 32,469 · 1,559 · 0.99 |
| /en/hire-workers | 177,782 · 2,855 · 0.96 | 174,364 | 172,331 (−5,451) · 32,469 · 1,555 · 0.99 |
| /isci-talebi | 177,782 · 2,855 · 0.96 | 177,671 | 175,638 (−2,144) · 29,162 · 1,561 · 0.99 |

W120 proxy: 169,353 → 167,713 B. Colour probe (Playwright, 1440, reduced motion): header CTA ink rgb(22,32,46) at rest / blue-safe rgb(16,115,168) on hover (before: ink/ink); slim-bar pills sky rgb(127,208,245) (before: white at 70 %); footer store badges white (before: white at 60 %).

## Deviations
1. `marquee` (and `nav`) not in `CLIENT_SYS` — no client module reads them; the two-way pin would fail on an unread entry. 2. The scan evaluates compositions and also walks `src/forms`/`src/analytics`. 3. The W147 guard adds the transitive check (b), which changed `ContactCta` and `StickyCtaBar`'s type-only import. 4. `798c4b0`: server components import by path — beyond W147's text because run 1 proved the leak; the guard was NOT widened to server modules (needs a ruling). 5. js-size perf column: lowest run → median. 6. `globals.css` `@source not '../test'`. 7. The proof session ran twice (the allowed rerun, for W147's missing saving); `2593113` is docs/comment only. 8. "Before" figures come from the review (no base rebuild); "before" colours from clones carrying the old tokens. 9. PRD §11: only the R50 half-sentence touched. 10. The report file could not be written by the agent (saved by the controller).

## Concerns
- Needs a ruling: widen W147 to all non-gallery modules, server included, with guard (a) applied to every non-gallery module (→ W156). — W148's ruling text lists `marquee` (amend). — DevTools figures depend on the runner's CPU (accepted, W145); run-to-run LCP spread ≈ 35 ms. — The binding preview gate run (W145 proof) is outstanding (needs the push). — LCP on every current route is the footer paragraph (placeholder pages): T1 must name its LCP element.

## Produces additions
`ButtonVariant` eight members (+ `nav`); `src/design/chrome/hint-eligibility.ts` (`HINT_KEY`, `shouldShowHint`, `hintEligibleHere`); `client-messages.ts` `CLIENT_SYS` (allowlist, same `pickClientMessages` signature, `SERVER_ONLY_SYS` kept); test helper `src/test/class-collisions.ts`; guards `class-collisions.test.ts` (W155), `client-imports.test.ts` (W147), the `client-messages.test.ts` scan (W148), `ClientIslands.test.tsx`; gate: DevTools throttling, 3 runs, median in all three rcs, local = production. WP2b rules: no class string sets one property twice at one variant; import primitives and blocks by path; a new client `sys` namespace goes into `CLIENT_SYS`; LCP is asserted locally too.
