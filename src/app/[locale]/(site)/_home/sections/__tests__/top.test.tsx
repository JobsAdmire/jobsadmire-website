import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { homeBundle, withCollections } from '../../__tests__/fixtures';
import { ChoiceCards } from '../ChoiceCards';
import { Hero } from '../Hero';
import { LiveCaseBar } from '../LiveCaseBar';
import { PoolSection } from '../PoolSection';

const TR = homeBundle('tr');
const EN = homeBundle('en');
const FORM = <div id="proposal" />;

describe('Hero (D26, W1, W6, W10, W17)', () => {
  it('names the h1 as the one LCP element while v4-hero is a placeholder', () => {
    const { container } = renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1).toHaveTextContent(
      `${TR.strings['home.018']}${TR.strings['home.019']}${TR.strings['home.020']}`,
    );
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    expect(container.querySelector('[data-placeholder="v4-hero"]')).not.toBeNull();
    expect(container.querySelector('#proposal')).not.toBeNull();
  });

  // Final pass A1 (W184/W185 A1): the design's hero content sits inside its own padding — 20 px
  // at ≤ 460, 48 px at 461–1100 — and in an 888 px box inside the 960 px wrapper from 1101, not in
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
        'xl:max-w-[960px]',
        'xl:px-9',
      );
      expect(row).not.toHaveClass('container-site');
    }
    expect(container.querySelector('.container-site')).toBeNull();
  });

  it('reads the hero figures from the metrics collection and fills the reply-hours metric', () => {
    renderWithIntl(<Hero locale="en" bundle={EN} form={FORM} />, { locale: 'en' });
    expect(screen.getByText('workers placed')).toBeInTheDocument();
    expect(screen.getByText('Free proposal within 24 hours')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\{[a-zA-Z]+\}/);
  });

  it('hides the proof cell without stories and shows it once stories has rows (W6)', () => {
    const { unmount } = renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    expect(screen.queryByTestId('hero-proof')).toBeNull();
    unmount();
    renderWithIntl(
      <Hero locale="tr" bundle={withCollections(TR, { stories: [{ title: 'x' }] })} form={FORM} />,
    );
    expect(screen.getByTestId('hero-proof').querySelector('a')).toHaveAttribute(
      'href',
      '/basari-hikayeleri',
    );
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

describe('LiveCaseBar (W6/D23)', () => {
  it('renders nothing without signed stories', () => {
    const { container } = renderWithIntl(<LiveCaseBar locale="tr" bundle={TR} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the newest story title and the approvals link once stories has rows', () => {
    renderWithIntl(
      <LiveCaseBar
        locale="tr"
        bundle={withCollections(TR, { stories: [{ title: 'Çalışma izni onaylandı' }] })}
      />,
    );
    expect(screen.getByTestId('live-case-bar')).toHaveTextContent('Çalışma izni onaylandı');
    expect(screen.getByRole('link', { name: TR.strings['home.055'] })).toHaveAttribute(
      'href',
      '/basari-hikayeleri',
    );
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

describe('PoolSection (W6 empty state)', () => {
  it('stands in for the candidate cards with the request door', () => {
    renderWithIntl(<PoolSection locale="tr" bundle={TR} />);
    const empty = screen.getByTestId('pool-empty');
    expect(empty).toHaveAttribute('role', 'status');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Aday profilleri yakında burada' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Aday talep edin →' })).toHaveAttribute(
      'href',
      '/adaylar',
    );
  });
});
