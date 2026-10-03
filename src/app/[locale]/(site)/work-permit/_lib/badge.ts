import type { RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { isReviewDue } from '@/lib/calculator';
import { formatMonth } from '@/lib/format/date/formatMonth';
import type { SysT } from './wizard-props';

/** D17: the hero's "Updated … · Reviewed by …" badge. `wp.022`'s hard-typed "July 2026" gives
 *  way to `sys.wp.hero.updated` filled from `rateConfig.updatedAt`, and the badge disappears
 *  from `reviewDueAt` on — the page revalidates daily so that switch needs no deploy (W150). */
export function heroBadge(
  rateConfig: RateConfig,
  locale: Locale,
  sys: SysT,
  now: Date = new Date(),
): string | null {
  if (isReviewDue(rateConfig, now)) return null;
  return sys('wp.hero.updated', { month: formatMonth(rateConfig.updatedAt, locale) });
}
