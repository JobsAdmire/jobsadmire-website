import { describe, expect, it } from 'vitest';
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
