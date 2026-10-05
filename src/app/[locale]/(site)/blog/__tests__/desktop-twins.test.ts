import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TWIN_PREFIXES, formatTwinFindings, twinFindings } from '@/test/px-twins';

/**
 * D19 / W190 A1a (parity pass): every px literal the blog index writes carries its × 0.75 `xl:`
 * twin (text floored at 11 px) — the page, its components and its lib, the same scan the article
 * runs (`[slug]/__tests__/desktop-twins.test.ts`). Phone-only sizes are written `max-md:` and
 * never reach the desktop.
 */
const DIR = join(process.cwd(), 'src/app/[locale]/(site)/blog');
const PREFIXES = [...TWIN_PREFIXES, 'shadow', 'w', 'max-w'];
const files = (sub: string, ext: RegExp) =>
  readdirSync(join(DIR, sub))
    .filter((f) => ext.test(f))
    .map((f) => `${sub}/${f}`);

describe('Blog index — xl twins (D19)', () => {
  it('every page-local px literal carries its xl twin (page, components, lib)', () => {
    const list = ['page.tsx', ...files('_components', /\.tsx$/), ...files('_lib', /\.ts$/)];
    const failures = list.flatMap((f) =>
      formatTwinFindings(twinFindings(f, readFileSync(join(DIR, f), 'utf8'), PREFIXES)),
    );
    expect(failures, `${failures.length} findings\n${failures.join('\n')}`).toEqual([]);
  });
});
