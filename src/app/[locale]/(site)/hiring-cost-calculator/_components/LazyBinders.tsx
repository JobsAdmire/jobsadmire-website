'use client';
import type { ReactNode } from 'react';
import type { StickyCta } from '@/design/chrome/StickyCtaBar';
import { LazyIsland } from '@/design/islands/LazyIsland';
import type { PassCheckIslandProps } from './PassCheckIsland';
import type { QuotaIslandProps } from './QuotaIsland';
import type { RecapIslandProps } from './RecapIsland';
import type { SalaryGuideIslandProps } from './SalaryGuideIsland';

// W13 amended / W132: each island loads once, 200 px before its wrapper enters the viewport, and
// stays mounted; the server fallback (built from the same directive-less views) shows until then.
// A server page cannot pass `load` (a function) to a client component, so the thunks live in this
// one small eager module; the type-only imports keep every island out of it. The explicit
// `LazyIsland<P>` generic: inferring P through `.then` on a named export widens (T2's finding).
const loadQuota = () => import('./QuotaIsland').then((m) => ({ default: m.QuotaIsland }));
const loadPass = () => import('./PassCheckIsland').then((m) => ({ default: m.PassCheckIsland }));
const loadGuide = () =>
  import('./SalaryGuideIsland').then((m) => ({ default: m.SalaryGuideIsland }));
const loadRecap = () => import('./RecapIsland').then((m) => ({ default: m.RecapIsland }));
const loadSticky = () =>
  import('@/design/chrome/StickyCtaBar').then((m) => ({ default: m.StickyCtaBar }));

export function QuotaLoader({ fallback, ...props }: QuotaIslandProps & { fallback: ReactNode }) {
  return <LazyIsland<QuotaIslandProps> load={loadQuota} props={props} fallback={fallback} />;
}
export function PassCheckLoader({
  fallback,
  ...props
}: PassCheckIslandProps & { fallback: ReactNode }) {
  return <LazyIsland<PassCheckIslandProps> load={loadPass} props={props} fallback={fallback} />;
}
export function SalaryGuideLoader({
  fallback,
  ...props
}: SalaryGuideIslandProps & { fallback: ReactNode }) {
  return <LazyIsland<SalaryGuideIslandProps> load={loadGuide} props={props} fallback={fallback} />;
}
export function RecapLoader({ fallback, ...props }: RecapIslandProps & { fallback: ReactNode }) {
  return <LazyIsland<RecapIslandProps> load={loadRecap} props={props} fallback={fallback} />;
}

type StickyProps = {
  message: string;
  ctas: StickyCta[];
  showAfterPx?: number;
  hideNearId?: string;
  live?: boolean;
};

/** The sticky bar renders `null` until the visitor is past `showAfterPx`, so `null` is its
 *  DOM-identical fallback. The page mounts this after `#basis` — below the audit's first
 *  viewport — so the bar's chunk loads during the first scroll, before the 700 px threshold.
 *  The margin reaches 100,000 px ABOVE the viewport (W165: every lazily mounted sticky bar uses
 *  this top-extended margin): an anchor jump past the wrapper (the card's
 *  "Check your quota →", a `#faq` link, a reload at a hash) never sees it cross the viewport, and
 *  a plain 200 px margin would then never load the bar; with the top margin, "at or past this
 *  point" is what counts, while the first viewport (the wrapper sits below it) still loads
 *  nothing. */
const STICKY_MARGIN = '100000px 0px 200px 0px';

export function LazyStickyBar(props: StickyProps) {
  return (
    <LazyIsland<StickyProps>
      load={loadSticky}
      props={props}
      fallback={null}
      rootMargin={STICKY_MARGIN}
    />
  );
}
