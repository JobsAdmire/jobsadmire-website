import { defineRouting } from 'next-intl/routing';

export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

/** Internal pathname → external path per locale (D16). Add routes here only. */
export const pathnames = {
  '/': '/',
  '/hire-workers': { tr: '/isci-talebi', en: '/hire-workers' },
  '/hiring-cost-calculator': { tr: '/maliyet-hesaplayici', en: '/hiring-cost-calculator' },
  '/partner-with-us': { tr: '/ortak-olun', en: '/partner-with-us' },
  '/work-permit': { tr: '/calisma-izni', en: '/work-permit' },
  '/about': { tr: '/hakkimizda', en: '/about' },
  '/verify': { tr: '/temsilci-dogrulama', en: '/verify' },
  '/careers': { tr: '/kariyer', en: '/careers' },
  '/careers/[slug]': { tr: '/kariyer/[slug]', en: '/careers/[slug]' },
  '/contact': { tr: '/iletisim', en: '/contact' },
  '/available-workers': { tr: '/adaylar', en: '/available-workers' },
  '/success-stories': { tr: '/basari-hikayeleri', en: '/success-stories' },
  '/blog': '/blog',
  '/blog/[slug]': '/blog/[slug]',
  '/portal-login': { tr: '/portal-girisi', en: '/portal-login' },
  '/privacy': { tr: '/gizlilik', en: '/privacy' },
  '/terms': { tr: '/kullanim-kosullari', en: '/terms' },
  '/kvkk': '/kvkk',
  '/cookie-policy': { tr: '/cerez-politikasi', en: '/cookie-policy' },
  '/thank-you': { tr: '/tesekkurler', en: '/thank-you' },
  '/newsletter/confirm': { tr: '/abone-onay', en: '/newsletter/confirm' },
  '/newsletter/unsubscribe': { tr: '/abonelikten-cik', en: '/newsletter/unsubscribe' },
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale: 'tr',
  localePrefix: 'as-needed', // TR unprefixed, /en prefixed (D1)
  localeDetection: false, // crawlers and visitors always get TR at the root; the LanguageHint offers EN once
  localeCookie: { name: 'ja_locale', maxAge: 60 * 60 * 24 * 365 },
  pathnames,
});
