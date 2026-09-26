import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  // No `pages.hire` record in the Phase A bundle yet, so the site-level fallbacks stand until
  // WP2 fills the page records.
  return buildMetadata({
    locale,
    href: '/hire-workers',
    bundle,
    pageKey: 'hire',
    fallbackTitle: 'JobsAdmire',
    fallbackDescription: t('home.188'),
  });
}

export default async function HireWorkers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <h1 data-testid="hire-h1">{locale}</h1>;
}
