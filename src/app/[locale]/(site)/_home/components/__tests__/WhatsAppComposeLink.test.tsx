import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { waLink } from '@/lib/contact';
import { renderWithIntl } from '@/test/render';
import { WhatsAppComposeLink } from '../WhatsAppComposeLink';

const TEXT = 'Aylık bordro: 603.210 ₺';

beforeEach(() => {
  window.dataLayer = [];
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('WhatsAppComposeLink (W95/W76)', () => {
  it('renders the bare chat href — the visitor-chosen text never sits in the DOM', () => {
    renderWithIntl(
      <WhatsAppComposeLink number="905011240340" text={TEXT}>
        Gönder
      </WhatsAppComposeLink>,
    );
    const link = screen.getByRole('link', { name: 'Gönder' });
    expect(link).toHaveAttribute('href', 'https://wa.me/905011240340');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.outerHTML).not.toContain('603');
  });

  it('composes the prefilled URL on click, opens it noopener and fires whatsapp_click (page_cta)', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderWithIntl(
      <WhatsAppComposeLink number="905011240340" text={TEXT}>
        Gönder
      </WhatsAppComposeLink>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Gönder' }));
    expect(open).toHaveBeenCalledWith(waLink('905011240340', TEXT), '_blank', 'noopener');
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'whatsapp_click',
      locale: 'tr',
      placement: 'page_cta',
    });
  });

  it('a middle click reaches the bare chat and still counts', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderWithIntl(
      <WhatsAppComposeLink number="905011240340" text={TEXT}>
        Gönder
      </WhatsAppComposeLink>,
    );
    fireEvent(
      screen.getByRole('link', { name: 'Gönder' }),
      new MouseEvent('auxclick', { bubbles: true, button: 1 }),
    );
    expect(open).not.toHaveBeenCalled();
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'whatsapp_click',
      placement: 'page_cta',
    });
  });
});
