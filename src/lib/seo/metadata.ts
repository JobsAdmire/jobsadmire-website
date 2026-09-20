import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
// R23: `@/content/pure`, not the adapter — the adapter is `server-only` and would make this
// module unimportable from a unit test.
import { makeT } from '@/content/pure';
import { absoluteUrl, localeAlternates, SITE_URL, type Href } from './routes';

/** Page metadata from the content bundle's page record, with fallbacks for the Phase A pages
 *  the bundle has no record for yet (docs/SEO.md: no hard-typed metadata in components). */
export function buildMetadata(args: {
  locale: Locale;
  href: Href;
  bundle: Bundle;
  pageKey: string;
  fallbackTitle: string;
  fallbackDescription: string;
}): Metadata {
  const { locale, href, bundle, pageKey } = args;
  const t = makeT(bundle);
  const seo = bundle.pages[pageKey];
  // '' = the page record exists but the package has no SEO string for it (T0b); the page's
  // sys.seo.<pageKey>.* copy arrives as the fallback (W23/W38). Task 4's rewrite keeps this.
  const title = seo?.titleId ? t(seo.titleId) : args.fallbackTitle;
  const description = seo?.descriptionId ? t(seo.descriptionId) : args.fallbackDescription;
  const canonical = seo?.canonical ?? absoluteUrl(locale, href);
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical, ...localeAlternates(href) },
    robots:
      seo?.robots === 'noindex' ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'JobsAdmire',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
      // WP2 generates the per-page OG images (docs/SEO.md); this is the site-wide default.
      images: seo?.ogImage ? [seo.ogImage] : ['/opengraph-image.png'],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}
