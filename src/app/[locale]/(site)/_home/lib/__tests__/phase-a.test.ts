import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { homeBundle } from '../../__tests__/fixtures';
import { publishedFounder } from '../phase-a';

describe('publishedFounder (W86)', () => {
  it('the committed founder row is published (owner 2026-10-05): Haris Jiva with his photo', () => {
    expect(publishedFounder(homeBundle('tr'))).toMatchObject({
      name: 'Haris Jiva',
      photoSrc: '/team/haris-jiva.jpg',
      published: true,
    });
  });

  it('no founder row, or an unpublished one, reads as none', () => {
    expect(publishedFounder(testBundle())).toBeNull();
    const row = { name: 'Ad Soyad', titleId: 'about.047', photoSrc: null, published: false };
    expect(publishedFounder(testBundle({ collections: { founder: [row] } }))).toBeNull();
  });

  it('a published founder row is returned whole', () => {
    const row = { name: 'Ad Soyad', titleId: 'about.047', photoSrc: null, published: true };
    expect(publishedFounder(testBundle({ collections: { founder: [row] } }))).toEqual(row);
  });
});
