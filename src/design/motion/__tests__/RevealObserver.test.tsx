import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  armReveal,
  REVEAL_FALLBACK_MS,
  REVEAL_OBSERVER_OPTIONS,
  REVEAL_INSTANT,
  REVEAL_JUMP,
  REVEAL_ON,
  RevealObserver,
} from '../RevealObserver';

const nav = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }));

/** jsdom has no IntersectionObserver: this one records its options and targets and delivers an
 *  entry for one target on demand, as the browser would. */
class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  readonly options: IntersectionObserverInit | undefined;
  readonly targets = new Set<Element>();
  private readonly callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    MockIntersectionObserver.instances.push(this);
  }
  observe(el: Element) {
    this.targets.add(el);
  }
  unobserve(el: Element) {
    this.targets.delete(el);
  }
  disconnect() {
    this.targets.clear();
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  fire(target: Element, isIntersecting = true) {
    if (!this.targets.has(target)) return;
    this.callback([{ target, isIntersecting } as unknown as IntersectionObserverEntry], this);
  }
}
const latest = () => MockIntersectionObserver.instances.at(-1)!;

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('prefers-reduced-motion: reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
}

function add(className: string, parent: Element = document.body): HTMLElement {
  const el = document.createElement('section');
  el.className = className;
  parent.appendChild(el);
  return el;
}

const revealed = (el: Element) => el.classList.contains(REVEAL_ON);

let teardown: (() => void) | undefined;

beforeEach(() => {
  MockIntersectionObserver.instances = [];
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  stubReducedMotion(false);
});

afterEach(() => {
  teardown?.();
  teardown = undefined;
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('armReveal', () => {
  it('observes every .ja-reveal and .ja-reveal-group with the design options', () => {
    const a = add('ja-reveal');
    const b = add('ja-reveal-group');
    add('plain');
    teardown = armReveal();
    expect(latest().options).toEqual(REVEAL_OBSERVER_OPTIONS);
    expect(REVEAL_OBSERVER_OPTIONS).toEqual({ rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
    expect([...latest().targets]).toEqual([a, b]);
    expect(revealed(a) || revealed(b)).toBe(false);
  });

  it('adds ja-reveal-on when the observer reports an intersection, then stops watching it', () => {
    const a = add('ja-reveal');
    const b = add('ja-reveal');
    teardown = armReveal();
    latest().fire(a, false);
    expect(revealed(a)).toBe(false);
    latest().fire(a);
    expect(revealed(a)).toBe(true);
    expect(revealed(b)).toBe(false);
    expect(latest().targets.has(a)).toBe(false);
    expect(latest().targets.has(b)).toBe(true);
  });

  it('never re-observes an element that is already revealed', () => {
    add(`ja-reveal ${REVEAL_ON}`);
    teardown = armReveal();
    expect(latest().targets.size).toBe(0);
  });

  it('reveals everything at once under reduced motion, without an observer', () => {
    stubReducedMotion(true);
    const a = add('ja-reveal');
    const b = add('ja-reveal-group');
    teardown = armReveal();
    expect(MockIntersectionObserver.instances).toHaveLength(0);
    expect(revealed(a) && revealed(b)).toBe(true);
  });

  it('reveals everything at once where IntersectionObserver does not exist', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const a = add('ja-reveal');
    teardown = armReveal();
    expect(revealed(a)).toBe(true);
  });

  it('falls back after 6 s: whatever never scrolled in is revealed', () => {
    vi.useFakeTimers();
    const a = add('ja-reveal');
    const b = add('ja-reveal');
    teardown = armReveal();
    latest().fire(a);
    vi.advanceTimersByTime(REVEAL_FALLBACK_MS - 1);
    expect(revealed(b)).toBe(false);
    vi.advanceTimersByTime(1);
    expect(REVEAL_FALLBACK_MS).toBe(6000);
    expect(revealed(b)).toBe(true);
    // shown at once (no fade for an audit to catch half-way); the scrolled-in one keeps its fade
    expect(b.classList.contains(REVEAL_INSTANT)).toBe(true);
    expect(b.classList.contains(REVEAL_JUMP)).toBe(true);
    expect(a.classList.contains(REVEAL_INSTANT)).toBe(false);
    expect(latest().targets.size).toBe(0);
    // transitions come back two frames later (hover lifts ease again); the instant mark stays
    vi.advanceTimersByTime(50);
    expect(b.classList.contains(REVEAL_JUMP)).toBe(false);
    expect(b.classList.contains(REVEAL_INSTANT)).toBe(true);
  });

  it('picks up reveal elements rendered later, nested ones included', async () => {
    teardown = armReveal();
    const wrapper = document.createElement('div');
    const late = add('ja-reveal', wrapper);
    document.body.appendChild(wrapper);
    await Promise.resolve(); // MutationObserver callbacks run as a microtask
    expect(latest().targets.has(late)).toBe(true);
    latest().fire(late);
    expect(revealed(late)).toBe(true);
  });

  it('tears down: no observer, no fallback, no mutation watch', async () => {
    vi.useFakeTimers();
    const a = add('ja-reveal');
    armReveal()();
    expect(latest().targets.size).toBe(0);
    add('ja-reveal');
    await Promise.resolve();
    vi.advanceTimersByTime(REVEAL_FALLBACK_MS);
    expect(revealed(a)).toBe(false);
    expect(latest().targets.size).toBe(0);
  });
});

describe('RevealObserver', () => {
  it('arms on mount and re-arms on every pathname (client navigation)', () => {
    nav.pathname = '/';
    const first = add('ja-reveal');
    const view = render(<RevealObserver />);
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(latest().targets.has(first)).toBe(true);
    const old = latest();
    nav.pathname = '/en';
    const next = add('ja-reveal');
    view.rerender(<RevealObserver />);
    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(old.targets.size).toBe(0); // the previous page's observer is gone
    expect(latest().targets.has(next)).toBe(true);
    view.unmount();
    expect(latest().targets.size).toBe(0);
  });

  it('renders nothing', () => {
    const { container } = render(<RevealObserver />);
    expect(container).toBeEmptyDOMElement();
  });
});
