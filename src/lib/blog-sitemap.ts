import 'server-only';
import type { MetadataRoute } from 'next';
import {
  articleAlternates,
  articleHref,
  writtenPosts,
} from '@/app/[locale]/(site)/blog/_lib/posts';
import { getFreshBlogBundle } from '@/content/blog';
import { getCollection, type BlogPost } from '@/content/collections';
import { routing, type Locale } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/seo/routes';

/** The hreflang map of one article in the sitemap: only the locales it is written in (D16, B-15 —
 *  never the other locale's 404), `x-default` = TR when TR is written, else the article's own. */
export function articleSitemapAlternates(post: BlogPost): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  const targets = articleAlternates(post);
  for (const locale of routing.locales) {
    const href = targets[locale];
    if (href && typeof href !== 'string') languages[locale] = absoluteUrl(locale, href);
  }
  const fallback = languages[routing.defaultLocale] ?? Object.values(languages)[0];
  if (fallback) languages['x-default'] = fallback;
  return { languages };
}

/** One locale's article entries from the given rows (pure — the unit test feeds it the fixture). */
export function blogSitemapEntries(
  rows: readonly BlogPost[],
  locale: Locale,
): MetadataRoute.Sitemap {
  return writtenPosts(rows, locale).flatMap((post) => {
    const href = articleHref(post, locale);
    if (!href) return [];
    return [
      {
        url: absoluteUrl(locale, href),
        // The last edit when Operations sends one, else the publish date (a LOCAL row).
        lastModified: post.updatedAt ?? post.publishedAt,
        alternates: articleSitemapAlternates(post),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ];
  });
}

/**
 * W248 — the blog article entries for one locale (the SEO flip): every written article, read
 * through the blog source (the Operations feed under `BLOG_SOURCE=OPS`, else the LOCAL rows).
 * W250: read fresh (`getFreshBlogBundle`, `no-store`), so a publish is listed on the sitemap's
 * next request; a failed fresh read falls back to the cached feed (the last good one), and a
 * failure of that too throws (the request answers 5xx, a crawler retries).
 */
export async function blogSitemapSource(locale: Locale): Promise<MetadataRoute.Sitemap> {
  return blogSitemapEntries(getCollection(await getFreshBlogBundle(locale), 'blog'), locale);
}
