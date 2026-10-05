import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * QA W220 about-01: the design's `.ja-iskur-float` hangs `bottom: -44px` below the corridor card
 * (About Us.dc.html l. 606), whose bottom padding (36 px) keeps all four source-country lanes
 * clear. The port read it as `lg:-bottom-6` (24 px / 18 px from 1101), so the float covered the
 * fourth lane at every lg+ width. `-bottom-11` is 2.75 rem = 44 px at the 16 px root and 33 px at
 * the 12 px desktop root — the exact × 0.75 twin (D19), so no `xl:` literal is needed. From 901
 * the float is the design's white #d3e6f2 card (parity review S5.5), so it is found by `lg:bg-white`.
 */
const PAGE = join(process.cwd(), 'src/app/[locale]/(site)/about/page.tsx');

describe('About hero — the İŞKUR float sits at the design’s −44 px (about-01)', () => {
  it('the float carries lg:-bottom-11 and no other lg bottom offset', () => {
    const source = readFileSync(PAGE, 'utf8');
    const floats = source.match(/className="[^"]*\blg:absolute\b[^"]*\blg:bg-white\b[^"]*"/g) ?? [];
    expect(floats).toHaveLength(1);
    expect(floats[0]).toContain('lg:-bottom-11');
    expect(floats[0]).not.toMatch(/\blg:-bottom-(?!11\b)/);
  });
});
