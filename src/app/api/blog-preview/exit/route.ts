import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { BLOG_PREVIEW_COOKIE, exitPath, previewLocale } from '@/lib/blog-preview';

export const dynamic = 'force-dynamic';

/** W248 — "Exit preview": draft mode off, the token cookie gone, back to the blog index of the
 *  previewed language (`?locale=en` → `/en/blog`, else `/blog`). */
export async function GET(request: NextRequest) {
  const locale = previewLocale(request.nextUrl.searchParams.get('locale'));
  (await draftMode()).disable();
  const res = NextResponse.redirect(new URL(exitPath(locale), request.url), 307);
  res.cookies.delete(BLOG_PREVIEW_COOKIE);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
