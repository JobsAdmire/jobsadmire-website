import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTf } from '@/content/pure';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { renderWithIntl } from '@/test/render';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { designRoles, roleLabelMaps } from '../../_lib/card-view';
import { CARD_IDS, pickLabels } from '../../_lib/ids';
import { CalculatorIsland } from '../CalculatorIsland';
import { getEstimateInputs, resetEstimateInputs } from '../estimate-store';

const track = vi.fn();
vi.mock('@/analytics/track', () => ({ track: (...args: unknown[]) => track(...args) }));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/maliyet-hesaplayici',
}));

// R56: the generated TR bundle is read from disk, never imported.
const bundle = BundleSchema.parse(
  JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'content', 'local', 'bundle.tr.json'), 'utf8'),
  ),
);
const t = makeTf(bundle, 'tr');
const ROLES_D = designRoles(ROLES);
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, t);
const labels = pickLabels(t, CARD_IDS);

const mount = () =>
  renderWithIntl(
    <CalculatorIsland
      locale="tr"
      rateConfig={RATE}
      roles={ROLES_D}
      labels={labels}
      roleLabels={roleLabels}
      industryLabels={industryLabels}
      closeLabel="Kapat"
    />,
    { locale: 'tr' },
  );
const monthly = () => screen.getByTestId('calc-monthly-total');

afterEach(() => {
  resetEstimateInputs();
  track.mockClear();
});

describe('CalculatorIsland', () => {
  it('paints the model at the defaults — welder × 1, full year, other tier (COPY_DELTAS)', () => {
    mount();
    expect(monthly()).toHaveTextContent('60.321 ₺');
    expect(screen.getByTestId('calc-year-total')).toHaveTextContent('751.852 ₺');
    expect(screen.getByRole('slider', { name: t('calc.015') })).toHaveAttribute(
      'aria-valuetext',
      `49.545 ₺ ${t('calc.464')}`,
    );
    // the legal-flagged sample, word for word, at the model floor (W2/W142)
    expect(screen.getByText(t('calc.557'))).toBeInTheDocument();
  });

  it('a headcount preset multiplies the totals and fires calculator_use with the role key', async () => {
    mount();
    await userEvent.click(screen.getByRole('radio', { name: '5' }));
    expect(monthly()).toHaveTextContent('301.605 ₺');
    expect(track).toHaveBeenLastCalledWith('calculator_use', {
      page: '/maliyet-hesaplayici',
      locale: 'tr',
      role: 'welder',
      headcount: 5,
    });
    await userEvent.click(screen.getByRole('checkbox', { name: new RegExp(t('calc.020')) }));
    expect(monthly()).toHaveTextContent('295.255 ₺'); // support is opt-in (W58)
  });

  it('the stepper commits on blur, not per keystroke (W131)', async () => {
    mount();
    const input = screen.getByRole('spinbutton', { name: t('calc.013') });
    await userEvent.clear(input);
    await userEvent.type(input, '12');
    expect(monthly()).toHaveTextContent('60.321 ₺');
    fireEvent.blur(input);
    expect(monthly()).toHaveTextContent('723.852 ₺');
    expect(track).toHaveBeenLastCalledWith(
      'calculator_use',
      expect.objectContaining({ headcount: 12 }),
    );
  });

  it('a 6-month season shows the seasonal note and the season title', async () => {
    mount();
    await userEvent.click(screen.getByRole('radio', { name: t('calc.471') }));
    expect(screen.getByTestId('calc-seasonal')).toHaveTextContent('64.988 ₺');
    expect(screen.getByTestId('calc-total-title')).toHaveTextContent('6 aylık sezon toplamı');
    expect(screen.getByTestId('calc-year-total')).toHaveTextContent('389.926 ₺');
  });

  it('a role change resets the salary to that role’s floor and is tracked by key', async () => {
    mount();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: t('calc.012') }), 'cook');
    expect(getEstimateInputs()).toMatchObject({ roleKey: 'cook', grossSalary: null });
    expect(monthly()).toHaveTextContent('60.875 ₺'); // the cook's band floor 50,000
    expect(track).toHaveBeenLastCalledWith(
      'calculator_use',
      expect.objectContaining({ role: 'cook' }),
    );
    expect(screen.getByRole('slider', { name: t('calc.015') })).toHaveAttribute(
      'aria-valuetext',
      `50.000 ₺ ${t('calc.464')}`,
    );
  });

  it('the SGK tier is validated state: a chip sets it and the rate follows (W144)', async () => {
    mount();
    await userEvent.click(screen.getByRole('radio', { name: t('calc.466') }));
    expect(getEstimateInputs().sgkTier).toBe('manufacturing');
    expect(monthly()).toHaveTextContent('58.835 ₺');
    expect(screen.getAllByText('%18,75').length).toBeGreaterThan(0);
  });
});
