import type { MetadataRoute } from 'next';
import { pathnames, routing } from '@/i18n/routing';
import { absoluteUrl, localeAlternates } from '@/lib/seo/routes';

export const revalidate = 900;

/** Listed nowhere because they are never indexed: the conversion page, the portal door and the
 *  newsletter one-shot pages (docs/SEO.md — same set robots.ts disallows). */
const EXCLUDED: ReadonlySet<string> = new Set([
  '/thank-you',
  '/portal-login',
  '/newsletter/confirm',
  '/newsletter/unsubscribe',
]);

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
