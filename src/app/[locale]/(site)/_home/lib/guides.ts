import { getCollection, type BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { indexPosts } from '../../blog/_lib/posts';

/** The design's five (one featured + four rows, Homepage v4 ll. 1036–1062). */
export const GUIDES_MAX = 5;

/** The homepage guides block: the blog index's own order — the written articles of this locale
 *  (W248: real published posts only, no "yakında" cards), the `featured` one first, then newest
 *  first — capped at the design's five. Empty when the locale has no article: the section is
 *  then left out (the design has no empty state for it). */
export function guidesTeaser(bundle: Bundle, locale: Locale, limit = GUIDES_MAX): BlogPost[] {
  return indexPosts(getCollection(bundle, 'blog'), locale).slice(0, limit);
}
