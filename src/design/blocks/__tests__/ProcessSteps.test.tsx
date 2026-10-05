import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProcessSteps } from '../ProcessSteps';
import { testBundle } from '@/test/bundle';

const bundle = testBundle({
  strings: {
    's1.t': 'İhtiyacınızı paylaşın',
    's1.b': 'Sektör, kişi sayısı, lokasyon.',
    's2.t': 'Kısa liste',
    's2.b': 'Uygun adaylar.',
    's3.t': 'İlk iş günü',
    's3.b': 'Varış ve oryantasyon.',
  },
});
const steps = [
  { n: 1, titleId: 's1.t', bodyId: 's1.b', when: 'Başlangıç' },
  { n: 2, titleId: 's2.t', bodyId: 's2.b', when: '1. hafta' },
  { n: 3, titleId: 's3.t', bodyId: 's3.b' },
];

describe('ProcessSteps', () => {
  it('renders an ordered list with numbered dots, when-pills and one heading per step', () => {
    render(<ProcessSteps bundle={bundle} locale="tr" steps={steps} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'İhtiyacınızı paylaşın',
      'Kısa liste',
      'İlk iş günü',
    ]);
    expect(screen.getByText('Başlangıç')).toBeInTheDocument();
    expect(screen.getByText('1. hafta')).toBeInTheDocument();
    // the dot's number is decorative — the heading is the step's name
    expect(
      screen.getAllByText(/^[123]$/).every((n) => n.getAttribute('aria-hidden') === 'true'),
    ).toBe(true);
  });

  it('marks the last step for the green terminus and honours the variant', () => {
    render(
      <ProcessSteps bundle={bundle} locale="tr" steps={steps} variant="plain" headingLevel={4} />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[2]).toHaveAttribute('data-last', 'true');
    expect(items[0]).not.toHaveAttribute('data-last');
    expect(screen.getByRole('list')).toHaveAttribute('data-variant', 'plain');
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3);
  });

  it('timeline variant: phase pills, check nodes and connectors between steps (SHARED 8.1)', () => {
    const { container } = render(
      <ProcessSteps bundle={bundle} locale="tr" steps={steps} variant="timeline" />,
    );
    expect(container.querySelector('ol')).toHaveAttribute('data-variant', 'timeline');
    expect(screen.getByText('Başlangıç')).toHaveClass('bg-ink', 'text-white');
    const rows = screen.getAllByRole('listitem');
    // the last node is green and draws no connector below it
    expect(rows[2].querySelector('.bg-success')).not.toBeNull();
    expect(rows[2].querySelectorAll('.bg-gradient-to-b')).toHaveLength(0);
    expect(rows[0].querySelectorAll('.bg-gradient-to-b')).toHaveLength(1);
  });

  it('numbered variant: gradient number dots and a card per step, last green (SHARED 8.2)', () => {
    render(<ProcessSteps bundle={bundle} locale="tr" steps={steps} variant="numbered" whenIcon />);
    const rows = screen.getAllByRole('listitem');
    expect(rows[0].querySelector('[aria-hidden="true"]')).toHaveTextContent('1');
    expect(rows[0].querySelector('.ja-hover-card')).not.toBeNull();
    expect(rows[2].querySelector('[aria-hidden="true"]')).toHaveClass('from-success-text');
    expect(screen.getByText('Başlangıç').querySelector('svg')).not.toBeNull();
  });

  it('row variant: four-up cards over a connector, icons top-right, caps when-pill (SHARED 8.3/8.4)', () => {
    const { container } = render(
      <ProcessSteps
        bundle={bundle}
        locale="tr"
        steps={steps.map((s) => ({ ...s, icon: <svg data-testid={`i${s.n}`} /> }))}
        variant="row"
        motion="steps"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-variant', 'row');
    expect(root.querySelector('.ja-journey-line')).not.toBeNull();
    expect(screen.getAllByRole('listitem')[0]).toHaveClass('ja-step');
    expect(screen.getByTestId('i1').parentElement).toHaveClass('max-md:hidden');
    expect(screen.getByText('Başlangıç')).toHaveClass('uppercase');
  });

  it('icon marker puts the step icon in the dot instead of the number (SHARED 8.4)', () => {
    render(
      <ProcessSteps
        bundle={bundle}
        locale="tr"
        steps={steps.map((s) => ({ ...s, icon: <svg data-testid={`i${s.n}`} /> }))}
        variant="numbered"
        marker="icon"
      />,
    );
    expect(screen.getByTestId('i1').parentElement).not.toHaveTextContent('1');
  });

  it('tint variant: pale dots with a blue digit, the last one green (SHARED 8.5)', () => {
    render(<ProcessSteps bundle={bundle} locale="tr" steps={steps} variant="tint" />);
    const dots = screen
      .getAllByRole('listitem')
      .map((li) => li.querySelector('[aria-hidden="true"]')!);
    expect(dots[0]).toHaveClass('bg-tint', 'text-blue-safe');
    expect(dots[2]).toHaveClass('bg-success-soft', 'text-success-text');
  });
});
