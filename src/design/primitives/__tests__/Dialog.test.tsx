import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from '../Dialog';

// vitest runs without `globals: true`, so RTL's automatic cleanup never registers.
afterEach(cleanup);

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

  it('keeps focus when an inline onClose changes identity on re-render', () => {
    const view = (
      <>
        <button>opener</button>
        <Dialog open onClose={() => {}} titleId="t">
          <h2 id="t">Title</h2>
          <button>first</button>
          <button>second</button>
        </Dialog>
      </>
    );
    const { rerender } = render(view);
    const second = screen.getByRole('button', { name: 'second' });
    second.focus();
    rerender(
      <>
        <button>opener</button>
        <Dialog open onClose={() => {}} titleId="t">
          <h2 id="t">Title</h2>
          <button>first</button>
          <button>second</button>
        </Dialog>
      </>,
    );
    expect(document.activeElement).toBe(second);
  });
});
