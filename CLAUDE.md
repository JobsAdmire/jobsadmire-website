# JobsAdmire Website — the public site (jobsadmire.com)

The public marketing site: Turkish at the root, English under `/en`. It sells to Turkish employers who need foreign workers, recruits partners abroad, and lets anyone check whether a person really represents JobsAdmire. Next.js on Vercel, a single `package.json` (not a monorepo), no database, no Docker.

Three boundaries: it talks **only to Operations**, never the CRM portal; **only from the server**, never from the browser; and nothing on the VPS depends on it being up.

The workspace-root `../CLAUDE.md` holds the routing between the apps and the links to Operations and the portal — read it first. What is live right now: `../WORKSPACE-STATE.md`. Open work and what the owner still owes: `docs/pending/README.md`.

**Decision ids.** The code and docs cite decisions by id: `D<n>` is the programme spec (`docs/superpowers/specs/2026-09-18-website-programme-design.md`), `R<n>` the WP1 ruling log (`docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md`), `W<n>` the WP2 ruling log (`docs/superpowers/plans/2026-09-20-wp2-rulings.md`, closed at W251). Look an id up there with grep; never re-derive it. A new owner ruling is written into `docs/PRD.md` with its date.

## Where to look

- Pages, routes, slugs, the forms on each page, i18n and copy rules, SEO, accessibility, performance budget, analytics, legal pages, scope, calculator rules → `docs/PRD.md`
- Stack, repo layout, environment variables, running locally, routing and `src/proxy.ts`, the content adapter, freshness (ISR), the forms flow, the design system and the desktop scale (D19), the quality gate (D27) → `docs/ARCHITECTURE.md` (list its sections with `grep -n '^## '`)
- Every integration (I1–I21), the form envelope, tokens and how they rotate → `docs/INTEGRATIONS.md`
- The wire contracts with Operations: schemas, fixtures, tests → `contract/` (start at `contract/CONTRACT.md`)
- String catalogue, `sys.*` keys, the chrome's canonical ids, bundle shape, blog model → `docs/CONTENT-MODEL.md`
- Metadata, sitemap, structured data → `docs/SEO.md`
- Consent, GTM, events and their parameter allowlist → `docs/ANALYTICS.md`
- Redirect rules and the built redirect files → `docs/redirects.md`; `redirects/`
- Retention, erasure requests, KVKK, consent evidence → `docs/PRIVACY.md`
- Site health, the daily synthetic lead, kill switches, owner checks → `docs/OPERATING.md`
- The Vercel project, env scopes, the retired secrets log, deploy discipline → `docs/DEPLOYMENT.md`
- The pixel harness (`npm run pixel`) → `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`
- Design notes of the blog and candidates feeds → `docs/superpowers/plans/2026-10-06-blog-module.md`, `docs/superpowers/plans/2026-11-02-available-workers-feed.md`
- The design source: pages, tokens, copy → `design-package/README.md`, `design-package/docs/`

Never rename or move `docs/superpowers/`: code comments, the contract files and an Operations migration cite its files by path.

## Stack

Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, next-intl, Zod; Node 22 (`.nvmrc`). Vitest + Testing Library for unit tests, Playwright + axe for end-to-end and accessibility, Lighthouse CI for performance. Content is the committed `LOCAL` bundle (`src/content/local/`), plus live server-side reads from Operations for the blog (`BLOG_SOURCE=OPS`), the available workers (`POOL_SOURCE=OPS`) and the careers openings. The `OPS` bundle adapter has no producer in Operations yet.

## Run and test

```bash
nvm use && npm ci           # Node 22; a wrong Node breaks Vitest's localStorage stub
npm run dev                 # http://localhost:3000
npm run verify              # typecheck, lint, Prettier check, unit tests: the exact gate the Vercel build runs
npm run format:write        # Prettier fix (the check also covers CLAUDE.md, README.md and docs/)
npm run e2e                 # Playwright with axe (no Lighthouse); one-off setup: npx playwright install chromium
npm run gate                # Playwright + axe + Lighthouse against a URL (E2E_BASE_URL); `gate:launch` adds the launch checks
npm run js-size             # the per-route JS table after a gate run
npm run careers:door        # the mock Operations door for e2e:careers, e2e:blog-ops, e2e:blog-grid, e2e:pool-ops
npm run door:smoke          # one real call through the intake door, test token only
npm run sweep:legacy        # checks the legacy redirects against production
```

`.env.example` (`CONTENT_SOURCE=LOCAL`) needs nothing else running, and it points `OPS_API_URL` at production Operations; for a local Operations stack set `OPS_API_URL=http://localhost:4001`. Generators run by hand when their source changes, and their output is committed: `content:import`, `redirects:build`, `assets:map`, `assets:flags`. One heavy build or test job at a time on this machine.

## Conventions

- **Strings by package id.** Message keys are the design package's stable `<page>.<nnn>` ids; never invent a new id for existing copy. New copy goes in the reserved `sys.*` range, read through next-intl only (`getTranslations('sys')`), in both languages. Shared chrome reads one canonical id per string (`docs/CONTENT-MODEL.md`).
- **Seven ids have a deliberately empty Turkish value** (`hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107`, `availworkers.026`): render them empty, never fall back to English.
- **Copy is frozen**: the live catalogue wins over the design package's text. The company is "JobsAdmire", never "we"; the country is "Türkiye".
- **Numbers are data (D17).** A headline number is never typed into a page: read it with `getMetric` / `metricValues` (`src/content/collections.ts`, `src/content/pure.ts`). Every computed money figure goes through `formatTRY(n, locale)` (D18).
- **Every page lives in a route group**: `src/app/[locale]/(site)/` (full chrome) or `(minimal)/` (legal, thank-you, newsletter). A new page adds its two locale paths to `e2e/routes.ts`, the one route list of the gate.
- **Every form goes through the forms kernel** (`src/forms/`): a `'use server'` wrapper around `createFormAction(spec)`, rendered by `FormShell` with `Field`s, never a hand-rolled `fetch`. Success always navigates to `/tesekkurler?form=<key>` (D13).
- **The WhatsApp consent box** on the seven lead forms is optional and is evidence only (`src/forms/whatsapp-consent.ts`). Bump `WHATSAPP_CONSENT_VERSION` whenever its label changes in either language.
- **Accessibility wins over pixel fidelity** (D20). The named deltas (the contrast-safe blue, the header's desktop row from 901 px, the fixed-sheet language hint) are accepted by the gate: do not "fix" them back toward the design.
- **JS budget: 200 KB gzipped per gate route** (`resource-summary:script:size ≤ 204800`); a route above 194,560 B gets a `next/dynamic` pass before the next page starts.
- **No candidate or visitor identifiers in analytics**: every event has a parameter allowlist (D13). GA4 only through GTM.

## Hard rules

- **Never call Operations from the browser, and never call the CRM at all** (D6). Server-only, Bearer tokens. Tokens: write, test (`wst_`, dry run) and the previous write value for 24 hours after a rotation; timing-safe, fail closed (`docs/INTEGRATIONS.md`).
- **The wire contracts change only together with Operations.** `contract/website-bundle.v1.ts` is hash-pinned (`CONTRACT_FILE_SHA256` in `contract/contract.test.ts`); `contract/blog-feed.v1.ts` and `contract/candidates-feed.v1.ts` each have a fixture and a test. Change the schema, the fixture, Operations' copy and both repos' docs in one task (`contract/CONTRACT.md`, `../CLAUDE.md`).
- **Never serve pool, stories or representatives fixtures in production** (D23): `assertServableInProduction` and an ESLint rule enforce it. Sections that wait for real data show page-local samples under the "örnek" tag (`SampleTag`), nothing else.
- **Never commit env files, and never open the old site's secrets.** Its `.env` files are in this repo's history (tag `old-website-final`). `docs/DEPLOYMENT.md`, retired secrets log.
- **Never ship the design's `html { zoom: .75 }`**: tokens are normalised at 0.75 at the source (D19). The only root zoom is the liquid desktop's (W231); its pitfalls are in `docs/ARCHITECTURE.md`, section D19.
- **Redirects are single-hop 308s** built from `redirects/rules.json` (`npm run redirects:build`) and resolved in `next.config.ts` before the middleware; `src/proxy.ts` answers the 410s and resolves the locale. Generated redirect and content files are committed, never left stale against their source.
- **Markdown is Prettier-checked in the build.** Run `npx prettier --write` on every doc you touch, this file included, or the production build fails.
- **`next dev` may append an `nextjs-agent-rules` block to this file or write an `AGENTS.md`** (Next's own agent-files writer). Never commit either.
- **`public/docs/` is site content** (licence PDFs the About page links to), not documentation.
- **Vercel Hobby limits:** crons run daily at most; functions default to 10 seconds; Instant Rollback reaches only the previous production deployment.

## Keep the docs current

A task is not done until the docs match the code, in the same change set: pages, forms, i18n, SEO, accessibility, legal, scope → `docs/PRD.md`; structure, integrations, environment, setup → `docs/ARCHITECTURE.md`; Vercel and deploy → `docs/DEPLOYMENT.md`; a new hard-won rule → its topic doc, and one line here only if it is top-risk (this repo has no `GOTCHAS.md`). A pending item that ships leaves `docs/pending/README.md` and its rule goes into the PRD. Never a date, a work-package name or a status in this file.

## Before declaring a task done

1. `npm run verify` green.
2. For UI or page work: push the branch, then run `npm run gate` against its preview URL before merging. It is the only place responsive and accessibility regressions are caught.
3. Docs updated in the same change set, Prettier-formatted.
4. A change to the Operations contract (a form field, a feed shape, a token): `docs/INTEGRATIONS.md` and `contract/` here, and Operations' code and `docs/PRD.md` §5.12 / §7.10 / §7.11 there, in the same task.
5. A redirects change: `docs/redirects.md` and the no-chain test `redirects/redirects.test.ts`.

**A push to `main` is a production deploy of jobsadmire.com**: Vercel builds every `main` commit (`npm run verify && next build`) and promotes it within minutes. Push to `main` only verify-green work that the task was asked to ship; everything else goes on a branch, which builds a sign-in-protected preview. Rollback: Vercel Instant Rollback to the previous production deployment, or revert and push.

## Reading the docs

- Never load a doc whole: `grep -n '^## '` or a keyword first, then read the part you need. The ruling logs, `docs/CONTENT-MODEL.md`, `docs/SEO.md` and `docs/INTEGRATIONS.md` are large.
- Use subagents for open-ended exploration across `docs/` or `src/`. Never read `node_modules/`, `.next/` or build output.
- Open only the one `design-package/` file a task needs; never browse the package or load its images.
- Secrets: never open, grep or print `.env` files (`.env.example` is fine), `../ACCESS.md` or `../.secrets/`. After a gate run against a protected preview, `.lighthouseci/`, `lighthouse-report/` and `test-results/` contain the Vercel bypass secret.
