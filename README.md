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

### Content, redirects and assets

```bash
npm run content:import     # scripts/import-design-package.ts — rebuilds src/content/local/*.json from design-package/strings/*.json
npm run redirects:build    # scripts/build-redirects.ts — rebuilds redirects/legacy.json + gone.json from redirects/rules.json (+ redirects/gsc-clicks.csv)
npm run assets:map         # scripts/build-source-map.ts — rebuilds src/design/assets/source-map.generated.tsx (the sourcing map)
npm run assets:flags       # scripts/build-flags.ts — rebuilds public/brand/flags.svg from the flag-icons devDependency
npm run assets:brand       # scripts/fetch-brand.sh — the one-time fetch of public/brand/logo.png + iskur.png (committed)
```

None of them runs automatically or in the build; re-run by hand whenever their sources change, and commit the regenerated output (all of it is checked in; the generated JSON and TSX are Prettier-ignored — see `docs/CONTENT-MODEL.md`, `docs/redirects.md` and `docs/ARCHITECTURE.md` § Assets).

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

**LCP is measured the same way everywhere (W145).** All three Lighthouse configs throttle through DevTools (`throttlingMethod: "devtools"`), run each path three times and assert the median run, so LCP ≤ 2.5 s and performance ≥ 0.95 are errors against localhost as well as a preview — R50's localhost LCP warning is retired (`lighthouserc.local.json` is now identical to `lighthouserc.json`). Lighthouse's default simulation (Lantern) charged the whole initial waterfall to a text LCP element with no resource of its own and read ~2.7–3.0 s on every path whatever the page did; the throttled paint it now measures is ~1.5 s locally. Expect ~15 s per run, three runs per path. A green local gate run is fast feedback, not sign-off; sign-off is the same run against a Vercel preview URL.

**Three more gate commands.** `npm run gate:launch` is the same run plus the Gate A checks (`UNBUILT_PATHNAMES` empty, D26 placeholder counter with the content-readiness table — `docs/ARCHITECTURE.md` § Quality gate item 6); it is expected to fail until the last page lands. `npm run js-size` re-prints the per-route script-size table from the last collected Lighthouse runs (`.lighthouseci/`); `E2E_BASE_URL=<url> npm run js-size -- --routes /a,/b` (or `--routes=/a,/b`) is the W94 spot-check for routes outside the gate list — it collects them with the Lighthouse config and bypass header the gate itself uses into `.lighthouseci-extra/` (git-ignored) and prints their sizes, never asserted. `npm run pixel -- --page=home` (also `hire`, `calc`, `blog-article`; `--locale=en`, `--base=<url>`) is the D27 pixel harness — it needs network and a running build, writes `.pixel/` (git-ignored), and is bounded by the two-iteration rule in `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`.

Other scripts: `npm run typecheck`, `npm run lint`, `npm run format` / `format:write`, `npm run test` / `test:watch`, `npm run e2e` (Playwright only, no Lighthouse/axe).

- A local preview rehearsal (`NEXT_PUBLIC_SITE_FACE=preview` against `next start`) selects the preview Lighthouse config — the same DevTools-throttled assertions minus the two robots audits (W145) — and SEO must score 1. Real preview runs need `VERCEL_AUTOMATION_BYPASS_SECRET` exported (owner's ACCESS.md); afterwards `.lighthouseci/`, `lighthouse-report/` and (on a failing run) Playwright's `test-results/` traces all contain the secret — never share any of them (W137 amended).

## Environments

| Environment | Vercel project      | Domain                                    | Notes                                                         |
| ----------- | ------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| Production  | `jobsadmire-web-v2` | jobsadmire.com (after Phase A cutover)    | `main` branch; `npm run verify` gates every build             |
| Preview     | `jobsadmire-web-v2` | `*.vercel.app` / `staging.jobsadmire.com` | Deployment Protection on; preview/test tokens only; `noindex` |
| Local       | —                   | localhost:3000                            | Against the Operations stack on port 4001                     |

The pre-existing Vercel project `jobsadmirewebsite` still serves the old site and is left untouched until Phase A cutover — see `docs/DEPLOYMENT.md`.

## Where the docs are

See `CLAUDE.md`'s doc map table. Start with `docs/PRD.md` for what the site is, `docs/ARCHITECTURE.md` for how it's built.
