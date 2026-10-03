import { getCollection, type CollectionRow } from '@/content/collections';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/** W86: `{ name, titleId, photoSrc, published }` — the one founder source for T1's team card,
 *  this page's band and T10's founder strip. */
export type FounderRow = CollectionRow<'founder'>;

/**
 * The founder band's only input (W6/W86, §10 row 3). The importer ships one row with
 * `published: false`, so the band renders nothing until the owner's name, title and photo
 * are confirmed and the row is published (a content edit — no code change here). The quote's
 * figure is never stored on the row: it is the `placed` metric (W1).
 */
export function publishedFounder(bundle: Bundle): FounderRow | null {
  return getCollection(bundle, 'founder').find((row) => row.published) ?? null;
}
