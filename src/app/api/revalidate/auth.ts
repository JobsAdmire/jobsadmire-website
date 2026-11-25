import { timingSafeEqual } from 'node:crypto';

/** A secret shorter than this is a placeholder, not a secret: the route refuses to open. */
export const MIN_SECRET_LENGTH = 16;
export const MAX_TAGS = 50;
const TAG = /^[a-z0-9:_-]+$/;
const BEARER = /^Bearer[ ]+(.+)$/i; // the HTTP auth scheme is case-insensitive (RFC 7235)

export type AuthOutcome = 'ok' | 'unauthorized' | 'disabled';

/** Pure so the status matrix is unit-testable without a request. Never returns, logs or
 *  echoes a secret — the caller only learns which of the three doors it hit.
 *
 *  `secrets` are the values the route accepts: `REVALIDATE_SECRET` and the website write
 *  token `OPS_WEBSITE_WRITE_TOKEN`, which Operations already holds and presents when no
 *  revalidate secret is set (its refresh push, 2026-11-25). Unset or short ones are ignored;
 *  with none usable the route stays closed. */
export function authorize(
  header: string | null,
  secrets: string | undefined | readonly (string | undefined)[],
): AuthOutcome {
  const usable = (Array.isArray(secrets) ? secrets : [secrets]).filter(
    (s): s is string => typeof s === 'string' && s.length >= MIN_SECRET_LENGTH,
  );
  if (usable.length === 0) return 'disabled';
  const token = BEARER.exec(header ?? '')?.[1];
  if (token === undefined) return 'unauthorized';
  const given = Buffer.from(token, 'utf8');
  // Every usable secret is compared (no early exit), so the answer time does not say which
  // one matched. `timingSafeEqual` throws on unequal lengths, and a length mismatch already
  // rules that secret out, so it is skipped without calling it.
  let ok = false;
  for (const secret of usable) {
    const expected = Buffer.from(secret, 'utf8');
    if (given.length === expected.length && timingSafeEqual(given, expected)) ok = true;
  }
  return ok ? 'ok' : 'unauthorized';
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
