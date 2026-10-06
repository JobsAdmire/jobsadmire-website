import { readMinutesOf, type BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import { liquidSizes } from '@/design/zoom';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatMonth } from '@/lib/format/date/formatMonth';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CATEGORY_FACE } from '../_lib/category';
import { articleHref, isWritten, otherLocale } from '../_lib/posts';
import { BlogCover } from './BlogCover';

/** The alt-language pill: on a TR card "İngilizce'de de var" (blog.081), on an EN card
 *  "Türkçe'de de var" (blog.077) — shown when the article is written in the other locale too. */
const ALSO_IN_ID: Record<Locale, string> = { tr: 'blog.081', en: 'blog.077' };

/** The title link stretched over its card (`::after`), so the whole card is the target while
 *  the link's name stays the title; its focus ring is drawn on the card's inner edge. */
const STRETCH =
  'text-ink no-underline after:absolute after:inset-0 after:content-[""] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-blue-safe';

const CARD =
  'ja-hover-card relative flex h-full flex-col overflow-hidden rounded-md border border-border-4 bg-white focus-within:shadow-[0_14px_34px_rgba(22,60,90,0.1)] max-md:flex-row max-md:items-stretch max-md:rounded-base';

/** The cover's rendered width per band (W250, `PostList`'s grid): a quarter of the 1,240 px box
 *  less three 18 px gaps (≈ 297 px; 227 px at 1101) from 1101 px, a third of the row at 901–1100
 *  (≤ 320 px), half of it at 701–900 (≤ 420 px), the 104 px phone thumbnail (whose 16:9 photo
 *  crops to about 200 px of width) — growing with the liquid desktop past 1440 (W231). */
export const CARD_COVER_SIZES = liquidSizes(
  297,
  '(min-width: 1101px) 297px, (min-width: 901px) 320px, (min-width: 701px) 420px, 200px',
);

/**
 * The blog index card, page-local (copied from the shared `PostCard` and adapted — SHARED 14.7;
 * the shared block stays as it is for the Homepage, Work Permit and Article): Blog.dc.html
 * 640–655 (the POSTS GRID card), phones 344–356.
 * - the post's cover photo when it has one (its video's poster stands in, W249), else the
 *   category-gradient cover (`BlogCover`) — a 16:10 box at the card's width (owner W250: the
 *   design's square-ish card, never a thin strip that crops a face), the photo set a little above
 *   its middle;
 * - the per-category pill (`CATEGORY_FACE`); `featured` (the index's first card, W250) puts the
 *   dark "ÖNE ÇIKAN / FEATURED" pill (blog.034) before it;
 * - month + year meta ("Haziran 2026 · 8 dk okuma") and the alt-language pill when the article
 *   is written in the other locale too;
 * - the card is a whole-card link (the stretched title link) that lifts on hover
 *   (`ja-hover-card`). Only written articles are listed (W248); a row with no article in the
 *   locale renders nothing;
 * - phones (≤ 700 px): the design's horizontal row card — 104 px cover, 3-line title, no excerpt,
 *   no alt pill.
 */
export function BlogPostCard({
  bundle,
  locale,
  post,
  featured = false,
}: {
  bundle: Bundle;
  locale: Locale;
  post: BlogPost;
  featured?: boolean;
}) {
  const title = post.title[locale];
  const href = isWritten(post, locale) ? articleHref(post, locale) : null;
  if (!title || !href) return null;
  const t = makeT(bundle);
  const face = CATEGORY_FACE[post.category];
  const category = t(post.categoryLabelId);
  const excerpt = post.excerpt[locale];
  const meta = `${formatMonth(post.publishedAt, locale)} · ${formatReadMinutes(readMinutesOf(post, locale), locale)}`;
  const photo = post.cover ? { src: post.cover.url, alt: post.coverAlt?.[locale] ?? '' } : null;
  const alsoIn = isWritten(post, otherLocale(locale));
  return (
    <article
      data-post-link=""
      data-testid={featured ? 'blog-featured' : undefined}
      data-featured={featured ? '' : undefined}
      className={CARD}
    >
      <BlogCover
        slot={`blog-cover-${post.key}`}
        category={post.category}
        label={category}
        photo={photo}
        sizes={CARD_COVER_SIZES}
        rowOnPhone
        className="aspect-[16/10] w-full shrink-0 max-md:aspect-auto max-md:h-auto max-md:min-h-[104px] max-md:w-[104px] max-md:flex-none"
      />
      <div className="flex min-w-0 flex-1 flex-col p-6 max-md:justify-center max-md:px-3.5 max-md:py-3">
        <div className="mb-3 flex flex-wrap items-center gap-2 max-md:mb-[7px] max-md:gap-1.5">
          {featured ? (
            <span className="inline-block rounded-pill bg-ink px-3 py-1 text-[11.5px] font-extrabold tracking-[0.8px] text-white xl:text-[11px] xl:tracking-[0.6px] max-md:px-[9px] max-md:py-[3px] max-md:text-[10.5px] max-md:tracking-[0.5px]">
              {t('blog.034')}
            </span>
          ) : null}
          <span
            className={`inline-block rounded-pill px-3 py-1 text-[12.5px] font-bold xl:text-[11px] max-md:px-[9px] max-md:py-[3px] max-md:text-[10.5px] max-md:font-extrabold ${face.pill}`}
          >
            {category}
          </span>
        </div>
        <h3 className="m-0 mb-2 text-[18.5px] leading-[1.35] font-extrabold text-ink xl:text-[13.875px] max-md:mb-1.5 max-md:line-clamp-3 max-md:text-[15px] max-md:leading-[1.32]">
          <Link prefetch={false} href={href} className={STRETCH}>
            {title}
          </Link>
        </h3>
        {excerpt ? (
          <p className="m-0 mb-4 text-[14px] leading-[1.6] text-text-tertiary xl:text-[11px] max-md:hidden">
            {excerpt}
          </p>
        ) : null}
        {/* the meta keeps its one line; at four in a row the alt pill drops below it (W250) */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
          <span className="text-[13px] font-semibold whitespace-nowrap text-text-tertiary xl:text-[11px] max-md:text-[11.5px]">
            {meta}
          </span>
          {alsoIn ? (
            <span className="rounded-pill border border-edge bg-pale-1 px-2.5 py-0.75 text-[11px] font-bold whitespace-nowrap text-[#43536a] xl:text-[11px] max-md:hidden">
              {t(ALSO_IN_ID[locale])}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
