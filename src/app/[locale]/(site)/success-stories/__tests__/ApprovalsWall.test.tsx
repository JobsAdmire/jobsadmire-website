import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { collisionsInTree } from '@/test/class-collisions';
import { ApprovalsWall } from '../_components/ApprovalsWall';
import type { StoryCardData } from '../_lib/stories';
import type { WallResultCopy } from '../_lib/wall';

const SECTORS = [
  { value: 'all', label: 'Tüm sektörler' },
  { value: 'tourism', label: 'Turizm / Konaklama' },
  { value: 'factory', label: 'Fabrika / Üretim' },
];
// The page passes a server-rendered <EmptyState> here; the island only decides WHEN it shows.
const EMPTY = (
  <div role="status" data-testid="stories-empty">
    İlk onaylar yolda
  </div>
);
const NONE = {
  title: 'Bu sektörde henüz yayınlanmış onay yok',
  body: 'Bize sorun, size bir tanesini gösterelim.',
  reset: 'Tüm sektörleri göster',
};
// The exact tr.json / en.json templates from Cycle 2 (`sys.stories.wall.*`) — plain `{token}`
// strings, never ICU: this island calls no `useTranslations` (W148), so the test renders it
// with the bare `@testing-library/react` `render`, not `renderWithIntl` — a stray hook call
// would throw with no provider mounted, which is the point (a locked-in "no i18n here" proof).
const TR_TEMPLATES: WallResultCopy = {
  showingAll: 'Toplam {count} onay gösteriliyor',
  showingFiltered: '{total} onaydan {shown} tanesi gösteriliyor',
};
const EN_TEMPLATES: WallResultCopy = {
  showingAll: 'Showing all approvals ({count})',
  showingFiltered: 'Showing {shown} of {total} approvals',
};
const CARDS: StoryCardData[] = [
  {
    id: 'AP-2026-118',
    sector: 'tourism',
    sectorLabel: 'Turizm / Konaklama',
    roles: 'Kat görevlileri',
    headcountLabel: '12 çalışma izni',
    monthLabel: 'Haziran 2026',
    place: 'Antalya',
    countries: ['Kırgızistan', 'Pakistan'],
  },
  {
    id: 'AP-2025-063',
    sector: 'factory',
    sectorLabel: 'Fabrika / Üretim',
    roles: 'Makine operatörleri',
    headcountLabel: '8 çalışma izni',
    monthLabel: 'Ağustos 2025',
    place: 'Gaziantep',
    countries: ['Hindistan'],
  },
];

const wall = (stories: StoryCardData[], locale: 'tr' | 'en' = 'tr') =>
  render(
    <ApprovalsWall
      sectors={SECTORS}
      stories={stories}
      locale={locale}
      legend="Sektöre göre filtreleyin"
      resultTemplates={locale === 'tr' ? TR_TEMPLATES : EN_TEMPLATES}
      emptyState={EMPTY}
      noneInSector={NONE}
      approvedLabel="Onaylandı"
    />,
  );

describe('ApprovalsWall (W6, W148)', () => {
  it('renders the chips and the server-rendered empty state when the collection is empty', () => {
    wall([]);
    const group = screen.getByRole('radiogroup', { name: 'Sektöre göre filtreleyin' });
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
    expect(within(group).getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    expect(screen.getByTestId('stories-empty')).toHaveTextContent('İlk onaylar yolda');
    // Nothing to count, nothing to show: no result label, no grid, no per-sector state.
    expect(screen.queryByTestId('stories-result')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stories-grid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stories-none-in-sector')).not.toBeInTheDocument();
  });

  it('keeps the same state whichever chip is picked while the collection is empty', async () => {
    wall([]);
    await userEvent.click(screen.getByRole('radio', { name: 'Fabrika / Üretim' }));
    expect(screen.getByRole('radio', { name: 'Fabrika / Üretim' })).toBeChecked();
    expect(screen.getByTestId('stories-empty')).toBeInTheDocument();
    expect(screen.queryByText(NONE.title)).not.toBeInTheDocument();
  });

  it('renders every card with its resolved labels and the "showing all" line', () => {
    const { container } = wall(CARDS);
    expect(screen.getByTestId('stories-result')).toHaveTextContent('Toplam 2 onay gösteriliyor');
    const cards = within(screen.getByTestId('stories-grid')).getAllByRole('article');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Onaylandı');
    expect(cards[0]).toHaveTextContent('12 çalışma izni');
    expect(cards[0]).toHaveTextContent('Kat görevlileri');
    expect(cards[0]).toHaveTextContent('Haziran 2026');
    expect(cards[0]).toHaveTextContent('Antalya');
    expect(cards[0]).toHaveTextContent('Kırgızistan · Pakistan');
    expect(screen.queryByTestId('stories-empty')).not.toBeInTheDocument();
    // W122 render-side guard: the chips, the result line and every card's composed class
    // strings resolve to at most one utility per CSS property at each variant.
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('filters by sector and shows the per-sector empty state with a reset', async () => {
    wall([CARDS[0]]);
    await userEvent.click(screen.getByRole('radio', { name: 'Fabrika / Üretim' }));
    const none = screen.getByRole('status');
    expect(none).toHaveAttribute('data-testid', 'stories-none-in-sector');
    expect(within(none).getByRole('heading', { level: 3, name: NONE.title })).toBeInTheDocument();
    expect(screen.queryByTestId('stories-grid')).not.toBeInTheDocument();
    await userEvent.click(within(none).getByRole('button', { name: NONE.reset }));
    expect(screen.getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(1);
    expect(screen.getByTestId('stories-result')).toHaveTextContent('Toplam 1 onay gösteriliyor');
  });

  it('counts the filtered subset in the "showing X of N" line', async () => {
    wall(CARDS);
    await userEvent.click(screen.getByRole('radio', { name: 'Turizm / Konaklama' }));
    expect(screen.getByTestId('stories-result')).toHaveTextContent(
      '2 onaydan 1 tanesi gösteriliyor',
    );
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(1);
  });

  it('substitutes the EN templates verbatim when passed, with no i18n provider mounted', () => {
    wall(CARDS, 'en');
    expect(screen.getByTestId('stories-result')).toHaveTextContent('Showing all approvals (2)');
  });
});
