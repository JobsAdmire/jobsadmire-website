import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { opsPingCheck, pingOps, type OpsPing } from './ops';

const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com',
  OPS_WEBSITE_WRITE_TOKEN: 'wsw_' + 'a'.repeat(48),
} as NodeJS.ProcessEnv;
let fetchMock: ReturnType<typeof vi.fn>;
const f = () => fetchMock as unknown as typeof fetch;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('pingOps', () => {
  it('is unconfigured without a URL/token and makes no call', async () => {
    expect(await pingOps({ NODE_ENV: 'test' } as NodeJS.ProcessEnv, f())).toEqual({
      state: 'unconfigured',
      latencyMs: null,
      captcha: null,
      trippedForms: [],
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('GETs the ping with the write token and reports ok + latency + the door facts on 200', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            tokenClass: 'write',
            moduleEnabled: true,
            captcha: 'missing',
            trippedForms: ['hire'],
          },
        }),
        { status: 200 },
      ),
    );
    const out = await pingOps(env, f());
    expect(out.state).toBe('ok');
    expect(typeof out.latencyMs).toBe('number');
    expect(out.captcha).toBe('missing');
    expect(out.trippedForms).toEqual(['hire']);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://operations.example.com/api/website/v1/ping');
    expect((init.headers as Record<string, string>).Authorization).toBe(
      `Bearer ${env.OPS_WEBSITE_WRITE_TOKEN}`,
    );
    expect(init.cache).toBe('no-store');
  });

  it('a 200 that is not the ping JSON (a login wall) is unreachable, not ok (R28)', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<html>login</html>', { status: 200 }));
    expect(await pingOps(env, f())).toMatchObject({
      state: 'unreachable',
      captcha: null,
      trippedForms: [],
    });
  });

  it('reads (and discards) the body of a non-200 answer, so the connection is released', async () => {
    for (const status of [404, 401, 502]) {
      const res = new Response('x'.repeat(200_000), { status });
      fetchMock.mockResolvedValueOnce(res);
      await pingOps(env, f());
      expect(res.bodyUsed, String(status)).toBe(true);
    }
  });

  it('maps 404 → off, 401 → unauthorized, 5xx/network → unreachable', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    expect((await pingOps(env, f())).state).toBe('off');
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));
    expect((await pingOps(env, f())).state).toBe('unauthorized');
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 502 }));
    expect((await pingOps(env, f())).state).toBe('unreachable');
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    expect(await pingOps(env, f())).toEqual({
      state: 'unreachable',
      latencyMs: null,
      captcha: null,
      trippedForms: [],
    });
  });
});

describe('opsPingCheck', () => {
  it('W75 — the door is live: ok → ok; off/unauthorized/unreachable → fail; unconfigured → skip', () => {
    // Typed, not `as const`: a readonly `[]` is not assignable to `OpsPing['trippedForms']`.
    const facts: Pick<OpsPing, 'captcha' | 'trippedForms'> = { captcha: null, trippedForms: [] };
    expect(opsPingCheck({ state: 'ok', latencyMs: 12, ...facts })).toBe('ok');
    expect(opsPingCheck({ state: 'off', latencyMs: 9, ...facts })).toBe('fail');
    expect(opsPingCheck({ state: 'unauthorized', latencyMs: 12, ...facts })).toBe('fail');
    expect(opsPingCheck({ state: 'unreachable', latencyMs: null, ...facts })).toBe('fail');
    expect(opsPingCheck({ state: 'unconfigured', latencyMs: null, ...facts })).toBe('skip');
  });
});
