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
