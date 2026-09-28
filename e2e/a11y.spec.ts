import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { GATE_ROUTES } from './routes';

// D20: an axe violation is fixed in the component, never by narrowing the sweep. Runs under
// both Playwright projects — the hamburger, the mobile bottom bar and the footer accordions
// only exist at the mobile viewport, so a desktop-only sweep would never see them.
for (const route of GATE_ROUTES) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        null,
        1,
      ),
    ).toEqual([]);
  });
}

// N8 (final re-review): axe's `region` rule — all content inside a landmark — is `best-practice`,
// outside the tag set above, so it runs on its own here, at the three widths where different
// fixed chrome shows: the mobile bottom bar (≤900), the WhatsApp FAB (901–1100 — a range neither
// project's viewport hits) and the social rail (≥1101). The widths are explicit, so one project
// runs it. The rest of `best-practice` joins in a later round (§8 F).
const REGION_WIDTHS = [390, 1000, 1440] as const;
for (const route of GATE_ROUTES) {
  test(`axe region (best-practice) at ${REGION_WIDTHS.join('/')}: ${route}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'explicit widths — one project is enough');
    for (const width of REGION_WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withRules(['region']).analyze();
      expect(
        results.violations.flatMap((v) => v.nodes.map((n) => n.target.join(' '))),
        `${width}px`,
      ).toEqual([]);
    }
  });
}
