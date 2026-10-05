import { expect, type Locator } from '@playwright/test';

/**
 * W233: a hero slot that carries its licensed stock photo (`public/hero/<file>`). One decorative
 * `<img>` (alt "", inside the hero's aria-hidden wrapper) served through next/image, actually
 * decoded — a wrong path or a broken file leaves `naturalWidth` at 0 — preloaded from the
 * `<head>` (`ImageSlot`'s `lcp`/`priority` → next/image `preload`), and reaching the bottom of its
 * hero: a box that ends inside the hero draws a hard edge across it (QA W220 contact-01; the
 * Calculator, Blog and Success Stories ratio boxes did until W233 put them in cover mode). Whether
 * the image or the h1 is the page's one `data-lcp-slot` is the caller's assertion.
 */
export async function expectHeroPhoto(img: Locator, path: string) {
  const encoded = encodeURIComponent(path);
  await expect(img).toHaveCount(1);
  await expect(img).toHaveAttribute('alt', '');
  expect(await img.getAttribute('src')).toContain(encoded);
  expect(await img.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
  await expect
    .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
    .toBe(true);
  await expect(
    img.page().locator(`head link[rel="preload"][as="image"][imagesrcset*="${encoded}"]`),
  ).toHaveCount(1);
  const shortBy = await img.evaluate((el) => {
    const hero = el.closest('section, [data-testid="calc-top"]');
    return hero ? hero.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom : NaN;
  });
  expect(shortBy, `the ${path} box ends ${shortBy} px above its hero's bottom`).toBeLessThanOrEqual(
    1,
  );
}
