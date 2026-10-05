import type { BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { RELATED_MAX } from '../../_lib/posts';

/** Owner ruling 2026-10-05: related and previous/next cards come from EVERY bundle row that has a
 *  title in this locale — written or not. A card whose article has no body in `locale` is not a
 *  link (that URL answers 404, W151) and wears the `sys.blog.soon` tag instead. Newest first;
 *  rows published the same day keep the collection order. ISO dates compare as strings. */
export function listedPosts(rows: readonly BlogPost[], locale: Locale): BlogPost[] {
  return rows
    .map((post, index) => ({ post, index }))
    .filter(({ post }) => post.title[locale] !== null && post.slug[locale] !== null)
    .sort((x, y) =>
      x.post.publishedAt === y.post.publishedAt
        ? x.index - y.index
        : x.post.publishedAt < y.post.publishedAt
          ? 1
          : -1,
    )
    .map(({ post }) => post);
}

/** Same category first, then the newest others, never the post itself. */
export function relatedListed(
  listed: readonly BlogPost[],
  post: BlogPost,
  max = RELATED_MAX,
): BlogPost[] {
  const others = listed.filter((p) => p.key !== post.key);
  return [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, max);
}

/** `prev` is the newer neighbour, `next` the older one (the design's list order). */
export function neighboursListed(
  listed: readonly BlogPost[],
  post: BlogPost,
): { prev: BlogPost | null; next: BlogPost | null } {
  const i = listed.findIndex((p) => p.key === post.key);
  if (i < 0) return { prev: null, next: null };
  return { prev: listed[i - 1] ?? null, next: listed[i + 1] ?? null };
}
