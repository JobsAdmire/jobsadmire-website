### Task 1: Homepage (`/` and `/en`) — the first designed page on the WP2a foundation (pixel-harness page, D27)

Replaces the WP1 spike homepage (`src/app/[locale]/(site)/page.tsx` as left by WP2a T3/T7: a tagged `<h1 data-testid="page-h1" data-lcp-slot="h1">` plus a `<Link href="/hire-workers">hire</Link>`) with the designed page `design-package/design/JobsAdmire Homepage v4.dc.html`, section for section, on the WP1 primitives, the WP2a data layer (`src/content/collections.ts`, landed on `wp2/foundation` as T0b), the forms kernel (T0a), the chrome/SEO/blocks/islands/gate tooling (T0c–T0e) and the calculator engine (T0g / "Task 9"). Every string is a package id read through `makeTf(bundle, locale)` (D17 placeholders filled) or a `sys.home.*` / `sys.seo.home.*` key read through next-intl (W9/W23). Every number comes from the `metrics` / `rateConfig` / `calculatorRoles` / `sourceCountries` collections (W1/W2/D17). Rulings that shape this page: **W1** (metrics), **W2/W58** (one engine, support OFF in the teaser), **W3/W16** (hero form → `hire` with required `name` + `email`, optional `city`; call-me-back → `callback`; stable option keys), **W4** (guides block hidden below the blog threshold), **W6/D2/D23** (ticker, pool cards, team/founder, logos hidden or in an empty state — rendered by data, never deleted), **W7** (Karachi = sourcing office — only through the importer's override of `home.134`/`home.197`, nothing here), **W9/W23** (missing copy in `sys.home.*`), **W10** (design's ≤460 px hide/show via CSS classes, not conditional rendering), **W12** (only allow-listed events; enum params), **W13 amended** (heavy islands lazy on viewport; 204,800 B ceiling), **W14** (pre-rendered `SourceMap`, sprite `Flag`, no runtime fetches), **W17** (`CTA_BY_PATHNAME['/']` names `#proposal` — this page must render that id), **W18** (`StickyCtaBar hideNearId`), **W19** (route group `(site)`), **W20/W21** (`UNBUILT_PATHNAMES` and `e2e/routes.ts` — `/` and `/en` are already listed; nothing to add or delete, verified in Cycle 6), **W55** (named placeholders), **W61** (`ImageSlot` LCP attributes), **W71** (blocks resolve ids via `makeTf`).

**Design deltas this task makes on purpose (record them in the pixel ledger, D20/D27):** the hero form gains a required contact `name` and `email` (W3) and keeps `city` (W16); the two option selects post stable keys (`factory`, `now`, …), labels stay the package's; the "call me back" mode is a separate `callback` form (name, phone, preferred time, topic) rather than the design's same-fields toggle (W3); the live case ticker, the candidate pool cards, the hero "All cases are public →" proof cell and the whole "Our team" section render nothing in Phase A because their collections (`stories`, `pool`, `representatives`) are empty and fixture-only (W6, D2, D23, §10 row 3); the candidate pool section shows a designed empty state instead (W6); the calculator teaser's General figure is the model's ₺40,214 with the minimum-wage support **off** (W58) and the support row says "optional — on the full calculator"; the FAQ block is single-column-per-item via `FaqBlock` (`singleOpen={false}` keeps the design's independent toggles); the hero photograph slot `v4-hero` is a named placeholder until §10 row 4 ships, so the LCP element is the h1 (D26, T0e markup contract); the iOS badge is absent (W8) and the portal panel's platform line says "Android" only; the "Report fraud" CTA links to the Verify page's fraud form (`/verify#report`, the id T5/Verify must render — `CTA_BY_PATHNAME['/verify']`) instead of a WhatsApp prefill; the header/sticky CTAs carry no `tel:`/`wa.me` anchors so nothing on this page is an untracked contact link (every contact anchor renders through `ContactLink`/`ContactCta`, W12/W32).

**Files:**

Create
- `src/app/[locale]/(site)/actions.ts` — `'use server'`: `submitHire`, `submitCallback`
- `src/app/[locale]/(site)/_lib/forms.ts` — pure: option keys, Zod schemas, `toFields` mappers (catalog names)
- `src/app/[locale]/(site)/_lib/forms.test.ts`
- `src/app/[locale]/(site)/_lib/phase-a.ts` — pure: `rawRows`/`hasRows`/`logoRows` — the "rendered by data" switches (W6)
- `src/app/[locale]/(site)/_lib/phase-a.test.ts`
- `src/app/[locale]/(site)/_lib/teaser.ts` — pure: the teaser's view model over the engine (server + island share it)
- `src/app/[locale]/(site)/_lib/teaser.test.ts`
- `src/app/[locale]/(site)/_lib/season.ts` — pure: `SEASON_ROWS` (numbers = data), month names, range/headline composition
- `src/app/[locale]/(site)/_lib/season.test.ts`
- `src/app/[locale]/(site)/_lib/guides.ts` — pure: `guidesPosts(bundle, locale)` (written articles only, newest first)
- `src/app/[locale]/(site)/_lib/guides.test.ts`
- `src/app/[locale]/(site)/_components/LiveDot.tsx` — the design's green dot (no directive)
- `src/app/[locale]/(site)/_components/HeroLeadForm.tsx` — `'use client'` island (eager; above the fold)
- `src/app/[locale]/(site)/_components/HeroLeadForm.test.tsx`
- `src/app/[locale]/(site)/_components/useInView.ts` — `'use client'` hook (viewport-lazy islands, W13)
- `src/app/[locale]/(site)/_components/TeaserChips.tsx` — presentational (no directive; server fallback + island)
- `src/app/[locale]/(site)/_components/TeaserCard.tsx` — presentational
- `src/app/[locale]/(site)/_components/TeaserLayout.tsx` — presentational
- `src/app/[locale]/(site)/_components/CalculatorTeaser.tsx` — `'use client'` island (lazy)
- `src/app/[locale]/(site)/_components/CalculatorTeaser.test.tsx`
- `src/app/[locale]/(site)/_components/CalculatorTeaserLazy.tsx` — `'use client'` lazy wrapper
- `src/app/[locale]/(site)/_components/SeasonGrid.tsx` — presentational
- `src/app/[locale]/(site)/_components/SeasonPlanner.tsx` — `'use client'` island (lazy)
- `src/app/[locale]/(site)/_components/SeasonPlannerLazy.tsx` — `'use client'` lazy wrapper
- `src/app/[locale]/(site)/_sections/types.ts` — `SectionProps`
- `src/app/[locale]/(site)/_sections/hero.tsx` — `Hero` (badge, h1, sub, CTAs, photo slot, lead form, stats, proof cell, logo slot)
- `src/app/[locale]/(site)/_sections/ticker.tsx` — `LiveCaseBar` (hidden by data)
- `src/app/[locale]/(site)/_sections/choice.tsx` — `ChoiceCards` (≤460 only, W10)
- `src/app/[locale]/(site)/_sections/pool.tsx` — `PoolSection` (empty state, W6)
- `src/app/[locale]/(site)/_sections/calculator.tsx` — `CalculatorStrip`
- `src/app/[locale]/(site)/_sections/process.tsx` — `ProcessSection`
- `src/app/[locale]/(site)/_sections/season.tsx` — `SeasonSection`
- `src/app/[locale]/(site)/_sections/network.tsx` — `NetworkSection`
- `src/app/[locale]/(site)/_sections/team.tsx` — `TeamSection` (hidden by data)
- `src/app/[locale]/(site)/_sections/portal.tsx` — `PortalSection`
- `src/app/[locale]/(site)/_sections/work-with-us.tsx` — `WorkWithUs`
- `src/app/[locale]/(site)/_sections/guides.tsx` — `GuidesSection` (hidden below the blog threshold, W4)
- `src/app/[locale]/(site)/_sections/faq.tsx` — `FaqSection`
- `src/app/[locale]/(site)/__tests__/home.copy.test.ts` — the `sys.home.*` key set + the D17 "2026 rates" year guard
- `e2e/pages/home.spec.ts`

Modify
- `src/app/[locale]/(site)/page.tsx` — whole file (38 lines after T0e; the spike body is replaced, the metadata pattern kept)
- `src/messages/tr.json`, `src/messages/en.json` — add `sys.home.*` and `sys.seo.home.*` (both files, identical key sets)
- `docs/SEO.md` — new `## Pages` table (first row: Homepage) inserted before the `## Redirects policy (summary)` heading (line 40 at WP1; anchor on the heading text, W45)
- `docs/ANALYTICS.md` — new `### Per-page wiring` block inserted before the `## Conversion` heading (line 68 at WP1; anchor on the heading text)
- `docs/CONTENT-MODEL.md` — one `sys.home.*` line in `### The sys.* range` after the `Thank-you page:` bullet (line 46 at WP1; after T0b the W54 five-namespace paragraph follows it — insert the bullet before that paragraph)
- `docs/PRD.md` — §2 table row 1 (line 19) and the "spike-era placeholder content" sentence in §11 (line 118 at WP1; anchor on the phrase — T0a/T0d rewrote the surrounding sentence per W65)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T1 ledger row (W22)

Verify only (no edit expected)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE` already carries `{ path: '/', indexable: true }` and `{ path: '/en', indexable: true }` (T0e); assert, do not duplicate (W21)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES` never contained `'/'` (T0d's initial set of 19); `src/lib/seo/unbuilt.test.ts` stays green because the page file keeps its path

Test
- Vitest: the six `*.test.ts(x)` files above; `npm run verify`
- Playwright: `e2e/pages/home.spec.ts` (new), `e2e/routing.spec.ts`, `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` (all already sweep `/` and `/en`)
- Gate: `npm run gate` against the preview; `npm run js-size`; `npm run pixel -- --page=home --locale=tr` and `--locale=en` (two-iteration cap, D27)

**Interfaces:**

Consumes (exact names)
- WP1: `getBundle` (`@/content/adapter`, re-exports `pure.ts`); `Button`, `buttonClassName`, `Section`, `Eyebrow`, `Card` (`@/design/primitives`); `Link`, `getPathname`, `type Href` (`@/i18n/navigation`); `routing`, `type Locale` (`@/i18n/routing`); `buildMetadata` (`@/lib/seo/metadata`); `waLink`, `telLink` (`@/lib/contact`); `formatTRY`, `formatPercent` (`@/lib/format/money`); `track` (`@/analytics/track`); `type FormKey` (`@/analytics/forms`); `renderWithIntl` (`@/test/render`); `type Bundle` (`contract/website-bundle.v1`); the `container-site`, `text-h1/h2/body/body-lg/body-sm/eyebrow/card-title/stat`, `rounded-pill/hero/xl/lg/base`, `shadow-hero-form/card`, `bg-navy/blue/blue-safe/sky/tint/pale-1/pale-2`, `border-border-1/3/4`, `text-text-secondary/tertiary`, `bg-success-surface`, `text-success-text` tokens and the `xs`(461)/`sm`/`md`/`lg`(901)/`xl`(1101) breakpoints (`src/app/globals.css`)
- WP2a T0b (landed): `getCollection`, `getMetric`, `getRateConfig`, `blogNavVisible`, `SECTOR_KEYS`, `type BlogPost`, `type CalculatorRole`, `type RateConfig`, `type SourceCountry`, `type MetricKey` (`@/content/collections`); `makeTf`, `metricValues` (`@/content/pure` / re-exported by the adapter); `bundle.pages.home` = `{ titleId: '', descriptionId: '', robots: 'index', jsonLd: ['organization','website','faq'] }` so `buildMetadata` uses the `sys.seo.home.*` fallbacks (W38)
- WP2a T0a: `createFormAction`, `type FormActionState` (`@/forms/action`); `type WireFields` (`@/forms/wire`); `FormShell` (`@/forms/client/FormShell`); `Field`, `type FieldOption` (`@/forms/client/Field`); the `data-testid="form-fallback"` the shell's `FallbackPanel` carries; `sys.form.labels.{email,preferredTime}`, `sys.form.placeholders.select`, `sys.form.consent.notice`
- WP2a T0c: `ContactLink` (`@/analytics/ContactLink`); `PARAM_ENUMS.placement` includes `'page_cta'`; `CTA_BY_PATHNAME['/']` → `{ pathname: '/', hash: '#proposal' }` (this page renders `id="proposal"`); route group `(site)`; `Button` variant `'inverse'`
- WP2a T0d: `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` (W38 fallbacks); `pageOgImageUrl` is applied inside it — nothing to call
- WP2a T0c/T0d blocks (`@/design/blocks`): `MetricStrip`, `EmptyState`, `ImageSlot`, `ProcessSteps` (`variant="plain"`), `FaqBlock`, `ClosingCtaBand`, `ContactCta`, `PostCard`, `StoreBadges`, `LogoMarquee`, `type Logo`, `type FaqItem`, `type ProcessStep`; `StickyCtaBar` with `hideNearId` (`@/design/chrome/StickyCtaBar`); `testBundle` (`@/test/bundle`)
- WP2a T0d islands/assets: `SourceMap`, `sourceMapLabels` (`@/design/assets/source-map`); `Flag` (`@/design/Flag`); `isFlagCode` (`@/design/assets/flag-codes`)
- WP2a Task 9 (`@/lib/calculator`): `estimate`, `formatEstimate`, `presets`, `multiplierLabel`, `effectiveYear`, `isReviewDue`, `type FormattedEstimate`, `type Estimate`
- WP2a T0e: `GATE_ROUTE_TABLE`/`INDEXABLE_GATE_ROUTES` (`e2e/routes.ts`), `npm run js-size`, `npm run pixel`, the page markup contract (`page-h1`, one `data-lcp-slot`, named `data-placeholder`)
- Operations catalog v1.0 + v1.1 (`website-form-catalog.ts`): `hire` = `name*, company*, email*, phone*, sector, headcount, startWhen, city` (v1.1); `callback` = `name*, phone*, preferredTime, topic`

Produces (what later tasks may rely on)
- `src/app/[locale]/(site)/_components/useInView.ts` — `useInView<T extends HTMLElement>(rootMargin?: string): [RefObject<T | null>, boolean]` — the viewport-lazy pattern (`lazy` + `Suspense` + a server-rendered fallback that is DOM-identical to the island's initial state) other page tasks copy for their heavy islands (calculator page, Work Permit wizard); promotion to `src/design/islands` is a T15 candidate
- `sys.home.whatsapp.{hire,partner,estimate}` — the homepage prefills; the Hire Workers task authors its own `sys.hire.whatsapp.*`
- The pattern for a hidden-by-data section: a server component that reads `hasRows(bundle, key)` and returns `null` (`_lib/phase-a.ts` stays page-local; each page keeps its own copy of the three-line helper or imports this one — importing across page folders is allowed, it is plain TS)

---

#### Cycle 1 — Skeleton: metadata, `sys.home.*` copy, the hero (h1/badge/sub/CTAs/photo slot), stats, the Phase A hidden sections, the pool empty state

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/__tests__/home.copy.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../../contract/website-bundle.v1';
import { getRateConfig } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { effectiveYear } from '@/lib/calculator';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key the homepage reads (W9/W23). A key missing from either file throws at
 *  render in dev and renders the raw key in production — so the set is pinned here. */
export const HOME_SYS_KEYS = [
  'seo.home.title',
  'seo.home.description',
  'home.form.callbackSubmit',
  'home.form.preferredTime.morning',
  'home.form.preferredTime.afternoon',
  'home.form.preferredTime.evening',
  'home.whatsapp.hire',
  'home.whatsapp.partner',
  'home.whatsapp.estimate',
  'home.pool.empty.title',
  'home.pool.empty.body',
  'home.pool.empty.cta',
  'home.calc.eyebrowUndated',
  'home.calc.grossFloor',
  'home.calc.supportSeparate',
  'home.calc.headcount',
  'home.calc.monthlyPayroll',
  'home.season.agricultureSub',
  'home.season.range',
  'home.season.also',
  'home.season.signBy',
  'home.season.noPeak',
  'home.season.gridLabel',
  'home.season.selectHint',
  'home.network.mapTitle',
  'home.network.turkiye',
  'home.portal.platforms',
] as const;

function get(messages: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], messages);
}

describe('sys.home.* / sys.seo.home.*', () => {
  it.each(HOME_SYS_KEYS)('%s exists in both message files as a non-empty string', (key) => {
    for (const messages of [tr, en]) {
      const v = get((messages as { sys: unknown }).sys, key);
      expect(typeof v).toBe('string');
      expect((v as string).length).toBeGreaterThan(0);
    }
  });

  it('the plural and argument keys carry ICU syntax in both locales', () => {
    for (const messages of [tr, en]) {
      const sys = (messages as { sys: unknown }).sys;
      expect(get(sys, 'home.calc.headcount')).toMatch(/\{n, plural,/);
      expect(get(sys, 'home.calc.grossFloor')).toContain('{multiplier}');
      expect(get(sys, 'home.season.signBy')).toContain('{start}');
      expect(get(sys, 'home.season.signBy')).toContain('{signBy}');
      expect(get(sys, 'home.season.noPeak')).toContain('{permitDays}');
      expect(get(sys, 'home.whatsapp.estimate')).toContain('{monthly}');
    }
  });

  it('never hard-types a headline number into the SEO description (D17)', () => {
    for (const messages of [tr, en]) {
      expect(get((messages as { sys: unknown }).sys, 'seo.home.description')).not.toMatch(/\d/);
    }
  });
});

// D17: "2026 rates" (home.068/079) is authored copy the importer leaves verbatim; the page hides
// the badge after reviewDueAt, but the YEAR inside the copy must equal the rate config's year or
// the two disagree on screen. readFileSync is the sanctioned bypass of the local-bundle import rule.
describe('the dated calculator copy agrees with rateConfig.effectiveFrom', () => {
  it.each(['tr', 'en'] as const)('%s: home.068 and home.079 carry effectiveYear', (locale) => {
    const bundle = BundleSchema.parse(
      JSON.parse(readFileSync(`src/content/local/bundle.${locale}.json`, 'utf8')),
    );
    const year = String(effectiveYear(getRateConfig(bundle)));
    const tf = makeTf(bundle, locale);
    expect(tf('home.068')).toContain(year);
    expect(tf('home.079')).toContain(year);
  });
});
```

`src/app/[locale]/(site)/_lib/phase-a.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { hasRows, logoRows, rawRows } from './phase-a';

describe('phase-a switches (W6/D23: hidden by data, never deleted)', () => {
  it('an absent collection reads as empty', () => {
    const bundle = testBundle();
    expect(rawRows(bundle, 'stories')).toEqual([]);
    expect(hasRows(bundle, 'pool')).toBe(false);
    expect(hasRows(bundle, 'representatives')).toBe(false);
    expect(logoRows(bundle)).toEqual([]);
  });

  it('a populated collection flips the switch', () => {
    const bundle = testBundle({ collections: { stories: [{ title: 'x' }] } });
    expect(hasRows(bundle, 'stories')).toBe(true);
  });

  it('logoRows keeps only rows that satisfy the Logo shape', () => {
    const bundle = testBundle({
      collections: {
        logos: [
          { src: '/logos/a.png', alt: 'A', width: 120, height: 40 },
          { src: '', alt: 'broken', width: 120, height: 40 },
          { alt: 'no src' },
        ],
      },
    });
    expect(logoRows(bundle)).toEqual([{ src: '/logos/a.png', alt: 'A', width: 120, height: 40 }]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)"` → `home.copy.test.ts`: 27 × "exists in both message files" fail (`expected 'undefined' to be 'string'`); `phase-a.test.ts` fails to import `./phase-a` (module not found).

- [ ] **Step 3: Implement**

`src/messages/tr.json` — add inside `"sys"`: the `"home"` object after `"thankYou"`, and `"home"` inside the existing `"seo"` object (T0d created `"seo": { "ogTagline": … }`; add the `"home"` sibling — never a second `"seo"` key):

```json
    "seo": {
      "ogTagline": "…(T0d's value, unchanged)…",
      "home": {
        "title": "Yurt Dışından İşçi Temini ve Çalışma İzni | JobsAdmire",
        "description": "Türkiye'deki işverenler için kendi temsilcileriyle yurt dışından nitelikli işçi temini, yasal çalışma izni ve ilk iş gününe kadar tek elden yönetim. Ücretsiz teklif alın."
      }
    },
    "home": {
      "form": {
        "callbackSubmit": "Beni arayın →",
        "preferredTime": {
          "morning": "Sabah (09:00–12:00)",
          "afternoon": "Öğleden sonra (12:00–15:00)",
          "evening": "Akşamüstü (15:00–18:00)"
        }
      },
      "whatsapp": {
        "hire": "Merhaba JobsAdmire, işçi talebi oluşturmak istiyorum.",
        "partner": "Merhaba JobsAdmire, yurt dışında bir işe alım acentesi / kurumuyuz ve tedarik ortağı olmak istiyoruz.",
        "estimate": "Merhaba JobsAdmire, bu hesabı benim için kontrol eder misiniz?\nPozisyon seviyesi: {role}\nİşçi sayısı: {headcount}\nAylık bordro: {monthly}\nİlk yıl tek seferlik: {oneOff}"
      },
      "pool": {
        "empty": {
          "title": "Aday profilleri yakında burada",
          "body": "Adaylar kendi ülkelerinde JobsAdmire temsilcileri tarafından görüşülür ve belgeleri doğrulanır. Sektörünüzü ve ihtiyacınızı yazın; size uygun profilleri doğrudan iletelim.",
          "cta": "Aday talep edin →"
        }
      },
      "calc": {
        "eyebrowUndated": "Gerçek maliyet",
        "grossFloor": "Brüt maaş (yasal tabanın {multiplier} katı)",
        "supportSeparate": "İsteğe bağlı — tam hesaplamada",
        "headcount": "{n, plural, other {# işçi}}",
        "monthlyPayroll": "aylık bordro"
      },
      "season": {
        "agricultureSub": "Antalya, Mersin, Konya",
        "range": "Yoğun {from}–{to}",
        "also": " · ayrıca {from}–{to}",
        "signBy": "{start} ayında başlamak için {signBy} ayına kadar imzalayın",
        "noPeak": "Yoğun sezon yok — ancak izinler yine {permitDays} gün sürer",
        "gridLabel": "Aylara göre sezonluk talep",
        "selectHint": "Bir sezonu seçmek için satırına dokunun"
      },
      "network": {
        "mapTitle": "Kaynak ülkelerden Türkiye'ye",
        "turkiye": "Türkiye"
      },
      "portal": {
        "platforms": "Android"
      }
    }
```

`src/messages/en.json` — the same keys:

```json
    "seo": {
      "ogTagline": "…(T0d's value, unchanged)…",
      "home": {
        "title": "Hire Overseas Workers in Türkiye | JobsAdmire",
        "description": "Skilled workers sourced abroad by our own representatives, legal work permits and arrival — managed end to end for employers in Türkiye. Get a free proposal."
      }
    },
    "home": {
      "form": {
        "callbackSubmit": "Request a call back →",
        "preferredTime": {
          "morning": "Morning (09:00–12:00)",
          "afternoon": "Afternoon (12:00–15:00)",
          "evening": "Late afternoon (15:00–18:00)"
        }
      },
      "whatsapp": {
        "hire": "Hello JobsAdmire, I want to hire workers.",
        "partner": "Hello JobsAdmire, we are a recruitment agency / institute abroad and want to become a sourcing partner.",
        "estimate": "Hello JobsAdmire, please check this estimate for me.\nRole level: {role}\nHeadcount: {headcount}\nMonthly payroll: {monthly}\nFirst-year one-offs: {oneOff}"
      },
      "pool": {
        "empty": {
          "title": "Candidate profiles are coming here",
          "body": "Candidates are interviewed and document-checked in their own country by JobsAdmire representatives. Tell us your sector and headcount and we will send matching profiles directly.",
          "cta": "Request candidates →"
        }
      },
      "calc": {
        "eyebrowUndated": "Real cost",
        "grossFloor": "Gross salary ({multiplier} legal floor)",
        "supportSeparate": "Optional — on the full calculator",
        "headcount": "{n, plural, one {1 worker} other {# workers}}",
        "monthlyPayroll": "monthly payroll"
      },
      "season": {
        "agricultureSub": "Antalya, Mersin, Konya",
        "range": "Peak {from}–{to}",
        "also": " · also {from}–{to}",
        "signBy": "For a {start} start, sign by {signBy}",
        "noPeak": "No peak season — but permits still take {permitDays} days",
        "gridLabel": "Seasonal demand by month",
        "selectHint": "Select a row to plan that season"
      },
      "network": {
        "mapTitle": "From the source countries to Türkiye",
        "turkiye": "Türkiye"
      },
      "portal": {
        "platforms": "Android"
      }
    }
```

`src/app/[locale]/(site)/_lib/phase-a.ts`:

```ts
import { z } from 'zod';
import type { Logo } from '@/design/blocks';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/**
 * W6/D2/D23: the homepage sections that need live data render nothing (or an empty state)
 * until their collection has rows. These are the switches — the sections read them and return
 * `null`; nothing is deleted. `stories`/`pool`/`representatives` are FIXTURE_ONLY (never
 * non-empty under LOCAL in production), `logos` is a Phase B collection with no schema yet.
 */
export type PhaseAKey = 'stories' | 'pool' | 'representatives' | 'logos';

export function rawRows(bundle: Bundle, key: PhaseAKey): Record<string, unknown>[] {
  return bundle.collections[key] ?? [];
}

export function hasRows(bundle: Bundle, key: PhaseAKey): boolean {
  return rawRows(bundle, key).length > 0;
}

const LogoRow = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

/** Rows that satisfy the blocks' `Logo` shape; malformed rows are skipped, never thrown on. */
export function logoRows(bundle: Bundle): Logo[] {
  return rawRows(bundle, 'logos').flatMap((row) => {
    const parsed = LogoRow.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });
}
```

`src/app/[locale]/(site)/_components/LiveDot.tsx`:

```tsx
/** The design's pulsing green dot. Decorative; the animation stops under reduced motion
 *  (globals.css kills every animation there). */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={['inline-block h-2 w-2 shrink-0 rounded-full bg-success motion-safe:animate-pulse', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
```

`src/app/[locale]/(site)/_sections/types.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/** Every homepage section is a server component over the request's bundle; it resolves its
 *  own `makeTf`/`getTranslations` so the page stays a thin composition. */
export type SectionProps = { locale: Locale; bundle: Bundle };
```

`src/app/[locale]/(site)/_sections/hero.tsx` (Cycle 1 version — the `HeroLeadForm` mount is added in Cycle 2; render the form column as an empty `<div id="proposal" />` placeholder for now so `CTA_BY_PATHNAME['/']`'s anchor already resolves):

```tsx
import { makeTf } from '@/content/adapter';
import { ImageSlot, LogoMarquee, MetricStrip } from '@/design/blocks';
import { Button, buttonClassName } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { hasRows, logoRows } from '../_lib/phase-a';
import type { SectionProps } from './types';

/**
 * §10 row 4: the licensed hero photograph. `null` until it ships — the slot then renders as a
 * named placeholder (`data-placeholder="v4-hero"`) and the h1 is the LCP element (D26, T0e
 * markup contract). When the file lands under public/photos/, set the path here and nothing
 * else: `lcp` moves to the image and the h1 drops its attribute.
 */
export const HERO_PHOTO: string | null = null;

export function Hero({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const photoIsLcp = HERO_PHOTO !== null;
  return (
    <section data-testid="hero" className="relative isolate overflow-hidden bg-[#0a1428] text-white">
      <ImageSlot
        slot="v4-hero"
        lcp={photoIsLcp}
        priority={photoIsLcp}
        src={HERO_PHOTO}
        alt=""
        width={1600}
        height={900}
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* The design's two gradient overlays, folded into one. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,20,40,0.35)_0%,rgba(10,20,40,0.82)_65%,#0a1428_100%)]"
      />
      <div className="container-site grid min-h-[660px] items-end gap-10 pb-11 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:min-h-[495px] xl:pb-8 xl:pt-14">
        <div>
          {/* Badge, CTAs and the note are hidden at ≤460 in the design (W10: CSS, not conditional rendering). */}
          <p className="mb-5 hidden items-center gap-2 rounded-pill border border-white/25 px-4 py-2 text-[12.5px] font-bold text-white/85 xs:inline-flex">
            {tf('home.017')}
          </p>
          <h1
            data-testid="page-h1"
            data-lcp-slot={photoIsLcp ? undefined : 'h1'}
            className="m-0 mb-5 max-w-[640px] text-h1 leading-none tracking-[-2.4px] xl:tracking-[-1.8px]"
          >
            {/* The package splits the headline into three ids on purpose (W23) — authored <br/>s. */}
            {tf('home.018')}
            <br />
            {tf('home.019')}
            <br />
            {tf('home.020')}
          </h1>
          <p className="m-0 mb-7 max-w-[520px] text-body-lg text-white/78">{tf('home.021')}</p>
          <div className="hidden flex-wrap items-center gap-3 xs:flex">
            {/* In-page anchor: a bare `#proposal` href falls through Button's plain-anchor branch (R22),
                never the typed Link cast. */}
            <a href="#proposal" className={buttonClassName('primary', 'lg')}>
              {tf('home.022')}
            </a>
            <Button variant="inverse" size="lg" href="/available-workers">
              {tf('home.023')}
            </Button>
            <span className="ml-1 text-body-sm font-bold text-white/55">{tf('home.024')}</span>
          </div>
        </div>
        {/* Cycle 2 replaces this with <HeroLeadForm …/>; the id must exist from the first commit
            because the header CTA (CTA_BY_PATHNAME['/']) and the sticky bar point at it. */}
        <div id="proposal" className="scroll-mt-[90px]" />
      </div>
      <HeroStats locale={locale} bundle={bundle} />
    </section>
  );
}

/** The hero's number strip: W1 metrics through MetricStrip (dark tone). The fourth design cell
 *  ("All cases are public →") is a claim about the approvals wall — it renders only once
 *  `stories` has rows (W6). The client-logo marquee below it is the Phase B `logos` slot. */
function HeroStats({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  return (
    <div className="border-t border-white/10">
      <div className="container-site flex flex-wrap items-end justify-between gap-6 py-6">
        <MetricStrip
          bundle={bundle}
          locale={locale}
          metrics={['placed', 'countries', 'permitDays']}
          tone="dark"
          className="flex flex-wrap gap-8"
        />
        {hasRows(bundle, 'stories') ? (
          <div data-testid="hero-proof">
            <Link href="/success-stories" className="font-extrabold text-sky no-underline">
              {tf('home.053')}
            </Link>
            <span className="block text-body-sm text-white/55">{tf('home.054')}</span>
          </div>
        ) : null}
      </div>
      <LogoMarquee logos={logoRows(bundle)} />
    </div>
  );
}
```

`src/app/[locale]/(site)/_sections/ticker.tsx`:

```tsx
import { z } from 'zod';
import { makeTf } from '@/content/adapter';
import { Link } from '@/i18n/navigation';
import { LiveDot } from '../_components/LiveDot';
import { hasRows, rawRows } from '../_lib/phase-a';
import type { SectionProps } from './types';

const CaseRow = z.object({ title: z.string().min(1) });

/**
 * The design's rotating "Approved" case bar (home.201, six fabricated cases, "2h ago"). W6/D23:
 * hidden until `stories` has signed rows. When it does, Phase A shows the newest title statically —
 * the D9 v1 cards carry no recency, and a rotator needs pause/play (D20); both are the Success
 * Stories task's, not this page's.
 */
export function LiveCaseBar({ locale, bundle }: SectionProps) {
  if (!hasRows(bundle, 'stories')) return null;
  const first = CaseRow.safeParse(rawRows(bundle, 'stories')[0]);
  if (!first.success) return null;
  const tf = makeTf(bundle, locale);
  return (
    <div data-testid="live-case-bar" className="border-b border-border-3 bg-pale-2">
      <div className="container-site flex flex-wrap items-center gap-3 py-3 text-body-sm">
        <span className="inline-flex items-center gap-2 rounded-pill bg-success-surface px-3 py-1 font-extrabold text-success-text">
          <LiveDot />
          {tf('home.201')}
        </span>
        <span className="font-bold">{first.data.title}</span>
        <Link href="/success-stories" className="ml-auto font-extrabold text-blue-safe no-underline">
          {tf('home.055')}
        </Link>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/_sections/choice.tsx`:

```tsx
import { makeTf } from '@/content/adapter';
import { Link } from '@/i18n/navigation';
import type { SectionProps } from './types';

/** The design's phone-only "I need workers / I'm an agency / Check someone's ID" cards
 *  (≤460 px). Rendered always, shown only below `xs` (W10). */
export function ChoiceCards({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const card =
    'flex items-center gap-3 rounded-xl border border-border-1 bg-white p-4 no-underline text-ink shadow-card';
  return (
    <div data-testid="choice-cards" className="grid gap-3 bg-white px-5 pb-1 pt-6 xs:hidden">
      <a href="#proposal" className={`${card} bg-navy text-white`}>
        <span>
          <span className="block font-extrabold">{tf('home.056')}</span>
          <span className="block text-body-sm text-white/70">{tf('home.057')}</span>
        </span>
      </a>
      <Link href="/partner-with-us" className={card}>
        <span>
          <span className="block font-extrabold">{tf('home.058')}</span>
          <span className="block text-body-sm text-text-secondary">{tf('home.059')}</span>
        </span>
      </Link>
      <Link href="/verify" className={card}>
        <span>
          <span className="block font-extrabold">{tf('home.060')}</span>
          <span className="block text-body-sm text-text-secondary">{tf('home.061')}</span>
        </span>
      </Link>
    </div>
  );
}
```

`src/app/[locale]/(site)/_sections/pool.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/adapter';
import { EmptyState } from '@/design/blocks';
import { Eyebrow, Section } from '@/design/primitives';
import type { SectionProps } from './types';

/**
 * "Candidates: live pool" (home.062–067 + six fabricated JA- cards). D2 keeps per-profile cards
 * OFF at launch and the copy's "updates weekly" / "14+ live profiles" claims are unsigned (W6), so
 * Phase A renders the designed empty state with the request door. Phase B (Available Workers,
 * WP2b T9) owns the aggregate strip; when the `pool` collection exists this section is where it
 * mounts — the empty state stays the fallback.
 */
export async function PoolSection({ locale, bundle }: SectionProps) {
  const sys = await getTranslations('sys');
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="light" id="candidates" className="border-t border-border-3">
      <div className="container-site">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <Eyebrow>{tf('home.062')}</Eyebrow>
        </div>
        <EmptyState
          testId="pool-empty"
          tone="pale"
          headingLevel={2}
          title={sys('home.pool.empty.title')}
          body={sys('home.pool.empty.body')}
          cta={{ label: sys('home.pool.empty.cta'), href: '/available-workers' }}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/page.tsx` — whole file:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { ChoiceCards } from './_sections/choice';
import { Hero } from './_sections/hero';
import { PoolSection } from './_sections/pool';
import { LiveCaseBar } from './_sections/ticker';

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
  // The package has no SEO strings for the homepage (pages.home.titleId === ''), so the
  // sys.seo.home.* fallbacks are the title/description (W23/W38).
  return buildMetadata({
    locale,
    href: '/',
    bundle,
    pageKey: 'home',
    fallbackTitle: sys('seo.home.title'),
    fallbackDescription: sys('seo.home.description'),
  });
}

/** The homepage, section for section in the design's order (design/JobsAdmire Homepage v4).
 *  No <main> here — SiteChrome owns it (R31). Sections that need live data decide for
 *  themselves whether to render (W6). */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const section = { locale, bundle };
  return (
    <>
      <Hero {...section} />
      <LiveCaseBar {...section} />
      <ChoiceCards {...section} />
      <PoolSection {...section} />
    </>
  );
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/\[locale\]/(site)"` → both files green (27 + 2 + 1 + 3 tests). `npm run verify` → typecheck/lint/format/unit green. Then one build + the T0e page contract against it (R26, one job at a time): `npm run build && npx next start -p 3100` in one terminal, `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts e2e/seo.spec.ts --project=desktop` → green (`page contract on /` and `/en` pass on the real h1; the hire link assertion passes through the desktop nav row). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/\(site\)/page.tsx src/app/[locale]/\(site\)/_sections src/app/[locale]/\(site\)/_lib/phase-a.ts src/app/[locale]/\(site\)/_lib/phase-a.test.ts src/app/[locale]/\(site\)/_components/LiveDot.tsx src/app/[locale]/\(site\)/__tests__/home.copy.test.ts src/messages/tr.json src/messages/en.json
git commit -m "feat(home): hero, metric strip and the Phase A empty/hidden sections on the T0 foundation (T1 c1)

Metadata from sys.seo.home.* (no package SEO string, W38); the h1 is the LCP element until the
hero photo ships (D26); ticker / proof cell / logos render by data (W6/D23); pool = empty state.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — The hero lead form: `hire` (proposal) and `callback` (call me back) through the forms kernel

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/_lib/forms.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  callbackSchema,
  callbackToFields,
  HERO_SECTOR_KEYS,
  hireSchema,
  hireToFields,
  PREFERRED_TIME_KEYS,
  TIMELINE_KEYS,
} from './forms';

const hire = {
  company: 'Akdeniz Tekstil A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 501 000 00 00',
  sector: 'factory',
  headcount: '15',
  city: 'Antalya',
  startWhen: 'month1',
};

describe('hireSchema → hireToFields (catalog names, stable keys — W3/W16)', () => {
  it('maps a full submission onto the exact `hire` catalog field names', () => {
    const parsed = hireSchema.parse(hire);
    expect(hireToFields(parsed)).toEqual({
      company: 'Akdeniz Tekstil A.Ş.',
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      phone: '+90 501 000 00 00',
      headcount: '15',
      sector: 'factory',
      city: 'Antalya',
      startWhen: 'month1',
    });
  });

  it('omits the optional fields the visitor left empty (the door treats "" as absent anyway)', () => {
    const parsed = hireSchema.parse({ ...hire, sector: '', city: '', startWhen: '' });
    expect(Object.keys(hireToFields(parsed)).sort()).toEqual(
      ['company', 'email', 'headcount', 'name', 'phone'].sort(),
    );
  });

  it('requires name and email (the door does; the design did not — W3)', () => {
    const r = hireSchema.safeParse({ ...hire, name: '', email: '' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const paths = r.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('name');
      expect(paths).toContain('email');
    }
  });

  it('an empty email reads as required, not as a bad email (min(1) before email())', () => {
    const r = hireSchema.safeParse({ ...hire, email: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.find((i) => i.path[0] === 'email')?.code).toBe('too_small');
  });

  it('rejects a localized label posted as a value — only the stable keys pass', () => {
    expect(hireSchema.safeParse({ ...hire, sector: 'Fabrika / Üretim' }).success).toBe(false);
    expect(hireSchema.safeParse({ ...hire, startWhen: 'Within 1 month' }).success).toBe(false);
    for (const k of HERO_SECTOR_KEYS) expect(hireSchema.safeParse({ ...hire, sector: k }).success).toBe(true);
    for (const k of TIMELINE_KEYS) expect(hireSchema.safeParse({ ...hire, startWhen: k }).success).toBe(true);
  });

  it('headcount is a positive integer string (≤10 chars at the door)', () => {
    expect(hireSchema.safeParse({ ...hire, headcount: 'fifteen' }).success).toBe(false);
    expect(hireSchema.safeParse({ ...hire, headcount: '0' }).success).toBe(false);
    expect(hireSchema.safeParse({ ...hire, headcount: '12345678901' }).success).toBe(false);
  });

  it('a phone needs at least eight digits (the door rule), reported under the phone code', () => {
    const r = hireSchema.safeParse({ ...hire, phone: '+90 12' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.find((i) => i.path[0] === 'phone')?.message).toBe('phone');
  });
});

describe('callbackSchema → callbackToFields', () => {
  it('maps onto the `callback` catalog: name, phone, preferredTime, topic', () => {
    const parsed = callbackSchema.parse({
      name: 'Mehmet Kaya',
      phone: '05320000000',
      preferredTime: 'morning',
      topic: 'tourism',
    });
    expect(callbackToFields(parsed)).toEqual({
      name: 'Mehmet Kaya',
      phone: '05320000000',
      preferredTime: 'morning',
      topic: 'tourism',
    });
  });

  it('only the stable keys pass for preferredTime and topic', () => {
    const base = { name: 'x', phone: '05320000000' };
    for (const k of PREFERRED_TIME_KEYS) expect(callbackSchema.safeParse({ ...base, preferredTime: k }).success).toBe(true);
    expect(callbackSchema.safeParse({ ...base, preferredTime: 'Sabah' }).success).toBe(false);
    expect(callbackSchema.safeParse({ ...base, topic: 'Turizm' }).success).toBe(false);
    expect(Object.keys(callbackToFields(callbackSchema.parse({ ...base, preferredTime: '', topic: '' })))).toEqual(['name', 'phone']);
  });
});
```

`src/app/[locale]/(site)/_components/HeroLeadForm.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { HeroLeadForm, type HeroLeadFormProps } from './HeroLeadForm';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

const props: HeroLeadFormProps = {
  locale: 'tr',
  actions: { hire: vi.fn(async (prev) => prev), callback: vi.fn(async (prev) => prev) },
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  whatsappHref: 'https://wa.me/905011240340?text=x',
  contact: { phone: '+905011240340', phoneDisplay: '+90 501 124 03 40', email: 'info@jobsadmire.com' },
  options: {
    sector: [{ value: 'factory', label: 'Fabrika / Üretim' }],
    timeline: [{ value: 'now', label: 'Hemen' }],
    preferredTime: [{ value: 'morning', label: 'Sabah' }],
  },
  copy: {
    title: 'İşçi talebi',
    titleMobile: 'İhtiyacınızı yazın',
    badge: '24 saat içinde yanıt',
    sub: 'Aday profilleri…',
    openProposal: 'Ücretsiz teklif alın →',
    openCallback: 'Sizi arayalım',
    callbackNote: 'Numaranızı bırakın…',
    labels: {
      company: 'Firma adı',
      name: 'İletişim kişisi',
      phone: 'Telefon / WhatsApp',
      sector: 'Sektör',
      headcount: 'İşçi sayısı',
      city: 'Şehir / bölge',
      timeline: 'Zamanlama',
    },
    submitHire: 'Teklif isteyin →',
    submitCallback: 'Beni arayın →',
    whatsapp: "WhatsApp'tan yazın",
  },
};

describe('HeroLeadForm', () => {
  it('starts in proposal mode: the hire form with the W3 fields (company, name, email, phone, headcount)', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    const form = screen.getByTestId('hire-form');
    for (const name of ['company', 'name', 'email', 'phone', 'headcount', 'city']) {
      expect(form.querySelector(`input[name="${name}"]`)).not.toBeNull();
    }
    expect(form.querySelector('select[name="sector"]')).not.toBeNull();
    expect(form.querySelector('select[name="startWhen"]')).not.toBeNull();
    expect(screen.getByTestId('hero-mode-proposal')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByTestId('callback-form')).toBeNull();
  });

  it('the call-me-back button swaps to the callback form (name, phone, preferredTime, topic) and shows the note', async () => {
    const user = userEvent.setup();
    renderWithIntl(<HeroLeadForm {...props} />);
    await user.click(screen.getByTestId('hero-mode-callback'));
    const form = screen.getByTestId('callback-form');
    expect(form.querySelector('input[name="name"]')).not.toBeNull();
    expect(form.querySelector('input[name="phone"]')).not.toBeNull();
    expect(form.querySelector('select[name="preferredTime"]')).not.toBeNull();
    expect(form.querySelector('select[name="topic"]')).not.toBeNull();
    expect(form.querySelector('input[name="email"]')).toBeNull();
    expect(screen.getByText('Numaranızı bırakın…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Beni arayın →' })).toBeInTheDocument();
  });

  it('the form card carries the anchor id the header CTA and sticky bar point at', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    expect(screen.getByTestId('hero-form')).toHaveAttribute('id', 'proposal');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/_lib/forms.test.ts" "src/app/\[locale\]/(site)/_components/HeroLeadForm.test.tsx"` → both fail on a missing module (`./forms`, `./HeroLeadForm`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_lib/forms.ts`:

```ts
import { z } from 'zod';
import type { SectorKey } from '@/content/collections';
import type { WireFields } from '@/forms/wire';

/**
 * The hero form's option sets. VALUES are the stable keys every form sends (W3); LABELS are
 * the package's own ids, resolved by the page. The sector keys are a subset of the `sectors`
 * collection's `SECTOR_KEYS` (T0b) — the homepage design offers five of the seven.
 */
export const HERO_SECTOR_KEYS = ['factory', 'agriculture', 'tourism', 'construction', 'other'] as const satisfies readonly SectorKey[];
export type HeroSectorKey = (typeof HERO_SECTOR_KEYS)[number];
export const HERO_SECTOR_LABEL_IDS: Record<HeroSectorKey, string> = {
  factory: 'home.036',
  agriculture: 'home.037',
  tourism: 'home.038',
  construction: 'home.039',
  other: 'home.040',
};

export const TIMELINE_KEYS = ['now', 'month1', 'months1to3', 'planning'] as const;
export type TimelineKey = (typeof TIMELINE_KEYS)[number];
export const TIMELINE_LABEL_IDS: Record<TimelineKey, string> = {
  now: 'home.044',
  month1: 'home.045',
  months1to3: 'home.046',
  planning: 'home.047',
};

/** Labels live in sys.home.form.preferredTime.<key> — the package has no callback slots. */
export const PREFERRED_TIME_KEYS = ['morning', 'afternoon', 'evening'] as const;
export type PreferredTimeKey = (typeof PREFERRED_TIME_KEYS)[number];

/** A select posts '' when untouched; anything else must be one of the keys ('invalid' code). */
const optionKey = (keys: readonly string[]) =>
  z
    .string()
    .max(40)
    .refine((v) => v === '' || keys.includes(v), { message: 'invalid' })
    .optional();

// `.min(1)` before `.email()` so an empty value reads 'required', not 'email' (T0a rule).
const name = z.string().trim().min(1).max(120);
const phone = z
  .string()
  .trim()
  .min(1)
  .regex(/(\D*\d){8,}/, { message: 'phone' })
  .max(40);

export const hireSchema = z.object({
  company: z.string().trim().min(1).max(200),
  name,
  email: z.string().trim().min(1).max(254).email(),
  phone,
  sector: optionKey(HERO_SECTOR_KEYS),
  headcount: z
    .string()
    .trim()
    .min(1)
    .regex(/^[1-9]\d{0,9}$/, { message: 'invalid' }),
  city: z.string().trim().max(120).optional(),
  startWhen: optionKey(TIMELINE_KEYS),
});
export type HireInput = z.infer<typeof hireSchema>;

/** Catalog `hire` (v1.0 + v1.1 `city`): the exact wire names. Empty optionals are omitted. */
export function hireToFields(p: HireInput): WireFields {
  const fields: WireFields = {
    company: p.company,
    name: p.name,
    email: p.email,
    phone: p.phone,
    headcount: p.headcount,
  };
  if (p.sector) fields.sector = p.sector;
  if (p.city) fields.city = p.city;
  if (p.startWhen) fields.startWhen = p.startWhen;
  return fields;
}

export const callbackSchema = z.object({
  name,
  phone,
  preferredTime: optionKey(PREFERRED_TIME_KEYS),
  topic: optionKey(HERO_SECTOR_KEYS),
});
export type CallbackInput = z.infer<typeof callbackSchema>;

/** Catalog `callback`: name*, phone*, preferredTime (≤120), topic (≤200, free text at the
 *  door — we send the sector key, which the inbox reads as `topic: tourism`). */
export function callbackToFields(p: CallbackInput): WireFields {
  const fields: WireFields = { name: p.name, phone: p.phone };
  if (p.preferredTime) fields.preferredTime = p.preferredTime;
  if (p.topic) fields.topic = p.topic;
  return fields;
}
```

`src/app/[locale]/(site)/actions.ts`:

```ts
'use server';
import { createFormAction, type FormActionState } from '@/forms/action';
import { callbackSchema, callbackToFields, hireSchema, hireToFields } from './_lib/forms';

// The design carries the KVKK line without a checkbox on the hero card → `consent: 'notice'`
// (the wire always carries CONSENT_VERSION, T0a). Both keys are FormKey literals (R55).
const runHire = createFormAction({
  key: 'hire',
  schema: hireSchema,
  toFields: hireToFields,
  consent: 'notice',
});
const runCallback = createFormAction({
  key: 'callback',
  schema: callbackSchema,
  toFields: callbackToFields,
  consent: 'notice',
});

export async function submitHire(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runHire(prev, data);
}

export async function submitCallback(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runCallback(prev, data);
}
```

`src/app/[locale]/(site)/_components/HeroLeadForm.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';
import { LiveDot } from './LiveDot';

type Action = (prev: FormActionState, data: FormData) => Promise<FormActionState>;
export type HeroMode = 'proposal' | 'callback';

export type HeroLeadFormProps = {
  locale: Locale;
  actions: { hire: Action; callback: Action };
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  /** the co-primary "Chat on WhatsApp instead" link (home.049), already prefilled */
  whatsappHref: string;
  contact: { phone: string; phoneDisplay: string; email: string };
  options: { sector: FieldOption[]; timeline: FieldOption[]; preferredTime: FieldOption[] };
  copy: {
    title: string;
    titleMobile: string;
    badge: string;
    sub: string;
    openProposal: string;
    openCallback: string;
    callbackNote: string;
    labels: {
      company: string;
      name: string;
      phone: string;
      sector: string;
      headcount: string;
      city: string;
      timeline: string;
    };
    submitHire: string;
    submitCallback: string;
    whatsapp: string;
  };
};

const MODE_BTN =
  'inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-pill border px-4 text-body-sm font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/**
 * The hero lead form (design id `proposal`). Two modes, one card: "Get free proposal" posts to
 * the `hire` door, "Ask us to call you" to `callback` (W3). At ≤460 px the design collapses
 * the form behind the two buttons; here `open` does the same and the `xs:` classes keep the
 * form visible above that width regardless (W10). The id is the anchor the header CTA
 * (CTA_BY_PATHNAME['/']) and the sticky bar (hideNearId) point at.
 */
export function HeroLeadForm({
  locale,
  actions,
  turnstileSiteKey,
  whatsappNumber,
  whatsappHref,
  contact,
  options,
  copy,
}: HeroLeadFormProps) {
  const [mode, setMode] = useState<HeroMode>('proposal');
  const [open, setOpen] = useState(false);
  const select = (next: HeroMode) => {
    setMode(next);
    setOpen(true);
  };
  const shell = {
    locale,
    turnstileSiteKey,
    whatsappNumber,
    contact,
    consent: 'notice' as const,
    consentLinkHref: '/kvkk' as const,
    className: 'gap-3',
  };
  return (
    <div
      id="proposal"
      data-testid="hero-form"
      className="scroll-mt-[90px] rounded-hero bg-white p-6 text-ink shadow-hero-form xs:p-7"
    >
      <div className="mb-1 flex items-start justify-between gap-3">
        <h2 className="m-0 text-card-title">
          <span className="hidden xs:inline">{copy.title}</span>
          <span className="xs:hidden">{copy.titleMobile}</span>
        </h2>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-success-surface px-3 py-1 text-[11.5px] font-extrabold text-success-text">
          <LiveDot />
          {copy.badge}
        </span>
      </div>
      <p className="m-0 mb-4 text-body-sm text-text-tertiary">{copy.sub}</p>
      <div className="mb-3 flex flex-col gap-2 xs:flex-row">
        <button
          type="button"
          data-testid="hero-mode-proposal"
          aria-pressed={mode === 'proposal'}
          onClick={() => select('proposal')}
          className={`${MODE_BTN} ${mode === 'proposal' ? 'border-blue-safe bg-blue-safe text-white' : 'border-border-1 bg-white text-ink hover:bg-pale-1'}`}
        >
          {copy.openProposal}
        </button>
        <button
          type="button"
          data-testid="hero-mode-callback"
          aria-pressed={mode === 'callback'}
          onClick={() => select('callback')}
          className={`${MODE_BTN} ${mode === 'callback' ? 'border-blue-safe bg-blue-safe text-white' : 'border-border-1 bg-white text-ink hover:bg-pale-1'}`}
        >
          {copy.openCallback}
        </button>
      </div>
      <div className={open ? 'block' : 'hidden xs:block'}>
        {mode === 'proposal' ? (
          <FormShell key="hire" {...shell} action={actions.hire} formKey="hire" submitLabel={copy.submitHire} testId="hire-form">
            <div className="grid gap-3 xs:grid-cols-2">
              <Field name="company" label={copy.labels.company} required autoComplete="organization" className="xs:col-span-2" />
              <Field name="name" label={copy.labels.name} required autoComplete="name" />
              <Field name="email" type="email" required autoComplete="email" inputMode="email" />
              <Field name="phone" type="tel" label={copy.labels.phone} required autoComplete="tel" inputMode="tel" hint="" />
              <Field name="sector" as="select" label={copy.labels.sector} options={options.sector} hint="" />
              <Field name="headcount" type="number" label={copy.labels.headcount} required min={1} max={500} inputMode="numeric" />
              <Field name="city" label={copy.labels.city} autoComplete="address-level2" hint="" />
              <Field name="startWhen" as="select" label={copy.labels.timeline} options={options.timeline} hint="" className="xs:col-span-2" />
            </div>
          </FormShell>
        ) : (
          <FormShell key="callback" {...shell} action={actions.callback} formKey="callback" submitLabel={copy.submitCallback} testId="callback-form">
            <p className="m-0 flex items-start gap-2 rounded-base bg-tint px-3 py-2 text-body-sm font-bold text-blue-safe">
              {copy.callbackNote}
            </p>
            <div className="grid gap-3 xs:grid-cols-2">
              <Field name="name" label={copy.labels.name} required autoComplete="name" />
              <Field name="phone" type="tel" label={copy.labels.phone} required autoComplete="tel" inputMode="tel" hint="" />
              <Field name="preferredTime" as="select" options={options.preferredTime} hint="" />
              <Field name="topic" as="select" label={copy.labels.sector} options={options.sector} hint="" />
            </div>
          </FormShell>
        )}
        <ContactLink
          href={whatsappHref}
          placement="page_cta"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-pill border border-success-border bg-success-surface px-4 text-body-sm font-extrabold text-success-text no-underline hover:bg-[#dcf5e7]"
        >
          <LiveDot />
          {copy.whatsapp}
        </ContactLink>
      </div>
    </div>
  );
}
```

Notes for the implementer: `Field` resolves `sys.form.labels.email` / `sys.form.labels.preferredTime` itself when no `label` prop is given (W30) — the package has no ids for those two; every other label is the design's own id passed through `copy.labels`. `hint=""` suppresses the `sys.form.hints.optional` line on the compact hero card. The two mode buttons are `aria-pressed` toggles, not tabs — there is no panel relationship to announce beyond the form that appears.

`src/app/[locale]/(site)/_sections/hero.tsx` — replace the Cycle 1 placeholder `<div id="proposal" …/>` with the island, and add the imports/props:

```tsx
import { getTranslations } from 'next-intl/server';
import { waLink } from '@/lib/contact';
import { HeroLeadForm } from '../_components/HeroLeadForm';
import {
  HERO_SECTOR_KEYS,
  HERO_SECTOR_LABEL_IDS,
  PREFERRED_TIME_KEYS,
  TIMELINE_KEYS,
  TIMELINE_LABEL_IDS,
} from '../_lib/forms';
import { submitCallback, submitHire } from '../actions';
```

`Hero` becomes `async` and resolves `sys`:

```tsx
export async function Hero({ locale, bundle }: SectionProps) {
  const sys = await getTranslations('sys');
  const tf = makeTf(bundle, locale);
  const s = bundle.settings;
  const photoIsLcp = HERO_PHOTO !== null;
  const leadForm = (
    <HeroLeadForm
      locale={locale}
      actions={{ hire: submitHire, callback: submitCallback }}
      turnstileSiteKey={s.turnstileSiteKey}
      whatsappNumber={s.whatsappNumber}
      whatsappHref={waLink(s.whatsappNumber, sys('home.whatsapp.hire'))}
      contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
      options={{
        sector: HERO_SECTOR_KEYS.map((value) => ({ value, label: tf(HERO_SECTOR_LABEL_IDS[value]) })),
        timeline: TIMELINE_KEYS.map((value) => ({ value, label: tf(TIMELINE_LABEL_IDS[value]) })),
        preferredTime: PREFERRED_TIME_KEYS.map((value) => ({ value, label: sys(`home.form.preferredTime.${value}`) })),
      }}
      copy={{
        title: tf('home.025'),
        titleMobile: tf('home.026'),
        badge: tf('home.027'),
        sub: tf('home.028'),
        openProposal: tf('home.029'),
        openCallback: tf('home.030'),
        callbackNote: tf('home.031'),
        labels: {
          company: tf('home.032'),
          name: tf('home.033'),
          phone: tf('home.034'),
          sector: tf('home.035'),
          headcount: tf('home.041'),
          city: tf('home.042'),
          timeline: tf('home.043'),
        },
        submitHire: tf('home.048'),
        submitCallback: sys('home.form.callbackSubmit'),
        whatsapp: tf('home.049'),
      }}
    />
  );
  return ( /* …the Cycle 1 JSX, with `{leadForm}` in place of the placeholder div… */ );
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/\[locale\]/(site)"` → green (forms 9, HeroLeadForm 3, plus Cycle 1). `npm run verify` green. Build + `next start -p 3100`, then in a browser: submit the proposal form with the door unset → the `FallbackPanel` (`data-testid="form-fallback"`, kind `unauthorized`) appears with the WhatsApp prefill of the typed values; switch to call-me-back and repeat. The Playwright version of this is `e2e/pages/home.spec.ts` (Cycle 6).

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/\(site\)/actions.ts src/app/[locale]/\(site\)/_lib/forms.ts src/app/[locale]/\(site\)/_lib/forms.test.ts src/app/[locale]/\(site\)/_components/HeroLeadForm.tsx src/app/[locale]/\(site\)/_components/HeroLeadForm.test.tsx src/app/[locale]/\(site\)/_sections/hero.tsx
git commit -m "feat(home): hero lead form → hire (name/email required, city, stable keys) and call-me-back → callback (T1 c2)

W3/W16: the door's required fields are a design delta on the card; sector/timeline/preferredTime
post stable keys, labels stay the package's. consent: notice (the design has no checkbox).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — The calculator teaser on the shared engine (three presets, four headcount chips), lazy on viewport

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/_lib/teaser.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { CalculatorRole, RateConfig } from '@/content/collections';
import { formatTRY } from '@/lib/format/money';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, teaserView, type TeaserTx } from './teaser';

// T0b's emitted row + the three preset rows (produces-final § Task 1) — inline so the test
// does not depend on Task 9's fixture module names.
export const RATE_CONFIG: RateConfig = {
  version: '2026-01',
  effectiveFrom: '2026-01-01',
  reviewDueAt: '2026-12-20',
  updatedAt: '2026-01-15',
  currency: 'TRY',
  legalMinGross: 33030,
  sgkEmployerRate: 0.2175,
  sgkRates: { manufacturing: 0.1875, other: 0.2175, none: 0.2375 },
  supportMonthly: 1270,
  permitFeeTRY: 16000,
  flightTRY: 12000,
  housingMonthlyTRY: 5000,
  quotaRatio: 5,
};
const preset = (key: string, labelId: string, multiplier: number, group: CalculatorRole['group']): CalculatorRole => ({
  key,
  labelId,
  multiplier,
  group,
  preset: true,
  industry: null,
  industryLabelId: null,
  salaryMin: null,
  salaryMax: null,
});
export const PRESETS = [
  preset('generalPreset', 'home.240', 1, 'general'),
  preset('skilledPreset', 'home.241', 1.5, 'skilled'),
  preset('specialistPreset', 'home.242', 2, 'specialist'),
];
export const TX: TeaserTx = {
  grossMin: 'Brüt maaş (asgari ücret)',
  grossFloor: (m) => `Brüt maaş (yasal tabanın ${m} katı)`,
  headcount: (n) => `${n} işçi`,
  estimate: (a) => `${a.role}|${a.headcount}|${a.monthly}|${a.oneOff}`,
};

describe('teaserView (W2/W58: one engine, exact floors, support OFF)', () => {
  it('general × 15 at 2026 rates: ₺40,214 per worker, ₺603,210 payroll, ₺420,000 one-offs', () => {
    const v = teaserView({ role: PRESETS[0], label: 'Genel işçi', headcount: 15, rateConfig: RATE_CONFIG, locale: 'tr', tx: TX });
    expect(v.f.perWorker.monthly.gross).toBe(formatTRY(33030, 'tr'));
    expect(v.f.perWorker.monthly.sgk).toBe(formatTRY(33030 * 0.2175, 'tr'));
    expect(v.f.perWorker.monthly.total).toBe('40.214 ₺');
    expect(v.f.monthly.total).toBe('603.210 ₺');
    expect(v.f.oneOff.total).toBe('420.000 ₺');
    expect(v.grossLabel).toBe('Brüt maaş (asgari ücret)');
    expect(v.headcountLabel).toBe('15 işçi');
    expect(v.whatsappText).toBe('Genel işçi|15|603.210 ₺|420.000 ₺');
  });

  it('skilled × 30: the exact 1.5× floor (49 545, never 50 000) and the multiplier label', () => {
    const v = teaserView({ role: PRESETS[1], label: 'Nitelikli', headcount: 30, rateConfig: RATE_CONFIG, locale: 'tr', tx: TX });
    expect(v.f.perWorker.monthly.gross).toBe('49.545 ₺');
    expect(v.f.monthly.total).toBe('1.809.631 ₺');
    expect(v.grossLabel).toBe('Brüt maaş (yasal tabanın 1,5× katı)');
  });

  it('shares are unrounded percentages of gross + SGK (the bars) and formatted for the legend', () => {
    const v = teaserView({ role: PRESETS[0], label: 'x', headcount: 1, rateConfig: RATE_CONFIG, locale: 'en', tx: TX });
    expect(v.shares.salaryPct).toBeCloseTo(82.135, 2);
    expect(v.shares.sgkPct).toBeCloseTo(17.865, 2);
    expect(v.f.shares.salaryPct).toBe('82%');
  });

  it('the chips are the design\'s four presets with 15 selected', () => {
    expect(HEADCOUNT_PRESETS).toEqual([1, 5, 15, 30]);
    expect(DEFAULT_HEADCOUNT).toBe(15);
  });
});
```

`src/app/[locale]/(site)/_components/CalculatorTeaser.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { PRESETS, RATE_CONFIG } from '../_lib/teaser.test';
import { CalculatorTeaser, type CalculatorTeaserProps } from './CalculatorTeaser';

const track = vi.fn();
vi.mock('@/analytics/track', () => ({ track: (...a: unknown[]) => track(...a) }));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

const props: CalculatorTeaserProps = {
  locale: 'tr',
  rateConfig: RATE_CONFIG,
  roles: PRESETS.map((row, i) => ({ row, label: ['Genel işçi', 'Nitelikli / belgeli', 'Uzman'][i] })),
  whatsappNumber: '905011240340',
  copy: {
    rolesLegend: 'Pozisyon seviyesi',
    headcountLegend: 'Kaç işçi?',
    per: 'İşçi başına aylık',
    rates: '2026 oranları',
    grossMin: 'Brüt maaş (asgari ücret)',
    sgk: 'SGK işveren payı · %21,75',
    support: 'Asgari ücret desteği',
    supportValue: 'İsteğe bağlı — tam hesaplamada',
    total: 'İşçi başına işveren maliyeti',
    salaryPct: 'Maaş',
    sgkPct: 'SGK ve primler',
    monthlyPayroll: 'aylık bordro',
    oneOff: 'İlk yıl tek seferlik maliyetler',
    whatsapp: "Bu hesabı WhatsApp'tan gönderin",
    more: 'Maliyet dökümünü görün',
    less: 'Dökümü gizleyin',
    disc: 'Hesaplama 2026 asgari ücreti…',
  },
  leftTop: <h2>Karar vermeden önce gerçek maliyeti görün</h2>,
  leftBottom: null,
  ctas: null,
};

beforeEach(() => track.mockClear());

describe('CalculatorTeaser', () => {
  it('starts at general × 15 and recomputes on a headcount chip', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    expect(screen.getByTestId('calc-teaser')).toHaveAttribute('data-island', 'ready');
    expect(screen.getByTestId('calc-monthly')).toHaveTextContent('603.210 ₺');
    await user.click(screen.getByRole('radio', { name: '30 işçi' }));
    expect(screen.getByTestId('calc-monthly')).toHaveTextContent('1.206.421 ₺');
    expect(track).toHaveBeenCalledWith('calculator_use', { page: '/', locale: 'tr', role: 'generalPreset', headcount: 30 });
  });

  it('a role chip changes the floor and the gross label', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    await user.click(screen.getByRole('radio', { name: 'Nitelikli / belgeli' }));
    expect(screen.getByTestId('calc-per-worker')).toHaveTextContent('60.321 ₺');
    expect(screen.getByText('Brüt maaş (yasal tabanın 1,5× katı)')).toBeInTheDocument();
    expect(track).toHaveBeenLastCalledWith('calculator_use', { page: '/', locale: 'tr', role: 'skilledPreset', headcount: 15 });
  });

  it('the mobile breakdown toggle is a real disclosure', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    const btn = screen.getByRole('button', { name: 'Maliyet dökümünü görün' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(screen.getByRole('button', { name: 'Dökümü gizleyin' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('the WhatsApp estimate link carries the current figures and the page_cta placement', () => {
    renderWithIntl(<CalculatorTeaser {...props} />);
    const link = screen.getByRole('link', { name: /WhatsApp/ });
    expect(link.getAttribute('href')).toContain('wa.me/905011240340');
    expect(decodeURIComponent(link.getAttribute('href') ?? '')).toContain('603.210 ₺');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/_lib/teaser.test.ts" "src/app/\[locale\]/(site)/_components/CalculatorTeaser.test.tsx"` → both fail on missing modules.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_lib/teaser.ts`:

```ts
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { estimate, formatEstimate, multiplierLabel, type FormattedEstimate } from '@/lib/calculator';

/** The design's headcount chips and default (numbers = UI presets, not rates). */
export const HEADCOUNT_PRESETS = [1, 5, 15, 30] as const;
export const DEFAULT_HEADCOUNT = 15;

/** The translator surface the view needs — the server passes getTranslations, the island
 *  useTranslations; the model never touches next-intl (R23). */
export type TeaserTx = {
  grossMin: string;
  grossFloor: (multiplier: string) => string;
  headcount: (n: number) => string;
  estimate: (args: { role: string; headcount: number; monthly: string; oneOff: string }) => string;
};

export type TeaserView = {
  f: FormattedEstimate;
  shares: { salaryPct: number; sgkPct: number };
  grossLabel: string;
  headcountLabel: string;
  whatsappText: string;
};

/**
 * One view model for the static server fallback and the client island, so the two render the
 * same DOM for the same state (no CLS on the swap). W58: support OFF; W2: exact floors.
 */
export function teaserView(input: {
  role: CalculatorRole;
  label: string;
  headcount: number;
  rateConfig: RateConfig;
  locale: Locale;
  tx: TeaserTx;
}): TeaserView {
  const { role, label, headcount, rateConfig, locale, tx } = input;
  const est = estimate({ role, headcount, supportOptIn: false }, rateConfig);
  const f = formatEstimate(est, locale);
  const grossLabel = role.multiplier === 1 ? tx.grossMin : tx.grossFloor(multiplierLabel(role.multiplier, locale));
  return {
    f,
    shares: est.shares,
    grossLabel,
    headcountLabel: tx.headcount(est.input.headcount),
    whatsappText: tx.estimate({ role: label, headcount: est.input.headcount, monthly: f.monthly.total, oneOff: f.oneOff.total }),
  };
}
```

`src/app/[locale]/(site)/_components/TeaserChips.tsx` (no directive — rendered by the server fallback without `onChange`, by the island with it):

```tsx
export type ChipOption = { value: string; label: string };

/** Chip-styled native radios (arrow keys work, the group has a legend). Without `onChange`
 *  the inputs are read-only — the server fallback's state until the island takes over. */
export function TeaserChips({
  name,
  legend,
  options,
  value,
  onChange,
  emphasis = 'blue',
}: {
  name: string;
  legend: string;
  options: ChipOption[];
  value: string;
  onChange?: (value: string) => void;
  emphasis?: 'blue' | 'ink';
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-2 text-body-sm font-extrabold text-text-secondary">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = o.value === value;
          const id = `${name}-${o.value}`;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={[
                'inline-flex min-h-[44px] cursor-pointer items-center rounded-pill border px-4 text-body-sm font-extrabold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-safe',
                selected
                  ? emphasis === 'blue'
                    ? 'border-blue-safe bg-blue-safe text-white'
                    : 'border-ink bg-ink text-white'
                  : 'border-border-1 bg-white text-text-secondary hover:bg-pale-1',
              ].join(' ')}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={o.value}
                checked={selected}
                readOnly={!onChange}
                onChange={onChange ? () => onChange(o.value) : undefined}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
```

`src/app/[locale]/(site)/_components/TeaserCard.tsx` (no directive):

```tsx
import type { ReactNode } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { buttonClassName } from '@/design/primitives';
import type { TeaserView } from '../_lib/teaser';
import { LiveDot } from './LiveDot';

export type TeaserCardCopy = {
  per: string;
  /** null once `isReviewDue` — the dated badge hides (D17) */
  rates: string | null;
  grossMin: string;
  sgk: string;
  support: string;
  supportValue: string;
  total: string;
  salaryPct: string;
  sgkPct: string;
  monthlyPayroll: string;
  oneOff: string;
  whatsapp: string;
  more: string;
  less: string;
  disc: string;
};

const ROWS_ID = 'calc-rows';

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 text-body-sm">
      <span className="text-text-secondary">{label}</span>
      <span className={muted ? 'text-text-tertiary' : 'font-extrabold'}>{value}</span>
    </div>
  );
}

/** The design's cost card. `expanded`/`onToggle` drive the ≤460 "See cost breakdown" disclosure;
 *  above `xs` the rows are always visible (W10). `ctas` = the mobile-only Open calculator /
 *  What permits cost pair (server-rendered links). */
export function TeaserCard({
  view,
  copy,
  whatsappHref,
  expanded,
  onToggle,
  ctas,
}: {
  view: TeaserView;
  copy: TeaserCardCopy;
  whatsappHref: string;
  expanded: boolean;
  onToggle?: () => void;
  ctas: ReactNode;
}) {
  const { f, shares } = view;
  const rows = expanded ? 'block' : 'hidden xs:block';
  return (
    <div className="overflow-hidden rounded-hero border border-border-1 bg-white shadow-[0_22px_50px_rgba(22,60,90,0.10)]">
      <div className="p-6 xs:p-7">
        <div className="mb-3 flex items-center justify-between gap-3 text-body-sm font-extrabold">
          <span className="text-text-secondary">{copy.per}</span>
          {copy.rates ? (
            <span data-testid="calc-rates-badge" className="rounded-pill bg-tint px-3 py-1 text-blue-safe">
              {copy.rates}
            </span>
          ) : null}
        </div>
        <div id={ROWS_ID} className={rows}>
          <Row label={view.grossLabel} value={f.perWorker.monthly.gross} />
          <Row label={copy.sgk} value={f.perWorker.monthly.sgk} />
          <Row label={copy.support} value={copy.supportValue} muted />
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-border-4 py-3 font-extrabold">
          <span>{copy.total}</span>
          <span data-testid="calc-per-worker">{f.perWorker.monthly.total}</span>
        </div>
        <div className={rows}>
          <div aria-hidden="true" className="flex h-2 overflow-hidden rounded-pill bg-border-3">
            <span style={{ width: `${shares.salaryPct}%` }} className="block bg-blue" />
            <span style={{ width: `${shares.sgkPct}%` }} className="block bg-[#16294f]" />
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-[11.5px] font-bold text-text-secondary">
            <span>
              {copy.salaryPct} {f.shares.salaryPct}
            </span>
            <span>
              {copy.sgkPct} {f.shares.sgkPct}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={ROWS_ID}
          onClick={onToggle}
          className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 text-body-sm font-extrabold text-blue-safe xs:hidden"
        >
          {expanded ? copy.less : copy.more}
        </button>
      </div>
      <div className="border-t border-border-4 bg-pale-2 p-6 xs:p-7">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-body-sm font-bold text-text-secondary">
            {view.headcountLabel} · {copy.monthlyPayroll}
          </span>
          <span
            data-testid="calc-monthly"
            className="whitespace-nowrap font-display text-[clamp(24px,2.4vw,30px)] font-extrabold tracking-[-1.2px] xl:text-[clamp(18px,1.8vw,22.5px)]"
          >
            {f.monthly.total}
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-border-4 pt-3 text-body-sm">
          <span className="text-text-secondary">{copy.oneOff}</span>
          <span data-testid="calc-oneoff" className="font-extrabold">
            {f.oneOff.total}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-6 pt-0 xs:p-7 xs:pt-0">
        <ContactLink
          href={whatsappHref}
          placement="page_cta"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClassName('secondary', 'md', 'w-full border-success-border bg-success-surface text-success-text hover:bg-[#dcf5e7]')}
        >
          <LiveDot />
          {copy.whatsapp}
        </ContactLink>
        <div className="flex flex-col gap-2 xs:hidden">{ctas}</div>
        <p className="m-0 text-[11.5px] leading-snug text-text-tertiary">{copy.disc}</p>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/_components/TeaserLayout.tsx` (no directive):

```tsx
import type { ReactNode } from 'react';

/** The strip's two columns. `leftTop`/`leftBottom` are server-rendered copy passed through as
 *  nodes; `chips` and `card` are whichever renderer (static fallback or island) owns the state.
 *  `ready` marks the hydrated island for the e2e spec. */
export function TeaserLayout({
  leftTop,
  chips,
  leftBottom,
  card,
  ready,
}: {
  leftTop: ReactNode;
  chips: ReactNode;
  leftBottom: ReactNode;
  card: ReactNode;
  ready?: boolean;
}) {
  return (
    <div
      data-testid="calc-teaser"
      data-island={ready ? 'ready' : undefined}
      className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14"
    >
      <div>
        {leftTop}
        <div className="mb-6 flex flex-col gap-5">{chips}</div>
        {leftBottom}
      </div>
      {card}
    </div>
  );
}
```

`src/app/[locale]/(site)/_components/useInView.ts`:

```ts
'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * W13 amended: heavy islands load when their section approaches the viewport. Returns a ref
 * for the wrapper and whether it has been near the viewport once (sticky). Without an
 * IntersectionObserver (no browser has lacked one for years; jsdom does) the island loads on
 * the next tick so nothing stays dead. State is only ever set from a callback, never in the
 * effect body (the React Compiler lint eslint-config-next 16 enforces).
 */
export function useInView<T extends HTMLElement>(rootMargin = '300px'): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    if (typeof IntersectionObserver !== 'function') {
      const id = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(id);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, inView]);
  return [ref, inView];
}
```

`src/app/[locale]/(site)/_components/CalculatorTeaser.tsx`:

```tsx
'use client';
import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, teaserView } from '../_lib/teaser';
import { TeaserCard, type TeaserCardCopy } from './TeaserCard';
import { TeaserChips } from './TeaserChips';
import { TeaserLayout } from './TeaserLayout';

export type CalculatorTeaserProps = {
  locale: Locale;
  rateConfig: RateConfig;
  /** the three `preset: true` rows (engine `presets()`), labels resolved by the page */
  roles: { row: CalculatorRole; label: string }[];
  whatsappNumber: string;
  copy: TeaserCardCopy & { rolesLegend: string; headcountLegend: string };
  leftTop: ReactNode;
  leftBottom: ReactNode;
  ctas: ReactNode;
};

/** The interactive teaser. Same engine as the full calculator (W2), same view model as the
 *  server fallback (`teaserView`), so the swap-in is DOM-identical for the default state. */
export function CalculatorTeaser({ locale, rateConfig, roles, whatsappNumber, copy, leftTop, leftBottom, ctas }: CalculatorTeaserProps) {
  const sys = useTranslations('sys');
  const pathname = usePathname();
  const [roleKey, setRoleKey] = useState(roles[0].row.key);
  const [headcount, setHeadcount] = useState<number>(DEFAULT_HEADCOUNT);
  const [expanded, setExpanded] = useState(false);
  const role = roles.find((r) => r.row.key === roleKey) ?? roles[0];
  const view = teaserView({
    role: role.row,
    label: role.label,
    headcount,
    rateConfig,
    locale,
    tx: {
      grossMin: copy.grossMin,
      grossFloor: (multiplier) => sys('home.calc.grossFloor', { multiplier }),
      headcount: (n) => sys('home.calc.headcount', { n }),
      estimate: (a) => sys('home.whatsapp.estimate', a),
    },
  });
  // W12: enum-key params only — the preset key and a number, never free text.
  const fire = (nextRole: string, nextHeadcount: number) =>
    track('calculator_use', { page: pathname ?? '/', locale, role: nextRole, headcount: nextHeadcount });
  return (
    <TeaserLayout
      ready
      leftTop={leftTop}
      leftBottom={leftBottom}
      chips={
        <>
          <TeaserChips
            name="teaser-role"
            legend={copy.rolesLegend}
            options={roles.map((r) => ({ value: r.row.key, label: r.label }))}
            value={roleKey}
            onChange={(v) => {
              setRoleKey(v);
              fire(v, headcount);
            }}
          />
          <TeaserChips
            name="teaser-headcount"
            legend={copy.headcountLegend}
            emphasis="ink"
            options={HEADCOUNT_PRESETS.map((n) => ({ value: String(n), label: sys('home.calc.headcount', { n }) }))}
            value={String(headcount)}
            onChange={(v) => {
              const n = Number(v);
              setHeadcount(n);
              fire(roleKey, n);
            }}
          />
        </>
      }
      card={
        <TeaserCard
          view={view}
          copy={copy}
          whatsappHref={waLink(whatsappNumber, view.whatsappText)}
          expanded={expanded}
          onToggle={() => setExpanded((e) => !e)}
          ctas={ctas}
        />
      }
    />
  );
}
```

`src/app/[locale]/(site)/_components/CalculatorTeaserLazy.tsx`:

```tsx
'use client';
import { lazy, Suspense, type ReactNode } from 'react';
import type { CalculatorTeaserProps } from './CalculatorTeaser';
import { useInView } from './useInView';

const CalculatorTeaser = lazy(() =>
  import('./CalculatorTeaser').then((m) => ({ default: m.CalculatorTeaser })),
);

/**
 * W13 amended: the engine + island stay out of the initial script graph. `fallback` is the
 * server-rendered static teaser for the default state (DOM-identical to the island's first
 * render), kept as the Suspense fallback too so the swap never blanks the section.
 */
export function CalculatorTeaserLazy({ fallback, ...props }: CalculatorTeaserProps & { fallback: ReactNode }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={fallback}>
          <CalculatorTeaser {...props} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
```

`src/app/[locale]/(site)/_sections/calculator.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/adapter';
import { getCollection, getRateConfig } from '@/content/collections';
import { Button, Eyebrow, Section } from '@/design/primitives';
import { effectiveYear, isReviewDue, presets } from '@/lib/calculator';
import { waLink } from '@/lib/contact';
import { CalculatorTeaserLazy } from '../_components/CalculatorTeaserLazy';
import { TeaserCard, type TeaserCardCopy } from '../_components/TeaserCard';
import { TeaserChips } from '../_components/TeaserChips';
import { TeaserLayout } from '../_components/TeaserLayout';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, teaserView } from '../_lib/teaser';
import type { SectionProps } from './types';

/**
 * "Real cost, 2026 rates" (home.068–090). The numbers come from `rateConfig` and the three
 * preset rows through the shared engine (W2); the dated eyebrow/badge render as authored while
 * the config is in review and fall back to the undated copy after `reviewDueAt` (D17). W58: the
 * General figure is ₺40,214 with support off; home.074/082/090/299 are legal-flagged and stay
 * verbatim for the WP-C legal review.
 */
export async function CalculatorStrip({ locale, bundle }: SectionProps) {
  const sys = await getTranslations('sys');
  const tf = makeTf(bundle, locale);
  const rateConfig = getRateConfig(bundle);
  const reviewDue = isReviewDue(rateConfig);
  const roles = presets(getCollection(bundle, 'calculatorRoles')).map((row) => ({ row, label: tf(row.labelId) }));
  const copy: TeaserCardCopy & { rolesLegend: string; headcountLegend: string } = {
    rolesLegend: tf('home.072'),
    headcountLegend: tf('home.073'),
    per: tf('home.078'),
    rates: reviewDue ? null : tf('home.079'),
    grossMin: tf('home.080'),
    sgk: tf('home.081'),
    support: tf('home.082'),
    supportValue: sys('home.calc.supportSeparate'),
    total: tf('home.083'),
    salaryPct: tf('home.084'),
    sgkPct: tf('home.085'),
    monthlyPayroll: sys('home.calc.monthlyPayroll'),
    oneOff: tf('home.086'),
    whatsapp: tf('home.087'),
    more: tf('home.088'),
    less: tf('home.089'),
    disc: tf('home.090'),
  };
  // Static default state (general × 15) — what the server sends and what the island starts from.
  const view = teaserView({
    role: roles[0].row,
    label: roles[0].label,
    headcount: DEFAULT_HEADCOUNT,
    rateConfig,
    locale,
    tx: {
      grossMin: copy.grossMin,
      grossFloor: (multiplier) => sys('home.calc.grossFloor', { multiplier }),
      headcount: (n) => sys('home.calc.headcount', { n }),
      estimate: (a) => sys('home.whatsapp.estimate', a),
    },
  });
  const ctas = (
    <>
      <Button variant="primary" href="/hiring-cost-calculator">
        {tf('home.076')}
      </Button>
      <Button variant="secondary" href="/work-permit">
        {tf('home.077')}
      </Button>
    </>
  );
  const leftTop = (
    <>
      {/* The eyebrow carries the authored year; home.copy.test.ts pins it to effectiveYear (D17). */}
      <Eyebrow>{reviewDue ? sys('home.calc.eyebrowUndated') : tf('home.068')}</Eyebrow>
      <h2 className="mb-3 mt-2 text-h2 leading-tight tracking-[-1.2px]">{tf('home.069')}</h2>
      <p className="mb-6 max-w-[520px] text-body text-text-secondary">
        {tf('home.070')} <span className="hidden md:inline">{tf('home.071')}</span>
      </p>
    </>
  );
  const leftBottom = (
    <>
      <div className="mb-6 hidden flex-col gap-2 text-body-sm text-text-secondary xs:flex">
        <p className="m-0">{tf('home.074')}</p>
        <p className="m-0">{tf('home.075')}</p>
      </div>
      <div className="hidden flex-wrap gap-3 xs:flex">{ctas}</div>
    </>
  );
  const fallback = (
    <TeaserLayout
      leftTop={leftTop}
      leftBottom={leftBottom}
      chips={
        <>
          <TeaserChips name="teaser-role" legend={copy.rolesLegend} options={roles.map((r) => ({ value: r.row.key, label: r.label }))} value={roles[0].row.key} />
          <TeaserChips
            name="teaser-headcount"
            legend={copy.headcountLegend}
            emphasis="ink"
            options={HEADCOUNT_PRESETS.map((n) => ({ value: String(n), label: sys('home.calc.headcount', { n }) }))}
            value={String(DEFAULT_HEADCOUNT)}
          />
        </>
      }
      card={
        <TeaserCard
          view={view}
          copy={copy}
          whatsappHref={waLink(bundle.settings.whatsappNumber, view.whatsappText)}
          expanded={false}
          ctas={ctas}
        />
      }
    />
  );
  return (
    <Section tone="light" id="cost" className="border-t border-border-3">
      <div className="container-site">
        <CalculatorTeaserLazy
          fallback={fallback}
          locale={locale}
          rateConfig={rateConfig}
          roles={roles}
          whatsappNumber={bundle.settings.whatsappNumber}
          copy={copy}
          leftTop={leftTop}
          leftBottom={leftBottom}
          ctas={ctas}
        />
      </div>
    </Section>
  );
}

/** Exported for the copy test only: the year the "2026 rates" badge must agree with. */
export const rateYear = (bundle: SectionProps['bundle']) => effectiveYear(getRateConfig(bundle));
```

`src/app/[locale]/(site)/page.tsx` — add `import { CalculatorStrip } from './_sections/calculator';` and render `<CalculatorStrip {...section} />` after `<PoolSection …/>`.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/\[locale\]/(site)"` → green (teaser 4, CalculatorTeaser 4 + earlier). `npm run verify` green. Build + `next start -p 3100`; in the browser: the strip shows general × 15 (₺603,210 TR `603.210 ₺`) before scrolling; scrolling to it swaps in the island without a layout shift (DevTools → Performance → no layout-shift entries in the section); chips recompute; the `calculator_use` push appears in `window.dataLayer`. Confirm the engine chunk is not in the initial load: Network tab filtered to `.js` on a cold load of `/` shows no `CalculatorTeaser` chunk until the section scrolls into view.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/\(site\)/_lib/teaser.ts src/app/[locale]/\(site\)/_lib/teaser.test.ts src/app/[locale]/\(site\)/_components/TeaserChips.tsx src/app/[locale]/\(site\)/_components/TeaserCard.tsx src/app/[locale]/\(site\)/_components/TeaserLayout.tsx src/app/[locale]/\(site\)/_components/useInView.ts src/app/[locale]/\(site\)/_components/CalculatorTeaser.tsx src/app/[locale]/\(site\)/_components/CalculatorTeaser.test.tsx src/app/[locale]/\(site\)/_components/CalculatorTeaserLazy.tsx src/app/[locale]/\(site\)/_sections/calculator.tsx src/app/[locale]/\(site\)/page.tsx
git commit -m "feat(home): calculator teaser on the shared engine — three presets, viewport-lazy island (T1 c3)

W2/W58: exact floors, support off (₺40,214 general); dated badge hides after reviewDueAt (D17);
calculator_use with the preset key (W12); engine chunk loads on approach (W13 amended).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — Process timeline (`ProcessSteps` plain) and the season planner island (lazy, below the fold)

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/_lib/season.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  monthNames,
  nowMarkerLeft,
  resolveStart,
  SEASON_ROWS,
  seasonHeadline,
  seasonRange,
  signByMonth,
  type SeasonTx,
} from './season';

const tx: SeasonTx = {
  range: ({ from, to }) => `Peak ${from}–${to}`,
  also: ({ from, to }) => ` · also ${from}–${to}`,
  signBy: ({ start, signBy }) => `For a ${start} start, sign by ${signBy}`,
  noPeak: () => 'No peak season — but permits still take 45 days',
};

describe('SEASON_ROWS (the design\'s four rows — numbers are data, copy is package ids)', () => {
  it('carries the design\'s month ranges and package ids', () => {
    expect(SEASON_ROWS.map((r) => r.key)).toEqual(['agriculture', 'tourism', 'construction', 'factory']);
    expect(SEASON_ROWS[0]).toMatchObject({ nameId: 'home.243', subId: null, noteId: 'home.250', peak: [8, 11], second: [2, 4], start: 8 });
    expect(SEASON_ROWS[1]).toMatchObject({ nameId: 'home.247', subId: 'home.244', noteId: 'home.251', peak: [3, 9], second: [10, 11], start: 3 });
    expect(SEASON_ROWS[2]).toMatchObject({ nameId: 'home.248', subId: 'home.245', noteId: 'home.252', peak: [2, 10], second: null, start: 2 });
    expect(SEASON_ROWS[3]).toMatchObject({ nameId: 'home.249', subId: 'home.246', noteId: 'home.253', peak: [0, 11], second: null, start: 'now' });
  });
});

describe('month names come from Intl, never a hard-coded list', () => {
  it('TR short/long', () => {
    expect(monthNames('tr', 'short')).toEqual(['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']);
    expect(monthNames('tr', 'long')[8]).toBe('Eylül');
  });
  it('EN short is the design\'s three-letter form ("Sep", not en-GB\'s "Sept")', () => {
    expect(monthNames('en', 'short')).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    expect(monthNames('en', 'long')[0]).toBe('January');
  });
});

describe('composition', () => {
  const short = monthNames('en', 'short');
  const long = monthNames('en', 'long');
  it('sign-by is two months before the start, wrapping the year', () => {
    expect(signByMonth(8)).toBe(6);
    expect(signByMonth(0)).toBe(10);
    expect(signByMonth(1)).toBe(11);
  });
  it('range text: peak, plus the secondary season when there is one', () => {
    expect(seasonRange(SEASON_ROWS[0], short, tx)).toBe('Peak Sep–Dec · also Mar–May');
    expect(seasonRange(SEASON_ROWS[2], short, tx)).toBe('Peak Mar–Nov');
  });
  it('headline: sign-by for a dated start, the no-peak line for the year-round row', () => {
    expect(seasonHeadline(SEASON_ROWS[0], 0, long, tx)).toBe('For a September start, sign by July');
    expect(seasonHeadline(SEASON_ROWS[1], 0, long, tx)).toBe('For a April start, sign by February');
    expect(seasonHeadline(SEASON_ROWS[3], 5, long, tx)).toBe('No peak season — but permits still take 45 days');
  });
  it('"now" resolves to the current month; the marker sits mid-column', () => {
    expect(resolveStart(SEASON_ROWS[3], 9)).toBe(9);
    expect(resolveStart(SEASON_ROWS[0], 9)).toBe(8);
    expect(nowMarkerLeft(0)).toBe('4.17%');
    expect(nowMarkerLeft(11)).toBe('95.83%');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/_lib/season.test.ts"` → fails on the missing module.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_lib/season.ts`:

```ts
import type { Locale } from '@/i18n/routing';

export type SeasonKey = 'agriculture' | 'tourism' | 'construction' | 'factory';

export type SeasonRow = {
  key: SeasonKey;
  nameId: string;
  /** null = the agriculture row's place list, which has no package id → sys.home.season.agricultureSub */
  subId: string | null;
  noteId: string;
  /** 0-based months, inclusive */
  peak: [number, number];
  second: [number, number] | null;
  /** 0-based start month, or 'now' for the year-round row (the design: factory start = current month) */
  start: number | 'now';
};

/** The design's SEASONS table (JobsAdmire Homepage v4, renderVals). Month numbers are data; every
 *  visible string is a package id resolved by the section. */
export const SEASON_ROWS: readonly SeasonRow[] = [
  { key: 'agriculture', nameId: 'home.243', subId: null, noteId: 'home.250', peak: [8, 11], second: [2, 4], start: 8 },
  { key: 'tourism', nameId: 'home.247', subId: 'home.244', noteId: 'home.251', peak: [3, 9], second: [10, 11], start: 3 },
  { key: 'construction', nameId: 'home.248', subId: 'home.245', noteId: 'home.252', peak: [2, 10], second: null, start: 2 },
  { key: 'factory', nameId: 'home.249', subId: 'home.246', noteId: 'home.253', peak: [0, 11], second: null, start: 'now' },
];

/** The design's `backTwo`: sign two months before the start month, wrapping the year. */
export function signByMonth(start: number): number {
  return (start + 10) % 12;
}

export function resolveStart(row: Pick<SeasonRow, 'start'>, nowMonth: number): number {
  return row.start === 'now' ? nowMonth : row.start;
}

// 'en' (not the repo's en-GB date locale) on purpose: en-GB abbreviates September as "Sept"
// since ICU 72; the design's column header is "Sep".
const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en' };

/** Twelve month names from Intl (never a hard-coded list, W9): 'short' for the grid header,
 *  'long' for the headline. UTC mid-month dates so no zone can shift a month. */
export function monthNames(locale: Locale, style: 'short' | 'long'): string[] {
  const fmt = new Intl.DateTimeFormat(INTL[locale], { month: style, timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, m) => fmt.format(new Date(Date.UTC(2026, m, 15))));
}

/** The green "this month" line: centred in its column of twelve. */
export function nowMarkerLeft(month: number): string {
  return `${((month + 0.5) * (100 / 12)).toFixed(2)}%`;
}

/** The translator surface — sys ICU strings on both server and island (R23: no next-intl here). */
export type SeasonTx = {
  range: (a: { from: string; to: string }) => string;
  also: (a: { from: string; to: string }) => string;
  signBy: (a: { start: string; signBy: string }) => string;
  noPeak: () => string;
};

export function seasonRange(row: Pick<SeasonRow, 'peak' | 'second'>, short: string[], tx: SeasonTx): string {
  const peak = tx.range({ from: short[row.peak[0]], to: short[row.peak[1]] });
  return row.second ? peak + tx.also({ from: short[row.second[0]], to: short[row.second[1]] }) : peak;
}

export function seasonHeadline(row: Pick<SeasonRow, 'key' | 'start'>, nowMonth: number, long: string[], tx: SeasonTx): string {
  if (row.key === 'factory') return tx.noPeak();
  const start = resolveStart(row, nowMonth);
  return tx.signBy({ start: long[start], signBy: long[signByMonth(start)] });
}
```

`src/app/[locale]/(site)/_components/SeasonGrid.tsx` (no directive — server fallback and island):

```tsx
import type { ReactNode } from 'react';
import { buttonClassName } from '@/design/primitives';
import { nowMarkerLeft, type SeasonKey } from '../_lib/season';
import { LiveDot } from './LiveDot';

export type SeasonRowView = {
  key: SeasonKey;
  name: string;
  sub: string;
  note: string;
  peak: [number, number];
  second: [number, number] | null;
  /** "Peak Sep–Dec · also Mar–May" — shown under the name at ≤460 (W10) */
  range: string;
};

export type SeasonGridCopy = {
  gridLabel: string;
  hint: string;
  legend: { peak: string; second: string; now: string };
};

/**
 * The 12-column planner. Rows are `aria-pressed` buttons (the design's clickable rows);
 * `onSelect` is absent in the server fallback, so the rows are inert until the island mounts.
 * `nowMonth === null` (server) renders no marker and no "Now:" pill — a browser fact (R18).
 */
export function SeasonGrid({
  heading,
  monthsShort,
  rows,
  selected,
  nowMonth,
  nowLabel,
  headline,
  copy,
  ctaHref,
  ctaLabel,
  onSelect,
  ready,
}: {
  heading: ReactNode;
  monthsShort: string[];
  rows: SeasonRowView[];
  selected: number;
  nowMonth: number | null;
  nowLabel: string | null;
  headline: string;
  copy: SeasonGridCopy;
  ctaHref: string;
  ctaLabel: string;
  onSelect?: (index: number) => void;
  ready?: boolean;
}) {
  const active = rows[selected];
  return (
    <div data-testid="season-planner" data-island={ready ? 'ready' : undefined}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        {heading}
        <span
          aria-live="polite"
          className="inline-flex min-h-[32px] items-center gap-2 rounded-pill bg-success-surface px-3 text-body-sm font-extrabold text-success-text"
        >
          {nowLabel ? (
            <>
              <LiveDot />
              {nowLabel}
            </>
          ) : null}
        </span>
      </div>
      <p className="sr-only">{copy.hint}</p>
      <div className="-mx-3 overflow-x-auto px-3 pb-1">
        <div role="group" aria-label={copy.gridLabel} className="min-w-[560px]">
          <div className="mb-2 grid grid-cols-[150px_1fr] items-center gap-4 xs:grid-cols-[180px_1fr]">
            <span />
            <span className="grid grid-cols-12 text-center text-[11.5px] font-extrabold tracking-[0.4px] text-muted">
              {monthsShort.map((m, i) => (
                <span key={m} className={i === nowMonth ? 'text-success' : undefined}>
                  <span className="hidden xs:inline">{m}</span>
                  <span className="xs:hidden">{m.charAt(0)}</span>
                </span>
              ))}
            </span>
          </div>
          {rows.map((row, i) => {
            const isActive = i === selected;
            return (
              <button
                key={row.key}
                type="button"
                data-testid={`season-row-${row.key}`}
                aria-pressed={isActive}
                onClick={onSelect ? () => onSelect(i) : undefined}
                className={[
                  'mb-2 grid w-full grid-cols-[150px_1fr] items-center gap-4 rounded-base px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xs:grid-cols-[180px_1fr]',
                  isActive ? 'bg-pale-1' : 'bg-transparent hover:bg-pale-2',
                ].join(' ')}
              >
                <span>
                  <span className="block text-body-sm font-extrabold">{row.name}</span>
                  <span className="block text-[11.5px] text-text-tertiary">{row.sub}</span>
                  <span className="block text-[11px] font-bold text-text-secondary xs:hidden">{row.range}</span>
                </span>
                <span className="relative grid h-9 grid-cols-12">
                  <span
                    aria-hidden="true"
                    style={{ gridColumn: `${row.peak[0] + 1} / ${row.peak[1] + 2}`, gridRow: 1 }}
                    className={`z-[2] mx-[3px] my-1 block rounded-[10px] ${isActive ? 'bg-blue' : 'bg-[#8fcbe8]'}`}
                  />
                  {row.second ? (
                    <span
                      aria-hidden="true"
                      style={{ gridColumn: `${row.second[0] + 1} / ${row.second[1] + 2}`, gridRow: 1 }}
                      className={`z-[1] mx-[3px] my-1 block rounded-[10px] ${isActive ? 'bg-tint-border' : 'bg-border-1'}`}
                    />
                  ) : null}
                  {nowMonth !== null ? (
                    <span
                      aria-hidden="true"
                      style={{ left: nowMarkerLeft(nowMonth) }}
                      className="absolute bottom-0 top-0 z-[3] w-[2px] bg-success"
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-[11.5px] font-bold text-text-secondary">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-4 rounded bg-blue" />
          {copy.legend.peak}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-4 rounded bg-tint-border" />
          {copy.legend.second}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-[2px] bg-success" />
          {copy.legend.now}
        </span>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-pale-1 p-5">
        <div>
          <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-blue-safe">{active.name}</p>
          <p data-testid="season-headline" className="m-0 mt-1 text-card-title font-extrabold">
            {headline}
          </p>
          <p className="m-0 mt-1 max-w-[640px] text-body-sm text-text-secondary">{active.note}</p>
        </div>
        <a href={ctaHref} className={buttonClassName('primary')}>
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/_components/SeasonPlanner.tsx`:

```tsx
'use client';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { monthNames, seasonHeadline, seasonRange, type SeasonRow, type SeasonTx } from '../_lib/season';
import { SeasonGrid, type SeasonGridCopy } from './SeasonGrid';

export type SeasonPlannerProps = {
  locale: Locale;
  /** SEASON_ROWS with the package copy resolved by the section (serialisable) */
  rows: (SeasonRow & { name: string; sub: string; note: string })[];
  copy: SeasonGridCopy & { nowPrefix: string; permitDays: string };
  heading: ReactNode;
  ctaHref: string;
  ctaLabel: string;
};

// R18: the current month is a browser fact — read through useSyncExternalStore, null on the server.
const subscribeNever = () => () => {};
const clientMonthKey = () => {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
};
const serverMonthKey = () => null;

/** The interactive planner: row selection, the "Now:" pill and the current-month marker. */
export function SeasonPlanner({ locale, rows, copy, heading, ctaHref, ctaLabel }: SeasonPlannerProps) {
  const sys = useTranslations('sys');
  const monthKey = useSyncExternalStore(subscribeNever, clientMonthKey, serverMonthKey);
  const nowMonth = monthKey === null ? null : monthKey % 12;
  const year = monthKey === null ? null : Math.floor(monthKey / 12);
  const [selected, setSelected] = useState(0);
  const short = monthNames(locale, 'short');
  const long = monthNames(locale, 'long');
  const tx: SeasonTx = {
    range: (a) => sys('home.season.range', a),
    also: (a) => sys('home.season.also', a),
    signBy: (a) => sys('home.season.signBy', a),
    noPeak: () => sys('home.season.noPeak', { permitDays: copy.permitDays }),
  };
  const views = rows.map((r) => ({ ...r, range: seasonRange(r, short, tx) }));
  return (
    <SeasonGrid
      ready
      heading={heading}
      monthsShort={short}
      rows={views}
      selected={selected}
      nowMonth={nowMonth}
      nowLabel={nowMonth === null ? null : `${copy.nowPrefix} ${long[nowMonth]} ${year}`}
      headline={seasonHeadline(views[selected], nowMonth ?? 0, long, tx)}
      copy={copy}
      ctaHref={ctaHref}
      ctaLabel={ctaLabel}
      onSelect={setSelected}
    />
  );
}
```

`src/app/[locale]/(site)/_components/SeasonPlannerLazy.tsx`:

```tsx
'use client';
import { lazy, Suspense, type ReactNode } from 'react';
import type { SeasonPlannerProps } from './SeasonPlanner';
import { useInView } from './useInView';

const SeasonPlanner = lazy(() => import('./SeasonPlanner').then((m) => ({ default: m.SeasonPlanner })));

/** W13 amended: the planner is well below the fold; the static grid stands in until then. */
export function SeasonPlannerLazy({ fallback, ...props }: SeasonPlannerProps & { fallback: ReactNode }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={fallback}>
          <SeasonPlanner {...props} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
```

`src/app/[locale]/(site)/_sections/season.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf, metricValues } from '@/content/adapter';
import { Eyebrow, Section } from '@/design/primitives';
import { SeasonGrid } from '../_components/SeasonGrid';
import { SeasonPlannerLazy } from '../_components/SeasonPlannerLazy';
import { monthNames, SEASON_ROWS, seasonHeadline, seasonRange, type SeasonTx } from '../_lib/season';
import type { SectionProps } from './types';

/** "Season planner" (home.096–103, 217, 243–253). The rows' copy is the package's; the month
 *  ranges are data (`SEASON_ROWS`); "45 days" in the no-peak line is the `permitDays` metric. */
export async function SeasonSection({ locale, bundle }: SectionProps) {
  const sys = await getTranslations('sys');
  const tf = makeTf(bundle, locale);
  const permitDays = metricValues(bundle, locale).permitDays;
  const rows = SEASON_ROWS.map((r) => ({
    ...r,
    name: tf(r.nameId),
    sub: r.subId ? tf(r.subId) : sys('home.season.agricultureSub'),
    note: tf(r.noteId),
  }));
  const copy = {
    gridLabel: sys('home.season.gridLabel'),
    hint: sys('home.season.selectHint'),
    legend: { peak: tf('home.100'), second: tf('home.101'), now: tf('home.102') },
    nowPrefix: tf('home.217'),
    permitDays,
  };
  const heading = (
    <div>
      <Eyebrow>{tf('home.096')}</Eyebrow>
      <h2 className="mb-3 mt-2 text-h2 leading-tight tracking-[-1.2px]">{tf('home.097')}</h2>
      <p className="m-0 max-w-[560px] text-body text-text-secondary">
        {tf('home.098')} <span className="hidden md:inline">{tf('home.099')}</span>
      </p>
    </div>
  );
  // The static fallback: row 0 selected, no "now" (a browser fact), same composition as the island.
  const short = monthNames(locale, 'short');
  const long = monthNames(locale, 'long');
  const tx: SeasonTx = {
    range: (a) => sys('home.season.range', a),
    also: (a) => sys('home.season.also', a),
    signBy: (a) => sys('home.season.signBy', a),
    noPeak: () => sys('home.season.noPeak', { permitDays }),
  };
  const views = rows.map((r) => ({ ...r, range: seasonRange(r, short, tx) }));
  const fallback = (
    <SeasonGrid
      heading={heading}
      monthsShort={short}
      rows={views}
      selected={0}
      nowMonth={null}
      nowLabel={null}
      headline={seasonHeadline(views[0], 0, long, tx)}
      copy={copy}
      ctaHref="#proposal"
      ctaLabel={tf('home.103')}
    />
  );
  return (
    <Section tone="light" id="season" className="border-t border-border-3">
      <div className="container-site">
        <SeasonPlannerLazy fallback={fallback} locale={locale} rows={rows} copy={copy} heading={heading} ctaHref="#proposal" ctaLabel={tf('home.103')} />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_sections/process.tsx`:

```tsx
import { makeTf } from '@/content/adapter';
import { ProcessSteps, type ProcessStep } from '@/design/blocks';
import { Eyebrow, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { SectionProps } from './types';

const SECTOR_CHIP_IDS = ['home.224', 'home.225', 'home.226', 'home.227'] as const;

/** "How it works" (home.091–118, chips home.224–227): the sticky intro + effort box on the left,
 *  the five plain-variant steps on the right. `when` labels are resolved here (home.107 carries
 *  the {homepageReplyHours} placeholder → makeTf). */
export function ProcessSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const steps: ProcessStep[] = [
    { n: 1, titleId: 'home.105', bodyId: 'home.106', when: tf('home.104') },
    { n: 2, titleId: 'home.108', bodyId: 'home.109', when: tf('home.107') },
    { n: 3, titleId: 'home.111', bodyId: 'home.112', when: tf('home.110') },
    { n: 4, titleId: 'home.114', bodyId: 'home.115', when: tf('home.113') },
    { n: 5, titleId: 'home.117', bodyId: 'home.118', when: tf('home.116') },
  ];
  return (
    <Section tone="light" id="process" className="border-t border-border-3">
      <div data-testid="process" className="container-site grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>{tf('home.091')}</Eyebrow>
          <h2 className="mb-3 mt-2 text-h2-process leading-tight tracking-[-1.2px]">{tf('home.092')}</h2>
          <p className="mb-6 max-w-[520px] text-body text-text-secondary">{tf('home.093')}</p>
          <div className="mb-5 rounded-xl border border-border-1 bg-pale-1 p-5">
            <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-blue-safe">{tf('home.094')}</p>
            <p className="m-0 mt-1 text-body-sm font-bold">{tf('home.095')}</p>
          </div>
          {/* Sector chips are hidden at ≤460 in the design (W10). */}
          <div className="hidden flex-wrap gap-2 xs:flex">
            {SECTOR_CHIP_IDS.map((id) => (
              <Link
                key={id}
                href="/hire-workers"
                className="rounded-pill border border-border-1 px-3 py-1.5 text-body-sm font-bold text-text-secondary no-underline hover:border-blue"
              >
                {tf(id)}
              </Link>
            ))}
          </div>
        </div>
        <ProcessSteps bundle={bundle} locale={locale} steps={steps} variant="plain" headingLevel={3} />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/page.tsx` — add the two imports and render `<ProcessSection {...section} />` and `<SeasonSection {...section} />` after `<CalculatorStrip …/>`.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/\[locale\]/(site)"` → green (season 7 + earlier). `npm run verify` green. Build + start: the planner renders the static grid (no "Now:" pill, row 1 selected) and, once scrolled near, the pill "Şimdi: Eylül 2026" / "Now: September 2026", the green marker and clickable rows appear with no layout shift (the pill's container reserves its height).

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/\(site\)/_lib/season.ts src/app/[locale]/\(site\)/_lib/season.test.ts src/app/[locale]/\(site\)/_components/SeasonGrid.tsx src/app/[locale]/\(site\)/_components/SeasonPlanner.tsx src/app/[locale]/\(site\)/_components/SeasonPlannerLazy.tsx src/app/[locale]/\(site\)/_sections/season.tsx src/app/[locale]/\(site\)/_sections/process.tsx src/app/[locale]/\(site\)/page.tsx
git commit -m "feat(home): process steps (plain) and the season planner island — month data, Intl month names, lazy on approach (T1 c4)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — Network map, team (hidden), portal + app, work with us, guides (blog-gated), FAQ, closing band, sticky bar

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/_lib/guides.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { BlogPost } from '@/content/collections';
import { testBundle } from '@/test/bundle';
import { guidesPosts } from './guides';

const post = (key: string, publishedAt: string, bodies: { tr: boolean; en: boolean }): BlogPost => ({
  key,
  slug: { tr: bodies.tr ? `${key}-tr` : null, en: bodies.en ? key : null },
  title: { tr: bodies.tr ? `${key} TR` : null, en: bodies.en ? `${key} EN` : null },
  excerpt: { tr: bodies.tr ? 'tr' : null, en: bodies.en ? 'en' : null },
  category: 'recruitment',
  categoryLabelId: 'blog.011',
  author: 'JobsAdmire',
  publishedAt,
  readMinutes: 5,
  hasBody: bodies,
  body: { tr: bodies.tr ? '# tr' : null, en: bodies.en ? '# en' : null },
});

describe('guidesPosts (W4/W33: written articles only, newest first, per locale)', () => {
  const bundle = testBundle({
    collections: {
      blog: [
        post('old', '2026-01-10', { tr: false, en: true }),
        post('new', '2026-03-01', { tr: false, en: true }),
        post('tr-only', '2026-02-01', { tr: true, en: false }),
        post('index-only', '2026-04-01', { tr: false, en: false }),
      ],
    },
  });
  it('EN: the two written EN articles, newest first', () => {
    expect(guidesPosts(bundle, 'en').map((p) => p.key)).toEqual(['new', 'old']);
  });
  it('TR: only the TR body', () => {
    expect(guidesPosts(bundle, 'tr').map((p) => p.key)).toEqual(['tr-only']);
  });
  it('no blog collection → no posts (the section then renders null)', () => {
    expect(guidesPosts(testBundle(), 'en')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/_lib/guides.test.ts"` → missing module.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_lib/guides.ts`:

```ts
import { getCollection, type BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/** Written articles in this locale (hasBody + slug + title), newest first — the only rows a
 *  PostCard can render (W33). The blog index applies the same rule. */
export function guidesPosts(bundle: Bundle, locale: Locale): BlogPost[] {
  return getCollection(bundle, 'blog')
    .filter((p) => p.hasBody[locale] && p.slug[locale] !== null && p.title[locale] !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
```

`src/app/[locale]/(site)/_sections/network.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf, metricValues } from '@/content/adapter';
import { getCollection, type SourceCountry } from '@/content/collections';
import { isFlagCode } from '@/design/assets/flag-codes';
import { SourceMap, sourceMapLabels } from '@/design/assets/source-map';
import { Flag } from '@/design/Flag';
import { Button, buttonClassName, Eyebrow, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { SectionProps } from './types';

function CountryChip({ c, dark }: { c: SourceCountry; dark?: boolean }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 text-body-sm font-bold',
        dark ? '' : 'rounded-pill border border-border-1 bg-white px-3 py-1.5',
      ].join(' ')}
    >
      {isFlagCode(c.code) ? <Flag code={c.code} size={17} /> : null}
      {c.name}
    </span>
  );
}

/**
 * "Agent network" (home.119–126, 202). Desktop: the build-time SVG map (W14); ≤460: the dark
 * country card (W10 — both in the DOM, CSS decides). Countries and the count come from the
 * `sourceCountries` collection and the `countries` metric (W1: 13 incl. Sri Lanka). "Report
 * fraud" goes to the Verify page's form (`#report`, CTA_BY_PATHNAME['/verify']) — the real
 * fraud form — not the design's WhatsApp prefill.
 */
export async function NetworkSection({ locale, bundle }: SectionProps) {
  const sys = await getTranslations('sys');
  const tf = makeTf(bundle, locale);
  const countries = getCollection(bundle, 'sourceCountries');
  const count = metricValues(bundle, locale).countries;
  return (
    <Section tone="light" id="network" className="border-t border-border-3">
      <div data-testid="network" className="container-site grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="hidden xs:block">
          <SourceMap
            title={sys('home.network.mapTitle')}
            labels={sourceMapLabels(countries)}
            turkiyeLabel={sys('home.network.turkiye')}
            className="h-auto w-full"
          />
        </div>
        <div>
          <Eyebrow>{tf('home.119')}</Eyebrow>
          <h2 className="mb-3 mt-2 text-h2 leading-tight tracking-[-1.2px]">{tf('home.120')}</h2>
          <p className="mb-6 max-w-[560px] text-body text-text-secondary">{tf('home.121')}</p>
          <div className="relative mb-6 overflow-hidden rounded-xl bg-navy p-5 text-white xs:hidden">
            <p className="m-0 flex items-baseline gap-2">
              <span className="text-stat font-extrabold">{count}</span>
              <span className="text-body-sm text-white/70">{tf('home.122')}</span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {countries.map((c) => (
                <CountryChip key={c.code} c={c} dark />
              ))}
            </div>
            <p className="m-0 mt-4 text-body-sm text-white/70">{tf('home.123')}</p>
            <p className="m-0 mt-1 text-body-sm text-white/70">{tf('home.124')}</p>
          </div>
          <div className="mb-6 hidden flex-wrap gap-2 xs:flex">
            {countries.map((c) => (
              <CountryChip key={c.code} c={c} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" href="/partner-with-us">
              {tf('home.125')}
            </Button>
            <Button variant="secondary" href={bundle.settings.telegramUrl} external>
              {tf('home.202')}
            </Button>
            <Link
              href={{ pathname: '/verify', hash: '#report' }}
              className={buttonClassName('secondary', 'md', 'border-danger-border text-danger hover:bg-danger-surface')}
            >
              {tf('home.126')}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_sections/team.tsx`:

```tsx
import { z } from 'zod';
import { makeTf } from '@/content/adapter';
import { ImageSlot } from '@/design/blocks';
import { Button, Eyebrow, Section } from '@/design/primitives';
import { hasRows, rawRows } from '../_lib/phase-a';
import type { SectionProps } from './types';

const FounderRow = z.object({ name: z.string().min(1), photo: z.string().min(1).nullable().optional() });
const MINI_CARDS = [
  ['home.133', 'home.131'],
  ['home.132', 'home.134'],
  ['home.135', 'home.136'],
] as const;

/**
 * "Our team" (home.127–139, 200). Every line is a claim about the public register ("everyone
 * below is on our payroll with a JA- ID — check anyone on the public register") that Phase A
 * cannot back: `representatives` is empty and fixture-only (D23, §10 row 3 default "claim strings
 * unpublished", W6). Rendered only once the collection has rows; the founder card reads the first
 * row's name/photo (v1.1 `WebsiteRepresentative` shape — parsed loosely, skipped when it differs).
 */
export function TeamSection({ locale, bundle }: SectionProps) {
  if (!hasRows(bundle, 'representatives')) return null;
  const tf = makeTf(bundle, locale);
  const founder = FounderRow.safeParse(rawRows(bundle, 'representatives')[0]);
  return (
    <Section tone="light" id="team" className="border-t border-border-3">
      <div data-testid="team" className="container-site">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{tf('home.200')}</Eyebrow>
            <h2 className="mb-0 mt-2 text-h2 leading-tight tracking-[-1.2px]">{tf('home.127')}</h2>
          </div>
          <p className="m-0 max-w-[480px] text-body-sm text-text-secondary">{tf('home.128')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {founder.success ? (
            <article className="relative flex gap-4 overflow-hidden rounded-xl bg-navy p-5 text-white md:col-span-2 lg:col-span-1">
              <ImageSlot
                slot="rep-founder"
                src={founder.data.photo ?? null}
                alt={founder.data.name}
                width={104}
                height={130}
                className="h-[130px] w-[104px] shrink-0 rounded-base object-cover"
              />
              <div>
                <span className="inline-block rounded-pill bg-white/10 px-2 py-0.5 text-[11px] font-extrabold">{tf('home.129')}</span>
                <h3 className="m-0 mt-2 text-card-title">{founder.data.name}</h3>
                <p className="m-0 mt-1 text-body-sm text-white/70">{tf('home.130')}</p>
              </div>
            </article>
          ) : null}
          {MINI_CARDS.map(([labelId, bodyId]) => (
            <article key={labelId} className="rounded-xl border border-border-2 bg-white p-5 shadow-card">
              <h3 className="m-0 text-card-title">{tf(labelId)}</h3>
              <p className="m-0 mt-1 text-body-sm text-text-secondary">{tf(bodyId)}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="primary" href="/verify">
            {tf('home.137')}
          </Button>
          <Button variant="secondary" href="/about">
            {tf('home.138')}
          </Button>
          <Button variant="secondary" href="/careers">
            {tf('home.139')}
          </Button>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_sections/portal.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/adapter';
import { ImageSlot, StoreBadges } from '@/design/blocks';
import { Button, Eyebrow, Section } from '@/design/primitives';
import { LiveDot } from '../_components/LiveDot';
import type { SectionProps } from './types';

const TILES = [
  ['home.207', 'home.165'],
  ['home.209', 'home.166'],
  ['home.167', 'home.168'],
  ['home.213', 'home.169'],
] as const;
const MOBILE_LINES = ['home.170', 'home.171', 'home.172'] as const;

/**
 * "Portal + app" (home.162–174, 207–216). Hidden at ≤460 in the design (`.ja-portal-sec`) — CSS,
 * not conditional rendering (W10). The two screens are named placeholders until product shots
 * ship (W55). home.215/216 are decorative mock-UI labels inside the illustration (aria-hidden),
 * not claims. W8: no iOS badge (`storeLinks.ios` is null) and the platform line says Android only.
 */
export async function PortalSection({ locale, bundle }: SectionProps) {
  const sys = await getTranslations('sys');
  const tf = makeTf(bundle, locale);
  const s = bundle.settings;
  const host = new URL(s.portal.host).host;
  return (
    <Section tone="light" id="portal" className="hidden border-t border-border-3 xs:block">
      <div data-testid="portal" className="container-site grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <Eyebrow>{tf('home.162')}</Eyebrow>
          <h2 className="mb-3 mt-2 text-h2 leading-tight tracking-[-1.2px]">{tf('home.163')}</h2>
          <p className="mb-6 max-w-[560px] text-body text-text-secondary">{tf('home.164')}</p>
          <div className="mb-6 hidden gap-3 sm:grid sm:grid-cols-2">
            {TILES.map(([titleId, bodyId]) => (
              <div key={titleId} className="rounded-base border border-border-1 p-4">
                <p className="m-0 font-extrabold">{tf(titleId)}</p>
                <p className="m-0 mt-1 text-body-sm text-text-secondary">{tf(bodyId)}</p>
              </div>
            ))}
          </div>
          <ul className="mb-6 flex list-none flex-col gap-2 p-0 text-body-sm font-bold sm:hidden">
            {MOBILE_LINES.map((id) => (
              <li key={id} className="flex items-start gap-2">
                <LiveDot className="mt-1.5" />
                {tf(id)}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" href="/hire-workers">
              {tf('home.173')}
            </Button>
            <StoreBadges bundle={bundle} locale={locale} android={s.storeLinks.android} ios={s.storeLinks.ios} tone="light" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(160deg,#16294f_0%,#0e1a37_60%,#0a1428_100%)] p-6 text-white xs:p-8">
          <div className="relative h-[400px]">
            <div className="absolute left-0 top-0 w-[82%] overflow-hidden rounded-lg border border-white/15 bg-[#0f2438] shadow-[0_30px_60px_rgba(3,10,26,0.5)]">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2 text-[11px] text-white/60">
                <span className="h-2 w-2 rounded-full bg-white/25" />
                <span className="h-2 w-2 rounded-full bg-white/25" />
                <span className="h-2 w-2 rounded-full bg-white/25" />
                <span className="ml-2">{host}</span>
              </div>
              <ImageSlot slot="portal-shortlist" src={null} alt="" width={640} height={240} className="block w-full" />
            </div>
            <div className="absolute bottom-0 right-1.5 w-[150px] overflow-hidden rounded-[24px] bg-[#0f2438] p-[7px] shadow-[0_30px_60px_rgba(3,10,26,0.5)]">
              <ImageSlot slot="portal-mobile-app" src={null} alt="" width={136} height={278} className="block w-full rounded-[18px]" />
            </div>
            <div aria-hidden="true" className="absolute bottom-[110px] left-4 inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1.5 text-[12px] font-extrabold">
              <LiveDot />
              {tf('home.215')}
            </div>
            <div aria-hidden="true" className="absolute -top-3.5 right-5 rounded-xs bg-blue px-4 py-2 text-[12px] font-extrabold">
              {tf('home.216')}
            </div>
          </div>
          <p className="m-0 mt-5 flex flex-wrap gap-2 text-[12px] font-bold text-white/60">
            <span>{host}</span>
            <span aria-hidden="true">·</span>
            <span>{sys('home.portal.platforms')}</span>
            <span aria-hidden="true">·</span>
            <span>{tf('home.174')}</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_sections/work-with-us.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/adapter';
import { ContactCta } from '@/design/blocks';
import { Button, Eyebrow, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { waLink } from '@/lib/contact';
import { LiveDot } from '../_components/LiveDot';
import type { SectionProps } from './types';

const ROLES = [
  ['home.154', 'home.155'],
  ['home.156', 'home.157'],
  ['home.158', 'home.159'],
] as const;

/**
 * "Work with us" (home.140–161, 223). Hidden at ≤460 in the design (W10). The bodies are the
 * package's home.145/home.153 — the design markup hard-codes an older English body ("We
 * handle…"); the strings say "JobsAdmire handles…" (page note). The three role rows are static
 * role descriptions linking to the careers index; live openings are the careers task's (D15).
 */
export async function WorkWithUs({ locale, bundle }: SectionProps) {
  const sys = await getTranslations('sys');
  const tf = makeTf(bundle, locale);
  const s = bundle.settings;
  return (
    <Section tone="light" id="work-with-us" className="hidden border-t border-border-3 xs:block">
      <div data-testid="work-with-us" className="container-site">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{tf('home.140')}</Eyebrow>
            <h2 className="mb-0 mt-2 text-h2 leading-tight tracking-[-1.2px]">{tf('home.141')}</h2>
          </div>
          <p className="m-0 max-w-[480px] text-body-sm text-text-secondary">{tf('home.142')}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="relative flex flex-col justify-between overflow-hidden rounded-hero bg-navy p-6 text-white xs:p-8">
            <div>
              <p className="m-0 mb-3 inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1 text-[11.5px] font-extrabold">{tf('home.143')}</p>
              <h3 className="m-0 mb-3 text-card-title">{tf('home.144')}</h3>
              <p className="m-0 mb-4 text-body-sm text-white/75">{tf('home.145')}</p>
              <ul className="m-0 mb-6 flex list-none flex-col gap-2 p-0 text-body-sm font-bold">
                {(['home.146', 'home.147', 'home.148'] as const).map((id) => (
                  <li key={id} className="flex items-start gap-2">
                    <LiveDot className="mt-1.5" />
                    {tf(id)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" href="/partner-with-us">
                {tf('home.149')}
              </Button>
              <ContactCta placement="page_cta" href={waLink(s.whatsappNumber, sys('home.whatsapp.partner'))} external variant="inverse">
                <LiveDot />
                {tf('home.223')}
              </ContactCta>
            </div>
            <p className="m-0 mt-4 text-[11.5px] text-white/55">{tf('home.150')}</p>
          </article>
          <article className="flex flex-col justify-between rounded-hero border border-border-2 bg-white p-6 shadow-card xs:p-8">
            <div>
              <p className="m-0 mb-3 inline-flex items-center gap-2 rounded-pill bg-success-surface px-3 py-1 text-[11.5px] font-extrabold text-success-text">
                <LiveDot />
                {tf('home.151')}
              </p>
              <h3 className="m-0 mb-3 text-card-title">{tf('home.152')}</h3>
              <p className="m-0 mb-4 text-body-sm text-text-secondary">{tf('home.153')}</p>
              <div className="mb-6 divide-y divide-border-1">
                {ROLES.map(([roleId, metaId]) => (
                  <Link key={roleId} href="/careers" className="flex items-center justify-between gap-3 py-3 no-underline text-ink">
                    <span className="font-extrabold">{tf(roleId)}</span>
                    <span className="text-body-sm text-text-tertiary">{tf(metaId)}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" href="/careers">
                {tf('home.160')}
              </Button>
              <Button variant="secondary" href="/verify">
                {tf('home.161')}
              </Button>
            </div>
          </article>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_sections/guides.tsx`:

```tsx
import { makeTf } from '@/content/adapter';
import { blogNavVisible } from '@/content/collections';
import { PostCard } from '@/design/blocks';
import { Button, buttonClassName, Eyebrow, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { guidesPosts } from '../_lib/guides';
import type { SectionProps } from './types';

/**
 * "Guides and market updates" (home.175–179, 220). W4: `/blog` is noindex and out of nav until six
 * Turkish bodies exist, and every related-article block — this one included — hides below that
 * threshold; the design's hard-coded four-item list (home.262–273, 290–293) is replaced by the
 * `blog` collection through PostCard, so those data ids are not read here.
 */
export function GuidesSection({ locale, bundle }: SectionProps) {
  if (!blogNavVisible(bundle)) return null;
  const posts = guidesPosts(bundle, locale);
  if (posts.length === 0) return null;
  const tf = makeTf(bundle, locale);
  const [featured, ...rest] = posts;
  return (
    <Section tone="light" id="guides" className="border-t border-border-3">
      <div data-testid="guides" className="container-site">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{tf('home.220')}</Eyebrow>
            <h2 className="mb-0 mt-2 text-h2 leading-tight tracking-[-1.2px]">{tf('home.175')}</h2>
          </div>
          <Button variant="primary" href="/blog" className="hidden xs:inline-flex">
            {tf('home.176')}
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <PostCard bundle={bundle} locale={locale} post={featured} variant="featured" headingLevel={3} />
          <div className="hidden divide-y divide-border-1 rounded-hero border border-border-2 bg-white px-6 py-2 xs:block">
            {rest.slice(0, 4).map((post) => (
              <PostCard key={post.key} bundle={bundle} locale={locale} post={post} variant="row" headingLevel={3} />
            ))}
            <Link href="/blog" className="block py-4 font-extrabold text-blue-safe no-underline">
              {tf('home.179')}
            </Link>
          </div>
        </div>
        <Link href="/blog" className={buttonClassName('primary', 'md', 'mt-6 xs:hidden')}>
          {tf('home.176')}
        </Link>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_sections/faq.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/adapter';
import { ContactCta, FaqBlock, type FaqItem } from '@/design/blocks';
import { waLink } from '@/lib/contact';
import { LiveDot } from '../_components/LiveDot';
import type { SectionProps } from './types';

const PAIRS = [
  ['home.294', 'home.295'],
  ['home.296', 'home.297'],
  ['home.298', 'home.299'],
  ['home.300', 'home.301'],
  ['home.302', 'home.303'],
  ['home.304', 'home.305'],
] as const;

/** "Common questions" (home.180–183, 294–305): FaqBlock (accordion + FAQPage JSON-LD, AEO only).
 *  `singleOpen={false}` keeps the design's independent toggles. The answers include the
 *  legal-flagged home.295/297/299/301/303 rendered as authored (W1/W58). */
export async function FaqSection({ locale, bundle }: SectionProps) {
  const sys = await getTranslations('sys');
  const tf = makeTf(bundle, locale);
  const items: FaqItem[] = PAIRS.map(([q, a]) => ({ id: q, q: tf(q), a: tf(a) }));
  return (
    <div data-testid="faq">
      <FaqBlock
        bundle={bundle}
        locale={locale}
        items={items}
        id="faq"
        eyebrowId="home.180"
        headingId="home.181"
        singleOpen={false}
        headingLevel={3}
        footer={
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border-1 pt-5">
            <p className="m-0 text-body-sm text-text-secondary">{tf('home.182')}</p>
            <ContactCta placement="page_cta" href={waLink(bundle.settings.whatsappNumber, sys('home.whatsapp.hire'))} external variant="secondary">
              <LiveDot />
              {tf('home.183')}
            </ContactCta>
          </div>
        }
      />
    </div>
  );
}
```

`src/app/[locale]/(site)/page.tsx` — final shape of the default export (imports added for every section, `ClosingCtaBand`, `StickyCtaBar`, `makeTf`, `getTranslations`, `telLink`, `waLink`, `Section`):

```tsx
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const tf = makeTf(bundle, locale);
  const s = bundle.settings;
  const waHire = waLink(s.whatsappNumber, sys('home.whatsapp.hire'));
  const section = { locale, bundle };
  return (
    <>
      <Hero {...section} />
      <LiveCaseBar {...section} />
      <ChoiceCards {...section} />
      <PoolSection {...section} />
      <CalculatorStrip {...section} />
      <ProcessSection {...section} />
      <SeasonSection {...section} />
      <NetworkSection {...section} />
      <TeamSection {...section} />
      <PortalSection {...section} />
      <WorkWithUs {...section} />
      <GuidesSection {...section} />
      <FaqSection {...section} />
      {/* Contact strip (home.184–187, 221, 202): every CTA is a ContactCta, so the WhatsApp and
          phone actions fire whatsapp_click / call_click with placement page_cta (W12). */}
      <Section tone="band" id="contact-strip">
        <div data-testid="cta-band" className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            titleId="home.184"
            bodyId="home.185"
            tone="navy"
            primary={{ label: tf('home.022'), href: '#proposal' }}
            secondary={{ label: tf('home.221'), href: waHire, external: true }}
            extra={[
              { label: tf('home.202'), href: s.telegramUrl, external: true },
              { label: tf('home.187'), href: telLink(s.phone) },
            ]}
          />
        </div>
      </Section>
      {/* W18: the bar hides while the hero form is near; its CTAs are in-page/internal links only,
          so no contact anchor on this page bypasses ContactLink. */}
      <StickyCtaBar
        message={tf('home.024')}
        ctas={[
          { label: tf('home.022'), href: '#proposal' },
          { label: tf('home.076'), href: '/hiring-cost-calculator', variant: 'secondary' },
        ]}
        hideNearId="proposal"
      />
    </>
  );
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/\[locale\]/(site)"` → green (guides 3 + earlier: 27+2+1+3, 9, 3, 4, 4, 7 = 63 tests across 8 files). `npm run verify` green. Build + start; walk both locales at 390/900/1440: the map shows from 461 px and the dark country card below it; the portal and work-with-us sections disappear at ≤460 (still in the DOM); the team and guides sections render nothing; the FAQ toggles independently; the band's WhatsApp/phone buttons push `whatsapp_click`/`call_click` with `placement: 'page_cta'`; the sticky bar appears past 700 px and hides while the hero form is near (scroll back up).

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/\(site\)/_lib/guides.ts src/app/[locale]/\(site\)/_lib/guides.test.ts src/app/[locale]/\(site\)/_sections/network.tsx src/app/[locale]/\(site\)/_sections/team.tsx src/app/[locale]/\(site\)/_sections/portal.tsx src/app/[locale]/\(site\)/_sections/work-with-us.tsx src/app/[locale]/\(site\)/_sections/guides.tsx src/app/[locale]/\(site\)/_sections/faq.tsx src/app/[locale]/\(site\)/page.tsx
git commit -m "feat(home): network map + flags, portal, work-with-us, blog-gated guides, FAQ block, closing band, sticky CTA; team hidden by data (T1 c5)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 6 — Gate: the page e2e spec, the preview gate run, docs and the ledger row

- [ ] **Step 1: Write the failing test**

`e2e/pages/home.spec.ts`:

```ts
import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';

// The door is off on every target this spec runs against (local `next start`, previews before
// the Operations flag flips): postForm answers `unauthorized` without a call and the shell
// renders the visitor fallback panel (D11) — deterministic. With the door ON, set E2E_DOOR_ON=1
// to skip the submission cases; T14's staging checklist covers that path.
const DOOR_ON = Boolean(process.env.E2E_DOOR_ON);
const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;
const ORIGIN = 'https://www.jobsadmire.com';

// The committed TR bundle is the data these assertions follow (readFileSync — the sanctioned
// bypass of the local-bundle import rule; specs run in Node).
const bundle = JSON.parse(readFileSync('src/content/local/bundle.tr.json', 'utf8')) as {
  collections: {
    blog?: { hasBody: { tr: boolean } }[];
    rateConfig: { legalMinGross: number; sgkRates: { other: number } }[];
  };
};
// W4: the guides block hides below BLOG_NAV_THRESHOLD (6) Turkish bodies.
const blogVisible = (bundle.collections.blog ?? []).filter((p) => p.hasBody.tr).length >= 6;
// W2/W58: general preset (1.0×), support off, default SGK tier — what the teaser shows for N workers.
const rc = bundle.collections.rateConfig[0];
const payrollTR = (n: number) =>
  `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(Math.round(rc.legalMinGross * (1 + rc.sgkRates.other) * n))} ₺`;

const ORDER = [
  'hero',
  'hero-form',
  'choice-cards',
  'pool-empty',
  'calc-teaser',
  'process',
  'season-planner',
  'network',
  'portal',
  'work-with-us',
  'faq',
  'cta-band',
];
const HIDDEN_PHASE_A = ['live-case-bar', 'hero-proof', 'team', ...(blogVisible ? [] : ['guides'])];

const testIds = (page: Page) =>
  page.locator('[data-testid]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid') ?? ''));
const dataLayer = (page: Page, event: string) =>
  page.evaluate(
    (ev) =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter((e) => e.event === ev),
    event,
  );

for (const [route, lang] of [
  ['/', 'tr'],
  ['/en', 'en'],
] as const) {
  test(`homepage ${route}: one tagged h1, the sections in the design's order, nothing leaked`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1[data-testid="page-h1"]')).toHaveCount(1);
    // Phase A: the hero photo is a named placeholder, so the h1 is the one LCP element (D26/W55).
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('h1[data-lcp-slot="h1"]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder="v4-hero"]')).toHaveCount(1);
    const placeholders = await page.locator('[data-placeholder]').evaluateAll((els) => els.map((e) => e.getAttribute('data-placeholder')));
    for (const v of placeholders) expect(v).toBeTruthy();
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);
    const ids = await testIds(page);
    const positions = ORDER.map((id) => ids.indexOf(id));
    positions.forEach((p, i) => expect(p, `${ORDER[i]} is rendered`).toBeGreaterThanOrEqual(0));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    for (const id of HIDDEN_PHASE_A) await expect(page.getByTestId(id)).toHaveCount(0);
    // CTA_BY_PATHNAME['/'] and the sticky bar's hideNearId both point here.
    await expect(page.locator('#proposal')).toHaveCount(1);
    await expect(page.getByTestId('hire-form')).toHaveAttribute('data-form-key', 'hire');
    // FAQPage JSON-LD from FaqBlock (AEO only), beside the site-wide Organization node.
    expect(await page.locator('script[type="application/ld+json"]').allTextContents()).toEqual(
      expect.arrayContaining([expect.stringContaining('"@type":"FAQPage"')]),
    );
  });
}

test.describe('hero form → the visitor fallback panel (door off, D11)', () => {
  test.skip(DOOR_ON, 'door is on — the staging checklist (T14) covers submissions');

  test('proposal mode posts to hire and shows the panel, never a fake success', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('hero-mode-proposal').click(); // also opens the collapsed card at ≤460
    const form = page.getByTestId('hire-form');
    await form.locator('input[name="company"]').fill('Akdeniz Tekstil A.Ş.');
    await form.locator('input[name="name"]').fill('Ayşe Yılmaz');
    await form.locator('input[name="email"]').fill('ayse@example.com');
    await form.locator('input[name="phone"]').fill('+90 501 000 00 00');
    await form.locator('select[name="sector"]').selectOption('factory');
    await form.locator('input[name="headcount"]').fill('15');
    await form.locator('select[name="startWhen"]').selectOption('month1');
    await form.locator('button[type="submit"]').click();
    const panel = form.getByTestId('form-fallback');
    await expect(panel).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/');
    const wa = panel.locator('a[href^="https://wa.me/"]').first();
    expect(decodeURIComponent((await wa.getAttribute('href')) ?? '')).toContain('Ayşe Yılmaz');
  });

  test('call-me-back mode posts to callback and shows the panel', async ({ page }) => {
    await page.goto('/en');
    await page.getByTestId('hero-mode-callback').click();
    const form = page.getByTestId('callback-form');
    await expect(form).toHaveAttribute('data-form-key', 'callback');
    await form.locator('input[name="name"]').fill('Mehmet Kaya');
    await form.locator('input[name="phone"]').fill('05320000000');
    await form.locator('select[name="preferredTime"]').selectOption('morning');
    await form.locator('select[name="topic"]').selectOption('tourism');
    await form.locator('button[type="submit"]').click();
    await expect(form.getByTestId('form-fallback')).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/en');
  });

  test('a missing required field is a field error, not a door call', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('hero-mode-proposal').click();
    const form = page.getByTestId('hire-form');
    await form.locator('input[name="company"]').fill('X');
    await form.locator('button[type="submit"]').click();
    await expect(form.locator('[role="alert"]').first()).toBeVisible();
    await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  });
});

test('the calculator teaser hydrates on approach and recomputes from the shared engine', async ({ page }) => {
  await page.goto('/');
  // Server-rendered default (general × 15) before any script runs for the section.
  await expect(page.getByTestId('calc-monthly')).toHaveText(payrollTR(15));
  await page.getByTestId('calc-teaser').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-testid="calc-teaser"][data-island="ready"]')).toBeVisible();
  await page.getByRole('radio', { name: '30 işçi' }).check();
  await expect(page.getByTestId('calc-monthly')).toHaveText(payrollTR(30));
  expect((await dataLayer(page, 'calculator_use')).at(-1)).toMatchObject({
    page: '/',
    locale: 'tr',
    role: 'generalPreset',
    headcount: 30,
  });
});

test('the season planner hydrates and answers a row selection', async ({ page }) => {
  await page.goto('/en');
  await page.getByTestId('season-planner').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-testid="season-planner"][data-island="ready"]')).toBeVisible();
  const before = await page.getByTestId('season-headline').innerText();
  await page.getByTestId('season-row-tourism').click();
  await expect(page.getByTestId('season-headline')).not.toHaveText(before);
  await expect(page.getByTestId('season-row-tourism')).toHaveAttribute('aria-pressed', 'true');
});

test('a page WhatsApp CTA pushes whatsapp_click with the page_cta placement', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('hero-mode-proposal').click();
  // Capture-phase preventDefault keeps the tab here; React's bubble handler still fires.
  await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault(), true));
  await page.getByTestId('hero-form').locator('a[href^="https://wa.me/"]').first().click();
  expect((await dataLayer(page, 'whatsapp_click')).at(-1)).toMatchObject({ page: '/', locale: 'tr', placement: 'page_cta' });
});

test('the language alternates point at the other homepage and the switch keeps the page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}/en`);
  expect(await page.locator('a[href="/en"]').count()).toBeGreaterThan(0); // the switcher (desktop row or hamburger)
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute('href', ORIGIN);
  await expect(page.getByTestId('page-h1')).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails**

The spec fails before the page exists (on a pre-Cycle-1 tree: `hero-form` not rendered, `calc-monthly` missing); on the Cycle 5 tree it must be **green** — run it now against a local build to prove that: `npm run build && npx next start -p 3100` then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/home.spec.ts` (both projects; the mobile project exercises the collapsed hero card and the ≤460 visibility classes) → 9 cases × 2 projects green. Any red here is a page defect, not a spec one.

- [ ] **Step 3: Implement — verify the gate lists, run the gate, write the docs**

`e2e/routes.ts` — open it and confirm `GATE_ROUTE_TABLE` already contains `{ path: '/', indexable: true }` and `{ path: '/en', indexable: true }` (T0e). No edit. `src/lib/seo/routes.ts` — confirm `'/'` is absent from `UNBUILT_PATHNAMES`. No edit. (`npx vitest run src/lib/seo/unbuilt.test.ts` stays green because the page file path is unchanged.)

Gate against the preview (the binding run, R50): push the branch, take the Vercel preview URL, then one job at a time (Mac Studio rule):

```bash
E2E_BASE_URL=https://<preview>.vercel.app npm run gate
node scripts/js-size.mjs
npm run pixel -- --page=home --locale=tr --base=https://<preview>.vercel.app
npm run pixel -- --page=home --locale=en --base=https://<preview>.vercel.app
```

Expected: Playwright green on both projects (routing, seo, a11y, width sweep incl. 901/900, thank-you, ops, smoke, `pages/home.spec.ts`); Lighthouse on `/` and `/en`: performance ≥ 0.95, a11y/best-practices/SEO = 1.0, `resource-summary:script:size` ≤ 204,800 B on both (target: shell 172,509 B + HeroLeadForm/FormShell/Field/FallbackPanel + Stat + Accordion + StickyCtaBar + ContactLink + the two lazy wrappers ≈ 186–192 KB; the engine and planner chunks are **not** in the initial audit), LCP ≤ 2,500 ms, CLS ≤ 0.1. If a route lands above 194,560 B (the lazy line), move `FaqBlock`'s `Accordion` or the `MetricStrip` count-up behind the same `useInView` pattern before the next page starts (W13 amended). Pixel: two iterations at most against `design/JobsAdmire Homepage v4.dc.html` at 390/900/1440 — fix only what is not a named delta (this task's list at the top + D20's), log the rest.

`docs/SEO.md` — insert before the `## Redirects policy (summary)` heading:

```markdown
## Pages (WP2 — one row per page task)

| Page (route)          | Title / description source                                                                                                     | Canonical                    | JSON-LD on the page                                                                                              | LCP slot                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage (`/`, `/en`) | `sys.seo.home.{title,description}` — the package has no homepage SEO strings (`pages.home.titleId === ''`, W23/W38); OG image from the `/og/{locale}/home.png` route | `absoluteUrl(locale, '/')`   | `Organization`/`EmploymentAgency` + `WebSite` (site-wide, layout); `FAQPage` from `FaqBlock` (home.294–305, AEO only); no breadcrumbs | `h1` (`data-lcp-slot="h1"`) while the hero photo slot `v4-hero` is a placeholder (§10 row 4); `HERO_PHOTO` in `_sections/hero.tsx` moves the slot onto the image when it ships (D26) |
```

`docs/ANALYTICS.md` — insert before the `## Conversion` heading:

```markdown
### Per-page wiring (WP2b)

One line per page task, so the allowlist table above and the pages never drift. A page fires only events named here; contact anchors always go through `ContactLink`/`ContactCta`.

- **Homepage (`/`, `/en`, T1):** `whatsapp_click` / `call_click` with `placement: 'page_cta'` from the hero card's "Chat on WhatsApp instead", the calculator teaser's "Send this estimate", the FAQ "Ask on WhatsApp", the work-with-us "Talk to us" and the closing band's WhatsApp / "Call the office"; `calculator_use` from the teaser on every role or headcount chip change with `role` = the preset row key (`generalPreset` | `skilledPreset` | `specialistPreset`) and `headcount` = the chip value (1 | 5 | 15 | 30) — never a typed value; `generate_lead`/`conversion` come from the forms kernel and the thank-you page (`hire`, `callback`), not from the page. The header and sticky-bar CTAs are in-page/internal links and fire nothing.
```

`docs/CONTENT-MODEL.md` — add to the `sys.*` key list (after the Thank-you bullet, before the W54 five-namespace paragraph):

```markdown
- **Homepage (`sys.home.*`, WP2b T1):** `form.callbackSubmit`, `form.preferredTime.{morning,afternoon,evening}` (the callback form's option labels — stable keys on the wire, W3), `whatsapp.{hire,partner,estimate}` (the page's WhatsApp prefills; `estimate` is an ICU template over the teaser's figures), `pool.empty.{title,body,cta}` (the W6 empty state that stands in for the candidate cards), `calc.{eyebrowUndated,grossFloor,supportSeparate,headcount,monthlyPayroll}` (`headcount` is an ICU plural; `eyebrowUndated` replaces home.068 after `rateConfig.reviewDueAt`, D17), `season.{agricultureSub,range,also,signBy,noPeak,gridLabel,selectHint}` (composed planner copy; `noPeak` takes `{permitDays}` from the metric), `network.{mapTitle,turkiye}`, `portal.platforms`; plus `seo.home.{title,description}` (no package SEO string for the homepage).
```

`docs/PRD.md` — §2 row 1 becomes:

```markdown
| 1   | Homepage                      | `/`                                        | `/en`                        | Hero lead form (`INQUIRY` via `hire`, with the door's required `name` + `email` and optional `city`, W3/W16) and its "call me back" mode (`CALLBACK` via `callback`) |
```

and the §11 sentence containing "spike-era placeholder content" is amended so the homepage is no longer listed as a spike: replace "(only the homepage and Hire Workers exist, both still spike-era placeholder content)" with "(the homepage is the first designed page — WP2b T1; Hire Workers is still the spike placeholder until T2)" — edit the phrase in place in whatever sentence T0a/T0d left (W65), never re-add the WP1 wording.

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append to the ledger table:

```markdown
| T1 Homepage | `/` · `/en` | script gz: `/` <n> B · `/en` <n> B (ceiling 204,800; lazy line 194,560) | LH mobile: perf <x.xx> · LCP <n> ms · CLS <n> (both routes) | pixel: tr 390/900/1440 = <a>/<b>/<c> % · en <a>/<b>/<c> % (iterations: <1|2>); named deltas: name+email fields, callback form, empty pool, hidden ticker/team/proof, support-off figure, no iOS badge, fraud CTA → /verify#report | <date> |
```

Fill the `<…>` from `node scripts/js-size.mjs`'s table, `lighthouse-report/`, and `.pixel/report.json`.

- [ ] **Step 4: Run tests + `npm run verify`**

`npm run verify` green (the docs are Prettier-checked — run `npm run format:write` on the three tables first). `npx playwright test e2e/pages/home.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts` against the preview green. `npm run gate` output archived under `lighthouse-report/` (git-ignored) and the numbers copied into the ledger row.

- [ ] **Step 5: Commit**

```bash
git add e2e/pages/home.spec.ts docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "test(home): page e2e (order, both form fallbacks, lazy islands, analytics, alternates) + docs and ledger (T1 c6)

SEO page row, ANALYTICS per-page wiring, CONTENT-MODEL sys.home.*, PRD row 1; gate + pixel
numbers in the WP2b ledger.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/SEO.md` (new `## Pages` table, Homepage row: title source, canonical, JSON-LD, LCP slot) · `docs/ANALYTICS.md` (new `### Per-page wiring`, Homepage line: `whatsapp_click`/`call_click` `page_cta`, `calculator_use` with preset keys) · `docs/CONTENT-MODEL.md` (`sys.home.*` + `sys.seo.home.*` bullet in § The `sys.*` range) · `docs/PRD.md` (§2 row 1: hero form = `hire` + `callback`, W3/W16 fields; §11 "spike-era" sentence) · `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (T1 ledger row: route, gzipped script size from `npm run js-size`, Lighthouse triple, pixel scores for tr/en at 390/900/1440, named deltas).

**Sys keys added (27):** `sys.seo.home.title`, `sys.seo.home.description`, `sys.home.form.callbackSubmit`, `sys.home.form.preferredTime.morning`, `sys.home.form.preferredTime.afternoon`, `sys.home.form.preferredTime.evening`, `sys.home.whatsapp.hire`, `sys.home.whatsapp.partner`, `sys.home.whatsapp.estimate`, `sys.home.pool.empty.title`, `sys.home.pool.empty.body`, `sys.home.pool.empty.cta`, `sys.home.calc.eyebrowUndated`, `sys.home.calc.grossFloor`, `sys.home.calc.supportSeparate`, `sys.home.calc.headcount`, `sys.home.calc.monthlyPayroll`, `sys.home.season.agricultureSub`, `sys.home.season.range`, `sys.home.season.also`, `sys.home.season.signBy`, `sys.home.season.noPeak`, `sys.home.season.gridLabel`, `sys.home.season.selectHint`, `sys.home.network.mapTitle`, `sys.home.network.turkiye`, `sys.home.portal.platforms` — in both `src/messages/tr.json` and `src/messages/en.json`, pinned by `home.copy.test.ts`.

**Package ids used:** 202 direct ids from `home.*` (every one verified present in `src/content/local/catalogue.json`; first `home.017`, last `home.305`) — hero 017–049 + 053/054, ticker 055/201, choice 056–061, pool 062, calculator 068–090, process 091–095/104–118/224–227, season 096–103/217/243–253, network 119–126/202, team 127–139/200, portal 162–174/207/209/213/215/216, work-with-us 140–161/223, guides 175/176/179/220, FAQ 180–183/294–305, band/sticky 184/185/187/221/022/076 — plus 7 read through collection label ids (`home.050`/`051`/`052`/`206` via `metrics`, `home.240`–`242` via `calculatorRoles`). Not read on purpose: the design's `data` rows that the collections replace (`home.229`–`239` pool cards, `home.262`–`293` blog list/ticker cases), `home.186` (orphan), `home.177`/`178` (PostCard owns the featured card), the chrome ids (`home.001`–`016`, `188`–`199`, `218`/`219`/`222`/`228`).

**Foundation gaps:** none blocking. Two notes for T15/the foundation: (a) there is no shared viewport-lazy wrapper in `src/design/islands` — this task's `useInView` + `lazy`/`Suspense` + DOM-identical server fallback is page-local and is the candidate to promote once the calculator page and the Work Permit wizard repeat it; (b) `RadioChips` requires `onChange`, so it cannot render the server-side static fallback of the teaser chips — the page-local `TeaserChips` (native radios, optional `onChange`, `readOnly` when absent) fills that; if `RadioChips` gains an optional-handler mode, swap it in.
