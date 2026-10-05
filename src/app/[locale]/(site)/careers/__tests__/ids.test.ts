import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROUTE = join(process.cwd(), 'src/app/[locale]/(site)/careers');

/** Every non-test module of both careers routes. */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}
/** Comments may name an id the page does not render; only code counts. */
const code = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const READ = new Set(
  sources(ROUTE).flatMap((file) => code(readFileSync(file, 'utf8')).match(/\bjt\.\d{3}\b/g) ?? []),
);
const bundleStrings = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `jt.${String(from + i).padStart(3, '0')}`);
/** Never rendered: the chrome copies (R15), the TR-hard-typed count, the duties/wants headings
 *  (the open panel heads its lists with the description's own lead-ins), the literal mailbox
 *  (W102), the category label, the nine fixture roles (D23), the country chips (D17) and the
 *  composed counts. The role toggle (`jt.309`/`310`) and the two Operations links (`jt.047`,
 *  `jt.085`) render since the parity pass (owner, 2026-10-05); the speculative form it added
 *  (`jt.097`/`098`/`101`/`102`/`105`–`110`, `jt.284`/`285`, its WhatsApp message `jt.313`–`321`)
 *  went with W245 — the open application opens the Operations careers page (`jt.047`) and keeps
 *  only "Email CV instead" (`jt.104`); `jt.099`/`100` stay as the roles' engagement words. */
const NEVER = new Set([
  ...range(1, 4),
  ...range(6, 20),
  'jt.025',
  'jt.050',
  'jt.051',
  'jt.114',
  'jt.116',
  ...range(118, 244),
  'jt.287',
  'jt.288',
  ...range(289, 305),
  'jt.307',
  'jt.308',
  'jt.097',
  'jt.098',
  'jt.101',
  'jt.102',
  ...range(105, 110),
  'jt.284',
  'jt.285',
  ...range(313, 321),
]);

describe('the package ids both careers routes read (W9/W23)', () => {
  it('reads 127 ids, every one present in both committed bundles', () => {
    expect(READ.size).toBe(127);
    for (const locale of ['tr', 'en'] as const) {
      const strings = bundleStrings(locale);
      expect(
        [...READ].filter((id) => strings[id] === undefined),
        locale,
      ).toEqual([]);
    }
  });

  it('never reads the fixture roles, the duties/wants headings, the composed counts, the retired form or the chrome copies', () => {
    expect([...READ].filter((id) => NEVER.has(id)).sort()).toEqual([]);
  });
});
