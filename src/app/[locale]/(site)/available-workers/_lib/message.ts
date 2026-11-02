import { CANDIDATE_REF_RE } from '../../../../../../contract/candidates-feed.v1';
import { FIELD_MAX } from './options';

/** The door's `message` cap on the `workers` catalog entry. */
export const MESSAGE_MAX = FIELD_MAX.message;
/** A public candidate reference: opaque, ≤ 32 characters, no whitespace or comma — the design's
 *  `JA-1042` and the feed's refs alike (contract `candidates.v1`, `CANDIDATE_REF_RE`). */
export const PROFILE_REF_PATTERN = CANDIDATE_REF_RE;
/** At most this many refs ride one request (a basket bigger than that is not a real pick). */
export const MAX_PROFILE_REFS = 50;
/** Not visitor copy: the line the sales team reads in the Operations inbox preview. */
export const PROFILE_REFS_PREFIX = 'Profiles: ';

/** Basket refs as one string (`JA-1042, C7K2M9QX`) → de-duplicated, order kept, case kept (a
 *  ref is opaque), at most `MAX_PROFILE_REFS`; anything that is not reference-shaped is dropped.
 *  The hidden input is filled by the cards, so a word that merely looks like a ref only reaches
 *  the inbox when the visitor edited the page — it travels inside their own message anyway. */
export function parseProfileRefs(raw: string | undefined): string[] {
  if (!raw) return [];
  const out: string[] = [];
  for (const part of raw.split(/[,\s;]+/)) {
    const ref = part.trim();
    if (PROFILE_REF_PATTERN.test(ref) && !out.includes(ref)) out.push(ref);
    if (out.length === MAX_PROFILE_REFS) break;
  }
  return out;
}

/** The `workers` catalog has no field for basket references (v1.0 + v1.1), so the request card's
 *  basket (the hidden `profileRefs` input the sample cards' "Add to request" fills) folds into
 *  `message` as its first line. Under `POOL_SOURCE=OPS` the refs are real candidates' (the
 *  sales team looks them up in the portal); with the sample on they are the design's sample
 *  profiles (`sample-pool.ts`), read as "which kinds of profile caught the visitor's eye". Returns '' when there is neither text nor a ref
 *  (the caller then omits the field); never longer than the door's cap. */
export function composeWorkersMessage(message: string | undefined, profileRefs?: string): string {
  const body = (message ?? '').trim();
  const refs = parseProfileRefs(profileRefs);
  const head = refs.length ? `${PROFILE_REFS_PREFIX}${refs.join(', ')}` : '';
  const text = head && body ? `${head}\n\n${body}` : head || body;
  return text.length > MESSAGE_MAX ? text.slice(0, MESSAGE_MAX) : text;
}
