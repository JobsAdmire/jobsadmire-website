import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
import { getMetric } from '@/content/collections';
import { BRAND } from '@/design/assets/brand';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { MetricStrip } from '@/design/blocks/MetricStrip';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { buttonClassName } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Timeline } from '@/design/primitives/Timeline';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { CorridorCard } from './_components/CorridorCard';

/** W82: the page's one cross-page hash target, as an object href so next-intl localises the
 *  pathname and keeps the hash (`/isci-talebi#request-form`, `/en/hire-workers#request-form`).
 *  T2 renders the id (W152/W158); `DEFAULT_CTAS` points at the same place (W17). */
const REQUEST_FORM = { pathname: '/hire-workers', hash: '#request-form' } as const;

/** Who-we-are rows (design 633–656): title id, body id. about.046 is legal-flagged (verbatim). */
const WHO_ROWS = [
  ['about.041', 'about.042'],
  ['about.043', 'about.044'],
  ['about.045', 'about.046'],
] as const;

/** Technology panel ticks (design 757–777); about.074 is the design's AI-gradient tick. */
const TECH_POINTS = ['about.071', 'about.072', 'about.073', 'about.074', 'about.075'] as const;

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

  return (
    <>
      {/* ============ HERO (design 515–616). §10 row 4: no hero photo on this page ("gradients
          elsewhere"), so the h1 is the LCP element (D26). The design's `about-hero` image-slot is
          not rendered: the gradient IS the Phase A design, and a placeholder behind the h1 would
          compete with it. Section padding override: accepted page-local (reconcile-rulings.md
          "Section gradient tone/padding override (T4/T6)"; W119/W122/W155 — py-16 vs
          pt-8/pb-12 are different property groups, longhand wins by Tailwind's own ordering). */}
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
              <p className="m-0 text-stat leading-none font-extrabold">
                {sys('about.who.badgeYear')}
              </p>
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
            {/* Visual (design .ja-tech-visual): hidden ≤900 px by the design (confirmed:
                `.ja-tech-visual { display: none }` sits inside the design file's own
                `@media (max-width: 900px)` block), so CSS-hidden here too (W10). */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-4">
              <ImageSlot
                slot="crm-dashboard"
                alt={sys('about.tech.dashboardAlt')}
                width={640}
                height={400}
                sizes="(min-width: 901px) 34vw, 1px"
                className="rounded-sm"
              />
              {/* W129: ImageSlot owns its box (w-full h-auto object-cover on both branches) — a
                  narrower slot wraps it in a sized div instead of a w-* class on the slot itself. */}
              <div className="w-[150px]">
                <ImageSlot
                  slot="app-screen"
                  alt={sys('about.tech.appAlt')}
                  width={150}
                  height={300}
                  sizes="150px"
                  className="rounded-lg"
                />
              </div>
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
    </>
  );
}
