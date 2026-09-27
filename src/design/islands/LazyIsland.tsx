'use client';
import { lazy, Suspense, useState, type ComponentType, type ReactNode } from 'react';
import { useInView } from './useInView';

export type LazyIslandProps<P extends object> = {
  load: () => Promise<{ default: ComponentType<P> }>;
  props: P;
  fallback: ReactNode;
  rootMargin?: string;
  ssr?: boolean;
};

/** Defers a heavy island's own module (the calculator, the blog search/TOC — W13 amended)
 *  until it is near the viewport, without depending on `next/dynamic`'s build-time split for
 *  the "on viewport" half: `useInView` (W85) gates when `load()` first runs, since
 *  `React.lazy` does not call its loader until the component it wraps is actually rendered.
 *  `fallback` must be DOM identical to the real island's own initial state — it is what
 *  renders first (and, when `ssr` is true, what the server sends), so there is nothing to
 *  visually swap once the real island mounts. `ssr` (default `true`, matching `next/dynamic`)
 *  controls whether `fallback` renders eagerly, i.e. takes part in the very first paint, or
 *  only appears once the element has actually been observed. */
export function LazyIsland<P extends object>({
  load,
  props,
  fallback,
  rootMargin = '200px',
  ssr = true,
}: LazyIslandProps<P>) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin });
  // `useState`'s lazy initializer runs exactly once (on mount), never again: a fresh
  // `lazy(load)` on every render would remount the Suspense boundary (and re-invoke `load`)
  // instead of reusing the same lazy component reference. `react-hooks/refs` forbids reading
  // a ref's `.current` during render even to lazy-init it, so this is the sanctioned idiom.
  const [LazyComponent] = useState<ComponentType<P>>(() => lazy(load));

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      ) : ssr ? (
        fallback
      ) : null}
    </div>
  );
}
