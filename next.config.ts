import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import legacy from './redirects/legacy.json';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // W73: a form's file travels inside its server action. Next caps a server-action body at
  // 1 MB by default and Vercel caps a function body at 4.5 MB; 4 MB is the one per-file cap
  // (`MAX_UPLOAD_BYTES`, src/forms/uploads.ts), one file per call.
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
