import type { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { SiteChrome } from '@/design/chrome/SiteChrome';
import { routing } from '@/i18n/routing';

/** W19: the default chrome — every public page, careers/blog detail and the `[...rest]` 404.
 *  `(minimal)` drops the social rail and the WhatsApp FAB; `(bare)` mounts no chrome at all.
 *  Group layouts only mount the chrome: html/body, fonts, providers, the client islands, the
 *  site-wide JSON-LD and `generateStaticParams` stay on the locale layout above. */
export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  // `getBundle` is React `cache()`-wrapped: the locale layout resolved this bundle already,
  // so this is the same object, not a second load.
  const bundle = await getBundle(locale);
  return (
    <SiteChrome locale={locale} bundle={bundle} variant="default">
      {children}
    </SiteChrome>
  );
}
