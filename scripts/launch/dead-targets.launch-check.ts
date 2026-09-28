/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { getPathname } from '@/i18n/navigation';
import { CTA_BY_PATHNAME } from '@/design/chrome/ctas';
import type { StaticPathname } from '@/lib/seo/routes';
import { bypassWarning } from '../../e2e/helpers/bypass';
import { GATE_ROUTES } from '../../e2e/routes';
import { deadTargets, missingCtaAnchor } from './dead-targets';

/**
 * W152 (§8 E, T3-4) — the launch profile's dead-target sweep, the check Gate A's "every chrome
 * href 200, every CTA anchor rendered" rule (W17) never had (I6): `gate:launch`'s existing
 * `unbuilt-routes.launch-check.ts` only proves `UNBUILT_PATHNAMES` is empty, which says nothing
 * about a *rendered* link actually resolving, or a page-owned anchor id actually existing.
 *
 * Runs ONLY under `vitest.launch.config.mts` (never `npm run verify` — the default suite's
 * `scripts/**\/*.test.ts` glob does not match `*.launch-check.ts`), against a live server at
 * `E2E_BASE_URL`. Expected RED today by design: the review's probe against the WP1 placeholder
 * pages found 12 chrome hrefs 404ing (every unbuilt page's nav/footer link) and two CTA anchors
 * absent (`#proposal` on `/`, `#request-form` on `/isci-talebi`, both pending their page tasks).
 * Must be green by Gate A.
 */
const BASE = (process.env.E2E_BASE_URL ?? '').replace(/\/$/, '');
if (!BASE) {
  throw new Error('dead-targets.launch-check: set E2E_BASE_URL to the server under test');
}

describe('W152 — dead-target sweep (launch profile)', () => {
  const warning = bypassWarning(BASE);
  if (warning) console.warn(`dead-targets: warning — ${warning}`);

  it('every internal href on every gate route answers 200', async () => {
    const dead = await deadTargets(BASE, GATE_ROUTES);
    if (dead.length)
      console.error(`dead-targets: ${dead.length} dead target(s):\n${dead.join('\n')}`);
    expect(dead, `dead target(s):\n${dead.join('\n')}`).toEqual([]);
  }, 180_000);

  it('every CTA_BY_PATHNAME anchor id exists on its page, both locales', async () => {
    const missing: string[] = [];
    for (const [key, ctas] of Object.entries(CTA_BY_PATHNAME)) {
      const href = ctas.primary.href;
      const hash = typeof href === 'object' && href !== null && 'hash' in href ? href.hash : null;
      if (!hash) continue; // W17: every entry in this table is an in-page anchor today, but a
      // future one without a hash (a plain page navigation) has nothing here to check.
      const id = hash.replace(/^#/, '');
      // W121/ctas.ts's own comment: CTA_BY_PATHNAME never keys a dynamic pathname, so every key
      // here is safely a StaticPathname (the bare-string form getPathname accepts).
      for (const locale of ['tr', 'en'] as const) {
        const path = getPathname({ locale, href: key as StaticPathname });
        const line = await missingCtaAnchor(BASE, locale, path, id);
        if (line) missing.push(`${key}: ${line}`);
      }
    }
    if (missing.length)
      console.error(`dead-targets: ${missing.length} missing anchor(s):\n${missing.join('\n')}`);
    expect(missing, `missing CTA anchor(s):\n${missing.join('\n')}`).toEqual([]);
  }, 60_000);
});
