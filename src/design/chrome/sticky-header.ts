// W232: the sticky header covers the top of the window while it sticks — 71 CSS px on one line,
// 107–157 px where its nav wraps (901 px to ≈ 1165 px, depending on the locale, the page's CTA
// and the system font) — and on the work-permit page the jump nav sticks under it from 1101 px.
// Two helpers keep the page clear of it, both mounted once for every page from `ClientIslands`:
// the header's real height is published as `--header-h`, which every sticky column's top is
// built from (`--sticky-top`, src/app/globals.css), and keyboard focus is never left under it
// (WCAG 2.2 SC 2.4.11). Not `scroll-padding-top` on the root: ~40 anchor targets already clear
// the header with their own `scroll-mt-*`, and the two would add up.
import { rootZoom } from '@/design/zoom';

/** The header's rendered height (CSS px), published on `<html>`; globals.css carries the
 *  per-band fallback that holds before the first publish and without JavaScript. */
export const HEADER_HEIGHT_VAR = '--header-h';

/** The air (CSS px) the focus guard leaves between the top chrome and a focused control — room
 *  for the site's 2 px focus outline at its 2 px offset. */
export const FOCUS_GAP_PX = 8;

/** The chrome that covers the page while it sticks: the header and a page's sticky
 *  sub-navigation (`data-sticky-subnav` — the work-permit jump nav, sticky from 1101 px). */
const TOP_CHROME = 'header, [data-sticky-subnav]';

const CLIPS = /^(auto|scroll|hidden|clip)$/;

/** How far to scroll the window (≤ 0) so a focused control whose top is `targetTop` clears top
 *  chrome ending at `chromeBottom`, with `gap` of air: 0 when it already starts at or below the
 *  chrome, or when nothing covers the page (`null`). One unit throughout — rects are zoomed px
 *  under the liquid desktop, so the caller scales the gap by the zoom (W231). */
export function focusRevealDelta(targetTop: number, chromeBottom: number | null, gap: number) {
  if (chromeBottom === null || targetTop >= chromeBottom) return 0;
  return targetTop - chromeBottom - gap;
}

/** The site header, when it is sticky (or fixed): the portal entry renders none. */
function stickyHeader(doc: Document): HTMLElement | null {
  const header = doc.querySelector<HTMLElement>('header');
  const view = doc.defaultView;
  if (!header || !view) return null;
  return /^(sticky|fixed)$/.test(view.getComputedStyle(header).position) ? header : null;
}

/** The top chrome covering the window right now: sticky or fixed, and at (or pushed past) its
 *  own `top`. A sticky bar still in the flow covers nothing — it sits in line with the page, and
 *  at the page's top the header is such a bar. Its `top` is CSS px, its rect zoomed px. */
function coveringChrome(doc: Document, view: Window, zoom: number): HTMLElement[] {
  return [...doc.querySelectorAll<HTMLElement>(TOP_CHROME)].filter((el) => {
    const style = view.getComputedStyle(el);
    if (!/^(sticky|fixed)$/.test(style.position)) return false;
    const rect = el.getBoundingClientRect();
    const top = Number.parseFloat(style.top);
    return rect.height > 0 && Number.isFinite(top) && rect.top <= top * zoom + 1;
  });
}

/** Whether a window scroll can bring the control out from under the chrome: never inside a fixed
 *  layer (a dialog, the sticky CTA bar — the window scroll does not move it), and not while an
 *  inner scroller (the blog sidebar) still hides it outside its own box: the browser scrolls that
 *  box to it right after this, and the box itself sits below the chrome. */
function windowScrollReveals(el: Element, rect: DOMRect, view: Window): boolean {
  const root = el.ownerDocument.documentElement;
  for (let node: Element | null = el; node && node !== root; node = node.parentElement) {
    const style = view.getComputedStyle(node);
    if (style.position === 'fixed') return false;
    if (node !== el && CLIPS.test(style.overflowY)) {
      const box = node.getBoundingClientRect();
      if (rect.top < box.top || rect.bottom > box.bottom) return false;
    }
  }
  return true;
}

function focusVisible(el: Element) {
  try {
    return el.matches(':focus-visible');
  } catch {
    return false; // a browser without :focus-visible: leave focus to the browser
  }
}

/** Keeps keyboard focus clear of the sticky header (WCAG 2.2 SC 2.4.11, W232). The browser does
 *  not scroll to a newly focused control it counts as in view, and a control under the header is
 *  in view to it; `focusin` fires before the browser's own scroll, so when `:focus-visible`
 *  matches and the control starts above the covering chrome's bottom, the window is scrolled
 *  first — instantly, past the root's `scroll-behavior: smooth` — until the control starts
 *  `FOCUS_GAP_PX` below it, and the browser then finds it in view. Focus coming back to the
 *  control that last had it (the window regaining focus fires `focusin` on it again) moves
 *  nothing, so the page stays where the reader scrolled it, as the browser leaves it. Returns
 *  the cleanup. */
export function guardFocusUnderHeader(doc: Document = document): () => void {
  let last: EventTarget | null = null;
  const onFocusIn = (event: FocusEvent) => {
    const view = doc.defaultView;
    const target = event.target;
    const again = target === last;
    last = target;
    if (again || !view || !(target instanceof view.Element) || !focusVisible(target)) return;
    const zoom = rootZoom();
    const chrome = coveringChrome(doc, view, zoom);
    if (chrome.length === 0 || chrome.some((bar) => bar.contains(target))) return;
    const bottom = Math.max(...chrome.map((bar) => bar.getBoundingClientRect().bottom));
    const rect = target.getBoundingClientRect();
    const delta = focusRevealDelta(rect.top, bottom, FOCUS_GAP_PX * zoom);
    if (delta === 0 || !windowScrollReveals(target, rect, view)) return;
    view.scrollBy({ top: delta, behavior: 'instant' });
  };
  doc.addEventListener('focusin', onFocusIn);
  return () => doc.removeEventListener('focusin', onFocusIn);
}

/** Publishes the sticky header's `offsetHeight` — CSS px, so right under the liquid desktop's
 *  zoom — as `--header-h` on `<html>`, and again whenever it changes (its nav wraps or unwraps on
 *  a resize, the page's CTA changes its width). A header that has left the document (a route
 *  change into another route group) is ignored: the next mount observes its successor. Without a
 *  sticky header (the portal entry) nothing is published. Returns the cleanup, which removes the
 *  property so the stylesheet's fallback stands again — `StickyCtaBar`'s pattern (W18). */
export function publishHeaderHeight(doc: Document = document): () => void {
  const root = doc.documentElement;
  const header = stickyHeader(doc);
  if (!header) return () => {};
  const publish = () => {
    if (!header.isConnected || header.offsetHeight === 0) return;
    root.style.setProperty(HEADER_HEIGHT_VAR, `${header.offsetHeight}px`);
  };
  publish();
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(publish) : null;
  observer?.observe(header);
  return () => {
    observer?.disconnect();
    root.style.removeProperty(HEADER_HEIGHT_VAR);
  };
}
