import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
import { getMetric, getOffice, type OfficeKey } from '@/content/collections';
import { BRAND } from '@/design/assets/brand';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ImageSlot, type CoverHeights } from '@/design/blocks/ImageSlot';
import { MetricStrip } from '@/design/blocks/MetricStrip';
import { NewsletterBand } from '@/design/blocks/NewsletterBand';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { buttonClassName } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Timeline } from '@/design/primitives/Timeline';
import { liquidSizes } from '@/design/zoom';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { AboutOfficeCard } from './_components/AboutOfficeCard';
import { CorridorCard } from './_components/CorridorCard';
import { FounderBand } from './_components/FounderBand';
import { GreenBand } from './_components/GreenBand';
import { LicenceBlock } from './_components/LicenceBlock';
import { publishedFounder } from './founder';
import { LICENCE_DOCS, PROFILE_SLOT, licenceDocHref } from './licence';

/** W82: the page's one cross-page hash target, as an object href so next-intl localises the
 *  pathname and keeps the hash (`/isci-talebi#request-form`, `/en/hire-workers#request-form`).
 *  T2 renders the id (W152/W158); `DEFAULT_CTAS` points at the same place (W17). */
const REQUEST_FORM = { pathname: '/hire-workers', hash: '#request-form' } as const;

/** The design's `about-hero` slot (l. 516) behind the two navy overlays: no photo yet, so the
 *  labelled placeholder (decorative here — the overlays leave it a faint texture) in cover mode,
 *  tall enough to fill the hero at every width (the section clips it). */
const HERO_COVER: CoverHeights = { base: 1400, md: 1150, lg: 760, xl: 570 };

/** Who-we-are rows (design 633–656): title id, body id. about.046 is legal-flagged (verbatim). */
const WHO_ROWS = [
  ['about.041', 'about.042'],
  ['about.043', 'about.044'],
  ['about.045', 'about.046'],
] as const;

/** The phone numeral squares (design l. 311–313: #1899D5 / #16a34a / #8b5cf6), in the
 *  contrast-safe shades that carry their white numerals at ≥ 4.5:1 (D20). */
const WHO_FILL = ['max-lg:bg-blue-safe', 'max-lg:bg-success-text', 'max-lg:bg-[#7c3aed]'] as const;

/** Technology panel ticks (design 752–773); about.074 is the design's AI-gradient tick. */
const TECH_POINTS = ['about.071', 'about.072', 'about.073', 'about.074', 'about.075'] as const;
const AI_POINT = 'about.074';

/** The six feature cards (design 805–836). about.082 = "…from {countries} countries…" (W1).
 *  Bodies hidden ≤900 px in the design (`.ja-feat6 > div > p { display: none }`, confirmed
 *  inside the design file's `@media (max-width: 900px)` block) — CSS-hidden here too (W10). */
const FEATURES = [
  ['about.077', 'about.078'],
  ['about.079', 'about.080'],
  ['about.081', 'about.082'],
  ['about.083', 'about.084'],
  ['about.085', 'about.086'],
  ['about.087', 'about.088'],
] as const;

/** One colour per feature numeral (design l. 806–834: #1899D5, #16a34a, #8b5cf6, #f59e0b, #0ea5a3,
 *  #ef4444): the numeral's text on the pale card from 901, and the 32 px square's fill behind a
 *  white numeral on phones (l. 349–354). The contrast-safe shade of each hue (blue-safe,
 *  success-text, violet-600, warning-text, teal-700, danger) keeps both ≥ 4.5:1 (D20). */
const FEATURE_TONE = [
  'text-blue-safe max-lg:bg-blue-safe',
  'text-success-text max-lg:bg-success-text',
  'text-[#7c3aed] max-lg:bg-[#7c3aed]',
  'text-warning-text max-lg:bg-warning-text',
  'text-[#0f766e] max-lg:bg-[#0f766e]',
  'text-danger max-lg:bg-danger',
] as const;

/** The design's "98 % client retention" (l. 733–736): no signed metric carries it (W1, D17), so it
 *  is the stats row's page-local SAMPLE cell with the `SampleTag` (owner 2026-10-05: data-gated
 *  sections show the design's sample, tagged), formatted per locale ("%98" / "98%"). */
const RETENTION_SAMPLE = 0.98;

/** The two offices in the design's order; every text field comes from the collection (W34). */
const OFFICE_ORDER = ['antalya', 'karachi'] as const satisfies readonly OfficeKey[];

/** The tinted pill badge per office (design l. 856 / 883: about.091 / about.101). */
const OFFICE_BADGE = {
  antalya: 'about.091',
  karachi: 'about.101',
} as const satisfies Record<OfficeKey, string>;

/** The function chips per office (design 860–863 / 887–890). */
const OFFICE_CHIPS = {
  antalya: ['about.095', 'about.096', 'about.097'],
  karachi: ['about.105', 'about.106', 'about.107'],
} as const satisfies Record<OfficeKey, readonly string[]>;

/** The owner switched the newsletter form on (2026-10-05): the band renders its own inline form
 *  (`src/forms/newsletter/`) with the blog's proof line. */
const NEWSLETTER_ACTIVE = true;

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

/** The design's download glyph on the phone hero's profile link (l. 548). */
function DownloadIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
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
  const profileDoc = LICENCE_DOCS.find((doc) => doc.slot === PROFILE_SLOT);
  const profileHref = profileDoc ? licenceDocHref(profileDoc) : null;
  const licenceRows = LICENCE_DOCS.filter((doc) => doc.slot !== PROFILE_SLOT).map((doc) => ({
    slot: doc.slot,
    title: doc.label.kind === 'sys' ? sys(`about.licence.docs.${doc.label.key}`) : t(doc.label.id),
    href: licenceDocHref(doc),
  }));
  const retention = new Intl.NumberFormat(locale, { style: 'percent' }).format(RETENTION_SAMPLE);

  return (
    <>
      {/* ============ HERO (design 515–616): the `about-hero` slot under the design's two navy
          overlays (90° 0.96 → 0.76, and 180° 0.55 → 0 → 0.7; on phones the second becomes the
          l. 268 0.5 → 0.2 → 0.9 → solid fade). The h1 carries the LCP slot (D26); Chrome measures
          the hero sub about.025, painted in the same frame (W179). Section padding override:
          accepted page-local (reconcile-rulings.md "Section gradient tone/padding override
          (T4/T6)"; W119/W122/W155 — py-16 vs pt-8/pb-12 are different property groups, longhand
          wins by Tailwind's own ordering). */}
      <Section
        tone="dark"
        id="about-hero"
        className="relative overflow-hidden pt-8 pb-12 lg:pt-[70px] xl:pt-[52.5px] lg:pb-[88px] xl:pb-[66px]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <ImageSlot
            slot="about-hero"
            alt=""
            width={1440}
            height={760}
            sizes="100vw"
            cover={HERO_COVER}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,40,0.96)_0%,rgba(10,20,40,0.9)_55%,rgba(10,20,40,0.76)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,40,0.55)_0%,transparent_34%,rgba(10,20,40,0.7)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(10,20,40,0.5)_0%,rgba(10,20,40,0.2)_30%,rgba(10,20,40,0.9)_88%,var(--color-night)_100%)]"
        />
        <div className="container-site relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center max-lg:gap-8">
          <div>
            {/* W109: the page's own labels — about.021 "Home" / about.008 "About Us". One
                Breadcrumbs mount for the whole page (the WP2a final review's §6 rule). */}
            <Breadcrumbs
              locale={locale}
              tone="dark"
              className="mb-4 max-lg:mb-2"
              items={[
                { name: t('about.021'), href: '/' },
                { name: t('about.008'), href: '/about' },
              ]}
            />
            {/* Phones (≤ 900, l. 271–272 / 295): the sub is an outlined uppercase pill with the
                pulsing green dot, ABOVE the h1 (the design's `order: 2`); from 901 it is the
                plain tracked line under the h1. Two copies, one per width, so the reading order
                always matches what is seen. */}
            <p
              lang="tr"
              className="m-0 inline-flex w-fit items-center rounded-pill border border-white/30 px-4 font-bold text-white uppercase lg:hidden max-lg:mb-[7px] max-lg:gap-[9px] max-lg:py-[7px] max-lg:text-[11.5px] max-lg:tracking-[0.7px]"
            >
              <span
                aria-hidden="true"
                className="ja-live h-2 w-2 shrink-0 rounded-pill bg-success"
              />
              {t('about.024')}
            </p>
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="m-0 mb-2 text-h1 max-md:mb-3 max-md:text-[36px] max-md:leading-none max-md:tracking-[-1.4px]"
            >
              {/* QA W221 about-07: Turkish puts the postposition after its noun — "JobsAdmire
                  Hakkında" (about.022 overridden to "Hakkında"); EN keeps "About JobsAdmire". */}
              {locale === 'tr' ? (
                <>
                  <span className="text-sky">{t('about.023')}</span> {t('about.022')}
                </>
              ) : (
                <>
                  {t('about.022')} <span className="text-sky">{t('about.023')}</span>
                </>
              )}
            </h1>
            <p
              className="m-0 mb-4 text-body-lg font-extrabold tracking-[1.2px] xl:tracking-[0.9px] text-white/70 max-lg:hidden"
              lang="tr"
            >
              {t('about.024')}
            </p>
            <p className="m-0 mb-7 max-w-[560px] xl:max-w-[420px] text-body-lg text-white/80 max-md:mb-4.5 max-md:text-[15.5px] max-md:leading-[1.6]">
              {t('about.025')}
            </p>
            {/* Hero pills (design 532–545, SHARED 12.2): the figures and labels come from the
                metrics collection (home.050 / hire.073 / home.051). The design's about.026–028
                labels and its typed "14+"/"12+" are not read (W1: one label per metric). Phones:
                one row of three under a hairline (l. 274–278). */}
            <MetricStrip
              bundle={bundle}
              locale={locale}
              tone="dark"
              variant="pill"
              metrics={['placed', 'employers', 'countries']}
              className="max-md:mt-1 max-md:border-t max-md:border-white/15 max-md:pt-3.5"
            />
            {/* Phone-only CTAs (design .ja-hero-cta-m / .ja-hero-pdf-m), CSS-hidden from lg (W10).
                The design's second button (WhatsApp, about.140 prefill) is display:none at every
                width, so it is not ported. */}
            <div className="mt-4 flex lg:hidden">
              <Link
                data-testid="about-hero-request"
                href={REQUEST_FORM}
                prefetch={false}
                className={buttonClassName('primary', 'lg', 'w-full md:w-auto md:min-w-[260px]')}
              >
                {t('about.029')}
              </Link>
            </div>
            {/* The profile PDF is not in the repo yet: the link goes to the profile strip
                (#lisans) until it is, then straight to the file. */}
            <a
              href={profileHref ?? '#lisans'}
              type={profileHref ? 'application/pdf' : undefined}
              className="mt-3.5 inline-flex min-h-[44px] items-center gap-2 font-bold text-white/75 no-underline lg:hidden max-lg:text-[14px]"
            >
              <DownloadIcon />
              <span className="border-b border-white/35 pb-px">{t('about.031')}</span>
            </a>
          </div>
          <div className="relative">
            <CorridorCard
              bundle={bundle}
              t={t}
              countriesText={metrics.countries}
              countriesLabel={countries.labelId ? t(countries.labelId) : ''}
            />
            {/* İŞKUR float (design .ja-iskur-float, l. 606–613): a white #d3e6f2 card with the
                local mark (W14; decorative, since about.035 names it), ink copy and a green status
                dot. Both lines are legal-flagged and render verbatim. The design hangs it
                `bottom: -44px` — `lg:-bottom-11` = 44 px at the 16 px root, 33 px from 1101 (a rem
                utility, so the × 0.75 D19 step is automatic); at `-bottom-6` it rode ≈ 20 px too
                high and covered the corridor card's fourth lane (QA W220 about-01). Phones
                (l. 294–297): static under the card, a translucent white face on the navy. */}
            <div className="mt-3 flex items-center gap-3 rounded-sm border border-white/20 bg-white/[0.07] px-3.5 py-2.75 lg:absolute lg:-bottom-11 lg:left-6 lg:z-[2] lg:mt-0 lg:gap-3.5 lg:rounded-base lg:border-edge lg:bg-white lg:px-5 lg:py-3.5 lg:shadow-[0_18px_44px_rgba(22,60,90,0.18)] xl:shadow-[0_13.5px_33px_rgba(22,60,90,0.18)]">
              <Image
                src={BRAND.iskur.src}
                width={44}
                height={44}
                sizes={liquidSizes(33, '44px')}
                alt=""
                className="h-11 w-11 shrink-0 object-contain max-lg:h-8 max-lg:w-8 max-lg:rounded-xs max-lg:bg-white max-lg:p-0.5"
              />
              <div className="min-w-0">
                <p className="m-0 text-[14.5px] font-extrabold text-ink xl:text-[11px] max-lg:text-[13px] max-lg:text-white">
                  {t('about.035')}
                </p>
                <p className="m-0 mt-0.5 text-[12.5px] text-text-tertiary xl:text-[11px] max-lg:text-[11.5px] max-lg:text-white/60">
                  {t('about.036')}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="ml-1.5 h-2.25 w-2.25 shrink-0 rounded-pill bg-success"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ============ WHO WE ARE (design 618–657) */}
      <Section tone="light" id="about-who">
        <div
          data-testid="about-who"
          className="container-site grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-18"
        >
          {/* The `office-photo` slot ("Office / team photo", l. 622) shows the office or the
              team, not one person: it stays the labelled placeholder until that photo exists.
              400 px tall from 901 (300 from 1101), 300 on tablets, 200 on phones (l. 304). */}
          <div className="relative">
            <ImageSlot
              slot="office-photo"
              alt={sys('about.who.photoAlt')}
              width={640}
              height={400}
              sizes="(min-width: 901px) 42vw, 100vw"
              cover={{ base: 200, md: 300, lg: 400, xl: 300 }}
              className="rounded-lg"
            />
            {/* The year badge (l. 623–626): hangs off the photo's corner from 901, sits inside it
                on phones (l. 305–307). */}
            <div className="absolute -right-5 -bottom-7 rounded-base bg-blue-safe px-6.5 py-5 text-white shadow-[0_16px_38px_rgba(24,153,213,0.35)] xl:shadow-[0_12px_28.5px_rgba(24,153,213,0.35)] max-lg:right-3.5 max-lg:bottom-3.5 max-lg:rounded-sm max-lg:px-3.5 max-lg:py-2.25 max-lg:shadow-[0_10px_26px_rgba(3,10,26,0.4)]">
              <p className="m-0 text-[30px] leading-none font-extrabold xl:text-[22.5px] max-lg:text-[20px]">
                {sys('about.who.badgeYear')}
              </p>
              <p className="m-0 mt-1 text-body-sm text-white/90 max-lg:mt-px max-lg:text-[11px]">
                {t('about.037')}
              </p>
            </div>
          </div>
          <div>
            <Eyebrow>{t('about.038')}</Eyebrow>
            <h2 className="mt-2 mb-4 text-h2 max-md:text-[27px] max-md:leading-[1.12] max-md:tracking-[-0.9px]">
              {t('about.039')}
            </h2>
            {/* about.040 is legal-flagged: rendered verbatim ("13+ countries") for the WP-C review (W1). */}
            <p className="m-0 mb-7 text-body leading-[1.7] text-text-secondary xl:max-w-[520px] max-md:mb-4.5 max-md:text-[15.5px] max-md:leading-[1.65]">
              {t('about.040')}
            </p>
            {/* Ruled rows from 901; on phones white bordered cards with coloured numeral squares
                (l. 309–314). */}
            <ol className="m-0 grid list-none p-0 max-lg:gap-2.5">
              {WHO_ROWS.map(([titleId, bodyId], i) => (
                <li
                  key={titleId}
                  className="flex gap-4 border-t border-border-4 py-[18px] last:border-b xl:py-[13.5px] max-lg:items-start max-lg:gap-[13px] max-lg:rounded-base max-lg:border max-lg:bg-white max-lg:px-4 max-lg:py-[15px] max-lg:shadow-[0_6px_18px_rgba(22,60,90,0.05)]"
                >
                  <span
                    aria-hidden="true"
                    className={`min-w-8 text-[15px] font-extrabold text-blue-safe tabular-nums xl:text-[11.25px] max-lg:flex max-lg:h-[30px] max-lg:w-[30px] max-lg:min-w-[30px] max-lg:shrink-0 max-lg:items-center max-lg:justify-center max-lg:rounded-[10px] max-lg:text-[12.5px] max-lg:text-white ${WHO_FILL[i % WHO_FILL.length]}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="m-0 mb-1 text-card-title max-lg:text-[15.5px]">{t(titleId)}</h3>
                    <p className="m-0 text-body-sm leading-[1.6] text-text-secondary xl:max-w-[480px] max-lg:text-[14px] max-lg:leading-[1.55]">
                      {t(bodyId)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ============ FOUNDER + JOURNEY band (design 659–738): the #f4f9fc → #e8f3f9 band with
          its two glows (blue 440 px top-right, green 380 px bottom-left, l. 662–663). */}
      <Section
        tone="pale"
        id="about-journey"
        className="relative overflow-hidden bg-gradient-to-b from-pale-1 to-[#e8f3f9]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-30 -right-30 h-110 w-110 rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.14),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-35 -left-25 h-95 w-95 rounded-pill bg-[radial-gradient(circle,rgba(22,163,74,0.10),transparent_70%)]"
        />
        <div className="container-site relative">
          <div
            className={
              founder
                ? 'grid gap-8.5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20'
                : 'max-w-[720px] xl:max-w-[none]'
            }
          >
            <FounderBand founder={founder} placedText={metrics.placed} t={t} />
            <div data-testid="about-journey">
              <h2 className="m-0 mb-6 text-eyebrow font-extrabold tracking-[1.5px] xl:tracking-[1.125px] text-blue-safe uppercase max-lg:mb-3">
                {t('about.050')}
              </h2>
              {/* SHARED 8.7: the design's gradient rail with ringed dots beside the founder; the
                  W229 rail-to-row only while no founder row is published (the band is then one
                  column). W84: the journey rows have no body. about.052 is legal (UK spelling
                  only — W221 house style); about.057 = "{placed} workers placed, {employers}
                  clients" after the importer (W1). */}
              <Timeline
                variant={founder ? 'rail' : 'rail-to-row'}
                steps={[
                  { when: t('about.051'), title: t('about.052') },
                  { when: t('about.053'), title: t('about.054') },
                  { when: sys('about.journey.m3When'), title: t('about.055') },
                  { when: t('about.056'), title: t('about.057') },
                ]}
              />
              {/* The label says "Partner with us": that intent wins over the design's stale
                  jobsadmire.com/#request-form target. The design's r10 rectangle (l. 715); on
                  phones full width, r14, with its blue shadow (l. 329). */}
              <Link
                prefetch={false}
                href="/partner-with-us"
                className={buttonClassName(
                  'primary',
                  'lg',
                  'mt-6.5 max-lg:mt-4.5 max-lg:w-full max-lg:rounded-[14px] max-lg:shadow-[0_10px_26px_rgba(24,153,213,0.3)]',
                  { shape: 'rect', radius: 10 },
                )}
              >
                {t('about.058')}
              </Link>
            </div>
          </div>
          {/* Stats row (design .ja-stats4, SHARED 12.3): four centred cells with vertical
              dividers — placed / employers / permitDays (45 + home.206 unit) from the metrics
              collection, then the design's 98 % retention as a tagged SAMPLE cell (about.063);
              a centred 2 × 2 on phones (l. 330–333). */}
          <MetricStrip
            bundle={bundle}
            locale={locale}
            variant="centered-divided"
            metrics={['placed', 'employers', 'permitDays']}
            extra={[{ figure: retention, label: t('about.063'), sample: true }]}
            className="relative mt-14 max-lg:mt-8.5"
          />
        </div>
      </Section>

      {/* ============ TECHNOLOGY (design 740–837) */}
      <Section tone="light" id="about-tech">
        <div data-testid="about-tech" className="container-site">
          <h2 className="mt-0 mb-4 text-center text-h2 max-md:text-[27px] max-md:leading-[1.12] max-md:tracking-[-0.9px]">
            {t('about.064')}
          </h2>
          <p className="mx-auto mt-0 mb-11 max-w-[560px] xl:max-w-[420px] text-center text-body-lg text-text-secondary max-md:mb-5.5 max-md:text-[15.5px] max-md:leading-[1.6]">
            {t('about.065')}
          </p>
          {/* The panel (l. 746): #f4f9fc → #e8f3f9, the #d3e6f2 edge, r24, its top-right glow. */}
          <div className="relative grid gap-14 overflow-hidden rounded-hero border border-edge bg-gradient-to-b from-pale-1 to-[#e8f3f9] px-14 py-13 lg:grid-cols-[1.05fr_0.95fr] lg:items-center max-lg:gap-8 max-lg:rounded-lg max-lg:px-5 max-lg:pt-6.5 max-lg:pb-7.5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-30 -right-20 h-95 w-95 rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.12),transparent_70%)]"
            />
            <div className="relative">
              <Eyebrow>{t('about.066')}</Eyebrow>
              {/* The package splits the headline around the highlighted words (W23 permits the join). */}
              <h3 className="mt-2 mb-4 text-h2 max-lg:text-[23px] max-lg:tracking-[-0.8px]">
                {t('about.067')} <span className="text-blue-safe">{t('about.068')}</span>{' '}
                {t('about.069')}
              </h3>
              <p className="m-0 mb-5.5 text-body leading-[1.65] text-text-secondary xl:max-w-[540px] max-lg:mb-4.5 max-lg:text-[15px] max-lg:leading-[1.6]">
                {t('about.070')}
              </p>
              {/* Ticks (l. 752–773): 22 px filled green discs with a white ✓, the AI line a
                  #1E9EE8 → #8b5cf6 disc with ✦; on phones each line is a white/80 mini-card
                  (l. 343–345). */}
              <ul className="m-0 mb-7 flex list-none flex-col gap-3 p-0 max-lg:mb-5 max-lg:gap-2">
                {TECH_POINTS.map((id) => (
                  <li
                    key={id}
                    className="flex items-center gap-3 max-lg:items-start max-lg:gap-2.5 max-lg:rounded-[13px] max-lg:border max-lg:border-[#d9e9f3] max-lg:bg-white/80 max-lg:px-3 max-lg:py-[11px]"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-pill text-[13px] leading-none font-extrabold text-white xl:text-[11px] max-lg:mt-px max-lg:h-5 max-lg:w-5 max-lg:text-[11.5px] ${id === AI_POINT ? 'bg-gradient-to-br from-[#1e9ee8] to-[#8b5cf6]' : 'bg-success'}`}
                    >
                      {id === AI_POINT ? '✦' : '✓'}
                    </span>
                    <span className="text-[15.5px] font-semibold text-ink xl:text-[11.625px] max-lg:text-[14px] max-lg:leading-[1.45]">
                      {t(id)}
                    </span>
                  </li>
                ))}
              </ul>
              {/* "Demo talep edin →" is the design's r11 rectangle (l. 775); phones: full width,
                  r14, then the two store badges as equal halves of one row (l. 346, SHARED 11.2). */}
              <div className="flex flex-wrap items-center gap-3.5 max-lg:gap-2.5">
                {/* W12/W95: whatsapp_click page_cta; the prefill is fixed sys copy. */}
                <ContactCta
                  placement="page_cta"
                  size="lg"
                  external
                  shape="rect"
                  radius={11}
                  href={waLink(settings.whatsappNumber, sys('about.whatsapp.demo'))}
                  className="max-lg:w-full max-lg:rounded-[14px] max-lg:shadow-[0_10px_26px_rgba(24,153,213,0.3)]"
                >
                  {t('about.076')}
                </ContactCta>
                {/* W8/W227: both store badges — the App Store link is set since W227. The
                    design's dark two-line badges (#16202e, l. 776–789) on the light panel are
                    the block's default `dark` face. */}
                <StoreBadges
                  bundle={bundle}
                  locale={locale}
                  android={settings.storeLinks.android}
                  ios={settings.storeLinks.ios}
                  stretch
                  className="max-lg:w-full"
                />
              </div>
            </div>
            {/* Visual (design .ja-tech-visual, l. 792–800): the dashboard slot, 78 % wide and
                300 px tall, with the phone mock — a 150 × 300 #16202e bezel of 8 px, r26 —
                overlapping its right edge from 60 px down. Hidden ≤900 px by the design
                (`.ja-tech-visual { display: none }` in its own ≤ 900 block), so CSS-hidden here
                too (W10). */}
            <div className="relative hidden h-90 lg:block">
              <div className="absolute top-2.5 left-0 w-[78%] rounded-sm shadow-[0_22px_48px_rgba(22,60,90,0.22)] xl:shadow-[0_16.5px_36px_rgba(22,60,90,0.22)]">
                <ImageSlot
                  slot="crm-dashboard"
                  alt={sys('about.tech.dashboardAlt')}
                  width={640}
                  height={300}
                  sizes="(min-width: 901px) 34vw, 1px"
                  cover={{ base: 300, xl: 225 }}
                  className="rounded-sm"
                />
              </div>
              <div className="absolute top-15 right-0 z-[2] h-75 w-37.5 rounded-[26px] bg-ink p-2 shadow-[0_24px_52px_rgba(22,60,90,0.3)] xl:rounded-[19.5px] xl:shadow-[0_18px_39px_rgba(22,60,90,0.3)]">
                <ImageSlot
                  slot="app-screen"
                  alt={sys('about.tech.appAlt')}
                  width={134}
                  height={284}
                  sizes={liquidSizes(100.5, '134px')}
                  cover={{ base: 284, xl: 213 }}
                  className="rounded-[20px] xl:rounded-[15px]"
                />
              </div>
            </div>
          </div>
          {/* Feature cards (l. 803–836): pale r16 cards with a coloured numeral from 901; on
              phones a two-column grid of white bordered cards with 32 px coloured numeral
              squares, bodies hidden (l. 346–356); three columns from 701. */}
          <ul className="m-0 mt-7 grid list-none grid-cols-2 gap-2.5 p-0 md:grid-cols-3 lg:gap-5">
            {FEATURES.map(([titleId, bodyId], i) => (
              <li
                key={titleId}
                className="rounded-base bg-pale-1 px-6 py-6.5 max-lg:flex max-lg:flex-col max-lg:gap-2.5 max-lg:border max-lg:border-border-4 max-lg:bg-white max-lg:px-[13px] max-lg:pt-3.5 max-lg:pb-4 max-lg:shadow-[0_6px_18px_rgba(22,60,90,0.05)]"
              >
                <span
                  aria-hidden="true"
                  className={`mb-2.5 block text-[14px] font-extrabold xl:text-[11px] max-lg:mb-0 max-lg:flex max-lg:h-8 max-lg:w-8 max-lg:items-center max-lg:justify-center max-lg:rounded-[11px] max-lg:text-[13px] max-lg:text-white ${FEATURE_TONE[i % FEATURE_TONE.length]}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-0 mb-1.5 text-card-title max-lg:m-0 max-lg:text-[14.5px] max-lg:leading-[1.25] max-lg:tracking-[-0.2px]">
                  {t(titleId)}
                </h3>
                {/* Bodies are hidden ≤900 px in the design, so hidden lg:block (W10). */}
                <p className="m-0 hidden text-body-sm leading-[1.6] text-text-secondary lg:block">
                  {t(bodyId)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ============ OFFICES + #lisans + GREEN CTA (design 839–918: one pale section, as
          designed). SHARED 14.8: the About office face is page-local (`AboutOfficeCard`) — the
          180 px photo on the left, the about.091 / about.101 pill badge, the design's density;
          its WhatsApp and e-mail lines are ContactLink office_card (W12) and show the
          collection's contacts (W6). */}
      <Section tone="pale" id="about-offices">
        <div className="container-site">
          <div data-testid="about-offices">
            <h2 className="m-0 mb-4 text-center text-h2 max-md:text-[27px] max-md:leading-[1.12] max-md:tracking-[-0.9px]">
              {t('about.089')}
            </h2>
            <p className="mx-auto mt-0 mb-11 max-w-[520px] xl:max-w-[390px] text-center text-body-lg text-text-secondary max-md:mb-5.5 max-md:text-[15.5px] max-md:leading-[1.6]">
              {t('about.090')}
            </p>
            <div className="grid gap-3 md:grid-cols-2 md:gap-7">
              {offices.map((office, i) => (
                <Fragment key={office.key}>
                  {/* "Tek ekip" (about.100) joins the two cards on phones only (design
                      .ja-corridor-link-m, shown ≤ 700, l. 868–872): a swap disc, a dashed line,
                      the label. */}
                  {i === 1 ? (
                    <div aria-hidden="true" className="flex items-center gap-2.75 px-1.5 md:hidden">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border border-tint-border bg-tint text-blue-safe">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          focusable="false"
                        >
                          <path d="M8 3L4 7l4 4" />
                          <path d="M4 7h16" />
                          <path d="M16 21l4-4-4-4" />
                          <path d="M20 17H4" />
                        </svg>
                      </span>
                      <span className="flex-1 border-t-2 border-dashed border-[#cfe3f0]" />
                      <span className="shrink-0 font-extrabold text-text-tertiary uppercase max-md:text-[11px] max-md:tracking-[0.8px]">
                        {t('about.100')}
                      </span>
                    </div>
                  ) : null}
                  <div data-testid={`about-office-${office.key}`}>
                    <AboutOfficeCard
                      office={office}
                      t={t}
                      badgeId={OFFICE_BADGE[office.key]}
                      chipIds={OFFICE_CHIPS[office.key]}
                      photoAlt={sys('about.offices.photoAlt', { city: t(office.cityId) })}
                    />
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          {/* #lisans (D26) is the design's profile strip (l. 898–905): the İŞKUR mark, the legal
              line (about.108, verbatim) and "Şirket Profilini İndir →" (about.109) — disabled
              with the sys.about.profileSoon note until the PDF exists — then the four licence
              documents D26 republishes here. */}
          <LicenceBlock
            title={sys('about.licence.title')}
            body={sys('about.licence.body')}
            legal={t('about.108')}
            openLabel={sys('about.licence.open')}
            pendingLabel={sys('about.licence.pending')}
            profile={{
              slot: PROFILE_SLOT,
              label: t('about.109'),
              href: profileHref,
              soonNote: sys('about.profileSoon'),
            }}
            rows={licenceRows}
          />

          {/* Green band (design 907–918, page-local `GreenBand`). W82: the primary is the object
              href to the Hire Workers request form; the WhatsApp secondary carries a fixed sys
              prefill (W95). */}
          <div data-testid="about-cta" className="mt-7 max-md:mt-3">
            <GreenBand
              title={t('about.110')}
              body={t('about.111')}
              primary={{ label: t('about.112'), href: REQUEST_FORM }}
              secondary={{
                label: t('about.030'),
                href: waLink(settings.whatsappNumber, sys('about.whatsapp.consult')),
                external: true,
              }}
            />
          </div>
        </div>
      </Section>

      {NEWSLETTER_ACTIVE ? (
        <Section tone="band" id="about-newsletter">
          <div className="container-site">
            <NewsletterBand bundle={bundle} locale={locale} active proofId="blog.040" />
          </div>
        </Section>
      ) : null}
    </>
  );
}
