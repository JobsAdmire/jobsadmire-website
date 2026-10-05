import { blogNavVisible, getCollection } from '@/content/collections';
import { PostCard } from '@/design/blocks/PostCard';
import { SampleTag } from '@/design/blocks/SampleTag';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The design's three "Keep reading" cards. */
export const RELATED_LIMIT = 3;

/** The design's three sample cards (dc1332–1357), page-local constants: title + excerpt ids. */
const SAMPLE_CARDS: readonly (readonly [string, string])[] = [
  ['wp.353', 'wp.354'],
  ['wp.355', 'wp.356'],
  ['wp.357', 'wp.358'],
];

const CARD =
  'ja-hover-card block min-w-0 rounded-md border border-border-2 bg-white px-6.5 py-6 no-underline max-md:grid max-md:grid-cols-[1fr_auto] max-md:items-center max-md:gap-x-3 max-md:gap-y-1 max-md:rounded-none max-md:border-0 max-md:px-3.5 max-md:py-3.5';

/** "Keep reading on the blog" (#related). Real posts when `/blog` is visible and a work-permit
 *  article has a body in this locale (W4: up to three `PostCard`s). Otherwise — below
 *  `BLOG_NAV_THRESHOLD` Turkish bodies, or with no work-permit article — the design's three
 *  sample cards (`wp.353`–`358`) render as page-local constants with the `SampleTag`
 *  (owner 2026-10-05; never the blog collection or the sample JSON, D23). The sample cards and
 *  the "all articles" link point at `/blog` only while it is visible (it is noindex and out of
 *  every nav below the threshold, so a link would advertise a dead end); otherwise they are
 *  plain cards. ≤ 700 px the samples fold into one list card, rows title + excerpt + "→",
 *  the chip hidden (design `.ja-blog-grid`). */
export function RelatedArticles({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const blogVisible = blogNavVisible(bundle);
  const posts = blogVisible
    ? getCollection(bundle, 'blog')
        .filter((p) => p.category === 'workPermits' && p.hasBody[locale])
        .slice(0, RELATED_LIMIT)
    : [];
  const sample = posts.length === 0;
  return (
    <Section tone="light">
      <div className="container-site" data-testid="wp-related">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="m-0 flex flex-wrap items-center gap-3 text-h2 tracking-[-0.02em] max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px]">
            {tf('wp.351')}
            {sample ? <SampleTag /> : null}
          </h2>
          {blogVisible ? (
            <Link
              prefetch={false}
              href="/blog"
              className="text-body-sm font-extrabold whitespace-nowrap text-blue-safe no-underline hover:underline"
            >
              {tf('wp.352')}
            </Link>
          ) : null}
        </div>
        {sample ? (
          <ul
            data-testid="wp-related-sample"
            className="grid gap-5 max-md:gap-0 max-md:overflow-hidden max-md:rounded-[15px] max-md:border max-md:border-border-2 max-md:bg-white md:grid-cols-3"
          >
            {SAMPLE_CARDS.map(([titleId, bodyId]) => {
              const inner = (
                <>
                  <span className="mb-3 inline-block rounded-pill bg-tint px-3 py-1 text-eyebrow font-extrabold text-blue-safe max-md:hidden">
                    {tf('wp.011')}
                  </span>
                  <span className="mb-2 block text-[16.5px] leading-[1.4] font-extrabold text-ink max-md:col-start-1 max-md:row-start-1 max-md:mb-0 max-md:text-[14.5px] max-md:leading-[1.35]">
                    {tf(titleId)}
                  </span>
                  <span className="block text-body-sm text-text-tertiary max-md:col-start-1 max-md:row-start-2 max-md:text-[12.5px] max-md:leading-[1.45]">
                    {tf(bodyId)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-[17px] font-extrabold text-blue-safe max-md:col-start-2 max-md:row-span-2 max-md:row-start-1 max-md:block max-md:self-center"
                  >
                    →
                  </span>
                </>
              );
              return (
                <li
                  key={titleId}
                  className="min-w-0 max-md:border-t max-md:border-border-4 max-md:first:border-t-0"
                >
                  {blogVisible ? (
                    <Link prefetch={false} href="/blog" className={CARD}>
                      {inner}
                    </Link>
                  ) : (
                    <article className={CARD}>{inner}</article>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.key} className="min-w-0">
                <PostCard bundle={bundle} locale={locale} post={post} headingLevel={3} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
