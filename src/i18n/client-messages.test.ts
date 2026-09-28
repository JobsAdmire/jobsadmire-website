import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { CLIENT_SYS, pickClientMessages, SERVER_ONLY_SYS } from './client-messages';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

type SysRead = { prefix: string; line: number };
type Unresolved = { line: number; text: string };

/**
 * W148: every `sys.*` namespace a client module reads. A translator is whatever
 * `useTranslations(…)` returns (`useTranslations('sys')`, `useTranslations('sys.form')`, or no
 * namespace with `sys.`-prefixed keys); its reads are `t(key)`, `t.has(key)`, `t.rich(key, …)`,
 * `t.markup(key, …)`, `t.raw(key)`. A key is resolved statically — a literal, a template's
 * static head (`form.errors.${code}` → `form`), a same-file `const`, either branch of `?:` — and a
 * key whose namespace cannot be read that way is reported, never guessed. Pure over the text.
 */
function sysReads(fileName: string, text: string): { reads: SysRead[]; unresolved: Unresolved[] } {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const lineOf = (node: ts.Node) =>
    source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

  const consts = new Map<string, ts.Expression[]>();
  const translators = new Map<string, string | null>(); // binding → namespace (null = unknown)
  const collect = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      consts.set(node.name.text, [...(consts.get(node.name.text) ?? []), node.initializer]);
      const init = node.initializer;
      if (
        ts.isCallExpression(init) &&
        ts.isIdentifier(init.expression) &&
        init.expression.text === 'useTranslations'
      ) {
        const ns = init.arguments[0];
        translators.set(
          node.name.text,
          ns === undefined ? '' : ts.isStringLiteralLike(ns) ? ns.text : null,
        );
      }
    }
    ts.forEachChild(node, collect);
  };
  collect(source);

  /** The static heads a key expression can take; null when one of them cannot be read. */
  const heads = (expr: ts.Expression, depth = 0): string[] | null => {
    if (depth > 8) return null;
    if (ts.isParenthesizedExpression(expr)) return heads(expr.expression, depth + 1);
    if (ts.isStringLiteralLike(expr)) return [expr.text];
    if (ts.isTemplateExpression(expr)) return [expr.head.text];
    if (ts.isConditionalExpression(expr)) {
      const a = heads(expr.whenTrue, depth + 1);
      const b = heads(expr.whenFalse, depth + 1);
      return a && b ? [...a, ...b] : null;
    }
    if (ts.isIdentifier(expr)) {
      const inits = consts.get(expr.text);
      if (!inits) return null;
      const all = inits.map((i) => heads(i, depth + 1));
      return all.every((h): h is string[] => h !== null) ? all.flat() : null;
    }
    return null;
  };

  /** `sys.*` namespace of one key under a translator namespace, or undefined when the read is
   *  not a `sys` read at all, or null when the key's namespace cannot be determined. */
  const prefixOf = (namespace: string, head: string): string | null | undefined => {
    const full = namespace ? `${namespace}.${head}` : head;
    if (!(full === 'sys' || full.startsWith('sys.'))) return undefined;
    const rest = full.slice('sys.'.length);
    // a complete first segment: `form.errors.` → form; a whole literal key → itself
    if (rest.includes('.')) return rest.split('.')[0] || null;
    return rest && !/\$/.test(rest) ? rest : null;
  };

  const reads: SysRead[] = [];
  const unresolved: Unresolved[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const binding = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee) &&
            ts.isIdentifier(callee.expression) &&
            ['has', 'rich', 'markup', 'raw'].includes(callee.name.text)
          ? callee.expression.text
          : null;
      if (binding !== null && translators.has(binding)) {
        const namespace = translators.get(binding);
        const key = node.arguments[0];
        const keyHeads = namespace === null || !key ? null : heads(key);
        if (keyHeads === null) {
          unresolved.push({ line: lineOf(node), text: node.getText(source) });
        } else {
          for (const head of keyHeads) {
            // A template head is only a prefix: `form.errors.` names `form`, `form` alone does not
            const complete = ts.isStringLiteralLike(key) || head.includes('.');
            const prefix = complete ? prefixOf(namespace ?? '', head) : null;
            if (prefix === undefined) continue;
            if (prefix === null)
              unresolved.push({ line: lineOf(node), text: node.getText(source) });
            else reads.push({ prefix, line: lineOf(node) });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { reads, unresolved };
}

/** A real directive is the file's first statement — not the same words in a comment. */
function isClientModule(fileName: string, text: string): boolean {
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

const CLIENT = CLIENT_SYS as readonly string[];

describe('sysReads — the client-module key scan (W148)', () => {
  const prefixes = (text: string) => sysReads('Fixture.tsx', text).reads.map((r) => r.prefix);

  it('reads literals, template heads, consts and the has/rich variants', () => {
    const text = [
      "'use client';",
      "const sys = useTranslations('sys');",
      "sys('consent.title');",
      'sys(`form.errors.${code}`);',
      'const labelKey = `form.labels.${name}`;',
      'sys.has(labelKey) ? sys(labelKey) : null;',
      "sys.rich('form.consent.label', { link });",
      "sys('errorTitle');",
      "const other = useTranslations('home');",
      "other('thankYou.title');",
    ].join('\n');
    expect(prefixes(text)).toEqual(['consent', 'form', 'form', 'form', 'form', 'errorTitle']);
  });

  it('follows a sys.<ns> translator and an unnamespaced one', () => {
    expect(prefixes("const t = useTranslations('sys.form');\nt('labels.name');")).toEqual(['form']);
    expect(prefixes("const t = useTranslations();\nt('sys.nav.home');\nt('home.001');")).toEqual([
      'nav',
    ]);
  });

  it('reports a key whose namespace it cannot read instead of guessing', () => {
    const { reads, unresolved } = sysReads(
      'Fixture.tsx',
      "const sys = useTranslations('sys');\nsys(key);\nsys(`${ns}.title`);",
    );
    expect(reads).toEqual([]);
    expect(unresolved.map((u) => u.text)).toEqual(['sys(key)', 'sys(`${ns}.title`)']);
  });

  it('RED fixture: a client module reading an unlisted namespace fails the allowlist', () => {
    const { reads } = sysReads(
      'Fixture.tsx',
      "'use client';\nconst sys = useTranslations('sys');\nsys('thankYou.title');",
    );
    const unlisted = reads.filter((r) => !CLIENT.includes(r.prefix)).map((r) => r.prefix);
    expect(unlisted).toEqual(['thankYou']);
  });
});

describe('client messages are an allowlist (W148, inverting W90)', () => {
  const clientModules = modulesUnder(SRC).filter((f) => isClientModule(f, readFileSync(f, 'utf8')));
  const scanned = clientModules.map((file) => ({
    file: relative(ROOT, file),
    ...sysReads(file, readFileSync(file, 'utf8')),
  }));

  it('every sys namespace a client module reads is listed, and every listed one is read', () => {
    expect(clientModules.length).toBeGreaterThan(20);
    expect(
      scanned.flatMap((s) => s.unresolved.map((u) => `${s.file}:${u.line} ${u.text}`)),
    ).toEqual([]);
    const unlisted = scanned.flatMap((s) =>
      s.reads
        .filter((r) => !CLIENT.includes(r.prefix))
        .map((r) => `${s.file}:${r.line} ${r.prefix}`),
    );
    expect(unlisted).toEqual([]);
    // minimal: nothing is shipped that no client module reads
    const read = new Set(scanned.flatMap((s) => s.reads.map((r) => r.prefix)));
    expect([...read].sort()).toEqual([...CLIENT_SYS].sort());
  });

  it('never lists a server-only namespace', () => {
    expect(SERVER_ONLY_SYS).toEqual(['legal', 'seo']);
    for (const ns of SERVER_ONLY_SYS) expect(CLIENT).not.toContain(ns);
  });

  it('picks the listed namespaces and nothing else', () => {
    const fixture = {
      sys: {
        skipToContent: 'Skip to content',
        nav: { main: 'Main menu', home: 'Home' },
        consent: { title: 'Cookies' },
        thankYou: { title: 'Thank you' },
        seo: { home: { title: 'JobsAdmire', description: 'Server-rendered only' } },
        form: { submit: { default: 'Send' } },
      },
    };
    expect(pickClientMessages(fixture)).toEqual({
      sys: { consent: { title: 'Cookies' }, form: { submit: { default: 'Send' } } },
    });
  });

  it('hands the provider exactly the listed namespaces of both real catalogues', () => {
    for (const messages of [tr, en]) {
      for (const ns of CLIENT_SYS) expect(messages.sys).toHaveProperty(ns);
      const client = pickClientMessages(messages);
      expect(Object.keys(client)).toEqual(['sys']);
      expect(Object.keys(client.sys).sort()).toEqual([...CLIENT_SYS].sort());
      for (const ns of ['seo', 'thankYou', 'nav', 'blocks', 'marquee', 'whatsapp']) {
        expect(client.sys).not.toHaveProperty(ns);
      }
    }
  });
});
