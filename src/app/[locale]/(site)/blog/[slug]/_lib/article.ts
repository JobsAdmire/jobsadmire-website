import type { BlogPost } from '@/content/collections';
import { coverVariant } from '@/content/blog-feed';
import type { Locale } from '@/i18n/routing';
import { absoluteFileUrl, pageOgImageUrl } from '@/lib/seo/routes';

/** The byline and author box of one article (W248). A named author (Operations' `author`) is a
 *  Person: their name, their title as the box's line, their initials in the avatar. Without one
 *  the editorial team stands in, as on every article before Phase B: "JobsAdmire Editorial"
 *  (blogarticle.023), its team line (blogarticle.067) and the "JA" monogram — an Organization. */
export type ArticleAuthor = {
  name: string;
  initials: string;
  bio: string | null;
  person: boolean;
};

export function initials(name: string, locale: Locale): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const picked = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return picked
    .map((w) => [...w][0] ?? '')
    .join('')
    .toLocaleUpperCase(locale === 'tr' ? 'tr-TR' : 'en-GB');
}

export function authorOf(post: BlogPost, t: (id: string) => string, locale: Locale): ArticleAuthor {
  const named = post.authorObj;
  if (named)
    return {
      name: named.name,
      initials: initials(named.name, locale),
      bio: named.title,
      person: true,
    };
  return { name: t('blogarticle.023'), initials: 'JA', bio: t('blogarticle.067'), person: false };
}

/** The article's share image (absolute): its cover's 1200 px variant when it has one (W248) — or,
 *  for a cover that is a file of the site (a video poster standing in, W249), that file — else
 *  the blog index's generated card (W169). */
export function articleOgImage(post: BlogPost, locale: Locale): string {
  if (!post.cover) return pageOgImageUrl(locale, 'blog');
  return post.cover.url.startsWith('/')
    ? absoluteFileUrl(post.cover.url)
    : coverVariant(post.cover.url, 1200);
}

/** The `<title>` and meta description: the post's SEO overrides (verbatim) when Operations sends
 *  them, else "{title} | JobsAdmire" and the excerpt. */
export function articleSeo(
  post: BlogPost,
  locale: Locale,
  metaTitle: (title: string) => string,
): { title: string; description: string } {
  const title = post.title[locale] ?? '';
  return {
    title: post.seo?.title[locale] ?? metaTitle(title),
    description: post.seo?.description[locale] ?? post.excerpt[locale] ?? title,
  };
}
