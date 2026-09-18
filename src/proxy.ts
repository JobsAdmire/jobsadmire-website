import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import gone from '../redirects/gone.json';

const intl = createMiddleware(routing);
const GONE = gone as string[];

export default function proxy(request: Parameters<typeof intl>[0]) {
  const { pathname } = request.nextUrl;
  if (GONE.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`))) {
    return new NextResponse(null, { status: 410 });
  }
  return intl(request);
}

export const config = {
  // never intercept API routes, Next internals, Vercel internals, or files with an extension
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
