import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { formatDate } from '@/lib/format/date/formatDate';
import { buildMetadata } from '@/lib/seo/metadata';
import { submitFraud, uploadEvidence } from './actions';
import { readRegister } from './_lib/register';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Report } from './_sections/Report';
import { Structure } from './_sections/Structure';

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
  // The record `verify` carries no package SEO string (titleId '') → the sys fallbacks (W23/W38).
  return buildMetadata({
    locale,
    href: '/verify',
    bundle,
    pageKey: 'verify',
    fallbackTitle: sys('seo.verify.title'),
    fallbackDescription: sys('seo.verify.description'),
  });
}

/** /temsilci-dogrulama · /en/verify — SSG (no dated rate badge, W150). The page never reads
 *  `searchParams` (V-1: the `?id=` deep link is read by the lookup island after hydration, so
 *  the route stays static). Phase A: the register is empty (D23 keeps the fixture out of
 *  production) and the founder row unpublished (W86). */
export default async function VerifyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  const register = readRegister(bundle);
  const founder = getCollection(bundle, 'founder').find((row) => row.published) ?? null;
  // D17: the dated line exists only when the register has rows — never "today".
  const updatedLabel = register.updatedAt
    ? `${t('verify.225')} ${formatDate(register.updatedAt.slice(0, 10), locale)}`
    : null;
  return (
    <>
      <Hero
        bundle={bundle}
        locale={locale}
        register={register}
        founder={founder}
        updatedLabel={updatedLabel}
      />
      <Structure
        bundle={bundle}
        locale={locale}
        register={register}
        founder={founder}
        updatedLabel={updatedLabel}
      />
      <Report
        bundle={bundle}
        locale={locale}
        submitFraud={submitFraud}
        uploadEvidence={uploadEvidence}
      />
      <Faq bundle={bundle} locale={locale} founder={founder} />
      {/* V-5: the design's sticky mini search bar (a second, unlabelled input) → two in-page
          anchors, from lg; it steps aside once the report section is near. */}
      <StickyCtaBar
        message={t('verify.020')}
        showAfterPx={620}
        hideNearId="report"
        live
        ctas={[
          { label: t('verify.067'), href: '#check', variant: 'inverse' },
          { label: t('verify.015'), href: '#report', variant: 'danger' },
        ]}
      />
    </>
  );
}
