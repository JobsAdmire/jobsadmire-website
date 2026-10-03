import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * QA W220 W-02: the design's section h2s on Available Workers (ll. 602 / 779 / 833) carry
 * `letter-spacing: -1.6px; line-height: 1.05`; `text-h2` is a font-size-only token, so without
 * the face a wrapped h2 inherits the body's 1.55 line-height and no tracking — two heading rhythms
 * on one screen beside the FaqBlock's h2. The three page h2s carry the face FaqBlock and Hire
 * Workers already port: `leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px]` (× 0.75 from 1101,
 * D19), the `max-md:` twins untouched (W217).
 */
const PAGE = join(process.cwd(), 'src/app/[locale]/(site)/available-workers/page.tsx');

describe('Available Workers — section h2 face (W-02)', () => {
  it('every text-h2 heading carries the design’s line-height and tracking with its xl twin', () => {
    const source = readFileSync(PAGE, 'utf8');
    const lists = source.match(/className="[^"]*\btext-h2\b[^"]*"/g) ?? [];
    expect(lists).toHaveLength(3);
    for (const list of lists) {
      expect(list).toContain('leading-[1.05]');
      expect(list).toContain('tracking-[-1.6px]');
      expect(list).toContain('xl:tracking-[-1.2px]');
      expect(list).toContain('max-md:text-[25px]');
    }
  });
});
