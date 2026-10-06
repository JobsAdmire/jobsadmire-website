// Runtime-agnostic (no `server-only`): the Operations blog feed (contract `blog.v1`,
// `contract/blog-feed.v1.ts`) mapped into the site's `blog` collection rows. The fetching and the
// LOCAL fallback live in `./blog.ts`; this module only validates and maps, so the unit suite can
// run it against the contract fixture.
import type { Bundle } from '../../contract/website-bundle.v1';
import {
  BLOG_SLUG_RE,
  BlogFeedEnvelopeSchema,
  BlogFeedPostSchema,
  BlogFeedRedirectSchema,
  BlogPreviewSchema,
  type BlogFeedPost,
  type BlogPreviewPost,
} from '../../contract/blog-feed.v1';
import { isBlogImageSrc } from '@/lib/blog-media';
import { BLOG_CATEGORY_LABEL_ID, type BlogPost } from './collections';

type Locale = 'tr' | 'en';
const LOCALES: readonly Locale[] = ['tr', 'en'];

/** Slugs a post can never take: `/blog/preview` is the draft-preview route (a static segment
 *  that always wins over `[slug]`). Operations reserves the same words in its slug rules. */
export const RESERVED_BLOG_SLUGS: ReadonlySet<string> = new Set(['preview']);

/** The author line when a post names nobody (`author: null`) — the LOCAL row's value too. */
export const EDITORIAL_AUTHOR = 'JobsAdmire';

export type BlogRedirect = { locale: Locale; from: string; to: string };
export type BlogFeedRows = { rows: BlogPost[]; redirects: BlogRedirect[] };

/** The feed answered, but not with a `blog.v1` envelope (R28: one class, one fallback path). */
export class BlogFeedContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlogFeedContractError';
  }
}

export type FeedLog = (message: string, detail?: Record<string, unknown>) => void;
const defaultLog: FeedLog = (message, detail) => console.error(`[blog] ${message}`, detail ?? '');

/** The calendar date an instant falls on in Türkiye (UTC+3 all year since 2016) — the site's
 *  `publishedAt` is a date, and a post published at 00:30 in Antalya is that day's post. */
export function istanbulDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new RangeError(`not an ISO date: ${iso}`);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** ~200 words a minute, never under one — used only when the feed sends no reading time. */
export function estimateReadMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const perLocale = <T>(f: (l: Locale) => T): { tr: T; en: T } => ({ tr: f('tr'), en: f('en') });

/** One feed post → one site row, or `null` when no locale is written (nothing could render).
 *  A locale is written when it has a body, a slug, a title and the producer says so
 *  (`hasBody`); everything of an unwritten locale is nulled, so no reader can list it. A
 *  reserved slug (`preview`) demotes its locale. `lenient` (the draft preview) ignores `hasBody`
 *  and a missing slug: a draft is previewed before its language is marked ready. */
export function mapFeedPost(
  post: BlogFeedPost | BlogPreviewPost,
  options: { lenient?: boolean; now?: () => Date; log?: FeedLog } = {},
): BlogPost | null {
  const log = options.log ?? defaultLog;
  const written = perLocale((l) => {
    const slug = post.slug[l] ?? (options.lenient ? 'preview' : null);
    const ok =
      (options.lenient || post.hasBody[l]) && post.body[l] !== null && post.title[l] !== null;
    if (!ok || slug === null) return false;
    if (!options.lenient && RESERVED_BLOG_SLUGS.has(slug)) {
      log('a post uses a reserved slug and was left out in that language', {
        key: post.key,
        locale: l,
        slug,
      });
      return false;
    }
    return true;
  });
  if (!written.tr && !written.en) return null;
  const minutes = perLocale((l) =>
    written[l] ? Math.max(1, post.readMinutes[l] ?? estimateReadMinutes(post.body[l] ?? '')) : null,
  );
  const published = post.publishedAt ?? (options.now ?? (() => new Date()))().toISOString();
  // `next/image` refuses any host but the media route (`next.config.ts`): a cover from anywhere
  // else would take the page down, so it is dropped (the category cover shows instead).
  const cover = post.cover && isBlogImageSrc(post.cover.url) ? post.cover : null;
  if (post.cover && !cover)
    log('a cover is not on the media route and was left out', { key: post.key });
  const only = <T>(v: { tr: T | null; en: T | null }) =>
    perLocale((l) => (written[l] ? v[l] : null));
  return {
    key: post.key,
    slug: perLocale((l) => (written[l] ? (post.slug[l] ?? 'preview') : null)),
    title: only(post.title),
    excerpt: only(post.excerpt),
    category: post.category,
    categoryLabelId: BLOG_CATEGORY_LABEL_ID[post.category],
    author: post.author?.name ?? EDITORIAL_AUTHOR,
    publishedAt: istanbulDate(published),
    readMinutes: (minutes.en ?? minutes.tr) as number,
    hasBody: written,
    body: only(post.body),
    updatedAt: post.updatedAt,
    featured: post.featured,
    authorObj: post.author ? { name: post.author.name, title: post.author.title } : null,
    cover,
    coverAlt: only(post.coverAlt),
    seo: { title: only(post.seo.title), description: only(post.seo.description) },
    faq: perLocale((l) => (written[l] ? post.faq[l] : [])),
    readMinutesByLocale: minutes,
  };
}

/**
 * A `GET /api/website/v1/blog` body → the site's rows and slug redirects. The envelope must be
 * `blog.v1` (else `BlogFeedContractError`, the caller's fallback path); each post and redirect
 * is then validated on its own — a bad one is logged and left out, the rest render (R28). A slug
 * already taken in a locale by a newer post is left out the same way (the feed is newest first).
 */
export function feedToRows(raw: unknown, log: FeedLog = defaultLog): BlogFeedRows {
  const envelope = BlogFeedEnvelopeSchema.safeParse(raw);
  if (!envelope.success) {
    const issue = envelope.error.issues[0];
    throw new BlogFeedContractError(
      `feed: contract violation at ${issue?.path.join('.') || '(root)'}: ${issue?.message}`,
    );
  }
  const rows: BlogPost[] = [];
  const taken = perLocale(() => new Set<string>());
  envelope.data.posts.forEach((item, index) => {
    const parsed = BlogFeedPostSchema.safeParse(item);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      log('a post broke the contract and was left out', {
        index,
        path: issue?.path.join('.'),
        issue: issue?.message,
      });
      return;
    }
    const row = mapFeedPost(parsed.data, { log });
    if (!row) return;
    for (const l of LOCALES) {
      const slug = row.slug[l];
      if (slug === null) continue;
      if (taken[l].has(slug)) {
        log('two posts share a slug; the older one was left out in that language', {
          key: row.key,
          locale: l,
          slug,
        });
        row.slug[l] = row.title[l] = row.excerpt[l] = row.body[l] = null;
        row.hasBody[l] = false;
        continue;
      }
      taken[l].add(slug);
    }
    if (row.hasBody.tr || row.hasBody.en) rows.push(row);
  });
  const redirects: BlogRedirect[] = [];
  envelope.data.redirects.forEach((item, index) => {
    const parsed = BlogFeedRedirectSchema.safeParse(item);
    if (!parsed.success || parsed.data.from === parsed.data.to) {
      log('a redirect broke the contract and was left out', { index });
      return;
    }
    redirects.push(parsed.data);
  });
  return { rows, redirects };
}

/** A `GET /api/website/v1/blog/preview/:token` body → the draft as a site row in `locale`, or
 *  `null` when the draft has no title or body in that language. Throws
 *  `BlogFeedContractError` on a body that is not `{ post }`. */
export function previewToRow(raw: unknown, locale: Locale, now?: () => Date): BlogPost | null {
  const parsed = BlogPreviewSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new BlogFeedContractError(
      `preview: contract violation at ${issue?.path.join('.') || '(root)'}: ${issue?.message}`,
    );
  }
  const row = mapFeedPost(parsed.data.post, { lenient: true, now });
  return row && row.hasBody[locale] ? row : null;
}

/** The site's bundle with its `blog` collection replaced by the feed's rows. */
export function withBlogRows(bundle: Bundle, rows: readonly BlogPost[]): Bundle {
  return {
    ...bundle,
    collections: { ...bundle.collections, blog: rows as unknown as Record<string, unknown>[] },
  };
}

/** The redirect target of an old slug in one locale, or `null`. One hop: the target must be a
 *  slug some row is written under in that locale (a redirect to a missing post is a 404). */
export function redirectTarget(
  redirects: readonly BlogRedirect[],
  rows: readonly BlogPost[],
  locale: Locale,
  slug: string,
): string | null {
  const hit = redirects.find((r) => r.locale === locale && r.from === slug);
  if (!hit || !BLOG_SLUG_RE.test(hit.to)) return null;
  return rows.some((p) => p.hasBody[locale] && p.slug[locale] === hit.to) ? hit.to : null;
}

/** The media route's 1200 px variant of a cover URL (the per-post OG image); any other URL as
 *  is. Operations serves `…/media/:assetId/:variant.webp` with variants 640/1200/1600/2400. */
export function coverVariant(url: string, variant: 640 | 1200 | 1600 | 2400): string {
  return url.replace(/\/(?:640|1200|1600|2400)\.webp$/, `/${variant}.webp`);
}
