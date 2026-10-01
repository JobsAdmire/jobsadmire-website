import { describe, expect, it } from 'vitest';
import { countryName, dialForCode, dialOptions } from '../countries';

const rows = [
  { code: 'TR', name: 'Türkiye', dial: '+90' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'DE', name: 'Almanya', dial: '+49' },
  { code: 'US', name: 'Amerika Birleşik Devletleri', dial: '+1' },
];

describe('dialForCode', () => {
  it('returns the dial for a known ISO-2 code and null otherwise', () => {
    expect(dialForCode(rows, 'PK')).toBe('+92');
    expect(dialForCode(rows, 'tr')).toBe('+90'); // case-insensitive at the edge
    expect(dialForCode(rows, 'XX')).toBeNull();
    expect(dialForCode(rows, '')).toBeNull();
  });
});

describe('countryName', () => {
  it('returns the row name — the SourceMap Türkiye label is the TR row (W25/W60)', () => {
    expect(countryName(rows, 'TR')).toBe('Türkiye');
  });
  it('throws outside production for a code the collection lacks (never a silent blank label)', () => {
    expect(() => countryName(rows, 'XX')).toThrow(/XX/);
  });
});

describe('dialOptions', () => {
  it('is ISO-2 valued, "<name> <dial>" labelled and sorted by the locale collation (W3)', () => {
    expect(dialOptions(rows, 'tr')).toEqual([
      { value: 'DE', label: 'Almanya +49' },
      { value: 'US', label: 'Amerika Birleşik Devletleri +1' },
      { value: 'PK', label: 'Pakistan +92' },
      { value: 'TR', label: 'Türkiye +90' },
    ]);
  });
});
