import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stat } from '../Stat';

describe('Stat', () => {
  it('formats a numeric value per locale with prefix and suffix (D18)', () => {
    const { container } = render(
      <Stat value={1240} prefix="~" suffix="+" label="placed" locale="tr" />,
    );
    // the sr-only span carries the final value as one string; the visible, aria-hidden figure
    // repeats it around the count-up cell (D1 below)
    expect(screen.getByText('~1.240+')).toHaveClass('sr-only');
    expect(container.querySelector('p')!.textContent).toBe('~1.2401.240+~1.240+');
  });

  // Final pass D1 (W196 A2): Chrome scores a layout shift per text run, and the proof build showed
  // the suffix sliding right as the number grew ("0+" → "470+") even with the whole figure's width
  // reserved. The reserve therefore sits on the NUMBER: an inline-grid cell holds the animated
  // number over an invisible copy of the final number, so the number's box keeps its final width
  // from the server render on and the prefix/suffix around it never move.
  it('reserves the number’s width: an invisible final number shares the animated number’s cell (D1)', () => {
    const { container } = render(
      <Stat value={470} prefix="~" suffix="+" label="placed" locale="en" />,
    );
    const figure = container.querySelector('p')!;
    expect(figure).not.toHaveClass('grid');
    const cell = figure.querySelector('[data-count-up]')!;
    expect(cell).toHaveClass('inline-grid', 'tabular-nums');
    const [animated, reserve] = [...cell.children];
    expect(animated).toHaveClass('col-start-1', 'row-start-1');
    expect(animated).not.toHaveClass('invisible');
    expect(animated).toHaveTextContent('470');
    expect(reserve).toHaveClass('invisible', 'col-start-1', 'row-start-1');
    expect(reserve).toHaveTextContent('470');
    // the prefix sits before the cell and the suffix after it, outside the reserved box
    const visible = cell.parentElement!;
    expect(visible).toHaveAttribute('aria-hidden', 'true');
    expect(visible.firstChild!.textContent).toBe('~');
    expect(visible.lastChild!.textContent).toBe('+');
    expect(figure.querySelector('.sr-only')).toHaveTextContent('~470+');
    // a text metric never animates and reserves nothing
    const text = render(<Stat text="6–8" label="first day" locale="en" />);
    expect(text.container.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(text.container.querySelector('[data-count-up]')).toBeNull();
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
