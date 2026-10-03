import { describe, expect, it } from 'vitest';
import { clampWords, OG_WORDMARK, ogSubline, ogTitle, type SysCopy } from './og';
import fixture from '../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema } from '../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. The golden fixture carries one page record (`home` →
// home.017/home.018) and both of those strings, which is every package id the OG copy reads.
const bundle = BundleSchema.parse(fixture);

/** A `sys` stub over a flat key → value map: `has` is membership, `t` returns the value. */
const sysOf = (messages: Record<string, string>): SysCopy => ({
  t: (key) => messages[key] ?? `MISSING:${key}`,
  has: (key) => key in messages,
});
const sys = sysOf({
  'seo.ogTagline': 'Lisanslı iş gücü temini — uçtan uca.',
  'seo.calc.title': 'İşçi maliyeti hesaplayıcı',
});

describe('ogTitle', () => {
  it('reads the page record when the package has an SEO string', () => {
    expect(ogTitle(bundle, 'home', sys)).toBe(
      'İŞKUR lisanslı · sözleşmeler kurucu imzasıyla · işçiden ücret alınmaz',
    );
  });
  it("falls back to sys.seo.<pageKey>.title when the record's titleId is '' (W38)", () => {
    const blank = {
      ...bundle,
      pages: { calc: { ...bundle.pages.home, titleId: '', descriptionId: '' } },
    };
    expect(ogTitle(blank, 'calc', sys)).toBe('İşçi maliyeti hesaplayıcı');
  });
  it('falls back to the wordmark when there is neither a record nor a sys title', () => {
    expect(ogTitle(bundle, 'hire', sys)).toBe(OG_WORDMARK);
    expect(ogTitle(bundle, 'calc', sysOf({}))).toBe(OG_WORDMARK);
  });
});

describe('ogSubline', () => {
  it("reads the record's description, else the site tagline — never home.188 (W38)", () => {
    expect(ogSubline(bundle, 'home', sys)).toBe('Nitelikli işçi.');
    expect(ogSubline(bundle, 'hire', sys)).toBe('Lisanslı iş gücü temini — uçtan uca.');
    const blank = { ...bundle, pages: { home: { ...bundle.pages.home, descriptionId: '' } } };
    expect(ogSubline(blank, 'home', sys)).toBe('Lisanslı iş gücü temini — uçtan uca.');
  });
  it('clamps a long description at a word boundary', () => {
    const long = { ...bundle, strings: { ...bundle.strings, 'home.018': 'kelime '.repeat(40) } };
    const out = ogSubline(long, 'home', sys);
    expect(out.length).toBeLessThanOrEqual(141);
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toContain('kelim…');
  });
});

describe('clampWords', () => {
  it('returns short text untouched, cuts at the last space otherwise', () => {
    expect(clampWords('short', 10)).toBe('short');
    expect(clampWords('one two three four', 10)).toBe('one two…');
    expect(clampWords('averyveryverylongsingleword next', 12)).toBe('averyveryver…');
  });
});
