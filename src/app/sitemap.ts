import type { MetadataRoute } from 'next';
import { pathnames, routing } from '@/i18n/routing';
import {
  absoluteUrl,
  localeAlternates,
  NOINDEX_PATHNAMES,
  UNBUILT_PATHNAMES,
  type StaticPathname,
} from '@/lib/seo/routes';
import { detailSitemapEntries } from '@/lib/seo/sitemap-sources';

export const revalidate = 900;

/** Listed nowhere: the never-indexed set `robots.ts` disallows (`NOINDEX_PATHNAMES`, M-3) plus
 *  the routes that have no page yet (`UNBUILT_PATHNAMES`, W20) — both from `routes.ts`, never a
 *  second copy here. */
const EXCLUDED: ReadonlySet<string> = new Set<string>([...NOINDEX_PATHNAMES, ...UNBUILT_PATHNAMES]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes here; the dynamic keys are filtered by pattern. Detail entries (careers
  // openings; blog once it leaves noindex, W4) come from DETAIL_SITEMAP_SOURCES (W31), read
  // from the bundle under their own ISR tags.
  const hrefs = (Object.keys(pathnames) as (keyof typeof pathnames)[]).filter(
    (href): href is StaticPathname => !href.includes('[') && !EXCLUDED.has(href),
  );
  const statics = routing.locales.flatMap((locale) =>
    hrefs.map((href) => ({
      url: absoluteUrl(locale, href),
      alternates: localeAlternates(href),
      changeFrequency: 'weekly' as const,
      priority: href === '/' ? 1 : 0.7,
    })),
  );
  const details = await Promise.all(routing.locales.map((locale) => detailSitemapEntries(locale)));
  return [...statics, ...details.flat()];
}
