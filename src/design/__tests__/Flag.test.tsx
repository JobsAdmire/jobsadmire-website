import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Flag } from '../Flag';

describe('Flag', () => {
  it('references the sprite symbol and is decorative without a label', () => {
    const { container } = render(<Flag code="PK" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '15');
    expect(svg.querySelector('use')).toHaveAttribute('href', '/brand/flags.svg#flag-PK');
  });

  it('is an image named by its label when given one', () => {
    const { container } = render(<Flag code="TR" size={40} label="Türkiye" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Türkiye');
    expect(svg).not.toHaveAttribute('aria-hidden');
    expect(svg).toHaveAttribute('height', '30');
  });
});
