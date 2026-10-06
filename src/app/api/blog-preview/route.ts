import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import {
  BLOG_PREVIEW_COOKIE,
  isPreviewToken,
  previewCookieOptions,
  previewLocale,
  previewPath,
} from '@/lib/blog-preview';

export const dynamic = 'force-dynamic';

/**
 * W248 — the blog draft preview's entry (docs/INTEGRATIONS.md I21): Operations' "Preview on
 * website" opens `/api/blog-preview?token=…&locale=tr|en`. Draft mode goes on, the token goes
 * into an httpOnly cookie (never into a URL the page shows or a Referer it sends), and the
 * browser lands on `/blog/preview` or `/en/blog/preview`. A missing or malformed token stores
 * nothing — the page then says the link is invalid. Nothing here calls Operations; the page does,
 * server-side, with the cookie's token.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const locale = previewLocale(request.nextUrl.searchParams.get('locale'));
  (await draftMode()).enable();
  const res = NextResponse.redirect(new URL(previewPath(locale), request.url), 307);
  if (isPreviewToken(token)) res.cookies.set(BLOG_PREVIEW_COOKIE, token, previewCookieOptions());
  else res.cookies.delete(BLOG_PREVIEW_COOKIE);
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('Referrer-Policy', 'no-referrer');
  return res;
}
