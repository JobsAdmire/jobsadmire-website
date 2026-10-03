// Purity guard (W144(c)): src/lib/calculator/** must stay safe to import from a 'use client'
// island or a server component alike — no React, no server-only, no Node builtins, no next-intl
// or message JSON, no Task 5's date.ts (it imports next-intl's message files), no reading the
// generated bundle or the design package directly — whether imported directly or re-exported via
// `export … from '<spec>'` (the barrel's only syntax). Node builtins are flagged both `node:`-
// prefixed and as the bare `fs`/`path` specifiers (N1). Scans every non-test `.ts` file under
// src/lib/calculator/ recursively — including `__tests__/fixtures.ts`, a data module the engine's
// authoring data imports — excluding only `*.test.ts` files.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const FORBIDDEN: Array<{ label: string; test: (specifier: string) => boolean }> = [
  { label: 'react', test: (s) => s === 'react' || s.startsWith('react/') },
  { label: 'server-only', test: (s) => s === 'server-only' },
  {
    label: 'a Node builtin',
    // `node:`-prefixed builtins, plus the bare `fs`/`path` specifiers (N1) — the two builtins an
    // authoring script would reach for first and the ones a re-export could smuggle in unbarred.
    test: (s) =>
      s.startsWith('node:') ||
      s === 'fs' ||
      s === 'path' ||
      s.startsWith('fs/') ||
      s.startsWith('path/'),
  },
  { label: 'next-intl', test: (s) => s === 'next-intl' || s.startsWith('next-intl/') },
  { label: '@/messages', test: (s) => s.startsWith('@/messages') },
  { label: '@/lib/format/date', test: (s) => s.startsWith('@/lib/format/date') },
  { label: 'content/local', test: (s) => s.includes('content/local') },
  { label: 'design-package', test: (s) => s.includes('design-package') },
];

// Matches a dynamic import(), a static `import ... from '...'` (with or without a `from`, so a
// bare side-effect import like `import 'server-only'` is caught too), a `require(...)`, or an
// `export … from '<spec>'` re-export — named, `*`, `type`, or spanning multiple lines (N1; this
// is the only syntax `index.ts` uses, and until now it passed the guard unseen).
const IMPORT_SPECIFIER =
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)|\bimport\s+(?:[^'";]*?\bfrom\s+)?['"]([^'"]+)['"]|\brequire\(\s*['"]([^'"]+)['"]\s*\)|\bexport\s+[^'";]*?\bfrom\s+['"]([^'"]+)['"]/g;

/** Pure (file, source) checker: lists every forbidden import `source` uses, `[]` if clean. */
function findImpureImports(file: string, source: string): string[] {
  const specifiers = new Set<string>();
  for (const match of source.matchAll(IMPORT_SPECIFIER)) {
    const specifier = match[1] ?? match[2] ?? match[3] ?? match[4];
    if (specifier) specifiers.add(specifier);
  }
  const hits: string[] = [];
  for (const specifier of specifiers) {
    const forbidden = FORBIDDEN.find((f) => f.test(specifier));
    if (forbidden) hits.push(`${file}: imports ${forbidden.label} ("${specifier}")`);
  }
  return hits;
}

describe('findImpureImports (the checker itself)', () => {
  it('flags a fixture source that imports every forbidden thing', () => {
    const fixture = `
      import 'server-only';
      import { useTranslations } from 'next-intl';
      import { formatMonth } from '@/lib/format/date';
      import en from '@/messages/en.json';
      import { readFileSync } from 'node:fs';
      import bundle from '../../content/local/bundle.tr.json';
      import copy from '../../../design-package/strings/calculator.json';
      import { useState } from 'react';
      import { z } from 'zod';
    `;
    const hits = findImpureImports('fixture.ts', fixture);
    for (const label of [
      'server-only',
      'next-intl',
      '@/lib/format/date',
      '@/messages',
      'a Node builtin',
      'content/local',
      'design-package',
      'react',
    ]) {
      expect(hits.some((h) => h.includes(label))).toBe(true);
    }
    expect(hits.some((h) => h.includes('zod'))).toBe(false);
    expect(hits).toHaveLength(8);
  });

  it('a clean source has no hits', () => {
    expect(
      findImpureImports('clean.ts', "import { z } from 'zod';\nexport const x = 1;\n"),
    ).toEqual([]);
  });

  it('flags an `export … from` re-export — named, `*`, `type`, and multi-line (N1)', () => {
    const fixture = `
      export { formatMonth } from '@/lib/format/date';
      export * from 'next-intl';
      export type { Foo } from '@/messages/en.json';
      export {
        multiline,
      } from '../../../design-package/strings/calculator.json';
    `;
    const hits = findImpureImports('reexport.ts', fixture);
    for (const label of ['@/lib/format/date', 'next-intl', '@/messages', 'design-package']) {
      expect(hits.some((h) => h.includes(label))).toBe(true);
    }
    expect(hits).toHaveLength(4);
  });

  it('flags a bare `fs`/`path` specifier alongside the already-caught `node:` form (N1)', () => {
    const fixture = `
      import fs from 'fs';
      import { join } from 'path';
      import { readFileSync } from 'node:fs';
    `;
    const hits = findImpureImports('bare-builtins.ts', fixture);
    expect(hits.filter((h) => h.includes('a Node builtin'))).toHaveLength(3);
  });
});

describe('src/lib/calculator/** stays pure (W144(c)/M6)', () => {
  const dir = join(__dirname, '..');
  const files = (readdirSync(dir, { recursive: true }) as string[])
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
    .sort();

  it('scanned the frozen engine files, the COPY_DELTAS data module, and the fixtures module (N1: recursive, __tests__/fixtures.ts included, *.test.ts excluded)', () => {
    expect(files).toEqual(
      [
        'copy-deltas.ts',
        'engine.ts',
        'index.ts',
        'labels.ts',
        'quota.ts',
        'types.ts',
        join('__tests__', 'fixtures.ts'),
      ].sort(),
    );
  });

  it.each(files)('%s imports nothing forbidden', (file) => {
    const source = readFileSync(join(dir, file), 'utf8');
    expect(findImpureImports(file, source)).toEqual([]);
  });
});

// M18/§8 G: copy-deltas.ts is authoring-time data — its `model` column is computed from this
// test suite's own fixtures (RATE, role in __tests__/fixtures.ts), not the live RateConfig a page
// renders with — so a page importing it directly would silently drift from production rates. It
// is deliberately NOT re-exported from index.ts (W143); this guard closes the other door, a
// direct or relative import reaching past the barrel into the file itself.
describe('nothing outside src/lib/calculator/ imports copy-deltas.ts (M18)', () => {
  const SRC = join(__dirname, '..', '..', '..');
  const CALCULATOR = join(SRC, 'lib', 'calculator');

  function tsFilesUnder(d: string): string[] {
    return readdirSync(d).flatMap((name) => {
      const full = join(d, name);
      return statSync(full).isDirectory()
        ? tsFilesUnder(full)
        : /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)
          ? [full]
          : [];
    });
  }

  // The same import-specifier grammar findImpureImports uses (dynamic import(), static import,
  // require(), export…from), reused here in the opposite direction: who reaches IN, not what
  // calculator's own files reach OUT to.
  function specifiersIn(source: string): string[] {
    const out: string[] = [];
    for (const match of source.matchAll(IMPORT_SPECIFIER)) {
      const specifier = match[1] ?? match[2] ?? match[3] ?? match[4];
      if (specifier) out.push(specifier);
    }
    return out;
  }

  const targetsCopyDeltas = (specifier: string) =>
    specifier.replace(/\.ts$/, '').endsWith('calculator/copy-deltas');

  const outsideFiles = tsFilesUnder(SRC).filter((f) => !f.startsWith(CALCULATOR + sep));

  it('scans a real, non-trivial slice of src/ outside the calculator folder', () => {
    expect(outsideFiles.length).toBeGreaterThan(50);
  });

  it('the checker names a copy-deltas specifier by any spelling and clears an unrelated one', () => {
    expect(targetsCopyDeltas('@/lib/calculator/copy-deltas')).toBe(true);
    expect(targetsCopyDeltas('../../lib/calculator/copy-deltas.ts')).toBe(true);
    expect(targetsCopyDeltas('../calculator/copy-deltas')).toBe(true);
    expect(targetsCopyDeltas('@/lib/calculator')).toBe(false);
    expect(targetsCopyDeltas('@/lib/calculator/engine')).toBe(false);
  });

  it('no file outside src/lib/calculator/ imports it', () => {
    const offenders = outsideFiles.flatMap((file) =>
      specifiersIn(readFileSync(file, 'utf8'))
        .filter(targetsCopyDeltas)
        .map((s) => `${relative(SRC, file)} → ${s}`),
    );
    expect(offenders).toEqual([]);
  });
});
