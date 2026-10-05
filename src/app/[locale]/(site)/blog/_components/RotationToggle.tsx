'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { rotation } from '../_lib/rotation';

/** B-4: the rotating word's Pause/Play control (D20; WCAG 2.2.2 — auto-updating text needs a
 *  pause). The design has none, so it is the smallest honest form of it (S1.5): a 32 px icon
 *  button beside the h1 line (24 px from 1101 — the 2.5.8 minimum), outside the heading so the
 *  heading's name stays the sentence; its name says what it does ("Duraklat" / "Oynat"). It also
 *  pauses the hero art's floats: it sets `data-paused` on `targetId`, which the floats read
 *  (`group-data-[paused]/hero`). Under `prefers-reduced-motion` nothing moves, so CSS hides it
 *  (R20: the server render and the hydrating client stay identical). Labels arrive resolved —
 *  the page reads `sys.marquee.pause/play` on the server, so no `sys` namespace reaches the
 *  client (W148). */
export function RotationToggle({
  pauseLabel,
  playLabel,
  targetId,
}: {
  pauseLabel: string;
  playLabel: string;
  targetId?: string;
}) {
  const paused = useSyncExternalStore(
    rotation.subscribe,
    rotation.isPaused,
    rotation.isPausedOnServer,
  );
  useEffect(() => {
    if (!targetId) return;
    document.getElementById(targetId)?.toggleAttribute('data-paused', paused);
  }, [targetId, paused]);
  return (
    <button
      type="button"
      onClick={rotation.toggle}
      aria-label={paused ? playLabel : pauseLabel}
      title={paused ? playLabel : pauseLabel}
      data-testid="hero-word-toggle"
      className="mt-1.5 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-pill border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky motion-reduce:hidden max-md:mt-0.5"
    >
      {paused ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
          <rect x="6.5" y="5" width="4" height="14" rx="1" />
          <rect x="13.5" y="5" width="4" height="14" rx="1" />
        </svg>
      )}
    </button>
  );
}
