import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { CandidateFeedItemSchema } from '../../contract/candidates-feed.v1';
import {
  countryName,
  feedToCandidates,
  languagesLine,
  mapCandidate,
  MAX_SKILLS,
  nationalityName,
  newestFirst,
  PoolFeedContractError,
} from './pool-candidates';

const FIXTURE = JSON.parse(
  readFileSync(join(process.cwd(), 'contract/candidates-feed.v1.fixture.json'), 'utf8'),
) as { candidates: Record<string, unknown>[] } & Record<string, unknown>;
const quiet = () => {};
const parse = (raw: Record<string, unknown>) => CandidateFeedItemSchema.parse(raw);

describe('mapCandidate', () => {
  it('maps a full candidate: display name as sent, photo, labels per locale, group', () => {
    const c = mapCandidate(parse(FIXTURE.candidates[0]), quiet);
    expect(c).toMatchObject({
      ref: 'JA-1201',
      name: 'Ali K.',
      photo: {
        url: 'https://operations.jobsadmire.com/api/website/v1/media/candidate/JA-1201/3f9a1c2e.webp',
        width: 480,
        height: 480,
      },
      position: { key: 'welder', label: { tr: 'Kaynakçı', en: 'Welder' } },
      group: { key: 'construction', label: { tr: 'İnşaat', en: 'Construction' } },
      nationality: 'PK',
      nationalityLabel: null,
      yearsExperience: 6,
      availability: { status: 'NOW', from: null },
      location: { country: 'PK', city: 'Karachi' },
      education: 'Technical diploma',
      age: 28,
      createdAt: '2026-10-30T08:00:00.000Z',
      addedAt: '2026-10-30T08:00:00.000Z',
    });
  });

  it('a missing photo, age, education, experience, group, location and nationality code read as absent', () => {
    const c = mapCandidate(parse(FIXTURE.candidates[13]), quiet);
    expect(c.ref).toBe('C7K2M9QX'); // an opaque ref, kept as sent
    expect(c.photo).toBeNull();
    expect(c.age).toBeNull();
    expect(c.education).toBeNull();
    expect(c.yearsExperience).toBeNull();
    expect(c.group).toBeNull();
    expect(c.location).toEqual({ country: null, city: null });
    expect(c.nationality).toBeNull();
    expect(c.nationalityLabel).toBe('Bangladeshi');
    expect(c.languages).toEqual([]);
    expect(c.skills).toEqual([]);
  });

  it('a photo without a size takes the fixed square; a photo off the media route is dropped and logged', () => {
    const sizeless = mapCandidate(parse(FIXTURE.candidates[1]), quiet);
    expect(sizeless.photo).toMatchObject({ width: 480, height: 480 });
    const log = vi.fn();
    const off = mapCandidate(
      parse({ ...FIXTURE.candidates[0], photo: { url: 'https://portal.example.com/p.jpg' } }),
      log,
    );
    expect(off.photo).toBeNull();
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/media route/), { ref: 'JA-1201' });
  });

  it('fills a missing label from the other locale, then the key; keeps at most six skills', () => {
    const c = mapCandidate(
      parse({
        ...FIXTURE.candidates[0],
        position: { key: 'rigger', label: { tr: null, en: 'Rigger' }, group: null },
        skills: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      }),
      quiet,
    );
    expect(c.position.label).toEqual({ tr: 'Rigger', en: 'Rigger' });
    expect(c.skills).toHaveLength(MAX_SKILLS);
    const bare = mapCandidate(
      parse({ ...FIXTURE.candidates[0], position: { key: 'rigger', label: { tr: '', en: '' } } }),
      quiet,
    );
    expect(bare.position.label).toEqual({ tr: 'rigger', en: 'rigger' });
  });

  it('drops a language that names nothing; no createdAt → addedAt is updatedAt', () => {
    const rest = { ...FIXTURE.candidates[0] };
    delete rest.createdAt;
    const c = mapCandidate(
      parse({
        ...rest,
        languages: [
          { code: null, label: null, level: 'B1' },
          { code: 'EN', level: 'B1' },
        ],
      }),
      quiet,
    );
    expect(c.languages).toEqual([{ code: 'en', label: null, level: 'B1' }]);
    expect(c.createdAt).toBeNull();
    expect(c.addedAt).toBe('2026-11-01T12:00:00.000Z');
  });
});

describe('feedToCandidates', () => {
  it('maps the fixture: 14 rows, no cursor', () => {
    const page = feedToCandidates(FIXTURE, quiet);
    expect(page.candidates).toHaveLength(14);
    expect(page.nextCursor).toBeNull();
  });

  it('an empty feed is zero rows, not an error', () => {
    expect(feedToCandidates({ ...FIXTURE, candidates: [] }, quiet).candidates).toEqual([]);
  });

  it('a bad candidate is logged and left out; a duplicate ref keeps the first (R28)', () => {
    const log = vi.fn();
    const page = feedToCandidates(
      {
        ...FIXTURE,
        candidates: [
          FIXTURE.candidates[0],
          { ...FIXTURE.candidates[1], displayName: '' },
          { ...FIXTURE.candidates[2], ref: 'JA-1201' },
        ],
      },
      log,
    );
    expect(page.candidates.map((c) => c.ref)).toEqual(['JA-1201']);
    expect(log).toHaveBeenCalledTimes(2);
  });

  it('refuses an envelope that is not candidates.v1', () => {
    for (const raw of [
      null,
      {},
      { ...FIXTURE, contractVersion: 'candidates.v2' },
      { ...FIXTURE, candidates: 'x' },
    ])
      expect(() => feedToCandidates(raw, quiet)).toThrow(PoolFeedContractError);
  });
});

describe('labels', () => {
  it('country names: the bundle first, then the platform, then the code', () => {
    expect(countryName('PK', 'tr', new Map([['PK', 'Pakistan (bundle)']]))).toBe(
      'Pakistan (bundle)',
    );
    expect(countryName('PH', 'en')).toBe('Philippines');
    expect(countryName('PH', 'tr')).toBe('Filipinler');
    expect(nationalityName({ nationality: null, nationalityLabel: 'Bangladeshi' }, 'tr')).toBe(
      'Bangladeshi',
    );
    expect(nationalityName({ nationality: null, nationalityLabel: null }, 'en')).toBe('');
  });

  it('languages: the localized name for a code, the label without one, the level in brackets', () => {
    const langs = [
      { code: 'en', label: 'English', level: 'B1' },
      { code: 'tr', label: 'Turkish', level: null },
      { code: null, label: 'Uzbek', level: 'C2' },
    ];
    expect(languagesLine(langs, 'en')).toBe('English (B1) · Turkish · Uzbek (C2)');
    expect(languagesLine(langs, 'tr')).toBe('İngilizce (B1) · Türkçe · Uzbek (C2)');
    expect(languagesLine([], 'tr')).toBe('');
  });

  it('newestFirst orders by addedAt', () => {
    const rows = feedToCandidates(FIXTURE, quiet).candidates;
    const sorted = newestFirst([...rows].reverse());
    expect(sorted.slice(0, 3).map((c) => c.ref)).toEqual(['JA-1201', 'JA-1202', 'JA-1203']);
  });
});
