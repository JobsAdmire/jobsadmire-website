import { getCollection, type BlogPost } from '@/content/collections';
import { bodyVideos, type BodyVideo } from '@/content/videos';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { writtenPosts } from '../../blog/_lib/posts';

export type PressFeature = { post: BlogPost; slug: string; video: BodyVideo };

/**
 * The home's press strip (W249): the newest written article of this locale flagged `featured`
 * whose body shows a press video (`press` in `src/content/videos.ts` — the strip's copy,
 * `sys.home.press.*`, names that interview, so no other video can borrow it). Null = no strip:
 * the feed decides — unpublish the post, or drop its featured flag, and the strip is gone.
 */
export function pressFeature(bundle: Bundle, locale: Locale): PressFeature | null {
  for (const post of writtenPosts(getCollection(bundle, 'blog'), locale)) {
    const slug = post.slug[locale];
    if (post.featured !== true || !slug) continue;
    const video = bodyVideos(post.body[locale]).find((v) => v.video.press === true);
    if (video) return { post, slug, video };
  }
  return null;
}
