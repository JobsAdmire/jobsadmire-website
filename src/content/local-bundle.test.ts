import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema, type Bundle } from '../../contract/website-bundle.v1';
import {
  blogNavVisible,
  getCollection,
  getMetric,
  getOffice,
  getPageSeo,
  getRateConfig,
  METRIC_KEYS,
  PAGE_KEYS,
} from './collections';
import { makeT, makeTf, metricValues } from './pure';

const load = (locale: 'tr' | 'en'): Bundle =>
  BundleSchema.parse(
    JSON.parse(readFileSync(join(__dirname, `local/bundle.${locale}.json`), 'utf8')),
  );
const tr = load('tr');
const en = load('en');

describe('generated LOCAL bundles through the typed accessors', () => {
  it('parses every collection in both locales', () => {
    for (const bundle of [tr, en]) {
      expect(getCollection(bundle, 'metrics')).toHaveLength(9);
      expect(getCollection(bundle, 'calculatorRoles')).toHaveLength(15);
      expect(getCollection(bundle, 'sourceCountries')).toHaveLength(13);
      expect(getCollection(bundle, 'countries')).toHaveLength(64);
      expect(getCollection(bundle, 'offices')).toHaveLength(2);
      expect(getCollection(bundle, 'sectors')).toHaveLength(7);
      expect(getCollection(bundle, 'blog')).toHaveLength(22);
      // W86: one founder row, hidden until §10 row 3 publishes it
      expect(getCollection(bundle, 'founder')).toEqual([
        expect.objectContaining({ titleId: 'about.047', photoSrc: null, published: false }),
      ]);
      expect(getRateConfig(bundle).legalMinGross).toBe(33030);
    }
  });
  it('resolves every metric label/unit id and formats values per locale (W1)', () => {
    const t = makeT(tr);
    for (const key of METRIC_KEYS) {
      const m = getMetric(tr, key);
      if (m.labelId) expect(t(m.labelId)).not.toBe('');
      if (m.unitId) expect(t(m.unitId)).not.toBe('');
    }
    expect(metricValues(tr, 'tr')).toEqual({
      placed: '470+',
      employers: '22+',
      countries: '13',
      permitDays: '45',
      firstDayWeeks: '6–8',
      firstDayWeeksInCountry: '4–6',
      replySlaHours: '4',
      homepageReplyHours: '24',
      sectors: '6',
    });
  });
  it('fills re-authored package strings', () => {
    expect(makeTf(en, 'en')('about.057')).toBe('470+ workers placed, 22+ clients');
    expect(makeTf(tr, 'tr')('home.120')).toBe('13 ülkede denetlenen iş ortağı acenteler');
    expect(makeTf(en, 'en')('wp.264')).toBe('~6–8 weeks');
    expect(makeTf(en, 'en')('home.107')).toBe('24 hours');
    expect(makeTf(tr, 'tr')('blog.045')).toBe('24 saatte ücretsiz teklif');
  });
  it('offices, presets, countries and the article body read cleanly', () => {
    expect(getOffice(tr, 'karachi').kind).toBe('sourcing');
    expect(makeT(tr)(getOffice(tr, 'karachi').labelId)).toBe('Tedarik ofisi');
    expect(getOffice(tr, 'antalya').hours.days).toEqual([1, 2, 3, 4, 5]);
    expect(
      getCollection(tr, 'calculatorRoles')
        .filter((r) => r.preset)
        .map((r) => r.multiplier),
    ).toEqual([1, 1.5, 2]);
    expect(getCollection(en, 'sourceCountries').map((c) => c.name)).toContain('Sri Lanka');
    expect(getCollection(tr, 'sourceCountries').find((c) => c.code === 'LK')?.dial).toBe('+94');
    expect(getCollection(tr, 'countries').find((c) => c.code === 'TR')?.name).toBe('Türkiye');
    const guide = getCollection(en, 'blog').find((p) => p.hasBody.en)!;
    expect(guide.key).toBe('turkey-work-permit-process-employer-guide');
    expect(guide.body.en).toMatch(/^Türkiye's factories/);
    expect(guide.body.tr).toBeNull();
  });
  it('keeps /blog out of nav below the threshold (W4) and carries every page record', () => {
    expect(blogNavVisible(tr)).toBe(false);
    expect(tr.nav.some((n) => n.href === '/blog')).toBe(false);
    for (const key of PAGE_KEYS) expect(getPageSeo(tr, key), key).toBeDefined();
  });
});
