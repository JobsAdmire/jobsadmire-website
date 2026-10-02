import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useActionState, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { RadioChips } from '../RadioChips';

const options = [
  { value: 'general', label: 'General' },
  { value: 'skilled', label: 'Skilled' },
  { value: 'specialist', label: 'Specialist' },
];

function Harness({ initial = 'general' }: { initial?: string | null }) {
  const [value, setValue] = useState<string | null>(initial);
  return (
    <form>
      <RadioChips name="role" legend="Role" options={options} value={value} onChange={setValue} />
    </form>
  );
}

/** The forms kernel's shape (FormShell): `useActionState` around a function `action`, so React 19
 *  resets the form after every action — the failed-submit path included — and re-renders the
 *  fields with the action's state. */
function ActionHarness() {
  const [value, setValue] = useState<string | null>('general');
  const [runs, formAction] = useActionState(async (n: number) => n + 1, 0);
  return (
    <form action={formAction} data-testid="action-form">
      <RadioChips name="role" legend="Role" options={options} value={value} onChange={setValue} />
      <output data-testid="runs">{runs}</output>
      <button type="submit">Send</button>
    </form>
  );
}

describe('RadioChips', () => {
  // Final pass B4 (W190 A1c): the design's headcount quick-pick chips at ≤ 700 px
  // (`.ja-cc-hchips`: `grid-template-columns: repeat(4, 1fr)`, 7 px gaps) — equal columns for
  // however many chips, each chip full-width and centred; the 44 px target stays (D20 over the
  // design's 40). An additive `stretch` prop. W216 (3): the fieldset spans its container too, or a
  // flex parent would size the grid to 4 × the widest chip.
  it('stretch: equal-column grid ≤ 700 px with full-width centred chips; nothing without it (B4)', () => {
    const { container, unmount } = render(
      <RadioChips
        name="n"
        legend="Headcount"
        options={options}
        value="general"
        onChange={() => {}}
        stretch
      />,
    );
    expect(container.querySelector('fieldset')).toHaveClass('max-md:w-full');
    const row = container.querySelector('[role="radiogroup"] > div')!;
    expect(row).toHaveClass(
      'flex',
      'flex-wrap',
      'gap-2',
      'max-md:grid',
      'max-md:grid-flow-col',
      'max-md:auto-cols-fr',
      'max-md:gap-[7px]',
    );
    for (const label of container.querySelectorAll('label'))
      expect(label).toHaveClass('max-md:flex');
    for (const chip of container.querySelectorAll('label > span'))
      expect(chip).toHaveClass(
        'min-h-[44px]',
        'max-md:w-full',
        'max-md:justify-center',
        'max-md:px-2',
      );
    unmount();
    const { container: plain } = render(<Harness />);
    expect(plain.innerHTML).not.toMatch(/max-md:/);
  });

  it('is a labelled radiogroup of native radios', async () => {
    render(<Harness />);
    const group = screen.getByRole('radiogroup', { name: 'Role' });
    expect(within(group).getByRole('radio', { name: 'General' })).toBeChecked();
    await userEvent.click(within(group).getByRole('radio', { name: 'Skilled' }));
    expect(within(group).getByRole('radio', { name: 'Skilled' })).toBeChecked();
    expect(within(group).getByRole('radio', { name: 'General' })).not.toBeChecked();
  });

  it('submits under `name` like any radio, so it can sit inside a FormShell', () => {
    render(<Harness initial="specialist" />);
    const checked = document.querySelector<HTMLInputElement>('input[name="role"]:checked')!;
    expect(checked.value).toBe('specialist');
  });

  it('starts with nothing selected when value is null', () => {
    render(<Harness initial={null} />);
    expect(document.querySelector('input[name="role"]:checked')).toBeNull();
  });

  it('hides the legend visually but not from AT when asked', () => {
    render(
      <RadioChips
        name="x"
        legend="Hidden legend"
        legendHidden
        options={options}
        value={null}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('radiogroup', { name: 'Hidden legend' })).toBeInTheDocument();
    expect(screen.getByText('Hidden legend')).toHaveClass('sr-only');
  });

  it('keeps the chosen radio through a form reset — what React 19 does after a form action (W198)', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('radio', { name: 'Skilled' }));
    const form = document.querySelector('form')!;
    act(() => form.reset());
    expect(screen.getByRole('radio', { name: 'Skilled' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'General' })).not.toBeChecked();
  });

  it('keeps the chosen radio after a function action settles and the form re-renders (W198)', async () => {
    render(<ActionHarness />);
    await userEvent.click(screen.getByRole('radio', { name: 'Specialist' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(screen.getByTestId('runs')).toHaveTextContent('1'));
    expect(screen.getByRole('radio', { name: 'Specialist' })).toBeChecked();
    expect(document.querySelector<HTMLInputElement>('input[name="role"]:checked')?.value).toBe(
      'specialist',
    );
  });
  it('keeps keyboard focus on the chosen radio — why W198 syncs defaultChecked instead of remounting', async () => {
    render(<Harness />);
    const skilled = screen.getByRole('radio', { name: 'Skilled' });
    await userEvent.click(skilled);
    expect(skilled).toBeChecked();
    expect(skilled).toHaveFocus();
  });
});
