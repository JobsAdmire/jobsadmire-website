import type { Locale } from '@/i18n/routing';
import { QUOTA_VIZ_CAP, quotaBlocks, quotaCheck } from '@/lib/calculator';
import { formatInt } from '@/lib/format/money';
import type { QuotaCopy } from './copy';
import type { QuotaLabels } from './ids';

/** One visualised block: a complete group that unlocks a place (`used` when the plan fills it)
 *  or the incomplete group after the last one. */
export type QuotaBlock = { kind: 'used' | 'free' | 'partial'; filled: number };

export type QuotaView = {
  ratio: number;
  allowed: number;
  ok: boolean;
  title: string;
  allowedText: string;
  msg: string;
  blocks: QuotaBlock[];
  vizNote: string;
  vsPlan: string;
  headcountText: string;
};

/** Gate 1 (design 1063–1105 + the phone cards 1031–1049), every number over
 *  `rateConfig.quotaRatio` (the design hard-codes 5). */
export function computeQuotaView({
  staff,
  headcount,
  ratio,
  locale,
  labels,
  copy,
}: {
  staff: number;
  headcount: number;
  ratio: number;
  locale: Locale;
  labels: QuotaLabels;
  copy: QuotaCopy;
}): QuotaView {
  const check = quotaCheck(staff, headcount, ratio);
  const b = quotaBlocks(staff, ratio, QUOTA_VIZ_CAP);
  const n = (v: number) => formatInt(v, locale);
  const allowed = check.maxForeign;
  const blocks: QuotaBlock[] = Array.from({ length: b.shown }, (_, i) => ({
    kind: i < headcount ? 'used' : 'free',
    filled: ratio,
  }));
  // the design shows the incomplete group only while the complete ones are under the cap
  if (b.remainder > 0 && b.full < QUOTA_VIZ_CAP)
    blocks.push({ kind: 'partial', filled: b.remainder });
  const vizNote = b.capped
    ? copy.vizCap(n(b.full), QUOTA_VIZ_CAP, b.remainder, n(b.nextUnlockIn))
    : staff < ratio
      ? copy.vizNone(n(ratio - staff))
      : b.remainder === 0
        ? copy.vizFull(n(staff), b.full, ratio)
        : copy.vizPart(b.full, b.remainder, n(b.nextUnlockIn));
  return {
    ratio,
    allowed,
    ok: allowed > 0,
    title: allowed === 0 ? labels.quotaTitleNo : labels.quotaTitleYes,
    allowedText: allowed === 0 ? labels.quotaNone : copy.allowed(allowed),
    msg:
      allowed === 0
        ? copy.msgNo(staff, ratio, n(ratio - staff))
        : b.remainder === 0
          ? labels.quotaMsgExact
          : copy.msgMore(ratio, b.nextUnlockIn),
    blocks,
    vizNote,
    vsPlan: check.allowed ? labels.quotaVsOk : copy.vsOver(n(check.overBy), n(check.shortfall)),
    headcountText: n(headcount),
  };
}
