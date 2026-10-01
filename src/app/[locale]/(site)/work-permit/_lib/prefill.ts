/** The page's six WhatsApp prefills: the site-wide greeting (`sys.whatsapp.prefill`, the
 *  visitor's voice) + one of this page's tails (`sys.wp.whatsapp.*`). Authored text only — no
 *  visitor data — so these may sit in a DOM href (W95 governs the wizard's answers alone). */
export const WA_TAILS = [
  'question',
  'permitOnly',
  'permitType',
  'exemption',
  'quote',
  'renewal',
] as const;
export type WaTail = (typeof WA_TAILS)[number];

export function waPrefill(sys: (key: string) => string, tail: WaTail): string {
  return `${sys('whatsapp.prefill')}${sys(`wp.whatsapp.${tail}`)}`;
}
