import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * W122/W155 — the same-property detector behind the class-collision guards: the static scan
 * (`src/design/__tests__/class-collisions.test.ts`) and the chrome's render assertions
 * (`src/design/chrome/__tests__/{Header,SlimBar,Footer}.test.tsx`).
 *
 * Tailwind 4 orders its rules by variant, then property, then name — never by position in the
 * class string — so when one element carries two utilities that set the same property at the
 * same variant chain, the one that wins is an accident of alphabetical order (`hover:bg-ink`
 * beat `hover:bg-blue-safe`, `text-white/70` beat `text-sky`, a bare `hidden` loses to
 * `inline-flex`). A caller therefore never appends a utility for a property the base string
 * already sets; a different look is a variant, or a colourless base plus its colour classes.
 *
 * A utility maps to a property GROUP only when the mapping is certain. Anything unrecognised —
 * custom classes (`container-site`), multi-property utilities (`sr-only`, `truncate`, a bare
 * `outline`), transforms, rings, gradient stops — maps to nothing and is never flagged.
 * Shorthand and longhand are different groups (`m-0 mb-4`, `border border-t-[3px]`,
 * `gap-3 gap-x-5`): Tailwind sorts the shorthand first on purpose, so the longhand wins by
 * design, not by accident. `text-*` is split precisely: `text-white`, `text-ink`, `text-sky`,
 * `text-*-safe`, `text-white/70` are colours; `text-sm`, `text-nav`, `text-body-sm`,
 * `text-[14px]` are sizes; `text-center` is alignment.
 *
 * The colour, font-size, shadow and font-family names are read from the `@theme` in
 * `src/app/globals.css` — the same source Tailwind generates the utilities from — plus
 * Tailwind's own defaults. `globals.css` excludes `src/test/` from Tailwind's content scan
 * (`@source not`), so the keyword lists below never generate a CSS rule of their own.
 */

const CSS = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8');

/** `--<ns>-<name>:` declarations in the stylesheet (sub-variables like `--text-x--line-height`
 *  excluded). */
function themeNames(ns: string): Set<string> {
  const names = [...CSS.matchAll(new RegExp(`--${ns}-([a-z0-9-]+?)\\s*:`, 'g'))].map((m) => m[1]);
  return new Set(names.filter((n) => !n.includes('--')));
}

const COLOURS = themeNames('color');
const SPECIAL_COLOURS = new Set(['white', 'black', 'transparent', 'current', 'inherit']);
// Tailwind 4's default palette (`@import 'tailwindcss'` keeps it): `<hue>-<shade>`.
const PALETTE =
  /^(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|[1-9]00|950)$/;
const FONT_SIZES = new Set([
  ...themeNames('text'),
  ...['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'],
]);
const SHADOWS = new Set([
  ...themeNames('shadow'),
  ...['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'none'],
]);
const FONT_FAMILIES = new Set([...themeNames('font'), 'sans', 'serif', 'mono']);
const FONT_WEIGHTS = new Set([
  'thin',
  'extralight',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
]);

const DISPLAY = new Set([
  'hidden',
  'block',
  'inline-block',
  'inline',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'table',
  'inline-table',
  'contents',
  'flow-root',
  'list-item',
  'table-caption',
  'table-cell',
  'table-column',
  'table-column-group',
  'table-footer-group',
  'table-header-group',
  'table-row',
  'table-row-group',
]);

/** Single-word utilities → the one property each sets. */
const KEYWORDS = new Map<string, string>([
  ...['static', 'fixed', 'absolute', 'relative', 'sticky'].map((k) => [k, 'position'] as const),
  ...['visible', 'invisible', 'collapse'].map((k) => [k, 'visibility'] as const),
  ...['uppercase', 'lowercase', 'capitalize', 'normal-case'].map(
    (k) => [k, 'text-transform'] as const,
  ),
  ...['underline', 'overline', 'line-through', 'no-underline'].map(
    (k) => [k, 'text-decoration-line'] as const,
  ),
  ...['italic', 'not-italic'].map((k) => [k, 'font-style'] as const),
  ...['grow', 'grow-0'].map((k) => [k, 'flex-grow'] as const),
  ...['shrink', 'shrink-0'].map((k) => [k, 'flex-shrink'] as const),
]);

/** Prefixes → property, first match wins (so `gap-x-` is tried before `gap-`). A leading `-`
 *  (negative value) is stripped before matching. */
const PREFIXES: readonly (readonly [string, string])[] = [
  ['min-w-', 'min-width'],
  ['min-h-', 'min-height'],
  ['max-w-', 'max-width'],
  ['max-h-', 'max-height'],
  ['w-', 'width'],
  ['h-', 'height'],
  ['size-', 'size'],
  ['gap-x-', 'column-gap'],
  ['gap-y-', 'row-gap'],
  ['gap-', 'gap'],
  ['inset-x-', 'inset-inline'],
  ['inset-y-', 'inset-block'],
  ['inset-', 'inset'],
  ['top-', 'top'],
  ['right-', 'right'],
  ['bottom-', 'bottom'],
  ['left-', 'left'],
  ['z-', 'z-index'],
  ['opacity-', 'opacity'],
  ['order-', 'order'],
  ['leading-', 'line-height'],
  ['tracking-', 'letter-spacing'],
  ['whitespace-', 'white-space'],
  ['items-', 'align-items'],
  ['justify-items-', 'justify-items'],
  ['justify-self-', 'justify-self'],
  ['justify-', 'justify-content'],
  ['self-', 'align-self'],
  ['grid-cols-', 'grid-template-columns'],
  ['grid-rows-', 'grid-template-rows'],
  ['grid-flow-', 'grid-auto-flow'],
  ['auto-cols-', 'grid-auto-columns'],
  ['auto-rows-', 'grid-auto-rows'],
  ['basis-', 'flex-basis'],
  ['overflow-x-', 'overflow-x'],
  ['overflow-y-', 'overflow-y'],
  ['cursor-', 'cursor'],
  ['pointer-events-', 'pointer-events'],
  ['select-', 'user-select'],
  ['duration-', 'transition-duration'],
  ['ease-', 'transition-timing-function'],
  ['delay-', 'transition-delay'],
  ['aspect-', 'aspect-ratio'],
  ['animate-', 'animation'],
];

const SPACING: Record<string, string> = {
  p: 'padding',
  px: 'padding-inline',
  py: 'padding-block',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  ps: 'padding-inline-start',
  pe: 'padding-inline-end',
  m: 'margin',
  mx: 'margin-inline',
  my: 'margin-block',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
  ms: 'margin-inline-start',
  me: 'margin-inline-end',
};

const SIDES: Record<string, string> = {
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left',
  x: 'inline',
  y: 'block',
  s: 'inline-start',
  e: 'inline-end',
};

/** A value without its modifier: `white/70` → `white`, `sm/6` → `sm`, `[#fff]/50` → `[#fff]`;
 *  an arbitrary value's own slashes (`[calc(100%/3)]`) are kept. */
function withoutModifier(value: string): string {
  if (value.startsWith('[') || value.startsWith('(')) {
    let depth = 0;
    for (let i = 0; i < value.length; i++) {
      const c = value[i];
      if (c === '[' || c === '(') depth++;
      else if ((c === ']' || c === ')') && --depth === 0) return value.slice(0, i + 1);
    }
    return value;
  }
  const slash = value.indexOf('/');
  return slash === -1 ? value : value.slice(0, slash);
}

function isColour(value: string): boolean {
  const v = withoutModifier(value);
  if (v.startsWith('[')) {
    return /^\[(#|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|hwb\(|color-mix\(|color:|var\(--color-)/.test(
      v,
    );
  }
  if (v.startsWith('(')) return v.startsWith('(color:');
  return COLOURS.has(v) || SPECIAL_COLOURS.has(v) || PALETTE.test(v);
}

function isLength(value: string): boolean {
  const v = withoutModifier(value);
  if (v.startsWith('[')) return /^\[(length:|-?\d|-?\.\d|clamp\(|calc\(|min\(|max\()/.test(v);
  return v.startsWith('(length:');
}

function textGroup(v: string): string | null {
  if (['left', 'center', 'right', 'justify', 'start', 'end'].includes(v)) return 'text-align';
  if (v === 'ellipsis' || v === 'clip') return 'text-overflow';
  if (['wrap', 'nowrap', 'balance', 'pretty'].includes(v)) return 'text-wrap';
  if (v.startsWith('shadow')) return null;
  if (isColour(v)) return 'color';
  if (FONT_SIZES.has(withoutModifier(v)) || isLength(v)) return 'font-size';
  return null;
}

const BG_POSITIONS = new Set(
  ['bottom', 'center', 'left', 'right', 'top'].flatMap((a) => [
    a,
    ...['bottom', 'top', 'left', 'right'].map((b) => `${a}-${b}`),
  ]),
);

function bgGroup(v: string): string | null {
  if (isColour(v)) return 'background-color';
  if (
    v === 'none' ||
    /^(gradient-to-|linear-|radial|conic)/.test(v) ||
    /^\[(url\(|image:|linear-gradient|radial-gradient|conic-gradient)/.test(v)
  ) {
    return 'background-image';
  }
  if (['auto', 'cover', 'contain'].includes(v) || v.startsWith('size-')) return 'background-size';
  if (BG_POSITIONS.has(v) || v.startsWith('position-')) return 'background-position';
  if (/^(repeat|no-repeat|repeat-x|repeat-y|repeat-round|repeat-space)$/.test(v)) {
    return 'background-repeat';
  }
  if (['fixed', 'local', 'scroll'].includes(v)) return 'background-attachment';
  if (v.startsWith('clip-')) return 'background-clip';
  if (v.startsWith('origin-')) return 'background-origin';
  if (v.startsWith('blend-')) return 'background-blend-mode';
  return null;
}

/** `border` / `border-2` / `border-t` / `border-t-[3px]` are widths, `border-dashed` a style,
 *  `border-white/20` / `border-t-blue` colours — one group per side, the all-sides shorthand
 *  its own. `border-collapse`/`border-spacing-*` are table properties: not grouped. */
function borderGroup(u: string): string | null {
  if (u === 'border') return 'border-width';
  let rest = u.slice('border-'.length);
  let prefix = 'border';
  const side = /^([trblxyse])(?:-(.+))?$/.exec(rest);
  if (side) {
    prefix = `border-${SIDES[side[1]]}`;
    if (side[2] === undefined) return `${prefix}-width`;
    rest = side[2];
  }
  if (/^\d+$/.test(rest) || isLength(rest)) return `${prefix}-width`;
  if (prefix === 'border' && /^(solid|dashed|dotted|double|hidden|none)$/.test(rest)) {
    return 'border-style';
  }
  if (isColour(rest)) return `${prefix}-color`;
  return null;
}

function roundedGroup(u: string): string {
  if (u === 'rounded') return 'border-radius';
  const corner = /^(t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee)(?:-.+)?$/.exec(u.slice('rounded-'.length));
  return corner ? `border-radius-${corner[1]}` : 'border-radius';
}

/** The CSS property (group) one utility — a class token with its variants removed — sets, or
 *  null when the mapping is not certain. */
export function propertyGroup(utility: string): string | null {
  const u = utility.replace(/^!/, '').replace(/!$/, '');
  if (DISPLAY.has(u)) return 'display';
  const keyword = KEYWORDS.get(u);
  if (keyword) return keyword;
  if (u.startsWith('text-')) return textGroup(u.slice('text-'.length));
  if (u.startsWith('bg-')) return bgGroup(u.slice('bg-'.length));
  if (u === 'border' || u.startsWith('border-')) return borderGroup(u);
  if (u === 'rounded' || u.startsWith('rounded-')) return roundedGroup(u);
  if (u.startsWith('font-')) {
    const v = u.slice('font-'.length);
    if (FONT_WEIGHTS.has(v) || /^\[\d+\]$/.test(v)) return 'font-weight';
    return FONT_FAMILIES.has(v) ? 'font-family' : null;
  }
  if (u.startsWith('flex-')) {
    const v = u.slice('flex-'.length);
    if (/^(row|row-reverse|col|col-reverse)$/.test(v)) return 'flex-direction';
    if (/^(wrap|wrap-reverse|nowrap)$/.test(v)) return 'flex-wrap';
    if (/^(\d+|auto|initial|none|\[.+\]|\d+\/\d+)$/.test(v)) return 'flex';
    return null;
  }
  if (/^overflow-(auto|hidden|clip|visible|scroll)$/.test(u)) return 'overflow';
  if (/^content-(center|start|end|between|around|evenly|stretch|normal|baseline)$/.test(u)) {
    return 'align-content';
  }
  if (u === 'transition' || u.startsWith('transition-')) return 'transition-property';
  if (u === 'shadow') return 'box-shadow';
  if (u.startsWith('shadow-')) {
    const v = u.slice('shadow-'.length);
    if (isColour(v)) return 'box-shadow-color';
    return SHADOWS.has(v) || v.startsWith('[') ? 'box-shadow' : null;
  }
  if (u.startsWith('outline-')) {
    const v = u.slice('outline-'.length);
    if (v.startsWith('offset-')) return 'outline-offset';
    if (/^\d+$/.test(v) || isLength(v)) return 'outline-width';
    if (/^(none|hidden|solid|dashed|dotted|double)$/.test(v)) return 'outline-style';
    return isColour(v) ? 'outline-color' : null;
  }
  if (/^list-(none|disc|decimal)$/.test(u)) return 'list-style-type';
  if (/^list-(inside|outside)$/.test(u)) return 'list-style-position';
  if (/^object-(contain|cover|fill|none|scale-down)$/.test(u)) return 'object-fit';
  const positive = u.replace(/^-/, '');
  const spacing = /^([a-z]{1,2})-(.+)$/.exec(positive);
  if (spacing && SPACING[spacing[1]]) return SPACING[spacing[1]];
  for (const [prefix, group] of PREFIXES) {
    if (positive.startsWith(prefix)) return group;
  }
  return null;
}

/** A class token split at its last top-level `:` into its variant chain and its utility —
 *  `max-xl:hidden` → `max-xl` + `hidden`, `[&>svg]:h-4` → `[&>svg]` + `h-4`, `hover:bg-ink` →
 *  `hover` + `bg-ink`. A `:` inside `[…]`/`(…)` belongs to an arbitrary value or variant. */
export function splitToken(token: string): { variants: string; utility: string } {
  let depth = 0;
  let last = -1;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth = Math.max(0, depth - 1);
    else if (c === ':' && depth === 0) last = i;
  }
  return last === -1
    ? { variants: '', utility: token }
    : { variants: token.slice(0, last), utility: token.slice(last + 1) };
}

export type Collision = { variants: string; group: string; tokens: string[] };

/** Every property group that more than one distinct utility of `classList` sets at the same
 *  variant chain — each one a W122 defect whose winner is decided by Tailwind's sort order. */
export function collisionsIn(classList: string): Collision[] {
  const byKey = new Map<string, Collision>();
  for (const token of new Set(classList.split(/\s+/).filter(Boolean))) {
    const { variants, utility } = splitToken(token);
    const group = propertyGroup(utility);
    if (!group) continue;
    const key = `${variants} ${group}`;
    const entry = byKey.get(key) ?? { variants, group, tokens: [] };
    entry.tokens.push(token);
    byKey.set(key, entry);
  }
  return [...byKey.values()].filter((c) => c.tokens.length > 1);
}

/** `hover: background-color — hover:bg-ink vs hover:bg-blue-safe` */
export function formatCollision(c: Collision): string {
  return `${c.variants ? `${c.variants}: ` : ''}${c.group} — ${c.tokens.join(' vs ')}`;
}

/** The render-side guard: every element under `root` whose class list carries a collision,
 *  as `<tag "text">: <collision>` lines (empty when the tree is clean). `getAttribute('class')`
 *  because an SVG's `className` is an SVGAnimatedString, not a string. */
export function collisionsInTree(root: Element): string[] {
  return [root, ...Array.from(root.querySelectorAll('*'))].flatMap((el) => {
    const cls = el.getAttribute('class');
    if (!cls) return [];
    const label = `<${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 40)}">`;
    return collisionsIn(cls).map((c) => `${label}: ${formatCollision(c)}`);
  });
}
