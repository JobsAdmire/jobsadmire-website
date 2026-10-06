/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { getPathname } from '@/i18n/navigation';
import { pathnames, routing } from '@/i18n/routing';
import { isNoindexPathname, type StaticPathname } from '@/lib/seo/routes';
import { GATE_ROUTE_TABLE } from '../../e2e/routes';

/**
 * W21 (Gate A) — the one gap `dead-targets.launch-check.ts` (W152/W158) and
 * `unbuilt-routes.launch-check.ts` (W20) do not close: that `GATE_ROUTE_TABLE` (e2e/routes.ts)
 * itself lists every STATIC `pathnames` route in both locales with the right `indexable` flag.
 * Dead-targets only checks that what IS listed has no dead links; unbuilt-routes only checks
 * every route has a page. Neither proves the table's own coverage is complete, and W21 gives no
 * single task ownership of that check — every page task appends its own two rows and nobody
 * confirms they all did.
 *
 * Dynamic keys are excluded on purpose. `/careers/[slug]` is NEVER a static table row — W93
 * derives its two locale paths at gate time from the live Ops opening
 * (`scripts/gate-routes.mjs`'s `careersDetailRoutes`), so Lighthouse sees it without ever
 * hand-maintaining a slug here (a hard-coded one would 404 the day that opening closes — exactly
 * what `wp2b/check.md`'s `foundation_gaps_to_rule` list rules against). `/blog/[slug]` gets a
 * soft check only: T12 owns the one written article's row (EN — the LOCAL bundle has no Turkish
 * article), so this file requires ONE indexable `/blog/<slug>` row (W248, the SEO flip) that
 * names its one language, never both locales.
 *
 * Runs ONLY under `vitest.launch.config.mts` (never `npm run verify` — the default suite's
 * `scripts/**\/*.test.ts` glob does not match `*.launch-check.ts`). T15 runs last (W99), so by
 * the time this file is written every other page task has already landed its rows; a red case
 * here names exactly which task's row is missing or mis-flagged — see Step 4's stop-and-report
 * rule, T15 does not silently add a row on another task's behalf.
 */
const stripQuery = (p: string) => p.replace(/\?.*$/, '');
const byPath = new Map(GATE_ROUTE_TABLE.map((r) => [stripQuery(r.path), r]));

describe('GATE_ROUTE_TABLE covers every static route in both locales (T15, W21)', () => {
  for (const href of Object.keys(pathnames) as (keyof typeof pathnames)[]) {
    if (href.includes('[')) continue; // dynamic keys: W93 (careers) / soft-checked below (blog)
    for (const locale of routing.locales) {
      // `includes('[')` does not narrow the key type; the cast is the same one
      // dead-targets.launch-check.ts uses (a bare string is valid for static keys only).
      const external = getPathname({ locale, href: href as StaticPathname });
      it(`${locale} ${href} → ${external} is swept, indexable=${!isNoindexPathname(href)}`, () => {
        const row = byPath.get(external);
        expect(row, `${external} missing from e2e/routes.ts`).toBeDefined();
        expect(row?.indexable).toBe(!isNoindexPathname(href));
      });
    }
  }

  it('has at least one indexable /blog/<slug> article row (T12 owns it; W248 the SEO flip)', () => {
    const blogArticles = GATE_ROUTE_TABLE.filter((r) => /^\/(en\/)?blog\/[^/?]+$/.test(r.path));
    expect(blogArticles.length, 'no /blog/<slug> row yet — T12 has not landed').toBeGreaterThan(0);
    for (const r of blogArticles) {
      expect(r.indexable, `${r.path} must be indexable (W248)`).toBe(true);
      expect(r.languages, `${r.path} must name its language(s)`).toBeDefined();
    }
  });

  it('never hand-maintains a careers detail row (W93 derives it live at gate time)', () => {
    const careersDetail = GATE_ROUTE_TABLE.filter((r) =>
      /^\/(en\/)?(kariyer|careers)\/[^/?]+$/.test(r.path),
    );
    expect(
      careersDetail,
      'a static /kariyer/<slug> or /en/careers/<slug> row would go stale the day the opening ' +
        'closes — scripts/gate-routes.mjs appends it live from the Ops door instead (W93)',
    ).toEqual([]);
  });

  it('has no duplicate paths', () => {
    const paths = GATE_ROUTE_TABLE.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
