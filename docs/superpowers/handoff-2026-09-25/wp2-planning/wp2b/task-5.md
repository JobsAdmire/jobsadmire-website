### Task 5: Partner With Us (`/ortak-olun`, `/en/partner-with-us`)

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website` (branch `wp2/foundation`, after WP2a T0a–T0f + Task 9 have landed). Run every command from the repo root; one build/test job at a time (Mac memory rule). Rulings in force here: **W1** (only signed metrics render: `placed` 470+, `countries` 13, `replySlaHours` 4, `homepageReplyHours` 24 — the design's "5+ HR agencies", "20+ sourcing partners", "25+ partner companies" are unsigned → hidden), **W3** (the HR-agency track posts to `hire` with `iAm: 'hr_agency'`; sourcing + institute post to `partner` with `track`; ISO-2 country select; stable option keys; the door's required fields win over the design), **W6** (hidden sections return `null` from data), **W8/W7** (Android badge only; store micro-copy through `StoreBadges`, never partner.162/163), **W9/W23/W54** (no invented package ids; composed copy in `sys.partner.*`), **W10** (desk/mob string pairs render both with CSS visibility), **W12/W26/W67/W68** (`partner_track_select {page, locale, track ∈ sourcing|institute}` only — `track()` drops anything else), **W13 amended** (204,800 B script ceiling; the chooser is light and above the fold, so it is a plain client import, not `next/dynamic`), **W16** (catalog v1.1: `city` on hire/partner, `track` on partner), **W17** (the header CTA for this route is `CTA_BY_PATHNAME['/partner-with-us']` → `#tracks`; **this page must render `id="tracks"`**), **W18** (StickyCtaBar publishes `--sticky-cta-h`), **W20/W21** (delete the `UNBUILT_PATHNAMES` key; append the two paths to `GATE_ROUTE_TABLE` and nowhere else), **W25** (the country select reads the foundation's `countries` collection — 64 rows, data not copy — plus `sourceCountries`; **no `sys.form.countries` list is written**: the brief's "define it in this task" is superseded by W25/produces-final Task 1, which already ships the list as data), **W27/W55/D26** (named placeholders only, never on the LCP element; the hero has no photo per §10 #4, so the LCP element is the h1), **D11/D13** (fallback panel on failure, `/tesekkurler?form=<key>` on success), **D17** (every number via `getMetric`/`makeTf`), **D20** (accessibility over pixel fidelity: visible labels on every input, native radios for the track cards), **R15** (chrome ids are the chrome's — partner.001–022 and 191–221 are not read here), **R22**, **R35**, **R56**.

**What the page is.** The design (`design-package/design/Partner With Us.dc.html`, strings `design-package/strings/partner.json`, ids partner.001–223) in section order: hero (dark, breadcrumb, h1 partner.023, desk/mob lead 024/025, two ticks 026–029, CTAs 030 → `#tracks` + 031 WhatsApp, languages 032/033, and the "Our network today" card 035–046) → partner logo marquee (hidden: no consented logos, §10 #11) → "Where you fit in the chain" 047–058 → sticky CTA bar 059 → `#tracks` "Three ways to partner" 061–070 with three track cards → `#track-detail` showing ONE panel (HR 071–098 / sourcing 099–118 / institute 119–136), each = eyebrow, h2, lead, mobile jump link, four benefit rows, "What we ask from you" card, form card → "How a partnership starts" 137–147 (four steps) → partner portal block 148–166 → FAQ 167–185 (six pairs + ask card) → closing CTA 186–190. Three form instances, two door keys.

**Design deltas this task accepts (write them in the ledger, they are not defects):** (1) inline success banners (partner.088/089) → navigation to `/tesekkurler?form=hire|partner` (D13); (2) the kernel's `sys.form.consent.label` replaces partner.090/091 (one consent sentence site-wide; the link goes to `/privacy`, the KVKK page being a counsel placeholder until D14 clears); (3) the sourcing form keeps its licence declaration (partner.114) **as a second required checkbox** beside the kernel consent — `consentVersion` must be true (door DTO); (4) the sticky bar carries only the `#tracks` CTA — its design Call/WhatsApp buttons would be untracked anchors (see **Foundation gaps**); (5) the network card renders the two signed rows (countries, placed) without count-up; the "5+"/"20+" rows and the "25+" logo caption are hidden (W1); (6) the hero is a gradient (no photo: §10 #4) and the h1 is the LCP element; (7) the track cards are native radios styled as cards (the design's `div onClick`), the state is mirrored into `#track-<key>` so campaigns can deep-link; (8) the institute's "City, country" input is split into a `city` text field + the ISO-2 `country` select; (9) the closing band uses the foundation's dark `ClosingCtaBand` (the design's light gradient is not a band tone); (10) the header CTA is the W17 table's ("Apply to partner" → `#tracks`, secondary "Hire Workers"), not a page prop; (11) partner.059 says "one business day" while partner.087/140/186 render `{replySlaHours}` = 4 working hours — rendered as authored (W7 only re-authored metric spans); listed for the WP-C copy sheet; (12) partner.077 "12+ countries" is not in `scripts/metric-placeholders.json` (the metric is 13) — rendered as authored, listed for the WP-C sheet with the one-line importer fix (`"partner.077": [{ "key": "countries" }]` + a `[12+] countries` literal) that belongs to T0b's table, not to this task.

**Files:**

Create
- `src/app/[locale]/(site)/partner-with-us/page.tsx`
- `src/app/[locale]/(site)/partner-with-us/actions.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/content.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/forms.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/country-options.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/logos.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/forms.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/country-options.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/content.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_components/Tick.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/HeroSection.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/NetworkCard.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/PartnerLogos.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/ChainSection.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/PortalSection.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/TrackPanel.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/FormCard.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/HrAgencyForm.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/SourcingPartnerForm.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/InstituteForm.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/DeclarationCheckbox.tsx` (`'use client'`)
- `src/app/[locale]/(site)/partner-with-us/_components/TrackChooser.tsx` (`'use client'`)
- `src/app/[locale]/(site)/partner-with-us/_components/__tests__/DeclarationCheckbox.test.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/__tests__/TrackChooser.test.tsx`
- `e2e/pages/partner.spec.ts`

Modify
- `src/messages/tr.json`, `src/messages/en.json` — new `sys.partner` object (after `sys.seo`, both files, identical key set)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES`: delete the `'/partner-with-us'` entry (W20; `src/lib/seo/unbuilt.test.ts` fails in either direction otherwise)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: append `{ path: '/ortak-olun', indexable: true }`, `{ path: '/en/partner-with-us', indexable: true }` after the `/en/hire-workers` row (or after the last WP2b page's rows, if T1–T4 landed first)
- `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md`, `docs/PRD.md` (sentences listed under **Docs in this task**)

Test
- Vitest: the five test files above (`npx vitest run "src/app/\[locale\]/(site)/partner-with-us"`), plus the existing `src/lib/seo/unbuilt.test.ts`, `src/messages/messages.test.ts`, `scripts/gate-routes.test.ts`, `src/lib/seo/routes.test.ts` which must stay green
- Playwright: `e2e/pages/partner.spec.ts` + the route-driven `e2e/routing.spec.ts` (page-contract loop), `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` against `next start`
- `npm run gate` against the preview (Lighthouse triple + `npm run js-size` for the ledger)

**Interfaces:**

Consumes (exact names — produces-final.md unless marked WP1):
- WP1: `getBundle`, `makeT` from `@/content/adapter`; `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `buildMetadata` from `@/lib/seo/metadata` (`{ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription }`); `waLink`, `telLink`, `mailLink` from `@/lib/contact`; `formatInt` from `@/lib/format/money`; `Button`, `Section`, `Eyebrow` from `@/design/primitives`; `WhatsAppIcon` from `@/design/chrome/icons`; `track` from `@/analytics/track`; `type FormKey` from `@/analytics/forms`; `renderWithIntl` from `@/test/render`; `type Bundle` from `contract/website-bundle.v1` (six-level relative import from `_components/`, W41 precedent).
- T0b (Task 1): `makeTf(bundle, locale)` from `@/content/adapter` (re-exported from `pure.ts`); `getCollection(bundle, 'sourceCountries' | 'countries')`, `getMetric(bundle, key)`, `type Metric`, `type MetricKey`, `type Country`, `type SourceCountry` from `@/content/collections`; the `pages.partner` record (`titleId: 'partner.222'`, `descriptionId: 'partner.223'`, `jsonLd: ['breadcrumb','faq']`); the re-authored ids partner.078/087/140/159/186 (`{homepageReplyHours}`, `{replySlaHours}`, `{placed}`); partner.162/163 overridden to English (W7).
- T0a (Task 2): `createFormAction`, `type FormActionState` from `@/forms/action`; `type WireFields` from `@/forms/wire`; `fieldErrorsFromIssues` from `@/forms/errors`; `FormShell` from `@/forms/client/FormShell` (`{ action, formKey, locale, turnstileSiteKey, whatsappNumber, contact?, submitLabel?, consentLinkHref?, testId?, children }`); `Field` from `@/forms/client/Field` (`{ name, label?, required?, as?, type?, options?, autoComplete?, inputMode?, rows?, hint? }` — labels default to `sys.form.labels.<name>` for every catalog name, W30); `FormErrorsContext`, `useFieldError`, `useFieldValue` from `@/forms/client/FormErrorsContext`; `CONSENT_FIELD` from `@/forms/types`.
- T0c (Task 3): `ContactLink` from `@/analytics/ContactLink` (`{ href, placement, children, …anchor attrs }`); `PARAM_ENUMS.track = ['sourcing','institute']`, `ALLOWED_PARAMS.partner_track_select = ['page','locale','track']`; `CTA_BY_PATHNAME['/partner-with-us']` (primary partner.017+018 → `{ pathname: '/partner-with-us', hash: '#tracks' }`, secondary home.002 → `/hire-workers`); route group `src/app/[locale]/(site)/` (default chrome).
- T0c (Task 4): `UNBUILT_PATHNAMES` in `src/lib/seo/routes.ts` (initial set contains `'/partner-with-us'`); `pageOgImageUrl` (used by `buildMetadata` automatically → `/og/{locale}/partner.png`).
- T0d (Task 5): `Section` tones `'light' | 'dark' | 'pale' | 'band'`; `StickyCtaBar` from `@/design/chrome/StickyCtaBar` (`{ message, ctas: StickyCta[], hideNearId?, live? }`); from `@/design/blocks`: `Breadcrumbs` (`{ locale, items: Crumb[], tone?, className? }`), `FaqBlock` (`{ bundle, locale, items: FaqItem[], id?, eyebrowId?, headingId?, bodyId?, askCard?: FaqAskCard, openFirst?, footer? }`), `ClosingCtaBand` (`{ bundle, locale, titleId, bodyId?, primary: Cta, secondary?: Cta, ticks?, tone?, id? }`), `ProcessSteps` (`{ bundle, locale, steps: ProcessStep[], variant?, id? }`), `ContactCta` (`{ placement: 'page_cta', href, variant?, size?, external?, className?, children }`), `ImageSlot` (`{ slot, alt, width, height, className? }` → named `data-placeholder` when no `src`), `StoreBadges` (`{ bundle, locale, android, ios? }`), `LogoMarquee` (`{ logos: Logo[] }` → `null` for `[]`), `type Logo`, `type Crumb`, `type FaqItem`, `type ProcessStep`; `ButtonVariant` gains `'inverse'`.
- T0e (Task 7): `GATE_ROUTE_TABLE` in `e2e/routes.ts`; the page markup contract (`h1[data-testid="page-h1"]` with `data-lcp-slot="h1"`, named `data-placeholder`s); `npm run js-size`; `npm run gate`.
- T0f (Task 8): catalog v1.1 — `hire` fields `name, company, email, phone, country, iAm, sector, roleNeeded, headcount, startWhen, message, city`; `partner` fields `name, company, email, phone, country, candidatesPerYear, trades, licence, message, city, track ∈ sourcing|institute`.

Produces (later tasks rely on):
- `id="tracks"` on this page (the W17 header-CTA contract for `/partner-with-us`).
- `src/app/[locale]/(site)/partner-with-us/_lib/country-options.ts` — `countryOptions(source, general, locale)`: the ISO-2 `<select>` option builder T11 (careers detail) may copy; not a shared module on purpose (page-local until a second page needs it).
- `sys.partner.*` keys (list at the end); `e2e/pages/partner.spec.ts` as the reference "form → fallback panel" e2e for T7/T8/T11; two `GATE_ROUTE_TABLE` rows; `UNBUILT_PATHNAMES` minus `/partner-with-us`.

---

#### Cycle 1 — pure content: package-id table, sys copy, form schemas + `toFields`, country options

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/content.test.ts` — every package id the page reads exists in BOTH generated bundles (an unknown id throws in dev and renders `''` in production, WP1 trap), and every `sys.partner.*` key exists in both message files:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { PARTNER_PACKAGE_IDS, PARTNER_SYS_KEYS } from '../content';

// R56 forbids importing src/content/local/* from src/**; readFileSync is the sanctioned bypass
// for a test that pins page copy to the generated bundle (W40 precedent).
const bundle = (locale: 'tr' | 'en') =>
  JSON.parse(
    readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
  ) as { strings: Record<string, string> };

const pick = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>))
      return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);

describe('Partner With Us — package ids', () => {
  it('reads only ids the importer emitted, in both locales, with no empty value', () => {
    const trStrings = bundle('tr').strings;
    const enStrings = bundle('en').strings;
    for (const id of PARTNER_PACKAGE_IDS) {
      expect(trStrings[id], `${id} (tr)`).toBeTypeOf('string');
      expect(trStrings[id], `${id} (tr)`).not.toBe('');
      expect(enStrings[id], `${id} (en)`).toBeTypeOf('string');
      expect(enStrings[id], `${id} (en)`).not.toBe('');
    }
  });

  it('is a de-duplicated list of partner.* ids plus the one hire-workers nav label (partner.002)', () => {
    expect(new Set(PARTNER_PACKAGE_IDS).size).toBe(PARTNER_PACKAGE_IDS.length);
    for (const id of PARTNER_PACKAGE_IDS) expect(id).toMatch(/^partner\.\d{3}$/);
    expect(PARTNER_PACKAGE_IDS).toContain('partner.002');
    expect(PARTNER_PACKAGE_IDS).toContain('partner.223');
  });

  it('never reads the chrome ids (R15) or the ids the deltas retire', () => {
    for (const id of [
      'partner.001', 'partner.013', 'partner.017', 'partner.018', 'partner.019', // chrome / W17 table
      'partner.034', // hero photo alt — no photo (§10 #4)
      'partner.037', 'partner.039', 'partner.045', // unsigned metrics (W1)
      'partner.060', // sticky-bar Call — see Foundation gaps
      'partner.088', 'partner.089', // inline success banner → /tesekkurler (D13)
      'partner.090', 'partner.091', // consent copy is the kernel's (sys.form.consent)
      'partner.135', // "City, country" → city + ISO-2 country
      'partner.162', 'partner.163', // store micro-copy renders through StoreBadges (hire.240/241)
      'partner.191', 'partner.211', 'partner.221', // footer chrome
    ])
      expect(PARTNER_PACKAGE_IDS, id).not.toContain(id);
  });
});

describe('Partner With Us — sys.partner.* copy', () => {
  it('exists as a non-empty string in both locales', () => {
    for (const key of PARTNER_SYS_KEYS) {
      expect(pick(tr.sys, key), `${key} (tr)`).toBeTypeOf('string');
      expect(pick(en.sys, key), `${key} (en)`).toBeTypeOf('string');
      expect(pick(tr.sys, key), `${key} (tr)`).not.toBe('');
      expect(pick(en.sys, key), `${key} (en)`).not.toBe('');
    }
  });

  it('is not English in Turkish: the TR prefill and legend differ from the EN ones', () => {
    for (const key of ['partner.whatsapp.prefill', 'partner.tracks.legend', 'partner.faq.emailSubject'])
      expect(pick(tr.sys, key)).not.toBe(pick(en.sys, key));
  });
});
```

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/forms.test.ts` — the three schemas, the kernel's error vocabulary, and `toFields` mapping onto the EXACT Ops catalog names:

```ts
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import {
  DECLARATION_FIELD,
  HR_COUNTRY,
  PARTNER_TRACKS,
  TRACK_KEYS,
  hrAgencySchema,
  hrAgencyToFields,
  instituteSchema,
  instituteToFields,
  sourcingSchema,
  sourcingToFields,
} from '../forms';

// The door keeps exactly these names (website-form-catalog.ts, v1.0 + the v1.1 additions of
// T0f/W16) and silently DROPS anything else — so a typo here loses data with no error.
const HIRE_CATALOG = [
  'name', 'company', 'email', 'phone', 'country', 'iAm', 'sector', 'roleNeeded', 'headcount',
  'startWhen', 'message', 'city',
];
const PARTNER_CATALOG = [
  'name', 'company', 'email', 'phone', 'country', 'candidatesPerYear', 'trades', 'licence',
  'message', 'city', 'track',
];

const hrValid = {
  company: '  Akdeniz İK A.Ş. ',
  name: 'Ayşe Yılmaz',
  city: 'Antalya',
  email: 'ayse@example.com',
  phone: '+90 532 000 00 00',
  message: 'Kaynakçı ve CNC operatörü',
  consent: 'on',
};

describe('HR-agency track → hire (W3)', () => {
  it('maps onto the hire catalog names, forcing country TR and iAm hr_agency', () => {
    const fields = hrAgencyToFields(hrAgencySchema.parse(hrValid));
    expect(fields).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Akdeniz İK A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 532 000 00 00',
      country: HR_COUNTRY,
      iAm: 'hr_agency',
      city: 'Antalya',
      message: 'Kaynakçı ve CNC operatörü',
    });
    expect(HR_COUNTRY).toBe('TR');
    for (const key of Object.keys(fields)) expect(HIRE_CATALOG, key).toContain(key);
  });

  it('reports required / email / phone in the kernel vocabulary (required before email)', () => {
    const r = hrAgencySchema.safeParse({ company: '', name: '', city: '', email: 'nope', phone: '12' });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(fieldErrorsFromIssues(r.error.issues)).toEqual({
        company: 'required',
        name: 'required',
        city: 'required',
        email: 'email',
        phone: 'phone',
      });
    const empty = hrAgencySchema.safeParse({ ...hrValid, email: '' });
    if (!empty.success) expect(fieldErrorsFromIssues(empty.error.issues)).toEqual({ email: 'required' });
  });

  it('sends an empty message when the textarea is blank (buildEnvelope drops it)', () => {
    const fields = hrAgencyToFields(hrAgencySchema.parse({ ...hrValid, message: '' }));
    expect(fields.message).toBe('');
  });
});

const sourcingValid = {
  company: 'Karachi Manpower Ltd',
  name: 'Bilal Khan',
  country: 'pk',
  licence: 'OEP-1234',
  email: 'bilal@example.com',
  phone: '+92 300 1234567',
  candidatesPerYear: '250',
  trades: 'Welders, electricians — 20 a month',
  [DECLARATION_FIELD]: 'on',
  consent: 'on',
};

describe('sourcing-partner track → partner + track:sourcing (W3/W16)', () => {
  it('maps onto the partner catalog names with the upper-cased ISO-2 country and track sourcing', () => {
    const fields = sourcingToFields(sourcingSchema.parse(sourcingValid));
    expect(fields).toEqual({
      name: 'Bilal Khan',
      company: 'Karachi Manpower Ltd',
      email: 'bilal@example.com',
      phone: '+92 300 1234567',
      country: 'PK',
      track: 'sourcing',
      licence: 'OEP-1234',
      candidatesPerYear: '250',
      trades: 'Welders, electricians — 20 a month',
    });
    for (const key of Object.keys(fields)) expect(PARTNER_CATALOG, key).toContain(key);
    expect(PARTNER_TRACKS).toEqual(['sourcing', 'institute']);
    expect(TRACK_KEYS).toEqual(['hr', 'sourcing', 'institute']);
  });

  it('requires the licence declaration checkbox as its own field, beside the kernel consent', () => {
    const { [DECLARATION_FIELD]: _drop, ...noDeclaration } = sourcingValid;
    const r = sourcingSchema.safeParse(noDeclaration);
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrorsFromIssues(r.error.issues)).toEqual({ [DECLARATION_FIELD]: 'required' });
    expect(DECLARATION_FIELD).toBe('licenceDeclaration');
  });

  it('rejects a free-text country (the door would 400) and an empty select as required', () => {
    const free = sourcingSchema.safeParse({ ...sourcingValid, country: 'Pakistan' });
    if (!free.success) expect(fieldErrorsFromIssues(free.error.issues)).toEqual({ country: 'invalid' });
    const blank = sourcingSchema.safeParse({ ...sourcingValid, country: '' });
    if (!blank.success) expect(fieldErrorsFromIssues(blank.error.issues)).toEqual({ country: 'required' });
    expect(free.success).toBe(false);
    expect(blank.success).toBe(false);
  });

  it('caps trades at the catalog length (500) with the max code and licence as required', () => {
    const long = sourcingSchema.safeParse({ ...sourcingValid, trades: 'x'.repeat(501), licence: '' });
    expect(long.success).toBe(false);
    if (!long.success)
      expect(fieldErrorsFromIssues(long.error.issues)).toEqual({ trades: 'max', licence: 'required' });
  });
});

describe('institute track → partner + track:institute (W3/W16)', () => {
  it('maps city + country separately and sends track institute', () => {
    const fields = instituteToFields(
      instituteSchema.parse({
        company: 'Lahore Technical Institute',
        name: 'Sara Ahmed',
        city: 'Lahore',
        country: 'PK',
        email: 'sara@example.com',
        phone: '+92 42 1234567',
        trades: 'Plumbing, HVAC — 60 graduates per batch',
        consent: 'on',
      }),
    );
    expect(fields).toEqual({
      name: 'Sara Ahmed',
      company: 'Lahore Technical Institute',
      email: 'sara@example.com',
      phone: '+92 42 1234567',
      country: 'PK',
      track: 'institute',
      city: 'Lahore',
      candidatesPerYear: '',
      trades: 'Plumbing, HVAC — 60 graduates per batch',
    });
    for (const key of Object.keys(fields)) expect(PARTNER_CATALOG, key).toContain(key);
  });

  it('treats city as optional for an institute (the design asked "City, country" in one box)', () => {
    const r = instituteSchema.safeParse({
      company: 'X', name: 'Y', country: 'NP', email: 'a@b.co', phone: '+977 9812345678',
    });
    expect(r.success).toBe(true);
  });
});
```

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/country-options.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { countryOptions } from '../country-options';

const source = [
  { code: 'PK', name: 'Pakistan' },
  { code: 'NP', name: 'Nepal' },
  { code: 'IN', name: 'Hindistan' },
];
const general = [
  { code: 'AE', name: 'Birleşik Arap Emirlikleri' },
  { code: 'TR', name: 'Türkiye' },
  { code: 'PK', name: 'Pakistan' }, // also a source country — must not repeat
  { code: 'IR', name: 'İran' },
  { code: 'ID', name: 'Endonezya' },
];

describe('countryOptions', () => {
  it('lists the source countries first in their own order, then the rest sorted by name in the locale', () => {
    const opts = countryOptions(source, general, 'tr');
    expect(opts.map((o) => o.value)).toEqual(['PK', 'NP', 'IN', 'AE', 'ID', 'IR', 'TR']);
    expect(opts[0]).toEqual({ value: 'PK', label: 'Pakistan' });
  });

  it('sorts Turkish letters with the Turkish collation (İ after I, not after Z)', () => {
    const opts = countryOptions([], [{ code: 'IR', name: 'İran' }, { code: 'IS', name: 'İzlanda' }, { code: 'IE', name: 'İrlanda' }], 'tr');
    expect(opts.map((o) => o.label)).toEqual(['İran', 'İrlanda', 'İzlanda']);
  });

  it('never emits a duplicate code and always keeps TR available (an HR agency abroad may pick it)', () => {
    const opts = countryOptions(source, general, 'en');
    expect(new Set(opts.map((o) => o.value)).size).toBe(opts.length);
    expect(opts.some((o) => o.value === 'TR')).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/partner-with-us/_lib"` → three files fail at import (`Failed to resolve import "../content"`, `"../forms"`, `"../country-options"`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/_lib/content.ts` — the page's id table (one place; the page and the panels read from it, the test pins it to the bundle):

```ts
/**
 * Every package id this page reads, grouped by section, plus the sys.partner.* keys. The
 * chrome's ids (partner.001–022, 191–221) are NOT here: the chrome reads its own canonical ids
 * (R15) and the header CTA pair partner.017/018 belongs to `CTA_BY_PATHNAME` (W17).
 * `_lib/__tests__/content.test.ts` asserts each id exists in both generated bundles.
 */
export const HERO_IDS = {
  crumbHome: 'partner.016',
  crumbSelf: 'partner.008',
  h1: 'partner.023',
  leadDesk: 'partner.024',
  leadMob: 'partner.025',
  tick1Lead: 'partner.026',
  tick1Tail: 'partner.027',
  tick2Lead: 'partner.028',
  tick2Tail: 'partner.029',
  ctaTracks: 'partner.030',
  ctaWhatsApp: 'partner.031',
  speakLead: 'partner.032',
  speakTail: 'partner.033',
} as const;

export const NETWORK_IDS = {
  heading: 'partner.035',
  live: 'partner.036',
  footnote: 'partner.046',
} as const;

/** The design's four rows; only the two with a signed metric render (W1). `metric: null` rows
 *  are listed so the data says why they are absent, and their ids are deliberately not read. */
export const NETWORK_ROWS = [
  { metric: null, deskId: 'partner.037', mobId: 'partner.038', tone: 'text-blue' },
  { metric: null, deskId: 'partner.039', mobId: 'partner.040', tone: 'text-success' },
  { metric: 'countries', deskId: 'partner.041', mobId: 'partner.042', tone: 'text-[#35468a]' },
  { metric: 'placed', deskId: 'partner.043', mobId: 'partner.044', tone: 'text-warning-text' },
] as const;

export const CHAIN_IDS = {
  heading: 'partner.047',
  introLead: 'partner.048',
  introLink: 'partner.002', // the package splits the sentence around the Hire Workers link (W23)
  introTail: 'partner.049',
  nodes: [
    { eyebrow: 'partner.050', title: 'partner.051', body: 'partner.052', tone: 'supply' },
    { eyebrow: 'partner.053', title: 'partner.054', body: 'partner.055', tone: 'core' },
    { eyebrow: 'partner.056', title: 'partner.057', body: 'partner.058', tone: 'demand' },
  ],
} as const;

export const STICKY_IDS = { message: 'partner.059', cta: 'partner.030' } as const;

export const TRACKS_IDS = {
  heading: 'partner.061',
  introDesk: 'partner.062',
  introMob: 'partner.063',
  wayfinderChoose: 'partner.064',
  wayfinderApply: 'partner.070',
  cardCta: 'partner.066',
  cards: {
    hr: { title: 'partner.038', body: 'partner.065' },
    sourcing: { title: 'partner.040', body: 'partner.067' },
    institute: { title: 'partner.068', body: 'partner.069' },
  },
} as const;

export const PANEL_IDS = {
  jump: 'partner.074',
  asksHeading: 'partner.082',
  sla: 'partner.087',
  submit: 'partner.092',
  hr: {
    eyebrow: 'partner.071',
    heading: 'partner.072',
    lead: 'partner.073',
    benefits: [
      ['partner.075', 'partner.076'],
      ['partner.077', 'partner.078'],
      ['partner.079', 'partner.080'],
      ['partner.028', 'partner.081'],
    ],
    asks: ['partner.083', 'partner.084', 'partner.085'],
    formTitle: 'partner.086',
    fields: { company: 'partner.093', name: 'partner.094', city: 'partner.095', email: 'partner.096', phone: 'partner.097', message: 'partner.098' },
  },
  sourcing: {
    eyebrow: 'partner.099',
    heading: 'partner.100',
    lead: 'partner.101',
    benefits: [
      ['partner.102', 'partner.103'],
      ['partner.104', 'partner.105'],
      ['partner.106', 'partner.107'],
      ['partner.108', 'partner.109'],
    ],
    asks: ['partner.110', 'partner.111', 'partner.112'],
    formTitle: 'partner.113',
    declaration: 'partner.114',
    fields: { company: 'partner.093', name: 'partner.094', country: 'partner.115', licence: 'partner.116', email: 'partner.117', phone: 'partner.097', trades: 'partner.118' },
  },
  institute: {
    eyebrow: 'partner.119',
    heading: 'partner.120',
    lead: 'partner.121',
    benefits: [
      ['partner.122', 'partner.123'],
      ['partner.124', 'partner.125'],
      ['partner.126', 'partner.127'],
      ['partner.128', 'partner.129'],
    ],
    asks: ['partner.130', 'partner.131', 'partner.132'],
    formTitle: 'partner.133',
    fields: { company: 'partner.134', name: 'partner.094', country: 'partner.115', email: 'partner.117', phone: 'partner.097', trades: 'partner.136' },
  },
} as const;

export const PROCESS_IDS = {
  heading: 'partner.137',
  intro: 'partner.138',
  steps: [
    { n: 1, titleId: 'partner.139', bodyId: 'partner.140' },
    { n: 2, titleId: 'partner.141', bodyId: 'partner.142' },
    { n: 3, titleId: 'partner.143', bodyId: 'partner.144' },
    { n: 4, titleId: 'partner.145', bodyId: 'partner.147', whenId: 'partner.146' },
  ],
} as const;

export const PORTAL_IDS = {
  eyebrow: 'partner.148',
  heading: 'partner.149',
  lead: 'partner.150',
  features: [
    ['partner.151', 'partner.152'],
    ['partner.153', 'partner.154'],
    ['partner.155', 'partner.156'],
    ['partner.157', 'partner.158'],
  ],
  claimLead: 'partner.159',
  claimTail: 'partner.160',
  mobileLine: 'partner.161',
  addressBar: 'partner.164',
  screenAlt: 'partner.165',
  mobileAlt: 'partner.166',
} as const;

export const FAQ_IDS = {
  eyebrow: 'partner.167',
  heading: 'partner.168',
  lead: 'partner.169',
  pairs: [
    ['partner.170', 'partner.171'],
    ['partner.172', 'partner.173'],
    ['partner.174', 'partner.175'],
    ['partner.176', 'partner.177'],
    ['partner.178', 'partner.179'],
    ['partner.180', 'partner.181'],
  ],
  askTitle: 'partner.182',
  askBody: 'partner.183',
  askWhatsApp: 'partner.184',
  askCall: 'partner.185',
} as const;

export const CLOSING_IDS = {
  badge: 'partner.186',
  heading: 'partner.187',
  body: 'partner.188',
  primary: 'partner.189',
  legal: 'partner.190',
} as const;

export const SEO_IDS = { title: 'partner.222', description: 'partner.223' } as const;

const flatten = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === 'string') {
    if (/^partner\.\d{3}$/.test(value)) out.push(value);
  } else if (Array.isArray(value)) value.forEach((v) => flatten(v, out));
  else if (value && typeof value === 'object')
    Object.values(value as Record<string, unknown>).forEach((v) => flatten(v, out));
  return out;
};

/** Every id resolved at render time (the `metric: null` network rows are excluded: never read). */
export const PARTNER_PACKAGE_IDS: readonly string[] = [
  ...new Set(
    flatten([
      HERO_IDS,
      NETWORK_IDS,
      NETWORK_ROWS.filter((r) => r.metric !== null),
      CHAIN_IDS,
      STICKY_IDS,
      TRACKS_IDS,
      PANEL_IDS,
      PROCESS_IDS,
      PORTAL_IDS,
      FAQ_IDS,
      CLOSING_IDS,
      SEO_IDS,
    ]),
  ),
].sort();

/** `sys.partner.*` (W9/W23) — read through next-intl, never `t()`. */
export const PARTNER_SYS_KEYS = [
  'partner.whatsapp.prefill',
  'partner.faq.whatsappText',
  'partner.faq.emailSubject',
  'partner.faq.email',
  'partner.tracks.legend',
] as const;
```

`src/app/[locale]/(site)/partner-with-us/_lib/forms.ts` — pure (no `server-only`, no React): the Zod schemas and the catalog mappings, so the server actions stay one-liners and the mapping is unit-tested:

```ts
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';

/** The three track cards. `hr` posts to `hire`; the other two to `partner` (W3). */
export const TRACK_KEYS = ['hr', 'sourcing', 'institute'] as const;
export type TrackKey = (typeof TRACK_KEYS)[number];

/** Catalog v1.1 `partner.track` enum (W16) — also `PARAM_ENUMS.track` for the analytics event. */
export const PARTNER_TRACKS = ['sourcing', 'institute'] as const;
export type PartnerTrack = (typeof PARTNER_TRACKS)[number];

/** The sourcing form's licence/no-fee declaration (partner.114): its own required checkbox,
 *  beside the kernel's KVKK consent — the door's `consentVersion` must be true (D14). */
export const DECLARATION_FIELD = 'licenceDeclaration';

/** The HR-agency track is a Turkish company by definition (partner.083); the `hire` catalog
 *  wants an ISO-2 country, the design asks for a city. */
export const HR_COUNTRY = 'TR';

// The kernel's vocabulary (src/forms/errors.ts): `.min(1)` before `.email()` so an empty value
// reads 'required', not 'email'; a custom `message` that is a FormErrorCode wins (phone/invalid).
const PHONE = /(\D*\d){8,}/;
const ISO2 = /^[A-Z]{2}$/;
const required = (max: number) => z.string().trim().min(1).max(max);
const optional = (max: number) => z.string().trim().max(max).optional();
const email = z.string().trim().min(1).max(254).email();
const phone = z.string().trim().min(1).regex(PHONE, { message: 'phone' }).max(40);
/** The `<select>` posts the ISO-2 code (W3/W40); anything else would be a door 400. */
const country = z.string().trim().toUpperCase().min(1).regex(ISO2, { message: 'invalid' });

export const hrAgencySchema = z.object({
  company: required(200),
  name: required(120),
  city: required(120),
  email,
  phone,
  message: optional(5000),
});
export type HrAgencyInput = z.infer<typeof hrAgencySchema>;

export const sourcingSchema = z.object({
  company: required(200),
  name: required(120),
  country,
  licence: required(200),
  email,
  phone,
  candidatesPerYear: optional(20),
  trades: optional(500),
  [DECLARATION_FIELD]: z.literal('on', { message: 'required' }),
});
export type SourcingInput = z.infer<typeof sourcingSchema>;

export const instituteSchema = z.object({
  company: required(200),
  name: required(120),
  city: optional(120),
  country,
  email,
  phone,
  candidatesPerYear: optional(20),
  trades: optional(500),
});
export type InstituteInput = z.infer<typeof instituteSchema>;

// Wire names = the Ops catalog's, exactly (website-form-catalog.ts; unknown keys are dropped
// silently). Empty strings are dropped by buildEnvelope, so optionals map to ''.

/** → `hire` with `iAm: 'hr_agency'` (W3): the HR track is a Turkish employer-side client and
 *  must reach the Turkey sales team, which the `partner` key (→ SOURCING_PARTNER) would not. */
export function hrAgencyToFields(p: HrAgencyInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: HR_COUNTRY,
    iAm: 'hr_agency',
    city: p.city,
    message: p.message ?? '',
  };
}

/** → `partner` with `track: 'sourcing'` (W16). */
export function sourcingToFields(p: SourcingInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: p.country,
    track: 'sourcing',
    licence: p.licence,
    candidatesPerYear: p.candidatesPerYear ?? '',
    trades: p.trades ?? '',
  };
}

/** → `partner` with `track: 'institute'` (W16; classification stays SOURCING_PARTNER, the
 *  track rides in the inbox tag `[website:partner:institute]`). */
export function instituteToFields(p: InstituteInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: p.country,
    track: 'institute',
    city: p.city ?? '',
    candidatesPerYear: p.candidatesPerYear ?? '',
    trades: p.trades ?? '',
  };
}
```

`src/app/[locale]/(site)/partner-with-us/_lib/country-options.ts`:

```ts
import type { Locale } from '@/i18n/routing';

export type CountryOption = { value: string; label: string };
type CountryLike = { code: string; name: string };

const COLLATION: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' };

/** The ISO-2 `<select>` options (W3/W25): the 13 source countries first, in the collection's
 *  order, then every other country of the general list sorted by its locale name. Values are
 *  the upper-case codes the door validates; labels are the locale-resolved names. */
export function countryOptions(
  source: ReadonlyArray<CountryLike>,
  general: ReadonlyArray<CountryLike>,
  locale: Locale,
): CountryOption[] {
  const seen = new Set<string>();
  const head: CountryOption[] = [];
  for (const c of source) {
    if (seen.has(c.code)) continue;
    seen.add(c.code);
    head.push({ value: c.code, label: c.name });
  }
  const collator = new Intl.Collator(COLLATION[locale]);
  const tail = general
    .filter((c) => !seen.has(c.code) && seen.add(c.code))
    .map((c) => ({ value: c.code, label: c.name }))
    .sort((a, b) => collator.compare(a.label, b.label));
  return [...head, ...tail];
}
```

`src/app/[locale]/(site)/partner-with-us/_lib/logos.ts`:

```ts
import type { Logo } from '@/design/blocks';

/** §10 #11: partner logos ship in v1.1 with written consent. Empty in Phase A, so the logo
 *  strip (and its "25+" caption, an unsigned metric — W1) is hidden by data (W6). */
export const PARTNER_LOGOS: readonly Logo[] = [];
```

`src/messages/tr.json` — inside `"sys"`, after the `"seo"` object (keep the file's key order; a new sibling object):

```json
    "partner": {
      "whatsapp": {
        "prefill": "Merhaba JobsAdmire, bir iş ortaklığı hakkında görüşmek istiyorum."
      },
      "faq": {
        "whatsappText": "Merhaba JobsAdmire, iş ortaklığıyla ilgili bir sorum var.",
        "emailSubject": "İş ortaklığı sorusu",
        "email": "E-posta"
      },
      "tracks": {
        "legend": "Ortaklık türünüzü seçin"
      }
    },
```

`src/messages/en.json` — same position:

```json
    "partner": {
      "whatsapp": {
        "prefill": "Hello JobsAdmire, I would like to discuss a partnership."
      },
      "faq": {
        "whatsappText": "Hello JobsAdmire, I have a partnership question.",
        "emailSubject": "Partnership question",
        "email": "Email"
      },
      "tracks": {
        "legend": "Choose your partnership type"
      }
    },
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/\[locale\]/(site)/partner-with-us/_lib" src/messages` → 3 + 1 files passed (content 5, forms 9, country-options 3, messages key-set parity). `npx tsc --noEmit` → clean. `npx eslint "src/app/[locale]/(site)/partner-with-us"` → clean. `npx prettier --write "src/app/[locale]/(site)/partner-with-us" src/messages` then `npm run verify` → green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us/_lib" src/messages/tr.json src/messages/en.json
git commit -m "feat(partner): id table, sys.partner copy, track form schemas → hire/partner catalog fields, ISO-2 country options (T5 c1)

HR-agency track → hire + iAm hr_agency + country TR (W3); sourcing/institute → partner + track
(W16) with the licence declaration as its own required checkbox; countries from the W25
collections, source countries first.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — page skeleton: metadata, hero + network card, chain, process, portal, FAQ, closing, sticky bar; route wiring; the page-contract e2e

- [ ] **Step 1: Write the failing tests**

`e2e/pages/partner.spec.ts` (the whole file; the track and form cases at the bottom go red until Cycles 3–4):

```ts
import { test, expect, type Page } from '@playwright/test';

const ROUTE = { tr: '/ortak-olun', en: '/en/partner-with-us' } as const;
const ORIGIN = 'https://www.jobsadmire.com';

// Section test ids in the design's order; the logo strip is absent by data (W6, §10 #11).
const SECTIONS = [
  'partner-network',
  'partner-chain',
  'partner-tracks',
  'partner-track-detail',
  'partner-process',
  'partner-portal',
  'partner-faq',
  'partner-closing',
];

type DataLayerEntry = Record<string, unknown>;
const dataLayer = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? [],
  ) as Promise<DataLayerEntry[]>;

for (const [locale, route] of Object.entries(ROUTE) as ['tr' | 'en', string][]) {
  test(`${route}: page contract, sections in order, no leaked tokens, no logo strip`, async ({
    page,
  }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.locator('h1[data-testid="page-h1"]');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect((await h1.innerText()).trim().length).toBeGreaterThan(0);
    // W1 placeholders filled, no missing id rendered as ''/undefined, no object leaked.
    expect(await page.locator('body').innerText()).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
    for (const id of SECTIONS) await expect(page.getByTestId(id)).toHaveCount(1);
    await expect(page.getByTestId('partner-logos')).toHaveCount(0);
    // W17: the header CTA for this route points at #tracks, so the page must render it.
    await expect(page.locator('#tracks')).toHaveCount(1);
    // Only the LCP h1 carries data-lcp-slot; the two portal mocks are the named placeholders (D26/W55).
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    const placeholders = await page.locator('[data-placeholder]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-placeholder')),
    );
    expect(placeholders.sort()).toEqual(['partner-portal-mobile', 'partner-portal-screen']);
    // The default track is the HR agency; its form is the only one mounted.
    await expect(page.getByTestId('partner-form-hr')).toBeVisible();
    await expect(page.getByTestId('partner-form-sourcing')).toHaveCount(0);
    await expect(page.getByTestId('partner-form-institute')).toHaveCount(0);
  });
}

test('metadata: package SEO strings, canonical, hreflang pair, breadcrumb + FAQ JSON-LD', async ({
  page,
  request,
}) => {
  await page.goto(ROUTE.en);
  await expect(page).toHaveTitle(/Recruitment Agency Partnership in Turkey|Türkiye/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}/en/partner-with-us`);
  await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', `${ORIGIN}/ortak-olun`);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', `${ORIGIN}/ortak-olun`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${ORIGIN}/og/en/partner.png`);
  const html = await (await request.get(ROUTE.tr)).text();
  expect(html).toContain('"@type":"BreadcrumbList"');
  expect(html).toContain('"@type":"FAQPage"');
  // The site-wide Organization node exactly once — the design's per-page EmploymentAgency block is not duplicated.
  expect(html.split('"@type":["Organization","EmploymentAgency"]').length - 1).toBe(1);
});

test('the language links point at the localized alternate of this page, not the parent', async ({
  page,
}) => {
  await page.goto(ROUTE.tr);
  expect(await page.locator('a[href="/en/partner-with-us"]').count()).toBeGreaterThan(0);
  await page.goto(ROUTE.en);
  expect(await page.locator('a[href="/ortak-olun"]').count()).toBeGreaterThan(0);
});

test('choosing the sourcing track opens its form, fires partner_track_select and writes the hash', async ({
  page,
}) => {
  await page.goto(ROUTE.tr);
  await page.locator('label[for="track-sourcing"]').click();
  await expect(page.getByTestId('partner-form-sourcing')).toBeVisible();
  await expect(page.getByTestId('partner-form-hr')).toHaveCount(0);
  await expect(page.locator('#track-sourcing')).toBeChecked();
  expect(new URL(page.url()).hash).toBe('#track-sourcing');
  const events = (await dataLayer(page)).filter((e) => e.event === 'partner_track_select');
  expect(events).toEqual([{ event: 'partner_track_select', page: '/ortak-olun', locale: 'tr', track: 'sourcing' }]);
  // Back to the HR card: the default is not a signal (W67 enum has no `hr`), nothing more fires.
  await page.locator('label[for="track-hr"]').click();
  await expect(page.getByTestId('partner-form-hr')).toBeVisible();
  expect((await dataLayer(page)).filter((e) => e.event === 'partner_track_select')).toHaveLength(1);
});

test('a #track-institute deep link opens the institute panel on load without an event', async ({
  page,
}) => {
  await page.goto(`${ROUTE.en}#track-institute`);
  await expect(page.getByTestId('partner-form-institute')).toBeVisible();
  await expect(page.locator('#track-institute')).toBeChecked();
  expect((await dataLayer(page)).filter((e) => e.event === 'partner_track_select')).toHaveLength(0);
});

test('the sourcing form requires the licence declaration AND the KVKK consent', async ({ page }) => {
  await page.goto(`${ROUTE.tr}#track-sourcing`);
  const form = page.getByTestId('partner-form-sourcing');
  await expect(form).toBeVisible();
  await form.locator('[name="company"]').fill('Karachi Manpower');
  await form.locator('[name="name"]').fill('Bilal Khan');
  await form.locator('select[name="country"]').selectOption('PK');
  await form.locator('[name="licence"]').fill('OEP-1234');
  await form.locator('[name="email"]').fill('bilal@example.com');
  await form.locator('[name="phone"]').fill('+92 300 1234567');
  await form.locator('button[type="submit"]').click();
  // Two field errors, one per checkbox; no door call was made (the URL is unchanged).
  await expect(form.locator('#f-licenceDeclaration-error')).toBeVisible();
  await expect(form.locator('#f-consent-error')).toBeVisible();
  expect(new URL(page.url()).pathname).toBe('/ortak-olun');
});

test('the HR-agency form shows the visitor fallback panel when the door is not configured (D11)', async ({
  page,
}) => {
  // Deterministic: with OPS_API_URL / OPS_WEBSITE_WRITE_TOKEN unset, `doorConfig()` is null and
  // `postForm` answers { kind: 'unauthorized' } without a network call; with them set the
  // door answers something else — either way the visitor gets an alert with a WhatsApp door,
  // never a spinner and never a fake success.
  await page.goto(ROUTE.tr);
  const form = page.getByTestId('partner-form-hr');
  await form.locator('[name="company"]').fill('Akdeniz İK');
  await form.locator('[name="name"]').fill('Ayşe Yılmaz');
  await form.locator('[name="city"]').fill('Antalya');
  await form.locator('[name="email"]').fill('ayse@example.com');
  await form.locator('[name="phone"]').fill('+90 532 000 00 00');
  await form.locator('[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  const alert = form.getByRole('alert');
  await expect(alert).toBeVisible();
  await expect(alert.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
  expect(new URL(page.url()).pathname).toBe('/ortak-olun');
  // The echoed values survived: the visitor does not retype.
  await expect(form.locator('[name="company"]')).toHaveValue('Akdeniz İK');
});
```

`e2e/routes.ts` — append the two rows to `GATE_ROUTE_TABLE` (see Step 3). The route-driven page-contract loop in `e2e/routing.spec.ts` and the canonical/hreflang/sitemap cases in `e2e/seo.spec.ts` pick the route up from there — no edit to those files.

- [ ] **Step 2: Run to verify it fails**

`npx vitest run src/lib/seo/unbuilt.test.ts` is green before the page exists (the set and the filesystem agree). Build and start, then run the spec:

```
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/partner.spec.ts --project=desktop; kill $(cat /tmp/next.pid)
```
Every case fails: `/ortak-olun` answers 404 through the `[...rest]` catch-all (`expect(res?.status()).toBe(200)` → 404).

- [ ] **Step 3: Implement**

`src/lib/seo/routes.ts` — in `UNBUILT_PATHNAMES` (Task 4's `new Set<keyof typeof pathnames>([...])` literal, initial 19 entries), delete the line `'/partner-with-us',`. Nothing else in the file changes.

`e2e/routes.ts` — in `GATE_ROUTE_TABLE`, after `{ path: '/en/hire-workers', indexable: true },` (or after the last page's rows if T1–T4 appended theirs) add:

```ts
  { path: '/ortak-olun', indexable: true },
  { path: '/en/partner-with-us', indexable: true },
```

`src/app/[locale]/(site)/partner-with-us/_components/Tick.tsx` (server, no directive — the design's green check glyph, decorative):

```tsx
export function Tick({ className = 'text-success' }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`mt-1 shrink-0 ${className}`}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/NetworkCard.tsx` — the hero's "Our network today" card; rows render only for a signed metric (W1):

```tsx
import { getMetric, type MetricKey } from '@/content/collections';
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { NETWORK_IDS, NETWORK_ROWS } from '../_lib/content';

/** The metric as the design prints it: `470+`, `13`, or the range text (D17/D18). */
function figure(bundle: Bundle, key: MetricKey, locale: Locale): string | null {
  const m = getMetric(bundle, key);
  if (m.text) return m.text;
  if (m.value === null) return null;
  return `${formatInt(m.value, locale)}${m.suffix}`;
}

export function NetworkCard({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const rows = NETWORK_ROWS.flatMap((row) => {
    if (row.metric === null) return []; // unsigned in Phase A (W1) — the ids are never read
    const value = figure(bundle, row.metric, locale);
    return value === null ? [] : [{ ...row, value }];
  });
  return (
    <div
      data-testid="partner-network"
      className="rounded-hero border border-white/10 bg-white p-7 text-ink shadow-hero-form md:p-8"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="m-0 text-card-title font-extrabold">{tf(NETWORK_IDS.heading)}</h2>
        <span className="inline-flex items-center gap-2 text-eyebrow font-extrabold tracking-[0.8px] text-success-text uppercase">
          <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
          {tf(NETWORK_IDS.live)}
        </span>
      </div>
      {rows.length > 0 && (
        <ul className="m-0 list-none p-0">
          {rows.map((row) => (
            <li
              key={row.metric}
              className="flex items-baseline gap-4 border-t border-border-4 py-4 last:border-b"
            >
              <span className={`min-w-[74px] text-stat font-extrabold tracking-[-0.5px] ${row.tone}`}>
                {row.value}
              </span>
              <span className="text-body-sm text-text-secondary">
                {/* W10: the design's desktop/mobile label pair, both in the DOM */}
                <span className="hidden sm:inline">{tf(row.deskId)}</span>
                <span className="sm:hidden">{tf(row.mobId)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 mb-0 text-body-sm text-text-tertiary">{tf(NETWORK_IDS.footnote)}</p>
    </div>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/HeroSection.tsx`:

```tsx
import { makeT, makeTf } from '@/content/pure';
import { Breadcrumbs, ContactCta } from '@/design/blocks';
import { WhatsAppIcon } from '@/design/chrome/icons';
import { Button, Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { HERO_IDS } from '../_lib/content';
import { NetworkCard } from './NetworkCard';
import { Tick } from './Tick';

/** The design's full-bleed photo hero renders as a gradient (§10 #4: photography only on the
 *  Homepage and Hire Workers), so the h1 is the LCP element (D26) — no `pw-hero` placeholder. */
export function HeroSection({
  bundle,
  locale,
  whatsappPrefill,
}: {
  bundle: Bundle;
  locale: Locale;
  whatsappPrefill: string;
}) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  return (
    <Section tone="dark" className="relative overflow-hidden bg-linear-to-br from-navy to-[#0a1428]">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-4"
            items={[
              { name: t(HERO_IDS.crumbHome), href: '/' },
              { name: t(HERO_IDS.crumbSelf), href: '/partner-with-us' },
            ]}
          />
          <h1
            data-testid="page-h1"
            data-lcp-slot="h1"
            className="text-h1 mb-4 leading-[1.02] tracking-[-0.03em] text-white"
          >
            {tf(HERO_IDS.h1)}
          </h1>
          <p className="text-body-lg mb-7 max-w-[560px] text-white/80">
            <span className="hidden sm:inline">{tf(HERO_IDS.leadDesk)}</span>
            <span className="sm:hidden">{tf(HERO_IDS.leadMob)}</span>
          </p>
          <ul className="m-0 mb-7 flex max-w-[580px] list-none flex-wrap gap-x-8 gap-y-3 p-0">
            <li className="flex items-start gap-2 text-body-sm text-white/80">
              <Tick className="text-[#4ade80]" />
              <span>
                <strong className="text-white">{tf(HERO_IDS.tick1Lead)}</strong> {tf(HERO_IDS.tick1Tail)}
              </span>
            </li>
            <li className="flex items-start gap-2 text-body-sm text-white/80">
              <Tick className="text-[#4ade80]" />
              <span>
                <strong className="text-white">{tf(HERO_IDS.tick2Lead)}</strong> {tf(HERO_IDS.tick2Tail)}
              </span>
            </li>
          </ul>
          <div className="mb-6 flex flex-wrap gap-3">
            <Button variant="primary" size="lg" href="#tracks">
              {tf(HERO_IDS.ctaTracks)}
            </Button>
            <ContactCta
              placement="page_cta"
              variant="inverse"
              size="lg"
              external
              href={waLink(settings.whatsappNumber, whatsappPrefill)}
            >
              <WhatsAppIcon size={16} />
              {tf(HERO_IDS.ctaWhatsApp)}
            </ContactCta>
          </div>
          <p className="m-0 text-body-sm text-white/80">
            {tf(HERO_IDS.speakLead)} <strong className="text-white">{tf(HERO_IDS.speakTail)}</strong>
          </p>
        </div>
        <NetworkCard bundle={bundle} locale={locale} />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/PartnerLogos.tsx`:

```tsx
import { LogoMarquee, type Logo } from '@/design/blocks';
import { Section } from '@/design/primitives';

/** Hidden by data (W6): no consented logos in Phase A (§10 #11). The design's "25+ partner
 *  companies" caption (partner.045) is an unsigned metric and stays hidden with the strip (W1). */
export function PartnerLogos({ logos }: { logos: readonly Logo[] }) {
  if (logos.length === 0) return null;
  return (
    <Section tone="band" className="border-b border-border-3">
      <div className="container-site" data-testid="partner-logos">
        <LogoMarquee logos={[...logos]} />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/ChainSection.tsx`:

```tsx
import { makeT, makeTf } from '@/content/pure';
import { Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CHAIN_IDS } from '../_lib/content';

const NODE = {
  supply: { card: 'border border-tint-border bg-pale-1 text-ink', eyebrow: 'text-blue-safe', body: 'text-text-secondary' },
  core: {
    card: 'bg-linear-to-br from-blue to-blue-safe text-white shadow-[0_18px_40px_rgba(24,153,213,0.28)]',
    eyebrow: 'text-white/85',
    body: 'text-white/85',
  },
  demand: { card: 'border border-tint-border bg-pale-1 text-ink', eyebrow: 'text-success-text', body: 'text-text-secondary' },
} as const;

/** Supply → Recruitment → Demand. The intro is the one sentence the package splits around the
 *  Hire Workers link (partner.048 + partner.002 + partner.049), so composing it is allowed (W23);
 *  the design's old-site href becomes the typed route. */
export function ChainSection({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="light" className="border-b border-border-3">
      <div className="container-site" data-testid="partner-chain">
        <h2 className="text-h2 mb-3 text-center">{tf(CHAIN_IDS.heading)}</h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body text-text-tertiary">
          {tf(CHAIN_IDS.introLead)}{' '}
          <Link href="/hire-workers" className="font-bold text-blue-safe">
            {t(CHAIN_IDS.introLink)}
          </Link>{' '}
          {tf(CHAIN_IDS.introTail)}
        </p>
        <div className="mx-auto grid max-w-[1080px] gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          {CHAIN_IDS.nodes.map((node, i) => {
            const c = NODE[node.tone];
            return (
              <div key={node.eyebrow} className="contents">
                {i > 0 && (
                  <span aria-hidden="true" className="hidden text-[24px] font-extrabold text-tint-border md:block">
                    →
                  </span>
                )}
                <div className={`rounded-md px-6 py-6 text-center ${c.card}`}>
                  <p className={`mb-2 text-eyebrow font-extrabold tracking-[1.2px] uppercase ${c.eyebrow}`}>
                    {tf(node.eyebrow)}
                  </p>
                  <p className="mb-1 text-card-title font-extrabold">{tf(node.title)}</p>
                  <p className={`m-0 text-body-sm ${c.body}`}>{tf(node.body)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/PortalSection.tsx`:

```tsx
import { makeT, makeTf } from '@/content/pure';
import { ImageSlot, StoreBadges } from '@/design/blocks';
import { Eyebrow, Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PORTAL_IDS } from '../_lib/content';
import { Tick } from './Tick';

/** The partner-portal showcase. `partner.159` is re-authored to `{placed}` (W1) and resolves
 *  through makeTf; the store badges come from settings (Android only, W8; micro-copy from
 *  hire.240/241 through StoreBadges, never partner.162/163 — W7). The two screenshots are named
 *  placeholders until the owner supplies them (W55) — never the LCP element. */
export function PortalSection({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  return (
    <Section tone="light" className="pb-0">
      <div className="container-site">
        <div
          data-testid="partner-portal"
          className="grid items-center gap-10 rounded-hero border border-border-1 bg-linear-to-b from-pale-1 to-tint p-6 md:p-14 lg:grid-cols-[1fr_1.05fr] lg:gap-14"
        >
          <div>
            <Eyebrow>{tf(PORTAL_IDS.eyebrow)}</Eyebrow>
            <h2 className="text-h2 mt-3 mb-3">{tf(PORTAL_IDS.heading)}</h2>
            <p className="mb-6 text-body text-text-secondary">{tf(PORTAL_IDS.lead)}</p>
            <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
              {PORTAL_IDS.features.map(([lead, tail]) => (
                <li key={lead} className="flex items-start gap-3 text-body-sm text-text-secondary">
                  <Tick />
                  <span>
                    <strong className="text-ink">{tf(lead)}</strong> {tf(tail)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mb-6 flex items-start gap-2 text-body-sm text-text-secondary">
              <Tick className="text-blue-safe" />
              <span>
                <strong className="text-ink">{tf(PORTAL_IDS.claimLead)}</strong> {tf(PORTAL_IDS.claimTail)}
              </span>
            </p>
            <p className="mb-3 text-body-sm font-bold text-text-tertiary">{tf(PORTAL_IDS.mobileLine)}</p>
            <StoreBadges
              bundle={bundle}
              locale={locale}
              android={settings.storeLinks.android}
              ios={settings.storeLinks.ios}
            />
          </div>
          <div className="relative pb-6">
            <div className="overflow-hidden rounded-base border border-border-1 bg-white shadow-[0_26px_60px_rgba(22,60,90,0.16)] md:mr-[70px]">
              <div
                aria-hidden="true"
                className="flex items-center gap-1.5 border-b border-border-4 bg-[#f0f6fa] px-3.5 py-2.5"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="ml-2 flex-1 rounded-[6px] border border-border-4 bg-white px-2.5 py-1 text-[11.5px] text-text-tertiary">
                  {t(PORTAL_IDS.addressBar)}
                </span>
              </div>
              <ImageSlot
                slot="partner-portal-screen"
                alt={t(PORTAL_IDS.screenAlt)}
                width={720}
                height={340}
                className="w-full"
              />
            </div>
            {/* W10: the phone mock is hidden below md by CSS, not by conditional rendering */}
            <div className="absolute right-0 bottom-0 hidden w-[150px] rounded-[24px] bg-[#0f2438] p-[7px] shadow-[0_26px_56px_rgba(15,36,56,0.35)] md:block">
              <ImageSlot
                slot="partner-portal-mobile"
                alt={t(PORTAL_IDS.mobileAlt)}
                width={136}
                height={274}
                className="rounded-[17px]"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/page.tsx` — Cycle 2 version (the tracks section is a placeholder `Section` with `id="tracks"` and the three test ids until Cycle 4 replaces it; the `TODO` is removed in Cycle 4):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { getBundle, makeT, makeTf } from '@/content/adapter';
import { ClosingCtaBand, FaqBlock, ProcessSteps } from '@/design/blocks';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { Section } from '@/design/primitives';
import { routing } from '@/i18n/routing';
import { mailLink, telLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { ChainSection } from './_components/ChainSection';
import { HeroSection } from './_components/HeroSection';
import { PartnerLogos } from './_components/PartnerLogos';
import { PortalSection } from './_components/PortalSection';
import { CLOSING_IDS, FAQ_IDS, PROCESS_IDS, SEO_IDS, STICKY_IDS } from './_lib/content';
import { PARTNER_LOGOS } from './_lib/logos';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  // The package ships this page's SEO pair (partner.222/223) and T0b's page record names them;
  // the fallbacks repeat the same ids so the call is honest if the record ever loses them.
  return buildMetadata({
    locale,
    href: '/partner-with-us',
    bundle,
    pageKey: 'partner',
    fallbackTitle: t(SEO_IDS.title),
    fallbackDescription: t(SEO_IDS.description),
  });
}

export default async function PartnerWithUs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;

  return (
    <>
      <HeroSection bundle={bundle} locale={locale} whatsappPrefill={sys('partner.whatsapp.prefill')} />
      <PartnerLogos logos={PARTNER_LOGOS} />
      <ChainSection bundle={bundle} locale={locale} />

      {/* The design's sticky bar: shown after 700 px, hidden while #tracks is near (W18). Only the
          anchor CTA rides here — see the task's Foundation gaps for the Call/WhatsApp pair. */}
      <StickyCtaBar
        message={tf(STICKY_IDS.message)}
        ctas={[{ label: tf(STICKY_IDS.cta), href: '#tracks' }]}
        hideNearId="tracks"
        live
      />

      {/* TODO(T5 c4): TracksSection replaces this placeholder */}
      <Section tone="light" id="tracks" className="scroll-mt-20">
        <div className="container-site" data-testid="partner-tracks">
          <div data-testid="partner-track-detail" />
        </div>
      </Section>

      <Section tone="pale">
        <div className="container-site" data-testid="partner-process">
          <h2 className="text-h2 mb-3 text-center">{tf(PROCESS_IDS.heading)}</h2>
          <p className="mx-auto mb-11 max-w-[560px] text-center text-body text-text-tertiary">
            {tf(PROCESS_IDS.intro)}
          </p>
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            id="how-it-starts"
            variant="cards"
            steps={PROCESS_IDS.steps.map((s) => ({
              n: s.n,
              titleId: s.titleId,
              bodyId: s.bodyId,
              when: 'whenId' in s ? tf(s.whenId) : undefined,
            }))}
          />
        </div>
      </Section>

      <PortalSection bundle={bundle} locale={locale} />

      <Section tone="light">
        <div className="container-site" data-testid="partner-faq">
          <FaqBlock
            bundle={bundle}
            locale={locale}
            id="faq"
            eyebrowId={FAQ_IDS.eyebrow}
            headingId={FAQ_IDS.heading}
            bodyId={FAQ_IDS.lead}
            openFirst
            items={FAQ_IDS.pairs.map(([q, a]) => ({ id: q, q: tf(q), a: tf(a) }))}
            askCard={{
              titleId: FAQ_IDS.askTitle,
              bodyId: FAQ_IDS.askBody,
              whatsappNumber: settings.whatsappNumber,
              whatsappText: sys('partner.faq.whatsappText'),
              whatsappLabelId: FAQ_IDS.askWhatsApp,
              phone: settings.phone,
              callLabelId: FAQ_IDS.askCall,
            }}
            footer={
              <p className="mt-6 mb-0 text-body-sm text-text-secondary">
                {sys('partner.faq.email')}:{' '}
                <ContactLink
                  href={mailLink(settings.email, sys('partner.faq.emailSubject'))}
                  placement="page_cta"
                  className="font-bold text-blue-safe"
                >
                  {settings.email}
                </ContactLink>
              </p>
            }
          />
        </div>
      </Section>

      <Section tone="light" className="pt-0">
        <div className="container-site" data-testid="partner-closing">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            id="closing"
            tone="gradient"
            titleId={CLOSING_IDS.heading}
            bodyId={CLOSING_IDS.body}
            primary={{ label: tf(CLOSING_IDS.primary), href: '#tracks' }}
            secondary={{ label: settings.phoneDisplay, href: telLink(settings.phone) }}
            ticks={[tf(CLOSING_IDS.badge)]}
          />
          <p className="mt-6 mb-0 text-center text-body-sm text-text-tertiary">
            {tf(CLOSING_IDS.legal)}{' '}
            <ContactLink href={mailLink(settings.email)} placement="page_cta" className="font-bold text-blue-safe">
              {settings.email}
            </ContactLink>
          </p>
        </div>
      </Section>
    </>
  );
}
```

Notes for the implementer:
- No `<main>`: `(site)/layout.tsx`'s `SiteChrome` owns `<main id="main">` (R31).
- `makeTf`, not `makeT`, for every visible string: partner.078/087/140/159/186 carry `{metric}` tokens (D17). `makeT` only for ids passed as `name`/`alt`/link labels that the importer never re-authors (breadcrumb, partner.002, the portal alt texts) — `tf` would be equally correct there; the split just documents which ids are plain.
- `ProcessSteps.when` is a resolved string: step 4's "Full access" pill is `tf('partner.146')`.
- Every `tel:`/`mailto:`/`wa.me` anchor on this page goes through a tracked component (`ContactCta`, `ContactLink`, the `FaqBlock` ask card, the `ClosingCtaBand` CTAs) with `placement: 'page_cta'` (W12).
- `Section tone="light" className="pb-0"` / `"pt-0"` collapse the design's tighter portal→FAQ→closing spacing; Tailwind's later utility wins over `py-16`.

- [ ] **Step 4: Run tests + `npm run verify`**

```
npx prettier --write "src/app/[locale]/(site)/partner-with-us" e2e/pages/partner.spec.ts e2e/routes.ts src/lib/seo/routes.ts
npm run verify        # green: unbuilt.test.ts agrees again (key deleted ↔ page.tsx exists), gate-routes.test.ts sees 7 rows
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/partner.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts --project=desktop; kill $(cat /tmp/next.pid)
```
Expected: in `partner.spec.ts` the two page-contract cases, the metadata case and the language-link case pass (the placeholder tracks section satisfies the section ids; `partner-form-hr` is NOT mounted yet, so `toBeVisible` fails — expected red until Cycle 4); the four track/form cases fail (no `label[for="track-sourcing"]`). `routing.spec.ts`'s page-contract loop and `seo.spec.ts`'s canonical/hreflang/sitemap/200-sweep cases pass for `/ortak-olun` and `/en/partner-with-us`.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us" e2e/pages/partner.spec.ts e2e/routes.ts src/lib/seo/routes.ts
git commit -m "feat(partner): page skeleton — metadata, hero + network card, chain, process, portal, FAQ, closing, sticky bar; route wired (T5 c2)

/partner-with-us leaves UNBUILT_PATHNAMES (W20); both locale paths join GATE_ROUTE_TABLE (W21);
h1 is the LCP element (no hero photo, §10 #4); logos hidden by data (W6); signed metrics only (W1).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — the three forms: server actions, form cards, the licence declaration checkbox

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/partner-with-us/_components/__tests__/DeclarationCheckbox.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormErrorsContext } from '@/forms/client/FormErrorsContext';
import { renderWithIntl } from '@/test/render';
import { DECLARATION_FIELD } from '../../_lib/forms';
import { DeclarationCheckbox } from '../DeclarationCheckbox';

const label = 'Geçerli bir lisansa sahip olduğumuzu ve adaylardan asla ücret almadığımızı beyan ederiz.';

describe('DeclarationCheckbox', () => {
  it('is a required checkbox named after the schema field, labelled with the package sentence', () => {
    renderWithIntl(<DeclarationCheckbox name={DECLARATION_FIELD} label={label} />);
    const box = screen.getByRole('checkbox', { name: label });
    expect(box).toHaveAttribute('name', 'licenceDeclaration');
    expect(box).toBeRequired();
    expect(box).not.toBeChecked();
    expect(box).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows the action's field error as an alert and marks the box invalid', () => {
    renderWithIntl(
      <FormErrorsContext.Provider value={{ errors: { [DECLARATION_FIELD]: 'Zorunlu alan' }, values: {} }}>
        <DeclarationCheckbox name={DECLARATION_FIELD} label={label} />
      </FormErrorsContext.Provider>,
    );
    const box = screen.getByRole('checkbox', { name: label });
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAttribute('aria-describedby', 'f-licenceDeclaration-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Zorunlu alan');
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'f-licenceDeclaration-error');
  });

  it('stays ticked after a failed submit on another field (the echoed value)', () => {
    renderWithIntl(
      <FormErrorsContext.Provider value={{ errors: { email: 'x' }, values: { [DECLARATION_FIELD]: 'on' } }}>
        <DeclarationCheckbox name={DECLARATION_FIELD} label={label} />
      </FormErrorsContext.Provider>,
    );
    expect(screen.getByRole('checkbox', { name: label })).toBeChecked();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/partner-with-us/_components"` → `Failed to resolve import "../DeclarationCheckbox"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/_components/DeclarationCheckbox.tsx` — the same markup as the kernel's consent row (`FormShell`'s `ConsentRow`), wired to the same context so the action's `required` code renders as the translated `sys.form.errors.required`:

```tsx
'use client';
import { useFieldError, useFieldValue } from '@/forms/client/FormErrorsContext';

/** A second required checkbox beside the kernel consent — the sourcing form's licence/no-fee
 *  declaration (partner.114, legal). Validated by the page schema (`z.literal('on')`), echoed
 *  after a failed submit, error text through `useFieldError` (already translated). */
export function DeclarationCheckbox({
  name,
  label,
  id = `f-${name}`,
}: {
  name: string;
  label: string;
  id?: string;
}) {
  const error = useFieldError(name);
  const ticked = useFieldValue(name) === 'on';
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-body-sm">
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          defaultChecked={ticked}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-blue-safe"
        />
        <span>{label}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="m-0 text-danger text-body-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/actions.ts` — the `'use server'` wrappers (a `'use server'` module may export only async functions; `createFormAction` is `server-only`):

```ts
'use server';
import { createFormAction, type FormActionState } from '@/forms/action';
import {
  hrAgencySchema,
  hrAgencyToFields,
  instituteSchema,
  instituteToFields,
  sourcingSchema,
  sourcingToFields,
} from './_lib/forms';

// The redirect keys are typed FormKey by createFormAction's spec (R55): 'hire' → the HR-agency
// thank-you line, 'partner' → the partnership line — both exist in sys.thankYou.forms.
const runHrAgency = createFormAction({ key: 'hire', schema: hrAgencySchema, toFields: hrAgencyToFields });
const runSourcing = createFormAction({ key: 'partner', schema: sourcingSchema, toFields: sourcingToFields });
const runInstitute = createFormAction({ key: 'partner', schema: instituteSchema, toFields: instituteToFields });

export async function submitHrAgency(prev: FormActionState, data: FormData) {
  return runHrAgency(prev, data);
}
export async function submitSourcingPartner(prev: FormActionState, data: FormData) {
  return runSourcing(prev, data);
}
export async function submitInstitute(prev: FormActionState, data: FormData) {
  return runInstitute(prev, data);
}
```

`src/app/[locale]/(site)/partner-with-us/_components/FormCard.tsx` — the design's form card with its gradient header (server):

```tsx
import type { ReactNode } from 'react';
import type { TrackKey } from '../_lib/forms';

const HEADER: Record<TrackKey, string> = {
  hr: 'bg-linear-to-br from-blue to-blue-safe',
  sourcing: 'bg-linear-to-br from-success to-success-text',
  institute: 'bg-[#35468a]',
};

/** `id` is the mobile jump-link target (`#apply-hr` …): FormShell has no `id` prop, so the card
 *  carries the anchor. */
export function FormCard({
  id,
  track,
  title,
  sla,
  children,
}: {
  id: string;
  track: TrackKey;
  title: string;
  sla: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-lg border border-border-1 bg-white shadow-[0_24px_60px_rgba(22,60,90,0.14)]"
    >
      <div className={`px-7 py-5 text-white ${HEADER[track]}`}>
        <h3 className="m-0 text-card-title font-extrabold">{title}</h3>
        <p className="m-0 mt-1 text-body-sm text-white/85">{sla}</p>
      </div>
      <div className="px-6 py-6 md:px-7">{children}</div>
    </div>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/HrAgencyForm.tsx` (server; the `FormShell` island and its `Field`s are the kernel's):

```tsx
import { makeTf } from '@/content/pure';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PANEL_IDS } from '../_lib/content';
import { submitHrAgency } from '../actions';
import { FormCard } from './FormCard';

/** → `hire` with `iAm: 'hr_agency'` and `country: 'TR'` (W3). Visible labels are the design's
 *  placeholders (partner.093–098); the placeholders themselves are the kernel's `sys.form.*`. */
export function HrAgencyForm({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  const f = PANEL_IDS.hr.fields;
  return (
    <FormCard id="apply-hr" track="hr" title={tf(PANEL_IDS.hr.formTitle)} sla={tf(PANEL_IDS.sla)}>
      <FormShell
        action={submitHrAgency}
        formKey="hire"
        locale={locale}
        turnstileSiteKey={settings.turnstileSiteKey}
        whatsappNumber={settings.whatsappNumber}
        contact={{ phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email }}
        submitLabel={tf(PANEL_IDS.submit)}
        testId="partner-form-hr"
      >
        <Field name="company" label={tf(f.company)} required autoComplete="organization" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label={tf(f.name)} required autoComplete="name" />
          <Field name="city" label={tf(f.city)} required autoComplete="address-level2" />
        </div>
        <Field name="email" type="email" label={tf(f.email)} required autoComplete="email" inputMode="email" />
        <Field name="phone" type="tel" label={tf(f.phone)} required autoComplete="tel" inputMode="tel" />
        <Field name="message" as="textarea" rows={3} label={tf(f.message)} />
      </FormShell>
    </FormCard>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/SourcingPartnerForm.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PANEL_IDS } from '../_lib/content';
import type { CountryOption } from '../_lib/country-options';
import { DECLARATION_FIELD } from '../_lib/forms';
import { submitSourcingPartner } from '../actions';
import { DeclarationCheckbox } from './DeclarationCheckbox';
import { FormCard } from './FormCard';

/** → `partner` with `track: 'sourcing'` (W16). The ISO-2 country select (W3/W25), the licence
 *  number (catalog `licence`), `candidatesPerYear` (catalog, ≤20) beside the free-text `trades`
 *  (≤500), and the licence declaration as its own required checkbox before the kernel consent. */
export function SourcingPartnerForm({
  bundle,
  locale,
  countries,
}: {
  bundle: Bundle;
  locale: Locale;
  countries: CountryOption[];
}) {
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  const f = PANEL_IDS.sourcing.fields;
  return (
    <FormCard id="apply-sourcing" track="sourcing" title={tf(PANEL_IDS.sourcing.formTitle)} sla={tf(PANEL_IDS.sla)}>
      <FormShell
        action={submitSourcingPartner}
        formKey="partner"
        locale={locale}
        turnstileSiteKey={settings.turnstileSiteKey}
        whatsappNumber={settings.whatsappNumber}
        contact={{ phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email }}
        submitLabel={tf(PANEL_IDS.submit)}
        testId="partner-form-sourcing"
      >
        <Field name="company" label={tf(f.company)} required autoComplete="organization" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label={tf(f.name)} required autoComplete="name" />
          <Field name="country" as="select" label={tf(f.country)} required options={countries} autoComplete="country" />
        </div>
        <Field name="licence" label={tf(f.licence)} required autoComplete="off" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="email" type="email" label={tf(f.email)} required autoComplete="email" inputMode="email" />
          <Field name="phone" type="tel" label={tf(f.phone)} required autoComplete="tel" inputMode="tel" />
        </div>
        <Field name="candidatesPerYear" inputMode="numeric" />
        <Field name="trades" as="textarea" rows={3} label={tf(f.trades)} />
        <DeclarationCheckbox name={DECLARATION_FIELD} label={tf(PANEL_IDS.sourcing.declaration)} />
      </FormShell>
    </FormCard>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/InstituteForm.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PANEL_IDS } from '../_lib/content';
import type { CountryOption } from '../_lib/country-options';
import { submitInstitute } from '../actions';
import { FormCard } from './FormCard';

/** → `partner` with `track: 'institute'` (W16). The design's one "City, country" box becomes
 *  `city` (catalog v1.1, optional) + the ISO-2 `country` select (required at the door). */
export function InstituteForm({
  bundle,
  locale,
  countries,
}: {
  bundle: Bundle;
  locale: Locale;
  countries: CountryOption[];
}) {
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  const f = PANEL_IDS.institute.fields;
  return (
    <FormCard id="apply-institute" track="institute" title={tf(PANEL_IDS.institute.formTitle)} sla={tf(PANEL_IDS.sla)}>
      <FormShell
        action={submitInstitute}
        formKey="partner"
        locale={locale}
        turnstileSiteKey={settings.turnstileSiteKey}
        whatsappNumber={settings.whatsappNumber}
        contact={{ phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email }}
        submitLabel={tf(PANEL_IDS.submit)}
        testId="partner-form-institute"
      >
        <Field name="company" label={tf(f.company)} required autoComplete="organization" />
        <Field name="name" label={tf(f.name)} required autoComplete="name" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="city" autoComplete="address-level2" />
          <Field name="country" as="select" label={tf(f.country)} required options={countries} autoComplete="country" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="email" type="email" label={tf(f.email)} required autoComplete="email" inputMode="email" />
          <Field name="phone" type="tel" label={tf(f.phone)} required autoComplete="tel" inputMode="tel" />
        </div>
        <Field name="candidatesPerYear" inputMode="numeric" />
        <Field name="trades" as="textarea" rows={3} label={tf(f.trades)} />
      </FormShell>
    </FormCard>
  );
}
```

Notes for the implementer:
- `Field name="candidatesPerYear"` and the institute's `Field name="city"` take their labels/placeholders from the kernel (`sys.form.labels.candidatesPerYear`, `sys.form.labels.city` — W30 covers every catalog name); non-required fields get `sys.form.hints.optional` automatically.
- The consent row and its `/privacy` link are the shell's (`consentLinkHref` left at its default): partner.090/091 are not read (delta 2).
- One panel is mounted at a time (Cycle 4), so the kernel's fixed ids (`f-consent`, `f-honeypot-partner`, `f-<name>`) never collide.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/partner-with-us"` · `npx vitest run "src/app/\[locale\]/(site)/partner-with-us"` → 4 files passed (DeclarationCheckbox 3). `npm run verify` → green (the form components are not mounted yet; `tsc` proves the `FormShell`/`Field`/`createFormAction` prop shapes).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us"
git commit -m "feat(partner): the three track forms — hire (HR agency) and partner ×2 server actions, form cards, licence declaration checkbox (T5 c3)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — the track chooser island + track panels; the tracks section replaces the placeholder

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/partner-with-us/_components/__tests__/TrackChooser.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { TrackChooser, trackFromHash, type TrackCard } from '../TrackChooser';

vi.mock('next/navigation', () => ({ usePathname: () => '/ortak-olun' }));

const cards: TrackCard[] = [
  { key: 'hr', title: 'Türkiye’deki İK ajansları', body: 'Müşteriniz sizde kalır.', cta: 'Nasıl işlediğini görün →' },
  { key: 'sourcing', title: 'Yurt dışındaki tedarik ortakları', body: 'Adaylarınızı bize gönderin.', cta: 'Nasıl işlediğini görün →' },
  { key: 'institute', title: 'Eğitim kurumları', body: 'Mezunlarınız yerleşsin.', cta: 'Nasıl işlediğini görün →' },
];
const panels = {
  hr: <div data-testid="panel-hr" />,
  sourcing: <div data-testid="panel-sourcing" />,
  institute: <div data-testid="panel-institute" />,
};
const base = {
  legend: 'Ortaklık türünüzü seçin',
  wayfinderChoose: 'Hangisi sizi tanımlıyor?',
  wayfinderApply: 'Başvurunuz',
  cards,
  panels,
};
const layer = () => (window as Window & { dataLayer?: unknown[] }).dataLayer ?? [];

beforeEach(() => {
  (window as Window & { dataLayer?: unknown[] }).dataLayer = [];
  window.history.replaceState(null, '', '/ortak-olun');
});

describe('TrackChooser', () => {
  it('is a labelled radiogroup of three native radios with the HR track and panel selected by default', () => {
    renderWithIntl(<TrackChooser {...base} />);
    const group = screen.getByRole('radiogroup', { name: base.legend });
    expect(group.querySelectorAll('input[type="radio"][name="track"]')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: /İK ajansları/ })).toBeChecked();
    expect(screen.getByTestId('panel-hr')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-sourcing')).toBeNull();
    expect(screen.getByTestId('partner-track-detail')).toHaveAttribute('data-track', 'hr');
    expect(layer()).toEqual([]);
  });

  it('selecting sourcing shows only its panel, fires partner_track_select with the enum value and writes the hash', async () => {
    renderWithIntl(<TrackChooser {...base} />);
    await userEvent.click(screen.getByRole('radio', { name: /tedarik ortakları/ }));
    expect(screen.getByTestId('panel-sourcing')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-hr')).toBeNull();
    expect(layer()).toEqual([
      { event: 'partner_track_select', page: '/ortak-olun', locale: 'tr', track: 'sourcing' },
    ]);
    expect(window.location.hash).toBe('#track-sourcing');
  });

  it('selecting the HR track fires nothing — it is the default, not a signal (W67)', async () => {
    renderWithIntl(<TrackChooser {...base} />);
    await userEvent.click(screen.getByRole('radio', { name: /Eğitim kurumları/ }));
    await userEvent.click(screen.getByRole('radio', { name: /İK ajansları/ }));
    expect(layer().map((e) => (e as { track?: string }).track)).toEqual(['institute']);
    expect(screen.getByTestId('panel-hr')).toBeInTheDocument();
    expect(window.location.hash).toBe('#track-hr');
  });

  it('a #track-institute deep link selects the institute on load, without an event', () => {
    window.history.replaceState(null, '', '/ortak-olun#track-institute');
    renderWithIntl(<TrackChooser {...base} />);
    expect(screen.getByRole('radio', { name: /Eğitim kurumları/ })).toBeChecked();
    expect(screen.getByTestId('panel-institute')).toBeInTheDocument();
    expect(layer()).toEqual([]);
  });

  it('trackFromHash accepts only the three keys', () => {
    expect(trackFromHash('#track-hr')).toBe('hr');
    expect(trackFromHash('#track-sourcing')).toBe('sourcing');
    expect(trackFromHash('#track-institute')).toBe('institute');
    expect(trackFromHash('#tracks')).toBeNull();
    expect(trackFromHash('#track-admin')).toBeNull();
    expect(trackFromHash('')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/partner-with-us/_components/__tests__/TrackChooser.test.tsx"` → `Failed to resolve import "../TrackChooser"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/_components/TrackChooser.tsx` — the one page-local client island. Native radios (the pattern `RadioChips` ships) styled as the design's rich cards — `RadioChipOption` is `{ value, label }`, which cannot carry an icon, a body and a CTA line, so the island renders its own cards on the same a11y pattern. State: `chosen` (the visitor's click) → the URL hash on load (deep link) → `'hr'`. The hash is read through `useSyncExternalStore` with a `null` server snapshot, so the server and the hydrating client both render the HR panel and no `setState` runs in an effect (React Compiler lint rules of `eslint-config-next` 16):

```tsx
'use client';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useCallback, useId, useState, useSyncExternalStore, type ReactNode } from 'react';
import { track } from '@/analytics/track';
import { PARTNER_TRACKS, TRACK_KEYS, type TrackKey } from '../_lib/forms';

export type TrackCard = { key: TrackKey; title: string; body: string; cta: string };

const ACCENT: Record<TrackKey, { icon: string; cta: string; selected: string }> = {
  hr: { icon: 'bg-tint text-blue', cta: 'text-blue-safe', selected: 'border-blue ring-4 ring-tint' },
  sourcing: {
    icon: 'bg-success-surface text-success',
    cta: 'text-success-text',
    selected: 'border-success ring-4 ring-success-surface',
  },
  institute: {
    icon: 'bg-[#edf1f9] text-[#35468a]',
    cta: 'text-[#35468a]',
    selected: 'border-[#35468a] ring-4 ring-[#edf1f9]',
  },
};

const ICON: Record<TrackKey, ReactNode> = {
  hr: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V8l6-4 6 4v13" />
      <path d="M15 21V11l6 4v6" />
      <path d="M7 12h2" />
      <path d="M7 16h2" />
    </svg>
  ),
  sourcing: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19" />
      <path d="M12 2.5a15 15 0 0 1 0 19a15 15 0 0 1 0-19z" />
    </svg>
  ),
  institute: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L2 8l10 5 10-5-10-5z" />
      <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
    </svg>
  ),
};

const CARD =
  'flex h-full cursor-pointer flex-col rounded-lg border-[1.5px] bg-white p-7 shadow-[0_8px_24px_rgba(22,60,90,0.06)] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-safe';

/** `#track-<key>` → the key; anything else → null. The hash is also the radio's id, so the
 *  browser's own anchor jump lands on the card. */
export function trackFromHash(hash: string): TrackKey | null {
  const m = /^#track-([a-z]+)$/.exec(hash);
  const key = m?.[1];
  return key && (TRACK_KEYS as readonly string[]).includes(key) ? (key as TrackKey) : null;
}

const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};
const getHashTrack = () => trackFromHash(window.location.hash);
const noHashOnServer = () => null;

const isPartnerTrack = (key: TrackKey): key is (typeof PARTNER_TRACKS)[number] =>
  (PARTNER_TRACKS as readonly string[]).includes(key);

/**
 * "Three ways to partner": the chooser (a radiogroup of card radios) and, under `#track-detail`,
 * exactly ONE of the three server-rendered panels — the design's `sc-if`, so the kernel's fixed
 * field ids never collide. `partner_track_select` fires for the two `partner` tracks only (W67:
 * the enum is `sourcing | institute`; the HR card is the default panel, not a signal).
 */
export function TrackChooser({
  legend,
  wayfinderChoose,
  wayfinderApply,
  cards,
  panels,
}: {
  legend: string;
  wayfinderChoose: string;
  wayfinderApply: string;
  cards: TrackCard[];
  panels: Record<TrackKey, ReactNode>;
}) {
  const legendId = useId();
  const locale = useLocale();
  const pathname = usePathname(); // next/navigation: the real URL (R35)
  const hashTrack = useSyncExternalStore(subscribeHash, getHashTrack, noHashOnServer);
  const [chosen, setChosen] = useState<TrackKey | null>(null);
  const current: TrackKey = chosen ?? hashTrack ?? 'hr';

  const choose = useCallback(
    (key: TrackKey) => {
      setChosen(key);
      if (isPartnerTrack(key)) track('partner_track_select', { page: pathname ?? '/', locale, track: key });
      window.history.replaceState(null, '', `#track-${key}`);
      document.getElementById('track-detail')?.scrollIntoView?.({ block: 'start' });
    },
    [locale, pathname],
  );

  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-body-sm font-extrabold text-text-tertiary md:hidden">
        <Step n={1} />
        {wayfinderChoose}
      </p>
      <fieldset
        role="radiogroup"
        aria-labelledby={legendId}
        className="m-0 min-w-0 border-0 p-0"
        data-testid="partner-track-chooser"
      >
        <legend id={legendId} className="sr-only">
          {legend}
        </legend>
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const on = card.key === current;
            const accent = ACCENT[card.key];
            return (
              <div key={card.key}>
                <input
                  type="radio"
                  id={`track-${card.key}`}
                  name="track"
                  value={card.key}
                  checked={on}
                  onChange={() => choose(card.key)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`track-${card.key}`}
                  className={`${CARD} ${on ? accent.selected : 'border-border-2 hover:border-tint-border'}`}
                >
                  <span aria-hidden="true" className={`mb-4 flex h-12 w-12 items-center justify-center rounded-sm ${accent.icon}`}>
                    {ICON[card.key]}
                  </span>
                  <span className="block text-card-title font-extrabold">{card.title}</span>
                  <span className="mt-2 block flex-1 text-body-sm text-text-secondary">{card.body}</span>
                  <span className={`mt-4 block text-body-sm font-extrabold ${accent.cta}`}>{card.cta}</span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
      <div id="track-detail" className="mt-10 scroll-mt-24" data-testid="partner-track-detail" data-track={current}>
        <p className="mb-4 flex items-center gap-2 text-body-sm font-extrabold text-text-tertiary md:hidden">
          <Step n={2} />
          {wayfinderApply}
        </p>
        {panels[current]}
      </div>
    </div>
  );
}

/** The design's mobile-only step bubble ("1 Who are you?" / "2 Your application"). */
function Step({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-6 w-6 items-center justify-center rounded-pill bg-blue-safe text-[12px] font-extrabold text-white"
    >
      {n}
    </span>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/TrackPanel.tsx` (server) — the panel body the chooser shows for a track: eyebrow, h2, lead, mobile jump link, four benefit rows, the "What we ask from you" card, and the form card as `children`:

```tsx
import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
import { Eyebrow } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PANEL_IDS } from '../_lib/content';
import type { TrackKey } from '../_lib/forms';

const PANEL: Record<TrackKey, string> = {
  hr: 'border-tint-border bg-linear-to-b from-pale-1 to-[#e8f3f9]',
  sourcing: 'border-success-border bg-linear-to-b from-[#f4fbf6] to-[#e8f6ee]',
  institute: 'border-[#d3d9ec] bg-linear-to-b from-[#f5f6fb] to-[#e9ecf6]',
};

export function TrackPanel({
  bundle,
  locale,
  track,
  formAnchor,
  children,
}: {
  bundle: Bundle;
  locale: Locale;
  track: TrackKey;
  /** the form card's id (`apply-hr` …) — the mobile jump link's target */
  formAnchor: string;
  children: ReactNode;
}) {
  const tf = makeTf(bundle, locale);
  const ids = PANEL_IDS[track];
  return (
    <div
      data-testid={`partner-panel-${track}`}
      className={`grid gap-10 rounded-hero border p-6 md:p-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14 ${PANEL[track]}`}
    >
      <div>
        <Eyebrow>{tf(ids.eyebrow)}</Eyebrow>
        <h2 className="text-h2 mt-3 mb-3">{tf(ids.heading)}</h2>
        <p className="mb-6 text-body text-text-secondary">{tf(ids.lead)}</p>
        {/* W10: the design's mobile-only jump link stays in the DOM, hidden from md */}
        <a href={`#${formAnchor}`} className="mb-6 inline-block font-extrabold text-blue-safe md:hidden">
          {tf(PANEL_IDS.jump)}
        </a>
        <ul className="m-0 mb-7 flex list-none flex-col gap-3.5 p-0">
          {ids.benefits.map(([titleId, bodyId]) => (
            <li key={titleId} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-success text-[12px] font-extrabold text-white"
              >
                ✓
              </span>
              <div>
                <p className="m-0 font-extrabold">{tf(titleId)}</p>
                <p className="m-0 text-body-sm text-text-secondary">{tf(bodyId)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="rounded-base border border-border-1 bg-white px-6 py-5">
          <p className="mb-3 text-eyebrow font-extrabold tracking-[1px] text-text-tertiary uppercase">
            {tf(PANEL_IDS.asksHeading)}
          </p>
          {/* The package's bullets carry their own "· " (partner.083…); no list marker */}
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-body-sm text-text-secondary">
            {ids.asks.map((id) => (
              <li key={id}>{tf(id)}</li>
            ))}
          </ul>
        </div>
      </div>
      {children}
    </div>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/page.tsx` — replace the Cycle 2 placeholder block (from `{/* TODO(T5 c4): TracksSection replaces this placeholder */}` through its closing `</Section>`) with the real section, and add the imports:

New imports (add to the existing import block, keeping alphabetical groups):

```tsx
import { getCollection } from '@/content/collections';
import { HrAgencyForm } from './_components/HrAgencyForm';
import { InstituteForm } from './_components/InstituteForm';
import { SourcingPartnerForm } from './_components/SourcingPartnerForm';
import { TrackChooser } from './_components/TrackChooser';
import { TrackPanel } from './_components/TrackPanel';
import { countryOptions } from './_lib/country-options';
```
and extend the `_lib/content` import to `{ CLOSING_IDS, FAQ_IDS, PROCESS_IDS, SEO_IDS, STICKY_IDS, TRACKS_IDS }`.

In the component body, after `const { settings } = bundle;`:

```tsx
  // W3/W25: the ISO-2 select — 13 source countries first, then the general list by locale name.
  const countries = countryOptions(
    getCollection(bundle, 'sourceCountries'),
    getCollection(bundle, 'countries'),
    locale,
  );
```

The section:

```tsx
      {/* #tracks: the W17 header CTA and the hero/closing/sticky CTAs all land here. */}
      <Section tone="light" id="tracks" className="scroll-mt-20">
        <div className="container-site" data-testid="partner-tracks">
          <h2 className="text-h2 mb-3 text-center">{tf(TRACKS_IDS.heading)}</h2>
          <p className="mx-auto mb-11 max-w-[560px] text-center text-body text-text-tertiary">
            <span className="hidden sm:inline">{tf(TRACKS_IDS.introDesk)}</span>
            <span className="sm:hidden">{tf(TRACKS_IDS.introMob)}</span>
          </p>
          <TrackChooser
            legend={sys('partner.tracks.legend')}
            wayfinderChoose={tf(TRACKS_IDS.wayfinderChoose)}
            wayfinderApply={tf(TRACKS_IDS.wayfinderApply)}
            cards={[
              { key: 'hr', title: tf(TRACKS_IDS.cards.hr.title), body: tf(TRACKS_IDS.cards.hr.body), cta: tf(TRACKS_IDS.cardCta) },
              { key: 'sourcing', title: tf(TRACKS_IDS.cards.sourcing.title), body: tf(TRACKS_IDS.cards.sourcing.body), cta: tf(TRACKS_IDS.cardCta) },
              { key: 'institute', title: tf(TRACKS_IDS.cards.institute.title), body: tf(TRACKS_IDS.cards.institute.body), cta: tf(TRACKS_IDS.cardCta) },
            ]}
            panels={{
              hr: (
                <TrackPanel bundle={bundle} locale={locale} track="hr" formAnchor="apply-hr">
                  <HrAgencyForm bundle={bundle} locale={locale} />
                </TrackPanel>
              ),
              sourcing: (
                <TrackPanel bundle={bundle} locale={locale} track="sourcing" formAnchor="apply-sourcing">
                  <SourcingPartnerForm bundle={bundle} locale={locale} countries={countries} />
                </TrackPanel>
              ),
              institute: (
                <TrackPanel bundle={bundle} locale={locale} track="institute" formAnchor="apply-institute">
                  <InstituteForm bundle={bundle} locale={locale} countries={countries} />
                </TrackPanel>
              ),
            }}
          />
        </div>
      </Section>
```

Notes for the implementer:
- The three panels are server-rendered JSX passed as props to the client island: only the selected one is in the DOM (the design's `sc-if`), the other two ride in the RSC payload. Server actions (`submitHrAgency` …) cross the boundary as references — nothing else in the panels is a function.
- `scrollIntoView?.(…)` is optional-called because jsdom does not implement it; the browser's `scroll-behavior: smooth` on `html` (already reduced-motion-safe in `globals.css`) drives the animation.
- `ring-4 ring-tint` etc. replace the design's `box-shadow: 0 0 0 4px` selected halo; Tailwind v4 `ring-<n>` sets the width.

- [ ] **Step 4: Run tests + `npm run verify`**

```
npx prettier --write "src/app/[locale]/(site)/partner-with-us"
npx vitest run "src/app/\[locale\]/(site)/partner-with-us"      # 5 files, 25 tests passed
npm run verify                                                   # green
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/partner.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts; kill $(cat /tmp/next.pid)
```
Expected: `partner.spec.ts` 8 cases × 2 projects green (page contract ×2, metadata, language links, sourcing track + event + hash, institute deep link, declaration + consent errors, fallback panel); axe zero violations and zero horizontal overflow on `/ortak-olun` and `/en/partner-with-us` at all nine widths; routing/seo loops green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us"
git commit -m "feat(partner): track chooser island (card radios, partner_track_select, #track-<key> deep links) and the three track panels (T5 c4)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — gate on the preview, docs, ledger

- [ ] **Step 1: Write the failing test**

No new test: the gate is the assertion. `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md` and `docs/PRD.md` do not mention this page's build yet — the sentences below are the "test" a reviewer reads.

- [ ] **Step 2: Run to verify it fails**

`grep -n "ortak-olun" docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md` → no matches; `grep -n "Partner inquiry form" docs/PRD.md` → the stale row 4 (one form).

- [ ] **Step 3: Implement**

Push the branch and run the gate against the Vercel preview URL of this commit (one job at a time):

```
git push origin wp2/foundation
E2E_BASE_URL=https://<preview>.vercel.app npm run gate          # playwright → lhci → assert → js-size table
```
`gate: OK` is required; the assertion set includes `resource-summary:script:size ≤ 204,800 B` on `/ortak-olun` and `/en/partner-with-us` (W13 amended). If a route reads above 194,560 B in the js-size table, do the lazy-loading pass NOW (the only candidate on this page is the `TrackChooser` island; move it behind `next/dynamic` without `ssr: false` — it is above the fold and must SSR) before the docs commit.

`docs/SEO.md` — after the `## Metadata` paragraph. If an earlier WP2b page task already added a `### Pages (WP2b)` table, append the row; otherwise add the heading, the intro sentence and the header rows first:

```markdown
### Pages (WP2b)

One row per built page: where the title/description come from, the canonical, the JSON-LD nodes rendered on the page itself (the site-wide Organization/WebSite nodes come from the locale layout), and the element that carries `data-lcp-slot` (D26) with the named placeholders the launch counter reports (W55).

| Page | Routes | Title / description | Canonical | Page JSON-LD | LCP slot · placeholders |
| --- | --- | --- | --- | --- | --- |
| Partner With Us | `/ortak-olun` · `/en/partner-with-us` | `pages.partner` record → partner.222 / partner.223 (package SEO strings; no `sys.seo.partner.*`) | `absoluteUrl(locale, '/partner-with-us')` | `BreadcrumbList` (`Breadcrumbs`: Home → Partner With Us), `FAQPage` (`FaqBlock`, 6 pairs, AEO only) | `h1` (no hero photo, §10 #4) · `partner-portal-screen`, `partner-portal-mobile` |
```

`docs/ANALYTICS.md` — § Event schema table: in the `partner_track_select` row (added by T0c), replace the "Fires on" cell `Partner page — a track is chosen` with `Partner page — the sourcing or institute card is chosen (T5; the HR-agency card is the default panel and fires nothing — its form submits under the \`hire\` key, W3)`. In the paragraph that begins "**Enum-keyed params (W12/W26).**", append the sentence: "Wired so far: `partner_track_select` on `/ortak-olun` (`src/app/[locale]/(site)/partner-with-us/_components/TrackChooser.tsx`, `page` from `next/navigation`, W67 enum values only)." — if T1–T4 already started a "Wired so far:" sentence there, extend its list instead of adding a second sentence.

`docs/CONTENT-MODEL.md` — § Adding copy: after the paragraph, add (or extend, if an earlier page task started it) the list:

```markdown
**Namespaces in use.** `sys.partner.*` (Partner With Us, T5): `whatsapp.prefill` (the hero/sticky WhatsApp prefill), `faq.whatsappText`, `faq.emailSubject`, `faq.email` (the ask card's third door — `FaqAskCard` has WhatsApp and call slots only), `tracks.legend` (the radiogroup's accessible name). Everything else on the page is a package id (`partner.002`, `partner.008`, `partner.016`, `partner.023`–`190` less the ids the deltas retire, `partner.222`/`223`); the consent sentence is the kernel's `sys.form.consent.*`, not partner.090/091.
```

`docs/PRD.md` — the page table, row 4: replace the "Forms carried" cell `Partner inquiry form (\`INQUIRY\`)` with `Three track forms, two keys (W3/W16): HR agency → \`hire\` + \`iAm: hr_agency\` (\`INQUIRY\`, lands with the Turkey sales team); sourcing partner and training institute → \`partner\` + \`track\` (\`INQUIRY\`, SOURCING_PARTNER)`.

`docs/INTEGRATIONS.md` — no change: the fields sent (`hire`: name, company, email, phone, country, iAm, city, message; `partner`: name, company, email, phone, country, track, licence, candidatesPerYear, trades, city) are all in catalog v1.0/v1.1; T14 writes the per-form I4 table.

Ledger (append to `.superpowers/` WP2b ledger, one line — record the measured values, none of them is typed from memory):

```
T5 Partner With Us — /ortak-olun + /en/partner-with-us · script (gz, worst of both): <n> B of 204,800 (headroom <n>) · Lighthouse perf/a11y/bp/seo: <p>/<a>/<b>/<s> (tr) <p>/<a>/<b>/<s> (en) · LCP <ms> · pixel: n/a (not a D27 harness page — Fable side-by-side review) · deltas 1–12 above · WP-C copy sheet: partner.059 (one business day vs {replySlaHours}), partner.077 (12+ vs 13 countries: add `"partner.077": [{ "key": "countries" }]` + literal `[12+] countries` to scripts/metric-placeholders.json in T0b's table), partner.135 unused (split), partner.037/039/045 hidden (unsigned)
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md` · `npm run verify` → green (Prettier checks the docs tables).

- [ ] **Step 5: Commit**

```bash
git add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md
git commit -m "docs(partner): SEO page row, partner_track_select wiring, sys.partner namespace, PRD forms row (T5 c5)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/SEO.md` § Pages (WP2b) row (title source = `pages.partner` → partner.222/223; canonical; BreadcrumbList + FAQPage; LCP = h1; two named placeholders) · `docs/ANALYTICS.md` `partner_track_select` "Fires on" cell + the "Wired so far" sentence (HR default fires nothing; W67 enum) · `docs/CONTENT-MODEL.md` § Adding copy "Namespaces in use" `sys.partner.*` entry · `docs/PRD.md` page-table row 4 "Forms carried" (three forms, two keys, W3/W16) · no `docs/INTEGRATIONS.md` change (T14 owns the I4 table; every field sent is in catalog v1.0/v1.1) · ledger line (route, gz script size, Lighthouse triple, pixel n/a, deltas 1–12, WP-C copy items).

**Sys keys added:** `sys.partner.whatsapp.prefill`, `sys.partner.faq.whatsappText`, `sys.partner.faq.emailSubject`, `sys.partner.faq.email`, `sys.partner.tracks.legend` (5 keys, both locales; no `sys.seo.partner.*` — the package ships partner.222/223; no `sys.form.countries` — the list is the W25 `countries` collection).

**Package ids used:** 161 (first `partner.002`, last `partner.223`) — pinned by `_lib/__tests__/content.test.ts` against both generated bundles. Not read, on purpose: partner.001/003–007/009–015/019–022 and 191–221 (chrome, R15), 017/018 (`CTA_BY_PATHNAME`, W17), 034 (hero photo alt, no photo), 037/039/045 (unsigned metrics, W1), 060 (sticky Call — see below), 088/089 (inline success → D13), 090/091 (kernel consent), 135 (split into city + country), 162/163 (StoreBadges → hire.240/241, W7).

**Foundation gaps:** (1) `StickyCtaBar` renders its `ctas` as plain `Button`s with no contact placement, so the design's Call/WhatsApp buttons in the bar would be untracked `tel:`/`wa.me` anchors (W12) — the bar carries only the `#tracks` CTA until the bar routes contact hrefs through `ContactLink` (a `page_cta` placement fits; no new enum value needed); (2) `FormShell` has no `id` prop — the mobile jump links target the wrapping `FormCard` div instead (works, but a second form on one page needs the same wrapper); (3) `FaqAskCard` has WhatsApp + call slots only — the design's third "Email" row is rendered through `FaqBlock`'s `footer` slot below the accordion with a `sys.partner.faq.email` label. Not a gap, by design: `RadioChipOption = { value, label }` cannot carry the card body/icon/CTA, so the island renders its own native-radio cards on the same pattern.
