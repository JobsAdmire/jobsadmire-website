import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { designRoles, roleLabelMaps } from '../../_lib/card-view';
import { ESTIMATE_FIELDS } from '../../_lib/estimate-inputs';
import { RECAP_IDS, SHEET_IDS, pickLabels } from '../../_lib/ids';
import {
  getEstimateInputs,
  resetEstimateInputs,
  setEstimateInputs,
  subscribeEstimate,
} from '../estimate-store';
import { QuoteButton } from '../QuoteButton';
import { QuoteSheetHost } from '../QuoteSheetHost';
import { resetQuote } from '../quote-store';

const asId = (id: string) => id;
const ROLES_D = designRoles(ROLES);
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, asId);
const hostProps = (action: (p: FormActionState, d: FormData) => Promise<FormActionState>) => ({
  action,
  locale: 'tr' as const,
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  contact: { phone: '+905011240340', email: 'info@jobsadmire.com' },
  countries: [{ value: 'TR', label: 'Türkiye' }],
  roles: ROLES_D,
  rateConfig: RATE,
  roleLabels,
  industryLabels,
  cardLabels: {
    perWorker: 'işçi başına',
    fullYear: 'Tam yıl',
    firstYear: 'İlk yıl toplamı',
    perMonthSuffix: '/ ay',
  },
  recapLabels: pickLabels(asId, RECAP_IDS),
  labels: { ...pickLabels(asId, SHEET_IDS), close: 'Kapat' },
  loadingLabel: 'Açılıyor…',
});

afterEach(() => {
  resetEstimateInputs();
  resetQuote();
});

describe('the estimate store', () => {
  it('clamps patches and notifies subscribers once per set', () => {
    let calls = 0;
    const off = subscribeEstimate(() => (calls += 1));
    setEstimateInputs({ headcount: 9999, turkishStaff: -3, months: 9 });
    expect(getEstimateInputs()).toMatchObject({
      headcount: 500,
      turkishStaff: 0,
      months: 9,
      roleKey: 'welder',
    });
    expect(calls).toBe(1);
    off();
    setEstimateInputs({ headcount: 2 });
    expect(calls).toBe(1);
  });
});

describe('the quote sheet (W3)', () => {
  it('stays unmounted until a quote button asks, then shows the recap, the form and the hidden estimate', async () => {
    setEstimateInputs({ roleKey: 'cook', headcount: 5 });
    const action = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
    renderWithIntl(
      <>
        <QuoteButton label="Teklif" testId="open" />
        <QuoteSheetHost {...hostProps(action)} />
      </>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(screen.getByTestId('open'));
    const dialog = await screen.findByRole('dialog');
    // cook × 5 at the band floor 50,000: 5 × 60,875 = 304,375 a month
    expect(within(dialog).getByTestId('recap-card')).toHaveTextContent('304.375 ₺');
    expect(within(dialog).getByText(tr.sys.calc.quote.attached)).toBeInTheDocument();
    const form = within(dialog).getByTestId('calc-quote-form');
    expect(form).toHaveAttribute('data-form-key', 'calculator');
    const hidden = (name: string) =>
      form.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value;
    expect(hidden(ESTIMATE_FIELDS.role)).toBe('cook');
    expect(hidden(ESTIMATE_FIELDS.headcount)).toBe('5');
    expect(within(form).getByRole('checkbox')).toHaveAttribute('name', 'consent'); // W79
    expect(within(form).getByRole('combobox')).toHaveAttribute('name', 'country');
  });

  it('the fallback panel carries the estimate in its click-time WhatsApp text, never in the href (W76/W95)', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    Object.defineProperty(navigator, 'sendBeacon', {
      value: vi.fn(() => true),
      configurable: true,
      writable: true,
    });
    const action = vi.fn(
      async (_prev: FormActionState, data: FormData): Promise<FormActionState> => ({
        status: 'error',
        result: { kind: 'unauthorized' },
        values: { name: String(data.get('name')) },
      }),
    );
    renderWithIntl(
      <>
        <QuoteButton label="Teklif" testId="open" />
        <QuoteSheetHost {...hostProps(action)} />
      </>,
    );
    await userEvent.click(screen.getByTestId('open'));
    const dialog = await screen.findByRole('dialog');
    await userEvent.type(within(dialog).getByLabelText(`${tr.sys.form.labels.name} *`), 'Ayşe');
    await userEvent.click(within(dialog).getByRole('checkbox'));
    await userEvent.click(within(dialog).getByRole('button', { name: 'calc.105' }));
    const panel = await within(dialog).findByTestId('form-fallback');
    expect(panel).toHaveAttribute('data-kind', 'unauthorized');
    const wa = within(panel).getByRole('link', { name: tr.sys.form.fallback.whatsapp });
    expect(wa).toHaveAttribute('href', 'https://wa.me/905011240340');
    await userEvent.click(wa);
    const text = decodeURIComponent(String(open.mock.calls[0][0]).split('?text=')[1]);
    expect(
      text.startsWith(
        'Merhaba JobsAdmire, maliyet hesaplayıcıyı kullandım: 1 × calc.555, brüt 49.545 ₺, 12 aylık sözleşme.',
      ),
    ).toBe(true);
    expect(text).toContain('Ayşe');
    open.mockRestore();
    Reflect.deleteProperty(navigator, 'sendBeacon');
  });
});
