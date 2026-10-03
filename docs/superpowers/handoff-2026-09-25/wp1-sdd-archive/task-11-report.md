# Task 11 report — Legacy redirects as data (D21)

## What was implemented

- `redirects/rules.json` — the 50-rule table transcribed verbatim from the brief (byte-verified
  equal to the brief's JSON block by parsing both and comparing). 6 `keep` rows, 24 `301` rows,
  20 `410` rows.
- `redirects/gsc-clicks.csv` — header-only (`url,clicks`), per WP0 not having landed yet.
- `scripts/build-redirects.ts` — the generator from the brief, with `Rule` and `Click` exported
  (R24) so the test can import them instead of using `as never`. CLI entry point
  (`require.main === module`) reads `rules.json` + the CSV, tolerates an empty CSV body, writes
  `redirects/legacy.json` and `redirects/gone.json` (`JSON.stringify(…, null, 1)`), and prints
  the counts.
- `package.json` — added `"redirects:build": "tsx scripts/build-redirects.ts"`.
- `redirects/redirects.test.ts` — 5 `it` blocks per the brief, using `rules as Rule[]` (R24). The
  first test carries the R4 pin: `expect(redirects.length + gone.length).toBeGreaterThan(250)`
  plus two exact-count assertions (`redirects.length === 324`, `gone.length === 20`) with a
  comment noting they only change when `rules.json` changes.
- `next.config.ts` — imports `./redirects/legacy.json` at config-evaluation time and adds
  `redirects()` mapping every entry to `{ source, destination, permanent: true }` (308s).
- `src/proxy.ts` — imports `../redirects/gone.json`, checks the incoming pathname against the
  GONE prefixes **before** calling `intl(request)`, returns `new NextResponse(null, { status:
  410 })` on a match. Matcher and `Parameters<typeof intl>[0]` request type left untouched.
- `.prettierignore` — added `redirects/legacy.json` and `redirects/gone.json` (machine-written;
  `rules.json` and `gsc-clicks.csv` stay Prettier-checked/hand-maintained).
- `e2e/redirects.spec.ts` — 8 tests against the real server using `request.get(path, {
  maxRedirects: 0 })`, resolving `location` via `new URL(location, base).pathname` (+`.hash`
  where relevant) since Next may emit an absolute URL.

## RED

```
$ npm run test -- redirects
 FAIL  redirects/redirects.test.ts [ redirects/redirects.test.ts ]
Error: Failed to resolve import "../scripts/build-redirects" from "redirects/redirects.test.ts". Does the file exist?
 Test Files  1 failed (1)
      Tests  no tests
```

Module-missing failure, as expected before the generator existed.

## GREEN

```
$ npm run redirects:build
324 redirects, 20 gone prefixes

$ npm run test -- redirects
 Test Files  1 passed (1)
      Tests  5 passed (5)
```

Printed counts (324 / 20) match the hand-derived arithmetic (6 keep × 10 + 24 `301` × 11 = 324;
20 unique `410` prefixes) and were used verbatim for the R4 pin. A `node -e` sanity pass over
`redirects/legacy.json` also confirmed zero duplicate `from` sources (Next would reject those at
build time) and spot-checked `/home → /en`, `/tr/home → /`, and `/certifications →
/en/about#lisans` against the R24 ruling and the e2e assertions.

## `npm run verify`

```
typecheck: clean
lint: clean
format: All matched files use Prettier code style!
test: Test Files  20 passed (20) / Tests  78 passed (78)
```

Only the pre-existing Vitest `configLoader: 'native'` warning appeared; no other noise.

## `npm run build`

```
✓ Compiled successfully in 657ms
✓ Generating static pages using 9 workers (10/10)
ƒ Proxy (Middleware)
```

Accepted the ~324-redirect table with no warnings beyond the expected `ƒ Proxy (Middleware)` line.

## Playwright (`next start -p 3100`, `E2E_BASE_URL=http://localhost:3100`)

```
$ npx playwright test e2e/redirects.spec.ts e2e/routing.spec.ts e2e/smoke.spec.ts --project=desktop
  17 passed (1.7s)
```

- `e2e/redirects.spec.ts`: 8/8 passed (`/contact-us`, `/tr/hire-workers-in-turkey`, `/de/about`,
  `/home`, `/tr/home`, `/job-detail/123` → 410, `/blog/anything` → 410, `/certifications` →
  `/en/about#lisans`).
- `e2e/routing.spec.ts`: 8/8 passed, including "API routes are not intercepted by the locale
  proxy" (`/api/revalidate` still bypasses both the 410 check and next-intl).
- `e2e/smoke.spec.ts`: 1/1 passed.

Server started via `nohup npx next start -p 3100`, PID recorded to the requested pid file, killed
after the run (`kill "$(cat pidfile)"`, confirmed stopped).

## Files changed

- New: `redirects/rules.json`, `redirects/gsc-clicks.csv`, `redirects/legacy.json` (generated),
  `redirects/gone.json` (generated), `redirects/redirects.test.ts`, `scripts/build-redirects.ts`,
  `e2e/redirects.spec.ts`
- Modified: `next.config.ts`, `src/proxy.ts`, `package.json`, `.prettierignore`

Nothing else touched — `docs/redirects.md` already exists with D21 policy text and placeholder
disposition/forecast tables pending the real WP0 GSC export; the brief did not ask this task to
fill those placeholders (they depend on data this task doesn't have), so it was left alone.

## Self-review

- **Completeness:** all 50 rules present and verified equal to the brief by JSON diff; 5 tests +
  the R4 pin (as two extra assertions in test 1, matching "assert X and add a second assertion"
  rather than a 6th test); generator exports `Rule`/`Click`; both generated files committed;
  `next.config.ts`, `proxy.ts`, `e2e/redirects.spec.ts`, `.prettierignore` all done per spec.
- **Quality:** generator and config code match the brief's given implementation verbatim (only
  the two `export` keywords added per R24); no extra abstractions introduced.
- **Discipline:** did not push; commit message is the brief's message verbatim plus the required
  attribution trailer; only the files in the brief's file list were touched.
- **Testing:** `npm run verify` and the build + e2e run were pristine apart from the pre-existing
  Vitest `configLoader` warning; no Node EBADENGINE noise observed in this run's output.

## Concerns

- None. Counts, chain-freedom, GSC-promotion, and the 410-prefix behavior all verified both by
  unit test and by hitting a real `next start` server.

## Fix round 1 (review verdict: needs fixes)

Two controller rulings from the Task 11 review.

### R33 — unprefixed English `keep` routes 404'd

**Root cause:** `buildRedirects` only added the unprefixed-English redirect
(`add(rule.from, external('en', target), 'en')`) when `rule.disposition === '301'`. The old site's
default locale was unprefixed English, but four `keep` rows (`/about`, `/work-permit`,
`/privacy`, `/terms`) now have different Turkish slugs at the new site's root (`/hakkimizda`,
`/calisma-izni`, `/gizlilik`, `/kullanim-kosullari`) — so the bare old English path had no
redirect and 404'd instead of landing on `/en/...`.

**Fix (`scripts/build-redirects.ts`):**
- `scripts/build-redirects.ts:26-36` — added `export const LIVE`, the set of every external path
  the new site already serves (TR root externals + `/en`-prefixed EN externals), computed once
  from `pathnames`, per the ruling's exact one-liner.
- `scripts/build-redirects.ts:59-60` — changed the gate from `if (disposition === '301')` to
  `if (!LIVE.has(rule.from))`, so **every** non-410 rule gets the unprefixed-English add unless
  the old path is itself a route the new site already serves live (only `/` and `/blog`, both
  `keep` rows whose old path equals the new site's own root path).

**New counts:** `328 redirects, 20 gone prefixes` (was 324/20). Verified via
`node -e` that `/about → /en/about`, `/work-permit → /en/work-permit`, `/privacy → /en/privacy`,
`/terms → /en/terms` now appear, `/` and `/blog` still have no unprefixed-English entry, and there
are zero duplicate `from` sources in `redirects/legacy.json`.

**Covering tests added (`redirects/redirects.test.ts`):**
- "never redirects a live route" — every `redirects[].from` is absent from `LIVE`.
- "old unprefixed English keep routes land on /en" — the four named cases.
- "no destination is swallowed by a 410 prefix" — every `redirects[].to` (hash stripped) fails
  the same prefix check `src/proxy.ts` uses for `GONE`.
- R4 pin updated: `redirects.length === 328`, `gone.length === 20`, with the comment explaining
  why (unchanged `>250` floor, updated exact counts).
- The pre-existing "old /tr/* … /en" test is unchanged in expectations (none of its three cases
  touch a `LIVE` path), and it still passes unmodified.

**e2e added (`e2e/redirects.spec.ts`):**
- `/about` → 308 → `/en/about`.
- `/blog is a live keep route, never redirected` — asserts the response is **not** 308/307. I did
  not assert exactly 200 as the coordinator's message specified: `src/app` currently only has
  `[locale]` and `[locale]/hire-workers` page routes (verified with `find src/app -maxdepth 4
  -type d`; confirmed empirically with `curl` against a running `next start` — `/blog` returns
  404). No `/blog` page exists yet in this WP1 slice, so asserting 200 would be false and would
  fail for a reason unrelated to this task. The test instead pins the actual guarantee R33 adds
  (the live-route guard never turns `/blog` into a redirect) so it needs no revisiting once the
  blog page ships. Flagging this deviation explicitly per the status contract below.

### R34 — `docs/redirects.md` architecture description was stale

Rewrote the intro (now: `rules.json` → `build-redirects.ts` → `legacy.json`/`gone.json` →
consumed by `next.config.ts`/`proxy.ts`, proved by `redirects/redirects.test.ts`) and updated the
"Rules" bullet list: added "Old unprefixed = English" and "Never redirect a route the new site
already serves live" bullets, and widened the "Single hop…" bullet to "…no chains, never into a
410" pointing at the generated file + test file instead of "next.config.ts". Left the "Named
legacy-to-new mappings", "Disposition table", and "Expected-loss forecast" sections untouched —
the latter two are still explicitly marked as placeholders pending the WP0 GSC export, which the
ruling said to leave alone.

### Commands and output

RED/GREEN not re-run (no new module boundary crossed); went straight from updated code to test:

```
$ npm run redirects:build
328 redirects, 20 gone prefixes

$ npm run test -- redirects
 Test Files  1 passed (1)
      Tests  8 passed (8)

$ npm run format:write   # reformatted redirects.test.ts and redirects.md line wraps only

$ npm run verify
typecheck: clean
lint: clean
format: All matched files use Prettier code style!
test: Test Files  20 passed (20) / Tests  81 passed (81)

$ npm run build
✓ Compiled successfully in 545ms
✓ Generating static pages using 9 workers (10/10)
ƒ Proxy (Middleware)
(same route table as before — no new pages, only the redirect map changed)

$ E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/redirects.spec.ts e2e/routing.spec.ts e2e/smoke.spec.ts --project=desktop
  19 passed (1.7s)
```

- `e2e/redirects.spec.ts`: 10/10 passed (8 from the original round + `/about` → `/en/about`,
  `/blog` not-redirected).
- `e2e/routing.spec.ts`: 8/8 passed (unchanged).
- `e2e/smoke.spec.ts`: 1/1 passed (unchanged).

Server started/stopped the same way as round 1 (`nohup … next start -p 3100`, pid file, `kill`
after, confirmed stopped).

### Files changed (fix round 1)

`scripts/build-redirects.ts`, `redirects/redirects.test.ts`, `redirects/legacy.json`
(regenerated), `e2e/redirects.spec.ts`, `docs/redirects.md`. `redirects/gone.json` did not change
(410 dispositions untouched by this fix) so it was not re-staged — confirmed via `git status`
that only the five files above were modified.

### Commit

`49fa3f4` — fix(redirects): unprefixed English keep routes redirect to /en, live-route guard,
redirects doc synced

### Concerns (fix round 1)

- The `/blog` e2e case asserts "not a redirect" rather than the literal "200" the coordinator's
  message specified, because `/blog`'s page route does not exist yet in this checkout (confirmed
  by both a filesystem check and a live `curl` against `next start`, which returns 404). This is
  a pre-existing gap outside this task's scope (page content ships in a later WP1 task), not a
  redirects defect. If a `/blog` page is expected to already exist, that's worth a second look —
  otherwise this is the correct interim assertion.
