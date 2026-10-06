import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { getBlogBundle } from '@/content/blog';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { submitCallback, submitHire } from './_home/actions';
import { CalculatorStrip } from './_home/sections/CalculatorStrip';
import { ChoiceCards } from './_home/sections/ChoiceCards';
import { ContactStrip } from './_home/sections/ContactStrip';
import { FaqSection } from './_home/sections/FaqSection';
import { GuidesSection } from './_home/sections/GuidesSection';
import { Hero } from './_home/sections/Hero';
import { HeroForm } from './_home/sections/HeroForm';
import { LiveCaseBar } from './_home/sections/LiveCaseBar';
import { NetworkSection } from './_home/sections/NetworkSection';
import { PoolSection } from './_home/sections/PoolSection';
import { PortalSection } from './_home/sections/PortalSection';
import { ProcessSection } from './_home/sections/ProcessSection';
import { SeasonSection } from './_home/sections/SeasonSection';
import { TeamSection } from './_home/sections/TeamSection';
import { WorkWithUs } from './_home/sections/WorkWithUs';

/** W150 (D17): the calculator teaser's dated badge and eyebrow switch off at
 *  `rateConfig.reviewDueAt`; the page is statically generated, so it re-renders daily. */
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
  // The page record `home` carries no package SEO string (titleId/descriptionId are ''), so the
  // sys.seo.home.* copy is the title/description and the OG image's title (W23/W38).
  return buildMetadata({
    locale,
    href: '/',
    bundle,
    pageKey: 'home',
    fallbackTitle: sys('seo.home.title'),
    fallbackDescription: sys('seo.home.description'),
  });
}

/** The homepage (design/JobsAdmire Homepage v4), section for section in the design's order. No
 *  <main> here — SiteChrome owns it (R31). Every section renders (owner 2026-10-05): the case bar
 *  and the candidate pool show the design's sample content with the `SampleTag` (page-local
 *  constants, D23), the team its published founder, the guides the `blog` rows; no StickyCtaBar
 *  (the sticky header carries this page's #proposal CTA). */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  // The guides read the `blog` rows: the bundle with the blog source applied (W248).
  const bundle = await getBlogBundle(locale);
  const section = { locale, bundle };
  return (
    <>
      <Hero
        {...section}
        form={<HeroForm {...section} actions={{ hire: submitHire, callback: submitCallback }} />}
      />
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
      <ContactStrip {...section} />
    </>
  );
}
