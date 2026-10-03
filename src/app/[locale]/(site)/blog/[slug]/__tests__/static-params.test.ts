import { describe, expect, it, vi } from 'vitest';
import { routing } from '@/i18n/routing';

// generateStaticParams reads the committed LOCAL bundle through the real adapter; the rest of
// the page module only needs to import (the verify page test's mocks — no request scope, no
// client chunk).
vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => (key: string) => key,
}));
vi.mock('next/dynamic', () => ({ default: () => () => null }));

import { generateStaticParams } from '../page';

/** Next 16.3.5's expansion (`next/dist/build/static-paths/app.js`): the page's function runs once
 *  per parent `[locale]`, each item is merged over the parent, and an EMPTY result passes the
 *  parent through without a `slug` — after which `hadAllParamsGenerated` is false and NO path of
 *  the route is prerendered (the T12 proof build: the EN article was missing from the manifest). */
async function expand(): Promise<Record<string, string>[]> {
  const out: Record<string, string>[] = [];
  for (const locale of routing.locales) {
    const parent = { locale };
    const items = await generateStaticParams();
    if (items.length === 0) out.push(parent);
    else for (const item of items) out.push({ ...parent, ...item });
  }
  return out;
}

describe('generateStaticParams (B-1) — bottom up, so a locale without articles never blocks the prerender', () => {
  it('returns complete { locale, slug } pairs for the written articles of every locale', async () => {
    expect(await generateStaticParams()).toEqual([
      { locale: 'en', slug: 'turkey-work-permit-process-employer-guide' },
    ]);
  });

  it('every combination Next expands carries a slug — the one EN article is prerendered', async () => {
    const combos = await expand();
    expect(combos.every((c) => typeof c.slug === 'string')).toBe(true);
    expect(new Set(combos.map((c) => `${c.locale}/${c.slug}`))).toEqual(
      new Set(['en/turkey-work-permit-process-employer-guide']),
    );
  });
});
