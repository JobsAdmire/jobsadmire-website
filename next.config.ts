import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import legacy from './redirects/legacy.json';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // W73/W116: a form's file travels inside its server action. Next caps a server-action body
  // at 1 MB by default and Vercel caps a function body at 4.5 MB; the per-file cap is 3 MB
  // (`MAX_UPLOAD_BYTES`, src/forms/uploads.ts), 1 MB under this limit for the other fields and
  // the multipart framing, one file per call.
  experimental: {
    serverActions: { bodySizeLimit: '4mb' },
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
