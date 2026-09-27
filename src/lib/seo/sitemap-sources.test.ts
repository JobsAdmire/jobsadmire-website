import { describe, expect, it } from 'vitest';
import {
  DETAIL_SITEMAP_SOURCES,
  detailSitemapEntries,
  type SitemapSource,
} from './sitemap-sources';

describe('DETAIL_SITEMAP_SOURCES (W31)', () => {
  it('is empty and frozen in the foundation — the careers page task edits the literal to add the first source (W70)', () => {
    expect(DETAIL_SITEMAP_SOURCES).toEqual([]);
    expect(Object.isFrozen(DETAIL_SITEMAP_SOURCES)).toBe(true);
  });

  it('concatenates every source for the locale, in registration order', async () => {
    const calls: string[] = [];
    const a: SitemapSource = async (locale) => {
      calls.push(`a:${locale}`);
      return [{ url: `https://www.jobsadmire.com/${locale}/a` }];
    };
    const b: SitemapSource = async (locale) => {
      calls.push(`b:${locale}`);
      return [
        { url: `https://www.jobsadmire.com/${locale}/b1` },
        { url: `https://www.jobsadmire.com/${locale}/b2` },
      ];
    };
    const entries = await detailSitemapEntries('en', [a, b]);
    expect(entries.map((e) => e.url)).toEqual([
      'https://www.jobsadmire.com/en/a',
      'https://www.jobsadmire.com/en/b1',
      'https://www.jobsadmire.com/en/b2',
    ]);
    expect(calls).toEqual(['a:en', 'b:en']);
    expect(await detailSitemapEntries('tr', [])).toEqual([]);
  });
});
