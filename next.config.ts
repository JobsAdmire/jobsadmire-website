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
};

export default withNextIntl(nextConfig);
