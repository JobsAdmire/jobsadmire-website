import { afterEach, describe, expect, it, vi } from 'vitest';
import { ATTEMPT_TIMEOUT_MS } from '@/forms/post';
import { forwardNewsletterToken, type ForwardDeps } from './forward';

const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com/',
  OPS_WEBSITE_WRITE_TOKEN: 'wsw_' + 'a'.repeat(48),
} as NodeJS.ProcessEnv;
const TOKEN = 'cmfz1abc0000123456.QmFzZTY0dXJsX3NpZ25hdHVyZQ';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
// A fetch that never answers on its own — it rejects only when its signal aborts (a hung door).
const hang = (_url: string, init: RequestInit) =>
  new Promise<Response>((_, reject) => {
    init.signal!.addEventListener('abort', () => reject(init.signal!.reason));
  });

function setup() {
  const fetchMock = vi.fn<(url: string, init: RequestInit) => Promise<Response>>();
  const deps: ForwardDeps = { fetch: fetchMock as unknown as typeof fetch, env };
  return { fetchMock, deps };
}

afterEach(() => vi.restoreAllMocks());

describe('forwardNewsletterToken (I12, W74/W117)', () => {
  it('never calls the door for an implausible token', async () => {
    const { fetchMock, deps } = setup();
    expect(await forwardNewsletterToken('confirm', 'x', deps)).toEqual({ kind: 'invalid' });
    expect(await forwardNewsletterToken('confirm', null, deps)).toEqual({ kind: 'invalid' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('answers unconfigured without a call when this deployment has no door (W92)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { fetchMock } = setup();
    const res = await forwardNewsletterToken('unsubscribe', TOKEN, {
      fetch: fetchMock as unknown as typeof fetch,
      env: { NODE_ENV: 'test' } as NodeJS.ProcessEnv,
    });
    expect(res).toEqual({ kind: 'unconfigured' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('confirm: GET …/newsletter/confirm with the write token and the encoded token, uncached', async () => {
    const { fetchMock, deps } = setup();
    fetchMock.mockResolvedValue(json(200, { data: { outcome: 'CONFIRMED' } }));
    expect(await forwardNewsletterToken('confirm', TOKEN, deps)).toEqual({
      kind: 'ok',
      outcome: 'CONFIRMED',
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      `https://operations.example.com/api/website/v1/newsletter/confirm?token=${encodeURIComponent(TOKEN)}`,
    );
    expect(init.method).toBe('GET');
    expect((init.headers as Record<string, string>).Authorization).toBe(
      `Bearer ${env.OPS_WEBSITE_WRITE_TOKEN}`,
    );
    expect(init.cache).toBe('no-store');
    expect(init.body).toBeUndefined();
  });

  it('unsubscribe: a body-less POST — the RFC 8058 forward the door accepts', async () => {
    const { fetchMock, deps } = setup();
    fetchMock.mockResolvedValue(json(200, { data: { outcome: 'UNSUBSCRIBED' } }));
    expect(await forwardNewsletterToken('unsubscribe', TOKEN, deps)).toEqual({
      kind: 'ok',
      outcome: 'UNSUBSCRIBED',
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      `https://operations.example.com/api/website/v1/newsletter/unsubscribe?token=${encodeURIComponent(TOKEN)}`,
    );
    expect(init.method).toBe('POST');
    expect(init.body).toBeUndefined();
  });

  it('maps the door answers without retrying any of them', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const cases = [
      [json(400, { code: 'NEWSLETTER_TOKEN_INVALID' }), { kind: 'invalid' }],
      [json(410, { code: 'NEWSLETTER_TOKEN_EXPIRED' }), { kind: 'expired' }],
      [json(401, {}), { kind: 'unauthorized' }],
      [new Response(null, { status: 404 }), { kind: 'off' }],
      [new Response(null, { status: 503 }), { kind: 'unavailable', cause: 'server' }],
      [new Response('<html>', { status: 200 }), { kind: 'unavailable', cause: 'server' }],
    ] as const;
    for (const [response, expected] of cases) {
      const { fetchMock, deps } = setup();
      fetchMock.mockResolvedValue(response);
      expect(await forwardNewsletterToken('confirm', TOKEN, deps)).toEqual(expected);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
    // never the token in a log line
    expect(JSON.stringify(errors.mock.calls)).not.toContain(TOKEN);
  });

  it('retries ONCE after a connection-level failure (W74)', async () => {
    const { fetchMock, deps } = setup();
    fetchMock
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(json(200, { data: { outcome: 'ALREADY_CONFIRMED' } }));
    expect(await forwardNewsletterToken('confirm', TOKEN, deps)).toEqual({
      kind: 'ok',
      outcome: 'ALREADY_CONFIRMED',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('two connection failures → unavailable/network', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { fetchMock, deps } = setup();
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    expect(await forwardNewsletterToken('unsubscribe', TOKEN, deps)).toEqual({
      kind: 'unavailable',
      cause: 'network',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('a timeout is not retried, and both attempts share one deadline (W117)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { fetchMock, deps } = setup();
    fetchMock.mockImplementation(hang);
    expect(await forwardNewsletterToken('confirm', TOKEN, { ...deps, timeoutMs: 20 })).toEqual({
      kind: 'unavailable',
      cause: 'timeout',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const second = setup();
    second.fetchMock
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockImplementationOnce(hang);
    expect(
      await forwardNewsletterToken('confirm', TOKEN, { ...second.deps, timeoutMs: 20 }),
    ).toEqual({ kind: 'unavailable', cause: 'timeout' });
    const [first, retry] = second.fetchMock.mock.calls.map(([, init]) => init.signal);
    expect(retry).toBe(first);
  });

  it('uses the forms kernel deadline (W117: 9 s)', () => {
    expect(ATTEMPT_TIMEOUT_MS).toBe(9000);
  });
});
