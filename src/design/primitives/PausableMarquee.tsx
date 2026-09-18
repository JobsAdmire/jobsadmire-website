'use client';
import { useState, useSyncExternalStore, type ReactNode } from 'react';

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

// R18: the real reduced-motion state, never read during the server render — the server
// and the hydrating client both see `false`, then React re-renders with the live value.
// Guarded because jsdom (and any non-browser runtime) has no `matchMedia`.
function subscribeReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const getReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(REDUCE_QUERY).matches;
const getReducedMotionOnServer = () => false;

export function PausableMarquee({
  children,
  durationSec,
  labelPause,
  labelPlay,
}: {
  children: ReactNode;
  durationSec: number;
  labelPause: string;
  labelPlay: string;
}) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
  const [override, setOverride] = useState<boolean | null>(null);
  // R20: under reduced motion the CSS pauses the track outright and hides this toggle, so
  // the component must not let a stale override claim a running state — and it omits the
  // inline play-state entirely, leaving the stylesheet the single source of truth.
  const paused = reducedMotion || (override ?? false);
  return (
    <div className="relative">
      <div className="overflow-hidden" aria-live="off">
        <div
          className="marquee flex w-max gap-4"
          style={{
            animationDuration: `${durationSec}s`,
            ...(reducedMotion ? null : { animationPlayState: paused ? 'paused' : 'running' }),
          }}
        >
          <span className="flex gap-4">{children}</span>
          {/* The second copy is the seamless-loop filler: hidden from the tree and inert, so
              its links/logos are neither focusable nor duplicated to assistive tech. */}
          <span aria-hidden="true" inert className="flex gap-4">
            {children}
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setOverride(!paused)}
        className="marquee-toggle absolute right-2 top-2 min-h-[44px] min-w-[44px] rounded-pill bg-white/90 px-3 text-body-sm font-bold shadow-social focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
      >
        {paused ? labelPlay : labelPause}
      </button>
    </div>
  );
}
