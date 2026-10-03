import { describe, expect, it } from 'vitest';
import { presets } from '@/lib/calculator';
import { RATE, ROLES, role } from '@/lib/calculator/__tests__/fixtures';
// W142/W143: the teaser's figures are authored from COPY_DELTAS' MODEL column, never the
// design's sample; a test may read the authoring table, no module under src/ does (M18).
import { COPY_DELTAS } from '@/lib/calculator/copy-deltas';
import { formatTRY } from '@/lib/format/money';
import { teaserView, teaserViews, type TeaserLabels } from '../teaser';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, stateKey } from '../teaser-keys';

const labels: TeaserLabels = {
  grossMin: 'Brüt maaş (asgari ücret)',
  grossFloor: (m) => `Brüt maaş (${m} yasal taban)`,
  headcount: (n) => `${n} işçi`,
  estimate: (a) => `${a.role}|${a.headcount}|${a.monthly}|${a.oneOff}`,
};
const TEASER_ROW = COPY_DELTAS.find((r) => r.id === 'home.074 / home.082');

describe('teaserView (W2/W58/W142: one engine, exact floors, support off)', () => {
  it('General × 15 shows the COPY_DELTAS model figure (₺40,214), never the design sample', () => {
    expect(TEASER_ROW?.agrees).toBe(false);
    const v = teaserView({
      role: role('generalPreset'),
      roleLabel: 'Genel işçi',
      headcount: 15,
      rateConfig: RATE,
      locale: 'tr',
      labels,
    });
    expect(v.perWorker).toBe(formatTRY(TEASER_ROW!.model, 'tr'));
    expect(v.perWorker).toBe('40.214 ₺');
    expect(v.perWorker).not.toBe(formatTRY(TEASER_ROW!.design, 'tr'));
    expect(v.gross).toBe('33.030 ₺');
    expect(v.sgk).toBe('7.184 ₺');
    expect(v.monthly).toBe('603.210 ₺');
    expect(v.oneOff).toBe('420.000 ₺');
    expect(v.grossLabel).toBe('Brüt maaş (asgari ücret)');
    expect(v.headcountLabel).toBe('15 işçi');
    expect(v.whatsappText).toBe('Genel işçi|15|603.210 ₺|420.000 ₺');
  });

  it('Skilled × 30: the exact 1.5× floor (₺49,545, never ₺50,000) and the multiplier label', () => {
    const v = teaserView({
      role: role('skilledPreset'),
      roleLabel: 'Skilled',
      headcount: 30,
      rateConfig: RATE,
      locale: 'en',
      labels,
    });
    expect(v.gross).toBe('₺49,545');
    expect(v.perWorker).toBe('₺60,321');
    expect(v.monthly).toBe('₺1,809,631');
    expect(v.grossLabel).toBe('Brüt maaş (1.5× yasal taban)');
  });

  it('the bar shares are unrounded percentages; the legend reads whole percents (D18)', () => {
    const v = teaserView({
      role: role('generalPreset'),
      roleLabel: 'x',
      headcount: 1,
      rateConfig: RATE,
      locale: 'tr',
      labels,
    });
    expect(v.salaryPct).toBeCloseTo(82.135, 2);
    expect(v.sgkPct).toBeCloseTo(17.865, 2);
    expect(v.salaryPctLabel).toBe('%82');
    expect(v.sgkPctLabel).toBe('%18');
  });

  it('the WhatsApp text is plain text, never a URL (W95: the link composes it on click)', () => {
    const v = teaserView({
      role: role('generalPreset'),
      roleLabel: 'x',
      headcount: 5,
      rateConfig: RATE,
      locale: 'tr',
      labels,
    });
    expect(v.whatsappText).not.toMatch(/wa\.me|https?:/);
  });
});

describe('teaserViews', () => {
  it('precomputes the 3 presets × 4 chips the island switches between', () => {
    const roles = presets(ROLES).map((row) => ({ row, label: row.key }));
    const views = teaserViews({ roles, rateConfig: RATE, locale: 'tr', labels });
    expect(HEADCOUNT_PRESETS).toEqual([1, 5, 15, 30]);
    expect(DEFAULT_HEADCOUNT).toBe(15);
    expect(Object.keys(views)).toHaveLength(12);
    expect(views[stateKey('generalPreset', DEFAULT_HEADCOUNT)].monthly).toBe('603.210 ₺');
    expect(views[stateKey('specialistPreset', 30)].monthly).toBe('2.412.842 ₺');
  });
});
