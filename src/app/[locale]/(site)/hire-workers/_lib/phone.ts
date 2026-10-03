/** Phone composition for the two `hire` forms. The catalog keeps `phone` as typed (≥ 8 digits,
 *  ≤ 40 chars; E.164 is the Ops handler's job), but the page sends one clean value so the door's
 *  digit rule and the inbox read the same number. Pure — no copy, no collection access. */
const digitsOnly = (s: string) => s.replace(/\D/g, '');

/** Request form: the dial of the country picked in the dial select (`+90`) + the national
 *  number as typed. A number typed in full international form (`+…` or `00…`) is trusted as
 *  is — never doubled, never swapped to the selected dial. */
export function composePhone(dial: string, national: string): string {
  let n = national.trim();
  if (n.startsWith('00')) n = `+${n.slice(2)}`;
  const digits = digitsOnly(n);
  if (!digits) return '';
  if (n.startsWith('+')) return `+${digits}`;
  const dialDigits = digitsOnly(dial);
  if (!dialDigits) return digits;
  return `+${dialDigits}${digits.replace(/^0+/, '')}`;
}

/** Quick-quote: one free-text field on a card for employers in Türkiye — an 11-digit 0-led
 *  number is national; anything else is sent as digits and the door decides. */
export function normalisePhone(raw: string): string {
  let n = raw.trim();
  if (n.startsWith('00')) n = `+${n.slice(2)}`;
  const digits = digitsOnly(n);
  if (!digits) return '';
  if (n.startsWith('+')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+90${digits.slice(1)}`;
  return digits;
}
