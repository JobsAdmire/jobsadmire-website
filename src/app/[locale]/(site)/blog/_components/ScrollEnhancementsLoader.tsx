'use client';
import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import { scrollArm } from '../_lib/scroll-arm';
import type { ScrollEnhancementsProps } from './ScrollEnhancements';

/** B-13 (W13 amended, final review §2): the enhancements chunk is requested on the first scroll
 *  — `next/dynamic` calls its loader only when the component first renders, and nothing renders
 *  it before `scrollArm` flips. `ssr: false` inside a `'use client'` module (final review §6). */
const ScrollEnhancements = dynamic(
  () => import('./ScrollEnhancements').then((m) => m.ScrollEnhancements),
  { ssr: false },
);

export function ScrollEnhancementsLoader(props: ScrollEnhancementsProps) {
  const armed = useSyncExternalStore(
    scrollArm.subscribe,
    scrollArm.isArmed,
    scrollArm.isArmedOnServer,
  );
  return armed ? <ScrollEnhancements {...props} /> : null;
}
