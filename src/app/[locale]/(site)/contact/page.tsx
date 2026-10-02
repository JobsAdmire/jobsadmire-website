import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getOffice } from '@/content/collections';
import { routing } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/seo/routes';
import { submitCallback, submitContact, submitVisit } from './actions';
import { contactPageJsonLd } from './_lib/jsonld';
import { partnerLineOf } from '@/lib/contact/partner-line';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Message } from './_sections/Message';
import { Offices } from './_sections/Offices';

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
  // The record `contact` carries no package SEO string (titleId '') → the sys fallbacks (W23/W38).
  return buildMetadata({
    locale,
    href: '/contact',
    bundle,
    pageKey: 'contact',
    fallbackTitle: sys('seo.contact.title'),
    fallbackDescription: sys('seo.contact.description'),
  });
}

/** /iletisim · /en/contact — SSG (no dated badge, W150); the three forms post through ./actions. */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const t = makeTf(bundle, locale);
  const { settings } = bundle;
  return (
    <>
      <JsonLd
        data={contactPageJsonLd({
          name: t('contact.228'),
          url: absoluteUrl(locale, '/contact'),
          locale,
          siteUrl: settings.siteUrl,
          phone: settings.phone,
          partnerPhone: partnerLineOf(settings).phone,
          email: settings.email,
          hours: getOffice(bundle, 'antalya').hours,
        })}
      />
      <Hero bundle={bundle} locale={locale} submitCallback={submitCallback} />
      <Message bundle={bundle} locale={locale} submitContact={submitContact} />
      <Offices bundle={bundle} locale={locale} submitVisit={submitVisit} />
      <Faq bundle={bundle} locale={locale} />
    </>
  );
}
