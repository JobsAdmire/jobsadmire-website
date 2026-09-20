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
});
