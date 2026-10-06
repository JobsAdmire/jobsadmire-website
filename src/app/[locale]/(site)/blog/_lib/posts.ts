import type { BlogCategory, BlogPost } from '@/content/collections';
import { locales, type Locale } from '@/i18n/routing';
import type { AlternateTarget } from '@/lib/seo/metadata';
import type { FilterItem } from './filter';

/** The grid's page (owner 2026-10-06, W250): eight cards — two rows of four — and "Daha fazla
 *  yazı ↓" (blog.090) adds eight more (the design's `visibleCount` was 6 / +6 for three columns,
 *  Blog.dc.html ~1050). */
export const PAGE_SIZE = 8;

/** B-2: the design's related grid shows three cards (the third hidden on phones). */
export const RELATED_MAX = 3;

export const otherLocale = (locale: Locale): Locale => (locale === 'tr' ? 'en' : 'tr');

/** CONTENT-MODEL § Blog (W4): a row is an article in `locale` only when that locale has a body,
 *  a slug and a title — an index-only entry has no article to link to (PostCard also needs the
 *  slug and the title, W33). */
export function isWritten(post: BlogPost, locale: Locale): boolean {
  return post.hasBody[locale] && post.slug[locale] !== null && post.title[locale] !== null;
}

/** The written articles of one locale, newest first; articles published the same day keep the
 *  collection order (`blog-posts.js`'s). ISO dates compare as strings. */
export function writtenPosts(rows: readonly BlogPost[], locale: Locale): BlogPost[] {
  return rows
    .map((post, index) => ({ post, index }))
    .filter(({ post }) => isWritten(post, locale))
    .sort((x, y) =>
      x.post.publishedAt === y.post.publishedAt
        ? x.index - y.index
        : x.post.publishedAt < y.post.publishedAt
          ? 1
          : -1,
    )
    .map(({ post }) => post);
}

/** The index (owner 2026-10-06, W248: real published posts only — the design's index-only
 *  "yakında" rows are gone): the written articles of the locale, newest first, with the newest
 *  post flagged `featured` (Operations' switch) moved to the front — the grid's first card, which
 *  wears the "ÖNE ÇIKAN" pill (W250). Without a flag the newest post is featured. */
export function indexPosts(rows: readonly BlogPost[], locale: Locale): BlogPost[] {
  const written = writtenPosts(rows, locale);
  const flagged = written.findIndex((p) => p.featured === true);
  if (flagged <= 0) return written;
  return [written[flagged], ...written.slice(0, flagged), ...written.slice(flagged + 1)];
}

/** B-1: the written article behind `slug` in `locale`, or null — an unknown slug and an
 *  index-only entry both answer 404. */
export function findWritten(
  rows: readonly BlogPost[],
  locale: Locale,
  slug: string,
): BlogPost | null {
  return rows.find((p) => p.slug[locale] === slug && isWritten(p, locale)) ?? null;
}

/** The typed dynamic href next-intl's `Link`, `getPathname` and `buildMetadata` take. */
export type ArticleHref = { pathname: '/blog/[slug]'; params: { slug: string } };

export function articleHref(post: BlogPost, locale: Locale): ArticleHref | null {
  const slug = post.slug[locale];
  return slug ? { pathname: '/blog/[slug]', params: { slug } } : null;
}

/** D16 / docs/SEO.md § Per-locale slugs: hreflang only for the locales where this article is
 *  written — `localeAlternates` would advertise the other locale's slug, which 404s (B-1).
 *  `buildMetadata` adds the page's own locale and x-default itself. */
export function articleAlternates(post: BlogPost): Partial<Record<Locale, AlternateTarget>> {
  const out: Partial<Record<Locale, AlternateTarget>> = {};
  for (const locale of locales) {
    const href = isWritten(post, locale) ? articleHref(post, locale) : null;
    if (href) out[locale] = href;
  }
  return out;
}

/** B-2: same category first, then the newest others, never the post itself. */
export function relatedPosts(
  written: readonly BlogPost[],
  post: BlogPost,
  max = RELATED_MAX,
): BlogPost[] {
  const others = written.filter((p) => p.key !== post.key);
  return [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, max);
}

/** Neighbours in the newest-first list: `prev` is the newer article, `next` the older one. */
export function prevNext(
  written: readonly BlogPost[],
  post: BlogPost,
): { prev: BlogPost | null; next: BlogPost | null } {
  const i = written.findIndex((p) => p.key === post.key);
  if (i < 0) return { prev: null, next: null };
  return { prev: written[i - 1] ?? null, next: written[i + 1] ?? null };
}

/** The distinct categories of the listed rows, first-seen order, as chip options (labels
 *  through the rows' own `categoryLabelId`, home.262–265). */
export function categoryOptions(
  written: readonly BlogPost[],
  t: (id: string) => string,
): { value: BlogCategory; label: string }[] {
  const seen = new Map<BlogCategory, string>();
  for (const p of written) if (!seen.has(p.category)) seen.set(p.category, t(p.categoryLabelId));
  return [...seen].map(([value, label]) => ({ value, label }));
}

/** B-5: the tools' rows, built on the server so the island needs no content module. */
export function filterItems(
  posts: readonly BlogPost[],
  locale: Locale,
  t: (id: string) => string,
): FilterItem[] {
  return posts.map((p) => ({
    key: p.key,
    category: p.category,
    text: [p.title[locale], p.excerpt[locale], t(p.categoryLabelId)]
      .filter((s): s is string => Boolean(s))
      .join(' ')
      .toLocaleLowerCase(locale),
  }));
}
