import type { ReactNode } from 'react';
import { buttonClassName } from '@/design/primitives/Button';
import { nowMarkerLeft, type SeasonKey } from '../lib/season';
import { LiveDot } from './LiveDot';

export type SeasonRowView = {
  key: SeasonKey;
  name: string;
  sub: string;
  note: string;
  /** "Peak Sep–Dec · also Mar–May" — under the name at ≤ 460 px only (W10) */
  range: string;
  headline: string;
  peak: readonly [number, number];
  second: readonly [number, number] | null;
};

export type SeasonGridCopy = {
  gridLabel: string;
  hint: string;
  legend: { peak: string; second: string; now: string };
  cta: string;
};

const band = (range: readonly [number, number]) => ({
  gridColumn: `${range[0] + 1} / ${range[1] + 2}`,
  gridRow: 1,
});

/**
 * The 12-column planner (design lines 705–760). Rows are `aria-pressed` buttons (the design's
 * clickable rows); without `onSelect` — the server fallback — they are inert until the island
 * mounts. `nowMonth === null` (server) renders no marker, no header highlight and no "Now:" pill:
 * the current month is a browser fact (R18); the pill's slot keeps its height. At ≤ 460 px the rows
 * stack (name, sub, range, then a 34 px bar) and the month header shows initials (W10). No
 * directive: the server section and the island share it.
 */
export function SeasonGrid({
  heading,
  monthsShort,
  rows,
  selected,
  nowMonth,
  nowLabel,
  copy,
  onSelect,
  ready = false,
}: {
  heading: ReactNode;
  monthsShort: string[];
  rows: SeasonRowView[];
  selected: number;
  nowMonth: number | null;
  nowLabel: string | null;
  copy: SeasonGridCopy;
  onSelect?: (index: number) => void;
  ready?: boolean;
}) {
  const active = rows[selected] ?? rows[0];
  return (
    <div data-testid="season-planner" data-island={ready ? 'ready' : undefined}>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-6">
        {heading}
        <span aria-live="polite" className="inline-flex min-h-[38px] items-center">
          {nowLabel ? (
            <span className="inline-flex items-center gap-[9px] whitespace-nowrap rounded-pill border border-tint-border bg-tint px-4 py-[9px] text-[13px] font-extrabold text-blue-safe">
              <LiveDot />
              {nowLabel}
            </span>
          ) : null}
        </span>
      </div>
      <p id="season-hint" className="sr-only">
        {copy.hint}
      </p>
      <div className="-mx-3 overflow-x-auto px-3 pb-1 max-xs:mx-0 max-xs:overflow-x-visible max-xs:px-0">
        <div
          role="group"
          aria-label={copy.gridLabel}
          aria-describedby="season-hint"
          className="min-w-[640px] max-xs:min-w-0"
        >
          <div
            aria-hidden="true"
            className="mb-2.5 grid grid-cols-1 items-center gap-4 xs:grid-cols-[180px_1fr]"
          >
            <span className="max-xs:hidden" />
            <span className="grid grid-cols-12 text-center text-[11.5px] font-extrabold tracking-[0.4px]">
              {monthsShort.map((month, i) => (
                <span
                  key={month}
                  className={i === nowMonth ? 'text-success-text' : 'text-text-tertiary'}
                >
                  <span className="max-xs:hidden">{month}</span>
                  <span className="xs:hidden">{month.charAt(0)}</span>
                </span>
              ))}
            </span>
          </div>
          {rows.map((row, i) => {
            const isActive = i === selected;
            return (
              <button
                key={row.key}
                type="button"
                data-testid={`season-row-${row.key}`}
                aria-pressed={isActive}
                onClick={onSelect ? () => onSelect(i) : undefined}
                className={[
                  'mb-1 grid w-full cursor-pointer grid-cols-1 items-center gap-[7px] rounded-base border border-border-4 p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xs:mb-0 xs:grid-cols-[180px_1fr] xs:gap-4 xs:border-transparent xs:py-[7px] xs:pl-3 xs:pr-2.5',
                  isActive ? 'bg-pale-1' : 'bg-transparent hover:bg-pale-2',
                ].join(' ')}
              >
                <span className="flex min-w-0 flex-col gap-[3px]">
                  <span className="text-[15px] font-extrabold tracking-[-0.3px] text-ink xl:text-[11.25px]">
                    {row.name}
                  </span>
                  <span className="text-[12px] font-bold text-text-secondary">{row.sub}</span>
                  <span className="text-[12px] font-extrabold text-blue-safe xs:hidden">
                    {row.range}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="relative grid h-[46px] grid-cols-12 overflow-hidden rounded-[13px] border border-border-4 bg-[#f4f8fb] max-xs:h-[34px]"
                >
                  <span
                    className={`z-[2] mx-[3px] my-[5px] block rounded-[10px] ${isActive ? 'bg-blue' : 'bg-[#8fcbe8]'}`}
                    style={band(row.peak)}
                  />
                  {row.second ? (
                    <span
                      className={`z-[1] mx-[3px] my-[5px] block rounded-[10px] ${isActive ? 'bg-tint-border' : 'bg-border-1'}`}
                      style={band(row.second)}
                    />
                  ) : null}
                  {nowMonth !== null ? (
                    <span
                      data-now-marker=""
                      className="absolute inset-y-0 z-[3] block w-0.5 bg-success"
                      style={{ left: nowMarkerLeft(nowMonth) }}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-[22px] mt-4 flex flex-wrap items-center gap-[18px] text-[12.5px] font-bold text-text-tertiary">
        <span className="inline-flex items-center gap-[7px]">
          <span aria-hidden="true" className="inline-block h-[9px] w-3.5 rounded-[3px] bg-blue" />
          {copy.legend.peak}
        </span>
        <span className="inline-flex items-center gap-[7px]">
          <span
            aria-hidden="true"
            className="inline-block h-[9px] w-3.5 rounded-[3px] bg-tint-border"
          />
          {copy.legend.second}
        </span>
        <span className="inline-flex items-center gap-[7px]">
          <span aria-hidden="true" className="inline-block h-3 w-0.5 bg-success" />
          {copy.legend.now}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[22px] rounded-lg bg-navy px-7 py-6 text-white max-xs:px-5">
        <div className="min-w-0">
          <p className="m-0 mb-2 text-[11.5px] font-extrabold uppercase tracking-[1.1px] text-sky">
            {active.name}
          </p>
          <p
            data-testid="season-headline"
            className="m-0 mb-1.5 font-display text-[20px] font-extrabold leading-[1.3] tracking-[-0.6px] xl:text-[15px]"
          >
            {active.headline}
          </p>
          <p className="m-0 max-w-[640px] text-[14px] font-semibold leading-[1.55] text-white/65 xl:text-[11px]">
            {active.note}
          </p>
        </div>
        {/* A column flex item stretches: the CTA is full-width at ≤ 460 px without a width class. */}
        <div className="flex flex-col max-xs:w-full">
          <a href="#proposal" className={buttonClassName('primary', 'md')}>
            {copy.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
