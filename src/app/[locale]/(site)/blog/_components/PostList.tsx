import type { BlogPost } from '@/content/collections';
import { PostCard } from '@/design/blocks/PostCard';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { POST_LIST_ID } from '../_lib/filter';

/** The grid of written articles after the featured card — one `li[data-post-key]` per card, the
 *  rows the tools island (B-5) shows and hides. Renders nothing for an empty grid (Phase A). */
export function PostList({
  bundle,
  locale,
  posts,
  heading,
}: {
  bundle: Bundle;
  locale: Locale;
  posts: readonly BlogPost[];
  heading: string;
}) {
  if (posts.length === 0) return null;
  return (
    <div>
      <h2 className="sr-only">{heading}</h2>
      <ul
        id={POST_LIST_ID}
        data-testid="blog-grid"
        className="m-0 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((post) => (
          <li key={post.key} data-post-key={post.key}>
            <PostCard bundle={bundle} locale={locale} post={post} variant="card" headingLevel={3} />
          </li>
        ))}
      </ul>
    </div>
  );
}
