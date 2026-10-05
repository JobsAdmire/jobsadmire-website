import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { routing } from '@/i18n/routing';
import { formatDate } from '@/lib/format/date/formatDate';
import { buildMetadata } from '@/lib/seo/metadata';
import { submitFraud, uploadEvidence } from './actions';
import { LookupProvider } from './_components/LookupContext';
import { StickySearch } from './_components/StickySearch';
import { ID_EXAMPLE } from './_lib/lookup';
import { readRegister } from './_lib/register';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Report } from './_sections/Report';
import { Result } from './_sections/Result';
import { Structure } from './_sections/Structure';

/** W225: this page's server action uploads a file first (up to `UPLOAD_TIMEOUT_MS`, 15 s) and then
 *  posts the form (up to `ATTEMPT_TIMEOUT_MS`, 9 s) — past the 10 s default of a Vercel Hobby function
 *  without Fluid compute, which would kill a slow upload mid-way and lose the lead. 60 s is the Hobby
 *  ceiling either way. */
export const maxDuration = 60;

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
 *  `searchParams` (V-1: the `?id=` deep link is read by the lookup provider after hydration, so
 *  the route stays static). Phase A: the register is empty (D23 keeps the fixture out of
 *  production) and the founder row published (owner, 2026-10-05). Order (the design's): hero
 *  with the lookup → the lookup's answer card (`#verify`, only once a query is long enough) →
 *  structure (founder strip + the register's frame) → report → the phones-only FAQ; the sticky
 *  mini search (desktop, past 620 px) shares the lookup's query (`LookupProvider`). */
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
    <LookupProvider>
      <Hero
        bundle={bundle}
        locale={locale}
        register={register}
        founder={founder}
        updatedLabel={updatedLabel}
      />
      <Result bundle={bundle} />
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
        register={register}
        submitFraud={submitFraud}
        uploadEvidence={uploadEvidence}
      />
      <Faq bundle={bundle} locale={locale} founder={founder} register={register} />
      {/* S0s.1: the design's sticky mini search (W202's anchors bar is retired with it). */}
      <StickySearch
        label={t('verify.020')}
        inputLabel={t('verify.032')}
        placeholder={`${t('verify.067')} — ${ID_EXAMPLE}`}
      />
    </LookupProvider>
  );
}
