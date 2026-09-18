export type ConsentState = 'unknown' | 'granted' | 'denied';

export const CONSENT_KEY = 'ja_consent_v1';
/** Custom window event `writeConsent` dispatches after storing, so `ConsentBanner`'s
 *  `useSyncExternalStore` subscription hears the choice without polling or an effect (R27). */
export const CONSENT_EVENT = 'ja:consent';

const MAX_AGE = 60 * 60 * 24 * 180;

/** Inline in <head> before GTM: Consent Mode v2 defaults denied (D13). */
export const CONSENT_DEFAULT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('set','url_passthrough',true);gtag('set','ads_data_redaction',true);`;

/** The cookie is written alongside the localStorage entry, so a visitor whose storage is
 *  blocked (private mode) still gets their choice remembered — without it the banner would
 *  re-appear the instant they dismissed it, because the snapshot would read `unknown` again. */
function readCookie(): ConsentState | null {
  try {
    const m = new RegExp(`(?:^|;\\s*)${CONSENT_KEY}=(granted|denied)`).exec(document.cookie);
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

export function writeConsent(state: Exclude<ConsentState, 'unknown'>) {
  try {
    localStorage.setItem(CONSENT_KEY, state);
  } catch {
    /* private mode */
  }
  document.cookie = `${CONSENT_KEY}=${state}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;
  const v = state === 'granted' ? 'granted' : 'denied';
  (window.dataLayer ??= []).push({ event: 'consent_update' });
  // `gtag` comes from the inline default script, which only renders when
  // `settings.analytics.consentMode` is on — so it stays optional here, never assumed.
  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('consent', 'update', {
    ad_storage: v,
    analytics_storage: v,
    ad_user_data: v,
    ad_personalization: v,
  });
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
