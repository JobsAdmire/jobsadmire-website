import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
import { getMetric } from '@/content/collections';
import { BRAND } from '@/design/assets/brand';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { MetricStrip } from '@/design/blocks/MetricStrip';
import { buttonClassName } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { CorridorCard } from './_components/CorridorCard';

/** W82: the page's one cross-page hash target, as an object href so next-intl localises the
 *  pathname and keeps the hash (`/isci-talebi#request-form`, `/en/hire-workers#request-form`).
 *  T2 renders the id (W152/W158); `DEFAULT_CTAS` points at the same place (W17). */
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
    </>
  );
}
