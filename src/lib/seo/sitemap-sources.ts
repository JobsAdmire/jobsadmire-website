import type { MetadataRoute } from 'next';
import type { Locale } from '@/i18n/routing';
import { careersSitemapSource } from '@/lib/careers-sitemap';

/** One detail-page sitemap source: the entries for one locale, read from the bundle or the
 *  Operations feed under that content's ISR tag (docs/SEO.md § Sitemap). */
export type SitemapSource = (locale: Locale) => Promise<MetadataRoute.Sitemap>;

/**
 * W31 — the detail entries `app/sitemap.ts` appends after the static routes. The careers
 * openings source (`src/lib/careers-sitemap.ts`, WP2b T11) is the one entry — added by editing
 * this literal, never by a runtime push (W70); blog stays out while `/blog` is noindex (W4) and
 * joins when the Turkish threshold is met.
 * Nothing else may add sitemap URLs — the static table is the other, only, source.
 */
export const DETAIL_SITEMAP_SOURCES: readonly SitemapSource[] = Object.freeze([
  careersSitemapSource,
]);

/** Every source's entries for one locale, in registration order. */
export async function detailSitemapEntries(
  locale: Locale,
  sources: readonly SitemapSource[] = DETAIL_SITEMAP_SOURCES,
): Promise<MetadataRoute.Sitemap> {
  const lists = await Promise.all(sources.map((source) => source(locale)));
  return lists.flat();
}
