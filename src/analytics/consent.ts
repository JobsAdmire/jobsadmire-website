export type ConsentState = 'unknown' | 'granted' | 'denied';

export const CONSENT_KEY = 'ja_consent_v1';
/** Custom window event `writeConsent` dispatches after storing, so `ConsentBanner`'s
 *  `useSyncExternalStore` subscription hears the choice without polling or an effect (R27). */
export const CONSENT_EVENT = 'ja:consent';

const MAX_AGE = 60 * 60 * 24 * 180;
/** `Secure` because the site is HTTPS-only in every environment that matters (localhost is a
 *  trustworthy origin, so it still round-trips in dev and in the e2e run). */
const COOKIE = (value: string, maxAge: number) =>
  `${CONSENT_KEY}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`;

/** Inline in <head> before GTM: Consent Mode v2 defaults denied (D13). */
export const CONSENT_DEFAULT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('set','url_passthrough',true);gtag('set','ads_data_redaction',true);`;

/** The cookie is written alongside the localStorage entry, so a visitor whose storage is
 *  blocked (private mode) still gets their choice remembered — without it the banner would
 *  re-appear the instant they dismissed it, because the snapshot would read `unknown` again. */
function readCookie(): ConsentState | null {
  try {
    // Anchored on both sides: `ja_consent_v1=granted_later` is not a granted consent.
    const m = new RegExp(`(?:^|;\\s*)${CONSENT_KEY}=(granted|denied)(?:;|$)`).exec(document.cookie);
    return (m?.[1] as ConsentState | undefined) ?? null;
  } catch {
    return null;
  }
}

export function readConsent(): ConsentState {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'granted' || stored === 'denied') return stored;
  } catch {
    /* storage blocked (private mode): fall through to the cookie */
  }
  return readCookie() ?? 'unknown';
}

/** `gtag` comes from the inline default script, which only renders when
 *  `settings.analytics.consentMode` is on — so it stays optional here, never assumed. */
function updateGtag(v: 'granted' | 'denied') {
  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('consent', 'update', {
    ad_storage: v,
    analytics_storage: v,
    ad_user_data: v,
    ad_personalization: v,
  });
}

export function writeConsent(state: Exclude<ConsentState, 'unknown'>) {
  try {
    localStorage.setItem(CONSENT_KEY, state);
  } catch {
    /* private mode */
  }
  document.cookie = COOKIE(state, MAX_AGE);
  (window.dataLayer ??= []).push({ event: 'consent_update' });
  updateGtag(state);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Withdrawal (R36): the banner promises the visitor can change their mind, so something has
 *  to be able to un-choose. Drops both records and re-publishes — the sheet re-opens on
 *  `unknown`, and with nothing stored the next page load starts from the denied defaults. */
export function clearConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* private mode */
  }
  document.cookie = COOKIE('', 0);
  // R39: re-deny straight away, so any tag already running stops within this page view rather
  // than waiting for the visitor to choose again or to reload.
  updateGtag('denied');
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
