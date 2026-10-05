import { getCollection, type BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The written articles in this locale — a body, a slug and a title, the only rows a `PostCard`
 *  renders (W33) — newest first. The blog index applies the same rule. */
export function guidesPosts(bundle: Bundle, locale: Locale): BlogPost[] {
  return getCollection(bundle, 'blog')
    .filter(
      (post) => post.hasBody[locale] && post.slug[locale] !== null && post.title[locale] !== null,
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** One homepage guide: the post and whether its article exists in this locale (a link) or not
 *  yet (a plain card with the `sys.blog.soon` tag). */
export type GuideTeaser = { post: BlogPost; written: boolean };

/** The homepage guides block (owner 2026-10-05: the section shows the `blog` rows instead of
 *  waiting for W4's six Turkish bodies): every post with a slug and a title in this locale —
 *  the written ones first (newest first), then the planned ones (newest first) — capped at the
 *  design's five (one featured + four rows, Homepage v4 ll. 1036–1062). */
export function guidesTeaser(bundle: Bundle, locale: Locale, limit = 5): GuideTeaser[] {
  return getCollection(bundle, 'blog')
    .filter((post) => post.slug[locale] !== null && post.title[locale] !== null)
    .map((post) => ({ post, written: post.hasBody[locale] }))
    .sort(
      (a, b) =>
        Number(b.written) - Number(a.written) ||
        b.post.publishedAt.localeCompare(a.post.publishedAt),
    )
    .slice(0, limit);
}
