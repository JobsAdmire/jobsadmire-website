import type { Bundle } from '../../../../../../contract/website-bundle.v1';

type PartnerLineSettings = Pick<Bundle['settings'], 'phone' | 'phoneDisplay' | 'partnershipsPhone'>;

/** The one number this page offers to call: E.164 for the `tel:` href, grouped for the eye. */
export type PartnerLine = { phone: string; phoneDisplay: string };

/** `settings.phoneDisplay` exists for the main line only. A Turkish E.164 number (+90 and ten
 *  digits) gets the same "+90 5xx xxx xx xx" grouping; anything else renders as stored. */
export function displayPhone(e164: string): string {
  const m = /^\+90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return m ? `+90 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : e164;
}

/** W176: the partner line is `settings.partnershipsPhone`; while it is `null` the main line is
 *  the fallback, so the page never renders a Call CTA without a number. */
export function partnerLineOf(settings: PartnerLineSettings): PartnerLine {
  const { partnershipsPhone } = settings;
  if (!partnershipsPhone) return { phone: settings.phone, phoneDisplay: settings.phoneDisplay };
  return { phone: partnershipsPhone, phoneDisplay: displayPhone(partnershipsPhone) };
}
