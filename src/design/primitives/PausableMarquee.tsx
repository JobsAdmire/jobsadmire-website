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
  // Until the visitor touches the control, the button reflects reduced motion — the CSS
  // has already paused the animation, so it must offer "Play", not claim to be running.
  const [override, setOverride] = useState<boolean | null>(null);
  const paused = override ?? reducedMotion;
  return (
    <div className="relative">
      <div className="overflow-hidden" aria-live="off">
        <div
          className="marquee flex w-max gap-4"
          style={{
            animationDuration: `${durationSec}s`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {children}
          <span aria-hidden="true" className="flex gap-4">
            {children}
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setOverride(!paused)}
        className="absolute right-2 top-2 min-h-[44px] min-w-[44px] rounded-pill bg-white/90 px-3 text-body-sm font-bold shadow-social"
      >
        {paused ? labelPlay : labelPause}
      </button>
    </div>
  );
}
