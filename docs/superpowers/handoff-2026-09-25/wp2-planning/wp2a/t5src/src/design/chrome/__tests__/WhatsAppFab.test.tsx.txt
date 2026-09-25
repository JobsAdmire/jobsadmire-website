import { screen } from '@testing-library/react';
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
});
