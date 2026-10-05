import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { collisionsInTree } from '@/test/class-collisions';
import { ApprovalsWall, type WallCopy } from '../_components/ApprovalsWall';
import type { WallCard, WallResultCopy } from '../_lib/wall';

const SECTORS = [
  { value: 'all', label: 'Tüm sektörler' },
  { value: 'hotels', label: 'Otel ve turizm' },
  { value: 'construction', label: 'İnşaat' },
  { value: 'food', label: 'Restoranlar' },
];
// The exact tr.json / en.json templates (`sys.stories.wall.*`) — plain `{token}` strings, never
// ICU: this island calls no `useTranslations` (W148), so the test renders it with the bare
// `@testing-library/react` `render`, not `renderWithIntl` — a stray hook call would throw with no
// provider mounted, which is the point (a locked-in "no i18n here" proof).
const TR_TEMPLATES: WallResultCopy = {
  showingAll: 'Toplam {count} onay gösteriliyor',
  showingFiltered: '{total} onaydan {shown} tanesi gösteriliyor',
};
const EN_TEMPLATES: WallResultCopy = {
  showingAll: 'Showing all approvals ({count})',
  showingFiltered: 'Showing {shown} of {total} approvals',
};
const COPY: WallCopy = {
  legend: 'Sektöre göre filtreleyin',
  approved: 'Onaylandı',
  unit: 'çalışma izni',
  proofShow: 'Kanıtı görüntüle ↓',
  proofHide: 'Kanıtı gizle ↑',
  latestAll: 'En son onaylar',
  latestPrefix: 'En son —',
  swipe: 'Kaydırın →',
  moreShow: 'Tüm onayları göster',
  moreHide: 'Daha az onay göster',
  watermarkNote: 'İsimler otomatik olarak filigranlanır ve karartılır',
  sampleBadge: 'Örnek veri gösteriliyor · CRM akışına ulaşılamıyor',
  noneInSector: {
    title: 'Bu sektörde henüz yayınlanmış onay yok',
    body: 'Bize sorun, size bir tanesini gösterelim.',
    reset: 'Tüm sektörleri göster',
  },
};

/** A card as the page builds it — the frames are server nodes; here, a marked stand-in. */
const card = (id: string, sector: string, sectorLabel: string, n: string): WallCard => ({
  id,
  sector,
  sectorLabel,
  roles: `Roller ${id}`,
  headcount: n,
  monthLabel: 'Ağustos 2025',
  place: 'Kemer, Antalya',
  countries: ['Özbekistan', 'Nepal'],
  docLabel: `Dosyada onay · ${n} işçiyi kapsıyor`,
  frame: <div data-testid={`frame-${id}`} />,
  slideFrame: <div data-testid={`slide-frame-${id}`} />,
});
const NINE: WallCard[] = [
  card('a1', 'hotels', 'Otel ve turizm', '45'),
  card('a2', 'construction', 'İnşaat', '60'),
  card('a3', 'construction', 'İnşaat', '28'),
  card('a4', 'construction', 'İnşaat', '34'),
  card('a5', 'construction', 'İnşaat', '22'),
  card('a6', 'construction', 'İnşaat', '18'),
  card('a7', 'hotels', 'Otel ve turizm', '26'),
  card('a8', 'construction', 'İnşaat', '40'),
  card('a9', 'construction', 'İnşaat', '15'),
];

const wall = (cards: WallCard[], locale: 'tr' | 'en' = 'tr', copy: WallCopy = COPY) =>
  render(
    <ApprovalsWall
      sectors={SECTORS}
      cards={cards}
      locale={locale}
      copy={copy}
      resultTemplates={locale === 'tr' ? TR_TEMPLATES : EN_TEMPLATES}
    />,
  );

const gridItems = () => within(screen.getByTestId('stories-grid')).getAllByRole('listitem');

describe('ApprovalsWall (parity pass — design #cases, W148)', () => {
  it('renders the chips as a navy single-select radiogroup with "All sectors" checked', () => {
    wall(NINE);
    const group = screen.getByRole('radiogroup', { name: COPY.legend });
    expect(within(group).getAllByRole('radio')).toHaveLength(4);
    expect(within(group).getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    // the design's checked chip: #253063 fill, white text (RadioChips face="navy")
    expect(
      within(group).getByText('Tüm sektörler').className.split(' ').includes('bg-indigo'),
    ).toBe(true);
  });

  it('renders every card in the grid with its frame, headcount, unit, roles and meta line', () => {
    const { container } = wall(NINE);
    expect(screen.getByTestId('stories-result')).toHaveTextContent('Toplam 9 onay gösteriliyor');
    const cards = within(screen.getByTestId('stories-grid')).getAllByRole('article');
    expect(cards).toHaveLength(9);
    const first = cards[0];
    expect(within(first).getByTestId('frame-a1')).toBeInTheDocument();
    expect(first).toHaveTextContent('45');
    expect(first).toHaveTextContent('çalışma izni');
    expect(first).toHaveTextContent('Roller a1');
    expect(first).toHaveTextContent('Ağustos 2025');
    expect(first).toHaveTextContent('Kemer, Antalya');
    expect(first).toHaveTextContent('Özbekistan · Nepal');
    // the phone line and document line exist (shown ≤ 700 px only)
    expect(first).toHaveTextContent('Dosyada onay · 45 işçiyi kapsıyor');
    // W122 render-side guard: every composed class string has one utility per property.
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('shows the meta row: the amber sample badge and the watermark pill (hidden on a phone)', () => {
    wall(NINE);
    const meta = screen.getByTestId('stories-meta');
    expect(within(meta).getByTestId('stories-sample-badge')).toHaveTextContent(
      COPY.sampleBadge as string,
    );
    const pill = within(meta).getByText(COPY.watermarkNote);
    expect(pill.className.split(' ')).toContain('max-md:hidden');
  });

  it('drops the sample badge when the copy carries none (real approvals)', () => {
    wall(NINE, 'tr', { ...COPY, sampleBadge: undefined });
    expect(screen.queryByTestId('stories-sample-badge')).not.toBeInTheDocument();
  });

  it('puts the first three cards in the phone slider and hides them from the phone list', () => {
    wall(NINE);
    const slider = screen.getByTestId('stories-slider');
    expect(slider.className.split(' ')).toContain('md:hidden');
    expect(slider).toHaveTextContent('En son onaylar');
    expect(within(slider).getAllByRole('article')).toHaveLength(3);
    expect(within(slider).getByTestId('slide-frame-a1')).toBeInTheDocument();
    const items = gridItems();
    // cards 1–3 ride the slider; 4–7 show in the list; 8–9 wait for "show all"
    expect(items.map((li) => li.className.includes('max-md:hidden'))).toEqual([
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
    ]);
  });

  it('"Tüm onayları göster" opens the rest of the phone list and turns into "show fewer"', async () => {
    wall(NINE);
    const more = screen.getByTestId('stories-more');
    expect(more).toHaveAttribute('aria-expanded', 'false');
    expect(more).toHaveTextContent('Tüm onayları göster');
    await userEvent.click(more);
    expect(more).toHaveAttribute('aria-expanded', 'true');
    expect(more).toHaveTextContent('Daha az onay göster');
    expect(gridItems().map((li) => li.className.includes('max-md:hidden'))).toEqual([
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it('a card toggle opens its proof (data-open) and closes it again', async () => {
    wall(NINE);
    const fourth = within(screen.getByTestId('stories-grid')).getAllByRole('article')[3];
    expect(fourth).toHaveAttribute('data-open', 'false');
    const toggle = within(fourth).getByRole('button', { name: COPY.proofShow });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(fourth).toHaveAttribute('data-open', 'true');
    expect(within(fourth).getByRole('button', { name: COPY.proofHide })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await userEvent.click(within(fourth).getByRole('button', { name: COPY.proofHide }));
    expect(fourth).toHaveAttribute('data-open', 'false');
  });

  it('filters by sector: result line, slider title, no phone list or toggle at ≤ 3 cards', async () => {
    wall(NINE);
    await userEvent.click(screen.getByRole('radio', { name: 'Otel ve turizm' }));
    expect(screen.getByTestId('stories-result')).toHaveTextContent(
      '9 onaydan 2 tanesi gösteriliyor',
    );
    expect(screen.getByTestId('stories-slider')).toHaveTextContent('En son — Otel ve turizm');
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(2);
    expect(screen.getByTestId('stories-grid').className.split(' ')).toContain('max-md:hidden');
    expect(screen.queryByTestId('stories-more')).not.toBeInTheDocument();
  });

  it('shows the per-sector empty state with a reset when a chip has no card', async () => {
    wall(NINE);
    await userEvent.click(screen.getByRole('radio', { name: 'Restoranlar' }));
    const none = screen.getByRole('status');
    expect(none).toHaveAttribute('data-testid', 'stories-none-in-sector');
    expect(
      within(none).getByRole('heading', { level: 3, name: COPY.noneInSector.title }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('stories-grid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stories-slider')).not.toBeInTheDocument();
    await userEvent.click(within(none).getByRole('button', { name: COPY.noneInSector.reset }));
    expect(screen.getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(9);
  });

  it('substitutes the EN templates verbatim when passed, with no i18n provider mounted', () => {
    wall(NINE, 'en');
    expect(screen.getByTestId('stories-result')).toHaveTextContent('Showing all approvals (9)');
  });
});
