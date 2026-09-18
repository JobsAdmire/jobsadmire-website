import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { SiteChrome } from '@/design/chrome/SiteChrome';
import { routing } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { SITE_URL } from '@/lib/seo/routes';
import '../globals.css';

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-archivo',
});

/** Per-page title/description/alternates come from `buildMetadata`; this only anchors the
 *  origin every relative metadata URL resolves against. */
export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: 'JobsAdmire' };

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
  const t = makeT(bundle);
  return (
    <html lang={locale} className={archivo.variable}>
      <body>
        {/* Site-wide graph nodes (docs/SEO.md): Organization/EmploymentAgency on every page. */}
        <JsonLd
          data={organizationJsonLd(bundle.settings, {
            name: 'JobsAdmire',
            description: t('home.188'),
          })}
        />
        <JsonLd data={websiteJsonLd(bundle.settings)} />
        <NextIntlClientProvider>
          <SiteChrome locale={locale} bundle={bundle}>
            {children}
          </SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
