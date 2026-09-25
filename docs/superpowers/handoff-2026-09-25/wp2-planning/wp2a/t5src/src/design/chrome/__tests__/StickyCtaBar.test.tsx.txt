import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isBarVisible, STICKY_CTA_HEIGHT_VAR, StickyCtaBar } from '../StickyCtaBar';
import { renderWithIntl } from '@/test/render';

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
});
