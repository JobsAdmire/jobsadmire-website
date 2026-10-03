### Task 6: About (`/hakkimizda`, `/en/about`)

The company page: hero on a navy gradient (§10 row 4 — no hero photo for this page, the `h1` is the LCP element), three headline metrics from the `metrics` collection, "Who we are", the founder band (hidden until a `founder` row is published — W6 / §10 row 3), the journey timeline, the four-stat row (three signed metrics — the design's "98 % retention" has no signed source and is dropped, W1/D17), the technology panel with the store badges, the two offices from the `offices` collection, the `#lisans` licence block with five named PDF placeholder slots (D26; legacy `/certifications` redirects here), the green closing band, and the employer-updates newsletter block rendered hidden (W5). **No forms** on this page (the design has none; the orphaned `subscribeEmployer` mailto handler is dead code, W5) — so no `actions.ts`, no catalog fields, no fallback panel. **No client islands of its own** (W13): the only client code on the page is the foundation's `ContactLink` (through `ContactCta`/`OfficeCard`) and the `Stat` count-up inside `MetricStrip`, both already in the shell's graph.

Rulings applied: W1 (numbers from `metrics`; `about.057/061/082` are re-authored with `{placed}/{employers}/{permitDays}/{countries}` by the importer, `about.040` is legal-flagged and renders verbatim — every package id on this page goes through `makeTf`), W5 (newsletter hidden), W6 (founder band hidden; no invented Pakistani number — `getOffice('karachi')` publishes what the collection carries), W7 (Karachi = "Sourcing office": the `OfficeCard`'s own `labelId` wins over the design's `about.101` cap), W9/W23 (id-less copy under `sys.about.*`, `sys.seo.about.*`), W10 (the design's ≤900 px removals — tech visual, feature-card bodies, office contact rows, the green band's paragraph — are `hidden lg:block`, never conditional rendering), W12 (contact clicks only: `page_cta` / `office_card`; no page event), W13 amended (page adds no client chunk), W17 (`/about` has no `CTA_BY_PATHNAME` entry → `DEFAULT_CTAS`; nothing to render for the header), W19 (`(site)` group), W20 (`'/about'` leaves `UNBUILT_PATHNAMES`), W21 (two rows in `e2e/routes.ts`), D26 (`data-lcp-slot="h1"` on the `h1`; every unshipped image slot is a named `data-placeholder`), D27 (not a pixel-harness page — side-by-side review).

**Files:**

Create
- `src/app/[locale]/(site)/about/page.tsx` — the page (server component)
- `src/app/[locale]/(site)/about/founder.ts` — `FounderSchema`, `getFounder(bundle)` (the "settings flag": a published `founder` row)
- `src/app/[locale]/(site)/about/licence.ts` — `LICENCE_DOCS` (the five PDF slots) + `licenceDocHref`
- `src/app/[locale]/(site)/about/_components/CorridorCard.tsx` — the hero's sourcing-corridor card (server component; the design's 2.5 s lane rotation is not ported — static first four lanes, CSS fly-dots under the global reduced-motion rule, D20)
- `src/app/[locale]/(site)/about/_components/FounderBand.tsx` — returns `null` until `getFounder` yields a row (W6)
- `src/app/[locale]/(site)/about/_components/LicenceBlock.tsx` — the `#lisans` section
- `src/app/[locale]/(site)/about/__tests__/founder.test.ts`
- `src/app/[locale]/(site)/about/__tests__/licence.test.ts`
- `src/app/[locale]/(site)/about/__tests__/sys-keys.test.ts`
- `e2e/pages/about.spec.ts`

Modify
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES` literal (the `'/about',` line inside the `new Set<keyof typeof pathnames>([ … ])` initialiser Task 4 wrote — lines 328–350 of Task 4's file; delete the one line)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE` (lines 215–222 as Task 7 wrote it; two rows appended after `'/en/hire-workers'`)
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.about.{title,description}` inside the existing `seo` object (Task 4 created it with `ogTagline`); new `sys.about.*` block
- `src/app/globals.css` — one `@keyframes ja-fly` + `.about-fly` rule appended after the `.marquee-toggle` block (last lines of the file)
- `docs/SEO.md` — page row; `docs/ANALYTICS.md` — About wiring line; `docs/CONTENT-MODEL.md` — `sys.about.*` line; `docs/PRD.md` line 97 (the "Founder name/title … licence PDFs — pending §10 item 3" bullet)

Test
- `src/app/[locale]/(site)/about/__tests__/{founder,licence,sys-keys}.test.ts` (Vitest — matched by the existing `src/**/*.test.{ts,tsx}` include)
- `src/lib/seo/unbuilt.test.ts` (Task 4's, unchanged — it is the red→green test of cycle 1)
- `e2e/pages/about.spec.ts` (Playwright, both projects), plus the existing loops in `e2e/routing.spec.ts` (page contract), `e2e/seo.spec.ts` (canonical/hreflang/sitemap), `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` — all pick the two new routes up from `e2e/routes.ts`

**Interfaces:**

Consumes (WP2a, exactly as `produces-final.md` spells them):
- `src/content/collections.ts` — `getCollection(bundle, 'sourceCountries')` (13 `SourceCountry` rows, `name` locale-resolved, `code` upper-case ISO2), `getOffice(bundle, 'antalya' | 'karachi')` (`Office`: `cityId`, `labelId`, `addressId`, `addressLine2Id`, `hoursId`, `phone`, `whatsapp`, `email`, `mapUrl`), `CollectionError`, `PAGE_KEYS` entry `'about'`
- `src/content/pure.ts` (via `@/content/adapter`, which `export *`s it) — `makeTf(bundle, locale)`, `metricValues(bundle, locale)` (`{ placed: '470+', employers: '22+', countries: '13', permitDays: '45', … }`)
- `src/design/blocks` barrel — `Breadcrumbs({ locale, items: Crumb[] })`, `ClosingCtaBand({ bundle, locale, titleId, bodyId?, primary: Cta, secondary?: Cta, tone: 'green', id? })`, `ContactCta({ placement: 'page_cta', href, variant?, size?, external?, className?, children })`, `ImageSlot({ slot, alt, width, height, src?, lcp?, sizes?, className? })`, `MetricStrip({ bundle, locale, metrics: MetricKey[], tone?, className? })`, `NewsletterBand({ bundle, locale, active })`, `OfficeCard({ bundle, locale, office, children? })`, `StoreBadges({ bundle, locale, android, ios?, tone? })`
- `src/design/primitives` barrel — `Section({ tone: 'light' | 'dark' | 'pale' | 'band', id?, className? })`, `Timeline({ steps: TimelineStep[], variant?: 'vertical' | 'horizontal' })` with `TimelineStep = { when?, title, body }`, `Eyebrow`, `buttonClassName(variant, size?, className?)`
- `src/design/assets/brand.ts` — `BRAND.iskur` (`/brand/iskur.png`, 320×320)
- `src/design/Flag.tsx` — `Flag({ code: FlagCode, size?, label? })`; `src/design/assets/flag-codes.ts` — `isFlagCode(code)`
- `src/lib/seo/metadata.ts` — `buildMetadata({ locale, href, bundle, pageKey: 'about', fallbackTitle, fallbackDescription })` (W38: the `about` page record has `titleId: ''` → the fallbacks are used; OG image = `pageOgImageUrl(locale, 'about')`)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES` (delete `'/about'`); `src/lib/seo/unbuilt.test.ts` (the walker)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`
- `src/test/bundle.ts` — `testBundle(overrides)`
- `src/app/[locale]/(site)/layout.tsx` — the default-chrome group (W19); the page renders no `<main>` (R31)
- Route groups: `dev/gallery` is at `src/app/[locale]/(site)/dev/gallery/` — irrelevant here except that the contract import depth from this page folder is **five** levels (`'../../../../../contract/website-bundle.v1'`)

Consumes (WP1, read from the code at `ad58fb8`):
- `getBundle` (`@/content/adapter`, `server-only`, React-`cache`d); `makeT` is NOT used on this page (every id may carry a `{metric}` token → `makeTf`)
- `Link` from `@/i18n/navigation` (object hrefs `{ pathname: '/hire-workers', hash: '#request-form' }` are the only way to carry a hash across locales — a string `'/isci-talebi#request-form'` would be re-prefixed to `/en/isci-talebi…` on EN by next-intl's `applyPathnamePrefix`, verified in `node_modules/next-intl/dist/esm/development/navigation/shared/createSharedNavigationFns.js`)
- `routing`, `Locale` (`@/i18n/routing`); `waLink` (`@/lib/contact`); `getTranslations`/`setRequestLocale` (`next-intl/server`); `hasLocale` (`next-intl`)
- `sys.home` ("Home"/"Ana Sayfa") is NOT used for the crumb — the package carries `about.021`; `sys.whatsapp.prefill` for the hero WhatsApp CTA (the site-wide prefill), `sys.marquee.*` unused (no marquee here)
- Tailwind theme tokens in `src/app/globals.css`: `bg-navy`, `bg-pale-1`, `text-blue-safe`, `border-tint-border`, `from-tint to-sky`, `rounded-hero` (24 px), `rounded-lg` (20 px), `rounded-base` (16 px), `text-h2`, `text-body`, `text-body-sm`, `text-card-title`, `text-eyebrow`, `container-site`; breakpoints `sm 561`, `md 701`, `lg 901`

Produces: nothing another task consumes. (The `founder` collection shape defined in `founder.ts` is the shape the importer/CMS emits when §10 row 3 lands — recorded in `docs/CONTENT-MODEL.md`; T15 reads the SEO/ANALYTICS rows.)

---

#### Cycle 1 — route skeleton, metadata, hero, gate registration

- [ ] **Step 1: Write the failing test**

The failing test already exists: `src/lib/seo/unbuilt.test.ts` (Task 4) walks `src/app/[locale]/**/page.tsx` and fails when `UNBUILT_PATHNAMES` and the filesystem disagree. Make it fail by deleting the page's key first.

`src/lib/seo/routes.ts` — inside the `UNBUILT_PATHNAMES` initialiser, delete the single line:

```ts
  '/about',
```

Also add the two gate rows now so the SEO/routing/a11y/width loops cover the page from the first build. `e2e/routes.ts`, `GATE_ROUTE_TABLE` — after the `{ path: '/en/hire-workers', indexable: true },` row insert:

```ts
  { path: '/hakkimizda', indexable: true },
  { path: '/en/about', indexable: true },
```

And the SEO fallback copy (W23: the package has no `<title>`/description for About; the page record's `titleId` is `''`). `src/messages/en.json` — inside the existing `"seo": { "ogTagline": … }` object add:

```json
    "seo": {
      "ogTagline": "…(unchanged)…",
      "about": {
        "title": "About JobsAdmire — İŞKUR-licensed private employment agency in Antalya",
        "description": "JobsAdmire is an İŞKUR-licensed private employment agency in Antalya, Türkiye. We recruit skilled overseas workers for employers across Türkiye and handle every work permit — with offices in Antalya and Karachi."
      }
    },
```

`src/messages/tr.json`:

```json
    "seo": {
      "ogTagline": "…(unchanged)…",
      "about": {
        "title": "Hakkımızda — JobsAdmire, Antalya merkezli İŞKUR lisanslı özel istihdam bürosu",
        "description": "JobsAdmire, Antalya'da faaliyet gösteren İŞKUR lisanslı bir özel istihdam bürosudur. Türkiye genelindeki işverenler için nitelikli yabancı işçi temin ediyor ve her çalışma iznini biz yürütüyoruz — Antalya ve Karaçi ofislerimizle."
      }
    },
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run src/lib/seo/unbuilt.test.ts` → 1 failure: `'/about'` is not in `UNBUILT_PATHNAMES` but `src/app/[locale]/(site)/about/page.tsx` does not exist. (`e2e/routes.ts` and the messages are not yet exercised.)

- [ ] **Step 3: Implement**

`src/app/globals.css` — append after the closing brace of the `.marquee-toggle { display: none; }` media block (the end of the file):

```css
/* About hero corridor card: a dot travelling along each lane (design `ja-fly`). Stopped by the
   global reduced-motion rule above (D20) — the design gave this one animation no override. */
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
    left: calc(100% - 10px);
    opacity: 0;
  }
}
.about-fly {
  animation: about-fly 2.6s ease-in-out infinite;
}
```

`src/app/[locale]/(site)/about/_components/CorridorCard.tsx`:

```tsx
import { getCollection } from '@/content/collections';
import { Flag } from '@/design/Flag';
import { isFlagCode } from '@/design/assets/flag-codes';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The design rotates four lanes through the country list every 2.5 s and lets a dot fly
 *  along each (`ja-fly`). The rotation is not ported: it is the one animation on the page with
 *  no reduced-motion override, it would need a live-region-safe island, and it adds nothing a
 *  visitor can act on (D20, W13). The first four sourcing countries stand still; the dots keep
 *  the motion (CSS only, stopped under reduced motion). */
const LANES = 4;

export function CorridorCard({
  bundle,
  locale,
  t,
  countriesText,
}: {
  bundle: Bundle;
  locale: Locale;
  /** `makeTf(bundle, locale)` from the page. */
  t: (id: string) => string;
  /** `metricValues(bundle, locale).countries` — the W1 figure, never the list length. */
  countriesText: string;
}) {
  void locale; // rows are already locale-resolved by the adapter; kept for symmetry with blocks
  const lanes = getCollection(bundle, 'sourceCountries').slice(0, LANES);
  return (
    <div
      data-testid="about-corridor"
      className="rounded-hero border border-white/15 bg-white p-6 text-ink shadow-hero-form sm:p-8"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-card-title">{t('about.032')}</h2>
        {/* about.142 is the package's own "+ countries" suffix fragment: the figure is data (W1). */}
        <span className="rounded-pill bg-tint px-3 py-1 text-body-sm font-extrabold text-blue-safe">
          {countriesText}
          {t('about.142')}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <ul className="m-0 grid list-none gap-3 p-0">
          {lanes.map((c) => (
            <li key={c.code} className="grid grid-cols-[auto_1fr] items-center gap-3">
              <span className="flex items-center gap-2 text-body-sm font-extrabold">
                {isFlagCode(c.code) ? <Flag code={c.code} size={18} /> : null}
                {c.name}
              </span>
              <span className="relative block h-[2px] rounded-pill bg-border-1" aria-hidden="true">
                <span className="about-fly absolute top-[-3px] h-2 w-2 rounded-pill bg-blue-safe" />
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

`src/app/[locale]/(site)/about/page.tsx` (cycle 1 version — the hero only; later cycles append sections in the design's order):

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
import { BRAND } from '@/design/assets/brand';
import { Breadcrumbs, ContactCta, MetricStrip } from '@/design/blocks';
import { buttonClassName, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { CorridorCard } from './_components/CorridorCard';

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
  // The About page record carries no SEO ids (W23/W38) — the sys.seo.about.* fallbacks stand.
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
  // Every package id on this page goes through makeTf: about.057/061/082 carry {metric} tokens
  // after the importer's re-authoring (W1), and fill() is a no-op on the rest.
  const t = makeTf(bundle, locale);
  const metrics = metricValues(bundle, locale);
  const { settings } = bundle;

  return (
    <>
      {/* ============ HERO (design 515–616). §10 row 4: no hero photo on this page — a navy
          gradient, and the h1 is the LCP element (D26). The design's `about-hero` image-slot is
          therefore not rendered as a placeholder: the gradient IS the Phase A design. */}
      <Section tone="dark" id="about-hero" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy to-[#0a1428]"
        />
        <div className="container-site relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Breadcrumbs
              locale={locale}
              tone="dark"
              items={[
                { name: t('about.021'), href: '/' },
                { name: t('home.001'), href: '/about' },
              ]}
            />
            <h1 data-testid="page-h1" data-lcp-slot="h1" className="text-h1 mt-6 mb-3 leading-none">
              {t('about.022')} <span className="text-sky">{t('about.023')}</span>
            </h1>
            <p className="text-eyebrow m-0 mb-4 font-extrabold uppercase tracking-[1.6px] text-sky">
              {t('about.024')}
            </p>
            <p className="text-body-lg m-0 mb-8 max-w-[560px] text-white/80">{t('about.025')}</p>
            {/* Hero pills (design 532–541): the three figures come from the metrics collection —
                labels are the collection's own labelIds (home.050 / hire.073 / home.051), so the
                design's about.026–028 labels are not read (W1: one label per metric, site-wide). */}
            <MetricStrip
              bundle={bundle}
              locale={locale}
              tone="dark"
              metrics={['placed', 'employers', 'countries']}
              className="border-t border-white/15 pt-6"
            />
            {/* Mobile-only CTAs (design .ja-hero-cta-m / .ja-hero-pdf-m) — W10: CSS-hidden, in the DOM. */}
            <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
              <Link
                href={{ pathname: '/hire-workers', hash: '#request-form' }}
                className={buttonClassName('primary', 'lg')}
              >
                {t('about.029')}
              </Link>
              <ContactCta
                placement="page_cta"
                variant="inverse"
                size="lg"
                external
                href={waLink(settings.whatsappNumber, sys('whatsapp.prefill'))}
              >
                {t('about.030')}
              </ContactCta>
            </div>
            <a
              href="#lisans"
              className="mt-4 inline-block text-body-sm font-extrabold text-white/80 underline-offset-4 hover:underline lg:hidden"
            >
              {t('about.031')}
            </a>
          </div>
          <div className="relative">
            <CorridorCard bundle={bundle} locale={locale} t={t} countriesText={metrics.countries} />
            {/* İŞKUR float (design .ja-iskur-float): local mark (W14), legal strings verbatim. */}
            <div className="mt-4 flex items-center gap-4 rounded-base border border-white/20 bg-white/10 px-4 py-3 lg:absolute lg:-bottom-6 lg:left-6 lg:mt-0 lg:bg-navy lg:shadow-hero-form">
              <Image
                src={BRAND.iskur.src}
                width={40}
                height={40}
                alt="İŞKUR"
                className="h-10 w-10 rounded-xs bg-white object-contain p-1"
              />
              <div>
                <p className="text-body-sm m-0 font-extrabold">{t('about.035')}</p>
                <p className="text-body-sm m-0 text-white/60">{t('about.036')}</p>
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

`npx vitest run src/lib/seo/unbuilt.test.ts src/lib/seo/routes.test.ts scripts/gate-routes.test.ts src/messages/messages.test.ts` → green (the set and the filesystem agree again; `messages.test.ts` proves both files still carry the same key set). `npm run verify` → green. Then `npm run build && npm run start` in one terminal and `npx playwright test e2e/routing.spec.ts e2e/seo.spec.ts --project=desktop` in another: the page-contract loop finds one `h1[data-testid="page-h1"]` on `/hakkimizda` and `/en/about` with no `{token}`; canonical `https://www.jobsadmire.com/hakkimizda` ↔ `…/en/about`; the sitemap lists both and both answer 200.

- [ ] **Step 5: Commit**

```
feat(about): route skeleton, metadata and hero on the WP2a foundation

- src/app/[locale]/(site)/about/page.tsx: generateMetadata with the sys.seo.about fallbacks
  (W23/W38), navy-gradient hero with the h1 as the LCP element (§10 row 4, D26), breadcrumb
  block (BreadcrumbList JSON-LD), MetricStrip over placed/employers/countries (W1), the
  corridor card (static lanes, CSS dots, D20) and the İŞKUR float from the local mark (W14)
- '/about' leaves UNBUILT_PATHNAMES (W20); /hakkimizda + /en/about join GATE_ROUTE_TABLE (W21)
- sys.seo.about.{title,description} in both message files

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 2 — "Who we are", journey timeline + stats row, technology panel; the `sys.about.*` copy and its key test

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/about/__tests__/sys-keys.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

type Tree = { [k: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : flatten(v, `${prefix}${k}.`),
  );
}

/** Every `.ts`/`.tsx` under the page folder (page, helpers, _components), tests excluded. */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === '__tests__' ? [] : sources(p);
    return /\.tsx?$/.test(name) ? [readFileSync(p, 'utf8')] : [];
  });
}

const PAGE_DIR = join(__dirname, '..');
const SYS_REF = /\bsys\(\s*(['"`])((?:about|seo\.about)\.[A-Za-z0-9_.]+)\1/g;

describe('sys.about.* copy', () => {
  const enKeys = flatten(en.sys.about as Tree, 'about.');
  const trKeys = flatten(tr.sys.about as Tree, 'about.');

  it('carries the identical key set in both locales', () => {
    expect(trKeys.sort()).toEqual(enKeys.sort());
    expect(flatten(en.sys.seo.about as Tree, 'seo.about.').sort()).toEqual(
      flatten(tr.sys.seo.about as Tree, 'seo.about.').sort(),
    );
  });

  it('has no empty value in either locale', () => {
    for (const messages of [en, tr]) {
      for (const key of flatten(messages.sys.about as Tree, 'about.')) {
        const value = key
          .split('.')
          .reduce<Tree | string>((node, part) => (node as Tree)[part], messages.sys as Tree);
        expect(value, key).not.toBe('');
      }
    }
  });

  it('every sys(…) reference in the page folder resolves to a message', () => {
    const all = new Set([...enKeys, ...flatten(en.sys.seo.about as Tree, 'seo.about.')]);
    const referenced = new Set<string>();
    for (const src of sources(PAGE_DIR))
      for (const m of src.matchAll(SYS_REF)) referenced.add(m[2]);
    expect(referenced.size).toBeGreaterThan(0);
    for (const key of referenced) expect(all.has(key), `missing sys.${key}`).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/[locale]/(site)/about/__tests__/sys-keys.test.ts"` → TypeError: `en.sys.about` is undefined (the namespace does not exist yet).

- [ ] **Step 3: Implement**

`src/messages/en.json` — add the `about` object inside `sys` (after `thankYou`, before the closing brace of `sys`; keep the file's 2-space style):

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
        "body": "Our İŞKUR private employment agency permit and the ÖİB documents behind it, published here as PDFs.",
        "pending": "PDF being added",
        "open": "Open PDF",
        "docs": {
          "iskurPermit": "İŞKUR private employment agency permit",
          "iskurAnnex": "İŞKUR permit — annex",
          "oibCertificate": "ÖİB authorisation certificate",
          "oibAnnex": "ÖİB authorisation — annex"
        }
      },
      "whatsapp": {
        "demo": "Hello JobsAdmire, I would like a demo of your CRM portal.",
        "consult": "Hello JobsAdmire, I would like a free consultation."
      }
    }
```

`src/messages/tr.json`:

```json
    "about": {
      "who": {
        "badgeYear": "2024",
        "photoAlt": "JobsAdmire ekibi, Antalya ofisinde"
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
        "body": "İŞKUR özel istihdam bürosu iznimiz ve ona dayanak olan ÖİB belgeleri, PDF olarak burada yayımlanır.",
        "pending": "PDF ekleniyor",
        "open": "PDF'yi aç",
        "docs": {
          "iskurPermit": "İŞKUR özel istihdam bürosu izin belgesi",
          "iskurAnnex": "İŞKUR izin belgesi — ek",
          "oibCertificate": "ÖİB yetki belgesi",
          "oibAnnex": "ÖİB yetki belgesi — ek"
        }
      },
      "whatsapp": {
        "demo": "Merhaba JobsAdmire, CRM portalınızın demosunu görmek istiyorum.",
        "consult": "Merhaba JobsAdmire, ücretsiz danışmanlık almak istiyorum."
      }
    }
```

(The four `licence.docs.*` labels are working titles for the D26 slots; the owner's §10 row 3 delivery renames them — a message edit, no code change. `who.badgeYear` and `journey.m3When` are the two dated labels the design types into markup with no id; they live in `sys` so D17's dated-claim review sees them, and move to a `settings.licence.since`-style field if the contract gains one in v1.1.)

`src/app/[locale]/(site)/about/page.tsx` — extend the imports and append the three sections after the hero `</Section>`:

```tsx
// imports — replace the two block/primitive lines of cycle 1 with:
import { Breadcrumbs, ContactCta, ImageSlot, MetricStrip, StoreBadges } from '@/design/blocks';
import { buttonClassName, Eyebrow, Section, Timeline } from '@/design/primitives';
```

```tsx
      {/* ============ WHO WE ARE (design 618–657) */}
      <Section tone="light" id="about-who">
        <div
          data-testid="about-who"
          className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >
          <div className="relative">
            <ImageSlot
              slot="office-photo"
              alt={sys('about.who.photoAlt')}
              width={640}
              height={400}
              sizes="(min-width: 901px) 45vw, 100vw"
              className="rounded-lg"
            />
            <div className="absolute right-4 bottom-4 rounded-sm bg-navy px-4 py-2 text-white shadow-hero-form">
              <p className="text-card-title m-0 font-extrabold">{sys('about.who.badgeYear')}</p>
              <p className="text-body-sm m-0 text-white/70">{t('about.037')}</p>
            </div>
          </div>
          <div>
            <Eyebrow>{t('about.038')}</Eyebrow>
            <h2 className="text-h2 mt-2 mb-4">{t('about.039')}</h2>
            {/* about.040 is legal-flagged: rendered verbatim ("13+ countries") pending the WP-C review (W1). */}
            <p className="text-body m-0 mb-6 text-text-secondary">{t('about.040')}</p>
            <ol className="m-0 grid list-none gap-4 p-0">
              {(
                [
                  ['about.041', 'about.042'],
                  ['about.043', 'about.044'],
                  ['about.045', 'about.046'],
                ] as const
              ).map(([titleId, bodyId], i) => (
                <li key={titleId} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <span
                    aria-hidden="true"
                    className="text-body-sm pt-1 font-extrabold tabular-nums text-blue-safe"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-card-title m-0">{t(titleId)}</h3>
                    <p className="text-body-sm m-0 text-text-secondary">{t(bodyId)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ============ FOUNDER + JOURNEY band (design 659–738). The founder card is cycle 3. */}
      <Section tone="pale" id="about-journey">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            {/* {founderBand} — cycle 3 */}
            <div data-testid="about-journey">
              <h2 className="text-eyebrow m-0 mb-5 font-extrabold uppercase tracking-[1.6px] text-blue-safe">
                {t('about.050')}
              </h2>
              <Timeline
                variant="vertical"
                steps={[
                  { when: t('about.051'), title: t('about.052'), body: '' },
                  { when: t('about.053'), title: t('about.054'), body: '' },
                  { when: sys('about.journey.m3When'), title: t('about.055'), body: '' },
                  // about.057 = "{placed} workers placed, {employers} clients" after the importer (W1)
                  { when: t('about.056'), title: t('about.057'), body: '' },
                ]}
              />
              {/* The label says "Partner with us" — that intent wins over the design's #request-form target. */}
              <Link href="/partner-with-us" className={buttonClassName('primary', 'lg', 'mt-6')}>
                {t('about.058')}
              </Link>
            </div>
          </div>
          {/* Stats row (design .ja-stats4): placed / employers / permitDays (45 + home.206 unit).
              "98 % client retention" has no id and no signed metric — dropped (W1, D17). */}
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
          <h2 className="text-h2 mt-0 mb-2">{t('about.064')}</h2>
          <p className="text-body-lg m-0 mb-8 max-w-[720px] text-text-secondary">{t('about.065')}</p>
          <div className="grid gap-10 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Eyebrow>{t('about.066')}</Eyebrow>
              {/* The package splits the superlative around the highlighted words (W23 permits the join). */}
              <h3 className="text-h2 mt-2 mb-4">
                {t('about.067')} <span className="text-blue-safe">{t('about.068')}</span>{' '}
                {t('about.069')}
              </h3>
              <p className="text-body m-0 mb-6 text-text-secondary">{t('about.070')}</p>
              <ul className="m-0 mb-8 grid list-none gap-3 p-0">
                {(['about.071', 'about.072', 'about.073', 'about.074', 'about.075'] as const).map(
                  (id) => (
                    <li key={id} className="grid grid-cols-[1.5rem_1fr] gap-2 text-body-sm">
                      <span aria-hidden="true" className="font-extrabold text-success-text">
                        {id === 'about.074' ? '✦' : '✓'}
                      </span>
                      <span>{t(id)}</span>
                    </li>
                  ),
                )}
              </ul>
              <div className="flex flex-wrap items-center gap-4">
                <ContactCta
                  placement="page_cta"
                  size="lg"
                  external
                  href={waLink(settings.whatsappNumber, sys('about.whatsapp.demo'))}
                >
                  {t('about.076')}
                </ContactCta>
                {/* W8: the App Store badge renders only once settings.storeLinks.ios is a URL. */}
                <StoreBadges
                  bundle={bundle}
                  locale={locale}
                  tone="light"
                  android={settings.storeLinks.android}
                  ios={settings.storeLinks.ios}
                />
              </div>
            </div>
            {/* Visual (design .ja-tech-visual): hidden ≤900 px by the design → CSS-hidden here (W10). */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-4">
              <ImageSlot
                slot="crm-dashboard"
                alt={sys('about.tech.dashboardAlt')}
                width={640}
                height={400}
                sizes="(min-width: 901px) 40vw, 0px"
                className="rounded-sm"
              />
              <ImageSlot
                slot="app-screen"
                alt={sys('about.tech.appAlt')}
                width={200}
                height={420}
                sizes="200px"
                className="w-[200px] rounded-lg"
              />
            </div>
          </div>
          <ul className="m-0 mt-8 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ['about.077', 'about.078'],
                ['about.079', 'about.080'],
                ['about.081', 'about.082'],
                ['about.083', 'about.084'],
                ['about.085', 'about.086'],
                ['about.087', 'about.088'],
              ] as const
            ).map(([titleId, bodyId], i) => (
              <li
                key={titleId}
                className="rounded-md border border-border-2 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <span aria-hidden="true" className="text-body-sm font-extrabold text-blue-safe">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-card-title mt-2 mb-1">{t(titleId)}</h3>
                {/* about.082 = "…from {countries} countries…" after the importer (W1). Bodies are
                    hidden ≤900 px in the design → hidden lg:block (W10). */}
                <p className="text-body-sm m-0 hidden text-text-secondary lg:block">{t(bodyId)}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/[locale]/(site)/about" src/messages/messages.test.ts` → green (3 sys-keys cases; the message files' key sets still match). `npm run verify` → green. `npm run build` → green (an unknown package id would throw here through `makeTf` in dev only, so also `npm run dev` once and load `/hakkimizda` and `/en/about`: no `unknown string id`, no `fill: no value for placeholder`).

- [ ] **Step 5: Commit**

```
feat(about): who-we-are, journey timeline, stats row and technology panel

- three sections in the design's order over makeTf (about.057/082 carry W1 metric tokens,
  about.040 legal-flagged verbatim); Timeline vertical; second MetricStrip drops the unsigned
  "98 %" (W1/D17); tech visual + feature bodies CSS-hidden ≤900 px (W10); demo CTA through
  ContactCta page_cta; StoreBadges (iOS hidden while settings.storeLinks.ios is null, W8)
- sys.about.* namespace in both locales (dated labels, alts, licence copy, two WhatsApp
  prefills — W9/W23) with a key-set + reference test

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 3 — founder band, hidden until a published `founder` row (W6, §10 row 3)

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/about/__tests__/founder.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { CollectionError } from '@/content/collections';
import { testBundle } from '@/test/bundle';
import { getFounder } from '../founder';

const row = { name: 'Ada Lovelace', photoSrc: '/photos/founder.jpg', published: true };

describe('getFounder (the W6 "settings flag" for the founder band)', () => {
  it('is null when the bundle carries no founder collection — the band stays hidden', () => {
    expect(getFounder(testBundle())).toBeNull();
  });

  it('is null while the row is not published, even with a name and a photo', () => {
    const bundle = testBundle({ collections: { founder: [{ ...row, published: false }] } });
    expect(getFounder(bundle)).toBeNull();
  });

  it('returns the published row', () => {
    const bundle = testBundle({ collections: { founder: [row] } });
    expect(getFounder(bundle)).toEqual(row);
  });

  it('accepts a published row without a photo (the slot renders as a placeholder, D26)', () => {
    const bundle = testBundle({ collections: { founder: [{ ...row, photoSrc: null }] } });
    expect(getFounder(bundle)).toEqual({ ...row, photoSrc: null });
  });

  it('refuses a malformed row outside production instead of publishing a half claim', () => {
    const bundle = testBundle({ collections: { founder: [{ name: '', published: true }] } });
    expect(() => getFounder(bundle)).toThrow(CollectionError);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/[locale]/(site)/about/__tests__/founder.test.ts"` → cannot resolve `../founder`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/about/founder.ts`:

```ts
import { z } from 'zod';
import { CollectionError } from '@/content/collections';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/**
 * §10 row 3 / W6: the founder's name, title and photo are claim strings that stay unpublished
 * until the owner supplies them. The contract's `settings` object is frozen (v1.0, hash-pinned),
 * so the "settings flag" the ruling asks for is a `founder` collection row with
 * `published: true` — `collections` is an open record in the contract, so no contract change.
 * The importer emits no such collection today (band hidden); Phase B's CMS, or a one-line
 * importer addition when the owner answers, publishes it. The quote's figure is never stored
 * here: it is the `placed` metric (W1).
 */
export const FounderSchema = z.object({
  name: z.string().min(1),
  photoSrc: z.string().min(1).nullable(),
  published: z.boolean(),
});
export type Founder = z.infer<typeof FounderSchema>;

export function getFounder(bundle: Bundle): Founder | null {
  const raw = bundle.collections.founder?.[0];
  if (raw === undefined) return null;
  const parsed = FounderSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const message = `collection "founder" does not match its schema at ${issue?.path.join('.')}: ${issue?.message}`;
    if (process.env.NODE_ENV !== 'production') throw new CollectionError(message);
    console.error(`[content] ${message}`);
    return null;
  }
  return parsed.data.published ? parsed.data : null;
}
```

`src/app/[locale]/(site)/about/_components/FounderBand.tsx`:

```tsx
import { ImageSlot } from '@/design/blocks';
import type { Founder } from '../founder';

/** The founder card (design 662–678). Renders nothing until the page hands it a published
 *  row (W6) — the hidden state is data-driven, never a deleted section. The quote is the
 *  package's own three-way split around the live figure (about.048 / about.143 / about.049 —
 *  W23 permits the join because the package made the split); the figure is the `placed`
 *  metric text. A missing photo is the named `founder-photo` placeholder (D26). */
export function FounderBand({
  founder,
  familiesServed,
  t,
}: {
  founder: Founder | null;
  /** `metricValues(bundle, locale).placed` */
  familiesServed: string;
  t: (id: string) => string;
}) {
  if (!founder) return null;
  return (
    <figure
      data-testid="about-founder"
      className="m-0 rounded-lg border border-tint-border bg-white p-6 shadow-card sm:p-8"
    >
      <div className="mb-5 flex items-center gap-4">
        <ImageSlot
          slot="founder-photo"
          src={founder.photoSrc}
          alt={founder.name}
          width={96}
          height={96}
          sizes="96px"
          className="h-20 w-20 shrink-0 rounded-pill object-cover"
        />
        <figcaption>
          <p className="text-card-title m-0 font-extrabold">{founder.name}</p>
          <p className="text-body-sm m-0 text-text-secondary">{t('about.047')}</p>
        </figcaption>
      </div>
      <blockquote className="text-body-lg m-0 leading-relaxed text-ink">
        {t('about.048')}{' '}
        <span className="font-extrabold text-blue-safe">
          {familiesServed} {t('about.143')}
        </span>{' '}
        {t('about.049')}
      </blockquote>
    </figure>
  );
}
```

`src/app/[locale]/(site)/about/page.tsx` — add the imports and mount the band in the journey grid:

```tsx
import { FounderBand } from './_components/FounderBand';
import { getFounder } from './founder';
```

Inside the component body, after `const { settings } = bundle;`:

```tsx
  const founder = getFounder(bundle);
```

Replace the `{/* {founderBand} — cycle 3 */}` comment inside the `lg:grid-cols-2` grid with:

```tsx
            <FounderBand founder={founder} familiesServed={metrics.placed} t={t} />
```

(With the band `null` the journey column is the only child; `lg:grid-cols-2` keeps it in the left cell, which is the design's stacked-on-mobile layout either way.)

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/[locale]/(site)/about"` → 5 founder cases + 3 sys-keys cases green. `npm run verify` → green. In `npm run dev`, `/hakkimizda` renders no `[data-testid="about-founder"]` (the LOCAL bundle has no `founder` collection); to see the card once, add `founder: [{ name: 'Test', photoSrc: null, published: true }]` to a throw-away copy of the bundle through `testBundle` in a scratch test — never by editing `src/content/local/*.json` (generated).

- [ ] **Step 5: Commit**

```
feat(about): founder band, hidden until a published founder row (W6, §10 row 3)

- founder.ts: FounderSchema + getFounder over bundle.collections.founder (an open record in
  the frozen contract) — null today, so the claim strings about.047/048/049/143/144 stay
  unpublished; a malformed row throws outside production
- FounderBand: figure/figcaption/blockquote, the quote joined from the package's own split
  around the `placed` metric (W1/W23); founder-photo is a named placeholder when unset (D26)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 4 — offices, the `#lisans` licence block, the green closing band, the hidden newsletter block

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/about/__tests__/licence.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { LICENCE_DOCS, licenceDocHref } from '../licence';

describe('LICENCE_DOCS (the #lisans slots, D26)', () => {
  it('names the four İŞKUR/ÖİB PDFs plus the company profile, each slot unique', () => {
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

  it('a file is either absent (placeholder) or a PDF under /docs/licence/', () => {
    for (const doc of LICENCE_DOCS) {
      const href = licenceDocHref(doc);
      if (href !== null) expect(href).toMatch(/^\/docs\/licence\/[a-z0-9-]+\.pdf$/);
    }
  });

  it('ships every slot as a placeholder today — the PDFs are a §10 row 3 owner input', () => {
    expect(LICENCE_DOCS.every((d) => licenceDocHref(d) === null)).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/[locale]/(site)/about/__tests__/licence.test.ts"` → cannot resolve `../licence`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/about/licence.ts`:

```ts
/**
 * D26 Minimum Launchable Content: the four İŞKUR/ÖİB licence PDFs are republished at
 * `/hakkimizda#lisans` (legacy `/certifications` redirects here, redirects/legacy.json). The
 * files are a §10 row 3 owner input and are not in the repo yet, so every slot renders as a
 * named `data-placeholder` (W55) — the launch profile's content-readiness table lists them
 * until each `file` is filled. To publish one: drop the PDF under `public/docs/licence/` and
 * set `file` here (no other code changes). The company profile joins the same list because
 * the design's `/profile/company-profile.pdf` is a 410 prefix on the new site (gone.json).
 */
export type LicenceDoc = {
  /** Slot id — the value of `data-placeholder` while the file is missing (W55). */
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
import { LICENCE_DOCS, licenceDocHref } from '../licence';

/** The `#lisans` block (D26) — not in the design; sits between the offices and the closing
 *  band where the design's profile strip is, and carries that strip's legal line (about.108)
 *  and İŞKUR mark. A slot with no file is a list item marked `data-placeholder`, never a dead
 *  link (D20). */
export function LicenceBlock({
  t,
  sys,
}: {
  t: (id: string) => string;
  sys: (key: string, values?: Record<string, string>) => string;
}) {
  return (
    <section
      id="lisans"
      data-testid="about-lisans"
      aria-labelledby="lisans-title"
      className="container-site scroll-mt-24"
    >
      <div className="rounded-base border border-border-4 bg-white p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Image
            src={BRAND.iskur.src}
            width={56}
            height={56}
            alt="İŞKUR"
            className="h-14 w-14 object-contain"
          />
          <div className="min-w-0 flex-1">
            <h2 id="lisans-title" className="text-h2 m-0">
              {sys('about.licence.title')}
            </h2>
            <p className="text-body-sm m-0 mt-1 text-text-secondary">{sys('about.licence.body')}</p>
          </div>
        </div>
        {/* about.108 is legal-flagged (permit, tax no., law 4904): verbatim. */}
        <p className="text-body-sm m-0 mb-6 text-text-secondary">{t('about.108')}</p>
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {LICENCE_DOCS.map((doc) => {
            const href = licenceDocHref(doc);
            const title =
              doc.label.kind === 'sys' ? sys(`about.licence.docs.${doc.label.key}`) : t(doc.label.id);
            return (
              <li
                key={doc.slot}
                data-placeholder={href ? undefined : doc.slot}
                className="flex items-center justify-between gap-3 rounded-sm border border-border-2 bg-pale-2 px-4 py-3"
              >
                <span className="text-body-sm font-extrabold">{title}</span>
                {href ? (
                  <a
                    href={href}
                    className="text-body-sm shrink-0 font-extrabold text-blue-safe underline-offset-4 hover:underline"
                  >
                    {sys('about.licence.open')}
                  </a>
                ) : (
                  <span className="text-body-sm shrink-0 rounded-pill bg-tint px-3 py-1 font-extrabold text-blue-safe">
                    {sys('about.licence.pending')}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

`src/app/[locale]/(site)/about/page.tsx` — extend the imports:

```tsx
import { getOffice } from '@/content/collections';
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
import { LicenceBlock } from './_components/LicenceBlock';
```

In the component body, after `const founder = getFounder(bundle);`:

```tsx
  const offices = [getOffice(bundle, 'antalya'), getOffice(bundle, 'karachi')] as const;
  /** The function chips per office (design 860–863 / 887–890): about.095–097, about.105–107. */
  const OFFICE_CHIPS = {
    antalya: ['about.095', 'about.096', 'about.097'],
    karachi: ['about.105', 'about.106', 'about.107'],
  } as const;
  const OFFICE_PHOTO_SLOT = { antalya: 'antalya-office', karachi: 'karachi-office' } as const;
  /** W5: the employer-updates subscription (about.141/145) stays hidden in Phase A. */
  const NEWSLETTER_ACTIVE = false;
```

Append after the technology `</Section>`:

```tsx
      {/* ============ OFFICES (design 839–897) — from the offices collection through OfficeCard.
          W7: the card's own labelId (contact.099 "Head office" / contact.104 "Sourcing office")
          replaces the design's about.091 / about.101 caps; the contact rows are the card's
          ContactLink rows with placement office_card (no invented Karachi number, W6). */}
      <Section tone="pale" id="about-offices">
        <div data-testid="about-offices" className="container-site">
          <h2 className="text-h2 mt-0 mb-2">{t('about.089')}</h2>
          <p className="text-body-lg m-0 mb-8 max-w-[760px] text-text-secondary">{t('about.090')}</p>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
            {offices.map((office, i) => (
              <div key={office.key} className="contents">
                {i === 1 ? (
                  <div
                    aria-hidden="true"
                    className="hidden lg:flex lg:h-full lg:flex-col lg:items-center lg:justify-center lg:gap-2"
                  >
                    <span className="h-16 w-px bg-tint-border" />
                    <span className="rounded-pill border border-tint-border bg-white px-3 py-1 text-body-sm font-extrabold text-blue-safe">
                      {t('about.100')}
                    </span>
                    <span className="h-16 w-px bg-tint-border" />
                  </div>
                ) : null}
                <div data-testid={`about-office-${office.key}`}>
                  <ImageSlot
                    slot={OFFICE_PHOTO_SLOT[office.key]}
                    alt={sys('about.offices.photoAlt', { city: t(office.cityId) })}
                    width={640}
                    height={360}
                    sizes="(min-width: 901px) 45vw, 100vw"
                    className="mb-4 rounded-base"
                  />
                  <OfficeCard bundle={bundle} locale={locale} office={office}>
                    <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                      {OFFICE_CHIPS[office.key].map((id) => (
                        <li
                          key={id}
                          className="rounded-pill border border-tint-border bg-pale-1 px-3 py-1 text-body-sm font-extrabold text-blue-safe"
                        >
                          {t(id)}
                        </li>
                      ))}
                    </ul>
                  </OfficeCard>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ #lisans (D26) — the design's profile strip position (898–905) */}
      <Section tone="light">
        <LicenceBlock t={t} sys={sys} />
      </Section>

      {/* ============ GREEN CTA (design 907–918). The band's Cta.href is a string, so the
          primary lands on the Hire Workers page top (its quick-quote is the first block, T3)
          rather than #request-form — see "Foundation gaps". */}
      <Section tone="band" id="about-cta">
        <div data-testid="about-cta" className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            tone="green"
            titleId="about.110"
            bodyId="about.111"
            primary={{ label: t('about.112'), href: '/hire-workers' }}
            secondary={{
              label: t('about.030'),
              href: waLink(settings.whatsappNumber, sys('about.whatsapp.consult')),
              external: true,
              variant: 'inverse',
            }}
          />
        </div>
      </Section>

      {/* W5: the design's employer-updates subscription (about.141/145, an unbound mailto) is the
          newsletter block in disguise — rendered hidden until counsel clears, like every page. */}
      <NewsletterBand bundle={bundle} locale={locale} active={NEWSLETTER_ACTIVE} />
```

(`about.111`'s paragraph is hidden ≤900 px in the design; `ClosingCtaBand` renders its `bodyId` on every width — an accepted W10-class delta in the block's favour: the sentence is the offer.)

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/[locale]/(site)/about"` → 4 licence + 5 founder + 3 sys-keys cases green. `npm run verify` → green. `npm run dev`: `/hakkimizda#lisans` scrolls to the block (`scroll-mt-24` clears the sticky header), the five rows carry `data-placeholder="licence-pdf-…"`, both office cards show the collection's label/hours/contact rows, the green band renders two CTAs, no newsletter band in the DOM. `curl -sI http://localhost:3000/certifications | grep -i location` → `/en/about#lisans` (308, the WP1 redirect — nothing to change).

- [ ] **Step 5: Commit**

```
feat(about): offices from the collection, #lisans licence slots, green closing band

- two OfficeCards (getOffice antalya/karachi; W7 labels, office_card contact rows) with
  named photo placeholders and the design's function chips; "One team" divider
- LicenceBlock at #lisans (D26; legacy /certifications lands here): about.108 verbatim, İŞKUR
  mark, five PDF slots as named data-placeholder rows (no dead links) — licence.ts is the one
  place to fill when the owner's PDFs arrive
- ClosingCtaBand tone green (about.110–112) — WhatsApp consultation prefill from sys (W9)
- NewsletterBand mounted with active=false (W5)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 5 — page e2e spec, the gate run, script size

- [ ] **Step 1: Write the failing test**

`e2e/pages/about.spec.ts`:

```ts
import { test, expect, type Page } from '@playwright/test';

const ORIGIN = 'https://www.jobsadmire.com';
const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;

async function bodyText(page: Page) {
  return page.locator('body').innerText();
}

for (const [path, lang, alternate] of [
  ['/hakkimizda', 'tr', '/en/about'],
  ['/en/about', 'en', '/hakkimizda'],
] as const) {
  test.describe(`About ${path}`, () => {
    test('renders the h1 with real copy and every section in the design order', async ({
      page,
    }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      const h1 = page.locator('h1[data-testid="page-h1"]');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
      expect((await h1.innerText()).trim().length).toBeGreaterThan(3);
      expect(await bodyText(page)).not.toMatch(LEAK);

      // DOM order = design order (hero → who → journey → tech → offices → lisans → cta)
      const ids = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            '[data-testid="about-corridor"],[data-testid="about-who"],[data-testid="about-journey"],[data-testid="about-tech"],[data-testid="about-offices"],[data-testid="about-lisans"],[data-testid="about-cta"]',
          ),
        ).map((el) => el.getAttribute('data-testid')),
      );
      expect(ids).toEqual([
        'about-corridor',
        'about-who',
        'about-journey',
        'about-tech',
        'about-offices',
        'about-lisans',
        'about-cta',
      ]);
    });

    test('the headline numbers come from the metrics collection (W1)', async ({ page }) => {
      await page.goto(path);
      const text = await bodyText(page);
      expect(text).toContain('470+');
      expect(text).toContain('22+');
      // the design's unsigned figures never render
      expect(text).not.toContain('14+');
      expect(text).not.toMatch(/98\s?%|%\s?98/);
    });

    test('founder band and newsletter block are hidden (W6, W5); #lisans carries five named placeholder slots (D26)', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.getByTestId('about-founder')).toHaveCount(0);
      await expect(page.locator('#newsletter')).toHaveCount(0);
      const lisans = page.locator('#lisans');
      await expect(lisans).toHaveCount(1);
      const slots = await lisans.locator('[data-placeholder]').evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-placeholder')),
      );
      expect(slots).toHaveLength(5);
      for (const s of slots) expect(s).toMatch(/^licence-pdf-/);
      // no placeholder is ever the LCP element, and no placeholder is unnamed (W55)
      expect(await page.locator('[data-placeholder][data-lcp-slot]').count()).toBe(0);
      expect(await page.locator('[data-placeholder=""]').count()).toBe(0);
    });

    test('both offices render from the collection with tracked contact rows', async ({ page }) => {
      await page.goto(path);
      for (const key of ['antalya', 'karachi']) {
        const card = page.getByTestId(`about-office-${key}`);
        await expect(card.locator('article')).toHaveCount(1);
        await expect(card.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
        await expect(card.locator('a[href^="mailto:"]')).toHaveCount(1);
        await expect(card.locator('a[href^="tel:"]')).toHaveCount(1);
      }
    });

    test('canonical, hreflang and breadcrumb JSON-LD name this page', async ({ page }) => {
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
      // the AboutPage carries no Organization node of its own — the layout's site-wide one stands
      expect(graphs.filter((g) => g.includes('"EmploymentAgency"'))).toHaveLength(1);
    });

    test('the language switch keeps the visitor on the About page', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'the switcher is in the hamburger on mobile');
      await page.goto(path);
      const group = page.getByRole('group', { name: /Language|Dil/ });
      await group.getByRole('link', { name: lang === 'tr' ? 'English' : 'Türkçe' }).click();
      await expect(page).toHaveURL(new RegExp(`${alternate.replace('/', '\\/')}$`));
      await expect(page.locator('h1[data-testid="page-h1"]')).toHaveCount(1);
    });
  });
}

test('a WhatsApp CTA on the page pushes whatsapp_click with the page_cta placement', async ({
  page,
}) => {
  await page.goto('/hakkimizda');
  const demo = page.getByTestId('about-tech').locator('a[href^="https://wa.me/"]').first();
  await expect(demo).toHaveAttribute('target', '_blank');
  // Intercept the navigation: the click must not open a tab for the assertion to read the layer.
  await page.route('https://wa.me/**', (route) => route.abort());
  const popup = page.waitForEvent('popup', { timeout: 2000 }).catch(() => null);
  await demo.click();
  const p = await popup;
  if (p) await p.close();
  const events = await page.evaluate(
    () => (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? [],
  );
  expect(
    events.filter((e) => e.event === 'whatsapp_click' && e.placement === 'page_cta'),
  ).toHaveLength(1);
  expect(events.find((e) => e.event === 'whatsapp_click')).toMatchObject({
    page: '/hakkimizda',
    locale: 'tr',
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Against a build **without** the About page (e.g. `git stash push -u -m "about-e2e-probe"` of cycles 1–4 is NOT allowed on the shared stash — instead run it against the deployed preview of the previous task, or simply note: on `main` the routes 404 through `[...rest]`) `npx playwright test e2e/pages/about.spec.ts --project=desktop` → every case fails at the 200/`page-h1` assertion. With cycles 1–4 present the spec is the acceptance run of Step 4.

- [ ] **Step 3: Implement**

Nothing to add: the cycle's product is the spec plus the gate evidence. If the DOM-order case fails because a `data-testid` is missing, fix the page (the section test ids in cycles 1–4 are: `about-corridor` (hero card), `about-who`, `about-journey`, `about-tech`, `about-offices`, `about-office-antalya`, `about-office-karachi`, `about-lisans` (+ `id="lisans"`), `about-cta`, `about-founder` (absent)).

- [ ] **Step 4: Run tests + `npm run verify`**

1. `npm run verify` → green.
2. `npm run build && npm run start` (one terminal), then `E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/about.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts` → green on both projects (axe on `/hakkimizda` and `/en/about`: zero violations; width sweep at all nine widths: no overflow — the `lg:grid-cols-[1fr_auto_1fr]` offices row and the tech panel are the two layouts to watch at 900/1100).
3. `E2E_BASE_URL=http://localhost:3000 npm run gate` (local profile, LCP is a warning here — R50) → Lighthouse on the two new indexable routes: performance ≥ 0.95, a11y / best-practices / SEO = 1.0, `resource-summary:script:size` ≤ 204,800 B. Then `npm run js-size` and copy the two rows for the ledger. Expected: within a few hundred bytes of the shell (the page ships no client chunk; `ContactLink`, `Stat` and the `Breadcrumbs`/`OfficeCard` server output add markup, not script). A route over 194,560 B (the lazy line) is a stop: find the chunk before the next page starts (W13 amended).
4. Push the branch; the Vercel preview build runs `npm run verify` again; rerun `npm run gate` against the preview URL — that run is the binding one (R50), record its triple.

- [ ] **Step 5: Commit**

```
test(about): page e2e — sections, metrics source, hidden states, #lisans slots, offices, SEO, language switch, contact analytics

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 6 — docs and the ledger line

- [ ] **Step 1: Write the failing test**

Docs cycle: no unit test. The check is `npm run format` (Prettier over the Markdown tables) inside `npm run verify`.

- [ ] **Step 2: Run to verify it fails**

n/a.

- [ ] **Step 3: Implement**

`docs/SEO.md` — the per-page table. If an earlier page task already created the `## Pages` section (a table with the columns below) append the row; otherwise add the section right after `## JSON-LD` with this header and the row:

```markdown
## Pages

One row per page as it lands in WP2 — where its title comes from, what it canonicalises to, which JSON-LD it adds beyond the site-wide Organization/WebSite nodes, and which element is its named LCP slot (D26).

| Page  | Route                     | Title / description source                                                                                   | Canonical / hreflang                            | JSON-LD (page-added)                           | LCP slot                                                    |
| ----- | ------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| About | `/hakkimizda`, `/en/about` | `sys.seo.about.{title,description}` (the package has no SEO strings for About; page record `titleId` is `''`) | self + tr/en + x-default=tr via `buildMetadata` | `BreadcrumbList` (Home → About) via `Breadcrumbs` | `h1` (`data-lcp-slot="h1"`, navy gradient hero — §10 row 4) |
```

Also under `## JSON-LD`, in the `BreadcrumbList` row's "Where" cell, nothing changes (it already says every non-homepage page); append one sentence after the table: `About (`/hakkimizda`) is the first page to render it, through the foundation's `Breadcrumbs` block; it adds no `AboutPage`/`Organization` node of its own — the site-wide node carries the licence identifiers.`

`docs/ANALYTICS.md` — after the paragraph that starts `**WP1 wires exactly one of these seven events: `conversion`**` add:

```markdown
**Page wiring (WP2).** About (`/hakkimizda`, `/en/about`) fires no page-specific event. Its contact doors are tracked through the foundation: `whatsapp_click` with `placement: 'page_cta'` from the hero WhatsApp CTA (mobile), the technology panel's "Book a demo" and the closing band's WhatsApp button (all through `ContactCta`), and `call_click` / `whatsapp_click` / `email_click` with `placement: 'office_card'` from the two `OfficeCard` contact rows. No new event or parameter (W12).
```

`docs/CONTENT-MODEL.md` — at the end of `### Adding copy (W9, W23, W54)` (WP2a's section; line 72 onward at the time of writing — the paragraph that lists the five namespaces), add this bullet as the page's entry in the `sys.<page>.*` inventory (start the list if this is the first page to add one):

```markdown
- **About page (WP2 T6):** `about.who.{badgeYear,photoAlt}`, `about.journey.m3When`, `about.tech.{dashboardAlt,appAlt}`, `about.offices.photoAlt` (ICU `{city}`), `about.licence.{title,body,pending,open}`, `about.licence.docs.{iskurPermit,iskurAnnex,oibCertificate,oibAnnex}` (working titles for the D26 PDF slots — renamed when the owner's files arrive), `about.whatsapp.{demo,consult}` (the page's two bespoke prefills — `waLink` never takes a literal), and `seo.about.{title,description}` (the package has no SEO strings for About). The two dated labels (`badgeYear`, `m3When`) are the design's markup-only "2024"/"2025" and are the D17 review's to move into data when the contract gains a licence-date field.
```

And in `## Collections`, append one sentence: `The About page additionally reads an optional `founder` collection — `{ name, photoSrc: string | null, published: boolean }`, one row — through its own `FounderSchema` (`src/app/[locale]/(site)/about/founder.ts`); the importer emits none today, so the founder band stays hidden (W6, §10 row 3). It is not in `CollectionSchemas` yet: promote it there when Phase B's CMS owns it.`

`docs/PRD.md` line 97 — replace

```markdown
- Founder name/title, founder/office photo, licence PDFs — **pending §10 item 3**.
```

with

```markdown
- Founder name/title, founder/office photo, licence PDFs — **pending §10 item 3**. As built (WP2 T6): the About page ships the founder band hidden until a published `founder` row exists, the office/founder photo slots as named placeholders, and the `#lisans` block with five named PDF placeholder slots (`src/app/[locale]/(site)/about/licence.ts` is the one file to edit when the PDFs arrive — drop them under `public/docs/licence/`).
```

Ledger (append to the WP2b plan's ledger table, `docs/superpowers/plans/2026-09-20-wp2b-pages.md`):

```markdown
| T6 About | `/hakkimizda`, `/en/about` | script <n> B gz per route from `npm run js-size` (ceiling 204,800; lazy line 194,560) | Lighthouse <perf>/<a11y>/<bp>/<seo> (preview run) | pixel: n/a — not a D27 harness page (side-by-side review; deltas: static corridor lanes, Karachi "Sourcing office" label, "98 %" and "14+" dropped, #lisans block added, hero photo → gradient) |
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npm run verify` → green (Prettier accepts the tables; no code changed). Re-read the three doc diffs once against the page: every claim in them is something cycles 1–5 actually render.

- [ ] **Step 5: Commit**

```
docs(about): SEO page row, analytics wiring, sys.about namespace, founder/licence content status, ledger

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

**Docs in this task:** `docs/SEO.md` (Pages table row + JSON-LD note), `docs/ANALYTICS.md` (page wiring paragraph), `docs/CONTENT-MODEL.md` (`sys.about.*` bullet; `founder` collection sentence), `docs/PRD.md` (line 97 content status), the WP2b ledger row.

**Sys keys added:** (18)
`sys.seo.about.title`, `sys.seo.about.description`, `sys.about.who.badgeYear`, `sys.about.who.photoAlt`, `sys.about.journey.m3When`, `sys.about.tech.dashboardAlt`, `sys.about.tech.appAlt`, `sys.about.offices.photoAlt`, `sys.about.licence.title`, `sys.about.licence.body`, `sys.about.licence.pending`, `sys.about.licence.open`, `sys.about.licence.docs.iskurPermit`, `sys.about.licence.docs.iskurAnnex`, `sys.about.licence.docs.oibCertificate`, `sys.about.licence.docs.oibAnnex`, `sys.about.whatsapp.demo`, `sys.about.whatsapp.consult`

**Package ids used:** 78 — first `about.021`, last `about.143`. In order: `about.021`–`about.025`, `about.029`–`about.040`, `about.041`–`about.058`, `about.064`–`about.090`, `about.095`–`about.097`, `about.100`, `about.105`–`about.112`, `about.142`, `about.143`, `about.047`/`about.048`/`about.049` (founder band, rendered only with a published row), plus the chrome/canonical ids `home.001` (breadcrumb label) and — read by the foundation blocks, not the page — `home.050`/`hire.073`/`home.051`/`home.052`/`home.206` (metric labels/unit), `contact.096/097/099/104/133/134/103/105/100/106`, `home.192`, `home.221`, `hire.240`, `hire.241`. Deliberately NOT rendered: `about.001`–`about.020`, `about.113`–`about.141`, `about.145` (chrome/footer copy — R15), `about.026`–`about.028` and `about.059`–`about.063` (the design's stat labels; `MetricStrip` renders each metric's own `labelId`, W1), `about.091`/`about.093`/`about.101`/`about.103` (office caps — superseded by the `OfficeCard` labels, W7/W34), `about.092`/`about.094`/`about.102`/`about.104` (city/address — the card reads `contact.*`), `about.098` (WhatsApp line — the card's row), `about.144` ("Founder Name" placeholder — never published). All 145 `about.*` ids verified present in `src/content/local/catalogue.json`.

**Foundation gaps:** (1) `ClosingCtaBand`/`ContactCta`/`Button` take `href: string`, and next-intl re-prefixes a pre-localised string on EN (`/en/en/…`), so a band CTA cannot target `#request-form` across locales — the green band's primary lands on `/hire-workers` top; the hero's mobile "Request workers" renders `next-intl <Link href={{ pathname: '/hire-workers', hash: '#request-form' }}>` with `buttonClassName` instead (W17's pattern). A `Cta.href?: Href` object form in the blocks would close this. (2) No `founder` key in `CollectionSchemas` and no settings flag in the frozen contract — the page reads `bundle.collections.founder` through its own `FounderSchema`; promote to `CollectionSchemas` when the CMS owns it. (3) `TimelineStep.body` is required (`string`) while the journey's rows have none — the page passes `''` and the primitive renders an empty `<p>`; an optional `body` would be cleaner. (4) `Section` has no `className` override for vertical padding that beats its own `py-16` reliably (class-order vs cascade), so the hero keeps the primitive's padding rather than the design's 70/88 px.
