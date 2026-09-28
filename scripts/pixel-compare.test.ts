/** @vitest-environment node */
import { PNG } from 'pngjs';
import { describe, expect, it, vi } from 'vitest';
import {
  builtOriginRoute,
  captureContextOptions,
  checkZoomedHeight,
  comparePngs,
  designClip,
  gotoOk,
  PIXEL_PAGES,
  PIXEL_WIDTHS,
  PixelExit,
  pixelTarget,
  resolvePixelRoute,
} from './pixel-compare';

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

  it('pads the narrower capture to the wider one before diffing', () => {
    const r = comparePngs(png(4, 4), png(6, 4));
    expect(r.width).toBe(6);
    expect(r.height).toBe(4);
    expect(r.diffPixels).toBe(0);
    // Content in the padded strip is a difference like any other.
    expect(comparePngs(png(4, 4), png(6, 4, [[5, 0]])).diffPixels).toBe(1);
  });
});

// W138: like for like, and never a score for a broken page.
describe('pixel harness scoring rules (W138)', () => {
  it('clips the design capture to the zoomed content box', () => {
    // 1440 under the design's `html { zoom: 0.75 }`: Playwright's full-page canvas is measured in
    // unzoomed px (1920 × 7830) while the content paints in 1440 × 5873.
    expect(designClip(1440, 7830, 0.75)).toEqual({ x: 0, y: 0, width: 1440, height: 5873 });
    // Below 1101 px there is no zoom: the clip is the full page at the viewport width.
    expect(designClip(390, 9988, 1)).toEqual({ x: 0, y: 0, width: 390, height: 9988 });
  });

  it('accepts pageHeight×zoom when an independent rect measurement agrees, within 2px (N2)', () => {
    expect(() => checkZoomedHeight(7830, 0.75, 5873)).not.toThrow(); // exact: ⌈7830×0.75⌉ = 5873
    expect(() => checkZoomedHeight(7830, 0.75, 5874.4)).not.toThrow(); // 1.4px of rounding slack
    expect(() => checkZoomedHeight(9988, 1, 9988)).not.toThrow();
  });

  it('refuses a pageHeight×zoom the rendered rect disagrees with by more than 2px — exit 2 (N2)', () => {
    // A stale/failed zoom read: the clip would be built for 5873 while the page actually painted
    // at the unzoomed 7830 — a silently wrong capture, not a caught one, before this guard.
    const err = (() => {
      try {
        checkZoomedHeight(7830, 0.75, 7830);
        return null;
      } catch (e) {
        return e;
      }
    })();
    expect(err).toBeInstanceOf(PixelExit);
    expect((err as PixelExit).code).toBe(2);
    expect((err as PixelExit).message).toContain('N2');
  });

  it('refuses a page that does not answer 2xx — exit 2, naming the URL', async () => {
    const opts = { waitUntil: 'networkidle' as const, timeout: 1_000 };
    const notFound = { goto: vi.fn(async () => ({ ok: () => false, status: () => 404 })) };
    const url = 'http://localhost:3000/maliyet-hesaplayici';
    const err = await gotoOk(notFound, url, opts).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(PixelExit);
    expect((err as PixelExit).code).toBe(2);
    expect((err as PixelExit).message).toContain(url);
    expect((err as PixelExit).message).toContain('HTTP 404');
    expect(notFound.goto).toHaveBeenCalledWith(url, opts);
    const noResponse = { goto: vi.fn(async () => null) };
    await expect(gotoOk(noResponse, url, opts)).rejects.toBeInstanceOf(PixelExit);
    const ok = { goto: vi.fn(async () => ({ ok: () => true, status: () => 200 })) };
    await expect(gotoOk(ok, url, opts)).resolves.toBeUndefined();
  });

  it('skips, unscored, a blog article with no body in the locale and an unbuilt page', () => {
    const unbuilt = new Set(['/hiring-cost-calculator', '/blog/[slug]']);
    expect(pixelTarget('blog-article', 'tr', bundle, null, unbuilt)).toEqual({
      skip: expect.stringContaining('no blog body in tr'),
    });
    expect(pixelTarget('calc', 'tr', null, null, unbuilt)).toEqual({
      skip: expect.stringContaining('/hiring-cost-calculator'),
    });
    // A written body whose page is not built yet is skipped too (T12 ships both).
    expect(pixelTarget('blog-article', 'en', bundle, null, unbuilt)).toEqual({
      skip: expect.stringContaining('/blog/[slug]'),
    });
    expect(pixelTarget('blog-article', 'en', bundle, null, new Set())).toEqual({
      route: '/en/blog/work-permit-guide',
    });
    expect(pixelTarget('hire', 'tr', null, null, unbuilt)).toEqual({ route: '/isci-talebi' });
    // --route overrides both rules; the 2xx check still guards the capture.
    expect(pixelTarget('calc', 'en', null, '/en', unbuilt)).toEqual({ route: '/en' });
  });
});

// W137: the bypass header reaches the built origin's requests only. The design page's context
// carries no extra header (an empty one broke its web fonts and map data through CORS
// preflights), and nothing is intercepted at all when the secret is blank.
describe('pixel harness bypass-header scoping (W137)', () => {
  it('the capture context carries no extra header, even with the secret exported', () => {
    vi.stubEnv('VERCEL_AUTOMATION_BYPASS_SECRET', 'set-in-this-shell');
    try {
      const opts = captureContextOptions(390, 'tr');
      expect(opts).not.toHaveProperty('extraHTTPHeaders');
      expect(opts).toEqual({
        viewport: { width: 390, height: 900 },
        deviceScaleFactor: 1,
        locale: 'tr-TR',
        reducedMotion: 'reduce',
      });
      expect(captureContextOptions(1440, 'en').locale).toBe('en-US');
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('intercepts nothing when the secret is blank', () => {
    expect(builtOriginRoute('http://localhost:3000', {})).toBeNull();
  });

  it("adds the header on the built origin's requests, keeping each request's own headers", async () => {
    const route = builtOriginRoute('https://x-git-wp2.vercel.app/en/hire-workers', {
      'x-vercel-protection-bypass': 's3cret',
    });
    expect(route?.url).toBe('https://x-git-wp2.vercel.app/**');
    const cont = vi.fn(async (options: { headers: Record<string, string> }) => {
      void options;
    });
    await route?.handler({
      request: () => ({ headers: () => ({ accept: 'text/html' }) }),
      continue: cont,
    });
    expect(cont).toHaveBeenCalledWith({
      headers: { accept: 'text/html', 'x-vercel-protection-bypass': 's3cret' },
    });
  });
});
