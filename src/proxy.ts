import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { isOneClickUnsubscribe } from './lib/newsletter/one-click';
import gone from '../redirects/gone.json';

const intl = createMiddleware(routing);
const GONE = gone as string[];

// W157 + W160: these three are document-only headers (meaningless on a static chunk or an
// optimised image, and costly on every script response, W157) that used to live in
// `next.config.ts`'s `headers()` behind a negative-lookahead `source`. The Vercel preview showed
// that Vercel's routing layer does not honour that regex form — the lookahead entries still
// landed on `/_next/static` chunks there, although `next start` respected them (W160). This
// matcher (below) already selects document routes only — no `api`, `_next`, `_vercel`, or path
// with a file extension — so the headers are set here instead, on every response this proxy
// returns. `next.config.ts` keeps only the blanket `X-Content-Type-Options: nosniff`. The
// constant is exported so the e2e and unit tests assert against the same values.
export const DOCUMENT_SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

function withDocumentHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(DOCUMENT_SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

export default function proxy(request: Parameters<typeof intl>[0]) {
  const { pathname } = request.nextUrl;
  // RFC 8058 (T13, I12): a mail client's one-click POST lands on the unsubscribe PAGE URL
  // Operations prints in List-Unsubscribe, and a page cannot answer a POST — rewrite it onto the
  // route handler, query (the token) kept. A server-action call to the same page carries
  // `Next-Action` and falls through to next-intl like every other request. W160: the rewrite
  // gets the document headers like every response this proxy returns.
  if (isOneClickUnsubscribe(request.method, pathname, request.headers.has('next-action'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/newsletter/unsubscribe';
    return withDocumentHeaders(NextResponse.rewrite(url));
  }
  if (GONE.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`))) {
    return withDocumentHeaders(new NextResponse(null, { status: 410 }));
  }
  // `intl` is typed as `(request: NextRequest) => NextResponse<unknown>` (next-intl's own
  // `middleware.d.ts`) — always a `NextResponse`, never a bare `Response` — so no runtime type
  // guard is needed before handing it to `withDocumentHeaders`.
  return withDocumentHeaders(intl(request));
}

export const config = {
  // never intercept API routes, Next internals, Vercel internals, or files with an extension
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
