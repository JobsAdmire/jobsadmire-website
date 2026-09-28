// COPY_DELTAS (W24/W143): where the design's SHOWN number differs from the ruled model, the page
// tasks (T1 Homepage teaser, T3 Cost Calculator) author their sys.* templates from the `model`
// column, not from the design's sample. Rows with `agrees: true` are pins — the design and the
// model print the same figure. `legal` mirrors the catalogue's flag for the row's id (false for a
// design-file citation, which has no catalogue entry), so this table doubles as the WP-C
// legal-review list (W142(f)). This module is pure, side-effect-free data — no `describe`, no
// bundle reads — so it can be imported by a page task or a lint; it is deliberately NOT
// re-exported from `src/lib/calculator/index.ts` (W143: authoring-time data, never shipped to
// clients). `__tests__/copy-deltas.test.ts` asserts every row and cross-checks the generated
// bundle.
import {
  employerMonthlyCost,
  estimate,
  quotaBlocks,
  quotaCheck,
  salaryFloor,
  salaryRange,
  sgkRate,
} from './index';
import { RATE, role } from './__tests__/fixtures';

export type Row = {
  /** Package id (or two, "a / b"), or the design-file location when the number has no string id. */
  id: string;
  where: string;
  /** The number the design shows (its sample string or its script's initial render). */
  design: number;
  /** What the ruled model computes for the same inputs (unrounded). */
  model: number;
  agrees: boolean;
  /** The catalogue's `legal` flag for the id (false when the id is a design-file citation with
   * no catalogue entry) — W142(f)/W143. */
  legal: boolean;
  note: string;
};

const initial = estimate({ role: role('welder'), headcount: 1 }, RATE);
const general = estimate({ role: role('generalPreset'), headcount: 15 }, RATE);
const generalWithSupport = estimate(
  { role: role('generalPreset'), headcount: 15, supportOptIn: true },
  RATE,
);

export const COPY_DELTAS: Row[] = [
  {
    id: 'calc.557',
    where: 'threshold note under the salary slider (GEN.threshold)',
    design: 49545,
    model: salaryFloor(role('welder'), RATE),
    agrees: true,
    legal: true,
    note: 'the design prints the exact 1.5× floor here — the model everywhere (W2)',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2588 (legalMin)',
    where:
      'slider minimum / salary-guide low / pass-check salary (ckSalB) for welder, cnc, electrician, plumber',
    design: 50000,
    model: salaryRange(role('welder'), RATE).min,
    agrees: false,
    legal: false,
    note: 'design rounds up to the next ₺500; W2 forbids it — sys.calc.passcheck.salary and the slider read 49 545',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2588 (legalMin, cook)',
    where: 'slider minimum for cook (band starts at 50 000)',
    design: 50000,
    model: salaryRange(role('cook'), RATE).min,
    agrees: true,
    legal: false,
    note: 'the band minimum wins over the floor on both sides',
  },
  {
    id: 'calc.079',
    where: 'basis card b1: employer cost at the minimum wage',
    design: 40214,
    model: employerMonthlyCost(RATE.legalMinGross, RATE),
    agrees: true,
    legal: false,
    note: '33 030 × 1.2175',
  },
  {
    id: 'home.299',
    where: 'homepage FAQ: "roughly ₺38,944 per worker per month"',
    design: 38944,
    model: general.perWorker.monthly.total,
    agrees: false,
    legal: true,
    note: 'W142(a): legal-flagged, rendered verbatim (W58); its 38 944 embeds the opt-in ₺1,270 support the sentence never mentions; listed for the WP-C legal review beside the model figure ₺40,214',
  },
  {
    id: 'home.074 / home.082',
    where: 'teaser note "minimum-wage support already applied" + the support row, default state',
    design: 38944,
    model: general.perWorker.monthly.total,
    agrees: false,
    legal: true,
    note: 'W142(b)/W58: rendered verbatim; T1 states support separately via sys.home.calc.supportSeparate; WP-C lists both with the model figure ₺40,214',
  },
  {
    id: 'home.081',
    where: 'teaser row "SGK employer share · 21.75%"',
    design: 21.75,
    model: sgkRate(RATE, 'other') * 100,
    agrees: true,
    legal: true,
    note: 'rateConfig.sgkRates.other',
  },
  {
    id: 'home.086',
    where: 'teaser "permit ₺16,000 + flight ₺12,000"',
    design: 28000,
    model: general.perWorker.oneOff.total,
    agrees: true,
    legal: true,
    note: 'permitFeeTRY + flightTRY',
  },
  {
    id: 'calc.021',
    where: '"(₺1,270 / worker / month — if your workplace qualifies)"',
    design: 1270,
    model: generalWithSupport.perWorker.monthly.support,
    agrees: true,
    legal: false,
    note: 'rateConfig.supportMonthly',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2646 (mTotal, initial render)',
    where: 'estimate card "Monthly total" on first paint (welder, 1, other, flight on)',
    design: 60875,
    model: initial.monthly.total,
    agrees: false,
    legal: false,
    note: '50 000 × 1.2175 in the design vs 49 545 × 1.2175 — follows from the floor rule',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2657 (yearTotal, initial render)',
    where: 'total card "First-year total" on first paint',
    design: 758500,
    model: initial.firstYearTotal,
    agrees: false,
    legal: false,
    note: '12 × monthly + 28 000 — follows from the floor rule',
  },
  {
    id: 'calc.560',
    where: '"12 months of payroll + one-off costs" (GEN.yearNote)',
    design: 12,
    model: initial.contract.months,
    agrees: true,
    legal: false,
    note: 'months defaults to 12',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2718 (salary guide employer cost)',
    where: 'salary-guide card "employer cost" low for welder (also cnc, electrician, plumber)',
    design: 60875,
    model: employerMonthlyCost(salaryRange(role('welder'), RATE).min, RATE, 'other'),
    agrees: false,
    legal: false,
    note: "W142(c): verified against dc.html:2718/2726 — the guide row's own `lo` reuses row 2's exact legalMin formula (max(r.min, ceil(r.mult × MINWAGE / 500) × 500)), so the design's guide low is 50 000 (₺60,875 at the fixed 1.2175), the SAME as row 2 — not the 45 000 band low; W2 floor correction + W59 (T3 passes the chosen tier): the model is 60 321.04; identical for cnc/electrician (band low 45 000) and plumber (band low 42 000) — all four clamp to the same 1.5× ceiling in both the design and the model",
  },
  {
    id: 'calc.558',
    where: 'quota visualisation note (GEN.qvExact) for 25 Turkish employees',
    design: 5,
    model: quotaBlocks(25, RATE.quotaRatio).full,
    agrees: true,
    legal: true,
    note: 'floor(25 ÷ 5)',
  },
  {
    id: 'calc.559',
    where: 'pass-check quota row (GEN.ckQuoOk): "25 Turkish employees allow 5"',
    design: 5,
    model: quotaCheck(25, 1, RATE.quotaRatio).maxForeign,
    agrees: true,
    legal: true,
    note: 'and planned 1 → allowed',
  },
  {
    id: 'calc.153',
    where: '"9 employees give one place, not two"',
    design: 1,
    model: quotaCheck(9, 1, RATE.quotaRatio).maxForeign,
    agrees: true,
    legal: true,
    note: 'complete groups only',
  },
];
