import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * W199: the phone check is anchored — `/^(?:\\D*\\d){8}/` — never the unanchored
 * `/(\\D*\\d){8,}/`, which backtracks quadratically on long input (a 40,000-character "phone"
 * took 771 ms; the 4 MB action body could cost hours of CPU before Turnstile or the door).
 * The two patterns accept exactly the same inputs.
 */
const SITES = [
  'src/app/[locale]/(site)/_home/lib/forms.ts',
  'src/app/[locale]/(site)/hire-workers/_lib/hire-spec.ts',
  'src/app/[locale]/(site)/available-workers/_lib/spec.ts',
  'src/app/[locale]/(site)/partner-with-us/_lib/forms.ts',
  'src/app/[locale]/(site)/hiring-cost-calculator/_lib/quote.ts',
  'src/app/[locale]/(site)/verify/_lib/fraud.ts',
];

describe('phone regexes are anchored (W199)', () => {
  for (const site of SITES) {
    it(`${site} uses the anchored pattern`, () => {
      const source = readFileSync(join(process.cwd(), site), 'utf8');
      expect(source).toContain('/^(?:\\D*\\d){8}/');
      expect(source).not.toMatch(/\(\\D\*\\d\)\{8,\}/);
    });
  }

  it('the anchored pattern accepts the same inputs and stays fast on a 4 MB string', () => {
    const anchored = /^(?:\D*\d){8}/;
    for (const ok of ['+90 501 000 00 00', '05010000000', 'abc1d2e3f4g5h6i7j8'])
      expect(anchored.test(ok)).toBe(true);
    for (const bad of ['1234567', '+90 (501)', '']) expect(anchored.test(bad)).toBe(false);
    const huge = 'x'.repeat(4_000_000);
    const started = performance.now();
    expect(anchored.test(huge)).toBe(false);
    expect(performance.now() - started).toBeLessThan(200);
  });
});
