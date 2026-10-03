import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pathnames } from '@/i18n/routing';
import { UNBUILT_PATHNAMES } from './routes';

const APP_LOCALE_DIR = join(process.cwd(), 'src/app/[locale]');

/** Internal pathnames that have a `page.tsx` under `src/app/[locale]/`, with route-group
 *  segments (`(site)`, `(minimal)`, `(bare)`, W19) stripped — the app directory is keyed by
 *  the internal pathname; next-intl rewrites the external slug onto it. */
function builtKeys(dir = APP_LOCALE_DIR, prefix = ''): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) {
      if (name === 'page.tsx') out.push(prefix || '/');
      continue;
    }
    if (name.startsWith('_') || name.startsWith('@')) continue;
    const isGroup = name.startsWith('(') && name.endsWith(')');
    out.push(...builtKeys(full, isGroup ? prefix : `${prefix}/${name}`));
  }
  return out;
}

describe('UNBUILT_PATHNAMES (W20)', () => {
  it('is exactly the set of pathnames keys with no page.tsx yet — delete your key when your page lands', () => {
    const built = new Set(builtKeys());
    const expected = (Object.keys(pathnames) as (keyof typeof pathnames)[])
      .filter((key) => !built.has(key))
      .sort();
    expect([...UNBUILT_PATHNAMES].sort()).toEqual(expected);
  });

  it('only ever names pathnames keys', () => {
    for (const key of UNBUILT_PATHNAMES) expect(key in pathnames).toBe(true);
  });
});
