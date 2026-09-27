import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
// R23: `@/content/pure`, not the adapter — the adapter is `server-only` and would make this
// module unimportable from a unit test.
import { makeT } from '@/content/pure';
import { absoluteUrl, localeAlternates, pageOgImageUrl, SITE_URL, type Href } from './routes';

/**
 * One locale's alternate for a page whose slug is authored per locale (blog, careers — D16):
 * an absolute URL, an already-localized external path (`/en/blog/x`), or the typed dynamic
 * `Href` (`{ pathname: '/blog/[slug]', params: { slug } }`) resolved for that locale. A bare
 * `pathnames` key is deliberately NOT accepted as a string — it would be indistinguishable from
 * an external path. Static pages pass no `alternates` at all and get `localeAlternates(href)`.
 */
export type AlternateTarget = string | Exclude<Href, string>;

export type MetadataOpenGraphOverride = {
  type?: 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Absolute URLs. Wins over the page record's `ogImage` and over the generated route image. */
  images?: string[];
};

function resolveAlternate(locale: Locale, target: AlternateTarget): string {
  if (typeof target !== 'string') return absoluteUrl(locale, target);
  return /^https?:\/\//.test(target) ? target : `${SITE_URL}${target}`;
}

/** hreflang map from an explicit per-locale override: only the locales given, plus the page's
 *  own locale from `href` when the override omits it (a page missing its own locale is a
 *  defect — docs/SEO.md), plus `x-default` = TR when TR exists, else the page's own. */
function overrideAlternates(
  locale: Locale,
  href: Href,
  override: Partial<Record<Locale, AlternateTarget>>,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const target = override[l];
    if (target !== undefined) languages[l] = resolveAlternate(l, target);
    else if (l === locale) languages[l] = absoluteUrl(locale, href);
  }
  languages['x-default'] = languages[routing.defaultLocale] ?? languages[locale];
  return languages;
}

/** Page metadata from the content bundle's page record, with fallbacks for the Phase A pages
 *  the bundle has no record for yet (docs/SEO.md: no hard-typed metadata in components). */
export function buildMetadata(args: {
  locale: Locale;
  href: Href;
  bundle: Bundle;
  pageKey: string;
  fallbackTitle: string;
  fallbackDescription: string;
  alternates?: Partial<Record<Locale, AlternateTarget>>;
  openGraph?: MetadataOpenGraphOverride;
}): Metadata {
  const { locale, href, bundle, pageKey } = args;
  const t = makeT(bundle);
  const seo = bundle.pages[pageKey];
  // '' = the page record exists but the package has no SEO string for it (T0b); the page's
  // sys.seo.<pageKey>.* copy arrives as the fallback (W23/W38). Task 4's rewrite keeps this.
  const title = seo?.titleId ? t(seo.titleId) : args.fallbackTitle;
  const description = seo?.descriptionId ? t(seo.descriptionId) : args.fallbackDescription;
  const canonical = seo?.canonical ?? absoluteUrl(locale, href);
  const languages = args.alternates
    ? overrideAlternates(locale, href, args.alternates)
    : localeAlternates(href).languages;
  // Explicit override → the record's own image → the generated route (docs/SEO.md § OG images).
  const images =
    args.openGraph?.images ?? (seo?.ogImage ? [seo.ogImage] : [pageOgImageUrl(locale, pageKey)]);
  const og = {
    title,
    description,
    url: canonical,
    siteName: 'JobsAdmire',
    locale: locale === 'tr' ? 'tr_TR' : 'en_US',
    images,
  };
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical, languages },
    robots:
      seo?.robots === 'noindex' ? { index: false, follow: false } : { index: true, follow: true },
    openGraph:
      args.openGraph?.type === 'article'
        ? {
            ...og,
            type: 'article',
            publishedTime: args.openGraph.publishedTime,
            modifiedTime: args.openGraph.modifiedTime,
            authors: args.openGraph.authors,
          }
        : { ...og, type: 'website' },
    // Twitter does not inherit `openGraph.images` once a `twitter` block is present.
    twitter: { card: 'summary_large_image', title, description, images },
  };
}
