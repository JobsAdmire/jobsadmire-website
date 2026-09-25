### Task 15: Gate A prep — `gate:launch` green on every route in both locales, sweeps, measurements, docs sync

**What this task is.** No page is built here. T15 is the last WP2b task: it proves, with committed evidence, that the fourteen pages T1–T13 ported and the forms T14 exercised can face Gate A ("can Phase A be public this week?", spec §5). It (1) makes the gate runnable against the protected Vercel preview at all — Deployment Protection and the preview `robots.txt` face both defeat the WP1 gate as shipped (Cycle 1), (2) runs `npm run gate:launch` on every route in both locales and pastes the D26 placeholder report reconciled against the §10 owner table (Cycle 3), (3) runs the Googlebot curl sweep over 20 legacy URLs (Cycle 2), (4) records the per-route JS size table, the Lighthouse triples and the D27 pixel scores for the four harness pages (Cycle 4), (5) closes the one instrumentation gap three page tasks reported (Cycle 5), and (6) syncs every doc the pages touched — PRD § status, SEO, CONTENT-MODEL, ANALYTICS, ARCHITECTURE, OPERATING, redirects, CLAUDE.md, the WP2 rulings log, the memory note — and reproduces the Gate A checklist with a "how verified" column (Cycle 6).

**Owner facts folded in (2026-09-20, owner message):** the GitHub repo is now connected to Vercel (previews build on push — subject to the author-e-mail rule in the memory note: a commit authored `admin@jobsadmire.com` may be skipped; push an empty commit `--author="Faraz (via Claude) <techadmiregroup@gmail.com>"` on the branch if no build appears), the Turnstile secrets are in place (Ops secret + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` on the Vercel Preview environment — Cycle 3 proves both through `/api/site-health`'s `ops.captcha`), and the second alert recipient is configured (Gate A row 9 — Cycle 6 records it without any personal data).

**Preconditions.** T1–T14 merged on `wp2/foundation`; a green Vercel preview of the branch head (or the stable alias `staging.jobsadmire.com` pointing at it); `VERCEL_AUTOMATION_BYPASS_SECRET` from the Vercel project's *Deployment Protection → Protection Bypass for Automation* panel (owner copies it once into the local shell; never into the repo). One heavy job at a time on this machine (Mac Studio rule): one `next build`, one Playwright run, one Lighthouse loop.

Rulings that shape this task: **W13 amended** (204,800 B ceiling; lazy line 194,560 B; the ledger records per-route script size), **W15** (T15 ≈ 1 agent-day; the four pixel pages are Homepage, Cost Calculator, Hire Workers, Blog Article), **W20** (`UNBUILT_PATHNAMES` empty), **W21** (one route list), **W22** (this task's ledger line goes to `docs/superpowers/plans/2026-09-20-wp2b-pages.md`; execution rulings to `…/2026-09-20-wp2-rulings.md`), **W4/W37** (`/blog` and `/blog/[slug]` are noindex — swept, never audited), **D26** (placeholder counter; a page's named LCP slot may not be a placeholder), **D27** (pixel harness two-iteration cap), **D21/R53** (single-hop 308/410; `/blog/*` is not a 410 prefix), **R50** (localhost LCP advisory; the preview run is binding).

**Files:**

Create
- `scripts/launch/bypass-headers.ts` — `protectionBypassHeaders(env)`: the one place the `x-vercel-protection-bypass` header is built (Cycle 1)
- `scripts/launch/bypass-headers.test.ts` (Cycle 1)
- `lighthouserc.preview.json` — `lighthouserc.json` + `skipAudits: ['is-crawlable']`, chosen by `gate.sh` for `*.vercel.app` / `staging.jobsadmire.com` (Cycle 1)
- `scripts/launch/legacy-urls.txt` — the 20 legacy URLs + 2 keep controls with their expected disposition (Cycle 2)
- `scripts/launch/legacy-sweep.sh` — the Googlebot curl sweep, `npm run sweep:legacy` (Cycle 2)
- `scripts/launch/legacy-sweep.test.ts` — pins the 22 expectations to `redirects/legacy.json` + `gone.json` + `pathnames` (Cycle 2)
- `scripts/launch/gate-routes.launch-check.ts` — launch-only: every `pathnames` route is in `GATE_ROUTE_TABLE` in both locales with the right `indexable` flag (Cycle 3)
- `src/app/robots.test.ts` — the exact production disallow list at Gate A (Cycle 3)

Modify
- `playwright.config.ts` (current lines 1–20, full file replaced) — `extraHTTPHeaders` from `protectionBypassHeaders` (Cycle 1)
- `scripts/gate.sh` (as left by T0e: the `npx lhci collect --additive` line inside the `for path in $LH_PATHS` loop, and the `if [[ "$E2E_BASE_URL" =~ …localhost… ]]` config selection block) — `--extra-headers`, the third config (Cycle 1)
- `scripts/placeholder-count.ts` (T0e; `fetchRoute()`'s `headers:` object) — bypass header (Cycle 1)
- `e2e/seo.spec.ts` (T0e; the test titled `robots.txt serves the production rules and points at the sitemap`) — preview-aware (Cycle 1)
- `.env.example` (current lines 1–6, append one row) and `docs/DEPLOYMENT.md` § Env table (current lines 36–43, one row) (Cycle 1)
- `package.json` scripts (after `"gate:launch"`) — `"sweep:legacy"` (Cycle 2)
- `src/design/chrome/StickyCtaBar.tsx` (T0d) — CTA anchors through `ContactLink` when `contactKindOf(href)` is non-null (Cycle 5, conditional)
- `docs/PRD.md` (current L92–L118: §10, §11; new §12 appended after L118) (Cycle 6)
- `docs/SEO.md` (§ Sitemap, § Robots, § Pages table as left by the page tasks) (Cycle 6)
- `docs/CONTENT-MODEL.md` (§ Adding copy, current L72–L74: append the Gate A namespace roll-up) (Cycle 6)
- `docs/ANALYTICS.md` (current L66: the "**WP1 wires exactly one of these seven events**" paragraph, as rewritten by T0c; replaced) (Cycle 6)
- `docs/ARCHITECTURE.md` (§ Quality gate as rewritten by T0e — items 5/6; § Environments table current L160–L164 Preview row; § Forms flow current L67 if T0a left "**Not yet built.**") (Cycle 6)
- `docs/OPERATING.md` (current L40–L46 synthetic lead/digest, L48–L50 second human, L52–L54 weekly check, L56–L58 sign-off) (Cycle 6)
- `docs/redirects.md` (current L60–L68 disposition table placeholder: append a "Gate A sweep" section before "## Expected-loss forecast") (Cycle 6)
- `CLAUDE.md` (doc map current L9–L24; "Routing" bullet current L28; Phase status current L70–L74) (Cycle 6)
- `docs/superpowers/plans/2026-09-20-wp2-rulings.md` (`## Execution rulings`, current L96–L98: append) (Cycle 6)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (ledger: the T15 line + the three pasted tables) (Cycles 3–4, 6)
- `~/.claude/projects/-Users-agentfaraz-projects-admiregroup-jobsadmire/memory/website-programme-2026-09.md` — one status line (Cycle 6; outside the repo, the only non-repo write)

Test
- `scripts/launch/bypass-headers.test.ts`, `scripts/launch/legacy-sweep.test.ts`, `src/app/robots.test.ts` (in `npm run verify`), `scripts/launch/gate-routes.launch-check.ts` (launch profile only), `src/design/chrome/StickyCtaBar.test.tsx` (Cycle 5, conditional), plus the runs: `npm run gate:launch`, `npm run sweep:legacy`, `npm run js-size`, `npm run pixel` × 8.

**Interfaces:**

Consumes (exact names)
- WP1: `pathnames`, `routing`, `Locale` (`@/i18n/routing`); `getPathname` (`@/i18n/navigation`); `redirects/legacy.json` (`{ from, to, status: 308, source }[]`, 328 rows), `redirects/gone.json` (19 prefixes, matched by `src/proxy.ts` as `pathname === p || pathname.startsWith(p + '/')`); `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts`; `playwright.config.ts`; `vitest.config.mts` (`include: scripts/**/*.test.ts`, `server.deps.inline: ['next-intl']` — R19, which is why the launch checks are Vitest files).
- T0c (Task 3): `NOINDEX_PATHNAMES`, `isNoindexPathname`, `noindexExternalPaths` (`@/lib/seo/routes`); `ContactLink` (`@/analytics/ContactLink`), `contactKindOf`, `useContactClick`, `CONTACT_PLACEMENTS` (`@/analytics/useContactClick`); `PARAM_ENUMS`, `ALLOWED_PARAMS` (`@/analytics/track`); `buttonClassName` (`@/design/primitives`).
- T0c/T0d (Task 4): `UNBUILT_PATHNAMES`, `robotsDisallowPaths(locale, unbuilt?)`, `OG_PAGE_KEYS` (`@/lib/seo/routes`); `DETAIL_SITEMAP_SOURCES` (`@/lib/seo/sitemap-sources`).
- T0d (Task 5): `StickyCtaBar({ message, ctas: StickyCta[], showAfterPx?, hideNearId?, live? })`, `StickyCta = { label; href; variant?; external? }`, `STICKY_CTA_HEIGHT_VAR` (`@/design/chrome/StickyCtaBar`); `Button`, `ButtonVariant`.
- T0e (Task 7): `GATE_ROUTE_TABLE`, `GATE_ROUTES`, `INDEXABLE_GATE_ROUTES`, `GateRoute` (`e2e/routes`); `scripts/gate-routes.mjs`; `scripts/gate.sh --profile=launch`; `scripts/js-size.mjs` (`summarizeLhrs`, `formatJsSizeTable`, `SCRIPT_CEILING = 204_800`, `LAZY_LINE = 194_560`); `scripts/placeholder-count.ts` (`scanPlaceholders`, `evaluateScan`, `formatReadinessTable`, writes `lighthouse-report/content-readiness.json`); `scripts/launch/unbuilt-routes.launch-check.ts` + `vitest.launch.config.mts` (include `scripts/launch/**/*.launch-check.ts`); `scripts/pixel-compare.ts` (`npm run pixel -- --page=home|hire|calc|blog-article --locale=tr|en --base=<url>`; `.pixel/report.json` keyed `<page>-<locale>` with `results: [{ width, designHeight, builtHeight, diffPixels, match }]`); `lighthouserc.json` / `lighthouserc.local.json` (`resource-summary:script:size ≤ 204800`).
- T0a (Task 2): `GET /api/site-health` body `ops: OpsPing` (`state: 'ok'|'off'|'unauthorized'|'unreachable'|'unconfigured'`, `captcha: 'configured'|'missing'|null`, `trippedForms`), `formBeacons: number`.
- T1–T13: their `GATE_ROUTE_TABLE` rows, `data-lcp-slot` / `data-placeholder` markup, `sys.*` namespaces, `docs/SEO.md` Pages rows; T14: the forms ledger lines (`generate_lead` = submission = 1 per instance).

Produces
- `scripts/launch/bypass-headers.ts`: `export function protectionBypassHeaders(env?: NodeJS.ProcessEnv): Record<string, string>` — `{}` when `VERCEL_AUTOMATION_BYPASS_SECRET` is unset/empty, else `{ 'x-vercel-protection-bypass': <secret> }`. Consumed by `playwright.config.ts`, `scripts/placeholder-count.ts`, `scripts/gate.sh` (through `node -e`), `scripts/launch/legacy-sweep.sh` (shell), and by WP7a's cutover checks.
- `lighthouserc.preview.json` and the three-way config choice in `gate.sh` (local → `.local`, `*.vercel.app` | `staging.jobsadmire.com` → `.preview`, anything else → `lighthouserc.json`).
- `npm run sweep:legacy` (`E2E_BASE_URL=… bash scripts/launch/legacy-sweep.sh`) + `scripts/launch/legacy-urls.txt` — the Gate A / WP7a legacy sweep, re-run against production after the domain move.
- The Gate A evidence in the WP2b ledger: content-readiness table, JS size table, Lighthouse triples, pixel scores, sweep table, the checklist with statuses; PRD §12; execution rulings W-T15-1…6.

---

- [ ] **Cycle 1 — The gate can reach a protected preview and score SEO 1.0 there (bypass header + preview robots face)**

Why first: `jobsadmire-web-v2` previews sit behind Vercel Authentication, so `lhci collect`, Playwright's `request` fixture, the placeholder counter and `curl` all receive the auth interstitial (401) unless they send `x-vercel-protection-bypass` — and even then the preview `robots.txt` (`Disallow: /`, `VERCEL_ENV != production`) makes Lighthouse's `is-crawlable` audit score 0 (verified in `node_modules/lighthouse/core/audits/seo/is-crawlable.js` L150–L176: it parses `/robots.txt` and marks the page blocked for every bot when `isAllowed()` is false), which drops `categories:seo` below the asserted 1.0 on every preview run. WP1 never ran the gate on a preview (PRD §11 says so), so nothing has hit this yet — unless a page task (T1 first) already did. **Guard:** `ls lighthouserc.preview.json scripts/launch/bypass-headers.ts 2>/dev/null; grep -n "extra-headers\|preview" scripts/gate.sh; grep -n "extraHTTPHeaders" playwright.config.ts`. If a page task already landed an equivalent, keep theirs, make sure every consumer below reads the same helper, and skip only the duplicated parts.

- [ ] **Step 1: Write the failing test**

`scripts/launch/bypass-headers.test.ts`:

```ts
/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { protectionBypassHeaders } from './bypass-headers';

describe('protectionBypassHeaders (Gate A, T15)', () => {
  it('is empty when the secret is unset or blank', () => {
    expect(protectionBypassHeaders({})).toEqual({});
    expect(protectionBypassHeaders({ VERCEL_AUTOMATION_BYPASS_SECRET: '' })).toEqual({});
    expect(protectionBypassHeaders({ VERCEL_AUTOMATION_BYPASS_SECRET: '   ' })).toEqual({});
  });

  it('sends exactly the Vercel bypass header when set', () => {
    expect(protectionBypassHeaders({ VERCEL_AUTOMATION_BYPASS_SECRET: 'abc123' })).toEqual({
      'x-vercel-protection-bypass': 'abc123',
    });
  });

  it('never leaks any other variable', () => {
    const h = protectionBypassHeaders({
      VERCEL_AUTOMATION_BYPASS_SECRET: 's',
      OPS_WEBSITE_WRITE_TOKEN: 'never',
    });
    expect(Object.keys(h)).toEqual(['x-vercel-protection-bypass']);
  });
});
```

Run line: `npx vitest run scripts/launch/bypass-headers.test.ts`

- [ ] **Step 2: Run to verify it fails**

`Error: Failed to load url ./bypass-headers` — the module does not exist.

- [ ] **Step 3: Implement**

`scripts/launch/bypass-headers.ts` (new — no `server-only`, no Next import: Playwright's config loader, `tsx` and Vitest all import it):

```ts
/**
 * Vercel Deployment Protection ("Protection Bypass for Automation"): a preview answers every
 * request without this header with the authentication interstitial, which is what Lighthouse,
 * Playwright's `request` fixture, the placeholder counter and curl would otherwise audit.
 * The secret comes from the Vercel project (Settings → Deployment Protection), lives only in
 * the operator's shell for a gate run, and is never written anywhere in this repo (D6 posture:
 * secrets stay out of git; `.env.example` lists the name with an empty value).
 */
export const BYPASS_HEADER = 'x-vercel-protection-bypass' as const;

export function protectionBypassHeaders(
  env: NodeJS.ProcessEnv = process.env,
): Record<string, string> {
  const secret = env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  return secret ? { [BYPASS_HEADER]: secret } : {};
}
```

`playwright.config.ts` (replaces the whole file, current lines 1–20):

```ts
import { defineConfig, devices } from '@playwright/test';
import { protectionBypassHeaders } from './scripts/launch/bypass-headers';

// Gate runs target a URL (preview or local); see scripts/gate.sh. Against a protected Vercel
// preview, VERCEL_AUTOMATION_BYPASS_SECRET (Deployment Protection → Protection Bypass for
// Automation) is sent on every page and request-fixture call; unset locally it adds nothing.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    extraHTTPHeaders: protectionBypassHeaders(process.env),
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
});
```

`lighthouserc.preview.json` (new — identical to `lighthouserc.json` except `_comment` and `collect.settings.skipAudits`; copy `lighthouserc.json` and apply exactly these two changes so the assertions block stays byte-identical):

```json
{
  "_comment": "Preview face of lighthouserc.json (T15, ruling W-T15-1). Every non-production deployment answers robots.txt with `Disallow: /` (src/app/robots.ts, VERCEL_ENV-driven), and Lighthouse's is-crawlable audit reads robots.txt, so categories:seo could never reach the asserted 1.0 on a preview. The audit is skipped HERE ONLY — src/app/robots.test.ts pins the production disallow list and e2e/seo.spec.ts proves no indexable route carries a noindex meta, so the fact the audit checks is still asserted, by tests that can see the production face. Every other assertion, including the 204,800 B script ceiling (W13 amended) and LCP as an error, is the same as lighthouserc.json. scripts/gate.sh picks this file for *.vercel.app and staging.jobsadmire.com; production runs (after WP7a) use lighthouserc.json with the audit live.",
  "ci": {
    "collect": {
      "numberOfRuns": 2,
      "settings": { "formFactor": "mobile", "skipAudits": ["is-crawlable"] }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 1 }],
        "categories:seo": ["error", { "minScore": 1 }],
        "resource-summary:script:size": ["error", { "maxNumericValue": 204800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": "./lighthouse-report" }
  }
}
```

(`skipAudits` under `collect.settings` is what `lhci collect` passes to Lighthouse; a skipped audit is excluded from its category's score, not counted as 0. `collect` reads the config from `lighthouserc.json` by default — so the `collect` loop below passes `--config="$LHCI_CONFIG"` too, otherwise the skip never reaches the run.)

`scripts/gate.sh` — three edits to T0e's file:

(a) Right after `export E2E_BASE_URL` / the `echo "gate → …"` line, add the config selection (move it up from below `lhci upload`; the block that today reads `if [[ "$E2E_BASE_URL" =~ ^https?://(localhost|127\.0\.0\.1)(:|/|$) ]]; then LHCI_CONFIG=lighthouserc.local.json else LHCI_CONFIG=lighthouserc.json fi` is replaced by this and deleted from its old place):

```bash
# R50 + W-T15-1: three faces of the same assertions. localhost → LCP is a warning (Lantern);
# a Vercel preview or the staging alias → is-crawlable is skipped (the preview robots.txt is
# `Disallow: /` and would zero categories:seo); anything else (production after WP7a) → the
# full file. Only `collect` settings and one assertion level differ; the budgets are identical.
if [[ "$E2E_BASE_URL" =~ ^https?://(localhost|127\.0\.0\.1)(:|/|$) ]]; then
  LHCI_CONFIG=lighthouserc.local.json
elif [[ "$E2E_BASE_URL" =~ \.vercel\.app(:|/|$) || "$E2E_BASE_URL" =~ ^https?://staging\.jobsadmire\.com(:|/|$) ]]; then
  LHCI_CONFIG=lighthouserc.preview.json
else
  LHCI_CONFIG=lighthouserc.json
fi
# Deployment Protection (Vercel Authentication on every preview): Playwright reads the secret
# itself (playwright.config.ts); Lighthouse gets it as --extra-headers. Unset = no header.
LHCI_EXTRA="$(node -e 'const {protectionBypassHeaders}=require("tsx/cjs/api").require("./scripts/launch/bypass-headers.ts", __filename);process.stdout.write(JSON.stringify(protectionBypassHeaders(process.env)))')"
if [ "$LHCI_EXTRA" = "{}" ]; then
  if [ "$LHCI_CONFIG" = lighthouserc.preview.json ]; then
    echo "gate: warning — VERCEL_AUTOMATION_BYPASS_SECRET unset; a protected preview will answer 401 to Lighthouse and Playwright"
  fi
  LHCI_EXTRA=""
fi
echo "gate: config $LHCI_CONFIG"
```

(b) The `lhci collect` line inside `for path in $LH_PATHS; do … done` becomes:

```bash
  npx lhci collect --additive --config="$LHCI_CONFIG" ${LHCI_EXTRA:+--extra-headers="$LHCI_EXTRA"} --url="${E2E_BASE_URL}${path}" >/dev/null
```

(c) The assert line stays `npx lhci assert --config="$LHCI_CONFIG"`; the `echo "gate: asserting with $LHCI_CONFIG"` line stays.

(`tsx/cjs/api`'s `require(specifier, parentFile)` loads a `.ts` file from a CommonJS `node -e` context — `tsx` is already a devDependency, used by `scripts/gate-routes.mjs` through `tsx/esm/api`. If the installed `tsx` predates `tsx/cjs/api` (< 4.8), replace the one-liner with `npx tsx -e '…'` and the same body.)

`scripts/placeholder-count.ts` (T0e) — in `fetchRoute()`, the `headers: { accept: 'text/html' }` object becomes `headers: { accept: 'text/html', ...protectionBypassHeaders(process.env) }`, and the file gains `import { protectionBypassHeaders } from './launch/bypass-headers';` beside its other imports. Nothing else changes; the script's tests are pure and unaffected.

`e2e/seo.spec.ts` (T0e) — replace the test titled `robots.txt serves the production rules and points at the sitemap` with:

```ts
test('robots.txt is well-formed for the face this URL wears (production rules or preview lockdown)', async ({
  request,
}) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  // A preview (VERCEL_ENV set and not 'production') answers `Disallow: /` and nothing else;
  // the production rule set is only visible on production or a local `next start` (VERCEL_ENV
  // unset). src/app/robots.test.ts pins the production list exactly; here we prove whichever
  // face this base URL wears is the intended one and not a half-way mixture.
  const previewFace = /^Disallow: \/\s*$/m.test(body) && !/^Allow:/m.test(body);
  if (previewFace) {
    test.info().annotations.push({ type: 'face', description: 'preview: Disallow: /' });
    expect(body).not.toContain('Sitemap:');
    return;
  }
  test.info().annotations.push({ type: 'face', description: 'production rules' });
  expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  expect(body).toContain('Allow: /');
  for (const path of ['/tesekkurler', '/en/thank-you', '/portal-girisi', '/en/portal-login', '/blog', '/en/blog']) {
    expect(body).toContain(`Disallow: ${path}`);
  }
});
```

`.env.example` — append after the `NEXT_PUBLIC_SITE_URL=` line (current line 6):

```
# Gate runs against a protected Vercel preview (Deployment Protection → Protection Bypass for
# Automation). Operator's shell only; never committed, never set on Vercel itself.
VERCEL_AUTOMATION_BYPASS_SECRET=
```

`docs/DEPLOYMENT.md` — in the env table (current lines 36–43), add a row after `NEXT_PUBLIC_TURNSTILE_SITE_KEY`:

```md
| `VERCEL_AUTOMATION_BYPASS_SECRET`  | **Operator-side only, never a project variable** — the Deployment Protection bypass secret (Vercel → Settings → Deployment Protection → Protection Bypass for Automation), exported in the shell that runs `npm run gate` / `gate:launch` / `sweep:legacy` against a preview; `scripts/launch/bypass-headers.ts` turns it into the `x-vercel-protection-bypass` header (T15) |
```

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx prettier --write scripts/launch/bypass-headers.ts scripts/launch/bypass-headers.test.ts playwright.config.ts lighthouserc.preview.json scripts/placeholder-count.ts e2e/seo.spec.ts docs/DEPLOYMENT.md
npx vitest run scripts/launch/bypass-headers.test.ts        # 3 passed
npx vitest run scripts/js-size.test.ts                       # still green — it reads lighthouserc.json + .local only
npm run verify                                               # green
# Prove the header reaches every consumer, against the preview of the branch head:
export E2E_BASE_URL=https://<preview>.vercel.app VERCEL_AUTOMATION_BYPASS_SECRET=<from the owner>
curl -sS -o /dev/null -w '%{http_code}\n' "$E2E_BASE_URL/api/site-health"                                   # 401 (protected)
curl -sS -o /dev/null -w '%{http_code}\n' -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" "$E2E_BASE_URL/api/site-health"   # 200
npx playwright test e2e/seo.spec.ts --project=desktop        # green; the robots test annotates "preview: Disallow: /"
npx lhci collect --config=lighthouserc.preview.json --extra-headers="{\"x-vercel-protection-bypass\":\"$VERCEL_AUTOMATION_BYPASS_SECRET\"}" --url="$E2E_BASE_URL/en" >/dev/null && npx lhci assert --config=lighthouserc.preview.json
```
Expected: the single-path assert passes with `categories:seo` = 1 (is-crawlable skipped) — if it still reports `is-crawlable`, the `--config` did not reach `collect` (check the flag spelling). Record the two curl codes in the ledger.

- [ ] **Step 5: Commit**

```bash
git add scripts/launch/bypass-headers.ts scripts/launch/bypass-headers.test.ts playwright.config.ts lighthouserc.preview.json scripts/gate.sh scripts/placeholder-count.ts e2e/seo.spec.ts .env.example docs/DEPLOYMENT.md
git commit -m "feat(gate): reach protected previews — bypass header everywhere, preview Lighthouse face without is-crawlable (T15, W-T15-1)

Vercel Authentication on previews returned 401 to Lighthouse/Playwright/curl, and the preview
robots.txt (Disallow: /) zeroed is-crawlable so categories:seo could never hit 1.0 there.
protectionBypassHeaders() is the one place the x-vercel-protection-bypass header is built;
gate.sh picks lighthouserc.preview.json for *.vercel.app / staging and passes --extra-headers.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 2 — The Googlebot curl sweep: 20 legacy URLs → single-hop 308/410, no 429**

- [ ] **Step 1: Write the failing test**

`scripts/launch/legacy-urls.txt` (new; tab-separated `path  expect  location`; `keep` rows are live-route controls, not part of the 20):

```
# Gate A legacy sweep (spec §5): 20 old URLs + 2 keep controls. Columns: path <TAB> expect <TAB> location
# expect = 308 (single hop to `location`), 410 (gone prefix, src/proxy.ts), keep (live route, must answer 200 and never redirect)
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

`scripts/launch/legacy-sweep.test.ts` (new — pure data: pins every row of the file to `redirects/legacy.json`, `redirects/gone.json` and the live `pathnames` table, so the network sweep can only disagree with the data if the deployment is wrong, never because the file drifted):

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
      const [path, expect, location = ''] = l.split('\t');
      return { path, expect: expect as Row['expect'], location };
    });
}

const rows = parseLegacyUrls(readFileSync(join(__dirname, 'legacy-urls.txt'), 'utf8'));
const byFrom = new Map((legacy as { from: string; to: string; status: number }[]).map((r) => [r.from, r]));
const GONE = gone as string[];
const isGone = (p: string) => GONE.some((g) => p === g || p.startsWith(g.endsWith('/') ? g : `${g}/`));
const stripHash = (p: string) => p.replace(/#.*$/, '');

// Every external path the new site serves (static routes only; the two dynamic keys need a slug).
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
        expect(rule, `${row.path} is not in redirects/legacy.json`).toBeDefined();
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

Run line: `npx vitest run scripts/launch/legacy-sweep.test.ts`

- [ ] **Step 2: Run to verify it fails**

`ENOENT: no such file or directory, open '…/scripts/launch/legacy-urls.txt'` before the file exists; with the file present and an invented row (e.g. change `/visa` to `/visas`), `"/visas → 410 (gone prefix)"` fails — that is the guard against the list drifting from the data.

- [ ] **Step 3: Implement**

`scripts/launch/legacy-sweep.sh` (new):

```bash
#!/usr/bin/env bash
# Gate A (spec §5) / WP7a: the Googlebot curl sweep. Every legacy URL in scripts/launch/legacy-urls.txt
# must answer in ONE hop — 308 with the exact Location (D21, next.config.ts redirects), 410 for a
# gone prefix (src/proxy.ts) — and never 429 (the old site's measured failure mode: crawlers
# rate-limited). `keep` rows are live routes that must answer 200 and never redirect (R33).
# Usage: E2E_BASE_URL=https://<preview-or-production> npm run sweep:legacy
#        VERCEL_AUTOMATION_BYPASS_SECRET=… for a protected preview (scripts/launch/bypass-headers.ts).
# Prints a markdown table (paste it into the ledger / docs/redirects.md) and exits 1 on any miss.
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

`package.json` `scripts` — add after `"gate:launch"`: `"sweep:legacy": "bash scripts/launch/legacy-sweep.sh",`.

A Vercel Firewall "challenge" (403 with an interstitial) on the spoofed Googlebot UA is not a redirect defect: it means Bot Protection / Attack Challenge Mode is challenging unverified crawler UAs. Record it as a finding for the D13 verified-crawler allowlist (a real Googlebot passes reverse-DNS verification and is exempt; the curl is not), re-run once with the UA line replaced by a plain browser UA to confirm the redirect layer, and paste both tables.

- [ ] **Step 4: Run tests + npm run verify**

```bash
chmod +x scripts/launch/legacy-sweep.sh
npx prettier --write scripts/launch/legacy-sweep.test.ts package.json
npx vitest run scripts/launch/legacy-sweep.test.ts           # 23 passed (1 + 22 rows)
npm run verify                                               # green
E2E_BASE_URL=https://<preview>.vercel.app VERCEL_AUTOMATION_BYPASS_SECRET=… npm run sweep:legacy
```
Expected on the preview: 22 `ok` rows — `/certifications` shows `location /en/about#lisans`, second hop 200; `/tr/home` → `/`, second hop 200; the three 410s; `/` and `/blog` 200 (`/blog` is noindex but built — a 404 there means T12 did not land or `[...rest]` caught it). Paste the table into the WP2b ledger under "T15 — legacy sweep (preview <url>, <date>)". It is re-run verbatim against `https://www.jobsadmire.com` at WP7a.

- [ ] **Step 5: Commit**

```bash
git add scripts/launch/legacy-urls.txt scripts/launch/legacy-sweep.sh scripts/launch/legacy-sweep.test.ts package.json
git commit -m "feat(gate): Googlebot legacy sweep — 20 old URLs single-hop 308/410, keep controls, data-pinned (T15, Gate A)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 3 — Route table complete, robots/sitemap sweep, `npm run gate:launch` green, placeholder report reconciled**

- [ ] **Step 1: Write the failing tests**

`scripts/launch/gate-routes.launch-check.ts` (new; picked up by `vitest.launch.config.mts`'s `scripts/launch/**/*.launch-check.ts` include — launch profile only, because it is meant to fail until the last page task has appended its rows):

```ts
/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { GATE_ROUTE_TABLE } from '../../e2e/routes';
import { getPathname } from '@/i18n/navigation';
import { pathnames, routing } from '@/i18n/routing';
import { isNoindexPathname } from '@/lib/seo/routes';

// W21: every page task appends its two locale paths. At Gate A the table must cover every
// static pathnames route in BOTH locales with the right `indexable` flag, and carry one live
// detail route per dynamic key (careers detail indexable, blog article noindex — W4).
const stripQuery = (p: string) => p.replace(/\?.*$/, '');
const byPath = new Map(GATE_ROUTE_TABLE.map((r) => [stripQuery(r.path), r]));

describe('GATE_ROUTE_TABLE covers every route in both locales (T15, W21)', () => {
  for (const href of Object.keys(pathnames) as (keyof typeof pathnames)[]) {
    if (href.includes('[')) continue;
    for (const locale of routing.locales) {
      const external = getPathname({ locale, href });
      it(`${locale} ${href} → ${external} is swept, indexable=${!isNoindexPathname(href)}`, () => {
        const row = byPath.get(external);
        expect(row, `${external} missing from e2e/routes.ts`).toBeDefined();
        expect(row?.indexable).toBe(!isNoindexPathname(href));
      });
    }
  }

  it('sweeps one careers detail route per locale (indexable) and one blog article (noindex)', () => {
    const paths = GATE_ROUTE_TABLE.map((r) => r.path);
    expect(paths.some((p) => /^\/kariyer\/[^/?]+$/.test(p))).toBe(true);
    expect(paths.some((p) => /^\/en\/careers\/[^/?]+$/.test(p))).toBe(true);
    const blog = GATE_ROUTE_TABLE.filter((r) => /^\/(en\/)?blog\/[^/?]+$/.test(r.path));
    expect(blog.length).toBeGreaterThan(0);
    for (const r of blog) expect(r.indexable).toBe(false);
  });

  it('has no duplicate paths', () => {
    const paths = GATE_ROUTE_TABLE.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
```

`src/app/robots.test.ts` (new — the "robots sweep": the exact production disallow list at Gate A, which no e2e run against a preview can see):

```ts
/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import robots from './robots';

// VERCEL_ENV is pinned to '' in vitest.config.mts, so this is the production face. At Gate A
// UNBUILT_PATHNAMES is empty (W20), so every NOINDEX route appears in both locales; the
// `/blog/[slug]` key folds into its parent `/blog` (W37). Order is robots.ts's: '/api/', TR, EN.
describe('robots.txt — production face at Gate A (T15)', () => {
  it('disallows /api/ and every noindex route in both locales, nothing else', () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rules.userAgent).toBe('*');
    expect(rules.allow).toBe('/');
    expect(rules.disallow).toEqual([
      '/api/',
      '/tesekkurler',
      '/portal-girisi',
      '/abone-onay',
      '/abonelikten-cik',
      '/blog',
      '/en/thank-you',
      '/en/portal-login',
      '/en/newsletter/confirm',
      '/en/newsletter/unsubscribe',
      '/en/blog',
    ]);
    expect(r.sitemap).toBe('https://www.jobsadmire.com/sitemap.xml');
  });

  it('locks a preview down entirely', () => {
    process.env.VERCEL_ENV = 'preview';
    try {
      const r = robots();
      const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
      expect(rules.disallow).toBe('/');
      expect(r.sitemap).toBeUndefined();
    } finally {
      process.env.VERCEL_ENV = '';
    }
  });
});
```

(If T0c's `robots.ts` returns `disallow` in a different order — e.g. `robotsDisallowPaths` folds per locale after de-duplication — keep the eleven paths and change only the order in the expectation; if `/blog` has left `NOINDEX_PATHNAMES` because six Turkish bodies arrived, drop the two blog rows. The asserted set is the fact; the order is `robots.ts`'s.)

Run lines: `npx vitest run --config vitest.launch.config.mts` (gate-routes check + T0e's UNBUILT check) and `npx vitest run src/app/robots.test.ts`.

- [ ] **Step 2: Run to verify it fails**

`npx vitest run --config vitest.launch.config.mts` fails for every route a page task forgot (the message names the external path — e.g. `"/en/thank-you missing from e2e/routes.ts"` if only `/tesekkurler?form=hire` was ever listed, or the legal pages if T13 appended only the TR half); the UNBUILT check fails if any page task left its key. `src/app/robots.test.ts` fails if any route is still in `UNBUILT_PATHNAMES` (its path is then missing from the list — that is the W20 mechanism showing).

- [ ] **Step 3: Implement**

1. `e2e/routes.ts` — append whatever the check names as missing, in the page's own locale pair, with `indexable: false` for `NOINDEX_PATHNAMES` routes (`/en/thank-you?form=hire` is the usual gap: the conversion page must be swept in both locales like every other route). Never remove a row a page task added.
2. `src/lib/seo/routes.ts` — if `UNBUILT_PATHNAMES` is not empty, do **not** empty it here: the page that owns the key is missing or was merged without its deletion — go back to that page task's commit (W20: "each page task deletes its own entry") and land the deletion there (a one-line follow-up commit on the same branch is acceptable; the point is that the page exists).
3. Run the launch profile against the preview and capture everything:

```bash
export E2E_BASE_URL=https://<preview>.vercel.app VERCEL_AUTOMATION_BYPASS_SECRET=… REVALIDATE_SECRET=<the preview's own>
npm run gate:launch 2>&1 | tee lighthouse-report/gate-launch.log      # Playwright both projects, axe, width sweep, Lighthouse on every indexable route, js-size, UNBUILT check, placeholder counter
node scripts/gate-routes.mjs --all | wc -l                             # the sweep size; paste it
curl -sS -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" "$E2E_BASE_URL/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -E 's#</?loc>##g' | tee lighthouse-report/sitemap-urls.txt | wc -l
curl -sS -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" "$E2E_BASE_URL/robots.txt"          # the preview face — expected `Disallow: /`
curl -sS -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" "$E2E_BASE_URL/api/site-health" | python3 -m json.tool | grep -E '"ok"|"state"|"captcha"|"trippedForms"|"formBeacons"|"source"|"commit"'
```

Expected sitemap count: **30 static URLs** (20 static `pathnames` keys − 5 noindex = 15 × 2 locales; `/blog` excluded by W4) **+ N careers-detail URLs** from `DETAIL_SITEMAP_SOURCES` (N = live openings × locales that have them — read N off the list and record it; 0 is legitimate when Ops lists no opening). `site-health`: `ok: true`, `source: LOCAL`, `ops.state: 'ok'` (door ON) or `'off'` (flag still off — record which), `ops.captcha: 'configured'` (**this is the proof of the owner's Turnstile secret on the Ops side**), `trippedForms: []`, `formBeacons` a number (0 on a fresh instance; a non-zero count after T14's deliberate failure paths is expected and logged).

4. Paste the placeholder counter's table (from `gate-launch.log`, the block after `gate: content readiness (D26)`) into the WP2b ledger and reconcile it against the expected inventory below. Every reported slot must appear in the table with its §10 row and owner; a slot the table does not list is either a new placeholder a page task added without naming it in its own docs (add it here, with the row it belongs to) or a leaked unnamed `data-placeholder` (the counter already fails the run for that — W55).

**Expected placeholder inventory at Gate A** (from the page tasks' own markup; the counter's actual output wins, this is the reconciliation key):

| Route pair | LCP slot | Expected `data-placeholder` slots | §10 row → owner | Launch-blocking? |
| --- | --- | --- | --- | --- |
| `/` · `/en` | `h1` | `v4-hero` | #4 hero photography → owner (auto-default: licensed stock pack) | no — the auto-default is a gradient; LCP = h1 |
| `/isci-talebi` · `/en/hire-workers` | `h1` | `hw-hero`, `portal-shortlist`, `portal-mobile-app` | #4 (hero); the two portal screenshots have no §10 row → owner ask (product screenshots, consented) | no |
| `/maliyet-hesaplayici` · `/en/hiring-cost-calculator` | `h1` | `calc-hero` | #4 "gradients elsewhere" → none | no |
| `/calisma-izni` · `/en/work-permit` | `h1` | `wp-hero` | #4 → none | no |
| `/ortak-olun` · `/en/partner-with-us` | `h1` | `partner-portal-screen`, `partner-portal-mobile` | no §10 row → owner ask (portal screenshots) | no |
| `/hakkimizda` · `/en/about` | `h1` | `office-photo`, `founder-photo`, `crm-dashboard`, `app-screen`, `licence-pdf-*` (five rows) | #3 founder/office photo + licence PDFs → owner | **yes, two of them**: D26 Minimum Launchable Content names "the four İŞKUR/ÖİB licence PDFs republished at `/hakkimizda#lisans`" and "one real founder/office photograph" — the `licence-pdf-*` rows and one of `office-photo`/`founder-photo` must be real files before Gate A says yes |
| `/iletisim` · `/en/contact` | `h1` | `contact-hero` | #4 → none | no |
| `/adaylar` · `/en/available-workers` | `h1` | `aw-hero` | #4 → none | no |
| `/basari-hikayeleri` · `/en/success-stories` | `h1` | `ss-hero` | #4 → none | no |
| `/temsilci-dogrulama` · `/en/verify` | `h1` | `rep-founder` | #3 → owner (strip hidden by W6; the slot is inside the hidden component only if T10 rendered it — 0 is also correct) | no |
| `/kariyer` · `/en/careers` (+ one detail pair) | `h1` | none expected (live data, no photo slots) | — | — |
| `/blog` · `/en/blog` (+ the EN article `/en/blog/turkey-work-permit-process-employer-guide`) | `h1` | `blog-cover-<key>` per rendered `PostCard` (one today) | #5 blog bodies → marketing | no (noindex, W4) |
| `/portal-girisi` · `/en/portal-login` | `h1` | none expected (W8 link-only chooser; the Android badge is a local SVG) | — | — |
| `/gizlilik`, `/kullanim-kosullari`, `/kvkk`, `/cerez-politikasi` (+ `/en/…`) | `h1` | as named by T13 for the counsel texts (KVKK, cookie policy — D14) | #6 counsel → owner | **cookie notice: yes** (D26 MLC: "Privacy/Terms + cookie notice"); KVKK: no if the minimal notice ships |
| `/tesekkurler?form=hire` · `/en/thank-you?form=hire`, `/abone-onay`, `/abonelikten-cik` (+ `/en/…`) | `h1` | none | — | — |

Record, per row, the counter's actual count and the "blocking?" verdict; the MLC-blocking rows become the owner-ask list in Cycle 6.

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx prettier --write scripts/launch/gate-routes.launch-check.ts src/app/robots.test.ts e2e/routes.ts
npx vitest run src/app/robots.test.ts                          # 2 passed
npx vitest run --config vitest.launch.config.mts               # 2 files, all green: UNBUILT empty + every route swept
npm run verify                                                 # green (the launch checks are outside the default include)
# The binding run, again, end to end (one job — nothing else building on the machine):
npm run gate:launch                                            # "gate: OK" with the readiness table printed and 0 problems
```
Expected `gate:launch` tail: `placeholder-count: <n> placeholder(s) across <m> route(s); no LCP slot is a placeholder` then `gate: OK`. A `FAIL: LCP slot "…" is a placeholder (D26)` row means a page task put `data-lcp-slot` on a gradient `ImageSlot` — fix in that page (`lcp` must be false while `src` is null; the h1 carries `data-lcp-slot="h1"`), never in the counter.

- [ ] **Step 5: Commit**

```bash
git add scripts/launch/gate-routes.launch-check.ts src/app/robots.test.ts e2e/routes.ts docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "test(gate): Gate A route coverage + production robots list; launch profile green on every route (T15, W20/W21)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 4 — Measurements: JS size per route, Lighthouse triples, pixel report for the four harness pages**

- [ ] **Step 1: Write the failing test**

No new code — the measurements are the test. The pass/fail is `lhci assert` (already green from Cycle 3) plus two ledger rules: no route over 194,560 B without a recorded lazy-loading pass (W13 amended), and each harness page within the two-iteration cap (D27).

- [ ] **Step 2: Run to verify it fails**

Not applicable.

- [ ] **Step 3: Implement (measure, record)**

```bash
npm run js-size | tee lighthouse-report/js-size.md                     # per-route table from Cycle 3's .lighthouseci (worst script size, headroom, median LCP, lowest score)
# Lighthouse triples per route (mobile, 2 runs): read the manifest, not the HTML reports
node -e '
const m=require("./lighthouse-report/manifest.json");
for (const r of m) console.log(`${new URL(r.url).pathname} perf ${r.summary.performance} a11y ${r.summary.accessibility} bp ${r.summary["best-practices"]} seo ${r.summary.seo}`);
' | sort -u | tee lighthouse-report/triples.txt
# D27 pixel harness — the four pages, both locales, against the same preview (needs network for the design runtime):
for p in home hire calc blog-article; do for l in tr en; do npm run pixel -- --page=$p --locale=$l --base="$E2E_BASE_URL"; done; done
node -e '
const r=require("./.pixel/report.json");
for (const [k,v] of Object.entries(r)) console.log(k, v.route, v.results.map(x=>`${x.width}:${(x.match*100).toFixed(1)}%`).join(" "));
' | tee lighthouse-report/pixel.txt
```

(`.pixel/` and `lighthouse-report/` are git-ignored; the three text files are pasted into the ledger, never committed. `npm run pixel` sends the bypass header only if T0e's `pixel-compare.ts` reads `protectionBypassHeaders` — if the built captures come back as the Vercel auth page (a near-0 % match on every width with a short `builtHeight`), add `...protectionBypassHeaders(process.env)` to its Playwright `extraHTTPHeaders` the same way as Cycle 1 and re-run; commit that one-line edit with this cycle.)

Ledger tables (paste into `docs/superpowers/plans/2026-09-20-wp2b-pages.md` under a `### T15 — Gate A measurements (<preview url>, <date>)` heading):

1. The `js-size` markdown table verbatim (`| route | script B (worst of 2 runs) | headroom to 204,800 | LCP ms (median) | perf (min) | note |`). Any row with `over 194,560` → the page's own lazy-loading pass is a **follow-up commit on that page** before Gate A (W13 amended: "before the next page starts" — at T15 that means before the gate is declared green); record the before/after bytes.
2. `| route | perf | a11y | bp | seo | LCP ms |` — one row per indexable route from `triples.txt`; every row `≥ 0.95 / 1.0 / 1.0 / 1.0 / ≤ 2500` on the preview (binding; R50).
3. `| harness page | locale | 390 | 900 | 1440 | iterations | named deltas |` — eight rows from `pixel.txt`. D27's cap: at most two fix-and-re-run passes per page (the page tasks already spent theirs — T15 spends none; a delta left is logged, never chased); the named deltas per page come from the page task's own ledger line (D20 contrast/threshold deltas, `/tesekkurler` navigation, W3 added fields, W6 empty states, gradient heroes).

- [ ] **Step 4: Run tests + npm run verify**

`npm run verify` (unchanged code unless the pixel-compare header edit happened — then green again). The three tables are in the ledger; every JS row is under the ceiling and either under the lazy line or annotated with its follow-up commit hash.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md scripts/pixel-compare.ts   # the script only if the header edit was needed
git commit -m "docs(wp2b): Gate A measurements — per-route JS size, Lighthouse triples, pixel scores for the four harness pages (T15)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 5 — Instrumentation completeness: `StickyCtaBar` contact CTAs fire `call_click` / `whatsapp_click` (conditional)**

Three page tasks (T4 Work Permit, T5 Partner, T8 Available Workers) reported the same foundation gap: `StickyCtaBar` (T0d) renders its `ctas` through `Button`, so a `tel:` or `wa.me` CTA in the bar is an untracked anchor (W12 — "all 14 pages instrumented" is a Gate A line). Pages worked around it by keeping only internal CTAs in the bar. **Guard:** `grep -n "ContactLink\|contactKindOf" src/design/chrome/StickyCtaBar.tsx`. If the bar already routes contact hrefs through `ContactLink`, skip this cycle and note "closed by T<n>" in the ledger.

- [ ] **Step 1: Write the failing test**

`src/design/chrome/StickyCtaBar.test.tsx` (new, or extend T0d's file if one exists — add only this `describe`):

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/calisma-izni' }));
vi.mock('next-intl', async (orig) => ({
  ...(await orig<typeof import('next-intl')>()),
  useLocale: () => 'tr',
}));

import { StickyCtaBar } from './StickyCtaBar';

describe('StickyCtaBar contact tracking (T15, W12)', () => {
  it('renders tel:/wa.me CTAs through ContactLink and pushes the click with placement page_cta', () => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    render(
      <StickyCtaBar
        message="m"
        showAfterPx={0}
        ctas={[
          { label: 'Ara', href: 'tel:+905011240340' },
          { label: 'WhatsApp', href: 'https://wa.me/905011240340?text=x', external: true },
          { label: 'Form', href: '/hire-workers' },
        ]}
      />,
    );
    // The bar is hidden until scrollY > showAfterPx; the anchors are in the DOM regardless.
    const call = screen.getByRole('link', { name: 'Ara' });
    call.click();
    const pushed = (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer;
    expect(pushed.at(-1)).toMatchObject({ event: 'call_click', page: '/calisma-izni', locale: 'tr', placement: 'page_cta' });
    const wa = screen.getByRole('link', { name: 'WhatsApp' });
    expect(wa).toHaveAttribute('target', '_blank');
    wa.click();
    expect(pushed.at(-1)).toMatchObject({ event: 'whatsapp_click', placement: 'page_cta' });
    // An internal CTA stays a plain routed link with no handler push.
    const before = pushed.length;
    screen.getByRole('link', { name: 'Form' }).click();
    expect(pushed.length).toBe(before);
  });
});
```

(How `track()` is observed — a `dataLayer` push — follows `src/analytics/track.ts`; if T0c's `track` tests observe it through a spy instead, mirror their approach. If the bar returns `null` before hydration/scroll and the anchors are not in the DOM, render with `showAfterPx={0}` and dispatch `window.scrollTo(0, 1)` + a `scroll` event inside `act()` first, as T0d's own visibility test does.)

- [ ] **Step 2: Run to verify it fails**

`npx vitest run src/design/chrome/StickyCtaBar.test.tsx` → the last pushed entry is `undefined` (no `call_click` push): the anchors are `Button`s.

- [ ] **Step 3: Implement**

`src/design/chrome/StickyCtaBar.tsx` (T0d; `'use client'`) — replace the CTA render (the `ctas.map(...)` that returns `<Button …>`) with:

```tsx
import { ContactLink } from '@/analytics/ContactLink';
import { contactKindOf } from '@/analytics/useContactClick';
import { Button, buttonClassName } from '@/design/primitives';
// …existing imports and component body unchanged above this point…

        {ctas.map((cta) =>
          contactKindOf(cta.href) ? (
            // W12/T15: a tel:/wa.me/mailto: CTA in the bar fires call_click/whatsapp_click/
            // email_click with placement 'page_cta' — the same door ContactCta uses in blocks.
            <ContactLink
              key={cta.href}
              href={cta.href}
              placement="page_cta"
              className={buttonClassName(cta.variant ?? 'primary', 'md')}
              {...(cta.external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              {cta.label}
            </ContactLink>
          ) : (
            <Button key={cta.href} variant={cta.variant ?? 'primary'} href={cta.href} external={cta.external}>
              {cta.label}
            </Button>
          ),
        )}
```

Keep every other prop, the `--sticky-cta-h` publication (W18), `hideNearId` and `live` exactly as T0d wrote them. `ContactLink` is same-tab by default (R22); `wa.me` gets `target`/`rel` only when the caller marks it `external`, matching T0d's `Button` behaviour.

Then, in the three page tasks' files, restore the design's Call / WhatsApp bar buttons where the page tasks dropped them (T4 `hideNearId="permit-cta"`, T5 `hideNearId="tracks"`, T8 `hideNearId="pool-cta"`): each page's `ctas` array gains `{ label: t('<its call id>'), href: telLink(settings.phone) }` and `{ label: t('<its whatsapp id>'), href: waLink(settings.whatsappNumber, <its prefill>), external: true }` before the internal CTA — the ids and prefills are the ones the page task used for its FAQ ask card / closing band (read the page's own `page.tsx`; never invent an id). Skip a page whose task explicitly ruled the bar single-CTA for layout reasons; say so in the ledger.

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx prettier --write src/design/chrome/StickyCtaBar.tsx src/design/chrome/StickyCtaBar.test.tsx
npx vitest run src/design/chrome                              # green, incl. T0d's own bar tests
npm run verify                                                # green
E2E_BASE_URL=… npx playwright test e2e/a11y.spec.ts --project=desktop   # the bar's anchors are still labelled buttons for axe
```

- [ ] **Step 5: Commit**

```bash
git add src/design/chrome/StickyCtaBar.tsx src/design/chrome/StickyCtaBar.test.tsx "src/app/[locale]/(site)/work-permit/page.tsx" "src/app/[locale]/(site)/partner-with-us/page.tsx" "src/app/[locale]/(site)/available-workers/page.tsx"
git commit -m "fix(chrome): StickyCtaBar routes contact CTAs through ContactLink — call/whatsapp clicks tracked with placement page_cta (T15, W12)

Closes the gap three page tasks reported; Work Permit, Partner and Available Workers regain the design's Call/WhatsApp bar buttons.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 6 — Docs sync, execution rulings, CLAUDE.md, memory line, the Gate A checklist with "how verified"**

- [ ] **Step 1: Write the failing test**

The docs' own guards: `npm run verify`'s `prettier --check` over every edited Markdown, plus three greps that must print nothing after Step 3:

```bash
grep -n "not yet run against a Vercel preview\|no route group\|Not yet built\*\* — no server action" CLAUDE.md docs/PRD.md docs/ARCHITECTURE.md   # stale WP1 sentences
grep -n "WP1 wires exactly one of these seven events" docs/ANALYTICS.md
grep -n "pending §10 item 10\|no default; required before Gate A" docs/PRD.md docs/OPERATING.md
```

- [ ] **Step 2: Run to verify it fails**

Each grep prints its line today (PRD L116/L118, CLAUDE.md L28, ANALYTICS L66 as rewritten by T0c, PRD L103, OPERATING L50).

- [ ] **Step 3: Implement**

**`docs/PRD.md`**

- §10 (current L92–L103): the "Second human for alerts" bullet becomes `- Second human for alerts — **configured 2026-09-20 (owner)**; the recipient's name/phone live in the Operations notification seed (I13), never in this repo.`; the "Hero photography" bullet appends ` — Gate A status: gradient auto-default on every hero (LCP = h1); the two named MLC slots (`v4-hero`, `hw-hero`) are owner asks recorded in §12.`; the "Founder name/title … licence PDFs" bullet appends ` — Gate A status: **launch-blocking** for the licence PDFs and one real photograph (D26 MLC), see §12.`
- §11 (current L105–L118): line 116's Quality-gate bullet — replace "the gate itself has not yet been run against a Vercel preview (pending the owner linking `jobsadmire-web-v2`)" with "first run against a Vercel preview in WP2 (T15: `gate:launch` green on every route in both locales, `docs/superpowers/plans/2026-09-20-wp2b-pages.md` ledger)". Line 118 (already rewritten by WP2a Task 4) — replace the whole paragraph with: `**Not yet built, by design (WP3c and later):** Sentry, the synthetic-lead cron and the daily digest (WP5 by plan order — see §12 Gate A rows 8), the Phase B `OPS` adapter flip and everything under §9.`
- Append after L118:

```md
## 12. WP2 delivered — Phase A status at Gate A (<date>)

Every route in §2 exists on `wp2/foundation` in both locales, on package content through the `LOCAL` adapter, with the forms wired to the Operations door (WP3a) and the visitor fallback panel. Evidence lives in the WP2b ledger (`docs/superpowers/plans/2026-09-20-wp2b-pages.md`, "T15 — Gate A"); this section is the durable summary.

| Route (TR · EN) | Forms (key) | LCP slot | Placeholders at Gate A | Script (gz, worst) | LH perf/a11y/bp/seo (min) |
| --- | --- | --- | --- | --- | --- |
| `/` · `/en` | hero → `hire`, call-me-back → `callback` | `h1` | `v4-hero` | <n> B | <…> |
| `/isci-talebi` · `/en/hire-workers` | quick-quote + request → `hire` | `h1` | `hw-hero`, `portal-shortlist`, `portal-mobile-app` | <n> B | <…> |
| `/maliyet-hesaplayici` · `/en/hiring-cost-calculator` | written quote → `calculator` | `h1` | `calc-hero` | <n> B | <…> |
| `/calisma-izni` · `/en/work-permit` | none (wizard stores nothing) | `h1` | `wp-hero` | <n> B | <…> |
| `/ortak-olun` · `/en/partner-with-us` | HR agency → `hire` (`iAm: hr_agency`); sourcing/institute → `partner` (`track`) | `h1` | `partner-portal-screen`, `partner-portal-mobile` | <n> B | <…> |
| `/hakkimizda` · `/en/about` | none | `h1` | `office-photo`, `founder-photo`, `crm-dashboard`, `app-screen`, `licence-pdf-*` ×5 | <n> B | <…> |
| `/iletisim` · `/en/contact` | message → `contact` (`topic`); callback → `callback`; visit → `visit` | `h1` | `contact-hero` | <n> B | <…> |
| `/adaylar` · `/en/available-workers` | request → `workers` | `h1` | `aw-hero` | <n> B | <…> |
| `/basari-hikayeleri` · `/en/success-stories` | none (empty wall, W6) | `h1` | `ss-hero` | <n> B | <…> |
| `/temsilci-dogrulama` · `/en/verify` | fraud report → `fraud` (+ evidence uploads) | `h1` | `rep-founder` | <n> B | <…> |
| `/kariyer` · `/en/careers`, `/kariyer/[slug]` · `/en/careers/[slug]` | apply → `careers` (CV proxy) | `h1` | — | <n> B | <…> |
| `/blog` · `/en/blog`, `/blog/[slug]` (noindex, W4) | newsletter band hidden (W5) | `h1` | `blog-cover-*` | <n> B | swept, not audited |
| `/portal-girisi` · `/en/portal-login` (noindex) | none (W8) | `h1` | — | <n> B | swept, not audited |
| `/gizlilik`, `/kullanim-kosullari`, `/kvkk`, `/cerez-politikasi` (+ `/en/…`) | none | `h1` | <as reported> | <n> B | <…> |
| `/tesekkurler`, `/abone-onay`, `/abonelikten-cik` (+ `/en/…`, noindex) | conversion page; RFC 8058 | `h1` | — | <n> B | swept, not audited |

Fill `<n>` / `<…>` from the ledger's JS-size and triples tables (Cycle 4). Every indexable route: performance ≥ 0.95, a11y/BP/SEO = 1.0, LCP ≤ 2.5 s on the preview, script ≤ 204,800 B (W13 amended); the four harness pages' pixel scores are in the ledger (D27, two-iteration cap).

**Gate A checklist (spec §5) — how each line was verified**

| # | Gate A item | How verified | Evidence | Status at T15 |
| --- | --- | --- | --- | --- |
| 1 | Minimum Launchable Content present or auto-defaulted (D26) | `npm run gate:launch` placeholder counter reconciled row by row against §10 (`docs/superpowers/plans/2026-09-20-wp2b-pages.md` "content readiness"); MLC items checked by name | content-readiness table; this §12 table | **partial** — 3,505 strings, metrics + rate config auto-defaulted (W1/W2), Privacy/Terms present; **open owner items:** the four licence PDFs (`licence-pdf-*`), one real founder/office photo, the minimal cookie notice (D14), hero stock for `v4-hero`/`hw-hero` (auto-default gradient accepted) |
| 2 | Expected-loss forecast signed | `docs/redirects.md` § Expected-loss forecast, from the WP0 GSC export joined to `redirects/rules.json` | `redirects/gsc-clicks.csv` | **open** — the GSC export has not landed (`gsc-clicks.csv` is header-only); owner + Fable, before WP7a |
| 3 | `gate --profile=launch` green on every page | Cycle 3 run on the preview: Playwright (both projects), axe, width sweep, Lighthouse on every indexable route, `UNBUILT_PATHNAMES` empty, placeholder counter | `gate-launch.log` excerpt + tables in the ledger | **yes** (<date>, <preview>) |
| 4 | Forms create inquiries end to end on staging with real Turnstile | T14's staging run per form instance (inquiry with `contactName` → assignment → notification → autoresponder) | T14 ledger lines | per T14: <yes/no> |
| 5 | All 13–15 forms produce exactly one `generate_lead` and one submission | T14's dataLayer capture + Ops inbox count per instance | T14 ledger table | per T14: <yes/no> |
| 6 | Googlebot curl sweep of 20 legacy URLs → single-hop 308/410, no 429 | `npm run sweep:legacy` (Cycle 2), pinned to the redirect data by `scripts/launch/legacy-sweep.test.ts` | sweep table in the ledger + `docs/redirects.md` § Gate A sweep | **yes** on the preview; re-run at WP7a on production |
| 7 | Site-health checks each broken deliberately → phone rings | Owner drill with the external monitor (`docs/OPERATING.md` § Site-health drill, written in this task): flip each failure, confirm the page | drill log (owner) | **open** — owner-run; `/api/site-health` itself answers 200 with `ops.captcha: configured` on the preview (Cycle 3) |
| 8 | Synthetic lead and digest running | Not built — WP5 by plan order (`docs/OPERATING.md`) | ruling W-T15-3 | **no by design** — the controller/owner decide whether Gate A accepts the deferral or WP5's cron lands first (spec §12 stop rule counts consecutive "no" weeks) |
| 9 | Second human receiving | Owner configured the recipient on 2026-09-20; Ops I13 seed carries it; T14's deliberate `WEBSITE_FORMS_UNAVAILABLE` path is the delivery proof | T14 ledger / Ops notification log | **yes** (delivery to be confirmed in T14's run) |
```

**`docs/SEO.md`**

- § Sitemap (as rewritten by WP2a Task 4 — find with `grep -n "UNBUILT_PATHNAMES" docs/SEO.md`): append one sentence to the paragraph: `**Gate A (<date>):** `UNBUILT_PATHNAMES` is empty; the preview sitemap lists 30 static URLs (15 indexable routes × 2 locales) plus <N> careers-detail URLs from `DETAIL_SITEMAP_SOURCES`; every `<loc>` answered 200 (`e2e/seo.spec.ts` sweep), and the launch profile asserts the set stays empty.`
- § Robots (find with `grep -n "^## Robots" docs/SEO.md`): append: `The production list at Gate A, pinned by `src/app/robots.test.ts`: `/api/`, `/tesekkurler`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik`, `/blog` and their `/en/…` forms (`/en/thank-you`, `/en/portal-login`, `/en/newsletter/confirm`, `/en/newsletter/unsubscribe`, `/en/blog`). On a preview the file is `Disallow: /` — which is why the gate's Lighthouse run against a preview skips `is-crawlable` (`lighthouserc.preview.json`, W-T15-1) and `e2e/seo.spec.ts` asserts whichever face the URL wears.`
- § Pages table (created by T1, one row per page task): verify every row of the §12 table above has a row here (title source, canonical, JSON-LD, LCP slot) — the pages that carry no forms and no page task row of their own (thank-you, the two newsletter pages, portal entry, the four legal pages) get one row each in the same shape if T13 did not add them; the LCP slot column is `h1` on every route at Gate A (no hero photo shipped — §10 #4 auto-default).

**`docs/CONTENT-MODEL.md`** — § Adding copy (current L72–L74): append a paragraph:

```md
**Namespaces in use at Gate A (T15).** `node -e 'const m=require("./src/messages/tr.json").sys;for (const k of Object.keys(m)) console.log(k, JSON.stringify(m[k]).match(/"[^"]+":"/g)?.length ?? 0)'` prints the roll-up; at Gate A the `sys.*` object carries: `form` (<n> keys, T0a), `nav`, `blocks`, `seo` (<n> page keys — every page whose record has `''` for its title/description ids), and the page namespaces `home`, `hire`, `calc`, `wp`, `partner`, `about`, `contact`, `workers`, `stories`, `verify`, `careers`, `blog`, `portal`, `legal`, `newsletter` (<n> keys each, listed per page in its task's "Sys keys added" line in the WP2b plan). `src/messages/messages.test.ts` asserts the TR and EN key sets are identical; a key present in one file only fails `npm run verify`.
```
(Replace each `<n>` with the printed count.)

**`docs/ANALYTICS.md`** — replace the paragraph that begins `**WP1 wires exactly one of these seven events` (current L66; T0c may have reworded it — find with `grep -n "wires exactly one" docs/ANALYTICS.md`) with:

```md
**Wired at Gate A (WP2, T15 audit).** All seven WP1 events and the five W12 page events (`partner_track_select`, `contact_topic`, `eligibility_check_complete`, `career_apply_start`, `verify_lookup`) have callers: `conversion` from `ConversionPing` on `/tesekkurler`; `generate_lead` from the forms kernel on every successful door submission (13–15 instances, one event each — T14's reconciliation); `call_click` / `whatsapp_click` / `email_click` from every `tel:`/`wa.me`/`mailto:` anchor in the chrome (`slimbar`, `footer`, `bottom_bar`, `social_rail`, `whatsapp_fab`), in the pages' `ContactCta`/`OfficeCard`/`StickyCtaBar` (`page_cta`, `office_card`) and in the fallback panels (`form_fallback`); `calculator_use` from the calculator island and the homepage teaser; `language_switch` from the switcher and the hint; the five page events from their islands with enum-only params (`PARAM_ENUMS` — a value outside its set is dropped before the push). **Parameter allowlist rule (enforced in `track()`, not by caller discipline):** no event, on any page, may ever carry a candidate name, phone number, email, free-text form content, or any other identifier a visitor typed into a form — the event only ever sees `form_key`, page context and enum keys. The per-page wiring lines below are each page task's record.
```

**`docs/ARCHITECTURE.md`**

- § Quality gate item 5 (T0e's "LCP is an error against a preview…" paragraph): append: `**Reaching a preview at all (W-T15-1):** every `jobsadmire-web-v2` preview sits behind Vercel Authentication, so Playwright (`playwright.config.ts` → `extraHTTPHeaders`), Lighthouse (`--extra-headers`), the placeholder counter and `npm run sweep:legacy` send `x-vercel-protection-bypass` built by `scripts/launch/bypass-headers.ts` from `VERCEL_AUTOMATION_BYPASS_SECRET` (operator shell only). And because a preview's `robots.txt` is `Disallow: /`, Lighthouse's `is-crawlable` audit (which parses robots.txt) would zero `categories:seo` there — `gate.sh` therefore asserts previews with `lighthouserc.preview.json`, identical but for `skipAudits: ['is-crawlable']`; the production list is pinned by `src/app/robots.test.ts` and the meta-robots rule by `e2e/seo.spec.ts`, so nothing the audit checks goes unasserted. Production runs (after WP7a) use `lighthouserc.json` with the audit live.`
- § Quality gate item 6 (launch profile): append: `First green launch run: <date> against <preview>, all <m> routes in both locales, <n> placeholders, 0 LCP-slot violations, `UNBUILT_PATHNAMES` empty — the T15 ledger in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`.`
- § Environments table (current L160–L164), Preview row's Indexing cell: `` `noindex` via robots (`Disallow: /`), Deployment Protection on — gate runs need `VERCEL_AUTOMATION_BYPASS_SECRET` (`docs/DEPLOYMENT.md`) ``.
- § Forms flow (current L65–L67): if the opening line still reads `**Not yet built.** No server action…` (T0a should have replaced it — `grep -n "Not yet built" docs/ARCHITECTURE.md`), replace that first paragraph with: `Built in WP2a (T0a) and wired on every page in WP2b: one factory (`createFormAction`) over one server-only transport (`postForm`: one immediate retry on a network error/timeout/5xx inside an 8 s budget, never after a 4xx — W3) and one client shell (`FormShell`: honeypot, Turnstile on first interaction, consent, submit, fallback panel). Proven end to end on staging in T14.`

**`docs/OPERATING.md`**

- § Synthetic lead (current L40–L42) and § Daily digest (L44–L46): keep "**Not yet built**" and append to each: `**Gate A status (T15):** not built — WP5 by plan order; recorded as Gate A row 8 "no by design" pending the ruling in `docs/superpowers/plans/2026-09-20-wp2-rulings.md` (W-T15-3).`
- § External monitor and second human (current L48–L50): replace the parenthetical `(pending §10 item 10 — name + phone/email required before Gate A, no default)` with `(configured by the owner on 2026-09-20 — §10 item 10 closed; the recipient's contact details live only in the Operations notification seed, I13)`.
- New section before § Weekly five-minute owner check:

```md
## Site-health drill (Gate A row 7)

Run once before Gate A, by the owner, with the external monitor armed: (1) point the monitor at a URL that 503s (any preview's `/api/site-health` with `CONTENT_SOURCE=OPS` and no token answers `fail` on `bundleTr`) and confirm the phone rings within the monitor's interval; (2) on Operations, flip a form off in the Integrations screen and confirm `trippedForms`/`WEBSITE_FORMS_UNAVAILABLE` reaches both recipients (T14 exercised the same path); (3) restore both and confirm the all-clear. Record date, interval and who was paged in the WP2b ledger. The checks themselves are listed above; the drill proves the wire, not the code.
```

- § Weekly five-minute owner check (current L52–L54): replace the paragraph with:

```md
Every Monday, by the owner, not delegated (plan §8): (1) yesterday's digest arrived (once WP5 lands — until then, skip); (2) `https://www.jobsadmire.com/api/site-health` is `ok: true` and `ops.state` is `ok`; (3) the Operations forms inbox shows the week's submissions and no `needs-attention` row older than a day; (4) the three-way count for last week — submissions vs `generate_lead` vs Ads conversions (`docs/ANALYTICS.md`) — is within one of each other; (5) `npm run sweep:legacy` against production (a minute; any `FAIL` row is a redirect regression); (6) in Phase B, the APPROVE queue is not backing up. Anything red goes to Fable the same day.
```

- § Work-package sign-off (current L56–L58): replace "the 180 KB script budget" wording (T0e already changed it to 200 KB) and append: `Gate A adds `npm run gate:launch` (the same run + `UNBUILT_PATHNAMES` empty + the D26 placeholder counter) and `npm run sweep:legacy`; both need `VERCEL_AUTOMATION_BYPASS_SECRET` against a preview (`docs/DEPLOYMENT.md`).`

**`docs/redirects.md`** — before `## Expected-loss forecast` (current L70), insert:

```md
## Gate A sweep (<date>, preview <url>)

`npm run sweep:legacy` (`scripts/launch/legacy-sweep.sh` over `scripts/launch/legacy-urls.txt`, Googlebot UA, no redirect following): 20 legacy URLs + 2 keep controls, every row single-hop, no 429. `scripts/launch/legacy-sweep.test.ts` pins each expectation to `legacy.json`/`gone.json`/`pathnames`, so the list cannot drift from the data. Re-run verbatim against `https://www.jobsadmire.com` at WP7a and paste the second table under this one.

<the sweep table from Cycle 2, verbatim>
```

**`CLAUDE.md`**

- Doc map (current L9–L24): after the WP1 rulings row, add (skip any row a WP2a task already added — `grep -n "wp2" CLAUDE.md`):

```md
| `docs/superpowers/plans/2026-09-20-wp2a-foundation.md`                                                | WP2a — the foundation the pages consume (forms kernel, data layer, chrome, SEO, blocks, islands, gate tooling, calculator engine, Ops catalog v1.1)       |
| `docs/superpowers/plans/2026-09-20-wp2b-pages.md`                                                     | WP2b — the fourteen page ports, forms E2E and Gate A prep; the ledger with per-route JS size, Lighthouse triples, pixel scores, the Gate A checklist       |
| `docs/superpowers/plans/2026-09-20-wp2-rulings.md`                                                    | Every WP2 ruling (W1–W72 planning, W-T15-n execution) — what was decided, why, cost if wrong                                                             |
```
- "Routing" bullet (current L28): replace "`app/[locale]/…` (no route group)" with "`app/[locale]/(site|minimal|bare)/…` — three route groups selecting the chrome (W19)". Leave the rest of the bullet.
- Phase status (current L70–L74): append a bullet: `- **Status <date>:** WP2 complete on `wp2/foundation` — all §2 routes ported, forms wired to the WP3a door, `gate:launch` green on every route in both locales, legacy sweep single-hop; Gate A open items are the owner rows in `docs/PRD.md` §12 (licence PDFs, one real photo, cookie notice, expected-loss forecast, site-health drill) and the WP5 synthetic lead/digest deferral.`

**`docs/superpowers/plans/2026-09-20-wp2-rulings.md`** — under `## Execution rulings` (current L96–L98), append:

```md
- **W-T15-1 Preview gate faces:** every gate consumer sends `x-vercel-protection-bypass` from `VERCEL_AUTOMATION_BYPASS_SECRET` (`scripts/launch/bypass-headers.ts`); `gate.sh` asserts `*.vercel.app` / `staging.jobsadmire.com` with `lighthouserc.preview.json` (= `lighthouserc.json` + `skipAudits: ['is-crawlable']`) because the preview `robots.txt` is `Disallow: /` and the audit parses it; `src/app/robots.test.ts` pins the production list instead — why: WP1 never ran the gate on a preview and the assertion `categories:seo = 1.0` was unreachable there — cost if wrong: a real production `noindex` regression would be caught only by `e2e/seo.spec.ts`'s meta check and the unit test, not by Lighthouse on previews; production runs keep the audit.
- **W-T15-2 `e2e/seo.spec.ts` robots test is face-aware:** it asserts the preview lockdown (`Disallow: /`, no `Sitemap:`) or the production rules, whichever the base URL serves — why: one spec must be green against both — cost if wrong: none beyond the unit test's coverage.
- **W-T15-3 Gate A row 8 (synthetic lead + digest):** both are WP5 deliverables by the approved order (WP2 → Gate A → WP3c → WP4 → WP5); T15 records the row as "no by design" and the controller/owner decide at Gate A whether to accept the deferral (with the external uptime monitor + site-health as the interim alarm) or to pull WP5's cron forward — why: the spec's Gate A list predates the WP order it sits in — cost if wrong: a silent forms outage between cutover and WP5 is detected only by the lead-drought human check.
- **W-T15-4 `StickyCtaBar` contact tracking:** the bar renders `tel:`/`wa.me`/`mailto:` CTAs through `ContactLink` with placement `page_cta`; Work Permit, Partner and Available Workers regain the design's Call/WhatsApp bar buttons — why: three page tasks reported the gap and W12 requires every contact anchor tracked — cost if wrong: none (internal CTAs unchanged).
- **W-T15-5 Expected-loss forecast:** stays an owner + Fable item on the WP0 GSC export (`redirects/gsc-clicks.csv` header-only at T15); T15 does not fabricate a forecast — why: D21 makes the forecast the check that the map preserves traffic, which needs the export — cost if wrong: Gate A row 2 stays "open" until the export lands; WP7a must not proceed without it.
- **W-T15-6 Spoofed-Googlebot challenge:** a Vercel Firewall challenge (403 interstitial) on the sweep's Googlebot UA is recorded as a D13 verified-crawler-allowlist finding, the sweep is re-run with a browser UA to prove the redirect layer, and both tables are kept — why: real Googlebot passes reverse-DNS verification; curl cannot — cost if wrong: a false "429/403" alarm at Gate A.
- **W-T15-7 Launch-blocking placeholders:** of the counter's slots only the D26 Minimum Launchable Content ones block Gate A — `licence-pdf-*` (the four PDFs at `/hakkimizda#lisans`), one of `office-photo`/`founder-photo`, and the cookie-notice text; every hero slot is the §10 #4 gradient auto-default with the h1 as LCP — why: D26 names exactly these — cost if wrong: Gate A says yes with a dead licence block on the About page.
```

**Memory line** — append to `~/.claude/projects/-Users-agentfaraz-projects-admiregroup-jobsadmire/memory/website-programme-2026-09.md` (the only write outside the repo; one paragraph, no secrets):

```
**<date> — WP2 COMPLETE, Gate A prepped (T15):** `gate:launch` green on every route in both locales against <preview> (<m> routes, <n> placeholders, 0 LCP-slot violations, UNBUILT empty); legacy sweep 20 URLs single-hop; per-route JS ≤ 204,800 B (worst <route> <bytes>); pixel harness home/hire/calc/blog-article recorded. Gate A open items: licence PDFs + one real photo + cookie notice (owner, D26 MLC), expected-loss forecast (needs the GSC export), site-health drill (owner), synthetic lead/digest = WP5 deferral (W-T15-3). Owner did 2026-09-20: Vercel ↔ GitHub connected, Turnstile secret (site-health `ops.captcha: configured`), second alert human. Preview gate needs `VERCEL_AUTOMATION_BYPASS_SECRET` in the shell (W-T15-1); previews are asserted with `lighthouserc.preview.json` (is-crawlable skipped). Next: WP7a cutover (move domains to jobsadmire-web-v2; re-run `sweep:legacy` on production; rotate RESEND key).
```

**Ledger line** (append to `docs/superpowers/plans/2026-09-20-wp2b-pages.md`, after the T15 tables): `T15 Gate A prep — no route — gate:launch OK <date> on <preview> (<m> routes both locales; Lighthouse min perf <x> / a11y 1 / bp 1 / seo 1; worst script <route> <n> B gz of 204,800; LCP max <ms>); placeholders <n> (blocking: licence-pdf ×<k>, office/founder photo, cookie notice); sweep 20/20 single-hop (+2 keep) no 429; pixel home tr/en <…>, hire <…>, calc <…>, blog-article <…> (iterations 0 in T15); docs synced (PRD §12, SEO, CONTENT-MODEL, ANALYTICS, ARCHITECTURE, OPERATING, redirects, DEPLOYMENT, CLAUDE.md); rulings W-T15-1…7; memory line written — agent-days <n> (W15 budget 1).`

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx prettier --write docs/PRD.md docs/SEO.md docs/CONTENT-MODEL.md docs/ANALYTICS.md docs/ARCHITECTURE.md docs/OPERATING.md docs/redirects.md CLAUDE.md docs/superpowers/plans/2026-09-20-wp2-rulings.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
grep -n "not yet run against a Vercel preview\|no route group\|Not yet built\*\* — no server action" CLAUDE.md docs/PRD.md docs/ARCHITECTURE.md   # prints nothing
grep -n "WP1 wires exactly one of these seven events" docs/ANALYTICS.md                                                                     # prints nothing
grep -n "pending §10 item 10\|no default; required before Gate A" docs/PRD.md docs/OPERATING.md                                             # prints nothing
git diff --stat CLAUDE.md | grep -v nextjs-agent-rules                                                                                       # no dev-server block crept in
npm run verify                                                                                                                              # green
```

- [ ] **Step 5: Commit**

```bash
git add docs/PRD.md docs/SEO.md docs/CONTENT-MODEL.md docs/ANALYTICS.md docs/ARCHITECTURE.md docs/OPERATING.md docs/redirects.md CLAUDE.md docs/superpowers/plans/2026-09-20-wp2-rulings.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(gate-a): WP2 delivered — PRD §12 status + Gate A checklist, SEO/robots/sitemap at Gate A, analytics wired audit, operating drill + weekly check, redirects sweep, rulings W-T15-1..7 (T15)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Then push `wp2/foundation` (previews only — `main` is still the live project's production branch until the owner moves it; nothing here touches `main`) and hand the controller the Gate A table with its open rows.

---

**Docs in this task:**
- `docs/PRD.md` — §10 three bullets updated (second human closed; hero/founder Gate A status); §11 line 116 (gate first preview run) and line 118 (not-yet-built list) rewritten; **new §12** "WP2 delivered — Phase A status at Gate A" with the per-route table and the Gate A checklist ("how verified" column).
- `docs/SEO.md` — § Sitemap Gate A sentence (30 static + N careers URLs, all 200); § Robots production list + preview face note; § Pages table completed for every route.
- `docs/CONTENT-MODEL.md` — § Adding copy: the Gate A `sys.*` namespace roll-up with counts.
- `docs/ANALYTICS.md` — the "wired at Gate A" paragraph replacing "WP1 wires exactly one…".
- `docs/ARCHITECTURE.md` — § Quality gate items 5/6 (bypass header, preview Lighthouse face, first green launch run); § Environments Preview row; § Forms flow opening paragraph if still "Not yet built".
- `docs/OPERATING.md` — synthetic lead/digest Gate A status; second human closed; new § Site-health drill; the concrete weekly five-minute check; sign-off gains `gate:launch` + `sweep:legacy`.
- `docs/redirects.md` — new § Gate A sweep with the table.
- `docs/DEPLOYMENT.md` — `VERCEL_AUTOMATION_BYPASS_SECRET` row (Cycle 1).
- `CLAUDE.md` — three doc-map rows (WP2a plan, WP2b plan, WP2 rulings), the route-groups routing bullet, the Phase status line.
- `docs/superpowers/plans/2026-09-20-wp2-rulings.md` — execution rulings W-T15-1…7.
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T15 ledger: content-readiness table, JS-size table, triples, pixel scores, sweep table, the T15 line.
- Memory: one status paragraph in `website-programme-2026-09.md`.

**Sys keys added:** none — T15 adds no copy (every string it touches is documentation; the Cycle 5 bar buttons reuse the ids each page already reads for its ask card / closing band).

**Package ids used:** 0 — this task renders no page; the only ids it names are the ones the page tasks already use (`hire.264`/`265`, `partner.222`/`223` cited as the two page records with SEO strings).

**Foundation gaps:** (1) `scripts/pixel-compare.ts` (T0e) does not read `protectionBypassHeaders` — if its built captures return the Vercel auth page, Cycle 4 adds the one-line `extraHTTPHeaders` edit; (2) `StickyCtaBar` (T0d) renders contact CTAs through `Button`, so they are untracked — closed in Cycle 5 (W-T15-4) unless a page task closed it first; (3) T0e's preview gate could never pass `categories:seo = 1.0` or reach a protected preview (no `is-crawlable` handling, no bypass header) — closed in Cycle 1 (W-T15-1/2); (4) the spec's Gate A row 8 (synthetic lead + digest) has no WP2 owner — WP5 by plan order — ruling W-T15-3 records the deferral rather than building a cron here.
