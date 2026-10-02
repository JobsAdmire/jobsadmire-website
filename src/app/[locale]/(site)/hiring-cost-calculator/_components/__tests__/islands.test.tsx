import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTranslator, type Messages } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTf } from '@/content/pure';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { formatTRY } from '@/lib/format/money';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { designRoles, roleLabelMaps } from '../../_lib/card-view';
import { CALC_ARM_EVENT } from '../../_lib/events';
import { GUIDE_IDS, PASS_IDS, QUOTA_IDS, RECAP_IDS, pickLabels } from '../../_lib/ids';
import { computeQuotaView } from '../../_lib/quota-view';
import { makeQuotaCopy } from '../../_lib/copy';
import { getEstimateInputs, resetEstimateInputs, setEstimateInputs } from '../estimate-store';
import { QuotaLoader } from '../LazyBinders';
import { LiveSgkRate } from '../LiveSgkRate';
import { StepperLook } from '../Lookalikes';
import { PassCheckIsland } from '../PassCheckIsland';
import { QuotaIsland } from '../QuotaIsland';
import { QuotaView } from '../QuotaView';
import { RecapIsland } from '../RecapIsland';
import { SalaryGuideIsland } from '../SalaryGuideIsland';
import { WhatsAppComposeLink } from '../WhatsAppComposeLink';

const track = vi.fn();
// Partial: `contact-kind.ts` (via `useContactClick`) reads the real `PARAM_ENUMS` at import time.
vi.mock('@/analytics/track', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/analytics/track')>()),
  track: (...args: unknown[]) => track(...args),
}));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/maliyet-hesaplayici',
}));

const bundle = BundleSchema.parse(
  JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'content', 'local', 'bundle.tr.json'), 'utf8'),
  ),
);
const t = makeTf(bundle, 'tr');
const ROLES_D = designRoles(ROLES);
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, t);
const quotaLabels = pickLabels(t, QUOTA_IDS);
const WA = 'https://wa.me/905011240340';

afterEach(() => {
  resetEstimateInputs();
  track.mockClear();
});

describe('QuotaIsland (Gate 1)', () => {
  it('answers from the shared store and commits a typed staff count on Enter (W131)', async () => {
    renderWithIntl(
      <QuotaIsland
        variant="desktop"
        locale="tr"
        quotaRatio={RATE.quotaRatio}
        labels={quotaLabels}
      />,
    );
    expect(screen.getByTestId('quota-allowed')).toHaveTextContent('5 yabancı işçi');
    expect(screen.getByTestId('quota-viz-note')).toHaveTextContent(t('calc.558')); // the legal sample
    const input = screen.getByRole('spinbutton', { name: t('calc.142') });
    await userEvent.clear(input);
    await userEvent.type(input, '9{Enter}');
    expect(getEstimateInputs().turkishStaff).toBe(9);
    expect(screen.getByTestId('quota-allowed')).toHaveTextContent('1 yabancı işçi');
    expect(screen.getByTestId('quota-viz-note')).toHaveTextContent(
      '1 tam grup artı 4 artık çalışan — 1 kişi daha bir kontenjan daha açar.',
    );
    expect(screen.getByTestId('quota-vs-plan')).toHaveTextContent(t('calc.429'));
  });
  it('the server fallback shows the island’s first render (DOM-matched, W132)', () => {
    const sys = createTranslator({ locale: 'tr', messages: tr as Messages, namespace: 'sys' });
    const view = computeQuotaView({
      staff: 25,
      headcount: 1,
      ratio: RATE.quotaRatio,
      locale: 'tr',
      labels: quotaLabels,
      copy: makeQuotaCopy(sys),
    });
    const fallback = renderWithIntl(
      <QuotaView
        variant="desktop"
        view={view}
        labels={quotaLabels}
        stepper={<StepperLook value="25" />}
        live={false}
      />,
    );
    const texts = (ids: string[]) => ids.map((id) => screen.getByTestId(id).textContent);
    const ids = ['quota-allowed', 'quota-msg', 'quota-viz-note', 'quota-vs-plan'];
    const before = texts(ids);
    fallback.unmount();
    renderWithIntl(
      <QuotaIsland
        variant="desktop"
        locale="tr"
        quotaRatio={RATE.quotaRatio}
        labels={quotaLabels}
      />,
    );
    expect(texts(ids)).toEqual(before);
    expect(screen.getByTestId('quota-view')).toHaveAttribute('data-live', 'true');
  });
});

describe('QuotaIsland — live regions (QA W221 calc-05)', () => {
  // The verdict box answers a stepper the visitor operates; CalculatorIsland already announces
  // its total through `aria-live="polite"` (l. 385), so the quota answer and the pass verdict do
  // the same — the whole box atomically, on both the desktop card and the phone block.
  it('the desktop answer box and the phone block are polite, atomic live regions', () => {
    const { unmount } = renderWithIntl(
      <QuotaIsland
        variant="desktop"
        locale="tr"
        quotaRatio={RATE.quotaRatio}
        labels={quotaLabels}
      />,
    );
    const box = screen.getByTestId('quota-allowed').parentElement!;
    expect(box).toContainElement(screen.getByTestId('quota-msg'));
    expect(box).toHaveAttribute('aria-live', 'polite');
    expect(box).toHaveAttribute('aria-atomic', 'true');
    unmount();
    renderWithIntl(
      <QuotaIsland
        variant="mobile"
        locale="tr"
        quotaRatio={RATE.quotaRatio}
        labels={quotaLabels}
      />,
    );
    const phone = screen.getByTestId('quota-view-m');
    expect(phone).toHaveAttribute('aria-live', 'polite');
    expect(phone).toHaveAttribute('aria-atomic', 'true');
  });
});

describe('PassCheckIsland', () => {
  const mount = () =>
    renderWithIntl(
      <PassCheckIsland
        locale="tr"
        rateConfig={RATE}
        roles={ROLES_D}
        roleLabels={roleLabels}
        labels={pickLabels(t, PASS_IDS)}
        whatsappNumber="905011240340"
      />,
    );
  it('starts idle with the quota row answered from the store (calc.561 wording)', () => {
    mount();
    expect(screen.getByTestId('pass-verdict')).toHaveAttribute('data-tone', 'idle');
    // QA W221 calc-05: the verdict changes with every answer — a polite, atomic live region
    expect(screen.getByTestId('pass-verdict')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByTestId('pass-verdict')).toHaveAttribute('aria-atomic', 'true');
    expect(screen.getByText(t('calc.561'))).toBeInTheDocument();
    expect(screen.getByText(t('calc.559'))).toBeInTheDocument();
  });
  it('a "no" turns the verdict red; "Send my result" composes the answers only on click (W95)', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    mount();
    await userEvent.click(screen.getAllByRole('radio', { name: t('calc.434') })[0]);
    expect(screen.getByTestId('pass-verdict')).toHaveAttribute('data-tone', 'red');
    expect(screen.getByText(t('calc.447'))).toBeInTheDocument();
    const send = screen.getByTestId('pass-send');
    expect(send).toHaveAttribute('href', WA);
    await userEvent.click(send);
    const text = decodeURIComponent(String(open.mock.calls[0][0]).split('?text=')[1]);
    expect(text).toContain(t('calc.555'));
    expect(text).toContain(`1. ${t('calc.445')} — ${t('calc.434')}`);
    expect(track).toHaveBeenCalledWith('whatsapp_click', {
      page: '/maliyet-hesaplayici',
      locale: 'tr',
      placement: 'page_cta',
    });
    open.mockRestore();
  });
});

describe('SalaryGuideIsland (W2 floor, W59 tier)', () => {
  const mount = () =>
    renderWithIntl(
      <SalaryGuideIsland
        locale="tr"
        roles={ROLES_D}
        rateConfig={RATE}
        labels={pickLabels(t, GUIDE_IDS)}
        roleLabels={roleLabels}
        industryLabels={industryLabels}
        scaleMin={formatTRY(30000, 'tr')}
        scaleMax={formatTRY(78000, 'tr')}
      />,
    );
  it('follows the calculator’s tier and filters by industry', async () => {
    mount();
    expect(screen.getAllByRole('article')).toHaveLength(12);
    // QA W221 calc-03: the employer-cost figure never wraps inside its 390 px card
    const guideLabels = pickLabels(t, GUIDE_IDS);
    const costs = screen.getAllByText(guideLabels.sEmpCost).map((l) => l.nextElementSibling!);
    expect(costs).toHaveLength(12);
    for (const cost of costs) expect(cost).toHaveClass('whitespace-nowrap', 'text-blue-safe');
    const welder = () => screen.getAllByRole('article').find((a) => a.dataset.role === 'welder')!;
    expect(within(welder()).getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    act(() => setEstimateInputs({ sgkTier: 'manufacturing' }));
    expect(welder()).toHaveTextContent('58.835 ₺ – 83.125 ₺');
    await userEvent.click(screen.getByRole('radio', { name: t('calc.552') }));
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });
  it('"Use in calculator" sets the role, arms the card and is tracked by key', async () => {
    const armed = vi.fn();
    window.addEventListener(CALC_ARM_EVENT, armed);
    mount();
    const cook = screen.getAllByRole('article').find((a) => a.dataset.role === 'cook')!;
    await userEvent.click(within(cook).getByRole('button'));
    expect(getEstimateInputs().roleKey).toBe('cook');
    expect(armed).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenLastCalledWith(
      'calculator_use',
      expect.objectContaining({ role: 'cook', headcount: 1 }),
    );
    window.removeEventListener(CALC_ARM_EVENT, armed);
  });
});

describe('RecapIsland, LiveSgkRate, the binders', () => {
  it('follow the store', () => {
    renderWithIntl(
      <>
        <RecapIsland
          locale="tr"
          rateConfig={RATE}
          roles={ROLES_D}
          roleLabels={roleLabels}
          industryLabels={industryLabels}
          cardLabels={pickLabels(t, {
            perWorker: 'calc.463',
            fullYear: 'calc.470',
            firstYear: 'calc.469',
            perMonthSuffix: 'calc.464',
          })}
          labels={pickLabels(t, RECAP_IDS)}
        />
        <LiveSgkRate rates={{ manufacturing: '%18,75', other: '%21,75', none: '%23,75' }} />
      </>,
    );
    expect(screen.getByTestId('recap-total')).toHaveTextContent('751.852 ₺');
    expect(screen.getByText('%21,75')).toBeInTheDocument();
    act(() => setEstimateInputs({ headcount: 5, sgkTier: 'manufacturing' }));
    expect(screen.getByText('%18,75')).toBeInTheDocument();
    expect(screen.getByTestId('recap-total')).toHaveTextContent('3.670.081 ₺');
  });
  it('a binder shows its server fallback until the island is in view (no IntersectionObserver here)', () => {
    renderWithIntl(
      <QuotaLoader
        variant="desktop"
        locale="tr"
        quotaRatio={RATE.quotaRatio}
        labels={quotaLabels}
        fallback={<p>fallback</p>}
      />,
    );
    expect(screen.getByText('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('quota-view')).toBeNull();
  });
});

describe('WhatsAppComposeLink (W95/W76)', () => {
  it('keeps the href bare, composes on click, counts a middle click', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderWithIntl(
      <WhatsAppComposeLink number="905011240340" text="Merhaba · ölçü 5" testId="wa">
        WhatsApp
      </WhatsAppComposeLink>,
    );
    const link = screen.getByTestId('wa');
    expect(link).toHaveAttribute('href', WA);
    await userEvent.click(link);
    expect(open).toHaveBeenCalledWith(
      `${WA}?text=${encodeURIComponent('Merhaba · ölçü 5')}`,
      '_blank',
      'noopener',
    );
    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(track).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenCalledTimes(1);
    open.mockRestore();
  });
});
