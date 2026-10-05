import { describe, expect, it } from 'vitest';
import type { BlogPost } from '@/content/collections';
import { listedPosts, neighboursListed, relatedListed } from '../_lib/neighbours';

const post = (
  key: string,
  category: BlogPost['category'],
  publishedAt: string,
  enTitle: string | null = key,
): BlogPost => ({
  key,
  slug: { tr: null, en: enTitle ? key : null },
  title: { tr: null, en: enTitle },
  excerpt: { tr: null, en: 'x' },
  category,
  categoryLabelId: 'home.263',
  author: 'JA',
  publishedAt,
  readMinutes: 4,
  hasBody: { tr: false, en: false },
  body: { tr: null, en: null },
});

const rows = [
  post('a', 'workPermits', '2026-06-12'),
  post('b', 'recruitment', '2026-05-01'),
  post('c', 'workPermits', '2026-04-01'),
  post('d', 'workPermits', '2026-02-01'),
  post('e', 'marketNews', '2026-03-01'),
  post('f', 'compliance', '2026-01-01', null),
];

describe('listed related / previous-next (bodiless rows included)', () => {
  it('lists every row with a title in the locale, newest first', () => {
    expect(listedPosts(rows, 'en').map((p) => p.key)).toEqual(['a', 'b', 'c', 'e', 'd']);
    expect(listedPosts(rows, 'tr')).toEqual([]);
  });

  it('related: same category first, then the newest others, never the post itself', () => {
    const listed = listedPosts(rows, 'en');
    expect(relatedListed(listed, rows[0]).map((p) => p.key)).toEqual(['c', 'd', 'b']);
  });

  it('prev is the newer neighbour, next the older; the first post has no prev', () => {
    const listed = listedPosts(rows, 'en');
    expect(neighboursListed(listed, rows[0])).toEqual({ prev: null, next: rows[1] });
    expect(neighboursListed(listed, rows[2])).toMatchObject({
      prev: { key: 'b' },
      next: { key: 'e' },
    });
  });
});
