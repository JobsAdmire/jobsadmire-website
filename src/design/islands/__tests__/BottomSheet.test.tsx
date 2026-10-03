import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BottomSheet } from '../BottomSheet';
import { SearchInput } from '../SearchInput';

describe('BottomSheet', () => {
  it('is a named dialog with a labelled close button, and closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} title="Choose a role" closeLabel="Close">
        <button>Welder</button>
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog', { name: 'Choose a role' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('lets a SearchInput inside clear on Escape without closing; the next Escape closes', async () => {
    const onClose = vi.fn();
    function TopicPicker() {
      const [query, setQuery] = useState('weld');
      return (
        <BottomSheet open onClose={onClose} title="Choose a topic" closeLabel="Close">
          <SearchInput
            id="topic"
            label="Search topics"
            value={query}
            onChange={setQuery}
            clearLabel="Clear search"
          />
        </BottomSheet>
      );
    }
    render(<TopicPicker />);
    const input = screen.getByRole('searchbox', { name: 'Search topics' });
    await userEvent.click(input);
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveValue('');
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing while closed', () => {
    render(
      <BottomSheet open={false} onClose={() => {}} title="T" closeLabel="Close">
        x
      </BottomSheet>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
