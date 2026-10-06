import type { Locale } from '@/i18n/routing';

/**
 * The blog draft preview's door (W248, docs/INTEGRATIONS.md I21). Operations' "Preview on
 * website" opens `GET /api/blog-preview?token=<signed>&locale=tr|en`; the route turns Next's
 * draft mode on, keeps the token in an httpOnly cookie and redirects to `/blog/preview` (TR) or
 * `/en/blog/preview` (EN), which fetches the draft with it, never cached. The site holds no
 * secret: Operations validates its own HMAC-signed, 30-minute token. Pure: the route handlers
 * and the page share these.
 */
export const BLOG_PREVIEW_COOKIE = 'ja_blog_preview';
/** The token's own lifetime in Operations; the cookie never outlives it. */
export const BLOG_PREVIEW_MAX_AGE = 30 * 60;
/** A token as Operations issues it (signed, base64url segments): anything else is never stored
 *  and never sent anywhere. */
export const BLOG_PREVIEW_TOKEN_RE = /^[A-Za-z0-9._~-]{16,2048}$/;

export function isPreviewToken(token: string | null | undefined): token is string {
  return typeof token === 'string' && BLOG_PREVIEW_TOKEN_RE.test(token);
}

/** `locale=en` previews the English text; anything else the Turkish one (the default locale). */
export function previewLocale(raw: string | null | undefined): Locale {
  return raw === 'en' ? 'en' : 'tr';
}

/** The preview page (a static `blog/preview` segment, which always wins over `[slug]` — so
 *  `preview` is a slug no post can take: `RESERVED_BLOG_SLUGS`). */
export function previewPath(locale: Locale): string {
  return locale === 'en' ? '/en/blog/preview' : '/blog/preview';
}

/** Where "Exit preview" lands: the blog index of the previewed language. */
export function exitPath(locale: Locale): string {
  return locale === 'en' ? '/en/blog' : '/blog';
}

export function previewCookieOptions(env: NodeJS.ProcessEnv = process.env) {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: BLOG_PREVIEW_MAX_AGE,
  };
}
