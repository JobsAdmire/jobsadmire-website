import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

/** Production origin; a trailing slash in the env value would double up in every URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.jobsadmire.com').replace(
  /\/$/,
  '',
);

/** The typed internal pathname `getPathname` accepts — a key of `pathnames`, or, for the
 *  dynamic routes, `{ pathname, params }`. */
export type Href = Parameters<typeof getPathname>[0]['href'];

/** Absolute, locale-correct URL for an internal pathname. `getPathname` is synchronous when
 *  the locale is passed explicitly, and returns `/` for the TR root and `/en` for the EN one,
 *  so the TR root keeps its trailing slash and no other URL gains one. */
export function absoluteUrl(locale: Locale, href: Href): string {
  return `${SITE_URL}${getPathname({ locale, href })}`;
}

/** hreflang map for one page: both locales plus `x-default` = TR, self-reference included
 *  (a page missing its own locale here is a defect — docs/SEO.md). */
export function localeAlternates(href: Href): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = absoluteUrl(locale, href);
  languages['x-default'] = absoluteUrl(routing.defaultLocale, href);
  return { languages };
}
