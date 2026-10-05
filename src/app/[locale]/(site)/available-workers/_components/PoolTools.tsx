'use client';
import { fillSlots, isPoolSort, SORT_KEYS, type PoolCopy } from '../_lib/pool-view';
import { usePool } from './PoolContext';

/** The pool head's right side (design `.ja-pool-tools`, ll. 605–616): the "showing n of m" pill
 *  and the sort select. One row that never wraps on phones (ll. 375–380). */
export function PoolTools({ copy }: { copy: Pick<PoolCopy, 'shown' | 'sort' | 'sortOptions'> }) {
  const { visible, filtered, sort, setSort } = usePool();
  return (
    <div className="flex flex-wrap items-center gap-3 max-md:mt-3.5 max-md:flex-nowrap max-md:gap-2.25">
      <p
        aria-live="polite"
        className="m-0 rounded-pill border border-edge-soft bg-pale-1 px-5 py-2.25 text-[14px] font-extrabold whitespace-nowrap text-ink max-md:flex-none max-md:px-3.5 max-md:py-2 max-md:text-[12.5px] xl:text-[11px]"
      >
        {fillSlots(copy.shown, { shown: visible.length, total: filtered.length })}
      </p>
      <label className="inline-flex items-center gap-2 max-md:min-w-0 max-md:flex-auto max-md:justify-end">
        <span className="text-[12.5px] font-extrabold tracking-[0.6px] whitespace-nowrap text-text-tertiary uppercase max-md:text-[11px] xl:text-[11px] xl:tracking-[0.45px]">
          {copy.sort}
        </span>
        <select
          value={sort}
          onChange={(e) => {
            if (isPoolSort(e.target.value)) setSort(e.target.value);
          }}
          className="min-h-10 cursor-pointer rounded-[10px] border-[1.5px] border-field-border bg-white px-3.25 py-2.25 text-[14px] font-bold text-ink focus:border-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-safe max-md:min-w-0 max-md:flex-auto max-md:px-2.5 max-md:text-[16px] xl:text-[11px]"
        >
          {SORT_KEYS.map((key) => (
            <option key={key} value={key}>
              {copy.sortOptions[key]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
