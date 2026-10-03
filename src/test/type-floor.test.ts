import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * W190 I1 / W191 — the 11 px desktop type floor, pinned statically (final pass P2-5).
 *
 * The tokens and D19 set 11 px as the smallest text a visitor reads at the desktop step
 * (`xl:` = 1101 px, the ×0.75 port of the design's 1440 canvas): seventeen `xl:` sizes of
 * 8.6–10.9 px on the Cost Calculator sat below it and were raised (W190); none may go below it
 * again. This scan reads every `text-[Npx]` literal in `src/app` and `src/design` — plain and
 * under a variant — and fails on any class list whose COMPUTED desktop size is under the floor:
 * the size of the token with the largest min-width breakpoint that still applies at 1101 px
 * (plain < xs < sm < md < lg < xl; a `max-*` variant never applies there, `2xl:` starts past
 * 1440). `text-[10.5px] xl:text-[11px]` passes (11 at desktop); `text-[10.5px]` alone and
 * `text-[13px] xl:text-[10px]` fail.
 *
 * Class lists are the file's string literals, a template's spans joined and a `${X}` resolved
 * through a file-level `const X = '…'` (one level — the same compromise as the collision scan).
 * `role="img"` compositions are exempt (W191): their glyphs are artwork described by the
 * `aria-label`, not text a visitor reads — listed by file with a one-line reason, and the scan
 * checks each listed file really carries `role="img"` and really needs the exemption, so the
 * list cannot rot or grow silently.
 */
const ROOT = process.cwd();
const SCAN_ROOTS = ['src/app', 'src/design'].map((d) => join(ROOT, d));
export const DESKTOP_FLOOR_PX = 11;

const ROLE_IMG_EXEMPT: Record<string, string> = {
  'src/app/[locale]/(site)/work-permit/_sections/SampleCard.tsx':
    'W191: the mock permit card is one role="img" picture named by sys.wp.sample.label; its 7–10 px glyphs are artwork, not content',
};

/** Min-width breakpoints that still apply at the 1101 px desktop step, in ascending order. */
const MIN_WIDTH_RANK: Record<string, number> = { '': 0, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 };
/** A variant under which the token never applies at desktop: `max-*` (any) and `2xl` (1536+). */
const NOT_DESKTOP = /^(max-|2xl$)/;

const SIZE_TOKEN = /^((?:[a-z0-9-]+(?:\[[^\]]*\])?:)*)text-\[(\d+(?:\.\d+)?)px\](?:\/\S+)?$/;
/** The arbitrary-property spelling of the same thing (`[font-size:9px]`, W212 M4). */
const PROP_TOKEN = /^((?:[a-z0-9-]+(?:\[[^\]]*\])?:)*)\[font-size:(\d+(?:\.\d+)?)px\]$/;

export type FloorFinding = { line: number; classList: string; desktopPx: number };

/** The computed desktop font size of one class list, or `null` when no `text-[Npx]` applies there. */
export function desktopSizeOf(classList: string): number | null {
  let bestRank = -1;
  let best: number | null = null;
  for (const token of classList.split(/\s+/)) {
    const m = SIZE_TOKEN.exec(token) ?? PROP_TOKEN.exec(token);
    if (!m) continue;
    const variants = m[1].split(':').filter(Boolean);
    if (variants.some((v) => NOT_DESKTOP.test(v))) continue;
    const rank = Math.max(0, ...variants.map((v) => MIN_WIDTH_RANK[v] ?? 0));
    const px = Number(m[2]);
    // the highest breakpoint wins; two tokens at the same rank → the smaller (the stricter read)
    if (rank > bestRank || (rank === bestRank && best !== null && px < best)) {
      bestRank = rank;
      best = px;
    }
  }
  return best;
}

/** Every class-list candidate in one module: string literals, templates (spans joined, `${X}`
 *  resolved through a file-level const of the same name), with the line of the literal. */
function classLists(fileName: string, text: string): { line: number; classList: string }[] {
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

/** Every class list in one module whose desktop size is under the floor. Pure over (name, text). */
export function floorFindings(fileName: string, text: string): FloorFinding[] {
  const findings: FloorFinding[] = [];
  for (const { line, classList } of classLists(fileName, text)) {
    const desktopPx = desktopSizeOf(classList);
    if (desktopPx !== null && desktopPx < DESKTOP_FLOOR_PX)
      findings.push({ line, classList: classList.trim().replace(/\s+/g, ' '), desktopPx });
  }
  return findings;
}

/** Every non-test module under `dir`. */
function modulesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : modulesUnder(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const format = (file: string, f: FloorFinding) =>
  `${file}:${f.line}  ${f.desktopPx}px at desktop (floor ${DESKTOP_FLOOR_PX}px) — '${f.classList}'`;

describe('desktop type floor — the scanner (W190/W191)', () => {
  it('computes the desktop size from the highest min-width token that applies at 1101 px', () => {
    expect(desktopSizeOf('text-[10.5px] xl:text-[11px]')).toBe(11);
    expect(desktopSizeOf('text-[13px] xl:text-[10px]')).toBe(10);
    expect(desktopSizeOf('m-0 text-[12px] font-bold lg:text-[11.5px]')).toBe(11.5);
    expect(desktopSizeOf('text-[12.5px]/[18px] tracking-[1px]')).toBe(12.5);
    expect(desktopSizeOf('[font-size:9px] font-bold')).toBe(9);
    expect(desktopSizeOf('text-[12px] xl:[font-size:10px]')).toBe(10);
    expect(desktopSizeOf('xl:text-[11px] text-[10.5px]')).toBe(11); // order in the string is irrelevant
    expect(desktopSizeOf('hover:text-[9px]')).toBe(9); // a state variant still reads at desktop
  });

  it('ignores tokens that never apply at desktop — max-* variants and 2xl — and lists without a size', () => {
    expect(desktopSizeOf('max-md:text-[10px] text-[11px]')).toBe(11);
    expect(desktopSizeOf('max-[601px]:text-[9px]')).toBeNull();
    expect(desktopSizeOf('2xl:text-[8px]')).toBeNull();
    expect(desktopSizeOf('rounded-pill px-3 font-bold')).toBeNull();
    expect(desktopSizeOf('text-body-sm text-[#253063]')).toBeNull();
  });

  it('reads class lists out of literals, templates and a template that spreads a file-level const', () => {
    const text = [
      "const BADGE = 'rounded-pill text-[10.5px] font-bold';",
      'const ok = `${BADGE} xl:text-[11px]`;',
      'const bad = `${BADGE} uppercase`;',
      'export const x = <p className="m-0 text-[13px] xl:text-[9.75px]">a</p>;',
      "export const y = <p className={clsx('text-[12px]', 'xl:text-[11px]')}>b</p>;",
    ].join('\n');
    expect(floorFindings('fixture.tsx', text)).toEqual([
      { line: 1, classList: 'rounded-pill text-[10.5px] font-bold', desktopPx: 10.5 },
      { line: 3, classList: 'rounded-pill text-[10.5px] font-bold uppercase', desktopPx: 10.5 },
      { line: 4, classList: 'm-0 text-[13px] xl:text-[9.75px]', desktopPx: 9.75 },
    ]);
  });
});

describe('desktop type floor — src/app and src/design (W190 I1, W191)', () => {
  const modules = SCAN_ROOTS.flatMap(modulesUnder);
  const exempt = new Set(Object.keys(ROLE_IMG_EXEMPT));

  it('every readable text literal computes to at least 11 px at the desktop step', () => {
    const failures = modules.flatMap((path) => {
      const file = relative(ROOT, path);
      if (exempt.has(file)) return [];
      return floorFindings(path, readFileSync(path, 'utf8')).map((f) => format(file, f));
    });
    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('the role="img" allowlist is real and minimal: each file carries role="img" and a sub-floor glyph', () => {
    for (const [file, reason] of Object.entries(ROLE_IMG_EXEMPT)) {
      expect(reason, file).toMatch(/^W191: /);
      const text = readFileSync(join(ROOT, file), 'utf8');
      expect(text, `${file} no longer carries role="img" — drop it from the allowlist`).toMatch(
        /role="img"/,
      );
      expect(
        floorFindings(file, text).length,
        `${file} has no sub-floor literal any more — drop it from the allowlist`,
      ).toBeGreaterThan(0);
    }
  });
});
