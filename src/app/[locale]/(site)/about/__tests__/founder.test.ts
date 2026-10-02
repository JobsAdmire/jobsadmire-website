import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CollectionError } from '@/content/collections';
import { testBundle } from '@/test/bundle';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import { publishedFounder } from '../founder';

const ROW = { name: 'Ada Example', titleId: 'about.047', photoSrc: null, published: true };

describe('publishedFounder (W86: the founder band reads only this)', () => {
  it('is null for an empty founder collection', () => {
    expect(publishedFounder(testBundle({ collections: { founder: [] } }))).toBeNull();
  });

  it('is null while the row is unpublished (the importer ships published: false)', () => {
    const bundle = testBundle({ collections: { founder: [{ ...ROW, published: false }] } });
    expect(publishedFounder(bundle)).toBeNull();
  });

  it('returns the published row', () => {
    expect(publishedFounder(testBundle({ collections: { founder: [ROW] } }))).toEqual(ROW);
  });

  it('the committed LOCAL bundles publish no founder (§10 row 3 is pending)', () => {
    for (const locale of ['tr', 'en'] as const) {
      // The sanctioned readFileSync bypass (W40): src/** may not import src/content/local/*.
      const raw = JSON.parse(
        readFileSync(join(__dirname, `../../../../../content/local/bundle.${locale}.json`), 'utf8'),
      );
      expect(publishedFounder(BundleSchema.parse(raw)), locale).toBeNull();
    }
  });

  it('refuses a malformed row outside production instead of publishing half a claim', () => {
    const bundle = testBundle({ collections: { founder: [{ name: 'X', published: 'yes' }] } });
    expect(() => publishedFounder(bundle)).toThrow(CollectionError);
  });
});
