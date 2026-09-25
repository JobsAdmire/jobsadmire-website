### Task 6: About (`/hakkimizda`, `/en/about`)

Port of `design-package/design/About Us.dc.html` (strings `about.001`–`about.145`, 7 legal-flagged) onto the WP1 page pattern and the WP2a foundation. Every path below is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation`. **Execution order (W99):** T1 → T13 → T2 → T3 → T4 → T5 → **T6**. By the time this task runs, T1 has created the shared doc anchors (W98: the `docs/SEO.md` `## Pages` table, `docs/ANALYTICS.md` `### Page instrumentation (WP2b)`, the per-page bullet list under `docs/CONTENT-MODEL.md` `### Adding copy (W9, W23, W54)`, the WP2b ledger table); T13 has made `/privacy`, `/cookie-policy` and the footer legal links resolve; T2–T5 have appended their `GATE_ROUTE_TABLE` rows and their `sys.<page>` / `sys.seo.<pageKey>` objects. WP2a Tasks 3–9, including the additions in `.superpowers/sdd/2026-09-20-wp2a-foundation/task-{3,5,6,7}-additions.md`, are merged, and this task consumes them as landed.

**What the page is in Phase A.** It is the company page. The hero sits on a navy gradient with no photo (spec §10 row 4 gives hero photography only to the Homepage and Hire Workers: "gradients elsewhere"), so the `h1` is the LCP element (D26). The page then carries:

- three headline metrics from the `metrics` collection;
- the static sourcing-corridor card;
- "Who we are";
- the founder band, which renders nothing until a published `founder` row exists (W86, §10 row 3);
- the journey timeline;
- the stats row (three signed metrics — the design's unsigned "98 %" is dropped, W1/D17);
- the technology panel with the store badges;
- the two offices from the `offices` collection;
- the `#lisans` licence block with five named PDF placeholder slots (D26; legacy `/certifications` lands here);
- the green closing band;
- the employer-updates newsletter block, which renders nothing (W5/W97).

**No door form.** PRD §2 row 6 lists the forms as "none". The design's employer-updates `subscribeEmployer` handler is an unbound mailto and is the newsletter in disguise (W5). So there is no `actions.ts`, no `FormShell`, no consent row, no `START_WHEN_KEYS` and no field labels. W3/W78/W79/W115 hold vacuously, and no Operations catalog field is touched.

**No client island of its own (W13 amended).** The only client code on the page is already in the shell graph: the foundation's `ContactLink` (inside `ContactCta`/`OfficeCard`), the `Stat` count-up inside `MetricStrip`, and next-intl's `Link`.

**Rulings applied:**

- **Metrics and counts.**
  - W1: every number comes from `metrics`. `about.057`/`about.082` carry `{placed}/{employers}/{countries}` from the importer, so every package id goes through `makeTf`. The legal-flagged `about.035/036/040/046/052/108` render verbatim. The corridor card's "13+ countries" pill (`about.142`, the package's "+ countries" suffix) is replaced by the metric's own figure and label (`13` + `home.051`). This follows W1's `13+` → exact 13 normalisation.
- **Founder.**
  - W86: the founder band reads `getCollection(bundle, 'founder')` and renders nothing while the row is unpublished (`published: false` as imported). No page-local schema.
- **Offices and contact.**
  - W6: no invented Karachi number; `OfficeCard` renders what the collection carries.
  - W7/W34: the `OfficeCard`'s own `labelId` wins over the design's `about.091`/`about.101` caps (Karachi = "Sourcing office").
  - W12: contact clicks only — `page_cta` / `office_card` — and no page event.
  - W95/W76: every `wa.me` href carries fixed copy only; no visitor data sits in any href.
- **Copy.**
  - W9/W23: id-less copy goes under `sys.about.*` and `sys.seo.about.*`.
  - W10: the design's ≤900 px removals are CSS-hidden (`hidden lg:…`), never conditionally rendered. That covers the tech visual and the feature-card bodies.
- **Links and CTAs.**
  - W17: `/about` has no `CTA_BY_PATHNAME` entry, so `DEFAULT_CTAS` applies and there is nothing to render for the header.
  - W82: the hero's and the band's "Request workers" CTAs are the object href `{ pathname: '/hire-workers', hash: '#request-form' }`.
  - W109: the breadcrumb names the page with its own nav label `about.008`, and Home with the page's own `about.021`.
- **Components.**
  - W84: `TimelineStep.body` is optional, so the journey passes none.
  - W97: `NewsletterBand active={false}` returns `null` and no `Section` wraps it.
  - W113: section test ids sit on inner `<div>`s, never on `Section`.
- **Routes and sitemap.**
  - W19: the page is in the `(site)` group.
  - W20: `'/about'` leaves `UNBUILT_PATHNAMES`.
  - W21: the page adds two rows to `e2e/routes.ts`.
- **Gate and previews.**
  - W91: the preview gate is reachable through the bypass header and `lighthouserc.preview.json`.
  - W92: previews are door-less. The page has no door, so the ordinary branch preview is the binding one.
  - W94: About is indexable, so plain `npm run js-size` covers it.
- **Docs.**
  - W45/W98: sentence-anchored edits into the one shape per shared doc.
- **Content slots and review.**
  - D26: `data-lcp-slot="h1"`; every unshipped image or PDF slot is a named `data-placeholder` (W55).
  - D27: this is not a pixel-harness page; it gets side-by-side review.

**Files:**

Create
- `src/app/[locale]/(site)/about/page.tsx` — the page (server component).
- `src/app/[locale]/(site)/about/founder.ts` — `FounderRow` type and `publishedFounder(bundle)` over the W86 `founder` collection.
- `src/app/[locale]/(site)/about/licence.ts` — `LicenceDoc`, `LICENCE_DOCS` (the five `#lisans` slots) and `licenceDocHref`.
- `src/app/[locale]/(site)/about/_components/CorridorCard.tsx` — the hero's sourcing-corridor card. It is a server component. The design's 2.5 s lane rotation is not ported: the first four lanes stay static and CSS fly-dots run under the global reduced-motion rule (D20).
- `src/app/[locale]/(site)/about/_components/FounderBand.tsx` — returns `null` without a published founder (W86).
- `src/app/[locale]/(site)/about/_components/LicenceBlock.tsx` — the `#lisans` section (server; plain-string props).
- `src/app/[locale]/(site)/about/__tests__/copy.test.ts` — `sys.about.*` parity plus the page folder's package-id and sys-key references.
- `src/app/[locale]/(site)/about/__tests__/founder.test.ts`
- `src/app/[locale]/(site)/about/__tests__/FounderBand.test.tsx`
- `src/app/[locale]/(site)/about/__tests__/licence.test.ts`
- `src/app/[locale]/(site)/about/__tests__/LicenceBlock.test.tsx`
- `e2e/pages/about.spec.ts`

Modify
- `src/lib/seo/routes.ts` — delete the `'/about',` entry from the `UNBUILT_PATHNAMES` initialiser (`new Set<…>([ … ])`, WP2a Task 4).
- `e2e/routes.ts` — append two rows as the last entries of the `GATE_ROUTE_TABLE` array literal (after the rows T1–T5/T13 left).
- `src/messages/tr.json`, `src/messages/en.json` — `about: { title, description }` inside the existing `sys.seo` object (Task 4 created it with `ogTagline`; T1–T5 added theirs), and a new `about` object inside `sys`.
- `src/app/globals.css` — `@keyframes about-fly` and `.about-fly`, appended at the end of the file.
- `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md`, `docs/PRD.md`, `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — see **Docs in this task**.

Test
- `src/app/[locale]/(site)/about/__tests__/*` (Vitest, jsdom — matched by the existing `src/**/*.test.{ts,tsx}` include; `_components` is skipped by the W20 walker because it starts with `_`).
- `src/lib/seo/unbuilt.test.ts` (WP2a Task 4, unchanged) — the red→green test of Cycle 1.
- `e2e/pages/about.spec.ts` (Playwright, both projects). The existing loops in `e2e/routing.spec.ts` (page contract), `e2e/seo.spec.ts` (canonical/hreflang/sitemap), `e2e/a11y.spec.ts` and `e2e/width-sweep.spec.ts` also cover the page: they pick the two new routes up from `e2e/routes.ts`.

**Interfaces:**

Consumes (WP2a, as `produces-final.md` and the additions spell them; `src/content/**` checked against the real code at HEAD):
- `src/content/collections.ts`:
  - `getCollection(bundle, 'sourceCountries')` returns 13 `SourceCountry` rows: `code` upper-case ISO2, `name` locale-resolved.
  - `getCollection(bundle, 'founder')` and `CollectionRow<'founder'>` (W86, Task 3 addition) have the row shape `{ name: string; titleId: string; photoSrc: string | null; published: boolean }`. The importer ships one row with `published: false` and `photoSrc: null`.
  - `getMetric(bundle, 'countries')` returns a `Metric` with `labelId` `home.051`.
  - `getOffice(bundle, key)` takes `OfficeKey = 'antalya' | 'karachi'` and returns an `Office` whose fields are `cityId`, `labelId`, `addressId`, `addressLine2Id`, `hoursId`, `phone`, `whatsapp`, `email`, `mapUrl`.
  - `CollectionError` is thrown by `getCollection` on a schema miss outside production.
  - `PAGE_KEYS` includes `'about'`.
- `@/content/adapter`:
  - `getBundle(locale)` (`server-only`, React-`cache`d).
  - `makeTf(bundle, locale)` and `metricValues(bundle, locale)`, re-exported from `pure.ts`: `{ placed: '470+', employers: '22+', countries: '13', permitDays: '45', … }`. `makeT` is **not** used on this page.
- `src/design/blocks` barrel (WP2a Task 5 + additions):
  - `Breadcrumbs({ locale, items: Crumb[], tone?: 'light' | 'dark', className? })`, where `Crumb = { name: string; href: Href }`.
  - `ClosingCtaBand({ bundle, locale, titleId, bodyId?, primary: Cta, secondary?: Cta, tone?: 'navy' | 'gradient' | 'green', id? })`, where `Cta = { label; href: string | Exclude<Href, string> (W82); external?; variant? }`.
  - `ContactCta({ placement: 'page_cta' | 'office_card', href: string | Exclude<Href, string>, variant?, size?, external?, className?, children })`.
  - `ImageSlot({ slot, alt, width, height, src?, lcp?, sizes?, className? })`.
  - `MetricStrip({ bundle, locale, metrics: MetricKey[], tone?: 'light' | 'dark', className? })`.
  - `NewsletterBand({ bundle, locale, active })` returns `null` when `active` is false.
  - `OfficeCard({ bundle, locale, office, children? })` renders an `<article>` with tel / WhatsApp (`home.221` + `sys.whatsapp.prefill`) / mail rows as `ContactLink` `office_card`, plus directions (`home.192`).
  - `StoreBadges({ bundle, locale, android, ios?, tone?: 'dark' | 'light' })`; `'dark'` is the default and is the design's dark badge.
- `src/design/primitives` barrel:
  - `Section({ tone: 'light' | 'dark' | 'pale' | 'band', id?, className?, children })`.
  - `Timeline({ steps: TimelineStep[], variant?: 'vertical' | 'horizontal' })` with `TimelineStep = { when?: string; title: string; body?: string }` (W84).
  - `Eyebrow({ children })`.
  - `buttonClassName(variant, size?, className?)`.
- Assets:
  - `src/design/assets/brand.ts` — `BRAND.iskur` (`/brand/iskur.png`, 320×320).
  - `src/design/Flag.tsx` — `Flag({ code: FlagCode, size?, label?, className? })`.
  - `src/design/assets/flag-codes.ts` — `isFlagCode(code)`.
- SEO:
  - `src/lib/seo/metadata.ts` — `buildMetadata({ locale, href: '/about', bundle, pageKey: 'about', fallbackTitle, fallbackDescription })`. The `about` page record has `titleId: ''`/`descriptionId: ''` (verified in `src/content/local/bundle.en.json`), so the fallbacks are used (W38). The OG image is `pageOgImageUrl(locale, 'about')`.
  - `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES`.
  - `src/lib/seo/unbuilt.test.ts` — the filesystem walker.
- Gate and test support:
  - `e2e/routes.ts` — `GATE_ROUTE_TABLE: readonly { path: string; indexable: boolean }[]`.
  - `playwright.config.ts` — sends `x-vercel-protection-bypass` (W91, Task 7 addition).
  - `scripts/gate.sh`, `scripts/js-size.mjs`.
  - `src/test/bundle.ts` — `testBundle({ strings?, collections?, settings? })`, which merges into the golden fixture.
- `src/app/[locale]/(site)/layout.tsx` — the default-chrome group (W19); the page renders no `<main>` (R31).

Consumes (WP1, read from the code at HEAD):
- `Link` and `Href` from `@/i18n/navigation`. An object href is the only way to carry a hash across locales (W82).
- `routing`/`Locale` from `@/i18n/routing` (`'/about': { tr: '/hakkimizda', en: '/about' }`).
- `waLink(number, text)` from `@/lib/contact`.
- `getTranslations`/`setRequestLocale` from `next-intl/server`; `hasLocale` from `next-intl`.
- Tailwind tokens in `src/app/globals.css` (all verified present):
  - colours: `bg-navy`, `bg-pale-1`, `bg-pale-2`, `bg-tint`, `text-blue-safe`, `text-sky`, `text-success-text`, `text-text-secondary`, `text-text-tertiary`, `border-tint-border`, `border-border-2`, `border-border-4`, `bg-border-1`;
  - radii: `rounded-hero`, `rounded-lg`, `rounded-base`, `rounded-sm`, `rounded-xs`, `rounded-pill`;
  - shadows: `shadow-hero-form`, `shadow-card`, `shadow-card-hover`;
  - type: `text-h1`, `text-h2`, `text-stat`, `text-card-title`, `text-body-lg`, `text-body`, `text-body-sm`, `text-eyebrow`;
  - layout: `container-site`; breakpoints `sm 561`, `md 701`, `lg 901`.
- The global `prefers-reduced-motion` rule that zeroes animation durations (D20).

Produces: nothing another page task consumes. T15 reads:
- the SEO/ANALYTICS rows;
- the placeholder inventory: `office-photo`, `crm-dashboard`, `app-screen`, `antalya-office`, `karachi-office`, `licence-pdf-{iskur-permit,iskur-annex,oib-certificate,oib-annex,company-profile}`, and `founder-photo` only once a founder is published. The design's `about-hero` slot is deliberately not rendered.

---

#### Cycle 1 — route skeleton, metadata, hero, gate registration

- [ ] **Step 1: Write the failing test**

The failing test already exists: `src/lib/seo/unbuilt.test.ts` (WP2a Task 4) walks `src/app/[locale]/**/page.tsx` and fails when `UNBUILT_PATHNAMES` and the filesystem disagree. To make it fail, delete the page's key first.

`src/lib/seo/routes.ts` — inside the `UNBUILT_PATHNAMES` initialiser, delete the single entry:

```ts
  '/about',
```

In the same step, register the gate rows so the SEO/routing/a11y/width loops cover the page from the first build. In `e2e/routes.ts`, append these as the last two entries of the `GATE_ROUTE_TABLE` array literal (immediately before its closing `]`):

```ts
  { path: '/hakkimizda', indexable: true },
  { path: '/en/about', indexable: true },
```

Then add the SEO fallback copy (W23: the package has no `<title>`/description for About, and the page record's `titleId` is `''`). In `src/messages/en.json`, add this key inside the existing `"seo"` object of `sys` (beside `ogTagline` and the page keys T1–T5 added; key order is free, but the key set must match `tr.json`):

```json
      "about": {
        "title": "About JobsAdmire — İŞKUR-licensed employment agency, Antalya",
        "description": "JobsAdmire is an İŞKUR-licensed private employment agency in Antalya, Türkiye. We recruit skilled overseas workers for employers across Türkiye and handle every work permit, with offices in Antalya and Karachi."
      }
```

`src/messages/tr.json`, same place:

```json
      "about": {
        "title": "Hakkımızda — JobsAdmire, İŞKUR lisanslı özel istihdam bürosu",
        "description": "JobsAdmire, Antalya'da faaliyet gösteren İŞKUR lisanslı bir özel istihdam bürosudur. Türkiye genelindeki işverenler için nitelikli yabancı işçi temin eder, tüm çalışma izni işlemlerini yürütür; Antalya ve Karaçi'de ofisleri vardır."
      }
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/lib/seo/unbuilt.test.ts
```

Expected: 1 failure in "is exactly the set of pathnames keys with no page.tsx yet". The walker's expected list contains `'/about'`, because no `(site)/about/page.tsx` exists yet, and the set no longer does. (`e2e/routes.ts` and the messages are not exercised here.)

- [ ] **Step 3: Implement**

`src/app/globals.css` — append at the end of the file:

```css
/* About hero corridor card: a dot travelling along each lane (the design's `ja-fly`, 6 s,
   staggered 1.5 s). The global prefers-reduced-motion rule above stops it (D20): the design
   gave this animation no override of its own. */
@keyframes about-fly {
  0% {
    left: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: calc(100% - 8px);
    opacity: 0;
  }
}
.about-fly {
  animation: about-fly 6s ease-in-out infinite;
}
```

`src/app/[locale]/(site)/about/_components/CorridorCard.tsx`:

```tsx
import { getCollection } from '@/content/collections';
import { Flag } from '@/design/Flag';
import { isFlagCode } from '@/design/assets/flag-codes';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The design rotates four lanes through its country list every 2.5 s (about.139) and flies a
 *  dot along each (`ja-fly`). The rotation is not ported. It is the one animation on the page
 *  with no reduced-motion override, it would need a live-region-safe client island (W13), and
 *  it adds nothing a visitor can act on (D20). So the first four `sourceCountries` rows stand
 *  still, and the dots keep the motion through CSS only. */
const LANES = 4;
const DELAY = ['', '[animation-delay:1.5s]', '[animation-delay:3s]', '[animation-delay:4.5s]'];

export function CorridorCard({
  bundle,
  t,
  countriesText,
  countriesLabel,
}: {
  bundle: Bundle;
  /** `makeTf(bundle, locale)` from the page. */
  t: (id: string) => string;
  /** `metricValues(bundle, locale).countries` — the W1 figure, never the list length. */
  countriesText: string;
  /** The countries metric's own label (`home.051`). The design's `about.142` "+ countries"
   *  suffix would print "13+", which W1 normalised to the exact 13. */
  countriesLabel: string;
}) {
  const lanes = getCollection(bundle, 'sourceCountries').slice(0, LANES);
  return (
    <div
      data-testid="about-corridor"
      className="rounded-hero bg-white p-5 text-ink shadow-hero-form sm:p-8"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-card-title">{t('about.032')}</h2>
        <span className="text-body-sm font-extrabold text-blue-safe">
          {countriesText} {countriesLabel}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <ul className="m-0 grid list-none gap-3 p-0">
          {lanes.map((c, i) => (
            <li key={c.code} className="grid grid-cols-[7.5rem_1fr] items-center gap-3">
              <span className="flex items-center gap-2 text-body-sm font-extrabold">
                {isFlagCode(c.code) ? <Flag code={c.code} size={18} /> : null}
                {c.name}
              </span>
              <span aria-hidden="true" className="relative block h-0.5 rounded-pill bg-border-1">
                <span
                  className={`about-fly absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-pill bg-blue-safe ${DELAY[i] ?? ''}`}
                />
              </span>
            </li>
          ))}
        </ul>
        <div className="rounded-base border border-tint-border bg-pale-1 px-4 py-3 text-center">
          <span className="block text-body font-extrabold">{t('about.033')}</span>
          <span className="block text-body-sm text-text-secondary">{t('about.034')}</span>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/about/page.tsx` (the Cycle 1 version: the hero only; later cycles add the sections in the design's order):

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
import { getMetric } from '@/content/collections';
import { BRAND } from '@/design/assets/brand';
import { Breadcrumbs, MetricStrip } from '@/design/blocks';
import { buttonClassName, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { CorridorCard } from './_components/CorridorCard';

/** W82: the page's one cross-page hash target, as an object href so next-intl localises the
 *  pathname and keeps the hash (`/isci-talebi#request-form`, `/en/hire-workers#request-form`).
 *  T2 renders the id; `DEFAULT_CTAS` points at the same place. */
const REQUEST_FORM = { pathname: '/hire-workers', hash: '#request-form' } as const;

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
  // The About page record carries no SEO ids (W23/W38): the sys.seo.about.* fallbacks stand.
  return buildMetadata({
    locale,
    href: '/about',
    bundle,
    pageKey: 'about',
    fallbackTitle: sys('seo.about.title'),
    fallbackDescription: sys('seo.about.description'),
  });
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  // Every package id goes through makeTf: about.057/082 carry {metric} tokens after the
  // importer's re-authoring (W1), and fill() is a no-op on the rest.
  const t = makeTf(bundle, locale);
  const metrics = metricValues(bundle, locale);
  const countries = getMetric(bundle, 'countries');

  return (
    <>
      {/* ============ HERO (design 515–616). §10 row 4: no hero photo on this page ("gradients
          elsewhere"), so the h1 is the LCP element (D26). The design's `about-hero` image-slot is
          not rendered: the gradient IS the Phase A design, and a placeholder behind the h1 would
          compete with it. Section padding override: accepted page-local (W-check T6(4)). */}
      <Section
        tone="dark"
        id="about-hero"
        className="relative overflow-hidden pt-8 pb-12 lg:pt-[70px] lg:pb-[88px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-navy via-navy to-blue-safe/30"
        />
        <div className="container-site relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            {/* W109: the page's own labels — about.021 "Home" / about.008 "About Us". */}
            <Breadcrumbs
              locale={locale}
              tone="dark"
              items={[
                { name: t('about.021'), href: '/' },
                { name: t('about.008'), href: '/about' },
              ]}
            />
            <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-4 mb-2 text-h1 leading-none">
              {t('about.022')} <span className="text-sky">{t('about.023')}</span>
            </h1>
            <p className="m-0 mb-4 text-body-lg font-extrabold tracking-[1.2px] text-white/70">
              {t('about.024')}
            </p>
            <p className="m-0 mb-7 max-w-[560px] text-body-lg text-white/80">{t('about.025')}</p>
            {/* Hero pills (design 532–545): the figures and labels come from the metrics
                collection (home.050 / hire.073 / home.051). The design's about.026–028 labels and
                its typed "14+"/"12+" are not read (W1: one label per metric, site-wide). */}
            <MetricStrip
              bundle={bundle}
              locale={locale}
              tone="dark"
              metrics={['placed', 'employers', 'countries']}
              className="border-t border-white/15 pt-6"
            />
            {/* Phone-only CTAs (design .ja-hero-cta-m / .ja-hero-pdf-m), CSS-hidden from lg (W10).
                The design's second button (WhatsApp, about.140 prefill) is display:none at every
                width, so it is not ported. */}
            <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
              <Link
                data-testid="about-hero-request"
                href={REQUEST_FORM}
                className={buttonClassName('primary', 'lg', 'w-full sm:w-auto')}
              >
                {t('about.029')}
              </Link>
            </div>
            <a
              href="#lisans"
              className="mt-3 inline-flex min-h-[44px] items-center text-body-sm font-extrabold text-white/80 underline underline-offset-4 lg:hidden"
            >
              {t('about.031')}
            </a>
          </div>
          <div className="relative">
            <CorridorCard
              bundle={bundle}
              t={t}
              countriesText={metrics.countries}
              countriesLabel={countries.labelId ? t(countries.labelId) : ''}
            />
            {/* İŞKUR float (design .ja-iskur-float): the local mark (W14); decorative, since
                about.035 names it. Both lines are legal-flagged and render verbatim. */}
            <div className="mt-4 flex items-center gap-4 rounded-base border border-white/20 bg-white/10 px-4 py-3 lg:absolute lg:-bottom-6 lg:left-6 lg:mt-0 lg:bg-navy lg:shadow-hero-form">
              <Image
                src={BRAND.iskur.src}
                width={40}
                height={40}
                alt=""
                className="h-10 w-10 rounded-xs bg-white object-contain p-1"
              />
              <div>
                <p className="m-0 text-body-sm font-extrabold">{t('about.035')}</p>
                <p className="m-0 text-body-sm text-white/60">{t('about.036')}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx prettier --write "src/app/[locale]/(site)/about" src/app/globals.css src/lib/seo/routes.ts e2e/routes.ts src/messages
npx vitest run src/lib/seo/unbuilt.test.ts src/lib/seo/routes.test.ts scripts/gate-routes.test.ts src/messages/messages.test.ts
npm run verify
```

Expected:
- **Vitest.** Green: the set and the filesystem agree again; `gate-routes.test.ts` still derives `GATE_ROUTES`/`INDEXABLE_GATE_ROUTES` from the table; `messages.test.ts` proves both files carry the same key set.
- **`npm run verify`.** Green.

Then run one heavy job at a time (Mac memory rule). Build and start in one terminal:

```bash
npm run build && npm run start
```

and in another:

```bash
npx playwright test e2e/routing.spec.ts e2e/seo.spec.ts --project=desktop
```

Expected:
- **Page contract.** The loop finds exactly one `h1[data-testid="page-h1"]` on `/hakkimizda` and `/en/about`, with no leaked `{token}`.
- **Canonicals.** `https://www.jobsadmire.com/hakkimizda` ↔ `…/en/about`.
- **Sitemap.** It lists both, and both answer 200.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/about" src/app/globals.css src/lib/seo/routes.ts e2e/routes.ts src/messages/tr.json src/messages/en.json
git commit -m "feat(about): route skeleton, metadata and hero on the WP2a foundation (T6 c1)

- (site)/about/page.tsx: generateMetadata with the sys.seo.about fallbacks (W23/W38); navy
  gradient hero with the h1 as the LCP element (spec §10 row 4, D26); Breadcrumbs with the
  page's own about.021/about.008 (W109); MetricStrip over placed/employers/countries (W1);
  phone-only Request-workers CTA as an object href to /hire-workers#request-form (W82)
- CorridorCard: static first four sourceCountries lanes, CSS fly-dots under the global
  reduced-motion rule (D20); the countries pill reads the metric's own label, not about.142
- '/about' leaves UNBUILT_PATHNAMES (W20); /hakkimizda + /en/about join GATE_ROUTE_TABLE (W21)
- sys.seo.about.{title,description} in both message files

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — "Who we are", journey timeline and stats row, technology panel; the `sys.about.*` copy and its reference test

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/about/__tests__/copy.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { METRIC_KEYS } from '@/content/collections';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

type Tree = { [k: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : flatten(v, `${prefix}${k}.`),
  );
}

function lookup(tree: Tree, key: string): string | Tree | undefined {
  return key
    .split('.')
    .reduce<string | Tree | undefined>(
      (node, part) => (typeof node === 'object' ? node[part] : undefined),
      tree,
    );
}

/** Every `.ts`/`.tsx` source in the page folder (page, helpers, _components), tests excluded. */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === '__tests__' ? [] : sources(p);
    return /\.tsx?$/.test(name) ? [readFileSync(p, 'utf8')] : [];
  });
}

const PAGE_DIR = join(__dirname, '..');
// The sanctioned readFileSync bypass (W40): src/** may not import src/content/local/* (D23).
const LOCAL_DIR = join(__dirname, '../../../../../content/local');
const readJson = (name: string) => JSON.parse(readFileSync(join(LOCAL_DIR, name), 'utf8'));

const SYS_REF = /\bsys\(\s*(['"`])((?:about|seo\.about)\.[A-Za-z0-9_.]+)\1/g;
const PACKAGE_ID = /(['"`])((?:about|home|hire|contact)\.\d{3})\1/g;
const TOKEN = /\{([A-Za-z][A-Za-z0-9]*)\}/g;

/** Ids the page must never read: the design's unsigned-stat labels (W1, MetricStrip renders
 *  each metric's own label), the "+ countries" suffix (W1: exact 13), the rotation list (the
 *  sourceCountries collection replaces it), the founder-name placeholder (W86 — the name comes
 *  from a published row only), and the hidden employer-updates subscription (W5). */
const NEVER_READ = [
  'about.026',
  'about.027',
  'about.028',
  'about.059',
  'about.060',
  'about.061',
  'about.062',
  'about.063',
  'about.139',
  'about.141',
  'about.142',
  'about.144',
  'about.145',
];

describe('About copy (W9/W23)', () => {
  const enAbout = en.sys.about as Tree;
  const trAbout = tr.sys.about as Tree;
  const enSeo = en.sys.seo.about as Tree;
  const trSeo = tr.sys.seo.about as Tree;

  it('sys.about.* and sys.seo.about.* carry the identical key set in both locales', () => {
    expect(flatten(trAbout).sort()).toEqual(flatten(enAbout).sort());
    expect(flatten(trSeo).sort()).toEqual(flatten(enSeo).sort());
  });

  it('has no empty value in either locale', () => {
    for (const tree of [enAbout, trAbout, enSeo, trSeo])
      for (const key of flatten(tree)) expect(lookup(tree, key), key).not.toBe('');
  });

  it('every sys(…) reference in the page folder resolves in both message files', () => {
    const referenced = new Set<string>();
    for (const src of sources(PAGE_DIR)) for (const m of src.matchAll(SYS_REF)) referenced.add(m[2]);
    expect(referenced.size).toBeGreaterThan(0);
    for (const key of referenced) {
      expect(typeof lookup(en.sys as Tree, key), `en sys.${key}`).toBe('string');
      expect(typeof lookup(tr.sys as Tree, key), `tr sys.${key}`).toBe('string');
    }
  });

  it('every package id the page folder names exists, and its {tokens} are metric keys (W1)', () => {
    const catalogue = readJson('catalogue.json') as Record<string, unknown>;
    const bundles = ['bundle.tr.json', 'bundle.en.json'].map(
      (f) => readJson(f).strings as Record<string, string>,
    );
    const ids = new Set<string>();
    for (const src of sources(PAGE_DIR)) for (const m of src.matchAll(PACKAGE_ID)) ids.add(m[2]);
    expect(ids.size).toBeGreaterThan(0);
    for (const id of ids) {
      expect(id in catalogue, `${id} not in catalogue.json`).toBe(true);
      for (const strings of bundles) {
        expect(typeof strings[id], id).toBe('string');
        for (const token of strings[id].matchAll(TOKEN))
          expect(METRIC_KEYS as readonly string[], `${id} {${token[1]}}`).toContain(token[1]);
      }
    }
  });

  it('never reads the unsigned stat labels, the founder placeholder or the hidden subscription', () => {
    const all = sources(PAGE_DIR).join('\n');
    for (const id of NEVER_READ) expect(all.includes(`'${id}'`), id).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run about/__tests__/copy.test.ts
```

Expected: the suite fails to collect with `TypeError: Cannot convert undefined or null to object`, because `en.sys.about` does not exist yet.

- [ ] **Step 3: Implement**

`src/messages/en.json` — add a new `about` object as a key of `sys` (beside the page objects T1–T5 added; keep the file's 2-space style):

```json
    "about": {
      "who": {
        "badgeYear": "2024",
        "photoAlt": "The JobsAdmire team at the Antalya office"
      },
      "journey": {
        "m3When": "2025"
      },
      "tech": {
        "dashboardAlt": "The JobsAdmire portal dashboard",
        "appAlt": "The JobsAdmire mobile app"
      },
      "offices": {
        "photoAlt": "The {city} office"
      },
      "licence": {
        "title": "Licence and documents",
        "body": "Our İŞKUR private employment agency permit and its supporting documents, as PDFs.",
        "pending": "PDF being added",
        "open": "Open PDF",
        "docs": {
          "iskurPermit": "İŞKUR private employment agency permit",
          "iskurAnnex": "İŞKUR permit — annex",
          "oibCertificate": "Private employment agency authorisation certificate",
          "oibAnnex": "Authorisation certificate — annex"
        }
      },
      "whatsapp": {
        "demo": "Hello JobsAdmire, I would like a demo of your CRM portal.",
        "consult": "Hello JobsAdmire, I would like a free consultation."
      }
    }
```

`src/messages/tr.json`, same place:

```json
    "about": {
      "who": {
        "badgeYear": "2024",
        "photoAlt": "Antalya ofisimizdeki JobsAdmire ekibi"
      },
      "journey": {
        "m3When": "2025"
      },
      "tech": {
        "dashboardAlt": "JobsAdmire portal panosu",
        "appAlt": "JobsAdmire mobil uygulaması"
      },
      "offices": {
        "photoAlt": "{city} ofisi"
      },
      "licence": {
        "title": "Lisans ve belgeler",
        "body": "İŞKUR özel istihdam bürosu izin belgemiz ve ekleri, PDF olarak.",
        "pending": "PDF ekleniyor",
        "open": "PDF'yi açın",
        "docs": {
          "iskurPermit": "İŞKUR özel istihdam bürosu izin belgesi",
          "iskurAnnex": "İŞKUR izin belgesi — ek",
          "oibCertificate": "Özel istihdam bürosu yetki belgesi",
          "oibAnnex": "Yetki belgesi — ek"
        }
      },
      "whatsapp": {
        "demo": "Merhaba JobsAdmire, CRM portalınızın demosunu görmek istiyorum.",
        "consult": "Merhaba JobsAdmire, ücretsiz danışmanlık almak istiyorum."
      }
    }
```

Notes on these keys:
- The four `licence.docs.*` labels are working titles for the D26 slots. The owner's §10 row 3 delivery renames them with a message edit and no code change.
- `who.badgeYear` and `journey.m3When` are the two dated labels the design types into markup with no id. They live in `sys` so D17's dated-claim review sees them.
- `whatsapp.demo`/`consult` are the design's two literal prefills (design lines 775 and 914), fixed copy with no visitor data (W95).

`src/app/[locale]/(site)/about/page.tsx`:

1. Replace the import block's `@/design/blocks` and `@/design/primitives` lines with:

```tsx
import { Breadcrumbs, ContactCta, ImageSlot, MetricStrip, StoreBadges } from '@/design/blocks';
import { buttonClassName, Eyebrow, Section, Timeline } from '@/design/primitives';
```

and add, after the `@/i18n/routing` import:

```tsx
import { waLink } from '@/lib/contact';
```

2. Below the `REQUEST_FORM` constant, add the page's id tables:

```tsx
/** Who-we-are rows (design 633–656): title id, body id. about.046 is legal-flagged (verbatim). */
const WHO_ROWS = [
  ['about.041', 'about.042'],
  ['about.043', 'about.044'],
  ['about.045', 'about.046'],
] as const;

/** Technology panel ticks (design 757–777); about.074 is the design's AI-gradient tick. */
const TECH_POINTS = ['about.071', 'about.072', 'about.073', 'about.074', 'about.075'] as const;

/** The six feature cards (design 805–836). about.082 = "…from {countries} countries…" (W1). */
const FEATURES = [
  ['about.077', 'about.078'],
  ['about.079', 'about.080'],
  ['about.081', 'about.082'],
  ['about.083', 'about.084'],
  ['about.085', 'about.086'],
  ['about.087', 'about.088'],
] as const;
```

3. In `About`, replace the line `const bundle = await getBundle(locale);` with:

```tsx
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const { settings } = bundle;
```

4. Append after the hero's closing `</Section>` (inside the fragment):

```tsx
      {/* ============ WHO WE ARE (design 618–657) */}
      <Section tone="light" id="about-who">
        <div
          data-testid="about-who"
          className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        >
          <div className="relative mb-6 lg:mb-0">
            <ImageSlot
              slot="office-photo"
              alt={sys('about.who.photoAlt')}
              width={640}
              height={400}
              sizes="(min-width: 901px) 42vw, 100vw"
              className="rounded-lg"
            />
            <div className="absolute right-2 -bottom-6 rounded-base bg-blue-safe px-6 py-4 text-white shadow-hero-form sm:-right-4">
              <p className="m-0 text-stat leading-none font-extrabold">{sys('about.who.badgeYear')}</p>
              <p className="m-0 mt-1 text-body-sm">{t('about.037')}</p>
            </div>
          </div>
          <div>
            <Eyebrow>{t('about.038')}</Eyebrow>
            <h2 className="mt-2 mb-4 text-h2">{t('about.039')}</h2>
            {/* about.040 is legal-flagged: rendered verbatim ("13+ countries") for the WP-C review (W1). */}
            <p className="m-0 mb-7 text-body text-text-secondary">{t('about.040')}</p>
            <ol className="m-0 list-none p-0">
              {WHO_ROWS.map(([titleId, bodyId], i) => (
                <li
                  key={titleId}
                  className="flex gap-4 border-t border-border-4 py-4 last:border-b"
                >
                  <span
                    aria-hidden="true"
                    className="min-w-8 text-body font-extrabold text-blue-safe tabular-nums"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="m-0 mb-1 text-card-title">{t(titleId)}</h3>
                    <p className="m-0 text-body-sm text-text-secondary">{t(bodyId)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ============ FOUNDER + JOURNEY band (design 659–738). The founder figure joins in Cycle 3. */}
      <Section tone="pale" id="about-journey">
        <div className="container-site">
          <div className="max-w-[720px]">
            <div data-testid="about-journey">
              <h2 className="m-0 mb-6 text-eyebrow font-extrabold tracking-[1.5px] text-blue-safe uppercase">
                {t('about.050')}
              </h2>
              {/* W84: body is optional; the journey rows have none. about.052 is legal (verbatim);
                  about.057 = "{placed} workers placed, {employers} clients" after the importer (W1). */}
              <Timeline
                variant="vertical"
                steps={[
                  { when: t('about.051'), title: t('about.052') },
                  { when: t('about.053'), title: t('about.054') },
                  { when: sys('about.journey.m3When'), title: t('about.055') },
                  { when: t('about.056'), title: t('about.057') },
                ]}
              />
              {/* The label says "Partner with us": that intent wins over the design's stale
                  jobsadmire.com/#request-form target. */}
              <Link href="/partner-with-us" className={buttonClassName('primary', 'lg', 'mt-6')}>
                {t('about.058')}
              </Link>
            </div>
          </div>
          {/* Stats row (design .ja-stats4): placed / employers / permitDays (45 + home.206 unit).
              "98 % client retention" has no id and no signed metric, so it is dropped (W1, D17). */}
          <MetricStrip
            bundle={bundle}
            locale={locale}
            metrics={['placed', 'employers', 'permitDays']}
            className="mt-14 border-t border-tint-border pt-8"
          />
        </div>
      </Section>

      {/* ============ TECHNOLOGY (design 740–837) */}
      <Section tone="light" id="about-tech">
        <div data-testid="about-tech" className="container-site">
          <h2 className="mt-0 mb-4 text-center text-h2">{t('about.064')}</h2>
          <p className="mx-auto mt-0 mb-10 max-w-[560px] text-center text-body-lg text-text-secondary">
            {t('about.065')}
          </p>
          <div className="grid gap-10 rounded-hero border border-tint-border bg-linear-to-b from-pale-1 to-tint p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Eyebrow>{t('about.066')}</Eyebrow>
              {/* The package splits the headline around the highlighted words (W23 permits the join). */}
              <h3 className="mt-2 mb-4 text-h2">
                {t('about.067')} <span className="text-blue-safe">{t('about.068')}</span>{' '}
                {t('about.069')}
              </h3>
              <p className="m-0 mb-6 text-body text-text-secondary">{t('about.070')}</p>
              <ul className="m-0 mb-8 grid list-none gap-3 p-0">
                {TECH_POINTS.map((id) => (
                  <li key={id} className="grid grid-cols-[1.5rem_1fr] gap-2 text-body-sm">
                    <span aria-hidden="true" className="font-extrabold text-success-text">
                      {id === 'about.074' ? '✦' : '✓'}
                    </span>
                    <span>{t(id)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-4">
                {/* W12/W95: whatsapp_click page_cta; the prefill is fixed sys copy. */}
                <ContactCta
                  placement="page_cta"
                  size="lg"
                  external
                  href={waLink(settings.whatsappNumber, sys('about.whatsapp.demo'))}
                >
                  {t('about.076')}
                </ContactCta>
                {/* W8: the App Store badge renders only once settings.storeLinks.ios is a URL.
                    Default tone 'dark' = the design's dark badges on the light panel. */}
                <StoreBadges
                  bundle={bundle}
                  locale={locale}
                  android={settings.storeLinks.android}
                  ios={settings.storeLinks.ios}
                />
              </div>
            </div>
            {/* Visual (design .ja-tech-visual): hidden ≤900 px by the design, so CSS-hidden here (W10). */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-4">
              <ImageSlot
                slot="crm-dashboard"
                alt={sys('about.tech.dashboardAlt')}
                width={640}
                height={400}
                sizes="(min-width: 901px) 34vw, 1px"
                className="rounded-sm"
              />
              <ImageSlot
                slot="app-screen"
                alt={sys('about.tech.appAlt')}
                width={150}
                height={300}
                sizes="150px"
                className="w-[150px] rounded-lg"
              />
            </div>
          </div>
          <ul className="m-0 mt-8 grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([titleId, bodyId], i) => (
              <li key={titleId} className="rounded-base bg-pale-1 p-6">
                <span aria-hidden="true" className="text-body-sm font-extrabold text-blue-safe">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 mb-1 text-card-title">{t(titleId)}</h3>
                {/* Bodies are hidden ≤900 px in the design, so hidden lg:block (W10). */}
                <p className="m-0 hidden text-body-sm text-text-secondary lg:block">{t(bodyId)}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
```

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx prettier --write "src/app/[locale]/(site)/about" src/messages
npx vitest run about/__tests__ src/messages/messages.test.ts
npm run verify
```

Expected:
- **Vitest.** Five `copy.test.ts` cases green, and `messages.test.ts` green (the key sets match).
- **`npm run verify`.** Green.
- **Dev render.** Run `npm run dev` once and load `/hakkimizda` and `/en/about`. There must be no `unknown string id`, no `fill: no value for placeholder` and no `CollectionError` in the terminal. `makeTf` throws in dev only, so this run is the proof.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/about" src/messages/tr.json src/messages/en.json
git commit -m "feat(about): who-we-are, journey timeline, stats row and technology panel (T6 c2)

- three sections in the design's order over makeTf (about.057/082 carry W1 metric tokens;
  about.040/046/052 legal-flagged verbatim); Timeline vertical with no bodies (W84); the
  second MetricStrip drops the unsigned '98 %' (W1/D17); journey CTA -> /partner-with-us
- tech visual + feature bodies CSS-hidden <=900 px (W10); demo CTA through ContactCta
  page_cta with a fixed sys prefill (W12/W95); StoreBadges (iOS hidden, W8)
- sys.about.* in both locales (dated labels, alts, licence copy, two WhatsApp prefills —
  W9/W23) with a copy test: key parity, sys references, package ids + metric tokens, and
  the ids the page must never read

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — founder band, rendered only from a published `founder` row (W86, §10 row 3)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/about/__tests__/founder.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CollectionError } from '@/content/collections';
import { testBundle } from '@/test/bundle';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import { publishedFounder } from '../founder';

const ROW = { name: 'Ada Example', titleId: 'about.047', photoSrc: null, published: true };

describe('publishedFounder (W86: the founder band reads only this)', () => {
  it('is null for an empty founder collection', () => {
    expect(publishedFounder(testBundle({ collections: { founder: [] } }))).toBeNull();
  });

  it('is null while the row is unpublished (the importer ships published: false)', () => {
    const bundle = testBundle({ collections: { founder: [{ ...ROW, published: false }] } });
    expect(publishedFounder(bundle)).toBeNull();
  });

  it('returns the published row', () => {
    expect(publishedFounder(testBundle({ collections: { founder: [ROW] } }))).toEqual(ROW);
  });

  it('the committed LOCAL bundles publish no founder (§10 row 3 is pending)', () => {
    for (const locale of ['tr', 'en'] as const) {
      // The sanctioned readFileSync bypass (W40): src/** may not import src/content/local/*.
      const raw = JSON.parse(
        readFileSync(join(__dirname, `../../../../../content/local/bundle.${locale}.json`), 'utf8'),
      );
      expect(publishedFounder(BundleSchema.parse(raw)), locale).toBeNull();
    }
  });

  it('refuses a malformed row outside production instead of publishing half a claim', () => {
    const bundle = testBundle({ collections: { founder: [{ name: 'X', published: 'yes' }] } });
    expect(() => publishedFounder(bundle)).toThrow(CollectionError);
  });
});
```

`src/app/[locale]/(site)/about/__tests__/FounderBand.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FounderBand } from '../_components/FounderBand';
import type { FounderRow } from '../founder';

const COPY: Record<string, string> = {
  'about.047': 'Founder & CEO, JobsAdmire',
  'about.048': '“Behind every worker we place is a family whose life changes. Today we are proud to serve',
  'about.143': 'families',
  'about.049': 'through dignified employment in Türkiye.”',
};
const t = (id: string) => COPY[id] ?? `?${id}`;
const ROW: FounderRow = { name: 'Ada Example', titleId: 'about.047', photoSrc: null, published: true };

describe('FounderBand', () => {
  it('renders nothing without a published founder (W86)', () => {
    const { container } = render(<FounderBand founder={null} placedText="470+" t={t} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the name, the row's own title id and the quote around the placed figure", () => {
    render(<FounderBand founder={ROW} placedText="470+" t={t} />);
    const figure = screen.getByTestId('about-founder');
    expect(figure.tagName).toBe('FIGURE');
    expect(figure).toHaveTextContent('Ada Example');
    expect(figure).toHaveTextContent('Founder & CEO, JobsAdmire');
    expect(screen.getByText('470+ families')).toBeInTheDocument();
    expect(figure.querySelector('blockquote')).toHaveTextContent(/proud to serve 470\+ families through/);
  });

  it('a founder without a photo gets the named founder-photo placeholder (D26/W55)', () => {
    const { container } = render(<FounderBand founder={ROW} placedText="470+" t={t} />);
    const slot = container.querySelector('[data-placeholder="founder-photo"]');
    expect(slot).not.toBeNull();
    expect(slot).toHaveAttribute('aria-label', 'Ada Example');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run about/__tests__/founder.test.ts about/__tests__/FounderBand.test.tsx
```

Expected: both files fail to load, with `Failed to resolve import "../founder"` and `"../_components/FounderBand"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/about/founder.ts`:

```ts
import { getCollection, type CollectionRow } from '@/content/collections';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/** W86: `{ name, titleId, photoSrc, published }` — the one founder source for T1's team card,
 *  this page's band and T10's founder strip. */
export type FounderRow = CollectionRow<'founder'>;

/**
 * The founder band's only input (W86, §10 row 3). The importer ships one row with
 * `published: false`, so the band renders nothing until the owner's name, title and photo
 * are confirmed and the row is published (a content edit — no code change here). The quote's
 * figure is never stored on the row: it is the `placed` metric (W1).
 */
export function publishedFounder(bundle: Bundle): FounderRow | null {
  return getCollection(bundle, 'founder').find((row) => row.published) ?? null;
}
```

`src/app/[locale]/(site)/about/_components/FounderBand.tsx`:

```tsx
import { ImageSlot } from '@/design/blocks';
import type { FounderRow } from '../founder';

/** The founder figure (design 662–678). Renders nothing without a published row (W86): the
 *  hidden state is data-driven, never a deleted section. The quote is the package's own
 *  three-way split around the live figure (about.048 / about.143 / about.049 — W23 permits the
 *  join because the package made the split); the figure is the `placed` metric text. A missing
 *  photo is the named `founder-photo` placeholder (D26/W55). */
export function FounderBand({
  founder,
  placedText,
  t,
}: {
  founder: FounderRow | null;
  /** `metricValues(bundle, locale).placed` */
  placedText: string;
  t: (id: string) => string;
}) {
  if (!founder) return null;
  return (
    <figure data-testid="about-founder" className="m-0">
      <figcaption className="mb-7 flex items-center gap-5">
        <ImageSlot
          slot="founder-photo"
          src={founder.photoSrc}
          alt={founder.name}
          width={102}
          height={102}
          sizes="102px"
          className="h-[102px] w-[102px] shrink-0 rounded-pill object-cover"
        />
        <span>
          <span className="block text-card-title font-extrabold">{founder.name}</span>
          <span className="mt-1 block text-body-sm text-text-tertiary">{t(founder.titleId)}</span>
        </span>
      </figcaption>
      <blockquote className="m-0 text-body-lg leading-relaxed text-ink">
        {t('about.048')}{' '}
        <span className="font-extrabold text-blue-safe">
          {placedText} {t('about.143')}
        </span>{' '}
        {t('about.049')}
      </blockquote>
    </figure>
  );
}
```

`src/app/[locale]/(site)/about/page.tsx`:

1. Add the imports (after the `CorridorCard` import):

```tsx
import { FounderBand } from './_components/FounderBand';
import { publishedFounder } from './founder';
```

2. In `About`, after `const countries = getMetric(bundle, 'countries');`:

```tsx
  const founder = publishedFounder(bundle);
```

3. In the journey `Section`, replace the wrapper line `<div className="max-w-[720px]">` with the founder-aware grid, and mount the band as its first child:

```tsx
          <div
            className={
              founder ? 'grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center' : 'max-w-[720px]'
            }
          >
            <FounderBand founder={founder} placedText={metrics.placed} t={t} />
```

(With no published founder, the journey column stands alone at a readable width, instead of sitting in the left cell of an empty two-column grid.)

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx prettier --write "src/app/[locale]/(site)/about"
npx vitest run about/__tests__
npm run verify
```

Expected:
- **Vitest.** 5 founder, 3 FounderBand and 5 copy cases green.
- **`npm run verify`.** Green.
- **Dev render.** In `npm run dev`, `/hakkimizda` renders no `[data-testid="about-founder"]`, because the LOCAL bundle's row is unpublished. The published state is proven by `FounderBand.test.tsx`. Never publish it by editing `src/content/local/*.json`, which is generated.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/about"
git commit -m "feat(about): founder band, rendered only from a published founder row (T6 c3)

- founder.ts: publishedFounder(bundle) over the W86 founder collection (no page-local
  schema) — null today, so the claim strings about.047/048/049/143 stay unpublished; a
  malformed row throws outside production (getCollection)
- FounderBand: figure > figcaption (photo, name, t(row.titleId)) + blockquote joined from the
  package's own split around the placed metric (W1/W23); founder-photo is a named placeholder
  when the row has no photo (D26/W55); the journey column stands alone while it is null

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — offices, the `#lisans` licence block, the green closing band, the hidden newsletter block

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/about/__tests__/licence.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { LICENCE_DOCS, licenceDocHref, type LicenceDoc } from '../licence';

describe('LICENCE_DOCS (the #lisans slots, D26)', () => {
  it('names five slots — the four licence PDFs plus the company profile — each unique', () => {
    expect(LICENCE_DOCS).toHaveLength(5);
    const slots = LICENCE_DOCS.map((d) => d.slot);
    expect(new Set(slots).size).toBe(5);
    for (const slot of slots) expect(slot).toMatch(/^licence-pdf-[a-z-]+$/);
  });

  it('labels every slot from copy that exists in both locales', () => {
    for (const doc of LICENCE_DOCS) {
      if (doc.label.kind === 'sys') {
        expect(en.sys.about.licence.docs).toHaveProperty(doc.label.key);
        expect(tr.sys.about.licence.docs).toHaveProperty(doc.label.key);
      } else {
        expect(doc.label.id).toMatch(/^about\.\d{3}$/);
      }
    }
  });

  it('a filled slot is a PDF under /docs/licence/', () => {
    const filled: LicenceDoc = { ...LICENCE_DOCS[0], file: 'iskur-permit.pdf' };
    expect(licenceDocHref(filled)).toBe('/docs/licence/iskur-permit.pdf');
  });

  it('ships every slot as a placeholder today — the PDFs are a §10 row 3 owner input', () => {
    expect(LICENCE_DOCS.every((d) => licenceDocHref(d) === null)).toBe(true);
  });
});
```

`src/app/[locale]/(site)/about/__tests__/LicenceBlock.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LicenceBlock, type LicenceRow } from '../_components/LicenceBlock';

const PENDING: LicenceRow = { slot: 'licence-pdf-iskur-permit', title: 'İŞKUR permit', href: null };
const FILLED: LicenceRow = {
  slot: 'licence-pdf-company-profile',
  title: 'Company profile (PDF)',
  href: '/docs/licence/company-profile.pdf',
};
const COPY = {
  title: 'Licence and documents',
  body: 'Our permit and its supporting documents, as PDFs.',
  legal: 'İŞKUR permit No. 1730 · Tax No: 48422122',
  openLabel: 'Open PDF',
  pendingLabel: 'PDF being added',
};

describe('LicenceBlock (#lisans, D26)', () => {
  it('is the #lisans region, named by its heading, carrying the legal line verbatim', () => {
    render(<LicenceBlock {...COPY} rows={[PENDING]} />);
    const region = screen.getByRole('region', { name: 'Licence and documents' });
    expect(region).toHaveAttribute('id', 'lisans');
    expect(region).toHaveTextContent('İŞKUR permit No. 1730 · Tax No: 48422122');
  });

  it('renders a missing file as a named placeholder row, never a link (W55, D20)', () => {
    const { container } = render(<LicenceBlock {...COPY} rows={[PENDING]} />);
    const row = container.querySelector<HTMLElement>('[data-placeholder="licence-pdf-iskur-permit"]');
    expect(row).not.toBeNull();
    expect(within(row as HTMLElement).queryByRole('link')).toBeNull();
    expect(row).toHaveTextContent('PDF being added');
  });

  it('renders a supplied file as a described link and drops the placeholder mark', () => {
    const { container } = render(<LicenceBlock {...COPY} rows={[FILLED]} />);
    expect(container.querySelector('[data-placeholder]')).toBeNull();
    const link = screen.getByRole('link', { name: 'Open PDF' });
    expect(link).toHaveAttribute('href', '/docs/licence/company-profile.pdf');
    expect(link).toHaveAccessibleDescription('Company profile (PDF)');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run about/__tests__/licence.test.ts about/__tests__/LicenceBlock.test.tsx
```

Expected: both files fail to load, with `Failed to resolve import "../licence"` and `"../_components/LicenceBlock"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/about/licence.ts`:

```ts
/**
 * D26 Minimum Launchable Content: the İŞKUR licence PDFs are republished at
 * `/hakkimizda#lisans`. Legacy `/certifications` 308s to `/en/about#lisans` and
 * `/tr/certifications` to `/hakkimizda#lisans` (redirects/legacy.json). The files are a
 * §10 row 3 owner input and are not in the repo yet, so every slot renders as a named
 * `data-placeholder` row (W55), and the launch profile's content-readiness table lists them
 * until each `file` is set. To publish one, drop the PDF under `public/docs/licence/` and set
 * its `file` here; nothing else changes. The company profile joins the list because the
 * design's `/profile/company-profile.pdf` is a 410 prefix on the new site (redirects/gone.json).
 */
export type LicenceDoc = {
  /** Slot id — the `data-placeholder` value while the file is missing (W55). */
  slot: `licence-pdf-${string}`;
  /** Title copy: a `sys.about.licence.docs.<key>` message, or a package id. */
  label: { kind: 'sys'; key: string } | { kind: 'package'; id: string };
  /** File name under `public/docs/licence/`, or null while the owner has not supplied it. */
  file: string | null;
};

export const LICENCE_DOCS: readonly LicenceDoc[] = [
  { slot: 'licence-pdf-iskur-permit', label: { kind: 'sys', key: 'iskurPermit' }, file: null },
  { slot: 'licence-pdf-iskur-annex', label: { kind: 'sys', key: 'iskurAnnex' }, file: null },
  { slot: 'licence-pdf-oib-certificate', label: { kind: 'sys', key: 'oibCertificate' }, file: null },
  { slot: 'licence-pdf-oib-annex', label: { kind: 'sys', key: 'oibAnnex' }, file: null },
  { slot: 'licence-pdf-company-profile', label: { kind: 'package', id: 'about.031' }, file: null },
];

export function licenceDocHref(doc: LicenceDoc): string | null {
  return doc.file ? `/docs/licence/${doc.file}` : null;
}
```

`src/app/[locale]/(site)/about/_components/LicenceBlock.tsx`:

```tsx
import Image from 'next/image';
import { BRAND } from '@/design/assets/brand';

export type LicenceRow = { slot: string; title: string; href: string | null };

/** The `#lisans` block (D26). The design has no such block; it sits where the design's profile
 *  strip is (right under the offices, design 898–905) and carries that strip's legal line
 *  (about.108, legal-flagged, verbatim) and the İŞKUR mark (local, W14; decorative beside the
 *  heading). A slot with no file is a list item marked `data-placeholder`, never a dead link
 *  (D20/W55). Copy arrives resolved from the page, so this server component takes plain strings. */
export function LicenceBlock({
  title,
  body,
  legal,
  openLabel,
  pendingLabel,
  rows,
}: {
  title: string;
  body: string;
  legal: string;
  openLabel: string;
  pendingLabel: string;
  rows: readonly LicenceRow[];
}) {
  return (
    <section
      id="lisans"
      data-testid="about-lisans"
      aria-labelledby="lisans-title"
      className="mt-7 scroll-mt-24 rounded-base border border-border-4 bg-white p-6 sm:p-8"
    >
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <Image
          src={BRAND.iskur.src}
          width={48}
          height={48}
          alt=""
          className="h-12 w-12 shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <h2 id="lisans-title" className="m-0 text-card-title">
            {title}
          </h2>
          <p className="m-0 mt-1 text-body-sm text-text-secondary">{body}</p>
        </div>
      </div>
      <p className="m-0 mb-5 text-body-sm text-text-secondary">{legal}</p>
      <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.slot}
            data-placeholder={row.href ? undefined : row.slot}
            className="flex min-h-[52px] items-center justify-between gap-3 rounded-sm border border-border-2 bg-pale-2 px-4 py-2"
          >
            <span id={`${row.slot}-title`} className="text-body-sm font-extrabold">
              {row.title}
            </span>
            {row.href ? (
              <a
                href={row.href}
                type="application/pdf"
                aria-describedby={`${row.slot}-title`}
                className="inline-flex min-h-[44px] shrink-0 items-center text-body-sm font-extrabold text-blue-safe underline-offset-4 hover:underline"
              >
                {openLabel}
              </a>
            ) : (
              <span className="shrink-0 rounded-pill bg-tint px-3 py-1 text-body-sm font-extrabold text-blue-safe">
                {pendingLabel}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

`src/app/[locale]/(site)/about/page.tsx` — the offices, the licence block, the band and the hidden newsletter join the page. The file after this cycle, in full (it replaces the Cycle 1–3 edits one-to-one and adds the offices section):

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
import { getMetric, getOffice, type OfficeKey } from '@/content/collections';
import { BRAND } from '@/design/assets/brand';
import {
  Breadcrumbs,
  ClosingCtaBand,
  ContactCta,
  ImageSlot,
  MetricStrip,
  NewsletterBand,
  OfficeCard,
  StoreBadges,
} from '@/design/blocks';
import { buttonClassName, Eyebrow, Section, Timeline } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { CorridorCard } from './_components/CorridorCard';
import { FounderBand } from './_components/FounderBand';
import { LicenceBlock } from './_components/LicenceBlock';
import { publishedFounder } from './founder';
import { LICENCE_DOCS, licenceDocHref } from './licence';

/** W82: the page's one cross-page hash target, as an object href so next-intl localises the
 *  pathname and keeps the hash (`/isci-talebi#request-form`, `/en/hire-workers#request-form`).
 *  T2 renders the id; `DEFAULT_CTAS` points at the same place. */
const REQUEST_FORM = { pathname: '/hire-workers', hash: '#request-form' } as const;

/** Who-we-are rows (design 633–656): title id, body id. about.046 is legal-flagged (verbatim). */
const WHO_ROWS = [
  ['about.041', 'about.042'],
  ['about.043', 'about.044'],
  ['about.045', 'about.046'],
] as const;

/** Technology panel ticks (design 757–777); about.074 is the design's AI-gradient tick. */
const TECH_POINTS = ['about.071', 'about.072', 'about.073', 'about.074', 'about.075'] as const;

/** The six feature cards (design 805–836). about.082 = "…from {countries} countries…" (W1). */
const FEATURES = [
  ['about.077', 'about.078'],
  ['about.079', 'about.080'],
  ['about.081', 'about.082'],
  ['about.083', 'about.084'],
  ['about.085', 'about.086'],
  ['about.087', 'about.088'],
] as const;

/** The two offices in the design's order; every text field comes from the collection (W34). */
const OFFICE_ORDER = ['antalya', 'karachi'] as const satisfies readonly OfficeKey[];

/** The function chips per office (design 860–863 / 887–890). */
const OFFICE_CHIPS = {
  antalya: ['about.095', 'about.096', 'about.097'],
  karachi: ['about.105', 'about.106', 'about.107'],
} as const satisfies Record<OfficeKey, readonly string[]>;

/** Design image-slot ids (design 847 / 874) — named placeholders until §10 row 3 (W55). */
const OFFICE_PHOTO_SLOT = {
  antalya: 'antalya-office',
  karachi: 'karachi-office',
} as const satisfies Record<OfficeKey, string>;

/** W5/W97: the employer-updates subscription (about.141/145) stays hidden in Phase A;
 *  NewsletterBand returns null and nothing wraps it. */
const NEWSLETTER_ACTIVE = false;

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
  // The About page record carries no SEO ids (W23/W38): the sys.seo.about.* fallbacks stand.
  return buildMetadata({
    locale,
    href: '/about',
    bundle,
    pageKey: 'about',
    fallbackTitle: sys('seo.about.title'),
    fallbackDescription: sys('seo.about.description'),
  });
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const { settings } = bundle;
  // Every package id goes through makeTf: about.057/082 carry {metric} tokens after the
  // importer's re-authoring (W1), and fill() is a no-op on the rest.
  const t = makeTf(bundle, locale);
  const metrics = metricValues(bundle, locale);
  const countries = getMetric(bundle, 'countries');
  const founder = publishedFounder(bundle);
  const offices = OFFICE_ORDER.map((key) => getOffice(bundle, key));
  const licenceRows = LICENCE_DOCS.map((doc) => ({
    slot: doc.slot,
    title: doc.label.kind === 'sys' ? sys(`about.licence.docs.${doc.label.key}`) : t(doc.label.id),
    href: licenceDocHref(doc),
  }));

  return (
    <>
      {/* ============ HERO (design 515–616). §10 row 4: no hero photo on this page ("gradients
          elsewhere"), so the h1 is the LCP element (D26). The design's `about-hero` image-slot is
          not rendered: the gradient IS the Phase A design, and a placeholder behind the h1 would
          compete with it. Section padding override: accepted page-local (W-check T6(4)). */}
      <Section
        tone="dark"
        id="about-hero"
        className="relative overflow-hidden pt-8 pb-12 lg:pt-[70px] lg:pb-[88px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-navy via-navy to-blue-safe/30"
        />
        <div className="container-site relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            {/* W109: the page's own labels — about.021 "Home" / about.008 "About Us". */}
            <Breadcrumbs
              locale={locale}
              tone="dark"
              items={[
                { name: t('about.021'), href: '/' },
                { name: t('about.008'), href: '/about' },
              ]}
            />
            <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-4 mb-2 text-h1 leading-none">
              {t('about.022')} <span className="text-sky">{t('about.023')}</span>
            </h1>
            <p className="m-0 mb-4 text-body-lg font-extrabold tracking-[1.2px] text-white/70">
              {t('about.024')}
            </p>
            <p className="m-0 mb-7 max-w-[560px] text-body-lg text-white/80">{t('about.025')}</p>
            {/* Hero pills (design 532–545): the figures and labels come from the metrics
                collection (home.050 / hire.073 / home.051). The design's about.026–028 labels and
                its typed "14+"/"12+" are not read (W1: one label per metric, site-wide). */}
            <MetricStrip
              bundle={bundle}
              locale={locale}
              tone="dark"
              metrics={['placed', 'employers', 'countries']}
              className="border-t border-white/15 pt-6"
            />
            {/* Phone-only CTAs (design .ja-hero-cta-m / .ja-hero-pdf-m), CSS-hidden from lg (W10).
                The design's second button (WhatsApp, about.140 prefill) is display:none at every
                width, so it is not ported. */}
            <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
              <Link
                data-testid="about-hero-request"
                href={REQUEST_FORM}
                className={buttonClassName('primary', 'lg', 'w-full sm:w-auto')}
              >
                {t('about.029')}
              </Link>
            </div>
            <a
              href="#lisans"
              className="mt-3 inline-flex min-h-[44px] items-center text-body-sm font-extrabold text-white/80 underline underline-offset-4 lg:hidden"
            >
              {t('about.031')}
            </a>
          </div>
          <div className="relative">
            <CorridorCard
              bundle={bundle}
              t={t}
              countriesText={metrics.countries}
              countriesLabel={countries.labelId ? t(countries.labelId) : ''}
            />
            {/* İŞKUR float (design .ja-iskur-float): the local mark (W14); decorative, since
                about.035 names it. Both lines are legal-flagged and render verbatim. */}
            <div className="mt-4 flex items-center gap-4 rounded-base border border-white/20 bg-white/10 px-4 py-3 lg:absolute lg:-bottom-6 lg:left-6 lg:mt-0 lg:bg-navy lg:shadow-hero-form">
              <Image
                src={BRAND.iskur.src}
                width={40}
                height={40}
                alt=""
                className="h-10 w-10 rounded-xs bg-white object-contain p-1"
              />
              <div>
                <p className="m-0 text-body-sm font-extrabold">{t('about.035')}</p>
                <p className="m-0 text-body-sm text-white/60">{t('about.036')}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ WHO WE ARE (design 618–657) */}
      <Section tone="light" id="about-who">
        <div
          data-testid="about-who"
          className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        >
          <div className="relative mb-6 lg:mb-0">
            <ImageSlot
              slot="office-photo"
              alt={sys('about.who.photoAlt')}
              width={640}
              height={400}
              sizes="(min-width: 901px) 42vw, 100vw"
              className="rounded-lg"
            />
            <div className="absolute right-2 -bottom-6 rounded-base bg-blue-safe px-6 py-4 text-white shadow-hero-form sm:-right-4">
              <p className="m-0 text-stat leading-none font-extrabold">{sys('about.who.badgeYear')}</p>
              <p className="m-0 mt-1 text-body-sm">{t('about.037')}</p>
            </div>
          </div>
          <div>
            <Eyebrow>{t('about.038')}</Eyebrow>
            <h2 className="mt-2 mb-4 text-h2">{t('about.039')}</h2>
            {/* about.040 is legal-flagged: rendered verbatim ("13+ countries") for the WP-C review (W1). */}
            <p className="m-0 mb-7 text-body text-text-secondary">{t('about.040')}</p>
            <ol className="m-0 list-none p-0">
              {WHO_ROWS.map(([titleId, bodyId], i) => (
                <li
                  key={titleId}
                  className="flex gap-4 border-t border-border-4 py-4 last:border-b"
                >
                  <span
                    aria-hidden="true"
                    className="min-w-8 text-body font-extrabold text-blue-safe tabular-nums"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="m-0 mb-1 text-card-title">{t(titleId)}</h3>
                    <p className="m-0 text-body-sm text-text-secondary">{t(bodyId)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ============ FOUNDER + JOURNEY band (design 659–738) */}
      <Section tone="pale" id="about-journey">
        <div className="container-site">
          <div
            className={
              founder ? 'grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center' : 'max-w-[720px]'
            }
          >
            <FounderBand founder={founder} placedText={metrics.placed} t={t} />
            <div data-testid="about-journey">
              <h2 className="m-0 mb-6 text-eyebrow font-extrabold tracking-[1.5px] text-blue-safe uppercase">
                {t('about.050')}
              </h2>
              {/* W84: body is optional; the journey rows have none. about.052 is legal (verbatim);
                  about.057 = "{placed} workers placed, {employers} clients" after the importer (W1). */}
              <Timeline
                variant="vertical"
                steps={[
                  { when: t('about.051'), title: t('about.052') },
                  { when: t('about.053'), title: t('about.054') },
                  { when: sys('about.journey.m3When'), title: t('about.055') },
                  { when: t('about.056'), title: t('about.057') },
                ]}
              />
              {/* The label says "Partner with us": that intent wins over the design's stale
                  jobsadmire.com/#request-form target. */}
              <Link href="/partner-with-us" className={buttonClassName('primary', 'lg', 'mt-6')}>
                {t('about.058')}
              </Link>
            </div>
          </div>
          {/* Stats row (design .ja-stats4): placed / employers / permitDays (45 + home.206 unit).
              "98 % client retention" has no id and no signed metric, so it is dropped (W1, D17). */}
          <MetricStrip
            bundle={bundle}
            locale={locale}
            metrics={['placed', 'employers', 'permitDays']}
            className="mt-14 border-t border-tint-border pt-8"
          />
        </div>
      </Section>

      {/* ============ TECHNOLOGY (design 740–837) */}
      <Section tone="light" id="about-tech">
        <div data-testid="about-tech" className="container-site">
          <h2 className="mt-0 mb-4 text-center text-h2">{t('about.064')}</h2>
          <p className="mx-auto mt-0 mb-10 max-w-[560px] text-center text-body-lg text-text-secondary">
            {t('about.065')}
          </p>
          <div className="grid gap-10 rounded-hero border border-tint-border bg-linear-to-b from-pale-1 to-tint p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Eyebrow>{t('about.066')}</Eyebrow>
              {/* The package splits the headline around the highlighted words (W23 permits the join). */}
              <h3 className="mt-2 mb-4 text-h2">
                {t('about.067')} <span className="text-blue-safe">{t('about.068')}</span>{' '}
                {t('about.069')}
              </h3>
              <p className="m-0 mb-6 text-body text-text-secondary">{t('about.070')}</p>
              <ul className="m-0 mb-8 grid list-none gap-3 p-0">
                {TECH_POINTS.map((id) => (
                  <li key={id} className="grid grid-cols-[1.5rem_1fr] gap-2 text-body-sm">
                    <span aria-hidden="true" className="font-extrabold text-success-text">
                      {id === 'about.074' ? '✦' : '✓'}
                    </span>
                    <span>{t(id)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-4">
                {/* W12/W95: whatsapp_click page_cta; the prefill is fixed sys copy. */}
                <ContactCta
                  placement="page_cta"
                  size="lg"
                  external
                  href={waLink(settings.whatsappNumber, sys('about.whatsapp.demo'))}
                >
                  {t('about.076')}
                </ContactCta>
                {/* W8: the App Store badge renders only once settings.storeLinks.ios is a URL.
                    Default tone 'dark' = the design's dark badges on the light panel. */}
                <StoreBadges
                  bundle={bundle}
                  locale={locale}
                  android={settings.storeLinks.android}
                  ios={settings.storeLinks.ios}
                />
              </div>
            </div>
            {/* Visual (design .ja-tech-visual): hidden ≤900 px by the design, so CSS-hidden here (W10). */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-4">
              <ImageSlot
                slot="crm-dashboard"
                alt={sys('about.tech.dashboardAlt')}
                width={640}
                height={400}
                sizes="(min-width: 901px) 34vw, 1px"
                className="rounded-sm"
              />
              <ImageSlot
                slot="app-screen"
                alt={sys('about.tech.appAlt')}
                width={150}
                height={300}
                sizes="150px"
                className="w-[150px] rounded-lg"
              />
            </div>
          </div>
          <ul className="m-0 mt-8 grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([titleId, bodyId], i) => (
              <li key={titleId} className="rounded-base bg-pale-1 p-6">
                <span aria-hidden="true" className="text-body-sm font-extrabold text-blue-safe">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 mb-1 text-card-title">{t(titleId)}</h3>
                {/* Bodies are hidden ≤900 px in the design, so hidden lg:block (W10). */}
                <p className="m-0 hidden text-body-sm text-text-secondary lg:block">{t(bodyId)}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ============ OFFICES + #lisans + GREEN CTA (design 839–918: one pale section, as designed).
          W7/W34: the OfficeCard's own labelId (contact.099 "Head office" / contact.104 "Sourcing
          office") replaces the design's about.091 / about.101 caps; its tel / WhatsApp / mail
          rows are ContactLink office_card (W12) and show the collection's contacts (W6). */}
      <Section tone="pale" id="about-offices">
        <div className="container-site">
          <div data-testid="about-offices">
            <h2 className="m-0 mb-4 text-center text-h2">{t('about.089')}</h2>
            <p className="mx-auto mt-0 mb-10 max-w-[560px] text-center text-body-lg text-text-secondary">
              {t('about.090')}
            </p>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
              {offices.map((office, i) => (
                <Fragment key={office.key}>
                  {i === 1 ? (
                    <div
                      aria-hidden="true"
                      className="flex items-center gap-3 lg:flex-col lg:justify-center lg:self-stretch"
                    >
                      <span className="h-px flex-1 bg-tint-border lg:h-16 lg:w-px lg:flex-none" />
                      <span className="rounded-pill border border-tint-border bg-white px-3 py-1 text-body-sm font-extrabold text-text-secondary uppercase">
                        {t('about.100')}
                      </span>
                      <span className="h-px flex-1 bg-tint-border lg:h-16 lg:w-px lg:flex-none" />
                    </div>
                  ) : null}
                  <div data-testid={`about-office-${office.key}`}>
                    <ImageSlot
                      slot={OFFICE_PHOTO_SLOT[office.key]}
                      alt={sys('about.offices.photoAlt', { city: t(office.cityId) })}
                      width={640}
                      height={360}
                      sizes="(min-width: 901px) 44vw, 100vw"
                      className="mb-4 rounded-base"
                    />
                    <OfficeCard bundle={bundle} locale={locale} office={office}>
                      <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                        {OFFICE_CHIPS[office.key].map((id) => (
                          <li
                            key={id}
                            className="rounded-pill border border-border-2 bg-pale-1 px-3 py-1 text-body-sm font-extrabold text-text-secondary"
                          >
                            {t(id)}
                          </li>
                        ))}
                      </ul>
                    </OfficeCard>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          {/* #lisans (D26) at the design's profile-strip position; about.108 is legal (verbatim). */}
          <LicenceBlock
            title={sys('about.licence.title')}
            body={sys('about.licence.body')}
            legal={t('about.108')}
            openLabel={sys('about.licence.open')}
            pendingLabel={sys('about.licence.pending')}
            rows={licenceRows}
          />

          {/* Green band (design 907–918). W82: the primary is the object href to the Hire Workers
              request form; the WhatsApp secondary carries a fixed sys prefill (W95). */}
          <div data-testid="about-cta" className="mt-7">
            <ClosingCtaBand
              bundle={bundle}
              locale={locale}
              tone="green"
              titleId="about.110"
              bodyId="about.111"
              primary={{ label: t('about.112'), href: REQUEST_FORM, variant: 'secondary' }}
              secondary={{
                label: t('about.030'),
                href: waLink(settings.whatsappNumber, sys('about.whatsapp.consult')),
                external: true,
              }}
            />
          </div>
        </div>
      </Section>

      <NewsletterBand bundle={bundle} locale={locale} active={NEWSLETTER_ACTIVE} />
    </>
  );
}
```

Accepted deltas:
- **Body and WhatsApp on phones.** `ClosingCtaBand` renders `about.111` and the WhatsApp secondary at every width, while the design hides both at ≤900 px. `OfficeCard` likewise renders its label, city and contact rows at every width, where the design hides them at ≤900 px. These are W10-class deltas in the visitor's favour: the sentence is the offer, and the contact rows are the doors. The blocks' props stay frozen.

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx prettier --write "src/app/[locale]/(site)/about"
npx vitest run about/__tests__
npm run verify
```

Expected:
- **Vitest.** 4 licence, 3 LicenceBlock, 5 founder, 3 FounderBand and 5 copy cases green.
- **`npm run verify`.** Green.
- **Dev render.** In `npm run dev`:
  - `/hakkimizda#lisans` scrolls to the block, and `scroll-mt-24` clears the sticky header.
  - The five rows carry `data-placeholder="licence-pdf-…"`.
  - Both office cards show the collection's label, hours and contact rows.
  - The green band renders two CTAs, and there is no newsletter band in the DOM.
- **Legacy redirect.** `curl -sI http://localhost:3000/certifications | grep -i location` prints `/en/about#lisans` (308, the WP1 legacy redirect — nothing to change).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/about"
git commit -m "feat(about): offices from the collection, #lisans licence slots, green closing band (T6 c4)

- two OfficeCards (getOffice antalya/karachi; W7/W34 labels, office_card contact rows, W6) with
  named photo placeholders and the design's function chips; 'One team' divider
- LicenceBlock at #lisans (D26; legacy /certifications lands here): about.108 verbatim, local
  İŞKUR mark, five PDF slots as named data-placeholder rows, never dead links (W55) —
  licence.ts is the one place to fill when the owner's PDFs arrive
- ClosingCtaBand tone green: primary = object href /hire-workers#request-form (W82), WhatsApp
  secondary with a fixed sys prefill (W95)
- NewsletterBand active=false, unwrapped (W5/W97)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — page e2e spec and the gate run

- [ ] **Step 1: Write the failing test**

`e2e/pages/about.spec.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import tr from '../../src/messages/tr.json';

// Canonicals and JSON-LD are built from SITE_URL (the production origin), whatever host the run hits.
const ORIGIN = 'https://www.jobsadmire.com';
const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;

/** Package copy as the LOCAL bundles carry it (read, not imported — the JSON is large). */
const strings = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(__dirname, `../../src/content/local/bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;

const CASES = [
  {
    path: '/hakkimizda',
    lang: 'tr',
    alternate: '/en/about',
    requestHref: '/isci-talebi#request-form',
  },
  {
    path: '/en/about',
    lang: 'en',
    alternate: '/hakkimizda',
    requestHref: '/en/hire-workers#request-form',
  },
] as const;

const SECTION_IDS = [
  'about-corridor',
  'about-who',
  'about-journey',
  'about-tech',
  'about-offices',
  'about-lisans',
  'about-cta',
];

async function bodyText(page: Page) {
  return page.locator('body').innerText();
}

for (const { path, lang, alternate, requestHref } of CASES) {
  test.describe(`About ${path}`, () => {
    test('renders one real h1 and every section in the design order', async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      const h1 = page.locator('h1[data-testid="page-h1"]');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
      expect((await h1.innerText()).trim().length).toBeGreaterThan(3);
      expect(await bodyText(page)).not.toMatch(LEAK);
      const order = await page.evaluate(
        (ids) =>
          Array.from(document.querySelectorAll(ids.map((id) => `[data-testid="${id}"]`).join(','))).map(
            (el) => el.getAttribute('data-testid'),
          ),
        SECTION_IDS,
      );
      expect(order).toEqual(SECTION_IDS);
    });

    test('the headline numbers come from the metrics collection (W1)', async ({ page }) => {
      await page.goto(path);
      const text = await bodyText(page);
      expect(text).toContain('470+');
      expect(text).toContain('22+');
      // the design's unsigned figures never render
      expect(text).not.toContain('14+');
      expect(text).not.toContain('12+');
      expect(text).not.toMatch(/98\s?%|%\s?98/);
    });

    test('founder and newsletter render nothing (W86, W97); #lisans carries five named slots (D26)', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.getByTestId('about-founder')).toHaveCount(0);
      await expect(page.locator('[data-placeholder="founder-photo"]')).toHaveCount(0);
      await expect(page.locator('#newsletter')).toHaveCount(0);
      const lisans = page.locator('#lisans');
      await expect(lisans).toHaveCount(1);
      const slots = await lisans
        .locator('[data-placeholder]')
        .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder')));
      expect(slots).toHaveLength(5);
      for (const s of slots) expect(s).toMatch(/^licence-pdf-/);
      await expect(lisans.locator('a')).toHaveCount(0);
      // no placeholder is the LCP element, and none is unnamed (D26, W55)
      await expect(page.locator('[data-placeholder][data-lcp-slot]')).toHaveCount(0);
      await expect(page.locator('[data-placeholder=""]')).toHaveCount(0);
      await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    });

    test('both offices render from the collection with their contact rows', async ({ page }) => {
      await page.goto(path);
      for (const key of ['antalya', 'karachi']) {
        const card = page.getByTestId(`about-office-${key}`);
        await expect(card.locator('article')).toHaveCount(1);
        await expect(card.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
        await expect(card.locator('a[href^="mailto:"]')).toHaveCount(1);
        await expect(card.locator('a[href^="tel:"]')).toHaveCount(1);
      }
    });

    test('canonical, hreflang and a BreadcrumbList that names the page with about.008 (W109)', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}${path}`);
      await expect(page.locator(`link[hreflang="${lang === 'tr' ? 'en' : 'tr'}"]`)).toHaveAttribute(
        'href',
        `${ORIGIN}${alternate}`,
      );
      const graphs = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((els) => els.map((el) => el.textContent ?? ''));
      const breadcrumb = graphs.find((g) => g.includes('"BreadcrumbList"'));
      expect(breadcrumb).toBeDefined();
      expect(breadcrumb).toContain(`${ORIGIN}${path}`);
      expect(breadcrumb).toContain(JSON.stringify(strings(lang)['about.008']));
      // no page-level Organization node: the layout's site-wide one carries the licence ids
      expect(graphs.filter((g) => g.includes('"EmploymentAgency"'))).toHaveLength(1);
    });

    test('both request-workers CTAs keep the localized #request-form hash (W82)', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.getByTestId('about-hero-request')).toHaveAttribute('href', requestHref);
      await expect(
        page.getByTestId('about-cta').locator(`a[href="${requestHref}"]`),
      ).toHaveCount(1);
    });

    test('the language switch keeps the visitor on About', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'the switcher sits in the hamburger on mobile');
      await page.goto(path);
      // Header and footer both carry the switcher group; the header's comes first.
      const group = page.getByRole('group', { name: /Language|Dil/ }).first();
      await group.getByRole('link', { name: lang === 'tr' ? 'English' : 'Türkçe' }).click();
      await expect(page).toHaveURL(new RegExp(`${alternate.replace(/\//g, '\\/')}$`));
      await expect(page.locator('h1[data-testid="page-h1"]')).toHaveCount(1);
    });
  });
}

test('the demo CTA carries a fixed prefill and pushes whatsapp_click page_cta (W12/W95)', async ({
  page,
  context,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport proves the click contract');
  await context.route('https://wa.me/**', (route) => route.abort());
  await page.goto('/hakkimizda');
  const demo = page.getByTestId('about-tech').locator('a[href^="https://wa.me/"]');
  await expect(demo).toHaveCount(1);
  await expect(demo).toHaveAttribute(
    'href',
    `https://wa.me/905011240340?text=${encodeURIComponent(tr.sys.about.whatsapp.demo)}`,
  );
  await expect(demo).toHaveAttribute('target', '_blank');
  const popup = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
  await demo.click();
  await (await popup)?.close();
  const events = await page.evaluate(
    () => (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? [],
  );
  const clicks = events.filter((e) => e.event === 'whatsapp_click');
  expect(clicks).toHaveLength(1);
  expect(clicks[0]).toMatchObject({ placement: 'page_cta', page: '/hakkimizda', locale: 'tr' });
});

test('legacy /certifications and /tr/certifications land on the #lisans block (D26)', async ({
  page,
}) => {
  for (const [from, pathname] of [
    ['/certifications', '/en/about'],
    ['/tr/certifications', '/hakkimizda'],
  ] as const) {
    await page.goto(from);
    const url = new URL(page.url());
    expect(url.pathname).toBe(pathname);
    expect(url.hash).toBe('#lisans');
    await expect(page.locator('#lisans')).toHaveCount(1);
  }
});
```

- [ ] **Step 2: Run to verify it fails**

This proves the spec can fail without stashing (the shared stash is off-limits). Run it against the previous task's preview, T5's, whose URL is in T5's WP2b ledger row. That preview has no About page: `/hakkimizda` answers 404 through `[...rest]`. The W91 bypass header is sent by `playwright.config.ts`:

```bash
E2E_BASE_URL=https://<T5-preview>.vercel.app npx playwright test e2e/pages/about.spec.ts --project=desktop
```

Expected: every case fails. The per-locale cases fail at the 200 / `page-h1` / test-id assertions; the demo case fails at `toHaveCount(1)`; the legacy case fails at `#lisans` (the redirect lands on a 404 page).

- [ ] **Step 3: Implement**

Nothing new to add: this cycle's product is the spec plus the gate evidence. If a case fails against this branch, fix the page, never the spec. The page's section test ids are `about-corridor`, `about-who`, `about-journey`, `about-tech`, `about-offices`, `about-office-{antalya,karachi}`, `about-lisans` (+ `id="lisans"`), `about-cta` and `about-hero-request`; `about-founder` is absent in Phase A.

- [ ] **Step 4: Run tests + `npm run verify`**

1. `npx prettier --write e2e/pages/about.spec.ts && npm run verify` → green (the spec is type-checked and linted).
2. Run one heavy job at a time. Start the build with `npm run build && npm run start` in one terminal. Then, in another:

   ```bash
   E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/about.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts
   ```

   Expected: green on both projects.
   - Axe: zero violations on `/hakkimizda` and `/en/about`.
   - Width sweep: no horizontal overflow at any width, incl. 900/901. The three layouts to watch are the `lg:grid-cols-[1fr_auto_1fr]` offices row, the tech panel and the hero's İŞKUR float.
3. `E2E_BASE_URL=http://localhost:3000 npm run gate`. This is the local profile, where LCP is a warning (R50). Lighthouse on the two new indexable routes must show:
   - performance ≥ 0.95;
   - a11y, best-practices and SEO = 1.0;
   - `resource-summary:script:size` ≤ 204,800 B.

   `npm run js-size` then prints the two rows for the ledger. Expect within a few hundred bytes of the shell: the page ships no client chunk of its own, and `ContactLink`, `Stat` and next-intl `Link` are already in the shell graph. A route over 194,560 B (the lazy line) is a stop: find the chunk before T7 starts (W13 amended).
4. Push `wp2/foundation` (never `main`). The branch preview builds with `npm run verify` and is door-less (W92). This page has no door, so no `staging` run is needed. Then run:

   ```bash
   E2E_BASE_URL=https://<this-preview>.vercel.app npm run gate
   ```

   `gate.sh` selects `lighthouserc.preview.json` (no `is-crawlable` audit on a preview, W91) and passes the bypass header to Playwright and `lhci collect`. This run is the binding one (R50); record its triple and `js-size` rows in the ledger (Cycle 6).

- [ ] **Step 5: Commit**

```bash
git add e2e/pages/about.spec.ts
git commit -m "test(about): page e2e — section order, metric source, hidden founder/newsletter, #lisans slots, offices, SEO + about.008 crumb, #request-form hrefs, language switch, demo click, legacy /certifications (T6 c5)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 6 — docs and the ledger row

- [ ] **Step 1: Write the failing test**

Docs cycle: no unit test. The check is `npm run format` (Prettier over the Markdown tables) inside `npm run verify`, plus re-reading every claim against the page.

- [ ] **Step 2: Run to verify it fails**

n/a.

- [ ] **Step 3: Implement**

All five edits follow W45/W98: they anchor on sentences and headings, never line numbers, and build on the text T1–T5 left.

`docs/SEO.md` — append one row as the last row of the table under the `## Pages` heading (T1 created it; the columns are Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes):

```markdown
| About | `/hakkimizda` · `/en/about` | `sys.seo.about.{title,description}` — the page record's `titleId`/`descriptionId` are `''` (W23/W38); OG image `/og/{locale}/about.png` | `absoluteUrl(locale, '/about')`; tr/en + x-default = tr | `BreadcrumbList` (Home → About Us from the page's own `about.021`/`about.008`, W109) via `Breadcrumbs`; no page-level node — the site-wide `Organization`/`EmploymentAgency` carries the licence ids | `h1` (`data-lcp-slot="h1"`): navy gradient hero, no photo (spec §10 row 4 "gradients elsewhere"); the design's `about-hero` slot is not rendered | `#lisans` licence block (D26): legacy `/certifications` 308 → `/en/about#lisans`, `/tr/certifications` → `/hakkimizda#lisans`; five named PDF placeholder slots until §10 row 3 |
```

`docs/ANALYTICS.md` — append one bullet as the last bullet of the list under the `### Page instrumentation (WP2b)` heading:

```markdown
- **About (`/hakkimizda`, `/en/about`, T6):** no page event (W12). `whatsapp_click` with `placement: 'page_cta'` from the technology panel's "Book a demo →" (prefill `sys.about.whatsapp.demo`) and the closing band's WhatsApp button (prefill `sys.about.whatsapp.consult`), both through `ContactCta`; `call_click` / `whatsapp_click` / `email_click` with `placement: 'office_card'` from the two `OfficeCard`s. The hero's phone-only and the band's "Request workers" CTAs are internal links to `/hire-workers#request-form` and fire nothing. Every prefill is fixed copy — no visitor data in any href (W76/W95).
```

`docs/CONTENT-MODEL.md` — append one bullet as the last bullet of the per-page list under the `### Adding copy (W9, W23, W54)` heading:

```markdown
- **About (`sys.about.*`, WP2b T6):**
  - `about.who.{badgeYear,photoAlt}`, `about.journey.m3When`, `about.tech.{dashboardAlt,appAlt}`, `about.offices.photoAlt` (ICU `{city}`).
  - `about.licence.{title,body,pending,open}` and `about.licence.docs.{iskurPermit,iskurAnnex,oibCertificate,oibAnnex}`: working titles for the D26 PDF slots, renamed when the owner's files arrive.
  - `about.whatsapp.{demo,consult}`: the design's two literal prefills.
  - `seo.about.{title,description}`: the package has no SEO strings for About.
  - `badgeYear` ("2024") and `m3When` ("2025") are the design's markup-only dated labels, listed for the D17 dated-claim review.
  - The page reads the founder only through `publishedFounder` over the W86 `founder` collection, and renders nothing while the row is unpublished.
  - It never reads the design's stat labels `about.026`–`028`/`059`–`063`, the "+ countries" suffix `about.142` (W1: exact 13), the founder placeholder `about.144` or the subscription `about.141`/`145` (W5). `copy.test.ts` pins this.
```

`docs/PRD.md` — find the §10 bullet "Founder name/title, founder/office photo, licence PDFs — **pending §10 item 3**." and append this sentence to it, after that text and on the same line:

```markdown
 As built (WP2b T6): the About page renders the founder band only from a published `founder` row (W86 — the importer ships `published: false`), keeps the office/founder photo slots as named placeholders, and ships the `#lisans` block with five named PDF placeholder slots — `src/app/[locale]/(site)/about/licence.ts` is the one file to edit when the PDFs arrive (drop them under `public/docs/licence/`).
```

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append to the ledger table (T1's row format, W98). Fill the `<…>` values from `npm run js-size` and the binding preview run of Cycle 5:

```markdown
| T6 About | `/hakkimizda` · `/en/about` | script gz: `/hakkimizda` <n> B · `/en/about` <n> B (ceiling 204,800; lazy line 194,560) | LH mobile: perf <x.xx> · LCP <n> ms · CLS <n> (both routes; a11y/bp/SEO 1.0) | pixel: n/a — not a D27 harness page (side-by-side review); named deltas: gradient hero (no `about-hero` photo), metric labels from the collection (about.026–028/059–063 not read), "14+"/"12+"/"98 %"/"13+ countries" pill dropped (W1), founder band hidden (W86), hero WhatsApp button not ported (hidden at every width in the design), journey CTA → /partner-with-us, #lisans block added (D26), office cards via OfficeCard (W7 labels; label/contact rows visible on phones), green band body + WhatsApp visible on phones, static corridor lanes (D20) | <date> |
```

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx prettier --write docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run verify
```

Expected: green, with Prettier accepting the tables and no code changed. Re-read the five doc diffs once against the page: every claim in them must be something Cycles 1–5 render or prove.

- [ ] **Step 5: Commit**

```bash
git add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(about): SEO page row, analytics bullet, sys.about bullet, founder/licence status, ledger (T6 c6)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** each edit anchors on a sentence or heading (W45/W98).
- `docs/SEO.md` — one row appended as the last row of the table under `## Pages` (T1's 7-column table).
- `docs/ANALYTICS.md` — one bullet appended to the list under `### Page instrumentation (WP2b)`.
- `docs/CONTENT-MODEL.md` — one bullet appended to the per-page list under `### Adding copy (W9, W23, W54)`.
- `docs/PRD.md` — one "As built" sentence appended to the §10 bullet that reads "Founder name/title, founder/office photo, licence PDFs — **pending §10 item 3**.".
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T6 ledger row in T1's format.

`docs/INTEGRATIONS.md` and `docs/ARCHITECTURE.md` are untouched: there is no door form and no new pattern.

**Sys keys added:** 18, identical in `src/messages/tr.json` and `src/messages/en.json` and pinned by `copy.test.ts`. None of them exists at HEAD.
- `sys.seo.about.title`, `sys.seo.about.description`
- `sys.about.who.badgeYear`, `sys.about.who.photoAlt`
- `sys.about.journey.m3When`
- `sys.about.tech.dashboardAlt`, `sys.about.tech.appAlt`
- `sys.about.offices.photoAlt`
- `sys.about.licence.title`, `sys.about.licence.body`, `sys.about.licence.pending`, `sys.about.licence.open`
- `sys.about.licence.docs.iskurPermit`, `sys.about.licence.docs.iskurAnnex`, `sys.about.licence.docs.oibCertificate`, `sys.about.licence.docs.oibAnnex`
- `sys.about.whatsapp.demo`, `sys.about.whatsapp.consult`

Existing sys keys read only through foundation blocks: `sys.whatsapp.prefill` (`OfficeCard`; present in both files at HEAD) and `sys.nav.breadcrumbs` (`Breadcrumbs`; WP2a Task 5).

**Package ids used:** 74 `about.*` ids read directly by the page folder, all verified present in `src/content/local/catalogue.json` and in both locale bundles:
- `about.008`, `about.021`, `about.022`–`025`, `about.029`–`046`, `about.048`, `about.049`, `about.050`–`058`, `about.064`–`090`, `about.095`–`097`, `about.100`, `about.105`–`108`, `about.110`–`112`, `about.143`.
- `about.048`/`049`/`143` render only with a published founder.
- `about.030` is the band's WhatsApp label; `about.031` is the hero PDF link and the company-profile slot title.
- Legal-flagged and rendered verbatim: `about.035`, `036`, `040`, `046`, `052`, `108`.
- Carrying W1 tokens (through `makeTf`): `about.057` `{placed}`/`{employers}` and `about.082` `{countries}`.

Read through data rather than by literal:
- `about.047`, the founder row's `titleId` (W86; rendered only once published);
- the metric labels/unit `home.050`, `hire.073`, `home.051`, `home.052`, `home.206` (`MetricStrip`, and the corridor pill's `home.051`);
- the office ids `contact.096`/`097`/`099`/`104`/`133`/`134`/`105`/`103`/`100`/`106` plus `home.192`/`home.221` (`OfficeCard`);
- `hire.240` (`StoreBadges`).

Deliberately not rendered:
- `about.001`–`007`, `009`–`020`, `113`–`138` — chrome/footer copy (R15);
- `about.026`–`028` and `about.059`–`063` — the design's stat labels (W1);
- `about.091`–`094`, `about.101`–`104` — office caps, city and address, superseded by `OfficeCard` (W7/W34);
- `about.098`, `about.099` — the card's own WhatsApp and directions rows;
- `about.109` — "Download Company Profile →"; the profile is a `#lisans` slot until its file exists;
- `about.139` — the rotation country list; the `sourceCountries` collection replaces it;
- `about.140` — the WhatsApp prefill of a design button hidden at every width;
- `about.141`/`145` — the subscription (W5);
- `about.142` — "+ countries" (W1);
- `about.144` — the "Founder Name" placeholder.

**Foundation gaps:** none. The earlier draft's four are closed:
- the band/hero hash CTA by W82;
- the founder source by W86;
- the empty timeline bodies by W84;
- the Section padding override by the accepted page-local `className`, since Tailwind v4 orders `pt-`/`pb-` after `py-`.

Two accepted page-local deltas remain, with block props frozen: `ClosingCtaBand` shows its body and WhatsApp secondary on phones, and `OfficeCard` shows its label and contact rows on phones.

**Ledger line spec:**

```
| T6 About | `/hakkimizda` · `/en/about` | script gz: `/hakkimizda` <n> B · `/en/about` <n> B (ceiling 204,800; lazy line 194,560) | LH mobile: perf <x.xx> · LCP <n> ms · CLS <n> (both routes; a11y/bp/SEO 1.0) | pixel: n/a — not a D27 harness page (side-by-side review); named deltas: … (Cycle 6) | <date> |
```

- **Script sizes.** From `npm run js-size` after the binding preview gate.
- **Lighthouse triple.** From that same preview run: `lighthouserc.preview.json` with the W91 bypass header, R50.
- **Pixel.** n/a: About is not one of the four D27 harness pages.
