import 'server-only';
import type { MetadataRoute } from 'next';
import {
  articleAlternates,
  articleHref,
  writtenPosts,
} from '@/app/[locale]/(site)/blog/_lib/posts';
import { getBlogBundle } from '@/content/blog';
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
 * through the blog source (`getBlogBundle`: the Operations feed under `BLOG_SOURCE=OPS`, else the
 * LOCAL rows) under its 60 s `blog` tag. A feed failure at runtime throws and the sitemap route
 * keeps its last good version (ISR), like the careers source.
 */
export async function blogSitemapSource(locale: Locale): Promise<MetadataRoute.Sitemap> {
  return blogSitemapEntries(getCollection(await getBlogBundle(locale), 'blog'), locale);
}
