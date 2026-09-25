import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LogoMarquee } from '../LogoMarquee';
import { renderWithIntl } from '@/test/render';

describe('LogoMarquee', () => {
  it('renders nothing without consented logos (§10 row 11, W6)', () => {
    const { container } = renderWithIntl(<LogoMarquee logos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a pausable marquee of the logos', () => {
    renderWithIntl(
      <LogoMarquee
        logos={[
          { src: '/brand/logos/a.svg', alt: 'A Ltd', width: 220, height: 88 },
          { src: '/brand/logos/b.svg', alt: 'B AŞ', width: 220, height: 88 },
        ]}
      />,
    );
    // the inert duplicate track is aria-hidden, so only the first copy is exposed
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Duraklat' })).toBeInTheDocument();
  });
});
