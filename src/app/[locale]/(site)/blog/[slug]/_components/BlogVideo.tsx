import { getBlogVideo } from '@/content/videos';
import type { Locale } from '@/i18n/routing';

/**
 * One `!video[Title](key)` block of an article (W249): the registry's file (`src/content/videos.ts`)
 * in the browser's own player — no third-party embed, no script of its own. The fixed 16:9 box
 * reserves the player's space before anything loads (no layout shift); `preload="none"` fetches
 * nothing but the poster until the reader presses play; never autoplay. Every caption track is
 * offered, the one in the page's language switched on (`default`). The title names the player
 * (`aria-label`) and is its caption line. The face follows the body's image blocks (radius,
 * tint border). A key the registry does not know renders nothing (logged outside production).
 */
export function BlogVideo({
  videoKey,
  title,
  locale,
}: {
  videoKey: string;
  title: string;
  /** the page's language: its caption track is on by default */
  locale?: Locale;
}) {
  const video = getBlogVideo(videoKey);
  if (!video) {
    if (process.env.NODE_ENV !== 'production')
      console.warn(
        `[blog] unknown video key "${videoKey}" — nothing rendered (src/content/videos.ts)`,
      );
    return null;
  }
  return (
    <figure data-testid="article-video" data-video-key={videoKey} className="mx-0 mt-2 mb-6">
      <div className="aspect-video w-full overflow-hidden rounded-base border border-tint-border bg-ink">
        <video
          controls
          preload="none"
          playsInline
          poster={video.poster}
          width={video.width}
          height={video.height}
          aria-label={title}
          className="block h-full w-full object-contain"
        >
          <source src={video.src} type="video/mp4" />
          {video.captions.map((track) => (
            <track
              key={track.lang}
              kind="captions"
              src={track.src}
              srcLang={track.lang}
              label={track.label}
              default={track.lang === locale}
            />
          ))}
        </video>
      </div>
      <figcaption className="text-body-sm mt-2.5 font-semibold text-text-tertiary">
        {title}
      </figcaption>
    </figure>
  );
}
