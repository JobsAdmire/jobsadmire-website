import type { SectorKey } from '@/content/collections';

/**
 * Parity pass (owner 2026-10-05): the design's sample content, as PAGE-LOCAL constants. Every
 * section that is data-gated in production shows these rows with the `SampleTag` (or the
 * design's own "örnek" badge) until real rows exist — never `design-package/data/*.sample.json`
 * nor the `stories` collection (D23: that one stays fixture-only and empty on every Vercel
 * build). Copy is package ids only (COPY IS FROZEN); figures, places and ISO-2 country codes
 * are the sample data themselves, typed here and nowhere else (D17: shown with the sample tag,
 * never as a signed metric). Design line refs are `Success Stories.dc.html`.
 */

/** The design's six sector chips after "All sectors" (`renderVals().sectors`, L1047–1055),
 *  labelled by their package ids (`success.125–130`; "All sectors" is `success.124`). */
export const WALL_SECTORS = [
  { id: 'hotels', labelId: 'success.125' },
  { id: 'construction', labelId: 'success.126' },
  { id: 'factory', labelId: 'success.127' },
  { id: 'agriculture', labelId: 'success.128' },
  { id: 'logistics', labelId: 'success.129' },
  { id: 'food', labelId: 'success.130' },
] as const;
export type WallSector = (typeof WALL_SECTORS)[number]['id'];

/** The real-data path: a published story carries the site's sector taxonomy (`SECTOR_KEYS`, the
 *  key every form sends); the wall files it under the design chip that covers it. `other` has no
 *  chip — such a card shows under "All sectors" only, labelled with the site's own label. */
export const WALL_SECTOR_OF: Record<SectorKey, WallSector | null> = {
  tourism: 'hotels',
  construction: 'construction',
  factory: 'factory',
  textile: 'factory',
  agriculture: 'agriculture',
  logistics: 'logistics',
  other: null,
};

export type SampleApproval = {
  id: string;
  sector: WallSector;
  /** the roles line's package id (`success.112–122`) */
  rolesId: string;
  headcount: number;
  /** the design's "Aug 2025" month, as the first of that month (rendered by `formatMonth`) */
  approvedAt: string;
  /** city (and province) only — proper nouns, identical in both locales */
  place: string;
  /** upper-case ISO-2, resolved to names through the `countries` collection */
  countries: string[];
};

/** `approvals()` a1–a9 (L964–976), in the design's order (the sample is not date-sorted; the
 *  real path is, newest first). Their headcounts sum to the hero badge's 288. */
export const SAMPLE_APPROVALS: readonly SampleApproval[] = [
  {
    id: 'a1',
    sector: 'hotels',
    rolesId: 'success.112',
    headcount: 45,
    approvedAt: '2025-08-01',
    place: 'Kemer, Antalya',
    countries: ['UZ', 'NP'],
  },
  {
    id: 'a2',
    sector: 'construction',
    rolesId: 'success.113',
    headcount: 60,
    approvedAt: '2025-05-01',
    place: 'Ankara',
    countries: ['PK', 'IN'],
  },
  {
    id: 'a3',
    sector: 'factory',
    rolesId: 'success.114',
    headcount: 28,
    approvedAt: '2025-03-01',
    place: 'Gaziantep',
    countries: ['UZ', 'KG'],
  },
  {
    id: 'a4',
    sector: 'agriculture',
    rolesId: 'success.115',
    headcount: 34,
    approvedAt: '2026-02-01',
    place: 'Kumluca, Antalya',
    countries: ['TM', 'KG'],
  },
  {
    id: 'a5',
    sector: 'logistics',
    rolesId: 'success.116',
    headcount: 22,
    approvedAt: '2025-10-01',
    place: 'İstanbul',
    countries: ['NP', 'IN'],
  },
  {
    id: 'a6',
    sector: 'food',
    rolesId: 'success.117',
    headcount: 18,
    approvedAt: '2025-06-01',
    place: 'Bodrum',
    countries: ['ID', 'PH'],
  },
  {
    id: 'a7',
    sector: 'hotels',
    rolesId: 'success.118',
    headcount: 26,
    approvedAt: '2026-04-01',
    place: 'Side, Antalya',
    countries: ['KG'],
  },
  {
    id: 'a8',
    sector: 'construction',
    rolesId: 'success.120',
    headcount: 40,
    approvedAt: '2026-01-01',
    place: 'İzmir',
    countries: ['PK'],
  },
  {
    id: 'a9',
    sector: 'factory',
    rolesId: 'success.122',
    headcount: 15,
    approvedAt: '2025-11-01',
    place: 'Denizli',
    countries: ['IN'],
  },
];

/** A blacked-out box on a document frame, in % of the frame (the design's `barStyles`). */
export type RedactBar = { x: number; y: number; w: number; h: number };

/** The "redaction look" of a sample frame (owner ruling): the design draws a frame's bars from
 *  the feed's stored redaction boxes, which the sample has none of — two bars where a name and
 *  an ID number would sit, clear of the placeholder's centred label and of the top badges. */
export const SAMPLE_REDACT: readonly RedactBar[] = [
  { x: 9, y: 72, w: 42, h: 6 },
  { x: 9, y: 82, w: 27, h: 6 },
];

/** The hero's four stat cards (L465–482): 1,240+ / 68 / 41 days / 91 %. `success.029` ("since
 *  2019") contradicts the licence date (W1) — accepted as sample copy under the tag. */
export type SampleHeroStat = {
  value: number;
  /** a sky-blue glyph after the number ("+") */
  plus?: boolean;
  /** a sky-blue per-cent sign, placed by locale (TR `%91`, EN `91%` — D18) */
  percent?: boolean;
  /** a muted unit after the number ("gün", `success.030`) */
  unitId?: string;
  labelId: string;
};
export const SAMPLE_HERO_STATS: readonly SampleHeroStat[] = [
  { value: 1240, plus: true, labelId: 'success.028' },
  { value: 68, labelId: 'success.029' },
  { value: 41, unitId: 'success.030', labelId: 'success.031' },
  { value: 91, percent: true, labelId: 'success.032' },
];

/** "Numbers we do not hide" (L686–720): %7 / +19 days / %4 / 11. The second figure is its own
 *  package string (`success.051` "+19 gün"); the others are numbers formatted per locale. */
export type SampleKpi = {
  figure: { percent: number } | { int: number } | { id: string };
  labelId: string;
  bodyId: string;
};
export const SAMPLE_KPIS: readonly SampleKpi[] = [
  { figure: { percent: 7 }, labelId: 'success.049', bodyId: 'success.050' },
  { figure: { id: 'success.051' }, labelId: 'success.052', bodyId: 'success.053' },
  { figure: { percent: 4 }, labelId: 'success.054', bodyId: 'success.055' },
  { figure: { int: 11 }, labelId: 'success.056', bodyId: 'success.057' },
];

/** The initials tile's face: blue-on-tint, or the design's navy-on-#edf1f9 (the SC tile). */
export type QuoteTone = 'blue' | 'navy';

/** The three employer quotes (L722–761, `success.060–068`); the design's footnote
 *  (`success.069`, "Placeholder quotes…") is a designer note the sample tag replaces. */
export const SAMPLE_QUOTES: readonly {
  id: string;
  quoteId: string;
  roleId: string;
  orgId: string;
  initials: string;
  tone: QuoteTone;
}[] = [
  {
    id: 'hk',
    quoteId: 'success.060',
    roleId: 'success.061',
    orgId: 'success.062',
    initials: 'HK',
    tone: 'blue',
  },
  {
    id: 'sc',
    quoteId: 'success.063',
    roleId: 'success.064',
    orgId: 'success.065',
    initials: 'SC',
    tone: 'navy',
  },
  {
    id: 'fo',
    quoteId: 'success.066',
    roleId: 'success.067',
    orgId: 'success.068',
    initials: 'FO',
    tone: 'blue',
  },
];
