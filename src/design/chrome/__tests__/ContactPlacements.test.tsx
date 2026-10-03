import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { MobileBottomBar } from '../MobileBottomBar';
import { SocialRail } from '../SocialRail';
import { WhatsAppFab } from '../WhatsAppFab';
import { renderWithIntl } from '@/test/render';
import fixture from '../../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. `hire.032` / `home.221` are the two ids these three
// read that the 20-string golden fixture lacks.
const bundle: Bundle = BundleSchema.parse({
  ...fixture,
  strings: { ...fixture.strings, 'hire.032': 'Bizi arayın', 'home.221': "WhatsApp'tan yazın" },
});
const WA = `https://wa.me/${bundle.settings.whatsappNumber}?text=Merhaba%20JobsAdmire%2C%20`;
type Entry = Record<string, unknown>;
const pushed = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;

async function click(link: HTMLElement) {
  link.addEventListener('click', (e) => e.preventDefault());
  await userEvent.click(link);
}

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});

describe('contact placements (W12)', () => {
  it('mobile bottom bar: call_click + whatsapp_click with placement bottom_bar', async () => {
    renderWithIntl(<MobileBottomBar bundle={bundle} />);
    const call = screen.getByRole('link', { name: 'Bizi arayın' });
    expect(call).toHaveAttribute('href', `tel:${bundle.settings.phone}`);
    expect(call).not.toHaveAttribute('target');
    const wa = screen.getByRole('link', { name: "WhatsApp'tan yazın" });
    expect(wa).toHaveAttribute('href', WA);
    expect(wa).toHaveAttribute('target', '_blank');
    await click(call);
    await click(wa);
    expect(pushed()).toEqual([
      { event: 'call_click', page: '/', locale: 'tr', placement: 'bottom_bar' },
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'bottom_bar' },
    ]);
  });

  it('WhatsApp FAB: whatsapp_click with placement whatsapp_fab', async () => {
    renderWithIntl(<WhatsAppFab bundle={bundle} />);
    const fab = screen.getByRole('link', { name: "WhatsApp'tan yazın" });
    expect(fab).toHaveAttribute('href', WA);
    expect(fab.className).toContain('fixed');
    await click(fab);
    expect(pushed()).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'whatsapp_fab' },
    ]);
  });

  it('social rail: only the WhatsApp tile fires (social_rail); the other three stay plain anchors', async () => {
    renderWithIntl(<SocialRail bundle={bundle} />);
    for (const name of ['Facebook', 'Instagram', 'WhatsApp', 'LinkedIn']) {
      const a = screen.getByRole('link', { name });
      expect(a).toHaveAttribute('target', '_blank');
      await click(a);
    }
    expect(pushed()).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'social_rail' },
    ]);
  });
});
