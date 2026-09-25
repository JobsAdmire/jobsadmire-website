import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stat } from '../Stat';

describe('Stat', () => {
  it('formats a numeric value per locale with prefix and suffix (D18)', () => {
    render(<Stat value={1240} prefix="~" suffix="+" label="placed" locale="tr" />);
    // the sr-only span carries the final value; the animated span repeats it aria-hidden
    expect(screen.getAllByText('~1.240+')).toHaveLength(2);
  });

  it('renders text verbatim and never counts up when text is given', () => {
    const { container } = render(<Stat text="6–8" suffix=" weeks" label="first day" locale="en" />);
    expect(screen.getByText('6–8 weeks')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('renders nothing without a value or a text — an unsigned metric is hidden (W1)', () => {
    const { container } = render(<Stat label="x" locale="en" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('dark tone swaps the label colour for a navy surface', () => {
    render(<Stat value={13} label="countries" locale="en" tone="dark" />);
    expect(screen.getByText('countries')).toHaveClass('text-white/55');
  });
});
