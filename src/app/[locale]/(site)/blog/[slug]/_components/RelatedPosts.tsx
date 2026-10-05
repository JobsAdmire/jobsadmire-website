import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import type { BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatDate } from '@/lib/format/date/formatDate';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import type { Bundle } from '../../../../../../../contract/website-bundle.v1';
import { articleHref, isWritten } from '../../_lib/posts';
import { CATEGORY_LOOK } from '../_lib/category';
import { CategoryCover } from './CategoryCover';

/** The `sys.blog.soon` tag — the owner's ruling (2026-10-05): a card whose article has no body in
 *  this locale is not a link and says so. */
function SoonTag() {
  const sys = useTranslations('sys');
  return (
    <span
      data-testid="article-soon"
      className="inline-flex shrink-0 items-center rounded-pill border border-amber-border bg-amber-surface px-2.5 py-[3px] xl:py-[2px] text-[11px] leading-none font-extrabold tracking-[0.5px] xl:tracking-[0.4px] text-warning-text uppercase xl:text-[11px]"
    >
      {sys('blog.soon')}
    </span>
  );
}

const CARD_SHELL =
  'relative flex flex-col overflow-hidden rounded-[18px] border border-edge-soft bg-white max-md:flex-row max-md:items-stretch max-md:rounded-[14px]';
const CARD_HOVER =
  'transition-shadow duration-200 hover:shadow-[0_14px_34px_rgba(22,60,90,0.1)] focus-within:shadow-[0_14px_34px_rgba(22,60,90,0.1)]';
const STRETCH =
  'text-ink no-underline after:absolute after:inset-0 after:content-[""] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-blue-safe';

/** One related card (DC 721–733, mobile CSS 352–362): a 160 px category-coloured cover, the
 *  category pill, the title and the meta line; at ≤ 700 px a row with a 92 px cover, the pill
 *  shown as a bare 10 px label and a 2-line title. The title is the single link (stretched over
 *  the card) — and there is no link at all when the article has no body here. */
function RelatedCard({ bundle, locale, post }: { bundle: Bundle; locale: Locale; post: BlogPost }) {
  const t = makeT(bundle);
  const title = post.title[locale] ?? '';
  const href = isWritten(post, locale) ? articleHref(post, locale) : null;
  const look = CATEGORY_LOOK[post.category];
  const label = t(post.categoryLabelId);
  const meta = `${formatDate(post.publishedAt, locale)} · ${formatReadMinutes(post.readMinutes, locale)}`;
  const pill = { '--pill-bg': look.pillBg, '--pill-fg': look.pillText } as CSSProperties;
  return (
    <article
      data-testid="article-related-card"
      data-linked={href ? 'true' : 'false'}
      className={[CARD_SHELL, href ? CARD_HOVER : ''].join(' ')}
    >
      <div className="block max-md:w-[92px] max-md:shrink-0">
        <CategoryCover
          slot={`blog-cover-${post.key}`}
          category={post.category}
          label={label}
          compact
          imageWidth={380}
          imageHeight={160}
          className="h-[160px] max-md:h-full max-md:min-h-[92px] xl:h-[120px]"
        />
      </div>
      <div className="flex flex-1 flex-col px-[22px] py-5 max-md:min-w-0 max-md:justify-center max-md:gap-[3px] max-md:px-3.5 max-md:py-[11px] xl:px-[16.5px] xl:py-[15px]">
        <p className="m-0 mb-2.5 flex max-md:mb-0">
          <span
            style={pill}
            className="rounded-pill bg-(--pill-bg) px-3 py-1 text-[12px] font-bold text-(--pill-fg) max-md:bg-transparent max-md:p-0 max-md:text-[10px] max-md:tracking-[0.8px] xl:text-[11px]"
          >
            {label}
          </span>
        </p>
        <h3 className="m-0 mb-1.5 text-[16.5px] leading-[1.4] font-extrabold text-ink max-md:m-0 max-md:line-clamp-2 max-md:text-[14.5px] max-md:leading-[1.3] xl:text-[12.4px]">
          {href ? (
            <Link href={href} prefetch={false} className={STRETCH}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] font-semibold text-text-tertiary max-md:text-[11.5px] xl:text-[11px]">
          <span>{meta}</span>
          {href ? null : <SoonTag />}
        </div>
      </div>
    </article>
  );
}

const NEIGHBOUR =
  'flex flex-col gap-1.5 rounded-base border border-edge-soft bg-white px-6 py-5 no-underline xl:px-[18px] xl:py-[15px]';

/** The Previous / Next cards (DC 738–754): 12 px caps label, 15.5 px title; the Next card is
 *  right-aligned and takes the full width when there is no Previous. A neighbour without a body
 *  here is a plain card with the `sys.blog.soon` tag, not a link. */
function NeighbourCard({
  locale,
  post,
  label,
  testId,
  align,
}: {
  locale: Locale;
  post: BlogPost;
  label: string;
  testId: string;
  align: 'start' | 'end';
}) {
  const href = isWritten(post, locale) ? articleHref(post, locale) : null;
  const title = post.title[locale] ?? '';
  const inner = (
    <>
      <span className="text-[12px] font-extrabold tracking-[1px] xl:tracking-[0.75px] text-text-tertiary uppercase xl:text-[11px]">
        {label}
      </span>
      <span className="text-[15.5px] leading-[1.4] font-extrabold text-ink xl:text-[11.6px]">
        {title}
      </span>
    </>
  );
  const face = [NEIGHBOUR, align === 'end' ? 'items-end text-right' : ''].join(' ');
  if (href)
    return (
      <Link
        href={href}
        prefetch={false}
        data-testid={testId}
        className={[
          face,
          'transition-[border-color,box-shadow] duration-200 hover:border-blue hover:shadow-[0_10px_26px_rgba(22,60,90,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe',
        ].join(' ')}
      >
        {inner}
      </Link>
    );
  return (
    <div data-testid={testId} data-linked="false" className={face}>
      {inner}
      <SoonTag />
    </div>
  );
}

/**
 * The article's related row (≤ 3 cards, the 3rd hidden on phones) and Previous / Next cards
 * (blogarticle.081–083). The page hands it every listed row with a title in this locale — written
 * or not (owner ruling 2026-10-05); the cards of bodiless rows are not links and carry the
 * `sys.blog.soon` tag. Renders nothing when there is nothing to show. It owns its `Section`.
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
  return (
    <Section tone="band">
      <div
        className="container-site mx-auto max-w-[1180px] xl:max-w-[885px]"
        data-testid="article-related"
      >
        {related.length > 0 ? (
          <>
            <h2 className="mt-0 mb-5 text-[26px] leading-tight font-extrabold tracking-[-0.4px] xl:tracking-[-0.3px] text-ink max-md:mb-3 max-md:text-[19px] xl:text-[19.5px]">
              {t('blogarticle.081')}
            </h2>
            <ul className="m-0 grid list-none gap-6 p-0 max-md:gap-2.5 md:grid-cols-3" role="list">
              {related.map((post, i) => (
                <li key={post.key} className={i === 2 ? 'max-md:hidden' : undefined}>
                  <RelatedCard bundle={bundle} locale={locale} post={post} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {prev || next ? (
          <div className="mt-6 grid gap-5 max-md:gap-3 min-[461px]:grid-cols-2">
            {prev ? (
              <NeighbourCard
                locale={locale}
                post={prev}
                label={t('blogarticle.082')}
                testId="article-prev"
                align="start"
              />
            ) : null}
            {next ? (
              <div className={prev ? undefined : 'min-[461px]:col-span-full'}>
                <NeighbourCard
                  locale={locale}
                  post={next}
                  label={t('blogarticle.083')}
                  testId="article-next"
                  align="end"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
