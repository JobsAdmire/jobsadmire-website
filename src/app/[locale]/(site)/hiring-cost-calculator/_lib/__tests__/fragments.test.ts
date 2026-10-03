import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { joinText, sp } from '../fragments';

// R56: the generated bundles are read from disk, never imported.
const strings = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  ).strings;
const TR = strings('tr');
const EN = strings('en');

describe('sp — the gap between two trimmed package fragments', () => {
  it('is one space between two words and nothing when a side is empty', () => {
    expect(sp('Can you hire', '1')).toBe(' ');
    expect(sp('', '1')).toBe('');
    expect(sp('1', '')).toBe('');
  });
  it('glues closing punctuation and apostrophe suffixes', () => {
    expect(sp('1', EN['calc.042'])).toBe(''); // "?"
    expect(sp(EN['calc.155'], EN['calc.156'])).toBe(''); // ", not per company …"
    expect(sp(TR['calc.408'], TR['calc.113'])).toBe(''); // "'e çıkar." (QA W221 calc-02)
    expect(sp('64.988 ₺ / ay', TR['calc.039'])).toBe(''); // "."
  });
  it('glues the Turkish suffix fragments the package splits off a highlighted word', () => {
    expect(sp(TR['calc.130'], TR['calc.131'])).toBe(''); // "üç katından fazlası" + "dır — …" (calc.131 override, W190)
    expect(sp(TR['calc.244'], TR['calc.245'])).toBe(''); // "birebir aynı" + "dır. …"
    expect(sp(TR['calc.342'], TR['calc.343'])).toBe(''); // "Devletin öde" + "mediği"
    expect(sp(TR['calc.343'], TR['calc.344'])).toBe(' '); // "mediği" + "şeyler"
  });
  it('keeps the space before ordinary Turkish words that start lower-case', () => {
    expect(sp('1', TR['calc.149'])).toBe(' '); // "işçi seçtiniz."
    expect(sp(TR['calc.155'], TR['calc.156'])).toBe(' '); // "sayılır, …"
    expect(sp(TR['calc.158'], TR['calc.159'])).toBe(' '); // "itibarıyla sayılır …"
    expect(sp('12.700 ₺', TR['calc.340'])).toBe(' '); // "düşer."
    expect(sp(EN['calc.130'], EN['calc.131'])).toBe(' '); // "what doing it legally …"
  });
});

describe('joinText', () => {
  it('rebuilds the design sentences from the real bundle, empty TR fragments skipped', () => {
    expect(joinText([EN['calc.041'], '1', EN['calc.042']])).toBe('Can you hire 1?');
    expect(joinText([TR['calc.041'], '1', TR['calc.042']])).toBe('1 işçi alabilir misiniz?');
    expect(joinText([EN['calc.112'], EN['calc.408'], EN['calc.113']])).toMatch(
      /it doubles to ₺205,008 per worker\.$/,
    );
    expect(joinText([TR['calc.112'], TR['calc.408'], TR['calc.113']])).toMatch(
      /işçi başına ₺205\.008'e çıkar\.$/,
    );
    // The package's own TR pair glues to the design's rendered text, typo included (calc.130 ends
    // "fazlası", calc.131 starts "ıdır") — a WP-C copy item, never patched here.
    expect(joinText([TR['calc.130'], TR['calc.131']])).toMatch(/^üç katından fazlasıdır — /);
    // calc.483 override (QA W220 calc-01): the package's "aylk" reads "aylık" in the FAQ answer
    expect(TR['calc.483']).toMatch(/aylık fark küçüktür\.$/);
    expect(joinText([TR['calc.154'], TR['calc.155'], TR['calc.156']])).toMatch(
      /^İşyeri bazında sayılır, şirket bazında değil/,
    );
    expect(joinText([EN['calc.154'], EN['calc.155'], EN['calc.156']])).toMatch(
      /^Counted per branch, not per company/,
    );
  });
});
