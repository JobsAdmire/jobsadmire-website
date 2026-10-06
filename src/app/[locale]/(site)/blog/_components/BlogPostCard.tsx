import { readMinutesOf, type BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
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
  'relative flex h-full flex-col overflow-hidden rounded-md border border-border-4 bg-white max-md:flex-row max-md:items-stretch max-md:rounded-base';
const CARD_LINK = 'ja-hover-card focus-within:shadow-[0_14px_34px_rgba(22,60,90,0.1)]';
const FEATURED =
  'relative flex h-full flex-col overflow-hidden rounded-lg border border-border-4 bg-white max-md:shadow-[0_14px_34px_rgba(22,60,90,0.10)]';
const FEATURED_LINK =
  'transition-shadow duration-200 hover:shadow-[0_20px_48px_rgba(22,60,90,0.12)] focus-within:shadow-[0_20px_48px_rgba(22,60,90,0.12)]';

/**
 * The blog index card, page-local (copied from the shared `PostCard` and adapted — SHARED 14.7;
 * the shared block stays as it is for the Homepage, Work Permit and Article): Blog.dc.html
 * 603–620 (`featured`) and 640–655 (`card`), phones 325–336 / 344–356.
 * - the post's cover photo when it has one, else the category-gradient cover (`BlogCover`), and
 *   the per-category pill (`CATEGORY_FACE`);
 * - month + year meta ("Haziran 2026 · 8 dk okuma");
 * - the card is a whole-card link (the stretched title link) that lifts on hover
 *   (`ja-hover-card`; the featured card deepens its shadow). Only written articles are listed
 *   (W248 — the design's "yakında" cards are gone); a row with no article here renders nothing;
 * - `card`: the alt-language pill when the article is written in the other locale too; on
 *   phones a horizontal row card (104 px cover, 3-line title, no excerpt, no alt pill);
 * - `featured`: "ÖNE ÇIKAN" + category pills, the h2, the excerpt (3 lines on phones) and
 *   "Yazıyı okuyun →" (blog.084).
 */
export function BlogPostCard({
  bundle,
  locale,
  post,
  variant = 'card',
}: {
  bundle: Bundle;
  locale: Locale;
  post: BlogPost;
  variant?: 'card' | 'featured';
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
  const heading = (
    <Link prefetch={false} href={href} className={STRETCH}>
      {title}
    </Link>
  );

  if (variant === 'featured') {
    return (
      <article data-post-link="" className={`${FEATURED} ${FEATURED_LINK}`}>
        <BlogCover
          slot={`blog-cover-${post.key}`}
          category={post.category}
          label={category}
          photo={photo}
          sizes="(min-width: 901px) 760px, 100vw"
          className="h-[270px] xl:h-[202.5px] max-md:h-[186px]"
        />
        <div className="flex flex-1 flex-col px-7.5 pt-6.5 pb-7 max-md:px-[18px] max-md:pt-4 max-md:pb-[18px]">
          <div className="mb-3.25 flex flex-wrap items-center gap-2.5 max-md:mb-2.5 max-md:gap-2">
            <span className="rounded-pill bg-ink px-3.25 py-1.25 text-[11.5px] font-extrabold tracking-[0.8px] text-white xl:text-[11px] xl:tracking-[0.6px] max-md:px-[11px] max-md:py-1 max-md:text-[11px]">
              {t('blog.034')}
            </span>
            <span
              className={`rounded-pill px-3.25 py-1.25 text-[12.5px] font-bold xl:text-[11px] max-md:px-[11px] max-md:py-1 max-md:text-[11px] ${face.pill}`}
            >
              {category}
            </span>
          </div>
          <h2 className="m-0 mb-2.5 text-[26px] leading-[1.25] font-extrabold tracking-[-0.5px] text-ink xl:text-[19.5px] xl:tracking-[-0.375px] max-md:mb-2 max-md:text-[20px] max-md:leading-[1.28]">
            {heading}
          </h2>
          {excerpt ? (
            <p className="m-0 mb-4.5 text-[15px] leading-[1.6] text-text-secondary xl:text-[11.25px] max-md:mb-3.5 max-md:line-clamp-3 max-md:text-[14px] max-md:leading-[1.55]">
              {excerpt}
            </p>
          ) : null}
          <div className="mt-auto flex items-center gap-3.5 max-md:justify-between max-md:gap-2.5 max-md:border-t max-md:border-border-3 max-md:pt-3">
            <span className="text-[13.5px] font-semibold text-text-tertiary xl:text-[11px] max-md:text-[12.5px]">
              {meta}
            </span>
            <span className="text-[14.5px] font-extrabold text-blue-safe xl:text-[11px] max-md:rounded-pill max-md:bg-tint max-md:px-3.5 max-md:py-2 max-md:text-[13.5px]">
              {t('blog.084')}
            </span>
          </div>
        </div>
      </article>
    );
  }

  const alsoIn = isWritten(post, otherLocale(locale));
  return (
    <article data-post-link="" className={`${CARD} ${CARD_LINK}`}>
      <BlogCover
        slot={`blog-cover-${post.key}`}
        category={post.category}
        label={category}
        photo={photo}
        sizes="(min-width: 901px) 400px, (min-width: 701px) 100vw, 104px"
        rowOnPhone
        className="h-[190px] xl:h-[142.5px] max-md:h-auto max-md:min-h-[104px] max-md:w-[104px] max-md:flex-none"
      />
      <div className="flex min-w-0 flex-1 flex-col p-6 max-md:justify-center max-md:px-3.5 max-md:py-3">
        <div className="mb-3 flex flex-wrap items-center gap-2 max-md:mb-[7px]">
          <span
            className={`inline-block rounded-pill px-3 py-1 text-[12.5px] font-bold xl:text-[11px] max-md:px-[9px] max-md:py-[3px] max-md:text-[10.5px] max-md:font-extrabold ${face.pill}`}
          >
            {category}
          </span>
        </div>
        <h3 className="m-0 mb-2 text-[18.5px] leading-[1.35] font-extrabold text-ink xl:text-[13.875px] max-md:mb-1.5 max-md:line-clamp-3 max-md:text-[15px] max-md:leading-[1.32]">
          {heading}
        </h3>
        {excerpt ? (
          <p className="m-0 mb-4 text-[14px] leading-[1.6] text-text-tertiary xl:text-[11px] max-md:hidden">
            {excerpt}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-text-tertiary xl:text-[11px] max-md:text-[11.5px]">
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
