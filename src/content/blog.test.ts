import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BLOG_REVALIDATE_SECONDS,
  BLOG_TAG,
  BlogFeedUnavailableError,
  blogSource,
  fetchBlogFeedUncached,
  fetchBlogPreview,
  loadBlogFeed,
  loadBlogFeedFresh,
} from './blog';

const FIXTURE = JSON.parse(
  readFileSync(join(process.cwd(), 'contract/blog-feed.v1.fixture.json'), 'utf8'),
) as { posts: unknown[] };

const OPS = {
  NODE_ENV: 'test',
  BLOG_SOURCE: 'OPS',
  OPS_API_URL: 'https://operations.example.com/',
} as NodeJS.ProcessEnv;
const PROD_RUNTIME = { ...OPS, NODE_ENV: 'production' } as NodeJS.ProcessEnv;
const PROD_BUILD = { ...PROD_RUNTIME, NEXT_PHASE: 'phase-production-build' } as NodeJS.ProcessEnv;
const TOKEN = 'eyJwb3N0SWQiOiJ4In0.c2lnbmF0dXJl';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

let fetchMock: ReturnType<typeof vi.fn>;
const f = () => fetchMock as unknown as typeof fetch;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('blogSource (the one switch)', () => {
  it('is OPS only with BLOG_SOURCE=OPS and an OPS_API_URL', () => {
    expect(blogSource(OPS)).toBe('OPS');
    expect(blogSource({ ...OPS, BLOG_SOURCE: ' OPS ' } as NodeJS.ProcessEnv)).toBe('OPS');
    expect(blogSource({ ...OPS, BLOG_SOURCE: '' } as NodeJS.ProcessEnv)).toBe('LOCAL');
    expect(blogSource({ ...OPS, BLOG_SOURCE: 'ops' } as NodeJS.ProcessEnv)).toBe('LOCAL');
    expect(blogSource({ ...OPS, OPS_API_URL: '' } as NodeJS.ProcessEnv)).toBe('LOCAL');
    // independent of CONTENT_SOURCE and of any website token — the feed is public
    expect(blogSource({ ...OPS, CONTENT_SOURCE: 'LOCAL' } as NodeJS.ProcessEnv)).toBe('OPS');
  });
});

describe('fetchBlogFeedUncached', () => {
  it('reads the public feed with no token, under the blog tag, 60 s floor', async () => {
    fetchMock.mockResolvedValue(json(FIXTURE));
    const { rows, redirects } = await fetchBlogFeedUncached({ fetch: f(), env: OPS });
    expect(rows).toHaveLength(3);
    expect(redirects).toHaveLength(2);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://operations.example.com/api/website/v1/blog');
    expect(init.next).toEqual({ revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_TAG] });
    expect(BLOG_REVALIDATE_SECONDS).toBe(60);
    expect(JSON.stringify(init.headers)).not.toMatch(/authorization/i);
  });

  it('every failure is one error class: network, HTTP, not JSON, not blog.v1', async () => {
    const cases: (() => Promise<Response>)[] = [
      () => Promise.reject(new Error('ECONNREFUSED')),
      () => Promise.resolve(json({ error: 'x' }, 503)),
      () => Promise.resolve(new Response('<html>login</html>', { status: 200 })),
      () => Promise.resolve(json({ contractVersion: 'blog.v2', posts: [] })),
    ];
    for (const answer of cases) {
      fetchMock.mockImplementationOnce(answer);
      await expect(fetchBlogFeedUncached({ fetch: f(), env: OPS })).rejects.toBeInstanceOf(
        BlogFeedUnavailableError,
      );
    }
  });
});

describe("the sitemap's fresh read (W250)", () => {
  it('reads the feed `no-store` — never a data-cache copy', async () => {
    fetchMock.mockResolvedValue(json(FIXTURE));
    const state = await loadBlogFeedFresh({ fetch: f(), env: PROD_RUNTIME });
    expect(state.source).toBe('OPS');
    expect(state.rows).toHaveLength(3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.cache).toBe('no-store');
    expect(init.next).toBeUndefined();
  });

  it('a failed fresh read falls back to the cached read (the last good feed), logged', async () => {
    fetchMock.mockResolvedValueOnce(json({}, 502)).mockResolvedValueOnce(json(FIXTURE));
    const state = await loadBlogFeedFresh({ fetch: f(), env: PROD_RUNTIME });
    expect(state.rows).toHaveLength(3);
    expect(fetchMock.mock.calls[1][1].next).toEqual({
      revalidate: BLOG_REVALIDATE_SECONDS,
      tags: [BLOG_TAG],
    });
    expect(console.error).toHaveBeenCalledWith(
      '[blog] fresh feed read failed — the cached feed stands in',
      'feed: HTTP 502',
    );
  });

  it("LOCAL source: no call; Next's own bail-out to dynamic rendering is never swallowed", async () => {
    await expect(
      loadBlogFeedFresh({ fetch: f(), env: { ...OPS, BLOG_SOURCE: '' } as never }),
    ).resolves.toEqual({ source: 'LOCAL', rows: null, redirects: [] });
    expect(fetchMock).not.toHaveBeenCalled();
    const bailout = Object.assign(new Error('Dynamic server usage'), {
      digest: 'DYNAMIC_SERVER_USAGE',
    });
    fetchMock.mockRejectedValue(bailout);
    await expect(fetchBlogFeedUncached({ fetch: f(), env: OPS }, { fresh: true })).rejects.toBe(
      bailout,
    );
  });
});

describe('loadBlogFeed (the fallback rule)', () => {
  it('LOCAL source: no call, the LOCAL rows', async () => {
    const state = await loadBlogFeed({ fetch: f(), env: { ...OPS, BLOG_SOURCE: '' } as never });
    expect(state).toEqual({ source: 'LOCAL', rows: null, redirects: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('OPS source, feed fine: the feed rows and redirects', async () => {
    fetchMock.mockResolvedValue(json(FIXTURE));
    const state = await loadBlogFeed({ fetch: f(), env: OPS });
    expect(state.source).toBe('OPS');
    expect(state.rows).toHaveLength(3);
    expect(state.redirects).toHaveLength(2);
  });

  it('feed down outside production (dev, tests) or during `next build`: logged, the LOCAL rows', async () => {
    for (const env of [OPS, PROD_BUILD]) {
      fetchMock.mockResolvedValueOnce(json({}, 502));
      await expect(loadBlogFeed({ fetch: f(), env })).resolves.toEqual({
        source: 'LOCAL',
        rows: null,
        redirects: [],
      });
    }
    expect(console.error).toHaveBeenCalledWith(
      '[blog] feed unavailable — serving the LOCAL rows',
      'feed: HTTP 502',
    );
  });

  it('feed down at runtime in production: logged and thrown — ISR keeps the last good page', async () => {
    fetchMock.mockResolvedValue(json({}, 502));
    await expect(loadBlogFeed({ fetch: f(), env: PROD_RUNTIME })).rejects.toBeInstanceOf(
      BlogFeedUnavailableError,
    );
    expect(console.error).toHaveBeenCalledWith(
      '[blog] feed unavailable — keeping the last good page',
      'feed: HTTP 502',
    );
  });

  it('a synchronous throw from fetch is an outage like any other', async () => {
    fetchMock.mockImplementation(() => {
      throw new TypeError('fetch failed');
    });
    await expect(loadBlogFeed({ fetch: f(), env: OPS })).resolves.toMatchObject({
      source: 'LOCAL',
    });
  });
});

describe('fetchBlogPreview (the draft, never cached)', () => {
  const post = FIXTURE.posts[0];

  it('a valid token: the draft row in the asked language, fetched no-store from the token URL', async () => {
    fetchMock.mockResolvedValue(json({ post }));
    const result = await fetchBlogPreview(TOKEN, 'tr', { fetch: f(), env: OPS });
    expect(result.status).toBe('ok');
    expect(result.status === 'ok' && result.post.title.tr).toMatch(/Pakistan/);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`https://operations.example.com/api/website/v1/blog/preview/${TOKEN}`);
    expect(init.cache).toBe('no-store');
    expect(init.next).toBeUndefined();
  });

  it('works before BLOG_SOURCE is switched (needs only OPS_API_URL)', async () => {
    fetchMock.mockResolvedValue(json({ post }));
    const env = { ...OPS, BLOG_SOURCE: '' } as NodeJS.ProcessEnv;
    expect((await fetchBlogPreview(TOKEN, 'en', { fetch: f(), env })).status).toBe('ok');
  });

  it('410 (expired/invalid), 404, a malformed token → invalid; the last never leaves the site', async () => {
    fetchMock.mockResolvedValueOnce(json({}, 410)).mockResolvedValueOnce(json({}, 404));
    expect((await fetchBlogPreview(TOKEN, 'tr', { fetch: f(), env: OPS })).status).toBe('invalid');
    expect((await fetchBlogPreview(TOKEN, 'tr', { fetch: f(), env: OPS })).status).toBe('invalid');
    for (const bad of ['', 'short', 'has space in it xxxxxxxx', '../../etc/passwd/xxxxxxxx'])
      expect((await fetchBlogPreview(bad, 'tr', { fetch: f(), env: OPS })).status).toBe('invalid');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('no door, a 5xx, a network error or a broken body → unavailable', async () => {
    const noDoor = { NODE_ENV: 'test', OPS_API_URL: '' } as NodeJS.ProcessEnv;
    expect((await fetchBlogPreview(TOKEN, 'tr', { fetch: f(), env: noDoor })).status).toBe(
      'unavailable',
    );
    fetchMock
      .mockResolvedValueOnce(json({}, 500))
      .mockRejectedValueOnce(new Error('ETIMEDOUT'))
      .mockResolvedValueOnce(json({ post: { key: 'x' } }));
    for (let i = 0; i < 3; i++)
      expect((await fetchBlogPreview(TOKEN, 'tr', { fetch: f(), env: OPS })).status).toBe(
        'unavailable',
      );
  });

  it('a language with no text yet → empty', async () => {
    fetchMock.mockResolvedValue(json({ post: FIXTURE.posts[1] })); // TR only
    expect((await fetchBlogPreview(TOKEN, 'en', { fetch: f(), env: OPS })).status).toBe('empty');
  });
});
