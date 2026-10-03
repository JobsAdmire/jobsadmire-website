/** W227 (owner, 2026-10-03): one download link for the app, so a QR code works on every phone.
 *  `https://www.jobsadmire.com/app` sends an iPhone, iPad or iPod to the App Store and every other
 *  device to Google Play. The redirects are built from `settings.storeLinks` when `next.config.ts`
 *  loads and run before the i18n proxy (config redirects precede middleware). Temporary (307), so
 *  a changed store link takes effect with the next deploy instead of living in browser caches.
 *  No `@/` imports: `next.config.ts` loads this file outside the app's path aliases. */
export const APP_LINK_PATH = '/app';

/** Matched against the whole `User-Agent` header. */
export const IOS_USER_AGENT = '.*(iPhone|iPad|iPod).*';

export type StoreLinks = { android: string | null; ios: string | null };

export type AppLinkRedirect = {
  source: string;
  destination: string;
  permanent: false;
  has?: { type: 'header'; key: string; value: string }[];
};

export function appLinkRedirects(links: StoreLinks): AppLinkRedirect[] {
  const out: AppLinkRedirect[] = [];
  if (links.ios) {
    out.push({
      source: APP_LINK_PATH,
      has: [{ type: 'header', key: 'user-agent', value: IOS_USER_AGENT }],
      destination: links.ios,
      permanent: false,
    });
  }
  const fallback = links.android ?? links.ios;
  if (fallback) out.push({ source: APP_LINK_PATH, destination: fallback, permanent: false });
  return out;
}
