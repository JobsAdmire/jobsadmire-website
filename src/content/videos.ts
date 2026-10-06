import { parseMarkdown, type Block } from '@/app/[locale]/(site)/blog/[slug]/_lib/markdown';

/**
 * The blog's video registry (W249). A video is a static file of the site itself — never a
 * third-party player — under `public/media/blog/`: `<key>.mp4` (H.264/AAC, faststart), `<key>.jpg`
 * (the poster, same size) and one `<key>.<lang>.vtt` per caption track, served with a one-year
 * `immutable` cache (`next.config.ts`). A post embeds one with a body line of its own,
 * `!video[Title](key)` (docs/CONTENT-MODEL.md § Blog); the key resolves here, and a key the
 * registry does not know renders nothing. Adding a video = its files + one entry here + a deploy,
 * then the key in the Operations editor (docs/ARCHITECTURE.md § Assets — blog videos). A file is
 * never overwritten in place: a new cut is a new key (the cache is immutable).
 */
export type BlogVideoCaption = {
  lang: 'tr' | 'en';
  /** site path of the WebVTT file */
  src: string;
  /** the track's name in the player's captions menu */
  label: string;
};

export type BlogVideo = {
  /** site path of the MP4 */
  src: string;
  /** site path of the poster JPEG — also the cover of a post without one (W249) */
  poster: string;
  width: number;
  height: number;
  durationSec: number;
  /** the spoken language (`VideoObject.inLanguage`) */
  lang: 'tr' | 'en';
  captions: readonly BlogVideoCaption[];
  /** The home's press strip may feature a post carrying this video — its copy
   *  (`sys.home.press.*`) names this interview, so no other video may borrow it. */
  press?: boolean;
};

export const BLOG_VIDEOS: Readonly<Record<string, BlogVideo>> = {
  // ATV "Vizyon" interview with the founder, Haris Jiva (2026; 1920×1080, 3:25, 36 MB). Spoken
  // Turkish; Turkish captions and their English translation (W250, cue for cue).
  'atv-vizyon-haris-jiva': {
    src: '/media/blog/atv-vizyon-haris-jiva.mp4',
    poster: '/media/blog/atv-vizyon-haris-jiva.jpg',
    width: 1920,
    height: 1080,
    durationSec: 205,
    lang: 'tr',
    captions: [
      { lang: 'tr', src: '/media/blog/atv-vizyon-haris-jiva.tr.vtt', label: 'Türkçe' },
      { lang: 'en', src: '/media/blog/atv-vizyon-haris-jiva.en.vtt', label: 'English' },
    ],
    press: true,
  },
};

/** The registry entry behind `key`, or null — own keys only (`constructor` is a valid key shape). */
export function getBlogVideo(key: string): BlogVideo | null {
  return Object.prototype.hasOwnProperty.call(BLOG_VIDEOS, key) ? BLOG_VIDEOS[key] : null;
}

/** One video a body shows: its key, the title its line gives it, the registry entry. */
export type BodyVideo = { key: string; title: string; video: BlogVideo };

/** The videos parsed blocks show, in order — registered keys only, each key once. */
export function videosOf(blocks: readonly Block[]): BodyVideo[] {
  const seen = new Set<string>();
  return blocks.flatMap((block) => {
    if (block.kind !== 'video' || seen.has(block.key)) return [];
    const video = getBlogVideo(block.key);
    if (!video) return [];
    seen.add(block.key);
    return [{ key: block.key, title: block.title, video }];
  });
}

/** The videos a Markdown body shows (the article parser's own reading of it). */
export function bodyVideos(markdown: string | null | undefined): BodyVideo[] {
  return markdown ? videosOf(parseMarkdown(markdown)) : [];
}

/** The first video a body shows, or null. */
export function firstVideo(markdown: string | null | undefined): BodyVideo | null {
  return bodyVideos(markdown)[0] ?? null;
}

/** The key of the first video a body shows — a registered key, or null. */
export function firstVideoKey(markdown: string | null | undefined): string | null {
  return firstVideo(markdown)?.key ?? null;
}
