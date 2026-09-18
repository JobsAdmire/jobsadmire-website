import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PausableMarquee } from '../PausableMarquee';

describe('PausableMarquee', () => {
  it('exposes a visible pause control that toggles', async () => {
    render(
      <PausableMarquee durationSec={46} labelPause="Pause" labelPlay="Play">
        <span>card</span>
      </PausableMarquee>,
    );
    const btn = screen.getByRole('button', { name: 'Pause' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(btn);
    expect(screen.getByRole('button', { name: 'Play' })).toHaveAttribute('aria-pressed', 'true');
  });
});
