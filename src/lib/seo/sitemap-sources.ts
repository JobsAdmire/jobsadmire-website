import type { MetadataRoute } from 'next';
import type { Locale } from '@/i18n/routing';

/** One detail-page sitemap source: the entries for one locale, read from the bundle or the
 *  Operations feed under that content's ISR tag (docs/SEO.md § Sitemap). */
export type SitemapSource = (locale: Locale) => Promise<MetadataRoute.Sitemap>;

/**
 * W31 — the detail entries `app/sitemap.ts` appends after the static routes. Empty in the
 * foundation: the careers page task edits this literal to add its imported openings source (one
 * function, one line — no runtime push, the array is frozen, W70); blog stays out while `/blog`
 * is noindex (W4) and joins when the Turkish threshold is met.
 * Nothing else may add sitemap URLs — the static table is the other, only, source.
 */
export const DETAIL_SITEMAP_SOURCES: readonly SitemapSource[] = Object.freeze([]);

/** Every source's entries for one locale, in registration order. */
export async function detailSitemapEntries(
  locale: Locale,
  sources: readonly SitemapSource[] = DETAIL_SITEMAP_SOURCES,
): Promise<MetadataRoute.Sitemap> {
  const lists = await Promise.all(sources.map((source) => source(locale)));
  return lists.flat();
}
