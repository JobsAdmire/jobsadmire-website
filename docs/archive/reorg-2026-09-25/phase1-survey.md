# Phase 1 Survey Report — jobsadmire-website

_Read-only survey. Sources: stack.json, docs.json, claude-md.json, coverage.json, and chunk JSON files under `scratchpad/phase1/results/`._

## 1. Stack, entry points, folder structure, run locally, tests, deploy

**Structure:** single Next.js app, not a turbo monorepo (no turbo.json, no apps/*, no packages/* — package.json:1-45)

**Stack:**
- framework: Next.js 16.3.5 (package.json:14), React 19.2.8 (package.json:16-17)
- language: TypeScript (tsconfig.json), Node 22.x required (package.json:39-41; README.md:19)
- i18n: next-intl ^4.14.5 (package.json:13; next.config.ts:2,7; src/i18n/routing.ts, src/i18n/request.ts, src/messages/en.json, src/messages/tr.json)
- styling: Tailwind CSS ^4 via @tailwindcss/postcss (package.json:32; postcss.config.mjs)
- validation: zod ^3.25.76 (package.json:15)
- testing: vitest ^4.1.11 unit tests + @testing-library/react (package.json:27,30-31; vitest.config.mts), Playwright ^1.63.0 e2e (package.json:22; playwright.config.ts; e2e/), axe-core/playwright a11y (package.json:19), Lighthouse CI (package.json:20; lighthouserc.json, lighthouserc.local.json)
- no_backend_db: no prisma/schema.prisma found anywhere in repo (find for schema.prisma returned empty); this is a static/SSR marketing site with no own database
- no_docker: no docker-compose*.yml or Dockerfile found anywhere in repo

**Workspace config:** none (no turbo.json, no pnpm-workspace.yaml, no lerna/nx config found)
**package.json files:** package.json (root only — no apps/*/package.json or packages/*/package.json; not a workspace/monorepo)

**Scripts (root package.json):**
| Script | Command |
|---|---|
| `dev` | next dev (package.json:5) |
| `build` | next build (package.json:6) |
| `start` | next start (package.json:7) |
| `lint` | eslint . (package.json:8) |
| `typecheck` | tsc --noEmit (package.json:9) |
| `format` | prettier --check . (package.json:10) |
| `test` | vitest run (package.json:12) |
| `verify` | npm run typecheck && npm run lint && npm run format && npm run test (package.json:14) — this is the Vercel buildCommand gate (vercel.json:5: "npm run verify && next build") |
| `e2e` | playwright test (package.json:15) |
| `gate` | bash scripts/gate.sh (package.json:16) — Playwright+axe+Lighthouse against a URL, never part of Vercel build (README.md:34) |
| `content:import` | tsx scripts/import-design-package.ts (package.json:17) — rebuilds src/content/local/*.json from design-package/strings/*.json (README.md:26) |
| `redirects:build` | tsx scripts/build-redirects.ts (package.json:18) — rebuilds redirects/legacy.json + gone.json from redirects/rules.json + gsc-clicks.csv (README.md:27) |

**vercel.json:**
- framework: nextjs (vercel.json:2)
- buildCommand: npm run verify && next build (vercel.json:5)
- installCommand: npm ci (vercel.json:6)
- git_deploymentEnabled_main: false

**next.config.ts:** wraps config with next-intl plugin (createNextIntlPlugin('./src/i18n/request.ts')), adds legacy redirects loaded from redirects/legacy.json, reactStrictMode true, poweredByHeader false (next.config.ts:1-19)

**Env vars (.env.example):**
- CONTENT_SOURCE (LOCAL|OPS) — .env.example:2
- OPS_API_URL — .env.example:3
- OPS_WEBSITE_READ_TOKEN — .env.example:4
- OPS_WEBSITE_WRITE_TOKEN — .env.example:5
- REVALIDATE_SECRET — .env.example:6
- NEXT_PUBLIC_SITE_URL — .env.example:7
- NEXT_PUBLIC_GTM_ID — .env.example:11
- NEXT_PUBLIC_GA4_ID — .env.example:12
- NEXT_PUBLIC_ADS_ID — .env.example:13
- NEXT_PUBLIC_ADS_CONVERSION_LABEL — .env.example:14
- NEXT_PUBLIC_TURNSTILE_SITE_KEY — .env.example:15

**Other env vars found in code:**
- VERCEL_GIT_COMMIT_SHA — src/app/api/site-health/route.ts:46
- VERCEL_ENV — src/app/robots.ts:9 (drives preview noindex)
- NODE_ENV — src/content/pure.ts:11,65; src/app/[locale]/dev/gallery/page.tsx:58

**Prisma/migrations:** none found in repo
**Docker:** none found in repo

**Route groups (app dir):**
- src/app/[locale]/page.tsx — homepage, locale-aware (imports getBundle/makeT from content/adapter, src/app/[locale]/page.tsx:5)
- src/app/[locale]/hire-workers/page.tsx — 'hire workers' marketing landing page, locale-aware, own metadata (src/app/[locale]/hire-workers/page.tsx:1-13)
- src/app/[locale]/thank-you/page.tsx — post-form-submission thank-you page with conversion ping analytics and WhatsApp link (src/app/[locale]/thank-you/page.tsx:1-9, imports ConversionPing, asFormKey, waLink)
- src/app/[locale]/[...rest]/page.tsx — locale-scoped catch-all that forces notFound() so 404s render inside the locale layout/chrome per next-intl's documented pattern (src/app/[locale]/[...rest]/page.tsx:1-9)
- src/app/[locale]/dev/gallery/page.tsx — internal dev-only component gallery, 404s in production via NODE_ENV check (src/app/[locale]/dev/gallery/page.tsx:58)
- src/app/[locale]/error.tsx, src/app/[locale]/not-found.tsx, src/app/[locale]/layout.tsx — locale-scoped error/404/layout shells
- src/app/global-error.tsx — root-level error boundary outside locale scope
- src/app/api/revalidate/route.ts — POST endpoint Operations calls after a CMS publish to revalidate Next cache tags; Bearer-token authorized via REVALIDATE_SECRET, force-dynamic, excluded from locale proxy matcher (src/app/api/revalidate/route.ts:1-20)
- src/app/api/site-health/route.ts — GET health-check endpoint (bundle fetch status for tr/en, last-revalidate freshness, content source), force-dynamic, watched by an external monitor (src/app/api/site-health/route.ts:1-30)
- src/app/robots.ts — dynamic robots.txt, disallows all when VERCEL_ENV set and non-production (preview noindex) (src/app/robots.ts:9)
- src/app/sitemap.ts — dynamic sitemap generation

**Non-route modules (src/):**
- src/analytics — GTM loader, consent management, conversion ping, form-event tracking (src/analytics/GtmLoader.tsx, consent.ts, ConversionPing.tsx, track.ts, forms.ts)
- src/content — content adapter abstracting LOCAL bundle vs OPS (Operations CMS) fetch, content linting against a baseline/exceptions list, pure config resolution (src/content/adapter.ts, config.ts, lint.ts, pure.ts, local/bundle.en.json, local/bundle.tr.json, local/catalogue.json)
- src/design/chrome — site chrome: Header, Footer, MobileNav, MobileBottomBar, ConsentBanner, LanguageSwitcher, StickyCtaBar, WhatsAppFab, SocialRail (src/design/chrome/*)
- src/design/primitives — design-system primitives: Accordion, Button, Card, Chip, Dialog, FormField, Section, Tabs, Timeline, Stat (src/design/primitives/*)
- src/i18n — next-intl routing/navigation/request config (src/i18n/routing.ts, navigation.ts, request.ts)
- src/lib/contact.ts — contact/WhatsApp link helpers
- src/lib/format/money.ts — currency/number formatting
- src/lib/seo — metadata builder, JSON-LD structured data, canonical route helpers (src/lib/seo/metadata.ts, jsonld.ts, routes.ts)
- src/lib/sanity.ts — sanity-check helper (test file present: src/lib/sanity.test.ts; source content not read per scope)
- src/proxy.ts — locale routing / redirect proxy logic (Next middleware-equivalent)
- contract/website-bundle.v1.ts — versioned TypeScript contract/schema for the content bundle shape shared with Operations CMS (contract/CONTRACT.md, contract/website-bundle.v1.fixture.json)
- redirects/ — rules.json (source), legacy.json + gone.json (built), gsc-clicks.csv (input data) for the redirect map (README.md:27)

**Integrations:**
- Operations CMS (jobsadmire-operations) — content bundle fetched via HTTP fetch() to `${OPS_API_URL}/api/website/v1/bundle?locale=...` with Bearer OPS_WEBSITE_READ_TOKEN (src/content/adapter.ts:19-20); switched on by CONTENT_SOURCE=OPS (src/content/config.ts:5-7)
- Operations → Website revalidate webhook — POST /api/revalidate authorized by REVALIDATE_SECRET Bearer token (src/app/api/revalidate/route.ts:13; docs/DEPLOYMENT.md 'Operations calls this after a publish')
- Google Tag Manager — NEXT_PUBLIC_GTM_ID, loaded client-side (src/analytics/GtmLoader.tsx; src/content/pure.ts:48)
- Google Analytics 4 — NEXT_PUBLIC_GA4_ID (src/content/pure.ts:47)
- Google Ads conversion tracking — NEXT_PUBLIC_ADS_ID + NEXT_PUBLIC_ADS_CONVERSION_LABEL (src/content/pure.ts:49-51)
- Cloudflare Turnstile — NEXT_PUBLIC_TURNSTILE_SITE_KEY, site key only, secret key not held by this repo (docs/DEPLOYMENT.md env table)
- Vercel platform — vercel.json buildCommand/installCommand; VERCEL_GIT_COMMIT_SHA and VERCEL_ENV read at runtime (src/app/api/site-health/route.ts:46; src/app/robots.ts:9); two Vercel projects per docs/DEPLOYMENT.md (jobsadmirewebsite legacy, jobsadmire-web-v2 this repo)
- Sentry — explicitly NOT integrated yet, no @sentry/* dependency in package.json (docs/DEPLOYMENT.md env table note)
- No direct SDK imports found for axios/sanity/stripe/resend/twilio/posthog in src (grep returned no matches)

**Commands:**
- run_locally: npm ci && npm run dev (README.md:13-16, http://localhost:3000); requires Node 22 via nvm use (README.md:19)
- test: npm run test (vitest run) / npm run test:watch; npm run e2e (Playwright, no Lighthouse/axe) (README.md:49; package.json:12,15,22)
- verify_gate: npm run verify = typecheck && lint && format && test — same check Vercel build runs (README.md:16; vercel.json:5)
- full_gate: npm run gate (scripts/gate.sh) — Playwright + axe + Lighthouse CI against a URL, needs Chrome, never part of Vercel build (README.md:34; package.json:16)
- content_and_redirects_rebuild: npm run content:import; npm run redirects:build (README.md:26-27)

**Deploy:**
- target: Vercel (not the VPS) — vercel.json; docs/DEPLOYMENT.md
- projects: two Vercel projects: 'jobsadmirewebsite' (legacy, frozen, untouched until cutover) and 'jobsadmire-web-v2' (this repo, preview-only until Phase A cutover) (docs/DEPLOYMENT.md 'Two Vercel projects' table)
- build_gate: vercel.json buildCommand runs 'npm run verify && next build' — failing typecheck/lint/format/test blocks the Vercel build (docs/DEPLOYMENT.md 'Deploy discipline')
- main_branch_deploy_disabled: vercel.json git.deploymentEnabled.main = false (vercel.json:7-9)
- not_auto_deployed_by_vps_cron: this repo's push-to-main does NOT trigger the workspace-root VPS 'push=prod in ~2min' cron poller — that rule applies only to CRM/Operations VPS stacks, not this Vercel-hosted repo (docs/DEPLOYMENT.md 'Deploy discipline' last bullet)

**Notes:**
- This is a standalone Next.js 16 app-router site, not a Turborepo monorepo despite the ecosystem CLAUDE.md describing 'two independent Turborepo monorepos' for CRM/Operations — the website repo itself has no turbo.json, apps/*, or packages/*.
- docs/PRD.md was explicitly excluded from this survey per task scope.
- design-package/, ACCESS.md, .secrets/, .remember/, and backup folders were not opened per task constraints.

## 2. Docs inventory

| Path | Purpose | Class | Recommendation | Reason |
|---|---|---|---|---|
| docs/ANALYTICS.md | Consent Mode v2 loading order, GTM/GA4 wiring, real analytics account IDs (GA4/GTM/Ads), event schema | current-state | keep | Describes already-shipped WP1 consent/analytics wiring (docs/ANALYTICS.md:20 GtmLoader.tsx, ConsentBanner.tsx) plus the real account IDs config values; actively cross-referenced by CLAUDE.md and 6 other docs. |
| docs/ARCHITECTURE.md | Routing (proxy.ts/next-intl), content adapter (LOCAL/OPS), ISR/time floors, forms flow, design system, environments | current-state | keep | The most heavily cross-referenced doc in the repo (12 referrers); documents the as-shipped WP1 routing/content-adapter code with real commit SHAs (docs/ARCHITECTURE.md:45,47,51). Note: docs/ARCHITECTURE.md already exists (per task instruction) and is the correct authoritative architecture doc; no separate architecture doc competes with it. |
| docs/CONTENT-MODEL.md | Bundle shape v1.0 (Zod schema), string catalogue rules, content:import script, nav groups | current-state | keep | Documents the shipped contract/website-bundle.v1.ts schema and the WP1 importer (docs/CONTENT-MODEL.md:77,91); notes which fields are still empty in WP1 (pages, collections at docs/CONTENT-MODEL.md:87-88) as forward-looking sub-notes within an otherwise current doc, not a standalone pending-feature doc. |
| docs/DEPLOYMENT.md | Two Vercel projects, Phase A cutover/rollback plan, env var names, retired-secrets log | current-state | keep | Operational reference for the live rollback target (docs/DEPLOYMENT.md:120, dpl_hRVuY1faCQe8fQ44sqmw4t82Rs7A) and env var inventory; cutover itself (§Phase A) is not-yet-executed but this is the runbook for when it happens, not a spec for unbuilt product surface — kept per instructions (deployment/runbook docs stay, they are operational not product pending-features). |
| docs/INTEGRATIONS.md | Full I1-I20 integration catalogue with phase tags [A]/[B]/[v1.1], direction, auth per integration | current-state | keep | Mixed doc: catalogues both live [A] integrations (I4 forms, I15 portal links) and future [B]/[v1.1] ones (I3 draft preview, I7/I8 CRM stats, I9 representatives) in one table (docs/INTEGRATIONS.md:141-162); kept whole since it is the single integration reference CLAUDE.md points to and splitting it would fragment the contract table. |
| docs/OPERATING.md | Site-health check contract, synthetic lead/digest, kill switches, day-to-day operating reference once live | current-state | keep | Documents the shipped WP1 /api/site-health checks table with actual code paths (docs/OPERATING.md:180, src/app/api/site-health/checks.ts) and an explicit WP5 blocker note; operational runbook, not a spec for unbuilt product. |
| docs/PRD.md | Product requirements: audiences, 11-page/route/form table, i18n, SEO/a11y/perf budgets, legal pages, scope, pending owner items, WP1-delivered summary | current-state | keep | Explicitly the product-surface source of truth per CLAUDE.md:5,12; §11 'WP1 delivered' and §10 'Pending/owner-decided items' are subsections within it, so the doc itself stays current-state even though it enumerates unbuilt pages (10 of 11 land in WP2, docs/PRD.md line 213-229) — those are tracked as PRD sections, not spun out as a separate pending-feature doc. |
| docs/PRIVACY.md | Form-payload retention (90-day purge), DSAR/erasure runbook across 5 data surfaces, KVKK 72-hour breach runbook outline | current-state | keep | Operational/legal-compliance reference (retention cron, DSAR inventory) that is live/enforced now (docs/PRIVACY.md:237 purge cron 04:30 daily); the KVKK runbook is explicitly marked 'outline, to be completed... at WP5-gate' (docs/PRIVACY.md:249,253) but is a sub-section of an otherwise-current doc, not grounds to reclassify the whole file. |
| docs/SEO.md | Metadata/hreflang/sitemap/robots/JSON-LD implementation notes, redirect policy pointer, 12-week post-launch watch | current-state | keep | Documents shipped code (app/sitemap.ts, app/robots.ts, src/lib/seo/jsonld.ts at docs/SEO.md:277-287) with explicit call-outs of what's not yet wired (Article/JobPosting builders, WP2); kept as-is since it's the single SEO reference 8 other docs point to. |
| docs/WEBSITE-HANDOFF.md | 2026-09-25 resume document for the whole website programme: repos/branches, WP0-WP7b state table, next steps, owner holds | current-state | keep | Explicitly the single resume document per CLAUDE.md:77 and its own header (docs/WEBSITE-HANDOFF.md:295-299); most recently touched doc in the repo, live status tracker not a historical record, so classified current-state rather than history despite summarizing past work packages. |
| docs/redirects.md | D21 redirect rules pipeline (rules.json to legacy.json/gone.json), the 517-vs-49-row explanation, no-chain invariants | current-state | keep | Documents the live, shipped redirect-generation pipeline and its test invariants (docs/redirects.md:345-354, redirects/redirects.test.ts); policy record and forecast for a system already in production use. |
| docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md | Durable ruling log R1-R60 for the completed WP1 implementation, with landed task/commit/file per ruling | history | archive | Self-describes as a durable record of an already-executed plan (docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md:1-3, 'copied from' a git-ignored scratch ledger, R1-R60 all resolved/landed with commit SHAs); a QA/ruling artifact of finished work, not current guidance — but it is still actively cross-referenced by CLAUDE.md/PRD/ARCHITECTURE for citation of decisions, so archiving should preserve the link targets (e.g. move under docs/archive/ and update the 6 referencing docs' links) rather than delete. |
| docs/superpowers/plans/2026-09-18-wp1-foundation.md | Executed WP1 implementation plan (task-by-task, global constraints, checkbox tracking) for the website foundation work package | history | archive | WP1 is marked DONE, merged to main (docs/WEBSITE-HANDOFF.md:312, commit ad58fb8); this is the executed task plan itself, referenced now only for historical citation of tech-stack/constraint rationale (docs/superpowers/plans/2026-09-18-wp1-foundation.md:35-60) that already lives verbatim in docs/ARCHITECTURE.md and CLAUDE.md — archive as executed-plan history. |
| docs/superpowers/specs/2026-09-18-website-programme-design.md | Verbatim v3 approved 28-decision (D1-D28) programme plan: context, target architecture, integration catalogue, work packages, risks, owner inputs, execution rules, premortem | pending-feature | move-to-pending | Self-labeled 'Do not edit this copy independently of the source plan' (docs/superpowers/specs/2026-09-18-website-programme-design.md:64), the single most-referenced doc in the repo (13 referrers) since every other doc cites its D<n> decisions as source of truth, and it plans work not yet built: Phase B CMS, WP2-WP7b (docs/superpowers/plans/2026-09-18-wp1-foundation.md context / docs/WEBSITE-HANDOFF.md:307-317 shows WP2a/WP2b/Phase B all not-started or half-done). Recommend NOT physically moving it (it is load-bearing for D<n> citations across 13 files) but flagging it structurally as the pending/spec document; a literal move would break every D<n> cross-reference. |

**Duplicates / overlaps:**
- docs/superpowers/specs/2026-09-18-website-programme-design.md vs docs/PRD.md: the spec is the verbatim full-rationale programme plan (D1-D28, all work packages); docs/PRD.md is the authoritative distilled product surface per CLAUDE.md:5,12 ('Decisions are cited here as D<n>; do not re-derive them from first principles — read the plan'). PRD.md is authoritative for product/business questions; the spec is authoritative for full rationale/history — not a true duplicate but a summary/source pair worth noting.
- docs/superpowers/plans/2026-09-18-wp1-foundation.md vs docs/ARCHITECTURE.md: the plan's 'Tech Stack'/'Architecture' preamble (lines 39-41) duplicates content now maintained live in docs/ARCHITECTURE.md; docs/ARCHITECTURE.md is authoritative (it reflects the as-shipped code with commit SHAs), the plan is the frozen historical brief.

**Notes:** Docs tree has only 14 files total (13 under docs/, plus README.md); no image/asset subfolders exist under docs/ on main (only docs/superpowers/plans/ and docs/superpowers/specs/, both text). On branch wp2/foundation, docs/ gains 2 new plan files (docs/superpowers/plans/2026-09-20-wp2-rulings.md, 2026-09-20-wp2a-foundation.md) plus an entire docs/superpowers/handoff-2026-09-25/ tree (~150 files: wp1-sdd-archive/ task briefs+reports+diffs, wp2-planning/ page specs, wp2a-sdd/ and wp3a-sdd/ task briefs+reports+diffs) — this whole handoff-2026-09-25/ tree is supporting material for docs/WEBSITE-HANDOFF.md per the workspace CLAUDE.md and was treated as one entry for this inventory rather than 150 individual rows, consistent with the 'treat asset folders as ONE entry' instruction extended to this bulk supporting-material directory. docs/ARCHITECTURE.md already exists on main, confirmed (task's stated fact verified). No docs/archive/ folder currently exists on main; the two history-classified plan docs have no current archive location to move into.

## 3. PRD / code mismatches

### Chunk 0

- **[MEDIUM] stale-or-wrong** — PRD lines 119
  - Claim: PRD §11 'Not yet built, by design (WP2 and later)' lists 'the `BreadcrumbList`/`FAQPage`/`Article`/`JobPosting` JSON-LD builders' as not yet built.
  - Code evidence: src/lib/seo/jsonld.ts:55 exports `breadcrumbJsonLd` and src/lib/seo/jsonld.ts:67 exports `faqJsonLd`, both fully implemented and unit-tested (src/lib/seo/jsonld.test.ts), introduced in commit bb2bc94 'feat(seo): metadata/alternates builders, sitemap, robots, Organization/WebSite/Breadcrumb/FAQ JSON-LD'. Only `articleJsonLd`/`jobPostingJsonLd` are genuinely absent (grep for both across src/ returns no builder function). Neither breadcrumbJsonLd nor faqJsonLd is referenced/imported from any page file (`grep -rn "breadcrumbJsonLd|faqJsonLd" src -l` outside jsonld.ts/jsonld.test.ts returns nothing), so they exist but are not yet wired into a page.
  - Proposed change: Split the bullet: state that Breadcrumb/FAQPage JSON-LD builder functions already ship in WP1 (src/lib/seo/jsonld.ts) but are not yet wired into any page, while Article/JobPosting builders genuinely remain unbuilt for WP2+.

### Counts by type

| Type | Count |
|---|---|
| stale-or-wrong | 1 |

### Counts by severity

| Severity | Count |
|---|---|
| medium | 1 |

## 4. PRD technical-content line ranges

### From docs.prd_technical_sections

| Section | Lines | Size (KB) | Why technical |
|---|---|---|---|
| 3. i18n rules | 48-57 | 1.5 | Locale routing mechanics (tr root, /en prefix, pathnames table, routing.ts references) — implementation detail, not a business requirement statement. |
| 6. Performance budget | 74-77 | 0.6 | JS/CSS budgets, Lighthouse thresholds, gate tooling — infra/build-tooling specification. |
| 7. Analytics / consent | 78-81 | 0.7 | Consent Mode v2 / GTM implementation pointer, delegates to docs/ANALYTICS.md's architecture detail. |

_No chunk findings of type 'technical-content' found._


## 5. Module coverage gaps

**Modules:**
| Module | Coverage | Gap |
|---|---|---|
| app/api/revalidate | partially | PRD names the route path but points to docs/ARCHITECTURE.md for WP5 follow-up detail rather than documenting auth/behavior in PRD itself; no dedicated PRD subsection for this module. |
| app/api/site-health | partially | Same as revalidate: named but detail deferred to docs/ARCHITECTURE.md, no dedicated PRD section. |
| app/[locale] route group (public pages) | documented | None found at section-name level; dev/gallery page is a dev-only tool not expected in PRD. |
| proxy.ts (locale/i18n middleware) | documented | None found. |
| app/sitemap.ts, app/robots.ts | documented | None found. |
| src/lib/contact.ts | undocumented | No PRD section names this helper module explicitly (may be covered implicitly under section 2 pages/forms, not confirmed by name match). |
| src/analytics/forms.ts (FORM_KEYS) | partially | grep for literal string 'forms.ts' or 'FORM_KEYS' in PRD.md returned no match; section names exist but exact identifier not confirmed present in PRD body (task restricts reading PRD bodies beyond confirming match). |
| crons/queue processors | undocumented | No cron/queue infrastructure exists in this repo; not applicable (website is Next.js edge/static, no background job runner). |

**Crons/jobs not in PRD:**
- None found (no cron/queue infrastructure exists in this repo per coverage.json).

**PRD features without code:**
- None recorded in coverage.json (see section 6 for pending features from docs.json instead).

## 6. Pending large features

- **Website CMS (Operations 'Website' module, Phase B)** (large (6 work packages)) — doc: `docs/superpowers/specs/2026-09-18-website-programme-design.md` — Full CMS backend + admin UI in operations.jobsadmire.com that will drive pages/nav/settings/collections via the OPS content adapter, replacing the LOCAL JSON bundle. — evidence unbuilt: src/content/config.ts's contentSource() only returns 'OPS' when CONTENT_SOURCE=OPS, OPS_API_URL and OPS_WEBSITE_READ_TOKEN are all set, 'otherwise LOCAL, silently' (docs/ARCHITECTURE.md:68); grep for CONTENT_SOURCE/representatives/blog under src/ returned no matches, confirming no OPS-side or blog/representatives code exists yet; docs/WEBSITE-HANDOFF.md:317 lists Phase B (WP3c, WP4, WP5-gate, WP5, WP6, WP6.5, WP7b) as 'not started'.
- **Candidate pool per-profile cards / Representatives / Blog editor (v1.1)** (medium) — doc: `docs/INTEGRATIONS.md` — Per-profile candidate cards (I7/I8), Representatives directory (I9), and a real blog editor are deferred to v1.1, after aggregate-only launch. — evidence unbuilt: docs/INTEGRATIONS.md:150-152 tags I8/I9 as v1.1; grep -rl "representatives" src and find src -iname "*blog*" both returned no results, confirming zero implementation exists in the codebase today.
- **Newsletter confirm/unsubscribe routes** (small) — doc: `docs/PRD.md` — Two newsletter routes (/abone-onay, /abonelikten-cik and EN equivalents) with double-opt-in, referenced by SEO/robots/sitemap docs as not-yet-existing. — evidence unbuilt: docs/SEO.md:283 states these routes 'don't exist yet either, so there's nothing to crawl today'; find src -iname "*newsletter*" returned zero files.
- **Remaining 10 of 11 core pages (WP2b) + Gate A launch** (large) — doc: `docs/PRD.md` — Only Homepage(placeholder)/Hire-Workers/Thank-you are shipped; the other 8-9 designed pages plus forms end-to-end and the launch gate are still to be built. — evidence unbuilt: docs/ARCHITECTURE.md:47 lists only [locale]/page.tsx (placeholder), hire-workers, thank-you, dev/gallery as WP1-shipped, 'the other 11 pages land in WP2'; docs/WEBSITE-HANDOFF.md:314-316 shows WP2a tasks 4-9 not started and WP2b (15 tasks) not started.

## 7. CLAUDE.md audit

**Word count:** 1789

**Run/test command verification:**
- `npm run verify`: correct — package.json:15 "typecheck && lint && format && test"
- `npm run gate`: correct — package.json:17 "bash scripts/gate.sh"

**Checklist (verbatim, lines 61-67):**
```
1. `npm run verify` green (typecheck, lint, format, unit tests).
2. `npm run gate` run against a preview URL for that work package — not skipped because "it's just copy": Lighthouse/axe/Playwright are the only place responsive/a11y regressions get caught before a human does.
3. Docs updated in the **same change set** — this file's doc map, `docs/PRD.md`, `docs/ARCHITECTURE.md`, or whichever doc governs the area touched. A behavior change without a doc change is not done.
4. If the change touches an Operations contract (forms, bundle shape, tokens): `docs/INTEGRATIONS.md` updated and the Operations-side doc (`jobsadmire-operations/docs/PRD.md` §5.12/§7.10) checked for drift.
5. If the change touches redirects: `docs/redirects.md` and the Vitest no-chain test.
```

**Issues by kind:**
- _dead-ref_ (2):
  - Line 24: "design-package/README.md`, `docs/project-brief.md`, `docs/crm-feed.md`, `docs/translation-process.md" — docs/project-brief.md, docs/crm-feed.md and docs/translation-process.md do not exist. The actual files are design-package/docs/project-brief.md, design-package/docs/crm-feed.md, design-package/docs/translation-process.md (verified: find . -iname 'project-brief*' -o -iname 'crm-feed*' -o -iname 'translation-process*' → all three under design-package/docs/). Fix: Change the three paths to design-package/docs/project-brief.md, design-package/docs/crm-feed.md, design-package/docs/translation-process.md.
  - Line 28: "`proxy.ts` (the middleware" — No proxy.ts exists at repo root; the file is src/proxy.ts (verified: find . -iname 'proxy.ts' → ./src/proxy.ts). The doc map/architecture text elsewhere consistently gives full paths (src/content/config.ts etc.) but this one omits the src/ prefix, reading as a root-level file. Fix: Write `src/proxy.ts` on first mention for consistency with how other source paths are cited in this file.
- _duplicates-doc_ (6):
  - Line 57: "`npm run dev` appends an `nextjs-agent-rules` block to this file the first time it runs" — Restated near-verbatim, with more detail, in docs/DEPLOYMENT.md:72 ("`npm run dev` (`next dev`) appends an `nextjs-agent-rules` block to this repo's `CLAUDE.md`... Task 13's implementer hit and reverted this once already."). Fix: Keep one line here pointing to docs/DEPLOYMENT.md for the full story, or drop from CLAUDE.md and rely on DEPLOYMENT.md.
  - Line 53: "The Vercel build runs `npm run verify`" — Same fact stated in docs/DEPLOYMENT.md:69 ("The Vercel build runs `npm run verify` (`vercel.json`'s `buildCommand: \"npm run verify && next build\"`)") and README.md:16. Fix: Leave the hard rule here (it's a 'never' rule worth keeping visible) but note it is also documented in docs/DEPLOYMENT.md so a rewrite doesn't need to re-derive it.
  - Line 54: "`npm run gate`** (Playwright + axe + Lighthouse against a URL) runs **outside** the build" — Same fact in docs/DEPLOYMENT.md:70, docs/ARCHITECTURE.md:92, and README.md:34. Fix: Same as above — fine to keep as a hard rule, but the detail (why, budgets) lives in ARCHITECTURE/DEPLOYMENT and shouldn't be re-added here.
  - Line 49: "Never call Operations from the browser." — Restated at length in docs/INTEGRATIONS.md:112 ("every Website↔Operations token is server-held (never in a browser bundle except the Turnstile site key)..."). Fix: Keep the one-line hard rule here (appropriate for a rulebook); don't re-add the token-class detail, which belongs only in INTEGRATIONS.md.
  - Line 50: "Never serve pool, stories, or representatives fixtures in production." — The full mechanism (assertServableInProduction, lint rule, R56, NODE_ENV vs VERCEL_ENV nuance) is documented in docs/ARCHITECTURE.md:26-38 under 'Content adapter (D7, D23)'. Fix: Keep the terse rule here; the detail must stay only in ARCHITECTURE.md.
  - Line 52: "Never ship `html { zoom: .75 }`." — Same normalization rule explained in docs/ARCHITECTURE.md:79 ('The design package is authored at 1.333× and relies on html { zoom: 0.75 } above 1101px... This repo normalises instead of scaling'). Fix: Keep the terse hard rule; full rationale stays in ARCHITECTURE.md only.
- _repeats-root_ (1):
  - Line 3: "It talks to Operations only — never the CRM, never anything on the VPS directly, and never from the browser." — Restates the workspace-root CLAUDE.md's Cross-app hard boundaries section ('The website talks only to Operations (server-side, Bearer tokens, no browser→API calls, no CORS change)...'). Fix: Acceptable as one-sentence repo-identity context at the top of the file; not worth removing, but a rewrite should not expand it — the root file is authoritative.
- _point-in-time_ (1):
  - Line 69: "**Phase A (target: approval + 4 weeks):**" — Stale relative to docs/WEBSITE-HANDOFF.md (2026-09-25): WP1 is DONE and merged to main (ad58fb8), WP3a is DONE and LIVE in production since 2026-09-24 07:58 UTC, and the whole website programme is on an owner-directed hold since 2026-09-24 17:02 PKT. CLAUDE.md's Phase status section still reads like the pre-build plan estimate ('target: approval + 4/9 weeks') and doesn't mention WP1/WP3a are shipped or that work is paused. Fix: Either drop concrete phase-status detail from CLAUDE.md entirely (defer fully to docs/WEBSITE-HANDOFF.md, which this file already points to in the next section) or replace the two target-date bullets with a one-line 'current status: see docs/WEBSITE-HANDOFF.md' to avoid re-drifting every time state changes.

**Must-keep rules (only in this file):**
- The doc map table (lines 9-24) — no other doc indexes all of docs/*.md by purpose; needed for navigation.
- Task-completion checklist (lines 59-67) — the 5-item pre-done gate is defined only here; docs/OPERATING.md:58 references 'CLAUDE.md's task-completion checklist' by name rather than restating it, so this file is the sole source.
- The 'sys.* goes through next-intl only, never t()/makeT' accessor-boundary rule (line 38) as a terse convention statement — CONTENT-MODEL.md has the full key list but this file's one-paragraph framing of the two-accessor split is the quick-reference version engineers need before touching src/.
- Shared-chrome-canonical-id ruling summary with the home.011 worked example (line 39) — the specific worked example isn't duplicated verbatim elsewhere; CONTENT-MODEL.md has the full table but not this illustrative sentence.
- The content-route JS budget number restated as '180 KB gzipped, not 120 KB' with the Ruling R49 correction context (line 45) — useful as the one line that flags the plan's original number was wrong, framed for someone who only reads CLAUDE.md.
- '.superpowers/ vs docs/superpowers/' disambiguation (line 56) — this exact two-path distinction (git-ignored scratch vs tracked plans) does not appear in any docs/*.md file that was greppable; it exists only here.
- Resuming-after-pause pointer to docs/WEBSITE-HANDOFF.md (lines 75-78) — the routing instruction ('read this file first') is unique to CLAUDE.md as the entry point.

**Wrong commands found:** none — both `npm run verify` and `npm run gate` verified correct against package.json.

**Notes:**
- All 25 file/path references checked with `find`/`ls` resolve except the two dead-ref items above (lines 24 and 28).
- All 6 doc-anchor references (docs/ARCHITECTURE.md § Routing, § Quality gate, § Environments; docs/CONTENT-MODEL.md § Chrome canonical ids; docs/redirects.md D21; jobsadmire-operations/docs/PRD.md §5.12/§7.10) were grepped and exist.
- D24 citation at line 73 ('Do not run WP3b/CRM work in parallel with WP3c — D24') is accurate — matches docs/superpowers/specs/2026-09-18-website-programme-design.md:178 verbatim ('WP3c ... WP3b/CRM work never in parallel'), not a drift despite D24's own table row (line 64) discussing a different WP3b/WP3 ordering point.
- No outright contradictions between this file and any docs/*.md file were found beyond the point-in-time staleness noted above.

## 8. Counts and missing input files

- Chunk files found: 1 (`jobsadmire-website__chunk-0.json` only)
- Raw findings across chunks: 1
- Deduped findings: 1
- Findings by type: {"stale-or-wrong": 1}
- Findings by severity: {"medium": 1}
- Missing input files: none (stack.json, docs.json, coverage.json, claude-md.json all present).
- CLAUDE.md issues found: 10
- Docs inventoried: 14; pending features: 4
- Coverage modules assessed: 8
