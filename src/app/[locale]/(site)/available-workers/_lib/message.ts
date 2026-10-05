import { FIELD_MAX } from './options';

/** The door's `message` cap on the `workers` catalog entry. */
export const MESSAGE_MAX = FIELD_MAX.message;
/** A public candidate reference as the design prints it (`JA-1042`). */
export const PROFILE_REF_PATTERN = /^JA-\d{3,6}$/;
/** Not visitor copy: the line the sales team reads in the Operations inbox preview. */
export const PROFILE_REFS_PREFIX = 'Profiles: ';

/** Basket refs as one string (`ja-1042, JA-1050`) → upper-cased, de-duplicated, order kept;
 *  anything that is not a reference is dropped (the visitor's free text never rides here). */
export function parseProfileRefs(raw: string | undefined): string[] {
  if (!raw) return [];
  const out: string[] = [];
  for (const part of raw.split(/[,\s;]+/)) {
    const ref = part.trim().toUpperCase();
    if (PROFILE_REF_PATTERN.test(ref) && !out.includes(ref)) out.push(ref);
  }
  return out;
}

/** The `workers` catalog has no field for basket references (v1.0 + v1.1), so the request card's
 *  basket (the hidden `profileRefs` input the sample cards' "Add to request" fills) folds into
 *  `message` as its first line. Until the v1.1 cards task the refs are the design's sample
 *  profiles (`sample-pool.ts`): the sales team reads them as "which kinds of profile caught the
 *  visitor's eye", not as reserved candidates. Returns '' when there is neither text nor a ref
 *  (the caller then omits the field); never longer than the door's cap. */
export function composeWorkersMessage(message: string | undefined, profileRefs?: string): string {
  const body = (message ?? '').trim();
  const refs = parseProfileRefs(profileRefs);
  const head = refs.length ? `${PROFILE_REFS_PREFIX}${refs.join(', ')}` : '';
  const text = head && body ? `${head}\n\n${body}` : head || body;
  return text.length > MESSAGE_MAX ? text.slice(0, MESSAGE_MAX) : text;
}
