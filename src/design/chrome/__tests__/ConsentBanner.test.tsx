import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConsentBanner } from '../ConsentBanner';
import { CONSENT_KEY } from '@/analytics/consent';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { memoryStorage } from '@/test/storage';

const copy = tr.sys.consent;

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage());
  (window as Window & { dataLayer?: unknown[] }).dataLayer = [];
  document.cookie = `${CONSENT_KEY}=; Max-Age=0; Path=/`;
});

describe('ConsentBanner', () => {
  it('opens for a first-time visitor and closes once a choice is stored', async () => {
    renderWithIntl(<ConsentBanner />);
    const sheet = screen.getByRole('region', { name: copy.title });
    expect(within(sheet).getByRole('link', { name: copy.policy })).toHaveAttribute(
      'href',
      '/cerez-politikasi',
    );

    await userEvent.click(within(sheet).getByRole('button', { name: copy.accept }));

    // The store, not an effect, drives this: `writeConsent` dispatches and the sheet re-reads.
    expect(screen.queryByRole('region', { name: copy.title })).toBeNull();
    expect(localStorage.getItem(CONSENT_KEY)).toBe('granted');
  });

  it('records a refusal and stays closed', async () => {
    renderWithIntl(<ConsentBanner />);
    await userEvent.click(screen.getByRole('button', { name: copy.reject }));
    expect(screen.queryByTestId('consent-banner')).toBeNull();
    expect(localStorage.getItem(CONSENT_KEY)).toBe('denied');
  });

  it('never opens for a visitor who has already chosen', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    renderWithIntl(<ConsentBanner />);
    expect(screen.queryByTestId('consent-banner')).toBeNull();
  });
});
