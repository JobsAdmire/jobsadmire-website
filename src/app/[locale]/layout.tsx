import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GtmLoader } from '@/analytics/GtmLoader';
import { getBundle, makeT } from '@/content/adapter';
import { ClientIslands } from '@/design/chrome/ClientIslands';
import { pickClientMessages } from '@/i18n/client-messages';
import { routing } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { SITE_URL } from '@/lib/seo/routes';
import '../globals.css';

/** W188 (revisits W149): `optional`, not `swap` — the browser never swaps the web font in after
 *  first paint, so its arrival cannot rewrap a headline and shift layout (under `swap` the
 *  Turkish Hire Workers h1 went from two lines to three, CLS 0.116). Both subsets stay declared,
 *  so next/font still preloads both files; on a cold slow first visit the DOCUMENT keeps
 *  next/font's size-adjusted fallback for the whole visit (client-side navigations included)
 *  until the next full page load (W188/W189). */
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700', '800'],
  display: 'optional',
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
  const messages = await getMessages();
  const { analytics } = bundle.settings;
  return (
    <html lang={locale} className={archivo.variable}>
      <body>
        {/* D13: consent defaults denied inline, before any tag; GA4/Ads load only inside the
            container. Off entirely when the bundle turns consent mode off. */}
        {analytics.consentMode && <GtmLoader gtmId={analytics.gtmId} />}
        {/* Site-wide graph nodes (docs/SEO.md): Organization/EmploymentAgency on every page. */}
        <JsonLd
          data={organizationJsonLd(bundle.settings, {
            name: 'JobsAdmire',
            description: t('home.188'),
          })}
        />
        <JsonLd data={websiteJsonLd(bundle.settings)} />
        {/* W148 (inverting W90): client components get only the sys.* namespaces a client
            module reads (CLIENT_SYS); everything else is read by server code and never rides the
            RSC payload. */}
        <NextIntlClientProvider messages={pickClientMessages(messages)}>
          {/* W19: the chrome is mounted by the route-group layouts — `(site)` default,
              `(minimal)` without rail/FAB, `(bare)` none — so `children` here is a group
              layout, never a page. */}
          {children}
          {/* Both islands load as their own chunks after hydration (`ssr: false`), so neither
              is in the initial script graph. R38 is unchanged and now also decides whether the
              consent chunk is fetched at all: no container id means no tag can fire, so there
              is nothing to consent to — asking anyway would be a dark pattern. Mounted after
              the chrome so the sheet is last in the tab order, not first. */}
          <ClientIslands
            locale={locale}
            consent={analytics.consentMode && Boolean(analytics.gtmId)}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
