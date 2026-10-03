# Task 3 report — Chrome foundation (T0c): Cycle 0 follow-ups (W80/W86/W87/W88/W90) + route groups, contact clicks, nav groups, per-page CTAs, 901 px row

**Status: DONE_WITH_CONCERNS.** 8 commits in this run on `wp2/foundation` (BASE `ef15ba2` → HEAD `fe4f8c0`), `npm run verify` green at every commit. Final suite: **48 files / 321 tests** (BASE 42 / 294). W86 was already done (`3fcd449`); the W87 WIP (`bf8ceb7`) was audited complete, so no W87 commit. Nothing pushed; working tree clean.

## Commits

| SHA | Subject |
|---|---|
| `3fcd449` | feat(content): founder collection — one unpublished row from the About page (W86) — _before this run, verified, untouched_ |
| `bf8ceb7` | wip(task3): W87 metric spellings … — _before this run, kept exactly as is (W118); audited below_ |
| `f8fbad0` | fix(i18n): W80 — the WP1 leaf sys.home moves to sys.nav.home |
| `fe803c5` | feat(content): W88 — the portal nav rows point at the internal /portal-login |
| `1dd58ca` | feat(i18n): W90 — the client provider gets sys.* minus sys.legal/sys.seo |
| `9373830` | feat(chrome): route groups (site)/(minimal)/(bare) mount the chrome per W19 |
| `b3d61f1` | feat(analytics): useContactClick + ContactLink for contact clicks; W12 page events + enum guard in track() (W26) |
| `771aeee` | feat(chrome): nav groups from the bundle, blog behind the threshold, footer legal links, contact-click wiring (W4, W11, W12, W35, W36, W88) |
| `2b264d9` | feat(chrome): per-page header CTAs from CTA_BY_PATHNAME and the 901px desktop row (W11, W17) |
| `fe4f8c0` | docs(chrome): route groups, nav groups, CTA table, 901px row, contact-click + W26 events (W4, W11, W12, W17, W19, W26) |

## W87 WIP audit

`bf8ceb7` carried: `scripts/metric-placeholders.json` (+`[12’den fazla] ülke`, `[12+] countries` in `literals.countries`; +`[one business day]`, `[bir iş günü]` in `literals.replySlaHours`; +`partner.077: [{key: countries}]`; +`partner.059: [{key: replySlaHours, en: "[one business day]", tr: "[bir iş günü]", as: {en: "{replySlaHours} working hours", tr: "{replySlaHours} iş saati"}}]`), the importer's `as` rewrite (`PlaceholdersSchema` exported, per-entry `as` with a refine: pinned literal + exactly one `{key}` per locale; `reauthor()` swaps the span for `as`), regenerated bundles + catalogue (partner.059/077: new `rev`, `packageRev` kept, `edits: ["placeholder"]`), importer test pins (41 ids / 44 replacements; a W87 case pinning both ids in both locales + `packageRev`/`rev`; a `PlaceholdersSchema` `as` refusal case), `local-bundle.test.ts` (both ids through `makeTf` in both locales), CONTENT-MODEL (`41 non-legal ids`, `as` sentence, five normalised spellings) and PRD §11 (`41 metric strings … partner.077/059 added by W87`).

Checks run in this session:

- (a) placeholders — present exactly as W87 words them. ✔
- (b) literal finder — the importer's own `findHardTypedMetrics` (`src/content/lint.ts`), armed with only the W87 spellings (`[12+] countries`, `[12’den fazla] ülke`, the ASCII `[12'den fazla] ülke`, bare `[12+]`, `[one business day]`, `[bir iş günü]`), no baseline, over the RAW package strings (the importer's 15 `PAGE_FILES`, decoded the same way): `en ["partner.059","partner.077"]`, `tr ["partner.059","partner.077"]`; over the emitted bundles: `[]` / `[]`. A wider regex sweep (`twelve`/`on iki`, `one|1 working/business day`, any `iş günü`) found only "first working day"/"ilk iş günü" timelines (home.092/117, hire.160/171/287, wp.142/268/272/279, availworkers.086/098) and contact.190 ("Next business morning" / "bir sonraki iş günü sabahı") — none is the W87 spelling and none carries a value, so nothing to re-author or baseline. `design-package/design/blog-posts.js` and `source-map.js` (the importer's other two inputs): no hits. Baseline stays at 32 entries. ✔
- (c) `npm run content:import` re-run at BASE → exit 0, "44 replacements … wrote 3505 strings, 35 nav items, 22 page records, 9 collections per locale"; `git status --short` empty afterwards — the committed bundles/catalogue equal the importer's output. ✔
- (d) `scripts/import-design-package.test.ts` pins both ids (EN/TR text, `packageRev`/`rev`, the finder over the emitted strings) and `src/content/local-bundle.test.ts` reads both through `makeTf` in both locales. ✔
- (e) `docs/CONTENT-MODEL.md` and `docs/PRD.md` say 41; no other doc/test carries a stale 39/42 metric count (grep over `docs/*.md`, `CLAUDE.md`, `src`, `scripts`). ✔

**Verdict: nothing missing — no follow-up commit made for W87.**

## What was implemented

**Cycle 0 (additions, each its own commit).**
- **W80** (`f8fbad0`): `sys.home` leaf → `sys.nav.home` ("Ana sayfa"/"Home") in both `src/messages/{tr,en}.json`; the only reader, the locale 404 (`not-found.tsx`), reads `sys('nav.home')`; `sys.thankYou.home` untouched. `messages.test.ts` asserts `sys.nav.home` exists and `sys.home` is never a leaf (the homepage task may add `sys.home.*` as an object). CONTENT-MODEL § sys.* Chrome list follows.
- **W86**: already in `3fcd449` (verified by the controller; untouched).
- **W87**: `bf8ceb7` audited complete (see above) — no commit.
- **W88** (`fe803c5`): `scripts/import-design-package.ts` — one `PORTAL_ROW = { href: '/portal-login', labelId: 'home.012' }` (internal, `external: false`) used by `hamburger`, `slimBarRight`, `footerEmployers`; `PORTAL_LOGIN` (the host URL) removed. `npm run content:import` regenerated both bundles (catalogue unchanged); the importer nav test pins the internal row in the three groups and no external row in either locale. CONTENT-MODEL nav row says so.
- **W90** (`1dd58ca`): new `src/i18n/client-messages.ts` — `SERVER_ONLY_SYS = ['legal','seo']`, `pickClientMessages(messages)` (every `sys.*` namespace except those two, by name). The locale layout passes `messages={pickClientMessages(await getMessages())}` to `NextIntlClientProvider`. Neither namespace exists yet; `client-messages.test.ts` asserts the exclusion on a fixture that carries both and that the real catalogues pass through minus those names. Kept through Cycle 1's layout rewrite (the "layout item" — see Deviations 3).

**Cycle 1 — route groups (W19, W41, W49)** (`9373830`): seven `git mv`s (`page.tsx`, `hire-workers/`, `[...rest]/`, `dev/`, `not-found.tsx`, `error.tsx` → `(site)/`; `thank-you/` → `(minimal)/`), new `(site)/layout.tsx` (`SiteChrome variant="default"`), `(minimal)/layout.tsx` (`variant="minimal"`), `(minimal)/error.tsx` + `not-found.tsx` (thin re-uses of the `(site)` views), `(bare)/layout.tsx` (`<main id="main">` only). The locale layout lost the `SiteChrome` wrap (keeps html/body, Archivo, GtmLoader, JSON-LD, provider, ClientIslands, generateStaticParams). New `e2e/chrome.spec.ts` (minimal variant; in-chrome 404). All code verbatim from the brief.

**Cycle 2 — contact clicks + W26 allowlist (W12, W26, W32, R35)** (`b3d61f1`): `track.ts` (`PARAM_ENUMS`, `EnumParam`, the five page events, the enum-value drop), `useContactClick.ts` (no directive; `CONTACT_PLACEMENTS`, `ContactPlacement`, `ContactKind`, `contactKindOf`, `useContactClick` → `(kind) => void`), `ContactLink.tsx` (`'use client'`), tests — all verbatim.

**Cycle 3 — nav groups, blog threshold, legal pair, noindex/robots, contact wiring (W4, W11, W12, W35, W36, W37, W88)** (`771aeee`): `nav.ts` (W35 re-exports + `navGroup`), SlimBar/Footer read `slimBarRight`/`footerEmployers`/`footerCompany` through `navGroup` with no hard-coded portal anchor (W36); the portal row is W88's internal row — SlimBar keys its portal pill by route (`/portal-login`) as well as by `external`; Footer legal `<nav aria-label={sys('nav.legal')}>` with `home.218`/`home.219`; every tel:/mailto:/wa.me in SlimBar, Footer, SocialRail, WhatsAppFab, MobileBottomBar through `ContactLink` with its placement; `sys.nav.legal` ("Yasal"/"Legal"); `routes.ts` (`StaticPathname`, `NOINDEX_PATHNAMES` + `/blog`, `/blog/[slug]`, `isNoindexPathname`, `noindexExternalPaths`); `robots.ts` on `noindexExternalPaths`; eslint exemption list + `SlimBar.test.tsx`; `e2e/seo.spec.ts` sitemap case only (W37). Code verbatim except the W88 adaptations listed under Deviations.

**Cycle 4 — header CTAs + 901 px row (W11, W17, W39)** (`2b264d9`): `buttonClassName` extracted in `Button.tsx` and exported from the barrel (line 2 per W39); `ctas.ts` (the full table), `HeaderCtas.tsx` (`'use client'`, `usePathname` from `@/i18n/navigation`); `Header.tsx` (no `primaryCta`/`ChromeCta`; desktop row = `navGroup('desktopNav')` minus the four promoted routes, `lg:flex min-w-0 flex-1 flex-wrap`, `text-nav`; hamburger = `navGroup('hamburger')`); `SiteChrome` line 31, `MobileNav` `lg:hidden`, gallery line; `globals.css` `--fs-nav` 13.5/12/11 + `--text-nav`; `tokens.type.nav`, `tokens.layout.headerRowFrom/socialRailFrom`; `e2e/chrome.spec.ts` +2 cases; width sweep +901. Code verbatim; tests verbatim except the W88 external-row case and one scoped query (Deviations 1, 4).

**Cycle 5 — docs (W45)** (`fe4f8c0`): every "Docs in this task" edit applied on its sentence anchor where it still exists (ARCHITECTURE § Routing/§ Chrome/§ Quality gate, CONTENT-MODEL nav row/sys.nav.legal/canonical ids/§ Blog, ANALYTICS consent banner/event table/enum paragraph/T0c wiring/allowlist rule/§ Conversion path, SEO § Sitemap/§ Robots, PRD §2 rows 12–13/§11 breakpoints/§11 not-yet-built); the missing anchors handled as described under Deviations 6; extras for docs that would otherwise contradict the code (other pre-move paths in ARCHITECTURE, PRD §11 analytics bullet, INTEGRATIONS I15 for W88).

**JS budget check (not in the brief; W13 amended).** Initial `<script src>` graph measured against `next start` for BASE (`git archive ef15ba2` built in the scratchpad) and HEAD: `/`, `/en`, `/isci-talebi`, `/en/hire-workers` — BASE 205,705 B gzip-9 / 178,731 B brotli-11 → HEAD 206,445 / 179,430 (**+740 B gz, +699 B br**); `/tesekkurler?form=hire` 206,294 → 206,836 gz. See Concerns 2.

## TDD evidence per cycle

### Cycle 0 — additions W80 / W88 / W90 (W86 done in `3fcd449`, W87 audited above)

- **W80** RED: `npx vitest run src/messages/messages.test.ts` → `× W80: the way-home label is sys.nav.home; sys.home is never a leaf …` — `AssertionError: expected [ 'sys.skipToContent', …(145) ] to include 'sys.nav.home'` (1 failed / 3 passed). GREEN after the rename: `src/messages` 2 files / 8 tests. `npm run verify` → 42 files / 295 tests, green.
- **W88** RED: `npx vitest run scripts/import-design-package.test.ts` → `× gates /blog behind the threshold (W4), fills five groups and carries the portal row only in the groups (W36)` — hamburger's last href was the portal host, not `/portal-login` (1 failed / 30 passed). GREEN after the importer edit + `npm run content:import` (44 replacements, 35 nav items): 31 / 31. Precondition probe now prints the five groups, `0` external rows (W88 — the brief's `3` is superseded), `22` blog rows. `npm run verify` → 42 files / 295 tests, green.
- **W90** RED: `npx vitest run src/i18n/client-messages.test.ts` → `Error: Failed to resolve import "./client-messages"`. GREEN: `src/i18n` 2 files / 6 tests. `npm run verify` → 43 files / 297 tests, green.

### Cycle 1 — route groups (W19)

- RED: `npm run build` (pre-move tree) + `npm run start` + `npx playwright test e2e/chrome.spec.ts --project=desktop` → `1 failed, 1 passed`: `the default chrome carries the social rail and FAB; the minimal chrome does not` failed at `expect(await page.locator(RAIL_OR_FOOTER_INSTAGRAM).count()).toBe(1)` — `Expected: 1, Received: 2` (exactly the brief's prediction); the 404 case passed.
- GREEN: after the seven `git mv`s, the three group layouts, the two thin `(minimal)` boundaries and the locale-layout edit: `npm run verify` → 43 files / 297 tests. (A first verify run failed on `TS2307` in a stale `.next/types/validator.ts` left by the pre-move RED build — tsconfig includes `.next/types/**`; `next build` regenerated it and verify went green. A clean checkout on Vercel has no `.next`, so this is a local-artifact effect only.) `npm run build` → same route list (`/[locale]`, `/[locale]/[...rest]`, `/[locale]/dev/gallery`, `/[locale]/hire-workers`, `/[locale]/thank-you`, APIs, `ƒ Proxy (Middleware)`). `npx playwright test e2e/smoke.spec.ts e2e/chrome.spec.ts e2e/routing.spec.ts e2e/thank-you.spec.ts e2e/seo.spec.ts` (both projects) → **40 passed** (W49 smoke included).

### Cycle 2 — `useContactClick` + `ContactLink` (W12) and the W26 allowlist

- RED: `npx vitest run src/analytics` → `useContactClick.test.tsx` fails to load — `Error: Failed to resolve import "./useContactClick"` (the brief quotes `"./ContactLink"`; Vite reports whichever missing import it resolves first — same cause, neither module existed); `track.test.ts` — `× declares the W12 page events once …` (`expected [ 'generate_lead', 'conversion', …(5) ] to deeply equal [ Array(12) ]`) and `× drops an enum-keyed value …` (`Error: unknown analytics event: contact_topic`). 2 failed files, 2 failed / 12 passed tests.
- GREEN: `track.test.ts` 5 passed, `useContactClick.test.tsx` 5 passed, `consent.test.ts` 9 unchanged; no jsdom `Not implemented: navigation` output. `npm run verify` → 44 files / 304 tests, green.

### Cycle 3 — nav groups, `/blog` threshold, footer legal pair, `NOINDEX_PATHNAMES` + robots, contact-click wiring (W36, W88)

- RED: `npx vitest run src/design/chrome src/lib/seo/routes.test.ts` → 5 failed files / 9 failed tests, 25 passed: `nav.test.ts` fails to load (`Failed to resolve import "../nav"`); `SlimBar.test.tsx` — case 1 `expected <a …(2)></a> to be null` (`a[href="/blog"]` present — the old hard-coded `RIGHT` list), case 2 `expected [] to deeply equal [ { event: 'call_click', … } … ]`; `ContactPlacements.test.tsx` — all three `expected [] to deeply equal …`; `Footer.test.tsx` — `Unable to find an accessible element with the role "navigation"` (Privacy/Terms), the W12 case `expected [] …`, **and** the W88 portal case (`href` was the portal host from the old hard-coded anchor, not `/portal-girisi`) — so 3 failed / 8 passed instead of the brief's 2 / 9, the third being W88's; `routes.test.ts` — `expected [ '/thank-you', '/portal-login', …(2) ] to include '/blog'` (the brief quotes `noindexExternalPaths is not a function`; the new case's first assertion is on `NOINDEX_PATHNAMES`, so it fails there first — same cause). `Header.test.tsx` 5 still green.
- GREEN: `nav.test.ts` 4, `SlimBar.test.tsx` 2, `ContactPlacements.test.tsx` 3, `Footer.test.tsx` 11, `routes.test.ts` 4, `Header.test.tsx` 5 (still with `primaryCta`). `npm run verify` → 47 files / 316 tests, green.
- e2e: `npm run build` + `npm run start` + `npx playwright test e2e/seo.spec.ts e2e/chrome.spec.ts e2e/a11y.spec.ts` → **24 passed** (both projects; axe zero violations on the five gate routes, the footer's new `<nav aria-label="Yasal">` included). `/robots.txt` now disallows `/api/`, `/tesekkurler`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik`, `/blog` and the five `/en/…` forms; the sitemap carries no `/blog` URL.

### Cycle 4 — `CTA_BY_PATHNAME` through `usePathname()` (W17) and the 901 px row (W11)

- RED: `npx vitest run src/design/chrome/__tests__/ctas.test.ts src/design/chrome/__tests__/Header.test.tsx src/design/tokens.test.ts` → `ctas.test.ts` fails to load (`Failed to resolve import "../ctas"`); all six Header cases `TypeError: Cannot read properties of undefined (reading 'href')` (the old component reads `primaryCta.href`); `tokens.test.ts` — `× the header row swaps at lg …` `expected undefined to be 901`. Exactly the brief's prediction.
- First GREEN attempt: 1 failure — `swaps both CTAs per page …` `Found multiple elements with the role "link" and name "İşçi Talebi"`: on `/iletisim` the secondary CTA is `home.002` → `/isci-talebi`, and the desktop row's first entry carries the same canonical label/href (jsdom applies no CSS, so the `hidden lg:flex` row is in the tree). Brief-test defect; the query is scoped to links outside the desktop nav (see Deviations). Then GREEN: `ctas.test.ts` 3, `Header.test.tsx` 6, `tokens.test.ts` +1 (16), `Button.test.tsx` 3 unchanged. `grep -rn primaryCta src` → nothing. `npm run verify` → 48 files / 321 tests, green.
- e2e: `npm run build` + `npm run start` + `npx playwright test` (full suite, both projects) → **184 passed, 4 skipped, 4 failed** — the 4 failures are `e2e/ops.spec.ts` "revalidate refuses an unauthenticated call / a wrong token" (`Expected: 401, Received: 503`): the local server had no `REVALIDATE_SECRET`, so `/api/revalidate` fails closed with 503 by design (R43; the 4 skipped are the same spec's secret-needing cases). Restarted the server with a throwaway 48-char secret and re-ran `npx playwright test e2e/ops.spec.ts` with the same secret in the runner env → **16 passed**. Net: all 192 Playwright tests green, including `e2e/chrome.spec.ts` 4 cases × 2 projects (901/900 swap, no overflow at 901/1000/1100, CTA follows the page) and the width sweep's new 901 column on all five gate routes.

### Cycle 5 — docs (W45)

- No test (docs only). Before: the brief's anchor grep hit 5 lines (ARCHITECTURE ×3, ANALYTICS, SEO); the two CLAUDE.md anchors and the PRD `per-route bundle nav groups beyond` anchor were already gone (Deviations 6). After the edits + `npx prettier --write`: `npm run verify` → 48 files / 321 tests, green; the same grep prints nothing (exit 1).

### Verify summary lines per commit

| Commit | `npm run verify` |
|---|---|
| `f8fbad0` W80 | 42 files / 295 tests, green |
| `fe803c5` W88 | 42 files / 295 tests, green |
| `1dd58ca` W90 | 43 files / 297 tests, green |
| `9373830` Cycle 1 | 43 files / 297 tests, green |
| `b3d61f1` Cycle 2 | 44 files / 304 tests, green |
| `771aeee` Cycle 3 | 47 files / 316 tests, green |
| `2b264d9` Cycle 4 | 48 files / 321 tests, green |
| `fe4f8c0` Cycle 5 | 48 files / 321 tests, green |

Playwright: Cycle 1 — 40 passed (smoke, chrome, routing, thank-you, seo × 2 projects); Cycle 3 — 24 passed (seo, chrome, a11y × 2); Cycle 4 — full suite 184 passed / 4 skipped / 4 failed (ops 401-vs-503, no secret) + `ops.spec.ts` re-run with a secret 16 passed → all 192 green.

## Files changed

Against the brief's Files list — **every Create (16), Move (7) and Modify entry is in the diff `ef15ba2..HEAD`**: the 16 created files; the 7 moves (`git mv`; `dev/gallery/page.tsx` also carries the line-207 edit, `not-found.tsx` the W80 reader edit made before the move); `src/app/[locale]/layout.tsx`, `src/analytics/track.ts` + test, `SiteChrome`, `Header`, `SlimBar`, `Footer`, `MobileNav`, `MobileBottomBar`, `SocialRail`, `WhatsAppFab`, `Button.tsx`, `primitives/index.ts`, `routes.ts` + test, `robots.ts`, `globals.css`, `tokens.ts` + test, both message files, `Header.test.tsx`, `Footer.test.tsx`, `eslint.config.mjs`, `e2e/width-sweep.spec.ts`, `e2e/seo.spec.ts`, and `docs/{ARCHITECTURE,CONTENT-MODEL,ANALYTICS,SEO,PRD}.md` + `CLAUDE.md`.

Extras (not in the brief's list, all from the binding additions or doc truth):
- W80: `src/messages/messages.test.ts`.
- W88: `scripts/import-design-package.ts`, `scripts/import-design-package.test.ts`, `src/content/local/bundle.{tr,en}.json` (regenerated; `catalogue.json` unchanged by this ruling); `docs/INTEGRATIONS.md` (I15).
- W90: `src/i18n/client-messages.ts`, `src/i18n/client-messages.test.ts`.
Omissions: none. Not touched: `contract/website-bundle.v1.ts`, `sitemap.ts` (as the brief says), `docs/superpowers/**`.

## Deviations

1. **W88 supersedes the brief's external portal row** (additions win). Importer rows are internal `/portal-login`; the brief's precondition probe therefore prints `0` external rows, not `3`. Tests adapted: `nav.test.ts` case 1 (portal row internal; a Play-store row keeps the `external: true` pass-through coverage); `SlimBar.test.tsx` case 1 and `Footer.test.tsx`'s portal case (href `/portal-girisi`, no `target`, still exactly one anchor per list / two DOM copies in the footer, and no anchor to the portal host); `Header.test.tsx` external case (a store-link external row added to both `desktopNav` and `hamburger`, since no group has one any more, plus an assertion that T0b's hamburger portal row is internal). Code adapted: `SlimBar` gives the portal pill by route (`PORTAL = new Set(['/portal-login'])`, `item.external || PORTAL.has(item.href)`) — under the brief's `item.external` test the internal row would have lost its pill; comments in SlimBar/Footer and the ARCHITECTURE/CONTENT-MODEL wording say "internal". Consequence: the chrome links `/portal-girisi`, which 404s inside the chrome until T13 (Concerns 3).
2. **W80**: the `sys.nav` block is `{ main, close, home, legal }`, not the brief's `{ main, close, legal }`.
3. **W90 / the "two layout items"**: the additions' layout work is W90's picker (+ its test). I committed it as its own Cycle 0 commit (per the controller's list) and kept it through Cycle 1: the locale layout is the brief's full file plus `getMessages` + `pickClientMessages` + one comment, not byte-identical to main as the brief's note says. (I read "two layout items" as W90's picker and its test; the only other layout-adjacent addition, W80's `not-found.tsx` reader, was also done before the move.)
4. **Brief-test defect (Cycle 4)**: in `swaps both CTAs per page …`, `within(banner).getByRole('link', { name: t('home.002') })` matched two links on `/iletisim` — the secondary CTA and the desktop row's `/hire-workers` entry share the canonical label (jsdom applies no CSS). The query is scoped to links outside `navigation "Ana menü"` and asserts exactly one, same href. Everything else in that test is verbatim.
5. **RED wording**: Cycle 2's unresolved import is reported as `./useContactClick` (brief: `./ContactLink`); Cycle 3's `routes.test.ts` fails on `toContain('/blog')` (brief: `noindexExternalPaths is not a function`); Cycle 3's Footer RED is 3 failed / 8 passed (brief: 2 / 9) because of W88. Same causes.
6. **Docs anchors that no longer exist** (the short CLAUDE.md from `3aadcdf`): the CLAUDE.md "Architecture at a glance → Routing" bullet → a new Conventions bullet "Every page lives in a route group (W19)"; the D20 bullet's "1101px desktop breakpoint" → "the header's desktop row from 901px with 12px links — W11, R46 closed". PRD § 11 "Not yet built": the "per-route bundle nav groups beyond `desktopNav`" clause was already gone, so the brief's parenthetical is appended to the sentence's current ending (Task 4's two anchors in that sentence are untouched). The brief's "three settings-driven groups" is written "four" (`slimBarLeft` is the fourth, per the brief's own Consumes). ANALYTICS "**WP1 wired exactly one of these seven events**" left verbatim because Task 5 anchors on it.
7. **Docs extras**: ARCHITECTURE entry points (locale layout no longer mounts `SiteChrome`; moved paths; `client-messages.ts`; `ContactLink`), env table, JS-budget paragraph, StickyCtaBar and Sentry paths, repo-layout annotations; PRD § 11 analytics bullet; INTEGRATIONS I15.
8. **Moved files keep their content** (brief's Move rule): the comments in `(site)/[...rest]/page.tsx` ("renders `[locale]/not-found.tsx`") and `(site)/error.tsx` ("The locale segment's error boundary") still name the old location.
9. **Cycle 4 e2e** ran the full Playwright suite (a superset of chrome + width-sweep); `ops.spec.ts`'s two 401 cases need the server started with `REVALIDATE_SECRET` (503 fail-closed otherwise), so they were re-run against a server with a throwaway secret.

## Produces additions

Every frozen name/signature is present unchanged. Additions:
- `src/i18n/client-messages.ts`: `SERVER_ONLY_SYS`, `pickClientMessages(messages: AbstractIntlMessages): { sys: AbstractIntlMessages }` (W90).
- `src/messages/{tr,en}.json`: `sys.nav.home` (W80; replaces the leaf `sys.home`).
- Bundle data: the portal nav rows are `{ href: '/portal-login', external: false }` (W88) — the Produces comment "the portal login is the groups' `external` row (W36)" now reads "the groups' internal `/portal-login` row".
- No other export added (SlimBar's `PORTAL` set is module-private).

## Self-review

Produces block, re-read item by item against the code:
- [x] Route groups: `(site)` default / `(minimal)` minimal + thin `error.tsx`/`not-found.tsx` / `(bare)` `<main id="main">` only; locale layout keeps html/body, Archivo, GtmLoader, JSON-LD, `NextIntlClientProvider`, `ClientIslands`, `generateStaticParams`; gallery at `(site)/dev/gallery/page.tsx` (six-level contract path).
- [x] `track.ts`: `PARAM_ENUMS` (exact tuples), `EnumParam`, `ALLOWED_PARAMS` (7 WP1 + 5 W26, in order), enum-value drop.
- [x] `useContactClick.ts` (no directive): `CONTACT_PLACEMENTS === PARAM_ENUMS.placement`, `ContactPlacement`, `ContactKind`, `contactKindOf`, `useContactClick(placement) => (kind) => void` (W32), `page` from `next/navigation` (R35).
- [x] `ContactLink.tsx` (`'use client'`), props as frozen; same-tab default; plain anchor for non-contact hrefs.
- [x] `nav.ts`: W35 re-exports (identity-tested), `navGroup(bundle, group, t)` sorted, `external` passed through, `/blog` + `/blog/[slug]` dropped below threshold.
- [x] `ctas.ts`: `CtaVariant`, `CtaLink`, `PageCtas`, `DEFAULT_CTAS`, `CTA_BY_PATHNAME` (7 keys, anchors as listed), `ResolvedCta`, `ResolvedPageCtas`, `CtaTable`, `resolveCtas`, `ctasFor`.
- [x] `HeaderCtas({ table })` (`'use client'`, next-intl `usePathname`).
- [x] `Header({ locale, bundle })`; `primaryCta`/`ChromeCta` gone (`grep -rn "ChromeCta\|primaryCta" src e2e` → nothing); `SiteChrome` signature unchanged; SlimBar/Footer through `navGroup`; only the footer legal pair is a route list in the chrome.
- [x] `routes.ts`: `StaticPathname` exported, `NOINDEX_PATHNAMES` (6, `satisfies readonly (keyof typeof pathnames)[]`), `isNoindexPathname`, `noindexExternalPaths` (localized, deduped — robots.txt verified); `sitemap.ts` untouched and excludes `/blog`.
- [x] `buttonClassName(variant, size?, className?)`; barrel line 2 exactly as frozen.
- [x] `tokens.type.nav = { mobile: 13.5, tablet: 12, desktop: 11 }`, `tokens.layout.headerRowFrom = 901`, `socialRailFrom = 1101`; `--fs-nav` 13.5/12/11 + `@theme inline { --text-nav }`.
- [x] `sys.nav.legal` "Yasal"/"Legal" (block also carries W80's `home`).
- [x] `e2e/chrome.spec.ts` four cases; width sweep includes 901; `routes.test.ts` line 2 exactly as frozen.

Cycle 0 items:
- [x] W80 — renamed in both files, reader updated, leaf-absence test (`f8fbad0`).
- [x] W86 — `3fcd449` (pre-existing, untouched).
- [x] W87 — audited: (a)–(e) all present; finder re-run with the importer's own `findHardTypedMetrics`; import re-run leaves the tree clean → no commit.
- [x] W88 — importer + bundles + importer test (`fe803c5`); nav/chrome tests adapted in `771aeee`/`2b264d9`.
- [x] W90 — picker + test + layout wiring (`1dd58ca`), kept through Cycle 1.

Hygiene: `CLAUDE.md` never gained an `nextjs-agent-rules` block (checked after every build); no push, stash, checkout of `main`, amend or rewrite; BASE commits untouched (W118); the BASE measurement used `git archive` into the scratchpad (deleted afterwards), not a checkout.

## Concerns

1. **Task 5 vs W80**: Task 5's brief rewrites the whole `sys.nav` block as `{ main, close, legal, breadcrumbs }`, which would drop `sys.nav.home`; the W80 case in `messages.test.ts` will fail if it does. Task 5 must keep `home` (T12/T13 breadcrumbs read it).
2. **JS budget (W13 amended, 204,800 B)**: the local gzip-9 sum of the initial script graph is 206,445 B on every content gate route at HEAD — but it was already 205,705 B at BASE; with brotli-11 (closer to the Vercel preview the binding gate measures) HEAD is 179,430 B. Task 3 adds ~0.7 KB. The chrome's client chunk carries Dialog/Tabs/PausableMarquee code at BASE and HEAD alike (some eager client module imports the `@/design/primitives` barrel — e.g. `(site)/error.tsx` imports `{ Button, Section }` from it; pointing `HeaderCtas` at `@/design/primitives/Button` changed nothing, so it was reverted to the brief's barrel import). A candidate saving for Task 7's gate work; the Lighthouse figure on the preview is the one to trust.
3. **Chrome now links pages that 404 until T13**: `/portal-girisi` (W88, from the slim bar, hamburger and footer) and `/gizlilik`, `/kullanim-kosullari` (the W11 legal pair) render the in-chrome 404 on this branch's previews until T13 ships those pages.
4. `e2e/ops.spec.ts`'s two 401 cases fail (503) against any local server started without `REVALIDATE_SECRET` — pre-existing, by design (fail closed); not a Task 3 regression.
5. Pre-existing doc drift outside this task: ARCHITECTURE § Repository layout still says "There is no `src/forms/` directory yet" (stale since Task 2); `/blog/*` is also a legacy `410` prefix in `redirects/gone.json` (§ Routing) — relevant when the blog pages land (WP2b), not here.
6. Local-only: after moving routes, a stale `.next/types/validator.ts` from an earlier build makes `tsc` (verify) fail with TS2307 until the next `next build`; a clean checkout (Vercel) is unaffected.

## Fix round 1

Controller brief: `task-3-fix-round-1.md`. Base `f798495`. Four commits, one per numbered
item except items 3+4+6 (docs/comments-only) grouped per the harness's own suggested grouping.

### 1. Important 1 — W119 (`hidden` loses to a base display utility)

**What changed.**
- `src/design/chrome/HeaderCtas.tsx:10-14` — `SECONDARY` class string: `hidden whitespace-nowrap xl:inline-flex` → `max-xl:hidden whitespace-nowrap` (comment corrected to state the actual mechanism instead of the disproven "proven by the gate at 1100" claim).
- `src/design/chrome/SlimBar.tsx:38,46` — the phone/e-mail `ContactLink`s: `` `hidden lg:inline-flex ${LINK}` `` → `` `max-lg:hidden ${LINK}` `` (`LINK` already opens with `inline-flex`).
- New `src/design/chrome/__tests__/visibility.test.tsx` — a `hasUnguardedHidden(className)` token-based checker (exact-token match, not a naive regex, so `max-xl:hidden`/`xl:inline-flex` never trip it — see Deviations) plus a render sweep of `SiteChrome` (`variant="default"` and `"minimal"`, real TR bundle via `renderWithIntl`) asserting no element's `class` attribute pairs a bare `hidden` with a bare `inline-flex|flex|inline-block|block|grid|inline-grid|inline|table|contents`.
- `eslint.config.mjs:38-43` — added `visibility.test.tsx` to the exact `no-restricted-imports` exemption list (D23) alongside Footer/Header/SlimBar's tests, since it renders against the real generated bundle the same way.
- `e2e/chrome.spec.ts:73-93` — new case: secondary CTA `not.toBeVisible()` at 1100px / `toBeVisible()` at 1101px (scoped to `getByRole('banner')`, picked by accessible name "İş Ortağı Olun"); slim-bar phone link `not.toBeVisible()` at 900px / `toBeVisible()` at 901px (scoped to `div.bg-navy` — the slim bar's own root; the footer's equivalent background sits on a `<footer>`, not a `div`, and picked by the phone's accessible name "+90 501 124 03 40" — never a label id).
- `docs/ARCHITECTURE.md:281` — new sentence after the paragraph introducing `buttonClassName`, exactly as the brief specified. `docs/ARCHITECTURE.md:260,283` — the two "xl-only" mentions the review cited now name `max-xl:hidden`.

**Covering test, RED → GREEN.**
RED (`npx vitest run src/design/chrome/__tests__/visibility.test.tsx`, written before touching HeaderCtas.tsx/SlimBar.tsx): 2 failed / 2 passed — the render sweep found exactly the three offending strings:
```
"hidden lg:inline-flex inline-flex min-h-[26px] items-center gap-2 …"   (SlimBar phone)
"hidden lg:inline-flex inline-flex min-h-[26px] items-center gap-2 …"   (SlimBar e-mail)
"… min-h-[44px] px-5 text-body-sm hidden whitespace-nowrap xl:inline-flex"  (header secondary CTA)
```
The two checker unit cases (reject `hidden … inline-flex`, accept `max-xl:hidden … inline-flex`) already passed — they exercise the pure function directly, not the buggy component.
GREEN (same command after the two class-string edits): 4/4 passed.

**Verify summary (this commit, `d94a404`):** `npm run verify` green — typecheck, lint, format, **49 files / 325 tests**.

### 2. Minor 1 — W121 (no dynamic key in `CTA_BY_PATHNAME`)

**What changed.**
- `src/design/chrome/__tests__/ctas.test.ts:79-83` — new case: no key of `CTA_BY_PATHNAME` contains `[`.
- `src/design/chrome/ctas.ts:4-11` — corrected the file's doc comment: it invited "the page task owning a key" to add an entry without qualifying that dynamic keys must not; now says so explicitly and cites W121.

**Covering test.** This is a pinning/regression guard, not a fix to existing data: `CTA_BY_PATHNAME` has no dynamic key today, so the new case passes immediately (`npx vitest run src/design/chrome/__tests__/ctas.test.ts` → 4/4 passed, no RED phase — nothing in the table was ever wrong, only the comment inviting a future violation). Only the comment was a real fix.

**Verify summary (`c91efa8`):** `npm run verify` green — **49 files / 326 tests**.

### 3. Minor 2 — stale Sentry boundary list

`docs/ARCHITECTURE.md:306` — "the two Next.js error boundaries (`[locale]/error.tsx`, `app/global-error.tsx`)" → "the Next.js error boundaries (`[locale]/(site)/error.tsx`, `[locale]/(minimal)/error.tsx`, `app/global-error.tsx`)". Doc-only, no test.

### 4. Minor 3 — stale comments in moved files

- `src/app/[locale]/(site)/[...rest]/page.tsx:6` — "renders `[locale]/not-found.tsx`" → "renders `(site)/not-found.tsx`".
- `src/app/[locale]/(site)/error.tsx:5` — "The locale segment's error boundary" → "The (site) group's error boundary".

Comment-only, no test (as the brief specifies).

### 5. Minor 4 — `ContactLink` middle-click

**What changed.**
- `src/analytics/ContactLink.tsx:5,14-16,20-24,26` — added `onAuxClick`, firing `fire(kind)` when `e.button === 1`; `onClick` unchanged; `Props`'s `Omit<...>` set gained `'onAuxClick'` alongside the existing `'href' | 'onClick'` (same precedent as `onClick`'s own omission — see Deviations/Concerns on the frozen Produces contract).
- `src/analytics/useContactClick.test.tsx:1,88-110` — two new cases, using `fireEvent(link, new MouseEvent('auxclick', { button }))` (jsdom's activation-behavior/navigation hook is gated on `event.type === 'click'` only, so a synthetic `auxclick` needs no `preventDefault` workaround, unlike the file's existing `click()` helper).

**Covering test, RED → GREEN.**
RED (`npx vitest run src/analytics/useContactClick.test.tsx`, written before touching ContactLink.tsx): 1 failed / 6 passed —
```
fires whatsapp_click exactly once on a middle-click (auxclick, button 1) …
AssertionError: expected [] to deeply equal [ { event: 'whatsapp_click', … } ]
```
(the button-2 case already passed trivially since it asserts nothing fires). GREEN (same command after adding `onAuxClick`): 7/7 passed.

**Verify summary (`48f7344`):** `npm run verify` green — **49 files / 328 tests**.

### 6. Approved doc-drift corrections

- `docs/ARCHITECTURE.md:38` — added the missing `forms/` row to the repository-layout tree (between `design/` and `i18n/`).
- `docs/ARCHITECTURE.md:48` — replaced "There is no `src/forms/` directory yet …" with a description of the WP2a Task 2 forms kernel and a cross-reference to § Forms flow (D11).
- `docs/ARCHITECTURE.md:151` — `redirects/gone.json` corrected from "20 entries today" including `/blog/*` to "19 entries today" with `/blog` never in the set (`rules.json` keeps it, R53). Redirect data itself untouched.

Doc-only, no test. Grouped into one commit (`6a22c01`) with items 3 and 4 per the harness's own suggested grouping for docs/comments-only edits.

**Verify summary (`6a22c01`):** `npm run verify` green — **49 files / 328 tests** (unchanged from commit 5 — doc/comment-only).

### Playwright run (once, after the class changes)

`npm run build` (Next 16.3.5, Turbopack, compiled successfully) → `npm run start` in the background on :3000 → `npx playwright test e2e/chrome.spec.ts` → server stopped. **10/10 passed** (5 cases × 2 projects, mobile + desktop), including the two new W119 visibility assertions on both projects. `git diff CLAUDE.md` empty after the build (no `nextjs-agent-rules` block appended).

### Ledger figures

W120: the binding JS figure is Lighthouse `resource-summary:script:size` on the Vercel preview; the local gzip-9/brotli-11 proxy over the `<script src>` set (excluding the `noModule` legacy polyfill) is **167,072 B gz-9 / 144,272 B br-11** on `/`, `/en`, `/isci-talebi`, `/en/hire-workers` at HEAD before this round (`f798495`). This fix round touched no page bundle, script, or dependency — only chrome class strings, a doc comment, two file comments, and test/doc files — so this figure is unchanged by fix round 1.

### Deviations

1. **Item 1 doc correction, "no longer say the secondary is hidden by `xl:inline-flex`".** Neither `docs/ARCHITECTURE.md`'s line ~259 nor ~282 literally contained the string `xl:inline-flex` — both said the secondary CTA is "`xl`-only exactly as designed"/"stay `xl`-only" (accurate in spirit, wrong in mechanism). Treated as shorthand for "correct these two mentions to match the fixed code"; both now name `max-xl:hidden` explicitly instead of just asserting "xl-only".
2. **"The test bundle" in the visibility.test.tsx instruction.** No fixture in this repo is literally named "the test bundle" — two conventions coexist: the real generated TR content bundle (`BundleSchema.parse` over `@/content/local/bundle.tr.json`, used by Header.test.tsx/Footer.test.tsx/SlimBar.test.tsx) and the minimal "golden fixture" (`contract/website-bundle.v1.fixture.json`, used by nav.test.ts/ContactPlacements.test.tsx). Used the real TR bundle, matching the three sibling suites that already render these exact components — the more thorough choice for a whole-chrome class-attribute sweep. This required adding the new test file to `eslint.config.mjs`'s exact `no-restricted-imports` exemption list (not named in the brief but mechanically required to keep `npm run verify` green, following the same pattern already used for the three sibling tests).
3. **"Make the regex reject/accept …".** Implemented `hasUnguardedHidden` via whitespace-tokenizing + exact `Set` membership rather than a literal regex — semantically identical (a `:`-prefixed token, e.g. `max-xl:hidden`, is never equal to the bare token `hidden`) but avoids substring false positives/negatives a regex would need extra care to avoid.
4. **Item 2, "fix the comment near the `CTA_BY_PATHNAME` declaration".** `ctas.ts` has exactly one relevant comment — the file's top doc block (above `CtaVariant`, lines 4-11), which is also the block containing the "or edit its entry here" invitation the review flagged. Edited that block; did not add a second, separate comment directly above `export const CTA_BY_PATHNAME =` (which has none of its own).
5. **Item 6, `src/forms/` row in the repository-layout tree.** The tree's per-line comment-column is a hand-built approximate staircase, not a strict arithmetic sequence (measured: 27, 28, 29, 30, 31, 32, 34, 35, 36 — already has one plateau precedent between `scripts/` and `analytics/`, both at column 27). Inserted `forms/` at column 31 (one past `design/`'s 30), landing on the same column as `i18n/` directly below — a plateau consistent with that existing precedent — rather than renumbering every subsequent line to force strict monotonic increase, since the brief only asked to "add one in the tree's style."

### Concerns

1. **W121's new test is a pinning guard, not a bug fix.** `CTA_BY_PATHNAME` has no dynamic key today, so `ctas.test.ts`'s new case passes immediately with no RED phase against real data — consistent with the review's own framing ("cost if wrong: a TR-only hydration mismatch on the first detail page", i.e. a future risk, not a current one). Only the doc comment was actually wrong today.
2. **`ContactLink`'s `Props` type gained `'onAuxClick'` in its `Omit<...>` set** (item 5) — a small, backward-compatible refinement to the frozen Produces contract's `ContactLink` signature (no current caller passes `onAuxClick`; `onClick`'s behavior and the rest of the signature are untouched). Done because the brief explicitly directed exactly this addition; flagging since "Produces frozen" is otherwise a hard rule.
3. **Spotted but left untouched (out of this brief's named scope):** `docs/ARCHITECTURE.md`'s "Forms → Operations intake — designed, not yet built" line (§ near line 133) is now also stale since the WP2a Task 2 forms kernel shipped, mirroring the ~line 47 drift this round did fix. Not named in the brief's item 6, so left for the controller.
4. **Original report's own Concern 5** ("There is no `src/forms/` directory yet" stale; `/blog/*` in `gone.json`) is now resolved by this round's item 6 — noting the cross-reference for whoever next reads that section.

