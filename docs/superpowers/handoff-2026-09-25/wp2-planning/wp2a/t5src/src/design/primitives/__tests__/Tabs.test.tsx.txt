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
