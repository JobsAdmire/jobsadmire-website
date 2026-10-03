import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { FormDoor } from '../_components/types';

/** What each of the page's three form shells takes besides its copy — one source, so the three
 *  D11 fallback panels offer the same numbers (the Turnstile site key is overlaid from the env
 *  only where set, R54). */
export function formDoor(bundle: Bundle, locale: Locale): FormDoor {
  const { settings } = bundle;
  return {
    locale,
    turnstileSiteKey: settings.turnstileSiteKey,
    whatsappNumber: settings.whatsappNumber,
    contact: { phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email },
  };
}
