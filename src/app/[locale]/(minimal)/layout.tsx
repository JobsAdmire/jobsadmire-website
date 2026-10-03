import type { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { SiteChrome } from '@/design/chrome/SiteChrome';
import { routing } from '@/i18n/routing';

/** W19: `SiteChrome variant="minimal"` — pages that must not compete with their own single
 *  action: the conversion page, the four legal pages and the two newsletter one-shots. No
 *  social rail, no WhatsApp FAB; slim bar, header, footer and mobile bar stay. */
export default async function MinimalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  return (
    <SiteChrome locale={locale} bundle={bundle} variant="minimal">
      {children}
    </SiteChrome>
  );
}
