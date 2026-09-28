# Task 9 review — Calculator engine (BASE 1a5b1f8 → 54695cd, 4 commits; reviewed at HEAD dc261e1)

**Spec compliance:** ✅ compliant — all ten `src/lib/calculator/**` files and the ARCHITECTURE paragraph are byte-identical to the brief, the frozen Produces surface is proven at the type level (33 exact-type assertions plus a negative control), the fixtures equal the committed rows in both bundles, and the only deviations are the brief's own eight.
**Code quality:** ❌ changes required: 0 Critical, 2 Important, 9 Minor

The engine code is clean: it is pure, unrounded, holds no rate literal, reproduces the worked figures and formats dates the same in every timezone. Both Important findings are in the `COPY_DELTAS` table, which the brief wrote and the implementer copied verbatim. The fix round is a data and wording change to `copy-deltas.test.ts`, plus the matching counts in ARCHITECTURE and the ledger (⚠️ 2).

Reviewer runs, one heavy job at a time, at HEAD `dc261e1`. The tree was clean before and after, and nothing in the repo was edited apart from this file under git-ignored `.superpowers/`:
- **Gate (low, once):** `npm run typecheck` ✓ · `npm run lint` ✓ · `npm run format` ✓ · `NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1` gave **109 files / 667 tests** ✓ (57 s), matching the report. The calculator suite on its own (verbose run): 4 files / 56 tests (engine 27, quota 13, labels 12, copy-deltas 4).
- **Build (once):** `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` exited 0. Next 16.3.5 (Turbopack, warm cache) with `cpus: 2` and `serverActions`, TypeScript ✓, 13/13 pages. The `CLAUDE.md` checksum is unchanged (no `nextjs-agent-rules` block), and `git status` was clean before and after.
- **Scratch-only probes** (`scratchpad/review-task9/`):
  - a script that extracts the brief's code blocks and diffs them against disk;
  - a `tsc` project that type-checks the frozen Produces block against the real barrel;
  - a fixture-vs-bundle deep-equality check (Node type stripping);
  - a copy of the engine run under Node for: a half-way-rounding sweep (exact BigInt arithmetic), a five-timezone label matrix, invalid-date probes, quota and input edge cases, and `formatEstimate` timing.

## Spec compliance evidence

**Method.** `extract-and-diff.sh` cut the brief's ten full-file code blocks (fixtures, engine.test, types, engine, quota.test, quota, labels.test, labels, copy-deltas.test, index) and diffed each against disk: **10/10 byte-identical**. The ARCHITECTURE § Calculator engine paragraph (`docs/ARCHITECTURE.md:332`) was cut from the brief's "Docs in this task" and compared with `cmp`: **byte-identical**. The saved `review-1a5b1f8..54695cd.diff` equals a fresh `git diff 1a5b1f8..54695cd`.

- **Produces (frozen): ✓.** `typecheck/produces.check.ts` imports the real `src/lib/calculator/index.ts` through a scratch tsconfig that extends the repo's. It asserts exact type equality (`Equals<A,B>`) for all 33 frozen items against the brief's Produces block:
  - `types.ts`: 11 items, including `SGK_TIERS` as `readonly ['manufacturing','other','none']`, `LIMITS` literal types and every field of `EstimateInput`, `MonthlyLines`, `OneOffLines`, `ResolvedInput` and `Estimate`.
  - `engine.ts`: 7 signatures, including `employerMonthlyCost(gross, rateConfig, tier?)`.
  - `quota.ts`: 6 items, including `QUOTA_VIZ_CAP` as the literal `8` and `quotaBlocks(…, cap?)`.
  - `labels.ts`: 9 items, including `isReviewDue(rateConfig, now?)` and `FormattedEstimate`.
  - A negative control (`@ts-expect-error` on a wrong `salaryFloor` signature) proves the check is not vacuous. `tsc` exit 0.
  - The barrel's runtime exports are exactly the 21 Produces names. `COPY_DELTAS` is a test-file export, not in the barrel, as W24 rules.
  - `produces-final.md` § Task 9 and § Task 9 — test fixtures match the brief. WP2b T1 (`task-1.md:85`) and T3 (`task-3.md:110`) consume exactly these names and shapes.
- **W2 exactness: ✓.**
  - `engine.ts:25-27` is `legalMinGross × multiplier`, and the tests assert 49,545 (never 50,000).
  - A grep of the five non-test modules for `ceil|round|500` hits only comments and `LIMITS.headcountMax: 500` (`types.ts:17`).
  - Inventory of numeric literals (comments stripped): the `LIMITS` values 1/500/1/12, `1 +` (`engine.ts:54`), `0` fallbacks, `* 100` (`engine.ts:136`, `labels.ts:66`), `QUOTA_VIZ_CAP = 8` (`quota.ts:50`), the ISO regex digits and the Intl fraction digits. All are in the brief, and there is no rate literal.
  - Support is opt-in and off by default (`engine.ts:93`).
  - The homepage presets are the `preset: true` rows of the same table, sorted by multiplier (`engine.ts:141-143`).
- **Purity: ✓.**
  - The runtime import graph is `types` ← `engine` ← `labels` → `@/lib/format/money`, which is itself pure and imports only `import type { Locale }`. `@/content/collections` and `@/i18n/routing` are type-only imports and are erased.
  - Nothing imports `'use client'`, `server-only`, React, `node:*`/`fs`, `process.env`, `content/local`, `design-package`, the adapter, `next-intl` or `@/messages`. The only grep hits are two comments that name these as forbidden.
  - `src/lib/format/date.ts:1-4` imports next-intl's `createTranslator` and both message JSON files, so keeping `labels.ts`'s own local month/day helpers was correct.
  - There are two casts, both safe: `engine.ts:42` (widening to `readonly string[]` for `includes`) and `labels.ts:91` (`Object.fromEntries` → `FormattedLines<T>`).
- **D18 formatting only at the edge: ✓.** Every lira line in `labels.ts:94-114` goes through `formatTRY`, and the shares go through `formatPercent(·, locale, 0)`. The engine returns unrounded values: 38,944.025 renders as `38.944 ₺` / `₺38,944` (`labels.test.ts:68-103`).
- **Fixtures = real rows: ✓.**
  - `fixture-vs-bundle.mts` confirms that `collections.rateConfig[0]` and the 15 ordered `calculatorRoles` rows in **both** `bundle.tr.json` and `bundle.en.json` are `isDeepStrictEqual` to `RATE`/`ROLES`, with no extra keys.
  - The fixture's `RATE` numbers, `ROLE_TABLE` and `INDUSTRY_LABEL` are textually identical to `scripts/import-design-package.ts:228-300`.
  - The cross-check test reads the bundle with `readFileSync` (`copy-deltas.test.ts:201`). The ESLint exemption list (`eslint.config.mjs:37-42`) is unchanged: exactly the four chrome tests.
- **Worked figures: ✓, independent of the implementation.** I re-derived every literal the tests assert by hand: 49,545; 10,776.0375; 60,321.0375; 723,852.45; 751,852.45; 62,654.370833; 38,944.025; 584,160.375; 82.135524 %; 80,428.05; 6,193.125 / 7,844.625; 391,926.225; 69,987.704167; 1,628,668.0125; 63,432.148611; `7.429.925 ₺` (from 7,429,924.5); `₺41,277`. The tests assert independently computed numbers, not echoes of the code.
- **Quota: ✓** (`quota.ts:27-47`, `61-77`).

  | Case | Input (staff, foreign) | Result |
  | --- | --- | --- |
  | 0 foreign | (25, 0) | allowed, `maxForeign` 5, `shortfall` 0, `overBy` 0 |
  | exactly at the ratio | (25, 5) | allowed, `shortfall` 0, `overBy` 0 |
  | one short | (24, 5) | not allowed, `maxForeign` 4, `shortfall` 1, `overBy` 1 |
  | complete groups only | (9, 1) / (9, 2) | 1 place; (9, 2) gives `shortfall` 1, `overBy` 1 |

  - For integer counts, `allowed` holds exactly when `shortfall = 0`.
  - `quotaBlocks(24)` gives 4 full blocks, remainder 4, next place in 1. `quotaBlocks(0)` gives next place in 5.
  - A zero, non-integer or NaN ratio throws `CalculatorError`.
- **Labels (D17): ✓, with M2 and M3.**
  - `effectiveFromLabel`, `updatedAtLabel` and `effectiveYear` give identical results under TZ=UTC, Europe/Istanbul, America/Los_Angeles, Pacific/Kiritimati (+14) and Pacific/Pago_Pago (−11): "Ocak 2026", "January 2026", "15 Ocak 2026", "15 January 2026", "31 December 2026", 2027.
  - `isReviewDue` flips at exactly 2026-12-20T00:00:00Z. That is 03:00 in Istanbul; the brief specifies UTC.
  - `sgkRateLabel` gives `%21,75`, `21.75%`, `18.75%` and `%23,75`. `multiplierLabel` gives `1,5×`, `1.5×`, `1×` and `2×`.
- **Docs (W45): ✓.**
  - Only ARCHITECTURE § Calculator engine changed: one paragraph, 2 +/- lines. It is anchored on Task 1's paragraph and fully covers it; no later task had added a sentence to this section.
  - The brief lists no CONTENT-MODEL or PRD edit, and `CONTENT-MODEL.md:117` already describes the rows ("Task 9's engine is its only arithmetic consumer").
  - The post-range controller commits touched ARCHITECTURE lines 257 and 334 only.
  - `git diff --stat 1a5b1f8..54695cd -- docs/superpowers docs/WEBSITE-HANDOFF.md contract src/content src/messages src/lib/format src/analytics package.json package-lock.json CLAUDE.md` is empty.
- **Commits: ✓.** There is one commit per cycle, and each commit's tests import only modules present at that commit:
  - 40e3c51: types, engine, fixtures, engine.test;
  - 13aa281: quota;
  - 8c4502a: labels;
  - 54695cd: index, copy-deltas, ARCHITECTURE.

## Findings

### Critical

None.

### Important

**I1. `COPY_DELTAS`' support-default rows predate W58. `home.299` is logged as an agreeing pin at the opt-in figure, and the `home.074 / home.082` note prescribes what W58 rules out.**
- **Where:** `src/lib/calculator/__tests__/copy-deltas.test.ts:78-85` (home.299: `model: generalWithSupport.perWorker.monthly.total`, `agrees: true`) and `:86-93` (note: "T1 wires a toggle or rewrites home.074 via sys.home.calc.*"). The resulting count is asserted at `:186-193` and restated in `docs/ARCHITECTURE.md:332` ("four places … twelve agreeing pins").
- **Why it is wrong — home.299:**
  - The string reads "At 2026 minimum wage roughly ₺38,944 per worker per month including SGK and the standard discount…" (TR: "SGK ve standart indirim dahil … yaklaşık 38.944 ₺").
  - The "standard discount" is the 2-point SGK discount (calc.040). The model prices that at ₺40,214.025 with its default settings.
  - 38,944 is only reachable by also deducting the ₺1,270 minimum-wage support, which the sentence never mentions.
  - W58 (`rulings:79`) names home.074/082/**299** together: legal-flagged, rendered as authored, and "listed for the WP-C legal review with the model figure beside them" (₺40,214). It also accepts that "one FAQ sentence disagrees with the card". The table instead reports home.299 as agreeing.
- **Why it is wrong — the home.074/082 note:**
  - The note offers "a toggle" or a rewrite of a legal-flagged string.
  - W58 rules home.074 verbatim, plus a `sys.home.calc.*` line saying support is shown separately.
  - WP2b T1-fixed does exactly what W58 says: delta (5) at `task-1.md:9`; `supportValue: sys('home.calc.supportSeparate')` at `:2095-2116`; `supportOptIn: false` at `:1627`; its test pins ₺40,214 / ₺603,210 at `:1440`.
- **Scenario:** a reader of `COPY_DELTAS` drops home.299 as "agrees", or follows the note and rewrites a legal-flagged string. That reader could be the WP-C legal-review list, or a page author (per the brief, T1 and T4 "author sys.* from the model column").
- **How confirmed:**
  - W58's text;
  - the bundle strings for home.299/074/082 (catalogue `legal: true`, `edits: []`, so they equal the package text);
  - both figures computed with the engine: 38,944.025 with the opt-in, 40,214.025 by default.
- **Fix:**
  - home.299: set `model: general.perWorker.monthly.total` and `agrees: false`. Note: "legal-flagged, rendered verbatim (W58); its 38,944 embeds the opt-in ₺1,270 support; listed for the WP-C legal review beside the model's 40,214".
  - Rewrite the 074/082 note in W58's terms: rendered verbatim; T1 states support separately via `sys.home.calc.supportSeparate`; WP-C lists it with the model figure.
  - Update the asserted id list and the counts (⚠️ 2).

**I2. The salary-guide employer-cost row is a false pin: it prices the welder card at a gross salary the engine never allows for a welder.**
- **Where:** `copy-deltas.test.ts:142-149`: `model: employerMonthlyCost(45000, RATE, 'other')`, `agrees: true`, note "a delta only when the tier is not 'other'".
- **Why it is wrong:**
  - `salaryRange(welder).min` is 49,545 (`engine.ts:30-38`).
  - The Cost Calculator page's guide (WP2b T3 `buildGuideRows`, `task-3.md:1182-1191`; test at `:548-556`) prints welder `₺49,545 – ₺70,000` and employer cost `₺60,321 – ₺85,225` at the 'other' tier.
  - The design shows ₺54,788 (band low 45,000, per this row). If its guide low is instead the 50,000 legalMin, as the legalMin row's `where` claims (`:55-56`, "slider minimum / salary-guide low / pass-check salary"), it shows ₺60,875.
  - Either way the page differs from the design at the default tier, and the two rows contradict each other about the design's guide low.
  - The same applies to cnc and electrician (design 54,787.50 → page 60,321.04) and plumber (51,135.00 → 60,321.04).
- **Scenario:** T3's side-by-side review (D27) sees the guide's employer-cost lows differ from the design. There is no `COPY_DELTAS` row and no named delta for it: T3's list at `task-3.md:29-36` has W59's tier change and the 49,545 slider minimum, not the guide's floor correction. The reviewer treats it as a regression, or "fixes" it back toward 54,788.
- **How confirmed:** the per-role table in scratch `floors.mts`, comparing the design figure at band low, the design figure at legalMin, and the page figure at the model minimum.
- **Fix:**
  - Set `model: employerMonthlyCost(salaryRange(role('welder'), RATE).min, RATE, 'other')` (60,321.04) and `agrees: false`. Note: "W2 floor correction (+ W59: follows the chosen tier)".
  - Make rows 2 and 13 agree on what the design's guide low is, against dc.html:2588 and :2699 (outside my read allowance).

### Minor

**M1. Exact half-lira values can round down under floating-point noise, so a displayed line is ₺1 low and the breakdown no longer sums to the total.**
- **Where:** `labels.ts:88-91` (`lira`) → `money.ts:11` (`Math.round`).
- **Example:** welder, gross 56,212, tier `none`, 330 workers. The exact monthly SGK is 4,405,615.5, but the float is 4,405,615.499999999. The page shows `₺18,549,960 + ₺4,405,615`, which sums to 22,955,575, while the total shows `₺22,955,576`.
- **Frequency:**
  - On the design's 500-lira salary grid, with the grid anchored at 500 or at the exact minimum, over every role × tier × housing/support/flight × headcount 1–500 × months 1–12 (261.6 M checks, 36.6 M exact halves): **0** cases. The teaser domain is covered by this sweep too.
  - With typed integer salaries, one random run of 116 M checks found 7,519 of 7.47 M exact halves rounded down: 7,496 on monthly SGK, 20 on payroll, 3 on total. These salaries are reachable through T3's `est_salary` parse (`task-3.md:914-916`).
- **Fix:** before `formatTRY`, snap the additive lines to the model's precision; the rates carry four decimals, so `Math.round(v * 1e4) / 1e4` works and I verified it gives 4,405,616. Leave the `perWorkerPerMonth` quotient as is. Alternatively, record this as a known ₺1 limitation.

**M2. Calendar-invalid ISO dates roll over silently.**
- **Where:** `utcMidnight` (`labels.ts:23-27`) rejects only malformed strings and month > 12 / day > 31. The schema regex (`collections.ts:75`) accepts the same dates.
- **What happens:**
  - `effectiveFrom: '2026-02-30'` → "March 2026";
  - `updatedAt: '2026-02-29'` → "1 March 2026";
  - `'2026-04-31'` → "1 May 2026";
  - `isReviewDue` shifts by the same amount.
- An Operations typo therefore prints a wrong dated badge instead of failing, which goes against D17's "never degrade silently".
- **Fix:** round-trip the parse (`date.toISOString().slice(0, 10) === iso`, else throw `CalculatorError`) and add a test row.

**M3. The "timezone-proof" test proves nothing on the machines that run it.**
- **Where:** `labels.test.ts:28`. It runs only in the host timezone: Asia/Karachi (+05:00) here, UTC on Vercel. `vitest.config.mts` pins environment variables but not `TZ`.
- A regression to local-time parsing or formatting only shows in negative-offset zones, so it would pass both places. I confirmed the current code is timezone-proof separately (the five-zone matrix above).
- **Fix:** run the date cases under a negative-offset zone, for example `process.env.TZ = 'America/Los_Angeles'` in a `beforeAll`/`afterAll` around that `describe` (Node applies a runtime `TZ` change).

**M4. `COPY_DELTAS` is typed data, but it lives in a module with side effects.**
- **Where:** the export is at `copy-deltas.test.ts:44`. The same module runs `describe` blocks at `:176` and `:196`, which read the bundle at collection time (`:201`), and `Row` is not exported (`:25`).
- It is typed data, not prose ✓, but it cannot be imported by pages, scripts or a lint. Importing it from another test would re-register its suites under that file.
- This complies with W24 ("a `COPY_DELTAS` table in the test file"), and nothing consumes it today: the D17 numbers-out-of-copy lint covers metrics only (`findHardTypedMetrics` / `metric-placeholders.json`).
- **Fix, if T1/T3 or a rate lint is to import it:** split it into `__tests__/copy-deltas.ts` (the data plus an exported `Row`) and the test file.

**M5. The bundle cross-check reads only `bundle.tr.json`.**
- **Where:** `copy-deltas.test.ts:196-209`. The EN bundle's `rateConfig`/`calculatorRoles` are never asserted; both equal the fixtures today (checked by script).
- **Fix:** add one parse of `bundle.en.json` so a per-locale importer drift fails the suite.

**M6. Nothing enforces purity on `src/lib/calculator/**`.**
- The frozen engine must stay client-safe, because T1 and T3 import it from `'use client'` islands. Only review stops a future `import { formatMonth } from '@/lib/format/date'`, which would pull both message JSON files and next-intl's translator into every island, or a `server-only` import.
- **Fix:** add a guard test in the style of W125/W130 (scan non-test files for `react`, `server-only`, `node:`, `next-intl`, `@/messages`, `@/lib/format/date`, `content/local`, `design-package`), or an ESLint `no-restricted-imports` block scoped to `src/lib/calculator/**`.

**M7. Wording and precision.**
- `ARCHITECTURE.md:332` gives `salaryRange` as `{ min: max(floor, role.salaryMin), max: role.salaryMax | null }`, which omits the `max(salaryMax, min)` guard (`engine.ts:36`).
- The Produces comment and deviation 5 say `estimate` never throws on UI input. But an unknown `sgkTier`, which is UI state, throws `CalculatorError` (`engine.ts:88-89` → `:42-44`), and `engine.test.ts:57` itself calls it "stale UI state". T3 validates the tier before calling, so this is contract wording only (`task-3.md:923`).
- `copy-deltas.test.ts:2` and `:148` (and the brief) number the Cost Calculator "T4". In the final WP2b numbering it is T3; T2 is Hire Workers and T4 is Work Permit.

**M8. The `home.086` row compares only the sum.**
- **Where:** `copy-deltas.test.ts:102-109`. The row checks 28,000, but the legal-flagged string types two figures (₺16,000 permit, ₺12,000 flight), so a swap or a compensating edit would still "agree".
- **Fix:** split it into a `permitFeeTRY` row and a `flightTRY` row.

**M9. Input-guard nits (no fix required).**
- `headcount: ±Infinity` (and `?n=1e400`) falls back to 1 worker instead of the 500 clamp, while `months: Infinity` gives 12 (`engine.ts:19-22`).
- `quotaBlocks` does not validate `cap`: a negative cap gives `shown: -1` and `NaN` gives `shown: NaN` (`quota.ts:61-76`).
- `estimate` clamps a *legal* salary up to the design's band minimum (machine: 35,000 becomes 38,000 although the floor is 33,030). This is by design (deviation 2), but the pass check must compare against `salaryFloor`, never against `estimate().input.grossSalary`.

## ⚠️ Design items needing a controller ruling

1. **1× roles whose band starts at the minimum wage: is there a fifth delta, 33,500 vs 33,030?**
   - The design formula, as W2, `engine.ts:3` and `page-hiring-cost-calculator.md:10` quote it, is `legalMin = max(role.min, ceil(mult × MINWAGE / 500) × 500)` at dc.html:2588.
   - For labourer, housekeeping, steward and greenhouse that gives 33,500 for the slider minimum and pass-check salary (and the guide low, if the guide is legalMin-based), against the model's 33,030: Δ 470, employer cost 40,786.25 vs 40,214.03.
   - The legalMin row lists only the four 1.5× roles, and T3's named-delta list (`task-3.md:36`) mentions only the 49,545 case.
   - I could not confirm this: the design HTML is outside my read allowance. If dc.html:2588 has no special case for 1×, this is a **missing delta** (Important under the rubric) for the same fix round, and T3's named-delta list should gain it.
2. **The counts are brief-frozen.** Fixing I1 and I2 (and ⚠️ 1) changes "4 deltas / 12 pins". Those counts are asserted at `copy-deltas.test.ts:186-193`, stated verbatim in `ARCHITECTURE.md:332`, and recorded in the ledger sentence. They would become 6/10, or 7/10 with a 1× row. Please approve the new counts and the reworded ARCHITECTURE sentence, and say whether produces-final § Task 9 needs a note. Also rule whether `COPY_DELTAS` doubles as the W58 "WP-C legal review" list or whether that list lives elsewhere; if it doubles, I1's home.299 row becomes that list's entry.

## The implementer's deviations and concerns — verdicts

**The brief's eight declared Produces deviations all landed exactly as declared** (byte-identical to the brief, and type-checked above):
1. `rateConfig` / `quotaRatio` passed as arguments — **accept.** This is Task 1's no-rate-literal rule, and T1 and T3 consume this shape.
2. `salaryFloor` is the legal floor only; `salaryRange` is the band-aware composite — **accept.** Semantic note (M9): `estimate` clamps to `salaryRange`, which can sit above the legal floor, so pass checks use `salaryFloor`, as the brief says.
3. `overBy`, `quotaBlocks`, `turkishStaffRequired` — **accept.** The boundary cases above hold.
4. Label extras, and tr-TR / en-GB dates with local helpers — **accept.** `date.ts` imports both message JSON files and next-intl, so importing it would break client safety.
5. Clamping instead of throwing — **accept**, with the M7 wording caveat (an unknown tier still throws).
6. Support as a positive, subtracted line — **accept.**
7. `COPY_DELTAS` in its own test file — **accept** (W24); the content is flagged in I1, I2 and M4.
8. Extras (`LIMITS`, `SGK_TIERS`, `employerMonthlyCost`, `findRole`, `QUOTA_VIZ_CAP`, `Formatted*`, fixtures) — **accept.**

**The implementer's own deviations:** "none beyond the eight" — **confirmed** (10/10 files byte-identical).

**Process notes:**
- The commit trailers read `Co-Authored-By: Claude Sonnet 5` rather than the brief's example trailers — **accept.** The environment's attribution rule governs, and the brief's trailers were only examples.
- The ledger line `progress.md:97` ("Task 9: complete — HEAD 54695cd") was written before this review. Amend it to match the review outcome.

**Concerns:**
1. *"No reviewer dispatched"* — **accept, resolved** by this review.
2. *"Engine not yet mounted"* — **accept by design.** This review reduces the transferred risk: the purity audit, the 21-name runtime barrel check under Node, the Produces signatures type-checked against the real modules, and the WP2b T1/T3 Consumes lists matched against the shipped API. The remaining WP2b-side risks are parked as P1 and P2.
3. *"home.074/082/299 disagree with the opt-in-off default"* — **accept; no new ruling is needed for T1.** W58 already rules T1's behaviour (support off, the three strings verbatim, `sys.home.calc.*` saying support is shown separately), and WP2b T1-fixed implements it. `COPY_DELTAS` is the right place to *record* the figures (W24), but its two support-default rows must be brought in line with W58: see I1, and ⚠️ 2 for whether the table also serves as the WP-C list.

## COPY_DELTAS check

Shipped rows. Figures from the design strings were read from the bundle; the catalogue shows `edits: []`, so they equal the package text. The dc.html rows were checked arithmetically against the documented formula, not against the HTML.

| # | id | design | model (as shipped) | shipped | verdict |
| --- | --- | ---: | ---: | :---: | --- |
| 1 | calc.557 | 49,545 | 49,545 | pin | ✓ ("₺49,545 gross (1.5× the minimum wage)") |
| 2 | dc.html:2588 legalMin (welder/cnc/electrician/plumber) | 50,000 | 49,545 | delta | ✓ ceil(49,545/500)×500; but `where` says "salary-guide low", which conflicts with row 13 (I2); omits the 1× roles (⚠️ 1) |
| 3 | dc.html:2588 legalMin, cook | 50,000 | 50,000 | pin | ✓ |
| 4 | calc.079 | 40,214 | 40,214.025 | pin | ✓ ("Employer cost at that level: ₺40,214") |
| 5 | home.299 | 38,944 | 38,944.025 (opt-in) | pin | ✗ **I1**: W58's model figure is 40,214.025 (default), so this is a delta |
| 6 | home.074 / home.082 | 38,944 | 40,214.025 | delta | figures ✓; note ✗ (I1) |
| 7 | home.081 | 21.75 | 21.75 | pin | ✓ |
| 8 | home.086 | 28,000 | 28,000 | pin | ✓ as a sum; split it (M8) |
| 9 | calc.021 | 1,270 | 1,270 | pin | ✓ |
| 10 | dc.html:2646 mTotal (initial) | 60,875 | 60,321.0375 | delta | ✓ 50,000 × 1.2175 |
| 11 | dc.html:2657 yearTotal (initial) | 758,500 | 751,852.45 | delta | ✓ 12 × 60,875 + 28,000 |
| 12 | calc.560 | 12 | 12 | pin | ✓ |
| 13 | dc.html:2699 guide employer cost (welder) | 54,787.5 | 54,787.5 at a 45,000 gross | pin | ✗ **I2**: the page prints 60,321.04 |
| 14 | calc.558 | 5 | 5 | pin | ✓ |
| 15 | calc.559 | 5 | 5 | pin | ✓ |
| 16 | calc.153 | 1 | 1 | pin | ✓ |

**Missing or misstated rows:**
- home.299 against the default (I1).
- The guide's employer-cost lows: welder, cnc and electrician 54,787.50 → 60,321.04; plumber 51,135.00 → 60,321.04 (I2).
- If dc.html confirms it, the 1× minimum-wage roles' legalMin 33,500 → 33,030 for labourer, housekeeping, steward and greenhouse (⚠️ 1).
- These follow from rows 2 and 6 and need no row of their own:
  - the teaser's ×15 payroll: design 584,160.375 (support applied) vs model 603,210.375 (default);
  - the initial-render SGK line: 10,875 vs 10,776.04;
  - the per-worker-per-month figure.

**Scan for other deltas.** I scanned all 58 calc.* and home.* EN strings that type a ₺, % or × figure and found no other design-vs-model disagreement:
- The rate and fee figures agree with `RateConfig`: calc.040/081/083/086/099/337/338 (₺42.33 = 1,270/30)/360–362/411/415–417, and calc.131/134 ("about ₺28,000").
- The fines (calc.117, 407–410, 497) and the thresholds (calc.370–374, 446, 491, 523–524) are not model quantities.

## Parked (out of Task 9's scope, for the WP2a final review)

- **P1. The dated badge will not hide on time in Phase A.**
  - `isReviewDue(rateConfig)` runs at render time. In the build route table `/tr` and `/en` are SSG with no revalidate value, and in LOCAL mode there is no floor, while OPS mode gets the 900 s floor.
  - So the server-rendered badges keep showing after 2026-12-20 until the next deploy: T1's `CalculatorStrip` (`task-1.md:2102`), T3's hero (`task-3.md:227-238`) and T4's pill (`task-4.md:1355`).
  - WP2b needs a route `revalidate` floor, a client-side check, or a runbook item for the review date.
- **P2. `formatEstimate` is slow because `money.ts` builds a new formatter on every call.** One call constructs 23 `Intl.NumberFormat` objects (`money.ts:5-7`, `16-22`). Measured in Node on this Mac: `estimate` 0.24 µs; `estimate` + `formatEstimate` about 366 µs; the same 21 lira formats on one cached formatter about 6 µs. This matters for T3's slider and stepper INP on low-end phones. Cache per-locale formatters in `money.ts` (the WP1 contract module).
- **P3. `CalculatorRoleSchema.multiplier` is only `positive()`** (`collections.ts:116`). An Ops row with a multiplier below 1 would make `salaryFloor` return less than the national minimum wage, labelled as the legal floor. Tighten it to `min(1)` before Phase B rows arrive.
- **P4. An ARCHITECTURE claim overstates the D17 lint.** The last sentence of `ARCHITECTURE.md:332` (inherited from Task 1/WP1) says the lint blocks hard-typed "rate or metric" values. `findHardTypedMetrics` covers metrics only; the rates typed into calc.040/081/083/086/099/360/415–417 and home.081/086 are not linted, and several of those strings are legal-flagged. Extend the lint or correct the sentence at the Gate A docs sync.
- **P5. `date.ts` duplicates `labels.ts`'s month/day helpers** (`formatMonth`/`formatDate`), only because `date.ts` also carries the messages-dependent `formatReadMinutes`. Splitting `date.ts` into a pure module and a messages module would let the two share one implementation.
- **P6. `docs/PRD.md` has no calculator business rules:** W2's exact floor, support opt-in off by default, 5:1 counting on complete groups, and D17 badge hiding. Fold them in when T1/T3 mount the engine.
- **P7. T3's named-delta list is incomplete.** `task-3.md:29-36` should gain the guide's floor correction (I2) and, if confirmed, the 1× 33,500 (⚠️ 1), taken from the corrected `COPY_DELTAS`.
- **P8. T1's teaser assumes preset rows exist.** It reads `roles[0].row` from `presets(...)` (`task-1.md:2135`, and the island at `:1983`), so a Phase B bundle without preset rows would throw at render. Add a guard in T1.
