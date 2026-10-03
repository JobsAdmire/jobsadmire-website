import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { NewsletterPage } from '../_components/NewsletterPage';
import { unsubscribeNewsletter } from './actions';

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
  return {
    ...buildMetadata({
      locale,
      href: '/newsletter/unsubscribe',
      bundle,
      pageKey: 'newsletterUnsubscribe',
      fallbackTitle: sys('seo.newsletterUnsubscribe.title'),
      fallbackDescription: sys('seo.newsletterUnsubscribe.description'),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function NewsletterUnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const [{ locale }, { token }] = await Promise.all([params, searchParams]);
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const { settings } = await getBundle(locale);
  return (
    <NewsletterPage
      kind="unsubscribe"
      token={token}
      action={unsubscribeNewsletter}
      email={settings.email}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
