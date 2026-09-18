import type { MetadataRoute } from 'next';
import { pathnames, routing } from '@/i18n/routing';
import { absoluteUrl, localeAlternates, NOINDEX_PATHNAMES } from '@/lib/seo/routes';

export const revalidate = 900;

/** Listed nowhere because they are never indexed — literally the same set `robots.ts` disallows
 *  (`NOINDEX_PATHNAMES`, M-3), not a second copy of it. */
const EXCLUDED: ReadonlySet<string> = new Set<string>(NOINDEX_PATHNAMES);

type StaticPathname = Exclude<keyof typeof pathnames, `${string}[${string}`>;

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes only. Blog and careers detail entries arrive in WP2, read from the bundle
  // under the `sitemap` ISR tag; nothing is fetched here yet.
  const hrefs = (Object.keys(pathnames) as (keyof typeof pathnames)[]).filter(
    (href): href is StaticPathname => !href.includes('[') && !EXCLUDED.has(href),
  );
  return routing.locales.flatMap((locale) =>
    hrefs.map((href) => ({
      url: absoluteUrl(locale, href),
      alternates: localeAlternates(href),
      changeFrequency: 'weekly' as const,
      priority: href === '/' ? 1 : 0.7,
    })),
  );
}
