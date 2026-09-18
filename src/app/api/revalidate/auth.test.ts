import { describe, expect, it } from 'vitest';
import { authorize, parseTags } from './auth';

const SECRET = 'wp1-local-secret-0123456789';

describe('authorize', () => {
  it('is disabled when no usable secret is configured — never open (D6)', () => {
    expect(authorize(`Bearer ${SECRET}`, undefined)).toBe('disabled');
    expect(authorize(`Bearer ${SECRET}`, '')).toBe('disabled');
    expect(authorize('Bearer shortsecret123', 'shortsecret123')).toBe('disabled'); // 14 < 16
  });

  it('rejects a missing, malformed or wrong token', () => {
    expect(authorize(null, SECRET)).toBe('unauthorized');
    expect(authorize('', SECRET)).toBe('unauthorized');
    expect(authorize('Bearer ', SECRET)).toBe('unauthorized');
    expect(authorize(SECRET, SECRET)).toBe('unauthorized'); // no scheme
    expect(authorize(`Basic ${SECRET}`, SECRET)).toBe('unauthorized'); // wrong scheme
    expect(authorize(`Bearer ${'x'.repeat(SECRET.length)}`, SECRET)).toBe('unauthorized'); // same length
    expect(authorize(`Bearer ${SECRET}x`, SECRET)).toBe('unauthorized'); // longer
    expect(authorize(`Bearer ${SECRET.slice(0, -1)}`, SECRET)).toBe('unauthorized'); // shorter
  });

  it('accepts the exact token, scheme case-insensitively', () => {
    expect(authorize(`Bearer ${SECRET}`, SECRET)).toBe('ok');
    expect(authorize(`bearer ${SECRET}`, SECRET)).toBe('ok');
  });
});

describe('parseTags', () => {
  it('accepts 1–50 tags matching the tag grammar', () => {
    expect(parseTags({ tags: ['site:tr', 'page:hire-workers', 'blog', 'a_b-c9'] })).toEqual([
      'site:tr',
      'page:hire-workers',
      'blog',
      'a_b-c9',
    ]);
    expect(parseTags({ tags: Array.from({ length: 50 }, (_, i) => `t${i}`) })).toHaveLength(50);
  });

  it('returns null for anything else — one bad tag fails the whole call', () => {
    expect(parseTags(null)).toBeNull();
    expect(parseTags(undefined)).toBeNull();
    expect(parseTags('site:tr')).toBeNull();
    expect(parseTags(['site:tr'])).toBeNull();
    expect(parseTags({})).toBeNull();
    expect(parseTags({ tags: 'site:tr' })).toBeNull();
    expect(parseTags({ tags: [] })).toBeNull();
    expect(parseTags({ tags: Array.from({ length: 51 }, (_, i) => `t${i}`) })).toBeNull();
    expect(parseTags({ tags: ['site:tr', 'bad tag!'] })).toBeNull();
    expect(parseTags({ tags: ['SITE:TR'] })).toBeNull();
    expect(parseTags({ tags: ['site/tr'] })).toBeNull();
    expect(parseTags({ tags: [''] })).toBeNull();
    expect(parseTags({ tags: ['site:tr', 42] })).toBeNull();
  });
});
