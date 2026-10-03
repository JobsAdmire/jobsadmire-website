import type { Bundle } from '../../../../../../contract/website-bundle.v1';

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
 *  with NODE_ENV=production too). Drives the hero's "Live from our portal" badge and the
 *  sticky bar's live dot (W6). */
export function poolSigned(bundle: Bundle): boolean {
  return poolRows(bundle).length > 0;
}

/** Copy that presupposes visible profile cards — the pool heading/intro (052/053), the employer
 *  form head (107), the sticky message (048), the FAQ's live-sample pair (210/211) — renders only
 *  when the cards themselves do: rows AND the D2 switch. Always false in this task. */
export function cardsVisible(bundle: Bundle): boolean {
  return POOL_CARDS && poolSigned(bundle);
}
