import type { FormKey } from '@/analytics/forms';

/** The optional WhatsApp consent box (owner 2026-11-10; evidence only, 2026-11-11). Operations
 *  accepts `whatsappConsent` + `whatsappConsentVersion` on the envelope since 2026-11-10
 *  (Ops PRD §5.12 "The WhatsApp consent box"). Client-safe: the shell renders the box, the
 *  server action sends the answer. */

/** The text version of the box's sentence (≤ 40 chars on the wire). Bump it whenever
 *  `sys.form.whatsappConsent.label` changes in either language. */
export const WHATSAPP_CONSENT_VERSION = 'site-wa-v1' as const;

/** The checkbox's name (value `on` when ticked) and the hidden marker that says "the box was
 *  on this form" — so the pair is sent exactly when the box was shown, even unticked. */
export const WHATSAPP_CONSENT_FIELD = 'whatsappConsent';
export const WHATSAPP_CONSENT_SHOWN_FIELD = 'whatsappConsentShown';

/** The forms that collect a phone number for the sales / intake flow. Careers, fraud and the
 *  newsletter are deliberately absent (no box, no keys on the wire). */
const WHATSAPP_CONSENT_FORM_KEYS: ReadonlySet<FormKey> = new Set<FormKey>([
  'hire',
  'workers',
  'partner',
  'calculator',
  'callback',
  'contact',
  'visit',
]);

export const hasWhatsAppConsentBox = (key: FormKey): boolean => WHATSAPP_CONSENT_FORM_KEYS.has(key);
