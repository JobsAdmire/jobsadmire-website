# JobsAdmire Website — repo rulebook

This is `jobsadmire-website`, part of the JobsAdmire ecosystem (workspace root `../CLAUDE.md` — read it first; task routing, cross-app boundaries, VPS/ports, deploy-on-push are covered there, not repeated here). It rebuilds jobsadmire.com on Next.js 16 from the 14-page Claude Design package: Turkish visitors at the root, English under `/en`. It talks to Operations only — never the CRM, never the VPS directly, never from the browser. It is **not** a Turborepo monorepo (single `package.json`, no `apps/*`), has **no database of its own**, and does not deploy through the VPS — production is Vercel.

Decisions below are cited as **D\<n\>**, rationale in `docs/superpowers/specs/2026-09-18-website-programme-design.md`. WP1 implementation rulings are cited as **R\<n\>**, in `docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md`. Don't re-derive either — read the source.

## Where to look

| Task / question | Doc & section |
|---|---|
| Pages, routes, slugs, forms per page, i18n rules | `docs/PRD.md` §2–3 |
| SEO/GEO/AEO requirements | `docs/PRD.md` §4; `docs/SEO.md` |
| Accessibility requirements | `docs/PRD.md` §5 |
| Performance budget | `docs/PRD.md` §6; `docs/ARCHITECTURE.md` § Quality gate (D27) |
| Analytics / consent requirements | `docs/PRD.md` §7; `docs/ANALYTICS.md` |
| Legal pages | `docs/PRD.md` §8 |
| Out of scope, owner-decided items, what WP1 shipped | `docs/PRD.md` §9–11 |
| Stack, dependencies, repo layout, entry points | `docs/ARCHITECTURE.md` § Stack / § Repository layout / § Entry points and key modules |
| Environment variables (full reference) | `docs/ARCHITECTURE.md` § Environment variables; `docs/DEPLOYMENT.md` § Environment variables |
| Run locally; exact test/quality-gate commands | `docs/ARCHITECTURE.md` § Run locally / § Test / quality gates |
| Routing, redirects, `src/proxy.ts` middleware | `docs/ARCHITECTURE.md` § Routing |
| Content adapter (`LOCAL` vs `OPS`, fixture rule) | `docs/ARCHITECTURE.md` § Content adapter (D7, D23) |
| ISR tags and freshness time floors | `docs/ARCHITECTURE.md` § Freshness (D8) |
| Forms flow | `docs/ARCHITECTURE.md` § Forms flow (D11) |
| Desktop-scale token port checklist (0.75 normalisation) | `docs/ARCHITECTURE.md` § D19 |
| Quality gate composition and budgets | `docs/ARCHITECTURE.md` § Quality gate (D27) |
| Design system, calculator engine, Operations surface | `docs/ARCHITECTURE.md` §§ Design system / Calculator engine / Operations surface |
| Environments (local / preview / production) | `docs/ARCHITECTURE.md` § Environments; `docs/DEPLOYMENT.md` §§ Two Vercel projects / Phase A cutover |
| Integration catalogue (I1–I20), token threat model | `docs/INTEGRATIONS.md` §§ Catalogue … Token threat model |
| String catalogue, `sys.*`, bundle shape, blog model | `docs/CONTENT-MODEL.md` |
| Redirect rules (D21), disposition table | `docs/redirects.md` |
| Retention, DSAR/erasure, KVKK runbook, consent | `docs/PRIVACY.md` |
| Site-health, synthetic lead, kill switches, owner checks | `docs/OPERATING.md` |
| Retired secrets log; deploy discipline | `docs/DEPLOYMENT.md` §§ Retired secrets log / Deploy discipline |
| Unbuilt / pending features | `docs/pending/README.md` |
| Decision rationale (D\<n\>) and WP1 rulings (R\<n\>) | `docs/superpowers/specs/2026-09-18-website-programme-design.md`; `docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md` |
| Design source reference: pages, tokens, copy, CRM feed contracts | `design-package/README.md`, `design-package/docs/project-brief.md`, `design-package/docs/crm-feed.md`, `design-package/docs/translation-process.md` |
| Programme status, branch, next steps | `docs/WEBSITE-HANDOFF.md` (living copy on branch `wp2/foundation`) |

## Stack

Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS 4, next-intl, Zod, Node 22 required. Vitest + Testing Library for unit tests, Playwright + axe-core for e2e/a11y, Lighthouse CI for performance — wired into `npm run gate`. No ORM, no Docker: content is served by a `LOCAL` JSON adapter (Phase A) or fetched from the Operations CMS (Phase B), never its own database. Everything technical: `docs/ARCHITECTURE.md`.

## Run and test

```bash
nvm use && npm ci          # Node 22 (.nvmrc); wrong Node breaks Vitest's localStorage stub
npm run dev                 # http://localhost:3000
npm run typecheck           # tsc --noEmit
npm run lint                # eslint .
npm run format               # prettier --check . (npm run format:write to fix)
npm run test                 # vitest run (npm run test:watch for watch mode)
npm run verify                # typecheck && lint && format && test — the exact Vercel build gate
npm run e2e                   # playwright test (no axe/Lighthouse)
npm run gate                   # bash scripts/gate.sh — Playwright + axe + Lighthouse against a URL
```

No migrations (no database). One-off setup: `npx playwright install chromium`. Default `.env.example` (`CONTENT_SOURCE=LOCAL`) needs nothing else running; forms and the `OPS` adapter need `jobsadmire-operations` on port 4001. Two generation scripts run by hand when their sources change, output committed: `npm run content:import` (design-package strings → `src/content/local/*.json`), `npm run redirects:build` (`redirects/rules.json` → `legacy.json`/`gone.json`).

## Conventions

- **Strings by package id.** Use the design package's stable `<page>.<nnn>` ids as message keys; don't invent new ids for existing copy.
- **New copy goes in the reserved `sys.*` range** (form labels/errors, consent banner, language hint, `/tesekkurler` chrome) — never repurpose a package id for different copy.
- **`sys.*` goes through next-intl only** (`getTranslations('sys')` / `useTranslations('sys')`), never `t()`/`makeT`, which knows package ids only. Full key list: `docs/CONTENT-MODEL.md`.
- **Shared chrome reads one canonical package id per string** (R15), not a per-page one — e.g. the verify-nav label is `home.011`, not a new `sys.nav.verify`. Full table: `docs/CONTENT-MODEL.md` § Chrome canonical ids.
- **Six ids ship with a deliberately empty Turkish value** (`hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107`) — render them empty, never fall back to English.
- **Numbers are data (D17).** A headline number is never typed into a page: read it with `getMetric` / `metricValues` (`src/content/collections.ts`, `src/content/pure.ts`).
- **Every page form goes through the forms kernel** (`src/forms/`, WP2a): a `'use server'` wrapper around `createFormAction(spec)`, rendered by `FormShell` with `Field`s — never a hand-rolled `fetch`.
- **`formatTRY(n, locale)` is a contract, not a formatter of convenience** — every computed figure on the page goes through it (D18); see `docs/ARCHITECTURE.md`.
- **Accessibility wins over pixel fidelity where they conflict** (D20) — named deltas (contrast-safe blue, 1101px desktop breakpoint, fixed-sheet language hint) are accepted by the gate; don't "fix" them back toward the design.
- **Every form's success path navigates to `/tesekkurler?form=<key>`** (D13) — never an inline success state.
- **No candidate identifiers in analytics** — every GTM/GA4 event has a parameter allowlist (D13).
- **Content-route JS budget is 180 KB gzipped**, not 120 KB (R49 corrected the plan's figure).
- **`.superpowers/` (repo root) is git-ignored scratch**; `docs/superpowers/` is the tracked plans/specs path.

## Hard rules and gotchas

- **Never call Operations from the browser** — server-only, Bearer tokens (D6). `docs/ARCHITECTURE.md` § Content adapter.
- **Never serve pool, stories, or representatives fixtures in production** (D23) — enforced by `assertServableInProduction` and an ESLint `no-restricted-imports` rule. `docs/ARCHITECTURE.md` § Content adapter (D7, D23).
- **Never commit env files.** The old site leaked `.env` (Resend key, DB password), preserved on `main-backup` — don't read secrets from that branch. `docs/DEPLOYMENT.md` § Retired secrets log.
- **Never ship `html { zoom: .75 }`** — normalise design tokens at 0.75 at the source instead (D19). `docs/ARCHITECTURE.md` § D19.
- **The Vercel build runs `npm run verify`**; a build that fails it must not reach preview or production. `docs/DEPLOYMENT.md` § Deploy discipline.
- **`npm run gate` runs outside the Vercel build**, once per work package against a preview URL — no Chrome in the build environment. `docs/ARCHITECTURE.md` § Quality gate (D27).
- **Fixtures (`design-package/data/*.sample.json`) are dev-only** — never wired to a production code path. `docs/ARCHITECTURE.md` § Content adapter.
- **`npm run dev` appends an `nextjs-agent-rules` block to this file** — revert before committing, never commit that block. `docs/DEPLOYMENT.md` § Deploy discipline.
- **Do not run WP3b/CRM work in parallel with WP3c** (D24). `docs/superpowers/specs/2026-09-18-website-programme-design.md`.
- **Redirects are single-hop 308s resolved in `next.config.ts` before middleware**; `src/proxy.ts` then handles `410`s and locale resolution. `docs/ARCHITECTURE.md` § Routing.
- **Operations tokens are three classes (read/write/preview), current + previous each, timing-safe, fail closed.** `docs/INTEGRATIONS.md` § Token threat model + rotation runbook.
- **Regenerated content/redirect output is committed, never left stale against its source.** `docs/CONTENT-MODEL.md`; `docs/redirects.md`.

Hard rules live in this file and in `docs/OPERATING.md` (site-health, kill switches, owner checks); there is no separate `GOTCHAS.md` in this repo.

## Keep the docs current

A task is not done until the docs match the code, in the same change set.

- Business-logic change (pages, forms, i18n, SEO, a11y, legal, scope) → `docs/PRD.md`.
- Code structure, integrations, environment, setup change → `docs/ARCHITECTURE.md`.
- Deploy pipeline or Vercel/server change → `docs/DEPLOYMENT.md`.
- New hard-won rule → its topic doc, plus a one-liner here only if it's top-15 risk.
- Shipped pending feature → move its spec out of `docs/pending/README.md`, fold the rules into `docs/PRD.md`.

## Before declaring a task done

1. `npm run verify` green (typecheck, lint, format, unit tests).
2. `npm run gate` run against a preview URL for that work package — not skipped for "just copy" changes; the only place responsive/a11y regressions get caught before a human does.
3. Docs updated in the same change set — this file's doc map, `docs/PRD.md`, `docs/ARCHITECTURE.md`, or whichever doc governs the area touched.
4. Operations-contract change (forms, bundle shape, tokens): `docs/INTEGRATIONS.md` updated, `jobsadmire-operations/docs/PRD.md` §5.12/§7.10 checked for drift.
5. Redirects change: `docs/redirects.md` and the Vitest no-chain test updated.

This repo has no push-without-asking rule. Whether a push to `main` reaches production depends on the Vercel deploy guards (`docs/DEPLOYMENT.md` §§ Deploy discipline / Phase A cutover); the current state is recorded in the workspace `WORKSPACE-STATE.md`.

## Token discipline

- Never load a doc whole — `grep -n '^##'` or a keyword search first, then read ≤400 lines; a hook enforces this.
- Use subagents for open-ended exploration across `docs/` or `src/`.
- Don't read `docs/pending/` or `docs/superpowers/` unless the task is about unbuilt features or plan history.
- Never read `node_modules/`, `.next/`, or build output — generated/vendored, never load-bearing for a task.
- Open only the specific `design-package/` file a task needs (a strings JSON, a token file, one of its docs); never browse the package or load its images.
- Credentials live only in the workspace-root `ACCESS.md`; never read them into this repo.

## Environments and deploy

Local dev talks to `LOCAL` content by default, or `jobsadmire-operations` on port 4001 for the `OPS` adapter and forms. Production is `jobsadmire.com` on Vercel — two projects exist (`jobsadmirewebsite` legacy, `jobsadmire-web-v2` this repo); pushing here never touches the VPS. Full detail: `docs/DEPLOYMENT.md`.
