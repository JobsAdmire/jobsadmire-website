import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { pathnames, routing } from '@/i18n/routing';
import {
  absoluteUrl,
  localeAlternates,
  NOINDEX_PATHNAMES,
  UNBUILT_PATHNAMES,
  type StaticPathname,
} from '@/lib/seo/routes';
import { detailSitemapEntries } from '@/lib/seo/sitemap-sources';

/** W250: the blog's 60 s floor — moot while `sitemap()` renders per request (below), kept as the
 *  floor should it ever be prerendered again. */
export const revalidate = 60;

/** Listed nowhere: the never-indexed set `robots.ts` disallows (`NOINDEX_PATHNAMES`, M-3) plus
 *  the routes that have no page yet (`UNBUILT_PATHNAMES`, W20) — both from `routes.ts`, never a
 *  second copy here. */
const EXCLUDED: ReadonlySet<string> = new Set<string>([...NOINDEX_PATHNAMES, ...UNBUILT_PATHNAMES]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // W250: per request (`ƒ` in the build). Its prerendered copy was served as built on Vercel —
  // HIT at an age far past its `revalidate`, never regenerated (unlike the blog pages) — so a post
  // published after a deploy never reached it until the next deploy. Crawlers fetch it rarely; the
  // blog source reads the feed `no-store` (`src/lib/blog-sitemap.ts`) and careers keep their
  // 300 s data cache.
  await connection();
  // Static routes here; the dynamic keys are filtered by pattern. Detail entries (careers
  // openings; blog articles since W248) come from DETAIL_SITEMAP_SOURCES (W31), read under their
  // own ISR tags.
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
