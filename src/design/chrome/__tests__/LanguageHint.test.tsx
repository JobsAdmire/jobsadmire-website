import { screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LanguageHint, shouldShowHint } from '../LanguageHint';
import { renderWithIntl } from '@/test/render';

describe('shouldShowHint', () => {
  it('shows once for English browsers on Turkish pages, never after dismissal', () => {
    expect(shouldShowHint('tr', ['en-US', 'en'], null)).toBe(true);
    expect(shouldShowHint('tr', ['tr-TR'], null)).toBe(false);
    expect(shouldShowHint('en', ['en-US'], null)).toBe(false);
    expect(shouldShowHint('tr', ['en-US'], 'off')).toBe(false);
  });

  it('matches the language subtag case-insensitively and ignores later preferences', () => {
    expect(shouldShowHint('tr', ['EN-GB'], null)).toBe(true);
    expect(shouldShowHint('tr', ['de-DE', 'en'], null)).toBe(true);
    expect(shouldShowHint('tr', [], null)).toBe(false);
  });
});

describe('LanguageHint link target', () => {
  // jsdom reports navigator.languages = ['en-US', 'en'], so a TR page is eligible; the
  // dismissal read is inside try/catch (Node ≥ 23 stubs `localStorage` without `getItem`,
  // src/test/storage.ts), so the hint counts as "not dismissed".
  afterEach(() => {
    document.head.querySelectorAll('link[rel="alternate"]').forEach((l) => l.remove());
  });

  it('offers /en (the parent index) without hreflang tags — R58', () => {
    renderWithIntl(<LanguageHint locale="tr" />);
    expect(screen.getByRole('link', { name: 'Switch to English' })).toHaveAttribute('href', '/en');
  });

  it("offers the page's English alternate when the tag exists — W17", () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', 'en');
    link.setAttribute('href', 'https://www.jobsadmire.com/en/blog/seasonal-workforce');
    document.head.appendChild(link);
    renderWithIntl(<LanguageHint locale="tr" />);
    expect(screen.getByRole('link', { name: 'Switch to English' })).toHaveAttribute(
      'href',
      '/en/blog/seasonal-workforce',
    );
  });

  it('keeps the same switch node when the hreflang tag appears after mount (M1)', async () => {
    renderWithIntl(<LanguageHint locale="tr" />);
    const before = screen.getByRole('link', { name: 'Switch to English' });
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', 'en');
    link.setAttribute('href', 'https://www.jobsadmire.com/en/blog/seasonal-workforce');
    document.head.appendChild(link);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Switch to English' })).toHaveAttribute(
        'href',
        '/en/blog/seasonal-workforce',
      );
    });
    // Same DOM node: the fixed sheet must not remount and steal focus once the tag arrives.
    expect(screen.getByRole('link', { name: 'Switch to English' })).toBe(before);
  });
});
