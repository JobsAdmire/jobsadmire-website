import type { Bundle } from '../../../../../../contract/website-bundle.v1';

// The gates of the REAL pool feed (v1.1 cards task). Until it exists the page renders the
// design's sample (`./sample-pool.ts`) under the sample tag and reads none of these; they keep
// D2 (cards off) and D23 (no `pool` rows from LOCAL in production) pinned for the day it lands.

/** D2: per-profile cards are OFF at launch. Turning them on is the v1.1 cards task (partner
 *  notice + consent + DPIA), never a content edit — hence code, not a bundle setting. */
export const POOL_CARDS = false as const;

/** The raw `pool` rows. `CollectionSchemas` has no `pool` entry (accepted page-local for Phase A
 *  in the reconcile list: the collection is FIXTURE_ONLY and empty in production); the v1.1
 *  cards task adds the schema and this becomes `getCollection(bundle, 'pool')`. */
export function poolRows(bundle: Bundle): Record<string, unknown>[] {
  return bundle.collections.pool ?? [];
}

/** True only when the bundle carries pool rows — impossible under LOCAL in production
 *  (`assertServableInProduction`, D23, throws before any page renders; Vercel previews run
 *  with NODE_ENV=production too). */
export function poolSigned(bundle: Bundle): boolean {
  return poolRows(bundle).length > 0;
}

/** Real profile cards render only with rows AND the D2 switch. Always false until v1.1. */
export function cardsVisible(bundle: Bundle): boolean {
  return POOL_CARDS && poolSigned(bundle);
}
