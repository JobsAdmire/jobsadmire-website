import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import { formBeaconCount, resetFormBeacons } from './state';

const post = (body: string) =>
  POST(new Request('http://localhost/api/form-beacon', { method: 'POST', body }));

beforeEach(() => {
  resetFormBeacons();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('POST /api/form-beacon', () => {
  it('counts a valid beacon, logs it, answers 204 no-store', async () => {
    const res = await post(
      JSON.stringify({ formKey: 'hire', kind: 'unavailable', page: '/isci-talebi' }),
    );
    expect(res.status).toBe(204);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(formBeaconCount()).toBe(1);
    expect(console.error).toHaveBeenCalledWith('[form-beacon]', {
      formKey: 'hire',
      kind: 'unavailable',
      page: '/isci-talebi',
    });
  });

  it('rejects a malformed body with 400 and counts nothing', async () => {
    expect((await post('not json')).status).toBe(400);
    expect((await post(JSON.stringify({ formKey: 'nope', kind: 'x', page: '/' }))).status).toBe(
      400,
    );
    expect(
      (await post(JSON.stringify({ formKey: 'hire', kind: 'x'.repeat(40), page: '/' }))).status,
    ).toBe(400);
    expect(
      (await post(JSON.stringify({ formKey: 'hire', kind: 'off', page: '/', name: 'Ali' }))).status,
    ).toBe(400);
    expect(formBeaconCount()).toBe(0);
  });

  // M11/§8 I: a valid beacon body (page capped at 300 chars, formKey/kind short enums by a
  // `.strict()` schema) can never come close to 4096 bytes for real, so these cases test the
  // MAX_BEACON_BYTES check's own boundary directly, on the declared header — the point of a
  // pre-body-read guard is that it acts on the header alone, before anything about the body
  // (real or fabricated) is inspected.
  const validBody = JSON.stringify({ formKey: 'hire', kind: 'unavailable', page: '/isci-talebi' });
  const withDeclaredLength = (n: number) =>
    new Request('http://localhost/api/form-beacon', {
      method: 'POST',
      headers: { 'content-length': String(n) },
      body: validBody,
    });

  it('rejects a declared length over 4096 bytes with 413, before ever reading the body (M11)', async () => {
    const res = await POST(withDeclaredLength(4097));
    expect(res.status).toBe(413);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(console.error).not.toHaveBeenCalled();
    expect(formBeaconCount()).toBe(0);
  });

  it('accepts a declared length right at the 4096-byte cap', async () => {
    expect((await POST(withDeclaredLength(4096))).status).toBe(204);
  });

  it('falls through to normal parsing when content-length is absent or not a number', async () => {
    expect((await post(validBody)).status).toBe(204); // beacon.test.ts's own helper sends none
    const res = await POST(
      new Request('http://localhost/api/form-beacon', {
        method: 'POST',
        headers: { 'content-length': 'not-a-number' },
        body: validBody,
      }),
    );
    expect(res.status).toBe(204);
  });

  // W158 (final re-review N7): a chunked request carries no Content-Length, so the declared-length
  // check above never sees it — the route counts bytes as it reads and gives up at the 4,097th.
  // `streamed` builds such a request over a pull-based stream (nothing buffered ahead of the
  // reader) and reports how many chunks the route actually pulled and whether it cancelled.
  const encode = (text: string) => new TextEncoder().encode(text);
  function streamed(chunks: Uint8Array[]) {
    let pulled = 0;
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>(
      {
        pull(controller) {
          const chunk = chunks[pulled];
          if (chunk === undefined) return controller.close();
          pulled += 1;
          controller.enqueue(chunk);
        },
        cancel() {
          cancelled = true;
        },
      },
      { highWaterMark: 0 },
    );
    const request = new Request('http://localhost/api/form-beacon', {
      method: 'POST',
      body,
      duplex: 'half',
    } as RequestInit);
    expect(request.headers.get('content-length')).toBeNull();
    return { request, pulled: () => pulled, cancelled: () => cancelled };
  }
  const padded = (bytes: number) =>
    encode(validBody + ' '.repeat(bytes - encode(validBody).length));

  it('refuses a streamed body over 4096 bytes with 413 — no Content-Length to trust (W158)', async () => {
    const { request } = streamed(Array.from({ length: 5 }, () => encode('x'.repeat(1024))));
    const res = await POST(request);
    expect(res.status).toBe(413);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(console.error).not.toHaveBeenCalled();
    expect(formBeaconCount()).toBe(0);
  });

  it('stops reading at the chunk that crosses the cap and cancels the stream', async () => {
    const { request, pulled, cancelled } = streamed(
      Array.from({ length: 100 }, () => encode('x'.repeat(1024))),
    );
    expect((await POST(request)).status).toBe(413);
    expect(pulled()).toBe(5); // 4 × 1024 = 4096 is allowed; the 5th chunk crosses it
    expect(cancelled()).toBe(true);
  });

  it('reads a streamed body of exactly 4096 bytes and refuses 4097', async () => {
    const at = padded(4096);
    expect(at.byteLength).toBe(4096);
    expect(
      (await POST(streamed([at.slice(0, 1000), at.slice(1000, 3000), at.slice(3000)]).request))
        .status,
    ).toBe(204);
    const over = padded(4097);
    expect((await POST(streamed([over.slice(0, 2000), over.slice(2000)]).request)).status).toBe(
      413,
    );
  });

  it('decodes a multi-byte character split across two chunks', async () => {
    const bytes = encode(JSON.stringify({ formKey: 'hire', kind: 'off', page: '/işçi-talebi' }));
    const split = bytes.indexOf(0xc5) + 1; // between the two bytes of "ş" (C5 9F)
    expect((await POST(streamed([bytes.slice(0, split), bytes.slice(split)]).request)).status).toBe(
      204,
    );
    expect(console.error).toHaveBeenCalledWith('[form-beacon]', {
      formKey: 'hire',
      kind: 'off',
      page: '/işçi-talebi',
    });
  });

  it('accepts only the seven FormFallbackKind values as `kind`', async () => {
    expect((await post(JSON.stringify({ formKey: 'hire', kind: 'bogus', page: '/' }))).status).toBe(
      400,
    );
    expect(formBeaconCount()).toBe(0);
    const kinds = ['invalid', 'captcha', 'off', 'tripped', 'unauthorized', 'unavailable', 'failed'];
    for (const kind of kinds)
      expect((await post(JSON.stringify({ formKey: 'hire', kind, page: '/' }))).status, kind).toBe(
        204,
      );
    expect(formBeaconCount()).toBe(kinds.length);
  });
});
