import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import legacy from './redirects/legacy.json';
import localBundle from './src/content/local/bundle.tr.json';
import { appLinkRedirects, type StoreLinks } from './src/lib/app-link';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// NEXT_BUILD_CPUS counts only as a positive integer (M5): 'abc' (NaN), '0' or '2.5' must never
// reach `experimental.cpus` below.
const buildCpus = Number(process.env.NEXT_BUILD_CPUS);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The OG image route reads its font from disk at request time; the tracer resolves the
  // `join(process.cwd(), '…')` literal, this is the belt to that brace so a tracer change can
  // never ship the function without its bytes (docs/SEO.md § OG images).
  outputFileTracingIncludes: { '/og/[locale]/[pageKey]': ['./src/design/fonts/*.ttf'] },
  // W73/W116: a form's file travels inside its server action. Next caps a server-action body
  // at 1 MB by default and Vercel caps a function body at 4.5 MB; the per-file cap is 3 MB
  // (`MAX_UPLOAD_BYTES`, src/forms/uploads.ts), 1 MB under this limit for the other fields and
  // the multipart framing, one file per call.
  experimental: {
    serverActions: { bodySizeLimit: '4mb' },
    // Local build worker cap (memory rule, this machine only): NEXT_BUILD_CPUS=2 npm run build
    // caps Next's static-generation workers. Unset or invalid (the Vercel build never sets it)
    // keeps Next's own default worker count — Vercel is unaffected.
    cpus: Number.isInteger(buildCpus) && buildCpus > 0 ? buildCpus : undefined,
    // W218: the stylesheets ride inside the document as <style> blocks instead of a render-blocking
    // <link> round trip. The binding preview run read FCP = LCP = 2.4 s with 94 % of it render
    // delay waiting for the 21 KB sheet (562 ms simulated + ~590 ms real latency per request,
    // bandwidth shared with the fonts and chunks); the document grows ≈ 22 KB gz and first paint
    // no longer waits for a second request. The pixel harness rewrites font-display in documents
    // too (scripts/pixel-compare.ts, builtCssRoute).
    inlineCss: true,
  },
  async redirects() {
    return [
      // W227: `/app` — the App Store for Apple devices, Google Play for the rest (src/lib/app-link.ts).
      ...appLinkRedirects((localBundle.settings as { storeLinks: StoreLinks }).storeLinks),
      ...(legacy as { from: string; to: string }[]).map((r) => ({
        source: r.from,
        destination: r.to,
        permanent: true,
      })),
    ];
  },
  // W155 part 2 (§8 I) + W157 + W160: of the four cheap security headers Gate A wants (a CSP with
  // nonces is a separate, later item), only `X-Content-Type-Options: nosniff` is set here, on
  // EVERY response — it is the one that matters for a script, and it is harmless anywhere. The
  // other three are document headers and used to live here too, behind a negative-lookahead
  // `source` excluding `/_next/static/` and `/_next/image` (W157: meaningless on a static chunk or
  // an optimised image, and costly on every script response otherwise). The Vercel preview showed
  // that Vercel's routing layer does not honour that lookahead `source` form — it still applied
  // those headers to `/_next/static` chunks there, although `next start` respected it (W160). They
  // now live in `src/proxy.ts`'s middleware instead, whose matcher already selects document routes
  // only (the canonical Next matcher form, which Vercel does support). `/og/*`, `/api/*` and
  // `/_next/*` therefore carry `nosniff` only. e2e/headers.spec.ts pins pages, a chunk, an
  // optimised image and the OG route.
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] }];
  },
};

export default withNextIntl(nextConfig);
