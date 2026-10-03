import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** The layout's `Archivo({...})` options, read from the source: `next/font/google` is a
 *  compile-time loader (SWC) that Vitest cannot evaluate, so the module is never imported. */
const source = readFileSync(join(process.cwd(), 'src/app/[locale]/layout.tsx'), 'utf8');
const options = source.match(/const archivo = Archivo\(\{([\s\S]*?)\}\);/)?.[1] ?? '';

describe('Archivo font loading (W188)', () => {
  it('is declared once in the locale layout', () => {
    expect(options).not.toBe('');
  });

  it("uses display 'optional': no swap after first paint, so a late web font can never rewrap a headline and shift layout", () => {
    expect(options).toMatch(/display:\s*'optional'/);
    expect(options).not.toMatch(/display:\s*'swap'/);
  });

  it('keeps both subsets (Turkish needs latin-ext), so next/font still preloads both files', () => {
    expect(options).toMatch(/subsets:\s*\[\s*'latin',\s*'latin-ext',?\s*\]/);
    expect(options).not.toMatch(/preload:\s*false/);
  });

  // W190 (optional hardening, final pass P2-6): the weight list is pinned. A weight the CSS asks
  // for but the font does not load is synthesised from a neighbour by the browser, and the pixel
  // harness's "drawn in Archivo" check reads the h1 (700) alone — it would never notice 500, 600
  // or 800 going missing.
  it("loads exactly the four weights the design uses — '500', '600', '700', '800'", () => {
    expect(options).toMatch(/weight:\s*\[\s*'500',\s*'600',\s*'700',\s*'800',?\s*\]/);
  });
});
