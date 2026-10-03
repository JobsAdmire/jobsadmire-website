import { describe, expect, it } from 'vitest';
import { composePhone, normalisePhone } from '../phone';

describe('composePhone (request form: dial select + national number)', () => {
  it('concatenates dial + digits, dropping a trunk 0 and formatting noise', () => {
    expect(composePhone('+90', '0532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '(532) 000-00-00')).toBe('+905320000000');
    expect(composePhone('+92', '300 1234567')).toBe('+923001234567');
  });
  it('trusts a full international number the visitor typed (never doubles or swaps the dial)', () => {
    expect(composePhone('+90', '+90 532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '0090 532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '+49 151 2345678')).toBe('+491512345678');
  });
  it('keeps a bare digit string when the dial is empty, and returns "" for no digits', () => {
    expect(composePhone('', '5320000000')).toBe('5320000000');
    expect(composePhone('+90', 'abc')).toBe('');
  });
});

describe('normalisePhone (quick-quote: one free-text field, no dial)', () => {
  it('keeps an international number, strips noise', () => {
    expect(normalisePhone('+90 532 000 00 00')).toBe('+905320000000');
    expect(normalisePhone('0090 532 000 00 00')).toBe('+905320000000');
  });
  it('treats an 11-digit 0-led number as Turkish national (the card serves employers in Türkiye)', () => {
    expect(normalisePhone('0532 000 00 00')).toBe('+905320000000');
  });
  it('leaves anything else as digits only, so the door decides (≥ 8 digits rule)', () => {
    expect(normalisePhone('532 000 00 00')).toBe('5320000000');
    expect(normalisePhone('abc')).toBe('');
  });
});
