import { describe, expect, it, vi } from 'vitest';
import { formatInt, formatPercent, formatTRY } from './money';

describe('formatTRY', () => {
  it('Turkish: dot thousands, trailing symbol', () => {
    expect(formatTRY(38944, 'tr')).toBe('38.944 ₺');
    expect(formatTRY(33030, 'tr')).toBe('33.030 ₺');
    expect(formatTRY(1270, 'tr')).toBe('1.270 ₺');
  });
  it('English: comma thousands, leading symbol', () => {
    expect(formatTRY(38944, 'en')).toBe('₺38,944');
    expect(formatTRY(16000, 'en')).toBe('₺16,000');
  });
  it('rounds to whole lira', () => {
    expect(formatTRY(28075.5, 'tr')).toBe('28.076 ₺');
  });
});

describe('formatPercent', () => {
  it('Turkish: sign leads, comma decimal', () => {
    expect(formatPercent(21.75, 'tr')).toBe('%21,75');
    expect(formatPercent(18.75, 'tr')).toBe('%18,75');
  });
  it('English: dot decimal, sign trails', () => {
    expect(formatPercent(21.75, 'en')).toBe('21.75%');
  });
  it('keeps the requested decimals', () => {
    expect(formatPercent(20, 'tr', 0)).toBe('%20');
  });
});

describe('formatInt', () => {
  it('groups thousands per locale', () => {
    expect(formatInt(1240, 'tr')).toBe('1.240');
    expect(formatInt(1240, 'en')).toBe('1,240');
  });
});

// M16 (Task 9 P2): a fresh Intl.NumberFormat per call measured ≈366µs vs ≈6µs cached — worth
// caching since the T3 slider reformats on every drag frame.
describe('formatterFor cache (M16)', () => {
  it('builds one Intl.NumberFormat per (locale, digits), reusing it on every later call', () => {
    const Real = Intl.NumberFormat;
    const spy = vi.spyOn(Intl, 'NumberFormat').mockImplementation(function (
      ...args: ConstructorParameters<typeof Intl.NumberFormat>
    ) {
      return new Real(...args);
    } as typeof Intl.NumberFormat);
    try {
      // Digit counts nothing else in this file (or the calculator) uses, so these keys are cold
      // regardless of what any earlier test already warmed in the shared module-level cache.
      formatPercent(1, 'tr', 9);
      expect(spy).toHaveBeenCalledTimes(1);
      formatPercent(2, 'tr', 9); // same (locale, digits) — reused, not rebuilt
      formatPercent(3, 'tr', 9);
      expect(spy).toHaveBeenCalledTimes(1);
      formatPercent(4, 'en', 9); // different locale — one new formatter
      expect(spy).toHaveBeenCalledTimes(2);
      formatPercent(5, 'tr', 8); // different digit count — one new formatter
      expect(spy).toHaveBeenCalledTimes(3);
      formatPercent(6, 'tr', 8); // reused again
      expect(spy).toHaveBeenCalledTimes(3);
    } finally {
      spy.mockRestore();
    }
  });
});
