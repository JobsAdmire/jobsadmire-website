### Task 11: Careers index + detail (`/kariyer`, `/en/careers`, `/kariyer/[slug]`, `/en/careers/[slug]`)

The "Join Our Team" page ported as two routes that read **live openings** from the Operations public careers API (D15, I6): the index (dark text-only hero with the live-count pill and the first four overseas roles, the worker notice band, the filterable roles list, the three engagement-type cards, the 7-step hiring process with the Admira AI badge, the speculative "no matching role?" section, the FAQ) and the detail page (`JobPosting` JSON-LD, the description, an at-a-glance card, the **apply form → `careers`** with the server-side CV upload proxy, the residency lock, the PK expected-salary branch and the portfolio "apply by e-mail" branch). The design's nine hard-coded roles (`jt.144`–`jt.244`) are marketing fixtures and are **not rendered** (D23 — a live section never ships fixtures); the live list is `GET /api/careers/openings`, read server-side under the reserved ISR tag `openings` with the 300 s floor (§3.1, ARCHITECTURE § Freshness). No opening on the API today → the index renders the W6 empty state, the detail routes 404, the sitemap carries no detail entry — all deterministic on a preview without a door.

Rulings applied: **W1** (no numbers typed into copy: the hero count pill and "See N open positions" are computed from the live list; `jt.025`'s Turkish hard-types "dört" so the CTA reads a `sys.careers.hero.seeOpenings` ICU plural instead — `jt.025`/`jt.288` are deliberately unrendered; the country chips are the `sourceCountries` collection, the one D17 list — `jt.289`–`jt.301` unrendered), **W3** (the speculative application is WhatsApp + e-mail only in Phase A — no form, no key; `jt.097`–`jt.102`, `jt.108`–`jt.110`, `jt.313`–`jt.321` unrendered; the per-opening apply is `careers` with PDF CV required, the PK `expectedSalary` branch honoured and portfolio openings on the "apply by e-mail" panel until W56 relaxes the gate; option values are stable keys), **W6** (index empty state under `sys.careers.empty.*`; the hero role card and the count pill are components that return `null` when the list is empty), **W9/W23** (every id-less string under `sys.careers.*`, `sys.seo.careers.*`, `sys.seo.careersDetail.*`; package ids by exact id through `makeTf`), **W10** (the design's ≤900 px "ways" accordions are static stacked cards — no conditional rendering, no JS), **W12/W67** (`career_apply_start` with `slug` on the visitor's first interaction with the apply form; contact clicks through `ContactCta`/`ContactLink` placements `page_cta`/`form_fallback`; no other page event), **W13 amended** (one small always-on island for the filters — the list is above the fold and SEO-bearing, so it is server-rendered and hydrated, not `ssr:false`; two tiny detail islands), **W16** (`portfolioUrl` sent when typed — v1.1), **W17** (`/careers` and `/careers/[slug]` have no `CTA_BY_PATHNAME` entry → `DEFAULT_CTAS`; the detail's language alternate comes from the hreflang tag `buildMetadata` emits — the API's slug is the same for both locales, so `localeAlternates(href)` is already correct and no `alternates` override is passed), **W19** (`(site)` group), **W20** (both keys leave `UNBUILT_PATHNAMES`), **W21** (two index rows in `e2e/routes.ts`; the detail route is exercised by its own mock-door run — see below — because a preview has no opening to point the gate at), **W31/W70** (the openings sitemap source is added by editing the frozen `DETAIL_SITEMAP_SOURCES` literal), **W40** (`country` is the API's upper-case ISO-2 `Country.code`), **D26** (`data-lcp-slot="h1"` on both `h1`s — the page has no photography; no image slots at all), **D27** (not a pixel-harness page — side-by-side review).

**Read this before the first cycle — the mock door.** The task brief says "e2e with the API mocked via a Playwright route". A Playwright `page.route()` intercepts the **browser's** requests only; every call this page makes to Operations (`/api/careers/openings`, `/api/careers/openings/:slug`, `POST /api/careers/upload-cv`) is a **server-side** `fetch` inside a server component or a server action, which `page.route()` can never see. The mock is therefore a tiny Node HTTP door (`e2e/mocks/careers-door.mjs`) that `npm run e2e:careers` starts, then builds and starts the site with `OPS_API_URL` pointed at it (so `generateStaticParams` and the ISR fetches hit the fixtures), and runs `e2e/pages/careers.spec.ts` with `E2E_CAREERS_MOCK=1`. The same spec, run inside the ordinary gate (no door), asserts the empty-state contract and skips the detail cases. Both modes are deterministic; neither fakes a success.

**Files:**

Create
- `src/lib/careers-pure.ts` — the public-opening Zod schema + the pure helpers (client-safe, unit-tested)
- `src/lib/careers.ts` — `listOpenings`/`getOpening` (`server-only`, injectable `fetch`, ISR tag + floor, empty list on failure + the site-health counter)
- `src/lib/careers-sitemap.ts` — `careersSitemapSource` (W31)
- `src/lib/__tests__/careers-pure.test.ts`, `src/lib/__tests__/careers.test.ts`
- `src/app/api/site-health/openings.ts` — the failure counter (`recordOpeningsFailure`/`openingsFailureCount`/`resetOpeningsFailures`)
- `src/app/[locale]/(site)/careers/page.tsx` — the index
- `src/app/[locale]/(site)/careers/_lib/view-model.ts` — `roleCards()` (server; the strings the island receives)
- `src/app/[locale]/(site)/careers/_components/HeroRoleCard.tsx` — server; `null` when no overseas opening
- `src/app/[locale]/(site)/careers/_components/RolesList.tsx` — `'use client'`; filters, show-more, no-match state
- `src/app/[locale]/(site)/careers/_components/WaysCards.tsx` — server; the three engagement cards + the written-agreement note
- `src/app/[locale]/(site)/careers/_components/HiringSteps.tsx` — server; the 7 steps with the Admira AI badge (shared by both pages)
- `src/app/[locale]/(site)/careers/_components/OpenApplication.tsx` — server; the `#apply` section (WhatsApp + e-mail, W3)
- `src/app/[locale]/(site)/careers/__tests__/view-model.test.ts`, `src/app/[locale]/(site)/careers/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/careers/[slug]/page.tsx` — the detail
- `src/app/[locale]/(site)/careers/[slug]/actions.ts` — `'use server'`, `submitCareersApplication`
- `src/app/[locale]/(site)/careers/[slug]/_lib/apply-spec.ts` — `applySchema` + `applyToFields` (pure, unit-tested)
- `src/app/[locale]/(site)/careers/[slug]/_components/ApplyForm.tsx` — server; the `FormShell` and its fields
- `src/app/[locale]/(site)/careers/[slug]/_components/CountryField.tsx` — `'use client'`; the pre-selected ISO-2 select (residency lock)
- `src/app/[locale]/(site)/careers/[slug]/_components/ApplyStartPing.tsx` — `'use client'`; `career_apply_start` once per mount
- `src/app/[locale]/(site)/careers/[slug]/_components/EmailApplyPanel.tsx` — server; the portfolio-opening branch
- `src/app/[locale]/(site)/careers/[slug]/_components/Description.tsx` — server; the description blocks
- `src/app/[locale]/(site)/careers/[slug]/__tests__/apply-spec.test.ts`
- `e2e/pages/careers.spec.ts`, `e2e/mocks/careers-door.mjs`, `e2e/mocks/run-careers.sh`

Modify
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES` initialiser (Task 4's `new Set<keyof typeof pathnames>([ … ])` literal, lines 465–486 of Task 4's file): delete the line `'/careers',` (cycle 2) and the line `'/careers/[slug]',` (cycle 5)
- `src/lib/seo/sitemap-sources.ts` — line 16 (`export const DETAIL_SITEMAP_SOURCES: readonly SitemapSource[] = Object.freeze([]);`) becomes the one-entry literal + one import (W70)
- `src/lib/seo/sitemap-sources.test.ts` — Task 4's first case (`is empty and frozen in the foundation …`, lines 9–13) is rewritten to assert the one registered source
- `src/app/api/site-health/route.ts` — one import + one body line after `formBeacons: formBeaconCount(),` (Task 2's file, line 52)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE` (Task 7's file, lines 215–222): two rows appended after `'/en/hire-workers'`
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.careers.*` + `sys.seo.careersDetail.*` inside the existing `seo` object (Task 4 created it with `ogTagline`); new `sys.careers.*` block
- `package.json` — `"e2e:careers"` script beside `"e2e"`
- `docs/SEO.md` (two Pages rows + the JobPosting note), `docs/ANALYTICS.md` (page wiring paragraph), `docs/CONTENT-MODEL.md` (`sys.careers.*` bullet), `docs/ARCHITECTURE.md` (§ Freshness — the openings data layer paragraph), `docs/INTEGRATIONS.md` (I5/I6 wire contract as built), `docs/OPERATING.md` (the `openingsFailures` field)

Test
- Vitest: `src/lib/__tests__/careers-pure.test.ts`, `src/lib/__tests__/careers.test.ts`, `src/app/[locale]/(site)/careers/__tests__/{view-model,sys-keys}.test.ts`, `src/app/[locale]/(site)/careers/[slug]/__tests__/apply-spec.test.ts` (all matched by the existing `src/**/*.test.{ts,tsx}` include); `src/lib/seo/unbuilt.test.ts` and `src/lib/seo/sitemap-sources.test.ts` (Task 4's — the red→green tests of cycles 1 and 6)
- Playwright: `e2e/pages/careers.spec.ts` (both projects; the ordinary gate runs its no-door half, `npm run e2e:careers` runs the mock-door half), plus the existing loops in `e2e/routing.spec.ts` (page contract), `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts`, which pick the two index routes up from `e2e/routes.ts`

**Interfaces:**

Consumes (WP2a, exactly as `produces-final.md` spells them):
- `src/content/collections.ts` — `getCollection(bundle, 'countries')` (`Country = { code, name, dial }`, 64 rows, sort by `name` at the edge), `getCollection(bundle, 'sourceCountries')` (`SourceCountry`, 13 rows, `code` upper-case ISO2, `name` locale-resolved), `PAGE_KEYS` entries `'careers'` / `'careersDetail'`
- `src/content/pure.ts` (via `@/content/adapter`, which `export *`s it) — `makeTf(bundle, locale)`
- `src/forms/action.ts` (`server-only`) — `createFormAction({ key, schema, consent, toFields })`, `FormActionError`, `FormActionState`; `src/forms/types.ts` (client-safe) — `FormActionError` for the pure spec module; `src/forms/wire.ts` — `WireFields`; `src/forms/uploads.ts` — `uploadCv(file, { field: 'cv' })` → `{ cvKey }` (throws `FormActionError` field `cv` code `file` / `FormDoorError`), `isFile`; `src/forms/env.ts` — `doorBase(env?)` (`OPS_API_URL` without a trailing slash, `null` when unset)
- `src/forms/client/FormShell.tsx` — `FormShell({ action, formKey, locale, turnstileSiteKey, whatsappNumber, whatsappIntro?, contact?, submitLabel?, consent?, consentLinkHref?, title?, testId?, children })` (renders honeypot, Turnstile, the consent row, the submit button and the `data-testid="form-fallback"` panel); `src/forms/client/Field.tsx` — `Field({ name, label?, hint?, placeholder?, required?, as?, type?, options?, autoComplete?, inputMode?, accept?, rows?, min?, id? })`, `INPUT_CLASS`, `FieldOption`; `src/forms/client/FormErrorsContext.tsx` — `useFieldError(name)`, `useFieldValue(name)`
- `sys.form.labels.{name,email,phone,country,city,language,expectedSalary,cv,linkedinUrl,portfolioUrl,coverLetter}`, `sys.form.placeholders.*`, `sys.form.hints.{cv,linkedinUrl,portfolioUrl,optional}`, `sys.form.errors.*` (Task 2's copy — the page adds no form label)
- `src/analytics/track.ts` — `track('career_apply_start', { page, locale, slug })` (`ALLOWED_PARAMS.career_apply_start = ['page','locale','slug']`, W67: `slug` = the opening's public URL segment, ≤80 chars); `src/analytics/ContactLink.tsx` — `ContactLink({ href, placement, ...anchor })` (client, for the island's WhatsApp link)
- `src/design/blocks` barrel — `Breadcrumbs({ locale, items: Crumb[], tone? })` with `Crumb = { name; href: Href }`, `FaqBlock({ bundle, locale, items: FaqItem[], id?, eyebrowId?, headingId?, footer? })`, `EmptyState({ title, body?, cta?: { label, href }, tone?, headingLevel?, testId? })`, `ContactCta({ placement: 'page_cta', href, variant?, size?, external?, className?, children })`
- `src/design/primitives` barrel — `Section({ tone: 'light' | 'dark' | 'pale' | 'band', id?, className? })`, `Eyebrow`, `Card`, `FormField` (WP1 render-prop), `RadioChips({ name, options, value, onChange, legend, legendHidden?, className? })` + `RadioChipOption`, `buttonClassName(variant, size?, className?)`
- `src/design/Flag.tsx` — `Flag({ code: FlagCode, size?, label? })`; `src/design/assets/flag-codes.ts` — `isFlagCode(code)`
- `src/lib/format/date.ts` — `formatDate(iso, locale)` (server/test only — never imported by an island; the view model pre-formats the "Posted …" string)
- `src/lib/seo/metadata.ts` — `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` (the `careers`/`careersDetail` page records have `titleId: ''` → the fallbacks are used, W38; OG image = `pageOgImageUrl(locale, pageKey)`; the detail passes the typed dynamic `href` and gets both locale alternates from `localeAlternates`)
- `src/lib/seo/jsonld.ts` — `jobPostingJsonLd({ title, description, url, datePosted, employmentType, hiringOrganization: Settings, jobLocation: { city, country }, baseSalary?, identifier? })` (no `validThrough` is passed — the API has none and D17 forbids inventing one)
- `src/lib/seo/routes.ts` — `absoluteUrl(locale, href)`, `UNBUILT_PATHNAMES`; `src/lib/seo/sitemap-sources.ts` — `SitemapSource`, `DETAIL_SITEMAP_SOURCES`
- `src/app/api/site-health/route.ts` (Task 2's shape — `ops`, `formBeacons`), `src/app/api/form-beacon/state.ts` (the counter pattern this task copies)
- `src/test/bundle.ts` — `testBundle(overrides)`; the Vitest `server-only` alias (Task 2's `src/test/server-only.ts`)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`
- Route groups (W19): the page files live under `src/app/[locale]/(site)/careers/`; a `notFound()` from the detail lands in the `(site)` not-found boundary, chrome intact. Contract import depth from `careers/` is five levels (`'../../../../../contract/website-bundle.v1'`), from `careers/[slug]/` six, from `careers/[slug]/_components/` seven.

Consumes (WP1, read from the code at `ad58fb8`):
- `getBundle(locale)` (`@/content/adapter`, `server-only`, React-`cache`d); `makeT` is not used on these pages — every package id goes through `makeTf`
- `Link` from `@/i18n/navigation` (object hrefs `{ pathname: '/careers/[slug]', params: { slug } }` for every detail link — the typed way to a dynamic route in both locales); `routing`, `Locale`, `pathnames` (`@/i18n/routing`); `waLink`, `mailLink` (`@/lib/contact`); `getTranslations`/`setRequestLocale`/`getLocale` (`next-intl/server`); `hasLocale`, `useTranslations`, `useLocale` (`next-intl`); `usePathname` from **`next/navigation`** for the analytics `page` param (R35)
- `formatTRY`, `formatInt` (`@/lib/format/money`); `JsonLd` (`@/lib/seo/JsonLdScript`); `bundle.settings.{careersEmail, whatsappNumber, phone, phoneDisplay, turnstileSiteKey}`
- Tailwind theme tokens in `src/app/globals.css`: `bg-navy`, `text-sky`, `text-blue-safe`, `bg-blue-safe`, `bg-pale-1`, `bg-tint`, `border-border-1`, `border-border-2`, `text-text-secondary`, `text-text-tertiary`, `text-muted`, `bg-success-surface`, `text-success-text`, `border-success-border`, `bg-warning-surface`, `border-warning-border`, `text-warning-text`, `rounded-pill`, `rounded-lg` (20 px), `rounded-base` (16 px), `rounded-sm` (14 px), `shadow-card`, `text-h1`, `text-h2`, `text-body`, `text-body-lg`, `text-body-sm`, `text-card-title`, `text-eyebrow`, `container-site`; breakpoints `sm 561`, `md 701`, `lg 901`

Produces: `src/lib/careers-pure.ts` (`PublicOpeningSchema`, `PublicOpening`, `OPENINGS_TAG`, `placeOf`, `engagementOf`, `salaryPartsOf`, `formatMoney`, `baseSalaryOf`, `opsCareersUrl`) and `src/lib/careers.ts` (`listOpenings`, `getOpening`, `OpeningsUnavailableError`) — T15's launch check reads `openingsFailures` from `/api/site-health`; T14 exercises the apply form on staging against the real door with this task's `data-testid`s (`careers-apply-form`, `careers-email-apply`, `form-fallback`). Nothing else consumes these.

---

#### Cycle 1 — data layer: schema, pure helpers, the server fetch with the ISR tag, the site-health counter

- [ ] **Step 1: Write the failing tests**

`src/lib/__tests__/careers-pure.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  baseSalaryOf,
  countryNameOf,
  descriptionBlocks,
  engagementOf,
  formatMoney,
  isNewOpening,
  JOB_POSTING_EMPLOYMENT_TYPE,
  locationOf,
  OpeningsListSchema,
  opsCareersUrl,
  placeOf,
  PublicOpeningSchema,
  salaryPartsOf,
  summaryOf,
  type PublicOpening,
} from '../careers-pure';

/** The exact shape `shapePublicOpening` emits in Operations
 *  (apps/backend/src/modules/careers-public/careers-public.service.ts). */
export const OPENING: PublicOpening = {
  slug: 'country-representative-uzbekistan',
  title: 'Country Representative — Uzbekistan',
  country: 'UZ',
  city: 'Tashkent',
  cities: ['Tashkent'],
  category: 'COUNTRY_REPRESENTATIVE',
  employmentArrangement: 'FULL_TIME',
  employmentArrangements: ['FULL_TIME'],
  workMode: 'REMOTE',
  workModes: ['REMOTE'],
  description:
    'Own our whole pipeline in Uzbekistan — partners, candidates and quality.\n\nWhat you will do:\n- Find and manage licensed partner agencies\n- Run first interviews\n\nWhat we look for:\n- A working network among agencies',
  salaryMin: '800',
  salaryMax: '1200',
  salaryCurrency: 'USD',
  salaryPayType: 'RANGE',
  salaryPeriod: 'MONTH',
  salaryVisible: true,
  payCurrency: 'USD',
  portfolioRequired: false,
  requiredLanguage: 'Uzbek',
  requiredLanguages: ['Uzbek', 'Russian', 'English'],
  postedAt: '2026-09-15T08:00:00.000Z',
};

describe('PublicOpeningSchema', () => {
  it('parses the Operations shape and defaults the optional arrays', () => {
    const { cities: _c, employmentArrangements: _e, workModes: _w, requiredLanguages: _r, ...bare } = OPENING;
    const parsed = PublicOpeningSchema.parse(bare);
    expect(parsed.cities).toEqual([]);
    expect(parsed.workModes).toEqual([]);
    expect(parsed.description).toBe(OPENING.description);
  });

  it('accepts a hidden salary (every salary field null) and a null description', () => {
    const parsed = PublicOpeningSchema.parse({
      ...OPENING,
      salaryMin: null,
      salaryMax: null,
      salaryCurrency: null,
      salaryPayType: null,
      salaryPeriod: null,
      salaryVisible: false,
      description: null,
      city: null,
      workMode: null,
    });
    expect(parsed.salaryVisible).toBe(false);
    expect(parsed.description).toBeNull();
  });

  it('refuses a slug the door would refuse (catalog pattern) and an unknown category', () => {
    expect(PublicOpeningSchema.safeParse({ ...OPENING, slug: 'Bad Slug' }).success).toBe(false);
    expect(PublicOpeningSchema.safeParse({ ...OPENING, category: 'INTERN' }).success).toBe(false);
  });

  it('OpeningsListSchema carries data + meta', () => {
    const list = OpeningsListSchema.parse({
      data: [OPENING],
      meta: { total: 1, page: 1, limit: 50, totalPages: 1 },
    });
    expect(list.data[0].slug).toBe(OPENING.slug);
  });
});

describe('helpers', () => {
  it('placeOf: TR is the Antalya office, everything else overseas', () => {
    expect(placeOf({ country: 'TR' })).toBe('office');
    expect(placeOf({ country: 'tr' })).toBe('office');
    expect(placeOf({ country: 'UZ' })).toBe('overseas');
  });

  it('engagementOf maps the four categories onto the three design filters', () => {
    expect(engagementOf('FULL_TIME')).toBe('fullTime');
    expect(engagementOf('COUNTRY_REPRESENTATIVE')).toBe('fullTime');
    expect(engagementOf('FREELANCER')).toBe('partTime');
    expect(engagementOf('PROJECT_BASED')).toBe('project');
  });

  it('JOB_POSTING_EMPLOYMENT_TYPE covers every category with a Google enum value', () => {
    expect(JOB_POSTING_EMPLOYMENT_TYPE).toEqual({
      FULL_TIME: 'FULL_TIME',
      FREELANCER: 'CONTRACTOR',
      PROJECT_BASED: 'TEMPORARY',
      COUNTRY_REPRESENTATIVE: 'CONTRACTOR',
    });
  });

  it('isNewOpening: posted within 14 days', () => {
    const now = new Date('2026-09-20T00:00:00Z');
    expect(isNewOpening('2026-09-15T08:00:00.000Z', now)).toBe(true);
    expect(isNewOpening('2026-09-06T00:00:00.000Z', now)).toBe(true);
    expect(isNewOpening('2026-09-05T23:59:59.000Z', now)).toBe(false);
    expect(isNewOpening('not a date', now)).toBe(false);
  });

  it('summaryOf: first paragraph, cut at a word boundary with an ellipsis', () => {
    expect(summaryOf(OPENING.description)).toBe(
      'Own our whole pipeline in Uzbekistan — partners, candidates and quality.',
    );
    const long = 'word '.repeat(60).trim();
    const s = summaryOf(long, 40);
    expect(s.length).toBeLessThanOrEqual(41);
    expect(s.endsWith('…')).toBe(true);
    expect(summaryOf(null)).toBe('');
  });

  it('descriptionBlocks: paragraphs on blank lines, `- ` lines become one list', () => {
    expect(descriptionBlocks(OPENING.description)).toEqual([
      { type: 'p', text: 'Own our whole pipeline in Uzbekistan — partners, candidates and quality.' },
      { type: 'p', text: 'What you will do:' },
      { type: 'ul', items: ['Find and manage licensed partner agencies', 'Run first interviews'] },
      { type: 'p', text: 'What we look for:' },
      { type: 'ul', items: ['A working network among agencies'] },
    ]);
    expect(descriptionBlocks(null)).toEqual([]);
    expect(descriptionBlocks('• a\n* b\r\n- c')).toEqual([{ type: 'ul', items: ['a', 'b', 'c'] }]);
  });

  it('countryNameOf: the collection first, Intl second, the code last', () => {
    const rows = [{ code: 'UZ', name: 'Özbekistan' }];
    expect(countryNameOf('UZ', rows, 'tr')).toBe('Özbekistan');
    expect(countryNameOf('PK', rows, 'en')).toBe('Pakistan');
    expect(countryNameOf('ZZ', rows, 'en')).toBe('ZZ');
  });

  it('locationOf joins the cities and the country name', () => {
    expect(locationOf(OPENING, 'Uzbekistan')).toBe('Tashkent · Uzbekistan');
    expect(locationOf({ ...OPENING, cities: ['Karachi', 'Lahore'], city: 'Karachi' }, 'Pakistan')).toBe(
      'Karachi, Lahore · Pakistan',
    );
    expect(locationOf({ ...OPENING, cities: [], city: null }, 'Pakistan')).toBe('Pakistan');
  });

  it('salaryPartsOf: null when hidden, else the pay-type shape', () => {
    expect(salaryPartsOf({ ...OPENING, salaryVisible: false })).toBeNull();
    expect(salaryPartsOf(OPENING)).toEqual({
      kind: 'range',
      min: 800,
      max: 1200,
      currency: 'USD',
      period: 'MONTH',
    });
    expect(salaryPartsOf({ ...OPENING, salaryPayType: 'STARTING', salaryMax: null })).toMatchObject({
      kind: 'from',
      min: 800,
    });
    expect(salaryPartsOf({ ...OPENING, salaryPayType: 'MAXIMUM', salaryMin: null })).toMatchObject({
      kind: 'upTo',
      max: 1200,
    });
    expect(salaryPartsOf({ ...OPENING, salaryPayType: 'EXACT', salaryMin: '1000', salaryMax: '1000' })).toMatchObject({
      kind: 'exact',
      min: 1000,
    });
    // no pay type: inferred from which bounds exist
    expect(salaryPartsOf({ ...OPENING, salaryPayType: null, salaryMax: null })).toMatchObject({ kind: 'from' });
    // no currency → nothing to show
    expect(salaryPartsOf({ ...OPENING, salaryCurrency: null })).toBeNull();
  });

  it('formatMoney: TRY through formatTRY (D18), other currencies through Intl', () => {
    expect(formatMoney(38944, 'TRY', 'tr')).toBe('38.944 ₺');
    expect(formatMoney(38944, 'TRY', 'en')).toBe('₺38,944');
    expect(formatMoney(1200, 'USD', 'en')).toBe('$1,200');
    expect(formatMoney(150000, 'PKR', 'en')).toMatch(/^PKR\s?150,000$/);
    expect(formatMoney(1200, 'USD', 'tr')).toMatch(/1\.200/);
  });

  it('baseSalaryOf: a JobPosting MonetaryAmount for HOUR/MONTH/YEAR only', () => {
    expect(baseSalaryOf(OPENING)).toEqual({
      currency: 'USD',
      value: { min: 800, max: 1200 },
      unitText: 'MONTH',
    });
    expect(baseSalaryOf({ ...OPENING, salaryPayType: 'EXACT', salaryMin: '1000', salaryMax: '1000' })).toEqual({
      currency: 'USD',
      value: 1000,
      unitText: 'MONTH',
    });
    expect(baseSalaryOf({ ...OPENING, salaryPeriod: 'WEEK' })).toBeUndefined();
    expect(baseSalaryOf({ ...OPENING, salaryVisible: false })).toBeUndefined();
  });

  it('opsCareersUrl is the locale-prefixed Operations careers page', () => {
    expect(opsCareersUrl('tr')).toBe('https://operations.jobsadmire.com/tr/careers');
    expect(opsCareersUrl('en')).toBe('https://operations.jobsadmire.com/en/careers');
  });
});
```

`src/lib/__tests__/careers.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  openingsFailureCount,
  resetOpeningsFailures,
} from '@/app/api/site-health/openings';
import { getOpeningUncached, listOpeningsUncached, OpeningsUnavailableError } from '../careers';
import { OPENING } from './careers-pure.test';

const env = { OPS_API_URL: 'https://operations.example.com/' } as NodeJS.ProcessEnv;
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const page = (data: unknown[], meta: Partial<{ page: number; totalPages: number }> = {}) =>
  json({ data, meta: { total: data.length, page: 1, limit: 50, totalPages: 1, ...meta } });

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  resetOpeningsFailures();
  fetchMock = vi.fn();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('listOpeningsUncached', () => {
  it('reads every page under the openings tag with the 300 s floor', async () => {
    fetchMock
      .mockResolvedValueOnce(page([OPENING], { page: 1, totalPages: 2 }))
      .mockResolvedValueOnce(page([{ ...OPENING, slug: 'second-role' }], { page: 2, totalPages: 2 }));
    const rows = await listOpeningsUncached({ fetch: fetchMock as unknown as typeof fetch, env });
    expect(rows.map((r) => r.slug)).toEqual([OPENING.slug, 'second-role']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit & { next: unknown }];
    expect(url).toBe('https://operations.example.com/api/careers/openings?page=1&limit=50');
    expect(init.next).toEqual({ tags: ['openings'], revalidate: 300 });
    expect(openingsFailureCount()).toBe(0);
  });

  it('is an empty list, with no call and no failure, when no door is configured', async () => {
    expect(await listOpeningsUncached({ fetch: fetchMock as unknown as typeof fetch, env: {} as NodeJS.ProcessEnv })).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(openingsFailureCount()).toBe(0);
  });

  it('is an empty list and one counted failure on a 5xx, a network error or a contract violation', async () => {
    fetchMock.mockResolvedValueOnce(new Response('nope', { status: 502 }));
    expect(await listOpeningsUncached({ fetch: fetchMock as unknown as typeof fetch, env })).toEqual([]);
    expect(openingsFailureCount()).toBe(1);

    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    expect(await listOpeningsUncached({ fetch: fetchMock as unknown as typeof fetch, env })).toEqual([]);
    expect(openingsFailureCount()).toBe(2);

    fetchMock.mockResolvedValueOnce(page([{ ...OPENING, category: 'INTERN' }]));
    expect(await listOpeningsUncached({ fetch: fetchMock as unknown as typeof fetch, env })).toEqual([]);
    expect(openingsFailureCount()).toBe(3);
    expect(console.error).toHaveBeenCalledTimes(3);
  });

  it('stops after five pages (250 openings) even when the door claims more', async () => {
    for (let i = 1; i <= 6; i++)
      fetchMock.mockResolvedValueOnce(page([{ ...OPENING, slug: `role-${i}` }], { page: i, totalPages: 99 }));
    const rows = await listOpeningsUncached({ fetch: fetchMock as unknown as typeof fetch, env });
    expect(rows).toHaveLength(5);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });
});

describe('getOpeningUncached', () => {
  it('reads one opening by slug (encoded) under the same tag', async () => {
    fetchMock.mockResolvedValueOnce(json({ data: OPENING }));
    const row = await getOpeningUncached(OPENING.slug, { fetch: fetchMock as unknown as typeof fetch, env });
    expect(row?.title).toBe(OPENING.title);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit & { next: unknown }];
    expect(url).toBe(`https://operations.example.com/api/careers/openings/${OPENING.slug}`);
    expect(init.next).toEqual({ tags: ['openings'], revalidate: 300 });
  });

  it('is null (not a failure) for a 404, a malformed slug, or no door', async () => {
    fetchMock.mockResolvedValueOnce(json({ statusCode: 404, message: 'Opening not found' }, 404));
    expect(await getOpeningUncached('gone-role', { fetch: fetchMock as unknown as typeof fetch, env })).toBeNull();
    expect(await getOpeningUncached('Not A Slug', { fetch: fetchMock as unknown as typeof fetch, env })).toBeNull();
    expect(await getOpeningUncached('x', { fetch: fetchMock as unknown as typeof fetch, env: {} as NodeJS.ProcessEnv })).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(openingsFailureCount()).toBe(0);
  });

  it('throws OpeningsUnavailableError (and counts) on a 5xx, a network error or a contract violation — never a false 404', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 503 }));
    await expect(getOpeningUncached('x', { fetch: fetchMock as unknown as typeof fetch, env })).rejects.toBeInstanceOf(
      OpeningsUnavailableError,
    );
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(getOpeningUncached('x', { fetch: fetchMock as unknown as typeof fetch, env })).rejects.toBeInstanceOf(
      OpeningsUnavailableError,
    );
    fetchMock.mockResolvedValueOnce(json({ data: { ...OPENING, slug: 'Bad Slug' } }));
    await expect(getOpeningUncached('x', { fetch: fetchMock as unknown as typeof fetch, env })).rejects.toBeInstanceOf(
      OpeningsUnavailableError,
    );
    expect(openingsFailureCount()).toBe(3);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run src/lib/__tests__/careers-pure.test.ts src/lib/__tests__/careers.test.ts` → both files fail to import (`Cannot find module '../careers-pure'` / `'../careers'` / `'@/app/api/site-health/openings'`).

- [ ] **Step 3: Implement**

`src/app/api/site-health/openings.ts`:

```ts
/** How many times this instance failed to read the Operations openings feed (list or detail)
 *  and served the empty state / last-good page instead. Module-level and therefore best-effort
 *  on serverless, exactly like `form-beacon/state.ts`: a cold instance starts at 0 and a redeploy
 *  forgets. A rising number beside `ops.state: 'ok'` on `/api/site-health` means the public
 *  careers API is failing while the website door is fine — docs/OPERATING.md. */
let count = 0;

export function recordOpeningsFailure(): void {
  count += 1;
}

export function openingsFailureCount(): number {
  return count;
}

/** Tests only. */
export function resetOpeningsFailures(): void {
  count = 0;
}
```

`src/lib/careers-pure.ts`:

```ts
// Client-safe, no `server-only`, no fetch: the public-opening contract as the Operations
// careers-public module emits it (`shapePublicOpening`, careers-public.service.ts) and the
// pure helpers both careers pages and their tests share. The fetch lives in ./careers.ts.
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';
import { formatTRY } from '@/lib/format/money';

/** The reserved ISR tag (spec §3.1) and the time floor for openings (ARCHITECTURE § Freshness). */
export const OPENINGS_TAG = 'openings';
export const OPENINGS_REVALIDATE_SECONDS = 300;
/** `QueryPublicOpeningsDto` caps `limit` at 50; five pages is more than JobsAdmire will ever
 *  list at once and bounds a runaway `totalPages`. */
export const OPENINGS_PAGE_LIMIT = 50;
export const OPENINGS_MAX_PAGES = 5;
/** The API carries no `isNew`; a role posted within this many days wears the design's badge. */
export const NEW_WITHIN_DAYS = 14;
/** The Operations candidate portal (D15: token-bearing pages stay there). Not a Settings field
 *  in the frozen contract (recorded as a foundation gap); a public host, not a secret. */
export const OPS_CAREERS_PORTAL = 'https://operations.jobsadmire.com';
/** W56: `Opening.portfolioRequired` still needs a portfolio *document* the website door cannot
 *  carry, so those openings apply by e-mail (W3). Flip to `true` when the Ops gate accepts
 *  `portfolioUrl` — the form already sends it. */
export const PORTFOLIO_GATE_RELAXED = false;

export const OPENING_CATEGORIES = [
  'FULL_TIME',
  'FREELANCER',
  'PROJECT_BASED',
  'COUNTRY_REPRESENTATIVE',
] as const;
export type OpeningCategory = (typeof OPENING_CATEGORIES)[number];
export const WORK_MODES = ['REMOTE', 'HYBRID', 'ON_SITE'] as const;
export type WorkMode = (typeof WORK_MODES)[number];
export const SALARY_PERIODS = ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'] as const;
export type SalaryPeriod = (typeof SALARY_PERIODS)[number];
export const SALARY_PAY_TYPES = ['RANGE', 'STARTING', 'MAXIMUM', 'EXACT'] as const;

/** Prisma returns `null`, older rows may omit a key: both read as `null` here. */
const nullableString = z
  .string()
  .nullish()
  .transform((v) => v ?? null);
const nullableEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .enum(values)
    .nullish()
    .transform((v) => v ?? null);
/** Decimals arrive as strings (`salaryMin?.toString()`). */
const decimalString = z
  .string()
  .regex(/^-?\d+(\.\d+)?$/)
  .nullish()
  .transform((v) => v ?? null);

export const PublicOpeningSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/), // the door's `openingSlug` pattern — a slug it would refuse is not an opening
  title: z.string().min(1),
  country: z.string().min(2).max(100), // Country.code (ISO-2 upper-case in practice; W40)
  city: nullableString,
  cities: z.array(z.string()).default([]),
  category: z.enum(OPENING_CATEGORIES),
  employmentArrangement: nullableString,
  employmentArrangements: z.array(z.string()).default([]),
  workMode: nullableEnum(WORK_MODES),
  workModes: z.array(z.enum(WORK_MODES)).default([]),
  description: nullableString,
  salaryMin: decimalString,
  salaryMax: decimalString,
  salaryCurrency: nullableString,
  salaryPayType: nullableEnum(SALARY_PAY_TYPES),
  salaryPeriod: nullableEnum(SALARY_PERIODS),
  salaryVisible: z.boolean(),
  payCurrency: nullableString,
  portfolioRequired: z.boolean(),
  requiredLanguage: nullableString,
  requiredLanguages: z.array(z.string()).default([]),
  postedAt: z.string().datetime({ offset: true }),
});
export type PublicOpening = z.infer<typeof PublicOpeningSchema>;

export const OpeningsListSchema = z.object({
  data: z.array(PublicOpeningSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});
export const OpeningDetailSchema = z.object({ data: PublicOpeningSchema });

/** The design's "Where" axis: Türkiye = the Antalya office, anywhere else = overseas. */
export type Place = 'office' | 'overseas';
export const placeOf = (o: Pick<PublicOpening, 'country'>): Place =>
  o.country.toUpperCase() === 'TR' ? 'office' : 'overseas';

/** The design's "Engagement" axis over the API's four categories. */
export type Engagement = 'fullTime' | 'partTime' | 'project';
export const engagementOf = (category: OpeningCategory): Engagement =>
  category === 'PROJECT_BASED' ? 'project' : category === 'FREELANCER' ? 'partTime' : 'fullTime';

/** schema.org JobPosting `employmentType` per category (Google's enum). */
export const JOB_POSTING_EMPLOYMENT_TYPE: Record<
  OpeningCategory,
  'FULL_TIME' | 'CONTRACTOR' | 'TEMPORARY'
> = {
  FULL_TIME: 'FULL_TIME',
  FREELANCER: 'CONTRACTOR',
  PROJECT_BASED: 'TEMPORARY',
  COUNTRY_REPRESENTATIVE: 'CONTRACTOR',
};

export function isNewOpening(postedAt: string, now: Date = new Date(), days = NEW_WITHIN_DAYS): boolean {
  const t = Date.parse(postedAt);
  if (Number.isNaN(t)) return false;
  return now.getTime() - t <= days * 24 * 60 * 60 * 1000;
}

const normaliseLines = (text: string) => text.replace(/\r\n?/g, '\n');
const BULLET = /^\s*[-*•]\s+/;

/** The first paragraph, cut at a word boundary to `max` characters (plus the ellipsis). */
export function summaryOf(description: string | null, max = 160): string {
  if (!description) return '';
  const first =
    normaliseLines(description)
      .split(/\n\s*\n/)
      .map((p) => p.replace(BULLET, '').replace(/\s+/g, ' ').trim())
      .find((p) => p.length > 0) ?? '';
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return `${(at > max / 2 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

export type DescriptionBlock = { type: 'p'; text: string } | { type: 'ul'; items: string[] };

/** The opening's single description (requirements were folded into it in Operations) as
 *  paragraphs and bullet lists — text only, never HTML. */
export function descriptionBlocks(text: string | null): DescriptionBlock[] {
  if (!text) return [];
  const out: DescriptionBlock[] = [];
  for (const line of normaliseLines(text).split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (BULLET.test(line)) {
      const item = line.replace(BULLET, '').trim();
      const last = out[out.length - 1];
      if (last?.type === 'ul') last.items.push(item);
      else out.push({ type: 'ul', items: [item] });
    } else {
      out.push({ type: 'p', text: trimmed });
    }
  }
  return out;
}

/** The `countries` collection first (locale-resolved), Intl's region name second, the code last. */
export function countryNameOf(
  code: string,
  countries: ReadonlyArray<{ code: string; name: string }>,
  locale: Locale,
): string {
  const upper = code.toUpperCase();
  const row = countries.find((c) => c.code.toUpperCase() === upper);
  if (row) return row.name;
  try {
    const name = new Intl.DisplayNames([locale], { type: 'region' }).of(upper);
    if (name && name !== upper) return name;
  } catch {
    /* an unknown code — fall through */
  }
  return upper;
}

export function locationOf(
  o: Pick<PublicOpening, 'city' | 'cities'>,
  countryName: string,
): string {
  const cities = o.cities.length ? o.cities.join(', ') : (o.city ?? '');
  return [cities, countryName].filter((s) => s.length > 0).join(' · ');
}

export type SalaryParts = {
  kind: 'range' | 'from' | 'upTo' | 'exact';
  min: number | null;
  max: number | null;
  currency: string;
  period: SalaryPeriod | null;
};

/** Null unless the opening shows its pay (Operations strips the numbers when hidden). */
export function salaryPartsOf(
  o: Pick<
    PublicOpening,
    'salaryVisible' | 'salaryMin' | 'salaryMax' | 'salaryCurrency' | 'salaryPayType' | 'salaryPeriod'
  >,
): SalaryParts | null {
  if (!o.salaryVisible || !o.salaryCurrency) return null;
  const min = o.salaryMin === null ? null : Number(o.salaryMin);
  const max = o.salaryMax === null ? null : Number(o.salaryMax);
  if (min === null && max === null) return null;
  const base = { min, max, currency: o.salaryCurrency, period: o.salaryPeriod };
  switch (o.salaryPayType) {
    case 'EXACT':
      return { ...base, kind: 'exact', min: min ?? max, max: max ?? min };
    case 'STARTING':
      return { ...base, kind: 'from' };
    case 'MAXIMUM':
      return { ...base, kind: 'upTo' };
    case 'RANGE':
      return { ...base, kind: min !== null && max !== null ? 'range' : min !== null ? 'from' : 'upTo' };
    default:
      return { ...base, kind: min !== null && max !== null ? 'range' : min !== null ? 'from' : 'upTo' };
  }
}

const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' };

/** D18 for lira; Intl's currency style for everything else (whole units). */
export function formatMoney(amount: number, currency: string, locale: Locale): string {
  if (currency.toUpperCase() === 'TRY') return formatTRY(amount, locale);
  try {
    return new Intl.NumberFormat(INTL[locale], {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  } catch {
    return `${currency.toUpperCase()} ${new Intl.NumberFormat(INTL[locale], { maximumFractionDigits: 0 }).format(Math.round(amount))}`;
  }
}

const UNIT_TEXT: Partial<Record<SalaryPeriod, 'HOUR' | 'MONTH' | 'YEAR'>> = {
  HOUR: 'HOUR',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
};

/** JobPosting `baseSalary` — only for the periods schema.org's `unitText` names; DAY/WEEK or
 *  a hidden salary → no node (never a guessed figure, D17). */
export function baseSalaryOf(
  o: Parameters<typeof salaryPartsOf>[0],
):
  | { currency: string; value: number | { min: number; max: number }; unitText: 'HOUR' | 'MONTH' | 'YEAR' }
  | undefined {
  const parts = salaryPartsOf(o);
  if (!parts || !parts.period) return undefined;
  const unitText = UNIT_TEXT[parts.period];
  if (!unitText) return undefined;
  if (parts.kind === 'range' && parts.min !== null && parts.max !== null)
    return { currency: parts.currency, value: { min: parts.min, max: parts.max }, unitText };
  const single = parts.min ?? parts.max;
  if (single === null) return undefined;
  return { currency: parts.currency, value: single, unitText };
}

export const opsCareersUrl = (locale: Locale) => `${OPS_CAREERS_PORTAL}/${locale}/careers`;
```

`src/lib/careers.ts`:

```ts
import 'server-only';
import { cache } from 'react';
import { recordOpeningsFailure } from '@/app/api/site-health/openings';
import { doorBase } from '@/forms/env';
import {
  OpeningDetailSchema,
  OpeningsListSchema,
  OPENINGS_MAX_PAGES,
  OPENINGS_PAGE_LIMIT,
  OPENINGS_REVALIDATE_SECONDS,
  OPENINGS_TAG,
  type PublicOpening,
} from './careers-pure';

/** The public careers API answered with something other than an opening or a 404. The list
 *  swallows it (empty state, W6); the detail lets it reach the `(site)` error boundary so ISR
 *  keeps serving the last-good page instead of a false 404 (docs/INTEGRATIONS.md I6). */
export class OpeningsUnavailableError extends Error {}

/** Tests only. */
export type CareersDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv };

const SLUG = /^[a-z0-9-]{1,200}$/;
// The reserved tag + the 300 s floor on every openings fetch (ARCHITECTURE § Freshness).
const ISR = { next: { tags: [OPENINGS_TAG], revalidate: OPENINGS_REVALIDATE_SECONDS } } as const;
const HEADERS = { accept: 'application/json' } as const;

const describe = (err: unknown) => (err instanceof Error ? err.message : String(err));

export async function listOpeningsUncached(deps: CareersDeps = {}): Promise<PublicOpening[]> {
  const base = doorBase(deps.env);
  // No door in this environment (a preview, a local build): an empty list is the truth, not a failure.
  if (!base) return [];
  const f = deps.fetch ?? fetch;
  const out: PublicOpening[] = [];
  try {
    let page = 1;
    let totalPages = 1;
    do {
      const res = await f(
        `${base}/api/careers/openings?page=${page}&limit=${OPENINGS_PAGE_LIMIT}`,
        { ...ISR, headers: HEADERS },
      );
      if (!res.ok) throw new OpeningsUnavailableError(`openings list: HTTP ${res.status}`);
      const parsed = OpeningsListSchema.safeParse(await res.json());
      if (!parsed.success)
        throw new OpeningsUnavailableError(
          `openings list: contract violation ${parsed.error.issues[0]?.path.join('.')}`,
        );
      out.push(...parsed.data.data);
      totalPages = parsed.data.meta.totalPages;
      page += 1;
    } while (page <= totalPages && page <= OPENINGS_MAX_PAGES);
    return out;
  } catch (err) {
    recordOpeningsFailure();
    console.error('[careers] openings list unavailable', { message: describe(err) });
    return [];
  }
}

export async function getOpeningUncached(
  slug: string,
  deps: CareersDeps = {},
): Promise<PublicOpening | null> {
  if (!SLUG.test(slug)) return null;
  const base = doorBase(deps.env);
  if (!base) return null;
  const f = deps.fetch ?? fetch;
  let res: Response;
  try {
    res = await f(`${base}/api/careers/openings/${encodeURIComponent(slug)}`, {
      ...ISR,
      headers: HEADERS,
    });
  } catch (err) {
    recordOpeningsFailure();
    throw new OpeningsUnavailableError(`opening ${slug}: ${describe(err)}`);
  }
  if (res.status === 404) return null;
  if (!res.ok) {
    recordOpeningsFailure();
    throw new OpeningsUnavailableError(`opening ${slug}: HTTP ${res.status}`);
  }
  const parsed = OpeningDetailSchema.safeParse(await res.json().catch(() => null));
  if (!parsed.success) {
    recordOpeningsFailure();
    throw new OpeningsUnavailableError(`opening ${slug}: contract violation`);
  }
  return parsed.data.data;
}

/** One list per request (React cache) — the index, its metadata, `generateStaticParams` and
 *  the sitemap source share it; Next's fetch cache dedupes across requests under the tag. */
export const listOpenings = cache((): Promise<PublicOpening[]> => listOpeningsUncached());
export const getOpening = cache((slug: string): Promise<PublicOpening | null> => getOpeningUncached(slug));
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write src/lib src/app/api/site-health` then `npx vitest run src/lib/__tests__` → 2 files, 22 tests green. `npm run verify` → green (`careers.ts` is `server-only` — the Vitest alias from Task 2 stands in; `react`'s `cache` is a passthrough outside RSC).

- [ ] **Step 5: Commit**

```
feat(careers): openings data layer — public-opening schema, pure helpers, tagged server fetch, site-health failure counter

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 2 — index skeleton: metadata, hero, notice band, the `sys.careers.*` copy, gate registration

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/careers/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

const flatten = (o: unknown, prefix = ''): string[] =>
  typeof o === 'object' && o !== null
    ? Object.entries(o).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k))
    : [prefix];

/** The full `sys.careers.*` / `sys.seo.careers*.*` set this task adds (W9/W23). */
const EXPECTED = [
  'seo.careers.title',
  'seo.careers.description',
  'seo.careersDetail.title',
  'seo.careersDetail.description',
  'careers.hero.seeOpenings',
  'careers.filters.all',
  'careers.roles.resultAll',
  'careers.roles.resultFiltered',
  'careers.roles.showMore',
  'careers.roles.posted',
  'careers.category.freelancer',
  'careers.workMode.REMOTE',
  'careers.workMode.HYBRID',
  'careers.workMode.ON_SITE',
  'careers.salary.range',
  'careers.salary.from',
  'careers.salary.upTo',
  'careers.salary.per.HOUR',
  'careers.salary.per.DAY',
  'careers.salary.per.WEEK',
  'careers.salary.per.MONTH',
  'careers.salary.per.YEAR',
  'careers.empty.title',
  'careers.empty.body',
  'careers.detail.back',
  'careers.detail.about',
  'careers.detail.applyLead',
  'careers.detail.whatsappIntro',
  'careers.detail.facts.title',
  'careers.detail.facts.country',
  'careers.detail.facts.city',
  'careers.detail.facts.workMode',
  'careers.detail.facts.languages',
  'careers.detail.facts.salary',
  'careers.detail.facts.posted',
  'careers.detail.facts.portfolio',
  'careers.form.residency',
  'careers.form.expectedSalaryHint',
  'careers.form.closed',
  'careers.form.portfolioGate',
  'careers.emailPanel.title',
  'careers.emailPanel.body',
  'careers.emailPanel.subject',
  'careers.emailPanel.email',
  'careers.apply.whatsapp',
  'careers.apply.emailSubject',
];

describe('sys.careers.* (W9/W23)', () => {
  it('both message files carry exactly the same careers key set', () => {
    const only = (keys: string[]) =>
      keys.filter((k) => k.startsWith('careers.') || k.startsWith('seo.careers')).sort();
    const enKeys = only(flatten(en.sys));
    expect(enKeys).toEqual(only(flatten(tr.sys)));
    expect(enKeys).toEqual([...EXPECTED].sort());
  });

  it('every value is non-empty and the ICU keys carry their arguments in both locales', () => {
    const get = (m: typeof en, path: string) =>
      path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], m.sys) as string;
    for (const key of EXPECTED) {
      expect(get(en, key), `en ${key}`).toMatch(/\S/);
      expect(get(tr, key), `tr ${key}`).toMatch(/\S/);
    }
    for (const m of [en, tr]) {
      expect(get(m, 'careers.hero.seeOpenings')).toContain('{count, plural,');
      expect(get(m, 'careers.roles.resultAll')).toContain('{count, plural,');
      expect(get(m, 'careers.roles.showMore')).toContain('{count, plural,');
      expect(get(m, 'careers.roles.resultFiltered')).toMatch(/\{shown\}.*\{total\}|\{total\}.*\{shown\}/);
      expect(get(m, 'careers.roles.posted')).toContain('{date}');
      expect(get(m, 'careers.form.residency')).toContain('{country}');
      expect(get(m, 'careers.form.expectedSalaryHint')).toContain('{currency}');
      expect(get(m, 'careers.emailPanel.body')).toContain('{email}');
      expect(get(m, 'careers.emailPanel.subject')).toContain('{title}');
      expect(get(m, 'careers.detail.whatsappIntro')).toContain('{title}');
      expect(get(m, 'seo.careersDetail.title')).toContain('{title}');
      expect(get(m, 'seo.careersDetail.description')).toContain('{title}');
    }
  });
});
```

`src/lib/seo/unbuilt.test.ts` (Task 4's walker) is the second red test of this cycle: once `careers/page.tsx` exists, it fails until `'/careers'` leaves `UNBUILT_PATHNAMES`.

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/[locale]/(site)/careers"` → the key test fails (`careers.*` keys absent in both files).

- [ ] **Step 3: Implement**

`src/messages/en.json` — inside the existing `"seo": { "ogTagline": … }` object add:

```json
"careers": {
  "title": "Careers at JobsAdmire — roles in Antalya and in our source countries",
  "description": "Open roles inside JobsAdmire: country representatives, sourcing coordinators, trade-test assessors and the Antalya office team. Every application gets an answer."
},
"careersDetail": {
  "title": "{title} — JobsAdmire careers",
  "description": "{title} in {location}. Read the role and apply online — a PDF CV, a few minutes, and an answer to every application."
}
```

and, as a new top-level block inside `"sys"` (after `"thankYou"`):

```json
"careers": {
  "hero": {
    "seeOpenings": "{count, plural, =0 {See our roles} one {See # open position} other {See # open positions}}"
  },
  "filters": { "all": "All" },
  "roles": {
    "resultAll": "{count, plural, one {Showing the only open role} other {Showing all # open roles}}",
    "resultFiltered": "Showing {shown} of {total} matching roles",
    "showMore": "{count, plural, one {Show # more role} other {Show # more roles}}",
    "posted": "Posted {date}"
  },
  "category": { "freelancer": "Freelance" },
  "workMode": { "REMOTE": "Remote", "HYBRID": "Hybrid", "ON_SITE": "On site" },
  "salary": {
    "range": "{min} – {max}",
    "from": "from {amount}",
    "upTo": "up to {amount}",
    "per": { "HOUR": "per hour", "DAY": "per day", "WEEK": "per week", "MONTH": "per month", "YEAR": "per year" }
  },
  "empty": {
    "title": "No open roles right now",
    "body": "Every role is published here first. Leave your name on file — WhatsApp or e-mail below — and we write the moment a market opens."
  },
  "detail": {
    "back": "All open roles",
    "about": "About the role",
    "applyLead": "A few minutes. A PDF CV is required, and every application gets an answer.",
    "whatsappIntro": "Hello JobsAdmire, I would like to apply for the {title} role ({slug}).",
    "facts": {
      "title": "At a glance",
      "country": "Country",
      "city": "City",
      "workMode": "Work mode",
      "languages": "Languages",
      "salary": "Pay",
      "posted": "Posted",
      "portfolio": "Portfolio required"
    }
  },
  "form": {
    "residency": "This role is open to residents of {country} only.",
    "expectedSalaryHint": "Monthly, in {currency}, whole numbers. Required for roles in Pakistan.",
    "closed": "This role is no longer accepting applications.",
    "portfolioGate": "This role needs a portfolio document, which the online form cannot carry yet — please apply by e-mail."
  },
  "emailPanel": {
    "title": "Apply by e-mail",
    "body": "This role asks for a portfolio. Send your PDF CV and a portfolio link or file to {email} with the subject below, or write to us on WhatsApp.",
    "subject": "Application: {title} ({slug})",
    "email": "Write an e-mail"
  },
  "apply": {
    "whatsapp": "Apply on WhatsApp",
    "emailSubject": "Open application"
  }
}
```

`src/messages/tr.json` — the same keys (formal "siz", marketing register):

```json
"careers": {
  "title": "JobsAdmire'da kariyer — Antalya'da ve kaynak ülkelerimizde pozisyonlar",
  "description": "JobsAdmire içindeki açık pozisyonlar: ülke temsilcileri, tedarik koordinatörleri, meslek testi değerlendiricileri ve Antalya ofis ekibi. Her başvuru yanıt alır."
},
"careersDetail": {
  "title": "{title} — JobsAdmire kariyer",
  "description": "{location} için {title}. Pozisyonu okuyun ve çevrimiçi başvurun — PDF CV, birkaç dakika ve her başvuruya yanıt."
}
```

```json
"careers": {
  "hero": {
    "seeOpenings": "{count, plural, =0 {Pozisyonlarımızı görün} other {# açık pozisyonu görün}}"
  },
  "filters": { "all": "Tümü" },
  "roles": {
    "resultAll": "{count, plural, one {Tek açık pozisyon gösteriliyor} other {Tüm # açık pozisyon gösteriliyor}}",
    "resultFiltered": "{total} eşleşen pozisyondan {shown} tanesi gösteriliyor",
    "showMore": "{count, plural, other {# pozisyon daha göster}}",
    "posted": "{date} tarihinde yayınlandı"
  },
  "category": { "freelancer": "Serbest çalışma" },
  "workMode": { "REMOTE": "Uzaktan", "HYBRID": "Hibrit", "ON_SITE": "Yerinde" },
  "salary": {
    "range": "{min} – {max}",
    "from": "{amount} itibaren",
    "upTo": "en fazla {amount}",
    "per": { "HOUR": "saatlik", "DAY": "günlük", "WEEK": "haftalık", "MONTH": "aylık", "YEAR": "yıllık" }
  },
  "empty": {
    "title": "Şu anda açık pozisyon yok",
    "body": "Her pozisyon önce burada yayınlanır. Adınızı kaydımıza bırakın — aşağıdan WhatsApp ya da e-posta ile — bir pazar açıldığı anda size yazarız."
  },
  "detail": {
    "back": "Tüm açık pozisyonlar",
    "about": "Pozisyon hakkında",
    "applyLead": "Birkaç dakika sürer. PDF CV zorunludur ve her başvuru yanıt alır.",
    "whatsappIntro": "Merhaba JobsAdmire, {title} pozisyonuna ({slug}) başvurmak istiyorum.",
    "facts": {
      "title": "Bir bakışta",
      "country": "Ülke",
      "city": "Şehir",
      "workMode": "Çalışma düzeni",
      "languages": "Diller",
      "salary": "Ücret",
      "posted": "Yayın tarihi",
      "portfolio": "Portföy gerekli"
    }
  },
  "form": {
    "residency": "Bu pozisyon yalnızca {country} sakinlerine açıktır.",
    "expectedSalaryHint": "Aylık, {currency} olarak, tam sayı. Pakistan'daki pozisyonlar için zorunludur.",
    "closed": "Bu pozisyon artık başvuru kabul etmiyor.",
    "portfolioGate": "Bu pozisyon bir portföy belgesi gerektiriyor; çevrimiçi form bunu henüz taşıyamıyor — lütfen e-posta ile başvurun."
  },
  "emailPanel": {
    "title": "E-posta ile başvurun",
    "body": "Bu pozisyon portföy istiyor. PDF CV'nizi ve bir portföy bağlantısı ya da dosyasını aşağıdaki konu satırıyla {email} adresine gönderin ya da bize WhatsApp'tan yazın.",
    "subject": "Başvuru: {title} ({slug})",
    "email": "E-posta yazın"
  },
  "apply": {
    "whatsapp": "WhatsApp'tan başvurun",
    "emailSubject": "Açık başvuru"
  }
}
```

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` initialiser delete the line `'/careers',` (only that one now: `'/careers/[slug]',` leaves in cycle 5 with the detail page, so Task 4's walker test is green at every commit).

`e2e/routes.ts` — inside `GATE_ROUTE_TABLE`, after `{ path: '/en/hire-workers', indexable: true },` and after any rows earlier page tasks appended, add:

```ts
  { path: '/kariyer', indexable: true },
  { path: '/en/careers', indexable: true },
```

(The detail route is not a gate row: a preview has no opening to point it at; `npm run e2e:careers` — cycle 6 — covers it against the mock door, and T15 adds a real slug once staging lists one.)

`src/app/[locale]/(site)/careers/page.tsx` — the skeleton (hero + notice band; the remaining sections arrive in cycles 3–4 and are wired here as they land):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { isFlagCode } from '@/design/assets/flag-codes';
import { Breadcrumbs } from '@/design/blocks';
import { Flag } from '@/design/Flag';
import { Section, buttonClassName } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { listOpenings } from '@/lib/careers';
import { placeOf } from '@/lib/careers-pure';
import { buildMetadata } from '@/lib/seo/metadata';

export const revalidate = 300; // the openings floor (ARCHITECTURE § Freshness); the bundle's own 900 s tag stays

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  // The `careers` page record has titleId '' (the package ships no SEO string for it) → the
  // sys.seo.careers.* fallbacks are what renders (W38).
  return buildMetadata({
    locale,
    href: '/careers',
    bundle,
    pageKey: 'careers',
    fallbackTitle: sys('seo.careers.title'),
    fallbackDescription: sys('seo.careers.description'),
  });
}

/** A tick before each hero trust chip (design: green check icon). */
function Tick() {
  return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-success">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default async function CareersIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys, openings] = await Promise.all([
    getBundle(locale),
    getTranslations('sys'),
    listOpenings(),
  ]);
  const t = makeTf(bundle, locale);
  const overseas = openings.filter((o) => placeOf(o) === 'overseas');
  const sourceCountries = getCollection(bundle, 'sourceCountries');

  return (
    <>
      {/* ── Hero (dark, text-only — the h1 is the LCP element, D26) ─────────────────────── */}
      <Section
        tone="dark"
        className="relative overflow-hidden bg-[linear-gradient(158deg,#253063_0%,#1c2652_50%,#131c40_100%)] !pb-0"
      >
        <div className="container-site relative">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            items={[
              { name: t('jt.021'), href: '/' },
              { name: t('jt.005'), href: '/careers' },
            ]}
          />
          <div className="grid items-center gap-8 pb-10 pt-6 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
            <div>
              {/* The live-count pill: computed from the list (W1); hidden when nothing is open (W6). */}
              {openings.length > 0 && (
                <p
                  data-testid="careers-hiring-count"
                  className="mb-5 inline-flex items-center gap-2 rounded-pill border border-success/40 bg-success/15 px-4 py-1.5 text-body-sm font-extrabold text-[#86efac]"
                >
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success" />
                  {openings.length} {t('jt.287')}
                </p>
              )}
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="text-h1 leading-[1.02] tracking-[-0.03em] text-white"
              >
                {t('jt.022')}
                <br />
                <span className="text-sky">{t('jt.023')}</span>
              </h1>
              <p className="mt-5 max-w-[520px] text-body-lg text-[#c1cbe6]">{t('jt.024')}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#roles" className={buttonClassName('primary', 'lg')}>
                  {sys('careers.hero.seeOpenings', { count: openings.length })}
                </a>
                <a href="#apply" className={buttonClassName('inverse', 'lg')}>
                  {t('jt.026')}
                </a>
              </div>
              <ul className="mt-7 flex flex-col gap-2 text-body-sm font-bold text-[#a9b5d8] sm:flex-row sm:flex-wrap sm:gap-x-6">
                <li className="inline-flex items-center gap-2"><Tick />{t('jt.027')}</li>
                <li className="inline-flex items-center gap-2"><Tick />{t('jt.028')}</li>
                <li className="inline-flex items-center gap-2"><Tick />{t('jt.029')}</li>
              </ul>
            </div>
            {/* Cycle 3 mounts <HeroRoleCard> here. */}
            <div data-slot="hero-role-card" />
          </div>
          {/* Countries we work in — the ONE source-country list (D17/W1), never jt.289–301. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/15 py-6">
            <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[0.11em] text-[#8b98c4]">
              {t('jt.036')}
            </p>
            <ul className="m-0 flex flex-1 flex-wrap gap-2 p-0" aria-label={t('jt.036')}>
              {sourceCountries.map((c) => (
                <li
                  key={c.code}
                  className="inline-flex items-center gap-2 rounded-[9px] border border-white/20 bg-white/10 px-3 py-1.5 text-body-sm font-extrabold text-[#dbe3f5]"
                >
                  {isFlagCode(c.code) && <Flag code={c.code} size={16} />}
                  {c.name}
                </li>
              ))}
            </ul>
            <p className="m-0 text-body-sm font-bold text-[#8b98c4]">{t('jt.037')}</p>
          </div>
        </div>
      </Section>

      {/* ── Worker notice band (jt.043 is legal — verbatim) ───────────────────────────────── */}
      <div
        data-testid="careers-notice"
        className="border-b border-warning-border bg-warning-surface px-0 py-4"
      >
        <div className="container-site flex flex-wrap items-center gap-3 text-body-sm text-text-secondary">
          <span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] bg-[#fef3c7] text-warning-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
          </span>
          <p className="m-0 min-w-[280px] flex-1">
            <strong className="text-ink">{t('jt.038')}</strong> {t('jt.039')} <em>{t('jt.040')}</em>{' '}
            {t('jt.041')}{' '}
            <Link href="/partner-with-us" className="font-extrabold text-blue-safe">
              {t('jt.042')}
            </Link>
            {t('jt.043')}
          </p>
        </div>
      </div>

      {/* Cycles 3–4 append: <RolesSection>, <WaysCards>, <HiringSteps>, <OpenApplication>, FAQ. */}
    </>
  );
}
```

Notes: `!pb-0` — the hero's countries strip is its own bottom edge (the design's hero has no bottom padding under the strip); `Section` keeps `py-16` otherwise. `buttonClassName('inverse', 'lg')` is Task 5's translucent white outline for navy bands. The notice's `jt.039`/`jt.040`/`jt.041`/`jt.043` are the package's own split sentence (W23 allows composing what the package itself splits); in TR `jt.040` carries the verb and `jt.043` starts with the period the package authored.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/careers" src/messages e2e/routes.ts src/lib/seo/routes.ts` → `npx vitest run "src/app/[locale]/(site)/careers" src/lib/seo/unbuilt.test.ts src/messages` → the key test and the walker green (`'/careers'` is built, `'/careers/[slug]'` still listed as unbuilt). `npm run verify` green. `npm run build` then `npm run start` → `curl -s localhost:3000/kariyer | grep -c 'data-testid="page-h1"'` → 1; `/en/careers` likewise; no opening (no door) → no count pill, the "See our roles" CTA.

- [ ] **Step 5: Commit**

```
feat(careers): index skeleton — metadata, dark hero with the live count and the source-country chips, worker notice; sys.careers copy; gate rows

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 3 — the roles: view model, hero role card, the filterable list island, the W6 empty state

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/careers/__tests__/view-model.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { OPENING } from '@/lib/__tests__/careers-pure.test';
import { roleCards, type RoleLabels } from '../_lib/view-model';

const labels: RoleLabels = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  project: 'Project-based',
  category: {
    FULL_TIME: 'Full-time',
    FREELANCER: 'Freelance',
    PROJECT_BASED: 'Project-based',
    COUNTRY_REPRESENTATIVE: 'Country Representative',
  },
  askIntro: 'Hello JobsAdmire, I have a question about the',
  askTail: 'role (',
};
const countries = [
  { code: 'UZ', name: 'Uzbekistan', dial: '+998' },
  { code: 'TR', name: 'Türkiye', dial: '+90' },
];
const now = new Date('2026-09-20T00:00:00Z');

describe('roleCards', () => {
  it('maps an opening onto the strings the island renders — no bundle, no Date, no function crosses', () => {
    const [card] = roleCards([OPENING], {
      locale: 'en',
      countries,
      labels,
      whatsappNumber: '905011240340',
      now,
    });
    expect(card).toEqual({
      slug: OPENING.slug,
      title: OPENING.title,
      summary: 'Own our whole pipeline in Uzbekistan — partners, candidates and quality.',
      location: 'Tashkent · Uzbekistan',
      team: 'Country Representative',
      place: 'overseas',
      engagement: 'fullTime',
      engagementLabel: 'Full-time',
      isNew: true,
      postedLabel: '15 September 2026',
      href: { pathname: '/careers/[slug]', params: { slug: OPENING.slug } },
      askHref: `https://wa.me/905011240340?text=${encodeURIComponent(
        'Hello JobsAdmire, I have a question about the Country Representative — Uzbekistan role (Tashkent · Uzbekistan)',
      )}`,
    });
    expect(JSON.parse(JSON.stringify(card))).toEqual(card); // serialisable across the RSC boundary
  });

  it('an Antalya role is "office", a freelance one "partTime", an old one not new; TR dates', () => {
    const [office] = roleCards(
      [{ ...OPENING, country: 'TR', city: 'Antalya', cities: ['Antalya'], category: 'FREELANCER', postedAt: '2026-07-01T00:00:00Z' }],
      { locale: 'tr', countries, labels, whatsappNumber: '905011240340', now },
    );
    expect(office.place).toBe('office');
    expect(office.engagement).toBe('partTime');
    expect(office.team).toBe('Freelance');
    expect(office.isNew).toBe(false);
    expect(office.location).toBe('Antalya · Türkiye');
    expect(office.postedLabel).toBe('1 Temmuz 2026');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/[locale]/(site)/careers/__tests__/view-model.test.ts"` → `Cannot find module '../_lib/view-model'`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/careers/_lib/view-model.ts` (server/test only — it imports `formatDate`, which imports both message files):

```ts
import type { Locale } from '@/i18n/routing';
import {
  countryNameOf,
  engagementOf,
  isNewOpening,
  locationOf,
  placeOf,
  summaryOf,
  type Engagement,
  type OpeningCategory,
  type Place,
  type PublicOpening,
} from '@/lib/careers-pure';
import { waLink } from '@/lib/contact';
import { formatDate } from '@/lib/format/date';

/** Everything the `RolesList` island needs, already resolved: plain strings and one typed href
 *  per card. No bundle, no `Date`, no function crosses the server→client boundary (D6). */
export type RoleCard = {
  slug: string;
  title: string;
  summary: string;
  location: string;
  team: string;
  place: Place;
  engagement: Engagement;
  engagementLabel: string;
  isNew: boolean;
  postedLabel: string;
  href: { pathname: '/careers/[slug]'; params: { slug: string } };
  askHref: string;
};

export type RoleLabels = {
  fullTime: string; // jt.099
  partTime: string; // jt.100
  project: string; // jt.073
  category: Record<OpeningCategory, string>; // jt.099 / sys.careers.category.freelancer / jt.073 / jt.143
  askIntro: string; // jt.311
  askTail: string; // jt.312
};

export function roleCards(
  openings: readonly PublicOpening[],
  ctx: {
    locale: Locale;
    countries: ReadonlyArray<{ code: string; name: string }>;
    labels: RoleLabels;
    whatsappNumber: string;
    now?: Date;
  },
): RoleCard[] {
  const { locale, countries, labels, whatsappNumber } = ctx;
  const now = ctx.now ?? new Date();
  const engagementLabel: Record<Engagement, string> = {
    fullTime: labels.fullTime,
    partTime: labels.partTime,
    project: labels.project,
  };
  return openings.map((o) => {
    const location = locationOf(o, countryNameOf(o.country, countries, locale));
    const engagement = engagementOf(o.category);
    return {
      slug: o.slug,
      title: o.title,
      summary: summaryOf(o.description),
      location,
      team: labels.category[o.category],
      place: placeOf(o),
      engagement,
      engagementLabel: engagementLabel[engagement],
      isNew: isNewOpening(o.postedAt, now),
      postedLabel: formatDate(o.postedAt, locale),
      href: { pathname: '/careers/[slug]', params: { slug: o.slug } },
      // jt.311 + title + jt.312 + location + ')' — the package's own split (W23).
      askHref: waLink(whatsappNumber, `${labels.askIntro} ${o.title} ${labels.askTail}${location})`),
    };
  });
}
```

`src/app/[locale]/(site)/careers/_components/HeroRoleCard.tsx` (server component; `null` when no overseas opening — W6):

```tsx
import { Link } from '@/i18n/navigation';
import type { RoleCard } from '../_lib/view-model';

export function HeroRoleCard({
  cards,
  labels,
}: {
  cards: RoleCard[];
  labels: { title: string; lead: string; live: string; newBadge: string; footer: string; all: string };
}) {
  const overseas = cards.filter((c) => c.place === 'overseas').slice(0, 4);
  if (overseas.length === 0) return null;
  return (
    <aside
      data-testid="careers-hero-roles"
      aria-labelledby="careers-hero-roles-title"
      className="overflow-hidden rounded-lg border border-[#d3e6f2] bg-white text-ink shadow-[0_30px_70px_rgba(6,12,36,0.42)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#1899d5_0%,#1073a8_100%)] px-6 py-5 text-white">
        <div>
          <h2 id="careers-hero-roles-title" className="m-0 text-card-title font-extrabold text-white">
            {labels.title}
          </h2>
          <p className="m-0 mt-1 text-body-sm text-white/85">{labels.lead}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/35 bg-white/20 px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.05em]">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#86efac]" />
          {labels.live}
        </span>
      </div>
      <ul className="m-0 grid gap-2 p-4">
        {overseas.map((c, i) => (
          // The design shows two rows below 461 px (`.ja-jt-rolecard button:nth-child(n+3)` hidden):
          // CSS, not conditional rendering (W10).
          <li key={c.slug} className={i >= 2 ? 'hidden xs:block' : undefined}>
            <Link
              href={c.href}
              className="flex items-center gap-4 rounded-base border border-[#e6f0f7] bg-[#f6fafc] px-5 py-4 no-underline hover:bg-tint"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-body font-extrabold text-ink">{c.title}</span>
                  {c.isNew && (
                    <span className="rounded-pill bg-success-surface px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.05em] text-success-text">
                      {labels.newBadge}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-2 text-body-sm font-bold text-text-tertiary">
                  <span className="truncate">{c.location}</span>
                  <span aria-hidden="true" className="h-1 w-1 flex-none rounded-full bg-[#cbd5e1]" />
                  <span className="flex-none whitespace-nowrap">{c.engagementLabel}</span>
                </span>
              </span>
              <span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-[11px] bg-tint text-blue-safe">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 px-6 pb-5">
        <span className="text-body-sm font-bold text-text-tertiary">{labels.footer}</span>
        <a href="#roles" className="text-body-sm font-extrabold text-blue-safe no-underline hover:text-ink">
          {labels.all}
        </a>
      </div>
    </aside>
  );
}
```

`src/app/[locale]/(site)/careers/_components/RolesList.tsx` (`'use client'` — the one index island; hydrated, never `ssr:false`: the list is SEO-bearing and above the fold on desktop):

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { RadioChips, buttonClassName } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Engagement, Place } from '@/lib/careers-pure';
import type { RoleCard } from '../_lib/view-model';

export type RolesListLabels = {
  where: string; // jt.048
  engagement: string; // jt.049
  office: string; // jt.261
  overseas: string; // jt.262
  fullTime: string; // jt.099
  partTime: string; // jt.100
  project: string; // jt.073
  view: string; // jt.310
  apply: string; // jt.052
  ask: string; // jt.053
  newBadge: string; // jt.033
  showFewer: string; // jt.306
  noMatchTitle: string; // jt.054
  noMatchBody: string; // jt.055
  showAll: string; // jt.056
};

export const INITIAL_SHOWN = 4;

type PlaceFilter = 'all' | Place;
type EngagementFilter = 'all' | Engagement;

export function RolesList({ cards, labels }: { cards: RoleCard[]; labels: RolesListLabels }) {
  const sys = useTranslations('sys');
  const [place, setPlace] = useState<PlaceFilter>('all');
  const [engagement, setEngagement] = useState<EngagementFilter>('all');
  const [expanded, setExpanded] = useState(false);

  const matching = cards.filter(
    (c) => (place === 'all' || c.place === place) && (engagement === 'all' || c.engagement === engagement),
  );
  const filtered = place !== 'all' || engagement !== 'all';
  const shown = expanded ? matching : matching.slice(0, INITIAL_SHOWN);
  const hidden = matching.length - shown.length;

  const resultLabel = filtered
    ? sys('careers.roles.resultFiltered', { shown: shown.length, total: matching.length })
    : sys('careers.roles.resultAll', { count: matching.length });

  const clear = () => {
    setPlace('all');
    setEngagement('all');
  };

  return (
    <div data-testid="careers-roles-list">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-[#e2edf5] bg-white px-5 py-4 shadow-card">
        <RadioChips
          name="place"
          legend={labels.where}
          value={place}
          onChange={(v) => setPlace(v as PlaceFilter)}
          options={[
            { value: 'all', label: sys('careers.filters.all') },
            { value: 'office', label: labels.office },
            { value: 'overseas', label: labels.overseas },
          ]}
        />
        <RadioChips
          name="engagement"
          legend={labels.engagement}
          value={engagement}
          onChange={(v) => setEngagement(v as EngagementFilter)}
          options={[
            { value: 'all', label: sys('careers.filters.all') },
            { value: 'fullTime', label: labels.fullTime },
            { value: 'partTime', label: labels.partTime },
            { value: 'project', label: labels.project },
          ]}
        />
      </div>

      <p role="status" aria-live="polite" className="mb-4 text-body-sm font-extrabold text-text-tertiary">
        {resultLabel}
      </p>

      {matching.length === 0 ? (
        <div
          role="status"
          data-testid="careers-no-match"
          className="rounded-[18px] border-[1.5px] border-dashed border-[#d3e6f2] bg-white p-8 text-center"
        >
          <p className="m-0 text-body-lg font-extrabold text-ink">{labels.noMatchTitle}</p>
          <p className="mx-auto mb-4 mt-2 max-w-[560px] text-body-sm text-text-secondary">{labels.noMatchBody}</p>
          <button type="button" onClick={clear} className={buttonClassName('primary')}>
            {labels.showAll}
          </button>
        </div>
      ) : (
        <ul className="m-0 flex flex-col gap-3 p-0">
          {shown.map((c) => (
            <li key={c.slug}>
              <article
                data-testid="careers-role"
                data-place={c.place}
                data-engagement={c.engagement}
                className="relative overflow-hidden rounded-[18px] border border-[#e2edf5] bg-white shadow-card"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1.5 ${c.place === 'overseas' ? 'bg-[#253063]' : 'bg-blue-safe'}`}
                />
                <div className="flex flex-col gap-4 px-6 py-5 pl-7 md:flex-row md:items-start">
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 flex flex-wrap items-center gap-2 text-card-title font-extrabold text-ink">
                      <Link href={c.href} className="no-underline hover:text-blue-safe">
                        {c.title}
                      </Link>
                      {c.isNew && (
                        <span className="rounded-pill bg-success px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                          {labels.newBadge}
                        </span>
                      )}
                    </h3>
                    {c.summary && <p className="mb-0 mt-1 text-body-sm text-text-tertiary">{c.summary}</p>}
                    <p className="mb-0 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body-sm font-bold text-text-secondary">
                      <span>{c.location}</span>
                      <span>{c.team}</span>
                      <span className="text-text-tertiary">{sys('careers.roles.posted', { date: c.postedLabel })}</span>
                    </p>
                  </div>
                  <div className="flex flex-none flex-wrap items-center gap-2 md:flex-col md:items-end">
                    <span className="rounded-pill bg-tint px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.06em] text-blue-safe">
                      {c.engagementLabel}
                    </span>
                    <span className="flex flex-wrap gap-2">
                      <Link href={c.href} className={buttonClassName('primary')}>
                        {labels.apply}
                      </Link>
                      <ContactLink
                        href={c.askHref}
                        placement="page_cta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClassName('secondary')}
                      >
                        {labels.ask}
                      </ContactLink>
                    </span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {matching.length > INITIAL_SHOWN && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className={buttonClassName('secondary', 'lg')}
          >
            {expanded ? labels.showFewer : sys('careers.roles.showMore', { count: hidden })}
          </button>
        </div>
      )}
    </div>
  );
}
```

Design deltas recorded for the side-by-side review: the design's per-card expand panel (duties/wants) is the detail page — the card links there (the API has one description, no duties/wants split); "View role" (`jt.310`) is the title link's hover affordance and is not rendered as a second button; the hero "See N open positions" scrolls to `#roles` without pre-selecting the overseas filter.

`src/app/[locale]/(site)/careers/page.tsx` — add the imports, the view model, the hero card and the roles section:

```tsx
// add to the imports
import { EmptyState } from '@/design/blocks';
import { Eyebrow } from '@/design/primitives';
import { opsCareersUrl } from '@/lib/careers-pure';
import { HeroRoleCard } from './_components/HeroRoleCard';
import { RolesList } from './_components/RolesList';
import { roleCards } from './_lib/view-model';
```

```tsx
  // after `const sourceCountries = …` in the default export
  const countries = getCollection(bundle, 'countries');
  const cards = roleCards(openings, {
    locale,
    countries,
    labels: {
      fullTime: t('jt.099'),
      partTime: t('jt.100'),
      project: t('jt.073'),
      category: {
        FULL_TIME: t('jt.099'),
        FREELANCER: sys('careers.category.freelancer'),
        PROJECT_BASED: t('jt.073'),
        COUNTRY_REPRESENTATIVE: t('jt.143'),
      },
      askIntro: t('jt.311'),
      askTail: t('jt.312'),
    },
    whatsappNumber: bundle.settings.whatsappNumber,
  });
```

Replace `<div data-slot="hero-role-card" />` with:

```tsx
            <HeroRoleCard
              cards={cards}
              labels={{
                title: t('jt.030'),
                lead: t('jt.031'),
                live: t('jt.032'),
                newBadge: t('jt.033'),
                footer: t('jt.034'),
                all: t('jt.035'),
              }}
            />
```

Replace the `{/* Cycles 3–4 append … */}` comment with the roles section (the later sections follow it in cycle 4):

```tsx
      {/* ── Open roles (#roles) ───────────────────────────────────────────────────────────── */}
      <Section tone="pale" id="roles" className="scroll-mt-5 border-t border-[#e9f1f7]">
        <div className="container-site" data-testid="careers-roles">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[620px]">
              <Eyebrow>{t('jt.044')}</Eyebrow>
              <h2 className="mb-2 mt-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.045')}</h2>
              <p className="m-0 text-body text-text-secondary">{t('jt.046')}</p>
            </div>
            {/* D15: the token-bearing candidate portal stays on Operations. */}
            <a
              href={opsCareersUrl(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('primary')}
            >
              {t('jt.047')}
            </a>
          </div>
          {cards.length === 0 ? (
            <EmptyState
              testId="careers-empty"
              tone="light"
              headingLevel={3}
              title={sys('careers.empty.title')}
              body={sys('careers.empty.body')}
              cta={{ label: t('jt.026'), href: '#apply' }}
            />
          ) : (
            <RolesList
              cards={cards}
              labels={{
                where: t('jt.048'),
                engagement: t('jt.049'),
                office: t('jt.261'),
                overseas: t('jt.262'),
                fullTime: t('jt.099'),
                partTime: t('jt.100'),
                project: t('jt.073'),
                view: t('jt.310'),
                apply: t('jt.052'),
                ask: t('jt.053'),
                newBadge: t('jt.033'),
                showFewer: t('jt.306'),
                noMatchTitle: t('jt.054'),
                noMatchBody: t('jt.055'),
                showAll: t('jt.056'),
              }}
            />
          )}
        </div>
      </Section>

      {/* Cycle 4 appends: <WaysCards>, <HiringSteps>, <OpenApplication>, FAQ. */}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/careers"` → `npx vitest run "src/app/[locale]/(site)/careers"` → green (2 files). `npm run typecheck` + `npm run lint` clean (no `ref.current` read in render, no state set in an effect — the island is plain `useState`). Manual: `npm run build && npm run start` → `/kariyer` shows the W6 empty state (`careers-empty`) and no hero card; with `OPS_API_URL=http://127.0.0.1:4980` and the cycle-6 mock running → the four overseas roles in the hero card, the filters narrowing the list, "Show N more roles" past four.

- [ ] **Step 5: Commit**

```
feat(careers): live roles — view model, hero role card, filterable RolesList island, W6 empty state

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 4 — engagement types, hiring process, the WhatsApp/e-mail open application, the FAQ

- [ ] **Step 1: Write the failing test**

No page-local pure logic in this cycle; the assertions are the e2e section test ids added to `e2e/pages/careers.spec.ts` in cycle 6 (`careers-ways`, `careers-process`, `careers-apply`, `careers-faq`) and the FAQ JSON-LD check there. Write those four `toBeVisible()` lines now into the spec file's index test (cycle 6 shows the whole file) so this cycle has a red assertion to turn green.

- [ ] **Step 2: Run to verify it fails**

`E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/careers.spec.ts --project=desktop` against the cycle-3 build → the four section assertions fail (`careers-ways` not found).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/careers/_components/WaysCards.tsx` (server; W10 — static cards on every width, no accordion JS):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { makeTf } from '@/content/pure';
import { Eyebrow, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

const WAYS = [
  { badgeId: 'jt.060', titleId: 'jt.061', bodyId: 'jt.062', bullets: ['jt.063', 'jt.064', 'jt.065'], dark: true },
  { badgeId: 'jt.066', titleId: 'jt.067', bodyId: 'jt.068', bullets: ['jt.069', 'jt.070', 'jt.071'], dark: false },
  { badgeId: 'jt.072', titleId: 'jt.073', bodyId: 'jt.074', bullets: ['jt.075', 'jt.076', 'jt.077'], dark: false },
] as const;

export function WaysCards({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeTf(bundle, locale);
  return (
    <Section tone="light" className="border-t border-[#e9f1f7]">
      <div className="container-site" data-testid="careers-ways">
        <div className="mb-8 max-w-[680px]">
          <Eyebrow>{t('jt.057')}</Eyebrow>
          <h2 className="mb-3 mt-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.058')}</h2>
          <p className="m-0 text-body text-text-secondary">{t('jt.059')}</p>
        </div>
        <ul className="m-0 grid gap-4 p-0 md:grid-cols-3">
          {WAYS.map((w) => (
            <li
              key={w.titleId}
              className={
                w.dark
                  ? 'rounded-lg bg-[linear-gradient(135deg,#253063_0%,#16204a_100%)] p-7 text-white'
                  : 'rounded-lg border-[1.5px] border-[#d3e6f2] bg-white p-7 text-ink'
              }
            >
              <span
                className={`mb-4 inline-flex rounded-pill px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.08em] ${
                  w.dark ? 'border border-white/20 bg-white/15 text-white' : 'bg-tint text-blue-safe'
                }`}
              >
                {t(w.badgeId)}
              </span>
              <h3 className="m-0 text-[21px] font-extrabold tracking-[-0.02em]">{t(w.titleId)}</h3>
              <p className={`mb-4 mt-2 text-body-sm ${w.dark ? 'text-[#c9d6ec]' : 'text-text-secondary'}`}>{t(w.bodyId)}</p>
              <ul className="m-0 flex flex-col gap-2 p-0 text-body-sm">
                {w.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden="true" className={w.dark ? 'font-extrabold text-[#7de2a5]' : 'font-extrabold text-blue'}>
                      •
                    </span>
                    {t(b)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {/* jt.078 is legal — verbatim; jt.079 is the package's own link fragment. */}
        <p className="mb-0 mt-4 rounded-base border border-[#e2edf5] bg-pale-1 px-5 py-4 text-body-sm text-text-secondary">
          {t('jt.078')}{' '}
          <Link href="/partner-with-us" className="font-extrabold text-blue-safe">
            {t('jt.079')}
          </Link>
        </p>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/_components/HiringSteps.tsx` (server; shared by both pages — `variant="compact"` on the detail drops the section header and the status link):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { makeTf } from '@/content/pure';
import { Eyebrow, Section, buttonClassName } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { opsCareersUrl } from '@/lib/careers-pure';

/** The 7 steps: title / body / when triplets from the package; the Admira AI badge on 3–4. */
const STEPS = [
  { titleId: 'jt.263', bodyId: 'jt.264', whenId: 'jt.265', ai: false, tone: 'blue' },
  { titleId: 'jt.266', bodyId: 'jt.267', whenId: 'jt.268', ai: false, tone: 'blue' },
  { titleId: 'jt.269', bodyId: 'jt.270', whenId: 'jt.271', ai: true, tone: 'navy' },
  { titleId: 'jt.272', bodyId: 'jt.273', whenId: 'jt.274', ai: true, tone: 'navy' },
  { titleId: 'jt.275', bodyId: 'jt.276', whenId: 'jt.277', ai: false, tone: 'navy' },
  { titleId: 'jt.278', bodyId: 'jt.279', whenId: 'jt.280', ai: false, tone: 'blue' },
  { titleId: 'jt.281', bodyId: 'jt.282', whenId: 'jt.283', ai: false, tone: 'green' },
] as const;

const BADGE: Record<(typeof STEPS)[number]['tone'], string> = {
  blue: 'bg-blue-safe text-white',
  navy: 'bg-[#253063] text-white',
  green: 'bg-success text-white',
};

export function HiringSteps({
  bundle,
  locale,
  variant = 'full',
}: {
  bundle: Bundle;
  locale: Locale;
  variant?: 'full' | 'compact';
}) {
  const t = makeTf(bundle, locale);
  const list = (
    <ol className="relative m-0 flex list-none flex-col p-0" aria-label={t('jt.080')}>
      <span aria-hidden="true" className="absolute bottom-11 left-[25px] top-7 w-[3px] rounded-pill bg-[linear-gradient(180deg,#1899d5_0%,#253063_55%,#16a34a_100%)] opacity-25" />
      {STEPS.map((s, i) => (
        <li key={s.titleId} className="relative grid grid-cols-[54px_1fr] gap-5 pb-6">
          <span aria-hidden="true" className={`flex h-[54px] w-[54px] items-center justify-center rounded-full text-body font-extrabold ${BADGE[s.tone]}`}>
            {i + 1}
          </span>
          <div className="pt-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="m-0 text-body-lg font-extrabold tracking-[-0.01em]">{t(s.titleId)}</h3>
              {s.ai && (
                <span className="rounded-pill border border-[#ccd5ea] bg-[#edf1f9] px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#253063]">
                  {t('jt.083')}
                </span>
              )}
              {/* Dated labels ("Day 0", "Within 24h") are package copy, parity-baselined — rendered as authored. */}
              <span className="text-[11.5px] font-extrabold uppercase tracking-[0.07em] text-muted">{t(s.whenId)}</span>
            </div>
            <p className="m-0 max-w-[640px] text-body-sm text-text-secondary">{t(s.bodyId)}</p>
          </div>
        </li>
      ))}
    </ol>
  );

  if (variant === 'compact') {
    return (
      <div data-testid="careers-process" className="rounded-lg border border-[#e2edf5] bg-white p-6 md:p-8">
        <h2 className="mb-6 mt-0 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.081')}</h2>
        {list}
      </div>
    );
  }

  return (
    <Section tone="pale" className="border-t border-[#e9f1f7]">
      <div className="container-site" data-testid="careers-process">
        <div className="mb-8 max-w-[660px]">
          <Eyebrow>{t('jt.080')}</Eyebrow>
          <h2 className="mb-3 mt-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.081')}</h2>
          <p className="m-0 text-body text-text-secondary">{t('jt.082')}</p>
        </div>
        <div className="rounded-lg border border-[#e2edf5] bg-white p-6 shadow-[0_10px_30px_rgba(22,60,90,0.06)] md:p-8">
          {list}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#eef3f7] pt-5">
            <p className="m-0 flex items-center gap-3 text-body-sm font-bold text-text-secondary">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success" />
              {t('jt.084')}
            </p>
            <a href={opsCareersUrl(locale)} target="_blank" rel="noopener noreferrer" className={buttonClassName('secondary')}>
              {t('jt.085')}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/_components/OpenApplication.tsx` (server; W3 — WhatsApp + e-mail, no form, no key):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks';
import { Eyebrow, Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { opsCareersUrl } from '@/lib/careers-pure';
import { mailLink, waLink } from '@/lib/contact';

const WANTS = [
  { titleId: 'jt.089', bodyId: 'jt.090', tone: 'bg-tint text-blue-safe' },
  { titleId: 'jt.091', bodyId: 'jt.092', tone: 'bg-success-surface text-success-text' },
  { titleId: 'jt.093', bodyId: 'jt.094', tone: 'bg-[#edf1f9] text-[#253063]' },
] as const;

export function OpenApplication({
  bundle,
  locale,
  sys,
}: {
  bundle: Bundle;
  locale: Locale;
  sys: { whatsapp: string; emailSubject: string };
}) {
  const t = makeTf(bundle, locale);
  const s = bundle.settings;
  const tail = t('jt.107'); // TR: deliberately '' — never the EN fallback (CONTENT-MODEL)
  return (
    <Section tone="light" id="apply" className="scroll-mt-5">
      <div className="container-site grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]" data-testid="careers-apply">
        <div>
          <Eyebrow>{t('jt.086')}</Eyebrow>
          <h2 className="mb-3 mt-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.087')}</h2>
          <p className="mb-6 text-body text-text-secondary">{t('jt.088')}</p>
          <ul className="m-0 flex flex-col gap-3 p-0">
            {WANTS.map((w) => (
              <li key={w.titleId} className="flex gap-3">
                <span aria-hidden="true" className={`flex h-9 w-9 flex-none items-center justify-center rounded-[10px] ${w.tone}`}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </span>
                <span>
                  <strong className="block text-body font-extrabold text-ink">{t(w.titleId)}</strong>
                  <span className="text-body-sm text-text-tertiary">{t(w.bodyId)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-lg border-[1.5px] border-[#d3e6f2] bg-white shadow-[0_18px_44px_rgba(22,60,90,0.1)]">
          <div className="border-b border-[#e2edf5] bg-pale-1 px-6 py-4">
            <h3 className="m-0 text-body-lg font-extrabold text-ink">{t('jt.095')}</h3>
            {/* jt.096 ("we reply within a week") is package copy, parity-baselined — as authored; listed for the WP-C copy review beside the replySlaHours metric. */}
            <p className="m-0 mt-0.5 text-body-sm text-text-tertiary">{t('jt.096')}</p>
          </div>
          <div className="flex flex-col gap-3 px-6 py-6">
            <div className="flex flex-wrap gap-3">
              <ContactCta placement="page_cta" href={waLink(s.whatsappNumber, t('jt.286'))} external size="lg">
                {sys.whatsapp}
              </ContactCta>
              <ContactCta placement="page_cta" href={mailLink(s.careersEmail, sys.emailSubject)} variant="secondary" size="lg">
                {t('jt.104')}
              </ContactCta>
            </div>
            <p className="m-0 text-body-sm text-muted">
              {t('jt.105')}{' '}
              <a href={opsCareersUrl(locale)} target="_blank" rel="noopener noreferrer" className="font-extrabold text-blue-safe">
                {t('jt.106')}
              </a>
              {tail ? ` ${tail}` : ''}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/page.tsx` — add the imports and append the four sections after the roles `<Section>` (replacing the `{/* Cycle 4 appends … */}` comment):

```tsx
// imports
import { ContactCta, FaqBlock } from '@/design/blocks';
import { mailLink } from '@/lib/contact';
import { HiringSteps } from './_components/HiringSteps';
import { OpenApplication } from './_components/OpenApplication';
import { WaysCards } from './_components/WaysCards';
```

```tsx
      <WaysCards bundle={bundle} locale={locale} />
      <HiringSteps bundle={bundle} locale={locale} />
      <OpenApplication
        bundle={bundle}
        locale={locale}
        sys={{ whatsapp: sys('careers.apply.whatsapp'), emailSubject: sys('careers.apply.emailSubject') }}
      />

      {/* ── FAQ (8 pairs; FAQPage JSON-LD from the same pairs — never the design's hand-written 7) ── */}
      <div data-testid="careers-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq"
          eyebrowId="jt.111"
          headingId="jt.112"
          openFirst
          items={[245, 247, 249, 251, 253, 255, 257, 259].map((n) => ({
            id: `jt.${n}`,
            q: t(`jt.${n}`),
            a: t(`jt.${n + 1}`),
          }))}
          footer={
            <p className="m-0 text-center text-body-sm text-text-secondary">
              {t('jt.113')}{' '}
              <ContactCta placement="page_cta" href={mailLink(bundle.settings.careersEmail)} variant="ghost">
                {t('jt.114')}
              </ContactCta>{' '}
              {t('jt.115')}
            </p>
          }
        />
      </div>
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/careers"` → `npm run verify` green. `npm run build && npm run start` → the four sections render on `/kariyer` and `/en/careers`; `curl -s localhost:3000/kariyer | grep -o '"@type":"FAQPage"' | wc -l` → 1; the TR open-application note ends after "portal üzerinden başvurun." with no dangling English (jt.107 empty).

- [ ] **Step 5: Commit**

```
feat(careers): engagement types, hiring process with the Admira AI badge, WhatsApp/e-mail open application (W3), FAQ block

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 5 — the detail page: `generateStaticParams`, JobPosting JSON-LD, the apply form → `careers`, the residency / PK / portfolio branches

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/careers/[slug]/__tests__/apply-spec.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { FormActionError } from '@/forms/types';
import { OPENING } from '@/lib/__tests__/careers-pure.test';
import { applySchema, applyToFields, type ApplyContext } from '../_lib/apply-spec';

const messages = { closed: 'closed-msg', portfolioGate: 'portfolio-msg' };
const pdf = () => new File(['%PDF-1.4\n%mock'], 'cv.pdf', { type: 'application/pdf' });

const form = (fields: Record<string, string>, cv: File | null = pdf()) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  if (cv) fd.set('cv', cv);
  return fd;
};

const VALID = {
  openingSlug: OPENING.slug,
  name: 'Aziz Karimov',
  email: 'Aziz@Example.com',
  phone: '+998 90 123 45 67',
  country: 'uz',
  city: '',
  language: '',
  expectedSalary: '',
  linkedinUrl: '',
  portfolioUrl: '',
  coverLetter: '',
};

const ctx = (over: Partial<ApplyContext> = {}): ApplyContext => ({
  opening: OPENING,
  upload: vi.fn(async () => ({ cvKey: 'careers-cv/abc-123.pdf' })),
  messages,
  ...over,
});

describe('applySchema', () => {
  it('parses a valid submission (trims, upper-cases the ISO-2 code, keeps the e-mail as typed for the door to lowercase)', () => {
    const p = applySchema.parse(VALID);
    expect(p.country).toBe('UZ');
    expect(p.email).toBe('Aziz@Example.com');
  });

  it('required before format: an empty e-mail is `required`, a malformed one `email`, a short phone `phone`', () => {
    const empty = applySchema.safeParse({ ...VALID, email: '' });
    expect(empty.success).toBe(false);
    if (!empty.success) expect(empty.error.issues[0].code).toBe('too_small');
    const bad = applySchema.safeParse({ ...VALID, email: 'nope' });
    expect(bad.success).toBe(false);
    if (!bad.success) expect(bad.error.issues[0].code).toBe('invalid_string');
    const phone = applySchema.safeParse({ ...VALID, phone: '12 34' });
    expect(phone.success).toBe(false);
    if (!phone.success) expect(phone.error.issues[0].message).toBe('phone');
  });

  it('refuses a slug the door would refuse, a non-numeric salary, and over-long optional fields', () => {
    expect(applySchema.safeParse({ ...VALID, openingSlug: 'Bad Slug' }).success).toBe(false);
    expect(applySchema.safeParse({ ...VALID, expectedSalary: '1,500' }).success).toBe(false);
    expect(applySchema.safeParse({ ...VALID, coverLetter: 'x'.repeat(5001) }).success).toBe(false);
    expect(applySchema.safeParse({ ...VALID, city: 'x'.repeat(101) }).success).toBe(false);
  });

  it('ignores the File under `cv` (the schema is strings only; toFields reads it from FormData)', () => {
    expect(applySchema.safeParse({ ...VALID, cv: pdf() }).success).toBe(true);
  });
});

describe('applyToFields', () => {
  it('uploads the CV and sends EXACTLY the catalog field names (required set, no empties)', async () => {
    const c = ctx();
    const fields = await applyToFields(applySchema.parse(VALID), form(VALID), c);
    expect(c.upload).toHaveBeenCalledTimes(1);
    expect(fields).toEqual({
      openingSlug: OPENING.slug,
      cvKey: 'careers-cv/abc-123.pdf',
      name: 'Aziz Karimov',
      email: 'Aziz@Example.com',
      phone: '+998 90 123 45 67',
      country: 'UZ',
    });
  });

  it('sends the optional fields when typed; the salary currency is the opening’s pay currency', async () => {
    const typed = {
      ...VALID,
      city: 'Tashkent',
      language: 'Uzbek, Russian',
      expectedSalary: '1000',
      linkedinUrl: 'linkedin.com/in/aziz',
      portfolioUrl: 'https://aziz.example',
      coverLetter: 'I run a network of three institutes.',
    };
    const fields = await applyToFields(applySchema.parse(typed), form(typed), ctx());
    expect(fields).toMatchObject({
      city: 'Tashkent',
      language: 'Uzbek, Russian',
      expectedSalary: '1000',
      expectedSalaryCurrency: 'USD',
      linkedinUrl: 'linkedin.com/in/aziz',
      portfolioUrl: 'https://aziz.example',
      coverLetter: 'I run a network of three institutes.',
    });
    expect(Object.keys(fields).sort()).toEqual(
      ['city', 'country', 'coverLetter', 'cvKey', 'email', 'expectedSalary', 'expectedSalaryCurrency', 'language', 'linkedinUrl', 'name', 'openingSlug', 'phone', 'portfolioUrl'].sort(),
    );
    // never on the wire: currentSalary*, consent, honeypot, the File
    expect(fields).not.toHaveProperty('currentSalary');
    expect(fields).not.toHaveProperty('cv');
  });

  it('residency lock: a country other than the opening’s lands on the `country` field', async () => {
    const p = applySchema.parse({ ...VALID, country: 'TR' });
    await expect(applyToFields(p, form({ ...VALID, country: 'TR' }), ctx())).rejects.toMatchObject({
      field: { name: 'country', code: 'invalid' },
    });
  });

  it('a Pakistan opening without an expected salary lands on `expectedSalary`; with one it rides in PKR', async () => {
    const pk = { ...OPENING, country: 'PK', payCurrency: 'PKR' };
    const p = applySchema.parse({ ...VALID, country: 'PK' });
    await expect(applyToFields(p, form({ ...VALID, country: 'PK' }), ctx({ opening: pk }))).rejects.toMatchObject({
      field: { name: 'expectedSalary', code: 'required' },
    });
    const withSalary = { ...VALID, country: 'PK', expectedSalary: '150000' };
    const fields = await applyToFields(applySchema.parse(withSalary), form(withSalary), ctx({ opening: pk }));
    expect(fields).toMatchObject({ expectedSalary: '150000', expectedSalaryCurrency: 'PKR' });
  });

  it('a portfolio opening is refused with the visitor message (W3/W56) before any upload', async () => {
    const c = ctx({ opening: { ...OPENING, portfolioRequired: true } });
    const err = await applyToFields(applySchema.parse(VALID), form(VALID), c).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FormActionError);
    expect((err as FormActionError).visitorMessage).toBe('portfolio-msg');
    expect((err as FormActionError).field).toBeUndefined();
    expect(c.upload).not.toHaveBeenCalled();
  });

  it('a slug that does not match the opening (tampered hidden input) is the closed message', async () => {
    const p = applySchema.parse({ ...VALID, openingSlug: 'other-role' });
    await expect(applyToFields(p, form({ ...VALID, openingSlug: 'other-role' }), ctx())).rejects.toMatchObject({
      visitorMessage: 'closed-msg',
    });
  });

  it('no file, or an empty file, is a `cv` required error before any upload', async () => {
    const c = ctx();
    await expect(applyToFields(applySchema.parse(VALID), form(VALID, null), c)).rejects.toMatchObject({
      field: { name: 'cv', code: 'required' },
    });
    const empty = new File([], 'cv.pdf', { type: 'application/pdf' });
    await expect(applyToFields(applySchema.parse(VALID), form(VALID, empty), c)).rejects.toMatchObject({
      field: { name: 'cv', code: 'required' },
    });
    expect(c.upload).not.toHaveBeenCalled();
  });

  it('the uploader’s own refusal propagates untouched (FormActionError file / FormDoorError)', async () => {
    const refusal = new FormActionError('', { name: 'cv', code: 'file' });
    const c = ctx({ upload: vi.fn(async () => Promise.reject(refusal)) });
    await expect(applyToFields(applySchema.parse(VALID), form(VALID), c)).rejects.toBe(refusal);
  });
});
```

Also add one case to `src/app/[locale]/(site)/careers/__tests__/view-model.test.ts` for the salary line:

```ts
import { salaryLine } from '../_lib/view-model';

describe('salaryLine', () => {
  const sys = (key: string, values?: Record<string, string | number>) =>
    `${key}${values ? ':' + Object.values(values).join('|') : ''}`;
  it('composes the sys template with D18/Intl money and the period', () => {
    expect(salaryLine(OPENING, 'en', sys)).toBe('careers.salary.range:$800|$1,200 · careers.salary.per.MONTH');
    expect(salaryLine({ ...OPENING, salaryPayType: 'STARTING', salaryMax: null }, 'en', sys)).toBe(
      'careers.salary.from:$800 · careers.salary.per.MONTH',
    );
    expect(salaryLine({ ...OPENING, salaryVisible: false }, 'en', sys)).toBeNull();
    expect(salaryLine({ ...OPENING, salaryCurrency: 'TRY', salaryPayType: 'EXACT', salaryMin: '45000', salaryMax: '45000', salaryPeriod: null }, 'tr', sys)).toBe('45.000 ₺');
  });
});
```

`src/lib/seo/unbuilt.test.ts` goes red once `[slug]/page.tsx` exists until `'/careers/[slug]'` leaves the set.

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/[locale]/(site)/careers"` → `Cannot find module '../_lib/apply-spec'`; `salaryLine` is not exported.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/careers/_lib/view-model.ts` — append:

```ts
import { formatMoney, salaryPartsOf } from '@/lib/careers-pure';

/** The pay line for a card/fact row: null when the opening hides its pay. `sys` is next-intl's
 *  translator (server or client) — the templates are sys.careers.salary.*. */
export function salaryLine(
  o: Parameters<typeof salaryPartsOf>[0],
  locale: Locale,
  sys: (key: string, values?: Record<string, string | number>) => string,
): string | null {
  const parts = salaryPartsOf(o);
  if (!parts) return null;
  const money = (n: number) => formatMoney(n, parts.currency, locale);
  let amount: string;
  if (parts.kind === 'range' && parts.min !== null && parts.max !== null)
    amount = sys('careers.salary.range', { min: money(parts.min), max: money(parts.max) });
  else if (parts.kind === 'from' && parts.min !== null) amount = sys('careers.salary.from', { amount: money(parts.min) });
  else if (parts.kind === 'upTo' && parts.max !== null) amount = sys('careers.salary.upTo', { amount: money(parts.max) });
  else amount = money(parts.min ?? parts.max ?? 0);
  return parts.period ? `${amount} · ${sys(`careers.salary.per.${parts.period}`)}` : amount;
}
```

(merge the import into the existing `@/lib/careers-pure` import line.)

`src/app/[locale]/(site)/careers/[slug]/_lib/apply-spec.ts` (pure — no `server-only`, no fetch; the uploader is injected):

```ts
import { z } from 'zod';
import { FormActionError } from '@/forms/types';
import type { WireFields } from '@/forms/wire';
import { PORTFOLIO_GATE_RELAXED, type PublicOpening } from '@/lib/careers-pure';

/** The string fields of the apply form, in the door's `careers` catalog names (v1.0 + the v1.1
 *  `portfolioUrl`). The CV `File` is NOT here — `applyToFields` reads it from the raw FormData.
 *  `.min(1)` before `.email()` so an empty field is `required`, not `email`. */
export const applySchema = z.object({
  openingSlug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().min(1).max(254).email(),
  phone: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .refine((v) => v.replace(/\D/g, '').length >= 8, { message: 'phone' }),
  country: z
    .string()
    .trim()
    .min(1)
    .length(2)
    .transform((v) => v.toUpperCase()),
  city: z.string().trim().max(100).optional(),
  language: z.string().trim().max(300).optional(),
  expectedSalary: z
    .string()
    .trim()
    .max(20)
    .regex(/^\d*$/)
    .optional(),
  linkedinUrl: z.string().trim().max(500).optional(),
  portfolioUrl: z.string().trim().max(500).optional(),
  coverLetter: z.string().trim().max(5000).optional(),
});
export type ApplyInput = z.infer<typeof applySchema>;

export type ApplyContext = {
  opening: PublicOpening;
  /** `uploadCv` in production; a stub in tests. */
  upload: (file: File) => Promise<{ cvKey: string }>;
  messages: { closed: string; portfolioGate: string };
};

const isFileLike = (v: unknown): v is File => typeof File !== 'undefined' && v instanceof File;

/** Parsed strings + the raw FormData → the exact wire fields the `careers` catalog lists.
 *  Every rule the door would enforce after the upload is enforced here first, so a visitor is
 *  never sent to WhatsApp for a mistake the page can name: the residency lock (owner rule
 *  2026-07-24), Pakistan's expected salary (2026-07-23), the portfolio gate (W56). */
export async function applyToFields(p: ApplyInput, data: FormData, ctx: ApplyContext): Promise<WireFields> {
  const { opening } = ctx;
  if (p.openingSlug !== opening.slug) throw new FormActionError(ctx.messages.closed);
  if (opening.portfolioRequired && !PORTFOLIO_GATE_RELAXED)
    throw new FormActionError(ctx.messages.portfolioGate);
  if (p.country !== opening.country.toUpperCase())
    throw new FormActionError('', { name: 'country', code: 'invalid' });
  if (opening.country.toUpperCase() === 'PK' && !p.expectedSalary)
    throw new FormActionError('', { name: 'expectedSalary', code: 'required' });
  const cv = data.get('cv');
  if (!isFileLike(cv) || cv.size === 0) throw new FormActionError('', { name: 'cv', code: 'required' });
  const { cvKey } = await ctx.upload(cv);

  const fields: WireFields = {
    openingSlug: opening.slug,
    cvKey,
    name: p.name,
    email: p.email,
    phone: p.phone,
    country: p.country,
  };
  if (p.city) fields.city = p.city;
  if (p.language) fields.language = p.language;
  if (p.expectedSalary) {
    fields.expectedSalary = p.expectedSalary;
    if (opening.payCurrency) fields.expectedSalaryCurrency = opening.payCurrency;
  }
  if (p.linkedinUrl) fields.linkedinUrl = p.linkedinUrl;
  if (p.portfolioUrl) fields.portfolioUrl = p.portfolioUrl;
  if (p.coverLetter) fields.coverLetter = p.coverLetter;
  return fields;
}
```

`src/app/[locale]/(site)/careers/[slug]/actions.ts`:

```ts
'use server';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { createFormAction, FormActionError, type FormActionState } from '@/forms/action';
import { uploadCv } from '@/forms/uploads';
import { routing } from '@/i18n/routing';
import { getOpening } from '@/lib/careers';
import { applySchema, applyToFields } from './_lib/apply-spec';

/** Per-opening application → `careers` (CAREERS_APPLY). The opening is re-read on the server
 *  (React-cached, 300 s ISR) so the residency/PK/portfolio rules are checked against the truth,
 *  not the page the visitor loaded; a closed opening is a visitor message, not a wire call. */
const run = createFormAction({
  key: 'careers',
  schema: applySchema,
  consent: 'checkbox',
  toFields: async (p, data) => {
    const requested = await getLocale();
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    const sys = await getTranslations({ locale, namespace: 'sys' });
    const opening = await getOpening(p.openingSlug); // OpeningsUnavailableError → the kernel's `unavailable` panel
    if (!opening) throw new FormActionError(sys('careers.form.closed'));
    return applyToFields(p, data, {
      opening,
      upload: (file) => uploadCv(file, { field: 'cv' }),
      messages: { closed: sys('careers.form.closed'), portfolioGate: sys('careers.form.portfolioGate') },
    });
  },
});

export async function submitCareersApplication(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return run(prev, data);
}
```

`src/app/[locale]/(site)/careers/[slug]/_components/CountryField.tsx` (`'use client'` — the foundation's `Field` cannot pre-select a value, so this is the same labelled select with the opening's country as the default; the server refuses any other):

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { FormField } from '@/design/primitives';
import { INPUT_CLASS, type FieldOption } from '@/forms/client/Field';
import { useFieldError, useFieldValue } from '@/forms/client/FormErrorsContext';

export function CountryField({
  options,
  locked,
  hint,
}: {
  options: FieldOption[];
  /** The opening's `country` (ISO-2) — pre-selected; the residency rule lives on the server. */
  locked: string;
  hint: string;
}) {
  const sys = useTranslations('sys');
  const error = useFieldError('country');
  const value = useFieldValue('country');
  return (
    <FormField id="f-country" label={sys('form.labels.country')} hint={hint} error={error} required>
      {(p) => (
        <select {...p} name="country" defaultValue={value ?? locked} autoComplete="country" className={INPUT_CLASS}>
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

`src/app/[locale]/(site)/careers/[slug]/_components/ApplyStartPing.tsx` (`'use client'`; W12/W67 — the one page event, once per mount, on the visitor's first interaction with the enclosing form; `slug` is the public URL segment, ≤80 chars, never a visitor identifier):

```tsx
'use client';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { track } from '@/analytics/track';

export function ApplyStartPing({ slug }: { slug: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const page = usePathname() ?? '/'; // the real URL (R35), not next-intl's internal key
  const locale = useLocale();
  useEffect(() => {
    const form = ref.current?.closest('form');
    if (!form) return;
    const onFirst = () => {
      track('career_apply_start', { page, locale, slug: slug.slice(0, 80) });
      form.removeEventListener('focusin', onFirst);
    };
    form.addEventListener('focusin', onFirst);
    return () => form.removeEventListener('focusin', onFirst);
  }, [page, locale, slug]);
  return <span ref={ref} hidden />;
}
```

`src/app/[locale]/(site)/careers/[slug]/_components/ApplyForm.tsx` (server component — the `FormShell` and its fields; `contact` is the careers mailbox, so the fallback panel's e-mail door is the right one):

```tsx
import type { Bundle } from '../../../../../../../contract/website-bundle.v1';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FieldOption } from '@/forms/client/Field';
import type { Locale } from '@/i18n/routing';
import type { PublicOpening } from '@/lib/careers-pure';
import { submitCareersApplication } from '../actions';
import { ApplyStartPing } from './ApplyStartPing';
import { CountryField } from './CountryField';

export function ApplyForm({
  bundle,
  locale,
  opening,
  countryOptions,
  labels,
}: {
  bundle: Bundle;
  locale: Locale;
  opening: PublicOpening;
  countryOptions: FieldOption[];
  labels: { submit: string; residency: string; salaryHint: string; whatsappIntro: string };
}) {
  const s = bundle.settings;
  const isPk = opening.country.toUpperCase() === 'PK';
  return (
    <FormShell
      action={submitCareersApplication}
      formKey="careers"
      locale={locale}
      turnstileSiteKey={s.turnstileSiteKey}
      whatsappNumber={s.whatsappNumber}
      whatsappIntro={labels.whatsappIntro}
      contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.careersEmail }}
      submitLabel={labels.submit}
      consent="checkbox"
      consentLinkHref="/kvkk"
      testId="careers-apply-form"
    >
      <ApplyStartPing slug={opening.slug} />
      <input type="hidden" name="openingSlug" value={opening.slug} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" required autoComplete="name" />
        <Field name="email" type="email" required autoComplete="email" inputMode="email" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
        <CountryField options={countryOptions} locked={opening.country.toUpperCase()} hint={labels.residency} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="city" autoComplete="address-level2" />
        <Field name="language" />
      </div>
      {/* Owner rule 2026-07-23: every Pakistan opening requires an expected salary; the field
          is rendered for PK only and the server enforces it (apply-spec.ts). */}
      {isPk && (
        <Field
          name="expectedSalary"
          type="number"
          inputMode="numeric"
          min={0}
          required
          hint={labels.salaryHint}
        />
      )}
      <Field name="cv" type="file" accept="application/pdf,.pdf" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="linkedinUrl" type="url" inputMode="url" autoComplete="url" />
        <Field name="portfolioUrl" type="url" inputMode="url" />
      </div>
      <Field name="coverLetter" as="textarea" rows={5} />
    </FormShell>
  );
}
```

`src/app/[locale]/(site)/careers/[slug]/_components/EmailApplyPanel.tsx` (server; the W3/W56 branch — `data-testid="careers-email-apply"`):

```tsx
import { ContactCta } from '@/design/blocks';
import { mailLink, waLink } from '@/lib/contact';

export function EmailApplyPanel({
  email,
  whatsappNumber,
  copy,
}: {
  email: string;
  whatsappNumber: string;
  copy: { title: string; body: string; subject: string; emailLabel: string; whatsappLabel: string; whatsappText: string };
}) {
  return (
    <div
      data-testid="careers-email-apply"
      role="status"
      className="rounded-lg border-[1.5px] border-dashed border-[#d3e6f2] bg-white p-6 md:p-8"
    >
      <h3 className="m-0 text-card-title font-extrabold text-ink">{copy.title}</h3>
      <p className="mb-2 mt-2 text-body-sm text-text-secondary">{copy.body}</p>
      <p className="mb-5 mt-0 rounded-sm bg-pale-1 px-3 py-2 font-mono text-body-sm text-ink">{copy.subject}</p>
      <div className="flex flex-wrap gap-3">
        <ContactCta placement="page_cta" href={mailLink(email, copy.subject)} size="lg">
          {copy.emailLabel}
        </ContactCta>
        <ContactCta placement="page_cta" href={waLink(whatsappNumber, copy.whatsappText)} external variant="secondary" size="lg">
          {copy.whatsappLabel}
        </ContactCta>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/careers/[slug]/_components/Description.tsx` (server):

```tsx
import { descriptionBlocks } from '@/lib/careers-pure';

export function Description({ text }: { text: string | null }) {
  const blocks = descriptionBlocks(text);
  if (blocks.length === 0) return null;
  return (
    <div data-testid="careers-description" className="flex flex-col gap-4 text-body text-text-secondary">
      {blocks.map((b, i) =>
        b.type === 'p' ? (
          <p key={i} className="m-0">
            {b.text}
          </p>
        ) : (
          <ul key={i} className="m-0 flex flex-col gap-2 pl-5">
            {b.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
```

`src/app/[locale]/(site)/careers/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { Breadcrumbs, ContactCta } from '@/design/blocks';
import { Eyebrow, Section, buttonClassName } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { getOpening, listOpenings } from '@/lib/careers';
import {
  baseSalaryOf,
  countryNameOf,
  engagementOf,
  isNewOpening,
  JOB_POSTING_EMPLOYMENT_TYPE,
  locationOf,
  PORTFOLIO_GATE_RELAXED,
  summaryOf,
  type PublicOpening,
} from '@/lib/careers-pure';
import { waLink } from '@/lib/contact';
import { formatDate } from '@/lib/format/date';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { jobPostingJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/seo/routes';
import { HiringSteps } from '../_components/HiringSteps';
import { salaryLine } from '../_lib/view-model';
import { ApplyForm } from './_components/ApplyForm';
import { Description } from './_components/Description';
import { EmailApplyPanel } from './_components/EmailApplyPanel';

export const revalidate = 300; // the openings floor; a new opening renders on demand (dynamicParams default)

/** Every current slug, both locales (the API's slug is locale-independent). Without a door
 *  (a preview build) this is [] and every detail renders on first request. */
export async function generateStaticParams() {
  const openings = await listOpenings();
  return openings.map((o) => ({ slug: o.slug }));
}

type Params = Promise<{ locale: string; slug: string }>;
const hrefOf = (slug: string) => ({ pathname: '/careers/[slug]', params: { slug } }) as const;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const opening = await getOpening(slug);
  if (!opening) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  const location = locationOf(opening, countryNameOf(opening.country, getCollection(bundle, 'countries'), locale));
  // The `careersDetail` record has titleId '' → the sys fallbacks (W38). No `alternates`
  // override: the slug is shared by both locales, so localeAlternates(href) is already right
  // (W17 — the switcher reads the hreflang tag this emits).
  return buildMetadata({
    locale,
    href: hrefOf(slug),
    bundle,
    pageKey: 'careersDetail',
    fallbackTitle: sys('seo.careersDetail.title', { title: opening.title }),
    fallbackDescription:
      summaryOf(opening.description, 150) || sys('seo.careersDetail.description', { title: opening.title, location }),
  });
}

function Fact({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-[#eef3f7] py-2 last:border-b-0">
      <dt className="text-eyebrow font-extrabold uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="m-0 text-body-sm font-bold text-ink">{value}</dd>
    </div>
  );
}

export default async function CareerDetail({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys, opening] = await Promise.all([getBundle(locale), getTranslations('sys'), getOpening(slug)]);
  if (!opening) notFound();
  const t = makeTf(bundle, locale);
  const s = bundle.settings;
  const countries = [...getCollection(bundle, 'countries')].sort((a, b) => a.name.localeCompare(b.name, locale));
  const countryName = countryNameOf(opening.country, countries, locale);
  const location = locationOf(opening, countryName);
  const href = hrefOf(opening.slug);
  const url = absoluteUrl(locale, href);

  const engagementLabel = { fullTime: t('jt.099'), partTime: t('jt.100'), project: t('jt.073') }[engagementOf(opening.category)];
  const categoryLabel = {
    FULL_TIME: t('jt.099'),
    FREELANCER: sys('careers.category.freelancer'),
    PROJECT_BASED: t('jt.073'),
    COUNTRY_REPRESENTATIVE: t('jt.143'),
  }[opening.category];
  const workModes = (opening.workModes.length ? opening.workModes : opening.workMode ? [opening.workMode] : []).map((m) =>
    sys(`careers.workMode.${m}`),
  );
  const languages = opening.requiredLanguages.length
    ? opening.requiredLanguages
    : opening.requiredLanguage
      ? [opening.requiredLanguage]
      : [];
  const pay = salaryLine(opening, locale, sys);
  const posted = formatDate(opening.postedAt, locale);
  const portfolioBranch = opening.portfolioRequired && !PORTFOLIO_GATE_RELAXED;
  const whatsappIntro = sys('careers.detail.whatsappIntro', { title: opening.title, slug: opening.slug });
  const askHref = waLink(s.whatsappNumber, `${t('jt.311')} ${opening.title} ${t('jt.312')}${location})`);

  const jsonLd = jobPostingJsonLd({
    title: opening.title,
    description: opening.description ?? summaryOf(opening.description) ?? opening.title,
    url,
    datePosted: opening.postedAt,
    employmentType: JOB_POSTING_EMPLOYMENT_TYPE[opening.category],
    hiringOrganization: s,
    jobLocation: { city: opening.cities[0] ?? opening.city ?? countryName, country: opening.country.toUpperCase() },
    baseSalary: baseSalaryOf(opening),
    identifier: opening.slug,
  });

  return (
    <>
      {/* D15: JobPosting on the detail only — datePosted from the API, no invented validThrough (D17). */}
      <JsonLd data={jsonLd} />

      <Section tone="dark" className="bg-[linear-gradient(158deg,#253063_0%,#1c2652_50%,#131c40_100%)]">
        <div className="container-site">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            items={[
              { name: t('jt.021'), href: '/' },
              { name: t('jt.005'), href: '/careers' },
              { name: opening.title, href },
            ]}
          />
          <div className="mt-6 max-w-[820px]">
            <p className="m-0 flex flex-wrap items-center gap-2 text-eyebrow font-extrabold uppercase tracking-[0.1em] text-sky">
              <span>{categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{engagementLabel}</span>
              {isNewOpening(opening.postedAt) && (
                <span className="rounded-pill bg-success px-2 py-0.5 text-[10px] text-white">{t('jt.033')}</span>
              )}
            </p>
            <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-3 text-h1 leading-[1.05] tracking-[-0.03em] text-white">
              {opening.title}
            </h1>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-body font-bold text-[#c1cbe6]">
              <span>{location}</span>
              {workModes.length > 0 && <span>{workModes.join(' / ')}</span>}
              <span>{sys('careers.roles.posted', { date: posted })}</span>
            </p>
            {pay && <p className="mt-2 text-body-lg font-extrabold text-white">{pay}</p>}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#apply" className={buttonClassName('primary', 'lg')}>
                {t('jt.052')}
              </a>
              <ContactCta placement="page_cta" href={askHref} external variant="inverse" size="lg">
                {t('jt.053')}
              </ContactCta>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="container-site grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="mb-4 mt-0 text-h2 leading-[1.05] tracking-[-0.04em]">{sys('careers.detail.about')}</h2>
            <Description text={opening.description} />
            <p className="mb-0 mt-8">
              <Link href="/careers" className="font-extrabold text-blue-safe no-underline hover:text-ink">
                ← {sys('careers.detail.back')}
              </Link>
            </p>
          </div>
          <aside aria-labelledby="careers-facts-title" className="rounded-lg border border-[#e2edf5] bg-pale-1 p-6" data-testid="careers-facts">
            <h2 id="careers-facts-title" className="m-0 mb-3 text-card-title font-extrabold">
              {sys('careers.detail.facts.title')}
            </h2>
            <dl className="m-0">
              <Fact label={sys('careers.detail.facts.country')} value={countryName} />
              <Fact label={sys('careers.detail.facts.city')} value={opening.cities.length ? opening.cities.join(', ') : opening.city} />
              <Fact label={t('jt.049')} value={engagementLabel} />
              <Fact label={sys('careers.detail.facts.workMode')} value={workModes.length ? workModes.join(' / ') : null} />
              <Fact label={sys('careers.detail.facts.languages')} value={languages.length ? languages.join(', ') : null} />
              <Fact label={sys('careers.detail.facts.salary')} value={pay} />
              <Fact label={sys('careers.detail.facts.posted')} value={posted} />
              {opening.portfolioRequired && <Fact label={sys('careers.detail.facts.portfolio')} value="✓" />}
            </dl>
          </aside>
        </div>
      </Section>

      <Section tone="pale" id="apply" className="scroll-mt-5 border-t border-[#e9f1f7]">
        <div className="container-site max-w-[860px]" data-testid="careers-apply">
          <Eyebrow>{t('jt.044')}</Eyebrow>
          <h2 className="mb-2 mt-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.052')}</h2>
          <p className="mb-6 text-body text-text-secondary">{sys('careers.detail.applyLead')}</p>
          {portfolioBranch ? (
            <EmailApplyPanel
              email={s.careersEmail}
              whatsappNumber={s.whatsappNumber}
              copy={{
                title: sys('careers.emailPanel.title'),
                body: sys('careers.emailPanel.body', { email: s.careersEmail }),
                subject: sys('careers.emailPanel.subject', { title: opening.title, slug: opening.slug }),
                emailLabel: sys('careers.emailPanel.email'),
                whatsappLabel: t('jt.117'),
                whatsappText: whatsappIntro,
              }}
            />
          ) : (
            <div className="rounded-lg border-[1.5px] border-[#d3e6f2] bg-white p-6 shadow-[0_18px_44px_rgba(22,60,90,0.1)] md:p-8">
              <ApplyForm
                bundle={bundle}
                locale={locale as Locale}
                opening={opening satisfies PublicOpening}
                countryOptions={countries.map((c) => ({ value: c.code, label: c.name }))}
                labels={{
                  submit: t('jt.103'),
                  residency: sys('careers.form.residency', { country: countryName }),
                  salaryHint: sys('careers.form.expectedSalaryHint', { currency: opening.payCurrency ?? 'PKR' }),
                  whatsappIntro,
                }}
              />
            </div>
          )}
        </div>
      </Section>

      <Section tone="light">
        <div className="container-site max-w-[860px]">
          <HiringSteps bundle={bundle} locale={locale} variant="compact" />
        </div>
      </Section>
    </>
  );
}
```

`src/lib/seo/routes.ts` — delete the `'/careers/[slug]',` line from the `UNBUILT_PATHNAMES` initialiser.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/careers" src/lib/seo/routes.ts` → `npx vitest run "src/app/[locale]/(site)/careers" src/lib/seo/unbuilt.test.ts` → green (apply-spec 10 cases, view-model 3, sys-keys 2, walker 2). `npm run verify` → green. `npm run build` → the build log shows `/[locale]/careers/[slug]` as ISR (`ƒ`/`●` with revalidate 300) and, without a door, zero prerendered slugs. Then start the cycle-6 mock (`node e2e/mocks/careers-door.mjs &`) and `OPS_API_URL=http://127.0.0.1:4980 npm run build && OPS_API_URL=http://127.0.0.1:4980 npm run start`: `/kariyer/country-representative-uzbekistan` renders the h1, the JobPosting node (`curl … | grep -c '"@type":"JobPosting"'` → 1), the form with `UZ` pre-selected; `/kariyer/sourcing-coordinator-pakistan` shows the expected-salary field; `/kariyer/content-seo-specialist-antalya` shows the e-mail panel and no `<form>`; `/kariyer/nope` is a 404 inside the chrome.

- [ ] **Step 5: Commit**

```
feat(careers): detail page — generateStaticParams over live slugs, JobPosting JSON-LD, apply form → careers with CV proxy, residency lock, PK salary and portfolio branches

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 6 — sitemap source, site-health counter wiring, the mock door, the page e2e spec, the gate run

- [ ] **Step 1: Write the failing tests**

`src/lib/seo/sitemap-sources.test.ts` — replace Task 4's first case (`is empty and frozen in the foundation …`) with:

```ts
import { careersSitemapSource } from '@/lib/careers-sitemap';

  it('is the frozen one-entry literal: the careers openings source (W31/W70)', () => {
    expect(DETAIL_SITEMAP_SOURCES).toEqual([careersSitemapSource]);
    expect(Object.isFrozen(DETAIL_SITEMAP_SOURCES)).toBe(true);
  });
```

Append to `src/lib/__tests__/careers.test.ts`:

```ts
import { careersSitemapSource } from '../careers-sitemap';

describe('careersSitemapSource', () => {
  it('maps every opening onto its localized absolute URL with the posting date', async () => {
    // listOpenings() is React-cached and reads process.env — stub the module the source imports.
    vi.doMock('../careers', () => ({ listOpenings: async () => [OPENING, { ...OPENING, slug: 'second-role' }] }));
    const { careersSitemapSource: source } = await import('../careers-sitemap');
    expect(await source('tr')).toEqual([
      { url: 'https://www.jobsadmire.com/kariyer/country-representative-uzbekistan', lastModified: new Date(OPENING.postedAt), changeFrequency: 'weekly', priority: 0.6 },
      { url: 'https://www.jobsadmire.com/kariyer/second-role', lastModified: new Date(OPENING.postedAt), changeFrequency: 'weekly', priority: 0.6 },
    ]);
    expect((await source('en'))[0].url).toBe('https://www.jobsadmire.com/en/careers/country-representative-uzbekistan');
    vi.doUnmock('../careers');
  });
});
```

`e2e/pages/careers.spec.ts` (the whole file — both halves):

```ts
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = { tr: '/kariyer', en: '/en/careers' } as const;
const ORIGIN = 'https://www.jobsadmire.com';
/** `npm run e2e:careers` builds+starts the site against e2e/mocks/careers-door.mjs and sets this;
 *  the ordinary gate (no door) runs the empty-state half and skips the detail half. */
const MOCK = process.env.E2E_CAREERS_MOCK === '1';
const SLUG = {
  uz: 'country-representative-uzbekistan',
  pk: 'sourcing-coordinator-pakistan',
  portfolio: 'content-seo-specialist-antalya',
} as const;
const SECTIONS = ['careers-notice', 'careers-roles', 'careers-ways', 'careers-process', 'careers-apply', 'careers-faq'];

async function expectNoLeak(page: Page) {
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/\{[a-zA-Z]+\}/);
  expect(text).not.toContain('undefined');
}

const jsonLd = async (page: Page) =>
  (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n');

test.describe('careers index', () => {
  for (const locale of ['tr', 'en'] as const) {
    test(`${locale}: one h1 (LCP slot), the sections in the design order, no token leak`, async ({ page }) => {
      const res = await page.goto(ROUTES[locale]);
      expect(res?.status()).toBe(200);
      await expect(page.getByTestId('page-h1')).toHaveCount(1);
      await expect(page.getByTestId('page-h1')).toHaveAttribute('data-lcp-slot', 'h1');
      for (const id of SECTIONS) await expect(page.getByTestId(id)).toBeVisible();
      const order = await page
        .locator(SECTIONS.map((s) => `[data-testid="${s}"]`).join(','))
        .evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')));
      expect(order).toEqual(SECTIONS);
      await expectNoLeak(page);
      if (MOCK) {
        await expect(page.getByTestId('careers-hero-roles')).toBeVisible();
        await expect(page.getByTestId('careers-hiring-count')).toContainText('5');
        await expect(page.getByTestId('careers-role')).toHaveCount(4); // five fixtures, four shown
        await expect(page.getByTestId('careers-empty')).toHaveCount(0);
      } else {
        // W6: no door → the empty state; the count pill and the hero card are absent, not blank.
        await expect(page.getByTestId('careers-empty')).toBeVisible();
        await expect(page.getByTestId('careers-hero-roles')).toHaveCount(0);
        await expect(page.getByTestId('careers-hiring-count')).toHaveCount(0);
      }
    });
  }

  test('the open application is WhatsApp + e-mail only (W3): no form, both doors present', async ({ page }) => {
    await page.goto(ROUTES.tr);
    const apply = page.getByTestId('careers-apply');
    await expect(apply.locator('form')).toHaveCount(0);
    await expect(apply.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', /^https:\/\/wa\.me\/905011240340\?text=/);
    await expect(apply.getByRole('link', { name: /CV/ })).toHaveAttribute('href', /^mailto:careers@jobsadmire\.com/);
  });

  test('FAQPage JSON-LD is built from the same eight pairs; no JobPosting on the index (D15)', async ({ page }) => {
    await page.goto(ROUTES.en);
    const ld = await jsonLd(page);
    expect(ld).toContain('"@type":"FAQPage"');
    expect(ld.match(/"@type":"Question"/g)).toHaveLength(8);
    expect(ld).not.toContain('"@type":"JobPosting"');
    expect(ld).toContain('"@type":"BreadcrumbList"');
  });

  test('the language alternate keeps the page', async ({ page }) => {
    await page.goto(ROUTES.tr);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}/en/careers`);
    await page.goto(ROUTES.en);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByTestId('page-h1')).toHaveCount(1);
    await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', `${ORIGIN}/kariyer`);
  });

  test('filters, show-more and the no-match state (mock door)', async ({ page }) => {
    test.skip(!MOCK, 'needs the fixture door: npm run e2e:careers');
    await page.goto(ROUTES.en);
    const list = page.getByTestId('careers-roles-list');
    await list.getByRole('radio', { name: 'Overseas' }).check();
    await expect(list.getByTestId('careers-role')).toHaveCount(3);
    await list.getByRole('radio', { name: 'Project-based' }).check();
    await expect(list.getByTestId('careers-role')).toHaveCount(1);
    await list.getByRole('radio', { name: 'Antalya office' }).check(); // office × project → nothing
    await expect(list.getByTestId('careers-no-match')).toBeVisible();
    await list.getByRole('button', { name: 'Show all roles' }).click();
    await expect(list.getByTestId('careers-role')).toHaveCount(4);
    await list.getByRole('button', { name: /Show 1 more role/ }).click();
    await expect(list.getByTestId('careers-role')).toHaveCount(5);
    await expectNoLeak(page);
  });
});

test.describe('careers detail — mock door', () => {
  test.skip(!MOCK, 'needs the fixture door: npm run e2e:careers');

  test('renders the opening with JobPosting JSON-LD, a three-item breadcrumb, both hreflangs; axe clean', async ({ page }) => {
    const res = await page.goto(`/kariyer/${SLUG.uz}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByTestId('page-h1')).toHaveText('Country Representative — Uzbekistan');
    await expect(page.getByTestId('page-h1')).toHaveAttribute('data-lcp-slot', 'h1');
    const ld = await jsonLd(page);
    expect(ld).toContain('"@type":"JobPosting"');
    expect(ld).toContain(`"identifier":{"@type":"PropertyValue","name":"JobsAdmire","value":"${SLUG.uz}"}`);
    expect(ld).toContain('"addressCountry":"UZ"');
    expect(ld).not.toContain('validThrough');
    expect(ld).toContain('"@type":"BreadcrumbList"');
    expect(ld.match(/"@type":"ListItem"/g)).toHaveLength(3);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}/kariyer/${SLUG.uz}`);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}/en/careers/${SLUG.uz}`);
    await expect(page.getByTestId('careers-description')).toBeVisible();
    await expect(page.getByTestId('careers-facts')).toContainText('Özbekistan');
    await expectNoLeak(page);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('the apply form validates on the server, keeps the values, then ends on the fallback panel (no write token)', async ({ page }) => {
    await page.goto(`/en/careers/${SLUG.uz}`);
    const form = page.getByTestId('careers-apply-form');
    await expect(form).toBeVisible();
    await expect(form.locator('select[name="country"]')).toHaveValue('UZ'); // residency lock pre-selects
    await expect(form.locator('input[name="expectedSalary"]')).toHaveCount(0); // not a PK role
    // 1. Empty submit → field errors, no navigation.
    await form.getByRole('button', { name: /Send application/ }).click();
    await expect(form.getByRole('alert').first()).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(`/en/careers/${SLUG.uz}`);
    // 2. Valid submit → CV uploaded to the mock, the door has no write token → the D11 panel.
    await form.locator('input[name="name"]').fill('Aziz Karimov');
    await form.locator('input[name="email"]').fill('aziz@example.com');
    await form.locator('input[name="phone"]').fill('+998 90 123 45 67');
    await form.locator('input[name="cv"]').setInputFiles({ name: 'cv.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%mock') });
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: /Send application/ }).click();
    const panel = form.getByTestId('form-fallback');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', /^https:\/\/wa\.me\/905011240340\?text=/);
    expect(new URL(page.url()).pathname).toBe(`/en/careers/${SLUG.uz}`);
    await expect(form.locator('input[name="name"]')).toHaveValue('Aziz Karimov');
  });

  test('a Pakistan opening asks for the expected salary', async ({ page }) => {
    await page.goto(`/en/careers/${SLUG.pk}`);
    const salary = page.getByTestId('careers-apply-form').locator('input[name="expectedSalary"]');
    await expect(salary).toBeVisible();
    await expect(salary).toHaveAttribute('required', '');
    await expect(page.getByTestId('careers-apply-form')).toContainText('PKR');
  });

  test('a portfolio opening shows the apply-by-e-mail panel and no form (W3/W56)', async ({ page }) => {
    await page.goto(`/kariyer/${SLUG.portfolio}`);
    await expect(page.getByTestId('careers-email-apply')).toBeVisible();
    await expect(page.getByTestId('careers-apply-form')).toHaveCount(0);
    await expect(page.getByTestId('careers-email-apply').getByRole('link', { name: /E-posta/ })).toHaveAttribute(
      'href',
      /^mailto:careers@jobsadmire\.com\?subject=/,
    );
  });

  test('an unknown slug is a 404 inside the chrome', async ({ page }) => {
    const res = await page.goto('/kariyer/no-such-role');
    expect(res?.status()).toBe(404);
    await expect(page.locator('header')).toBeVisible();
  });

  test('the sitemap lists every fixture detail page in both locales', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain(`${ORIGIN}/kariyer/${SLUG.uz}`);
    expect(xml).toContain(`${ORIGIN}/en/careers/${SLUG.uz}`);
    expect(xml).toContain(`${ORIGIN}/kariyer/${SLUG.portfolio}`);
    expect(xml).not.toContain('[slug]');
  });
});

test.describe('careers detail — no door', () => {
  test.skip(MOCK, 'the mock-door run covers the detail');
  test('an unknown slug is a 404 inside the chrome, and the sitemap carries no detail entry', async ({ page, request }) => {
    const res = await page.goto('/kariyer/no-such-role');
    expect(res?.status()).toBe(404);
    await expect(page.locator('header')).toBeVisible();
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain(`${ORIGIN}/kariyer`);
    expect(xml).not.toContain('/kariyer/');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run src/lib/seo/sitemap-sources.test.ts src/lib/__tests__/careers.test.ts` → `Cannot find module '@/lib/careers-sitemap'`. `E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/careers.spec.ts` (against the cycle-5 `next start`, no door) → the no-door cases pass, the mock cases skip — `npm run e2e:careers` does not exist yet.

- [ ] **Step 3: Implement**

`src/lib/careers-sitemap.ts`:

```ts
import 'server-only';
import type { MetadataRoute } from 'next';
import type { Locale } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/seo/routes';
import { listOpenings } from './careers';

/** W31: the careers detail entries for one locale, read under the `openings` tag. Empty
 *  without a door or on a feed failure — the static `/careers` entry stays either way. */
export const careersSitemapSource = async (locale: Locale): Promise<MetadataRoute.Sitemap> =>
  (await listOpenings()).map((o) => ({
    url: absoluteUrl(locale, { pathname: '/careers/[slug]', params: { slug: o.slug } }),
    lastModified: new Date(o.postedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
```

`src/lib/seo/sitemap-sources.ts` — add `import { careersSitemapSource } from '@/lib/careers-sitemap';` and change line 16 to:

```ts
export const DETAIL_SITEMAP_SOURCES: readonly SitemapSource[] = Object.freeze([careersSitemapSource]);
```

(`app/sitemap.ts` is unchanged — it already awaits `detailSitemapEntries(locale)` per locale.)

`src/app/api/site-health/route.ts` — add `import { openingsFailureCount } from './openings';` beside the `./ops` import, and after the `formBeacons: formBeaconCount(),` line add:

```ts
      // Best-effort per instance (site-health/openings.ts): openings-feed failures (list or
      // detail) since this instance started — rising beside `ops.state: 'ok'` means the public
      // careers API, not the website door, is the one failing.
      openingsFailures: openingsFailureCount(),
```

`e2e/mocks/careers-door.mjs`:

```js
// The Operations careers-public door, faked: the three public routes the careers pages call,
// answering the exact `shapePublicOpening` shape, and a 401 for every website-door route (no
// token configured — so every form submit ends on the D11 fallback panel deterministically).
// Started by e2e/mocks/run-careers.sh; never part of the gate or the build.
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';

const PORT = Number(process.env.CAREERS_MOCK_PORT ?? 4980);
const daysAgo = (d) => new Date(Date.now() - d * 86_400_000).toISOString();

const base = {
  city: null,
  cities: [],
  employmentArrangement: null,
  employmentArrangements: [],
  workMode: null,
  workModes: [],
  description: null,
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: null,
  salaryPayType: null,
  salaryPeriod: null,
  salaryVisible: false,
  payCurrency: null,
  portfolioRequired: false,
  requiredLanguage: null,
  requiredLanguages: [],
};

/** Five fixtures: 3 overseas (UZ new, PK, IN old) + 2 Antalya (one portfolio, one new). */
export const OPENINGS = [
  {
    ...base,
    slug: 'country-representative-uzbekistan',
    title: 'Country Representative — Uzbekistan',
    country: 'UZ',
    city: 'Tashkent',
    cities: ['Tashkent'],
    category: 'COUNTRY_REPRESENTATIVE',
    workMode: 'REMOTE',
    workModes: ['REMOTE'],
    description:
      'Own our whole pipeline in Uzbekistan — partners, candidates and quality.\n\nWhat you will do:\n- Find and manage licensed partner agencies and vocational institutes\n- Run first interviews and confirm each candidate’s real skill level\n- Check passports, certificates and police records before a file moves\n\nWhat we look for:\n- A working network among agencies, institutes or trade centres\n- Uzbek and Russian; English enough to write a clear report',
    salaryMin: '800',
    salaryMax: '1200',
    salaryCurrency: 'USD',
    salaryPayType: 'RANGE',
    salaryPeriod: 'MONTH',
    salaryVisible: true,
    payCurrency: 'USD',
    requiredLanguage: 'Uzbek',
    requiredLanguages: ['Uzbek', 'Russian', 'English'],
    postedAt: daysAgo(3),
  },
  {
    ...base,
    slug: 'sourcing-coordinator-pakistan',
    title: 'Sourcing Coordinator — Pakistan',
    country: 'PK',
    city: 'Karachi',
    cities: ['Karachi', 'Lahore'],
    category: 'FREELANCER',
    workMode: 'HYBRID',
    workModes: ['HYBRID'],
    description: 'A few agreed hours a week alongside your existing agency or training centre.\n- Shortlist candidates against a live job order\n- Collect and verify basic documents before we open a file',
    payCurrency: 'PKR',
    requiredLanguages: ['Urdu', 'English'],
    postedAt: daysAgo(10),
  },
  {
    ...base,
    slug: 'content-seo-specialist-antalya',
    title: 'Content & SEO Specialist',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    workMode: 'HYBRID',
    workModes: ['HYBRID', 'REMOTE'],
    description: 'Turn our permit and hiring knowledge into pages employers actually find.\n- Write and translate guides in Turkish and English\n- Improve on-page SEO and track what ranks\n\nPortfolio matters more than a diploma.',
    payCurrency: 'TRY',
    portfolioRequired: true,
    requiredLanguages: ['Turkish', 'English'],
    postedAt: daysAgo(20),
  },
  {
    ...base,
    slug: 'work-permit-officer-antalya',
    title: 'Work Permit & Documentation Officer',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    workMode: 'ON_SITE',
    workModes: ['ON_SITE'],
    description: 'Own the paperwork that decides whether a worker legally starts or not.',
    salaryMin: '45000',
    salaryMax: '45000',
    salaryCurrency: 'TRY',
    salaryPayType: 'EXACT',
    salaryPeriod: 'MONTH',
    salaryVisible: true,
    payCurrency: 'TRY',
    requiredLanguages: ['Turkish'],
    postedAt: daysAgo(1),
  },
  {
    ...base,
    slug: 'trade-test-assessor-india',
    title: 'Trade Test & Skills Assessor',
    country: 'IN',
    category: 'PROJECT_BASED',
    workMode: 'ON_SITE',
    workModes: ['ON_SITE'],
    description: 'Test the trade before the ticket — welders, machine operators, cooks, technicians.',
    requiredLanguages: ['Hindi', 'English'],
    postedAt: daysAgo(40),
  },
];

const send = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'private, no-store' });
  res.end(JSON.stringify(body));
};

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`);
  const detail = url.pathname.match(/^\/api\/careers\/openings\/([^/]+)$/);
  if (req.method === 'GET' && url.pathname === '/api/careers/openings') {
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 50);
    const page = Math.max(Number(url.searchParams.get('page') ?? 1), 1);
    const data = OPENINGS.slice((page - 1) * limit, page * limit);
    return send(res, 200, {
      data,
      meta: { total: OPENINGS.length, page, limit, totalPages: Math.ceil(OPENINGS.length / limit) },
    });
  }
  if (req.method === 'GET' && detail) {
    const opening = OPENINGS.find((o) => o.slug === decodeURIComponent(detail[1]));
    return opening
      ? send(res, 200, { data: opening })
      : send(res, 404, { statusCode: 404, message: 'Opening not found', error: 'Not Found' });
  }
  if (req.method === 'POST' && url.pathname === '/api/careers/upload-cv') {
    req.on('data', () => {});
    req.on('end', () => {
      const type = req.headers['content-type'] ?? '';
      if (!type.startsWith('multipart/form-data'))
        return send(res, 400, { statusCode: 400, message: 'Missing "file" field' });
      const key = `careers-cv/${randomUUID()}.pdf`;
      send(res, 200, { data: { url: `http://127.0.0.1:${PORT}/uploads/${key}`, key, fileName: 'cv.pdf' } });
    });
    return;
  }
  if (url.pathname.startsWith('/api/website/v1/'))
    return send(res, 401, { statusCode: 401, message: 'Website intake is not configured.' });
  send(res, 404, { statusCode: 404, message: 'Not Found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[careers-door] mock listening on http://127.0.0.1:${PORT} (${OPENINGS.length} openings)`);
});
```

`e2e/mocks/run-careers.sh`:

```bash
#!/usr/bin/env bash
# The careers detail run: the fixture door, a build whose generateStaticParams sees it, a
# `next start` against it, then e2e/pages/careers.spec.ts with the mock half enabled.
# Not part of the gate (a preview has no opening to point the gate at — W21 note in T11).
# The build this leaves in .next carries the fixture openings: run `npm run build` again
# before any other local gate run.
set -euo pipefail
MOCK_PORT="${CAREERS_MOCK_PORT:-4980}"
SITE_PORT="${CAREERS_SITE_PORT:-3101}"
export OPS_API_URL="http://127.0.0.1:${MOCK_PORT}"
# No write/test token: the website door stays `unauthorized` without a call, so every apply
# ends on the D11 fallback panel — the deterministic contract every page e2e asserts.
unset OPS_WEBSITE_WRITE_TOKEN OPS_WEBSITE_TEST_TOKEN

node e2e/mocks/careers-door.mjs &
MOCK_PID=$!
SITE_PID=""
trap 'kill "$MOCK_PID" ${SITE_PID:+"$SITE_PID"} 2>/dev/null || true' EXIT
until curl -sf "${OPS_API_URL}/api/careers/openings" >/dev/null; do sleep 0.3; done

npm run build
npx next start -p "$SITE_PORT" &
SITE_PID=$!
until curl -sf "http://localhost:${SITE_PORT}/kariyer" >/dev/null; do sleep 0.5; done

E2E_BASE_URL="http://localhost:${SITE_PORT}" E2E_CAREERS_MOCK=1 npx playwright test e2e/pages/careers.spec.ts
```

`package.json` — beside `"e2e": "playwright test",` add `"e2e:careers": "bash e2e/mocks/run-careers.sh",` (and `chmod +x e2e/mocks/run-careers.sh`).

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write src/lib e2e src/app/api/site-health` → `npm run verify` green (ESLint lints `e2e/mocks/careers-door.mjs` as plain ESM — no `require`, no unused vars). `npm run e2e:careers` → the mock half green on both projects (index filters/show-more, the five detail cases, the sitemap case), the no-door half skipped. Then `npm run build` again (clears the fixture build) and, against `npm run start` on :3000, `E2E_BASE_URL=http://localhost:3000 npm run gate` → Playwright green including the no-door half of this spec, the page-contract loop over `/kariyer` and `/en/careers`, axe and the width sweep on both; Lighthouse over the indexable routes; `npm run js-size` → note the two careers rows (expected ≈ 185–192 KB gz: the shell + `RolesList`/`RadioChips` ≈ 6 KB; if a row is above the 194,560 B lazy line, the fix is `next/dynamic` on `RolesList` **with** `ssr: true` and a `loading` skeleton, never `ssr:false` — the list is SEO-bearing). `curl -s localhost:3000/api/site-health | jq .openingsFailures` → `0`.

- [ ] **Step 5: Commit**

```
feat(careers): openings sitemap source (W70), site-health openingsFailures, fixture door + npm run e2e:careers, page e2e in both modes

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 7 — docs and the ledger line

- [ ] **Step 1: Write the failing test**

Docs cycle: no unit test. The check is `npm run format` (Prettier over the Markdown tables) inside `npm run verify`.

- [ ] **Step 2: Run to verify it fails**

n/a.

- [ ] **Step 3: Implement**

`docs/SEO.md` — in the `## Pages` table (created by the first page task after `## JSON-LD`; if absent, add the section with the same header and columns as the About task's cycle 6) append:

```markdown
| Careers index  | `/kariyer`, `/en/careers`               | `sys.seo.careers.{title,description}` (the package has no SEO strings; page record `titleId` is `''`)                                     | self + tr/en + x-default=tr via `buildMetadata`                                                    | `BreadcrumbList` (Home → Careers) via `Breadcrumbs`; `FAQPage` (8 pairs, `jt.245`–`jt.260`) via `FaqBlock`; **no `JobPosting`** (D15) | `h1` (`data-lcp-slot="h1"`, dark text-only hero — no photography on this page)        |
| Careers detail | `/kariyer/[slug]`, `/en/careers/[slug]` | `sys.seo.careersDetail.title` (`{title}` = the opening's title) / the opening's first paragraph, else `sys.seo.careersDetail.description` | self + tr/en + x-default=tr from the typed dynamic `href` — the API slug is shared by both locales | `BreadcrumbList` (Home → Careers → title); `JobPosting` via `jobPostingJsonLd` (`datePosted` = the API's `postedAt`; no `validThrough` — none exists, D17; `baseSalary` only when the opening shows its pay) | `h1` (`data-lcp-slot="h1"`)                                                            |
```

Under `## Sitemap`, append one sentence after the paragraph that describes `DETAIL_SITEMAP_SOURCES`: `The careers page task (WP2 T11) registered the first source, `careersSitemapSource` (`src/lib/careers-sitemap.ts`): every current opening from `GET /api/careers/openings` under the `openings` tag, one `/kariyer/<slug>` + one `/en/careers/<slug>` entry, `lastModified` = `postedAt`; without a door the source is empty and only the static `/careers` pair is listed.`

Under `## JSON-LD`, the `JobPosting` row stays (it already says "Careers **detail** only"); append after the table: `As built (WP2 T11): the detail page renders `jobPostingJsonLd` from the live opening — `employmentType` maps the API's four categories onto Google's enum (`FULL_TIME`→`FULL_TIME`, `FREELANCER`/`COUNTRY_REPRESENTATIVE`→`CONTRACTOR`, `PROJECT_BASED`→`TEMPORARY`), `jobLocation` is the first city + the ISO-2 country, `identifier` is the public slug. The index carries none of it.`

`docs/ANALYTICS.md` — in the `## Event schema` table add the row (Task 3 added the event to `ALLOWED_PARAMS`; if the row is already there from Task 3's docs edit, leave it):

```markdown
| `career_apply_start` | First interaction (focus) with the apply form on a careers detail page, once per mount | `page`, `locale`, `slug` (the opening's public URL segment, ≤ 80 chars — never a visitor identifier, W67) |
```

and, after the `**Page wiring (WP2).**` paragraphs earlier page tasks added, add:

```markdown
**Careers (WP2 T11).** `/kariyer` · `/en/careers`: `whatsapp_click` / `email_click` with `placement: 'page_cta'` from the open-application card (WhatsApp / "Email CV instead"), the per-role "Ask a question first" links and the FAQ footer mail link (`ContactCta`/`ContactLink`). `/kariyer/[slug]`: `career_apply_start` with `slug` from `ApplyStartPing` on the first `focusin` inside the apply form; `whatsapp_click` (`page_cta`) from the hero "Ask a question first" and the portfolio e-mail panel; `whatsapp_click`/`call_click`/`email_click` with `placement: 'form_fallback'` from the form's fallback panel; `generate_lead` and `conversion` for `form_key: 'careers'` from the kernel and `/tesekkurler`. The filter chips, show-more and the detail links fire nothing. No new event or parameter.
```

`docs/CONTENT-MODEL.md` — in the `sys.<page>.*` inventory list (the `### Adding copy (W9, W23, W54)` section) add:

```markdown
- **Careers index + detail (WP2 T11):** `careers.hero.seeOpenings` (ICU `{count}` — replaces `jt.025`/`jt.288`, whose Turkish hard-types "dört"), `careers.filters.all`, `careers.roles.{resultAll,resultFiltered,showMore,posted}` (ICU — replace the composed `jt.302`–`jt.308` count labels), `careers.category.freelancer` (the one API category the package has no label for), `careers.workMode.{REMOTE,HYBRID,ON_SITE}`, `careers.salary.{range,from,upTo}` + `careers.salary.per.{HOUR,DAY,WEEK,MONTH,YEAR}`, `careers.empty.{title,body}` (W6), `careers.detail.{back,about,applyLead,whatsappIntro}` + `careers.detail.facts.{title,country,city,workMode,languages,salary,posted,portfolio}`, `careers.form.{residency,expectedSalaryHint,closed,portfolioGate}`, `careers.emailPanel.{title,body,subject,email}` (the W3/W56 portfolio branch), `careers.apply.{whatsapp,emailSubject}` (the speculative WhatsApp/e-mail doors), and `seo.careers.*` / `seo.careersDetail.*` (the package has no SEO strings for either route). Deliberately unrendered package ids: `jt.144`–`jt.244` (the nine fixture roles — the list is live, D23), `jt.289`–`jt.301` (country chips → the `sourceCountries` collection, D17), `jt.097`–`jt.102`/`jt.108`–`jt.110`/`jt.284`–`jt.285`/`jt.313`–`jt.321` (the speculative form and its WhatsApp body — W3, no form in Phase A).
```

In `## Collections`, append: `The careers pages read no collection of their own: openings come live from Operations (`src/lib/careers.ts`, ISR tag `openings`, 300 s floor — docs/ARCHITECTURE.md § Freshness), and the page uses `countries` (names for the location line and the apply form's ISO-2 select) and `sourceCountries` (the hero's country chips).`

`docs/ARCHITECTURE.md` — in `## Freshness: ISR tags and time floors (D8)`, after the time-floor table, add:

```markdown
**Openings (WP2 T11, I6).** `src/lib/careers.ts` (`server-only`) reads `GET ${OPS_API_URL}/api/careers/openings?page=&limit=50` (up to five pages) and `GET …/openings/:slug` with `next: { tags: ['openings'], revalidate: 300 }`, validates every row against `PublicOpeningSchema` (`src/lib/careers-pure.ts`, the exact `shapePublicOpening` shape), and is React-`cache`d per request. Failure policy: the **list** degrades to `[]` (the index shows its W6 empty state, the sitemap source is empty) and increments the per-instance `openingsFailures` counter `/api/site-health` reports; the **detail** returns `null` only for a real 404 (→ `notFound()`), and throws `OpeningsUnavailableError` for anything else so the `(site)` error boundary renders and ISR keeps the last-good page — an outage must never de-index a live opening. With no `OPS_API_URL` (previews, local builds) both return empty/`null` without a call and without counting. `/careers/[slug]` declares `generateStaticParams` over the current slugs (both locales — the slug is locale-independent) and `revalidate = 300`; unknown-but-later-published slugs render on demand. `POST /api/careers/upload-cv` is called only from the apply server action (`uploadCv`, WP2a) — never from the browser.
```

`docs/INTEGRATIONS.md` — replace the I5 and I6 paragraphs:

```markdown
## I5 — Staff application + CV proxy

**Direction:** Website → Ops → `CareersPublicService.apply` (through the `careers` form handler). **Auth:** write token on `POST /api/website/v1/forms/careers`; the CV goes first to the public `POST ${OPS_API_URL}/api/careers/upload-cv` (multipart `file`, PDF only, ≤ 5 MB, no auth, no captcha) and its returned `key` rides as `fields.cvKey`. **Shape (as built, WP2 T11):** `fields` = `openingSlug`\*, `cvKey`\*, `name`\*, `email`\*, `phone`\*, `country`\* (ISO-2, must equal the opening's country — residency rule), `city`, `language`, `expectedSalary` (+ `expectedSalaryCurrency` = the opening's `payCurrency`; required for `PK` openings), `linkedinUrl`, `portfolioUrl` (catalog v1.1, W16 — rides as the last paragraph of `coverLetter` on the Ops side), `coverLetter`; never `currentSalary*`. The website enforces the residency, PK-salary and portfolio rules **before** the upload (`apply-spec.ts`), so a refused application never reaches WhatsApp for a mistake the page can name. **Failure/degraded:** the D11 fallback panel; a `200 + status FAILED + error` (RC26) shows the door's own visitor message. **W56:** openings with `portfolioRequired` still need a portfolio *document* the door cannot carry, so the detail page renders an apply-by-e-mail panel for them (`PORTFOLIO_GATE_RELAXED` in `src/lib/careers-pure.ts` flips the branch when Ops accepts `portfolioUrl` as satisfying the gate).

## I6 — Openings list/detail

**Direction:** Ops → Website, read server-side (never from the browser). **Auth:** none (public). **Shape (as built):** `GET /api/careers/openings?page&limit` → `{ data: PublicOpening[], meta: { total, page, limit, totalPages } }`; `GET /api/careers/openings/:slug` → `{ data: PublicOpening }` or 404 `Opening not found`. `PublicOpening` = `{ slug, title, country (Country.code), city, cities[], category (FULL_TIME | FREELANCER | PROJECT_BASED | COUNTRY_REPRESENTATIVE), employmentArrangement(s), workMode(s) (REMOTE | HYBRID | ON_SITE), description (one field; requirements folded in), salaryMin/Max/Currency/PayType/Period (null when `salaryVisible` is false), salaryVisible, payCurrency, portfolioRequired, requiredLanguage(s), postedAt }` — pinned by `PublicOpeningSchema` (`src/lib/careers-pure.ts`); a row that fails it counts as a feed failure. Only `OPEN` + `isPubliclyListed` + slugged openings are served, newest first. **Freshness:** ISR tag `openings`, 300 s floor (docs/ARCHITECTURE.md § Freshness); Operations revalidates the tag on publish/close. **Failure/degraded:** list → empty state + `openingsFailures` on `/api/site-health`; detail → last-good ISR page (error boundary on a cold miss), a real 404 only for a 404.
```

`docs/OPERATING.md` — after the sentence that introduces `formBeacons` on the site-health body (Task 2's edit), add: `**`openingsFailures`** (WP2 T11) counts, per instance, the times the public careers API failed to answer the careers pages (list or detail); a number rising while `ops.state` is `ok` points at `careers-public` on Operations, not at the website door — check `https://operations.jobsadmire.com/api/careers/openings` by hand.`

Ledger (append to the WP2b plan's ledger table, `docs/superpowers/plans/2026-09-20-wp2b-pages.md`):

```markdown
| T11 Careers index + detail | `/kariyer`, `/en/careers` (+ `/kariyer/[slug]`, `/en/careers/[slug]` via `npm run e2e:careers`) | script <n> B gz per index route from `npm run js-size` (ceiling 204,800; lazy line 194,560; the detail's script size measured by hand with `lhci collect --url=http://localhost:3101/kariyer/country-representative-uzbekistan` during the mock run) | Lighthouse <perf>/<a11y>/<bp>/<seo> (preview run, index routes) | pixel: n/a — not a D27 harness page (side-by-side review; deltas: role cards link to the detail instead of expanding, "See N open positions" scrolls without pre-filtering, ways cards static on mobile, FAQ two-column block, speculative form → WhatsApp/e-mail, country chips from the collection, no "New" for roles older than 14 days) |
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npm run verify` → green (Prettier accepts the tables; no code changed). Re-read the doc diffs against the pages once: every claim in them is something cycles 1–6 render or enforce. Cross-repo check (CLAUDE.md checklist item 4): the Ops `docs/PRD.md` §5.12 already documents `careers` v1.1 (`portfolioUrl`, W16/T0f) and the residency/PK/portfolio rules — nothing to change there; note in the commit body that I5/I6 are now the as-built contract.

- [ ] **Step 5: Commit**

```
docs(careers): SEO page rows + JobPosting note, analytics wiring, sys.careers namespace, openings data layer (ARCHITECTURE), I5/I6 as built, site-health field, ledger

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

**Docs in this task:** `docs/SEO.md` (two Pages rows, the sitemap source sentence, the JobPosting as-built note), `docs/ANALYTICS.md` (`career_apply_start` row if missing + the Careers page-wiring paragraph), `docs/CONTENT-MODEL.md` (`sys.careers.*` bullet with the unrendered-id list; the collections sentence), `docs/ARCHITECTURE.md` (§ Freshness — the openings data layer and failure policy), `docs/INTEGRATIONS.md` (I5 + I6 rewritten as built), `docs/OPERATING.md` (`openingsFailures`), the WP2b ledger row. `docs/PRD.md`: no change — §2 rows 8/— already state "staff application via careers detail (`CAREERS_APPLY`)" and "`JobPosting` JSON-LD (D15)", which is exactly what ships.

**Sys keys added:** (46)
`seo.careers.title`, `seo.careers.description`, `seo.careersDetail.title`, `seo.careersDetail.description`, `careers.hero.seeOpenings`, `careers.filters.all`, `careers.roles.resultAll`, `careers.roles.resultFiltered`, `careers.roles.showMore`, `careers.roles.posted`, `careers.category.freelancer`, `careers.workMode.REMOTE`, `careers.workMode.HYBRID`, `careers.workMode.ON_SITE`, `careers.salary.range`, `careers.salary.from`, `careers.salary.upTo`, `careers.salary.per.HOUR`, `careers.salary.per.DAY`, `careers.salary.per.WEEK`, `careers.salary.per.MONTH`, `careers.salary.per.YEAR`, `careers.empty.title`, `careers.empty.body`, `careers.detail.back`, `careers.detail.about`, `careers.detail.applyLead`, `careers.detail.whatsappIntro`, `careers.detail.facts.title`, `careers.detail.facts.country`, `careers.detail.facts.city`, `careers.detail.facts.workMode`, `careers.detail.facts.languages`, `careers.detail.facts.salary`, `careers.detail.facts.posted`, `careers.detail.facts.portfolio`, `careers.form.residency`, `careers.form.expectedSalaryHint`, `careers.form.closed`, `careers.form.portfolioGate`, `careers.emailPanel.title`, `careers.emailPanel.body`, `careers.emailPanel.subject`, `careers.emailPanel.email`, `careers.apply.whatsapp`, `careers.apply.emailSubject`.

**Package ids used:** 132 — first `jt.005`, last `jt.312`. In full: `jt.005`, `jt.021` (crumbs), `jt.022`–`jt.024`, `jt.026`–`jt.049` (hero, chips, notice, roles header, filters), `jt.052`–`jt.059`, `jt.060`–`jt.079` (ways), `jt.080`–`jt.088`, `jt.089`–`jt.094` (open application), `jt.095`, `jt.096`, `jt.099`, `jt.100`, `jt.103`, `jt.104`, `jt.105`, `jt.106`, `jt.107` (TR deliberately empty), `jt.111`–`jt.115` (FAQ), `jt.117` (e-mail panel's WhatsApp label), `jt.143` (category label), `jt.245`–`jt.260` (8 FAQ pairs), `jt.261`, `jt.262` (place filters), `jt.263`–`jt.283` (7 steps × title/body/when), `jt.286` (speculative WhatsApp prefill), `jt.287` (count pill suffix), `jt.306` (show fewer), `jt.310` (view label, typed for the island), `jt.311`, `jt.312` (ask-a-question prefill). Deliberately NOT rendered: `jt.001`–`jt.004`, `jt.006`–`jt.020`, `jt.116`, `jt.118`–`jt.142` (chrome/footer — R15), `jt.025`/`jt.288` (TR hard-types "dört" → `sys.careers.hero.seeOpenings`), `jt.050`/`jt.051` (the duties/wants split the API does not have → `sys.careers.detail.about`), `jt.097`/`jt.098`/`jt.101`/`jt.102`/`jt.284`/`jt.285` (the speculative form — W3), `jt.108`–`jt.110` (WhatsApp-specific success copy — D13), `jt.144`–`jt.244` (the nine fixture roles — D23), `jt.289`–`jt.301` (country chips → `sourceCountries`, D17), `jt.302`–`jt.305`/`jt.307`/`jt.308` (composed count labels → sys ICU), `jt.313`–`jt.321` (the WhatsApp message body of the removed form). Rendered as authored though flagged for the WP-C copy review: `jt.046` ("you get a reference number" — true through the Ops confirmation e-mail, not through the website door, X11), `jt.096` ("we reply within a week", parity-baselined, vs the `replySlaHours` metric), `jt.082`/`jt.256` ("two to three weeks"), the seven `when` labels `jt.265`/`jt.268`/`jt.271`/`jt.274`/`jt.277`/`jt.280`/`jt.283`. All 321 `jt.*` ids verified present in `src/content/local/catalogue.json`.

**Foundation gaps:** (1) `Field` has no `defaultValue`/`disabled` prop, so the residency-locked country select cannot be a `Field` — `CountryField.tsx` re-implements the labelled select over `FormField` + `INPUT_CLASS` + the two context hooks; a `defaultValue?: string` on `Field` would delete that file. (2) The frozen `Settings` contract has no field for the Operations candidate-portal host (D15 links `jt.047`, `jt.085`, `jt.106`) — `OPS_CAREERS_PORTAL` is a constant in `src/lib/careers-pure.ts` until a contract 1.1 adds `portal.careersHost` or similar. (3) `ProcessSteps` has no badge/`when`-pill slot, so the Admira AI process is a page-local `HiringSteps`; `FaqBlock` is two-column while the design centres one column (accepted). (4) `EmptyState.cta.href` and `Cta.href` are plain strings — `#apply` (same page) is fine here, but a cross-locale internal target would need the `Href` object form noted by T6. (5) The brief's "API mocked via a Playwright route" is not achievable for server-side fetches — replaced by the Node fixture door + `npm run e2e:careers`; T15 should add one real detail slug to `GATE_ROUTE_TABLE` once staging lists an opening (W21). (6) W56 stands: `Opening.portfolioRequired` openings apply by e-mail; the `PORTFOLIO_GATE_RELAXED` flag and the already-sent `portfolioUrl` field make the flip a one-line change when the owner decides.
