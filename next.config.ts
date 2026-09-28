import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import legacy from './redirects/legacy.json';

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
  },
  async redirects() {
    return (legacy as { from: string; to: string }[]).map((r) => ({
      source: r.from,
      destination: r.to,
      permanent: true,
    }));
  },
  // W155 part 2 (§8 I) + W157: the four cheap security headers Gate A wants (a CSP with nonces is
  // a separate, later item). `X-Content-Type-Options: nosniff` goes on EVERY response — it is the
  // one that matters for a script. The other three are document headers: meaningless on a static
  // chunk or an optimised image, and on every `/_next/static/*` response they cost ≈ 135 B that
  // Lighthouse's script transfer size counts (≈ 1.5 KB per route, W157), so their `source` is a
  // negative lookahead excluding `/_next/static/` and `/_next/image`. X-Frame-Options also skips
  // the OG image route, meant to be fetched and displayed wherever a shared link's preview
  // renders. Each key is set by exactly ONE block: Next's documented "last matching block wins per
  // KEY" rule does not undo a key an earlier block set that a later, more specific block never
  // mentions (proved against a running server in round 2 — an /og/:path* block that omitted
  // X-Frame-Options still left DENY in place), so an exception is always a narrower `source`,
  // never a block that leaves a key out. e2e/headers.spec.ts pins pages, a chunk, an optimised
  // image and the OG route.
  async headers() {
    const notStatic = '(?!_next/static/|_next/image(?:/|$))';
    return [
      { source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] },
      {
        source: `/(${notStatic}.*)`,
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: `/(${notStatic}(?!og/).*)`,
        headers: [{ key: 'X-Frame-Options', value: 'DENY' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
