import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StickyCta } from '@/design/chrome/StickyCtaBar';
import { renderWithIntl } from '@/test/render';
import { FOUNDER_REP, OFFICE_REP } from '../_lib/__tests__/fixtures';

// The page renders its sections through the real local bundle; what varies is the register.
// `getBundle` is the committed LOCAL bundle (no `representatives` key — Phase A) unless a case
// sets v1.1 rows here. `setRequestLocale`/`getTranslations` need a Next request scope (the
// success-stories page test's pattern); the server actions and the record-dialog chunk are not
// part of what this file proves.
const state = vi.hoisted(() => ({ rows: [] as Record<string, unknown>[] }));

vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => (key: string) => key,
}));
vi.mock('next/dynamic', () => ({ default: () => () => null }));
vi.mock('../actions', () => ({ submitFraud: vi.fn(), uploadEvidence: vi.fn() }));
vi.mock('@/content/adapter', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/content/adapter')>();
  const { localBundle } = await import('../_lib/__tests__/bundles');
  return {
    ...real,
    getBundle: async (locale: 'tr' | 'en') =>
      localBundle(locale, state.rows.length ? { representatives: state.rows } : {}),
  };
});
// The real bar renders nothing until the visitor scrolls (a browser fact jsdom never has), so a
// stand-in makes the MOUNT itself observable, with the CTAs the page hands it.
vi.mock('@/design/chrome/StickyCtaBar', () => ({
  StickyCtaBar: ({ ctas }: { ctas: StickyCta[] }) => (
    <div data-testid="sticky-cta-mount">
      {ctas.map((c) => (
        <a key={String(c.href)} href={String(c.href)}>
          {c.label}
        </a>
      ))}
    </div>
  ),
}));

import VerifyPage from '../page';

beforeEach(() => {
  state.rows = [];
});

describe('W202 — the sticky bar waits for the v1.1 register', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(`${locale}: the empty register (Phase A) mounts no StickyCtaBar`, async () => {
      const jsx = await VerifyPage({ params: Promise.resolve({ locale }) });
      renderWithIntl(jsx, { locale });
      expect(screen.getByTestId('verify-empty')).toBeInTheDocument();
      expect(screen.queryByTestId('sticky-cta-mount')).toBeNull();
    });
  }

  it('with published register rows the bar mounts with its two in-page anchors (V-5)', async () => {
    state.rows = [FOUNDER_REP, OFFICE_REP];
    const jsx = await VerifyPage({ params: Promise.resolve({ locale: 'en' }) });
    renderWithIntl(jsx, { locale: 'en' });
    expect(screen.queryByTestId('verify-empty')).toBeNull();
    const bar = screen.getByTestId('sticky-cta-mount');
    expect(Array.from(bar.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual([
      '#check',
      '#report',
    ]);
  });
});
