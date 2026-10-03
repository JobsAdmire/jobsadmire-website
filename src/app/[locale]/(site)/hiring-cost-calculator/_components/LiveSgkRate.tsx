'use client';
import type { SgkTier } from '@/lib/calculator/types';
import { useEstimateInputs } from './estimate-store';

/** calc.359/360's live rate on the phone incentives card (design im1a + sgkRate + im1b): the three
 *  tier labels are formatted on the server (D18); this picks the one the calculator holds. Eager
 *  (it sits inside a sentence), so it imports the store and nothing heavier. */
export function LiveSgkRate({ rates }: { rates: Record<SgkTier, string> }) {
  const { sgkTier } = useEstimateInputs();
  return <strong className="font-extrabold text-white">{rates[sgkTier]}</strong>;
}
