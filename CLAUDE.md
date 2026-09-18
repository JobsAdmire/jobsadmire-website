# JobsAdmire Website — repo rulebook

This is `jobsadmire-website`, part of the JobsAdmire ecosystem (workspace root: `../CLAUDE.md`). It rebuilds jobsadmire.com on Next.js 16 from the finished 14-page Claude Design package, serving Turkish visitors at the root and English visitors under `/en`. From Phase B it is fed by a CMS ("Website" module) inside `jobsadmire-operations`. It talks to Operations only — never the CRM, never anything on the VPS directly, and never from the browser.

Full rationale for every decision below lives in the approved plan: `docs/superpowers/specs/2026-09-18-website-programme-design.md` (v3, 2026-09-18). Decisions are cited here as **D<n>**; do not re-derive them from first principles — read the plan.

## Doc map

| Doc                                                                                                    | Read it for                                                                                                                               |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                                                            | Local dev, environments, where to start                                                                                                   |
| `docs/PRD.md`                                                                                          | Pages, routes/slugs, forms per page, i18n rules, SEO/accessibility/performance requirements, scope                                        |
| `docs/ARCHITECTURE.md`                                                                                 | Routing, content adapter, ISR/time floors, forms flow, D19 desktop-scale checklist, design system, environments                           |
| `docs/DEPLOYMENT.md`                                                                                   | Two Vercel projects, cutover/rollback, env vars, retired secrets log                                                                      |
| `docs/INTEGRATIONS.md`                                                                                 | The §4 integration catalogue, contracts, token threat model, rotation runbook                                                             |
| `docs/SEO.md`                                                                                          | Metadata, hreflang, sitemap, robots, JSON-LD, redirects policy summary, 12-week watch                                                     |
| `docs/ANALYTICS.md`                                                                                    | Consent Mode v2, GTM/GA4, event schema, conversion page                                                                                   |
| `docs/CONTENT-MODEL.md`                                                                                | String catalogue, collections, page records, blog model, `contract/` bundle, `sys.*`                                                      |
| `docs/redirects.md`                                                                                    | The D21 redirect rules, GSC-joined disposition table, expected-loss forecast                                                              |
| `docs/PRIVACY.md`                                                                                      | Retention, DSAR/erasure, KVKK incident runbook, pool consent staging                                                                      |
| `docs/OPERATING.md`                                                                                    | Site-health, synthetic lead, digest, kill switches, owner checks                                                                          |
| `docs/superpowers/specs/2026-09-18-website-programme-design.md`                                        | The full approved plan — every decision's rationale, work packages, risks                                                                 |
| `docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md`                                          | Every WP1 implementation ruling (R1–R52) — what was decided, why, where it landed; the durable record of the git-ignored execution ledger |
| `design-package/README.md`, `docs/project-brief.md`, `docs/crm-feed.md`, `docs/translation-process.md` | Source design reference — pages, tokens, copy rules, the two CRM feed contracts                                                           |

## Architecture at a glance (D5, D7, D8, D23)

- **Routing:** Next.js 16 App Router, `app/[locale]/…` (no route group). Turkish at the root (`/`), English under `/en` (D1). Single-hop 301 redirects run in `next.config.ts`'s own `redirects()`, resolved _before_ middleware; `proxy.ts` (the middleware — labelled `ƒ Proxy (Middleware)` in the build output, Next 16's normal naming) then handles `410`s and next-intl locale resolution, in that order, with an explicit matcher. Full detail: `docs/ARCHITECTURE.md` § Routing.
- **Content adapter** (`src/content/config.ts`/`pure.ts`/`adapter.ts`): `LOCAL` (design-package JSON, Phase A) or `OPS` (Operations bundle, Phase B) — one process-wide source as of WP1; the per-route switch is WP5/WP7b. Fixtures for pool/stories/representatives are refused outside `LOCAL` and can never be served in production (D23) — enforced both at runtime (`assertServableInProduction`) and at lint time (an ESLint `no-restricted-imports` rule forbids importing `src/content/local/*` outside `adapter.ts`).
- **Data plane:** server-only fetches to `operations.jobsadmire.com/api/website/v1/*` with Bearer tokens in three classes — read (bundle), write (forms), signed preview (drafts) — current + previous each, timing-safe, fail closed (D6). The browser never calls Operations directly.
- **Freshness:** ISR tags (`site:${locale}`, `page:${slug}`, `blog`, `pool`, `openings`, `stories`, `sitemap`) plus a time floor per content class regardless of tag revalidation: content 900 s, pool/openings 300 s, representatives 60 s. The representatives single-record view is `no-store` — no floor, no cache at all (D8).
- **Design tokens:** normalised from `design-package/` at **0.75** — the package's desktop values are authored at 1.333× and the package itself applies `html { zoom: 0.75 }` above 1101px. This repo does **not** carry that zoom rule; every desktop length, and every term inside every `clamp()` including the `vw` coefficient, is multiplied by 0.75 once, at the token source, as it's ported (D19). Breakpoints and any value already ≤1100px are never scaled.

## Conventions

- **Strings by package id.** Use the design package's stable `<page>.<nnn>` ids as message keys (`design-package/strings/*.json`, `all-strings-en-tr.csv`). Do not invent new ids for existing copy.
- **New copy** — form-field labels/errors, the consent banner, the language hint, `/tesekkurler` chrome, and anything else the package doesn't carry (it ships zero field-label/error/consent copy) — goes in the reserved **`sys.*`** id range. Never repurpose a package id for different copy.
- **`sys.*` copy goes through next-intl only, never `t()`/`makeT`.** It lives in `src/messages/{tr,en}.json` and is read with `getTranslations('sys')` (server) / `useTranslations('sys')` (client) — a different accessor from the bundle string map. The two are not interchangeable: `t()` knows package ids, `sys` messages know nothing else. Full key list: `docs/CONTENT-MODEL.md`.
- **Shared chrome reads one canonical package id per string, not a per-page one** (Ruling R15) — the package repeats chrome copy on every page file, but the site has one chrome. The verify-nav label is `home.011`; there is no `sys.nav.verify` and never invent one for copy the package already carries. Full id table: `docs/CONTENT-MODEL.md` § Chrome canonical ids.
- **Deliberately-empty Turkish fragments never fall back to English.** Six ids ship with an empty `tr` value on purpose (`hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107`) because Turkish word order moves the content into a neighbouring string. `t()` must render them as empty, never substitute the English — see `docs/CONTENT-MODEL.md`.
- **`formatTRY(n, locale)` is a contract, not a formatter of convenience.** TR: `38.944 ₺` (period thousands, symbol trailing); EN: `₺38,944` (comma thousands, symbol leading); percent TR `%21,75` (sign leads, comma decimal), EN `21.75%`. Tested against the design's worked examples (D18). Every computed figure on the page goes through it — an unformatted number next to already-localised copy is a defect class the plan explicitly calls out.
- **Accessibility over pixel fidelity where they conflict** (D20): the contrast-safe `#1073a8` replaces the raw brand blue for the eyebrow **and every CTA face**, the WhatsApp action is the darker `#12813c`, footer office hours are `white/55` (the primary button's hover is `bg-ink`, since `blue-safe` is now its resting face); the header's desktop row (nav + language switcher) only appears above **1101px** (Tailwind's `xl`, redefined in this repo's theme — **accepted for WP1 only, Ruling R46**: WP2's pixel-comparison pass restores the design's own 901px by matching its nav font-size/padding), the hamburger panel carrying both below it; the language hint is a fixed bottom sheet rather than an in-flow strip, so it cannot shift the page; marquees/tickers have pause/play; dialogs are real dialogs; there's a skip link; every form input is labelled with `aria-live` errors. The pixel-comparison harness (four nominated pages, two-iteration cap) tolerates these named deltas plus the `/tesekkurler` navigation delta. The full gate composition is in `docs/ARCHITECTURE.md` § Quality gate.
- **Every form's success path navigates to `/tesekkurler?form=<key>`** (D13) — an accepted delta from the design, which shows an inline success panel. This is where the Ads conversion fires. Never replace this with an inline success state.
- **No candidate identifiers in analytics.** Every GTM/GA4 event has a parameter allowlist; no candidate refs, no free-text form content, ever (D13). See `docs/ANALYTICS.md`.
- **The content-route JS budget is 180 KB gzipped, not 120 KB** (Ruling R49 corrected the plan's pre-measurement figure — the framework floor alone is ~121 KB on this stack). Asserted by the gate as `resource-summary:script:size`. Full breakdown and the per-page-increment watch: `docs/ARCHITECTURE.md` § Quality gate.

## Hard rules

- **Never call Operations from the browser.** All Operations traffic is server-only (server components, server actions, route handlers) — never a client-side `fetch` to `operations.jobsadmire.com` (D6).
- **Never serve pool, stories, or representatives fixtures in production.** The `LOCAL` adapter's sample data is for Phase A rendering and local dev only; a spec pins the legal adapter per route and per environment (D23).
- **Never commit env files.** The old site did — `.env` with a live Resend key and a DB password, preserved (not fixed) on branch `main-backup`. Do not read secrets from `main-backup`; see `docs/DEPLOYMENT.md`'s retired-secrets log for what's already compromised and what's still live.
- **Never ship `html { zoom: .75 }`.** That's the design package's own hack for a build-less prototype. This repo normalises values instead (D19) — see Architecture above.
- **The Vercel build runs `npm run verify`** (typecheck + lint + format + unit tests) via `vercel.json`'s `buildCommand`. A build that fails `verify` must not reach preview or production.
- **`npm run gate`** (Playwright + axe + Lighthouse against a URL) runs **outside** the build — once per work package against a preview URL, never inside `vercel.json`. There is no Chrome in the Vercel build environment.
- **Fixtures and sample data (`design-package/data/*.sample.json`) are dev-only.** Never wire them to a production code path.
- **`.superpowers/` (this worktree's root) is git-ignored scratch** — the SDD execution ledger, task briefs and reports live there and are never committed. `docs/superpowers/` (plans and specs, including the rulings doc above) is a different, tracked path — don't confuse the two.
- **`npm run dev` appends an `nextjs-agent-rules` block to this file the first time it runs** (Next's own dev-server behaviour, not this project's). Revert it before committing anything; never commit that block.

## Task-completion checklist

Before calling any work package done:

1. `npm run verify` green (typecheck, lint, format, unit tests).
2. `npm run gate` run against a preview URL for that work package — not skipped because "it's just copy": Lighthouse/axe/Playwright are the only place responsive/a11y regressions get caught before a human does.
3. Docs updated in the **same change set** — this file's doc map, `docs/PRD.md`, `docs/ARCHITECTURE.md`, or whichever doc governs the area touched. A behavior change without a doc change is not done.
4. If the change touches an Operations contract (forms, bundle shape, tokens): `docs/INTEGRATIONS.md` updated and the Operations-side doc (`jobsadmire-operations/docs/PRD.md` §5.12/§7.10) checked for drift.
5. If the change touches redirects: `docs/redirects.md` and the Vitest no-chain test.

## Phase status

- **Phase A (target: approval + 4 weeks):** site live on design-package content via the `LOCAL` adapter, TR + EN, redirects, legal pages, analytics + conversion, forms through the minimal Operations intake door (WP3a), WhatsApp co-primary. Sections needing live data (pool cards, stories proof, representatives register) are hidden or in an empty state.
- **Phase B (target: approval + 9 weeks):** adapter flips to `OPS` per route; the Operations "Website" module (CMS) becomes the content source; the marketing team (Sana, Nisanur) become the editors.
- Work package order and gates: plan §5 and §12 (stop rules). Do not run WP3b/CRM work in parallel with WP3c — D24.
