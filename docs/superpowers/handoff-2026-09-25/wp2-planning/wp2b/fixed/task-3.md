### Task 3: Cost Calculator — `/maliyet-hesaplayici` · `/en/hiring-cost-calculator` (pixel-harness page, D27)

**Why this task exists.** Page 3 of the design package (`design-package/design/Hiring Cost Calculator.dc.html`, strings `design-package/strings/calculator.json`, ids `calc.001`–`calc.561`) is a live payroll + one-off cost calculator with a salary guide, a 5:1 quota gate, a five-question pass check, incentive/penalty/student explainers, a FAQ and a closing band. The design has no `<form>`: every conversion is a WhatsApp/tel/mailto link, the rates are literals in its script and 23 sentence templates exist only in its `GEN` dictionary. This task ports it onto the built WP2a foundation: one engine (`src/lib/calculator/`, W2/W24), every figure from `rateConfig` + `calculatorRoles` (D17), every lira through `formatTRY` (D18), every computed sentence a `sys.calc.*` ICU template authored against `src/lib/calculator/copy-deltas.ts` (W142/W143), the four "written quote" CTAs turned into ONE real `calculator` door form (W3), and the heavy code split so the route stays under the 194,560 B lazy line (W13 amended).

**Where and in what order.** Every path is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` (HEAD ≥ `7bacd7e`). Never push, never `git stash`, never amend/squash/rebase an existing commit, no `wip` commits (W118). Execution order (W99): T1 → T13 → T2 → **T3** → T4 … — when this task starts, T1 has created the shared doc shapes (W98: the `## Pages` table in `docs/SEO.md`, `### Page instrumentation (WP2b)` in `docs/ANALYTICS.md`, the per-page `sys.*` bullet list at the end of `### Adding copy (W9, W23, W54)` in `docs/CONTENT-MODEL.md`, the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`) and `e2e/pages/`; T13 shipped `/privacy` (the consent link target); T2 shipped Hire Workers (`/isci-talebi`, the sticky bar's "Request workers" target). WP2a is fully built; where this text and the code disagree, **the code wins** — every import below was checked against `src/**` at `7bacd7e`/`69d652b`.

**Memory rule (owner, binding for every step).** One heavy job at a time. The per-commit verify is exactly
`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`
(never `npm run verify`, `npm test` or `npm run e2e`; `npm run format` is `prettier --check .`, so run `npx prettier --write <the files you touched>` first — the listings below are compacted for reading and prettier reflows them). The task ends with ONE proof session (W126, Cycle 7): one `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`, one `npm run start`, one `E2E_BASE_URL=http://localhost:3000 npm run gate`, `npm run js-size`, the pixel harness, then the server is killed and no stray process is left. Playwright runs only inside that session (and inside Cycle 8's conditional re-proof). Commits are conventional, cite their rulings and end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**Route facts (verified — read before touching anything).**
- Internal key `/hiring-cost-calculator` → TR `/maliyet-hesaplayici`, EN `/en/hiring-cost-calculator` (`src/i18n/routing.ts` `pathnames`). `UNBUILT_PATHNAMES` (`src/lib/seo/routes.ts`) still lists `'/hiring-cost-calculator'` — this task deletes that line (W20); `e2e/routes.ts` `GATE_ROUTE_TABLE` has no row for it — this task appends two (W21).
- Page record (both bundles): `bundle.pages.calc = { titleId: '', descriptionId: '', ogImage: null, canonical: null, robots: 'index', jsonLd: ['breadcrumb', 'faq'] }` → `buildMetadata` falls back to `sys.seo.calc.{title,description}` (W23/W38); the OG route (`src/app/og/[locale]/[pageKey]/route.tsx`) already prefers `sys.seo.calc.title` when it exists (its test stubs exactly that key). OG image `/og/{locale}/calc.png`, CDN-cached (W123).
- `CTA_BY_PATHNAME['/hiring-cost-calculator']` (`src/design/chrome/ctas.ts`) = primary `calc.324` → `{ pathname: '/hiring-cost-calculator', hash: '#calculator' }`, secondary Hire Workers. **This page must render `id="calculator"` in the server HTML** (W152/W158 — `gate:launch`'s anchor sweep fetches the page and looks for it in both locales).
- Collections (both bundles, equal to `src/lib/calculator/__tests__/fixtures.ts` — asserted by `copy-deltas.test.ts`): `rateConfig` = one row `{ version '2026-01', effectiveFrom '2026-01-01', reviewDueAt '2026-12-20', updatedAt '2026-01-15', legalMinGross 33030, sgkRates { manufacturing 0.1875, other 0.2175, none 0.2375 }, supportMonthly 1270, permitFeeTRY 16000, flightTRY 12000, housingMonthlyTRY 5000, quotaRatio 5 }`; `calculatorRoles` = 15 rows — 12 design roles (`welder` `calc.555`, `cnc` `hire.093`, `machine` `calc.544`, `textile` `calc.541`, `electrician` `calc.545`, `plumber` `calc.546`, `labourer` `calc.542`, `cook` `calc.548`, `waiter` `hire.107`, `housekeeping` `calc.547`, `steward` `calc.543`, `greenhouse` `hire.112`; industries `calc.551`–`554`) + 3 `preset: true` rows (the homepage teaser's, never offered here); `countries` = 64 rows `{ code (ISO-2), name (localized), dial }`. Settings (LOCAL): `phone '+905011240340'`, `phoneDisplay '+90 501 124 03 40'`, `email 'info@jobsadmire.com'`, `whatsappNumber '905011240340'`, `turnstileSiteKey null` (overlaid from `NEXT_PUBLIC_TURNSTILE_SITE_KEY` only where set).
- Metric placeholders: `calc.050`, `calc.101`, `calc.104`, `calc.381`, `calc.481` carry `{homepageReplyHours}` → every package id on this page goes through `makeTf` (W1), never `makeT`.
- **The package strings are trimmed.** The design's dictionary carried the spaces between fragments (`p1B2: " per worker."`, `cQuotaQ1: "Can you hire "`); the bundle does not (`calc.113` = `per worker.` / `'ye çıkar.`, `calc.131` TR = `ıdır — …`, `calc.245` TR = `dır. …`, `calc.343` TR = `mediği`). Every glued sentence goes through `_lib/fragments.ts` `sp()` (tested against the real bundle): a space between two runs, except before closing punctuation, an apostrophe suffix, or a Turkish copula/participle suffix fragment.
- **The worked samples are the legal wording.** `calc.557`–`calc.561` (557–559 legal-flagged) are the design's rendered samples of `GEN.threshold`, `GEN.qvExact`, `GEN.ckQuoOk`, `GEN.yearNote`, `GEN.vCount`. The matching `sys.calc.*` templates reproduce them word for word at the fixture inputs (a test formats each template and compares with the bundle string), and every figure they print comes from the model (the `COPY_DELTAS` pins `calc.557`–`560`).
- `COPY_DELTAS` (`src/lib/calculator/copy-deltas.ts`, 18 rows: 7 deltas / 11 pins) is authoring data: page CODE never imports it (`purity.test.ts` scans every non-test module under `src/`); page TESTS import it to pin the page's figures to its `model` column — the 1.5× roles' slider minimum ₺49,545 (design 50,000), the 1× minimum-wage roles 33,030 (design 33,500), the initial monthly total 60,321.04 and first-year total 751,852.45 (design 60,875 / 758,500), the salary-guide employer-cost low 60,321.04 at the `other` tier (design 60,875 at a fixed 1.2175).
- Engine facts that bind this page (W144): `estimate()` throws `CalculatorError` on an unknown `sgkTier` — `_lib/estimate-inputs.ts` `sanitizeInputs` validates every tier before it reaches the engine; the pass check's salary row compares against `salaryFloor(role)` (49,545 for every 1.5× role, cook included), never `estimate().input.grossSalary`; `salaryRange(role).min` = `max(floor, band min)` is the slider minimum (cook 50,000).

**JS budget — the projected js-size and the split (W13 amended, W120/W136, the WP2a final review §2).** Baseline at the WP2a close (`6ef6989`, local `npm run js-size`): 176,132 B on TR routes, 172,783 B on EN routes. Without a split this page projects ≈ 200–205 KB (engine + RangeSlider/Stepper/RadioChips/TriState/ProgressBar/BottomSheet + estimate store + the quote `FormShell` in the first-load graph — the final review's figure), over the 194,560 B lazy line and at the 204,800 B ceiling. The split this task builds:
- **Eager (counted, ≈ 7 KB gz):** `LazyIsland` + `useInView` (≈ 1.2), `CalculatorLoader` (≈ 0.6), `LazyBinders` (four `LazyIsland` binders + the lazy sticky bar, ≈ 0.5), `SectionToggle` (≈ 0.4), `Tabs` (≈ 1.0, the exemptions), `LiveSgkRate` + `estimate-store` + `estimate-inputs` + `@/lib/calculator/types` (≈ 1.0), `QuoteButton` + `QuoteSheetHost` + `quote-store` (≈ 0.8), `PrintButton` (≈ 0.3), chunk overhead (≈ 1). **Projected: ≈ 183 KB TR / ≈ 180 KB EN locally (≈ +3 KB on the preview), ≈ 11 KB under the lazy line.**
- **Lazy (never inside the audit's first viewport):** the calculator island (≈ 13–16 KB: engine 4–5, the five controls + `BottomSheet`/`Dialog` 5–6, island + view model 3–4) loads on the first hover/touch/focus of the card or at `#calculator`; the quote sheet (≈ 10 KB: the forms kernel 7–8 + `BottomSheet`) loads on the first quote-button hover/focus/click; the salary guide (≈ 2), quota gate (≈ 3), pass check (≈ 3–4), closing-band recap (≈ 1, shares the engine chunk) and the sticky bar (≈ 1.5) load 200 px before they scroll into view.
- A route above 194,560 B in Cycle 7 → Cycle 8(b) (drop `Tabs` for a static exemption list, then stop for a controller ruling).

**Design deltas this page carries on purpose (named for the D27 pixel review, (a) D20/foundation faces, (b) rulings):**
1. W3/W79: the design's four "written quote" links (`calc.011` phone snapshot → Contact page, `calc.036` card, `calc.052` sticky bar, `calc.105` closing band — all WhatsApp/Contact links) become ONE `calculator` door form in a bottom sheet opened by `calc.011`, `calc.036` and `calc.105` (consent checkbox, success → `/tesekkurler?form=calculator`, failure → the D11 panel); the sticky bar's `calc.052` and the FAQ card keep a static, generic WhatsApp prefill.
2. W95: the pass check's "Send my result" composes its prefill (the answers) at click time; its DOM href is the bare `https://wa.me/<number>`. The quote form's fallback panel carries the estimate in its click-time prefill (`whatsappIntro`, W76).
3. W13 amended: the calculator card first renders a server skeleton at the defaults (static lookalike controls, the model's totals, an `sr-only` "Adjust the estimate" button) and becomes interactive on the first hover/touch/focus, at `#calculator`, or when the salary guide's "Use in calculator" asks for it; the salary guide, the quota gate, the pass check and the phone recap render DOM-matched fallbacks until 200 px before view.
4. W2/W142/W59: every figure is the model's — slider minimum 49,545 for the 1.5× roles (design 50,000) and 33,030 for labourer/housekeeping/steward/greenhouse (design 33,500); initial monthly 60,321 and first-year 751,852 (design 60,875 / 758,500); the salary guide's lows and employer costs from the exact floor at the chosen SGK tier (design 50,000 / ₺60,875 at a fixed 1.2175).
5. The salary slider steps through a stop list — the exact floor, then every ₺500, then the band maximum — so both ends are reachable (a native `step=500` from 49,545 could never reach 70,000); the mobile role sheet shows the lifted range (floor – max) instead of the raw band (welder ₺49,545 – ₺70,000, design ₺45,000 – ₺70,000).
6. D17: the hero badge is `sys.calc.hero.badge` from `rateConfig` (EN identical to `calc.003`; TR "2026 oranları · Ocak 2026 güncellemesi" — the design's `'da güncellendi` suffix changes with the year), hidden from `reviewDueAt`; `calc.415`–`417` render from `rateConfig.sgkRates`; the design's `₺12.700` literal is `10 × supportMonthly`; `₺205.008` is `calc.408`; the long-term spread uses the default one-off (permit + flight), not the live flight toggle.
7. W10: the ≤ 700 px per-section accordion is kept (each body toggles through `data-open`); each section's own `h2` + subtitle stay in the accessibility tree (`max-md:sr-only`); the FAQ's own `h2` shows under its trigger on phones (`FaqBlock` owns it).
8. D20 (a): blue text and values are `blue-safe`, `#94a3b8` greys are `text-text-tertiary` (on white/`pale-2`) or `text-text-secondary` (on `pale-1`), the total card's gradient starts at `blue-safe` with white copy, the closing band's primary and the pass check's send button are `primary`/`success` faces (the design's greens are 3.3:1 / 2:1); foundation faces: `Stepper` (44 px buttons, 80 px input), `RadioChips`/`TriState` chips, `ProgressBar`'s label row, `BottomSheet` role picker (a real dialog), the navy `StickyCtaBar` (design white, hidden below 901 px), pill-shaped buttons.
9. The compare table is a real `<table>` (row label in the middle column, "VS" in the header) instead of the design's div grid; the jump chips and trigger chevrons are text glyphs, the design's decorative card icons are omitted.
10. The phone recap (closing band) and the quote sheet's header show the estimate the form sends (`RecapCard`), in the quote sheet at every width.

**Files:**

Create — route folder `src/app/[locale]/(site)/hiring-cost-calculator/`:
- `page.tsx` (server; `revalidate = 86400`), `actions.ts` (`'use server'`)
- `_lib/` (pure TypeScript, no directive, no React state): `fragments.ts`, `ids.ts`, `estimate-inputs.ts`, `copy.ts`, `events.ts`, `card-view.ts`, `quota-view.ts`, `pass-check.ts`, `salary-guide.ts`, `quote.ts` (the only zod importer; server use)
- `_lib/__tests__/`: `fragments.test.ts`, `estimate-inputs.test.ts`, `copy.test.ts`, `views.test.ts`, `quote.test.ts`
- `_components/` — directive-less presentational (server fallbacks and islands share them): `Sentence.tsx`, `Lookalikes.tsx`, `card-ui.tsx`, `EstimateBreakdown.tsx`, `CalculatorSkeleton.tsx`, `QuotaView.tsx`, `PassCheckView.tsx`, `SalaryGuideView.tsx`, `RecapCard.tsx`; client-only state modules (no directive, imported by `'use client'` modules only): `estimate-store.ts`, `quote-store.ts`; `'use client'`: `CalculatorIsland.tsx`, `CalculatorLoader.tsx`, `QuotaIsland.tsx`, `PassCheckIsland.tsx`, `SalaryGuideIsland.tsx`, `RecapIsland.tsx`, `LazyBinders.tsx`, `WhatsAppComposeLink.tsx`, `SectionToggle.tsx`, `LiveSgkRate.tsx`, `QuoteButton.tsx`, `QuoteSheetHost.tsx`, `QuoteSheet.tsx`, `EstimateFields.tsx`
- `_components/__tests__/`: `CalculatorIsland.test.tsx`, `CalculatorLoader.test.tsx`, `islands.test.tsx`, `QuoteSheet.test.tsx`
- `_sections/` (server): `context.ts` (`server-only`), `ui.tsx`, `CalcSection.tsx`, `Hero.tsx`, `content.tsx`, `ClosingBand.tsx`
- `_sections/__tests__/sections.test.tsx`
- `__tests__/actions.test.ts`
- `e2e/pages/calc.spec.ts`

Modify:
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.calc.{title,description}` inside the existing `sys.seo` object, and a new `sys.calc` object as a sibling of `sys.form` (identical key sets, `messages.test.ts`; voice rule over all of `sys.*`, `voice.test.ts`)
- `src/i18n/client-messages.ts` — `CLIENT_SYS` gains `'calc'` (W148; the islands read `sys.calc.*` through `useTranslations('sys')`) and its comment
- `src/lib/seo/routes.ts` — inside the `UNBUILT_PATHNAMES` set literal, delete the line `'/hiring-cost-calculator',`
- `e2e/routes.ts` — two rows appended at the end of the `GATE_ROUTE_TABLE` array literal
- `docs/CONTENT-MODEL.md` (the Cost Calculator bullet in the per-page list under `### Adding copy (W9, W23, W54)`; the `CLIENT_SYS` list in the paragraph that begins "**Client subset (W90, an allowlist since W148).**"), `docs/ARCHITECTURE.md` (the `CLIENT_SYS` list in § Routing's route-group paragraph — the sentence "the allowlist `CLIENT_SYS` = `consent`, `languageHint`, `errorTitle`, `errorRetry`, `form`" (Cycle 3); one sentence on this page's lazy split after "**a route above 194,560 B gets a lazy-loading pass before the next page task starts**." in § Quality gate (D27) (Cycle 6)), `docs/SEO.md` (a row in T1's `## Pages` table), `docs/ANALYTICS.md` (a bullet under `### Page instrumentation (WP2b)`), `docs/PRD.md` (§2 page-table row 3's "Forms carried" cell, the Cost-Calculator clause of the §11 sentence beginning "**Not yet built, by design (WP2 and later):**", three bullets at the end of `## 12. Calculator rules`), `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (the T3 `## Ledger` row)

Test:
- Vitest: the five `_lib/__tests__/*.test.ts`, the four `_components/__tests__/*.test.tsx`, `_sections/__tests__/sections.test.tsx`, `__tests__/actions.test.ts`
- Playwright (both projects, inside the Cycle 7 gate only): `e2e/pages/calc.spec.ts`; the existing `e2e/{routing,seo,a11y,width-sweep,chrome,headers,thank-you}.spec.ts` now sweep the two new routes
- Existing guards that must stay green untouched: `src/design/__tests__/class-collisions.test.ts` (W122/W155 — it scans `src/app/**`, so every class string below is part of the gate), `src/design/__tests__/client-imports.test.ts` (W147/W156/W158), `src/i18n/client-messages.test.ts` (W148 two-way pin), `src/messages/{messages,voice}.test.ts` (W154), `src/lib/seo/unbuilt.test.ts`, `src/lib/calculator/__tests__/purity.test.ts` (nothing outside `src/lib/calculator/` imports `copy-deltas.ts` except test files)

**Interfaces:**

Consumes (exact names, verified in the code; import paths as written — never a barrel, W134/W147/W156, type-only imports included):
- Content: `getBundle`, `makeTf` from `@/content/adapter` (server-only; `export * from './pure'`); `makeTf` from `@/content/pure` (tests); `getCollection(bundle, 'calculatorRoles' | 'countries')`, `getRateConfig(bundle)` (throws in every env when absent, D17), `type Country` from `@/content/collections`; `BundleSchema`, `type Bundle` from `contract/website-bundle.v1` (relative: six levels up from `_sections/`/`_lib/`/`_components/`, seven from their `__tests__/`, five from the route folder's `__tests__/`).
- Engine (`@/lib/calculator` — the pure barrel is fine, COMMON): `estimate`, `formatEstimate`, `salaryFloor`, `salaryRange`, `employerMonthlyCost`, `sgkRateLabel`, `quotaCheck`, `quotaBlocks`, `QUOTA_VIZ_CAP`, `turkishStaffRequired`, `effectiveFromLabel`, `effectiveYear`, `isReviewDue`, `updatedAtLabel`, `LIMITS`, `SGK_TIERS`, types `CalculatorRole`, `RateConfig`, `SgkTier`, `FormattedEstimate`; `LIMITS`, `SGK_TIERS`, `type SgkTier` from `@/lib/calculator/types` by path in `_lib/estimate-inputs.ts` only (the one engine import on the eager path — it keeps `engine.ts`/`labels.ts`/`money.ts` out of the first-load chunk); `formatInt`, `formatTRY` from `@/lib/format/money`; tests: `RATE`, `ROLES`, `role()` from `@/lib/calculator/__tests__/fixtures`, `COPY_DELTAS` from `@/lib/calculator/copy-deltas` (test files only).
- Forms kernel: `createFormAction`, `type FormActionState` from `@/forms/action` (`FormSpec = { key, schema, toFields(parsed, data, ctx: { visitor, locale }), consent? }`); `IDLE_FORM_STATE`, `type FormActionState` from `@/forms/types`; `CONSENT_VERSION` from `@/forms/consent` (test); `FormShell` from `@/forms/client/FormShell` — props used `action, formKey, locale, turnstileSiteKey, whatsappNumber, whatsappIntro, contact, submitLabel, consent, testId, idScope, headingLevel` (no `consentLinkHref`: its only value `'/privacy'` is the default, W79); `Field`, `type FieldOption` from `@/forms/client/Field` — props used `name, required, as, type, options, autoComplete, inputMode, rows` (labels from `sys.form.labels.*` — the design has no form, so no package label exists, W115; the select branch prepends `sys.form.placeholders.select`, W111); the D11 `FallbackPanel` (`data-testid="form-fallback"`, `data-kind`, bare `https://wa.me/<n>` href, prefill via `window.open` on click — W76).
- Islands (by path): `LazyIsland` (`{ load, props, fallback, rootMargin? }` — no `ssr`, W132; generic `LazyIsland<P>`), `RangeSlider` (`id, label, min, max, step, value, onChange, formatValue, minLabel, maxLabel, hint`), `Stepper` (`id, label, value, onChange, min, max, step, decrementLabel, incrementLabel, hint, className` — commits on blur/Enter, W131), `TriState` + `type TriStateValue` (`name, legend, value, onChange, labels, hideLegend`), `ProgressBar` (`value, label, valueText, tone: 'blue'|'green'|'amber'|'red'`), `BottomSheet` (`open, onClose, title, closeLabel, children`), `PrintButton` (`label, variant, className` — prints `.print-isolate` only) — each from `@/design/islands/<Name>`.
- Primitives/blocks/chrome (by path): `Section` + `type SectionTone` (`tone, id, className, children`; tones set `py-16` + background), `buttonClassName(variant, size, className)` + `Button` (`variant, size, href, prefetch`) from `@/design/primitives/Button` (variants `primary|secondary|ghost|danger|inverse|success|inverse-dark|nav`), `RadioChips` (`name, options, value, onChange, legend, legendHidden, className`) from `@/design/primitives/RadioChips`, `Tabs` (`tabs: { id, label, panel }[], defaultId`) from `@/design/primitives/Tabs`; `Breadcrumbs` (`locale, items: { name, href }[], tone: 'dark'`), `FaqBlock` + `type FaqItem` (`bundle, locale, items, id, eyebrowId, headingId, bodyId, askCard: { titleId, bodyId, whatsappNumber, whatsappText, whatsappLabelId, email, emailLabelId, subject }, openFirst` — W83 e-mail row), `ImageSlot` (`slot, alt, width, height` — owns its box, W129), `EmptyState` (`title, body, cta: { label, href: string | Href-object }, testId`) from `@/design/blocks/<Name>`; `StickyCtaBar` + `type StickyCta` from `@/design/chrome/StickyCtaBar` (loaded lazily; contact CTAs tracked by the bar, W81; `data-testid="sticky-cta"`); `ContactLink` from `@/analytics/ContactLink`; `useContactClick` from `@/analytics/useContactClick` (client only); `track` from `@/analytics/track` (`calculator_use: ['page','locale','role','headcount']`).
- i18n/SEO/contact: `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `buildMetadata` from `@/lib/seo/metadata`; `waLink`, `telLink`, `mailLink` from `@/lib/contact`; `renderWithIntl` from `@/test/render`; `createTranslator`, `type Messages` from `next-intl` (tests).
- Messages consumed, not added: `sys.form.*` (labels `name/email/phone/company/country/message`, `placeholders.select`, `hints.optional`, `consent.label`, `fallback.*`, `submit.sending`), `sys.nav.close` (resolved on the server and passed as a prop — `nav` stays out of `CLIENT_SYS`), `sys.nav.breadcrumbs` (Breadcrumbs).
- Operations catalog `calculator` (CALCULATOR_QUOTE, v1.0 — `P/operations-door-contract-as-built.md`): `name*` ≤ 120, `email*` ≤ 254, `phone` ≤ 40 (≥ 8 digits), `company` ≤ 200, `country` iso2, `headcount` ≤ 10, `trade` ≤ 200, `durationMonths` ≤ 10, `estimateSummary` ≤ 2000, `message` ≤ 5000. No v1.1 field (`city`, `partner.track`, `contact.topic`, `careers.portfolioUrl` — `A/produces-final.md` § Task 8) belongs to this key. **Sent: exactly these ten names**; empty values are dropped by `buildEnvelope`; unknown keys would be dropped silently by the door.
- Gate tooling: `npm run gate` / `gate:launch` (`scripts/gate.sh`), `npm run js-size`, `npm run pixel -- --page=calc --locale=tr|en --base=<url> --widths=390,900,1440` (`scripts/pixel-compare.ts` `PIXEL_PAGES.calc`), Playwright projects `mobile` (Pixel 7) and `desktop` (1440×900).

Produces (for T14's instance map and the launch sweep; nothing imports these files — later tasks copy patterns, never import across route folders):
- DOM: `#calculator` (the card, W152), `#calc-cta` (closing band; the sticky bar hides near it), section anchors `#basis`, `#salaries`, `#compare`, `#quota`, `#passcheck`, `#incentives`, `#penalties`, `#students`, `#faq`; one `data-lcp-slot` (the h1); one placeholder `calc-hero`; the quote form `form[data-testid="calc-quote-form"][data-form-key="calculator"]` (inside a `role="dialog"`, `idScope` `calc-quote`, consent id `#f-calc-quote-consent`), opened by `[data-testid="calc-quote-open"]` (card), `[data-testid="calc-quote-open-snap"]` (phone snapshot) and `[data-testid="calc-quote-open-band"]` (closing band).
- Wire (`calculator`): `name, email` + when filled `phone, company, country` (ISO-2 upper-case), `message`; always (when the bundle has design roles) `trade` (the role KEY, W77), `headcount`, `durationMonths` (integers as strings) and `estimateSummary` (≤ 2000, recomputed on the server from the `est_*` hidden inputs, labels in the request locale).
- Events: `calculator_use` (`role` = role key, `headcount` = integer) on every role or headcount commit; `whatsapp_click` / `call_click` / `email_click` with `placement: 'page_cta'`; `form_fallback` from the kernel.

**Rulings applied:**
- W1 — every package id through `makeTf` (`calc.050/101/104/381/481` carry `{homepageReplyHours}`).
- W2/W24/W58 — one engine; exact floors; support opt-in, default OFF.
- W3/W77/W79 — one `calculator` form, name*/email* + phone/company/country/message, `estimateSummary` built server-side in `toFields`; `trade` = `role.key`; `consent: 'checkbox'` in the spec and the shell; no `consentLinkHref`.
- W6/W8 — not applicable (no unsigned data, no store badges).
- W9/W23/W54 — no new package id; composed copy under `sys.calc.*` (ICU plurals), `sys.seo.calc.*` because the page record has no SEO ids.
- W10 — phone-only variants `md:hidden`, desktop `hidden md:block` or `max-md:hidden`; both in the DOM.
- W12/W26/W32 — only `calculator_use` + the contact events; the design's `calc_print`, `calc_months`, `calc_sgk_tier`, `calc_role_from_guide`, `quota_check`, `quota_exemption_tab`, `passcheck_answer` are not ported.
- W13 amended/W85/W132 — the calculator on interaction, the quote sheet on interaction, four islands + the sticky bar through `LazyIsland` by path from one `'use client'` binder module.
- W17/W152/W158 — `id="calculator"` server-rendered; W18/W81 — `StickyCtaBar` `hideNearId="calc-cta"`, `showAfterPx 700`, `live`, contact CTAs tracked by the bar.
- W20/W21 — the UNBUILT key deleted, two gate rows appended, in the same cycle as `page.tsx`.
- W45/W98 — every doc edit anchors on a heading/sentence and appends to T1's shapes; no line numbers.
- W55/D26 — the h1 is the LCP element (`data-lcp-slot="h1"`); `calc-hero` is a named placeholder (never priority).
- W59 — the salary guide's employer cost follows the chosen tier.
- W73/W74/W76/W116/W117 — kernel as built; no uploads; the fallback href is bare.
- W82/W83 — the empty state's CTA is an object `Href`; the FAQ ask card's e-mail row (`email`/`emailLabelId`/`subject`).
- W92 — the page e2e is deterministic without a door: a valid submit ends on the `unauthorized` panel; the submitting case skips on a door face.
- W95/W76 — no visitor data in any DOM href: the pass check composes on click (`WhatsAppComposeLink`), the quote fallback composes in the kernel; the only prefilled hrefs carry `sys.calc.whatsapp.generic`.
- W109 — breadcrumbs `calc.001` → `/`, `calc.002` → this page. W111/W115 — `Field as="select"` ignores `placeholder`; `sys.form.labels.*` are the labels (no package field labels exist).
- W113 — test ids sit on page-owned wrappers, never on `Section`.
- W118 — no history rewrite, no stash, no `wip` commit.
- W119/W122/W155 — hide with `max-*:hidden` beside a base display utility, show phone-only with `md:hidden`; no class string sets one property twice at one variant; a different CTA look is a `Button` variant, never a caller colour class; `Card` is not used (its base border/padding would collide with this design's).
- W120/W136/W145/W146 — the ledger's JS figure is `js-size`'s; LCP ≤ 2,500 ms and performance ≥ 0.95 under DevTools throttling (median of three) are errors locally too; GTM stays dark.
- W123 — the docs call the OG image CDN-cached. W124/W125/W133/W139/W140/W151 — not applicable (no template record; `contactKindOf` is not needed in page code; no ShareRow, refusal route or catch-all).
- W126 — one build + one start + one gate as the proof (Cycle 7).
- W127/W128 — WhatsApp faces are `success`; no green band.
- W129 — `ImageSlot` is wrapped, never given box classes.
- W130/W134/W147/W156/W158 — primitives, blocks, islands by module path everywhere; no client module imports a message catalogue or `formatReadMinutes`.
- W131 — the headcount and Turkish-staff steppers commit on blur/Enter; tests blur after typing.
- W135/W137/W138/W159 — localhost wears the production face; the pixel harness compares like for like, two runs at most.
- W142/W143/W144 — templates and guide rows authored from `COPY_DELTAS`' model column (pinned by tests); tier validated before `estimate`; pass check against `salaryFloor`.
- W148 — `calc` joins `CLIENT_SYS` (the islands read `sys.calc.*`); `sys.nav.close` is passed as a prop instead.
- W150 — the page mounts a D17 dated badge → `export const revalidate = 86400`.
- W154 — no `sys.calc.*` string speaks as "we"/"biz" (company strings name "JobsAdmire"; the three WhatsApp prefills are the visitor's own first-person singular).
- W157/W160 — security headers come from the middleware; nothing for the page to do.
- D11/D13/D17/D18/D19/D20/D23/D27, R15/R35 — fallback panel, thank-you navigation, dated data, `formatTRY` at the edge, unscaled breakpoints, accessibility over pixels, no fixtures in production, pixel harness, chrome ids, `page` = `usePathname()` from `next/navigation`.

---

#### Cycle 1 — pure foundations: the fragment joiner, the id maps, the estimate inputs, the `sys.calc` templates and their copy factories

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/__tests__/fragments.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { joinText, sp } from '../fragments';

// R56: the generated bundles are read from disk, never imported.
const strings = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  ).strings;
const TR = strings('tr');
const EN = strings('en');

describe('sp — the gap between two trimmed package fragments', () => {
  it('is one space between two words and nothing when a side is empty', () => {
    expect(sp('Can you hire', '1')).toBe(' ');
    expect(sp('', '1')).toBe('');
    expect(sp('1', '')).toBe('');
  });
  it('glues closing punctuation and apostrophe suffixes', () => {
    expect(sp('1', EN['calc.042'])).toBe(''); // "?"
    expect(sp(EN['calc.155'], EN['calc.156'])).toBe(''); // ", not per company …"
    expect(sp(TR['calc.408'], TR['calc.113'])).toBe(''); // "'ye çıkar."
    expect(sp('64.988 ₺ / ay', TR['calc.039'])).toBe(''); // "."
  });
  it('glues the Turkish suffix fragments the package splits off a highlighted word', () => {
    expect(sp(TR['calc.130'], TR['calc.131'])).toBe(''); // "üç katından fazlası" + "ıdır — …"
    expect(sp(TR['calc.244'], TR['calc.245'])).toBe(''); // "birebir aynı" + "dır. …"
    expect(sp(TR['calc.342'], TR['calc.343'])).toBe(''); // "Devletin öde" + "mediği"
    expect(sp(TR['calc.343'], TR['calc.344'])).toBe(' '); // "mediği" + "şeyler"
  });
  it('keeps the space before ordinary Turkish words that start lower-case', () => {
    expect(sp('1', TR['calc.149'])).toBe(' '); // "işçi seçtiniz."
    expect(sp(TR['calc.155'], TR['calc.156'])).toBe(' '); // "sayılır, …"
    expect(sp(TR['calc.158'], TR['calc.159'])).toBe(' '); // "itibarıyla sayılır …"
    expect(sp('12.700 ₺', TR['calc.340'])).toBe(' '); // "düşer."
    expect(sp(EN['calc.130'], EN['calc.131'])).toBe(' '); // "what doing it legally …"
  });
});

describe('joinText', () => {
  it('rebuilds the design sentences from the real bundle, empty TR fragments skipped', () => {
    expect(joinText([EN['calc.041'], '1', EN['calc.042']])).toBe('Can you hire 1?');
    expect(joinText([TR['calc.041'], '1', TR['calc.042']])).toBe('1 işçi alabilir misiniz?');
    expect(joinText([EN['calc.112'], EN['calc.408'], EN['calc.113']])).toMatch(
      /it doubles to ₺205,008 per worker\.$/,
    );
    expect(joinText([TR['calc.112'], TR['calc.408'], TR['calc.113']])).toMatch(
      /işçi başına ₺205\.008'ye çıkar\.$/,
    );
    expect(joinText([TR['calc.130'], TR['calc.131']])).toMatch(/^üç katından fazlasıdır — /);
    expect(joinText([TR['calc.154'], TR['calc.155'], TR['calc.156']])).toMatch(
      /^İşyeri bazında sayılır, şirket bazında değil/,
    );
    expect(joinText([EN['calc.154'], EN['calc.155'], EN['calc.156']])).toMatch(
      /^Counted per branch, not per company/,
    );
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/__tests__/estimate-inputs.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_INPUTS,
  ESTIMATE_FIELDS,
  estimateFieldValues,
  parseEstimateFields,
  sanitizeInputs,
} from '../estimate-inputs';

describe('sanitizeInputs', () => {
  it('starts from the design defaults: welder × 1, 12 months, other tier, flight on, support OFF (W2/W58)', () => {
    expect(DEFAULT_INPUTS).toEqual({
      roleKey: 'welder',
      headcount: 1,
      months: 12,
      grossSalary: null,
      sgkTier: 'other',
      flight: true,
      housing: false,
      supportOptIn: false,
      turkishStaff: 25,
    });
    expect(sanitizeInputs({})).toEqual(DEFAULT_INPUTS);
  });
  it('clamps to the design bounds and validates the tier before the engine sees it (W144)', () => {
    expect(
      sanitizeInputs({ headcount: 9999, turkishStaff: -3, months: 7, sgkTier: 'x', grossSalary: 0 }),
    ).toMatchObject({ headcount: 500, turkishStaff: 0, months: 12, sgkTier: 'other', grossSalary: null });
    expect(sanitizeInputs({ headcount: 0, turkishStaff: 99999 })).toMatchObject({
      headcount: 1,
      turkishStaff: 5000,
    });
    expect(sanitizeInputs({ sgkTier: 'manufacturing', months: 6 })).toMatchObject({
      sgkTier: 'manufacturing',
      months: 6,
    });
  });
});

describe('the est_* hidden inputs', () => {
  it('round-trip through estimateFieldValues → parseEstimateFields', () => {
    const inputs = { ...DEFAULT_INPUTS, roleKey: 'cook', headcount: 12, months: 6 as const, grossSalary: 55000, sgkTier: 'manufacturing' as const, flight: false, housing: true, supportOptIn: true, turkishStaff: 40 };
    const posted = Object.fromEntries(estimateFieldValues(inputs));
    expect(Object.keys(posted).sort()).toEqual(Object.values(ESTIMATE_FIELDS).sort());
    expect(parseEstimateFields(posted)).toEqual(inputs);
  });
  it('turn garbage into the defaults', () => {
    expect(
      parseEstimateFields({
        [ESTIMATE_FIELDS.headcount]: 'abc',
        [ESTIMATE_FIELDS.months]: '7',
        [ESTIMATE_FIELDS.tier]: 'x',
        [ESTIMATE_FIELDS.salary]: '',
      }),
    ).toEqual(DEFAULT_INPUTS);
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/__tests__/copy.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { RATE, role } from '@/lib/calculator/__tests__/fixtures';
import { effectiveFromLabel, effectiveYear, salaryFloor } from '@/lib/calculator';
import { formatInt, formatTRY } from '@/lib/format/money';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { makeCardCopy, makePassCopy, makeQuotaCopy, multiplierNumber, type SysT } from '../copy';

const MESSAGES = { tr: tr as Messages, en: en as Messages };
const sysOf = (locale: 'tr' | 'en') =>
  createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys' });
const strings = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  ).strings;

/** The page-level keys the server reads directly (the copy factories cover the rest). */
const PAGE_KEYS = [
  'seo.calc.title',
  'seo.calc.description',
  'calc.hero.badge',
  'calc.skeleton.activate',
  'calc.empty.title',
  'calc.empty.body',
  'calc.jump.label',
  'calc.a11y.decrease',
  'calc.a11y.increase',
  'calc.a11y.headcountPresets',
  'calc.a11y.industries',
  'calc.exemptions.tenStaff',
  'calc.exemptions.twentyStaff',
  'calc.exemptions.upTo5',
  'calc.exemptions.full',
  'calc.exemptions.timing',
  'calc.exemptions.upTo3',
  'calc.exemptions.exceptional',
  'calc.whatsapp.generic',
  'calc.quote.loading',
  'calc.quote.attached',
  'calc.summary.none',
  'calc.summary.rates',
] as const;

const get = (obj: unknown, path: string) =>
  path
    .split('.')
    .reduce<unknown>(
      (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
      obj,
    );
const args = (s: string) => [...new Set([...s.matchAll(/\{([a-zA-Z]+)[,}]/g)].map((m) => m[1]))].sort();

/** Every key the three factories read, recorded by calling each function once. */
function factoryKeys(): string[] {
  const seen: string[] = [];
  const rec: SysT = (key) => {
    seen.push(key);
    return key;
  };
  const card = makeCardCopy(rec);
  const quota = makeQuotaCopy(rec);
  const pass = makePassCopy(rec);
  card.forWorkers('2'); card.nMonths(6); card.seasonTotal(6); card.threshold('a', 'm'); card.yearNote(12, 1); card.whatsappEstimate('1', 'r', 's', 12);
  quota.allowed(1); quota.msgNo(1, 5, '4'); quota.msgMore(5, 1); quota.vsOver('1', '5'); quota.vizNone('4'); quota.vizFull('25', 5, 5); quota.vizPart(1, 4, '1'); quota.vizCap('9', 8, 0, '5');
  pass.count(1, 5, 4); pass.quotaOk('25', '5', '1'); pass.quotaNo('9', '45', '25'); pass.quotaFix('45', '9'); pass.salary('r', 'a', 'm'); pass.salaryFix('a'); pass.amberN(2); pass.redN(2); pass.unanswered(); pass.whatsapp('r', 1, '25', 's');
  return seen;
}

describe('sys.calc — every key exists in both locales with the same ICU arguments (W9/W23)', () => {
  const keys = [...new Set([...PAGE_KEYS, ...factoryKeys()])];
  it('reads 47 keys in all (45 under sys.calc, 2 under sys.seo.calc)', () => {
    expect(keys).toHaveLength(47);
  });
  for (const key of keys) {
    it(key, () => {
      const t = get(tr, `sys.${key}`);
      const e = get(en, `sys.${key}`);
      expect(typeof t, `tr sys.${key}`).toBe('string');
      expect(typeof e, `en sys.${key}`).toBe('string');
      expect(args(t as string), key).toEqual(args(e as string));
    });
  }
});

describe('the templates reproduce the legal-flagged samples calc.557–561 at the model figures (W142)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(locale, () => {
      const S = strings(locale);
      const sys = sysOf(locale);
      const card = makeCardCopy(sys);
      const quota = makeQuotaCopy(sys);
      const pass = makePassCopy(sys);
      // COPY_DELTAS pins calc.557 to the model floor 49,545 — the exact 1.5× floor, never 50,000 (W2)
      const floor = formatTRY(salaryFloor(role('welder'), RATE), locale);
      expect(card.threshold(floor, multiplierNumber(1.5, locale))).toBe(S['calc.557']);
      expect(quota.vizFull(formatInt(25, locale), 5, RATE.quotaRatio)).toBe(S['calc.558']);
      expect(pass.quotaOk('25', '5', '1')).toBe(S['calc.559']);
      expect(card.yearNote(12, 1)).toBe(S['calc.560']);
      expect(pass.count(1, 5, 4)).toBe(S['calc.561']);
    });
  }

  it('EN hero badge equals calc.003 at the seeded rates (D17); TR drops the year-dependent suffix', () => {
    const badge = (locale: 'tr' | 'en') =>
      sysOf(locale)('calc.hero.badge', {
        // a string: an ICU number argument would be grouped ("2,026")
        year: String(effectiveYear(RATE)),
        month: effectiveFromLabel(RATE, locale),
      });
    expect(badge('en')).toBe(strings('en')['calc.003']);
    expect(badge('tr')).toBe('2026 oranları · Ocak 2026 güncellemesi');
  });
});

describe('plurals and branches', () => {
  it('EN', () => {
    const sys = sysOf('en');
    const quota = makeQuotaCopy(sys);
    const card = makeCardCopy(sys);
    expect(quota.allowed(1)).toBe('1 foreign worker');
    expect(quota.allowed(2)).toBe('2 foreign workers');
    expect(quota.msgNo(1, 5, '4')).toBe(
      'With 1 Turkish employee you do not reach the 5:1 rule yet. You need 4 more, or one of the exemptions below.',
    );
    expect(quota.vizPart(1, 4, '1')).toBe(
      '1 complete block plus 4 spare employees — 1 more unlock one further place.',
    );
    expect(quota.vizCap('10', 8, 0, '5')).toBe('10 complete blocks (first 8 shown) plus 0 spare.');
    expect(quota.vizCap('10', 8, 2, '3')).toBe(
      '10 complete blocks (first 8 shown) plus 2 spare. 3 more unlock one further place.',
    );
    expect(card.yearNote(6, 5)).toBe('6 months of payroll + one-off costs for 5 workers');
    expect(makePassCopy(sys).count(5, 5, 0)).toBe('5 of 5 checks clear');
  });
  it('TR', () => {
    const sys = sysOf('tr');
    expect(makeCardCopy(sys).yearNote(6, 5)).toBe('6 aylık bordro + tek seferlik maliyetler (5 işçi için)');
    expect(makeCardCopy(sys).seasonTotal(6)).toBe('6 aylık sezon toplamı');
    expect(makeQuotaCopy(sys).allowed(3)).toBe('3 yabancı işçi');
    expect(multiplierNumber(1.5, 'tr')).toBe('1,5');
    expect(multiplierNumber(1, 'en')).toBe('1');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hiring-cost-calculator/_lib
```
Expected: FAIL — `Failed to resolve import "../fragments"` / `"../estimate-inputs"` / `"../copy"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/fragments.ts`:

```ts
/**
 * The package ships the design's sentence fragments TRIMMED — its dictionary carried the spaces
 * (`p1B2: " per worker."`, `cQuotaQ1: "Can you hire "`), the bundle does not — so every place the
 * design glued two fragments needs its space back. Except where the right-hand fragment closes
 * the clause (punctuation), carries an apostrophe suffix (`'ye çıkar.`), or continues the word as
 * a Turkish copula/participle suffix the package split off a highlighted word (`ıdır — …`,
 * `dır. …`, `mediği`). Pure; the `Sentence` component and the views join through it.
 */
const NO_SPACE_BEFORE = /^[.,;:!?)\]'’]/u;
const TR_SUFFIX = /^(?:[ıiuü]?[dt][ıiuü]r(?!\p{L})|m[ae]d[ıi]ğ[ıi](?!\p{L}))/u;

export function sp(left: string, right: string): string {
  if (!left || !right) return '';
  if (/\s$/u.test(left) || /^\s/u.test(right)) return '';
  if (NO_SPACE_BEFORE.test(right) || TR_SUFFIX.test(right)) return '';
  return ' ';
}

/** Plain strings joined with `sp`; empty fragments (the deliberately empty TR ones) vanish. */
export function joinText(parts: readonly string[]): string {
  const kept = parts.filter((p) => p !== '');
  return kept.reduce((acc, p, i) => (i === 0 ? p : acc + sp(kept[i - 1], p) + p), '');
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/ids.ts`:

```ts
/**
 * Package ids per consumer, keyed by the design dictionary's own names (`k` in
 * design-package/strings/calculator.json) so every label traces back to the design. The page
 * resolves each map once on the server through `makeTf` (W1) and hands an island only its own
 * resolved strings — no bundle, no id ever reaches a client module (D6).
 */
export const CARD_IDS = {
  cReq: 'calc.008', cPerMonth: 'calc.009', cOneOff: 'calc.010', cQuoteArrow: 'calc.011',
  cProfession: 'calc.012', cWorkers: 'calc.013', cContract: 'calc.014', cSalary: 'calc.015',
  cCover: 'calc.016', cFlight: 'calc.017', cAcc: 'calc.018', cAccNote: 'calc.019',
  cSupport: 'calc.020', cSupportNote: 'calc.021', cSgkDisc: 'calc.022', cEst: 'calc.023',
  cMonthly: 'calc.024', cGross: 'calc.025', cSgkEmp: 'calc.026', cState: 'calc.027',
  cMonthlyTotal: 'calc.028', cOneOffY1: 'calc.029', cPermitFees: 'calc.030',
  cFlightTravel: 'calc.031', cServiceFee: 'calc.032', cQuotedWritten: 'calc.033',
  cOneOffTotal: 'calc.034', cFeeNote: 'calc.035', cQuoteBtn: 'calc.036', cPrint: 'calc.037',
  sea1: 'calc.038', sea2: 'calc.039', cQuotaQ1: 'calc.041', cQuotaQ2: 'calc.042',
  cQuotaD1: 'calc.043', cQuotaStaff: 'calc.044', cQuotaD2: 'calc.045', cQuotaM1: 'calc.046',
  cQuotaStaffShort: 'calc.047', cQuotaM2: 'calc.048', cQuotaLink: 'calc.049',
  sheetPick: 'calc.399', brkHide: 'calc.421', brkShow: 'calc.422', advFew: 'calc.423',
  advMore: 'calc.424', perWorker: 'calc.463', perMonthSuffix: 'calc.464', tierManuf: 'calc.466',
  tierOther: 'calc.467', tierNone: 'calc.468', firstYear: 'calc.469', fullYear: 'calc.470',
  chip6: 'calc.471', chip9: 'calc.472', chip12: 'calc.473', allShort: 'calc.475',
} as const;

export const QUOTA_IDS = {
  qG1: 'calc.140', qLive: 'calc.141', qStaffLbl: 'calc.142', qSameBranch: 'calc.143',
  qSplit: 'calc.144', qLegTr: 'calc.145', qLegPlace: 'calc.146', qLegInc: 'calc.147',
  qPicked1: 'calc.148', qPicked2: 'calc.149', qmS1: 'calc.175', qmS1T: 'calc.176',
  qmAns: 'calc.177', quotaNone: 'calc.425', quotaTitleNo: 'calc.426',
  quotaTitleYes: 'calc.427', quotaMsgExact: 'calc.428', quotaVsOk: 'calc.429',
} as const;

export const PASS_IDS = {
  pcK: 'calc.376', pcReset: 'calc.377', pcPriv: 'calc.378', pcFix: 'calc.379',
  pcSend: 'calc.413', pcYes: 'calc.433', pcNo: 'calc.434', pcMaybe: 'calc.435',
  pcClear: 'calc.436', pcShort: 'calc.437', vIdleK: 'calc.438', vIdleT: 'calc.439',
  vIdleB: 'calc.440', vProgK: 'calc.441', vProgT: 'calc.442', vProgB: 'calc.443',
  pcConfirm: 'calc.444', ckCapT: 'calc.445', ckCapB: 'calc.446', ckCapF: 'calc.447',
  ckQuoT: 'calc.448', ckSgkT: 'calc.449', ckSgkB: 'calc.450', ckSgkF: 'calc.451',
  ckSalT: 'calc.452', ckDocT: 'calc.453', ckDocB: 'calc.454', ckDocF: 'calc.455',
  vRes: 'calc.456', vGreenT: 'calc.457', vGreenB: 'calc.458', vAmber1: 'calc.459',
  vAmberB: 'calc.460', vRed1: 'calc.461', vRedB: 'calc.462',
} as const;

export const GUIDE_IDS = {
  sGrossMo: 'calc.096', sEmpCost: 'calc.097', allInd: 'calc.474', skilled: 'calc.476',
  standard: 'calc.477', inCalc: 'calc.478', useCalc: 'calc.479',
} as const;

export const RECAP_IDS = {
  zEst: 'calc.102', zRough: 'calc.103', zFee: 'calc.104', perMonthSuffix: 'calc.464',
} as const;

export const SHEET_IDS = { title: 'calc.036', intro: 'calc.050', submit: 'calc.105' } as const;

export type Labels<T extends Record<string, string>> = { readonly [K in keyof T]: string };
export type CardLabels = Labels<typeof CARD_IDS>;
export type QuotaLabels = Labels<typeof QUOTA_IDS>;
export type PassLabels = Labels<typeof PASS_IDS>;
export type GuideLabels = Labels<typeof GUIDE_IDS>;
export type RecapLabels = Labels<typeof RECAP_IDS>;
export type SheetLabels = Labels<typeof SHEET_IDS>;

/** One id map resolved through the page's `makeTf` — the only place package copy meets an island. */
export function pickLabels<T extends Record<string, string>>(
  t: (id: string) => string,
  ids: T,
): Labels<T> {
  return Object.fromEntries(Object.entries(ids).map(([k, id]) => [k, t(id)])) as Labels<T>;
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/estimate-inputs.ts`:

```ts
// By module path, not the engine barrel: this module is on the page's EAGER client path (the
// store behind `LiveSgkRate`), and `types.ts` carries only the constants — engine.ts, labels.ts and
// money.ts stay in the lazy islands' chunk (W13 amended).
import { LIMITS, SGK_TIERS, type SgkTier } from '@/lib/calculator/types';

/** The hidden inputs the quote form posts (the store's state); prefixed `est_` so no name can be
 *  mistaken for a catalog field — only `_lib/quote.ts` turns them into the ten catalog names. */
export const ESTIMATE_FIELDS = {
  role: 'est_role',
  headcount: 'est_headcount',
  months: 'est_months',
  salary: 'est_salary',
  tier: 'est_tier',
  flight: 'est_flight',
  housing: 'est_housing',
  support: 'est_support',
  turkishStaff: 'est_turkishStaff',
} as const;

export const MONTH_OPTIONS = [6, 9, 12] as const;
export type Months = (typeof MONTH_OPTIONS)[number];
export const HEADCOUNT_PRESETS = [5, 10, 25, 50] as const;
export const TURKISH_STAFF = { default: 25, step: 5, max: 5000 } as const;
export const DEFAULT_ROLE_KEY = 'welder';

export type EstimateInputs = {
  roleKey: string;
  headcount: number;
  months: Months;
  grossSalary: number | null;
  sgkTier: SgkTier;
  flight: boolean;
  housing: boolean;
  supportOptIn: boolean;
  turkishStaff: number;
};

/** The design's first paint (line 1728): welder × 1, full year, other tier, flight on,
 *  accommodation off, minimum-wage support OFF (W2/W58), 25 Turkish staff. */
export const DEFAULT_INPUTS: EstimateInputs = {
  roleKey: DEFAULT_ROLE_KEY,
  headcount: 1,
  months: 12,
  grossSalary: null,
  sgkTier: 'other',
  flight: true,
  housing: false,
  supportOptIn: false,
  turkishStaff: TURKISH_STAFF.default,
};

const int = (v: unknown, fallback: number, min: number, max: number) => {
  const n = typeof v === 'number' ? v : Number.parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};
const bool = (v: unknown, fallback: boolean) =>
  v === '1' || v === true ? true : v === '0' || v === false ? false : fallback;

/** Anything (a store patch, posted hidden inputs) → valid inputs within the design's bounds. The
 *  tier is validated HERE: `estimate` throws `CalculatorError` on an unknown tier (W144). */
export function sanitizeInputs(raw: Partial<Record<keyof EstimateInputs, unknown>>): EstimateInputs {
  const months = int(raw.months, 12, 1, 12);
  const salary =
    raw.grossSalary === null || raw.grossSalary === undefined || raw.grossSalary === ''
      ? null
      : int(raw.grossSalary, 0, 0, 10_000_000);
  return {
    roleKey:
      typeof raw.roleKey === 'string' && raw.roleKey !== '' ? raw.roleKey.slice(0, 40) : DEFAULT_ROLE_KEY,
    headcount: int(raw.headcount, LIMITS.headcountMin, LIMITS.headcountMin, LIMITS.headcountMax),
    months: (MONTH_OPTIONS as readonly number[]).includes(months) ? (months as Months) : 12,
    grossSalary: salary === 0 ? null : salary,
    sgkTier: (SGK_TIERS as readonly string[]).includes(String(raw.sgkTier))
      ? (raw.sgkTier as SgkTier)
      : 'other',
    flight: bool(raw.flight, true),
    housing: bool(raw.housing, false),
    supportOptIn: bool(raw.supportOptIn, false),
    turkishStaff: int(raw.turkishStaff, TURKISH_STAFF.default, 0, TURKISH_STAFF.max),
  };
}

/** The store's state as `[name, value]` pairs — the hidden inputs `EstimateFields` renders. */
export function estimateFieldValues(i: EstimateInputs): [string, string][] {
  return [
    [ESTIMATE_FIELDS.role, i.roleKey],
    [ESTIMATE_FIELDS.headcount, String(i.headcount)],
    [ESTIMATE_FIELDS.months, String(i.months)],
    [ESTIMATE_FIELDS.salary, i.grossSalary === null ? '' : String(i.grossSalary)],
    [ESTIMATE_FIELDS.tier, i.sgkTier],
    [ESTIMATE_FIELDS.flight, i.flight ? '1' : '0'],
    [ESTIMATE_FIELDS.housing, i.housing ? '1' : '0'],
    [ESTIMATE_FIELDS.support, i.supportOptIn ? '1' : '0'],
    [ESTIMATE_FIELDS.turkishStaff, String(i.turkishStaff)],
  ];
}

/** Posted hidden inputs → inputs (the server action's side; never trusts the client). */
export function parseEstimateFields(data: Record<string, unknown>): EstimateInputs {
  return sanitizeInputs({
    roleKey: data[ESTIMATE_FIELDS.role],
    headcount: data[ESTIMATE_FIELDS.headcount],
    months: data[ESTIMATE_FIELDS.months],
    grossSalary: data[ESTIMATE_FIELDS.salary],
    sgkTier: data[ESTIMATE_FIELDS.tier],
    flight: data[ESTIMATE_FIELDS.flight],
    housing: data[ESTIMATE_FIELDS.housing],
    supportOptIn: data[ESTIMATE_FIELDS.support],
    turkishStaff: data[ESTIMATE_FIELDS.turkishStaff],
  });
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/events.ts`:

```ts
/** Dispatched on `window` by another island that needs the calculator card live — the salary
 *  guide's "Use in calculator" sets the role in the store and asks the card to load. */
export const CALC_ARM_EVENT = 'jobsadmire:calc-arm';
```

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/copy.ts`:

```ts
import type { Locale } from '@/i18n/routing';

/**
 * A `sys` translator as the templates need it. next-intl's `useTranslations('sys')` (islands) and
 * `getTranslations({ locale, namespace: 'sys' })` (server) both satisfy it — the repo's messages
 * are un-augmented (`Record<string, any>`), so keys are plain strings. Client islands pass their
 * translator itself (`makeCardCopy(sys)`), never a `(k, v) => sys(k, v)` wrapper: the W148 scan
 * in `client-messages.test.ts` must be able to read every key a client module passes to `sys`.
 */
export type SysT = (key: string, values?: Record<string, string | number>) => string;

/** The card's composed sentences (`sys.calc.card.*` + the estimate WhatsApp prefill). */
export type CardCopy = {
  forWorkers: (n: string) => string;
  nMonths: (months: number) => string;
  seasonTotal: (months: number) => string;
  threshold: (amount: string, multiplier: string) => string;
  yearNote: (months: number, headcount: number) => string;
  whatsappEstimate: (headcount: string, role: string, salary: string, months: number) => string;
};

export function makeCardCopy(sys: SysT): CardCopy {
  return {
    forWorkers: (n) => sys('calc.card.forWorkers', { n }),
    nMonths: (months) => sys('calc.card.nMonths', { months }),
    seasonTotal: (months) => sys('calc.card.seasonTotal', { months }),
    threshold: (amount, multiplier) => sys('calc.card.threshold', { amount, multiplier }),
    yearNote: (months, headcount) => sys('calc.card.yearNote', { months, headcount }),
    whatsappEstimate: (headcount, role, salary, months) =>
      sys('calc.whatsapp.estimate', { headcount, role, salary, months }),
  };
}

/** Gate 1's live sentences (`sys.calc.quota.*`); plural arguments are numbers, the rest strings. */
export type QuotaCopy = {
  allowed: (n: number) => string;
  msgNo: (staff: number, ratio: number, need: string) => string;
  msgMore: (ratio: number, m: number) => string;
  vsOver: (over: string, need: string) => string;
  vizNone: (n: string) => string;
  vizFull: (staff: string, blocks: number, ratio: number) => string;
  vizPart: (blocks: number, spare: number, need: string) => string;
  vizCap: (blocks: string, cap: number, spare: number, need: string) => string;
};

export function makeQuotaCopy(sys: SysT): QuotaCopy {
  return {
    allowed: (n) => sys('calc.quota.allowed', { n }),
    msgNo: (staff, ratio, need) => sys('calc.quota.msgNo', { staff, ratio, need }),
    msgMore: (ratio, m) => sys('calc.quota.msgMore', { ratio, m }),
    vsOver: (over, need) => sys('calc.quota.vsOver', { over, need }),
    vizNone: (n) => sys('calc.quota.vizNone', { n }),
    vizFull: (staff, blocks, ratio) => sys('calc.quota.vizFull', { staff, blocks, ratio }),
    vizPart: (blocks, spare, need) => sys('calc.quota.vizPart', { blocks, spare, need }),
    vizCap: (blocks, cap, spare, need) => sys('calc.quota.vizCap', { blocks, cap, spare, need }),
  };
}

/** The pass check's live sentences (`sys.calc.pass.*` + its WhatsApp prefill). */
export type PassCopy = {
  count: (clear: number, total: number, unanswered: number) => string;
  quotaOk: (staff: string, allowed: string, headcount: string) => string;
  quotaNo: (headcount: string, need: string, staff: string) => string;
  quotaFix: (need: string, headcount: string) => string;
  salary: (role: string, amount: string, multiplier: string) => string;
  salaryFix: (amount: string) => string;
  amberN: (n: number) => string;
  redN: (n: number) => string;
  unanswered: () => string;
  whatsapp: (role: string, headcount: number, staff: string, summary: string) => string;
};

export function makePassCopy(sys: SysT): PassCopy {
  return {
    count: (clear, total, unanswered) => sys('calc.pass.count', { clear, total, unanswered }),
    quotaOk: (staff, allowed, headcount) => sys('calc.pass.quotaOk', { staff, allowed, headcount }),
    quotaNo: (headcount, need, staff) => sys('calc.pass.quotaNo', { headcount, need, staff }),
    quotaFix: (need, headcount) => sys('calc.pass.quotaFix', { need, headcount }),
    salary: (role, amount, multiplier) => sys('calc.pass.salary', { role, amount, multiplier }),
    salaryFix: (amount) => sys('calc.pass.salaryFix', { amount }),
    amberN: (n) => sys('calc.pass.amberN', { n }),
    redN: (n) => sys('calc.pass.redN', { n }),
    unanswered: () => sys('calc.pass.unanswered'),
    whatsapp: (role, headcount, staff, summary) =>
      sys('calc.whatsapp.passCheck', { role, headcount, staff, summary }),
  };
}

const MULTIPLIER: Record<Locale, Intl.NumberFormat> = {
  tr: new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }),
  en: new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }),
};

/** The bare multiplier ("1,5" / "1.5") — the templates own the `×` / `katı` wording, which is why
 *  the engine's `multiplierLabel` ("1,5×") does not fit the TR sentence. */
export function multiplierNumber(m: number, locale: Locale): string {
  return MULTIPLIER[locale].format(m);
}
```

`src/messages/en.json` — inside the existing `"seo": { … }` object of `sys` (WP2a Task 4 created it with `ogTagline`; T1/T13 may have added page entries), add the member:

```json
    "calc": {
      "title": "Hiring cost calculator for foreign workers in Türkiye | JobsAdmire",
      "description": "Salary, SGK employer share, permit fees, flights and housing in one estimate. Check the 5:1 quota, run the pass check and ask for a written quote."
    }
```

and, as a new member of `sys` directly after the `"form": { … }` member (a comma after its closing brace):

```json
    "calc": {
      "hero": { "badge": "{year} rates · Updated {month}" },
      "skeleton": { "activate": "Adjust the estimate" },
      "empty": {
        "title": "The calculator is being updated",
        "body": "The current rates are not published yet — ask JobsAdmire for a written quote instead."
      },
      "jump": { "label": "Jump to a section" },
      "a11y": {
        "decrease": "Decrease by {step}",
        "increase": "Increase by {step}",
        "headcountPresets": "Quick pick",
        "industries": "Filter by industry"
      },
      "card": {
        "forWorkers": "for {n} workers",
        "nMonths": "{months} months",
        "seasonTotal": "{months}-month season total",
        "threshold": "Legal minimum for this job: {amount} gross ({multiplier}× the minimum wage).",
        "yearNote": "{months} months of payroll + one-off costs{headcount, plural, =1 {} other { for # workers}}"
      },
      "quota": {
        "allowed": "{n, plural, one {# foreign worker} other {# foreign workers}}",
        "msgNo": "With {staff, plural, one {# Turkish employee} other {# Turkish employees}} you do not reach the {ratio}:1 rule yet. You need {need} more, or one of the exemptions below.",
        "msgMore": "Counted as {ratio} Turkish employees for each foreign worker. {m, plural, one {# more Turkish employee} other {# more Turkish employees}} would give you one more place.",
        "vsOver": "That is {over} more than the rule allows. You would need {need} more Turkish employees, or an exemption. Send your numbers to JobsAdmire to find out which one fits you.",
        "vizNone": "Not one complete block yet — {n} more Turkish employees unlock the first place.",
        "vizFull": "{staff} employees make exactly {blocks, plural, one {# complete block} other {# complete blocks}} — no spare capacity, {ratio} more unlock the next place.",
        "vizPart": "{blocks, plural, one {# complete block} other {# complete blocks}} plus {spare, plural, one {# spare employee} other {# spare employees}} — {need} more unlock one further place.",
        "vizCap": "{blocks} complete blocks (first {cap} shown) plus {spare} spare.{spare, plural, =0 {} other { {need} more unlock one further place.}}"
      },
      "pass": {
        "count": "{clear} of {total} checks clear{unanswered, plural, =0 {} other { · # unanswered}}",
        "quotaOk": "Answered from your quota check above: {staff} Turkish employees allow {allowed}, and you planned {headcount}.",
        "quotaNo": "Answered from your quota check above: {headcount} foreign workers need {need} Turkish employees on SGK, and you entered {staff}.",
        "quotaFix": "You are short on the ratio — {need} Turkish employees are needed for {headcount}. Either reduce the headcount, or check whether your sector is exempt.",
        "salary": "{role}: {amount} gross per month ({multiplier}× the minimum wage). Declaring less is a refusal, not a negotiation — and paying part of it in cash is a separate offence.",
        "salaryFix": "Raise the declared salary to at least {amount} gross for this role, or pick a role class that matches the pay.",
        "amberN": "{n} things to confirm first",
        "redN": "{n} blockers — fix them before filing",
        "unanswered": "unanswered"
      },
      "exemptions": {
        "tenStaff": "10+ Turkish staff",
        "twentyStaff": "20+ Turkish staff",
        "upTo5": "Up to 5 workers",
        "full": "Full exemption",
        "timing": "Timing exemption",
        "upTo3": "Up to 3 workers",
        "exceptional": "Exceptional permit"
      },
      "whatsapp": {
        "generic": "Hello JobsAdmire, I used the hiring cost calculator on your website. Please send me a written quote.",
        "estimate": "Hello JobsAdmire, I used the cost calculator: {headcount} × {role} at {salary} gross, {months}-month contract. Please send a written quote.",
        "passCheck": "Hello JobsAdmire, I ran the pass check on your cost calculator page.\n\nRole: {role} · {headcount, plural, one {# worker} other {# workers}}\nTurkish employees at the workplace: {staff}\n\n{summary}\n\nCan you review this with me?"
      },
      "quote": {
        "loading": "Opening the quote form…",
        "attached": "The estimate above is sent with your request."
      },
      "summary": { "none": "none", "rates": "Rates version" }
    }
```

`src/messages/tr.json` — the same two places:

```json
    "calc": {
      "title": "Yabancı işçi maliyet hesaplayıcı — Türkiye | JobsAdmire",
      "description": "Maaş, SGK işveren payı, izin harçları, uçak bileti ve konaklama tek tahminde. 5:1 kotanızı kontrol edin, geçer-mi testini yapın, yazılı teklif isteyin."
    }
```

```json
    "calc": {
      "hero": { "badge": "{year} oranları · {month} güncellemesi" },
      "skeleton": { "activate": "Tahmini düzenleyin" },
      "empty": {
        "title": "Hesaplayıcı güncelleniyor",
        "body": "Güncel oranlar henüz yayınlanmadı — bunun yerine JobsAdmire'dan yazılı teklif isteyin."
      },
      "jump": { "label": "Bölüme git" },
      "a11y": {
        "decrease": "{step} azalt",
        "increase": "{step} artır",
        "headcountPresets": "Hızlı seçim",
        "industries": "Sektöre göre filtrele"
      },
      "card": {
        "forWorkers": "{n} işçi için",
        "nMonths": "{months} ay",
        "seasonTotal": "{months} aylık sezon toplamı",
        "threshold": "Bu iş için yasal asgari: {amount} brüt (asgari ücretin {multiplier} katı).",
        "yearNote": "{months} aylık bordro + tek seferlik maliyetler{headcount, plural, =1 {} other { (# işçi için)}}"
      },
      "quota": {
        "allowed": "{n} yabancı işçi",
        "msgNo": "{staff} Türk çalışanla {ratio}:1 kuralına henüz ulaşmıyorsunuz. {need} kişi daha gerekiyor veya aşağıdaki muafiyetlerden biri.",
        "msgMore": "Her yabancı işçi için {ratio} Türk çalışan sayılır. {m} Türk çalışan daha bir kontenjan açar.",
        "vsOver": "Bu, kuralın izin verdiğinden {over} kişi fazla. {need} Türk çalışan daha veya bir muafiyet gerekir. Size hangisinin uyduğunu öğrenmek için rakamlarınızı JobsAdmire'a gönderin.",
        "vizNone": "Henüz tam bir grup yok — {n} Türk çalışan daha ilk kontenjanı açar.",
        "vizFull": "{staff} çalışan için {blocks} tam kontenjan bulunmaktadır. Her {ratio} çalışan, bir kontenjanı doldurur; sonraki {ratio} çalışan için yeni bir kontenjan açılır.",
        "vizPart": "{blocks} tam grup artı {spare} artık çalışan — {need} kişi daha bir kontenjan daha açar.",
        "vizCap": "{blocks} tam grup (ilk {cap} gösteriliyor) artı {spare} artık.{spare, plural, =0 {} other { {need} kişi daha bir kontenjan daha açar.}}"
      },
      "pass": {
        "count": "{total} kontrolden {clear} tamam{unanswered, plural, =0 {} other { · # yanıtlanmadı}}",
        "quotaOk": "Kota kontrolüne göre, {staff} Türk çalışan için {allowed} yabancı çalışan kontenjanı bulunmaktadır. Planlanan: {headcount} yabancı çalışan.",
        "quotaNo": "Yukarıdaki kota kontrolünden dolduruldu: {headcount} yabancı işçi için SGK'lı {need} Türk çalışan gerekir, siz {staff} girdiniz.",
        "quotaFix": "Oranda eksiksiniz — {headcount} işçi için {need} Türk çalışan gerekiyor. Ya sayıyı azaltın ya da sektörünüzün muaf olup olmadığını kontrol edin.",
        "salary": "{role} için bu, aylık brüt {amount} demektir (asgari ücretin {multiplier} katı). Daha düşük beyan pazarlık değil rettir — bir kısmını elden ödemek ise ayrı bir suçtur.",
        "salaryFix": "Bu meslek için beyan edilen maaşı en az brüt {amount} seviyesine çıkarın ya da ödemeye uyan bir meslek sınıfı seçin.",
        "amberN": "Önce teyit edilmesi gereken {n} şey var",
        "redN": "{n} engel — başvurmadan önce düzeltin",
        "unanswered": "yanıtlanmadı"
      },
      "exemptions": {
        "tenStaff": "10+ Türk çalışan",
        "twentyStaff": "20+ Türk çalışan",
        "upTo5": "5 işçiye kadar",
        "full": "Tam muafiyet",
        "timing": "Zamanlama muafiyeti",
        "upTo3": "3 işçiye kadar",
        "exceptional": "İstisnai izin"
      },
      "whatsapp": {
        "generic": "Merhaba JobsAdmire, web sitenizdeki maliyet hesaplayıcıyı kullandım. Yazılı teklif rica ederim.",
        "estimate": "Merhaba JobsAdmire, maliyet hesaplayıcıyı kullandım: {headcount} × {role}, brüt {salary}, {months} aylık sözleşme. Yazılı teklif rica ederim.",
        "passCheck": "Merhaba JobsAdmire, maliyet hesaplayıcı sayfanızdaki geçer-mi testini yaptım.\n\nMeslek: {role} · {headcount} işçi\nİşyerindeki Türk çalışan sayısı: {staff}\n\n{summary}\n\nBunu benimle birlikte değerlendirebilir misiniz?"
      },
      "quote": {
        "loading": "Teklif formu açılıyor…",
        "attached": "Yukarıdaki tahmin talebinizle birlikte gönderilir."
      },
      "summary": { "none": "yok", "rates": "Oran sürümü" }
    }
```

Voice (W154, `voice.test.ts` over all of `sys.*`): every company-voice string names "JobsAdmire" (`empty.body`, `quota.vsOver`); the three `whatsapp.*` strings are the visitor's first-person SINGULAR (`I used` / `kullandım`, `rica ederim`, `yaptım`), which the test does not flag — no `VISITOR_VOICE` change is needed. The `\n` inside `whatsapp.passCheck` is a JSON escape.

`docs/CONTENT-MODEL.md` — append to the per-page `sys.*` bullet list at the end of `### Adding copy (W9, W23, W54)` (T1 created it, W98; after the last bullet T2 left):

```markdown
- **Cost Calculator (`sys.calc.*` + `sys.seo.calc.*`, WP2b T3):** `hero.badge` (D17 — `{year}`/`{month}` from `rateConfig`, hidden from `reviewDueAt`; TR "… güncellemesi" avoids the year-dependent suffix of `calc.003`), `skeleton.activate`, `empty.{title,body}`, `jump.label`, `a11y.{decrease,increase,headcountPresets,industries}`, `card.*` (5), `quota.*` (8) and `pass.*` (9) — the design's 23 `GEN` sentence templates as ICU messages (`quotaOne`/`quotaMany` fold into the `quota.allowed` plural; `threshold`, `quota.vizFull`, `pass.quotaOk`, `card.yearNote` and `pass.count` reproduce the legal-flagged samples `calc.557`–`561` word for word at the model figures, pinned by `hiring-cost-calculator/_lib/__tests__/copy.test.ts`), `exemptions.*` (the 7 badges the package lacks), `whatsapp.{generic,estimate,passCheck}` (the visitor's own first-person singular; `estimate`/`passCheck` exist only in click-time prefills, W95), `quote.{loading,attached}`, `summary.{none,rates}` (the `estimateSummary` lines no package label covers); `seo.calc.{title,description}` (the page record has no SEO ids). No template carries a figure: every number is an engine argument (W142). The server reads them through `getTranslations('sys')`; the `_lib/copy.ts` factories bind the templates for server and islands alike.
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hiring-cost-calculator/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `fragments.test.ts` 5, `estimate-inputs.test.ts` 4, `copy.test.ts` 1 + 47 + 3 + 2 green; `messages.test.ts` (identical key sets) and `voice.test.ts` green; `client-messages.test.ts` unchanged (no client module reads `sys.calc` yet — `CLIENT_SYS` changes in Cycle 3 with the first reader, W148's two-way pin).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md
git commit -m "feat(calc): fragment joiner, id maps, estimate inputs and the sys.calc ICU templates

The trimmed package fragments get their spaces back (TR suffix fragments stay glued); the
23 GEN templates become 45 sys.calc keys whose samples reproduce calc.557-561 at the model
figures (W142); the tier is validated before the engine (W144); voice-safe copy (W154).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — the view models: card, quota gate, pass check, salary guide (pure, pinned to `COPY_DELTAS`)

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/__tests__/views.test.ts`:

```ts
import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { COPY_DELTAS } from '@/lib/calculator/copy-deltas';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { formatTRY } from '@/lib/format/money';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import {
  computeCardView,
  designRoles,
  resolveRole,
  roleLabelMaps,
  salaryStops,
  stopIndex,
} from '../card-view';
import { makeCardCopy, makePassCopy, makeQuotaCopy } from '../copy';
import { DEFAULT_INPUTS, type EstimateInputs } from '../estimate-inputs';
import { PASS_IDS, QUOTA_IDS, pickLabels } from '../ids';
import { computePassView, passCheckVerdict, PASS_CHECK_ROWS } from '../pass-check';
import { computeQuotaView } from '../quota-view';
import { buildGuideRows, GUIDE_SCALE_MIN, guideScaleMax } from '../salary-guide';

const MESSAGES = { tr: tr as Messages, en: en as Messages };
const sysOf = (locale: 'tr' | 'en') =>
  createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys' });
// Labels as their own ids: the views pass package copy through untouched, so an id is proof enough.
const asId = (id: string) => id;
const ROLES_D = designRoles(ROLES);
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, asId);
const CARD_LABELS = {
  perWorker: 'per worker',
  fullYear: 'Full year',
  firstYear: 'First-year total',
  perMonthSuffix: '/ month',
};
/** A COPY_DELTAS row by id — the page's figures must equal its `model` column (W142/W143). */
const delta = (id: string) => {
  const row = COPY_DELTAS.find((r) => r.id === id);
  if (!row) throw new Error(`COPY_DELTAS has no row "${id}"`);
  return row;
};
const card = (inputs: EstimateInputs = DEFAULT_INPUTS, locale: 'tr' | 'en' = 'en') =>
  computeCardView({
    inputs,
    roles: ROLES_D,
    rateConfig: RATE,
    locale,
    roleLabels,
    industryLabels,
    labels: CARD_LABELS,
    copy: makeCardCopy(sysOf(locale)),
  });

describe('designRoles / resolveRole', () => {
  it('offers the 12 design roles, never the teaser presets (W24)', () => {
    expect(ROLES_D.map((r) => r.key)).toHaveLength(12);
    expect(ROLES_D.some((r) => r.preset)).toBe(false);
  });
  it('falls back to the welder for an unknown key', () => {
    expect(resolveRole(ROLES_D, 'nope').key).toBe('welder');
  });
});

describe('salaryStops', () => {
  it('starts at the exact floor, steps by 500, ends at the band maximum (W2)', () => {
    const stops = salaryStops(49545, 70000);
    expect(stops.slice(0, 3)).toEqual([49545, 50000, 50500]);
    expect(stops.at(-1)).toBe(70000);
    expect(stops).toHaveLength(42);
    expect(salaryStops(50000, 78000)).toHaveLength(57);
    expect(stopIndex(stops, 50100)).toBe(1);
    expect(stopIndex(stops, 1)).toBe(0);
  });
});

describe('computeCardView — every figure is the COPY_DELTAS model column (W142)', () => {
  it('the 1.5× roles start at the exact floor, the cook at its band, the 1× roles at the minimum wage', () => {
    const minFor = (roleKey: string) => card({ ...DEFAULT_INPUTS, roleKey }).stops[0];
    for (const key of ['welder', 'cnc', 'electrician', 'plumber'])
      expect(minFor(key)).toBe(delta('Hiring Cost Calculator.dc.html:2587 (legalMin)').model);
    expect(minFor('cook')).toBe(delta('Hiring Cost Calculator.dc.html:2587 (legalMin, cook)').model);
    for (const key of ['labourer', 'housekeeping', 'steward', 'greenhouse'])
      expect(minFor(key)).toBe(
        delta('Hiring Cost Calculator.dc.html:2587 (legalMin, 1× minimum-wage roles)').model,
      );
  });
  it('the first paint shows the model totals, never the design samples', () => {
    const v = card(DEFAULT_INPUTS, 'tr');
    const monthly = delta('Hiring Cost Calculator.dc.html:2598 (mTotal, initial render)').model;
    const year = delta('Hiring Cost Calculator.dc.html:2603 (yearTotal, initial render)').model;
    expect(v.f.monthly.total).toBe(formatTRY(monthly, 'tr'));
    expect(v.f.contract.total).toBe(formatTRY(year, 'tr'));
    expect([v.f.monthly.total, v.f.contract.total]).toEqual(['60.321 ₺', '751.852 ₺']);
    expect(v.thresholdNote).toContain(formatTRY(delta('calc.557').model, 'tr'));
    expect(v.months).toBe(delta('calc.560').model);
    expect(v.salaryLabel).toBe('49.545 ₺ / month');
    expect(v.headcountNote).toBe('per worker');
    expect(v.monthsNote).toBe('Full year');
  });
  it('multiplies by headcount, nets support only when opted in, and marks a season', () => {
    expect(card({ ...DEFAULT_INPUTS, headcount: 5 }).f.monthly.total).toBe('₺301,605');
    expect(card({ ...DEFAULT_INPUTS, headcount: 5, supportOptIn: true }).f.monthly.total).toBe(
      '₺295,255',
    );
    expect(card({ ...DEFAULT_INPUTS, headcount: 5 }).headcountNote).toBe('for 5 workers');
    expect(card({ ...DEFAULT_INPUTS, headcount: 5 }).quotaNeeded).toBe('25');
    const season = card({ ...DEFAULT_INPUTS, months: 6 });
    expect(season.seasonal).toBe(true);
    expect(season.totalTitle).toBe('6-month season total');
    expect(season.monthsNote).toBe('6 months');
    expect(season.f.contract.total).toBe('₺389,926');
    expect(season.perMonthPerWorker).toBe('₺64,988 / month');
  });
  it('the cook floors at its band while the threshold still states the legal floor', () => {
    const v = card({ ...DEFAULT_INPUTS, roleKey: 'cook' });
    expect(v.salaryLabel).toBe('₺50,000 / month');
    expect(v.roleRange).toBe('₺50,000 – ₺78,000');
    expect(v.thresholdNote).toBe(
      'Legal minimum for this job: ₺49,545 gross (1.5× the minimum wage).',
    );
    expect(v.whatsappEstimate).toBe(
      'Hello JobsAdmire, I used the cost calculator: 1 × calc.548 at ₺50,000 gross, 12-month contract. Please send a written quote.',
    );
  });
});

describe('computeQuotaView — Gate 1 over rateConfig.quotaRatio', () => {
  const labels = pickLabels(asId, QUOTA_IDS);
  const quota = (staff: number, headcount: number) =>
    computeQuotaView({
      staff,
      headcount,
      ratio: RATE.quotaRatio,
      locale: 'en',
      labels,
      copy: makeQuotaCopy(sysOf('en')),
    });
  it('25 staff, 1 planned: 5 places, an exact fit, within the plan (calc.558/559 pins)', () => {
    const v = quota(25, 1);
    expect(v.allowed).toBe(delta('calc.558').model);
    expect(v.allowed).toBe(delta('calc.559').model);
    expect([v.ok, v.title, v.allowedText, v.msg, v.vsPlan]).toEqual([
      true,
      'calc.427',
      '5 foreign workers',
      'calc.428',
      'calc.429',
    ]);
    expect(v.vizNote).toBe(
      '25 employees make exactly 5 complete blocks — no spare capacity, 5 more unlock the next place.',
    );
    expect(v.blocks.map((b) => b.kind)).toEqual(['used', 'free', 'free', 'free', 'free']);
  });
  it('9 staff give one place, not two (calc.153); 3 planned → 2 over, 6 more needed', () => {
    const v = quota(9, 3);
    expect(v.allowed).toBe(delta('calc.153').model);
    expect(v.msg).toBe(
      'Counted as 5 Turkish employees for each foreign worker. 1 more Turkish employee would give you one more place.',
    );
    expect(v.vizNote).toBe('1 complete block plus 4 spare employees — 1 more unlock one further place.');
    expect(v.vsPlan).toBe(
      'That is 2 more than the rule allows. You would need 6 more Turkish employees, or an exemption. Send your numbers to JobsAdmire to find out which one fits you.',
    );
    expect(v.blocks.map((b) => [b.kind, b.filled])).toEqual([
      ['used', 5],
      ['partial', 4],
    ]);
  });
  it('fewer staff than the ratio: no place yet', () => {
    const v = quota(3, 1);
    expect([v.ok, v.title, v.allowedText]).toEqual([false, 'calc.426', 'calc.425']);
    expect(v.msg).toBe(
      'With 3 Turkish employees you do not reach the 5:1 rule yet. You need 2 more, or one of the exemptions below.',
    );
    expect(v.vizNote).toBe(
      'Not one complete block yet — 2 more Turkish employees unlock the first place.',
    );
  });
  it('caps the visualisation at QUOTA_VIZ_CAP blocks', () => {
    const v = quota(52, 1);
    expect(v.blocks).toHaveLength(8);
    expect(v.vizNote).toBe(
      '10 complete blocks (first 8 shown) plus 2 spare. 3 more unlock one further place.',
    );
  });
});

describe('passCheckVerdict — the design rules (lines 1899–1965)', () => {
  it('is idle until more than one row is answered (the quota row always is)', () => {
    expect(passCheckVerdict({}, true)).toMatchObject({ tone: 'idle', clear: 1, answered: 1, unanswered: 4 });
    expect(passCheckVerdict({ capital: 'yes' }, true)).toMatchObject({ tone: 'progress', clear: 2 });
  });
  it('a "no" is red, an "unsure" without a "no" amber, five clears green', () => {
    expect(passCheckVerdict({ capital: 'no', sgk: 'unsure' }, true)).toMatchObject({
      tone: 'red',
      blockers: ['capital'],
      unsure: ['sgk'],
    });
    expect(passCheckVerdict({ capital: 'unsure' }, true)).toMatchObject({ tone: 'amber' });
    expect(
      passCheckVerdict({ capital: 'yes', sgk: 'yes', salary: 'yes', docs: 'yes' }, true),
    ).toMatchObject({ tone: 'green', clear: 5, progressPct: 100 });
  });
  it('a failed quota blocks on its own; the rows keep the design order', () => {
    expect(
      passCheckVerdict({ capital: 'yes', sgk: 'yes', salary: 'yes', docs: 'yes' }, false),
    ).toMatchObject({ tone: 'red', clear: 4, blockers: ['quota'] });
    expect(PASS_CHECK_ROWS).toEqual(['capital', 'quota', 'sgk', 'salary', 'docs']);
  });
});

describe('computePassView', () => {
  const labels = pickLabels(asId, PASS_IDS);
  const view = (answers: Parameters<typeof passCheckVerdict>[0], inputs: EstimateInputs) =>
    computePassView({
      answers,
      inputs,
      roles: ROLES_D,
      rateConfig: RATE,
      locale: 'en',
      roleLabels,
      labels,
      copy: makePassCopy(sysOf('en')),
    });
  it('reads the salary row against salaryFloor — 49,545 for the cook too (W144)', () => {
    const v = view({}, { ...DEFAULT_INPUTS, roleKey: 'cook' });
    expect(v.rows.find((r) => r.key === 'salary')?.body).toBe(
      'calc.548: ₺49,545 gross per month (1.5× the minimum wage). Declaring less is a refusal, not a negotiation — and paying part of it in cash is a separate offence.',
    );
    expect(v.rows.find((r) => r.key === 'quota')?.body).toBe(
      'Answered from your quota check above: 25 Turkish employees allow 5, and you planned 1.',
    );
    expect([v.tone, v.kicker, v.count, v.progressPct]).toEqual([
      'idle',
      'calc.438',
      '1 of 5 checks clear · 4 unanswered',
      20,
    ]);
  });
  it('turns answers into the verdict, the fix list and the click-time WhatsApp text', () => {
    const v = view({ capital: 'no', sgk: 'unsure' }, DEFAULT_INPUTS);
    expect([v.tone, v.kicker, v.title]).toEqual(['red', 'calc.456', 'calc.461']);
    expect(v.fixes).toEqual([
      { key: 'capital', text: 'calc.447', unsure: false },
      { key: 'sgk', text: 'calc.444 calc.451', unsure: true },
    ]);
    expect(v.manualAnswered).toBe(true);
    expect(v.whatsappText).toContain('Role: calc.555 · 1 worker');
    expect(v.whatsappText).toContain('1. calc.445 — calc.434');
    expect(v.whatsappText).toContain('2. calc.448 — calc.433');
    expect(v.whatsappText).toContain('4. calc.452 — unanswered');
  });
});

describe('buildGuideRows — the model floor (W2) at the chosen tier (W59)', () => {
  const labels = { skilled: 'Skilled · 1.5×', standard: 'Standard · 1×' };
  const rows = (tier: 'manufacturing' | 'other') =>
    buildGuideRows({ roles: ROLES_D, rateConfig: RATE, tier, locale: 'en', roleLabels, industryLabels, labels });
  it('lows and employer costs from COPY_DELTAS, never the design samples', () => {
    const other = rows('other');
    expect(other).toHaveLength(12);
    const low = formatTRY(
      delta('Hiring Cost Calculator.dc.html:2718 (salary guide employer cost)').model,
      'en',
    );
    for (const key of ['welder', 'cnc', 'electrician', 'plumber']) {
      const row = other.find((r) => r.key === key);
      expect(row?.range.startsWith('₺49,545 – ')).toBe(true);
      expect(row?.employer.startsWith(`${low} – `)).toBe(true); // ₺60,321, design ₺60,875
    }
    const labourer = other.find((r) => r.key === 'labourer');
    expect(labourer?.range).toBe('₺33,030 – ₺44,000');
    expect(labourer?.employer).toBe(`${formatTRY(delta('calc.079').model, 'en')} – ₺53,570`);
    expect(other.find((r) => r.key === 'welder')?.tier).toBe('Skilled · 1.5×');
    expect(rows('manufacturing').find((r) => r.key === 'welder')?.employer).toBe('₺58,835 – ₺83,125');
  });
  it('places the bar on the design scale 30,000 → the highest band max, tick at the minimum wage', () => {
    expect(guideScaleMax(ROLES_D)).toBe(78000);
    const labourer = rows('other').find((r) => r.key === 'labourer');
    const pct = ((RATE.legalMinGross - GUIDE_SCALE_MIN) / (78000 - GUIDE_SCALE_MIN)) * 100;
    expect(labourer?.barLeftPct).toBeCloseTo(pct, 5);
    expect(labourer?.tickPct).toBeCloseTo(pct, 5);
    expect(rows('other').filter((r) => r.industry === 'hotel')).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hiring-cost-calculator/_lib/__tests__/views.test.ts
```
Expected: FAIL — `Failed to resolve import "../card-view"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/card-view.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import {
  estimate,
  formatEstimate,
  salaryFloor,
  salaryRange,
  sgkRateLabel,
  turkishStaffRequired,
  type CalculatorRole,
  type FormattedEstimate,
  type RateConfig,
  type SgkTier,
} from '@/lib/calculator';
import { formatInt, formatTRY } from '@/lib/format/money';
import { multiplierNumber, type CardCopy } from './copy';
import { DEFAULT_ROLE_KEY, type EstimateInputs, type Months } from './estimate-inputs';
import type { CardLabels } from './ids';

type Industry = NonNullable<CalculatorRole['industry']>;

/** A role this page offers: an industry and a salary band. The `preset: true` rows are the
 *  homepage teaser's (W24) and never appear here. */
export type DesignRole = CalculatorRole & {
  industry: Industry;
  industryLabelId: string;
  salaryMax: number;
};

export function designRoles(roles: readonly CalculatorRole[]): DesignRole[] {
  return roles.filter(
    (r): r is DesignRole =>
      !r.preset && r.industry !== null && r.industryLabelId !== null && r.salaryMax !== null,
  );
}

export function resolveRole(roles: readonly DesignRole[], key: string): DesignRole {
  const role =
    roles.find((r) => r.key === key) ?? roles.find((r) => r.key === DEFAULT_ROLE_KEY) ?? roles[0];
  if (!role) throw new Error('calculatorRoles holds no design role — the page renders its empty state');
  return role;
}

/** role key → label, industry key → label, resolved on the server through `makeTf` (W1). */
export function roleLabelMaps(roles: readonly DesignRole[], t: (id: string) => string) {
  const roleLabels: Record<string, string> = {};
  const industryLabels: Record<string, string> = {};
  for (const r of roles) {
    roleLabels[r.key] = t(r.labelId);
    industryLabels[r.industry] = t(r.industryLabelId);
  }
  return { roleLabels, industryLabels };
}

export const SALARY_STEP = 500;

/** The slider's stops: the exact floor (W2 — 49,545 for a 1.5× role), every ₺500 above it, then
 *  the band maximum, so a native range input reaches both ends (a `step="500"` from 49,545 could
 *  never land on 70,000). The slider moves over the stop index. */
export function salaryStops(min: number, max: number, step = SALARY_STEP): number[] {
  const stops = [min];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) if (v > min) stops.push(v);
  if (stops[stops.length - 1] < max) stops.push(max);
  return stops;
}

/** The stop a salary sits on — the last one not above it. */
export function stopIndex(stops: readonly number[], value: number): number {
  let i = 0;
  while (i + 1 < stops.length && stops[i + 1] <= value) i += 1;
  return i;
}

export type CardViewLabels = Pick<CardLabels, 'perWorker' | 'fullYear' | 'firstYear' | 'perMonthSuffix'>;

export type CardView = {
  roleKey: string;
  roleLabel: string;
  industryLabel: string;
  roleRange: string;
  headcount: number;
  headcountText: string;
  headcountNote: string;
  months: Months;
  monthsNote: string;
  stops: number[];
  stopIndex: number;
  salaryLabel: string;
  salaryMinLabel: string;
  salaryMaxLabel: string;
  thresholdNote: string;
  sgkTier: SgkTier;
  sgkRate: string;
  f: FormattedEstimate;
  seasonal: boolean;
  perMonthPerWorker: string;
  totalTitle: string;
  yearNote: string;
  quotaNeeded: string;
  flight: boolean;
  housing: boolean;
  supportOptIn: boolean;
  whatsappEstimate: string;
};

/** The card's whole view — the server skeleton, the island, the recap and the quote sheet all
 *  render from this one function, so the first paint and the live card cannot disagree. */
export function computeCardView({
  inputs,
  roles,
  rateConfig,
  locale,
  roleLabels,
  industryLabels,
  labels,
  copy,
}: {
  inputs: EstimateInputs;
  roles: readonly DesignRole[];
  rateConfig: RateConfig;
  locale: Locale;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  labels: CardViewLabels;
  copy: CardCopy;
}): CardView {
  const role = resolveRole(roles, inputs.roleKey);
  const range = salaryRange(role, rateConfig);
  const max = range.max ?? range.min;
  const stops = salaryStops(range.min, max);
  const est = estimate(
    {
      role,
      headcount: inputs.headcount,
      months: inputs.months,
      grossSalary: inputs.grossSalary,
      sgkTier: inputs.sgkTier,
      flight: inputs.flight,
      housing: inputs.housing,
      supportOptIn: inputs.supportOptIn,
    },
    rateConfig,
  );
  const f = formatEstimate(est, locale);
  const head = est.input.headcount;
  const months = inputs.months;
  const roleLabel = roleLabels[role.key] ?? role.key;
  const headcountText = formatInt(head, locale);
  return {
    roleKey: role.key,
    roleLabel,
    industryLabel: industryLabels[role.industry] ?? role.industry,
    roleRange: `${formatTRY(range.min, locale)} – ${formatTRY(max, locale)}`,
    headcount: head,
    headcountText,
    headcountNote: head === 1 ? labels.perWorker : copy.forWorkers(headcountText),
    months,
    monthsNote: months === 12 ? labels.fullYear : copy.nMonths(months),
    stops,
    stopIndex: stopIndex(stops, est.input.grossSalary),
    salaryLabel: `${f.grossSalary} ${labels.perMonthSuffix}`,
    salaryMinLabel: formatTRY(range.min, locale),
    salaryMaxLabel: formatTRY(max, locale),
    // W2: the exact floor (legalMinGross × multiplier) — calc.557's wording, the model's figure
    thresholdNote: copy.threshold(
      formatTRY(salaryFloor(role, rateConfig), locale),
      multiplierNumber(role.multiplier, locale),
    ),
    sgkTier: est.input.sgkTier,
    sgkRate: sgkRateLabel(rateConfig, est.input.sgkTier, locale),
    f,
    seasonal: months < 12,
    perMonthPerWorker: `${f.contract.perWorkerPerMonth} ${labels.perMonthSuffix}`,
    totalTitle: months === 12 ? labels.firstYear : copy.seasonTotal(months),
    yearNote: copy.yearNote(months, head),
    quotaNeeded: formatInt(turkishStaffRequired(head, rateConfig.quotaRatio), locale),
    flight: est.input.flight,
    housing: est.input.housing,
    supportOptIn: est.input.supportOptIn,
    whatsappEstimate: copy.whatsappEstimate(headcountText, roleLabel, f.grossSalary, months),
  };
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/quota-view.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import { QUOTA_VIZ_CAP, quotaBlocks, quotaCheck } from '@/lib/calculator';
import { formatInt } from '@/lib/format/money';
import type { QuotaCopy } from './copy';
import type { QuotaLabels } from './ids';

/** One visualised block: a complete group that unlocks a place (`used` when the plan fills it)
 *  or the incomplete group after the last one. */
export type QuotaBlock = { kind: 'used' | 'free' | 'partial'; filled: number };

export type QuotaView = {
  ratio: number;
  allowed: number;
  ok: boolean;
  title: string;
  allowedText: string;
  msg: string;
  blocks: QuotaBlock[];
  vizNote: string;
  vsPlan: string;
  headcountText: string;
};

/** Gate 1 (design 1063–1105 + the phone cards 1031–1049), every number over
 *  `rateConfig.quotaRatio` (the design hard-codes 5). */
export function computeQuotaView({
  staff,
  headcount,
  ratio,
  locale,
  labels,
  copy,
}: {
  staff: number;
  headcount: number;
  ratio: number;
  locale: Locale;
  labels: QuotaLabels;
  copy: QuotaCopy;
}): QuotaView {
  const check = quotaCheck(staff, headcount, ratio);
  const b = quotaBlocks(staff, ratio, QUOTA_VIZ_CAP);
  const n = (v: number) => formatInt(v, locale);
  const allowed = check.maxForeign;
  const blocks: QuotaBlock[] = Array.from({ length: b.shown }, (_, i) => ({
    kind: i < headcount ? 'used' : 'free',
    filled: ratio,
  }));
  // the design shows the incomplete group only while the complete ones are under the cap
  if (b.remainder > 0 && b.full < QUOTA_VIZ_CAP) blocks.push({ kind: 'partial', filled: b.remainder });
  const vizNote = b.capped
    ? copy.vizCap(n(b.full), QUOTA_VIZ_CAP, b.remainder, n(b.nextUnlockIn))
    : staff < ratio
      ? copy.vizNone(n(ratio - staff))
      : b.remainder === 0
        ? copy.vizFull(n(staff), b.full, ratio)
        : copy.vizPart(b.full, b.remainder, n(b.nextUnlockIn));
  return {
    ratio,
    allowed,
    ok: allowed > 0,
    title: allowed === 0 ? labels.quotaTitleNo : labels.quotaTitleYes,
    allowedText: allowed === 0 ? labels.quotaNone : copy.allowed(allowed),
    msg:
      allowed === 0
        ? copy.msgNo(staff, ratio, n(ratio - staff))
        : b.remainder === 0
          ? labels.quotaMsgExact
          : copy.msgMore(ratio, b.nextUnlockIn),
    blocks,
    vizNote,
    vsPlan: check.allowed ? labels.quotaVsOk : copy.vsOver(n(check.overBy), n(check.shortfall)),
    headcountText: n(headcount),
  };
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/pass-check.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import { quotaCheck, salaryFloor, turkishStaffRequired, type RateConfig } from '@/lib/calculator';
import { formatInt, formatTRY } from '@/lib/format/money';
import { resolveRole, type DesignRole } from './card-view';
import { multiplierNumber, type PassCopy } from './copy';
import type { EstimateInputs } from './estimate-inputs';
import { joinText } from './fragments';
import type { PassLabels } from './ids';

export const PASS_CHECK_ROWS = ['capital', 'quota', 'sgk', 'salary', 'docs'] as const;
export type PassRow = (typeof PASS_CHECK_ROWS)[number];
export type ManualRow = Exclude<PassRow, 'quota'>;
export const MANUAL_ROWS: readonly ManualRow[] = ['capital', 'sgk', 'salary', 'docs'];
/** Structurally `TriStateValue`; kept local so this pure module imports no client module. */
export type Answer = 'yes' | 'no' | 'unsure';
export type Answers = Partial<Record<ManualRow, Answer>>;
export type Tone = 'idle' | 'progress' | 'green' | 'amber' | 'red';

/** The design's verdict (passCheck, lines 1899–1965): any "no" → red; else any "not sure" →
 *  amber; else all five answered → green; else more than one answered → progress; else idle.
 *  The quota row is answered from the calculator, so `answered` starts at 1. */
export function passCheckVerdict(answers: Answers, quotaOk: boolean) {
  const value = (row: PassRow): Answer | null =>
    row === 'quota' ? (quotaOk ? 'yes' : 'no') : (answers[row] ?? null);
  const rows = PASS_CHECK_ROWS.map((row) => ({ row, v: value(row) }));
  const answered = rows.filter((r) => r.v !== null).length;
  const blockers = rows.filter((r) => r.v === 'no').map((r) => r.row);
  const unsure = rows.filter((r) => r.v === 'unsure').map((r) => r.row);
  const clear = rows.filter((r) => r.v === 'yes').length;
  const tone: Tone = blockers.length
    ? 'red'
    : unsure.length
      ? 'amber'
      : answered === rows.length
        ? 'green'
        : answered > 1
          ? 'progress'
          : 'idle';
  return {
    tone,
    clear,
    answered,
    unanswered: rows.length - answered,
    blockers,
    unsure,
    progressPct: Math.round((clear / rows.length) * 100),
    values: Object.fromEntries(rows.map((r) => [r.row, r.v])) as Record<PassRow, Answer | null>,
  };
}

export type PassRowView = {
  key: PassRow;
  n: number;
  title: string;
  body: string;
  fix: string;
  value: Answer | null;
  mark: string;
};

export type PassView = {
  rows: PassRowView[];
  tone: Tone;
  kicker: string;
  title: string;
  body: string;
  count: string;
  progressPct: number;
  fixes: { key: PassRow; text: string; unsure: boolean }[];
  quotaOk: boolean;
  manualAnswered: boolean;
  whatsappText: string;
};

export function computePassView({
  answers,
  inputs,
  roles,
  rateConfig,
  locale,
  roleLabels,
  labels,
  copy,
}: {
  answers: Answers;
  inputs: EstimateInputs;
  roles: readonly DesignRole[];
  rateConfig: RateConfig;
  locale: Locale;
  roleLabels: Record<string, string>;
  labels: PassLabels;
  copy: PassCopy;
}): PassView {
  const role = resolveRole(roles, inputs.roleKey);
  const roleLabel = roleLabels[role.key] ?? role.key;
  const n = (v: number) => formatInt(v, locale);
  const ratio = rateConfig.quotaRatio;
  const quota = quotaCheck(inputs.turkishStaff, inputs.headcount, ratio);
  const need = turkishStaffRequired(inputs.headcount, ratio);
  // W144: the legal floor, never the (band-clamped) salary the estimate uses
  const amount = formatTRY(salaryFloor(role, rateConfig), locale);
  const text: Record<PassRow, { title: string; body: string; fix: string }> = {
    capital: { title: labels.ckCapT, body: labels.ckCapB, fix: labels.ckCapF },
    quota: {
      title: labels.ckQuoT,
      body: quota.allowed
        ? copy.quotaOk(n(inputs.turkishStaff), n(quota.maxForeign), n(inputs.headcount))
        : copy.quotaNo(n(inputs.headcount), n(need), n(inputs.turkishStaff)),
      fix: copy.quotaFix(n(need), n(inputs.headcount)),
    },
    sgk: { title: labels.ckSgkT, body: labels.ckSgkB, fix: labels.ckSgkF },
    salary: {
      title: labels.ckSalT,
      body: copy.salary(roleLabel, amount, multiplierNumber(role.multiplier, locale)),
      fix: copy.salaryFix(amount),
    },
    docs: { title: labels.ckDocT, body: labels.ckDocB, fix: labels.ckDocF },
  };
  const verdict = passCheckVerdict(answers, quota.allowed);
  const rows: PassRowView[] = PASS_CHECK_ROWS.map((key, i) => {
    const value = verdict.values[key];
    const mark = value === 'yes' ? '✓' : value === 'no' ? '!' : value === 'unsure' ? '?' : String(i + 1);
    return { key, n: i + 1, ...text[key], value, mark };
  });
  const tone = verdict.tone;
  const kicker = tone === 'idle' ? labels.vIdleK : tone === 'progress' ? labels.vProgK : labels.vRes;
  const title =
    tone === 'idle'
      ? labels.vIdleT
      : tone === 'progress'
        ? labels.vProgT
        : tone === 'green'
          ? labels.vGreenT
          : tone === 'amber'
            ? verdict.unsure.length === 1
              ? labels.vAmber1
              : copy.amberN(verdict.unsure.length)
            : verdict.blockers.length === 1
              ? labels.vRed1
              : copy.redN(verdict.blockers.length);
  const body = {
    idle: labels.vIdleB,
    progress: labels.vProgB,
    green: labels.vGreenB,
    amber: labels.vAmberB,
    red: labels.vRedB,
  }[tone];
  const fixes = [
    ...verdict.blockers.map((key) => ({ key, text: text[key].fix, unsure: false })),
    ...verdict.unsure.map((key) => ({
      key,
      text: joinText([labels.pcConfirm, text[key].fix]),
      unsure: true,
    })),
  ];
  const word = (v: Answer | null) =>
    v === 'yes' ? labels.pcYes : v === 'no' ? labels.pcNo : v === 'unsure' ? labels.pcMaybe : copy.unanswered();
  const summary = rows.map((r) => `${r.n}. ${r.title} — ${word(r.value)}`).join('\n');
  return {
    rows,
    tone,
    kicker,
    title,
    body,
    count: copy.count(verdict.clear, PASS_CHECK_ROWS.length, verdict.unanswered),
    progressPct: verdict.progressPct,
    fixes,
    quotaOk: quota.allowed,
    manualAnswered: MANUAL_ROWS.some((r) => answers[r] !== undefined),
    // W95: this text holds the visitor's answers — it only ever reaches a click-time window.open
    whatsappText: copy.whatsapp(roleLabel, inputs.headcount, n(inputs.turkishStaff), summary),
  };
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/salary-guide.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import { employerMonthlyCost, salaryRange, type RateConfig, type SgkTier } from '@/lib/calculator';
import { formatTRY } from '@/lib/format/money';
import type { DesignRole } from './card-view';

/** The design's bar scale: 30,000 → the highest band maximum (line 2586). */
export const GUIDE_SCALE_MIN = 30000;
export const guideScaleMax = (roles: readonly DesignRole[]) =>
  Math.max(GUIDE_SCALE_MIN + 1, ...roles.map((r) => r.salaryMax));

/** W144(a): snap to the model's 4-decimal precision before the one rounding formatTRY does, so
 *  an exact half-lira product never rounds the wrong way under float noise. */
const snap4 = (v: number) => Math.round(v * 1e4) / 1e4;

export type GuideRow = {
  key: string;
  role: string;
  industry: DesignRole['industry'];
  industryLabel: string;
  range: string;
  employer: string;
  tier: string;
  skilled: boolean;
  barLeftPct: number;
  barWidthPct: number;
  tickPct: number;
};

/** One card per design role. The low is the model's exact floor (W2; the design reuses its
 *  rounded 50,000) and the employer cost follows the tier chosen in the calculator (W59; the
 *  design fixes 1.2175). Every string is formatted here, once (D18). */
export function buildGuideRows({
  roles,
  rateConfig,
  tier,
  locale,
  roleLabels,
  industryLabels,
  labels,
}: {
  roles: readonly DesignRole[];
  rateConfig: RateConfig;
  tier: SgkTier;
  locale: Locale;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  labels: { skilled: string; standard: string };
}): GuideRow[] {
  const max = guideScaleMax(roles);
  const pct = (v: number) =>
    Math.max(0, Math.min(100, ((v - GUIDE_SCALE_MIN) / (max - GUIDE_SCALE_MIN)) * 100));
  const lira = (v: number) => formatTRY(snap4(v), locale);
  return roles.map((r) => {
    const range = salaryRange(r, rateConfig);
    const hi = range.max ?? range.min;
    const left = pct(range.min);
    return {
      key: r.key,
      role: roleLabels[r.key] ?? r.key,
      industry: r.industry,
      industryLabel: industryLabels[r.industry] ?? r.industry,
      range: `${lira(range.min)} – ${lira(hi)}`,
      employer: `${lira(employerMonthlyCost(range.min, rateConfig, tier))} – ${lira(employerMonthlyCost(hi, rateConfig, tier))}`,
      tier: r.multiplier > 1 ? labels.skilled : labels.standard,
      skilled: r.multiplier > 1,
      barLeftPct: left,
      barWidthPct: Math.max(4, pct(hi) - left),
      tickPct: pct(rateConfig.legalMinGross),
    };
  });
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hiring-cost-calculator/_lib"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `views.test.ts` 18 green; `src/lib/calculator/__tests__/purity.test.ts` still green (only a `.test.ts` file imports `copy-deltas.ts`).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator/_lib"
git commit -m "feat(calc): card, quota, pass-check and salary-guide view models on the W2 engine

One computeCardView renders skeleton and island alike; the slider moves over a stop list
from the exact floor to the band max; the pass check reads salaryFloor (W144); the guide's
employer cost follows the chosen tier (W59); every figure is pinned to COPY_DELTAS (W142).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — the written-quote form (W3): the wire mapping, the server action, the stores, the lazy quote sheet, `CLIENT_SYS`

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/__tests__/quote.test.ts`:

```ts
import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import tr from '@/messages/tr.json';
import { ESTIMATE_FIELDS } from '../estimate-inputs';
import { CALCULATOR_FIELD_NAMES, quoteSchema, toCalculatorFields } from '../quote';

const sys = createTranslator({ locale: 'tr', messages: tr as Messages, namespace: 'sys' });
const t = (id: string) => `<${id}>`;
const ctx = { locale: 'tr' as const, roles: ROLES, rateConfig: RATE, t, sys };

describe('quoteSchema', () => {
  it('requires name and e-mail; an empty e-mail reads "required", not "email"', () => {
    const r = quoteSchema.safeParse({ name: '', email: '' });
    expect(r.success).toBe(false);
    expect(fieldErrorsFromIssues(r.success ? [] : r.error.issues)).toEqual({
      name: 'required',
      email: 'required',
    });
  });
  it('accepts the optional fields empty; refuses a phone under 8 digits and a non-ISO country', () => {
    expect(
      quoteSchema.safeParse({ name: 'Ayşe', email: 'a@b.co', phone: '', company: '', country: '' })
        .success,
    ).toBe(true);
    const bad = quoteSchema.safeParse({ name: 'Ayşe', email: 'a@b.co', phone: '12 34', country: 'Turkey' });
    expect(fieldErrorsFromIssues(bad.success ? [] : bad.error.issues)).toEqual({
      phone: 'phone',
      country: 'invalid',
    });
  });
});

describe('toCalculatorFields — the catalog names, keys on the wire (W77), the summary recomputed', () => {
  it('sends exactly the ten catalog names; trade is the role KEY; the summary is the model’s', () => {
    const fields = toCalculatorFields(
      quoteSchema.parse({
        name: 'Ayşe Demir',
        email: 'AYSE@example.com ',
        phone: '+90 501 000 00 00',
        company: 'Demir Tekstil',
        country: 'tr',
        message: 'Antalya',
      }),
      ctx,
    );
    expect(Object.keys(fields).sort()).toEqual([...CALCULATOR_FIELD_NAMES].sort());
    expect(fields).toMatchObject({
      name: 'Ayşe Demir',
      email: 'AYSE@example.com',
      phone: '+90 501 000 00 00',
      company: 'Demir Tekstil',
      country: 'TR',
      headcount: '1',
      trade: 'welder',
      durationMonths: '12',
      message: 'Antalya',
    });
    // the label rides only inside the free-text summary, beside the key
    expect(fields.estimateSummary).toContain('<calc.012>: <calc.555> (welder)');
    // COPY_DELTAS model figures: 49,545 × 1.2175 = 60,321.04; × 12 + 28,000 = 751,852.45
    expect(fields.estimateSummary).toContain('<calc.028>: 60.321 ₺');
    expect(fields.estimateSummary).toContain('<calc.469>: 751.852 ₺');
    expect(fields.estimateSummary).toContain('<calc.016>: <calc.017>');
    expect(fields.estimateSummary).toContain('Oran sürümü: 2026-01');
    expect(fields.estimateSummary.length).toBeLessThanOrEqual(2000);
  });
  it('recomputes from the est_* inputs — a client total is never forwarded', () => {
    const fields = toCalculatorFields(
      quoteSchema.parse({
        name: 'A',
        email: 'a@b.co',
        [ESTIMATE_FIELDS.role]: 'cook',
        [ESTIMATE_FIELDS.headcount]: '5',
        [ESTIMATE_FIELDS.months]: '6',
        [ESTIMATE_FIELDS.salary]: '10',
        [ESTIMATE_FIELDS.tier]: 'manufacturing',
        [ESTIMATE_FIELDS.support]: '1',
      }),
      ctx,
    );
    expect(fields).toMatchObject({ headcount: '5', trade: 'cook', durationMonths: '6' });
    expect(fields.estimateSummary).toContain('<calc.015>: 50.000 ₺ <calc.464>'); // the band floor, not 10
    expect(fields.estimateSummary).toContain('<calc.022>: <calc.466> (%18,75)');
    expect(fields.estimateSummary).toContain('6 aylık sezon toplamı: ');
    expect(fields.estimateSummary).toContain('<calc.020>');
  });
  it('sends no estimate when the bundle has no design role (the page shows its empty state)', () => {
    const fields = toCalculatorFields(quoteSchema.parse({ name: 'A', email: 'a@b.co' }), {
      ...ctx,
      roles: [],
    });
    expect(fields).toMatchObject({ trade: '', headcount: '', durationMonths: '', estimateSummary: '' });
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/__tests__/actions.test.ts`:

```ts
import type { Messages } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { IDLE_FORM_STATE } from '@/forms/types';
import { submitCalculatorQuote } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each
// is a recorded stub (the pattern of src/forms/__tests__/action.test.ts and T2's actions test).
// `postForm` is the door, stubbed door-less (`unauthorized` — every face but staging/production,
// W92); `getBundle` reads the real LOCAL bundle; `getTranslations` is a real next-intl translator.
const mocks = vi.hoisted(() => ({
  getLocale: vi.fn(async (): Promise<string> => 'tr'),
  headersStore: new Map<string, string>(),
  redirect: vi.fn((args: unknown): never => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT', args });
  }),
  postForm: vi.fn(),
}));

vi.mock('next-intl/server', async () => {
  const { createTranslator } = await import('next-intl');
  const tr = (await import('@/messages/tr.json')).default as Messages;
  const en = (await import('@/messages/en.json')).default as Messages;
  return {
    getLocale: mocks.getLocale,
    getTranslations: async ({ locale }: { locale: 'tr' | 'en' }) =>
      createTranslator({ locale, messages: locale === 'tr' ? tr : en, namespace: 'sys' }),
  };
});
vi.mock('next/headers', () => ({
  headers: async () => ({ get: (k: string) => mocks.headersStore.get(k.toLowerCase()) ?? null }),
}));
vi.mock('@/i18n/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/forms/post', () => ({ postForm: mocks.postForm }));
vi.mock('@/content/adapter', async () => {
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { BundleSchema } = await import('../../../../../../contract/website-bundle.v1');
  const pure = await import('@/content/pure');
  return {
    ...pure,
    getBundle: async (locale: string) =>
      BundleSchema.parse(
        JSON.parse(
          readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
        ),
      ),
  };
});

/** The Operations catalog's `calculator` field names (v1.0; no v1.1 field applies). The door
 *  silently DROPS any other name inside `fields`. */
const CALCULATOR_CATALOG = [
  'name',
  'email',
  'phone',
  'company',
  'country',
  'headcount',
  'trade',
  'durationMonths',
  'estimateSummary',
  'message',
];

type Envelope = { locale: string; consentVersion: string; sourcePath?: string; fields: Record<string, string> };
function sent(): { key: string; envelope: Envelope } {
  expect(mocks.postForm).toHaveBeenCalledTimes(1);
  const [key, envelope] = mocks.postForm.mock.calls[0] as [string, Envelope];
  return { key, envelope };
}
function formData(entries: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.append(k, v);
  return fd;
}

const valid = {
  name: 'Ayşe Demir',
  email: 'ayse@acme.example',
  phone: '0532 000 00 00',
  company: 'Acme',
  country: 'TR',
  message: '',
  consent: 'on',
  honeypot: '',
  est_role: 'electrician',
  est_headcount: '4',
  est_months: '9',
  est_salary: '',
  est_tier: 'other',
  est_flight: '1',
  est_housing: '0',
  est_support: '0',
  est_turkishStaff: '30',
};

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/maliyet-hesaplayici');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
});

describe('submitCalculatorQuote → the calculator door (W3)', () => {
  it('sends catalog names only, the role key as trade, the server-recomputed summary; no door → fallback', async () => {
    const state = await submitCalculatorQuote(IDLE_FORM_STATE, formData(valid));
    const { key, envelope } = sent();
    expect(key).toBe('calculator');
    expect(envelope).toMatchObject({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/maliyet-hesaplayici',
    });
    // empty values (the message here) never travel (buildEnvelope)
    expect(Object.keys(envelope.fields).sort()).toEqual(
      ['company', 'country', 'durationMonths', 'email', 'estimateSummary', 'headcount', 'name', 'phone', 'trade'],
    );
    for (const name of Object.keys(envelope.fields)) expect(CALCULATOR_CATALOG).toContain(name);
    expect(envelope.fields).toMatchObject({
      name: 'Ayşe Demir',
      email: 'ayse@acme.example',
      phone: '0532 000 00 00',
      company: 'Acme',
      country: 'TR',
      headcount: '4',
      trade: 'electrician',
      durationMonths: '9',
    });
    expect(envelope.fields.estimateSummary).toContain('Elektrikçi (electrician)');
    expect(envelope.fields.estimateSummary).toContain('9 aylık sezon toplamı: ');
    expect(state).toMatchObject({ status: 'error', result: { kind: 'unauthorized' } });
  });

  it('writes the summary in the request locale', async () => {
    mocks.getLocale.mockResolvedValue('en');
    await submitCalculatorQuote(IDLE_FORM_STATE, formData(valid));
    const { envelope } = sent();
    expect(envelope.locale).toBe('en');
    expect(envelope.fields.estimateSummary).toContain('Electrician (electrician)');
    expect(envelope.fields.estimateSummary).toContain('9-month season total: ');
  });

  it('refuses a submit without the consent tick (W79) or the e-mail, and posts nothing', async () => {
    expect(await submitCalculatorQuote(IDLE_FORM_STATE, formData({ ...valid, consent: '' }))).toMatchObject({
      status: 'fieldErrors',
      errors: { consent: 'consent' },
    });
    expect(await submitCalculatorQuote(IDLE_FORM_STATE, formData({ ...valid, email: '' }))).toMatchObject({
      status: 'fieldErrors',
      errors: { email: 'required' },
    });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('navigates to /thank-you?form=calculator when the door accepts (D13)', async () => {
    mocks.postForm.mockResolvedValue({
      kind: 'ok',
      id: 'sub_1',
      status: 'RECEIVED',
      isTest: false,
      replayed: false,
      captchaDegraded: false,
      error: null,
    });
    await expect(submitCalculatorQuote(IDLE_FORM_STATE, formData(valid))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'calculator' } },
      locale: 'tr',
    });
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/__tests__/QuoteSheet.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { designRoles, roleLabelMaps } from '../../_lib/card-view';
import { ESTIMATE_FIELDS } from '../../_lib/estimate-inputs';
import { RECAP_IDS, SHEET_IDS, pickLabels } from '../../_lib/ids';
import {
  getEstimateInputs,
  resetEstimateInputs,
  setEstimateInputs,
  subscribeEstimate,
} from '../estimate-store';
import { QuoteButton } from '../QuoteButton';
import { QuoteSheetHost } from '../QuoteSheetHost';
import { resetQuote } from '../quote-store';

const asId = (id: string) => id;
const ROLES_D = designRoles(ROLES);
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, asId);
const hostProps = (action: (p: FormActionState, d: FormData) => Promise<FormActionState>) => ({
  action,
  locale: 'tr' as const,
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  contact: { phone: '+905011240340', email: 'info@jobsadmire.com' },
  countries: [{ value: 'TR', label: 'Türkiye' }],
  roles: ROLES_D,
  rateConfig: RATE,
  roleLabels,
  industryLabels,
  cardLabels: { perWorker: 'işçi başına', fullYear: 'Tam yıl', firstYear: 'İlk yıl toplamı', perMonthSuffix: '/ ay' },
  recapLabels: pickLabels(asId, RECAP_IDS),
  labels: { ...pickLabels(asId, SHEET_IDS), close: 'Kapat' },
  loadingLabel: 'Açılıyor…',
});

afterEach(() => {
  resetEstimateInputs();
  resetQuote();
});

describe('the estimate store', () => {
  it('clamps patches and notifies subscribers once per set', () => {
    let calls = 0;
    const off = subscribeEstimate(() => (calls += 1));
    setEstimateInputs({ headcount: 9999, turkishStaff: -3, months: 9 });
    expect(getEstimateInputs()).toMatchObject({ headcount: 500, turkishStaff: 0, months: 9, roleKey: 'welder' });
    expect(calls).toBe(1);
    off();
    setEstimateInputs({ headcount: 2 });
    expect(calls).toBe(1);
  });
});

describe('the quote sheet (W3)', () => {
  it('stays unmounted until a quote button asks, then shows the recap, the form and the hidden estimate', async () => {
    setEstimateInputs({ roleKey: 'cook', headcount: 5 });
    const action = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
    renderWithIntl(
      <>
        <QuoteButton label="Teklif" testId="open" />
        <QuoteSheetHost {...hostProps(action)} />
      </>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(screen.getByTestId('open'));
    const dialog = await screen.findByRole('dialog');
    // cook × 5 at the band floor 50,000: 5 × 60,875 = 304,375 a month
    expect(within(dialog).getByTestId('recap-card')).toHaveTextContent('304.375 ₺');
    expect(within(dialog).getByText(tr.sys.calc.quote.attached)).toBeInTheDocument();
    const form = within(dialog).getByTestId('calc-quote-form');
    expect(form).toHaveAttribute('data-form-key', 'calculator');
    const hidden = (name: string) => form.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value;
    expect(hidden(ESTIMATE_FIELDS.role)).toBe('cook');
    expect(hidden(ESTIMATE_FIELDS.headcount)).toBe('5');
    expect(within(form).getByRole('checkbox')).toHaveAttribute('name', 'consent'); // W79
    expect(within(form).getByRole('combobox')).toHaveAttribute('name', 'country');
  });

  it('the fallback panel carries the estimate in its click-time WhatsApp text, never in the href (W76/W95)', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    Object.defineProperty(navigator, 'sendBeacon', { value: vi.fn(() => true), configurable: true, writable: true });
    const action = vi.fn(
      async (_prev: FormActionState, data: FormData): Promise<FormActionState> => ({
        status: 'error',
        result: { kind: 'unauthorized' },
        values: { name: String(data.get('name')) },
      }),
    );
    renderWithIntl(
      <>
        <QuoteButton label="Teklif" testId="open" />
        <QuoteSheetHost {...hostProps(action)} />
      </>,
    );
    await userEvent.click(screen.getByTestId('open'));
    const dialog = await screen.findByRole('dialog');
    await userEvent.type(within(dialog).getByLabelText(`${tr.sys.form.labels.name} *`), 'Ayşe');
    await userEvent.click(within(dialog).getByRole('checkbox'));
    await userEvent.click(within(dialog).getByRole('button', { name: 'calc.105' }));
    const panel = await within(dialog).findByTestId('form-fallback');
    expect(panel).toHaveAttribute('data-kind', 'unauthorized');
    const wa = within(panel).getByRole('link', { name: tr.sys.form.fallback.whatsapp });
    expect(wa).toHaveAttribute('href', 'https://wa.me/905011240340');
    await userEvent.click(wa);
    const text = decodeURIComponent(String(open.mock.calls[0][0]).split('?text=')[1]);
    expect(text.startsWith('Merhaba JobsAdmire, maliyet hesaplayıcıyı kullandım: 1 × calc.555, brüt 49.545 ₺, 12 aylık sözleşme.')).toBe(true);
    expect(text).toContain('Ayşe');
    open.mockRestore();
    Reflect.deleteProperty(navigator, 'sendBeacon');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hiring-cost-calculator
```
Expected: FAIL — `Failed to resolve import "../quote"`, `"../actions"`, `"../estimate-store"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hiring-cost-calculator/_lib/quote.ts`:

```ts
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';
import {
  estimate,
  formatEstimate,
  sgkRateLabel,
  type CalculatorRole,
  type RateConfig,
  type SgkTier,
} from '@/lib/calculator';
import { designRoles, resolveRole } from './card-view';
import { makeCardCopy, type SysT } from './copy';
import { ESTIMATE_FIELDS, parseEstimateFields, type EstimateInputs } from './estimate-inputs';

const hidden = z.string().max(40).optional();
/** ≥ 8 digits — the door's phone rule, checked here so a short number is a field error, not a 400. */
const PHONE = /(?:\D*\d){8}/;

/** The quote form. `.min(1)` before `.email()` so an empty e-mail reads `required` (kernel rule);
 *  the kernel trims every string before this parses; the `est_*` hidden inputs ride along and
 *  are turned into catalog fields only by `toCalculatorFields`. */
export const quoteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().min(1).max(254).email(),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === '' || PHONE.test(v), { message: 'phone' })
    .optional(),
  company: z.string().trim().max(200).optional(),
  country: z
    .string()
    .trim()
    .refine((v) => v === '' || /^[A-Za-z]{2}$/.test(v), { message: 'invalid' })
    .optional(),
  message: z.string().trim().max(5000).optional(),
  [ESTIMATE_FIELDS.role]: hidden,
  [ESTIMATE_FIELDS.headcount]: hidden,
  [ESTIMATE_FIELDS.months]: hidden,
  [ESTIMATE_FIELDS.salary]: hidden,
  [ESTIMATE_FIELDS.tier]: hidden,
  [ESTIMATE_FIELDS.flight]: hidden,
  [ESTIMATE_FIELDS.housing]: hidden,
  [ESTIMATE_FIELDS.support]: hidden,
  [ESTIMATE_FIELDS.turkishStaff]: hidden,
});
export type QuoteInput = z.infer<typeof quoteSchema>;

/** The Operations catalog's `calculator` field names (v1.0) — the only keys this form sends. */
export const CALCULATOR_FIELD_NAMES = [
  'name',
  'email',
  'phone',
  'company',
  'country',
  'headcount',
  'trade',
  'durationMonths',
  'estimateSummary',
  'message',
] as const;
export type CalculatorField = (typeof CALCULATOR_FIELD_NAMES)[number];
export const ESTIMATE_SUMMARY_MAX = 2000;

export type QuoteContext = {
  locale: Locale;
  roles: readonly CalculatorRole[];
  rateConfig: RateConfig;
  /** `makeTf(bundle, locale)` */
  t: (id: string) => string;
  /** the request locale's `sys` translator */
  sys: SysT;
};

const TIER_LABEL_ID: Record<SgkTier, string> = {
  manufacturing: 'calc.466',
  other: 'calc.467',
  none: 'calc.468',
};

/** The estimate as the inbox reader sees it — recomputed HERE from the posted inputs through
 *  the one engine (a client total is never forwarded as fact), labelled in the request locale
 *  with the package's own labels, the role key beside its label (W77). `null` without roles. */
export function buildEstimateSummary(inputs: EstimateInputs, ctx: QuoteContext) {
  const roles = designRoles(ctx.roles);
  if (roles.length === 0) return null;
  const { locale, rateConfig, t, sys } = ctx;
  const role = resolveRole(roles, inputs.roleKey);
  const est = estimate(
    {
      role,
      headcount: inputs.headcount,
      months: inputs.months,
      grossSalary: inputs.grossSalary,
      sgkTier: inputs.sgkTier,
      flight: inputs.flight,
      housing: inputs.housing,
      supportOptIn: inputs.supportOptIn,
    },
    rateConfig,
  );
  const f = formatEstimate(est, locale);
  const copy = makeCardCopy(sys);
  const months = inputs.months;
  const tier = est.input.sgkTier;
  const covered =
    [inputs.flight && t('calc.017'), inputs.housing && t('calc.018'), inputs.supportOptIn && t('calc.020')]
      .filter(Boolean)
      .join(' · ') || sys('calc.summary.none');
  const lines = [
    `${t('calc.012')}: ${t(role.labelId)} (${role.key})`,
    `${t('calc.013')}: ${est.input.headcount}`,
    `${t('calc.014')}: ${months === 12 ? t('calc.470') : copy.nMonths(months)}`,
    `${t('calc.015')}: ${f.grossSalary} ${t('calc.464')}`,
    `${t('calc.022')}: ${t(TIER_LABEL_ID[tier])} (${sgkRateLabel(rateConfig, tier, locale)})`,
    `${t('calc.016')}: ${covered}`,
    `${t('calc.142')}: ${inputs.turkishStaff}`,
    `${t('calc.028')}: ${f.monthly.total}`,
    `${t('calc.034')}: ${f.oneOff.total}`,
    `${months === 12 ? t('calc.469') : copy.seasonTotal(months)}: ${f.contract.total} (${f.contract.perWorkerPerMonth} ${t('calc.463')} ${t('calc.464')})`,
    `${sys('calc.summary.rates')}: ${rateConfig.version}`,
  ];
  return {
    summary: lines.join('\n').slice(0, ESTIMATE_SUMMARY_MAX),
    role,
    months,
    headcount: est.input.headcount,
  };
}

/** Exact catalog names and stable values (W3/W77): ISO-2 upper-case, `trade` = the role KEY,
 *  integers as strings. Empty strings are dropped by `buildEnvelope`, never sent. */
export function toCalculatorFields(p: QuoteInput, ctx: QuoteContext): Record<CalculatorField, string> {
  const est = buildEstimateSummary(parseEstimateFields(p as Record<string, unknown>), ctx);
  return {
    name: p.name,
    email: p.email,
    phone: p.phone ?? '',
    company: p.company ?? '',
    country: (p.country ?? '').toUpperCase(),
    headcount: est ? String(est.headcount) : '',
    trade: est ? est.role.key : '',
    durationMonths: est ? String(est.months) : '',
    estimateSummary: est ? est.summary : '',
    message: p.message ?? '',
  };
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/actions.ts`:

```ts
'use server';
import { getTranslations } from 'next-intl/server';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection, getRateConfig } from '@/content/collections';
import { createFormAction, type FormActionState } from '@/forms/action';
import { quoteSchema, toCalculatorFields } from './_lib/quote';

/** W3: the one written-quote door. The kernel validates (consent checkbox, W79), wraps the
 *  envelope and redirects to /thank-you?form=calculator (D13); `toFields` maps the parsed form
 *  onto the catalog's ten `calculator` names and rebuilds `estimateSummary` from the `est_*`
 *  inputs in the request locale (`ctx.locale`). */
const run = createFormAction({
  key: 'calculator',
  schema: quoteSchema,
  consent: 'checkbox',
  toFields: async (parsed, _data, { locale }) => {
    const [bundle, translate] = await Promise.all([
      getBundle(locale),
      getTranslations({ locale, namespace: 'sys' }),
    ]);
    return toCalculatorFields(parsed, {
      locale,
      roles: getCollection(bundle, 'calculatorRoles'),
      rateConfig: getRateConfig(bundle),
      t: makeTf(bundle, locale),
      sys: (key, values) => translate(key, values),
    });
  },
});

export async function submitCalculatorQuote(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return run(prev, data);
}
```

A `'use server'` module may export only async functions: the factory stays a module-private constant.

`src/app/[locale]/(site)/hiring-cost-calculator/_components/estimate-store.ts`:

```ts
import { useSyncExternalStore } from 'react';
import { DEFAULT_INPUTS, sanitizeInputs, type EstimateInputs } from '../_lib/estimate-inputs';

/**
 * The page's one piece of shared client state: the calculator writes it; the quota gate, the
 * pass check, the salary guide, the recap, `LiveSgkRate` and the quote form's hidden inputs read
 * it. Module-level on purpose — every island mounts on its own trigger (W13 amended), so no React
 * context can span them. No directive: only `'use client'` modules import this (a server
 * component importing `useSyncExternalStore` fails `next build`). The server snapshot is the
 * defaults — exactly what the server fallbacks render — so hydration never mismatches (R18/R27).
 */
let state: EstimateInputs = DEFAULT_INPUTS;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function getEstimateInputs(): EstimateInputs {
  return state;
}
export function setEstimateInputs(patch: Partial<EstimateInputs>): void {
  state = sanitizeInputs({ ...state, ...patch });
  notify();
}
/** Tests only. */
export function resetEstimateInputs(): void {
  state = DEFAULT_INPUTS;
  notify();
}
export function subscribeEstimate(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const serverSnapshot = () => DEFAULT_INPUTS;
export function useEstimateInputs(): EstimateInputs {
  return useSyncExternalStore(subscribeEstimate, getEstimateInputs, serverSnapshot);
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/quote-store.ts`:

```ts
import { useSyncExternalStore } from 'react';

type QuoteState = { open: boolean; requested: boolean };
const CLOSED: QuoteState = { open: false, requested: false };
let state: QuoteState = CLOSED;
const listeners = new Set<() => void>();
const set = (next: QuoteState) => {
  state = next;
  listeners.forEach((l) => l());
};

/** The sheet's chunk (the forms kernel + BottomSheet, W13 amended): fetched on the first
 *  hover/focus of any quote button, awaited by `QuoteSheetHost` on the first open. */
export const loadQuoteSheet = () => import('./QuoteSheet');
export function prefetchQuoteSheet(): void {
  loadQuoteSheet().catch(() => undefined); // the host reports a failed load
}
export function openQuote(): void {
  set({ open: true, requested: true });
}
export function closeQuote(): void {
  if (state.open) set({ open: false, requested: true });
}
/** Tests only. */
export function resetQuote(): void {
  set(CLOSED);
}
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const snapshot = () => state;
const serverSnapshot = () => CLOSED;
export function useQuoteState(): QuoteState {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/QuoteButton.tsx`:

```tsx
'use client';
import { buttonClassName, type ButtonVariant } from '@/design/primitives/Button';
import { openQuote, prefetchQuoteSheet } from './quote-store';

/** One of the page's written-quote CTAs (`calc.011`, `calc.036`, `calc.105` — W3). A button, not
 *  a link: the form is a dialog; hovering or focusing it prefetches the sheet's chunk. `className`
 *  is for layout only (`w-full`, `flex-1`) — a different face is a variant (W122). */
export function QuoteButton({
  label,
  variant = 'primary',
  size = 'md',
  className,
  testId,
}: {
  label: string;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  className?: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      data-testid={testId}
      onClick={openQuote}
      onPointerEnter={prefetchQuoteSheet}
      onFocus={prefetchQuoteSheet}
      className={buttonClassName(variant, size, className)}
    >
      {label}
    </button>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/RecapCard.tsx`:

```tsx
import type { CardView } from '../_lib/card-view';
import type { RecapLabels } from '../_lib/ids';

/** The design's phone recap (#calc-cta .ja-cta-mob, lines 1538–1545) — also the quote sheet's
 *  header, so the visitor sees the estimate the form sends. Presentational, no directive. */
export function RecapCard({
  view,
  labels,
  className,
}: {
  view: CardView;
  labels: RecapLabels;
  className?: string;
}) {
  return (
    <div
      data-testid="recap-card"
      className={['rounded-sm bg-navy p-[15px] text-left text-white', className].filter(Boolean).join(' ')}
    >
      <p className="m-0 mb-2 text-[11px] font-extrabold uppercase tracking-[1.1px] text-sky">
        {labels.zEst}
      </p>
      <div className="flex items-baseline justify-between gap-3 border-b border-white/15 pb-2">
        <span className="min-w-0 text-body-sm font-bold text-white/80">
          {view.totalTitle} · {view.headcountNote}
        </span>
        <span data-testid="recap-total" className="text-[21px] font-extrabold tracking-[-0.5px]">
          {view.f.contract.total}
        </span>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="text-body-sm font-bold text-white/80">{labels.zRough}</span>
        <span className="text-body font-extrabold text-sky">
          {view.f.monthly.total} {labels.perMonthSuffix}
        </span>
      </div>
      <p className="m-0 mt-2 border-t border-white/15 pt-2 text-body-sm text-white/80">{labels.zFee}</p>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateFields.tsx`:

```tsx
'use client';
import { estimateFieldValues } from '../_lib/estimate-inputs';
import { useEstimateInputs } from './estimate-store';

/** The store's state as hidden inputs inside the quote form — the server action reparses and
 *  recomputes them (`_lib/quote.ts`). The `est_*` names are no catalog names and are not in the
 *  fallback panel's WhatsApp field list, so they never reach a prefill. */
export function EstimateFields() {
  const inputs = useEstimateInputs();
  return (
    <>
      {estimateFieldValues(inputs).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} readOnly />
      ))}
    </>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/QuoteSheet.tsx`:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { BottomSheet } from '@/design/islands/BottomSheet';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import { computeCardView, type CardViewLabels, type DesignRole } from '../_lib/card-view';
import { makeCardCopy } from '../_lib/copy';
import type { RecapLabels, SheetLabels } from '../_lib/ids';
import { EstimateFields } from './EstimateFields';
import { useEstimateInputs } from './estimate-store';
import { RecapCard } from './RecapCard';

export type QuoteSheetProps = {
  open: boolean;
  onClose: () => void;
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
  locale: Locale;
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  contact: { phone: string; phoneDisplay?: string; email: string };
  countries: FieldOption[];
  roles: DesignRole[];
  rateConfig: RateConfig;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  cardLabels: CardViewLabels;
  recapLabels: RecapLabels;
  labels: SheetLabels & { close: string };
};

/** The written-quote form (W3) in a bottom sheet — its own chunk, loaded on the first quote
 *  click (W13 amended; the WP2a final review asked for exactly this). The design has no form, so
 *  every label is the kernel's `sys.form.labels.*` (W115); `name`/`email` are the door's required
 *  pair; the estimate travels as `est_*` hidden inputs and is rebuilt on the server; the fallback
 *  panel's WhatsApp prefill opens with the estimate (`whatsappIntro`, composed on click — W76). */
export function QuoteSheet({
  open,
  onClose,
  action,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  contact,
  countries,
  roles,
  rateConfig,
  roleLabels,
  industryLabels,
  cardLabels,
  recapLabels,
  labels,
}: QuoteSheetProps) {
  const sys = useTranslations('sys');
  const inputs = useEstimateInputs();
  const view =
    roles.length > 0
      ? computeCardView({
          inputs,
          roles,
          rateConfig,
          locale,
          roleLabels,
          industryLabels,
          labels: cardLabels,
          copy: makeCardCopy(sys),
        })
      : null;
  return (
    <BottomSheet open={open} onClose={onClose} title={labels.title} closeLabel={labels.close}>
      <p className="m-0 mb-4 text-body-sm text-text-secondary">{labels.intro}</p>
      {view ? (
        <>
          <RecapCard view={view} labels={recapLabels} />
          <p className="m-0 mt-2 mb-4 text-body-sm text-text-tertiary">{sys('calc.quote.attached')}</p>
        </>
      ) : null}
      <FormShell
        action={action}
        formKey="calculator"
        idScope="calc-quote"
        locale={locale}
        turnstileSiteKey={turnstileSiteKey}
        whatsappNumber={whatsappNumber}
        whatsappIntro={view?.whatsappEstimate}
        contact={contact}
        submitLabel={labels.submit}
        consent="checkbox"
        headingLevel={3}
        testId="calc-quote-form"
      >
        <EstimateFields />
        <Field name="name" required autoComplete="name" />
        <Field name="email" type="email" required autoComplete="email" inputMode="email" />
        <Field name="phone" type="tel" autoComplete="tel" inputMode="tel" />
        <Field name="company" autoComplete="organization" />
        <Field name="country" as="select" autoComplete="country" options={countries} />
        <Field name="message" as="textarea" rows={3} />
      </FormShell>
    </BottomSheet>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/QuoteSheetHost.tsx`:

```tsx
'use client';
import { lazy, Suspense, type ComponentType } from 'react';
import { closeQuote, loadQuoteSheet, useQuoteState } from './quote-store';
import type { QuoteSheetProps } from './QuoteSheet';

type HostProps = Omit<QuoteSheetProps, 'open' | 'onClose'> & { loadingLabel: string };

const Unavailable: ComponentType<QuoteSheetProps> = () => null;
// Module scope: one lazy component for the page's life. A failed chunk (a deploy mid-visit)
// renders nothing instead of reaching the route's error boundary; logged outside production.
const QuoteSheet = lazy(() =>
  loadQuoteSheet()
    .then((m) => ({ default: m.QuoteSheet }))
    .catch((error: unknown) => {
      if (process.env.NODE_ENV !== 'production') console.error('QuoteSheet: chunk failed', error);
      return { default: Unavailable };
    }),
);

/** Mounted once, at the end of the page. Renders nothing — and ships no forms-kernel code — until
 *  a quote button asks for the sheet; from then on it stays mounted and follows the store. */
export function QuoteSheetHost({ loadingLabel, ...props }: HostProps) {
  const { open, requested } = useQuoteState();
  if (!requested) return null;
  return (
    <Suspense
      fallback={
        open ? (
          <p
            role="status"
            className="fixed inset-x-0 bottom-0 z-[100] m-0 bg-navy px-6 py-4 text-center text-body-sm font-bold text-white"
          >
            {loadingLabel}
          </p>
        ) : null
      }
    >
      <QuoteSheet {...props} open={open} onClose={closeQuote} />
    </Suspense>
  );
}
```

`src/i18n/client-messages.ts` — in `CLIENT_SYS`, append `'calc'`:

```ts
export const CLIENT_SYS = [
  'consent',
  'languageHint',
  'errorTitle',
  'errorRetry',
  'form',
  'calc',
] as const;
```

and extend its doc comment's list sentence ("…the error boundary's title/retry and the forms kernel.") with: "…the forms kernel, and the Cost Calculator's islands and quote sheet (`calc`, WP2b T3 — the live ICU templates need the client translator)." `client-messages.test.ts` needs no edit: it reads `CLIENT_SYS` itself, and `QuoteSheet`'s literal `sys('calc.quote.attached')` makes `calc` a namespace a client module reads (the two-way pin).

`docs/CONTENT-MODEL.md` — in the paragraph that begins "**Client subset (W90, an allowlist since W148).**", change the list "`CLIENT_SYS` = `consent`, `languageHint`, `errorTitle`, `errorRetry`, `form`" to "`CLIENT_SYS` = `consent`, `languageHint`, `errorTitle`, `errorRetry`, `form`, `calc`" and append to the same paragraph: "`calc` (WP2b T3) is the Cost Calculator's: its islands and quote sheet format ICU templates with live numbers on the client, so `sys.calc.*` rides every page's payload (≈ <n> B raw per locale — measure with `node -e "console.log(JSON.stringify(require('./src/messages/tr.json').sys.calc).length)"` and write the figure here); a page-level provider that scopes it to `/maliyet-hesaplayici` is a possible later optimisation, not a Phase A need." Append to the Cost Calculator bullet written in Cycle 1: "The islands and the quote sheet read them on the client — `calc` is in `CLIENT_SYS` (W148)."

`docs/ARCHITECTURE.md` — § Routing, in the route-group paragraph, change "the allowlist `CLIENT_SYS` = `consent`, `languageHint`, `errorTitle`, `errorRetry`, `form`" to "… `form`, `calc` (the Cost Calculator's islands, WP2b T3)".

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hiring-cost-calculator" src/i18n/client-messages.ts docs/CONTENT-MODEL.md docs/ARCHITECTURE.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `quote.test.ts` 5, `actions.test.ts` 4, `QuoteSheet.test.tsx` 3 green; `client-messages.test.ts` green with `calc` read by `QuoteSheet.tsx` and listed; `client-imports.test.ts` green (every import by path; the sheet is reached only through `import('./QuoteSheet')`); `class-collisions.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator" src/i18n/client-messages.ts docs/CONTENT-MODEL.md docs/ARCHITECTURE.md
git commit -m "feat(calc): the written-quote form — calculator door, server-rebuilt estimateSummary, lazy sheet

One form replaces the four written-quote links (W3): name*/email*/phone/company/country/message,
consent checkbox (W79), trade = role key (W77), estimateSummary recomputed in toFields from the
est_* inputs; the sheet and the forms kernel load on the first quote click (W13 amended); the
fallback's click-time WhatsApp opens with the estimate (W76/W95); calc joins CLIENT_SYS (W148).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — the calculator card: the shared presentational pieces, the server skeleton, the island, the interaction loader

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hiring-cost-calculator/_components/__tests__/CalculatorIsland.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTf } from '@/content/pure';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { renderWithIntl } from '@/test/render';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { designRoles, roleLabelMaps } from '../../_lib/card-view';
import { CARD_IDS, pickLabels } from '../../_lib/ids';
import { CalculatorIsland } from '../CalculatorIsland';
import { getEstimateInputs, resetEstimateInputs } from '../estimate-store';

const track = vi.fn();
vi.mock('@/analytics/track', () => ({ track: (...args: unknown[]) => track(...args) }));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/maliyet-hesaplayici',
}));

// R56: the generated TR bundle is read from disk, never imported.
const bundle = BundleSchema.parse(
  JSON.parse(readFileSync(join(process.cwd(), 'src', 'content', 'local', 'bundle.tr.json'), 'utf8')),
);
const t = makeTf(bundle, 'tr');
const ROLES_D = designRoles(ROLES);
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, t);
const labels = pickLabels(t, CARD_IDS);

const mount = () =>
  renderWithIntl(
    <CalculatorIsland
      locale="tr"
      rateConfig={RATE}
      roles={ROLES_D}
      labels={labels}
      roleLabels={roleLabels}
      industryLabels={industryLabels}
      closeLabel="Kapat"
    />,
    { locale: 'tr' },
  );
const monthly = () => screen.getByTestId('calc-monthly-total');

afterEach(() => {
  resetEstimateInputs();
  track.mockClear();
});

describe('CalculatorIsland', () => {
  it('paints the model at the defaults — welder × 1, full year, other tier (COPY_DELTAS)', () => {
    mount();
    expect(monthly()).toHaveTextContent('60.321 ₺');
    expect(screen.getByTestId('calc-year-total')).toHaveTextContent('751.852 ₺');
    expect(screen.getByRole('slider', { name: t('calc.015') })).toHaveAttribute(
      'aria-valuetext',
      `49.545 ₺ ${t('calc.464')}`,
    );
    // the legal-flagged sample, word for word, at the model floor (W2/W142)
    expect(screen.getByText(t('calc.557'))).toBeInTheDocument();
  });

  it('a headcount preset multiplies the totals and fires calculator_use with the role key', async () => {
    mount();
    await userEvent.click(screen.getByRole('radio', { name: '5' }));
    expect(monthly()).toHaveTextContent('301.605 ₺');
    expect(track).toHaveBeenLastCalledWith('calculator_use', {
      page: '/maliyet-hesaplayici',
      locale: 'tr',
      role: 'welder',
      headcount: 5,
    });
    await userEvent.click(screen.getByRole('checkbox', { name: new RegExp(t('calc.020')) }));
    expect(monthly()).toHaveTextContent('295.255 ₺'); // support is opt-in (W58)
  });

  it('the stepper commits on blur, not per keystroke (W131)', async () => {
    mount();
    const input = screen.getByRole('spinbutton', { name: t('calc.013') });
    await userEvent.clear(input);
    await userEvent.type(input, '12');
    expect(monthly()).toHaveTextContent('60.321 ₺');
    fireEvent.blur(input);
    expect(monthly()).toHaveTextContent('723.852 ₺');
    expect(track).toHaveBeenLastCalledWith('calculator_use', expect.objectContaining({ headcount: 12 }));
  });

  it('a 6-month season shows the seasonal note and the season title', async () => {
    mount();
    await userEvent.click(screen.getByRole('radio', { name: t('calc.471') }));
    expect(screen.getByTestId('calc-seasonal')).toHaveTextContent('64.988 ₺');
    expect(screen.getByTestId('calc-total-title')).toHaveTextContent('6 aylık sezon toplamı');
    expect(screen.getByTestId('calc-year-total')).toHaveTextContent('389.926 ₺');
  });

  it('a role change resets the salary to that role’s floor and is tracked by key', async () => {
    mount();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: t('calc.012') }), 'cook');
    expect(getEstimateInputs()).toMatchObject({ roleKey: 'cook', grossSalary: null });
    expect(monthly()).toHaveTextContent('60.875 ₺'); // the cook's band floor 50,000
    expect(track).toHaveBeenLastCalledWith('calculator_use', expect.objectContaining({ role: 'cook' }));
    expect(screen.getByRole('slider', { name: t('calc.015') })).toHaveAttribute(
      'aria-valuetext',
      `50.000 ₺ ${t('calc.464')}`,
    );
  });

  it('the SGK tier is validated state: a chip sets it and the rate follows (W144)', async () => {
    mount();
    await userEvent.click(screen.getByRole('radio', { name: t('calc.466') }));
    expect(getEstimateInputs().sgkTier).toBe('manufacturing');
    expect(monthly()).toHaveTextContent('58.835 ₺');
    expect(screen.getAllByText('%18,75').length).toBeGreaterThan(0);
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/__tests__/CalculatorLoader.test.tsx`:

```tsx
import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { renderWithIntl } from '@/test/render';
import { designRoles, roleLabelMaps } from '../../_lib/card-view';
import { CALC_ARM_EVENT } from '../../_lib/events';
import { CARD_IDS, pickLabels } from '../../_lib/ids';
import { CalculatorLoader, resetCalculatorArm } from '../CalculatorLoader';
import { resetEstimateInputs } from '../estimate-store';

/** jsdom has no IntersectionObserver: this one reports "in view" as soon as it observes, so the
 *  only gate left is the loader's own arming. */
class InViewObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  constructor(private callback: IntersectionObserverCallback) {}
  observe() {
    this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

const ROLES_D = designRoles(ROLES);
const asId = (id: string) => id;
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, asId);
const mount = () =>
  renderWithIntl(
    <CalculatorLoader
      locale="tr"
      rateConfig={RATE}
      roles={ROLES_D}
      labels={pickLabels(asId, CARD_IDS)}
      roleLabels={roleLabels}
      industryLabels={industryLabels}
      closeLabel="Kapat"
      fallback={
        <div data-testid="skeleton">
          <button type="button" data-testid="calc-activate">
            activate
          </button>
        </div>
      }
    />,
  );

beforeEach(() => vi.stubGlobal('IntersectionObserver', InViewObserver));
afterEach(() => {
  vi.unstubAllGlobals();
  resetCalculatorArm();
  resetEstimateInputs();
  window.history.replaceState(null, '', '/');
});

describe('CalculatorLoader (W13 amended: the card loads on interaction, not in view)', () => {
  it('keeps the server skeleton and loads nothing until the card is touched', () => {
    mount();
    expect(screen.getByTestId('calc-card')).toHaveAttribute('data-island', 'idle');
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('calc-island')).toBeNull();
  });
  it('arms on the first focus inside the card and swaps the skeleton for the island', async () => {
    mount();
    fireEvent.focus(screen.getByTestId('calc-activate'));
    expect(screen.getByTestId('calc-card')).toHaveAttribute('data-island', 'armed');
    expect(await screen.findByTestId('calc-island')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).toBeNull();
  });
  it('arms when another island asks (CALC_ARM_EVENT) or the page is at #calculator (W17)', async () => {
    mount();
    act(() => {
      window.dispatchEvent(new Event(CALC_ARM_EVENT));
    });
    expect(await screen.findByTestId('calc-island')).toBeInTheDocument();
  });
  it('arms on a hash change to #calculator', async () => {
    mount();
    act(() => {
      window.history.replaceState(null, '', '/#calculator');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(await screen.findByTestId('calc-island')).toBeInTheDocument();
  });
});
```


- [ ] **Step 2: Run to verify they fail**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hiring-cost-calculator/_components
```
Expected: FAIL — `Failed to resolve import "../CalculatorIsland"` / `"../CalculatorLoader"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hiring-cost-calculator/_components/Sentence.tsx`:

```tsx
import { Fragment, type ReactNode } from 'react';
import { sp } from '../_lib/fragments';

/** A run of one design sentence: plain text, a bold run, an emphasis run, or a node (a live
 *  value, a link) with the text `sp` should judge its spacing by. */
export type Run = string | { b: string } | { em: string } | { node: ReactNode; text: string };

const textOf = (r: Run) =>
  typeof r === 'string' ? r : 'b' in r ? r.b : 'em' in r ? r.em : r.text;

/** One design sentence rebuilt from trimmed package fragments (`_lib/fragments.ts`): empty
 *  fragments vanish, spaces come back where the design had them, TR suffixes stay glued. No
 *  directive — the server sections and the islands both render it. */
export function Sentence({
  runs,
  strong = 'font-extrabold text-ink',
  em = 'not-italic text-danger',
}: {
  runs: readonly Run[];
  strong?: string;
  em?: string;
}) {
  const kept = runs.filter((r) => textOf(r) !== '');
  return (
    <>
      {kept.map((r, i) => (
        <Fragment key={i}>
          {i > 0 ? sp(textOf(kept[i - 1]), textOf(r)) : null}
          {typeof r === 'string' ? (
            r
          ) : 'b' in r ? (
            <strong className={strong}>{r.b}</strong>
          ) : 'em' in r ? (
            <em className={em}>{r.em}</em>
          ) : (
            r.node
          )}
        </Fragment>
      ))}
    </>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/Lookalikes.tsx`:

```tsx
/**
 * Static stand-ins for the foundation controls inside the server fallbacks: the same boxes as the
 * real `Stepper`, `RadioChips`, `RangeSlider`, checkbox, `<select>`, `TriState` and `ProgressBar`,
 * without behaviour and `aria-hidden` (the fallback's text carries every value). The class strings
 * mirror src/design/islands/{Stepper,RangeSlider,TriState,ProgressBar}.tsx and
 * src/design/primitives/RadioChips.tsx so the island's arrival does not move a box — a change to
 * one of those faces is mirrored here. No directive: server fallbacks render these.
 */
const STEP_BTN =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-border-1 bg-white text-body font-extrabold text-ink';

export function StepperLook({ value }: { value: string }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-1">
      <div className="flex items-stretch">
        <span className={`${STEP_BTN} rounded-l-input`}>−</span>
        <span className="grid w-20 place-items-center border-y border-border-1 bg-white text-body font-extrabold tabular-nums">
          {value}
        </span>
        <span className={`${STEP_BTN} rounded-r-input`}>+</span>
      </div>
    </div>
  );
}

const CHIP = 'inline-flex min-h-[44px] items-center rounded-pill border px-4 text-body-sm font-bold';
const CHIP_ON = 'border-tint-border bg-tint text-blue-safe';
const CHIP_OFF = 'border-border-1 bg-white text-text-secondary';

export function ChipsLook({
  options,
  value,
}: {
  options: readonly { value: string; label: string }[];
  value: string | null;
}) {
  return (
    <div aria-hidden="true" className="flex flex-wrap gap-2">
      {options.map((o) => (
        <span key={o.value} className={[CHIP, o.value === value ? CHIP_ON : CHIP_OFF].join(' ')}>
          {o.label}
        </span>
      ))}
    </div>
  );
}

/** RangeSlider's layout: the label/value row and the hint stay readable text (the skeleton's
 *  accessible content); only the track is decoration. */
export function SliderLook({
  label,
  value,
  minLabel,
  maxLabel,
  hint,
  pct = 0,
}: {
  label: string;
  value: string;
  minLabel: string;
  maxLabel: string;
  hint: string;
  pct?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-body-sm font-bold">{label}</span>
        <span className="text-body font-extrabold tabular-nums">{value}</span>
      </div>
      <div aria-hidden="true" className="relative h-4">
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-pill bg-border-1" />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-blue-safe"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div aria-hidden="true" className="flex justify-between text-body-sm text-text-secondary">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      <p className="text-body-sm text-text-tertiary">{hint}</p>
    </div>
  );
}

export function CheckLook({ checked, green = false }: { checked: boolean; green?: boolean }) {
  const on = green ? 'border-success bg-success text-white' : 'border-blue-safe bg-blue-safe text-white';
  return (
    <span
      aria-hidden="true"
      className={[
        'grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[4px] border text-[12px] font-extrabold leading-none max-md:h-6 max-md:w-6',
        checked ? on : 'border-muted bg-white text-white',
      ].join(' ')}
    >
      {checked ? '✓' : ''}
    </span>
  );
}

export function SelectLook({ text, className }: { text: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={[
        'flex min-h-[50px] w-full items-center justify-between gap-3 rounded-input border-[1.5px] border-border-1 bg-white px-[15px] text-body font-bold text-ink',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="truncate">{text}</span>
      <span className="text-body-sm text-text-tertiary">▾</span>
    </div>
  );
}

const TRI = 'inline-flex min-h-[44px] items-center rounded-pill border border-border-1 bg-white px-4 text-body-sm font-bold text-text-secondary';

export function TriStateLook({ labels }: { labels: readonly [string, string, string] }) {
  return (
    <div aria-hidden="true" className="flex flex-wrap gap-2">
      {labels.map((l) => (
        <span key={l} className={TRI}>
          {l}
        </span>
      ))}
    </div>
  );
}

const BAR_TONE = { blue: 'bg-blue-safe', green: 'bg-success', amber: 'bg-warning', red: 'bg-danger' } as const;

/** ProgressBar's layout at its first render (label row + bar). */
export function BarLook({
  label,
  valueText,
  pct,
  tone,
}: {
  label: string;
  valueText: string;
  pct: number;
  tone: keyof typeof BAR_TONE;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-body-sm font-bold">
        <span>{label}</span>
        <span className="tabular-nums">{valueText}</span>
      </div>
      <div aria-hidden="true" className="h-2 w-full overflow-hidden rounded-pill bg-border-3">
        <div className={`h-full rounded-pill ${BAR_TONE[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/card-ui.tsx`:

```tsx
import type { CardView } from '../_lib/card-view';
import { HEADCOUNT_PRESETS, MONTH_OPTIONS } from '../_lib/estimate-inputs';
import type { CardLabels } from '../_lib/ids';
import { QuoteButton } from './QuoteButton';
import { Sentence } from './Sentence';

/**
 * What the server skeleton and the live island share, so the swap after the first touch keeps
 * every box in place (W13 amended). Design: #calculator, lines 574–737 (desktop values are the
 * package's × 0.75 from 1101 px, D19; ≤ 700 px rules from lines 257–291). D20: blue text is
 * `blue-safe`, the `#94a3b8` kickers are `text-text-tertiary`. No directive.
 */
export const CARD_GRID = 'grid md:grid-cols-[1fr_1.05fr]';
export const LEFT_COL =
  'border-border-3 px-[15px] py-4 md:border-r md:px-[34px] md:py-[30px] xl:px-[25.5px] xl:py-[22.5px]';
export const RIGHT_COL =
  'flex flex-col bg-pale-2 px-[15px] py-4 md:px-[34px] md:py-[30px] xl:px-[25.5px] xl:py-[22.5px]';
export const KICKER =
  'm-0 mb-[18px] text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary';
export const FIELD_LABEL = 'mb-[7px] block text-body-sm font-extrabold text-ink';
export const SELECT =
  'min-h-[50px] w-full cursor-pointer rounded-input border-[1.5px] border-border-1 bg-white px-[15px] text-body font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
export const ROLE_BUTTON =
  'flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-3 rounded-xs border-[1.5px] border-border-1 bg-white px-3.5 py-[11px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
export const COVER_BOX = 'flex flex-col gap-1 border-t border-border-3 pt-1';
export const COVER_TITLE =
  'm-0 pt-3 text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary';
export const TOGGLE_ROW = 'flex min-h-[44px] cursor-pointer items-center justify-between gap-3';
export const TOGGLE_TEXT = 'text-body-sm font-bold text-text-secondary';
export const TOGGLE_NOTE = 'font-semibold text-text-tertiary';
export const TIER_BOX = 'border-t border-border-3 pt-3';
export const ADV_TOGGLE =
  'flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xs border-[1.5px] border-dashed border-tint-border bg-pale-1 p-3 text-body-sm font-extrabold text-blue-safe';
export const BRK_TOGGLE =
  'mb-3 flex min-h-[50px] w-full cursor-pointer items-center justify-between gap-2.5 rounded-xs border-[1.5px] border-tint-border bg-white px-[15px] py-[13px] text-left text-body-sm font-extrabold text-ink';

export const HEADCOUNT_OPTIONS = HEADCOUNT_PRESETS.map((n) => ({ value: String(n), label: String(n) }));
export const presetValue = (headcount: number): string | null =>
  (HEADCOUNT_PRESETS as readonly number[]).includes(headcount) ? String(headcount) : null;
export const monthOptions = (labels: CardLabels) =>
  MONTH_OPTIONS.map((m) => ({
    value: String(m),
    label: m === 6 ? labels.chip6 : m === 9 ? labels.chip9 : labels.chip12,
  }));
export const tierOptions = (labels: CardLabels) => [
  { value: 'manufacturing', label: labels.tierManuf },
  { value: 'other', label: labels.tierOther },
  { value: 'none', label: labels.tierNone },
];

/** "Label ……… value" above a control. `hidden` in the island (the control itself is labelled),
 *  readable in the skeleton (it is the skeleton's accessible text). */
export function RowHead({
  label,
  value,
  kicker = false,
  hidden = false,
}: {
  label: string;
  value: string;
  kicker?: boolean;
  hidden?: boolean;
}) {
  return (
    <div aria-hidden={hidden || undefined} className="mb-2 flex items-baseline justify-between gap-2.5">
      <span
        className={
          kicker
            ? 'text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary'
            : 'text-body-sm font-extrabold text-ink'
        }
      >
        {label}
      </span>
      <span className="text-body-sm font-extrabold text-blue-safe">{value}</span>
    </div>
  );
}

/** The ≤ 700 px snapshot (design `.ja-cc-snap`): the live total and the quote button up top. */
export function Snapshot({ view, labels }: { view: CardView; labels: CardLabels }) {
  const cell = (label: string, value: string) => (
    <div className="rounded-[10px] border border-white/15 bg-white/10 px-2.5 py-2">
      <p className="m-0 mb-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.8px] text-white/80">
        {label}
      </p>
      <p className="m-0 text-[15px] font-extrabold">{value}</p>
    </div>
  );
  return (
    <div className="mb-3.5 rounded-sm bg-[linear-gradient(135deg,#16202e_0%,#253063_100%)] px-[15px] py-3.5 text-white md:hidden">
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="text-[11px] font-extrabold uppercase tracking-[1.1px] text-sky">{view.totalTitle}</span>
        <span className="text-[11.5px] font-extrabold text-white/80">{view.headcountNote}</span>
      </div>
      <p className="m-0 mt-1.5 mb-2.5 text-[29px] font-extrabold leading-[1.05] tracking-[-1.2px]">
        {view.f.contract.total}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {cell(labels.cPerMonth, view.f.monthly.total)}
        {cell(labels.cOneOff, view.f.oneOff.total)}
      </div>
      <QuoteButton
        label={labels.cQuoteArrow}
        variant="secondary"
        size="lg"
        className="mt-2.5 w-full"
        testId="calc-quote-open-snap"
      />
    </div>
  );
}

/** "Can you hire N? … needs 5·N Turkish employees … Check your quota →" (calc.041–049): a same-page
 *  link to the quota gate; the desktop and phone sentences are both in the DOM (W10). */
export function QuotaHint({ view, labels }: { view: CardView; labels: CardLabels }) {
  return (
    <a
      href="#quota"
      className="mt-[11px] flex items-start gap-2.5 rounded-[11px] border border-border-2 bg-pale-2 px-3.5 py-[11px] text-body-sm text-text-secondary no-underline hover:border-tint-border hover:bg-tint"
    >
      <span>
        <strong className="font-extrabold text-ink">
          <Sentence runs={[labels.cQuotaQ1, view.headcountText, labels.cQuotaQ2]} />
        </strong>{' '}
        <span className="max-md:hidden">
          <Sentence runs={[labels.cQuotaD1, { b: `${view.quotaNeeded} ${labels.cQuotaStaff}` }, labels.cQuotaD2]} />
        </span>
        <span className="md:hidden">
          <Sentence runs={[labels.cQuotaM1, { b: `${view.quotaNeeded} ${labels.cQuotaStaffShort}` }, labels.cQuotaM2]} />
        </span>{' '}
        <span className="whitespace-nowrap font-extrabold text-blue-safe">{labels.cQuotaLink}</span>
      </span>
    </a>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateBreakdown.tsx`:

```tsx
import { PrintButton } from '@/design/islands/PrintButton';
import type { CardView } from '../_lib/card-view';
import { joinText } from '../_lib/fragments';
import type { CardLabels } from '../_lib/ids';
import { QuoteButton } from './QuoteButton';
import { Sentence } from './Sentence';

function Row({
  label,
  note,
  value,
  tone = 'plain',
}: {
  label: string;
  note?: string;
  value: string;
  tone?: 'plain' | 'green' | 'note';
}) {
  const labelCls = tone === 'green' ? 'text-success-text' : 'text-text-secondary';
  const valueCls = tone === 'green' ? 'text-success-text' : tone === 'note' ? 'text-blue-safe' : 'text-ink';
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 max-md:py-[7px]">
      <span className={`text-body-sm ${labelCls}`}>
        {label}
        {note ? (
          <>
            {' '}
            <span className="text-text-tertiary">{note}</span>
          </>
        ) : null}
      </span>
      <span className={`text-body-sm font-extrabold ${valueCls}`}>{value}</span>
    </div>
  );
}

function Total({ label, value, testId, tone }: { label: string; value: string; testId: string; tone: 'blue' | 'ink' }) {
  return (
    <div className="mt-1.5 flex items-baseline justify-between gap-3 border-t border-border-3 pt-3">
      <span className="text-body font-extrabold text-ink">{label}</span>
      <span
        data-testid={testId}
        className={
          tone === 'blue'
            ? 'text-[20px] font-extrabold tracking-[-0.4px] text-blue-safe xl:text-[15px]'
            : 'text-[20px] font-extrabold tracking-[-0.4px] text-[#253063] xl:text-[15px]'
        }
      >
        {value}
      </span>
    </div>
  );
}

/** The card's right column (design 686–736): the monthly box, the one-off box (with the seasonal
 *  note), the total card with the quote button and Print. Rendered by the skeleton and the island
 *  alike. On phones the two boxes collapse behind "See where the money goes" (`breakdownOpen`),
 *  and Print is desktop-only (design line 283). The total card's gradient starts at `blue-safe`
 *  so its white copy reads (D20; the design's #1899D5 is 3.2:1). */
export function EstimateBreakdown({
  view,
  labels,
  breakdownOpen = false,
}: {
  view: CardView;
  labels: CardLabels;
  breakdownOpen?: boolean;
}) {
  const { f } = view;
  const box = [
    'mb-3.5 rounded-base border border-tint-border bg-white px-[22px] py-5 max-md:px-[15px] max-md:py-[15px]',
    breakdownOpen ? '' : 'max-md:hidden',
  ].join(' ');
  return (
    <>
      <div className="mb-[18px] flex items-baseline justify-between gap-3">
        <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary">{labels.cEst}</span>
        <span className="text-body-sm font-extrabold text-blue-safe">{view.headcountNote}</span>
      </div>
      <div className={box}>
        <p className="m-0 mb-2.5 text-body-sm font-extrabold uppercase tracking-[0.6px] text-text-tertiary">
          {labels.cMonthly}
        </p>
        <Row label={labels.cGross} value={f.monthly.gross} />
        <Row label={labels.cSgkEmp} note={`(${view.sgkRate})`} value={f.monthly.sgk} />
        {view.housing ? <Row label={labels.cAcc} value={f.monthly.housing} /> : null}
        {view.supportOptIn ? (
          <Row label={labels.cSupport} note={labels.cState} value={`− ${f.monthly.support}`} tone="green" />
        ) : null}
        <Total label={labels.cMonthlyTotal} value={f.monthly.total} testId="calc-monthly-total" tone="blue" />
      </div>
      <div className={box}>
        <p className="m-0 mb-2.5 text-body-sm font-extrabold uppercase tracking-[0.6px] text-text-tertiary">
          {labels.cOneOffY1}
        </p>
        <Row label={labels.cPermitFees} note={labels.cState} value={f.oneOff.permitFee} />
        {view.flight ? <Row label={labels.cFlightTravel} value={f.oneOff.flight} /> : null}
        <Row label={labels.cServiceFee} value={labels.cQuotedWritten} tone="note" />
        {view.seasonal ? (
          <p
            data-testid="calc-seasonal"
            className="m-0 mt-2 rounded-[10px] border border-warning-border bg-warning-surface px-[13px] py-2.5 text-body-sm text-warning-text"
          >
            <Sentence runs={[labels.sea1, view.perMonthPerWorker, labels.sea2]} />
          </p>
        ) : null}
        <Total label={labels.cOneOffTotal} value={f.oneOff.total} testId="calc-oneoff-total" tone="ink" />
      </div>
      <div className="mt-auto rounded-base bg-[linear-gradient(135deg,#1073a8_0%,#0b5d88_100%)] px-[22px] py-5 max-md:mt-1 max-md:px-[15px] max-md:py-4">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <span data-testid="calc-total-title" className="text-body-sm font-extrabold text-white">
            {view.totalTitle}
          </span>
          <span
            data-testid="calc-year-total"
            className="text-[26px] font-extrabold tracking-[-0.6px] text-white max-md:text-[23px] xl:text-[19.5px]"
          >
            {f.contract.total}
          </span>
        </div>
        <p className="m-0 mb-3.5 text-body-sm text-white">{joinText([view.yearNote, labels.cFeeNote])}</p>
        <div className="print-hidden flex gap-2 max-md:grid max-md:grid-cols-1">
          <QuoteButton label={labels.cQuoteBtn} variant="secondary" className="flex-1" testId="calc-quote-open" />
          <PrintButton label={labels.cPrint} variant="inverse" className="max-md:hidden" />
        </div>
      </div>
    </>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorSkeleton.tsx`:

```tsx
import type { CardView } from '../_lib/card-view';
import type { CardLabels } from '../_lib/ids';
import {
  ADV_TOGGLE,
  BRK_TOGGLE,
  CARD_GRID,
  COVER_BOX,
  COVER_TITLE,
  FIELD_LABEL,
  HEADCOUNT_OPTIONS,
  KICKER,
  LEFT_COL,
  QuotaHint,
  RIGHT_COL,
  RowHead,
  Snapshot,
  TIER_BOX,
  TOGGLE_NOTE,
  TOGGLE_ROW,
  TOGGLE_TEXT,
  monthOptions,
  presetValue,
  tierOptions,
} from './card-ui';
import { EstimateBreakdown } from './EstimateBreakdown';
import { ChipsLook, CheckLook, SelectLook, SliderLook, StepperLook } from './Lookalikes';

function ToggleLook({ label, note, checked, green }: { label: string; note?: string; checked: boolean; green?: boolean }) {
  return (
    <div className={TOGGLE_ROW}>
      <span className={TOGGLE_TEXT}>
        {label}
        {note ? (
          <>
            {' '}
            <span className={TOGGLE_NOTE}>{note}</span>
          </>
        ) : null}
      </span>
      <CheckLook checked={checked} green={green} />
    </div>
  );
}

/**
 * The calculator card as the server renders it (W13 amended): the island's layout at the given
 * view, with static lookalike controls and the model's real figures, so the first paint, the
 * print view and the pixel harness all see the designed card while the engine and the five
 * controls stay out of the first-load script. The one real control is an `sr-only` button
 * (visible on focus) — focusing or touching anything in the card loads the island
 * (`CalculatorLoader`), which then takes focus itself.
 */
export function CalculatorSkeleton({
  view,
  labels,
  activateLabel,
}: {
  view: CardView;
  labels: CardLabels;
  activateLabel: string;
}) {
  const sliderPct = view.stops.length > 1 ? (view.stopIndex / (view.stops.length - 1)) * 100 : 0;
  const tier = tierOptions(labels).find((o) => o.value === view.sgkTier);
  return (
    <div data-testid="calc-skeleton" className={CARD_GRID}>
      <div className={LEFT_COL}>
        <button
          type="button"
          data-testid="calc-activate"
          className="sr-only focus:not-sr-only focus:mb-3 focus:block focus:rounded-xs focus:bg-tint focus:px-3 focus:py-2 focus:text-body-sm focus:font-extrabold focus:text-blue-safe"
        >
          {activateLabel}
        </button>
        <p className={KICKER}>{labels.cReq}</p>
        <Snapshot view={view} labels={labels} />
        <div className="flex flex-col gap-4">
          <div>
            <p className={FIELD_LABEL}>{labels.cProfession}</p>
            <SelectLook text={`${view.roleLabel} · ${view.industryLabel}`} className="max-md:hidden" />
            <div aria-hidden="true" className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-xs border-[1.5px] border-border-1 bg-white px-3.5 py-[11px] md:hidden">
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-body font-extrabold text-ink">{view.roleLabel}</span>
                <span className="text-[12px] font-bold text-text-tertiary">
                  {view.industryLabel} · {view.roleRange}
                </span>
              </span>
              <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-input bg-tint text-[13px] font-extrabold text-blue-safe">
                ▼
              </span>
            </div>
          </div>
          <div>
            <RowHead label={labels.cWorkers} value={view.headcountText} />
            <div className="flex flex-wrap items-end gap-2.5">
              <StepperLook value={view.headcountText} />
              <ChipsLook options={HEADCOUNT_OPTIONS} value={presetValue(view.headcount)} />
            </div>
            <QuotaHint view={view} labels={labels} />
          </div>
          <div className="max-md:hidden">
            <RowHead label={labels.cContract} value={view.monthsNote} />
            <ChipsLook options={monthOptions(labels)} value={String(view.months)} />
          </div>
          <div className="max-md:hidden">
            <SliderLook
              label={labels.cSalary}
              value={view.salaryLabel}
              minLabel={view.salaryMinLabel}
              maxLabel={view.salaryMaxLabel}
              hint={view.thresholdNote}
              pct={sliderPct}
            />
          </div>
          <div className={`${COVER_BOX} max-md:hidden`}>
            <p className={COVER_TITLE}>{labels.cCover}</p>
            <ToggleLook label={labels.cFlight} checked={view.flight} />
            <ToggleLook label={labels.cAcc} note={labels.cAccNote} checked={view.housing} />
            <ToggleLook label={labels.cSupport} note={labels.cSupportNote} checked={view.supportOptIn} green />
          </div>
          <div className={`${TIER_BOX} max-md:hidden`}>
            <RowHead label={labels.cSgkDisc} value={`${tier?.label ?? ''} · ${view.sgkRate}`} kicker />
            <ChipsLook options={tierOptions(labels)} value={view.sgkTier} />
          </div>
          <div aria-hidden="true" className={`${ADV_TOGGLE} md:hidden`}>
            {labels.advMore}
          </div>
        </div>
      </div>
      <div className={RIGHT_COL}>
        <div aria-hidden="true" className={`${BRK_TOGGLE} md:hidden`}>
          <span>{labels.brkShow}</span>
          <span className="text-[12px] font-extrabold text-blue-safe">+</span>
        </div>
        <EstimateBreakdown view={view} labels={labels} />
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorIsland.tsx`:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import { BottomSheet } from '@/design/islands/BottomSheet';
import { RangeSlider } from '@/design/islands/RangeSlider';
import { Stepper } from '@/design/islands/Stepper';
import { RadioChips } from '@/design/primitives/RadioChips';
import type { Locale } from '@/i18n/routing';
import { LIMITS, SGK_TIERS, type RateConfig, type SgkTier } from '@/lib/calculator';
import { formatTRY } from '@/lib/format/money';
import { computeCardView, type DesignRole } from '../_lib/card-view';
import { makeCardCopy } from '../_lib/copy';
import { MONTH_OPTIONS, type Months } from '../_lib/estimate-inputs';
import type { CardLabels } from '../_lib/ids';
import {
  ADV_TOGGLE,
  BRK_TOGGLE,
  CARD_GRID,
  COVER_BOX,
  COVER_TITLE,
  FIELD_LABEL,
  HEADCOUNT_OPTIONS,
  KICKER,
  LEFT_COL,
  QuotaHint,
  RIGHT_COL,
  ROLE_BUTTON,
  RowHead,
  SELECT,
  Snapshot,
  TIER_BOX,
  TOGGLE_NOTE,
  TOGGLE_ROW,
  TOGGLE_TEXT,
  monthOptions,
  presetValue,
  tierOptions,
} from './card-ui';
import { EstimateBreakdown } from './EstimateBreakdown';
import { setEstimateInputs, useEstimateInputs } from './estimate-store';

export type CalculatorIslandProps = {
  locale: Locale;
  rateConfig: RateConfig;
  roles: DesignRole[];
  labels: CardLabels;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  /** `sys.nav.close`, resolved on the server (`nav` stays out of CLIENT_SYS, W148). */
  closeLabel: string;
  /** true when the card was entered by keyboard: take focus once mounted (the skeleton's focused
   *  button is gone). */
  focusOnMount?: boolean;
};

function Toggle({
  id,
  label,
  note,
  checked,
  onChange,
  green = false,
}: {
  id: string;
  label: string;
  note?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  green?: boolean;
}) {
  return (
    <label htmlFor={id} className={TOGGLE_ROW}>
      <span className={TOGGLE_TEXT}>
        {label}
        {note ? (
          <>
            {' '}
            <span className={TOGGLE_NOTE}>{note}</span>
          </>
        ) : null}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={
          green
            ? 'h-[18px] w-[18px] shrink-0 cursor-pointer accent-success max-md:h-6 max-md:w-6'
            : 'h-[18px] w-[18px] shrink-0 cursor-pointer accent-blue-safe max-md:h-6 max-md:w-6'
        }
      />
    </label>
  );
}

/**
 * The live calculator (design #calculator, 574–737) — its own chunk, loaded by `CalculatorLoader`
 * on the first touch of the card (W13 amended). One engine (W2/W24) through `computeCardView`;
 * state in the shared store so the quota gate, the pass check, the guide, the recap and the quote
 * form follow it. `calculator_use` fires on every role or headcount commit with the role KEY and
 * the integer (W12); nothing else is tracked (the design's calc_print/calc_months/calc_sgk_tier
 * are not in the allowlist).
 */
export function CalculatorIsland({
  locale,
  rateConfig,
  roles,
  labels,
  roleLabels,
  industryLabels,
  closeLabel,
  focusOnMount = false,
}: CalculatorIslandProps) {
  const sys = useTranslations('sys');
  const page = usePathname() ?? '/'; // R35: the real URL
  const uiLocale = useLocale();
  const inputs = useEstimateInputs();
  const rootRef = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState(false);
  const [sheetIndustry, setSheetIndustry] = useState('all');
  const [advanced, setAdvanced] = useState(false);
  const [breakdown, setBreakdown] = useState(false);

  useEffect(() => {
    if (!focusOnMount) return;
    const controls = rootRef.current?.querySelectorAll<HTMLElement>('select, button, input') ?? [];
    Array.from(controls)
      .find((el) => el.offsetParent !== null)
      ?.focus();
  }, [focusOnMount]);

  const view = computeCardView({
    inputs,
    roles,
    rateConfig,
    locale,
    roleLabels,
    industryLabels,
    labels,
    copy: makeCardCopy(sys),
  });
  const used = (role: string, headcount: number) =>
    track('calculator_use', { page, locale: uiLocale, role, headcount });
  const pickRole = (roleKey: string) => {
    setEstimateInputs({ roleKey, grossSalary: null });
    used(roleKey, view.headcount);
  };
  const pickHeadcount = (headcount: number) => {
    setEstimateInputs({ headcount });
    used(view.roleKey, headcount);
  };
  const industries = [...new Set(roles.map((r) => r.industry))];
  const adv = advanced ? '' : 'max-md:hidden';

  return (
    <div ref={rootRef} data-testid="calc-island" className={CARD_GRID}>
      <div className={LEFT_COL}>
        <p className={KICKER}>{labels.cReq}</p>
        <Snapshot view={view} labels={labels} />
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="calc-role" className={`${FIELD_LABEL} max-md:hidden`}>
              {labels.cProfession}
            </label>
            <select
              id="calc-role"
              value={view.roleKey}
              onChange={(e) => pickRole(e.target.value)}
              className={`${SELECT} max-md:hidden`}
            >
              {roles.map((r) => (
                <option key={r.key} value={r.key}>
                  {roleLabels[r.key]} · {industryLabels[r.industry]}
                </option>
              ))}
            </select>
            <p id="calc-role-m-label" className={`${FIELD_LABEL} md:hidden`}>
              {labels.cProfession}
            </p>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-labelledby="calc-role-m-label calc-role-m-value"
              onClick={() => {
                setSheetIndustry('all');
                setSheet(true);
              }}
              className={`${ROLE_BUTTON} md:hidden`}
            >
              <span id="calc-role-m-value" className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-body font-extrabold text-ink">{view.roleLabel}</span>
                <span className="text-[12px] font-bold text-text-tertiary">
                  {view.industryLabel} · {view.roleRange}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-input bg-tint text-[13px] font-extrabold text-blue-safe"
              >
                ▼
              </span>
            </button>
            <BottomSheet open={sheet} onClose={() => setSheet(false)} title={labels.sheetPick} closeLabel={closeLabel}>
              <RadioChips
                name="calc-sheet-industry"
                legend={sys('calc.a11y.industries')}
                legendHidden
                value={sheetIndustry}
                onChange={setSheetIndustry}
                options={[
                  { value: 'all', label: labels.allShort },
                  ...industries.map((i) => ({ value: i, label: industryLabels[i] ?? i })),
                ]}
                className="mb-3"
              />
              <ul className="m-0 list-none p-0">
                {roles
                  .filter((r) => sheetIndustry === 'all' || r.industry === sheetIndustry)
                  .map((r) => (
                    <li key={r.key}>
                      <button
                        type="button"
                        aria-pressed={r.key === view.roleKey}
                        onClick={() => {
                          pickRole(r.key);
                          setSheet(false);
                        }}
                        className={[
                          'mb-1.5 flex min-h-[58px] w-full cursor-pointer items-center justify-between gap-3 rounded-xs border-[1.5px] px-[13px] py-2.5 text-left',
                          r.key === view.roleKey ? 'border-blue-safe bg-pale-3' : 'border-border-3 bg-white',
                        ].join(' ')}
                      >
                        <span className="flex flex-col">
                          <span className="font-extrabold text-ink">{roleLabels[r.key]}</span>
                          <span className="text-body-sm text-text-tertiary">{industryLabels[r.industry]}</span>
                        </span>
                        <span aria-hidden="true" className="font-extrabold text-blue-safe">
                          {r.key === view.roleKey ? '✓' : ''}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </BottomSheet>
          </div>
          <div>
            <RowHead label={labels.cWorkers} value={view.headcountText} hidden />
            <div className="flex flex-wrap items-end gap-2.5">
              <Stepper
                id="calc-headcount"
                label={labels.cWorkers}
                value={view.headcount}
                onChange={pickHeadcount}
                min={LIMITS.headcountMin}
                max={LIMITS.headcountMax}
                decrementLabel={sys('calc.a11y.decrease', { step: 1 })}
                incrementLabel={sys('calc.a11y.increase', { step: 1 })}
                className="[&>label]:sr-only"
              />
              <RadioChips
                name="calc-headcount-preset"
                legend={sys('calc.a11y.headcountPresets')}
                legendHidden
                value={presetValue(view.headcount)}
                onChange={(v) => pickHeadcount(Number(v))}
                options={HEADCOUNT_OPTIONS}
              />
            </div>
            <QuotaHint view={view} labels={labels} />
          </div>
          <div className={adv}>
            <RowHead label={labels.cContract} value={view.monthsNote} hidden />
            <RadioChips
              name="calc-months"
              legend={labels.cContract}
              legendHidden
              value={String(view.months)}
              onChange={(v) => {
                const m = Number(v);
                if ((MONTH_OPTIONS as readonly number[]).includes(m)) setEstimateInputs({ months: m as Months });
              }}
              options={monthOptions(labels)}
            />
          </div>
          <div className={adv}>
            <RangeSlider
              id="calc-salary"
              label={labels.cSalary}
              min={0}
              max={view.stops.length - 1}
              step={1}
              value={view.stopIndex}
              onChange={(i) => setEstimateInputs({ grossSalary: view.stops[i] ?? null })}
              formatValue={(i) => `${formatTRY(view.stops[i] ?? view.stops[0], locale)} ${labels.perMonthSuffix}`}
              minLabel={view.salaryMinLabel}
              maxLabel={view.salaryMaxLabel}
              hint={view.thresholdNote}
            />
          </div>
          <div role="group" aria-labelledby="calc-cover" className={`${COVER_BOX} ${adv}`}>
            <p id="calc-cover" className={COVER_TITLE}>
              {labels.cCover}
            </p>
            <Toggle id="calc-flight" label={labels.cFlight} checked={view.flight} onChange={(flight) => setEstimateInputs({ flight })} />
            <Toggle
              id="calc-housing"
              label={labels.cAcc}
              note={labels.cAccNote}
              checked={view.housing}
              onChange={(housing) => setEstimateInputs({ housing })}
            />
            <Toggle
              id="calc-support"
              label={labels.cSupport}
              note={labels.cSupportNote}
              checked={view.supportOptIn}
              onChange={(supportOptIn) => setEstimateInputs({ supportOptIn })}
              green
            />
          </div>
          <div className={`${TIER_BOX} ${adv}`}>
            <RowHead label={labels.cSgkDisc} value={view.sgkRate} kicker hidden />
            <RadioChips
              name="calc-tier"
              legend={labels.cSgkDisc}
              legendHidden
              value={view.sgkTier}
              onChange={(v) => {
                // W144: estimate() throws on an unknown tier — only a known key reaches the store
                if ((SGK_TIERS as readonly string[]).includes(v)) setEstimateInputs({ sgkTier: v as SgkTier });
              }}
              options={tierOptions(labels)}
            />
          </div>
          <button
            type="button"
            aria-expanded={advanced}
            onClick={() => setAdvanced((v) => !v)}
            className={`${ADV_TOGGLE} md:hidden`}
          >
            {advanced ? labels.advFew : labels.advMore}
          </button>
        </div>
      </div>
      <div className={RIGHT_COL}>
        <button
          type="button"
          aria-expanded={breakdown}
          onClick={() => setBreakdown((v) => !v)}
          className={`${BRK_TOGGLE} md:hidden`}
        >
          <span>{breakdown ? labels.brkHide : labels.brkShow}</span>
          <span aria-hidden="true" className="text-[12px] font-extrabold text-blue-safe">
            {breakdown ? '−' : '+'}
          </span>
        </button>
        <EstimateBreakdown view={view} labels={labels} breakdownOpen={breakdown} />
      </div>
      <p className="sr-only" aria-live="polite">
        {view.totalTitle}: {view.f.contract.total} · {view.headcountNote}
      </p>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorLoader.tsx`:

```tsx
'use client';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { LazyIsland } from '@/design/islands/LazyIsland';
import { CALC_ARM_EVENT } from '../_lib/events';
import type { CalculatorIslandProps } from './CalculatorIsland';

// A function prop cannot cross the server → client boundary, so the `load` thunk lives here; the
// type-only import keeps the island out of this eager chunk.
const load = () => import('./CalculatorIsland').then((m) => ({ default: m.CalculatorIsland }));

// Armed from outside the card: the page at #calculator (the header CTA, W17), a later hash change
// to it, or another island asking (CALC_ARM_EVENT — the salary guide's "Use in calculator"). A
// module latch read through useSyncExternalStore: the server snapshot is "not armed", so
// hydration always matches the skeleton (R18/R27 — no setState in an effect).
let armedElsewhere = false;
function subscribe(onChange: () => void): () => void {
  const onArm = () => {
    armedElsewhere = true;
    onChange();
  };
  const onHash = () => {
    if (window.location.hash === '#calculator') onArm();
  };
  window.addEventListener(CALC_ARM_EVENT, onArm);
  window.addEventListener('hashchange', onHash);
  return () => {
    window.removeEventListener(CALC_ARM_EVENT, onArm);
    window.removeEventListener('hashchange', onHash);
  };
}
const snapshot = () => armedElsewhere || window.location.hash === '#calculator';
const serverSnapshot = () => false;
/** Tests only. */
export function resetCalculatorArm(): void {
  armedElsewhere = false;
}

type Props = Omit<CalculatorIslandProps, 'focusOnMount'> & { fallback: ReactNode };

/**
 * W13 amended: the card sits in the first viewport, so a viewport trigger would fetch the island
 * during the Lighthouse load. This wrapper renders the server skeleton until the first
 * hover/touch/focus inside the card (or an outside arming), then hands over to the foundation's
 * `LazyIsland` — in view by then, so the island's chunk loads at once (W85/W132: no page-local
 * lazy helper; this only decides WHEN `LazyIsland` exists).
 */
export function CalculatorLoader({ fallback, ...props }: Props) {
  const external = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [touched, setTouched] = useState<'pointer' | 'keyboard' | null>(null);
  const armed = external || touched !== null;
  const arm = (how: 'pointer' | 'keyboard') => () => setTouched((t) => t ?? how);
  return (
    <div
      data-testid="calc-card"
      data-island={armed ? 'armed' : 'idle'}
      onPointerEnter={armed ? undefined : arm('pointer')}
      onPointerDown={armed ? undefined : arm('pointer')}
      onFocusCapture={armed ? undefined : arm('keyboard')}
    >
      {armed ? (
        <LazyIsland<CalculatorIslandProps>
          load={load}
          props={{ ...props, focusOnMount: touched === 'keyboard' }}
          fallback={fallback}
          rootMargin="0px"
        />
      ) : (
        fallback
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hiring-cost-calculator/_components"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `CalculatorIsland.test.tsx` 6 and `CalculatorLoader.test.tsx` 4 green; `client-messages.test.ts` green (`CalculatorIsland` reads `calc.a11y.*` literally; `makeCardCopy(sys)` passes the translator, never a key); `class-collisions.test.ts` green over `card-ui.tsx`, `Lookalikes.tsx`, `EstimateBreakdown.tsx`, the skeleton and the island (every `hidden` is prefixed or beside no base display; `border`/`border-[1.5px]` never share an element; no caller colour class reaches a `Button`/`QuoteButton`/`PrintButton`).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator/_components"
git commit -m "feat(calc): the calculator card — server skeleton, interaction-loaded island, shared view

The skeleton renders the model's figures with lookalike controls; the island (RangeSlider over
the stop list, Stepper committing on blur (W131), RadioChips, BottomSheet role picker) loads on
the first touch/focus or at #calculator through LazyIsland (W13 amended/W132); calculator_use
carries the role key and the integer (W12); the tier is validated before the engine (W144).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — the in-view islands: quota gate, pass check, salary guide, recap, the live SGK rate, the W95 WhatsApp composer, the `LazyIsland` binders

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/hiring-cost-calculator/_components/__tests__/islands.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTranslator, type Messages } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTf } from '@/content/pure';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { formatTRY } from '@/lib/format/money';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { designRoles, roleLabelMaps } from '../../_lib/card-view';
import { CALC_ARM_EVENT } from '../../_lib/events';
import { GUIDE_IDS, PASS_IDS, QUOTA_IDS, RECAP_IDS, pickLabels } from '../../_lib/ids';
import { computeQuotaView } from '../../_lib/quota-view';
import { makeQuotaCopy } from '../../_lib/copy';
import { getEstimateInputs, resetEstimateInputs, setEstimateInputs } from '../estimate-store';
import { QuotaLoader } from '../LazyBinders';
import { LiveSgkRate } from '../LiveSgkRate';
import { StepperLook } from '../Lookalikes';
import { PassCheckIsland } from '../PassCheckIsland';
import { QuotaIsland } from '../QuotaIsland';
import { QuotaView } from '../QuotaView';
import { RecapIsland } from '../RecapIsland';
import { SalaryGuideIsland } from '../SalaryGuideIsland';
import { WhatsAppComposeLink } from '../WhatsAppComposeLink';

const track = vi.fn();
vi.mock('@/analytics/track', () => ({ track: (...args: unknown[]) => track(...args) }));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/maliyet-hesaplayici',
}));

const bundle = BundleSchema.parse(
  JSON.parse(readFileSync(join(process.cwd(), 'src', 'content', 'local', 'bundle.tr.json'), 'utf8')),
);
const t = makeTf(bundle, 'tr');
const ROLES_D = designRoles(ROLES);
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, t);
const quotaLabels = pickLabels(t, QUOTA_IDS);
const WA = 'https://wa.me/905011240340';

afterEach(() => {
  resetEstimateInputs();
  track.mockClear();
});

describe('QuotaIsland (Gate 1)', () => {
  it('answers from the shared store and commits a typed staff count on Enter (W131)', async () => {
    renderWithIntl(<QuotaIsland variant="desktop" locale="tr" quotaRatio={RATE.quotaRatio} labels={quotaLabels} />);
    expect(screen.getByTestId('quota-allowed')).toHaveTextContent('5 yabancı işçi');
    expect(screen.getByTestId('quota-viz-note')).toHaveTextContent(t('calc.558')); // the legal sample
    const input = screen.getByRole('spinbutton', { name: t('calc.142') });
    await userEvent.clear(input);
    await userEvent.type(input, '9{Enter}');
    expect(getEstimateInputs().turkishStaff).toBe(9);
    expect(screen.getByTestId('quota-allowed')).toHaveTextContent('1 yabancı işçi');
    expect(screen.getByTestId('quota-viz-note')).toHaveTextContent(
      '1 tam grup artı 4 artık çalışan — 1 kişi daha bir kontenjan daha açar.',
    );
    expect(screen.getByTestId('quota-vs-plan')).toHaveTextContent(t('calc.429'));
  });
  it('the server fallback shows the island’s first render (DOM-matched, W132)', () => {
    const sys = createTranslator({ locale: 'tr', messages: tr as Messages, namespace: 'sys' });
    const view = computeQuotaView({ staff: 25, headcount: 1, ratio: RATE.quotaRatio, locale: 'tr', labels: quotaLabels, copy: makeQuotaCopy(sys) });
    const fallback = renderWithIntl(
      <QuotaView variant="desktop" view={view} labels={quotaLabels} stepper={<StepperLook value="25" />} live={false} />,
    );
    const texts = (ids: string[]) => ids.map((id) => screen.getByTestId(id).textContent);
    const ids = ['quota-allowed', 'quota-msg', 'quota-viz-note', 'quota-vs-plan'];
    const before = texts(ids);
    fallback.unmount();
    renderWithIntl(<QuotaIsland variant="desktop" locale="tr" quotaRatio={RATE.quotaRatio} labels={quotaLabels} />);
    expect(texts(ids)).toEqual(before);
    expect(screen.getByTestId('quota-view')).toHaveAttribute('data-live', 'true');
  });
});

describe('PassCheckIsland', () => {
  const mount = () =>
    renderWithIntl(
      <PassCheckIsland
        locale="tr"
        rateConfig={RATE}
        roles={ROLES_D}
        roleLabels={roleLabels}
        labels={pickLabels(t, PASS_IDS)}
        whatsappNumber="905011240340"
      />,
    );
  it('starts idle with the quota row answered from the store (calc.561 wording)', () => {
    mount();
    expect(screen.getByTestId('pass-verdict')).toHaveAttribute('data-tone', 'idle');
    expect(screen.getByText(t('calc.561'))).toBeInTheDocument();
    expect(screen.getByText(t('calc.559'))).toBeInTheDocument();
  });
  it('a "no" turns the verdict red; "Send my result" composes the answers only on click (W95)', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    mount();
    await userEvent.click(screen.getAllByRole('radio', { name: t('calc.434') })[0]);
    expect(screen.getByTestId('pass-verdict')).toHaveAttribute('data-tone', 'red');
    expect(screen.getByText(t('calc.447'))).toBeInTheDocument();
    const send = screen.getByTestId('pass-send');
    expect(send).toHaveAttribute('href', WA);
    await userEvent.click(send);
    const text = decodeURIComponent(String(open.mock.calls[0][0]).split('?text=')[1]);
    expect(text).toContain(t('calc.555'));
    expect(text).toContain(`1. ${t('calc.445')} — ${t('calc.434')}`);
    expect(track).toHaveBeenCalledWith('whatsapp_click', {
      page: '/maliyet-hesaplayici',
      locale: 'tr',
      placement: 'page_cta',
    });
    open.mockRestore();
  });
});

describe('SalaryGuideIsland (W2 floor, W59 tier)', () => {
  const mount = () =>
    renderWithIntl(
      <SalaryGuideIsland
        locale="tr"
        roles={ROLES_D}
        rateConfig={RATE}
        labels={pickLabels(t, GUIDE_IDS)}
        roleLabels={roleLabels}
        industryLabels={industryLabels}
        scaleMin={formatTRY(30000, 'tr')}
        scaleMax={formatTRY(78000, 'tr')}
      />,
    );
  it('follows the calculator’s tier and filters by industry', async () => {
    mount();
    expect(screen.getAllByRole('article')).toHaveLength(12);
    const welder = () => screen.getAllByRole('article').find((a) => a.dataset.role === 'welder')!;
    expect(within(welder()).getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    act(() => setEstimateInputs({ sgkTier: 'manufacturing' }));
    expect(welder()).toHaveTextContent('58.835 ₺ – 83.125 ₺');
    await userEvent.click(screen.getByRole('radio', { name: t('calc.552') }));
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });
  it('"Use in calculator" sets the role, arms the card and is tracked by key', async () => {
    const armed = vi.fn();
    window.addEventListener(CALC_ARM_EVENT, armed);
    mount();
    const cook = screen.getAllByRole('article').find((a) => a.dataset.role === 'cook')!;
    await userEvent.click(within(cook).getByRole('button'));
    expect(getEstimateInputs().roleKey).toBe('cook');
    expect(armed).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenLastCalledWith('calculator_use', expect.objectContaining({ role: 'cook', headcount: 1 }));
    window.removeEventListener(CALC_ARM_EVENT, armed);
  });
});

describe('RecapIsland, LiveSgkRate, the binders', () => {
  it('follow the store', () => {
    renderWithIntl(
      <>
        <RecapIsland
          locale="tr"
          rateConfig={RATE}
          roles={ROLES_D}
          roleLabels={roleLabels}
          industryLabels={industryLabels}
          cardLabels={pickLabels(t, { perWorker: 'calc.463', fullYear: 'calc.470', firstYear: 'calc.469', perMonthSuffix: 'calc.464' })}
          labels={pickLabels(t, RECAP_IDS)}
        />
        <LiveSgkRate rates={{ manufacturing: '%18,75', other: '%21,75', none: '%23,75' }} />
      </>,
    );
    expect(screen.getByTestId('recap-total')).toHaveTextContent('751.852 ₺');
    expect(screen.getByText('%21,75')).toBeInTheDocument();
    act(() => setEstimateInputs({ headcount: 5, sgkTier: 'manufacturing' }));
    expect(screen.getByText('%18,75')).toBeInTheDocument();
    expect(screen.getByTestId('recap-total')).toHaveTextContent('3.670.081 ₺');
  });
  it('a binder shows its server fallback until the island is in view (no IntersectionObserver here)', () => {
    renderWithIntl(
      <QuotaLoader variant="desktop" locale="tr" quotaRatio={RATE.quotaRatio} labels={quotaLabels} fallback={<p>fallback</p>} />,
    );
    expect(screen.getByText('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('quota-view')).toBeNull();
  });
});

describe('WhatsAppComposeLink (W95/W76)', () => {
  it('keeps the href bare, composes on click, counts a middle click', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderWithIntl(
      <WhatsAppComposeLink number="905011240340" text="Merhaba · ölçü 5" testId="wa">
        WhatsApp
      </WhatsAppComposeLink>,
    );
    const link = screen.getByTestId('wa');
    expect(link).toHaveAttribute('href', WA);
    await userEvent.click(link);
    expect(open).toHaveBeenCalledWith(`${WA}?text=${encodeURIComponent('Merhaba · ölçü 5')}`, '_blank', 'noopener');
    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(track).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenCalledTimes(1);
    open.mockRestore();
  });
});
```

(The manufacturing recap: 5 × (49,545 × 1.1875 × 12 + 28,000) = 5 × 734,016.25 = 3,670,081.25 → `3.670.081 ₺`.)

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hiring-cost-calculator/_components/__tests__/islands.test.tsx
```
Expected: FAIL — `Failed to resolve import "../LazyBinders"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hiring-cost-calculator/_components/WhatsAppComposeLink.tsx`:

```tsx
'use client';
import type { MouseEvent, ReactNode } from 'react';
import { useContactClick } from '@/analytics/useContactClick';
import { waLink } from '@/lib/contact';

/**
 * W95/W76 (D13): a WhatsApp CTA whose prefill carries what the visitor chose (the pass check's
 * answers). The DOM href is the bare chat, so neither GA4's outbound-click measurement nor a GTM
 * Click-URL trigger can read the prefill; the prefilled URL is composed on click and opened
 * `noopener` — the forms kernel's fallback-panel contract (and T1's composer, copied, not
 * imported: route folders never import each other). A middle click (no `click` event) reaches the
 * bare chat and is still counted. `whatsapp_click`, `placement: 'page_cta'` (W12).
 */
export function WhatsAppComposeLink({
  number,
  text,
  className,
  testId,
  children,
}: {
  number: string;
  text: string;
  className?: string;
  testId?: string;
  children: ReactNode;
}) {
  const fire = useContactClick('page_cta');
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    fire('whatsapp');
    e.preventDefault();
    window.open(waLink(number, text), '_blank', 'noopener');
  };
  const onAuxClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button === 1) fire('whatsapp');
  };
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      onClick={onClick}
      onAuxClick={onAuxClick}
      className={className}
    >
      {children}
    </a>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/QuotaView.tsx`:

```tsx
import type { ReactNode } from 'react';
import type { QuotaLabels } from '../_lib/ids';
import type { QuotaView as QuotaViewModel } from '../_lib/quota-view';
import { Sentence } from './Sentence';

const SQUARE = 'inline-block h-[11px] w-[11px] rounded-[3px]';
const DASHED = `${SQUARE} border-[1.5px] border-dashed border-muted bg-white`;

function Blocks({ view }: { view: QuotaViewModel }) {
  return (
    <div aria-hidden="true" className="flex flex-wrap gap-[9px]">
      {view.blocks.map((b, i) => (
        <div
          key={i}
          className={[
            'flex items-center gap-1 rounded-[9px] px-2.5 py-[7px]',
            b.kind === 'used'
              ? 'border border-success-border bg-success-surface'
              : b.kind === 'free'
                ? 'border border-border-2 bg-pale-2'
                : 'border border-dashed border-border-1 bg-white opacity-85',
          ].join(' ')}
        >
          {Array.from({ length: view.ratio }, (_, j) => (
            <span key={j} className={j < b.filled ? `${SQUARE} bg-blue` : DASHED} />
          ))}
          <span className="mx-0.5 text-[11px] text-text-tertiary">→</span>
          <span className={b.kind === 'partial' ? DASHED : `${SQUARE} bg-success`} />
        </div>
      ))}
    </div>
  );
}

/** Gate 1 (design 1063–1105) on desktop, the phone step + answer cards (1031–1049) on phones.
 *  `stepper` is the live `Stepper` in the island and a `StepperLook` in the server fallback — the
 *  rest is shared, so the swap keeps every box (W132). `live` marks which one is showing. */
export function QuotaView({
  variant,
  view,
  labels,
  stepper,
  live,
}: {
  variant: 'mobile' | 'desktop';
  view: QuotaViewModel;
  labels: QuotaLabels;
  stepper: ReactNode;
  live: boolean;
}) {
  const picked = (strong: string) => (
    <Sentence runs={[labels.qPicked1, { b: view.headcountText }, labels.qPicked2, view.vsPlan]} strong={strong} />
  );
  if (variant === 'mobile') {
    return (
      <div data-testid="quota-view-m" data-live={live}>
        <div className="mb-2.5 rounded-sm border border-border-1 bg-white p-3.5">
          <p className="m-0 mb-1 text-[11px] font-extrabold uppercase tracking-[1.1px] text-text-tertiary">{labels.qmS1}</p>
          <p className="m-0 mb-[11px] text-body font-extrabold leading-[1.3] text-ink">{labels.qmS1T}</p>
          {stepper}
        </div>
        <div className="mb-2.5 rounded-sm bg-navy px-[15px] py-4 text-white">
          <p className="m-0 mb-[7px] text-[11px] font-extrabold uppercase tracking-[1.1px] text-sky">{labels.qmAns}</p>
          <p data-testid="quota-allowed-m" className="m-0 mb-[7px] text-[26px] font-extrabold leading-[1.1] tracking-[-0.7px]">
            {view.allowedText}
          </p>
          <p className="m-0 text-body-sm text-white/80">{view.msg}</p>
          <p className="m-0 mt-[11px] border-t border-white/15 pt-[11px] text-body-sm text-white/80">
            {picked('font-extrabold text-white')}
          </p>
        </div>
      </div>
    );
  }
  const box = view.ok
    ? 'rounded-sm border border-success-border bg-success-surface px-5 py-[18px]'
    : 'rounded-sm border border-warning-border bg-warning-surface px-5 py-[18px]';
  const title = view.ok
    ? 'm-0 mb-1.5 text-body-sm font-extrabold uppercase tracking-[0.6px] text-success-text'
    : 'm-0 mb-1.5 text-body-sm font-extrabold uppercase tracking-[0.6px] text-warning-text';
  return (
    <div
      data-testid="quota-view"
      data-live={live}
      className="overflow-hidden rounded-lg border border-tint-border bg-white shadow-[0_18px_44px_rgba(22,60,90,0.10)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border-3 bg-pale-2 px-[26px] py-4">
        <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary">{labels.qG1}</span>
        <span className="rounded-pill border border-success-border bg-success-surface px-2.5 py-[3px] text-[11.5px] font-extrabold text-success-text">
          {labels.qLive}
        </span>
      </div>
      <div className="px-[26px] py-6">
        <p className="m-0 mb-2.5 text-body-sm font-extrabold text-ink">{labels.qStaffLbl}</p>
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          {stepper}
          <span className="text-body-sm text-text-tertiary">{labels.qSameBranch}</span>
        </div>
        <div className={box}>
          <p className={title}>{view.title}</p>
          <p data-testid="quota-allowed" className="m-0 mb-2 text-[32px] font-extrabold leading-[1.1] tracking-[-0.8px] text-ink xl:text-[24px]">
            {view.allowedText}
          </p>
          <p data-testid="quota-msg" className="m-0 text-body-sm text-text-secondary">
            {view.msg}
          </p>
        </div>
        <div className="mt-5 border-t border-border-3 pt-[18px]">
          <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[0.8px] text-text-tertiary">{labels.qSplit}</p>
          <Blocks view={view} />
          <p data-testid="quota-viz-note" className="m-0 mt-3 text-body-sm text-text-tertiary">
            {view.vizNote}
          </p>
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-[18px] p-0 text-[12px] font-bold text-text-tertiary">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`${SQUARE} bg-blue`} />
              {labels.qLegTr}
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`${SQUARE} bg-success`} />
              {labels.qLegPlace}
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className={DASHED} />
              {labels.qLegInc}
            </li>
          </ul>
        </div>
        <p data-testid="quota-vs-plan" className="m-0 mt-[18px] border-t border-border-3 pt-4 text-body-sm text-text-tertiary">
          {picked('font-extrabold text-ink')}
        </p>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/QuotaIsland.tsx`:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { Stepper } from '@/design/islands/Stepper';
import type { Locale } from '@/i18n/routing';
import { makeQuotaCopy } from '../_lib/copy';
import { TURKISH_STAFF } from '../_lib/estimate-inputs';
import type { QuotaLabels } from '../_lib/ids';
import { computeQuotaView } from '../_lib/quota-view';
import { setEstimateInputs, useEstimateInputs } from './estimate-store';
import { QuotaView } from './QuotaView';

export type QuotaIslandProps = {
  variant: 'mobile' | 'desktop';
  locale: Locale;
  quotaRatio: number;
  labels: QuotaLabels;
};

/** Gate 1 live: the Turkish-staff stepper (±5, 0–5000 — design 1728/2769) writes the shared store,
 *  so the pass check's quota row follows; the "you picked N" line reads the calculator's
 *  headcount. Loaded 200 px before view (W13 amended); the design's `quota_check` event is not
 *  ported (W12). */
export function QuotaIsland({ variant, locale, quotaRatio, labels }: QuotaIslandProps) {
  const sys = useTranslations('sys');
  const { turkishStaff, headcount } = useEstimateInputs();
  const view = computeQuotaView({
    staff: turkishStaff,
    headcount,
    ratio: quotaRatio,
    locale,
    labels,
    copy: makeQuotaCopy(sys),
  });
  return (
    <QuotaView
      variant={variant}
      view={view}
      labels={labels}
      live
      stepper={
        <Stepper
          id={variant === 'mobile' ? 'calc-staff-m' : 'calc-staff'}
          label={labels.qStaffLbl}
          value={turkishStaff}
          onChange={(v) => setEstimateInputs({ turkishStaff: v })}
          min={0}
          max={TURKISH_STAFF.max}
          step={TURKISH_STAFF.step}
          decrementLabel={sys('calc.a11y.decrease', { step: TURKISH_STAFF.step })}
          incrementLabel={sys('calc.a11y.increase', { step: TURKISH_STAFF.step })}
          className="[&>label]:sr-only"
        />
      }
    />
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/PassCheckView.tsx`:

```tsx
import type { ReactNode } from 'react';
import type { PassLabels } from '../_lib/ids';
import type { ManualRow, PassView, Tone } from '../_lib/pass-check';

/** The reset control's face (a text button, `invisible` until a manual answer exists). */
export const RESET =
  'cursor-pointer border-0 bg-transparent p-0 text-[12.5px] font-extrabold text-text-tertiary';

const MARK = {
  yes: 'bg-success-surface text-success-text',
  no: 'bg-danger-surface text-danger',
  unsure: 'bg-warning-surface text-warning-text',
  none: 'bg-pale-1 text-text-secondary',
} as const;
const VERDICT: Record<Tone, string> = {
  idle: 'border-tint-border bg-white',
  progress: 'border-tint-border bg-white',
  green: 'border-success-border bg-success-surface',
  amber: 'border-warning-border bg-warning-surface',
  red: 'border-danger-border bg-danger-surface',
};
const ACCENT: Record<Tone, string> = {
  idle: 'text-text-tertiary',
  progress: 'text-blue-safe',
  green: 'text-success-text',
  amber: 'text-warning-text',
  red: 'text-danger',
};
const QUOTA_CHIP = 'inline-flex min-h-[36px] items-center rounded-pill border-[1.5px] px-[15px] text-body-sm font-extrabold no-underline';

/** The pass check (design 1179–1242): five rows (the quota row answered from the store), the
 *  sticky verdict, the fix list and "Send my result". `controls` (TriState / TriStateLook),
 *  `reset`, `bar` (ProgressBar / BarLook) and `send` (the click-time composer / a tracked bare
 *  link) are the only parts that differ between the island and the server fallback. calc.378
 *  holds: nothing here is posted — the state lives in the island (W3). */
export function PassCheckView({
  view,
  labels,
  controls,
  reset,
  bar,
  send,
  live,
}: {
  view: PassView;
  labels: PassLabels;
  controls: Record<ManualRow, ReactNode>;
  reset: ReactNode;
  bar: ReactNode;
  send: ReactNode;
  live: boolean;
}) {
  return (
    <div data-testid="pass-view" data-live={live} className="grid items-start gap-7 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="overflow-hidden rounded-lg border border-tint-border bg-white shadow-[0_18px_44px_rgba(22,60,90,0.10)]">
        <div className="flex items-center justify-between gap-3 border-b border-border-3 bg-pale-2 px-[26px] py-4">
          <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary">{labels.pcK}</span>
          {reset}
        </div>
        <ol className="m-0 list-none px-[26px] pb-2 pt-2 max-md:px-[15px]">
          {view.rows.map((row) => (
            <li key={row.key} className="grid grid-cols-[30px_1fr] items-start gap-3.5 border-b border-border-3 py-[18px]">
              <span
                aria-hidden="true"
                className={`mt-0.5 grid h-[30px] w-[30px] place-items-center rounded-[9px] text-[14px] font-extrabold ${MARK[row.value ?? 'none']}`}
              >
                {row.mark}
              </span>
              <div>
                <p className="m-0 mb-1 text-body font-extrabold text-ink">{row.title}</p>
                <p className="m-0 mb-[11px] text-body-sm text-text-tertiary">{row.body}</p>
                {row.key === 'quota' ? (
                  <a
                    href="#quota"
                    className={
                      view.quotaOk
                        ? `${QUOTA_CHIP} border-success-border bg-success-surface text-success-text`
                        : `${QUOTA_CHIP} border-danger-border bg-danger-surface text-danger`
                    }
                  >
                    {view.quotaOk ? labels.pcClear : labels.pcShort}
                  </a>
                ) : (
                  controls[row.key]
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="m-0 px-[26px] pb-[22px] pt-4 text-body-sm text-text-tertiary max-md:px-[15px]">{labels.pcPriv}</p>
      </div>
      <div className="flex flex-col gap-4 lg:sticky lg:top-5">
        <div
          data-testid="pass-verdict"
          data-tone={view.tone}
          className={`rounded-lg border-[1.5px] px-[26px] py-6 shadow-[0_14px_34px_rgba(22,60,90,0.08)] ${VERDICT[view.tone]}`}
        >
          <p className={`m-0 mb-[9px] text-eyebrow font-extrabold uppercase tracking-[1px] ${ACCENT[view.tone]}`}>{view.kicker}</p>
          <p className="m-0 mb-[9px] text-[25px] font-extrabold leading-[1.2] tracking-[-0.6px] text-ink xl:text-[18.75px]">
            {view.title}
          </p>
          <p className="m-0 mb-4 text-body-sm text-text-secondary">{view.body}</p>
          {bar}
        </div>
        {view.fixes.length > 0 ? (
          <div className="rounded-md border border-tint-border bg-white px-6 py-[22px]">
            <p className="m-0 mb-3 text-body font-extrabold text-ink">{labels.pcFix}</p>
            <ul className="m-0 flex list-none flex-col gap-[11px] p-0">
              {view.fixes.map((f) => (
                <li key={f.key} className="flex items-start gap-[11px] text-body-sm text-text-secondary">
                  <span
                    aria-hidden="true"
                    className={
                      f.unsure
                        ? 'mt-[7px] h-2 w-2 shrink-0 rounded-pill bg-warning'
                        : 'mt-[7px] h-2 w-2 shrink-0 rounded-pill bg-danger'
                    }
                  />
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {send}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/PassCheckIsland.tsx`:

```tsx
'use client';
import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ProgressBar } from '@/design/islands/ProgressBar';
import { TriState } from '@/design/islands/TriState';
import { buttonClassName } from '@/design/primitives/Button';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import type { DesignRole } from '../_lib/card-view';
import { makePassCopy } from '../_lib/copy';
import type { PassLabels } from '../_lib/ids';
import { computePassView, MANUAL_ROWS, type Answers, type ManualRow, type Tone } from '../_lib/pass-check';
import { useEstimateInputs } from './estimate-store';
import { PassCheckView, RESET } from './PassCheckView';
import { WhatsAppComposeLink } from './WhatsAppComposeLink';

export type PassCheckIslandProps = {
  locale: Locale;
  rateConfig: RateConfig;
  roles: DesignRole[];
  roleLabels: Record<string, string>;
  labels: PassLabels;
  whatsappNumber: string;
};

const BAR_TONE: Record<Tone, 'blue' | 'green' | 'amber' | 'red'> = {
  idle: 'blue',
  progress: 'blue',
  green: 'green',
  amber: 'amber',
  red: 'red',
};

/** The five checks in the browser only (calc.378 stays true — nothing is posted, W3); "Send my
 *  result" is the visitor's own WhatsApp click, composed on click (W95). The design's
 *  `passcheck_answer` event is not ported (W12). */
export function PassCheckIsland({ locale, rateConfig, roles, roleLabels, labels, whatsappNumber }: PassCheckIslandProps) {
  const sys = useTranslations('sys');
  const inputs = useEstimateInputs();
  const [answers, setAnswers] = useState<Answers>({});
  const view = computePassView({
    answers,
    inputs,
    roles,
    rateConfig,
    locale,
    roleLabels,
    labels,
    copy: makePassCopy(sys),
  });
  const titleOf = (row: ManualRow) => view.rows.find((r) => r.key === row)?.title ?? row;
  const controls = Object.fromEntries(
    MANUAL_ROWS.map((row) => [
      row,
      <TriState
        key={row}
        name={`calc-check-${row}`}
        legend={titleOf(row)}
        hideLegend
        value={answers[row] ?? null}
        onChange={(value) => setAnswers((prev) => ({ ...prev, [row]: value }))}
        labels={{ yes: labels.pcYes, no: labels.pcNo, unsure: labels.pcMaybe }}
      />,
    ]),
  ) as Record<ManualRow, ReactNode>;
  return (
    <PassCheckView
      view={view}
      labels={labels}
      live
      controls={controls}
      reset={
        <button type="button" onClick={() => setAnswers({})} className={view.manualAnswered ? RESET : `${RESET} invisible`}>
          {labels.pcReset}
        </button>
      }
      bar={<ProgressBar value={view.progressPct} label={labels.vRes} valueText={view.count} tone={BAR_TONE[view.tone]} />}
      send={
        <WhatsAppComposeLink
          number={whatsappNumber}
          text={view.whatsappText}
          testId="pass-send"
          className={buttonClassName('success', 'lg', 'w-full')}
        >
          {labels.pcSend}
        </WhatsAppComposeLink>
      }
    />
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/SalaryGuideView.tsx`:

```tsx
import type { ReactNode } from 'react';
import type { GuideLabels } from '../_lib/ids';
import type { GuideRow } from '../_lib/salary-guide';

const TIER_SKILLED =
  'shrink-0 whitespace-nowrap rounded-pill border border-success-border bg-success-surface px-2.5 py-1 text-[11px] font-extrabold text-success-text';
const TIER_STANDARD =
  'shrink-0 whitespace-nowrap rounded-pill border border-border-1 bg-pale-1 px-2.5 py-1 text-[11px] font-extrabold text-text-secondary';
const USE_ON =
  'min-h-[44px] shrink-0 cursor-pointer whitespace-nowrap rounded-[10px] border border-success-border bg-success-surface px-[13px] text-[12.5px] font-extrabold text-success-text';
const USE_OFF =
  'min-h-[44px] shrink-0 cursor-pointer whitespace-nowrap rounded-[10px] border border-tint-border bg-pale-1 px-[13px] text-[12.5px] font-extrabold text-blue-safe';

/** The salary guide's cards (design 833–864). `filter` is the island's `RadioChips` or the
 *  fallback's `ChipsLook`; `onUse` exists only in the island (the server fallback renders the same
 *  buttons, inert until the island arrives 200 px before view). */
export function SalaryGuideView({
  rows,
  activeKey,
  labels,
  scaleMin,
  scaleMax,
  filter,
  onUse,
  live,
}: {
  rows: GuideRow[];
  activeKey: string;
  labels: GuideLabels;
  scaleMin: string;
  scaleMax: string;
  filter: ReactNode;
  onUse?: (key: string) => void;
  live: boolean;
}) {
  return (
    <div data-testid="guide-view" data-live={live}>
      <div className="mb-[22px]">{filter}</div>
      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => {
          const active = r.key === activeKey;
          return (
            <article
              key={r.key}
              data-role={r.key}
              className={[
                'flex flex-col gap-[15px] rounded-base border-[1.5px] bg-white px-[22px] py-5 transition-shadow',
                active ? 'border-blue-safe shadow-[0_14px_34px_rgba(24,153,213,0.18)]' : 'border-border-2 shadow-card',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0">
                  <h3 className="m-0 text-body font-extrabold leading-[1.3] text-ink">{r.role}</h3>
                  <p className="m-0 mt-0.5 text-body-sm font-bold text-text-tertiary">{r.industryLabel}</p>
                </div>
                <span className={r.skilled ? TIER_SKILLED : TIER_STANDARD}>{r.tier}</span>
              </div>
              <div>
                <div className="mb-[9px] flex flex-wrap items-baseline gap-2">
                  <span className="whitespace-nowrap text-[19px] font-extrabold tracking-[-0.4px] text-ink xl:text-[14.25px]">
                    {r.range}
                  </span>
                  <span className="whitespace-nowrap text-[12px] font-bold text-text-tertiary">{labels.sGrossMo}</span>
                </div>
                <div aria-hidden="true" className="relative h-2 rounded-pill bg-border-3">
                  <div
                    className="absolute inset-y-0 rounded-pill bg-[linear-gradient(90deg,#1899d5_0%,#5cc0ef_100%)]"
                    style={{ left: `${r.barLeftPct}%`, width: `${r.barWidthPct}%` }}
                  />
                  <div className="absolute -inset-y-1 w-0.5 rounded-[1px] bg-ink" style={{ left: `${r.tickPct}%` }} />
                </div>
                <div aria-hidden="true" className="mt-[7px] flex justify-between text-[11.5px] font-bold text-text-tertiary">
                  <span>{scaleMin}</span>
                  <span>{scaleMax}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2.5 border-t border-border-3 pt-[13px]">
                <div>
                  <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.7px] text-text-tertiary">{labels.sEmpCost}</p>
                  <p className="m-0 mt-0.5 text-body-sm font-extrabold text-blue-safe">{r.employer}</p>
                </div>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={onUse ? () => onUse(r.key) : undefined}
                  className={active ? USE_ON : USE_OFF}
                >
                  {active ? labels.inCalc : labels.useCalc}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/SalaryGuideIsland.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import { RadioChips } from '@/design/primitives/RadioChips';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import type { DesignRole } from '../_lib/card-view';
import { CALC_ARM_EVENT } from '../_lib/events';
import type { GuideLabels } from '../_lib/ids';
import { buildGuideRows } from '../_lib/salary-guide';
import { setEstimateInputs, useEstimateInputs } from './estimate-store';
import { SalaryGuideView } from './SalaryGuideView';

export type SalaryGuideIslandProps = {
  locale: Locale;
  roles: DesignRole[];
  rateConfig: RateConfig;
  labels: GuideLabels;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  scaleMin: string;
  scaleMax: string;
};

/** The guide follows the calculator's tier (W59) and its role; "Use in calculator" sets the role,
 *  asks the card to load (CALC_ARM_EVENT) and scrolls to it — the design's
 *  `calc_role_from_guide` becomes a plain `calculator_use` with the role key (W12). */
export function SalaryGuideIsland({
  locale,
  roles,
  rateConfig,
  labels,
  roleLabels,
  industryLabels,
  scaleMin,
  scaleMax,
}: SalaryGuideIslandProps) {
  const sys = useTranslations('sys');
  const page = usePathname() ?? '/';
  const uiLocale = useLocale();
  const inputs = useEstimateInputs();
  const [industry, setIndustry] = useState('all');
  const rows = buildGuideRows({
    roles,
    rateConfig,
    tier: inputs.sgkTier,
    locale,
    roleLabels,
    industryLabels,
    labels: { skilled: labels.skilled, standard: labels.standard },
  });
  const industries = [...new Set(roles.map((r) => r.industry))];
  const use = (key: string) => {
    setEstimateInputs({ roleKey: key, grossSalary: null });
    track('calculator_use', { page, locale: uiLocale, role: key, headcount: inputs.headcount });
    window.dispatchEvent(new Event(CALC_ARM_EVENT));
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('calculator')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <SalaryGuideView
      rows={rows.filter((r) => industry === 'all' || r.industry === industry)}
      activeKey={inputs.roleKey}
      labels={labels}
      scaleMin={scaleMin}
      scaleMax={scaleMax}
      onUse={use}
      live
      filter={
        <RadioChips
          name="calc-guide-industry"
          legend={sys('calc.a11y.industries')}
          legendHidden
          value={industry}
          onChange={setIndustry}
          options={[
            { value: 'all', label: labels.allInd },
            ...industries.map((i) => ({ value: i, label: industryLabels[i] ?? i })),
          ]}
        />
      }
    />
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/RecapIsland.tsx`:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import { computeCardView, type CardViewLabels, type DesignRole } from '../_lib/card-view';
import { makeCardCopy } from '../_lib/copy';
import type { RecapLabels } from '../_lib/ids';
import { useEstimateInputs } from './estimate-store';
import { RecapCard } from './RecapCard';

export type RecapIslandProps = {
  locale: Locale;
  rateConfig: RateConfig;
  roles: DesignRole[];
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  cardLabels: CardViewLabels;
  labels: RecapLabels;
};

/** The closing band's phone recap (design .ja-cta-mob) following the calculator. */
export function RecapIsland({ locale, rateConfig, roles, roleLabels, industryLabels, cardLabels, labels }: RecapIslandProps) {
  const sys = useTranslations('sys');
  const inputs = useEstimateInputs();
  const view = computeCardView({
    inputs,
    roles,
    rateConfig,
    locale,
    roleLabels,
    industryLabels,
    labels: cardLabels,
    copy: makeCardCopy(sys),
  });
  return <RecapCard view={view} labels={labels} />;
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/LiveSgkRate.tsx`:

```tsx
'use client';
import type { SgkTier } from '@/lib/calculator/types';
import { useEstimateInputs } from './estimate-store';

/** calc.359/360's live rate on the phone incentives card (design im1a + sgkRate + im1b): the three
 *  tier labels are formatted on the server (D18); this picks the one the calculator holds. Eager
 *  (it sits inside a sentence), so it imports the store and nothing heavier. */
export function LiveSgkRate({ rates }: { rates: Record<SgkTier, string> }) {
  const { sgkTier } = useEstimateInputs();
  return <strong className="font-extrabold text-white">{rates[sgkTier]}</strong>;
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/LazyBinders.tsx`:

```tsx
'use client';
import type { ReactNode } from 'react';
import type { StickyCta } from '@/design/chrome/StickyCtaBar';
import { LazyIsland } from '@/design/islands/LazyIsland';
import type { PassCheckIslandProps } from './PassCheckIsland';
import type { QuotaIslandProps } from './QuotaIsland';
import type { RecapIslandProps } from './RecapIsland';
import type { SalaryGuideIslandProps } from './SalaryGuideIsland';

// W13 amended / W132: each island loads once, 200 px before its wrapper enters the viewport, and
// stays mounted; the server fallback (built from the same directive-less views) shows until then.
// A server page cannot pass `load` (a function) to a client component, so the thunks live in this
// one small eager module; the type-only imports keep every island out of it. The explicit
// `LazyIsland<P>` generic: inferring P through `.then` on a named export widens (T2's finding).
const loadQuota = () => import('./QuotaIsland').then((m) => ({ default: m.QuotaIsland }));
const loadPass = () => import('./PassCheckIsland').then((m) => ({ default: m.PassCheckIsland }));
const loadGuide = () => import('./SalaryGuideIsland').then((m) => ({ default: m.SalaryGuideIsland }));
const loadRecap = () => import('./RecapIsland').then((m) => ({ default: m.RecapIsland }));
const loadSticky = () => import('@/design/chrome/StickyCtaBar').then((m) => ({ default: m.StickyCtaBar }));

export function QuotaLoader({ fallback, ...props }: QuotaIslandProps & { fallback: ReactNode }) {
  return <LazyIsland<QuotaIslandProps> load={loadQuota} props={props} fallback={fallback} />;
}
export function PassCheckLoader({ fallback, ...props }: PassCheckIslandProps & { fallback: ReactNode }) {
  return <LazyIsland<PassCheckIslandProps> load={loadPass} props={props} fallback={fallback} />;
}
export function SalaryGuideLoader({ fallback, ...props }: SalaryGuideIslandProps & { fallback: ReactNode }) {
  return <LazyIsland<SalaryGuideIslandProps> load={loadGuide} props={props} fallback={fallback} />;
}
export function RecapLoader({ fallback, ...props }: RecapIslandProps & { fallback: ReactNode }) {
  return <LazyIsland<RecapIslandProps> load={loadRecap} props={props} fallback={fallback} />;
}

type StickyProps = {
  message: string;
  ctas: StickyCta[];
  showAfterPx?: number;
  hideNearId?: string;
  live?: boolean;
};

/** The sticky bar renders `null` until the visitor is past `showAfterPx`, so `null` is its
 *  DOM-identical fallback. The page mounts this after `#basis` — below the audit's first
 *  viewport — so the bar's chunk loads during the first scroll, before the 700 px threshold.
 *  The margin reaches 100,000 px ABOVE the viewport: an anchor jump past the wrapper (the card's
 *  "Check your quota →", a `#faq` link, a reload at a hash) never sees it cross the viewport, and
 *  a plain 200 px margin would then never load the bar; with the top margin, "at or past this
 *  point" is what counts, while the first viewport (the wrapper sits below it) still loads
 *  nothing. */
const STICKY_MARGIN = '100000px 0px 200px 0px';

export function LazyStickyBar(props: StickyProps) {
  return (
    <LazyIsland<StickyProps>
      load={loadSticky}
      props={props}
      fallback={null}
      rootMargin={STICKY_MARGIN}
    />
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hiring-cost-calculator/_components"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `islands.test.tsx` 9 green; `client-messages.test.ts` green (`QuotaIsland` reads `calc.a11y.*`, `SalaryGuideIsland` `calc.a11y.industries` — literals; the factories get the translator itself); `client-imports.test.ts` green (every island by path; `LazyBinders` reaches the islands only through `import()`); `class-collisions.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator/_components"
git commit -m "feat(calc): in-view islands — quota gate, pass check, salary guide, recap — and the W95 composer

Each island shares its view with the server fallback (DOM-matched, W132) and loads 200 px
before view through LazyIsland binders (W13 amended); Gate 1 writes the shared store (Stepper
commits on Enter/blur, W131); the pass check never posts and composes its WhatsApp prefill on
click (W95); the guide follows the chosen tier (W59).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 6 — the page: server sections, `page.tsx` (metadata, `revalidate`, `#calculator`), the route registration, the page e2e contract, the SEO/analytics/PRD/ARCHITECTURE docs

Everything under `_sections/` is a directive-less server component that receives one resolved context (`CalcCtx`, built once per request by `_sections/context.ts`) and renders the islands of Cycles 3–5 with their server fallbacks, so it renders under jsdom with the real LOCAL bundle (no `IntersectionObserver` there: every `LazyIsland` keeps its fallback — exactly the first paint). `page.tsx` only resolves the context and composes. The ≤ 700 px accordion is one small client toggle (`_components/SectionToggle.tsx`, eager ≈ 0.4 KB); the section's own `h2` + subtitle sit OUTSIDE the toggled body as `max-md:sr-only`, so the outline is identical at every width (W10, delta 7). Every import is by module path (W125/W130/W134/W147/W156); every class string obeys W119/W122/W155 (Step 4's `class-collisions.test.ts` walks these files); no caller class reaches `ImageSlot`'s box (W129 — the hero slot is wrapped); every text colour on a `pale-1` surface is `text-text-secondary` (4.5:1), `text-text-tertiary` only on white/`pale-2`/`pale-3` (D20).

Composition (the design's order, `Hiring Cost Calculator.dc.html` 559–1553): hero + `#calculator` card → phone jump chips → `#basis` → (the lazy sticky bar's wrapper) → `#salaries` → `#compare` → `#quota` → `#passcheck` → `#incentives` → `#penalties` → `#students` → `#faq` → `#calc-cta` → the quote sheet host. Section surfaces follow the design: white (`light`) for basis/compare/passcheck/penalties/faq, `pale` for salaries/quota/incentives/students, the pale gradient band for `#calc-cta`.

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/__tests__/sections.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTranslator, type Messages } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY_DELTAS } from '@/lib/calculator/copy-deltas';
import { formatTRY } from '@/lib/format/money';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { CalcSection } from '../CalcSection';
import { ClosingBand } from '../ClosingBand';
import {
  Basis,
  Compare,
  Faq,
  Incentives,
  JumpChips,
  PassCheck,
  Penalties,
  Quota,
  Salaries,
  Students,
} from '../content';
import { buildCalcCtx, type CalcCtx } from '../context';
import { CalculatorCard, Hero } from '../Hero';

// `context.ts` is `server-only` (an empty module under Vitest): its loader reads the request
// through next-intl and the adapter, stubbed here — only the pure `buildCalcCtx` runs.
vi.mock('next-intl/server', () => ({ getTranslations: vi.fn() }));
vi.mock('@/content/adapter', async () => ({
  ...(await import('@/content/pure')),
  getBundle: vi.fn(),
}));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/maliyet-hesaplayici',
}));

// R56: the generated bundles are read from disk, never imported.
const load = (locale: 'tr' | 'en'): Bundle =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
const MESSAGES = { tr: tr as Messages, en: en as Messages };
const ctxFor = (locale: 'tr' | 'en'): CalcCtx =>
  buildCalcCtx(
    load(locale),
    locale,
    createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys' }),
  );
const TR = ctxFor('tr');
const EN = ctxFor('en');
const NO_ROLES: CalcCtx = { ...TR, roles: [], defaultView: null };
const WA = `https://wa.me/${TR.settings.whatsappNumber}`;
const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
/** A COPY_DELTAS model figure (W142/W143) — the page's numbers are pinned to it. */
const model = (id: string) => {
  const row = COPY_DELTAS.find((r) => r.id === id);
  if (!row) throw new Error(`COPY_DELTAS has no row "${id}"`);
  return row.model;
};
const jsonLd = (root: HTMLElement) =>
  [...root.querySelectorAll('script[type="application/ld+json"]')].map(
    (s) => JSON.parse(s.textContent ?? '{}') as Record<string, unknown>,
  );
const ids = (list: string[]) => list.map((id) => TR.t(id));

afterEach(() => {
  vi.useRealTimers();
});

describe('buildCalcCtx — the page’s one server read', () => {
  it('resolves the 12 design roles, the default view at the COPY_DELTAS model and locale-sorted countries', () => {
    expect(TR.roles).toHaveLength(12);
    expect(TR.roles.some((r) => r.preset)).toBe(false); // W24: the teaser presets never appear
    expect(TR.defaultView?.f.monthly.total).toBe(
      formatTRY(model('Hiring Cost Calculator.dc.html:2598 (mTotal, initial render)'), 'tr'),
    );
    expect(EN.defaultView?.f.contract.total).toBe(
      formatTRY(model('Hiring Cost Calculator.dc.html:2603 (yearTotal, initial render)'), 'en'),
    );
    const names = TR.countries.map((c) => c.label);
    expect(names).toEqual([...names].sort(new Intl.Collator('tr-TR').compare));
    expect(TR.countries.every((c) => /^[A-Z]{2}$/.test(c.value))).toBe(true);
  });

  it('fills the metric placeholders through makeTf (W1) and hands islands only the labels they need', () => {
    expect(TR.labels.sheet.intro).not.toMatch(/\{|calc\.\d{3}/); // calc.050 carries {homepageReplyHours}
    expect(TR.labels.recap.zFee).not.toMatch(/\{/); // calc.104
    expect(TR.labels.cardView).toEqual({
      perWorker: TR.t('calc.463'),
      fullYear: TR.t('calc.470'),
      firstYear: TR.t('calc.469'),
      perMonthSuffix: TR.t('calc.464'),
    });
  });
});

describe('Hero + CalculatorCard', () => {
  it('one h1 = the LCP slot, the calc-hero placeholder (never the LCP), W109 breadcrumbs, one BreadcrumbList', () => {
    const { container } = renderWithIntl(
      <Hero ctx={TR}>
        <CalculatorCard ctx={TR} />
      </Hero>,
    );
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1.textContent).toBe("Türkiye'de yabancı bir işçi gerçekte ne kadara mal olur?");
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    const slot = container.querySelector('[data-placeholder="calc-hero"]');
    expect(slot).not.toBeNull();
    expect(slot).not.toHaveAttribute('data-lcp-slot');
    const nav = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(nav).getByRole('link', { name: TR.t('calc.001') })).toHaveAttribute('href', '/');
    expect(within(nav).getByText(TR.t('calc.002'))).toHaveAttribute('aria-current', 'page');
    expect(jsonLd(container).filter((n) => n['@type'] === 'BreadcrumbList')).toHaveLength(1);
  });

  it('shows the D17 badge from rateConfig until reviewDueAt, then hides it (W150)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-28T12:00:00Z'));
    const first = renderWithIntl(<Hero ctx={TR}>{null}</Hero>);
    expect(screen.getByTestId('calc-badge')).toHaveTextContent(
      '2026 oranları · Ocak 2026 güncellemesi',
    );
    first.unmount();
    vi.setSystemTime(new Date(`${TR.rateConfig.reviewDueAt}T00:00:00Z`));
    renderWithIntl(<Hero ctx={TR}>{null}</Hero>);
    expect(screen.queryByTestId('calc-badge')).toBeNull();
  });

  it('EN: the badge reads exactly calc.003 at the seeded rates', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-28T12:00:00Z'));
    renderWithIntl(<Hero ctx={EN}>{null}</Hero>, { locale: 'en' });
    expect(screen.getByTestId('calc-badge')).toHaveTextContent(EN.t('calc.003'));
  });

  it('the card carries #calculator + print-isolate and paints the skeleton at the model defaults (W13 amended/W152)', () => {
    const { container } = renderWithIntl(<CalculatorCard ctx={TR} />);
    const card = container.querySelector('#calculator');
    expect(card).not.toBeNull();
    expect(tokens(card!)).toContain('print-isolate');
    expect(screen.getByTestId('calc-card')).toHaveAttribute('data-island', 'idle');
    expect(screen.getByTestId('calc-monthly-total')).toHaveTextContent('60.321 ₺');
    expect(screen.getByTestId('calc-year-total')).toHaveTextContent('751.852 ₺');
    expect(screen.getByText(TR.t('calc.040'))).toBeInTheDocument();
  });

  it('without design roles the card is the designed empty state, its CTA an object Href to the band (W82)', () => {
    renderWithIntl(<CalculatorCard ctx={NO_ROLES} />);
    const empty = screen.getByTestId('calc-empty');
    expect(within(empty).getByRole('heading', { level: 2 })).toHaveTextContent(
      tr.sys.calc.empty.title,
    );
    expect(within(empty).getByRole('link', { name: TR.t('calc.105') })).toHaveAttribute(
      'href',
      '/maliyet-hesaplayici#calc-cta',
    );
  });
});

describe('CalcSection — the ≤ 700 px accordion (W10)', () => {
  it('keeps the h2 pair in the accessibility tree and toggles the body through data-open', async () => {
    const { container } = renderWithIntl(
      <CalcSection
        id="basis"
        tone="light"
        testId="calc-basis"
        toggle={{ title: 'Trigger', subtitle: 'Subtitle' }}
        head={{ title: 'Heading', sub: 'Sub' }}
      >
        <p>body</p>
      </CalcSection>,
    );
    expect(container.querySelector('section#basis')).not.toBeNull();
    const h2 = screen.getByRole('heading', { level: 2, name: 'Heading' });
    expect(tokens(h2.parentElement!)).toContain('max-md:sr-only');
    const toggle = screen.getByRole('button', { name: /Trigger/ });
    expect(tokens(toggle)).toContain('md:hidden');
    const body = within(screen.getByTestId('calc-basis')).getByTestId('section-body');
    expect(toggle).toHaveAttribute('aria-controls', body.id);
    expect(body).toHaveAttribute('data-open', 'false');
    expect(tokens(body)).toContain('max-md:hidden');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(body).toHaveAttribute('data-open', 'true');
    expect(tokens(body)).not.toContain('max-md:hidden');
  });
});

describe('the section bodies (real TR bundle; every island shows its server fallback)', () => {
  it('JumpChips: a labelled phone-only nav of the six design anchors', () => {
    renderWithIntl(<JumpChips ctx={TR} />);
    const nav = screen.getByRole('navigation', { name: tr.sys.calc.jump.label });
    expect(tokens(nav)).toContain('md:hidden');
    expect(
      within(nav)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['#salaries', '#quota', '#incentives', '#passcheck', '#penalties', '#faq']);
  });

  it('Basis: four source cards, the note, the "last updated" pill from rateConfig (D17), the Work Permit link', () => {
    renderWithIntl(<Basis ctx={TR} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      ids(['calc.078', 'calc.080', 'calc.082', 'calc.085']),
    );
    expect(screen.getByTestId('calc-updated')).toHaveTextContent('15 Ocak 2026');
    expect(screen.getByRole('link', { name: TR.t('calc.084') })).toHaveAttribute(
      'href',
      '/calisma-izni',
    );
    expect(screen.getByText(TR.t('calc.087')).closest('p')?.textContent).toBe(
      `${TR.t('calc.087')} ${TR.t('calc.088')}`,
    );
  });

  it('Salaries: the legend’s minimum wage from rateConfig, the guide fallback at the model floor (W2/W59)', () => {
    const { container } = renderWithIntl(<Salaries ctx={TR} />);
    expect(container.textContent).toContain(`${TR.t('calc.094')} 33.030 ₺`);
    const guide = screen.getByTestId('guide-view');
    expect(guide).toHaveAttribute('data-live', 'false');
    const cards = within(guide).getAllByRole('article');
    expect(cards).toHaveLength(12);
    const welder = cards.find((a) => a.dataset.role === 'welder')!;
    expect(welder).toHaveTextContent(`${formatTRY(model('calc.557'), 'tr')} – `); // 49.545 ₺, never 50.000
    expect(welder).toHaveTextContent(
      formatTRY(model('Hiring Cost Calculator.dc.html:2718 (salary guide employer cost)'), 'tr'),
    );
  });

  it('Compare: a real table (seven row headers, desktop only), the phone short answer, the spread from rateConfig', () => {
    renderWithIntl(<Compare ctx={TR} />);
    const table = screen.getByRole('table');
    expect(
      within(table)
        .getAllByRole('rowheader')
        .map((th) => th.textContent),
    ).toEqual(ids(['calc.195', 'calc.200', 'calc.204', 'calc.208', 'calc.212', 'calc.216', 'calc.221']));
    expect(tokens(table.parentElement!)).toContain('max-md:hidden');
    expect(screen.getByTestId('calc-compare-mobile').textContent).toContain(
      'Maaş ve SGK, yerli ve yurt dışından işe alımda birebir aynıdır. Yalnızca iki şey değişir.',
    );
    const spread = screen.getByTestId('calc-spread');
    expect(spread).toHaveTextContent('28.000 ₺'); // permitFeeTRY + flightTRY (delta 6)
    expect(spread).toHaveTextContent('2.333 ₺ / ay');
    expect(spread).toHaveTextContent('778 ₺ / ay');
  });

  it('Quota: both Gate 1 fallbacks at 25 staff (calc.558), the exemptions tabs with the sys badges', async () => {
    renderWithIntl(<Quota ctx={TR} />);
    expect(screen.getByTestId('quota-view')).toHaveAttribute('data-live', 'false');
    expect(screen.getByTestId('quota-allowed')).toHaveTextContent('5 yabancı işçi');
    expect(screen.getByTestId('quota-viz-note')).toHaveTextContent(TR.t('calc.558'));
    expect(screen.getByTestId('quota-allowed-m')).toHaveTextContent('5 yabancı işçi');
    const ex = screen.getByTestId('calc-exemptions');
    expect(
      within(ex)
        .getAllByRole('tab')
        .map((tab) => tab.textContent),
    ).toEqual(ids(['calc.430', 'calc.431', 'calc.432']));
    const panel = within(ex).getByRole('tabpanel');
    expect(panel).toHaveTextContent(TR.t('calc.549'));
    expect(panel).toHaveTextContent(tr.sys.calc.exemptions.tenStaff);
    await userEvent.click(within(ex).getByRole('tab', { name: TR.t('calc.431') }));
    expect(within(ex).getByRole('tabpanel')).toHaveTextContent(tr.sys.calc.exemptions.full);
  });

  it('PassCheck: the server fallback at the defaults (calc.561) with the bare WhatsApp href (W95); nothing is a form', () => {
    renderWithIntl(<PassCheck ctx={TR} />);
    expect(screen.getByTestId('pass-view')).toHaveAttribute('data-live', 'false');
    expect(screen.getByTestId('pass-verdict')).toHaveAttribute('data-tone', 'idle');
    expect(screen.getByText(TR.t('calc.561'))).toBeInTheDocument();
    expect(screen.getByTestId('pass-send')).toHaveAttribute('href', WA);
    expect(document.querySelector('form')).toBeNull();
  });

  it('PassCheck renders nothing without design roles', () => {
    const { container } = renderWithIntl(<PassCheck ctx={NO_ROLES} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Incentives: the three SGK rates and the ten-worker support from rateConfig (D17); the phone card’s live rate', () => {
    const { container } = renderWithIntl(<Incentives ctx={TR} />);
    expect(
      within(screen.getByTestId('calc-sgk-rates'))
        .getAllByRole('definition')
        .map((d) => d.textContent),
    ).toEqual(['%23,75', '%21,75', '%18,75']);
    expect(container.textContent).toContain('12.700 ₺'); // formatTRY(10 × supportMonthly); the package's "₺12.700" leads with the sign
    expect(screen.getByTestId('calc-incentives-mobile')).toHaveTextContent('%21,75');
  });

  it('Penalties: calc.408 inside the fine sentence, the <br /> labels, the consequence cards at every width', () => {
    const { container } = renderWithIntl(<Penalties ctx={TR} />);
    expect(container.textContent).toContain(`${TR.t('calc.408')}'ye çıkar.`);
    expect(container.querySelectorAll('dt br')).toHaveLength(2);
    const consequences = screen.getByTestId('calc-consequences');
    expect(tokens(consequences)).not.toContain('max-md:hidden');
    expect(within(consequences).getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('Students: the package’s own tier subtitles (calc.263/271), the phone rules list with the amber last row', () => {
    renderWithIntl(<Students ctx={TR} />);
    expect(screen.getAllByText(TR.t('calc.263')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(TR.t('calc.271')).length).toBeGreaterThan(0);
    const rows = within(screen.getByTestId('calc-students-rules')).getAllByRole('listitem');
    expect(rows).toHaveLength(4);
    expect(tokens(rows[3])).toContain('bg-warning-surface');
  });

  it('Faq: one FAQPage of the 15 pairs, the ask card’s generic WhatsApp prefill and the e-mail row (W83, W95)', () => {
    const { container } = renderWithIntl(<Faq ctx={TR} />);
    const faq = jsonLd(container).filter((n) => n['@type'] === 'FAQPage');
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(15);
    expect(screen.getByRole('link', { name: TR.t('calc.052') })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tr.sys.calc.whatsapp.generic)}`,
    );
    expect(screen.getByRole('link', { name: TR.t('calc.406') })).toHaveAttribute(
      'href',
      `mailto:${TR.settings.email}?subject=${encodeURIComponent(TR.t('calc.002'))}`,
    );
    expect(container.textContent).not.toMatch(/\{homepageReplyHours\}/); // calc.381 via makeTf (W1)
  });

  it('ClosingBand: #calc-cta, the band quote button, the phone recap fallback, Available Workers, the tracked e-mail', () => {
    const { container } = renderWithIntl(<ClosingBand ctx={TR} />);
    expect(container.querySelector('section#calc-cta')).not.toBeNull();
    expect(screen.getByTestId('calc-quote-open-band')).toHaveTextContent(TR.t('calc.105'));
    const recap = screen.getByTestId('calc-recap');
    expect(tokens(recap)).toContain('md:hidden');
    expect(within(recap).getByTestId('recap-total')).toHaveTextContent('751.852 ₺');
    expect(screen.getByRole('link', { name: TR.t('calc.106') })).toHaveAttribute('href', '/adaylar');
    expect(screen.getByRole('link', { name: TR.settings.email })).toHaveAttribute(
      'href',
      `mailto:${TR.settings.email}`,
    );
  });
});

describe('page.tsx (static checks — the page itself is proven by the Cycle 7 build + gate)', () => {
  const source = () =>
    readFileSync(
      join(process.cwd(), 'src/app/[locale]/(site)/hiring-cost-calculator/page.tsx'),
      'utf8',
    );
  it('revalidates daily for the D17 badge (W150) and builds its metadata from sys.seo.calc (W23/W38)', () => {
    const src = source();
    expect(src).toMatch(/^export const revalidate = 86400;$/m);
    expect(src).toContain("pageKey: 'calc'");
    expect(src).toContain("fallbackTitle: sys('seo.calc.title')");
    expect(src).toContain("fallbackDescription: sys('seo.calc.description')");
  });
  it('mounts the sticky bar only through the lazy binder, hidden near #calc-cta (W18/W13 amended)', () => {
    const src = source();
    expect(src).toContain('<LazyStickyBar');
    expect(src).toContain('hideNearId="calc-cta"');
    expect(src).toMatch(/^import type \{ StickyCta \} from '@\/design\/chrome\/StickyCtaBar';$/m);
  });
});
```

`e2e/pages/calc.spec.ts` (runs under both Playwright projects inside the Cycle 7 gate — `mobile` = Pixel 7, 412 px, the design's ≤ 700 px layout; `desktop` = 1440 px; no door and no `OPS_API_URL` needed, W92):

```ts
import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

type BundleJson = {
  strings: Record<string, string>;
  settings: { whatsappNumber: string; email: string };
  collections: { rateConfig: { reviewDueAt: string }[] };
};
type MessagesJson = { sys: { seo: { calc: { title: string } }; calc: { whatsapp: { generic: string } } } };
// The committed LOCAL bundles and message catalogues are the data these assertions follow, read
// with `readFileSync` like the contract tests (D23's import rule covers `src/**`; the running
// site loads bundles only through the adapter).
const read = <T>(path: string) => JSON.parse(readFileSync(path, 'utf8')) as T;
const BUNDLE = {
  tr: read<BundleJson>('src/content/local/bundle.tr.json'),
  en: read<BundleJson>('src/content/local/bundle.en.json'),
};
const MSG = {
  tr: read<MessagesJson>('src/messages/tr.json'),
  en: read<MessagesJson>('src/messages/en.json'),
};
const s = (locale: 'tr' | 'en', id: string) => BUNDLE[locale].strings[id];
const ROUTES = { tr: '/maliyet-hesaplayici', en: '/en/hiring-cost-calculator' } as const;
const ORIGIN = 'https://www.jobsadmire.com';
const WA = `https://wa.me/${BUNDLE.tr.settings.whatsappNumber}`;
/** COPY_DELTAS model figures at the design defaults — welder × 1, full year, `other` tier (W142). */
const TOTALS = {
  tr: { monthly: '60.321 ₺', year: '751.852 ₺', five: '301.605 ₺' },
  en: { monthly: '₺60,321', year: '₺751,852', five: '₺301,605' },
} as const;
const BADGE = { tr: '2026 oranları · Ocak 2026 güncellemesi', en: s('en', 'calc.003') } as const;
const reviewDue =
  Date.now() >= Date.parse(`${BUNDLE.tr.collections.rateConfig[0].reviewDueAt}T00:00:00Z`);
const LEAK = /\{[a-zA-Z]+\}|undefined|\[object |\bcalc\.\d{3}\b/;
const isMobile = () => test.info().project.name === 'mobile';
/** W92: the door variables reach only production and `staging`; every other target answers a
 *  valid submit with the D11 panel (`unauthorized`), deterministically. On a door face the
 *  submitting case skips — T14 owns real submissions. */
const DOOR_HOSTS = new Set(['jobsadmire.com', 'www.jobsadmire.com', 'staging.jobsadmire.com']);
const doorOn = () =>
  DOOR_HOSTS.has(
    new URL(test.info().project.use.baseURL ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000')
      .hostname,
  );

const dataLayer = (page: Page, event: string) =>
  page.evaluate(
    (name) =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
        (entry) => entry.event === name,
      ),
    event,
  );
/** W76/W95: capture the click-time WhatsApp URL instead of opening a tab. */
const stubWindowOpen = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
const opened = (page: Page) =>
  page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
type JsonLdNode = Record<string, unknown> & { '@type'?: string };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((text) => {
    const parsed = JSON.parse(text) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}
/** ≤ 700 px every content section waits behind its trigger (W10); open it, then bring it into
 *  view — the island inside loads 200 px before view (W13 amended). */
async function openSection(page: Page, id: string) {
  const toggle = page.locator(`#${id} button[aria-expanded]`).first();
  if ((await toggle.isVisible()) && (await toggle.getAttribute('aria-expanded')) === 'false')
    await toggle.click();
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
}

for (const locale of ['tr', 'en'] as const) {
  const route = ROUTES[locale];

  test(`${locale}: one h1 holding the only data-lcp-slot, the calc-hero placeholder, the dated badge, no leaked ids or tokens (D17/D26/W1/W55)`, async ({
    page,
  }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    await expect(h1).toHaveText(
      `${s(locale, 'calc.004')} ${s(locale, 'calc.005')} ${s(locale, 'calc.006')}`,
    );
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder="calc-hero"]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder=""]')).toHaveCount(0);
    if (reviewDue) await expect(page.getByTestId('calc-badge')).toHaveCount(0);
    else await expect(page.getByTestId('calc-badge')).toHaveText(BADGE[locale]);
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);
  });

  test(`${locale}: #calculator is in the server HTML and the header CTA targets it; every section anchor exists once (W152/W158)`, async ({
    page,
  }) => {
    const html = await (await page.request.get(route)).text();
    expect(html).toContain('id="calculator"');
    await page.goto(route);
    for (const id of [
      'calculator',
      'basis',
      'salaries',
      'compare',
      'quota',
      'passcheck',
      'incentives',
      'penalties',
      'students',
      'faq',
      'calc-cta',
    ])
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    await expect(page.locator('#calculator')).toHaveClass(/\bprint-isolate\b/);
    const cta = page
      .getByRole('banner')
      .getByRole('link', { name: s(locale, 'calc.324'), exact: true })
      .first();
    await expect(cta).toHaveAttribute('href', `${route}#calculator`);
  });

  test(`${locale}: canonical, the hreflang pair, the calc OG image, sys.seo title; one BreadcrumbList and one FAQPage (W109/W123)`, async ({
    page,
  }) => {
    await page.goto(route);
    const other = locale === 'tr' ? 'en' : 'tr';
    await expect(page).toHaveTitle(MSG[locale].sys.seo.calc.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}${route}`);
    await expect(page.locator(`link[rel="alternate"][hreflang="${other}"]`)).toHaveAttribute(
      'href',
      `${ORIGIN}${ROUTES[other]}`,
    );
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
      'content',
      `${ORIGIN}/og/${locale}/calc.png`,
    );
    const nodes = await jsonLdNodes(page);
    const faq = nodes.filter((n) => n['@type'] === 'FAQPage');
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(15);
    const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList') as unknown as {
      itemListElement: { name: string; item: string }[];
    }[];
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].itemListElement.map((i) => i.name)).toEqual([
      s(locale, 'calc.001'),
      s(locale, 'calc.002'),
    ]);
    expect(crumbs[0].itemListElement[1].item).toBe(`${ORIGIN}${route}`);
  });

  test(`${locale}: the skeleton paints the model before any interaction; the island loads on focus, recomputes and tracks the role key (W13 amended/W142/W12)`, async ({
    page,
  }) => {
    await page.goto(route);
    const card = page.getByTestId('calc-card');
    await expect(card).toHaveAttribute('data-island', 'idle');
    await expect(page.getByTestId('calc-monthly-total')).toHaveText(TOTALS[locale].monthly);
    await expect(page.getByTestId('calc-year-total')).toHaveText(TOTALS[locale].year);
    await expect(page.getByTestId('calc-island')).toHaveCount(0);
    // Arm first and wait for the island: a click that lands while the skeleton swaps could be lost.
    await page.getByTestId('calc-activate').focus();
    const island = page.getByTestId('calc-island');
    await expect(island).toBeVisible();
    await expect(card).toHaveAttribute('data-island', 'armed');
    await island.getByText('5', { exact: true }).click();
    await expect(page.getByTestId('calc-monthly-total')).toHaveText(TOTALS[locale].five);
    expect((await dataLayer(page, 'calculator_use')).at(-1)).toMatchObject({
      page: route,
      locale,
      role: 'welder',
      headcount: 5,
    });
  });
}

test('tr: opening the page at #calculator loads the island without a touch (the header CTA, W17)', async ({
  page,
}) => {
  await page.goto(`${ROUTES.tr}#calculator`);
  await expect(page.getByTestId('calc-island')).toBeVisible();
});

test('tr: the band opens the quote sheet; a valid submit ends on the D11 panel without a door; its WhatsApp href is bare (W3/W79/W92/W76/W95)', async ({
  page,
}) => {
  test.skip(doorOn(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  await page.getByTestId('calc-quote-open-band').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByTestId('recap-total')).toHaveText(TOTALS.tr.year);
  const form = dialog.getByTestId('calc-quote-form');
  await expect(form).toHaveAttribute('data-form-key', 'calculator');
  await expect(form.locator('input[name="est_role"]')).toHaveValue('welder');
  await expect(form.locator('input[name="est_headcount"]')).toHaveValue('1');
  const submit = form.getByRole('button', { name: s('tr', 'calc.105'), exact: true });
  // 1. Empty submit → field errors (name, e-mail, the consent tick), no navigation.
  await submit.click();
  await expect(form.getByRole('alert').first()).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  // 2. Valid submit → no door → the fallback panel (D11), still no navigation.
  await form.getByLabel(/^Ad Soyad/).fill('Test Ziyaretçi');
  await form.getByLabel(/^E-posta/).fill('test@example.com');
  await form.locator('#f-calc-quote-consent').check();
  await submit.click();
  const panel = dialog.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  // 3. The prefill (the estimate + what was typed) exists only in the window the click opens.
  const wa = panel.getByRole('link', { name: /WhatsApp/ });
  await expect(wa).toHaveAttribute('href', WA);
  await stubWindowOpen(page);
  await wa.click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  const text = decodeURIComponent(urls[0].split('?text=')[1]);
  expect(
    text.startsWith(
      'Merhaba JobsAdmire, maliyet hesaplayıcıyı kullandım: 1 × Kaynakçı, brüt 49.545 ₺, 12 aylık sözleşme.',
    ),
  ).toBe(true);
  expect(text).toContain('Test Ziyaretçi');
});

test('tr: the pass check never posts; "Send my result" composes the answers on click, its href stays bare (W95)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await openSection(page, 'passcheck');
  const view = page.getByTestId('pass-view');
  await expect(view).toHaveAttribute('data-live', 'true');
  const send = page.getByTestId('pass-send');
  await expect(send).toHaveAttribute('href', WA);
  await view.getByText(s('tr', 'calc.434'), { exact: true }).first().click();
  await expect(page.getByTestId('pass-verdict')).toHaveAttribute('data-tone', 'red');
  await stubWindowOpen(page);
  await send.click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  expect(urls[0].startsWith(`${WA}?text=`)).toBe(true);
  expect(decodeURIComponent(urls[0].split('?text=')[1])).toContain(
    `1. ${s('tr', 'calc.445')} — ${s('tr', 'calc.434')}`,
  );
  await expect(send).toHaveAttribute('href', WA);
});

test('tr: the quota gate commits a typed staff count on Enter (W131)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  await openSection(page, 'quota');
  const suffix = isMobile() ? '-m' : '';
  await expect(page.getByTestId(`quota-view${suffix}`)).toHaveAttribute('data-live', 'true');
  const input = page.locator(`#calc-staff${suffix}`);
  await input.fill('9');
  await input.press('Enter');
  await expect(page.getByTestId(`quota-allowed${suffix}`)).toHaveText('1 yabancı işçi');
});

test('tr: ≤ 700 px the sections collapse behind their triggers and keep their h2 in the accessibility tree; from 701 px the bodies are open (W10/W119)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const basis = page.locator('#basis');
  const toggle = basis.getByRole('button', { name: new RegExp(s('tr', 'calc.060')) });
  const body = basis.getByTestId('section-body');
  await expect(basis.getByRole('heading', { level: 2, name: s('tr', 'calc.076') })).toHaveCount(1);
  if (isMobile()) {
    await expect(page.getByTestId('calc-jump')).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(body).toBeHidden();
    await toggle.click();
    await expect(body).toBeVisible();
    await expect(body).toHaveAttribute('data-open', 'true');
  } else {
    await expect(page.getByTestId('calc-jump')).toBeHidden();
    await expect(toggle).toBeHidden();
    await expect(body).toBeVisible();
  }
});

test('desktop: Print isolates #calculator (print-isolate, PrintButton)', async ({ page }) => {
  test.skip(isMobile(), 'Print is desktop-only (design line 283)');
  await page.goto(ROUTES.tr);
  await page.getByTestId('calc-activate').focus();
  await expect(page.getByTestId('calc-island')).toBeVisible();
  await page.evaluate(() => {
    window.print = () => undefined;
  });
  await page
    .getByTestId('calc-island')
    .getByRole('button', { name: s('tr', 'calc.037'), exact: true })
    .click();
  await expect(page.locator('body')).toHaveClass(/\bprint-isolating\b/);
  await page.emulateMedia({ media: 'print' });
  const visibility = await page.evaluate(() =>
    ['calculator', 'basis'].map((id) => getComputedStyle(document.getElementById(id)!).visibility),
  );
  expect(visibility).toEqual(['visible', 'hidden']);
  await page.emulateMedia({ media: 'screen' });
});

test('desktop: the sticky bar appears past 700 px — even after a jump past its wrapper — hides near #calc-cta and tracks its contact CTAs (W18/W81)', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar is lg+ only; the mobile bottom bar carries the offer below lg');
  await page.goto(ROUTES.tr);
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 2600)); // one jump, past the wrapper after #basis
  await expect(bar).toBeVisible();
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sticky-cta-h').trim(),
    ),
  ).not.toBe('0px');
  const wa = bar.getByRole('link', { name: s('tr', 'calc.052'), exact: true });
  const href = (await wa.getAttribute('href')) ?? '';
  expect(decodeURIComponent(href.split('?text=')[1] ?? '')).toBe(MSG.tr.sys.calc.whatsapp.generic);
  const call = bar.getByRole('link', { name: s('tr', 'calc.051'), exact: true });
  await call.evaluate((a) =>
    a.addEventListener('click', (e) => e.preventDefault(), { once: true }),
  );
  await call.click();
  expect(
    (await dataLayer(page, 'call_click')).some((e) => e.placement === 'page_cta'),
  ).toBe(true);
  await page.locator('#calc-cta').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});

test('desktop: the language switch keeps the visitor on this page', async ({ page }) => {
  test.skip(isMobile(), 'the switcher lives in the hamburger below lg — covered by e2e/chrome.spec.ts');
  await page.goto(ROUTES.tr);
  await page.locator('a[hreflang="en"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/hiring-cost-calculator$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
```

`track()` pushes to `window.dataLayer` whether or not GTM is configured (`src/analytics/track.ts`), so the `calculator_use`/`call_click` assertions need no consent. The pass-check and quota cases run in both projects: on `mobile` the section is opened through its trigger first (`openSection`), and the phone variant of Gate 1 (`#calc-staff-m`, `quota-*-m`) is the one that loads — the desktop wrapper is `max-md:hidden`, so its `LazyIsland` never intersects.

- [ ] **Step 2: Run to verify they fail**

No server may start before Cycle 7 (W126). Run the unit test red, and prove the spec compiles and is collected:

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hiring-cost-calculator/_sections
npx playwright test e2e/pages/calc.spec.ts --list
```
Expected: Vitest FAIL — `Failed to resolve import "../CalcSection"` (and `../ClosingBand`, `../content`, `../context`, `../Hero`). Playwright: `Total: 30 tests in 1 file` (15 cases × the `mobile` and `desktop` projects). The spec runs exactly once, green, inside Cycle 7's gate; today every case would meet the `[...rest]` 404, because `/hiring-cost-calculator` is still in `UNBUILT_PATHNAMES` and has no `page.tsx`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hiring-cost-calculator/_components/SectionToggle.tsx`:

```tsx
'use client';
import { useId, useState, type ReactNode } from 'react';

const TRIGGER =
  'flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-sm border-[1.5px] bg-white px-[15px] py-3.5 text-left md:hidden';
const TRIGGER_TONE = {
  closed: 'border-border-1',
  open: 'border-blue shadow-[0_8px_20px_rgba(22,60,90,0.09)]',
} as const;
const CHEVRON =
  'grid h-[34px] w-[34px] flex-none place-items-center rounded-[11px] border border-sky/30 bg-[linear-gradient(160deg,#253063_0%,#0e1a37_100%)] text-[13px] font-extrabold text-sky transition-transform';

/**
 * The design's ≤ 700 px per-section accordion (`.ja-cs` / `.ja-cstog`, CSS 292–308) — W10: the
 * body is hidden with a `max-md:` class, never removed, and from 701 px the trigger is gone and
 * the body always shows. The section's own h2 + subtitle live OUTSIDE this toggle
 * (`_sections/CalcSection.tsx`, `max-md:sr-only`), so the outline is the same at every width. The
 * server renders it closed and the first client render matches (no effect, no hydration
 * mismatch). The chevron is a text glyph (delta 9). The body stays a plain container: islands
 * inside it (`LazyIsland`) see no intersection while it is `display:none`, so a collapsed
 * section loads nothing on phones.
 */
export function SectionToggle({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((v) => !v)}
        className={`${TRIGGER} ${open ? TRIGGER_TONE.open : TRIGGER_TONE.closed}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold leading-[1.25] text-ink">{title}</span>
          <span className="mt-[3px] block text-[12px] font-semibold leading-[1.4] text-text-tertiary">
            {subtitle}
          </span>
        </span>
        <span aria-hidden="true" className={open ? `${CHEVRON} rotate-180` : CHEVRON}>
          ▾
        </span>
      </button>
      <div
        id={bodyId}
        data-testid="section-body"
        data-open={open ? 'true' : 'false'}
        className={open ? 'max-md:pt-4' : 'max-md:hidden'}
      >
        {children}
      </div>
    </>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/context.ts`:

```ts
import 'server-only';
import { getTranslations } from 'next-intl/server';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection, getRateConfig } from '@/content/collections';
import type { FieldOption } from '@/forms/client/Field';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import {
  computeCardView,
  designRoles,
  roleLabelMaps,
  type CardView,
  type CardViewLabels,
  type DesignRole,
} from '../_lib/card-view';
import { makeCardCopy, type SysT } from '../_lib/copy';
import { DEFAULT_INPUTS } from '../_lib/estimate-inputs';
import {
  CARD_IDS,
  GUIDE_IDS,
  PASS_IDS,
  QUOTA_IDS,
  RECAP_IDS,
  SHEET_IDS,
  pickLabels,
  type CardLabels,
  type GuideLabels,
  type PassLabels,
  type QuotaLabels,
  type RecapLabels,
  type SheetLabels,
} from '../_lib/ids';

export type CalcLabels = {
  card: CardLabels;
  /** The four card labels the recap and the quote sheet need (islands get no more than that). */
  cardView: CardViewLabels;
  quota: QuotaLabels;
  pass: PassLabels;
  guide: GuideLabels;
  recap: RecapLabels;
  sheet: SheetLabels;
};

/** Everything the server sections read, resolved once per request. */
export type CalcCtx = {
  locale: Locale;
  bundle: Bundle;
  /** `makeTf(bundle, locale)` — W1: calc.050/101/104/381/481 carry {homepageReplyHours}. */
  t: (id: string) => string;
  /** The request locale's `sys` translator. */
  sys: SysT;
  settings: Bundle['settings'];
  rateConfig: RateConfig;
  /** The 12 design roles (W24: never the teaser presets); empty → the card's empty state. */
  roles: DesignRole[];
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  labels: CalcLabels;
  /** The card at the design defaults — the skeleton, the recap and the fallbacks' first paint. */
  defaultView: CardView | null;
  /** ISO-2 values, localized names, sorted in the page's own collation. */
  countries: FieldOption[];
};

/** Pure: the context from a bundle and a `sys` translator (the unit tests call this directly). */
export function buildCalcCtx(bundle: Bundle, locale: Locale, sys: SysT): CalcCtx {
  const t = makeTf(bundle, locale);
  // Throws in every environment when absent: money never degrades silently (D17).
  const rateConfig = getRateConfig(bundle);
  const roles = designRoles(getCollection(bundle, 'calculatorRoles'));
  const { roleLabels, industryLabels } = roleLabelMaps(roles, t);
  const card = pickLabels(t, CARD_IDS);
  const cardView: CardViewLabels = {
    perWorker: card.perWorker,
    fullYear: card.fullYear,
    firstYear: card.firstYear,
    perMonthSuffix: card.perMonthSuffix,
  };
  const collator = new Intl.Collator(locale === 'tr' ? 'tr-TR' : 'en-US');
  const countries = getCollection(bundle, 'countries')
    .map((c) => ({ value: c.code, label: c.name }))
    .sort((a, b) => collator.compare(a.label, b.label));
  return {
    locale,
    bundle,
    t,
    sys,
    settings: bundle.settings,
    rateConfig,
    roles,
    roleLabels,
    industryLabels,
    labels: {
      card,
      cardView,
      quota: pickLabels(t, QUOTA_IDS),
      pass: pickLabels(t, PASS_IDS),
      guide: pickLabels(t, GUIDE_IDS),
      recap: pickLabels(t, RECAP_IDS),
      sheet: pickLabels(t, SHEET_IDS),
    },
    defaultView:
      roles.length > 0
        ? computeCardView({
            inputs: DEFAULT_INPUTS,
            roles,
            rateConfig,
            locale,
            roleLabels,
            industryLabels,
            labels: cardView,
            copy: makeCardCopy(sys),
          })
        : null,
    countries,
  };
}

/** The page's read: one bundle (React `cache()`d by the adapter) and the `sys` translator. */
export async function loadCalcCtx(locale: Locale): Promise<CalcCtx> {
  const [bundle, translate] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  return buildCalcCtx(bundle, locale, (key, values) => translate(key, values));
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/ui.tsx`:

```tsx
import { Fragment, type ReactNode } from 'react';

/*
 * Page-local presentational pieces the server sections share (no directive, no hooks). Class
 * strings obey W119/W122/W155 (one utility per property per variant on every composed string);
 * greys follow D20 — `text-text-secondary` on `pale-1`, `text-text-tertiary` only on
 * white/`pale-2`/`pale-3`; the design's #94a3b8 kickers become `text-text-tertiary`.
 */

const HEAD = {
  center: 'mx-auto mb-10 max-w-[680px] text-center max-md:sr-only xl:mb-[30px] xl:max-w-[510px]',
  left: 'mb-2.5 max-w-[640px] max-md:sr-only xl:max-w-[480px]',
} as const;
const H2 = {
  lg: 'm-0 mb-3.5 text-h2 leading-[1.05] tracking-[-0.04em] text-ink',
  sm: 'm-0 mb-2.5 text-[clamp(22px,2.4vw,28px)] leading-[1.15] tracking-[-0.035em] text-ink xl:text-[clamp(16.5px,1.8vw,21px)]',
} as const;

export type SectionHeadProps = {
  title: string;
  sub: string;
  align?: keyof typeof HEAD;
  size?: keyof typeof H2;
};

/** A section's h2 + subtitle. Visible from 701 px; ≤ 700 px the trigger shows the section's
 *  short title instead and this pair stays in the accessibility tree (`max-md:sr-only`, W10). */
export function SectionHead({ title, sub, align = 'center', size = 'lg' }: SectionHeadProps) {
  return (
    <div className={HEAD[align]}>
      <h2 className={H2[size]}>{title}</h2>
      <p className="m-0 text-body-lg text-text-secondary">{sub}</p>
    </div>
  );
}

/** Small upper-case labels: white/pale-2/pale-3 cards, pale-1 cards, navy cards. */
export const KICKER =
  'm-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary';
export const KICKER_SM =
  'm-0 mb-2 text-[11px] font-extrabold uppercase tracking-[1.1px] text-text-tertiary';
export const KICKER_SM_PALE =
  'm-0 mb-2 text-[11px] font-extrabold uppercase tracking-[1.1px] text-text-secondary';
export const KICKER_DARK =
  'm-0 mb-1.5 text-[11px] font-extrabold uppercase tracking-[1.1px] text-sky';

const NOTE = {
  amber:
    'm-0 rounded-sm border border-warning-border bg-warning-surface px-[22px] py-4 text-body-sm leading-[1.6] text-[#7a5210] max-md:px-3.5 max-md:py-[13px]',
  green:
    'm-0 rounded-base border border-success-border bg-success-surface px-[26px] py-5 text-body leading-[1.65] text-[#14532d] max-md:px-3.5 max-md:py-[13px] max-md:text-body-sm',
} as const;

/** The design's amber/green notes. `className` is for margins and visibility only (W122). */
export function Note({
  tone,
  className,
  children,
}: {
  tone: keyof typeof NOTE;
  className?: string;
  children: ReactNode;
}) {
  return <p className={[NOTE[tone], className].filter(Boolean).join(' ')}>{children}</p>;
}

const TICK =
  'mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[7px] border border-success-border bg-success-surface text-[12px] font-extrabold text-success-text';
const TICK_DARK =
  'mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[7px] border border-[rgba(93,223,176,0.4)] bg-[rgba(93,223,176,0.16)] text-[12px] font-extrabold text-[#5ddfb0]';

/** The design's check square (decorative — the row's text carries the meaning). */
export function Tick({ dark = false }: { dark?: boolean }) {
  return (
    <span aria-hidden="true" className={dark ? TICK_DARK : TICK}>
      ✓
    </span>
  );
}

const DOT = {
  blue: 'mt-[7px] h-[7px] w-[7px] shrink-0 rounded-pill bg-blue',
  amber: 'mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-warning',
  green: 'mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-success',
} as const;

/** A bullet as a shape, never a glyph (no text to fail a contrast audit). */
export function Dot({ tone }: { tone: keyof typeof DOT }) {
  return <span aria-hidden="true" className={DOT[tone]} />;
}

/** calc.124/125 carry the package's own `<br />` — rendered as line breaks, never as markup. */
export function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split(/<br\s*\/?>/).map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/CalcSection.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Section, type SectionTone } from '@/design/primitives/Section';
import { SectionToggle } from '../_components/SectionToggle';
import { SectionHead, type SectionHeadProps } from './ui';

// Section's tones set `py-16`; these set padding only at OTHER variants (W122): the design's 8 px
// ≤ 700 px, its 62/80 px from 701 px and × 0.75 from 1101 px (D19).
const PAD = {
  basis: 'scroll-mt-5 max-md:py-2 md:py-[62px] xl:py-[46.5px]',
  section: 'scroll-mt-5 max-md:py-2 md:py-20 xl:py-[60px]',
} as const;
// `.container-site` is unlayered CSS, so a utility cannot narrow it: a narrow body nests.
const NARROW = 'mx-auto max-w-[1080px] xl:max-w-[810px]';

/**
 * One designed content section (`.ja-cs`): the section id is the anchor the jump chips, the
 * card's "Check your quota →" and the header CTA sweep target (W152/W158); the test id sits on a
 * page-owned wrapper, never on `Section` (W113); the heading pair is outside the phone toggle
 * (W10). The FAQ passes no `head` — `FaqBlock` owns its h2.
 */
export function CalcSection({
  id,
  tone,
  testId,
  toggle,
  head,
  pad = 'section',
  width = 'wide',
  children,
}: {
  id: string;
  tone: SectionTone;
  testId: string;
  toggle: { title: string; subtitle: string };
  head?: SectionHeadProps;
  pad?: keyof typeof PAD;
  width?: 'wide' | 'narrow';
  children: ReactNode;
}) {
  const body = (
    <>
      {head ? <SectionHead {...head} /> : null}
      <SectionToggle title={toggle.title} subtitle={toggle.subtitle}>
        {children}
      </SectionToggle>
    </>
  );
  return (
    <Section id={id} tone={tone} className={PAD[pad]}>
      <div data-testid={testId} className="container-site">
        {width === 'narrow' ? <div className={NARROW}>{body}</div> : body}
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/Hero.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { EmptyState } from '@/design/blocks/EmptyState';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { effectiveFromLabel, effectiveYear, isReviewDue } from '@/lib/calculator';
import { CalculatorLoader } from '../_components/CalculatorLoader';
import { CalculatorSkeleton } from '../_components/CalculatorSkeleton';
import { Sentence } from '../_components/Sentence';
import type { CalcCtx } from './context';

const BADGE =
  'm-0 mb-4 inline-flex items-center gap-[9px] rounded-pill border border-[rgba(74,222,128,0.35)] bg-[rgba(74,222,128,0.12)] px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-[1.2px] text-[#86efac] max-md:mb-3 max-md:px-3 max-md:py-[5px] max-md:text-[11px] max-md:tracking-[1px] xl:text-[9px]';

/**
 * Design 559–572: the navy hero — breadcrumbs (W109: this page's own calc.001 → `/`, calc.002 →
 * this page), the D17 badge, the three-part h1 (the page's LCP element, `data-lcp-slot="h1"`,
 * D26) and the lede; `children` is the calculator card, which sits inside the hero as in the
 * design. The full-bleed photo slot `calc-hero` is a named placeholder under the 90–97 % navy
 * gradient — decorative, never preloaded, never the LCP (W55); `ImageSlot` owns its box (W129),
 * so it is wrapped, and it covers its own aspect box, not the whole hero (a (c) delta).
 */
export function Hero({ ctx, children }: { ctx: CalcCtx; children: ReactNode }) {
  const { t, sys, locale, rateConfig } = ctx;
  // D17/W150: data, never typed; hidden from reviewDueAt 00:00 UTC — the page revalidates daily.
  // `year` is a string: an ICU number argument would be grouped ("2.026").
  const badge = isReviewDue(rateConfig)
    ? null
    : sys('calc.hero.badge', {
        year: String(effectiveYear(rateConfig)),
        month: effectiveFromLabel(rateConfig, locale),
      });
  const highlight = t('calc.005');
  return (
    <div
      data-testid="calc-top"
      className="relative overflow-hidden bg-navy pt-14 pb-[68px] max-md:pt-6 max-md:pb-[30px] xl:pt-[42px] xl:pb-[51px]"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <ImageSlot slot="calc-hero" alt="" width={1600} height={900} sizes="100vw" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,40,0.9)_0%,rgba(10,20,40,0.94)_45%,rgba(10,20,40,0.97)_100%)]"
      />
      <div className="container-site relative">
        <div className="mx-auto mb-[34px] max-w-[720px] text-center max-md:mb-4 max-md:text-left xl:mb-[25.5px] xl:max-w-[540px]">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-3.5 flex justify-center max-md:justify-start"
            items={[
              { name: t('calc.001'), href: '/' },
              { name: t('calc.002'), href: '/hiring-cost-calculator' },
            ]}
          />
          {badge ? (
            <p data-testid="calc-badge" className={BADGE}>
              <span aria-hidden="true" className="inline-block h-[9px] w-[9px] rounded-pill bg-success" />
              {badge}
            </p>
          ) : null}
          <h1
            data-testid="page-h1"
            data-lcp-slot="h1"
            className="m-0 mb-4 text-h1 leading-[1.03] tracking-[-0.04em] text-white max-md:leading-[1.07]"
          >
            <Sentence
              runs={[
                t('calc.004'),
                { node: <span className="text-sky">{highlight}</span>, text: highlight },
                t('calc.006'),
              ]}
            />
          </h1>
          <p className="m-0 text-body-lg text-white/75 max-md:text-[15px]">{t('calc.007')}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * The card (design 574–737) — `id="calculator"`, the `CTA_BY_PATHNAME` anchor (W152/W158) and
 * the one `.print-isolate` region `PrintButton` prints (the design's @media print rule, made
 * opt-in). The server skeleton paints the model's defaults; the island loads on the first
 * hover/touch/focus or at `#calculator` (W13 amended). Without design roles it is the designed
 * empty state, its CTA an object Href to the closing band's quote button (W82). The fine print
 * `calc.040` closes it (on `pale-1`: `text-text-secondary`, D20).
 */
export function CalculatorCard({ ctx }: { ctx: CalcCtx }) {
  const { t, sys, locale, rateConfig, roles, roleLabels, industryLabels, labels, defaultView } =
    ctx;
  return (
    <div
      id="calculator"
      className="print-isolate mx-auto max-w-[1080px] scroll-mt-5 overflow-hidden rounded-xl border border-tint-border bg-white shadow-[0_24px_60px_rgba(22,60,90,0.14)] max-md:rounded-base max-md:shadow-[0_16px_38px_rgba(3,10,26,0.4)] xl:max-w-[810px]"
    >
      {defaultView ? (
        <CalculatorLoader
          locale={locale}
          rateConfig={rateConfig}
          roles={roles}
          labels={labels.card}
          roleLabels={roleLabels}
          industryLabels={industryLabels}
          closeLabel={sys('nav.close')}
          fallback={
            <CalculatorSkeleton
              view={defaultView}
              labels={labels.card}
              activateLabel={sys('calc.skeleton.activate')}
            />
          }
        />
      ) : (
        <EmptyState
          testId="calc-empty"
          headingLevel={2}
          title={sys('calc.empty.title')}
          body={sys('calc.empty.body')}
          cta={{
            label: t('calc.105'),
            href: { pathname: '/hiring-cost-calculator', hash: '#calc-cta' },
          }}
          className="m-6"
        />
      )}
      <p className="m-0 border-t border-border-4 bg-pale-1 px-[34px] py-[13px] text-[12.5px] leading-[1.5] text-text-secondary max-md:px-[15px] max-md:py-3 max-md:text-[11.5px] xl:px-[25.5px] xl:py-[10px] xl:text-[9.5px]">
        {t('calc.040')}
      </p>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/content.tsx`:

```tsx
import type { ReactNode } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { FaqBlock } from '@/design/blocks/FaqBlock';
import { buttonClassName } from '@/design/primitives/Button';
import { Tabs } from '@/design/primitives/Tabs';
import { Link } from '@/i18n/navigation';
import { sgkRateLabel, updatedAtLabel } from '@/lib/calculator';
import { formatInt, formatTRY } from '@/lib/format/money';
import { PassCheckLoader, QuotaLoader, SalaryGuideLoader } from '../_components/LazyBinders';
import { LiveSgkRate } from '../_components/LiveSgkRate';
import { BarLook, ChipsLook, StepperLook, TriStateLook } from '../_components/Lookalikes';
import { PassCheckView, RESET } from '../_components/PassCheckView';
import { QuotaView } from '../_components/QuotaView';
import { SalaryGuideView } from '../_components/SalaryGuideView';
import { Sentence, type Run } from '../_components/Sentence';
import { makePassCopy, makeQuotaCopy } from '../_lib/copy';
import { DEFAULT_INPUTS } from '../_lib/estimate-inputs';
import { computePassView, MANUAL_ROWS, type ManualRow } from '../_lib/pass-check';
import { computeQuotaView } from '../_lib/quota-view';
import { buildGuideRows, GUIDE_SCALE_MIN, guideScaleMax } from '../_lib/salary-guide';
import type { CalcCtx } from './context';
import { Dot, KICKER, KICKER_DARK, KICKER_SM, KICKER_SM_PALE, Lines, Note, Tick } from './ui';

/*
 * The section bodies of the Cost Calculator, in the design's order (Hiring Cost Calculator.dc.html
 * 755–1532). Server components: every package id through the context's `makeTf` (W1), every lira
 * through `formatTRY` (D18), every rate from `rateConfig` (D17), every glued design sentence
 * through `Sentence` (trimmed fragments, `_lib/fragments.ts`). Each island is mounted through its
 * `LazyIsland` binder with a DOM-matched server fallback built from the same view model (W132).
 * The design's phone-only variants are `md:hidden`, the desktop-only parts `max-md:hidden` —
 * both in the DOM (W10/W119). The design's decorative card icons are omitted (delta 9).
 */

const b = (text: string): Run => ({ b: text });

/* ---------- jump chips (design 755–764) ---------- */

const JUMP: readonly (readonly [string, string])[] = [
  ['#salaries', 'calc.054'],
  ['#quota', 'calc.055'],
  ['#incentives', 'calc.056'],
  ['#passcheck', 'calc.057'],
  ['#penalties', 'calc.058'],
  ['#faq', 'calc.059'],
];

export function JumpChips({ ctx }: { ctx: CalcCtx }) {
  const { t, sys } = ctx;
  return (
    <nav
      aria-label={sys('calc.jump.label')}
      data-testid="calc-jump"
      className="container-site pt-4 md:hidden"
    >
      <ul className="m-0 flex list-none gap-[7px] overflow-x-auto p-0 pb-0.5">
        {JUMP.map(([href, id]) => (
          <li key={href} className="flex-none">
            <a
              href={href}
              className="inline-flex min-h-10 items-center whitespace-nowrap rounded-pill border border-border-1 bg-pale-1 px-3.5 text-[13px] font-extrabold text-ink no-underline"
            >
              {t(id)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- #basis (765–808) ---------- */

const BASIS_GRID =
  'grid gap-[18px] lg:grid-cols-4 max-md:gap-0 max-md:overflow-hidden max-md:rounded-sm max-md:border max-md:border-border-1 max-md:bg-white';
const BASIS_CARD =
  'rounded-md border border-border-2 bg-white px-[22px] py-6 max-md:rounded-none max-md:border-0 max-md:border-t max-md:border-border-3 max-md:px-3.5 max-md:py-[13px] max-md:first:border-t-0';

export function Basis({ ctx }: { ctx: CalcCtx }) {
  const { t, locale, rateConfig } = ctx;
  const permits = t('calc.084');
  const cards: { title: string; body: ReactNode }[] = [
    { title: t('calc.078'), body: t('calc.079') },
    { title: t('calc.080'), body: t('calc.081') },
    {
      title: t('calc.082'),
      body: (
        <Sentence
          runs={[
            t('calc.083'),
            {
              // `/work-permit` is T4's page: no prefetch while it may still 404 (W20)
              node: (
                <Link
                  href="/work-permit"
                  prefetch={false}
                  className="font-bold text-blue-safe no-underline hover:underline"
                >
                  {permits}
                </Link>
              ),
              text: permits,
            },
          ]}
        />
      ),
    },
    { title: t('calc.085'), body: t('calc.086') },
  ];
  return (
    <>
      <div className={BASIS_GRID}>
        {cards.map((c) => (
          <div key={c.title} className={BASIS_CARD}>
            <h3 className="m-0 mb-1.5 text-body font-extrabold text-ink">{c.title}</h3>
            <p className="m-0 text-body-sm leading-[1.6] text-text-secondary">{c.body}</p>
          </div>
        ))}
      </div>
      <Note tone="amber" className="mt-[22px]">
        <Sentence runs={[b(t('calc.087')), t('calc.088')]} />
      </Note>
      {/* D17: the "last updated" date is rateConfig.updatedAt, never typed (design line 2617) */}
      <p
        data-testid="calc-updated"
        className="m-0 mt-[18px] flex flex-wrap items-center justify-center gap-2.5 text-body-sm text-text-tertiary max-md:justify-start"
      >
        <span className="inline-flex items-center rounded-pill border border-tint-border bg-white px-[15px] py-1.5 font-bold text-text-secondary">
          <Sentence runs={[t('calc.089'), b(updatedAtLabel(rateConfig, locale))]} />
        </span>
        <span>{t('calc.090')}</span>
      </p>
    </>
  );
}

/* ---------- #salaries (810–871): the legend, the guide island, the footnote ---------- */

export function Salaries({ ctx }: { ctx: CalcCtx }) {
  const { t, locale, rateConfig, roles, roleLabels, industryLabels, labels } = ctx;
  const guide = labels.guide;
  const scaleMin = formatTRY(GUIDE_SCALE_MIN, locale);
  const scaleMax = roles.length > 0 ? formatTRY(guideScaleMax(roles), locale) : '';
  // the island builds the same list (SalaryGuideIsland) — the fallback's chips match it
  const filterOptions = [
    { value: 'all', label: guide.allInd },
    ...[...new Set(roles.map((r) => r.industry))].map((i) => ({
      value: i,
      label: industryLabels[i] ?? i,
    })),
  ];
  return (
    <>
      <ul className="m-0 mb-[22px] flex list-none flex-wrap items-center gap-[18px] p-0 text-[12.5px] font-bold text-text-secondary xl:text-[9.5px]">
        <li className="inline-flex items-center gap-[7px]">
          <span
            aria-hidden="true"
            className="h-[7px] w-[22px] rounded-pill bg-[linear-gradient(90deg,#1899d5_0%,#5cc0ef_100%)]"
          />
          {t('calc.093')}
        </li>
        <li className="inline-flex items-center gap-[7px]">
          <span aria-hidden="true" className="h-[13px] w-0.5 bg-ink" />
          <Sentence runs={[t('calc.094'), formatTRY(rateConfig.legalMinGross, locale)]} />
        </li>
        <li className="inline-flex items-center gap-[7px]">
          <span
            aria-hidden="true"
            className="h-[9px] w-[9px] rounded-[3px] border border-success-border bg-success-surface"
          />
          {t('calc.095')}
        </li>
      </ul>
      {roles.length > 0 ? (
        <SalaryGuideLoader
          locale={locale}
          roles={roles}
          rateConfig={rateConfig}
          labels={guide}
          roleLabels={roleLabels}
          industryLabels={industryLabels}
          scaleMin={scaleMin}
          scaleMax={scaleMax}
          fallback={
            <SalaryGuideView
              rows={buildGuideRows({
                roles,
                rateConfig,
                tier: DEFAULT_INPUTS.sgkTier,
                locale,
                roleLabels,
                industryLabels,
                labels: { skilled: guide.skilled, standard: guide.standard },
              })}
              activeKey={DEFAULT_INPUTS.roleKey}
              labels={guide}
              scaleMin={scaleMin}
              scaleMax={scaleMax}
              filter={<ChipsLook options={filterOptions} value="all" />}
              live={false}
            />
          }
        />
      ) : null}
      <p className="m-0 mt-5 rounded-sm border border-border-2 bg-white px-[22px] py-4 text-body-sm leading-[1.6] text-text-tertiary max-md:mt-2.5 max-md:px-3.5 max-md:py-[13px]">
        <Sentence runs={[b(t('calc.098')), t('calc.099')]} />
      </p>
    </>
  );
}

/* ---------- #compare (873–1022) ---------- */

const CELL = 'px-7 py-[17px] text-[14.5px] leading-[1.6] text-text-secondary xl:text-[11px]';
const LT_BOX = 'rounded-sm border border-border-2 bg-pale-2 px-5 py-[18px]';
const LT_BODY = 'm-0 text-body-sm leading-[1.6] text-text-secondary';
const LADDER = {
  blue: 'rounded-[8px] bg-tint px-[9px] py-1.5 text-[12.5px] font-extrabold text-blue-safe',
  green:
    'rounded-[8px] bg-success-surface px-[9px] py-1.5 text-[12.5px] font-extrabold text-success-text',
} as const;
const SPREAD_VALUE = {
  once: 'm-0 text-[26px] font-extrabold tracking-[-0.6px] text-white xl:text-[19.5px]',
  year: 'm-0 text-[26px] font-extrabold tracking-[-0.6px] text-sky xl:text-[19.5px]',
  three: 'm-0 text-[26px] font-extrabold tracking-[-0.6px] text-[#6fe0a3] xl:text-[19.5px]',
} as const;

export function Compare({ ctx }: { ctx: CalcCtx }) {
  const { t, locale, rateConfig } = ctx;
  const rows: [string, Run[], Run[]][] = [
    ['calc.195', [t('calc.196'), b(t('calc.197'))], [t('calc.198'), b(t('calc.199'))]],
    ['calc.200', [t('calc.201')], [b(t('calc.202')), t('calc.203')]],
    ['calc.204', [t('calc.205')], [b(t('calc.206')), t('calc.207')]],
    ['calc.208', [t('calc.209')], [b(t('calc.210')), t('calc.211')]],
    ['calc.212', [t('calc.213')], [b(t('calc.214')), t('calc.215')]],
    ['calc.216', [t('calc.217')], [t('calc.218'), b(t('calc.219')), t('calc.220')]],
    ['calc.221', [t('calc.222')], [t('calc.223'), b(t('calc.224'))]],
  ];
  const benefits: [string, string][] = [
    ['calc.250', 'calc.251'],
    ['calc.252', 'calc.253'],
    ['calc.254', 'calc.255'],
    ['calc.256', 'calc.257'],
    ['calc.258', 'calc.259'],
  ];
  // D17 / delta 6: the long-term spread is the DEFAULT one-off per worker (permit + flight from
  // rateConfig) — not the live flight toggle, which the design reads.
  const oneOff = rateConfig.permitFeeTRY + rateConfig.flightTRY;
  const perMonth = t('calc.465');
  return (
    <>
      <div data-testid="calc-compare-mobile" className="md:hidden">
        <div className="mb-2.5 rounded-sm bg-navy p-[15px]">
          <p className={KICKER_DARK}>{t('calc.242')}</p>
          <p className="m-0 text-[15.5px] font-bold leading-[1.45] text-white">
            <Sentence
              runs={[t('calc.243'), b(t('calc.244')), t('calc.245')]}
              strong="font-extrabold text-sky"
            />
          </p>
        </div>
        <div className="mb-2.5 rounded-sm border border-border-1 bg-white px-3.5 py-[13px]">
          <p className={KICKER_SM}>{t('calc.246')}</p>
          <p className="m-0 flex flex-wrap items-baseline gap-[9px]">
            <span className="text-[19px] font-extrabold tracking-[-0.4px] text-ink">
              {t('calc.411')}
            </span>
            <span className="text-[12.5px] font-bold text-text-tertiary">{t('calc.247')}</span>
          </p>
          <p className="m-0 mt-1.5 text-[13px] leading-[1.5] text-text-tertiary">{t('calc.248')}</p>
        </div>
        <div className="rounded-sm border border-border-1 bg-white px-3.5 pt-[13px] pb-1">
          <p className={KICKER_SM}>{t('calc.249')}</p>
          <ul className="m-0 list-none p-0">
            {benefits.map(([strong, rest]) => (
              <li
                key={strong}
                className="grid grid-cols-[22px_1fr] items-start gap-x-2.5 border-t border-border-3 py-[11px]"
              >
                <Tick />
                <span className="min-w-0 text-[13.5px] leading-[1.5] text-text-secondary">
                  <Sentence runs={[b(t(strong)), t(rest)]} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* delta 9: a real table — the row label in the middle column, the "VS" badge in the header */}
      <div className="mx-auto max-w-[1080px] overflow-hidden rounded-xl border border-border-1 bg-white shadow-[0_18px_48px_rgba(22,60,90,0.10)] max-md:hidden xl:max-w-[810px]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th scope="col" className="border-b border-border-3 bg-pale-1 px-7 py-[22px] align-top">
                <span className="mb-[5px] block text-eyebrow font-extrabold uppercase tracking-[1.2px] text-text-secondary">
                  {t('calc.191')}
                </span>
                <span className="block text-[20px] font-extrabold leading-[1.2] text-ink xl:text-[15px]">
                  {t('calc.192')}
                </span>
              </th>
              <td className="w-[150px] border-b border-border-3 bg-ink text-center align-middle xl:w-[112px]">
                <span
                  aria-hidden="true"
                  className="inline-grid h-12 w-12 place-items-center rounded-pill bg-white text-[14px] font-extrabold tracking-[0.5px] text-ink before:content-['VS'] xl:h-9 xl:w-9 xl:text-[10.5px]"
                />
              </td>
              {/* D20: the design's #1899D5 → #1073a8 gradient starts at blue-safe for white text */}
              <th
                scope="col"
                className="border-b border-border-3 bg-[linear-gradient(135deg,#1073a8_0%,#0b5d88_100%)] px-7 py-[22px] text-right align-top"
              >
                <span className="mb-[5px] block text-eyebrow font-extrabold uppercase tracking-[1.2px] text-white">
                  {t('calc.193')}
                </span>
                <span className="block text-[20px] font-extrabold leading-[1.2] text-white xl:text-[15px]">
                  {t('calc.194')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([labelId, optionA, optionB], i) => (
              <tr key={labelId} className={i < rows.length - 1 ? 'border-b border-border-3' : undefined}>
                <td className={CELL}>
                  <Sentence runs={optionA} />
                </td>
                <th
                  scope="row"
                  className="border-x border-border-3 bg-pale-2 px-2.5 text-center text-[11.5px] font-extrabold uppercase tracking-[0.8px] text-text-tertiary xl:text-[8.6px]"
                >
                  {t(labelId)}
                </th>
                <td className={`${CELL} text-right`}>
                  <Sentence runs={optionB} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        data-testid="calc-longterm"
        className="mx-auto mt-[26px] max-w-[1080px] rounded-xl border border-border-1 bg-white px-[34px] py-8 shadow-[0_18px_48px_rgba(22,60,90,0.10)] max-md:mt-3 max-md:rounded-sm max-md:p-[15px] max-md:shadow-none xl:max-w-[810px] xl:px-[25.5px] xl:py-6"
      >
        <h3 className="m-0 mb-2 text-[22px] font-extrabold tracking-[-0.4px] text-ink max-md:text-[18px] xl:text-[16.5px]">
          {t('calc.225')}
        </h3>
        <p className="m-0 mb-6 max-w-[780px] text-[15px] leading-[1.65] text-text-tertiary max-md:mb-3.5 max-md:text-[13.5px] max-md:leading-[1.55] xl:text-[11.25px]">
          {t('calc.226')}
        </p>
        <div className="mb-[22px] grid gap-4 lg:grid-cols-3">
          <div className={LT_BOX}>
            <p className={KICKER_SM}>{t('calc.227')}</p>
            <p className="m-0 mb-2.5 flex flex-wrap items-center gap-1.5">
              <span className={LADDER.blue}>{t('calc.228')}</span>
              <span aria-hidden="true" className="font-extrabold text-text-tertiary">
                →
              </span>
              <span className={LADDER.blue}>{t('calc.229')}</span>
              <span aria-hidden="true" className="font-extrabold text-text-tertiary">
                →
              </span>
              <span className={LADDER.green}>{t('calc.230')}</span>
            </p>
            <p className={LT_BODY}>{t('calc.231')}</p>
          </div>
          <div className={LT_BOX}>
            <p className={KICKER_SM}>{t('calc.232')}</p>
            <p className={LT_BODY}>{t('calc.233')}</p>
          </div>
          <div className={LT_BOX}>
            <p className={KICKER_SM}>{t('calc.234')}</p>
            <p className={LT_BODY}>{t('calc.235')}</p>
          </div>
        </div>
        <div
          data-testid="calc-spread"
          className="rounded-base bg-[linear-gradient(135deg,#16202e_0%,#253063_100%)] px-[26px] py-6 text-white max-md:px-[15px] max-md:py-4"
        >
          <p className="m-0 mb-3.5 text-[11.5px] font-extrabold uppercase tracking-[1px] text-white/80">
            {t('calc.236')}
          </p>
          <div className="grid items-end gap-[18px] sm:grid-cols-3">
            <div>
              <p className={SPREAD_VALUE.once}>{formatTRY(oneOff, locale)}</p>
              <p className="m-0 mt-[3px] text-[13px] text-white/75">{t('calc.237')}</p>
            </div>
            <div>
              <p className={SPREAD_VALUE.year}>{`${formatTRY(oneOff / 12, locale)} ${perMonth}`}</p>
              <p className="m-0 mt-[3px] text-[13px] text-white/75">{t('calc.238')}</p>
            </div>
            <div>
              <p className={SPREAD_VALUE.three}>{`${formatTRY(oneOff / 36, locale)} ${perMonth}`}</p>
              <p className="m-0 mt-[3px] text-[13px] text-white/75">{t('calc.239')}</p>
            </div>
          </div>
          <p className="m-0 mt-[18px] border-t border-white/15 pt-4 text-body-sm leading-[1.6] text-white/80">
            {t('calc.240')}
          </p>
        </div>
      </div>
      <p className="mx-auto mt-[26px] mb-0 max-w-[680px] text-center text-body-sm leading-[1.6] text-text-tertiary max-md:hidden">
        {t('calc.241')}
      </p>
    </>
  );
}

/* ---------- #quota (1024–1177): Gate 1 island, the rule and Gate 2 cards, the exemptions ---------- */

/** value / label / phone value / phone label (Gate 2's three company criteria, 370–375). */
const CRITERIA: readonly (readonly [string, string, string, string])[] = [
  ['calc.370', 'calc.167', 'calc.373', 'calc.185'],
  ['calc.371', 'calc.168', 'calc.374', 'calc.186'],
  ['calc.372', 'calc.169', 'calc.375', 'calc.187'],
];

type ExRow = readonly [titleId: string, bodyId: string, badge: string];

/** The exemptions panel (1150–1175): three tabs (`Tabs`, the page's one eager primitive island),
 *  each row with its badge — two from the package (calc.549/550), seven from
 *  `sys.calc.exemptions.*` (the design keeps them in its script only). */
function Exemptions({ ctx }: { ctx: CalcCtx }) {
  const { t, sys } = ctx;
  const badge = {
    tenStaff: sys('calc.exemptions.tenStaff'),
    twentyStaff: sys('calc.exemptions.twentyStaff'),
    upTo5: sys('calc.exemptions.upTo5'),
    full: sys('calc.exemptions.full'),
    timing: sys('calc.exemptions.timing'),
    upTo3: sys('calc.exemptions.upTo3'),
    exceptional: sys('calc.exemptions.exceptional'),
  };
  const groups: { id: string; tabId: string; introId: string; rows: ExRow[] }[] = [
    {
      id: 'sector',
      tabId: 'calc.430',
      introId: 'calc.510',
      rows: [
        ['calc.513', 'calc.514', t('calc.549')],
        ['calc.515', 'calc.516', badge.tenStaff],
        ['calc.517', 'calc.518', badge.tenStaff],
        ['calc.519', 'calc.520', badge.twentyStaff],
        ['calc.521', 'calc.522', t('calc.550')],
      ],
    },
    {
      id: 'company',
      tabId: 'calc.431',
      introId: 'calc.511',
      rows: [
        ['calc.523', 'calc.524', badge.upTo5],
        ['calc.525', 'calc.526', badge.full],
        ['calc.527', 'calc.528', badge.full],
        ['calc.529', 'calc.530', badge.timing],
      ],
    },
    {
      id: 'person',
      tabId: 'calc.432',
      introId: 'calc.512',
      rows: [
        ['calc.531', 'calc.532', badge.upTo3],
        ['calc.533', 'calc.534', badge.exceptional],
        ['calc.535', 'calc.536', badge.exceptional],
        ['calc.537', 'calc.538', badge.exceptional],
        ['calc.539', 'calc.540', badge.exceptional],
      ],
    },
  ];
  const panel = (introId: string, rows: ExRow[]) => (
    <>
      <p className="m-0 mb-4 text-body-sm leading-[1.6] text-text-tertiary max-md:mb-3 max-md:text-[13px]">
        {t(introId)}
      </p>
      <ul className="m-0 grid list-none gap-x-[30px] gap-y-3 p-0 md:grid-cols-2">
        {rows.map(([titleId, bodyId, text]) => (
          <li key={titleId} className="flex items-start gap-[13px] border-b border-border-3 pb-3">
            <Tick />
            <div className="min-w-0">
              <p className="m-0 mb-[3px] flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-extrabold text-ink max-md:text-[14.5px] xl:text-[11.25px]">
                  {t(titleId)}
                </span>
                <span className="whitespace-nowrap rounded-pill border border-border-2 bg-pale-1 px-[9px] py-0.5 text-[11px] font-extrabold text-blue-safe">
                  {text}
                </span>
              </p>
              <p className="m-0 text-[14px] leading-[1.6] text-text-secondary max-md:text-[13px] max-md:leading-[1.5] xl:text-[10.5px]">
                {t(bodyId)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
  return (
    <div
      data-testid="calc-exemptions"
      className="mt-7 overflow-hidden rounded-lg border border-tint-border bg-white max-md:mt-2.5 max-md:rounded-sm"
    >
      <p className="m-0 border-b border-border-3 bg-pale-2 px-[26px] py-4 text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary max-md:px-3.5 max-md:py-3">
        {t('calc.172')}
      </p>
      <div className="px-[26px] py-[22px] max-md:px-3.5 max-md:py-[15px]">
        <Tabs
          defaultId="sector"
          tabs={groups.map((g) => ({ id: g.id, label: t(g.tabId), panel: panel(g.introId, g.rows) }))}
        />
        <p className="m-0 mt-1.5 text-body-sm leading-[1.6] text-text-tertiary">
          <Sentence runs={[b(t('calc.173')), t('calc.174')]} />
        </p>
      </div>
    </div>
  );
}

export function Quota({ ctx }: { ctx: CalcCtx }) {
  const { t, sys, locale, rateConfig, labels } = ctx;
  const quota = labels.quota;
  const ratio = rateConfig.quotaRatio;
  // The island's first render: 25 staff, 1 planned (the design defaults), every number over
  // rateConfig.quotaRatio — calc.558's wording at the model figures (W142).
  const view = computeQuotaView({
    staff: DEFAULT_INPUTS.turkishStaff,
    headcount: DEFAULT_INPUTS.headcount,
    ratio,
    locale,
    labels: quota,
    copy: makeQuotaCopy(sys),
  });
  const stepper = <StepperLook value={formatInt(DEFAULT_INPUTS.turkishStaff, locale)} />;
  const fallback = (variant: 'mobile' | 'desktop') => (
    <QuotaView variant={variant} view={view} labels={quota} stepper={stepper} live={false} />
  );
  return (
    <>
      {/* design .ja-q-mob: step 1 + answer (the island), why, step 2 */}
      <div className="md:hidden">
        <QuotaLoader
          variant="mobile"
          locale={locale}
          quotaRatio={ratio}
          labels={quota}
          fallback={fallback('mobile')}
        />
        <div className="mb-2.5 rounded-sm border border-border-1 bg-pale-1 px-3.5 py-[13px]">
          <p className={KICKER_SM_PALE}>{t('calc.178')}</p>
          <p className="m-0 text-[13.5px] leading-[1.55] text-text-secondary">
            <Sentence runs={[b(t('calc.179')), t('calc.180')]} />
          </p>
        </div>
        <div className="rounded-sm border border-border-1 bg-white px-3.5 py-[13px]">
          <p className={KICKER_SM}>{t('calc.181')}</p>
          <p className="m-0 mb-2.5 text-[13.5px] leading-[1.55] text-text-secondary">
            <Sentence runs={[t('calc.182'), b(t('calc.183')), t('calc.184')]} />
          </p>
          <ul className="m-0 grid list-none grid-cols-3 gap-[7px] p-0">
            {CRITERIA.map(([, , value, label]) => (
              <li key={value} className="rounded-[11px] border border-border-3 bg-pale-3 px-[9px] py-2.5">
                <span className="block text-[14px] font-extrabold tracking-[-0.3px] text-ink">
                  {t(value)}
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-[1.35] text-text-tertiary">
                  {t(label)}
                </span>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-2.5 text-[12.5px] leading-[1.5] text-text-tertiary">{t('calc.188')}</p>
        </div>
      </div>
      <div className="grid items-start gap-7 max-md:hidden lg:grid-cols-[1.05fr_0.95fr]">
        <QuotaLoader
          variant="desktop"
          locale={locale}
          quotaRatio={ratio}
          labels={quota}
          fallback={fallback('desktop')}
        />
        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-tint-border bg-white px-[26px] py-6">
            <p className={KICKER}>{t('calc.150')}</p>
            <p className="m-0 mb-[18px] text-[15px] leading-[1.65] text-text-secondary xl:text-[11.25px]">
              <Sentence runs={[t('calc.151'), b(t('calc.152')), t('calc.153')]} />
            </p>
            <ul className="m-0 flex list-none flex-col gap-[11px] p-0">
              {(
                [
                  ['calc.154', 'calc.155', 'calc.156'],
                  ['calc.157', 'calc.158', 'calc.159'],
                  ['calc.160', 'calc.161', 'calc.162'],
                ] as const
              ).map(([lead, strong, tail]) => (
                <li key={strong} className="flex items-start gap-[11px]">
                  <Dot tone="blue" />
                  <span className="text-[14px] leading-[1.6] text-text-secondary xl:text-[10.5px]">
                    {/* calc.154/157 are deliberately empty in Turkish — Sentence drops them */}
                    <Sentence runs={[t(lead), b(t(strong)), t(tail)]} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-tint-border bg-pale-2 px-[26px] py-6">
            <p className={KICKER}>{t('calc.163')}</p>
            <p className="m-0 mb-4 text-[15px] leading-[1.65] text-text-secondary xl:text-[11.25px]">
              <Sentence runs={[t('calc.164'), b(t('calc.165')), t('calc.166')]} />
            </p>
            <ul className="m-0 grid list-none grid-cols-3 gap-2.5 p-0">
              {CRITERIA.map(([value, label]) => (
                <li key={value} className="rounded-xs border border-border-2 bg-white px-3.5 py-[13px]">
                  <span className="block text-[16.5px] font-extrabold tracking-[-0.3px] text-ink xl:text-[12.4px]">
                    {t(value)}
                  </span>
                  <span className="mt-[3px] block text-[12px] leading-[1.45] text-text-tertiary xl:text-[9px]">
                    {t(label)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-3 text-[12.5px] leading-[1.55] text-text-tertiary xl:text-[9.4px]">
              <Sentence
                runs={[
                  t('calc.170'),
                  {
                    node: (
                      <a href="#passcheck" className="font-extrabold text-blue-safe no-underline hover:underline">
                        {t('calc.171')}
                      </a>
                    ),
                    text: t('calc.171'),
                  },
                ]}
              />
            </p>
          </div>
        </div>
      </div>
      <Exemptions ctx={ctx} />
    </>
  );
}

/* ---------- #passcheck (1179–1242) ---------- */

export function PassCheck({ ctx }: { ctx: CalcCtx }) {
  const { sys, locale, rateConfig, roles, roleLabels, labels, settings } = ctx;
  if (roles.length === 0) return null;
  const pass = labels.pass;
  // The island's first render: nothing answered, the quota row from the defaults (calc.559/561).
  const view = computePassView({
    answers: {},
    inputs: DEFAULT_INPUTS,
    roles,
    rateConfig,
    locale,
    roleLabels,
    labels: pass,
    copy: makePassCopy(sys),
  });
  const controls = Object.fromEntries(
    MANUAL_ROWS.map((row) => [
      row,
      <TriStateLook key={row} labels={[pass.pcYes, pass.pcNo, pass.pcMaybe]} />,
    ]),
  ) as Record<ManualRow, ReactNode>;
  return (
    <PassCheckLoader
      locale={locale}
      rateConfig={rateConfig}
      roles={roles}
      roleLabels={roleLabels}
      labels={pass}
      whatsappNumber={settings.whatsappNumber}
      fallback={
        <PassCheckView
          view={view}
          labels={pass}
          live={false}
          controls={controls}
          reset={
            <button type="button" className={`${RESET} invisible`}>
              {pass.pcReset}
            </button>
          }
          bar={<BarLook label={pass.vRes} valueText={view.count} pct={view.progressPct} tone="blue" />}
          send={
            // Before the island arrives: the bare chat, tracked (W95 — nothing to compose yet)
            <ContactLink
              href={`https://wa.me/${settings.whatsappNumber}`}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="pass-send"
              className={buttonClassName('success', 'lg', 'w-full')}
            >
              {pass.pcSend}
            </ContactLink>
          }
        />
      }
    />
  );
}

/* ---------- #incentives (1244–1338) ---------- */

const INC = {
  blue: {
    card: 'flex flex-col rounded-md border-[1.5px] border-tint-border bg-white px-6 py-[26px]',
    badge:
      'mb-3.5 self-end rounded-pill border border-tint-border bg-tint px-2.5 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[0.6px] text-blue-safe',
    sub: 'm-0 mb-2 text-[13px] font-extrabold text-blue-safe',
  },
  green: {
    card: 'flex flex-col rounded-md border-[1.5px] border-success-border bg-white px-6 py-[26px]',
    badge:
      'mb-3.5 self-end rounded-pill border border-success-border bg-success-surface px-2.5 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[0.6px] text-success-text',
    sub: 'm-0 mb-2 text-[13px] font-extrabold text-success-text',
  },
  plain: {
    card: 'flex flex-col rounded-md border border-border-2 bg-white px-6 py-[26px]',
    badge:
      'mb-3.5 self-end rounded-pill border border-border-2 bg-pale-1 px-2.5 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[0.6px] text-text-secondary',
    sub: 'm-0 mb-2 text-[13px] font-extrabold text-[#253063]',
  },
} as const;

function IncentiveCard({
  tone,
  badge,
  title,
  sub,
  body,
  foot,
}: {
  tone: keyof typeof INC;
  badge: string;
  title: string;
  sub: string;
  body: string;
  foot: ReactNode;
}) {
  const c = INC[tone];
  return (
    <div className={c.card}>
      <span className={c.badge}>{badge}</span>
      <h3 className="m-0 mb-1 text-[17px] font-extrabold text-ink xl:text-[12.75px]">{title}</h3>
      <p className={c.sub}>{sub}</p>
      <p className="m-0 mb-3.5 text-[14px] leading-[1.6] text-text-secondary xl:text-[10.5px]">
        {body}
      </p>
      <div className="mt-auto border-t border-border-3 pt-3.5 text-[13.5px] leading-[1.55] text-text-tertiary">
        {foot}
      </div>
    </div>
  );
}

export function Incentives({ ctx }: { ctx: CalcCtx }) {
  const { t, locale, rateConfig } = ctx;
  // D17: the three percentages come from rateConfig.sgkRates (calc.415–417 are not rendered);
  // the design's typed "₺12.700" is 10 × supportMonthly through formatTRY (D18).
  const rates = {
    manufacturing: sgkRateLabel(rateConfig, 'manufacturing', locale),
    other: sgkRateLabel(rateConfig, 'other', locale),
    none: sgkRateLabel(rateConfig, 'none', locale),
  };
  const tenWorkers = formatTRY(10 * rateConfig.supportMonthly, locale);
  return (
    <>
      <div data-testid="calc-incentives-mobile" className="md:hidden">
        <div className="mb-2.5 rounded-sm bg-navy p-[15px]">
          <p className={KICKER_DARK}>{t('calc.357')}</p>
          <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
            <li className="flex items-start gap-2.5">
              <Tick dark />
              <span className="min-w-0 text-[13.5px] leading-[1.5] text-white/85">
                {/* the rate the calculator holds, live (LiveSgkRate reads the shared store) */}
                <Sentence
                  runs={[
                    b(t('calc.358')),
                    t('calc.359'),
                    { node: <LiveSgkRate rates={rates} />, text: rates.other },
                    t('calc.360'),
                  ]}
                  strong="font-extrabold text-white"
                />
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Tick dark />
              <span className="min-w-0 text-[13.5px] leading-[1.5] text-white/85">
                <Sentence runs={[b(t('calc.361')), t('calc.362')]} strong="font-extrabold text-white" />
              </span>
            </li>
          </ul>
        </div>
        <div className="mb-2.5 rounded-sm border border-border-1 bg-white px-3.5 py-[13px]">
          <p className={KICKER_SM}>{t('calc.363')}</p>
          <p className="m-0 text-[13.5px] leading-[1.55] text-text-secondary">
            <Sentence runs={[b(t('calc.364')), t('calc.365')]} />
          </p>
        </div>
        <div className="rounded-sm border border-warning-border bg-warning-surface px-3.5 py-[13px]">
          <p className="m-0 mb-[7px] text-[11px] font-extrabold uppercase tracking-[1.1px] text-warning-text">
            {t('calc.366')}
          </p>
          <p className="m-0 text-[13.5px] leading-[1.55] text-[#7a5210]">
            {/* calc.367 is deliberately empty in Turkish */}
            <Sentence runs={[t('calc.367'), b(t('calc.368')), t('calc.369')]} />
          </p>
        </div>
      </div>
      <div className="max-md:hidden">
        <div className="mb-5 grid gap-5 lg:grid-cols-3">
          <IncentiveCard
            tone="blue"
            badge={t('calc.388')}
            title={t('calc.330')}
            sub={t('calc.331')}
            body={t('calc.341')}
            foot={
              <dl data-testid="calc-sgk-rates" className="m-0 flex flex-col gap-1.5">
                {(
                  [
                    ['calc.385', rates.none, false],
                    ['calc.386', rates.other, false],
                    ['calc.387', rates.manufacturing, true],
                  ] as const
                ).map(([id, value, lowest]) => (
                  <div key={id} className="flex justify-between gap-2.5">
                    <dt>{t(id)}</dt>
                    <dd className={lowest ? 'm-0 font-extrabold text-success-text' : 'm-0 font-extrabold text-ink'}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            }
          />
          <IncentiveCard
            tone="green"
            badge={t('calc.388')}
            title={t('calc.332')}
            sub={t('calc.337')}
            body={t('calc.338')}
            foot={
              <Sentence
                runs={[t('calc.339'), b(tenWorkers), t('calc.340')]}
                strong="font-extrabold text-success-text"
              />
            }
          />
          <IncentiveCard
            tone="plain"
            badge={t('calc.389')}
            title={t('calc.333')}
            sub={t('calc.334')}
            body={t('calc.335')}
            foot={t('calc.336')}
          />
        </div>
        <div className="mb-5 rounded-md border border-border-2 bg-white px-7 py-[26px]">
          <h3 className="m-0 mb-4 text-[18px] font-extrabold text-ink xl:text-[13.5px]">
            {/* TR: "Devletin öde" + "mediği" + "şeyler" — the suffix stays glued (fragments.ts) */}
            <Sentence
              runs={[t('calc.342'), { em: t('calc.343') }, t('calc.344')]}
              em="not-italic underline decoration-warning-border decoration-[3px] underline-offset-[3px]"
            />
          </h3>
          <div className="grid gap-x-[34px] gap-y-[22px] md:grid-cols-2">
            {(
              [
                ['calc.345', 'calc.346'],
                ['calc.347', 'calc.348'],
                ['calc.349', 'calc.350'],
                ['calc.351', 'calc.352'],
              ] as const
            ).map(([title, body]) => (
              <div key={title}>
                <p className="m-0 mb-[5px] text-[15px] font-extrabold text-ink xl:text-[11.25px]">{t(title)}</p>
                <p className="m-0 text-[14px] leading-[1.6] text-text-secondary xl:text-[10.5px]">{t(body)}</p>
              </div>
            ))}
          </div>
          <p className="m-0 mt-[18px] border-t border-border-3 pt-4 text-[14px] leading-[1.6] text-text-secondary xl:text-[10.5px]">
            <Sentence runs={[b(t('calc.353')), t('calc.354')]} />
          </p>
        </div>
        <Note tone="amber">
          <Sentence runs={[b(t('calc.355')), t('calc.356')]} />
        </Note>
      </div>
    </>
  );
}

/* ---------- #penalties (1340–1397) ---------- */

const FINE_ROW = 'flex items-baseline justify-between gap-3 py-[11px]';
const FINE_CARD = 'rounded-md border-[1.5px] border-warning-border bg-warning-surface px-7 py-[26px]';
const CONSEQUENCES =
  'mx-auto mt-5 grid max-w-[1080px] list-none gap-4 p-0 lg:grid-cols-3 max-md:mt-0 max-md:gap-0 max-md:overflow-hidden max-md:rounded-sm max-md:border max-md:border-border-1 max-md:bg-white xl:max-w-[810px]';
const CONSEQUENCE =
  'rounded-sm border border-border-2 bg-white px-[22px] py-5 max-md:rounded-none max-md:border-0 max-md:border-t max-md:border-border-3 max-md:px-3.5 max-md:py-3 max-md:first:border-t-0';

export function Penalties({ ctx }: { ctx: CalcCtx }) {
  const { t } = ctx;
  const fine = (kicker: string, amount: string, body: Run[]) => (
    <div className={FINE_CARD}>
      <p className="m-0 mb-2.5 text-eyebrow font-extrabold uppercase tracking-[1px] text-warning-text">
        {t(kicker)}
      </p>
      <p className="m-0 mb-2 text-[34px] font-extrabold leading-none tracking-[-1px] text-ink xl:text-[25.5px]">
        {t(amount)}
      </p>
      <p className="m-0 text-[14.5px] leading-[1.6] text-[#7a5210] xl:text-[10.9px]">
        <Sentence runs={body} />
      </p>
    </div>
  );
  return (
    <>
      <div className="md:hidden">
        <div className="mb-2.5 rounded-sm border-[1.5px] border-warning-border bg-warning-surface px-3.5 pt-1.5 pb-2">
          <dl className="m-0">
            <div className={FINE_ROW}>
              <dt className="min-w-0 text-[13px] font-bold leading-[1.4] text-[#7a5210]">
                <Lines text={t('calc.124')} />
              </dt>
              <dd className="m-0 flex-none text-[22px] font-extrabold tracking-[-0.6px] text-ink">
                {t('calc.407')}
              </dd>
            </div>
            <div className={`${FINE_ROW} border-t border-warning-border`}>
              <dt className="min-w-0 text-[13px] font-bold leading-[1.4] text-[#7a5210]">
                <Lines text={t('calc.125')} />
              </dt>
              <dd className="m-0 flex-none text-[22px] font-extrabold tracking-[-0.6px] text-ink">
                {t('calc.409')}
              </dd>
            </div>
          </dl>
          <p className="m-0 border-t border-warning-border pt-[9px] pb-[3px] text-[12.5px] leading-[1.5] text-[#7a5210]">
            <Sentence runs={[t('calc.126'), b(t('calc.127')), t('calc.128')]} />
          </p>
        </div>
        <div className="mb-2.5 rounded-sm bg-navy p-[15px]">
          <p className="m-0 text-[15.5px] font-bold leading-[1.45] text-white">
            <Sentence
              runs={[t('calc.129'), b(t('calc.130')), t('calc.131')]}
              strong="font-extrabold text-sky"
            />
          </p>
          <p className="m-0 mt-2.5 border-t border-white/15 pt-2.5 text-[13px] leading-[1.5] text-white/80">
            <Sentence runs={[t('calc.132'), b(t('calc.133'))]} strong="font-extrabold text-white" />
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1080px] gap-5 max-md:hidden md:grid-cols-2 xl:max-w-[810px]">
        {/* calc.408 (the doubled fine) is the package's own string — the design typed it (line 1369) */}
        {fine('calc.111', 'calc.407', [t('calc.112'), b(t('calc.408')), t('calc.113')])}
        {fine('calc.114', 'calc.409', [t('calc.115'), b(t('calc.116')), t('calc.117')])}
      </div>
      <ul data-testid="calc-consequences" className={CONSEQUENCES}>
        {(
          [
            ['calc.118', 'calc.119'],
            ['calc.120', 'calc.121'],
            ['calc.122', 'calc.123'],
          ] as const
        ).map(([title, body]) => (
          <li key={title} className={CONSEQUENCE}>
            <h3 className="m-0 mb-[5px] text-[15px] font-extrabold text-ink max-md:mb-[3px] max-md:text-[14px] xl:text-[11.25px]">
              {t(title)}
            </h3>
            <p className="m-0 text-body-sm leading-[1.6] text-text-secondary max-md:text-[12.5px] max-md:leading-[1.5]">
              {t(body)}
            </p>
          </li>
        ))}
      </ul>
      <Note tone="green" className="mx-auto mt-[22px] max-w-[1080px] max-md:hidden xl:max-w-[810px]">
        <Sentence runs={[t('calc.134'), b(t('calc.135')), t('calc.136'), b(t('calc.137'))]} />
      </Note>
    </>
  );
}

/* ---------- #students (1399–1490) ---------- */

const STUDENT = {
  amber: {
    card: 'mb-2 rounded-sm border border-border-1 bg-white px-3.5 py-[13px]',
    cell: 'rounded-[11px] border border-warning-border bg-warning-surface px-2.5 py-[9px]',
    value: 'block text-[14.5px] font-extrabold text-ink',
    note: 'mt-0.5 block text-[11.5px] leading-[1.35] text-[#7a5210]',
  },
  green: {
    card: 'mb-2.5 rounded-sm border-[1.5px] border-success-border bg-white px-3.5 py-[13px]',
    cell: 'rounded-[11px] border border-success-border bg-success-surface px-2.5 py-[9px]',
    value: 'block text-[14.5px] font-extrabold text-success-text',
    note: 'mt-0.5 block text-[11.5px] leading-[1.35] text-[#14532d]',
  },
} as const;
const TIER = {
  amber: 'rounded-md border border-border-2 bg-white px-7 py-[26px]',
  green: 'rounded-md border-[1.5px] border-success-border bg-white px-7 py-[26px]',
} as const;
const RULE_ROW = 'px-3.5 py-[11px] text-[13px] leading-[1.5]';

function StudentPhoneCard({
  tone,
  title,
  sub,
  cells,
  note,
}: {
  tone: keyof typeof STUDENT;
  title: string;
  sub: string;
  cells: readonly (readonly [string, string])[];
  note: string;
}) {
  const s = STUDENT[tone];
  return (
    <div className={s.card}>
      <p className="m-0 mb-2.5">
        <span className="block text-[14.5px] font-extrabold leading-[1.2] text-ink">{title}</span>
        <span className="block text-[11.5px] font-bold text-text-tertiary">{sub}</span>
      </p>
      <div className="grid grid-cols-2 gap-[7px]">
        {cells.map(([value, label]) => (
          <p key={value} className={`m-0 ${s.cell}`}>
            <span className={s.value}>{value}</span>
            <span className={s.note}>{label}</span>
          </p>
        ))}
      </div>
      <p className="m-0 mt-[9px] text-[12.5px] leading-[1.5] text-text-tertiary">{note}</p>
    </div>
  );
}

function TierCard({
  tone,
  title,
  sub,
  items,
}: {
  tone: keyof typeof TIER;
  title: string;
  sub: string;
  items: Run[][];
}) {
  return (
    <div className={TIER[tone]}>
      <h3 className="m-0 text-[17.5px] font-extrabold text-ink xl:text-[13.1px]">{title}</h3>
      <p className="m-0 mb-3.5 text-[13px] font-bold text-text-tertiary">{sub}</p>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map((runs, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Dot tone={tone} />
            <span className="text-[14.5px] leading-[1.55] text-text-secondary xl:text-[10.9px]">
              <Sentence runs={runs} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Students({ ctx }: { ctx: CalcCtx }) {
  const { t } = ctx;
  const rules: [string, string][] = [
    ['calc.303', 'calc.304'],
    ['calc.305', 'calc.306'],
    ['calc.307', 'calc.308'],
  ];
  return (
    <>
      <div className="md:hidden">
        <div className="mb-2.5 rounded-sm bg-navy p-[15px]">
          <p className={KICKER_DARK}>{t('calc.285')}</p>
          <p className="m-0 text-[15px] font-bold leading-[1.45] text-white">
            <Sentence
              runs={[t('calc.286'), b(t('calc.287')), t('calc.288')]}
              strong="font-extrabold text-sky"
            />
          </p>
        </div>
        {/* the design types the phone subtitle of the second card (line 1440); calc.297 is its id */}
        <StudentPhoneCard
          tone="amber"
          title={t('calc.289')}
          sub={t('calc.290')}
          cells={[
            [t('calc.291'), t('calc.292')],
            [t('calc.293'), t('calc.294')],
          ]}
          note={t('calc.295')}
        />
        <StudentPhoneCard
          tone="green"
          title={t('calc.296')}
          sub={t('calc.297')}
          cells={[
            [t('calc.298'), t('calc.299')],
            [t('calc.300'), t('calc.301')],
          ]}
          note={t('calc.302')}
        />
        <ul
          data-testid="calc-students-rules"
          className="m-0 list-none overflow-hidden rounded-sm border border-border-1 bg-white p-0"
        >
          {rules.map(([strong, rest], i) => (
            <li
              key={strong}
              className={
                i === 0
                  ? `${RULE_ROW} text-text-secondary`
                  : `${RULE_ROW} border-t border-border-3 text-text-secondary`
              }
            >
              <Sentence runs={[b(t(strong)), t(rest)]} />
            </li>
          ))}
          <li className={`${RULE_ROW} border-t border-warning-border bg-warning-surface text-[#7a5210]`}>
            <Sentence runs={[b(t('calc.309')), t('calc.310')]} />
          </li>
        </ul>
      </div>
      <div className="max-md:hidden">
        <div className="mb-5 grid gap-5 md:grid-cols-2">
          {/* the design types both subtitles (lines 1447, 1461); calc.263/271 are their ids */}
          <TierCard
            tone="amber"
            title={t('calc.262')}
            sub={t('calc.263')}
            items={[
              [t('calc.264'), b(t('calc.265')), t('calc.266')],
              [b(t('calc.267')), t('calc.268')],
              [t('calc.269')],
            ]}
          />
          <TierCard
            tone="green"
            title={t('calc.270')}
            sub={t('calc.271')}
            items={[[b(t('calc.272')), t('calc.273')], [b(t('calc.274')), t('calc.275')], [t('calc.276')]]}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-sm border border-border-2 bg-white px-5 py-[18px]">
            <h3 className="m-0 mb-1 text-[14.5px] font-extrabold text-ink xl:text-[10.9px]">{t('calc.277')}</h3>
            <p className="m-0 text-body-sm leading-[1.6] text-text-secondary">{t('calc.278')}</p>
          </div>
          <div className="rounded-sm border border-border-2 bg-white px-5 py-[18px]">
            <h3 className="m-0 mb-1 text-[14.5px] font-extrabold text-ink xl:text-[10.9px]">{t('calc.279')}</h3>
            <p className="m-0 text-body-sm leading-[1.6] text-text-secondary">{t('calc.280')}</p>
          </div>
          <div className="rounded-sm border border-warning-border bg-warning-surface px-5 py-[18px]">
            <h3 className="m-0 mb-1 text-[14.5px] font-extrabold text-ink xl:text-[10.9px]">{t('calc.281')}</h3>
            <p className="m-0 text-body-sm leading-[1.6] text-[#7a5210]">{t('calc.282')}</p>
          </div>
        </div>
        <p className="m-0 mt-5 rounded-sm border border-tint-border bg-white px-[22px] py-4 text-body-sm leading-[1.6] text-text-secondary">
          <Sentence runs={[b(t('calc.283')), t('calc.284')]} />
        </p>
      </div>
    </>
  );
}

/* ---------- #faq (1492–1532) ---------- */

/** `FaqBlock` (one FAQPage node, AEO only) with the design's ask card: WhatsApp (generic,
 *  visitor-voice prefill — never an estimate, W95) and the e-mail row (W83, subject = this
 *  page's name). The block's id is `calc-faq`: the section itself is `#faq`. */
export function Faq({ ctx }: { ctx: CalcCtx }) {
  const { t, sys, bundle, locale, settings } = ctx;
  const items = Array.from({ length: 15 }, (_, i) => ({
    id: `calc-faq-${i + 1}`,
    q: t(`calc.${480 + 2 * i}`),
    a: t(`calc.${481 + 2 * i}`),
  }));
  return (
    <FaqBlock
      bundle={bundle}
      locale={locale}
      id="calc-faq"
      items={items}
      eyebrowId="calc.405"
      headingId="calc.383"
      bodyId="calc.384"
      openFirst
      askCard={{
        titleId: 'calc.380',
        bodyId: 'calc.381',
        whatsappNumber: settings.whatsappNumber,
        whatsappText: sys('calc.whatsapp.generic'),
        whatsappLabelId: 'calc.052',
        email: settings.email,
        emailLabelId: 'calc.406',
        subject: t('calc.002'),
      }}
    />
  );
}
```

Notes on `content.tsx` for the implementer:
- `KICKER*`, `Note`, `Tick`, `Dot`, `Lines` come from `_sections/ui.tsx`; the class-collision scan resolves the `const` maps (`INC[tone].card`, `STUDENT[tone].cell`, `LADDER.blue`, `SPREAD_VALUE.once`) and the `${…}` template compositions, so every combination is checked — a caller's `className` on `Note` carries margins/visibility only.
- `Tabs` (`@/design/primitives/Tabs`, `'use client'`) is imported by path from this server module (W156); its panels are server-rendered nodes. It is the page's only eager primitive island (≈ 1 KB) and the first thing Cycle 8(b) removes if a route crosses 194,560 B.
- The VS badge is CSS content (`before:content-['VS']`) inside an `aria-hidden` span: the header cell has no text node, so axe's `td-has-header` never sees a data cell without a header, and no package id is invented for a decorative glyph (delta 9).
- `calc.415`–`417` (typed percentages), `calc.410` (the doubled agent fine, already inside `calc.117`) and the design's typed `₺12.700` are not rendered (D17); `calc.408` is rendered where the design typed its literal (line 1369).

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/ClosingBand.tsx`:

```tsx
import { ContactLink } from '@/analytics/ContactLink';
import { Button } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { mailLink } from '@/lib/contact';
import { RecapLoader } from '../_components/LazyBinders';
import { QuoteButton } from '../_components/QuoteButton';
import { RecapCard } from '../_components/RecapCard';
import type { CalcCtx } from './context';

/**
 * `#calc-cta` (design 1534–1553) — the sticky bar hides near it (W18). The design's green
 * WhatsApp "Get a written quote" becomes the W3 quote form's opener (`primary`, delta 1/8); the
 * phone recap shows the estimate the form sends (`RecapCard`, loaded 200 px before view, delta
 * 10); "See available candidates" links to T8's page (no prefetch while it may still 404, W20);
 * the legal line's e-mail is a tracked contact link (`page_cta`, W12). Not `ClosingCtaBand`: the
 * design's band is a full-width pale gradient, not a rounded card (W127/W128 — no green band).
 */
export function ClosingBand({ ctx }: { ctx: CalcCtx }) {
  const { t, locale, rateConfig, roles, roleLabels, industryLabels, labels, defaultView, settings } =
    ctx;
  return (
    <Section
      id="calc-cta"
      tone="pale"
      className="border-t border-tint-border bg-[linear-gradient(180deg,#f4f9fc_0%,#e8f3f9_100%)] max-md:pt-[26px] max-md:pb-[30px] md:py-[72px] xl:py-[54px]"
    >
      <div data-testid="calc-closing" className="container-site">
        <div className="mx-auto max-w-[900px] text-center max-md:text-left xl:max-w-[675px]">
          <h2 className="m-0 mb-3.5 text-h2 leading-[1.05] tracking-[-0.04em] text-ink max-md:mb-2 max-md:text-[24px] max-md:tracking-[-0.6px]">
            {t('calc.100')}
          </h2>
          <p className="mx-auto mt-0 mb-7 max-w-[600px] text-body-lg text-text-secondary max-md:mb-3.5 max-md:text-[14px] xl:max-w-[450px]">
            {t('calc.101')}
          </p>
          {defaultView ? (
            <div data-testid="calc-recap" className="mb-3 md:hidden">
              <RecapLoader
                locale={locale}
                rateConfig={rateConfig}
                roles={roles}
                roleLabels={roleLabels}
                industryLabels={industryLabels}
                cardLabels={labels.cardView}
                labels={labels.recap}
                fallback={<RecapCard view={defaultView} labels={labels.recap} />}
              />
            </div>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3.5 max-md:grid max-md:grid-cols-1 max-md:gap-2">
            <QuoteButton
              label={t('calc.105')}
              variant="primary"
              size="lg"
              className="max-md:w-full"
              testId="calc-quote-open-band"
            />
            <Button
              variant="secondary"
              size="lg"
              href="/available-workers"
              prefetch={false}
              className="max-md:w-full"
            >
              {t('calc.106')}
            </Button>
          </div>
          <p className="m-0 mt-[26px] text-body-sm text-text-secondary max-md:mt-3.5 max-md:text-[12px]">
            JobsAdmire · {t('calc.418')} · {t('calc.420')} ·{' '}
            <ContactLink
              href={mailLink(settings.email)}
              placement="page_cta"
              className="font-bold text-blue-safe no-underline hover:underline"
            >
              {settings.email}
            </ContactLink>
          </p>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import type { StickyCta } from '@/design/chrome/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { submitCalculatorQuote } from './actions';
import { LazyStickyBar } from './_components/LazyBinders';
import { QuoteSheetHost } from './_components/QuoteSheetHost';
import { CalcSection } from './_sections/CalcSection';
import { ClosingBand } from './_sections/ClosingBand';
import {
  Basis,
  Compare,
  Faq,
  Incentives,
  JumpChips,
  PassCheck,
  Penalties,
  Quota,
  Salaries,
  Students,
} from './_sections/content';
import { loadCalcCtx } from './_sections/context';
import { CalculatorCard, Hero } from './_sections/Hero';

/** W150 (D17): the hero's dated rates badge switches off at `rateConfig.reviewDueAt`; the page is
 *  statically generated, so it re-renders daily. */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  // The page record `calc` carries '' ids (the package ships no SEO string for this page,
  // W23/W38), so sys.seo.calc.* is the title/description. buildMetadata adds the canonical, the
  // hreflang pair and the OG image — pageOgImageUrl(locale, 'calc') = /og/{locale}/calc.png,
  // CDN-cached (W123), whose title the OG route also reads from sys.seo.calc.title.
  return buildMetadata({
    locale,
    href: '/hiring-cost-calculator',
    bundle,
    pageKey: 'calc',
    fallbackTitle: sys('seo.calc.title'),
    fallbackDescription: sys('seo.calc.description'),
  });
}

/** The Cost Calculator (design/Hiring Cost Calculator), section for section in the design's
 *  order. No <main> here — SiteChrome owns it (R31). One Breadcrumbs (Hero) and one FaqBlock
 *  (Faq): one BreadcrumbList and one FAQPage node on the page. */
export default async function HiringCostCalculator({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const ctx = await loadCalcCtx(locale);
  const { t, sys, settings: s } = ctx;
  // W18/W81: the bar renders its tel:/wa.me CTAs through ContactCta (page_cta); its WhatsApp
  // prefill is the generic visitor-voice line, never the estimate (W95); faces are variants
  // (W122/W127), never caller classes.
  const stickyCtas: StickyCta[] = [
    { label: t('calc.051'), href: telLink(s.phone), variant: 'secondary' },
    {
      label: t('calc.052'),
      href: waLink(s.whatsappNumber, sys('calc.whatsapp.generic')),
      variant: 'success',
      external: true,
    },
    { label: t('calc.053'), href: '/hire-workers', variant: 'primary' },
  ];
  return (
    <>
      <Hero ctx={ctx}>
        <CalculatorCard ctx={ctx} />
      </Hero>
      <JumpChips ctx={ctx} />
      <CalcSection
        id="basis"
        tone="light"
        pad="basis"
        width="narrow"
        testId="calc-basis"
        toggle={{ title: t('calc.060'), subtitle: t('calc.061') }}
        head={{ title: t('calc.076'), sub: t('calc.077'), size: 'sm' }}
      >
        <Basis ctx={ctx} />
      </CalcSection>
      {/* design .ja-sticky: after 700 px, gone near the closing band (W18). The wrapper sits here,
          below the audit's first viewport, so the bar's chunk loads on the first scroll — or on a
          jump past it (its margin reaches far above the viewport, W13 amended) */}
      <LazyStickyBar
        message={t('calc.050')}
        ctas={stickyCtas}
        showAfterPx={700}
        hideNearId="calc-cta"
        live
      />
      <CalcSection
        id="salaries"
        tone="pale"
        testId="calc-salaries"
        toggle={{ title: t('calc.062'), subtitle: t('calc.063') }}
        head={{ title: t('calc.091'), sub: t('calc.092'), align: 'left' }}
      >
        <Salaries ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="compare"
        tone="light"
        testId="calc-compare"
        toggle={{ title: t('calc.064'), subtitle: t('calc.065') }}
        head={{ title: t('calc.189'), sub: t('calc.190') }}
      >
        <Compare ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="quota"
        tone="pale"
        testId="calc-quota"
        toggle={{ title: t('calc.066'), subtitle: t('calc.067') }}
        head={{ title: t('calc.138'), sub: t('calc.139') }}
      >
        <Quota ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="passcheck"
        tone="light"
        testId="calc-passcheck"
        toggle={{ title: t('calc.068'), subtitle: t('calc.069') }}
        head={{ title: t('calc.068'), sub: t('calc.382') }}
      >
        <PassCheck ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="incentives"
        tone="pale"
        testId="calc-incentives"
        toggle={{ title: t('calc.326'), subtitle: t('calc.327') }}
        head={{ title: t('calc.328'), sub: t('calc.329') }}
      >
        <Incentives ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="penalties"
        tone="light"
        testId="calc-penalties"
        toggle={{ title: t('calc.070'), subtitle: t('calc.071') }}
        head={{ title: t('calc.109'), sub: t('calc.110') }}
      >
        <Penalties ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="students"
        tone="pale"
        testId="calc-students"
        toggle={{ title: t('calc.072'), subtitle: t('calc.073') }}
        head={{ title: t('calc.260'), sub: t('calc.261') }}
      >
        <Students ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="faq"
        tone="light"
        testId="calc-faq-section"
        toggle={{ title: t('calc.074'), subtitle: t('calc.075') }}
      >
        <Faq ctx={ctx} />
      </CalcSection>
      <ClosingBand ctx={ctx} />
      {/* W3: the one written-quote form, a bottom sheet mounted once; nothing (not even the
          forms kernel) loads until a quote button asks for it (W13 amended) */}
      <QuoteSheetHost
        action={submitCalculatorQuote}
        locale={locale}
        turnstileSiteKey={s.turnstileSiteKey}
        whatsappNumber={s.whatsappNumber}
        contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
        countries={ctx.countries}
        roles={ctx.roles}
        rateConfig={ctx.rateConfig}
        roleLabels={ctx.roleLabels}
        industryLabels={ctx.industryLabels}
        cardLabels={ctx.labels.cardView}
        recapLabels={ctx.labels.recap}
        labels={{ ...ctx.labels.sheet, close: sys('nav.close') }}
        loadingLabel={sys('calc.quote.loading')}
      />
    </>
  );
}
```

Notes for the implementer:
- No `generateStaticParams` (the locale layout has it); `revalidate` makes the route ISR at one day — the build lists it as `●` with `1d`.
- `sys('nav.close')` is resolved here and passed down: `nav` stays out of `CLIENT_SYS` (W148 amended — no client module reads it).
- Every `tel:`/`wa.me`/`mailto:` anchor on the page is a `ContactCta`/`ContactLink` (`page_cta`) or the click-time `WhatsAppComposeLink` (W12/W32/W95); the forms kernel's panel uses `form_fallback`. No href carries visitor data (W76/W95): the only prefilled hrefs carry `sys.calc.whatsapp.generic`.

`src/lib/seo/routes.ts` — inside the `UNBUILT_PATHNAMES` set literal, delete the line `  '/hiring-cost-calculator',` (W20; `unbuilt.test.ts` now sees the new `page.tsx` and requires exactly this deletion; the sitemap and `app/robots.ts` follow the set by themselves).

`e2e/routes.ts` — at the end of the `GATE_ROUTE_TABLE` array literal, after the last row T1/T13/T2 left (at WP2a the literal ended with `{ path: '/tesekkurler?form=hire', indexable: false },`), append (W21):

```ts
  { path: '/maliyet-hesaplayici', indexable: true },
  { path: '/en/hiring-cost-calculator', indexable: true },
```

`docs/SEO.md` — append one row to the `## Pages` table T1 created (W98; columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`), after the last row:

```markdown
| Cost Calculator (T3) | `/maliyet-hesaplayici` · `/en/hiring-cost-calculator` | `sys.seo.calc.{title,description}` — the page record `calc` carries `''` ids (W23/W38); OG `/og/{locale}/calc.png` (title `sys.seo.calc.title`, subline `sys.seo.ogTagline`), CDN-cached (W123) | `absoluteUrl(locale, '/hiring-cost-calculator')`; hreflang tr / en / x-default | layout `Organization` + `WebSite`; `BreadcrumbList` (2: `calc.001` → `/`, `calc.002` → this page, W109); `FAQPage` (15 pairs `calc.480`–`509`, AEO only) — one `Breadcrumbs`, one `FaqBlock` | **the h1** (`data-lcp-slot="h1"`); the full-bleed hero slot `calc-hero` is a named placeholder under the 90–97 % navy gradient — decorative, never preloaded, never the LCP (D26/W55) | `revalidate = 86400` for the D17 rates badge (W150); `#calculator` for the header CTA (W152/W158); the written-quote form lives in a bottom sheet (`calculator`, W3); pixel page (D27) |
```

`docs/ANALYTICS.md`:
1. In the event-schema table, the `calculator_use` row's "Fires on" cell (at WP2a "Hiring-cost calculator interaction"; keep any homepage-teaser wording T1 added and add the page's) — make it read: "The homepage teaser's preset/chip change (T1) and the Cost Calculator island's role change or headcount commit (T3); `role` is always a role KEY, `headcount` an integer". Re-align the table with `npx prettier --write docs/ANALYTICS.md`.
2. In the paragraph that begins "**WP1 wired exactly one of these seven events**", if `calculator_use` is still listed among the events "declared but still uncalled", remove it from that list (T1's teaser and this page fire it).
3. Under `### Page instrumentation (WP2b)` (T1's heading, W98), append after the last bullet:

```markdown
- **Cost Calculator (`/maliyet-hesaplayici`, `/en/hiring-cost-calculator`, T3):** `calculator_use` from the calculator island on every role change (the desktop select, the phone role sheet, the salary guide's "Use in calculator") and every headcount commit (the stepper on blur/Enter — W131 — or a preset chip): `role` = the role key (`welder`, `cook`, …, W77), `headcount` = the integer; never a salary, a tier, the months or anything typed. `whatsapp_click` with `placement: 'page_cta'` from the pass check's "Send my result" (`WhatsAppComposeLink`: the DOM href is the bare `https://wa.me/<number>`, the answers are composed into the prefill on click, W95; before the island loads, a tracked bare `ContactLink`), the FAQ ask card's WhatsApp row and the sticky bar's WhatsApp (both a generic visitor-voice prefill); `call_click` (`page_cta`) from the sticky bar's Call; `email_click` (`page_cta`) from the FAQ ask card's e-mail row and the closing band's address; the quote form's D11 panel fires the three with `placement: 'form_fallback'` (kernel). `conversion` for `form_key: 'calculator'` comes from `ConversionPing` on `/tesekkurler`. Not ported (W12 — not in the allowlist): the design's `calc_print`, `calc_months`, `calc_sgk_tier`, `calc_role_from_guide` (it becomes a plain `calculator_use`), `quota_check`, `quota_exemption_tab`, `passcheck_answer`. The quote and print buttons, the jump chips and every same-page anchor fire nothing.
```

`docs/PRD.md`:
1. §2 — the table row whose page cell is `Hiring Cost Calculator`: replace its last cell (`Calculator quote capture (\`CALCULATOR_QUOTE\`)`) with:

```markdown
Written-quote form in a bottom sheet (`CALCULATOR_QUOTE` via `calculator`, W3): name*/email* + phone/company/country/message, consent checkbox (W79), `trade` = the role key (W77), `headcount`/`durationMonths`/`estimateSummary` recomputed on the server from the estimate; success → `/tesekkurler?form=calculator` (D13), failure → the D11 fallback panel. The pass check and the quota gate run in the browser only and post nothing (calc.378)
```

2. §11, the sentence that begins "**Not yet built, by design (WP2 and later):**" (`grep -n 'Not yet built' docs/PRD.md`): in whatever wording T1/T13/T2 left it (at WP2a it read "12 of the 14 core pages (only the homepage and Hire Workers exist, …)"), make the Cost Calculator count as built — decrement the unbuilt-page count by one and add the Cost Calculator (WP2b T3) to the built list — and leave the rest of the sentence as it is (W45: edit in place).
3. `## 12. Calculator rules` — append three bullets after the last one (the bullet that begins "**Every computed figure is rounded once, at the edge (D18).**"):

```markdown
- **The written quote is one form (W3/W77).** The page's four "written quote" calls to action open one `calculator` form (name and e-mail required, consent checkbox). The estimate the visitor sees travels as hidden inputs and is recomputed on the server through the same engine — a client-side total is never forwarded as fact; `trade` carries the role key and the localized label rides only inside `estimateSummary` (≤ 2,000 characters, in the request locale).
- **Checks stay in the browser (calc.378, W95).** The pass check and the quota gate compute in the visitor's browser and post nothing; "Send my result" is the visitor's own WhatsApp click whose prefill (the answers) is composed at click time — no answer sits in a DOM href or reaches analytics.
- **The salary guide follows the calculator.** Each role's low is the exact floor (W2); its employer cost uses the SGK tier chosen in the calculator (W59); the salary slider moves over a stop list — the exact floor, every ₺500, the band maximum — so both ends are reachable; the long-term cost spread uses the default one-off (permit fee + flight), not the flight toggle.
```

`docs/ARCHITECTURE.md` — § Quality gate (D27), in the JS-ceiling paragraph, directly after the sentence that ends "**a route above 194,560 B gets a lazy-loading pass before the next page task starts**." insert:

```markdown
The Cost Calculator (WP2b T3) is the reference split: its card renders a server skeleton from the same view model and loads the island on the first hover/touch/focus or at `#calculator` (a viewport trigger would fetch it during the audit — the card sits in the first viewport); the quote sheet, with the forms kernel, loads on the first quote-button hover/focus/click; the salary guide, the quota gate, the pass check, the closing recap and the sticky bar load through `LazyIsland` (the bar's wrapper uses a top-extended `rootMargin`, so a jump past it still loads it).
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hiring-cost-calculator" e2e/pages/calc.spec.ts e2e/routes.ts src/lib/seo/routes.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md docs/ARCHITECTURE.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: clean — typecheck covers `e2e/pages/calc.spec.ts`; `sections.test.tsx` 23 green; `src/lib/seo/unbuilt.test.ts`, `src/app/sitemap.test.ts` and `robots.test.ts` green (the set and the filesystem agree; the sitemap now lists both calculator URLs); `class-collisions.test.ts` green over `_sections/**`, `SectionToggle.tsx` and every Cycle 1–5 file (in particular `BASIS_CARD`/`CONSEQUENCE` — base `border` + `max-md:border-0`/`max-md:border-t` are different groups/variants; `INC[tone]`, `STUDENT[tone]`, `LADDER`, `SPREAD_VALUE`; `<Button variant="secondary" … className="max-md:w-full">`; `buttonClassName('success', 'lg', 'w-full')`); `client-imports.test.ts` green (every primitive/block/island by path — `Section`, `Button`, `Tabs`, `Breadcrumbs`, `EmptyState`, `ImageSlot`, `FaqBlock`; the page reaches `StickyCtaBar` only as a type and through `LazyBinders`' `import()`); `client-messages.test.ts` unchanged (no new client read — `SectionToggle` reads no copy); `messages.test.ts`/`voice.test.ts` unchanged (no new key). Then prove the RSC boundaries cannot fail at build time before Cycle 7 spends its one build — read the three things jsdom cannot: no directive-less module under `_sections/` imports `useState`/`useEffect`/`useSyncExternalStore`, every `'use client'` module's props from `page.tsx` are serialisable (strings, numbers, plain objects, the server action, server-rendered nodes), and `context.ts` is imported only by server modules and by the unit test (as a type in `Hero.tsx`/`content.tsx`/`ClosingBand.tsx`):

```bash
grep -rln "useState\|useEffect\|useSyncExternalStore" "src/app/[locale]/(site)/hiring-cost-calculator/_sections" || echo 'server sections hook-free'
grep -rn "from './context'" "src/app/[locale]/(site)/hiring-cost-calculator/_sections"/*.tsx
```
Expected: `server sections hook-free`; the second grep lists only `import type { CalcCtx } from './context'` lines.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator" e2e/pages/calc.spec.ts e2e/routes.ts src/lib/seo/routes.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md docs/ARCHITECTURE.md
git commit -m "feat(calc): the Cost Calculator page — sections, metadata, #calculator, gate routes, page e2e, docs

Hero + #calculator card (skeleton, W13 amended), phone jump chips, the nine designed sections
with the <=700 px accordion (h2 stays in the a11y tree, W10), exemptions tabs with the sys
badges, incentives from rateConfig (D17), the closing band with the W3 quote opener and the
phone recap, the lazy sticky bar (W18/W81); revalidate 86400 for the dated badge (W150);
UNBUILT_PATHNAMES loses the route and GATE_ROUTE_TABLE gains both locales (W20/W21); the
e2e is deterministic without a door (W92). Docs: SEO row (LCP = h1), ANALYTICS bullet, PRD
section 2/11/12, ARCHITECTURE split sentence.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 7 — the W126 proof session: one build, one start, the gate, js-size, pixel run 1, the launch anchor check; the ledger row

One heavy job at a time, in this order, and the server is killed at the end whatever the outcome. This is the task's one build (W126); Playwright, Lighthouse and the pixel harness run only here (and in Cycle 8's conditional re-proof).

- [ ] **Step 1: Pre-flight — no new test (the Cycle 6 page spec and the existing gate are the tests); check the facts this task relies on and must not edit**

```bash
grep -n "maliyet-hesaplayici\|/en/hiring-cost-calculator" e2e/routes.ts   # 2 rows, both `indexable: true` (W21)
grep -n "'/hiring-cost-calculator'" src/lib/seo/routes.ts                  # no hit — out of UNBUILT_PATHNAMES (W20)
grep -n "hash: '#calculator'" src/design/chrome/ctas.ts                     # the CTA_BY_PATHNAME anchor this page answers (W152)
grep -n "'calc'" src/i18n/client-messages.ts                                # CLIENT_SYS lists calc (Cycle 3, W148)
grep -n "STICKY_MARGIN" "src/app/[locale]/(site)/hiring-cost-calculator/_components/LazyBinders.tsx"  # the top-extended sticky margin
ls -a | grep '^\.env'                                                       # only .env.example (Next never loads it)
env | grep -E '^(OPS_|NEXT_PUBLIC_TURNSTILE|NEXT_PUBLIC_GTM|NEXT_PUBLIC_GA4|NEXT_PUBLIC_ADS|NEXT_PUBLIC_SITE_FACE)' || echo 'door-less, GTM-dark, production face'
git status --short                                                          # clean: Cycles 1–6 are committed
```
Expected: exactly as annotated. A door variable or an `.env.local` must leave this shell/worktree before building — the page spec must meet the door-less face (W92); a GTM id would put third-party script into the measured budget (W146); an unset `NEXT_PUBLIC_SITE_FACE` is the production face whose rc the gate asserts locally (W135/W145). If a route fact differs, WP2a/T1/T2 drifted: stop and report; never "fix" the route list from this page task.

- [ ] **Step 2: Build and start (the one build, W126)**

```bash
rm -rf .next .lighthouseci .lighthouseci-extra lighthouse-report .pixel test-results playwright-report
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/calc-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/maliyet-hesaplayici && echo up
```
(An agent shell may start the server with its own background-run facility instead of `&`; keep its PID for Step 4 either way, and wait with `curl --retry`, never a bare `sleep`.)

Expected: the build succeeds — it is the first time the RSC boundaries of `page.tsx` → `_sections/*` → the `'use client'` modules (`SectionToggle`, `CalculatorLoader`, `LazyBinders`, `QuoteButton`, `QuoteSheetHost`, `LiveSgkRate`, `PrintButton`, `Tabs`, `ContactLink`, `FaqBlock`'s `Accordion`, the next-intl `Link`) are compiled — jsdom could not see them; every prop crossing them is serialisable (strings, numbers, plain objects, the `submitCalculatorQuote` server reference, server-rendered nodes as `fallback`/`panel`/children); `actions.ts` exports only an async function; `CalculatorIsland`, `QuotaIsland`, `PassCheckIsland`, `SalaryGuideIsland`, `RecapIsland`, `QuoteSheet` and `StickyCtaBar` are chunks reached only through `import()`. The route table lists `/[locale]/hiring-cost-calculator` as `●` (SSG) for `tr` and `en` with a `1d` revalidate (W150). `up` is printed. A build error is fixed in the source, committed after the low-memory verify line, and the build re-run — that re-run is still "the" build of this session.

- [ ] **Step 3: The gate, js-size, pixel run 1, the launch anchor check**

```bash
E2E_BASE_URL=http://localhost:3000 npm run gate
npm run js-size
npm run pixel -- --page=calc --locale=tr --base=http://localhost:3000 --widths=390,900,1440
npm run pixel -- --page=calc --locale=en --base=http://localhost:3000 --widths=390,900,1440
E2E_BASE_URL=http://localhost:3000 npm run gate:launch > "$TMPDIR/calc-gate-launch.log" 2>&1 || true
grep -n 'missing id="calculator"' "$TMPDIR/calc-gate-launch.log" || echo 'no missing #calculator anchor'
grep -n 'calisma-izni\|work-permit\|adaylar\|available-workers\|calc-hero' "$TMPDIR/calc-gate-launch.log"
```
Expected:
- **Gate** (localhost wears the production face → the production rc values, W135/W145): Playwright green under `mobile` and `desktop` — `e2e/pages/calc.spec.ts` **27 passed + 3 skipped** (the print, sticky-bar and language-switch cases skip on `mobile` by design); `routing` (the page contract on both new routes), `seo` (the sitemap now lists both URLs and each answers 200), `a11y` (zero `wcag2a`/`wcag2aa`/`wcag22aa` violations on `/maliyet-hesaplayici` and `/en/hiring-cost-calculator` under both projects; `region` clean at 390/1000/1440), `width-sweep` (no horizontal overflow at 1440…390 incl. 1101/1100 and 901/900 — the compare table is desktop-only and fits from 701 px; the jump chips scroll inside their own list), `chrome` (the header CTA → `#calculator`), `headers` and `thank-you` all green; the two token cases of `ops.spec.ts` skip without `REVALIDATE_SECRET`. `lhci assert` passes on every indexable gate route; on the two calculator routes (median of 3 DevTools-throttled runs, W145): performance ≥ 0.95, accessibility 1, best-practices 1, SEO 1, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms — the h1, expect ≈ 1.5–2.0 s — and CLS ≤ 0.1 (nothing swaps a box during the audit: the card waits for a touch, every in-view island sits below the first viewport).
- **js-size** (W136 — the ledger's figure): both calculator routes **below the 194,560 B lazy line**. Projection: the WP2a close measured 176,132 B (TR) / 172,783 B (EN) on the spike routes; this page adds ≈ 7 KB gz of eager client code (`LazyIsland` + `useInView`, `CalculatorLoader`, `LazyBinders`, `SectionToggle`, `Tabs`, `LiveSgkRate` + `estimate-store` + `estimate-inputs` + `@/lib/calculator/types`, `QuoteButton` + `QuoteSheetHost` + `quote-store`, `PrintButton`, chunk overhead) → **≈ 183,000 B TR / ≈ 180,000 B EN locally** (the preview reads ≈ +3 KB). Without the Cycle 3–5 split the page projected 195–205 KB (the final review's §2). **Stop-and-report rule:** a calculator route at or above 194,560 B → Cycle 8(b) before T4 starts; a route above 204,800 B has already failed `lhci assert` → the same path; if Cycle 8(b) still leaves a route at or above 194,560 B, STOP and report to the controller that route's script breakdown (every script URL and transfer size from the `network-requests` audit of its `.lighthouseci/lhr-*.json`, with the modules each chunk carries) — no further change without a ruling (W13 amended). The LCP and performance columns are the medians the gate asserted (W145).
- **Pixel run 1** (W138/W159 — like for like, document-scroll-height check; `.pixel/calc-<locale>-<width>{,-design,-built}.png`): three match percentages per locale. There is no numeric pass mark: read the diff PNGs and file every visible delta as (a) a named D20 delta (`blue-safe` text and gradients, the tertiary/secondary greys, `primary`/`success` CTA faces, the foundation `Stepper`/`RadioChips`/`TriState`/`ProgressBar`/`BottomSheet`/`Tabs` faces, the navy sticky bar and its hiding below 901 px), (b) a design delta this task names (deltas 1–10 at the top, plus: the salary guide's industry chips sit under the legend instead of beside the h2; `FaqBlock` keeps its side column above the list on phones; the exemption tabs are pills; the hero photo slot covers its own aspect box, W129), (c) capture noise (the skeleton's lookalike controls vs the design's live card — the figures are the same model values; the fixed bottom bar/FAB; the design's card entrance animation; the placeholder photo), or (d) a defect. The design page captures at its defaults (welder × 1, full year, `other` tier) — the skeleton's defaults — so every card figure must match except the named W2/W142 deltas (₺60,321 vs ₺60,875; ₺751,852 vs ₺758,500; ₺49,545 vs ₺50,000). Any (d) → Cycle 8(a).
- **Launch anchor check** (W152/W158): the launch profile stays RED by design (unbuilt routes, other pages' anchors), but the first grep prints `no missing #calculator anchor` — the anchor half (`CTA_BY_PATHNAME['/hiring-cost-calculator'].primary (/hiring-cost-calculator#calculator): <locale> <path> → missing id="calculator" …`, `scripts/launch/dead-targets.ts`) no longer names this page. The second grep may show only this page's links to T4/T8 pages in the dead-href half (`/calisma-izni`, `/en/work-permit`, `/adaylar`, `/en/available-workers` → 404 — expected until those tasks land; T15 sees them green at Gate A) and the placeholder counter's `calc-hero` as a named placeholder that is not the LCP slot (`h1`, D26).

- [ ] **Step 4: Stop the server, record the numbers**

```bash
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: `no stray processes` (kill any survivor by PID).

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T3 row to the `## Ledger` table (T1's six-column format, W98): the "**Ledger line**" template at the end of this task, every `<…>` filled from Steps 2–3 (`npm run js-size`'s table, `lighthouse-report/`, the `.pixel/` percentages and your delta classification, the launch grep). Then:

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(calc): T3 ledger row — gate, js-size, Lighthouse medians, pixel run 1, launch anchor sweep

Localhost proof session (W126/W145): one build, one gate; both calculator routes under the
194,560 B lazy line after the interaction/in-view split (W13 amended); #calculator present for
CTA_BY_PATHNAME in both locales (W152/W158); LCP is the h1 (D26).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 8 — conditional: pixel run 2 (D27) and/or the lazy pass (W13 amended)

Run this cycle only if Cycle 7 found (d) pixel defects or a calculator route at or above 194,560 B; otherwise the task ends with Cycle 7 ("run 1 of 2" stands in the ledger). It is the task's only second build.

- [ ] **Step 1: Write the failing test**

(a) Pixel defects: where a fix is structural (an element, an order, a class that hides or shows), pin it first with a failing assertion in `_sections/__tests__/sections.test.tsx` (same helpers: `tokens(el)`, the real bundle, `ctxFor`); a pure spacing/size tweak needs no new test.

(b) Lazy pass (only if js-size ≥ 194,560 B on a calculator route) — in `src/app/[locale]/(site)/hiring-cost-calculator/_sections/__tests__/sections.test.tsx`, in the `Quota` case, replace the lines from `const ex = screen.getByTestId('calc-exemptions');` through `expect(within(ex).getByRole('tabpanel')).toHaveTextContent(tr.sys.calc.exemptions.full);` — keep the case's own closing `});`, which now closes the new source-check case — with the static-list contract below; rename the case to "Quota: both Gate 1 fallbacks at 25 staff (calc.558), the exemptions as three stacked groups with the sys badges" and drop its `async` (nothing is awaited any more):

```tsx
    const ex = screen.getByTestId('calc-exemptions');
    // W13 amended lazy pass: three stacked groups, no Tabs client code on the page
    expect(within(ex).queryAllByRole('tab')).toHaveLength(0);
    expect(
      within(ex)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(ids(['calc.430', 'calc.431', 'calc.432']));
    expect(ex).toHaveTextContent(TR.t('calc.549'));
    expect(ex).toHaveTextContent(tr.sys.calc.exemptions.full); // the company group, no click needed
  });

  it('content.tsx no longer imports Tabs (the lazy pass)', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/app/[locale]/(site)/hiring-cost-calculator/_sections/content.tsx'),
      'utf8',
    );
    expect(src).not.toContain("from '@/design/primitives/Tabs'");
```

(the replacement closes the `Quota` case itself and opens the source-check case, which the kept `});` closes).

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hiring-cost-calculator/_sections
```
Expected: the new assertions fail (for (b): three `tab` roles found; `content.tsx` still imports `Tabs`).

- [ ] **Step 3: Implement**

(a) Fix each (d) item in the section that owns it — markup/classes only, never a foundation prop or a caller colour class (W122); every new class string W119/W155-clean; no figure typed (W142).

(b) `src/app/[locale]/(site)/hiring-cost-calculator/_sections/content.tsx` — delete the import line `import { Tabs } from '@/design/primitives/Tabs';`, and in `Exemptions` replace the element

```tsx
        <Tabs
          defaultId="sector"
          tabs={groups.map((g) => ({ id: g.id, label: t(g.tabId), panel: panel(g.introId, g.rows) }))}
        />
```

with

```tsx
        {/* W13 amended lazy pass: the three groups stacked — no Tabs chunk on the page */}
        <div className="flex flex-col gap-6">
          {groups.map((g) => (
            <div key={g.id}>
              <h3 className="m-0 mb-2 text-body font-extrabold text-ink">{t(g.tabId)}</h3>
              {panel(g.introId, g.rows)}
            </div>
          ))}
        </div>
```

and change the `Exemptions` doc comment's "three tabs (`Tabs`, the page's one eager primitive island)" to "three stacked groups (the Cycle 8(b) lazy pass removed `Tabs`)". The exemptions become a longer block; record "(b) exemptions stacked (8b)" as a named delta.

- [ ] **Step 4: Verify, then the re-proof session**

```bash
npx prettier --write "src/app/[locale]/(site)/hiring-cost-calculator"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
git add "src/app/[locale]/(site)/hiring-cost-calculator"
git commit -m "fix(calc): pixel run 1 defects / exemptions without Tabs — <one line each>

<(a): the (d) items fixed; (b): the exemptions render as three stacked groups so no Tabs chunk
ships on the calculator routes (W13 amended)>

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
rm -rf .next .lighthouseci-extra .pixel
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/calc-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/maliyet-hesaplayici && echo up
E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/calc.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts
E2E_BASE_URL=http://localhost:3000 npm run js-size -- --routes=/maliyet-hesaplayici,/en/hiring-cost-calculator
npm run pixel -- --page=calc --locale=tr --base=http://localhost:3000 --widths=390,900,1440
npm run pixel -- --page=calc --locale=en --base=http://localhost:3000 --widths=390,900,1440
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: the three specs green (the scoped re-run of the page contract, axe and the width sweep on the changed markup — the full gate already ran once, W126); both calculator routes below 194,560 B in the W94 spot-check (`.lighthouseci-extra`), ≈ 1 KB lower than Cycle 7 for (b) — if a route is STILL at or above the line, stop and report per Cycle 7's rule (no further change without a ruling); pixel run 2 of 2 is the ledger's number, any remaining (d) item is listed "accepted" with a one-line reason (a third run needs a controller ruling); `no stray processes`.

- [ ] **Step 5: Commit**

Update the T3 row of `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (run 2 of 2, the re-measured js-size, `exemptions: static (8b)` if (b) ran), then:

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(calc): T3 ledger — pixel run 2 of 2<, exemptions without Tabs>

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/CONTENT-MODEL.md` — the Cost Calculator bullet in the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (Cycle 1, W98), then `calc` in the `CLIENT_SYS` list of the paragraph that begins "**Client subset (W90, an allowlist since W148).**" with the measured `sys.calc` payload figure, and the bullet's client sentence (Cycle 3). `docs/ARCHITECTURE.md` — the `CLIENT_SYS` list in § Routing's route-group paragraph (Cycle 3) and one sentence on this page's lazy split in § Quality gate (D27), after "**a route above 194,560 B gets a lazy-loading pass before the next page task starts**." (Cycle 6). `docs/SEO.md` — the Cost Calculator row of T1's `## Pages` table, naming the LCP element (the h1; `calc-hero` is a named placeholder, never the LCP) (Cycle 6). `docs/ANALYTICS.md` — the `calculator_use` row's "Fires on" cell, the "declared but still uncalled" list, and the Cost Calculator bullet under `### Page instrumentation (WP2b)` (Cycle 6; no new event, parameter or enum value — the design's seven page events are not ported, W12). `docs/PRD.md` — §2 row 3's last cell, the §11 "Not yet built" clause (edited in place, W45) and three bullets at the end of `## 12. Calculator rules` (Cycle 6). `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T3 `## Ledger` row (Cycle 7, updated in Cycle 8 if it runs). No `docs/INTEGRATIONS.md` change (the `calculator` key and its v1.0 catalog are unchanged; T14 records the instance map) and no `docs/DEPLOYMENT.md` change.

**Sys keys added:** 47 — 45 under `sys.calc`, 2 under `sys.seo.calc` — an identical key set in `src/messages/tr.json` and `src/messages/en.json`, all added in Cycle 1 and pinned by `_lib/__tests__/copy.test.ts` (one case per key: present in both locales with the same ICU arguments; plus the `calc.557`–`561` legal-sample pins); Cycles 2–8 add none. The design's 23 `GEN` sentence templates are 21 ICU keys: `quotaOne` + `quotaMany` fold into the `quota.allowed` plural and `qvExact` + `qvFull` into `quota.vizFull` (its TR wording is `qvExact`'s, so it reproduces the legal-flagged `calc.558`); `pass.unanswered` is a word, not a template. Values (EN · TR; `\n` is the JSON escape inside `whatsapp.passCheck`):
- `sys.seo.calc.title` — EN "Hiring cost calculator for foreign workers in Türkiye | JobsAdmire" · TR "Yabancı işçi maliyet hesaplayıcı — Türkiye | JobsAdmire"
- `sys.seo.calc.description` — EN "Salary, SGK employer share, permit fees, flights and housing in one estimate. Check the 5:1 quota, run the pass check and ask for a written quote." · TR "Maaş, SGK işveren payı, izin harçları, uçak bileti ve konaklama tek tahminde. 5:1 kotanızı kontrol edin, geçer-mi testini yapın, yazılı teklif isteyin."
- `sys.calc.hero.badge` — EN "{year} rates · Updated {month}" · TR "{year} oranları · {month} güncellemesi"
- `sys.calc.skeleton.activate` — EN "Adjust the estimate" · TR "Tahmini düzenleyin"
- `sys.calc.empty.title` — EN "The calculator is being updated" · TR "Hesaplayıcı güncelleniyor"
- `sys.calc.empty.body` — EN "The current rates are not published yet — ask JobsAdmire for a written quote instead." · TR "Güncel oranlar henüz yayınlanmadı — bunun yerine JobsAdmire'dan yazılı teklif isteyin."
- `sys.calc.jump.label` — EN "Jump to a section" · TR "Bölüme git"
- `sys.calc.a11y.decrease` — EN "Decrease by {step}" · TR "{step} azalt"
- `sys.calc.a11y.increase` — EN "Increase by {step}" · TR "{step} artır"
- `sys.calc.a11y.headcountPresets` — EN "Quick pick" · TR "Hızlı seçim"
- `sys.calc.a11y.industries` — EN "Filter by industry" · TR "Sektöre göre filtrele"
- `sys.calc.card.forWorkers` — EN "for {n} workers" · TR "{n} işçi için"
- `sys.calc.card.nMonths` — EN "{months} months" · TR "{months} ay"
- `sys.calc.card.seasonTotal` — EN "{months}-month season total" · TR "{months} aylık sezon toplamı"
- `sys.calc.card.threshold` — EN "Legal minimum for this job: {amount} gross ({multiplier}× the minimum wage)." · TR "Bu iş için yasal asgari: {amount} brüt (asgari ücretin {multiplier} katı)."
- `sys.calc.card.yearNote` — EN "{months} months of payroll + one-off costs{headcount, plural, =1 {} other { for # workers}}" · TR "{months} aylık bordro + tek seferlik maliyetler{headcount, plural, =1 {} other { (# işçi için)}}"
- `sys.calc.quota.allowed` — EN "{n, plural, one {# foreign worker} other {# foreign workers}}" · TR "{n} yabancı işçi"
- `sys.calc.quota.msgNo` — EN "With {staff, plural, one {# Turkish employee} other {# Turkish employees}} you do not reach the {ratio}:1 rule yet. You need {need} more, or one of the exemptions below." · TR "{staff} Türk çalışanla {ratio}:1 kuralına henüz ulaşmıyorsunuz. {need} kişi daha gerekiyor veya aşağıdaki muafiyetlerden biri."
- `sys.calc.quota.msgMore` — EN "Counted as {ratio} Turkish employees for each foreign worker. {m, plural, one {# more Turkish employee} other {# more Turkish employees}} would give you one more place." · TR "Her yabancı işçi için {ratio} Türk çalışan sayılır. {m} Türk çalışan daha bir kontenjan açar."
- `sys.calc.quota.vsOver` — EN "That is {over} more than the rule allows. You would need {need} more Turkish employees, or an exemption. Send your numbers to JobsAdmire to find out which one fits you." · TR "Bu, kuralın izin verdiğinden {over} kişi fazla. {need} Türk çalışan daha veya bir muafiyet gerekir. Size hangisinin uyduğunu öğrenmek için rakamlarınızı JobsAdmire'a gönderin."
- `sys.calc.quota.vizNone` — EN "Not one complete block yet — {n} more Turkish employees unlock the first place." · TR "Henüz tam bir grup yok — {n} Türk çalışan daha ilk kontenjanı açar."
- `sys.calc.quota.vizFull` — EN "{staff} employees make exactly {blocks, plural, one {# complete block} other {# complete blocks}} — no spare capacity, {ratio} more unlock the next place." · TR "{staff} çalışan için {blocks} tam kontenjan bulunmaktadır. Her {ratio} çalışan, bir kontenjanı doldurur; sonraki {ratio} çalışan için yeni bir kontenjan açılır."
- `sys.calc.quota.vizPart` — EN "{blocks, plural, one {# complete block} other {# complete blocks}} plus {spare, plural, one {# spare employee} other {# spare employees}} — {need} more unlock one further place." · TR "{blocks} tam grup artı {spare} artık çalışan — {need} kişi daha bir kontenjan daha açar."
- `sys.calc.quota.vizCap` — EN "{blocks} complete blocks (first {cap} shown) plus {spare} spare.{spare, plural, =0 {} other { {need} more unlock one further place.}}" · TR "{blocks} tam grup (ilk {cap} gösteriliyor) artı {spare} artık.{spare, plural, =0 {} other { {need} kişi daha bir kontenjan daha açar.}}"
- `sys.calc.pass.count` — EN "{clear} of {total} checks clear{unanswered, plural, =0 {} other { · # unanswered}}" · TR "{total} kontrolden {clear} tamam{unanswered, plural, =0 {} other { · # yanıtlanmadı}}"
- `sys.calc.pass.quotaOk` — EN "Answered from your quota check above: {staff} Turkish employees allow {allowed}, and you planned {headcount}." · TR "Kota kontrolüne göre, {staff} Türk çalışan için {allowed} yabancı çalışan kontenjanı bulunmaktadır. Planlanan: {headcount} yabancı çalışan."
- `sys.calc.pass.quotaNo` — EN "Answered from your quota check above: {headcount} foreign workers need {need} Turkish employees on SGK, and you entered {staff}." · TR "Yukarıdaki kota kontrolünden dolduruldu: {headcount} yabancı işçi için SGK'lı {need} Türk çalışan gerekir, siz {staff} girdiniz."
- `sys.calc.pass.quotaFix` — EN "You are short on the ratio — {need} Turkish employees are needed for {headcount}. Either reduce the headcount, or check whether your sector is exempt." · TR "Oranda eksiksiniz — {headcount} işçi için {need} Türk çalışan gerekiyor. Ya sayıyı azaltın ya da sektörünüzün muaf olup olmadığını kontrol edin."
- `sys.calc.pass.salary` — EN "{role}: {amount} gross per month ({multiplier}× the minimum wage). Declaring less is a refusal, not a negotiation — and paying part of it in cash is a separate offence." · TR "{role} için bu, aylık brüt {amount} demektir (asgari ücretin {multiplier} katı). Daha düşük beyan pazarlık değil rettir — bir kısmını elden ödemek ise ayrı bir suçtur."
- `sys.calc.pass.salaryFix` — EN "Raise the declared salary to at least {amount} gross for this role, or pick a role class that matches the pay." · TR "Bu meslek için beyan edilen maaşı en az brüt {amount} seviyesine çıkarın ya da ödemeye uyan bir meslek sınıfı seçin."
- `sys.calc.pass.amberN` — EN "{n} things to confirm first" · TR "Önce teyit edilmesi gereken {n} şey var"
- `sys.calc.pass.redN` — EN "{n} blockers — fix them before filing" · TR "{n} engel — başvurmadan önce düzeltin"
- `sys.calc.pass.unanswered` — EN "unanswered" · TR "yanıtlanmadı"
- `sys.calc.exemptions.tenStaff` — EN "10+ Turkish staff" · TR "10+ Türk çalışan"
- `sys.calc.exemptions.twentyStaff` — EN "20+ Turkish staff" · TR "20+ Türk çalışan"
- `sys.calc.exemptions.upTo5` — EN "Up to 5 workers" · TR "5 işçiye kadar"
- `sys.calc.exemptions.full` — EN "Full exemption" · TR "Tam muafiyet"
- `sys.calc.exemptions.timing` — EN "Timing exemption" · TR "Zamanlama muafiyeti"
- `sys.calc.exemptions.upTo3` — EN "Up to 3 workers" · TR "3 işçiye kadar"
- `sys.calc.exemptions.exceptional` — EN "Exceptional permit" · TR "İstisnai izin"
- `sys.calc.whatsapp.generic` — EN "Hello JobsAdmire, I used the hiring cost calculator on your website. Please send me a written quote." · TR "Merhaba JobsAdmire, web sitenizdeki maliyet hesaplayıcıyı kullandım. Yazılı teklif rica ederim."
- `sys.calc.whatsapp.estimate` — EN "Hello JobsAdmire, I used the cost calculator: {headcount} × {role} at {salary} gross, {months}-month contract. Please send a written quote." · TR "Merhaba JobsAdmire, maliyet hesaplayıcıyı kullandım: {headcount} × {role}, brüt {salary}, {months} aylık sözleşme. Yazılı teklif rica ederim."
- `sys.calc.whatsapp.passCheck` — EN "Hello JobsAdmire, I ran the pass check on your cost calculator page.\n\nRole: {role} · {headcount, plural, one {# worker} other {# workers}}\nTurkish employees at the workplace: {staff}\n\n{summary}\n\nCan you review this with me?" · TR "Merhaba JobsAdmire, maliyet hesaplayıcı sayfanızdaki geçer-mi testini yaptım.\n\nMeslek: {role} · {headcount} işçi\nİşyerindeki Türk çalışan sayısı: {staff}\n\n{summary}\n\nBunu benimle birlikte değerlendirebilir misiniz?"
- `sys.calc.quote.loading` — EN "Opening the quote form…" · TR "Teklif formu açılıyor…"
- `sys.calc.quote.attached` — EN "The estimate above is sent with your request." · TR "Yukarıdaki tahmin talebinizle birlikte gönderilir."
- `sys.calc.summary.none` — EN "none" · TR "yok"
- `sys.calc.summary.rates` — EN "Rates version" · TR "Oran sürümü"

Consumed, not added: `sys.form.*` (labels `name`/`email`/`phone`/`company`/`country`/`message`, `placeholders.select`, `hints.optional`, `consent.label`, `fallback.*`, `submit.sending`, `errors.*`), `sys.nav.close` (resolved on the server, passed as a prop), `sys.nav.breadcrumbs` (`Breadcrumbs`), `sys.seo.ogTagline` (the OG route's subline).

**Package ids used:** 519 — 516 of the page's 561 `calc.*` ids plus `hire.093`, `hire.107`, `hire.112` (the `cnc`/`waiter`/`greenhouse` role labels, read through `calculatorRoles.labelId`), every one present in `src/content/local/catalogue.json` (verified: 519/519) — first `calc.001`, last `calc.555`. Read as exact ids through `makeTf` (W1) in `_sections/*` and the `_lib/ids.ts` maps; `calc.480`–`509` through the FAQ loop; `calc.541`–`548`, `calc.555` and the industries `calc.551`–`554` through the role rows' `labelId`/`industryLabelId`. The four deliberately empty Turkish ids `calc.041`, `calc.154`, `calc.157`, `calc.367` are rendered and come out empty — the `Sentence`/`joinText` joiner drops an empty fragment, never falls back to English. Not rendered by page code (45): `calc.003` (the dated badge — superseded by `sys.calc.hero.badge` filled from `rateConfig`, D17; its EN text is the test pin); `calc.324` (the header CTA "Open the calculator" — rendered by the chrome from `CTA_BY_PATHNAME`, W17); the chrome copy the layout reads through its canonical ids (R15): `calc.107`, `calc.108`, `calc.311`–`323`, `calc.325`, `calc.390`–`398`, `calc.400`–`404`, `calc.412`, `calc.414`, `calc.419`; `calc.410` (the doubled agent fine — already inside `calc.117`); `calc.415`–`417` (the typed percentages — rendered from `rateConfig.sgkRates`, D17); `calc.556` (the lower-case "welder" duplicate); `calc.557`–`561` (the design's rendered samples — the `sys.calc.*` templates reproduce them word for word at the model figures, pinned by tests; the legal-flagged `calc.557`–`559` go to the WP-C sheet beside their `COPY_DELTAS` model figures).

**CLIENT_SYS additions:** `calc` (Cycle 3) — `src/i18n/client-messages.ts` at HEAD reads `export const CLIENT_SYS = ['consent', 'languageHint', 'errorTitle', 'errorRetry', 'form'] as const;` and becomes `[…, 'form', 'calc']`. Read on the client by `QuoteSheet` (`calc.quote.attached`), `CalculatorIsland` (`calc.a11y.*` + the card factory), `QuotaIsland` (`calc.a11y.*` + the quota factory), `SalaryGuideIsland` (`calc.a11y.industries`), `PassCheckIsland` and `RecapIsland` (the factories, which receive the translator itself so the W148 scan reads their literal keys). `client-messages.test.ts` needs no edit: its two-way pin reads `CLIENT_SYS` and scans the modules (every read prefix listed, every listed namespace read, both catalogues carry `sys.calc`). `nav` stays out (`sys.nav.close` is resolved on the server and passed as a prop); `seo` stays server-only (W90).

**Foundation gaps:** none blocking — every name this task consumes exists at HEAD (`7bacd7e` … `5562634`) and was checked in the code, not only in `A/produces-final.md`. Notes: (a) the `calculator` key sends only its v1.0 catalog fields (`name`, `email`, `phone`, `company`, `country`, `headcount`, `trade`, `durationMonths`, `estimateSummary`, `message`); none of the four v1.1 fields (`city`, `partner.track`, `contact.topic`, `careers.portfolioUrl` — as `A/produces-final.md` § Task 8 spells them, wire names confirmed by the Task 8 as-built report, Operations `main` 47a2160) applies to this key. (b) `LazyIsland` is viewport-only; the card's interaction trigger is page-local (`CalculatorLoader` decides when `LazyIsland` mounts — W85/W132), and a server page cannot pass `load`, hence one small `'use client'` binder module (T2's pattern). (c) Accepted page-local faces, named deltas rather than foundation changes: `FaqBlock` keeps its side column above the list on phones; `StickyCtaBar` hides below 901 px (the design below 701 px); `ImageSlot` covers its own aspect box, not a full-bleed hero (W129); `Tabs` renders pills; `PrintButton` isolates on its own click only (a browser Ctrl+P prints the whole page — the foundation's opt-in design).

**Ledger line** (T1's six-column row format, W98 — fill from Cycle 7/8; `\|` is a literal pipe inside a cell):

```markdown
| T3 Cost Calculator | `/maliyet-hesaplayici` · `/en/hiring-cost-calculator` | js-size (W136, localhost): `/maliyet-hesaplayici` <n> B · `/en/hiring-cost-calculator` <n> B — ceiling 204,800 · lazy line 194,560 · projected ≈ 183,000 / 180,000 · exemptions: <Tabs \| static (8b)>; binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production, W145): TR perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n>; EN perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n> | pixel calc tr: 390 → <a> %, 900 → <b> %, 1440 → <c> %; pixel calc en: 390 → <a> %, 900 → <b> %, 1440 → <c> %; run <1\|2> of 2; deltas: (a) D20 faces (blue-safe text and gradients, tertiary/secondary greys, primary/success CTA faces, foundation Stepper/RadioChips/TriState/ProgressBar/BottomSheet/Tabs faces, navy sticky bar hidden below 901 px); (b) deltas 1–10 + the guide's chips under the legend, FaqBlock's side column on phones, pill tabs<, or stacked exemptions (8b)>, the hero slot's aspect box; (c) skeleton vs the live card (same figures), bottom bar/FAB, the card entrance animation, the placeholder photo; (d) accepted: <… or none>; launch sweep: #calculator present tr+en (W152/W158), dead hrefs /calisma-izni and /adaylar (+ EN) until T4/T8; WP-C: calc.557–559 reproduced at the model figures, COPY_DELTAS deltas (49,545 / 60,321 / 751,852 / 33,030) | <YYYY-MM-DD> |
```
