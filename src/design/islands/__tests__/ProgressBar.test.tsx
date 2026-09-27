import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('exposes value/min/max and an accessible name', () => {
    render(<ProgressBar value={3} max={5} label="Checks answered" valueText="3 / 5" />);
    const bar = screen.getByRole('progressbar', { name: 'Checks answered' });
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
  });

  it('clamps the visual width into 0–100 %', () => {
    const { container } = render(<ProgressBar value={12} max={10} label="x" />);
    expect(container.querySelector('[role="progressbar"] > div')).toHaveStyle({ width: '100%' });
  });
});
