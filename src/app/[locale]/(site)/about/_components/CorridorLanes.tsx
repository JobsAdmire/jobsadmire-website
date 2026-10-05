'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';

const REDUCE = '(prefers-reduced-motion: reduce)';

// The same guard as the blog's RotatingWord: the preference is a browser fact read after
// hydration, and jsdom (or any non-browser runtime) has no matchMedia.
function subscribeReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const getReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(REDUCE).matches;
const getReducedMotionOnServer = () => false;

/** The design's four lanes (About l. 556–594): a ring marker and a flying dot per lane, each in
 *  its own colour (#1899D5 / #8b5cf6 / #f59e0b / #0ea5a3) — decorative, so the brand values stand
 *  (the names beside them are ink). The dots keep the global `about-fly` keyframe (6 s, staggered
 *  1.5 s), which the site-wide reduced-motion rule stops. */
const LANE_TONE = [
  { ring: 'border-blue', dot: 'bg-blue' },
  { ring: 'border-[#8b5cf6]', dot: 'bg-[#8b5cf6]' },
  { ring: 'border-warning', dot: 'bg-warning' },
  { ring: 'border-[#0ea5a3]', dot: 'bg-[#0ea5a3]' },
] as const;
const DELAY = ['', '[animation-delay:1.5s]', '[animation-delay:3s]', '[animation-delay:4.5s]'];

/** Which country each lane shows at rotation step `off` — the design's own formula (l. 1090–1131:
 *  `stride = max(1, floor(n / 4))`, lane i = `countries[(off + stride · i) % n]`). */
export function laneNames(names: readonly string[], off: number): string[] {
  const n = names.length;
  if (n === 0) return [];
  const stride = Math.max(1, Math.floor(n / LANE_TONE.length));
  return LANE_TONE.slice(0, Math.min(LANE_TONE.length, n)).map(
    (_, i) => names[(off + stride * i) % n],
  );
}

/**
 * The corridor card's lanes, rotating through the `sourceCountries` names every 2.5 s like the
 * design's `laneOffset` timer (l. 1077). The moving picture is `aria-hidden`; assistive tech
 * reads the static list of every country instead, so nothing announces itself every 2.5 s. It
 * rotates only after hydration, never under `prefers-reduced-motion` (WCAG 2.2.2, D20), and
 * holds still while the pointer is over it. The first frame is the server's (`off` 0).
 */
export function CorridorLanes({
  names,
  intervalMs = 2500,
}: {
  names: readonly string[];
  intervalMs?: number;
}) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
  const [off, setOff] = useState(0);
  const [hovered, setHovered] = useState(false);
  const still = reduced || hovered || names.length <= LANE_TONE.length;
  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => setOff((o) => o + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [still, intervalMs]);
  const lanes = laneNames(names, reduced ? 0 : off);
  return (
    <>
      <ul className="sr-only">
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <ul
        aria-hidden="true"
        data-testid="about-lanes"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="m-0 flex list-none flex-col gap-3.5 p-0"
      >
        {lanes.map((name, i) => (
          <li key={i} className="grid grid-cols-[7.5rem_1fr] items-center gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className={`h-2.25 w-2.25 shrink-0 rounded-pill border-[2.5px] ${LANE_TONE[i].ring}`}
              />
              <span className="truncate text-[14px] font-extrabold text-ink xl:text-[11px]">
                {name}
              </span>
            </span>
            <span className="relative block h-4.5">
              <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-[#c9e0ee]" />
              <span className={`about-fly absolute inset-y-0 right-2.5 left-0 ${DELAY[i] ?? ''}`}>
                <span
                  className={`absolute top-1/2 left-0 h-2.25 w-2.25 -translate-y-1/2 rounded-pill ${LANE_TONE[i].dot}`}
                />
              </span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
