import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Vitest runs jsdom with `css: false` and cannot evaluate a media query, so this reads the
// stylesheet itself (comments stripped, braces balanced) — the source-map-motion test's approach.
const CSS = readFileSync(join(process.cwd(), 'src', 'design', 'motion', 'motion.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .trim();
const GLOBALS = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8');

type Block = { prelude: string; body: string };

/** The top-level blocks of `css`: rules and at-rules, each with its raw body. */
function blocks(css: string): Block[] {
  const out: Block[] = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    let depth = 1;
    let j = open + 1;
    for (; j < css.length && depth > 0; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
    }
    out.push({ prelude: css.slice(i, open).trim(), body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}

const TOP = blocks(CSS);
const rules = (list: Block[]) => list.filter((b) => !b.prelude.startsWith('@'));
const selectorsOf = (b: Block) => b.prelude.split(',').map((s) => s.replace(/\s+/g, ' ').trim());
const media = (query: string) =>
  TOP.filter((b) => b.prelude.replace(/\s+/g, ' ') === `@media ${query}`).flatMap((b) =>
    blocks(b.body),
  );
/** The declarations every rule in `list` gives `selector`, joined. */
const declarationsFor = (list: Block[], selector: string) =>
  rules(list)
    .filter((b) => selectorsOf(b).includes(selector))
    .map((b) => b.body)
    .join(';');

const REDUCED = media('(prefers-reduced-motion: reduce)');
const NO_SCRIPT = media('(scripting: none)');
const PRINT = media('print');
/** Selectors whose content starts hidden until the observer reveals it. */
const HIDDEN_UNTIL_REVEALED = [
  '.ja-reveal',
  '.ja-reveal .ja-stagger > *',
  '.ja-reveal-group .ja-stagger > *',
  '.ja-reveal-group .ja-step',
  '.ja-reveal-group .ja-tl-row',
  '.ja-reveal-group .ja-net-row',
];

describe('motion.css', () => {
  it('is imported by globals.css', () => {
    expect(GLOBALS).toMatch(/@import '\.\.\/design\/motion\/motion\.css';/);
  });

  it('ports the design reveal: 24 px rise, .75 s on the shared easing', () => {
    const reveal = declarationsFor(TOP, '.ja-reveal');
    expect(reveal).toMatch(/opacity:\s*0\s*;/);
    expect(reveal).toMatch(/transform:\s*translateY\(24px\)/);
    expect(reveal).toMatch(/opacity 0\.75s var\(--ja-ease\)/);
    expect(declarationsFor(TOP, ':root')).toMatch(
      /--ja-ease:\s*cubic-bezier\(0\.22, 1, 0\.36, 1\)/,
    );
    expect(declarationsFor(TOP, ':root')).toMatch(
      /--ja-spring:\s*cubic-bezier\(0\.34, 1\.56, 0\.64, 1\)/,
    );
    expect(declarationsFor(TOP, '.ja-reveal-on')).toMatch(/opacity:\s*1;\s*transform:\s*none/);
  });

  it.each(HIDDEN_UNTIL_REVEALED)(
    '%s is visible without scripting, in print and under reduced motion',
    (selector) => {
      expect(declarationsFor(NO_SCRIPT, selector)).toMatch(/opacity:\s*1/);
      expect(declarationsFor(PRINT, selector)).toMatch(/opacity:\s*1 !important/);
      expect(declarationsFor(REDUCED, selector)).toMatch(/opacity:\s*1/);
    },
  );

  it.each(HIDDEN_UNTIL_REVEALED)(
    '%s carries the 6.5 s backstop while unrevealed, so it never stays hidden if the observer never runs',
    (selector) => {
      const unrevealed = selector
        .replace('.ja-reveal-group', '.ja-reveal-group:not(.ja-reveal-on)')
        .replace(/^\.ja-reveal(?=$| )/, '.ja-reveal:not(.ja-reveal-on)');
      expect(declarationsFor(TOP, unrevealed)).toMatch(
        /animation:\s*jaRevealSafety [^;]* 6\.5s forwards/,
      );
    },
  );

  it('keeps no fill once an entrance has played: `backwards`, never `both` or `forwards`', () => {
    // An animation in effect acts as `will-change` on its properties: a filling transform makes
    // its element the containing block of `position: fixed` descendants (the Dialog overlay).
    const fills = rules(TOP)
      .filter((b) => /(^|;)\s*animation:/.test(b.body))
      .filter((b) => /\b(both|forwards)\b/.test(b.body));
    expect(fills.flatMap(selectorsOf).every((s) => s.includes(':not(.ja-reveal-on)'))).toBe(true);
    expect(fills.every((b) => /jaRevealSafety/.test(b.body))).toBe(true);
  });

  it('stops every animation under reduced motion (D20)', () => {
    const animated = rules(TOP)
      .filter((b) => /(^|;)\s*animation(-name)?:(?!\s*none\b)/.test(b.body))
      .flatMap(selectorsOf)
      // the backstop (unrevealed only) only ever raises opacity to the 1 reduced motion already
      // shows, so it may stay
      .filter((s) => !s.includes(':not(.ja-reveal-on)'));
    expect(animated.length).toBeGreaterThan(20);
    const stopped = rules(REDUCED)
      .filter((b) => /animation:\s*none/.test(b.body))
      .flatMap(selectorsOf);
    // `.ja-live-soft` / `.ja-live-wide` only rename `.ja-live`'s animation; `.ja-live` is stopped
    const exempt = ['.ja-live-soft', '.ja-live-wide', '.ja-reveal-on .ja-stagger > *'];
    const missing = animated.filter((s) => !stopped.includes(s) && !exempt.includes(s));
    // nth-child delay rules carry no animation of their own
    expect(missing.filter((s) => !/:nth-child/.test(s))).toEqual([]);
  });

  it('moves only compositor properties: keyframes never touch layout (CLS stays 0)', () => {
    const keyframes = TOP.filter((b) => b.prelude.startsWith('@keyframes'));
    expect(keyframes.length).toBeGreaterThan(20);
    for (const frame of keyframes) {
      const properties = [...frame.body.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
      expect(
        properties.filter((p) => !['opacity', 'transform', 'box-shadow'].includes(p)),
        frame.prelude,
      ).toEqual([]);
    }
  });

  it('transitions only opacity, transform, box-shadow and background colour', () => {
    const transitioned = rules(TOP)
      .map((b) => b.body.match(/transition:([^;]*)/)?.[1] ?? '')
      .filter(Boolean)
      .flatMap((value) => value.split(',').map((part) => part.trim().split(/\s+/)[0]))
      .filter((property) => property !== 'none');
    expect(transitioned.length).toBeGreaterThan(0);
    expect(
      transitioned.filter(
        (p) => !['opacity', 'transform', 'box-shadow', 'background-color'].includes(p),
      ),
    ).toEqual([]);
  });
});
