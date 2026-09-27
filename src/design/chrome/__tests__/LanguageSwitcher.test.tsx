import { screen } from '@testing-library/react';
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
    // The R58 fallback is next-intl's <Link locale="tr">, which always carries the prefix when
    // `locale` is passed (`forcePrefix`); the middleware folds `/tr` back to `/` — WP1 behaviour.
    expect(screen.getByRole('link', { name: 'Türkçe' })).toHaveAttribute('href', '/tr');
  });
});
