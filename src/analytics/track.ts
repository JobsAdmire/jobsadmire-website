/** W12/W26: the closed value sets for the params that would otherwise be free text. `track()`
 *  drops a value outside its set, so no page can push a typed-in string under `topic` or a
 *  made-up `placement`; pages type their values as `(typeof PARAM_ENUMS)[K][number]`. */
export const PARAM_ENUMS = {
  placement: [
    'slimbar',
    'header',
    'footer',
    'social_rail',
    'whatsapp_fab',
    'bottom_bar',
    'form_fallback',
    'page_cta',
    'office_card',
  ],
  // partner_track_select — the two Partner tracks the door accepts (W16)
  track: ['sourcing', 'institute'],
  // contact_topic — the Contact page's topic select (T0f enum)
  topic: ['hire', 'partner', 'permit', 'job', 'other'],
  // eligibility_check_complete — the Work Permit wizard maps its outcomes onto these buckets
  result: ['eligible', 'conditional', 'ineligible'],
  // verify_lookup — W6: the public register is not published in Phase A, so 'register_unavailable'
  outcome: ['verified', 'not_found', 'register_unavailable'],
} as const;
export type EnumParam = keyof typeof PARAM_ENUMS;

/** D13: every event carries an explicit parameter allowlist. Anything not listed here — a
 *  candidate reference, a typed-in name, any free text from a form — is dropped before the
 *  push, so no caller can leak an identifier into GTM by passing the wrong object. */
export const ALLOWED_PARAMS = {
  generate_lead: ['form_key', 'page', 'locale'],
  conversion: ['form_key', 'page', 'locale'],
  call_click: ['page', 'locale', 'placement'],
  whatsapp_click: ['page', 'locale', 'placement'],
  email_click: ['page', 'locale', 'placement'],
  calculator_use: ['page', 'locale', 'role', 'headcount'],
  language_switch: ['from', 'to'],
  // W26: the page events, declared once and enum-keyed (W12). Pages never extend this list —
  // a new event is a ruling, an edit here and docs/ANALYTICS.md in the same change. `slug` is
  // the opening's public URL segment (/kariyer/[slug]), never anything a visitor typed.
  partner_track_select: ['page', 'locale', 'track'],
  contact_topic: ['page', 'locale', 'topic'],
  eligibility_check_complete: ['page', 'locale', 'result'],
  career_apply_start: ['page', 'locale', 'slug'],
  verify_lookup: ['page', 'locale', 'outcome'],
} as const;
export type EventName = keyof typeof ALLOWED_PARAMS;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: EventName, params: Partial<Record<string, string | number>>) {
  // `hasOwn`, not truthiness: an inherited `toString`/`constructor` must not pass for an event.
  if (!Object.hasOwn(ALLOWED_PARAMS, event))
    throw new Error(`unknown analytics event: ${String(event)}`);
  const clean: Record<string, unknown> = { event };
  for (const k of ALLOWED_PARAMS[event]) {
    // Scalars only. An object, an array or a null under an allow-listed key is a caller
    // passing the raw form state, which is exactly what D13 forbids from reaching GTM.
    const v = params[k];
    if (typeof v !== 'string' && typeof v !== 'number') continue;
    // An enum-keyed param outside its set is free text by definition — dropped, not pushed.
    if (
      Object.hasOwn(PARAM_ENUMS, k) &&
      !(PARAM_ENUMS[k as EnumParam] as readonly string[]).includes(String(v))
    )
      continue;
    clean[k] = v;
  }
  (window.dataLayer ??= []).push(clean);
}
