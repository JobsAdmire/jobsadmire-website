import { getPathname } from '@/i18n/navigation';
import { pathnames, routing, type Locale } from '@/i18n/routing';

/** Production origin; a trailing slash in the env value would double up in every URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.jobsadmire.com').replace(
  /\/$/,
  '',
);

/** The typed internal pathname `getPathname` accepts — a key of `pathnames`, or, for the
 *  dynamic routes, `{ pathname, params }`. */
export type Href = Parameters<typeof getPathname>[0]['href'];

/** A `pathnames` key with no dynamic segment — the only keys `getPathname` takes as a bare
 *  string. Exported for the sitemap/robots tests' type guards (W37). */
export type StaticPathname = Exclude<keyof typeof pathnames, `${string}[${string}`>;

/**
 * Internal pathnames that are never indexed: the conversion page (D13), the portal door, the
 * two newsletter one-shot pages, and — W4, until six Turkish article bodies exist — the blog
 * index and its articles. One set, two consumers (M-3): `app/sitemap.ts` excludes them and
 * `app/robots.ts` disallows their external form in both locales through
 * `noindexExternalPaths`, so a TR slug change in `pathnames` can never leave robots pointing
 * at a path that no longer exists. (`/api/` is disallowed literally there; it is not a
 * `pathnames` route.) Typed as keys, not `Href`s: '/blog/[slug]' is a key but not a bare
 * href, so never hand this set to `getPathname`/`absoluteUrl` directly — go through
 * `noindexExternalPaths`. The blog flip back to index is a manual, reviewed step (T12/WP-C):
 * remove both entries here and nowhere else.
 */
export const NOINDEX_PATHNAMES = [
  '/thank-you',
  '/portal-login',
  '/newsletter/confirm',
  '/newsletter/unsubscribe',
  '/blog',
  '/blog/[slug]',
] as const satisfies readonly (keyof typeof pathnames)[];

export function isNoindexPathname(href: keyof typeof pathnames): boolean {
  return (NOINDEX_PATHNAMES as readonly string[]).includes(href);
}

/** The noindex set as localized external paths for robots.txt, deduped: a dynamic key is
 *  covered by its parent's prefix (`/blog/[slug]` → `/blog`), since robots matching is by
 *  prefix and a template can never be a real path. */
export function noindexExternalPaths(locale: Locale): string[] {
  const out = new Set<string>();
  for (const href of NOINDEX_PATHNAMES) {
    const key = (
      href.includes('[') ? href.slice(0, href.lastIndexOf('/')) : href
    ) as StaticPathname;
    out.add(getPathname({ locale, href: key }));
  }
  return [...out];
}

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
