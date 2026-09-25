# Task 6 report — Content adapter (`LOCAL` | `OPS`) with the production fixture guard

**Branch:** `wp1/foundation` (worktree `jobsadmire-website-wp1`)
**Commit:** `6910597` feat(content): LOCAL/OPS bundle adapter with contract validation and the production fixture guard
**Status:** DONE

## What I implemented

The R2 three-file split, so the pure helpers are testable under Vitest while the loading path stays server-only:

| File                        | Responsibility                                                                                                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/config.ts`     | env → source decision. `type ContentSource`, `FIXTURE_ONLY_COLLECTIONS` (`pool`, `stories`, `representatives`), `contentSource()` (OPS only when `CONTENT_SOURCE=OPS` **and** `OPS_API_URL` set **and** the read token is ≥ 32 chars). No `server-only`. |
| `src/content/pure.ts`       | runtime-agnostic helpers: `class BundleUnavailableError`, `assertServableInProduction(bundle, source, env = process.env.NODE_ENV)` (D23), `makeT(bundle)` (empty values returned as `''`, unknown id throws outside production). No `server-only`. |
| `src/content/adapter.ts`    | `import 'server-only'` as line 1, then `loadLocal` (dynamic JSON import + `BundleSchema.parse`), `loadOps` (Bearer read token, `next: { revalidate: 900, tags: ['site:${locale}'] }` per D8, `BundleUnavailableError` on HTTP error and on contract violation), `getBundle = cache(...)`. Re-exports: `export * from './pure'` + `export { contentSource }`. |
| `.env.example`              | the six variables, verbatim from the brief.                                                                                                                                                            |

Consumers import only from `@/content/adapter`; the test file imports `makeT`/`assertServableInProduction` from `./pure` and `contentSource` from `./config` (R2), and builds its bundle with `BundleSchema.parse(fixture)` (R13). `afterEach(() => vi.unstubAllEnvs())` is on **both** `vi.stubEnv` describe blocks (`makeT` and `contentSource`), per R13.

## RED

```
$ npm run test -- src/content/adapter.test.ts
 ❯ src/content/adapter.test.ts (0 test)
 FAIL  src/content/adapter.test.ts [ src/content/adapter.test.ts ]
Error: Failed to resolve import "./pure" from "src/content/adapter.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: .../src/content/adapter.test.ts:2:50
 Test Files  1 failed (1)
      Tests  no tests
```

## GREEN

```
$ npm run test -- src/content
 Test Files  1 passed (1)
      Tests  6 passed (6)
   Duration  482ms
```

(6 = 3 × `makeT`, 2 × `contentSource`, 1 × `assertServableInProduction` D23.)

## verify

```
$ npm run verify
> tsc --noEmit                → clean
> eslint .                    → clean
> prettier --check .          → All matched files use Prettier code style!
> vitest run                  → Test Files 7 passed (7) | Tests 38 passed (38)
```

Output pristine apart from the pre-existing Vitest `configLoader: 'native'` warning about `vitest.config.ts` being ESM-in-CJS. No Node EBADENGINE noise appeared in this run. `npm run format:write` (via `npx prettier --write` on the touched files) reported all four TS files already formatted; prettier cannot infer a parser for `.env.example` when named explicitly, and skips it silently during the directory-wide `--check`, so `npm run format` is green.

## Environment questions the brief could not answer

- **`server-only` typechecked as-is — nothing installed.** The npm package is *not* present in `node_modules`; Next ships a compiled copy (`node_modules/next/dist/compiled/server-only`) and, crucially for `tsc`, a `declare module 'server-only'` block in `node_modules/next/types/global.d.ts:57`. `tsc --noEmit` and `eslint .` both accept `import 'server-only'`. The sanctioned `npm install server-only` fallback was **not** needed; no dependency was added.
- **`fetch(..., { next: { revalidate, tags } })` typechecked as-is.** Next's global `RequestInit` augmentation (`next-env.d.ts` present) covers it; no cast to `any` anywhere.
- **`.env.example` ignore check:** `git check-ignore -q .env.example` → exit **1** (not ignored). The scaffold's `.gitignore` already carries `!.env.example` at line 45, after its `.env` / `.env.*` rules, so no `.gitignore` change was needed. The file is committed in `6910597`.

## Files changed

- `src/content/adapter.ts` (new)
- `src/content/adapter.test.ts` (new)
- `src/content/config.ts` (new)
- `src/content/pure.ts` (new)
- `.env.example` (new)

133 insertions, no modifications to existing files. Nothing under `contract/` was touched.

## Self-review

- **Completeness.** Every "Produces" export is reachable from `@/content/adapter`: verified by compiling a throwaway `src/content/__surface-check.ts` that imports `getBundle`, `makeT`, `contentSource`, `assertServableInProduction` and `BundleUnavailableError` from `@/content/adapter` and threads `contentSource()` into `assertServableInProduction` — `tsc --noEmit` exit 0; the probe file was deleted before committing (`git status` clean). `.env.example` carries all six variables.
- **Fail-closed.** `loadOps` throws `BundleUnavailableError` on a non-OK HTTP status and on a `safeParse` failure (with the first offending path in the message); it never returns a partial or coerced bundle. `loadLocal` uses `BundleSchema.parse`, which throws on a malformed local bundle. `getBundle` runs the D23 guard *after* loading, so a LOCAL bundle carrying `pool`/`stories`/`representatives` rows can never be returned in production.
- **Discipline.** No extra surface (no site-health, no preview tokens, no `ContentSource` re-export beyond what the ruling named), no new dependency, no `next build`, no Playwright, no push, one job at a time.
- **Testing.** The six assertions exercise real behaviour (real fixture parsed through the real schema, real env stubbing, real D23 matrix of source × env), not mocks of the code under test.

## Concerns

1. **`loadOps` JSON-parse path.** If Operations returns HTTP 200 with a non-JSON body, `await res.json()` rejects with a `SyntaxError` rather than a `BundleUnavailableError`. It still fails closed (nothing partial is returned), but a caller that catches only `BundleUnavailableError` would see a different class. Left exactly as the brief specifies; worth folding into the OPS error handling when WP-B wires the real call.
2. **`loadOps` and `getBundle` are untested.** Both live behind `import 'server-only'`, which is why R2 split the file; they will first be exercised by the Phase B / route-level work. The OPS branch's `revalidate: 900` + `site:${locale}` tag (D8) is currently proven by code review only.
3. **`makeT`'s unknown-id throw keys off `process.env.NODE_ENV`, evaluated per call.** That is the brief's design and it matches the test, but it means a production build silently returns `''` for a typo'd id — the catalogue completeness check (Task 4's importer) remains the real guard against that.
