### Task 2: Hire Workers — `/isci-talebi` · `/en/hire-workers` (pixel-harness page, D27)

**Why this task exists.** The route is the site's main employer conversion page (design-package page 2). WP1 shipped it as a spike (`<h1>{locale}</h1>`, moved into `(site)/` by T0c and tagged `page-h1`/`data-lcp-slot="h1"` by T0e). This task replaces the spike with the designed page on the WP2a foundation: two `hire` forms through the forms kernel (W3 — the quick-quote gains a required contact `name` and `email`; `city` rides as the catalog v1.1 field, W16), the `sectors`/`sourceCountries`/`countries`/`metrics` collections (W1), the pre-rendered `SourceMap` + flag sprite (W14), the blocks (`Breadcrumbs`, `FaqBlock`, `ProcessSteps`, `ImageSlot`, `StoreBadges`, `LogoMarquee`, `ContactCta`), the `StickyCtaBar` with its W18 height variable, and the D26 LCP/placeholder markup contract. Every number is a metric (W1/D17), every string is a package id read through `makeTf` or a `sys.hire.*` key (W9/W23), every option value is a stable key (W3), every contact anchor fires its click event with a placement (W12).

**Route facts (read before touching anything):** internal key `/hire-workers` → TR `/isci-talebi`, EN `/en/hire-workers` (`src/i18n/routing.ts` line 9). The page record `bundle.pages.hire` carries `titleId: 'hire.264'`, `descriptionId: 'hire.265'` (T0b) — so **no `sys.seo.hire.*` keys are added** (W23: only where the package has no SEO strings). `CTA_BY_PATHNAME` has **no** entry for `/hire-workers` → the header renders `DEFAULT_CTAS` (`home.014`+`home.015` → `{ pathname: '/hire-workers', hash: '#request-form' }`), so this page **must render the element id `request-form`** (T0c contract). `e2e/routes.ts` already lists `/isci-talebi` and `/en/hire-workers` as indexable (T0e) and `UNBUILT_PATHNAMES` never contained `/hire-workers` — this task **adds no route and deletes no key**; Cycle 5 asserts both facts instead of editing them.

**Design deltas this page carries (named, so the pixel harness tolerates them — D20/D27):** (1) success navigates to `/tesekkurler?form=hire` instead of the inline "Request sent" panel (`hire.045`/`046` unused) and the full form's submit reads `sys.hire.form.submit` instead of `hire.216` "Send Request on WhatsApp →" (D13; `hire.201`/`203`/`215` are rendered as authored — `hire.201` is legal-flagged); (2) the quick-quote card gains a required **Contact person** and the door's KVKK line comes from `sys.form.consent.notice` (the shell has no consent-copy prop — `hire.064`/`065`/`217`/`218` unused, see Foundation gaps); (3) the full form gains an optional **Message** textarea (the brief names `message`; it replaces the free text the WhatsApp mock flow carried); (4) the industries rows use the foundation `Accordion` (string trigger), so the four visible role chips sit inside the panel with the "More roles" chips rather than in the trigger row (an interactive arrow nested in a clickable row fails axe); (5) the sourcing map is the build-time SVG with no hover tooltip (W14); (6) the client-logo band renders nothing until logos with consent exist (§10 #11, W6); (7) the hero photo slot is a placeholder until the licensed stock pack lands (§10 #4) — the h1 is the LCP element until then; (8) `hire.043` renders as corrected by the importer's override table (W7).

**Files:**

Create
- `src/app/[locale]/(site)/hire-workers/actions.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/tables.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/fragments.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/phone.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/hire-spec.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/assets.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/metric.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/tables.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/fragments.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/phone.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/hire-spec.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/hire-workers/_components/DialSelect.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hire-workers/_components/SectorPrefillLink.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hire-workers/_components/__tests__/DialSelect.test.tsx`
- `src/app/[locale]/(site)/hire-workers/_components/__tests__/SectorPrefillLink.test.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Hero.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/QuickQuote.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/JumpNav.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/ClientLogos.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Industries.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/SourceCountries.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Comparison.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Process.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/PortalPreview.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Faq.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/RequestForm.tsx`
- `e2e/pages/hire-workers.spec.ts`

Modify
- `src/app/[locale]/(site)/hire-workers/page.tsx` — replace the whole file (the WP1 spike as moved by T0c and tagged by T0e: lines 1–end)
- `src/messages/tr.json`, `src/messages/en.json` — add the `sys.hire` object (7 keys) beside `sys.form`/`sys.seo`
- `docs/SEO.md` — the per-page table row
- `docs/ANALYTICS.md` — the "events wired per page" line for this route
- `docs/CONTENT-MODEL.md` — the `sys.hire.*` namespace line under "The `sys.*` range"
- `docs/PRD.md` — the Hire Workers row: quick-quote listed as a second `hire` instance (it is not in row 2 today)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the ledger line

Test
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/*.test.ts` (5 files, Vitest)
- `src/app/[locale]/(site)/hire-workers/_components/__tests__/*.test.tsx` (2 files, Vitest + RTL)
- `e2e/pages/hire-workers.spec.ts` (Playwright, both projects)
- existing, must stay green untouched: `e2e/routing.spec.ts`, `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts`, `src/lib/seo/unbuilt.test.ts`, `src/messages/messages.test.ts`

**Interfaces:**

Consumes (exact names from produces-final.md / WP1):
- WP1: `getBundle`, `makeT` (`@/content/adapter`, server-only; `adapter` re-exports `pure.ts`, so `makeTf`/`metricValues` are importable from it too), `routing`, `Locale`, `Link`, `Href` (`@/i18n/navigation`), `buildMetadata` (`@/lib/seo/metadata`), `waLink`/`telLink`/`mailLink` (`@/lib/contact`), `formatInt` (`@/lib/format/money`), `Accordion`, `Button`, `Card`, `Eyebrow`, `PausableMarquee`, `Section`, `FormField` (`@/design/primitives`), `sys.marquee.pause/play`, `sys.whatsapp.prefill`, `FormKey` (`@/analytics/forms`).
- T0b (`@/content/collections`, `@/content/pure`): `getCollection(bundle, 'sectors' | 'sourceCountries' | 'countries')`, `getMetric(bundle, 'placed' | 'countries' | 'employers')`, `Metric`, `Sector`, `SECTOR_KEYS`, `SectorKey`, `Country`, `SourceCountry`, `makeTf(bundle, locale)`, `getPageSeo`.
- T0a (`@/forms/*`): `createFormAction`, `FormActionError`, `FormActionState` (`@/forms/action`), `FormShell` (`@/forms/client/FormShell`), `Field`, `INPUT_CLASS`, `FieldOption` (`@/forms/client/Field`), `useFieldError`, `useFieldValue` (`@/forms/client/FormErrorsContext`), the `sys.form.labels.{name,email,phone,company,city,sector,headcount,startWhen,roleNeeded,message}` / `placeholders.*` / `hints.optional` / `consent.notice` / `errors.*` copy, the `data-testid="form-fallback"` panel.
- T0c: `Breadcrumbs`-side `ContactLink` (`@/analytics/ContactLink`), `PARAM_ENUMS.placement` values `page_cta`, `DEFAULT_CTAS` contract (`#request-form`), `(site)` route group.
- T0d blocks (`@/design/blocks`): `Breadcrumbs`, `Crumb`, `FaqBlock`, `FaqItem`, `FaqAskCard`, `ProcessSteps`, `ProcessStep`, `ImageSlot`, `StoreBadges`, `LogoMarquee`, `Logo`, `ContactCta`; primitives extension `Section` tones `pale`/`band`, `Button` variant `inverse`; `StickyCtaBar`, `StickyCta` (`@/design/chrome/StickyCtaBar`).
- T0d assets: `SourceMap`, `sourceMapLabels` (`@/design/assets/source-map`), `Flag` (`@/design/Flag`), `isFlagCode` (`@/design/assets/flag-codes`).
- T0e: `GATE_ROUTE_TABLE`/`INDEXABLE_GATE_ROUTES` (`e2e/routes.ts` — read only), `npm run js-size`, `npm run pixel -- --page=hire`, the page markup contract (`page-h1`, one `data-lcp-slot`, named `data-placeholder`s).
- T0f catalog v1.1 `hire` fields: `name*`, `company*`, `email*`, `phone*`, `city` (≤120), `sector` (≤120), `roleNeeded` (≤200), `headcount` (≤10), `startWhen` (≤120), `message` (≤5000). Not sent: `country`, `iAm` (optional; the design never asks).

Produces: nothing later tasks import. The Partner task (HR-agency track → `hire`) may copy the `phone.ts`/`DialSelect` pattern; it must copy, not import across route folders.

---

#### Cycle 1 — page-local tables, fragment joiner, phone composer, form spec, sys keys (pure code, red → green)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/tables.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { SECTOR_KEYS } from '@/content/collections';
import {
  COMPARE_ROWS,
  FAQ_PAIRS,
  INDUSTRIES,
  PROCESS_STEPS,
  START_WHEN_OPTIONS,
} from '../tables';

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `hire.${String(from + i).padStart(3, '0')}`);

describe('INDUSTRIES (design rows 01–06 → sectors collection keys)', () => {
  it('lists the six placeable sectors in design order, never `other`', () => {
    expect(INDUSTRIES.map((r) => r.key)).toEqual([
      'factory',
      'construction',
      'tourism',
      'agriculture',
      'textile',
      'logistics',
    ]);
    for (const row of INDUSTRIES) expect(SECTOR_KEYS).toContain(row.key);
  });

  it('uses every one of the 41 role ids hire.089–hire.129 exactly once', () => {
    const used = INDUSTRIES.flatMap((r) => [...r.visibleRoleIds, ...r.moreRoleIds]);
    expect(new Set(used).size).toBe(used.length);
    expect([...used].sort()).toEqual(range(89, 129));
  });

  it('carries the six per-sector CTA ids hire.130–135 in order', () => {
    expect(INDUSTRIES.map((r) => r.ctaId)).toEqual(range(130, 135));
  });
});

describe('COMPARE_ROWS', () => {
  it('is 5 + 5 title/body pairs over hire.150–169 in order', () => {
    expect(COMPARE_ROWS.own.map((r) => r.titleId)).toEqual([150, 152, 154, 156, 158].map((n) => `hire.${n}`));
    expect(COMPARE_ROWS.own.map((r) => r.bodyId)).toEqual([151, 153, 155, 157, 159].map((n) => `hire.${n}`));
    expect(COMPARE_ROWS.with.map((r) => r.titleId)).toEqual([160, 162, 164, 166, 168].map((n) => `hire.${n}`));
    expect(COMPARE_ROWS.with.map((r) => r.bodyId)).toEqual([161, 163, 165, 167, 169].map((n) => `hire.${n}`));
  });
});

describe('PROCESS_STEPS', () => {
  it('is six numbered steps over hire.271–288 (when, title, body per step)', () => {
    expect(PROCESS_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PROCESS_STEPS.flatMap((s) => [s.whenId, s.titleId, s.bodyId])).toEqual(range(271, 288));
  });
});

describe('FAQ_PAIRS', () => {
  it('is seven q/a pairs over hire.289–302', () => {
    expect(FAQ_PAIRS).toHaveLength(7);
    expect(FAQ_PAIRS.flatMap((p) => [p.qId, p.aId])).toEqual(range(289, 302));
    expect(new Set(FAQ_PAIRS.map((p) => p.id)).size).toBe(7);
  });
});

describe('START_WHEN_OPTIONS (stable keys, W3)', () => {
  it('maps four stable keys onto hire.059–062', () => {
    expect(START_WHEN_OPTIONS.map((o) => o.key)).toEqual(['asap', '1-2m', '3m+', 'planning']);
    expect(START_WHEN_OPTIONS.map((o) => o.labelId)).toEqual(range(59, 62));
    for (const o of START_WHEN_OPTIONS) expect(o.key.length).toBeLessThanOrEqual(120);
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/fragments.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { sp } from '../fragments';

describe('sp — the joiner between two package fragments the design glues with {{ }}', () => {
  it('inserts one space between two words', () => {
    expect(sp('Hire verified overseas', 'workers')).toBe(' ');
    expect(sp("Türkiye'de", 'belgeli yabancı işçi')).toBe(' ');
  });
  it('inserts nothing before closing punctuation or after trailing whitespace', () => {
    expect(sp('470+ placements', ', Türkiye…')).toBe(''); // hire.191 + hire.192 (TR)
    expect(sp('hiring cost calculator', '.')).toBe(''); // hire.178 + hire.179 (EN)
    expect(sp('Vetted talent from ', '13')).toBe('');
  });
  it('inserts nothing when either side is empty (hire.141 TR is deliberately empty)', () => {
    expect(sp('', '13')).toBe('');
    expect(sp('13', '')).toBe('');
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/phone.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { composePhone, dialForCode, normalisePhone } from '../phone';

const countries = [
  { code: 'TR', name: 'Türkiye', dial: '+90' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'US', name: 'United States', dial: '+1' },
];

describe('dialForCode', () => {
  it('returns the dial for a known ISO2 code and null otherwise', () => {
    expect(dialForCode(countries, 'PK')).toBe('+92');
    expect(dialForCode(countries, 'tr')).toBe('+90'); // case-insensitive at the edge
    expect(dialForCode(countries, 'XX')).toBeNull();
    expect(dialForCode(countries, '')).toBeNull();
  });
});

describe('composePhone (full form: dial select + national number)', () => {
  it('concatenates dial + digits, dropping a Turkish trunk 0 and formatting noise', () => {
    expect(composePhone('+90', '0532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '(532) 000-00-00')).toBe('+905320000000');
    expect(composePhone('+92', '300 1234567')).toBe('+923001234567');
  });
  it('does not double the dial when the visitor typed it into the number too', () => {
    expect(composePhone('+90', '+90 532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '0090 532 000 00 00')).toBe('+905320000000');
  });
  it('keeps a bare digit string when the dial is empty (never invents one)', () => {
    expect(composePhone('', '5320000000')).toBe('5320000000');
  });
});

describe('normalisePhone (quick form: one free-text field, no dial)', () => {
  it('keeps an international number, strips noise', () => {
    expect(normalisePhone('+90 532 000 00 00')).toBe('+905320000000');
    expect(normalisePhone('0090 532 000 00 00')).toBe('+905320000000');
  });
  it('treats an 11-digit 0-led number as Turkish national (the page is Türkiye-only)', () => {
    expect(normalisePhone('0532 000 00 00')).toBe('+905320000000');
  });
  it('leaves anything else as digits only, so the door decides (≥ 8 digits rule)', () => {
    expect(normalisePhone('532 000 00 00')).toBe('5320000000');
    expect(normalisePhone('abc')).toBe('');
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/hire-spec.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { FormActionError } from '@/forms/action';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { fullSchema, fullToFields, quickSchema, quickToFields } from '../hire-spec';

const countries = [
  { code: 'TR', name: 'Türkiye', dial: '+90' },
  { code: 'DE', name: 'Germany', dial: '+49' },
];

describe('quickSchema / quickToFields (hero quick-quote → `hire`)', () => {
  const ok = {
    company: 'Acme Tekstil A.Ş.',
    name: 'Ayşe Yılmaz',
    city: 'Bursa',
    roleNeeded: 'kaynakçı, paketleme',
    headcount: '12',
    phone: '0532 000 00 00',
    email: 'AYSE@ACME.COM.TR',
  };

  it('accepts the designed fields plus the W3 contact name', () => {
    expect(quickSchema.safeParse(ok).success).toBe(true);
  });

  it('reads empty values as `required` before any format rule (email, phone, headcount)', () => {
    const r = quickSchema.safeParse({ ...ok, name: '', email: '', phone: '', headcount: '' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrorsFromIssues(r.error.issues);
      expect(errors).toMatchObject({ name: 'required', email: 'required', phone: 'required', headcount: 'required' });
    }
  });

  it('flags a bad email as `email`, a short phone as `phone`, a non-integer headcount as `invalid`', () => {
    const r = quickSchema.safeParse({ ...ok, email: 'nope', phone: '12 34', headcount: '10-15' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(fieldErrorsFromIssues(r.error.issues)).toMatchObject({ email: 'email', phone: 'phone', headcount: 'invalid' });
    }
  });

  it('maps onto the exact catalog names, normalises the phone and lower-cases nothing itself', () => {
    const parsed = quickSchema.parse(ok);
    expect(quickToFields(parsed)).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Acme Tekstil A.Ş.',
      email: 'AYSE@ACME.COM.TR', // the door lower-cases; the website sends what was typed
      phone: '+905320000000',
      city: 'Bursa',
      roleNeeded: 'kaynakçı, paketleme',
      headcount: '12',
    });
  });
});

describe('fullSchema / fullToFields (request form → `hire`)', () => {
  const ok = {
    company: 'Acme',
    name: 'Mehmet Kaya',
    email: 'mehmet@acme.com',
    dial: 'TR',
    phone: '532 000 00 00',
    sector: 'factory',
    roleNeeded: 'welder',
    headcount: '5',
    city: '',
    startWhen: '',
    message: '',
  };

  it('accepts a minimal valid submission (city, startWhen, message optional)', () => {
    expect(fullSchema.safeParse(ok).success).toBe(true);
  });

  it('refuses a sector or startWhen that is not a stable key (W3), and an unknown dial', () => {
    const r = fullSchema.safeParse({ ...ok, sector: 'Fabrika / Üretim', startWhen: 'En kısa sürede', dial: 'ZZZ' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrorsFromIssues(r.error.issues);
      expect(errors.sector).toBe('invalid');
      expect(errors.startWhen).toBe('invalid');
      expect(errors.dial).toBe('invalid');
    }
  });

  it('reads an empty sector as `required`', () => {
    const r = fullSchema.safeParse({ ...ok, sector: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrorsFromIssues(r.error.issues).sector).toBe('required');
  });

  it('composes dial + phone into one E.164-ish value and omits empty optionals', () => {
    expect(fullToFields(fullSchema.parse(ok), countries)).toEqual({
      name: 'Mehmet Kaya',
      company: 'Acme',
      email: 'mehmet@acme.com',
      phone: '+905320000000',
      sector: 'factory',
      roleNeeded: 'welder',
      headcount: '5',
    });
  });

  it('sends city, startWhen and message when present', () => {
    const fields = fullToFields(
      fullSchema.parse({ ...ok, city: 'Antalya', startWhen: '1-2m', message: 'Night shift.' }),
      countries,
    );
    expect(fields).toMatchObject({ city: 'Antalya', startWhen: '1-2m', message: 'Night shift.' });
  });

  it('throws a field-scoped FormActionError when the dial code is not in the countries list', () => {
    expect(() => fullToFields(fullSchema.parse({ ...ok, dial: 'XX' }), countries)).toThrow(FormActionError);
    try {
      fullToFields(fullSchema.parse({ ...ok, dial: 'XX' }), countries);
    } catch (e) {
      expect((e as FormActionError).field).toEqual({ name: 'dial', code: 'invalid' });
    }
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** The page's composed copy (W9/W23) — the frozen key set both message files must carry. */
export const SYS_HIRE_KEYS = [
  'whatsapp',
  'jump.label',
  'sc.titleTail',
  'sc.mapTitle',
  'sc.turkiye',
  'form.dial',
  'form.submit',
] as const;

const flatten = (o: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`],
  );

describe('sys.hire.*', () => {
  it('exists with the same key set in both locales', () => {
    const trKeys = flatten((tr as { sys: { hire: Record<string, unknown> } }).sys.hire).sort();
    const enKeys = flatten((en as { sys: { hire: Record<string, unknown> } }).sys.hire).sort();
    expect(trKeys).toEqual([...SYS_HIRE_KEYS].sort());
    expect(enKeys).toEqual(trKeys);
  });

  it('keeps the source-countries tail Turkish-only (EN is the empty string on purpose)', () => {
    expect((tr as { sys: { hire: { sc: { titleTail: string } } } }).sys.hire.sc.titleTail).toBe(' belgeli işçiler');
    expect((en as { sys: { hire: { sc: { titleTail: string } } } }).sys.hire.sc.titleTail).toBe('');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run "src/app/\[locale\]/(site)/hire-workers"
```
→ 5 files fail to import (`../tables`, `../fragments`, `../phone`, `../hire-spec` do not exist; `sys.hire` is undefined → `flatten` throws).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_lib/tables.ts`:

```ts
import type { SectorKey } from '@/content/collections';

/**
 * The page's markup-only structures as id tables (docs/CONTENT-MODEL.md § Collections: the
 * grouping of role chips, the comparison pairs, the process steps and the FAQ pairs exist in
 * the design only as markup, so Phase A carries them as page-local constants over package
 * ids — never as copy). Every id here is a real `hire.*` id (asserted by tables.test.ts).
 */
export type IndustryRow = {
  key: Exclude<SectorKey, 'other'>;
  /** the four (three) chips the design shows in the row at rest */
  visibleRoleIds: readonly string[];
  /** the chips inside the expanded panel under hire.136 */
  moreRoleIds: readonly string[];
  ctaId: string;
};

export const INDUSTRIES: readonly IndustryRow[] = [
  {
    key: 'factory',
    visibleRoleIds: ['hire.089', 'hire.090', 'hire.091', 'hire.092'],
    moreRoleIds: ['hire.093', 'hire.094', 'hire.095', 'hire.096'],
    ctaId: 'hire.130',
  },
  {
    key: 'construction',
    visibleRoleIds: ['hire.097', 'hire.098', 'hire.099', 'hire.100'],
    moreRoleIds: ['hire.101', 'hire.102', 'hire.103', 'hire.104'],
    ctaId: 'hire.131',
  },
  {
    // The design repeats rRecept (hire.108) in the row and the panel; it is listed once.
    key: 'tourism',
    visibleRoleIds: ['hire.105', 'hire.106', 'hire.107', 'hire.108'],
    moreRoleIds: ['hire.109', 'hire.110', 'hire.111'],
    ctaId: 'hire.132',
  },
  {
    key: 'agriculture',
    visibleRoleIds: ['hire.112', 'hire.113', 'hire.114'],
    moreRoleIds: ['hire.115', 'hire.116', 'hire.117'],
    ctaId: 'hire.133',
  },
  {
    key: 'textile',
    visibleRoleIds: ['hire.118', 'hire.119', 'hire.120'],
    moreRoleIds: ['hire.121', 'hire.122', 'hire.123'],
    ctaId: 'hire.134',
  },
  {
    key: 'logistics',
    visibleRoleIds: ['hire.124', 'hire.125', 'hire.126'],
    moreRoleIds: ['hire.127', 'hire.128', 'hire.129'],
    ctaId: 'hire.135',
  },
];

export type CompareRow = { titleId: string; bodyId: string };
export const COMPARE_ROWS: { own: readonly CompareRow[]; with: readonly CompareRow[] } = {
  own: [
    { titleId: 'hire.150', bodyId: 'hire.151' },
    { titleId: 'hire.152', bodyId: 'hire.153' },
    { titleId: 'hire.154', bodyId: 'hire.155' },
    { titleId: 'hire.156', bodyId: 'hire.157' },
    { titleId: 'hire.158', bodyId: 'hire.159' },
  ],
  with: [
    { titleId: 'hire.160', bodyId: 'hire.161' },
    { titleId: 'hire.162', bodyId: 'hire.163' },
    { titleId: 'hire.164', bodyId: 'hire.165' },
    { titleId: 'hire.166', bodyId: 'hire.167' },
    { titleId: 'hire.168', bodyId: 'hire.169' },
  ],
};

export type ProcessStepIds = { n: number; whenId: string; titleId: string; bodyId: string };
export const PROCESS_STEPS: readonly ProcessStepIds[] = [1, 2, 3, 4, 5, 6].map((n) => {
  const base = 271 + (n - 1) * 3;
  return {
    n,
    whenId: `hire.${base}`,
    titleId: `hire.${base + 1}`,
    bodyId: `hire.${base + 2}`,
  };
});

export type FaqPairIds = { id: string; qId: string; aId: string };
export const FAQ_PAIRS: readonly FaqPairIds[] = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  id: `q${n}`,
  qId: `hire.${289 + (n - 1) * 2}`,
  aId: `hire.${290 + (n - 1) * 2}`,
}));

/** W3: the `startWhen` option VALUES are stable keys; the labels are the package's hire.059–062. */
export const START_WHEN_KEYS = ['asap', '1-2m', '3m+', 'planning'] as const;
export type StartWhenKey = (typeof START_WHEN_KEYS)[number];
export const START_WHEN_OPTIONS: readonly { key: StartWhenKey; labelId: string }[] = [
  { key: 'asap', labelId: 'hire.059' },
  { key: '1-2m', labelId: 'hire.060' },
  { key: '3m+', labelId: 'hire.061' },
  { key: 'planning', labelId: 'hire.062' },
];
```

`src/app/[locale]/(site)/hire-workers/_lib/fragments.ts`:

```ts
/**
 * The design glues split package fragments with bare `{{ a }}{{ b }}` and lets ja-i18n.js
 * space them. W23 allows composing exactly those fragments; this is the one joiner the page
 * uses, so "Hire verified overseas" + "workers" gets its space and "470+ placements" +
 * ", Türkiye'deki…" (hire.192 TR) does not.
 */
export function sp(prev: string, next: string): ' ' | '' {
  if (!prev || !next) return '';
  if (/\s$/.test(prev) || /^\s/.test(next)) return '';
  if (/^[,.;:!?)\]…]/.test(next)) return '';
  return ' ';
}
```

`src/app/[locale]/(site)/hire-workers/_lib/phone.ts`:

```ts
/** The catalog keeps `phone` as typed (≥ 8 digits); E.164 is the handler's job. The page still
 *  sends one clean value so the door's digit rule and the inbox read the same number. */
export type DialCountry = { code: string; dial: string };

export function dialForCode(countries: readonly DialCountry[], code: string): string | null {
  const upper = code.trim().toUpperCase();
  if (upper.length !== 2) return null;
  return countries.find((c) => c.code === upper)?.dial ?? null;
}

const digitsOnly = (s: string) => s.replace(/\D/g, '');

/** Full form: `dial` from the country select (`+90`) + the national number as typed. */
export function composePhone(dial: string, national: string): string {
  const dialDigits = digitsOnly(dial);
  let n = national.trim();
  if (n.startsWith('00')) n = `+${n.slice(2)}`;
  let digits = digitsOnly(n);
  if (dialDigits && n.startsWith('+') && digits.startsWith(dialDigits)) digits = digits.slice(dialDigits.length);
  else if (dialDigits && digits.startsWith('0')) digits = digits.replace(/^0+/, '');
  if (!dialDigits) return digits;
  return `+${dialDigits}${digits}`;
}

/** Quick form: one free-text field, Türkiye-only page — an 11-digit 0-led number is national. */
export function normalisePhone(raw: string): string {
  let n = raw.trim();
  if (n.startsWith('00')) n = `+${n.slice(2)}`;
  const digits = digitsOnly(n);
  if (!digits) return '';
  if (n.startsWith('+')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+90${digits.slice(1)}`;
  return digits;
}
```

`src/app/[locale]/(site)/hire-workers/_lib/hire-spec.ts`:

```ts
import { z } from 'zod';
import { SECTOR_KEYS } from '@/content/collections';
import { FormActionError } from '@/forms/action';
import type { WireFields } from '@/forms/wire';
import { composePhone, dialForCode, normalisePhone, type DialCountry } from './phone';
import { START_WHEN_KEYS } from './tables';

/** `.min(1)` before every format rule so an empty value reads `required` (kernel convention). */
const required = (max: number) => z.string().trim().min(1).max(max);
const email = z.string().trim().min(1).max(254).email();
const phone = z.string().trim().min(1).max(40).regex(/(\D*\d){8,}/, { message: 'phone' });
const headcount = z.string().trim().min(1).max(10).regex(/^[1-9]\d{0,9}$/, { message: 'invalid' });

/** Hero quick-quote: the design's six fields + the door-required contact `name` (W3). */
export const quickSchema = z.object({
  company: required(200),
  name: required(120),
  city: required(120),
  roleNeeded: required(200),
  headcount,
  phone,
  email,
});
export type QuickInput = z.infer<typeof quickSchema>;

export function quickToFields(p: QuickInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: normalisePhone(p.phone),
    city: p.city,
    roleNeeded: p.roleNeeded,
    headcount: p.headcount,
  };
}

/** Request form: dial + national number, stable `sector`/`startWhen` keys (W3), optional
 *  city (catalog v1.1, W16) and message. An empty select value is `required`, a value outside
 *  the key set is `invalid` — never a localized label on the wire. */
export const fullSchema = z.object({
  company: required(200),
  name: required(120),
  email,
  dial: z.string().trim().min(1).regex(/^[A-Za-z]{2}$/, { message: 'invalid' }),
  phone,
  sector: z.string().trim().min(1).pipe(z.enum(SECTOR_KEYS, { message: 'invalid' })),
  roleNeeded: required(200),
  headcount,
  city: z.string().trim().max(120).optional(),
  startWhen: z.union([z.literal(''), z.enum(START_WHEN_KEYS, { message: 'invalid' })]).optional(),
  message: z.string().trim().max(5000).optional(),
});
export type FullInput = z.infer<typeof fullSchema>;

export function fullToFields(p: FullInput, countries: readonly DialCountry[]): WireFields {
  const dial = dialForCode(countries, p.dial);
  if (!dial) throw new FormActionError('invalid dial code', { name: 'dial', code: 'invalid' });
  const fields: WireFields = {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: composePhone(dial, p.phone),
    sector: p.sector,
    roleNeeded: p.roleNeeded,
    headcount: p.headcount,
  };
  if (p.city) fields.city = p.city;
  if (p.startWhen) fields.startWhen = p.startWhen;
  if (p.message) fields.message = p.message;
  return fields;
}
```

Note for the implementer: `FormActionError`'s constructor signature is the kernel's — `new FormActionError(visitorMessage, field?)` per produces-final (`readonly visitorMessage: string; readonly field?: { name; code }`). If T0a's constructor takes an options object instead, adapt the one call here and the `.field` assertion in the test; do not change the kernel.

`src/app/[locale]/(site)/hire-workers/_lib/assets.ts`:

```ts
import type { Logo } from '@/design/blocks';

/** §10 #4: the licensed stock hero lands here as `/hero/hire-workers.jpg` (1440×640). Until
 *  then the slot is a named placeholder and the h1 is the LCP element (D26/T0e contract). */
export const HERO_SRC: string | null = null;
export const HERO_SIZE = { width: 1440, height: 640 } as const;

/** §10 #11: client logos with consent are v1.1 — the band stays hidden (W6) until rows exist. */
export const CLIENT_LOGOS: readonly Logo[] = [];
```

`src/app/[locale]/(site)/hire-workers/_lib/metric.ts`:

```ts
import type { Metric } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';

/** The inline pill/proof figure: `text` verbatim, else the formatted value + suffix; `null`
 *  when the metric is unsigned (W1: the pill is hidden, never a literal). */
export function metricText(m: Metric, locale: Locale): string | null {
  if (m.text) return m.text;
  if (m.value === null) return null;
  return `${formatInt(m.value, locale)}${m.suffix}`;
}
```

`src/messages/tr.json` — add inside `"sys"`, after the `"form"` object (keep the file's 2-space style; Prettier checks it):

```json
    "hire": {
      "whatsapp": "WhatsApp",
      "jump": { "label": "Sayfa içi bölümler" },
      "sc": {
        "titleTail": " belgeli işçiler",
        "mapTitle": "Kaynak ülkeler haritası — Türkiye'ye işçi temin ettiğimiz ülkeler",
        "turkiye": "Türkiye"
      },
      "form": {
        "dial": "Ülke kodu",
        "submit": "Talebi gönderin →"
      }
    },
```

`src/messages/en.json` — same position:

```json
    "hire": {
      "whatsapp": "WhatsApp",
      "jump": { "label": "On this page" },
      "sc": {
        "titleTail": "",
        "mapTitle": "Source countries map — where we source workers for Türkiye from",
        "turkiye": "Türkiye"
      },
      "form": {
        "dial": "Country code",
        "submit": "Send request →"
      }
    },
```

Why these seven and nothing else: `whatsapp` is the design's literal brand-name CTA label (hero + sticky bar); `jump.label` is the mobile jump nav's `aria-label`; `sc.titleTail` is the runtime dictionary's `scTitleC` that has no package id (TR ` belgeli işçiler`, EN empty — the discovery note's first risk); `sc.mapTitle` is the SVG's accessible name; `sc.turkiye` is `SourceMap`'s required `turkiyeLabel` (W60 — copy, not code); `form.dial` labels the dial select (no package id — the design's select is unlabeled); `form.submit` replaces `hire.216`'s WhatsApp wording on the door submit (D13). The page reads `sc.titleTail` through `sys.raw(...)` (an ICU-free read that returns `''` for the empty EN value).

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx vitest run "src/app/\[locale\]/(site)/hire-workers" src/messages
npm run verify
```
→ the five page tests pass (25 tests); `src/messages/messages.test.ts` still passes (identical key sets); typecheck/lint/prettier clean.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/_lib" src/messages/tr.json src/messages/en.json
git commit -m "feat(hire): page-local id tables, fragment joiner, phone composer, hire form specs, sys.hire copy

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — the two client islands (dial select, sector prefill link)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hire-workers/_components/__tests__/DialSelect.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormErrorsContext } from '@/forms/client/FormErrorsContext';
import { renderWithIntl } from '@/test/render';
import { DialSelect } from '../DialSelect';

const options = [
  { value: 'DE', label: 'Almanya +49' },
  { value: 'TR', label: 'Türkiye +90' },
];

describe('DialSelect', () => {
  it('is a labelled native select named `dial`, defaulting to TR', () => {
    renderWithIntl(<DialSelect id="f-dial" label="Ülke kodu" options={options} defaultCode="TR" />);
    const select = screen.getByLabelText('Ülke kodu') as HTMLSelectElement;
    expect(select.name).toBe('dial');
    expect(select.value).toBe('TR');
    expect(select).toHaveAttribute('autocomplete', 'tel-country-code');
  });

  it('echoes the last submitted value and renders the field error from the context', () => {
    renderWithIntl(
      <FormErrorsContext.Provider value={{ errors: { dial: 'invalid' }, values: { dial: 'DE' } }}>
        <DialSelect id="f-dial" label="Ülke kodu" options={options} defaultCode="TR" />
      </FormErrorsContext.Provider>,
    );
    const select = screen.getByLabelText('Ülke kodu') as HTMLSelectElement;
    expect(select.value).toBe('DE');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
```

`src/app/[locale]/(site)/hire-workers/_components/__tests__/SectorPrefillLink.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SectorPrefillLink } from '../SectorPrefillLink';

describe('SectorPrefillLink', () => {
  it('is a plain same-page anchor to #request-form', () => {
    render(<SectorPrefillLink sector="factory">Fabrika işçisi talep edin →</SectorPrefillLink>);
    expect(screen.getByRole('link', { name: 'Fabrika işçisi talep edin →' })).toHaveAttribute(
      'href',
      '#request-form',
    );
  });

  it('prefills the request form’s sector select on click and leaves the anchor navigation alone', async () => {
    render(
      <>
        <form id="request-form">
          <select name="sector" defaultValue="">
            <option value=""></option>
            <option value="factory">Fabrika</option>
            <option value="textile">Tekstil</option>
          </select>
        </form>
        <SectorPrefillLink sector="textile">Tekstil</SectorPrefillLink>
      </>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Tekstil' }));
    expect((document.querySelector('select[name="sector"]') as HTMLSelectElement).value).toBe('textile');
  });

  it('does nothing when the option does not exist (never throws in front of a visitor)', async () => {
    render(
      <>
        <form id="request-form">
          <select name="sector" defaultValue="">
            <option value=""></option>
          </select>
        </form>
        <SectorPrefillLink sector="factory">x</SectorPrefillLink>
      </>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'x' }));
    expect((document.querySelector('select[name="sector"]') as HTMLSelectElement).value).toBe('');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run "src/app/\[locale\]/(site)/hire-workers/_components"
```
→ both files fail to import.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_components/DialSelect.tsx`:

```tsx
'use client';
import { FormField } from '@/design/primitives';
import { INPUT_CLASS, type FieldOption } from '@/forms/client/Field';
import { useFieldError, useFieldValue } from '@/forms/client/FormErrorsContext';

/**
 * The design's dial-code select, as one labelled control wired to the kernel's error/echo
 * context. `Field` cannot host it: a `Field as="select"` has no default value (it starts on
 * the empty placeholder option) and the design pre-selects +90. Option VALUES are ISO2 codes
 * (unique — `+1`/`+7` are shared by several countries) and the server maps them to the dial
 * through `dialForCode` (W3: stable keys on the wire, never a label).
 */
export function DialSelect({
  id,
  label,
  options,
  defaultCode,
}: {
  id: string;
  label: string;
  options: FieldOption[];
  defaultCode: string;
}) {
  const error = useFieldError('dial');
  const value = useFieldValue('dial');
  return (
    <FormField id={id} label={label} error={error} required>
      {(p) => (
        <select
          {...p}
          name="dial"
          defaultValue={value ?? defaultCode}
          autoComplete="tel-country-code"
          className={INPUT_CLASS}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_components/SectorPrefillLink.tsx`:

```tsx
'use client';
import type { ReactNode } from 'react';
import type { SectorKey } from '@/content/collections';

/**
 * The industries panel's "Request <sector> workers →" CTA. The design (`requestInd1..6`)
 * pre-selects the request form's sector and smooth-scrolls to it; here it is a real anchor
 * to `#request-form` (works without JS, keyboard-reachable, tracked by nothing — it is not a
 * contact door) whose click also sets the form's `sector` select before the hash navigation
 * runs. The select is uncontrolled (`Field`), so setting `.value` and dispatching `change` is
 * the whole hand-off; no cross-island state.
 */
export function SectorPrefillLink({
  sector,
  className,
  children,
}: {
  sector: SectorKey;
  className?: string;
  children: ReactNode;
}) {
  const prefill = () => {
    const select = document.querySelector<HTMLSelectElement>('#request-form select[name="sector"]');
    if (!select) return;
    if (!Array.from(select.options).some((o) => o.value === sector)) return;
    select.value = sector;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  };
  return (
    <a href="#request-form" onClick={prefill} className={className}>
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx vitest run "src/app/\[locale\]/(site)/hire-workers"
npm run verify
```
→ 7 files, 30 tests green; verify clean.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/_components"
git commit -m "feat(hire): DialSelect and SectorPrefillLink islands

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — the server action and the two forms (quick-quote, request form)

- [ ] **Step 1: Write the failing test**

Append to `e2e/pages/hire-workers.spec.ts` (create the file now with the form cases; Cycle 4 adds the section cases to the same file):

```ts
import { test, expect, type Page } from '@playwright/test';

const ROUTES = { tr: '/isci-talebi', en: '/en/hire-workers' } as const;
const isMobile = () => test.info().project.name === 'mobile';

/** The gate runs with OPS_API_URL unset (T14 proves the door end to end on staging): every
 *  submit ends on the D11 fallback panel deterministically — never a spinner, never a fake
 *  thank-you. A `unauthorized` result is what the kernel returns without a door. */
async function fillFull(page: Page) {
  const form = page.getByTestId('hire-form-full');
  await form.getByLabel(/Firma adı|Company name/).fill('Acme A.Ş.');
  await form.getByLabel(/İletişim kişisi|Contact person/).fill('Ayşe Yılmaz');
  await form.getByLabel(/Kurumsal e-posta|Work email/).fill('ayse@acme.example');
  await form.getByLabel(/Ülke kodu|Country code/).selectOption('TR');
  await form.getByLabel(/Telefon \/ WhatsApp|Phone \/ WhatsApp/).fill('0532 000 00 00');
  await form.getByLabel(/Sektör|Industry/).selectOption('factory');
  await form.getByLabel(/İhtiyaç duyulan pozisyonlar|Roles needed/).fill('kaynakçı');
  await form.getByLabel(/İşçi sayısı|Number of workers/).fill('5');
  await form.getByRole('checkbox').check();
  return form;
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: the request form validates on the server and shows the fallback panel without a door`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const form = page.getByTestId('hire-form-full');
    await expect(form).toBeVisible();
    // 1. Empty submit → field errors, values kept, no navigation.
    await form.getByRole('button', { name: /gönderin|Send request/ }).click();
    await expect(form.getByRole('alert').first()).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(ROUTES[locale]);
    // 2. Valid submit → the door is not configured → fallback panel (D11), still no navigation.
    await fillFull(page);
    await form.getByRole('button', { name: /gönderin|Send request/ }).click();
    const panel = page.getByTestId('form-fallback');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/905011240340\?text=/,
    );
    expect(new URL(page.url()).pathname).toBe(ROUTES[locale]);
  });
}

test('tr: the hero quick-quote is a second `hire` form on desktop and a CTA pair on mobile', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const quick = page.getByTestId('hire-form-quick');
  if (isMobile()) {
    await expect(quick).toBeHidden();
    await expect(page.getByTestId('hire-quick-mobile').getByRole('link', { name: /İşçi talep edin/ })).toHaveAttribute(
      'href',
      '#request-form',
    );
    return;
  }
  await expect(quick).toBeVisible();
  await expect(quick.getByRole('checkbox')).toHaveCount(0); // consent: 'notice'
  await quick.getByLabel(/Firma adı/).fill('Acme');
  await quick.getByLabel(/Hangi şehirde/).fill('Bursa');
  await quick.getByLabel(/İletişim kişisi/).fill('Ali Veli');
  await quick.getByLabel(/İhtiyaç duyulan pozisyonlar/).fill('kaynakçı');
  await quick.getByLabel(/Kaç kişi/).fill('3');
  await quick.getByLabel(/Telefon \/ WhatsApp/).fill('0532 000 00 00');
  await quick.getByLabel(/Kurumsal e-posta/).fill('ali@acme.example');
  await quick.getByRole('button', { name: /İşçi talep edin/ }).click();
  await expect(quick.getByTestId('form-fallback')).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm run build && (npx next start -p 3100 & echo $! > /tmp/next.pid) && sleep 4 \
  && E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/hire-workers.spec.ts; kill $(cat /tmp/next.pid)
```
→ every case fails on `getByTestId('hire-form-full')` (the spike renders only an h1). Mac Studio rule: one build/test job at a time.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/actions.ts`:

```ts
'use server';
import { getBundle } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { createFormAction, type FormActionState } from '@/forms/action';
import { routing } from '@/i18n/routing';
import { fullSchema, fullToFields, quickSchema, quickToFields } from './_lib/hire-spec';

/** Hero quick-quote → `hire`. The design carries the KVKK line without a checkbox, so the
 *  spec is `consent: 'notice'` — the wire still carries CONSENT_VERSION (kernel rule). */
const runQuick = createFormAction({
  key: 'hire',
  schema: quickSchema,
  consent: 'notice',
  toFields: (p) => quickToFields(p),
});

/** Request form → `hire`. The dial → country lookup reads the `countries` collection, which is
 *  identical per locale except `name`, so the default locale's bundle is the one source. */
const runFull = createFormAction({
  key: 'hire',
  schema: fullSchema,
  consent: 'checkbox',
  toFields: async (p) => {
    const bundle = await getBundle(routing.defaultLocale);
    return fullToFields(p, getCollection(bundle, 'countries'));
  },
});

export async function submitHireQuick(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runQuick(prev, data);
}

export async function submitHireFull(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runFull(prev, data);
}
```

`src/app/[locale]/(site)/hire-workers/_sections/QuickQuote.tsx` (server component — the card in the hero's right column; the form is hidden ≤700 px by CSS and the CTA pair shown, exactly as the design does at line 406–410/624–633):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { ContactCta } from '@/design/blocks';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { submitHireQuick } from '../actions';

export function QuickQuote({
  bundle,
  locale,
  tf,
  sysWhatsapp,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** sys.hire.whatsapp — resolved by the page (sys copy never crosses as a function) */
  sysWhatsapp: string;
}) {
  const s = bundle.settings;
  const trust = (
    <p className="m-0 flex flex-wrap items-center justify-center gap-x-2 text-body-sm text-muted">
      <span>{tf('hire.042')}</span>
      <span aria-hidden="true">·</span>
      <span>{tf('hire.043')}</span>
      <span aria-hidden="true">·</span>
      <span>{tf('hire.044')}</span>
    </p>
  );
  return (
    <div
      data-testid="hire-quick-card"
      className="overflow-hidden rounded-hero border border-white/10 bg-white text-ink shadow-hero-form"
    >
      <div className="bg-gradient-to-br from-blue to-blue-safe px-7 py-5 text-white">
        <h2 className="m-0 mb-1 text-card-title">{tf('hire.037')}</h2>
        <p className="m-0 text-body-sm text-white/85">
          <span className="hidden md:inline">{tf('hire.038')}</span>
          <span className="md:hidden">{tf('hire.039')}</span>
        </p>
      </div>
      <div className="px-7 pb-6 pt-6">
        {/* ≤700 px: the design replaces the form with two CTAs + the trust trio. */}
        <div data-testid="hire-quick-mobile" className="flex flex-col gap-2.5 md:hidden">
          <ContactCta placement="page_cta" href="#request-form" size="lg" className="w-full">
            {tf('hire.040')}
          </ContactCta>
          <ContactCta
            placement="page_cta"
            href={waLink(s.whatsappNumber, tf('hire.249'))}
            variant="secondary"
            external
            className="w-full"
          >
            {tf('hire.041')}
          </ContactCta>
          {trust}
        </div>
        <div className="hidden md:block">
          <FormShell
            action={submitHireQuick}
            formKey="hire"
            locale={locale}
            turnstileSiteKey={s.turnstileSiteKey}
            whatsappNumber={s.whatsappNumber}
            whatsappIntro={tf('hire.250')}
            contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
            submitLabel={tf('hire.063')}
            consent="notice"
            testId="hire-form-quick"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="q-company" name="company" required placeholder={tf('hire.047')} autoComplete="organization" />
              <Field id="q-city" name="city" required placeholder={tf('hire.048')} autoComplete="address-level2" />
            </div>
            <Field id="q-name" name="name" required autoComplete="name" />
            <Field id="q-roleNeeded" name="roleNeeded" required placeholder={tf('hire.049')} />
            <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
              <Field id="q-headcount" name="headcount" type="number" min={1} required placeholder={tf('hire.050')} inputMode="numeric" />
              <Field id="q-phone" name="phone" type="tel" required placeholder={tf('hire.051')} autoComplete="tel" inputMode="tel" />
            </div>
            <Field id="q-email" name="email" type="email" required placeholder={tf('hire.052')} autoComplete="email" inputMode="email" />
          </FormShell>
          <div className="mt-3">{trust}</div>
          <a
            href="#request-form"
            className="mt-4 block border-t border-border-3 pt-4 text-center text-body-sm font-bold text-blue-safe no-underline hover:text-ink"
          >
            {tf('hire.066')}
          </a>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/RequestForm.tsx` (server component — section `#request-form`, the header CTA's target):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { ContactLink } from '@/analytics/ContactLink';
import { getCollection } from '@/content/collections';
import { Section } from '@/design/primitives';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink } from '@/lib/contact';
import { submitHireFull } from '../actions';
import { DialSelect } from '../_components/DialSelect';
import { START_WHEN_OPTIONS } from '../_lib/tables';

export function RequestForm({
  bundle,
  locale,
  tf,
  sys,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** the two sys.hire.form.* strings, resolved by the page */
  sys: { dial: string; submit: string };
}) {
  const s = bundle.settings;
  const sectors: FieldOption[] = getCollection(bundle, 'sectors').map((row) => ({
    value: row.key,
    label: tf(row.labelId),
  }));
  const startWhen: FieldOption[] = START_WHEN_OPTIONS.map((o) => ({ value: o.key, label: tf(o.labelId) }));
  const dials: FieldOption[] = getCollection(bundle, 'countries')
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, locale))
    .map((c) => ({ value: c.code, label: `${c.name} ${c.dial}` }));
  const steps = [
    ['hire.202', 'hire.203'],
    ['hire.204', 'hire.205'],
    ['hire.206', 'hire.207'],
  ] as const;
  return (
    <Section tone="pale" id="request-form" className="scroll-mt-20">
      <div className="container-site grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" data-testid="hire-request">
        <div>
          <p className="m-0 mb-4 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-4 py-1.5 text-body-sm font-extrabold text-success-text">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-success" />
            {tf('hire.199')}
          </p>
          <h2 className="m-0 mb-4 text-h2">{tf('hire.200')}</h2>
          <p className="m-0 mb-7 text-body-lg text-text-secondary">{tf('hire.201')}</p>
          {/* the three numbered steps are hidden ≤700 px in the design (line 448) */}
          <ol className="m-0 hidden list-none flex-col gap-4 p-0 md:flex">
            {steps.map(([lead, tail], i) => (
              <li key={lead} className="flex items-start gap-3.5">
                <span aria-hidden="true" className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue text-body-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="text-body text-text-secondary">
                  <strong className="text-ink">{tf(lead)}</strong> {tf(tail)}
                </span>
              </li>
            ))}
          </ol>
          <ul className="m-0 mt-7 flex list-none flex-col gap-3 border-t border-border-1 p-0 pt-6 text-body text-text-secondary">
            <li>{tf('hire.208')}</li>
            <li>{tf('hire.209')}</li>
            <li>{tf('hire.210')}</li>
          </ul>
          <div className="mt-7 border-t border-border-1 pt-6">
            <p className="m-0 mb-3 text-body-sm font-extrabold uppercase tracking-[0.6px] text-muted">{tf('hire.211')}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* the phone tile is hidden ≤700 px (the mobile bottom bar carries the call) */}
              <ContactLink
                href={telLink(s.phone)}
                placement="page_cta"
                className="hidden min-w-0 items-center gap-3 rounded-xs border border-border-2 bg-pale-1 px-3.5 py-3 no-underline hover:bg-tint md:flex"
              >
                <span className="block min-w-0">
                  <span className="block text-body-sm font-bold uppercase tracking-[0.5px] text-muted">{tf('hire.212')}</span>
                  <span className="block truncate text-body font-extrabold text-ink">{s.phoneDisplay}</span>
                </span>
              </ContactLink>
              <ContactLink
                href={mailLink(s.email, tf('hire.253'))}
                placement="page_cta"
                className="flex min-w-0 items-center gap-3 rounded-xs border border-border-2 bg-pale-1 px-3.5 py-3 no-underline hover:bg-tint"
              >
                <span className="block min-w-0">
                  <span className="block text-body-sm font-bold uppercase tracking-[0.5px] text-muted">{tf('hire.213')}</span>
                  <span className="block truncate text-body font-extrabold text-ink">{s.email}</span>
                </span>
              </ContactLink>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-border-1 bg-white shadow-card-hover">
          <div className="bg-gradient-to-br from-blue to-blue-safe px-8 py-6 text-white">
            <h3 className="m-0 mb-1 text-card-title">{tf('hire.214')}</h3>
            <p className="m-0 text-body-sm text-white/80">{tf('hire.215')}</p>
          </div>
          <div className="px-8 pb-6 pt-7">
            <FormShell
              action={submitHireFull}
              formKey="hire"
              locale={locale}
              turnstileSiteKey={s.turnstileSiteKey}
              whatsappNumber={s.whatsappNumber}
              whatsappIntro={tf('hire.249')}
              contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
              submitLabel={sys.submit}
              consent="checkbox"
              consentLinkHref="/privacy"
              testId="hire-form-full"
            >
              <Field name="company" required placeholder={tf('hire.047')} autoComplete="organization" />
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field name="name" required placeholder={tf('hire.053')} autoComplete="name" />
                <Field name="email" type="email" required placeholder={tf('hire.052')} autoComplete="email" inputMode="email" />
              </div>
              <div className="grid gap-2.5 sm:grid-cols-[minmax(120px,0.45fr)_1fr]">
                <DialSelect id="f-dial" label={sys.dial} options={dials} defaultCode="TR" />
                <Field name="phone" type="tel" required placeholder={tf('hire.051')} autoComplete="tel-national" inputMode="tel" />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field name="sector" as="select" required options={sectors} placeholder={tf('hire.054')} />
                <Field name="roleNeeded" required placeholder={tf('hire.055')} />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field name="headcount" type="number" min={1} required placeholder={tf('hire.056')} inputMode="numeric" />
                <Field name="city" placeholder={tf('hire.057')} autoComplete="address-level2" />
              </div>
              <Field name="startWhen" as="select" options={startWhen} placeholder={tf('hire.058')} />
              <Field name="message" as="textarea" rows={3} />
            </FormShell>
            <p className="m-0 mt-2 text-center text-body-sm text-muted">{tf('hire.219')}</p>
            <p className="m-0 mt-1 text-center text-body-sm leading-snug text-muted">{tf('hire.220')}</p>
            <p className="m-0 mt-3 text-center text-body-sm text-muted">
              {tf('hire.221')}{' '}
              <ContactLink href={mailLink(s.email, tf('hire.253'))} placement="page_cta" className="font-extrabold text-blue-safe underline">
                {tf('hire.222')}
              </ContactLink>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

Notes for the implementer:
- Both shells carry `formKey="hire"` (D13: one conversion key). Field ids: the quick form passes `id="q-<name>"` on every `Field` (the kernel's default is `f-<name>`, which the full form keeps), so no `label[for]`/`id` pair repeats on the page. The kernel's own honeypot id is `f-honeypot-<formKey>` on both shells — see Foundation gaps; if axe's `duplicate-id-active` flags it in Cycle 4, the fix belongs in `FormShell` (an id scope prop), not here.
- The `countries` collection is sorted by `name` at the edge (T0b: file order = code order). `localeCompare(…, locale)` is the one place a locale string reaches a sort.
- `Field name="sector"` / `"startWhen"` pass the package placeholders (`hire.054`/`058`); the select's own empty first option is the kernel's (`sys.form.placeholders.select`), so the package placeholder is the field's `placeholder` attribute only where the kernel renders one — accept whichever the kernel does; the label is always `sys.form.labels.<name>`.
- The contract import path `'../../../../../../contract/website-bundle.v1'` is six levels up from `_sections/` (T0c's gallery note: the `(site)` route group adds one level to WP1's five).

- [ ] **Step 4: Run tests + npm run verify**

Rendering waits for Cycle 4's `page.tsx`; this cycle proves the modules compile and the action shape type-checks:

```bash
npm run verify
```
→ clean. (The Playwright cases stay red until Cycle 4.)

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/actions.ts" "src/app/[locale]/(site)/hire-workers/_sections/QuickQuote.tsx" "src/app/[locale]/(site)/hire-workers/_sections/RequestForm.tsx" e2e/pages/hire-workers.spec.ts
git commit -m "feat(hire): quick-quote and request-form server actions on the forms kernel (W3, W16)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — the page: hero, jump nav, sticky bar, sections in the design's order, e2e page contract

- [ ] **Step 1: Write the failing test**

Append to `e2e/pages/hire-workers.spec.ts` (after the Cycle 3 cases):

```ts
for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 with real copy, no leaked tokens, the LCP slot named once`, async ({ page }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).not.toBeEmpty();
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(body).not.toContain('undefined');
    expect(body).not.toContain('hire.'); // a package id leaking as text
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    // W1: the hero pills are metrics, not literals — the placed figure renders formatted.
    await expect(page.getByTestId('hire-hero-pills')).toContainText(/470\+/);
  });

  test(`${locale}: every designed section is present, in order`, async ({ page }) => {
    await page.goto(ROUTES[locale]);
    const ids = ['hire-hero', 'hire-industries', 'hire-source-countries', 'hire-compare', 'hire-process', 'hire-portal', 'hire-faq', 'hire-request'];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el).toHaveCount(1);
      tops.push((await el.boundingBox())!.y);
    }
    expect([...tops]).toEqual([...tops].sort((a, b) => a - b));
    // W6: no consented logos → the client-logo band renders nothing at all.
    await expect(page.getByTestId('hire-logos')).toHaveCount(0);
    // the header CTA's target exists (T0c CTA_BY_PATHNAME contract: DEFAULT_CTAS → #request-form)
    await expect(page.locator('#request-form')).toHaveCount(1);
    await expect(page.locator('#industries, #compare, #process, #faq')).toHaveCount(4);
  });
}

test('tr: the source map carries every source country and the flag chips are real sprite flags', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const map = page.locator('#source-map');
  await expect(map).toHaveCount(1);
  await expect(map.locator('[data-country]')).toHaveCount(14); // 13 sources + TR
  await expect(map.locator('[data-country="LK"] title')).toHaveText(/Sri Lanka/);
  await expect(page.getByTestId('hire-flags').locator('svg use[href$="#flag-PK"]')).toHaveCount(1);
  await expect(page.getByTestId('hire-flags')).toContainText('Pakistan');
});

test('tr: the industries accordion opens one sector at a time and its CTA prefills the request form', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const region = page.getByTestId('hire-industries');
  const triggers = region.getByRole('button', { expanded: false });
  await expect(triggers).toHaveCount(6);
  await region.getByRole('button', { name: /Tekstil/ }).click();
  await expect(region.getByRole('button', { name: /Tekstil/ })).toHaveAttribute('aria-expanded', 'true');
  await region.getByRole('link', { name: /Tekstil işçisi talep edin/ }).click();
  await expect(page.getByTestId('hire-form-full').getByLabel(/Sektör/)).toHaveValue('textile');
  expect(new URL(page.url()).hash).toBe('#request-form');
});

test('tr: the FAQ block ships FAQPage JSON-LD with the seven pairs, and breadcrumbs ship BreadcrumbList', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
  const faq = graphs.map((g) => JSON.parse(g)).find((g) => g['@type'] === 'FAQPage');
  expect(faq?.mainEntity).toHaveLength(7);
  const crumbs = graphs.map((g) => JSON.parse(g)).find((g) => g['@type'] === 'BreadcrumbList');
  expect(crumbs?.itemListElement).toHaveLength(2);
  expect(crumbs?.itemListElement[1].item).toBe('https://www.jobsadmire.com/isci-talebi');
});

test('the language switch keeps the visitor on this page', async ({ page }) => {
  test.skip(isMobile(), 'the switcher lives in the hamburger below lg — covered by e2e/chrome.spec.ts');
  await page.goto(ROUTES.tr);
  await page.getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en\/hire-workers$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('desktop: the sticky CTA bar appears after 700 px, hides near the request form, and publishes its height', async ({ page }) => {
  test.skip(isMobile(), 'the bar is lg+ only; the mobile bottom bar carries the offer below');
  await page.goto(ROUTES.tr);
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(bar).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--sticky-cta-h').trim())).not.toBe('0px');
  await page.locator('#request-form').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});
```

Note: `data-testid="sticky-cta"` is the attribute T0d's `StickyCtaBar` renders on its wrapper; if T0d named it differently, use T0d's name — do not add a second test id to the chrome.

- [ ] **Step 2: Run to verify it fails**

Same build + `next start` + Playwright command as Cycle 3 → the new cases fail on `hire-hero` etc.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_sections/Hero.tsx`:

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { getMetric } from '@/content/collections';
import { Breadcrumbs, ContactCta, ImageSlot } from '@/design/blocks';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { HERO_SIZE, HERO_SRC } from '../_lib/assets';
import { sp } from '../_lib/fragments';
import { metricText } from '../_lib/metric';
import { QuickQuote } from './QuickQuote';

export function Hero({
  bundle,
  locale,
  tf,
  sysWhatsapp,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  sysWhatsapp: string;
}) {
  const s = bundle.settings;
  const placed = metricText(getMetric(bundle, 'placed'), locale);
  const countries = metricText(getMetric(bundle, 'countries'), locale);
  const h1a = tf('hire.021');
  const h1b = tf('hire.022');
  const h1c = tf('hire.023');
  const heroIsLcp = Boolean(HERO_SRC);
  return (
    <section data-testid="hire-hero" className="relative overflow-hidden bg-navy text-white">
      {/* D26/T0e: the named hero slot. With a photo it is the LCP element (`data-lcp-slot`);
          without one it is a named placeholder and the h1 below carries the LCP attribute. */}
      <ImageSlot
        slot="hw-hero"
        lcp={heroIsLcp}
        src={HERO_SRC}
        alt=""
        width={HERO_SIZE.width}
        height={HERO_SIZE.height}
        sizes="100vw"
        priority={heroIsLcp}
        className="absolute inset-0 h-full w-full object-cover [aspect-ratio:auto]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/75" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70" />
      <div className="container-site relative grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-16">
        <div>
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-4"
            items={[
              { name: tf('hire.020'), href: '/' },
              { name: tf('hire.002'), href: '/hire-workers' },
            ]}
          />
          <h1
            data-testid="page-h1"
            data-lcp-slot={heroIsLcp ? undefined : 'h1'}
            className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em]"
          >
            {h1a}
            {sp(h1a, h1b)}
            <span className="text-sky">{h1b}</span>
            {sp(h1b, h1c)}
            {h1c}
          </h1>
          <p className="m-0 mb-7 max-w-[540px] text-body-lg text-white/80">
            <span className="hidden md:inline">
              {tf('hire.024')}
              {sp(tf('hire.024'), tf('hire.025'))}
              <strong className="text-white">{tf('hire.025')}</strong>
            </span>
            <span className="md:hidden">
              {tf('hire.026')}
              {sp(tf('hire.026'), tf('hire.027'))}
              <strong className="text-white">{tf('hire.027')}</strong>
            </span>
          </p>
          <ul className="m-0 mb-7 flex max-w-[560px] list-none flex-wrap gap-x-8 gap-y-3 p-0">
            {(
              [
                ['hire.028', 'hire.029'],
                ['hire.030', 'hire.031'],
              ] as const
            ).map(([lead, tail]) => (
              <li key={lead} className="flex items-start gap-2.5 text-body text-white/75">
                <span aria-hidden="true" className="mt-1 text-success">✓</span>
                <span>
                  <strong className="text-white">{tf(lead)}</strong>
                  {sp(tf(lead), tf(tail))}
                  {tf(tail)}
                </span>
              </li>
            ))}
          </ul>
          {/* the Call / WhatsApp row is hidden ≤700 px (design line 105); the mobile bottom bar carries both */}
          <div className="mb-6 hidden flex-wrap gap-3 md:flex">
            <ContactCta placement="page_cta" href={telLink(s.phone)} variant="inverse">
              {tf('hire.032')}
            </ContactCta>
            <ContactCta placement="page_cta" href={waLink(s.whatsappNumber, tf('hire.249'))} variant="inverse" external>
              {sysWhatsapp}
            </ContactCta>
          </div>
          <ul data-testid="hire-hero-pills" className="m-0 flex list-none flex-wrap gap-3 p-0 text-body-sm">
            <li className="inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-2 font-bold text-white/80">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-success" />
              {tf('hire.034')}
            </li>
            {placed ? (
              <li className="inline-flex items-baseline gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-2 text-white/70">
                <span className="text-body font-extrabold text-sky">{placed}</span>
                {tf('hire.035')}
              </li>
            ) : null}
            {countries ? (
              <li className="inline-flex items-baseline gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-2 text-white/70">
                <span className="text-body font-extrabold text-success">{countries}</span>
                {tf('hire.036')}
              </li>
            ) : null}
          </ul>
        </div>
        <QuickQuote bundle={bundle} locale={locale} tf={tf} sysWhatsapp={sysWhatsapp} />
      </div>
    </section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/JumpNav.tsx` (mobile-only anchor chips, design `.ja-jump` — `md:hidden`, W10-style: CSS, not conditional rendering):

```tsx
export function JumpNav({ tf, label }: { tf: (id: string) => string; label: string }) {
  const chips = [
    ['#industries', 'hire.067'],
    ['#compare', 'hire.068'],
    ['#process', 'hire.069'],
    ['#faq', 'hire.070'],
  ] as const;
  const chip =
    'flex-none whitespace-nowrap rounded-pill border px-4 py-2 text-body-sm font-extrabold no-underline';
  return (
    <nav aria-label={label} className="border-b border-border-4 bg-white md:hidden">
      <ul className="m-0 flex list-none gap-2 overflow-x-auto px-5 py-3.5 [scrollbar-width:none]">
        {chips.map(([href, id]) => (
          <li key={href}>
            <a href={href} className={`${chip} border-tint-border bg-pale-1 text-blue-safe`}>
              {tf(id)}
            </a>
          </li>
        ))}
        <li>
          <a href="#request-form" className={`${chip} border-ink bg-ink text-white`}>
            {tf('hire.071')}
          </a>
        </li>
      </ul>
    </nav>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/ClientLogos.tsx` (returns `null` when there are no logos — W6 "logo marquees hidden when no logos"; the `employers` stat rides with the band, so it is hidden too rather than standing alone):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { getMetric } from '@/content/collections';
import { LogoMarquee, type Logo } from '@/design/blocks';
import type { Locale } from '@/i18n/routing';
import { metricText } from '../_lib/metric';

export function ClientLogos({
  bundle,
  locale,
  tf,
  logos,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  logos: readonly Logo[];
}) {
  if (logos.length === 0) return null;
  const employers = metricText(getMetric(bundle, 'employers'), locale);
  return (
    <div data-testid="hire-logos" className="hidden border-b border-border-3 py-9 md:block">
      <div className="container-site grid items-center gap-12 md:grid-cols-[auto_1fr]">
        {employers ? (
          <div className="border-r border-border-2 pr-11">
            <p className="m-0 text-stat font-extrabold leading-none text-ink">{employers}</p>
            <p className="m-0 mt-1.5 max-w-[150px] text-body-sm font-bold text-text-tertiary">{tf('hire.073')}</p>
          </div>
        ) : null}
        <LogoMarquee logos={[...logos]} durationSec={38} />
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/Industries.tsx`:

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { getCollection, type Sector } from '@/content/collections';
import { Accordion, type AccordionItem, Section } from '@/design/primitives';
import { SectorPrefillLink } from '../_components/SectorPrefillLink';
import { INDUSTRIES } from '../_lib/tables';

const chip = 'inline-block rounded-pill border px-3 py-1 text-body-sm font-bold';

export function Industries({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const byKey = new Map<string, Sector>(getCollection(bundle, 'sectors').map((s) => [s.key, s]));
  const items: AccordionItem[] = INDUSTRIES.flatMap((row, i) => {
    const sector = byKey.get(row.key);
    if (!sector) return []; // rendered by data: a sector missing from the collection is not a row
    const n = String(i + 1).padStart(2, '0');
    return [
      {
        id: row.key,
        title: `${n} · ${tf(sector.labelId)}`,
        body: (
          <div className="flex flex-col gap-4">
            {sector.subtitleId ? (
              <p className="m-0 text-body-sm font-bold text-blue">{tf(sector.subtitleId)}</p>
            ) : null}
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {row.visibleRoleIds.map((id) => (
                <li key={id} className={`${chip} border-border-2 bg-pale-1 text-text-secondary`}>
                  {tf(id)}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-end justify-between gap-6 rounded-sm bg-gradient-to-br from-blue to-blue-safe p-5 text-white shadow-card-hover">
              <div>
                <p className="m-0 mb-2 text-eyebrow font-extrabold uppercase tracking-[1px] text-white/85">{tf('hire.136')}</p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {row.moreRoleIds.map((id) => (
                    <li key={id} className={`${chip} border-white/35 bg-white/15 text-white`}>
                      {tf(id)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="m-0 text-body-sm font-bold text-[#dff3a6]">{tf('hire.137')}</p>
                <SectorPrefillLink
                  sector={row.key}
                  className="inline-flex min-h-[44px] items-center rounded-input bg-white px-5 text-body-sm font-extrabold text-blue-safe no-underline hover:bg-tint"
                >
                  {tf(row.ctaId)}
                </SectorPrefillLink>
              </div>
            </div>
          </div>
        ),
      },
    ];
  });
  return (
    <Section tone="light" id="industries" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-industries">
        <h2 className="m-0 mb-4 text-center text-h2">{tf('hire.074')}</h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary">{tf('hire.075')}</p>
        <div className="rounded-lg border border-tint-border bg-white px-5">
          <Accordion items={items} singleOpen headingLevel={3} />
        </div>
        <p className="m-0 mt-7 text-center text-body text-text-tertiary">
          {tf('hire.138')}{' '}
          <a href="#request-form" className="font-extrabold text-blue-safe no-underline">
            {tf('hire.139')}
          </a>
        </p>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/SourceCountries.tsx`:

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { getCollection, getMetric } from '@/content/collections';
import { Flag } from '@/design/Flag';
import { isFlagCode } from '@/design/assets/flag-codes';
import { SourceMap, sourceMapLabels } from '@/design/assets/source-map';
import { Eyebrow, PausableMarquee } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { sp } from '../_lib/fragments';
import { metricText } from '../_lib/metric';

export function SourceCountries({
  bundle,
  locale,
  tf,
  sys,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** sys.hire.sc.* + sys.marquee.* resolved by the page */
  sys: { titleTail: string; mapTitle: string; turkiye: string; pause: string; play: string };
}) {
  const rows = getCollection(bundle, 'sourceCountries');
  const count = metricText(getMetric(bundle, 'countries'), locale);
  const a = tf('hire.141'); // TR: deliberately '' (never the EN fallback)
  const b = tf('hire.142');
  const chips = (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
      {rows.map((c) => (
        <li key={c.code} className="inline-flex items-center gap-2 rounded-pill border border-tint-border bg-white px-3.5 py-1.5 text-body-sm font-bold text-text-secondary">
          {isFlagCode(c.code) ? <Flag code={c.code} size={16} /> : null}
          {c.name}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="bg-white pb-16 pt-6">
      <div
        data-testid="hire-source-countries"
        className="container-site grid items-center gap-10 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-14 lg:py-12"
      >
        <div>
          <Eyebrow>{tf('hire.140')}</Eyebrow>
          <h2 className="m-0 mb-4 mt-3 text-h2">
            {a}
            {count ? (
              <>
                {sp(a, count)}
                <span className="text-blue">
                  {count}
                  {b}
                </span>
              </>
            ) : null}
            {sys.titleTail}
          </h2>
          <p className="m-0 mb-5 text-body text-text-secondary">{tf('hire.143')}</p>
          <div className="flex items-start gap-3 rounded-sm border border-tint-border bg-white px-5 py-4">
            <span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-input bg-success-surface text-success">
              ●
            </span>
            <div>
              <p className="m-0 text-body font-extrabold text-ink">{tf('hire.144')}</p>
              <p className="m-0 mt-0.5 text-body-sm text-text-secondary">{tf('hire.145')}</p>
            </div>
          </div>
        </div>
        <div>
          <SourceMap title={sys.mapTitle} labels={sourceMapLabels(rows)} turkiyeLabel={sys.turkiye} id="source-map" className="w-full" />
          {/* flag chips: static wrap from 701 px, the design's 34 s marquee below it (W10: CSS, not branching) */}
          <div data-testid="hire-flags" className="mt-4">
            <div className="hidden md:block">{chips}</div>
            <div className="md:hidden">
              <PausableMarquee durationSec={34} labelPause={sys.pause} labelPlay={sys.play}>
                {chips}
              </PausableMarquee>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Note: when the `countries` metric is unsigned (`null`) the whole "N+ countries" span is hidden and the heading degrades to the fragments around it (W1). Today it renders `13` + `+ countries` → "13+ countries" (EN) / "13+ ülkeden belgeli işçiler" (TR). T0b normalised the copy's `13+` spellings to `13`; `hire.142`'s leading `+` is a package fragment rendered as authored — recorded in the ledger for the WP-C sheet, not "fixed" here.

`src/app/[locale]/(site)/hire-workers/_sections/Comparison.tsx`:

```tsx
import { Section } from '@/design/primitives';
import { COMPARE_ROWS } from '../_lib/tables';

export function Comparison({ tf }: { tf: (id: string) => string }) {
  return (
    <Section tone="light" id="compare" className="!pt-0 scroll-mt-20">
      <div className="container-site" data-testid="hire-compare">
        <h2 className="m-0 mb-4 text-center text-h2">{tf('hire.146')}</h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary">{tf('hire.147')}</p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border-2 bg-white p-8">
            <h3 className="m-0 mb-4 text-body-sm font-extrabold uppercase tracking-[1.5px] text-muted">{tf('hire.148')}</h3>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {COMPARE_ROWS.own.map((r) => (
                <li key={r.titleId} className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-border-3 text-body-sm font-extrabold text-muted">×</span>
                  <div>
                    <p className="m-0 text-body font-bold text-text-secondary">{tf(r.titleId)}</p>
                    <p className="m-0 mt-0.5 text-body-sm text-text-tertiary">{tf(r.bodyId)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border-[1.5px] border-tint-border bg-gradient-to-b from-pale-1 to-tint p-8 shadow-card-hover">
            <h3 className="m-0 mb-4 text-body-sm font-extrabold uppercase tracking-[1.5px] text-blue-safe">{tf('hire.149')}</h3>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {COMPARE_ROWS.with.map((r) => (
                <li key={r.titleId} className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-success text-body-sm font-extrabold text-white">✓</span>
                  <div>
                    <p className="m-0 text-body font-extrabold text-ink">{tf(r.titleId)}</p>
                    <p className="m-0 mt-0.5 text-body-sm text-text-secondary">{tf(r.bodyId)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/Process.tsx` (the design's numbered rail = T0d's `ProcessSteps variant="cards"`, whose Produces names "Hire Workers' boxed rows" as the origin of that variant; the brief's "horizontal Timeline" is the `md:grid-flow-col` row primitive, which is not this design — recorded as a brief deviation in the ledger line):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { ProcessSteps, type ProcessStep } from '@/design/blocks';
import { Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { sp } from '../_lib/fragments';
import { PROCESS_STEPS } from '../_lib/tables';

export function Process({ bundle, locale, tf }: { bundle: Bundle; locale: Locale; tf: (id: string) => string }) {
  const steps: ProcessStep[] = PROCESS_STEPS.map((s) => ({ n: s.n, titleId: s.titleId, bodyId: s.bodyId, when: tf(s.whenId) }));
  const l1a = tf('hire.174');
  const l1b = tf('hire.175');
  const l1c = tf('hire.176');
  const l2a = tf('hire.177');
  const l2b = tf('hire.178');
  const l2c = tf('hire.179');
  const ta = tf('hire.170');
  const tb = tf('hire.171');
  return (
    <Section tone="pale" id="process" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-process">
        <h2 className="m-0 mb-4 text-center text-h2-process">
          {ta}
          {sp(ta, tb)}
          <span className="text-blue">{tb}</span>
        </h2>
        <p className="mx-auto mb-4 mt-0 max-w-[540px] text-center text-body-lg text-text-tertiary">{tf('hire.172')}</p>
        <div className="mb-11 text-center">
          <p className="m-0 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-5 py-2 text-body-sm font-extrabold text-success-text">
            {tf('hire.173')}
          </p>
          {/* the two cross-links are absolute www.jobsadmire.com URLs in the design — locale-aware here */}
          <p className="m-0 mt-3.5 text-body-sm text-text-secondary">
            {l1a}
            {sp(l1a, l1b)}
            <Link href="/work-permit" className="font-extrabold text-blue-safe no-underline">
              {l1b}
            </Link>
            {sp(l1b, l1c)}
            {l1c}
          </p>
          <p className="m-0 mt-2 text-body-sm text-text-secondary">
            {l2a}
            {sp(l2a, l2b)}
            <Link href="/hiring-cost-calculator" className="font-extrabold text-blue-safe no-underline">
              {l2b}
            </Link>
            {sp(l2b, l2c)}
            {l2c}
          </p>
        </div>
        <div className="mx-auto max-w-[760px]">
          <ProcessSteps bundle={bundle} locale={locale} steps={steps} variant="cards" headingLevel={3} />
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/PortalPreview.tsx` (hidden ≤460 px per W10 via `hidden xs:block`; store badges are the design's ≤700 px extra → `md:hidden`; iOS is `null` in settings → `StoreBadges` renders Android only, W8):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { ContactCta, ImageSlot, StoreBadges } from '@/design/blocks';
import { Eyebrow } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { sp } from '../_lib/fragments';

export function PortalPreview({ bundle, locale, tf }: { bundle: Bundle; locale: Locale; tf: (id: string) => string }) {
  const s = bundle.settings;
  const host = new URL(s.portal.host).host; // "portal.jobsadmire.com" — the mock's address bar
  const proofA = tf('hire.191');
  const proofB = tf('hire.192');
  return (
    <div className="hidden bg-white pb-16 xs:block">
      <div
        data-testid="hire-portal"
        className="container-site grid items-center gap-12 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint px-6 py-10 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-14"
      >
        <div className="relative min-h-[440px]">
          <div className="absolute left-0 top-0 w-[80%] overflow-hidden rounded-sm border border-tint-border bg-white shadow-card-hover">
            <div className="flex items-center gap-1.5 border-b border-border-4 bg-pale-2 px-3.5 py-2.5">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-border-2" />
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-border-2" />
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-border-2" />
              <span className="ml-2 flex-1 rounded-[6px] border border-border-4 bg-white px-2.5 py-1 text-eyebrow text-muted">{host}</span>
            </div>
            <ImageSlot slot="portal-shortlist" src={null} alt={tf('hire.243')} width={800} height={310} className="w-full" />
          </div>
          <div className="absolute bottom-0 right-6 z-[2] h-[328px] w-[172px] rounded-[26px] bg-[#0f2438] p-2 shadow-card-hover">
            <ImageSlot slot="portal-mobile-app" src={null} alt={tf('hire.244')} width={156} height={312} className="h-full w-full rounded-[19px]" />
          </div>
          <div className="absolute bottom-6 left-0 z-[3] max-w-[230px] rounded-base border border-tint-border bg-white px-4 py-3.5 shadow-card-hover">
            <p className="m-0 mb-1.5 flex items-center gap-2 text-body-sm font-extrabold text-ink">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-success" />
              {tf('hire.180')}
            </p>
            <p className="m-0 text-body-sm text-text-tertiary">{tf('hire.181')}</p>
          </div>
          <div className="mt-3 md:hidden">
            <StoreBadges bundle={bundle} locale={locale} android={s.storeLinks.android} ios={s.storeLinks.ios} tone="light" />
          </div>
        </div>
        <div>
          <Eyebrow>{tf('hire.182')}</Eyebrow>
          <h2 className="m-0 mb-4 mt-3 text-h2">{tf('hire.183')}</h2>
          <p className="m-0 mb-5 text-body text-text-secondary">{tf('hire.184')}</p>
          <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
            {(['hire.185', 'hire.186'] as const).map((id) => (
              <li key={id} className="flex items-center gap-3 text-body text-ink">
                <span aria-hidden="true" className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-success text-body-sm font-extrabold text-white">✓</span>
                {tf(id)}
              </li>
            ))}
          </ul>
          <div className="mb-7 grid gap-3.5 sm:grid-cols-2">
            {(
              [
                ['hire.187', 'hire.188'],
                ['hire.189', 'hire.190'],
              ] as const
            ).map(([title, body]) => (
              <div key={title} className="rounded-sm border border-tint-border bg-pale-1 px-5 py-4">
                <p className="m-0 mb-2 text-body font-extrabold text-ink">{tf(title)}</p>
                <p className="m-0 text-body-sm text-text-secondary">{tf(body)}</p>
              </div>
            ))}
          </div>
          <p className="m-0 mb-6 text-body text-text-secondary">
            <strong className="text-ink">{proofA}</strong>
            {sp(proofA, proofB)}
            {proofB}
          </p>
          <ContactCta placement="page_cta" href={waLink(s.whatsappNumber, tf('hire.251'))} external size="lg">
            {tf('hire.193')}
          </ContactCta>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/Faq.tsx`:

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FaqBlock, type FaqItem } from '@/design/blocks';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { FAQ_PAIRS } from '../_lib/tables';

export function Faq({ bundle, locale, tf }: { bundle: Bundle; locale: Locale; tf: (id: string) => string }) {
  const s = bundle.settings;
  const items: FaqItem[] = FAQ_PAIRS.map((p) => ({ id: p.id, q: tf(p.qId), a: tf(p.aId) }));
  return (
    <Section tone="pale" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq"
          items={items}
          eyebrowId="hire.194"
          headingId="hire.195"
          bodyId="hire.196"
          askCard={{
            titleId: 'hire.197',
            bodyId: 'hire.198',
            whatsappNumber: s.whatsappNumber,
            whatsappText: tf('hire.252'),
            whatsappLabelId: 'hire.041',
            phone: s.phone,
            callLabelId: 'hire.032',
          }}
          singleOpen
          openFirst
          headingLevel={3}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/page.tsx` — replace the whole file:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf } from '@/content/adapter';
import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { CLIENT_LOGOS } from './_lib/assets';
import { ClientLogos } from './_sections/ClientLogos';
import { Comparison } from './_sections/Comparison';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Industries } from './_sections/Industries';
import { JumpNav } from './_sections/JumpNav';
import { PortalPreview } from './_sections/PortalPreview';
import { Process } from './_sections/Process';
import { RequestForm } from './_sections/RequestForm';
import { SourceCountries } from './_sections/SourceCountries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  // The page record carries hire.264/hire.265 (T0b); the fallbacks are the same ids so a
  // record without them still renders the package's own SEO copy (W23: no sys.seo.hire).
  return buildMetadata({
    locale,
    href: '/hire-workers',
    bundle,
    pageKey: 'hire',
    fallbackTitle: t('hire.264'),
    fallbackDescription: t('hire.265'),
  });
}

export default async function HireWorkers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  // D17/W1: every package id goes through makeTf so the re-authored `{metric}` placeholders
  // render their values; makeT is only used above for the two SEO ids.
  const tf = makeTf(bundle, locale);
  const s = bundle.settings;
  const whatsapp = sys('hire.whatsapp');
  const stickyCtas: StickyCta[] = [
    { label: tf('hire.033'), href: telLink(s.phone), variant: 'secondary' },
    { label: whatsapp, href: waLink(s.whatsappNumber, tf('hire.249')), variant: 'secondary', external: true },
    { label: tf('hire.040'), href: '#request-form', variant: 'primary' },
  ];
  return (
    <>
      <Hero bundle={bundle} locale={locale} tf={tf} sysWhatsapp={whatsapp} />
      <JumpNav tf={tf} label={sys('hire.jump.label')} />
      {/* design .ja-sticky: after 700 px of scroll, hidden while #request-form is in view (W18) */}
      <StickyCtaBar message={tf('hire.072')} ctas={stickyCtas} showAfterPx={700} hideNearId="request-form" live />
      <ClientLogos bundle={bundle} locale={locale} tf={tf} logos={CLIENT_LOGOS} />
      <Industries bundle={bundle} tf={tf} />
      <SourceCountries
        bundle={bundle}
        locale={locale}
        tf={tf}
        sys={{
          titleTail: sys.raw('hire.sc.titleTail'),
          mapTitle: sys('hire.sc.mapTitle'),
          turkiye: sys('hire.sc.turkiye'),
          pause: sys('marquee.pause'),
          play: sys('marquee.play'),
        }}
      />
      <Comparison tf={tf} />
      <Process bundle={bundle} locale={locale} tf={tf} />
      <PortalPreview bundle={bundle} locale={locale} tf={tf} />
      <Faq bundle={bundle} locale={locale} tf={tf} />
      <RequestForm bundle={bundle} locale={locale} tf={tf} sys={{ dial: sys('hire.form.dial'), submit: sys('hire.form.submit') }} />
    </>
  );
}
```

Notes for the implementer:
- No `<main>` (R31 — `SiteChrome` owns it); no `generateStaticParams` (the locale layout has it).
- `sys.raw('hire.sc.titleTail')` — next-intl's `raw` returns the message untouched; the EN value is the empty string on purpose and must render as nothing (if the installed next-intl logs an "empty message" warning for `t()`, `raw()` is the accessor that does not).
- `makeTf` is T0b's accessor (`src/content/pure.ts`), re-exported by `@/content/adapter` (`export * from './pure'`). If the adapter's re-export is somehow narrowed, import it from `@/content/pure` — never from `design-package/**` or `content/local/*` (R56).
- Every `tel:`/`wa.me`/`mailto:` anchor on the page is a `ContactCta`/`ContactLink` with `placement="page_cta"` (W12) except the three `StickyCtaBar` CTAs, which render through T0d's bar (see Foundation gaps).
- The `hidden md:block` / `md:hidden` pairs mirror the design's 700 px rule at this repo's `md` (701 px); `hidden xs:block` on the portal block is W10's 460 px rule at `xs` (461 px). Breakpoints are never scaled (D19).
- Colour literals kept from the design where no token exists: the phone mock's `#0f2438` shell and the panel's `#dff3a6` arrival-note text (both decorative surfaces, not text on the CTA face). Everything else is a theme token.

- [ ] **Step 4: Run tests + npm run verify**

```bash
npm run verify
npm run build && (npx next start -p 3100 & echo $! > /tmp/next.pid) && sleep 4 \
  && E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/hire-workers.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts; kill $(cat /tmp/next.pid)
```
→ verify clean; the page spec green under both projects; `routing.spec`/`seo.spec` unchanged and green (page-h1 contract, canonical `/en/hire-workers`, hreflang `/isci-talebi`); axe zero violations on `/isci-talebi` and `/en/hire-workers` under both projects; no horizontal overflow at any of the nine widths. If axe reports `duplicate-id-active` on `f-honeypot-hire`, stop and record it under Foundation gaps in the ledger — the fix is a `FormShell` id-scope prop in T0a's file, made as a one-line controller-approved edit, not a page workaround.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers" e2e/pages/hire-workers.spec.ts
git commit -m "feat(hire): the Hire Workers page — hero, quick-quote, industries, source map, comparison, process, portal, FAQ, request form

Replaces the WP1 spike. Two hire forms on the forms kernel, metrics from the collection (W1),
stable option keys (W3), city on the wire (W16), build-time map + sprite flags (W14), named
LCP/placeholder slots (D26), sticky bar with hide-near-form (W18).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — gate, budget, pixel harness, docs, ledger

- [ ] **Step 1: Write the failing test**

No new test file: the assertions are the existing gate. Confirm the route facts instead of editing them:

```bash
grep -n "isci-talebi\|en/hire-workers" e2e/routes.ts        # both present, indexable: true (T0e)
grep -n "hire-workers" src/lib/seo/routes.ts                 # NOT in UNBUILT_PATHNAMES
npx vitest run src/lib/seo/unbuilt.test.ts                   # filesystem ↔ set agree
```
Expected: two `e2e/routes.ts` hits, zero `routes.ts` hits, `unbuilt.test.ts` green. If either differs, T0c/T0e drifted — fix the route list, not the page.

- [ ] **Step 2: Run to verify it fails**

Not applicable (no new test). The gate run below is the verification.

- [ ] **Step 3: Implement** (docs + measurements)

`docs/SEO.md` — under `## JSON-LD` (after the table, before `## OG images`), append this section if Task 1 (Homepage) has not created it yet; otherwise append only the row:

```markdown
## Pages (as built in WP2 — one row per page task)

| Route (TR · EN)                    | Title / description source                      | Canonical                              | JSON-LD on the page                                    | LCP slot                                              |
| ---------------------------------- | ----------------------------------------------- | -------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| `/isci-talebi` · `/en/hire-workers` | page record `hire` → `hire.264` / `hire.265`   | `absoluteUrl(locale, '/hire-workers')` | site-wide Organization + WebSite; BreadcrumBList (2); FAQPage (7 pairs, AEO only) | `hw-hero` once the licensed photo lands; `h1` until then (§10 #4) |
```
(Fix the typo `BreadcrumBList` → `BreadcrumbList` when typing it; it is spelled correctly in the JSON-LD.)

`docs/ANALYTICS.md` — under `## Event schema`, after the paragraph beginning "**WP1 wires exactly one of these seven events: `conversion`**", append:

```markdown
**Per-page wiring (WP2).** `/isci-talebi` · `/en/hire-workers`: `call_click` / `whatsapp_click` / `email_click` with `placement: 'page_cta'` on the hero Call/WhatsApp buttons, the request-form phone and e-mail tiles, the "send by e-mail" link, the FAQ ask-card buttons and the portal "Book a demo" WhatsApp button (all through `ContactCta`/`ContactLink`); `whatsapp_click`/`call_click`/`email_click` with `placement: 'form_fallback'` from the two forms' fallback panels; `generate_lead` and `conversion` for `form_key: 'hire'` from the kernel and `/tesekkurler`. The industries "Request <sector> workers →" links and the jump nav are same-page anchors and fire nothing. No page-specific event and no new parameter.
```

`docs/CONTENT-MODEL.md` — in the `sys.*` namespace list (WP2a rewrote this section as "§ Adding copy" with the `sys.form.*` / `sys.<page>.*` / `sys.seo.*` / `sys.blocks.*` / `sys.nav.*` namespaces; add the bullet under `sys.<page>.*`, or after the "Thank-you page" bullet of "### The `sys.*` range" if that older structure is what is on disk — `grep -n "sys.form\|Adding copy" docs/CONTENT-MODEL.md` first):

```markdown
- **Hire Workers page (`sys.hire.*`, WP2 T2):** `whatsapp` (the brand-name CTA label the design carries as a literal), `jump.label` (mobile jump-nav `aria-label`), `sc.titleTail` (the source-countries heading's Turkish noun the runtime dictionary carried as `scTitleC` with no package id — EN is the empty string on purpose), `sc.mapTitle` (the SVG map's accessible name), `sc.turkiye` (`SourceMap`'s `turkiyeLabel`), `form.dial` (dial-select label), `form.submit` (the request form's door submit — replaces `hire.216`'s WhatsApp wording, D13). Every other string on the page is a `hire.*` id through `makeTf`.
```

`docs/PRD.md` — in the pages/forms table, the Hire Workers row: add the hero quick-quote as a second `hire` instance ("quick-quote (hero, ≥701 px) + request form, both `hire`; the quick-quote carries `consent: 'notice'`, the request form a checkbox") and, in the same row or its note, "success → `/tesekkurler?form=hire` for both; the industries CTA prefills the request form's sector". Cite the exact table line when editing (the file is long; `grep -n "Hire Workers" docs/PRD.md`).

Measurements (one job at a time — Mac Studio rule):

```bash
# gate against the Vercel preview of this branch (binding); localhost is advisory (R50)
E2E_BASE_URL=https://<preview>.vercel.app npm run gate
npm run js-size                       # reads .lighthouseci → the per-route script table
npm run pixel -- --page=hire --locale=tr
npm run pixel -- --page=hire --locale=en
```
Read `lighthouse-report/` for the triple, `.pixel/report.json` for the match scores at 390/900/1440. **Two-iteration cap (D27):** at most two fix-and-re-run passes on pixel deltas; anything left is logged as a named delta, never a third pass. If `js-size` reports either hire route above the 194,560 B lazy line, convert `Industries`' `Accordion` mount and the two `FormShell`s' `Turnstile`-adjacent islands to `next/dynamic` on viewport before the next page starts (W13 amended); above 204,800 B the gate has already failed and the page does not merge.

- [ ] **Step 4: Run tests + npm run verify**

```bash
npm run verify
E2E_BASE_URL=https://<preview>.vercel.app npm run gate
```
→ both green; `lhci assert` passes on `/isci-talebi` and `/en/hire-workers` (performance ≥ 0.95, a11y/BP/SEO = 1.0, script ≤ 204,800 B, LCP ≤ 2500 ms on the preview, CLS ≤ 0.1).

- [ ] **Step 5: Commit**

```bash
git add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(hire): SEO page row, analytics wiring, sys.hire namespace, PRD quick-quote instance, ledger

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/SEO.md` (Pages table row: title source `hire.264`/`265` from the page record, canonical per locale, BreadcrumbList + FAQPage, LCP slot `hw-hero`/`h1`), `docs/ANALYTICS.md` (per-page wiring line — no new events, no new params), `docs/CONTENT-MODEL.md` (`sys.hire.*` namespace, 7 keys), `docs/PRD.md` (Hire Workers row: two `hire` instances, notice vs checkbox consent, D13 success path, sector prefill), `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (ledger line below).

**Ledger line (fill the measured numbers):** `T2 Hire Workers — /isci-talebi · /en/hire-workers — script <n> B / <n> B gz (ceiling 204,800; lazy line 194,560) — Lighthouse tr <perf>/<a11y>/<bp>/<seo>, en <…> — LCP <ms> preview — pixel hire-tr 390/900/1440 = <%>/<%>/<%>, hire-en = <…> (iterations: <1|2>) — named deltas: D13 thank-you navigation + sys.hire.form.submit, quick-quote gains name + sys consent notice, optional message on the request form, Accordion string triggers (chips in panel), map without hover, logo band hidden (W6), hero photo placeholder → h1 is LCP (§10 #4), hire.043 via importer override (W7) — brief deviation: ProcessSteps variant="cards" instead of Timeline horizontal (the T0d block built for this design) — WP-C sheet: hire.142 renders "+ countries" after the `13` metric.`

**Sys keys added:** `sys.hire.whatsapp`, `sys.hire.jump.label`, `sys.hire.sc.titleTail`, `sys.hire.sc.mapTitle`, `sys.hire.sc.turkiye`, `sys.hire.form.dial`, `sys.hire.form.submit` (7 keys, both locales; no `sys.seo.hire.*` — the page record carries `hire.264`/`hire.265`).

**Package ids used:** 268 of the page's 302 — first `hire.002` (breadcrumb / nav label, R15 canonical for the page's own crumb), last `hire.302` (FAQ answer 7). Ranges: `hire.002`, `hire.020`–`hire.044`, `hire.047`–`hire.063`, `hire.066`–`hire.075`, `hire.076`–`hire.088` via the `sectors` collection's `labelId`/`subtitleId`, `hire.089`–`hire.140`, `hire.141`–`hire.149`, `hire.150`–`hire.169`, `hire.170`–`hire.200`, `hire.201`–`hire.215`, `hire.219`–`hire.222`, `hire.243`–`hire.244`, `hire.249`–`hire.253`, `hire.264`–`hire.265` (metadata), `hire.271`–`hire.302`. Not rendered on this page (and why): `hire.001`/`003`–`019`, `hire.223`–`hire.242`, `hire.245`–`hire.248` (chrome — the layout renders the canonical `home.*`/`hire.019`/`hire.239`–`241` ids per R15; `hire.240`/`241` reach `StoreBadges` through the block itself), `hire.045`/`046` (inline success panel — D13), `hire.064`/`065`/`217`/`218` (consent copy — the shell renders `sys.form.consent.*`), `hire.216` (WhatsApp submit wording — D13), `hire.254`–`hire.263` (mailto body labels of the mock's `sendByEmail`; the e-mail link carries only the subject `hire.253`), `hire.266`–`hire.270` (OG/schema strings — the OG route reads the page record's title/description; there is no Service node, §3.1). Every id above exists in `src/content/local/catalogue.json` (all 302 `hire.*` ids verified present, 2026-09-20).

**Foundation gaps:** (1) `FormShell` has no consent-copy override prop, so the page cannot render the package's own KVKK lines (`hire.064`+`065` quick, `hire.217`+`065`+`218` full) — the shell's `sys.form.consent.notice`/`label` stand; a `consentLabel?: ReactNode` prop on `FormShell` would let the package copy through. (2) `FormShell`'s honeypot id is `f-honeypot-<formKey>`, so two shells with the same `formKey` on one page (this page: quick + full, both `hire`) render a duplicate id; the consent checkbox id may collide the same way — an `idScope?: string` prop (default `formKey`) on `FormShell` closes it; Cycle 4 stops on an axe `duplicate-id-active` hit rather than working around it. (3) `StickyCtaBar` renders its CTAs through `Button`, not `ContactCta`, so the bar's Call/WhatsApp clicks carry no `call_click`/`whatsapp_click` (W12 says every tel/wa.me anchor); routing `StickyCta` items through `ContactCta` with `placement: 'page_cta'` in T0d's file closes it. (4) `Field as="select"` ignores the `placeholder` prop (the empty first option is always `sys.form.placeholders.select`), so `hire.054`/`058` reach the DOM only if the kernel forwards `placeholder` to selects — harmless either way, the labels are the kernel's. Nothing else is missing: every other name consumed above is spelled exactly as produces-final.md freezes it.
