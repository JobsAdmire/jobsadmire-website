import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhatsAppFab } from '../WhatsAppFab';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

// R13: a parsed bundle, never a cast. The FAB reads one id (home.221); the fixture's 20
// strings gain exactly that one. It renders through T0c's ContactLink, whose hook needs the
// intl provider (`useLocale`) — `renderWithIntl` supplies it, next/navigation's pathname is
// null outside the App Router and falls back to '/'.
const bundle = testBundle({ strings: { 'home.221': "WhatsApp'tan yazın" } });

describe('WhatsAppFab', () => {
  it('sits above a mounted StickyCtaBar (W18)', () => {
    renderWithIntl(<WhatsAppFab bundle={bundle} />);
    const fab = screen.getByRole('link', { name: "WhatsApp'tan yazın" });
    expect(fab.className).toContain('var(--sticky-cta-h,0px)');
    expect(fab).toHaveAttribute('target', '_blank');
  });

  // N8 (final re-review): the fixed FAB sat outside every landmark (axe `region`, best-practice)
  // at 901–1100 px, the one range it shows in — the landmark carries that range itself, so it
  // leaves the accessibility tree with the button everywhere else.
  it.each([
    ['tr', 'WhatsApp kısayolu'],
    ['en', 'WhatsApp shortcut'],
  ] as const)('%s: sits in a named complementary landmark (N8)', (locale, name) => {
    renderWithIntl(<WhatsAppFab bundle={bundle} />, { locale });
    const aside = screen.getByRole('complementary', { name });
    expect(aside.tagName).toBe('ASIDE');
    expect(aside.className.split(' ')).toEqual(
      expect.arrayContaining(['hidden', 'lg:block', 'xl:hidden']),
    );
    expect(within(aside).getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me'),
    );
  });
});
