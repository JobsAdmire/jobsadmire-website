import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PausableMarquee } from '../PausableMarquee';

describe('PausableMarquee', () => {
  it('exposes a visible pause control whose label is the state (M-6)', async () => {
    render(
      <PausableMarquee durationSec={46} labelPause="Pause" labelPlay="Play">
        <span>card</span>
      </PausableMarquee>,
    );
    const btn = screen.getByRole('button', { name: 'Pause' });
    // The label swap is the only state announcement — no `aria-pressed` on top of it, or a
    // screen reader says "Play, pressed".
    expect(btn).not.toHaveAttribute('aria-pressed');
    await userEvent.click(btn);
    const toggled = screen.getByRole('button', { name: 'Play' });
    expect(toggled).not.toHaveAttribute('aria-pressed');
  });
});
