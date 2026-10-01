// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NewsletterForwardResult } from '@/lib/newsletter/types';
import { POST } from './route';

const { forward } = vi.hoisted(() => ({
  forward: vi.fn<(kind: string, token: unknown) => Promise<NewsletterForwardResult>>(),
}));
vi.mock('@/lib/newsletter/forward', () => ({ forwardNewsletterToken: forward }));

const TOKEN = 'cmfz1abc0000123456.QmFzZTY0dXJsX3NpZ25hdHVyZQ';
const url = (token = TOKEN) =>
  `https://www.jobsadmire.com/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
const oneClick = (token?: string) =>
  new Request(url(token), {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'List-Unsubscribe=One-Click',
  });

beforeEach(() => forward.mockReset());

describe('POST /api/newsletter/unsubscribe (RFC 8058, I12)', () => {
  it('forwards a one-click POST and answers the outcome, never cached', async () => {
    forward.mockResolvedValue({ kind: 'ok', outcome: 'UNSUBSCRIBED' });
    const res = await POST(oneClick());
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('private, no-store');
    expect(await res.json()).toEqual({ outcome: 'UNSUBSCRIBED' });
    expect(forward).toHaveBeenCalledWith('unsubscribe', TOKEN);
  });

  it('accepts the multipart/form-data encoding RFC 8058 prefers', async () => {
    forward.mockResolvedValue({ kind: 'ok', outcome: 'ALREADY_UNSUBSCRIBED' });
    const body = new FormData();
    body.set('List-Unsubscribe', 'One-Click');
    const res = await POST(new Request(url(), { method: 'POST', body }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ outcome: 'ALREADY_UNSUBSCRIBED' });
  });

  it('refuses an implausible token and a body that is not the one-click pair, before any forward', async () => {
    expect((await POST(oneClick('short'))).status).toBe(400);
    const notOneClick = [
      new Request(url(), {
        method: 'POST',
        body: 'foo=bar',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }),
      new Request(url(), {
        method: 'POST',
        body: '{"List-Unsubscribe":"One-Click"}',
        headers: { 'content-type': 'application/json' },
      }),
      new Request(url(), { method: 'POST' }),
    ];
    for (const request of notOneClick) {
      const res = await POST(request);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'not-one-click' });
    }
    expect(forward).not.toHaveBeenCalled();
  });

  it('refuses a declared body over 4 KB before reading it (T13 review M4)', async () => {
    const big = new Request(url(), {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': String(4096 + 1),
      },
      body: 'List-Unsubscribe=One-Click',
    });
    const res = await POST(big);
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: 'too-large' });
    expect(forward).not.toHaveBeenCalled();
  });

  it('maps the forward results to the one-click answers', async () => {
    const cases: [NewsletterForwardResult, number, string][] = [
      [{ kind: 'invalid' }, 400, 'invalid'],
      [{ kind: 'expired' }, 400, 'invalid'],
      [{ kind: 'unconfigured' }, 503, 'unconfigured'],
      [{ kind: 'off' }, 503, 'off'],
      [{ kind: 'unauthorized' }, 503, 'unauthorized'],
      [{ kind: 'unavailable', cause: 'timeout' }, 502, 'unavailable'],
    ];
    for (const [result, status, error] of cases) {
      forward.mockResolvedValueOnce(result);
      const res = await POST(oneClick());
      expect(res.status, error).toBe(status);
      expect(res.headers.get('cache-control')).toBe('private, no-store');
      expect(await res.json()).toEqual({ error });
    }
  });
});
