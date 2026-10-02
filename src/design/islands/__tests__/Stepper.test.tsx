import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Stepper, type StepperProps } from '../Stepper';

const labels = { decrementLabel: 'Fewer', incrementLabel: 'More' };

/** A controlled parent, the way a page holds the value; `spy` sees every committed value. */
function Controlled({
  initial,
  spy,
  ...rest
}: { initial: number; spy: (value: number) => void } & Partial<
  Omit<StepperProps, 'value' | 'onChange'>
>) {
  const [value, setValue] = useState(initial);
  return (
    <Stepper
      id="headcount"
      label="Headcount"
      min={1}
      max={500}
      {...labels}
      {...rest}
      value={value}
      onChange={(next) => {
        spy(next);
        setValue(next);
      }}
    />
  );
}

describe('Stepper', () => {
  // Final pass B4 (W190 A1c): the design's calculator headcount row at ≤ 700 px (`.ja-cc-head`):
  // a 50 px / 1fr / 50 px grid with 8 px gaps, full-width 46 px buttons with their own radius and
  // a full-width input with its own border — an additive `stretch` prop, never page selectors.
  const STRETCH_ROW = ['max-md:grid', 'max-md:grid-cols-[50px_1fr_50px]', 'max-md:gap-2'];
  const STRETCH_BTN = ['max-md:h-[46px]', 'max-md:w-full', 'max-md:rounded-input'];
  const STRETCH_INPUT = ['max-md:w-full', 'max-md:rounded-input', 'max-md:border'];

  it('stretch: the ≤ 700 px design grid on the row, the buttons and the input; nothing without it (B4)', () => {
    const { unmount } = render(<Controlled initial={5} spy={vi.fn()} stretch />);
    const input = screen.getByRole('spinbutton');
    expect(input.parentElement).toHaveClass('flex', 'items-stretch', ...STRETCH_ROW);
    for (const b of screen.getAllByRole('button')) expect(b).toHaveClass(...STRETCH_BTN);
    expect(input).toHaveClass('w-20', 'border-y', ...STRETCH_INPUT);
    unmount();
    render(<Controlled initial={5} spy={vi.fn()} />);
    const plain = screen.getByRole('spinbutton');
    for (const el of [plain, plain.parentElement!, ...screen.getAllByRole('button')])
      expect(el.className).not.toMatch(/max-md:/);
  });

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
    const fewer = screen.getByRole('button', { name: 'Fewer' });
    expect(fewer).toHaveAttribute('aria-disabled', 'true');
    expect(fewer).not.toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('clamps a typed value into [min, max] when it is committed, and steps by `step`', () => {
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
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '9999' } });
    expect(onChange).not.toHaveBeenCalled(); // a draft while the field has focus (W131)
    fireEvent.blur(input);
    expect(onChange).toHaveBeenLastCalledWith(5000);
    fireEvent.click(screen.getByRole('button', { name: 'Fewer' }));
    expect(onChange).toHaveBeenLastCalledWith(20);
  });

  it('marks the increment aria-disabled at max, never disabled', () => {
    render(
      <Stepper id="h" label="H" value={500} onChange={() => {}} min={1} max={500} {...labels} />,
    );
    const more = screen.getByRole('button', { name: 'More' });
    expect(more).toHaveAttribute('aria-disabled', 'true');
    expect(more).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Fewer' })).not.toHaveAttribute('aria-disabled');
  });

  it('lets the caret edit through an empty field: 15, End, Backspace ×2, "25", blur → 25', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Controlled initial={15} spy={spy} />);
    const input = screen.getByRole('spinbutton');
    await user.click(input);
    await user.keyboard('{End}{Backspace}{Backspace}');
    expect(input).toHaveValue(null);
    await user.keyboard('25');
    expect(input).toHaveValue(25);
    expect(spy).not.toHaveBeenCalled();
    await user.tab();
    expect(input).toHaveValue(25);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(25);
  });

  it('does not snap a partial entry to min while typing (min 10: "2", "5" → 25 on blur)', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Controlled initial={15} min={10} spy={spy} />);
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.keyboard('2');
    expect(input).toHaveValue(2);
    await user.keyboard('5');
    expect(input).toHaveValue(25);
    expect(spy).not.toHaveBeenCalled();
    await user.tab();
    expect(spy).toHaveBeenLastCalledWith(25);
    expect(input).toHaveValue(25);
  });

  it('reverts a field left empty to the last committed value on blur', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Controlled initial={15} spy={spy} />);
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    expect(input).toHaveValue(null);
    await user.tab();
    expect(input).toHaveValue(15);
    expect(spy).not.toHaveBeenCalled();
  });

  it('clamps an out-of-range entry on blur, not while typing (select-all "600", max 500)', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Controlled initial={15} spy={spy} />);
    const input = screen.getByRole('spinbutton');
    await user.click(input);
    await user.keyboard('{Control>}a{/Control}600');
    expect(input).toHaveValue(600);
    expect(spy).not.toHaveBeenCalled();
    await user.tab();
    expect(input).toHaveValue(500);
    expect(spy).toHaveBeenLastCalledWith(500);
  });

  it('commits on Enter and keeps focus in the field', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Controlled initial={15} spy={spy} />);
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.keyboard('7{Enter}');
    expect(spy).toHaveBeenLastCalledWith(7);
    expect(input).toHaveValue(7);
    expect(input).toHaveFocus();
  });

  it('steps with ArrowUp/ArrowDown and clamps at once; ArrowUp at max stays max', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Controlled initial={500} spy={spy} />);
    const input = screen.getByRole('spinbutton');
    await user.click(input);
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue(500);
    expect(spy).not.toHaveBeenCalled();
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveValue(499);
    expect(spy).toHaveBeenLastCalledWith(499);
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(input).toHaveValue(500);
    expect(spy).toHaveBeenLastCalledWith(500);
  });

  it('keeps focus on a button that reaches its bound; the button then does nothing', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Controlled initial={3} spy={spy} />);
    const fewer = screen.getByRole('button', { name: 'Fewer' });
    await user.click(fewer);
    await user.click(fewer);
    expect(screen.getByRole('spinbutton')).toHaveValue(1);
    expect(fewer).toHaveAttribute('aria-disabled', 'true');
    expect(fewer).not.toBeDisabled();
    expect(fewer).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.click(fewer);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('spinbutton')).toHaveValue(1);
    expect(fewer).toHaveFocus();
  });

  it('reaches the bound from an off-step value (value 3, step 5, min 0 → 0)', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Controlled initial={3} min={0} max={100} step={5} spy={spy} />);
    const fewer = screen.getByRole('button', { name: 'Fewer' });
    expect(fewer).not.toHaveAttribute('aria-disabled');
    await user.click(fewer);
    expect(spy).toHaveBeenLastCalledWith(0);
    expect(fewer).toHaveAttribute('aria-disabled', 'true');
  });
});
