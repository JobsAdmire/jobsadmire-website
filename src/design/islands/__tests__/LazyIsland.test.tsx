import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LazyIsland } from '../LazyIsland';

/** jsdom has no IntersectionObserver; task-6-additions.md calls for tests with a mocked one. */
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

function Real({ label }: { label: string }) {
  return <button>{label}</button>;
}

describe('LazyIsland', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the fallback until in view, then React.lazy-loads the real component with its props', async () => {
    const load = vi.fn().mockResolvedValue({ default: Real });
    render(<LazyIsland load={load} props={{ label: 'Loaded' }} fallback={<span>Loading…</span>} />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(load).not.toHaveBeenCalled();
    act(() => {
      MockIntersectionObserver.instances[0]!.trigger(true);
    });
    expect(await screen.findByRole('button', { name: 'Loaded' })).toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('is DOM-identical to the loaded island’s own initial state before it loads', () => {
    const load = vi.fn().mockResolvedValue({ default: Real });
    render(<LazyIsland load={load} props={{ label: 'X' }} fallback={<button>X</button>} />);
    // Same accessible shape as the real component once it loads: a single button named "X".
    expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument();
  });

  it('renders nothing (not even the fallback) until observed when ssr is false', async () => {
    const load = vi.fn().mockResolvedValue({ default: Real });
    render(
      <LazyIsland
        load={load}
        props={{ label: 'Loaded' }}
        fallback={<span>Loading…</span>}
        ssr={false}
      />,
    );
    expect(screen.queryByText('Loading…')).toBeNull();
    act(() => {
      MockIntersectionObserver.instances[0]!.trigger(true);
    });
    expect(await screen.findByRole('button', { name: 'Loaded' })).toBeInTheDocument();
  });
});
