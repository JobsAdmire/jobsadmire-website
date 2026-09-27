/** @vitest-environment node */
import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { comparePngs, PIXEL_PAGES, PIXEL_WIDTHS, resolvePixelRoute } from './pixel-compare';

const png = (width: number, height: number, black: Array<[number, number]> = []) => {
  const p = new PNG({ width, height });
  p.data.fill(255);
  for (const [x, y] of black) {
    const i = (y * width + x) * 4;
    p.data[i] = 0;
    p.data[i + 1] = 0;
    p.data[i + 2] = 0;
  }
  return p;
};

// Task 1's blog rows (W33): slugs are nullable per locale, hasBody says which locale has a body.
const bundle = {
  collections: {
    blog: [
      { slug: { tr: null, en: 'unwritten' }, hasBody: { tr: false, en: false } },
      {
        slug: { tr: 'calisma-izni-rehberi', en: 'work-permit-guide' },
        hasBody: { tr: false, en: true },
      },
    ],
  },
};

describe('pixel harness (D27)', () => {
  it('nominates the four pages at the three widths', () => {
    expect(Object.keys(PIXEL_PAGES).sort()).toEqual(['blog-article', 'calc', 'hire', 'home']);
    expect(PIXEL_WIDTHS).toEqual([390, 900, 1440]);
    for (const p of Object.values(PIXEL_PAGES)) expect(p.design.endsWith('.dc.html')).toBe(true);
  });

  it('resolves the built route per locale', () => {
    expect(resolvePixelRoute('home', 'tr', null)).toBe('/');
    expect(resolvePixelRoute('home', 'en', null)).toBe('/en');
    expect(resolvePixelRoute('hire', 'tr', null)).toBe('/isci-talebi');
    expect(resolvePixelRoute('calc', 'en', null)).toBe('/en/hiring-cost-calculator');
  });

  it('resolves the blog article from the first written body of that locale', () => {
    expect(resolvePixelRoute('blog-article', 'en', bundle)).toBe('/en/blog/work-permit-guide');
    expect(() => resolvePixelRoute('blog-article', 'tr', bundle)).toThrow(/no blog body in tr/);
    expect(() => resolvePixelRoute('blog-article', 'tr', null)).toThrow(/no blog body in tr/);
  });

  it('lets --route override every resolution', () => {
    expect(resolvePixelRoute('blog-article', 'tr', null, '/blog/x')).toBe('/blog/x');
    expect(resolvePixelRoute('home', 'tr', null, '/en')).toBe('/en');
  });

  it('scores identical images at 100 and one pixel of sixteen at 93.75', () => {
    expect(comparePngs(png(4, 4), png(4, 4)).match).toBe(100);
    const r = comparePngs(png(4, 4), png(4, 4, [[1, 1]]));
    expect(r.diffPixels).toBe(1);
    expect(r.match).toBe(93.75);
    expect(r.diff.width).toBe(4);
  });

  it('pads the shorter capture to the taller one before diffing', () => {
    const r = comparePngs(png(4, 4), png(4, 6));
    expect(r.width).toBe(4);
    expect(r.height).toBe(6);
    // 8 padded (white) pixels against 8 white pixels — identical after padding.
    expect(r.diffPixels).toBe(0);
    expect(r.match).toBe(100);
  });
});
