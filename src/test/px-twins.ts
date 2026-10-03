import ts from 'typescript';

/**
 * Final pass B1–B3/C3 (W190 A1a, D19): the route-local "× 0.75 twin" scanner. A page-local
 * utility written as a px literal (`px-[34px]`, `text-[12.5px]`, `shadow-[0_26px_56px_…]`) never
 * takes the design's 1101 px zoom step — rem utilities do, through `html { font-size:
 * var(--fs-body) }` — so every eligible literal that still applies at 1101 (plain, or under
 * `xs:`–`lg:`) must carry an `xl:` token of the same prefix in the same class list, and every
 * `xl:text-[Npx]` must be ≥ 11 px (W190; the repo-wide floor lives in type-floor.test.ts). A
 * `max-*` VARIANT never reaches the desktop and is exempt (the `max-w-` utility is not a variant).
 *
 * Class lists come from the TypeScript AST, as type-floor.test.ts reads them — string literals,
 * templates with their spans joined and a `${X}` resolved through a file-level `const X = '…'` —
 * never from a quote regex, which a comment apostrophe desynchronises. Pure over (file, source).
 */
export const TWIN_PREFIXES = [
  'text',
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'gap',
  'gap-x',
  'gap-y',
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'tracking',
  'leading',
] as const;

export type TwinFinding = { file: string; line: number; token: string; why: string };

const XL_TEXT = /^(?:[a-z0-9-]+:)*xl:text-\[(\d+(?:\.\d+)?)px\]/;

/** The variant chain of a token (`max-md:hover:` → ['max-md', 'hover']), brackets kept whole. */
export function variantsOf(token: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth = Math.max(0, depth - 1);
    else if (c === ':' && depth === 0) {
      parts.push(token.slice(start, i));
      start = i + 1;
    }
  }
  return parts;
}

/** Every class-list candidate in one module with the line of its literal. */
export function classListsOf(
  fileName: string,
  text: string,
): { line: number; classList: string }[] {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const consts = new Map<string, string>();
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const d of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(d.name) &&
        d.initializer &&
        (ts.isStringLiteral(d.initializer) || ts.isNoSubstitutionTemplateLiteral(d.initializer))
      )
        consts.set(d.name.text, d.initializer.text);
    }
  }
  const out: { line: number; classList: string }[] = [];
  const lineOf = (node: ts.Node) =>
    source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
  const visit = (node: ts.Node): void => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      out.push({ line: lineOf(node), classList: node.text });
      return;
    }
    if (ts.isTemplateExpression(node)) {
      const parts = [node.head.text];
      for (const span of node.templateSpans) {
        const e = span.expression;
        parts.push(ts.isIdentifier(e) ? (consts.get(e.text) ?? '') : '');
        parts.push(span.literal.text);
      }
      out.push({ line: lineOf(node), classList: parts.join('') });
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
}

export function twinFindings(
  file: string,
  source: string,
  prefixes: readonly string[] = TWIN_PREFIXES,
): TwinFinding[] {
  const eligible = new RegExp(
    `^-?(${prefixes.join('|')})-\\[([^\\]]*\\d(?:\\.\\d+)?px[^\\]]*)\\](?:/\\S+)?$`,
  );
  const findings: TwinFinding[] = [];
  for (const { line, classList } of classListsOf(file, source)) {
    if (!classList.includes('-[')) continue;
    const tokens = classList.split(/\s+/).filter(Boolean);
    const xlPrefixes = new Set<string>();
    for (const t of tokens) {
      if (!variantsOf(t).includes('xl')) continue;
      const m = /^-?([a-z-]+?)-\[/.exec(t.slice(t.lastIndexOf(':') + 1));
      if (m) xlPrefixes.add(m[1]);
    }
    for (const token of tokens) {
      const xl = XL_TEXT.exec(token);
      if (xl && Number(xl[1]) < 11)
        findings.push({ file, line, token, why: `${xl[1]}px is under the 11 px floor` });
      const variants = variantsOf(token);
      if (variants.some((v) => /^(max-|xl$|2xl$)/.test(v))) continue;
      if (variants.some((v) => !/^(xs|sm|md|lg)$/.test(v))) continue; // hover:, print:, [&>svg]: — not a width step
      const utility = token.slice(token.lastIndexOf(':') + 1);
      const e = eligible.exec(utility);
      if (!e) continue;
      if (!xlPrefixes.has(e[1]))
        findings.push({ file, line, token, why: `no xl:${e[1]}- twin in the same class list` });
    }
  }
  return findings;
}

/** `file:line  token — why` lines for an assertion message. */
export const formatTwinFindings = (findings: TwinFinding[]) =>
  findings.map((x) => `${x.file}:${x.line}  ${x.token} — ${x.why}`);
