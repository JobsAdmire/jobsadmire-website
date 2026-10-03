// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import proxy, { DOCUMENT_SECURITY_HEADERS } from './proxy';

/**
 * W160: `src/proxy.ts` sets the three document-only security headers (X-Frame-Options,
 * Referrer-Policy, Permissions-Policy) on every response it returns — the 410 (gone) branch and
 * the next-intl branch alike — because `next.config.ts`'s old negative-lookahead `source` for
 * them was silently ignored by Vercel's routing layer on `/_next/static` chunks, although
 * `next start` honoured it. `next.config.ts` now keeps only `X-Content-Type-Options: nosniff`,
 * asserted separately by e2e/headers.spec.ts alongside these three.
 */
const req = (path: string) => new NextRequest(new URL(path, 'https://www.jobsadmire.com'));

describe('proxy — document security headers (W160)', () => {
  it('sets the three document headers on a 410 (gone) response', () => {
    // '/job-detail/' is listed verbatim in redirects/gone.json
    const res = proxy(req('/job-detail/'));
    expect(res.status).toBe(410);
    for (const [key, value] of Object.entries(DOCUMENT_SECURITY_HEADERS)) {
      expect(res.headers.get(key)).toBe(value);
    }
  });

  it('sets the three document headers on a normal page response from the next-intl middleware', () => {
    const res = proxy(req('/'));
    for (const [key, value] of Object.entries(DOCUMENT_SECURITY_HEADERS)) {
      expect(res.headers.get(key)).toBe(value);
    }
  });

  it('the exported constant matches the W160 values exactly', () => {
    expect(DOCUMENT_SECURITY_HEADERS).toEqual({
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    });
  });
});

const post = (path: string, headers: Record<string, string> = {}) =>
  new NextRequest(new URL(path, 'https://www.jobsadmire.com'), { method: 'POST', headers });
const rewriteOf = (res: Response) => res.headers.get('x-middleware-rewrite') ?? '';

describe('proxy — RFC 8058 one-click rewrite (T13, I12)', () => {
  it('rewrites a plain POST to either unsubscribe page onto the route handler, query kept, headers set', () => {
    for (const path of ['/abonelikten-cik', '/en/newsletter/unsubscribe']) {
      const res = proxy(post(`${path}?token=abc.def`));
      expect(rewriteOf(res)).toContain('/api/newsletter/unsubscribe?token=abc.def');
      for (const [key, value] of Object.entries(DOCUMENT_SECURITY_HEADERS)) {
        expect(res.headers.get(key)).toBe(value);
      }
    }
  });

  it('leaves a server-action POST, a GET and the confirm page to next-intl', () => {
    expect(
      rewriteOf(proxy(post('/abonelikten-cik?token=abc', { 'next-action': '7f3a' }))),
    ).not.toContain('/api/');
    expect(rewriteOf(proxy(req('/abonelikten-cik?token=abc')))).not.toContain('/api/');
    expect(rewriteOf(proxy(post('/abone-onay?token=abc')))).not.toContain('/api/');
  });
});
