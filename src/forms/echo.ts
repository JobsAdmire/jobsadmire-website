import { CAPTCHA_FIELD, HONEYPOT_FIELD } from './types';

/** Keys the shell adds, and React's progressive-enhancement fields — never form data. */
export const isInternalKey = (key: string) =>
  key === HONEYPOT_FIELD || key === CAPTCHA_FIELD || key.startsWith('$ACTION');

const MAX_ECHO = 5000;

/** The typed string values, echoed back so a failed submit never empties the form and the
 *  fallback panel can prefill WhatsApp. Files and internal keys are never echoed; the consent
 *  tick is (`'on'`), so the checkbox survives a field error on another input. Client-safe: the
 *  action echoes on the server, `guardAction` in the browser when the action itself rejects. */
export function echoValues(data: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of data.entries()) {
    if (isInternalKey(key) || typeof value !== 'string') continue;
    if (!(key in out)) out[key] = value.slice(0, MAX_ECHO);
  }
  return out;
}
