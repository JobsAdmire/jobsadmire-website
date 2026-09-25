# Task 3: Money and number formatting contract (D18) — report

## What was implemented

- `src/lib/format/money.ts` — exports `formatInt(n, locale)`, `formatTRY(amount, locale)`, `formatPercent(value, locale, decimals = 2)`, exactly per the brief's Step 2 code, importing `type { Locale }` from `@/i18n/routing`.
- `src/lib/format/money.test.ts` — the brief's Step 1 test file, verbatim, covering:
  - `formatTRY`: TR dot-thousands/trailing symbol (3 cases), EN comma-thousands/leading symbol (2 cases), rounding to whole lira (28075.5 → `28.076 ₺`).
  - `formatPercent`: TR sign-leads/comma-decimal (2 cases), EN dot-decimal/sign-trails, custom `decimals` (0 → `%20`).
  - `formatInt`: TR/EN thousands grouping.

No files beyond these two were created or modified.

## TDD evidence

### RED

Command: `npm run test -- src/lib/format`

```
 FAIL  src/lib/format/money.test.ts [ src/lib/format/money.test.ts ]
Error: Failed to resolve import "./money" from "src/lib/format/money.test.ts". Does the file exist?
...
 Test Files  1 failed (1)
      Tests  no tests
```

Module missing, as expected — test file was written before `money.ts` existed.

### GREEN

Command: `npm run test -- src/lib/format`

```
 Test Files  1 passed (1)
      Tests  7 passed (7)
   Duration  463ms
```

All 7 test cases passed on first implementation attempt. Node's ICU correctly grouped `tr-TR` with `.` and used `,` for decimals (e.g. `formatPercent(21.75, 'tr')` → `%21,75`), so no hand-rolled formatter was needed.

## `npm run verify` summary

Full green run:

```
> tsc --noEmit                 (typecheck: no errors)
> eslint .                     (lint: no errors)
> prettier --check .           (format: all matched files use Prettier code style)
> vitest run                   (test: 4 test files passed, 23 tests passed)
```

Output pristine apart from the pre-existing Vitest `configLoader: 'native'` warning (unrelated to this change, present before this task).

`npm run format:write` was run first (on the full project, since the script has no path-scoping args) — both new files were reported "unchanged", confirming they were already Prettier-clean as written.

## Files changed

- `src/lib/format/money.ts` (new)
- `src/lib/format/money.test.ts` (new)

## Commit

- `4202fea` — `feat(format): formatTRY/formatPercent/formatInt per the D18 locale contract`
- `git status --short` before staging showed only `?? src/lib/format/` — nothing else touched.
- Not pushed, per instructions.

## Self-review

- **Completeness:** all three functions present with the exact signatures from the brief's Interfaces line; all test cases from the brief's Step 1 block are present verbatim (no cases added or removed).
- **Quality:** implementation is the brief's Step 2 code exactly — `Intl.NumberFormat('tr-TR'|'en-US')` driven by a small `intl` locale map, `formatTRY` rounds via `Math.round` then delegates to `formatInt`, `formatPercent` sets `minimumFractionDigits`/`maximumFractionDigits` to the same `decimals` value. JSDoc comments on `formatTRY`/`formatPercent` restate the D18 contract as in the brief.
- **Discipline:** nothing beyond the brief — no extra exports, no extra files, no changes to `routing.ts` or any other module.
- **Testing:** real `Intl.NumberFormat` behavior exercised (no mocking); full `npm run verify` green; only pre-existing noise (configLoader warning) in output, no EBADENGINE noise appeared in this run's captured output.

## Concerns

None. The task matched the brief exactly with no ambiguity, and full-ICU `Intl.NumberFormat` on this machine produced the exact D18 contract strings (period/comma grouping and decimal separators) without any workaround.
