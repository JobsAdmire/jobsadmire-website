# Task 13 report — Error pages, site-health and revalidate routes, dev gallery

**Branch:** `wp1/foundation` (worktree `jobsadmire-website-wp1`) · **Commit:** `6dd2f05` · **Status:** DONE_WITH_CONCERNS

## What I implemented

| File | What it does |
| --- | --- |
| `src/app/api/site-health/checks.ts` | `CheckResult`/`Checks`/`CODES`/`evaluate` — verbatim from the brief. |
| `src/app/api/site-health/checks.test.ts` | Verbatim from the brief (2 cases). |
| `src/app/api/site-health/route.ts` | `GET`, `dynamic = 'force-dynamic'`, `Promise.allSettled([getBundle('tr'), getBundle('en')])` → `ok`/`fail`; `lastRevalidate` `skip` in LOCAL else `fail` when null/older than 24 h; `opsPing` `skip`; responds `{ ok, reasons, checks, contractVersion, source, commit, at }` with 200/503 and `Cache-Control: no-store`. |
| `src/app/api/revalidate/auth.ts` | Pure `authorize(header, secret)` → `'ok' \| 'unauthorized' \| 'disabled'` (`MIN_SECRET_LENGTH = 16`, case-insensitive `Bearer` scheme, `timingSafeEqual` on equal-length buffers only) and `parseTags(body)` → `string[] \| null` (1–50, `/^[a-z0-9:_-]+$/`). |
| `src/app/api/revalidate/auth.test.ts` | 5 cases over the full status matrix and the tag grammar. |
| `src/app/api/revalidate/state.ts` | `recordRevalidate()` / `lastRevalidateAt()` — module-level `let`, commented as best-effort until WP5 replaces it with a real store. |
| `src/app/api/revalidate/route.ts` | `POST`, `dynamic = 'force-dynamic'`: 503 `{ error: 'revalidate disabled' }` when no usable secret, 401 on missing/wrong token, 400 on a malformed body, else `revalidateTag(tag, 'max')` per tag → `recordRevalidate()` → `{ revalidated, at }`. Every response `no-store`. |
| `src/app/[locale]/not-found.tsx` | Server component, `getTranslations('sys')`, `Link href="/"` (R6). |
| `src/app/[locale]/error.tsx` | `'use client'`, `useTranslations('sys')`, `reset` button; the error object is never rendered. |
| `src/app/global-error.tsx` | Own `<html lang="tr"><body>`, inline styles (no `globals.css` at that level), hard-coded bilingual copy, retry button. |
| `src/app/[locale]/[...rest]/page.tsx` | `notFound()` — next-intl's documented pattern, so every unmatched URL renders the locale 404 inside the chrome (R6). |
| `src/app/[locale]/dev/gallery/page.tsx` | `notFound()` in production on line 1 (R41); renders all 13 primitives and 13 chrome pieces from the real `getBundle(locale)`. |
| `src/app/[locale]/dev/gallery/DialogDemo.tsx` | Tiny client wrapper — `Dialog` needs an `onClose` function, which cannot cross the RSC boundary. |
| `src/content/adapter.ts` | R28: `await res.json()` wrapped in try/catch, rethrown as `BundleUnavailableError('bundle <locale>: invalid JSON')`. |
| `src/content/adapter.test.ts` | R28: `makeT` returns `''` for an unknown id under `NODE_ENV=production` (stubbed; the existing `afterEach` unstubs). |
| `src/design/chrome/Footer.tsx` | R40: `CookiePreferencesButton` gated on `analytics.consentMode && analytics.gtmId`. |
| `src/design/chrome/__tests__/Footer.test.tsx` | R40: positive case renders a bundle with `gtmId: 'GTM-TEST123'`; a second case asserts absence with the fixture (`gtmId: null`). |
| `e2e/ops.spec.ts` | 8 cases (site-health, the four revalidate doors, both 404s, the gallery's production 404). |
| `e2e/routing.spec.ts` | The "API routes are not intercepted" case now asserts the handler's own refusal (401 with a secret, 503 without) instead of the Task-1 stub's `{ ok: true }`. |
| `e2e/thank-you.spec.ts` | R40 flipped one assertion: with `gtmId: null` the footer's cookie-preferences button is **absent**, not present. |
| `docs/OPERATING.md` | The reason-code table ("exact codes land in WP1") replaced with what shipped: the four checks, the `skip` semantics, the 200/503 rule, the no-`generatedAt`-age note, and a second table of the checks still to land with their work packages. |
| `docs/ARCHITECTURE.md` | Operations-surface bullets rewritten to the shipped contract for both routes. |

No new dependencies.

## R42 — which `revalidateTag` form

**`revalidateTag(tag, 'max')`.** Type evidence, `node_modules/next/dist/server/web/spec-extension/revalidate.d.ts` (re-exported by `node_modules/next/cache.d.ts`):

```ts
type CacheLifeConfig = { expire?: number };
export declare function revalidateTag(tag: string, profile: string | CacheLifeConfig): undefined;
```

The profile argument is not optional in Next 16.3.5 — the single-argument form does not typecheck. `'max'` is the profile that matches this site's content classes (`stale 5 min, revalidate 30 days, expire never`): the tag purge is what drives freshness, not the profile's own clock.

## RED → GREEN

RED — `npx vitest run src/app/api src/content/adapter.test.ts` before `checks.ts`/`auth.ts` existed:

```
FAIL  src/app/api/revalidate/auth.test.ts [ src/app/api/revalidate/auth.test.ts ]
Error: Failed to resolve import "./auth" from "src/app/api/revalidate/auth.test.ts". Does the file exist?
FAIL  src/app/api/site-health/checks.test.ts [ src/app/api/site-health/checks.test.ts ]
Error: Failed to resolve import "./checks" from "src/app/api/site-health/checks.test.ts". Does the file exist?

 Test Files  2 failed | 1 passed (3)
      Tests  7 passed (7)
```

(The R28 adapter case is a characterization test — `makeT` already degraded to `''` in production — so it was green from the start; the R28 code change is the `loadOps` JSON guard, which has no unit test prescribed.)

GREEN — `npx vitest run src/app/api`:

```
 Test Files  2 passed (2)
      Tests  7 passed (7)
```

R40 (`npx vitest run src/design/chrome src/content`): `Test Files 6 passed (6) · Tests 31 passed (31)`.

## verify

```
npm run verify
  typecheck  clean
  lint       clean
  format     All matched files use Prettier code style!
  test       Test Files 25 passed (25) · Tests 107 passed (107)
```

98 → 107 unit tests: +2 `checks`, +5 `auth`, +1 adapter (R28), +1 Footer (R40). Output is pristine apart from the pre-existing Vitest `configLoader: 'native'` warning.

## Build

```
npm run build
✓ Compiled successfully in 858ms
  Finished TypeScript in 1778ms
✓ Generating static pages (13/13)

├ ƒ /[locale]/[...rest]
├   /[locale]/dev/gallery        ● /tr/dev/gallery   ● /en/dev/gallery
├ ƒ /api/revalidate
├ ƒ /api/site-health
```

No warnings. The gallery's two entries are prerendered **as the 404** — the production guard runs during the build, so nothing of the gallery is in the output (proved by the e2e case below).

## Playwright

Server: `REVALIDATE_SECRET=wp1-local-secret-0123456789 npm run start -- -p 3100`, pid file in the scratchpad, killed afterwards (both ports confirmed free).

Prescribed run — `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/ops.spec.ts e2e/routing.spec.ts e2e/smoke.spec.ts --project=desktop`:

```
17 passed (2.1s)   ops 8 · routing 8 · smoke 1
```

I also ran the **whole** suite once, because a catch-all route can quietly change redirect and SEO behaviour: `36 passed` (ops 8, routing 8, smoke 1, seo 5, redirects 10, thank-you 4). That run is what caught the R40 assertion in `thank-you.spec.ts` (see below).

Manual checks against the running servers:

- `curl -i localhost:3100/api/site-health` → `200`, `cache-control: no-store`, `{"ok":true,…,"checks":{"bundleTr":"ok","bundleEn":"ok","lastRevalidate":"skip","opsPing":"skip"},"contractVersion":"1.0","source":"LOCAL","commit":null,…}`.
- A dev server started **without** `REVALIDATE_SECRET`: `POST /api/revalidate` → `503 {"error":"revalidate disabled"}` (the never-open door, which no production-build e2e can reach).
- `GET /dev/gallery` on that dev server → `200`, 241 KB, every primitive present (`aria-pressed`, `g-name-hint`, `g-mail-error`, `role="tablist"`, `role="alert"`, the marquee, the timeline); `/en/dev/gallery` → `200`. No errors or warnings in the dev log.

## Self-review findings (fixed before committing)

1. **`e2e/thank-you.spec.ts` asserted the opposite of R40** — "the withdrawal door is in the footer whether or not the sheet is mounted". R40 is a deliberate behaviour change, so the assertion was flipped to `toHaveCount(0)` with the reason in a comment. Caught by running the full suite.
2. **`e2e/routing.spec.ts` asserted the Task-1 stub's `{ ok: true }`** — impossible once the route authenticates. Rewritten to accept the handler's own refusal (`[401, 503]` + an `error` property), which is still proof the proxy did not intercept it; the exact status matrix lives in `ops.spec.ts`.
3. **`navItems[0]` in the gallery could be `undefined`** with a bundle carrying no `desktopNav` rows (no `noUncheckedIndexedAccess` in this tsconfig, so TS did not catch it). Now conditional.
4. Secret hygiene re-checked: `authorize` never returns, logs or echoes the secret; no response body or header carries it; the 401/503/400 bodies are fixed strings.
5. No partial purge re-checked: `parseTags` validates the whole array before `route.ts` calls `revalidateTag` even once.

## Concerns

1. **`opsPing` is `'skip'` unconditionally, not just in LOCAL.** The brief specifies `skip` for LOCAL and leaves OPS to WP3a. Since no ping call exists yet, reporting `ok` in OPS would be the exact dishonesty D25 forbids and `fail` would page the owner over an unimplemented check — so it reports `skip` in both modes, with the reason in a comment. WP3a makes it conditional.
2. **`lastRevalidate` will be noisy the moment the adapter flips to OPS.** `state.ts` is module-level: on Vercel every cold instance reports `null` → `fail` → a 503 from `/api/site-health` → the external monitor pages the owner. **WP5's real store must land before `CONTENT_SOURCE=OPS`**, or the monitor's first week in Phase B is false alarms. Flagged here because the brief's design makes this inevitable, not accidental.
3. **The `[...rest]` catch-all makes every unmatched URL a function invocation** (`ƒ` in the build output) rather than the static `/_not-found`. That is the price of a localized, chromed 404; worth remembering if a crawler ever floods dead URLs (the 410 prefixes in `proxy.ts` still short-circuit before it).
4. **The gallery renders the fixed-position chrome on top of `SiteChrome`'s own copies** (`SocialRail`, `WhatsAppFab`, `MobileBottomBar`, `StickyCtaBar`). They are `position: fixed` by their own classes, so a gallery cannot box them. R41 asks for every chrome piece that takes plain props, so they are listed; the overlap is noted in a comment. `ConsentBanner` is the useful exception — the layout does not mount it in Phase A (`gtmId: null`), so the gallery is the only place to see it.
5. **`next dev` appends a `<!-- BEGIN:nextjs-agent-rules -->` block to `CLAUDE.md`** (`node_modules/next/dist/server/lib/generate-agent-files.js`). I reverted it rather than commit an unrequested change to the repo rulebook; it is not in `HEAD` and it will reappear for anyone who runs `next dev`. The controller should decide whether to commit it once or gitignore the behaviour.
6. **`error.tsx` reports nothing anywhere.** No Sentry in WP1, so a caught render error is currently invisible except in the Vercel function log. WP6 wires it.

---

## Fix round 1 — R43 + two minors

**Commit:** `3aa2885` `test(ops): skip secret-dependent e2e cases when the runner has no REVALIDATE_SECRET` · 2 files, +11/−3 · not pushed.

### R43 (Important) — `e2e/ops.spec.ts`

The header comment claimed a skip that did not exist, and `SECRET` fell back to the literal secret, so on a preview with a different secret the two token-bearing cases would have failed with a 401 that looks like a broken route rather than a misconfigured run.

- `e2e/ops.spec.ts:4-10` — the comment now states the real rule, and the fallback is gone:
  ```ts
  // R43: the two cases that need a valid token read the secret from the runner's own
  // environment and are skipped outright when it has none — a guessed fallback would fail
  // against any server started with a different secret (it would 401, and the failure would
  // look like a broken route rather than a misconfigured run). Every other case needs no
  // secret and always runs.
  const SECRET = process.env.REVALIDATE_SECRET;
  const NO_SECRET = 'REVALIDATE_SECRET not provided to the runner';
  ```
- `e2e/ops.spec.ts:43` — `test.skip(!SECRET, NO_SECRET);` as the first statement of "revalidate accepts the secret and reports the tags it purged".
- `e2e/ops.spec.ts:54-56` — the same guard on "revalidate rejects a malformed tag before purging anything", above it the reason it is one of the two: `// Auth runs before the body is parsed, so reaching the 400 needs a valid token too.` There is no separate unauthenticated malformed-tag case, so nothing else needed the guard.
- Unchanged and unconditional: site-health, the two 401 cases (unauthenticated / wrong token — neither reads `SECRET`), both 404 cases, the gallery case.

### Minors

1. **`src/content/adapter.test.ts`** — no change needed: the `makeT` describe already carries its own `afterEach(() => vi.unstubAllEnvs())` (`adapter.test.ts:10`), added in the original file and kept when the R28 case was appended, so the `NODE_ENV=production` stub cannot leak. Verified by reading the file rather than assumed.
2. **`src/app/api/site-health/route.ts:3`** — comment added above the relative contract import:
   ```ts
   // Relative on purpose: the `@/` alias covers `src/` only, and `contract/` is a sibling.
   import { CONTRACT_VERSION } from '../../../../contract/website-bundle.v1';
   ```

### Commands and output

`npm run format:write` ran first (no diff beyond the edits above).

```
npm run test -- src/content src/app/api
 Test Files  4 passed (4)
      Tests  18 passed (18)

npm run verify
  typecheck clean · lint clean · format "All matched files use Prettier code style!"
  Test Files  25 passed (25) · Tests  107 passed (107)
```

No rebuild: the only app-code change is a comment, so the existing `.next` from the task's build was reused for both runs. Server each time: `REVALIDATE_SECRET=wp1-local-secret-0123456789 npm run start -- -p 3100`, killed after the run (port confirmed free at the end).

**Run 1 — runner given the same secret** (`E2E_BASE_URL=http://localhost:3100 REVALIDATE_SECRET=wp1-local-secret-0123456789 npx playwright test e2e/ops.spec.ts e2e/routing.spec.ts e2e/smoke.spec.ts --project=desktop`):

```
  ✓   4 [desktop] › e2e/ops.spec.ts:42:5 › revalidate accepts the secret and reports the tags it purged (8ms)
  ✓   5 [desktop] › e2e/ops.spec.ts:55:5 › revalidate rejects a malformed tag before purging anything (4ms)
  17 passed (2.2s)        ops 8 · routing 8 · smoke 1
```

**Run 2 — runner's `REVALIDATE_SECRET` unset** (`env -u REVALIDATE_SECRET …`, server still holding the secret so the 401 cases stay meaningful):

```
  -   4 [desktop] › e2e/ops.spec.ts:42:5 › revalidate accepts the secret and reports the tags it purged
  -   5 [desktop] › e2e/ops.spec.ts:55:5 › revalidate rejects a malformed tag before purging anything
  2 skipped
  15 passed (1.9s)
```

### Concerns

None new. The six concerns in the section above stand unchanged; nothing in this round touched runtime behaviour.
