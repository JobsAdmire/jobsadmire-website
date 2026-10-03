import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compile } from '@tailwindcss/node';
import { describe, expect, it } from 'vitest';

/**
 * W190 A1b / W210 (a) — the design's `@media (max-width: 600px)` heading rule has no repo
 * breakpoint (`xs` is 461, `sm` 561), so pages spell it `max-[601px]:` and never `max-sm:`. That
 * only works if Tailwind emits the arbitrary `max-[601px]` block AFTER the named `max-md`
 * (≤ 700) block a page may also carry on the same element: at 390 px both match and the later
 * rule wins. Compiled here from the real `globals.css` (theme and breakpoints, no source scan)
 * against the two candidates, so a Tailwind upgrade that reorders them fails this test instead of
 * silently restoring the ≤ 700 size on phones. jsdom runs with `css: false`, so the compiled
 * stylesheet is the only place the cascade can be read.
 */
describe('max-[601px] twins win over max-md at phone widths (W190 A1b, W210 a)', () => {
  it('Tailwind emits the ≤ 600 block after the ≤ 700 block and before the ≤ 460 block', async () => {
    const base = join(process.cwd(), 'src', 'app');
    const css = readFileSync(join(base, 'globals.css'), 'utf8')
      .replace(/@source[^;]*;/g, '')
      .replace("@import 'tailwindcss';", "@import 'tailwindcss' source(none);");
    const compiler = await compile(css, { base, onDependency: () => {} });
    const out = compiler.build([
      'max-md:text-[31px]',
      'max-[601px]:text-[32px]',
      'max-xs:text-[30px]',
      'max-md:tracking-[-1.1px]',
      'max-[601px]:tracking-[-0.6px]',
    ]);
    const at = (query: string) => {
      const i = out.indexOf(`@media (${query})`);
      expect(i, query).toBeGreaterThan(-1);
      return i;
    };
    const md = at('width < 701px');
    const six = at('width < 601px');
    const xs = at('width < 461px');
    expect(md).toBeLessThan(six);
    expect(six).toBeLessThan(xs);
    // the block really carries the ≤ 600 sizes
    const block = out.slice(six, xs);
    expect(block).toContain('font-size: 32px');
    expect(block).toContain('letter-spacing: -0.6px');
  });
});
