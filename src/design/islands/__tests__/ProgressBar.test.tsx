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

  it('speaks the visible value text, and is named by the visible label rather than a duplicate', () => {
    render(<ProgressBar value={1} max={5} label="Checks answered" valueText="1 / 5" />);
    const bar = screen.getByRole('progressbar', { name: 'Checks answered' });
    expect(bar).toHaveAttribute('aria-valuetext', '1 / 5');
    expect(bar).not.toHaveAttribute('aria-label');
    const labelId = bar.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)).toHaveTextContent(/^Checks answered$/);
  });

  it('without a visible value line, is named by aria-label and has no aria-valuetext', () => {
    render(<ProgressBar value={2} max={10} label="Upload" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-label', 'Upload');
    expect(bar).not.toHaveAttribute('aria-labelledby');
    expect(bar).not.toHaveAttribute('aria-valuetext');
  });

  it('clamps the visual width into 0–100 %', () => {
    const { container } = render(<ProgressBar value={12} max={10} label="x" />);
    expect(container.querySelector('[role="progressbar"] > div')).toHaveStyle({ width: '100%' });
  });
});
