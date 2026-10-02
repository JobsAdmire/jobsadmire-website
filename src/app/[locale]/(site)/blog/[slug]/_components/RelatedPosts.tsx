import type { BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import { PostCard } from '@/design/blocks/PostCard';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../../contract/website-bundle.v1';
import { articleHref } from '../../_lib/posts';

const NEIGHBOUR =
  'flex flex-col gap-1.5 rounded-base border border-border-4 bg-white px-6 py-5 no-underline transition-colors hover:border-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/**
 * B-2: related articles (same category first, the third card hidden on phones — W10 by class)
 * and the previous/next links. The page passes data only once the blog is launched
 * (`blogNavVisible`, W4) and another written article exists; otherwise everything is empty and
 * this renders nothing at all — no empty section (it owns its `Section`, the W97 pattern).
 */
export function RelatedPosts({
  bundle,
  locale,
  related,
  prev,
  next,
}: {
  bundle: Bundle;
  locale: Locale;
  related: readonly BlogPost[];
  prev: BlogPost | null;
  next: BlogPost | null;
}) {
  if (related.length === 0 && !prev && !next) return null;
  const t = makeT(bundle);
  const neighbour = (post: BlogPost | null, labelId: string, testId: string) => {
    const href = post ? articleHref(post, locale) : null;
    const title = post?.title[locale];
    if (!href || !title) return <span aria-hidden="true" />;
    return (
      <Link href={href} prefetch={false} data-testid={testId} className={NEIGHBOUR}>
        <span className="text-eyebrow font-extrabold tracking-[1px] xl:tracking-[0.75px] text-text-tertiary uppercase">
          {t(labelId)}
        </span>
        <span className="text-body font-extrabold text-ink">{title}</span>
      </Link>
    );
  };
  return (
    <Section tone="light">
      <div className="container-site" data-testid="article-related">
        {related.length > 0 ? (
          <>
            <h2 className="text-h2 mt-0 mb-5">{t('blogarticle.081')}</h2>
            <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
              {related.map((post, i) => (
                <li key={post.key} className={i === 2 ? 'max-md:hidden' : undefined}>
                  <PostCard
                    bundle={bundle}
                    locale={locale}
                    post={post}
                    variant="card"
                    headingLevel={3}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {prev || next ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {neighbour(prev, 'blogarticle.082', 'article-prev')}
            {neighbour(next, 'blogarticle.083', 'article-next')}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
