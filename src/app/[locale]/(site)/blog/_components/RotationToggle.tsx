'use client';
import { useSyncExternalStore } from 'react';
import { Button } from '@/design/primitives/Button';
import { rotation } from '../_lib/rotation';

/** B-4: the rotating word's Pause/Play control (D20; WCAG 2.2.2 — auto-updating text needs a
 *  pause). It sits outside the h1, so the heading's name stays the sentence. Under
 *  `prefers-reduced-motion` nothing moves, so CSS hides it (R20: the server render and the
 *  hydrating client stay identical). Labels arrive resolved — the page reads
 *  `sys.marquee.pause/play` on the server, so no `sys` namespace reaches the client (W148). */
export function RotationToggle({
  pauseLabel,
  playLabel,
}: {
  pauseLabel: string;
  playLabel: string;
}) {
  const paused = useSyncExternalStore(
    rotation.subscribe,
    rotation.isPaused,
    rotation.isPausedOnServer,
  );
  return (
    <Button
      variant="inverse"
      onClick={rotation.toggle}
      className="motion-reduce:hidden"
      data-testid="hero-word-toggle"
    >
      {paused ? playLabel : pauseLabel}
    </Button>
  );
}
