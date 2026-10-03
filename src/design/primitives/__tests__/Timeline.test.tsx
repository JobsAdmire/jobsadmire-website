import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline } from '../Timeline';

const steps = [
  { when: '01', title: 'First', body: 'a' },
  { title: 'Second', body: 'b' },
];

describe('Timeline', () => {
  it('defaults to the vertical rail with one h3 per step', () => {
    render(<Timeline steps={steps} />);
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-variant', 'vertical');
    expect(list).toHaveClass('border-l');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('horizontal variant lays the steps out as a row grid from md up', () => {
    render(<Timeline steps={steps} variant="horizontal" />);
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-variant', 'horizontal');
    expect(list).toHaveClass('md:grid-flow-col');
    expect(list).not.toHaveClass('border-l');
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('rail-to-row keeps the rail below 1101 px and runs one top-ruled column per step from 1101 (W229)', () => {
    render(<Timeline steps={steps} variant="rail-to-row" />);
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-variant', 'rail-to-row');
    expect(list).toHaveClass(
      'border-l',
      'pl-6',
      'xl:grid',
      'xl:grid-flow-col',
      'xl:border-l-0',
      'xl:pl-0',
    );
    for (const item of screen.getAllByRole('listitem')) {
      expect(item).toHaveClass('xl:border-t-2', 'xl:border-tint-border', 'xl:pt-4');
    }
  });

  it('renders no body paragraph when a step has none (W84)', () => {
    const { container } = render(<Timeline steps={[{ title: 'Only a title' }]} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Only a title' })).toBeInTheDocument();
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});
