import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { Link } from '@/i18n/navigation';
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
  return buildMetadata({
    locale,
    href: '/',
    bundle,
    pageKey: 'home',
    fallbackTitle: 'JobsAdmire',
    fallbackDescription: t('home.188'),
  });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <h1 data-testid="home-h1">{locale === 'tr' ? 'Ana sayfa' : 'Home'}</h1>
      <Link href="/hire-workers">hire</Link>
    </>
  );
}
