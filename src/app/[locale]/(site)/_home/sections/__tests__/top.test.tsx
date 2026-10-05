import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { homeBundle } from '../../__tests__/fixtures';
import { ChoiceCards } from '../ChoiceCards';
import { Hero } from '../Hero';
import { LiveCaseBar } from '../LiveCaseBar';
import { PoolSection } from '../PoolSection';

const TR = homeBundle('tr');
const EN = homeBundle('en');
const FORM = <div id="proposal" />;

describe('Hero (D26, W1, W6, W10, W17)', () => {
  // W233: v4-hero carries the licensed stock photo, so the image — not the h1 — is the page's one
  // LCP slot (HERO_PHOTO set), and no placeholder is left in the hero.
  it('names the hero photo as the one LCP element; the h1 carries none (D26, W233)', () => {
    const { container } = renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).not.toHaveAttribute('data-lcp-slot');
    expect(h1).toHaveTextContent(
      `${TR.strings['home.018']}${TR.strings['home.019']}${TR.strings['home.020']}`,
    );
    const lcp = container.querySelectorAll('[data-lcp-slot]');
    expect(lcp).toHaveLength(1);
    expect(lcp[0].tagName).toBe('IMG');
    expect(lcp[0]).toHaveAttribute('data-lcp-slot', 'v4-hero');
    expect(lcp[0]).toHaveAttribute('alt', '');
    expect(lcp[0].getAttribute('src')).toContain(encodeURIComponent('/hero/home.jpg'));
    expect(lcp[0].closest('[aria-hidden="true"]')).not.toBeNull(); // decorative
    expect(container.querySelector('[data-placeholder]')).toBeNull();
    expect(container.querySelector('#proposal')).not.toBeNull();
  });

  // Final pass A1 (W184/W185 A1): the design's hero content sits inside its own padding — 20 px
  // at ≤ 460, 48 px at 461–1100 — and in the sections' own box from 1101 (W228: 1240 px with 36 px gutters), not in
  // the section container's 20/48/36 px gutters. The grid and the stats row carry the same box.
  it('the hero grid and the stats row use the hero gutters, never container-site (W185 A1)', () => {
    const { container } = renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    const grid = container.querySelector('#proposal')!.parentElement!.parentElement!;
    const stats = screen.getByTestId('hero-stats');
    for (const row of [grid, stats]) {
      expect(row).toHaveClass(
        'mx-auto',
        'w-full',
        'px-5',
        'xs:px-12',
        'xl:max-w-[var(--container-max)]',
        'xl:px-[var(--gutter)]',
      );
      expect(row).not.toHaveClass('container-site');
    }
    expect(container.querySelector('.container-site')).toBeNull();
  });

  // Final pass A8 (W189 A5, W210 c): the hero slot is wired in cover mode — a fixed height per
  // band, ≥ 10 % above the tallest measured hero in that band (1,109 / 1,653 / 1,455 / 970 /
  // 811 px at ≤ 460 / 461–700 / 701–900 / 901–1100 / ≥ 1101, both locales, final pass), so the
  // photo (licensed stock since W233) never follows the text's height (W187); its wrapper only
  // pins it behind the hero.
  it('wires v4-hero in cover mode with the measured per-band heights (A8)', () => {
    const { container } = renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    const slot = container.querySelector<HTMLElement>('img[data-lcp-slot="v4-hero"]')!;
    expect(slot).toHaveClass('w-full', 'object-cover', 'h-(--cover-h)', 'xl:h-(--cover-h-xl)');
    expect(slot).not.toHaveClass('h-auto');
    expect(slot.style.getPropertyValue('--cover-h')).toBe('1250px');
    expect(slot.style.getPropertyValue('--cover-h-xs')).toBe('1850px');
    expect(slot.style.getPropertyValue('--cover-h-md')).toBe('1650px');
    expect(slot.style.getPropertyValue('--cover-h-lg')).toBe('1100px');
    expect(slot.style.getPropertyValue('--cover-h-xl')).toBe('900px');
    expect(slot.parentElement).toHaveClass('absolute', 'inset-0', 'overflow-hidden');
  });

  it('reads the hero figures from the metrics collection and fills the reply-hours metric', () => {
    renderWithIntl(<Hero locale="en" bundle={EN} form={FORM} />, { locale: 'en' });
    expect(screen.getByText('workers placed')).toBeInTheDocument();
    expect(screen.getByText('Free proposal within 24 hours')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\{[a-zA-Z]+\}/);
  });

  it('the fourth stats cell is the static link to the approvals, hidden at ≤ 460 px (S1.5)', () => {
    renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    const proof = screen.getByTestId('hero-proof');
    expect(within(proof).getByRole('link', { name: TR.strings['home.053'] })).toHaveAttribute(
      'href',
      '/basari-hikayeleri',
    );
    expect(proof).toHaveTextContent(TR.strings['home.054']);
    expect(proof).toHaveClass('max-xs:hidden');
    expect(screen.getByTestId('hero-stats')).toContainElement(proof);
  });

  it('hides the badge and the CTA row at ≤ 460 px by class, never by removal (W10)', () => {
    renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    const cta = screen.getByRole('link', { name: TR.strings['home.022'] });
    expect(cta).toHaveAttribute('href', '#proposal');
    expect(cta.parentElement).toHaveClass('max-xs:hidden');
    expect(screen.getByRole('link', { name: TR.strings['home.023'] })).toHaveAttribute(
      'href',
      '/adaylar',
    );
  });
});

describe('LiveCaseBar (owner 2026-10-05: the design sample, page-local — D23)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the first sample case with the sample tag, the approvals link and a pause toggle', () => {
    renderWithIntl(<LiveCaseBar locale="tr" bundle={TR} />);
    const bar = screen.getByTestId('live-case-bar');
    expect(bar).toHaveTextContent(TR.strings['home.201']);
    expect(bar.querySelector('[data-sample-tag]')).not.toBeNull();
    const line = screen.getByTestId('case-line');
    expect(line).toHaveTextContent(TR.strings['home.275']);
    expect(line).toHaveTextContent(TR.strings['home.280']);
    expect(line).toHaveTextContent('JA-1042');
    expect(line).toHaveTextContent(TR.strings['home.279']);
    expect(line).not.toHaveAttribute('aria-live');
    expect(screen.getByRole('link', { name: TR.strings['home.055'] })).toHaveAttribute(
      'href',
      '/basari-hikayeleri',
    );
    expect(screen.getByRole('button', { name: 'Duraklat' })).toHaveClass('motion-reduce:hidden');
  });

  it('rotates every 4.5 s through the six cases (derived recency through sys) and holds when paused', () => {
    vi.useFakeTimers();
    renderWithIntl(<LiveCaseBar locale="en" bundle={EN} />, { locale: 'en' });
    const line = () => screen.getByTestId('case-line');
    act(() => {
      vi.advanceTimersByTime(4500);
    });
    expect(line()).toHaveTextContent(EN.strings['home.276']);
    expect(line()).toHaveTextContent(EN.strings['home.289']); // "yesterday"
    act(() => {
      vi.advanceTimersByTime(4500);
    });
    expect(line()).toHaveTextContent(EN.strings['home.283']);
    expect(line()).toHaveTextContent('JA-1062');
    expect(line()).toHaveTextContent('4 days ago');
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(13500);
    });
    expect(line()).toHaveTextContent(EN.strings['home.283']);
  });
});

describe('ChoiceCards (≤ 460 px only, W10)', () => {
  it('renders the three doors, shown only below xs', () => {
    renderWithIntl(<ChoiceCards locale="tr" bundle={TR} />);
    expect(screen.getByTestId('choice-cards')).toHaveClass('xs:hidden');
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['#proposal', '/ortak-olun', '/temsilci-dogrulama']);
  });
});

describe('PoolSection (owner 2026-10-05: the design sample, page-local — D23)', () => {
  it('six sample profiles with the sample tag, placeholder photos, the head and footer doors', () => {
    renderWithIntl(<PoolSection locale="tr" bundle={TR} />);
    const pool = screen.getByTestId('pool');
    expect(pool.querySelector('[data-sample-tag]')).not.toBeNull();
    expect(within(pool).getByRole('heading', { level: 2 })).toHaveTextContent(
      TR.strings['home.063'],
    );
    expect(within(pool).getByRole('link', { name: TR.strings['home.064'] })).toHaveAttribute(
      'href',
      '/adaylar',
    );
    // two copies of the six: the second is the loop filler, hidden and inert
    expect(pool.querySelectorAll('[data-pool-card]')).toHaveLength(12);
    const filler = pool.querySelector('[data-testid="pool-track"] > [aria-hidden="true"]')!;
    expect(filler).toHaveAttribute('inert');
    expect(filler.querySelectorAll('[data-pool-card]')).toHaveLength(6);
    const first = pool.querySelector('[data-pool-card="JA-1042"]')!;
    expect(first).toHaveAttribute('href', '/adaylar');
    expect(first.querySelector('[data-placeholder="pool-JA-1042"]')).not.toBeNull();
    expect(first.querySelector('img')).toBeNull(); // never a real photo
    expect(first).toHaveTextContent('Pakistan');
    expect(first).toHaveTextContent(TR.strings['home.222']);
    expect(first).toHaveTextContent(TR.strings['home.229']);
    expect(first).toHaveTextContent('6 yıl');
    expect(first).toHaveTextContent(TR.strings['home.235']);
    expect(first).toHaveTextContent(TR.strings['home.065']);
    expect(pool).toHaveTextContent(TR.strings['home.066']);
    expect(
      within(pool).getByRole('link', { name: TR.strings['home.067'] }).getAttribute('href'),
    ).toBe('/adaylar');
    expect(screen.getByTestId('pool-toggle')).toHaveTextContent('Duraklat');
  });

  it('EN: country names from sourceCountries, years through sys, the toggle pauses the track', () => {
    renderWithIntl(<PoolSection locale="en" bundle={EN} />, { locale: 'en' });
    const card = screen.getByTestId('pool').querySelector('[data-pool-card="JA-1077"]')!;
    expect(card).toHaveTextContent('Uzbekistan');
    expect(card).toHaveTextContent('4 yrs');
    expect(card).toHaveTextContent('Fanuc');
    const track = screen.getByTestId('pool-track');
    expect(track.style.animationPlayState).toBe('');
    fireEvent.click(screen.getByTestId('pool-toggle'));
    expect(track.style.animationPlayState).toBe('paused');
    expect(screen.getByTestId('pool-toggle')).toHaveTextContent('Play');
  });
});
