import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { FOUNDER_REP, OFFICE_REP } from '../_lib/__tests__/fixtures';

// The page renders its sections through the real local bundle; what varies is the register.
// `getBundle` is the committed LOCAL bundle (no `representatives` key — Phase A; the founder row
// published) unless a case sets v1.1 rows here. `setRequestLocale`/`getTranslations` need a Next request scope (the
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

import VerifyPage from '../page';

beforeEach(() => {
  state.rows = [];
});

describe('the page (parity pass, 2026-10-05)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(`${locale}: hero → structure (founder strip + the empty register frame) → report → the phones-only FAQ, the sticky mini search mounted, no StickyCtaBar`, async () => {
      const jsx = await VerifyPage({ params: Promise.resolve({ locale }) });
      const { container } = renderWithIntl(jsx, { locale });
      const order = ['verify-hero', 'verify-structure', 'verify-report', 'verify-faq'].map((id) =>
        screen.getByTestId(id),
      );
      for (let i = 1; i < order.length; i++)
        expect(
          order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
      // the committed founder row is published (owner): the strip renders, the lead names him
      expect(screen.getByTestId('verify-founder')).toHaveTextContent('Haris Jiva');
      expect(screen.getByTestId('verify-lead')).toHaveTextContent('Haris Jiva');
      // no people: the register frame's one row is the empty register
      expect(screen.getByTestId('verify-empty')).toBeInTheDocument();
      expect(screen.queryByTestId('verify-register')).toBeNull();
      // S0s.1: the design's sticky mini search replaces the anchors bar (W202 retired)
      expect(screen.getByTestId('verify-sticky-search')).toBeInTheDocument();
      expect(screen.queryByTestId('sticky-cta')).toBeNull();
      // no answer card until a query is typed
      expect(container.querySelector('#verify')).toBeNull();
    });
  }

  it('en: a query typed in the hero opens the answer card between the hero and the structure section (S2.1)', async () => {
    const jsx = await VerifyPage({ params: Promise.resolve({ locale: 'en' }) });
    renderWithIntl(jsx, { locale: 'en' });
    const hero = screen.getByTestId('verify-hero');
    fireEvent.change(hero.querySelector('input')!, { target: { value: 'JA-REP-014' } });
    const answer = screen.getByTestId('verify-lookup-result');
    expect(hero).not.toContainElement(answer);
    expect(hero.compareDocumentPosition(answer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      answer.compareDocumentPosition(screen.getByTestId('verify-structure')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // the sticky input mirrors the one query
    expect(screen.getByTestId('verify-sticky-search').querySelector('input')).toHaveValue(
      'JA-REP-014',
    );
  });

  it('with published register rows the frame lists them (v1.1) and the sticky search still mounts', async () => {
    state.rows = [FOUNDER_REP, OFFICE_REP];
    const jsx = await VerifyPage({ params: Promise.resolve({ locale: 'en' }) });
    renderWithIntl(jsx, { locale: 'en' });
    expect(screen.queryByTestId('verify-empty')).toBeNull();
    expect(screen.getByTestId('verify-register')).toBeInTheDocument();
    expect(screen.getByTestId('verify-sticky-search')).toBeInTheDocument();
  });
});
