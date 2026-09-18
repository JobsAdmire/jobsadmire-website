// Runtime-agnostic content helpers: no `server-only`, so tests and (later) client-safe
// callers can use them. Server-only loading lives in ./adapter.
import type { Bundle } from '../../contract/website-bundle.v1';
import { FIXTURE_ONLY_COLLECTIONS, type ContentSource } from './config';

export class BundleUnavailableError extends Error {}

export function assertServableInProduction(
  bundle: Bundle,
  source: ContentSource,
  env = process.env.NODE_ENV,
) {
  if (env !== 'production' || source === 'OPS') return;
  const offending = FIXTURE_ONLY_COLLECTIONS.filter(
    (k) => (bundle.collections[k]?.length ?? 0) > 0,
  );
  if (offending.length)
    throw new Error(
      `collections ${offending.join(', ')} are never served from LOCAL in production (D23)`,
    );
}

/** Content strings by package id. Empty values are legitimate (six TR fragments) and returned as ''. */
export function makeT(bundle: Bundle) {
  return (id: string): string => {
    const v = bundle.strings[id];
    if (v === undefined) {
      if (process.env.NODE_ENV !== 'production') throw new Error(`unknown string id: ${id}`);
      return '';
    }
    return v;
  };
}
