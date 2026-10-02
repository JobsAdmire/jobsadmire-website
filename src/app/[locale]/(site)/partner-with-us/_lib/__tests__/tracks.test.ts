import { describe, expect, it } from 'vitest';
import { PARAM_ENUMS } from '@/analytics/track';
import {
  DEFAULT_TRACK,
  FORM_ANCHOR,
  FORM_ID_SCOPE,
  FORM_KEY_BY_TRACK,
  PARTNER_TRACKS,
  TRACK_KEYS,
  isPartnerTrack,
  trackFromHash,
  trackHash,
} from '../tracks';

describe('tracks', () => {
  it('are the three design cards, HR first and default; the partner tracks equal the W16/W26 enum', () => {
    expect(TRACK_KEYS).toEqual(['hr', 'sourcing', 'institute']);
    expect(DEFAULT_TRACK).toBe('hr');
    expect([...PARTNER_TRACKS]).toEqual([...PARAM_ENUMS.track]);
    expect(TRACK_KEYS.filter(isPartnerTrack)).toEqual(['sourcing', 'institute']);
  });

  it('post to hire (the HR agency, W3) or partner (sourcing, institute, W16)', () => {
    expect(FORM_KEY_BY_TRACK).toEqual({ hr: 'hire', sourcing: 'partner', institute: 'partner' });
  });

  it('keep the design form anchors and give every shell its own id scope (W79)', () => {
    expect(FORM_ANCHOR).toEqual({
      hr: 'apply-hr',
      sourcing: 'apply-agent',
      institute: 'apply-inst',
    });
    expect(FORM_ID_SCOPE).toEqual({
      hr: 'partner-hr',
      sourcing: 'partner-sourcing',
      institute: 'partner-institute',
    });
    expect(new Set(Object.values(FORM_ID_SCOPE)).size).toBe(3);
  });

  it('write and read #track-<key> and nothing else', () => {
    for (const key of TRACK_KEYS) {
      expect(trackHash(key)).toBe(`#track-${key}`);
      expect(trackFromHash(trackHash(key))).toBe(key);
    }
    for (const hash of [
      '',
      '#',
      '#tracks',
      '#track-',
      '#track-admin',
      '#track-HR',
      '#apply-hr',
      'track-hr',
    ])
      expect(trackFromHash(hash), hash).toBeNull();
  });
});
