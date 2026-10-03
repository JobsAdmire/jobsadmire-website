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

  // Final pass P2-4 (W158 for this route): a chunked request declares no Content-Length, so the
  // declared-length check above never sees it — the body is read through the shared `readCapped`
  // byte counter and refused at the 4,097th byte, exactly as /api/form-beacon does.
  const encode = (text: string) => new TextEncoder().encode(text);
  function streamed(chunks: Uint8Array[]) {
    let pulled = 0;
    const body = new ReadableStream<Uint8Array>(
      {
        pull(controller) {
          const chunk = chunks[pulled];
          if (chunk === undefined) return controller.close();
          pulled += 1;
          controller.enqueue(chunk);
        },
      },
      { highWaterMark: 0 },
    );
    const request = new Request(url(), {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      duplex: 'half',
    } as RequestInit);
    expect(request.headers.get('content-length')).toBeNull();
    return request;
  }
  const oneClickPadded = (bytes: number) => {
    const head = 'List-Unsubscribe=One-Click&pad=';
    return encode(head + 'x'.repeat(bytes - head.length));
  };

  it('refuses a streamed body over 4 KB with 413 — no Content-Length to trust (W158), before any forward', async () => {
    const over = oneClickPadded(4096 + 1);
    expect(over.byteLength).toBe(4097);
    const res = await POST(streamed([over.slice(0, 2000), over.slice(2000)]));
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: 'too-large' });
    expect(forward).not.toHaveBeenCalled();
  });

  it('reads a streamed one-click body of exactly 4 KB and forwards it', async () => {
    forward.mockResolvedValue({ kind: 'ok', outcome: 'UNSUBSCRIBED' });
    const at = oneClickPadded(4096);
    expect(at.byteLength).toBe(4096);
    const res = await POST(streamed([at.slice(0, 1000), at.slice(1000, 3000), at.slice(3000)]));
    expect(res.status).toBe(200);
    expect(forward).toHaveBeenCalledWith('unsubscribe', TOKEN);
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
