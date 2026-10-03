### Task 15: Gate A prep — `gate:launch` green on every route in both locales, sweeps, measurements, readiness record

**What this task is.** No page is built here. T15 is the last WP2b task (W99): it proves, with committed evidence, that the fourteen pages T1–T13 ported and the forms T14 exercised can face Gate A ("can Phase A be public this week?", spec §5, quoted in full below). Unlike the 2026-09-20/24 draft this file replaces, most of the *mechanism* Gate A needs is **already built** — verified directly against the real code on `wp2/foundation`, not assumed:

- **Preview reachability (the draft's Cycle 1) is DONE.** WP2a Task 7 built `e2e/helpers/bypass.ts` (`protectionBypassHeaders`, `bypassWarning`), `e2e/helpers/face.ts` (`siteFace`, `expectedRobots`, `lighthouseConfigFor`), `lighthouserc.preview.json` (skips `is-crawlable` **and** `robots-txt`, W140), a face-aware `e2e/seo.spec.ts` robots test, and `src/app/robots.test.ts` (computes its expectation from the real `robotsDisallowPaths`/`UNBUILT_PATHNAMES`, never a hand-typed list). `scripts/gate.sh` already selects the config and passes the header as `--settings.extraHeaders=<JSON>` (W137 amended — **never** `--extra-headers`, which is what the original draft said and which `.superpowers/sdd/2026-09-20-wp2a-foundation/wp2a-final-review.md` §6 names as a drift to fix). Ruling **W91** covers all of this; **W100** records the move out of T15. T15 **consumes** this, it does not rebuild it.
- **StickyCtaBar contact tracking (the draft's Cycle 5) is DONE.** `src/design/chrome/StickyCtaBar.tsx` already renders every `cta` through `ContactCta` (`placement="page_cta"`) and its wrapper already carries `data-testid="sticky-cta"` — read directly from the file, not from a stale doc. Ruling **W81** covers this; **W100** records the move into WP2a Task 5. T15 does **not** re-edit any page.
- **The dead-target + CTA-anchor sweep (W152/W158) is DONE** — `scripts/launch/dead-targets.launch-check.ts` (+ its pure half `dead-targets.ts`, unit-tested by `dead-targets.test.ts`) already fetches every `GATE_ROUTES` page, requires every internal `href` to answer 200, and requires every `CTA_BY_PATHNAME`/`DEFAULT_CTAS` anchor id to exist on the page its own link resolves to, in both locales. **T15 does not duplicate this.**
- **`UNBUILT_PATHNAMES` emptiness (W20) is DONE** — `scripts/launch/unbuilt-routes.launch-check.ts` already asserts it. **T15 does not duplicate this.**
- **The one real gap `gate:launch` still has:** nothing proves `GATE_ROUTE_TABLE` (`e2e/routes.ts`) itself lists every static route in both locales with the right `indexable` flag — dead-targets only checks that whatever **is** listed has no dead links; unbuilt-routes only checks every route **has a page**. T15 Cycle 1 closes this (a new file, not a rewrite of either existing one).
- **The Googlebot legacy-URL sweep (D21, spec §5's "20 legacy URLs → 308/410, no 429") has no owner anywhere in the built foundation.** T15 Cycle 2 builds it (new).
- **The synthetic lead (Gate A row 8) is T15's to build — ruling W172.** Nothing in the built foundation sends it and no other work package owns it. T15 Cycle 3 adds `src/app/api/cron/synthetic-lead/route.ts` (a `CRON_SECRET` bearer guard, 401 otherwise; ONE test-class `hire` submission built from T14's `smokeFields` and posted through the existing server-side door client `postForm`; 200 `{ data: { status, isTest } }`) and a `vercel.json` `crons` entry (daily on Hobby, every 30 minutes once Pro is on) that leaves `git.deploymentEnabled` untouched. The cycle sits BEFORE the proof build, so the single W126 build covers it. Vercel runs crons only for the production deployment, so the controller proves the route once by hand on `staging` (Cycle 5 Step 6), and Gate A row 8 reads "built, proven once on staging, scheduled from the cutover". The daily digest (I19) is out of WP2: it is Phase B, and its `docs/pending/` line comes with the controller's W173 docs commit, never from T15.
- **The project is `jobsadmirewebsite`, never `jobsadmire-web-v2`** (ruling **W105**, and independently confirmed: every real WP2a preview deployment ran under hostnames `jobsadmirewebsite-fcif8p971` / `-ob96kp4oc` / `-3vdtznlg3` — `docs/superpowers/handoff-2026-09-25/wp2a-sdd/progress.md` lines 77/98/109 — and `docs/WEBSITE-HANDOFF.md` §3.2's own heading already reads "Vercel — project `jobsadmirewebsite`"). No second project was ever created — the Vercel MCP reuses the linked one (`WEBSITE-HANDOFF.md` §3.2). Cutover (WP7a, **not this task**) removes two guards on that one project (`vercel.json`'s `git.deploymentEnabled.main:false` + the Ignored Build Step), it does not move a domain between two projects. The stale two-project text in `docs/DEPLOYMENT.md` (§ Two Vercel projects, § Phase A cutover, § Deployment Protection), `CLAUDE.md` (doc-map row, § Environments and deploy) and `docs/ARCHITECTURE.md` § Environments is corrected by the controller's own docs-only commit on `wp2/foundation` (**the W173 docs commit**, landed before T15 executes). T15 cites that commit wherever it refers to those files and rewrites none of their text.
- **`generate_lead` fires from `ConversionPing`** on the thank-you page (T14 Cycle 1), never "the forms kernel on every successful door submission" as the 2026-09-20 draft's ANALYTICS paragraph said (ruling **W105**; `docs/ANALYTICS.md`'s current text already says `generate_lead` is "declared but still uncalled" as WP2a left it — T14 closes that, T15 only audits the result).
- **Retry/site-health wording is W74/W75, not W3's original text:** one 9 s per-attempt deadline, ONE retry only after a connection-level failure, a timeout or 5xx returns `unavailable` at once (W74/W117); `opsPingCheck` maps `off | unauthorized | unreachable → fail`, only `unconfigured → skip` (W75, confirmed directly in `src/app/api/site-health/ops.ts`) — so a dark door is **not** an acceptable "record which state" at Gate A, it is a site-health failure to escalate.
- **`lighthouserc.local.json` is now identical to `lighthouserc.json`** (W145 retires R50's localhost LCP waiver — confirmed directly in the file's own `_comment`). Any reference to "R50 advisory" is stale.
- **Doc-sync scope is narrower than the draft's.** Two sets of docs move here. The readiness record: `docs/WEBSITE-HANDOFF.md` §1/§3.2/§5, `docs/OPERATING.md` where an owner check changed, and the WP2b ledger (Cycle 7). The synthetic-lead route's own docs (Cycle 3, W172): `docs/DEPLOYMENT.md` § Environment variables gains the `CRON_SECRET` row, `docs/OPERATING.md` § Synthetic lead describes the route, `docs/ARCHITECTURE.md` § Operations surface replaces its "Not yet built" cron bullet, and `.env.example` gains `CRON_SECRET`. Nothing else: the two-project cutover text in `docs/DEPLOYMENT.md`, `CLAUDE.md` and `docs/ARCHITECTURE.md` § Environments is the W173 docs commit's, and `docs/pending/` (the digest's Phase B line) is the controller's. `docs/PRD.md`, `docs/SEO.md`, `docs/CONTENT-MODEL.md`, `docs/ANALYTICS.md`, `docs/redirects.md`, `CLAUDE.md` and every other section of `docs/ARCHITECTURE.md` are **not** touched by this task: PRD's own `## 12` is already taken (Task 9's "Calculator rules" — a new Gate A section would collide there anyway), ARCHITECTURE's § Quality gate items 5/6 already document the bypass header, the preview Lighthouse face and the launch profile in full (verified directly), and the per-page tables in SEO/ANALYTICS/CONTENT-MODEL are each page task's own W98 obligation, not T15's to redo. Gate A's durable record lives in `docs/WEBSITE-HANDOFF.md`, which is already this programme's living status document.

**Preconditions.** T1–T14 merged on `wp2/foundation` (their own `GATE_ROUTE_TABLE` rows, `data-lcp-slot`/`data-placeholder` markup and `docs/SEO.md` Pages rows already landed — W99 execution order puts T15 last); a green Vercel preview of the branch head; `VERCEL_AUTOMATION_BYPASS_SECRET` from `ACCESS.md` (owner's shell only, never printed, never committed). One heavy job at a time (Mac Studio memory rule): one `next build`, one Playwright run, one Lighthouse loop.

**Gate A checklist (verbatim, spec §5 — grep `Gate A` in `docs/superpowers/specs/2026-09-18-website-programme-design.md:171`):** *"Can Phase A be public this week?" Checklist: Minimum Launchable Content present or auto-defaulted; expected-loss forecast signed; `gate --profile=launch` green on every page; forms create inquiries end to end on `staging.jobsadmire.com` with real Turnstile (inquiry with contactName → assignment → notification → autoresponder); all 13–15 forms produce exactly one `generate_lead` and one submission; Googlebot curl sweep of 20 legacy URLs returns single-hop 308/410 with no 429; site-health checks each broken deliberately → phone rings; synthetic lead and digest running; second human receiving. Two consecutive "no" answers trip §12.* D26's exact Minimum Launchable Content definition (spec §2, row D26) and the §10 owner-input table (11 rows) are the reconciliation keys for row 1 — quoted where used below, never re-derived.

**Rulings applied:** (verified against the real, built code, not assumed): **W20/W152/W158** (already built — consumed, not duplicated), **W21** (the one still-open gap — Cycle 1 closes it), **W91/W135/W137/W140** (preview reachability — already built), **W81** (StickyCtaBar — already built), **W93/W112** (careers-detail rows derived at gate time by `scripts/gate-routes.mjs` — already built; a static table row for `/careers/[slug]` would go stale the day an opening closes and must never be hand-maintained; on a door-less preview the skip is accepted only together with T11's mock-door `npm run e2e:careers` evidence), **W126** (ONE capped local build — Cycle 4; the binding run uses Vercel's build), **W138/W159** (pixel harness: like-for-like clips, a no-body locale is a clean skip), **W94** (`js-size --routes` for noindex-route spot checks — already built), **W98** (one shared ledger row format, T1's), **W99** (T15 runs last), **W105** (`jobsadmirewebsite`, never `jobsadmire-web-v2`; `generate_lead` from `ConversionPing`; W74/W75 wording), **W136** (the ledger's binding JS figure is the Vercel-preview `js-size` reading, a local run is diagnostic only), **W139** (refusal e2e cases accept 401|503 — already built), **W145** (LCP/performance under DevTools throttling, median of 3, in *every* config including local — R50's waiver is retired), **W162** (the lazy line: the LOCAL Cycle 4 run stops and reports at 191,724 B, the binding Cycle 5 run decides at 194,560 B), **W163** (a crossing on a CTA-target form page is ruled per case by the controller, never a page-local trigger on the form), **W172** (T15 builds the synthetic-lead route and its `vercel.json` cron — Cycle 3, before the proof build; the controller's one staging proof — Cycle 5 Step 6; the digest is Phase B), **W173** (the two-project deploy text is corrected by the controller's W173 docs commit — T15 cites it and rewrites none of it), **W174** (`v4-hero` and `hw-hero` BLOCK Gate A; "source the licensed hero stock pack" is on the owner's WP-C list, decide-by the content freeze), **W175** (GA4 `token` query-parameter redaction joins the Gate A owner checklist), **W176** (the founder slot is `founder-photo` everywhere, the D26 inventory included), **W178** (accepted deltas and bookkeeping: the thank-you page's `max-w-[720px]` delta and T10's v1.1 register backlog join the open items; this file's task-scoped labels are cited by their assigned numbers and nothing is appended to the ruling log), **D13/D21/D26/D27** (quoted where used).

**Files:**

Create
- `scripts/launch/route-coverage.launch-check.ts` — launch-profile-only: every static `pathnames` key is in `GATE_ROUTE_TABLE` in both locales with the right `indexable` flag; dynamic keys excluded (careers detail is never a static row — W93; blog gets a soft, one-locale-minimum check — W4) (Cycle 1)
- `scripts/launch/legacy-urls.txt` — the 20 legacy URLs + 2 keep controls with their expected disposition (Cycle 2)
- `scripts/launch/legacy-sweep.sh` — the Googlebot curl sweep, `npm run sweep:legacy` (Cycle 2)
- `scripts/launch/legacy-sweep.test.ts` — pins the 22 expectations to `redirects/legacy.json` + `redirects/gone.json` + `pathnames`, so the list can only disagree with the deployment, never drift from the data (Cycle 2)
- `src/app/api/cron/synthetic-lead/run.ts` — the synthetic lead itself: the `CRON_SECRET` guard, the test-class door env, the `smokeFields('hire', …)` envelope, the `postForm` call and the status mapping (Cycle 3, W172)
- `src/app/api/cron/synthetic-lead/route.ts` — `GET`, the Vercel Cron target; `force-dynamic`, `Cache-Control: no-store` (Cycle 3, W172)
- `src/app/api/cron/synthetic-lead/run.test.ts` — the guard, the body, the token class, the status mapping and the `vercel.json` schedule pin (Cycle 3, W172)

Modify
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: append `{ path: '/en/thank-you?form=hire', indexable: false }` as the literal's last entry — the EN twin of the WP2a `/tesekkurler?form=hire` row, the one static route no page task owns (Cycle 1)
- `package.json` `scripts` (after T14 the key order ends `…, "assets:map": …, "door:smoke": …`; insert right after the `"pixel": "tsx scripts/pixel-compare.ts",` line) — add `"sweep:legacy": "bash scripts/launch/legacy-sweep.sh"` (Cycle 2)
- `vercel.json` — add a top-level `crons` array with one entry `{ "path": "/api/cron/synthetic-lead", "schedule": "0 6 * * *" }`; the `git.deploymentEnabled` block (`"main": false`) stays untouched (Cycle 3, W172)
- `src/forms/post.ts` — the `PostFormDeps` doc comment only (today "Test seams only — production callers pass nothing."): the cron becomes the one production caller that passes `env` (Cycle 3)
- `.env.example` — a `CRON_SECRET=` line with its comment, right after the `OPS_WEBSITE_TEST_TOKEN=` line (Cycle 3, W172)
- `docs/DEPLOYMENT.md` § Environment variables — a `CRON_SECRET` row right after the `OPS_WEBSITE_TEST_TOKEN` row (Cycle 3, W172)
- `docs/OPERATING.md` § Synthetic lead — the section body rewritten around the built route, T14's `npm run door:smoke` sentences kept (Cycle 3, W172)
- `docs/ARCHITECTURE.md` § Operations surface — the bullet beginning "**Not yet built** (no cron config in `vercel.json`)" (Cycle 3, W172)
- `docs/WEBSITE-HANDOFF.md` — §1 programme table (the row whose first cell is `WP2b`, the row whose first cell is `Gate A / WP7a`); §3.2 (append one bullet after the existing bullet beginning "**Binding preview gate (2026-09-29, deployment `02ace58`…"); §5 step 7 (the item beginning "**Gate A → WP7a:**") (Cycle 7)
- `docs/OPERATING.md` — § External monitor and second human (the "(pending §10 item 10 — name + phone/email required before Gate A, no default)" parenthetical); § Weekly five-minute owner check (append the `sweep:legacy` line); new § Site-health drill inserted before § Weekly five-minute owner check (Cycle 7)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (append the T15 row to the `## Ledger` table T1 creates per W98; T15 runs last per W99, so that table and every earlier task's row already exist by the time this cycle runs) (Cycle 7)

Test
- `scripts/launch/route-coverage.launch-check.ts` (launch profile only, via `vitest.launch.config.mts`)
- `scripts/launch/legacy-sweep.test.ts` (the default Vitest suite — matches `vitest.config.mts`'s `scripts/**/*.test.ts` include)
- `src/app/api/cron/synthetic-lead/run.test.ts` (the default Vitest suite — `src/**/*.test.{ts,tsx}`)
- Runs: `npm run gate:launch` (local, capped build — W126), `npm run gate:launch` (preview, binding), `npm run sweep:legacy` (preview), `npm run js-size` (reads the preview's `.lighthouseci`), `npm run pixel -- --page=<p> --locale=<l> --base=<preview>` × 8 (7 scored, `blog-article`/`tr` skipped — W4/W138), one manual `curl` of `/api/cron/synthetic-lead` on `staging` (controller, Cycle 5 Step 6 — W172)

Read only, never appended: `docs/superpowers/plans/2026-09-20-wp2-rulings.md` — Cycle 7's guard confirms W172, W173, W174 and W178 are there and cites them (W178).

**Interfaces:**

Consumes (exact names, verified directly against the real files on `wp2/foundation`)
- `e2e/helpers/bypass.ts`: `BYPASS_HEADER`, `protectionBypassHeaders(env?: NodeJS.ProcessEnv): Record<string,string>`, `bypassWarning(baseUrl: string, env?): string | null`.
- `e2e/helpers/face.ts`: `siteFace(baseUrl, env?): 'preview'|'production'`, `expectedRobots(baseUrl, env?)`, `lighthouseConfigFor(baseUrl, env?): 'lighthouserc.preview.json'|'lighthouserc.local.json'|'lighthouserc.json'`.
- `e2e/routes.ts`: `GateRoute = { path: string; indexable: boolean }`, `GATE_ROUTE_TABLE: readonly GateRoute[]`, `GATE_ROUTES`, `INDEXABLE_GATE_ROUTES`.
- `scripts/gate-routes.mjs`: `careersDetailPageBuilt(appLocaleDir?)`, `careersDetailRoutes(env?, f?, built?)`; CLI `node scripts/gate-routes.mjs [--all] [--json]` (default = `INDEXABLE_GATE_ROUTES` + live careers-detail rows when the door answers).
- `scripts/gate.sh`: `bash scripts/gate.sh [--profile=launch|default]`; reads `E2E_BASE_URL`, `REVALIDATE_SECRET`, `VERCEL_AUTOMATION_BYPASS_SECRET`; `--profile=launch` runs (in order, to completion, before Playwright) `unbuilt-routes.launch-check.ts`, `dead-targets.launch-check.ts`, `scripts/placeholder-count.ts`, then the normal `gate` run, then prints `node scripts/js-size.mjs` at the tail.
- `scripts/js-size.mjs`: `SCRIPT_CEILING = 204_800`, `LAZY_LINE = 194_560`, `summarizeLhrs`, `formatJsSizeTable`, `formatMethodLine`, `parseJsSizeArgs`, `collectArgs`; CLI `node scripts/js-size.mjs [--dir=<d>] [--routes=<a>,<b>]` (`--routes`, W94, is never asserted).
- `scripts/placeholder-count.ts`: `scanPlaceholders`, `evaluateScan`, `formatReadinessTable`, types `PlaceholderScan`/`RouteVerdict`; writes `lighthouse-report/content-readiness.json`; table columns are `| route | status | placeholders | slots | LCP slot | verdict |`.
- `scripts/pixel-compare.ts`: `PIXEL_WIDTHS = [390,900,1440]`, `PIXEL_PAGES` (`home|hire|calc|blog-article`), `resolvePixelRoute`; CLI `npm run pixel -- --page=<key> [--locale=tr|en] [--base=<url>] [--widths=…]`; writes `.pixel/report.json`; already reads `bypassWarning`/`protectionBypassHeaders` from `e2e/helpers/bypass.ts` on the built origin only.
- `scripts/launch/dead-targets.ts` / `.launch-check.ts` (already built, W152/W158 — **not duplicated**): `internalHrefs`, `hasElementId`, `fetchRoute`, `deadTargets`, `ctaAnchorTargets`, `missingCtaAnchors`, `CtaAnchorTarget`.
- `scripts/launch/unbuilt-routes.launch-check.ts` (already built, W20 — **not duplicated**).
- `vitest.launch.config.mts` — `include: ['scripts/launch/**/*.launch-check.ts']`, `environment: 'node'`.
- `lighthouserc.json` / `.local.json` / `.preview.json` — ceiling 204,800 B; LCP ≤ 2,500 ms error; performance ≥ 0.95 error; a11y/best-practices/SEO = 1 error; CLS ≤ 0.1 error; TBT ≤ 200 warn; `numberOfRuns: 3`, `throttlingMethod: "devtools"`, `aggregationMethod: "median"` in all three files; `.preview.json` additionally `skipAudits: ["is-crawlable", "robots-txt"]`.
- `src/app/robots.ts` / `robots.test.ts` (already built — pins the production disallow list dynamically via `robotsDisallowPaths`/`UNBUILT_PATHNAMES`, never a hand-typed array).
- `e2e/seo.spec.ts` (already face-aware: sitemap sweep over `INDEXABLE_GATE_ROUTES`, every sitemap URL 200, robots face test, canonical/hreflang per route, OG image PNG check).
- `e2e/ops.spec.ts` (already accepts `401|503` on the two refusal cases — W139).
- `e2e/headers.spec.ts` (already asserts the four security headers — W157/W160 — on every `GATE_ROUTES` route plus the static-chunk/OG-route exceptions).
- `src/i18n/routing.ts`: `pathnames` (22 keys: 20 static, `/careers/[slug]` and `/blog/[slug]` dynamic), `routing`, `locales = ['tr','en']`.
- `src/i18n/navigation`: `getPathname`.
- `src/lib/seo/routes.ts`: `NOINDEX_PATHNAMES` (6 keys today), `isNoindexPathname`, `UNBUILT_PATHNAMES` (19 keys today, emptied by T1–T13), `robotsDisallowPaths(locale, unbuilt?)`, `OG_PAGE_KEYS`, `SITE_URL`.
- `src/design/chrome/ctas.ts`: `CTA_BY_PATHNAME`, `DEFAULT_CTAS` — the 8 anchor ids Cycle 6's placeholder/CTA reconciliation checks against: `/` → `proposal`, `/hire-workers` → `request-form` (via `DEFAULT_CTAS`), `/hiring-cost-calculator` → `calculator`, `/partner-with-us` → `tracks`, `/work-permit` → `permit-cta`, `/contact` → `message`, `/verify` → `report`, `/available-workers` → `pool`.
- `src/design/chrome/StickyCtaBar.tsx` (already routes contact CTAs through `ContactCta` `placement="page_cta"`, `data-testid="sticky-cta"` — **consumed, not modified**).
- `src/app/api/site-health/route.ts` / `ops.ts`: `OpsPing`, `pingOps`, `opsPingCheck` (`off|unauthorized|unreachable → fail`, `unconfigured → skip` — W75); `GET /api/site-health` body `{ ok, reasons, checks, ops, formBeacons, contractVersion, source, commit, at }`.
- `redirects/legacy.json` (328 rows, `{ from, to, status: 308, source }`), `redirects/gone.json` (19 prefixes, matched by `src/proxy.ts`).
- `src/forms/post.ts`: `postForm(formKey: FormKey, envelope: WireEnvelope, visitor: PostFormVisitor, deps?: PostFormDeps): Promise<PostFormResult>`; `PostFormDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number }` — the door URL and token come from `doorConfig(deps.env ?? process.env)` (`OPS_API_URL` + `OPS_WEBSITE_WRITE_TOKEN`); one 9 s deadline, one retry only after a connection-level failure (W74); `PostFormResult` is `ok` (`{ id, status: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM', isTest, replayed, captchaDegraded, error }`) or `invalid | captcha | off | tripped | unauthorized | unavailable`; `PostFormVisitor = { ip: string | null; ua: string | null }`.
- `src/forms/env.ts`: `doorBase(env)` (`OPS_API_URL` without a trailing slash, or null), `WEBSITE_TOKEN_MIN_LENGTH = 20`. `src/forms/wire.ts`: `buildEnvelope({ locale, fields, captchaToken?, honeypot?, sourcePath? }): WireEnvelope` (adds `consentVersion`; drops empty values).
- `src/app/api/revalidate/auth.ts`: `authorize(header: string | null, secret: string | undefined): 'ok' | 'unauthorized' | 'disabled'` — `Bearer` scheme case-insensitive, timing-safe equal-length compare, `disabled` when the secret is unset or shorter than `MIN_SECRET_LENGTH = 16`.
- `scripts/door-smoke.lib.ts` (T14): `smokeFields(formKey, stamp, extra?)` — the `hire` body is the I4 required set with the stamp in `name`/`message`, so two runs never dedupe onto one row (`sourcePath` is not hashed); T14's Produces names `/api/cron/synthetic-lead` as its second consumer.
- The Ops door's token classes (`docs/superpowers/handoff-2026-09-25/wp2-planning/operations-door-contract-as-built.md`; `docs/WEBSITE-HANDOFF.md` §3.1): tokens are minted as `wsw_` (write) or `wst_` (test) + 48 hex; a test-class call answers `isTest: true`, skips Turnstile when it carries no `captchaToken` and runs its handler as a dry run (no Inquiry, no notification, no autoresponder).
- T1–T14 (their own reconciled task files): `GATE_ROUTE_TABLE` rows, `data-lcp-slot`/`data-placeholder` markup, `sys.*` namespaces, `docs/SEO.md` Pages rows (W98); T14's forms ledger lines.

Produces
- `scripts/launch/route-coverage.launch-check.ts`: closes the residual W21 gap (route-table completeness) that neither `unbuilt-routes.launch-check.ts` nor `dead-targets.launch-check.ts` covers. It is NOT wired into `scripts/gate.sh`'s launch block (that block runs two named `.launch-check.ts` files, pinned by `scripts/gate.test.ts`), so T15 runs it explicitly in Cycle 4.
- `e2e/routes.ts`: the `/en/thank-you?form=hire` row (indexable `false`), so every static route is swept in both locales.
- `npm run sweep:legacy` (`scripts/launch/legacy-sweep.sh` over `scripts/launch/legacy-urls.txt`) — the Gate A / WP7a legacy sweep, re-run verbatim against production at WP7a.
- `GET /api/cron/synthetic-lead` (`src/app/api/cron/synthetic-lead/`) + the `vercel.json` `crons` entry — Gate A row 8's synthetic lead (W172). WP7a puts `CRON_SECRET` and `OPS_WEBSITE_TEST_TOKEN` into the Production scope before the cutover; the schedule moves to `*/30 * * * *` once the project is on Pro.
- The Gate A readiness record: the local (W126) and binding-preview launch-profile run records, the placeholder/MLC inventory reconciled against spec §10, the open-items list, the pixel-harness scores for the four D27 pages, `docs/WEBSITE-HANDOFF.md` §1/§3.2/§5 updated, `docs/OPERATING.md` updated, the T15 ledger row in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`. The task-scoped labels this file once proposed are ruled (W178): it cites W172 (synthetic lead), W173 (deploy docs), W174 (hero photos) and W178 (the rest), and appends nothing to the ruling log.

---

- [ ] **Cycle 1 — Close the one real launch-profile gap: `GATE_ROUTE_TABLE` covers every static route, both locales**

Why this is real and not already covered: `scripts/launch/dead-targets.launch-check.ts` (W152/W158) only proves that whatever **is** in `GATE_ROUTES`/`GATE_ROUTE_TABLE` has no dead links and every CTA anchor exists — it says nothing about a route that was never added to the table in the first place. `scripts/launch/unbuilt-routes.launch-check.ts` (W20) only proves every `pathnames` route **has a page** — nothing ties that back to the gate's own route list. W21 ("one route list … every page task appends its own two locale paths") has no owner for the completeness check itself; `wp2b/check.md`'s `foundation_gaps_to_rule` list names the careers-detail case of it (W93 settled that part): *"T15's launch check then requires one detail row per locale, marked indexable. The drafts have no single owner for those rows."* **Guard:** `ls scripts/launch/route-coverage.launch-check.ts 2>/dev/null` — if a page task already landed an equivalent file, read it, keep whichever is more complete, and skip the duplicated part of Step 3.

- [ ] **Step 1: Write the failing test**

`scripts/launch/route-coverage.launch-check.ts` (new; picked up by `vitest.launch.config.mts`'s `scripts/launch/**/*.launch-check.ts` include — launch profile only, exactly like its two siblings):

```ts
/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { getPathname } from '@/i18n/navigation';
import { pathnames, routing } from '@/i18n/routing';
import { isNoindexPathname, type StaticPathname } from '@/lib/seo/routes';
import { GATE_ROUTE_TABLE } from '../../e2e/routes';

/**
 * W21 (Gate A) — the one gap `dead-targets.launch-check.ts` (W152/W158) and
 * `unbuilt-routes.launch-check.ts` (W20) do not close: that `GATE_ROUTE_TABLE` (e2e/routes.ts)
 * itself lists every STATIC `pathnames` route in both locales with the right `indexable` flag.
 * Dead-targets only checks that what IS listed has no dead links; unbuilt-routes only checks
 * every route has a page. Neither proves the table's own coverage is complete, and W21 gives no
 * single task ownership of that check — every page task appends its own two rows and nobody
 * confirms they all did.
 *
 * Dynamic keys are excluded on purpose. `/careers/[slug]` is NEVER a static table row — W93
 * derives its two locale paths at gate time from the live Ops opening
 * (`scripts/gate-routes.mjs`'s `careersDetailRoutes`), so Lighthouse sees it without ever
 * hand-maintaining a slug here (a hard-coded one would 404 the day that opening closes — exactly
 * what `wp2b/check.md`'s `foundation_gaps_to_rule` list rules against). `/blog/[slug]` gets a
 * soft check only: T12 owns the one written article's row, and W4 keeps the Turkish body count
 * at zero at Gate A, so only the EN row is expected to exist in practice — this file requires
 * ONE non-indexable `/blog/<slug>` row, never both locales.
 *
 * Runs ONLY under `vitest.launch.config.mts` (never `npm run verify` — the default suite's
 * `scripts/**\/*.test.ts` glob does not match `*.launch-check.ts`). T15 runs last (W99), so by
 * the time this file is written every other page task has already landed its rows; a red case
 * here names exactly which task's row is missing or mis-flagged — see Step 4's stop-and-report
 * rule, T15 does not silently add a row on another task's behalf.
 */
const stripQuery = (p: string) => p.replace(/\?.*$/, '');
const byPath = new Map(GATE_ROUTE_TABLE.map((r) => [stripQuery(r.path), r]));

describe('GATE_ROUTE_TABLE covers every static route in both locales (T15, W21)', () => {
  for (const href of Object.keys(pathnames) as (keyof typeof pathnames)[]) {
    if (href.includes('[')) continue; // dynamic keys: W93 (careers) / soft-checked below (blog)
    for (const locale of routing.locales) {
      // `includes('[')` does not narrow the key type; the cast is the same one
      // dead-targets.launch-check.ts uses (a bare string is valid for static keys only).
      const external = getPathname({ locale, href: href as StaticPathname });
      it(`${locale} ${href} → ${external} is swept, indexable=${!isNoindexPathname(href)}`, () => {
        const row = byPath.get(external);
        expect(row, `${external} missing from e2e/routes.ts`).toBeDefined();
        expect(row?.indexable).toBe(!isNoindexPathname(href));
      });
    }
  }

  it('has at least one non-indexable /blog/<slug> article row (T12 owns it; W4 keeps TR empty)', () => {
    const blogArticles = GATE_ROUTE_TABLE.filter((r) => /^\/(en\/)?blog\/[^/?]+$/.test(r.path));
    expect(blogArticles.length, 'no /blog/<slug> row yet — T12 has not landed').toBeGreaterThan(0);
    for (const r of blogArticles) {
      expect(r.indexable, `${r.path} must be indexable:false (W4)`).toBe(false);
    }
  });

  it('never hand-maintains a careers detail row (W93 derives it live at gate time)', () => {
    const careersDetail = GATE_ROUTE_TABLE.filter((r) =>
      /^\/(en\/)?(kariyer|careers)\/[^/?]+$/.test(r.path),
    );
    expect(
      careersDetail,
      'a static /kariyer/<slug> or /en/careers/<slug> row would go stale the day the opening ' +
        'closes — scripts/gate-routes.mjs appends it live from the Ops door instead (W93)',
    ).toEqual([]);
  });

  it('has no duplicate paths', () => {
    const paths = GATE_ROUTE_TABLE.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
```

Run line: `NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --config vitest.launch.config.mts scripts/launch/route-coverage.launch-check.ts --maxWorkers=1`

- [ ] **Step 2: Run to verify it fails**

Before the file exists: vitest prints `No test files found, exiting with code 1` for the launch config's filter. Once written: the `en /thank-you → /en/thank-you` case is RED until Step 3 adds that row (WP2a Task 7 added only the TR `/tesekkurler?form=hire` row and no page task owns the thank-you page). Beyond that, whether the per-route cases pass depends on how much of T1–T13 has already landed by the moment this cycle actually runs — per W99, T15 executes last, so in the ordinary case every static route is already present and only the two new assertions (the blog soft-check, the careers-detail absence check) are freshly exercised. If any per-route case is still red, its message names the exact external path and locale missing from `e2e/routes.ts` — that identifies precisely which earlier task's commit is incomplete.

- [ ] **Step 3: Implement**

The test file above **is** the check — there is no separate production module; it reads `GATE_ROUTE_TABLE` directly. The one row T15 owns: `e2e/routes.ts` — append, as the last entry of the `GATE_ROUTE_TABLE` array literal (after the last row the page tasks appended):

```ts
  // T15 (W21): the EN twin of the WP2a conversion-page row — noindex, never audited by Lighthouse.
  { path: '/en/thank-you?form=hire', indexable: false },
```

Any OTHER missing row, **do not add it here**: this task never edits another page's route additions. Stop and report the missing `(locale, path)` pairs to the controller — the owning page task lands a one-line follow-up commit adding its row, the same pattern W20 already uses ("each page task deletes its own entry"; here, each page task owns its own two rows).

- [ ] **Step 4: Verify**

```bash
npx prettier --write scripts/launch/route-coverage.launch-check.ts e2e/routes.ts
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --config vitest.launch.config.mts scripts/launch/route-coverage.launch-check.ts scripts/launch/unbuilt-routes.launch-check.ts --maxWorkers=1   # both green (T1–T13 landed; dead-targets needs a live server — it runs in Cycle 4)
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1   # the low-memory verify line; the default suite never matches *.launch-check.ts
```

- [ ] **Step 5: Commit**

```bash
git add scripts/launch/route-coverage.launch-check.ts e2e/routes.ts
git commit -m "test(gate): route-table completeness check — every static pathnames route swept in both locales (T15, W21)

dead-targets.launch-check.ts (W152/W158) proves what IS in GATE_ROUTE_TABLE has no dead links;
unbuilt-routes.launch-check.ts (W20) proves every route has a page. Neither proved the table
itself was complete. Dynamic keys stay out on purpose: careers detail is derived live at gate
time (W93, scripts/gate-routes.mjs) and must never be a hand-maintained row. Adds the one row
no page task owns: /en/thank-you?form=hire (noindex), the EN twin of the WP2a row.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 2 — The Googlebot curl sweep: 20 legacy URLs → single-hop 308/410, no 429**

Nothing in the built foundation owns this (spec §5's own words: "Googlebot curl sweep of 20 legacy URLs returns single-hop 308/410 with no 429" — a Gate A checklist line with no code anywhere). `redirects/legacy.json` (328 rows) and `redirects/gone.json` (19 prefixes) already exist and are already unit-tested for internal consistency (`redirects/redirects.test.ts`); nothing exercises them against a **live deployment**.

- [ ] **Step 1: Write the failing test**

`scripts/launch/legacy-urls.txt` (new; tab-separated `path<TAB>expect<TAB>location`; `keep` rows are live-route controls, not part of the 20 — every `to` target below is taken from the real `pathnames` table in `src/i18n/routing.ts`, verified directly, e.g. `/contact` → `{tr:'/iletisim', en:'/contact'}`, `/about` → `{tr:'/hakkimizda', en:'/about'}`; every `410` path is a real `redirects/gone.json` prefix):

```
# Gate A legacy sweep (spec §5): 20 old URLs + 2 keep controls. Columns: path <TAB> expect <TAB> location
# expect = 308 (single hop to `location`), 410 (gone prefix, redirects/gone.json via src/proxy.ts),
# keep (live route, must answer 200 and never redirect). If a `to` here disagrees with the real
# redirects/legacy.json row, legacy-sweep.test.ts below fails — fix THIS FILE to match the data,
# the data is the source of truth, this list is a curated subset of the 328 rows.
/contact-us	308	/en/contact
/tr/contact-us	308	/iletisim
/hire-workers-in-turkey	308	/en/hire-workers
/tr/hire-workers-in-turkey	308	/isci-talebi
/job-recruitment	308	/en/hire-workers
/about	308	/en/about
/tr/about	308	/hakkimizda
/de/about	308	/en/about
/work-permit	308	/en/work-permit
/immigration/immigrate-to-turkey	308	/en/work-permit
/certifications	308	/en/about#lisans
/tr/certifications	308	/hakkimizda#lisans
/home	308	/en
/tr/home	308	/
/privacy	308	/en/privacy
/login-companies	308	/en/portal-login
/partner/recruiter-agency	308	/en/partner-with-us
/job-detail/123	410	
/profile/xyz	410	
/visa	410	
/	keep	
/blog	keep	
```

`scripts/launch/legacy-sweep.test.ts` (new — pure data: pins every row of the file above to `redirects/legacy.json`, `redirects/gone.json` and the live `pathnames` table, so the network sweep in Step 3 can only disagree with the DATA if the deployment itself is wrong, never because this list drifted from it):

```ts
/** @vitest-environment node */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPathname } from '@/i18n/navigation';
import { pathnames, routing } from '@/i18n/routing';
import type { StaticPathname } from '@/lib/seo/routes';
import legacy from '../../redirects/legacy.json';
import gone from '../../redirects/gone.json';

type Row = { path: string; expect: '308' | '410' | 'keep'; location: string };

export function parseLegacyUrls(text: string): Row[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [path, expectVal, location = ''] = l.split('\t');
      return { path, expect: expectVal as Row['expect'], location };
    });
}

const rows = parseLegacyUrls(readFileSync(join(__dirname, 'legacy-urls.txt'), 'utf8'));
const byFrom = new Map(
  (legacy as { from: string; to: string; status: number }[]).map((r) => [r.from, r]),
);
const GONE = gone as string[];
const isGone = (p: string) => GONE.some((g) => p === g || p.startsWith(g.endsWith('/') ? g : `${g}/`));
const stripHash = (p: string) => p.replace(/#.*$/, '');

// Every external path the new site serves (static routes only; the two dynamic keys need a slug
// and are never a legacy-redirect target).
const LIVE = new Set<string>();
for (const locale of routing.locales) {
  for (const href of Object.keys(pathnames) as (keyof typeof pathnames)[]) {
    if (href.includes('[')) continue;
    LIVE.add(getPathname({ locale, href: href as StaticPathname }));
  }
}

describe('Gate A legacy sweep — the 20 URLs are pinned to the redirect data (T15)', () => {
  it('lists exactly 20 legacy rows and 2 keep controls', () => {
    expect(rows.filter((r) => r.expect !== 'keep')).toHaveLength(20);
    expect(rows.filter((r) => r.expect === 'keep').map((r) => r.path)).toEqual(['/', '/blog']);
    expect(new Set(rows.map((r) => r.path)).size).toBe(rows.length);
  });

  for (const row of rows) {
    if (row.expect === '308') {
      it(`${row.path} → 308 ${row.location}, one hop, onto a live route`, () => {
        const rule = byFrom.get(row.path);
        expect(rule, `${row.path} is not in redirects/legacy.json — fix legacy-urls.txt`).toBeDefined();
        expect(rule?.status).toBe(308);
        expect(rule?.to).toBe(row.location);
        const target = stripHash(row.location);
        expect(byFrom.has(target), `${target} is itself redirected — a chain`).toBe(false);
        expect(isGone(target), `${target} lands in a 410 prefix`).toBe(false);
        expect(LIVE.has(target), `${target} is not a pathnames route`).toBe(true);
      });
    } else if (row.expect === '410') {
      it(`${row.path} → 410 (gone prefix)`, () => {
        expect(isGone(row.path)).toBe(true);
        expect(byFrom.has(row.path)).toBe(false);
      });
    } else {
      it(`${row.path} is a live keep route — never redirected, never gone`, () => {
        expect(LIVE.has(row.path)).toBe(true);
        expect(byFrom.has(row.path)).toBe(false);
        expect(isGone(row.path)).toBe(false);
      });
    }
  }
});
```

Run line: `NODE_OPTIONS=--max-old-space-size=4096 npx vitest run scripts/launch/legacy-sweep.test.ts --maxWorkers=1` (this file matches the default suite's `scripts/**/*.test.ts` include — it runs in the default suite and therefore in the Vercel build's verify step, unlike the `.launch-check.ts` files).

- [ ] **Step 2: Run to verify it fails**

`ENOENT: no such file or directory, open '…/scripts/launch/legacy-urls.txt'` before the file exists. With the file present, deliberately break one row (e.g. change `/visa` to `/visas`) to confirm the guard actually catches drift: `"/visas → 410 (gone prefix)"` fails, since `/visas` is not in `gone.json` — that is the mechanism that keeps this list honest against the real data.

- [ ] **Step 3: Implement**

`scripts/launch/legacy-sweep.sh` (new):

```bash
#!/usr/bin/env bash
# Gate A (spec §5) / WP7a: the Googlebot curl sweep. Every legacy URL in
# scripts/launch/legacy-urls.txt must answer in ONE hop — 308 with the exact Location
# (D21, next.config.ts redirects), 410 for a gone prefix (redirects/gone.json via src/proxy.ts)
# — and never 429 (the old site's measured failure mode: crawlers rate-limited). `keep` rows are
# live routes that must answer 200 and never redirect.
# Usage: E2E_BASE_URL=https://<preview-or-production> npm run sweep:legacy
#        VERCEL_AUTOMATION_BYPASS_SECRET=… for a protected preview (e2e/helpers/bypass.ts, W137).
# Prints a markdown table (paste into the WP2b ledger) and exits 1 on any miss.
set -euo pipefail
: "${E2E_BASE_URL:?set E2E_BASE_URL to the preview or production URL}"
BASE="${E2E_BASE_URL%/}"
UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
LIST="$(dirname "$0")/legacy-urls.txt"
HDR=()
if [ -n "${VERCEL_AUTOMATION_BYPASS_SECRET:-}" ]; then
  HDR=(-H "x-vercel-protection-bypass: ${VERCEL_AUTOMATION_BYPASS_SECRET}")
fi

# status<TAB>redirect-path (pathname + fragment, host dropped — Next emits an absolute Location)
# `${HDR[@]+"${HDR[@]}"}`, never a bare "${HDR[@]}": macOS /bin/bash is 3.2, where an empty
# array under `set -u` aborts with "HDR[@]: unbound variable" (the production run has no secret).
probe() {
  curl -sS -o /dev/null --max-redirs 0 -A "$UA" ${HDR[@]+"${HDR[@]}"} \
    -w '%{http_code}\t%{redirect_url}' "$BASE$1" 2>/dev/null || printf '000\t'
}
strip_host() { sed -E 's#^https?://[^/]+##'; }

fail=0
printf '| # | legacy URL | expected | got | location | second hop | verdict |\n'
printf '| --- | --- | --- | --- | --- | --- | --- |\n'
n=0
while IFS=$'\t' read -r path expect location; do
  [ -z "$path" ] && continue
  case "$path" in \#*) continue ;; esac
  n=$((n + 1))
  IFS=$'\t' read -r code redirect <<<"$(probe "$path")"
  loc="$(printf '%s' "$redirect" | strip_host)"
  hop2='—'
  verdict=ok
  if [ "$code" = 429 ]; then verdict='FAIL: 429 (crawler rate-limited)'; fi
  case "$expect" in
    308)
      [ "$code" = 308 ] || verdict="FAIL: expected 308"
      [ "$loc" = "$location" ] || verdict="FAIL: location $loc"
      if [ "$code" = 308 ]; then
        # The target must answer 200 itself — a 308 → 308 is a chain, a 308 → 404 a dead end.
        IFS=$'\t' read -r hop2 _ <<<"$(probe "$(printf '%s' "$loc" | sed -E 's/#.*$//')")"
        [ "$hop2" = 200 ] || verdict="FAIL: second hop $hop2"
      fi
      ;;
    410) [ "$code" = 410 ] || verdict="FAIL: expected 410" ;;
    keep) [ "$code" = 200 ] || verdict="FAIL: expected 200" ;;
    *) verdict="FAIL: unknown expectation $expect" ;;
  esac
  case "$verdict" in FAIL*) fail=$((fail + 1)) ;; esac
  printf '| %s | `%s` | %s%s | %s | %s | %s | %s |\n' "$n" "$path" "$expect" "${location:+ → $location}" "$code" "${loc:-—}" "$hop2" "$verdict"
done <"$LIST"
echo
if [ "$fail" -gt 0 ]; then
  echo "sweep:legacy — $fail row(s) failed against $BASE" >&2
  exit 1
fi
echo "sweep:legacy — all rows single-hop against $BASE (Googlebot UA, no 429)"
```

`package.json` `scripts` — insert after `"pixel": "tsx scripts/pixel-compare.ts",`:

```json
    "sweep:legacy": "bash scripts/launch/legacy-sweep.sh",
```

**Contingency — a Vercel Firewall challenge on the spoofed Googlebot UA.** A 403 with an interstitial body on the sweep's curl UA is not a redirect-map defect: it means Bot Protection / Attack Challenge Mode is challenging an unverified crawler UA (a real Googlebot passes reverse-DNS verification; curl cannot). Record it as a finding for a verified-crawler allowlist at the Firewall layer (`docs/SEO.md` § Robots already flags this allowlist as "not yet configured … tracked as one of the three numbers watched in the 12-week post-launch window" — confirmed by direct grep of the current file), then re-run once with `UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"` (a plain browser UA) to confirm the redirect layer itself is correct, and paste both tables into the readiness record (Cycle 6/7). This contingency is recorded under **W178** (this file's task-scoped labels are cited by their assigned numbers; nothing is appended to the ruling log).

- [ ] **Step 4: Verify**

```bash
chmod +x scripts/launch/legacy-sweep.sh
npx prettier --write scripts/launch/legacy-sweep.test.ts package.json
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run scripts/launch/legacy-sweep.test.ts --maxWorkers=1   # 23 passed (1 + 22 rows)
bash -n scripts/launch/legacy-sweep.sh   # syntax check under the system bash (3.2 on macOS)
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1   # the low-memory verify line
```

- [ ] **Step 5: Commit**

```bash
git add scripts/launch/legacy-urls.txt scripts/launch/legacy-sweep.sh scripts/launch/legacy-sweep.test.ts package.json
git commit -m "feat(gate): Googlebot legacy sweep — 20 old URLs single-hop 308/410, keep controls, data-pinned (T15, Gate A spec §5)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 3 — The synthetic lead: `GET /api/cron/synthetic-lead` and its `vercel.json` cron (W172)**

Gate A row 8 ("synthetic lead and digest running") had no builder. W172 gives the synthetic lead to T15 and moves the digest (I19) to Phase B; the digest's `docs/pending/` line belongs to the controller's W173 docs commit, so T15 never edits `docs/pending/`. This cycle runs BEFORE the proof build, so Cycle 4's single W126 build covers it. The design is `docs/OPERATING.md` § Synthetic lead: a scheduled job submits a real form through the real form path with the test token class, so it never shows up as a real lead or as a `generate_lead`. Everything here reuses what is built: T14's `smokeFields('hire', stamp)` for the body (the catalog is never re-encoded), `postForm` for the call (server-side; no browser is involved), and `authorize` from `src/app/api/revalidate/auth.ts` for the bearer check.

**Guards.** `ls scripts/door-smoke.lib.ts` must list the file (T14 landed); otherwise stop and report. `cat vercel.json` must print exactly the "before" file in Step 3; if another commit changed it, stop and report. The only change this cycle makes to it is the added `crons` key.

**Heartbeat.** `docs/OPERATING.md` § Synthetic lead asks for "a heartbeat ping on success", and `docs/INTEGRATIONS.md` I19 names "heartbeat URLs", but no heartbeat mechanism exists: no URL, no env var, no service. The external monitor that would issue one is itself an owner set-up item (`docs/WEBSITE-HANDOFF.md` §3.3). The route therefore logs `[synthetic-lead] ok` with the door's status to the Vercel function log and returns that status. Adding the ping is a follow-up once the monitor issues a heartbeat URL (Foundation gaps). Until then a failed run shows as a non-200 invocation in the project's Cron Jobs log.

**Token class.** Ops mints tokens as `wsw_` (write) or `wst_` (test) plus 48 hex characters (`docs/superpowers/handoff-2026-09-25/wp2-planning/operations-door-contract-as-built.md`). The route posts only with a `wst_…` `OPS_WEBSITE_TEST_TOKEN`, put into the write-token slot of the env it hands `postForm`. It never falls back to `OPS_WEBSITE_WRITE_TOKEN`, because a write-class synthetic lead would file a real Inquiry, notification and autoresponder on every run. It also checks the door's own `isTest` answer. No equality check against the write slot: in T14's Phase A configuration `staging` holds the test token in BOTH slots, and the manual proof runs there.

- [ ] **Step 1: Write the failing test**

`src/app/api/cron/synthetic-lead/run.test.ts`:

```ts
/** @vitest-environment node */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// Relative on purpose: the `@/` alias covers `src/` only, and `scripts/` is a sibling.
import { smokeFields } from '../../../../../scripts/door-smoke.lib';
import { GET } from './route';
import {
  SYNTHETIC_LEAD_PATH,
  runSyntheticLead,
  stampOf,
  syntheticLeadEnvelope,
  testDoorEnv,
} from './run';

const SECRET = 'cron-secret-0123456789abcdef';
const TEST_TOKEN = 'wst_' + 'a'.repeat(48);
const WRITE_TOKEN = 'wsw_' + 'b'.repeat(48);
const env = {
  NODE_ENV: 'test',
  CRON_SECRET: SECRET,
  OPS_API_URL: 'https://operations.example.com/',
  OPS_WEBSITE_WRITE_TOKEN: WRITE_TOKEN,
  OPS_WEBSITE_TEST_TOKEN: TEST_TOKEN,
} as NodeJS.ProcessEnv;
const NOW = new Date('2026-10-01T06:00:07.123Z');
const now = () => NOW;
const AUTH = `Bearer ${SECRET}`;

/** The door's HTTP answer, as `postForm` reads it. */
const door = (status: number, body: unknown) =>
  vi.fn<typeof fetch>(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
  );
const accepted = (isTest = true) =>
  door(200, {
    data: {
      id: 'sub_9',
      status: 'HANDLED',
      isTest,
      replayed: false,
      captchaDegraded: false,
      error: null,
    },
  });

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('synthetic lead — the CRON_SECRET guard (W172)', () => {
  it('answers 401 without a call for a missing, malformed or wrong Authorization header', async () => {
    const doorFetch = accepted();
    for (const header of [null, '', SECRET, `Basic ${SECRET}`, `Bearer ${SECRET}x`, 'Bearer ']) {
      expect(await runSyntheticLead(header, { env, fetch: doorFetch, now })).toEqual({
        status: 401,
        body: { error: 'unauthorized' },
      });
    }
    expect(doorFetch).not.toHaveBeenCalled();
  });

  it('stays shut (401) when CRON_SECRET is unset or shorter than 16 characters', async () => {
    const doorFetch = accepted();
    for (const CRON_SECRET of [undefined, '', 'short-secret']) {
      const res = await runSyntheticLead(`Bearer ${CRON_SECRET ?? ''}`, {
        env: { ...env, CRON_SECRET },
        fetch: doorFetch,
        now,
      });
      expect(res).toEqual({ status: 401, body: { error: 'unauthorized' } });
    }
    expect(doorFetch).not.toHaveBeenCalled();
  });

  it('the GET handler answers 401, no-store, when the request carries no secret', async () => {
    vi.stubEnv('CRON_SECRET', SECRET);
    const res = await GET(new Request('http://localhost/api/cron/synthetic-lead'));
    expect({
      status: res.status,
      cacheControl: res.headers.get('cache-control'),
      body: await res.json(),
    }).toEqual({ status: 401, cacheControl: 'no-store', body: { error: 'unauthorized' } });
  });
});

describe('synthetic lead — the body and the token class (W172)', () => {
  it("posts T14's smokeFields('hire') with the TEST token and answers 200 { data: { status, isTest } }", async () => {
    const doorFetch = accepted();
    expect(await runSyntheticLead(AUTH, { env, fetch: doorFetch, now })).toEqual({
      status: 200,
      body: { data: { status: 'HANDLED', isTest: true } },
    });
    expect(doorFetch).toHaveBeenCalledTimes(1);
    const [url, init] = doorFetch.mock.calls[0];
    expect(url).toBe('https://operations.example.com/api/website/v1/forms/hire');
    expect((init?.headers as Record<string, string>).Authorization).toBe(`Bearer ${TEST_TOKEN}`);
    const sent = JSON.parse(String(init?.body));
    expect(sent).toEqual(syntheticLeadEnvelope(stampOf(NOW)));
    expect(sent.fields).toEqual(smokeFields('hire', 'cron-20261001T060007Z'));
    expect(sent.sourcePath).toBe(SYNTHETIC_LEAD_PATH);
    expect(sent.captchaToken).toBeUndefined(); // a test-class call without one skips Turnstile
  });

  it('stamps every run apart, so two runs inside one clock hour never dedupe onto one row', () => {
    expect(stampOf(NOW)).toBe('cron-20261001T060007Z');
    expect(stampOf(new Date('2026-10-01T06:30:00Z'))).not.toBe(
      stampOf(new Date('2026-10-01T06:00:00Z')),
    );
  });

  it('never falls back to the write token: 503 without a call unless the test slot holds a wst_ token', async () => {
    const doorFetch = accepted();
    for (const OPS_WEBSITE_TEST_TOKEN of [undefined, '', 'wst_short', WRITE_TOKEN]) {
      expect(
        await runSyntheticLead(AUTH, {
          env: { ...env, OPS_WEBSITE_TEST_TOKEN },
          fetch: doorFetch,
          now,
        }),
      ).toEqual({ status: 503, body: { error: 'synthetic lead not configured' } });
    }
    expect(doorFetch).not.toHaveBeenCalled();
    expect(testDoorEnv({ ...env, OPS_API_URL: '' })).toBeNull();
    expect(testDoorEnv(env)?.OPS_WEBSITE_WRITE_TOKEN).toBe(TEST_TOKEN);
  });

  it('answers 502 with the postForm kind when the door does not accept the lead', async () => {
    const res = await runSyntheticLead(AUTH, { env, fetch: door(404, { message: 'off' }), now });
    expect(res).toEqual({ status: 502, body: { error: 'off' } });
  });

  it('answers 500 when the door says isTest:false — the slot held a write-class token', async () => {
    const res = await runSyntheticLead(AUTH, { env, fetch: accepted(false), now });
    expect(res).toEqual({ status: 500, body: { error: 'not test-class' } });
  });
});

describe('vercel.json schedules the route (W172)', () => {
  it('has one cron on /api/cron/synthetic-lead: daily on Hobby, every 30 minutes once Pro is on', () => {
    const file = join(__dirname, '..', '..', '..', '..', '..', 'vercel.json');
    const config = JSON.parse(readFileSync(file, 'utf8')) as {
      crons?: { path: string; schedule: string }[];
    };
    const crons = (config.crons ?? []).filter((c) => c.path === SYNTHETIC_LEAD_PATH);
    expect(crons).toHaveLength(1);
    expect(['0 6 * * *', '*/30 * * * *']).toContain(crons[0].schedule);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run src/app/api/cron/synthetic-lead/run.test.ts --maxWorkers=1
```

Expected: the suite fails to load, because `./route` and `./run` do not exist yet. Once they exist and before `vercel.json` changes, only the schedule case is red (`crons` is absent).

- [ ] **Step 3: Implement**

`src/app/api/cron/synthetic-lead/run.ts`:

```ts
import 'server-only';
import { authorize } from '@/app/api/revalidate/auth';
import { doorBase, WEBSITE_TOKEN_MIN_LENGTH } from '@/forms/env';
import { postForm, type PostFormVisitor } from '@/forms/post';
import { buildEnvelope, type WireEnvelope } from '@/forms/wire';
// Relative on purpose: the `@/` alias covers `src/` only, and `scripts/` is a sibling (the same
// reason site-health imports `contract/` relatively). T14's body builder, never re-encoded here.
import { smokeFields } from '../../../../../scripts/door-smoke.lib';

/** The route Vercel Cron calls, and the `sourcePath` the door records for each run. */
export const SYNTHETIC_LEAD_PATH = '/api/cron/synthetic-lead';
/** Ops mints test-class tokens as `wst_` + 48 hex (write-class: `wsw_`), so the prefix tells
 *  the two apart before any call is made. */
export const TEST_TOKEN_PREFIX = 'wst_';
/** No visitor: no IP header is sent; the UA names the caller on the door's row. */
const VISITOR: PostFormVisitor = { ip: null, ua: 'JobsAdmire synthetic-lead cron (W172)' };

export type SyntheticLeadDeps = {
  env?: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
  now?: () => Date;
};
export type SyntheticLeadResult = { status: number; body: Record<string, unknown> };

/** `cron-20261001T060007Z`. `smokeFields` puts it in `name`/`message`, so two runs inside one
 *  clock hour never dedupe onto one door row (`sourcePath` is not hashed). */
export function stampOf(now: Date): string {
  const iso = now.toISOString().replace(/\.\d{3}Z$/, 'Z'); // 2026-10-01T06:00:07Z
  return `cron-${iso.replace(/[-:]/g, '')}`;
}

/** T14's `hire` smoke body in the envelope every form post uses. No `captchaToken`: a
 *  test-class call without one skips Turnstile (Ops X16). */
export function syntheticLeadEnvelope(stamp: string): WireEnvelope {
  return buildEnvelope({
    locale: 'en',
    fields: smokeFields('hire', stamp),
    sourcePath: SYNTHETIC_LEAD_PATH,
  });
}

/** The env `postForm` reads, with the TEST-class token in the write-token slot, or null when
 *  the door URL is missing or `OPS_WEBSITE_TEST_TOKEN` is not a usable `wst_…` token. Never
 *  falls back to the write token: a write-class synthetic lead would file a real Inquiry,
 *  notification and autoresponder on every run. */
export function testDoorEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv | null {
  const token = env.OPS_WEBSITE_TEST_TOKEN?.trim();
  if (!doorBase(env) || !token) return null;
  if (token.length < WEBSITE_TOKEN_MIN_LENGTH || !token.startsWith(TEST_TOKEN_PREFIX)) return null;
  return { ...env, OPS_WEBSITE_WRITE_TOKEN: token };
}

/**
 * W172: Gate A row 8's synthetic lead. 401 unless `Authorization: Bearer $CRON_SECRET` (what
 * Vercel Cron sends; an unset or short secret keeps the route shut); 503 without a call when
 * the test-class door is not configured; 502 with the `postForm` kind when the door does not
 * accept the lead; 500 when the door answers `isTest: false`; 200 `{ data: { status, isTest } }`.
 * Never logs the secret, the token or a field.
 */
export async function runSyntheticLead(
  authorization: string | null,
  deps: SyntheticLeadDeps = {},
): Promise<SyntheticLeadResult> {
  const env = deps.env ?? process.env;
  const auth = authorize(authorization, env.CRON_SECRET);
  if (auth !== 'ok') {
    if (auth === 'disabled')
      console.error('[synthetic-lead] CRON_SECRET unset or shorter than 16 chars: route shut');
    return { status: 401, body: { error: 'unauthorized' } };
  }
  const doorEnv = testDoorEnv(env);
  if (!doorEnv) {
    console.error(
      '[synthetic-lead] OPS_API_URL or a wst_ OPS_WEBSITE_TEST_TOKEN missing: not posting',
    );
    return { status: 503, body: { error: 'synthetic lead not configured' } };
  }
  const stamp = stampOf((deps.now ?? (() => new Date()))());
  const result = await postForm('hire', syntheticLeadEnvelope(stamp), VISITOR, {
    env: doorEnv,
    fetch: deps.fetch,
  });
  if (result.kind !== 'ok') {
    console.error('[synthetic-lead] the door did not accept the lead', {
      kind: result.kind,
      stamp,
    });
    return { status: 502, body: { error: result.kind } };
  }
  if (!result.isTest) {
    console.error('[synthetic-lead] the door answered isTest:false: the token is write-class', {
      id: result.id,
    });
    return { status: 500, body: { error: 'not test-class' } };
  }
  // No heartbeat mechanism exists yet (docs/OPERATING.md § Synthetic lead): this log line and the
  // 200 are the record until the external monitor issues a heartbeat URL.
  console.info('[synthetic-lead] ok', { status: result.status, id: result.id, stamp });
  return { status: 200, body: { data: { status: result.status, isTest: result.isTest } } };
}
```

`src/app/api/cron/synthetic-lead/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { runSyntheticLead } from './run';

// W172: Vercel Cron's target (`vercel.json` `crons`). Never cached, never prerendered: every
// invocation must reach the door. `api` is outside the proxy matcher, so it is never
// locale-rewritten.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { status, body } = await runSyntheticLead(request.headers.get('authorization'));
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
```

`src/forms/post.ts`: change only the doc comment above `export type PostFormDeps`. Find it with `grep -n 'Test seams only' src/forms/post.ts`; replace `/** Test seams only — production callers pass nothing. */` with:

```ts
/** Test seams; form actions pass nothing. The one production caller that passes `env` is the
 *  synthetic-lead cron (W172, `src/app/api/cron/synthetic-lead/run.ts`): it puts the
 *  test-class token in the write-token slot. */
```

`vercel.json`. Before (as WP2a left it, verified 2026-10-01):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run verify && next build",
  "installCommand": "npm ci --include=dev",
  "git": {
    "deploymentEnabled": {
      "main": false
    }
  }
}
```

After (the full file; `git.deploymentEnabled` is byte-for-byte unchanged, only `crons` is added):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run verify && next build",
  "installCommand": "npm ci --include=dev",
  "git": {
    "deploymentEnabled": {
      "main": false
    }
  },
  "crons": [
    {
      "path": "/api/cron/synthetic-lead",
      "schedule": "0 6 * * *"
    }
  ]
}
```

`0 6 * * *` is daily at 06:00 UTC, the only cadence the Hobby plan runs (a more frequent expression fails the deployment there). **Once the project is on Pro, change the schedule to `*/30 * * * *`**, the design's every 30 minutes. `docs/OPERATING.md` § Synthetic lead and the `run.test.ts` schedule case both accept either value. Vercel invokes crons only for the production deployment: production is the frozen old-site deployment until WP7a removes the `main` guards, so nothing runs before the cutover. Preview deployments never run the schedule.

`.env.example`: find `grep -n '^OPS_WEBSITE_TEST_TOKEN=' .env.example` and insert directly below that line:

```
# Vercel Cron bearer secret (W172): Vercel sends `Authorization: Bearer $CRON_SECRET` on every
# cron invocation; /api/cron/synthetic-lead answers 401 without it (unset or < 16 chars keeps the
# route shut). A random value of 16+ chars: Production, plus the `staging` Preview scope for the
# one manual proof.
CRON_SECRET=
```

`docs/DEPLOYMENT.md` § Environment variables: find the `OPS_WEBSITE_TEST_TOKEN` row with ``grep -n '^| `OPS_WEBSITE_TEST_TOKEN`' docs/DEPLOYMENT.md`` (T14 has already updated its ending) and insert this row directly below it. `npx prettier --write` realigns the table:

```md
| `CRON_SECRET` | Vercel Cron's bearer secret (W172). Once the project holds it, Vercel sends `Authorization: Bearer $CRON_SECRET` on every cron invocation, and `/api/cron/synthetic-lead` answers 401 without it; an unset or shorter-than-16-character value keeps the route shut (`authorize`, `src/app/api/revalidate/auth.ts`). Production scope (crons run only on the production deployment, so from the Phase A cutover) and the `staging` branch's Preview scope (the one manual proof, T15; the controller exports the same value in its shell for that run only). The route also needs `OPS_API_URL` and a `wst_…` `OPS_WEBSITE_TEST_TOKEN` in the same scope and never falls back to the write token. Name only here; the value is never committed |
```

`docs/OPERATING.md` § Synthetic lead. Find the section with `grep -n '^## Synthetic lead\|^## Daily digest' docs/OPERATING.md`. Its body is T14's paragraph: `**The cron is not yet built** (T15 adds …); **the probe exists**: …`, followed by `The design, for when WP3a/WP5 land it: …` and ending `…during an actual outage.`. If `npm run door:smoke` does not appear between the two headings, T14 has not landed: stop and report. Replace everything between `## Synthetic lead` and `## Daily digest` (both headings stay) with:

```md
**Built (T15, W172):** `GET /api/cron/synthetic-lead` (`src/app/api/cron/synthetic-lead/`) submits ONE test-class `hire` form through the real server-side form path: `postForm` (`src/forms/post.ts`) with the body `npm run door:smoke` uses (`smokeFields('hire', stamp)`, `scripts/door-smoke.lib.ts`). The stamp rides in `name`/`message`, so two runs never dedupe onto one row. It uses the `isTest` token class, so it never shows up as a real lead in Operations' inbox or in `generate_lead` conversion counts. Answers: **401** unless the request carries `Authorization: Bearer $CRON_SECRET` (Vercel Cron sends exactly that; an unset or short secret keeps the route shut); **503**, without a call, when `OPS_API_URL` or a `wst_…` `OPS_WEBSITE_TEST_TOKEN` is missing (it never falls back to the write token); **502** with the `postForm` kind when the door does not accept the lead; **500** when the door answers `isTest: false`; **200** `{ data: { status, isTest: true } }` on success.

**Schedule:** `vercel.json` `crons`, `0 6 * * *` (daily, 06:00 UTC) while the project is on Hobby, whose crons run at most once a day. Change it to `*/30 * * * *` (the design's every 30 minutes) once Pro is on. Vercel runs crons only for the production deployment, so the schedule starts at the Phase A cutover; before it, the route was proven once by hand on `staging` (T15).

**Heartbeat (not wired yet).** The design pings an external heartbeat service on success, and **a missed ping is the page**: the alarm is the monitor noticing silence, not the site self-reporting a failure it may be unable to report during an actual outage. No heartbeat URL exists yet (the external monitor is an owner set-up item; `docs/INTEGRATIONS.md` I19). Today the route only logs `[synthetic-lead] ok` with the door's status to the Vercel function log, and a failed run shows as a non-200 invocation in the project's Cron Jobs log. Adding the ping is a follow-up once the monitor issues a heartbeat URL.

**Manual probe:** `npm run door:smoke` (`scripts/door-smoke.ts`, T14) posts one test-class body per form key to the real door (ping, ten keys, the deliberate replay, the deliberate 400, the unknown key) and prints the Markdown table the ledger keeps. It refuses a write-class token. Test-class rows appear in the Ops inbox under the _test_ filter (`isTest: true`), run their handler as a dry run and skip Turnstile when they carry no token (Ops X16). A green smoke or a green synthetic lead therefore proves the door up to the handler and nothing about the visitor's captcha path; `e2e/door-test-mode.spec.ts` and the owner-gated real run (T14) prove that.
```

`docs/ARCHITECTURE.md` § Operations surface. Find the bullet with ``grep -n 'Not yet built\*\* (no cron config in `vercel.json`)' docs/ARCHITECTURE.md`` (it begins `- **Not yet built** (no cron config in \`vercel.json\`): the planned Vercel Cron **synthetic-lead** every 30 min…` and ends `…what each still waits on.`). Replace that whole bullet with:

```md
- `GET /api/cron/synthetic-lead` (T15, W172): `force-dynamic`, `Cache-Control: no-store`; the Vercel Cron target (`vercel.json` `crons`: daily on Hobby, every 30 minutes once Pro is on; Vercel runs crons only for the production deployment, so the schedule starts at the cutover). Guarded by `authorize(…, CRON_SECRET)` from `src/app/api/revalidate/auth.ts` (401 otherwise, an unset secret included). It posts T14's `smokeFields('hire', stamp)` (`scripts/door-smoke.lib.ts`) through `postForm`, with the `wst_…` test-class token put in the write-token slot (`testDoorEnv`; never the write token, so 503 without a call when it is missing). It answers 200 `{ data: { status, isTest } }`, 502 with the `postForm` kind when the door refuses, and 500 when the door answers `isTest: false`. **Not yet built:** its external heartbeat ping (no heartbeat URL exists yet; the route logs `[synthetic-lead] ok` instead) and the **daily digest** email (Phase B, `docs/pending/README.md`). The form path itself and the client submit-failure beacon (`POST /api/form-beacon`, D11; it feeds `formBeacons`) shipped in WP2a, and the Operations door is live. `docs/OPERATING.md` § Synthetic lead records the statuses and the schedule.
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write src/app/api/cron/synthetic-lead/run.ts src/app/api/cron/synthetic-lead/route.ts src/app/api/cron/synthetic-lead/run.test.ts src/forms/post.ts vercel.json docs/DEPLOYMENT.md docs/OPERATING.md docs/ARCHITECTURE.md
node -e 'const v = require("./vercel.json"); if (v.git.deploymentEnabled.main !== false) throw new Error("the main deploy guard changed"); console.log(JSON.stringify(v.crons))'   # [{"path":"/api/cron/synthetic-lead","schedule":"0 6 * * *"}]
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run src/app/api/cron/synthetic-lead/run.test.ts --maxWorkers=1   # 9 passed
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1   # the low-memory verify line
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cron/synthetic-lead/run.ts src/app/api/cron/synthetic-lead/route.ts src/app/api/cron/synthetic-lead/run.test.ts src/forms/post.ts vercel.json .env.example docs/DEPLOYMENT.md docs/OPERATING.md docs/ARCHITECTURE.md
git commit -m "feat(ops): synthetic-lead cron, one test-class hire through postForm, CRON_SECRET guard, daily schedule (T15, W172)

GET /api/cron/synthetic-lead answers 401 without the CRON_SECRET bearer, 503 without a call
unless OPS_WEBSITE_TEST_TOKEN is a wst_ token (never the write token), 502 or 500 when the door
refuses or answers isTest:false, and 200 { data: { status, isTest } }. The body is T14's
smokeFields('hire', stamp). vercel.json gains crons (0 6 * * * on Hobby, */30 once Pro is on)
and keeps git.deploymentEnabled.main:false untouched, so nothing runs before the cutover. No
heartbeat mechanism exists yet: the route logs and returns the door's status. The digest is
Phase B. Docs: DEPLOYMENT CRON_SECRET row, OPERATING synthetic lead, ARCHITECTURE operations
surface, .env.example.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

The controller proves the route once on `staging` after the push (Cycle 5 Step 6). Nothing here reaches production before the cutover.

---

- [ ] **Cycle 4 — The local capped-build proof (W126): every launch-profile check green before spending a preview run**

No new code in this cycle — the run **is** the test (a gate task has fewer code cycles and more run-and-record cycles than a page task; Cycles 4–6 therefore carry run/record steps instead of the red-green Steps 1–5). Its purpose is to catch a missing route/anchor/placeholder **before** burning a Vercel preview run and the Lighthouse/pixel budget on it.

- [ ] **Step 1: Preconditions**

```bash
git log --oneline -5   # Cycles 1–3 committed; HEAD includes every T1–T14 commit (W99: T15 runs last)
git status --porcelain # clean
```

- [ ] **Step 2: Confirm the launch-profile checks are reachable**

```bash
ls scripts/launch/{unbuilt-routes,dead-targets,route-coverage}.launch-check.ts   # all three present
node -e "console.log(require('./package.json').scripts['gate:launch'])"          # bash scripts/gate.sh --profile=launch
```

- [ ] **Step 3: One build, one start, one `gate:launch` — the W126 proof**

```bash
# The W21 route-coverage check first — pure source, no server; gate.sh's launch block does NOT run it
# (it runs only unbuilt-routes + dead-targets by name, pinned by scripts/gate.test.ts):
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --config vitest.launch.config.mts scripts/launch/route-coverage.launch-check.ts --maxWorkers=1 2>&1 | tee /tmp/route-coverage-local.log
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build   # ONE build (W126)
NODE_OPTIONS=--max-old-space-size=4096 npm run start &                    # background; note the PID
SERVER_PID=$!
# wait for :3000 to answer before gating it — a fixed sleep is unreliable on a loaded machine:
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/   # wait for the server without `sleep` (blocked in the agent's shell)
REVALIDATE_SECRET=<the value the server was started with, if any> \
  E2E_BASE_URL=http://localhost:3000 npm run gate:launch 2>&1 | tee /tmp/gate-launch-local.log
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/api/cron/synthetic-lead   # 401: Cycle 3's route is in this build and its W172 guard answers (no secret is sent; none needs configuring)
kill "$SERVER_PID"
pgrep -fl 'next start|next-server' || true   # confirm nothing stray survives
```

Expected tail of `gate:launch`'s three pre-Playwright checks (all three run to completion regardless of each other's result, per `scripts/gate.sh`'s own comment — "N6" — so all three print even if one is red):

```
gate: launch — W20: UNBUILT_PATHNAMES is empty
gate: launch — W152/W158: dead targets (internal hrefs, CTA anchors)
gate: launch — D26: content readiness
gate: launch — W20, dead targets and content readiness pass
```

then `npx playwright test` (both `mobile`/`desktop` projects — `workers: 1`, `fullyParallel: false`, already the file's own settings) — the Cycle 1 `route-coverage.launch-check.ts` is **not** part of `gate:launch` (it ran on its own in the first line of the block above; it reads only source, so its result does not change between hosts) — then the per-route Lighthouse loop against `lighthouserc.local.json` (identical to `lighthouserc.json` since W145 retired R50's waiver — every route is held to LCP ≤ 2,500 ms, performance ≥ 0.95, script ≤ 204,800 B, exactly as production), then `gate: OK` and the `js-size` table (diagnostic locally — W136).

**Stop-and-report rule.** T15 implements nothing page-shaped. If any of the four launch-profile checks (`UNBUILT_PATHNAMES`, dead targets, `route-coverage`, content readiness) is red, or Lighthouse fails a route on performance/LCP/script-size:

1. Read the failure message — every one of these checks names the exact route, anchor id, placeholder slot or script-size figure at fault.
2. Do **not** edit another task's page to fix it. This task never touches page source.
3. Identify which page task (T1–T13) or T14 owns the offending route/behaviour and record it as a blocking dependency in the readiness record (Cycle 6/7's open-items list) rather than silently patching around it.
4. Only once the owning task lands a follow-up commit does this cycle re-run. The lazy line follows the same rule, with W162's two figures. This LOCAL run stops and reports any route at or above **191,724 B**: the local trigger, 194,560 B minus the ≈ 2,836 B the preview's `js-size` runs above a local build. The binding preview run (Cycle 5) decides at **194,560 B**. A crossing means the W13 lazy pass ("a lazy-loading pass before the next page starts") was already due and did not happen. The controller schedules it with W162's pre-approved levers, and never as a page-local trigger on a CTA-target form (W163). T15 does not add it retroactively.

- [ ] **Step 4: Record**

Note the local figures (route, script bytes, LCP ms, performance) for cross-reference against the binding preview figures in Cycle 5 — a large gap between the two (beyond the ~2–3 KB edge-vs-local difference `docs/superpowers/handoff-2026-09-25/wp2a-sdd/progress.md` records as normal, e.g. 176,132 B local vs 178,968 B binding on `/` at the WP2a-only baseline — the ≈ 2,836 B offset W162 builds the 191,724 B local trigger from) is itself a finding to note, not a defect to chase here.

- [ ] **Step 5: No commit**

This cycle produces no file changes — it is the gate before spending the preview budget in Cycle 5. If every check is green, proceed. Its output feeds the readiness record written in Cycle 7.

---

- [ ] **Cycle 5 — The binding preview run: `gate:launch` green against a READY Vercel deployment, per-route measurements**

Controller-driven (needs the owner's `VERCEL_AUTOMATION_BYPASS_SECRET` from `ACCESS.md` and, per W92, the `staging` branch fast-forwarded to `wp2/foundation`'s HEAD only if any door-aware spec needs it — T15's own launch-profile checks need no door). The implementer never pushes: the controller pushes `wp2/foundation` once Cycle 4 is green and names the resulting deployment. This is the run `docs/WEBSITE-HANDOFF.md` §3.2 already records the shape of for WP2a (deployment `02ace58`); this cycle produces the equivalent record for the completed WP2b branch.

- [ ] **Step 1: Confirm the target deployment is READY — never trust a raw HTTP 200**

`docs/superpowers/handoff-2026-09-25/wp2a-sdd/progress.md` (line 108) records the exact failure mode this step exists to avoid, verbatim: *"A second run against the `02ace58` URL hit Vercel's BUILDING placeholder (HTTP 200 even with the bypass header) and produced 22 bogus failures — lesson recorded: check the deployment state via the API, never HTTP 200."* A Vercel deployment mid-build answers every path with a 200 placeholder page, bypass header or not — a `curl` 200 check alone proves nothing.

```
# Vercel MCP (or `vercel inspect <url>` / the dashboard) — confirm state: READY, not BUILDING/QUEUED,
# for the deployment this run targets, before running anything against it:
#   list_deployments (filter: project jobsadmirewebsite, branch wp2/foundation) → the target's id
#   get_deployment <id> → state must be READY
```

- [ ] **Step 2: Export the secret for this run only**

```bash
export VERCEL_AUTOMATION_BYPASS_SECRET=<from the owner's ACCESS.md — never printed, never committed>
export E2E_BASE_URL=https://<the READY jobsadmirewebsite-* preview URL>
```

- [ ] **Step 3: The binding run**

```bash
npm run gate:launch 2>&1 | tee /tmp/gate-launch-preview.log
```

Expected shape (mirroring `progress.md`'s own binding-run record exactly — copy this shape into Cycle 7's ledger line, substituting the real numbers this run produces):

```
gate: launch — W20, dead targets and content readiness pass
gate: OK — Playwright <n> passed / <m> skipped (the ops-token refusal cases, 401|503 — W139)
gate-routes <either the live /kariyer/<slug> + /en/careers/<slug> pair, or
             "detail rows skipped (door not configured)" if OPS_API_URL is unset for this preview>
Lighthouse (lighthouserc.preview.json, DevTools throttling, 3 runs, median) on every indexable
  route: every assertion passed — perf ≥ 0.95, a11y/bp/seo = 1, LCP ≤ 2,500 ms, script ≤ 204,800 B
```

If `gate-routes` printed `detail rows skipped (door not configured)` (every door-less preview, W92), the careers detail pair is evidenced by T11's mock-door run (`npm run careers:door` + `npm run e2e:careers`, W93/W112) as recorded in T11's ledger row — T15 cites that row and does not rebuild against the fixture door (W126: one build per task).

If `gate:launch` is red, apply Cycle 4's stop-and-report rule identically — this is the same profile, a different host.

- [ ] **Step 4: The per-route JS-size table and Lighthouse triples**

```bash
npm run js-size | tee /tmp/js-size-preview.md         # per-route table from the run's .lighthouseci
node -e '
const m = require("./lighthouse-report/manifest.json");
for (const r of m) {
  console.log(`${new URL(r.url).pathname} perf ${r.summary.performance} a11y ${r.summary.accessibility} bp ${r.summary["best-practices"]} seo ${r.summary.seo}`);
}
' | sort -u | tee /tmp/triples-preview.txt
```

`npm run js-size`'s table columns (verified directly in `scripts/js-size.mjs`'s `formatJsSizeTable`): `| route | script B (worst of 3 runs) | headroom to 204,800 | LCP ms (median) | perf (median) | note |` — the "note" column is empty unless a route is over the 194,560 B lazy line (W13 amended) or over the ceiling; **the figure this run produces is the binding one for the ledger (W136)** — the local Cycle 4 numbers were diagnostic only. On this binding run 194,560 B is W162's deciding figure (the local Cycle 4 run was held to 191,724 B); a route at or above it follows Cycle 4's stop-and-report rule.

- [ ] **Step 5: Delete the report folders**

```bash
rm -rf .lighthouseci lighthouse-report test-results
# keep VERCEL_AUTOMATION_BYPASS_SECRET and E2E_BASE_URL exported — Cycle 6 runs against the same
# preview and unsets them at its end
```

`docs/DEPLOYMENT.md`'s `VERCEL_AUTOMATION_BYPASS_SECRET` row (verified directly) is explicit that these three git-ignored folders hold the secret verbatim after a preview run (Lighthouse stores request headers; Playwright's `trace: 'retain-on-failure'` does too on any failing run) — never share, upload or commit them; delete between any two runs against different targets.

- [ ] **Step 6 (controller): prove the synthetic lead once on `staging` (W172)**

Vercel runs crons only for the production deployment, and production stays the frozen old-site deployment until WP7a removes the `main` guards, so Cycle 3's schedule cannot run before the cutover. The controller proves the route ONCE by hand against the `staging` deployment instead. Use a separate shell: the Cycle 5 shell keeps its two variables for Cycle 6.

Preconditions (controller or owner, Vercel project settings → Environment Variables, Preview scope limited to the `staging` branch): `CRON_SECRET` (a fresh random value of 16+ characters), `OPS_WEBSITE_TEST_TOKEN` (the `wst_…` test token from `ACCESS.md`, never the `wsw_…` write token) and `OPS_API_URL`. Then fast-forward `staging` to the pushed head (`git branch -f staging origin/wp2/foundation && git push origin staging`, T14's pattern) and confirm that deployment READY through the API, as in Step 1 (never a raw HTTP 200). Then:

```bash
export VERCEL_AUTOMATION_BYPASS_SECRET=<from the owner's ACCESS.md — never printed, never committed>
export CRON_SECRET=<the value just set on staging's Preview scope — never printed, never committed>
STAGING=https://staging.jobsadmire.com
# the guard: no secret → 401, nothing posted
curl -s -o /dev/null -w '%{http_code}\n' -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" "$STAGING/api/cron/synthetic-lead"
# the proof: exactly the request Vercel Cron sends
curl -s -w '\n%{http_code}\n' -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" -H "Authorization: Bearer $CRON_SECRET" "$STAGING/api/cron/synthetic-lead"
unset VERCEL_AUTOMATION_BYPASS_SECRET CRON_SECRET
```

Expected: `401`, then the body `{"data":{"status":"HANDLED","isTest":true}}` (or `"RECEIVED"`) and `200`. The Ops inbox shows one `hire` row under the _test_ filter named `[door-smoke cron-<stamp>]` (a dry run: no Inquiry, no mail). Record the date, both HTTP codes and the door status for Gate A row 8 in the readiness record (Cycle 7). A `503` means the staging scope lacks `OPS_API_URL` or a `wst_…` `OPS_WEBSITE_TEST_TOKEN`; a `502` carries the `postForm` kind. Fix the environment, never the route, redeploy `staging` and re-run once. If it is still not `200`, row 8 reads `open` and the controller reports it. The same two variables go into the Production scope before the cutover (a WP7a step), so the first scheduled run after the cutover finds them.

No commit — Step 4's tables and Step 6's result feed Cycle 7's ledger line and the readiness record; nothing here is a file change to this repo.

---

- [ ] **Cycle 6 — Legacy sweep on the preview, the D27 pixel scores, the placeholder/MLC reconciliation, the open-items list**

Same preview, same exported secret as Cycle 5 (re-confirm the deployment is still READY — Step 1's check does not expire, but a long gap between cycles is worth a second look; if the shell was closed in between, re-export both variables as in Cycle 5 Step 2). When Step 3 is done: `rm -rf lighthouse-report && unset VERCEL_AUTOMATION_BYPASS_SECRET E2E_BASE_URL`.

- [ ] **Step 1: The legacy sweep, against the preview**

```bash
npm run sweep:legacy 2>&1 | tee /tmp/sweep-legacy-preview.md
```

Expected: 22 `ok` rows (20 redirects + 2 keep). Paste the printed table verbatim into the readiness record (Cycle 7). If a Vercel Firewall challenge interferes (see Cycle 2's contingency), paste both tables (spoofed UA + browser UA) and record the finding — do not treat it as a sweep failure once the browser-UA re-run confirms the redirect layer itself is correct.

- [ ] **Step 2: The D27 pixel harness — the four nominated pages, both locales**

```bash
for p in home hire calc blog-article; do
  for l in tr en; do
    npm run pixel -- --page=$p --locale=$l --base="$E2E_BASE_URL" || echo "pixel: $p $l exited $? (see W138 — a page with no body in this locale is a clean skip, not a failure)"
  done
done
node -e '
// report.json merges every run ever made into one object keyed "<page>-<locale>" — keep only the
// rows of this preview; match is already a percentage (comparePngs rounds to 2 decimals), never x100.
const base = process.env.E2E_BASE_URL.replace(/\/$/, "");
const r = require("./.pixel/report.json");
for (const [k, v] of Object.entries(r)) {
  if (v.base !== base) continue;
  console.log(k, v.route, v.results.map((x) => `${x.width}:${x.match.toFixed(2)}%`).join(" "));
}
' | tee /tmp/pixel-preview.txt
```

Expected: **7 scored rows, not 8** — `blog-article`/`tr` is a clean, intentional skip (exit 0, "nothing scored"): `resolvePixelRoute`/`pixelTarget` in `scripts/pixel-compare.ts` require a written blog body in the requested locale, and W4 keeps the Turkish body count at zero at Gate A (confirmed directly: `docs/superpowers/handoff-2026-09-25/wp2-planning/wp2b/check.md`'s `route_and_gate_gaps` finding names this exact case). Do not treat the eighth invocation's skip as a defect.

**T15 spends no new pixel iteration.** Each of T1 (home), T2 (hire), T3 (calc) and T12 (blog-article) already ran its own two-iteration cap (`docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`) during its own port — this run is the **binding confirmation against the preview**, the same relationship the local-vs-preview split has for js-size (W136). It also re-proves `hire` and `calc` after T5's global `scroll-padding-bottom`, which landed after T2–T4's own pixel proofs (W178). If a preview score differs meaningfully from the page task's own recorded local score, that is a finding to report (per Cycle 4's stop-and-report rule), never a defect T15 fixes itself — a third run needs a controller ruling per the pixel-harness doc's own rule 3.

Ledger row format (verbatim from `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` rule 4 — use this shape exactly, one row per page/locale, pulling the "run N of 2" and the lettered deltas from that page task's own ledger line, never invented here):

```
pixel <page> <locale>: 390 → NN.NN %, 900 → NN.NN %, 1440 → NN.NN %; run 2 of 2 (confirmed on preview, T15); deltas: (a) …; (b) …; (c) …; (d) accepted: …
```

- [ ] **Step 3: The placeholder counter's table, reconciled against D26 + spec §10**

`gate:launch`'s own D26 check (Cycle 5, Step 3) printed the table into `/tmp/gate-launch-preview.log` (its `lighthouse-report/content-readiness.json` was deleted by Cycle 5 Step 5) — re-run it in isolation against the same preview:

```bash
E2E_BASE_URL="$E2E_BASE_URL" npx tsx scripts/placeholder-count.ts | tee /tmp/content-readiness-preview.md
```

The real table's columns (verified directly in `scripts/placeholder-count.ts`'s `formatReadinessTable`): `| route | status | placeholders | slots | LCP slot | verdict |`. Reconcile its `slots` column, row by row, against the expected inventory below — the counter's **actual** output is the source of truth; this table is the reconciliation key, built from spec §10 (quoted in full at the top of this task) and D26's Minimum Launchable Content list (also quoted in full above).

**Expected placeholder inventory at Gate A:**

| Route pair | LCP slot | Expected `data-placeholder` slots | §10 row → owner | Launch-blocking under D26? |
| --- | --- | --- | --- | --- |
| `/` · `/en` | `h1` | `v4-hero`, `portal-shortlist`, `portal-mobile-app`; `founder-photo` only once a founder is published (T1 renders the founder card only then — W6/§10 row 3; one slot name everywhere — W176); `blog-cover-<key>` only once `blogNavVisible` (W4 — zero today) | #4 hero photography → owner; spec's own auto-default is a **licensed stock pack** for this exact slot (spec §10 row 4: "licensed stock pack for the two heroes; gradients elsewhere"); the portal screens have no §10 row → owner ask | **`v4-hero`: yes — BLOCKING for Gate A (W174)** — D26's Minimum Launchable Content names "licensed stock or real photos for the Homepage and Hire Workers hero slots" explicitly, so the gradient fallback (`ImageSlot` with no `src`; LCP stays `h1`) does not satisfy row 1 for this slot; the portal screens: no |
| `/isci-talebi` · `/en/hire-workers` | `h1` | `hw-hero`, `portal-shortlist`, `portal-mobile-app` | #4 (hero, same stock-pack default as above); the two portal screenshots have no §10 row → owner ask (product screenshots, consented) | **`hw-hero`: yes — BLOCKING for Gate A (W174)** (D26, as above); the portal screens: no |
| `/maliyet-hesaplayici` · `/en/hiring-cost-calculator` | `h1` | `calc-hero` | #4 "gradients elsewhere" → none | no |
| `/calisma-izni` · `/en/work-permit` | `h1` | `wp-hero` | #4 → none | no |
| `/ortak-olun` · `/en/partner-with-us` | `h1` | `partner-portal-screen`, `partner-portal-mobile` | no §10 row → owner ask (portal screenshots) | no |
| `/hakkimizda` · `/en/about` | `h1` | `office-photo`, `crm-dashboard`, `app-screen`, `antalya-office`, `karachi-office`, `licence-pdf-iskur-permit`, `licence-pdf-iskur-annex`, `licence-pdf-oib-certificate`, `licence-pdf-oib-annex`, `licence-pdf-company-profile`; `founder-photo` only once a founder is published (T6's own inventory) | #3 founder/office photo + licence PDFs → owner | **yes** — D26 names "the four İŞKUR/ÖİB licence PDFs republished at `/hakkimizda#lisans`" and "one real founder/office photograph" explicitly; the four `licence-pdf-{iskur-permit,iskur-annex,oib-certificate,oib-annex}` rows and at least one of `office-photo`/`founder-photo` must be real before this row reads "yes" (`licence-pdf-company-profile` is a fifth document D26 does not name — open, not blocking) |
| `/iletisim` · `/en/contact` | `h1` | `contact-hero` | #4 → none | no |
| `/adaylar` · `/en/available-workers` | `h1` | `aw-hero` | #4 → none | no |
| `/basari-hikayeleri` · `/en/success-stories` | `h1` | `ss-hero` | #4 → none | no |
| `/temsilci-dogrulama` · `/en/verify` | `h1` | `founder-photo` (W176) | #3 → owner (strip hidden by W6; zero rendered is also a correct reading if the whole component is conditionally hidden) | no |
| `/kariyer` · `/en/careers` (+ one live detail pair per W93, or "door not configured" — never a hard-coded slug) | `h1` | none expected (live Ops data, no photo slots) | — | — |
| `/blog` · `/en/blog` (+ the one EN article) | `h1` | `blog-hero` on the index; `blog-cover-<key>` per rendered `PostCard` teaser on the index AND on the article's own cover (W103 — the same asset naming convention both places, one row today: the EN article) | #5 blog bodies → marketing | no (noindex, W4) |
| `/portal-girisi` · `/en/portal-login` | `h1` | none expected (W8 link-only chooser) | — | — |
| `/gizlilik`, `/kullanim-kosullari`, `/kvkk`, `/cerez-politikasi` (+ `/en/…`) | `h1` | T13's named notices: `legal-terms-tr` (`/kullanim-kosullari` only — the EN Terms on the TR route), `legal-kvkk` (`/kvkk`, `/en/kvkk`), `legal-cookie-policy` (`/cerez-politikasi`, `/en/cookie-policy`); none on Privacy | #6 counsel → owner | **cookie notice: yes** (D26 MLC names "Privacy/Terms + cookie notice" explicitly); KVKK: no, if the minimal placeholder notice is what ships in Phase A (spec §10 row 6's own auto-default) |
| `/tesekkurler?form=hire` · `/en/thank-you?form=hire`, `/abone-onay`, `/abonelikten-cik` (+ `/en/…`) | `h1` | none | — | — |

Record, per row, the counter's **actual** count next to this expected one, and the launch-blocking verdict. Any slot the real table lists that is **not** in this expected set is either a placeholder a page task added without naming it in its own docs (add it here, noting which §10 row it belongs to) or an unnamed leak — `evaluateScan` already fails the run for an unnamed `data-placeholder` (W55), so a genuinely unnamed one would already have failed Cycle 5, not reached this reconciliation step.

- [ ] **Step 4: The open-items list**

Compiled from Step 3's launch-blocking column plus the Gate A checklist rows that are never a code artefact:

1. **Licence PDFs (×4) and one real founder/office photo** — D26 MLC, blocking (owner).
2. **Minimal cookie notice text** — D26 MLC, blocking (owner/counsel).
3. **Hero photography for Homepage + Hire Workers (`v4-hero`, `hw-hero`) — BLOCKING for Gate A (W174)** (owner): D26 names "licensed stock or real photos for the Homepage and Hire Workers hero slots", and spec §10 row 4's auto-default is a licensed stock pack that was never sourced. **"Source the licensed hero stock pack"** is on the owner's WP-C list, **decide-by: the content freeze**. A gradient on these two slots does not satisfy Gate A row 1. Every OTHER hero slot does default to a gradient, and every other placeholder stays non-blocking (`data-placeholder`). The placeholder counter cannot see these two (the LCP slot is the `h1`), so this row is checked by eye on the preview.
4. **Expected-loss forecast** (Gate A checklist item 2) — `docs/redirects.md`'s own "Expected-loss forecast" section (verified directly) is still a placeholder pending the WP0 GSC export (`redirects/gsc-clicks.csv`, 11 bytes = header only, verified directly); this task does not fabricate a forecast (W178).
5. **Site-health drill** (Gate A checklist item 7) — an owner-run rehearsal with the external monitor; `/api/site-health` itself already answers correctly (Cycle 5's run proves it), the drill proves the human/monitor wiring, not the code. The external uptime monitor itself is "NOT set up yet" per `docs/WEBSITE-HANDOFF.md` §3.3 — setting it up is the drill's precondition (owner). New `docs/OPERATING.md` § Site-health drill (Cycle 7) gives the owner the three-step procedure.
6. **Synthetic lead** (Gate A checklist item 8, W172) — **built, proven once on staging, scheduled from the cutover**: Cycle 3's route and `vercel.json` cron, and the controller's one manual run (Cycle 5 Step 6; record its date, HTTP codes and door status). Vercel runs crons only for the production deployment, so the first scheduled run follows the WP7a cutover, and `CRON_SECRET` + `OPS_WEBSITE_TEST_TOKEN` must be in the Production scope by then (owner/controller). The schedule is daily on Hobby; it moves to `*/30 * * * *` once Pro is on. Its heartbeat ping is not wired, because no heartbeat URL exists until the external monitor (item 5) issues one; a follow-up adds it. If Cycle 5 Step 6 did not return `200`, this row reads `open`. **The digest** (I19) is out of WP2: it is Phase B, and its `docs/pending/README.md` line comes with the controller's W173 docs commit (T15 does not edit `docs/pending/`).
7. **Second human receiving** (Gate A checklist item 9) — **configured**: `docs/WEBSITE-HANDOFF.md` §3.1 records a second alert recipient saved on the Ops Integrations screen (verified directly; recorded here without the name or e-mail). **Receiving** is proven only by the real-lead run's second-human copy (§3.1's open proof H2, T14's owner-gated real run) — cite T14's ledger line; until it records the copy arriving, this row stays open.
8. **The remaining D26 MLC rows that are not placeholder slots** (Gate A row 1 — "present or auto-defaulted"): the 3,505 strings with the legal-review rows imported as APPROVE (the `legal: true` rows of `src/lib/calculator/copy-deltas.ts` are part of that list — W142), signed headline metrics or the spec §10 row 2 auto-defaults, the 2026 rate config signed (§10 row 7). Record each as present / auto-defaulted / open with its owner; and §10 row 9 (Ads final URLs "re-pointed at Gate A") as an owner action at Gate A.
9. **Forms end to end on staging with real Turnstile** and **13–15 forms → exactly one `generate_lead` + one submission** (Gate A checklist items 4–5) — T14's own ledger lines are the evidence; T15 references them, does not re-run T14's proof.
10. **GA4 web stream: redact the `token` query parameter** (Gate A owner checklist, W175): the newsletter confirm/unsubscribe links carry a per-subscriber secret in `page_location`. GA4 Admin → Data streams → the web stream → Redact data → query parameters: `token`. Owner action at Gate A, not blocking the code.
11. **Thank-you page width (accepted D20 delta, W178):** the thank-you page's `container-site max-w-[720px]` never applies, because the unlayered `container-site` CSS wins over the utility. Recorded here as accepted and not fixed in WP2.
12. **T10's v1.1 register backlog (D9 v1.1 / Phase B, W178):** the Operations `WebsiteRepresentative` model with its consent record and stable `JA-` ids; a `representatives` schema in the bundle; the `no-store` record handler with `qrSvg`; the May-do / May-never lists; the `verified` / `not_found` outcomes. This backlog is written into `docs/pending/` at Gate A (by the controller, with the Gate A decision). T15 lists it here and in the readiness record and does not edit `docs/pending/`.

Nothing above is invented by this task: every blocking item traces to a named D26/§10 row, a named Gate A checklist item or a ruling (W172, W174, W175, W178), and every non-blocking item is recorded as such rather than silently upgraded to "done."

No commit for this cycle — Steps 1–4 are the evidence Cycle 7 writes down.

---

- [ ] **Cycle 7 — The readiness record: `docs/WEBSITE-HANDOFF.md`, `docs/OPERATING.md`, the cited rulings, the ledger line**

Doc scope for this cycle is deliberately narrow (see the opening note): `docs/WEBSITE-HANDOFF.md` §1/§3.2/§5, `docs/OPERATING.md` only where an owner check changed, and the WP2b ledger. The ruling log is read and cited, never appended (W178). Cycle 3 already carried the synthetic lead's docs (W172: `docs/DEPLOYMENT.md` § Environment variables, `docs/OPERATING.md` § Synthetic lead, `docs/ARCHITECTURE.md` § Operations surface, `.env.example`). The two-project text in `docs/DEPLOYMENT.md`, `CLAUDE.md` and `docs/ARCHITECTURE.md` § Environments is the W173 docs commit's, already landed. Never `docs/PRD.md`/`SEO.md`/`CONTENT-MODEL.md`/`ANALYTICS.md`/`redirects.md`/`docs/pending/` here: each is already current (verified directly), another task's standing obligation, or the controller's (see Foundation gaps).

- [ ] **Step 1: Write the failing check**

```bash
grep -c "Gate A readiness record" docs/WEBSITE-HANDOFF.md docs/superpowers/plans/2026-09-20-wp2b-pages.md   # 0 and 0
grep -n "pending §10 item 10" docs/OPERATING.md                          # prints its line
grep -n "^## Site-health drill" docs/OPERATING.md                        # prints nothing (section absent)
```

- [ ] **Step 2: Run to verify it fails**

Each grep behaves as noted above today.

- [ ] **Step 3: Implement**

**`docs/WEBSITE-HANDOFF.md`**

- §1 table, the row whose first cell is `WP2b` (find with `grep -n '^| WP2b '`) — replace its State cell (whatever it reads by then — the controller keeps it current) with:

  `T1–T15 executed on \`wp2/foundation\`; Gate A readiness record <date> — §3.2 (binding launch-profile run) and the T15 row + Gate A checklist in \`docs/superpowers/plans/2026-09-20-wp2b-pages.md\``

- §1 table, the row whose first cell is `Gate A / WP7a` (find with `grep -n '^| Gate A / WP7a '`) — replace the What cell (today "Launch checklist + domain cutover"):

  `Launch checklist (spec §5) + cutover (the two `main` deploy guards on the one Vercel project — §3.2, never a domain move)`

- §3.2, immediately after the existing bullet beginning `**Binding preview gate (2026-09-29, deployment `02ace58`…)`** (find with `grep -n 'Binding preview gate'`) — append a new bullet (fill every `<…>` from Cycles 4–6's real output; never invent a number):

  ```md
  - **Binding WP2b launch-profile preview gate (<date>, deployment `<id>`):** `gate:launch` OK — every route in `GATE_ROUTE_TABLE` swept in both locales (`UNBUILT_PATHNAMES` empty, the W152/W158 dead-target + CTA-anchor sweep green, the W21 route-coverage check green — Task 15); js-size (binding, worst of 3) <worst route> <bytes> B (headroom <n> B to 204,800); LCP median <range> ms; performance <min>; `npm run sweep:legacy` <n>/20 single-hop + 2 keep, no 429; pixel home/hire/calc/blog-article tr+en — 7 of 8 scored (`blog-article`/`tr` a clean W4/W138 skip). Open items and the full per-route tables: `docs/superpowers/plans/2026-09-20-wp2b-pages.md`, T15 ledger row.
  ```

- §5, current step 7 (find with `grep -n '\*\*Gate A → WP7a'`) — append one sentence to the end of the existing paragraph (the rest of the step is already accurate — verified directly, including "moves the domains only if a second project was used (not the case now)"):

  `The Gate A readiness record itself (checklist status with a "how verified" column, the open-items list, the launch-profile evidence) is Task 15's output — §3.2 above and the T15 row + § Gate A readiness record in \`docs/superpowers/plans/2026-09-20-wp2b-pages.md\`.`

**`docs/OPERATING.md`**

- § External monitor and second human (find with `grep -n 'pending §10 item 10'`) — replace the parenthetical:

  `(configured on the Operations Integrations screen — §10 item 10 closed; the recipient's contact details live only in the Operations notification seed, never in this repo or its docs)`

- New section inserted immediately after § External monitor and second human, before § Weekly five-minute owner check (find the boundary with `grep -n '^## Weekly five-minute owner check'`):

  ```md
  ## Site-health drill (Gate A checklist item 7)

  Run once before Gate A, by the owner, with the external monitor armed: (1) point the monitor at
  a URL that fails — a preview with a misconfigured adapter, or the Operations door flipped off —
  and confirm the phone rings within the monitor's interval; (2) on Operations, flip a form off in
  the Integrations screen and confirm the second human also receives the
  `WEBSITE_FORMS_UNAVAILABLE` notification (T14 exercises the same delivery path in its own proof);
  (3) restore both and confirm the all-clear. Record the date, the interval and who was paged in
  the WP2b ledger. This section names the checks the drill rehearses; `/api/site-health`'s own
  contract (what each field means) is documented above, in § Site-health checks.
  ```

- § Weekly five-minute owner check (find with `grep -n '^## Weekly five-minute owner check'`) — append one sentence to the existing paragraph:

  `At Gate A, add a sixth check: \`npm run sweep:legacy\` against production is clean (a \`FAIL\` row is a redirect regression) — a one-minute run, worth doing after any change that touches \`redirects/\` or \`next.config.ts\`'s redirect list.`

**`docs/superpowers/plans/2026-09-20-wp2-rulings.md` — read, never appended.** This file's task-scoped labels were ruled in the controller's W162+ round (W178), and T15 cites the assigned numbers: the synthetic lead → **W172**; the one Vercel project and the deploy-doc correction → **W173** (the W173 docs commit, already on `wp2/foundation`); the hero photos and the launch-blocking placeholder set → **W174**; the expected-loss forecast staying an owner item, the Firewall-challenge contingency and the route-coverage check → **W178**. **Guard:** `grep -n '^- \*\*W17[2-8] ' docs/superpowers/plans/2026-09-20-wp2-rulings.md` must print the W172, W173, W174 and W178 lines. If any is missing, stop and report; T15 appends nothing to the ruling log under any label.

**`docs/superpowers/plans/2026-09-20-wp2b-pages.md`** — append the T15 row to the `## Ledger` table (created by T1 per W98; by W99 every earlier task's row is already there):

```md
| T15 Gate A prep | — (sweeps every route, adds no page) | js-size (binding, worst of 3): <worst route> <n> B (ceiling 204,800, lazy line 194,560 binding / 191,724 local trigger — W162; every route under ceiling) | LH mobile, median of 3, DevTools throttling: perf ≥ <min> across indexable routes · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP ≤ <max> ms | pixel home/hire/calc/blog-article tr+en, 7 of 8 scored (blog-article/tr skipped, W4/W138); run 2 of 2 (preview-confirmed, no new iteration spent) | <YYYY-MM-DD> |
```

Then, after the `## Ledger` table, append the Gate A checklist (spec §5, one row per item, the "how verified" column the brief asks for; fill every `<…>` from Cycles 4–6, write `open` or `no` honestly — never upgrade an item to `yes` without its evidence):

```md
## Gate A readiness record (T15, <YYYY-MM-DD>)

| # | Spec §5 checklist item | Status (yes / no / open) | How verified (evidence) |
| --- | --- | --- | --- |
| 1 | Minimum Launchable Content present or auto-defaulted | <…> | `placeholder-count` table on the preview (Cycle 6 Step 3) reconciled against D26 + spec §10; blocking slots: licence-pdf ×4, one office/founder photo, `v4-hero` + `hw-hero` (W174 — the stock pack, decide-by the content freeze), cookie notice; strings/legal review, metrics, rate config per Cycle 6 Step 4 item 8 |
| 2 | Expected-loss forecast signed | <…> | `docs/redirects.md` § Expected-loss forecast (GSC export pending — W178) |
| 3 | `gate --profile=launch` green on every page | <…> | binding `gate:launch` on deployment `<id>` (Cycle 5) + `route-coverage.launch-check.ts` (Cycle 4); careers detail per W93/W112 |
| 4 | Forms create inquiries end to end on `staging.jobsadmire.com` with real Turnstile | <…> | T14's ledger line (real-lead run) |
| 5 | All 13–15 forms → exactly one `generate_lead` and one submission | <…> | T14's ledger line (`FORM_INSTANCES`, `ConversionPing`) |
| 6 | Googlebot curl sweep of 20 legacy URLs → single-hop 308/410, no 429 | <…> | `npm run sweep:legacy` table on the preview (Cycle 6 Step 1) |
| 7 | Site-health checks each broken deliberately → phone rings | <…> | owner drill per `docs/OPERATING.md` § Site-health drill (external monitor set up first) |
| 8 | Synthetic lead and digest running | built, proven once on staging, scheduled from the cutover (W172) — or `open` if Cycle 5 Step 6 did not return 200 | `/api/cron/synthetic-lead` + `vercel.json` `crons` (Cycle 3); the controller's one manual run on `staging`, <date>: 401 without the secret, 200 `{ data: { status: <…>, isTest: true } }` with it (Cycle 5 Step 6); Vercel runs crons only on the production deployment, so the schedule starts at the WP7a cutover (daily on Hobby, `*/30 * * * *` once Pro is on); heartbeat ping not wired (no heartbeat URL yet); the digest (I19) is Phase B, `docs/pending/README.md` (W172) |
| 9 | Second human receiving | <…> | configured (`docs/WEBSITE-HANDOFF.md` §3.1); receipt per T14's real-lead run (H2) |

**Gate A owner checklist** (from Cycle 6 Step 4; mark each done or open, with its owner):

- Licence PDFs ×4 and one real office/founder photo (D26) — <…>
- Cookie notice text (D26) — <…>
- Source the licensed hero stock pack for `v4-hero` + `hw-hero` (W174, BLOCKING; decide-by the content freeze) — <…>
- Expected-loss forecast signed (the WP0 GSC export) — <…>
- Site-health drill with the external monitor armed — <…>
- GA4 web stream: redact the `token` query parameter (W175) — <…>
- `CRON_SECRET` + `OPS_WEBSITE_TEST_TOKEN` in the Production scope before the cutover; the monitor's heartbeat URL for the synthetic lead (W172) — <…>
- §10 row 9: Ads final URLs re-pointed — <…>

**Recorded, not blocking (W178):** the thank-you page's `container-site max-w-[720px]` never applies (unlayered CSS), an accepted D20 delta; T10's v1.1 register backlog (D9 v1.1 / Phase B: the Operations `WebsiteRepresentative` model + consent + stable `JA-` ids, a `representatives` schema, the `no-store` record handler with `qrSvg`, the May-do / May-never lists, the `verified` / `not_found` outcomes), written into `docs/pending/` at Gate A by the controller.
```

**Memory line** (the brief's "memory line text" — the implementer writes nothing outside the repo; hand this paragraph to the controller, who appends it to the programme's resume note `website-programme-resume-2026-09-26.md` in the session memory and updates its `MEMORY.md` index line) — no secrets, no personal data:

```
**<date> — WP2b T15 (Gate A prep) executed.** wp2/foundation <head sha>: route-coverage
launch-check + `npm run sweep:legacy` added; local W126 proof and the binding preview run
(deployment <id>) — gate:launch <OK|red: …>, js-size worst <route> <n> B, LCP median <range> ms,
perf ≥ <min>; sweep:legacy <n>/20 single-hop + 2 keep; pixel 7 of 8 scored. Gate A checklist
(wp2b-pages.md § Gate A readiness record): yes <list>, open <list — e.g. licence PDFs, office/
founder photo, hero photos (W174), cookie notice, expected-loss forecast, site-health drill,
GA4 token redaction (W175)>. Synthetic lead: built, proven once on staging <date>, scheduled from
the cutover (W172); digest Phase B. The Vercel project is jobsadmirewebsite (one project, W173);
the cutover (WP7a) removes the two main guards, no domain move. Next: owner items above → Gate A
decision → WP7a.
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write docs/WEBSITE-HANDOFF.md docs/OPERATING.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git diff --quiet docs/superpowers/plans/2026-09-20-wp2-rulings.md && echo "ruling log untouched"   # W178: read, never appended
grep -c "Gate A readiness record" docs/WEBSITE-HANDOFF.md docs/superpowers/plans/2026-09-20-wp2b-pages.md   # ≥ 1 in each
grep -n "pending §10 item 10" docs/OPERATING.md                   # prints nothing
grep -n "^## Site-health drill" docs/OPERATING.md                 # prints its new heading
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1   # the low-memory verify line; unaffected, still green
```

- [ ] **Step 5: Commit**

```bash
git add docs/WEBSITE-HANDOFF.md docs/OPERATING.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(gate-a): Gate A readiness record — WEBSITE-HANDOFF status + binding run, OPERATING second-human/drill/weekly-check, WP2b ledger + Gate A checklist and owner checklist (T15)

Cites the ruled numbers instead of appending to the ruling log: W172 (synthetic lead built,
proven once on staging, scheduled from the cutover), W173 (one Vercel project; the W173 docs
commit), W174 (hero photos block Gate A), W175 (GA4 token redaction), W178 (forecast, Firewall
contingency, route coverage, accepted deltas, T10 v1.1 backlog).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Do not push (the controller pushes `wp2/foundation`; previews only — `main` is still the live project's production branch until WP7a removes the two guards; nothing here touches `main`). Hand the controller the Gate A checklist with its open rows and the memory line above.

---

**Docs in this task:**
- Cycle 3 (W172, in the cron commit): `docs/DEPLOYMENT.md` § Environment variables (the `CRON_SECRET` row); `docs/OPERATING.md` § Synthetic lead (the built route, its statuses, the Hobby/Pro schedule, the heartbeat not yet wired, T14's `npm run door:smoke` probe kept); `docs/ARCHITECTURE.md` § Operations surface (the "Not yet built" cron bullet becomes the route's description; the digest stays not built, Phase B); `.env.example` (`CRON_SECRET=` with its comment); the `PostFormDeps` doc comment in `src/forms/post.ts`.
- `docs/WEBSITE-HANDOFF.md` — §1 table (WP2b row's real reconcile/execution state; the Gate A/WP7a row's "domain cutover" wording corrected to match what §3.2/§5 already say elsewhere in the same file); §3.2 (new binding-WP2b-launch-profile-gate bullet, same shape as the existing WP2a one); §5 step 7 (one added sentence pointing at the readiness record).
- `docs/OPERATING.md` — second-human parenthetical closed; new § Site-health drill; § Weekly five-minute owner check gains the `sweep:legacy` line.
- `docs/superpowers/plans/2026-09-20-wp2-rulings.md` — **read, never appended** (W178): T15 cites W172 (synthetic lead), W173 (deploy docs), W174 (hero photos) and W178 (the rest); Cycle 7's guard confirms they exist.
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T15 ledger row (W98 format) and the new `## Gate A readiness record` (spec §5 checklist, status + "how verified" per row; the Gate A owner checklist with the W174 stock pack and the W175 GA4 redaction; the W178 recorded items).
- Memory: one status paragraph handed to the controller (the implementer writes nothing outside the repo).
- **Explicitly not touched, and why:** `docs/PRD.md` (its `## 12` is already Task 9's "Calculator rules"; a Gate A status section has no home there under this repo's own doc map — that is `docs/WEBSITE-HANDOFF.md`'s job), `docs/SEO.md`/`docs/CONTENT-MODEL.md`/`docs/ANALYTICS.md` (each page task's own W98/general-rule obligation, already current or completed by T1–T14 before T15 runs), `docs/ARCHITECTURE.md` § Quality gate (items 5/6 already fully document the bypass header, the preview Lighthouse face and the launch profile — verified directly, nothing to add), `docs/redirects.md` (the sweep results live in the ledger, not baked into a rules doc — matching how point-in-time facts are kept out of stable-rules docs elsewhere in this programme), `CLAUDE.md`, `docs/DEPLOYMENT.md` § Two Vercel projects / § Phase A cutover / § Deployment Protection and `docs/ARCHITECTURE.md` § Environments (the two-project text: corrected by the controller's W173 docs commit before T15 executes, never by T15), `docs/pending/` (the digest's Phase B line comes with the W173 docs commit; T10's v1.1 register backlog is written there by the controller at Gate A — W172, W178).

**Sys keys added:** none — T15 adds no page copy; the Cycle 7 doc edits are documentation, not `sys.*` strings.

**Package ids used:** 0 — this task renders no page; it cites CTA anchor ids (`proposal`, `request-form`, `calculator`, `tracks`, `permit-cta`, `message`, `report`, `pool`) and placeholder slot names other tasks already own, never a new or borrowed package string.

**CLIENT_SYS additions:** none — no client component reads a new `sys.*` namespace as a result of this task.

**Foundation gaps:**
1. **Ruled — W173.** `docs/DEPLOYMENT.md` (§ Two Vercel projects, § Phase A cutover, § Deployment Protection), `CLAUDE.md` (doc-map row, § Environments and deploy) and `docs/ARCHITECTURE.md` § Environments described a domain move to a never-created `jobsadmire-web-v2`. W105 settled the fact (ONE project, `jobsadmirewebsite`; the cutover removes the two `main` deploy guards; rollback is Vercel's Instant Rollback to the previous production deployment), and the controller corrects all three files in the W173 docs commit on `wp2/foundation` before T15 executes. T15 cites that commit and rewrites none of that text.
2. **Ruled — W174.** The spec §10 row 4 auto-default for the Homepage/Hire Workers hero slots is a **licensed stock pack**, not a gradient (the gradient is the default for every *other* photo slot), and D26's Minimum Launchable Content names "licensed stock or real photos for the Homepage and Hire Workers hero slots" explicitly. The pack was never sourced. `v4-hero` and `hw-hero` are therefore BLOCKING for Gate A, and "source the licensed hero stock pack" is on the owner's WP-C list, decide-by the content freeze (Cycle 6 Step 4, item 3; the Gate A owner checklist). The placeholder counter does not catch it by itself (it fails only an LCP slot that is a placeholder, and the LCP slot is the `h1`).
3. **Ruled — W172.** T15 builds the synthetic lead (Cycle 3); the digest (I19) is Phase B. What remains: (a) **no heartbeat mechanism exists.** `docs/OPERATING.md` and `docs/INTEGRATIONS.md` I19 describe a heartbeat ping to an external service, but there is no heartbeat URL, env var or service, because the external monitor is still an owner set-up item. The route logs `[synthetic-lead] ok` and returns the door's status; a follow-up adds the ping (and its env var) once the monitor issues a URL. (b) The Hobby plan runs crons daily only, while the design asks for every 30 minutes: the schedule moves to `*/30 * * * *` with Pro. (c) `postForm`'s `env` seam was documented as test-only; the cron is now its one production caller (the doc comment is updated in Cycle 3). (d) `CRON_SECRET` and `OPS_WEBSITE_TEST_TOKEN` must reach the Production scope before the cutover (a WP7a step).
4. `docs/redirects.md`'s "Disposition table" (the 517-legacy-URL-vs-49-rule reconciliation) is a separate, larger placeholder than the 20-URL Gate A sweep this task builds — still pending the same WP0 GSC export as the expected-loss forecast (W178). T15's 20-URL sweep is the Gate A checklist's own narrower requirement (spec §5's literal words) and does not attempt the full disposition table.
5. This task cannot itself supply the binding preview run's real numbers (deployment id, per-route bytes, LCP/perf medians, pixel percentages, sweep results, the staging synthetic-lead run) — every `<…>` placeholder in Cycles 5–7 is filled by the implementer or the controller from Cycles 4–6's actual output, never invented here.

**Ledger line:** `T15 Gate A prep — no route (sweeps every route) — gate:launch OK <date> on <preview> (every static pathnames route swept, both locales; W20/W152/W158/W21 all green); js-size binding worst-of-3 <route> <n> B of 204,800 (headroom <n>); LCP median <range> ms, performance ≥ <min>, a11y/bp/seo 1.00 across every indexable route; sweep:legacy <n>/20 single-hop + 2 keep, no 429; pixel home/hire/calc/blog-article tr+en 7 of 8 scored (blog-article/tr clean skip, W4/W138), no new iteration spent; lazy line held at 191,724 B local / 194,560 B binding (W162); placeholders reconciled against D26 + spec §10 (founder slot `founder-photo`, W176) — blocking: licence-pdf ×4, office/founder photo (×1 of 2), hero photos v4-hero + hw-hero (W174, stock pack decide-by the content freeze), cookie notice; synthetic lead built, proven once on staging <date>, scheduled from the cutover (W172; heartbeat not wired; digest Phase B); open: expected-loss forecast (GSC export pending), site-health drill + external monitor (owner), GA4 token redaction (owner, W175); recorded: thank-you max-w delta and T10 v1.1 register backlog (W178); second human — configured (§3.1), receipt per T14's real-lead run; Gate A readiness record (9 rows, status + how verified, plus the owner checklist) in wp2b-pages.md; docs synced (WEBSITE-HANDOFF.md §1/§3.2/§5, OPERATING.md, and Cycle 3's DEPLOYMENT/OPERATING/ARCHITECTURE/.env.example); rulings cited W162, W172–W176, W178, none appended; memory line handed to the controller.`
