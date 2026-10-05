import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FOCUS_GAP_PX,
  focusRevealDelta,
  guardFocusUnderHeader,
  HEADER_HEIGHT_VAR,
  publishHeaderHeight,
} from '../sticky-header';

// W232 (WCAG 2.2 SC 2.4.11): keyboard focus never lands under the sticky header, and sticky
// columns stick below it at its real height. jsdom lays nothing out, so every rect is stubbed
// (zoomed px, as `getBoundingClientRect` reports under the liquid desktop) and every height is
// an `offsetHeight` (CSS px).

type Box = { top: number; bottom: number };
const place = (el: Element, { top, bottom }: Box) =>
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom,
    height: bottom - top,
    left: 0,
    right: 100,
    width: 100,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
const byId = (id: string) => document.getElementById(id)!;

/** A page with the sticky header, its own CTA, and the cases a guard must tell apart. */
function page() {
  document.body.innerHTML = `
    <header style="position: sticky; top: 0px"><a id="cta" href="#">CTA</a></header>
    <main>
      <a id="link" href="#">link</a>
      <nav id="subnav" data-sticky-subnav="" style="position: sticky; top: 79px">
        <a id="jump" href="#">jump</a>
      </nav>
      <div style="position: fixed"><button id="in-layer" type="button">close</button></div>
      <div id="scroller" style="overflow-y: auto"><a id="in-scroller" href="#">toc</a></div>
    </main>`;
  // the header is stuck (top 0) and 113 px tall; the jump nav is still in the flow far below
  place(document.querySelector('header')!, { top: 0, bottom: 113 });
  place(byId('subnav'), { top: 600, bottom: 660 });
  place(byId('scroller'), { top: 300, bottom: 700 });
}

/** jsdom has no focus-visible heuristic: the control says whether it matches, then gets focus. */
function focusFrom(el: Element, keyboard = true) {
  const matches = el.matches.bind(el);
  vi.spyOn(el, 'matches').mockImplementation((selector: string) =>
    selector === ':focus-visible' ? keyboard : matches(selector),
  );
  el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
}

describe('focusRevealDelta (W232)', () => {
  it('scrolls up by the overlap plus the gap when the control starts above the chrome’s bottom', () => {
    expect(focusRevealDelta(50, 113, 8)).toBe(-71);
    expect(focusRevealDelta(-300, 113, 8)).toBe(-421);
  });

  it('leaves a control that starts at or below the chrome, and a page with no chrome covering it', () => {
    expect(focusRevealDelta(113, 113, 8)).toBe(0);
    expect(focusRevealDelta(400, 113, 8)).toBe(0);
    expect(focusRevealDelta(50, null, 8)).toBe(0);
  });
});

describe('guardFocusUnderHeader (W232)', () => {
  let cleanup: (() => void) | undefined;
  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    vi.restoreAllMocks();
    document.documentElement.style.removeProperty('zoom');
    document.body.innerHTML = '';
  });
  const scrollSpy = () => vi.spyOn(window, 'scrollBy').mockImplementation(() => {});

  it('scrolls a keyboard-focused control out from under the stuck header, instantly', () => {
    page();
    place(byId('link'), { top: 50, bottom: 80 });
    const scrollBy = scrollSpy();
    cleanup = guardFocusUnderHeader();
    focusFrom(byId('link'));
    // 50 − 113 − 8: its top lands FOCUS_GAP_PX below the header, past `scroll-behavior: smooth`
    expect(FOCUS_GAP_PX).toBe(8);
    expect(scrollBy).toHaveBeenCalledExactlyOnceWith({ top: -71, behavior: 'instant' });
  });

  it('scales the gap by the liquid desktop’s zoom, rects being zoomed px', () => {
    page();
    document.documentElement.style.setProperty('zoom', '2');
    place(document.querySelector('header')!, { top: 0, bottom: 142 });
    place(byId('link'), { top: 100, bottom: 160 });
    const scrollBy = scrollSpy();
    cleanup = guardFocusUnderHeader();
    focusFrom(byId('link'));
    expect(scrollBy).toHaveBeenCalledExactlyOnceWith({ top: 100 - 142 - 16, behavior: 'instant' });
  });

  it('leaves a control below the header, a pointer focus and the header’s own controls alone', () => {
    page();
    place(byId('link'), { top: 113, bottom: 140 });
    place(byId('cta'), { top: 30, bottom: 74 });
    const scrollBy = scrollSpy();
    cleanup = guardFocusUnderHeader();
    focusFrom(byId('link'));
    focusFrom(byId('cta'));
    place(byId('link'), { top: 50, bottom: 80 });
    focusFrom(byId('link'), false);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it('does nothing while the header is still in the flow, nor on a page without one (the portal entry)', () => {
    page();
    place(document.querySelector('header')!, { top: 40, bottom: 153 }); // page top: not stuck
    place(byId('link'), { top: 60, bottom: 90 });
    place(byId('jump'), { top: 60, bottom: 104 });
    const scrollBy = scrollSpy();
    cleanup = guardFocusUnderHeader();
    focusFrom(byId('link'));
    document.querySelector('header')!.remove();
    focusFrom(byId('jump'));
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it('leaves the page alone when focus comes back to the control that had it (the window refocused)', () => {
    page();
    place(byId('link'), { top: 50, bottom: 80 });
    place(byId('jump'), { top: 300, bottom: 344 });
    const scrollBy = scrollSpy();
    cleanup = guardFocusUnderHeader();
    focusFrom(byId('link'));
    expect(scrollBy).toHaveBeenCalledTimes(1);
    // the reader scrolls the focused link back under the header, switches windows and returns:
    // the browser fires focusin on it again, and leaves the page where it was — so does the guard
    focusFrom(byId('link'));
    expect(scrollBy).toHaveBeenCalledTimes(1);
    // reached again by Tab from another control, it is guarded as before
    focusFrom(byId('jump'));
    focusFrom(byId('link'));
    expect(scrollBy).toHaveBeenCalledTimes(2);
  });

  it('clears a stuck sub-navigation under the header too, and leaves its own links alone', () => {
    page();
    place(document.querySelector('header')!, { top: 0, bottom: 71 });
    place(byId('subnav'), { top: 79, bottom: 139 }); // stuck at its `top: 79px`
    place(byId('link'), { top: 100, bottom: 130 });
    place(byId('jump'), { top: 87, bottom: 131 });
    const scrollBy = scrollSpy();
    cleanup = guardFocusUnderHeader();
    focusFrom(byId('jump'));
    expect(scrollBy).not.toHaveBeenCalled();
    focusFrom(byId('link'));
    expect(scrollBy).toHaveBeenCalledExactlyOnceWith({ top: 100 - 139 - 8, behavior: 'instant' });
  });

  it('counts a sub-navigation still in the flow as page content, not chrome', () => {
    page(); // the jump nav sits at 600–660, below its sticky offset
    place(byId('jump'), { top: 60, bottom: 104 }); // under the header: an ordinary control
    const scrollBy = scrollSpy();
    cleanup = guardFocusUnderHeader();
    focusFrom(byId('jump'));
    expect(scrollBy).toHaveBeenCalledExactlyOnceWith({ top: 60 - 113 - 8, behavior: 'instant' });
  });

  it('never scrolls the window for a fixed layer, nor while an inner scroller still hides the control', () => {
    page();
    place(byId('in-layer'), { top: 20, bottom: 64 }); // a dialog over the header
    place(byId('in-scroller'), { top: 40, bottom: 70 }); // above the sidebar's own box (300–700)
    const scrollBy = scrollSpy();
    cleanup = guardFocusUnderHeader();
    focusFrom(byId('in-layer'));
    focusFrom(byId('in-scroller'));
    expect(scrollBy).not.toHaveBeenCalled();
    // inside its scroller's box, the scroller itself under the header: the window scroll reveals it
    place(byId('scroller'), { top: 30, bottom: 700 });
    focusFrom(byId('in-layer'));
    focusFrom(byId('in-scroller'));
    expect(scrollBy).toHaveBeenCalledExactlyOnceWith({ top: 40 - 113 - 8, behavior: 'instant' });
  });

  it('stops listening after its cleanup', () => {
    page();
    place(byId('link'), { top: 50, bottom: 80 });
    const scrollBy = scrollSpy();
    guardFocusUnderHeader()();
    focusFrom(byId('link'));
    expect(scrollBy).not.toHaveBeenCalled();
  });
});

describe('publishHeaderHeight (W232)', () => {
  /** jsdom has no ResizeObserver; this one is fired by hand. */
  class FakeResizeObserver {
    static last: FakeResizeObserver | undefined;
    observed: Element[] = [];
    disconnected = false;
    constructor(private readonly callback: ResizeObserverCallback) {
      FakeResizeObserver.last = this;
    }
    observe(el: Element) {
      this.observed.push(el);
    }
    unobserve() {}
    disconnect() {
      this.disconnected = true;
    }
    fire() {
      this.callback([], this as unknown as ResizeObserver);
    }
  }
  const readVar = () => document.documentElement.style.getPropertyValue(HEADER_HEIGHT_VAR);
  /** A sticky header whose `offsetHeight` (CSS px, right under the zoom) is `height()`. */
  function header(height: () => number) {
    const el = document.createElement('header');
    el.style.position = 'sticky';
    Object.defineProperty(el, 'offsetHeight', { configurable: true, get: height });
    document.body.append(el);
    return el;
  }
  let cleanup: (() => void) | undefined;
  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    vi.unstubAllGlobals();
    FakeResizeObserver.last = undefined;
    document.documentElement.style.removeProperty(HEADER_HEIGHT_VAR);
    document.body.innerHTML = '';
  });

  it('publishes the header’s height on <html> at once and again when it changes', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    let height = 113;
    const el = header(() => height);
    cleanup = publishHeaderHeight();
    expect(readVar()).toBe('113px');
    expect(FakeResizeObserver.last!.observed).toEqual([el]);
    height = 71; // the nav fits on one line again
    FakeResizeObserver.last!.fire();
    expect(readVar()).toBe('71px');
  });

  it('removes the property and stops observing on cleanup, so the stylesheet’s fallback stands', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    header(() => 107);
    cleanup = publishHeaderHeight();
    cleanup();
    cleanup = undefined;
    expect(readVar()).toBe('');
    expect(FakeResizeObserver.last!.disconnected).toBe(true);
  });

  it('keeps the last height when the observed header leaves the document (a route-group change)', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    let height = 113;
    const el = header(() => height);
    cleanup = publishHeaderHeight();
    el.remove();
    height = 0; // a detached element lays out to nothing
    FakeResizeObserver.last!.fire();
    expect(readVar()).toBe('113px');
  });

  it('publishes nothing without a sticky header, and publishes once without ResizeObserver', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    cleanup = publishHeaderHeight();
    expect(readVar()).toBe('');
    expect(FakeResizeObserver.last).toBeUndefined();
    cleanup();
    vi.unstubAllGlobals(); // jsdom's own: no ResizeObserver at all
    header(() => 157);
    cleanup = publishHeaderHeight();
    expect(readVar()).toBe('157px');
  });
});
