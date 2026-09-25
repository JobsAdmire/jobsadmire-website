# Task 7 report: Catalogue lints as tests (ratchet baseline)

## What was implemented

- `src/content/lint.ts` — four pure functions, copied verbatim from the brief:
  - `numericTokens(s)` — extracts numbers as canonical strings (thousands separators dropped, decimal comma/dot normalised to dot).
  - `findParityViolations(tr, en, exceptions)` — D17 EN↔TR numeric-token-set parity per string id, skipping ids in `exceptions` and TR ids that are deliberately `''`.
  - `findLeadingLiraViolations(tr)` — D18: flags any TR string matching `₺\s?\d` (lira symbol before the digits).
  - `findHardTypedMetrics(strings, metrics)` — flags strings whose numeric tokens include a raw metric value that should have been a placeholder.
- `src/content/lint.test.ts` — copied verbatim from the brief: 4 tests across 4 `describe` blocks (numericTokens, D17 parity, D18 currency form, numbers-out-of-copy).
- `src/content/lint-exceptions.json` — written as exactly `{}` per controller ruling R7. Neither `calc.042` nor `home.086` is currently a parity violation (verified by the generated baseline below — neither id appears in it), so no exception entries were needed.
- `src/content/lint-baseline.json` — generated from the real bundles via the throwaway script (see below), committed as-is (`JSON.stringify({parity, leadingLira}, null, 1)`).
- `.prettierignore` — appended `src/content/lint-baseline.json` (its 1-space indent fails `prettier --check`).

## RED / GREEN

**RED** — `npm run test -- src/content/lint.test.ts` (test file written, `lint.ts` not yet created):

```
 FAIL  src/content/lint.test.ts [ src/content/lint.test.ts ]
Error: Failed to resolve import "./lint" from "src/content/lint.test.ts". Does the file exist?
 Test Files  1 failed (1)
      Tests  no tests
```

**GREEN** — after implementing `lint.ts` and generating both JSON files, `npm run test -- src/content/lint.test.ts`:

```
 Test Files  1 passed (1)
      Tests  4 passed (4)
```

## numericTokens sanity check

Run via the scratchpad script before baseline generation (see below), against the two test examples plus the brief's phone-number case:

```
numericTokens("Costs ₺38,944 and 21.75%") = [ '38944', '21.75' ]
numericTokens("Maliyet 38.944 ₺ ve %21,75") = [ '38944', '21.75' ]
numericTokens("+90 501 124 03 40") = [ '905011240340' ]
```

All three match the expected values exactly (the phone number collapses to the single token `905011240340`). No regex anomaly — proceeded to generate the baseline as specified, without touching the regex.

## Baseline generation

Per the controller ruling, did **not** use `tsx -e`. Wrote a throwaway script at:

`/private/tmp/claude-501/-Users-agentfaraz-projects-admiregroup-jobsadmire/e2186f84-5a31-4b85-9453-d5ee861c5873/scratchpad/gen-baseline.ts`

which imports the four functions from the absolute path of `src/content/lint.ts`, reads the two bundles and `lint-exceptions.json` by absolute path, runs the sanity checks above, then writes `src/content/lint-baseline.json` with `JSON.stringify({ parity, leadingLira }, null, 1)`. Ran with:

```
npx tsx /private/tmp/.../scratchpad/gen-baseline.ts
```

from the worktree root (`/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp1`). Nothing was deleted from the scratchpad; the script remains there.

### Baseline counts

- **parity: 17 ids**
- **leadingLira: 26 ids**

Both are well within the sanity bounds (parity ≪ 400, leadingLira ≠ 0) — no tokeniser-bug signal, so proceeded to commit without stopping.

First 15 (of 17) parity ids:
```
availworkers.091, calc.151, calc.153, calc.359, calc.360, calc.373, calc.374, calc.375,
calc.558, hire.025, hire.027, hire.267, hire.271, home.104, jt.096
```
(full list also includes: `jt.265`, `wp.029`)

First 15 (of 26) leadingLira ids:
```
calc.021, calc.040, calc.079, calc.083, calc.086, calc.117, calc.131, calc.134, calc.202,
calc.337, calc.338, calc.361, calc.362, calc.370, calc.371
```
(full list also includes: `calc.373`, `calc.374`, `calc.407`, `calc.408`, `calc.409`, `calc.410`, `calc.411`, `calc.446`, `calc.483`, `calc.495`, `calc.497`)

Neither `calc.042` nor `home.086` (the brief's two guessed exception ids) appears in either baseline list — confirming the controller's reading (R7) that neither is currently a violation.

## `npm run verify` summary

```
> tsc --noEmit                     — clean
> eslint .                          — clean
> prettier --check .                — "All matched files use Prettier code style!"
> vitest run                        — Test Files  8 passed (8), Tests  42 passed (42)
```

Output was pristine apart from the pre-existing Vitest `configLoader: 'native'` ESM/CommonJS warning (present before this task, unrelated to these changes). No Node EBADENGINE noise appeared in this run.

## Files changed

- `src/content/lint.ts` (new)
- `src/content/lint.test.ts` (new)
- `src/content/lint-exceptions.json` (new, `{}`)
- `src/content/lint-baseline.json` (new, generated, git-tracked, Prettier-ignored)
- `.prettierignore` (+1 line: `src/content/lint-baseline.json`)

Commit: `6f9e11a` — `test(content): numeric-parity, currency-form and numbers-out-of-copy lints with a ratchet baseline`

## Self-review

- **Completeness:** all four functions present and exported; all four tests present and passing; both JSON files present with correct shape (`lint-exceptions.json` = `{}`; `lint-baseline.json` = `{parity: string[], leadingLira: string[]}`, 1-space indent); `.prettierignore` line added.
- **Quality:** `lint.ts` and `lint.test.ts` are verbatim from the brief (no rewriting, no scope creep). No extra files created inside `src/content/`.
- **Discipline:** did not use `tsx -e`; generation script lives in the scratchpad and was run from the worktree root; nothing deleted from scratchpad; `lint-exceptions.json` written as exactly `{}` (no guessed entries added) per R7; did not run `next build` or Playwright; did not push; used `git add <files>` by name (no `-A`, no bare `git stash`).
- **Testing:** all four tests exercise real behaviour — `numericTokens` against literal strings, parity/currency-form tests against the real `bundle.tr.json` / `bundle.en.json` / generated baseline / exceptions file, and `findHardTypedMetrics` against inline strings (does not touch the bundles, as specified). `npm run verify` is fully green.

## Concerns

None. Baseline counts (17 / 26) are modest and plausible as WP6 follow-up items, not evidence of a tokeniser bug. The two ids the brief guessed as needing exceptions (`calc.042`, `home.086`) are confirmed clean — `lint-exceptions.json` correctly stays empty per the controller's ruling.
