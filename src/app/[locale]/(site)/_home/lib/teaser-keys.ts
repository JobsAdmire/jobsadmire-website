/**
 * The client-safe half of the teaser model: the view shape and the state key. It imports nothing
 * — the island reads it, and the engine (`./teaser.ts`, server-side) must stay out of the
 * island's chunk: the views arrive precomputed from the server.
 */
export type TeaserView = {
  roleKey: string;
  headcount: number;
  /** home.080 at 1×, else sys.home.calc.grossFloor with the engine's `multiplierLabel` */
  grossLabel: string;
  gross: string;
  sgk: string;
  perWorker: string;
  /** unrounded percentages for the bar widths (0–100) */
  salaryPct: number;
  sgkPct: number;
  /** the legend's whole percents through formatPercent (D18) */
  salaryPctLabel: string;
  sgkPctLabel: string;
  headcountLabel: string;
  monthly: string;
  oneOff: string;
  /** sys.home.whatsapp.estimate over this state's figures — text only; the link composes the
   *  URL on click (W95) */
  whatsappText: string;
};

/** The design's headcount chips and default (UI presets, not rates). */
export const HEADCOUNT_PRESETS = [1, 5, 15, 30] as const;
export const DEFAULT_HEADCOUNT = 15;

export function stateKey(roleKey: string, headcount: number): string {
  return `${roleKey}:${headcount}`;
}
