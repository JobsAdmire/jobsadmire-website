# Task 15 report — Documentation sync + WP1 exit

## Method

Read the full execution ledger (`progress.md`, 193 lines, all 52 ruling entries) and the task brief first. Then, for every doc in scope, read the doc, grepped/read the corresponding code (routing.ts, proxy.ts, next.config.ts, the content adapter split, the contract schema and its test, the chrome components, the analytics modules, site-health/revalidate routes, eslint config, vitest config, package.json scripts, .env.example, lighthouserc*.json, gate.sh, redirects/rules.json + build-redirects.ts + generated legacy.json/gone.json), and rewrote every stale or missing claim to match the code as built. Where the ledger and the code disagreed (see below), the code won.

## Per-doc changes

**`docs/ARCHITECTURE.md`** — Recorded the stack spike as PASSED (Next 16.3.5 + next-intl 4.14.5, the `ƒ Proxy (Middleware)` build label explained, `getPathname` confirmed sync). Corrected the Routing section: 301 redirects run in `next.config.ts`'s own `redirects()` (resolved *before* middleware), not inside `proxy.ts` as the doc previously claimed — only 410s and next-intl locale resolution run in the middleware. Added `alternateLinks: false` and its rationale (a real Lighthouse SEO defect the gate caught), and the `ja_locale` cookie's actual semantics ("no cookie = no explicit choice," not "chose Turkish"). Rewrote the Content adapter section to describe the real `config.ts`/`pure.ts`/`adapter.ts` split (Ruling R2), the ESLint `no-restricted-imports` D23 guard, the `NODE_ENV=production`-on-previews fixture-guard implication, and the silent `OPS→LOCAL` fallback surfaced by site-health. Added a new "The frozen contract" section with the actual pinned SHA. Added a new "Chrome" subsection covering `SiteChrome`'s real DOM order, the `ClientIslands` JS-budget boundary (which the ledger's R29 predates — code has moved past that ruling, noted explicitly), the footer's double-render, the real 1101px/901px breakpoint story, and that `StickyCtaBar` is exported but never mounted. Added the WP5 revalidate-staleness blocker and the OPS-mode data-cache caveat to Operations surface. Marked Forms flow and Sentry as **not yet built** (no server action exists; no `@sentry/*` dependency exists anywhere in the repo) rather than describing them as shipped.

**`docs/CONTENT-MODEL.md`** — Added a "Bundle shape (v1.0)" table describing every field of the actual `BundleSchema`, including that `pages`, `collections` and `redirects` are empty in the WP1-generated bundles and that `nav` only ever populates the `desktopNav` group. Added the actual `sys.*` key list by group (chrome, language hint, consent, error/404, thank-you) read straight from `src/messages/tr.json`/`en.json`. Added the chrome canonical-id table (Ruling R15) confirming `home.011` is the verify-nav label and no `sys.nav.verify` was ever created. Added a "Catalogue lints and the ratchet baseline" section (17 parity / 26 leading-lira, `lint-exceptions.json` = `{}`, generated files Prettier-ignored, WP6 prunes the baseline). Fixed the contract section's stale `website-bundle.v1.schema.json` filename to the real `website-bundle.v1.ts`. Corrected "Import and round-trip" to state the WP1 importer reads the per-page JSON files directly, not the CSV (the CSV is the WP6/Phase B round-trip format).

**`docs/redirects.md`** — Added a "Two numbers, not one" section reconciling the 517-URL legacy inventory (47 route patterns × up to 11 old locales) against the 50-row `rules.json` (24×301/20×410/6×keep) and the generator's actual output (328 redirects, 20 gone prefixes). Kept the GSC disposition table and expected-loss forecast as placeholders per the brief.

**`docs/ANALYTICS.md`** — Added that WP1 wires exactly one of the seven allowed events (`conversion`, from `ConversionPing`); the other six are allowlisted in `track.ts` but no component calls `track()` for them yet (verified via a repo-wide grep — chrome's phone/WhatsApp/email links are plain anchors with no click handler). Noted the bundle's `analytics` settings ship all-`null` in WP1.

**`docs/SEO.md`** — Added `alternateLinks: false` and its rationale. Corrected Sitemap: it's generated from the static `pathnames` table (not yet the tagged bundle), lists 32 URLs across 16 routes × 2 locales, and only 4 of those 32 are real pages today — the other 28 404; flagged that this must be gated before WP7a submits to GSC. Corrected Robots to describe the actual `VERCEL_ENV`-driven preview/production split and flagged that newsletter confirm/unsubscribe paths aren't yet in the disallow list (a real, if currently inconsequential, gap — those routes don't exist yet either). Marked JSON-LD's `Article`/`JobPosting`/breadcrumb/FAQ builders as not-yet-called (only Organization/WebSite render). Marked OG images as not built — the fallback path points at a file that doesn't exist.

**`docs/DEPLOYMENT.md`** — Added `CONTENT_SOURCE` to the env var table (was missing), annotated `OPS_WEBSITE_WRITE_TOKEN` and Sentry as not-yet-consumed/not-yet-integrated, added the `.env.example` cross-reference, added the `VERCEL_ENV`-driven preview-noindex mechanism, and added the `next dev`-appends-a-CLAUDE.md-block gotcha to Deploy discipline.

**`docs/OPERATING.md`** — Added the WP5 `lastRevalidate` blocker (module-level, best-effort store; false `503`s on cold serverless instances) and the OPS-mode Data Cache caveat directly under the site-health checks table. Marked Synthetic lead and Daily digest as not yet built (no cron config exists in `vercel.json`).

**`docs/PRD.md`** — Marked the forms section as WP2/WP3a-not-yet-built, noting what the thank-you page does ship. Added a new "§11 WP1 delivered" status list (what shipped, what didn't, by design). Verified the routes/slugs table against `src/i18n/routing.ts`'s `pathnames` field-by-field — it was already exact, no changes needed. Verified the 180 KB budget correction (already accurate from Task 14).

**`README.md`** — Added `content:import`/`redirects:build` to the documented scripts (were missing entirely). Rewrote the gate section: `REVALIDATE_SECRET` usage, the preview-vs-local-build-on-port-3100 pattern (matching the plan's own convention and how Task 14 actually ran it), and the localhost-LCP-is-advisory rule. Corrected the Stack line — Sentry and Vercel Web Analytics/Speed Insights are target-stack, not yet wired (no matching dependency in `package.json`).

**`CLAUDE.md`** — Added a doc-map row for the new rulings file. Fixed the routing bullet (redirect pipeline order, `(site)` route group removed since it doesn't exist). Added convention bullets: `sys.*` goes through next-intl only, never `t()`/`makeT`; the chrome-canonical-id rule (R15) with the `home.011`/no-`sys.nav.verify` fact; the 1101px WP1-only hamburger threshold (R46) folded into the existing accessibility bullet; the 180 KB budget pointer. Added two hard rules: `.superpowers/` is git-ignored scratch (distinct from tracked `docs/superpowers/`), and the `next dev` CLAUDE.md-block gotcha.

**`docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md`** (new file, Ruling R52) — A table of every ruling in the ledger: **51 rows** (R1–R52, minus R14 which was never used — the ledger's numbering genuinely skips it, noted explicitly rather than silently omitted). Columns: id, decision, why, where it landed (task · commit · file). Superseded rulings (R1→R11, R4→R33) and rulings the later code moved past (R29's DOM order vs. Task 14's `ClientIslands` refactor) are called out in the "Landed" column rather than presented as still-current.

## Code/doc mismatches found (not fixed — out of code-change scope, or out of this task's explicit doc list)

1. **Sentry is documented across multiple places as if integrated, and is not.** No `@sentry/*` dependency, no config file, anywhere in the repo. Fixed in `ARCHITECTURE.md`, `README.md`, `DEPLOYMENT.md`, `OPERATING.md`, `PRD.md`'s "not yet built" list. **Left unfixed** in `docs/INTEGRATIONS.md` (lines 26/32/98/100) and `docs/PRIVACY.md` (line 25), which describe Sentry as live — both are outside the brief's explicit "what to update" list for this task.
2. **`docs/INTEGRATIONS.md:32`** also cites the stale `contract/website-bundle.v1.schema.json` filename (the real file is `website-bundle.v1.ts`) — same reasoning, left untouched as out of scope.
3. **`robots.ts`'s production disallow list omits the four newsletter confirm/unsubscribe paths** that `sitemap.ts`'s `EXCLUDED` set and `docs/PRD.md`/`docs/SEO.md` all say are noindexed. Currently inconsequential (those routes don't exist yet), but worth a one-line fix in the same WP2 change that ships them. Documented as a known gap in `docs/SEO.md` rather than silently matched to the aspirational claim.
4. **`docs/ARCHITECTURE.md`'s Forms-flow "Failure" bullet still mentions "a Sentry error report"** as part of the target design (correctly future-tense, since the section now opens with a "Not yet built" disclaimer) — left as-is since it's describing the WP2/WP3a design, not a present-tense claim.

## WP1 exit checklist (from the brief)

| Item | Status |
| --- | --- |
| `npm run verify` green | **Green.** typecheck ✓, lint ✓, format ✓ (Prettier, including all Markdown), 112/112 tests across 25 files. |
| `npm run gate` green against a Vercel preview URL, or against `next start` until then | **Local run green** (Task 14, commit `ccb5499`): Playwright 172/172, Lighthouse a11y/BP/SEO 1.0 on all four paths, perf 0.96, CLS 0, script 172,509/184,320 B, LCP a warning on localhost per R50 (by design, not a failure). **Preview run pending the owner's Vercel project** (`jobsadmire-web-v2` not yet linked) — this task did not run the gate (out of scope per the brief). |
| `contract/` frozen: `CONTRACT_FILE_SHA256` pinned, fixture committed, `CONTRACT.md` explains the bump procedure | **Done.** SHA `b407d92f39ab560e4c256ec2e7d1cd5d36f6166281b9d1dfdd178ede01319dcf` pinned in `contract/contract.test.ts`; `contract/website-bundle.v1.fixture.json` committed; `contract/CONTRACT.md` states the 5-step bump procedure and the Prettier-format/byte-identical requirement. |
| Stack spike recorded as passed (or the fallback executed) in `docs/ARCHITECTURE.md` | **Done** (this task) — explicit "PASSED, no fallback" statement with commit references now opens the Routing section. |
| `redirects/gsc-clicks.csv` still header-only → open item for WP0 baseline; rerun `npm run redirects:build` when it lands | **Confirmed header-only** (`url,clicks`, zero data rows). Documented as an open WP0 item in `docs/redirects.md`'s existing placeholder sections (kept as-is per the brief). |

## `npm run verify` output summary

```
typecheck: tsc --noEmit — clean
lint: eslint . — clean
format: prettier --check . — All matched files use Prettier code style!
test: vitest run — Test Files 25 passed (25), Tests 112 passed (112)
```

## Commit

One commit, message exactly as specified in the brief:
`docs: WP1 foundation — architecture, content model, redirects, analytics as built`

10 existing docs modified (`CLAUDE.md`, `README.md`, `docs/ANALYTICS.md`, `docs/ARCHITECTURE.md`, `docs/CONTENT-MODEL.md`, `docs/DEPLOYMENT.md`, `docs/OPERATING.md`, `docs/PRD.md`, `docs/SEO.md`, `docs/redirects.md`) + 1 new file (`docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md`). 226 insertions / 64 deletions across the modified files, plus the new ~110-line rulings file. Not pushed, per the brief.
