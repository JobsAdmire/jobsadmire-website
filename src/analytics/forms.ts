/** The `?form=` keys D13 allows on the conversion page. One source for the page's whitelist,
 *  `ConversionPing`'s prop type and the per-session dedupe key — this module imports nothing,
 *  so neither the page nor the client component can pull the other in. */
export const FORM_KEYS = ['hire', 'contact', 'partner', 'careers', 'newsletter'] as const;
export type FormKey = (typeof FORM_KEYS)[number];

export const asFormKey = (v: string | undefined): FormKey | null =>
  FORM_KEYS.find((k) => k === v) ?? null;
