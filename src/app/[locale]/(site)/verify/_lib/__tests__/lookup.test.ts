import { describe, expect, it } from 'vitest';
import {
  DEEP_LINK_MAX,
  LOOKUP_MIN_CHARS,
  normaliseQuery,
  readDeepLinkId,
  splitAtQuery,
} from '../lookup';

describe('normaliseQuery', () => {
  it('trims and collapses whitespace, keeps case (ids are shown as typed)', () => {
    expect(normaliseQuery('  JA-REP-014 ')).toBe('JA-REP-014');
    expect(normaliseQuery('Ayşe   Yılmaz')).toBe('Ayşe Yılmaz');
    expect(normaliseQuery('')).toBe('');
  });

  it('a result needs three characters (the design’s `> 2`)', () => {
    expect(LOOKUP_MIN_CHARS).toBe(3);
  });
});

describe('readDeepLinkId (V-1: ?id= on this route; ?rep= and #id= are the design’s aliases)', () => {
  it('reads ?id=', () => {
    expect(readDeepLinkId('?id=JA-REP-001', '')).toBe('JA-REP-001');
  });

  it('reads ?rep= and #id=', () => {
    expect(readDeepLinkId('?rep=JA-REP-002', '')).toBe('JA-REP-002');
    expect(readDeepLinkId('', '#id=JA-REP-003')).toBe('JA-REP-003');
  });

  it('prefers ?id=, decodes, trims, caps the length and refuses an empty value', () => {
    expect(readDeepLinkId('?rep=B&id=A', '')).toBe('A');
    expect(readDeepLinkId('?id=JA%2DREP%2D004%20', '')).toBe('JA-REP-004');
    expect(readDeepLinkId('?id=', '#id=')).toBeNull();
    expect(readDeepLinkId(`?id=${'x'.repeat(200)}`, '')).toHaveLength(DEEP_LINK_MAX);
    expect(readDeepLinkId('', '')).toBeNull();
  });

  it('never throws on a malformed escape in the hash', () => {
    expect(readDeepLinkId('', '#id=%E0%A4%A')).toBe('%E0%A4%A');
  });
});

describe('splitAtQuery', () => {
  it('splits the raw result template around its one {query}', () => {
    expect(splitAtQuery('“{query}” cannot be checked.')).toEqual({
      before: '“',
      after: '” cannot be checked.',
      hasQuery: true,
    });
  });

  it('a template without the token echoes nothing (never prints the token)', () => {
    expect(splitAtQuery('No token here.')).toEqual({
      before: 'No token here.',
      after: '',
      hasQuery: false,
    });
  });
});
