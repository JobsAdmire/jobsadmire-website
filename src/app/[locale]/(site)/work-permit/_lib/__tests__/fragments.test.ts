import { describe, expect, it } from 'vitest';
import { sp } from '../fragments';

describe('sp — the joiner between two package fragments the design glues together (W23)', () => {
  it('puts one space between two words, before a dash and before an opening bracket', () => {
    expect(sp('Up to 1 year', 'first, then 2-year and 3-year extensions')).toBe(' ');
    expect(sp('İŞKUR-licensed', '— Permit No. 1730, Law No. 4904')).toBe(' ');
    expect(sp('A small fixed fee for printing the permit card', '(değerli kağıt bedeli)')).toBe(
      ' ',
    );
  });
  it('puts nothing before closing punctuation (wp.118 + wp.119, wp.291 + wp.292)', () => {
    expect(sp('The employer', ", on the Ministry's online system")).toBe('');
    expect(
      sp('(değerli kağıt bedeli)', '. If the worker is abroad, the consular visa fee is added.'),
    ).toBe('');
  });
  it('puts nothing next to an empty fragment or existing whitespace', () => {
    expect(sp('', 'x')).toBe('');
    expect(sp('x', '')).toBe('');
    expect(sp('a ', 'b')).toBe('');
  });
});
