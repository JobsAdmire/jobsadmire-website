import type { LangBand, SampleAvail } from './sample-pool';

/** One sample row with every label resolved by the page (W9: the islands read no bundle). The
 *  `*Key`s are the package ids the filters compare, never a translated label. */
export type PoolWorker = {
  ref: string;
  trade: string;
  tradeKey: string;
  country: string;
  countryKey: string;
  industry: string;
  industryKey: string;
  exp: number;
  langs: string;
  lang: LangBand;
  avail: SampleAvail;
  tags: string[];
  added: boolean;
};

/** The design's experience bands (`expBand`, l. 1262): 0–3, 4–7, 8+ years. */
export type ExpBand = '0-3' | '4-7' | '8+';
export const EXP_BANDS: readonly ExpBand[] = ['0-3', '4-7', '8+'];
export const expBand = (years: number): ExpBand => (years <= 3 ? '0-3' : years <= 7 ? '4-7' : '8+');

/** `all` or a value per field — the design's six filters (ll. 1264–1271). */
export type PoolFilters = {
  trade: string;
  country: string;
  industry: string;
  exp: 'all' | ExpBand;
  lang: 'all' | 'tr' | 'en';
  avail: 'all' | 'now' | '30';
};
export type FilterKey = keyof PoolFilters;
export const NO_FILTERS: PoolFilters = {
  trade: 'all',
  country: 'all',
  industry: 'all',
  exp: 'all',
  lang: 'all',
  avail: 'all',
};

/** The design's sort options (`sortOpts`, ll. 1354–1359): soonest available (default), most
 *  experience, recently added, profession A–Z. */
export const SORT_KEYS = ['avail', 'exp', 'new', 'az'] as const;
export type PoolSort = (typeof SORT_KEYS)[number];
export const isPoolSort = (v: string): v is PoolSort =>
  (SORT_KEYS as readonly string[]).includes(v);

/** Cards per page: nine in three columns, six on phones (≤ 700 px, the design's `limit`). */
export const PAGE_STEP = { desktop: 9, phone: 6 } as const;

export function filterPool(rows: readonly PoolWorker[], f: PoolFilters): PoolWorker[] {
  return rows.filter(
    (w) =>
      (f.trade === 'all' || w.tradeKey === f.trade) &&
      (f.country === 'all' || w.countryKey === f.country) &&
      (f.industry === 'all' || w.industryKey === f.industry) &&
      (f.exp === 'all' || expBand(w.exp) === f.exp) &&
      (f.lang === 'all' || w.lang === f.lang) &&
      (f.avail === 'all' || (f.avail === 'now' ? w.avail === 0 : w.avail <= 1)),
  );
}

export function sortPool(
  rows: readonly PoolWorker[],
  sort: PoolSort,
  locale: string,
): PoolWorker[] {
  return rows.slice().sort((a, b) => {
    if (sort === 'exp') return b.exp - a.exp;
    if (sort === 'new') return Number(b.added) - Number(a.added);
    if (sort === 'az') return a.trade.localeCompare(b.trade, locale);
    return a.avail - b.avail || b.exp - a.exp;
  });
}

export function activeFilterCount(f: PoolFilters): number {
  return (Object.keys(f) as FilterKey[]).filter((k) => f[k] !== 'all').length;
}

/** The distinct values of one field in first-appearance order — the chips and select options. */
export function distinct(
  rows: readonly PoolWorker[],
  field: 'trade' | 'country' | 'industry',
): { key: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const w of rows) {
    const key = w[`${field}Key`];
    if (!seen.has(key)) seen.set(key, w[field]);
  }
  return [...seen].map(([key, label]) => ({ key, label }));
}

/** "Popular in the pool right now" (`popularChips`, ll. 1369–1380): the four industries with the
 *  most rows, ties in first-appearance order. */
export function popularIndustries(
  rows: readonly PoolWorker[],
  n = 4,
): { key: string; label: string; count: number }[] {
  const counts = distinct(rows, 'industry').map((d) => ({
    ...d,
    count: rows.filter((w) => w.industryKey === d.key).length,
  }));
  return counts.sort((a, b) => b.count - a.count).slice(0, n);
}

/** The stats strip's three derived figures (ll. 1349–1351): ready now, countries, professions. */
export function poolStats(rows: readonly PoolWorker[]) {
  return {
    ready: rows.filter((w) => w.avail === 0).length,
    countries: distinct(rows, 'country').length,
    trades: distinct(rows, 'trade').length,
  };
}

/** Fills a resolved `sys` template's `{name}` slots on the client (`sys.workers.pool.shown`,
 *  `…loadMore`, `…active`, `…ready` arrive raw: `sys.workers` is not a client namespace, W148). */
export function fillSlots(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? String(values[key]) : token,
  );
}

/** The pool islands' copy, resolved by the page (W9). Package ids where the catalogue has the
 *  words, `sys.workers.pool.*` templates (raw, `{slots}` filled by `fillSlots`) where it does not. */
export type PoolCopy = {
  /** sys `pool.shown` — "{total} eşleşmeden {shown} gösteriliyor" */
  shown: string;
  /** `054` */
  sort: string;
  /** `227`–`230` */
  sortOptions: Record<PoolSort, string>;
  /** `059`, `235`, `234`, sys `pool.active` ("{count} aktif"), `060` */
  filterTitle: string;
  show: string;
  hide: string;
  active: string;
  clearAll: string;
  /** field labels: `061`, `062`, `063`, `064`, `017`, `065` */
  labels: {
    trade: string;
    country: string;
    industry: string;
    exp: string;
    lang: string;
    avail: string;
  };
  /** the "all" option per field: `236`, `237`, `238`, `239`, `243`, `246` */
  all: {
    trade: string;
    country: string;
    industry: string;
    exp: string;
    lang: string;
    avail: string;
  };
  /** `240`–`242` */
  expBands: Record<ExpBand, string>;
  /** `244`, `245` */
  langs: { tr: string; en: string };
  /** `207`–`209` — the card pill and the availability options */
  availLabels: readonly [string, string, string];
  /** `247` */
  newLabel: string;
  /** sys `pool.cvOnRequest` */
  cvOnRequest: string;
  /** `248` — after the years */
  yearsExp: string;
  /** `250`, `249` */
  add: string;
  added: string;
  /** sys `pool.loadMore` — "{count} profil daha yükle" */
  loadMore: string;
  /** `066`–`069` */
  empty: { title: string; body: string; cta: string; clear: string };
  /** sys `pool.filter` — the phone pill's button */
  filterShort: string;
};
