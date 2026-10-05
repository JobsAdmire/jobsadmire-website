import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { keepScrollAcrossZoom, LIQUID_BASE_PX, liquidSizes, rootZoom } from '../zoom';

// W231 (owner): above 1440 px the root is zoomed by viewport ÷ 1440 (exact where typed `calc()`
// division exists, in steps elsewhere), so every wider screen shows the 1440 px layout filling
// it. jsdom cannot evaluate a media query or a zoom, so this reads the stylesheet's own rules.
const CSS = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

const STEP =
  /@media screen and \(min-width: (\d+)px\) \{\s*:root \{\s*zoom: ([\d.]+);\s*--zoom: ([\d.]+);\s*\}\s*\}/g;
// the steps' own block, behind the standard-zoom stand-in
const STEPS_BLOCK = /@supports \(math-depth: auto-add\) \{([\s\S]*?)\n\}/.exec(CSS)?.[1] ?? '';
const steps = [...STEPS_BLOCK.matchAll(STEP)].map(([, min, zoom, varZoom]) => ({
  min: Number(min),
  zoom: Number(zoom),
  varZoom: Number(varZoom),
}));

describe('the liquid desktop (W231)', () => {
  it('declares --zoom: 1 on :root for every width up to the base', () => {
    expect(CSS).toMatch(/:root \{[^}]*--zoom: 1;/);
    expect(LIQUID_BASE_PX).toBe(1440);
  });

  it('zooms exactly by viewport ÷ 1440 where typed calc() exists, capped at 3×, from 1441 px', () => {
    const block =
      /@supports \(math-depth: auto-add\) and \(zoom: calc\(100vw \/ 1440px\)\) \{([\s\S]*?)\n\}/.exec(
        CSS,
      )?.[1];
    expect(block).toBeDefined();
    expect(block).toMatch(/@media screen and \(min-width: 1441px\)/);
    expect(block).toMatch(/zoom: min\(calc\(100vw \/ 1440px\), 3\);/);
    expect(block).toMatch(/--zoom: min\(calc\(100vw \/ 1440px\), 3\);/);
    // the exact rule comes after every step, so it wins wherever it applies
    expect(
      CSS.indexOf('@supports (math-depth: auto-add) and (zoom: calc(100vw / 1440px))'),
    ).toBeGreaterThan(CSS.indexOf('@media screen and (min-width: 4320px)'));
  });

  it('zooms only where the standard zoom model is (Safari 18.2–26.3 keeps the unzoomed page)', () => {
    // every zoom declaration sits inside a block gated on the stand-in
    const outside = CSS.replace(/@supports \(math-depth: auto-add\)[^{]*\{[\s\S]*?\n\}/g, '');
    expect(outside).not.toMatch(/(^|[^-\w])zoom\s*:/m); // `--zoom: 1` aside
  });

  it('falls back to steps that start where the screen is the base × the step, up to 3× at 4320 px', () => {
    expect(steps.length).toBeGreaterThanOrEqual(10);
    for (const [i, s] of steps.entries()) {
      expect(s.varZoom, `step ${s.min}px`).toBe(s.zoom);
      expect(s.min, `step ${s.zoom}`).toBe(Math.round(LIQUID_BASE_PX * s.zoom));
      if (i > 0) expect(s.zoom).toBeGreaterThan(steps[i - 1]!.zoom);
    }
    expect(steps[0]!.zoom).toBeLessThanOrEqual(1.1);
    expect(steps.at(-1)).toEqual({ min: 4320, zoom: 3, varZoom: 3 });
  });
});

describe('rootZoom and liquidSizes (W231)', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('zoom');
  });

  it('reads the root zoom, 1 where none is set', () => {
    expect(rootZoom()).toBe(1);
    document.documentElement.style.setProperty('zoom', '1.75');
    expect(rootZoom()).toBe(1.75);
  });

  it('gives a fixed-width image its share of the screen past the base', () => {
    expect(liquidSizes(104)).toBe('(min-width: 1441px) 7.22vw, 104px');
    expect(liquidSizes(130, '173px')).toBe('(min-width: 1441px) 9.03vw, 173px');
  });
});

// Chrome keeps `scrollY` (zoomed px) across a window resize, so a resize that changes the zoom
// would move the reader; the keeper restores the place in CSS px (W231).
describe('keepScrollAcrossZoom (W231)', () => {
  const SCROLL_Y = Object.getOwnPropertyDescriptor(window, 'scrollY');
  const setZoom = (zoom: string) => document.documentElement.style.setProperty('zoom', zoom);
  const setScrollY = (value: number) =>
    Object.defineProperty(window, 'scrollY', { configurable: true, value });
  const fire = (type: 'scroll' | 'resize') => window.dispatchEvent(new Event(type));
  let cleanup: (() => void) | undefined;

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    vi.restoreAllMocks();
    document.documentElement.style.removeProperty('zoom');
    if (SCROLL_Y) Object.defineProperty(window, 'scrollY', SCROLL_Y);
    else delete (window as { scrollY?: number }).scrollY;
  });

  it('restores the place in CSS px when a resize changes the zoom', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    setZoom('2');
    setScrollY(1000); // 500 CSS px down
    cleanup = keepScrollAcrossZoom();
    setZoom('1.5');
    fire('resize');
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith({ top: 750, behavior: 'instant' });
  });

  it('does nothing on a resize that keeps the zoom, nor after its cleanup', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    setZoom('2');
    setScrollY(1000);
    cleanup = keepScrollAcrossZoom();
    fire('resize');
    expect(scrollTo).not.toHaveBeenCalled();
    cleanup();
    setZoom('1.5');
    fire('resize');
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('follows the reader’s scrolls, never one that lands between the zoom change and its resize', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    setZoom('2');
    setScrollY(1000);
    cleanup = keepScrollAcrossZoom();
    setScrollY(1200); // the reader scrolls on: 600 CSS px
    fire('scroll');
    setZoom('1.5');
    setScrollY(1100); // the browser moves the page before the resize runs
    fire('scroll');
    fire('resize');
    expect(scrollTo).toHaveBeenCalledWith({ top: 900, behavior: 'instant' });
  });
});
