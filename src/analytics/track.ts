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
} as const;
export type EventName = keyof typeof ALLOWED_PARAMS;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: EventName, params: Partial<Record<string, string | number>>) {
  const allowed = ALLOWED_PARAMS[event];
  if (!allowed) throw new Error(`unknown analytics event: ${String(event)}`);
  const clean: Record<string, unknown> = { event };
  for (const k of allowed) if (params[k] !== undefined) clean[k] = params[k];
  (window.dataLayer ??= []).push(clean);
}
