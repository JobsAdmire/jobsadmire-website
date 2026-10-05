import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { RegisterBrowser, type RegisterLabels } from '../RegisterBrowser';

const labels: RegisterLabels = {
  browse: 'Browse the register',
  note: 'Everyone here is on our payroll and carries a JA- ID.',
  showing: 'Showing',
  tapToChange: 'Tap to change',
  payroll: 'On our payroll — not agents',
  sub: '· all report to the Antalya head office',
  checkId: 'Check an ID',
  columns: ['Person', 'City', 'Representative ID', 'Status'],
};
const views = [
  { key: 'all', label: 'All people', title: 'All authorised people' },
  { key: 'antalya', label: 'Antalya office', title: 'Antalya office' },
  { key: 'karachi', label: 'Karachi office', title: 'Karachi office' },
];

function setup() {
  renderWithIntl(
    <RegisterBrowser labels={labels} views={views} defaultKey="antalya">
      <p data-testid="body">The public register is not open yet</p>
    </RegisterBrowser>,
    { locale: 'en' },
  );
  const panel = screen.getByTestId('verify-register-panel');
  const view = (name: string) => screen.getByRole('button', { name, pressed: name === '' });
  return { panel, view };
}

describe('RegisterBrowser — the register frame without people (S3.2 / M7)', () => {
  it('opens on the Antalya office; a view retitles the panel and is the one pressed', () => {
    const { panel } = setup();
    const title = () => within(panel).getByRole('heading', { level: 3 });
    expect(title()).toHaveTextContent('Antalya office');
    expect(screen.getByRole('button', { name: 'Antalya office' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'All people' }));
    expect(title()).toHaveTextContent('All authorised people');
    expect(screen.getByRole('button', { name: 'All people' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Antalya office' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(within(panel).getByTestId('body')).toBeInTheDocument();
  });

  it('≤ 700: the "Showing" picker is a disclosure over the list, closed until tapped, closing on a pick', () => {
    setup();
    const picker = screen.getByRole('button', { name: /^Showing/ });
    expect(picker).toHaveClass('md:hidden');
    expect(picker).toHaveTextContent('Antalya office');
    expect(picker).toHaveAttribute('aria-expanded', 'false');
    const list = document.getElementById(picker.getAttribute('aria-controls') ?? '')!;
    // closed: hidden below md, a column from 701 px whatever the state
    expect(list.className).toMatch(/(^| )hidden( |$)/);
    expect(list).toHaveClass('md:flex');
    fireEvent.click(picker);
    expect(picker).toHaveAttribute('aria-expanded', 'true');
    expect(list.className).toMatch(/(^| )grid( |$)/);
    fireEvent.click(within(list).getByRole('button', { name: 'Karachi office' }));
    expect(picker).toHaveAttribute('aria-expanded', 'false');
    expect(picker).toHaveTextContent('Karachi office');
  });

  it('draws the column bar for sighted readers only and the payroll pill, sub-line and #check link in the head', () => {
    const { panel } = setup();
    const bar = within(panel).getByText('Person').parentElement!;
    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveTextContent('On our payroll — not agents');
    expect(panel).toHaveTextContent('· all report to the Antalya head office');
    expect(within(panel).getByRole('link', { name: 'Check an ID' })).toHaveAttribute(
      'href',
      '#check',
    );
  });
});
