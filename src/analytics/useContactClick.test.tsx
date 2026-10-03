import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ContactLink } from './ContactLink';
import { PARAM_ENUMS } from './track';
import { CONTACT_PLACEMENTS, contactKindOf } from './useContactClick';
import { renderWithIntl } from '@/test/render';

type Entry = Record<string, unknown>;
const pushed = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;

// jsdom has no navigation; a native listener swallows the default action while React's own
// handler (registered on the root) still runs.
async function click(name: string) {
  const link = screen.getByRole('link', { name });
  link.addEventListener('click', (e) => e.preventDefault());
  await userEvent.click(link);
}

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});

describe('contactKindOf', () => {
  it('classifies the three contact schemes and nothing else', () => {
    expect(contactKindOf('tel:+905011240340')).toBe('call');
    expect(contactKindOf('mailto:info@jobsadmire.com?subject=x')).toBe('email');
    expect(contactKindOf('https://wa.me/905011240340?text=Merhaba')).toBe('whatsapp');
    expect(contactKindOf('https://api.whatsapp.com/send?phone=905011240340')).toBe('whatsapp');
    expect(contactKindOf('https://www.instagram.com/jobsadmire')).toBeNull();
    expect(contactKindOf('/iletisim')).toBeNull();
  });
});

describe('ContactLink (W12)', () => {
  it('fires call_click with the placement and the real pathname, nothing else', async () => {
    renderWithIntl(
      <ContactLink href="tel:+905011240340" placement="slimbar">
        Ara
      </ContactLink>,
    );
    await click('Ara');
    // `page` is next/navigation's usePathname (R35) — null outside the App Router → '/'.
    expect(pushed()).toEqual([
      { event: 'call_click', page: '/', locale: 'tr', placement: 'slimbar' },
    ]);
  });

  it('maps wa.me to whatsapp_click and mailto: to email_click, keeping the anchor attributes', async () => {
    renderWithIntl(
      <>
        <ContactLink
          href="https://wa.me/905011240340?text=Merhaba"
          placement="whatsapp_fab"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <span aria-hidden="true">icon</span>
        </ContactLink>
        <ContactLink href="mailto:info@jobsadmire.com" placement="footer">
          info@jobsadmire.com
        </ContactLink>
      </>,
      { locale: 'en' },
    );
    const wa = screen.getByRole('link', { name: 'WhatsApp' });
    expect(wa).toHaveAttribute('target', '_blank');
    expect(wa).toHaveAttribute('rel', 'noopener noreferrer');
    await click('WhatsApp');
    await click('info@jobsadmire.com');
    expect(pushed()).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'en', placement: 'whatsapp_fab' },
      { event: 'email_click', page: '/', locale: 'en', placement: 'footer' },
    ]);
  });

  it('renders a plain anchor and fires nothing for a non-contact href', async () => {
    renderWithIntl(
      <ContactLink href="https://www.instagram.com/jobsadmire" placement="social_rail">
        Instagram
      </ContactLink>,
    );
    await click('Instagram');
    expect(pushed()).toEqual([]);
  });

  it('fires whatsapp_click exactly once on a middle-click (auxclick, button 1) — the click WhatsApp opens in a background tab (Minor 4)', () => {
    renderWithIntl(
      <ContactLink href="https://wa.me/905011240340?text=Merhaba" placement="whatsapp_fab">
        WhatsApp
      </ContactLink>,
    );
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }));
    expect(pushed()).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'whatsapp_fab' },
    ]);
  });

  it('fires nothing on a right-button auxclick (button 2)', () => {
    renderWithIntl(
      <ContactLink href="https://wa.me/905011240340?text=Merhaba" placement="whatsapp_fab">
        WhatsApp
      </ContactLink>,
    );
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 2 }));
    expect(pushed()).toEqual([]);
  });

  it('exposes the closed placement enum — the same tuple track() enforces (never free text)', () => {
    expect(CONTACT_PLACEMENTS).toBe(PARAM_ENUMS.placement);
    expect(CONTACT_PLACEMENTS).toEqual([
      'slimbar',
      'header',
      'footer',
      'social_rail',
      'whatsapp_fab',
      'bottom_bar',
      'form_fallback',
      'page_cta',
      'office_card',
    ]);
  });
});
