### Task 1: Homepage (`/` and `/en`) — the first designed page on the WP2a foundation (pixel-harness page, D27)

**Worktree:** every path below is relative to `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` (branch `wp2/foundation`); every command block starts with `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 &&`. Never run in the main checkout, never switch the branch, never push `main`. One heavy job at a time on the Mac Studio (one build, one Playwright run, one Lighthouse run — never two at once). **Execution order (W99):** this task runs first in WP2b, before T13; every WP2a task (1–9, with the `task-{3,5,6,7}-additions.md` items) has landed.

Replaces the WP1 spike homepage (`src/app/[locale]/(site)/page.tsx` as WP2a Tasks 3/7 left it: a tagged `<h1 data-testid="page-h1" data-lcp-slot="h1">` and a `<Link href="/hire-workers">hire</Link>`) with the designed page `design-package/design/JobsAdmire Homepage v4.dc.html`, section for section, on the WP1 primitives, the WP2a data layer (`src/content/collections.ts`), the forms kernel (`src/forms/**`, post fix round), the chrome/SEO/blocks/islands/gate tooling (WP2a Tasks 3–7) and the calculator engine (WP2a Task 9). Every string is a package id read through `makeTf(bundle, locale)` (D17 placeholders filled) or a `sys.home.*` / `sys.seo.home.*` key read through next-intl (W9/W23/W80). Every number comes from the `metrics` / `rateConfig` / `calculatorRoles` / `sourceCountries` collections (W1/W2/D17).

Rulings that shape this page: **W1** (metrics), **W2/W58** (one engine, support OFF in the teaser), **W3/W16** (hero form → `hire` with required `name` + `email`, optional `city`; call-me-back → `callback`), **W4** (guides block hidden below the blog threshold), **W6/D2/D23** (ticker, pool cards, team, logos hidden or in an empty state — rendered by data, never deleted), **W7** (Karachi = sourcing office — the importer's override of `home.134`, nothing here), **W8** (no iOS badge), **W9/W23** (missing copy in `sys.home.*`), **W10** (the design's ≤460 px hide/show via CSS classes), **W12** (only allow-listed events; enum/number params), **W13 amended + W85** (heavy islands through `LazyIsland`; 204,800 B ceiling), **W14** (pre-rendered `SourceMap`, sprite `Flag`), **W17** (`CTA_BY_PATHNAME['/']` names `#proposal` — this page renders that id), **W18/W81** (`StickyCtaBar`, `data-testid="sticky-cta"`), **W19** (route group `(site)`), **W20/W21** (`/` and `/en` are already gate routes and were never in `UNBUILT_PATHNAMES`), **W55/W61** (named placeholders, `ImageSlot` LCP attributes), **W71** (blocks resolve ids via `makeTf`), **W74/W76** (kernel retry rule; bare fallback href), **W77/W78** (wire values are keys; the one `START_WHEN_KEYS` vocabulary), **W79** (consent checkbox on every door form, link `/privacy` by default), **W80** (`sys.home` is this page's object; the Home crumb is `sys.nav.home`), **W86** (founder = the `founder` collection), **W90** (`sys.seo.*` is server-only), **W91/W92** (previews reachable with the bypass header; previews are door-less, only `staging` carries the door), **W95** (no visitor-chosen data in a DOM href — the estimate link composes at click time), **W98** (T1 creates the shared doc shapes and the ledger row format), **W109** (no breadcrumbs on the root page), **W113** (section test ids on inner `div`s), **W115** (package field labels passed as `label`).

**Design deltas this task makes on purpose (record them in the pixel ledger, D20/D27):** (1) the hero form gains a required contact `name` and `email` (W3), keeps `city` (W16) and gains the site-wide consent checkbox with the `/privacy` link (W79 — the design card has no consent line at all); (2) the two selects post stable keys — sector keys from `SECTOR_KEYS`, timeline keys from the shared `START_WHEN_KEYS` (`asap | month1 | months1to3 | planning`, W78) — while the visible option labels stay the package's (`home.036–040`, `home.044–047`, W115); (3) the "call me back" mode is a separate `callback` form (name, phone, the sector select posted as `topic`, city) rather than the design's same-fields toggle (W3) — no `preferredTime` control (the design has none, and Contact's callback owns that field's day/slot vocabulary); (4) the live case ticker, the hero "All cases are public →" proof cell, the candidate pool cards and the whole "Our team" section render nothing in Phase A because `stories`, `pool` and `representatives` are empty and fixture-only and the `founder` row is unpublished (W6, D2, D23, W86, §10 row 3); the candidate pool section shows a designed empty state (W6); (5) the calculator teaser's General figure is the model's ₺40,214 with the minimum-wage support **off** (W58) and the support row says "optional — on the full calculator"; (6) the teaser's "Send this estimate on WhatsApp" anchor carries only `https://wa.me/<number>`; the prefilled estimate is composed at click time (W95); (7) the FAQ is `FaqBlock` (`singleOpen={false}` keeps the design's independent toggles); (8) the hero photograph slot `v4-hero` is a named placeholder until §10 row 4 ships, so the LCP element is the h1 (D26); (9) no iOS badge (W8) and the portal panel's platform line says "Android" only; (10) "Report fraud" links to the Verify page's fraud form (`/verify#report`, `CTA_BY_PATHNAME['/verify']`) instead of a WhatsApp prefill; (11) a desktop `StickyCtaBar` (not in the design) with two internal CTAs appears after 700 px of scroll — it passes no `hideNearId`, because `isBarVisible` hides the bar whenever the target is above 90 % of the viewport, and this page's target (`#proposal`) sits in the hero, so the bar would never show; the 700 px threshold alone keeps it off the form.

**Files:**

Create
- `src/app/[locale]/(site)/actions.ts` — `'use server'`: `submitHire`, `submitCallback`
- `src/app/[locale]/(site)/_lib/forms.ts` — pure: option keys + label ids, Zod schemas, `toFields` mappers (catalog names)
- `src/app/[locale]/(site)/_lib/forms.test.ts`
- `src/app/[locale]/(site)/_lib/phase-a.ts` — pure: `rawRows`/`hasRows`/`logoRows` (Cycle 1), `publishedFounder` (Cycle 5) — the "rendered by data" switches
- `src/app/[locale]/(site)/_lib/phase-a.test.ts`
- `src/app/[locale]/(site)/_lib/teaser.ts` — pure: the teaser's view model over the engine (server fallback + island share it)
- `src/app/[locale]/(site)/_lib/teaser.test.ts`
- `src/app/[locale]/(site)/_lib/season.ts` — pure: `SEASON_ROWS` (numbers = data), Intl month names, range/headline composition
- `src/app/[locale]/(site)/_lib/season.test.ts`
- `src/app/[locale]/(site)/_lib/guides.ts` — pure: `guidesPosts(bundle, locale)`
- `src/app/[locale]/(site)/_lib/guides.test.ts`
- `src/app/[locale]/(site)/_components/LiveDot.tsx` — the design's green dot (no directive)
- `src/app/[locale]/(site)/_components/HeroLeadForm.tsx` — `'use client'` island (eager; above the fold)
- `src/app/[locale]/(site)/_components/HeroLeadForm.test.tsx`
- `src/app/[locale]/(site)/_components/WhatsAppComposeLink.tsx` — `'use client'`: bare `wa.me` href, prefill composed on click (W95)
- `src/app/[locale]/(site)/_components/TeaserChips.tsx` — presentational (no directive; server fallback + island)
- `src/app/[locale]/(site)/_components/TeaserCard.tsx` — presentational
- `src/app/[locale]/(site)/_components/TeaserLayout.tsx` — presentational
- `src/app/[locale]/(site)/_components/CalculatorTeaser.tsx` — `'use client'` island (lazy)
- `src/app/[locale]/(site)/_components/CalculatorTeaser.test.tsx`
- `src/app/[locale]/(site)/_components/CalculatorTeaserIsland.tsx` — `'use client'`: binds `LazyIsland` (W85) to the teaser
- `src/app/[locale]/(site)/_components/SeasonGrid.tsx` — presentational
- `src/app/[locale]/(site)/_components/SeasonPlanner.tsx` — `'use client'` island (lazy)
- `src/app/[locale]/(site)/_components/SeasonPlannerIsland.tsx` — `'use client'`: binds `LazyIsland` to the planner
- `src/app/[locale]/(site)/_sections/types.ts` — `SectionProps`
- `src/app/[locale]/(site)/_sections/hero.tsx` — `Hero` (badge, h1, sub, CTAs, photo slot, lead form, stats, proof cell, logo slot)
- `src/app/[locale]/(site)/_sections/ticker.tsx` — `LiveCaseBar` (hidden by data)
- `src/app/[locale]/(site)/_sections/choice.tsx` — `ChoiceCards` (≤460 only, W10)
- `src/app/[locale]/(site)/_sections/pool.tsx` — `PoolSection` (empty state, W6)
- `src/app/[locale]/(site)/_sections/calculator.tsx` — `CalculatorStrip`
- `src/app/[locale]/(site)/_sections/process.tsx` — `ProcessSection`
- `src/app/[locale]/(site)/_sections/season.tsx` — `SeasonSection`
- `src/app/[locale]/(site)/_sections/network.tsx` — `NetworkSection`
- `src/app/[locale]/(site)/_sections/team.tsx` — `TeamSection` (hidden by data, W86)
- `src/app/[locale]/(site)/_sections/portal.tsx` — `PortalSection`
- `src/app/[locale]/(site)/_sections/work-with-us.tsx` — `WorkWithUs`
- `src/app/[locale]/(site)/_sections/guides.tsx` — `GuidesSection` (hidden below the blog threshold, W4)
- `src/app/[locale]/(site)/_sections/faq.tsx` — `FaqSection`
- `src/app/[locale]/(site)/__tests__/home.copy.test.ts` — the `sys.home.*` key set, the W80 shape guard, the D17 rate-copy guards
- `e2e/pages/home.spec.ts`

Modify
- `src/app/[locale]/(site)/page.tsx` — whole file (the spike body is replaced; the `generateMetadata` pattern kept)
- `src/messages/tr.json`, `src/messages/en.json` — add the `sys.home` object and `sys.seo.home` (both files, identical key sets)
- `docs/SEO.md` — creates the one `## Pages` table (W98) before the `## Redirects policy (summary)` heading
- `docs/ANALYTICS.md` — creates `### Page instrumentation (WP2b)` before the `## Conversion` heading
- `docs/CONTENT-MODEL.md` — creates the per-page bullet list at the end of `### Adding copy (W9, W23, W54)`; fixes the Chrome bullet's `home` → `nav.home` if WP2a Task 3 left it
- `docs/PRD.md` — §2 row 1 (the `| 1   | Homepage` row) and the §11 "spike-era placeholder content" phrase
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — creates the `## Ledger` table (W98) and appends the T1 row

Verify only (no edit expected)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE` already carries `{ path: '/', indexable: true }` and `{ path: '/en', indexable: true }` (WP2a Task 7); assert, never duplicate (W21)
- `src/lib/seo/routes.ts` — `'/'` is not in `UNBUILT_PATHNAMES` (WP2a Task 4's set of 19); `src/lib/seo/unbuilt.test.ts` stays green because the page file keeps its path

Test
- Vitest: the nine `*.test.ts(x)` files above; `npm run verify`
- Playwright: `e2e/pages/home.spec.ts` (new), plus `e2e/routing.spec.ts`, `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` (they already sweep `/` and `/en`)
- Gate: `npm run gate` against the door-less preview (W91/W92); `npm run js-size`; `npm run pixel -- --page=home --locale=tr` and `--locale=en` (two-iteration cap, D27)

**Interfaces:**

Consumes (exact names)
- WP1: `getBundle`, `makeTf`, `metricValues` (`@/content/adapter`, which re-exports `pure.ts`); `Button`, `buttonClassName`, `Section`, `Eyebrow` (`@/design/primitives`); `Link` (`@/i18n/navigation`); `routing`, `type Locale` (`@/i18n/routing`); `waLink`, `telLink` (`@/lib/contact`); `formatTRY` (`@/lib/format/money`, tests only); `track` (`@/analytics/track`, `calculator_use` = `page, locale, role, headcount`); `renderWithIntl` (`@/test/render`); `BundleSchema`, `type Bundle` (`contract/website-bundle.v1`); settings fields `turnstileSiteKey`, `whatsappNumber`, `phone`, `phoneDisplay`, `email`, `telegramUrl`, `storeLinks.{android,ios}`, `portal.host`; tokens `container-site`, `text-h1/h2/h2-process/body/body-lg/body-sm/eyebrow/card-title/stat`, `rounded-pill/hero/xl/lg/base/xs/input`, `shadow-hero-form/card`, `bg-navy/blue/blue-safe/sky/tint/pale-1/pale-2/success/success-surface`, `border-border-1/2/3/4`, `border-success-border`, `border-danger-border`, `bg-danger-surface`, `bg-tint-border`, `text-text-secondary/tertiary`, `text-success-text`, `text-muted`, `text-danger`, `font-display`, breakpoints `xs` 461 / `sm` 561 / `md` 701 / `lg` 901 / `xl` 1101 (`src/app/globals.css`)
- WP2a Task 1 (landed): `getCollection`, `getRateConfig`, `blogNavVisible`, `SECTOR_KEYS`, `type SectorKey`, `type BlogPost`, `type CalculatorRole`, `type RateConfig`, `type SourceCountry`, `type CollectionRow` (`@/content/collections`); `bundle.pages.home` = `{ titleId: '', descriptionId: '', … }` so `buildMetadata` uses the `sys.seo.home.*` fallbacks (W38); metric label ids `home.050` (placed), `home.051` (countries), `home.052` + unit `home.206` (permitDays)
- WP2a Task 2 (landed, post fix round — the real code wins): `createFormAction` (`@/forms/action`; `FormSpec.consent` defaults to `'checkbox'`, `toFields(parsed, data, ctx: { visitor, locale })`); `type FormActionState` (`@/forms/types`); `type WireFields` (`@/forms/wire`); `FormShell` (`@/forms/client/FormShell` — `consent` defaults to `'checkbox'`, `consentLinkHref` defaults to and only accepts `'/privacy'` (W79: pages omit it), `idScope?`, `id?`, `headingLevel?`, `testId?`, `submitLabel?`, `contact?`); `Field`, `type FieldOption` (`@/forms/client/Field` — `label` wins over `sys.form.labels.<name>`; `hint=""` suppresses the hint; `className` lands on the control, not the wrapper; the select branch ignores `placeholder`, W111); the fallback panel's `data-testid="form-fallback"` + `data-kind`, its bare `https://wa.me/<number>` href and click-time `window.open(…, '_blank', 'noopener')` (W76); door-less environments answer `unauthorized` without a call (W74/W92); `sys.form.labels.email`, `sys.form.placeholders.select`, `sys.form.consent.label`
- WP2a Task 3 (+ additions): `ContactLink` (`@/analytics/ContactLink`); `useContactClick` (`@/analytics/useContactClick`, `(placement) => (kind) => void`); `PARAM_ENUMS.placement` includes `'page_cta'`; `CTA_BY_PATHNAME['/']` → `{ pathname: '/', hash: '#proposal' }` (this page renders `id="proposal"`); the `(site)` route group; W80: `sys.nav.home` exists and `sys.home` is absent as a leaf; W86: `getCollection(bundle, 'founder')` rows `{ name: string; titleId: string; photoSrc: string | null; published: boolean }` (one row, `published: false`); W90: client islands receive every `sys.*` namespace except `sys.legal.*` and `sys.seo.*`
- WP2a Task 4: `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` (`@/lib/seo/metadata`; `pageOgImageUrl` applied inside); `UNBUILT_PATHNAMES` (`@/lib/seo/routes`, verify only); the existing `sys.seo` object (`ogTagline`)
- WP2a Task 5 (+ additions): `@/design/blocks` — `MetricStrip`, `EmptyState`, `ImageSlot`, `ProcessSteps` (`variant="plain"`), `FaqBlock` (`footer`), `ClosingCtaBand`, `ContactCta`, `PostCard`, `StoreBadges`, `LogoMarquee`, `type Logo`, `type FaqItem`, `type ProcessStep`; W82: `Cta.href` / `EmptyStateCta.href` / `StickyCta.href` accept `string | Exclude<Href, string>`; `StickyCtaBar` (`@/design/chrome/StickyCtaBar`; W81: wrapper `data-testid="sticky-cta"`, contact hrefs through `ContactLink`; `hidden lg:block`; `showAfterPx` default 700); `Section` tones `light | dark | pale | band`; `Button` variant `'inverse'`; W78: `START_WHEN_KEYS`, `type StartWhenKey` (`@/forms/options`) — the `sys.form.options.startWhen.*` labels exist but this page shows the package's own option labels (W115); `testBundle` (`@/test/bundle`)
- WP2a Task 6 (+ additions): `SourceMap`, `sourceMapLabels` (`@/design/assets/source-map`; `SourceMap({ title, labels, turkiyeLabel, className? })`); `Flag` (`@/design/Flag`); `isFlagCode` (`@/design/assets/flag-codes`); W85: `LazyIsland` (`@/design/islands/LazyIsland`, `'use client'`, `{ load: () => Promise<{ default: ComponentType<P> }>; props: P; fallback: ReactNode; rootMargin?: string }` — renders `fallback` until in view, then `React.lazy`-loads with `fallback` as the Suspense fallback)
- WP2a Task 7 (+ additions): `GATE_ROUTE_TABLE` (`e2e/routes.ts`), `npm run gate` / `npm run js-size` / `npm run pixel`, the page markup contract (`page-h1`, exactly one `data-lcp-slot`, named `data-placeholder`); W91: Playwright, `lhci` (via `lighthouserc.preview.json` on `*.vercel.app`) and `pixel-compare.ts` send `x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET`; the pixel ledger format `pixel <page> <locale>: 390 → NN.NN %, 900 → NN.NN %, 1440 → NN.NN %; run N of 2; deltas: (a) …; (b) …; (c) …; (d) accepted: …`
- WP2a Task 8 — Operations catalog v1.0 + v1.1 (`apps/backend/src/modules/website/website-form-catalog.ts` + `city`): `hire` = `name*, company*, email*, phone*` (≥ 8 digits), `country, iAm, sector ≤120, roleNeeded, headcount ≤10, startWhen ≤120, message, city ≤120`; `callback` = `name*, phone*, email, preferredTime ≤120, topic ≤200 (free text), city ≤120`
- WP2a Task 9 (`@/lib/calculator`): `estimate`, `formatEstimate` (shares through `formatPercent(·, locale, 0)`), `presets`, `multiplierLabel`, `effectiveYear`, `isReviewDue`, `sgkRateLabel`, `type FormattedEstimate`; fixtures `RATE`, `ROLES`, `role(key)` (`@/lib/calculator/__tests__/fixtures`, tests only)

Produces (what later tasks may rely on)
- **The shared doc shapes (W98)** — later page tasks append to them and never create a second one: `docs/SEO.md` `## Pages (WP2b)` table with the columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`; `docs/ANALYTICS.md` `### Page instrumentation (WP2b)` (one bullet per page); `docs/CONTENT-MODEL.md` "Per-page `sys.*` copy (WP2b)" bullet list at the end of `### Adding copy`; the WP2b plan's `## Ledger` table and its row format (Cycle 6)
- `sys.home.*` as an object (W80) — homepage copy only; other pages read the Home crumb from `sys.nav.home`
- The hidden-by-data pattern: a server section reads `hasRows(bundle, key)` / `publishedFounder(bundle)` from `src/app/[locale]/(site)/_lib/phase-a.ts` and returns `null` (plain TS; importing it from another page folder is allowed)
- `WhatsAppComposeLink({ number, text, className?, testId?, children })` (`src/app/[locale]/(site)/_components/WhatsAppComposeLink.tsx`) — the W95 click-time composer (fires `whatsapp_click` with `placement: 'page_cta'`); optional for other pages (plain TS import), nothing depends on it

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
import { effectiveYear, sgkRateLabel } from '@/lib/calculator';
import { formatTRY } from '@/lib/format/money';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key the homepage reads (W9/W23). A key missing from either file throws at
 *  render in dev and renders the raw key in production — so the set is pinned here. */
const HOME_SYS_KEYS = [
  'seo.home.title',
  'seo.home.description',
  'home.form.callbackSubmit',
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
  return path
    .split('.')
    .reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], messages);
}
const sysOf = (messages: unknown) => (messages as { sys: unknown }).sys;

describe('sys.home.* / sys.seo.home.*', () => {
  it.each(HOME_SYS_KEYS)('%s exists in both message files as a non-empty string', (key) => {
    for (const messages of [tr, en]) {
      const v = get(sysOf(messages), key);
      expect(typeof v).toBe('string');
      expect((v as string).length).toBeGreaterThan(0);
    }
  });

  it('W80: sys.home is the homepage object and the Home crumb lives at sys.nav.home', () => {
    for (const messages of [tr, en]) {
      const home = get(sysOf(messages), 'home');
      expect(typeof home).toBe('object');
      expect(home).not.toBeNull();
      expect(typeof get(sysOf(messages), 'nav.home')).toBe('string');
    }
  });

  it('the plural and argument keys carry ICU syntax in both locales', () => {
    for (const messages of [tr, en]) {
      const sys = sysOf(messages);
      expect(get(sys, 'home.calc.headcount')).toMatch(/\{n, plural,/);
      expect(get(sys, 'home.calc.grossFloor')).toContain('{multiplier}');
      expect(get(sys, 'home.season.signBy')).toContain('{start}');
      expect(get(sys, 'home.season.signBy')).toContain('{signBy}');
      expect(get(sys, 'home.season.noPeak')).toContain('{permitDays}');
      for (const arg of ['{role}', '{headcount}', '{monthly}', '{oneOff}'])
        expect(get(sys, 'home.whatsapp.estimate')).toContain(arg);
    }
  });

  it('never hard-types a headline number into the SEO description (D17)', () => {
    for (const messages of [tr, en]) {
      expect(get(sysOf(messages), 'seo.home.description')).not.toMatch(/\d/);
    }
  });
});

// D17: "2026 rates" (home.068/079), the SGK rate (home.081) and the one-off fees (home.086) are
// authored copy the importer leaves verbatim; the page hides the dated badge after reviewDueAt,
// but the figures INSIDE the copy must equal the rate config or the card disagrees with itself.
// readFileSync is the sanctioned bypass of the local-bundle import rule (eslint D23).
describe('the rate-bearing calculator copy agrees with rateConfig', () => {
  it.each(['tr', 'en'] as const)('%s: year, SGK rate and one-off fees', (locale) => {
    const bundle = BundleSchema.parse(
      JSON.parse(readFileSync(`src/content/local/bundle.${locale}.json`, 'utf8')),
    );
    const rc = getRateConfig(bundle);
    const tf = makeTf(bundle, locale);
    const year = String(effectiveYear(rc));
    expect(tf('home.068')).toContain(year);
    expect(tf('home.079')).toContain(year);
    expect(tf('home.081')).toContain(sgkRateLabel(rc, 'other', locale));
    expect(tf('home.086')).toContain(formatTRY(rc.permitFeeTRY, locale));
    expect(tf('home.086')).toContain(formatTRY(rc.flightTRY, locale));
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

`cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx vitest run "src/app/[locale]/(site)/__tests__/home.copy.test.ts" "src/app/[locale]/(site)/_lib/phase-a.test.ts"` → `home.copy.test.ts`: the 24 "exists in both message files" cases fail (`expected 'undefined' to be 'string'`), the W80 case fails (`sys.home` is `undefined` after WP2a Task 3's rename), the ICU case fails; the D17 case passes already (it guards data, not code); `phase-a.test.ts` fails to import `./phase-a` (module not found).

- [ ] **Step 3: Implement**

`src/messages/tr.json` — inside `"sys"`: add the `"home"` object right after the `"thankYou"` object (WP2a Task 3 removed the old `"home": "Ana sayfa"` leaf — W80; if a leaf `"home"` is still there, stop: Task 3's rename has not landed), and add a `"home"` member inside the EXISTING `"seo"` object (WP2a Task 4 created `"seo": { "ogTagline": … }` — never a second `"seo"` key):

```json
    "seo": {
      "ogTagline": "…(Task 4's value, unchanged)…",
      "home": {
        "title": "Yurt Dışından İşçi Temini ve Çalışma İzni | JobsAdmire",
        "description": "Türkiye'deki işverenler için kendi temsilcilerimizle yurt dışından nitelikli işçi temini, yasal çalışma izni ve ilk iş gününe kadar tek elden yönetim. Ücretsiz teklif alın."
      }
    },
    "home": {
      "form": {
        "callbackSubmit": "Beni arayın →"
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

`src/messages/en.json` — the same keys, same places:

```json
    "seo": {
      "ogTagline": "…(Task 4's value, unchanged)…",
      "home": {
        "title": "Hire Overseas Workers in Türkiye | JobsAdmire",
        "description": "Skilled workers sourced abroad by our own representatives, legal work permits and arrival — managed end to end for employers in Türkiye. Get a free proposal."
      }
    },
    "home": {
      "form": {
        "callbackSubmit": "Request a call back →"
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
        "signBy": "To start in {start}, sign by {signBy}",
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

Then `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write src/messages/tr.json src/messages/en.json`.

`src/app/[locale]/(site)/_lib/phase-a.ts`:

```ts
import { z } from 'zod';
import type { Logo } from '@/design/blocks';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/**
 * W6/D2/D23: the homepage sections that need live data render nothing (or an empty state)
 * until their collection has rows. These are the switches — the sections read them and return
 * `null`; nothing is deleted. `stories`/`pool`/`representatives` are FIXTURE_ONLY (never
 * non-empty under LOCAL in production) and parsed page-locally (accepted, W77–W115 list);
 * `logos` is a Phase B collection with no schema yet.
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
      className={[
        'inline-block h-2 w-2 shrink-0 rounded-full bg-success motion-safe:animate-pulse',
        className,
      ]
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

`src/app/[locale]/(site)/_sections/hero.tsx` (Cycle 1 version — the `HeroLeadForm` mount lands in Cycle 2; the form column is an empty `<div id="proposal" />` for now so `CTA_BY_PATHNAME['/']`'s anchor resolves from the first commit):

```tsx
import { makeTf } from '@/content/adapter';
import { ImageSlot, LogoMarquee, MetricStrip } from '@/design/blocks';
import { Button, buttonClassName } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { hasRows, logoRows } from '../_lib/phase-a';
import type { SectionProps } from './types';

/**
 * §10 row 4: the licensed hero photograph. `null` until it ships — the slot then renders as a
 * named placeholder (`data-placeholder="v4-hero"`) and the h1 is the LCP element (D26, the
 * Task 7 markup contract). When the file lands under public/photos/, set the path here and
 * nothing else: `lcp` moves to the image and the h1 drops its attribute.
 */
export const HERO_PHOTO: string | null = null;

export function Hero({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const photoIsLcp = HERO_PHOTO !== null;
  return (
    <section
      data-testid="hero"
      className="relative isolate overflow-hidden bg-[#0a1428] text-white"
    >
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
      <div className="container-site grid min-h-[660px] items-end gap-10 pt-16 pb-11 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:min-h-[495px] xl:pt-14 xl:pb-8">
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
            {/* In-page anchor: a bare `#proposal` never goes through the typed Link. */}
            <a href="#proposal" className={buttonClassName('primary', 'lg')}>
              {tf('home.022')}
            </a>
            <Button variant="inverse" size="lg" href="/available-workers">
              {tf('home.023')}
            </Button>
            <span className="ml-1 text-body-sm font-bold text-white/55">{tf('home.024')}</span>
          </div>
        </div>
        {/* Cycle 2 replaces this with the lead form; the id must exist from the first commit
            because the header CTA (CTA_BY_PATHNAME['/']) points at it. */}
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
 * the D9 v1 cards carry no recency, and a rotator needs pause/play (D20); both belong to the
 * Success Stories task, not this page.
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
        <Link
          href="/success-stories"
          className="ml-auto font-extrabold text-blue-safe no-underline"
        >
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

const CARD = 'flex items-center gap-3 rounded-xl border p-4 no-underline shadow-card';
const LIGHT = `${CARD} border-border-1 bg-white text-ink`;
const DARK = `${CARD} border-navy bg-navy text-white`;

/** The design's phone-only "I need workers / I'm an agency / Check someone's ID" cards
 *  (≤460 px). Rendered always, shown only below `xs` (W10). */
export function ChoiceCards({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  return (
    <div data-testid="choice-cards" className="grid gap-3 bg-white px-5 pt-6 pb-1 xs:hidden">
      <a href="#proposal" className={DARK}>
        <span>
          <span className="block font-extrabold">{tf('home.056')}</span>
          <span className="block text-body-sm text-white/70">{tf('home.057')}</span>
        </span>
      </a>
      <Link href="/partner-with-us" className={LIGHT}>
        <span>
          <span className="block font-extrabold">{tf('home.058')}</span>
          <span className="block text-body-sm text-text-secondary">{tf('home.059')}</span>
        </span>
      </Link>
      <Link href="/verify" className={LIGHT}>
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
 * Phase A renders the designed empty state with the request door. The Available Workers task owns
 * the aggregate strip; when a `pool` collection exists this section is where it mounts — the empty
 * state stays the fallback.
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
  // sys.seo.home.* fallbacks are the title/description (W23/W38). sys.seo is server-only (W90).
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
 *  No <main> here — the (site) layout's SiteChrome owns it (R31). Sections that need live data
 *  decide for themselves whether to render (W6). No breadcrumbs on the root page (W109). */
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

`cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx vitest run "src/app/[locale]/(site)/" && npm run verify` → the two files green (24 + 1 + 1 + 1 + 2 = 29 copy cases, 3 phase-a cases); typecheck/lint/format/unit green. Then one build and the markup contract against it (one job at a time): `npm run build && npx next start -p 3100` in one terminal, then `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts e2e/seo.spec.ts --project=desktop` → green (the page contract on `/` and `/en` passes on the real h1; the hire link assertion passes through the desktop nav row). Stop the server.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_sections' 'src/app/[locale]/(site)/_lib/phase-a.ts' 'src/app/[locale]/(site)/_lib/phase-a.test.ts' 'src/app/[locale]/(site)/_components/LiveDot.tsx' 'src/app/[locale]/(site)/__tests__/home.copy.test.ts' src/messages/tr.json src/messages/en.json && git commit -m "feat(home): hero, metric strip and the Phase A empty/hidden sections on the WP2a foundation (T1 c1)

Metadata from sys.seo.home.* (no package SEO string, W38); sys.home is the page's object (W80);
the h1 is the LCP element until the hero photo ships (D26); ticker / proof cell / logos render
by data (W6/D23); pool = empty state; D17 guards pin the rate-bearing copy to rateConfig.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — The hero lead form: `hire` (proposal) and `callback` (call me back) through the forms kernel

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/_lib/forms.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { SECTOR_KEYS } from '@/content/collections';
import { START_WHEN_KEYS } from '@/forms/options';
import {
  callbackSchema,
  callbackToFields,
  HERO_SECTOR_KEYS,
  HERO_SECTOR_LABEL_IDS,
  hireSchema,
  hireToFields,
  START_WHEN_LABEL_IDS,
} from './forms';

// Operations catalog v1.0 + v1.1 (website-form-catalog.ts + Task 8's `city`): a key outside
// these sets is silently DROPPED by the door with a 200 — so the mappers are pinned to them.
const HIRE_CATALOG = [
  'name', 'company', 'email', 'phone', 'country', 'iAm', 'sector', 'roleNeeded',
  'headcount', 'startWhen', 'message', 'city',
];
const CALLBACK_CATALOG = ['name', 'phone', 'email', 'preferredTime', 'topic', 'city'];

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

describe('hireSchema → hireToFields (catalog names, stable keys — W3/W16/W77/W78)', () => {
  it('maps a full submission onto the exact `hire` catalog field names', () => {
    const fields = hireToFields(hireSchema.parse(hire));
    expect(fields).toEqual({
      company: 'Akdeniz Tekstil A.Ş.',
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      phone: '+90 501 000 00 00',
      headcount: '15',
      sector: 'factory',
      city: 'Antalya',
      startWhen: 'month1',
    });
    for (const key of Object.keys(fields)) expect(HIRE_CATALOG).toContain(key);
  });

  it('omits the optional fields the visitor left empty', () => {
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

  it('only stable keys pass — never a localized label, never the retired `now` key (W77/W78)', () => {
    expect(hireSchema.safeParse({ ...hire, sector: 'Fabrika / Üretim' }).success).toBe(false);
    expect(hireSchema.safeParse({ ...hire, startWhen: 'Within 1 month' }).success).toBe(false);
    expect(hireSchema.safeParse({ ...hire, startWhen: 'now' }).success).toBe(false);
    for (const k of HERO_SECTOR_KEYS) expect(hireSchema.safeParse({ ...hire, sector: k }).success).toBe(true);
    for (const k of START_WHEN_KEYS) expect(hireSchema.safeParse({ ...hire, startWhen: k }).success).toBe(true);
  });

  it('the hero sectors are a subset of SECTOR_KEYS and every option key has a package label id', () => {
    for (const k of HERO_SECTOR_KEYS) expect(SECTOR_KEYS).toContain(k);
    expect(Object.keys(HERO_SECTOR_LABEL_IDS).sort()).toEqual([...HERO_SECTOR_KEYS].sort());
    expect(Object.keys(START_WHEN_LABEL_IDS).sort()).toEqual([...START_WHEN_KEYS].sort());
  });

  it('headcount is a positive integer string of at most ten digits (the door cap)', () => {
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
  it('maps onto the `callback` catalog: name, phone, the sector key as topic, city', () => {
    const fields = callbackToFields(
      callbackSchema.parse({ name: 'Mehmet Kaya', phone: '05320000000', topic: 'tourism', city: 'Alanya' }),
    );
    expect(fields).toEqual({ name: 'Mehmet Kaya', phone: '05320000000', topic: 'tourism', city: 'Alanya' });
    for (const key of Object.keys(fields)) expect(CALLBACK_CATALOG).toContain(key);
  });

  it('only sector keys pass as topic; empty optionals are omitted', () => {
    const base = { name: 'x', phone: '05320000000' };
    expect(callbackSchema.safeParse({ ...base, topic: 'Turizm' }).success).toBe(false);
    expect(Object.keys(callbackToFields(callbackSchema.parse({ ...base, topic: '', city: '' })))).toEqual([
      'name',
      'phone',
    ]);
  });

  it('name and phone are required', () => {
    const r = callbackSchema.safeParse({ name: '', phone: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.map((i) => i.path[0]).sort()).toEqual(['name', 'phone']);
  });
});
```

`src/app/[locale]/(site)/_components/HeroLeadForm.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { HeroLeadForm, type HeroLeadFormProps } from './HeroLeadForm';

// usePathname() from next/navigation is null outside the App Router (R35) — nothing to mock.
const idle = vi.fn(async (prev: FormActionState) => prev);

const props: HeroLeadFormProps = {
  locale: 'tr',
  actions: { hire: idle, callback: idle },
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  whatsappHref: 'https://wa.me/905011240340?text=Merhaba',
  contact: { phone: '+905011240340', phoneDisplay: '+90 501 124 03 40', email: 'info@jobsadmire.com' },
  options: {
    sector: [
      { value: 'factory', label: 'Fabrika / Üretim' },
      { value: 'tourism', label: 'Turizm / Konaklama' },
    ],
    startWhen: [
      { value: 'asap', label: 'Hemen' },
      { value: 'month1', label: '1 ay içinde' },
      { value: 'months1to3', label: '1–3 ay' },
      { value: 'planning', label: 'Henüz planlama aşamasında' },
    ],
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
      startWhen: 'Zamanlama',
    },
    submitHire: 'Teklif isteyin →',
    submitCallback: 'Beni arayın →',
    whatsapp: "WhatsApp'tan yazın",
  },
};

describe('HeroLeadForm', () => {
  it('starts in proposal mode: the hire form with the package labels (W115) and the W3 fields', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    const form = screen.getByTestId('hire-form');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    expect(within(form).getByLabelText(/^Firma adı/)).toHaveAttribute('name', 'company');
    expect(within(form).getByLabelText(/^İletişim kişisi/)).toHaveAttribute('name', 'name');
    expect(within(form).getByLabelText(/^Telefon \/ WhatsApp/)).toHaveAttribute('name', 'phone');
    expect(within(form).getByLabelText(/^İşçi sayısı/)).toHaveAttribute('name', 'headcount');
    expect(within(form).getByLabelText(/^Şehir \/ bölge/)).toHaveAttribute('name', 'city');
    expect(form.querySelector('input[name="email"]')).not.toBeNull();
    expect(screen.getByTestId('hero-mode-proposal')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByTestId('callback-form')).toBeNull();
  });

  it('posts stable keys: the startWhen options are the shared START_WHEN_KEYS (W78)', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    const select = screen.getByTestId('hire-form').querySelector<HTMLSelectElement>('select[name="startWhen"]')!;
    const values = [...select.options].map((o) => o.value).filter(Boolean);
    expect(values).toEqual(['asap', 'month1', 'months1to3', 'planning']);
    expect(within(select).getByRole('option', { name: 'Hemen' })).toHaveValue('asap');
  });

  it('carries the consent checkbox linked to the privacy notice (W79)', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    const form = screen.getByTestId('hire-form');
    expect(form.querySelector('input[type="checkbox"][name="consent"]')).not.toBeNull();
    expect(form.querySelector('a[href="/gizlilik"]')).not.toBeNull();
  });

  it('the call-me-back button swaps to the callback form (name, phone, topic, city) and shows the note', async () => {
    const user = userEvent.setup();
    renderWithIntl(<HeroLeadForm {...props} />);
    await user.click(screen.getByTestId('hero-mode-callback'));
    const form = screen.getByTestId('callback-form');
    expect(form).toHaveAttribute('data-form-key', 'callback');
    for (const name of ['name', 'phone', 'city']) expect(form.querySelector(`input[name="${name}"]`)).not.toBeNull();
    expect(form.querySelector('select[name="topic"]')).not.toBeNull();
    expect(form.querySelector('input[name="email"]')).toBeNull();
    expect(form.querySelector('select[name="startWhen"]')).toBeNull();
    expect(form.querySelector('input[type="checkbox"][name="consent"]')).not.toBeNull();
    expect(screen.getByText('Numaranızı bırakın…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Beni arayın →' })).toBeInTheDocument();
    expect(screen.queryByTestId('hire-form')).toBeNull();
  });

  it('the card carries the anchor id the header CTA points at, and the static WhatsApp link', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    expect(screen.getByTestId('hero-form')).toHaveAttribute('id', 'proposal');
    expect(screen.getByRole('link', { name: /WhatsApp'tan yazın/ })).toHaveAttribute(
      'href',
      'https://wa.me/905011240340?text=Merhaba',
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx vitest run "src/app/[locale]/(site)/_lib/forms.test.ts" "src/app/[locale]/(site)/_components/HeroLeadForm.test.tsx"` → both fail on a missing module (`./forms`, `./HeroLeadForm`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_lib/forms.ts`:

```ts
import { z } from 'zod';
import type { SectorKey } from '@/content/collections';
import { START_WHEN_KEYS, type StartWhenKey } from '@/forms/options';
import type { WireFields } from '@/forms/wire';

/**
 * The hero form's option sets. VALUES are the stable keys every form sends (W3/W77); LABELS
 * are the package's own ids, resolved by the section (W115). The sector keys are a subset of
 * the `sectors` collection's `SECTOR_KEYS` — the homepage design offers five of the seven.
 */
export const HERO_SECTOR_KEYS = [
  'factory',
  'agriculture',
  'tourism',
  'construction',
  'other',
] as const satisfies readonly SectorKey[];
export type HeroSectorKey = (typeof HERO_SECTOR_KEYS)[number];
export const HERO_SECTOR_LABEL_IDS: Record<HeroSectorKey, string> = {
  factory: 'home.036',
  agriculture: 'home.037',
  tourism: 'home.038',
  construction: 'home.039',
  other: 'home.040',
};

/** W78: the site-wide `startWhen` keys (`@/forms/options`); this page shows its own package
 *  labels for them (design keys fNow / fM1 / fM13 / fPlanning). */
export const START_WHEN_LABEL_IDS: Record<StartWhenKey, string> = {
  asap: 'home.044',
  month1: 'home.045',
  months1to3: 'home.046',
  planning: 'home.047',
};

/** A select posts '' when untouched; anything else must be one of the keys ('invalid' code). */
const optionKey = (keys: readonly string[]) =>
  z
    .string()
    .max(40)
    .refine((v) => v === '' || keys.includes(v), { message: 'invalid' })
    .optional();

// `.min(1)` before `.email()` so an empty value reads 'required', not 'email' (errors.ts rule).
const name = z.string().trim().min(1).max(120);
/** The door's own rule (website-form-catalog.ts, type 'phone'): at least eight digits. */
const phone = z
  .string()
  .trim()
  .min(1)
  .max(40)
  .refine((v) => v.replace(/\D/g, '').length >= 8, { message: 'phone' });
const city = z.string().trim().max(120).optional();

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
  city,
  startWhen: optionKey(START_WHEN_KEYS),
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
  topic: optionKey(HERO_SECTOR_KEYS),
  city,
});
export type CallbackInput = z.infer<typeof callbackSchema>;

/** Catalog `callback`: name*, phone*, topic (free text ≤200 at the door — we send the sector
 *  KEY, W77, which the inbox reads as `topic: tourism`), city (v1.1). No `preferredTime`: the
 *  design has no such control and Contact's callback owns that field's vocabulary. */
export function callbackToFields(p: CallbackInput): WireFields {
  const fields: WireFields = { name: p.name, phone: p.phone };
  if (p.topic) fields.topic = p.topic;
  if (p.city) fields.city = p.city;
  return fields;
}
```

`src/app/[locale]/(site)/actions.ts`:

```ts
'use server';
import { createFormAction } from '@/forms/action';
import type { FormActionState } from '@/forms/types';
import { callbackSchema, callbackToFields, hireSchema, hireToFields } from './_lib/forms';

// W79: a consent checkbox on every door form (the shell's default; spelled out so the spec and
// the shell cannot drift). Both keys are FormKey literals (R55).
const runHire = createFormAction({
  key: 'hire',
  schema: hireSchema,
  toFields: (parsed) => hireToFields(parsed),
  consent: 'checkbox',
});
const runCallback = createFormAction({
  key: 'callback',
  schema: callbackSchema,
  toFields: (parsed) => callbackToFields(parsed),
  consent: 'checkbox',
});

export async function submitHire(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runHire(prev, data);
}

export async function submitCallback(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
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
  /** the co-primary "Chat on WhatsApp instead" link (home.049) — a STATIC prefill
   *  (sys.home.whatsapp.hire), no visitor data, so it may sit in the href (W95) */
  whatsappHref: string;
  contact: { phone: string; phoneDisplay: string; email: string };
  options: { sector: FieldOption[]; startWhen: FieldOption[] };
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
      startWhen: string;
    };
    submitHire: string;
    submitCallback: string;
    whatsapp: string;
  };
};

const MODE_BTN =
  'inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-pill border px-4 text-body-sm font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
const MODE_ON = 'border-blue-safe bg-blue-safe text-white';
const MODE_OFF = 'border-border-1 bg-white text-ink hover:bg-pale-1';

/**
 * The hero lead form (design id `proposal`). Two modes, one card: "Get free proposal" posts to
 * the `hire` door, "Ask us to call you" to `callback` (W3) — one FormShell mounted at a time, so
 * no two shells share an id scope. At ≤460 px the design collapses the form behind the two
 * buttons; `open` does the same and the `xs:` classes keep the form visible above that width
 * (W10). Consent is the kernel's checkbox (W79 — shell defaults, `/privacy` link). Labels are the
 * package's own ids (W115); `email` has no package label, so `Field` reads `sys.form.labels.email`.
 * `Field`'s `className` lands on the control, so grid spans sit on wrapper divs.
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
    headingLevel: 3 as const,
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
          className={`${MODE_BTN} ${mode === 'proposal' ? MODE_ON : MODE_OFF}`}
        >
          {copy.openProposal}
        </button>
        <button
          type="button"
          data-testid="hero-mode-callback"
          aria-pressed={mode === 'callback'}
          onClick={() => select('callback')}
          className={`${MODE_BTN} ${mode === 'callback' ? MODE_ON : MODE_OFF}`}
        >
          {copy.openCallback}
        </button>
      </div>
      <div className={open ? 'block' : 'hidden xs:block'}>
        {mode === 'proposal' ? (
          <FormShell
            key="hire"
            {...shell}
            action={actions.hire}
            formKey="hire"
            submitLabel={copy.submitHire}
            testId="hire-form"
          >
            <div className="grid gap-3 xs:grid-cols-2">
              <div className="xs:col-span-2">
                <Field name="company" label={copy.labels.company} required autoComplete="organization" />
              </div>
              <Field name="name" label={copy.labels.name} required autoComplete="name" />
              <Field name="email" type="email" required autoComplete="email" inputMode="email" />
              <Field
                name="phone"
                type="tel"
                label={copy.labels.phone}
                required
                autoComplete="tel"
                inputMode="tel"
                hint=""
              />
              <Field name="sector" as="select" label={copy.labels.sector} options={options.sector} hint="" />
              <Field
                name="headcount"
                type="number"
                label={copy.labels.headcount}
                required
                min={1}
                max={500}
                inputMode="numeric"
              />
              <Field name="city" label={copy.labels.city} autoComplete="address-level2" hint="" />
              <div className="xs:col-span-2">
                <Field
                  name="startWhen"
                  as="select"
                  label={copy.labels.startWhen}
                  options={options.startWhen}
                  hint=""
                />
              </div>
            </div>
          </FormShell>
        ) : (
          <FormShell
            key="callback"
            {...shell}
            action={actions.callback}
            formKey="callback"
            submitLabel={copy.submitCallback}
            testId="callback-form"
          >
            <p className="m-0 flex items-start gap-2 rounded-base bg-tint px-3 py-2 text-body-sm font-bold text-blue-safe">
              {copy.callbackNote}
            </p>
            <div className="grid gap-3 xs:grid-cols-2">
              <Field name="name" label={copy.labels.name} required autoComplete="name" />
              <Field
                name="phone"
                type="tel"
                label={copy.labels.phone}
                required
                autoComplete="tel"
                inputMode="tel"
                hint=""
              />
              <Field name="topic" as="select" label={copy.labels.sector} options={options.sector} hint="" />
              <Field name="city" label={copy.labels.city} autoComplete="address-level2" hint="" />
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

`src/app/[locale]/(site)/_sections/hero.tsx` — replace the Cycle 1 placeholder `<div id="proposal" className="scroll-mt-[90px]" />` with `{leadForm}` and add these imports:

```tsx
import { getTranslations } from 'next-intl/server';
import { waLink } from '@/lib/contact';
import { HeroLeadForm } from '../_components/HeroLeadForm';
import {
  HERO_SECTOR_KEYS,
  HERO_SECTOR_LABEL_IDS,
  START_WHEN_LABEL_IDS,
} from '../_lib/forms';
import { submitCallback, submitHire } from '../actions';
import { START_WHEN_KEYS } from '@/forms/options';
```

`Hero` becomes `async` and builds the island's props (the rest of the Cycle 1 JSX is unchanged):

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
        startWhen: START_WHEN_KEYS.map((value) => ({ value, label: tf(START_WHEN_LABEL_IDS[value]) })),
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
          startWhen: tf('home.043'),
        },
        submitHire: tf('home.048'),
        submitCallback: sys('home.form.callbackSubmit'),
        whatsapp: tf('home.049'),
      }}
    />
  );
  return (/* …the Cycle 1 JSX with `{leadForm}` where the placeholder div was… */);
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx vitest run "src/app/[locale]/(site)/" && npm run verify` → green (forms 11, HeroLeadForm 5, plus Cycle 1). Then build + `npx next start -p 3100` (no `OPS_API_URL` locally, so the door answers `unauthorized` without a call — W92/W74) and in a browser: tick consent, submit the proposal form → the `FallbackPanel` (`data-testid="form-fallback"`, `data-kind="unauthorized"`) appears; its WhatsApp button's href is the bare `https://wa.me/905011240340` and clicking it opens the chat with the typed values (W76); switch to call-me-back and repeat. The Playwright version is `e2e/pages/home.spec.ts` (Cycle 6). Stop the server.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add 'src/app/[locale]/(site)/actions.ts' 'src/app/[locale]/(site)/_lib/forms.ts' 'src/app/[locale]/(site)/_lib/forms.test.ts' 'src/app/[locale]/(site)/_components/HeroLeadForm.tsx' 'src/app/[locale]/(site)/_components/HeroLeadForm.test.tsx' 'src/app/[locale]/(site)/_sections/hero.tsx' && git commit -m "feat(home): hero lead form → hire (name/email required, city, stable keys) and call-me-back → callback (T1 c2)

W3/W16: the door's required fields are a design delta on the card; sector posts SECTOR_KEYS and
startWhen the shared START_WHEN_KEYS (W77/W78), labels stay the package's (W115); consent is the
kernel checkbox with the /privacy link (W79).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — The calculator teaser on the shared engine (three presets, four headcount chips), lazy through `LazyIsland`

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/_lib/teaser.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { RATE, role } from '@/lib/calculator/__tests__/fixtures';
import { formatTRY } from '@/lib/format/money';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, teaserView, type TeaserTx } from './teaser';

const TX: TeaserTx = {
  grossMin: 'Brüt maaş (asgari ücret)',
  grossFloor: (m) => `Brüt maaş (yasal tabanın ${m} katı)`,
  headcount: (n) => `${n} işçi`,
  estimate: (a) => `${a.role}|${a.headcount}|${a.monthly}|${a.oneOff}`,
};

describe('teaserView (W2/W58: one engine, exact floors, support OFF)', () => {
  it('general × 15 at 2026 rates: ₺40,214 per worker, ₺603,210 payroll, ₺420,000 one-offs', () => {
    const v = teaserView({ role: role('generalPreset'), label: 'Genel işçi', headcount: 15, rateConfig: RATE, locale: 'tr', tx: TX });
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
    const v = teaserView({ role: role('skilledPreset'), label: 'Nitelikli', headcount: 30, rateConfig: RATE, locale: 'tr', tx: TX });
    expect(v.f.perWorker.monthly.gross).toBe('49.545 ₺');
    expect(v.f.monthly.total).toBe('1.809.631 ₺');
    expect(v.grossLabel).toBe('Brüt maaş (yasal tabanın 1,5× katı)');
  });

  it('shares are unrounded percentages of gross + SGK (the bars) and whole percents in the legend', () => {
    const v = teaserView({ role: role('generalPreset'), label: 'x', headcount: 1, rateConfig: RATE, locale: 'en', tx: TX });
    expect(v.shares.salaryPct).toBeCloseTo(82.135, 2);
    expect(v.shares.sgkPct).toBeCloseTo(17.865, 2);
    expect(v.f.shares.salaryPct).toBe('82%');
  });

  it("the chips are the design's four presets with 15 selected", () => {
    expect(HEADCOUNT_PRESETS).toEqual([1, 5, 15, 30]);
    expect(DEFAULT_HEADCOUNT).toBe(15);
  });
});
```

`src/app/[locale]/(site)/_components/CalculatorTeaser.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { presets } from '@/lib/calculator';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { renderWithIntl } from '@/test/render';
import { CalculatorTeaser, type CalculatorTeaserProps } from './CalculatorTeaser';

const track = vi.fn();
vi.mock('@/analytics/track', () => ({ track: (...a: unknown[]) => track(...a) }));
// usePathname() from next/navigation is null outside the App Router → page '/' (R35).

const LABELS = ['Genel işçi', 'Nitelikli / belgeli', 'Uzman'];
const props: CalculatorTeaserProps = {
  locale: 'tr',
  rateConfig: RATE,
  roles: presets(ROLES).map((row, i) => ({ row, label: LABELS[i] })),
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

let open: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  track.mockClear();
  open = vi.spyOn(window, 'open').mockReturnValue(null);
});
afterEach(() => open.mockRestore());

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

  it('W95: the estimate link is a bare wa.me href; the figures travel only in the click-time URL', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    await user.click(screen.getByRole('radio', { name: '5 işçi' }));
    const link = screen.getByTestId('calc-whatsapp');
    expect(link).toHaveAttribute('href', 'https://wa.me/905011240340');
    await user.click(link);
    expect(open).toHaveBeenCalledTimes(1);
    const [url, target, features] = open.mock.calls[0] as [string, string, string];
    expect(url.startsWith('https://wa.me/905011240340?text=')).toBe(true);
    expect(decodeURIComponent(url)).toContain('201.070 ₺');
    expect(decodeURIComponent(url)).toContain('Genel işçi');
    expect([target, features]).toEqual(['_blank', 'noopener']);
    expect(track).toHaveBeenLastCalledWith('whatsapp_click', { page: '/', locale: 'tr', placement: 'page_cta' });
  });
});
```

(5 × 40,214.025 = 201,070.125 → `201.070 ₺`.)

- [ ] **Step 2: Run to verify it fails**

`cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx vitest run "src/app/[locale]/(site)/_lib/teaser.test.ts" "src/app/[locale]/(site)/_components/CalculatorTeaser.test.tsx"` → both fail on missing modules (`./teaser`, `./CalculatorTeaser`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_lib/teaser.ts`:

```ts
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import {
  estimate,
  formatEstimate,
  multiplierLabel,
  type FormattedEstimate,
} from '@/lib/calculator';

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
  /** the WhatsApp prefill — composed at click time only, never put in an href (W95) */
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
  const grossLabel =
    role.multiplier === 1 ? tx.grossMin : tx.grossFloor(multiplierLabel(role.multiplier, locale));
  return {
    f,
    shares: est.shares,
    grossLabel,
    headcountLabel: tx.headcount(est.input.headcount),
    whatsappText: tx.estimate({
      role: label,
      headcount: est.input.headcount,
      monthly: f.monthly.total,
      oneOff: f.oneOff.total,
    }),
  };
}
```

`src/app/[locale]/(site)/_components/WhatsAppComposeLink.tsx`:

```tsx
'use client';
import type { MouseEvent, ReactNode } from 'react';
import { useContactClick } from '@/analytics/useContactClick';
import { waLink } from '@/lib/contact';

/**
 * W95/W76 (D13): a WhatsApp CTA whose prefill carries what the visitor chose (here: the teaser's
 * role, headcount and figures). The DOM href is the bare chat, so neither GA4 enhanced
 * measurement nor a GTM Click URL trigger can read the prefill; the prefilled URL is composed on
 * click and opened with `noopener`. A middle click (no `click` event) still reaches the bare chat.
 * Fires `whatsapp_click` with `placement: 'page_cta'` like every page contact CTA (W12).
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
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      data-testid={testId}
      className={className}
    >
      {children}
    </a>
  );
}
```

`src/app/[locale]/(site)/_components/TeaserChips.tsx` (no directive — the server fallback renders it without `onChange`, the island with it):

```tsx
export type ChipOption = { value: string; label: string };

/** Chip-styled native radios (arrow keys work, the group has a legend). Without `onChange`
 *  the inputs are read-only — the server fallback's state until the island takes over.
 *  (RadioChips requires `onChange`, so it cannot render the static fallback — accepted
 *  page-local, W77–W115 list.) */
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
import { buttonClassName } from '@/design/primitives';
import type { TeaserView } from '../_lib/teaser';
import { LiveDot } from './LiveDot';
import { WhatsAppComposeLink } from './WhatsAppComposeLink';

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
  whatsappNumber,
  expanded,
  onToggle,
  ctas,
}: {
  view: TeaserView;
  copy: TeaserCardCopy;
  whatsappNumber: string;
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
            className="font-display text-[clamp(24px,2.4vw,30px)] font-extrabold tracking-[-1.2px] whitespace-nowrap xl:text-[clamp(18px,1.8vw,22.5px)]"
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
        <WhatsAppComposeLink
          number={whatsappNumber}
          text={view.whatsappText}
          testId="calc-whatsapp"
          className={buttonClassName(
            'secondary',
            'md',
            'w-full border-success-border bg-success-surface text-success-text hover:bg-[#dcf5e7]',
          )}
        >
          <LiveDot />
          {copy.whatsapp}
        </WhatsAppComposeLink>
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

`src/app/[locale]/(site)/_components/CalculatorTeaser.tsx`:

```tsx
'use client';
import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, teaserView } from '../_lib/teaser';
import { TeaserCard, type TeaserCardCopy } from './TeaserCard';
import { TeaserChips } from './TeaserChips';
import { TeaserLayout } from './TeaserLayout';

export type CalculatorTeaserProps = {
  locale: Locale;
  rateConfig: RateConfig;
  /** the three `preset: true` rows (engine `presets()`), labels resolved by the section */
  roles: { row: CalculatorRole; label: string }[];
  whatsappNumber: string;
  copy: TeaserCardCopy & { rolesLegend: string; headcountLegend: string };
  leftTop: ReactNode;
  leftBottom: ReactNode;
  ctas: ReactNode;
};

/** The interactive teaser. Same engine as the full calculator (W2), same view model as the
 *  server fallback (`teaserView`), so the swap-in is DOM-identical for the default state. */
export function CalculatorTeaser({
  locale,
  rateConfig,
  roles,
  whatsappNumber,
  copy,
  leftTop,
  leftBottom,
  ctas,
}: CalculatorTeaserProps) {
  const sys = useTranslations('sys');
  // R35: the real URL, not next-intl's internal key.
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
  // W12: the preset key and a chip number only — never free text.
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
            options={HEADCOUNT_PRESETS.map((n) => ({
              value: String(n),
              label: sys('home.calc.headcount', { n }),
            }))}
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
          whatsappNumber={whatsappNumber}
          expanded={expanded}
          onToggle={() => setExpanded((e) => !e)}
          ctas={ctas}
        />
      }
    />
  );
}
```

`src/app/[locale]/(site)/_components/CalculatorTeaserIsland.tsx`:

```tsx
'use client';
import type { ReactNode } from 'react';
import { LazyIsland } from '@/design/islands/LazyIsland';
import type { CalculatorTeaserProps } from './CalculatorTeaser';

// A function prop cannot cross the server → client boundary, so the `load` thunk lives in
// this thin client binding; `import type` above keeps the island out of this chunk.
const load = () => import('./CalculatorTeaser').then((m) => ({ default: m.CalculatorTeaser }));

/** W13 amended / W85: the engine + island stay out of the initial script graph. `fallback` is
 *  the server-rendered static teaser for the default state (DOM-identical to the island's first
 *  render); LazyIsland also uses it as the Suspense fallback, so the swap never blanks. */
export function CalculatorTeaserIsland({
  fallback,
  ...props
}: CalculatorTeaserProps & { fallback: ReactNode }) {
  return <LazyIsland load={load} props={props} fallback={fallback} rootMargin="300px" />;
}
```

`src/app/[locale]/(site)/_sections/calculator.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/adapter';
import { getCollection, getRateConfig } from '@/content/collections';
import { Button, Eyebrow, Section } from '@/design/primitives';
import { isReviewDue, presets } from '@/lib/calculator';
import { CalculatorTeaserIsland } from '../_components/CalculatorTeaserIsland';
import { TeaserCard, type TeaserCardCopy } from '../_components/TeaserCard';
import { TeaserChips } from '../_components/TeaserChips';
import { TeaserLayout } from '../_components/TeaserLayout';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, teaserView, type TeaserTx } from '../_lib/teaser';
import type { SectionProps } from './types';

/**
 * "Real cost, 2026 rates" (home.068–090). The numbers come from `rateConfig` and the three
 * preset rows through the shared engine (W2); the dated eyebrow/badge render as authored while
 * the config is in review and fall back to the undated copy after `reviewDueAt` (D17 — the year
 * inside the copy is pinned to `effectiveYear` by home.copy.test.ts). W58: the General figure is
 * ₺40,214 with support off; home.074/082/090/299 are legal-flagged and stay verbatim for the WP-C
 * legal review.
 */
export async function CalculatorStrip({ locale, bundle }: SectionProps) {
  const sys = await getTranslations('sys');
  const tf = makeTf(bundle, locale);
  const rateConfig = getRateConfig(bundle);
  const reviewDue = isReviewDue(rateConfig);
  const whatsappNumber = bundle.settings.whatsappNumber;
  const roles = presets(getCollection(bundle, 'calculatorRoles')).map((row) => ({
    row,
    label: tf(row.labelId),
  }));
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
  const tx: TeaserTx = {
    grossMin: copy.grossMin,
    grossFloor: (multiplier) => sys('home.calc.grossFloor', { multiplier }),
    headcount: (n) => sys('home.calc.headcount', { n }),
    estimate: (a) => sys('home.whatsapp.estimate', a),
  };
  // Static default state (general × 15) — what the server sends and what the island starts from.
  const view = teaserView({
    role: roles[0].row,
    label: roles[0].label,
    headcount: DEFAULT_HEADCOUNT,
    rateConfig,
    locale,
    tx,
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
      <Eyebrow>{reviewDue ? sys('home.calc.eyebrowUndated') : tf('home.068')}</Eyebrow>
      <h2 className="mt-2 mb-3 text-h2 leading-tight tracking-[-1.2px]">{tf('home.069')}</h2>
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
          <TeaserChips
            name="teaser-role"
            legend={copy.rolesLegend}
            options={roles.map((r) => ({ value: r.row.key, label: r.label }))}
            value={roles[0].row.key}
          />
          <TeaserChips
            name="teaser-headcount"
            legend={copy.headcountLegend}
            emphasis="ink"
            options={HEADCOUNT_PRESETS.map((n) => ({
              value: String(n),
              label: sys('home.calc.headcount', { n }),
            }))}
            value={String(DEFAULT_HEADCOUNT)}
          />
        </>
      }
      card={
        <TeaserCard
          view={view}
          copy={copy}
          whatsappNumber={whatsappNumber}
          expanded={false}
          ctas={ctas}
        />
      }
    />
  );
  return (
    <Section tone="light" id="cost" className="border-t border-border-3">
      <div className="container-site">
        <CalculatorTeaserIsland
          fallback={fallback}
          locale={locale}
          rateConfig={rateConfig}
          roles={roles}
          whatsappNumber={whatsappNumber}
          copy={copy}
          leftTop={leftTop}
          leftBottom={leftBottom}
          ctas={ctas}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/page.tsx` — add `import { CalculatorStrip } from './_sections/calculator';` and render `<CalculatorStrip {...section} />` after `<PoolSection {...section} />`.

- [ ] **Step 4: Run tests + `npm run verify`**

`cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx vitest run "src/app/[locale]/(site)/" && npm run verify` → green (teaser 4, CalculatorTeaser 4, plus Cycles 1–2). Build + `npx next start -p 3100`; in the browser: the strip shows general × 15 (`603.210 ₺`) before scrolling; scrolling to it swaps in the island with no layout shift (DevTools → Performance → no layout-shift entries in the section); chips recompute; `calculator_use` lands in `window.dataLayer`; the estimate anchor's href is the bare `https://wa.me/905011240340` and a click opens the prefilled chat. Network tab on a cold load of `/` filtered to `.js`: no `CalculatorTeaser` chunk until the section approaches. Stop the server.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add 'src/app/[locale]/(site)/_lib/teaser.ts' 'src/app/[locale]/(site)/_lib/teaser.test.ts' 'src/app/[locale]/(site)/_components/WhatsAppComposeLink.tsx' 'src/app/[locale]/(site)/_components/TeaserChips.tsx' 'src/app/[locale]/(site)/_components/TeaserCard.tsx' 'src/app/[locale]/(site)/_components/TeaserLayout.tsx' 'src/app/[locale]/(site)/_components/CalculatorTeaser.tsx' 'src/app/[locale]/(site)/_components/CalculatorTeaser.test.tsx' 'src/app/[locale]/(site)/_components/CalculatorTeaserIsland.tsx' 'src/app/[locale]/(site)/_sections/calculator.tsx' 'src/app/[locale]/(site)/page.tsx' && git commit -m "feat(home): calculator teaser on the shared engine — three presets, LazyIsland on approach (T1 c3)

W2/W58: exact floors, support off (₺40,214 general); dated badge hides after reviewDueAt (D17);
calculator_use with the preset key (W12); the estimate WhatsApp prefill is composed at click time,
the href stays bare (W95); engine chunk loads on approach through LazyIsland (W13 amended, W85).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
