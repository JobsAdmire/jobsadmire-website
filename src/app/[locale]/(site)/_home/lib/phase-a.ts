import { getCollection, type Founder } from '@/content/collections';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * W86: the signing founder, only once the owner has published the row (§10 row 3 — published
 * 2026-10-05: Haris Jiva, `/team/haris-jiva.jpg`). The homepage's other data-gated blocks (the
 * case bar, the candidate pool) no longer read the FIXTURE_ONLY `stories` / `pool` /
 * `representatives` collections: since the owner's 2026-10-05 ruling they show the design's
 * sample content from page-local constants (`./samples.ts`) with the `SampleTag` (D23).
 */
export function publishedFounder(bundle: Bundle): Founder | null {
  return getCollection(bundle, 'founder').find((row) => row.published) ?? null;
}
