import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { collisionsInTree } from '@/test/class-collisions';
import { PostFilter, type PostFilterLabels } from '../_components/PostFilter';
import { RotatingWord } from '../_components/RotatingWord';
import { RotationToggle } from '../_components/RotationToggle';
import { ScrollEnhancements } from '../_components/ScrollEnhancements';
import { POST_LIST_ID, type FilterItem } from '../_lib/filter';
import { rotation } from '../_lib/rotation';
import { scrollArm } from '../_lib/scroll-arm';

const WORDS = ['employers', 'factories', 'hotels'];
const current = () =>
  screen.getByTestId('hero-word-live').querySelector('[data-current]')?.textContent;

/** jsdom has no matchMedia (PausableMarquee's guard reads it the same way). */
function mockReducedMotion(reduce: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduce && query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

describe('RotatingWord + RotationToggle (B-4 — D20, WCAG 2.2.2)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    act(() => rotation.reset());
    Reflect.deleteProperty(window, 'matchMedia');
  });

  it('keeps the first word for assistive tech and rotates only the aria-hidden stack', () => {
    mockReducedMotion(false);
    render(
      <h1>
        Insights for <RotatingWord words={WORDS} />
      </h1>,
    );
    expect(screen.getByTestId('hero-word-static')).toHaveTextContent('employers');
    expect(screen.getByTestId('hero-word-live')).toHaveAttribute('aria-hidden', 'true');
    expect(current()).toBe('employers');
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(current()).toBe('factories');
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      'Insights for employers',
    );
  });

  it('stacks every word in one grid cell, so a rotation never resizes the heading (no CLS)', () => {
    mockReducedMotion(false);
    const { container } = render(<RotatingWord words={WORDS} />);
    const spans = Array.from(screen.getByTestId('hero-word-live').querySelectorAll('span'));
    expect(spans).toHaveLength(3);
    for (const span of spans) expect(span.className).toContain('col-start-1 row-start-1');
    expect(spans.filter((s) => s.className.includes('invisible'))).toHaveLength(2);
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('the toggle — outside the heading — pauses and resumes the rotation', () => {
    mockReducedMotion(false);
    render(
      <>
        <RotatingWord words={WORDS} />
        <RotationToggle pauseLabel="Pause" playLabel="Play" />
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(current()).toBe('employers');
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(current()).toBe('factories');
  });

  it('never rotates under prefers-reduced-motion; the toggle is hidden there by CSS (R20)', () => {
    mockReducedMotion(true);
    render(
      <>
        <RotatingWord words={WORDS} />
        <RotationToggle pauseLabel="Pause" playLabel="Play" />
      </>,
    );
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(current()).toBe('employers');
    expect(screen.getByRole('button', { name: 'Pause' }).className).toContain(
      'motion-reduce:hidden',
    );
  });
});

const ITEMS: FilterItem[] = [
  { key: 'a', category: 'workPermits', text: 'work permit guide excerpt work permits' },
  { key: 'b', category: 'recruitment', text: 'hiring from pakistan excerpt recruitment' },
  { key: 'c', category: 'workPermits', text: 'permit renewals excerpt work permits' },
];
const CATEGORIES = [
  { value: 'workPermits', label: 'Work Permits' },
  { value: 'recruitment', label: 'Recruitment' },
];
const LABELS: PostFilterLabels = {
  search: 'Search articles',
  placeholder: 'Search articles…',
  clear: 'Clear search',
  reset: 'Clear',
  all: 'All',
  topic: 'Topic',
  pickTopic: 'Pick a topic',
  close: 'Close',
  noResults: 'No articles match your search.',
  resultsOne: '{n} article',
  resultsOther: '{n} articles',
};

function renderFilter() {
  return render(
    <>
      <ul id={POST_LIST_ID}>
        {ITEMS.map((it) => (
          <li key={it.key} data-post-key={it.key}>
            {it.key}
          </li>
        ))}
      </ul>
      <PostFilter
        listId={POST_LIST_ID}
        locale="en"
        items={ITEMS}
        categories={CATEGORIES}
        labels={LABELS}
      />
    </>,
  );
}
const row = (key: string) => document.querySelector<HTMLElement>(`[data-post-key="${key}"]`)!;

describe('PostFilter (B-5 — the dormant tools island)', () => {
  it('filters the server-rendered rows by query and announces the count', () => {
    const { container } = renderFilter();
    expect(screen.getByText('3 articles')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search articles' }), {
      target: { value: 'PERMIT' },
    });
    expect(row('a').hidden).toBe(false);
    expect(row('b').hidden).toBe(true);
    expect(row('c').hidden).toBe(false);
    expect(screen.getByText('2 articles')).toBeInTheDocument();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('filters by topic chip and resets both filters', () => {
    renderFilter();
    fireEvent.click(screen.getByLabelText('Recruitment'));
    expect(row('a').hidden).toBe(true);
    expect(row('b').hidden).toBe(false);
    expect(screen.getByText('1 article')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    for (const key of ['a', 'b', 'c']) expect(row(key).hidden).toBe(false);
  });

  it('shows the no-results panel when nothing matches', () => {
    renderFilter();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search articles' }), {
      target: { value: 'zzz' },
    });
    expect(screen.getByTestId('blog-no-results')).toHaveTextContent(
      'No articles match your search.',
    );
    for (const key of ['a', 'b', 'c']) expect(row(key).hidden).toBe(true);
  });

  it('picks a topic from the phone sheet and closes it', () => {
    renderFilter();
    fireEvent.click(screen.getByRole('button', { name: 'Topic' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByLabelText('Recruitment'));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(row('a').hidden).toBe(true);
    expect(row('b').hidden).toBe(false);
  });
});

describe('ScrollEnhancements (B-13)', () => {
  const scrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');
  afterEach(() => {
    Reflect.deleteProperty(document.documentElement, 'scrollHeight');
    if (scrollY) Object.defineProperty(window, 'scrollY', scrollY);
    else Reflect.deleteProperty(window, 'scrollY');
    vi.restoreAllMocks();
  });

  it('renders a decorative progress bar at 0 % and no back-to-top at the top of the page', () => {
    const { container } = render(<ScrollEnhancements backToTopLabel="Back to top" />);
    const bar = screen.getByTestId('reading-progress');
    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('0%');
    expect(screen.queryByTestId('back-to-top')).toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('tracks the scroll and offers back-to-top past 12 %, which moves focus to <main>', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2768, // jsdom's innerHeight is 768 → 2,000 px of scroll
    });
    render(
      <main id="main" tabIndex={-1}>
        <ScrollEnhancements backToTopLabel="Back to top" />
      </main>,
    );
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(
      (screen.getByTestId('reading-progress').firstElementChild as HTMLElement).style.width,
    ).toBe('50%');
    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(document.activeElement).toBe(document.getElementById('main'));
  });
});

describe('scrollArm (B-13: the enhancements load on the first scroll)', () => {
  afterEach(() => scrollArm.reset());

  it('is unarmed on the server and before any scroll; one scroll arms it for good', () => {
    expect(scrollArm.isArmedOnServer()).toBe(false);
    expect(scrollArm.isArmed()).toBe(false);
    const onChange = vi.fn();
    const unsubscribe = scrollArm.subscribe(onChange);
    window.dispatchEvent(new Event('scroll'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(scrollArm.isArmed()).toBe(true);
    unsubscribe();
    window.dispatchEvent(new Event('scroll'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(scrollArm.isArmed()).toBe(true);
  });
});
