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
const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const DESIGN = join(SRC, 'design');
const BLOCKS = join(DESIGN, 'blocks');
const HOOK_MODULE = join(SRC, 'analytics', 'useContactClick');
const NAVIGATION = 'next/navigation';

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

/** Every specifier the file imports or re-exports (static, dynamic, type-only), comment-aware. */
function specifiersOf(file: string): string[] {
  return ts
    .preProcessFile(readFileSync(file, 'utf8'), true, true)
    .importedFiles.map((f) => f.fileName);
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

const modules = modulesUnder(DESIGN);
const serverSide = modules.filter((f) => f.startsWith(BLOCKS + sep) || !isClientModule(f));

describe('RSC import guard (W125)', () => {
  it('walks the blocks and tells a real directive from the words in a comment', () => {
    const contactCta = join(BLOCKS, 'ContactCta.tsx');
    expect(serverSide).toContain(contactCta);
    expect(isClientModule(contactCta)).toBe(false);
    expect(isClientModule(join(DESIGN, 'chrome', 'StickyCtaBar.tsx'))).toBe(true);
    expect(isForbidden(contactCta, '@/analytics/useContactClick')).toBe(true);
    expect(isForbidden(contactCta, '../../analytics/useContactClick')).toBe(true);
    expect(isForbidden(contactCta, '@/analytics/contact-kind')).toBe(false);
  });

  it('no block and no server module under src/design imports useContactClick or next/navigation', () => {
    const offenders = serverSide.flatMap((file) =>
      specifiersOf(file)
        .filter((specifier) => isForbidden(file, specifier))
        .map((specifier) => `${relative(ROOT, file)} → ${specifier}`),
    );
    expect(offenders).toEqual([]);
  });
});
