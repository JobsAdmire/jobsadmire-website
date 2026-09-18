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
