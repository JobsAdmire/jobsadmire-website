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
 * first word, `sr-only`; the visible word is `aria-hidden`. As the design draws it (S1.4,
 * `rotatingWord` ~1037): only the current word, inline-block, its 5 px sky underline hugging it,
 * rising in (`ja-wordin`, 0.45 s — keyed on the turn so each change replays it; the first word
 * is painted with the h1, not faded in), the line
 * reflowing around it. The h1 reserves two lines (the design's `min-height`), so a reflow never
 * moves anything below the heading. It rotates every `intervalMs` only after hydration, never
 * under `prefers-reduced-motion`, and stops while `RotationToggle` has paused it. The interval's
 * callback is the only state setter (react-hooks 7: none in an effect body).
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
  // `turns` counts rotations: the word is `turns % words.length`, and only a turned word rises
  // in — the first one is painted with the h1 (the LCP element), never faded in.
  const [turns, setTurns] = useState(0);
  const still = reduced || paused || words.length < 2;
  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => setTurns((n) => n + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [still, intervalMs]);
  const current = reduced ? 0 : turns % words.length;
  const turned = !reduced && turns > 0;
  return (
    <>
      <span className="sr-only" data-testid="hero-word-static">
        {words[0]}
      </span>
      <span aria-hidden="true" data-testid="hero-word-live" className="inline-block">
        <span
          key={turns}
          data-current=""
          className={`${turned ? 'ja-wordin ' : ''}inline-block border-b-[5px] border-sky pb-0.5 leading-none text-sky xl:border-b-[3.75px]`}
        >
          {words[current]}
        </span>
      </span>
    </>
  );
}
