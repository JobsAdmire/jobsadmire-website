import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BottomSheet } from '../BottomSheet';

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

  it('renders nothing while closed', () => {
    render(
      <BottomSheet open={false} onClose={() => {}} title="T" closeLabel="Close">
        x
      </BottomSheet>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
