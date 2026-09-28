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
