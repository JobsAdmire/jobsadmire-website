import { timingSafeEqual } from 'node:crypto';

/** A secret shorter than this is a placeholder, not a secret: the route refuses to open. */
export const MIN_SECRET_LENGTH = 16;
export const MAX_TAGS = 50;
const TAG = /^[a-z0-9:_-]+$/;
const BEARER = /^Bearer[ ]+(.+)$/i; // the HTTP auth scheme is case-insensitive (RFC 7235)

export type AuthOutcome = 'ok' | 'unauthorized' | 'disabled';

/** Pure so the status matrix is unit-testable without a request. Never returns, logs or
 *  echoes the secret — the caller only learns which of the three doors it hit. */
export function authorize(header: string | null, secret: string | undefined): AuthOutcome {
  if (!secret || secret.length < MIN_SECRET_LENGTH) return 'disabled';
  const token = BEARER.exec(header ?? '')?.[1];
  if (token === undefined) return 'unauthorized';
  const given = Buffer.from(token, 'utf8');
  const expected = Buffer.from(secret, 'utf8');
  // `timingSafeEqual` throws on unequal lengths, and a length mismatch already rules the
  // token out — comparing is pointless, so it is a plain 401 without calling it.
  if (given.length !== expected.length) return 'unauthorized';
  return timingSafeEqual(given, expected) ? 'ok' : 'unauthorized';
}

/** `{ tags: string[] }`, 1–50 entries, each `/^[a-z0-9:_-]+$/`. All-or-nothing: one bad tag
 *  returns null and nothing is revalidated, so a caller never gets a partial purge. */
export function parseTags(body: unknown): string[] | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null;
  const { tags } = body as { tags?: unknown };
  if (!Array.isArray(tags) || tags.length < 1 || tags.length > MAX_TAGS) return null;
  if (!tags.every((t): t is string => typeof t === 'string' && TAG.test(t))) return null;
  return tags;
}
