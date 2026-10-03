import { getCollection, type Founder } from '@/content/collections';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * W6/D2/D23: the homepage sections that need live data render nothing until their collection has
 * rows — these are the switches the sections read (nothing is deleted). `stories`, `pool` and
 * `representatives` are FIXTURE_ONLY (`src/content/config.ts`: never served from LOCAL in
 * production), so under LOCAL they are always empty; in Phase B the OPS bundle fills them. They
 * have no schema in `collections.ts` (accepted as page-local), hence the raw rows here.
 */
export type PhaseAKey = 'stories' | 'pool' | 'representatives';

export function rawRows(bundle: Bundle, key: PhaseAKey): Record<string, unknown>[] {
  return bundle.collections[key] ?? [];
}

export function hasRows(bundle: Bundle, key: PhaseAKey): boolean {
  return rawRows(bundle, key).length > 0;
}

/** W86: the signing founder, only once the owner has published the row (§10 row 3). */
export function publishedFounder(bundle: Bundle): Founder | null {
  return getCollection(bundle, 'founder').find((row) => row.published) ?? null;
}
