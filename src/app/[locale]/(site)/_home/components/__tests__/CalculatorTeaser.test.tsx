import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { presets } from '@/lib/calculator';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { renderWithIntl } from '@/test/render';
import { teaserViews, type TeaserLabels } from '../../lib/teaser';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS } from '../../lib/teaser-keys';
import { CalculatorTeaser, type CalculatorTeaserProps } from '../CalculatorTeaser';
import type { TeaserCardCopy } from '../TeaserCard';

const ROLE_LABEL: Record<string, string> = {
  generalPreset: 'Genel işçi',
  skilledPreset: 'Nitelikli / belgeli',
  specialistPreset: 'Uzman',
};
const labels: TeaserLabels = {
  grossMin: 'Brüt maaş (asgari ücret)',
  grossFloor: (m) => `Brüt maaş (${m} yasal taban)`,
  headcount: (n) => `${n} işçi`,
  estimate: (a) =>
    `Pozisyon: ${a.role}\nİşçi: ${a.headcount}\nAylık: ${a.monthly}\nTek seferlik: ${a.oneOff}`,
};
const roles = presets(ROLES).map((row) => ({ row, label: ROLE_LABEL[row.key] }));
const copy: TeaserCardCopy = {
  per: 'İşçi başına aylık',
  rates: '2026 oranları',
  sgk: 'SGK işveren payı · %21,75',
  support: 'Asgari ücret desteği',
  supportValue: 'Dahil değil — tam hesaplamada ayrıca gösterilir',
  total: 'İşçi başına işveren maliyeti',
  salaryPct: 'Maaş',
  sgkPct: 'SGK ve primler',
  monthlyPayroll: 'aylık bordro',
  oneOff: 'İlk yıl tek seferlik maliyetler',
  whatsapp: "Bu hesabı WhatsApp'tan gönderin",
  more: 'Maliyet dökümünü görün',
  less: 'Dökümü gizleyin',
  disc: 'Hesaplama 2026 asgari ücreti esas alınarak yapılmıştır.',
};
const props: CalculatorTeaserProps = {
  locale: 'tr',
  views: teaserViews({ roles, rateConfig: RATE, locale: 'tr', labels }),
  roles: roles.map(({ row, label }) => ({ key: row.key, label })),
  headcounts: HEADCOUNT_PRESETS.map((value) => ({ value, label: labels.headcount(value) })),
  initialRole: 'generalPreset',
  initialHeadcount: DEFAULT_HEADCOUNT,
  whatsappNumber: '905011240340',
  legends: { roles: 'Pozisyon seviyesi', headcount: 'Kaç işçi?' },
  copy,
  leftTop: <h2>Karar vermeden önce gerçek maliyeti görün</h2>,
  leftBottom: null,
  ctas: null,
};

beforeEach(() => {
  window.dataLayer = [];
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('CalculatorTeaser (the island)', () => {
  it('starts at General × 15 with the model figure and marks itself ready', () => {
    renderWithIntl(<CalculatorTeaser {...props} />);
    expect(screen.getByTestId('calc-teaser')).toHaveAttribute('data-island', 'ready');
    expect(screen.getByTestId('calc-per-worker')).toHaveTextContent('40.214 ₺');
    expect(screen.getByTestId('calc-monthly')).toHaveTextContent('603.210 ₺');
    expect(screen.getByRole('radio', { name: 'Genel işçi' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '15 işçi' })).toBeChecked();
    expect(screen.getByText(copy.supportValue)).toBeInTheDocument();
  });

  it('a headcount chip recomputes and pushes calculator_use with the preset key (W12)', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    await user.click(screen.getByRole('radio', { name: '30 işçi' }));
    expect(screen.getByTestId('calc-monthly')).toHaveTextContent('1.206.421 ₺');
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'calculator_use',
      page: '/',
      locale: 'tr',
      role: 'generalPreset',
      headcount: 30,
    });
  });

  it('a role chip moves the floor and the gross label', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    await user.click(screen.getByRole('radio', { name: 'Nitelikli / belgeli' }));
    expect(screen.getByTestId('calc-per-worker')).toHaveTextContent('60.321 ₺');
    expect(screen.getByText('Brüt maaş (1,5× yasal taban)')).toBeInTheDocument();
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'calculator_use',
      role: 'skilledPreset',
      headcount: 15,
    });
  });

  it('the ≤ 460 px breakdown toggle is a real disclosure over the rows', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    const toggle = screen.getByRole('button', { name: 'Maliyet dökümünü görün' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'calc-rows');
    expect(document.getElementById('calc-rows')).toHaveClass('max-xs:hidden');
    // the design's chevron (`.ja-calc-chev`): decorative, turned over once the rows are open
    const chevron = toggle.querySelector('svg[aria-hidden="true"]');
    expect(chevron).not.toBeNull();
    expect(chevron).not.toHaveClass('rotate-180');
    await user.click(toggle);
    expect(toggle.querySelector('svg[aria-hidden="true"]')).toHaveClass('rotate-180');
    expect(screen.getByRole('button', { name: 'Dökümü gizleyin' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(document.getElementById('calc-rows')).not.toHaveClass('max-xs:hidden');
  });

  it('the estimate link stays the bare chat; the current figures are composed on click (W95)', async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderWithIntl(<CalculatorTeaser {...props} />);
    await user.click(screen.getByRole('radio', { name: '30 işçi' }));
    const link = screen.getByRole('link', { name: "Bu hesabı WhatsApp'tan gönderin" });
    expect(link).toHaveAttribute('href', 'https://wa.me/905011240340');
    fireEvent.click(link);
    expect(decodeURIComponent(String(open.mock.calls[0]?.[0]))).toContain('Aylık: 1.206.421 ₺');
  });
});
