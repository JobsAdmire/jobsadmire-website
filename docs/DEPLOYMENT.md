# Deployment — JobsAdmire Website

Full rationale: plan D24, WP0 item 7, WP7a. This doc is the operational reference; update it in the same change set as any deploy-pipeline or secret change.

## Two Vercel projects

| Project             | Status                                       | Serves                                              | Repo link                                               |
| ------------------- | -------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| `jobsadmirewebsite` | Existing, **left untouched** through Phase A | jobsadmire.com (old site, frozen artifact)          | source repo is gone; project serves a frozen deployment |
| `jobsadmire-web-v2` | New, created in WP0                          | Preview only until Phase A cutover, then production | this repo (`jobsadmire-website`)                        |

The existing project is never touched, redeployed, or repointed before cutover — its only job before Phase A is staying up.

## Phase A cutover

Move the `jobsadmire.com` + `www` domains from `jobsadmirewebsite` to `jobsadmire-web-v2` (WP7a). This is a **domain move**, not a redeploy of the old project.

**Rollback:** move the domains back to the old project — the still-`READY` frozen deployment, id **`dpl_hRVuY1faCQe8fQ44sqmw4t82Rs7A`** (2026-02-17). This id is the recorded rollback target from WP0 day 1; do not let it expire or get pruned before Phase A is confirmed stable.

**`legacy.jobsadmire.com`** is aliased to the old deployment for 90 days post-cutover (`noindex`), so any link or bookmark that still points at old-site-specific behaviour has a landing place during the watch window.

The old site's data plane (its MySQL `job_applications` DB, its Resend-powered visa-application mailer) is **not migrated** — see the retired-secrets log below. Once `RESEND_API_KEY` is rotated at cutover, the old site's only working intake stops working. **The flip is one-way**: there is no path back to a functioning old site once that key rotates, only back to its frozen static artifact via the domain-move rollback above.

## Environment variables

Names only — see each environment's Vercel project settings for values, never committed here or anywhere in this repo:

| Variable                   | Purpose                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `OPS_API_URL`              | Base URL for `operations.jobsadmire.com/api/website/v1`            |
| `OPS_WEBSITE_READ_TOKEN`   | Bundle/content reads (current + previous class held by Operations) |
| `OPS_WEBSITE_WRITE_TOKEN`  | Form submissions                                                   |
| `REVALIDATE_SECRET`        | Authenticates Operations → `/api/revalidate` calls                 |
| `NEXT_PUBLIC_SITE_URL`     | Canonical site origin for metadata/sitemap/OG                      |
| Sentry (DSN + org/project) | Error reporting — see `docs/ARCHITECTURE.md` for scrubbing config  |

Preview and Production hold separate values; Local reads from `.env.local` (never committed — see `.gitignore`, which already blocks `.env*` except `.env.example`).

## Deployment Protection

Enabled on Preview for `jobsadmire-web-v2` (WP0 owner action). Preview deployments require authentication to view; they are never publicly reachable, and they always render `noindex`.

## Retired secrets log

The old site (`main-backup` branch, tag `old-website-final`) committed live secrets directly into `.env`/`.env.local`. This table tracks what was found and what happens to each — **names only, never values, anywhere in this repo or its history going forward.**

| Secret                              | Where it lived                                                                                                   | Status                                                                                                                                                                                                                  | Action                                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `RESEND_API_KEY`                    | Committed in `.env`/`.env.local`                                                                                 | **Still live** — powers the old site's only working intake (the visa-application email route; `crm.jobsadmire.com` doesn't resolve and the blog API is dead, so this is the _only_ thing still working on the old site) | Rotate **at Phase A cutover**, not before — pending owner action                                       |
| `DB_PASSWORD`, `DB_USER`, `DB_NAME` | Old site env                                                                                                     | MySQL `job_applications` database; writer already unreachable                                                                                                                                                           | Rotate/decommission — pending owner action                                                             |
| Long-lived CRM JWT                  | Hard-coded in `src/utils/crmUtils.js` and `src/components/candidate-form/homeform.jsx` (old site, `main-backup`) | Legacy CRM target is dead                                                                                                                                                                                               | Nothing to rotate — record only, no action needed                                                      |
| `NEXT_PUBLIC_GEMINI_API_KEY`        | Old site, browser-exposed (`NEXT_PUBLIC_*`)                                                                      | Value empty in git history as found                                                                                                                                                                                     | **Verify at provider** whether a live key was ever issued against this exposure — pending owner action |

Every row stays in this table even after its action is taken — it's the record of what the old site exposed, not a live TODO list to clear. Mark "Action" complete with a date when done; never delete a row.

## Deploy discipline

- Website `main` is **preview-only until Phase A cutover**; production afterward. Deployment Protection covers previews in the meantime.
- The Vercel build runs `npm run verify` (`vercel.json`'s `buildCommand: "npm run verify && next build"`) — a failing typecheck/lint/format/test blocks the build outright.
- `npm run gate` (Lighthouse/Playwright/axe) is **never** part of the Vercel build — there's no Chrome there. It runs against a preview URL, once per work package, from a developer machine or CI (GitHub Actions restoration was checked in WP0, 30 minutes budgeted).
- This repo's push-to-`main` does **not** auto-deploy any VPS infrastructure — Vercel's own git integration handles builds/deploys for both Vercel projects. The workspace-root "push = production in ~2 min" rule describes the VPS-hosted CRM/Operations pipelines, not this repo.
