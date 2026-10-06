import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { VIDEO_KEY_RE } from '@/app/[locale]/(site)/blog/[slug]/_lib/markdown';
import { atvPost } from '@/test/blog-fixtures';
import {
  BLOG_VIDEOS,
  bodyVideos,
  firstVideo,
  firstVideoKey,
  getBlogVideo,
  type BlogVideo,
} from './videos';

const ATV = 'atv-vizyon-haris-jiva';
const publicFile = (path: string) => join(process.cwd(), 'public', path);

describe('the blog video registry (W249)', () => {
  it('every key is a valid video key and every file is a committed file of the site', () => {
    for (const [key, video] of Object.entries(BLOG_VIDEOS)) {
      expect(VIDEO_KEY_RE.test(key), key).toBe(true);
      // versioned by key: every file is named after it, under /media/blog/
      const files = [video.src, video.poster, ...video.captions.map((c) => c.src)];
      for (const file of files) {
        expect(file.startsWith(`/media/blog/${key}.`), file).toBe(true);
        expect(existsSync(publicFile(file)), file).toBe(true);
      }
      expect(video.src).toMatch(/\.mp4$/);
      expect(video.poster).toMatch(/\.jpg$/);
      for (const c of video.captions) expect(c.src).toBe(`/media/blog/${key}.${c.lang}.vtt`);
      expect(video.width / video.height).toBeCloseTo(16 / 9, 2);
      expect(video.durationSec).toBeGreaterThan(0);
    }
  });

  it('the ATV interview: 1920 × 1080, 3:25, Turkish, Turkish captions, the press video', () => {
    expect(getBlogVideo(ATV)).toEqual<BlogVideo>({
      src: '/media/blog/atv-vizyon-haris-jiva.mp4',
      poster: '/media/blog/atv-vizyon-haris-jiva.jpg',
      width: 1920,
      height: 1080,
      durationSec: 205,
      lang: 'tr',
      captions: [{ lang: 'tr', src: '/media/blog/atv-vizyon-haris-jiva.tr.vtt', label: 'Türkçe' }],
      press: true,
    });
    // the files as encoded (docs/ARCHITECTURE.md § Assets): a 36 MB MP4, a WebVTT file
    expect(statSync(publicFile('/media/blog/atv-vizyon-haris-jiva.mp4')).size).toBe(36_235_882);
  });

  it('getBlogVideo knows its own keys only — never an Object.prototype member', () => {
    for (const key of ['constructor', 'toString', '__proto__', 'hasOwnProperty', 'unknown', ''])
      expect(getBlogVideo(key), key).toBeNull();
  });
});

describe('firstVideoKey / firstVideo / bodyVideos', () => {
  it('the first registered video a body shows, read the way the article reads it', () => {
    const body = (atvPost() as { body: { tr: string } }).body.tr;
    expect(firstVideoKey(body)).toBe(ATV);
    expect(firstVideo(body)).toMatchObject({
      key: ATV,
      title: 'ATV Vizyon: JobsAdmire kurucusu Haris Jiva ile röportaj',
      video: { poster: '/media/blog/atv-vizyon-haris-jiva.jpg' },
    });
  });

  it('skips an unknown key, a malformed or an inline line; one entry per key', () => {
    const md = [
      'Text with !video[Inline](atv-vizyon-haris-jiva) in it.',
      '!video[Not yet](unknown-video)',
      '!video[Bad](ATV)',
      '!video[First](atv-vizyon-haris-jiva)',
      '!video[Again](atv-vizyon-haris-jiva)',
    ].join('\n\n');
    expect(firstVideoKey(md)).toBe(ATV);
    expect(bodyVideos(md).map((v) => v.title)).toEqual(['First']);
  });

  it('null without a body or without a video', () => {
    for (const md of [null, undefined, '', 'Just text.', '!video[Not yet](unknown-video)'])
      expect(firstVideoKey(md)).toBeNull();
  });
});
