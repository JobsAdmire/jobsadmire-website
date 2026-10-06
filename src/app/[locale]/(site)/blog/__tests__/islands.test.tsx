import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { collisionsInTree } from '@/test/class-collisions';
import { BlogTools, type BlogToolsLabels, type TopicOption } from '../_components/BlogTools';
import { IndexState } from '../_components/IndexState';
import { LoadMore } from '../_components/LoadMore';
import { ResultLine } from '../_components/ResultLine';
import { RotatingWord } from '../_components/RotatingWord';
import { RotationToggle } from '../_components/RotationToggle';
import { ScrollEnhancements } from '../_components/ScrollEnhancements';
import { ALL, POST_LIST_ID, type FilterItem } from '../_lib/filter';
import { PAGE_SIZE } from '../_lib/posts';
import { rotation } from '../_lib/rotation';
import { scrollArm } from '../_lib/scroll-arm';

const WORDS = ['employers', 'factories', 'hotels'];
const current = () => screen.getByTestId('hero-word-live').querySelector('[data-current]');

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

describe('RotatingWord + RotationToggle (B-4 — D20, WCAG 2.2.2; S1.4/S1.5)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    act(() => rotation.reset());
    Reflect.deleteProperty(window, 'matchMedia');
  });

  it('keeps the first word for assistive tech and rotates only the aria-hidden word', () => {
    mockReducedMotion(false);
    render(
      <h1>
        Insights for <RotatingWord words={WORDS} />
      </h1>,
    );
    expect(screen.getByTestId('hero-word-static')).toHaveTextContent('employers');
    expect(screen.getByTestId('hero-word-live')).toHaveAttribute('aria-hidden', 'true');
    expect(current()).toHaveTextContent('employers');
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(current()).toHaveTextContent('factories');
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      'Insights for employers',
    );
  });

  it('draws only the current word with its hugging underline; a turned word rises in, the first does not', () => {
    mockReducedMotion(false);
    const { container } = render(<RotatingWord words={WORDS} />);
    const live = screen.getByTestId('hero-word-live');
    expect(live.querySelectorAll('span')).toHaveLength(1);
    expect(current()?.className).toContain('border-b-[5px]');
    expect(current()?.className).not.toContain('ja-wordin'); // painted with the h1 (LCP)
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(live.querySelectorAll('span')).toHaveLength(1);
    expect(current()?.className).toContain('ja-wordin');
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('the icon toggle — outside the heading — pauses the word and marks the hero for the floats', () => {
    mockReducedMotion(false);
    render(
      <section id="hero">
        <RotatingWord words={WORDS} />
        <RotationToggle pauseLabel="Pause" playLabel="Play" targetId="hero" />
      </section>,
    );
    const hero = document.getElementById('hero')!;
    expect(hero.hasAttribute('data-paused')).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(hero.hasAttribute('data-paused')).toBe(true);
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(current()).toHaveTextContent('employers');
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(hero.hasAttribute('data-paused')).toBe(false);
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(current()).toHaveTextContent('factories');
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
    expect(current()).toHaveTextContent('employers');
    expect(screen.getByRole('button', { name: 'Pause' }).className).toContain(
      'motion-reduce:hidden',
    );
  });
});

/** Nine grid rows — the featured post first, as the index lists it since W250 (one grid, no
 *  separate featured card) — so a page of eight leaves one for "Load more". */
const ITEMS: FilterItem[] = [
  { key: 'feat', category: 'workPermits', text: 'the complete permit guide excerpt work permits' },
  { key: 'a', category: 'workPermits', text: 'work permit guide excerpt work permits' },
  { key: 'b', category: 'recruitment', text: 'hiring from pakistan excerpt recruitment' },
  { key: 'c', category: 'workPermits', text: 'permit renewals excerpt work permits' },
  { key: 'd', category: 'compliance', text: 'sgk registration excerpt compliance' },
  { key: 'e', category: 'recruitment', text: 'onboarding checklist excerpt recruitment' },
  { key: 'f', category: 'marketNews', text: 'labour shortage excerpt market news' },
  { key: 'g', category: 'marketNews', text: 'tourism season excerpt market news' },
  { key: 'h', category: 'workPermits', text: 'quota system excerpt work permits' },
];
const TOPICS: TopicOption[] = [
  { value: ALL, label: 'All', dot: 'bg-ink' },
  { value: 'workPermits', label: 'Work Permits', dot: 'bg-blue' },
  { value: 'recruitment', label: 'Recruitment', dot: 'bg-success' },
  { value: 'compliance', label: 'Compliance', dot: 'bg-[#7c3aed]' },
  { value: 'marketNews', label: 'Market News', dot: 'bg-warning' },
];
const FORMS = { one: '{n} article', other: '{n} articles', forQuote: 'for “' };
const LABELS: BlogToolsLabels = {
  search: 'Search articles',
  placeholder: 'Search articles…',
  clear: 'Clear search',
  topic: 'Topic',
  pickTopic: 'Pick a topic',
  close: 'Close',
  language: 'Language',
  results: FORMS,
};

function renderIndex() {
  return render(
    <IndexState locale="en" items={ITEMS} pageSize={PAGE_SIZE}>
      <BlogTools
        labels={LABELS}
        topics={TOPICS}
        langs={[
          { code: 'EN', href: '/en/blog', hrefLang: 'en', current: true },
          { code: 'TR', href: '/blog', hrefLang: 'tr', current: false },
        ]}
      />
      <ResultLine forms={FORMS} topics={TOPICS} clearLabel="Clear" />
      <ul id={POST_LIST_ID}>
        {ITEMS.map((it, i) => (
          <li key={it.key} data-post-key={it.key} hidden={i >= PAGE_SIZE}>
            {it.key}
          </li>
        ))}
      </ul>
      <LoadMore
        listId={POST_LIST_ID}
        moreLabel="Load more articles ↓"
        noResultsLabel="No articles match your search."
      />
    </IndexState>,
  );
}
const row = (key: string) => document.querySelector<HTMLElement>(`[data-post-key="${key}"]`)!;
const visibleKeys = () => ITEMS.map((it) => it.key).filter((key) => !row(key).hidden);
const status = () => screen.getByTestId('blog-tools-status');

describe('the index islands (S1.3, S3.2, M3, M4 — IndexState, BlogTools, LoadMore, ResultLine)', () => {
  it('shows eight (two rows of four, W250), then the rest on "Load more"; the button goes when nothing waits', () => {
    const { container } = renderIndex();
    expect(PAGE_SIZE).toBe(8);
    expect(visibleKeys()).toEqual(['feat', 'a', 'b', 'c', 'd', 'e', 'f', 'g']);
    expect(status()).toHaveTextContent('9 articles'); // every card, the featured one included
    expect(screen.getByTestId('blog-result-line')).toHaveTextContent('9 articles');
    fireEvent.click(screen.getByRole('button', { name: 'Load more articles ↓' }));
    expect(visibleKeys()).toEqual(['feat', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
    expect(screen.queryByTestId('blog-load-more')).toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('filters by query (the design countFor); Escape clears; the line names the query', () => {
    renderIndex();
    const box = screen.getByRole('searchbox', { name: 'Search articles' });
    fireEvent.change(box, { target: { value: 'PERMIT' } });
    expect(visibleKeys()).toEqual(['feat', 'a', 'c', 'h']);
    expect(status()).toHaveTextContent('4 articles for “PERMIT”');
    expect(screen.getByTestId('blog-result-line')).toHaveTextContent('4 articles for “PERMIT”');
    fireEvent.keyDown(box, { key: 'Escape' });
    expect(box).toHaveValue('');
    expect(visibleKeys()).toEqual(['feat', 'a', 'b', 'c', 'd', 'e', 'f', 'g']);
  });

  it('filters by topic chip and resets from the phone line', () => {
    renderIndex();
    fireEvent.click(screen.getByLabelText('Recruitment'));
    expect(visibleKeys()).toEqual(['b', 'e']);
    expect(status()).toHaveTextContent('2 articles · Recruitment');
    fireEvent.click(
      within(screen.getByTestId('blog-result-line')).getByRole('button', { name: 'Clear' }),
    );
    expect(visibleKeys()).toEqual(['feat', 'a', 'b', 'c', 'd', 'e', 'f', 'g']);
    expect(within(screen.getByTestId('blog-result-line')).queryByRole('button')).toBeNull();
  });

  it('shows the no-results panel when nothing matches', () => {
    renderIndex();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search articles' }), {
      target: { value: 'zzz' },
    });
    expect(screen.getByTestId('blog-no-results')).toHaveTextContent(
      'No articles match your search.',
    );
    expect(visibleKeys()).toEqual([]);
    expect(screen.queryByTestId('blog-load-more')).toBeNull();
  });

  it('the featured card filters like any other: a match only it has shows it alone (W250)', () => {
    renderIndex();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search articles' }), {
      target: { value: 'complete' },
    });
    expect(visibleKeys()).toEqual(['feat']);
    expect(screen.queryByTestId('blog-no-results')).toBeNull();
    expect(status()).toHaveTextContent('1 article for “complete”');
  });

  it('the phone topic button opens the sheet: rows with counts, a pick filters and closes it', () => {
    renderIndex();
    const button = screen.getByTestId('blog-topic-button');
    expect(button).toHaveTextContent('All');
    expect(button).toHaveTextContent('9');
    fireEvent.click(button);
    const sheet = screen.getByRole('dialog');
    expect(within(sheet).getByRole('heading', { name: 'Pick a topic' })).toBeInTheDocument();
    const radios = within(sheet).getAllByRole('radio');
    expect(radios).toHaveLength(5);
    expect(within(sheet).getByLabelText(/Work Permits/)).toBeInTheDocument();
    fireEvent.click(within(sheet).getByLabelText(/Market News/));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(visibleKeys()).toEqual(['f', 'g']);
    expect(screen.getByTestId('blog-topic-button')).toHaveTextContent('Market News');
  });

  it('the EN/TR pair links the two indexes, the current one marked', () => {
    renderIndex();
    const group = screen.getByRole('group', { name: 'Language' });
    expect(within(group).getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'page');
    const tr = within(group).getByRole('link', { name: 'TR' });
    expect(tr).toHaveAttribute('href', '/blog');
    expect(tr).toHaveAttribute('hreflang', 'tr');
    expect(tr).not.toHaveAttribute('aria-current');
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
