import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// W125: jsdom cannot see React Server Component boundaries; `next build` can, and it refuses a
// server module whose graph reaches a client hook ("You're importing a module that depends on
// `usePathname` into a React Server Component module"). This static guard fails first: no block
// (server components, W13) and no `src/design/` module without a `'use client'` directive may
// import the hook module `@/analytics/useContactClick` — server code classifies an href through
// the pure `@/analytics/contact-kind` — or `next/navigation`. Type-only imports count too: the
// pure module exports the same types. Parsed with the TypeScript compiler, never matched as text:
// `ContactCta.tsx`'s own docblock carries the words `'use client'` and `next/navigation`.
//
// W130 widens it. The islands barrel re-exports hook modules, so a server page writing
// `import { ProgressBar } from '@/design/islands'` pulls every module behind the barrel into the
// server layer, where Next rejects `useEffect`/`useSyncExternalStore` exactly as it rejects
// `usePathname`. So (a) every module under `src/design/islands/` is a client module — the barrel,
// which holds nothing but re-exports, excepted — and (b) no directive-less module under
// `src/design/` imports a client-only React API (the list Next's RSC validator enforces).
//
// W134 widens it again, outside `src/design/`. A server page that imports even one island
// through the barrel ships all twelve island modules into that route's first-load JS, whether
// or not the route renders them. So (c) no module under `src/` outside the dev gallery
// (`src/app/[locale]/(site)/dev/gallery/`) and outside `src/design/islands/` itself may import
// the barrel path `@/design/islands` — a relative spelling of the same path (`../islands`,
// `./islands`) counts too, but a module path within it (`@/design/islands/ProgressBar`) does
// not. The gallery keeps the barrel import as the standing proof that the whole set compiles.
const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const DESIGN = join(SRC, 'design');
const BLOCKS = join(DESIGN, 'blocks');
const ISLANDS = join(DESIGN, 'islands');
const BARREL = join(ISLANDS, 'index.ts');
// The one directory allowed to import the barrel (W134): the dev gallery, which proves in
// every `next build` that the whole set compiles (W130). Never a route in production (R41).
const GALLERY = join(SRC, 'app', '[locale]', '(site)', 'dev', 'gallery');
const ISLANDS_BARREL_SPECIFIER = '@/design/islands';
const HOOK_MODULE = join(SRC, 'analytics', 'useContactClick');
const NAVIGATION = 'next/navigation';
const CLIENT_ONLY_REACT = new Set([
  'useState',
  'useEffect',
  'useLayoutEffect',
  'useInsertionEffect',
  'useRef',
  'useReducer',
  'useSyncExternalStore',
  'useTransition',
  'useDeferredValue',
  'useImperativeHandle',
  'useOptimistic',
  'useActionState',
  'createContext',
]);

/** Every module under `dir`, tests excluded (they are not part of any app graph). */
function modulesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : modulesUnder(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

/** A real directive is the file's first statement — not the same words in a comment. */
function isClientModule(file: string): boolean {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest);
  const first = source.statements[0];
  return Boolean(
    first &&
    ts.isExpressionStatement(first) &&
    ts.isStringLiteral(first.expression) &&
    first.expression.text === 'use client',
  );
}

/** Every specifier `text` imports or re-exports (static, dynamic, type-only), comment-aware.
 *  Pure over the source text alone — reads no file, so a fixture can name a path that does
 *  not exist on disk (used directly by `importsIslandsBarrel`'s unit case, W134). */
function specifiersIn(text: string): string[] {
  return ts.preProcessFile(text, true, true).importedFiles.map((f) => f.fileName);
}

/** Every specifier the file imports or re-exports (static, dynamic, type-only), comment-aware. */
function specifiersOf(file: string): string[] {
  return specifiersIn(readFileSync(file, 'utf8'));
}

function isForbidden(file: string, specifier: string): boolean {
  const bare = specifier.replace(/\.(ts|tsx|js|mjs)$/, '');
  if (bare === NAVIGATION) return true;
  const target = bare.startsWith('@/')
    ? join(SRC, bare.slice(2))
    : bare.startsWith('.')
      ? resolve(dirname(file), bare)
      : bare;
  return target === HOOK_MODULE;
}

/** True for the islands barrel `@/design/islands`, or a relative spelling that resolves to the
 *  same directory (`../islands`, `./islands`, …); false for a module path within it, such as
 *  `@/design/islands/ProgressBar` (W134). */
function isIslandsBarrelSpecifier(file: string, specifier: string): boolean {
  const bare = specifier.replace(/\.(ts|tsx|js|mjs)$/, '');
  if (bare === ISLANDS_BARREL_SPECIFIER) return true;
  if (!bare.startsWith('.')) return false;
  return resolve(dirname(file), bare) === ISLANDS;
}

/** True when `text` — a module's source, not necessarily read from disk — imports the islands
 *  barrel. Pure over (file, text): `file` only supplies the directory a relative specifier
 *  resolves against, so a fixture string can stand in for a real server page that does not
 *  exist on disk (W134's unit case). */
function importsIslandsBarrel(file: string, text: string): boolean {
  return specifiersIn(text).some((specifier) => isIslandsBarrelSpecifier(file, specifier));
}

/** The client-only React APIs a module reaches, however the import is spelled: named imports
 *  and re-exports from `react` (aliases resolved to the imported name, type-only included), and
 *  `X.useState`-style reads through a default or namespace import of `react`. `export *` from
 *  `react` counts as `*`. Parsed, so a commented-out import is not a hit. */
function clientOnlyReactApis(fileName: string, text: string): string[] {
  const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
  const isReact = (specifier: ts.Expression | undefined) =>
    specifier !== undefined && ts.isStringLiteral(specifier) && specifier.text === 'react';
  const found = new Set<string>();
  const namespaces = new Set<string>();
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && isReact(statement.moduleSpecifier)) {
      const clause = statement.importClause;
      if (clause?.name) namespaces.add(clause.name.text);
      const bindings = clause?.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings)) namespaces.add(bindings.name.text);
      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) {
          const imported = (element.propertyName ?? element.name).text;
          if (CLIENT_ONLY_REACT.has(imported)) found.add(imported);
        }
      }
    }
    if (ts.isExportDeclaration(statement) && isReact(statement.moduleSpecifier)) {
      const clause = statement.exportClause;
      if (clause && ts.isNamedExports(clause)) {
        for (const element of clause.elements) {
          const exported = (element.propertyName ?? element.name).text;
          if (CLIENT_ONLY_REACT.has(exported)) found.add(exported);
        }
      } else {
        found.add('*');
      }
    }
  }
  const visit = (node: ts.Node): void => {
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      namespaces.has(node.expression.text) &&
      CLIENT_ONLY_REACT.has(node.name.text)
    ) {
      found.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  };
  if (namespaces.size) visit(source);
  return [...found].sort();
}

const modules = modulesUnder(DESIGN);
const serverSide = modules.filter((f) => f.startsWith(BLOCKS + sep) || !isClientModule(f));

// W134's guard spans all of `src/`, not just `src/design/` — a block, a page, a piece of
// chrome or a form can all reach for the barrel — so it walks its own, wider module list.
const barrelCheckTargets = modulesUnder(SRC).filter(
  (file) => !file.startsWith(GALLERY + sep) && !file.startsWith(ISLANDS + sep),
);

describe('RSC import guard (W125, W130, W134)', () => {
  it('walks the blocks and tells a real directive from the words in a comment', () => {
    const contactCta = join(BLOCKS, 'ContactCta.tsx');
    expect(serverSide).toContain(contactCta);
    expect(isClientModule(contactCta)).toBe(false);
    expect(isClientModule(join(DESIGN, 'chrome', 'StickyCtaBar.tsx'))).toBe(true);
    expect(isForbidden(contactCta, '@/analytics/useContactClick')).toBe(true);
    expect(isForbidden(contactCta, '../../analytics/useContactClick')).toBe(true);
    expect(isForbidden(contactCta, '@/analytics/contact-kind')).toBe(false);
  });

  it('also walks src/design/islands: the re-export barrel is swept, an island module is not', () => {
    // `modulesUnder(DESIGN)` recurses into every subdirectory of `src/design`. After W130 the
    // only directive-less module under `islands/` is the barrel, so it is the one swept here.
    const rangeSlider = join(ISLANDS, 'RangeSlider.tsx');
    expect(serverSide).toContain(BARREL);
    expect(isClientModule(BARREL)).toBe(false);
    expect(isClientModule(rangeSlider)).toBe(true);
    expect(serverSide).not.toContain(rangeSlider);
  });

  it('no block and no server module under src/design imports useContactClick or next/navigation', () => {
    const offenders = serverSide.flatMap((file) =>
      specifiersOf(file)
        .filter((specifier) => isForbidden(file, specifier))
        .map((specifier) => `${relative(ROOT, file)} → ${specifier}`),
    );
    expect(offenders).toEqual([]);
  });

  it('every island module starts with the directive; the barrel holds nothing but re-exports (W130)', () => {
    const islands = modules.filter((file) => file.startsWith(ISLANDS + sep));
    expect(islands).toContain(join(ISLANDS, 'useInView.ts'));
    const plain = islands.filter((file) => file !== BARREL && !isClientModule(file));
    expect(plain.map((file) => relative(ROOT, file))).toEqual([]);
    const barrel = ts.createSourceFile(
      BARREL,
      readFileSync(BARREL, 'utf8'),
      ts.ScriptTarget.Latest,
    );
    expect(barrel.statements.length).toBeGreaterThan(0);
    for (const statement of barrel.statements) {
      expect(ts.isExportDeclaration(statement) && statement.moduleSpecifier !== undefined).toBe(
        true,
      );
    }
  });

  it('reads a client-only React API however the import is spelled, and ignores comments', () => {
    const apis = (text: string) => clientOnlyReactApis('probe.tsx', text);
    expect(apis("import { useState as s, useId, type RefObject } from 'react';")).toEqual([
      'useState',
    ]);
    expect(apis("import * as R from 'react';\nR.useEffect(() => {});")).toEqual(['useEffect']);
    expect(apis("import React from 'react';\nconst C = React.createContext(0);")).toEqual([
      'createContext',
    ]);
    expect(apis("export { useRef } from 'react';")).toEqual(['useRef']);
    expect(apis("// import { useState } from 'react';\nimport { useId } from 'react';")).toEqual(
      [],
    );
  });

  it('no directive-less module under src/design imports a client-only React API (W130)', () => {
    const offenders = modules
      .filter((file) => !isClientModule(file))
      .flatMap((file) =>
        clientOnlyReactApis(file, readFileSync(file, 'utf8')).map(
          (api) => `${relative(ROOT, file)} → ${api}`,
        ),
      );
    expect(offenders).toEqual([]);
  });

  it('flags a fake server page that imports the islands barrel, and clears a module-path import (W134)', () => {
    const fakePage = join(SRC, 'app', '[locale]', '(site)', 'fake', 'page.tsx');
    expect(
      importsIslandsBarrel(fakePage, "import { ProgressBar } from '@/design/islands';\n"),
    ).toBe(true);
    expect(
      importsIslandsBarrel(
        fakePage,
        "import { ProgressBar } from '@/design/islands/ProgressBar';\n",
      ),
    ).toBe(false);
    const fakeChrome = join(DESIGN, 'chrome', 'FakeChrome.tsx');
    expect(importsIslandsBarrel(fakeChrome, "export * from '../islands';\n")).toBe(true);
    const fakeDesignRoot = join(DESIGN, 'FakeRoot.tsx');
    expect(importsIslandsBarrel(fakeDesignRoot, "import { ShareRow } from './islands';\n")).toBe(
      true,
    );
  });

  it('no module under src, outside the dev gallery and outside src/design/islands, imports the islands barrel (W134)', () => {
    const offenders = barrelCheckTargets.flatMap((file) =>
      specifiersOf(file)
        .filter((specifier) => isIslandsBarrelSpecifier(file, specifier))
        .map((specifier) => `${relative(ROOT, file)} → ${specifier}`),
    );
    expect(offenders).toEqual([]);
  });
});
