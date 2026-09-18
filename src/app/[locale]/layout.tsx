import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { SiteChrome } from '@/design/chrome/SiteChrome';
import { routing } from '@/i18n/routing';
import '../globals.css';

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-archivo',
});

export const metadata: Metadata = { title: 'JobsAdmire' };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  return (
    <html lang={locale} className={archivo.variable}>
      <body>
        <NextIntlClientProvider>
          <SiteChrome locale={locale} bundle={bundle}>
            {children}
          </SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
