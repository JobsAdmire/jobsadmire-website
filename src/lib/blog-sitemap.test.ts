import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { feedToRows } from '@/content/blog-feed';
import { blogSitemapEntries, blogSitemapSource } from './blog-sitemap';

const ORIGIN = 'https://www.jobsadmire.com';
const { rows } = feedToRows(
  JSON.parse(readFileSync(join(process.cwd(), 'contract/blog-feed.v1.fixture.json'), 'utf8')),
  vi.fn(),
);

describe('blog sitemap entries (W248, the SEO flip)', () => {
  it('lists every written article of the locale with its last edit as lastmod', () => {
    const en = blogSitemapEntries(rows, 'en');
    expect(en.map((e) => e.url)).toEqual([
      `${ORIGIN}/en/blog/hiring-from-pakistan-employer-guide`,
      `${ORIGIN}/en/blog/turkey-work-permit-process-employer-guide`,
    ]);
    expect(en[0].lastModified).toBe('2026-10-06T07:30:00.000Z');
    expect(blogSitemapEntries(rows, 'tr').map((e) => e.url)).toEqual([
      `${ORIGIN}/blog/pakistandan-isci-istihdami-rehberi`,
      `${ORIGIN}/blog/sgk-bildirimi-yabanci-isciler`,
    ]);
  });

  it('hreflang only for the languages a post is written in; x-default = TR when written, else its own', () => {
    const [bilingual, editorial] = blogSitemapEntries(rows, 'en');
    expect(bilingual.alternates?.languages).toEqual({
      tr: `${ORIGIN}/blog/pakistandan-isci-istihdami-rehberi`,
      en: `${ORIGIN}/en/blog/hiring-from-pakistan-employer-guide`,
      'x-default': `${ORIGIN}/blog/pakistandan-isci-istihdami-rehberi`,
    });
    expect(editorial.alternates?.languages).toEqual({
      en: `${ORIGIN}/en/blog/turkey-work-permit-process-employer-guide`,
      'x-default': `${ORIGIN}/en/blog/turkey-work-permit-process-employer-guide`,
    });
  });

  it('a LOCAL row (no updatedAt) uses its publish date; the source reads the LOCAL bundle by default', async () => {
    const en = await blogSitemapSource('en');
    expect(en).toEqual([
      expect.objectContaining({
        url: `${ORIGIN}/en/blog/turkey-work-permit-process-employer-guide`,
        lastModified: '2026-06-12',
      }),
    ]);
    expect(await blogSitemapSource('tr')).toEqual([]);
  });
});
