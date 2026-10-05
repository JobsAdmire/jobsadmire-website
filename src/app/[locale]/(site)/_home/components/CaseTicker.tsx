'use client';
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { CASE_INTERVAL_MS } from '../lib/samples';

/** One case line, every string resolved on the server (W148: no `sys` reaches the client). */
export type CaseLine = { title: string; sub: string; ref: string; ago: string };

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';
// R18: a browser fact — `false` on the server and while hydrating, then the live value.
function subscribeReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const getReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(REDUCE_QUERY).matches;
const getReducedMotionOnServer = () => false;

/**
 * The live case bar's row (design ll. 446–457): the label group (server nodes: the green dot,
 * "Onaylandı" and the sample tag), the case line that rotates every 4.5 s with the `.ja-tick`
 * slide-in (v4 l. 1506 — the remount on `key` replays it), and the approvals link. D20 / WCAG
 * 2.2.2: an auto-updating line needs a pause, so a 24 px Pause/Play toggle sits beside the label
 * (`sys.marquee.pause/play`); the rotation also holds while the pointer or the focus is inside
 * the row, and never runs under `prefers-reduced-motion` (the toggle is then hidden). The line is
 * not a live region — rotating samples are never announced. First paint is case 1 on both sides.
 */
export function CaseTicker({
  cases,
  label,
  link,
  pauseLabel,
  playLabel,
}: {
  cases: CaseLine[];
  label: ReactNode;
  link: ReactNode;
  pauseLabel: string;
  playLabel: string;
}) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const running = !reduced && !paused && !held && cases.length > 1;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % cases.length), CASE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [running, cases.length]);
  const line = cases[index] ?? cases[0];
  if (!line) return null;
  return (
    <div
      className="flex flex-wrap items-center gap-4 max-xs:flex-col max-xs:items-start max-xs:gap-1"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <span className="inline-flex shrink-0 items-center gap-2">
        {label}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? playLabel : pauseLabel}
          data-testid="case-toggle"
          className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-pill border border-white/25 text-white/75 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hidden"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="currentColor"
          >
            {paused ? <path d="M2.5 1.2v7.6L8.8 5z" /> : <path d="M2 1h2.2v8H2zM5.8 1H8v8H5.8z" />}
          </svg>
        </button>
      </span>
      <span
        key={index}
        data-testid="case-line"
        className="ja-tick flex min-w-0 flex-wrap items-baseline gap-x-3.5 gap-y-1 max-xs:flex-col max-xs:gap-[3px]"
      >
        <span className="text-[14.5px] font-bold text-white max-xs:text-[15px] max-xs:leading-[1.35] max-xs:tracking-[-0.3px] xl:text-[11px]">
          {line.title}
        </span>
        <span className="text-[13px] font-semibold text-white/55 max-xs:text-[12.5px] max-xs:leading-[1.45] xl:text-[11px]">
          {line.sub}
        </span>
        <span className="inline-flex items-center gap-[7px] text-[11.5px] font-extrabold tracking-[0.4px] text-white/55 xl:text-[11px]">
          {line.ref}
          <span
            aria-hidden="true"
            className="inline-block h-[3px] w-[3px] rounded-pill bg-white/35"
          />
          {line.ago}
        </span>
      </span>
      {link}
    </div>
  );
}
