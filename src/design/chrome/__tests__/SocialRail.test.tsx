import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SocialRail } from '../SocialRail';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

// R13: a parsed bundle, never a cast — the rail reads only `settings` (the six social hrefs), no
// string ids: the names are brands, not copy.
const bundle = testBundle({});

describe('SocialRail', () => {
  // N8 (final re-review): the fixed rail (≥1101 px) sat outside every landmark (axe `region`,
  // best-practice).
  it.each([
    ['tr', 'Sosyal medya bağlantıları'],
    ['en', 'Social media links'],
  ] as const)('%s: is a named complementary landmark around the six links (N8)', (locale, name) => {
    renderWithIntl(<SocialRail bundle={bundle} />, { locale });
    const aside = screen.getByRole('complementary', { name });
    expect(aside.tagName).toBe('ASIDE');
    expect(
      within(aside)
        .getAllByRole('link')
        .map((a) => a.getAttribute('aria-label')),
    ).toEqual(['Facebook', 'Instagram', 'WhatsApp', 'Telegram', 'TikTok', 'LinkedIn']);
  });
});
