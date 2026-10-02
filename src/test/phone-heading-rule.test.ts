import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { collisionsIn, formatCollision } from './class-collisions';

/**
 * W210 (a) / W216 (2) — the design's phone heading rule, site-wide.
 *
 * Twelve of the fourteen `.dc.html` page files carry a global `@media (max-width: 600px) { h1 {
 * font-size: 32px; letter-spacing: -0.6px } h2 { font-size: 25px; letter-spacing: -0.4px } }`
 * (`!important`); `Blog.dc.html` and `Blog Article.dc.html` carry a second, later ≤ 600 block that
 * sets h2 to 23 px (the later rule wins). The Homepage has no such rule (its h1 is `clamp(40px,
 * 4.6vw, 66px)` at every width — the site's `text-h1` matches it) and neither has CRM Login.
 *
 * The global rule reaches only a heading no class rule sizes: every file also carries per-section
 * class rules in its ≤ 700 px block (`.ja-pw-hero h1 { 31px }`, `.ja-jt-roles h2 { 27px }`,
 * `.ja-router h2 { 22px }`, …) and, both being `!important`, the class rule beats the global one by
 * specificity (D19). So a heading wears ONE phone face: the ≤ 600 twins (`max-[601px]:text-[32px]
 * max-[601px]:tracking-[-0.6px]` / `max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px]`, 23 px on
 * the blog routes — never `max-sm:`; `max-601-cascade.test.ts` pins the cascade) where the global
 * rule reaches it, or a `max-md:text-[…]` size where its own design class rule does. This guard
 * reads every `<h1>`/`<h2>` under the twelve rule-bearing routes from the TypeScript AST and
 * requires one of the two, unless the heading is a card or kicker title (`text-card-title`,
 * `text-eyebrow` — the design's inline-styled card h2s are outside the h1/h2 token rule), is
 * visually hidden, or is listed below with its reason. The Homepage and the portal login are
 * asserted to carry no twin.
 */
const ROOT = process.cwd();
const SITE = join(ROOT, 'src', 'app', '[locale]', '(site)');

/** The twelve rule-bearing design pages → their route folders (the blog folder holds Blog and
 *  Blog Article), with the ≤ 600 h2 size the file's global rule sets. */
const ROUTES: Record<string, { h2: number }> = {
  about: { h2: 25 },
  'available-workers': { h2: 25 },
  blog: { h2: 23 },
  careers: { h2: 25 },
  contact: { h2: 25 },
  'hire-workers': { h2: 25 },
  'hiring-cost-calculator': { h2: 25 },
  'partner-with-us': { h2: 25 },
  'success-stories': { h2: 25 },
  verify: { h2: 25 },
  'work-permit': { h2: 25 },
};
/** Shared blocks the rule-bearing pages mount whose headings the design sizes at ≤ 700 as well
 *  (QA W221 W-03: `.ja-close h2` is 25 px on every page's closing band) — swept like a route. */
const BLOCKS: readonly { path: string; h2: number }[] = [
  { path: join(ROOT, 'src', 'design', 'blocks', 'ClosingCtaBand.tsx'), h2: 25 },
];
const H1_TWINS = ['max-[601px]:text-[32px]', 'max-[601px]:tracking-[-0.6px]'];
const h2Twins = (px: number) => [`max-[601px]:text-[${px}px]`, 'max-[601px]:tracking-[-0.4px]'];

/** A heading whose own class list exempts it from the twins. */
const OWN_SIZE = /\bmax-md:text-\[/; // its own ≤ 700 design class rule (D19) — the global rule loses
const EXEMPT = [/\bsr-only\b/, /\btext-(card-title|eyebrow)\b/];

/** Headings exempt by file + a class-list marker, each with a one-line reason. The scan checks
 *  every entry still matches a heading that would otherwise fail, so the list cannot rot. */
const ALLOWLIST: readonly { file: string; match: string; reason: string }[] = [
  {
    file: 'src/app/[locale]/(site)/blog/[slug]/page.tsx',
    match: 'text-[27px]',
    reason:
      'the article hero h1 is sized by its own ≤ 700 design rule (`.ja-art-hero h1`, 27 px — Blog Article.dc.html:309), spelled as the base size with `md:` steps',
  },
  {
    file: 'src/app/[locale]/(site)/hiring-cost-calculator/_sections/ui.tsx',
    match: 'text-h2 leading-[1.05] tracking-[-0.04em] text-ink',
    reason: 'SectionHead is `max-md:sr-only` at ≤ 700 (W10): its h2 is never visible on phones',
  },
  {
    file: 'src/app/[locale]/(site)/hiring-cost-calculator/_sections/ui.tsx',
    match: 'text-[clamp(22px,2.4vw,28px)]',
    reason: 'SectionHead’s `sm` face — the same `max-md:sr-only` head',
  },
];

export type Heading = { line: number; tag: 'h1' | 'h2'; classList: string };

/** Every `<h1>`/`<h2>` in one module with its class list — a literal, a file-level const, an
 *  object const's lookup (`H2[size]`: every face), a template (spans resolved through the consts),
 *  a conditional (both branches), or any other expression's string literals joined. */
export function headingsOf(fileName: string, text: string): Heading[] {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const strings = new Map<string, string>();
  const objects = new Map<string, Record<string, string>>();
  const literal = (n: ts.Node): string | null =>
    ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) ? n.text : null;
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const d of statement.declarationList.declarations) {
      if (!ts.isIdentifier(d.name) || !d.initializer) continue;
      const init = ts.isAsExpression(d.initializer) ? d.initializer.expression : d.initializer;
      const s = literal(init);
      if (s !== null) strings.set(d.name.text, s);
      else if (ts.isObjectLiteralExpression(init)) {
        const o: Record<string, string> = {};
        for (const p of init.properties) {
          if (!ts.isPropertyAssignment(p)) continue;
          const v = literal(p.initializer);
          if (v !== null) o[p.name.getText(source)] = v;
        }
        objects.set(d.name.text, o);
      }
    }
  }
  const alts = (e: ts.Expression): string[] => {
    const s = literal(e);
    if (s !== null) return [s];
    if (ts.isParenthesizedExpression(e)) return alts(e.expression);
    if (ts.isTemplateExpression(e)) {
      let out = [e.head.text];
      for (const span of e.templateSpans) {
        const parts = alts(span.expression);
        out = out.flatMap((o) =>
          (parts.length ? parts : ['']).map((p) => o + p + span.literal.text),
        );
      }
      return out;
    }
    if (ts.isIdentifier(e)) {
      const str = strings.get(e.text);
      if (str !== undefined) return [str];
      const o = objects.get(e.text);
      return o ? Object.values(o) : [];
    }
    if (ts.isElementAccessExpression(e) && ts.isIdentifier(e.expression)) {
      const o = objects.get(e.expression.text);
      if (!o) return [];
      const key = literal(e.argumentExpression);
      return key !== null ? (o[key] !== undefined ? [o[key]] : []) : Object.values(o);
    }
    if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression)) {
      const o = objects.get(e.expression.text);
      return o && o[e.name.text] !== undefined ? [o[e.name.text]] : [];
    }
    if (ts.isConditionalExpression(e)) return [...alts(e.whenTrue), ...alts(e.whenFalse)];
    const parts: string[] = [];
    const walk = (n: ts.Node): void => {
      const v = literal(n);
      if (v !== null) parts.push(v);
      else if (ts.isIdentifier(n) && strings.has(n.text)) parts.push(strings.get(n.text)!);
      else ts.forEachChild(n, walk);
    };
    walk(e);
    return [parts.join(' ')];
  };
  const out: Heading[] = [];
  const visit = (node: ts.Node): void => {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      ts.isIdentifier(node.tagName) &&
      /^h[12]$/.test(node.tagName.text)
    ) {
      const tag = node.tagName.text as 'h1' | 'h2';
      const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
      const attr = node.attributes.properties.find(
        (p): p is ts.JsxAttribute =>
          ts.isJsxAttribute(p) && ts.isIdentifier(p.name) && p.name.text === 'className',
      );
      let lists = [''];
      if (attr?.initializer) {
        if (ts.isStringLiteral(attr.initializer)) lists = [attr.initializer.text];
        else if (ts.isJsxExpression(attr.initializer) && attr.initializer.expression)
          lists = alts(attr.initializer.expression);
      }
      for (const classList of lists)
        out.push({ line, tag, classList: classList.trim().replace(/\s+/g, ' ') });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
}

/** Every non-test module under `dir`. */
function modulesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : modulesUnder(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const tokens = (classList: string) => classList.split(' ');

/** The sweep: every failure as one line, and which allowlist entries were used. */
function sweep(): { failures: string[]; used: Set<number> } {
  const failures: string[] = [];
  const used = new Set<number>();
  const modules: { path: string; h2: number }[] = [
    ...Object.entries(ROUTES).flatMap(([route, { h2 }]) =>
      modulesUnder(join(SITE, route)).map((path) => ({ path, h2 })),
    ),
    ...BLOCKS,
  ];
  {
    for (const { path, h2 } of modules) {
      const file = relative(ROOT, path);
      for (const h of headingsOf(path, readFileSync(path, 'utf8'))) {
        const where = `${file}:${h.line} <${h.tag} "${h.classList}">`;
        if (/\bmax-sm:/.test(h.classList))
          failures.push(`${where} — max-sm: is never the ≤ 600 twin (W190 A1b)`);
        for (const c of collisionsIn(h.classList))
          failures.push(`${where} — W122 collision: ${formatCollision(c)}`);
        const entry = ALLOWLIST.findIndex((a) => a.file === file && h.classList.includes(a.match));
        if (entry !== -1) {
          used.add(entry);
          continue;
        }
        if (EXEMPT.some((re) => re.test(h.classList))) continue;
        const hasTwin = /\bmax-\[601px\]:text-\[/.test(h.classList);
        if (OWN_SIZE.test(h.classList)) {
          if (hasTwin)
            failures.push(`${where} — both a max-md: size and a max-[601px]: size; one phone face`);
          continue;
        }
        const twins = h.tag === 'h1' ? H1_TWINS : h2Twins(h2);
        const missing = twins.filter((t) => !tokens(h.classList).includes(t));
        if (missing.length) failures.push(`${where} — missing ${missing.join(' ')}`);
      }
    }
  }
  return { failures, used };
}

describe('phone heading rule — the reader', () => {
  it('reads literal, const, object-lookup, template and composed class lists', () => {
    const text = [
      "const FACE = 'text-h2 max-md:text-[25px]';",
      "const H2 = { lg: 'text-h2 a', sm: 'text-[clamp(22px,2.4vw,28px)] b' } as const;",
      'export const x = (size: keyof typeof H2, on: boolean) => (',
      '  <>',
      '    <h1 className="text-h1 max-[601px]:text-[32px]">a</h1>',
      '    <h2 className={FACE}>b</h2>',
      '    <h2 className={H2[size]}>c</h2>',
      '    <h2 className={`${FACE} mb-4`}>d</h2>',
      "    <h2 className={['m-0', on && 'max-md:text-[22px]'].filter(Boolean).join(' ')}>e</h2>",
      '    <h2>f</h2>',
      '  </>',
      ');',
    ].join('\n');
    expect(headingsOf('fixture.tsx', text).map((h) => `${h.tag}:${h.classList}`)).toEqual([
      'h1:text-h1 max-[601px]:text-[32px]',
      'h2:text-h2 max-md:text-[25px]',
      'h2:text-h2 a',
      'h2:text-[clamp(22px,2.4vw,28px)] b',
      'h2:text-h2 max-md:text-[25px] mb-4',
      'h2:m-0 max-md:text-[22px]',
      'h2:',
    ]);
  });
});

describe('phone heading rule — the twelve rule-bearing routes and the shared blocks (W210 a, W216 (2), W221 W-03)', () => {
  const { failures, used } = sweep();

  it('every h1/h2 wears one phone face: the ≤ 600 twins, or its own ≤ 700 design size, or a listed exemption', () => {
    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('the allowlist is real and minimal: every entry still matches a heading, with a reason', () => {
    ALLOWLIST.forEach((a, i) => {
      expect(a.reason.length, a.file).toBeGreaterThan(20);
      expect(readFileSync(join(ROOT, a.file), 'utf8'), `${a.file} lost '${a.match}'`).toContain(
        a.match,
      );
      expect(used.has(i), `${a.file} ('${a.match}') exempted nothing — drop it`).toBe(true);
    });
  });
});

describe('the Homepage and the portal login keep the clamp on phones (W216 (2))', () => {
  it('no heading or module under _home/** or (bare)/portal-login/** spells a ≤ 600 twin', () => {
    const dirs = [
      join(SITE, '_home'),
      join(ROOT, 'src', 'app', '[locale]', '(bare)', 'portal-login'),
    ];
    const modules = dirs.flatMap(modulesUnder);
    const headings = modules.flatMap((p) => headingsOf(p, readFileSync(p, 'utf8')));
    expect(headings.length).toBeGreaterThan(10); // the Homepage's h1 and section h2s, the login's h1/h2
    for (const h of headings) expect(h.classList).not.toMatch(/max-\[601px\]:|max-sm:/);
    const offenders = modules
      .filter((p) => /max-\[601px\]:/.test(readFileSync(p, 'utf8')))
      .map((p) => relative(ROOT, p));
    expect(offenders).toEqual([]);
  });
});
