/**
 * The one remote image source the site renders (contract `blog.v1`): Operations' public media
 * route, `GET /api/website/v1/media/:assetId/:variant.webp` (variants 640/1200/1600/2400). Blog
 * covers and inline body images come from there; `next.config.ts` allows exactly this origin and
 * path in `images.remotePatterns`, so `next/image` optimises them and nothing else. Pure, no
 * imports — `next.config.ts` reads it too.
 */
export const BLOG_MEDIA_HOST = 'operations.jobsadmire.com';
export const BLOG_MEDIA_PATH = '/api/website/v1/media/';
export const BLOG_MEDIA_PREFIX = `https://${BLOG_MEDIA_HOST}${BLOG_MEDIA_PATH}`;

/** An image the site will render: a file of the site itself (`/…`, not `//host`) or one on the
 *  Operations media route. Anything else is dropped — never fetched, never optimised. */
export function isBlogImageSrc(src: string): boolean {
  if (src.startsWith('/')) return !src.startsWith('//');
  return src.startsWith(BLOG_MEDIA_PREFIX) && !src.slice(BLOG_MEDIA_PREFIX.length).includes('..');
}
