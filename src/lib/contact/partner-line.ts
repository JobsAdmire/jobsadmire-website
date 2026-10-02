import type { Settings } from '../../../contract/website-bundle.v1';

/** The slice of `settings` the partner line is read from. */
export type PartnerLineSettings = Pick<Settings, 'phone' | 'phoneDisplay' | 'partnershipsPhone'>;

/** The one number a page offers partners to call: E.164 for the `tel:` href, grouped for the eye. */
export type PartnerLine = { phone: string; phoneDisplay: string };

/** `settings.phoneDisplay` exists for the main line only. A Turkish E.164 number (+90 and ten
 *  digits) gets the same "+90 5xx xxx xx xx" grouping; anything else renders as stored. */
export function formatPhoneDisplay(e164: string): string {
  const m = /^\+90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return m ? `+90 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : e164;
}

/** W176/W208 — the one rule for the Contact page (Agencies card, the JSON-LD `partnerships`
 *  point) and the Partner page (every Call CTA, the closing band, the sticky bar): the partner
 *  line is `settings.partnershipsPhone`; while it is `null` the main line — E.164 and
 *  `settings.phoneDisplay` — serves, so no card, CTA or node ever loses its number. W208: the
 *  owner retired the design's separate partnerships line, so the importer writes
 *  `partnershipsPhone: null` and the official number +90 501 124 03 40 is on every line today;
 *  naming a partner line in the importer restores the design's behaviour with no code change. */
export function partnerLineOf(settings: PartnerLineSettings): PartnerLine {
  const { partnershipsPhone } = settings;
  if (!partnershipsPhone) return { phone: settings.phone, phoneDisplay: settings.phoneDisplay };
  return { phone: partnershipsPhone, phoneDisplay: formatPhoneDisplay(partnershipsPhone) };
}
