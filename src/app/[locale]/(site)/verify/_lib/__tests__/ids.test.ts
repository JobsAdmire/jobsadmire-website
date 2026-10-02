import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { localBundle } from './bundles';

const ROUTE = join(process.cwd(), 'src', 'app', '[locale]', '(site)', 'verify');

/** Every non-test module of the route. */
function sources(dir = ROUTE): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/** The package ids the route reads by exact id: every quoted `verify.NNN` literal. */
const READ = new Set(
  sources().flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/['"`](verify\.\d{3})['"`]/g)].map((m) => m[1]),
  ),
);

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);
const id = (n: number) => `verify.${String(n).padStart(3, '0')}`;

/** Never read here: the red verdict, its echo fragments and "Report this person" (W6); the
 *  mustache-token strings (`{{ queryEcho }}`, `{{ lastUpdatedLabel }}`); "Print badge" (V-6); the
 *  mobile red-flag fold (V-3); the CRM feed badges (the empty state replaces them); the staff-data
 *  sample rows (verify.148–197, 240, 242–258 — people, never copy). */
const NEVER = new Set(
  [48, 49, 50, 52, 119, 120, 219, 220, 221, 222, 230, 231, 235, 236, 266, 240]
    .concat(range(148, 197), range(242, 258))
    .map(id),
);

describe('the package ids this route reads (W9/R15)', () => {
  it('every id it reads exists in both committed bundles', () => {
    expect(READ.size).toBeGreaterThan(90);
    for (const locale of ['tr', 'en'] as const) {
      const strings = localBundle(locale).strings;
      expect(
        [...READ].filter((x) => strings[x] === undefined),
        locale,
      ).toEqual([]);
    }
  });

  it('never reads the red verdict, the mustache strings, print, the fold, the feed badges or the staff data', () => {
    expect([...READ].filter((x) => NEVER.has(x))).toEqual([]);
  });
});
