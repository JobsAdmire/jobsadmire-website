# Architecture — JobsAdmire Website

Expands plan §3.1. Full rationale: `docs/superpowers/specs/2026-09-18-website-programme-design.md`. This file is the single technical reference for the repo (stack, layout, modules, env vars, local/test/deploy commands); `docs/PRD.md` stays business-only and `docs/DEPLOYMENT.md` holds the deploy runbook detail.

## Stack

- **Framework:** Next.js 16.3.5, App Router (`package.json`). `@next/third-parties` ^16.3.5 alongside it.
- **UI:** React 19.2.8, react-dom 19.2.8.
- **Language:** TypeScript ^5, `strict: true` (`tsconfig.json`).
- **i18n:** next-intl ^4.14.5 (`src/i18n/*`, `next.config.ts`'s `createNextIntlPlugin`).
- **Styling:** Tailwind CSS ^4 via `@tailwindcss/postcss` (`postcss.config.mjs`).
- **Validation:** Zod ^3.25.76 (the content bundle contract, form payloads).
- **Testing:** Vitest ^4.1.11 + `@testing-library/react` ^16.3.3 (unit), Playwright ^1.63.0 + `@axe-core/playwright` ^4.13.0 (e2e/a11y), `@lhci/cli` ^0.15.1 (Lighthouse CI).
- **Lint/format:** ESLint ^9 (`eslint-config-next` 16.3.5, `eslint.config.mjs`), Prettier ^3.9.8.
- **Runtime:** Node 22.x (`package.json` `engines`, `.nvmrc`).
- **No database, no ORM** — no `prisma/schema.prisma` or migrations anywhere in the repo; this is a static/SSR marketing site with no database of its own. **No Docker** — no `Dockerfile`/`docker-compose*.yml`.
- **Not a Turborepo monorepo** — despite the workspace-root `CLAUDE.md` describing the ecosystem as "two independent Turborepo monorepos" (CRM, Operations), this repo is a single `package.json` with no `turbo.json`, `apps/*`, or `packages/*`.

## Repository layout

Two levels, annotated; excludes `node_modules/`, `.next/`, and `design-package/` (reference design only — never imported from `src/**`, see `CLAUDE.md`'s hard rules).

```
.
├── contract/            # Frozen Zod schema + golden fixture for the Ops<->Website content bundle
│                         #   website-bundle.v1.ts, website-bundle.v1.fixture.json, CONTRACT.md, contract.test.ts
├── docs/                 # PRD, this file, DEPLOYMENT, INTEGRATIONS, SEO, ANALYTICS, CONTENT-MODEL,
│                         #   redirects.md, PRIVACY, OPERATING, WEBSITE-HANDOFF, superpowers/ (plans/specs)
├── e2e/                  # Playwright specs: routing, redirects, seo, smoke, thank-you, ops, a11y (axe), width-sweep
├── public/               # Static assets (brand/)
├── redirects/            # rules.json (source) -> legacy.json + gone.json (built) via redirects:build; gsc-clicks.csv input
├── scripts/               # build-redirects.ts, import-design-package.ts, gate.sh
├── src/
│   ├── analytics/         # GtmLoader, consent, ConversionPing, track.ts, forms.ts (FormKey allowlist)
│   ├── app/                # App Router: [locale]/ pages + layout, api/ route handlers, robots.ts, sitemap.ts, global-error.tsx
│   ├── content/             # Content adapter: config.ts / pure.ts / adapter.ts; local/ (bundle.en.json, bundle.tr.json, catalogue.json)
│   ├── design/               # Design system: chrome/ (Header, Footer, MobileNav, ...), primitives/ (Button, Card, ...), tokens
│   ├── i18n/                  # next-intl routing.ts (locales, pathnames table), navigation.ts, request.ts
│   ├── lib/                    # contact.ts, format/money.ts, seo/ (metadata, jsonld, routes), sanity.ts
│   ├── messages/                 # sys.* next-intl message catalogues (en.json, tr.json)
│   ├── proxy.ts                   # Locale routing / 410 / redirect middleware (Next 16's proxy.ts convention)
│   └── test/                       # Vitest test helpers (storage.ts — Node-version localStorage workaround)
├── next.config.ts, vercel.json, eslint.config.mjs, postcss.config.mjs, playwright.config.ts, vitest.config.mts, tsconfig.json
└── .env.example, .nvmrc, README.md, CLAUDE.md
```

There is no `src/forms/` directory yet — the forms flow is designed (see "Forms flow" below) but unbuilt as of this writing; only `src/analytics/forms.ts`'s `FormKey` allowlist exists.

## Entry points and key modules

- **`src/app/[locale]/layout.tsx`** — locale-scoped root layout; mounts `SiteChrome` (server) and `ClientIslands` (client, `ssr: false`) — see "Chrome" below.
- **`src/app/[locale]/page.tsx`, `hire-workers/page.tsx`, `thank-you/page.tsx`, `dev/gallery/page.tsx`, `[...rest]/page.tsx`, `error.tsx`, `not-found.tsx`** — routed pages; full routing behavior in "Routing" below.
- **`src/app/global-error.tsx`** — root-level error boundary outside the locale scope.
- **`src/app/api/revalidate/route.ts`** (+ `auth.ts`, `state.ts`) — Operations-triggered ISR tag revalidation; see "Operations surface" below.
- **`src/app/api/site-health/route.ts`** (+ `checks.ts`) — health-check endpoint watched by an external monitor.
- **`src/app/robots.ts`, `src/app/sitemap.ts`** — dynamic robots/sitemap generation.
- **`src/proxy.ts`** — the Next 16 middleware-equivalent: `410` checks against `redirects/gone.json`, then next-intl locale resolution; see "Routing" below.
- **`src/lib/seo/*`** — `metadata.ts` (metadata builder), `jsonld.ts` (structured data) + `JsonLdScript.tsx`, `routes.ts` (canonical route helpers).
- **`src/lib/format/money.ts`** — `formatTRY`, the currency/number formatting contract (see "Calculator engine" below).
- **`src/lib/contact.ts`** — WhatsApp/contact link helpers.
- **`src/lib/calculator/`** — the cost-calculator's pure functions over `RateConfig`.
- **`src/i18n/routing.ts`, `navigation.ts`, `request.ts`** — next-intl locale/pathname configuration; `routing.ts`'s `pathnames` table is the single internal-path → per-locale-external-path source (see "Routing" below).
- **`src/analytics/GtmLoader.tsx`, `consent.ts`, `ConversionPing.tsx`, `track.ts`, `forms.ts`** — GTM loading, consent state, conversion pings, event tracking, and the `FormKey` allowlist.
- **`src/content/adapter.ts`** (+ `config.ts`, `pure.ts`) — the content adapter (`LOCAL`/`OPS`); see "Content adapter" below.
- **`src/design/chrome/*`, `src/design/primitives/*`** — site chrome and the 13 design-system primitives; see "Design system" below.

## Environment variables

Names and purpose only — no values live here or anywhere in this repo (`.gitignore` blocks `.env*` except `.env.example`). Full table with rationale/nuance per variable and the retired-secrets log: `docs/DEPLOYMENT.md` § Environment variables. Current placeholder list: `.env.example`.

| Variable                           | Purpose                                                       |
| ----------------------------------- | -------------------------------------------------------------- |
| `CONTENT_SOURCE`                    | `LOCAL` or `OPS` — which content adapter `contentSource()` resolves to |
| `OPS_API_URL`                       | Base URL for the Operations website API                        |
| `OPS_WEBSITE_READ_TOKEN`            | Bearer token for bundle/content reads from Operations           |
| `OPS_WEBSITE_WRITE_TOKEN`           | Bearer token for form submissions to Operations (not yet consumed — forms flow unbuilt) |
| `REVALIDATE_SECRET`                 | Authenticates Operations → `/api/revalidate` calls               |
| `NEXT_PUBLIC_SITE_URL`              | Canonical site origin for metadata/sitemap/OG                    |
| `NEXT_PUBLIC_GTM_ID`                | GTM container id (public identifier)                             |
| `NEXT_PUBLIC_GA4_ID`                | GA4 measurement id (public identifier)                           |
| `NEXT_PUBLIC_ADS_ID`                | Google Ads conversion id (public identifier)                     |
| `NEXT_PUBLIC_ADS_CONVERSION_LABEL`  | Google Ads conversion label (public identifier)                  |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`    | Cloudflare Turnstile site key (public; the secret key lives in Operations, not this repo) |

Runtime-only variables (not in `.env.example`, provided by Vercel or the shell, read directly in code):

| Variable                | Read in                                    | Purpose                                          |
| ------------------------ | ------------------------------------------- | ------------------------------------------------- |
| `VERCEL_GIT_COMMIT_SHA`  | `src/app/api/site-health/route.ts`          | Commit SHA surfaced in the health-check response   |
| `VERCEL_ENV`             | `src/app/robots.ts`                         | Drives `noindex` on every non-production deployment |
| `NODE_ENV`               | `src/content/pure.ts`, `src/app/[locale]/dev/gallery/page.tsx` | Production fixture guard; dev-gallery 404 in production |

## Run locally

```bash
nvm use              # Node 22.x, per .nvmrc
npm ci
npm run dev           # http://localhost:3000
```

Forms and the `OPS` content adapter need the `jobsadmire-operations` stack running locally on port 4001 (workspace-root `CLAUDE.md`); the default `.env.example` `CONTENT_SOURCE=LOCAL` needs nothing else running. Two content-generation scripts are run by hand, not automatically, whenever their source files change, and their output is committed:

```bash
npm run content:import      # scripts/import-design-package.ts -> src/content/local/*.json
npm run redirects:build     # scripts/build-redirects.ts -> redirects/legacy.json + gone.json
```

## Test / quality gates

Exact commands, from `package.json`:

| Command                | Runs                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `npm run typecheck`      | `tsc --noEmit`                                              |
| `npm run lint`            | `eslint .`                                                  |
| `npm run format`          | `prettier --check .` (`npm run format:write` to fix)         |
| `npm run test`            | `vitest run` (`npm run test:watch` for watch mode)            |
| `npm run verify`          | `typecheck && lint && format && test` — the exact gate the Vercel build runs (`vercel.json`'s `buildCommand`) |
| `npm run e2e`             | `playwright test` (Playwright only, no axe/Lighthouse)         |
| `npm run gate`            | `bash scripts/gate.sh` — Playwright + axe + Lighthouse CI against a URL; never part of the Vercel build. Full composition and budgets: "Quality gate (D27)" below. |

## Deployment

Deploys to **Vercel**, not the VPS (`vercel.json`: `framework: nextjs`, `buildCommand: "npm run verify && next build"`, `installCommand: npm ci`). A failing `verify` blocks the build outright. Two Vercel projects exist — the legacy `jobsadmirewebsite` (frozen, untouched) and `jobsadmire-web-v2` (this repo); `git.deploymentEnabled.main` is currently `false` in `vercel.json`, i.e. `main` is preview-only until the Phase A cutover flips it. Full cutover/rollback steps, per-environment values, and the retired-secrets log: `docs/DEPLOYMENT.md`.

## Integrations

Full catalogue (I1–I20), contracts, and token rotation runbook: `docs/INTEGRATIONS.md`. Found in this repo's code:

- **Operations content bundle** — server-only `fetch()` to `${OPS_API_URL}/api/website/v1/bundle?locale=...`, Bearer `OPS_WEBSITE_READ_TOKEN` (`src/content/adapter.ts`); gated by `CONTENT_SOURCE=OPS`.
- **Operations → Website revalidate webhook** — `POST /api/revalidate`, Bearer `REVALIDATE_SECRET` (`src/app/api/revalidate/route.ts`).
- **Forms → Operations intake** — designed, not yet built; see "Forms flow" below.
- **Google Tag Manager / GA4 / Google Ads conversion tracking** — `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_ADS_ID` + `NEXT_PUBLIC_ADS_CONVERSION_LABEL` (`src/analytics/GtmLoader.tsx`, `src/content/pure.ts`).
- **Cloudflare Turnstile** — `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, site key only; the secret key is held by Operations, not this repo.
- **Sentry** — not yet integrated (no `@sentry/*` dependency); see "Sentry — not yet wired" below.
- **Vercel platform** — build/runtime environment; `VERCEL_GIT_COMMIT_SHA` and `VERCEL_ENV` read at runtime (see Environment variables above).

No direct SDK imports for axios/Sanity/Stripe/Resend/Twilio/PostHog exist in `src/`.

## Routing

**Stack spike (D5) — PASSED, no fallback.** `proxy.ts` + `localePrefix: 'as-needed'` + localized `pathnames` at the TR root + a tagged revalidate route outside the matcher were green by end of WP1 day 1 (commit `3fd5c22`, strengthened by `17f7501`). Confirmed stack: **Next 16.3.5 + next-intl 4.14.5**. Two spike-era observations that are normal, not regressions: the build output labels the middleware entry **`ƒ Proxy (Middleware)`** — Next 16's renamed convention (`proxy.ts` replaces `middleware.ts`), not an error; and `getPathname` (`@/i18n/navigation`, used by `src/lib/seo/routes.ts`) is **synchronous** in this next-intl version when the locale is passed explicitly, so `absoluteUrl`/`localeAlternates` stay plain sync functions.

`app/[locale]/…` — App Router, RSC by default, client islands only where interactive (calculator, forms, filters, marquee, and the two chrome islands under Chrome below — there is no `(site)` route group). Covers the 14 pages, careers detail (`/kariyer/[slug]`), legal pages, `/tesekkurler`, and the two newsletter routes when they land. `generateStaticParams` for locale × static slugs. **Shipped in WP1:** `[locale]/page.tsx` (a placeholder homepage — spike-era content, the real homepage is WP2), `[locale]/hire-workers` (same), `[locale]/thank-you` (real — the conversion page), `[locale]/dev/gallery` (component gallery, `notFound()` in production), `[locale]/[...rest]` (Ruling R6: a catch-all that calls `notFound()` so an unmatched URL still renders inside the locale chrome instead of Next's bare root 404), `[locale]/error.tsx` + `[locale]/not-found.tsx` (chrome-preserving error/404 boundaries), and `app/global-error.tsx` (the last resort — it replaces the whole document, so it renders its own `<html>`/`<body>` with hard-coded bilingual copy and inline styles, since the locale and `globals.css` are exactly what failed). The other 11 pages land in WP2.

**Redirects run in two places, in this order** (D21, full policy in `docs/redirects.md`):

1. **`next.config.ts`'s own `redirects()`** — the single-hop, permanent redirects from `redirects/legacy.json` (generated by `npm run redirects:build` from the 49-row `redirects/rules.json`; currently 328 rows). They are emitted as **308**, not 301: `permanent: true` is 308 in Next, which is what `e2e/redirects.spec.ts` asserts and what Gate A's checklist ("308/410") expects. Next.js resolves `next.config` redirects before middleware runs at all, so these never reach `proxy.ts`.
2. **`proxy.ts`** (the middleware — `ƒ Proxy (Middleware)` in the build output), over an explicit matcher (`/((?!api|_next|_vercel|.*\..*).*)`, never the default catch-all) that skips API routes, Next/Vercel internals, and any path with a file extension:
   - a `410` check against `redirects/gone.json` (the unbounded legacy spaces — `/blog/*`, `/job-detail/*`, `/profile/*` — and other zero-click old prefixes, 20 entries today) — a match returns `410` immediately, before next-intl ever sees the path;
   - next-intl locale resolution (`localePrefix: 'as-needed'`, `defaultLocale: 'tr'`, `localeDetection: false`, cookie `ja_locale`, `alternateLinks: false`).

`pathnames` (`src/i18n/routing.ts`) is the single internal-pathname → per-locale-external-path table that next-intl, the redirect generator, and the SEO builders all read; add a route there once and every consumer picks it up.

**`alternateLinks: false`** — left at its default, next-intl's middleware answers every response with its own `Link: rel="alternate"; hreflang=…` header built from the _request host_ (`localhost`, a preview `*.vercel.app`, the apex), which then disagrees with the `<link rel="alternate">` tags rendered from `NEXT_PUBLIC_SITE_URL` (`docs/SEO.md`) — Lighthouse's SEO audit fails on a canonical that points at "another hreflang location." This was a real defect the WP1 gate caught (Task 14), not a stylistic choice; disabling the header makes the metadata layer the single source of hreflang truth.

**`ja_locale` is written only when the resolved locale differs from Accept-Language negotiation** — next-intl's `syncCookie` behaviour, proved by curl bisection in Task 1's fix round (visiting `/` then `/en` with an English `Accept-Language` header sets it; visiting only `/` with a Turkish header never does). **"No `ja_locale` cookie" therefore means "no explicit choice was ever recorded," never "the visitor chose Turkish."** `LanguageHint` (Chrome, below) does not read this cookie for that reason — it reads `navigator.languages` directly.

A tagged revalidate route (`/api/revalidate`) sits **outside** the proxy matcher — it must never be redirected or locale-rewritten.

## Content adapter (D7, D23)

`src/content/` is split three ways so the D23 production-fixture guard can be unit-tested without pulling in `server-only` (Ruling R2):

- **`config.ts`** — `contentSource()` (env-driven: `OPS` only when `CONTENT_SOURCE=OPS` **and** `OPS_API_URL` **and** a 32-plus-character `OPS_WEBSITE_READ_TOKEN` are all set; otherwise `LOCAL`, silently — there is no error path, only the fallback) and `FIXTURE_ONLY_COLLECTIONS` (`pool`, `stories`, `representatives`).
- **`pure.ts`** — no `server-only` import, so Vitest (and later, client-safe callers) can use it directly: `makeT(bundle)` (the `t(id)` string accessor — returns `''` for a deliberately-empty Turkish fragment, and for any unknown id once `NODE_ENV === 'production'`, else throws so a bad id is caught in dev) and `assertServableInProduction(bundle, source, env)` (D23's runtime enforcement).
- **`adapter.ts`** — `import 'server-only'`; `loadLocal`/`loadOps` plus `getBundle(locale)`, wrapped in React's `cache()` so one request resolves each locale's bundle once; re-exports everything from `pure.ts` plus `contentSource`, so every caller imports from `@/content/adapter` alone.

`getBundle(locale)` resolves `LOCAL` (a dynamic `import('./local/bundle.${locale}.json')`, parsed through `BundleSchema`) or `OPS` (`fetch` with `Authorization: Bearer OPS_WEBSITE_READ_TOKEN`, `next: { revalidate: 900, tags: ['site:${locale}'] }` — the D8 time floor and tag together) depending on `contentSource()`. **WP1 ships one process-wide source, not yet a per-route switch** — `contentSource()` takes no route argument; the per-route flip the plan describes is WP5/WP7b work. `loadOps` treats a non-2xx status, a non-JSON 200 (a proxy or login-wall page served with 200), and a schema-invalid JSON body as the same `BundleUnavailableError` (Ruling R28) — one failure class, one fallback path, everywhere a caller reads a bundle.

Every bundle — from either adapter — validates against the Zod schema in `contract/website-bundle.v1.ts` (`BundleSchema`), not a separate JSON Schema file. See "The frozen contract" below for how that file itself is pinned.

**Fixtures for pool, stories, and representatives can never be served in production** — enforced by `assertServableInProduction` (`src/content/pure.ts`), called from `getBundle` on every resolve, not by convention (the enforcement test is `src/content/adapter.test.ts`). **This fires on every Vercel deployment, not only `production`**: Vercel sets `NODE_ENV=production` for preview builds too, so `LOCAL` can never render non-empty fixture rows in those three collections on a preview either — the safe direction, since the check reads `NODE_ENV`, not `VERCEL_ENV`. **`src/content/local/*` can only be imported from `src/content/adapter.ts`** — an ESLint `no-restricted-imports` rule (`eslint.config.mjs`) forbids it everywhere else, so D23 is enforced at lint time as well as at runtime; the only exemptions are two chrome component tests that render against the real generated TR bundle as a fixture (`Footer.test.tsx`, `Header.test.tsx`) — `lint.test.ts` and `contract.test.ts` need none, since they read the JSON with `readFileSync` rather than importing it as a module. **The same rule now forbids `src/**` importing anything from `design-package/**` at all** (R56): the package's `data/*.sample.json` fixtures are dev-only by CLAUDE.md's hard rule, and the runtime guard above only fires once a collection is non-empty, so the lint is what stops a page wiring one up in the first place. `readFileSync` remains the one way round the import rule in either direction — that is a review responsibility, not a lint one.

`contentSource()`'s `OPS`→`LOCAL` fallback is **silent by design** — the only place it becomes visible is `/api/site-health`'s `source` field (`LOCAL`/`OPS`, see Operations surface below), which exists precisely so a Phase B flip that silently fell back to `LOCAL` (a missing env var, a token under 32 chars) is a visible incident rather than an unnoticed one (review 6, note (a)).

**Bundle-loading failures are not yet reported anywhere but the health endpoint.** No Sentry integration exists in this repo as of WP1 (no `@sentry/*` dependency, no config file) — see the Sentry section below.

`t(id)` honours the six deliberately-empty Turkish fragments (`docs/CONTENT-MODEL.md`) and must not substitute English for an intentionally empty `tr` value.

### The frozen contract

`contract/website-bundle.v1.ts` (Zod schema, `CONTRACT_VERSION = '1.0'`) plus `contract/website-bundle.v1.fixture.json` (the golden fixture) are frozen as of Task 5 and pinned by `contract/contract.test.ts` against a SHA-256 computed over the **Prettier-formatted** schema file: `b407d92f39ab560e4c256ec2e7d1cd5d36f6166281b9d1dfdd178ede01319dcf`. `jobsadmire-operations` vendors both files byte-identically and must `.prettierignore` its copy, so a routine format pass on that side can never drift the bytes — and therefore the hash — away from this repo's. Bump procedure: `contract/CONTRACT.md`. `docs/CONTENT-MODEL.md` covers the bundle's content shape (strings, nav, settings, collections); this repo's own generated `src/content/local/*.json` bundles validate against the same schema (`contract.test.ts`'s third assertion).

## Freshness: ISR tags and time floors (D8)

Tags: `site:${locale}`, `page:${slug}`, `blog`, `pool`, `openings`, `stories`, `sitemap`. Publishing in Operations triggers serial tag revalidation with a **read-back** — the site is re-fetched after revalidation and shown LIVE/NOT_LIVE in the Operations dashboard; NOT_LIVE is red with a Retry action and raises `WEBSITE_REVALIDATE_FAILED`.

Every ISR route **also** carries a time floor independent of tag revalidation — belt-and-braces against a missed or failed webhook:

| Content class                                 | Time floor                                 |
| --------------------------------------------- | ------------------------------------------ |
| Pages, strings, collections (general content) | 900 s                                      |
| Candidate pool stats, careers openings        | 300 s                                      |
| Representatives (list view)                   | 60 s                                       |
| Representatives single-record view            | **`no-store`** — no floor, no cache at all |

The representatives single-record view is the one exception to "everything is ISR": a revoked representative's `status` must take effect immediately, with zero cache window, because the page exists specifically so an employer can check whether someone is still authorised (design-package `docs/crm-feed.md`).

## Forms flow (D11)

**Not yet built.** No server action, no `postForm`, and no call to Operations exists in this repo as of WP1 — `src/analytics/forms.ts` only exports the `FormKey` allowlist the thank-you page and `ConversionPing` share. This section records the WP2/WP3a design so the contract (form keys, success path, failure behaviour) is settled before the handlers land.

`postForm` server action → Operations `POST /api/website/v1/forms/:formKey` with the write token.

- **Captcha (Turnstile) behavior is asymmetric by design:** an **auth failure** (bad/expired write token) fails closed — the submission is rejected. A **captcha infrastructure failure** (secret missing, Cloudflare unreachable) **degrades**: the submission is accepted behind a honeypot + dedupe + rate cap, flagged `captchaDegraded`, and raises `WEBSITE_FORMS_UNAVAILABLE`; WhatsApp is promoted from secondary to co-primary CTA on the affected form until the degraded state clears.
- **Dedupe:** `(formKey, requestHash, hourBucket)` — a repeat submission within the same hour bucket returns the prior result rather than creating a duplicate `Inquiry`/submission row.
- **Success:** navigate to `/tesekkurler?form=<key>` (never an inline panel — D13's accepted design delta; this is where the Ads conversion fires).
- **Failure — the visitor-side fallback panel, not a spinner or fake success:** a WhatsApp deep link prefilled with whatever the visitor already typed (name, phone, email, message), a Sentry error report, and a client-side beacon so the failure is visible in `/api/site-health` even if Sentry is also down. Leads are explicitly **not** buffered on Vercel — if Operations is unreachable, the visitor gets the fallback panel immediately, not a retry queue.
- Handler types: `INQUIRY` (with the new `Inquiry.contactName` column), `CAREERS_APPLY`, `NEWSLETTER` (double opt-in, RFC 8058 confirm/unsubscribe), `FRAUD_REPORT`, `CALLBACK`, `VISIT`, `CALCULATOR_QUOTE`.

## D19 — desktop-scale port checklist

The design package is authored at 1.333× and relies on `html { zoom: 0.75 }` above 1101px (see `design-package/README.md`, "Read this before measuring anything"). This repo **normalises instead of scaling**: every desktop value is multiplied by 0.75 once, at the token source, and the zoom rule is dropped entirely.

When porting any desktop value from the package, check off:

- [ ] Scale **lengths** (font sizes, paddings, margins, radii, fixed widths/heights) that apply above the 1101px breakpoint.
- [ ] Scale **every term inside every `clamp()`**, including the `vw` coefficient — e.g. `clamp(40px, 4.6vw, 66px)` → `clamp(30px, 3.45vw, 49.5px)`. Scaling only the min/max and leaving the `vw` term unscaled is the most common way to get this subtly wrong (the package README calls this out explicitly).
- [ ] **Never** scale breakpoint values themselves (1101px, 1100px, 900px, 700px, 560px, 460px stay exactly as authored).
- [ ] **Never** scale any value that already applies at ≤1100px — mobile/tablet in the package is authored 1:1, not at 1.333×.
- [ ] Desktop body-small is raised to **11px** post-scale (owner may keep the scaled 9.75px instead — pending §10 item 8).
- [ ] After porting a page, run the token snapshot + width sweep (part of `npm run gate`) to catch any value that drifted from its scaled source.

## Quality gate (D27)

`npm run gate` (`scripts/gate.sh`) runs **outside** the Vercel build — there is no Chrome there — against a URL: a preview deployment, or a local `next start`. Once per work package.

```bash
E2E_BASE_URL=https://<preview> REVALIDATE_SECRET=<the server's own secret> npm run gate
```

It runs, in order and never concurrently:

1. **Playwright**, both projects (`mobile` = Pixel 7, `desktop` = 1440×900), no filter — routing, redirects, SEO, thank-you/conversion, ops, smoke, plus the two gate sweeps below. `REVALIDATE_SECRET` is optional: without it the two token-dependent cases in `e2e/ops.spec.ts` skip themselves (R43) and `gate.sh` says so.
2. **axe** (`e2e/a11y.spec.ts`) over `GATE_ROUTES` (`e2e/routes.ts` — the public routes per locale; WP2 appends each page as it lands), tags `wcag2a wcag2aa wcag22aa`, zero violations. It runs under **both** projects on purpose: the hamburger, the mobile bottom bar and the footer accordions only exist at the mobile viewport.
3. **The width sweep** (`e2e/width-sweep.spec.ts`): no horizontal overflow at 1440/1280/1101/1100/900/700/560/460/390 — 1101 and 1100 straddle the D19 boundary.
4. **Lighthouse CI** (`lighthouserc.json`), `formFactor: "mobile"` (Lighthouse's own default — there is no "mobile" _preset_; `--preset` only accepts `perf|experimental|desktop`), 2 runs per path, on the four indexable gate paths (the list in `gate.sh` mirrors `e2e/routes.ts` minus the noindex `/tesekkurler`): performance ≥ 0.95, accessibility / best-practices / SEO = 1.0, **script transfer ≤ 184 320 B (R49)**, LCP ≤ 2500 ms, CLS ≤ 0.1, TBT warn at 200 ms. Each `lhci collect` is `--additive`, otherwise it wipes the previous path's result and `lhci assert` would only ever see the last one; `lhci upload --target=filesystem` writes `lighthouse-report/` **before** `assert`, so the reports survive a failing budget (R48).

   **The JS budget is 180 KB, not the plan's 120 KB (R49).** 120 KB was written before the stack was measured and sits below its floor: `react-dom` (73,398 B) plus the Next App Router client runtime (48,040 B) is **121,438 B before a line of our code**, and next-intl's client runtime adds 17,140 B (it cannot move into a lazy island — `src/app/[locale]/error.tsx`, an eager client component, calls `useTranslations`). 184,320 B = that 121 KB floor + 17 KB next-intl + a 40 KB allowance for our own client code. The WP1 shell measures **172,509 B**; WP2 watches the per-page increment rather than the absolute number — **no page may add more than 25 KB over the shell**, and a page that does is a design question, not a budget question.

   Keeping the budget is a standing constraint on the chrome, not a one-off: client islands that are not needed on first paint load through `next/dynamic(..., { ssr: false })` (`src/design/chrome/ClientIslands.tsx`), and every chrome `<Link>` passes `prefetch={false}` — Next still prefetches on hover, so navigation is unaffected, but the eager `_rsc` requests stay out of the first load.

5. **LCP is an error against a preview or production URL, and a warning against localhost (R50).** `gate.sh` picks `lighthouserc.local.json` — identical but for that one line — when `E2E_BASE_URL` is `localhost`/`127.0.0.1`, and echoes which config it asserted with. Reason: on localhost every asset arrives inside 60 ms, so Lantern's pessimistic LCP graph charges the whole early payload to the paint and reports ~2705 ms on every path alike, while the observed LCP is 54 ms and the same build measures 1503 ms under real (`--throttling-method=devtools`) throttling. **A local run is therefore never sign-off**: the binding gate for a work package is the one against the Vercel preview URL, where LCP is an error like every other budget.

**A failure is fixed in the component, never by lowering the assertion (D20).** The WP1 gate forced these, and they are the named deltas from the package's own pixels:

- The **CTA face is `blue-safe` (#1073a8)**, not the raw brand blue: white on #1899d5 is 3.2:1, which is AA for large text only — a 15 px button label is not large text. `blue` survives behind icons and as a hover/decorative surface.
- The **WhatsApp action is `success-text` (#12813c)**, not `success` (#16a34a, 3.3:1 under white) — one colour for the action in the mobile bar and the FAB.
- Footer **office hours are `white/55`** (5.9:1 on navy), not `white/40` (3.8:1); the language hint's dismiss button is `text-secondary`, not `text-tertiary` (4.25:1 on the tint strip).
- The **header's desktop row (nav + language switcher) appears only above 1101px**; below it the hamburger panel carries both. Below the D19 boundary the type scale is the authored 1:1 one, and the full row overflows the viewport (47 px at 1100, 125 px at 390) — the design package hides the same two at its own mobile breakpoint.
- The **primary button hover is `bg-ink`** (the resting face is `blue-safe`, so the old hover colour became the resting one); in the dark footer the same CTA hovers to `bg-sky` with navy text, because both states have to clear AA, not just the resting one.
- The **language hint is a fixed bottom sheet**, not the package's strip above the header (R45). It can only be decided in the browser, so in flow it inserted 57 px after hydration and shifted every Turkish page (CLS 0.099). It sits above the mobile bottom bar below `lg`, at `bottom-4` from `lg` up, at `z-55` — under the consent sheet (z-60), over the bar (z-50).

## Design system

`src/design/` — tokens (colour, type, radius, shadow per `design-package/README.md`'s Design Tokens section, scaled per D19), `Archivo` via `next/font/google` (`latin` + `latin-ext` subsets, self-hosted), and 13 accessible primitives in `src/design/primitives/` (`Accordion`, `Button`, `Card`, `Chip`, `Dialog`, `Eyebrow`, `FormField` with label/error/`aria-live`, `PausableMarquee`, `Section`, `SkipLink`, `Stat`, `Tabs`, `Timeline`).

Pages: one server component per page, client islands only where interactive; inline SVG icon sprite (no icon font/library, per the package); local flag assets; the sourcing map pre-rendered from `design-package/design/source-map.js`'s country list; local QR generation (replacing the package's `qr.js`); a per-slot image policy with the LCP element named explicitly per page (the content-readiness gate refuses to launch a page whose named LCP slot is still a placeholder — D26). **WP1 ships two real pages** (`/`, `/hire-workers`, both still spike-era placeholder content) plus the thank-you and dev-gallery routes; the rest land in WP2.

### Chrome

`src/design/chrome/` is mounted once from `[locale]/layout.tsx`, identical on every page per the package's own warning against chrome drift, through two different mechanisms:

- **`SiteChrome`** (server component, rendered inside `NextIntlClientProvider`) composes, in DOM order: `SkipLink` → `SlimBar` → `Header` (logo, desktop nav, language switcher, primary/secondary CTA, `MobileNav` hamburger) → (`SocialRail` + `WhatsAppFab`, only for `variant="default"` — dropped for `variant="minimal"` pages such as legal/thank-you) → `<main id="main">{children}</main>` → `Footer` → `MobileBottomBar` → `MobileBottomBarSpacer`. The spacer is last on purpose (Ruling R29): the fixed mobile bottom bar must clear the footer's legal line, not the page content above it.
- **`ClientIslands`** (client component, a _sibling_ of `SiteChrome` mounted directly from the layout, not nested inside it) renders `LanguageHint` and, when `analytics.consentMode && analytics.gtmId` (R38), `ConsentBanner` — both loaded through `next/dynamic(..., { ssr: false })` so neither component's code (nor the primitives the consent sheet pulls in) reaches the initial script graph (Ruling R47, the 180 KB budget below). A server layout cannot itself pass `ssr: false`, which is the only reason this boundary component exists.

**Every chrome nav row (desktop, hamburger, footer columns) renders through one `NavLink` component**, so a bundle nav entry marked `external: true` can never come out as an internal `Link` in one placement and a plain anchor in another — an internal `/`-rooted entry renders next-intl's `Link` with `prefetch={false}` (hover still prefetches); a `tel:`/`mailto:` href falls through to a same-tab anchor (Ruling R22's pattern). **Footer columns render twice** (Ruling R30): once as static columns inside an always-`grid` container — each column itself `hidden lg:block` — and once inside an `Accordion` (`lg:hidden`) fed the same rendered JSX bodies — decided at render time, not by a resize listener, and the hidden copy is `display:none` so it is never doubled in the accessibility tree.

**The header's desktop nav row is gated at Tailwind's `xl` breakpoint, redefined in this repo's theme to 1101px** (`src/design/tokens.ts`'s `breakpoint.xl`; `--breakpoint-xl` in `globals.css`) to match the D19 desktop-scale boundary, not Tailwind's default 1280px. Below it, `MobileNav`'s hamburger panel carries the same nav items and language switcher. **Ruling R46: 1101px is accepted for WP1 only** — the design's own breakpoint is 901px (`lg`, also redefined in the theme); WP2's pixel-comparison pass restores 901px by matching the design's nav font-size/padding so the row fits below 1101px too.

**`LanguageHint` renders out of flow** — a `fixed` bottom sheet, not a strip in the document (Ruling R45; full CLS rationale under Quality gate below) — at `z-[55]`: above `MobileBottomBar` (`z-50`) below `lg`, and below the consent sheet (`z-60`). While consent is undecided, the two fixed sheets can occupy the same screen region on mobile; `ConsentBanner` always wins visually. This is self-resolving once a choice is made (re-review 9 treated it as acceptable, not a defect) but is worth knowing before assuming a stacking bug.

**`StickyCtaBar` exists but is not mounted anywhere in the shipped chrome** — exported from `src/design/chrome/StickyCtaBar.tsx`, used only in `[locale]/dev/gallery`. Its eventual stacking behaviour against `LanguageHint` (both fixed, bottom-anchored) is an open WP2 question, not a WP1 decision.

## Calculator engine

`src/lib/calculator/` — pure functions over the published `RateConfig` (versioned, `effectiveFrom`/`reviewDueAt`, D17). Output formatted through `formatTRY` (D18). Tested against the design package's worked figures. The homepage teaser and the full Cost Calculator page share this engine — no duplicated math. Dated labels ("2026 rates", "Updated January 2026") render from `RateConfig.effectiveFrom`, never hard-typed (D17's numbers-out-of-copy lint blocks publishing a string that hard-types a rate or metric value).

## Operations surface

- `GET /api/site-health` — `force-dynamic`, `Cache-Control: no-store`, watched by an external monitor to the owner's phone (D25). Shipped in WP1 (`src/app/api/site-health/`): both bundles loaded through the adapter, plus `lastRevalidate` and `opsPing`; answers `{ ok, reasons, checks, contractVersion, source, commit, at }` with **200 when ok, 503 otherwise**. Reason codes and the `skip` rule are in `docs/OPERATING.md`. Canary image HEAD, tripped-forms state, handler failures and lead-drought join it in WP3a/WP5/WP6.
- `POST /api/revalidate` — Operations-triggered, secret-authenticated tag revalidation (`src/app/api/revalidate/`). `Authorization: Bearer $REVALIDATE_SECRET`, body `{ tags: string[] }` (1–50, each `/^[a-z0-9:_-]+$/`); **503 when no usable secret is configured** (never open), 401 on a missing/wrong token (timing-safe, equal-length compare only), 400 on a malformed body — validated in full before the first `revalidateTag(tag, 'max')` (the profile argument Next 16.3.5's types require), so there is no partial purge. A success calls `recordRevalidate()` (`src/app/api/revalidate/state.ts`), which `site-health`'s `lastRevalidate` check reads. Read-back verification (re-fetching after revalidate to confirm LIVE) is WP5.

  **WP5 blocker, carried from Task 13/14 — must land before the `OPS` flip:** `state.ts`'s timestamp is a **module-level in-memory variable** — best-effort on Vercel's serverless runtime, where a cold instance starts with it unset and a redeploy forgets it entirely. Under `CONTENT_SOURCE=OPS`, `/api/site-health` would then report `REVALIDATE_STALE` (a `fail`, hence a `503` from the health endpoint itself) on any instance that has not personally handled a revalidate call yet — a false alarm, not a real staleness signal. WP5 replaces this with a real store (a KV/DB row the route writes and site-health reads). **Related caveat for the same work:** even once that lands, in `OPS` mode the `bundleTr`/`bundleEn` checks call `getBundle()`, which reads through the same `next: { revalidate: 900 }` **Next.js Data Cache** the pages themselves use — so a passing bundle check up to 900 seconds after a failed publish can still be looking at the last-good cached bundle rather than proving the _current_ one is servable. Both facts belong together when WP5 designs the real store: a fresh timestamp alone does not prove the bundle checks beside it are reading fresh data.

- **Not yet built** (no cron config in `vercel.json`, no form handlers to exercise): the planned Vercel Cron **synthetic-lead** every 30 min through the real form path, its external heartbeat, the **daily digest** email, and a client submit-failure beacon feeding `/api/site-health`'s future "handler failures" signal. `docs/OPERATING.md` records the design; none of it ships until WP3a/WP5/WP6 land the forms and Sentry work these depend on.

## Sentry — not yet wired (deferred past WP1)

No `@sentry/*` dependency and no Sentry config exist in this repo as of WP1 — every "reported to Sentry" reference elsewhere in this doc, and in `docs/OPERATING.md`, describes the **target design**, not shipped behaviour. `src/app/[locale]/error.tsx`'s own comment records the plan: client-side error digests go to Sentry once it lands (WP6). When it is wired, the plan's requirements stand: `sendDefaultPii: false`; `beforeSend` scrubs server-action arguments and auth/cookie headers; `tracePropagationTargets` restricted to this site's own origin; tunnel validated and rate-limited; traces sampled at 10%; **no Session Replay**. Until then, the error-visibility surfaces WP1 actually ships are `/api/site-health` (checks feed a `503`, watched externally) and the two Next.js error boundaries (`[locale]/error.tsx`, `app/global-error.tsx`), which render a retry UI and nothing more.

## Environments

| Environment | Branch/trigger                | Domain                                   | Tokens                                     | Indexing                            |
| ----------- | ----------------------------- | ---------------------------------------- | ------------------------------------------ | ----------------------------------- |
| Production  | `main`, after Phase A cutover | jobsadmire.com                           | read + write (current class)               | indexed                             |
| Preview     | every PR/branch               | `*.vercel.app`, `staging.jobsadmire.com` | preview/test classes only                  | `noindex`, Deployment Protection on |
| Local       | `npm run dev`                 | localhost:3000                           | dev tokens against Operations on port 4001 | n/a                                 |

`staging.jobsadmire.com` is a **stable preview alias** — Turnstile is configured with a real widget for it (not the test-key pair used for local dev), so form testing on staging exercises the real captcha path.
