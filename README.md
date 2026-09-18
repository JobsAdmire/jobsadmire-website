# JobsAdmire Website

The public jobsadmire.com site — Next.js 16 / React 19 / Tailwind 4 / TypeScript, rebuilt from the Claude Design package. Serves Turkish employers at the root and English visitors under `/en`; talks only to `operations.jobsadmire.com` (never the CRM, never the browser-to-Operations path — see `CLAUDE.md`).

Full context: `CLAUDE.md` (rulebook + doc map). Product/architecture/ops docs: `docs/`. Approved programme plan: `docs/superpowers/specs/2026-09-18-website-programme-design.md`.

## Stack

Next.js 16, React 19, TypeScript (strict), Tailwind 4, next-intl, Zod, Vitest, Playwright + axe, Node 22. Vercel Web Analytics + Speed Insights and Sentry are part of the target stack but not yet wired in WP1 (`docs/ARCHITECTURE.md`).

## Local dev

```bash
npm ci
npm run dev                # http://localhost:3000
npm run verify              # typecheck + lint + format + unit tests — the same check the Vercel build runs
```

Two one-off setup notes: `npx playwright install chromium` once per machine (the gate's browser, and Lighthouse's), and run **Node 22** (`nvm use` — `.nvmrc`) — Node ≥ 23 changes the stub `localStorage` global in a way that shadows jsdom's own under Vitest, which is why `src/test/storage.ts` exists as a workaround; running the right Node version avoids needing it.

Local dev talks to the Operations backend on **port 4001** (`jobsadmire-operations` — see the workspace-root `CLAUDE.md`); run that stack alongside this one for anything past the `LOCAL` content adapter.

### Content and redirects

```bash
npm run content:import     # scripts/import-design-package.ts — rebuilds src/content/local/*.json from design-package/strings/*.json
npm run redirects:build    # scripts/build-redirects.ts — rebuilds redirects/legacy.json + gone.json from redirects/rules.json (+ redirects/gsc-clicks.csv)
```

Neither runs automatically; re-run by hand whenever their source files change, and commit the regenerated output (both are checked in, both are Prettier-ignored — see `docs/CONTENT-MODEL.md` and `docs/redirects.md`).

### Running the gate

`npm run gate` (`scripts/gate.sh`) is Playwright + axe + Lighthouse CI against a URL — it needs Chrome and is never part of the Vercel build. Two ways to point it at something:

```bash
# Against a Vercel preview (the binding run for work-package sign-off — docs/OPERATING.md):
E2E_BASE_URL=https://<preview>.vercel.app REVALIDATE_SECRET=<the preview's own secret> npm run gate

# Against a local production build, on port 3100 (fast feedback only — see the LCP note below):
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4 \
  && E2E_BASE_URL=http://localhost:3100 npm run gate; kill $(cat /tmp/next.pid)
```

`REVALIDATE_SECRET` must be the same value the server under test was started with. It's optional: without it, `gate.sh` prints a warning and the two token-dependent cases in `e2e/ops.spec.ts` skip themselves (Ruling R43) rather than failing.

**Localhost LCP is a warning, not an error.** Against `localhost`/`127.0.0.1`, `gate.sh` asserts with `lighthouserc.local.json` instead of `lighthouserc.json` — identical except Largest Contentful Paint is downgraded to `warn`. Every asset on localhost arrives inside ~60 ms, so Lighthouse's Lantern simulation charges the entire early payload to the paint and reports ~2.7 s on every path regardless of what's actually slow (the real, devtools-throttled figure is closer to 1.5 s). Every other budget — performance, accessibility, best-practices, SEO, the script-size budget, CLS — stays an error in both configs. A green local gate run is fast feedback, not sign-off; sign-off is the same run against a Vercel preview URL, where LCP is an error like everything else.

Other scripts: `npm run typecheck`, `npm run lint`, `npm run format` / `format:write`, `npm run test` / `test:watch`, `npm run e2e` (Playwright only, no Lighthouse/axe).

## Environments

| Environment | Vercel project      | Domain                                    | Notes                                                         |
| ----------- | ------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| Production  | `jobsadmire-web-v2` | jobsadmire.com (after Phase A cutover)    | `main` branch; `npm run verify` gates every build             |
| Preview     | `jobsadmire-web-v2` | `*.vercel.app` / `staging.jobsadmire.com` | Deployment Protection on; preview/test tokens only; `noindex` |
| Local       | —                   | localhost:3000                            | Against the Operations stack on port 4001                     |

The pre-existing Vercel project `jobsadmirewebsite` still serves the old site and is left untouched until Phase A cutover — see `docs/DEPLOYMENT.md`.

## Where the docs are

See `CLAUDE.md`'s doc map table. Start with `docs/PRD.md` for what the site is, `docs/ARCHITECTURE.md` for how it's built.
