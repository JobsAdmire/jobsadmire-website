import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TWIN_PREFIXES, formatTwinFindings, twinFindings } from '@/test/px-twins';

/**
 * Final pass B3 (W196 A4): the About page's px literals — the hero's `lg:pt-[70px]
 * lg:pb-[88px]`, the trackings, the `max-w-[…]` columns and the licence `w-[150px]` — carry
 * their × 0.75 `xl:` twin; `grid-cols-[7.5rem_1fr]` and the gaps are rem and already scale
 * (deviation from the brief, recorded). The office cards sit on the pale surface: the page-local
 * `AboutOfficeCard` (SHARED 14.8) wears the design's `0 10px 30px rgba(22,60,90,0.08)` with its
 * × 0.75 twin, never the navy band's shadow. `min-h-[44px]`/`min-h-[52px]` are D20 hit targets, not eligible.
 */
const PAGE = join(process.cwd(), 'src/app/[locale]/(site)/about/page.tsx');
const PREFIXES = [...TWIN_PREFIXES, 'w', 'max-w', 'shadow'];

describe('About — px literals carry their × 0.75 xl twin; office cards on the pale face (B3)', () => {
  it('page.tsx is clean', () => {
    const failures = formatTwinFindings(
      twinFindings('page.tsx', readFileSync(PAGE, 'utf8'), PREFIXES),
    );
    expect(failures, `${failures.length} findings\n${failures.join('\n')}`).toEqual([]);
  });

  it('the office cards are the page-local AboutOfficeCard with the pale-surface shadow and its xl twin', () => {
    const source = readFileSync(PAGE, 'utf8');
    expect(source).toContain('<AboutOfficeCard');
    expect(source).not.toContain('<OfficeCard');
    const card = readFileSync(
      join(process.cwd(), 'src/app/[locale]/(site)/about/_components/AboutOfficeCard.tsx'),
      'utf8',
    );
    expect(card).toContain('shadow-[0_10px_30px_rgba(22,60,90,0.08)]');
    expect(card).toContain('xl:shadow-[0_7.5px_22.5px_rgba(22,60,90,0.08)]');
  });
});
