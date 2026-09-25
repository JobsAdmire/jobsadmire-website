### Task 3: Cost Calculator (`/maliyet-hesaplayici` · `/en/hiring-cost-calculator`) — pixel-harness page

**Why this page is shaped the way it is.** The design (`design-package/design/Hiring Cost Calculator.dc.html`, 2,807 lines, strings `calc.001`–`calc.561`) is a client-side calculator with no `<form>`: every conversion is a WhatsApp/tel/mailto link, the rates are literals in the page script, and 23 sentence templates with live numbers exist only in its `GEN` dictionary. This task ports it onto WP1 + WP2a under these rulings: **W2** (one engine, `src/lib/calculator`, exact legal floor — the slider minimum for a 1.5× role is **49 545**, never the design's rounded 50 000; support opt-in default OFF), **W3** (the four "written quote" CTAs become ONE real form → door `calculator` with `name*`/`email*`/`phone`/`company`/`country` + the estimate serialised server-side into `estimateSummary` ≤ 2000; the pass-check's `calc.378` "your answers are not sent" stays literally true — the check never posts, its "send my result" is a WhatsApp link the visitor clicks), **W9/W23** (never a new package id; every composed sentence lives under `sys.calc.*`, ICU plurals), **W12** (only `calculator_use` (`role`, `headcount`) + the chrome's contact clicks; no `calc_print`/`quota_check`/`passcheck_answer` — those design events are not in the allow-list and are dropped), **W13 amended** (the calculator, the quota gate, the pass check and the salary guide are `next/dynamic` islands loaded on interaction/viewport; the page's initial script graph carries only the form kernel, the sticky bar and four tiny client boundaries), **W10** (phone-only variants render with `md:hidden`, desktop with `hidden md:block` — both in the DOM), **D17** (the hero badge and the "last updated" pill render from `rateConfig`; the badge hides from `reviewDueAt`; `calc.415–417`'s SGK percentages render from `rateConfig.sgkRates`; the design's `₺12.700` literal is `10 × rateConfig.supportMonthly` through `formatTRY`), **D18** (every lira figure through `formatTRY` at the edge — `labels.ts`), **D26** (LCP = the h1; the `calc-hero` image slot is a named placeholder under the 90–97 % navy gradient, never priority, never the LCP), **W59** (salary-guide employer cost follows the chosen SGK tier), **W1** (`calc.050/101/104/381/481` carry `{homepageReplyHours}` — the whole page resolves ids through `makeTf`, never `makeT`), **W17** (`CTA_BY_PATHNAME['/hiring-cost-calculator']` → `#calculator`: the card carries that id), **W18** (`StickyCtaBar` with `hideNearId="calc-cta"`), **W20/W21** (delete the route from `UNBUILT_PATHNAMES`; append both paths to `GATE_ROUTE_TABLE`).

**Named design deltas (logged for the D27 two-iteration harness):** (1) the quote form (W3) replaces the four WhatsApp "written quote" links — the card's `calc.036` scrolls to `#quote`; the sticky bar's `calc.052` and the FAQ card keep a static WhatsApp prefill; the island's own WhatsApp button carries the live prefill; (2) the ≤700 px per-section accordion is kept but the section's own `h2` + subtitle stay in the accessibility tree (`max-md:sr-only`) instead of `display:none`; (3) the hero badge text is `sys.calc.hero.badge` filled from `rateConfig` (D17) — `calc.003` is not rendered; (4) the salary-guide employer cost follows the chosen tier (W59); (5) the slider/pass-check minimum is 49 545, the design's 50 000 is not ported (W2); (6) the mobile role picker is the foundation's `BottomSheet` (a real dialog, D20); (7) the closing band's primary is the form's submit (`calc.105`), not a `wa.me` link.

**Files:**

Create:
- `src/app/[locale]/(site)/hiring-cost-calculator/page.tsx`
- `src/app/[locale]/(site)/hiring-cost-calculator/actions.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/estimate-inputs.ts` (pure, zod-free: hidden-field names, bounds, defaults, `sanitizeInputs`/`parseEstimateFields`)
- `src/app/[locale]/(site)/hiring-cost-calculator/quote.ts` (pure, server-side use: Zod schema, `estimateSummary`, `toCalculatorFields`)
- `src/app/[locale]/(site)/hiring-cost-calculator/card-view.ts` (pure: the card's view model, shared by the server skeleton and the island)
- `src/app/[locale]/(site)/hiring-cost-calculator/calc-labels.ts` (pure: package-id maps per island + `pickLabels`)
- `src/app/[locale]/(site)/hiring-cost-calculator/pass-check-logic.ts` (pure)
- `src/app/[locale]/(site)/hiring-cost-calculator/salary-guide-rows.ts` (pure)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/estimate-store.ts` (client-only module, no directive — imported by client components only, like `useContactClick`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/LazyIsland.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateBreakdown.tsx` (presentational, no hooks — shared by skeleton + island)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorSkeleton.tsx` (presentational)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorLoader.tsx` (`'use client'`, `next/dynamic` on interaction)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorIsland.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/SalaryGuide.tsx` (`'use client'`, `next/dynamic` on viewport) + `SalaryGuideCards.tsx` (presentational)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/QuotaGate.tsx` (`'use client'`, loader) + `QuotaGateIsland.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/PassCheck.tsx` (`'use client'`, loader) + `PassCheckIsland.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/CollapsibleSection.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateFields.tsx` (`'use client'`, hidden inputs inside the FormShell)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateRecap.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_components/LiveSgkRate.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hiring-cost-calculator/_sections/StaticSections.tsx` (server: Basis, Compare, QuotaGate2 + Exemptions, Incentives, Penalties, Students, JumpChips, helpers)
- `e2e/pages/calculator.spec.ts`

Modify:
- `src/messages/tr.json`, `src/messages/en.json` — add `sys.seo.calc.{title,description}` inside the existing `seo` object (Task 4 created it with `ogTagline`) and a new `sys.calc` object after `sys.form` (both files; `src/messages/messages.test.ts` asserts identical key sets)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES` literal (Task 4 lines 328–350 of its snippet; in the file, the `new Set<keyof typeof pathnames>([` block): delete the line `'/hiring-cost-calculator',`
- `e2e/routes.ts` — `GATE_ROUTE_TABLE` (lines 1–20 after T0e): append two rows after `{ path: '/en/hire-workers', indexable: true },`
- `docs/SEO.md` (§ Metadata, lines 5–7: add/extend the `### Pages` table), `docs/ANALYTICS.md` (§ Event schema table line 61 `calculator_use` row + the paragraph after the table), `docs/CONTENT-MODEL.md` (§ Adding copy (W9, W23, W54), lines 72–74: add the `sys.calc.*` line), `docs/PRD.md` (page table line 21, the Cost Calculator row's "Forms carried" cell)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the ledger line (end of the task)

Test:
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/quote.test.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/estimate-store.test.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/pass-check-logic.test.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/CalculatorIsland.test.tsx`
- `src/app/[locale]/(site)/hiring-cost-calculator/__tests__/salary-guide-rows.test.ts`
- `e2e/pages/calculator.spec.ts` (+ the existing `e2e/routing.spec.ts` page-contract loop, `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` now sweep the two new routes)
- `npm run verify`; `E2E_BASE_URL=http://localhost:3100 npm run gate` against `next build && next start -p 3100`, then the preview gate; `npm run js-size`; `npm run pixel -- --page=calc --locale=tr` (+ `--locale=en`)

**Interfaces:**

Consumes (WP1 as built): `getBundle` (`@/content/adapter`, server-only; re-exports `makeTf`), `routing`/`Locale`/`pathnames` (`@/i18n/routing`), `Link` (`@/i18n/navigation`), `buildMetadata` (`@/lib/seo/metadata`), `formatTRY`/`formatInt` (`@/lib/format/money`), `waLink`/`telLink`/`mailLink` (`@/lib/contact`), `track` + `ALLOWED_PARAMS.calculator_use = ['page','locale','role','headcount']` (`@/analytics/track`), `FormKey` (`@/analytics/forms`), primitives `Button`/`buttonClassName`/`Card`/`Chip`/`Eyebrow`/`Section` (tones `light|dark|pale|band`)/`Tabs` (`onChange`)/`Accordion`/`RadioChips` (`@/design/primitives`), `renderWithIntl` (`@/test/render`).

Consumes (WP2a, exactly as produces-final.md spells them):
- Task 1: `getCollection(bundle,'calculatorRoles'|'countries')`, `getRateConfig(bundle)`, `CalculatorRole`, `RateConfig`, `Country` (`@/content/collections`); `makeTf(bundle, locale)`, `fill` (`@/content/pure`).
- Task 2: `createFormAction`, `FormActionState`, `FormActionError` (`@/forms/action`); `FormShell` (`@/forms/client/FormShell`), `Field` (`@/forms/client/Field`); `sys.form.labels.{name,email,phone,company,country,message}`, `sys.form.placeholders.select`.
- Task 3: `ContactLink` (`@/analytics/ContactLink`), `useContactClick`/`contactKindOf` (`@/analytics/useContactClick`), `CTA_BY_PATHNAME['/hiring-cost-calculator']` → `#calculator` (the page renders that id), `PARAM_ENUMS.placement` includes `page_cta`.
- Task 4: `UNBUILT_PATHNAMES`, `OG_PAGE_KEYS` has `calc` (`@/lib/seo/routes`); `buildMetadata({ locale, href, bundle, pageKey: 'calc', fallbackTitle, fallbackDescription })`; `bundle.pages.calc = { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb','faq'] }` → the `''` fallback rule.
- Task 5: `Breadcrumbs({ locale, items, tone })`, `FaqBlock({ bundle, locale, items, id, eyebrowId, headingId, bodyId, askCard, footer })`, `ContactCta({ placement:'page_cta', href, variant, size, external })`, `ImageSlot({ slot, lcp, src, alt, width, height, className })`, `EmptyState({ title, body, cta, tone, testId })` (`@/design/blocks`); `StickyCtaBar({ message, ctas, hideNearId, live })` (`@/design/chrome/StickyCtaBar`); `Section` tones; `RadioChips`.
- Task 6: `RangeSlider`, `Stepper`, `TriState`/`TriStateValue`, `ProgressBar`, `BottomSheet`, `PrintButton` (`@/design/islands`); CSS `body.print-isolating` + `.print-isolate` / `.print-hidden`.
- Task 7: `GATE_ROUTE_TABLE` (`e2e/routes.ts`), the page markup contract (`data-testid="page-h1"`, `data-lcp-slot`, `data-placeholder`), `npm run js-size`, `npm run pixel -- --page=calc`, `scripts/placeholder-count.ts`.
- Task 8 (Ops catalog `calculator`, v1.0 — no v1.1 field applies to this key): `name` ≤120 REQUIRED, `email` ≤254 REQUIRED, `phone` ≤40 (≥8 digits when present), `company` ≤200, `country` iso2, `headcount` ≤10, `trade` ≤200, `durationMonths` ≤10, `estimateSummary` ≤2000, `message` ≤5000. Unknown keys inside `fields` are dropped silently — this task sends exactly these ten names.
- Task 9 (`@/lib/calculator`): `estimate(input, rateConfig)`, `salaryRange(role, rateConfig)`, `salaryFloor`, `employerMonthlyCost(gross, rateConfig, tier)`, `findRole(roles, key)`, `formatEstimate(estimate, locale)`, `quotaCheck(staff, requested, ratio)`, `turkishStaffRequired`, `quotaBlocks(staff, ratio, cap?)`, `QUOTA_VIZ_CAP`, `effectiveFromLabel`, `updatedAtLabel`, `effectiveYear`, `isReviewDue`, `sgkRateLabel`, `LIMITS`, `SGK_TIERS`, `SgkTier`, `Estimate`, `FormattedEstimate`; test fixtures `RATE`, `ROLES`, `role(key)` (`src/lib/calculator/__tests__/fixtures.ts`).

Produces: nothing another task consumes. (`sys.calc.*` is page-local; the `LazyIsland`/`estimate-store` pattern is a precedent later page tasks may copy, not an import.)

---

#### Cycle 1 — Skeleton page, metadata, route gating (W20/W21)

- [ ] **Step 1: Write the failing test**

`e2e/routes.ts` — after the row `{ path: '/en/hire-workers', indexable: true },` add:

```ts
  { path: '/maliyet-hesaplayici', indexable: true },
  { path: '/en/hiring-cost-calculator', indexable: true },
```

`src/lib/seo/routes.ts` — inside the `UNBUILT_PATHNAMES` literal delete the line `'/hiring-cost-calculator',`.

`src/messages/en.json` — inside `"seo": { "ogTagline": … }` add:

```json
    "calc": {
      "title": "Hiring cost calculator — what a foreign worker really costs in Türkiye | JobsAdmire",
      "description": "Salary, SGK employer share, permit fees, flights and accommodation calculated in one place with the current rates. Check your 5:1 quota, run the pass check and ask for a written quote."
    }
```

`src/messages/tr.json` — same place:

```json
    "calc": {
      "title": "İşçi maliyet hesaplayıcı — yabancı bir işçi Türkiye'de gerçekte ne kadara mal olur? | JobsAdmire",
      "description": "Maaş, SGK işveren payı, izin harçları, uçak bileti ve konaklama — güncel oranlarla tek yerde hesaplayın. 5:1 kotanızı kontrol edin, geçer-mi testini yapın ve yazılı teklif isteyin."
    }
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run src/lib/seo/unbuilt.test.ts` → fails: `'/hiring-cost-calculator' has a page file? no — UNBUILT_PATHNAMES and src/app disagree` (the set no longer lists the key but no `page.tsx` exists under `(site)/hiring-cost-calculator`). `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts -g "page contract"` → `page contract on /maliyet-hesaplayici` fails with `expect(locator).toHaveCount(1) … locator('h1[data-testid="page-h1"]') … Received: 0` (the `[...rest]` 404).

- [ ] **Step 3: Implement** — `src/app/[locale]/(site)/hiring-cost-calculator/page.tsx` (this cycle's skeleton; Cycles 3–5 fill the sections marked `/* cycle N */`; the final file is shown in full in Cycle 5):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getRateConfig } from '@/content/collections';
import { Breadcrumbs, ImageSlot } from '@/design/blocks';
import { routing } from '@/i18n/routing';
import { effectiveFromLabel, effectiveYear, isReviewDue } from '@/lib/calculator';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
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
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeTf(bundle, locale); // W1: calc.050/101/104/381/481 carry {homepageReplyHours}
  const rateConfig = getRateConfig(bundle); // throws in every env when absent (D17)
  const badge = isReviewDue(rateConfig)
    ? null
    : sys('calc.hero.badge', {
        year: effectiveYear(rateConfig),
        month: effectiveFromLabel(rateConfig, locale),
      });
  return (
    <>
      <div className="relative overflow-hidden bg-navy pb-16 pt-14 xl:pb-[51px] xl:pt-[42px]">
        {/* D26: the only image slot on the page sits under a 90–97 % navy gradient — never the LCP,
            never priority; it stays a named placeholder until licensed photography lands. */}
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
          {/* cycle 3: the calculator card (id="calculator") */}
        </div>
      </div>
      {/* cycle 4: jump chips + content sections · cycle 5: sticky bar + closing band with the form */}
    </>
  );
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run src/lib/seo` → green (`unbuilt.test.ts` sees the page file; `routes.test.ts`'s `robotsDisallowPaths` cases unchanged — this route was never noindex). `npm run verify` → green. `next build && next start -p 3100` then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts e2e/seo.spec.ts` → the two new page-contract cases pass (one h1, tagged, real copy; the sitemap sweep now finds `/maliyet-hesaplayici` answering 200).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator/page.tsx" src/messages/tr.json src/messages/en.json src/lib/seo/routes.ts e2e/routes.ts
git commit -m "feat(calc): hiring-cost-calculator route skeleton — hero, breadcrumbs, dated badge from rateConfig, gate routes (T3 c1)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — `sys.calc.*` copy, label maps, the quote mapping (`quote.ts`), pass-check + salary-guide pure logic

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
    expect(quoteSchema.safeParse({ name: 'Ayşe', email: 'a@b.co', phone: '', company: '', country: '' }).success).toBe(true);
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
    expect(p).toEqual({ roleKey: 'cook', headcount: 12, months: 6, grossSalary: 55000, sgkTier: 'manufacturing', flight: false, housing: true, supportOptIn: true, turkishStaff: 40 });
    expect(parseEstimateFields({ [ESTIMATE_FIELDS.headcount]: 'abc', [ESTIMATE_FIELDS.months]: '7', [ESTIMATE_FIELDS.tier]: 'x' })).toMatchObject({
      roleKey: 'welder', headcount: 1, months: 12, grossSalary: null, sgkTier: 'other', flight: true, housing: false, supportOptIn: false, turkishStaff: 25,
    });
  });
});

describe('toCalculatorFields', () => {
  const parsed = quoteSchema.parse({ name: 'Ayşe Demir', email: 'AYSE@example.com ', phone: '+90 501 000 00 00', company: 'Demir Tekstil', country: 'tr', message: 'Antalya' });
  it('sends exactly the catalog field names, stable option values, and the recomputed summary', () => {
    const fields = toCalculatorFields(parsed, ctx);
    expect(Object.keys(fields).sort()).toEqual([...CALCULATOR_FIELD_NAMES].sort());
    expect(fields).toMatchObject({ name: 'Ayşe Demir', email: 'AYSE@example.com', phone: '+90 501 000 00 00', company: 'Demir Tekstil', country: 'TR', headcount: '1', durationMonths: '12', message: 'Antalya' });
    expect(fields.trade).toBe('<calc.555> (welder)');
    const summary = fields.estimateSummary as string;
    expect(summary.length).toBeLessThanOrEqual(2000);
    // the model, not the client: 49 545 × 1.2175 = 60 321.04 → 60.321 ₺ (TR), first year 751.852 ₺
    expect(summary).toContain('60.321 ₺');
    expect(summary).toContain('751.852 ₺');
    expect(summary).toContain('[calc.summary.rates]: 2026-01');
  });
  it('recomputes from the hidden inputs and clamps the salary to the role range', () => {
    const fields = toCalculatorFields(
      quoteSchema.parse({ name: 'A', email: 'a@b.co', [ESTIMATE_FIELDS.role]: 'cook', [ESTIMATE_FIELDS.headcount]: '5', [ESTIMATE_FIELDS.months]: '6', [ESTIMATE_FIELDS.salary]: '10' }),
      ctx,
    );
    expect(fields.headcount).toBe('5');
    expect(fields.durationMonths).toBe('6');
    expect(fields.trade).toBe('<calc.548> (cook)');
    expect(fields.estimateSummary).toContain('50.000 ₺'); // cook: max(1.5 × 33 030 = 49 545, salaryMin 50 000)
  });
  it('never exceeds the door cap', () => {
    const fields = toCalculatorFields(quoteSchema.parse({ name: 'A', email: 'a@b.co', message: 'x'.repeat(5000) }), ctx);
    expect((fields.estimateSummary as string).length).toBeLessThanOrEqual(2000);
    expect((fields.message as string).length).toBe(5000);
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/__tests__/pass-check-logic.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { passCheckVerdict, PASS_CHECK_ROWS } from '../pass-check-logic';

describe('passCheckVerdict', () => {
  it('is idle until more than one row is answered (the quota row is always answered)', () => {
    expect(passCheckVerdict({}, true)).toMatchObject({ tone: 'idle', clear: 1, answered: 1, unanswered: 4 });
    expect(passCheckVerdict({ capital: 'yes' }, true)).toMatchObject({ tone: 'progress', clear: 2, answered: 2 });
  });
  it('one "no" is red, one "unsure" without a "no" is amber, five clears is green', () => {
    expect(passCheckVerdict({ capital: 'no', sgk: 'unsure' }, true)).toMatchObject({ tone: 'red', blockers: ['capital'], unsure: ['sgk'] });
    expect(passCheckVerdict({ capital: 'unsure' }, true)).toMatchObject({ tone: 'amber', unsure: ['capital'] });
    expect(passCheckVerdict({ capital: 'yes', sgk: 'yes', salary: 'yes', docs: 'yes' }, true)).toMatchObject({ tone: 'green', clear: 5, progressPct: 100 });
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
    const manuf = buildGuideRows(ROLES, RATE, 'manufacturing', 'en', (id) => id, labels).find((r) => r.key === 'welder')!;
    expect(manuf.employer).toBe('₺58,835 – ₺83,125');
  });
  it('places the bar on the design scale (30 000 → the highest role max) with the minimum-wage tick', () => {
    const rows = buildGuideRows(ROLES, RATE, 'other', 'tr', (id) => id, labels);
    expect(guideScaleMax(ROLES)).toBe(78000);
    const labourer = rows.find((r) => r.key === 'labourer')!;
    expect(labourer.barLeftPct).toBeCloseTo(((33030 - GUIDE_SCALE_MIN) / (78000 - GUIDE_SCALE_MIN)) * 100, 1);
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
  path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);
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
      expect(args(get(tr, `sys.${key}`) as string), key).toEqual(args(get(en, `sys.${key}`) as string));
    }
  });
});
```

- [ ] **Step 2: Run to verify they fail**

`npx vitest run "src/app/[locale]/(site)/hiring-cost-calculator"` → four files fail to resolve `../estimate-inputs`/`../quote`, `../pass-check-logic`, `../salary-guide-rows`, `../calc-labels`.

- [ ] **Step 3: Implement**

`src/messages/en.json` — after the `"form": { … }` object add (inside `"sys"`):

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

`src/messages/tr.json` — same place, the Turkish:

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

Both files stay `npx prettier --check` clean (2-space JSON, the `\n` inside `whatsapp.passCheck` is a JSON escape, not a line break). Keys are identical in both locales; `src/messages/messages.test.ts` proves it.

`src/app/[locale]/(site)/hiring-cost-calculator/calc-labels.ts`:

```ts
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
export function pickLabels<T extends Record<string, string>>(t: (id: string) => string, ids: T): Labels<T> {
  return Object.fromEntries(Object.entries(ids).map(([k, id]) => [k, t(id)])) as Labels<T>;
}

/** Every `sys.*` key this page reads (both locales; asserted by __tests__/sys-keys.test.ts). */
export const CALC_SYS_KEYS = [
  'seo.calc.title', 'seo.calc.description',
  'calc.hero.badge', 'calc.skeleton.activate', 'calc.skeleton.loading',
  'calc.empty.title', 'calc.empty.body',
  'calc.a11y.headcountPresets', 'calc.a11y.industryFilter', 'calc.a11y.jumpNav', 'calc.a11y.decrease', 'calc.a11y.increase',
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
  'calc.summary.sgkTier', 'calc.summary.covered', 'calc.summary.none', 'calc.summary.total', 'calc.summary.rates',
] as const;

/** `1,5` / `1.5` — the bare multiplier number; the templates own the `×`/`katı` wording. */
export function multiplierNumber(m: number, locale: 'tr' | 'en'): string {
  return new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', { maximumFractionDigits: 2 }).format(m);
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/estimate-inputs.ts` (pure, **zod-free** — it is imported by the eager `EstimateFields`/`estimate-store` client modules, so zod must not ride along into the initial bundle; `quote.ts` is the only file that imports zod and it runs on the server):

```ts
import { LIMITS, SGK_TIERS, type SgkTier } from '@/lib/calculator';

/** The estimate state the island writes into hidden inputs; prefixed so no name can ever be
 *  mistaken for (or dropped as) a catalog field — only the ten catalog names leave this file. */
export const ESTIMATE_FIELDS = {
  role: 'est_role', headcount: 'est_headcount', months: 'est_months', salary: 'est_salary',
  tier: 'est_tier', flight: 'est_flight', housing: 'est_housing', support: 'est_support',
  turkishStaff: 'est_turkishStaff',
} as const;

export const MONTH_OPTIONS = [6, 9, 12] as const;
export type Months = (typeof MONTH_OPTIONS)[number];
export const HEADCOUNT_PRESETS = [5, 10, 25, 50] as const;
export const TURKISH_STAFF = { default: 25, step: 5, max: 5000 } as const;
export const DEFAULT_ROLE_KEY = 'welder';

export type EstimateInputs = {
  roleKey: string; headcount: number; months: Months; grossSalary: number | null; sgkTier: SgkTier;
  flight: boolean; housing: boolean; supportOptIn: boolean; turkishStaff: number;
};
export const DEFAULT_INPUTS: EstimateInputs = {
  roleKey: DEFAULT_ROLE_KEY, headcount: 1, months: 12, grossSalary: null, sgkTier: 'other',
  flight: true, housing: false, supportOptIn: false, turkishStaff: TURKISH_STAFF.default,
};

const int = (v: unknown, fallback: number, min: number, max: number) => {
  const n = typeof v === 'number' ? v : parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};
const bool = (v: unknown, fallback: boolean) => (v === '1' || v === true ? true : v === '0' || v === false ? false : fallback);

/** Clamp anything (hidden inputs, store patches) into a valid EstimateInputs — the design's bounds. */
export function sanitizeInputs(raw: Partial<Record<keyof EstimateInputs, unknown>>): EstimateInputs {
  const months = int(raw.months, 12, 1, 12);
  const salary = raw.grossSalary === null || raw.grossSalary === undefined || raw.grossSalary === '' ? null : int(raw.grossSalary, 0, 0, 10_000_000);
  return {
    roleKey: typeof raw.roleKey === 'string' && raw.roleKey ? raw.roleKey.slice(0, 40) : DEFAULT_ROLE_KEY,
    headcount: int(raw.headcount, 1, LIMITS.headcountMin, LIMITS.headcountMax),
    months: (MONTH_OPTIONS as readonly number[]).includes(months) ? (months as Months) : 12,
    grossSalary: salary === 0 ? null : salary,
    sgkTier: (SGK_TIERS as readonly string[]).includes(String(raw.sgkTier)) ? (raw.sgkTier as SgkTier) : 'other',
    flight: bool(raw.flight, true),
    housing: bool(raw.housing, false),
    supportOptIn: bool(raw.supportOptIn, false),
    turkishStaff: int(raw.turkishStaff, TURKISH_STAFF.default, 0, TURKISH_STAFF.max),
  };
}

export function parseEstimateFields(data: Record<string, unknown>): EstimateInputs {
  return sanitizeInputs({
    roleKey: data[ESTIMATE_FIELDS.role], headcount: data[ESTIMATE_FIELDS.headcount],
    months: data[ESTIMATE_FIELDS.months], grossSalary: data[ESTIMATE_FIELDS.salary],
    sgkTier: data[ESTIMATE_FIELDS.tier], flight: data[ESTIMATE_FIELDS.flight],
    housing: data[ESTIMATE_FIELDS.housing], supportOptIn: data[ESTIMATE_FIELDS.support],
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
import { DEFAULT_ROLE_KEY, ESTIMATE_FIELDS, parseEstimateFields, type EstimateInputs } from './estimate-inputs';

const hidden = z.string().max(40).optional();
/** `.min(1)` before `.email()` so an empty value reads `required`, not `email` (kernel rule). */
export const quoteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().min(1).max(254).email(),
  phone: z.string().trim().max(40).refine((v) => v === '' || /(\D*\d){8,}/.test(v), { message: 'phone' }).optional(),
  company: z.string().trim().max(200).optional(),
  country: z.string().trim().max(2).optional(),
  message: z.string().trim().max(5000).optional(),
  [ESTIMATE_FIELDS.role]: hidden, [ESTIMATE_FIELDS.headcount]: hidden, [ESTIMATE_FIELDS.months]: hidden,
  [ESTIMATE_FIELDS.salary]: hidden, [ESTIMATE_FIELDS.tier]: hidden, [ESTIMATE_FIELDS.flight]: hidden,
  [ESTIMATE_FIELDS.housing]: hidden, [ESTIMATE_FIELDS.support]: hidden, [ESTIMATE_FIELDS.turkishStaff]: hidden,
});
export type QuoteInput = z.infer<typeof quoteSchema>;

/** The Ops catalog's `calculator` field names (v1.0) — the only keys ever sent. */
export const CALCULATOR_FIELD_NAMES = [
  'name', 'email', 'phone', 'company', 'country', 'headcount', 'trade', 'durationMonths', 'estimateSummary', 'message',
] as const;
export const ESTIMATE_SUMMARY_MAX = 2000;

export type QuoteContext = {
  locale: Locale;
  roles: CalculatorRole[];
  rateConfig: RateConfig;
  t: (id: string) => string; // makeTf(bundle, locale)
  sys: (key: string, values?: Record<string, string | number>) => string; // getTranslations('sys')
};

const TIER_LABEL_ID: Record<SgkTier, string> = { manufacturing: 'calc.466', other: 'calc.467', none: 'calc.468' };

/** Recomputed on the server from the hidden inputs — the summary never trusts a client total. */
export function buildEstimateSummary(inputs: EstimateInputs, ctx: QuoteContext): { summary: string; role: CalculatorRole; months: number } {
  const { locale, roles, rateConfig, t, sys } = ctx;
  const role = findRole(roles, inputs.roleKey) ?? findRole(roles, DEFAULT_ROLE_KEY) ?? roles[0];
  const est = estimate(
    { role, headcount: inputs.headcount, months: inputs.months, grossSalary: inputs.grossSalary, sgkTier: inputs.sgkTier, flight: inputs.flight, housing: inputs.housing, supportOptIn: inputs.supportOptIn },
    rateConfig,
  );
  const f = formatEstimate(est, locale);
  const covered = [inputs.flight && t('calc.017'), inputs.housing && t('calc.018'), inputs.supportOptIn && t('calc.020')].filter(Boolean).join(' · ') || sys('calc.summary.none');
  const lines = [
    `${sys('calc.summary.role')}: ${t(role.labelId)} (${role.key})`,
    `${sys('calc.summary.workers')}: ${est.input.headcount}`,
    `${sys('calc.summary.contract')}: ${sys('calc.live.nMonths', { months: est.input.months })}`,
    `${sys('calc.summary.salary')}: ${f.grossSalary} ${t('calc.464')}`,
    `${sys('calc.summary.sgkTier')}: ${t(TIER_LABEL_ID[est.input.sgkTier])} (${sgkRateLabel(rateConfig, est.input.sgkTier, locale)})`,
    `${sys('calc.summary.covered')}: ${covered}`,
    `${t('calc.142')}: ${inputs.turkishStaff}`,
    `${t('calc.028')}: ${f.monthly.total}`,
    `${t('calc.034')}: ${f.oneOff.total}`,
    `${sys('calc.summary.total')}: ${f.contract.total} (${sys('calc.live.nMonths', { months: est.input.months })}, ${formatTRY(est.contract.perWorkerPerMonth, locale)} ${t('calc.463')} ${t('calc.464')})`,
    `${sys('calc.summary.rates')}: ${rateConfig.version}`,
  ];
  return { summary: lines.join('\n').slice(0, ESTIMATE_SUMMARY_MAX), role, months: est.input.months };
}

/** Exact catalog names, stable option values (W3): ISO2 upper-case, the role KEY beside its label. */
export function toCalculatorFields(p: QuoteInput, ctx: QuoteContext): Record<(typeof CALCULATOR_FIELD_NAMES)[number], string> {
  const inputs = parseEstimateFields(p as Record<string, unknown>);
  const { summary, role, months } = buildEstimateSummary(inputs, ctx);
  return {
    name: p.name,
    email: p.email,
    phone: p.phone ?? '',
    company: p.company ?? '',
    country: (p.country ?? '').toUpperCase(),
    headcount: String(inputs.headcount),
    trade: `${ctx.t(role.labelId)} (${role.key})`.slice(0, 200),
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
  const value = (row: PassRow): Answer | null => (row === 'quota' ? (quotaOk ? 'yes' : 'no') : (answers[row] ?? null));
  const rows = PASS_CHECK_ROWS.map((row) => ({ row, v: value(row) }));
  const answered = rows.filter((r) => r.v).length;
  const blockers = rows.filter((r) => r.v === 'no').map((r) => r.row);
  const unsure = rows.filter((r) => r.v === 'unsure').map((r) => r.row);
  const clear = rows.filter((r) => r.v === 'yes').length;
  const tone: Tone = blockers.length ? 'red' : unsure.length ? 'amber' : answered === rows.length ? 'green' : answered > 1 ? 'progress' : 'idle';
  return {
    tone, clear, answered, unanswered: rows.length - answered, blockers, unsure,
    progressPct: Math.round((clear / rows.length) * 100), values: Object.fromEntries(rows.map((r) => [r.row, r.v])) as Record<PassRow, Answer | null>,
  };
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/salary-guide-rows.ts`:

```ts
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { employerMonthlyCost, salaryRange, type SgkTier } from '@/lib/calculator';
import { formatTRY } from '@/lib/format/money';

/** The design's bar scale: 30 000 → the highest role maximum (line 2586). */
export const GUIDE_SCALE_MIN = 30000;
export const guideScaleMax = (roles: CalculatorRole[]) => Math.max(...roles.filter((r) => !r.preset).map((r) => r.salaryMax ?? 0));

export type GuideRow = {
  key: string; role: string; industry: NonNullable<CalculatorRole['industry']>; industryLabel: string;
  range: string; employer: string; tier: string; skilled: boolean;
  barLeftPct: number; barWidthPct: number; tickPct: number;
};

/** One row per design role (presets excluded); the floor is the model's exact floor (W2) and the
 *  employer cost follows the chosen SGK tier (W59). Strings are formatted here (D18), nowhere else. */
export function buildGuideRows(
  roles: CalculatorRole[], rateConfig: RateConfig, tier: SgkTier, locale: Locale,
  t: (id: string) => string, labels: { skilled: string; standard: string },
): GuideRow[] {
  const max = guideScaleMax(roles);
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - GUIDE_SCALE_MIN) / (max - GUIDE_SCALE_MIN)) * 100));
  return roles.filter((r): r is CalculatorRole & { industry: NonNullable<CalculatorRole['industry']> } => !r.preset && r.industry !== null).map((r) => {
    const range = salaryRange(r, rateConfig);
    const hi = range.max ?? range.min;
    const left = pct(range.min);
    return {
      key: r.key, role: t(r.labelId), industry: r.industry, industryLabel: r.industryLabelId ? t(r.industryLabelId) : r.industry,
      range: `${formatTRY(range.min, locale)} – ${formatTRY(hi, locale)}`,
      employer: `${formatTRY(employerMonthlyCost(range.min, rateConfig, tier), locale)} – ${formatTRY(employerMonthlyCost(hi, rateConfig, tier), locale)}`,
      tier: r.multiplier > 1 ? labels.skilled : labels.standard, skilled: r.multiplier > 1,
      barLeftPct: left, barWidthPct: Math.max(4, pct(hi) - left), tickPct: pct(rateConfig.legalMinGross),
    };
  });
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/[locale]/(site)/hiring-cost-calculator" src/messages` → 4 new files green (12 tests) + `messages.test.ts` green (identical key sets). `npm run verify` → green (`quote.ts` imports nothing server-only; `ESTIMATE_FIELDS` computed keys in `z.object` type-check because the values are string literals).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator" src/messages/tr.json src/messages/en.json
git commit -m "feat(calc): sys.calc copy (21 live ICU templates, badges, summary), quote mapping to the calculator catalog, pass-check + salary-guide logic (T3 c2)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — The calculator card: shared store, lazy island, skeleton, the interactive island (W13 amended)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hiring-cost-calculator/__tests__/estimate-store.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_INPUTS } from '../estimate-inputs';
import { getEstimateInputs, resetEstimateInputs, setEstimateInputs, subscribeEstimate } from '../_components/estimate-store';

describe('estimate store', () => {
  it('starts at the design defaults, clamps patches and notifies subscribers once per set', () => {
    resetEstimateInputs();
    expect(getEstimateInputs()).toEqual(DEFAULT_INPUTS);
    let calls = 0;
    const off = subscribeEstimate(() => calls++);
    setEstimateInputs({ headcount: 9999, turkishStaff: -3, months: 9 });
    expect(getEstimateInputs()).toMatchObject({ headcount: 500, turkishStaff: 0, months: 9, roleKey: 'welder' });
    expect(calls).toBe(1);
    off();
    setEstimateInputs({ headcount: 2 });
    expect(calls).toBe(1);
    resetEstimateInputs();
  });
});
```

`src/app/[locale]/(site)/hiring-cost-calculator/__tests__/CalculatorIsland.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import { makeTf } from '@/content/pure';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { renderWithIntl } from '@/test/render';
import { CalculatorIsland } from '../_components/CalculatorIsland';
import { resetEstimateInputs } from '../_components/estimate-store';
import { CARD_IDS, pickLabels } from '../calc-labels';

const track = vi.fn();
vi.mock('@/analytics/track', () => ({ track: (...args: unknown[]) => track(...args) }));
vi.mock('next/navigation', () => ({ usePathname: () => '/maliyet-hesaplayici' }));
vi.mock('@/analytics/ContactLink', () => ({
  ContactLink: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

// The generated TR bundle read the way lint.test.ts reads it (readFileSync, never an import — R56).
const bundle = BundleSchema.parse(JSON.parse(readFileSync('src/content/local/bundle.tr.json', 'utf8')));
const t = makeTf(bundle, 'tr');
const labels = pickLabels(t, CARD_IDS);
const roleLabels = Object.fromEntries(ROLES.map((r) => [r.key, t(r.labelId)]));
const industryLabels = Object.fromEntries(ROLES.filter((r) => r.industryLabelId).map((r) => [r.industry, t(r.industryLabelId!)]));

const mount = () =>
  renderWithIntl(
    <CalculatorIsland locale="tr" rateConfig={RATE} roles={ROLES} labels={labels} roleLabels={roleLabels} industryLabels={industryLabels} whatsappNumber="905011240340" onReady={() => {}} />,
    { locale: 'tr' },
  );

afterEach(() => { resetEstimateInputs(); track.mockClear(); });

describe('CalculatorIsland', () => {
  it('renders the model at the defaults: welder × 1, 12 months, other tier (W2 — 49 545 floor)', () => {
    mount();
    expect(screen.getByTestId('calc-monthly-total')).toHaveTextContent('60.321 ₺');
    expect(screen.getByTestId('calc-year-total')).toHaveTextContent('751.852 ₺');
    expect(screen.getByTestId('calc-threshold')).toHaveTextContent('49.545 ₺');
    expect(screen.getByRole('slider', { name: t('calc.015') })).toHaveAttribute('min', '49545');
  });
  it('a headcount preset multiplies the totals and fires calculator_use with enum-safe params only', () => {
    mount();
    fireEvent.click(screen.getByLabelText('5', { selector: 'input[type="radio"]' }));
    expect(screen.getByTestId('calc-monthly-total')).toHaveTextContent('301.605 ₺');
    expect(track).toHaveBeenLastCalledWith('calculator_use', { page: '/maliyet-hesaplayici', locale: 'tr', role: 'welder', headcount: 5 });
  });
  it('minimum-wage support is opt-in and shown as a deduction (W2/W58)', () => {
    mount();
    fireEvent.click(screen.getByLabelText('5', { selector: 'input[type="radio"]' }));
    fireEvent.click(screen.getByRole('checkbox', { name: new RegExp(t('calc.020')) }));
    expect(screen.getByTestId('calc-monthly-total')).toHaveTextContent('295.255 ₺');
  });
  it('a 6-month season shows the seasonal note and the season title', () => {
    mount();
    fireEvent.click(screen.getByLabelText(t('calc.471'), { selector: 'input[type="radio"]' }));
    expect(screen.getByTestId('calc-seasonal')).toBeInTheDocument();
    expect(screen.getByTestId('calc-total-title')).toHaveTextContent('6 aylık sezon toplamı');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

`npx vitest run "src/app/[locale]/(site)/hiring-cost-calculator"` → the two new files fail: `Failed to resolve import "../_components/estimate-store"` / `"../_components/CalculatorIsland"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hiring-cost-calculator/_components/estimate-store.ts` (no directive; imported by client components only):

```ts
import { useSyncExternalStore } from 'react';
import { DEFAULT_INPUTS, sanitizeInputs, type EstimateInputs } from '../estimate-inputs';

/** The page's one shared client state: the calculator writes it, the quota gate / pass check /
 *  recap / hidden form fields read it. Module-level on purpose — every island is a leaf that
 *  mounts on its own trigger (W13), so React context cannot span them. Server snapshot = the
 *  defaults (the SSR'd skeleton shows exactly those), so hydration never mismatches. */
let state: EstimateInputs = DEFAULT_INPUTS;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const getEstimateInputs = () => state;
const getServerSnapshot = () => DEFAULT_INPUTS;
export function setEstimateInputs(patch: Partial<EstimateInputs>) {
  state = sanitizeInputs({ ...state, ...patch });
  notify();
}
export function resetEstimateInputs() {
  state = DEFAULT_INPUTS;
  notify();
}
export function subscribeEstimate(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function useEstimateInputs(): EstimateInputs {
  return useSyncExternalStore(subscribeEstimate, getEstimateInputs, getServerSnapshot);
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/card-view.ts` (pure; used by the server skeleton and the client island):

```ts
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { estimate, findRole, formatEstimate, salaryRange, sgkRateLabel, turkishStaffRequired, type FormattedEstimate } from '@/lib/calculator';
import { formatInt, formatTRY } from '@/lib/format/money';
import { multiplierNumber, type CardLabels } from './calc-labels';
import { DEFAULT_ROLE_KEY, type EstimateInputs } from './estimate-inputs';

export type SysT = (key: string, values?: Record<string, string | number>) => string;

export type CardView = {
  role: CalculatorRole; roleLabel: string; industryLabel: string; roleRangeLabel: string;
  headcount: number; headcountNote: string; monthsNote: string;
  salary: number; salaryMin: number; salaryMax: number; salaryLabel: string; salaryMinLabel: string; salaryMaxLabel: string; thresholdNote: string;
  sgkRate: string; f: FormattedEstimate; seasonal: boolean; perMonthPerWorker: string; totalTitle: string; yearNote: string;
  quotaNeeded: number; whatsappText: string;
};

export function computeCardView(
  inputs: EstimateInputs, roles: CalculatorRole[], rateConfig: RateConfig, locale: Locale,
  labels: CardLabels, roleLabels: Record<string, string>, industryLabels: Record<string, string>, sys: SysT,
): CardView {
  const role = findRole(roles, inputs.roleKey) ?? findRole(roles, DEFAULT_ROLE_KEY) ?? roles[0];
  const range = salaryRange(role, rateConfig);
  const salaryMax = range.max ?? range.min;
  const est = estimate(
    { role, headcount: inputs.headcount, months: inputs.months, grossSalary: inputs.grossSalary, sgkTier: inputs.sgkTier, flight: inputs.flight, housing: inputs.housing, supportOptIn: inputs.supportOptIn },
    rateConfig,
  );
  const f = formatEstimate(est, locale);
  const months = est.input.months;
  const head = est.input.headcount;
  const roleLabel = roleLabels[role.key] ?? role.key;
  return {
    role, roleLabel, industryLabel: role.industry ? (industryLabels[role.industry] ?? role.industry) : '',
    roleRangeLabel: `${formatTRY(range.min, locale)} – ${formatTRY(salaryMax, locale)}`,
    headcount: head, headcountNote: head === 1 ? labels.perWorker : sys('calc.live.forWorkers', { n: head }),
    monthsNote: months === 12 ? labels.fullYear : sys('calc.live.nMonths', { months }),
    salary: est.input.grossSalary, salaryMin: range.min, salaryMax,
    salaryLabel: `${f.grossSalary} ${labels.perMonthSuffix}`, salaryMinLabel: formatTRY(range.min, locale), salaryMaxLabel: formatTRY(salaryMax, locale),
    // W2: the exact floor (legalMinGross × multiplier), never rounded to 50 000
    thresholdNote: sys('calc.live.threshold', { amount: formatTRY(rateConfig.legalMinGross * role.multiplier, locale), multiplier: multiplierNumber(role.multiplier, locale) }),
    sgkRate: sgkRateLabel(rateConfig, est.input.sgkTier, locale), f,
    seasonal: months < 12, perMonthPerWorker: `${formatTRY(est.contract.perWorkerPerMonth, locale)} ${labels.perMonthSuffix}`,
    totalTitle: months === 12 ? labels.firstYear : sys('calc.live.seasonTotal', { months }),
    yearNote: sys('calc.live.yearNote', { months, headcount: head }),
    quotaNeeded: turkishStaffRequired(head, rateConfig.quotaRatio),
    whatsappText: sys('calc.whatsapp.quote', { headcount: formatInt(head, locale), role: roleLabel, salary: f.grossSalary, months }),
  };
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/LazyIsland.tsx`:

```tsx
'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

export type LazyTrigger = 'interaction' | 'view';

/**
 * W13 amended: heavy islands never join the initial script graph. The server-rendered `fallback`
 * (the same markup at the defaults) stays until the trigger fires — the first pointer/focus/key
 * inside the region, or the region scrolling within 240 px of the viewport — then `render`
 * mounts the `next/dynamic({ ssr: false })` island, and the fallback is removed only once that
 * island reports ready, so the card never blanks. `hash` also fires the load when the page opens
 * at (or navigates to) that anchor — the header CTA points at `#calculator` (W17).
 */
export function LazyIsland({
  trigger, hash, fallback, render, className, testId,
}: {
  trigger: LazyTrigger; hash?: string; fallback: ReactNode; render: (onReady: () => void) => ReactNode; className?: string; testId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const activate = useCallback(() => setActive(true), []);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (hash) {
      const check = () => { if (window.location.hash === hash) setActive(true); };
      check();
      window.addEventListener('hashchange', check);
      if (window.location.hash === hash) return () => window.removeEventListener('hashchange', check);
      if (trigger !== 'view') return () => window.removeEventListener('hashchange', check);
    }
    if (trigger !== 'view') return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver !== 'function') { setActive(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setActive(true); io.disconnect(); }
    }, { rootMargin: '240px 0px' });
    io.observe(node);
    return () => io.disconnect();
  }, [hash, trigger]);

  const listening = trigger === 'interaction' && !active;
  return (
    <div
      ref={ref}
      data-testid={testId}
      data-island={ready ? 'ready' : active ? 'loading' : 'idle'}
      className={className}
      onPointerDown={listening ? activate : undefined}
      onFocusCapture={listening ? activate : undefined}
      onKeyDown={listening ? activate : undefined}
    >
      {!ready && fallback}
      {active && render(onReady)}
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateBreakdown.tsx` (no hooks, no directive — rendered by the server skeleton and the client island alike):

```tsx
import type { ReactNode } from 'react';
import type { CardLabels } from '../calc-labels';
import type { CardView } from '../card-view';

const Row = ({ label, note, value, tone }: { label: string; note?: string; value: string; tone?: 'green' }) => (
  <div className="flex items-baseline justify-between gap-3 py-2">
    <span className={tone === 'green' ? 'text-success-text' : 'text-text-secondary'}>
      {label}{note ? <span className="ml-1 text-body-sm text-muted">{note}</span> : null}
    </span>
    <span className={['font-extrabold', tone === 'green' ? 'text-success-text' : 'text-ink'].join(' ')}>{value}</span>
  </div>
);
const Box = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="mb-3 rounded-base border border-tint-border bg-white px-5 py-5">
    <p className="m-0 mb-2 text-body-sm font-extrabold uppercase tracking-[0.6px] text-muted">{title}</p>
    {children}
  </div>
);

/** The right column of the design's card (lines 686–736): monthly box, one-off box, gradient total. */
export function EstimateBreakdown({ view, labels, inputs, className, cta }: {
  view: CardView; labels: CardLabels; inputs: { flight: boolean; housing: boolean; supportOptIn: boolean }; className?: string; cta?: ReactNode;
}) {
  const { f } = view;
  return (
    <div className={className}>
      <Box title={labels.cMonthly}>
        <Row label={labels.cGross} value={f.monthly.gross} />
        <Row label={labels.cSgkEmp} note={`(${view.sgkRate})`} value={f.monthly.sgk} />
        {inputs.housing && <Row label={labels.cAcc} value={f.monthly.housing} />}
        {inputs.supportOptIn && <Row label={labels.cSupport} note={labels.cState} value={`− ${f.monthly.support}`} tone="green" />}
        <div className="mt-1.5 flex items-baseline justify-between gap-3 border-t border-border-3 pt-3">
          <span className="font-extrabold">{labels.cMonthlyTotal}</span>
          <span data-testid="calc-monthly-total" className="text-card-title font-extrabold text-blue">{f.monthly.total}</span>
        </div>
      </Box>
      <Box title={labels.cOneOffY1}>
        <Row label={labels.cPermitFees} note={labels.cState} value={f.oneOff.permitFee} />
        {inputs.flight && <Row label={labels.cFlightTravel} value={f.oneOff.flight} />}
        <Row label={labels.cServiceFee} value={labels.cQuotedWritten} />
        {view.seasonal && (
          <p data-testid="calc-seasonal" className="m-0 mt-2 rounded-xs border border-warning-border bg-warning-surface px-3 py-2.5 text-body-sm text-warning-text">
            {labels.sea1}{view.perMonthPerWorker}{labels.sea2}
          </p>
        )}
        <div className="mt-1.5 flex items-baseline justify-between gap-3 border-t border-border-3 pt-3">
          <span className="font-extrabold">{labels.cOneOffTotal}</span>
          <span className="text-card-title font-extrabold text-[#253063]">{f.oneOff.total}</span>
        </div>
      </Box>
      <div className="mt-auto rounded-base bg-[linear-gradient(135deg,#1899d5_0%,#1073a8_100%)] px-5 py-5 text-white">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <span data-testid="calc-total-title" className="font-extrabold text-white/90">{view.totalTitle}</span>
          <span data-testid="calc-year-total" aria-live="polite" className="text-[26px] font-extrabold tracking-[-0.6px] xl:text-[19.5px]">{f.contract.total}</span>
        </div>
        <p className="m-0 mb-3 text-body-sm text-white/80">{view.yearNote} {labels.cFeeNote}</p>
        {cta}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorSkeleton.tsx` (no hooks — the `fallback` the page server-renders; mirrors the island's layout with the defaults as text and one real control, the activate button, so keyboard users can also fire the load):

```tsx
import { buttonClassName } from '@/design/primitives';
import type { CardLabels } from '../calc-labels';
import type { CardView } from '../card-view';
import { EstimateBreakdown } from './EstimateBreakdown';

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="mb-2 flex items-baseline justify-between gap-3"><span className="text-body-sm font-extrabold">{label}</span><span className="font-extrabold text-blue-safe">{value}</span></div>
  </div>
);

export function CalculatorSkeleton({ view, labels, inputs, activateLabel, loadingLabel, tierLabel }: {
  view: CardView; labels: CardLabels; inputs: { flight: boolean; housing: boolean; supportOptIn: boolean }; activateLabel: string; loadingLabel: string; tierLabel: string;
}) {
  return (
    <div data-testid="calc-skeleton" className="grid md:grid-cols-[1fr_1.05fr]">
      <div className="border-border-3 px-5 py-6 md:border-r xl:px-[25px] xl:py-[22px]">
        <p className="m-0 mb-4 text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{labels.cReq}</p>
        <div className="flex flex-col gap-4">
          <Field label={labels.cProfession} value={`${view.roleLabel} · ${view.industryLabel}`} />
          <Field label={labels.cWorkers} value={String(view.headcount)} />
          <Field label={labels.cContract} value={view.monthsNote} />
          <Field label={labels.cSalary} value={view.salaryLabel} />
          <p data-testid="calc-threshold" className="m-0 text-body-sm text-text-tertiary">{view.thresholdNote}</p>
          <Field label={labels.cSgkDisc} value={`${tierLabel} · ${view.sgkRate}`} />
          <button type="button" className={buttonClassName('primary', 'lg', 'w-full')} data-testid="calc-activate">
            {activateLabel}
          </button>
          <p className="sr-only" aria-live="polite">{loadingLabel}</p>
        </div>
      </div>
      <div className="flex flex-col bg-pale-2 px-5 py-6 xl:px-[25px] xl:py-[22px]">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{labels.cEst}</span>
          <span className="text-body-sm font-extrabold text-blue-safe">{view.headcountNote}</span>
        </div>
        <EstimateBreakdown view={view} labels={labels} inputs={inputs} />
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorLoader.tsx`:

```tsx
'use client';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import type { CalculatorIslandProps } from './CalculatorIsland';
import { LazyIsland } from './LazyIsland';

// ssr:false + interaction trigger: the island's chunk (RangeSlider, Stepper, RadioChips,
// BottomSheet, PrintButton, the engine) is fetched on the first touch of the card, so it never
// counts in the Lighthouse script audit (W13 amended). The page passes the server-rendered
// skeleton as `fallback`.
const CalculatorIsland = dynamic(() => import('./CalculatorIsland').then((m) => m.CalculatorIsland), { ssr: false });

export function CalculatorLoader({ fallback, ...props }: Omit<CalculatorIslandProps, 'onReady'> & { fallback: ReactNode }) {
  return (
    <LazyIsland
      trigger="interaction"
      hash="#calculator"
      testId="calc-card"
      fallback={fallback}
      render={(onReady) => <CalculatorIsland {...props} onReady={onReady} />}
    />
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/CalculatorIsland.tsx`:

```tsx
'use client';
import { useLayoutEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { track } from '@/analytics/track';
import type { CalculatorRole, RateConfig } from '@/content/collections';
import { BottomSheet, PrintButton, RangeSlider, Stepper } from '@/design/islands';
import { RadioChips, buttonClassName } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { LIMITS, SGK_TIERS, type SgkTier } from '@/lib/calculator';
import { waLink } from '@/lib/contact';
import { formatInt } from '@/lib/format/money';
import type { CardLabels } from '../calc-labels';
import { computeCardView } from '../card-view';
import { HEADCOUNT_PRESETS, MONTH_OPTIONS, type Months } from '../estimate-inputs';
import { EstimateBreakdown } from './EstimateBreakdown';
import { setEstimateInputs, useEstimateInputs } from './estimate-store';

export type CalculatorIslandProps = {
  locale: Locale; rateConfig: RateConfig; roles: CalculatorRole[]; labels: CardLabels;
  roleLabels: Record<string, string>; industryLabels: Record<string, string>; whatsappNumber: string; onReady: () => void;
};

const Label = ({ children, value }: { children: string; value?: string }) => (
  <div className="mb-2 flex items-baseline justify-between gap-3">
    <span className="text-body-sm font-extrabold">{children}</span>
    {value && <span className="font-extrabold text-blue-safe">{value}</span>}
  </div>
);
const Toggle = ({ id, label, note, checked, onChange }: { id: string; label: string; note?: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label htmlFor={id} className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3">
    <span className="font-bold text-text-secondary">{label}{note ? <span className="ml-1 font-semibold text-muted">{note}</span> : null}</span>
    <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-[18px] w-[18px] shrink-0 accent-blue" />
  </label>
);

export function CalculatorIsland({ locale, rateConfig, roles, labels, roleLabels, industryLabels, whatsappNumber, onReady }: CalculatorIslandProps) {
  const sys = useTranslations('sys');
  const pathname = usePathname(); // R35: the real URL, never next-intl's internal key
  const uiLocale = useLocale();
  const inputs = useEstimateInputs();
  const [sheet, setSheet] = useState(false);
  const [sheetIndustry, setSheetIndustry] = useState<'all' | string>('all');
  const [advanced, setAdvanced] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ssr:false island: runs once after the first client paint, hands the card over from the skeleton
  useLayoutEffect(() => onReady(), []);

  const view = computeCardView(inputs, roles, rateConfig, locale, labels, roleLabels, industryLabels, (k, v) => sys(k, v));
  const use = (role: string, headcount: number) => track('calculator_use', { page: pathname ?? '/', locale: uiLocale, role, headcount });
  const pickRole = (roleKey: string) => { setEstimateInputs({ roleKey, grossSalary: null }); use(roleKey, inputs.headcount); };
  const pickHeadcount = (headcount: number) => { setEstimateInputs({ headcount }); use(inputs.roleKey, headcount); };
  const designRoles = roles.filter((r) => !r.preset);
  const industries = [...new Set(designRoles.map((r) => r.industry).filter((i): i is NonNullable<typeof i> => i !== null))];
  const tierLabel: Record<SgkTier, string> = { manufacturing: labels.tierManuf, other: labels.tierOther, none: labels.tierNone };
  const advancedCls = advanced ? '' : 'max-md:hidden';

  return (
    <div data-testid="calc-island" className="grid md:grid-cols-[1fr_1.05fr]">
      <div className="border-border-3 px-5 py-6 md:border-r xl:px-[25px] xl:py-[22px]">
        <p className="m-0 mb-4 text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{labels.cReq}</p>
        {/* mobile snapshot (design .ja-cc-snap) */}
        <div className="mb-4 rounded-sm bg-[linear-gradient(135deg,#16202e_0%,#253063_100%)] p-4 text-white md:hidden">
          <div className="flex items-baseline justify-between gap-2 text-[11px] font-extrabold uppercase tracking-[1px]"><span className="text-sky">{view.totalTitle}</span><span className="text-white/60">{view.headcountNote}</span></div>
          <p className="my-2 text-[29px] font-extrabold leading-[1.05] tracking-[-1.2px]">{view.f.contract.total}</p>
          <div className="grid grid-cols-2 gap-2">
            {[[labels.cPerMonth, view.f.monthly.total], [labels.cOneOff, view.f.oneOff.total]].map(([k, v]) => (
              <div key={k} className="rounded-xs border border-white/15 bg-white/10 px-2.5 py-2"><p className="m-0 text-[10.5px] font-extrabold uppercase tracking-[0.8px] text-white/55">{k}</p><p className="m-0 font-extrabold">{v}</p></div>
            ))}
          </div>
          <a href="#quote" className="mt-2.5 flex min-h-[50px] items-center justify-center rounded-xs bg-white font-extrabold text-navy">{labels.cQuoteArrow}</a>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="calc-role" className="hidden md:block">
              <Label>{labels.cProfession}</Label>
              <select id="calc-role" value={view.role.key} onChange={(e) => pickRole(e.target.value)} className="w-full rounded-input border-[1.5px] border-border-1 bg-white px-4 py-3 font-bold text-ink focus-visible:border-blue focus-visible:outline-none">
                {designRoles.map((r) => (<option key={r.key} value={r.key}>{roleLabels[r.key]} · {r.industry ? industryLabels[r.industry] : ''}</option>))}
              </select>
            </label>
            <div className="md:hidden">
              <Label>{labels.cProfession}</Label>
              <button type="button" onClick={() => { setSheetIndustry('all'); setSheet(true); }} aria-haspopup="dialog" className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-xs border-[1.5px] border-border-1 bg-white px-3.5 py-2.5 text-left">
                <span className="flex min-w-0 flex-col"><span className="truncate text-body font-extrabold">{view.roleLabel}</span><span className="text-body-sm font-bold text-text-tertiary">{view.industryLabel} · {view.roleRangeLabel}</span></span>
                <span aria-hidden="true" className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-input bg-tint text-body-sm font-extrabold text-blue-safe">▼</span>
              </button>
              <BottomSheet open={sheet} onClose={() => setSheet(false)} title={labels.sheetPick} closeLabel={sys('nav.close')}>
                <div role="group" aria-label={sys('calc.a11y.industryFilter')} className="mb-3 flex gap-2 overflow-x-auto pb-1">
                  {['all', ...industries].map((i) => (
                    <button key={i} type="button" aria-pressed={sheetIndustry === i} onClick={() => setSheetIndustry(i)} className={['min-h-[38px] shrink-0 rounded-pill border-[1.5px] px-3.5 text-body-sm font-extrabold', sheetIndustry === i ? 'border-blue bg-blue text-white' : 'border-border-1 bg-white text-text-secondary'].join(' ')}>
                      {i === 'all' ? labels.allShort : industryLabels[i]}
                    </button>
                  ))}
                </div>
                {designRoles.filter((r) => sheetIndustry === 'all' || r.industry === sheetIndustry).map((r) => (
                  <button key={r.key} type="button" aria-pressed={r.key === view.role.key} onClick={() => { pickRole(r.key); setSheet(false); }} className={['mb-1.5 flex min-h-[58px] w-full items-center justify-between gap-3 rounded-xs border-[1.5px] px-3 py-2.5 text-left', r.key === view.role.key ? 'border-blue bg-pale-3' : 'border-border-3 bg-white'].join(' ')}>
                    <span className="flex flex-col"><span className="font-extrabold">{roleLabels[r.key]}</span><span className="text-body-sm text-text-tertiary">{r.industry ? industryLabels[r.industry] : ''}</span></span>
                    <span className="text-body-sm font-bold text-text-secondary">{r.key === view.role.key ? '✓' : ''}</span>
                  </button>
                ))}
              </BottomSheet>
            </div>
          </div>
          <div>
            <Label value={String(view.headcount)}>{labels.cWorkers}</Label>
            <div className="flex flex-wrap items-center gap-2.5">
              <Stepper id="calc-headcount" label={labels.cWorkers} value={view.headcount} onChange={pickHeadcount} min={LIMITS.headcountMin} max={LIMITS.headcountMax} decrementLabel={sys('calc.a11y.decrease', { step: 1 })} incrementLabel={sys('calc.a11y.increase', { step: 1 })} className="shrink-0" />
              <RadioChips name="calc-headcount-preset" legend={sys('calc.a11y.headcountPresets')} legendHidden value={(HEADCOUNT_PRESETS as readonly number[]).includes(view.headcount) ? String(view.headcount) : null} onChange={(v) => pickHeadcount(Number(v))} options={HEADCOUNT_PRESETS.map((n) => ({ value: String(n), label: String(n) }))} />
            </div>
            <a href="#quota" className="mt-3 flex items-start gap-2.5 rounded-xs border border-border-4 bg-pale-2 px-3.5 py-2.5 text-body-sm text-text-secondary no-underline hover:border-tint-border hover:bg-tint">
              <span>
                <strong className="font-extrabold text-ink">{labels.cQuotaQ1}{view.headcount}{labels.cQuotaQ2}</strong>{' '}
                <span className="hidden md:inline">{labels.cQuotaD1}<strong className="font-extrabold text-ink"> {view.quotaNeeded} {labels.cQuotaStaff} </strong>{labels.cQuotaD2}</span>
                <span className="md:hidden">{labels.cQuotaM1}<strong className="font-extrabold text-ink"> {view.quotaNeeded} {labels.cQuotaStaffShort} </strong>{labels.cQuotaM2}</span>
                {' '}<span className="font-extrabold text-blue-safe">{labels.cQuotaLink}</span>
              </span>
            </a>
          </div>
          <div className={advancedCls}>
            <Label value={view.monthsNote}>{labels.cContract}</Label>
            <RadioChips name="calc-months" legend={labels.cContract} legendHidden value={String(inputs.months)} onChange={(v) => setEstimateInputs({ months: Number(v) as Months })} options={MONTH_OPTIONS.map((m) => ({ value: String(m), label: m === 6 ? labels.chip6 : m === 9 ? labels.chip9 : labels.chip12 }))} />
          </div>
          <div className={advancedCls}>
            <RangeSlider id="calc-salary" label={labels.cSalary} min={view.salaryMin} max={view.salaryMax} step={500} value={view.salary} onChange={(v) => setEstimateInputs({ grossSalary: v })} formatValue={() => view.salaryLabel} minLabel={view.salaryMinLabel} maxLabel={view.salaryMaxLabel} hint={view.thresholdNote} />
            <p data-testid="calc-threshold" hidden>{view.thresholdNote}</p>
          </div>
          <div className={['flex flex-col gap-1 border-t border-border-3 pt-3', advancedCls].join(' ')}>
            <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{labels.cCover}</p>
            <Toggle id="calc-flight" label={labels.cFlight} checked={inputs.flight} onChange={(v) => setEstimateInputs({ flight: v })} />
            <Toggle id="calc-housing" label={labels.cAcc} note={labels.cAccNote} checked={inputs.housing} onChange={(v) => setEstimateInputs({ housing: v })} />
            <Toggle id="calc-support" label={labels.cSupport} note={labels.cSupportNote} checked={inputs.supportOptIn} onChange={(v) => setEstimateInputs({ supportOptIn: v })} />
          </div>
          <div className={['border-t border-border-3 pt-3', advancedCls].join(' ')}>
            <Label value={view.sgkRate}>{labels.cSgkDisc}</Label>
            <RadioChips name="calc-tier" legend={labels.cSgkDisc} legendHidden value={inputs.sgkTier} onChange={(v) => setEstimateInputs({ sgkTier: v as SgkTier })} options={SGK_TIERS.map((tier) => ({ value: tier, label: tierLabel[tier] }))} />
          </div>
          <button type="button" aria-expanded={advanced} onClick={() => setAdvanced((v) => !v)} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xs border-[1.5px] border-dashed border-tint-border bg-pale-1 text-body-sm font-extrabold text-blue-safe md:hidden">
            {advanced ? labels.advFew : labels.advMore}
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-pale-2 px-5 py-6 xl:px-[25px] xl:py-[22px]">
        <button type="button" aria-expanded={breakdown} onClick={() => setBreakdown((v) => !v)} className="mb-3 flex min-h-[48px] w-full items-center justify-between gap-2 rounded-xs border-[1.5px] border-tint-border bg-white px-4 font-extrabold md:hidden">
          <span>{breakdown ? labels.brkHide : labels.brkShow}</span><span aria-hidden="true">{breakdown ? '−' : '+'}</span>
        </button>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{labels.cEst}</span>
          <span className="text-body-sm font-extrabold text-blue-safe">{view.headcountNote}</span>
        </div>
        <EstimateBreakdown
          view={view} labels={labels} inputs={inputs} className={['flex grow flex-col', breakdown ? '' : 'max-md:[&>div:not(:last-child)]:hidden'].join(' ')}
          cta={
            <div className="print-hidden flex flex-wrap gap-2">
              <a href="#quote" className={buttonClassName('secondary', 'md', 'flex-1')}>{labels.cQuoteBtn}</a>
              <ContactLink href={waLink(whatsappNumber, view.whatsappText)} placement="page_cta" target="_blank" rel="noopener noreferrer" className={buttonClassName('inverse')}>{labels.sWa}</ContactLink>
              <PrintButton label={labels.cPrint} variant="inverse" />
            </div>
          }
        />
      </div>
      <p className="sr-only" aria-live="polite">{formatInt(view.headcount, locale)} · {view.f.contract.total}</p>
    </div>
  );
}
```

Page wiring (replace the `{/* cycle 3 … */}` comment in `page.tsx`; imports are consolidated in Cycle 5's full listing):

```tsx
          <div id="calculator" className="print-isolate mx-auto max-w-[1080px] scroll-mt-5 overflow-hidden rounded-xl border border-tint-border bg-white shadow-[0_24px_60px_rgba(22,60,90,0.14)]">
            {roles.length === 0 ? (
              <EmptyState testId="calc-empty" title={sys('calc.empty.title')} body={sys('calc.empty.body')} cta={{ label: t('calc.105'), href: '#quote' }} />
            ) : (
              <>
                <CalculatorLoader
                  locale={locale} rateConfig={rateConfig} roles={roles} labels={cardLabels} roleLabels={roleLabels} industryLabels={industryLabels}
                  whatsappNumber={bundle.settings.whatsappNumber}
                  fallback={<CalculatorSkeleton view={defaultView} labels={cardLabels} inputs={DEFAULT_INPUTS} tierLabel={cardLabels.tierOther} activateLabel={sys('calc.skeleton.activate')} loadingLabel={sys('calc.skeleton.loading')} />}
                />
                <p className="m-0 border-t border-border-4 bg-pale-1 px-5 py-3 text-body-sm text-text-tertiary xl:px-[25px]">{t('calc.040')}</p>
              </>
            )}
          </div>
```

with, before `return`:

```tsx
  const roles = getCollection(bundle, 'calculatorRoles');
  const cardLabels = pickLabels(t, CARD_IDS);
  const roleLabels = Object.fromEntries(roles.map((r) => [r.key, t(r.labelId)]));
  const industryLabels = Object.fromEntries(roles.filter((r) => r.industryLabelId && r.industry).map((r) => [r.industry as string, t(r.industryLabelId as string)]));
  const sysT = (key: string, values?: Record<string, string | number>) => sys(key, values);
  const defaultView = roles.length ? computeCardView(DEFAULT_INPUTS, roles, rateConfig, locale, cardLabels, roleLabels, industryLabels, sysT) : null;
```

(`defaultView` is non-null on the branch that uses it; type it with `!` at the call or guard with `roles.length && defaultView`.)

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/[locale]/(site)/hiring-cost-calculator"` → 6 files green (the island tests exercise the real WP2a `RangeSlider`/`Stepper`/`RadioChips`/`BottomSheet`; `PrintButton` renders a button, never prints under jsdom). `npm run verify` green. `next build` → the route's first-load JS lists no `CalculatorIsland` chunk (it is a separate lazy chunk). Manual check on `next start -p 3100`: `/maliyet-hesaplayici` shows the skeleton; clicking "Tahmini düzenleyin" swaps in the island with identical totals; `/maliyet-hesaplayici#calculator` mounts it immediately.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator"
git commit -m "feat(calc): the calculator card — shared estimate store, interaction-loaded island over the W2 engine, server skeleton, print isolation (T3 c3)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — Content sections: jump chips, collapsible sections, basis, salary guide island, compare, quota gate island + Gate 2 + exemptions, pass check island, incentives, penalties, students, FAQ

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/hiring-cost-calculator/__tests__/QuotaGateIsland.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import { makeTf } from '@/content/pure';
import { RATE } from '@/lib/calculator/__tests__/fixtures';
import { renderWithIntl } from '@/test/render';
import { QuotaGateIsland } from '../_components/QuotaGateIsland';
import { resetEstimateInputs, setEstimateInputs } from '../_components/estimate-store';
import { QUOTA_IDS, pickLabels } from '../calc-labels';

const bundle = BundleSchema.parse(JSON.parse(readFileSync('src/content/local/bundle.tr.json', 'utf8')));
const t = makeTf(bundle, 'tr');
const labels = pickLabels(t, QUOTA_IDS);
afterEach(resetEstimateInputs);

describe('QuotaGateIsland', () => {
  it('25 Turkish staff → 5 places, an exact fit, the plan within quota', () => {
    renderWithIntl(<QuotaGateIsland locale="tr" quotaRatio={RATE.quotaRatio} labels={labels} onReady={() => {}} />, { locale: 'tr' });
    expect(screen.getByTestId('quota-allowed')).toHaveTextContent('5 yabancı işçi');
    expect(screen.getByTestId('quota-msg')).toHaveTextContent(t('calc.428'));
    expect(screen.getByTestId('quota-viz-note')).toHaveTextContent('25 çalışan tam olarak 5 grup eder');
    expect(screen.getByTestId('quota-vs-plan')).toHaveTextContent(t('calc.429'));
  });
  it('9 staff → 1 place + a partial block; 3 workers planned → over by 2, 6 more needed', () => {
    setEstimateInputs({ headcount: 3 });
    renderWithIntl(<QuotaGateIsland locale="tr" quotaRatio={RATE.quotaRatio} labels={labels} onReady={() => {}} />, { locale: 'tr' });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '9' } });
    expect(screen.getByTestId('quota-allowed')).toHaveTextContent('1 yabancı işçi');
    expect(screen.getByTestId('quota-viz-note')).toHaveTextContent('1 tam grup artı 4 artık çalışan — 1 kişi daha');
    expect(screen.getByTestId('quota-vs-plan')).toHaveTextContent('2 kişi fazla. 6 Türk çalışan daha');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run "src/app/[locale]/(site)/hiring-cost-calculator/__tests__/QuotaGateIsland.test.tsx"` → `Failed to resolve import "../_components/QuotaGateIsland"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hiring-cost-calculator/_components/CollapsibleSection.tsx`:

```tsx
'use client';
import { useId, useState, type ReactNode } from 'react';
import { Section } from '@/design/primitives';

/** The design's ≤700 px per-section accordion (.ja-cs / .ja-cstog, CSS lines 292–308): on phones
 *  each content section collapses behind a title + one-line subtitle trigger; from `md` the
 *  trigger is gone and the body is always shown. W10: the body is hidden with CSS, never removed,
 *  and the section's own h2/subtitle stay in the accessibility tree (`max-md:sr-only`), so the
 *  outline is identical at every width (D20). */
export function CollapsibleSection({ id, tone, title, subtitle, className, children }: {
  id: string; tone: 'light' | 'pale' | 'dark'; title: string; subtitle: string; className?: string; children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  return (
    <Section id={id} tone={tone} className={['scroll-mt-4 max-md:!py-2', className].filter(Boolean).join(' ')}>
      <div className="container-site">
        <button type="button" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((v) => !v)} className={['flex min-h-[56px] w-full items-center justify-between gap-3 rounded-sm border bg-white px-4 py-3 text-left md:hidden', open ? 'border-blue shadow-card-hover' : 'border-border-1'].join(' ')}>
          <span className="flex flex-col"><span className="font-extrabold">{title}</span><span className="text-body-sm text-text-secondary">{subtitle}</span></span>
          <span aria-hidden="true" className={['transition-transform', open ? 'rotate-180' : ''].join(' ')}>▾</span>
        </button>
        <div id={bodyId} className={open ? 'max-md:pt-4' : 'max-md:hidden'}>{children}</div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/LiveSgkRate.tsx`:

```tsx
'use client';
import { useEstimateInputs } from './estimate-store';

/** `calc.359` "Your rate above is {rate} instead of the full 23.75%" — the design binds the live
 *  tier here; the three labels are pre-formatted on the server (D18), this only picks one. */
export function LiveSgkRate({ rates }: { rates: Record<'manufacturing' | 'other' | 'none', string> }) {
  const { sgkTier } = useEstimateInputs();
  return <strong className="font-extrabold text-ink">{rates[sgkTier]}</strong>;
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/SalaryGuideCards.tsx` (presentational — the server fallback and the island render the same cards):

```tsx
import type { GuideLabels } from '../calc-labels';
import type { GuideRow } from '../salary-guide-rows';

export function SalaryGuideCards({ rows, activeKey, labels, scaleMin, scaleMax, onUse }: {
  rows: GuideRow[]; activeKey: string; labels: GuideLabels; scaleMin: string; scaleMax: string; onUse?: (key: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="calc-salary-guide-cards">
      {rows.map((r) => {
        const active = r.key === activeKey;
        return (
          <article key={r.key} data-role={r.key} className={['flex flex-col gap-4 rounded-base border-[1.5px] bg-white p-5 transition-shadow', active ? 'border-blue shadow-[0_14px_34px_rgba(24,153,213,0.18)]' : 'border-border-4 shadow-card'].join(' ')}>
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="m-0 text-card-title">{r.role}</h3><p className="m-0 text-body-sm font-bold text-text-tertiary">{r.industryLabel}</p></div>
              <span className={['shrink-0 rounded-pill border px-2.5 py-1 text-[11px] font-extrabold', r.skilled ? 'border-success-border bg-success-surface text-success-text' : 'border-border-1 bg-pale-1 text-text-tertiary'].join(' ')}>{r.tier}</span>
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-2"><span className="font-extrabold">{r.range}</span><span className="text-body-sm text-text-tertiary">{labels.sGrossMo}</span></div>
              <div className="relative mt-2 h-2 rounded-pill bg-pale-1" aria-hidden="true">
                <div className="absolute inset-y-0 rounded-pill bg-[linear-gradient(90deg,#1899d5_0%,#5cc0ef_100%)]" style={{ left: `${r.barLeftPct}%`, width: `${r.barWidthPct}%` }} />
                <div className="absolute -inset-y-1 w-0.5 rounded-[1px] bg-ink" style={{ left: `${r.tickPct}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-[11px] font-bold text-muted"><span>{scaleMin}</span><span>{scaleMax}</span></div>
            </div>
            <div className="flex items-end justify-between gap-3 border-t border-border-3 pt-3">
              <div><p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.8px] text-muted">{labels.sEmpCost}</p><p className="m-0 text-body-sm font-extrabold">{r.employer}</p></div>
              <button type="button" onClick={onUse ? () => onUse(r.key) : undefined} aria-pressed={active} className={['min-h-[44px] shrink-0 rounded-input border px-3 text-body-sm font-extrabold', active ? 'border-success-border bg-success-surface text-success-text' : 'border-tint-border bg-pale-1 text-blue-safe'].join(' ')}>
                {active ? labels.inCalc : labels.useCalc}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/SalaryGuide.tsx` (the loader; the island lives in the same file's dynamic import target below):

```tsx
'use client';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import type { SalaryGuideIslandProps } from './SalaryGuideIsland';
import { LazyIsland } from './LazyIsland';

const SalaryGuideIsland = dynamic(() => import('./SalaryGuideIsland').then((m) => m.SalaryGuideIsland), { ssr: false });

export function SalaryGuide({ fallback, ...props }: Omit<SalaryGuideIslandProps, 'onReady'> & { fallback: ReactNode }) {
  return <LazyIsland trigger="view" testId="calc-salary-guide" fallback={fallback} render={(onReady) => <SalaryGuideIsland {...props} onReady={onReady} />} />;
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/SalaryGuideIsland.tsx`:

```tsx
'use client';
import { useLayoutEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import type { CalculatorRole, RateConfig } from '@/content/collections';
import { RadioChips } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { GuideLabels } from '../calc-labels';
import { buildGuideRows } from '../salary-guide-rows';
import { SalaryGuideCards } from './SalaryGuideCards';
import { setEstimateInputs, useEstimateInputs } from './estimate-store';

export type SalaryGuideIslandProps = {
  locale: Locale; roles: CalculatorRole[]; rateConfig: RateConfig; labels: GuideLabels;
  roleLabels: Record<string, string>; industryLabels: Record<string, string>; scaleMin: string; scaleMax: string; onReady: () => void;
};

export function SalaryGuideIsland({ locale, roles, rateConfig, labels, roleLabels, industryLabels, scaleMin, scaleMax, onReady }: SalaryGuideIslandProps) {
  const sys = useTranslations('sys');
  const pathname = usePathname();
  const uiLocale = useLocale();
  const inputs = useEstimateInputs();
  const [industry, setIndustry] = useState('all');
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ssr:false island, once
  useLayoutEffect(() => onReady(), []);
  // W59: the cards follow the tier chosen in the calculator, not a fixed 1.2175
  const rows = buildGuideRows(roles, rateConfig, inputs.sgkTier, locale, (id) => roleLabels[id] ?? industryLabels[id] ?? id, { skilled: labels.skilled, standard: labels.standard });
  const industries = [...new Set(rows.map((r) => r.industry))];
  const use = (key: string) => {
    setEstimateInputs({ roleKey: key, grossSalary: null });
    track('calculator_use', { page: pathname ?? '/', locale: uiLocale, role: key, headcount: inputs.headcount });
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <>
      <RadioChips name="calc-guide-industry" legend={sys('calc.a11y.industryFilter')} legendHidden className="mb-5" value={industry} onChange={setIndustry}
        options={[{ value: 'all', label: labels.allInd }, ...industries.map((i) => ({ value: i, label: industryLabels[i] ?? i }))]} />
      <SalaryGuideCards rows={rows.filter((r) => industry === 'all' || r.industry === industry)} activeKey={inputs.roleKey} labels={labels} scaleMin={scaleMin} scaleMax={scaleMax} onUse={use} />
    </>
  );
}
```

Note the `t` passed to `buildGuideRows` above: the island has no `makeTf`, so the page hands it `roleLabels` keyed by **label id** as well as by role key — see the page wiring below (`guideLabelMap`). Simpler and what the code uses: `roleLabels` maps `labelId → text` and `industryLabels` maps `industryLabelId → text` for this island (the page builds both maps from the rows).

`src/app/[locale]/(site)/hiring-cost-calculator/_components/QuotaGate.tsx` + `QuotaGateIsland.tsx`:

```tsx
'use client';
// QuotaGate.tsx
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import type { QuotaGateIslandProps } from './QuotaGateIsland';
import { LazyIsland } from './LazyIsland';
const QuotaGateIsland = dynamic(() => import('./QuotaGateIsland').then((m) => m.QuotaGateIsland), { ssr: false });
export function QuotaGate({ fallback, ...props }: Omit<QuotaGateIslandProps, 'onReady'> & { fallback: ReactNode }) {
  return <LazyIsland trigger="view" testId="calc-quota" fallback={fallback} render={(onReady) => <QuotaGateIsland {...props} onReady={onReady} />} />;
}
```

```tsx
'use client';
// QuotaGateIsland.tsx
import { useLayoutEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Stepper } from '@/design/islands';
import type { Locale } from '@/i18n/routing';
import { QUOTA_VIZ_CAP, quotaBlocks, quotaCheck } from '@/lib/calculator';
import { formatInt } from '@/lib/format/money';
import type { QuotaLabels } from '../calc-labels';
import { TURKISH_STAFF } from '../estimate-inputs';
import { setEstimateInputs, useEstimateInputs } from './estimate-store';

export type QuotaGateIslandProps = { locale: Locale; quotaRatio: number; labels: QuotaLabels; onReady: () => void };

/** Gate 1 (design lines 1063–1105 + the mobile step card 1031–1049): the live 5:1 check over
 *  `rateConfig.quotaRatio`, the block visualisation, and the "you picked N" line bound to the
 *  calculator's headcount. Every sentence with a live number is a `sys.calc.live.*` template. */
export function QuotaGateIsland({ locale, quotaRatio, labels, onReady }: QuotaGateIslandProps) {
  const sys = useTranslations('sys');
  const { turkishStaff, headcount } = useEstimateInputs();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ssr:false island, once
  useLayoutEffect(() => onReady(), []);
  const check = quotaCheck(turkishStaff, headcount, quotaRatio);
  const blocks = quotaBlocks(turkishStaff, quotaRatio, QUOTA_VIZ_CAP);
  const allowed = check.maxForeign;
  const n = (v: number) => formatInt(v, locale);
  const title = allowed === 0 ? labels.quotaTitleNo : labels.quotaTitleYes;
  const allowedText = allowed === 0 ? labels.quotaNone : sys('calc.live.quotaAllowed', { n: allowed });
  const msg = allowed === 0 ? sys('calc.live.quotaMsgNo', { staff: turkishStaff, ratio: quotaRatio, need: n(quotaRatio - turkishStaff) })
    : blocks.remainder === 0 ? labels.quotaMsgExact : sys('calc.live.quotaMsgMore', { ratio: quotaRatio, m: blocks.nextUnlockIn });
  const vizNote = turkishStaff < quotaRatio ? sys('calc.live.qvNone', { n: n(quotaRatio - turkishStaff) })
    : blocks.capped ? sys('calc.live.qvCap', { blocks: n(blocks.full), cap: blocks.shown, spare: blocks.remainder, need: n(blocks.nextUnlockIn) })
    : blocks.remainder === 0 ? sys('calc.live.qvFull', { staff: n(turkishStaff), blocks: blocks.full, ratio: quotaRatio })
    : sys('calc.live.qvPart', { blocks: blocks.full, spare: blocks.remainder, need: n(blocks.nextUnlockIn) });
  const vsPlan = check.allowed ? labels.quotaVsOk : sys('calc.live.quotaVsOver', { over: n(check.overBy), need: n(check.shortfall) });
  const tone = allowed === 0 ? 'border-warning-border bg-warning-surface' : 'border-success-border bg-success-surface';
  const accent = allowed === 0 ? 'text-warning-text' : 'text-success-text';
  const stepper = (id: string) => (
    <Stepper id={id} label={labels.qStaffLbl} value={turkishStaff} onChange={(v) => setEstimateInputs({ turkishStaff: v })} min={0} max={TURKISH_STAFF.max} step={TURKISH_STAFF.step}
      decrementLabel={sys('calc.a11y.decrease', { step: TURKISH_STAFF.step })} incrementLabel={sys('calc.a11y.increase', { step: TURKISH_STAFF.step })} hint={labels.qSameBranch} />
  );
  const picked = (
    <p data-testid="quota-vs-plan" className="m-0 text-body-sm text-text-secondary">
      {labels.qPicked1} <strong className="font-extrabold text-ink">{n(headcount)}</strong> {labels.qPicked2} {vsPlan}
    </p>
  );
  return (
    <>
      {/* phone step card (calc.175–177) */}
      <div className="rounded-sm border border-border-1 bg-white p-4 md:hidden">
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{labels.qmS1}</p>
        <p className="m-0 mb-3 font-extrabold">{labels.qmS1T}</p>
        {stepper('calc-staff-m')}
        <div className={['mt-3 rounded-xs border p-3', tone].join(' ')}>
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[1px] text-muted">{labels.qmAns}</p>
          <p className={['m-0 text-card-title font-extrabold', accent].join(' ')}>{allowedText}</p>
          <p className="m-0 mt-1 text-body-sm text-text-secondary">{msg}</p>
          <div className="mt-2">{picked}</div>
        </div>
        <p className="m-0 mt-3 text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{labels.qmWhy}</p>
        <p className="m-0 mt-1 text-body-sm text-text-secondary"><strong className="font-extrabold text-ink">{labels.qmWhyA}</strong> {labels.qmWhyB}</p>
      </div>
      {/* Gate 1 card (desktop) */}
      <div className="hidden rounded-lg border border-border-2 bg-white p-6 md:block">
        <div className="mb-4 flex items-center gap-3"><span className="font-extrabold">{labels.qG1}</span><span className="inline-flex items-center gap-1.5 rounded-pill bg-success-surface px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-success-text"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill bg-success" />{labels.qLive}</span></div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            {stepper('calc-staff')}
            <div className={['mt-4 rounded-sm border px-5 py-4', tone].join(' ')}>
              <p className="m-0 text-body-sm font-extrabold uppercase tracking-[0.6px] text-muted">{title}</p>
              <p data-testid="quota-allowed" className={['m-0 text-h2 font-extrabold', accent].join(' ')}>{allowedText}</p>
              <p data-testid="quota-msg" className="m-0 mt-1 text-body-sm text-text-secondary">{msg}</p>
            </div>
          </div>
          <div>
            <p className="m-0 mb-2 text-body-sm font-extrabold text-text-secondary">{labels.qSplit}</p>
            <div className="flex flex-wrap gap-2" aria-hidden="true">
              {Array.from({ length: blocks.shown }, (_, i) => (
                <div key={i} className={['flex items-center gap-1 rounded-input border px-2.5 py-1.5', i < headcount ? 'border-success-border bg-success-surface' : 'border-border-4 bg-pale-2'].join(' ')}>
                  {Array.from({ length: quotaRatio }, (_, j) => <span key={j} className="inline-block h-[11px] w-[11px] rounded-[3px] bg-blue" />)}
                  <span className="mx-0.5 text-[11px] text-muted">→</span><span className="inline-block h-[11px] w-[11px] rounded-[3px] bg-success" />
                </div>
              ))}
              {blocks.remainder > 0 && !blocks.capped && (
                <div className="flex items-center gap-1 rounded-input border border-dashed border-border-1 bg-white px-2.5 py-1.5 opacity-85">
                  {Array.from({ length: quotaRatio }, (_, j) => <span key={j} className={['inline-block h-[11px] w-[11px] rounded-[3px]', j < blocks.remainder ? 'bg-blue' : 'border-[1.5px] border-dashed border-border-1 bg-white'].join(' ')} />)}
                  <span className="mx-0.5 text-[11px] text-border-1">→</span><span className="inline-block h-[11px] w-[11px] rounded-[3px] border-[1.5px] border-dashed border-border-1 bg-white" />
                </div>
              )}
            </div>
            <p data-testid="quota-viz-note" className="m-0 mt-2 text-body-sm text-text-secondary">{vizNote}</p>
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-4 p-0 text-[11px] font-bold text-text-tertiary">
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-[11px] w-[11px] rounded-[3px] bg-blue" />{labels.qLegTr}</li>
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-[11px] w-[11px] rounded-[3px] bg-success" />{labels.qLegPlace}</li>
              <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-[11px] w-[11px] rounded-[3px] border-[1.5px] border-dashed border-border-1 bg-white" />{labels.qLegInc}</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 border-t border-border-3 pt-3">{picked}</div>
      </div>
    </>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/PassCheck.tsx` + `PassCheckIsland.tsx`:

```tsx
'use client';
// PassCheck.tsx
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import type { PassCheckIslandProps } from './PassCheckIsland';
import { LazyIsland } from './LazyIsland';
const PassCheckIsland = dynamic(() => import('./PassCheckIsland').then((m) => m.PassCheckIsland), { ssr: false });
export function PassCheck({ fallback, ...props }: Omit<PassCheckIslandProps, 'onReady'> & { fallback: ReactNode }) {
  return <LazyIsland trigger="view" testId="calc-passcheck" fallback={fallback} render={(onReady) => <PassCheckIsland {...props} onReady={onReady} />} />;
}
```

```tsx
'use client';
// PassCheckIsland.tsx
import { useLayoutEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import type { CalculatorRole, RateConfig } from '@/content/collections';
import { ProgressBar, TriState, type TriStateValue } from '@/design/islands';
import { buttonClassName } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { findRole, quotaCheck, salaryRange, turkishStaffRequired } from '@/lib/calculator';
import { waLink } from '@/lib/contact';
import { formatInt, formatTRY } from '@/lib/format/money';
import { multiplierNumber, type PassLabels } from '../calc-labels';
import { MANUAL_ROWS, PASS_CHECK_ROWS, passCheckVerdict, type Answers, type ManualRow, type PassRow } from '../pass-check-logic';
import { DEFAULT_ROLE_KEY } from '../estimate-inputs';
import { useEstimateInputs } from './estimate-store';

export type PassCheckIslandProps = { locale: Locale; rateConfig: RateConfig; roles: CalculatorRole[]; roleLabels: Record<string, string>; labels: PassLabels; whatsappNumber: string; onReady: () => void };

const TONE = {
  idle: 'border-tint-border bg-white', progress: 'border-tint-border bg-white', green: 'border-success-border bg-success-surface',
  amber: 'border-warning-border bg-warning-surface', red: 'border-danger-border bg-danger-surface',
} as const;
const BAR = { idle: 'blue', progress: 'blue', green: 'green', amber: 'amber', red: 'red' } as const;

/** calc.378 holds: nothing here is posted anywhere — the state lives in this component and the
 *  only way out is the visitor's own WhatsApp click (W3). */
export function PassCheckIsland({ locale, rateConfig, roles, roleLabels, labels, whatsappNumber, onReady }: PassCheckIslandProps) {
  const sys = useTranslations('sys');
  const inputs = useEstimateInputs();
  const [answers, setAnswers] = useState<Answers>({});
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ssr:false island, once
  useLayoutEffect(() => onReady(), []);
  const role = findRole(roles, inputs.roleKey) ?? findRole(roles, DEFAULT_ROLE_KEY) ?? roles[0];
  const roleLabel = roleLabels[role.key] ?? role.key;
  const floor = salaryRange(role, rateConfig).min;
  const need = turkishStaffRequired(inputs.headcount, rateConfig.quotaRatio);
  const quota = quotaCheck(inputs.turkishStaff, inputs.headcount, rateConfig.quotaRatio);
  const v = passCheckVerdict(answers, quota.allowed);
  const n = (x: number) => formatInt(x, locale);
  const amount = formatTRY(floor, locale);
  const rows: Record<PassRow, { title: string; body: string; fix: string }> = {
    capital: { title: labels.ckCapT, body: labels.ckCapB, fix: labels.ckCapF },
    quota: {
      title: labels.ckQuoT,
      body: quota.allowed ? sys('calc.live.ckQuoOk', { staff: n(inputs.turkishStaff), allowed: n(quota.maxForeign), headcount: n(inputs.headcount) }) : sys('calc.live.ckQuoNo', { headcount: n(inputs.headcount), need: n(need), staff: n(inputs.turkishStaff) }),
      fix: sys('calc.live.ckQuoF', { need: n(need), headcount: n(inputs.headcount) }),
    },
    sgk: { title: labels.ckSgkT, body: labels.ckSgkB, fix: labels.ckSgkF },
    salary: { title: labels.ckSalT, body: sys('calc.live.ckSalB', { role: roleLabel, amount, multiplier: multiplierNumber(role.multiplier, locale) }), fix: sys('calc.live.ckSalF', { amount }) },
    docs: { title: labels.ckDocT, body: labels.ckDocB, fix: labels.ckDocF },
  };
  const kicker = v.tone === 'idle' ? labels.vIdleK : v.tone === 'progress' ? labels.vProgK : labels.vRes;
  const title = v.tone === 'idle' ? labels.vIdleT : v.tone === 'progress' ? labels.vProgT : v.tone === 'green' ? labels.vGreenT
    : v.tone === 'amber' ? (v.unsure.length === 1 ? labels.vAmber1 : sys('calc.live.vAmberN', { n: v.unsure.length }))
    : v.blockers.length === 1 ? labels.vRed1 : sys('calc.live.vRedN', { n: v.blockers.length });
  const body = { idle: labels.vIdleB, progress: labels.vProgB, green: labels.vGreenB, amber: labels.vAmberB, red: labels.vRedB }[v.tone];
  const fixes = [...v.blockers.map((r) => ({ r, text: rows[r].fix, unsure: false })), ...v.unsure.map((r) => ({ r, text: `${labels.pcConfirm} ${rows[r].fix}`, unsure: true }))];
  const count = sys('calc.live.vCount', { clear: v.clear, total: PASS_CHECK_ROWS.length, unanswered: v.unanswered });
  const word = (a: TriStateValue | null) => (a === 'yes' ? labels.pcYes : a === 'no' ? labels.pcNo : a === 'unsure' ? labels.pcMaybe : sys('calc.passcheck.unanswered'));
  const summary = PASS_CHECK_ROWS.map((r, i) => `${i + 1}. ${rows[r].title} — ${word(v.values[r])}`).join('\n');
  const waText = sys('calc.whatsapp.passCheck', { role: roleLabel, headcount: n(inputs.headcount), staff: n(inputs.turkishStaff), summary });
  const answer = (row: ManualRow) => (value: TriStateValue) => setAnswers((prev) => ({ ...prev, [row]: prev[row] === value ? undefined : value }));
  const manualAnswered = Object.values(answers).some(Boolean);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-lg border border-border-2 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{labels.pcK}</span>
          <button type="button" onClick={() => setAnswers({})} className={['text-body-sm font-extrabold text-muted', manualAnswered ? '' : 'invisible'].join(' ')}>{labels.pcReset}</button>
        </div>
        <ol className="m-0 flex list-none flex-col gap-5 p-0">
          {PASS_CHECK_ROWS.map((r, i) => {
            const val = v.values[r];
            const num = val === 'yes' ? '✓' : val === 'no' ? '!' : val === 'unsure' ? '?' : String(i + 1);
            const numTone = val === 'yes' ? 'bg-success-surface text-success-text' : val === 'no' ? 'bg-danger-surface text-danger' : val === 'unsure' ? 'bg-warning-surface text-warning-text' : 'bg-pale-1 text-muted';
            return (
              <li key={r} className="flex gap-3">
                <span aria-hidden="true" className={['mt-0.5 grid h-[30px] w-[30px] shrink-0 place-items-center rounded-input font-extrabold', numTone].join(' ')}>{num}</span>
                <div className="min-w-0">
                  <p className="m-0 font-extrabold">{rows[r].title}</p>
                  <p className="m-0 mb-2 text-body-sm text-text-secondary">{rows[r].body}</p>
                  {r === 'quota' ? (
                    <a href="#quota" className={['inline-flex min-h-[36px] items-center rounded-pill border-[1.5px] px-4 text-body-sm font-extrabold', quota.allowed ? 'border-success-border bg-success-surface text-success-text' : 'border-danger-border bg-danger-surface text-danger'].join(' ')}>
                      {quota.allowed ? labels.pcClear : labels.pcShort}
                    </a>
                  ) : (
                    <TriState name={`calc-check-${r}`} legend={rows[r].title} hideLegend value={answers[r] ?? null} onChange={answer(r)} labels={{ yes: labels.pcYes, no: labels.pcNo, unsure: labels.pcMaybe }} />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="m-0 mt-4 text-body-sm text-text-tertiary">{labels.pcPriv}</p>
      </div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div data-testid="passcheck-verdict" data-tone={v.tone} className={['rounded-lg border-[1.5px] p-6 shadow-[0_14px_34px_rgba(22,60,90,0.08)]', TONE[v.tone]].join(' ')}>
          <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{kicker}</p>
          <p className="m-0 mt-1 text-card-title font-extrabold">{title}</p>
          <p className="m-0 mt-2 text-body-sm text-text-secondary">{body}</p>
          <div className="mt-4"><ProgressBar value={v.progressPct} label={labels.vRes} valueText={count} tone={BAR[v.tone]} /></div>
          <p className="m-0 mt-2 text-body-sm font-bold text-text-tertiary">{count}</p>
          {fixes.length > 0 && (
            <div className="mt-4 border-t border-black/10 pt-4">
              <p className="m-0 mb-2 text-body-sm font-extrabold">{labels.pcFix}</p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {fixes.map((f) => (<li key={f.r} className="flex gap-2 text-body-sm"><span aria-hidden="true" className={['mt-2 h-2 w-2 shrink-0 rounded-pill', f.unsure ? 'bg-warning' : 'bg-danger'].join(' ')} />{f.text}</li>))}
              </ul>
            </div>
          )}
          <ContactLink href={waLink(whatsappNumber, waText)} placement="page_cta" target="_blank" rel="noopener noreferrer" className={buttonClassName('primary', 'md', 'mt-5 w-full')}>{labels.pcSend}</ContactLink>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_sections/StaticSections.tsx` (server components; every id through the page's `t = makeTf`; `<B>` is the design's `<strong>` fragment):

```tsx
import { Fragment, type ReactNode } from 'react';
import type { RateConfig } from '@/content/collections';
import { Card, Tabs } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { sgkRateLabel } from '@/lib/calculator';
import { formatTRY } from '@/lib/format/money';
import { LiveSgkRate } from '../_components/LiveSgkRate';

type T = (id: string) => string;
type Sys = (key: string, values?: Record<string, string | number>) => string;
export const B = ({ children }: { children: ReactNode }) => <strong className="font-extrabold text-ink">{children}</strong>;
/** calc.124/125 carry a literal `<br />` (the package's own markup). */
const Lines = ({ text }: { text: string }) => <>{text.split(/<br\s*\/?>/).map((l, i) => <Fragment key={i}>{i ? <br /> : null}{l}</Fragment>)}</>;
const H2 = ({ children, sub, center }: { children: string; sub: string; center?: boolean }) => (
  <div className={['mb-8 max-md:sr-only', center ? 'mx-auto max-w-[720px] text-center' : ''].join(' ')}>
    <h2 className="m-0 mb-3 text-h2 leading-[1.05] tracking-[-0.03em]">{children}</h2>
    <p className="m-0 text-body-lg text-text-secondary">{sub}</p>
  </div>
);
const Tile = ({ title, body, children }: { title: string; body: ReactNode; children?: ReactNode }) => (
  <Card className="flex flex-col gap-2"><h3 className="m-0 text-card-title">{title}</h3><p className="m-0 text-body-sm text-text-secondary">{body}</p>{children}</Card>
);
const Note = ({ tone, label, children }: { tone: 'amber' | 'green'; label?: string; children: ReactNode }) => (
  <p className={['m-0 rounded-sm border px-4 py-3 text-body-sm', tone === 'amber' ? 'border-warning-border bg-warning-surface text-warning-text' : 'border-success-border bg-success-surface text-success-text'].join(' ')}>{label ? <B>{label} </B> : null}{children}</p>
);

/** Design lines 755–764: phone-only jump chips (W10 `md:hidden`). */
export function JumpChips({ t, label }: { t: T; label: string }) {
  const chips: [string, string][] = [['#salaries', 'calc.054'], ['#quota', 'calc.055'], ['#incentives', 'calc.056'], ['#passcheck', 'calc.057'], ['#penalties', 'calc.058'], ['#faq', 'calc.059']];
  return (
    <nav aria-label={label} data-testid="calc-jump" className="container-site pt-4 md:hidden">
      <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 pb-0.5">
        {chips.map(([href, id]) => (<li key={href} className="shrink-0"><a href={href} className="inline-flex min-h-[40px] items-center rounded-pill border border-border-1 bg-pale-1 px-3.5 text-body-sm font-extrabold text-ink no-underline">{t(id)}</a></li>))}
      </ul>
    </nav>
  );
}

/** #basis (765–808): four source cards, the amber note, the D17 "last updated" pill. */
export function Basis({ t, updatedAt }: { t: T; updatedAt: string }) {
  return (
    <>
      <H2 sub={t('calc.077')} center>{t('calc.076')}</H2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Tile title={t('calc.078')} body={t('calc.079')} />
        <Tile title={t('calc.080')} body={t('calc.081')} />
        <Tile title={t('calc.082')} body={<>{t('calc.083')} <Link href="/work-permit" className="font-extrabold text-blue-safe">{t('calc.084')}</Link></>} />
        <Tile title={t('calc.085')} body={t('calc.086')} />
      </div>
      <div className="mt-5"><Note tone="amber" label={t('calc.087')}>{t('calc.088')}</Note></div>
      <p data-testid="calc-updated" className="m-0 mt-4 flex flex-wrap items-center gap-x-2 text-body-sm text-text-tertiary">
        <span>{t('calc.089')} <B>{updatedAt}</B></span><span>{t('calc.090')}</span>
      </p>
    </>
  );
}

/** #compare (873–1022): phone short-answer cards, the 7-row A/B table, the long-term card. */
export function Compare({ t, locale, rateConfig }: { t: T; locale: Locale; rateConfig: RateConfig }) {
  const oneOff = rateConfig.permitFeeTRY + rateConfig.flightTRY;
  const rows: [string, ReactNode, ReactNode][] = [
    ['calc.195', <>{t('calc.196')}<B>{t('calc.197')}</B></>, <>{t('calc.198')}<B>{t('calc.199')}</B></>],
    ['calc.200', t('calc.201'), <><B>{t('calc.202')}</B>{t('calc.203')}</>],
    ['calc.204', t('calc.205'), <><B>{t('calc.206')}</B>{t('calc.207')}</>],
    ['calc.208', t('calc.209'), <><B>{t('calc.210')}</B>{t('calc.211')}</>],
    ['calc.212', t('calc.213'), <><B>{t('calc.214')}</B>{t('calc.215')}</>],
    ['calc.216', t('calc.217'), <>{t('calc.218')}<B>{t('calc.219')}</B>{t('calc.220')}</>],
    ['calc.221', t('calc.222'), <>{t('calc.223')}<B>{t('calc.224')}</B></>],
  ];
  const benefits: [string, string][] = [['calc.250', 'calc.251'], ['calc.252', 'calc.253'], ['calc.254', 'calc.255'], ['calc.256', 'calc.257'], ['calc.258', 'calc.259']];
  return (
    <>
      <div className="md:hidden">
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{t('calc.242')}</p>
        <p className="m-0 mb-4 text-body-lg">{t('calc.243')} <B>{t('calc.244')}</B>{t('calc.245')}</p>
        <Card className="mb-3"><p className="m-0 text-body-sm font-extrabold uppercase text-muted">{t('calc.246')}</p><p className="m-0 text-h2 font-extrabold text-blue-safe">{t('calc.411')}</p><p className="m-0 text-body-sm text-text-secondary">{t('calc.247')}</p><p className="m-0 mt-2 text-body-sm">{t('calc.248')}</p></Card>
        <p className="m-0 mb-2 text-body-sm font-extrabold uppercase text-muted">{t('calc.249')}</p>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-body-sm">{benefits.map(([s, b]) => <li key={s}><B>{t(s)}</B> {t(b)}</li>)}</ul>
      </div>
      <div className="hidden md:block">
        <H2 sub={t('calc.190')} center>{t('calc.189')}</H2>
        <div className="overflow-x-auto"><table className="w-full border-separate border-spacing-0 text-body-sm">
          <thead><tr>
            <th scope="col" className="sr-only">—</th>
            <th scope="col" className="rounded-t-base bg-pale-1 px-4 py-4 text-left"><span className="block text-eyebrow uppercase text-muted">{t('calc.191')}</span><span className="text-card-title">{t('calc.192')}</span></th>
            <th scope="col" className="rounded-t-base bg-navy px-4 py-4 text-left text-white"><span className="block text-eyebrow uppercase text-sky">{t('calc.193')}</span><span className="text-card-title">{t('calc.194')}</span></th>
          </tr></thead>
          <tbody>{rows.map(([k, a, b]) => (<tr key={k}><th scope="row" className="border-b border-border-3 px-4 py-4 text-left font-extrabold">{t(k)}</th><td className="border-b border-border-3 px-4 py-4 text-text-secondary">{a}</td><td className="border-b border-border-3 bg-pale-3 px-4 py-4 text-ink">{b}</td></tr>))}</tbody>
        </table></div>
        <Card className="mt-8">
          <h3 className="m-0 text-card-title">{t('calc.225')}</h3>
          <p className="m-0 mb-5 text-body-sm text-text-secondary">{t('calc.226')}</p>
          <div className="grid gap-5 lg:grid-cols-3">
            <div><p className="m-0 text-eyebrow font-extrabold uppercase text-muted">{t('calc.227')}</p><p className="my-2 flex gap-2">{['calc.228', 'calc.229', 'calc.230'].map((id) => <span key={id} className="rounded-pill border border-tint-border bg-tint px-3 py-1 text-body-sm font-extrabold text-blue-safe">{t(id)}</span>)}</p><p className="m-0 text-body-sm text-text-secondary">{t('calc.231')}</p></div>
            <div><p className="m-0 text-eyebrow font-extrabold uppercase text-muted">{t('calc.232')}</p><p className="m-0 mt-2 text-body-sm text-text-secondary">{t('calc.233')}</p></div>
            <div><p className="m-0 text-eyebrow font-extrabold uppercase text-muted">{t('calc.234')}</p><p className="m-0 mt-2 text-body-sm text-text-secondary">{t('calc.235')}</p></div>
          </div>
          <div className="mt-5 rounded-base bg-navy p-5 text-white">
            <p className="m-0 mb-3 text-body-sm font-extrabold text-white/70">{t('calc.236')}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[[formatTRY(oneOff, locale), 'calc.237'], [`${formatTRY(oneOff / 12, locale)} ${t('calc.465')}`, 'calc.238'], [`${formatTRY(oneOff / 36, locale)} ${t('calc.465')}`, 'calc.239']].map(([v, id]) => (<div key={id}><p className="m-0 text-card-title font-extrabold">{v}</p><p className="m-0 text-body-sm text-white/60">{t(id)}</p></div>))}
            </div>
            <p className="m-0 mt-3 text-body-sm text-white/70">{t('calc.240')}</p>
          </div>
        </Card>
        <p className="m-0 mt-6 text-center text-body text-text-secondary">{t('calc.241')}</p>
      </div>
    </>
  );
}

/** #quota Gate 2 card + exemptions (1106–1176) and the phone step-2 card (1050–1058). */
export function QuotaGate2({ t, sys }: { t: T; sys: Sys }) {
  const badge = (k: string) => sys(`calc.exemptions.badge.${k}`);
  const rows = {
    sector: [['calc.513', 'calc.514', t('calc.549')], ['calc.515', 'calc.516', badge('tenStaff')], ['calc.517', 'calc.518', badge('tenStaff')], ['calc.519', 'calc.520', badge('twentyStaff')], ['calc.521', 'calc.522', t('calc.550')]],
    company: [['calc.523', 'calc.524', badge('upTo5')], ['calc.525', 'calc.526', badge('full')], ['calc.527', 'calc.528', badge('full')], ['calc.529', 'calc.530', badge('timing')]],
    person: [['calc.531', 'calc.532', badge('upTo3')], ['calc.533', 'calc.534', badge('exceptional')], ['calc.535', 'calc.536', badge('exceptional')], ['calc.537', 'calc.538', badge('exceptional')], ['calc.539', 'calc.540', badge('exceptional')]],
  } as const;
  const panel = (introId: string, list: ReadonlyArray<readonly [string, string, string]>) => (
    <div>
      <p className="m-0 mb-4 text-body-sm text-text-secondary">{t(introId)}</p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {list.map(([title, body, b]) => (<li key={title} className="rounded-sm border border-border-2 bg-white p-4"><div className="mb-1 flex flex-wrap items-center justify-between gap-2"><span className="font-extrabold">{t(title)}</span><span className="rounded-pill border border-tint-border bg-tint px-2.5 py-0.5 text-[11px] font-extrabold text-blue-safe">{b}</span></div><p className="m-0 text-body-sm text-text-secondary">{t(body)}</p></li>))}
      </ul>
    </div>
  );
  const criteria: [string, string, string][] = [['calc.370', 'calc.167', 'calc.373'], ['calc.371', 'calc.168', 'calc.374'], ['calc.372', 'calc.169', 'calc.375']];
  return (
    <>
      <div className="mt-4 rounded-sm border border-border-1 bg-white p-4 md:hidden">
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{t('calc.181')}</p>
        <p className="m-0 mb-3 text-body-sm">{t('calc.182')} <B>{t('calc.183')}</B> {t('calc.184')}</p>
        <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0">{criteria.map(([, l, m]) => <li key={m} className="rounded-xs bg-pale-1 p-2 text-center"><span className="block font-extrabold">{t(m)}</span><span className="text-[11px] text-text-tertiary">{t(l === 'calc.167' ? 'calc.185' : l === 'calc.168' ? 'calc.186' : 'calc.187')}</span></li>)}</ul>
        <p className="m-0 mt-3 text-body-sm text-text-secondary">{t('calc.188')}</p>
      </div>
      <div className="mt-6 hidden gap-6 md:grid lg:grid-cols-2">
        <Card>
          <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{t('calc.150')}</p>
          <p className="m-0 mb-4 text-body">{t('calc.151')} <B>{t('calc.152')}</B> {t('calc.153')}</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-body-sm text-text-secondary">
            <li>{t('calc.154')}<B>{t('calc.155')}</B>{t('calc.156')}</li>
            <li>{t('calc.157')}<B>{t('calc.158')}</B>{t('calc.159')}</li>
            <li>{t('calc.160')} <B>{t('calc.161')}</B>{t('calc.162')}</li>
          </ul>
        </Card>
        <Card>
          <p className="m-0 font-extrabold">{t('calc.163')}</p>
          <p className="m-0 mb-4 text-body-sm text-text-secondary">{t('calc.164')} <B>{t('calc.165')}</B> {t('calc.166')}</p>
          <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0">{criteria.map(([v, l]) => <li key={v} className="rounded-sm bg-pale-1 p-3 text-center"><span className="block text-card-title font-extrabold">{t(v)}</span><span className="text-body-sm text-text-tertiary">{t(l)}</span></li>)}</ul>
          <p className="m-0 mt-4 text-body-sm text-text-secondary">{t('calc.170')} <a href="#passcheck" className="font-extrabold text-blue-safe">{t('calc.171')}</a></p>
        </Card>
      </div>
      <div className="mt-6">
        <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{t('calc.172')}</p>
        <Tabs defaultId="sector" tabs={[
          { id: 'sector', label: t('calc.430'), panel: panel('calc.510', rows.sector) },
          { id: 'company', label: t('calc.431'), panel: panel('calc.511', rows.company) },
          { id: 'person', label: t('calc.432'), panel: panel('calc.512', rows.person) },
        ]} />
        <p className="m-0 mt-4 text-body-sm text-text-secondary"><B>{t('calc.173')}</B>{t('calc.174')}</p>
      </div>
    </>
  );
}

/** #incentives (1244–1338). D17: the three percentages come from rateConfig.sgkRates; the
 *  design's `₺12.700` literal is 10 × supportMonthly through formatTRY. */
export function Incentives({ t, locale, rateConfig }: { t: T; locale: Locale; rateConfig: RateConfig }) {
  const rates = { manufacturing: sgkRateLabel(rateConfig, 'manufacturing', locale), other: sgkRateLabel(rateConfig, 'other', locale), none: sgkRateLabel(rateConfig, 'none', locale) };
  const tenWorkers = formatTRY(10 * rateConfig.supportMonthly, locale);
  const badge = (id: string, tone: 'blue' | 'grey') => <span className={['self-start rounded-pill px-2.5 py-0.5 text-[11px] font-extrabold', tone === 'blue' ? 'bg-tint text-blue-safe' : 'bg-pale-1 text-text-tertiary'].join(' ')}>{t(id)}</span>;
  return (
    <>
      <div className="md:hidden">
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{t('calc.357')}</p>
        <ul className="m-0 mb-4 flex list-none flex-col gap-2 p-0 text-body-sm">
          <li><B>{t('calc.358')}</B> {t('calc.359')} <LiveSgkRate rates={rates} /> {t('calc.360')}</li>
          <li><B>{t('calc.361')}</B> {t('calc.362')}</li>
        </ul>
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{t('calc.363')}</p>
        <p className="m-0 mb-4 text-body-sm"><B>{t('calc.364')}</B> {t('calc.365')}</p>
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{t('calc.366')}</p>
        <p className="m-0 text-body-sm">{t('calc.367')}<B>{t('calc.368')}</B>{t('calc.369')}</p>
      </div>
      <div className="hidden md:block">
        <H2 sub={t('calc.329')} center>{t('calc.328')}</H2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Tile title={t('calc.330')} body={<><span className="mb-1 block font-extrabold text-blue-safe">{t('calc.331')}</span>{t('calc.341')}</>}>
            {badge('calc.388', 'blue')}
            <ul className="m-0 mt-2 list-none divide-y divide-border-3 p-0 text-body-sm">{([['calc.385', rates.none], ['calc.386', rates.other], ['calc.387', rates.manufacturing]] as const).map(([id, v]) => <li key={id} className="flex justify-between py-1.5"><span className="text-text-secondary">{t(id)}</span><B>{v}</B></li>)}</ul>
          </Tile>
          <Tile title={t('calc.332')} body={<><span className="mb-1 block font-extrabold text-blue-safe">{t('calc.337')}</span>{t('calc.338')}</>}>
            {badge('calc.388', 'blue')}
            <p className="m-0 text-body-sm">{t('calc.339')} <B>{tenWorkers}</B> {t('calc.340')}</p>
          </Tile>
          <Tile title={t('calc.333')} body={<><span className="mb-1 block font-extrabold text-blue-safe">{t('calc.334')}</span>{t('calc.335')}</>}>
            {badge('calc.389', 'grey')}
            <p className="m-0 text-body-sm text-text-tertiary">{t('calc.336')}</p>
          </Tile>
        </div>
        <div className="mt-8 rounded-lg border border-border-2 bg-pale-2 p-6">
          <h3 className="m-0 mb-4 text-card-title">{t('calc.342')} <em className="not-italic text-danger">{t('calc.343')}</em> {t('calc.344')}</h3>
          <div className="grid gap-4 md:grid-cols-2">{([['calc.345', 'calc.346'], ['calc.347', 'calc.348'], ['calc.349', 'calc.350'], ['calc.351', 'calc.352']] as const).map(([h, b]) => <div key={h}><p className="m-0 font-extrabold">{t(h)}</p><p className="m-0 text-body-sm text-text-secondary">{t(b)}</p></div>)}</div>
          <p className="m-0 mt-4 text-body-sm"><B>{t('calc.353')}</B> {t('calc.354')}</p>
        </div>
        <div className="mt-5"><Note tone="amber" label={t('calc.355')}>{t('calc.356')}</Note></div>
      </div>
    </>
  );
}

/** #penalties (1340–1397): the phone fine table, two fine cards (calc.407/409, the doubled
 *  calc.408 from the package), three consequence cards, the green shield banner. */
export function Penalties({ t }: { t: T }) {
  return (
    <>
      <div className="md:hidden">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          <li className="flex items-center justify-between gap-3 rounded-sm border border-danger-border bg-danger-surface p-3 text-body-sm"><span><Lines text={t('calc.124')} /></span><B>{t('calc.407')}</B></li>
          <li className="flex items-center justify-between gap-3 rounded-sm border border-danger-border bg-danger-surface p-3 text-body-sm"><span><Lines text={t('calc.125')} /></span><B>{t('calc.409')}</B></li>
        </ul>
        <p className="m-0 mt-3 text-body-sm text-text-secondary">{t('calc.126')} <B>{t('calc.127')}</B>{t('calc.128')}</p>
        <p className="m-0 mt-3 text-body">{t('calc.129')} <B>{t('calc.130')}</B> {t('calc.131')}</p>
        <p className="m-0 mt-3 text-body-sm">{t('calc.132')} <B>{t('calc.133')}</B></p>
      </div>
      <div className="hidden md:block">
        <H2 sub={t('calc.110')} center>{t('calc.109')}</H2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-danger-border"><p className="m-0 text-eyebrow font-extrabold uppercase text-muted">{t('calc.111')}</p><p className="m-0 text-h2 font-extrabold text-danger">{t('calc.407')}</p><p className="m-0 text-body-sm text-text-secondary">{t('calc.112')} <B>{t('calc.408')}</B> {t('calc.113')}</p></Card>
          <Card className="border-danger-border"><p className="m-0 text-eyebrow font-extrabold uppercase text-muted">{t('calc.114')}</p><p className="m-0 text-h2 font-extrabold text-danger">{t('calc.409')}</p><p className="m-0 text-body-sm text-text-secondary">{t('calc.115')} <B>{t('calc.116')}</B> {t('calc.117')}</p></Card>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">{([['calc.118', 'calc.119'], ['calc.120', 'calc.121'], ['calc.122', 'calc.123']] as const).map(([h, b]) => <Tile key={h} title={t(h)} body={t(b)} />)}</div>
        <div className="mt-6"><Note tone="green">{t('calc.134')} <B>{t('calc.135')}</B> {t('calc.136')} <B>{t('calc.137')}</B></Note></div>
      </div>
    </>
  );
}

/** #students (1399–1490). */
export function Students({ t }: { t: T }) {
  const tierCard = (title: string, sub: string, lines: ReactNode[]) => (
    <Card><h3 className="m-0 text-card-title">{t(title)}</h3><p className="m-0 mb-3 text-body-sm font-bold text-text-tertiary">{t(sub)}</p><ul className="m-0 flex list-none flex-col gap-2 p-0 text-body-sm text-text-secondary">{lines.map((l, i) => <li key={i} className="flex gap-2"><span aria-hidden="true">•</span><span>{l}</span></li>)}</ul></Card>
  );
  return (
    <>
      <div className="md:hidden">
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{t('calc.285')}</p>
        <p className="m-0 mb-4 text-body-sm">{t('calc.286')} <B>{t('calc.287')}</B>{t('calc.288')}</p>
        {([['calc.289', 'calc.290', ['calc.291', 'calc.292', 'calc.293', 'calc.294'], 'calc.295'], ['calc.296', 'calc.297', ['calc.298', 'calc.299', 'calc.300', 'calc.301'], 'calc.302']] as const).map(([h, s, cells, n]) => (
          <div key={h} className="mb-3 rounded-sm border border-border-1 bg-white p-4"><p className="m-0 font-extrabold">{t(h)} <span className="text-body-sm font-bold text-text-tertiary">{t(s)}</span></p><div className="my-2 grid grid-cols-2 gap-2 text-body-sm">{[[cells[0], cells[1]], [cells[2], cells[3]]].map(([a, b]) => <div key={a} className="rounded-xs bg-pale-1 p-2"><B>{t(a)}</B><span className="block text-text-tertiary">{t(b)}</span></div>)}</div><p className="m-0 text-body-sm text-text-secondary">{t(n)}</p></div>
        ))}
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-body-sm">{([['calc.303', 'calc.304'], ['calc.305', 'calc.306'], ['calc.307', 'calc.308'], ['calc.309', 'calc.310']] as const).map(([s, b]) => <li key={s}><B>{t(s)}</B> {t(b)}</li>)}</ul>
      </div>
      <div className="hidden md:block">
        <H2 sub={t('calc.261')} center>{t('calc.260')}</H2>
        <div className="grid gap-4 md:grid-cols-2">
          {tierCard('calc.262', 'calc.263', [<>{t('calc.264')} <B>{t('calc.265')}</B> {t('calc.266')}</>, <><B>{t('calc.267')}</B> {t('calc.268')}</>, t('calc.269')])}
          {tierCard('calc.270', 'calc.271', [<><B>{t('calc.272')}</B> {t('calc.273')}</>, <><B>{t('calc.274')}</B> {t('calc.275')}</>, t('calc.276')])}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">{([['calc.277', 'calc.278'], ['calc.279', 'calc.280'], ['calc.281', 'calc.282']] as const).map(([h, b]) => <Tile key={h} title={t(h)} body={t(b)} />)}</div>
        <div className="mt-6"><Note tone="amber" label={t('calc.283')}>{t('calc.284')}</Note></div>
      </div>
    </>
  );
}
```

Page wiring for this cycle — replace the `{/* cycle 4 … */}` comment with the block below (the FAQ ask card carries WhatsApp per the block's contract; the design's e-mail row is the block's `footer`, a `ContactCta` mailto — placement `page_cta`):

```tsx
      <JumpChips t={t} label={sys('calc.a11y.jumpNav')} />
      <CollapsibleSection id="basis" tone="light" title={t('calc.060')} subtitle={t('calc.061')}>
        <Basis t={t} updatedAt={updatedAtLabel(rateConfig, locale)} />
      </CollapsibleSection>
      <CollapsibleSection id="salaries" tone="pale" title={t('calc.062')} subtitle={t('calc.063')}>
        <H2Block title={t('calc.091')} sub={t('calc.092')} />
        <ul className="m-0 mb-5 flex list-none flex-wrap gap-4 p-0 text-body-sm font-bold text-text-tertiary">
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-2 w-6 rounded-pill bg-blue" />{t('calc.093')}</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-3 w-0.5 bg-ink" />{t('calc.094')} {formatTRY(rateConfig.legalMinGross, locale)}</li>
          <li>{t('calc.095')}</li>
        </ul>
        {roles.length > 0 && (
          <SalaryGuide locale={locale} roles={roles} rateConfig={rateConfig} labels={guideLabels} roleLabels={guideLabelMap} industryLabels={industryLabels} scaleMin={guideScaleMinLabel} scaleMax={guideScaleMaxLabel}
            fallback={<><div className="mb-5 flex flex-wrap gap-2" aria-hidden="true">{[t('calc.474'), ...Object.values(industryLabels)].map((l) => <span key={l} className="inline-flex min-h-[44px] items-center rounded-pill border border-border-1 bg-white px-4 text-body-sm font-bold text-text-secondary">{l}</span>)}</div><SalaryGuideCards rows={guideRows} activeKey={DEFAULT_INPUTS.roleKey} labels={guideLabels} scaleMin={guideScaleMinLabel} scaleMax={guideScaleMaxLabel} /></>} />
        )}
        <p className="m-0 mt-6 text-body-sm text-text-tertiary"><B>{t('calc.098')}</B> {t('calc.099')}</p>
      </CollapsibleSection>
      <CollapsibleSection id="compare" tone="light" title={t('calc.064')} subtitle={t('calc.065')}>
        <Compare t={t} locale={locale} rateConfig={rateConfig} />
      </CollapsibleSection>
      <CollapsibleSection id="quota" tone="pale" title={t('calc.066')} subtitle={t('calc.067')}>
        <H2Block title={t('calc.138')} sub={t('calc.139')} />
        <QuotaGate locale={locale} quotaRatio={rateConfig.quotaRatio} labels={quotaLabels}
          fallback={<div className="rounded-lg border border-border-2 bg-white p-6"><p className="m-0 font-extrabold">{t('calc.140')}</p><p className="m-0 mt-2 text-body-sm text-text-secondary">{t('calc.142')}: {DEFAULT_INPUTS.turkishStaff} · {t('calc.143')}</p><p className="m-0 mt-3 text-body-sm font-extrabold uppercase text-muted">{t('calc.427')}</p><p data-testid="quota-allowed" className="m-0 text-h2 font-extrabold text-success-text">{sys('calc.live.quotaAllowed', { n: defaultQuota.maxForeign })}</p><p className="m-0 mt-1 text-body-sm text-text-secondary">{t('calc.428')}</p><p className="m-0 mt-3 text-body-sm text-text-secondary">{t('calc.148')} <B>{DEFAULT_INPUTS.headcount}</B> {t('calc.149')} {t('calc.429')}</p></div>} />
        <QuotaGate2 t={t} sys={sysT} />
      </CollapsibleSection>
      <CollapsibleSection id="passcheck" tone="light" title={t('calc.068')} subtitle={t('calc.069')}>
        <H2Block title={t('calc.068')} sub={t('calc.382')} />
        <PassCheck locale={locale} rateConfig={rateConfig} roles={roles} roleLabels={roleLabels} labels={passLabels} whatsappNumber={bundle.settings.whatsappNumber}
          fallback={<div className="rounded-lg border border-border-2 bg-white p-6"><ol className="m-0 flex list-none flex-col gap-4 p-0">{([['calc.445', 'calc.446'], ['calc.448', null], ['calc.449', 'calc.450'], ['calc.452', null], ['calc.453', 'calc.454']] as const).map(([h, b], i) => <li key={h} className="flex gap-3"><span aria-hidden="true" className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-input bg-pale-1 font-extrabold text-muted">{i + 1}</span><div><p className="m-0 font-extrabold">{t(h)}</p>{b && <p className="m-0 text-body-sm text-text-secondary">{t(b)}</p>}</div></li>)}</ol><p className="m-0 mt-4 text-body-sm text-text-tertiary">{t('calc.378')}</p></div>} />
      </CollapsibleSection>
      <CollapsibleSection id="incentives" tone="pale" title={t('calc.326')} subtitle={t('calc.327')}>
        <Incentives t={t} locale={locale} rateConfig={rateConfig} />
      </CollapsibleSection>
      <CollapsibleSection id="penalties" tone="light" title={t('calc.070')} subtitle={t('calc.071')}>
        <Penalties t={t} />
      </CollapsibleSection>
      <CollapsibleSection id="students" tone="pale" title={t('calc.072')} subtitle={t('calc.073')}>
        <Students t={t} />
      </CollapsibleSection>
      <FaqBlock bundle={bundle} locale={locale} id="faq" eyebrowId="calc.405" headingId="calc.383" bodyId="calc.384"
        items={Array.from({ length: 15 }, (_, i) => ({ id: `faq-${i + 1}`, q: t(`calc.${480 + 2 * i}`), a: t(`calc.${481 + 2 * i}`) }))}
        askCard={{ titleId: 'calc.380', bodyId: 'calc.381', whatsappNumber: bundle.settings.whatsappNumber, whatsappText: sys('calc.whatsapp.quoteGeneric'), whatsappLabelId: 'calc.052' }}
        footer={<ContactCta placement="page_cta" variant="secondary" href={mailLink(bundle.settings.email, t('calc.036'))}>{t('calc.406')} · {bundle.settings.email}</ContactCta>} />
```

with these additions before `return` (beside Cycle 3's):

```tsx
  const quotaLabels = pickLabels(t, QUOTA_IDS);
  const passLabels = pickLabels(t, PASS_IDS);
  const guideLabels = pickLabels(t, GUIDE_IDS);
  // the guide island resolves label IDS (role.labelId / industryLabelId) — hand it an id → text map
  const guideLabelMap = Object.fromEntries(roles.flatMap((r) => [[r.labelId, t(r.labelId)], ...(r.industryLabelId ? [[r.industryLabelId, t(r.industryLabelId)]] : [])]));
  const guideRows = roles.length ? buildGuideRows(roles, rateConfig, DEFAULT_INPUTS.sgkTier, locale, (id) => guideLabelMap[id] ?? id, { skilled: guideLabels.skilled, standard: guideLabels.standard }) : [];
  const guideScaleMinLabel = formatTRY(GUIDE_SCALE_MIN, locale);
  const guideScaleMaxLabel = roles.length ? formatTRY(guideScaleMax(roles), locale) : '';
  const defaultQuota = quotaCheck(DEFAULT_INPUTS.turkishStaff, DEFAULT_INPUTS.headcount, rateConfig.quotaRatio);
```

and a local `H2Block` in `page.tsx` (the visible section heading for sections whose body is an island):

```tsx
function H2Block({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8 max-md:sr-only">
      <h2 className="m-0 mb-3 text-h2 leading-[1.05] tracking-[-0.03em]">{title}</h2>
      <p className="m-0 text-body-lg text-text-secondary">{sub}</p>
    </div>
  );
}
```

In `SalaryGuideIsland`, the `t` passed to `buildGuideRows` is `(id) => roleLabels[id] ?? industryLabels[id] ?? id`, so the island's `roleLabels` prop is `guideLabelMap` (label id → text) and `industryLabels` is the industry-key → text map; both come from the page as shown.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/[locale]/(site)/hiring-cost-calculator"` → 7 files green (QuotaGateIsland: 2 tests — the fixture `RATE.quotaRatio` is 5; `Stepper` renders a native number input, so `getAllByRole('spinbutton')[0]` is the phone card's). `npm run verify` → green. `next build && next start -p 3100`, then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/a11y.spec.ts e2e/width-sweep.spec.ts` → zero axe violations on both new routes under both projects (every chip is a native radio; the quota block visualisation is `aria-hidden` with its sentence beside it; `Tabs` roving tabindex; the `CollapsibleSection` trigger has `aria-expanded`/`aria-controls`), no horizontal overflow at any of the nine widths (the compare table scrolls inside its own `overflow-x-auto`; the jump chips likewise).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator"
git commit -m "feat(calc): content sections — basis, tier-aware salary guide, compare, live quota gate + exemptions, in-browser pass check, incentives from rateConfig, penalties, students, FAQ (T3 c4)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — The "written quote" form (`calculator` door, W3), the sticky bar (W18), the closing band, the final `page.tsx`

- [ ] **Step 1: Write the failing test**

`e2e/pages/calculator.spec.ts` (the form case; the rest of the file is completed in Cycle 6):

```ts
import { test, expect } from '@playwright/test';

test.describe('Cost Calculator — quote form', () => {
  test('a valid submission shows the D11 fallback panel when no Operations door is configured', async ({ page }) => {
    // Deterministic: the gate runs without OPS_API_URL, so postForm answers { kind: 'unauthorized' }
    // and the FormShell renders the fallback panel instead of navigating to /tesekkurler.
    await page.goto('/maliyet-hesaplayici');
    const form = page.getByTestId('calc-quote-form');
    await form.scrollIntoViewIfNeeded();
    await form.locator('input[name="name"]').fill('Test Ziyaretçi');
    await form.locator('input[name="email"]').fill('test@example.com');
    await form.locator('input[name="consent"]').check();
    await form.getByRole('button', { name: /teklif/i }).click();
    await expect(page.getByTestId('form-fallback')).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/maliyet-hesaplayici');
    // the hidden estimate travels with the form (defaults when the island was never touched)
    await expect(form.locator('input[name="est_role"]')).toHaveAttribute('value', 'welder');
    await expect(form.locator('input[name="est_headcount"]')).toHaveAttribute('value', '1');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/calculator.spec.ts` → `getByTestId('calc-quote-form')` resolves to nothing: `Timeout … waiting for locator`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hiring-cost-calculator/actions.ts`:

```ts
'use server';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection, getRateConfig } from '@/content/collections';
import { createFormAction, type FormActionState } from '@/forms/action';
import { routing, type Locale } from '@/i18n/routing';
import { quoteSchema, toCalculatorFields } from './quote';

/** W3: the "written quote" door. The kernel validates, wraps the envelope, retries once and
 *  redirects to /thank-you?form=calculator; this file only maps the parsed form onto the
 *  catalog's ten `calculator` field names, recomputing the estimate on the server from the
 *  hidden inputs — a client total is never forwarded as fact. */
const run = createFormAction({
  key: 'calculator',
  schema: quoteSchema,
  toFields: async (p) => {
    const requested = await getLocale();
    const locale: Locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations({ locale, namespace: 'sys' })]);
    return toCalculatorFields(p, {
      locale,
      roles: getCollection(bundle, 'calculatorRoles'),
      rateConfig: getRateConfig(bundle),
      t: makeTf(bundle, locale),
      sys: (key, values) => sys(key, values),
    });
  },
});

export async function submitCalculatorQuote(prev: FormActionState, data: FormData) {
  return run(prev, data);
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateFields.tsx`:

```tsx
'use client';
import { ESTIMATE_FIELDS } from '../estimate-inputs';
import { useEstimateInputs } from './estimate-store';

/** Hidden inputs inside the FormShell mirroring the shared estimate state — the server action
 *  reparses and recomputes them (quote.ts). Prefixed `est_` so they can never be mistaken for a
 *  catalog field; the kernel's echo leaves them out of the WhatsApp prefill (not in WHATSAPP_FIELDS). */
export function EstimateFields() {
  const i = useEstimateInputs();
  const rows: [string, string][] = [
    [ESTIMATE_FIELDS.role, i.roleKey], [ESTIMATE_FIELDS.headcount, String(i.headcount)], [ESTIMATE_FIELDS.months, String(i.months)],
    [ESTIMATE_FIELDS.salary, i.grossSalary === null ? '' : String(i.grossSalary)], [ESTIMATE_FIELDS.tier, i.sgkTier],
    [ESTIMATE_FIELDS.flight, i.flight ? '1' : '0'], [ESTIMATE_FIELDS.housing, i.housing ? '1' : '0'],
    [ESTIMATE_FIELDS.support, i.supportOptIn ? '1' : '0'], [ESTIMATE_FIELDS.turkishStaff, String(i.turkishStaff)],
  ];
  return <>{rows.map(([name, value]) => <input key={name} type="hidden" name={name} value={value} readOnly />)}</>;
}
```

`src/app/[locale]/(site)/hiring-cost-calculator/_components/EstimateRecap.tsx` (the closing band's phone recap card, design lines 1538–1545):

```tsx
'use client';
import { useTranslations } from 'next-intl';
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import type { CardLabels } from '../calc-labels';
import { computeCardView } from '../card-view';
import { useEstimateInputs } from './estimate-store';

export function EstimateRecap({ locale, rateConfig, roles, labels, roleLabels, industryLabels, copy }: {
  locale: Locale; rateConfig: RateConfig; roles: CalculatorRole[]; labels: CardLabels; roleLabels: Record<string, string>; industryLabels: Record<string, string>;
  copy: { est: string; rough: string; fee: string };
}) {
  const sys = useTranslations('sys');
  const inputs = useEstimateInputs();
  const v = computeCardView(inputs, roles, rateConfig, locale, labels, roleLabels, industryLabels, (k, vals) => sys(k, vals));
  return (
    <div data-testid="calc-recap" className="mb-3 rounded-sm bg-navy p-4 text-left text-white md:hidden">
      <p className="m-0 mb-2 text-[11px] font-extrabold uppercase tracking-[1.1px] text-sky">{copy.est}</p>
      <div className="flex items-baseline justify-between gap-3 border-b border-white/15 pb-2"><span className="text-body-sm font-bold text-white/70">{v.totalTitle} · {v.headcountNote}</span><span className="text-[21px] font-extrabold tracking-[-0.5px]">{v.f.contract.total}</span></div>
      <div className="mt-2 flex items-baseline justify-between gap-3 text-body-sm"><span className="font-bold text-white/60">{copy.rough}</span><span className="font-extrabold text-sky">{v.f.monthly.total} {labels.perMonthSuffix}</span></div>
      <p className="m-0 mt-2 border-t border-white/15 pt-2 text-body-sm text-white/70">{copy.fee}</p>
    </div>
  );
}
```

The final `src/app/[locale]/(site)/hiring-cost-calculator/page.tsx` (replaces the Cycle 1 skeleton and the Cycle 3/4 insertions — this is the whole file):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection, getRateConfig } from '@/content/collections';
import { Breadcrumbs, ContactCta, EmptyState, FaqBlock, ImageSlot } from '@/design/blocks';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { Button, Section } from '@/design/primitives';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import { routing } from '@/i18n/routing';
import { effectiveFromLabel, effectiveYear, isReviewDue, quotaCheck, updatedAtLabel } from '@/lib/calculator';
import { mailLink, telLink, waLink } from '@/lib/contact';
import { formatTRY } from '@/lib/format/money';
import { buildMetadata } from '@/lib/seo/metadata';
import { submitCalculatorQuote } from './actions';
import { CARD_IDS, GUIDE_IDS, PASS_IDS, QUOTA_IDS, pickLabels } from './calc-labels';
import { computeCardView } from './card-view';
import { DEFAULT_INPUTS } from './estimate-inputs';
import { buildGuideRows, GUIDE_SCALE_MIN, guideScaleMax } from './salary-guide-rows';
import { CalculatorLoader } from './_components/CalculatorLoader';
import { CalculatorSkeleton } from './_components/CalculatorSkeleton';
import { CollapsibleSection } from './_components/CollapsibleSection';
import { EstimateFields } from './_components/EstimateFields';
import { EstimateRecap } from './_components/EstimateRecap';
import { PassCheck } from './_components/PassCheck';
import { QuotaGate } from './_components/QuotaGate';
import { SalaryGuide } from './_components/SalaryGuide';
import { SalaryGuideCards } from './_components/SalaryGuideCards';
import { B, Basis, Compare, Incentives, JumpChips, Penalties, QuotaGate2, Students } from './_sections/StaticSections';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  // bundle.pages.calc carries '' ids (no package SEO copy for this page, W23/W38) → sys.seo.calc.*
  return buildMetadata({ locale, href: '/hiring-cost-calculator', bundle, pageKey: 'calc', fallbackTitle: sys('seo.calc.title'), fallbackDescription: sys('seo.calc.description') });
}

function H2Block({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8 max-md:sr-only">
      <h2 className="m-0 mb-3 text-h2 leading-[1.05] tracking-[-0.03em]">{title}</h2>
      <p className="m-0 text-body-lg text-text-secondary">{sub}</p>
    </div>
  );
}

export default async function HiringCostCalculator({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeTf(bundle, locale); // W1: calc.050/101/104/381/481 carry {homepageReplyHours}
  const sysT = (key: string, values?: Record<string, string | number>) => sys(key, values);
  const rateConfig = getRateConfig(bundle); // throws in every env when absent (D17)
  const roles = getCollection(bundle, 'calculatorRoles');
  const countries = getCollection(bundle, 'countries').slice().sort((a, b) => a.name.localeCompare(b.name, locale));
  const { settings } = bundle;

  const cardLabels = pickLabels(t, CARD_IDS);
  const quotaLabels = pickLabels(t, QUOTA_IDS);
  const passLabels = pickLabels(t, PASS_IDS);
  const guideLabels = pickLabels(t, GUIDE_IDS);
  const roleLabels = Object.fromEntries(roles.map((r) => [r.key, t(r.labelId)]));
  const industryLabels = Object.fromEntries(roles.filter((r) => r.industryLabelId && r.industry).map((r) => [r.industry as string, t(r.industryLabelId as string)]));
  const guideLabelMap = Object.fromEntries(roles.flatMap((r) => [[r.labelId, t(r.labelId)], ...(r.industryLabelId ? [[r.industryLabelId, t(r.industryLabelId)]] : [])]));
  const defaultView = roles.length ? computeCardView(DEFAULT_INPUTS, roles, rateConfig, locale, cardLabels, roleLabels, industryLabels, sysT) : null;
  const guideRows = roles.length ? buildGuideRows(roles, rateConfig, DEFAULT_INPUTS.sgkTier, locale, (id) => guideLabelMap[id] ?? id, { skilled: guideLabels.skilled, standard: guideLabels.standard }) : [];
  const guideScaleMinLabel = formatTRY(GUIDE_SCALE_MIN, locale);
  const guideScaleMaxLabel = roles.length ? formatTRY(guideScaleMax(roles), locale) : '';
  const defaultQuota = quotaCheck(DEFAULT_INPUTS.turkishStaff, DEFAULT_INPUTS.headcount, rateConfig.quotaRatio);
  const badge = isReviewDue(rateConfig) ? null : sys('calc.hero.badge', { year: effectiveYear(rateConfig), month: effectiveFromLabel(rateConfig, locale) });
  const whatsappGeneric = waLink(settings.whatsappNumber, sys('calc.whatsapp.quoteGeneric'));

  return (
    <>
      <div className="relative overflow-hidden bg-navy pb-16 pt-14 xl:pb-[51px] xl:pt-[42px]">
        {/* D26: the only image slot sits under a 90–97 % navy gradient — never the LCP, never priority. */}
        <ImageSlot slot="calc-hero" alt="" width={1600} height={700} className="absolute inset-0 !h-full !w-full opacity-40" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,40,0.9)_0%,rgba(10,20,40,0.94)_45%,rgba(10,20,40,0.97)_100%)]" />
        <div className="container-site relative">
          <div className="mx-auto mb-8 max-w-[720px] text-center">
            <Breadcrumbs locale={locale} tone="dark" className="mb-3 justify-center text-white/55" items={[{ name: t('calc.001'), href: '/' }, { name: t('calc.002'), href: '/hiring-cost-calculator' }]} />
            {badge && (
              <p data-testid="calc-badge" className="mb-4 inline-flex items-center gap-2 rounded-pill border border-success/35 bg-success/10 px-4 py-1.5 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-[#86efac]">
                <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />{badge}
              </p>
            )}
            <h1 data-testid="page-h1" data-lcp-slot="h1" className="m-0 mb-4 text-h1 leading-[1.03] tracking-[-0.03em] text-white">
              {t('calc.004')} <span className="text-sky">{t('calc.005')}</span> {t('calc.006')}
            </h1>
            <p className="m-0 text-body-lg text-white/75">{t('calc.007')}</p>
          </div>
          <div id="calculator" className="print-isolate mx-auto max-w-[1080px] scroll-mt-5 overflow-hidden rounded-xl border border-tint-border bg-white shadow-[0_24px_60px_rgba(22,60,90,0.14)]">
            {roles.length === 0 || !defaultView ? (
              <EmptyState testId="calc-empty" title={sys('calc.empty.title')} body={sys('calc.empty.body')} cta={{ label: t('calc.105'), href: '#quote' }} />
            ) : (
              <>
                <CalculatorLoader locale={locale} rateConfig={rateConfig} roles={roles} labels={cardLabels} roleLabels={roleLabels} industryLabels={industryLabels} whatsappNumber={settings.whatsappNumber}
                  fallback={<CalculatorSkeleton view={defaultView} labels={cardLabels} inputs={DEFAULT_INPUTS} tierLabel={cardLabels.tierOther} activateLabel={sys('calc.skeleton.activate')} loadingLabel={sys('calc.skeleton.loading')} />} />
                <p className="m-0 border-t border-border-4 bg-pale-1 px-5 py-3 text-body-sm text-text-tertiary xl:px-[25px]">{t('calc.040')}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <StickyCtaBar message={t('calc.050')} hideNearId="calc-cta" live
        ctas={[
          { label: t('calc.051'), href: telLink(settings.phone), variant: 'secondary' },
          { label: t('calc.052'), href: whatsappGeneric, external: true, variant: 'secondary' },
          { label: t('calc.053'), href: '/hire-workers' },
        ]} />

      <JumpChips t={t} label={sys('calc.a11y.jumpNav')} />
      <CollapsibleSection id="basis" tone="light" title={t('calc.060')} subtitle={t('calc.061')}>
        <Basis t={t} updatedAt={updatedAtLabel(rateConfig, locale)} />
      </CollapsibleSection>
      <CollapsibleSection id="salaries" tone="pale" title={t('calc.062')} subtitle={t('calc.063')}>
        <H2Block title={t('calc.091')} sub={t('calc.092')} />
        <ul className="m-0 mb-5 flex list-none flex-wrap gap-4 p-0 text-body-sm font-bold text-text-tertiary">
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-2 w-6 rounded-pill bg-blue" />{t('calc.093')}</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-3 w-0.5 bg-ink" />{t('calc.094')} {formatTRY(rateConfig.legalMinGross, locale)}</li>
          <li>{t('calc.095')}</li>
        </ul>
        {roles.length > 0 && (
          <SalaryGuide locale={locale} roles={roles} rateConfig={rateConfig} labels={guideLabels} roleLabels={guideLabelMap} industryLabels={industryLabels} scaleMin={guideScaleMinLabel} scaleMax={guideScaleMaxLabel}
            fallback={<><div className="mb-5 flex flex-wrap gap-2" aria-hidden="true">{[t('calc.474'), ...Object.values(industryLabels)].map((l) => <span key={l} className="inline-flex min-h-[44px] items-center rounded-pill border border-border-1 bg-white px-4 text-body-sm font-bold text-text-secondary">{l}</span>)}</div><SalaryGuideCards rows={guideRows} activeKey={DEFAULT_INPUTS.roleKey} labels={guideLabels} scaleMin={guideScaleMinLabel} scaleMax={guideScaleMaxLabel} /></>} />
        )}
        <p className="m-0 mt-6 text-body-sm text-text-tertiary"><B>{t('calc.098')}</B> {t('calc.099')}</p>
      </CollapsibleSection>
      <CollapsibleSection id="compare" tone="light" title={t('calc.064')} subtitle={t('calc.065')}>
        <Compare t={t} locale={locale} rateConfig={rateConfig} />
      </CollapsibleSection>
      <CollapsibleSection id="quota" tone="pale" title={t('calc.066')} subtitle={t('calc.067')}>
        <H2Block title={t('calc.138')} sub={t('calc.139')} />
        <QuotaGate locale={locale} quotaRatio={rateConfig.quotaRatio} labels={quotaLabels}
          fallback={<div className="rounded-lg border border-border-2 bg-white p-6"><p className="m-0 font-extrabold">{t('calc.140')}</p><p className="m-0 mt-2 text-body-sm text-text-secondary">{t('calc.142')}: {DEFAULT_INPUTS.turkishStaff} · {t('calc.143')}</p><p className="m-0 mt-3 text-body-sm font-extrabold uppercase text-muted">{t('calc.427')}</p><p data-testid="quota-allowed" className="m-0 text-h2 font-extrabold text-success-text">{sys('calc.live.quotaAllowed', { n: defaultQuota.maxForeign })}</p><p className="m-0 mt-1 text-body-sm text-text-secondary">{t('calc.428')}</p><p className="m-0 mt-3 text-body-sm text-text-secondary">{t('calc.148')} <B>{DEFAULT_INPUTS.headcount}</B> {t('calc.149')} {t('calc.429')}</p></div>} />
        <QuotaGate2 t={t} sys={sysT} />
      </CollapsibleSection>
      <CollapsibleSection id="passcheck" tone="light" title={t('calc.068')} subtitle={t('calc.069')}>
        <H2Block title={t('calc.068')} sub={t('calc.382')} />
        <PassCheck locale={locale} rateConfig={rateConfig} roles={roles} roleLabels={roleLabels} labels={passLabels} whatsappNumber={settings.whatsappNumber}
          fallback={<div className="rounded-lg border border-border-2 bg-white p-6"><ol className="m-0 flex list-none flex-col gap-4 p-0">{([['calc.445', 'calc.446'], ['calc.448', null], ['calc.449', 'calc.450'], ['calc.452', null], ['calc.453', 'calc.454']] as const).map(([h, b], i) => <li key={h} className="flex gap-3"><span aria-hidden="true" className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-input bg-pale-1 font-extrabold text-muted">{i + 1}</span><div><p className="m-0 font-extrabold">{t(h)}</p>{b && <p className="m-0 text-body-sm text-text-secondary">{t(b)}</p>}</div></li>)}</ol><p className="m-0 mt-4 text-body-sm text-text-tertiary">{t('calc.378')}</p></div>} />
      </CollapsibleSection>
      <CollapsibleSection id="incentives" tone="pale" title={t('calc.326')} subtitle={t('calc.327')}>
        <Incentives t={t} locale={locale} rateConfig={rateConfig} />
      </CollapsibleSection>
      <CollapsibleSection id="penalties" tone="light" title={t('calc.070')} subtitle={t('calc.071')}>
        <Penalties t={t} />
      </CollapsibleSection>
      <CollapsibleSection id="students" tone="pale" title={t('calc.072')} subtitle={t('calc.073')}>
        <Students t={t} />
      </CollapsibleSection>
      <FaqBlock bundle={bundle} locale={locale} id="faq" eyebrowId="calc.405" headingId="calc.383" bodyId="calc.384"
        items={Array.from({ length: 15 }, (_, i) => ({ id: `faq-${i + 1}`, q: t(`calc.${480 + 2 * i}`), a: t(`calc.${481 + 2 * i}`) }))}
        askCard={{ titleId: 'calc.380', bodyId: 'calc.381', whatsappNumber: settings.whatsappNumber, whatsappText: sys('calc.whatsapp.quoteGeneric'), whatsappLabelId: 'calc.052' }}
        footer={<ContactCta placement="page_cta" variant="secondary" href={mailLink(settings.email, t('calc.036'))}>{t('calc.406')} · {settings.email}</ContactCta>} />

      {/* #calc-cta (design 1534–1553) — the closing band now carries the W3 quote form. */}
      <Section id="calc-cta" tone="pale" className="border-t border-tint-border">
        <div className="container-site">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="m-0 mb-3 text-h2 leading-[1.05] tracking-[-0.03em]">{t('calc.100')}</h2>
            <p className="mx-auto mb-7 max-w-[600px] text-body-lg text-text-secondary">{t('calc.101')}</p>
            {roles.length > 0 && (
              <EstimateRecap locale={locale} rateConfig={rateConfig} roles={roles} labels={cardLabels} roleLabels={roleLabels} industryLabels={industryLabels} copy={{ est: t('calc.102'), rough: t('calc.103'), fee: t('calc.104') }} />
            )}
            <div id="quote" className="mx-auto max-w-[640px] scroll-mt-6 rounded-xl border border-tint-border bg-white p-6 text-left shadow-card">
              <FormShell action={submitCalculatorQuote} formKey="calculator" locale={locale} testId="calc-quote-form"
                turnstileSiteKey={settings.turnstileSiteKey} whatsappNumber={settings.whatsappNumber}
                contact={{ phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email }}
                submitLabel={t('calc.105')}>
                <EstimateFields />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="name" required autoComplete="name" />
                  <Field name="email" type="email" required autoComplete="email" inputMode="email" />
                  <Field name="phone" type="tel" autoComplete="tel" inputMode="tel" />
                  <Field name="company" autoComplete="organization" />
                </div>
                <Field name="country" as="select" autoComplete="country" options={countries.map((c) => ({ value: c.code, label: c.name }))} />
                <Field name="message" as="textarea" rows={3} />
              </FormShell>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button variant="secondary" size="lg" href="/available-workers">{t('calc.106')}</Button>
            </div>
            <p className="m-0 mt-6 text-body-sm text-text-tertiary">
              JobsAdmire · {t('calc.418')} · {t('calc.420')} ·{' '}
              <ContactCta placement="page_cta" variant="ghost" size="md" href={mailLink(settings.email)}>{settings.email}</ContactCta>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
```

Notes for the implementer: (a) `Field name="country"` — the WP2a `Field` prepends the `sys.form.placeholders.select` empty option itself; its label is `sys.form.labels.country`, its hint `sys.form.hints.optional` (non-required) — pass nothing. (b) The `consent` mode stays the kernel default `checkbox` (the visitor ticks `sys.form.consent.label`); the door records `CONSENT_VERSION`. (c) `EstimateFields` renders `readOnly` hidden inputs, so React never warns about a controlled input without a handler. (d) The `#quote` id is what `calc.036`, `calc.011` and the empty state link to; `#calc-cta` is what `StickyCtaBar` hides near (W18). (e) The sticky bar's `tel:`/`wa.me` CTAs render through the chrome's `Button` — see **Foundation gaps** at the end. (f) `Button href="/available-workers"` is a `pathnames` key; the route 404s through the catch-all until T9 lands (W20 — the same is already true of the nav).

- [ ] **Step 4: Run tests + `npm run verify`**

`npm run verify` → green (`actions.ts` exports only an async function — the `'use server'` rule; `quote.ts` stays pure). `next build && next start -p 3100` → `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/calculator.spec.ts` → the fallback case passes in both projects (`data-testid="form-fallback"` after submit; URL unchanged; hidden inputs at the defaults). With a real door (`OPS_API_URL` + `OPS_WEBSITE_TEST_TOKEN` in `.env.local`, the module ON) the same submit lands on `/tesekkurler?form=calculator` and the Ops inbox shows `[website:calculator]` with `headcount: 1`, `trade: Kaynakçı (welder)`, `durationMonths: 12` and the eleven-line `estimateSummary` — recorded in the ledger as observed or as "door OFF at execution time".

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hiring-cost-calculator" e2e/pages/calculator.spec.ts
git commit -m "feat(calc): written-quote form → calculator door with server-recomputed estimateSummary, sticky bar, closing band (W3/W18, T3 c5)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 6 — Page e2e, the gate, JS size, pixel harness, docs, ledger

- [ ] **Step 1: Write the failing test** — complete `e2e/pages/calculator.spec.ts` (keep the Cycle 5 describe; add these):

```ts
const ORIGIN = 'https://www.jobsadmire.com';
const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;

for (const [route, lang, alt] of [
  ['/maliyet-hesaplayici', 'tr', '/en/hiring-cost-calculator'],
  ['/en/hiring-cost-calculator', 'en', '/maliyet-hesaplayici'],
] as const) {
  test.describe(`Cost Calculator ${route}`, () => {
    test('renders the page contract, the key sections, and no leaked tokens', async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByTestId('page-h1')).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
      // the hero image slot is a named placeholder that is NOT the LCP element (D26/W55)
      await expect(page.locator('[data-placeholder="calc-hero"]')).toHaveCount(1);
      for (const id of ['calc-card', 'calc-jump', 'calc-salary-guide', 'calc-quota', 'calc-passcheck', 'calc-quote-form', 'calc-updated']) {
        await expect(page.getByTestId(id)).toHaveCount(1);
      }
      for (const anchor of ['calculator', 'quote', 'calc-cta', 'basis', 'salaries', 'compare', 'quota', 'passcheck', 'incentives', 'penalties', 'students', 'faq']) {
        await expect(page.locator(`#${anchor}`)).toHaveCount(1);
      }
      expect(await page.locator('body').innerText()).not.toMatch(LEAK);
      // the skeleton already shows the model's default totals (server-rendered, W2 floor)
      await expect(page.getByTestId('calc-year-total')).toContainText(lang === 'tr' ? '751.852 ₺' : '₺751,852');
    });

    test('the language alternates point at the counterpart page', async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(`link[hreflang="${lang === 'tr' ? 'en' : 'tr'}"]`)).toHaveAttribute('href', `${ORIGIN}${alt}`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}${route}`);
      expect(await page.locator(`a[href="${alt}"]`).count()).toBeGreaterThan(0);
      // BreadcrumbList + FAQPage nodes are server-rendered (docs/SEO.md)
      const html = await (await page.request.get(route)).text();
      expect(html).toContain('"@type":"BreadcrumbList"');
      expect(html).toContain('"@type":"FAQPage"');
    });

    test('the calculator island loads on interaction and recomputes', async ({ page }) => {
      await page.goto(route);
      await page.getByTestId('calc-activate').click();
      await expect(page.getByTestId('calc-island')).toBeVisible();
      await expect(page.getByTestId('calc-card')).toHaveAttribute('data-island', 'ready');
      await page.getByLabel('5', { exact: true }).check();
      await expect(page.getByTestId('calc-monthly-total')).toContainText(lang === 'tr' ? '301.605 ₺' : '₺301,605');
      // the hidden estimate now carries the new headcount
      await expect(page.locator('input[name="est_headcount"]')).toHaveAttribute('value', '5');
    });
  });
}

test('opening the page at #calculator mounts the island without a click (header CTA, W17)', async ({ page }) => {
  await page.goto('/maliyet-hesaplayici#calculator');
  await expect(page.getByTestId('calc-island')).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails** — before the docs/gate work nothing here is red on purpose; run `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/calculator.spec.ts` against the Cycle 5 build to confirm all 8 cases pass in both projects (if `calc-updated` or an anchor is missing, fix the page, not the spec).

- [ ] **Step 3: Implement — gate, measurements, docs**

1. Full local gate: `next build && next start -p 3100` then `E2E_BASE_URL=http://localhost:3100 npm run gate` → Playwright green (routing page-contract loop now covers the two routes; a11y + width sweep over them; seo sitemap sweep answers 200), Lighthouse on `/maliyet-hesaplayici` and `/en/hiring-cost-calculator`: performance ≥ 0.95, a11y/BP/SEO = 1.0, `resource-summary:script:size` ≤ 204 800 B (LCP is a warning locally, R50). `npm run js-size` → paste the two rows. If a route is above **194 560 B** (`LAZY_LINE`), move `CollapsibleSection`'s nine instances behind one boundary or make `EstimateRecap` load on view before proceeding (W13 amended).
2. Preview gate: push the branch, `E2E_BASE_URL=https://<preview>.vercel.app npm run gate` — the binding run (LCP is an error there).
3. Pixel harness (D27): `npm run pixel -- --page=calc --locale=tr --base=https://<preview>.vercel.app` and `--locale=en`; record `match` per width (390/900/1440) in the ledger; at most two fix iterations against the named deltas above.
4. Placeholder counter: `E2E_BASE_URL=… npx tsx scripts/placeholder-count.ts` → both routes: `lcpSlot: 'h1'`, `placeholders: ['calc-hero']`, no problems.
5. Docs (same commit):
   - `docs/SEO.md` § Metadata (after the paragraph at line 7): if no `### Pages` table exists yet, add one with the header `| Route | Title source | Canonical | JSON-LD | LCP slot |` / `| --- | --- | --- | --- | --- |`; append the row: `| \`/maliyet-hesaplayici\` · \`/en/hiring-cost-calculator\` | \`sys.seo.calc.*\` (the package ships no SEO copy; \`bundle.pages.calc\` ids are \`''\`) | self, per locale | BreadcrumbList (Breadcrumbs), FAQPage (FaqBlock, 15 pairs calc.480–509) | \`h1\` (\`calc-hero\` is a named placeholder under the gradient, never the LCP — D26) |`.
   - `docs/ANALYTICS.md` § Event schema: in the `calculator_use` row (line 61) replace "Hiring-cost calculator interaction" with "Cost Calculator island: a role change (select, bottom sheet, salary-guide "Use in calculator") or a headcount commit (stepper, preset chip); `role` = the stable role key, `headcount` = the integer — never the slider value or free text"; in the paragraph after the table replace "The other six … have no caller" wording (whatever T0c/T1/T2 left) with a sentence stating that `calculator_use` is fired by `/maliyet-hesaplayici`'s island as of T3, and that the design's `calc_print`, `calc_months`, `calc_sgk_tier`, `quota_check`, `quota_exemption_tab`, `passcheck_answer` events were **not** ported (W12: not in the allow-list).
   - `docs/CONTENT-MODEL.md` § Adding copy (W9, W23, W54), after the paragraph at line 74: add `- **\`sys.calc.*\`** (Cost Calculator, T3): \`hero.badge\` (D17, filled from \`rateConfig\`), \`live.*\` — the design's 23 \`GEN\` sentence templates as 21 ICU messages (\`quotaOne\`/\`quotaMany\` folded into the \`quotaAllowed\` plural; \`qvExact\` unreachable in the design's own code and dropped), \`exemptions.badge.*\` (7 badges the package lacks), \`summary.*\` (the \`estimateSummary\` line labels), \`whatsapp.*\` prefills, \`skeleton.*\`, \`empty.*\`, \`a11y.*\`, \`passcheck.unanswered\`; \`sys.seo.calc.*\`. Read by the page through \`getTranslations('sys')\` and by the islands through \`useTranslations('sys')\`; never through \`t()\`.`
   - `docs/PRD.md` page table line 21: change the "Forms carried" cell to `Written-quote form (\`CALCULATOR_QUOTE\`, W3: name*/email*/phone/company/country + server-recomputed \`estimateSummary\`); pass check and quota check run in the browser only (calc.378)`.
   - `docs/superpowers/plans/2026-09-20-wp2b-pages.md` ledger line (append under the ledger heading): `T3 Cost Calculator — /maliyet-hesaplayici · /en/hiring-cost-calculator — script (gz) TR ___ B / EN ___ B (ceiling 204 800; lazy line 194 560) — Lighthouse TR __/__/__/__ EN __/__/__/__ (perf/a11y/bp/seo), LCP __ ms — pixel calc-tr 390/900/1440 = __/__/__ %, calc-en = __/__/__ % (iterations: _/2) — door state at execution: ON|OFF — deltas: the seven named above.`

- [ ] **Step 4: Run tests + `npm run verify`** — `npm run verify` green; `npx prettier --check docs` clean; `E2E_BASE_URL=<preview> npm run gate` green; ledger numbers filled.

- [ ] **Step 5: Commit**

```bash
git add e2e/pages/calculator.spec.ts docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "test(calc): page e2e (contract, sections, alternates, island load, form fallback); docs + ledger for the Cost Calculator (T3 c6)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/SEO.md` (Pages row: title source `sys.seo.calc.*`, self canonical, BreadcrumbList + FAQPage, LCP slot `h1`), `docs/ANALYTICS.md` (`calculator_use` row + the wired/not-ported sentence), `docs/CONTENT-MODEL.md` (`sys.calc.*` namespace line), `docs/PRD.md` (page-table row 3 forms cell), `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (ledger line).

**Sys keys added (53):** `sys.seo.calc.title`, `sys.seo.calc.description`, `sys.calc.hero.badge`, `sys.calc.skeleton.activate`, `sys.calc.skeleton.loading`, `sys.calc.empty.title`, `sys.calc.empty.body`, `sys.calc.a11y.headcountPresets`, `sys.calc.a11y.industryFilter`, `sys.calc.a11y.jumpNav`, `sys.calc.a11y.decrease`, `sys.calc.a11y.increase`, `sys.calc.live.quotaAllowed`, `sys.calc.live.quotaMsgNo`, `sys.calc.live.quotaMsgMore`, `sys.calc.live.quotaVsOver`, `sys.calc.live.vCount`, `sys.calc.live.ckQuoOk`, `sys.calc.live.ckQuoNo`, `sys.calc.live.ckQuoF`, `sys.calc.live.ckSalB`, `sys.calc.live.ckSalF`, `sys.calc.live.vAmberN`, `sys.calc.live.vRedN`, `sys.calc.live.qvNone`, `sys.calc.live.qvFull`, `sys.calc.live.qvPart`, `sys.calc.live.qvCap`, `sys.calc.live.forWorkers`, `sys.calc.live.threshold`, `sys.calc.live.seasonTotal`, `sys.calc.live.yearNote`, `sys.calc.live.nMonths`, `sys.calc.exemptions.badge.tenStaff`, `sys.calc.exemptions.badge.twentyStaff`, `sys.calc.exemptions.badge.upTo5`, `sys.calc.exemptions.badge.full`, `sys.calc.exemptions.badge.timing`, `sys.calc.exemptions.badge.upTo3`, `sys.calc.exemptions.badge.exceptional`, `sys.calc.passcheck.unanswered`, `sys.calc.whatsapp.quote`, `sys.calc.whatsapp.quoteGeneric`, `sys.calc.whatsapp.passCheck`, `sys.calc.summary.role`, `sys.calc.summary.workers`, `sys.calc.summary.contract`, `sys.calc.summary.salary`, `sys.calc.summary.sgkTier`, `sys.calc.summary.covered`, `sys.calc.summary.none`, `sys.calc.summary.total`, `sys.calc.summary.rates`. (The design's 23 `GEN` templates map onto the 21 `live.*` keys: `quotaOne`+`quotaMany` → `quotaAllowed`; `qvExact` is dead code in the design and not ported; `perMonthSuffix`/`perMoShort`/`pcConfirm` exist as `calc.464`/`calc.465`/`calc.444`.)

**Package ids used:** 514 of the page's 561 — first `calc.001`, last `calc.555` (`calc.541`–`calc.547` and `calc.551`–`calc.554` resolve through the `calculatorRoles` rows' `labelId`/`industryLabelId`, plus `hire.093`, `hire.107`, `hire.112` the same way; `calc.480`–`calc.509` through the FAQ loop). The 47 not rendered, with the reason: `calc.003` (superseded by `sys.calc.hero.badge` filled from `rateConfig`, D17); `calc.415`–`calc.417` (percentages rendered from `rateConfig.sgkRates`, D17); `calc.074`/`calc.075` (the FAQ's phone accordion labels — `FaqBlock` owns its own section chrome); `calc.410` (the doubled agent fine — already spelled inside `calc.117`); `calc.324` (the header CTA, resolved by `CTA_BY_PATHNAME`, T0c); `calc.556` (lower-case "welder" duplicate); `calc.557`–`calc.561` (worked samples, not templates); and the chrome copy the chrome reads through its canonical ids (R15): `calc.107`, `calc.108`, `calc.311`–`calc.323`, `calc.325`, `calc.390`–`calc.398`, `calc.400`–`calc.404`, `calc.412`, `calc.414`, `calc.419`.

**Foundation gaps:** (1) `StickyCtaBar` renders its `tel:`/`wa.me` CTAs through the plain `Button` — no `useContactClick`, and `PARAM_ENUMS.placement` has no sticky-bar value — so the sticky bar's call/WhatsApp clicks on this page (and on every page that mounts the bar) fire no `call_click`/`whatsapp_click`; needs a one-line chrome change (`ContactLink` inside the bar + a `sticky_bar` placement enum + docs/ANALYTICS.md) rather than a page workaround. (2) `FaqBlock.askCard` has no e-mail row (the design's card shows WhatsApp + e-mail); this task renders the e-mail as the block's `footer` `ContactCta`. Everything else consumed exists in produces-final.md as spelled.
