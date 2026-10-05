import { screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { renderWithIntl } from '@/test/render';

function addAlternate(hreflang: string, href: string) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'alternate');
  link.setAttribute('hreflang', hreflang);
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

afterEach(() => {
  document.head.querySelectorAll('link[rel="alternate"]').forEach((l) => l.remove());
});

describe('LanguageSwitcher', () => {
  it('falls back to the parent index when the page carries no hreflang tags (R58)', () => {
    renderWithIntl(<LanguageSwitcher locale="tr" label="Dil" />);
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en');
    expect(screen.getByRole('link', { name: 'Türkçe' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'English' })).not.toHaveAttribute('aria-current');
  });

  it("follows the page's own hreflang tags when they exist (W17)", () => {
    addAlternate('tr', 'https://www.jobsadmire.com/blog/sezonluk-isgucu');
    addAlternate('en', 'https://www.jobsadmire.com/en/blog/seasonal-workforce');
    renderWithIntl(<LanguageSwitcher locale="tr" label="Dil" />);
    const en = screen.getByRole('link', { name: 'English' });
    expect(en).toHaveAttribute('href', '/en/blog/seasonal-workforce');
    expect(en).toHaveAttribute('hreflang', 'en');
    expect(screen.getByRole('link', { name: 'Türkçe' })).toHaveAttribute(
      'href',
      '/blog/sezonluk-isgucu',
    );
  });

  it('uses the tag for one locale and the fallback for the other when only one tag exists', () => {
    addAlternate('en', 'https://www.jobsadmire.com/en/blog/only-in-english');
    renderWithIntl(<LanguageSwitcher locale="en" label="Language" />, { locale: 'en' });
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute(
      'href',
      '/en/blog/only-in-english',
    );
    // M1 fix round: the fallback now goes through next-intl's `getPathname`, which — unlike
    // `<Link locale>`'s `forcePrefix` — resolves the default locale exactly as `localePrefix:
    // 'as-needed'` says: unprefixed. No redirect hop through `/tr` is needed either way, since
    // `localeDetection: false` means a bare `/` is never bounced to a detected locale.
    expect(screen.getByRole('link', { name: 'Türkçe' })).toHaveAttribute('href', '/');
  });

  it('keeps the same pill node when its hreflang tag appears after mount (M1)', async () => {
    renderWithIntl(<LanguageSwitcher locale="tr" label="Dil" />);
    const before = screen.getByRole('link', { name: 'English' });
    addAlternate('en', 'https://www.jobsadmire.com/en/blog/seasonal-workforce');
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute(
        'href',
        '/en/blog/seasonal-workforce',
      );
    });
    // Same DOM node, not a fresh one from an unmount/remount: a focused pill must not lose
    // focus, and assistive tech must not see the element replaced, when the tag arrives.
    expect(screen.getByRole('link', { name: 'English' })).toBe(before);
  });

  // SHARED 2.2 / 3.5 (parity pass): English first everywhere; the header and slim-bar pills show
  // the two-letter codes with the endonym as the accessible name; the footer shows endonyms.
  it('compact pills show EN | TR codes, English first, the endonym as the name', () => {
    renderWithIntl(<LanguageSwitcher locale="tr" label="Dil" />);
    const links = screen.getAllByRole('link');
    expect(links.map((a) => a.textContent)).toEqual(['EN', 'TR']);
    expect(links.map((a) => a.getAttribute('aria-label'))).toEqual(['English', 'Türkçe']);
    expect(screen.getByRole('link', { name: 'Türkçe' })).toHaveClass('bg-ink', 'text-white');
  });

  it('the footer (dark) and panel (block) variants spell the endonyms out, English first', () => {
    const { unmount } = renderWithIntl(<LanguageSwitcher locale="tr" label="Dil" variant="dark" />);
    expect(screen.getAllByRole('link').map((a) => a.textContent)).toEqual(['English', 'Türkçe']);
    expect(screen.getByRole('link', { name: 'Türkçe' })).toHaveClass('bg-blue-safe');
    unmount();
    renderWithIntl(<LanguageSwitcher locale="en" label="Language" variant="slim" />);
    expect(screen.getByRole('link', { name: 'English' })).toHaveClass('bg-white', 'text-night');
  });
});
