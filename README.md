# JobsAdmire Website

The public jobsadmire.com site — Next.js 16 / React 19 / Tailwind 4 / TypeScript, rebuilt from the Claude Design package. Serves Turkish employers at the root and English visitors under `/en`; talks only to `operations.jobsadmire.com` (never the CRM, never the browser-to-Operations path — see `CLAUDE.md`).

Full context: `CLAUDE.md` (rulebook + doc map). Product/architecture/ops docs: `docs/`. Approved programme plan: `docs/superpowers/specs/2026-09-18-website-programme-design.md`.

## Stack

Next.js 16, React 19, TypeScript (strict), Tailwind 4, next-intl, Zod, Vitest, Playwright + axe, Sentry, Vercel Web Analytics + Speed Insights, Node 22.

## Local dev

```bash
npm ci
npm run dev              # http://localhost:3000
npm run verify            # typecheck + lint + format + unit tests — the same check the Vercel build runs
E2E_BASE_URL=http://localhost:3000 npm run gate   # Playwright + axe + Lighthouse — run outside the build, needs Chrome
```

Other scripts: `npm run typecheck`, `npm run lint`, `npm run format` / `format:write`, `npm run test` / `test:watch`, `npm run e2e` (Playwright only, no Lighthouse/axe).

Local dev talks to the Operations backend on **port 4001** (`jobsadmire-operations` — see the workspace-root `CLAUDE.md`); run that stack alongside this one for anything past the `LOCAL` content adapter.

## Environments

| Environment | Vercel project      | Domain                                    | Notes                                                         |
| ----------- | ------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| Production  | `jobsadmire-web-v2` | jobsadmire.com (after Phase A cutover)    | `main` branch; `npm run verify` gates every build             |
| Preview     | `jobsadmire-web-v2` | `*.vercel.app` / `staging.jobsadmire.com` | Deployment Protection on; preview/test tokens only; `noindex` |
| Local       | —                   | localhost:3000                            | Against the Operations stack on port 4001                     |

The pre-existing Vercel project `jobsadmirewebsite` still serves the old site and is left untouched until Phase A cutover — see `docs/DEPLOYMENT.md`.

## Where the docs are

See `CLAUDE.md`'s doc map table. Start with `docs/PRD.md` for what the site is, `docs/ARCHITECTURE.md` for how it's built.
