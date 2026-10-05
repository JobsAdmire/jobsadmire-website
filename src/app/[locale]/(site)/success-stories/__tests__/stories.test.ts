import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FIXTURE_ONLY_COLLECTIONS } from '@/content/config';
import { assertServableInProduction } from '@/content/pure';
import { testBundle } from '@/test/bundle';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import {
  readStories,
  readTestimonials,
  sampleStoryCards,
  storyCards,
  StorySchema,
  type Story,
} from '../_lib/stories';

// The v1 card shape (D9): sector, roles, headcount, approval month, city-only place, countries.
const ROW: Story = {
  id: 'AP-2026-118',
  sector: 'tourism',
  roles: 'Kat görevlileri, mutfak yardımcıları',
  headcount: 12,
  approvedAt: '2026-06-01',
  place: 'Antalya',
  countries: ['KG', 'PK'],
};

const SECTORS = [
  { key: 'tourism', labelId: 'hire.078', subtitleId: null, icon: 'tourism' },
  { key: 'factory', labelId: 'hire.076', subtitleId: null, icon: 'factory' },
];
const COUNTRIES = [
  { code: 'KG', name: 'Kırgızistan', dial: '+996' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
];
const STRINGS = {
  'hire.078': 'Turizm / Konaklama',
  'hire.076': 'Fabrika / Üretim',
  'hire.082': 'Diğer',
  'success.041': 'çalışma izni',
  'success.125': 'Otel ve turizm',
  'success.127': 'Fabrika',
  'success.150': 'Dosyada onay ·',
  'success.151': 'işçiyi kapsıyor',
};

describe('the stories collection can never be served from LOCAL in production (D23)', () => {
  it('is a fixture-only collection', () => {
    expect(FIXTURE_ONLY_COLLECTIONS).toContain('stories');
  });
  it('is refused by the adapter guard when it carries rows', () => {
    const bundle = testBundle({ collections: { stories: [ROW] } });
    expect(() => assertServableInProduction(bundle, 'LOCAL', 'production')).toThrow(
      /stories.*never served from LOCAL/,
    );
    // The same rows from Operations (Phase B) are fine — that is the whole point of the guard.
    expect(() => assertServableInProduction(bundle, 'OPS', 'production')).not.toThrow();
  });
  it('the committed LOCAL bundles carry no stories (or testimonial) rows, so a production build serves the page-local sample, never a fixture', () => {
    for (const locale of ['tr', 'en'] as const) {
      // readFileSync, never an import: `**/content/local/*` is import-banned in src/** (the D23
      // ESLint rule); `src/content/local-bundle.test.ts` reads the same files the same way.
      const raw = readFileSync(
        join(process.cwd(), 'src/content/local', `bundle.${locale}.json`),
        'utf8',
      );
      const bundle = BundleSchema.parse(JSON.parse(raw));
      expect(bundle.collections.stories ?? []).toEqual([]);
      expect(() => assertServableInProduction(bundle, 'LOCAL', 'production')).not.toThrow();
      expect(readStories(bundle)).toEqual([]);
      // §10 row 11: no consented testimonial exists in Phase A either (not a D23 fixture key,
      // so the adapter guard does not cover it — this pin does).
      expect(readTestimonials(bundle)).toEqual([]);
    }
  });
});

describe('readStories', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('is empty when the bundle has no stories key (Phase A)', () => {
    expect(readStories(testBundle())).toEqual([]);
  });
  it('parses well-formed rows', () => {
    expect(readStories(testBundle({ collections: { stories: [ROW] } }))).toEqual([ROW]);
  });
  it('throws outside production on a row that misses the schema', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const bad = { ...ROW, headcount: 'twelve' };
    expect(() => readStories(testBundle({ collections: { stories: [bad] } }))).toThrow(
      /stories.*schema/,
    );
  });
  it('degrades to an empty wall in production on a bad row', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bad = { ...ROW, sector: 'hotels' }; // the design's private enum, not the site's
    expect(readStories(testBundle({ collections: { stories: [bad] } }))).toEqual([]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('accepts only the site sector keys, upper-case ISO-2 countries and full dates', () => {
    expect(StorySchema.safeParse({ ...ROW, sector: 'hotels' }).success).toBe(false);
    expect(StorySchema.safeParse({ ...ROW, countries: ['kg'] }).success).toBe(false);
    expect(StorySchema.safeParse({ ...ROW, approvedAt: '2026-06' }).success).toBe(false);
  });
});

describe('storyCards (the real path)', () => {
  it('resolves labels for the island: the covering wall chip, localized month, country names, headcount, document line', () => {
    const bundle = testBundle({
      strings: STRINGS,
      collections: { stories: [ROW], sectors: SECTORS, countries: COUNTRIES },
    });
    const [card] = storyCards(bundle, 'tr', readStories(bundle));
    expect(card).toEqual({
      id: 'AP-2026-118',
      // the site's `tourism` files under the design's "Otel ve turizm" chip (WALL_SECTOR_OF)
      sector: 'hotels',
      sectorLabel: 'Otel ve turizm',
      roles: 'Kat görevlileri, mutfak yardımcıları',
      headcount: '12',
      monthLabel: 'Haziran 2026',
      place: 'Antalya',
      countries: ['Kırgızistan', 'Pakistan'],
      docLabel: 'Dosyada onay · 12 işçiyi kapsıyor',
    });
  });
  it('keeps a sector no chip covers (`other`) under its own key and site label', () => {
    const bundle = testBundle({
      strings: STRINGS,
      collections: {
        stories: [{ ...ROW, sector: 'other' }],
        sectors: [
          ...SECTORS,
          { key: 'other', labelId: 'hire.082', subtitleId: null, icon: 'other' },
        ],
        countries: COUNTRIES,
      },
    });
    const [card] = storyCards(bundle, 'tr', readStories(bundle));
    expect(card.sector).toBe('other');
    expect(card.sectorLabel).toBe('Diğer');
  });
  it('formats the headcount per locale (D18) and falls back to the code for an unknown country', () => {
    const bundle = testBundle({
      strings: {
        ...STRINGS,
        'success.125': 'Hotels & tourism',
        'success.150': 'Approval on file ·',
        'success.151': 'workers covered',
      },
      collections: {
        stories: [{ ...ROW, headcount: 1240, countries: ['ZZ'] }],
        sectors: SECTORS,
        countries: COUNTRIES,
      },
    });
    const [card] = storyCards(bundle, 'en', readStories(bundle));
    expect(card.headcount).toBe('1,240');
    expect(card.docLabel).toBe('Approval on file · 1,240 workers covered');
    expect(card.monthLabel).toBe('June 2026');
    expect(card.countries).toEqual(['ZZ']);
  });
  it('sorts newest approval first', () => {
    const older: Story = { ...ROW, id: 'AP-2025-063', approvedAt: '2025-08-01' };
    const bundle = testBundle({
      strings: STRINGS,
      collections: { stories: [older, ROW], sectors: SECTORS, countries: COUNTRIES },
    });
    expect(storyCards(bundle, 'tr', readStories(bundle)).map((c) => c.id)).toEqual([
      'AP-2026-118',
      'AP-2025-063',
    ]);
  });
});

describe('sampleStoryCards (Phase A: the design’s nine sample approvals)', () => {
  it('builds the nine cards in the design’s order from the committed TR bundle’s package ids', () => {
    const raw = readFileSync(join(process.cwd(), 'src/content/local', 'bundle.tr.json'), 'utf8');
    const bundle = BundleSchema.parse(JSON.parse(raw));
    const cards = sampleStoryCards(bundle, 'tr');
    expect(cards.map((c) => c.id)).toEqual(['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9']);
    expect(cards[0]).toEqual({
      id: 'a1',
      sector: 'hotels',
      sectorLabel: 'Otel ve turizm',
      roles: 'Kat görevlileri, mutfak yardımcıları, çamaşırhane',
      headcount: '45',
      monthLabel: 'Ağustos 2025',
      place: 'Kemer, Antalya',
      countries: ['Özbekistan', 'Nepal'],
      docLabel: 'Dosyada onay · 45 işçiyi kapsıyor',
    });
    expect(cards[5].sectorLabel).toBe('Restoranlar');
    expect(cards[5].countries).toEqual(['Endonezya', 'Filipinler']);
  });
});

describe('readTestimonials', () => {
  it('is empty in Phase A (§10 row 11) and parses a consented row', () => {
    expect(readTestimonials(testBundle())).toEqual([]);
    const row = {
      id: 't1',
      quote: '“…”',
      role: 'İK Müdürü',
      org: 'Otel grubu · Kemer',
      initials: 'HK',
    };
    expect(readTestimonials(testBundle({ collections: { testimonials: [row] } }))).toEqual([row]);
  });
});
