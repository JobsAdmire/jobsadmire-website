import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactElement } from 'react';
import { renderWithIntl } from '@/test/render';
import { PoolProvider } from '../_components/PoolContext';
import type { PoolCopy, PoolWorker } from '../_lib/pool-view';
import { SAMPLE_POOL } from '../_lib/sample-pool';

/** The committed English bundle, read (never imported: D23's lint rule) — the page's real words. */
const EN = (
  JSON.parse(readFileSync(join(process.cwd(), 'src/content/local/bundle.en.json'), 'utf8')) as {
    strings: Record<string, string>;
  }
).strings;
export const en = (id: string): string => {
  const v = EN[id];
  if (v === undefined) throw new Error(`no ${id} in bundle.en.json`);
  return v;
};

/** The sample pool resolved the way the page resolves it. */
export const ROWS: PoolWorker[] = SAMPLE_POOL.map((r) => ({
  ref: r.ref,
  trade: en(r.tradeId),
  tradeKey: r.tradeId,
  country: en(r.countryId),
  countryKey: r.countryId,
  industry: en(r.industryId),
  industryKey: r.industryId,
  exp: r.exp,
  langs: en(r.langsId),
  lang: r.lang,
  avail: r.avail,
  tags: r.tags.map((t) => ('id' in t ? en(t.id) : t.brand)),
  added: r.added,
}));

export const COPY: PoolCopy = {
  shown: 'Showing {shown} of {total} matching',
  sort: en('availworkers.054'),
  sortOptions: {
    avail: en('availworkers.227'),
    exp: en('availworkers.228'),
    new: en('availworkers.229'),
    az: en('availworkers.230'),
  },
  filterTitle: en('availworkers.059'),
  show: en('availworkers.235'),
  hide: en('availworkers.234'),
  active: '{count} active',
  clearAll: en('availworkers.060'),
  labels: {
    trade: en('availworkers.061'),
    country: en('availworkers.062'),
    industry: en('availworkers.063'),
    exp: en('availworkers.064'),
    lang: en('availworkers.017'),
    avail: en('availworkers.065'),
  },
  all: {
    trade: en('availworkers.236'),
    country: en('availworkers.237'),
    industry: en('availworkers.238'),
    exp: en('availworkers.239'),
    lang: en('availworkers.243'),
    avail: en('availworkers.246'),
  },
  expBands: {
    '0-3': en('availworkers.240'),
    '4-7': en('availworkers.241'),
    '8+': en('availworkers.242'),
  },
  langs: { tr: en('availworkers.244'), en: en('availworkers.245') },
  availLabels: [en('availworkers.207'), en('availworkers.208'), en('availworkers.209')],
  newLabel: en('availworkers.247'),
  cvOnRequest: 'CV & photo on request',
  yearsExp: en('availworkers.248'),
  add: en('availworkers.250'),
  added: en('availworkers.249'),
  loadMore: 'Load more profiles ({count} more)',
  empty: {
    title: en('availworkers.066'),
    body: 'No match body',
    cta: en('availworkers.068'),
    clear: en('availworkers.069'),
  },
  filterShort: 'Filter',
};

/** Renders under the page's `PoolProvider` with the English sample and messages. */
export function renderInPool(ui: ReactElement, rows: PoolWorker[] = ROWS) {
  return renderWithIntl(
    <PoolProvider rows={rows} locale="en">
      {ui}
    </PoolProvider>,
    { locale: 'en' },
  );
}
