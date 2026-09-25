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
});
