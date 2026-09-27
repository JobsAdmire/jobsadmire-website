import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInView } from '../useInView';

/** jsdom has no IntersectionObserver; task-6-additions.md calls for tests with a mocked one.
 *  One instance per `new IntersectionObserver(...)` call, so "one observer per element"
 *  (the hook's own contract) is directly observable from the instances list. */
class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;
  elements = new Set<Element>();
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }
  observe(el: Element) {
    this.elements.add(el);
  }
  unobserve(el: Element) {
    this.elements.delete(el);
  }
  disconnect() {
    this.elements.clear();
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
  }
}

function Probe() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="probe">
      {inView ? 'in view' : 'not in view'}
    </div>
  );
}

describe('useInView', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is false on the initial (server-matching) render, then true once the observer reports intersection', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('not in view');
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    act(() => {
      MockIntersectionObserver.instances[0]!.trigger(true);
    });
    expect(screen.getByTestId('probe')).toHaveTextContent('in view');
  });

  it('creates one observer per element and disconnects it on unmount', () => {
    const { unmount } = render(<Probe />);
    const observer = MockIntersectionObserver.instances[0]!;
    expect(observer.elements.size).toBe(1);
    const disconnect = vi.spyOn(observer, 'disconnect');
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('does not throw when IntersectionObserver is unavailable (SSR-safety proxy)', () => {
    vi.unstubAllGlobals();
    // @ts-expect-error -- simulating an environment without the constructor
    delete globalThis.IntersectionObserver;
    expect(() => render(<Probe />)).not.toThrow();
    expect(screen.getByTestId('probe')).toHaveTextContent('not in view');
  });
});
