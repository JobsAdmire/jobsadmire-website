# Task 4: Import the design package strings into a local bundle + catalogue — report

## What was implemented

- `scripts/import-design-package.ts` — the brief's Step 2 importer verbatim: reads the 15 `design-package/strings/<page>.json` files, builds `tr`/`en` string maps, decodes the three HTML entities (`&amp;`, `&middot;`, `&nbsp;`) as a harmless safeguard (none were actually present), adds the one hand-typed `sys.nav.verify` id (D7 reserved range) with English "Verify Representative" / Turkish "Temsilci Doğrulama", assembles the 11-item desktop nav in README order, and writes `bundle.tr.json`, `bundle.en.json`, `catalogue.json` when run as the CLI entry point (`require.main === module`).
- `scripts/import-design-package.test.ts` — the brief's Step 1 test, with **R1** applied: the first assertion checks the non-`sys.*` id count (3505) separately from the `sys.nav.verify` string, then checks the EN/TR key sets match.
- `vitest.config.ts` — **R9**: `include` extended to `['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts']` so the scripts test is actually picked up. No other change to the file.
- `.prettierignore` — **R10**: added `src/content/local` (the generated JSON uses `JSON.stringify(…, null, 1)`, which is not Prettier-formatted and would fail `prettier --check .`).
- `package.json` — added `"content:import": "tsx scripts/import-design-package.ts"`; `tsx` added as a devDependency (brief-sanctioned, no other dependency added); `package-lock.json` updated accordingly.
- `src/content/local/bundle.tr.json`, `src/content/local/bundle.en.json`, `src/content/local/catalogue.json` — generated output, committed as Phase A content per the brief.

No files beyond these were created or modified.

## Runtime notes (ROOT / CLI-guard form used)

Used the brief's form **as written**, unmodified — no fallback needed:

- `const ROOT = join(__dirname, '..');`
- `if (require.main === module) { … }`

Both worked correctly under both runners:

- **tsx (CLI, CommonJS)**: `__dirname` resolved correctly and `require.main === module` was true, so the write branch ran and wrote the three files.
- **Vitest (vite-node)**: `__dirname` was provided and resolved correctly; `require.main === module` was falsy, so importing `buildBundles` in the test did **not** write any files (verified — `src/content/local` did not exist before running `npm run content:import` for the first time, even though the test suite had already run and passed against the same import).

No errors were raised by either runner, so the sanctioned `process.cwd()` / `process.argv[1]` fallback was not needed.

## TDD evidence

### RED

Command: `npm run test -- scripts/import-design-package.test.ts` (run after the R9 vitest.config.ts change, so the file was actually collected)

```
 FAIL  scripts/import-design-package.test.ts [ scripts/import-design-package.test.ts ]
Error: Failed to resolve import "./import-design-package" from "scripts/import-design-package.test.ts". Does the file exist?
...
 Test Files  1 failed (1)
      Tests  no tests
```

Module missing, as expected — test file was written before `import-design-package.ts` existed.

### GREEN

Command: `npm run test -- scripts/import-design-package.test.ts`

```
 Test Files  1 passed (1)
      Tests  5 passed (5)
   Duration  472ms
```

All 5 tests passed on first implementation attempt (id-set/count, six empty-TR ids, 380 legal strings, no HTML entities, desktop nav order).

## `content:import` output

```
> jobsadmire-website@0.1.0 content:import
> tsx scripts/import-design-package.ts

wrote 3506 strings per locale
```

(3505 package ids + the one `sys.nav.verify` id = 3506, matching R1.)

Spot-checked the generated files directly:

- The six deliberately-empty TR ids (`hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107`) are `""` in `bundle.tr.json` and non-empty in `bundle.en.json`.
- `catalogue.json` has exactly 380 entries with `legal: true`.
- Zero values in `bundle.en.json` match `/&(amp|middot|nbsp);/`.
- `tr.nav` hrefs, in order: `/hire-workers`, `/available-workers`, `/work-permit`, `/hiring-cost-calculator`, `/about`, `/success-stories`, `/blog`, `/verify`, `/partner-with-us`, `/careers`, `/contact` — matches the README nav order and the test.

## `npm run verify` summary

Full green run:

```
> tsc --noEmit                 (typecheck: no errors)
> eslint .                     (lint: no errors)
> prettier --check .           (format: all matched files use Prettier code style)
> vitest run                   (test: 5 test files passed, 28 tests passed)
```

Output pristine apart from the pre-existing Vitest `configLoader: 'native'` warning and the pre-existing Node `EBADENGINE` notice from `npm install` (Node 25.8.2 vs the declared `engines.node: 22.x`) — both present before this task and unrelated to this change.

## Files changed

- `scripts/import-design-package.ts` (new, 4.4 KB)
- `scripts/import-design-package.test.ts` (new, 1.6 KB)
- `vitest.config.ts` (modified — R9 include line)
- `.prettierignore` (modified — R10, added `src/content/local`)
- `package.json` (modified — `content:import` script, `tsx` devDependency)
- `package-lock.json` (modified — `tsx` + its 2 transitive deps)
- `src/content/local/bundle.tr.json` (new, 235,263 bytes)
- `src/content/local/bundle.en.json` (new, 212,796 bytes)
- `src/content/local/catalogue.json` (new, 426,405 bytes)

## Self-review

- **Completeness**: all 5 tests from the brief present (with R1's split first assertion), importer matches the brief's Step 2 code exactly, `content:import` script added, all three generated JSON files committed, R1/R9/R10 all applied.
- **Quality**: importer is the brief's code verbatim — no embellishment, no extra abstraction. `decode()` kept as a harmless safeguard per the controller's note even though no entities were present in the source.
- **Discipline**: no extra files, no dependency beyond the brief-sanctioned `tsx`, no disable comments needed (ESLint raised nothing on `scripts/`), no `next build` or Playwright run, no push.
- **Testing**: RED confirmed module-not-found before implementation; GREEN confirmed 5/5 after. Full `npm run verify` green with only the two pre-existing, unrelated noise sources.
- **Generated-content checks**: six empty-TR ids confirmed empty in `bundle.tr.json` with non-empty EN counterparts; zero `&amp;`/`&middot;`/`&nbsp;` occurrences in any string value.

## Concerns

- `home.011` in `design-package/strings/homepage.json` already carries "Verify a Representative" / "Temsilci Doğrulama" (a package-native nav-verify id), but the brief directs using a new hand-typed `sys.nav.verify` id with slightly different English wording ("Verify Representative", no "a"). This was a controller-approved brief decision (R1 explicitly names `sys.nav.verify` and its exact string), not something I second-guessed — flagging only so the controller is aware the package does carry a same-purpose id under a different key, in case that was an oversight rather than a deliberate choice.
- `catalogue.json` (426 KB) is the largest of the three generated files, driven by the `sec`/`rev`/`k` metadata carried per id; this is expected given the brief's schema and not a concern on its own.

**Resolved by R11 below** — the first concern above was confirmed correct by the controller and fixed.

## Amendment round (R11)

The controller confirmed the concern above: the package already carries the verify nav label as `home.011` (k `navVerify`), and the repo convention (this repo's `CLAUDE.md`: "Do not invent new ids for existing copy") says never invent an id for copy the package already has. R11 dropped the invented `sys.nav.verify` id entirely.

### What changed

- `scripts/import-design-package.ts`:
  - `NAV` entry for `/verify` now reads `{ href: '/verify', labelId: 'home.011' }` (was `'sys.nav.verify'`).
  - Deleted the three `sys.nav.verify` lines (`strings.tr[...]`, `strings.en[...]`, `catalogue[...]`) and the `// sys.* ids that the package does not carry (D7 reserved range)` comment above them. The importer now writes no `sys.*` ids at all.
- `scripts/import-design-package.test.ts`:
  - First test reverted to the brief's original form: `expect(Object.keys(tr.strings).length).toBe(3505);` plus the EN/TR key-set equality — the `sys.nav.verify` assertion removed.
  - Added a new `it` to assert the `/verify` nav item's `labelId` is `'home.011'` and `tr.strings['home.011']` is `'Temsilci Doğrulama'`.
- Regenerated `src/content/local/bundle.tr.json`, `bundle.en.json`, `catalogue.json` — `content:import` now reports `wrote 3505 strings per locale` (was 3506).

### Grep result (no `sys.nav.verify` left)

```
$ grep -c "sys.nav.verify" src/content/local/bundle.en.json src/content/local/bundle.tr.json src/content/local/catalogue.json
src/content/local/bundle.en.json:0
src/content/local/bundle.tr.json:0
src/content/local/catalogue.json:0
```

Catalogue entry count confirmed 3,505 (`json.load(...)` length check).

### Test command and output

RED→GREEN wasn't needed here (existing test file edited in place, not deleted), but re-ran the covering test directly:

```
$ npm run test -- scripts/import-design-package.test.ts
...
 Test Files  1 passed (1)
      Tests  6 passed (6)
   Duration  458ms
```

(6 tests: the original 5 plus the new `home.011` nav-label assertion.)

Then `npm run verify` once:

```
> tsc --noEmit                 (typecheck: no errors)
> eslint .                     (lint: no errors)
> prettier --check .           (format: all matched files use Prettier code style)
> vitest run                   (test: 5 test files passed, 29 tests passed)
```

Pristine apart from the same two pre-existing, unrelated noise sources (Vitest `configLoader` warning, Node `EBADENGINE` notice).

### Files changed (this round)

- `scripts/import-design-package.ts` (modified)
- `scripts/import-design-package.test.ts` (modified)
- `src/content/local/bundle.tr.json` (regenerated, 235,214 bytes)
- `src/content/local/bundle.en.json` (regenerated, 212,745 bytes)
- `src/content/local/catalogue.json` (regenerated, 426,314 bytes)

### Commit

`b033cb8` — `fix(content): nav verify label uses package id home.011, no invented sys id`
