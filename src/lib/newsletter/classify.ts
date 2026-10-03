import {
  CONFIRM_OUTCOMES,
  UNSUBSCRIBE_OUTCOMES,
  type NewsletterDoorOutcome,
  type NewsletterForwardKind,
  type NewsletterForwardResult,
} from './types';

/** The door's `NewsletterTokenQueryDto` takes 16–200 characters. Confirm tokens are 32 base64url
 *  characters, unsubscribe tokens `<subscriberId>.<hmac>` — URL-safe characters only, so
 *  anything else is refused here and never leaves the site. */
const TOKEN_RE = /^[A-Za-z0-9._~-]{16,200}$/;

export function isPlausibleToken(value: unknown): value is string {
  return typeof value === 'string' && TOKEN_RE.test(value);
}

function isOutcomeOf(kind: NewsletterForwardKind, value: unknown): value is NewsletterDoorOutcome {
  const allowed: readonly string[] = kind === 'confirm' ? CONFIRM_OUTCOMES : UNSUBSCRIBE_OUTCOMES;
  return typeof value === 'string' && allowed.includes(value);
}

/** HTTP status + parsed body → result. A 200 that is not the door's JSON (a proxy page, a login
 *  wall) is an outage (R28); an answer is never retried (W74). */
export function classifyNewsletterResponse(
  kind: NewsletterForwardKind,
  status: number,
  body: unknown,
): NewsletterForwardResult {
  if (status === 200) {
    const outcome = (body as { data?: { outcome?: unknown } } | null)?.data?.outcome;
    return isOutcomeOf(kind, outcome)
      ? { kind: 'ok', outcome }
      : { kind: 'unavailable', cause: 'server' };
  }
  if (status === 400) return { kind: 'invalid' };
  if (status === 410) return { kind: 'expired' };
  if (status === 401) return { kind: 'unauthorized' };
  if (status === 404) return { kind: 'off' };
  return { kind: 'unavailable', cause: 'server' };
}

/** RFC 8058 §3.1: the one-click POST carries the key/value pair `List-Unsubscribe=One-Click`
 *  (as `multipart/form-data` or `application/x-www-form-urlencoded`). */
export function isOneClickValue(value: FormDataEntryValue | null): boolean {
  return value === 'One-Click';
}
