import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isBarVisible, STICKY_CTA_HEIGHT_VAR, StickyCtaBar } from '../StickyCtaBar';
import { renderWithIntl } from '@/test/render';

type Entry = Record<string, unknown>;
const pushed = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;

const ctas = [{ label: 'Request', href: '/hire-workers' }];

function setScroll(y: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

function placeTarget(top: number) {
  let el = document.getElementById('request-form');
  if (!el) {
    el = document.createElement('div');
    el.id = 'request-form';
    document.body.appendChild(el);
  }
  el.getBoundingClientRect = () => ({ top }) as DOMRect;
}

const readVar = () => document.documentElement.style.getPropertyValue(STICKY_CTA_HEIGHT_VAR);

beforeEach(() => {
  // jsdom lays nothing out; the bar's published height is whatever offsetHeight reports.
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(64);
  setScroll(0);
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});
afterEach(() => {
  vi.restoreAllMocks();
  document.getElementById('request-form')?.remove();
  document.documentElement.style.removeProperty(STICKY_CTA_HEIGHT_VAR);
});

describe('isBarVisible (the Hire Workers rule)', () => {
  it('needs the scroll threshold, then hides once the target nears the viewport', () => {
    expect(isBarVisible(100, 700, null, 800)).toBe(false);
    expect(isBarVisible(900, 700, null, 800)).toBe(true);
    expect(isBarVisible(900, 700, 2000, 800)).toBe(true); // target far below
    expect(isBarVisible(900, 700, 720, 800)).toBe(true); // exactly 90% — still shown
    expect(isBarVisible(900, 700, 719, 800)).toBe(false); // inside the lower 10%
    expect(isBarVisible(900, 700, -300, 800)).toBe(false); // scrolled past the target
  });
});

describe('StickyCtaBar', () => {
  it('appears after showAfterPx and publishes its height on <html> (W18)', () => {
    renderWithIntl(<StickyCtaBar message="Need workers?" ctas={ctas} />);
    expect(screen.queryByRole('link', { name: 'Request' })).toBeNull();
    expect(readVar()).toBe('0px');
    setScroll(800);
    expect(screen.getByRole('link', { name: 'Request' })).toHaveAttribute('href', '/isci-talebi');
    expect(readVar()).toBe('64px');
    setScroll(100);
    expect(screen.queryByRole('link', { name: 'Request' })).toBeNull();
    expect(readVar()).toBe('0px');
  });

  it('hides while the hideNearId target is within the lower 10% of the viewport', () => {
    placeTarget(2000);
    renderWithIntl(<StickyCtaBar message="m" ctas={ctas} hideNearId="request-form" />);
    setScroll(800);
    expect(screen.getByRole('link', { name: 'Request' })).toBeInTheDocument();
    placeTarget(300);
    setScroll(1200);
    expect(screen.queryByRole('link', { name: 'Request' })).toBeNull();
    expect(readVar()).toBe('0px');
  });

  it('resets the variable on unmount', () => {
    const view = renderWithIntl(<StickyCtaBar message="m" ctas={ctas} />);
    setScroll(800);
    expect(readVar()).toBe('64px');
    view.unmount();
    expect(readVar()).toBe('0px');
  });

  it('renders the live dot only when asked', () => {
    renderWithIntl(<StickyCtaBar message="m" ctas={ctas} live />);
    setScroll(800);
    expect(document.querySelector('[data-live-dot]')).not.toBeNull();
  });

  it('carries data-testid="sticky-cta" on its wrapper', () => {
    renderWithIntl(<StickyCtaBar message="m" ctas={ctas} />);
    setScroll(800);
    expect(screen.getByTestId('sticky-cta')).toBeInTheDocument();
  });
});

describe('StickyCtaBar CTA routing (W81, W82)', () => {
  // jsdom has no navigation; a native listener swallows the default action while React's own
  // handler (registered on the root) still runs — the same helper ContactCta's own test uses.
  async function click(name: string) {
    const link = screen.getByRole('link', { name });
    link.addEventListener('click', (e) => e.preventDefault());
    await userEvent.click(link);
  }

  it('a tel: CTA fires call_click with placement page_cta, through ContactLink', async () => {
    renderWithIntl(
      <StickyCtaBar message="m" ctas={[{ label: 'Ara', href: 'tel:+905011240340' }]} />,
    );
    setScroll(800);
    const link = screen.getByRole('link', { name: 'Ara' });
    expect(link).toHaveAttribute('href', 'tel:+905011240340');
    await click('Ara');
    expect(pushed()).toEqual([
      { event: 'call_click', page: '/', locale: 'tr', placement: 'page_cta' },
    ]);
  });

  it('a non-contact href stays a plain Button and fires nothing', async () => {
    renderWithIntl(<StickyCtaBar message="m" ctas={ctas} />);
    setScroll(800);
    await click('Request');
    expect(pushed()).toEqual([]);
  });

  it('accepts an object href (W82)', () => {
    renderWithIntl(
      <StickyCtaBar
        message="m"
        ctas={[{ label: 'Formu aç', href: { pathname: '/hire-workers', hash: '#request-form' } }]}
      />,
    );
    setScroll(800);
    expect(screen.getByRole('link', { name: 'Formu aç' })).toHaveAttribute(
      'href',
      '/isci-talebi#request-form',
    );
  });
});
