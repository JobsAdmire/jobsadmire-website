# Task 9 — fix round 1 re-review (`eb4449f..3d31bc5`: 0f8a064, f4e5d5c, 12f5d0b, c8332f0, 3d31bc5)

**Fix round 1 verdict:** ✅ all findings addressed. I1, I2, the 1× design item (⚠️1), the counts (⚠️2) and M1–M9 are fixed as W142–W144 rule. The implementer's design reading, which corrects the first review's I2 design figure (the guide low is the ₺50,000 `legalMin`, so ₺60,875, not ₺54,788), is confirmed in the design file. Item 7's guard is only partly complete (N1), and there are five other new Minor items; none blocks closing Task 9.

**Regressions:** none.
- **Gate green at HEAD:** typecheck, lint and format are clean; vitest gives **110 files / 682 tests** (56.7 s). That is +1 file and +15 tests over BASE's 109/667: labels +3, copy-deltas +3, purity +9.
- **Build green:** exit 0 (Turbopack, `cpus: 2`), TypeScript clean, 13/13 pages. The `CLAUDE.md` checksum is unchanged (`c8a98b50…`), and `git status` was empty before and after.
- **Frozen Produces surface unchanged.** Against the real barrel, 35 exact-type assertions pass plus a negative control (`tsc` exit 0), and a second copy with two deliberate failures exits 2, so the check is not vacuous. The barrel's runtime exports are still exactly the 21 names, and `COPY_DELTAS`/`Row` are not among them.
- **Scope:** `git diff --stat eb4449f..HEAD` touches the six allowed files only. Nothing under `docs/superpowers/` (handoff, ruling log, plans), `docs/WEBSITE-HANDOFF.md`, `.superpowers/` (produces-final, ledger), `contract/`, `src/content`, `src/messages`, `src/lib/format`, `package*.json`, `CLAUDE.md` or `design-package/`.
- **Displayed values:**
  - On the design's 500-lira grid, the W144(a) snap changes nothing: 107 M line checks, 0 changes.
  - Over 33 M random integer-salary checks it changes 8,600 displays. Every one corrects an exact half-lira that BASE rounded down, and there are 0 regressions.

**Method.**
- **Runs:** all on HEAD `3d31bc5` (clean tree), Node 25.8.2, one heavy job at a time: the gate once, the build once, then a process check.
- **Probes:** light Node scripts under `scratchpad/rereview-task9/`. Each is an esbuild bundle of the **real HEAD modules**, with `@/` resolved through the repo's tsconfig. The exceptions are the labels mutation variants (`variants/*.ts`) and the per-commit `git archive` extracts (`commits/<sha>/`), which are scratch copies; the repo was never edited.
- **Evidence files:** `rows.mts`, `snap.mts`, `tz.mts`, `purity-probe.mts`, `purity-recursive.mts`, `dates.mts`, `typecheck/` and `typecheck-neg/`, `commits/`, `gate.log`, `build.log`.
- **Design package:** the allowed locate-grep plus two windows of `Hiring Cost Calculator.dc.html`: 2578–2657 (80 lines) and 2706–2745 (40 lines). Nothing else in the package was read, and `.next/` was not opened.

## Per item (1–9)

**1. W143 — `COPY_DELTAS` is importable data ✅**
- **The module.** `src/lib/calculator/copy-deltas.ts` exports `type Row` (now with `legal: boolean`) and `const COPY_DELTAS: Row[]`. It imports only `./index` and `./__tests__/fixtures`. It has no `describe` and reads neither the bundle nor any file. Its module-level `estimate(...)` calls are pure computation.
- **Not in the barrel.** `index.ts` is unchanged. Its runtime exports are the 21 Produces names (checked under Node), and at the type level `'COPY_DELTAS' extends keyof typeof barrel` is `false`.
- **The test.** `__tests__/copy-deltas.test.ts:9` imports the module. It keeps every earlier assertion (`agrees`, the disagreeing-id list, the bundle-vs-fixtures check, the ruled figures) and adds the `legal` and count tests.
- **`legal` per row** is asserted against `src/content/local/catalogue.json`. I checked it independently:
  - All 12 package ids exist, and their flags equal the rows: calc.557 T, calc.079 F, home.299 T, home.074 T, home.082 T, home.081 T, home.086 T, calc.021 F, calc.560 F, calc.558 T, calc.559 T, calc.153 T.
  - Design-file rows are `false` by construction (W142(f): "from the catalogue").
  - See N5 for the missing existence check.
- **The implementer's concern: the data module imports `RATE`/`role` from `./__tests__/fixtures`. I recommend accepting it and keeping the fixtures where they are.**
  - **Nothing ships it.** No module outside `src/lib/calculator/` imports the calculator at all: I grepped `src/`, `scripts/`, `next.config.ts` and `src/proxy.ts`. The only importer of `copy-deltas.ts` is its test. Next bundles only modules reachable from routes, the proxy and the config, so neither the table nor the fixtures can reach the build output. That import-graph proof is sufficient while no page imports the calculator; I did not open `.next/`.
  - **The fixtures are the table's input by design.** W143 calls the table authoring-time data computed against Task 1's seeded row, and the cross-check proves both bundles still equal that row.
  - **Moving `RATE`/`ROLES` to `src/lib/calculator/fixtures.ts` would put a hard-typed rate row next to the barrel.** ARCHITECTURE says `src/lib/calculator/` has "no rate literal", and a page could then import `RATE` instead of `getRateConfig(bundle)` (D17). `__tests__/` sends the right signal.
  - **What is missing is coverage, not a move.** `__tests__/fixtures.ts` is a "non-test file under `src/lib/calculator/`" (W144(c)'s own words) and is imported at module load by a scanned file, so the guard should scan it (N1). It is clean today. No ruling is needed.

**2. W142(a)(b) — I1 ✅**
- **`home.299`** (`copy-deltas.ts:92-100`):
  - model `general.perWorker.monthly.total` = **40,214.025** (engine; by hand 33,030 × 1.2175);
  - design 38,944 (EN "roughly ₺38,944 per worker per month including SGK and the standard discount", TR "yaklaşık 38.944 ₺");
  - `agrees: false`, `legal: true`, and the note follows W142(a)/W58.
- **`home.074 / home.082`** (`:101-109`): model 40,214.025, `agrees: false`, `legal: true` (both ids). The note is the brief's text verbatim: "rendered verbatim; T1 states support separately via sys.home.calc.supportSeparate; WP-C lists both with the model figure ₺40,214". The toggle/rewrite suggestion is gone.
- **Tests:** the id list and counts are updated. At `f4e5d5c` the data's disagreeing list equals the test's (per-commit check below). No RED was captured for this data correction. That is acceptable, because the `agrees` test fails on any inconsistent flag.

**3. W142(c) — I2 ✅ (design reading confirmed)**
- **Row 15** (`…dc.html:2718 (salary guide employer cost)`): design **60,875**, model `employerMonthlyCost(salaryRange(welder).min, RATE, 'other')` = **60,321.0375**, `agrees: false`. The note gives the W2 floor correction and W59's tier.
- **Verified in the design file** (§ Design-file verification):
  - The guide's `lo` (2718) is the same ceiling formula as `legalMin` (2587), and `employer` (2726) is `fmt(lo × 1.2175)`.
  - Welder, cnc, electrician and plumber therefore all have `lo` = 50,000 and an employer-cost low of **₺60,875**.
  - The first review's 54,787.50 (51,135 for plumber) assumed the band low and was wrong. The conclusion (a delta, not a pin) stands.
- **The rows about the design's guide low now agree with each other and with the file.** Row 2 (`where` "slider minimum / salary-guide low / pass-check salary", design 50,000) and row 15 (60,875 = 50,000 × 1.2175) describe the same guide low.
- **Citation:** `2699 → 2718` is corrected. Line 2699 is outside my windows (the implementer reports it as `isSeasonal: months < 12,`); 2718 is verified. Other inherited citations are still wrong (N3).

**4. W142(d)(e) — the 1× roles ✅ (text residual, N2)**
- **The formula, verified at 2587:** `const legalMin = Math.max(role.min, Math.ceil(role.mult * this.MINWAGE / 500) * 500);`.
  - `role` (2586) is whichever row is selected (`roles.find((r) => r.v === s.role) || roles[0]`).
  - Nothing in 2578–2657 branches on `mult`, and the guide repeats the formula unconditionally per row at 2718.
  - `MINWAGE = 33030` (1730).
- **Row 4:** design **33,500**, model `salaryRange(labourer).min` = **33,030**, `agrees: false`.
  - Employer cost is **40,786.25** in the design (33,500 × 1.2175) against **40,214.025** in the model (engine `employerMonthlyCost(33030)`, and by hand).
  - The same holds for housekeeping, steward and greenhouse (band minimum 33,030, multiplier 1).
  - The other 1× roles agree on both sides: machine 38,000, textile 36,000, waiter 35,000.
- **Count (W142(e)):** 18 rows = **7 deltas + 11 pins**. The ruling expected "7/10 with (d)"; W144(e)'s `home.086` split adds the eleventh pin. The test and ARCHITECTURE are updated; the ledger is controller-owned (parked).
- **Residual:** row 4's `where` reads "slider minimum / pass-check salary" and omits the salary-guide low. The brief made that "(+ guide low if the guide is legalMin-based)", which is exactly what item 3 proved (N2).

**5. W144(a) — M1 ✅**
- **The snap.** `labels.ts:97` defines `snap4 = Math.round(v × 1e4) / 1e4`. It is applied inside `lira()` (`:101`: the per-worker monthly and one-off lines, monthly, one-off) and to the contract's payroll, one-off and total (`:115-117`). `perWorkerPerMonth` (`:119`) and `grossSalary` (`:107`) stay unsnapped, as ruled.
- **The ruled case, through the real formatter:** welder, gross 56,212, 330 workers, tier `none`.
  - The raw monthly SGK is 4,405,615.499999999, which BASE's `Math.round` showed as 4,405,615.
  - HEAD shows gross `₺18,549,960`, SGK **`₺4,405,616`** and total **`₺22,955,576`**, and the lines sum to the total.
  - `perWorkerPerMonth` (raw 71,895.683) shows `₺71,896` through the unsnapped path.
- **No other displayed value changed.**
  - **Method:** I compared BASE's display, `Math.round(v)` (`formatTRY` is `Intl` of `Math.round`, unchanged since Task 5), with HEAD's `Math.round(snap4(v))`. Both were checked against exact half-up rounding computed in integers, since every additive line is an integer count of 1e-4 lira.
  - **Lines checked:** per-worker gross/SGK/total, monthly gross/SGK/housing/support/total, the one-off total, payroll and the contract total.

  | Domain | Line checks | Exact halves | BASE wrong | HEAD wrong | Changed | Regressions |
  | --- | ---: | ---: | ---: | ---: | ---: | ---: |
  | Design 500-lira grid (anchored at the band min and at the model min): 12 roles × 3 tiers × housing × support × headcount 1–500 × months {6, 9, 12} | 107,316,000 | 9,561,760 | 0 | 0 | 0 | 0 |
  | Random integer salaries within each role's range (presets up to 150,000), random tier, toggles, headcount and months 1–12; 3 M estimates | 33,000,000 | 1,090,318 | 8,600 (all monthly SGK) | 0 | 8,600 | 0 |
- **The snap's premise holds wherever the gross is an integer.** Every floor is an integer (33,030 × {1, 1.5, 2}), and so are the bands. T3's `sanitizeInputs` rounds `est_salary` (`Math.round`, `wp2b/fixed/task-3.md` ~905), and its months are {6, 9, 12}. A parked note covers future rates.

**6. W144(b) — M2 ✅**
- **`utcMidnight`** (`labels.ts:23-32`): the NaN check short-circuits before `toISOString()`, the round-trip comparison follows, and a failure throws `CalculatorError("not a valid calendar date: …")`. No test asserts the old message text.
- **Covering tests:**
  - `2026-02-30`, `2026-02-29` and `2026-04-31` throw.
  - `2028-02-29` gives "February 2028".
  - `isReviewDue` with `reviewDueAt: '2026-02-30'` throws.
  - `effectiveFromLabel`, `updatedAtLabel`, `effectiveYear` and `isReviewDue` all parse through `utcMidnight` (`labels.ts:39, 47, 61, 66`).
- **Probe (1900–2100, months 00–13, days 00–32, under Los Angeles and Kiritimati):**
  - **146,828** valid dates never throw and always label correctly.
  - **38,896** invalid ones all throw `CalculatorError`.
  - 2000-02-29 is valid; 1900-02-29 and 2100-02-29 throw.

**7. W144(c) — M6 ⚠️ (the guard is in place, with three coverage gaps: N1)**
- **What landed.** `__tests__/purity.test.ts` has a pure `findImpureImports(file, source)` checker covering the eight ruled patterns.
  - The fixture RED case gives 8 hits and does not flag `zod`; a clean case gives none.
  - Over the real tree, an exact file list plus `it.each` covers the six top-level files, all clean. `copy-deltas.ts` is scanned.
- **Does any runtime file live deeper?** No. The only subfolder is `__tests__/`, which holds the five specs and `fixtures.ts`.
- **Gaps**, found with the guard's own regex extracted verbatim:
  - **Re-exports are not flagged:** `export { formatMonth } from '@/lib/format/date'`, `export * from 'server-only'`, `export type … from '@/messages/…'` and multi-line `export { … } from 'next-intl'`.
    - `index.ts` consists only of `export … from` statements, so the barrel — the likeliest place for a convenience re-export — is unguarded for six of the eight patterns.
    - ESLint's `no-restricted-imports` still covers `content/local` and `design-package`, re-exports included.
  - **`__tests__/fixtures.ts` is not scanned**, although `copy-deltas.ts` imports it at module load. `readdirSync` is not recursive either, so a future runtime subfolder would be skipped silently; the exact file list catches new top-level files only.
  - **Bare `fs`/`path` are not flagged.** The label says "a Node builtin", but the matcher checks only `node:`.
  - The guard does flag `node:path`, dynamic `import()`, side-effect imports, multi-line imports and `import type … from 'react'` (a conservative false positive).
- **Should `fixtures.ts` be covered?** Yes, within W144(c)'s own wording. A recursive scan of the seven non-`.test.ts` files is clean today (checked), so no ruling is needed.

**8. W144(d)(e) — M3, M5, M8 ✅ (N4 residual)**
- **The TZ pin.** `beforeAll` sets `process.env.TZ = 'America/Los_Angeles'`, and `afterAll` restores it (or deletes it when it was unset). The config sets no `pool`, so vitest 4.1.11 runs `forks`, where a runtime `TZ` assignment takes effect as in plain Node 25. My probes set `TZ` at runtime exactly as the test does.
- **Mutation check** (scratch copies of `labels.ts`, repo untouched):
  - Dropping `timeZone: 'UTC'` from both formatters makes the pinned tests fail under Los Angeles: "December 2025", "Aralık 2025", "14 January 2026", "February 2026", "30 December 2026".
  - The same mutation passes under UTC, Karachi and Kiritimati.
  - So the implementer's claim is reproduced, and the pin makes a formatter regression fail on every host.
- **But see N4.** A local-*parse* regression (dropping the `Z`) passes every pinned label test. It fails only `isReviewDue`'s 00:00 UTC boundary, which is outside the pin. The comment at `labels.test.ts:16-19` says the reverse.
- **M5:** `bundle.en.json` is parsed through `BundleSchema`, and its `rateConfig` and `calculatorRoles` equal the fixtures.
- **M8:** `home.086 (permitFeeTRY)` 16,000 and `home.086 (flightTRY)` 12,000 are both pins, both `legal: true`, modelled by `perWorker.oneOff.permitFee` / `.flight`. The bundle reads EN "permit ₺16,000 + flight ₺12,000", TR "izin 16.000 ₺ + uçuş 12.000 ₺".

**9. W144(f) — M7 wording and counts ✅ (N6 residual)**
- **`salaryRange`** now reads `{ min: max(floor, role.salaryMin ?? floor), max: role.salaryMax === null ? null : max(role.salaryMax, min) }`, identical to `engine.ts:35-36`, and the guard is explained.
- **"`estimate` throws `CalculatorError` only when `rateConfig.sgkRates` has no entry for the requested `sgkTier` … callers validate the tier first":**
  - The code checks `SGK_TIERS` (`engine.ts:42`), while `RateConfigSchema.sgkRates` is a strict object with exactly those three keys (`collections.ts:101-105`). The two readings are therefore equivalent for any contract-valid row.
  - `sgkRate` is the only throw inside `estimate`. ✓
- **T3 numbering:** the doc says "Homepage (T1) and Cost Calculator (T3)", the `copy-deltas.ts` header and row 15 say T3, and no "T4" is left in `src/lib/calculator/`. The BASE doc never had one.
- **Counts and location:** "18 rows: 7 places … plus 11 agreeing pins", with the seven listed correctly; the table is "importable data (`src/lib/calculator/copy-deltas.ts`, W143)" and "doubles as the WP-C legal-review list (W142(f))".
- **M9:** "the pass check compares against `salaryFloor`, never `estimate().input.grossSalary`" sits right after `salaryFloor`.
- **Residual (N6):** the paragraph still says "`formatTRY` rounds once at the edge" and mentions neither this round's snap nor its date throw. There are also wording nits.

**Per-commit consistency.**
- **Method:** each of the five commits was extracted with `git archive`, bundled, and its live disagreeing-id list compared with that commit's test expectation.
- **Result:** they are equal at every commit (4 → 5 → 6 → 7 → 7 ids), and no row's `agrees` flag disagrees with `|model − design| < 0.5` at any commit.
- **Doc timing:** the ARCHITECTURE count sentence was stale between `f4e5d5c` and `c8332f0`. The brief put the doc into item 9, so that is not a finding.

## Design-file verification

**Locate-grep hits** (`grep -n 'legalMin\|Math.ceil\|MINWAGE'`):
- 1730 `MINWAGE = 33030;`
- 1885, 1894 and 1899–1900: the pass check. `ckSalB(roleName, fmt(legalMin), mxStr)` means the pass-check salary is `legalMin`.
- 2587 and 2588.
- 2661 `salaryMin: legalMin,` (the slider minimum) and 2664.
- 2666 `thresholdNote: G.threshold(this.fmt(role.mult * this.MINWAGE), …)`: the exact 49,545 that calc.557 prints.
- 2714, 2718, 2739 and 2771.

**Quoted** (numbered lines inside the two windows):

```
2586:     const role = roles.find((r) => r.v === s.role) || roles[0];
2587:     const legalMin = Math.max(role.min, Math.ceil(role.mult * this.MINWAGE / 500) * 500);
2588:     const salary = s.salary === null ? legalMin : Math.min(Math.max(s.salary, legalMin), role.max);
2598:     const mTotal = mSalary + mSgk + mHousing - mSupport;
2603:     const yearTotal = mTotal * months + oTotal;
2646:       headPlusStyle: "width:38px; height:38px; border-radius:10px; …
2657:         onPick: () => { this.setState({ headcount: n }); this.track_("calc_headcount", { n: n }); }
2717:       salaryRows: roles.filter((r) => s.industry === "all" || r.industry === s.industry).map((r) => {
2718:         const lo = Math.max(r.min, Math.ceil(r.mult * this.MINWAGE / 500) * 500);
2725:           range: this.fmt(lo) + " – " + this.fmt(r.max),
2726:           employer: this.fmt(lo * 1.2175) + " – " + this.fmt(r.max * 1.2175),
```

**Readings:**
- **No 1× special case:** 2587 runs for the selected role, nothing in 2578–2657 branches on `mult`, and 2718 applies the same formula to every guide row.
- **The guide low is `legalMin`, not the band low.** The first review's I2 design figure (₺54,788) and W142(c)'s parenthetical "(₺45,000 → ₺54,788)" are wrong; the implementer's reading is right.
- **Rows 12 and 13 cite the wrong lines:** `mTotal` and `yearTotal` are computed at 2598 and 2603, while the rows cite 2646 and 2657 (N3).
- **Sources for the band data:** the roles table the implementer cites (lines 1835 and 1845) is outside my read allowance. Bands therefore come from the fixtures: Task 1's transcription, proven equal to both bundles by the green cross-check and to the importer by the first review.

**Guide lows and employer costs, per role** (design = the formulas at 2718/2726 at the fixed 1.2175; model = `salaryRange(role).min` and `employerMonthlyCost(min, RATE, 'other')`; HEAD engine, confirmed by hand):

| Role | Mult | Band | Design `lo` | Design employer low | Model min | Model employer low | Result |
| --- | ---: | --- | ---: | ---: | ---: | ---: | --- |
| welder | 1.5 | 45,000–70,000 | 50,000 | 60,875 (₺60,875) | 49,545 | 60,321.0375 (₺60,321) | delta |
| cnc | 1.5 | 45,000–65,000 | 50,000 | 60,875 | 49,545 | 60,321.0375 | delta |
| electrician | 1.5 | 45,000–62,000 | 50,000 | 60,875 | 49,545 | 60,321.0375 | delta |
| plumber | 1.5 | 42,000–58,000 | 50,000 | 60,875 | 49,545 | 60,321.0375 | delta |
| cook | 1.5 | 50,000–78,000 | 50,000 | 60,875 | 50,000 | 60,875 | agree |
| labourer | 1 | 33,030–44,000 | 33,500 | 40,786.25 (₺40,786) | 33,030 | 40,214.025 (₺40,214) | delta |
| housekeeping | 1 | 33,030–44,000 | 33,500 | 40,786.25 | 33,030 | 40,214.025 | delta |
| steward | 1 | 33,030–45,000 | 33,500 | 40,786.25 | 33,030 | 40,214.025 | delta |
| greenhouse | 1 | 33,030–42,000 | 33,500 | 40,786.25 | 33,030 | 40,214.025 | delta |
| machine | 1 | 38,000–52,000 | 38,000 | 46,265 | 38,000 | 46,265 | agree |
| textile | 1 | 36,000–50,000 | 36,000 | 43,830 | 36,000 | 43,830 | agree |
| waiter | 1 | 35,000–48,000 | 35,000 | 42,612.5 | 35,000 | 42,612.5 | agree |

**The employer-cost figures in question:**
- **The four 1.5× cards** (welder, cnc, electrician, plumber): ₺60,875 in the design, not 54,787.50 / 51,135, against ₺60,321.04 in the model.
- **The four 1× cards:** ₺40,786.25 in the design against ₺40,214.03 in the model.
- The guide's high end agrees at the `other` tier (`r.max × 1.2175` on both sides).

## COPY_DELTAS as shipped — row-by-row check

**Sources:** the model figures come from the live `COPY_DELTAS` export (an esbuild bundle of HEAD's real modules) and were re-derived by hand from `RATE`. The design figures come from the bundle strings (EN/TR) or from the design formulas above.

**Final count:** **18 rows = 7 deltas + 11 pins**, with `legal: true` on 9 rows. Recomputing `agrees` as `|model − design| < 0.5` matches every row.

| # | id | Design (source) | Model | Agrees | Legal | Verdict |
| --- | --- | --- | ---: | :---: | :---: | --- |
| 1 | calc.557 | 49,545 (EN "₺49,545 gross (1.5× the minimum wage)") | 49,545 `salaryFloor(welder)` | ✅ | T | ✓ |
| 2 | dc.html:2588 (legalMin), 1.5× roles | 50,000 (2587: max(45,000, 50,000)) | 49,545 | ❌ | F | ✓ figures; the formula is on 2587 (N3) |
| 3 | dc.html:2588 (legalMin, cook) | 50,000 (2587: max(50,000, 50,000)) | 50,000 | ✅ | F | ✓; cite 2587 (N3) |
| 4 | dc.html:2587 (1× roles) | 33,500 (2587: max(33,030, 33,500)) | 33,030 | ❌ | F | ✓ figures; `where` omits the guide low (N2) |
| 5 | calc.079 | 40,214 (EN "Employer cost at that level: ₺40,214") | 40,214.025 | ✅ | F | ✓ |
| 6 | home.299 | 38,944 (EN "roughly ₺38,944 …") | 40,214.025 | ❌ | T | ✓ I1 fixed |
| 7 | home.074 / home.082 | 38,944 (the design teaser's default, support applied; the strings carry no figure) | 40,214.025 | ❌ | T | ✓ note per W58 |
| 8 | home.081 | 21.75 ("SGK employer share · 21.75%") | 21.75 | ✅ | T | ✓ |
| 9 | home.086 (permitFeeTRY) | 16,000 ("permit ₺16,000") | 16,000 | ✅ | T | ✓ M8 |
| 10 | home.086 (flightTRY) | 12,000 ("flight ₺12,000") | 12,000 | ✅ | T | ✓ M8 |
| 11 | calc.021 | 1,270 ("(₺1,270 / worker / month …)") | 1,270 | ✅ | F | ✓ |
| 12 | dc.html:2646 (mTotal, initial) | 60,875 (2598: 50,000 × 1.2175 × 1) | 60,321.0375 | ❌ | F | ✓ figures; `mTotal` is at 2598 (N3) |
| 13 | dc.html:2657 (yearTotal, initial) | 758,500 (2603: 12 × 60,875 + 28,000) | 751,852.45 | ❌ | F | ✓ figures; `yearTotal` is at 2603 (N3) |
| 14 | calc.560 | 12 ("12 months of payroll + one-off costs") | 12 | ✅ | F | ✓ |
| 15 | dc.html:2718 (guide employer cost) | 60,875 (2726: fmt(50,000 × 1.2175)) | 60,321.0375 | ❌ | F | ✓ I2 fixed, design figure corrected |
| 16 | calc.558 | 5 ("25 employees make exactly 5 complete blocks") | 5 | ✅ | T | ✓ |
| 17 | calc.559 | 5 ("25 Turkish employees allow 5") | 5 | ✅ | T | ✓ |
| 18 | calc.153 | 1 ("9 employees give one place, not two") | 1 | ✅ | T | ✓ |

**Notes on the design column:**
- Row 13's 28,000 is the design's per-head permit plus flight. Those constants sit outside my windows, but they equal home.086's typed figures and `RateConfig`.
- Row 7's 38,944 cannot be read from its strings; it is the first review's reading of the homepage teaser, unchanged by this round.

**Rows still wrong:** none in figures, flags or counts. Only text remains:
- row 4's `where` (N2);
- the ids of rows 2 and 3 (`:2588` → 2587), row 12 (`:2646` → 2598) and row 13 (`:2657` → 2603) (N3).

**WP-C view:** the 9 legal rows include the two W58 deltas (home.299, home.074/082), each with the model figure beside it.

## The implementer's deviations and concerns — verdicts

**Deviations:**
1. **Item 3's verified figures differ from the brief's drafted note — accept; confirmed independently** (2718/2725/2726 quoted above).
   - All four 1.5× roles show ₺60,875 in the design, and row 2 needed no change.
   - The ruling log's W142(c) parenthetical is now known to be wrong (parked, controller-owned).
2. **Citations — accept** `2699 → 2718` and `2587` for the new row. The inherited citations are wrong too: rows 2 and 3 cite `:2588` (2588 is the salary clamp), and rows 12 and 13 cite `:2646`/`:2657` (N3).
3. **`copy-deltas.ts` imports the `__tests__` fixtures — accept.** The reasons are under item 1, and the guard should cover `fixtures.ts` (N1).
4. **The guard scans only the top level — do not keep as is.** `__tests__/fixtures.ts` falls within W144(c)'s "non-test files under `src/lib/calculator/`", and a recursive non-`.test.ts` scan is clean today (N1). No ruling is needed.

**Concerns:**
- *"Deviation 1 needs a second look"* — **resolved:** confirmed against the design file.
- *"The engine is not yet imported by any page"* — **accept by design.** Confirmed by grep. It also means W143's "never shipped" holds today by construction (parked note on the header wording).
- *"No process running"* — confirmed on my side too.

**Process:**
- **Trailers** read `Claude Sonnet 5` instead of the brief's `Claude Fable 5.1` — **accept**. The environment's attribution rule governs, as the first review also ruled.
- **Commit shape:** items 1–4 each have their own commit and 5–9 are grouped, as the brief allowed; data and test are consistent at every commit.
- **RED evidence:**
  - Item 5: reproduced numerically (BASE shows 4,405,615).
  - Item 8: reproduced by mutation.
  - Item 6: the first review's roll-over probe applies, and HEAD throws.
  - Items 1, 3 and 7: consistent with the per-commit check.
  - Item 2: none, which is acceptable for a data correction.

## New findings (Critical / Important / Minor)

**Critical:** none. **Important:** none.

**N1 (Minor) — the purity guard (item 7) has three coverage gaps.**
- **What it misses:**
  - `export … from` re-exports (named, `*`, `type`, multi-line). This is the only syntax `index.ts` uses.
  - `__tests__/fixtures.ts`, which `copy-deltas.ts` imports at module load. `readdirSync` is not recursive either, so a new runtime subfolder would be skipped.
  - Bare `fs`/`path` builtins.
- **Evidence:** the probe with the extracted `IMPORT_SPECIFIER`/`FORBIDDEN` flags none of these and does flag the direct-import forms. With the barrel unguarded, a re-export such as `export { formatMonth } from '@/lib/format/date'`, the M6 scenario itself, passes the guard.
- **Fix** (about five lines, test only):
  - add an `export … from` alternative to `IMPORT_SPECIFIER`, or match any `from '…'` clause;
  - scan recursively and exclude only `*.test.ts` (7 files, clean today);
  - flag bare builtins through `node:module`'s `builtinModules`;
  - add re-export lines to the RED fixture.

**N2 (Minor) — row 4's `where` omits the salary-guide low.**
- **The gap:** the brief's item 4 made "(+ guide low if the guide is legalMin-based)" conditional on exactly what item 3 proved.
  - In the design, the four 1× roles' guide cards read range "₺33,500 – …" and employer cost "₺40,786 – …"; the page will print ₺33,030 and ₺40,214.
  - Row 15's `where` names only the 1.5× roles.
  - Row 4's note gives the right employer-cost pair but does not say where it appears.
- **Scenario:** the same one as I2. T3's side-by-side review (D27) meets an unnamed difference on the 1× guide cards.
- **Fix:** `where: 'slider minimum / salary-guide low (range and employer-cost low) / pass-check salary for labourer, housekeeping, steward, greenhouse …'`. No count changes. Carry it into T3's named-delta list at the reconcile (parked).

**N3 (Minor) — four row ids cite the wrong design-file lines.**
- **The citations:**
  - Rows 2 and 3 cite `:2588` for the `legalMin` formula, which is on 2587 (2588 clamps the salary), while row 4 cites 2587 for the same formula.
  - Rows 12 and 13 cite `:2646`/`:2657`, which are `headPlusStyle` and a head-chip `onPick`; `mTotal` and `yearTotal` are at 2598 and 2603.
- **Origin:** inherited from the brief; the fix round corrected only `2699 → 2718`.
- **Impact:** the table is now the WP-C and page authors' reference, so a wrong citation costs a wrong lookup. No figure is affected.
- **Fix:** rename the four ids, and update the test's disagreeing-id list, which asserts them verbatim.

**N4 (Minor) — the TZ pin catches a local-time formatter but not a local-time parser, and the comment says the reverse.**
- **Evidence** (mutated scratch copies, four zones):
  - Dropping `timeZone: 'UTC'` fails under Los Angeles only, so the pin catches it.
  - Dropping the `Z` from the parse passes every pinned label test under Los Angeles and UTC. Under Los Angeles it fails only at `isReviewDue`'s boundary (`review.at=false`), which runs outside the pin. In Karachi and Kiritimati it throws through the new round-trip check.
  - So on a UTC host (the Vercel build's verify) a parse regression passes, and only a positive-offset machine catches it.
- **Origin:** the premise came from the first review's M3 ("parsing or formatting only shows in negative-offset zones"), which is half right.
- **Fix:** hoist `beforeAll`/`afterAll` to file level (or also wrap the `isReviewDue` describe), and correct the comment at `labels.test.ts:16-19`. I verified that under Los Angeles both mutations then fail.

**N5 (Minor) — the `legal` check does not assert that a row's package id exists.**
- **The gap:** `catalogueLegalFor` treats an unknown id as `legal: false`. A typo such as `'calc.5577'` therefore passes with `legal: false`, which for the WP-C list is a silent drop. All 12 current ids exist (checked).
- **Fix:** `expect(catalogue[packageId]).toBeDefined()` for every matched id.

**N6 (Minor, docs) — ARCHITECTURE § Calculator engine lags this round's two behaviour changes, plus some wording.**
- **Drift:** the section still says "Numbers leave the engine unrounded and `formatTRY` rounds once at the edge". It mentions neither W144(a) (additive lines snapped to 4 decimals before `formatTRY`) nor W144(b) (a calendar-invalid date throws `CalculatorError`). The repo rule is that the docs match the code in the same change.
- **Wording:**
  - The section and several code comments cite review-local labels (M1–M9) that exist only in the git-ignored SDD folder. W142–W144 carry the same content durably.
  - "W144(d)/M5" labels the EN-bundle cross-check, but W144(d) is the TZ ruling; M5 came in through the fix brief, not W144.
  - "`home.074`/`home.082`/`home.299`'s support-applied FAQ figures": only home.299 is the FAQ. home.074 is the teaser note and home.082 the support-row label.
  - "when a role's own band is narrower than the floor" means "when the band's maximum sits below the floor".
- **Fix:** one sentence for W144(a)(b) and the label swaps. The controller may fold this into the Gate A docs sync.

## Parked for the WP2a final review

- **Ledger (controller):** `progress.md:96` still reads "COPY_DELTAS: 4 deltas / 12 pins — T1 and T4 author sys.* from the model column". It should become "18 rows: 7 deltas / 11 pins (9 legal) — T1 and T3 …"; W142(e) names the ledger.
- **Ruling log (controller):** W142(c)'s "(₺45,000 → ₺54,788)" is superseded by the verified reading (₺50,000 → ₺60,875 for all four 1.5× roles). Annotate it.
- **T3's named-delta list at the reconcile** (the first review's P7), from the corrected table:
  - the 1.5× guide employer-cost low, ₺60,875 → ₺60,321 (row 15; W59 makes it tier-dependent);
  - the 1× roles' 33,500 → 33,030 on the slider, the pass check and the guide: range low, and employer-cost low ₺40,786 → ₺40,214 (row 4 + N2).
- **`copy-deltas.ts:7`** says the module "can be imported by a page task or a lint", while W143 calls it authoring-time data, never shipped.
  - The rows compute `model` from the test fixtures, so a page import would ship fixture figures instead of the live `RateConfig` (D17).
  - Reword it to "a page task's tests or a lint". Optionally, have the purity test assert that nothing outside `src/lib/calculator/` imports it.
- **`RateConfigSchema`'s three date fields accept calendar-invalid dates** (regex only). After W144(b), a bad Ops row throws at render time.
  - A calendar refine on the schema would reject it at the adapter instead, keeping the last-good bundle.
  - This is Task 1's schema, so it belongs to the WP2a final review or WP2b.
- **W144(a)'s premise** (additive lines exact at 4 decimals) holds for the committed row and for T3's integer salaries.
  - The schema accepts any SGK rate in [0, 1], so a Phase B rate with more than four decimals would bring back rare double rounding.
  - Ops-side validation is optional.
- **The WP2a plan text** (`docs/superpowers/plans/2026-09-20-wp2a-foundation.md` ~23365–23481) still says "four places … twelve agreeing pins" and "T4". It is historical: leave it or annotate it (controller).
- **The first review's P1–P8** are unchanged by this round and still apply; P7 is extended above.
