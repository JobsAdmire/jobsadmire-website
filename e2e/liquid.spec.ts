import { test, expect } from '@playwright/test';

// W231 (owner): above 1440 px the whole page scales with the screen — the 1440 px layout zoomed
// by viewport ÷ 1440 (3× at most) — so the 1,240 px box fills 86 % of any wider screen, nothing
// overflows and the full-bleed rows still span it. Below 1441 px nothing is zoomed.
test.describe('the liquid desktop (W231)', () => {
  test.skip(({ isMobile }) => isMobile, 'sets its own desktop viewports');

  test('zooms the 1440 px layout to the screen and keeps it inside the viewport', async ({
    page,
  }) => {
    await page.goto('/');
    for (const [width, height] of [
      [1280, 800],
      [1440, 900],
      [1920, 1080],
      [2560, 1440],
      [3372, 1150],
      [5120, 2880],
    ] as const) {
      await page.setViewportSize({ width, height });
      const m = await page.evaluate(() => {
        const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        const box = [...document.querySelectorAll('.container-site')].find(
          (e) => e.getBoundingClientRect().width > 0,
        )!;
        const pad = parseFloat(getComputedStyle(box).paddingLeft) * zoom;
        return {
          zoom,
          content: box.getBoundingClientRect().width - 2 * pad,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          header: document.querySelector('header')!.getBoundingClientRect().width,
        };
      });
      const zoom = Math.min(Math.max(width / 1440, 1), 3);
      expect(m.zoom, `${width}px zoom`).toBeCloseTo(zoom, 2);
      // the 1,240 CSS px box (narrower below 1378 px) at the zoom
      const css = width < 1378 ? width - 66 - 72 : 1240;
      expect(Math.abs(m.content - css * zoom), `${width}px content`).toBeLessThanOrEqual(2);
      expect(m.overflow, `${width}px overflow`).toBeLessThanOrEqual(0);
      expect(Math.round(m.header), `${width}px header row`).toBe(width);
    }
  });

  test('a resize that changes the zoom keeps the reader in place', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('/isci-talebi');
    // the fourth section heading, read in CSS px below the top of the window
    const place = () =>
      page.evaluate(() => {
        const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        const h = document.querySelectorAll('main h2')[3]!;
        return h.getBoundingClientRect().top / zoom;
      });
    await page.evaluate(() => {
      const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const h = document.querySelectorAll('main h2')[3]!;
      window.scrollTo({
        top: scrollY + h.getBoundingClientRect().top - 300 * zoom,
        behavior: 'instant',
      });
    });
    await page.waitForTimeout(250);
    expect(Math.abs((await place()) - 300)).toBeLessThanOrEqual(2);
    // a side panel opening: the zoom drops from 1.78 to 1.56
    await page.setViewportSize({ width: 2240, height: 1440 });
    await page.waitForTimeout(500);
    expect(Math.abs((await place()) - 300)).toBeLessThanOrEqual(5);
  });
});
