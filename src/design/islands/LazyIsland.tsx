'use client';
import { lazy, Suspense, useState, type ComponentType, type ReactNode } from 'react';
import { useInView } from './useInView';

export type LazyIslandProps<P extends object> = {
  load: () => Promise<{ default: ComponentType<P> }>;
  props: P;
  /** DOM-identical to the island's own initial state: the server sends it, and it shows until
   *  the wrapper first nears the viewport, while the chunk loads, and for good if it fails. */
  fallback: ReactNode;
  /** How far outside the viewport loading starts (`IntersectionObserver` syntax). */
  rootMargin?: string;
};

/** What a failed `load()` resolves to instead (W132): a chunk error after a deploy keeps the
 *  fallback on the page rather than reaching the route's error boundary. */
function fallbackModule<P extends object>(fallback: ReactNode): { default: ComponentType<P> } {
  return {
    default: function LoadFailed() {
      return <>{fallback}</>;
    },
  };
}

/** Defers a heavy island's own module (the calculator, the blog search/TOC — W13 amended) until
 *  its wrapper first comes within `rootMargin` of the viewport, without depending on
 *  `next/dynamic`'s build-time split for the "on viewport" half (W85, W132). `useInView` with
 *  `once` gates when `load()` first runs, since `React.lazy` does not call its loader until the
 *  component it wraps is rendered. Until then `fallback` renders — on the server and on the
 *  client alike; after that the island is loaded once and stays mounted for this component's
 *  life, so scrolling away never unmounts it (the calculator keeps its inputs). */
export function LazyIsland<P extends object>({
  load,
  props,
  fallback,
  rootMargin = '200px',
}: LazyIslandProps<P>) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin, once: true });
  // `useState`'s lazy initializer runs exactly once (on mount): a fresh `lazy()` on every
  // render would remount the Suspense boundary and re-invoke `load`. `react-hooks/refs` forbids
  // reading a ref's `.current` during render even to lazy-init it, so this is the idiom.
  const [Island] = useState<ComponentType<P>>(() =>
    lazy(() => load().catch(() => fallbackModule<P>(fallback))),
  );

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={fallback}>
          <Island {...props} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
