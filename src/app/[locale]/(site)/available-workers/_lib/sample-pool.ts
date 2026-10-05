/**
 * The design's candidate sample (`Available Workers.dc.html` `pool()`, ll. 1225–1240), copied as a
 * PAGE-LOCAL constant (owner 2026-10-05: data-gated sections render the design's sample with the
 * "örnek / sample" tag instead of an empty state). Never `design-package/data/*.sample.json` and
 * never the `pool` collection — neither may reach production (D23); real profiles arrive with the
 * v1.1 cards task (D2) through `_lib/pool.ts`. Every visitor-facing word is a package id
 * (`availworkers.156`–`206`), resolved by the page; the refs, years and flags are the design's.
 * Client-safe: no bundle, no message files.
 */

/** 0 = available now (207), 1 = within 30 days (208), 2 = next season (209) — the design's
 *  `avail` index, also its "soonest available" sort key. */
export type SampleAvail = 0 | 1 | 2;
/** The design's `langBand` (`/Turkish/` → tr, `English (good|fluent)` → en, else other),
 *  precomputed per row so the filter never parses a translated label. */
export type LangBand = 'tr' | 'en' | 'other';

export type TagRef = { id: string } | { brand: string };

export type SampleRow = {
  /** the public reference the basket posts (`PROFILE_REF_PATTERN`) */
  ref: string;
  tradeId: string;
  countryId: string;
  industryId: string;
  /** years of experience */
  exp: number;
  langsId: string;
  lang: LangBand;
  avail: SampleAvail;
  /** two tag chips: a package id, or a brand name the package leaves untranslated ("Fanuc") */
  tags: readonly TagRef[];
  /** the design's `added` flag — the "New" pill (247) and the "recently added" sort */
  added: boolean;
};

const WELDER = 'availworkers.156';
const PAKISTAN = 'availworkers.157';
const CONSTRUCTION = 'availworkers.158';
const EN_BASIC = 'availworkers.159';
const INDIA = 'availworkers.162';
const FACTORY = 'availworkers.163';
const EN_GOOD = 'availworkers.164';
const UZBEKISTAN = 'availworkers.167';
const NEPAL = 'availworkers.171';
const HOTEL = 'availworkers.179';
const SKILL_TESTED = 'availworkers.076';
const AGRICULTURE = 'availworkers.194';

export const SAMPLE_POOL: readonly SampleRow[] = [
  {
    ref: 'JA-1042',
    tradeId: WELDER,
    countryId: PAKISTAN,
    industryId: CONSTRUCTION,
    exp: 6,
    langsId: EN_BASIC,
    lang: 'other',
    avail: 0,
    tags: [{ id: 'availworkers.160' }, { id: 'availworkers.161' }],
    added: true,
  },
  {
    ref: 'JA-1058',
    tradeId: WELDER,
    countryId: INDIA,
    industryId: FACTORY,
    exp: 9,
    langsId: EN_GOOD,
    lang: 'en',
    avail: 0,
    tags: [{ id: 'availworkers.165' }, { id: SKILL_TESTED }],
    added: false,
  },
  {
    ref: 'JA-1077',
    tradeId: 'availworkers.166',
    countryId: UZBEKISTAN,
    industryId: FACTORY,
    exp: 4,
    langsId: 'availworkers.168',
    lang: 'tr',
    avail: 0,
    tags: [{ brand: 'Fanuc' }, { id: 'availworkers.169' }],
    added: true,
  },
  {
    ref: 'JA-1081',
    tradeId: 'availworkers.170',
    countryId: NEPAL,
    industryId: FACTORY,
    exp: 3,
    langsId: EN_BASIC,
    lang: 'other',
    avail: 1,
    tags: [{ id: 'availworkers.172' }, { id: 'availworkers.173' }],
    added: false,
  },
  {
    ref: 'JA-1094',
    tradeId: 'availworkers.174',
    countryId: PAKISTAN,
    industryId: CONSTRUCTION,
    exp: 8,
    langsId: EN_GOOD,
    lang: 'en',
    avail: 0,
    tags: [{ id: 'availworkers.175' }, { id: 'availworkers.176' }],
    added: false,
  },
  {
    ref: 'JA-1103',
    tradeId: 'availworkers.177',
    countryId: 'availworkers.178',
    industryId: HOTEL,
    exp: 3,
    langsId: 'availworkers.180',
    lang: 'tr',
    avail: 0,
    tags: [{ id: 'availworkers.181' }, { id: 'availworkers.182' }],
    added: true,
  },
  {
    ref: 'JA-1118',
    tradeId: 'availworkers.183',
    countryId: 'availworkers.184',
    industryId: HOTEL,
    exp: 5,
    langsId: 'availworkers.185',
    lang: 'en',
    avail: 1,
    tags: [{ id: 'availworkers.186' }, { id: 'availworkers.187' }],
    added: false,
  },
  {
    ref: 'JA-1126',
    tradeId: 'availworkers.188',
    countryId: 'availworkers.189',
    industryId: CONSTRUCTION,
    exp: 4,
    langsId: 'availworkers.190',
    lang: 'tr',
    avail: 1,
    tags: [{ id: 'availworkers.191' }, { id: 'availworkers.192' }],
    added: false,
  },
  {
    ref: 'JA-1134',
    tradeId: 'availworkers.193',
    countryId: NEPAL,
    industryId: AGRICULTURE,
    exp: 2,
    langsId: EN_BASIC,
    lang: 'other',
    avail: 2,
    tags: [{ id: 'availworkers.195' }, { id: 'availworkers.196' }],
    added: false,
  },
  {
    ref: 'JA-1147',
    tradeId: 'availworkers.197',
    countryId: INDIA,
    industryId: CONSTRUCTION,
    exp: 7,
    langsId: EN_GOOD,
    lang: 'en',
    avail: 0,
    tags: [{ id: 'availworkers.198' }, { id: SKILL_TESTED }],
    added: true,
  },
  {
    ref: 'JA-1155',
    tradeId: 'availworkers.199',
    countryId: UZBEKISTAN,
    industryId: HOTEL,
    exp: 4,
    langsId: 'availworkers.200',
    lang: 'tr',
    avail: 0,
    tags: [{ id: 'availworkers.201' }, { id: 'availworkers.202' }],
    added: false,
  },
  {
    ref: 'JA-1162',
    tradeId: 'availworkers.203',
    countryId: 'availworkers.204',
    industryId: FACTORY,
    exp: 11,
    langsId: EN_BASIC,
    lang: 'other',
    avail: 1,
    tags: [{ id: 'availworkers.205' }, { id: 'availworkers.206' }],
    added: false,
  },
];

/** The design's hard-typed portal total (`totalCount: "200+"`, l. 1348) — sample copy shown under
 *  the sample tag, the same figure FAQ 211 quotes; never a metric (D17 governs signed figures). */
export const SAMPLE_TOTAL = '200+';
