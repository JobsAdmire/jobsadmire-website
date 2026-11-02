import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchPoolFeedUncached,
  loadPoolFeed,
  POOL_MAX_PAGES,
  POOL_REVALIDATE_SECONDS,
  POOL_TAG,
  PoolFeedUnavailableError,
  poolSource,
} from './pool-feed';

const FIXTURE = JSON.parse(
  readFileSync(join(process.cwd(), 'contract/candidates-feed.v1.fixture.json'), 'utf8'),
) as { candidates: unknown[] } & Record<string, unknown>;

const OPS = {
  NODE_ENV: 'test',
  POOL_SOURCE: 'OPS',
  OPS_API_URL: 'https://operations.example.com/',
} as NodeJS.ProcessEnv;
const PROD_RUNTIME = { ...OPS, NODE_ENV: 'production' } as NodeJS.ProcessEnv;
const PROD_BUILD = { ...PROD_RUNTIME, NEXT_PHASE: 'phase-production-build' } as NodeJS.ProcessEnv;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

let fetchMock: ReturnType<typeof vi.fn>;
const f = () => fetchMock as unknown as typeof fetch;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('poolSource (the one switch)', () => {
  it('is OPS only with POOL_SOURCE=OPS and an OPS_API_URL', () => {
    expect(poolSource(OPS)).toBe('OPS');
    expect(poolSource({ ...OPS, POOL_SOURCE: ' OPS ' } as NodeJS.ProcessEnv)).toBe('OPS');
    expect(poolSource({ ...OPS, POOL_SOURCE: '' } as NodeJS.ProcessEnv)).toBe('LOCAL');
    expect(poolSource({ ...OPS, POOL_SOURCE: 'ops' } as NodeJS.ProcessEnv)).toBe('LOCAL');
    expect(poolSource({ ...OPS, OPS_API_URL: '' } as NodeJS.ProcessEnv)).toBe('LOCAL');
    // independent of the blog's and the bundle's switches, and of any website token
    expect(
      poolSource({ ...OPS, BLOG_SOURCE: '', CONTENT_SOURCE: 'LOCAL' } as NodeJS.ProcessEnv),
    ).toBe('OPS');
  });
});

describe('fetchPoolFeedUncached', () => {
  it('reads the public feed with no token, under the pool tag, 60 s floor', async () => {
    fetchMock.mockResolvedValue(json(FIXTURE));
    const rows = await fetchPoolFeedUncached({ fetch: f(), env: OPS });
    expect(rows).toHaveLength(14);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://operations.example.com/api/website/v1/candidates');
    expect(init.next).toEqual({ revalidate: POOL_REVALIDATE_SECONDS, tags: [POOL_TAG] });
    expect(POOL_REVALIDATE_SECONDS).toBe(60);
    expect(POOL_TAG).toBe('pool');
    expect(JSON.stringify(init.headers)).not.toMatch(/authorization/i);
  });

  it('follows nextCursor, dedupes refs across pages, stops at the page cap', async () => {
    const [a, b, ...rest] = FIXTURE.candidates;
    fetchMock
      .mockResolvedValueOnce(json({ ...FIXTURE, candidates: [a, b], nextCursor: 'p2' }))
      .mockResolvedValueOnce(json({ ...FIXTURE, candidates: [b, ...rest], nextCursor: null }));
    const rows = await fetchPoolFeedUncached({ fetch: f(), env: OPS });
    expect(rows).toHaveLength(14);
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://operations.example.com/api/website/v1/candidates?cursor=p2',
    );
    fetchMock.mockReset();
    fetchMock.mockImplementation(() =>
      Promise.resolve(json({ ...FIXTURE, candidates: [], nextCursor: 'again' })),
    );
    await fetchPoolFeedUncached({ fetch: f(), env: OPS });
    expect(fetchMock).toHaveBeenCalledTimes(POOL_MAX_PAGES);
  });

  it('every failure is one error class: network, HTTP, not JSON, not candidates.v1', async () => {
    const cases: (() => Promise<Response>)[] = [
      () => Promise.reject(new Error('ECONNREFUSED')),
      () => Promise.resolve(json({ error: 'x' }, 503)),
      () => Promise.resolve(new Response('<html>login</html>', { status: 200 })),
      () => Promise.resolve(json({ contractVersion: 'candidates.v2', candidates: [] })),
    ];
    for (const answer of cases) {
      fetchMock.mockImplementationOnce(answer);
      await expect(fetchPoolFeedUncached({ fetch: f(), env: OPS })).rejects.toBeInstanceOf(
        PoolFeedUnavailableError,
      );
    }
  });
});

describe('loadPoolFeed (the fallback rules)', () => {
  it('source off → the sample, no network', async () => {
    expect(
      await loadPoolFeed({ fetch: f(), env: { ...OPS, POOL_SOURCE: '' } as NodeJS.ProcessEnv }),
    ).toEqual({
      source: 'LOCAL',
      candidates: null,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('a good feed → OPS rows; an empty feed → OPS with none (the no-results state, not the sample)', async () => {
    fetchMock.mockResolvedValueOnce(json(FIXTURE));
    const state = await loadPoolFeed({ fetch: f(), env: PROD_RUNTIME });
    expect(state.source).toBe('OPS');
    expect(state.candidates).toHaveLength(14);
    fetchMock.mockResolvedValueOnce(json({ ...FIXTURE, candidates: [], total: 0 }));
    expect(await loadPoolFeed({ fetch: f(), env: PROD_RUNTIME })).toEqual({
      source: 'OPS',
      candidates: [],
    });
  });

  it('down outside production or at build time → the sample (a cold build never fails)', async () => {
    for (const env of [OPS, PROD_BUILD]) {
      fetchMock.mockResolvedValueOnce(json({}, 502));
      expect(await loadPoolFeed({ fetch: f(), env })).toEqual({
        source: 'LOCAL',
        candidates: null,
      });
    }
  });

  it('down at runtime in production → throws, so ISR keeps the last good page', async () => {
    fetchMock.mockResolvedValueOnce(json({}, 502));
    await expect(loadPoolFeed({ fetch: f(), env: PROD_RUNTIME })).rejects.toBeInstanceOf(
      PoolFeedUnavailableError,
    );
  });
});
