import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TWIN_PREFIXES, formatTwinFindings, twinFindings } from '@/test/px-twins';

/**
 * Final pass C1–C3 (W206, W209): the article's cover is a cover-mode `ImageSlot` at the design's
 * fixed heights — 190 px ≤ 700, 430 px at 701–1100, 322.5 px from 1101 (never a caller class,
 * W129/W189 A3); the body/sidebar stack closes to the design's ≈ 30 px gap at 701–900
 * (`max-lg:gap-8`); every page-local px literal carries its × 0.75 `xl:` twin.
 */
const DIR = join(process.cwd(), 'src/app/[locale]/(site)/blog/[slug]');
const PAGE = readFileSync(join(DIR, 'page.tsx'), 'utf8');
const PREFIXES = [...TWIN_PREFIXES, 'shadow', 'w', 'max-w'];
const files = (sub: string, ext: RegExp) =>
  readdirSync(join(DIR, sub))
    .filter((f) => ext.test(f))
    .map((f) => `${sub}/${f}`);

describe('Blog article — cover, stack gap and xl twins (C1–C3)', () => {
  it('C1: the cover slot runs in cover mode at 190 / 430 / 322.5 px, nothing else sizes it', () => {
    const at = PAGE.indexOf('slot={`blog-cover-');
    expect(at).toBeGreaterThan(-1);
    const slot = PAGE.slice(PAGE.lastIndexOf('<ImageSlot', at), PAGE.indexOf('/>', at));
    expect(slot).toMatch(/cover=\{\{\s*base:\s*190,\s*md:\s*430,\s*xl:\s*322\.5\s*\}\}/);
    expect(slot).not.toMatch(/className/);
  });

  it('C2: the body/sidebar grid closes its gap at 701–900 (max-lg:gap-8)', () => {
    const grid = PAGE.match(/className="[^"]*lg:grid-cols-\[minmax\(0,1fr\)_300px\][^"]*"/)?.[0];
    expect(grid).toBeDefined();
    expect(grid).toContain('gap-14');
    expect(grid).toContain('max-lg:gap-8');
  });

  it('C3: every page-local px literal carries its xl twin (page, components, lib)', () => {
    const list = ['page.tsx', ...files('_components', /\.tsx$/), ...files('_lib', /\.ts$/)];
    const failures = list.flatMap((f) =>
      formatTwinFindings(twinFindings(f, readFileSync(join(DIR, f), 'utf8'), PREFIXES)),
    );
    expect(failures, `${failures.length} findings\n${failures.join('\n')}`).toEqual([]);
  });
});
