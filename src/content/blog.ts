import 'server-only';
import { cache } from 'react';
import { doorBase } from '@/forms/env';
import type { Locale } from '@/i18n/routing';
import { isPreviewToken } from '@/lib/blog-preview';
import type { Bundle } from '../../contract/website-bundle.v1';
import { getBundle } from './adapter';
import {
  BlogFeedContractError,
  feedToRows,
  previewToRow,
  withBlogRows,
  type BlogFeedRows,
} from './blog-feed';
import type { BlogPost } from './collections';
import type { ContentSource } from './config';

export {
  coverVariant,
  EDITORIAL_AUTHOR,
  redirectTarget,
  RESERVED_BLOG_SLUGS,
  type BlogRedirect,
} from './blog-feed';

/**
 * The blog's one source switch (docs/ARCHITECTURE.md § Content adapter — blog). With
 * `BLOG_SOURCE=OPS` and `OPS_API_URL` set, the `blog` collection comes from Operations'
 * public feed (`GET /api/website/v1/blog`, contract `blog.v1`, no token — published posts are
 * public content); every other collection stays on the bundle `getBundle` serves. Anything else
 * — unset, `LOCAL`, no `OPS_API_URL` — is the LOCAL bundle's rows.
 *
 * Freshness: the feed is read with `revalidate: 60` under the `blog` tag, so a publish,
 * an unpublish or an edit in Operations is live within a minute with no webhook and no shared
 * secret (W248). The pages that read the blog (index, articles, home guides, work-permit related
 * articles, the sitemap) take that 60 s floor; nothing else does.
 *
 * Failure (`BlogFeedUnavailableError`: network, HTTP error, a body that is not JSON or not
 * `blog.v1`): always logged. At BUILD time and outside production the LOCAL rows stand in, so a
 * cold build never fails on an Operations outage. At RUNTIME in production the error is thrown:
 * Next keeps serving the last good page of an ISR revalidation and retries on the next request,
 * so an outage never swaps live articles for the fallback (or 404s them) — the careers rule.
 */
export class BlogFeedUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlogFeedUnavailableError';
  }
}

export const BLOG_TAG = 'blog';
export const BLOG_REVALIDATE_SECONDS = 60;
const FEED_PATH = '/api/website/v1/blog';
const PREVIEW_PATH = '/api/website/v1/blog/preview/';
const HEADERS = { accept: 'application/json' };

/** Tests inject both; production reads the real `fetch` and `process.env`. */
export type BlogDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv };

export function blogSource(env: NodeJS.ProcessEnv = process.env): ContentSource {
  return env.BLOG_SOURCE?.trim() === 'OPS' && doorBase(env) ? 'OPS' : 'LOCAL';
}

/** Runtime in production (not `next build`): a feed failure must keep the last good page. */
function keepsLastGoodPage(env: NodeJS.ProcessEnv): boolean {
  return env.NODE_ENV === 'production' && env.NEXT_PHASE !== 'phase-production-build';
}

const reason = (err: unknown) => (err instanceof Error ? err.message : String(err));

async function readJson(res: Response, what: string): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    // An HTML error or login page served with a 200 is the same outage as a 500 (R28).
    throw new BlogFeedUnavailableError(`${what}: the body is not JSON`);
  }
}

export async function fetchBlogFeedUncached(deps: BlogDeps = {}): Promise<BlogFeedRows> {
  const env = deps.env ?? process.env;
  const base = doorBase(env);
  if (!base) throw new BlogFeedUnavailableError('feed: OPS_API_URL is not set');
  const f = deps.fetch ?? fetch;
  let res: Response;
  try {
    res = await f(`${base}${FEED_PATH}`, {
      headers: HEADERS,
      next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_TAG] },
    });
  } catch (err) {
    throw new BlogFeedUnavailableError(`feed: ${reason(err)}`);
  }
  if (!res.ok) throw new BlogFeedUnavailableError(`feed: HTTP ${res.status}`);
  const raw = await readJson(res, 'feed');
  try {
    return feedToRows(raw);
  } catch (err) {
    if (err instanceof BlogFeedContractError) throw new BlogFeedUnavailableError(err.message);
    throw err;
  }
}

/** `rows: null` = the LOCAL bundle's own rows. */
export type BlogFeedState =
  | { source: 'OPS'; rows: BlogPost[]; redirects: BlogFeedRows['redirects'] }
  | { source: 'LOCAL'; rows: null; redirects: [] };

const LOCAL_STATE: BlogFeedState = { source: 'LOCAL', rows: null, redirects: [] };

export async function loadBlogFeed(deps: BlogDeps = {}): Promise<BlogFeedState> {
  const env = deps.env ?? process.env;
  if (blogSource(env) !== 'OPS') return LOCAL_STATE;
  try {
    return { source: 'OPS', ...(await fetchBlogFeedUncached(deps)) };
  } catch (err) {
    if (!(err instanceof BlogFeedUnavailableError)) throw err;
    if (keepsLastGoodPage(env)) {
      console.error('[blog] feed unavailable — keeping the last good page', err.message);
      throw err;
    }
    console.error('[blog] feed unavailable — serving the LOCAL rows', err.message);
    return LOCAL_STATE;
  }
}

/** One feed read per request (React `cache`); across requests Next's data cache answers under
 *  the `blog` tag for 60 s. */
export const getBlogFeed = cache((): Promise<BlogFeedState> => loadBlogFeed());

/** The bundle every blog reader takes: `getBundle(locale)` with the `blog` collection from the
 *  feed under `BLOG_SOURCE=OPS`, unchanged otherwise. `getCollection(bundle, 'blog')` keeps
 *  working for every reader — the rows are the same `BlogPostSchema` shape. */
export const getBlogBundle = cache(async (locale: Locale): Promise<Bundle> => {
  const [bundle, feed] = await Promise.all([getBundle(locale), getBlogFeed()]);
  return feed.source === 'OPS' ? withBlogRows(bundle, feed.rows) : bundle;
});

export type BlogPreviewResult =
  | { status: 'ok'; post: BlogPost }
  /** expired, revoked or malformed token (Operations answers 410) */
  | { status: 'invalid' }
  /** the draft has no title or body in the requested language */
  | { status: 'empty' }
  /** no door configured, network/HTTP failure, or a body that is not `{ post }` */
  | { status: 'unavailable' };

/** The draft behind a preview token, rendered in `locale` (never cached: `no-store`). The site
 *  holds no secret — Operations validates its own signed token. Needs only `OPS_API_URL`, so a
 *  draft can be previewed before `BLOG_SOURCE` is switched to `OPS`. */
export async function fetchBlogPreview(
  token: string,
  locale: Locale,
  deps: BlogDeps = {},
): Promise<BlogPreviewResult> {
  if (!isPreviewToken(token)) return { status: 'invalid' };
  const base = doorBase(deps.env ?? process.env);
  if (!base) return { status: 'unavailable' };
  const f = deps.fetch ?? fetch;
  let res: Response;
  try {
    res = await f(`${base}${PREVIEW_PATH}${encodeURIComponent(token)}`, {
      headers: HEADERS,
      cache: 'no-store',
    });
  } catch (err) {
    console.error('[blog] preview unavailable', reason(err));
    return { status: 'unavailable' };
  }
  if ([400, 401, 403, 404, 410].includes(res.status)) return { status: 'invalid' };
  if (!res.ok) {
    console.error('[blog] preview unavailable', `HTTP ${res.status}`);
    return { status: 'unavailable' };
  }
  try {
    const post = previewToRow(await readJson(res, 'preview'), locale);
    return post ? { status: 'ok', post } : { status: 'empty' };
  } catch (err) {
    console.error('[blog] preview unavailable', reason(err));
    return { status: 'unavailable' };
  }
}
