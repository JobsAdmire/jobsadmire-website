import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { homeBundle } from '../../__tests__/fixtures';
import { ProcessSection } from '../ProcessSection';
import { SeasonSection } from '../SeasonSection';

const TR = homeBundle('tr');
const EN = homeBundle('en');

describe('ProcessSection', () => {
  it('renders the five plain steps (the reply-hours metric filled) and the four sector chips', () => {
    renderWithIntl(<ProcessSection locale="tr" bundle={TR} />);
    const process = screen.getByTestId('process');
    expect(process.querySelectorAll('ol > li')).toHaveLength(5);
    expect(within(process).getAllByRole('heading', { level: 3 })).toHaveLength(5);
    expect(process).toHaveTextContent('24 saat');
    const chips = within(process)
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === '/isci-talebi');
    expect(chips).toHaveLength(4);
    expect(chips[0].parentElement).toHaveClass('max-xs:hidden');
  });
});

describe('SeasonSection — the server fallback', () => {
  it('renders the four rows, row 1 selected, with no "now" (a browser fact, R18)', () => {
    const { container } = renderWithIntl(<SeasonSection locale="tr" bundle={TR} />);
    expect(screen.getByTestId('season-planner')).not.toHaveAttribute('data-island');
    expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(1);
    expect(screen.getByTestId('season-row-agriculture')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('season-row-agriculture')).toHaveTextContent(
      'Antalya, Mersin, Konya',
    );
    expect(screen.getByTestId('season-headline')).toHaveTextContent(
      'Eylül ayında başlamak için Temmuz ayına kadar imzalayın',
    );
    expect(container.querySelector('[data-now-marker]')).toBeNull();
  });

  it('composes the ranges from Intl month names (EN)', () => {
    renderWithIntl(<SeasonSection locale="en" bundle={EN} />, { locale: 'en' });
    expect(screen.getByTestId('season-row-construction')).toHaveTextContent('Peak Mar–Nov');
    expect(screen.getByTestId('season-row-factory')).toHaveTextContent('Peak Jan–Dec');
  });
});
