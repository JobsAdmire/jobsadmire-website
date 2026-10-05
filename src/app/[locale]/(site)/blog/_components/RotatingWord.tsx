'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { rotation } from '../_lib/rotation';

const REDUCE = '(prefers-reduced-motion: reduce)';

// R18 + PausableMarquee's guard: the preference is a browser fact read after hydration, and
// jsdom (or any non-browser runtime) has no matchMedia.
function subscribeReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const getReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(REDUCE).matches;
const getReducedMotionOnServer = () => false;

/**
 * B-4 (D20, WCAG 2.2.2): the h1's rotating word. What assistive tech and crawlers read is the
 * first word, `sr-only`; the visible stack is `aria-hidden` and holds every word in one grid
 * cell — only the current one visible — so the box is always the widest word and a rotation
 * never reflows the heading (no layout shift). It rotates every `intervalMs` only after
 * hydration, never under `prefers-reduced-motion`, and stops while `RotationToggle` has paused
 * it. The interval's callback is the only state setter (react-hooks 7: none in an effect body).
 */
export function RotatingWord({
  words,
  intervalMs = 2600,
}: {
  words: string[];
  intervalMs?: number;
}) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
  const paused = useSyncExternalStore(
    rotation.subscribe,
    rotation.isPaused,
    rotation.isPausedOnServer,
  );
  const [index, setIndex] = useState(0);
  const still = reduced || paused || words.length < 2;
  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => window.clearInterval(id);
  }, [still, words.length, intervalMs]);
  const current = reduced ? 0 : index;
  return (
    <>
      <span className="sr-only" data-testid="hero-word-static">
        {words[0]}
      </span>
      <span
        aria-hidden="true"
        data-testid="hero-word-live"
        className="inline-grid border-b-[5px] border-sky pb-0.5 leading-none text-sky"
      >
        {words.map((word, i) => (
          <span
            key={word}
            data-current={i === current ? '' : undefined}
            className={
              // `ja-wordin`: the design's rise-in, replayed each time a word becomes current
              i === current
                ? 'ja-wordin col-start-1 row-start-1'
                : 'invisible col-start-1 row-start-1'
            }
          >
            {word}
          </span>
        ))}
      </span>
    </>
  );
}
