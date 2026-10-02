import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { TrackChooser, type TrackCard } from '../TrackChooser';

// R35: the event's `page` is next/navigation's real pathname — steered here, the rest of the
// module kept (next-intl's own `useLocale` reads next/navigation too; vitest inlines next-intl).
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/ortak-olun',
}));

type Entry = Record<string, unknown>;
const layer = () => (window as unknown as { dataLayer?: Entry[] }).dataLayer ?? [];

const cards: TrackCard[] = [
  {
    key: 'hr',
    title: 'Türkiye’deki İK ajansları',
    body: 'Müşteriniz sizde kalır.',
    cta: 'Nasıl işlediğini görün →',
  },
  {
    key: 'sourcing',
    title: 'Yurt dışındaki tedarik ortakları',
    body: 'Adaylarınızı bize gönderin.',
    cta: 'Nasıl işlediğini görün →',
  },
  {
    key: 'institute',
    title: 'Eğitim kurumları',
    body: 'Mezunlarınız yerleşsin.',
    cta: 'Nasıl işlediğini görün →',
  },
];
const panels = {
  hr: <div data-testid="panel-hr" />,
  sourcing: <div data-testid="panel-sourcing" />,
  institute: <div data-testid="panel-institute" />,
};
const props = { legend: 'Hangisi sizi tanımlıyor?', applyLabel: 'Başvurunuz', cards, panels };
const radio = (name: string) => screen.getByRole('radio', { name });

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
  window.history.replaceState(null, '', '/ortak-olun');
});

describe('TrackChooser (W26/W96)', () => {
  it('is one labelled radiogroup of three native radios named by the card titles, HR by default', () => {
    renderWithIntl(<TrackChooser {...props} />);
    const group = screen.getByRole('radiogroup', { name: 'Hangisi sizi tanımlıyor?' });
    const radios = within(group).getAllByRole('radio');
    expect(radios.map((r) => r.getAttribute('id'))).toEqual([
      'track-hr',
      'track-sourcing',
      'track-institute',
    ]);
    expect(radio('Türkiye’deki İK ajansları')).toBeChecked();
    expect(radio('Türkiye’deki İK ajansları')).toHaveAccessibleDescription(
      'Müşteriniz sizde kalır.',
    );
    expect(screen.getByTestId('panel-hr')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-sourcing')).toBeNull();
    const detail = screen.getByTestId('partner-track-detail');
    expect(detail).toHaveAttribute('id', 'track-detail');
    expect(detail).toHaveAttribute('data-track', 'hr');
    expect(layer()).toEqual([]);
  });

  it('choosing sourcing shows only its panel, fires partner_track_select once and writes the hash', async () => {
    renderWithIntl(<TrackChooser {...props} />);
    await userEvent.click(radio('Yurt dışındaki tedarik ortakları'));
    expect(radio('Yurt dışındaki tedarik ortakları')).toBeChecked();
    expect(screen.getByTestId('panel-sourcing')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-hr')).toBeNull();
    expect(layer()).toEqual([
      { event: 'partner_track_select', page: '/ortak-olun', locale: 'tr', track: 'sourcing' },
    ]);
    expect(window.location.hash).toBe('#track-sourcing');
  });

  it('choosing the HR card fires nothing — the default panel is not a signal (W67)', async () => {
    renderWithIntl(<TrackChooser {...props} />);
    await userEvent.click(radio('Eğitim kurumları'));
    await userEvent.click(radio('Türkiye’deki İK ajansları'));
    expect(layer().map((e) => e.track)).toEqual(['institute']);
    expect(screen.getByTestId('panel-hr')).toBeInTheDocument();
    expect(window.location.hash).toBe('#track-hr');
  });

  it('remounts the panel on a switch — a typed value never leaks into another track form', async () => {
    renderWithIntl(
      <TrackChooser
        {...props}
        panels={{
          hr: <input aria-label="company" />,
          sourcing: <input aria-label="company" />,
          institute: <div />,
        }}
      />,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'company' }), 'Akdeniz');
    await userEvent.click(radio('Yurt dışındaki tedarik ortakları'));
    expect(screen.getByRole('textbox', { name: 'company' })).toHaveValue('');
  });

  it('a #track-institute deep link preselects the institute on mount, without an event', () => {
    window.history.replaceState(null, '', '/ortak-olun#track-institute');
    renderWithIntl(<TrackChooser {...props} />);
    expect(radio('Eğitim kurumları')).toBeChecked();
    expect(screen.getByTestId('panel-institute')).toBeInTheDocument();
    expect(layer()).toEqual([]);
  });

  it('follows a later hash change until the visitor chooses; then the choice wins', async () => {
    renderWithIntl(<TrackChooser {...props} />);
    act(() => {
      window.history.replaceState(null, '', '/ortak-olun#track-sourcing');
      window.dispatchEvent(new Event('hashchange'));
    });
    expect(radio('Yurt dışındaki tedarik ortakları')).toBeChecked();
    await userEvent.click(radio('Eğitim kurumları'));
    act(() => {
      window.history.replaceState(null, '', '/ortak-olun#tracks'); // e.g. the header CTA
      window.dispatchEvent(new Event('hashchange'));
    });
    expect(radio('Eğitim kurumları')).toBeChecked();
    expect(screen.getByTestId('panel-institute')).toBeInTheDocument();
  });

  it('shows the two step wayfinders on phones only (W10: CSS, not conditional rendering)', () => {
    const { container } = renderWithIntl(<TrackChooser {...props} />);
    const legend = container.querySelector('legend');
    expect(legend).toHaveTextContent('Hangisi sizi tanımlıyor?');
    expect(legend?.className.split(/\s+/)).toContain('md:sr-only');
    expect(screen.getByText('Başvurunuz').className.split(/\s+/)).toContain('md:hidden');
  });
});
