/** `settings.phoneDisplay` exists for the main line only; the partnerships line
 *  (`settings.partnershipsPhone`, E.164) gets the same "+90 553 383 25 49" grouping the design
 *  shows. Turkish numbers (+90 and ten digits) only — anything else renders as stored. */
export function formatPhoneDisplay(e164: string): string {
  const m = /^\+90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return m ? `+90 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : e164;
}

/** The one number the Agencies card and the JSON-LD `partnerships` point offer. */
export type PartnerLine = { phone: string; phoneDisplay: string };

/** W176: the partner line is `settings.partnershipsPhone`; while it is `null` the main line
 *  (E.164 and `settings.phoneDisplay`) is the fallback, so the card never disappears and the
 *  JSON-LD point never loses its number. The same rule as the Partner page's `partnerLineOf`
 *  (T5): both print "+90 553 383 25 49" for the same value. */
export function partnerLineOf(settings: {
  phone: string;
  phoneDisplay: string;
  partnershipsPhone: string | null;
}): PartnerLine {
  const { partnershipsPhone } = settings;
  if (!partnershipsPhone) return { phone: settings.phone, phoneDisplay: settings.phoneDisplay };
  return { phone: partnershipsPhone, phoneDisplay: formatPhoneDisplay(partnershipsPhone) };
}
