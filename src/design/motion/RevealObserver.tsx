'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** What the observer reveals: `.ja-reveal` (the element itself fades and rises) and
 *  `.ja-reveal-group` (a trigger only — its `.ja-step` / `.ja-tl-row` / `.ja-net-row`
 *  descendants animate). Both get `REVEAL_ON`; `src/design/motion/motion.css` does the rest. */
export const REVEAL_ON = 'ja-reveal-on';
/** Added with `REVEAL_ON` by the fallback only: shown at once, never faded (motion.css) — what the
 *  fallback reaches is off-screen, and a fade would only leave part-transparent text for an
 *  audit's contrast check to catch. `REVEAL_INSTANT` stays (no entrance animation replays);
 *  `REVEAL_JUMP` (no transitions) is lifted two frames later, so hover lifts ease again. */
export const REVEAL_INSTANT = 'ja-reveal-instant';
export const REVEAL_JUMP = 'ja-reveal-jump';
const PENDING = `.ja-reveal:not(.${REVEAL_ON}), .ja-reveal-group:not(.${REVEAL_ON})`;

/** The design's own observer options (Homepage v4 and its siblings): an element counts once 6 %
 *  of it is above the bottom 12 % of the viewport. */
export const REVEAL_OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: '0px 0px -12% 0px',
  threshold: 0.06,
};

/** The design's fallback: whatever has not been revealed 6 s after it was found is revealed —
 *  at once (`REVEAL_INSTANT`), where the design faded it. */
export const REVEAL_FALLBACK_MS = 6000;

function pendingIn(scope: ParentNode): Element[] {
  const found = Array.from(scope.querySelectorAll(PENDING));
  if (scope instanceof Element && scope.matches(PENDING)) found.unshift(scope);
  return found;
}

function reducedMotion(): boolean {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

/** Arms the reveal for the current document and returns its teardown. Every pending element is
 *  observed and revealed when it scrolls in; a MutationObserver picks up elements rendered later
 *  (client navigation, a lazy island, a tab panel); each batch found re-arms the 6 s fallback.
 *  Without IntersectionObserver, or under reduced motion, everything is revealed at once. */
export function armReveal(): () => void {
  const reveal = (el: Element) => el.classList.add(REVEAL_ON);
  const instant = typeof IntersectionObserver === 'undefined' || reducedMotion();
  const io = instant
    ? null
    : new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      }, REVEAL_OBSERVER_OPTIONS);
  let fallback: ReturnType<typeof setTimeout> | undefined;
  let frame = 0;
  let jumped: Element[] = [];
  const land = () => {
    jumped.forEach((el) => el.classList.remove(REVEAL_JUMP));
    jumped = [];
  };
  const revealPending = () => {
    for (const el of pendingIn(document)) {
      el.classList.add(REVEAL_ON, REVEAL_INSTANT, REVEAL_JUMP);
      io?.unobserve(el);
      jumped.push(el);
    }
    if (jumped.length === 0) return;
    // two frames: the end state is computed with transitions off before they come back
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(land);
    });
  };
  const track = (elements: Element[]) => {
    if (elements.length === 0) return;
    if (!io) {
      elements.forEach(reveal);
      return;
    }
    elements.forEach((el) => io.observe(el));
    clearTimeout(fallback);
    fallback = setTimeout(revealPending, REVEAL_FALLBACK_MS);
  };
  track(pendingIn(document));
  // Cheap: only added element nodes are queried, and only within their own subtree.
  const mutations =
    typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver((records) => {
          const found: Element[] = [];
          for (const record of records) {
            record.addedNodes.forEach((node) => {
              if (node instanceof Element) found.push(...pendingIn(node));
            });
          }
          track(found);
        });
  mutations?.observe(document.body, { childList: true, subtree: true });
  return () => {
    io?.disconnect();
    mutations?.disconnect();
    clearTimeout(fallback);
    cancelAnimationFrame(frame);
    land();
  };
}

/** The design's scroll reveal, mounted once per page by `ClientIslands` (the locale layout's
 *  client boundary, which outlives client navigations): re-armed on every pathname so the new
 *  page's sections get their own observer and fallback. Renders nothing. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => armReveal(), [pathname]);
  return null;
}
