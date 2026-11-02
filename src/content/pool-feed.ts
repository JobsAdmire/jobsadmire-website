import 'server-only';
import { cache } from 'react';
import { doorBase } from '@/forms/env';
import type { ContentSource } from './config';
import { feedToCandidates, PoolFeedContractError, type PoolCandidate } from './pool-candidates';

export type { PoolCandidate } from './pool-candidates';

/**
 * The candidates' one source switch (docs/ARCHITECTURE.md § Content adapter — candidates; owner
 * 2026-11-02). With `POOL_SOURCE=OPS` and `OPS_API_URL` set, the Available Workers page and the
 * home marquee read Operations' public feed (`GET /api/website/v1/candidates`, contract
 * `candidates.v1`, no token — the published profiles are public content by the owner's
 * decision) and show real cards with name and photo. Anything else — unset, `LOCAL`, no
 * `OPS_API_URL` — is the design's sample under the sample tag. The feed is not a fixture:
 * `FIXTURE_ONLY_COLLECTIONS` / D23 are untouched and the bundle's `pool` collection stays unused.
 *
 * Freshness: the feed is read with `revalidate: 60` under the `pool` tag, so a candidate who
 * takes a job, or whom the portal hides from the website, leaves the site within Operations'
 * 5-minute sync plus a minute. The two pages that read it take that 60 s floor.
 *
 * Failure (`PoolFeedUnavailableError`: network, HTTP error, a body that is not JSON or not
 * `candidates.v1`): always logged. At BUILD time and outside production the sample stands in,
 * so a cold build never fails on an Operations outage. At RUNTIME in production the error is
 * thrown: Next keeps serving the last good page of an ISR revalidation and retries on the next
 * request, so an outage never swaps real candidates for the sample — the blog's rule.
 */
export class PoolFeedUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PoolFeedUnavailableError';
  }
}

export const POOL_TAG = 'pool';
export const POOL_REVALIDATE_SECONDS = 60;
const FEED_PATH = '/api/website/v1/candidates';
const HEADERS = { accept: 'application/json' };
/** A producer that pages is followed through `nextCursor`, never further than this. */
export const POOL_MAX_PAGES = 10;

/** Tests inject both; production reads the real `fetch` and `process.env`. */
export type PoolDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv };

export function poolSource(env: NodeJS.ProcessEnv = process.env): ContentSource {
  return env.POOL_SOURCE?.trim() === 'OPS' && doorBase(env) ? 'OPS' : 'LOCAL';
}

/** Runtime in production (not `next build`): a feed failure must keep the last good page. */
function keepsLastGoodPage(env: NodeJS.ProcessEnv): boolean {
  return env.NODE_ENV === 'production' && env.NEXT_PHASE !== 'phase-production-build';
}

const reason = (err: unknown) => (err instanceof Error ? err.message : String(err));

async function readPage(f: typeof fetch, url: string): Promise<unknown> {
  let res: Response;
  try {
    res = await f(url, {
      headers: HEADERS,
      next: { revalidate: POOL_REVALIDATE_SECONDS, tags: [POOL_TAG] },
    });
  } catch (err) {
    throw new PoolFeedUnavailableError(`feed: ${reason(err)}`);
  }
  if (!res.ok) throw new PoolFeedUnavailableError(`feed: HTTP ${res.status}`);
  try {
    return await res.json();
  } catch {
    // An HTML error or login page served with a 200 is the same outage as a 500 (R28).
    throw new PoolFeedUnavailableError('feed: the body is not JSON');
  }
}

/** Every published candidate, in the feed's order (pages followed through `nextCursor`). */
export async function fetchPoolFeedUncached(deps: PoolDeps = {}): Promise<PoolCandidate[]> {
  const env = deps.env ?? process.env;
  const base = doorBase(env);
  if (!base) throw new PoolFeedUnavailableError('feed: OPS_API_URL is not set');
  const f = deps.fetch ?? fetch;
  const seen = new Set<string>();
  const out: PoolCandidate[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < POOL_MAX_PAGES; page++) {
    const url: string = cursor
      ? `${base}${FEED_PATH}?cursor=${encodeURIComponent(cursor)}`
      : `${base}${FEED_PATH}`;
    const raw = await readPage(f, url);
    try {
      const next = feedToCandidates(raw, undefined, seen);
      out.push(...next.candidates);
      cursor = next.nextCursor;
    } catch (err) {
      if (err instanceof PoolFeedContractError) throw new PoolFeedUnavailableError(err.message);
      throw err;
    }
    if (!cursor) return out;
  }
  console.error('[pool] the feed pages past the cap — the first pages stand', {
    pages: POOL_MAX_PAGES,
  });
  return out;
}

/** `candidates: null` = the design's sample (the page's `SAMPLE_POOL`, the home's own six). */
export type PoolFeedState =
  { source: 'OPS'; candidates: PoolCandidate[] } | { source: 'LOCAL'; candidates: null };

const SAMPLE_STATE: PoolFeedState = { source: 'LOCAL', candidates: null };

export async function loadPoolFeed(deps: PoolDeps = {}): Promise<PoolFeedState> {
  const env = deps.env ?? process.env;
  if (poolSource(env) !== 'OPS') return SAMPLE_STATE;
  try {
    return { source: 'OPS', candidates: await fetchPoolFeedUncached(deps) };
  } catch (err) {
    if (!(err instanceof PoolFeedUnavailableError)) throw err;
    if (keepsLastGoodPage(env)) {
      console.error('[pool] feed unavailable — keeping the last good page', err.message);
      throw err;
    }
    console.error('[pool] feed unavailable — serving the sample', err.message);
    return SAMPLE_STATE;
  }
}

/** One feed read per request (React `cache`); across requests Next's data cache answers under
 *  the `pool` tag for 60 s. */
export const getPoolFeed = cache((): Promise<PoolFeedState> => loadPoolFeed());
