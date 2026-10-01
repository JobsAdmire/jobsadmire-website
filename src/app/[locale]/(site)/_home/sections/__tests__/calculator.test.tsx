import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { homeBundle, withCollections } from '../../__tests__/fixtures';
import { CalculatorStrip } from '../CalculatorStrip';

const TR = homeBundle('tr');
const EN = homeBundle('en');

afterEach(() => {
  vi.useRealTimers();
});

describe('CalculatorStrip — the server fallback the island takes over', () => {
  it('renders General × 15 from the engine with the support stated separately (W58/W142)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-01T09:00:00Z'));
    renderWithIntl(<CalculatorStrip locale="tr" bundle={TR} />);
    // jsdom has no IntersectionObserver, so LazyIsland keeps the server fallback (no data-island)
    expect(screen.getByTestId('calc-teaser')).not.toHaveAttribute('data-island');
    expect(screen.getByTestId('calc-per-worker')).toHaveTextContent('40.214 ₺');
    expect(screen.getByTestId('calc-monthly')).toHaveTextContent('603.210 ₺');
    expect(screen.getByTestId('calc-oneoff')).toHaveTextContent('420.000 ₺');
    expect(screen.getByText(TR.strings['home.082'])).toBeInTheDocument();
    expect(screen.getByText('Dahil değil — tam hesaplamada ayrıca gösterilir')).toBeInTheDocument();
    // legal-flagged, verbatim (W142(b)) — the WP-C sheet carries the model figure beside it
    expect(screen.getByText(TR.strings['home.074'])).toBeInTheDocument();
    expect(screen.getByTestId('calc-rates-badge')).toHaveTextContent(TR.strings['home.079']);
    expect(screen.getByText(TR.strings['home.068'])).toBeInTheDocument();
  });

  it('from reviewDueAt the dated badge hides and the eyebrow drops the year (D17/W150)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-12-21T09:00:00Z'));
    renderWithIntl(<CalculatorStrip locale="en" bundle={EN} />, { locale: 'en' });
    expect(screen.queryByTestId('calc-rates-badge')).toBeNull();
    expect(screen.getByText('Real cost')).toBeInTheDocument();
    expect(screen.queryByText(EN.strings['home.068'])).toBeNull();
  });

  it('the fallback’s estimate link is the bare chat (W95)', () => {
    renderWithIntl(<CalculatorStrip locale="tr" bundle={TR} />);
    const hrefs = [
      ...screen.getByTestId('calc-teaser').querySelectorAll('a[href^="https://wa.me/"]'),
    ].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([`https://wa.me/${TR.settings.whatsappNumber}`]);
  });

  it('renders nothing without rate or preset rows (D17, Task 9 P8)', () => {
    const noRoles = renderWithIntl(
      <CalculatorStrip locale="tr" bundle={withCollections(TR, { calculatorRoles: [] })} />,
    );
    expect(noRoles.container).toBeEmptyDOMElement();
    noRoles.unmount();
    const noRates = renderWithIntl(
      <CalculatorStrip locale="tr" bundle={withCollections(TR, { rateConfig: [] })} />,
    );
    expect(noRates.container).toBeEmptyDOMElement();
  });
});
