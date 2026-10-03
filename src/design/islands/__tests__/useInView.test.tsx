import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInView } from '../useInView';

/** jsdom has no IntersectionObserver; task-6-additions.md calls for tests with a mocked one.
 *  One instance per `new IntersectionObserver(...)` call, so "one observer per element"
 *  (the hook's own contract) is directly observable from the instances list. Like the real
 *  one, it records its options and delivers entries only while it still observes something. */
class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  readonly options: IntersectionObserverInit | undefined;
  private callback: IntersectionObserverCallback;
  elements = new Set<Element>();
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
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
  /** One callback with one entry per state, oldest first (a batched delivery). */
  trigger(...states: boolean[]) {
    if (!this.elements.size) return;
    this.callback(
      states.map((isIntersecting) => ({ isIntersecting }) as IntersectionObserverEntry),
      this,
    );
  }
}
const latest = () => MockIntersectionObserver.instances.at(-1)!;

function Probe({ once, rootMargin }: { once?: boolean; rootMargin?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>({ once, rootMargin });
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

  it('observes an element that mounts after the hook does', () => {
    function Late() {
      const [ref, inView] = useInView<HTMLDivElement>();
      const [shown, setShown] = useState(false);
      return (
        <>
          <button onClick={() => setShown(true)}>show</button>
          {shown ? (
            <div ref={ref} data-testid="late">
              {inView ? 'in view' : 'not in view'}
            </div>
          ) : null}
        </>
      );
    }
    render(<Late />);
    fireEvent.click(screen.getByRole('button', { name: 'show' }));
    const late = screen.getByTestId('late');
    expect(latest().elements.has(late)).toBe(true);
    act(() => latest().trigger(true));
    expect(late).toHaveTextContent('in view');
  });

  it('re-observes an element remounted under a new key, and lets go of the detached one', () => {
    function Keyed({ id }: { id: string }) {
      const [ref] = useInView<HTMLDivElement>();
      return <div key={id} ref={ref} data-testid={id} />;
    }
    const { rerender } = render(<Keyed id="a" />);
    const a = screen.getByTestId('a');
    rerender(<Keyed id="b" />);
    const b = screen.getByTestId('b');
    const live = MockIntersectionObserver.instances.filter((o) => o.elements.size > 0);
    expect(live).toHaveLength(1);
    expect(live[0]!.elements.has(b)).toBe(true);
    expect(live[0]!.elements.has(a)).toBe(false);
  });

  it('folds a batch of entries to the latest record', () => {
    render(<Probe />);
    act(() => latest().trigger(true, false));
    expect(screen.getByTestId('probe')).toHaveTextContent('not in view');
    act(() => latest().trigger(false, true));
    expect(screen.getByTestId('probe')).toHaveTextContent('in view');
  });

  it('with `once`, latches true on the first intersection and disconnects for good', () => {
    const { rerender } = render(<Probe once />);
    const observer = MockIntersectionObserver.instances[0]!;
    act(() => observer.trigger(false));
    expect(screen.getByTestId('probe')).toHaveTextContent('not in view');
    act(() => observer.trigger(true));
    expect(screen.getByTestId('probe')).toHaveTextContent('in view');
    expect(observer.elements.size).toBe(0);
    rerender(<Probe once rootMargin="10px" />);
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(screen.getByTestId('probe')).toHaveTextContent('in view');
  });
});
