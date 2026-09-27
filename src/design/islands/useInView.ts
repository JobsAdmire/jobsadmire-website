'use client';
import { useEffect, useState, type RefCallback } from 'react';

/** One `IntersectionObserver` per observed element (W85, W132). The element arrives through the
 *  returned callback ref and is held in state, so an element that mounts after the hook, or is
 *  remounted under a new key, is (re)observed; the observer is created and disconnected by an
 *  effect keyed on that element and the read options, and a batch of entries is folded to its
 *  latest record. `once` latches `inView` at `true` on the first intersection and disconnects.
 *  `inView` starts `false`, matching the server-rendered/pre-hydration DOM (SSR-safe), and stays
 *  `false` where there is no `IntersectionObserver` (no target browser lacks it). Reduced
 *  motion is irrelevant here: this reports viewport proximity for deferred loading
 *  (`LazyIsland`), not an animation to gate. */
export function useInView<T extends Element>(
  options?: IntersectionObserverInit & { once?: boolean },
): [RefCallback<T>, boolean] {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  // Read as primitives, not the `options` object itself: a caller that passes a fresh object
  // literal on every render (`useInView({ rootMargin })`) must not recreate the observer then.
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin;
  const threshold = options?.threshold;
  const once = options?.once ?? false;
  const latched = once && inView;
  useEffect(() => {
    if (!node || latched || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const latest = entries[entries.length - 1];
        if (!latest) return;
        if (latest.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root, rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, latched, once, root, rootMargin, threshold]);
  // The state setter is the callback ref: stable across renders, called with the element on
  // attach and with `null` on detach.
  return [setNode, inView];
}
