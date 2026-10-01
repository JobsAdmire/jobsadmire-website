'use client';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { SeasonGrid, type SeasonGridCopy, type SeasonRowView } from './SeasonGrid';

export type SeasonPlannerProps = {
  heading: ReactNode;
  /** computed by the server with Intl, so client and server never disagree on a month name */
  monthsShort: string[];
  rows: SeasonRowView[];
  /** home.217 — "Now:" / "Şimdi:" */
  nowPrefix: string;
  copy: SeasonGridCopy;
};

// R18: the current month is a browser fact — read through useSyncExternalStore, `null` on the
// server. The snapshot is a primitive (year × 12 + month), stable for the whole month.
const subscribe = () => () => {};
const monthKey = () => {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
};
const serverMonthKey = (): number | null => null;

/** The interactive planner: row selection plus the visitor's own "this month" (pill, header
 *  highlight, marker). The headlines arrive precomputed — the year-round row's is the no-peak
 *  line, so no headline depends on the date. */
export function SeasonPlanner({ heading, monthsShort, rows, nowPrefix, copy }: SeasonPlannerProps) {
  const key = useSyncExternalStore<number | null>(subscribe, monthKey, serverMonthKey);
  const [selected, setSelected] = useState(0);
  const nowMonth = key === null ? null : key % 12;
  const nowLabel =
    key === null ? null : `${nowPrefix} ${monthsShort[key % 12]} ${Math.floor(key / 12)}`;
  return (
    <SeasonGrid
      ready
      heading={heading}
      monthsShort={monthsShort}
      rows={rows}
      selected={selected}
      nowMonth={nowMonth}
      nowLabel={nowLabel}
      copy={copy}
      onSelect={setSelected}
    />
  );
}
