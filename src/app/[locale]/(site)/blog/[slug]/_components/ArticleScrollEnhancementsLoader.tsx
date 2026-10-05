'use client';
import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import { scrollArm } from '../../_lib/scroll-arm';
import type { ArticleScrollEnhancementsProps } from './ArticleScrollEnhancements';

/** B-13 (W13 amended): the enhancements chunk is requested on the first scroll — `next/dynamic`
 *  calls its loader only when the component first renders, and nothing renders it before
 *  `scrollArm` flips. `ssr: false` inside a `'use client'` module (final review §6). */
const ArticleScrollEnhancements = dynamic(
  () => import('./ArticleScrollEnhancements').then((m) => m.ArticleScrollEnhancements),
  { ssr: false },
);

export function ArticleScrollEnhancementsLoader(props: ArticleScrollEnhancementsProps) {
  const armed = useSyncExternalStore(
    scrollArm.subscribe,
    scrollArm.isArmed,
    scrollArm.isArmedOnServer,
  );
  return armed ? <ArticleScrollEnhancements {...props} /> : null;
}
