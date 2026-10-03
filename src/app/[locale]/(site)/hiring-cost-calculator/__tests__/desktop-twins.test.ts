import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatTwinFindings, twinFindings } from '@/test/px-twins';

/**
 * Final pass B1 (W190 A1a, D19): the Cost Calculator's page-local px literals — paddings, gaps,
 * margins and type (`text-`, `tracking-`, `leading-`) written as `-[Npx]` — carry an `xl:` twin
 * at × 0.75 from 1101 px, the design's zoom step. Rem utilities (`p-7`, `gap-5`) already scale
 * with `html { font-size: var(--fs-body) }` and need none; a px literal does not, which is why the
 * page measured ≈ 15–18 % taller than the design at 1440 (T3 run 2). Every eligible literal that
 * still applies at 1101 (plain, or under `xs:`–`lg:`) must have an `xl:` token of the same prefix
 * in the same class string, and every `xl:text-[Npx]` must be ≥ 11 px (the W190 floor — the
 * repo-wide scan in src/test/type-floor.test.ts guards the floor on every file; this one pins the
 * twins on this route). `max-*` tokens never reach the desktop and are exempt.
 */
const DIR = join(process.cwd(), 'src/app/[locale]/(site)/hiring-cost-calculator');
const FILES = [
  '_components/card-ui.tsx',
  '_components/CalculatorSkeleton.tsx',
  '_components/CalculatorIsland.tsx',
  '_components/SalaryGuideView.tsx',
  '_components/QuotaView.tsx',
  '_components/PassCheckView.tsx',
  '_sections/content.tsx',
  '_sections/ui.tsx',
];
describe('Cost Calculator — every px literal has its × 0.75 xl twin, text at ≥ 11 px (B1, W190 A1a)', () => {
  it('the scanner reads twins per class string and the floor on xl text', () => {
    expect(
      twinFindings('f.tsx', `<p className="px-[34px] py-[13px] xl:px-[25.5px] xl:py-[9.75px]" />`),
    ).toEqual([]);
    expect(twinFindings('f.tsx', `'text-[12.5px] xl:text-[11px] max-md:text-[11.5px]'`)).toEqual(
      [],
    );
    expect(twinFindings('f.tsx', `'gap-[9px] lg:gap-[12px]'`).map((f) => f.why)).toEqual([
      'no xl:gap- twin in the same class list',
      'no xl:gap- twin in the same class list',
    ]);
    expect(twinFindings('f.tsx', `'text-[13px] xl:text-[9.75px]'`).map((f) => f.why)).toEqual([
      '9.75px is under the 11 px floor',
    ]);
    expect(twinFindings('f.tsx', `'max-md:px-[15px] p-7 gap-5 rounded-[14px] h-[9px]'`)).toEqual(
      [],
    );
  });

  it('every route file is clean', () => {
    const failures = FILES.flatMap((f) =>
      formatTwinFindings(twinFindings(f, readFileSync(join(DIR, f), 'utf8'))),
    );
    expect(failures, `${failures.length} findings\n${failures.slice(0, 40).join('\n')}`).toEqual(
      [],
    );
  });
});
