'use client';
import type { ReactNode } from 'react';
import { LazyIsland } from '@/design/islands/LazyIsland';
import type { SeasonPlannerProps } from './SeasonPlanner';

// The `load` thunk cannot cross the server → client boundary; the type-only import keeps the
// island out of this eager chunk.
const load = () => import('./SeasonPlanner').then((m) => ({ default: m.SeasonPlanner }));

/** W13 amended / W132: the planner sits well below the fold; the static grid stands in until its
 *  wrapper comes within 200 px of the viewport. */
export function SeasonPlannerIsland({
  fallback,
  ...props
}: SeasonPlannerProps & { fallback: ReactNode }) {
  return <LazyIsland load={load} props={props} fallback={fallback} />;
}
