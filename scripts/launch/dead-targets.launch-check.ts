/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { getPathname } from '@/i18n/navigation';
import { CTA_BY_PATHNAME, DEFAULT_CTAS } from '@/design/chrome/ctas';
import type { StaticPathname } from '@/lib/seo/routes';
import { bypassWarning } from '../../e2e/helpers/bypass';
import { GATE_ROUTES } from '../../e2e/routes';
import { ctaAnchorTargets, deadTargets, missingCtaAnchors } from './dead-targets';

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
 *
 * W158 (final re-review N1): the anchor half walks `DEFAULT_CTAS` as well as `CTA_BY_PATHNAME`,
 * primary and secondary, and checks each anchor on the page its link points at (the link's own
 * `pathname`, localized through the routing table) — `DEFAULT_CTAS.primary`'s `#request-form` is
 * the header CTA of every page without a table entry, and round 2's key-only loop never saw it.
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

  it('every CTA anchor (DEFAULT_CTAS and CTA_BY_PATHNAME, primary and secondary) exists on the page its link points at, both locales (W158)', async () => {
    const targets = ctaAnchorTargets({ defaults: DEFAULT_CTAS, byPathname: CTA_BY_PATHNAME });
    // Non-vacuous: the default CTA's anchor is in the set (N1 — the one round 2 never checked).
    expect(targets).toContainEqual({
      source: 'DEFAULT_CTAS.primary',
      pathname: '/hire-workers',
      id: 'request-form',
    });
    // Every CTA link targets a static pathname today (W121 keeps dynamic keys out of the table,
    // and no CTA links into a dynamic route), so the bare-string form getPathname accepts is safe;
    // a future link to a `[slug]` page would localize to its literal pattern, 404, and be listed.
    const localize = (locale: 'tr' | 'en', pathname: string) =>
      getPathname({ locale, href: pathname as StaticPathname });
    const missing = await missingCtaAnchors(BASE, targets, localize);
    if (missing.length)
      console.error(`dead-targets: ${missing.length} missing anchor(s):\n${missing.join('\n')}`);
    expect(missing, `missing CTA anchor(s):\n${missing.join('\n')}`).toEqual([]);
  }, 60_000);
});
