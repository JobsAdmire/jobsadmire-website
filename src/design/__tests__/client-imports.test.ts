import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// W147 (final review §2 / T3-5, extends W134): client modules import primitives, blocks and
// `@/lib/format/date` by module path. Turbopack does not drop a barrel's unused re-exports across
// the `'use client'` boundary, so one `import { buttonClassName } from '@/design/primitives'` in
// the header CTAs put Dialog, Tabs, RadioChips, Chip, PausableMarquee and Stat into the shared
// chunk of every route (≈ 3 KB gz); `@/lib/format/date` imports BOTH message catalogues. The
// barrels stay for server components and the dev gallery (which proves they compile).
//
// W156 (final fix round 1, widened by the final fix round 2 controller addition I0): proof run 1
// showed a SERVER component importing `@/design/primitives` turns every `'use client'` primitive
// the barrel re-exports into a client reference of the route (the manifest listed all seven), so
// check (a) below applies to EVERY non-test module outside the dev gallery — server components
// included — not only `'use client'` ones.
//
//   (a) no module under `src/` outside the dev gallery imports one of the three — static,
//       dynamic, re-export or type-only, whether or not it carries a `'use client'` directive;
//   (b) no module a CLIENT module reaches through RUNTIME imports does either: a directive-less
//       module a client module imports (ContactCta, which StickyCtaBar mounts) is bundled into
//       the same client graph, barrel and all — this is a client-bundle-composition check, so it
//       stays scoped to the client reachability graph. Type-only imports are erased at compile
//       time, so they are not edges here and not offences in (b).
// A relative spelling that resolves to the same path (`../primitives`, `./date`) counts; a module
// path within a barrel (`@/design/primitives/Button`, `@/lib/format/date/formatDate`) does not.
const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const GALLERY = join(SRC, 'app', '[locale]', '(site)', 'dev', 'gallery');
/** The three forbidden targets, as resolved paths without an extension. */
const BARRELS: ReadonlyMap<string, string> = new Map([
  [join(SRC, 'design', 'primitives'), '@/design/primitives'],
  [join(SRC, 'design', 'blocks'), '@/design/blocks'],
  [join(SRC, 'lib', 'format', 'date'), '@/lib/format/date'],
]);

type Import = { specifier: string; typeOnly: boolean };

/** Every module specifier `text` imports or re-exports, with whether the import is erased at
 *  compile time (`import type`, `export type`, or named bindings that are all `type`). Parsed,
 *  so a commented-out import is not an import. Pure over the text. */
function importsIn(fileName: string, text: string): Import[] {
  const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
  const out: Import[] = [];
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const clause = statement.importClause;
      const bindings = clause?.namedBindings;
      const allTypes =
        !clause?.name &&
        bindings !== undefined &&
        ts.isNamedImports(bindings) &&
        bindings.elements.length > 0 &&
        bindings.elements.every((e) => e.isTypeOnly);
      out.push({
        specifier: statement.moduleSpecifier.text,
        typeOnly: Boolean(clause?.isTypeOnly) || allTypes,
      });
    }
    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      const clause = statement.exportClause;
      const allTypes =
        clause !== undefined &&
        ts.isNamedExports(clause) &&
        clause.elements.length > 0 &&
        clause.elements.every((e) => e.isTypeOnly);
      out.push({
        specifier: statement.moduleSpecifier.text,
        typeOnly: statement.isTypeOnly || allTypes,
      });
    }
  }
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      out.push({ specifier: node.arguments[0].text, typeOnly: false });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
}

/** The absolute path a `@/` or relative specifier points at, without an extension; null for a
 *  package. */
function targetOf(file: string, specifier: string): string | null {
  const bare = specifier.replace(/\.(ts|tsx|js|mjs)$/, '');
  if (bare.startsWith('@/')) return join(SRC, bare.slice(2));
  if (bare.startsWith('.')) return resolve(dirname(file), bare);
  return null;
}

/** The barrel (`@/design/primitives`, …) a specifier names, however it is spelled, or null. */
function barrelOf(file: string, specifier: string): string | null {
  const target = targetOf(file, specifier);
  if (target === null) return null;
  return BARRELS.get(target.replace(/[\\/]index$/, '')) ?? null;
}

/** The file a specifier resolves to under `src/`, or null (a package, JSON, a missing file). */
function moduleFile(file: string, specifier: string): string | null {
  const target = targetOf(file, specifier);
  if (target === null) return null;
  for (const candidate of [
    `${target}.ts`,
    `${target}.tsx`,
    join(target, 'index.ts'),
    join(target, 'index.tsx'),
  ]) {
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      // not this candidate
    }
  }
  return null;
}

/** A real directive is the file's first statement — not the same words in a comment. */
function isClientText(fileName: string, text: string): boolean {
  const first = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest).statements[0];
  return Boolean(
    first &&
    ts.isExpressionStatement(first) &&
    ts.isStringLiteral(first.expression) &&
    first.expression.text === 'use client',
  );
}

function modulesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : modulesUnder(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const read = (file: string) => readFileSync(file, 'utf8');
/** Every non-test module outside the dev gallery — the W156 scope for check (a). */
const allRoots = modulesUnder(SRC).filter((file) => !file.startsWith(GALLERY + sep));
/** The narrower, `'use client'`-only scope check (b) still uses (a client-bundle-composition
 *  check has no reason to walk a server component's own server-only import graph). */
const clientRoots = allRoots.filter((file) => isClientText(file, read(file)));

/** Every module reachable from `roots` through runtime imports; a barrel is a leaf (its importer
 *  is the offender, not everything behind it). */
function clientGraph(roots: string[]): Map<string, string> {
  const reached = new Map<string, string>(roots.map((r) => [r, r])); // module → the root it came from
  const queue = [...roots];
  while (queue.length) {
    const file = queue.shift()!;
    for (const { specifier, typeOnly } of importsIn(file, read(file))) {
      if (typeOnly || barrelOf(file, specifier)) continue;
      const next = moduleFile(file, specifier);
      if (next && !reached.has(next)) {
        reached.set(next, reached.get(file)!);
        queue.push(next);
      }
    }
  }
  return reached;
}

describe('client modules import primitives, blocks and @/lib/format/date by module path (W147)', () => {
  const chrome = join(SRC, 'design', 'chrome', 'FakeClient.tsx');
  const barrels = (file: string, text: string) =>
    importsIn(file, text)
      .map((i) => barrelOf(file, i.specifier))
      .filter(Boolean);

  it('names a barrel however it is spelled, and clears a module path within it', () => {
    expect(barrels(chrome, "import { Button } from '@/design/primitives';")).toEqual([
      '@/design/primitives',
    ]);
    expect(barrels(chrome, "import type { ButtonVariant } from '@/design/primitives';")).toEqual([
      '@/design/primitives',
    ]);
    expect(barrels(chrome, "import { Dialog } from '../primitives';")).toEqual([
      '@/design/primitives',
    ]);
    expect(barrels(chrome, "export { ContactCta } from '@/design/blocks/index';")).toEqual([
      '@/design/blocks',
    ]);
    expect(barrels(chrome, "const m = import('@/lib/format/date');")).toEqual([
      '@/lib/format/date',
    ]);
    expect(
      barrels(join(SRC, 'lib', 'format', 'money.ts'), "import { formatDate } from './date';"),
    ).toEqual(['@/lib/format/date']);
    expect(
      barrels(
        chrome,
        "import { buttonClassName } from '@/design/primitives/Button';\n" +
          "import { ContactCta } from '@/design/blocks/ContactCta';\n" +
          "// import { Tabs } from '@/design/primitives';",
      ),
    ).toEqual([]);
  });

  it('tells an erased type-only import from a runtime one', () => {
    const kinds = (text: string) => importsIn('x.tsx', text).map((i) => i.typeOnly);
    expect(kinds("import type { A } from 'a';")).toEqual([true]);
    expect(kinds("import { type A, type B } from 'a';")).toEqual([true]);
    expect(kinds("import { type A, b } from 'a';")).toEqual([false]);
    expect(kinds("import A, { type B } from 'a';")).toEqual([false]);
    expect(kinds("export type { A } from 'a';\nexport { b } from 'b';")).toEqual([true, false]);
  });

  it('(W156) a server module (no client directive) is in scope where a client-only scan would miss it', () => {
    const server = join(SRC, 'design', 'chrome', 'FakeServer.tsx');
    const text = "import { Button } from '@/design/primitives';\nexport const X = Button;\n";
    expect(isClientText(server, text)).toBe(false);
    expect(barrels(server, text)).toEqual(['@/design/primitives']);
    // A real, on-disk proof that the scope actually widened: Footer is a server component
    // (round 1 moved it off the barrel after proof run 1) that `allRoots` still walks.
    const footer = join(SRC, 'design', 'chrome', 'Footer.tsx');
    expect(allRoots).toContain(footer);
    expect(clientRoots).not.toContain(footer);
  });

  it('(a) no module outside the dev gallery imports one of the three (W156: server components included)', () => {
    expect(allRoots).toContain(join(SRC, 'design', 'chrome', 'HeaderCtas.tsx'));
    expect(allRoots).toContain(join(SRC, 'forms', 'client', 'FormShell.tsx'));
    expect(allRoots).toContain(join(SRC, 'design', 'chrome', 'Footer.tsx'));
    const offenders = allRoots.flatMap((file) =>
      importsIn(file, read(file))
        .filter((i) => barrelOf(file, i.specifier))
        .map((i) => `${relative(ROOT, file)} → ${i.specifier}`),
    );
    expect(offenders).toEqual([]);
  });

  it('(b) nor does any module a client module reaches through runtime imports', () => {
    const graph = clientGraph(clientRoots);
    // non-vacuous: StickyCtaBar (client) reaches the directive-less ContactCta block
    expect(graph.get(join(SRC, 'design', 'blocks', 'ContactCta.tsx'))).toBe(
      join(SRC, 'design', 'chrome', 'StickyCtaBar.tsx'),
    );
    const offenders = [...graph.keys()].flatMap((file) =>
      importsIn(file, read(file))
        .filter((i) => !i.typeOnly && barrelOf(file, i.specifier))
        .map(
          (i) =>
            `${relative(ROOT, file)} → ${i.specifier} (reached from ${relative(ROOT, graph.get(file)!)})`,
        ),
    );
    expect(offenders).toEqual([]);
  });
});
