/** The `?form=` keys D13 allows on the conversion page. One source for the page's whitelist,
 *  `ConversionPing`'s prop type and the per-session dedupe key — this module imports nothing,
 *  so neither the page nor the client component can pull the other in.
 *
 *  R55: the full PRD §2 set, one key per handler type across the 13–15 form instances, not
 *  just the five WP1 happened to need. A WP2 form that redirects with a key nobody added here
 *  gets no conversion, no test failure and no log — so every server action types its redirect
 *  key as `FormKey`, which makes an unlisted key a compile error at the form instead. */
export const FORM_KEYS = [
  'hire',
  'contact',
  'partner',
  'careers',
  'newsletter',
  'callback',
  'visit',
  'calculator',
  'fraud',
  'workers',
] as const;
export type FormKey = (typeof FORM_KEYS)[number];

export const asFormKey = (v: string | undefined): FormKey | null =>
  FORM_KEYS.find((k) => k === v) ?? null;
