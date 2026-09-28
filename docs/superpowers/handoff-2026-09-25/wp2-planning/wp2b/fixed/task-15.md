### Task 15: Gate A prep — `gate:launch` green on every route in both locales, sweeps, measurements, readiness record

**What this task is.** No page is built here. T15 is the last WP2b task (W99): it proves, with committed evidence, that the fourteen pages T1–T13 ported and the forms T14 exercised can face Gate A ("can Phase A be public this week?", spec §5, quoted in full below). Unlike the 2026-09-20/24 draft this file replaces, most of the *mechanism* Gate A needs is **already built** — verified directly against the real code on `wp2/foundation`, not assumed:

- **Preview reachability (the draft's Cycle 1) is DONE.** WP2a Task 7 built `e2e/helpers/bypass.ts` (`protectionBypassHeaders`, `bypassWarning`), `e2e/helpers/face.ts` (`siteFace`, `expectedRobots`, `lighthouseConfigFor`), `lighthouserc.preview.json` (skips `is-crawlable` **and** `robots-txt`, W140), a face-aware `e2e/seo.spec.ts` robots test, and `src/app/robots.test.ts` (computes its expectation from the real `robotsDisallowPaths`/`UNBUILT_PATHNAMES`, never a hand-typed list). `scripts/gate.sh` already selects the config and passes the header as `--settings.extraHeaders=<JSON>` (W137 amended — **never** `--extra-headers`, which is what the original draft said and which `.superpowers/sdd/2026-09-20-wp2a-foundation/wp2a-final-review.md` §6 names as a drift to fix). Ruling **W91** covers all of this; **W100** records the move out of T15. T15 **consumes** this, it does not rebuild it.
- **StickyCtaBar contact tracking (the draft's Cycle 5) is DONE.** `src/design/chrome/StickyCtaBar.tsx` already renders every `cta` through `ContactCta` (`placement="page_cta"`) and its wrapper already carries `data-testid="sticky-cta"` — read directly from the file, not from a stale doc. Ruling **W81** covers this; **W100** records the move into WP2a Task 5. T15 does **not** re-edit any page.
- **The dead-target + CTA-anchor sweep (W152/W158) is DONE** — `scripts/launch/dead-targets.launch-check.ts` (+ its pure half `dead-targets.ts`, unit-tested by `dead-targets.test.ts`) already fetches every `GATE_ROUTES` page, requires every internal `href` to answer 200, and requires every `CTA_BY_PATHNAME`/`DEFAULT_CTAS` anchor id to exist on the page its own link resolves to, in both locales. **T15 does not duplicate this.**
- **`UNBUILT_PATHNAMES` emptiness (W20) is DONE** — `scripts/launch/unbuilt-routes.launch-check.ts` already asserts it. **T15 does not duplicate this.**
- **The one real gap `gate:launch` still has:** nothing proves `GATE_ROUTE_TABLE` (`e2e/routes.ts`) itself lists every static route in both locales with the right `indexable` flag — dead-targets only checks that whatever **is** listed has no dead links; unbuilt-routes only checks every route **has a page**. T15 Cycle 1 closes this (a new file, not a rewrite of either existing one).
- **The Googlebot legacy-URL sweep (D21, spec §5's "20 legacy URLs → 308/410, no 429") has no owner anywhere in the built foundation.** T15 Cycle 2 builds it (new).
- **The project is `jobsadmirewebsite`, never `jobsadmire-web-v2`** (ruling **W105**, and independently confirmed: every real WP2a preview deployment ran under hostnames `jobsadmirewebsite-fcif8p971` / `-ob96kp4oc` / `-3vdtznlg3` — `docs/superpowers/handoff-2026-09-25/wp2a-sdd/progress.md` lines 77/98/109 — and `docs/WEBSITE-HANDOFF.md` §3.2's own heading already reads "Vercel — project `jobsadmirewebsite`"). No second project was ever created — the Vercel MCP reuses the linked one (`WEBSITE-HANDOFF.md` §3.2). Cutover (WP7a, **not this task**) removes two guards on that one project (`vercel.json`'s `git.deploymentEnabled.main:false` + the Ignored Build Step), it does not move a domain between two projects. `docs/DEPLOYMENT.md`'s "Two Vercel projects" table and "Phase A cutover" section still describe the original two-project plan and are stale on this point — flagged in Foundation gaps below, **not corrected here** (WP7a is explicitly out of scope for T15).
- **`generate_lead` fires from `ConversionPing`** on the thank-you page (T14 Cycle 1), never "the forms kernel on every successful door submission" as the 2026-09-20 draft's ANALYTICS paragraph said (ruling **W105**; `docs/ANALYTICS.md`'s current text already says `generate_lead` is "declared but still uncalled" as WP2a left it — T14 closes that, T15 only audits the result).
- **Retry/site-health wording is W74/W75, not W3's original text:** one 9 s per-attempt deadline, ONE retry only after a connection-level failure, a timeout or 5xx returns `unavailable` at once (W74/W117); `opsPingCheck` maps `off | unauthorized | unreachable → fail`, only `unconfigured → skip` (W75, confirmed directly in `src/app/api/site-health/ops.ts`) — so a dark door is **not** an acceptable "record which state" at Gate A, it is a site-health failure to escalate.
- **`lighthouserc.local.json` is now identical to `lighthouserc.json`** (W145 retires R50's localhost LCP waiver — confirmed directly in the file's own `_comment`). Any reference to "R50 advisory" is stale.
- **Doc-sync scope is narrower than the draft's.** The controller's brief for this task names exactly three docs (`docs/WEBSITE-HANDOFF.md` §1/§3.2/§5, `docs/OPERATING.md` if an owner check changed, `docs/DEPLOYMENT.md` § Phase A cutover only if a fact changed — and that section is WP7a content T15 does not touch). `docs/PRD.md`, `docs/SEO.md`, `docs/CONTENT-MODEL.md`, `docs/ANALYTICS.md`, `docs/ARCHITECTURE.md`, `docs/redirects.md` and `CLAUDE.md` are **not** touched by this task: PRD's own `## 12` is already taken (Task 9's "Calculator rules" — a new Gate A section would collide there anyway), ARCHITECTURE's § Quality gate items 5/6 already document the bypass header, the preview Lighthouse face and the launch profile in full (verified directly), and the per-page tables in SEO/ANALYTICS/CONTENT-MODEL are each page task's own W98 obligation, not T15's to redo. Gate A's durable record lives in `docs/WEBSITE-HANDOFF.md`, which is already this programme's living status document.

**Preconditions.** T1–T14 merged on `wp2/foundation` (their own `GATE_ROUTE_TABLE` rows, `data-lcp-slot`/`data-placeholder` markup and `docs/SEO.md` Pages rows already landed — W99 execution order puts T15 last); a green Vercel preview of the branch head; `VERCEL_AUTOMATION_BYPASS_SECRET` from `ACCESS.md` (owner's shell only, never printed, never committed). One heavy job at a time (Mac Studio memory rule): one `next build`, one Playwright run, one Lighthouse loop.

**Gate A checklist (verbatim, spec §5 — grep `Gate A` in `docs/superpowers/specs/2026-09-18-website-programme-design.md:171`):** *"Can Phase A be public this week?" Checklist: Minimum Launchable Content present or auto-defaulted; expected-loss forecast signed; `gate --profile=launch` green on every page; forms create inquiries end to end on `staging.jobsadmire.com` with real Turnstile (inquiry with contactName → assignment → notification → autoresponder); all 13–15 forms produce exactly one `generate_lead` and one submission; Googlebot curl sweep of 20 legacy URLs returns single-hop 308/410 with no 429; site-health checks each broken deliberately → phone rings; synthetic lead and digest running; second human receiving. Two consecutive "no" answers trip §12.* D26's exact Minimum Launchable Content definition (spec §2, row D26) and the §10 owner-input table (11 rows) are the reconciliation keys for row 1 — quoted where used below, never re-derived.

Rulings that shape this task (verified against the real, built code, not assumed): **W20/W152/W158** (already built — consumed, not duplicated), **W21** (the one still-open gap — Cycle 1 closes it), **W91/W135/W137/W140** (preview reachability — already built), **W81** (StickyCtaBar — already built), **W93** (careers-detail rows derived at gate time by `scripts/gate-routes.mjs` — already built; a static table row for `/careers/[slug]` would go stale the day an opening closes and must never be hand-maintained), **W94** (`js-size --routes` for noindex-route spot checks — already built), **W98** (one shared ledger row format, T1's), **W99** (T15 runs last), **W105** (`jobsadmirewebsite`, never `jobsadmire-web-v2`; `generate_lead` from `ConversionPing`; W74/W75 wording), **W136** (the ledger's binding JS figure is the Vercel-preview `js-size` reading, a local run is diagnostic only), **W139** (refusal e2e cases accept 401|503 — already built), **W145** (LCP/performance under DevTools throttling, median of 3, in *every* config including local — R50's waiver is retired), **D13/D21/D26/D27** (quoted where used).

**Files:**

Create
- `scripts/launch/route-coverage.launch-check.ts` — launch-profile-only: every static `pathnames` key is in `GATE_ROUTE_TABLE` in both locales with the right `indexable` flag; dynamic keys excluded (careers detail is never a static row — W93; blog gets a soft, one-locale-minimum check — W4) (Cycle 1)
- `scripts/launch/legacy-urls.txt` — the 20 legacy URLs + 2 keep controls with their expected disposition (Cycle 2)
- `scripts/launch/legacy-sweep.sh` — the Googlebot curl sweep, `npm run sweep:legacy` (Cycle 2)
- `scripts/launch/legacy-sweep.test.ts` — pins the 22 expectations to `redirects/legacy.json` + `redirects/gone.json` + `pathnames`, so the list can only disagree with the deployment, never drift from the data (Cycle 2)

Modify
- `package.json` `scripts` (current key order ends `…, "assets:map": …`; insert after `"pixel"`) — add `"sweep:legacy": "bash scripts/launch/legacy-sweep.sh"` (Cycle 2)
- `docs/WEBSITE-HANDOFF.md` — §1 programme table (current L21 WP2b row, L22 Gate A/WP7a row); §3.2 (append one bullet after the existing "Binding preview gate (2026-09-29, deployment `02ace58`…)" bullet, current L104); §5 step 7 (current L162, the "Gate A → WP7a" line) (Cycle 6)
- `docs/OPERATING.md` — § External monitor and second human (current L54–57, the "(pending §10 item 10 …)" parenthetical); § Weekly five-minute owner check (current L58–61, append the `sweep:legacy`/`gate:launch` line); new § Site-health drill inserted before § Weekly five-minute owner check (Cycle 6)
- `docs/superpowers/plans/2026-09-20-wp2-rulings.md` (`## Execution rulings`, append after the last existing ruling — currently W161) (Cycle 6)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (append the T15 row to the `## Ledger` table T1 creates per W98; T15 runs last per W99, so that table and every earlier task's row already exist by the time this cycle runs) (Cycle 6)

Test
- `scripts/launch/route-coverage.launch-check.ts` (launch profile only, via `vitest.launch.config.mts`)
- `scripts/launch/legacy-sweep.test.ts` (the default `npm run verify` suite — matches `vitest.config.mts`'s `scripts/**/*.test.ts` include)
- Runs: `npm run gate:launch` (local, capped build — W126), `npm run gate:launch` (preview, binding), `npm run sweep:legacy` (preview), `npm run js-size` (reads the preview's `.lighthouseci`), `npm run pixel -- --page=<p> --locale=<l> --base=<preview>` × 8 (7 scored, `blog-article`/`tr` skipped — W4/W138)

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
- `src/design/chrome/ctas.ts`: `CTA_BY_PATHNAME`, `DEFAULT_CTAS` — the 8 anchor ids Cycle 5's placeholder/CTA reconciliation checks against: `/` → `proposal`, `/hire-workers` → `request-form` (via `DEFAULT_CTAS`), `/hiring-cost-calculator` → `calculator`, `/partner-with-us` → `tracks`, `/work-permit` → `permit-cta`, `/contact` → `message`, `/verify` → `report`, `/available-workers` → `pool`.
- `src/design/chrome/StickyCtaBar.tsx` (already routes contact CTAs through `ContactCta` `placement="page_cta"`, `data-testid="sticky-cta"` — **consumed, not modified**).
- `src/app/api/site-health/route.ts` / `ops.ts`: `OpsPing`, `pingOps`, `opsPingCheck` (`off|unauthorized|unreachable → fail`, `unconfigured → skip` — W75); `GET /api/site-health` body `{ ok, reasons, checks, ops, formBeacons, contractVersion, source, commit, at }`.
- `redirects/legacy.json` (328 rows, `{ from, to, status: 308, source }`), `redirects/gone.json` (19 prefixes, matched by `src/proxy.ts`).
- T1–T14 (their own reconciled task files): `GATE_ROUTE_TABLE` rows, `data-lcp-slot`/`data-placeholder` markup, `sys.*` namespaces, `docs/SEO.md` Pages rows (W98); T14's forms ledger lines.

Produces
- `scripts/launch/route-coverage.launch-check.ts`: closes the residual W21 gap (route-table completeness) that neither `unbuilt-routes.launch-check.ts` nor `dead-targets.launch-check.ts` covers.
- `npm run sweep:legacy` (`scripts/launch/legacy-sweep.sh` over `scripts/launch/legacy-urls.txt`) — the Gate A / WP7a legacy sweep, re-run verbatim against production at WP7a.
- The Gate A readiness record: the local (W126) and binding-preview launch-profile run records, the placeholder/MLC inventory reconciled against spec §10, the open-items list, the pixel-harness scores for the four D27 pages, `docs/WEBSITE-HANDOFF.md` §1/§3.2/§5 updated, `docs/OPERATING.md` updated, the T15 ledger row in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`, and proposed execution rulings `W-T15-1`…`W-T15-6` (task-scoped labels, not sequential W-numbers — those are assigned by the controller's post-reconcile recheck pass per `docs/superpowers/handoff-2026-09-25/wp2a-sdd/progress.md`'s own "residual rulings W162+" note).

---

- [ ] **Cycle 1 — Close the one real launch-profile gap: `GATE_ROUTE_TABLE` covers every static route, both locales**

Why this is real and not already covered: `scripts/launch/dead-targets.launch-check.ts` (W152/W158) only proves that whatever **is** in `GATE_ROUTES`/`GATE_ROUTE_TABLE` has no dead links and every CTA anchor exists — it says nothing about a route that was never added to the table in the first place. `scripts/launch/unbuilt-routes.launch-check.ts` (W20) only proves every `pathnames` route **has a page** — nothing ties that back to the gate's own route list. W21 ("one route list … every page task appends its own two locale paths") has no owner for the completeness check itself; `wp2b/check.md`'s `route_and_gate_gaps` finding names exactly this: *"T15's launch check then requires one detail row per locale, marked indexable. The drafts have no single owner for those rows."* **Guard:** `ls scripts/launch/route-coverage.launch-check.ts 2>/dev/null` — if a page task already landed an equivalent file, read it, keep whichever is more complete, and skip the duplicated part of Step 3.

- [ ] **Step 1: Write the failing test**

`scripts/launch/route-coverage.launch-check.ts` (new; picked up by `vitest.launch.config.mts`'s `scripts/launch/**/*.launch-check.ts` include — launch profile only, exactly like its two siblings):

```ts
/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { getPathname } from '@/i18n/navigation';
import { pathnames, routing } from '@/i18n/routing';
import { isNoindexPathname } from '@/lib/seo/routes';
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
      const external = getPathname({ locale, href });
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

Before the file exists: `Error: Cannot find module './route-coverage.launch-check'` (vitest reports no test files matched under the launch config). Once written: whether the per-route cases pass depends on how much of T1–T13 has already landed by the moment this cycle actually runs — per W99, T15 executes last, so in the ordinary case every static route is already present and only the two new assertions (the blog soft-check, the careers-detail absence check) are freshly exercised. If any per-route case is still red, its message names the exact external path and locale missing from `e2e/routes.ts` — that identifies precisely which earlier task's commit is incomplete.

- [ ] **Step 3: Implement**

The test file above **is** the implementation — there is no separate production module; the check reads `GATE_ROUTE_TABLE` directly. Nothing else changes. If Step 2 found missing rows, **do not add them here**: this task never edits another page's route additions. Stop and report the missing `(locale, path)` pairs to the controller — the owning page task lands a one-line follow-up commit adding its row, the same pattern W20 already uses ("each page task deletes its own entry"; here, each page task owns its own two rows).

- [ ] **Step 4: Verify**

```bash
npx prettier --write scripts/launch/route-coverage.launch-check.ts
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --config vitest.launch.config.mts scripts/launch/route-coverage.launch-check.ts --maxWorkers=1   # green
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --config vitest.launch.config.mts --maxWorkers=1   # all three launch-check files green together
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1                                # default suite unaffected — this file is outside its include glob
```

- [ ] **Step 5: Commit**

```bash
git add scripts/launch/route-coverage.launch-check.ts
git commit -m "test(gate): route-table completeness check — every static pathnames route swept in both locales (T15, W21)

dead-targets.launch-check.ts (W152/W158) proves what IS in GATE_ROUTE_TABLE has no dead links;
unbuilt-routes.launch-check.ts (W20) proves every route has a page. Neither proved the table
itself was complete. Dynamic keys stay out on purpose: careers detail is derived live at gate
time (W93, scripts/gate-routes.mjs) and must never be a hand-maintained row.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
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
    LIVE.add(getPathname({ locale, href }));
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

Run line: `NODE_OPTIONS=--max-old-space-size=4096 npx vitest run scripts/launch/legacy-sweep.test.ts --maxWorkers=1` (this file matches the default suite's `scripts/**/*.test.ts` include — it runs inside `npm run verify`, unlike the two `.launch-check.ts` files).

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
probe() {
  curl -sS -o /dev/null --max-redirs 0 -A "$UA" "${HDR[@]}" \
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

**Contingency — a Vercel Firewall challenge on the spoofed Googlebot UA.** A 403 with an interstitial body on the sweep's curl UA is not a redirect-map defect: it means Bot Protection / Attack Challenge Mode is challenging an unverified crawler UA (a real Googlebot passes reverse-DNS verification; curl cannot). Record it as a finding for a verified-crawler allowlist at the Firewall layer (`docs/SEO.md` § Robots already flags this allowlist as "not yet configured … tracked as one of the three numbers watched in the 12-week post-launch window" — confirmed by direct grep of the current file), then re-run once with `UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"` (a plain browser UA) to confirm the redirect layer itself is correct, and paste both tables into the readiness record (Cycle 5/6). This is proposed ruling **W-T15-3** below.

- [ ] **Step 4: Verify**

```bash
chmod +x scripts/launch/legacy-sweep.sh
npx prettier --write scripts/launch/legacy-sweep.test.ts package.json
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run scripts/launch/legacy-sweep.test.ts --maxWorkers=1   # 23 passed (1 + 22 rows)
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1   # default suite green
```

- [ ] **Step 5: Commit**

```bash
git add scripts/launch/legacy-urls.txt scripts/launch/legacy-sweep.sh scripts/launch/legacy-sweep.test.ts package.json
git commit -m "feat(gate): Googlebot legacy sweep — 20 old URLs single-hop 308/410, keep controls, data-pinned (T15, Gate A spec §5)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 3 — The local capped-build proof (W126): every launch-profile check green before spending a preview run**

No new code in this cycle — the run **is** the test, exactly as COMMON.md's shape for this task anticipates ("fewer code cycles, more run-and-record cycles"). Its purpose is to catch a missing route/anchor/placeholder **before** burning a Vercel preview run and the Lighthouse/pixel budget on it.

- [ ] **Step 1: Preconditions**

```bash
git log --oneline -5   # Cycles 1–2 committed; HEAD includes every T1–T14 commit (W99: T15 runs last)
git status --porcelain # clean
```

- [ ] **Step 2: Confirm the launch-profile checks are reachable**

```bash
ls scripts/launch/{unbuilt-routes,dead-targets,route-coverage}.launch-check.ts   # all three present
node -e "console.log(require('./package.json').scripts['gate:launch'])"          # bash scripts/gate.sh --profile=launch
```

- [ ] **Step 3: One build, one start, one `gate:launch` — the W126 proof**

```bash
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build   # ONE build (W126)
NODE_OPTIONS=--max-old-space-size=4096 npm run start &                    # background; note the PID
SERVER_PID=$!
# wait for :3000 to answer before gating it — a fixed sleep is unreliable on a loaded machine:
until curl -sS -o /dev/null http://localhost:3000/ ; do sleep 1; done
REVALIDATE_SECRET=<the value the server was started with, if any> \
  E2E_BASE_URL=http://localhost:3000 npm run gate:launch 2>&1 | tee /tmp/gate-launch-local.log
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

then `npx playwright test` (both `mobile`/`desktop` projects — `workers: 1`, `fullyParallel: false`, already the file's own settings), the Cycle 1 `route-coverage.launch-check.ts` is **not** re-run here — it only runs when `E2E_BASE_URL` targets the launch profile itself, i.e. it already ran as part of the block above — then the per-route Lighthouse loop against `lighthouserc.local.json` (identical to `lighthouserc.json` since W145 retired R50's waiver — every route is held to LCP ≤ 2,500 ms, performance ≥ 0.95, script ≤ 204,800 B, exactly as production), then `gate: OK` and the `js-size` table (diagnostic locally — W136).

**Stop-and-report rule.** T15 implements nothing page-shaped. If any of the four launch-profile checks (`UNBUILT_PATHNAMES`, dead targets, `route-coverage`, content readiness) is red, or Lighthouse fails a route on performance/LCP/script-size:

1. Read the failure message — every one of these checks names the exact route, anchor id, placeholder slot or script-size figure at fault.
2. Do **not** edit another task's page to fix it. This task never touches page source.
3. Identify which page task (T1–T13) or T14 owns the offending route/behaviour and record it as a blocking dependency in the readiness record (Cycle 5/6's open-items list) rather than silently patching around it.
4. Only once the owning task lands a follow-up commit does this cycle re-run. A route over the 194,560 B lazy line is the same rule (W13 amended: "a lazy-loading pass before the next page starts" — if T15 is running, that pass was already due and did not happen; it is not T15's job to add it retroactively).

- [ ] **Step 4: Record**

Note the local figures (route, script bytes, LCP ms, performance) for cross-reference against the binding preview figures in Cycle 4 — a large gap between the two (beyond the ~2–3 KB edge-vs-local difference `docs/superpowers/handoff-2026-09-25/wp2a-sdd/progress.md` records as normal, e.g. 176,132 B local vs 178,968 B binding on `/` at the WP2a-only baseline) is itself a finding to note, not a defect to chase here.

- [ ] **Step 5: No commit**

This cycle produces no file changes — it is the gate before spending the preview budget in Cycle 4. If every check is green, proceed. Its output feeds the readiness record written in Cycle 6.

---

- [ ] **Cycle 4 — The binding preview run: `gate:launch` green against a READY Vercel deployment, per-route measurements**

Controller-driven (needs the owner's `VERCEL_AUTOMATION_BYPASS_SECRET` from `ACCESS.md` and, per W92, the `staging` branch fast-forwarded to `wp2/foundation`'s HEAD only if any door-aware spec needs it — T15's own launch-profile checks need no door). This is the run `docs/WEBSITE-HANDOFF.md` §3.2 already records the shape of for WP2a (deployment `02ace58`); this cycle produces the equivalent record for the completed WP2b branch.

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

Expected shape (mirroring `progress.md`'s own binding-run record exactly — copy this shape into Cycle 6's ledger line, substituting the real numbers this run produces):

```
gate: launch — W20, dead targets and content readiness pass
gate: OK — Playwright <n> passed / <m> skipped (the ops-token refusal cases, 401|503 — W139)
gate-routes <either the live /kariyer/<slug> + /en/careers/<slug> pair, or
             "detail rows skipped (door not configured)" if OPS_API_URL is unset for this preview>
Lighthouse (lighthouserc.preview.json, DevTools throttling, 3 runs, median) on every indexable
  route: every assertion passed — perf ≥ 0.95, a11y/bp/seo = 1, LCP ≤ 2,500 ms, script ≤ 204,800 B
```

If `gate:launch` is red, apply Cycle 3's stop-and-report rule identically — this is the same profile, a different host.

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

`npm run js-size`'s table columns (verified directly in `scripts/js-size.mjs`'s `formatJsSizeTable`): `| route | script B (worst of 3 runs) | headroom to 204,800 | LCP ms (median) | perf (median) | note |` — the "note" column is empty unless a route is over the 194,560 B lazy line (W13 amended) or over the ceiling; **the figure this run produces is the binding one for the ledger (W136)** — the local Cycle 3 numbers were diagnostic only.

- [ ] **Step 5: Delete the report folders**

```bash
rm -rf .lighthouseci lighthouse-report test-results
unset VERCEL_AUTOMATION_BYPASS_SECRET
```

`docs/DEPLOYMENT.md`'s `VERCEL_AUTOMATION_BYPASS_SECRET` row (verified directly) is explicit that these three git-ignored folders hold the secret verbatim after a preview run (Lighthouse stores request headers; Playwright's `trace: 'retain-on-failure'` does too on any failing run) — never share, upload or commit them; delete between any two runs against different targets.

No commit — Step 4's tables feed Cycle 6's ledger line and the readiness record; nothing here is a file change to this repo.

---

- [ ] **Cycle 5 — Legacy sweep on the preview, the D27 pixel scores, the placeholder/MLC reconciliation, the open-items list**

Same preview, same exported secret as Cycle 4 (re-confirm the deployment is still READY — Step 1's check does not expire, but a long gap between cycles is worth a second look).

- [ ] **Step 1: The legacy sweep, against the preview**

```bash
npm run sweep:legacy 2>&1 | tee /tmp/sweep-legacy-preview.md
```

Expected: 22 `ok` rows (20 redirects + 2 keep). Paste the printed table verbatim into the readiness record (Cycle 6). If a Vercel Firewall challenge interferes (see Cycle 2's contingency), paste both tables (spoofed UA + browser UA) and record the finding — do not treat it as a sweep failure once the browser-UA re-run confirms the redirect layer itself is correct.

- [ ] **Step 2: The D27 pixel harness — the four nominated pages, both locales**

```bash
for p in home hire calc blog-article; do
  for l in tr en; do
    npm run pixel -- --page=$p --locale=$l --base="$E2E_BASE_URL" || echo "pixel: $p $l exited $? (see W138 — a page with no body in this locale is a clean skip, not a failure)"
  done
done
node -e '
const r = require("./.pixel/report.json");
for (const [k, v] of Object.entries(r)) {
  console.log(k, v.route, v.results.map((x) => `${x.width}:${(x.match * 100).toFixed(2)}%`).join(" "));
}
' | tee /tmp/pixel-preview.txt
```

Expected: **7 scored rows, not 8** — `blog-article`/`tr` is a clean, intentional skip (exit 0, "nothing scored"): `resolvePixelRoute`/`pixelTarget` in `scripts/pixel-compare.ts` require a written blog body in the requested locale, and W4 keeps the Turkish body count at zero at Gate A (confirmed directly: `docs/superpowers/handoff-2026-09-25/wp2-planning/wp2b/check.md`'s `route_and_gate_gaps` finding names this exact case). Do not treat the eighth invocation's skip as a defect.

**T15 spends no new pixel iteration.** Each of T1 (home), T2 (hire), T3 (calc) and T12 (blog-article) already ran its own two-iteration cap (`docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`) during its own port — this run is the **binding confirmation against the preview**, the same relationship the local-vs-preview split has for js-size (W136). If a preview score differs meaningfully from the page task's own recorded local score, that is a finding to report (per Cycle 3's stop-and-report rule), never a defect T15 fixes itself — a third run needs a controller ruling per the pixel-harness doc's own rule 3.

Ledger row format (verbatim from `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` rule 4 — use this shape exactly, one row per page/locale, pulling the "run N of 2" and the lettered deltas from that page task's own ledger line, never invented here):

```
pixel <page> <locale>: 390 → NN.NN %, 900 → NN.NN %, 1440 → NN.NN %; run 2 of 2 (confirmed on preview, T15); deltas: (a) …; (b) …; (c) …; (d) accepted: …
```

- [ ] **Step 3: The placeholder counter's table, reconciled against D26 + spec §10**

`gate:launch`'s own D26 check (Cycle 4, Step 3) already wrote `lighthouse-report/content-readiness.json` and printed the table — re-read it here (before Cycle 4 Step 5 deletes the folder) or re-run in isolation:

```bash
E2E_BASE_URL="$E2E_BASE_URL" npx tsx scripts/placeholder-count.ts | tee /tmp/content-readiness-preview.md
```

The real table's columns (verified directly in `scripts/placeholder-count.ts`'s `formatReadinessTable`): `| route | status | placeholders | slots | LCP slot | verdict |`. Reconcile its `slots` column, row by row, against the expected inventory below — the counter's **actual** output is the source of truth; this table is the reconciliation key, built from spec §10 (quoted in full at the top of this task) and D26's Minimum Launchable Content list (also quoted in full above).

**Expected placeholder inventory at Gate A:**

| Route pair | LCP slot | Expected `data-placeholder` slots | §10 row → owner | Launch-blocking under D26? |
| --- | --- | --- | --- | --- |
| `/` · `/en` | `h1` | `v4-hero` | #4 hero photography → owner; spec's own auto-default is a **licensed stock pack** for this exact slot (spec §10 row 4: "licensed stock pack for the two heroes; gradients elsewhere") | **only if the stock pack was never sourced** — then `ImageSlot` renders its gradient fallback (LCP stays `h1`, never the slot) and the row is an open item, not a defect; the D26 gate itself never blocks on it (gradients are an accepted default for every OTHER slot; whether they are accepted for these two specific named slots is the owner's call the spec table already recorded) |
| `/isci-talebi` · `/en/hire-workers` | `h1` | `hw-hero`, `portal-shortlist`, `portal-mobile-app` | #4 (hero, same stock-pack default as above); the two portal screenshots have no §10 row → owner ask (product screenshots, consented) | no |
| `/maliyet-hesaplayici` · `/en/hiring-cost-calculator` | `h1` | `calc-hero` | #4 "gradients elsewhere" → none | no |
| `/calisma-izni` · `/en/work-permit` | `h1` | `wp-hero` | #4 → none | no |
| `/ortak-olun` · `/en/partner-with-us` | `h1` | `partner-portal-screen`, `partner-portal-mobile` | no §10 row → owner ask (portal screenshots) | no |
| `/hakkimizda` · `/en/about` | `h1` | `office-photo`, `founder-photo`, `crm-dashboard`, `app-screen`, `licence-pdf-*` (four rows, one per İŞKUR/ÖİB PDF) | #3 founder/office photo + licence PDFs → owner | **yes** — D26 names "the four İŞKUR/ÖİB licence PDFs republished at `/hakkimizda#lisans`" and "one real founder/office photograph" explicitly; the `licence-pdf-*` rows and at least one of `office-photo`/`founder-photo` must be real before this row reads "yes" |
| `/iletisim` · `/en/contact` | `h1` | `contact-hero` | #4 → none | no |
| `/adaylar` · `/en/available-workers` | `h1` | `aw-hero` | #4 → none | no |
| `/basari-hikayeleri` · `/en/success-stories` | `h1` | `ss-hero` | #4 → none | no |
| `/temsilci-dogrulama` · `/en/verify` | `h1` | `rep-founder` | #3 → owner (strip hidden by W6; zero rendered is also a correct reading if the whole component is conditionally hidden) | no |
| `/kariyer` · `/en/careers` (+ one live detail pair per W93, or "door not configured" — never a hard-coded slug) | `h1` | none expected (live Ops data, no photo slots) | — | — |
| `/blog` · `/en/blog` (+ the one EN article) | `h1` | `blog-hero` on the index; `blog-cover-<key>` per rendered `PostCard` teaser on the index AND on the article's own cover (W103 — the same asset naming convention both places, one row today: the EN article) | #5 blog bodies → marketing | no (noindex, W4) |
| `/portal-girisi` · `/en/portal-login` | `h1` | none expected (W8 link-only chooser) | — | — |
| `/gizlilik`, `/kullanim-kosullari`, `/kvkk`, `/cerez-politikasi` (+ `/en/…`) | `h1` | as named by T13 for the counsel texts (KVKK, cookie policy — D14) | #6 counsel → owner | **cookie notice: yes** (D26 MLC names "Privacy/Terms + cookie notice" explicitly); KVKK: no, if the minimal placeholder notice is what ships in Phase A (spec §10 row 6's own auto-default) |
| `/tesekkurler?form=hire` · `/en/thank-you?form=hire`, `/abone-onay`, `/abonelikten-cik` (+ `/en/…`) | `h1` | none | — | — |

Record, per row, the counter's **actual** count next to this expected one, and the launch-blocking verdict. Any slot the real table lists that is **not** in this expected set is either a placeholder a page task added without naming it in its own docs (add it here, noting which §10 row it belongs to) or an unnamed leak — `evaluateScan` already fails the run for an unnamed `data-placeholder` (W55), so a genuinely unnamed one would already have failed Cycle 4, not reached this reconciliation step.

- [ ] **Step 4: The open-items list**

Compiled from Step 3's launch-blocking column plus the Gate A checklist rows that are never a code artefact:

1. **Licence PDFs (×4) and one real founder/office photo** — D26 MLC, blocking (owner).
2. **Minimal cookie notice text** — D26 MLC, blocking (owner/counsel).
3. **Hero photography for Homepage + Hire Workers** — spec §10 row 4's own auto-default is a licensed stock pack for these two slots specifically; record whether it was sourced. If not, the gradient renders and D26 does not itself block on it (every other hero slot already defaults to gradient) — but note it as open rather than silently calling it "resolved."
4. **Expected-loss forecast** (Gate A checklist item 2) — `docs/redirects.md`'s own "Expected-loss forecast" section (verified directly) is still a placeholder pending the WP0 GSC export (`redirects/gsc-clicks.csv`, 11 bytes = header only, verified directly); this task does not fabricate a forecast (proposed ruling **W-T15-2**).
5. **Site-health drill** (Gate A checklist item 7) — an owner-run rehearsal with the external monitor; `/api/site-health` itself already answers correctly (Cycle 4's run proves it), the drill proves the human/monitor wiring, not the code. New `docs/OPERATING.md` § Site-health drill (Cycle 6) gives the owner the three-step procedure.
6. **Synthetic lead + digest** (Gate A checklist item 8) — not built; WP5 by the approved work-package order (D28: WP2 → Gate A/Phase A → WP3c → WP4 → WP5-gate → WP5 → …). Recorded as "no by design," not a T15 gap — proposed ruling **W-T15-1**: the controller and owner decide at Gate A whether the external uptime monitor + `/api/site-health` is an acceptable interim alarm or WP5's cron is pulled forward.
7. **Second human receiving** (Gate A checklist item 9) — **closed**: `docs/WEBSITE-HANDOFF.md` §3.1 already records a second alert recipient configured on the Ops Integrations screen (verified directly) — recorded here as configured, without the name or e-mail (they are not this task's to copy, and are not a secret either way).
8. **Forms end to end on staging with real Turnstile** and **13–15 forms → exactly one `generate_lead` + one submission** (Gate A checklist items 4–5) — T14's own ledger lines are the evidence; T15 references them, does not re-run T14's proof.

Nothing above is invented by this task: every blocking item traces to a named D26/§10 row or a named Gate A checklist item, and every non-blocking item is recorded as such rather than silently upgraded to "done."

No commit for this cycle — Steps 1–4 are the evidence Cycle 6 writes down.

---

- [ ] **Cycle 6 — The readiness record: `docs/WEBSITE-HANDOFF.md`, `docs/OPERATING.md`, execution rulings, the ledger line**

Doc scope for this task is deliberately narrow (see the opening note): `docs/WEBSITE-HANDOFF.md` §1/§3.2/§5, `docs/OPERATING.md` only where an owner check changed, plus the standing rulings log and the WP2b ledger — never `docs/PRD.md`/`SEO.md`/`CONTENT-MODEL.md`/`ANALYTICS.md`/`ARCHITECTURE.md`/`redirects.md`/`CLAUDE.md`/`DEPLOYMENT.md` (each is either already current, verified directly, or another task's standing obligation — see Foundation gaps).

- [ ] **Step 1: Write the failing check**

```bash
grep -n "4 of 15 task files reconciled" docs/WEBSITE-HANDOFF.md          # prints its line (stale count)
grep -n "pending §10 item 10" docs/OPERATING.md                          # prints its line
grep -n "^## Site-health drill" docs/OPERATING.md                        # prints nothing (section absent)
```

- [ ] **Step 2: Run to verify it fails**

Each grep behaves as noted above today.

- [ ] **Step 3: Implement**

**`docs/WEBSITE-HANDOFF.md`**

- §1 table, current WP2b row (find with `grep -n '| WP2b '`) — replace the State cell:

  `Plan drafted, consistency-checked and ruled; reconcile of all 15 task files in progress (current count: `ls docs/superpowers/handoff-2026-09-25/wp2-planning/wp2b/fixed/*.md | wc -l`); T15 (Gate A prep) reconciled <date>; execution not started`

- §1 table, current Gate A / WP7a row (find with `grep -n '| Gate A / WP7a '`) — replace the What cell:

  `Launch checklist (spec §5) + cutover (the two `main` deploy guards on the one Vercel project — §3.2, never a domain move)`

- §3.2, immediately after the existing bullet beginning `**Binding preview gate (2026-09-29, deployment `02ace58`…)`** (find with `grep -n 'Binding preview gate'`) — append a new bullet (fill every `<…>` from Cycles 3–5's real output; never invent a number):

  ```md
  - **Binding WP2b launch-profile preview gate (<date>, deployment `<id>`):** `gate:launch` OK — every route in `GATE_ROUTE_TABLE` swept in both locales (`UNBUILT_PATHNAMES` empty, the W152/W158 dead-target + CTA-anchor sweep green, the W21 route-coverage check green — Task 15); js-size (binding, worst of 3) <worst route> <bytes> B (headroom <n> B to 204,800); LCP median <range> ms; performance <min>; `npm run sweep:legacy` <n>/20 single-hop + 2 keep, no 429; pixel home/hire/calc/blog-article tr+en — 7 of 8 scored (`blog-article`/`tr` a clean W4/W138 skip). Open items and the full per-route tables: `docs/superpowers/plans/2026-09-20-wp2b-pages.md`, T15 ledger row.
  ```

- §5, current step 7 (find with `grep -n '\*\*Gate A → WP7a'`) — append one sentence to the end of the existing paragraph (the rest of the step is already accurate — verified directly, including "moves the domains only if a second project was used (not the case now)"):

  `The Gate A readiness record itself (checklist status with a "how verified" column, the open-items list, the launch-profile evidence) is Task 15's output — §3.2 above and the T15 row in \`docs/superpowers/plans/2026-09-20-wp2b-pages.md\`.`

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

**`docs/superpowers/plans/2026-09-20-wp2-rulings.md`** — under `## Execution rulings`, after the last existing ruling (currently W161 — confirm with `grep -n 'W161'` before appending, in case a sibling reconcile task added more in the meantime), append:

```md
- **W-T15-1 Gate A row 8 (synthetic lead + digest) has no WP2 owner.** Both are WP5 deliverables by the approved work-package order (spec D28: WP2 → Gate A/Phase A → WP3c → WP4 → WP5-gate → WP5 → …). T15 records the row as "no by design"; the controller and owner decide at Gate A whether the external uptime monitor + `/api/site-health` (already live and correct — Cycle 4) is an acceptable interim alarm, or WP5's cron is pulled forward — why: the spec's Gate A checklist predates the work-package order it now sits inside — cost if wrong: a silent forms outage between cutover and WP5 is caught only by the lead-drought human check.
- **W-T15-2 Expected-loss forecast stays an owner/Fable item.** `docs/redirects.md` § Expected-loss forecast is still a placeholder pending the WP0 GSC export (`redirects/gsc-clicks.csv`, header-only, verified directly); T15 does not fabricate a forecast — why: D21 makes this forecast the check that the redirect map preserves traffic, which needs the export, not a guess — cost if wrong: Gate A checklist item 2 stays "open" until the export lands; WP7a must not proceed without it.
- **W-T15-3 A spoofed-Googlebot-UA Vercel Firewall challenge is not a redirect-map defect.** `npm run sweep:legacy`'s curl UA can be challenged (403 interstitial) by Bot Protection / Attack Challenge Mode; a real Googlebot passes reverse-DNS verification and is exempt, curl cannot. Re-run once with a plain browser UA to confirm the redirect layer, keep both tables — why: `docs/SEO.md` § Robots already records that a verified-crawler allowlist at the Firewall layer is not yet configured — cost if wrong: a false "429/403, redirects broken" alarm at Gate A.
- **W-T15-4 Launch-blocking placeholders are exactly the D26 Minimum Launchable Content ones.** Of the placeholder counter's slots, only `licence-pdf-*` (the four PDFs at `/hakkimizda#lisans`), one of `office-photo`/`founder-photo`, and the cookie-notice text block Gate A; every hero slot defaults to a gradient unless the spec §10 row 4 stock pack was actually sourced (open, not blocking); every other slot has an accepted auto-default or no §10 row at all — why: D26 names exactly the blocking set — cost if wrong: Gate A says yes with a dead licence block on the About page, or conversely stalls on slots the spec already auto-defaulted.
- **W-T15-5 `scripts/launch/route-coverage.launch-check.ts` closes the residual W21 gap.** Neither `unbuilt-routes.launch-check.ts` (W20 — every route has a page) nor `dead-targets.launch-check.ts` (W152/W158 — every listed route's links and CTA anchors resolve) proved `GATE_ROUTE_TABLE` itself lists every static route in both locales; this new file does, excluding dynamic keys (careers detail is derived live by `scripts/gate-routes.mjs`, W93; blog gets a one-locale-minimum soft check, W4) — why: `wp2b/check.md`'s `route_and_gate_gaps` finding named this gap with no owner — cost if wrong: a page task's missing gate row goes unnoticed until a human happens to visit that URL.
- **W-T15-6 The Vercel project is `jobsadmirewebsite`; there is no `jobsadmire-web-v2`.** Confirmed independently by three real preview deployment hostnames (`jobsadmirewebsite-fcif8p971`/`-ob96kp4oc`/`-3vdtznlg3`, `docs/superpowers/handoff-2026-09-25/wp2a-sdd/progress.md` lines 77/98/109) and by `docs/WEBSITE-HANDOFF.md` §3.2's own heading; no second project was created because the Vercel MCP reuses the linked one. Cutover (WP7a) removes the two guards on that one project (`vercel.json`'s `git.deploymentEnabled.main:false` + the Ignored Build Step) — it is not a domain move between two projects, and `docs/WEBSITE-HANDOFF.md` §3.2/§5 already say so correctly. `docs/DEPLOYMENT.md`'s "Two Vercel projects" table and § Phase A cutover, plus `CLAUDE.md`'s and `docs/ARCHITECTURE.md`'s "two projects exist" sentences, still describe the original two-project plan and are stale on this one point — flagged here, not corrected by T15 (WP7a is explicitly out of this task's scope) — why: acting on the stale text at cutover time would mean looking for a project that will never exist — cost if wrong: a confused, delayed WP7a.
```

**`docs/superpowers/plans/2026-09-20-wp2b-pages.md`** — append the T15 row to the `## Ledger` table (created by T1 per W98; by W99 every earlier task's row is already there):

```md
| T15 Gate A prep | — (sweeps every route, adds no page) | js-size (binding, worst of 3): <worst route> <n> B (ceiling 204,800, lazy line 194,560; every route under ceiling) | LH mobile, median of 3, DevTools throttling: perf ≥ <min> across indexable routes · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP ≤ <max> ms | pixel home/hire/calc/blog-article tr+en, 7 of 8 scored (blog-article/tr skipped, W4/W138); run 2 of 2 (preview-confirmed, no new iteration spent) | <YYYY-MM-DD> |
```

**Memory** (light touch, outside this repo — the only non-repo write, matching the draft's own framing and this programme's established practice of a resume note per pause): append one paragraph to `~/.claude/projects/-Users-agentfaraz-projects-admiregroup-jobsadmire/memory/website-programme-2026-09.md` — no secrets, no personal data:

```
**<date> — T15 (Gate A prep) reconciled.** B/fixed/task-15.md rewritten against the real,
already-built foundation: the preview-reachability and StickyCtaBar cycles the 2026-09-20 draft
planned are already built (WP2a Tasks 7 and 5 — verified directly in e2e/helpers/{bypass,face}.ts,
lighthouserc.preview.json, StickyCtaBar.tsx). T15's real remaining work: a new route-coverage
launch-check (closes the W21 gap dead-targets/unbuilt-routes don't cover), the Googlebot legacy
sweep (npm run sweep:legacy, new), the local W126 proof, the binding preview run + measurements +
pixel scores, the placeholder/MLC reconciliation, and a narrowed doc sync (WEBSITE-HANDOFF.md
§1/§3.2/§5 + OPERATING.md only — PRD/SEO/CONTENT-MODEL/ANALYTICS/ARCHITECTURE/redirects.md/
CLAUDE.md/DEPLOYMENT.md are each already current or another task's own W98 obligation). Confirmed
independently: the Vercel project is jobsadmirewebsite, never jobsadmire-web-v2 (three real preview
hostnames prove it); cutover is the two-guard removal on that one project, not a domain move.
Not yet executed — this is the reconciled plan; T1–T14 must land first (W99).
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write docs/WEBSITE-HANDOFF.md docs/OPERATING.md docs/superpowers/plans/2026-09-20-wp2-rulings.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
grep -n "4 of 15 task files reconciled" docs/WEBSITE-HANDOFF.md   # prints nothing
grep -n "pending §10 item 10" docs/OPERATING.md                   # prints nothing
grep -n "^## Site-health drill" docs/OPERATING.md                 # prints its new heading
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1   # unaffected, still green
```

- [ ] **Step 5: Commit**

```bash
git add docs/WEBSITE-HANDOFF.md docs/OPERATING.md docs/superpowers/plans/2026-09-20-wp2-rulings.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(gate-a): Gate A readiness record — WEBSITE-HANDOFF status + binding run, OPERATING second-human/drill/weekly-check, execution rulings W-T15-1..6, WP2b ledger (T15)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

Then push `wp2/foundation` (previews only — `main` is still the live project's production branch until WP7a removes the two guards; nothing here touches `main`) and hand the controller the Gate A checklist with its open rows.

---

**Docs in this task:**
- `docs/WEBSITE-HANDOFF.md` — §1 table (WP2b row's real reconcile/execution state; the Gate A/WP7a row's "domain cutover" wording corrected to match what §3.2/§5 already say elsewhere in the same file); §3.2 (new binding-WP2b-launch-profile-gate bullet, same shape as the existing WP2a one); §5 step 7 (one added sentence pointing at the readiness record).
- `docs/OPERATING.md` — second-human parenthetical closed; new § Site-health drill; § Weekly five-minute owner check gains the `sweep:legacy` line.
- `docs/superpowers/plans/2026-09-20-wp2-rulings.md` — proposed execution rulings W-T15-1…6 (task-scoped labels; the controller's post-reconcile recheck assigns sequential W-numbers).
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T15 ledger row (W98 format).
- Memory: one status paragraph, outside the repo.
- **Explicitly not touched, and why:** `docs/PRD.md` (its `## 12` is already Task 9's "Calculator rules"; a Gate A status section has no home there under this repo's own doc map — that is `docs/WEBSITE-HANDOFF.md`'s job), `docs/SEO.md`/`docs/CONTENT-MODEL.md`/`docs/ANALYTICS.md` (each page task's own W98/general-rule obligation, already current or completed by T1–T14 before T15 runs), `docs/ARCHITECTURE.md` § Quality gate (items 5/6 already fully document the bypass header, the preview Lighthouse face and the launch profile — verified directly, nothing to add), `docs/redirects.md` (the sweep results live in the ledger, not baked into a rules doc — matching how point-in-time facts are kept out of stable-rules docs elsewhere in this programme), `CLAUDE.md` (out of the controller's named scope for this task), `docs/DEPLOYMENT.md` § Phase A cutover (a real fact there is stale — see Foundation gaps — but fixing it is WP7a content, explicitly excluded from T15's brief).

**Sys keys added:** none — T15 adds no page copy; the Cycle 6 doc edits are documentation, not `sys.*` strings.

**Package ids used:** 0 — this task renders no page; it cites CTA anchor ids (`proposal`, `request-form`, `calculator`, `tracks`, `permit-cta`, `message`, `report`, `pool`) and placeholder slot names other tasks already own, never a new or borrowed package string.

**CLIENT_SYS additions:** none — no client component reads a new `sys.*` namespace as a result of this task.

**Foundation gaps:**
1. `docs/DEPLOYMENT.md`'s "Two Vercel projects" table (current lines 7–10) and § Phase A cutover (current lines 14–24) still describe the original two-project plan (a domain move from `jobsadmirewebsite` to a newly-created `jobsadmire-web-v2`); `CLAUDE.md`'s "Environments and deploy" section and `docs/ARCHITECTURE.md`'s environments text repeat the same stale framing. Three independent, directly-verified facts contradict it: every real WP2a preview deployment hostname begins `jobsadmirewebsite-*`, `docs/WEBSITE-HANDOFF.md` §3.2's own heading already reads "project `jobsadmirewebsite`", and that file's §5 step 7 already says "moves the domains only if a second project was used (**not the case now**)". T15 does not fix `DEPLOYMENT.md`/`CLAUDE.md`/`ARCHITECTURE.md` itself — WP7a (the cutover task) is explicitly out of this task's brief — but records it here (and as ruling W-T15-6) so WP7a does not plan around a project that will never exist.
2. The spec §10 row 4 auto-default for the Homepage/Hire Workers hero slots is a **licensed stock pack**, not a gradient (the gradient is the default for every *other* photo slot). Nothing in the researched material shows a stock pack was ever sourced; if it was not, both hero slots render `ImageSlot`'s gradient fallback at Gate A. This is recorded as an open item (Cycle 5 Step 4, item 3), not silently treated as either "resolved by auto-default" or "blocking" — the D26 gate itself does not block on it either way, but a future reader should not assume the stock pack exists just because a gradient is rendering correctly.
3. `docs/redirects.md`'s "Disposition table" (the 517-legacy-URL-vs-49-rule reconciliation) is a separate, larger placeholder than the 20-URL Gate A sweep this task builds — still pending the same WP0 GSC export as the expected-loss forecast (W-T15-2). T15's 20-URL sweep is the Gate A checklist's own narrower requirement (spec §5's literal words) and does not attempt the full disposition table.
4. This task cannot itself supply the binding preview run's real numbers (deployment id, per-route bytes, LCP/perf medians, pixel percentages, sweep results) — every `<…>` placeholder in Cycles 4–6 is filled by the implementer from Cycles 3–5's actual output, never invented here.

**Ledger line:** `T15 Gate A prep — no route (sweeps every route) — gate:launch OK <date> on <preview> (every static pathnames route swept, both locales; W20/W152/W158/W21 all green); js-size binding worst-of-3 <route> <n> B of 204,800 (headroom <n>); LCP median <range> ms, performance ≥ <min>, a11y/bp/seo 1.00 across every indexable route; sweep:legacy <n>/20 single-hop + 2 keep, no 429; pixel home/hire/calc/blog-article tr+en 7 of 8 scored (blog-article/tr clean skip, W4/W138), no new iteration spent; placeholders reconciled against D26 + spec §10 — blocking: licence-pdf ×4, office/founder photo (×1 of 2), cookie notice; open: hero stock pack (§10 row 4), expected-loss forecast (GSC export pending), site-health drill (owner), synthetic lead/digest (WP5, Gate A row 8 "no by design"); second human — configured, closed; docs synced (WEBSITE-HANDOFF.md §1/§3.2/§5, OPERATING.md); rulings W-T15-1…6 proposed; memory line written.`
