import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { blogPost } from '../../__tests__/fixtures';
import { GUIDES_MAX, guidesTeaser } from '../guides';

describe('guidesTeaser (W248: written articles only, featured first, then newest, per locale)', () => {
  const bundle = testBundle({
    collections: {
      blog: [
        blogPost('old', '2026-01-10', { tr: false, en: true }),
        blogPost('new', '2026-03-01', { tr: false, en: true }),
        blogPost('tr-only', '2026-02-01', { tr: true, en: false }),
        blogPost('unwritten', '2026-04-01', { tr: false, en: false }),
      ],
    },
  });

  it('EN: the two written EN articles, newest first — never an unwritten row', () => {
    expect(guidesTeaser(bundle, 'en').map((p) => p.key)).toEqual(['new', 'old']);
  });

  it('TR: only the article with a Turkish body', () => {
    expect(guidesTeaser(bundle, 'tr').map((p) => p.key)).toEqual(['tr-only']);
  });

  it('a post flagged featured leads; the list is capped at the design five', () => {
    const many = testBundle({
      collections: {
        blog: [
          ...Array.from({ length: 7 }, (_, i) =>
            blogPost(`p${i}`, `2026-0${i + 1}-01`, { tr: false, en: true }),
          ),
          { ...blogPost('flag', '2025-12-01', { tr: false, en: true }), featured: true },
        ],
      },
    });
    const keys = guidesTeaser(many, 'en').map((p) => p.key);
    expect(keys).toHaveLength(GUIDES_MAX);
    expect(keys).toEqual(['flag', 'p6', 'p5', 'p4', 'p3']);
  });

  it('no blog collection → no posts (the section is left out)', () => {
    expect(guidesTeaser(testBundle(), 'en')).toEqual([]);
  });
});
