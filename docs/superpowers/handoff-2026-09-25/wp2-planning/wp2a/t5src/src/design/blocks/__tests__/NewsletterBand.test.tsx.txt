import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NewsletterBand } from '../NewsletterBand';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';

const bundle = testBundle({ strings: BLOCK_STRINGS });

describe('NewsletterBand', () => {
  it('renders nothing while inactive (Phase A, W5)', () => {
    const { container } = render(
      <NewsletterBand bundle={bundle} locale="tr" active={false}>
        <form data-testid="shell" />
      </NewsletterBand>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the band chrome around the page-supplied form when active (Phase B)', () => {
    render(
      <NewsletterBand bundle={bundle} locale="tr" active id="newsletter">
        <form data-testid="shell" />
      </NewsletterBand>,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Ayda bir işe alım içgörüleri' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Spam yok/)).toBeInTheDocument();
    expect(screen.getByTestId('shell')).toBeInTheDocument();
    expect(document.getElementById('newsletter')).not.toBeNull();
  });
});
