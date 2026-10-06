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
// The article's markup lives in `ArticleView` since W248 (shared with the draft preview).
const PAGE = readFileSync(join(DIR, '_components', 'ArticleView.tsx'), 'utf8');
const PREFIXES = [...TWIN_PREFIXES, 'shadow', 'w', 'max-w'];
const files = (sub: string, ext: RegExp) =>
  readdirSync(join(DIR, sub))
    .filter((f) => ext.test(f))
    .map((f) => `${sub}/${f}`);

describe('Blog article — cover, stack gap and xl twins (C1–C3)', () => {
  it('C1: the cover (photo or category-coloured placeholder) is 190 / 430 / 322.5 px with the design shadow', () => {
    const at = PAGE.indexOf('slot={`blog-cover-');
    expect(at).toBeGreaterThan(-1);
    const cover = PAGE.slice(PAGE.lastIndexOf('<CategoryCover', at), PAGE.indexOf('/>', at));
    expect(cover).toContain('h-[190px]');
    expect(cover).toContain('md:h-[430px]');
    expect(cover).toContain('xl:h-[322.5px]');
    expect(cover).toContain('rounded-lg');
    expect(cover).toContain('shadow-[0_26px_60px_rgba(22,60,90,0.18)]');
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
