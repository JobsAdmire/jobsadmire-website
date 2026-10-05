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
    // Google Play first by default; the design's two-line face: the kicker over the store name
    expect(screen.getAllByRole('link').map((a) => a.getAttribute('aria-label'))).toEqual([
      'Get it on Google Play',
      'Download on the App Store',
    ]);
    expect(screen.getByText('GET IT ON')).toBeInTheDocument();
    expect(screen.getByText('App Store')).toBeInTheDocument();
    rerender(<StoreBadges bundle={bundle} locale="tr" android={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('puts the App Store first on request (Partner, SHARED 11.2)', () => {
    render(
      <StoreBadges
        bundle={bundle}
        locale="tr"
        android="https://play.google.com/x"
        ios="https://apps.apple.com/x"
        appleFirst
      />,
    );
    expect(screen.getAllByRole('link').map((a) => a.getAttribute('aria-label'))).toEqual([
      'Download on the App Store',
      'Get it on Google Play',
    ]);
  });
});
