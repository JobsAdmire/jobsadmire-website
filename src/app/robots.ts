import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/routes';

export default function robots(): MetadataRoute.Robots {
  // Previews are additionally protected by Vercel Deployment Protection — robots is a hint,
  // not access control (docs/SEO.md).
  const preview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  return preview
    ? { rules: { userAgent: '*', disallow: '/' } }
    : {
        rules: {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/api/',
            '/portal-girisi',
            '/en/portal-login',
            '/tesekkurler',
            '/en/thank-you',
          ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
      };
}
