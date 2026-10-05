/**
 * The design's sample content for the homepage's data-gated blocks, as PAGE-LOCAL constants (owner
 * 2026-10-05): the live case bar and the candidate pool render these with the `SampleTag` until
 * Operations publishes real stories and profiles. Never `design-package/data/*.sample.json`, never
 * the `stories` / `pool` collections (D23). Every text is a package id — the design's own sample
 * strings were imported with the page (home.229–239, home.275–289) — so the copy stays the
 * catalogue's (copy freeze, 2026-10-05); refs and day counts are the design's data.
 */

/** `cases` (Homepage v4 ll. 1573–1580): title, sub, ref and recency per case. The design gives an
 *  explicit ref/recency to three cases and derives the rest (`"JA-10" + (i + 60)`,
 *  `(i + 2) + " days ago"`, ll. 1828–1831) — those derived values are spelled out here. */
export type SampleCase = {
  titleId: string;
  subId: string;
  ref: string;
  /** a package id ("2 saat önce", "dün") or a day count for `sys.home.cases.daysAgo` */
  ago: { id: string } | { days: number };
};

export const SAMPLE_CASES: readonly SampleCase[] = [
  { titleId: 'home.275', subId: 'home.280', ref: 'JA-1042', ago: { id: 'home.279' } },
  { titleId: 'home.276', subId: 'home.282', ref: 'JA-1058', ago: { id: 'home.289' } },
  { titleId: 'home.283', subId: 'home.284', ref: 'JA-1062', ago: { days: 4 } },
  { titleId: 'home.285', subId: 'home.286', ref: 'JA-1063', ago: { days: 5 } },
  { titleId: 'home.277', subId: 'home.287', ref: 'JA-1064', ago: { days: 6 } },
  { titleId: 'home.278', subId: 'home.288', ref: 'JA-1103', ago: { days: 3 } },
];

/** The design's case rotation interval (v4 l. 1506: every 4.5 s). */
export const CASE_INTERVAL_MS = 4500;

/** `POOL` (Homepage v4 ll. 1603–1610): six sample profiles. The country is an ISO-2 code read
 *  against the `sourceCountries` collection for its localized name and flag; `tagId` is null for
 *  "Fanuc", a brand name the design leaves untranslated (TRX l. 1617). Years of experience go
 *  through `sys.home.pool.years`. The photo slot is `pool-<ref>`, a labelled placeholder — the
 *  sample never shows a real person's photo. */
export type SamplePoolCard = {
  ref: string;
  tradeId: string;
  country: string;
  years: number;
  tagId: string | null;
  tag?: string;
};

export const SAMPLE_POOL: readonly SamplePoolCard[] = [
  { ref: 'JA-1042', tradeId: 'home.229', country: 'PK', years: 6, tagId: 'home.235' },
  { ref: 'JA-1077', tradeId: 'home.230', country: 'UZ', years: 4, tagId: null, tag: 'Fanuc' },
  { ref: 'JA-1103', tradeId: 'home.231', country: 'KG', years: 3, tagId: 'home.236' },
  { ref: 'JA-1134', tradeId: 'home.232', country: 'NP', years: 2, tagId: 'home.237' },
  { ref: 'JA-1150', tradeId: 'home.233', country: 'IN', years: 5, tagId: 'home.238' },
  { ref: 'JA-1168', tradeId: 'home.234', country: 'PH', years: 4, tagId: 'home.239' },
];
