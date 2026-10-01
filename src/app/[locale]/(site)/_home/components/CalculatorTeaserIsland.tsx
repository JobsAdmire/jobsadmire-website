'use client';
import type { ReactNode } from 'react';
import { LazyIsland } from '@/design/islands/LazyIsland';
import type { CalculatorTeaserProps } from './CalculatorTeaser';

// A function prop cannot cross the server → client boundary, so the `load` thunk lives in this
// thin client module; the type-only import keeps the island itself out of this eager chunk.
const load = () => import('./CalculatorTeaser').then((m) => ({ default: m.CalculatorTeaser }));

/** W13 amended / W132: the teaser's chunk loads once its wrapper comes within 200 px of the
 *  viewport and stays mounted; until then (and for good if the chunk fails) the server fallback
 *  shows — DOM-identical to the island's first render. */
export function CalculatorTeaserIsland({
  fallback,
  ...props
}: CalculatorTeaserProps & { fallback: ReactNode }) {
  return <LazyIsland load={load} props={props} fallback={fallback} />;
}
