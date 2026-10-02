import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { displayPhone, partnerLineOf } from '../partner-line';

const load = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );

const MAIN = { phone: '+905011240340', phoneDisplay: '+90 501 124 03 40' };

describe('partnerLineOf (W176)', () => {
  it('is settings.partnershipsPhone, grouped like the main line', () => {
    expect(partnerLineOf({ ...MAIN, partnershipsPhone: '+905533832549' })).toEqual({
      phone: '+905533832549',
      phoneDisplay: '+90 553 383 25 49',
    });
  });

  it('falls back to the main line — E.164 and display — while the partner line is null', () => {
    expect(partnerLineOf({ ...MAIN, partnershipsPhone: null })).toEqual(MAIN);
  });

  it('reads the real LOCAL bundles: settings.partnershipsPhone is null (W208), so the main line serves, in both locales', () => {
    for (const locale of ['tr', 'en'] as const) {
      const { settings } = load(locale);
      expect(settings.partnershipsPhone).toBeNull();
      expect(partnerLineOf(settings)).toEqual({
        phone: '+905011240340',
        phoneDisplay: '+90 501 124 03 40',
      });
    }
  });
});

describe('displayPhone', () => {
  it('groups a Turkish E.164 number as +90 5xx xxx xx xx — the grouping settings.phoneDisplay uses', () => {
    expect(displayPhone('+905011240340')).toBe(MAIN.phoneDisplay);
  });

  it('renders a number it cannot group exactly as stored', () => {
    expect(displayPhone('+923001234567')).toBe('+923001234567');
    expect(displayPhone('+90553')).toBe('+90553');
  });
});
