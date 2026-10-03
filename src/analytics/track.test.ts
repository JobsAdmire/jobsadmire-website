import { beforeEach, describe, expect, it } from 'vitest';
import { ALLOWED_PARAMS, PARAM_ENUMS, track } from './track';

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
  it('declares the W12 page events once, enum-keyed (W26) — pages never extend the allowlist', () => {
    expect(Object.keys(ALLOWED_PARAMS)).toEqual([
      'generate_lead',
      'conversion',
      'call_click',
      'whatsapp_click',
      'email_click',
      'calculator_use',
      'language_switch',
      'partner_track_select',
      'contact_topic',
      'eligibility_check_complete',
      'career_apply_start',
      'verify_lookup',
    ]);
    expect(ALLOWED_PARAMS.partner_track_select).toEqual(['page', 'locale', 'track']);
    expect(ALLOWED_PARAMS.contact_topic).toEqual(['page', 'locale', 'topic']);
    expect(ALLOWED_PARAMS.eligibility_check_complete).toEqual(['page', 'locale', 'result']);
    expect(ALLOWED_PARAMS.career_apply_start).toEqual(['page', 'locale', 'slug']);
    expect(ALLOWED_PARAMS.verify_lookup).toEqual(['page', 'locale', 'outcome']);
    expect(PARAM_ENUMS).toEqual({
      placement: [
        'slimbar',
        'header',
        'footer',
        'social_rail',
        'whatsapp_fab',
        'bottom_bar',
        'form_fallback',
        'page_cta',
        'office_card',
      ],
      track: ['sourcing', 'institute'],
      topic: ['hire', 'partner', 'permit', 'job', 'other'],
      result: ['eligible', 'conditional', 'ineligible'],
      outcome: ['verified', 'not_found', 'register_unavailable'],
    });
  });
  it('drops an enum-keyed value outside its set — free text can never ride under topic/placement', () => {
    track('contact_topic', { page: '/iletisim', locale: 'tr', topic: 'hire' });
    track('contact_topic', { page: '/iletisim', locale: 'tr', topic: 'Ahmet Yılmaz, +90 5…' });
    track('call_click', { page: '/', locale: 'tr', placement: 'hero-banner' });
    track('verify_lookup', {
      page: '/temsilci-dogrulama',
      locale: 'tr',
      outcome: 'register_unavailable',
    });
    expect((window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer).toEqual([
      { event: 'contact_topic', page: '/iletisim', locale: 'tr', topic: 'hire' },
      { event: 'contact_topic', page: '/iletisim', locale: 'tr' },
      { event: 'call_click', page: '/', locale: 'tr' },
      {
        event: 'verify_lookup',
        page: '/temsilci-dogrulama',
        locale: 'tr',
        outcome: 'register_unavailable',
      },
    ]);
  });
});
