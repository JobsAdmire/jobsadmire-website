import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StoreBadges } from '../StoreBadges';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';

const bundle = testBundle({ strings: BLOCK_STRINGS });

describe('StoreBadges', () => {
  it('renders the Google Play badge only — iOS is null today (W8)', () => {
    render(
      <StoreBadges
        bundle={bundle}
        locale="tr"
        android="https://play.google.com/store/apps/details?id=x"
      />,
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName('Get it on Google Play');
    expect(links[0]).toHaveAttribute('target', '_blank');
  });

  it('adds the App Store badge once a link exists, and renders nothing with neither', () => {
    const { rerender, container } = render(
      <StoreBadges
        bundle={bundle}
        locale="tr"
        android="https://play.google.com/x"
        ios="https://apps.apple.com/x"
      />,
    );
    expect(screen.getAllByRole('link')).toHaveLength(2);
    rerender(<StoreBadges bundle={bundle} locale="tr" android={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
