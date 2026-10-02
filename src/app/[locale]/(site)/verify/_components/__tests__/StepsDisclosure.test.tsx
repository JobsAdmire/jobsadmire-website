import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { StepsDisclosure } from '../StepsDisclosure';

describe('StepsDisclosure (D20: the design’s ≤ 700 px div-onClick fold, as a real button)', () => {
  it('is an h2 whose toggle is a button with aria-expanded/aria-controls over the panel', () => {
    renderWithIntl(
      <StepsDisclosure heading="Verify in one minute — 3 steps">
        <p>Ask for the badge</p>
      </StepsDisclosure>,
      { locale: 'en' },
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Verify in one minute — 3 steps',
    );
    const toggle = screen.getByRole('button', { name: 'Verify in one minute — 3 steps' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    expect(panel).toHaveTextContent('Ask for the badge');
    // closed: hidden below md; md:grid shows it from 701 px whatever the state
    expect(panel?.className).toMatch(/(^| )hidden( |$)/);
    expect(panel?.className).toContain('md:grid');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(panel?.className).toMatch(/(^| )grid( |$)/);
    expect(panel?.className).not.toMatch(/(^| )hidden( |$)/);
  });
});
