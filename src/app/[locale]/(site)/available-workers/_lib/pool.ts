import type { Bundle } from '../../../../../../contract/website-bundle.v1';

// The gates of the bundle's `pool` COLLECTION. Real candidates do not come from it: since
// 2026-11-02 (owner) they come from Operations' candidates feed (`src/content/pool-feed.ts`,
// POOL_SOURCE=OPS), and the page reads none of these. They keep D23 (no `pool` rows from LOCAL in
// production) pinned; `POOL_CARDS` stays false — the feed, not this switch, carries real cards.

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
