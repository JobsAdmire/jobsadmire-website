import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { SeasonPlanner, type SeasonPlannerProps } from '../SeasonPlanner';

const props: SeasonPlannerProps = {
  heading: <h2>When to start</h2>,
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  nowPrefix: 'Now:',
  rows: [
    {
      key: 'agriculture',
      name: 'Agriculture & greenhouse',
      sub: 'Antalya, Mersin, Konya',
      note: 'Greenhouse note',
      range: 'Peak Sep–Dec · also Mar–May',
      headline: 'To start in September, sign by July',
      peak: [8, 11],
      second: [2, 4],
    },
    {
      key: 'tourism',
      name: 'Tourism & hospitality',
      sub: 'Coastal hotels and resorts',
      note: 'Tourism note',
      range: 'Peak Apr–Oct · also Nov–Dec',
      headline: 'To start in April, sign by February',
      peak: [3, 9],
      second: [10, 11],
    },
  ],
  copy: {
    gridLabel: 'Seasonal demand by month',
    hint: 'Select a row',
    legend: { peak: 'Peak demand', second: 'Secondary season', now: 'This month' },
    cta: 'Start this group →',
  },
};

afterEach(() => {
  vi.useRealTimers();
});

describe('SeasonPlanner (the island)', () => {
  it('shows this month as a browser fact — the pill and one marker per row (R18)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 8, 15, 12));
    const { container } = renderWithIntl(<SeasonPlanner {...props} />, { locale: 'en' });
    expect(screen.getByTestId('season-planner')).toHaveAttribute('data-island', 'ready');
    expect(screen.getByText('Now: Sep 2026')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-now-marker]')).toHaveLength(2);
  });

  it('a row click selects it and answers with its headline and note', async () => {
    const user = userEvent.setup();
    renderWithIntl(<SeasonPlanner {...props} />, { locale: 'en' });
    expect(screen.getByTestId('season-row-agriculture')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('season-headline')).toHaveTextContent(
      'To start in September, sign by July',
    );
    await user.click(screen.getByTestId('season-row-tourism'));
    expect(screen.getByTestId('season-row-tourism')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('season-row-agriculture')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('season-headline')).toHaveTextContent(
      'To start in April, sign by February',
    );
    expect(screen.getByText('Tourism note')).toBeInTheDocument();
  });
});
