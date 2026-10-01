import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { ChoiceCards } from './_home/sections/ChoiceCards';
import { Hero } from './_home/sections/Hero';
import { LiveCaseBar } from './_home/sections/LiveCaseBar';
import { PoolSection } from './_home/sections/PoolSection';

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
 *  <main> here — SiteChrome owns it (R31). Sections that need live data decide for themselves
 *  whether to render (W6). */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const section = { locale, bundle };
  return (
    <>
      {/* Cycle 2 mounts the lead card in this slot; the id exists from the first commit because
          the header CTA (CTA_BY_PATHNAME['/']) and the launch anchor sweep point at it. */}
      <Hero {...section} form={<div id="proposal" className="scroll-mt-[90px]" />} />
      <LiveCaseBar {...section} />
      <ChoiceCards {...section} />
      <PoolSection {...section} />
    </>
  );
}
