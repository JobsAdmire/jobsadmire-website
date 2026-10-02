import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TWIN_PREFIXES, formatTwinFindings, twinFindings } from '@/test/px-twins';

/**
 * Final pass B2 (W190 A1a / W194 A5): the Partner page's page-local px literals — type,
 * tracking, paddings and the five card shadows — carry their × 0.75 `xl:` twin from 1101 px.
 * The brief also named `p-7`, `px-6 py-6` and `lg:p-12`: those are rem utilities and already
 * scale with `html { font-size: var(--fs-body) }` (21 px measured for `p-7` at 1440), so they
 * need none — recorded as a deviation, not a twin.
 */
const DIR = join(process.cwd(), 'src/app/[locale]/(site)/partner-with-us');
const files = (sub: string) =>
  readdirSync(join(DIR, sub))
    .filter((f) => /\.tsx$/.test(f))
    .map((f) => `${sub}/${f}`);
const PREFIXES = [...TWIN_PREFIXES, 'shadow'];

describe('Partner With Us — px literals carry their × 0.75 xl twin (B2)', () => {
  it('shadows are eligible: a px-offset shadow without an xl twin is a finding', () => {
    expect(
      twinFindings('f.tsx', `'shadow-[0_26px_56px_rgba(15,36,56,0.35)] p-7'`, PREFIXES).map(
        (f) => f.why,
      ),
    ).toEqual(['no xl:shadow- twin in the same class list']);
    expect(
      twinFindings(
        'f.tsx',
        `'shadow-[0_26px_56px_rgba(15,36,56,0.35)] xl:shadow-[0_19.5px_42px_rgba(15,36,56,0.35)]'`,
        PREFIXES,
      ),
    ).toEqual([]);
  });

  it('every section and component file is clean', () => {
    const failures = [...files('_sections'), ...files('_components')].flatMap((f) =>
      formatTwinFindings(twinFindings(f, readFileSync(join(DIR, f), 'utf8'), PREFIXES)),
    );
    expect(failures, `${failures.length} findings\n${failures.join('\n')}`).toEqual([]);
  });
});
