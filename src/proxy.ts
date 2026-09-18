import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

export default function proxy(request: Parameters<typeof intl>[0]) {
  return intl(request);
}

export const config = {
  // never intercept API routes, Next internals, Vercel internals, or files with an extension
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
