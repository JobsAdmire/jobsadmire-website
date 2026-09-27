import fixture from '../../contract/website-bundle.v1.fixture.json';
import { BundleSchema, type Bundle } from '../../contract/website-bundle.v1';

/** R13: a parsed bundle, never a cast. The golden fixture carries 20 strings and empty
 *  collections; a test adds exactly the ids and rows the component under test reads —
 *  `makeT` throws on an unknown id outside production, so a missing id fails the test, and
 *  `getCollection` throws on a row that misses T0b's schema, so a stale row fails it too. */
export function testBundle(
  overrides: {
    strings?: Record<string, string>;
    collections?: Bundle['collections'];
    settings?: Partial<Bundle['settings']>;
  } = {},
): Bundle {
  return BundleSchema.parse({
    ...fixture,
    strings: { ...fixture.strings, ...overrides.strings },
    collections: { ...fixture.collections, ...overrides.collections },
    settings: { ...fixture.settings, ...overrides.settings },
  });
}

/** The chrome ids the shared blocks read by canonical id (R15) — one place to keep them. */
export const BLOCK_STRINGS: Record<string, string> = {
  'home.192': 'Yol tarifi alın',
  'home.221': "WhatsApp'tan yazın",
  'hire.240': 'Get it on Google Play',
  'hire.241': 'Download on the App Store',
  'blog.034': 'ÖNE ÇIKAN',
  'blog.077': "Türkçe'de de var",
  'blog.081': "İngilizce'de de var",
  'blog.036': 'Ayda bir işe alım içgörüleri',
  'blog.037': 'Çalışma izni güncellemeleri — doğrudan e-postanıza.',
  'blog.038': 'Spam yok, dilediğiniz zaman çıkabilirsiniz.',
};
