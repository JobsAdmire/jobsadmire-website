'use client';
import { useMemo, type ReactNode } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { buttonClassName } from '@/design/primitives/Button';
import {
  activeFilterCount,
  distinct,
  EXP_BANDS,
  fillSlots,
  type FilterKey,
  type PoolCopy,
  type PoolFilters,
  type PoolWorker,
} from '../_lib/pool-view';
import { usePool } from './PoolContext';

const FIELD_LABEL =
  'text-[11.5px] font-extrabold tracking-[0.8px] text-text-tertiary uppercase max-md:text-[10.5px] xl:text-[11px] xl:tracking-[0.6px]';
const CHIP =
  'min-h-9 rounded-pill border-[1.5px] px-3.75 py-1.75 text-[13.5px] font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:px-3 max-md:text-[12.5px] xl:text-[11px]';
// D20: the active chip wears the contrast-safe blue (white on #1899D5 is 3.2:1)
const CHIP_ON = 'border-blue-safe bg-blue-safe text-white';
const CHIP_OFF =
  'border-field-border bg-white text-[#43536a] hover:border-blue hover:text-blue-safe';
const SELECT =
  'min-h-11 w-full cursor-pointer rounded-[10px] border-[1.5px] border-field-border bg-white px-3.25 py-2.75 text-[14.5px] font-bold text-ink focus:border-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-safe max-md:px-2.25 max-md:text-[16px] xl:text-[11px]';

/** The availability pill per `avail` (the design's `availMeta`, ll. 1273–1277). */
const AVAIL_PILL = [
  'border-success-soft-border bg-success-soft text-success-text',
  'border-tint-border bg-tint text-blue-safe',
  'border-[#f3dfb6] bg-[#fdf3e3] text-warning-text',
] as const;

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.75 shrink-0 text-[#8fb6cd]"
    >
      {children}
    </svg>
  );
}

export function FilterGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  );
}

/** One anonymised profile card (design `.ja-wcard`, ll. 701–745). The avatar is the page's
 *  `ImageSlot` under the design's blur and lock: photos are shared on request only (KVKK). */
function WorkerCard({ w, avatar, copy }: { w: PoolWorker; avatar: ReactNode; copy: PoolCopy }) {
  const { inBasket, toggleRef } = usePool();
  const picked = inBasket(w.ref);
  return (
    <li className="ja-hover-card ja-hover-card-lg flex min-w-0 flex-col overflow-hidden rounded-md border border-edge-soft bg-white max-md:rounded-base">
      <div className="flex items-center gap-3.25 border-b border-border-3 bg-pale-2 px-5 py-4 max-md:gap-2.75 max-md:px-3.75 max-md:py-3.25">
        <span className="relative block size-13 shrink-0 overflow-hidden rounded-[13px] border border-field-border bg-[#e8eef4] max-md:size-11 max-md:rounded-xs">
          {avatar}
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-[rgba(226,234,241,0.55)] text-[#5b7a94] backdrop-blur-[3px]"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4.25"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
        </span>
        <div className="min-w-0 flex-1 leading-[1.3]">
          <div className="flex flex-wrap items-center gap-1.75">
            <span className="text-[12px] font-extrabold tracking-[0.8px] text-text-tertiary xl:text-[11px] xl:tracking-[0.6px]">
              {w.ref}
            </span>
            {w.added && (
              <span className="rounded-pill border border-success-soft-border bg-success-soft px-2 py-0.5 text-[10.5px] font-extrabold tracking-[0.5px] text-success-text uppercase xl:text-[11px]">
                {copy.newLabel}
              </span>
            )}
          </div>
          <h3 className="m-0 truncate text-[17px] font-extrabold tracking-[-0.2px] text-ink max-md:text-[16px] xl:text-[12.75px]">
            {w.trade}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 pt-4 pb-5 max-md:px-3.75 max-md:pt-3.25 max-md:pb-3.75">
        <div className="mb-3.25 flex flex-wrap items-center justify-between gap-2.5 max-md:mb-2.75">
          <span
            className={`shrink-0 rounded-pill border px-2.75 py-1 text-[11.5px] font-extrabold tracking-[0.5px] whitespace-nowrap uppercase xl:text-[11px] ${AVAIL_PILL[w.avail]}`}
          >
            {copy.availLabels[w.avail]}
          </span>
          <span className="text-[11.5px] font-bold whitespace-nowrap text-text-tertiary max-md:hidden xl:text-[11px]">
            {copy.cvOnRequest}
          </span>
        </div>
        <ul className="m-0 mb-4 flex list-none flex-col gap-2 p-0 text-[14px] text-text-secondary max-md:mb-3 max-md:gap-1.5 max-md:text-[13.5px] xl:text-[11px]">
          <li className="flex items-center gap-2.25">
            <Glyph>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </Glyph>
            <span>{w.country}</span>
          </li>
          <li className="flex items-center gap-2.25">
            <Glyph>
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </Glyph>
            <span>
              {w.exp} {copy.yearsExp} · {w.industry}
            </span>
          </li>
          <li className="flex items-center gap-2.25">
            <Glyph>
              <path d="M5 8h9" />
              <path d="M9 4v4" />
              <path d="M11 20l4-9 4 9" />
              <path d="M12.5 17h5" />
              <path d="M5 8c0 4 3 7 7 8" />
            </Glyph>
            <span>{w.langs}</span>
          </li>
        </ul>
        <div className="mb-4.5 flex flex-wrap gap-1.5 max-md:mb-3.25">
          {w.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-pill border border-edge-soft bg-pale-1 px-2.75 py-1 text-[12px] font-bold text-text-secondary xl:text-[11px]"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={picked}
          onClick={() => toggleRef(w.ref)}
          className={[
            'mt-auto flex min-h-11 w-full items-center justify-center gap-2.25 rounded-[11px] border-[1.5px] p-3 text-[14.5px] font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:min-h-12 xl:text-[11px]',
            // D20: the picked face is the contrast-safe green (white on #16a34a is 3.3:1)
            picked
              ? 'border-success-text bg-success-text text-white'
              : 'border-success-soft-border bg-success-soft text-success-text hover:bg-success-surface',
          ].join(' ')}
        >
          <span aria-hidden="true" className="text-[15px] leading-none xl:text-[11.25px]">
            {picked ? '✓' : '+'}
          </span>
          {picked ? copy.added : copy.add}
        </button>
      </div>
    </li>
  );
}

/**
 * The pool body (design ll. 617–760): the collapsed filter panel (profession and country chips,
 * industry / experience / language / availability selects, "Clear all"), the 9-card grid (6 on
 * phones) with "Load more", and the designed no-results card. All client state, no network: the
 * rows are the page's sample (`SAMPLE_POOL`), never the `pool` collection (D23).
 */
export function PoolExplorer({
  rows,
  avatars,
  copy,
  waHire,
}: {
  rows: PoolWorker[];
  /** one server-rendered `ImageSlot` per ref (`ImageSlot` reads `sys.blocks`, a server namespace) */
  avatars: Record<string, ReactNode>;
  copy: PoolCopy;
  /** the page's one WhatsApp prefill (availworkers.224, W95) — the no-results CTA */
  waHire: string;
}) {
  const pool = usePool();
  const { filters, setFilter } = pool;
  const trades = useMemo(() => distinct(rows, 'trade'), [rows]);
  const countries = useMemo(() => distinct(rows, 'country'), [rows]);
  const industries = useMemo(() => distinct(rows, 'industry'), [rows]);
  const active = activeFilterCount(filters);

  const chips = (
    key: 'trade' | 'country',
    all: string,
    values: { key: string; label: string }[],
  ) => (
    <div role="group" aria-labelledby={`pool-f-${key}`}>
      <p id={`pool-f-${key}`} className={`m-0 mb-2.25 ${FIELD_LABEL}`}>
        {copy.labels[key]}
      </p>
      <div className="flex flex-wrap gap-2 max-md:gap-1.75">
        {[{ key: 'all', label: all }, ...values].map((v) => {
          const on = filters[key] === v.key;
          return (
            <button
              key={v.key}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(key, v.key)}
              className={`${CHIP} ${on ? CHIP_ON : CHIP_OFF}`}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const select = <K extends FilterKey>(
    key: K,
    options: { value: PoolFilters[K]; label: string }[],
  ) => (
    <label className="flex flex-col gap-1.5 pt-3 max-md:gap-1.25 max-md:pt-2.75">
      <span className={FIELD_LABEL}>{copy.labels[key]}</span>
      <select
        value={filters[key]}
        onChange={(e) => {
          const hit = options.find((o) => o.value === e.target.value);
          if (hit) setFilter(key, hit.value);
        }}
        className={SELECT}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <>
      <div
        id="pool-filters"
        className="mb-6.5 scroll-mt-24 overflow-hidden rounded-md border border-edge bg-white shadow-[0_10px_30px_rgba(22,60,90,0.07)] max-md:mb-4.5 max-md:rounded-base max-md:shadow-[0_4px_16px_rgba(22,60,90,0.06)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-4 bg-pale-1 px-6 py-3.5 max-md:gap-2.5 max-md:px-3.75 max-md:py-3">
          <button
            type="button"
            aria-expanded={pool.filtersOpen}
            aria-controls="pool-filters-body"
            onClick={pool.toggleFilters}
            className="flex min-h-9 items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
          >
            <FilterGlyph className="size-4 shrink-0 text-blue-safe" />
            <span className="text-[14.5px] font-extrabold text-ink max-md:text-[13.5px] xl:text-[11px]">
              {copy.filterTitle}
            </span>
            {active > 0 && (
              <span className="rounded-pill border border-tint-border bg-tint px-2.75 py-0.75 text-[12px] font-extrabold whitespace-nowrap text-blue-safe xl:text-[11px]">
                {fillSlots(copy.active, { count: active })}
              </span>
            )}
            <span className="ml-0.5 text-[13px] font-extrabold text-blue-safe xl:text-[11px]">
              {pool.filtersOpen ? copy.hide : copy.show}
            </span>
          </button>
          {active > 0 && (
            <button
              type="button"
              onClick={pool.clearFilters}
              className="min-h-9 text-[13.5px] font-extrabold whitespace-nowrap text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px]"
            >
              {copy.clearAll}
            </button>
          )}
        </div>
        <div
          id="pool-filters-body"
          hidden={!pool.filtersOpen}
          className="ja-panel-soft px-6 py-5 max-md:px-3.75 max-md:pt-3.75 max-md:pb-4.5"
        >
          <div className="flex flex-col gap-4 max-md:gap-3.5">
            {chips('trade', copy.all.trade, trades)}
            {chips('country', copy.all.country, countries)}
            <div className="grid grid-cols-2 gap-3.5 border-t border-border-3 pt-1 max-md:gap-2.75 lg:grid-cols-4">
              {select('industry', [
                { value: 'all', label: copy.all.industry },
                ...industries.map((i) => ({ value: i.key, label: i.label })),
              ])}
              {select('exp', [
                { value: 'all', label: copy.all.exp },
                ...EXP_BANDS.map((b) => ({ value: b, label: copy.expBands[b] })),
              ])}
              {select('lang', [
                { value: 'all', label: copy.all.lang },
                { value: 'tr', label: copy.langs.tr },
                { value: 'en', label: copy.langs.en },
              ])}
              {select('avail', [
                { value: 'all', label: copy.all.avail },
                { value: 'now', label: copy.availLabels[0] },
                { value: '30', label: copy.availLabels[1] },
              ])}
            </div>
          </div>
        </div>
      </div>

      {pool.filtered.length > 0 ? (
        <>
          <ul
            id="pool-grid"
            data-testid="pool-grid"
            className="m-0 grid list-none gap-5 p-0 max-md:gap-3 lg:grid-cols-3"
          >
            {pool.visible.map((w) => (
              <WorkerCard key={w.ref} w={w} avatar={avatars[w.ref]} copy={copy} />
            ))}
          </ul>
          {pool.remaining > 0 && (
            <div className="mt-6.5 text-center">
              <button
                type="button"
                onClick={pool.loadMore}
                className={buttonClassName('outline-blue', 'lg', undefined, {
                  shape: 'rect',
                  radius: 11,
                })}
              >
                {fillSlots(copy.loadMore, { count: pool.remaining })}
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          data-testid="pool-no-results"
          className="rounded-md border border-edge-soft bg-pale-1 px-10 py-12 text-center max-md:px-5 max-md:py-8"
        >
          <p className="m-0 mb-2 text-[19px] font-extrabold text-ink xl:text-[14.25px]">
            {copy.empty.title}
          </p>
          <p className="mx-auto mt-0 mb-5 max-w-[460px] text-[15px] leading-[1.6] text-text-tertiary xl:max-w-[345px] xl:text-[11.25px]">
            {copy.empty.body}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* the WhatsApp door through ContactLink in the shared button face (a client
                module never imports ContactCta: W147's client graph keeps that block reached
                only through StickyCtaBar) */}
            <ContactLink
              href={waHire}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('success-solid', 'lg', undefined, {
                shape: 'rect',
                radius: 11,
              })}
            >
              {copy.empty.cta}
            </ContactLink>
            <button
              type="button"
              onClick={pool.clearFilters}
              className={buttonClassName('outline-blue', 'lg', undefined, {
                shape: 'rect',
                radius: 11,
              })}
            >
              {copy.empty.clear}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
