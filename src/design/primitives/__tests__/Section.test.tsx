import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from '../Section';

describe('Section tones', () => {
  it.each([
    ['light', 'bg-white'],
    ['dark', 'bg-navy'],
    ['pale', 'bg-pale-1'],
    ['band', 'bg-white'],
  ] as const)('%s sets its surface class', (tone, cls) => {
    const { container } = render(
      <Section tone={tone} id="s">
        x
      </Section>,
    );
    expect(container.querySelector('section#s')).toHaveClass(cls);
  });

  it('band is the tighter wrapper that hosts one full-width card', () => {
    const { container } = render(<Section tone="band">x</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveClass('py-10');
    expect(section).not.toHaveClass('py-16');
  });
});
