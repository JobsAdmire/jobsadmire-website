import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { renderWithIntl } from '@/test/render';
import { designRoles, roleLabelMaps } from '../../_lib/card-view';
import { CALC_ARM_EVENT } from '../../_lib/events';
import { CARD_IDS, pickLabels } from '../../_lib/ids';
import { CalculatorLoader, resetCalculatorArm } from '../CalculatorLoader';
import { resetEstimateInputs } from '../estimate-store';

/** jsdom has no IntersectionObserver: this one reports "in view" as soon as it observes, so the
 *  only gate left is the loader's own arming. */
class InViewObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  constructor(private callback: IntersectionObserverCallback) {}
  observe() {
    this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

const ROLES_D = designRoles(ROLES);
const asId = (id: string) => id;
const { roleLabels, industryLabels } = roleLabelMaps(ROLES_D, asId);
const mount = () =>
  renderWithIntl(
    <CalculatorLoader
      locale="tr"
      rateConfig={RATE}
      roles={ROLES_D}
      labels={pickLabels(asId, CARD_IDS)}
      roleLabels={roleLabels}
      industryLabels={industryLabels}
      closeLabel="Kapat"
      fallback={
        <div data-testid="skeleton">
          <button type="button" data-testid="calc-activate">
            activate
          </button>
        </div>
      }
    />,
  );

beforeEach(() => vi.stubGlobal('IntersectionObserver', InViewObserver));
afterEach(() => {
  vi.unstubAllGlobals();
  resetCalculatorArm();
  resetEstimateInputs();
  window.history.replaceState(null, '', '/');
});

describe('CalculatorLoader (W13 amended: the card loads on interaction, not in view)', () => {
  it('keeps the server skeleton and loads nothing until the card is touched', () => {
    mount();
    expect(screen.getByTestId('calc-card')).toHaveAttribute('data-island', 'idle');
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('calc-island')).toBeNull();
  });
  it('arms on the first focus inside the card and swaps the skeleton for the island', async () => {
    mount();
    fireEvent.focus(screen.getByTestId('calc-activate'));
    expect(screen.getByTestId('calc-card')).toHaveAttribute('data-island', 'armed');
    expect(await screen.findByTestId('calc-island')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).toBeNull();
  });
  it('arms when another island asks (CALC_ARM_EVENT) or the page is at #calculator (W17)', async () => {
    mount();
    act(() => {
      window.dispatchEvent(new Event(CALC_ARM_EVENT));
    });
    expect(await screen.findByTestId('calc-island')).toBeInTheDocument();
  });
  it('arms on a hash change to #calculator', async () => {
    mount();
    act(() => {
      window.history.replaceState(null, '', '/#calculator');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(await screen.findByTestId('calc-island')).toBeInTheDocument();
  });
});
