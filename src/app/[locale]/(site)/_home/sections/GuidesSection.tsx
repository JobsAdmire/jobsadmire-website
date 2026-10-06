import { readMinutesOf, type BlogCategory, type BlogPost } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import { guidesTeaser } from '../lib/guides';
import { H2, SECTION_HEAD } from './styles';
import type { SectionProps } from './types';

/** The design's category pills (`blogList` ll. 1836–1841: #fef3e2 / #e8f4fb / #f3edfd / #eafaf1),
 *  the text in each hue's contrast-safe step (D20 — the design's #c2710c, #1899D5 and #7c3aed
 *  read under 4.5:1 on their tints; the same steps as the Blog Article's category pills). */
const PILL: Record<BlogCategory, string> = {
  marketNews: 'bg-[#fef3e2] text-[#a5560a]',
  workPermits: 'bg-tint text-[#0e6aa0]',
  compliance: 'bg-[#f3edfd] text-[#6d28d9]',
  recruitment: 'bg-success-soft text-success-text',
};

/** The featured cover: 270 px (190 px at ≤ 460, 202.5 px from 1101 — D19), a fixed height the
 *  slot covers. */
const COVER = { base: 190, xs: 270, xl: 203 };

/** A guide's own article route. */
const articleHref = (slug: string) => ({ pathname: '/blog/[slug]' as const, params: { slug } });

/**
 * "Guides and market updates" (design ll. 1026–1069), from the published articles of this locale
 * (W248 — no "yakında" cards): the featured card (the post's cover photo, else the named slot
 * `blog-cover-<key>`; the category pill, "Featured guide", title, excerpt, "Read the guide →") and
 * up to four index rows (category pill + read time, title, excerpt), chosen by `guidesTeaser`.
 * Few posts: one post is the featured card alone across the row; none leaves the section out
 * (the design has no empty state for it). The side list and the top CTA hide at ≤ 460 px, where
 * the dark bottom CTA shows (W10).
 */
export function GuidesSection({ locale, bundle }: SectionProps) {
  const guides = guidesTeaser(bundle, locale);
  const [featured, ...rest] = guides;
  if (!featured) return null;
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="light" id="guides" className="ja-reveal">
      <div data-testid="guides" className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <Eyebrow>{tf('home.220')}</Eyebrow>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.175')}</h2>
          </div>
          <div className="max-xs:hidden">
            <Button prefetch={false} variant="nav" href="/blog">
              {tf('home.176')}
            </Button>
          </div>
        </div>
        <div
          className={`grid items-stretch gap-5${rest.length > 0 ? ' lg:grid-cols-[1.15fr_0.85fr]' : ''}`}
        >
          <FeaturedGuide post={featured} locale={locale} tf={tf} />
          {rest.length > 0 ? (
            <div
              data-testid="guides-list"
              className="flex flex-col rounded-hero border border-border-2 bg-white px-[26px] py-2 max-xs:hidden xl:rounded-[18px] xl:px-[19.5px]"
            >
              {rest.map((guide) => (
                <GuideRow key={guide.key} post={guide} locale={locale} tf={tf} />
              ))}
              <Link
                prefetch={false}
                href="/blog"
                className="pb-4 pt-[18px] text-[13.5px] font-extrabold text-blue-safe no-underline hover:underline xl:pt-[13.5px] xl:text-[11px]"
              >
                {tf('home.179')}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex flex-col xs:hidden">
          <Button prefetch={false} variant="nav" size="lg" href="/blog">
            {tf('home.176')}
          </Button>
        </div>
      </div>
    </Section>
  );
}

type GuideProps = {
  post: BlogPost;
  locale: SectionProps['locale'];
  tf: ReturnType<typeof makeTf>;
};

function FeaturedGuide({ post, locale, tf }: GuideProps) {
  const slug = post.slug[locale] as string;
  const shell =
    'flex flex-col overflow-hidden rounded-hero border border-border-2 bg-white max-xs:rounded-lg xl:rounded-[18px]';
  return (
    <Link
      prefetch={false}
      href={articleHref(slug)}
      data-testid="guide-featured"
      className={`${shell} ja-hover-card no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe`}
    >
      <div className="bg-tint">
        <ImageSlot
          slot={`blog-cover-${post.key}`}
          src={post.cover?.url ?? null}
          alt={post.cover ? (post.coverAlt?.[locale] ?? '') : ''}
          width={640}
          height={270}
          sizes="(min-width: 901px) 720px, 100vw"
          cover={COVER}
        />
      </div>
      <div className="flex flex-col gap-3 px-[30px] pb-7 pt-[26px] max-xs:gap-2.5 max-xs:px-5 max-xs:pb-[22px] max-xs:pt-5 xl:px-[22.5px] xl:pt-[19.5px]">
        <span className="flex flex-wrap items-center gap-2.5">
          <span
            className={`rounded-pill px-[13px] py-1 text-[11.5px] font-extrabold tracking-[0.4px] xl:px-2.5 xl:text-[11px] ${PILL[post.category]}`}
          >
            {tf(post.categoryLabelId)}
          </span>
          <span className="text-[12.5px] font-bold text-text-tertiary xl:text-[11px]">
            {tf('home.177')}
          </span>
        </span>
        <h3 className="m-0 font-display text-[clamp(22px,2.2vw,28px)] font-extrabold leading-[1.15] tracking-[-1px] text-ink max-xs:text-[21px] max-xs:tracking-[-0.6px] xl:text-[clamp(16.5px,1.65vw,21px)] xl:tracking-[-0.75px]">
          {post.title[locale]}
        </h3>
        {post.excerpt[locale] ? (
          <p className="m-0 text-[15px] font-semibold leading-[1.62] text-text-secondary max-xs:line-clamp-3 max-xs:text-[14px] xl:text-[11.25px]">
            {post.excerpt[locale]}
          </p>
        ) : null}
        <span className="text-[13.5px] font-extrabold text-blue-safe xl:text-[11px]">
          {tf('home.178')}
        </span>
      </div>
    </Link>
  );
}

function GuideRow({ post, locale, tf }: GuideProps) {
  const slug = post.slug[locale] as string;
  return (
    <Link
      prefetch={false}
      href={articleHref(slug)}
      data-guide-row={post.key}
      className="flex flex-col gap-2 border-b border-border-3 py-5 no-underline transition-colors hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
    >
      <span className="flex flex-wrap items-center gap-2.5">
        <span
          className={`rounded-pill px-[11px] py-[3px] text-[11px] font-extrabold tracking-[0.4px] ${PILL[post.category]}`}
        >
          {tf(post.categoryLabelId)}
        </span>
        <span className="text-[12px] font-bold text-text-tertiary xl:text-[11px]">
          {formatReadMinutes(readMinutesOf(post, locale), locale)}
        </span>
      </span>
      <h3 className="m-0 font-display text-[17px] font-extrabold leading-[1.25] tracking-[-0.5px] text-ink xl:text-[12.75px] xl:tracking-[-0.4px]">
        {post.title[locale]}
      </h3>
      {post.excerpt[locale] ? (
        <p className="m-0 text-[13.5px] font-semibold leading-[1.55] text-text-tertiary xl:text-[11px]">
          {post.excerpt[locale]}
        </p>
      ) : null}
    </Link>
  );
}
