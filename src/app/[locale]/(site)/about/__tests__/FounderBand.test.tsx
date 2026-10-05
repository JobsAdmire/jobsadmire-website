import { screen } from '@testing-library/react';
import { renderWithIntl as render } from '@/test/render';
import { describe, expect, it } from 'vitest';
import { FounderBand } from '../_components/FounderBand';
import type { FounderRow } from '../founder';

const COPY: Record<string, string> = {
  'about.047': 'Founder & CEO, JobsAdmire',
  'about.048':
    '“Behind every worker we place is a family whose life changes. Today we are proud to serve',
  'about.143': 'families',
  'about.049': 'through dignified employment in Türkiye.”',
};
const t = (id: string) => COPY[id] ?? `?${id}`;
const ROW: FounderRow = {
  name: 'Ada Example',
  titleId: 'about.047',
  photoSrc: null,
  published: true,
};

describe('FounderBand', () => {
  it('renders nothing without a published founder (W86)', () => {
    const { container } = render(<FounderBand founder={null} placedText="470+" t={t} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the name, the row's own title id and the quote around the placed figure", () => {
    render(<FounderBand founder={ROW} placedText="470+" t={t} />);
    const figure = screen.getByTestId('about-founder');
    expect(figure.tagName).toBe('FIGURE');
    expect(figure).toHaveTextContent('Ada Example');
    expect(figure).toHaveTextContent('Founder & CEO, JobsAdmire');
    expect(screen.getByText('470+ families')).toBeInTheDocument();
    expect(figure.querySelector('blockquote')).toHaveTextContent(
      /proud to serve 470\+ families through/,
    );
  });

  it('a founder without a photo gets the named founder-photo placeholder (D26/W55), sized by a wrapper (W129)', () => {
    const { container } = render(<FounderBand founder={ROW} placedText="470+" t={t} />);
    const slot = container.querySelector('[data-placeholder="founder-photo"]');
    expect(slot).not.toBeNull();
    expect(slot).toHaveAttribute('aria-label', 'Ada Example');
    // W129: ImageSlot's own box (`w-full h-auto object-cover`) always renders — that is not a
    // caller violation. What must NOT appear is a caller-added pixel size (the draft's
    // `h-[102px] w-[102px]`) or a second, caller-added `object-cover`; the fixed 102px box
    // lives on the wrapper instead.
    expect(slot?.className).not.toMatch(/102px/);
    expect(slot?.className?.match(/object-cover/g)?.length).toBe(1);
    expect(slot?.parentElement).toHaveClass('w-[102px]');
  });

  it('a published photo renders inside the design gradient ring, named by the founder (About l. 668–670)', () => {
    const { container } = render(
      <FounderBand
        founder={{ ...ROW, photoSrc: '/team/haris-jiva.jpg' }}
        placedText="470+"
        t={t}
      />,
    );
    expect(container.querySelector('[data-placeholder="founder-photo"]')).toBeNull();
    const img = screen.getByRole('img', { name: 'Ada Example' });
    expect(img.getAttribute('src')).toContain('haris-jiva.jpg');
    const ring = img.parentElement?.parentElement;
    expect(ring?.className).toMatch(/bg-gradient-to-br/);
    expect(ring?.className).toMatch(/from-\[#1e9ee8\]/);
    expect(ring?.className).toMatch(/to-success/);
  });
});
