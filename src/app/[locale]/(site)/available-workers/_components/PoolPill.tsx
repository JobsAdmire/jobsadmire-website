'use client';
import { useSyncExternalStore } from 'react';
import { fillSlots } from '../_lib/pool-view';
import { FilterGlyph } from './PoolExplorer';
import { usePool } from './PoolContext';

function subscribeToViewport(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}
/** The design's rule (l. 1147): the grid's top above 55 % of the viewport and its bottom still
 *  more than 160 px down. Phones only — the liquid desktop's root zoom never applies here. */
function gridInView() {
  const grid = document.getElementById('pool-grid');
  if (!grid) return false;
  const r = grid.getBoundingClientRect();
  return r.top < window.innerHeight * 0.55 && r.bottom > 160;
}
const onServer = () => false;

/**
 * The phone pool pill (design `.ja-pool-pill`, ll. 930–933, ≤ 700 px): while the card grid is on
 * screen, a dark pill above the bottom bar repeats "n of m shown" and offers "Filter", which opens
 * the filter panel and jumps to it. It fades and slides in; off screen it is inert.
 */
export function PoolPill({ shown, filter }: { shown: string; filter: string }) {
  const { visible, filtered, filters, openFiltersJump } = usePool();
  const on = useSyncExternalStore(subscribeToViewport, gridInView, onServer);
  const active = Object.values(filters).filter((v) => v !== 'all').length;
  return (
    <div
      data-testid="pool-pill"
      aria-hidden={on ? undefined : true}
      inert={!on}
      className={[
        'fixed bottom-20.5 left-1/2 z-[56] flex -translate-x-1/2 items-center gap-2.5 rounded-pill border border-white/18 bg-night/94 py-2.25 pr-2 pl-4 shadow-[0_12px_30px_rgba(3,10,26,0.4)] backdrop-blur-[10px] transition-[opacity,translate] duration-200 motion-reduce:transition-none md:hidden',
        on ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3.5 opacity-0',
      ].join(' ')}
    >
      <span className="text-[13px] font-extrabold whitespace-nowrap text-white/90">
        {fillSlots(shown, { shown: visible.length, total: filtered.length })}
      </span>
      <button
        type="button"
        onClick={openFiltersJump}
        className="inline-flex min-h-9 items-center gap-1.75 rounded-pill border border-white/24 bg-white/14 px-3.5 text-[13px] font-extrabold whitespace-nowrap text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky active:bg-white/26"
      >
        <FilterGlyph className="size-3.5 shrink-0" />
        {filter}
        {active > 0 ? ` (${active})` : ''}
      </button>
    </div>
  );
}
