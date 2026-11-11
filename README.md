# JobsAdmire Website

The public site jobsadmire.com: Next.js 16, React 19, TypeScript, Tailwind 4 and next-intl. Turkish is served at the root, English under `/en`. The site talks only to `operations.jobsadmire.com`, and only from the server — never to the portal, never from the browser.

Production is on Vercel (project `jobsadmirewebsite`). **A push to `main` is a production deploy of `www.jobsadmire.com` within minutes.** Every other branch builds a preview behind Vercel sign-in.

## Commands

```bash
nvm use && npm ci                     # Node 22 (.nvmrc)
npm run dev                           # http://localhost:3000
npm run verify                        # typecheck + lint + format + unit tests — the check every Vercel build runs
npm run e2e                           # Playwright with axe, against E2E_BASE_URL (default http://localhost:3000)
E2E_BASE_URL=<url> npm run gate       # Playwright + axe + Lighthouse against a preview or a local build
```

One-off setup: `npx playwright install chromium`. The gate needs Chrome and is never part of the Vercel build.

`npm run verify` also checks the formatting of Markdown: run `npx prettier --write <file>` on every doc you touch.

Every other script is in `package.json` and explained in `docs/ARCHITECTURE.md` § Run locally and § Test / quality gates.

## Where to read

- `CLAUDE.md` — the rulebook and the doc map. Start here.
- `docs/PRD.md` — what the site is: pages, forms and business rules.
- `docs/ARCHITECTURE.md` — how it is built: stack, layout, environment variables, the quality gate.
- `docs/DEPLOYMENT.md` — Vercel, environment variables, rollback, the retired-secrets log.
- `docs/pending/README.md` — unbuilt work and what the owner still owes.
- `docs/superpowers/` — the decision record: the programme spec (D1–D28) and the two ruling logs (R1–R60, W1–W251).
