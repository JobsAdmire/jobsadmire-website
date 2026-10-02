import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Locale } from '@/i18n/routing';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';

const raw = new Map<Locale, Bundle>();

/** The committed LOCAL bundle of one locale, parsed through the contract (R13) — read from disk,
 *  never imported (`src/content/local/*` imports are a D23 lint error inside `src/**`).
 *  `collections` merges over the bundle's own: the v1.1 register rows Phase A does not carry. */
export function localBundle(locale: Locale, collections: Bundle['collections'] = {}): Bundle {
  let bundle = raw.get(locale);
  if (!bundle) {
    const path = join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`);
    bundle = JSON.parse(readFileSync(path, 'utf8')) as Bundle;
    raw.set(locale, bundle);
  }
  return BundleSchema.parse({ ...bundle, collections: { ...bundle.collections, ...collections } });
}
