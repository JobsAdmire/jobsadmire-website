import type { BlogPost } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatDate, formatReadMinutes } from '@/lib/format/date';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { ImageSlot } from './ImageSlot';

/** The alt-language pill: on a TR card "also in English" (blog.081), on an EN card
 *  "Türkçe'de de var" (blog.077) — shown only when the other locale's body exists (W4). */
const ALSO_IN_ID: Record<Locale, string> = { tr: 'blog.081', en: 'blog.077' };

/** Cover boxes: the package's 190/104/270 px heights × 0.75 (D19), as width/height pairs so
 *  `ImageSlot` reserves the same box with or without the photo. */
const COVER = {
  card: { width: 380, height: 142, className: '' },
  row: { width: 104, height: 78, className: 'w-[104px] shrink-0' },
  featured: { width: 640, height: 202, className: '' },
} as const;

/** The blog card (Blog grid, Article related, Homepage teaser, Work Permit "keep reading").
 *  The title is the single link; the cover is `ImageSlot` `blog-cover-<key>` (W27/W55) — the
 *  page passes `coverSrc` from its image policy, and without one the named placeholder is
 *  what the launch counter sees (D26). Renders nothing when the post has no slug or title in
 *  this locale (W33: an unwritten translation is not a card — callers may filter first). */
export function PostCard({
  bundle,
  locale,
  post,
  variant = 'card',
  categoryLabel,
  coverSrc = null,
  headingLevel = 3,
}: {
  bundle: Bundle;
  locale: Locale;
  post: BlogPost;
  variant?: 'card' | 'row' | 'featured';
  /** Overrides `t(post.categoryLabelId)` (a page-local category table, if any). */
  categoryLabel?: string;
  coverSrc?: string | null;
  headingLevel?: 2 | 3;
}) {
  const slug = post.slug[locale];
  const title = post.title[locale];
  if (!slug || !title) return null;
  const t = makeTf(bundle, locale);
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const other: Locale = locale === 'tr' ? 'en' : 'tr';
  const excerpt = post.excerpt[locale];
  const meta = `${formatDate(post.publishedAt, locale)} · ${formatReadMinutes(post.readMinutes, locale)}`;
  const row = variant === 'row';
  const cover = COVER[variant];
  return (
    <article
      className={[
        'rounded-xl border border-border-2 bg-white shadow-card transition-shadow hover:shadow-card-hover',
        row ? 'flex gap-4 p-4' : 'flex flex-col overflow-hidden',
      ].join(' ')}
    >
      <ImageSlot
        slot={`blog-cover-${post.key}`}
        src={coverSrc}
        alt=""
        width={cover.width}
        height={cover.height}
        className={['rounded-xs object-cover', cover.className].filter(Boolean).join(' ')}
      />
      <div className={row ? 'flex min-w-0 flex-1 flex-col' : 'flex flex-1 flex-col p-6'}>
        <div className="mb-3 flex flex-wrap gap-2">
          {variant === 'featured' && (
            <span className="rounded-pill bg-ink px-3 py-1 text-eyebrow font-extrabold text-white">
              {t('blog.034')}
            </span>
          )}
          <span className="rounded-pill border border-tint-border bg-tint px-3 py-1 text-eyebrow font-extrabold text-blue-safe">
            {categoryLabel ?? t(post.categoryLabelId)}
          </span>
        </div>
        <Heading className="text-card-title m-0 mb-2">
          <Link
            href={{ pathname: '/blog/[slug]', params: { slug } }}
            className="text-ink no-underline hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
          >
            {title}
          </Link>
        </Heading>
        {!row && excerpt && <p className="text-body-sm m-0 mb-4 text-text-tertiary">{excerpt}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-eyebrow font-bold text-muted">
          <span>{meta}</span>
          {post.hasBody[other] && !row && (
            <span className="rounded-pill bg-pale-1 px-2 py-0.5 text-text-secondary">
              {t(ALSO_IN_ID[locale])}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
