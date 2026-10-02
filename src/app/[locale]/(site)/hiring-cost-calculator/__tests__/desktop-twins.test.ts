import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

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
const PREFIXES = [
  'text',
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'gap',
  'gap-x',
  'gap-y',
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'tracking',
  'leading',
];
const ELIGIBLE = new RegExp(
  `^-?(?:(?:xs|sm|md|lg):)?(${PREFIXES.join('|')})-\\[-?\\d+(?:\\.\\d+)?px\\](?:/\\S+)?$`,
);
const XL_TEXT = /^(?:[a-z0-9-]+:)*xl:text-\[(\d+(?:\.\d+)?)px\]/;

type Finding = { file: string; line: number; token: string; why: string };

export function twinFindings(file: string, source: string): Finding[] {
  const findings: Finding[] = [];
  const lineOf = (index: number) => source.slice(0, index).split('\n').length;
  for (const m of source.matchAll(/(['"`])([^'"`\\]*)\1/g)) {
    const body = m[2];
    if (!body.includes('-[')) continue;
    const tokens = body.split(/\s+/).filter(Boolean);
    const xlPrefixes = new Set(
      tokens
        .map((t) => /^(?:[a-z0-9-]+:)*xl:-?([a-z-]+?)-\[/.exec(t)?.[1])
        .filter((p): p is string => Boolean(p)),
    );
    for (const token of tokens) {
      const xl = XL_TEXT.exec(token);
      if (xl && Number(xl[1]) < 11)
        findings.push({
          file,
          line: lineOf(m.index!),
          token,
          why: `${xl[1]}px is under the 11 px floor`,
        });
      if (/max-/.test(token) || /(^|:)(xl|2xl):/.test(token)) continue;
      const e = ELIGIBLE.exec(token);
      if (!e) continue;
      if (!xlPrefixes.has(e[1]))
        findings.push({
          file,
          line: lineOf(m.index!),
          token,
          why: `no xl:${e[1]}- twin in the same class string`,
        });
    }
  }
  return findings;
}

describe('Cost Calculator — every px literal has its × 0.75 xl twin, text at ≥ 11 px (B1, W190 A1a)', () => {
  it('the scanner reads twins per class string and the floor on xl text', () => {
    expect(
      twinFindings('f.tsx', `<p className="px-[34px] py-[13px] xl:px-[25.5px] xl:py-[9.75px]" />`),
    ).toEqual([]);
    expect(twinFindings('f.tsx', `'text-[12.5px] xl:text-[11px] max-md:text-[11.5px]'`)).toEqual(
      [],
    );
    expect(twinFindings('f.tsx', `'gap-[9px] lg:gap-[12px]'`).map((f) => f.why)).toEqual([
      'no xl:gap- twin in the same class string',
      'no xl:gap- twin in the same class string',
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
      twinFindings(f, readFileSync(join(DIR, f), 'utf8')).map(
        (x) => `${x.file}:${x.line}  ${x.token} — ${x.why}`,
      ),
    );
    expect(failures, `${failures.length} findings\n${failures.slice(0, 40).join('\n')}`).toEqual(
      [],
    );
  });
});
