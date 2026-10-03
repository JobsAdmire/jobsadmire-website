import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Review Minor 7. The generated SourceMap staggers its arcs and pulses with inline
// `animationDelay` styles, which the global reduced-motion rule (0.01 ms, one run) does not
// touch: under `prefers-reduced-motion: reduce` the arcs stayed undrawn and popped in one by
// one for ~1.5 s. Vitest runs jsdom with `css: false` and cannot evaluate a media query, so
// this reads the stylesheet itself (comments stripped, braces balanced).
const CSS = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

/** The body of every `@media (prefers-reduced-motion: reduce) { … }` block. */
function reducedMotionBlocks(css: string): string[] {
  const opener = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{/g;
  return [...css.matchAll(opener)].map((match) => {
    const start = match.index + match[0].length;
    let depth = 1;
    let i = start;
    for (; i < css.length && depth > 0; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
    }
    return css.slice(start, i - 1);
  });
}

/** The declarations of every rule in `blocks` whose selector list names `selector`. */
function declarationsFor(blocks: string[], selector: string): string {
  return blocks
    .flatMap((block) => [...block.matchAll(/([^{}]+)\{([^{}]*)\}/g)])
    .filter(([, selectors]) => selectors.split(',').some((s) => s.trim() === selector))
    .map(([, , body]) => body)
    .join(';');
}

describe('SourceMap under reduced motion (review Minor 7)', () => {
  const blocks = reducedMotionBlocks(CSS);

  it('reads the reduced-motion blocks, the global one included', () => {
    expect(declarationsFor(blocks, '*')).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
  });

  it.each(['.source-map__arc', '.source-map__pulse'])(
    '%s drops the inline stagger (animation-delay: 0s !important)',
    (selector) => {
      expect(declarationsFor(blocks, selector)).toMatch(/animation-delay:\s*0s\s*!important/);
    },
  );

  it('.source-map__arc renders at its drawn end state at once', () => {
    expect(declarationsFor(blocks, '.source-map__arc')).toMatch(/stroke-dashoffset:\s*0\s*(;|$)/);
  });
});
