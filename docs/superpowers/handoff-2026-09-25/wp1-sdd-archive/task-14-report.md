# Task 14 — The quality gate (Playwright a11y + width sweep, Lighthouse CI, `gate.sh`)

Branch `wp1/foundation`, worktree `jobsadmire-website-wp1`. This task's gate run **is** the WP1 gate.

## 1. What I implemented

| File | What |
| --- | --- |
| `e2e/routes.ts` (new) | `GATE_ROUTES` — the five public routes per the brief, verbatim. Comment notes `gate.sh` mirrors the indexable four by hand. |
| `e2e/a11y.spec.ts` (new) | Axe sweep over `GATE_ROUTES`, tags `wcag2a wcag2aa wcag22aa`, verbatim from the brief (comment added on why it runs under both projects). |
| `e2e/width-sweep.spec.ts` (new) | 1440/1280/1101/1100/900/700/560/460/390, verbatim from the brief (comment on the D19 boundary). |
| `lighthouserc.json` (new) | Budgets verbatim. One correction: `settings.preset: "mobile"` → `settings.formFactor: "mobile"` — see §5. |
| `scripts/gate.sh` | R5 applied: the stray `URLS=$(node -e …)` line is gone, the fixed path list stays with the "mirrors `e2e/routes.ts`" comment; documents `REVALIDATE_SECRET` (comment + warning echo when unset, R43); `lhci collect --additive` (see §5); `lhci assert`. |
| `.gitignore` | `lighthouse-report/`, `.lighthouseci/`. |
| `README.md` | One line in Local dev: `npx playwright install chromium` once per machine, and run Node 22 (`nvm use`) because Node ≥ 23 changes `localStorage` under Vitest. |
| `eslint.config.mjs` | D23 `no-restricted-imports` guard (§2). |
| `vitest.config.ts` → `vitest.config.mts` | Vitest 4 / Vite `configLoader: 'native'` warning fixed (§3). |
| `package.json`, `package-lock.json` | `@lhci/cli@^0.15.1` devDependency (the only one added), lockfile committed. |
| `docs/ARCHITECTURE.md`, `CLAUDE.md` | New "Quality gate (D27)" section: what the gate runs, the budgets, and the D20 deltas the gate forced. CLAUDE.md's D20 convention line extended with the same deltas. |
| Component fixes | §6 — every one forced by a gate failure. |

## 2. ESLint proof for D23

Rule added for `src/**`: `no-restricted-imports` with pattern group `**/content/local/*`, message *"Bundles are loaded only through src/content/adapter.ts (D23)"*.

Throwaway `src/lib/__d23-proof.ts` containing `import bundle from '@/content/local/bundle.tr.json';`:

```
/Users/…/jobsadmire-website-wp1/src/lib/__d23-proof.ts
  1:1  error  '@/content/local/bundle.tr.json' import is restricted from being used by a pattern. Bundles are loaded only through src/content/adapter.ts (D23)  no-restricted-imports

✖ 1 problem (1 error, 0 warnings)
```

The file was deleted immediately afterwards (`git status` shows no trace).

**Exemptions — kept to what actually fails.** Running the rule with no overrides at all produced exactly two errors, and neither was one the ruling anticipated:

- `src/content/adapter.ts` does **not** fail: its loader is `await import(\`./local/bundle.${locale}.json\`)` — a template literal, which `no-restricted-imports` cannot see (and the relative specifier would not match `**/content/local/*` either). No override added.
- `src/content/lint.test.ts` and `contract/contract.test.ts` do **not** fail: both use `readFileSync`, and `contract/` is outside `src/**` anyway. No override added.
- `src/design/chrome/__tests__/Footer.test.tsx` and `…/Header.test.tsx` **do** fail — they `import trBundle from '@/content/local/bundle.tr.json'` to render the chrome against the real generated bundle. Those two paths are listed explicitly (not a glob) with a comment saying why, and that the list must not be widened.

## 3. The Vitest warning

**Before** (`npm run test`, first three lines):

```
(!) Your Vite config uses features that are unsupported by `configLoader: 'native'`, which is planned to become the default in a future major version of Vite:
  - ESM syntax in a file loaded as CommonJS (vitest.config.ts:1:1). Use a `.mjs` extension or set `"type": "module"` in the closest package.json
Set `VITE_CONFIG_NATIVE_IGNORE_WARNING=true` to suppress this warning.
```

**Cause:** `vitest.config.ts` is ESM source in a package with no `"type": "module"`, so Vite's bundle loader treats it as CommonJS; under the coming `native` loader that combination fails outright. Adding `"type": "module"` to `package.json` would change module resolution for `next.config.ts`, PostCSS and the scripts, so the fix is the extension: `git mv vitest.config.ts vitest.config.mts` (already covered by `tsconfig.json`'s `**/*.mts` include), and `__dirname` — which does not exist in ESM — replaced with `fileURLToPath(new URL('./src', import.meta.url))`.

**After:** no warning at all; `npm run test` prints only the Vitest banner and `Test Files 25 passed (25) / Tests 112 passed (112)`. The suppression env var was *not* used.

## 4. Two corrections to the brief's gate script (neither weakens anything)

1. **`--settings.preset=mobile` / `"preset": "mobile"` is not a valid Lighthouse value.** The first full gate run died on it:

   ```
   Error: Lighthouse failed with exit code 1
   Invalid values:
     Argument: preset, Given: "mobile", Choices: "perf", "experimental", "desktop"
   ```

   Lighthouse has no "mobile" preset — mobile *is* its default form factor, and `--preset` exists only to switch **away** from it. Fixed by stating the intent in the valid field: `lighthouserc.json` now carries `"settings": { "formFactor": "mobile" }` and the CLI flag is gone. Verified from the emitted LHR: `formFactor: mobile`, `screenEmulation {"mobile":true,"width":412,"height":823,"deviceScaleFactor":1.75}`, `throttlingMethod: simulate` — i.e. exactly the mobile profile the budgets were written for.

2. **`lhci collect` wipes `.lighthouseci` on every invocation.** The brief's loop calls it once per path, so `lhci assert` would only ever have seen the last path — three of the four budgets would silently never have been asserted. `gate.sh` now clears the directory once up front and passes `--additive` inside the loop (`--additive` = "Skips clearing of previous collect data"). The final run's `assert` output lists all four URLs, which is the proof.

## 5. Component fixes the gate forced (all in the same commit)

Every one of these is a fix in the component, per D20 — no assertion, tag list, budget or route was touched.

**From the axe sweep (10 failures: 5 routes × 2 projects), all `color-contrast`:**

| Element | Was | Now |
| --- | --- | --- |
| `Button` variant `primary` (every CTA face, e.g. `/tesekkurler`) | white on `blue` #1899d5 = **3.20:1** (AA large-text only; the labels are 15 px) | white on `blue-safe` #1073a8 = **5.20:1**; hover `ink` |
| Header primary CTA hover | `hover:bg-blue` (would have hovered *into* 3.2:1) | `hover:bg-blue-safe` |
| Footer WhatsApp CTA | `bg-blue`, `hover:bg-blue-safe` | `bg-blue-safe`, `hover:bg-sky hover:text-navy` (the hover state clears AA too) |
| Mobile bottom bar WhatsApp + WhatsApp FAB | white on `success` #16a34a = **3.30:1** | white on `success-text` #12813c = **4.96:1** (one green for the action everywhere) |
| Footer office hours | `text-white/40` on navy = **3.77:1** | `text-white/55` = **5.96:1** (the value the footer already uses elsewhere) |
| Language-hint dismiss button | `text-tertiary` #64748b on tint #e8f4fb = **4.25:1** | `text-secondary` #556377 = **5.46:1** |

`src/design/tokens.test.ts` now asserts the three new pairs (white/blue-safe, white/success-text, secondary/tint) at 4.5, and the white-on-raw-blue pair is relabelled "icons and large text only" — so the gate's finding is locked in a unit test, not just in the components.

**From the width sweep (6 failures: 1100 px, 460 px, 390 px × 2 projects):** the header's desktop row does not fit below the D19 boundary. Measured overflow: **47 px at 1100** (row needs 1147), **55 px at 460 and 125 px at 390** (the right-hand cluster alone is 515 px wide and is `flex-none`). The language switcher is ~300 px of that cluster.

- `Header`: the nav moved from `lg:flex` (≥901) to `xl:flex` (≥1101); the language switcher wrapped in `hidden xl:block`.
- `MobileNav`: `lg:hidden` → `xl:hidden`, so the hamburger — whose panel already carries the language switcher and every nav item — covers the whole 390–1100 band. Nothing became unreachable at any width.
- This mirrors the design package, which hides `.ja-nav-links` and `.ja-lang` and shows `.ja-nav-toggle` at its own mobile breakpoint; we apply it at 1101 because below that the type scale is the authored 1:1 one (D19), which is exactly why the row stops fitting. Note the old `lg` boundary was broken at 901–1100 generally, not just at the sampled 1100.

**From Lighthouse (accessibility 0.98, SEO 0.92 on the first clean run):**

- `heading-order` — the footer's mobile accordion rendered `<h3>` triggers while its desktop equivalents are `<h2>` columns (and `display:none` at that width), so the visible outline jumped h1 → h3. `Accordion` gained a `headingLevel?: 2 | 3 | 4` prop (default 3, WAI-ARIA requires the level to match the surrounding outline) and the footer passes `headingLevel={2}`. A unit test asserts both levels. **Note the axe sweep cannot catch this**: axe-core tags `heading-order` `best-practice`, and the brief's tag list is `wcag2a wcag2aa wcag22aa` — Lighthouse is the only reason it surfaced.
- `canonical` — "Points to another `hreflang` location". The cause is a real production defect, not a localhost artefact: **next-intl's middleware was emitting its own `Link: <…>; rel="alternate"; hreflang="…"` response header built from the request host**, alongside the `<link rel="alternate">` tags we render from `SITE_URL`. Two disagreeing hreflang sets on every response, and a canonical that then points at a URL from the *other* set. Fixed at the source: `alternateLinks: false` in `src/i18n/routing.ts` (hreflang belongs to the metadata layer — docs/SEO.md), with a unit test pinning it. Verified: the `link:` response header is gone; SEO went 0.92 → **1.0**.
- `unsized-images`/CLS — the brand PNG is 336 × 285, but both `<Image>` usages declared a square box (34 × 34, 50 × 50), so the browser reserved the wrong height and reflowed on load. Now 34 × 29 and 50 × 42 (the asset's own ratio). This removed the second layout-shift entry; CLS went from 0.0993–0.1034 (straddling the 0.1 budget) to a deterministic 0.0993 across every run since.

## 6. The full gate run (the WP1 gate)

Procedure exactly as briefed: `npm run verify` → `npm run build` → `REVALIDATE_SECRET=wp1-local-secret-0123456789 npm run start -- -p 3100` (pid file in the scratchpad) → `E2E_BASE_URL=http://localhost:3100 REVALIDATE_SECRET=… npm run gate` → server killed. Playwright and Lighthouse never ran concurrently (`gate.sh` is sequential, and nothing else ran on the machine).

`npm run verify`: green — typecheck, lint, `prettier --check`, **112 unit tests in 25 files**, no warnings of any kind.

### Playwright — 100/100 passed, both projects

50 per project (`mobile` Pixel 7, `desktop` 1440×900): a11y 5, width-sweep 9, ops 8, redirects 10, routing 8, seo 5, smoke 1, thank-you 4. **Zero skips** — `REVALIDATE_SECRET` was exported, so the two token-dependent ops cases ran in both projects (R43).

**Axe violations found and fixed: 1 rule, `color-contrast`, on all five routes under both projects — six distinct elements.** See §5 for each one and its fix. After the fixes the sweep is clean at both viewports; no violation was waived, no tag removed.

**Width-sweep failures found and fixed:** 1100 px (47 px overflow), 460 px (55 px), 390 px (125 px), in both projects. Fixed in the header (§5); all nine widths now pass in both projects.

### Lighthouse — mobile emulation, 2 runs per path

| Path | perf | a11y | best-practices | SEO | LCP | CLS | TBT | FCP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | **0.94** | 1.0 | 1.0 | 1.0 | 2705 / 2706 ms | 0.0993 | 0–1 ms | 904 ms |
| `/en` | 0.96 | 1.0 | 1.0 | 1.0 | 2706 / 2706 ms | 0 | 0 ms | 904 ms |
| `/isci-talebi` | **0.94** | 1.0 | 1.0 | 1.0 | 2705 / 2706 ms | 0.0993 | 0 ms | 904 ms |
| `/en/hire-workers` | 0.96 | 1.0 | 1.0 | 1.0 | 2706 / 2707 ms | 0 | 0 ms | 905 ms |

**Green:** accessibility 1.0, best-practices 1.0, SEO 1.0 on every path (all three were below 1.0 before the §5 fixes), CLS within budget on every path, TBT ≈ 0.

**Red (the gate exits 1):**

- `largest-contentful-paint ≤ 2500 ms` — 2705–2707 ms on all four paths.
- `categories:performance ≥ 0.95` — 0.94 on the two Turkish paths only.

**Both are understood, and neither is a slow page.** Evidence:

1. **LCP is constant to within 2 ms across four different pages** (2705–2707) — TR and EN, spike page and chrome-only page. A page-content problem does not produce a constant.
2. The real browser measurement is **LCP 40–48 ms** (PerformanceObserver, Moto G Power emulation, both locales), and Lighthouse's own observed values in the LHR are `observedFirstContentfulPaint: 49 ms`, `observedLargestContentfulPaint: 49 ms`. The 2.7 s is Lantern's *simulated* value.
3. Re-running the identical page with **real applied throttling** (`--settings.throttlingMethod=devtools`, i.e. actual slow-4G + 4× CPU rather than the simulation): **performance 0.97, accessibility 1, best-practices 1, SEO 1, LCP 1503 ms, CLS 0.099, TBT 0** — every budget met.
4. The cause is the localhost waterfall: every asset (≈ 280 KiB — 170 KiB of JS chunks, 68 KiB of fonts, 15 KiB document, 7.5 KiB CSS) lands within 60 ms, so Lantern's pessimistic LCP graph treats the whole early payload as an LCP dependency and charges 2.25 s of "render delay" to it. `server-response-time` is 10 ms; text compression passes; there is no render-blocking JS.
5. I tried the one obvious lever and **reverted it**: `preload: false` on the Archivo font made FCP *worse* (907 → 1510 ms) and moved LCP not at all. No other legitimate reduction exists at this stage — the payload is the framework plus the shared chrome.

The `0.94` on the Turkish paths is a second, separate and *real* finding: it is entirely the CLS 0.0993, and that shift is the **language hint** (§8, follow-up 1) — `/en` never shows the hint, has CLS 0, and scores 0.96.

**Conclusion:** the gate is green on everything it was built to catch except the performance pair, which this host cannot measure honestly. D27 and `CLAUDE.md` both say the gate runs **against a preview URL**; that run is the one that should decide, and the WP1 gate should be re-run against the Vercel preview before WP1 is signed off. I did not touch a budget.

`lhci upload` is not part of `gate.sh` (the brief does not call it), so `lighthouse-report/` is never written today; `.lighthouseci/` holds the LHR JSON + HTML of the last run. Both are gitignored.

## 7. Files changed

New: `e2e/routes.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts`, `lighthouserc.json`.
Renamed: `vitest.config.ts` → `vitest.config.mts`.
Modified: `scripts/gate.sh`, `package.json`, `package-lock.json`, `.gitignore`, `README.md`, `eslint.config.mjs`, `CLAUDE.md`, `docs/ARCHITECTURE.md`, `src/i18n/routing.ts`, `src/i18n/routing.test.ts`, `src/design/primitives/Accordion.tsx`, `src/design/primitives/__tests__/Accordion.test.tsx`, `src/design/primitives/Button.tsx`, `src/design/tokens.test.ts`, `src/design/chrome/Header.tsx`, `src/design/chrome/MobileNav.tsx`, `src/design/chrome/Footer.tsx`, `src/design/chrome/LanguageHint.tsx`, `src/design/chrome/MobileBottomBar.tsx`, `src/design/chrome/WhatsAppFab.tsx`.

## 8. Self-review

- **Completeness:** every file in the brief exists; the gate ran end to end (three times: the first run found 16 Playwright failures, the second found the invalid `preset` and then the Lighthouse findings, the third is the one reported above); the ESLint rule is proved with its error text; `npm run test` output is pristine; `@lhci/cli` is the only dependency added and the lockfile is committed.
- **Discipline:** no assertion, budget, tag list or route was lowered, narrowed or waived. The two `lighthouserc.json`/`gate.sh` edits (§4) both make the gate *stricter* or simply valid. Every gate finding was fixed in the component.
- **Testing:** each Lighthouse-only finding is now also locked in the unit suite — contrast pairs in `tokens.test.ts`, `alternateLinks` in `routing.test.ts`, heading level in `Accordion.test.tsx` (112 tests, up from 107).
- **Things I deliberately did not do:** redesign the language hint (§9 follow-up 1); add `lhci upload`; touch the LCP budget; widen the D23 ESLint exemption to a glob.

## 9. Concerns / follow-ups

1. **The language hint costs 0.0993 CLS on every Turkish page** (57 px of content pushed down at hydration, measured with a PerformanceObserver: one shift, sources `MAIN` and `FOOTER`). It is inside the 0.1 budget by 0.0007 — one extra pixel of hint text at some width and the gate fails — and it is what holds the TR pages at performance 0.94. Fixing it needs a ruling because both routes are design changes: (a) a pre-paint inline script that sets an attribute on `<html>` so the always-rendered hint is visible in the *first* paint (the standard no-flash pattern; keeps the page statically cacheable), or (b) present the hint out of flow. I did not choose one unilaterally at the end of this task.
2. **The gate's performance pair cannot be judged on localhost** (§6). Re-run `npm run gate` against the Vercel preview URL before WP1 sign-off — that is what D27 prescribes anyway.
3. **`e2e/routes.ts` and the path list in `gate.sh` are two hand-kept copies.** The brief accepts this until WP2 exports the route list as JSON; WP2 should close it, because a route added to one and not the other silently drops out of the Lighthouse half of the gate.
4. **Node 22 is not installed on this machine** — `nvm` has 20.20.2 and 24.14.1, and the system Node is **25.8.2**, which is what every command in this task ran on (`npm install` warns `EBADENGINE`). The suite is green on it, but the README line I added (Node 22, per `.nvmrc`/`engines`) is not what this run used.
5. **The header change is a visible design delta** at 901–1100 px: the desktop nav is replaced by the hamburger there (documented in `CLAUDE.md` and `docs/ARCHITECTURE.md`). The alternative — keeping the nav visible in that band — is not available without an overflow, because below 1101 the type scale is the authored 1:1 one. Worth an owner glance when the real pages land in WP2.
6. **`Button` variant `primary` changed colour** from #1899d5 to #1073a8 site-wide. It is the D20 call the rulebook already makes for the eyebrow, and the raw brand blue survives on icons and decorative surfaces, but it is the most visible single change in this commit.

---

**Commit:** `ba2c8b5` — `test(gate): axe sweep, width sweep, Lighthouse CI budgets, gate.sh` (local only, not pushed; working tree clean).

---

# Fix round 1 (review verdict: approved with two Important items)

## R47 — the 120 KB JS budget

**(a) Assertion added.** `lighthouserc.json:10` — `"resource-summary:script:size": ["error", { "maxNumericValue": 122880 }]`. It is asserted on all four gate paths from this run on.

**(b) Dynamic client islands.** New `src/design/chrome/ClientIslands.tsx` (`'use client'`): `ConsentBanner` and `LanguageHint` both through `next/dynamic(() => import(…).then(m => m.X), { ssr: false })`. `src/app/[locale]/layout.tsx:67` mounts `<ClientIslands locale={locale} consent={analytics.consentMode && Boolean(analytics.gtmId)} />` in place of the two components; `src/design/chrome/SiteChrome.tsx` no longer imports or renders `LanguageHint` (it moved to the islands boundary — it was mounted there, not in the layout). R38's gate is carried verbatim in `consent`, and with it false the consent chunk is never fetched at all. `LanguageHint`'s props are unchanged (`locale`).

**(c) `prefetch={false}` on every chrome `<Link>`:** `NavLink.tsx:36` (covers the desktop nav, the hamburger panel and the footer columns), `LanguageSwitcher.tsx:50`, `SlimBar.tsx:49`, `Header.tsx:46` (logo), `LanguageHint.tsx:80`, `ConsentBanner.tsx:40`. The header's two CTAs are `Button`s, so `Button` gained an optional `prefetch?: boolean` (`Button.tsx:31,49,72`) that it forwards to its `Link` branch — page CTAs keep Next's default; the header passes `false`. **Effect measured on `/`: the eager `_rsc` prefetches fell from 9 to 3**, and the three that remain are the spike home page's own body link to `/isci-talebi` (page content, out of this ruling's scope). Hover prefetch is untouched.

**(d) Icon.** `sips -z 48 48 public/brand/ja-mark.png --out src/app/icon.png` → **2 379 B** on disk (2 706 B transferred), so 48×48 was kept. `src/app/favicon.ico` (26 262 B transferred) deleted. **−23.6 KB** off the page — not off the script budget (Lighthouse counts it under `other`).

**(e) Chunk inspection.** `grep -l -E "zod|ZodError" .next/static/chunks/*.js` → **no match: zod is not in any client chunk**, so there was nothing to cut (no client component imports a value from `contract/website-bundle.v1`; every one of them takes `type Bundle` or plain props). `grep -l "use-intl\|IntlMessageFormat"` → one chunk. What the loaded chunks on `/` are, by transfer size:

| Chunk | transfer | contains |
| --- | --- | --- |
| `38dw_ubfdyy0b.js` | 73 398 B | **react-dom** + react (expected, irreducible) |
| `3b3nw8wjhpb3_.js` | 48 040 B | **Next App Router client runtime** (no app markers; expected, irreducible) |
| `14xmgymk1sega.js` | 17 140 B | **next-intl / `IntlMessageFormat`**, pulled in by `NextIntlClientProvider` |
| `172oxs04ynacj.js` | 11 066 B | our eager chrome islands — `ja_consent_v1` (the `GtmLoader` consent defaults) and `aria-expanded` (Accordion / MobileNav) |
| 7 smaller chunks | 22 865 B | Turbopack runtime, route manifests, `LanguageSwitcher`, `ConversionPing`, and the **1 445 B `LanguageHint` lazy chunk** (`1mcwr4_f358q4.js`, keyed by `ja-lang-hint`) |

The `ConsentBanner` chunk is **not** among them — proof that (b) works: with `gtmId` null it is never fetched.

## R45 — the language hint no longer shifts layout

`src/design/chrome/LanguageHint.tsx:64-79`: the in-flow strip became a fixed sheet — `fixed inset-x-3 bottom-[calc(74px+0.75rem+env(safe-area-inset-bottom))] z-[55] … lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-[min(560px,calc(100%-2rem))]`. It clears the mobile bottom bar (74 px, z-50) and the phone's home indicator below `lg`, sits at `bottom-4` from `lg` up, and z-55 keeps it under the consent sheet (z-60) and over the bar. It is `role="region"` labelled by its own body paragraph (`aria-labelledby` + `useId`, so no new `sys.*` id was invented), and both the switch link and the dismiss button are unchanged.

**Measured: CLS on the Turkish pages went 0.0993 → 0.0000**, and with it `/`'s performance score 0.94 → 0.96. The 57 px post-hydration shift is gone because nothing is inserted into the flow any more.

## R48 + minors

- `scripts/gate.sh`: order is now `rm -rf .lighthouseci` → per-path `lhci collect --additive` → `lhci upload --target=filesystem --outputDir=./lighthouse-report` → `lhci assert`, with a comment saying why upload comes first (the reports are wanted precisely when a budget fails, and `assert` exits non-zero under `set -e`). `lighthouserc.json`'s `upload` block is kept and now has a consumer; `lighthouse-report/` stays git-ignored.
- `scripts/gate.sh:12`: `E2E_BASE_URL="${E2E_BASE_URL%/}"` (exported, so Playwright sees the same normalised value).
- `e2e/width-sweep.spec.ts`: iterates `GATE_ROUTES` × the nine widths, names `no horizontal overflow at ${width}px on ${route}` — 45 cases per project instead of 9.
- `WhatsAppFab.tsx:17`: glow `rgba(22,163,74,…)` → `rgba(18,129,60,…)` to match `success-text`.
- Docs: `docs/ARCHITECTURE.md` gate section now says `formFactor: "mobile"` (with the note that no "mobile" preset exists), carries the script-size budget, the `lhci upload` ordering, and the standing rule that chrome islands load through `next/dynamic` and chrome links use `prefetch={false}`; the D20 delta list gained the primary-button hover (`bg-ink`) and the language-hint sheet. `CLAUDE.md`'s D20 bullet gained the same two clauses.

## The full gate, re-run (same procedure: verify → build → server with `REVALIDATE_SECRET` → gate → kill)

`npm run verify`: green (typecheck, lint, format, **112 tests / 25 files**, no warnings).

### Playwright — 172/172 passed, both projects

86 per project (the width sweep went from 9 to 45 cases each: 5 routes × 9 widths). Zero failures, zero skips. The language hint's move out of flow, the `role="region"`, the dynamic islands and the icon change broke nothing — axe is still clean on all five routes under both viewports, and no route overflows at any of the nine widths.

### Lighthouse — all four paths, both runs identical

| Path | perf | a11y | BP | SEO | **script transfer** | LCP | CLS | TBT | total page |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | **0.96** | 1.0 | 1.0 | 1.0 | 172 509 B (11 reqs) | 2705 ms | **0** | 0 ms | 283 866 B |
| `/en` | **0.96** | 1.0 | 1.0 | 1.0 | 172 509 B | 2705–2706 ms | 0 | 0 ms | 282 612 B |
| `/isci-talebi` | **0.96** | 1.0 | 1.0 | 1.0 | 172 509 B | 2705–2706 ms | **0** | 0 ms | 272 929 B |
| `/en/hire-workers` | **0.96** | 1.0 | 1.0 | 1.0 | 172 509 B | 2705 ms | 0 | 0 ms | 272 329 B |

Against the round-0 run: **`categories:performance` now passes on every path** (the two Turkish pages were 0.94; the hint fix took them to 0.96), **CLS is 0 everywhere** (was 0.0993 on TR), and total page weight fell ~20 KiB (icon −23.6 KB, three fewer prefetches; +2.2 KB of script).

`lighthouse-report/` now holds 17 files (HTML + JSON per run) and is git-ignored — the `upload`-before-`assert` order means they exist even though the run failed.

### Assertions that still fail (2 of 8, on all four paths)

1. **`resource-summary:script:size ≤ 122 880` — found 172 509 B.** Before this round: 170 350 B. **The dynamic split did not reduce the initial script graph; it grew it by 2 159 B.** Honest accounting of why: `ConsentBanner`'s chunk is genuinely never fetched now, but its heaviest dependency (the `@/design/primitives` barrel) stays in the graph anyway because the footer renders `Accordion` from it, so the saving was small — and it was outweighed by one more chunk in the split (11 script requests instead of 10) plus the `next/dynamic` runtime and the always-fetched 1 445 B `LanguageHint` chunk. The budget itself is **not reachable on this stack**: `react-dom` (73 398 B) + the App Router client runtime (48 040 B) = **121 438 B, i.e. 98.8 % of the 122 880 budget before a single line of our code**; next-intl's client runtime adds 17 140 B, and our own chrome islands are 11 066 B. The one remaining app-controlled lever would be dropping `NextIntlClientProvider` from the layout (−17 140 B) — but `src/app/[locale]/error.tsx` (the error boundary, an eager client component) calls `useTranslations`, so the provider cannot move inside `ClientIslands`; and even at 155 369 B the budget would still fail. I did not touch the assertion. It needs a ruling: either the budget is re-cut against what App Router + React 19 + next-intl actually cost (a realistic floor is ~155–175 KB for this chrome), or the stack assumption behind D27's 120 KB changes.
2. **`largest-contentful-paint ≤ 2500` — found 2704–2706 ms** on all four paths, unchanged and unchangeable from here: it is the Lantern artefact the reviewer already verified from the LHR (observed LCP 49–54 ms; the same pages measure LCP 1503 ms and performance 0.97 under real `throttlingMethod=devtools` throttling). Re-run against the Vercel preview per D27.

Everything else asserted — accessibility 1.0, best-practices 1.0, SEO 1.0, `categories:performance` ≥ 0.95, CLS ≤ 0.1, TBT (warn) — passes on all four paths.

### Note for WP2

`StickyCtaBar` is `fixed bottom-0 z-50 hidden lg:block` and is not mounted by `SiteChrome` yet. When it is, it will sit under the language-hint sheet's `lg:bottom-4` position — the two need to agree on an offset then (same conversation as the mobile bottom bar's 74 px).

---

# Fix round 2 (R49, R50, R51)

No app code changed: two config files, four docs, one `gate.sh` branch. No rebuild, no Playwright run (R51).

## R49 — the JS budget corrected to 184 320 B

- `lighthouserc.json`: `"resource-summary:script:size": ["error", { "maxNumericValue": 184320 }]`, plus a root-level `_comment` spelling out the arithmetic (framework floor 121 438 B = react-dom 73 398 + App Router runtime 48 040; + next-intl 17 140; + ≤ 40 KB app code; WP1 shell measured 172 509 B; WP2 watches per-page increments ≤ 25 KB over the shell). `lhci` accepts the extra root key — both asserts below ran against these files unchanged.
- `docs/ARCHITECTURE.md` § Quality gate: the assertion line now reads 184 320 B, and a new paragraph gives the same arithmetic, names the shell measurement, states the WP2 per-page rule, and records why next-intl's runtime cannot be made lazy (`src/app/[locale]/error.tsx` is an eager client component calling `useTranslations`).
- Grep for the old number across the repo (excluding `docs/superpowers/`) found exactly three places, all updated: `lighthouserc.json:10`, `docs/ARCHITECTURE.md:82`, and **`docs/PRD.md:74`** (§6 Performance budget — "Content routes ≤ 120 KB gzipped JS" → "≤ 180 KB", with the correction and its reason). `CLAUDE.md` states the gate rule without a number, so nothing there needed changing.

## R50 — localhost LCP is advisory

- New `lighthouserc.local.json`: byte-identical to `lighthouserc.json` except `"largest-contentful-paint": ["warn", …]`, with a `_comment` recording why (Lantern charges the whole sub-60 ms localhost waterfall to the LCP graph → ~2705 ms on every path; observed LCP 54 ms; 1503 ms / performance 0.97 under `--throttling-method=devtools`; the preview run is the binding one).
- `scripts/gate.sh`: after `upload`, the config is chosen by host — `[[ "$E2E_BASE_URL" =~ ^https?://(localhost|127\.0\.0\.1)(:|/|$) ]]` → `lighthouserc.local.json`, else `lighthouserc.json` — and the script echoes `gate: asserting with <config>`. `collect` and `upload` are untouched. Checked against four URLs: `http://localhost:3100` and `http://127.0.0.1:3100/` select the local config; `https://jobsadmire-web-v2-git-wp1.vercel.app` and the near-miss `https://localhost.jobsadmire.com` select the full one.
- `docs/ARCHITECTURE.md` gains a numbered point 5 stating the rule and that **a local run is never sign-off**; `docs/OPERATING.md` gains a "Work-package sign-off" section saying the binding gate is the preview-URL run, that only LCP is downgraded locally, and that every other budget is an error in both configs.

## R51 — validation against the existing `.lighthouseci` results (no re-collect)

`npx lhci assert --config=lighthouserc.local.json` → **exit 0**, four warnings, nothing failed:

```
Checking assertions against 4 URL(s), 8 total run(s)

1 result(s) for http://localhost:3100/ :
  ⚠️  largest-contentful-paint warning for maxNumericValue assertion
        expected: <=2500
           found: 2704.8308750000006
      all values: 2704.9087499999996, 2704.8308750000006
… the same single warning for /en (2704.89), /isci-talebi (2705.35), /en/hire-workers (2704.58) …
All results processed!
```

`npx lhci assert` (full config) → **exit 1**, and **LCP is the only failure left** — the script budget now passes at 172 509 B against 184 320 B:

```
Checking assertions against 4 URL(s), 8 total run(s)

1 result(s) for http://localhost:3100/ :
  ✘  largest-contentful-paint failure for maxNumericValue assertion
        expected: <=2500
           found: 2704.8308750000006
… one identical failure per URL: /en 2704.89, /isci-talebi 2705.35, /en/hire-workers 2704.58 …
Assertion failed. Exiting with status code 1.
```

"1 result(s) for" each URL in the full run is the proof that nothing but LCP fails: in the round-1 run each URL reported 2.

`npm run verify`: green — typecheck, lint, `prettier --check` (both new/edited JSON files included), 112 tests.
