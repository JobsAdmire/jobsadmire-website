import type { MetadataRoute } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { NOINDEX_PATHNAMES, SITE_URL } from '@/lib/seo/routes';

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
          // `/api/` is literal — it is not a `pathnames` route. Everything else is derived
          // from the one `NOINDEX_PATHNAMES` set the sitemap excludes (M-3), in both locales,
          // so a slug change cannot leave this list pointing at a path that no longer exists.
          disallow: [
            '/api/',
            ...routing.locales.flatMap((locale) =>
              NOINDEX_PATHNAMES.map((href) => getPathname({ locale, href })),
            ),
          ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
      };
}
