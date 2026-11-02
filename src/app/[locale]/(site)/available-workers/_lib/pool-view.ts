import type { LangBand, SampleAvail } from './sample-pool';

/** One pool row with every label resolved by the page (W9: the islands read no bundle) — a
 *  design sample row, or a real candidate under `POOL_SOURCE=OPS` (`./real-pool.ts`). The `*Key`s
 *  are what the filters compare, never a translated label: package ids for the sample, the feed's
 *  position / group keys and ISO-2 codes for real rows. */
export type PoolWorker = {
  ref: string;
  trade: string;
  tradeKey: string;
  country: string;
  countryKey: string;
  /** '' (and `industryKey` '') when a real row's position has no group */
  industry: string;
  industryKey: string;
  /** years of experience; `null` when the feed does not say */
  exp: number | null;
  langs: string;
  lang: LangBand;
  /** every band the row counts in (a real candidate can speak Turkish AND good English); absent
   *  → `[lang]` */
  langBands?: readonly LangBand[];
  avail: SampleAvail;
  /** the pill's words when a real start date says more than the band (`sys.workers.card.from`) */
  availLabel?: string;
  tags: string[];
  added: boolean;
  /** Real rows only (owner 2026-11-02): the candidate's full name — the card's heading. */
  name?: string;
  /** Real rows only: the nationality's ISO-2 code, for the flag. */
  flag?: string;
  /** Real rows only: "City, Country" — where the candidate is now. */
  location?: string;
  /** Real rows only: when the profile entered the pool — the "recently added" tie-break. */
  addedAt?: string;
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
      (f.exp === 'all' || (w.exp !== null && expBand(w.exp) === f.exp)) &&
      (f.lang === 'all' || (w.langBands ?? [w.lang]).includes(f.lang)) &&
      (f.avail === 'all' || (f.avail === 'now' ? w.avail === 0 : w.avail <= 1)),
  );
}

/** Unknown experience sorts after every known figure. */
const years = (w: PoolWorker) => w.exp ?? -1;

export function sortPool(
  rows: readonly PoolWorker[],
  sort: PoolSort,
  locale: string,
): PoolWorker[] {
  return rows.slice().sort((a, b) => {
    if (sort === 'exp') return years(b) - years(a);
    if (sort === 'new')
      return Number(b.added) - Number(a.added) || (b.addedAt ?? '').localeCompare(a.addedAt ?? '');
    if (sort === 'az') return a.trade.localeCompare(b.trade, locale);
    return a.avail - b.avail || years(b) - years(a);
  });
}

export function activeFilterCount(f: PoolFilters): number {
  return (Object.keys(f) as FilterKey[]).filter((k) => f[k] !== 'all').length;
}

/** The distinct values of one field in first-appearance order — the chips and select options. A
 *  row without a value (a real row's missing group: key '') adds none. */
export function distinct(
  rows: readonly PoolWorker[],
  field: 'trade' | 'country' | 'industry',
): { key: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const w of rows) {
    const key = w[`${field}Key`];
    if (key && !seen.has(key)) seen.set(key, w[field]);
  }
  return [...seen].map(([key, label]) => ({ key, label }));
}

/** "Popular in the pool right now" (`popularChips`, ll. 1369–1380): the four values of `field`
 *  with the most rows, ties in first-appearance order — the industries (the design), or the
 *  professions when no real row carries a group. */
export function popularBy(
  rows: readonly PoolWorker[],
  field: 'industry' | 'trade',
  n = 4,
): { key: string; label: string; count: number }[] {
  const counts = distinct(rows, field).map((d) => ({
    ...d,
    count: rows.filter((w) => w[`${field}Key`] === d.key).length,
  }));
  return counts.sort((a, b) => b.count - a.count).slice(0, n);
}

/** The design's popular chips: the four busiest industries. */
export function popularIndustries(
  rows: readonly PoolWorker[],
  n = 4,
): { key: string; label: string; count: number }[] {
  return popularBy(rows, 'industry', n);
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
  /** sys `pool.cvOnRequest` (the sample: "CV & photo on request"), `card.cvOnRequest` for real
   *  cards, whose photo is on the card */
  cvOnRequest: string;
  /** Real cards only (`sys.workers.card.*`): the screen-reader names of the nationality and
   *  location lines, which otherwise read as two bare country names. */
  card?: { nationality: string; location: string };
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
