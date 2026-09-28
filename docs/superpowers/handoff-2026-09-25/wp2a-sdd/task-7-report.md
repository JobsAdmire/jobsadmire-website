# Task 7 report — Gate tooling: one route list, launch profile, JS ceiling, page-contract specs, pixel harness (T0e)

**Status: DONE.** 7 commits on `wp2/foundation` (BASE `9e48725` → HEAD `9af7983`), `VERIFY_LOW` (`typecheck && lint && format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`) green before every commit. Final suite: **103 files / 582 tests** (BASE 99/551: +4 files, +31 tests). `git diff --stat 9e48725..HEAD` → **34 files changed, 1468 insertions(+), 79 deletions(-)**. One `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` succeeded (Next's own Experiments log printed `cpus: 2`, confirming Item 0 actually takes effect); one `npm run start` server on :3000 served the whole consolidated proof session below, then was killed. Nothing pushed, no stash used, no `main` touched, no BASE commit rewritten, working tree clean at the end (`git status` — nothing to commit, no untracked files past `.gitignore`).

## Commits

| SHA       | Subject                                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `2de2993` | chore(build): local build worker cap via NEXT_BUILD_CPUS (item 0, memory rule)                                                            |
| `323bfbc` | feat(gate): one route list — GATE_ROUTE_TABLE, gate-routes.mjs, gate.sh reads it (W21/W91/W93)                                            |
| `6a78b4c` | chore(gate): script ceiling 204,800 B on every gate route + js-size ledger table (W13 amended/W94)                                        |
| `550266d` | test(e2e): page-contract assertions — page-h1, localized hrefs, canonical/hreflang per route, sitemap 200-sweep, face-aware robots (W20/W21/W4/W91/W104) |
| `bb043ae` | feat(gate): --profile=launch — UNBUILT_PATHNAMES-empty check + D26/W55 placeholder counter (W20)                                          |
| `73abf7a` | feat(gate): D27 pixel harness — design .dc.html vs built route at 390/900/1440 with pixelmatch (W91)                                      |
| `9af7983` | docs(gate): quality gate as built for WP2 — one route list, 200 KB ceiling, launch profile, page contract, pixel harness (…)              |

Item 0 (controller addition) is its own commit, first, as instructed. The brief's Cycles 1–6 map one-to-one onto the remaining 6 commits; the controller additions (W91 preview reachability, W93 careers detail rows, W94 `--routes`, W104 face-aware robots) are folded into the cycle whose file they touch rather than given separate commits, since none of them is large enough to justify breaking a cycle's file set in two.

## What was implemented

- **Item 0 (`2de2993`).** `next.config.ts`'s `experimental` block gains `cpus: process.env.NEXT_BUILD_CPUS ? Number(...) : undefined`, merged into the existing object (Task 2's `serverActions.bodySizeLimit` untouched). `docs/ARCHITECTURE.md` § Run locally gains the one sentence; `.env.example` gains the commented `NEXT_BUILD_CPUS=2` line. Verified for real in the final build: the Next.js build log's `Experiments` section prints `cpus: 2`.
- **Cycle 1 (`323bfbc`), W21/W91/W93.** `e2e/routes.ts` replaced with `GATE_ROUTE_TABLE`/`GATE_ROUTES`/`INDEXABLE_GATE_ROUTES`, landed verbatim from the brief. `scripts/gate-routes.mjs` (new) prints the route list for shell consumers; adapted to wrap its CLI body in `main()` behind an `import.meta.url` guard (the same idiom `js-size.mjs` uses) instead of the brief's top-level-script shape, so `careersDetailRoutes` (W93) is importable by its unit test without running the CLI. `scripts/gate.sh` replaces the whole file; landed in its Cycle-6 end state directly (see Deviations) — W21 route consumption, W91 bypass-header pass-through to every `lhci collect`, W91 preview/local/production `lighthouserc.*` selection, the W13 `js-size.mjs` print, and the full `--profile=launch` body. `playwright.config.ts` gains `extraHTTPHeaders` sending `x-vercel-protection-bypass` (W91). `lighthouserc.preview.json` (new) = `lighthouserc.json` + `collect.settings.skipAudits: ["is-crawlable"]` (W91 — see Deviations for why `skipAudits` rather than dropping the `categories:seo` assertion). `.env.example` and `docs/DEPLOYMENT.md` § Environment variables document `VERCEL_AUTOMATION_BYPASS_SECRET` by name only.
- **Cycle 2 (`6a78b4c`), W13 amended/W94.** `lighthouserc.json`, `lighthouserc.local.json` and `lighthouserc.preview.json` all assert `resource-summary:script:size <= 204800`; `_comment` fields restate the W13-amended reasoning (landed verbatim from the brief for the first two; `lighthouserc.local.json` gets the brief's exact appended sentence). `scripts/js-size.mjs` (new) landed verbatim from the brief, plus the W94 addition: `parseRoutesArg` (pure, tested) and a `collectExtra` helper that runs `lhci collect` for `--routes=<path,...>` into a separate `.lighthouseci-extra` directory (LHCI's `collect` has no `--outputDir` of its own, unlike `upload`, so each route is collected into the default `.lighthouseci/` and only the files it just produced are moved out — a concurrent or prior gate run's own reports are never read or wiped). `package.json` gains `js-size` (additive, W42). Docs: `docs/PRD.md` §6/§11, `docs/OPERATING.md` § Work-package sign-off, `CLAUDE.md` § Conventions all move off 180 KB/184,320 B to 200 KB/204,800 B.
- **Cycle 3 (`550266d`), W20/W21/W4/W91/W104.** `e2e/routing.spec.ts` and `e2e/seo.spec.ts` replaced with the brief's versions (page-contract loop, canonical/hreflang loop, sitemap 200-sweep, Task 4's two OG tests merged/renamed). The three pages (`(site)/page.tsx`, `(site)/hire-workers/page.tsx`, `(minimal)/thank-you/page.tsx`) have their h1 tagged `data-testid="page-h1" data-lcp-slot="h1"` (the first two replacing `home-h1`/`hire-h1`; confirmed no other file referenced the old test ids). New `e2e/helpers/face.ts` exports `expectedRobots(baseUrl, env = process.env)`: a `*.vercel.app` host is always the preview face; otherwise `NEXT_PUBLIC_SITE_FACE` decides, defaulting to `'production'` (mirrors `robots.ts`'s own `VERCEL_ENV` default) so the existing local-run expectation is unchanged. `e2e/seo.spec.ts`'s robots test branches on it.
- **Cycle 4 (`bb043ae`), W20.** `scripts/placeholder-count.ts` + test landed verbatim from the brief. `scripts/launch/unbuilt-routes.launch-check.ts` and `vitest.launch.config.mts` landed verbatim (the `'./vitest.config.mjs'` import spelling for a `.mts` file is deliberate, per W50 — confirmed it resolves and type-checks). `package.json` gains `gate:launch` (added here, not in Cycle 1, since its dependencies — the launch-check file and the launch vitest config — did not exist until this commit; running `--profile=launch` before this point would have failed with a missing-config error even though `gate.sh`'s shell code already supported the flag).
- **Cycle 5 (`73abf7a`), D27/W91.** `scripts/pixel-compare.ts` + test landed verbatim from the brief, plus the W91 addition: the Playwright `browser.newContext()` call for the built-route capture also sends `extraHTTPHeaders` with the bypass header (harmless against the local design server or a local built server). Installed exact pinned versions: `pixelmatch@^5.3.0`, `pngjs@^7.0.0`, `@types/pixelmatch@^5.2.6`, `@types/pngjs@^6.0.5`. `package.json` gains `pixel` (additive). `.gitignore` gains `.pixel/` and, additively, `.lighthouseci-extra/` (W94's collect directory — same treatment as `.lighthouseci/`). `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` (new) landed verbatim from the brief, plus one sentence noting the W91 header on `--base`.
- **Cycle 6 (`9af7983`).** `docs/ARCHITECTURE.md` § Quality gate rewritten from the heading through item 6 (the brief's items 1–6, the page markup contract list and the pixel harness paragraph), with W91/W93/W94/W104 sentences woven into items 1, 2, 4 and 5; the D20 paragraph and everything after it (confirmed via `grep`) is byte-for-byte untouched. `README.md` § Running the gate gains the "Three more gate commands" paragraph verbatim. `CLAUDE.md` gains the exact doc-map row the brief quotes, directly after the WP1-rulings row.

## TDD evidence per cycle

`VERIFY_LOW` = `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`.

0. **Item 0.** No test (brief: "a `tsc` pass suffices"). `npx tsc --noEmit` clean before and after. VERIFY_LOW: 99 files / 551 tests (unchanged from BASE — no test file touched).
1. **Cycle 1.** RED: `scripts/gate-routes.test.ts` (brief's 6 cases + 4 new `careersDetailRoutes` cases) failed at import — `Cannot find module './gate-routes.mjs'` (and `GATE_ROUTE_TABLE`/`INDEXABLE_GATE_ROUTES` not yet exported by `e2e/routes.ts`). GREEN: 10/10 after `e2e/routes.ts` + `scripts/gate-routes.mjs` landed. `bash -n scripts/gate.sh` confirmed shell syntax. VERIFY_LOW: 100 files / 561 tests, typecheck/lint/format clean.
2. **Cycle 2.** RED: `scripts/js-size.test.ts` (brief's 5 cases + 3 new `parseRoutesArg` cases, and the ceiling-pin case widened to cover `lighthouserc.preview.json` too) failed — `Failed to load url ./js-size.mjs`. GREEN: 8/8 after `scripts/js-size.mjs` landed and all three lighthouserc files' ceilings moved to 204800. VERIFY_LOW: 101 files / 569 tests, typecheck/lint/format clean.
3. **Cycle 3.** No new Vitest file (these are Playwright specs + a plain e2e helper — see Deviations for why `face.ts` has no Vitest coverage). RED reasoning: before the page edits, `page contract on /` would fail `h1[data-testid="page-h1"]` count 0 (the spike carried `home-h1`); `page contract on /isci-talebi` likewise (`hire-h1`). Verified the logic directly with a throwaway `npx tsx -e` invocation of `expectedRobots` across five scenarios (vercel.app, vercel.app+explicit-production, localhost bare, localhost+explicit-preview, production host, staging custom domain) — all five matched the intended behaviour (recorded in the commit message). `npm run typecheck`/`lint`/`format` clean; the real Playwright GREEN is the consolidated proof session (below). VERIFY_LOW (vitest portion unaffected): 101 files / 569 tests.
4. **Cycle 4.** RED: `scripts/placeholder-count.test.ts` (brief's 7 cases, verbatim) failed — `Failed to load url ./placeholder-count`. GREEN: 7/7. Separately ran `npx vitest run --config vitest.launch.config.mts` and confirmed it fails exactly as the brief predicts — `UNBUILT_PATHNAMES` has the real 19 keys, not `[]` — and confirmed `npm run test`'s default include never matches `scripts/launch/**`. VERIFY_LOW: 102 files / 576 tests, typecheck/lint/format clean.
5. **Cycle 5.** RED: `scripts/pixel-compare.test.ts` (brief's 6 cases, verbatim) failed — `pngjs`/`pixelmatch` not yet installed, then `Failed to load url ./pixel-compare` once installed. GREEN: 6/6 after `scripts/pixel-compare.ts` landed. VERIFY_LOW: 103 files / 582 tests, typecheck/lint/format clean.
6. **Cycle 6.** No new code. RED: `grep -rnE "184[ ,]?320|180 KB gzipped|180 KB script budget|180 KB, not" CLAUDE.md README.md docs/*.md` printed the two `docs/ARCHITECTURE.md` lines (item 4's ceiling figure, the JS-budget paragraph heading) — PRD/OPERATING/CLAUDE.md were already clean from Cycle 2. GREEN: the same grep prints nothing after the rewrite. VERIFY_LOW: 103 files / 582 tests (unchanged — docs-only cycle), typecheck/lint/format clean.

## Gate proof

One consolidated session (memory rule: one build, one `npm run start` server on :3000, reused for every proof step, both gate profiles run at most once each):

```
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build     # succeeded, cpus: 2
npm run start -- -p 3000 &                                                 # backgrounded, waited for ready
curl :3000/ → 200 ; curl :3000/en → 200                                    # W126
REVALIDATE_SECRET=task7-proof-secret E2E_BASE_URL=http://localhost:3000 npm run gate
E2E_BASE_URL=http://localhost:3000 npx tsx scripts/placeholder-count.ts
npm run pixel -- --page=hire --base=http://localhost:3000
REVALIDATE_SECRET=task7-proof-secret E2E_BASE_URL=http://localhost:3000 npm run gate:launch
kill <server pid>
```

**Default profile (`npm run gate`) — `gate: OK`, exit 0.**

- Playwright, both projects (mobile + desktop), no filter: **216 passed** (27.0s per project) — every spec, including the new `routing.spec.ts` page-contract loop (4 routes × 2 projects) and `seo.spec.ts`'s canonical/hreflang loop, sitemap 200-sweep and the face-aware robots test (`"robots.txt matches this run's face and points at the sitemap in production"`, which resolved `production` against `localhost` and asserted the real rules — Sitemap/Disallow-tesekkurler/no-`[slug]` — exactly as before).
- `gate-routes: detail rows skipped (door not configured)` printed to stderr (W93 — `OPS_API_URL` unset locally, confirmed no-op, confirmed the message never reached stdout/the Lighthouse loop).
- Lighthouse: asserted with `lighthouserc.local.json` (localhost detected correctly); all four indexable routes passed every error-level assertion; LCP was the expected **warning** (~2854–2857 ms, matching R50's documented Lantern-over-localhost behaviour, not the real ~1.5 s figure).
- **js-size table (W13 amended, W120 method — local `<script src>` proxy is what a live server actually serves; the binding figure remains Lighthouse `resource-summary:script:size` on a Vercel preview, not measured in this local session):**

  | route | script B (worst of 2 runs) | headroom to 204,800 | LCP ms (median) | perf (min) |
  | --- | ---: | ---: | ---: | ---: |
  | / | 177,782 | 27,018 | 2,855 | 0.96 |
  | /en | 177,782 | 27,018 | 2,856 | 0.96 |
  | /en/hire-workers | 177,782 | 27,018 | 2,855 | 0.96 |
  | /isci-talebi | 177,782 | 27,018 | 2,855 | 0.96 |

  Every route is well under both the 204,800 B ceiling and the 194,560 B lazy-loading line (no page needs a `next/dynamic` pass). No preview URL exists for this branch yet (owner has not linked `jobsadmire-web-v2`, per `docs/PRD.md` §11 — pre-existing, not a Task 7 gap), so the W91 preview path (`lighthouserc.preview.json`, the bypass header) is implemented and unit-adjacent-tested but not exercised against a real protected deployment in this session; the localhost/`lighthouserc.local.json` path it sits beside was exercised and is unaffected.

- **Standalone `placeholder-count.ts` (D26, launch profile's second half):** exit 0. `/`, `/en`, `/isci-talebi`, `/en/hire-workers`, `/tesekkurler?form=hire` all → status 200, 0 placeholders, LCP slot `h1`, verdict `ok` — matching the brief's exact predicted table.
- **Pixel harness smoke (D27, `--page=hire`):** exit 0. `hire tr @390 → 82.43 %`, `@900 → 84.76 %`, `@1440 → 91.75 %` (design 9988/12638/7830 px vs built 971/951/900 px — the built side is still Task 3's spike page, so a low match and a large height gap are expected; the harness mechanics — serving the design over a throwaway static server, capturing both sides, padding, diffing, writing `.pixel/hire-tr-*.png` + `-design`/`-built` siblings + `report.json` — are what this run verifies). Needed and had network access (`unpkg.com` reachable, confirmed before the run).

**Launch profile (`npm run gate:launch`) — exit 1, exactly as designed.** Re-ran the full default-profile gate (216 Playwright passed again, Lighthouse green again on all four routes, identical js-size table), then `gate: launch — every pathnames route is built (W20)`: **failed** — `UNBUILT_PATHNAMES` has the real 19 keys (`/hiring-cost-calculator`, `/partner-with-us`, …), not `[]`, which is the expected state until the last WP2b page lands. `set -euo pipefail` stopped the script there, so `placeholder-count.ts` never ran a second time inside this invocation — already proven standalone above.

Cleanup: server killed, `port 3000` confirmed free, `ps -Ao pid,rss,command | grep -E 'vitest|next|playwright|chromium|lighthouse|lhci' | grep -v grep` showed only an unrelated pre-existing Chrome Remote Desktop helper process (not mine). `git status` clean — no `.pixel/`, `.lighthouseci/`, `.lighthouseci-extra/` or `lighthouse-report/` artefact leaked past `.gitignore`.

## Build (W126)

`NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` exited 0: "✓ Compiled successfully", the Experiments log printed `cpus: 2` (proving Item 0 actually takes effect), TypeScript finished, 13/13 pages generated. `npm run start -- -p 3000` served `/` → 200 and `/en` → 200 (curled directly, see Gate proof). Server was killed at the end of the same session; confirmed no process of mine left running.

## Files changed

`git diff --stat 9e48725..HEAD` → **34 files changed, 1468 insertions(+), 79 deletions(-)**.

- **Every file in the brief's Files list** (Create: `scripts/gate-routes.mjs`, `scripts/gate-routes.test.ts`, `scripts/js-size.mjs`, `scripts/js-size.test.ts`, `scripts/placeholder-count.ts`, `scripts/placeholder-count.test.ts`, `scripts/launch/unbuilt-routes.launch-check.ts`, `vitest.launch.config.mts`, `scripts/pixel-compare.ts`, `scripts/pixel-compare.test.ts`, `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`; Modify: `e2e/routes.ts`, `scripts/gate.sh`, `lighthouserc.json`, `lighthouserc.local.json`, `e2e/routing.spec.ts`, `e2e/seo.spec.ts`, the three page files, `package.json`, `.gitignore`, `docs/ARCHITECTURE.md`, `docs/PRD.md`, `docs/OPERATING.md`, `README.md`, `CLAUDE.md`) was created/modified exactly as specified.
- **Extra files, all accounted for by `task-7-additions.md`'s W91/W93/W94/W104:** `next.config.ts` + its `.env.example`/`docs/ARCHITECTURE.md` sentence (item 0); `.env.example` also gains `VERCEL_AUTOMATION_BYPASS_SECRET` (W91); `docs/DEPLOYMENT.md` (W91 secret row); `playwright.config.ts` (W91 header); `lighthouserc.preview.json` (new, W91); `e2e/helpers/face.ts` (new, W104/W91); `package-lock.json` (the four `npm i -D` installs, unavoidable, `git add`-ed as the brief's own Cycle 5 commit does).
- Nothing from `docs/superpowers/handoff-2026-09-25/**`, `docs/superpowers/plans/2026-09-20-wp2-rulings.md`, `docs/WEBSITE-HANDOFF.md`, or `produces-final.md` was touched — confirmed by an empty `git diff --stat 9e48725..HEAD -- docs/superpowers/handoff-2026-09-25 docs/superpowers/plans/2026-09-20-wp2-rulings.md docs/WEBSITE-HANDOFF.md`.

## Deviations

1. **`scripts/gate.sh` landed in its Cycle-6 end state within the Cycle 1 commit.** The brief paces `gate.sh` across three commits (Cycle 1: route list + a `--profile=launch` placeholder that errors; Cycle 2: append the `js-size.mjs` print; Cycle 4: replace the placeholder with the real launch body). `gate.sh` has no unit tests of its own (it's a shell script only exercised by the manual proof steps), and the brief's own RED/GREEN descriptions for the cycles that touch it never mention `gate.sh` — the churn of writing the same file three times bought no additional TDD evidence. Consolidated to the final shape in Cycle 1, with the W91 additions (bypass header, preview/local/production `lighthouserc` selection) folded in at the same time since they live in the same file. `package.json`'s `gate:launch` alias was still added only in Cycle 4, once its dependent files existed, so running the command before Cycle 4 landed would still have failed correctly.
2. **`lighthouserc.preview.json` interpreted as `skipAudits: ["is-crawlable"]`, not a dropped `categories:seo` assertion.** `task-7-additions.md` says "minus the is-crawlable/SEO-crawlable assertion"; the current `lighthouserc.json` has no standalone `is-crawlable` assertion line (only category-level assertions), so "minus that assertion" most literally means removing the `is-crawlable` **audit** from the Lighthouse run via `collect.settings.skipAudits`, which is what a later WP2b planning document (`docs/superpowers/handoff-2026-09-25/wp2-planning/wp2b/task-15.md`, read for context only, never edited) independently describes as this task's own output: `lighthouserc.preview.json (= lighthouserc.json + skipAudits: ['is-crawlable'])`. This keeps every other SEO check asserted at 1.0 on a preview run, which is strictly better gate hygiene than dropping the whole `categories:seo` assertion.
3. **W93's `${OPS_API_URL}/api/careers/openings` response shape is an educated guess, not a read contract.** No file in this repo (at Task 7's point in the timeline — the careers pages are WP2b, not yet built) documents that endpoint's response envelope. A later planning document (`docs/superpowers/handoff-2026-09-25/wp2-planning/page-join-our-team-careers-index-detail.md`, read-only reference) cites the real controller (`careers-public.controller.ts:59`) and confirms the list is already filtered to OPEN + publicly-listed + has a slug, ordered `createdAt desc` — so "first item" is a correct and sufficient selection — but does not pin the JSON envelope. `gate-routes.mjs`'s `firstOpenCareersSlug` therefore accepts a raw array, `{ data: [...] }` or `{ data: { items: [...] } }`, reading `.slug` off the first element of whichever it finds, and returns `null` (no rows, "detail rows skipped") on anything else. If the real envelope differs, the practical effect is only that the detail rows are never added — the same as "door not configured" — never a crash or a bad route.
4. **`e2e/helpers/face.ts` has no Vitest unit test.** `e2e/**` is not in `vitest.config.mts`'s `include` glob (only `src/**`, `contract/**`, `scripts/**`, `redirects/**`), and Playwright's default `testMatch` would pick up any `*.test.ts` under `e2e/` too, where a file built around `vitest`'s `describe`/`it` (imported as plain functions, not Playwright's own test API) risks Playwright reporting it as a zero-test file or erroring — extending `vitest.config.mts`'s `include` array was judged out of scope for one helper. Verified instead with a throwaway `npx tsx -e` invocation across five scenarios (see TDD evidence, Cycle 3) and by the real Playwright robots test in the consolidated proof session.
5. **`gate-routes.test.ts`'s CLI-spawn tests explicitly strip `OPS_API_URL`** (`env: { ...process.env, OPS_API_URL: '' }`) so the W93 addition can never make the pre-existing route-list assertions depend on network reachability or on whatever the invoking shell happens to export.
6. **`.gitignore` additionally covers `.lighthouseci-extra/`** (W94's `--routes` collect directory) — not explicitly requested by the brief's `.gitignore` instruction (which only names `.pixel/`), but the same reasoning applies (a local, regenerable test artefact) and the existing `.lighthouseci/` line is the direct precedent.

## Produces additions

- `e2e/helpers/face.ts` — `export type SiteFace = 'preview' | 'production'`; `export function expectedRobots(baseUrl: string, env?: NodeJS.ProcessEnv): SiteFace` (W91/W104).
- `scripts/gate-routes.mjs` — `export async function careersDetailRoutes(env？, f？): Promise<string[]>` (W93), additive to the frozen `gate-routes.mjs` CLI contract (stdout shape unchanged; the CLI body moved into a guarded `main()`, see Deviations #1).
- `scripts/js-size.mjs` — `export function parseRoutesArg(argv: string[]): string[] | null` (W94), additive; `node scripts/js-size.mjs --routes=<a,b>` / `npm run js-size -- --routes=<a,b>`.
- `lighthouserc.preview.json` (new file, W91) — same assertion shape as `lighthouserc.json`, `collect.settings.skipAudits: ["is-crawlable"]`.
- `package.json` — `VERCEL_AUTOMATION_BYPASS_SECRET` documented in `.env.example`/`docs/DEPLOYMENT.md` (W91); `.gitignore` additionally covers `.lighthouseci-extra/`.

## Self-review

- Every cycle's brief-given test code (`gate-routes.test.ts`'s 6 base cases, `js-size.test.ts`'s 5, `placeholder-count.test.ts`'s 7, `pixel-compare.test.ts`'s 6) landed byte-for-byte, extended additively for the controller additions, never edited to make a test pass.
- The frozen Produces block (`GateRoute`, `GATE_ROUTE_TABLE`, `GATE_ROUTES`, `INDEXABLE_GATE_ROUTES`, `SCRIPT_CEILING`, `LAZY_LINE`, `summarizeLhrs`, `formatJsSizeTable`, `scanPlaceholders`, `evaluateScan`, `formatReadinessTable`, `PIXEL_WIDTHS`, `PIXEL_PAGES`, `resolvePixelRoute`, `comparePngs`) is unchanged in name and signature; every addition (`careersDetailRoutes`, `parseRoutesArg`, `expectedRobots`) is new, additive, and listed under Produces additions.
- `R56`/D23 held: no new file under `scripts/` or `e2e/` was added to `src/**`, and nothing under `src/**` imports `design-package/**` or `src/content/local/*` (`pixel-compare.ts` and `placeholder-count.ts` — the only two consumers of either — are both under `scripts/`, the sanctioned bypass).
- `contract/website-bundle.v1.ts` was never opened for editing.
- Package strings: no new copy was added anywhere in this task (no page copy changed), so the `sys.*` rule has nothing to check.
- Every commit's message cites its rulings and ends with the required `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` trailer.
- Git safety: no `push`, no `stash`, no `checkout main`, no `reset --hard`, no rewrite of any commit at or before BASE `9e48725` — verified by `git log --oneline 9e48725..HEAD` showing exactly the 7 commits listed above, in order, and `git status` clean.
- Read the four `.dc.html` design files' names directly off disk (`ls design-package/design/*.dc.html`) before writing `PIXEL_PAGES`, per the brief's instruction — all four (`JobsAdmire Homepage v4.dc.html`, `Hire Workers.dc.html`, `Hiring Cost Calculator.dc.html`, `Blog Article.dc.html`) matched the brief's literal filenames exactly, no adjustment needed.
- Did not read `ACCESS.md`, `.secrets/`, or any backup branch; the `VERCEL_AUTOMATION_BYPASS_SECRET` value was never seen, generated, or guessed — only its name is referenced, and the proof session ran with it unset (a plain localhost run never needs it).

## Concerns

- **No Vercel preview exists yet for this branch** (owner has not linked `jobsadmire-web-v2` — a pre-existing, documented gap in `docs/PRD.md` §11, not something Task 7 caused or can close). This means the W91 preview path — `lighthouserc.preview.json`'s `skipAudits`, the bypass-header plumbing in `playwright.config.ts`/`gate.sh`/`pixel-compare.ts`, and the `*.vercel.app` branch of `e2e/helpers/face.ts` — is implemented and reasoned through carefully but has never been exercised against a real protected deployment. The next task (or the owner, once the preview exists) should run `E2E_BASE_URL=https://<preview>.vercel.app VERCEL_AUTOMATION_BYPASS_SECRET=<from ACCESS.md> npm run gate` once as the first real proof of that path.
- **W93's `/api/careers/openings` response envelope is inferred, not confirmed against a live Operations instance** (see Deviations #3) — the parsing is deliberately permissive and fails safe (no rows, not a crash) if the guess is wrong, but a future task building the careers pages should double-check `gate-routes.mjs`'s `firstOpenCareersSlug` against the real endpoint the first time `OPS_API_URL` is actually configured somewhere this script runs.
- **`e2e/helpers/face.ts` has no automated regression test** (see Deviations #4) — only a one-off manual verification and the real Playwright robots test (which only exercises the `'production'` branch locally, since this session never had a `*.vercel.app` URL or a `NEXT_PUBLIC_SITE_FACE` override to test the other branch against a live server). Low risk (the function is ~6 lines and was traced by hand for every input class) but worth a second look if it starts mattering more (e.g., when WP2b's T15 builds on it).
- `docs/ARCHITECTURE.md` § Quality gate's rewrite is long (heading through item 6 plus two more paragraphs); I re-read it in full after editing to confirm the D20 paragraph and everything after it survived untouched, and confirmed via `grep` — but a second reviewer pass on the exact wording woven in for W91/W93/W94/W104 (items 1, 2, 4, 5) would be worthwhile given its length.

## Fix round 1

**Status: DONE_WITH_CONCERNS.** BASE `f41ad5e` → HEAD **`e4ee8ed`**, 10 commits (one per numbered item, 9–11 grouped, plus one found in the proof session). Final suite **105 files / 611 tests** (BASE 103/582). The low-memory verify (`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`) exited 0 before every commit; typecheck, lint and format were clean each time. Nothing pushed; no stash; `main` untouched; no BASE commit rewritten; the tree is clean at the end. Nothing under `docs/superpowers/handoff-2026-09-25/`, the ruling log, `docs/WEBSITE-HANDOFF.md`, `produces-final.md`, `src/`, `contract/` or `design-package/` changed. The only secret-shaped value used, a dummy `dummy-not-a-real-secret`, appears in no commit.

### Commits

| SHA | Item | Verify (files / tests) |
| --- | --- | --- |
| `2c59c20` | 3 — W135 face helper, strict preview robots, `scripts/face.test.ts` | 104 / 589 |
| `ab9707c` | 2 — W137 `protectionBypassHeaders`; Playwright, placeholder counter, `js-size --routes`, pixel harness (built origin only) | 105 / 598 |
| `f4b550c` | 1 — C1: config chosen before collect; `--config` on collect and assert; JSON.stringify header; preview-only warning (M8) | 105 / 598 |
| `ad2b285` | 4 — W138: 1440 clip, 2xx-or-exit-2, skip unbuilt/no-body | 105 / 602 |
| `4cbb429` | 5 — M2: `--routes <list>`, exit 2 on unknown args | 105 / 606 |
| `9dfba9b` | 6 — M3: `lhr-*.html` moved too; comments; README | 105 / 607 |
| `7346e1c` | 7 — M4: stderr spawn and fake-timer abort cases | 105 / 609 |
| `c8d1684` | 8 — M5: `NEXT_BUILD_CPUS` guard | 105 / 609 |
| `c18b6b2` | 9–11 — M7 docs, W136 method line and ARCHITECTURE statement, M8 confirmed | 105 / 610 |
| `e4ee8ed` | (proof-session find) `lhci` gets the header as `--settings.extraHeaders` — `--extra-headers` never reached Lighthouse | 105 / 611 |

### Per item

1. **C1 — W137 `gate.sh` config on collect (`f4b550c`; flag corrected in `e4ee8ed`).**
   - **Change:** `scripts/gate.sh:36-54` chooses the config and builds the header above Playwright. `LHCI_CONFIG` (`:44`) comes from `lighthouseConfigFor` in `e2e/helpers/face.ts`, through a tiny `node -e` with `tsx/cjs/api`. `LH_EXTRA_HEADERS` (`:50`) is `JSON.stringify(protectionBypassHeaders())`, printed only when non-empty. The unset-secret warning (`:52-54`) prints only when the preview config is selected (M8). The collect at `:78-80` passes `--config="$LHCI_CONFIG"` and `${LH_EXTRA_HEADERS:+--settings.extraHeaders="$LH_EXTRA_HEADERS"}`; assert at `:88` uses the same file.
   - **Comments and docs:** the gate.sh comments at `:9-11`, `:36-49`, `:73-76` and `:85-86` now say what the code does. So do the `_comment`s of `lighthouserc.preview.json` and `lighthouserc.local.json` (the latter also said "for assert only"), and ARCHITECTURE § Quality gate item 5.
   - **Evidence:** gate.sh has no unit test of its own.
     - The config choice is pinned by `scripts/face.test.ts` (`lighthouseConfigFor`, 3 cases). The flag spelling is pinned in `js-size.test.ts`: `gate.sh`'s code must contain `--settings.extraHeaders=` and never `--extra-headers`.
     - Extracted-lines check (`gate.sh`'s selection block run verbatim, `npx` stubbed):

       | Target | Config | Header | Warning |
       | --- | --- | --- | --- |
       | localhost | local | none | none |
       | `*.vercel.app` | preview | none | yes |
       | staging + secret | preview | JSON | none |
       | `127.0.0.1` + `NEXT_PUBLIC_SITE_FACE=preview` | preview | none | yes |
       | `www.jobsadmire.com` | `lighthouserc.json` | none | none |

     - The stand-in RED→GREEN is under Proof session.
2. **I1 + I2 + ⚠️4 — W137 header helper (`ab9707c`).**
   - **`e2e/helpers/bypass.ts:20-38`:** `BYPASS_HEADER`; `protectionBypassHeaders(env)` returns `{}` for a blank or unset secret; `bypassWarning(baseUrl, env)` warns only for a preview face with no secret. Chosen over `scripts/lib/bypass.mjs` because Playwright's loader, tsx and Vitest all import TS natively and the `.mjs` consumer uses `tsx/cjs/api`.
   - **Consumers:**
     - `playwright.config.ts:14-17` sets `extraHTTPHeaders: protectionBypassHeaders()` (comment fixed).
     - `scripts/placeholder-count.ts:99` spreads the helper into the fetch headers; `:115-116` prints the warning.
     - `scripts/js-size.mjs` `collectArgs` (`:177`) passes `--config` from `lighthouseConfigFor` and the header only when non-empty; `gateHelpers()` loads the TS helpers through `tsx/cjs/api`.
     - `scripts/pixel-compare.ts` uses two contexts per width. `captureContextOptions()` (`:182`) carries no extra header; it is the design page's context (`:326`). `builtOriginRoute()` (`:200`) attaches the header on the built page's own context via `context.route(\`${origin}/**\`)`, only when the secret is non-blank (`:359-360`).
   - **Wrong claims corrected:** `pixel-compare.ts` header comment, `playwright.config.ts`, the pixel-harness plan (`:7-11`), the DEPLOYMENT row (now also stating W137's accepted third-party exposure), and ARCHITECTURE item 1 and the pixel paragraph.
   - **Tests:**
     - `scripts/bypass.test.ts`, 4 cases — RED `Cannot find module '../e2e/helpers/bypass'` → GREEN 4/4.
     - `collectArgs`, 2 cases — RED `collectArgs is not a function` → GREEN.
     - Pixel header scoping, 3 cases (the capture context has no `extraHTTPHeaders` even with the secret stubbed; `null` when blank; the handler merges the header into `route.continue`) — RED `captureContextOptions is not a function` → GREEN 9/9.
   - **Proof:** under Proof session (font probe, network-level counts).
3. **⚠️1 + ⚠️2 + I3 + M1 — W135 face helper (`2c59c20`).**
   - **`e2e/helpers/face.ts`:** `siteFace` (`:31`) — preview for `*.vercel.app` or `staging.jobsadmire.com`, or `NEXT_PUBLIC_SITE_FACE` set and not `production`; unset or blank means production. `expectedRobots` (`:39`) delegates to it. `lighthouseConfigFor` (`:55`) is the three-way choice. The recipe comment now says `VERCEL_ENV=preview npm run build` (`:17-19`). A comment names the production `*.vercel.app` alias caveat (the parked item).
   - **`e2e/seo.spec.ts:94-96`:** strict preview body — `toMatch(/^Disallow: \/$/m)`, no `^Allow:`, no `Sitemap:`. The production branch is unchanged.
   - **Tests:** `scripts/face.test.ts`, 7 cases (vercel.app, staging, localhost with and without the env, production host, the config choice) — RED `siteFace is not a function` / `lighthouseConfigFor is not a function` (7 failed) → GREEN 7/7. The old helper classified staging as production (⚠️2).
   - **Regex sanity check:** the strict check is true on the preview body and false on the production body; the old substring check was true on the production body.
   - **Gate:** the robots test passed in both projects under the production face.
   - **Docs:** ARCHITECTURE item 1 states W135.
4. **I4 + M6 — W138 pixel harness (`ad2b285`).** All in `scripts/pixel-compare.ts`.
   - **Clip:** `designClip(width, pageHeight, zoom)` (`:122`). In `main`, the design screenshot is `fullPage` with `clip` (`:337-355`); `pageHeight` is the same `max(...)` of metrics Playwright's own full-page size reads, and `zoom` is `getComputedStyle(html).zoom`. See Deviation 2 for why this is not `documentElement.scrollHeight × zoom`.
   - **Status check:** `gotoOk()` (`:149`) runs on both gotos (`:328`, `:362`) and throws `PixelExit(…, 2)` naming the URL and status. The entry point maps it to exit 2 after closing the browser and server.
   - **Skip:** `pixelTarget()` (`:93`) with `PIXEL_PATHNAMES` (`:85`) skips with exit 0 and no score for a blog article with no body in the locale, or a page whose pathname is still in `UNBUILT_PATHNAMES` (lazy-imported in `main`, `:282`). `--route` overrides both.
   - **Tests:**
     - Width-padding case: passes on the existing code (it filled a coverage gap).
     - `designClip` (1440 / 7830 / 0.75 → 5873; 390 / 9988 / 1).
     - `gotoOk` with a mocked goto answering 404 (exit code 2, message names the URL and `HTTP 404`), `null`, and 200.
     - `pixelTarget` skip rules.
     - RED `designClip/gotoOk/pixelTarget is not a function` → GREEN 13/13.
   - **Smoke (no browser):** `--page=calc` → "skipped: /hiring-cost-calculator is not built yet", exit 0. `--page=blog-article` → "no blog body in tr", exit 0. `--locale=en` → "/blog/[slug] is not built yet", exit 0. `--page=bogus` → exit 2.
   - **Docs:** the plan doc (W138 paragraph; rule 1: the cap counts from the first like-for-like run) and the ARCHITECTURE pixel paragraph.
5. **M2 (`4cbb429`).**
   - **Change:** `js-size.mjs` `parseJsSizeArgs()` (`:129`) accepts `--routes=`, `--routes <list>` and `--dir=`; everything else is an error. The CLI answers with exit 2 and `usage: node scripts/js-size.mjs [--dir=<dir>] [--routes=</a,/b> | --routes </a,/b>]`. `parseRoutesArg` (`:155`) keeps its contract on top of it.
   - **RED:** 4 failed — `null` instead of `['/blog','/en/blog']`; `parseJsSizeArgs is not a function`; the CLI with `--bogus` exited 0; with `--routes /foo,/bar` it exited 0 (the review's exact case).
   - **GREEN:** 14/14.
6. **M3 (`9dfba9b`).**
   - **Change:** `newRunFiles()` (`:166`) picks this run's `lhr-<ts>.json` and `lhr-<ts>.html`. `collectExtra` moves both and empties `.lighthouseci-extra` of both first.
   - **Comments:** the header (`:10-16`), the `collectExtra` doc and the `js-size.test.ts` W94 comment. README § Running the gate now documents `npm run js-size -- --routes /a,/b`.
   - **Test:** RED `newRunFiles is not a function` → GREEN.
   - **Proof:** the `--routes` run (below) left `.lighthouseci` byte-for-byte listed as before (17 files); `.lighthouseci-extra` holds 2 json + 2 html.
7. **M4 (`7346e1c`).**
   - **New cases in `gate-routes.test.ts`:**
     - A `spawnSync` that captures stderr: `gate-routes: detail rows skipped (door not configured)` appears there, and stdout is still exactly `INDEXABLE_GATE_ROUTES`.
     - A door that never answers but honours its signal, under fake timers: still pending at 2,999 ms, `[]` at 3,000 ms, `AbortSignal.timeout` called with 3000. `AbortSignal.timeout` is rebuilt on the faked `setTimeout`, because Node runs it on internal timers that fake timers cannot reach.
     - The old case's title now says what it asserts.
   - Both cases pass on the existing code. **RED by mutation**, file restored afterwards (`git diff --quiet`):
     - Removing the stderr line gives `expected '' to contain 'gate-routes: detail rows skipped (doo…'`.
     - Timeout 5000 gives `expected "timeout" to be called with arguments: [ 3000 ]`.
8. **M5 (`c8d1684`).**
   - **Change:** `next.config.ts:9` (`const buildCpus = Number(process.env.NEXT_BUILD_CPUS)`) and `:27` (`cpus: Number.isInteger(buildCpus) && buildCpus > 0 ? buildCpus : undefined`).
   - **Evidence:** no unit test (the brief asks for none). A node eval of the guard gives unset / `''` / `abc` / `0` / `-1` / `2.5` → `undefined`, `2` → 2, `' 3 '` → 3. The build log prints `cpus: 2`.
9. **M7 (`c18b6b2`).**
   - The ARCHITECTURE `ClientIslands` bullet now reads "(Ruling R47; the 204,800 B script ceiling — § Quality gate above)".
   - The `CLAUDE.md` doc-map row now runs question → doc: "D27 pixel harness: two-iteration cap, delta taxonomy, ledger row" → `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` (`npm run pixel`). It is phrased to fit the existing column width, so only that row changes (the first phrasing re-padded all 30 rows).
10. **W136 labels (`c18b6b2`).**
    - **Code:** `formatMethodLine()` (`js-size.mjs:80`) prints, above every js-size table, `method: Lighthouse resource-summary:script:size, transfer bytes on <host> — worst run per route, post-hydration chunks and response headers included; the figure the ledger records (W136): the run against the Vercel preview is binding, a local run diagnostic`.
    - **Test:** RED `formatMethodLine is not a function` → GREEN 16/16.
    - **Docs:** ARCHITECTURE § Quality gate item 4 states W136: the ledger carries `js-size`; the W120 gz-9 proxy is diagnostic; bridge at `9af7983` on `/` is 169,353 B ≡ 177,782 B, with 27,018 B headroom.
    - **Report label:** the Task 7 report's "W120 method — local `<script src>` proxy" label on 177,782 B was wrong. That figure is Lighthouse `resource-summary:script:size` (transfer bytes on localhost:3000); the W120 proxy on `/` is 169,353 B.
11. **M8 — confirmed: nothing left.** The `JSON.stringify` header and the preview-only warning landed with item 1 (`f4b550c`).

**Found in the proof session and fixed (`e4ee8ed`): `lhci collect` has no `--extra-headers` option.**
- **Why the flag was dropped:** `@lhci/cli` hands Lighthouse only its `settings`, written to a `--cli-flags-path` file (`src/collect/node-runner.js`). The `--extra-headers` flag that W91 introduced and W137 re-specified was accepted and silently dropped, so a protected preview would have answered Lighthouse with the login wall.
- **Proven against the stand-in with a dummy value:**

  | Flag | LHR `configSettings.extraHeaders` | Stand-in requests carrying the header |
  | --- | --- | --- |
  | `--extra-headers=<JSON>` | `{}` | 0/50 |
  | `--settings.extraHeaders=<JSON>` | holds the key; the rc's `formFactor` and `skipAudits` survive (yargs merges the dot-key over the rc config) | 22/25 in a one-run probe; 48/50 in the final proof |

- **Fix:** `gate.sh:79` and `collectArgs` now use `--settings.extraHeaders`.
- **Tests:** `js-size.test.ts` pins the spelling and that neither script's code contains `--extra-headers` — RED 2 failed (`scripts/gate.sh: expected … not to contain '--extra-headers'`) → GREEN 17/17.
- **Docs:** comments, `.env.example`, DEPLOYMENT and ARCHITECTURE item 5 now name the flag that works.

### Proof session (W126 — one build, one `npm run start`, one gate run)

- **Build:** `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` exited 0.
  - The Experiments log prints `cpus: 2` and `serverActions`; compiled in 678 ms.
  - 13/13 static pages on 2 workers; `○ /robots.txt`.
  - No `nextjs-agent-rules` block was appended to `CLAUDE.md`.
- **Server:** one `REVALIDATE_SECRET=<throw-away> npm run start -- -p 3000`. `/` → 200, `/en` → 200; `robots.txt` shows the production face (`Allow: /`, `Disallow: /api/`, `/tesekkurler`, `/en/thank-you`, `Sitemap:`).
- **Gate:** `REVALIDATE_SECRET=<same> E2E_BASE_URL=http://localhost:3000 npm run gate` → **exit 0, `gate: OK`**, 126 s.
  - `gate: lighthouse config lighthouserc.local.json`; no bypass warning (localhost, production face).
  - Playwright **216 passed** (26.7 s), none skipped; the 4 revalidate token cases ran.
  - `gate-routes: detail rows skipped (door not configured)` appeared on stderr.
  - Lighthouse: 4 routes × 2 runs, asserted with `lighthouserc.local.json`. Every error-level assertion passed; LCP was a warning at 2,855–2,856 ms (R50). The 8 LHRs show `skipAudits: null`, SEO 1, `is-crawlable` 1 — right for the local production face.
- **js-size.** Every table printed the method line `method: Lighthouse resource-summary:script:size, transfer bytes on localhost:3000 — …(W136)…`.

  | Run | Route | Script B (worst of 2) | Headroom to 204,800 | LCP ms | Perf |
  | --- | --- | ---: | ---: | ---: | ---: |
  | gate | `/` | 177,782 | 27,018 | 2,855 | 0.96 |
  | gate | `/en` | 177,782 | 27,018 | 2,855 | 0.96 |
  | gate | `/en/hire-workers` | 177,782 | 27,018 | 2,856 | 0.96 |
  | gate | `/isci-talebi` | 177,782 | 27,018 | 2,855 | 0.96 |
  | `npm run js-size -- --routes '/tesekkurler?form=hire'` (W94's space spelling, 24 s) | `/tesekkurler?form=hire` | 179,927 | 24,873 | 2,855 | 0.96 |

  The `--routes` run collected with `lighthouserc.local.json`. `.lighthouseci` was unchanged; `.lighthouseci-extra` holds two json + html pairs. These are local figures: diagnostic. The binding ones come from the preview run (W136).
- **Pixel proof:** `VERCEL_AUTOMATION_BYPASS_SECRET=dummy-not-a-real-secret npm run pixel -- --page=hire --base=http://localhost:3000`, all three widths, exit 0 in 15 s. The dummy secret is exported so the design side is tested in exactly the I1 scenario.

  | Width | Before (review run, `9af7983`) | After |
  | --- | --- | --- |
  | 390 | 82.43 % | **82.14 %** (design 390×10001, built 971) |
  | 900 | 84.75 % | **84.04 %** (design 900×12620, built 951) |
  | 1440 | 91.66 % on a 1920×7804 canvas | **85.03 %** (design **1440×5873** = ⌈7830 × 0.75⌉, built 900) |

  The 1440 figure is now like for like; the review estimated ≈ 85.2 % over the content box. The built side is still the Task 3 spike, so these numbers exercise the mechanics only.
- **Design-side font check.** A scratch probe loads the hire design page at 390 the way the harness does: its own exported `captureContextOptions()`, the init script, networkidle, `h1`, `document.fonts.ready`.

  | Context | Requests carrying the header | Archivo faces | `fonts.check('800 16px Archivo')` | Failed requests |
  | --- | --- | --- | --- | --- |
  | Harness now | 0/19 | 2 loaded, 10 unloaded (unused weights/subsets), 0 error | true | only the design runtime's optional `.image-slots.state.json` (aborted in both variants) |
  | Pre-fix (same options + the empty header `?? ''` sent) | 19/19 | 2 in `error` | false | `fonts.gstatic.com` ×2 (the Archivo woff2) and `cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json`, all `net::ERR_FAILED` |

  This reproduces I1 and shows it fixed. The captures agree:
  - At 390 the design height went 9,988 → 10,001 px.
  - Against the pre-fix captures, 3.79 % (390) and 0.94 % (900) of the first 900 rows are re-rendered.
- **Preview stand-in** (`scratchpad/preview-standin.mjs` on 127.0.0.1:3200). It answers `/robots.txt` with `User-Agent: *` / `Disallow: /`, forwards everything else to :3000, and logs only header presence.
  - **RED** — `f41ad5e`'s own lines 53/64, no `--config`, run from a scratch directory with rc copies:
    - Both LHRs: `skipAudits: null`, `is-crawlable` 0, `categories.seo` **0.69**.
    - `lhci assert --config=lighthouserc.preview.json` → ✘ `categories.seo` (0.69) and ✘ LCP.
  - **GREEN** — `gate.sh`'s selection and collect blocks at `e4ee8ed`, extracted verbatim; `E2E_BASE_URL=http://127.0.0.1:3200 NEXT_PUBLIC_SITE_FACE=preview`, dummy secret:
    - `gate: lighthouse config lighthouserc.preview.json`.
    - Both LHRs: `skipAudits: ["is-crawlable"]`, `extraHeaders` holds `x-vercel-protection-bypass`, `is-crawlable` absent, `robots-txt` 1, **SEO 1**, script 177,782 B.
    - Assert → only ✘ LCP, the R50 localhost artefact (the review's control showed the same).
    - Header on **48/50** requests. The two without are Lighthouse's own out-of-page `robots.txt` fetch, one per run.
  - **Pixel through the stand-in** (390, dummy secret): all **17/17** built-origin requests carried the header (82.15 %); the design side had 0/19 (the probe above). `.pixel/` was restored to the main proof's artefacts afterwards.
- **Cleanup:** the npm/next-server pair and the stand-in were killed; ports 3000 and 3200 are free. `ps -Ao pid,rss,command | grep -E 'vitest|next|playwright|chromium|lighthouse|lhci'` shows only two pre-existing processes that are not mine: the Chrome Remote Desktop host and a VS Code helper. `git status` is clean.

### Deviations

1. **`--settings.extraHeaders` instead of the brief's and W137's `--extra-headers`.** `lhci collect` has no such option; proven above. This is the closest faithful reading of W137's intent ("a preview gate run that cannot see the site"). The ruling text itself is controller-owned and left untouched.
2. **W138 clip height is not `document.documentElement.scrollHeight × zoom`.**
   - A pre-implementation probe of hire at 1440 showed `html.scrollHeight` is already in zoomed px in this Chromium (5,872 = content end), while `body.scrollHeight` is unzoomed (7,830) and Playwright's full page is 1920×7830.
   - The literal formula would clip at 4,404 px and drop a quarter of the page.
   - The clip therefore uses the `max(...)` of the metrics Playwright's full-page size reads, times the computed zoom: ⌈7830 × 0.75⌉ = 5,873, the zoomed content box W138 describes. At 390 and 900 (zoom 1) it equals the full page.
3. **"Unbuilt page" detection uses `UNBUILT_PATHNAMES`**, the W20 source, through a `PixelPageKey` → pathname map and a lazy import in `main`; tests inject their own set. The blog body check runs first, so Phase A prints W138's own message for `blog-article tr`.
4. **`lighthouseConfigFor` checks the face before localhost.** Both T15 and the old code put localhost first. A server answering `Disallow: /` can never score SEO 1.0 with the audit live, and this order is also what makes a local preview stand-in or rehearsal collect with `lighthouserc.preview.json`. The cost: on localhost with a preview face, LCP is asserted as an error, and the R50 artefact then fails the run. That is documented as expected (a local run is never sign-off). Every realistic target is unaffected: localhost without the env → local; vercel.app or staging → preview; production → `lighthouserc.json`.
5. **`bypassWarning()` is how the pixel harness, placeholder counter and `js-size --routes` "use the face helper where they branch on face" (W135).** Their only face-dependent behaviour is the M8-style warning. gate.sh keeps the equivalent bash test (preview config ⇔ preview face).
6. **js-size loads the TS helpers through `tsx/cjs/api`, not `tsImport`.** The namespaced `tsImport` fails to resolve `bypass.ts`'s extensionless `./face` on Node 25 (`ERR_MODULE_NOT_FOUND …face.ts?namespace=…`). gate.sh's `node -e` uses the same CJS API, as T15 specified.
7. **`lighthouserc.local.json`'s `_comment` was corrected too.** It said "for assert only"; the brief named only the preview file.
8. **The last commit (`e4ee8ed`) came out of the proof session.** The build, gate, js-size and main pixel runs were made at `c18b6b2`. `e4ee8ed` touches no `src/`, so the build is unchanged. With no secret, the gate's collect argv is byte-identical at both commits (shown: `[lhci] [collect] [--additive] [--config=lighthouserc.local.json] [--url=…]`), as is `collectArgs` with `{}`. So no second build or gate run was made (W126, memory rule); the stand-in re-proof ran at `e4ee8ed`. Verify ran while the idle server and stand-in (≈ 340 MB) were up; vitest was the only active job.
9. **The pixel proof covered all three widths, not only 390**, to exercise the W138 clip end to end. A second 390 run went through the stand-in for the network-level W137 check.
10. **The gate ran with a throw-away `REVALIDATE_SECRET` on both server and gate**, so the four token cases ran instead of skipping (the brief's command omits it).
11. **Tests that pass on the existing code:** item 7's two cases (RED shown by mutation) and item 4's width-padding case (a coverage gap). Item 8 has no unit test (the brief asks for none).
12. **`parseRoutesArg(['--routes'])` now returns `[]`** (was `null`); the CLI rejects it with exit 2 via `parseJsSizeArgs`.

### Concerns

- **Lighthouse's own out-of-page fetches do not carry `extraHeaders`.** These are `robots.txt` on every run, and in one probe also two `/_next/image` fetches. On a protected preview they will answer 401. A 4xx `robots.txt` is not-applicable in Lighthouse's `robots-txt` audit (`robots-txt.js:217`), and `is-crawlable` is skipped. Still, watch the image-related audits on the first real preview run (controller, after the push).
- **The ruling log's W137 still says `--extra-headers`.** The code now passes `--settings.extraHeaders`; an amendment line is controller-owned.
- **Node 22 not exercised.** `pixel-compare`'s lazy import of `src/lib/seo/routes` (the next-intl ESM chain) and gate.sh's `tsx/cjs/api` calls were verified on Node 25.8.2 only, not on the `.nvmrc` major (22).
- **A local preview-face rehearsal now fails on LCP instead of SEO** (Deviation 4). This is intended, but worth knowing before someone reads it as a regression.

### Produces additions

All additive. The frozen Task 7 Produces block is untouched: same names and signatures, `resolvePixelRoute` still throws on no body, and the `comparePngs` and `report.json` shapes are unchanged.
- **`e2e/helpers/face.ts`:** `siteFace(baseUrl: string, env?: NodeJS.ProcessEnv): SiteFace`; `type LighthouseConfig`; `lighthouseConfigFor(baseUrl: string, env?): LighthouseConfig`. `expectedRobots` now delegates to `siteFace`.
- **`e2e/helpers/bypass.ts`:** `BYPASS_HEADER`; `protectionBypassHeaders(env?: NodeJS.ProcessEnv): Record<string, string>`; `bypassWarning(baseUrl: string, env?): string | null`.
- **`scripts/js-size.mjs`:** `formatMethodLine(lhrs)`, `parseJsSizeArgs(argv)`, `newRunFiles(before, now)`, `collectArgs(route, baseUrl, config, headers)`. `parseRoutesArg` also takes `--routes <list>`.
- **`scripts/pixel-compare.ts`:** `captureContextOptions(width, locale)`, `type RouteLike`, `builtOriginRoute(base, headers)`, `pixelTarget(page, locale, bundle, override, unbuilt)`, `designClip(viewportWidth, pageHeight, zoom)`, `class PixelExit`, `type PageLike`, `gotoOk(page, url, options)`.
