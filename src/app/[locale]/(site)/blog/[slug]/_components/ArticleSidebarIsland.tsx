'use client';
import type { ReactNode } from 'react';
import { LazyIsland } from '@/design/islands/LazyIsland';
import type { ArticleSidebarProps } from './ArticleSidebar';

// A function prop cannot cross the server → client boundary, so the `load` thunk lives in this
// thin client module (T1's binder pattern); the type-only import keeps the island itself out of
// this eager chunk.
const load = () => import('./ArticleSidebar').then((m) => ({ default: m.ArticleSidebar }));

/** B-13 / W132: the sidebar island loads once its wrapper comes within 200 px of the viewport and
 *  stays mounted; until then — and for good if the chunk fails — the DOM-identical server
 *  fallback shows. On phones the TOC card is hidden and the share card sits below the body, so
 *  the chunk loads only when the reader gets there (never during the mobile first-load audit). */
export function ArticleSidebarIsland({
  fallback,
  ...props
}: ArticleSidebarProps & { fallback: ReactNode }) {
  return <LazyIsland load={load} props={props} fallback={fallback} />;
}
