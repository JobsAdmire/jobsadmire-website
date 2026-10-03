import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyPublicSettings,
  assertServableInProduction,
  fill,
  makeT,
  makeTf,
  metricValues,
} from './pure';
import { contentSource } from './config';
import { BundleSchema, type Bundle } from '../../contract/website-bundle.v1';
import fixture from '../../contract/website-bundle.v1.fixture.json';

const bundle = BundleSchema.parse(fixture);

describe('makeT', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('returns the value for a known id', () => {
    expect(makeT(bundle)('home.001')).toBe(bundle.strings['home.001']);
  });
  it('returns an empty string for a deliberately empty value (no English fallback)', () => {
    expect(makeT({ ...bundle, strings: { ...bundle.strings, 'calc.041': '' } })('calc.041')).toBe(
      '',
    );
  });
  it('throws in development for an unknown id', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => makeT(bundle)('nope.001')).toThrow(/unknown string id/);
  });
  // R28: a missing id must never take a production page down — it degrades to empty copy,
  // and the build-time lint is what catches it before it ships.
  it('returns an empty string for an unknown id in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(makeT(bundle)('nope.001')).toBe('');
  });
});

describe('contentSource', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('defaults to LOCAL', () => {
    vi.stubEnv('CONTENT_SOURCE', '');
    expect(contentSource()).toBe('LOCAL');
  });
  it('is OPS only when OPS_API_URL and the read token exist', () => {
    vi.stubEnv('CONTENT_SOURCE', 'OPS');
    vi.stubEnv('OPS_API_URL', 'https://operations.jobsadmire.com');
    vi.stubEnv('OPS_WEBSITE_READ_TOKEN', 'x'.repeat(40));
    expect(contentSource()).toBe('OPS');
  });
});

describe('applyPublicSettings (R54)', () => {
  // Next's `NodeJS.ProcessEnv` requires `NODE_ENV`; nothing else is read from the process here,
  // so each case passes an isolated environment rather than mutating the real one.
  const env = (vars: Record<string, string> = {}): NodeJS.ProcessEnv => ({
    NODE_ENV: 'test',
    ...vars,
  });
  it('leaves the bundle untouched when no public ids are set', () => {
    const out = applyPublicSettings(bundle, env());
    expect(out.settings.analytics).toEqual(bundle.settings.analytics);
    expect(out.settings.turnstileSiteKey).toBe(bundle.settings.turnstileSiteKey);
  });
  it('replaces every public identifier that is set', () => {
    const out = applyPublicSettings(
      bundle,
      env({
        NEXT_PUBLIC_GTM_ID: 'GTM-TEST',
        NEXT_PUBLIC_GA4_ID: 'G-TEST',
        NEXT_PUBLIC_ADS_ID: 'AW-TEST',
        NEXT_PUBLIC_ADS_CONVERSION_LABEL: 'label-test',
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: '0xTEST',
      }),
    );
    expect(out.settings.analytics.gtmId).toBe('GTM-TEST');
    expect(out.settings.analytics.ga4Id).toBe('G-TEST');
    expect(out.settings.analytics.adsId).toBe('AW-TEST');
    expect(out.settings.analytics.adsConversionLabel).toBe('label-test');
    expect(out.settings.turnstileSiteKey).toBe('0xTEST');
    // consentMode is not an env-overridable value, and the input is never mutated.
    expect(out.settings.analytics.consentMode).toBe(bundle.settings.analytics.consentMode);
    expect(bundle.settings.analytics.gtmId).not.toBe('GTM-TEST');
  });
  it('treats an empty string as "not configured"', () => {
    const out = applyPublicSettings(
      bundle,
      env({ NEXT_PUBLIC_GTM_ID: '', NEXT_PUBLIC_GA4_ID: '' }),
    );
    expect(out.settings.analytics.gtmId).toBe(bundle.settings.analytics.gtmId);
    expect(out.settings.analytics.ga4Id).toBe(bundle.settings.analytics.ga4Id);
  });
  it('still parses as a valid bundle after the overlay', () => {
    expect(() =>
      BundleSchema.parse(applyPublicSettings(bundle, env({ NEXT_PUBLIC_GTM_ID: 'GTM-TEST' }))),
    ).not.toThrow();
  });
});

describe('assertServableInProduction (D23)', () => {
  it('refuses pool/stories/representatives collections from LOCAL in production', () => {
    const b: Bundle = { ...bundle, collections: { pool: [{ publicRef: 'x' }] } };
    expect(() => assertServableInProduction(b, 'LOCAL', 'production')).toThrow(
      /never served from LOCAL/,
    );
    expect(() => assertServableInProduction(b, 'OPS', 'production')).not.toThrow();
    expect(() => assertServableInProduction(b, 'LOCAL', 'development')).not.toThrow();
  });
});

describe('fill / metricValues / makeTf (D17 placeholders)', () => {
  afterEach(() => vi.unstubAllEnvs());
  const withMetrics: Bundle = {
    ...bundle,
    strings: {
      ...bundle.strings,
      'x.1': '{placed} workers from {countries} countries in {firstDayWeeks} weeks',
    },
    collections: {
      metrics: [
        { key: 'placed', value: 1240, text: null, suffix: '+', labelId: null, unitId: null },
        { key: 'countries', value: 13, text: null, suffix: '', labelId: null, unitId: null },
        { key: 'firstDayWeeks', value: null, text: '6–8', suffix: '', labelId: null, unitId: null },
      ],
    },
  };
  it('formats values per locale, keeps the suffix and prefers text', () => {
    expect(metricValues(withMetrics, 'tr')).toEqual({
      placed: '1.240+',
      countries: '13',
      firstDayWeeks: '6–8',
    });
    expect(metricValues(withMetrics, 'en').placed).toBe('1,240+');
  });
  it('fills placeholders and leaves mustache-style {{ tokens }} alone', () => {
    expect(fill('{a} and {b}', { a: '1', b: '2' })).toBe('1 and 2');
    expect(fill('Nothing matches “{{ queryEcho }}”', {})).toBe('Nothing matches “{{ queryEcho }}”');
  });
  it('throws in development on an unknown placeholder and leaves it in production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => fill('{nope}', {})).toThrow(/no value for placeholder \{nope\}/);
    vi.stubEnv('NODE_ENV', 'production');
    expect(fill('{nope}', {})).toBe('{nope}');
  });
  it('makeTf reads a package id and fills it', () => {
    expect(makeTf(withMetrics, 'en')('x.1')).toBe('1,240+ workers from 13 countries in 6–8 weeks');
  });
});
