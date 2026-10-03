import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { NewsletterPage } from '../_components/NewsletterPage';
import { confirmNewsletter } from './actions';

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
      href: '/newsletter/confirm',
      bundle,
      pageKey: 'newsletterConfirm',
      fallbackTitle: sys('seo.newsletterConfirm.title'),
      fallbackDescription: sys('seo.newsletterConfirm.description'),
    }),
    // A one-shot token page is never indexed, whatever a later page record says (spec §3.1).
    robots: { index: false, follow: false },
  };
}

export default async function NewsletterConfirmPage({
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
  // Nothing is forwarded during the render — the token travels only on the visitor's click.
  return (
    <NewsletterPage
      kind="confirm"
      token={token}
      action={confirmNewsletter}
      email={settings.email}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
