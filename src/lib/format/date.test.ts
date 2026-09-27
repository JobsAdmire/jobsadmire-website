import { describe, expect, it } from 'vitest';
import { formatDate, formatMonth, formatReadMinutes } from './date';

describe('formatDate', () => {
  it('Turkish: day, month name, year', () => {
    expect(formatDate('2026-01-12', 'tr')).toBe('12 Ocak 2026');
  });
  it('English: day first, no comma (the design bylines)', () => {
    expect(formatDate('2026-01-12T10:00:00.000Z', 'en')).toBe('12 January 2026');
  });
  it('treats a date-only ISO string as a calendar date, never shifted by the runtime zone', () => {
    expect(formatDate('2026-12-31', 'en')).toBe('31 December 2026');
  });
  it('rejects a non-date', () => {
    expect(() => formatDate('nope', 'tr')).toThrow(RangeError);
  });
});

describe('formatMonth', () => {
  it('month + year per locale (D17 dated labels)', () => {
    expect(formatMonth('2026-01-12', 'tr')).toBe('Ocak 2026');
    expect(formatMonth('2026-01-12', 'en')).toBe('January 2026');
  });
});

describe('formatReadMinutes (sys.blocks.readMinutes ICU, W54)', () => {
  it('English', () => {
    expect(formatReadMinutes(5, 'en')).toBe('5 min read');
    expect(formatReadMinutes(1, 'en')).toBe('1 min read');
  });
  it('Turkish', () => {
    expect(formatReadMinutes(5, 'tr')).toBe('5 dk okuma');
  });
  it('never renders 0 minutes', () => {
    expect(formatReadMinutes(0.2, 'en')).toBe('1 min read');
  });
});
