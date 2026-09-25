### Task 3: Cost Calculator (`/maliyet-hesaplayici` · `/en/hiring-cost-calculator`) — pixel-harness page

**Where this task runs.** Worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2`, branch `wp2/foundation` — every path below is relative to it; never the shared `jobsadmire-website` checkout. Execution order (W99): T1 → T13 → T2 → **T3** → T4 … — so the homepage (T1), the legal pages incl. `/privacy` (T13) and Hire Workers (T2) are already in the tree, and WP2a Tasks 1–9 with their additions (`task-3/5/6/7-additions.md`: W78, W80–W88, W90, W91, W93, W94) have landed. One build/test job at a time on this machine (`vitest --maxWorkers=2` if a run is slow).

**Why this page is shaped the way it is.** The design (`design-package/design/Hiring Cost Calculator.dc.html`, 2,807 lines, strings `calc.001`–`calc.561`) is a client-side calculator with no `<form>`: every conversion is a WhatsApp/tel/mailto link, the rates are literals in the page script, and 23 sentence templates with live numbers exist only in its `GEN` dictionary. This task ports it onto WP1 + WP2a under these rulings:

- **W2 / W24** — one engine (`@/lib/calculator`, WP2a Task 9); the exact legal floor (the slider minimum for a 1.5× role is **49 545**, never the design's rounded 50 000); minimum-wage support is opt-in, default OFF.
- **W3 / W77 / W79** — the four "written quote" CTAs become ONE real form → door `calculator` with `name*`/`email*`/`phone`/`company`/`country`/`message`, the estimate recomputed **on the server** from hidden inputs and serialised into `estimateSummary` (≤ 2000), `headcount`/`durationMonths` as integers, and `trade` = the stable **role key** (`welder`), never a localized label (W77; the label rides inside `estimateSummary`). Consent is the `checkbox` on this form (W79); `consentLinkHref` is omitted so the site-wide default `/privacy` applies. The calculator catalog has no `startWhen` field, so W78's `START_WHEN_KEYS` does not apply here. The pass check's `calc.378` "your answers are not sent" stays literally true — the check never posts; its "send my result" is a WhatsApp chat the visitor opens.
- **W9 / W23** — never a new package id; every composed sentence lives under `sys.calc.*` (ICU plurals); the SEO pair under `sys.seo.calc.*` (the package has none: `bundle.pages.calc.titleId === ''`, W38).
- **W12 / W81** — the only page event is `calculator_use` (`role` = the role KEY, `headcount` = the integer); every contact anchor fires `whatsapp_click` / `call_click` / `email_click` with `placement: 'page_cta'` (through `ContactCta`, `StickyCtaBar` — which routes `tel:`/`wa.me`/`mailto:` CTAs through `ContactLink` itself since W81 — or this page's click-time `WhatsAppPrefill`). The design's `calc_print`, `calc_months`, `calc_sgk_tier`, `quota_check`, `quota_exemption_tab`, `passcheck_answer` events are not in the allow-list and are dropped.
- **W76 / W95** — no visitor-chosen data in any DOM href: the card's "WhatsApp quote" (the live estimate) and the pass check's "Send my result" (the answers) render a bare `https://wa.me/<number>` anchor and compose the prefilled URL at click time (`WhatsAppPrefill`, opened with `noopener`). Only the static, generic prefill (`sys.calc.whatsapp.quoteGeneric`) sits in an href (sticky bar, FAQ ask card).
- **W13 amended / W85** — the calculator, the salary guide, the quota gate, the pass check and the phone recap are islands loaded after first paint through the foundation's `LazyIsland` (`@/design/islands/LazyIsland`); no page-local lazy helper. The card sits above the fold, so a viewport trigger would fetch it during the Lighthouse load: `CalculatorLoader` mounts the foundation `LazyIsland` only after the first interaction with the card or when the page is at `#calculator` (W17's header CTA). The page's eager client graph is the form kernel, the sticky bar and small client boundaries (`CalculatorLoader`, the four `LazyIsland` wrappers, `CollapsibleSection`, `EstimateFields`, `LiveSgkRate`, `WhatsAppPrefill` is lazy-only).
- **W10** — phone-only variants render with `md:hidden`, desktop with `hidden md:block`; both are in the DOM.
- **D17** — the hero badge and the "last updated" pill render from `rateConfig`; the badge hides from `reviewDueAt`; `calc.415–417`'s SGK percentages render from `rateConfig.sgkRates`; the design's `₺12.700` literal is `10 × rateConfig.supportMonthly` through `formatTRY`.
- **D18** — every lira figure goes through `formatTRY` at the edge (`@/lib/calculator` `labels.ts`, `@/lib/format/money`).
- **D26 / W55** — LCP = the h1; the `calc-hero` slot is a named placeholder under the 90–97 % navy gradient, never priority, never the LCP.
- **W59** — the salary-guide employer cost follows the chosen SGK tier.
- **W1** — `calc.050/101/104/381/481` carry `{homepageReplyHours}`: the page resolves every package id through `makeTf`, never `makeT`.
- **W17** — `CTA_BY_PATHNAME['/hiring-cost-calculator']` → `#calculator`: the card carries that id.
- **W18** — `StickyCtaBar` with `hideNearId="calc-cta"`.
- **W20 / W21** — delete the route from `UNBUILT_PATHNAMES`; append both paths to `GATE_ROUTE_TABLE`.
- **W82 / W83** — object hrefs on blocks (`EmptyState` → `{ pathname: '/hiring-cost-calculator', hash: '#quote' }`); the FAQ ask card carries its own e-mail row (`email`/`emailLabelId`/`subject`), so no `footer` workaround.
- **W92 / W91** — local builds and every preview except the `staging` branch are door-less, so the form e2e is deterministic (`unauthorized` fallback panel); previews are reachable by the gate through the WP2a Task 7 bypass header.
- **W98 / W45** — the docs edits append to the shared shapes (SEO `## Pages` table, ANALYTICS `### Page instrumentation (WP2b)`, CONTENT-MODEL `### Adding copy` list, the ledger in T1's row format), anchored on headings and sentences, never line numbers.
- **W109** — the breadcrumbs use this page's own package labels (`calc.001` "Home", `calc.002` "Hiring Cost Calculator").
- **W113** — test ids sit on page-owned wrappers (`<div data-testid=…>`, `<nav>`, `<p>`), never on `Section`.
- **W115** — the package ships no field labels for this form (the design has no form), so `Field` renders the `sys.form.labels.*` fallbacks; e2e selectors use input names.

**Named design deltas (logged for the D27 two-iteration harness):**

1. The quote form (W3) replaces the four WhatsApp "written quote" links; `calc.036`/`calc.011` and the empty state scroll to `#quote`; the sticky bar's `calc.052` and the FAQ ask card keep a static, generic WhatsApp prefill.
2. The card's "WhatsApp quote" and the pass check's "Send my result" open a WhatsApp chat whose prefill is composed at click time; their hrefs are the bare chat (W95).
3. The ≤ 700 px per-section accordion is kept, but each section's own `h2` + subtitle stay in the accessibility tree (`max-md:sr-only`) instead of `display:none`.
4. The hero badge text is `sys.calc.hero.badge` filled from `rateConfig` (D17); `calc.003` is not rendered.
5. The salary-guide employer cost follows the chosen tier (W59).
6. The slider/pass-check minimum is 49 545; the design's 50 000 is not ported (W2).
7. The mobile role picker is the foundation's `BottomSheet` (a real dialog, D20).
8. The closing band's primary is the form's submit (`calc.105`), not a `wa.me` link.
9. The calculator card first renders a server skeleton at the defaults (one "Adjust the estimate" button) and becomes interactive on the first touch (W13 amended).

**Files:**

Create:
- `src/app/[locale]/(site)/hiring-cost-calculator/page.tsx`
- `src/app/[locale]/(site)/hiring-cost-calculator/actions.ts` (`'use server'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/types.ts` (pure: `Tf`, `SysT`)
- `src/app/[locale]/(site)/hiring-cost-calculator/calc-labels.ts` (pure: package-id maps per island, `pickLabels`, `CALC_SYS_KEYS`, `multiplierNumber`)
- `src/app/[locale]/(site)/hiring-cost-calculator/estimate-inputs.ts` (pure, zod-free: hidden-field names, bounds, defaults, `sanitizeInputs`/`parseEstimateFields`)
- `src/app/[locale]/(site)/hiring-cost-calculator/quote.ts` (pure, server-side use: Zod schema, `buildEstimateSummary`, `toCalculatorFields`)
- `src/app/[locale]/(site)/hiring-cost-calculator/pass-check-logic.ts` (pure)
- `src/app/[locale]/(site)/hiring-cost-calculator/salary-guide-rows.ts` (pure)
- `src/app/[locale]/(site)/hiring-cost-calculator/card-view.ts` (pure: the card's view model + `roleLabelMaps`, shared by server and islands)
- `src/app/[locale]/(site)/hiring-cost-calculator/_sections/ctx.ts` (`server-only`: `CalcCtx`, `loadCalcCtx`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_sections/Hero.tsx` (server)
- `src/app/[locale]/(site)/hiring-cost-calculator/_sections/CalculatorCard.tsx` (server)
- `src/app/[locale]/(site)/hiring-cost-calculator/_sections/StaticSections.tsx` (server: `H2Block`, `B`, JumpChips, Basis, Compare, QuotaGate2 + exemptions, Incentives, Penalties, Students)
- `src/app/[locale]/(site)/hiring-cost-calculator/_sections/ContentSections.tsx` (server: every content section + FAQ)
- `src/app/[locale]/(site)/hiring-cost-calculator/_sections/QuoteBand.tsx` (server: sticky bar + closing band + the form)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/estimate-store.ts` (no directive; imported by client components only)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/WhatsAppPrefill.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateBreakdown.tsx` (presentational, no hooks)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorSkeleton.tsx` (presentational)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorLoader.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorIsland.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/CollapsibleSection.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/LiveSgkRate.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/SalaryGuideCards.tsx` (presentational)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/SalaryGuide.tsx` (`'use client'`, `LazyIsland` wrapper) + `SalaryGuideIsland.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/QuotaGate.tsx` (`'use client'`, wrapper) + `QuotaGateIsland.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/PassCheck.tsx` (`'use client'`, wrapper) + `PassCheckIsland.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateFields.tsx` (`'use client'`, hidden inputs inside the FormShell)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateRecapCard.tsx` (presentational) + `EstimateRecap.tsx` (`'use client'`, wrapper) + `EstimateRecapIsland.tsx` (`'use client'`)
- `e2e/pages/calculator.spec.ts`

Modify:
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.calc.{title,description}` inside the existing `sys.seo` object (WP2a Task 4 created it with `ogTagline`), and a new `sys.calc` object as a member of `sys` immediately after the `"form": { … }` member (both files; `src/messages/messages.test.ts` asserts identical key sets).
- `src/lib/seo/routes.ts` — inside the `UNBUILT_PATHNAMES` set literal, delete the line `'/hiring-cost-calculator',`.
- `e2e/routes.ts` — append two rows at the end of the `GATE_ROUTE_TABLE` literal (after the last row T1/T13/T2 left).
- `docs/SEO.md` (a row at the end of the `## Pages` table, W98), `docs/ANALYTICS.md` (the `calculator_use` row of the § Event schema table + a bullet under `### Page instrumentation (WP2b)`), `docs/CONTENT-MODEL.md` (a bullet at the end of the per-page list under `### Adding copy (W9, W23, W54)`), `docs/PRD.md` (the "Forms carried" cell of the page-table row that starts `| 3   | Hiring Cost Calculator`).
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T3 ledger row.

Test:
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/quote.test.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/pass-check-logic.test.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/salary-guide-rows.test.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/estimate-store.test.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/WhatsAppPrefill.test.tsx`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/CalculatorIsland.test.tsx`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/CalculatorLoader.test.tsx`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/QuotaGateIsland.test.tsx`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/PassCheckIsland.test.tsx`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/EstimateFields.test.tsx`
- `e2e/pages/calculator.spec.ts` (+ the existing `e2e/routing.spec.ts` page-contract loop, `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` now sweep the two new routes)
- `npm run verify`; `E2E_BASE_URL=http://localhost:3100 npm run gate` against `next build && next start -p 3100`, then the binding preview gate; `npm run js-size`; `npm run pixel -- --page=calc --locale=tr` (+ `--locale=en`)

**Interfaces:**

Consumes (WP1 as built, verified in the tree): `getBundle`, `makeTf` (`@/content/adapter` re-exports `./pure`), `makeTf` (`@/content/pure`, client-safe — tests), `routing`/`Locale` (`@/i18n/routing`), `Link` (`@/i18n/navigation`), `buildMetadata` (`@/lib/seo/metadata`), `formatTRY`/`formatInt` (`@/lib/format/money`), `waLink`/`telLink`/`mailLink` (`@/lib/contact`), `track` + `ALLOWED_PARAMS.calculator_use = ['page','locale','role','headcount']` (`@/analytics/track`), primitives `Button`/`Card`/`Section`/`Tabs` (`@/design/primitives`), `renderWithIntl(ui, { locale })` (`@/test/render`), `BundleSchema` (`contract/website-bundle.v1`, read in tests via `readFileSync` like `lint.test.ts`).

Consumes (WP2a, as produces-final.md + the real code at HEAD spell them):
- Task 1: `getCollection(bundle, 'calculatorRoles' | 'countries')`, `getRateConfig(bundle)`, `CalculatorRole`, `RateConfig` (`@/content/collections`); bundle facts relied on: 12 design roles + 3 presets (`welder` → `calc.555`, `cook` → `calc.548` with `salaryMin` 50 000, `labourer` 33 030–44 000, highest design max 78 000), `rateConfig` `{ version '2026-01', legalMinGross 33030, sgkRates {0.1875, 0.2175, 0.2375}, supportMonthly 1270, permitFeeTRY 16000, flightTRY 12000, quotaRatio 5 }`; `settings.{whatsappNumber, phone, phoneDisplay, email, turnstileSiteKey}`.
- Task 2 (real code at HEAD + the fix-round addendum): `createFormAction({ key, schema, toFields: (parsed, data, ctx: { visitor, locale }) => …, consent })`, `FormActionState` (`@/forms/action`); `FormShell({ action, formKey, locale, turnstileSiteKey, whatsappNumber, contact, submitLabel, consent, id, testId, className, headingLevel })` — `consentLinkHref` omitted (default `/privacy`, W79); `Field({ name, label?, required, as, type, options, autoComplete, inputMode, rows })` (`@/forms/client/Field`) — label from `sys.form.labels.<name>`, the select branch prepends `sys.form.placeholders.select` and ignores `placeholder` (W111); an error on an unregistered name (a hidden `est_*` input) lands in the form-level alert; the door-less fallback is `FallbackPanel` `data-testid="form-fallback"` `data-kind="unauthorized"`.
- Task 3: `useContactClick(placement)` → `(kind) => void` and `contactKindOf` (`@/analytics/useContactClick`); `buttonClassName(variant, size?, className?)` (`@/design/primitives`); `CTA_BY_PATHNAME['/hiring-cost-calculator']` → `{ pathname: '/hiring-cost-calculator', hash: '#calculator' }` (this page renders `id="calculator"`); `PARAM_ENUMS.placement` includes `page_cta`; W90's picked client messages still carry every `sys.calc.*` key the islands read (`sys.seo.*` is server-only and read only in `generateMetadata`); `sys.nav.close` (BottomSheet close label).
- Task 4: `UNBUILT_PATHNAMES` (`@/lib/seo/routes`); `OG_PAGE_KEYS` has `calc`; `buildMetadata({ locale, href: '/hiring-cost-calculator', bundle, pageKey: 'calc', fallbackTitle, fallbackDescription })` with the `''` → fallback rule; `sys.seo` object (with `ogTagline`).
- Task 5 (+ W81–W83): `Breadcrumbs({ locale, items, tone, className })`, `FaqBlock({ bundle, locale, items, id, eyebrowId, headingId, bodyId, askCard: { titleId, bodyId, whatsappNumber, whatsappText, whatsappLabelId, email, emailLabelId, subject } })`, `ContactCta({ placement: 'page_cta', href, variant, size })`, `ImageSlot({ slot, alt, width, height, className })`, `EmptyState({ title, body, cta: { label, href: string | Href-object }, testId })` (`@/design/blocks`); `StickyCtaBar({ message, ctas: StickyCta[], hideNearId, live })` (`@/design/chrome/StickyCtaBar`, contact CTAs tracked through `ContactLink` `page_cta`, wrapper `data-testid="sticky-cta"`); `Section` tones `light|dark|pale|band`; `RadioChips({ name, options, value, onChange, legend, legendHidden, className })`; `ButtonVariant` incl. `inverse`.
- Task 6 (+ W85): `RangeSlider`, `Stepper`, `TriState`/`TriStateValue`, `ProgressBar`, `BottomSheet`, `PrintButton` (`@/design/islands`); `LazyIsland({ load, props, fallback, rootMargin? })` (`@/design/islands/LazyIsland` — imported by path so the eager wrappers never pull the islands barrel); CSS `body.print-isolating` + `.print-isolate` / `.print-hidden`.
- Task 7 (+ W91, W94): `GATE_ROUTE_TABLE` (`e2e/routes.ts`); the page markup contract (`data-testid="page-h1"`, `data-lcp-slot`, `data-placeholder`); `npm run gate` (preview runs send `x-vercel-protection-bypass`, previews use `lighthouserc.preview.json`); `npm run js-size`; `npm run pixel -- --page=calc`; `scripts/placeholder-count.ts`.
- Task 8 — the Ops catalog `calculator` entry as it stands in `apps/backend/src/modules/website/website-form-catalog.ts` (v1.0; no v1.1 field applies to this key): `name` ≤ 120 REQUIRED, `email` ≤ 254 REQUIRED (`email` type), `phone` ≤ 40 (≥ 8 digits when present), `company` ≤ 200, `country` iso2, `headcount` ≤ 10, `trade` ≤ 200, `durationMonths` ≤ 10, `estimateSummary` ≤ 2000, `message` ≤ 5000. Empty values are skipped; unknown keys are dropped — this task sends exactly these ten names.
- Task 9 (`@/lib/calculator`): `estimate(input, rateConfig)`, `salaryRange(role, rateConfig)`, `employerMonthlyCost(gross, rateConfig, tier)`, `findRole(roles, key)`, `formatEstimate(estimate, locale)`, `quotaCheck(staff, requested, ratio)` → `{ allowed, maxForeign, shortfall, overBy }`, `turkishStaffRequired`, `quotaBlocks(staff, ratio, cap?)` → `{ full, remainder, shown, capped, nextUnlockIn }`, `QUOTA_VIZ_CAP`, `effectiveFromLabel`, `updatedAtLabel`, `effectiveYear`, `isReviewDue`, `sgkRateLabel`, `LIMITS`, `SGK_TIERS`, `SgkTier`, `FormattedEstimate`; test fixtures `RATE`, `ROLES` (`@/lib/calculator/__tests__/fixtures`, frozen in produces-final § Task 9 — test fixtures).

Produces: nothing another task consumes. `sys.calc.*` is page-local. `WhatsAppPrefill` (a bare `wa.me` anchor that composes the prefill at click time and fires `whatsapp_click` `page_cta`) is page-local here; T1/T4/T10 need the same behaviour under W95 and may copy it (see **Foundation gaps**).

---

#### Cycle 1 — Route skeleton: hero, breadcrumbs, dated badge, metadata, route gating (W20/W21)

- [ ] **Step 1: Write the failing test**

`e2e/routes.ts` — at the end of the `GATE_ROUTE_TABLE` literal (after the last row T1/T13/T2 left), add:

```ts
  { path: '/maliyet-hesaplayici', indexable: true },
  { path: '/en/hiring-cost-calculator', indexable: true },
```

`src/lib/seo/routes.ts` — inside the `UNBUILT_PATHNAMES` set literal, delete the line `'/hiring-cost-calculator',`.

- [ ] **Step 2: Run to verify it fails**

`npx vitest run src/lib/seo/unbuilt.test.ts` → fails: the set no longer lists `/hiring-cost-calculator` but no `page.tsx` exists under `(site)/hiring-cost-calculator` (the test walks `src/app/[locale]/**/page.tsx` with route groups stripped and fails in either direction). `npm run build && npx next start -p 3100`, then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts -g "page contract"` → the `/maliyet-hesaplayici` case fails with `expect(locator).toHaveCount(1) … locator('h1[data-testid="page-h1"]') … Received: 0` (the `[...rest]` 404).

- [ ] **Step 3: Implement**

`src/messages/en.json` — inside the existing `"seo": { "ogTagline": … }` object add:

```json
    "calc": {
      "title": "Hiring cost calculator — what a foreign worker really costs in Türkiye | JobsAdmire",
      "description": "Salary, SGK employer share, permit fees, flights and accommodation calculated in one place with the current rates. Check your 5:1 quota, run the pass check and ask for a written quote."
    }
```

and, as a new member of `sys` immediately after the `"form": { … }` member (a comma after its closing brace):

```json
    "calc": {
      "hero": { "badge": "{year} rates · Updated {month}" }
    }
```

`src/messages/tr.json` — the same two places:

```json
    "calc": {
      "title": "İşçi maliyet hesaplayıcı — yabancı bir işçi Türkiye'de gerçekte ne kadara mal olur? | JobsAdmire",
      "description": "Maaş, SGK işveren payı, izin harçları, uçak bileti ve konaklama — güncel oranlarla tek yerde hesaplayın. 5:1 kotanızı kontrol edin, geçer-mi testini yapın ve yazılı teklif isteyin."
    }
```

```json
    "calc": {
      "hero": { "badge": "{year} oranları · {month}'da güncellendi" }
    }
```

`src/app/[locale]/(site)/hiring-cost-calculator/types.ts`:

```ts
/** The two translators every server section and pure helper takes. `Tf` is the page's
 *  `makeTf(bundle, locale)` — package ids with the metric placeholders filled (W1); `SysT` is
 *  next-intl's `sys` namespace (`getTranslations` on the server, `useTranslations` in islands). */
export type Tf = (id: string) => string;
export type SysT = (key: string, values?: Record<string, string | number>) => string;
```

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/ctx.ts`:

```ts
import 'server-only';
import { getTranslations } from 'next-intl/server';
import { getBundle, makeTf } from '@/content/adapter';
import {
  getCollection,
  getRateConfig,
  type CalculatorRole,
  type RateConfig,
} from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import type { SysT, Tf } from '../types';

export type CalcBundle = Awaited<ReturnType<typeof getBundle>>;

/** Everything the page's server sections read, resolved once per request. */
export type CalcCtx = {
  locale: Locale;
  bundle: CalcBundle;
  t: Tf;
  sys: SysT;
  rateConfig: RateConfig;
  roles: CalculatorRole[];
};

export async function loadCalcCtx(locale: Locale): Promise<CalcCtx> {
  const [bundle, translate] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  return {
    locale,
    bundle,
    // W1: calc.050/101/104/381/481 carry {homepageReplyHours} — never makeT on this page.
    t: makeTf(bundle, locale),
    sys: (key, values) => translate(key, values),
    // Throws in every environment when absent: money never degrades silently (D17).
    rateConfig: getRateConfig(bundle),
    roles: getCollection(bundle, 'calculatorRoles'),
  };
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/Hero.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Breadcrumbs, ImageSlot } from '@/design/blocks';
import { effectiveFromLabel, effectiveYear, isReviewDue } from '@/lib/calculator';
import type { CalcCtx } from './ctx';

/** Design lines 640–668: navy hero, breadcrumbs (W109: this page's own calc.001/calc.002),
 *  the D17 dated badge, the h1 (the LCP element, D26) and the lede; `children` is the card. */
export function Hero({ ctx, children }: { ctx: CalcCtx; children?: ReactNode }) {
  const { t, sys, rateConfig, locale } = ctx;
  const badge = isReviewDue(rateConfig)
    ? null
    : sys('calc.hero.badge', {
        year: effectiveYear(rateConfig),
        month: effectiveFromLabel(rateConfig, locale),
      });
  return (
    <div className="relative overflow-hidden bg-navy pb-16 pt-14 xl:pb-[51px] xl:pt-[42px]">
      {/* D26: the only image slot on the page sits under a 90–97 % navy gradient — never the
          LCP, never priority; a named placeholder until licensed photography lands (W55). */}
      <ImageSlot
        slot="calc-hero"
        alt=""
        width={1600}
        height={700}
        className="absolute inset-0 !h-full !w-full opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,40,0.9)_0%,rgba(10,20,40,0.94)_45%,rgba(10,20,40,0.97)_100%)]"
      />
      <div className="container-site relative">
        <div className="mx-auto mb-8 max-w-[720px] text-center">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-3 justify-center text-white/55"
            items={[
              { name: t('calc.001'), href: '/' },
              { name: t('calc.002'), href: '/hiring-cost-calculator' },
            ]}
          />
          {badge && (
            <p
              data-testid="calc-badge"
              className="mb-4 inline-flex items-center gap-2 rounded-pill border border-success/35 bg-success/10 px-4 py-1.5 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-[#86efac]"
            >
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
              {badge}
            </p>
          )}
          <h1
            data-testid="page-h1"
            data-lcp-slot="h1"
            className="m-0 mb-4 text-h1 leading-[1.03] tracking-[-0.03em] text-white"
          >
            {t('calc.004')} <span className="text-sky">{t('calc.005')}</span> {t('calc.006')}
          </h1>
          <p className="m-0 text-body-lg text-white/75">{t('calc.007')}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/page.tsx` (this cycle's version):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { loadCalcCtx } from './_sections/ctx';
import { Hero } from './_sections/Hero';

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
  // bundle.pages.calc carries '' ids (the package ships no SEO copy for this page, W23/W38):
  // buildMetadata falls back to the sys.seo.calc pair.
  return buildMetadata({
    locale,
    href: '/hiring-cost-calculator',
    bundle,
    pageKey: 'calc',
    fallbackTitle: sys('seo.calc.title'),
    fallbackDescription: sys('seo.calc.description'),
  });
}

export default async function HiringCostCalculator({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const ctx = await loadCalcCtx(locale);
  return <Hero ctx={ctx} />;
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run src/lib/seo src/messages` → green (`unbuilt.test.ts` sees the page file; `routes.test.ts`'s `robotsDisallowPaths` cases unchanged — this route was never noindex; `messages.test.ts` sees identical key sets). `npm run verify` → green. `npm run build && npx next start -p 3100`, then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts e2e/seo.spec.ts` → the two new page-contract cases pass (one tagged h1, real copy, no leaked token) and the sitemap sweep finds `/maliyet-hesaplayici` answering 200.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator" src/messages/tr.json src/messages/en.json src/lib/seo/routes.ts e2e/routes.ts
git commit -m "feat(calc): hiring-cost-calculator route skeleton — hero, breadcrumbs, dated badge from rateConfig, sys.seo.calc, gate routes (T3 c1)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — `sys.calc.*` copy, label maps, the quote mapping (`quote.ts`, W3/W77), pass-check + salary-guide pure logic

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hiring-cost-calculator/__tests__/quote.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { ESTIMATE_FIELDS, parseEstimateFields } from '../estimate-inputs';
import { CALCULATOR_FIELD_NAMES, quoteSchema, toCalculatorFields } from '../quote';

const sys = (key: string, values?: Record<string, string | number>) =>
  `[${key}${values ? ':' + Object.values(values).join(',') : ''}]`;
const t = (id: string) => `<${id}>`;
const ctx = { locale: 'tr' as const, roles: ROLES, rateConfig: RATE, t, sys };

describe('quoteSchema', () => {
  it('requires name and email; an empty email reads "required", not "email"', () => {
    const r = quoteSchema.safeParse({ name: '', email: '' });
    expect(r.success).toBe(false);
    const issues = r.success ? [] : r.error.issues;
    expect(issues.find((i) => i.path[0] === 'name')?.code).toBe('too_small');
    expect(issues.find((i) => i.path[0] === 'email')?.code).toBe('too_small');
  });
  it('accepts the optional identity fields empty and refuses a phone with fewer than 8 digits', () => {
    expect(
      quoteSchema.safeParse({ name: 'Ayşe', email: 'a@b.co', phone: '', company: '', country: '' })
        .success,
    ).toBe(true);
    const bad = quoteSchema.safeParse({ name: 'Ayşe', email: 'a@b.co', phone: '12 34' });
    expect(bad.success).toBe(false);
    expect(bad.success ? '' : bad.error.issues[0].message).toBe('phone');
  });
});

describe('parseEstimateFields', () => {
  it('reads the hidden inputs and clamps garbage to the defaults', () => {
    const p = parseEstimateFields({
      [ESTIMATE_FIELDS.role]: 'cook',
      [ESTIMATE_FIELDS.headcount]: '12',
      [ESTIMATE_FIELDS.months]: '6',
      [ESTIMATE_FIELDS.salary]: '55000',
      [ESTIMATE_FIELDS.tier]: 'manufacturing',
      [ESTIMATE_FIELDS.flight]: '0',
      [ESTIMATE_FIELDS.housing]: '1',
      [ESTIMATE_FIELDS.support]: '1',
      [ESTIMATE_FIELDS.turkishStaff]: '40',
    });
    expect(p).toEqual({
      roleKey: 'cook',
      headcount: 12,
      months: 6,
      grossSalary: 55000,
      sgkTier: 'manufacturing',
      flight: false,
      housing: true,
      supportOptIn: true,
      turkishStaff: 40,
    });
    expect(
      parseEstimateFields({
        [ESTIMATE_FIELDS.headcount]: 'abc',
        [ESTIMATE_FIELDS.months]: '7',
        [ESTIMATE_FIELDS.tier]: 'x',
      }),
    ).toMatchObject({
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
  });
});

describe('toCalculatorFields', () => {
  const parsed = quoteSchema.parse({
    name: 'Ayşe Demir',
    email: 'AYSE@example.com ',
    phone: '+90 501 000 00 00',
    company: 'Demir Tekstil',
    country: 'tr',
    message: 'Antalya',
  });
  it('sends exactly the catalog field names, the role KEY as trade (W77) and the recomputed summary', () => {
    const fields = toCalculatorFields(parsed, ctx);
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
    const summary = fields.estimateSummary;
    expect(summary.length).toBeLessThanOrEqual(2000);
    // the label travels only inside the free-text summary, beside the key
    expect(summary).toContain('<calc.555> (welder)');
    // the model, not the client: 49 545 × 1.2175 = 60 321.04 → 60.321 ₺ (TR); first year 751.852 ₺
    expect(summary).toContain('60.321 ₺');
    expect(summary).toContain('751.852 ₺');
    expect(summary).toContain('[calc.summary.rates]: 2026-01');
  });
  it('recomputes from the hidden inputs and clamps the salary to the role range', () => {
    const fields = toCalculatorFields(
      quoteSchema.parse({
        name: 'A',
        email: 'a@b.co',
        [ESTIMATE_FIELDS.role]: 'cook',
        [ESTIMATE_FIELDS.headcount]: '5',
        [ESTIMATE_FIELDS.months]: '6',
        [ESTIMATE_FIELDS.salary]: '10',
      }),
      ctx,
    );
    expect(fields.headcount).toBe('5');
    expect(fields.durationMonths).toBe('6');
    expect(fields.trade).toBe('cook');
    // cook: max(1.5 × 33 030 = 49 545, salaryMin 50 000)
    expect(fields.estimateSummary).toContain('50.000 ₺');
  });
  it('never exceeds the door caps', () => {
    const fields = toCalculatorFields(
      quoteSchema.parse({ name: 'A', email: 'a@b.co', message: 'x'.repeat(5000) }),
      ctx,
    );
    expect(fields.estimateSummary.length).toBeLessThanOrEqual(2000);
    expect(fields.message.length).toBe(5000);
    expect(fields.trade.length).toBeLessThanOrEqual(200);
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/__tests__/pass-check-logic.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { passCheckVerdict, PASS_CHECK_ROWS } from '../pass-check-logic';

describe('passCheckVerdict', () => {
  it('is idle until more than one row is answered (the quota row is always answered)', () => {
    expect(passCheckVerdict({}, true)).toMatchObject({
      tone: 'idle',
      clear: 1,
      answered: 1,
      unanswered: 4,
    });
    expect(passCheckVerdict({ capital: 'yes' }, true)).toMatchObject({
      tone: 'progress',
      clear: 2,
      answered: 2,
    });
  });
  it('one "no" is red, one "unsure" without a "no" is amber, five clears is green', () => {
    expect(passCheckVerdict({ capital: 'no', sgk: 'unsure' }, true)).toMatchObject({
      tone: 'red',
      blockers: ['capital'],
      unsure: ['sgk'],
    });
    expect(passCheckVerdict({ capital: 'unsure' }, true)).toMatchObject({
      tone: 'amber',
      unsure: ['capital'],
    });
    expect(
      passCheckVerdict({ capital: 'yes', sgk: 'yes', salary: 'yes', docs: 'yes' }, true),
    ).toMatchObject({ tone: 'green', clear: 5, progressPct: 100 });
  });
  it('a failed quota is a blocker on its own and keeps the row order', () => {
    const v = passCheckVerdict({ capital: 'yes', sgk: 'yes', salary: 'yes', docs: 'yes' }, false);
    expect(v).toMatchObject({ tone: 'red', clear: 4, blockers: ['quota'] });
    expect(PASS_CHECK_ROWS).toEqual(['capital', 'quota', 'sgk', 'salary', 'docs']);
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/__tests__/salary-guide-rows.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { buildGuideRows, GUIDE_SCALE_MIN, guideScaleMax } from '../salary-guide-rows';

describe('buildGuideRows', () => {
  const labels = { skilled: 'Skilled · 1.5×', standard: 'Standard · 1×' };
  it('lists the 12 design roles (never the presets), floor-corrected, employer cost on the chosen tier (W59)', () => {
    const rows = buildGuideRows(ROLES, RATE, 'other', 'en', (id) => id, labels);
    expect(rows).toHaveLength(12);
    const welder = rows.find((r) => r.key === 'welder')!;
    expect(welder.range).toBe('₺49,545 – ₺70,000'); // W2: the exact floor, not 50 000
    expect(welder.employer).toBe('₺60,321 – ₺85,225');
    expect(welder.tier).toBe('Skilled · 1.5×');
    const manuf = buildGuideRows(ROLES, RATE, 'manufacturing', 'en', (id) => id, labels).find(
      (r) => r.key === 'welder',
    )!;
    expect(manuf.employer).toBe('₺58,835 – ₺83,125');
  });
  it('places the bar on the design scale (30 000 → the highest role max) with the minimum-wage tick', () => {
    const rows = buildGuideRows(ROLES, RATE, 'other', 'tr', (id) => id, labels);
    expect(guideScaleMax(ROLES)).toBe(78000);
    const labourer = rows.find((r) => r.key === 'labourer')!;
    expect(labourer.barLeftPct).toBeCloseTo(
      ((33030 - GUIDE_SCALE_MIN) / (78000 - GUIDE_SCALE_MIN)) * 100,
      1,
    );
    expect(labourer.tickPct).toBe(labourer.barLeftPct);
    expect(rows.filter((r) => r.industry === 'hotel')).toHaveLength(4);
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { CALC_SYS_KEYS } from '../calc-labels';

const get = (obj: unknown, path: string) =>
  path
    .split('.')
    .reduce<unknown>(
      (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
      obj,
    );
const args = (s: string) => [...s.matchAll(/\{([a-zA-Z]+)[,}]/g)].map((m) => m[1]).sort();

describe('sys.calc copy', () => {
  it('exists in both locales for every key the page reads', () => {
    for (const key of CALC_SYS_KEYS) {
      expect(typeof get(en, `sys.${key}`), `en sys.${key}`).toBe('string');
      expect(typeof get(tr, `sys.${key}`), `tr sys.${key}`).toBe('string');
    }
  });
  it('uses the same ICU arguments in TR and EN (the numeric-parity rule for templates)', () => {
    for (const key of CALC_SYS_KEYS) {
      expect(args(get(tr, `sys.${key}`) as string), key).toEqual(
        args(get(en, `sys.${key}`) as string),
      );
    }
  });
});
```

- [ ] **Step 2: Run to verify they fail**

`npx vitest run hiring-cost-calculator` → the four files fail to resolve `../estimate-inputs` / `../quote`, `../pass-check-logic`, `../salary-guide-rows`, `../calc-labels`.

- [ ] **Step 3: Implement**

`src/messages/en.json` — extend the `sys.calc` object Cycle 1 created (keep `hero`, add the rest):

```json
    "calc": {
      "hero": { "badge": "{year} rates · Updated {month}" },
      "skeleton": { "activate": "Adjust the estimate", "loading": "Loading the calculator…" },
      "empty": {
        "title": "The calculator is being updated",
        "body": "The current rates are not published yet — ask us for a written quote instead."
      },
      "a11y": {
        "headcountPresets": "Quick pick",
        "industryFilter": "Filter by industry",
        "jumpNav": "Jump to a section",
        "decrease": "Decrease by {step}",
        "increase": "Increase by {step}"
      },
      "live": {
        "quotaAllowed": "{n, plural, one {# foreign worker} other {# foreign workers}}",
        "quotaMsgNo": "With {staff, plural, one {# Turkish employee} other {# Turkish employees}} you do not reach the {ratio}:1 rule yet. You need {need} more, or one of the exemptions below.",
        "quotaMsgMore": "Counted as {ratio} Turkish employees for each foreign worker. {m, plural, one {# more Turkish employee} other {# more Turkish employees}} would give you one more place.",
        "quotaVsOver": "That is {over} more than the rule allows. You would need {need} more Turkish employees, or an exemption. Send us your numbers and we will tell you which one fits you.",
        "vCount": "{clear} of {total} checks clear{unanswered, plural, =0 {} other { · # unanswered}}",
        "ckQuoOk": "Answered from your quota check above: {staff} Turkish employees allow {allowed}, and you planned {headcount}.",
        "ckQuoNo": "Answered from your quota check above: {headcount} foreign workers need {need} Turkish employees on SGK, and you entered {staff}.",
        "ckQuoF": "You are short on the ratio — {need} Turkish employees are needed for {headcount}. Either reduce the headcount, or check whether your sector is exempt.",
        "ckSalB": "For a {role} that is {amount} gross per month ({multiplier}× the minimum wage). Declaring less is a refusal, not a negotiation — and paying part of it in cash is a separate offence.",
        "ckSalF": "Raise the declared salary to at least {amount} gross for this role, or pick a role class that matches the pay.",
        "vAmberN": "{n} things to confirm first",
        "vRedN": "{n} blockers — fix them before filing",
        "qvNone": "Not one complete block yet — {n} more Turkish employees unlock the first place.",
        "qvFull": "{staff} employees make exactly {blocks, plural, one {# complete block} other {# complete blocks}} — no spare capacity, {ratio} more unlock the next place.",
        "qvPart": "{blocks, plural, one {# complete block} other {# complete blocks}} plus {spare, plural, one {# spare employee} other {# spare employees}} — {need} more unlock one further place.",
        "qvCap": "{blocks} complete blocks (first {cap} shown) plus {spare} spare.{spare, plural, =0 {} other { {need} more unlock one further place.}}",
        "forWorkers": "for {n} workers",
        "threshold": "Legal minimum for this job: {amount} gross ({multiplier}× the minimum wage).",
        "seasonTotal": "{months}-month season total",
        "yearNote": "{months} months of payroll + one-off costs{headcount, plural, =1 {} other { for # workers}}",
        "nMonths": "{months} months"
      },
      "exemptions": {
        "badge": {
          "tenStaff": "10+ Turkish staff",
          "twentyStaff": "20+ Turkish staff",
          "upTo5": "Up to 5 workers",
          "full": "Full exemption",
          "timing": "Timing exemption",
          "upTo3": "Up to 3 workers",
          "exceptional": "Exceptional permit"
        }
      },
      "passcheck": { "unanswered": "unanswered" },
      "whatsapp": {
        "quote": "Hello JobsAdmire, I used the cost calculator: {headcount} × {role} at {salary} gross, {months}-month contract. Please send a written quote.",
        "quoteGeneric": "Hello JobsAdmire, I used the hiring cost calculator on your website. Please send me a written quote.",
        "passCheck": "Hello JobsAdmire, I ran the pass check on your cost calculator page.\nRole: {role} · {headcount} worker(s)\nTurkish employees at the workplace: {staff}\n{summary}\nCan you review this with me?"
      },
      "summary": {
        "role": "Role",
        "workers": "Workers",
        "contract": "Contract",
        "salary": "Gross salary",
        "sgkTier": "SGK tier",
        "covered": "Employer covers",
        "none": "none",
        "total": "Contract total",
        "rates": "Rates version"
      }
    }
```

`src/messages/tr.json` — the same object, in Turkish:

```json
    "calc": {
      "hero": { "badge": "{year} oranları · {month}'da güncellendi" },
      "skeleton": { "activate": "Tahmini düzenleyin", "loading": "Hesaplayıcı yükleniyor…" },
      "empty": {
        "title": "Hesaplayıcı güncelleniyor",
        "body": "Güncel oranlar henüz yayınlanmadı — bunun yerine bizden yazılı teklif isteyin."
      },
      "a11y": {
        "headcountPresets": "Hızlı seçim",
        "industryFilter": "Sektöre göre filtrele",
        "jumpNav": "Bölüme git",
        "decrease": "{step} azalt",
        "increase": "{step} artır"
      },
      "live": {
        "quotaAllowed": "{n} yabancı işçi",
        "quotaMsgNo": "{staff} Türk çalışanla {ratio}:1 kuralına henüz ulaşmıyorsunuz. {need} kişi daha gerekiyor veya aşağıdaki muafiyetlerden biri.",
        "quotaMsgMore": "Her yabancı işçi için {ratio} Türk çalışan sayılır. {m} Türk çalışan daha bir kontenjan açar.",
        "quotaVsOver": "Bu, kuralın izin verdiğinden {over} kişi fazla. {need} Türk çalışan daha veya bir muafiyet gerekir. Rakamlarınızı gönderin, size hangisinin uyduğunu söyleyelim.",
        "vCount": "{total} kontrolden {clear} tanesi uygun{unanswered, plural, =0 {} other { · # cevapsız}}",
        "ckQuoOk": "Kota kontrolüne göre, {staff} Türk çalışan için {allowed} yabancı çalışan kontenjanı bulunmaktadır. Planlanan: {headcount} yabancı çalışan.",
        "ckQuoNo": "Yukarıdaki kota kontrolünden dolduruldu: {headcount} yabancı işçi için SGK'lı {need} Türk çalışan gerekir, siz {staff} girdiniz.",
        "ckQuoF": "Oranda eksiksiniz — {headcount} işçi için {need} Türk çalışan gerekiyor. Ya sayıyı azaltın ya da sektörünüzün muaf olup olmadığını kontrol edin.",
        "ckSalB": "{role} için bu, aylık brüt {amount} demektir (asgari ücretin {multiplier} katı). Daha düşük beyan pazarlık değil rettir — bir kısmını elden ödemek ise ayrı bir suçtur.",
        "ckSalF": "Bu meslek için beyan edilen maaşı en az brüt {amount} seviyesine çıkarın ya da ödemeye uyan bir meslek sınıfı seçin.",
        "vAmberN": "Önce teyit edilmesi gereken {n} şey var",
        "vRedN": "{n} engel — başvurmadan önce düzeltin",
        "qvNone": "Henüz tam bir grup yok — {n} Türk çalışan daha ilk kontenjanı açar.",
        "qvFull": "{staff} çalışan tam olarak {blocks} grup eder — artık kapasite yok, {ratio} kişi daha bir sonraki kontenjanı açar.",
        "qvPart": "{blocks} tam grup artı {spare} artık çalışan — {need} kişi daha bir kontenjan daha açar.",
        "qvCap": "{blocks} tam grup (ilk {cap} gösteriliyor) artı {spare} artık.{spare, plural, =0 {} other { {need} kişi daha bir kontenjan daha açar.}}",
        "forWorkers": "{n} işçi için",
        "threshold": "Bu meslek için yasal alt sınır: brüt {amount} (asgari ücretin {multiplier} katı).",
        "seasonTotal": "{months} aylık sezon toplamı",
        "yearNote": "{months} aylık bordro + tek seferlik masraflar{headcount, plural, =1 {} other { (# işçi için)}}",
        "nMonths": "{months} ay"
      },
      "exemptions": {
        "badge": {
          "tenStaff": "10+ Türk çalışan",
          "twentyStaff": "20+ Türk çalışan",
          "upTo5": "5 işçiye kadar",
          "full": "Tam muafiyet",
          "timing": "Zamanlama muafiyeti",
          "upTo3": "3 işçiye kadar",
          "exceptional": "İstisnai izin"
        }
      },
      "passcheck": { "unanswered": "yanıtlanmadı" },
      "whatsapp": {
        "quote": "Merhaba JobsAdmire, maliyet hesaplayıcıyı kullandım: {headcount} × {role}, brüt {salary}, {months} aylık sözleşme. Yazılı teklif rica ederim.",
        "quoteGeneric": "Merhaba JobsAdmire, web sitenizdeki maliyet hesaplayıcıyı kullandım. Yazılı teklif rica ederim.",
        "passCheck": "Merhaba JobsAdmire, maliyet hesaplayıcı sayfanızdaki geçer-mi testini yaptım.\nMeslek: {role} · {headcount} işçi\nİşyerindeki Türk çalışan sayısı: {staff}\n{summary}\nBunu birlikte değerlendirebilir miyiz?"
      },
      "summary": {
        "role": "Meslek",
        "workers": "İşçi sayısı",
        "contract": "Sözleşme",
        "salary": "Brüt maaş",
        "sgkTier": "SGK kademesi",
        "covered": "İşverenin karşıladıkları",
        "none": "yok",
        "total": "Sözleşme toplamı",
        "rates": "Oran sürümü"
      }
    }
```

Both files stay `npx prettier --check` clean (2-space JSON; the `\n` inside `whatsapp.passCheck` is a JSON escape). Keys are identical in both locales; `src/messages/messages.test.ts` proves it.

`src/app/[locale]/(site)/hiring-cost-calculator/calc-labels.ts`:

```ts
import type { Tf } from './types';

/**
 * Package ids the islands need, keyed by the design's own `k` for traceability
 * (design-package/strings/calculator.json). The page resolves them on the server through
 * makeTf (W1) and hands each island only its own slice — never the bundle (D6).
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
  sea1: 'calc.038', sea2: 'calc.039', cFine: 'calc.040', cQuotaQ1: 'calc.041', cQuotaQ2: 'calc.042',
  cQuotaD1: 'calc.043', cQuotaStaff: 'calc.044', cQuotaD2: 'calc.045', cQuotaM1: 'calc.046',
  cQuotaStaffShort: 'calc.047', cQuotaM2: 'calc.048', cQuotaLink: 'calc.049', sWa: 'calc.052',
  sheetPick: 'calc.399', brkHide: 'calc.421', brkShow: 'calc.422', advFew: 'calc.423',
  advMore: 'calc.424', perWorker: 'calc.463', perMonthSuffix: 'calc.464', tierManuf: 'calc.466',
  tierOther: 'calc.467', tierNone: 'calc.468', firstYear: 'calc.469', fullYear: 'calc.470',
  chip6: 'calc.471', chip9: 'calc.472', chip12: 'calc.473', allShort: 'calc.475',
} as const;

export const QUOTA_IDS = {
  qG1: 'calc.140', qLive: 'calc.141', qStaffLbl: 'calc.142', qSameBranch: 'calc.143',
  qSplit: 'calc.144', qLegTr: 'calc.145', qLegPlace: 'calc.146', qLegInc: 'calc.147',
  qPicked1: 'calc.148', qPicked2: 'calc.149', qmS1: 'calc.175', qmS1T: 'calc.176', qmAns: 'calc.177',
  qmWhy: 'calc.178', qmWhyA: 'calc.179', qmWhyB: 'calc.180',
  quotaNone: 'calc.425', quotaTitleNo: 'calc.426', quotaTitleYes: 'calc.427',
  quotaMsgExact: 'calc.428', quotaVsOk: 'calc.429',
} as const;

export const PASS_IDS = {
  pcK: 'calc.376', pcReset: 'calc.377', pcPriv: 'calc.378', pcFix: 'calc.379', pcSend: 'calc.413',
  pcYes: 'calc.433', pcNo: 'calc.434', pcMaybe: 'calc.435', pcClear: 'calc.436', pcShort: 'calc.437',
  vIdleK: 'calc.438', vIdleT: 'calc.439', vIdleB: 'calc.440', vProgK: 'calc.441', vProgT: 'calc.442',
  vProgB: 'calc.443', pcConfirm: 'calc.444', ckCapT: 'calc.445', ckCapB: 'calc.446', ckCapF: 'calc.447',
  ckQuoT: 'calc.448', ckSgkT: 'calc.449', ckSgkB: 'calc.450', ckSgkF: 'calc.451', ckSalT: 'calc.452',
  ckDocT: 'calc.453', ckDocB: 'calc.454', ckDocF: 'calc.455', vRes: 'calc.456', vGreenT: 'calc.457',
  vGreenB: 'calc.458', vAmber1: 'calc.459', vAmberB: 'calc.460', vRed1: 'calc.461', vRedB: 'calc.462',
} as const;

export const GUIDE_IDS = {
  sLegRange: 'calc.093', sLegMin: 'calc.094', sLegSkill: 'calc.095', sGrossMo: 'calc.096',
  sEmpCost: 'calc.097', allInd: 'calc.474', skilled: 'calc.476', standard: 'calc.477',
  inCalc: 'calc.478', useCalc: 'calc.479',
} as const;

export type Labels<T extends Record<string, string>> = { [K in keyof T]: string };
export type CardLabels = Labels<typeof CARD_IDS>;
export type QuotaLabels = Labels<typeof QUOTA_IDS>;
export type PassLabels = Labels<typeof PASS_IDS>;
export type GuideLabels = Labels<typeof GUIDE_IDS>;

/** Resolve one id map through the page's `makeTf` — the only place package copy meets an island. */
export function pickLabels<T extends Record<string, string>>(t: Tf, ids: T): Labels<T> {
  return Object.fromEntries(Object.entries(ids).map(([k, id]) => [k, t(id)])) as Labels<T>;
}

/** Every `sys.*` key this page reads (both locales; asserted by __tests__/sys-keys.test.ts). */
export const CALC_SYS_KEYS = [
  'seo.calc.title', 'seo.calc.description',
  'calc.hero.badge', 'calc.skeleton.activate', 'calc.skeleton.loading',
  'calc.empty.title', 'calc.empty.body',
  'calc.a11y.headcountPresets', 'calc.a11y.industryFilter', 'calc.a11y.jumpNav',
  'calc.a11y.decrease', 'calc.a11y.increase',
  'calc.live.quotaAllowed', 'calc.live.quotaMsgNo', 'calc.live.quotaMsgMore', 'calc.live.quotaVsOver',
  'calc.live.vCount', 'calc.live.ckQuoOk', 'calc.live.ckQuoNo', 'calc.live.ckQuoF', 'calc.live.ckSalB',
  'calc.live.ckSalF', 'calc.live.vAmberN', 'calc.live.vRedN', 'calc.live.qvNone', 'calc.live.qvFull',
  'calc.live.qvPart', 'calc.live.qvCap', 'calc.live.forWorkers', 'calc.live.threshold',
  'calc.live.seasonTotal', 'calc.live.yearNote', 'calc.live.nMonths',
  'calc.exemptions.badge.tenStaff', 'calc.exemptions.badge.twentyStaff', 'calc.exemptions.badge.upTo5',
  'calc.exemptions.badge.full', 'calc.exemptions.badge.timing', 'calc.exemptions.badge.upTo3',
  'calc.exemptions.badge.exceptional',
  'calc.passcheck.unanswered',
  'calc.whatsapp.quote', 'calc.whatsapp.quoteGeneric', 'calc.whatsapp.passCheck',
  'calc.summary.role', 'calc.summary.workers', 'calc.summary.contract', 'calc.summary.salary',
  'calc.summary.sgkTier', 'calc.summary.covered', 'calc.summary.none', 'calc.summary.total',
  'calc.summary.rates',
] as const;

/** `1,5` / `1.5` — the bare multiplier number; the templates own the `×`/`katı` wording. */
export function multiplierNumber(m: number, locale: 'tr' | 'en'): string {
  return new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    maximumFractionDigits: 2,
  }).format(m);
}
```

(Prettier reflows the id maps one pair per line; the listing is compacted here for reading. Run `npx prettier --write` on the new files before the commit.)

`src/app/[locale]/(site)/hiring-cost-calculator/estimate-inputs.ts` (pure and **zod-free** — the eager `EstimateFields`/`estimate-store` client modules import it, so zod must not ride into the initial bundle; `quote.ts` is the only zod importer and runs on the server):

```ts
import { LIMITS, SGK_TIERS, type SgkTier } from '@/lib/calculator';

/** The estimate state the island writes into hidden inputs; prefixed `est_` so no name can ever
 *  be mistaken for (or dropped as) a catalog field — only the ten catalog names leave quote.ts. */
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

export const DEFAULT_INPUTS: EstimateInputs = {
  roleKey: DEFAULT_ROLE_KEY,
  headcount: 1,
  months: 12,
  grossSalary: null,
  sgkTier: 'other',
  flight: true,
  housing: false,
  supportOptIn: false, // W2: support is opt-in
  turkishStaff: TURKISH_STAFF.default,
};

const int = (v: unknown, fallback: number, min: number, max: number) => {
  const n = typeof v === 'number' ? v : parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};
const bool = (v: unknown, fallback: boolean) =>
  v === '1' || v === true ? true : v === '0' || v === false ? false : fallback;

/** Clamp anything (hidden inputs, store patches) into a valid EstimateInputs — the design's bounds. */
export function sanitizeInputs(raw: Partial<Record<keyof EstimateInputs, unknown>>): EstimateInputs {
  const months = int(raw.months, 12, 1, 12);
  const salary =
    raw.grossSalary === null || raw.grossSalary === undefined || raw.grossSalary === ''
      ? null
      : int(raw.grossSalary, 0, 0, 10_000_000);
  return {
    roleKey:
      typeof raw.roleKey === 'string' && raw.roleKey ? raw.roleKey.slice(0, 40) : DEFAULT_ROLE_KEY,
    headcount: int(raw.headcount, 1, LIMITS.headcountMin, LIMITS.headcountMax),
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

`src/app/[locale]/(site)/hiring-cost-calculator/quote.ts`:

```ts
import { z } from 'zod';
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { estimate, findRole, formatEstimate, sgkRateLabel, type SgkTier } from '@/lib/calculator';
import { formatTRY } from '@/lib/format/money';
import {
  DEFAULT_ROLE_KEY,
  ESTIMATE_FIELDS,
  parseEstimateFields,
  type EstimateInputs,
} from './estimate-inputs';
import type { SysT, Tf } from './types';

const hidden = z.string().max(40).optional();

/** `.min(1)` before `.email()` so an empty value reads `required`, not `email` (kernel rule). */
export const quoteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().min(1).max(254).email(),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === '' || /(\D*\d){8,}/.test(v), { message: 'phone' })
    .optional(),
  company: z.string().trim().max(200).optional(),
  country: z.string().trim().max(2).optional(),
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

/** The Ops catalog's `calculator` field names (v1.0) — the only keys ever sent. */
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
export type CalculatorFieldName = (typeof CALCULATOR_FIELD_NAMES)[number];
export const ESTIMATE_SUMMARY_MAX = 2000;

export type QuoteContext = {
  locale: Locale;
  roles: CalculatorRole[];
  rateConfig: RateConfig;
  t: Tf; // makeTf(bundle, locale)
  sys: SysT; // getTranslations({ locale, namespace: 'sys' })
};

const TIER_LABEL_ID: Record<SgkTier, string> = {
  manufacturing: 'calc.466',
  other: 'calc.467',
  none: 'calc.468',
};

/** Recomputed on the server from the hidden inputs — the summary never trusts a client total.
 *  Free text for the inbox reader: localized labels are allowed here (W77), keys ride beside them. */
export function buildEstimateSummary(
  inputs: EstimateInputs,
  ctx: QuoteContext,
): { summary: string; role: CalculatorRole; months: number; headcount: number } {
  const { locale, roles, rateConfig, t, sys } = ctx;
  const role = findRole(roles, inputs.roleKey) ?? findRole(roles, DEFAULT_ROLE_KEY) ?? roles[0];
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
  const covered =
    [inputs.flight && t('calc.017'), inputs.housing && t('calc.018'), inputs.supportOptIn && t('calc.020')]
      .filter(Boolean)
      .join(' · ') || sys('calc.summary.none');
  const months = sys('calc.live.nMonths', { months: est.input.months });
  const lines = [
    `${sys('calc.summary.role')}: ${t(role.labelId)} (${role.key})`,
    `${sys('calc.summary.workers')}: ${est.input.headcount}`,
    `${sys('calc.summary.contract')}: ${months}`,
    `${sys('calc.summary.salary')}: ${f.grossSalary} ${t('calc.464')}`,
    `${sys('calc.summary.sgkTier')}: ${t(TIER_LABEL_ID[est.input.sgkTier])} (${sgkRateLabel(rateConfig, est.input.sgkTier, locale)})`,
    `${sys('calc.summary.covered')}: ${covered}`,
    `${t('calc.142')}: ${inputs.turkishStaff}`,
    `${t('calc.028')}: ${f.monthly.total}`,
    `${t('calc.034')}: ${f.oneOff.total}`,
    `${sys('calc.summary.total')}: ${f.contract.total} (${months}, ${formatTRY(est.contract.perWorkerPerMonth, locale)} ${t('calc.463')} ${t('calc.464')})`,
    `${sys('calc.summary.rates')}: ${rateConfig.version}`,
  ];
  return {
    summary: lines.join('\n').slice(0, ESTIMATE_SUMMARY_MAX),
    role,
    months: est.input.months,
    headcount: est.input.headcount,
  };
}

/** Exact catalog names and stable values (W3/W77): ISO2 upper-case, `trade` = the role KEY. */
export function toCalculatorFields(
  p: QuoteInput,
  ctx: QuoteContext,
): Record<CalculatorFieldName, string> {
  const inputs = parseEstimateFields(p as Record<string, unknown>);
  const { summary, role, months, headcount } = buildEstimateSummary(inputs, ctx);
  return {
    name: p.name,
    email: p.email,
    phone: p.phone ?? '',
    company: p.company ?? '',
    country: (p.country ?? '').toUpperCase(),
    headcount: String(headcount),
    trade: role.key.slice(0, 200),
    durationMonths: String(months),
    estimateSummary: summary,
    message: p.message ?? '',
  };
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/pass-check-logic.ts`:

```ts
export const PASS_CHECK_ROWS = ['capital', 'quota', 'sgk', 'salary', 'docs'] as const;
export type PassRow = (typeof PASS_CHECK_ROWS)[number];
export type ManualRow = Exclude<PassRow, 'quota'>;
export const MANUAL_ROWS: ManualRow[] = ['capital', 'sgk', 'salary', 'docs'];
export type Answer = 'yes' | 'no' | 'unsure';
export type Answers = Partial<Record<ManualRow, Answer>>;
export type Tone = 'idle' | 'progress' | 'green' | 'amber' | 'red';

/** The design's verdict rules (passCheck, lines 1899–1965): any "no" → red; else any "not sure"
 *  → amber; else all five answered → green; else more than one answered → progress; else idle.
 *  The quota row is auto-answered from the calculator, so `answered` starts at 1. */
export function passCheckVerdict(answers: Answers, quotaOk: boolean) {
  const value = (row: PassRow): Answer | null =>
    row === 'quota' ? (quotaOk ? 'yes' : 'no') : (answers[row] ?? null);
  const rows = PASS_CHECK_ROWS.map((row) => ({ row, v: value(row) }));
  const answered = rows.filter((r) => r.v).length;
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
```

`src/app/[locale]/(site)/hiring-cost-calculator/salary-guide-rows.ts`:

```ts
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { employerMonthlyCost, salaryRange, type SgkTier } from '@/lib/calculator';
import { formatTRY } from '@/lib/format/money';
import type { Tf } from './types';

/** The design's bar scale: 30 000 → the highest role maximum (line 2586). */
export const GUIDE_SCALE_MIN = 30000;
export const guideScaleMax = (roles: CalculatorRole[]) =>
  Math.max(GUIDE_SCALE_MIN + 1, ...roles.filter((r) => !r.preset).map((r) => r.salaryMax ?? 0));

type Industry = NonNullable<CalculatorRole['industry']>;
export type GuideRow = {
  key: string;
  role: string;
  industry: Industry;
  industryLabel: string;
  range: string;
  employer: string;
  tier: string;
  skilled: boolean;
  barLeftPct: number;
  barWidthPct: number;
  tickPct: number;
};

/** One row per design role (presets excluded); the floor is the model's exact floor (W2) and the
 *  employer cost follows the chosen SGK tier (W59). Strings are formatted here (D18), nowhere else. */
export function buildGuideRows(
  roles: CalculatorRole[],
  rateConfig: RateConfig,
  tier: SgkTier,
  locale: Locale,
  t: Tf,
  labels: { skilled: string; standard: string },
): GuideRow[] {
  const max = guideScaleMax(roles);
  const pct = (v: number) =>
    Math.max(0, Math.min(100, ((v - GUIDE_SCALE_MIN) / (max - GUIDE_SCALE_MIN)) * 100));
  return roles
    .filter(
      (r): r is CalculatorRole & { industry: Industry } => !r.preset && r.industry !== null,
    )
    .map((r) => {
      const range = salaryRange(r, rateConfig);
      const hi = range.max ?? range.min;
      const left = pct(range.min);
      return {
        key: r.key,
        role: t(r.labelId),
        industry: r.industry,
        industryLabel: r.industryLabelId ? t(r.industryLabelId) : r.industry,
        range: `${formatTRY(range.min, locale)} – ${formatTRY(hi, locale)}`,
        employer: `${formatTRY(employerMonthlyCost(range.min, rateConfig, tier), locale)} – ${formatTRY(employerMonthlyCost(hi, rateConfig, tier), locale)}`,
        tier: r.multiplier > 1 ? labels.skilled : labels.standard,
        skilled: r.multiplier > 1,
        barLeftPct: left,
        barWidthPct: Math.max(4, pct(hi) - left),
        tickPct: pct(rateConfig.legalMinGross),
      };
    });
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run hiring-cost-calculator src/messages` → the 4 new files green (13 tests) + `messages.test.ts` green (identical key sets). `npm run verify` → green (`quote.ts` imports nothing server-only; the computed `ESTIMATE_FIELDS` keys in `z.object` type-check because the values are string literals `as const`).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator" src/messages/tr.json src/messages/en.json
git commit -m "feat(calc): sys.calc copy (21 live ICU templates, badges, summary), quote mapping to the calculator catalog with trade = role key (W77), pass-check + salary-guide logic (T3 c2)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
