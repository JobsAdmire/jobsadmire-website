import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientIslands } from '../ClientIslands';
import { HINT_KEY } from '../hint-eligibility';
import { memoryStorage } from '@/test/storage';

// W148: the language hint decides BEFORE it loads. `next/dynamic` requests a component's chunk
// when the component first renders, so this stand-in keeps exactly that contract — the loader
// runs on first render, never at definition — and counts the requests. The hint module itself is
// mocked: what is under test is whether ClientIslands asks for it at all.
const dynamicImports = vi.hoisted(() => ({ requested: 0, loaded: [] as string[] }));

vi.mock('next/dynamic', async () => {
  const { createElement, useEffect, useState } = await import('react');
  type Loaded = (props: Record<string, unknown>) => ReactNode;
  return {
    default: (loader: () => Promise<Loaded>) =>
      function DynamicStandIn(props: Record<string, unknown>) {
        const [Component, setComponent] = useState<Loaded | null>(null);
        useEffect(() => {
          let live = true;
          dynamicImports.requested += 1;
          void loader().then((c) => {
            dynamicImports.loaded.push(c.name);
            if (live) setComponent(() => c);
          });
          return () => {
            live = false;
          };
        }, []);
        return Component ? createElement(Component, props) : null;
      },
  };
});

vi.mock('../LanguageHint', () => ({
  LanguageHint: function LanguageHint() {
    return <div data-testid="language-hint" />;
  },
}));

// W232: the header-height publisher re-observes per pathname (a route into another group swaps
// the header element); the test drives the pathname by hand.
const nav = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }));

function browserLanguages(languages: string[]) {
  Object.defineProperty(window.navigator, 'languages', {
    configurable: true,
    get: () => languages,
  });
}

beforeEach(() => {
  dynamicImports.requested = 0;
  dynamicImports.loaded = [];
  vi.stubGlobal('localStorage', memoryStorage());
});

afterEach(() => {
  // back to jsdom's own getter on Navigator.prototype
  delete (window.navigator as { languages?: unknown }).languages;
  vi.unstubAllGlobals();
});

/** Render, then let every effect and resolved import settle. */
async function mount(locale: 'tr' | 'en') {
  render(<ClientIslands consent={false} locale={locale} />);
  await act(async () => {
    await Promise.resolve();
  });
}

describe('ClientIslands requests LanguageHint only for an eligible visitor (W148)', () => {
  it('a Turkish page in a Turkish browser never requests the hint', async () => {
    browserLanguages(['tr-TR', 'tr']);
    await mount('tr');
    expect(dynamicImports.requested).toBe(0);
    expect(screen.queryByTestId('language-hint')).toBeNull();
  });

  it('an English page never requests it, whatever the browser speaks', async () => {
    browserLanguages(['en-US', 'en']);
    await mount('en');
    expect(dynamicImports.requested).toBe(0);
  });

  it('a dismissed hint is never requested again', async () => {
    browserLanguages(['en-GB']);
    localStorage.setItem(HINT_KEY, 'off');
    await mount('tr');
    expect(dynamicImports.requested).toBe(0);
  });

  it('a Turkish page in an English browser requests it once, and it renders', async () => {
    browserLanguages(['en-US', 'en']);
    await mount('tr');
    expect(dynamicImports.requested).toBe(1);
    expect(dynamicImports.loaded).toEqual(['LanguageHint']);
    expect(screen.getByTestId('language-hint')).toBeInTheDocument();
  });
});

// W231: every page mounts the liquid desktop's scroll keeper here (`keepScrollAcrossZoom`, whose
// own cases are in src/design/__tests__/liquid.test.ts).
describe('ClientIslands keeps the reader’s place across a zoom change (W231)', () => {
  const SCROLL_Y = Object.getOwnPropertyDescriptor(window, 'scrollY');
  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.style.removeProperty('zoom');
    if (SCROLL_Y) Object.defineProperty(window, 'scrollY', SCROLL_Y);
    else delete (window as { scrollY?: number }).scrollY;
  });

  it('restores the place on a zoom-changing resize while mounted, never after', () => {
    browserLanguages(['tr-TR', 'tr']);
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    document.documentElement.style.setProperty('zoom', '2');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 });
    const { unmount } = render(<ClientIslands consent={false} locale="tr" />);
    document.documentElement.style.setProperty('zoom', '1.5');
    window.dispatchEvent(new Event('resize'));
    expect(scrollTo).toHaveBeenCalledWith({ top: 750, behavior: 'instant' });
    unmount();
    document.documentElement.style.setProperty('zoom', '2');
    window.dispatchEvent(new Event('resize'));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });
});

// W232: every page mounts the focus guard and the header-height publisher here (their own cases
// are in sticky-header.test.ts).
describe('ClientIslands keeps the sticky header clear of keyboard focus and sticky columns (W232)', () => {
  const readVar = () => document.documentElement.style.getPropertyValue('--header-h');
  /** A sticky header, first in the body like SiteChrome's, `height` CSS px tall. */
  const header = (height: number) => {
    const el = document.createElement('header');
    el.style.position = 'sticky';
    el.style.top = '0px';
    Object.defineProperty(el, 'offsetHeight', { configurable: true, get: () => height });
    document.body.prepend(el);
    return el;
  };
  afterEach(() => {
    vi.restoreAllMocks();
    document.querySelectorAll('header, a[data-probe]').forEach((el) => el.remove());
    document.documentElement.style.removeProperty('--header-h');
    nav.pathname = '/';
  });

  it('publishes the header’s height, then the height of the header a route change brings', () => {
    browserLanguages(['tr-TR', 'tr']);
    const first = header(113);
    const { rerender, unmount } = render(<ClientIslands consent={false} locale="tr" />);
    expect(readVar()).toBe('113px');
    // (site) → (minimal): the group layout renders a new header element
    first.remove();
    header(107);
    nav.pathname = '/gizlilik';
    rerender(<ClientIslands consent={false} locale="tr" />);
    expect(readVar()).toBe('107px');
    unmount();
    expect(readVar()).toBe('');
  });

  it('scrolls a keyboard-focused control out from under the header while mounted, never after', () => {
    browserLanguages(['tr-TR', 'tr']);
    vi.spyOn(header(113), 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 113,
      height: 113,
    } as DOMRect);
    /** A keyboard-focusable link under the 113 px header. */
    const probe = () => {
      const link = document.createElement('a');
      link.href = '#';
      link.dataset.probe = '';
      document.body.append(link);
      vi.spyOn(link, 'getBoundingClientRect').mockReturnValue({
        top: 50,
        bottom: 80,
        height: 30,
      } as DOMRect);
      vi.spyOn(link, 'matches').mockImplementation((selector) => selector === ':focus-visible');
      return link;
    };
    const [first, second] = [probe(), probe()];
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {});
    const { unmount } = render(<ClientIslands consent={false} locale="tr" />);
    first.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(scrollBy).toHaveBeenCalledExactlyOnceWith({ top: 50 - 113 - 8, behavior: 'instant' });
    unmount();
    second.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(scrollBy).toHaveBeenCalledTimes(1);
  });
});
