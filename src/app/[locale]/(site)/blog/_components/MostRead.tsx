import { readMinutesOf, type BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import { SampleTag } from '@/design/blocks/SampleTag';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { articleHref, isWritten } from '../_lib/posts';

const STRETCH =
  'text-ink no-underline after:absolute after:inset-0 after:content-[""] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-blue-safe';

/**
 * The design's "Most read" panel beside the featured card (Blog.dc.html 622–632; phones
 * 337–343): a white r20 card, the h2 "En çok okunan" (blog.031) and three ranked rows — the
 * rank numeral, the title and "Kategori · n dk okuma" — split by hairlines, each row a link
 * with the pale hover (only written articles are ranked, `mostReadPosts`). On phones the h2 is a small grey caps label and the rank sits
 * in a tinted square. The list is the design's (`mostReadByLang`, `MOST_READ_KEYS`) — there are
 * no read counts yet, so the panel wears the `SampleTag`. The rank uses a darker blue than the
 * design's #bfdff0 (1.4:1 on white) so it passes the large-text 3:1 (D20).
 */
export function MostRead({
  bundle,
  locale,
  posts,
}: {
  bundle: Bundle;
  locale: Locale;
  posts: readonly BlogPost[];
}) {
  if (posts.length === 0) return null;
  const t = makeT(bundle);
  return (
    <div
      data-testid="blog-most-read"
      className="flex h-full flex-col rounded-lg border border-border-4 bg-white px-6.5 py-6 max-md:px-4 max-md:pt-1 max-md:pb-2 max-md:shadow-[0_14px_34px_rgba(22,60,90,0.08)]"
    >
      <div className="mb-1.5 flex items-center justify-between gap-2 max-md:mt-4 max-md:mb-0.5">
        <h2 className="m-0 text-[19px] font-extrabold tracking-[-0.3px] text-ink xl:text-[14.25px] xl:tracking-[-0.225px] max-md:text-[12px] max-md:tracking-[1.1px] max-md:text-text-tertiary max-md:uppercase">
          {t('blog.031')}
        </h2>
        <SampleTag />
      </div>
      <ol className="m-0 flex flex-1 list-none flex-col p-0">
        {posts.map((post, i) => {
          const href = isWritten(post, locale) ? articleHref(post, locale) : null;
          const title = post.title[locale];
          if (!href || !title) return null;
          return (
            <li
              key={post.key}
              data-post-link=""
              className="relative flex flex-1 items-start gap-3.5 border-t border-border-3 px-1 py-4 transition-colors hover:bg-pale-1 max-md:min-h-[44px] max-md:items-center max-md:gap-3 max-md:py-[13px]"
            >
              <span
                aria-hidden="true"
                className="text-[26px] leading-none font-extrabold text-blue-hover xl:text-[19.5px] max-md:inline-flex max-md:h-[26px] max-md:w-[26px] max-md:flex-none max-md:items-center max-md:justify-center max-md:rounded-[9px] max-md:bg-tint max-md:text-[13px] max-md:text-blue-safe"
              >
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-col gap-1 max-md:gap-[3px]">
                <span className="text-[14.5px] leading-[1.4] font-extrabold text-ink xl:text-[11px] max-md:line-clamp-2 max-md:text-[15px] max-md:leading-[1.35]">
                  <Link prefetch={false} href={href} className={STRETCH}>
                    {title}
                  </Link>
                </span>
                <span className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold text-text-tertiary xl:text-[11px] max-md:text-[12px]">
                  <span>
                    {t(post.categoryLabelId)} ·{' '}
                    {formatReadMinutes(readMinutesOf(post, locale), locale)}
                  </span>
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
