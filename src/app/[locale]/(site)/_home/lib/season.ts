import type { Locale } from '@/i18n/routing';

export type SeasonKey = 'agriculture' | 'tourism' | 'construction' | 'factory';

export type SeasonRow = {
  key: SeasonKey;
  nameId: string;
  /** null = the agriculture row's place list, which has no package id (sys.home.season.agricultureSub) */
  subId: string | null;
  noteId: string;
  /** 0-based months, inclusive */
  peak: readonly [number, number];
  second: readonly [number, number] | null;
  /** 0-based start month; null for the year-round row (its headline is the no-peak line) */
  start: number | null;
};

/** The design's SEASONS table (JobsAdmire Homepage v4, renderVals). The month numbers are data;
 *  every visible string is a package id the section resolves. */
export const SEASON_ROWS: readonly SeasonRow[] = [
  {
    key: 'agriculture',
    nameId: 'home.243',
    subId: null,
    noteId: 'home.250',
    peak: [8, 11],
    second: [2, 4],
    start: 8,
  },
  {
    key: 'tourism',
    nameId: 'home.247',
    subId: 'home.244',
    noteId: 'home.251',
    peak: [3, 9],
    second: [10, 11],
    start: 3,
  },
  {
    key: 'construction',
    nameId: 'home.248',
    subId: 'home.245',
    noteId: 'home.252',
    peak: [2, 10],
    second: null,
    start: 2,
  },
  {
    key: 'factory',
    nameId: 'home.249',
    subId: 'home.246',
    noteId: 'home.253',
    peak: [0, 11],
    second: null,
    start: null,
  },
];

/** The design's `backTwo`: sign two months before the start month, wrapping the year. */
export function signByMonth(start: number): number {
  return (start + 10) % 12;
}

// 'en' (en-US), not the repo's en-GB date locale: en-GB abbreviates September as "Sept" since
// ICU 72, while the design's column header says "Sep".
const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en' };

/** Twelve month names from Intl (W9: never a hard-coded list) — 'short' for the grid header and
 *  the ranges, 'long' for the headline; mid-month UTC dates so no zone can shift a month. The
 *  server computes them and hands them to the island, so client and server never disagree. */
export function monthNames(locale: Locale, style: 'short' | 'long'): string[] {
  const format = new Intl.DateTimeFormat(INTL[locale], { month: style, timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, m) => format.format(new Date(Date.UTC(2026, m, 15))));
}

/** The green "this month" line, centred in its column of twelve. */
export function nowMarkerLeft(month: number): string {
  return `${((month + 0.5) * (100 / 12)).toFixed(2)}%`;
}

/** The translator surface (sys ICU strings) — the section passes closures; no next-intl here (R23). */
export type SeasonTx = {
  range: (args: { from: string; to: string }) => string;
  also: (args: { from: string; to: string }) => string;
  signBy: (args: { start: string; signBy: string }) => string;
  noPeak: () => string;
};

export function seasonRange(
  row: Pick<SeasonRow, 'peak' | 'second'>,
  short: string[],
  tx: SeasonTx,
): string {
  const peak = tx.range({ from: short[row.peak[0]], to: short[row.peak[1]] });
  return row.second
    ? peak + tx.also({ from: short[row.second[0]], to: short[row.second[1]] })
    : peak;
}

export function seasonHeadline(
  row: Pick<SeasonRow, 'start'>,
  long: string[],
  tx: SeasonTx,
): string {
  if (row.start === null) return tx.noPeak();
  return tx.signBy({ start: long[row.start], signBy: long[signByMonth(row.start)] });
}
