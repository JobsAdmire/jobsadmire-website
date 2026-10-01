import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { homeBundle } from '../../__tests__/fixtures';
import { hasRows, publishedFounder, rawRows } from '../phase-a';

describe('phase-a switches (W6/D23/W86: rendered by data, never deleted)', () => {
  it('an absent collection reads as empty', () => {
    const bundle = testBundle();
    expect(rawRows(bundle, 'stories')).toEqual([]);
    expect(hasRows(bundle, 'pool')).toBe(false);
    expect(hasRows(bundle, 'representatives')).toBe(false);
  });

  it('a populated collection flips the switch', () => {
    expect(hasRows(testBundle({ collections: { stories: [{ title: 'x' }] } }), 'stories')).toBe(
      true,
    );
  });

  it('W86: the committed founder row is unpublished, so no founder card renders', () => {
    expect(publishedFounder(homeBundle('tr'))).toBeNull();
    expect(publishedFounder(testBundle())).toBeNull();
  });

  it('W86: a published founder row is returned whole', () => {
    const row = { name: 'Ad Soyad', titleId: 'about.047', photoSrc: null, published: true };
    expect(publishedFounder(testBundle({ collections: { founder: [row] } }))).toEqual(row);
  });
});
