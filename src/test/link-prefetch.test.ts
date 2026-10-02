import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * W186/W195: every cross-route <Link> a PAGE renders passes an explicit `prefetch` prop
 * (`prefetch={false}` keeps hover prefetch and stops the viewport prefetch that pulled other
 * routes' JavaScript into a page's measured transfer — 6.4 KB on /hakkimizda, 8.2 KB on the
 * legal pages). The chrome and the blocks already pass it; the dev gallery is exempt.
 */
const ROOT = join(process.cwd(), 'src', 'app', '[locale]');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory())
      return name === 'gallery' || name === '__tests__' ? [] : walk(full);
    return name.endsWith('.tsx') ? [full] : [];
  });
}

describe('page <Link>s carry an explicit prefetch prop (W186/W195)', () => {
  it('finds no <Link> without `prefetch` under src/app/[locale] outside the dev gallery', () => {
    const offenders: string[] = [];
    for (const file of walk(ROOT)) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/<Link\b([^>]*?)>/gs)) {
        if (!/\bprefetch\s*=/.test(match[1])) {
          const line = source.slice(0, match.index).split('\n').length;
          offenders.push(`${relative(process.cwd(), file)}:${line}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
