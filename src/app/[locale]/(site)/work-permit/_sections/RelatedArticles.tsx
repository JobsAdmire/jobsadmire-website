import { blogNavVisible, getCollection } from '@/content/collections';
import { PostCard } from '@/design/blocks/PostCard';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The design's three "Keep reading" cards. */
export const RELATED_LIMIT = 3;

/** "Keep reading on the blog" — rendered by data (W4): nothing while `/blog` is below
 *  `BLOG_NAV_THRESHOLD` Turkish bodies (it is noindex and out of every nav, so a block linking
 *  there would advertise a dead end), nothing when no work-permit article has a body in this
 *  locale; otherwise up to three `PostCard`s. The design's static cards (`wp.353`–`358`, all
 *  pointing at the index) are not used (delta 9). */
export function RelatedArticles({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  if (!blogNavVisible(bundle)) return null;
  const posts = getCollection(bundle, 'blog')
    .filter((p) => p.category === 'workPermits' && p.hasBody[locale])
    .slice(0, RELATED_LIMIT);
  if (posts.length === 0) return null;
  return (
    <Section tone="light">
      <div className="container-site" data-testid="wp-related">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="m-0 text-h2 tracking-[-0.02em] max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px]">
            {tf('wp.351')}
          </h2>
          <Link
            prefetch={false}
            href="/blog"
            className="text-body-sm font-extrabold whitespace-nowrap text-blue-safe no-underline hover:underline"
          >
            {tf('wp.352')}
          </Link>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.key} className="min-w-0">
              <PostCard bundle={bundle} locale={locale} post={post} headingLevel={3} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
