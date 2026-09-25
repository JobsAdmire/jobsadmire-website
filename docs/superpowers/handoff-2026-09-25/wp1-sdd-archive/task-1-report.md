# Task 1 report — Stack spike: Next 16 + next-intl 4 routing

**Status: DONE** — the D5 spike passes. All eight routing e2e tests are green on Next 16.3.5 + next-intl 4.14.5, `npm run verify` is green, and `next build` is clean with no "middleware" deprecation warning. No fallback to Next 15 / next-intl 3 is needed.

- Branch: `wp1/foundation` (worktree `jobsadmire-website-wp1`)
- Commit: `3fd5c22` — `feat(i18n): Turkish-root routing with localized pathnames (next-intl 4, proxy.ts)`
- Installed `next-intl` version: **4.14.5** (`npm install next-intl@^4`; `package.json` records `"next-intl": "^4.14.5"`). No other new dependency.

## What I implemented

Exactly the brief, verbatim, no additions:

- `src/i18n/routing.ts` — `locales = ['tr','en'] as const`, `type Locale`, the 22-entry `pathnames` table (internal key → per-locale external path), and `routing = defineRouting({ defaultLocale: 'tr', localePrefix: 'as-needed', localeDetection: false, localeCookie: { name: 'ja_locale', maxAge: 31536000 }, pathnames })`.
- `src/i18n/navigation.ts` — `createNavigation(routing)` re-exporting `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`. `getPathname` exported as-is (not wrapped).
- `src/i18n/request.ts` — `getRequestConfig` with `hasLocale` guard, dynamic import of `../messages/${locale}.json`.
- `src/messages/tr.json`, `src/messages/en.json` — the seven `sys.*` keys.
- `src/proxy.ts` — `createMiddleware(routing)` behind a `proxy` default export, matcher `['/((?!api|_next|_vercel|.*\\..*).*)']`.
- `next.config.ts` — wrapped with `createNextIntlPlugin('./src/i18n/request.ts')`; `reactStrictMode: true`, `poweredByHeader: false`.
- `src/app/[locale]/layout.tsx` (new root layout; imports `../globals.css`), `src/app/[locale]/page.tsx`, `src/app/[locale]/hire-workers/page.tsx`, `src/app/api/revalidate/route.ts`.
- Deleted `src/app/layout.tsx` and `src/app/page.tsx` (the create-next-app scaffold page). `src/app/globals.css` and `src/app/favicon.ico` stay where they were.
- Tests: `src/i18n/routing.test.ts` (3 cases), `e2e/routing.spec.ts` (8 cases). `e2e/smoke.spec.ts` untouched.

### Proxy request type

I used the brief's **`Parameters<typeof intl>[0]`** — it typechecks against next-intl 4.14.5, whose `createMiddleware` is declared as `(routing) => (request: NextRequest) => NextResponse<unknown>`, so the parameter resolves to `NextRequest`. No fallback to importing `NextRequest` from `next/server` was needed.

Next 16.3.5 does support the `proxy` file convention: `node_modules/next/dist/lib/constants.js` defines `PROXY_FILENAME = 'proxy'` and `PROXY_LOCATION_REGEXP = '(?:src/)?proxy'`. The deprecation warning (`The "middleware" file convention is deprecated. Please use "proxy" instead.`) is emitted from `next/dist/build/index.js:730` only when a `middleware` file is present — it does not appear in our build.

## What I tested, and the results

### 1. Unit test

```
$ npm run test -- src/i18n/routing.test.ts
 RUN  v4.1.11 /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp1
 Test Files  1 passed (1)
      Tests  3 passed (3)
```

### 2. `npm run verify` (typecheck + lint + prettier check + vitest)

```
$ npm run verify
> tsc --noEmit            (no output)
> eslint .                (no output)
> prettier --check .      Checking formatting... All matched files use Prettier code style!
> vitest run
 Test Files  2 passed (2)
      Tests  4 passed (4)
```

(The 4th test is the pre-existing `src/lib/sanity.test.ts`.)

The only console noise is a **pre-existing** scaffold warning from Vitest 4 about `vitest.config.ts` using ESM syntax under `configLoader: 'native'`. It predates this task (it fires on the untouched scaffold config) and I left it alone rather than changing tooling outside the brief.

### 3. `npm run build`

```
$ npm run build
▲ Next.js 16.3.5 (Turbopack)
✓ Running next.config.ts took 1692ms
  Creating an optimized production build ...
✓ Compiled successfully in 1544ms
  Running TypeScript ...
  Finished TypeScript in 986ms ...
✓ Generating static pages using 7 workers (8/8) in 305ms
  Finalizing page optimization ...

Route (app)
┌ ○ /_not-found
├   /[locale]
│ ├ ● /tr
│ └ ● /en
├   /[locale]/hire-workers
│ ├ ● /tr/hire-workers
│ └ ● /en/hire-workers
└ ƒ /api/revalidate

ƒ Proxy (Middleware)
```

`grep -ni "deprecat|warn|⚠"` over the full build log returns **nothing**: no middleware deprecation warning, no warnings of any kind. Note the build labels the edge function **"Proxy (Middleware)"** — that is Next 16's own label for the `proxy.ts` convention, not a deprecation notice. `app/favicon.ico` still resolves (`/favicon.ico/route` in `app-path-routes-manifest.json`) even though the only layout now lives under `[locale]`.

### 4. Playwright (production server on port 3100, `desktop` project only)

Server started with `nohup npm run start -- -p 3100`, pid written to the session scratchpad (`…/scratchpad/next.pid`), and killed afterwards — port 3100 confirmed released.

```
$ E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts e2e/smoke.spec.ts --project=desktop --reporter=list
Running 9 tests using 1 worker
  ✓  1 [desktop] › e2e/routing.spec.ts:3:5 › root is Turkish, unprefixed (137ms)
  ✓  2 [desktop] › e2e/routing.spec.ts:9:5 › /en is English (96ms)
  ✓  3 [desktop] › e2e/routing.spec.ts:14:5 › a superfluous /tr prefix redirects to the root form (87ms)
  ✓  4 [desktop] › e2e/routing.spec.ts:20:5 › localized Turkish slug renders the internal route (88ms)
  ✓  5 [desktop] › e2e/routing.spec.ts:25:5 › English slug under /en renders the internal route (92ms)
  ✓  6 [desktop] › e2e/routing.spec.ts:30:5 › the Link component emits the localized href (97ms)
  ✓  7 [desktop] › e2e/routing.spec.ts:35:5 › API routes are not intercepted by the locale proxy (29ms)
  ✓  8 [desktop] › e2e/routing.spec.ts:41:5 › the locale cookie uses our name (80ms)
  ✓  9 [desktop] › e2e/smoke.spec.ts:3:5 › home responds (81ms)

  9 passed (3.6s)
```

### 5. Extra manual probes (not committed as tests — evidence for the spike)

Because test 8 only proves the *absence* of `NEXT_LOCALE`, I confirmed the positive case by hand against the same running production server:

```
$ curl -sD - -o /dev/null http://localhost:3100/en | grep -i 'set-cookie|^link'
link: <http://localhost:3100/>; rel="alternate"; hreflang="tr", <http://localhost:3100/en>; rel="alternate"; hreflang="en", <http://localhost:3100/>; rel="alternate"; hreflang="x-default"
set-cookie: ja_locale=en; Path=/; Expires=Sat, 18 Sep 2027 16:35:50 GMT; Max-Age=31536000; SameSite=lax

$ curl -sD - -o /dev/null http://localhost:3100/                 → set-cookie: ja_locale=tr; … Max-Age=31536000
$ curl -sD - -o /dev/null http://localhost:3100/tr/isci-talebi   → HTTP/1.1 307, location: /isci-talebi
$ curl -sD - -o /dev/null http://localhost:3100/hire-workers     → HTTP/1.1 307, location: /isci-talebi
$ curl -s http://localhost:3100/isci-talebi     | grep hire-h1   → data-testid="hire-h1">tr
$ curl -s http://localhost:3100/en/hire-workers | grep hire-h1   → data-testid="hire-h1">en
$ curl -s http://localhost:3100/                | grep 'hire'    → <a href="/isci-talebi">hire</a>
$ curl -sX POST http://localhost:3100/api/revalidate             → {"ok":true} (200)
```

So: the cookie really is `ja_locale` with the 1-year max-age, alternate-link hreflang headers are emitted by the proxy, and requesting the *English* slug at the TR root (`/hire-workers`) 307s to the Turkish form rather than 404ing.

## Files changed

| File | Change |
|---|---|
| `package.json`, `package-lock.json` | `next-intl@^4.14.5` added (dependency) |
| `next.config.ts` | wrapped with `createNextIntlPlugin`; `reactStrictMode`, `poweredByHeader` |
| `src/i18n/routing.ts` | new — locales, `Locale`, `pathnames`, `routing` |
| `src/i18n/navigation.ts` | new — `createNavigation` exports |
| `src/i18n/request.ts` | new — `getRequestConfig` |
| `src/i18n/routing.test.ts` | new — 3 unit tests |
| `src/messages/tr.json`, `src/messages/en.json` | new — `sys.*` copy |
| `src/proxy.ts` | new — next-intl proxy + matcher |
| `src/app/[locale]/layout.tsx` | new — root layout (html/lang, `NextIntlClientProvider`, `generateStaticParams`) |
| `src/app/[locale]/page.tsx` | new — temporary home (replaced in WP2) |
| `src/app/[locale]/hire-workers/page.tsx` | new — temporary proof route |
| `src/app/api/revalidate/route.ts` | new — POST stub proving the matcher excludes `/api` |
| `src/app/layout.tsx`, `src/app/page.tsx` | deleted (create-next-app scaffold) |
| `e2e/routing.spec.ts` | new — 8 e2e tests |
| `docs/PRD.md` | **incidental**: 2 whitespace-only lines — see concerns |

## Self-review findings

- **Brief fidelity:** every file is byte-for-byte what the brief specifies (I diffed each against the brief before committing). The `pathnames` table is the brief's table exactly — 22 entries, internal keys only; nothing added, renamed, or reordered.
- **No overbuilding:** I did not add a `not-found.tsx`, an `error.tsx`, `setRequestLocale` helpers, a `Locale`-typed `params`, or messages beyond `sys.*`, even though the `sys.*` keys hint at them — those belong to later tasks.
- **`Locale` and `getPathname` are currently unused exports.** That's intentional (the brief lists them as this task's produced interface for later tasks); ESLint does not flag exported symbols.
- **`docs/PRD.md` drift.** `npm run format:write` corrected two pre-existing mis-aligned markdown table rows (the `/en/careers` and `/en/careers/[slug]` cells, left ragged by commit `a777683`). The change is whitespace-only and carries no content. I included it because `verify` runs `prettier --check .` over the whole repo, so `verify` cannot be green at HEAD without it. Flagging it because it is outside this task's stated file list.
- **Pristine output:** build log has zero warnings; Playwright run has zero flake/retries; the one remaining console warning in `vitest` is pre-existing scaffold noise in `vitest.config.ts` (documented above), untouched deliberately.
- **Server hygiene:** the port-3100 server was killed and the port confirmed free; pid file removed from the scratchpad.

## Issues and concerns

1. **Test 8 is weaker than its name.** `the locale cookie uses our name` only asserts `NEXT_LOCALE` is *absent* — it would pass even if no cookie were set at all. I verified the positive case by curl (`ja_locale=en; Max-Age=31536000`) and recorded it above, but left the test as the brief wrote it. If the controller wants, a one-line strengthening (`expect(names).toContain('ja_locale')`) would make it load-bearing.
2. **The `pathnames` table declares 20 routes that have no page yet.** Requesting e.g. `/hakkimizda` today rewrites to `/tr/about` and 404s. Expected at this stage (WP2+ adds the pages), and it does not affect the build, but it means the table is currently ahead of the app tree.
3. **`docs/ARCHITECTURE.md` was not updated.** The repo rulebook requires docs in the same change set as a behaviour change, and the "Stack spike" heading is only mandated by the brief on failure. Since the spike passed, I wrote nothing there — but the controller may want a later task (or a follow-up) to record the passing stack decision and the `proxy.ts`/`ja_locale`/`pathnames` shape in `docs/ARCHITECTURE.md`, which today still describes the routing only at the plan level.
4. **Node version mismatch (pre-existing).** `package.json` pins `engines.node: 22.x` and `.nvmrc` says `22`, but this machine runs Node v25.8.2, so every npm command prints an `EBADENGINE` warning. Everything (install, build, test) worked regardless. Not introduced here; worth a controller decision before CI/Vercel parity matters.
5. **`npm run gate` was not run.** The rulebook's task-completion checklist asks for it per work package against a preview URL; this is a single task inside WP1 with no preview deployment, and the brief did not ask for it.

---

# Fix round 1 — R8: prove the `ja_locale` cookie is set

**Status: DONE.** Finding addressed; the **fallback variant** of R8 was needed (visit `/`, then `/en`). Commit `17f7501` — `test(i18n): assert the ja_locale cookie is set`. Only `e2e/routing.spec.ts` changed; no rebuild (the `.next` output from the first round, `BUILD_ID HduOEaNF_DwWOSXTPrQzf`, was reused unchanged).

## What changed

`e2e/routing.spec.ts`, the single test `the locale cookie uses our name`:

```diff
 test('the locale cookie uses our name', async ({ page, context }) => {
+  // Two navigations on purpose: next-intl skips the cookie when the resolved locale already
+  // matches the browser's accept-language, so a cold /en in an English browser sets nothing.
+  await page.goto('/');
   await page.goto('/en');
   const names = (await context.cookies()).map((c) => c.name);
+  expect(names).toContain('ja_locale');
   expect(names).not.toContain('NEXT_LOCALE');
 });
```

The `not.toContain('NEXT_LOCALE')` assertion is kept, as ruled.

## Which variant was needed, and why

**The fallback variant.** I tried the ruled first form (single `page.goto('/en')` + `toContain('ja_locale')`) and it failed:

```
$ E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts --project=desktop --reporter=list
  1 failed
    [desktop] › e2e/routing.spec.ts:41:5 › the locale cookie uses our name
  7 passed (1.4s)

Error: expect(received).toContain(expected) // indexOf
Expected value: "ja_locale"
Received array: []
```

The reason is narrower than "only on a locale switch". next-intl's `syncCookie` (`node_modules/next-intl/dist/esm/production/middleware/syncCookie.js`) skips the cookie when it would be **redundant with content negotiation**: with no cookie present it only writes one if the `accept-language`-derived locale differs from the resolved locale.

I bisected it with curl against the same server — the `Accept-Language` header alone decides it:

```
$ for h in none 'Accept: text/html,…' 'Accept-Language: en-US,en;q=0.9' 'User-Agent: …Chrome/140'; do … done
none                                          -> 1   (set-cookie present)
Accept: text/html,application/xhtml+xml       -> 1
Accept-Language: en-US,en;q=0.9               -> 0   (no set-cookie)
User-Agent: Mozilla/5.0 Chrome/140            -> 1
```

That is why my first-round curl (no `Accept-Language`, so negotiation resolves to the `tr` default ≠ `en`) showed `set-cookie: ja_locale=en`, while Playwright's Chrome (`Accept-Language: en-US`) gets nothing on a cold `/en`. Not a defect: the cookie is the locale *override*, and an English browser asking for `/en` needs no override.

The two-navigation form is green under either browser language, which is what makes it a safe test rather than a machine-locale coincidence:
- browser `en-US`: `/` resolves `tr` ≠ negotiated `en` → writes `ja_locale=tr`; `/en` then rewrites it to `en`.
- browser `tr-TR`: `/` writes nothing (`tr` == `tr`); `/en` has no cookie and negotiates `tr` ≠ `en` → writes `ja_locale=en`.

The assertion is demonstrably load-bearing — it genuinely failed (received `[]`) before the fix, so it cannot pass vacuously.

## Commands and output

```
$ npm run start -- -p 3100          # pid → scratchpad/next.pid; .next reused, no rebuild
$ E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts --project=desktop --reporter=list
Running 8 tests using 1 worker

  ✓  1 [desktop] › e2e/routing.spec.ts:3:5 › root is Turkish, unprefixed (104ms)
  ✓  2 [desktop] › e2e/routing.spec.ts:9:5 › /en is English (90ms)
  ✓  3 [desktop] › e2e/routing.spec.ts:14:5 › a superfluous /tr prefix redirects to the root form (76ms)
  ✓  4 [desktop] › e2e/routing.spec.ts:20:5 › localized Turkish slug renders the internal route (94ms)
  ✓  5 [desktop] › e2e/routing.spec.ts:25:5 › English slug under /en renders the internal route (86ms)
  ✓  6 [desktop] › e2e/routing.spec.ts:30:5 › the Link component emits the localized href (86ms)
  ✓  7 [desktop] › e2e/routing.spec.ts:35:5 › API routes are not intercepted by the locale proxy (14ms)
  ✓  8 [desktop] › e2e/routing.spec.ts:41:5 › the locale cookie uses our name (97ms)

  8 passed (1.1s)

$ E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/smoke.spec.ts --project=desktop --reporter=list
  ✓  1 [desktop] › e2e/smoke.spec.ts:3:5 › home responds (89ms)
  1 passed (462ms)

# server killed, port 3100 confirmed released, pid file removed

$ npm run verify
> tsc --noEmit            (no output)
> eslint .                (no output)
> prettier --check .      All matched files use Prettier code style!
> vitest run              Test Files 2 passed (2) · Tests 4 passed (4)
```

## Concerns from this round

- **New, worth recording for WP2:** `ja_locale` is not written on every request — only when it would change the outcome versus the browser's `Accept-Language`. Any later feature that *reads* `ja_locale` (the D1 LanguageHint is the obvious one) must treat "no cookie" as "no explicit choice yet", not as "Turkish". This belongs in `docs/ARCHITECTURE.md` when the routing section is written.
- Concerns 2–5 from the first round are unchanged and still open (pathname table ahead of the app tree; `docs/ARCHITECTURE.md` not yet updated; Node 25 vs `engines: 22.x`; `npm run gate` not run).
