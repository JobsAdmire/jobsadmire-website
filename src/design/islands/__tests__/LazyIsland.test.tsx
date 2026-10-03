import { act, fireEvent, render, screen } from '@testing-library/react';
import { Component, useState, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LazyIsland } from '../LazyIsland';

/** jsdom has no IntersectionObserver; task-6-additions.md calls for tests with a mocked one.
 *  Like the real one, it records its options and delivers entries only while it still
 *  observes something. */
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
  trigger(isIntersecting: boolean) {
    if (!this.elements.size) return;
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
  }
}

function Real({ label }: { label: string }) {
  return <button>{label}</button>;
}

function Counter({ label }: { label: string }) {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{`${label} ${count}`}</button>;
}

class Boundary extends Component<
  { children: ReactNode; onError: (error: unknown) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }
  render() {
    return this.state.failed ? <p>error boundary</p> : this.props.children;
  }
}

describe('LazyIsland', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
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

  it('loads once and stays mounted: leaving the viewport keeps the island and its state (W132)', async () => {
    const load = vi.fn().mockResolvedValue({ default: Counter });
    render(<LazyIsland load={load} props={{ label: 'Count' }} fallback={<span>Loading…</span>} />);
    const observer = MockIntersectionObserver.instances[0]!;
    act(() => observer.trigger(true));
    fireEvent.click(await screen.findByRole('button', { name: 'Count 0' }));
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
    act(() => observer.trigger(false));
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).toBeNull();
    expect(observer.elements.size).toBe(0);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('passes rootMargin to the observer (default 200px)', () => {
    const load = vi.fn().mockResolvedValue({ default: Real });
    render(<LazyIsland load={load} props={{ label: 'a' }} fallback={null} />);
    render(<LazyIsland load={load} props={{ label: 'b' }} fallback={null} rootMargin="480px" />);
    expect(MockIntersectionObserver.instances.map((o) => o.options?.rootMargin)).toEqual([
      '200px',
      '480px',
    ]);
  });

  it('keeps the fallback when load() rejects, without reaching an error boundary', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('ChunkLoadError');
    const load = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();
    render(
      <Boundary onError={onError}>
        <LazyIsland load={load} props={{ label: 'x' }} fallback={<span>Loading…</span>} />
      </Boundary>,
    );
    act(() => MockIntersectionObserver.instances[0]!.trigger(true));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(load).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(screen.queryByText('error boundary')).toBeNull();
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    // M14: a rejected load() was otherwise silent — logged outside production, like qrSvg.
    expect(errorSpy).toHaveBeenCalledWith(
      'LazyIsland: load() rejected, keeping the fallback',
      error,
    );
  });

  it('stays silent in production (M14)', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const load = vi.fn().mockRejectedValue(new Error('ChunkLoadError'));
    render(<LazyIsland load={load} props={{ label: 'x' }} fallback={<span>Loading…</span>} />);
    act(() => MockIntersectionObserver.instances[0]!.trigger(true));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
