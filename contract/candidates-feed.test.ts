import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CANDIDATE_REF_RE,
  CANDIDATES_FEED_CONTRACT_VERSION,
  CandidateFeedItemSchema,
  CandidatesFeedSchema,
} from './candidates-feed.v1';

const fixture = JSON.parse(
  readFileSync(join(__dirname, 'candidates-feed.v1.fixture.json'), 'utf8'),
) as Record<string, unknown> & { candidates: Record<string, unknown>[] };
const item = (i: number) => fixture.candidates[i];

describe('candidates feed contract (candidates.v1)', () => {
  it('the golden fixture validates strictly: 14 candidates, unique refs the basket accepts', () => {
    expect(fixture.contractVersion).toBe(CANDIDATES_FEED_CONTRACT_VERSION);
    const feed = CandidatesFeedSchema.parse(fixture);
    expect(feed.candidates).toHaveLength(14);
    const refs = feed.candidates.map((c) => c.ref);
    expect(new Set(refs).size).toBe(14);
    for (const ref of refs) expect(ref).toMatch(CANDIDATE_REF_RE);
  });

  it('covers every filter value the page offers (bands computed by the page)', () => {
    const feed = CandidatesFeedSchema.parse(fixture);
    const years = feed.candidates.map((c) => c.yearsExperience ?? null);
    expect(years.some((y) => y != null && y <= 3)).toBe(true);
    expect(years.some((y) => y != null && y >= 4 && y <= 7)).toBe(true);
    expect(years.some((y) => y != null && y >= 8)).toBe(true);
    expect(years).toContain(null);
    const statuses = feed.candidates.map((c) => c.availability?.status);
    expect(statuses).toContain('NOW');
    expect(statuses).toContain('FROM_DATE');
    expect(feed.candidates.some((c) => c.photo === null || c.photo === undefined)).toBe(true);
    expect(feed.candidates.some((c) => c.nationality === null && c.nationalityLabel)).toBe(true);
    expect(feed.candidates.some((c) => c.languages?.some((l) => l.code === null))).toBe(true);
    expect(feed.candidates.some((c) => !c.position.group)).toBe(true);
  });

  it('every photo is on the Operations media route, under the candidate path', () => {
    for (const c of CandidatesFeedSchema.parse(fixture).candidates)
      if (c.photo)
        expect(c.photo.url).toMatch(
          /^https:\/\/operations\.jobsadmire\.com\/api\/website\/v1\/media\/candidate\/[^/]+\/[0-9a-f]+\.webp$/,
        );
  });

  it('carries nothing the contract forbids — no contact, documents, portal id or source (firewall)', () => {
    const text = JSON.stringify(fixture).toLowerCase();
    for (const word of [
      '"id"',
      'phone',
      'email',
      'passport',
      'address',
      'partner',
      'agency',
      'salary',
      'firstname',
      'lastname',
    ])
      expect(text, word).not.toContain(word);
  });

  it('is lenient on what a card can live without: absent, null and empty read as absent', () => {
    const lean = {
      ref: 'C7K2M9QX',
      displayName: 'Imran K.',
      position: { key: 'welder', label: { tr: 'Kaynakçı', en: '' } },
      nationality: null,
      updatedAt: '2026-11-01T12:00:00.000Z',
    };
    const parsed = CandidateFeedItemSchema.parse(lean);
    expect(parsed.position.label.en).toBeNull();
    expect(parsed.nationality).toBeNull();
    expect(parsed.nationalityLabel).toBeNull();
    expect(parsed.photo).toBeUndefined();
    expect(parsed.education).toBeNull();
    expect(parsed.age).toBeUndefined();
    const sizeless = CandidateFeedItemSchema.parse({
      ...lean,
      photo: { url: 'https://operations.jobsadmire.com/x.webp', width: null, height: null },
      languages: [{ code: '', label: 'Uzbek', level: 'C2' }],
      nationality: 'pk',
    });
    expect(sizeless.photo?.width).toBeNull();
    expect(sizeless.languages?.[0].code).toBeNull();
    expect(sizeless.nationality).toBe('PK');
  });

  it('strips unknown keys (the portal id, any additive producer field)', () => {
    const parsed = CandidateFeedItemSchema.parse({ ...item(0), id: 'cuid123', extra: 1 });
    expect(parsed).not.toHaveProperty('id');
    expect(parsed).not.toHaveProperty('extra');
  });

  it('refuses a ref the basket could not carry, and a missing display name or position key', () => {
    for (const ref of ['', 'has space', 'a,b', 'x'.repeat(33), '-lead'])
      expect(CandidateFeedItemSchema.safeParse({ ...item(0), ref }).success, ref).toBe(false);
    for (const ref of ['JA-1042', 'C7K2M9QX', 'cand_01.a:b'])
      expect(CandidateFeedItemSchema.safeParse({ ...item(0), ref }).success, ref).toBe(true);
    expect(CandidateFeedItemSchema.safeParse({ ...item(0), displayName: ' ' }).success).toBe(false);
    expect(
      CandidateFeedItemSchema.safeParse({
        ...item(0),
        position: { key: '', label: { tr: 'x', en: 'x' } },
      }).success,
    ).toBe(false);
  });
});
