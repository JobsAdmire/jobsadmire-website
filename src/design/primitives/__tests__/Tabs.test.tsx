import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '../Tabs';

const tabs = [
  { id: 'a', label: 'A', panel: <p>pa</p> },
  { id: 'b', label: 'B', panel: <p>pb</p> },
];

describe('Tabs', () => {
  it('reports selection changes through onChange — click and arrow keys alike', async () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} defaultId="a" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).toHaveBeenLastCalledWith('b');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('a');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('works without onChange (every existing caller)', async () => {
    render(<Tabs tabs={tabs} defaultId="a" />);
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('pb');
  });
});

describe('Tabs — variants (SHARED 14.1)', () => {
  it('underline and segmented faces keep the tablist semantics', () => {
    const tabs = [
      { id: 'a', label: 'A', panel: 'pa' },
      { id: 'b', label: 'B', panel: 'pb' },
    ];
    const { unmount } = render(<Tabs tabs={tabs} defaultId="a" variant="underline" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'underline');
    expect(screen.getByRole('tab', { name: 'A' })).toHaveClass('bg-white', 'text-blue-safe');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('tabindex', '-1');
    unmount();
    render(<Tabs tabs={tabs} defaultId="b" variant="segmented" />);
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveClass('bg-white', 'text-ink');
  });
});
