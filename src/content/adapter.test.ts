import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeT, assertServableInProduction } from './pure';
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
