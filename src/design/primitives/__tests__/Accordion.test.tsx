import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from '../Accordion';

const items = [
  { id: 'a', title: 'First', body: 'Body A' },
  { id: 'b', title: 'Second', body: 'Body B' },
];

describe('Accordion', () => {
  it('uses real buttons with aria-expanded and aria-controls', async () => {
    render(<Accordion items={items} singleOpen defaultOpenId="a" />);
    const first = screen.getByRole('button', { name: 'First' });
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(first.getAttribute('aria-controls')!)).toHaveTextContent(
      'Body A',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Second' }));
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true');
  });
});
