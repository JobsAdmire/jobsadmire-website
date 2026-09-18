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
  it('rejects unknown events at the type level and at runtime', () => {
    expect(() => track('profile_select' as never, {})).toThrow(/unknown analytics event/);
  });
});
