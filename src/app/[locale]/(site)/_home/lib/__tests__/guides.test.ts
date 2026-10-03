import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { blogPost } from '../../__tests__/fixtures';
import { guidesPosts } from '../guides';

describe('guidesPosts (W4/W33: written articles only, newest first, per locale)', () => {
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

  it('EN: the two written EN articles, newest first', () => {
    expect(guidesPosts(bundle, 'en').map((p) => p.key)).toEqual(['new', 'old']);
  });

  it('TR: only the article with a Turkish body', () => {
    expect(guidesPosts(bundle, 'tr').map((p) => p.key)).toEqual(['tr-only']);
  });

  it('no blog collection → no posts', () => {
    expect(guidesPosts(testBundle(), 'en')).toEqual([]);
  });
});
