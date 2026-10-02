import { describe, expect, it } from 'vitest';
import { formatPhoneDisplay, partnerLineOf } from '../phone';

describe('formatPhoneDisplay', () => {
  it('groups a Turkish E.164 number the way settings.phoneDisplay does', () => {
    expect(formatPhoneDisplay('+905533832549')).toBe('+90 553 383 25 49');
    expect(formatPhoneDisplay('+905011240340')).toBe('+90 501 124 03 40');
  });
  it('leaves a non-Turkish or malformed number as stored', () => {
    expect(formatPhoneDisplay('+923001234567')).toBe('+923001234567');
    expect(formatPhoneDisplay('+90553')).toBe('+90553');
  });
});

const MAIN = { phone: '+905011240340', phoneDisplay: '+90 501 124 03 40' };

describe('partnerLineOf (W176 — the same rule as the Partner page)', () => {
  it('is settings.partnershipsPhone, grouped like the main line', () => {
    expect(partnerLineOf({ ...MAIN, partnershipsPhone: '+905533832549' })).toEqual({
      phone: '+905533832549',
      phoneDisplay: '+90 553 383 25 49',
    });
  });
  it('falls back to the main line, E.164 and display, while the partner line is null', () => {
    expect(partnerLineOf({ ...MAIN, partnershipsPhone: null })).toEqual(MAIN);
  });
});
