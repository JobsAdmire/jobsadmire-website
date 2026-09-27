import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { robotsDisallowPaths, SITE_URL } from '@/lib/seo/routes';

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
          // minus the routes that have no page yet (`UNBUILT_PATHNAMES`, W20): a rule must
          // never name a path that does not exist. A page task deletes its key and the rule
          // appears here on its own.
          disallow: ['/api/', ...routing.locales.flatMap((locale) => robotsDisallowPaths(locale))],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
      };
}
