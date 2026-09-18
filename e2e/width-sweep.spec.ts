import { test, expect } from '@playwright/test';

// D19: the design package's own 1101px `zoom: .75` boundary is the one this repo normalises
// away — 1101 and 1100 sit either side of it, so a layout that still depends on the zoom hack
// shows up here as overflow at exactly one of the two.
for (const width of [1440, 1280, 1101, 1100, 900, 700, 560, 460, 390]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
