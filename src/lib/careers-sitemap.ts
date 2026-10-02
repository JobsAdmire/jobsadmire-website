import 'server-only';
import type { MetadataRoute } from 'next';
import type { Locale } from '@/i18n/routing';
import { absoluteUrl, localeAlternates } from '@/lib/seo/routes';
import { listOpenings } from './careers';
import { detailHref } from './careers-pure';

/**
 * W31/W70 — the careers detail entries for one locale: every current opening (read under the
 * `openings` tag), with both locale alternates (the Operations slug is the same in both). Empty
 * without a door; a feed failure throws and the sitemap route keeps its last good version (ISR,
 * `revalidate = 900`). No `lastModified`: the API exposes the posting date, not an edit date.
 */
export async function careersSitemapSource(locale: Locale): Promise<MetadataRoute.Sitemap> {
  return (await listOpenings()).map((o) => {
    const href = detailHref(o.slug);
    return {
      url: absoluteUrl(locale, href),
      alternates: localeAlternates(href),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });
}
