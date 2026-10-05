import type { BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { POST_LIST_ID } from '../_lib/filter';
import { BlogPostCard } from './BlogPostCard';

/** The posts grid after the featured row (Blog.dc.html 636–669): three columns from 901 px,
 *  one below (the design's ≤ 900 rule), phone row cards 10 px apart — one `li[data-post-key]`
 *  per card, the rows `LoadMore` shows and hides. Every row past the first page is `hidden`
 *  from the server, so the first six show before (and without) hydration. Renders nothing for
 *  an empty grid. */
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
        className="m-0 grid list-none gap-6 p-0 max-md:gap-2.5 lg:grid-cols-3"
      >
        {posts.map((post, i) => (
          <li key={post.key} data-post-key={post.key} hidden={i >= pageSize}>
            <BlogPostCard bundle={bundle} locale={locale} post={post} variant="card" />
          </li>
        ))}
      </ul>
    </div>
  );
}
