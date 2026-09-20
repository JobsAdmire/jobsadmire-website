import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '../consent';
import { doorBase, doorConfig } from '../env';
import { postForm, type PostFormDeps } from '../post';
import type { WireEnvelope } from '../wire';

const envelope: WireEnvelope = {
  locale: 'tr',
  consentVersion: CONSENT_VERSION,
  fields: { name: 'Ali Veli', email: 'ali@example.com' },
};
const visitor = { ip: '203.0.113.9', ua: 'Mozilla/5.0 test' };
const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com/',
  OPS_WEBSITE_WRITE_TOKEN: 'wsw_' + 'a'.repeat(48),
} as NodeJS.ProcessEnv;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
const okBody = (over: Partial<Record<string, unknown>> = {}) => ({
  data: {
    id: 'sub_1',
    formKey: 'hire',
    status: 'RECEIVED',
    isTest: false,
    replayed: false,
    captchaDegraded: false,
    error: null,
    ...over,
  },
});

let fetchMock: ReturnType<typeof vi.fn>;
let deps: PostFormDeps;

beforeEach(() => {
  fetchMock = vi.fn();
  deps = { fetch: fetchMock as unknown as typeof fetch, env };
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('doorConfig', () => {
  it('strips the trailing slash and treats a short or missing token as unset (Ops rule: 20 chars)', () => {
    expect(doorBase(env)).toBe('https://operations.example.com');
    expect(doorConfig(env)).toEqual({
      base: 'https://operations.example.com',
      token: env.OPS_WEBSITE_WRITE_TOKEN,
    });
    expect(doorConfig({ NODE_ENV: 'test' } as NodeJS.ProcessEnv)).toBeNull();
    expect(
      doorConfig({ ...env, OPS_WEBSITE_WRITE_TOKEN: 'short' } as NodeJS.ProcessEnv),
    ).toBeNull();
    expect(doorConfig({ ...env, OPS_API_URL: '' } as NodeJS.ProcessEnv)).toBeNull();
  });
});

describe('postForm — request shape', () => {
  it('posts the envelope to the door with the write token and the visitor headers', async () => {
    fetchMock.mockResolvedValueOnce(json(200, okBody()));
    const res = await postForm('hire', envelope, visitor, deps);
    expect(res).toEqual({
      kind: 'ok',
      id: 'sub_1',
      status: 'RECEIVED',
      isTest: false,
      replayed: false,
      captchaDegraded: false,
      error: null,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://operations.example.com/api/website/v1/forms/hire');
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(init.headers).toEqual({
      Authorization: `Bearer ${env.OPS_WEBSITE_WRITE_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Website-Visitor-Ip': '203.0.113.9',
      'X-Website-Visitor-Ua': 'Mozilla/5.0 test',
    });
    expect(JSON.parse(init.body as string)).toEqual(envelope);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('omits the visitor headers it does not have and truncates the UA to 500', async () => {
    fetchMock.mockResolvedValueOnce(json(200, okBody()));
    await postForm('hire', envelope, { ip: null, ua: 'u'.repeat(600) }, deps);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers['X-Website-Visitor-Ip']).toBeUndefined();
    expect(headers['X-Website-Visitor-Ua']).toHaveLength(500);
  });

  it('returns unauthorized without a network call when the URL or token is not configured', async () => {
    expect(
      await postForm('hire', envelope, visitor, {
        ...deps,
        env: { NODE_ENV: 'test' } as NodeJS.ProcessEnv,
      }),
    ).toEqual({ kind: 'unauthorized' });
    expect(
      await postForm('hire', envelope, visitor, {
        ...deps,
        env: { ...env, OPS_WEBSITE_WRITE_TOKEN: 'short' } as NodeJS.ProcessEnv,
      }),
    ).toEqual({ kind: 'unauthorized' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('postForm — status mapping', () => {
  it('200 with status FAILED is still kind ok (the row is durable) and carries the visitor error', async () => {
    fetchMock.mockResolvedValueOnce(
      json(200, okBody({ status: 'FAILED', error: 'This opening is closed.' })),
    );
    expect(await postForm('careers', envelope, visitor, deps)).toMatchObject({
      kind: 'ok',
      status: 'FAILED',
      error: 'This opening is closed.',
    });
  });

  it('200 SPAM and replayed both count as ok', async () => {
    fetchMock.mockResolvedValueOnce(json(200, okBody({ status: 'SPAM', replayed: true })));
    expect(await postForm('hire', envelope, visitor, deps)).toMatchObject({
      kind: 'ok',
      status: 'SPAM',
      replayed: true,
    });
  });

  it('400 → invalid with the door message, no retry', async () => {
    fetchMock.mockResolvedValueOnce(
      json(400, { message: 'Invalid form fields', errors: ['email must be an email'] }),
    );
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'invalid',
      message: 'Invalid form fields',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('401 → unauthorized, no retry', async () => {
    fetchMock.mockResolvedValueOnce(json(401, { message: 'Invalid website token.' }));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({ kind: 'unauthorized' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('403 → captcha, no retry', async () => {
    fetchMock.mockResolvedValueOnce(
      json(403, { message: 'Captcha verification failed. Please retry.' }),
    );
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({ kind: 'captcha' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('404 (module off / form inactive / unknown key) → off, no retry', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    expect(await postForm('newsletter', envelope, visitor, deps)).toEqual({ kind: 'off' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('429 → tripped, no retry', async () => {
    fetchMock.mockResolvedValueOnce(
      json(429, {
        statusCode: 429,
        message: 'This form is paused for a short while.',
        reason: 'tripped',
        fallback: 'whatsapp',
      }),
    );
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({ kind: 'tripped' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('a 200 that is not the door JSON (login wall, proxy page) is an outage, not a success (R28)', async () => {
    fetchMock.mockImplementation(() => new Response('<html>login</html>', { status: 200 }));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('postForm — W3 retry rule', () => {
  it('retries once after a 5xx and returns the second answer (a replayed row is a success)', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('Bad Gateway', { status: 502 }))
      .mockResolvedValueOnce(json(200, okBody({ replayed: true })));
    expect(await postForm('hire', envelope, visitor, deps)).toMatchObject({
      kind: 'ok',
      replayed: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('two network failures → unavailable/network, exactly two attempts', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'network',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('a 5xx then a network failure → unavailable/network', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockRejectedValueOnce(new TypeError('fetch failed'));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'network',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('each attempt is bounded by its own timeout; two timeouts → unavailable/timeout inside the budget', async () => {
    // A fetch that never answers on its own — it only rejects when its signal aborts, which is
    // what a hung Operations looks like from the caller's side.
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_, reject) => {
          init.signal!.addEventListener('abort', () => reject(init.signal!.reason));
        }),
    );
    const started = Date.now();
    const res = await postForm('hire', envelope, visitor, { ...deps, timeoutMs: 20 });
    expect(res).toEqual({ kind: 'unavailable', cause: 'timeout' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(Date.now() - started).toBeLessThan(2000);
  });
});
