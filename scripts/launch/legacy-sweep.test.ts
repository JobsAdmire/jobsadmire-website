/** @vitest-environment node */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPathname } from '@/i18n/navigation';
import { pathnames, routing } from '@/i18n/routing';
import type { StaticPathname } from '@/lib/seo/routes';
import legacy from '../../redirects/legacy.json';
import gone from '../../redirects/gone.json';

type Row = { path: string; expect: '308' | '410' | 'keep'; location: string };

export function parseLegacyUrls(text: string): Row[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [path, expectVal, location = ''] = l.split('\t');
      return { path, expect: expectVal as Row['expect'], location };
    });
}

const rows = parseLegacyUrls(readFileSync(join(__dirname, 'legacy-urls.txt'), 'utf8'));
const byFrom = new Map(
  (legacy as { from: string; to: string; status: number }[]).map((r) => [r.from, r]),
);
const GONE = gone as string[];
const isGone = (p: string) =>
  GONE.some((g) => p === g || p.startsWith(g.endsWith('/') ? g : `${g}/`));
const stripHash = (p: string) => p.replace(/#.*$/, '');

// Every external path the new site serves (static routes only; the two dynamic keys need a slug
// and are never a legacy-redirect target).
const LIVE = new Set<string>();
for (const locale of routing.locales) {
  for (const href of Object.keys(pathnames) as (keyof typeof pathnames)[]) {
    if (href.includes('[')) continue;
    LIVE.add(getPathname({ locale, href: href as StaticPathname }));
  }
}

describe('Gate A legacy sweep — the 20 URLs are pinned to the redirect data (T15)', () => {
  it('lists exactly 20 legacy rows and 2 keep controls', () => {
    expect(rows.filter((r) => r.expect !== 'keep')).toHaveLength(20);
    expect(rows.filter((r) => r.expect === 'keep').map((r) => r.path)).toEqual(['/', '/blog']);
    expect(new Set(rows.map((r) => r.path)).size).toBe(rows.length);
  });

  for (const row of rows) {
    if (row.expect === '308') {
      it(`${row.path} → 308 ${row.location}, one hop, onto a live route`, () => {
        const rule = byFrom.get(row.path);
        expect(
          rule,
          `${row.path} is not in redirects/legacy.json — fix legacy-urls.txt`,
        ).toBeDefined();
        expect(rule?.status).toBe(308);
        expect(rule?.to).toBe(row.location);
        const target = stripHash(row.location);
        expect(byFrom.has(target), `${target} is itself redirected — a chain`).toBe(false);
        expect(isGone(target), `${target} lands in a 410 prefix`).toBe(false);
        expect(LIVE.has(target), `${target} is not a pathnames route`).toBe(true);
      });
    } else if (row.expect === '410') {
      it(`${row.path} → 410 (gone prefix)`, () => {
        expect(isGone(row.path)).toBe(true);
        expect(byFrom.has(row.path)).toBe(false);
      });
    } else {
      it(`${row.path} is a live keep route — never redirected, never gone`, () => {
        expect(LIVE.has(row.path)).toBe(true);
        expect(byFrom.has(row.path)).toBe(false);
        expect(isGone(row.path)).toBe(false);
      });
    }
  }
});
