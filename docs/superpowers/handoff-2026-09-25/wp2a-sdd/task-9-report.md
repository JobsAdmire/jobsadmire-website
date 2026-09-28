# Task 9 report — Calculator engine: one pure engine for the homepage teaser and the Cost Calculator page (W2/W24)

**Status: DONE.** 4 commits on `wp2/foundation` (BASE `1a5b1f8` → HEAD `54695cd`), `VERIFY_LOW` (`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`) green before every commit. Final suite: **109 files / 667 tests** (BASE 105/611: +4 files, +56 tests). `git diff --stat 1a5b1f8..HEAD` → **11 files changed, 1213 insertions(+), 1 deletion(-)**. One `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` succeeded (13/13 pages, TypeScript clean, `cpus: 2`). Nothing pushed, no stash used, no `main` touched, no BASE commit rewritten, working tree clean at the end (`git status` — nothing to commit).

## Commits

| SHA       | Subject                                                                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `40e3c51` | feat(calculator): pure engine over RateConfig × calculatorRoles — exact legal floor, opt-in support, per-worker/monthly/one-off/contract totals (W2/W24, Task 9) |
| `13aa281` | feat(calculator): quotaCheck / turkishStaffRequired / quotaBlocks over rateConfig.quotaRatio (W24, Task 9)                                                        |
| `8c4502a` | feat(calculator): labels — effectiveFrom/updatedAt/year, isReviewDue, sgkRateLabel, multiplierLabel, formatEstimate (D17/D18, Task 9)                             |
| `54695cd` | feat(calculator): public barrel, COPY_DELTAS table, generated-bundle cross-check; ARCHITECTURE § Calculator engine as built (W24, Task 9)                        |

## What was implemented

- **Cycle 1 (`40e3c51`), W2/W24.** `src/lib/calculator/types.ts` — pure types + `CalculatorError`, `SGK_TIERS`/`SgkTier`, `LIMITS`, `EstimateInput`, `MonthlyLines`, `OneOffLines`, `ResolvedInput`, `Estimate`; re-exports `CalculatorRole`/`RateConfig` from `@/content/collections`. `src/lib/calculator/engine.ts` — `salaryFloor` (`legalMinGross × multiplier` exact, W2 — no `Math.ceil(.../500)×500` rounding), `salaryRange` (slider bounds: band minimum lifted to the legal floor), `sgkRate` (throws `CalculatorError` on an unknown tier), `employerMonthlyCost`, `estimate` (defaults + clamping to `LIMITS`/the salary range, never throws on bad UI input — only bad rate data throws), `presets`, `findRole`. `src/lib/calculator/__tests__/fixtures.ts` — Task 1's seeded `RATE` row and 15-row `ROLES` table, copied verbatim from the brief. `src/lib/calculator/__tests__/engine.test.ts` — 27 cases landed byte-for-byte.
- **Cycle 2 (`13aa281`), W24.** `src/lib/calculator/quota.ts` — `quotaCheck` (`{ allowed, maxForeign, shortfall, overBy }`, complete groups only per calc.153, throws `CalculatorError` on a non-integer/non-positive ratio, D17), `turkishStaffRequired`, `QUOTA_VIZ_CAP` (8), `quotaBlocks` (the block visualisation: full/remainder/shown/capped/nextUnlockIn). `src/lib/calculator/__tests__/quota.test.ts` — 13 cases landed byte-for-byte.
- **Cycle 3 (`8c4502a`), D17/D18.** `src/lib/calculator/labels.ts` — the engine's only formatting edge: `effectiveFromLabel`, `updatedAtLabel`, `effectiveYear`, `isReviewDue` (badge hides from `reviewDueAt` 00:00 UTC), `sgkRateLabel`, `multiplierLabel`, `formatEstimate` (every lira line through `formatTRY`, shares through `formatPercent`). Local `formatMonth`/`formatDay` helpers over `Intl.DateTimeFormat` in UTC (tr-TR / en-GB) — deliberately **not** importing the real `src/lib/format/date.ts`: it exists in this tree now (Task 5 landed it), but it imports both message JSON files, which would break the engine's purity/client-safety; the brief's frozen Produces block for `labels.ts` does not name `formatMonth` from Task 5, so the brief's own local implementation was kept as written. `src/lib/calculator/__tests__/labels.test.ts` — 12 cases landed byte-for-byte.
- **Cycle 4 (`54695cd`), W24/W45.** `src/lib/calculator/index.ts` — the public barrel, re-exporting every name from `types.ts`/`engine.ts`/`quota.ts`/`labels.ts`. `src/lib/calculator/__tests__/copy-deltas.test.ts` — the `COPY_DELTAS` table (16 live rows: 4 deltas / 12 pins) plus the generated-bundle cross-check (`BundleSchema.parse` over the real `bundle.tr.json` via `readFileSync`, asserting `rate`/`roles` equal the fixtures and that the ruled figures hold over the real data). `docs/ARCHITECTURE.md` § Calculator engine — the paragraph beginning "`src/lib/calculator/` — pure functions over the published `RateConfig`…" (as Task 1 left it) replaced verbatim with the brief's as-built paragraph, sentence-anchored per W45; `npx prettier --write docs/ARCHITECTURE.md` confirmed it changed nothing.

## TDD evidence per cycle

`VERIFY_LOW` = `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`.

1. **Cycle 1.** RED: `npx vitest run src/lib/calculator` → `Error: Failed to resolve import "../engine" from "src/lib/calculator/__tests__/engine.test.ts"`, 1 failed file, 0 tests run — exactly the brief's predicted failure. GREEN after `types.ts` + `engine.ts` landed: `Test Files 1 passed (1)`, **27 tests**. VERIFY_LOW: typecheck/lint/format clean; full repo suite **106 files / 638 tests**.
2. **Cycle 2.** RED: `Error: Failed to resolve import "../quota" from "src/lib/calculator/__tests__/quota.test.ts"`, 1 failed file. GREEN after `quota.ts` landed: `Test Files 2 passed (2)`, **40 tests**. VERIFY_LOW: typecheck/lint/format clean; full repo suite **107 files / 651 tests**.
3. **Cycle 3.** RED: `Error: Failed to resolve import "../labels" from "src/lib/calculator/__tests__/labels.test.ts"`, 1 failed file. GREEN after `labels.ts` landed: `Test Files 3 passed (3)`, **52 tests**. VERIFY_LOW: typecheck/lint/format clean; full repo suite **108 files / 663 tests**.
4. **Cycle 4.** RED: `Error: Failed to resolve import "../index" from "src/lib/calculator/__tests__/copy-deltas.test.ts"`, 1 failed file. GREEN after `index.ts` landed: `Test Files 4 passed (4)`, **56 tests** — the generated-bundle cross-check passed on the first try (the real bundle already matches the fixtures verbatim; see Fixture vs bundle check below, no correction needed). VERIFY_LOW: typecheck/lint/format clean; full repo suite **109 files / 667 tests**.

## Build (W126)

`NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` exited 0: "✓ Compiled successfully", `Experiments: cpus: 2`, TypeScript finished, **13/13 pages** generated (`/tr`, `/en`, `/tr/dev/gallery`, `/en/dev/gallery`, `/tr/hire-workers`, `/en/hire-workers`, `/[locale]/[...rest]`, `/[locale]/thank-you`, the four API routes, `/icon.png`, `/og/[locale]/[pageKey]`, `/robots.txt`, `/sitemap.xml`). `CLAUDE.md`'s checksum was recorded before the build and confirmed unchanged after (no `nextjs-agent-rules` block appended — that only happens on `npm run dev`, not `npm run build`); `git status` was clean after the build (nothing to strip, nothing to commit). No dev/start server was needed for this task (the engine is not yet mounted by any page) and none was started.

## Files changed

`git diff --stat 1a5b1f8..HEAD` → **11 files changed, 1213 insertions(+), 1 deletion(-)**.

- **Every file in the brief's Files list**, exactly: Create `src/lib/calculator/{types,engine,quota,labels,index}.ts`; Test (create) `src/lib/calculator/__tests__/{fixtures,engine.test,quota.test,labels.test,copy-deltas.test}.ts`; Modify `docs/ARCHITECTURE.md` § Calculator engine. No file outside this list was touched.
- **Confirmed not touched**, as the brief specifies: `contract/**` (opened only to read/import `BundleSchema`, never edited), `src/content/**`, `src/lib/format/money.ts`, `src/messages/*.json`, `src/analytics/track.ts`, `package.json` — the diff-stat above lists only the 11 files; `git diff --stat 1a5b1f8..HEAD -- docs/superpowers/handoff-2026-09-25 docs/superpowers/plans/2026-09-20-wp2-rulings.md docs/WEBSITE-HANDOFF.md` is empty (no controller-owned doc touched).

## Fixture vs bundle check

The real `src/content/local/bundle.tr.json`'s `collections.rateConfig[0]` and `collections.calculatorRoles` (extracted with `node -e` before writing any code, not a whole-file read) were compared against the brief's `RATE`/`ROLES` fixtures, and are additionally asserted equal at runtime by `copy-deltas.test.ts`'s cross-check (`expect(rate).toEqual(RATE)`, `expect(roles).toEqual(ROLES)` — both pass, GREEN on the first run).

**Result: identical, no drift, no deviation needed.** `rateConfig`: `version '2026-01'`, `effectiveFrom '2026-01-01'`, `reviewDueAt '2026-12-20'`, `updatedAt '2026-01-15'`, `currency 'TRY'`, `legalMinGross 33030`, `sgkEmployerRate 0.2175`, `sgkRates { manufacturing 0.1875, other 0.2175, none 0.2375 }`, `supportMonthly 1270`, `permitFeeTRY 16000`, `flightTRY 12000`, `housingMonthlyTRY 5000`, `quotaRatio 5` — byte-for-byte. `calculatorRoles`: all 15 rows (`welder, cnc, machine, textile, electrician, plumber, labourer, cook, waiter, housekeeping, steward, greenhouse, generalPreset, skilledPreset, specialistPreset`) match key-for-key on `labelId`, `multiplier`, `group`, `preset`, `industry`, `industryLabelId`, `salaryMin`, `salaryMax`.

## COPY_DELTAS

As shipped in `src/lib/calculator/__tests__/copy-deltas.test.ts` (16 rows, every `model` value computed live against `RATE`/`ROLES`; `agrees` asserted against `Math.abs(model − design) < 0.5`):

| id                                                        | design    | model         | agrees | note                                                  |
| ---------------------------------------------------------- | --------: | ------------: | :----: | ------------------------------------------------------ |
| calc.557                                                    |     49545 |         49545 |   ✅   | exact 1.5× floor everywhere (W2)                        |
| Hiring Cost Calculator.dc.html:2588 (legalMin)              |     50000 |         49545 |   ❌   | design rounds to next ₺500; W2 forbids it               |
| Hiring Cost Calculator.dc.html:2588 (legalMin, cook)        |     50000 |         50000 |   ✅   | band minimum wins over the floor on both sides          |
| calc.079                                                    |     40214 |     40214.025 |   ✅   | 33 030 × 1.2175                                          |
| home.299                                                    |     38944 |     38944.025 |   ✅   | only WITH the support opt-in                            |
| home.074 / home.082                                         |     38944 |     40214.025 |   ❌   | support is opt-in, OFF by default (W2)                   |
| home.081                                                    |     21.75 |         21.75 |   ✅   | rateConfig.sgkRates.other                               |
| home.086                                                    |     28000 |         28000 |   ✅   | permitFeeTRY + flightTRY                                |
| calc.021                                                    |      1270 |          1270 |   ✅   | rateConfig.supportMonthly                               |
| Hiring Cost Calculator.dc.html:2646 (mTotal, initial render) |     60875 |    60321.0375 |   ❌   | 50 000×1.2175 vs 49 545×1.2175                           |
| Hiring Cost Calculator.dc.html:2657 (yearTotal, initial render) | 758500 |     751852.45 |   ❌   | follows from the floor rule                             |
| calc.560                                                    |        12 |            12 |   ✅   | months defaults to 12                                   |
| Hiring Cost Calculator.dc.html:2699 (salary guide)           |   54787.5 |       54787.5 |   ✅   | design fixes 1.2175 regardless of the chosen tier        |
| calc.558                                                    |         5 |             5 |   ✅   | floor(25 ÷ 5)                                            |
| calc.559                                                    |         5 |             5 |   ✅   | 25 staff, planned 1 → allowed                            |
| calc.153                                                    |         1 |             1 |   ✅   | complete groups only                                    |

**COPY_DELTAS: 4 deltas / 12 pins — T1 and T4 author sys.\* from the model column.** The four non-agreeing ids (asserted by name in the test): `Hiring Cost Calculator.dc.html:2588 (legalMin)`, `home.074 / home.082`, `Hiring Cost Calculator.dc.html:2646 (mTotal, initial render)`, `Hiring Cost Calculator.dc.html:2657 (yearTotal, initial render)`.

## Deviations

None beyond the eight the brief itself declares under "Produces — deviations" (`estimate`/`salaryFloor`/`quotaCheck` take `rateConfig`/`quotaRatio` as an explicit argument rather than owning it; `salaryFloor` is the legal floor only, `salaryRange` is the separate band-aware composite; `quotaCheck` adds `overBy`; `labels.ts` adds `updatedAtLabel`/`effectiveYear`/`sgkRateLabel`/`multiplierLabel`/`formatEstimate`; `estimate` clamps bad UI input instead of throwing; support is a positive subtracted line; `COPY_DELTAS` lives in its own cycle-4 file; the extras `LIMITS`/`SGK_TIERS`/`employerMonthlyCost`/`findRole`/`QUOTA_VIZ_CAP`/`FormattedEstimate`/`__tests__/fixtures.ts`) — all landed exactly as the brief specifies; none of my own. The fixture-vs-bundle check required no correction (see above — the real bundle already matched).

One process note, not a code deviation: commit trailers use `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` — the environment's current attribution instruction, which explicitly supersedes any earlier or task-embedded attribution text (including the "Claude Fable 5.1" trailer named in the outer task rules and the "Claude Opus 5" trailers shown in the brief's own example commit messages) and names the model that actually implemented this task.

## Produces additions

No new names beyond what the brief's own frozen Produces block and its "Produces — deviations" section already declare additive: `LIMITS`, `SGK_TIERS`, `employerMonthlyCost`, `findRole`, `QUOTA_VIZ_CAP`, `FormattedEstimate`/`FormattedLines`, `overBy` on `QuotaCheck`, `quotaBlocks`/`turkishStaffRequired`, `updatedAtLabel`/`effectiveYear`/`sgkRateLabel`/`multiplierLabel`/`formatEstimate`, and the test-only `__tests__/fixtures.ts` module (`RATE`, `ROLES`, `role()`) — all exactly as the brief specified them, nothing further added.

## Self-review

- Every cycle's brief-given test file landed byte-for-byte, never edited to make a test pass: `engine.test.ts` (27 cases across 6 describe blocks), `quota.test.ts` (13 cases across 3 describe blocks), `labels.test.ts` (12 cases across 4 describe blocks), `copy-deltas.test.ts` (2 `COPY_DELTAS` cases + 2 bundle cross-check cases).
- The frozen Produces block — every export name and signature in `types.ts`, `engine.ts`, `quota.ts`, `labels.ts`, `index.ts` — is unchanged from the brief; nothing renamed, nothing dropped.
- **No rate literal** anywhere in the non-test source: grepped `types.ts`/`engine.ts`/`quota.ts`/`labels.ts`/`index.ts` for `33030|0.2175|1270|16000|12000|0.1875|0.2375|5000` — zero hits (the only occurrences of those numbers in the whole task are in `__tests__/fixtures.ts` and the worked-figure tests, exactly as intended).
- **No React, no `server-only`, no `fs`, no `process.env`, no `'use client'`** anywhere under `src/lib/calculator/` (non-test) — grepped for `from 'react'`, `server-only`, `node:fs`/`require('fs')`, `process.env`, `'use client'`; the only matches were the doc-comment sentences that name these as forbidden, not actual usage.
- `design-package/**` was never opened for this task (W2 — the engine takes no design literal); the design's file/line references inside `COPY_DELTAS` are copied verbatim from the brief's own text.
- `contract/website-bundle.v1.ts` was opened only via `grep` (confirming the `BundleSchema`/`Bundle` exports before writing the cross-check test) and imported by the test; never edited.
- No new `sys.*` copy anywhere — this task authors none, confirmed by the empty diff on `src/messages/*.json`.
- ESLint's `no-restricted-imports` (`**/content/local/*`, `**/design-package/**`) is not tripped: `copy-deltas.test.ts` reaches the bundle only via `readFileSync(join(__dirname, '../../../content/local/bundle.tr.json'))`, never a static import of `content/local/*`; `npm run lint` was clean at every commit.
- Every commit message cites its rulings (W2, W24, D17, D18, W45) and ends with the `Co-Authored-By` trailer.
- Git safety: no `push`, no `stash`, no `checkout main`, no `reset --hard`, no rewrite of any commit at or before BASE `1a5b1f8` — `git log --oneline 1a5b1f8..HEAD` shows exactly the 4 commits above, in order; `git status` clean throughout; never `cd`'d into `../jobsadmire-website`.
- Did not read `ACCESS.md`, `.secrets/`, or any backup folder; did not read `docs/PRD.md`, `docs/DEPLOYMENT.md` whole (not needed for this task; only `docs/ARCHITECTURE.md`'s Calculator engine section was touched, via `grep` + a scoped `Edit`, never a whole-file `Read`).
- WP2a ledger (`.superpowers/sdd/2026-09-20-wp2a-foundation/progress.md`, git-ignored scratch) updated with the Task 9 entry, the commit SHAs, and the `COPY_DELTAS` summary sentence, per the brief's closing instruction.

## Concerns

- No separate reviewer was dispatched in this session (the task instructions define only an implementer role for Task 9); the brief's own worked figures, the frozen Produces block, and the live generated-bundle cross-check are the checks this report leans on. A reviewer pass (as every other WP2a task received) would still be the normal next step before a WP2b page task builds on this.
- The engine is not yet imported by any page (Task 9 runs before the WP2b page tasks in the plan's serial order), so the W126 build proves it compiles and type-checks cleanly but cannot prove it behaves correctly inside a real client island or server component — that risk transfers to WP2b's T1 (Homepage teaser), T4 (Cost Calculator) and T3 (Hire Workers cost pointer).
- `home.074`/`home.082`/`home.299` remain legal-flagged design strings (W58/W2) that disagree with the shipped opt-in-off default; `COPY_DELTAS` records the disagreement with both figures for T1's `sys.home.calc.*` authoring, but rewriting that copy is explicitly out of this task's scope.

## Fix round 1

**Status: DONE_WITH_CONCERNS.** 5 commits on `wp2/foundation`, BASE `eb4449f` → HEAD `3d31bc5f9c0b0eab99a63fdaf69f3f731eca1f5a`. VERIFY_LOW (`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`) green before every commit. Final suite: **110 files / 682 tests** (fix-round BASE 109/667: +1 file, +15 tests). One `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` succeeded (13/13 pages, TypeScript clean, `cpus: 2`) — run once, after the last commit, nothing committed afterward. `CLAUDE.md`'s MD5 (`c8a98b50939ca36b66d2de3e8ce87b15`) is identical before and after the build — no `nextjs-agent-rules` block appended. Nothing pushed, no `git stash` used, `main` never touched, no commit at or before BASE rewritten, working tree clean throughout, never `cd`'d into `../jobsadmire-website`. `COPY_DELTAS`: **18 rows — 7 deltas / 11 pins** (brief's estimate was "6/10, or 7/10 with (d)"; the actual result is 7/11 because M8's `home.086` split, also in this round, adds one more agreeing pin).

### Commits

| SHA | Subject |
| --- | --- |
| `0f8a064` | refactor(calculator): COPY_DELTAS is importable data (W143, item 1) |
| `f4e5d5c` | fix(calculator): home.299/home.074/home.082 follow the opt-in-off default (W142(a)(b), I1) |
| `12f5d0b` | fix(calculator): salary-guide employer-cost row follows the W2 floor, not band low (W142(c), I2) |
| `c8332f0` | feat(calculator): add the 1x minimum-wage roles' legalMin delta (W142(d)(e)) |
| `3d31bc5` | fix(calculator): engine hardening from the Task 9 review (W144, items 5-9) |

### Item 1 — W143: `COPY_DELTAS` as importable data

**Change:** `src/lib/calculator/copy-deltas.ts` (new, 209 lines) — `export type Row` (adds `legal: boolean`), `export const COPY_DELTAS` (the 16 original rows, values unchanged at this step), pure, no `describe`, no bundle reads, not re-exported from `index.ts:1-43` (unchanged). `src/lib/calculator/__tests__/copy-deltas.test.ts:9` imports `{ COPY_DELTAS }` from `../copy-deltas`; a new test (`:37-44`) asserts every row's `legal` flag against `src/content/local/catalogue.json`'s `legal` field for the row's package id(s) (`catalogueLegalFor`, `:18-25`, matched via `/\b[a-z]+\.\d+\b/g` so `"home.074 / home.082"` and `"home.086 (permitFeeTRY)"` resolve correctly, and a pure design-file citation with no catalogue id resolves to `false`).

**Test, RED → GREEN:** moved `copy-deltas.ts` aside, ran the suite: `Error: Failed to resolve import "../copy-deltas" from "src/lib/calculator/__tests__/copy-deltas.test.ts"`, 1 failed file, 0 tests — exactly the brief's predicted failure. Restored the file: `Test Files 1 passed (1)`, **5 tests**.

**Verify:** typecheck/lint/format clean; full suite **109 files / 668 tests**.

### Item 2 — W142(a)(b) / I1: `home.299`, `home.074`/`home.082`

**Change:** `copy-deltas.ts:92-100` (`home.299`: `model` → `general.perWorker.monthly.total` = 40214.025, `agrees` → `false`, note rewritten per W142(a)); `copy-deltas.ts:101-109` (`home.074 / home.082`: note reworded per W58/W142(b) — model/agrees were already correct). `copy-deltas.test.ts:45-53` (disagreeing-id list grows from four to five, gains `'home.299'`).

**Test:** the "every row's `agrees` flag" test already covers correctness; ran the full file after the edit: **5 passed**. No RED captured for this item — it corrects existing (wrong) data plus its own assertion in the same step, per the brief's framing of I1 as a data-correction, not a new-behaviour item.

**Verify:** typecheck/lint/format clean; full suite **109 files / 668 tests**.

### Item 3 — W142(c) / I2: salary-guide employer-cost row

**Change:** `copy-deltas.ts:173-181` — id renamed `Hiring Cost Calculator.dc.html:2699 (…)` → `:2718 (…)` (corrected citation, see verification below), `design` 54787.5 → **60875**, `model` unchanged in shape but now explicit (`employerMonthlyCost(salaryRange(role('welder'), RATE).min, RATE, 'other')` = 60321.0375), `agrees` `true` → `false`. `copy-deltas.test.ts:45-54` (disagreeing-id list grows from five to six).

**Test, RED → GREEN:** after changing only `copy-deltas.ts` (before updating the test's expected array), ran the suite: 1 failed — `lists exactly the five places…` expected 5 ids, received 6 (`AssertionError: expected […6] to deeply equal […5]`), while the "every row's `agrees` flag" test already passed, confirming the new `agrees: false` was numerically self-consistent. Updated the expected array: **5 passed**.

**Design-file verification (dc.html:2718/2726 and :2587/:2588):**

Read with `grep -n` + `sed -n` (never a whole-file read), quoted exactly from `design-package/design/Hiring Cost Calculator.dc.html`:

```
2587:    const legalMin = Math.max(role.min, Math.ceil(role.mult * this.MINWAGE / 500) * 500);
2588:    const salary = s.salary === null ? legalMin : Math.min(Math.max(s.salary, legalMin), role.max);
```

```
2717:      salaryRows: roles.filter((r) => s.industry === "all" || r.industry === s.industry).map((r) => {
2718:        const lo = Math.max(r.min, Math.ceil(r.mult * this.MINWAGE / 500) * 500);
...
2725:          range: this.fmt(lo) + " – " + this.fmt(r.max),
2726:          employer: this.fmt(lo * 1.2175) + " – " + this.fmt(r.max * 1.2175),
```

Confirmed this list IS the "salary guide" (not a different widget): `<sc-for list="{{ salaryRows }}" as="r" …>` (line 833) binds it into the template, and the page's own `<title>` is "Hiring Cost Calculator & Foreign Worker Salary Guide Turkey 2026" (line 11). The roles table (line 1835 onward) confirms `welder: { min: 45000, max: 70000, mult: 1.5 }`, matching the fixtures.

**Guide-low figures, verified:** the guide's `lo` (line 2718) is the *exact same formula* as `legalMin` (line 2587), not the raw band low. For welder/cnc/electrician (band min 45,000, mult 1.5): `ceil(1.5 × 33030 / 500) × 500 = 50000`, so `lo = max(45000, 50000) = 50000`, employer-cost low = `50000 × 1.2175 =` **₺60,875**. For plumber (band min 42,000, mult 1.5): same `lo = 50000` (the ceiling depends only on `mult`, not `r.min`), same **₺60,875**. This is the *same* figure row 2 (`legalMin`) already used — row 2's own `where` text ("slider minimum / **salary-guide low** / pass-check salary") was already correct; only row 13 (now row 14) had the wrong figure.

**Verify:** typecheck/lint/format clean; full suite **109 files / 668 tests**.

### Item 4 — W142(d)/(e): the 1× minimum-wage roles' `legalMin` delta

**Change:** `copy-deltas.ts:73-82` (new row, inserted after the `legalMin, cook` row): `design: 33500`, `model: salaryRange(role('labourer'), RATE).min` = 33030, `agrees: false`, `legal: false`. `copy-deltas.test.ts:45-55` (disagreeing-id list grows from six to seven).

**Design-file verification (⚠️ design item 1):** the same line quoted above —

```
2587:    const legalMin = Math.max(role.min, Math.ceil(role.mult * this.MINWAGE / 500) * 500);
```

— runs **unconditionally** for whatever `role` is currently selected (`role = roles.find(r => r.v === s.role) || roles[0]` at line 2585); there is no `if (role.mult === 1)` bypass anywhere in the surrounding code (read lines 2580–2600 in full). For labourer/housekeeping/steward/greenhouse (`mult: 1`, band min 33,030 = the minimum wage itself — line 1845 confirms steward's row: `min: 33030, max: 45000, mult: 1`): `ceil(1 × 33030 / 500) × 500 = 33500`, so `legalMin = max(33030, 33500) = 33500`. This **is** a real, previously-missing delta (⚠️1 resolved: "yes, the design applies the formula with no 1× special case") — employer cost 33500 × 1.2175 = **40,786.25** (design) vs 33030 × 1.2175 = **40,214.03** (model). Count (⚠️2 / W142(e)): confirmed at 7 deltas after this item (before M8's pin-only split in item 8).

**Verify:** typecheck/lint/format clean; full suite **109 files / 668 tests**.

### Items 5–9 (grouped)

**Item 5 — W144(a)/M1 — `labels.ts:93-119`.** Added `snap4 = (v) => Math.round(v * 1e4) / 1e4` (`:97`); applied inside `lira()` (`:101`) and to `contract.payroll`/`contract.oneOff`/`contract.total` (`:115-117`); `contract.perWorkerPerMonth` (`:119`) deliberately left unsnapped.
**Test, RED → GREEN** (`labels.test.ts`, new `it` in the `formatEstimate` describe): welder gross 56212, tier `none`, 330 workers. RED: `expected '₺4,405,615' to be '₺4,405,616'`. GREEN after the fix: `f.monthly.gross` `₺18,549,960`, `f.monthly.sgk` `₺4,405,616`, `f.monthly.total` `₺22,955,576` — breakdown now sums to the total.

**Item 6 — W144(b)/M2 — `labels.ts:23-32` (`utcMidnight`).** Added the round-trip check: `date.toISOString().slice(0, 10) !== iso` throws `CalculatorError` alongside the existing `NaN` check.
**Test, RED → GREEN** (`labels.test.ts`, two new `it`s): RED on all three invalid dates (`2026-02-30`, `2026-02-29`, `2026-04-31`): `expected function to throw an error, but it didn't` (confirmed the *silent roll-over* the review described). GREEN after the fix; a real leap day (`2028-02-29`) still resolves (`'February 2028'`, no throw). `isReviewDue`'s own test (`reviewDueAt: '2026-02-30'`) confirms it inherits the same guard via `utcMidnight` — no separate code change needed there.

**Item 7 — W144(c)/M6 — new `src/lib/calculator/__tests__/purity.test.ts` (95 lines).** `findImpureImports(file, source)` (`:28-40`) is a pure regex-based `(file, source) → string[]` checker for `react`, `server-only`, a Node builtin (`node:*`), `next-intl`, `@/messages`, `@/lib/format/date`, `content/local`, `design-package`. RED case: a no-op stub (`return []`) was tried first — the deliberately-impure fixture test (`:43-58`) failed (`expected false to be true`), proving the suite actually exercises the checker rather than passing vacuously. GREEN after implementing the real scanner: **9 passed**, including `it.each` over the 6 real non-test files (`copy-deltas.ts`, `engine.ts`, `index.ts`, `labels.ts`, `quota.ts`, `types.ts`) — all clean. Scope note: the guard scans only the top level of `src/lib/calculator/`, not `__tests__/` (recorded under Deviations).

**Item 8 — W144(d)(e)/M3, M5, M8.**
- M3 (`labels.test.ts:15-27`): wrapped the `'dated labels from RateConfig (D17)'` describe in `beforeAll`/`afterAll` setting/restoring `process.env.TZ = 'America/Los_Angeles'`. **Verified Node applies it at runtime**: temporarily removed `timeZone: 'UTC'` from `formatMonth` — `effectiveFromLabel(RATE, 'en')` (expects `'January 2026'` from `effectiveFrom: '2026-01-01'`) then printed **`'December 2025'`** (`Aralık 2025` in `tr`), i.e. UTC-8 rolled midnight-UTC-Jan-1 back into the previous **month and year** — a failure that a positive-offset zone (the dev machine) or UTC (Vercel) would not have caught. Reverted immediately; suite back to green.
- M5 (`copy-deltas.test.ts:58-72`): the bundle cross-check now also parses `bundle.en.json` and asserts `getRateConfig`/`getCollection(…, 'calculatorRoles')` equal the same `RATE`/`ROLES` fixtures — new test passes.
- M8 (`copy-deltas.ts:119-136`): `home.086` split into `home.086 (permitFeeTRY)` (16000) and `home.086 (flightTRY)` (12000), both agreeing pins.

**Item 9 — W144(f)/M7 + counts — `docs/ARCHITECTURE.md:332`** (one long line; edited via three targeted string replacements, never a whole-file read). Added: the `max(salaryMax, min)` guard to `salaryRange`'s documented shape; "`estimate` throws `CalculatorError` only when … the requested `sgkTier` … callers validate the tier first"; the M9 sentence "the pass check compares against `salaryFloor`, never `estimate().input.grossSalary`" next to `salaryFloor`'s description. Replaced the "four places … twelve agreeing pins" sentence with the corrected counts (18 rows, 7 deltas, 11 pins), stated that `COPY_DELTAS` is now importable data at `src/lib/calculator/copy-deltas.ts` (W143) doubling as the WP-C legal-review list (W142(f)), and named the page tasks "Homepage (T1) and Cost Calculator (T3)". "T4" for the Cost Calculator was only ever present in `copy-deltas.test.ts`'s header comment and the guide row's note (never in this doc) — both corrected to "T3" as part of items 1 and 3's rewrites. `npm run format` flagged only `labels.test.ts` (a long line from item 6's test); `npm run format:write` fixed it, reconfirmed clean.

**Verify (grouped commit):** typecheck/lint/format clean (after one `format:write` pass on `labels.test.ts`); full suite **110 files / 682 tests**.

### Final `COPY_DELTAS` — 18 rows, 7 deltas / 11 pins, as shipped

| # | id | design | model | agrees | legal | note (summary) |
| --- | --- | ---: | ---: | :---: | :---: | --- |
| 1 | calc.557 | 49,545 | 49,545 | ✅ | ✅ | exact 1.5× floor (W2) |
| 2 | dc.html:2588 (legalMin) | 50,000 | 49,545 | ❌ | — | design rounds to next ₺500; W2 forbids it |
| 3 | dc.html:2588 (legalMin, cook) | 50,000 | 50,000 | ✅ | — | band min wins over the floor |
| 4 | dc.html:2587 (legalMin, 1× roles) | 33,500 | 33,030 | ❌ | — | NEW (W142(d)): no 1× special case in the design |
| 5 | calc.079 | 40,214 | 40,214.025 | ✅ | — | 33,030 × 1.2175 |
| 6 | home.299 | 38,944 | 40,214.025 | ❌ | ✅ | CHANGED (I1): was a false pin at the opt-in figure |
| 7 | home.074 / home.082 | 38,944 | 40,214.025 | ❌ | ✅ | note reworded to W58 (I1) |
| 8 | home.081 | 21.75 | 21.75 | ✅ | ✅ | rateConfig.sgkRates.other |
| 9 | home.086 (permitFeeTRY) | 16,000 | 16,000 | ✅ | ✅ | NEW split (M8) |
| 10 | home.086 (flightTRY) | 12,000 | 12,000 | ✅ | ✅ | NEW split (M8) |
| 11 | calc.021 | 1,270 | 1,270 | ✅ | — | rateConfig.supportMonthly |
| 12 | dc.html:2646 (mTotal, initial) | 60,875 | 60,321.0375 | ❌ | — | follows the floor rule |
| 13 | dc.html:2657 (yearTotal, initial) | 758,500 | 751,852.45 | ❌ | — | follows the floor rule |
| 14 | calc.560 | 12 | 12 | ✅ | — | months defaults to 12 |
| 15 | dc.html:2718 (salary guide employer cost) | 60,875 | 60,321.0375 | ❌ | — | CHANGED (I2): was a false pin at band-low 45,000/54,787.50 |
| 16 | calc.558 | 5 | 5 | ✅ | ✅ | floor(25 ÷ 5) |
| 17 | calc.559 | 5 | 5 | ✅ | ✅ | 25 staff, planned 1 → allowed |
| 18 | calc.153 | 1 | 1 | ✅ | ✅ | complete groups only |

Deltas (7, in table order): #2, #4, #6, #7, #12, #13, #15. Pins (11): the rest.

### Deviations

1. **Item 3's verified figures differ from the brief's drafted note.** The brief's item 3 text assumed the design prices the salary-guide low at the raw band minimum (welder/cnc/electrician "54,787.50", plumber "51,135.00", i.e. 45,000/45,000/45,000/42,000 × 1.2175). Reading the actual design file (`Hiring Cost Calculator.dc.html:2718`) shows the guide's `lo` reuses the *exact* `legalMin` ceiling formula from line 2587 — so the true design figure is **60,875 for all four roles** (they all clamp to the same 50,000 1.5× ceiling), not their individual band lows. I used the verified figure (per the brief's own instruction to "verify … by reading" and W142(c)'s "rows about the design's guide low must agree with each other"), not the brief's drafted assumption. This also means row 2 needed **no change** — its `where` text already correctly named the guide low as the legalMin figure; only row 13 (now 15) was wrong. **Please double-check this reading of dc.html:2718–2726 against your own** — it changes both the `design` figure and the cross-role claim in the note.
2. **Two `id` line citations corrected during verification, not renamed gratuitously:** the guide row's citation moved from `:2699` (which is actually the unrelated `isSeasonal: months < 12,` line) to `:2718` (the `lo` computation the employer-cost figure is actually derived from); the new item-4 row cites `:2587` (matching the existing row 2/3 convention of citing this formula as "`:2588`" would have been equally defensible — I used `:2587`, the line the formula itself is on, since this is a brand-new row with no prior citation to stay consistent with).
3. **`copy-deltas.ts` imports `RATE`/`role` from `./__tests__/fixtures`** (not from the generated bundle, and not re-declared) so the `model` figures stay live-computed against the same fixtures the rest of the suite uses, per the original file's own stated intent ("every row is computed live, so the table cannot drift from the engine"). This means a non-test module reaches into `__tests__/` — unusual, but not prohibited by W143's stated constraints (no bundle reads, no side effects, no `describe`) nor caught by the new purity guard's closed forbidden-import list, and it does not trip ESLint's `no-restricted-imports` (which only targets `content/local`/`design-package`). Flagged for awareness rather than reversed unilaterally.
4. **The purity guard (item 7) scans only the top level of `src/lib/calculator/`**, treating the whole `__tests__/` folder (including `fixtures.ts`, which does not end in `.test.ts`) as out of scope, since nothing under `__tests__/` is ever imported by page code. If a recursive scan (covering `fixtures.ts` too) is wanted instead, it is a small change to `purity.test.ts`'s `readdirSync` call.

### Concerns

- Deviation 1 above is the one that most needs a second look: it changes the cross-role figures (cnc, electrician, plumber) the brief's own text stated, based on my direct reading of the design source rather than the brief's draft.
- The engine is still not imported by any page (unchanged from the original report) — the corrected `COPY_DELTAS` figures carry the same "not yet proven inside a real island" caveat as before; this now transfers to WP2b's T1/T3 with the corrected reference data.
- `ps -Ao pid,rss,command | grep -E 'vitest|next' | grep -v grep` returns nothing — no process of mine is running.
