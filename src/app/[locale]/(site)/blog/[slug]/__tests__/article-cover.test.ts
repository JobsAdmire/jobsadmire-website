import { describe, expect, it } from 'vitest';
import type { BlogPost } from '@/content/collections';
import { articleTopCover } from '../_lib/article';

/** A written row; `over` sets the cover fields a case needs. */
const post = (over: Partial<BlogPost> = {}): BlogPost => ({
  key: 'p',
  slug: { tr: 'p-tr', en: 'p' },
  title: { tr: 'Başlık', en: 'Title' },
  excerpt: { tr: 'Özet', en: 'Excerpt' },
  category: 'workPermits',
  categoryLabelId: 'home.263',
  author: 'JobsAdmire',
  publishedAt: '2026-10-06',
  readMinutes: 3,
  hasBody: { tr: true, en: true },
  body: { tr: 'metin', en: 'text' },
  ...over,
});
const PHOTO = {
  url: 'https://operations.jobsadmire.com/api/website/v1/media/a/1600.webp',
  width: 1600,
  height: 900,
};
const POSTER = { url: '/media/blog/atv-vizyon-haris-jiva.jpg', width: 1920, height: 1080 };

describe('articleTopCover (owner 2026-10-06, W250)', () => {
  it('a photo of its own shows at the top unless Operations switched it off', () => {
    expect(articleTopCover(post({ cover: PHOTO, coverSource: 'post' }))).toBe('photo');
    expect(articleTopCover(post({ cover: PHOTO, coverSource: 'post', showCover: true }))).toBe(
      'photo',
    );
    expect(articleTopCover(post({ cover: PHOTO, coverSource: 'post', showCover: false }))).toBe(
      null,
    );
  });

  it('a cover that is only the video poster never shows at the top — the body plays that video', () => {
    expect(articleTopCover(post({ cover: POSTER, coverSource: 'video' }))).toBe(null);
    expect(articleTopCover(post({ cover: POSTER, coverSource: 'video', showCover: true }))).toBe(
      null,
    );
  });

  it('no cover at all: the named category placeholder, unless switched off', () => {
    expect(articleTopCover(post())).toBe('placeholder'); // the LOCAL article
    expect(articleTopCover(post({ cover: null }))).toBe('placeholder');
    expect(articleTopCover(post({ cover: null, showCover: false }))).toBe(null);
  });
});
