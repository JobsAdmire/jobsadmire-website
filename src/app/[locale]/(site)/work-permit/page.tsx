import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getRateConfig } from '@/content/collections';
import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { heroBadge } from './_lib/badge';
import { waPrefill } from './_lib/prefill';
import { buildWizardProps } from './_lib/wizard-props';
import { AudienceRouter } from './_sections/AudienceRouter';
import { Costs } from './_sections/Costs';
import { Documents } from './_sections/Documents';
import { Exemptions } from './_sections/Exemptions';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { JumpNav } from './_sections/JumpNav';
import { PermitCta } from './_sections/PermitCta';
import { PermitTypes } from './_sections/PermitTypes';
import { Process } from './_sections/Process';
import { RelatedArticles } from './_sections/RelatedArticles';
import { Renewal } from './_sections/Renewal';
import { RoutesComparison } from './_sections/RoutesComparison';
import { Rules } from './_sections/Rules';
import { Timeline } from './_sections/Timeline';

/** W150: the hero's D17 dated badge switches off at `rateConfig.reviewDueAt`; a daily revalidate
 *  makes that happen without a deploy (the route stays statically generated). */
export const revalidate = 86400;

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
  // The package carries no SEO string for this page (the design's <title>/meta sit outside the
  // catalogue), so `pages.wp` has '' ids and these sys fallbacks win (W23/W38). OG image:
  // /og/{locale}/wp.png, titled by the same key, CDN-cached (W123).
  return buildMetadata({
    locale,
    href: '/work-permit',
    bundle,
    pageKey: 'wp',
    fallbackTitle: sys('seo.wp.title'),
    fallbackDescription: sys('seo.wp.description'),
  });
}

export default async function WorkPermit({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  // D17/W1: every package id goes through makeTf, so wp.030/264/274 render their metrics.
  const tf = makeTf(bundle, locale);
  const s = bundle.settings;
  const rateConfig = getRateConfig(bundle);
  const wizard = buildWizardProps({
    locale,
    whatsappNumber: s.whatsappNumber,
    quotaRatio: rateConfig.quotaRatio,
    tf,
    sys,
  });
  // W81: the bar renders its tel:/wa.me CTAs through ContactCta → ContactLink (page_cta); the
  // hire CTA is an internal link. Faces are variants (W122/W127), never caller classes.
  const stickyCtas: StickyCta[] = [
    { label: tf('wp.054'), href: telLink(s.phone), variant: 'outline-blue', icon: 'phone' },
    {
      label: tf('wp.035'),
      href: waLink(s.whatsappNumber, waPrefill(sys, 'question')),
      variant: 'outline-green',
      external: true,
    },
    { label: tf('wp.055'), href: '/hire-workers', variant: 'primary' },
  ];
  // No <main>: the (site) layout's SiteChrome owns it (R31). Section order = the design's.
  return (
    <>
      <Hero
        bundle={bundle}
        locale={locale}
        tf={tf}
        badge={heroBadge(rateConfig, locale, sys)}
        wizard={wizard}
      />
      {/* design .ja-sticky: after 700 px of scroll, hidden while #permit-cta is near (W18) */}
      <StickyCtaBar
        message={tf('wp.053')}
        ctas={stickyCtas}
        hideNearId="permit-cta"
        tone="light"
        live
      />
      <JumpNav tf={tf} />
      <AudienceRouter bundle={bundle} tf={tf} />
      <RoutesComparison tf={tf} />
      <PermitTypes bundle={bundle} tf={tf} />
      <Rules tf={tf} />
      <Exemptions bundle={bundle} tf={tf} />
      <Process bundle={bundle} tf={tf} />
      <Timeline tf={tf} />
      <Costs bundle={bundle} tf={tf} />
      <Documents tf={tf} locale={locale} />
      <Renewal bundle={bundle} tf={tf} />
      <Faq bundle={bundle} locale={locale} tf={tf} />
      <RelatedArticles bundle={bundle} locale={locale} tf={tf} />
      <PermitCta bundle={bundle} tf={tf} />
    </>
  );
}
