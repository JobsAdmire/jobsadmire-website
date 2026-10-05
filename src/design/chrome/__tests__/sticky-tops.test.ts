import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// W232: sticky columns stick below the sticky header at its real height. The header row is 71 CSS
// px on one line and 107–157 px where its desktop nav wraps (901 to ≈ 1165 px, by page and
// locale), so every sticky top is built from `--header-h` — published at runtime, with per-band
// fallbacks in globals.css — through the one `--sticky-top`, never a fixed `top-24`/`top-40`.
// jsdom evaluates neither media queries nor class names, so this reads the stylesheet and the
// source; e2e/focus-obscured.spec.ts measures the stuck columns in a browser.
const ROOT = process.cwd();
const CSS = readFileSync(join(ROOT, 'src', 'app', 'globals.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

type Rule = { minWidth: number; selector: string; body: string };

/** Every plain rule at the top level or inside an `@media (min-width: Npx)` block, in source
 *  order; any other at-rule block (`@supports`, `@theme`, reduced motion, print) is dropped. */
function rules(css: string): Rule[] {
  const scopes: { minWidth: number; body: string }[] = [];
  let top = '';
  for (let i = 0; i < css.length;) {
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
    let depth = 1;
    let j = open + 1;
    for (; j < css.length && depth > 0; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
    }
    const min = /^@media\s*\(\s*min-width:\s*(\d+)px\s*\)$/.exec(css.slice(i, open).trim());
    if (min) scopes.push({ minWidth: Number(min[1]), body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return [{ minWidth: 0, body: top }, ...scopes].flatMap(({ minWidth, body }) =>
    [...body.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, decls]) => ({
      minWidth,
      selector: selector!.trim(),
      body: decls!,
    })),
  );
}

/** The value `selector` gets for `prop` at a viewport `width`, later rules winning. */
function valueAt(selector: string, prop: string, width: number): string | undefined {
  let value: string | undefined;
  for (const rule of rules(CSS)) {
    if (rule.minWidth > width || rule.selector !== selector) continue;
    for (const part of rule.body.split(';')) {
      const colon = part.indexOf(':');
      if (colon > 0 && part.slice(0, colon).trim() === prop) value = part.slice(colon + 1).trim();
    }
  }
  return value;
}

describe('the sticky header’s height in the stylesheet (W232)', () => {
  it('falls back per band to the largest header measured there, until the page publishes its own', () => {
    const at = (width: number) => valueAt(':root', '--header-h', width);
    for (const width of [320, 390, 900]) expect(at(width), `${width}px`).toBe('71px');
    // the nav wraps: two rows (113 px), three on the calculator and workers CTAs (157 px)
    for (const width of [901, 1000, 1100]) expect(at(width), `${width}px`).toBe('157px');
    // two rows from 1101 until the nav fits on one (1104–1164 px measured)
    for (const width of [1101, 1150, 1199]) expect(at(width), `${width}px`).toBe('107px');
    for (const width of [1200, 1440, 1920]) expect(at(width), `${width}px`).toBe('71px');
  });

  it('builds the one sticky top from the header and a sticky sub-navigation, with 1.5rem of air', () => {
    expect(valueAt(':root', '--sticky-top', 0)).toBe(
      'calc(var(--header-h) + var(--jumpnav-h) + 1.5rem)',
    );
    for (const width of [0, 1101, 1920]) expect(valueAt(':root', '--jumpnav-h', width)).toBe('0px');
    // the work-permit jump nav, sticky from 1101: 8 px below the header, a 60 px row (68 px at the
    // 12 px root)
    const subnav = ':root:has([data-sticky-subnav])';
    expect(valueAt(subnav, '--jumpnav-h', 1100)).toBeUndefined();
    expect(valueAt(subnav, '--jumpnav-h', 1101)).toBe('calc(8px + 44px + 1.25rem + 1px)');
  });

  it('keeps the bottom scroll padding and adds no top one — anchor targets carry their own', () => {
    expect(valueAt('html', 'scroll-padding-bottom', 0)).toBe('var(--sticky-cta-h, 0px)');
    expect(CSS).not.toMatch(/scroll-padding-top|scroll-padding:/);
  });
});

/** Every non-test module under src/ (src/test holds the class-collision classifier's data). */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory())
      return entry.name === '__tests__' || path === join(ROOT, 'src', 'test')
        ? []
        : sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

/** Every string the module's code holds — literals, JSX attributes, template chunks; never a
 *  comment. Parsed, so a comment that mentions `lg:sticky` is not a class string. */
function stringsIn(file: string, text: string): string[] {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const out: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) out.push(node.text);
    else if (ts.isTemplateExpression(node))
      out.push(node.head.text, ...node.templateSpans.map((span) => span.literal.text));
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
}

const STICKY = /^((?:[\w-]+:)*)sticky$/;
const stickyClassLists = sourceFiles(join(ROOT, 'src')).flatMap((file) =>
  stringsIn(file, readFileSync(file, 'utf8'))
    .map((s) => s.split(/\s+/).filter(Boolean))
    .filter((tokens) => tokens.some((t) => STICKY.test(t)))
    .map((tokens) => ({ file: relative(ROOT, file).split(sep).join('/'), tokens })),
);

describe('every sticky element’s top comes from the header (W232)', () => {
  it('finds the sticky elements W232 moved', () => {
    expect([...new Set(stickyClassLists.map((c) => c.file))]).toEqual(
      expect.arrayContaining([
        'src/design/chrome/Header.tsx',
        'src/design/blocks/FaqBlock.tsx',
        'src/app/[locale]/(site)/_home/sections/ProcessSection.tsx',
        'src/app/[locale]/(site)/blog/[slug]/page.tsx',
        'src/app/[locale]/(site)/hiring-cost-calculator/_components/PassCheckView.tsx',
        'src/app/[locale]/(site)/work-permit/_sections/JumpNav.tsx',
        'src/app/[locale]/(site)/work-permit/_sections/Rules.tsx',
      ]),
    );
  });

  it('sticks every column at --sticky-top, the jump nav 8 px below the header, the header at 0', () => {
    const offenders = stickyClassLists.flatMap(({ file, tokens }) =>
      tokens.flatMap((token) => {
        const variant = STICKY.exec(token)?.[1];
        if (variant === undefined) return [];
        const allowed = [`${variant}top-(--sticky-top)`];
        if (file.endsWith('/chrome/Header.tsx')) allowed.push('top-0');
        if (file.endsWith('/_sections/JumpNav.tsx'))
          allowed.push(`${variant}top-[calc(var(--header-h)+8px)]`);
        return tokens.some((t) => allowed.includes(t)) ? [] : [`${file}: ${tokens.join(' ')}`];
      }),
    );
    expect(offenders).toEqual([]);
  });

  it('caps the blog sidebar to the screen below that same top (W231 + W232)', () => {
    const sidebar = stickyClassLists.find((c) => c.file.endsWith('/blog/[slug]/page.tsx'));
    expect(sidebar?.tokens).toEqual(
      expect.arrayContaining([
        'lg:top-(--sticky-top)',
        'lg:max-h-[calc(100vh/var(--zoom,1)_-_var(--sticky-top)_-_1.5rem_-_var(--sticky-cta-h,0px))]',
      ]),
    );
  });
});
