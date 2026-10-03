import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RangeSlider } from '../RangeSlider';

describe('RangeSlider', () => {
  it('is a real range input, labelled, with a formatted aria-valuetext', () => {
    const onChange = vi.fn();
    render(
      <RangeSlider
        id="salary"
        label="Gross salary"
        min={30000}
        max={78000}
        step={500}
        value={33030}
        onChange={onChange}
        formatValue={(v) => `₺${v}`}
        minLabel="₺30,000"
        maxLabel="₺78,000"
      />,
    );
    const slider = screen.getByRole('slider', { name: 'Gross salary' });
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('min', '30000');
    expect(slider).toHaveAttribute('max', '78000');
    expect(slider).toHaveAttribute('step', '500');
    expect(slider).toHaveAttribute('aria-valuetext', '₺33030');
    // The visible value is the same formatted string, in an <output> bound to the input.
    expect(screen.getByText('₺33030')).toHaveAttribute('for', 'salary');
    fireEvent.change(slider, { target: { value: '40000' } });
    expect(onChange).toHaveBeenCalledWith(40000);
  });

  it('falls back to the raw number when no formatter is given', () => {
    render(<RangeSlider id="n" label="N" min={0} max={10} value={3} onChange={() => {}} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '3');
  });
});
