import { describe, expect, it } from 'vitest';
import { RATE } from '@/lib/calculator/__tests__/fixtures';
import { POINT_KEYS } from '../eligibility';
import { buildWizardProps } from '../wizard-props';
import { BUNDLES, sysFor, tfFor } from './helpers';

const build = (locale: 'tr' | 'en', quotaRatio = RATE.quotaRatio) =>
  buildWizardProps({
    locale,
    whatsappNumber: BUNDLES[locale].settings.whatsappNumber,
    quotaRatio,
    tf: tfFor(locale),
    sys: sysFor(locale),
  });

describe('buildWizardProps — every string the island shows or sends, resolved on the server (W9/W148)', () => {
  it('TR: the package questions, the sys option words and the ratio from rateConfig (D17)', () => {
    const p = build('tr');
    const tf = tfFor('tr');
    expect(p.locale).toBe('tr');
    expect(p.whatsappNumber).toBe('905011240340');
    expect(p.questions.map((q) => q.question)).toEqual(
      ['wp.075', 'wp.076', 'wp.077', 'wp.080'].map((id) => tf(id)),
    );
    expect(p.questions.map((q) => q.options.map((o) => o.label))).toEqual([
      ['Evet', tf('wp.081')],
      ['5 veya daha fazla', '5 kişiden az'],
      ['Yurt dışında', tf('wp.078'), tf('wp.079')],
      ['Hayır', tf('wp.082')],
    ]);
    expect(p.copy.progress).toEqual(['1 / 4', '2 / 4', '3 / 4', '4 / 4']);
    expect(p.copy.prefillIntro).toMatch(
      /^Merhaba JobsAdmire, sitenizdeki uygunluk kontrolünü yaptım/,
    );
    expect(p.copy.prefillResult.eligible).toBe(`Sonuç: ${tf('wp.074')}`);
  });

  it('EN: the verdict titles, the seven points (the ratio point from sys, W2) and the card copy', () => {
    const p = build('en');
    const tf = tfFor('en');
    expect(p.copy.titles).toEqual({
      eligible: tf('wp.074'),
      conditional: tf('wp.073'),
      ineligible: tf('wp.072'),
    });
    expect(Object.keys(p.copy.points).sort()).toEqual([...POINT_KEYS].sort());
    expect(p.copy.points.company).toBe(tf('wp.065'));
    expect(p.copy.points.ratio).toContain('1:5');
    expect(p.copy.points.ratio).not.toBe(tf('wp.066'));
    expect([
      p.copy.heading,
      p.copy.subtitle,
      p.copy.back,
      p.copy.whatsapp,
      p.copy.needWorkers,
      p.copy.seeHiring,
      p.copy.restart,
      p.copy.footer,
    ]).toEqual(
      ['wp.038', 'wp.039', 'wp.040', 'wp.041', 'wp.042', 'wp.043', 'wp.044', 'wp.045'].map((id) =>
        tf(id),
      ),
    );
    expect(p.copy.progressLabel).toBe('Eligibility check progress');
    expect(p.copy.prefillIntro).toMatch(/^Hello JobsAdmire, I did the eligibility check/);
  });

  it('follows rateConfig.quotaRatio instead of a typed 5', () => {
    const p = build('en', 10);
    expect(p.questions[1].options.map((o) => o.label)).toEqual(['10 or more', 'Fewer than 10']);
    expect(p.copy.points.ratio).toContain('1:10');
  });
});
