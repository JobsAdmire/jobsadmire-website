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
