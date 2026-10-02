import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { getCollection } from '@/content/collections';
import { countryOptions } from '../country-options';

const load = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );

describe('countryOptions (W3/W25)', () => {
  it('lists the source countries first in their own order, then the rest by locale name, each code once', () => {
    const source = [
      { code: 'PK', name: 'Pakistan' },
      { code: 'NP', name: 'Nepal' },
    ];
    const general = [
      { code: 'TR', name: 'Türkiye' },
      { code: 'PK', name: 'Pakistan' }, // also a source country — listed once, in the head
      { code: 'DK', name: 'Danimarka' },
      { code: 'CN', name: 'Çin' },
      { code: 'DZ', name: 'Cezayir' },
    ];
    expect(countryOptions(source, general, 'tr')).toEqual([
      { value: 'PK', label: 'Pakistan' },
      { value: 'NP', label: 'Nepal' },
      { value: 'DZ', label: 'Cezayir' },
      { value: 'CN', label: 'Çin' },
      { value: 'DK', label: 'Danimarka' },
      { value: 'TR', label: 'Türkiye' },
    ]);
  });

  it('sorts with the Turkish collation on TR (I before İ) and the English one on EN', () => {
    const rows = [
      { code: 'GB', name: 'İngiltere' },
      { code: 'IQ', name: 'Irak' },
      { code: 'IR', name: 'İran' },
    ];
    expect(countryOptions([], rows, 'tr').map((o) => o.label)).toEqual([
      'Irak',
      'İngiltere',
      'İran',
    ]);
    expect(countryOptions([], rows, 'en').map((o) => o.label)).toEqual([
      'İngiltere',
      'Irak',
      'İran',
    ]);
  });

  it('covers the 64 countries of the real bundles, the 13 source countries first, ISO-2 values', () => {
    for (const locale of ['tr', 'en'] as const) {
      const bundle = load(locale);
      const source = getCollection(bundle, 'sourceCountries');
      const options = countryOptions(source, getCollection(bundle, 'countries'), locale);
      expect(options).toHaveLength(64);
      expect(options.slice(0, 13).map((o) => o.value)).toEqual(source.map((c) => c.code));
      expect(options[0]).toEqual({ value: 'PK', label: 'Pakistan' });
      expect(new Set(options.map((o) => o.value)).size).toBe(64);
      for (const o of options) expect(o.value).toMatch(/^[A-Z]{2}$/);
      expect(options.some((o) => o.value === 'TR')).toBe(true);
    }
  });
});
