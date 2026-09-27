import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClosingCtaBand } from '../ClosingCtaBand';
import { buttonClassName } from '@/design/primitives';
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

  // W128(b), a D20 delta: on the green surface (#12813c) the navy tones' softened white copy and
  // translucent-white face fail contrast (body 3.25:1, inverse CTAs 4.13:1).
  const full = (tone: 'navy' | 'gradient' | 'green') => (
    <ClosingCtaBand
      bundle={bundle}
      locale="tr"
      titleId="x.title"
      bodyId="x.body"
      primary={{ label: 'İşçi talep edin', href: '/hire-workers' }}
      secondary={{ label: 'WhatsApp', href: 'https://wa.me/905011240340', external: true }}
      extra={[{ label: 'Ofisi arayın', href: 'tel:+905011240340' }]}
      ticks={['İŞKUR lisanslı', '24 saat içinde teklif']}
      tone={tone}
    />
  );

  it('green tone: full-white body and ticks, inverse-dark secondary and extra CTAs', () => {
    renderWithIntl(full('green'));
    const body = screen.getByText('Doğrudan görüşün.');
    expect(body).toHaveClass('text-white');
    expect(body).not.toHaveClass('text-white/70');
    const ticks = screen.getByRole('list');
    expect(ticks).toHaveClass('text-white');
    expect(ticks).not.toHaveClass('text-white/75');
    // N1 (Task 5 re-review, W128b): the glyph itself must be full white too — its own
    // `text-success` class used to override the list's inherited `currentColor` (1.51:1).
    const tickIcons = ticks.querySelectorAll('svg');
    expect(tickIcons.length).toBe(2);
    tickIcons.forEach((icon) => {
      expect(icon).toHaveClass('text-white');
      expect(icon).not.toHaveClass('text-success');
    });
    expect(screen.getByRole('link', { name: 'WhatsApp' }).className).toBe(
      buttonClassName('inverse-dark'),
    );
    expect(screen.getByRole('link', { name: 'Ofisi arayın' }).className).toBe(
      buttonClassName('inverse-dark'),
    );
    expect(screen.getByRole('link', { name: 'İşçi talep edin' }).className).toBe(
      buttonClassName('primary'),
    );
  });

  it.each(['navy', 'gradient'] as const)(
    '%s tone keeps the inverse face and the softened copy',
    (tone) => {
      renderWithIntl(full(tone));
      expect(screen.getByText('Doğrudan görüşün.')).toHaveClass('text-white/70');
      const ticks = screen.getByRole('list');
      expect(ticks).toHaveClass('text-white/75');
      // N1: navy/gradient keep the pre-existing glyph colour — only the green band's surface
      // is close enough to it to fail contrast.
      ticks.querySelectorAll('svg').forEach((icon) => {
        expect(icon).toHaveClass('text-success');
      });
      expect(screen.getByRole('link', { name: 'WhatsApp' }).className).toBe(
        buttonClassName('inverse'),
      );
      expect(screen.getByRole('link', { name: 'Ofisi arayın' }).className).toBe(
        buttonClassName('inverse'),
      );
    },
  );
});
