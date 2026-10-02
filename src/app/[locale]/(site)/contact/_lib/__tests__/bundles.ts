import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';

/** The committed LOCAL bundles, parsed through the contract (R13) — read from disk because
 *  `src/**` may not import `src/content/local/*` (ESLint, D23). They are what the page renders in
 *  Phase A, so the section tests assert the real copy, settings and `offices` rows. */
export function localBundle(locale: 'tr' | 'en'): Bundle {
  return BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
}
