import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClosingCtaBand } from '../ClosingCtaBand';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

const bundle = testBundle({
  strings: { 'x.title': 'Bu dönem işçiye ihtiyacınız var mı?', 'x.body': 'Doğrudan görüşün.' },
});

describe('ClosingCtaBand', () => {
  it('renders the copy, the internal primary and the tracked contact CTAs', () => {
    renderWithIntl(
      <ClosingCtaBand
        bundle={bundle}
        locale="tr"
        titleId="x.title"
        bodyId="x.body"
        primary={{ label: 'İşçi talep edin', href: '/hire-workers' }}
        secondary={{
          label: 'WhatsApp',
          href: 'https://wa.me/905011240340?text=Merhaba',
          external: true,
        }}
        extra={[{ label: 'Ofisi arayın', href: 'tel:+905011240340' }]}
        ticks={['İŞKUR lisanslı', '24 saat içinde teklif']}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Bu dönem işçiye ihtiyacınız var mı?' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'İşçi talep edin' })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveClass('text-white');
    expect(screen.getByRole('link', { name: 'Ofisi arayın' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    // W10: the mobile-only ticks are in the DOM and hidden by CSS from md up
    const ticks = screen.getByRole('list');
    expect(ticks).toHaveClass('md:hidden');
    expect(ticks.children).toHaveLength(2);
  });

  it('renders without body, secondary, extras or ticks', () => {
    renderWithIntl(
      <ClosingCtaBand
        bundle={bundle}
        locale="en"
        titleId="x.title"
        primary={{ label: 'Go', href: '/contact' }}
        tone="green"
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/en/contact');
    expect(screen.queryByRole('list')).toBeNull();
  });
});
