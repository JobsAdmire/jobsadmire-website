import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { tokens } from '../tokens';

// W180 (T1 review, a WP1 D19 miss): the design wraps every section in `max-width:1280px` with
// 48 px of padding outside it, authored under `html { zoom: .75 }` from 1101 px — a 960 px
// content box with 36 px gutters there, the authored 48 px between 901 and 1100 (no zoom, and
// 1280 never binds below 1376 px), 20 px from 900 down (`.ja-sec`'s own ≤ 900 rule). The slim
// bar (`.ja-slim`, padding 48) and the nav (`.ja-nav`, padding 32) are full-bleed rows with no
// max-width. Vitest runs jsdom with `css: false` and cannot evaluate a media query, so this
// reads the stylesheet itself (comments stripped) and resolves it at a given viewport width.
const CSS = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

type Scope = { minWidth: number; body: string };

/** The top-level text (min-width 0) and every `@media (min-width: Npx) { … }` body, in source
 *  order. Any other at-rule block (reduced motion, print, keyframes) is dropped whole. */
function scopes(css: string): Scope[] {
  const out: Scope[] = [];
  let top = '';
  let i = 0;
  while (i < css.length) {
    if (css[i] !== '@') {
      top += css[i++];
      continue;
    }
    const open = css.indexOf('{', i);
    const semi = css.indexOf(';', i);
    if (semi !== -1 && semi < open) {
      i = semi + 1; // `@import …;`, `@source …;`
      continue;
    }
    const prelude = css.slice(i, open);
    let depth = 1;
    let j = open + 1;
    for (; j < css.length && depth > 0; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
    }
    const body = css.slice(open + 1, j - 1);
    const min = /^@media\s*\(\s*min-width:\s*(\d+)px\s*\)\s*$/.exec(prelude.trim());
    if (min) out.push({ minWidth: Number(min[1]), body });
    i = j;
  }
  return [{ minWidth: 0, body: top }, ...out];
}

/** Every declaration `selector` receives at `width`, later rules winning. */
function declarations(selector: string, width: number): Record<string, string> {
  const decl: Record<string, string> = {};
  for (const scope of scopes(CSS).filter((s) => s.minWidth <= width)) {
    for (const [, selectors, body] of scope.body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      if (!selectors!.split(',').some((s) => s.trim() === selector)) continue;
      for (const part of body!.split(';')) {
        const colon = part.indexOf(':');
        if (colon > 0) decl[part.slice(0, colon).trim()] = part.slice(colon + 1).trim();
      }
    }
  }
  return decl;
}

/** A length in px: `var(--x)` resolved against `:root` at `width`, then `calc()` arithmetic
 *  (+ − × ÷, parentheses) over px numbers. `none`/absent → `null`. */
function px(value: string | undefined, width: number): number | null {
  if (value === undefined || value === 'none') return null;
  const root = declarations(':root', width);
  let v = value;
  for (let n = 0; n < 10 && v.includes('var('); n++) {
    v = v.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, name: string) => {
      if (!(name in root)) throw new Error(`${name} is not defined on :root at ${width}px`);
      return root[name]!;
    });
  }
  if (v === 'none') return null;
  const src = v.replace(/^calc/, '').replace(/px/g, '');
  let pos = 0;
  const skip = () => {
    while (src[pos] === ' ') pos++;
  };
  const atom = (): number => {
    skip();
    if (src[pos] === '(') {
      pos++;
      const r = sum();
      skip();
      pos++; // ')'
      return r;
    }
    const m = /^-?\d+(\.\d+)?/.exec(src.slice(pos));
    if (!m) throw new Error(`cannot read "${value}" (${src}) at ${width}px`);
    pos += m[0].length;
    return Number(m[0]);
  };
  const product = (): number => {
    let r = atom();
    for (skip(); src[pos] === '*' || src[pos] === '/'; skip()) {
      const op = src[pos++];
      r = op === '*' ? r * atom() : r / atom();
    }
    return r;
  };
  const sum = (): number => {
    let r = product();
    for (skip(); src[pos] === '+' || src[pos] === '-'; skip()) {
      const op = src[pos++];
      r = op === '+' ? r + product() : r - product();
    }
    return r;
  };
  return sum();
}

/** The rendered geometry of a block-level row carrying `selector` in a `width` viewport. */
function box(selector: string, width: number) {
  const d = declarations(selector, width);
  const padding = px(d['padding-inline'], width) ?? 0;
  const max = px(d['max-width'], width);
  const outer = max === null ? width : Math.min(width, max);
  return {
    padding,
    maxWidth: max,
    content: outer - 2 * padding,
    left: (width - outer) / 2 + padding,
  };
}

const { layout } = tokens;

describe('.container-site follows the design wrapper at 0.75 (W180, D19)', () => {
  it.each([390, 460, 700, 900])('%ipx: the 20 px mobile gutter, no max-width (unchanged)', (w) => {
    expect(box('.container-site', w)).toEqual({
      padding: layout.gutterMobile,
      maxWidth: null,
      content: w - 2 * layout.gutterMobile,
      left: layout.gutterMobile,
    });
  });

  it.each([901, 1000, 1100])('%ipx: the authored 48 px gutter, no max-width', (w) => {
    const b = box('.container-site', w);
    expect(b.padding).toBe(layout.gutterTablet);
    expect(b.maxWidth).toBeNull();
    expect(b.content).toBe(w - 2 * layout.gutterTablet);
  });

  it.each([1101, 1280, 1440, 1920])('%ipx: a 960 px content box with 36 px gutters', (w) => {
    const b = box('.container-site', w);
    expect(b.padding).toBe(layout.gutterDesktop);
    expect(b.content).toBe(layout.maxWidth);
    // centred: at 1440 the content starts (1440 − 960) / 2 = 240 px in, as the design's does
    expect(b.left).toBe((w - layout.maxWidth) / 2);
  });

  it('stays unlayered and centred (W178: a layered utility never overrides it)', () => {
    expect(declarations('.container-site', 1440)['margin-inline']).toBe('auto');
    expect(CSS).not.toMatch(/@layer[^{]*\{[\s\S]*\.container-site/);
  });
});

describe('the full-bleed chrome rows (W180)', () => {
  it.each([390, 900, 901, 1100, 1101, 1440])(
    '%ipx: the slim bar row spans the viewport on the container gutter',
    (w) => {
      const slim = box('.chrome-row', w);
      expect(slim.maxWidth).toBeNull();
      expect(slim.padding).toBe(box('.container-site', w).padding);
    },
  );

  it.each([
    [390, 20],
    [900, 20],
    [901, 32],
    [1100, 32],
    [1101, 24],
    [1440, 24],
  ])(
    '%ipx: the header row spans the viewport on %i px (the design nav: 32 × 0.75 from 1101)',
    (w, pad) => {
      const nav = box('.chrome-row-nav', w);
      expect(nav.maxWidth).toBeNull();
      expect(nav.padding).toBe(pad);
    },
  );
});

describe('tokens.layout mirrors the stylesheet (W180)', () => {
  it('the content box and the gutters are the authored values × 0.75 from 1101', () => {
    expect(layout.maxWidth).toBe(1280 * 0.75);
    expect(layout.gutterDesktop).toBe(48 * 0.75);
    expect(layout.gutterTablet).toBe(48);
    expect(layout.gutterMobile).toBe(20);
    expect(layout.navGutterTablet).toBe(32);
    expect(layout.navGutterDesktop).toBe(32 * 0.75);
  });

  it('the header-row gutter tokens are the ones the stylesheet resolves', () => {
    expect(box('.chrome-row-nav', 1000).padding).toBe(layout.navGutterTablet);
    expect(box('.chrome-row-nav', 1440).padding).toBe(layout.navGutterDesktop);
    expect(box('.chrome-row-nav', 390).padding).toBe(layout.gutterMobile);
  });
});
