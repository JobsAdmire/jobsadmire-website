import { beforeEach, describe, expect, it } from 'vitest';
import { track } from './track';

describe('track (D13 parameter allowlist)', () => {
  beforeEach(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });
  it('pushes allow-listed params only — never candidate refs', () => {
    track('generate_lead', {
      form_key: 'hire',
      page: '/isci-talebi',
      locale: 'tr',
      profiles: 'JA-1042,JA-1058',
      ref: 'JA-1042',
    } as never);
    const pushed = (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer[0];
    expect(pushed).toEqual({
      event: 'generate_lead',
      form_key: 'hire',
      page: '/isci-talebi',
      locale: 'tr',
    });
  });
  it('drops params that are not scalars — a raw form object can never reach GTM', () => {
    track('generate_lead', {
      form_key: 'hire',
      page: ['/isci-talebi'],
      locale: null,
      profiles: { ref: 'JA-1042' },
    } as never);
    expect((window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer[0]).toEqual({
      event: 'generate_lead',
      form_key: 'hire',
    });
  });
  it('rejects unknown events at the type level and at runtime', () => {
    expect(() => track('profile_select' as never, {})).toThrow(/unknown analytics event/);
    // inherited keys are not events either
    expect(() => track('toString' as never, {})).toThrow(/unknown analytics event/);
  });
});
