import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PoolExplorer } from '../_components/PoolExplorer';
import { PoolTools } from '../_components/PoolTools';
import { COPY, en, renderInPool, ROWS } from './pool-fixture';

const WA = 'https://wa.me/905011240340?text=hello';
const avatars = Object.fromEntries(
  ROWS.map((w) => [w.ref, <span key={w.ref} data-avatar={w.ref} />]),
);

function renderPool() {
  return renderInPool(
    <>
      <PoolTools copy={COPY} />
      <PoolExplorer rows={ROWS} avatars={avatars} copy={COPY} waHire={WA} />
    </>,
  );
}
const cardRefs = () =>
  Array.from(screen.getByTestId('pool-grid').querySelectorAll(':scope > li'), (li) =>
    li.querySelector('[data-avatar]')?.getAttribute('data-avatar'),
  );

describe('PoolExplorer (design ll. 617–760)', () => {
  it('shows nine sample cards (desktop step) sorted soonest-available, with the "n of m" pill and load-more', async () => {
    const user = userEvent.setup();
    renderPool();
    expect(cardRefs()).toHaveLength(9);
    expect(cardRefs()[0]).toBe('JA-1058');
    expect(screen.getByText('Showing 9 of 12 matching')).toBeInTheDocument();
    // the card face: ref, trade (h3), the availability pill, rows, tags and the basket button
    const first = screen.getByTestId('pool-grid').querySelector(':scope > li') as HTMLElement;
    expect(within(first).getByRole('heading', { level: 3, name: 'Welder' })).toBeInTheDocument();
    expect(within(first).getByText(en('availworkers.207'))).toBeInTheDocument();
    expect(within(first).getByText(`9 ${en('availworkers.248')} · Factory`)).toBeInTheDocument();
    expect(within(first).getByText(en('availworkers.165'))).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Load more profiles (3 more)' }));
    expect(cardRefs()).toHaveLength(12);
    expect(screen.queryByRole('button', { name: /Load more/ })).toBeNull();
    expect(screen.getByText('Showing 12 of 12 matching')).toBeInTheDocument();
  });

  it('keeps the filter panel collapsed until asked; chips and selects filter, "Clear all" resets', async () => {
    const user = userEvent.setup();
    renderPool();
    const toggle = screen.getByRole('button', { name: new RegExp(en('availworkers.059')) });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('pool-filters-body')).not.toBeVisible();
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'India' }));
    expect(screen.getByRole('button', { name: 'India' })).toHaveAttribute('aria-pressed', 'true');
    expect(cardRefs()).toEqual(['JA-1058', 'JA-1147']);
    expect(screen.getByText('1 active')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(en('availworkers.064')), '8+');
    expect(cardRefs()).toEqual(['JA-1058']);
    await user.click(screen.getByRole('button', { name: en('availworkers.060') }));
    expect(cardRefs()).toHaveLength(9);
  });

  it('shows the designed no-results card, whose "Clear filters" brings the pool back', async () => {
    const user = userEvent.setup();
    renderPool();
    await user.click(screen.getByRole('button', { name: new RegExp(en('availworkers.059')) }));
    await user.click(screen.getByRole('button', { name: en('availworkers.156') }));
    await user.click(screen.getByRole('button', { name: 'Nepal' }));
    const empty = screen.getByTestId('pool-no-results');
    expect(empty).toHaveTextContent(en('availworkers.066'));
    expect(within(empty).getByRole('link', { name: en('availworkers.068') })).toHaveAttribute(
      'href',
      WA,
    );
    await user.click(within(empty).getByRole('button', { name: en('availworkers.069') }));
    expect(cardRefs()).toHaveLength(9);
  });

  it('sorting re-orders the cards (most experience first)', async () => {
    const user = userEvent.setup();
    renderPool();
    await user.selectOptions(screen.getByLabelText(en('availworkers.054')), 'exp');
    expect(cardRefs()[0]).toBe('JA-1162');
  });

  it('"Add to request" toggles the card into the basket and back', async () => {
    const user = userEvent.setup();
    renderPool();
    const add = screen.getAllByRole('button', { name: new RegExp(en('availworkers.250')) })[0];
    expect(add).toHaveAttribute('aria-pressed', 'false');
    await user.click(add);
    expect(add).toHaveAttribute('aria-pressed', 'true');
    expect(add).toHaveTextContent(en('availworkers.249'));
    await user.click(add);
    expect(add).toHaveAttribute('aria-pressed', 'false');
  });
});
