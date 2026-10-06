import type { BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { POST_LIST_ID } from '../_lib/filter';
import { BlogPostCard } from './BlogPostCard';

/** W250 (owner 2026-10-06): the grid's columns per band — at most four in a row. */
export const GRID_COLUMNS = 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

/**
 * The index's one list of articles (owner 2026-10-06, W250 — no separate full-width featured
 * card, no "most read" panel): a uniform card grid, four in a row from 1101 px, three at
 * 901–1100, two at 701–900, and the design's phone row cards one under the other at ≤ 700
 * (Blog.dc.html 636–669 / 344–356). The first card is the featured post (`indexPosts` puts the
 * flagged one first) and wears the "ÖNE ÇIKAN / FEATURED" pill. One `li[data-post-key]` per card,
 * the rows `LoadMore` shows and hides; every row past the first page is `hidden` from the server,
 * so the first page shows before (and without) hydration. Renders nothing for no posts.
 */
export function PostList({
  bundle,
  locale,
  posts,
  heading,
  pageSize,
}: {
  bundle: Bundle;
  locale: Locale;
  posts: readonly BlogPost[];
  heading: string;
  pageSize: number;
}) {
  if (posts.length === 0) return null;
  return (
    <div>
      <h2 className="sr-only">{heading}</h2>
      <ul
        id={POST_LIST_ID}
        data-testid="blog-grid"
        className={`m-0 grid list-none gap-6 p-0 max-md:gap-2.5 ${GRID_COLUMNS}`}
      >
        {posts.map((post, i) => (
          <li key={post.key} data-post-key={post.key} hidden={i >= pageSize}>
            <BlogPostCard bundle={bundle} locale={locale} post={post} featured={i === 0} />
          </li>
        ))}
      </ul>
    </div>
  );
}
