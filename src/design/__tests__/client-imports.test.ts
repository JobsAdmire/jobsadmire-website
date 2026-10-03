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
//
// W158 (final re-review N2): check (b) also forbids `@/lib/format/date/formatReadMinutes` (by path
// — it imports both message catalogues) and any `src/messages/*.json` import in the client graph;
// server components keep importing the formatter by path (PostCard).
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

/** The two file-system reads the graph walk makes — injectable, so a fixture case can build a
 *  module graph in memory (paths under `src/` that need not exist on disk). */
type ModuleFs = { read(file: string): string; isFile(file: string): boolean };
const diskFs: ModuleFs = {
  read: (file) => readFileSync(file, 'utf8'),
  isFile: (file) => {
    try {
      return statSync(file).isFile();
    } catch {
      return false; // not this candidate
    }
  },
};

/** The file a specifier resolves to under `src/`, or null (a package, JSON, a missing file). */
function moduleFile(file: string, specifier: string, fs: ModuleFs = diskFs): string | null {
  const target = targetOf(file, specifier);
  if (target === null) return null;
  for (const candidate of [
    `${target}.ts`,
    `${target}.tsx`,
    join(target, 'index.ts'),
    join(target, 'index.tsx'),
  ]) {
    if (fs.isFile(candidate)) return candidate;
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

const read = diskFs.read;
/** Every non-test module outside the dev gallery — the W156 scope for check (a). */
const allRoots = modulesUnder(SRC).filter((file) => !file.startsWith(GALLERY + sep));
/** The narrower, `'use client'`-only scope check (b) still uses (a client-bundle-composition
 *  check has no reason to walk a server component's own server-only import graph). */
const clientRoots = allRoots.filter((file) => isClientText(file, read(file)));

/** W158 (final re-review N2): `formatReadMinutes` imports BOTH full message catalogues, and the
 *  W156 date split moved it out of the barrel's reach — `@/lib/format/date/formatReadMinutes` is a
 *  module path within the barrel, which check (a) clears by design. It is forbidden in the CLIENT
 *  graph only: a server component (PostCard) imports it by path legitimately. Any module of the
 *  client graph importing a catalogue itself (`src/messages/*.json`, any spelling) is caught too —
 *  client copy reaches the browser only through `NextIntlClientProvider`'s `CLIENT_SYS` (W148). */
const READ_MINUTES = join(SRC, 'lib', 'format', 'date', 'formatReadMinutes');
const MESSAGES = join(SRC, 'messages');

/** What a module in the CLIENT graph must not import (check (b)), named for the offender line,
 *  or null: the three barrels, the read-minutes formatter, a message catalogue. */
function clientForbidden(file: string, specifier: string): string | null {
  const barrel = barrelOf(file, specifier);
  if (barrel) return barrel;
  const target = targetOf(file, specifier);
  if (target === READ_MINUTES) return '@/lib/format/date/formatReadMinutes';
  if (target !== null && dirname(target) === MESSAGES && target.endsWith('.json')) {
    return '@/messages/*.json';
  }
  return null;
}

/** Every module reachable from `roots` through runtime imports; a forbidden target is a leaf (its
 *  importer is the offender, not everything behind it). */
function clientGraph(roots: string[], fs: ModuleFs = diskFs): Map<string, string> {
  const reached = new Map<string, string>(roots.map((r) => [r, r])); // module → the root it came from
  const queue = [...roots];
  while (queue.length) {
    const file = queue.shift()!;
    for (const { specifier, typeOnly } of importsIn(file, fs.read(file))) {
      if (typeOnly || clientForbidden(file, specifier)) continue;
      const next = moduleFile(file, specifier, fs);
      if (next && !reached.has(next)) {
        reached.set(next, reached.get(file)!);
        queue.push(next);
      }
    }
  }
  return reached;
}

/** Check (b)'s offender lines: every module of the client graph (the roots included) that
 *  imports a client-forbidden target at runtime, with the client root it was reached from. */
function clientOffenders(roots: string[], fs: ModuleFs = diskFs): string[] {
  const graph = clientGraph(roots, fs);
  return [...graph.keys()].flatMap((file) =>
    importsIn(file, fs.read(file))
      .filter((i) => !i.typeOnly && clientForbidden(file, i.specifier))
      .map(
        (i) =>
          `${relative(ROOT, file)} → ${i.specifier} (reached from ${relative(ROOT, graph.get(file)!)})`,
      ),
  );
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
    // W158: the one real importer of the read-minutes formatter is a server block no client
    // module reaches — the rule forbids the client graph, not the module.
    expect(read(join(SRC, 'design', 'blocks', 'PostCard.tsx'))).toContain(
      "from '@/lib/format/date/formatReadMinutes'",
    );
    expect(graph.has(join(SRC, 'design', 'blocks', 'PostCard.tsx'))).toBe(false);
    expect(clientOffenders(clientRoots)).toEqual([]);
  });

  it('(b, W158) the read-minutes formatter and the message catalogues are forbidden in the client graph, directly or through a helper; a server importer is not', () => {
    const at = (...path: string[]) => join(SRC, ...path);
    const files = new Map<string, string>([
      [
        at('design', 'chrome', 'FakeIsland.tsx'),
        "'use client';\nimport { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';\n",
      ],
      [
        at('design', 'chrome', 'FakeIsland2.tsx'),
        "'use client';\nimport { readLabel } from './fake-read-label';\nexport const x = readLabel;\n",
      ],
      [
        at('design', 'chrome', 'fake-read-label.ts'),
        "import { formatReadMinutes } from '../../lib/format/date/formatReadMinutes.ts';\n" +
          'export const readLabel = formatReadMinutes;\n',
      ],
      [
        at('design', 'chrome', 'FakeIsland3.tsx'),
        "'use client';\nimport tr from '@/messages/tr.json';\nexport const n = Object.keys(tr).length;\n",
      ],
      // type-only: erased at compile time, never in the bundle, not an offender
      [
        at('design', 'chrome', 'FakeIsland4.tsx'),
        "'use client';\nimport type { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';\n",
      ],
      // a SERVER component may import it by path (PostCard does, W156) — no client root reaches it
      [
        at('design', 'blocks', 'FakeServerCard.tsx'),
        "import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';\nexport const y = formatReadMinutes;\n",
      ],
      [
        at('lib', 'format', 'date', 'formatReadMinutes.ts'),
        "import en from '@/messages/en.json';\nimport tr from '@/messages/tr.json';\nexport const formatReadMinutes = () => [en, tr];\n",
      ],
    ]);
    const memory: ModuleFs = { read: (file) => files.get(file) ?? '', isFile: (f) => files.has(f) };
    const roots = [...files.keys()].filter((file) => isClientText(file, files.get(file)!));
    expect(clientOffenders(roots, memory)).toEqual([
      'src/design/chrome/FakeIsland.tsx → @/lib/format/date/formatReadMinutes (reached from src/design/chrome/FakeIsland.tsx)',
      'src/design/chrome/FakeIsland3.tsx → @/messages/tr.json (reached from src/design/chrome/FakeIsland3.tsx)',
      'src/design/chrome/fake-read-label.ts → ../../lib/format/date/formatReadMinutes.ts (reached from src/design/chrome/FakeIsland2.tsx)',
    ]);
  });
});
