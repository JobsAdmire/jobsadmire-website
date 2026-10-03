import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScrollSpyToc } from '../ScrollSpyToc';

const HEADINGS = [
  { id: 'overview', text: 'Overview' },
  { id: 'documents', text: 'Documents' },
  { id: 'process', text: 'Process' },
];

/** jsdom has no layout: give each heading a top relative to the viewport by id. */
function stubTops(tops: Record<string, number>) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const top = tops[this.id] ?? 0;
    return {
      top,
      bottom: top + 40,
      left: 0,
      right: 0,
      width: 0,
      height: 40,
      x: 0,
      y: top,
      toJSON: () => ({}),
    };
  });
}

afterEach(() => vi.restoreAllMocks());

describe('ScrollSpyToc', () => {
  it('links every heading and marks the last one scrolled past as current', () => {
    stubTops({ overview: -300, documents: 40, process: 900 });
    render(
      <>
        <h2 id="overview">Overview</h2>
        <h2 id="documents">Documents</h2>
        <h2 id="process">Process</h2>
        <ScrollSpyToc
          headings={HEADINGS}
          label="In this article"
          readMinutes={8}
          remainingLabel={(m) => `≈ ${m} min left`}
        />
      </>,
    );
    const nav = screen.getByRole('navigation', { name: 'In this article' });
    const links = nav.querySelectorAll('a');
    expect(links).toHaveLength(3);
    expect(links[1]).toHaveAttribute('href', '#documents');
    expect(links[1]).toHaveAttribute('aria-current', 'location');
    expect(links[0]).not.toHaveAttribute('aria-current');
    // No scroll in jsdom → progress 0 → the whole read time is left.
    expect(screen.getByText('≈ 8 min left')).toBeInTheDocument();
  });

  it('falls back to the first heading when none has been reached', () => {
    stubTops({ overview: 500, documents: 900, process: 1300 });
    render(
      <>
        <h2 id="overview">Overview</h2>
        <h2 id="documents">Documents</h2>
        <h2 id="process">Process</h2>
        <ScrollSpyToc headings={HEADINGS} label="Contents" />
      </>,
    );
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'aria-current',
      'location',
    );
  });

  // W85 (task-6-additions.md): remainingSingular/remainingPlural — an ICU-free path for a
  // server caller, which cannot pass a function prop across the server/client boundary.
  it('renders the remaining time from remainingSingular/remainingPlural when there is no function prop', () => {
    stubTops({ overview: -300, documents: 40, process: 900 });
    render(
      <>
        <h2 id="overview">Overview</h2>
        <h2 id="documents">Documents</h2>
        <h2 id="process">Process</h2>
        <ScrollSpyToc
          headings={HEADINGS}
          label="In this article"
          readMinutes={1}
          remainingSingular="≈ {n} min left"
          remainingPlural="≈ {n} mins left"
        />
      </>,
    );
    // No scroll in jsdom → progress 0 → the whole 1-minute read time is left → singular.
    expect(screen.getByText('≈ 1 min left')).toBeInTheDocument();
  });

  it('picks the plural template once more than one minute is left', () => {
    stubTops({ overview: -300, documents: 40, process: 900 });
    render(
      <>
        <h2 id="overview">Overview</h2>
        <h2 id="documents">Documents</h2>
        <h2 id="process">Process</h2>
        <ScrollSpyToc
          headings={HEADINGS}
          label="Contents"
          readMinutes={8}
          remainingSingular="≈ {n} min left"
          remainingPlural="≈ {n} mins left"
        />
      </>,
    );
    expect(screen.getByText('≈ 8 mins left')).toBeInTheDocument();
  });

  it('prefers the function prop over the string templates when both are given', () => {
    stubTops({ overview: -300, documents: 40, process: 900 });
    render(
      <>
        <h2 id="overview">Overview</h2>
        <h2 id="documents">Documents</h2>
        <h2 id="process">Process</h2>
        <ScrollSpyToc
          headings={HEADINGS}
          label="Contents"
          readMinutes={8}
          remainingLabel={(m) => `${m} min(s) to go`}
          remainingSingular="≈ {n} min left"
          remainingPlural="≈ {n} mins left"
        />
      </>,
    );
    expect(screen.getByText('8 min(s) to go')).toBeInTheDocument();
    expect(screen.queryByText('≈ 8 mins left')).toBeNull();
  });
});
