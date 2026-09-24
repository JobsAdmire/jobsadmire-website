import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '../consent';
import { doorBase, doorConfig } from '../env';
import { ATTEMPT_TIMEOUT_MS, MAX_ATTEMPTS, postForm, type PostFormDeps } from '../post';
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

  it('a 200 that is not the door JSON (login wall, proxy page) is an outage, not a success (R28) — and not retried', async () => {
    fetchMock.mockImplementation(() => new Response('<html>login</html>', { status: 200 }));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('postForm — W74 retry rule (amends W3)', () => {
  // A Turnstile token is single-use and Ops waits up to 6 s for siteverify: a request that
  // REACHED the door may have spent its token, so re-sending it earns a 403, not `replayed`.
  // Only a failure before any answer (DNS, refused, reset) is retried, once.
  it('pins a 9 s budget and at most two attempts', () => {
    expect(ATTEMPT_TIMEOUT_MS).toBe(9000);
    expect(MAX_ATTEMPTS).toBe(2);
  });

  it('a 5xx is NOT retried — the request reached the door — and answers unavailable/server', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('Bad Gateway', { status: 502 }))
      .mockResolvedValueOnce(json(200, okBody({ replayed: true })));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('a connection-level failure (fetch rejected, no response) is retried once and the second answer wins', async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError('fetch failed', { cause: { code: 'ECONNREFUSED' } }))
      .mockResolvedValueOnce(json(200, okBody()));
    expect(await postForm('hire', envelope, visitor, deps)).toMatchObject({ kind: 'ok' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('two connection failures → unavailable/network, exactly two attempts', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'network',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('a connection failure then a 5xx → unavailable/server', async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(new Response(null, { status: 503 }));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  // A fetch that never answers on its own — it only rejects when its signal aborts, which is
  // what a hung Operations looks like from the caller's side.
  const hang = (_url: string, init: RequestInit) =>
    new Promise<Response>((_, reject) => {
      init.signal!.addEventListener('abort', () => reject(init.signal!.reason));
    });

  it('a timeout is NOT retried → unavailable/timeout after one attempt', async () => {
    fetchMock.mockImplementation(hang);
    const started = Date.now();
    const res = await postForm('hire', envelope, visitor, { ...deps, timeoutMs: 20 });
    expect(res).toEqual({ kind: 'unavailable', cause: 'timeout' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(Date.now() - started).toBeLessThan(2000);
  });

  it('the retry runs under the SAME deadline as the first attempt, so the worst case stays ≈ one budget', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed')).mockImplementationOnce(hang);
    const res = await postForm('hire', envelope, visitor, { ...deps, timeoutMs: 20 });
    expect(res).toEqual({ kind: 'unavailable', cause: 'timeout' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [first, second] = fetchMock.mock.calls.map(([, init]) => (init as RequestInit).signal);
    expect(second).toBe(first);
  });
});
