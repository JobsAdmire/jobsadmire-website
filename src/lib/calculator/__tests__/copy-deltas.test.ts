// COPY_DELTAS (W24): where the design's SHOWN number differs from the ruled model, the page
// tasks (T1 Homepage teaser, T4 Cost Calculator) author their sys.* templates from the `model`
// column, not from the design's sample. Rows with `agrees: true` are pins — the design and the
// model print the same figure. Every row is computed live, so the table cannot drift from the
// engine; the `agrees` column is asserted against the rounded model value.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../contract/website-bundle.v1';
import { getCollection, getRateConfig } from '@/content/collections';
import {
  effectiveFromLabel,
  employerMonthlyCost,
  estimate,
  findRole,
  presets,
  quotaBlocks,
  quotaCheck,
  salaryFloor,
  salaryRange,
  sgkRate,
} from '../index';
import { RATE, ROLES, role } from './fixtures';

type Row = {
  /** Package id, or the design-file location when the number has no string id. */
  id: string;
  where: string;
  /** The number the design shows (its sample string or its script's initial render). */
  design: number;
  /** What the ruled model computes for the same inputs (unrounded). */
  model: number;
  agrees: boolean;
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
    note: 'the design prints the exact 1.5× floor here — the model everywhere (W2)',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2588 (legalMin)',
    where:
      'slider minimum / salary-guide low / pass-check salary (ckSalB) for welder, cnc, electrician, plumber',
    design: 50000,
    model: salaryRange(role('welder'), RATE).min,
    agrees: false,
    note: 'design rounds up to the next ₺500; W2 forbids it — sys.calc.passcheck.salary and the slider read 49 545',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2588 (legalMin, cook)',
    where: 'slider minimum for cook (band starts at 50 000)',
    design: 50000,
    model: salaryRange(role('cook'), RATE).min,
    agrees: true,
    note: 'the band minimum wins over the floor on both sides',
  },
  {
    id: 'calc.079',
    where: 'basis card b1: employer cost at the minimum wage',
    design: 40214,
    model: employerMonthlyCost(RATE.legalMinGross, RATE),
    agrees: true,
    note: '33 030 × 1.2175',
  },
  {
    id: 'home.299',
    where: 'homepage FAQ: "roughly ₺38,944 per worker per month"',
    design: 38944,
    model: generalWithSupport.perWorker.monthly.total,
    agrees: true,
    note: 'reproduced only WITH the support opt-in — the teaser applied it automatically for General',
  },
  {
    id: 'home.074 / home.082',
    where: 'teaser note "minimum-wage support already applied" + the support row, default state',
    design: 38944,
    model: general.perWorker.monthly.total,
    agrees: false,
    note: 'W2: support is opt-in, OFF by default → the teaser card shows 40 214 unless the visitor opts in; T1 wires a toggle or rewrites home.074 via sys.home.calc.*',
  },
  {
    id: 'home.081',
    where: 'teaser row "SGK employer share · 21.75%"',
    design: 21.75,
    model: sgkRate(RATE, 'other') * 100,
    agrees: true,
    note: 'rateConfig.sgkRates.other',
  },
  {
    id: 'home.086',
    where: 'teaser "permit ₺16,000 + flight ₺12,000"',
    design: 28000,
    model: general.perWorker.oneOff.total,
    agrees: true,
    note: 'permitFeeTRY + flightTRY',
  },
  {
    id: 'calc.021',
    where: '"(₺1,270 / worker / month — if your workplace qualifies)"',
    design: 1270,
    model: generalWithSupport.perWorker.monthly.support,
    agrees: true,
    note: 'rateConfig.supportMonthly',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2646 (mTotal, initial render)',
    where: 'estimate card "Monthly total" on first paint (welder, 1, other, flight on)',
    design: 60875,
    model: initial.monthly.total,
    agrees: false,
    note: '50 000 × 1.2175 in the design vs 49 545 × 1.2175 — follows from the floor rule',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2657 (yearTotal, initial render)',
    where: 'total card "First-year total" on first paint',
    design: 758500,
    model: initial.firstYearTotal,
    agrees: false,
    note: '12 × monthly + 28 000 — follows from the floor rule',
  },
  {
    id: 'calc.560',
    where: '"12 months of payroll + one-off costs" (GEN.yearNote)',
    design: 12,
    model: initial.contract.months,
    agrees: true,
    note: 'months defaults to 12',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2699 (salary guide employer cost)',
    where: 'salary-guide card "employer cost" for welder (band low 45 000)',
    design: 54787.5,
    model: employerMonthlyCost(45000, RATE, 'other'),
    agrees: true,
    note: 'the design fixes 1.2175 regardless of the chosen tier; T4 passes the chosen tier (a delta only when the tier is not "other")',
  },
  {
    id: 'calc.558',
    where: 'quota visualisation note (GEN.qvExact) for 25 Turkish employees',
    design: 5,
    model: quotaBlocks(25, RATE.quotaRatio).full,
    agrees: true,
    note: 'floor(25 ÷ 5)',
  },
  {
    id: 'calc.559',
    where: 'pass-check quota row (GEN.ckQuoOk): "25 Turkish employees allow 5"',
    design: 5,
    model: quotaCheck(25, 1, RATE.quotaRatio).maxForeign,
    agrees: true,
    note: 'and planned 1 → allowed',
  },
  {
    id: 'calc.153',
    where: '"9 employees give one place, not two"',
    design: 1,
    model: quotaCheck(9, 1, RATE.quotaRatio).maxForeign,
    agrees: true,
    note: 'complete groups only',
  },
];

describe('COPY_DELTAS', () => {
  it('every row’s `agrees` flag matches the rounded model against the design figure', () => {
    for (const row of COPY_DELTAS) {
      // agrees ⇔ the design's figure is the model to the lira (or exact for rates)
      expect({ id: row.id, agrees: Math.abs(row.model - row.design) < 0.5 }).toEqual({
        id: row.id,
        agrees: row.agrees,
      });
    }
  });
  it('lists exactly the four places where the page tasks must follow the model, not the design', () => {
    expect(COPY_DELTAS.filter((r) => !r.agrees).map((r) => r.id)).toEqual([
      'Hiring Cost Calculator.dc.html:2588 (legalMin)',
      'home.074 / home.082',
      'Hiring Cost Calculator.dc.html:2646 (mTotal, initial render)',
      'Hiring Cost Calculator.dc.html:2657 (yearTotal, initial render)',
    ]);
  });
});

describe('the generated bundle feeds the engine (Task 1 → Task 9 cross-check)', () => {
  // readFileSync is the sanctioned bypass of the D23 import rule for tests (W40) — the running
  // site reaches the bundle only through the adapter.
  const bundle = BundleSchema.parse(
    JSON.parse(
      readFileSync(join(__dirname, '../../../content/local/bundle.tr.json'), 'utf8'),
    ) as unknown,
  );
  const rate = getRateConfig(bundle);
  const roles = getCollection(bundle, 'calculatorRoles');

  it('the seeded row and role table equal the fixtures this suite computed with', () => {
    expect(rate).toEqual(RATE);
    expect(roles).toEqual(ROLES);
  });
  it('the ruled figures hold over the real data', () => {
    const welder = findRole(roles, 'welder');
    expect(welder && salaryFloor(welder, rate)).toBe(49545);
    expect(presets(roles).map((r) => r.multiplier)).toEqual([1, 1.5, 2]);
    expect(quotaCheck(25, 1, rate.quotaRatio).maxForeign).toBe(5);
    expect(effectiveFromLabel(rate, 'tr')).toBe('Ocak 2026');
    expect(effectiveFromLabel(rate, 'en')).toBe('January 2026');
  });
});
