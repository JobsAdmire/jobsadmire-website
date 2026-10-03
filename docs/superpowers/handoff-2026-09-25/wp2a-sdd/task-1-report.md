# Task 1 report — Phase A data layer through the importer (T0b)

**Status: DONE.** Five cycles, five commits on `wp2/foundation` (on top of `0cc5658`), `npm run verify` green at every commit. Final suite: 28 files, 171 tests (was 26 / 121 at the start). Branch clean after the last commit.

## Commits

| SHA | Subject |
|---|---|
| `c631d5b` | feat(content): typed collection accessors over the frozen bundle contract (T0b) |
| `acee8e0` | feat(content): literal-based hard-typed-metric lint, fill/metricValues/makeTf (T0b) |
| `aa91d7a` | feat(import): Phase A data layer — collections, page records, nav groups, W7 normalisations (T0b) |
| `ef9e8da` | test(content): wire the D17 metric lint to the metric set + baseline; '' SEO ids fall back (T0b) |
| `45a3eee` | docs(content): Phase A collections, missing-copy procedure (W9/W23/W54), importer normalisations (T0b) |

## What was implemented

- **`src/content/collections.ts`** (new, client-safe): `METRIC_KEYS` (9), `PAGE_KEYS` (22), `PAGE_PATHNAME`, Zod schemas for the eight Phase A collections (`MetricSchema`, `RateConfigSchema`, `CalculatorRoleSchema`, `SourceCountrySchema`, `CountrySchema`, `OfficeSchema`, `SectorSchema`, `BlogPostSchema` with the W28 body/hasBody refinement), `CollectionSchemas`, the inferred types, `CollectionError`, `getCollection` (WeakMap cache per bundle; dev throws / prod `console.error` + `[]`), `getMetric` (dev throws / prod empty metric), `getRateConfig` + `getOffice` (throw in every env), `BLOG_NAV_THRESHOLD = 6`, `blogNavVisible`, `getPageSeo`. Exactly the brief's Produces block, no renames.
- **`src/content/lint.ts`**: `findHardTypedMetrics` replaced by the literal-table version (`MetricLiterals`, `parseMetricLiteral` with the `[value]` span marker, case-insensitive match, baseline skip, sorted output).
- **`src/content/pure.ts`**: `fill` (bare-identifier `{key}` only, so `{{ queryEcho }}` passes through; unknown key throws in dev, stays in prod), `metricValues` (formatInt + suffix, or the range `text`), `makeTf`.
- **`scripts/import-design-package.ts`** (whole file, verbatim from the brief — `diff` against the brief's block is empty): `buildBundles`, `buildNav`, `rev`, `CatalogueRow`, `ImportReport`; W7/W51 override table, Türkiye rule, metric re-authoring on the `[value]` span, baseline validation + the armed `findHardTypedMetrics` gate (the import throws on an unlisted literal), rev recompute over emitted EN with `packageRev` kept and `edits` on the catalogue row, countries file (W25), the eight collections (metrics, rateConfig, 15 calculatorRoles, 13 sourceCountries from `source-map.js` + Sri Lanka, 64 countries, 2 offices, 7 sectors, 22 blog rows from `blog-posts.js` in a vm sandbox with the one EN body composed from `blogarticle.025–063`), 22 page records (PAGE_TABLE), 9 nav groups (5 filled, 4 declared empty per R15; portal row only in the groups, W36; `/blog` gated by W4), catalogue-id checks on every `*Id` field / SEO id / nav label, `BundleSchema.parse` on both locales before writing.
- **Four reviewed input files** under `scripts/`: `content-overrides.json` (24 ids), `metric-placeholders.json` (9 literal sets, 39 string entries), `metric-lint-baseline.json` (32 entries), `data/countries.json` (64 rows, sorted by code). All verbatim from the brief; Prettier left them unchanged.
- **Generated** (`npm run content:import`, committed, never hand-edited): `src/content/local/bundle.tr.json`, `bundle.en.json`, `catalogue.json`.
- **`src/lib/seo/metadata.ts`**: the two-line `''` → fallback rule (`seo?.titleId ? t(seo.titleId) : args.fallbackTitle`), W38.
- **Docs** (same change set, sentence-anchored per W45): `docs/CONTENT-MODEL.md` (nav/pages/collections rows, Importer normalisations paragraph, `findHardTypedMetrics` bullet, § Collections Phase A paragraph, § Blog two sentences, new "### Adding copy (W9, W23, W54)" section), `docs/ARCHITECTURE.md` (pure.ts bullet, D23 paragraph, § Calculator engine), `docs/PRD.md` (§11 Content pipeline T0b sentence), `CLAUDE.md` ("Numbers are data (D17)" bullet + the five sys namespaces on the "New copy" bullet). All wording verbatim from the brief.

## Importer's logged numbers (from `npm run content:import`)

```
content-overrides.json — 29 locale values overridden (24 ids):        [29-row table]
Türkiye rule — 93 EN values normalised (Turkey → Türkiye)
metric placeholders — 42 replacements:                                 [42-row table]
blog — 22 articles, 0 Turkish bodies (threshold 6) → /blog out of nav (W4)
wrote 3505 strings, 35 nav items, 22 page records, 8 collections per locale
```

- Override rows: 29 (24 ids; 5 EN changes → `packageRev` kept: home.134, home.197, hire.231, about.126, contact.137; 24 TR-only incl. hire.240/241 per W51).
- Placeholder replacements: 42 over 39 ids (about.057, availworkers.067, availworkers.220 carry two each); the three ruled normalisations are visible in the log: `14+ clients` → employers, `13+ countries` / `13'ten fazla ülke` → countries, `8–10 weeks` → firstDayWeeks.
- Türkiye count: 93 EN values; 88 "Turkish" values untouched (asserted).
- Nav rows: 35 (desktopNav 10, hamburger 11, slimBarRight 3, footerEmployers 6, footerCompany 5; 39 with `/blog` via `buildNav(true)`).
- Catalogue: 3,505 rows, 380 legal, 136 rows with `packageRev`, 154 rows with `edits`.
- Baseline ids (32): home.021, home.098, home.113, home.185, home.253, home.259, home.295, hire.024, hire.025, hire.026, hire.027, hire.037, hire.039, hire.043, hire.046, hire.072, hire.137, hire.160, hire.161, hire.173, hire.188, hire.191, hire.198, hire.199, hire.201, hire.265, hire.267, hire.273, hire.286, hire.292, about.040, jt.271.
- Per-locale collections are byte-identical except the locale-resolved `name` fields (checked with a strip-and-compare script); the EN body is 2,552 chars / 14 Markdown blocks, starts with `blogarticle.025`, ends with the `blogarticle.063` quote, no "Turkey", no stray `{placeholder}`.

Full log saved at `/private/tmp/claude-501/-Users-agentfaraz-projects-admiregroup-jobsadmire/e2186f84-5a31-4b85-9453-d5ee861c5873/scratchpad/import-log.txt` (scratchpad, not committed).

## TDD evidence per cycle

### Cycle 1 — typed accessors
- RED: `npx vitest run src/content/collections.test.ts` → `Error: Failed to resolve import "./collections" from "src/content/collections.test.ts". Does the file exist?` — 1 failed file, no tests.
- GREEN: same command → `Test Files 1 passed (1)`, `Tests 14 passed (14)`. `npm run verify` → tsc clean, eslint clean, "All matched files use Prettier code style!", 27 files / 135 tests.

### Cycle 2 — lint literals + fill/metricValues/makeTf
- RED: `npx vitest run src/content/adapter.test.ts src/content/lint.test.ts` → 2 failed files, 6 failed tests: `TypeError: fill is not a function`, `TypeError: metricValues is not a function`, `TypeError: makeTf is not a function`, `TypeError: parseMetricLiteral is not a function` (Vitest 4 reports a missing named ESM export at call time, not as the module-level `SyntaxError` the brief quotes — same cause).
- GREEN: `npx vitest run src/content` → 3 files / 34 tests passed. `npm run verify` → 27 files / 140 tests, all green.

### Cycle 3 — the importer
- RED: `npx vitest run scripts/import-design-package.test.ts` (test file byte-identical to the brief's) → `Error: ENOENT: no such file or directory, open '…/scripts/content-overrides.json'`, 1 failed file.
- GREEN: after the four data files + the importer (`tsc --noEmit` exit 0): same command → `Test Files 1 passed (1)`, `Tests 28 passed (28)` on the first run. `npm run content:import` regenerated the three bundles with the numbers above. `npm run verify` → 27 files / 162 tests green — `lint.test.ts` parity/lira suites, `contract/contract.test.ts` (hash unchanged, both regenerated bundles validate), `Header.test.tsx`/`Footer.test.tsx` all still green against the regenerated bundles.

### Cycle 4 — wire the lint, real bundles, '' SEO fallback
- RED: `npx vitest run src/content src/lib/seo/metadata.test.ts` → `× uses the fallbacks when the page record's ids are '' (no package SEO string, W23/W38)` with `Error: unknown string id: ` — 1 failed / 45 passed (the new `lint.test.ts` and `local-bundle.test.ts` already passed, as the brief predicted).
- GREEN: after the two-line `metadata.ts` change: `npx vitest run` → 28 files / 171 tests. `npm run verify` green.

### Cycle 5 — docs (no test)
- `npx prettier --write docs/CONTENT-MODEL.md docs/ARCHITECTURE.md docs/PRD.md CLAUDE.md` (only CONTENT-MODEL's table realigned), `npm run verify` → green, 28 files / 171 tests.

## Files changed (22, matches the brief's Files list exactly)

Created: `src/content/collections.ts`, `src/content/collections.test.ts`, `src/content/local-bundle.test.ts`, `scripts/content-overrides.json`, `scripts/metric-placeholders.json`, `scripts/metric-lint-baseline.json`, `scripts/data/countries.json`.
Modified: `src/content/lint.ts`, `src/content/lint.test.ts`, `src/content/pure.ts`, `src/content/adapter.test.ts`, `scripts/import-design-package.ts`, `scripts/import-design-package.test.ts`, `src/lib/seo/metadata.ts`, `src/lib/seo/metadata.test.ts`, `docs/CONTENT-MODEL.md`, `docs/ARCHITECTURE.md`, `docs/PRD.md`, `CLAUDE.md`.
Generated: `src/content/local/bundle.tr.json`, `src/content/local/bundle.en.json`, `src/content/local/catalogue.json`.
Not touched: `contract/website-bundle.v1.ts` (frozen; `contract.test.ts` unchanged and green).

## Self-review

- Completeness: every cycle, every file in the Files list, every name in the Produces block present with the brief's exact spelling and signatures. The importer and its test are `diff`-identical to the brief; the collections module, lint, pure additions and data files were typed from the brief and match it.
- Brief vs rulings: no disagreement found. W1/W2/W4/W7/W9/W23/W25/W28/W35/W36/W38/W40/W43/W45/W51/W54/W64 all match what the brief specifies; W64 explicitly accepts the composed-body deviation the brief implements.
- Package data pins: every pinned number matched the package (3,505 ids, 380 legal, 93 Turkey, 88 Turkish, 42/39 placeholders, 12 design roles, 12 source-map rows + Türkiye, 26 blog cards, `rev` fixtures). Nothing had to be adjusted.
- Test output pristine: no stderr/warnings in the full run; the prod-degrade test mocks `console.error`.
- Lint: `local-bundle.test.ts` and `lint.test.ts` read the generated JSON with `readFileSync` (R56/D23 rule unchanged, no new ESLint exemption). `collections.ts` has no `server-only`/fs; its only non-Zod import is `import type { pathnames }` (erased).
- No overbuilding: no extra exports, no extra tests beyond the brief's, no changes outside the Files list. `CLAUDE.md` carries no `nextjs-agent-rules` block (`npm run dev` was not run; `next build` was not run, per instructions).
- Docs: all anchors located by sentence; the three table cells terminate cleanly after Prettier's realignment.

## Concerns

None blocking. Two notes for the controller:
1. Vitest 4 phrases the cycle-2 RED as `TypeError: <name> is not a function` (per test) rather than the module-level `SyntaxError … does not provide an export named …` the brief quotes. Same failure, different reporter wording; cycle 1 and 3 REDs matched the brief's wording exactly.
2. Environment: the machine runs Node v25.8.2 while `package.json` pins `engines.node = 22.x` (pre-existing, not touched; Vercel uses its own runtime). No behavioural difference observed.
