import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { feedToCandidates, type PoolCandidate } from '@/content/pool-candidates';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { PoolExplorer } from '../_components/PoolExplorer';
import { RequestFormFields } from '../_components/RequestFormFields';
import {
  filterPool,
  NO_FILTERS,
  poolStats,
  popularBy,
  popularIndustries,
  sortPool,
  type PoolFilters,
} from '../_lib/pool-view';
import { availBand, candidateToWorker, langBands, nationalityKey } from '../_lib/real-pool';
import { COPY, renderInPool } from './pool-fixture';

const FIXTURE = JSON.parse(
  readFileSync(join(process.cwd(), 'contract/candidates-feed.v1.fixture.json'), 'utf8'),
) as { generatedAt: string; candidates: unknown[] };
/** "now" is the fixture's own generation time, so the start dates and the "New" window hold. */
const NOW = new Date(FIXTURE.generatedAt);
const CANDIDATES = feedToCandidates(FIXTURE, () => {}).candidates;
const by = (ref: string) => CANDIDATES.find((c) => c.ref === ref) as PoolCandidate;
const FROM = { en: en.sys.workers.card.from, tr: tr.sys.workers.card.from };
const rowsIn = (locale: 'tr' | 'en') =>
  CANDIDATES.map((c) => candidateToWorker(c, locale, { now: NOW, fromTemplate: FROM[locale] }));
const ROWS = rowsIn('en');
const refsOf = (f: Partial<PoolFilters>) =>
  filterPool(ROWS, { ...NO_FILTERS, ...f }).map((w) => w.ref);

describe('real candidates → pool rows (POOL_SOURCE=OPS)', () => {
  it('maps one candidate with every label in the locale', () => {
    const w = ROWS.find((r) => r.ref === 'JA-1201')!;
    expect(w).toMatchObject({
      name: 'Ali K.',
      trade: 'Welder',
      tradeKey: 'cfixtureposition00000001',
      country: 'Pakistan',
      countryKey: 'PK',
      flag: 'PK',
      industry: 'Construction',
      industryKey: 'construction',
      exp: 6,
      langs: 'English (B1) · Turkish (A2)',
      langBands: ['tr', 'en'],
      avail: 0,
      tags: ['MIG', 'TIG', 'Pipe welding'],
      added: true,
      location: 'Karachi, Pakistan',
    });
    expect(w.availLabel).toBeUndefined();
    const t = rowsIn('tr').find((r) => r.ref === 'JA-1201')!;
    expect(t).toMatchObject({
      trade: 'Kaynakçı',
      industry: 'İnşaat',
      location: 'Karachi, Pakistan',
    });
    expect(t.langs).toBe('İngilizce (B1) · Türkçe (A2)');
  });

  it('a profile missing photo, experience, group, location and a nationality code still makes a row', () => {
    const w = ROWS.find((r) => r.ref === 'C7K2M9QX')!;
    expect(w).toMatchObject({
      name: 'Rahim U.',
      country: 'Bangladeshi',
      countryKey: 'label:bangladeshi',
      exp: null,
      industry: '',
      industryKey: '',
      langs: '',
      lang: 'other',
      tags: [],
      added: false,
    });
    expect(w.flag).toBeUndefined();
    expect(w.location).toBeUndefined();
    expect(nationalityKey({ ...by('C7K2M9QX'), nationalityLabel: null })).toBe('');
  });

  it('availability bands from the start date: now / within 30 days / later, with the date on the pill', () => {
    expect(availBand(by('JA-1201'), NOW)).toBe(0);
    expect(availBand(by('JA-1213'), NOW)).toBe(1); // 8 days ahead
    expect(availBand(by('JA-1203'), NOW)).toBe(1); // 18 days
    expect(availBand(by('JA-1204'), NOW)).toBe(2); // January
    expect(availBand(by('JA-1204'), new Date('2027-02-01T00:00:00Z'))).toBe(0); // passed
    expect(ROWS.find((r) => r.ref === 'JA-1204')!.availLabel).toBe('From 15 Jan 2027');
    expect(rowsIn('tr').find((r) => r.ref === 'JA-1204')!.availLabel).toBe(
      '15 Oca 2027 itibarıyla',
    );
  });

  it('language bands: any Turkish, good English (B1+), by code or by label; else other', () => {
    expect(langBands([{ code: 'en', label: null, level: 'A2' }])).toEqual(['other']);
    expect(langBands([{ code: 'en', label: null, level: null }])).toEqual(['other']);
    expect(langBands([{ code: 'tr', label: null, level: 'A1' }])).toEqual(['tr']);
    expect(langBands([{ code: null, label: 'İngilizce', level: 'C1' }])).toEqual(['en']);
    expect(langBands([{ code: null, label: 'Turkish', level: 'B1' }])).toEqual(['tr']);
    expect(langBands([{ code: null, label: 'Uzbek', level: 'C2' }])).toEqual(['other']);
  });

  it('"New" for 14 days after the profile entered the pool', () => {
    expect(ROWS.filter((r) => r.added).map((r) => r.ref)).toEqual([
      'JA-1201',
      'JA-1202',
      'JA-1203',
    ]);
  });

  it('the stats strip counts the real rows', () => {
    expect(ROWS).toHaveLength(17);
    // ready now: NOW, none whose date passed; countries: 6 ISO codes + two labels; professions:
    // 14 position keys (Rustam has none)
    expect(poolStats(ROWS)).toEqual({ ready: 12, countries: 8, trades: 14 });
  });

  it('every filter works over real rows', () => {
    expect(refsOf({ trade: 'cfixtureposition00000001' })).toEqual([
      'JA-1201',
      'JA-1213',
      'CND-2026-9001',
    ]);
    expect(refsOf({ country: 'PK' })).toEqual(['JA-1201', 'JA-1207', 'JA-1213', 'CND-2026-9001']);
    expect(refsOf({ country: 'label:bangladeshi' })).toEqual(['C7K2M9QX']);
    expect(refsOf({ industry: 'agriculture' })).toEqual(['JA-1208']);
    expect(refsOf({ exp: '0-3' })).toEqual(['JA-1204', 'JA-1206', 'JA-1208', 'JA-1211']);
    expect(refsOf({ exp: '8+' })).toEqual(['JA-1202', 'JA-1207', 'JA-1210', 'CND-2026-9003']);
    expect(refsOf({ exp: '4-7' })).not.toContain('C7K2M9QX'); // unknown experience: no band
    expect(refsOf({ lang: 'tr' })).toEqual(['JA-1201', 'JA-1203', 'JA-1205', 'JA-1209', 'JA-1211']);
    expect(refsOf({ lang: 'en' })).toEqual([
      'JA-1201',
      'JA-1202',
      'JA-1206',
      'JA-1210',
      'JA-1212',
      'JA-1213',
      'CND-2026-9001',
    ]);
    expect(refsOf({ avail: 'now' })).toHaveLength(12);
    expect(refsOf({ avail: '30' })).toHaveLength(15); // now + within 30 days
    expect(refsOf({ trade: 'cfixtureposition00000001', industry: 'factory' })).toEqual(['JA-1213']);
    // no position: in "all", never under a profession or an industry
    expect(refsOf({})).toContain('CND-2026-9003');
    for (const w of ROWS)
      if (w.tradeKey) expect(refsOf({ trade: w.tradeKey })).not.toContain('CND-2026-9003');
    for (const i of ['hotel', 'construction', 'factory', 'agriculture'])
      expect(refsOf({ industry: i })).not.toContain('CND-2026-9003');
  });

  it('sorts: soonest first, experience (unknown last), recently added, A–Z', () => {
    expect(
      sortPool(ROWS, 'exp', 'en')
        .slice(-2)
        .map((w) => w.exp),
    ).toEqual([null, null]);
    expect(sortPool(ROWS, 'exp', 'en')[0].ref).toBe('CND-2026-9003');
    expect(sortPool(ROWS, 'az', 'en').at(-1)!.ref).toBe('CND-2026-9003'); // no position: last
    expect(
      sortPool(ROWS, 'new', 'en')
        .slice(0, 4)
        .map((w) => w.ref),
    ).toEqual(['JA-1201', 'JA-1202', 'JA-1203', 'CND-2026-9001']); // then updatedAt orders
    expect(sortPool(ROWS, 'avail', 'en').at(-1)!.avail).toBe(2);
  });

  it('popular chips: the industries; the professions when no row carries a group', () => {
    expect(popularIndustries(ROWS).map((p) => p.key)).toEqual([
      'hotel',
      'construction',
      'factory',
      'agriculture',
    ]);
    const ungrouped = ROWS.map((w) => ({ ...w, industry: '', industryKey: '' }));
    expect(popularIndustries(ungrouped)).toEqual([]);
    expect(popularBy(ungrouped, 'trade')[0]).toMatchObject({
      key: 'cfixtureposition00000001',
      count: 3,
    });
  });
});

describe('PoolExplorer over real rows', () => {
  const COPY_REAL = {
    ...COPY,
    cvOnRequest: en.sys.workers.card.cvOnRequest,
    card: { nationality: en.sys.workers.card.nationality, location: en.sys.workers.card.location },
  };
  const avatars = Object.fromEntries(
    ROWS.map((w) => [w.ref, <span key={w.ref} data-avatar={w.ref} />]),
  );

  it('a real card: the name as heading, the position under it, no lock, flag and location named', () => {
    renderInPool(
      <PoolExplorer rows={ROWS} avatars={avatars} copy={COPY_REAL} waHire="https://wa.me/1" />,
      ROWS,
    );
    const card = document.querySelector('[data-pool-ref="JA-1201"]') as HTMLElement;
    expect(within(card).getByRole('heading', { level: 3, name: 'Ali K.' })).toBeInTheDocument();
    expect(within(card).getByText('Welder')).toBeInTheDocument();
    expect(card.querySelector('svg rect[x="3"][y="11"]')).toBeNull(); // the sample's lock
    expect(card.querySelector('use[href$="#flag-PK"]')).not.toBeNull();
    expect(card).toHaveTextContent('Nationality: Pakistan');
    expect(card).toHaveTextContent('Current location: Karachi, Pakistan');
    expect(card).toHaveTextContent(COPY_REAL.cvOnRequest);
    expect(card).not.toHaveTextContent(/photo on request/i);
    // the portal's sparse profile (first: soonest, then most experience): one-word name, no
    // position line, a label nationality (no flag), no empty lines
    const rustam = document.querySelector('[data-pool-ref="CND-2026-9003"]') as HTMLElement;
    expect(within(rustam).getByRole('heading', { level: 3, name: 'Rustam' })).toBeInTheDocument();
    expect(rustam.querySelector('h3 + p')).toBeNull();
    expect(rustam).toHaveTextContent('Nationality: Karakalpak');
    expect(rustam).toHaveTextContent('Current location: Tajikistan');
    expect(rustam).toHaveTextContent('Russian (B2) · Karakalpak (A1)');
    expect(rustam).toHaveTextContent('12 yrs experience');
    expect(rustam.querySelector('use')).toBeNull();
    expect(rustam.querySelectorAll('ul > li')).toHaveLength(4);
  });

  it('Add to request posts the real refs in profileRefs', async () => {
    const user = userEvent.setup();
    const { container } = renderInPool(
      <>
        <RequestFormFields
          roles={{
            direct_employer: { tab: 'Employer', companyLabel: 'Company', tradeLabel: 'Roles' },
            hr_agency: { tab: 'HR', companyLabel: 'Agency', tradeLabel: 'Roles' },
          }}
          labels={{ name: 'Name', email: 'E-mail', phone: 'Phone', city: 'City' }}
          basket={{ one: 'profile', many: 'profiles', clear: 'Clear' }}
        />
        <PoolExplorer rows={ROWS} avatars={avatars} copy={COPY_REAL} waHire="https://wa.me/1" />
      </>,
      ROWS,
    );
    for (const ref of ['JA-1201', 'JA-1202']) {
      const card = container.querySelector(`[data-pool-ref="${ref}"]`) as HTMLElement;
      await user.click(within(card).getByRole('button', { name: /Add to request/i }));
    }
    expect(container.querySelector('input[name="profileRefs"]')).toHaveValue('JA-1201, JA-1202');
  });

  it('an empty feed shows the designed no-results state', () => {
    renderInPool(
      <PoolExplorer rows={[]} avatars={{}} copy={COPY_REAL} waHire="https://wa.me/1" />,
      [],
    );
    expect(screen.getByTestId('pool-no-results')).toBeInTheDocument();
    expect(screen.queryByTestId('pool-grid')).toBeNull();
    // no industry select over rows without groups
    expect(screen.queryByRole('combobox', { name: COPY.labels.industry })).toBeNull();
  });
});

describe('firewall: the real-card copy never names a source (owner rule)', () => {
  it('sys.workers.card.* in both languages', () => {
    for (const messages of [tr, en])
      for (const value of Object.values(messages.sys.workers.card))
        expect(value).not.toMatch(/partner|agenc|acente|ajans|ortak|kaynak|sourc|tedarik/i);
  });
});

describe('a real row without a position', () => {
  it('maps to an empty profession and industry', () => {
    const w = ROWS.find((r) => r.ref === 'CND-2026-9003')!;
    expect(w).toMatchObject({
      name: 'Rustam',
      trade: '',
      tradeKey: '',
      industry: '',
      industryKey: '',
    });
    expect(w.country).toBe('Karakalpak');
    expect(w.flag).toBeUndefined();
  });
});
