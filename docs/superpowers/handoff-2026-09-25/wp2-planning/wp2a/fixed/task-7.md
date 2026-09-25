### Task 7: Gate tooling — one route list, launch profile, JS ceiling, page-contract specs, pixel harness (T0e)

**Why this task exists.** WP1 left the gate with two hand-synced route lists (`e2e/routes.ts` and a literal loop in `scripts/gate.sh`), spike-page assertions (`hire-h1` text `'tr'`/`'en'`, a home link with text `hire`) that the first page port would break, an absolute 184,320 B script ceiling with ~11.8 KB headroom over the shell, no `--profile=launch`, no placeholder counter (D26), and no pixel harness (D27). This task fixes all of that before page 1 (critique § foundation_fixes_first "Gate hygiene"), under rulings **W13 amended** (204,800 B ceiling on every gate route, 194,560 B lazy-loading line), **W20** (`UNBUILT_PATHNAMES` must be empty at Gate A), **W21** (one route list, `gate.sh` reads it through `node scripts/gate-routes.mjs`), **W15/D27** (four pixel pages: Homepage, Cost Calculator, Hire Workers, Blog Article; two-iteration cap is a ledger rule), **W55** (placeholders are always named), **W42** (package.json scripts are edited additively), **W45** (doc edits anchor on sentences), **W50** (`vitest.launch.config.mts` imports `./vitest.config.mjs`; the hire-link proof goes through the desktop nav row; `e2e/seo.spec.ts` keeps Task 4's OG tests) and **W57** (the controller's rulings file exists and may be cited).

**Branch:** `wp2/foundation` (never `main` — plan header). **Ordering:** runs after Tasks 1–6. It needs Task 3 (route groups: the spike pages live under `src/app/[locale]/(site)/`, the thank-you page under `(minimal)/`; `CTA_BY_PATHNAME`; `/blog` + `/blog/[slug]` in `NOINDEX_PATHNAMES`), Task 4 (`UNBUILT_PATHNAMES`, the OG route and its two e2e tests appended to `e2e/seo.spec.ts`), Task 1 (nav groups — `desktopNav` carries `/hire-workers`; `blog` rows with `hasBody`/nullable `slug`) and Task 6 (`assets:*` scripts already in `package.json`). Every "current text" citation below is the text as left by those tasks; where a file is unchanged since `main @ ad58fb8` that is said.

**Files:**

Create
- `scripts/gate-routes.mjs` — prints the gate route list for shell consumers (W21)
- `scripts/gate-routes.test.ts` — Vitest: route-table invariants + the `.mjs` output
- `scripts/js-size.mjs` — per-route script size table from the collected Lighthouse runs (ledger)
- `scripts/js-size.test.ts` — Vitest: the pure summariser + the two lighthouserc ceilings
- `scripts/placeholder-count.ts` — D26 content-readiness: `[data-placeholder]` / `[data-lcp-slot]` scanner + CLI (W55: unnamed placeholders fail)
- `scripts/placeholder-count.test.ts` — Vitest: the pure parser + verdict
- `scripts/launch/unbuilt-routes.launch-check.ts` — W20: `UNBUILT_PATHNAMES` is empty (launch profile only)
- `vitest.launch.config.mts` — Vitest config that runs only `scripts/launch/*.launch-check.ts` (imports `./vitest.config.mjs`, W50)
- `scripts/pixel-compare.ts` — D27 pixel harness (design `.dc.html` vs built route at 390/900/1440, pixelmatch)
- `scripts/pixel-compare.test.ts` — Vitest: route resolution + PNG comparison/padding
- `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` — the two-iteration cap and the ledger row format

Modify
- `e2e/routes.ts` (whole file, unchanged since `ad58fb8`) — `GATE_ROUTE_TABLE` + derived `GATE_ROUTES`, `INDEXABLE_GATE_ROUTES`
- `scripts/gate.sh` (whole file, unchanged since `ad58fb8`) — route list from `gate-routes.mjs`, `--profile=launch`, `js-size` print
- `lighthouserc.json` and `lighthouserc.local.json` (the `_comment` field and the `resource-summary:script:size` assertion) — ceiling 204800
- `e2e/routing.spec.ts` (the three spike tests; the other five unchanged) — page-contract assertions
- `e2e/seo.spec.ts` (whole file — as left by Task 3 cycle 3 and Task 4 cycles 3–4) — canonical/hreflang over every indexable route, sitemap membership + no-404 sweep, W4 blog exclusion, Task 4's two OG tests merged (renamed, same assertions) (W37/W50)
- `src/app/[locale]/(site)/page.tsx` — the spike `<h1 data-testid="home-h1">` → `data-testid="page-h1" data-lcp-slot="h1"`
- `src/app/[locale]/(site)/hire-workers/page.tsx` — the spike `<h1 data-testid="hire-h1">` → same
- `src/app/[locale]/(minimal)/thank-you/page.tsx` — the `<h1 className="text-h2">` gains `data-testid="page-h1" data-lcp-slot="h1"` (so the launch profile's counter passes on every gate route today)
- `package.json` — `scripts` edited additively (W42): `gate:launch`, `js-size`, `pixel`; devDependencies `pixelmatch`, `pngjs`, `@types/pixelmatch`, `@types/pngjs`
- `.gitignore` (the `# test artefacts` block) — `.pixel/`
- `docs/ARCHITECTURE.md` § Quality gate — rewritten from the heading through item 5; the D20 paragraph and its bullets (as left by Task 3) untouched
- `docs/PRD.md` § 6 (the budget paragraph) and § 11 (the **Quality gate** bullet) — 200 KB ceiling
- `docs/OPERATING.md` § Work-package sign-off — 200 KB
- `README.md` § Running the gate — launch profile, `js-size`, `pixel`
- `CLAUDE.md` § Conventions (the JS-budget bullet) + doc-map row for the pixel-harness note

Test
- `scripts/gate-routes.test.ts`, `scripts/js-size.test.ts`, `scripts/placeholder-count.test.ts`, `scripts/pixel-compare.test.ts` (Vitest, all matched by the existing `scripts/**/*.test.ts` include)
- `e2e/routing.spec.ts`, `e2e/seo.spec.ts` (Playwright, both projects, run by `npm run gate`)
- `scripts/launch/unbuilt-routes.launch-check.ts` (Vitest under `vitest.launch.config.mts` only — never in `npm run verify`)

**Interfaces:**

Consumes
- WP1: `GATE_ROUTES` consumers `e2e/a11y.spec.ts:3` and `e2e/width-sweep.spec.ts:2` (`import { GATE_ROUTES } from './routes'`, iterated with `for…of`) — kept source-compatible (`readonly string[]`).
- WP1: `scripts/gate.sh` order collect → `lhci upload --target=filesystem` → `assert` (R48), `lighthouserc.local.json` for localhost (R50), `REVALIDATE_SECRET` optional (R43) — kept.
- WP1: `.lighthouseci/lhr-<timestamp>.json` written by `lhci collect` (`@lhci/utils/src/saved-reports.js:11`, `LHR_REGEX = /^lhr-\d+\.json$/`) — read by `js-size.mjs`.
- WP1: `tsx` 4.23.13 (`tsx/esm/api` → `tsImport(specifier: string, options: string | { parentURL; tsconfig? }): Promise<any>` — verified in `node_modules/tsx/dist/esm/api/index.d.mts:33`), `@playwright/test` 1.63 (re-exports `chromium`; `BrowserContext` options `locale`, `reducedMotion: 'reduce'`, `addInitScript(script, arg)`), Node 22 (`.nvmrc`), Vite 8.3 / Vitest 4.1 (the config bundler is rolldown, which remaps a `./x.mjs` import to `x.mts` — probed; W50's `'./vitest.config.mjs'` therefore resolves at runtime and type-checks), `tsconfig.json` `allowJs: true` + `include: ["**/*.ts", "**/*.tsx", "**/*.mts", …]` (so `.mjs` files are type-inferred through their JSDoc when imported from a test but never error-checked; `.mts` files are type-checked).
- WP1: `src/design/chrome/LanguageHint.tsx:8` `HINT_KEY = 'ja-lang-hint'` (value `'off'` dismisses the hint; Task 4 changes what the hint links to, not the key) — pre-set by the pixel harness on the built site.
- WP1 script idioms (proven under both `tsx` and Vitest by `scripts/import-design-package.ts:4,135` and its test): `const ROOT = join(__dirname, '..')` at module top and `if (require.main === module) main()` as the CLI door — reused by `placeholder-count.ts` and `pixel-compare.ts`.
- Design package: `design-package/design/<Page>.dc.html` boots through `./support.js` (loads React 18.3.1 + Babel standalone from unpkg at runtime — network required; `support.js:1143–1147`), `./image-slot.js`, `./ja-i18n.js`; language = `localStorage['ja-lang']` (`'TR'|'EN'`, `Homepage v4.dc.html:1481`) with `?lang=tr` winning as the review language (`reviewLang()` accepts `tr|fr|ru`, `:1469–1474`; `?lang=en` is ignored, so the stored `'EN'` decides EN); hint dismissal `localStorage['ja-lang-hint'] = 'off'` (`:1501`); needs HTTP, not `file://` (README "Previewing"). `@media (min-width: 1101px) { html { zoom: 0.75 } }` (`:16`) and `@media (prefers-reduced-motion: reduce)` rules make every `.ja-reveal` visible and the hero static (`:41–76`).
- Task 3 (T0c chrome): the spike pages live at `src/app/[locale]/(site)/page.tsx` and `(site)/hire-workers/page.tsx`, the thank-you page at `(minimal)/thank-you/page.tsx`; `NOINDEX_PATHNAMES = ['/thank-you', '/portal-login', '/newsletter/confirm', '/newsletter/unsubscribe', '/blog', '/blog/[slug]'] as const`; `CTA_BY_PATHNAME['/']` = primary `home.014`+`home.015` → `{ pathname: '/', hash: '#proposal' }`, secondary = default `home.008` → `'/partner-with-us'` (so on `/` **no header CTA links to `/hire-workers`**); the header's desktop row renders `navGroup(bundle, 'desktopNav', t)` minus `PROMOTED = {'/blog','/careers','/verify','/partner-with-us'}` as next-intl `<Link prefetch={false}>` (`hidden lg:flex` — in the DOM at every viewport), the hamburger panel renders the `hamburger` group and the Footer the `footerEmployers` group; `e2e/width-sweep.spec.ts` width list = `[1440, 1280, 1101, 1100, 901, 900, 700, 560, 460, 390]`.
- Task 1 (T0b): `bundle.nav` groups — `desktopNav` row `{ href: '/hire-workers', labelId: 'home.002' }` (first row), also in `hamburger` and `footerEmployers` — the anchors `a[href="/isci-talebi"]` (TR) / `a[href="/en/hire-workers"]` (EN) the routing spec counts; `BlogPost` rows (W33, + `body` per W28) in `bundle.collections.blog` of `src/content/local/bundle.<locale>.json`: `{ key; slug: { tr: string | null; en: string | null }; title; excerpt; category; categoryLabelId; author; publishedAt; readMinutes; hasBody: { tr: boolean; en: boolean }; body: { tr: string | null; en: string | null } }` — read with `readFileSync` from `scripts/` (the sanctioned bypass; `src/**` never).
- Task 4 (T0c SEO): `export const UNBUILT_PATHNAMES: ReadonlySet<keyof typeof pathnames>` in `src/lib/seo/routes.ts` (19 keys today; each page task deletes its own; `src/lib/seo/unbuilt.test.ts` keeps it honest); `app/sitemap.ts` = static `pathnames` minus `NOINDEX_PATHNAMES` minus `UNBUILT_PATHNAMES` per locale (exactly `/`, `/en`, `/isci-talebi`, `/en/hire-workers` today) — the reason the sitemap 200-sweep below can be strict; `app/robots.ts` consumes `robotsDisallowPaths(locale)` (W37) = noindex external paths minus unbuilt, so `Disallow: /tesekkurler` is present and `/blog` is **not** named until the blog page lands; `GET /og/{tr|en}/{pageKey}.png` → 200 `image/png`, 404 for a key outside `OG_PAGE_KEYS`; `buildMetadata` sets `og:image`/`twitter:image` to `pageOgImageUrl(locale, pageKey)` = `${SITE_URL}/og/${locale}/${pageKey}.png`. Task 4 appended two Playwright tests to `e2e/seo.spec.ts` ('the OG image route answers a PNG, is not locale-rewritten and rejects unknown keys' in cycle 3, 'the home page points og:image and twitter:image at the generated PNG' in cycle 4) — merged (renamed, same assertions, including `/og/de/home.png` → 404) into this task's rewrite as 'the generated OG image answers as a PNG and the home page points at it' and 'the OG route is not locale-rewritten and rejects unknown keys' (W37/W50).
- Task 5 (T0d blocks, W27): `src/design/blocks/ImageSlot.tsx` `{ slot: string; lcp?: boolean; src?: string | null; alt: string; width: number; height: number; sizes?: string; className?: string; priority?: boolean }` → `next/image` when `src`, else `<div role="img" aria-label={alt} data-placeholder={slot} data-lcp-slot={lcp ? slot : undefined}>` — the one component pages use to satisfy the markup contract below; `PostCard`'s cover slot is `blog-cover-<key>` (W55).
- Task 6 (T0d assets, W42): `package.json` `scripts` already carry `"assets:brand"`, `"assets:flags"`, `"assets:map"` after `"redirects:build"` — this task adds beside them, never rewrites the block.
- Controller (W57): `docs/superpowers/plans/2026-09-20-wp2-rulings.md` (W13 amended lives there) and `…/2026-09-20-wp2a-foundation.md` exist on the branch before Task 1 — cited by this task's docs, not edited.

Produces (copied from interfaces.md § T0e and completed)
```ts
// e2e/routes.ts — the single gate route list (W21). Page tasks append here and nowhere else.
export type GateRoute = { path: string; indexable: boolean };
export const GATE_ROUTE_TABLE: readonly GateRoute[];   // both locales, every route as pages land
export const GATE_ROUTES: readonly string[];            // every path (axe, width sweep, placeholder counter)
export const INDEXABLE_GATE_ROUTES: readonly string[];  // indexable paths (Lighthouse, SEO spec, sitemap membership, page-contract loop)
//   Today: '/', '/en', '/isci-talebi', '/en/hire-workers' (indexable) + '/tesekkurler?form=hire' (indexable: false).
//   A route in NOINDEX_PATHNAMES is appended with indexable: false.

// scripts/gate-routes.mjs — `node scripts/gate-routes.mjs [--all] [--json]`
//   stdout: INDEXABLE_GATE_ROUTES one per line (default) | GATE_ROUTES with --all | JSON array with --json; exit 2 on an unknown flag

// scripts/gate.sh — `npm run gate` | `npm run gate:launch` (= `bash scripts/gate.sh --profile=launch`)
//   default: playwright → lhci collect over `node scripts/gate-routes.mjs` → upload → assert → `node scripts/js-size.mjs || true`
//   launch : + `npx vitest run --config vitest.launch.config.mts` (UNBUILT_PATHNAMES empty, W20)
//            + `npx tsx scripts/placeholder-count.ts` (content-readiness table, D26/W55)

// lighthouserc.json + lighthouserc.local.json
//   "resource-summary:script:size": ["error", { "maxNumericValue": 204800 }]   // W13 amended

// scripts/js-size.mjs — `node scripts/js-size.mjs [--dir=.lighthouseci]`  (= `npm run js-size`)
export const SCRIPT_CEILING = 204_800; export const LAZY_LINE = 194_560;
export type JsSizeRow = { path: string; runs: number; scriptBytes: number; headroomBytes: number; lcpMs: number | null; performance: number | null; overLazyLine: boolean; overCeiling: boolean };
export function summarizeLhrs(lhrs: unknown[]): JsSizeRow[];        // worst script size, median LCP, lowest score per path; non-LHR input ignored
export function formatJsSizeTable(rows: JsSizeRow[]): string;      // markdown, pasted into the ledger

// scripts/placeholder-count.ts — `npx tsx scripts/placeholder-count.ts` (E2E_BASE_URL required; exit 1 when any route fails)
export type PlaceholderScan = { placeholders: string[]; lcpSlots: string[]; both: string[] };
export type RouteVerdict = { route: string; status: number | null; placeholders: string[]; lcpSlot: string | null; problems: string[] };
export function scanPlaceholders(html: string): PlaceholderScan;                 // pure; ignores <script> and comments
export function evaluateScan(route: string, status: number | null, scan: PlaceholderScan): RouteVerdict;
//   problems: 'no response' | 'HTTP <n>' | 'no data-lcp-slot on the page' | 'more than one data-lcp-slot: a, b'
//           | 'LCP slot "<slot>" is a placeholder (D26)' | 'unnamed data-placeholder (W55)'
export function formatReadinessTable(verdicts: RouteVerdict[]): string;
//   writes lighthouse-report/content-readiness.json { base, generatedAt, routes: RouteVerdict[] }
// Page markup contract (every WP2b page; docs/ARCHITECTURE.md § Quality gate):
//   <h1 data-testid="page-h1"> — exactly one h1 per page, real copy (no leaked `{token}` / `undefined`);
//   the LCP element carries data-lcp-slot="<slot>" (the hero <img>'s design slot id when the photo ships, else the h1 with "h1");
//   every image slot rendered without its asset carries data-placeholder="<design slot id>" (never empty — W55), never on
//   the LCP element (D26). Pages emit both attributes through Task 5's ImageSlot (W27); the h1 carries them by hand.

// scripts/launch/unbuilt-routes.launch-check.ts + vitest.launch.config.mts — launch profile only
//   asserts [...UNBUILT_PATHNAMES] equals [] (W20); vitest.launch.config.mts spreads `./vitest.config.mjs` (W50) with
//   include ['scripts/launch/**/*.launch-check.ts'], environment 'node', setupFiles []

// scripts/pixel-compare.ts — `npm run pixel -- --page=home|hire|calc|blog-article [--locale=tr|en] [--base=<url>] [--route=<path>] [--widths=390,900,1440]`
export const PIXEL_WIDTHS: readonly [390, 900, 1440];
export type PixelLocale = 'tr' | 'en'; export type PixelPageKey = 'home' | 'hire' | 'calc' | 'blog-article';
export type PixelBundle = { collections: { blog?: Array<{ slug: { tr: string | null; en: string | null }; hasBody: { tr: boolean; en: boolean } }> } };
export const PIXEL_PAGES: Record<PixelPageKey, { design: string; route: Record<PixelLocale, string> | 'blog' }>;
export function resolvePixelRoute(page: PixelPageKey, locale: PixelLocale, bundle: PixelBundle | null, override?: string | null): string;
//   'blog' → the first blog row with hasBody[locale] && slug[locale] → /blog/<slug.tr> | /en/blog/<slug.en>; none → throws (pass --route)
export function comparePngs(design: PNG, built: PNG): { diff: PNG; width: number; height: number; diffPixels: number; match: number };
//   writes .pixel/<page>-<locale>-<w>.png (diff), .pixel/<page>-<locale>-<w>-design.png, .pixel/<page>-<locale>-<w>-built.png
//   and merges { [`${page}-${locale}`]: { base, route, design, generatedAt, results: [{ width, designHeight, builtHeight, diffPixels, match }] } }
//   into .pixel/report.json. Never part of the gate or CI; needs network (unpkg, Google Fonts) and a running build.

// package.json scripts after this task: "gate", "gate:launch", "js-size", "pixel" beside the existing "content:import",
//   "redirects:build" and Task 6's "assets:brand", "assets:flags", "assets:map" (W42 — additive edits only)
// devDependencies added: pixelmatch ^5.3.0, pngjs ^7.0.0, @types/pixelmatch ^5.2.6, @types/pngjs ^6.0.5 (CJS majors — tsx runs this
//   non-"type":"module" repo's scripts as CJS)
```

---

- [ ] **Cycle 1 — One route list (W21): `e2e/routes.ts` table, `scripts/gate-routes.mjs`, `gate.sh` consumes it**

- [ ] **Step 1: Write the failing test**

`scripts/gate-routes.test.ts`:

```ts
/** @vitest-environment node */
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { GATE_ROUTE_TABLE, GATE_ROUTES, INDEXABLE_GATE_ROUTES } from '../e2e/routes';

// The .mjs is what scripts/gate.sh reads (W21); spawn it exactly as the shell does. tsx's
// loader may print an ExperimentalWarning on stderr — stdout is the contract, so stderr is dropped.
const run = (...args: string[]) =>
  execFileSync(process.execPath, ['scripts/gate-routes.mjs', ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

const isEn = (p: string) => p === '/en' || p.startsWith('/en/');

describe('gate routes (W21)', () => {
  it('every path is external, unique and starts with /', () => {
    for (const p of GATE_ROUTES) expect(p.startsWith('/')).toBe(true);
    expect(new Set(GATE_ROUTES).size).toBe(GATE_ROUTES.length);
    expect(GATE_ROUTES).toEqual(GATE_ROUTE_TABLE.map((r) => r.path));
  });

  it('carries both locales for every indexable page', () => {
    // Each page task appends its two locale paths (W21): the EN and TR halves must stay equal.
    const en = INDEXABLE_GATE_ROUTES.filter(isEn);
    const tr = INDEXABLE_GATE_ROUTES.filter((p) => !isEn(p));
    expect(en.length).toBe(tr.length);
    expect(tr).toContain('/');
    expect(en).toContain('/en');
  });

  it('sweeps the noindex conversion page but never audits it', () => {
    expect(GATE_ROUTES).toContain('/tesekkurler?form=hire');
    expect(INDEXABLE_GATE_ROUTES).not.toContain('/tesekkurler?form=hire');
    expect(INDEXABLE_GATE_ROUTES).toEqual(
      GATE_ROUTE_TABLE.filter((r) => r.indexable).map((r) => r.path),
    );
  });

  it('gate-routes.mjs prints the indexable routes, one per line', () => {
    expect(run().split('\n').filter(Boolean)).toEqual([...INDEXABLE_GATE_ROUTES]);
  }, 30_000);

  it('--all prints every gate route and --json prints an array', () => {
    expect(run('--all').split('\n').filter(Boolean)).toEqual([...GATE_ROUTES]);
    expect(JSON.parse(run('--json'))).toEqual([...INDEXABLE_GATE_ROUTES]);
  }, 30_000);

  it('refuses an unknown flag', () => {
    expect(() => run('--bogus')).toThrow();
  }, 30_000);
});
```

Run line: `npx vitest run scripts/gate-routes.test.ts`

- [ ] **Step 2: Run test to verify it fails**

`npx vitest run scripts/gate-routes.test.ts` → fails at import: `SyntaxError: The requested module '../e2e/routes' does not provide an export named 'GATE_ROUTE_TABLE'` (and `INDEXABLE_GATE_ROUTES`); `scripts/gate-routes.mjs` does not exist yet.

- [ ] **Step 3: Implement**

`e2e/routes.ts` (replaces the whole file — unchanged since `ad58fb8`):

```ts
/**
 * The ONE gate route list (W21). Every page task appends its two locale paths HERE and nowhere
 * else: axe (`e2e/a11y.spec.ts`) and the width sweep (`e2e/width-sweep.spec.ts`) read
 * `GATE_ROUTES`; Lighthouse (`scripts/gate.sh`, through `node scripts/gate-routes.mjs`), the
 * SEO spec and the routing spec's page-contract loop read `INDEXABLE_GATE_ROUTES`; the launch
 * profile's placeholder counter (`scripts/placeholder-count.ts`) reads `GATE_ROUTES`.
 */
export type GateRoute = {
  /** External path exactly as a visitor types it — TR unprefixed, EN under `/en` (D1). */
  path: string;
  /** `false` for the routes in `NOINDEX_PATHNAMES` (src/lib/seo/routes.ts): swept by axe, the
   *  width sweep and the placeholder counter, never audited by Lighthouse, never expected in the
   *  sitemap, never in the page-contract loop. */
  indexable: boolean;
};

export const GATE_ROUTE_TABLE: readonly GateRoute[] = [
  { path: '/', indexable: true },
  { path: '/en', indexable: true },
  { path: '/isci-talebi', indexable: true },
  { path: '/en/hire-workers', indexable: true },
  // The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.
  { path: '/tesekkurler?form=hire', indexable: false },
];

export const GATE_ROUTES: readonly string[] = GATE_ROUTE_TABLE.map((r) => r.path);

export const INDEXABLE_GATE_ROUTES: readonly string[] = GATE_ROUTE_TABLE.filter(
  (r) => r.indexable,
).map((r) => r.path);
```

`scripts/gate-routes.mjs` (new):

```js
#!/usr/bin/env node
// W21: the gate's route list for shell consumers — one path per line on stdout, nothing else.
//   node scripts/gate-routes.mjs          → INDEXABLE_GATE_ROUTES (what Lighthouse audits)
//   node scripts/gate-routes.mjs --all    → GATE_ROUTES (what axe / the width sweep / the
//                                           placeholder counter sweep)
//   node scripts/gate-routes.mjs --json   → the same list as a JSON array
// The list itself lives in e2e/routes.ts (TypeScript, so the specs can import it typed). tsx's
// `tsImport` loads it here, which works on every Node 22 — native type stripping is only
// unflagged from 22.18, and .nvmrc pins the major, not the minor.
import { tsImport } from 'tsx/esm/api';

const args = process.argv.slice(2);
const known = new Set(['--all', '--json']);
const unknown = args.filter((a) => !known.has(a));
if (unknown.length) {
  process.stderr.write(
    `gate-routes: unknown argument ${unknown.join(' ')} (accepted: --all --json)\n`,
  );
  process.exit(2);
}

const routes = await tsImport('../e2e/routes.ts', import.meta.url);
const list = args.includes('--all') ? routes.GATE_ROUTES : routes.INDEXABLE_GATE_ROUTES;

if (args.includes('--json')) {
  process.stdout.write(`${JSON.stringify(list)}\n`);
} else {
  process.stdout.write(list.map((p) => `${p}\n`).join(''));
}
```

`scripts/gate.sh` (replaces the whole file — unchanged since `ad58fb8`; the `--profile=launch` branch is a placeholder until Cycle 4, the js-size print arrives in Cycle 2):

```bash
#!/usr/bin/env bash
# Quality gate — runs OUTSIDE the Vercel build (no Chrome there): Playwright + axe + Lighthouse
# against a URL. D27: once per work package, against a preview (or a local production build).
# Usage: E2E_BASE_URL=https://<preview-or-local> npm run gate
#        E2E_BASE_URL=… npm run gate:launch        (= bash scripts/gate.sh --profile=launch)
#
# Export REVALIDATE_SECRET (the same value the server under test was started with) for full
# ops coverage: without it the two token-dependent cases in e2e/ops.spec.ts skip themselves (R43).
# Bash 3.2 (macOS /bin/bash) is enough: no mapfile, no associative arrays.
set -euo pipefail

PROFILE=default
for arg in "$@"; do
  case "$arg" in
    --profile=launch) PROFILE=launch ;;
    --profile=default) PROFILE=default ;;
    *)
      echo "gate: unknown argument '$arg' (accepted: --profile=launch)" >&2
      exit 2
      ;;
  esac
done

: "${E2E_BASE_URL:?set E2E_BASE_URL to the preview or local URL}"
# A trailing slash would double up in every "${E2E_BASE_URL}${path}" below.
E2E_BASE_URL="${E2E_BASE_URL%/}"
export E2E_BASE_URL
echo "gate → $E2E_BASE_URL (profile: $PROFILE)"
if [ -z "${REVALIDATE_SECRET:-}" ]; then
  echo "gate: warning — REVALIDATE_SECRET unset; the two token-dependent ops cases will skip (R43)"
fi

npx playwright test

# W21: ONE route list. Lighthouse audits the indexable routes only (nobody lands on the noindex
# conversion page cold); e2e/routes.ts is the source and scripts/gate-routes.mjs prints it —
# there is no second copy of the paths to keep in sync any more.
LH_PATHS="$(node scripts/gate-routes.mjs)"
if [ -z "$LH_PATHS" ]; then
  echo "gate: scripts/gate-routes.mjs printed no indexable routes" >&2
  exit 1
fi
rm -rf .lighthouseci
# `read` line by line, never an unquoted `for path in $LH_PATHS`: a `?` in a path is a glob
# character to the shell.
while IFS= read -r path; do
  [ -z "$path" ] && continue
  # --additive: `lhci collect` wipes .lighthouseci on every run otherwise, and `lhci assert`
  # would then only ever see the last path of the loop. The mobile emulation comes from
  # lighthouserc.json (`formFactor: mobile`, Lighthouse's own default): there is no "mobile"
  # preset — `--preset` only accepts perf|experimental|desktop and rejects anything else.
  echo "gate: lighthouse ${path}"
  npx lhci collect --additive --url="${E2E_BASE_URL}${path}" >/dev/null
done <<< "$LH_PATHS"
# Before assert, so the reports survive a failing budget — that is when they are read (R48).
npx lhci upload --target=filesystem --outputDir=./lighthouse-report >/dev/null

# R50: against localhost, Lantern charges the whole sub-60 ms waterfall to the LCP graph and
# reports ~2.7 s whatever the page — so LCP is a warning there and an error everywhere else.
# The binding run is the one against the preview URL. Only `assert` changes; collect/upload do not.
if [[ "$E2E_BASE_URL" =~ ^https?://(localhost|127\.0\.0\.1)(:|/|$) ]]; then
  LHCI_CONFIG=lighthouserc.local.json
else
  LHCI_CONFIG=lighthouserc.json
fi
echo "gate: asserting with $LHCI_CONFIG"
npx lhci assert --config="$LHCI_CONFIG"

if [ "$PROFILE" = launch ]; then
  # Filled in by Cycle 4 of Task 7 (W20 empty-UNBUILT check + D26 placeholder counter).
  echo "gate: launch profile not wired yet" >&2
  exit 1
fi
echo "gate: OK"
```

- [ ] **Step 4: Run the tests + `npm run verify`**

```
npx prettier --write e2e/routes.ts scripts/gate-routes.mjs scripts/gate-routes.test.ts
npx vitest run scripts/gate-routes.test.ts      # 6 passed
npm run verify                                  # typecheck, lint, format, vitest all green
```
(`e2e/a11y.spec.ts` and `e2e/width-sweep.spec.ts` still import `GATE_ROUTES` — `readonly string[]` iterates the same way; `npm run typecheck` proves it. `scripts/gate-routes.mjs` is linted by `eslint .` — top-level `await` in an `.mjs` is fine under the flat config's default `sourceType: module`.)

- [ ] **Step 5: Commit**

```
git add e2e/routes.ts scripts/gate-routes.mjs scripts/gate-routes.test.ts scripts/gate.sh
git commit -m "feat(gate): one route list — GATE_ROUTE_TABLE, gate-routes.mjs, gate.sh reads it (W21)

e2e/routes.ts is the single source: GATE_ROUTES for axe/width sweep, INDEXABLE_GATE_ROUTES for
Lighthouse. scripts/gate.sh takes its Lighthouse paths from node scripts/gate-routes.mjs instead
of a hand-synced literal loop, and accepts --profile=launch (wired in a later commit).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 2 — JS ceiling 204,800 B (W13 amended) + `scripts/js-size.mjs` ledger table**

- [ ] **Step 1: Write the failing test**

`scripts/js-size.test.ts`:

```ts
/** @vitest-environment node */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { formatJsSizeTable, LAZY_LINE, SCRIPT_CEILING, summarizeLhrs } from './js-size.mjs';

// The shape of the fields js-size reads from a Lighthouse LHR (lhr-<ts>.json): nothing else.
const lhr = (url: string, scriptBytes: number, lcpMs: number, perf: number) => ({
  lighthouseVersion: '12.0.0',
  finalDisplayedUrl: url,
  categories: { performance: { score: perf } },
  audits: {
    'largest-contentful-paint': { numericValue: lcpMs },
    'resource-summary': {
      details: {
        items: [
          { resourceType: 'total', transferSize: scriptBytes + 50_000 },
          { resourceType: 'script', transferSize: scriptBytes },
          { resourceType: 'stylesheet', transferSize: 20_000 },
        ],
      },
    },
  },
});

describe('js-size (W13 amended)', () => {
  it('pins the ceiling and the lazy-loading line', () => {
    expect(SCRIPT_CEILING).toBe(204_800);
    expect(LAZY_LINE).toBe(194_560);
    for (const file of ['lighthouserc.json', 'lighthouserc.local.json']) {
      const cfg = JSON.parse(readFileSync(file, 'utf8')) as {
        ci: { assert: { assertions: Record<string, [string, { maxNumericValue: number }]> } };
      };
      expect(cfg.ci.assert.assertions['resource-summary:script:size']).toEqual([
        'error',
        { maxNumericValue: SCRIPT_CEILING },
      ]);
    }
  });

  it('groups runs per path, keeps the worst script size, the median LCP and the lowest score', () => {
    const rows = summarizeLhrs([
      lhr('https://x.test/en', 172_509, 1400, 0.98),
      lhr('https://x.test/en', 172_600, 1600, 0.97),
      lhr('https://x.test/', 190_000, 2000, 0.96),
      lhr('https://x.test/', 196_000, 1000, 0.99),
      lhr('https://x.test/', 195_000, 1500, 0.95),
    ]);
    expect(rows.map((r) => r.path)).toEqual(['/', '/en']);
    expect(rows[0]).toMatchObject({
      runs: 3,
      scriptBytes: 196_000,
      headroomBytes: 8_800,
      lcpMs: 1500,
      performance: 0.95,
      overLazyLine: true,
      overCeiling: false,
    });
    expect(rows[1]).toMatchObject({ runs: 2, scriptBytes: 172_600, overLazyLine: false });
  });

  it('flags a route over the ceiling and keeps the query string in the path', () => {
    const [row] = summarizeLhrs([lhr('https://x.test/tesekkurler?form=hire', 210_000, 900, 0.9)]);
    expect(row.path).toBe('/tesekkurler?form=hire');
    expect(row.overCeiling).toBe(true);
    expect(row.headroomBytes).toBe(-5_200);
  });

  it('ignores files that are not Lighthouse results', () => {
    expect(summarizeLhrs([{ not: 'an lhr' }, null, 42])).toEqual([]);
  });

  it('prints a markdown table the ledger can paste', () => {
    const table = formatJsSizeTable(summarizeLhrs([lhr('https://x.test/en', 172_509, 1400, 0.98)]));
    expect(table).toContain('| /en |');
    expect(table).toContain('172,509');
    expect(table).toContain('32,291');
  });
});
```

Run line: `npx vitest run scripts/js-size.test.ts`

- [ ] **Step 2: Run test to verify it fails**

`npx vitest run scripts/js-size.test.ts` → `Error: Failed to load url ./js-size.mjs` (file missing); once created without the assertion change, the first test fails with `expected [ 'error', { maxNumericValue: 184320 } ] to deeply equal [ 'error', { maxNumericValue: 204800 } ]`.

- [ ] **Step 3: Implement**

`lighthouserc.json` — replace the `_comment` value (the text beginning `Script budget (R49): D27's original 120 KB predates the stack measurement`) and the `resource-summary:script:size` line; everything else stays:

```json
{
  "_comment": "Script budget: 204,800 B (200 KB gzipped) on every gate route — W13 amended. R49's 184,320 B left ~11.8 KB over the 172,509 B WP1 shell, no room for a form island. The framework floor is unchanged: react-dom (73,398 B) + the Next App Router client runtime (48,040 B) = 121,438 B before a line of our code, plus next-intl's client runtime (17,140 B, required by the error boundary). Heavy islands (calculator, season planner, map hover, blog search/TOC, track chooser) load with next/dynamic on interaction/viewport so they never count in this audit; a route above 194,560 B gets a lazy-loading pass before the next page starts (node scripts/js-size.mjs prints the per-route figures). See docs/ARCHITECTURE.md § Quality gate.",
  "ci": {
    "collect": { "numberOfRuns": 2, "settings": { "formFactor": "mobile" } },
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

`lighthouserc.local.json` — the `resource-summary:script:size` line becomes `"resource-summary:script:size": ["error", { "maxNumericValue": 204800 }],`; the `_comment` keeps its R50 text and gains one sentence at the end, after `— see docs/ARCHITECTURE.md § Quality gate and docs/OPERATING.md.`: ` The script ceiling is 204,800 B here too (W13 amended); the two files differ only in the LCP level.` Everything else stays identical to `lighthouserc.json` but for the LCP `warn`.

`scripts/js-size.mjs` (new):

```js
#!/usr/bin/env node
// W13 (amended): per-route script transfer size for the WP2 ledger, read from the Lighthouse
// runs scripts/gate.sh just collected (.lighthouseci/lhr-*.json — written by `lhci collect`,
// one file per run, two runs per path). Informational: the gate's own assertion
// (`resource-summary:script:size` in lighthouserc*.json) is what fails a route; this prints the
// numbers the ledger records and flags a route above the 194,560 B lazy-loading line, where the
// ruling demands a next/dynamic pass before the next page task starts.
//   node scripts/js-size.mjs [--dir=.lighthouseci]
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const SCRIPT_CEILING = 204_800;
export const LAZY_LINE = 194_560;

/** @typedef {{ path: string; runs: number; scriptBytes: number; headroomBytes: number; lcpMs: number | null; performance: number | null; overLazyLine: boolean; overCeiling: boolean }} JsSizeRow */

const isLhr = (x) =>
  Boolean(x) && typeof x === 'object' && typeof x.lighthouseVersion === 'string' && x.audits;

const median = (nums) => {
  const s = [...nums].sort((a, b) => a - b);
  if (!s.length) return null;
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

/** @param {unknown[]} lhrs @returns {JsSizeRow[]} */
export function summarizeLhrs(lhrs) {
  /** @type {Map<string, { script: number[]; lcp: number[]; perf: number[] }>} */
  const byPath = new Map();
  for (const lhr of lhrs) {
    if (!isLhr(lhr)) continue;
    const url = lhr.finalDisplayedUrl ?? lhr.requestedUrl;
    if (typeof url !== 'string') continue;
    const u = new URL(url);
    const path = `${u.pathname}${u.search}`;
    const items = lhr.audits['resource-summary']?.details?.items ?? [];
    const script = items.find((i) => i.resourceType === 'script')?.transferSize;
    const lcp = lhr.audits['largest-contentful-paint']?.numericValue;
    const perf = lhr.categories?.performance?.score;
    const acc = byPath.get(path) ?? { script: [], lcp: [], perf: [] };
    if (typeof script === 'number') acc.script.push(script);
    if (typeof lcp === 'number') acc.lcp.push(Math.round(lcp));
    if (typeof perf === 'number') acc.perf.push(perf);
    byPath.set(path, acc);
  }
  return [...byPath.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, acc]) => {
      const scriptBytes = acc.script.length ? Math.max(...acc.script) : 0;
      return {
        path,
        runs: Math.max(acc.script.length, acc.lcp.length, acc.perf.length),
        scriptBytes,
        headroomBytes: SCRIPT_CEILING - scriptBytes,
        lcpMs: median(acc.lcp),
        performance: acc.perf.length ? Math.min(...acc.perf) : null,
        overLazyLine: scriptBytes > LAZY_LINE,
        overCeiling: scriptBytes > SCRIPT_CEILING,
      };
    });
}

const n = (v) => (typeof v === 'number' ? v.toLocaleString('en-US') : '—');

/** @param {JsSizeRow[]} rows */
export function formatJsSizeTable(rows) {
  const lines = [
    `| route | script B (worst of ${rows[0]?.runs ?? 0} runs) | headroom to ${n(SCRIPT_CEILING)} | LCP ms (median) | perf (min) | note |`,
    '| --- | ---: | ---: | ---: | ---: | --- |',
  ];
  for (const r of rows) {
    const note = r.overCeiling
      ? 'OVER CEILING'
      : r.overLazyLine
        ? `over ${n(LAZY_LINE)} — lazy-loading pass before the next page (W13)`
        : '';
    lines.push(
      `| ${r.path} | ${n(r.scriptBytes)} | ${n(r.headroomBytes)} | ${n(r.lcpMs)} | ${
        r.performance === null ? '—' : r.performance.toFixed(2)
      } | ${note} |`,
    );
  }
  return lines.join('\n');
}

function main() {
  const dirArg = process.argv.slice(2).find((a) => a.startsWith('--dir='));
  const dir = dirArg ? dirArg.slice('--dir='.length) : '.lighthouseci';
  let files;
  try {
    files = readdirSync(dir).filter((f) => /^lhr-\d+\.json$/.test(f));
  } catch {
    process.stderr.write(`js-size: ${dir} not found — run npm run gate (lhci collect) first\n`);
    process.exit(1);
  }
  const lhrs = files.map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  const rows = summarizeLhrs(lhrs);
  if (!rows.length) {
    process.stderr.write(`js-size: no Lighthouse results in ${dir}\n`);
    process.exit(1);
  }
  process.stdout.write(`\ngate: per-route script size (W13 amended) — paste into the ledger\n\n`);
  process.stdout.write(`${formatJsSizeTable(rows)}\n\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
```

(`tsconfig.json` has `allowJs: true` and no `checkJs`: the test's import pulls this file into the `tsc` program for type inference through the JSDoc — `summarizeLhrs(lhrs: unknown[]): JsSizeRow[]` — and reports no errors inside it. `.mjs` is not in `include`, so it is never checked on its own. This is what keeps the untyped `lhr.audits[...]` walks legal.)

`scripts/gate.sh` — insert after the `npx lhci assert --config="$LHCI_CONFIG"` line (before the `if [ "$PROFILE" = launch ]` block):

```bash

# W13 (amended): the per-route script sizes the ledger records. Informational — the assert
# above is what fails a route over 204,800 B; this flags the 194,560 B lazy-loading line.
node scripts/js-size.mjs || true
```

`package.json` — Edit the `scripts` object (W42: additive; the block already holds Task 6's three `assets:*` lines after `"redirects:build"`): insert `"js-size": "node scripts/js-size.mjs",` on the line after `"gate": "bash scripts/gate.sh",`.

Docs in this cycle (sentence-anchored, W45 — see **Docs in this task** for the full list):
- `docs/PRD.md` § 6 Performance budget: replace the whole paragraph that begins `LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (mobile). Content routes **≤ 180 KB gzipped JS**` with: `LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (mobile). Content routes **≤ 200 KB gzipped JS** on every gate route (W13 amended — `docs/superpowers/plans/2026-09-20-wp2-rulings.md`; R49's 180 KB left no room for a form island over the 172,509 B WP1 shell). The framework floor is unchanged: `react-dom` (73,398 B) plus the App Router client runtime (48,040 B) is 121,438 B before a line of our code, and next-intl's client runtime adds 17,140 B. Asserted by the gate as `resource-summary:script:size ≤ 204800`; heavy islands (calculator, season planner, map hover, blog search/TOC, track chooser) load with `next/dynamic` on interaction or viewport so they never count in the audit; a route above 194,560 B gets a lazy-loading pass before the next page starts (`npm run js-size` prints the per-route table for the ledger). Budget is re-measured once real photography replaces placeholders. One consent-granted `gate` run per work package.`
- `docs/PRD.md` § 11, the bullet beginning `- **Quality gate** — Playwright + axe + Lighthouse CI wired end-to-end,`: replace `the corrected 180 KB script budget` with `the 200 KB script ceiling (W13 amended; R49's 180 KB was WP1's)`.
- `docs/OPERATING.md` § Work-package sign-off, the sentence `Every other budget — performance, accessibility, best-practices, SEO, the 180 KB script budget, CLS — is an error in both configs.`: `the 180 KB script budget` → `the 200 KB script ceiling (W13 amended)`.
- `CLAUDE.md` § Conventions, the bullet beginning `- **The content-route JS budget is 180 KB gzipped, not 120 KB**`: replace the whole bullet with `- **The content-route JS budget is 200 KB gzipped per gate route** (Ruling W13 amended, `docs/superpowers/plans/2026-09-20-wp2-rulings.md`; R49's 180 KB predated the form island and left ~11.8 KB over the WP1 shell — the framework floor alone is ~121 KB on this stack). Asserted by the gate as `resource-summary:script:size ≤ 204800`; a route above 194,560 B gets a `next/dynamic` lazy-loading pass before the next page starts; `npm run js-size` prints the per-route table after a gate run. Full breakdown: `docs/ARCHITECTURE.md` § Quality gate.`

- [ ] **Step 4: Run the tests + `npm run verify`**

```
npx prettier --write lighthouserc.json lighthouserc.local.json scripts/js-size.mjs scripts/js-size.test.ts package.json docs/PRD.md docs/OPERATING.md CLAUDE.md
npx vitest run scripts/js-size.test.ts          # 5 passed
npm run verify                                  # green
```

- [ ] **Step 5: Commit**

```
git add lighthouserc.json lighthouserc.local.json scripts/js-size.mjs scripts/js-size.test.ts scripts/gate.sh package.json docs/PRD.md docs/OPERATING.md CLAUDE.md
git commit -m "chore(gate): script ceiling 204,800 B on every gate route + js-size ledger table (W13 amended)

Both lighthouserc files assert resource-summary:script:size <= 204800. scripts/js-size.mjs reads
the collected lhr-*.json and prints the per-route worst script size, headroom, median LCP and
lowest score, flagging the 194,560 B lazy-loading line; gate.sh prints it after assert.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 3 — Page-contract e2e specs (`data-testid="page-h1"`, hrefs, canonical/hreflang, sitemap sweep, Task 4's OG tests kept) + the three existing pages tagged**

What changes and why it survives the ports:

| spec | assertion before this cycle | assertion after this cycle | survives because |
| --- | --- | --- | --- |
| routing: TR slug | `getByTestId('hire-h1')` has text `'tr'` | `html[lang=tr]` + `getByTestId('page-h1')` visible | every page's h1 carries the test id; no text is asserted |
| routing: EN slug | `getByTestId('hire-h1')` has text `'en'` | `html[lang=en]` + `page-h1` visible | same |
| routing: Link href | `a` with text `hire` has `href=/isci-talebi` | an `a[href="/isci-talebi"]` exists on `/`, an `a[href="/en/hire-workers"]` on `/en` | the desktop nav row's first entry (`desktopNav` → `/hire-workers`, `home.002`, Task 1) is a next-intl `<Link>` in the DOM at every viewport (`hidden lg:flex`), and the same row sits in the hamburger panel and the footer's employers column — three anchors under either Playwright project. **Not** the header CTA: on `/` the CTA pair is the homepage's own (`CTA_BY_PATHNAME['/']` = `{ pathname: '/', hash: '#proposal' }` + the partner secondary, Task 3), so no header CTA links to `/hire-workers` there (W50). |
| routing: NEW loop | — | every indexable route: exactly one `h1`, it is `[data-testid="page-h1"]`, non-empty, no leaked `{token}` / `undefined` | structural only; the `{token}` check catches an unfilled W1 metric placeholder |
| seo: canonical/hreflang | `/` and `/en/hire-workers` literal | the two literals kept + a loop over `INDEXABLE_GATE_ROUTES` (self canonical, tr/en/x-default present, x-default = tr, no `noindex`) | driven by the route table |
| seo: sitemap | Task 3's version: the two hire URLs, not `/tesekkurler`, not `[slug]`, not `/blog` in either locale | + contains every indexable gate route as a `<loc>`, not `/blog` (W4), and **every `<loc>` answers 200** (W20 gating) | driven by the route table; the 200-sweep is what makes a sitemap full of 404s impossible at Gate A |
| seo: robots | Task 3's version (W37: no `Disallow: /blog` assertion) | unchanged: sitemap pointer, `Disallow: /tesekkurler`, no `[slug]` | `/blog` is in `UNBUILT_PATHNAMES` and robots never names an unbuilt route (Task 4 deviation 5) |
| seo: OG (Task 4) | two tests appended by Task 4 (cycles 3 and 4) | merged (renamed, same assertions) — incl. `/og/de/home.png` → 404 | W37/W50 |

What the three existing pages must carry: `data-testid="page-h1"` and `data-lcp-slot="h1"` (the same convention the ports use) on their single `<h1>`; nothing else. T1/T2 replace the spike bodies and keep both attributes on the real h1; the thank-you page keeps them (it is swept by the placeholder counter like every gate route, so it needs its LCP slot named today, not in a later task).

- [ ] **Step 1: Write the failing test**

`e2e/routing.spec.ts` — replace the three tests `'localized Turkish slug renders the internal route'`, `'English slug under /en renders the internal route'` and `'the Link component emits the localized href'` and add the contract loop; the other five tests are unchanged and reproduced so the file is complete:

```ts
import { test, expect } from '@playwright/test';
import { INDEXABLE_GATE_ROUTES } from './routes';

test('root is Turkish, unprefixed', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
});

test('/en is English', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('a superfluous /tr prefix redirects to the root form', async ({ page }) => {
  const res = await page.goto('/tr/isci-talebi');
  expect(new URL(page.url()).pathname).toBe('/isci-talebi');
  expect(res?.status()).toBe(200);
});

test('localized Turkish slug renders the internal route', async ({ page }) => {
  await page.goto('/isci-talebi');
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.getByTestId('page-h1')).toBeVisible();
});

test('English slug under /en renders the internal route', async ({ page }) => {
  await page.goto('/en/hire-workers');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByTestId('page-h1')).toBeVisible();
});

test('the Link component emits the localized href', async ({ page }) => {
  // The desktop nav row's first entry is a next-intl <Link href="/hire-workers"> (the
  // `desktopNav` group, home.002) rendered on every page — in the DOM at every viewport, hidden
  // by CSS below lg — and the same row sits in the hamburger panel and the footer's employers
  // column. TR renders the Turkish slug, EN the prefixed English one. No link text is asserted:
  // the copy is the package's, the href is the routing layer's. (The header CTA is NOT the
  // anchor counted here: on `/` it is the homepage's own #proposal pair, W17/W50.)
  await page.goto('/');
  expect(await page.locator('a[href="/isci-talebi"]').count()).toBeGreaterThan(0);
  await page.goto('/en');
  expect(await page.locator('a[href="/en/hire-workers"]').count()).toBeGreaterThan(0);
});

// The page markup contract every port keeps (docs/ARCHITECTURE.md § Quality gate): one h1,
// tagged page-h1, with real copy — a `{placed}`-style token means a W1 metric placeholder was
// left unfilled, `undefined` means a missing package id rendered in production mode.
for (const route of INDEXABLE_GATE_ROUTES) {
  test(`page contract on ${route}: one h1 tagged page-h1 with real copy`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.locator('h1[data-testid="page-h1"]');
    await expect(h1).toHaveCount(1);
    const text = (await h1.innerText()).trim();
    expect(text.length).toBeGreaterThan(0);
    expect(text).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
  });
}

test('API routes are not intercepted by the locale proxy', async ({ request }) => {
  // The handler's own refusal is the proof it was reached: 401 with a secret configured,
  // 503 without one. A locale-rewritten request could produce neither. The full status
  // matrix lives in e2e/ops.spec.ts.
  const res = await request.post('/api/revalidate');
  expect([401, 503]).toContain(res.status());
  expect(await res.json()).toHaveProperty('error');
});

test('the locale cookie uses our name', async ({ page, context }) => {
  // Two navigations on purpose: next-intl skips the cookie when the resolved locale already
  // matches the browser's accept-language, so a cold /en in an English browser sets nothing.
  await page.goto('/');
  await page.goto('/en');
  const names = (await context.cookies()).map((c) => c.name);
  expect(names).toContain('ja_locale');
  expect(names).not.toContain('NEXT_LOCALE');
});
```

`e2e/seo.spec.ts` — replace the whole file. Its current content is WP1's four tests as edited by Task 3 cycle 3 (sitemap + robots cases) plus the two OG tests Task 4 appended ('the OG image route answers a PNG, is not locale-rewritten and rejects unknown keys' in cycle 3, 'the home page points og:image and twitter:image at the generated PNG' in cycle 4); they are **merged (renamed, same assertions)** into the two OG tests at the end — every assertion Task 4 wrote, including the unknown-locale `/og/de/home.png` → 404, is kept (W37/W50):

```ts
import { test, expect } from '@playwright/test';
import { INDEXABLE_GATE_ROUTES } from './routes';

// Canonicals, hreflang and the sitemap are built from SITE_URL — the production origin — not
// from the host the run happens to hit, so these stay jobsadmire.com URLs against localhost.
const ORIGIN = 'https://www.jobsadmire.com';

// `absoluteUrl` returns `${ORIGIN}/` for the TR root; Next normalises the lone trailing slash
// away when it renders the <link> tag (`trailingSlash: false`) — but keeps it in the sitemap's
// <loc>, so the two helpers below differ for `/` only.
const canonicalOf = (route: string) => (route === '/' ? ORIGIN : `${ORIGIN}${route}`);
const sitemapLocOf = (route: string) => (route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`);

test('the home page has one h1, a canonical and all three hreflang links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', ORIGIN);
  await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', ORIGIN);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}/en`);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', ORIGIN);
});

test('an inner page canonicalises to its own localized URL', async ({ page }) => {
  await page.goto('/en/hire-workers');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/en/hire-workers`,
  );
  await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/isci-talebi`,
  );
});

// Every indexable gate route: self-referencing canonical, both locales + x-default = TR
// (docs/SEO.md — a page missing its own locale in hreflang is a defect), and no noindex.
for (const route of INDEXABLE_GATE_ROUTES) {
  test(`canonical + hreflang on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalOf(route));
    await expect(page.locator('link[hreflang="tr"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    const tr = await page.locator('link[hreflang="tr"]').getAttribute('href');
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', tr ?? '');
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  });
}

test('the sitemap lists every indexable gate route and omits the noindex ones', async ({
  request,
}) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const route of INDEXABLE_GATE_ROUTES) {
    expect(xml).toContain(`<loc>${sitemapLocOf(route)}</loc>`);
  }
  expect(xml).not.toContain('/tesekkurler');
  expect(xml).not.toContain('/thank-you');
  expect(xml).not.toContain('[slug]');
  // W4: /blog and /blog/[slug] are noindex and out of the sitemap below the 6-TR-bodies threshold.
  expect(xml).not.toMatch(/<loc>[^<]*\/blog(\/|<)/);
});

test('every sitemap URL answers 200 — no unbuilt route is advertised (W20)', async ({
  request,
}) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs.length).toBeGreaterThan(0);
  for (const loc of locs) {
    const url = new URL(loc);
    expect(url.origin).toBe(ORIGIN);
    const res = await request.get(`${url.pathname}${url.search}`);
    expect(res.status(), loc).toBe(200);
  }
});

test('robots.txt serves the production rules and points at the sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  // VERCEL_ENV is unset locally, so this is the production ruleset, not the preview one.
  const body = await res.text();
  expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  expect(body).toContain('Disallow: /tesekkurler');
  // W20/W37: an unbuilt noindex route (/blog today) is never named — nothing is asserted about it.
  expect(body).not.toContain('[slug]');
});

test('every page carries the Organization/EmploymentAgency node', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('"@type":["Organization","EmploymentAgency"]');
});

test('the generated OG image answers as a PNG and the home page points at it', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/tr/home.png`,
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/tr/home.png`,
  );
  // Same host as the page under test, not ORIGIN: proves the route renders here, with its font.
  const res = await request.get('/og/tr/home.png');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
  expect((await res.body()).subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
});

test('the OG route is not locale-rewritten and rejects unknown keys', async ({ request }) => {
  expect((await request.get('/og/en/hire.png')).status()).toBe(200);
  expect((await request.get('/og/tr/not-a-page.png')).status()).toBe(404);
  expect((await request.get('/og/de/home.png')).status()).toBe(404);
});
```

Run line (needs a server — build once, start on 3100, as `README.md` § Running the gate shows; one build/test job at a time on this machine):
```
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts e2e/seo.spec.ts
```

- [ ] **Step 2: Run test to verify it fails**

Before the page edits: `page contract on /` fails with `expect(locator).toHaveCount(1) … Locator: locator('h1[data-testid="page-h1"]') … Received: 0` (the spike h1 is `home-h1`), `page contract on /isci-talebi` likewise (`hire-h1`), and both slug tests fail on `getByTestId('page-h1')` not visible. Everything in `seo.spec.ts` is already green (Task 4's gating makes the sitemap exactly the four built routes, so the W20 sweep passes) — those tests are a regression net for the page tasks, not a red step here.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/page.tsx` — the spike `<h1 data-testid="home-h1">{locale === 'tr' ? 'Ana sayfa' : 'Home'}</h1>` line becomes:

```tsx
      <h1 data-testid="page-h1" data-lcp-slot="h1">
        {locale === 'tr' ? 'Ana sayfa' : 'Home'}
      </h1>
```

`src/app/[locale]/(site)/hire-workers/page.tsx` — the spike `return <h1 data-testid="hire-h1">{locale}</h1>;` becomes:

```tsx
  return (
    <h1 data-testid="page-h1" data-lcp-slot="h1">
      {locale}
    </h1>
  );
```

`src/app/[locale]/(minimal)/thank-you/page.tsx` — the line `<h1 className="text-h2">{sys('thankYou.title')}</h1>` becomes:

```tsx
        <h1 className="text-h2" data-testid="page-h1" data-lcp-slot="h1">
          {sys('thankYou.title')}
        </h1>
```

No other source change: the `/isci-talebi` and `/en/hire-workers` anchors the routing spec counts come from Task 1's `desktopNav`/`hamburger`/`footerEmployers` rows rendered by Task 3's Header/Footer (see the table above). `e2e/thank-you.spec.ts` asserts `h1` count only and keeps passing.

- [ ] **Step 4: Run the tests + `npm run verify`**

```
npx prettier --write e2e/routing.spec.ts e2e/seo.spec.ts "src/app/[locale]/(site)/page.tsx" "src/app/[locale]/(site)/hire-workers/page.tsx" "src/app/[locale]/(minimal)/thank-you/page.tsx"
npm run verify                                                        # green
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4 \
  && E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts e2e/seo.spec.ts e2e/thank-you.spec.ts; kill $(cat /tmp/next.pid)
```
Expected: routing 12 × 2 projects passed (8 + 4 contract), seo 12 × 2 passed (2 literal + 4 loop + sitemap + 200-sweep + robots + JSON-LD + 2 OG), thank-you unchanged. Then the full local gate once (server restarted the same way): `E2E_BASE_URL=http://localhost:3100 npm run gate` → `gate: OK` (LCP advisory, R50) with the js-size table printed.

- [ ] **Step 5: Commit**

```
git add e2e/routing.spec.ts e2e/seo.spec.ts "src/app/[locale]/(site)/page.tsx" "src/app/[locale]/(site)/hire-workers/page.tsx" "src/app/[locale]/(minimal)/thank-you/page.tsx"
git commit -m "test(e2e): page-contract assertions — page-h1, localized hrefs, canonical/hreflang per route, sitemap 200-sweep (W20/W21/W4)

routing.spec no longer reads the spike h1 text; seo.spec loops INDEXABLE_GATE_ROUTES, proves
every sitemap <loc> answers 200 so an unbuilt route can never reach Gate A's sitemap, and keeps
Task 4's OG tests. The two spike pages and the thank-you page carry data-testid=page-h1 +
data-lcp-slot=h1, the markup contract every port keeps.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 4 — `--profile=launch`: `UNBUILT_PATHNAMES`-empty check + D26/W55 placeholder counter**

- [ ] **Step 1: Write the failing test**

`scripts/placeholder-count.test.ts`:

```ts
/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { evaluateScan, formatReadinessTable, scanPlaceholders } from './placeholder-count';

// What a ported page's server HTML looks like: the RSC flight payload repeats the props inside
// a <script> (never as tags), a commented-out slot, two named placeholders (one an ImageSlot
// fallback, one self-closing), the h1 as the LCP element.
const PAGE = `<!DOCTYPE html><html lang="tr"><head>
<script>self.__next_f.push([1,"<div data-placeholder=\\"in-flight\\"></div>"])</script>
</head><body>
<!-- <img data-placeholder="in-comment"> -->
<section class="hero">
  <div role="img" aria-label="" class="bg-gradient-to-b" data-placeholder="v4-hero"></div>
  <h1 data-testid="page-h1" data-lcp-slot="h1">Türkiye'de çalışacak doğrulanmış işçiler</h1>
</section>
<img src="/brand/ja-mark.png" alt="" data-placeholder='rep-founder'>
<div data-placeholder="portal-shortlist"/>
</body></html>`;

describe('placeholder-count (D26)', () => {
  it('counts data-placeholder and data-lcp-slot on real tags only', () => {
    const scan = scanPlaceholders(PAGE);
    expect(scan.placeholders).toEqual(['v4-hero', 'rep-founder', 'portal-shortlist']);
    expect(scan.lcpSlots).toEqual(['h1']);
    expect(scan.both).toEqual([]);
  });

  it('passes a page whose LCP slot is real and reports the placeholder count', () => {
    const v = evaluateScan('/', 200, scanPlaceholders(PAGE));
    expect(v).toEqual({
      route: '/',
      status: 200,
      placeholders: ['v4-hero', 'rep-founder', 'portal-shortlist'],
      lcpSlot: 'h1',
      problems: [],
    });
  });

  it('fails when the LCP slot is itself a placeholder (same element — an ImageSlot without src)', () => {
    const html = `<h1 data-lcp-slot="h1">x</h1><div role="img" data-placeholder="hw-hero" data-lcp-slot="hw-hero"></div>`;
    const v = evaluateScan('/isci-talebi', 200, scanPlaceholders(html));
    expect(v.problems).toContain('LCP slot "hw-hero" is a placeholder (D26)');
    expect(v.problems).toContain('more than one data-lcp-slot: h1, hw-hero');
  });

  it('fails when the LCP slot name is also rendered as a placeholder elsewhere', () => {
    const html = `<div data-placeholder="hw-hero"></div><h1 data-lcp-slot="hw-hero">x</h1>`;
    const v = evaluateScan('/isci-talebi', 200, scanPlaceholders(html));
    expect(v.problems).toEqual(['LCP slot "hw-hero" is a placeholder (D26)']);
  });

  it('reads a bare data-placeholder as unnamed and fails it (W55)', () => {
    const scan = scanPlaceholders(`<div data-placeholder>bare</div><h1 data-lcp-slot="h1">t</h1>`);
    expect(scan.placeholders).toEqual(['']);
    expect(evaluateScan('/x', 200, scan).problems).toEqual(['unnamed data-placeholder (W55)']);
  });

  it('fails when no LCP slot is named or the route did not answer 200', () => {
    expect(evaluateScan('/x', 200, scanPlaceholders('<h1>x</h1>')).problems).toEqual([
      'no data-lcp-slot on the page',
    ]);
    expect(evaluateScan('/x', 404, scanPlaceholders('')).problems).toEqual([
      'HTTP 404',
      'no data-lcp-slot on the page',
    ]);
    expect(evaluateScan('/x', null, scanPlaceholders('')).problems[0]).toBe('no response');
  });

  it('prints the content-readiness table', () => {
    const table = formatReadinessTable([
      evaluateScan('/', 200, scanPlaceholders(PAGE)),
      evaluateScan('/en', 200, scanPlaceholders('<h1 data-lcp-slot="h1">Home</h1>')),
      evaluateScan('/x', 200, scanPlaceholders('<div data-placeholder></div><h1 data-lcp-slot="h1">t</h1>')),
    ]);
    expect(table).toContain('| / | 200 | 3 | v4-hero, rep-founder, portal-shortlist | h1 | ok |');
    expect(table).toContain('| /en | 200 | 0 | — | h1 | ok |');
    expect(table).toContain('| /x | 200 | 1 | (unnamed) | h1 | FAIL: unnamed data-placeholder (W55) |');
  });
});
```

Run line: `npx vitest run scripts/placeholder-count.test.ts`

- [ ] **Step 2: Run test to verify it fails**

`npx vitest run scripts/placeholder-count.test.ts` → `Error: Failed to load url ./placeholder-count` (module missing).

- [ ] **Step 3: Implement**

`scripts/placeholder-count.ts` (new):

```ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { GATE_ROUTES } from '../e2e/routes';

/**
 * D26 content-readiness (the launch profile of `scripts/gate.sh`): every image slot a page
 * renders without its real asset carries `data-placeholder="<design slot id>"` (Task 5's
 * `ImageSlot` emits it; W55: always named); the element Lighthouse will pick as LCP carries
 * `data-lcp-slot="<slot>"` (the hero `<img>` once the photo ships, the h1 on a gradient hero).
 * A page's named LCP slot may never be a placeholder. Server HTML is enough — both attributes
 * are rendered by server components, so no browser runs.
 */
export type PlaceholderScan = { placeholders: string[]; lcpSlots: string[]; both: string[] };
export type RouteVerdict = {
  route: string;
  status: number | null;
  placeholders: string[];
  lcpSlot: string | null;
  problems: string[];
};

const TAG_RE = /<([a-zA-Z][\w-]*)\b([^>]*)>/g;

/** Attribute value from a start tag's attribute string; `''` for a bare attribute, `null` when absent. */
function attr(attrs: string, name: string): string | null {
  const re = new RegExp(
    `(?:^|\\s)${name}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>/]+)))?(?=[\\s/]|$)`,
  );
  const m = re.exec(attrs);
  if (!m) return null;
  return m[1] ?? m[2] ?? m[3] ?? '';
}

export function scanPlaceholders(html: string): PlaceholderScan {
  // The RSC flight payload (`<script>self.__next_f.push(…)`) carries the same props as JSON —
  // never as tags — but strip scripts and comments anyway so nothing but rendered markup counts.
  const markup = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const scan: PlaceholderScan = { placeholders: [], lcpSlots: [], both: [] };
  for (const m of markup.matchAll(TAG_RE)) {
    const attrs = m[2];
    const placeholder = attr(attrs, 'data-placeholder');
    const lcp = attr(attrs, 'data-lcp-slot');
    if (placeholder !== null) scan.placeholders.push(placeholder);
    if (lcp !== null) scan.lcpSlots.push(lcp);
    if (placeholder !== null && lcp !== null) scan.both.push(lcp || placeholder);
  }
  return scan;
}

export function evaluateScan(
  route: string,
  status: number | null,
  scan: PlaceholderScan,
): RouteVerdict {
  const problems: string[] = [];
  if (status === null) problems.push('no response');
  else if (status !== 200) problems.push(`HTTP ${status}`);
  if (scan.lcpSlots.length === 0) problems.push('no data-lcp-slot on the page');
  if (scan.lcpSlots.length > 1)
    problems.push(`more than one data-lcp-slot: ${scan.lcpSlots.join(', ')}`);
  const flagged = new Set<string>(scan.both);
  for (const slot of scan.lcpSlots) if (slot && scan.placeholders.includes(slot)) flagged.add(slot);
  for (const slot of flagged) problems.push(`LCP slot "${slot}" is a placeholder (D26)`);
  if (scan.placeholders.includes('')) problems.push('unnamed data-placeholder (W55)');
  return {
    route,
    status,
    placeholders: scan.placeholders,
    lcpSlot: scan.lcpSlots[0] ?? null,
    problems,
  };
}

const name = (s: string) => (s === '' ? '(unnamed)' : s);

export function formatReadinessTable(verdicts: RouteVerdict[]): string {
  const lines = [
    '| route | status | placeholders | slots | LCP slot | verdict |',
    '| --- | ---: | ---: | --- | --- | --- |',
  ];
  for (const v of verdicts) {
    lines.push(
      `| ${v.route} | ${v.status ?? '—'} | ${v.placeholders.length} | ${
        v.placeholders.length ? v.placeholders.map(name).join(', ') : '—'
      } | ${v.lcpSlot ?? '—'} | ${v.problems.length ? `FAIL: ${v.problems.join('; ')}` : 'ok'} |`,
    );
  }
  return lines.join('\n');
}

async function fetchRoute(
  base: string,
  route: string,
): Promise<{ status: number | null; html: string }> {
  try {
    const res = await fetch(`${base}${route}`, {
      headers: { accept: 'text/html' },
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
    });
    return { status: res.status, html: res.ok ? await res.text() : '' };
  } catch {
    return { status: null, html: '' };
  }
}

async function main() {
  const base = (process.env.E2E_BASE_URL ?? '').replace(/\/$/, '');
  if (!base) {
    console.error('placeholder-count: set E2E_BASE_URL to the preview or local URL');
    process.exit(2);
  }
  const verdicts: RouteVerdict[] = [];
  for (const route of GATE_ROUTES) {
    const { status, html } = await fetchRoute(base, route);
    verdicts.push(evaluateScan(route, status, scanPlaceholders(html)));
  }
  const table = formatReadinessTable(verdicts);
  console.log(`\ngate: content readiness (D26) — ${base}\n\n${table}\n`);
  const outDir = join(__dirname, '..', 'lighthouse-report');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, 'content-readiness.json'),
    JSON.stringify({ base, generatedAt: new Date().toISOString(), routes: verdicts }, null, 1),
  );
  const failing = verdicts.filter((v) => v.problems.length);
  if (failing.length) {
    console.error(`placeholder-count: ${failing.length} route(s) fail the LCP-slot / naming rules`);
    process.exit(1);
  }
  const total = verdicts.reduce((n, v) => n + v.placeholders.length, 0);
  console.log(
    `placeholder-count: ${total} placeholder(s) across ${verdicts.length} route(s); no LCP slot is a placeholder`,
  );
}

if (require.main === module) void main();
```

`scripts/launch/unbuilt-routes.launch-check.ts` (new — a Vitest file by design: `src/lib/seo/routes.ts` pulls next-intl's navigation build, which only the Vitest resolver is proven to load outside Next (R19: `server.deps.inline: ['next-intl']`); `tsx` is not):

```ts
/** @vitest-environment node */
import { expect, it } from 'vitest';
import { UNBUILT_PATHNAMES } from '@/lib/seo/routes';

// W20: each page task deletes its own entry; Gate A requires the set to be empty so the sitemap
// (which skips these) advertises every route. Runs ONLY under vitest.launch.config.mts — it is
// expected to fail until the last page lands, so it must never join `npm run verify`.
it('every pathnames route is built — UNBUILT_PATHNAMES is empty (W20)', () => {
  expect([...UNBUILT_PATHNAMES]).toEqual([]);
});
```

`vitest.launch.config.mts` (new — W50: the import path is `./vitest.config.mjs`; TypeScript maps `.mjs` → `.mts` under every `moduleResolution` and refuses a literal `.mts` import without `allowImportingTsExtensions` (TS5097), and Vite 8's rolldown config bundler performs the same remap at runtime, so the one spelling satisfies both):

```ts
import { defineConfig } from 'vitest/config';
import base from './vitest.config.mjs';

// The launch profile's source-level check (scripts/launch/*.launch-check.ts). A separate config
// — not a filter — because the default `include` (scripts/**/*.test.ts) must never match these:
// they fail on purpose until Gate A, and the default suite runs inside every Vercel build.
// Spread, not mergeConfig: mergeConfig concatenates `include` arrays, which would run everything.
// No setup file: the jsdom/RTL setup is for component tests; this is a pure Node assertion.
export default defineConfig({
  ...base,
  test: {
    ...base.test,
    include: ['scripts/launch/**/*.launch-check.ts'],
    environment: 'node',
    setupFiles: [],
  },
});
```

(`base` is typed `UserConfig` by vitest's `defineConfig(config: UserConfig): UserConfig` overload — `vitest/dist/config.d.ts` — so `base.test` needs no cast; `tsconfig.json` includes `**/*.mts`, so this file is type-checked by `npm run typecheck`.)

`scripts/gate.sh` — replace the launch placeholder block (the `if [ "$PROFILE" = launch ]` … `fi` written in Cycle 1) with:

```bash
if [ "$PROFILE" = launch ]; then
  # W20: no route may still be listed as unbuilt (the sitemap skips them; Gate A wants all).
  echo "gate: launch — every pathnames route is built (W20)"
  npx vitest run --config vitest.launch.config.mts
  # D26/W55: placeholder counter + LCP-slot rule over every gate route; the table is the
  # content-readiness card and lands in lighthouse-report/content-readiness.json.
  echo "gate: launch — content readiness (D26)"
  npx tsx scripts/placeholder-count.ts
fi
```

`package.json` — Edit the `scripts` object (W42): insert `"gate:launch": "bash scripts/gate.sh --profile=launch",` on the line after `"gate": "bash scripts/gate.sh",` (so the order reads `gate`, `gate:launch`, `js-size`).

- [ ] **Step 4: Run the tests + `npm run verify`**

```
npx prettier --write scripts/placeholder-count.ts scripts/placeholder-count.test.ts scripts/launch/unbuilt-routes.launch-check.ts vitest.launch.config.mts package.json
npx vitest run scripts/placeholder-count.test.ts                      # 7 passed
npx vitest run --config vitest.launch.config.mts                       # 1 test, FAILS today (UNBUILT_PATHNAMES has 19 keys) — expected until T15
npm run verify                                                          # green — the launch-check file is not in the default include
# Against the local server from Cycle 3 (restart it the same way if it was killed):
E2E_BASE_URL=http://localhost:3100 npx tsx scripts/placeholder-count.ts
#   prints the table: /, /en, /isci-talebi, /en/hire-workers, /tesekkurler?form=hire → 0 placeholders, LCP slot h1, ok — exit 0
```

- [ ] **Step 5: Commit**

```
git add scripts/placeholder-count.ts scripts/placeholder-count.test.ts scripts/launch/unbuilt-routes.launch-check.ts vitest.launch.config.mts scripts/gate.sh package.json
git commit -m "feat(gate): --profile=launch — UNBUILT_PATHNAMES-empty check + D26/W55 placeholder counter (W20)

npm run gate:launch adds two steps after the four gates: a launch-only Vitest config asserting
UNBUILT_PATHNAMES is empty, and scripts/placeholder-count.ts, which fetches every gate route,
counts [data-placeholder], requires exactly one [data-lcp-slot], fails when that slot is a
placeholder or a placeholder is unnamed; prints the content-readiness table and writes
lighthouse-report/content-readiness.json.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 5 — D27 pixel harness: `scripts/pixel-compare.ts`, `npm run pixel`, `.pixel/` ignored**

How the design side renders (read from `design-package/design/JobsAdmire Homepage v4.dc.html` + `support.js`): the `.dc.html` is a Claude Design component — `<x-dc>` template + a `text/x-dc` script — booted by `./support.js`, which fetches React 18.3.1 and Babel standalone from unpkg at runtime (`support.js:1143–1147`), then `image-slot.js` (placeholder boxes) and `ja-i18n.js` (TR text swap). It needs HTTP (relative script paths), network (unpkg, Google Fonts, and on the Homepage d3/topojson/flagcdn), and a language: `localStorage['ja-lang'] = 'TR' | 'EN'` (`Homepage v4.dc.html:1481`), with `?lang=tr` winning as a review language (`reviewLang()`, `:1469–1474`, accepts `tr|fr|ru` — `?lang=en` is ignored, so for EN the stored value decides); hint dismissed via `localStorage['ja-lang-hint'] = 'off'` (`:1501`). Above 1101 px it applies `html { zoom: 0.75 }` (`:16`) — which is exactly the D19 normalisation this repo bakes into its tokens, so the 1440 shots compare like-for-like. Under `prefers-reduced-motion: reduce` every `.ja-reveal` is visible without scrolling and the hero animations are static (`:41–76`) — both sides are captured with reduced motion.

- [ ] **Step 1: Write the failing test**

`scripts/pixel-compare.test.ts`:

```ts
/** @vitest-environment node */
import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { comparePngs, PIXEL_PAGES, PIXEL_WIDTHS, resolvePixelRoute } from './pixel-compare';

const png = (width: number, height: number, black: Array<[number, number]> = []) => {
  const p = new PNG({ width, height });
  p.data.fill(255);
  for (const [x, y] of black) {
    const i = (y * width + x) * 4;
    p.data[i] = 0;
    p.data[i + 1] = 0;
    p.data[i + 2] = 0;
  }
  return p;
};

// Task 1's blog rows (W33): slugs are nullable per locale, hasBody says which locale has a body.
const bundle = {
  collections: {
    blog: [
      { slug: { tr: null, en: 'unwritten' }, hasBody: { tr: false, en: false } },
      {
        slug: { tr: 'calisma-izni-rehberi', en: 'work-permit-guide' },
        hasBody: { tr: false, en: true },
      },
    ],
  },
};

describe('pixel harness (D27)', () => {
  it('nominates the four pages at the three widths', () => {
    expect(Object.keys(PIXEL_PAGES).sort()).toEqual(['blog-article', 'calc', 'hire', 'home']);
    expect(PIXEL_WIDTHS).toEqual([390, 900, 1440]);
    for (const p of Object.values(PIXEL_PAGES)) expect(p.design.endsWith('.dc.html')).toBe(true);
  });

  it('resolves the built route per locale', () => {
    expect(resolvePixelRoute('home', 'tr', null)).toBe('/');
    expect(resolvePixelRoute('home', 'en', null)).toBe('/en');
    expect(resolvePixelRoute('hire', 'tr', null)).toBe('/isci-talebi');
    expect(resolvePixelRoute('calc', 'en', null)).toBe('/en/hiring-cost-calculator');
  });

  it('resolves the blog article from the first written body of that locale', () => {
    expect(resolvePixelRoute('blog-article', 'en', bundle)).toBe('/en/blog/work-permit-guide');
    expect(() => resolvePixelRoute('blog-article', 'tr', bundle)).toThrow(/no blog body in tr/);
    expect(() => resolvePixelRoute('blog-article', 'tr', null)).toThrow(/no blog body in tr/);
  });

  it('lets --route override every resolution', () => {
    expect(resolvePixelRoute('blog-article', 'tr', null, '/blog/x')).toBe('/blog/x');
    expect(resolvePixelRoute('home', 'tr', null, '/en')).toBe('/en');
  });

  it('scores identical images at 100 and one pixel of sixteen at 93.75', () => {
    expect(comparePngs(png(4, 4), png(4, 4)).match).toBe(100);
    const r = comparePngs(png(4, 4), png(4, 4, [[1, 1]]));
    expect(r.diffPixels).toBe(1);
    expect(r.match).toBe(93.75);
    expect(r.diff.width).toBe(4);
  });

  it('pads the shorter capture to the taller one before diffing', () => {
    const r = comparePngs(png(4, 4), png(4, 6));
    expect(r.width).toBe(4);
    expect(r.height).toBe(6);
    // 8 padded (white) pixels against 8 white pixels — identical after padding.
    expect(r.diffPixels).toBe(0);
    expect(r.match).toBe(100);
  });
});
```

Run line: `npx vitest run scripts/pixel-compare.test.ts`

- [ ] **Step 2: Run test to verify it fails**

`npx vitest run scripts/pixel-compare.test.ts` → `Error: Failed to resolve import "pngjs"` (not installed) — then, after `npm i -D`, `Failed to load url ./pixel-compare`.

- [ ] **Step 3: Implement**

Install (exact majors — pixelmatch 5.3.0 and pngjs 7.0.0 are CommonJS (no `"type"` field), which `tsx`'s CJS mode for this non-`"type": "module"` repo loads without `require(esm)`; pixelmatch 6+ is ESM-only. `@types/pixelmatch@5.2.6` declares `export = Pixelmatch` (default import under `esModuleInterop`), `@types/pngjs@6.0.5` declares `PNG.bitblt`, `PNG.sync.read/write` and `data: Buffer` — all verified against the published tarballs):

```
npm i -D pixelmatch@^5.3.0 pngjs@^7.0.0 @types/pixelmatch@^5.2.6 @types/pngjs@^6.0.5
```

`scripts/pixel-compare.ts` (new):

```ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, normalize } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * D27 pixel harness: the design package's own page (`design-package/design/<Page>.dc.html`,
 * served over a throw-away static server so `./support.js` and friends resolve) against the
 * built route at 390 / 900 / 1440, full page, reduced motion, pixelmatch diff. Four nominated
 * pages (W15): Homepage, Hire Workers, Cost Calculator, Blog Article. Every other page is
 * side-by-side review. The two-iteration cap and the logged deltas are a ledger rule
 * (docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md), not code.
 *
 *   npm run pixel -- --page=home [--locale=tr|en] [--base=http://localhost:3100] [--route=/x] [--widths=390,900,1440]
 *
 * Needs network (the design runtime loads React/Babel from unpkg and Archivo from Google Fonts)
 * and a running build of this site (`--base`, default E2E_BASE_URL or http://localhost:3000).
 * Never part of the gate or CI. Output under .pixel/ (git-ignored).
 */
const ROOT = join(__dirname, '..');
const DESIGN_DIR = join(ROOT, 'design-package', 'design');
const OUT_DIR = join(ROOT, '.pixel');

export const PIXEL_WIDTHS = [390, 900, 1440] as const;
export type PixelLocale = 'tr' | 'en';
export type PixelPageKey = 'home' | 'hire' | 'calc' | 'blog-article';

/** The two fields of Task 1's blog rows (W33) this harness reads; slugs are nullable per locale. */
type BlogRow = {
  slug: { tr: string | null; en: string | null };
  hasBody: { tr: boolean; en: boolean };
};
export type PixelBundle = { collections: { blog?: BlogRow[] } };

export const PIXEL_PAGES: Record<
  PixelPageKey,
  { design: string; route: Record<PixelLocale, string> | 'blog' }
> = {
  home: { design: 'JobsAdmire Homepage v4.dc.html', route: { tr: '/', en: '/en' } },
  hire: { design: 'Hire Workers.dc.html', route: { tr: '/isci-talebi', en: '/en/hire-workers' } },
  calc: {
    design: 'Hiring Cost Calculator.dc.html',
    route: { tr: '/maliyet-hesaplayici', en: '/en/hiring-cost-calculator' },
  },
  // The one written article (CONTENT-MODEL § Blog); its slug comes from the blog collection.
  // T12 ships the body before this page can be compared; --route overrides the lookup.
  'blog-article': { design: 'Blog Article.dc.html', route: 'blog' },
};

export function resolvePixelRoute(
  page: PixelPageKey,
  locale: PixelLocale,
  bundle: PixelBundle | null,
  override?: string | null,
): string {
  if (override) return override;
  const spec = PIXEL_PAGES[page];
  if (spec.route !== 'blog') return spec.route[locale];
  const row = bundle?.collections.blog?.find((b) => b.hasBody[locale] && b.slug[locale]);
  if (!row) throw new Error(`pixel: no blog body in ${locale} — pass --route=/blog/<slug>`);
  return locale === 'tr' ? `/blog/${row.slug.tr}` : `/en/blog/${row.slug.en}`;
}

function padTo(src: PNG, width: number, height: number): PNG {
  if (src.width === width && src.height === height) return src;
  const out = new PNG({ width, height });
  out.data.fill(255);
  PNG.bitblt(src, out, 0, 0, Math.min(src.width, width), Math.min(src.height, height), 0, 0);
  return out;
}

/** Pads both captures to the larger canvas (white), then pixelmatch at threshold 0.1. */
export function comparePngs(
  design: PNG,
  built: PNG,
): { diff: PNG; width: number; height: number; diffPixels: number; match: number } {
  const width = Math.max(design.width, built.width);
  const height = Math.max(design.height, built.height);
  const a = padTo(design, width, height);
  const b = padTo(built, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 });
  const match = Math.round((1 - diffPixels / (width * height)) * 10_000) / 100;
  return { diff, width, height, diffPixels, match };
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};

/** Static server for design-package/design/ — the .dc.html files need HTTP, not file:// (README). */
function serveDesign(): Promise<{ server: Server; origin: string }> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      if (req.method !== 'GET') {
        res.writeHead(405).end();
        return;
      }
      const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
      const file = normalize(join(DESIGN_DIR, path));
      if (!file.startsWith(DESIGN_DIR) || !existsSync(file)) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

function arg(name: string): string | null {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}

function readLocalBundle(locale: PixelLocale): PixelBundle | null {
  // The sanctioned readFileSync bypass for scripts/ (D23 governs src/**, not tooling).
  const file = join(ROOT, 'src', 'content', 'local', `bundle.${locale}.json`);
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as PixelBundle) : null;
}

type Result = {
  width: number;
  designHeight: number;
  builtHeight: number;
  diffPixels: number;
  match: number;
};

async function main() {
  const page = arg('page') as PixelPageKey | null;
  if (!page || !(page in PIXEL_PAGES)) {
    console.error(`pixel: --page=${Object.keys(PIXEL_PAGES).join('|')} is required`);
    process.exit(2);
  }
  const locale = (arg('locale') ?? 'tr') as PixelLocale;
  if (locale !== 'tr' && locale !== 'en') {
    console.error('pixel: --locale must be tr or en');
    process.exit(2);
  }
  const base = (arg('base') ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    '',
  );
  const widths = (arg('widths')?.split(',').map(Number) ?? [...PIXEL_WIDTHS]).filter(Boolean);
  const route = resolvePixelRoute(page, locale, readLocalBundle(locale), arg('route'));
  const design = PIXEL_PAGES[page].design;

  // Loaded here, not at module top, so the unit tests import the pure functions without
  // pulling the Playwright runner into Vitest.
  const { chromium } = await import('@playwright/test');
  const { server, origin } = await serveDesign();
  const browser = await chromium.launch();
  mkdirSync(OUT_DIR, { recursive: true });
  const results: Result[] = [];
  try {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        locale: locale === 'tr' ? 'tr-TR' : 'en-US',
        reducedMotion: 'reduce',
      });
      // Design side: language + hint via the package's own localStorage keys; built side: the
      // LanguageHint's HINT_KEY ('ja-lang-hint'), same value — one init script serves both.
      await context.addInitScript((lang: string) => {
        try {
          localStorage.setItem('ja-lang', lang);
          localStorage.setItem('ja-lang-hint', 'off');
        } catch {
          /* storage blocked — the hint is then a tolerated delta */
        }
      }, locale.toUpperCase());

      const designPage = await context.newPage();
      await designPage.goto(`${origin}/${encodeURIComponent(design)}?lang=${locale}`, {
        waitUntil: 'networkidle',
        timeout: 90_000,
      });
      await designPage.waitForSelector('h1', { state: 'attached', timeout: 30_000 });
      await designPage.evaluate(async () => {
        await document.fonts.ready;
      });
      await designPage.waitForTimeout(800);
      const designPng = PNG.sync.read(await designPage.screenshot({ fullPage: true }));

      const builtPage = await context.newPage();
      await builtPage.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 60_000 });
      await builtPage.evaluate(async () => {
        await document.fonts.ready;
      });
      await builtPage.waitForTimeout(300);
      const builtPng = PNG.sync.read(await builtPage.screenshot({ fullPage: true }));
      await context.close();

      const cmp = comparePngs(designPng, builtPng);
      const stem = join(OUT_DIR, `${page}-${locale}-${width}`);
      writeFileSync(`${stem}.png`, PNG.sync.write(cmp.diff));
      writeFileSync(`${stem}-design.png`, PNG.sync.write(designPng));
      writeFileSync(`${stem}-built.png`, PNG.sync.write(builtPng));
      results.push({
        width,
        designHeight: designPng.height,
        builtHeight: builtPng.height,
        diffPixels: cmp.diffPixels,
        match: cmp.match,
      });
      console.log(
        `pixel: ${page} ${locale} @${width} → ${cmp.match.toFixed(2)} % match (design ${designPng.height}px, built ${builtPng.height}px) → ${stem}.png`,
      );
    }
  } finally {
    await browser.close();
    server.close();
  }

  const reportFile = join(OUT_DIR, 'report.json');
  const report: Record<string, unknown> = existsSync(reportFile)
    ? (JSON.parse(readFileSync(reportFile, 'utf8')) as Record<string, unknown>)
    : {};
  report[`${page}-${locale}`] = {
    base,
    route,
    design,
    generatedAt: new Date().toISOString(),
    results,
  };
  writeFileSync(reportFile, JSON.stringify(report, null, 1));
  console.log(`pixel: report → ${reportFile}`);
}

if (require.main === module) void main();
```

`package.json` — Edit the `scripts` object (W42): insert `"pixel": "tsx scripts/pixel-compare.ts",` on the line after `"js-size": "node scripts/js-size.mjs",`. The `scripts` block **after this task** (Task 6's three `assets:*` lines stay exactly where Task 6 left them — this block is the expected end state, not a paste target):

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --check .",
    "format:write": "prettier --write .",
    "test": "NODE_ENV=test vitest run",
    "test:watch": "NODE_ENV=test vitest",
    "verify": "npm run typecheck && npm run lint && npm run format && npm run test",
    "e2e": "playwright test",
    "gate": "bash scripts/gate.sh",
    "gate:launch": "bash scripts/gate.sh --profile=launch",
    "js-size": "node scripts/js-size.mjs",
    "pixel": "tsx scripts/pixel-compare.ts",
    "content:import": "tsx scripts/import-design-package.ts",
    "redirects:build": "tsx scripts/build-redirects.ts",
    "assets:brand": "bash scripts/fetch-brand.sh",
    "assets:flags": "tsx scripts/build-flags.ts",
    "assets:map": "tsx scripts/build-source-map.ts"
  },
```

(`wp2/foundation` already carries four build/env commits on top of `ad58fb8` — cb8869f (`NODE_ENV=test` pinned on `test`/`test:watch`), 126163a (`npm ci --include=dev` on Vercel), 92c3083 (vitest.config.mts `env` pins) and b47b729 (`vercel.json` in `.prettierignore`) — so every anchor on `package.json`, `vitest.config.mts`, `.prettierignore` or `vercel.json` must be read from the branch, not from `main`.)

`.gitignore` — in the `# test artefacts` block, add after the `.lighthouseci/` line (Prettier 3 honours `.gitignore` by default, so `.pixel/report.json` never reaches `prettier --check .` — the same way `lighthouse-report/` stays out today):

```
# D27 pixel harness output (diff/design/built PNGs + report.json) — local only, never committed
.pixel/
```

`docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` (new):

```md
# WP2 pixel harness — the two-iteration cap (D27, W15)

`npm run pixel -- --page=home|hire|calc|blog-article [--locale=tr|en] [--base=<url>]` renders the
design package's own page and the built route at 390 / 900 / 1440, full page, reduced motion,
and writes `.pixel/<page>-<locale>-<w>.png` (the pixelmatch diff), `…-design.png`,
`…-built.png` and a `% match` per width into `.pixel/report.json`. It needs network (the
design runtime loads React/Babel from unpkg) and is never part of the gate or CI.

## The rule (a ledger rule, not code)

1. A page task runs the harness **at most twice**: once when the port is first complete, once
   after the fixes that run prompted. The second run's numbers are the ones the ledger records.
2. There is **no numeric pass mark**. The reviewer reads the three diff images and lists every
   visible delta as one of: (a) a named D20 accessibility delta (CTA face `blue-safe`, WhatsApp
   `success-text`, footer hours `white/55`, primary hover `bg-ink`, language hint as a bottom
   sheet, the `/tesekkurler` navigation), (b) a design delta ruled in WP2 (W3 form fields, W6
   empty states, W7 copy, W8 portal chooser, W10 breakpoint classes, W14 local assets in place of
   hot-linked ones, W17 per-page header CTAs), (c) inherent capture noise (rotating hero word,
   marquee position, fixed FAB/bottom bar in a full-page capture, height difference from hidden
   Phase A sections), or (d) **a defect** — fixed before the task is done.
3. After the second run, remaining (d) items go to the task's ledger row as "pixel deltas
   accepted" with a one-line reason each, and the page moves on. A third run needs a controller
   ruling.
4. Ledger row format: `pixel <page> <locale>: 390 → NN.NN %, 900 → NN.NN %, 1440 → NN.NN %;
   run 2 of 2; deltas: (a) …; (b) …; (c) …; (d) accepted: …`.

The other ten pages are Fable side-by-side review (D27) and never run the harness.
```

- [ ] **Step 4: Run the tests + `npm run verify`**

```
npx prettier --write scripts/pixel-compare.ts scripts/pixel-compare.test.ts package.json .gitignore docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md
npx vitest run scripts/pixel-compare.test.ts     # 6 passed
npm run verify                                    # green (package-lock.json updated by the install)
# Smoke the harness once against the local server from Cycle 3 (needs network):
npm run pixel -- --page=hire --base=http://localhost:3100
#   → three lines "pixel: hire tr @390/900/1440 → NN.NN % match …", .pixel/hire-tr-*.png, .pixel/report.json
#   (the spike page vs the design: a low % is expected today; the harness working is what is verified)
npm run verify                                    # still green with .pixel/ present (git-ignored ⇒ prettier-ignored)
```

- [ ] **Step 5: Commit**

```
git add scripts/pixel-compare.ts scripts/pixel-compare.test.ts package.json package-lock.json .gitignore docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md
git commit -m "feat(gate): D27 pixel harness — design .dc.html vs built route at 390/900/1440 with pixelmatch

npm run pixel -- --page=home|hire|calc|blog-article serves design-package/design over a local
static server, captures both sides full-page under reduced motion, pads to a common canvas,
diffs with pixelmatch and writes .pixel/<page>-<locale>-<w>.png + report.json. Two-iteration
cap recorded as a ledger rule in docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 6 — Docs: ARCHITECTURE § Quality gate rewrite, README, CLAUDE.md doc map**

- [ ] **Step 1: Write the failing test**

No new code in this cycle; the test is `npm run verify`'s `prettier --check` over the edited Markdown plus a grep that the stale ceiling is gone (the pattern deliberately excludes "R49's 180 KB", which the new texts cite as history):

```
grep -rnE "184[ ,]?320|180 KB gzipped|180 KB script budget|180 KB, not" CLAUDE.md README.md docs/*.md   # must print nothing after Step 3
```

- [ ] **Step 2: Run test to verify it fails**

The grep prints two `docs/ARCHITECTURE.md` lines: item 4's `**script transfer ≤ 184 320 B (R49)**` and the paragraph `**The JS budget is 180 KB, not the plan's 120 KB (R49).**` (PRD, OPERATING and CLAUDE.md were fixed in Cycle 2; README's § Running the gate names no number).

- [ ] **Step 3: Implement**

`docs/ARCHITECTURE.md` § Quality gate — replace everything from the heading line `## Quality gate (D27)` up to (not including) the paragraph that begins `**A failure is fixed in the component, never by lowering the assertion (D20).**` (that paragraph and its bullets — including the header-threshold bullet Task 3 rewrote — stay exactly as they are) with:

````md
## Quality gate (D27)

`npm run gate` (`scripts/gate.sh`) runs **outside** the Vercel build — there is no Chrome there — against a URL: a preview deployment, or a local `next start`. Once per work package. `npm run gate:launch` (`--profile=launch`) adds the two Gate A checks (item 6) and runs once before Gate A.

```bash
E2E_BASE_URL=https://<preview> REVALIDATE_SECRET=<the server's own secret> npm run gate
```

It runs, in order and never concurrently:

1. **Playwright**, both projects (`mobile` = Pixel 7, `desktop` = 1440×900), no filter — routing, redirects, SEO, chrome, thank-you/conversion, ops, smoke, plus the two gate sweeps below. `REVALIDATE_SECRET` is optional: without it the two token-dependent cases in `e2e/ops.spec.ts` skip themselves (R43) and `gate.sh` says so. `e2e/routing.spec.ts` and `e2e/seo.spec.ts` assert the **page markup contract** below on every indexable route, never page copy, so a port never edits them.
2. **axe** (`e2e/a11y.spec.ts`) over `GATE_ROUTES`, tags `wcag2a wcag2aa wcag22aa`, zero violations. It runs under **both** projects on purpose: the hamburger, the mobile bottom bar and the footer accordions only exist at the mobile viewport. **One route list (W21):** `e2e/routes.ts` holds `GATE_ROUTE_TABLE` (`{ path, indexable }`, both locales); `GATE_ROUTES` (everything) and `INDEXABLE_GATE_ROUTES` (what Lighthouse audits, the SEO spec loops and the sitemap must list) derive from it, and `gate.sh` reads its Lighthouse paths through `node scripts/gate-routes.mjs`. Each page task appends its two locale paths there and nowhere else; a route in `NOINDEX_PATHNAMES` is appended with `indexable: false`.
3. **The width sweep** (`e2e/width-sweep.spec.ts`): no horizontal overflow at 1440/1280/1101/1100/901/900/700/560/460/390 — 1101 and 1100 straddle the D19 boundary, 901 and 900 the header-row boundary (W11).
4. **Lighthouse CI** (`lighthouserc.json`), `formFactor: "mobile"` (Lighthouse's own default — there is no "mobile" _preset_; `--preset` only accepts `perf|experimental|desktop`), 2 runs per path, on every indexable gate route: performance ≥ 0.95, accessibility / best-practices / SEO = 1.0, **script transfer ≤ 204 800 B (W13 amended)**, LCP ≤ 2500 ms, CLS ≤ 0.1, TBT warn at 200 ms. Each `lhci collect` is `--additive`, otherwise it wipes the previous path's result and `lhci assert` would only ever see the last one; `lhci upload --target=filesystem` writes `lighthouse-report/` **before** `assert`, so the reports survive a failing budget (R48). After `assert`, `node scripts/js-size.mjs` (`npm run js-size`) prints the per-route table (worst script size of the runs, headroom, median LCP, lowest score) that the ledger records.

   **The JS ceiling is 200 KB gzipped on every gate route (W13 amended — `docs/superpowers/plans/2026-09-20-wp2-rulings.md`).** R49's 180 KB was right about the floor — `react-dom` (73,398 B) plus the Next App Router client runtime (48,040 B) is **121,438 B before a line of our code**, next-intl's client runtime adds 17,140 B (it cannot move into a lazy island — `src/app/[locale]/(site)/error.tsx`, an eager client component, calls `useTranslations`) — but it left ~11.8 KB over the 172,509 B WP1 shell, no room for a form island. 204,800 B is absolute; heavy islands (calculator, season planner, map hover, blog search/TOC, track chooser) load with `next/dynamic` on interaction or viewport so they never count in the initial audit, and **a route above 194,560 B gets a lazy-loading pass before the next page task starts**. A page that cannot fit is a design question, not a budget question.

   Keeping the budget is a standing constraint on the chrome, not a one-off: client islands that are not needed on first paint load through `next/dynamic(..., { ssr: false })` (`src/design/chrome/ClientIslands.tsx`), and every chrome `<Link>` passes `prefetch={false}` — Next still prefetches on hover, so navigation is unaffected, but the eager `_rsc` requests stay out of the first load.

5. **LCP is an error against a preview or production URL, and a warning against localhost (R50).** `gate.sh` picks `lighthouserc.local.json` — identical but for that one line — when `E2E_BASE_URL` is `localhost`/`127.0.0.1`, and echoes which config it asserted with. Reason: on localhost every asset arrives inside 60 ms, so Lantern's pessimistic LCP graph charges the whole early payload to the paint and reports ~2705 ms on every path alike, while the observed LCP is 54 ms and the same build measures 1503 ms under real (`--throttling-method=devtools`) throttling. **A local run is therefore never sign-off**: the binding gate for a work package is the one against the Vercel preview URL, where LCP is an error like every other budget.
6. **`--profile=launch` (D26, W20) — Gate A only.** Two steps after the four above: `npx vitest run --config vitest.launch.config.mts` runs `scripts/launch/unbuilt-routes.launch-check.ts`, which asserts `UNBUILT_PATHNAMES` (`src/lib/seo/routes.ts`) is empty — a separate Vitest config because the check is meant to fail until the last page lands and the default suite runs inside every Vercel build; then `npx tsx scripts/placeholder-count.ts` fetches every gate route's server HTML, counts `[data-placeholder]`, requires exactly one `[data-lcp-slot]`, fails when that slot is itself a placeholder (same element, or the same slot name rendered as a placeholder) or when a placeholder is unnamed (W55), prints the **content-readiness table** and writes `lighthouse-report/content-readiness.json`.

**Page markup contract** — what every ported page carries so the gate stays green without editing a spec:

- its single `<h1>` carries `data-testid="page-h1"` (and `data-lcp-slot="h1"` when the h1 is the LCP element);
- the element Lighthouse will pick as LCP carries `data-lcp-slot="<slot>"` — the hero `<img>` (its design slot id, e.g. `hw-hero`) once the photo ships, otherwise the h1 with `"h1"`;
- every image slot rendered without its real asset carries `data-placeholder="<design slot id>"` on the fallback element — always named (W55), never on the LCP element (D26). Pages emit both image attributes through the shared `ImageSlot` block (`src/design/blocks/ImageSlot.tsx`, W27) rather than by hand;
- its two locale paths are appended to `GATE_ROUTE_TABLE` (`indexable: false` for `NOINDEX_PATHNAMES` routes), and its `UNBUILT_PATHNAMES` entry is deleted (W20).

**Pixel harness (D27, W15).** `npm run pixel -- --page=home|hire|calc|blog-article [--locale=tr|en] [--base=<url>] [--route=<path>]` (`scripts/pixel-compare.ts`) serves `design-package/design/` over a throw-away static server (the `.dc.html` runtime needs HTTP and, for React/Babel from unpkg, network), captures the design page and the built route full-page at 390/900/1440 under reduced motion with the language and hint pre-set in `localStorage`, pads both to a common canvas and diffs with `pixelmatch`; output is `.pixel/<page>-<locale>-<w>.png` (+ `-design`/`-built` siblings) and a `% match` per width in `.pixel/report.json`. Above 1101 px the design's own `zoom: 0.75` is what D19 bakes into our tokens, so 1440 compares like-for-like. The two-iteration cap, the delta taxonomy and the ledger row are in `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`; the other ten pages are side-by-side review. Never part of the gate or CI.
````

`README.md` § Running the gate: keep the section as is and insert, immediately after the paragraph that begins `**Localhost LCP is a warning, not an error.**` (before the `Other scripts:` line):

```md
**Three more gate commands.** `npm run gate:launch` is the same run plus the Gate A checks (`UNBUILT_PATHNAMES` empty, D26 placeholder counter with the content-readiness table — `docs/ARCHITECTURE.md` § Quality gate item 6); it is expected to fail until the last page lands. `npm run js-size` re-prints the per-route script-size table from the last collected Lighthouse runs (`.lighthouseci/`). `npm run pixel -- --page=home` (also `hire`, `calc`, `blog-article`; `--locale=en`, `--base=<url>`) is the D27 pixel harness — it needs network and a running build, writes `.pixel/` (git-ignored), and is bounded by the two-iteration rule in `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`.
```

`CLAUDE.md` doc map — add one row directly after the last `docs/superpowers/plans/…` row (the WP1 rulings row, or the WP2 rulings/plan rows if the controller's W57 commit added them to the map); `prettier --write` re-pads the table:

```md
| `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` | The D27 pixel harness (`npm run pixel`): the two-iteration cap, the delta taxonomy, the ledger row |
```

- [ ] **Step 4: Run the tests + `npm run verify`**

```
npx prettier --write docs/ARCHITECTURE.md README.md CLAUDE.md
grep -rnE "184[ ,]?320|180 KB gzipped|180 KB script budget|180 KB, not" CLAUDE.md README.md docs/*.md    # prints nothing
npm run verify                                                                                          # green
```
(`docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md` keeps its R49 row verbatim — it is the historical record; W13 amended supersedes it and says so in `docs/superpowers/plans/2026-09-20-wp2-rulings.md`, the controller's file (W57).)

- [ ] **Step 5: Commit**

```
git add docs/ARCHITECTURE.md README.md CLAUDE.md
git commit -m "docs(gate): quality gate as built for WP2 — one route list, 200 KB ceiling, launch profile, page contract, pixel harness

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:** (every edit anchored on the sentence it replaces or follows — W45 — and applied to the text as earlier tasks left it)
- `docs/ARCHITECTURE.md` § Quality gate (Cycle 6): from the heading `## Quality gate (D27)` up to the paragraph beginning `**A failure is fixed in the component, never by lowering the assertion (D20).**` replaced with items 1–6, the **Page markup contract** list and the **Pixel harness** paragraph quoted in Cycle 6 (item 3's width list includes 901 — Task 3's addition; item 1 lists the `chrome` spec Task 3 added). The D20 paragraph and its bullets — including the header-threshold bullet as rewritten by Task 3 cycle 5 — are unchanged. § Design system (Task 5's/Task 6's paragraph) untouched.
- `docs/PRD.md` (Cycle 2): § 6, the paragraph beginning `LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (mobile). Content routes **≤ 180 KB gzipped JS**` replaced with the ≤ 200 KB paragraph quoted in Cycle 2; § 11, in the bullet beginning `- **Quality gate** — Playwright + axe + Lighthouse CI wired end-to-end,`, `the corrected 180 KB script budget` → `the 200 KB script ceiling (W13 amended; R49's 180 KB was WP1's)`. The § 11 **Not yet built** paragraph (Task 2's wording + Task 4's appended clause, W45) is not touched.
- `docs/OPERATING.md` § Work-package sign-off (Cycle 2): in the sentence beginning `Every other budget — performance, accessibility, best-practices, SEO,`, `the 180 KB script budget` → `the 200 KB script ceiling (W13 amended)`.
- `README.md` § Running the gate (Cycle 6): the `**Three more gate commands.**` paragraph inserted after the `**Localhost LCP is a warning, not an error.**` paragraph.
- `CLAUDE.md` (Cycle 2): § Conventions, the bullet beginning `- **The content-route JS budget is 180 KB gzipped, not 120 KB**` replaced with the 200 KB bullet quoted in Cycle 2; (Cycle 6): the doc-map row for `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` after the last `docs/superpowers/plans/…` row.
- `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` (new, Cycle 5): the two-iteration cap, delta taxonomy (a)–(d), ledger row format.
- `lighthouserc.json` / `lighthouserc.local.json` `_comment` fields (Cycle 2) restate the W13 amended reasoning in place.
- Not touched, on purpose: `docs/SEO.md` (sitemap/robots gating is Task 4's doc change, W20/W37), `docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md` (historical R49/R50 rows stay), `docs/superpowers/plans/2026-09-20-wp2-rulings.md` and `…/2026-09-20-wp2a-foundation.md` (the controller's, W57 — cited only), `docs/ANALYTICS.md`, `docs/INTEGRATIONS.md`, `docs/CONTENT-MODEL.md`.

**Produces — deviations:** (1) `e2e/routes.ts` adds `GATE_ROUTE_TABLE` (`{ path, indexable }`) as the authored source; `GATE_ROUTES` and `INDEXABLE_GATE_ROUTES` are derived from it (both `readonly string[]`, source-compatible with the a11y/width-sweep imports). (2) Pixel output files carry the locale: `.pixel/<page>-<locale>-<w>.png` (diff) plus `-design.png`/`-built.png` siblings, and `report.json` is keyed `<page>-<locale>` with `{ base, route, design, generatedAt, results }` — the skeleton's `<page>-<w>.png` had no locale axis; `--locale` defaults to `tr`, so `npm run pixel -- --page=home` still works as written; `PixelBundle` is an exported type and `resolvePixelRoute` skips blog rows whose slug is `null` for the locale (Task 1's nullable slugs, W33). (3) The `UNBUILT_PATHNAMES`-empty check is a Vitest file under a launch-only config (`scripts/launch/unbuilt-routes.launch-check.ts` + `vitest.launch.config.mts`, which imports `./vitest.config.mjs` per W50) rather than a `tsx` script, because `src/lib/seo/routes.ts` imports next-intl's navigation build, which only the Vitest resolver is proven to load outside Next (R19). (4) An extra `npm run js-size` alias and `scripts/js-size.mjs` exports (`summarizeLhrs`, `formatJsSizeTable`, `SCRIPT_CEILING`, `LAZY_LINE`) are additive; `gate.sh` runs it with `|| true` (informational). (5) The e2e rewrite asserts no package-id h1 text (the skeleton's "h1 text from the package ids"): W1 re-authors metric strings with `{token}` placeholders through the importer, so a literal-text assertion would break at T0b; the specs instead require exactly one `h1[data-testid="page-h1"]` with non-empty copy and no leaked `{token}`/`undefined`, and prove the localized hire link through the desktop nav row rather than a header CTA (W50). (6) `evaluateScan` additionally fails an unnamed `data-placeholder` (`'unnamed data-placeholder (W55)'`) — the skeleton only named the LCP-slot rule. (7) The thank-you page (`(minimal)/thank-you/page.tsx`) is tagged `page-h1` + `data-lcp-slot="h1"` in this task, not in a later page task, so the launch profile's counter passes on every gate route today. (8) `e2e/seo.spec.ts` carries Task 4's two OG-image tests merged (renamed, same assertions — including the unknown-locale `/og/de/home.png` → 404) (W37/W50) and asserts nothing about `/blog` in `robots.txt` (W37). (9) `package.json` `scripts` are edited additively; the block quoted in Cycle 5 is the expected end state including Task 6's `assets:*` lines (W42).
