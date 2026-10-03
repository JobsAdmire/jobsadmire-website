import { describe, expect, it } from 'vitest';
import { sp } from '../fragments';

describe('sp — the joiner between two package fragments the design glues with {{ }}', () => {
  it('inserts one space between two words', () => {
    expect(sp('Hire verified overseas', 'workers')).toBe(' ');
    expect(sp("Türkiye'de", 'belgeli yabancı işçi')).toBe(' ');
  });
  it('inserts nothing before closing punctuation or after trailing whitespace', () => {
    expect(sp('470+ yerleştirme', ", Türkiye'deki işverenler")).toBe(''); // hire.191 + hire.192 (TR)
    expect(sp('hiring cost calculator', '.')).toBe(''); // hire.178 + hire.179 (EN)
    expect(sp('Vetted talent from ', '13')).toBe('');
  });
  it('inserts nothing when either side is empty (hire.141 TR is deliberately empty)', () => {
    expect(sp('', '13')).toBe('');
    expect(sp('13', '')).toBe('');
  });
});
