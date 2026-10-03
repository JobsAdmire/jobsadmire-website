import { describe, expect, it } from 'vitest';
import { NEWSLETTER_STATES, resultState, stateCopyKey } from './copy';

const COMMON = [
  'noToken',
  { kind: 'invalid' },
  { kind: 'expired' },
  { kind: 'off' },
  { kind: 'unauthorized' },
  { kind: 'unconfigured' },
  { kind: 'unavailable', cause: 'network' },
] as const;
const OK = {
  confirm: [
    { kind: 'ok', outcome: 'CONFIRMED' },
    { kind: 'ok', outcome: 'ALREADY_CONFIRMED' },
  ],
  unsubscribe: [
    { kind: 'ok', outcome: 'UNSUBSCRIBED' },
    { kind: 'ok', outcome: 'ALREADY_UNSUBSCRIBED' },
    { kind: 'ok', outcome: 'UNKNOWN' },
  ],
} as const;

describe('resultState (I12: 400/410/UNKNOWN/unreachable add the manual fallback)', () => {
  it('maps every result to the state the page shows', () => {
    expect(resultState('confirm', 'noToken')).toEqual({ state: 'noToken', fallback: true });
    expect(resultState('confirm', { kind: 'ok', outcome: 'CONFIRMED' })).toEqual({
      state: 'CONFIRMED',
      fallback: false,
    });
    expect(resultState('unsubscribe', { kind: 'ok', outcome: 'UNSUBSCRIBED' })).toEqual({
      state: 'UNSUBSCRIBED',
      fallback: false,
    });
    expect(resultState('unsubscribe', { kind: 'ok', outcome: 'UNKNOWN' })).toEqual({
      state: 'UNKNOWN',
      fallback: true,
    });
    expect(resultState('confirm', { kind: 'invalid' })).toEqual({
      state: 'invalid',
      fallback: true,
    });
    expect(resultState('confirm', { kind: 'expired' })).toEqual({
      state: 'expired',
      fallback: true,
    });
    // Only the confirm door answers 410; a stray one on unsubscribe reads as a bad link.
    expect(resultState('unsubscribe', { kind: 'expired' })).toEqual({
      state: 'invalid',
      fallback: true,
    });
    for (const result of [
      { kind: 'off' },
      { kind: 'unauthorized' },
      { kind: 'unconfigured' },
      { kind: 'unavailable', cause: 'timeout' },
    ] as const)
      expect(resultState('unsubscribe', result)).toEqual({ state: 'unavailable', fallback: true });
  });

  it('every state a result can reach has copy on its page', () => {
    for (const kind of ['confirm', 'unsubscribe'] as const)
      for (const result of [...COMMON, ...OK[kind]])
        expect(NEWSLETTER_STATES[kind]).toContain(resultState(kind, result).state);
  });
});

describe('stateCopyKey', () => {
  it('names the sys.newsletter block of each state', () => {
    expect(stateCopyKey('confirm', 'noToken')).toBe('newsletter.noToken');
    expect(stateCopyKey('unsubscribe', 'unavailable')).toBe('newsletter.unavailable');
    expect(stateCopyKey('confirm', 'invalid')).toBe('newsletter.confirm.invalid');
    expect(stateCopyKey('unsubscribe', 'invalid')).toBe('newsletter.unsubscribe.invalid');
    expect(stateCopyKey('confirm', 'expired')).toBe('newsletter.confirm.expired');
    expect(stateCopyKey('confirm', 'CONFIRMED')).toBe('newsletter.confirm.outcome.CONFIRMED');
    expect(stateCopyKey('unsubscribe', 'UNKNOWN')).toBe('newsletter.unsubscribe.outcome.UNKNOWN');
  });
});
