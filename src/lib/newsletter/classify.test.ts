import { describe, expect, it } from 'vitest';
import { classifyNewsletterResponse, isOneClickValue, isPlausibleToken } from './classify';

describe('isPlausibleToken', () => {
  it('accepts the door DTO range (16–200 URL-safe characters) and nothing else', () => {
    expect(isPlausibleToken('abcdefghijklmnop')).toBe(true); // 16
    expect(isPlausibleToken('Xk3_9-aQ2bZ8rT0yUu5wVv7sPp1oNn4m')).toBe(true); // a confirm token
    expect(isPlausibleToken('cmfz1abc0000123456.QmFzZTY0dXJsX3NpZ25hdHVyZQ')).toBe(true); // <id>.<hmac>
    expect(isPlausibleToken('short')).toBe(false);
    expect(isPlausibleToken('a'.repeat(201))).toBe(false);
    expect(isPlausibleToken('has space in it 1234')).toBe(false);
    expect(isPlausibleToken('abc%2Fdef0123456789')).toBe(false);
    expect(isPlausibleToken(null)).toBe(false);
    expect(isPlausibleToken(undefined)).toBe(false);
    expect(isPlausibleToken(['a'.repeat(20)])).toBe(false);
  });
});

describe('classifyNewsletterResponse', () => {
  it('maps a 200 carrying an outcome of that route', () => {
    expect(classifyNewsletterResponse('confirm', 200, { data: { outcome: 'CONFIRMED' } })).toEqual({
      kind: 'ok',
      outcome: 'CONFIRMED',
    });
    expect(
      classifyNewsletterResponse('confirm', 200, { data: { outcome: 'ALREADY_CONFIRMED' } }),
    ).toEqual({ kind: 'ok', outcome: 'ALREADY_CONFIRMED' });
    expect(
      classifyNewsletterResponse('unsubscribe', 200, { data: { outcome: 'UNKNOWN' } }),
    ).toEqual({ kind: 'ok', outcome: 'UNKNOWN' });
  });

  it("treats the other route's outcome or an unreadable 200 as an outage (R28)", () => {
    expect(
      classifyNewsletterResponse('confirm', 200, { data: { outcome: 'UNSUBSCRIBED' } }),
    ).toEqual({ kind: 'unavailable', cause: 'server' });
    expect(classifyNewsletterResponse('confirm', 200, null)).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
    expect(classifyNewsletterResponse('unsubscribe', 200, '<html>')).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
  });

  it('maps the door statuses', () => {
    expect(
      classifyNewsletterResponse('confirm', 400, { code: 'NEWSLETTER_TOKEN_INVALID' }),
    ).toEqual({ kind: 'invalid' });
    expect(
      classifyNewsletterResponse('confirm', 410, { code: 'NEWSLETTER_TOKEN_EXPIRED' }),
    ).toEqual({ kind: 'expired' });
    expect(classifyNewsletterResponse('unsubscribe', 401, {})).toEqual({ kind: 'unauthorized' });
    expect(classifyNewsletterResponse('unsubscribe', 404, null)).toEqual({ kind: 'off' });
    expect(classifyNewsletterResponse('unsubscribe', 429, {})).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
    expect(classifyNewsletterResponse('unsubscribe', 503, {})).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
  });
});

describe('isOneClickValue (RFC 8058 §3.1)', () => {
  it('is true only for the literal One-Click value', () => {
    expect(isOneClickValue('One-Click')).toBe(true);
    expect(isOneClickValue('one-click')).toBe(false);
    expect(isOneClickValue('')).toBe(false);
    expect(isOneClickValue(null)).toBe(false);
  });
});
