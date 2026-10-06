import { z } from 'zod';

/**
 * The Operations → website blog feed, contract `blog.v1` (docs/INTEGRATIONS.md I21; plan
 * docs/superpowers/plans/2026-10-06-blog-module.md § Contract). Operations serves it publicly —
 * published posts are public content, no website token — and the site reads it server-side only
 * (`src/content/blog.ts`). Unlike `website-bundle.v1.ts` this file is not vendored into
 * Operations: Operations keeps its own fixture of the same shape
 * (`apps/backend/src/modules/website/blog/__fixtures__/blog-feed.v1.json`), diffed against
 * `blog-feed.v1.fixture.json` here. Zod strips unknown keys, so an additive Operations change
 * never breaks this reader; anything else is a new contract version.
 *
 * Reading is deliberately tolerant where a producer could reasonably differ: an empty or
 * whitespace-only string reads as `null`, and `readMinutes` may be 0 (the mapping floors it at 1).
 */
export const BLOG_FEED_CONTRACT_VERSION = 'blog.v1';

export const BLOG_FEED_CATEGORIES = [
  'workPermits',
  'recruitment',
  'compliance',
  'marketNews',
] as const;
export const BLOG_FEED_LOCALES = ['tr', 'en'] as const;

/** Lower-case ASCII words joined by single hyphens — the only slug shape a post URL takes. */
export const BLOG_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
export const isoDateTime = z
  .string()
  .refine((s) => ISO_DATE_TIME.test(s) && !Number.isNaN(Date.parse(s)), 'not an ISO date-time');

/** `''` / whitespace → `null`; anything else must be a string or `null`. */
const optText = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? null : v),
  z.string().nullable(),
);
const perLocaleText = z.object({ tr: optText, en: optText });
const perLocaleSlug = z.object({
  tr: z.preprocess((v) => (v === '' ? null : v), z.string().regex(BLOG_SLUG_RE).nullable()),
  en: z.preprocess((v) => (v === '' ? null : v), z.string().regex(BLOG_SLUG_RE).nullable()),
});
const minutes = z.number().int().nonnegative().nullable();
export const BlogFeedFaqItemSchema = z.object({ q: z.string().min(1), a: z.string().min(1) });

export const BlogFeedPostSchema = z.object({
  key: z.string().min(1),
  number: z.string().min(1),
  category: z.enum(BLOG_FEED_CATEGORIES),
  featured: z.boolean(),
  publishedAt: isoDateTime,
  updatedAt: isoDateTime,
  /** `null` → "JobsAdmire Editorial" (the site's own copy). */
  author: z.object({ name: z.string().min(1), title: optText }).nullable(),
  /** `url` is absolute — the 1600 px variant of `GET /api/website/v1/media/:assetId/:variant.webp`. */
  cover: z
    .object({
      url: z.string().url(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .nullable(),
  /** The post's "show the cover at the top of the article" switch (owner 2026-10-06, W250) —
   *  additive to `blog.v1`: absent or `null` (a producer from before the switch) reads as `true`.
   *  `false` keeps `cover` for the cards and the share image only. */
  showCover: z.boolean().nullish(),
  slug: perLocaleSlug,
  title: perLocaleText,
  excerpt: perLocaleText,
  /** Site Markdown (docs/CONTENT-MODEL.md § Blog body grammar); `media:<id>` images arrive
   *  rewritten to the absolute 1200 px variant URL. */
  body: perLocaleText,
  hasBody: z.object({ tr: z.boolean(), en: z.boolean() }),
  readMinutes: z.object({ tr: minutes, en: minutes }),
  coverAlt: perLocaleText,
  seo: z.object({ title: perLocaleText, description: perLocaleText }),
  faq: z.object({ tr: z.array(BlogFeedFaqItemSchema), en: z.array(BlogFeedFaqItemSchema) }),
});
export type BlogFeedPost = z.infer<typeof BlogFeedPostSchema>;

/** A slug that changed: the old one 308s to the new one in that locale. Slugs, not paths. */
export const BlogFeedRedirectSchema = z.object({
  locale: z.enum(BLOG_FEED_LOCALES),
  from: z.string().regex(BLOG_SLUG_RE),
  to: z.string().regex(BLOG_SLUG_RE),
});
export type BlogFeedRedirect = z.infer<typeof BlogFeedRedirectSchema>;

/** `GET /api/website/v1/blog`: only PUBLISHED posts with at least one ready language, newest
 *  first. The site validates the envelope here and every post/redirect on its own (one bad row
 *  is logged and left out, the rest still render — R28). */
export const BlogFeedEnvelopeSchema = z.object({
  contractVersion: z.literal(BLOG_FEED_CONTRACT_VERSION),
  generatedAt: isoDateTime,
  posts: z.array(z.unknown()),
  redirects: z.array(z.unknown()),
});

/** The whole feed, strictly — what the fixture (and a well-behaved producer) satisfies. */
export const BlogFeedSchema = BlogFeedEnvelopeSchema.extend({
  posts: z.array(BlogFeedPostSchema),
  redirects: z.array(BlogFeedRedirectSchema),
});
export type BlogFeed = z.infer<typeof BlogFeedSchema>;

/** `GET /api/website/v1/blog/preview/:token` → `{ post }`, built from the current draft (any
 *  status); 410 when the token is expired or invalid. A draft that was never published may carry
 *  no `publishedAt` — read here as `null` (the page then shows today). */
export const BlogPreviewSchema = z.object({
  post: BlogFeedPostSchema.extend({ publishedAt: isoDateTime.nullable() }),
});
export type BlogPreviewPost = z.infer<typeof BlogPreviewSchema>['post'];
