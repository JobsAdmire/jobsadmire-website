import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stat } from '../Stat';

describe('Stat', () => {
  it('formats a numeric value per locale with prefix and suffix (D18)', () => {
    render(<Stat value={1240} prefix="~" suffix="+" label="placed" locale="tr" />);
    // the sr-only span carries the final value; the animated span and the invisible width
    // reserve (D1 below) repeat it aria-hidden
    expect(screen.getAllByText('~1.240+')).toHaveLength(3);
  });

  // Final pass D1 (W196 A2): the count-up rendered "0+" → "470+" in flow, so the cell narrowed
  // and widened while it ran (CLS 0.0065 About / 0.0035 Home). The final value is stacked
  // invisibly in the same grid cell as the animated span, so the box has its final width from
  // the server render on.
  it('reserves the final width: an invisible copy shares the animated span’s grid cell (D1)', () => {
    const { container } = render(<Stat value={470} suffix="+" label="placed" locale="en" />);
    const figure = container.querySelector('p')!;
    expect(figure).toHaveClass('grid', 'text-stat');
    const [animated, reserve] = [...figure.querySelectorAll('span[aria-hidden="true"]')];
    expect(animated).toHaveClass('col-start-1', 'row-start-1');
    expect(animated).not.toHaveClass('invisible');
    expect(reserve).toHaveClass('invisible', 'col-start-1', 'row-start-1');
    expect(reserve).toHaveTextContent('470+');
    expect(figure.querySelector('.sr-only')).toHaveTextContent('470+');
    // a text metric never animates and reserves nothing
    const text = render(<Stat text="6–8" label="first day" locale="en" />);
    expect(text.container.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(text.container.querySelector('p')).not.toHaveClass('grid');
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
