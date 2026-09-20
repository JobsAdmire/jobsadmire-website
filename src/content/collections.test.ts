import { afterEach, describe, expect, it, vi } from 'vitest';
import fixture from '../../contract/website-bundle.v1.fixture.json';
import { BundleSchema, type Bundle } from '../../contract/website-bundle.v1';
import {
  BLOG_NAV_THRESHOLD,
  blogNavVisible,
  CollectionError,
  getCollection,
  getMetric,
  getOffice,
  getPageSeo,
  getRateConfig,
  METRIC_KEYS,
  PAGE_KEYS,
  PAGE_PATHNAME,
} from './collections';

const base = BundleSchema.parse(fixture);
const withCollections = (collections: Bundle['collections']): Bundle => ({ ...base, collections });

const metric = {
  key: 'placed',
  value: 470,
  text: null,
  suffix: '+',
  labelId: 'home.050',
  unitId: null,
};
const rateConfig = {
  version: '2026-01',
  effectiveFrom: '2026-01-01',
  reviewDueAt: '2026-12-20',
  updatedAt: '2026-01-15',
  currency: 'TRY',
  legalMinGross: 33030,
  sgkEmployerRate: 0.2175,
  sgkRates: { manufacturing: 0.1875, other: 0.2175, none: 0.2375 },
  supportMonthly: 1270,
  permitFeeTRY: 16000,
  flightTRY: 12000,
  housingMonthlyTRY: 5000,
  quotaRatio: 5,
};
const office = {
  key: 'antalya',
  kind: 'hq',
  cityId: 'contact.096',
  labelId: 'contact.099',
  addressId: 'contact.133',
  addressLine2Id: 'contact.134',
  hoursId: 'contact.100',
  footerLabelId: 'home.196',
  phone: '+905011240340',
  whatsapp: '905011240340',
  email: 'info@jobsadmire.com',
  hours: { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Antalya',
};
const country = { code: 'TR', name: 'Türkiye', dial: '+90' };
const post = (tr: boolean) => ({
  key: 'a',
  slug: { tr: tr ? 'a-tr' : null, en: 'a' },
  title: { tr: tr ? 'A' : null, en: 'A' },
  excerpt: { tr: tr ? 'x' : null, en: 'x' },
  category: 'workPermits',
  categoryLabelId: 'home.263',
  author: 'JobsAdmire',
  publishedAt: '2026-06-12',
  readMinutes: 8,
  hasBody: { tr, en: true },
  body: { tr: tr ? '## A' : null, en: '## A' },
});

describe('getCollection', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('parses rows against the collection schema and caches per bundle object', () => {
    const bundle = withCollections({ metrics: [metric] });
    const rows = getCollection(bundle, 'metrics');
    expect(rows).toEqual([metric]);
    expect(getCollection(bundle, 'metrics')).toBe(rows);
  });

  it('returns [] for a collection the bundle does not carry', () => {
    expect(getCollection(withCollections({}), 'sectors')).toEqual([]);
  });

  it('throws in development on a schema miss', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const bundle = withCollections({ metrics: [{ key: 'nope', value: 'x' }] });
    expect(() => getCollection(bundle, 'metrics')).toThrow(CollectionError);
  });

  it('degrades to [] in production on a schema miss (R28) and reports it', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bundle = withCollections({ metrics: [{ key: 'nope', value: 'x' }] });
    expect(getCollection(bundle, 'metrics')).toEqual([]);
    expect(error).toHaveBeenCalledOnce();
    error.mockRestore();
  });

  it('strips unknown row fields instead of failing (additive within 1.x)', () => {
    const bundle = withCollections({ metrics: [{ ...metric, future: 1 }] });
    expect(getCollection(bundle, 'metrics')[0]).not.toHaveProperty('future');
  });

  it('reads the general country list (W25)', () => {
    expect(getCollection(withCollections({ countries: [country] }), 'countries')).toEqual([
      country,
    ]);
  });

  it('refuses a blog row whose body and hasBody disagree (W28)', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const bad = { ...post(true), body: { tr: null, en: '## A' } };
    expect(() => getCollection(withCollections({ blog: [bad] }), 'blog')).toThrow(CollectionError);
    expect(getCollection(withCollections({ blog: [post(false)] }), 'blog')).toHaveLength(1);
  });
});

describe('getMetric / getRateConfig / getOffice', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('returns the metric row by key', () => {
    expect(getMetric(withCollections({ metrics: [metric] }), 'placed')).toEqual(metric);
  });
  it('throws in development for a missing metric and returns an empty metric in production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => getMetric(withCollections({}), 'placed')).toThrow(CollectionError);
    vi.stubEnv('NODE_ENV', 'production');
    expect(getMetric(withCollections({}), 'placed')).toEqual({
      key: 'placed',
      value: null,
      text: null,
      suffix: '',
      labelId: null,
      unitId: null,
    });
  });
  it('returns the single rate-config row and throws in every environment without one', () => {
    expect(getRateConfig(withCollections({ rateConfig: [rateConfig] }))).toEqual(rateConfig);
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => getRateConfig(withCollections({}))).toThrow(CollectionError);
  });
  it('returns an office by key and throws without it', () => {
    expect(getOffice(withCollections({ offices: [office] }), 'antalya')).toEqual(office);
    expect(() => getOffice(withCollections({ offices: [office] }), 'karachi')).toThrow(
      CollectionError,
    );
  });
});

describe('blog nav threshold (W4)', () => {
  it('is hidden below six Turkish bodies and visible from six', () => {
    expect(BLOG_NAV_THRESHOLD).toBe(6);
    expect(blogNavVisible(withCollections({ blog: [post(true)] }))).toBe(false);
    const six = Array.from({ length: 6 }, (_, i) => ({ ...post(true), key: `k${i}` }));
    expect(blogNavVisible(withCollections({ blog: six }))).toBe(true);
    expect(blogNavVisible(withCollections({}))).toBe(false);
  });
});

describe('page keys', () => {
  it('maps every page key to an internal pathname and reads the record', () => {
    expect(PAGE_KEYS).toHaveLength(22);
    for (const key of PAGE_KEYS) expect(PAGE_PATHNAME[key]).toMatch(/^\//);
    expect(PAGE_PATHNAME.blogArticle).toBe('/blog/[slug]');
    expect(PAGE_PATHNAME.careersDetail).toBe('/careers/[slug]');
    expect(getPageSeo(base, 'home')).toEqual(base.pages.home);
    expect(getPageSeo(base, 'kvkk')).toBeUndefined();
  });
  it('declares the nine W1 metric keys', () => {
    expect([...METRIC_KEYS]).toEqual([
      'placed',
      'employers',
      'countries',
      'permitDays',
      'firstDayWeeks',
      'firstDayWeeksInCountry',
      'replySlaHours',
      'homepageReplyHours',
      'sectors',
    ]);
  });
});
