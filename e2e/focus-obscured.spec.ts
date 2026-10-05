import { expect, test, type Page } from '@playwright/test';

// W232 (WCAG 2.2 SC 2.4.11 Focus Not Obscured, AA). The header sticks at the top — 71 CSS px on
// one row, 107–157 px where its desktop nav wraps (901 to ≈ 1165 px by page and locale) — and on
// the work-permit page the jump nav sticks under it from 1101 px. The browser does not scroll to a
// newly focused control it counts as in view, and a control under the header is in view to it, so
// tabbing (backwards above all) could leave focus hidden there; the focus guard
// (src/design/chrome/sticky-header.ts) scrolls it clear. Sticky columns stick below that chrome at
// its real height (`--header-h`, published by the page; `--sticky-top`). Reduced motion turns the
// root's smooth scrolling off (globals.css), so the browser's own focus scroll is instant and each
// stop is measured at once; the guard scrolls instantly either way.
const PAGES = [
  '/isci-talebi',
  '/en/blog/turkey-work-permit-process-employer-guide',
  '/en/work-permit', // the jump nav: top chrome from 1101 px
] as const;
const VIEWPORTS = [
  [1000, 800], // 901–1100: the nav on two rows
  [1110, 800], // from 1101: two rows in Turkish too
  [1150, 800], // two rows in English
  [1440, 900], // one row
  [1920, 1080], // the liquid desktop: rects in zoomed px, `top` in CSS px
] as const;
const STOPS = 20; // each way from mid-page: 40 focus stops per page and width

/** In the page: the bottom of the top chrome covering the window — the header and a sticky
 *  sub-navigation, while each is stuck at its own `top` (a bar still in the flow covers nothing).
 *  Self-contained: Playwright serialises it into the page. */
const chromeBottom = () => {
  const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
  const stuck = [...document.querySelectorAll('header, [data-sticky-subnav]')].filter((bar) => {
    const style = getComputedStyle(bar);
    return (
      /^(sticky|fixed)$/.test(style.position) &&
      bar.getBoundingClientRect().top <= Number.parseFloat(style.top) * zoom + 1
    );
  });
  return stuck.length ? Math.max(...stuck.map((bar) => bar.getBoundingClientRect().bottom)) : 0;
};

async function settle(page: Page) {
  await page.evaluate(
    () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))),
  );
}

/** The page has published the header's height for this width (the guard is mounted with it). */
async function headerPublished(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const header = document.querySelector('header');
        const value = document.documentElement.style.getPropertyValue('--header-h');
        return header !== null && value === `${header.offsetHeight}px`;
      }),
    )
    .toBe(true);
}

/** Scrolls to mid-page and focuses, without scrolling, the first control there below the chrome. */
async function startMidPage(page: Page) {
  await page.evaluate(() => {
    const root = document.documentElement;
    window.scrollTo({ top: (root.scrollHeight - innerHeight) / 2, behavior: 'instant' });
  });
  await settle(page);
  const chrome = await page.evaluate(chromeBottom);
  await page.evaluate((below) => {
    const inFixedLayer = (el: Element) => {
      for (let n: Element | null = el; n; n = n.parentElement)
        if (getComputedStyle(n).position === 'fixed') return true;
      return false;
    };
    const start = [
      ...document.querySelectorAll<HTMLElement>(
        'main a[href], main button, main input, main select, main textarea, main [tabindex="0"]',
      ),
    ].find((el) => {
      const r = el.getBoundingClientRect();
      return r.height > 0 && r.top >= below + 1 && r.bottom <= innerHeight && !inFixedLayer(el);
    });
    start?.focus({ preventScroll: true });
  }, chrome);
}

/** The focused control's rect against the chrome; `exempt` for the chrome's own controls and for
 *  a fixed layer floating over it (the sticky CTA bar, a dialog). */
async function readFocus(page: Page) {
  const bottom = await page.evaluate(chromeBottom);
  return page.evaluate((chrome) => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    let fixed = false;
    for (let n: Element | null = el; n; n = n.parentElement)
      if (getComputedStyle(n).position === 'fixed') fixed = true;
    const bars = [...document.querySelectorAll('header, [data-sticky-subnav]')];
    const r = el.getBoundingClientRect();
    const name = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40);
    return {
      what: `${el.tagName.toLowerCase()} "${name}"`,
      top: Math.round(r.top),
      bottom: r.bottom,
      chrome,
      exempt: fixed || bars.some((bar) => bar.contains(el)),
    };
  }, bottom);
}

/** Every sticky element in `main`, scrolled to halfway through its travel: its stuck top, its own
 *  `top` (zoomed) and the bottom of the chrome above it. */
async function stuckColumns(page: Page) {
  const count = await page.evaluate(
    () =>
      [...document.querySelectorAll('main *')].filter(
        (el) => getComputedStyle(el).position === 'sticky',
      ).length,
  );
  const out = [];
  for (let i = 0; i < count; i++) {
    const scrolled = await page.evaluate((index) => {
      const el = [...document.querySelectorAll<HTMLElement>('main *')].filter(
        (e) => getComputedStyle(e).position === 'sticky',
      )[index]!;
      const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const top = Number.parseFloat(getComputedStyle(el).top) * zoom;
      const parent = el.parentElement!.getBoundingClientRect();
      const own = el.getBoundingClientRect();
      const travel = parent.height - own.height;
      if (own.height === 0 || travel < 2) return false; // no room to stick
      // the parent's top where the element has stuck for half its travel
      window.scrollTo({ top: scrollY + parent.top - (top - travel / 2), behavior: 'instant' });
      return true;
    }, i);
    if (!scrolled) continue;
    await settle(page);
    const bottom = await page.evaluate(chromeBottom);
    out.push(
      await page.evaluate(
        ({ index, chrome }) => {
          const el = [...document.querySelectorAll<HTMLElement>('main *')].filter(
            (e) => getComputedStyle(e).position === 'sticky',
          )[index]!;
          const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
          // a sticky sub-navigation is measured against the header alone
          const header = document.querySelector('header')!.getBoundingClientRect().bottom;
          return {
            what: el.dataset.testid ?? `${el.tagName.toLowerCase()}.${el.className.slice(0, 50)}`,
            top: el.getBoundingClientRect().top,
            ownTop: Number.parseFloat(getComputedStyle(el).top) * zoom,
            chrome: el.matches('[data-sticky-subnav]') ? header : chrome,
          };
        },
        { index: i, chrome: bottom },
      ),
    );
  }
  return out;
}

test.describe('keyboard focus and sticky columns stay clear of the sticky header (W232)', () => {
  test.skip(({ isMobile }) => isMobile, 'sets its own desktop viewports');
  test.use({ reducedMotion: 'reduce' });

  for (const path of PAGES) {
    test(`${path}: no focused control under the top chrome; sticky columns stick below it`, async ({
      page,
    }) => {
      test.setTimeout(180_000);
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      for (const [width, height] of VIEWPORTS) {
        await page.setViewportSize({ width, height });
        await settle(page);
        await headerPublished(page);
        for (const [key, way] of [
          ['Shift+Tab', 'backwards'],
          ['Tab', 'forwards'],
        ] as const) {
          await startMidPage(page);
          for (let stop = 1; stop <= STOPS; stop++) {
            await page.keyboard.press(key);
            await settle(page);
            const focus = await readFocus(page);
            if (!focus || focus.exempt) continue;
            expect
              .soft(
                focus.bottom,
                `${width}×${height} ${way} #${stop}: ${focus.what} (top ${focus.top}) is under the chrome ending at ${focus.chrome}`,
              )
              .toBeGreaterThan(focus.chrome);
          }
        }
        const columns = await stuckColumns(page);
        expect(columns.length, `${width}×${height}: a sticky column to measure`).toBeGreaterThan(0);
        for (const column of columns) {
          const label = `${width}×${height} ${column.what}`;
          expect.soft(Math.abs(column.top - column.ownTop), `${label} is stuck`).toBeLessThan(1.5);
          expect
            .soft(column.top, `${label} sticks below the chrome ending at ${column.chrome}`)
            .toBeGreaterThanOrEqual(column.chrome - 0.5);
        }
      }
    });
  }
});
