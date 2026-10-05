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
    // the greyscale/opacity hover treatment belongs to real logo images (D20)
    expect(screen.getAllByRole('img')[0].parentElement).toHaveClass('ja-hover-logo');
    expect(screen.getByRole('button', { name: 'Duraklat' })).toBeInTheDocument();
  });

  it('renders labelled sample slots with a stat column when no logo is consented (SHARED 13.3)', () => {
    const { container } = renderWithIntl(
      <LogoMarquee logos={[]} slots={['Müşteri logosu 1', 'Müşteri logosu 2']} stat={<b>22+</b>} />,
    );
    expect(screen.getByText('22+')).toBeInTheDocument();
    const slot = container.querySelector('[data-placeholder="logo-1"]');
    expect(slot).toHaveTextContent('Müşteri logosu 1');
    expect(slot).toHaveClass('border-dashed', 'text-text-tertiary');
    // never the .62 greyscale treatment on placeholder text: it drops the label to 2.4:1 (D20)
    expect(slot).not.toHaveClass('ja-hover-logo');
  });
});
