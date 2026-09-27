import { useEffect, useRef, useState, type RefObject } from 'react';

/** One `IntersectionObserver` per attached element (task-6-additions.md, W85): the observer is
 *  created and disconnected by an effect keyed on the element and the read options, so two
 *  hook instances never share one observer. `inView` starts `false`, matching the
 *  server-rendered/pre-hydration DOM (SSR-safe) — there is no server-side `IntersectionObserver`
 *  to ask, and reduced motion is irrelevant here: this reports viewport proximity for deferred
 *  loading (`LazyIsland`), not an animation to gate. */
export function useInView<T extends Element>(
  options?: IntersectionObserverInit,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  // Read as primitives, not the `options` object itself: a caller that passes a fresh object
  // literal on every render (`useInView({ rootMargin })`) must not recreate the observer then.
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin;
  const threshold = options?.threshold;
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { root, rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold]);
  return [ref, inView];
}
