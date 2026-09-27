import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from '../Stepper';

const labels = { decrementLabel: 'Fewer', incrementLabel: 'More' };

describe('Stepper', () => {
  it('renders a labelled number input and two labelled buttons', async () => {
    const onChange = vi.fn();
    render(
      <Stepper
        id="headcount"
        label="Headcount"
        value={1}
        onChange={onChange}
        min={1}
        max={500}
        {...labels}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Headcount' });
    expect(input).toHaveValue(1);
    expect(screen.getByRole('button', { name: 'Fewer' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('clamps typed values into [min, max] and steps by `step`', () => {
    const onChange = vi.fn();
    render(
      <Stepper
        id="staff"
        label="Turkish staff"
        value={25}
        onChange={onChange}
        min={0}
        max={5000}
        step={5}
        {...labels}
      />,
    );
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '9999' } });
    expect(onChange).toHaveBeenLastCalledWith(5000);
    fireEvent.click(screen.getByRole('button', { name: 'Fewer' }));
    expect(onChange).toHaveBeenLastCalledWith(20);
  });

  it('disables the increment at max', () => {
    render(
      <Stepper id="h" label="H" value={500} onChange={() => {}} min={1} max={500} {...labels} />,
    );
    expect(screen.getByRole('button', { name: 'More' })).toBeDisabled();
  });
});
