import { locales, pathnames, routing } from '@/i18n/routing';

/** The external paths Operations prints in `List-Unsubscribe` — `NEWSLETTER_PATHS.unsubscribe`
 *  mirrors `pathnames['/newsletter/unsubscribe']` verbatim: TR at the root, EN under `/en`. */
export const ONE_CLICK_PATHS: readonly string[] = locales.map((locale) => {
  const external = pathnames['/newsletter/unsubscribe'][locale];
  return locale === routing.defaultLocale ? external : `/${locale}${external}`;
});

/**
 * RFC 8058: a mail client POSTs `List-Unsubscribe=One-Click` to the unsubscribe PAGE URL, and a
 * page cannot answer a POST — `src/proxy.ts` rewrites it to `/api/newsletter/unsubscribe`. A
 * server-action call carries the `Next-Action` header and passes through; the page's own button
 * never submits a native form (`NewsletterAction` dispatches from a click handler), so no browser
 * POST without that header ever reaches these paths.
 */
export function isOneClickUnsubscribe(
  method: string,
  pathname: string,
  hasNextAction: boolean,
): boolean {
  return method.toUpperCase() === 'POST' && !hasNextAction && ONE_CLICK_PATHS.includes(pathname);
}
