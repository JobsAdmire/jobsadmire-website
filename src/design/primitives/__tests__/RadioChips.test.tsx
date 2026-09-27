import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
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
});
