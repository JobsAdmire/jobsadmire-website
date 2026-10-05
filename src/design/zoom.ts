// W231: the liquid desktop zooms the root above 1440 px (src/app/globals.css). Under a CSS zoom,
// `getBoundingClientRect()`, `scrollY` and `innerHeight` are zoomed px while CSS lengths and the
// `offset*` properties are not, so a script that compares a CSS-px threshold with a zoomed
// reading scales the threshold by `rootZoom()` first.

/** The width the desktop layout is drawn at; wider screens zoom it (W231). */
export const LIQUID_BASE_PX = 1440;

/** The root's resolved zoom: 1 on the server, without a zoom, or where it cannot be read. */
export function rootZoom(): number {
  if (typeof document === 'undefined') return 1;
  const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom);
  return Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
}

/** Keeps the reader's place when a resize changes the root zoom (W231). Chrome keeps `scrollY`,
 *  in zoomed px, across a window resize, so a zoom change (a window snap, the side panel,
 *  DevTools) would move the reader by hundreds of CSS px: the place is remembered in CSS px and
 *  restored under the new zoom. A scroll that lands after the zoom changed but before its resize
 *  runs is the browser's, not the reader's, and is ignored. Returns the cleanup. */
export function keepScrollAcrossZoom(win: Window = window): () => void {
  let zoom = rootZoom();
  let y = win.scrollY / zoom;
  const onScroll = () => {
    if (rootZoom() === zoom) y = win.scrollY / zoom;
  };
  const onResize = () => {
    const next = rootZoom();
    if (next === zoom) return;
    zoom = next;
    // instant: the root's `scroll-behavior: smooth` would animate the jump back
    win.scrollTo({ top: y * zoom, behavior: 'instant' });
  };
  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', onResize);
  return () => {
    win.removeEventListener('scroll', onScroll);
    win.removeEventListener('resize', onResize);
  };
}

/** An image `sizes` value for a slot of fixed CSS width: past the liquid base the slot grows
 *  with the screen, so its share of the viewport is what the browser must pick a source for —
 *  otherwise a 104 px photo would be fetched for 104 px and upscaled by the zoom. */
export function liquidSizes(px: number, below = `${px}px`): string {
  const vw = Math.round((px / LIQUID_BASE_PX) * 10_000) / 100;
  return `(min-width: ${LIQUID_BASE_PX + 1}px) ${vw}vw, ${below}`;
}
