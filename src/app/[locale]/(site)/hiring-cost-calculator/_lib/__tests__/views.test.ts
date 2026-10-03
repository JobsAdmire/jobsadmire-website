import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { COPY_DELTAS } from '@/lib/calculator/copy-deltas';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { formatTRY } from '@/lib/format/money';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import {
  computeCardView,
  designRoles,
  resolveRole,
  roleLabelMaps,
  salaryStops,
  stopIndex,
} from '../card-view';
import { makeCardCopy, makePassCopy, makeQuotaCopy } from '../copy';
import { DEFAULT_INPUTS, type EstimateInputs } from '../estimate-inputs';
import { PASS_IDS, QUOTA_IDS, pickLabels } from '../ids';
import { computePassView, passCheckVerdict, PASS_CHECK_ROWS } from '../pass-check';
import { computeQuotaView } from '../quota-view';
import { buildGuideRows, GUIDE_SCALE_MIN, guideScaleMax } from '../salary-guide';

const MESSAGES = { tr: tr as Messages, en: en as Messages };
const sysOf = (locale: 'tr' | 'en') =>
  createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys' });
// Labels as their own ids: the views pass package copy through untouched, so an id is proof enough.
const asId = (id: string) => id;
const ROLES_D = designRoles(ROLES);
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, asId);
const CARD_LABELS = {
  perWorker: 'per worker',
  fullYear: 'Full year',
  firstYear: 'First-year total',
  perMonthSuffix: '/ month',
};
/** A COPY_DELTAS row by id — the page's figures must equal its `model` column (W142/W143). */
const delta = (id: string) => {
  const row = COPY_DELTAS.find((r) => r.id === id);
  if (!row) throw new Error(`COPY_DELTAS has no row "${id}"`);
  return row;
};
const card = (inputs: EstimateInputs = DEFAULT_INPUTS, locale: 'tr' | 'en' = 'en') =>
  computeCardView({
    inputs,
    roles: ROLES_D,
    rateConfig: RATE,
    locale,
    roleLabels,
    industryLabels,
    labels: CARD_LABELS,
    copy: makeCardCopy(sysOf(locale)),
  });

describe('designRoles / resolveRole', () => {
  it('offers the 12 design roles, never the teaser presets (W24)', () => {
    expect(ROLES_D.map((r) => r.key)).toHaveLength(12);
    expect(ROLES_D.some((r) => r.preset)).toBe(false);
  });
  it('falls back to the welder for an unknown key', () => {
    expect(resolveRole(ROLES_D, 'nope').key).toBe('welder');
  });
});

describe('salaryStops', () => {
  it('starts at the exact floor, steps by 500, ends at the band maximum (W2)', () => {
    const stops = salaryStops(49545, 70000);
    expect(stops.slice(0, 3)).toEqual([49545, 50000, 50500]);
    expect(stops.at(-1)).toBe(70000);
    expect(stops).toHaveLength(42);
    expect(salaryStops(50000, 78000)).toHaveLength(57);
    expect(stopIndex(stops, 50100)).toBe(1);
    expect(stopIndex(stops, 1)).toBe(0);
  });
});

describe('computeCardView — every figure is the COPY_DELTAS model column (W142)', () => {
  it('the 1.5× roles start at the exact floor, the cook at its band, the 1× roles at the minimum wage', () => {
    const minFor = (roleKey: string) => card({ ...DEFAULT_INPUTS, roleKey }).stops[0];
    for (const key of ['welder', 'cnc', 'electrician', 'plumber'])
      expect(minFor(key)).toBe(delta('Hiring Cost Calculator.dc.html:2587 (legalMin)').model);
    expect(minFor('cook')).toBe(
      delta('Hiring Cost Calculator.dc.html:2587 (legalMin, cook)').model,
    );
    for (const key of ['labourer', 'housekeeping', 'steward', 'greenhouse'])
      expect(minFor(key)).toBe(
        delta('Hiring Cost Calculator.dc.html:2587 (legalMin, 1× minimum-wage roles)').model,
      );
  });
  it('the first paint shows the model totals, never the design samples', () => {
    const v = card(DEFAULT_INPUTS, 'tr');
    const monthly = delta('Hiring Cost Calculator.dc.html:2598 (mTotal, initial render)').model;
    const year = delta('Hiring Cost Calculator.dc.html:2603 (yearTotal, initial render)').model;
    expect(v.f.monthly.total).toBe(formatTRY(monthly, 'tr'));
    expect(v.f.contract.total).toBe(formatTRY(year, 'tr'));
    expect([v.f.monthly.total, v.f.contract.total]).toEqual(['60.321 ₺', '751.852 ₺']);
    expect(v.thresholdNote).toContain(formatTRY(delta('calc.557').model, 'tr'));
    expect(v.months).toBe(delta('calc.560').model);
    expect(v.salaryLabel).toBe('49.545 ₺ / month');
    expect(v.headcountNote).toBe('per worker');
    expect(v.monthsNote).toBe('Full year');
  });
  it('multiplies by headcount, nets support only when opted in, and marks a season', () => {
    expect(card({ ...DEFAULT_INPUTS, headcount: 5 }).f.monthly.total).toBe('₺301,605');
    expect(card({ ...DEFAULT_INPUTS, headcount: 5, supportOptIn: true }).f.monthly.total).toBe(
      '₺295,255',
    );
    expect(card({ ...DEFAULT_INPUTS, headcount: 5 }).headcountNote).toBe('for 5 workers');
    expect(card({ ...DEFAULT_INPUTS, headcount: 5 }).quotaNeeded).toBe('25');
    const season = card({ ...DEFAULT_INPUTS, months: 6 });
    expect(season.seasonal).toBe(true);
    expect(season.totalTitle).toBe('6-month season total');
    expect(season.monthsNote).toBe('6 months');
    expect(season.f.contract.total).toBe('₺389,926');
    expect(season.perMonthPerWorker).toBe('₺64,988 / month');
  });
  it('the cook floors at its band while the threshold still states the legal floor', () => {
    const v = card({ ...DEFAULT_INPUTS, roleKey: 'cook' });
    expect(v.salaryLabel).toBe('₺50,000 / month');
    expect(v.roleRange).toBe('₺50,000 – ₺78,000');
    expect(v.thresholdNote).toBe(
      'Legal minimum for this job: ₺49,545 gross (1.5× the minimum wage).',
    );
    expect(v.whatsappEstimate).toBe(
      'Hello JobsAdmire, I used the cost calculator: 1 × calc.548 at ₺50,000 gross, 12-month contract. Please send a written quote.',
    );
  });
});

describe('computeQuotaView — Gate 1 over rateConfig.quotaRatio', () => {
  const labels = pickLabels(asId, QUOTA_IDS);
  const quota = (staff: number, headcount: number) =>
    computeQuotaView({
      staff,
      headcount,
      ratio: RATE.quotaRatio,
      locale: 'en',
      labels,
      copy: makeQuotaCopy(sysOf('en')),
    });
  it('25 staff, 1 planned: 5 places, an exact fit, within the plan (calc.558/559 pins)', () => {
    const v = quota(25, 1);
    expect(v.allowed).toBe(delta('calc.558').model);
    expect(v.allowed).toBe(delta('calc.559').model);
    expect([v.ok, v.title, v.allowedText, v.msg, v.vsPlan]).toEqual([
      true,
      'calc.427',
      '5 foreign workers',
      'calc.428',
      'calc.429',
    ]);
    expect(v.vizNote).toBe(
      '25 employees make exactly 5 complete blocks — no spare capacity, 5 more unlock the next place.',
    );
    expect(v.blocks.map((b) => b.kind)).toEqual(['used', 'free', 'free', 'free', 'free']);
  });
  it('9 staff give one place, not two (calc.153); 3 planned → 2 over, 6 more needed', () => {
    const v = quota(9, 3);
    expect(v.allowed).toBe(delta('calc.153').model);
    expect(v.msg).toBe(
      'Counted as 5 Turkish employees for each foreign worker. 1 more Turkish employee would give you one more place.',
    );
    expect(v.vizNote).toBe(
      '1 complete block plus 4 spare employees — 1 more unlock one further place.',
    );
    expect(v.vsPlan).toBe(
      'That is 2 more than the rule allows. You would need 6 more Turkish employees, or an exemption. Send your numbers to JobsAdmire to find out which one fits you.',
    );
    expect(v.blocks.map((b) => [b.kind, b.filled])).toEqual([
      ['used', 5],
      ['partial', 4],
    ]);
  });
  it('fewer staff than the ratio: no place yet', () => {
    const v = quota(3, 1);
    expect([v.ok, v.title, v.allowedText]).toEqual([false, 'calc.426', 'calc.425']);
    expect(v.msg).toBe(
      'With 3 Turkish employees you do not reach the 5:1 rule yet. You need 2 more, or one of the exemptions below.',
    );
    expect(v.vizNote).toBe(
      'Not one complete block yet — 2 more Turkish employees unlock the first place.',
    );
  });
  it('caps the visualisation at QUOTA_VIZ_CAP blocks', () => {
    const v = quota(52, 1);
    expect(v.blocks).toHaveLength(8);
    expect(v.vizNote).toBe(
      '10 complete blocks (first 8 shown) plus 2 spare. 3 more unlock one further place.',
    );
  });
});

describe('passCheckVerdict — the design rules (lines 1899–1965)', () => {
  it('is idle until more than one row is answered (the quota row always is)', () => {
    expect(passCheckVerdict({}, true)).toMatchObject({
      tone: 'idle',
      clear: 1,
      answered: 1,
      unanswered: 4,
    });
    expect(passCheckVerdict({ capital: 'yes' }, true)).toMatchObject({
      tone: 'progress',
      clear: 2,
    });
  });
  it('a "no" is red, an "unsure" without a "no" amber, five clears green', () => {
    expect(passCheckVerdict({ capital: 'no', sgk: 'unsure' }, true)).toMatchObject({
      tone: 'red',
      blockers: ['capital'],
      unsure: ['sgk'],
    });
    expect(passCheckVerdict({ capital: 'unsure' }, true)).toMatchObject({ tone: 'amber' });
    expect(
      passCheckVerdict({ capital: 'yes', sgk: 'yes', salary: 'yes', docs: 'yes' }, true),
    ).toMatchObject({ tone: 'green', clear: 5, progressPct: 100 });
  });
  it('a failed quota blocks on its own; the rows keep the design order', () => {
    expect(
      passCheckVerdict({ capital: 'yes', sgk: 'yes', salary: 'yes', docs: 'yes' }, false),
    ).toMatchObject({ tone: 'red', clear: 4, blockers: ['quota'] });
    expect(PASS_CHECK_ROWS).toEqual(['capital', 'quota', 'sgk', 'salary', 'docs']);
  });
});

describe('computePassView', () => {
  const labels = pickLabels(asId, PASS_IDS);
  const view = (answers: Parameters<typeof passCheckVerdict>[0], inputs: EstimateInputs) =>
    computePassView({
      answers,
      inputs,
      roles: ROLES_D,
      rateConfig: RATE,
      locale: 'en',
      roleLabels,
      labels,
      copy: makePassCopy(sysOf('en')),
    });
  it('reads the salary row against salaryFloor — 49,545 for the cook too (W144)', () => {
    const v = view({}, { ...DEFAULT_INPUTS, roleKey: 'cook' });
    expect(v.rows.find((r) => r.key === 'salary')?.body).toBe(
      'calc.548: ₺49,545 gross per month (1.5× the minimum wage). Declaring less is a refusal, not a negotiation — and paying part of it in cash is a separate offence.',
    );
    expect(v.rows.find((r) => r.key === 'quota')?.body).toBe(
      'Answered from your quota check above: 25 Turkish employees allow 5, and you planned 1.',
    );
    expect([v.tone, v.kicker, v.count, v.progressPct]).toEqual([
      'idle',
      'calc.438',
      '1 of 5 checks clear · 4 unanswered',
      20,
    ]);
  });
  it('turns answers into the verdict, the fix list and the click-time WhatsApp text', () => {
    const v = view({ capital: 'no', sgk: 'unsure' }, DEFAULT_INPUTS);
    expect([v.tone, v.kicker, v.title]).toEqual(['red', 'calc.456', 'calc.461']);
    expect(v.fixes).toEqual([
      { key: 'capital', text: 'calc.447', unsure: false },
      { key: 'sgk', text: 'calc.444 calc.451', unsure: true },
    ]);
    expect(v.manualAnswered).toBe(true);
    expect(v.whatsappText).toContain('Role: calc.555 · 1 worker');
    expect(v.whatsappText).toContain('1. calc.445 — calc.434');
    expect(v.whatsappText).toContain('2. calc.448 — calc.433');
    expect(v.whatsappText).toContain('4. calc.452 — unanswered');
  });
});

describe('buildGuideRows — the model floor (W2) at the chosen tier (W59)', () => {
  const labels = { skilled: 'Skilled · 1.5×', standard: 'Standard · 1×' };
  const rows = (tier: 'manufacturing' | 'other') =>
    buildGuideRows({
      roles: ROLES_D,
      rateConfig: RATE,
      tier,
      locale: 'en',
      roleLabels,
      industryLabels,
      labels,
    });
  it('lows and employer costs from COPY_DELTAS, never the design samples', () => {
    const other = rows('other');
    expect(other).toHaveLength(12);
    const low = formatTRY(
      delta('Hiring Cost Calculator.dc.html:2718 (salary guide employer cost)').model,
      'en',
    );
    for (const key of ['welder', 'cnc', 'electrician', 'plumber']) {
      const row = other.find((r) => r.key === key);
      expect(row?.range.startsWith('₺49,545 – ')).toBe(true);
      expect(row?.employer.startsWith(`${low} – `)).toBe(true); // ₺60,321, design ₺60,875
    }
    const labourer = other.find((r) => r.key === 'labourer');
    expect(labourer?.range).toBe('₺33,030 – ₺44,000');
    expect(labourer?.employer).toBe(`${formatTRY(delta('calc.079').model, 'en')} – ₺53,570`);
    expect(other.find((r) => r.key === 'welder')?.tier).toBe('Skilled · 1.5×');
    expect(rows('manufacturing').find((r) => r.key === 'welder')?.employer).toBe(
      '₺58,835 – ₺83,125',
    );
  });
  it('places the bar on the design scale 30,000 → the highest band max, tick at the minimum wage', () => {
    expect(guideScaleMax(ROLES_D)).toBe(78000);
    const labourer = rows('other').find((r) => r.key === 'labourer');
    const pct = ((RATE.legalMinGross - GUIDE_SCALE_MIN) / (78000 - GUIDE_SCALE_MIN)) * 100;
    expect(labourer?.barLeftPct).toBeCloseTo(pct, 5);
    expect(labourer?.tickPct).toBeCloseTo(pct, 5);
    expect(rows('other').filter((r) => r.industry === 'hotel')).toHaveLength(4);
  });
});
