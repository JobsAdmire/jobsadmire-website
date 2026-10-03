import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { buttonClassName, type ButtonVariant } from '@/design/primitives/Button';
import { collisionsIn, formatCollision } from '@/test/class-collisions';

// W122/W155 — the static class-collision scan (final review I2). Tailwind 4 orders its rules by
// variant, property and name, never by position in the class string, so two utilities for the
// same property at the same variant chain on one element leave the winner to alphabetical order:
// the header CTA's designed blue hover never rendered (`hover:bg-ink` beat `hover:bg-blue-safe`),
// the slim-bar pills rendered white/70 instead of sky, the footer store badges white/60 instead
// of white. `collisionsIn` (src/test/class-collisions.ts) decides what "same property" means;
// this file decides WHICH class lists the source can produce, without rendering anything.
//
// A per-literal scan would have missed all three losers — each was composed ACROSS literals — so
// the scan evaluates the class-string expressions statically, parsed with the TypeScript compiler:
//   - string and template literals, a `${X}` resolved through the file's own `const X = …`
//     (objects and `X[key]` / `X.prop` included — `VARIANT[variant]`, `TONE[tone].box`);
//   - `a ? b : c`, `a && b`, `a || b`, `a ?? b` → every branch;
//   - `[…].join(' ')` and `[…].filter(Boolean).join(' ')` → every combination of the elements;
//   - `buttonClassName(variant, size, className)` and JSX `<Button>` / `<ContactCta>` props →
//     the REAL `buttonClassName` over every variant/size the arguments can take (an unknown
//     variant means all of them), so a caller class is checked against the base it lands on.
// An expression it cannot evaluate (a prop, a function result) contributes nothing: the scan
// never guesses. What it cannot see — a component merging an internal class with a caller's
// `className` prop — the render sweeps in `src/design/chrome/__tests__/` cover for the chrome.
const ROOT = process.cwd();
// W155 names src/design and src/app; the forms kernel's and the analytics links' markup is the
// same kind of class list, so the scan walks them too.
const SCAN_ROOTS = ['src/design', 'src/app', 'src/forms', 'src/analytics'].map((d) =>
  join(ROOT, d),
);
const BUTTON = join(ROOT, 'src', 'design', 'primitives', 'Button.tsx');
const SIZES = ['md', 'lg'] as const;
// Enough for every composition in the tree (the largest is a few dozen); past it the scan stops
// expanding rather than exploding.
const MAX_OPTIONS = 256;

/** Every non-test module under `dir`. */
function modulesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : modulesUnder(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

/** The members of `ButtonVariant`, read from Button.tsx's own union — a new variant is scanned
 *  the moment it exists. */
function buttonVariants(text: string): ButtonVariant[] {
  const source = ts.createSourceFile('Button.tsx', text, ts.ScriptTarget.Latest, true);
  for (const statement of source.statements) {
    if (ts.isTypeAliasDeclaration(statement) && statement.name.text === 'ButtonVariant') {
      const type = statement.type;
      const members = ts.isUnionTypeNode(type) ? type.types : [type];
      return members.flatMap((m) =>
        ts.isLiteralTypeNode(m) && ts.isStringLiteral(m.literal)
          ? [m.literal.text as ButtonVariant]
          : [],
      );
    }
  }
  return [];
}

type Finding = { line: number; collision: string };

function unwrap(e: ts.Expression): ts.Expression {
  let x = e;
  while (
    ts.isParenthesizedExpression(x) ||
    ts.isAsExpression(x) ||
    ts.isSatisfiesExpression(x) ||
    ts.isNonNullExpression(x) ||
    ts.isTypeAssertionExpression(x)
  ) {
    x = x.expression;
  }
  return x;
}

const unique = (xs: string[]) => [...new Set(xs)].slice(0, MAX_OPTIONS);
const orBlank = (xs: string[]) => (xs.length ? xs : ['']);

/** Every combination of one option per list, joined — capped at MAX_OPTIONS. */
function product(lists: string[][], glue: string): string[] {
  let acc: string[] = [''];
  let first = true;
  for (const options of lists) {
    const next: string[] = [];
    for (const a of acc) {
      for (const o of options) {
        if (next.length < MAX_OPTIONS) next.push(first ? o : `${a}${glue}${o}`);
      }
    }
    acc = unique(next);
    first = false;
  }
  return acc;
}

/**
 * Every same-property collision in one module's class strings. Pure over (fileName, text), so a
 * fixture can stand in for a module that does not exist on disk.
 */
function scanSource(fileName: string, text: string, variants: ButtonVariant[]): Finding[] {
  const tsx = fileName.endsWith('.tsx');
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    tsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  // Every `const NAME = …` in the file, whatever its scope (a name declared twice resolves to
  // both initializers — the union of their values, never a guess between them).
  const consts = new Map<string, ts.Expression[]>();
  const collect = (node: ts.Node): void => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.getCombinedNodeFlags(node) & ts.NodeFlags.Const
    ) {
      consts.set(node.name.text, [...(consts.get(node.name.text) ?? []), node.initializer]);
    }
    ts.forEachChild(node, collect);
  };
  collect(source);

  type Seen = ReadonlySet<ts.Node>;
  const enter = (seen: Seen, node: ts.Node): Seen | null =>
    seen.has(node) || seen.size > 16 ? null : new Set([...seen, node]);

  /** The object literals an expression can evaluate to (`TONE`, `TONE[tone]`, `c` = that). */
  function objectsOf(expr: ts.Expression, seen: Seen): ts.ObjectLiteralExpression[] {
    const e = unwrap(expr);
    const inner = enter(seen, e);
    if (!inner) return [];
    if (ts.isObjectLiteralExpression(e)) return [e];
    if (ts.isIdentifier(e)) return (consts.get(e.text) ?? []).flatMap((i) => objectsOf(i, inner));
    if (ts.isElementAccessExpression(e) || ts.isPropertyAccessExpression(e)) {
      return propertyValues(e, inner).flatMap((v) => objectsOf(v, inner));
    }
    if (ts.isConditionalExpression(e)) {
      return [...objectsOf(e.whenTrue, inner), ...objectsOf(e.whenFalse, inner)];
    }
    return [];
  }

  /** What `X.prop` / `X['key']` / `X[unknown]` can read from X's object literals. */
  function propertyValues(
    e: ts.ElementAccessExpression | ts.PropertyAccessExpression,
    seen: Seen,
  ): ts.Expression[] {
    let key: string | null = null;
    if (ts.isPropertyAccessExpression(e)) key = e.name.text;
    else {
      const arg = unwrap(e.argumentExpression);
      if (ts.isStringLiteralLike(arg)) key = arg.text;
    }
    return objectsOf(e.expression, seen).flatMap((obj) =>
      obj.properties.flatMap((p) => {
        if (!ts.isPropertyAssignment(p)) return [];
        const name =
          ts.isIdentifier(p.name) || ts.isStringLiteralLike(p.name) || ts.isNumericLiteral(p.name)
            ? p.name.text
            : null;
        return key === null || name === key ? [p.initializer] : [];
      }),
    );
  }

  /** The class strings an expression can evaluate to; [] when it cannot be evaluated. */
  function classesOf(expr: ts.Expression, seen: Seen): string[] {
    const e = unwrap(expr);
    const inner = enter(seen, e);
    if (!inner) return [];
    if (ts.isStringLiteralLike(e)) return [e.text];
    if (ts.isTemplateExpression(e)) {
      const parts: string[][] = [[e.head.text]];
      for (const span of e.templateSpans) {
        // an unknown interpolation still separates the tokens around it
        const value = classesOf(span.expression, inner);
        parts.push(value.length ? value : [' ']);
        parts.push([span.literal.text]);
      }
      return product(parts, '');
    }
    if (ts.isConditionalExpression(e)) {
      return unique([...classesOf(e.whenTrue, inner), ...classesOf(e.whenFalse, inner)]);
    }
    if (ts.isBinaryExpression(e)) {
      const op = e.operatorToken.kind;
      if (op === ts.SyntaxKind.AmpersandAmpersandToken) {
        return unique(['', ...classesOf(e.right, inner)]);
      }
      if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) {
        return unique([...classesOf(e.left, inner), ...classesOf(e.right, inner)]);
      }
      if (op === ts.SyntaxKind.PlusToken) {
        return product([orBlank(classesOf(e.left, inner)), orBlank(classesOf(e.right, inner))], '');
      }
      return [];
    }
    if (ts.isIdentifier(e)) {
      return unique((consts.get(e.text) ?? []).flatMap((i) => classesOf(i, inner)));
    }
    if (ts.isElementAccessExpression(e) || ts.isPropertyAccessExpression(e)) {
      return unique(propertyValues(e, inner).flatMap((v) => classesOf(v, inner)));
    }
    if (ts.isCallExpression(e)) return callClasses(e, inner);
    return [];
  }

  /** The literal options an argument can take, restricted to `allowed`; all of `allowed` when
   *  the argument cannot be evaluated. */
  function choices<T extends string>(
    expr: ts.Expression | undefined,
    seen: Seen,
    allowed: readonly T[],
    absent: readonly T[],
  ): T[] {
    if (!expr) return [...absent];
    const known = classesOf(expr, seen).filter((v): v is T =>
      (allowed as readonly string[]).includes(v),
    );
    return known.length ? known : [...allowed];
  }

  /** `buttonClassName(v, s, c)` over every (v, s, c) the arguments can take. */
  function buttonClasses(
    variantOptions: ButtonVariant[],
    sizeOptions: (typeof SIZES)[number][],
    classNameOptions: string[],
  ): string[] {
    const out: string[] = [];
    for (const v of variantOptions) {
      for (const s of sizeOptions) {
        for (const c of classNameOptions) out.push(buttonClassName(v, s, c || undefined));
      }
    }
    return unique(out);
  }

  function callClasses(call: ts.CallExpression, seen: Seen): string[] {
    const callee = unwrap(call.expression);
    if (ts.isIdentifier(callee) && callee.text === 'buttonClassName') {
      const [v, s, c] = call.arguments;
      return buttonClasses(
        choices(v, seen, variants, variants),
        choices(s, seen, SIZES, ['md']),
        c ? orBlank(classesOf(c, seen)) : [''],
      );
    }
    // `[…].join(' ')`, optionally through `.filter(Boolean)`
    if (ts.isPropertyAccessExpression(callee) && callee.name.text === 'join') {
      let target = unwrap(callee.expression);
      if (ts.isCallExpression(target)) {
        const inner = unwrap(target.expression);
        if (ts.isPropertyAccessExpression(inner) && inner.name.text === 'filter') {
          target = unwrap(inner.expression);
        }
      }
      if (ts.isArrayLiteralExpression(target)) {
        const parts = target.elements.map((el) =>
          orBlank(ts.isSpreadElement(el) ? [] : classesOf(el, seen)),
        );
        return product(parts, ' ');
      }
    }
    return [];
  }

  /** A JSX attribute's value as an expression (a bare string attribute included); undefined
   *  for a value it cannot read, null when the attribute is absent. */
  function valueOf(a: ts.JsxAttribute): ts.Expression | undefined {
    const init = a.initializer;
    if (!init) return undefined;
    if (ts.isStringLiteral(init)) return init;
    return ts.isJsxExpression(init) ? init.expression : undefined;
  }
  function attribute(attrs: ts.JsxAttributes, name: string): ts.Expression | undefined | null {
    for (const a of attrs.properties) {
      if (ts.isJsxAttribute(a) && ts.isIdentifier(a.name) && a.name.text === name)
        return valueOf(a);
    }
    return null;
  }

  const findings: Finding[] = [];
  const report = (node: ts.Node, classLists: string[]) => {
    const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
    for (const list of classLists) {
      for (const c of collisionsIn(list)) findings.push({ line, collision: formatCollision(c) });
    }
  };
  const none: Seen = new Set();

  const visit = (node: ts.Node): void => {
    if (ts.isStringLiteralLike(node) || ts.isTemplateExpression(node)) {
      report(node, classesOf(node, none));
    } else if (ts.isCallExpression(node)) {
      report(node, callClasses(node, none));
    } else if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name)) {
      const value = node.name.text === 'className' ? valueOf(node) : undefined;
      if (value) report(node, classesOf(value, none));
    } else if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      if (tag === 'Button' || tag === 'ContactCta') {
        const v = attribute(node.attributes, 'variant');
        const s = attribute(node.attributes, 'size');
        const c = attribute(node.attributes, 'className');
        const defaultVariant: ButtonVariant[] = tag === 'ContactCta' ? ['primary'] : variants;
        report(
          node,
          buttonClasses(
            v === null ? defaultVariant : choices(v, none, variants, variants),
            s === null ? ['md'] : choices(s, none, SIZES, ['md']),
            c ? orBlank(classesOf(c, none)) : [''],
          ),
        );
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);

  const seenFinding = new Set<string>();
  return findings.filter((f) => {
    const key = `${f.line} ${f.collision}`;
    if (seenFinding.has(key)) return false;
    seenFinding.add(key);
    return true;
  });
}

const VARIANTS = buttonVariants(readFileSync(BUTTON, 'utf8'));

describe('collisionsIn — the same-property check (W122/W155)', () => {
  // The brief's three RED fixtures, all built from classes the tree already uses. The precision
  // cases (colour vs size/alignment, bg colour vs image/size/position, border colour vs width,
  // variant chains, shorthand vs longhand) live in src/test/class-collisions.test.ts, beside the
  // checker: `src/test/` is outside Tailwind's content scan, so their fixture classes never
  // become CSS rules (this folder is scanned — a fixture here must use existing classes only).
  it('flags the three brief fixtures: display, text colour, hover background', () => {
    expect(collisionsIn('hidden inline-flex').map(formatCollision)).toEqual([
      'display — hidden vs inline-flex',
    ]);
    expect(collisionsIn('text-white/70 text-sky').map(formatCollision)).toEqual([
      'color — text-white/70 vs text-sky',
    ]);
    expect(collisionsIn('hover:bg-ink hover:bg-blue-safe').map(formatCollision)).toEqual([
      'hover: background-color — hover:bg-ink vs hover:bg-blue-safe',
    ]);
  });
});

describe('scanSource — evaluating class strings statically (W155)', () => {
  const scan = (text: string) => scanSource('Fixture.tsx', text, VARIANTS).map((f) => f.collision);

  it('reads the Button variants from the ButtonVariant union', () => {
    expect(VARIANTS).toContain('primary');
    expect(VARIANTS).toContain('inverse-dark');
  });

  it('flags a single literal', () => {
    expect(scan("const A = 'hidden inline-flex';")).toEqual(['display — hidden vs inline-flex']);
  });

  it('flags a colour appended through a template onto a const that already sets one (the slim-bar pill)', () => {
    expect(
      scan(
        "const LINK = 'inline-flex text-white/70';\nconst PILL = `${LINK} rounded-pill text-sky`;",
      ),
    ).toEqual(['color — text-white/70 vs text-sky']);
  });

  it('flags a caller class that lands on the variant it would override (the header CTA)', () => {
    expect(
      scan(
        "const P = buttonClassName('primary', 'md', 'whitespace-nowrap bg-ink hover:bg-blue-safe');",
      ),
    ).toEqual([
      'background-color — bg-blue-safe vs bg-ink',
      'hover: background-color — hover:bg-ink vs hover:bg-blue-safe',
    ]);
    expect(scan('const x = <Button variant="primary" className="bg-ink">Go</Button>;')).toEqual([
      'background-color — bg-blue-safe vs bg-ink',
    ]);
    expect(
      scan(
        'const x = <ContactCta placement="page_cta" href="/" className="bg-ink">Go</ContactCta>;',
      ),
    ).toEqual(['background-color — bg-blue-safe vs bg-ink']);
  });

  it('evaluates every branch of a joined array, a conditional and an object map', () => {
    expect(
      scan("const c = ['text-white', on ? 'text-sky' : 'px-4'].filter(Boolean).join(' ');"),
    ).toEqual(['color — text-white vs text-sky']);
    expect(
      scan(
        "const TONE = { a: { box: 'bg-ink' }, b: { box: 'bg-white' } } as const;\nconst t = TONE[tone];\nconst x = <div className={`bg-tint ${t.box}`} />;",
      ),
    ).toEqual(['background-color — bg-tint vs bg-ink', 'background-color — bg-tint vs bg-white']);
  });

  it('never guesses: an expression it cannot evaluate contributes nothing', () => {
    expect(scan('const x = <a className={`text-white ${props.tone}`} />;')).toEqual([]);
    expect(scan("const x = buttonClassName(variant, size, 'whitespace-nowrap');")).toEqual([]);
  });

  it('every Button variant × size is collision-free on its own', () => {
    const offenders = VARIANTS.flatMap((v) =>
      SIZES.flatMap((s) =>
        collisionsIn(buttonClassName(v, s)).map((c) => `${v}/${s}: ${formatCollision(c)}`),
      ),
    );
    expect(offenders).toEqual([]);
  });
});

describe('no class string in src/design, src/app, src/forms or src/analytics sets one property twice at one variant (W122/W155)', () => {
  it('the real tree', () => {
    const files = SCAN_ROOTS.flatMap(modulesUnder);
    expect(files.length).toBeGreaterThan(80);
    const offenders = files.flatMap((file) =>
      scanSource(file, readFileSync(file, 'utf8'), VARIANTS).map(
        (f) => `${relative(ROOT, file)}:${f.line} ${f.collision}`,
      ),
    );
    expect(offenders).toEqual([]);
  });
});
