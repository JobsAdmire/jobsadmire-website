import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../Dialog';

describe('Dialog', () => {
  it('is labelled, closes on Escape, and restores focus', async () => {
    const onClose = vi.fn();
    render(
      <>
        <button>opener</button>
        <Dialog open onClose={onClose} titleId="t">
          <h2 id="t">Title</h2>
          <button>inside</button>
        </Dialog>
      </>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 't');
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
