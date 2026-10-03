import { makeTf } from '@/content/pure';
// Types by module path, never the blocks barrel — type-only imports included (W156).
import type { FaqItem } from '@/design/blocks/FaqBlock';
import type { ProcessStep } from '@/design/blocks/ProcessSteps';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

type Tf = (id: string) => string;

/** "What 'verified' means" (design `#ja-steps`): the four checks, `availworkers.074`–`082`.
 *  `ProcessSteps` resolves the title/body ids itself; step 4's "Goes live" pill (081) is its
 *  `when` — a resolved string, so it is passed in. */
const VERIFIED_STEP_IDS = [
  { n: 1, titleId: 'availworkers.074', bodyId: 'availworkers.075' },
  { n: 2, titleId: 'availworkers.076', bodyId: 'availworkers.077' },
  { n: 3, titleId: 'availworkers.078', bodyId: 'availworkers.079' },
  { n: 4, titleId: 'availworkers.080', bodyId: 'availworkers.082' },
] as const;

export function verifiedSteps(tf: Tf): ProcessStep[] {
  return VERIFIED_STEP_IDS.map((s) =>
    s.n === 4 ? { ...s, when: tf('availworkers.081') } : { ...s },
  );
}

/** "After you pick" (design `.ja-after-card`): four steps, `availworkers.090`–`099`. The badges
 *  are `091` ("Day 0"), `sys.workers.timeline.days1to3` (not in the package), `096` ("Week 1")
 *  and the arrival badge — `sys.workers.timeline.arrival` over the `firstDayWeeks` metric (W1:
 *  the design's hard-typed "Weeks 4–8" is not a signed figure) — absent while the metric is
 *  unsigned (D17). */
const AFTER_STEP_IDS = [
  { n: 1, titleId: 'availworkers.090', bodyId: 'availworkers.092' },
  { n: 2, titleId: 'availworkers.093', bodyId: 'availworkers.094' },
  { n: 3, titleId: 'availworkers.095', bodyId: 'availworkers.097' },
  { n: 4, titleId: 'availworkers.098', bodyId: 'availworkers.099' },
] as const;

export function afterSteps(tf: Tf, badges: { days1to3: string; arrival?: string }): ProcessStep[] {
  const when = [tf('availworkers.091'), badges.days1to3, tf('availworkers.096'), badges.arrival];
  return AFTER_STEP_IDS.map((s, i) => {
    const badge = when[i];
    return badge ? { ...s, when: badge } : { ...s };
  });
}

/**
 * The FAQ pairs (design `faqData`). Two answers exist only in the design's JavaScript: 218
 * ("Who files the work permit…") and 221 ("What if the worker leaves…"). The package carries the
 * same copy under `wp.350` and `hire.302` — both legal-flagged, so they sit behind the D8 APPROVE
 * gate the JS-only text would have bypassed, and W9 forbids minting an id for copy the package
 * already has; the WP-C legal review checks them in this page's context (wp.350's "track the
 * status live on your portal", hire.302's replacement guarantee). 210/211 promise a "live sample
 * of our portal, refreshed weekly" with a hard-typed "200+": shown only once cards are visible
 * (W6/D17).
 */
export const WORKERS_FAQ: readonly { q: string; a: string; liveSample?: true }[] = [
  { q: 'availworkers.210', a: 'availworkers.211', liveSample: true },
  { q: 'availworkers.212', a: 'availworkers.213' },
  { q: 'availworkers.214', a: 'availworkers.215' },
  { q: 'availworkers.216', a: 'availworkers.217' },
  { q: 'availworkers.218', a: 'wp.350' },
  { q: 'availworkers.219', a: 'availworkers.220' },
  { q: 'availworkers.221', a: 'hire.302' },
  { q: 'availworkers.222', a: 'availworkers.223' },
];

export function workersFaqItems(
  bundle: Bundle,
  locale: Locale,
  showLiveSample: boolean,
): FaqItem[] {
  const tf = makeTf(bundle, locale);
  return WORKERS_FAQ.filter((f) => showLiveSample || !f.liveSample).map((f) => ({
    id: f.q,
    q: tf(f.q),
    a: tf(f.a),
  }));
}
