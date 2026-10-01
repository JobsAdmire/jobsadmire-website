import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SectorPrefillLink } from '../SectorPrefillLink';

const requestForm = (options: string[]) => (
  <section id="request-form">
    <form>
      <select name="sector" defaultValue="">
        <option value=""></option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </form>
  </section>
);

describe('SectorPrefillLink', () => {
  it('is a plain same-page anchor to #request-form', () => {
    render(<SectorPrefillLink sector="factory">Fabrika işçisi talep edin →</SectorPrefillLink>);
    expect(screen.getByRole('link', { name: 'Fabrika işçisi talep edin →' })).toHaveAttribute(
      'href',
      '#request-form',
    );
  });

  it('prefills the request form’s sector select on click and leaves the anchor navigation alone', async () => {
    render(
      <>
        {requestForm(['factory', 'textile'])}
        <SectorPrefillLink sector="textile">Tekstil</SectorPrefillLink>
      </>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Tekstil' }));
    expect((document.querySelector('select[name="sector"]') as HTMLSelectElement).value).toBe(
      'textile',
    );
  });

  it('does nothing when the option does not exist (never throws in front of a visitor)', async () => {
    render(
      <>
        {requestForm([])}
        <SectorPrefillLink sector="factory">x</SectorPrefillLink>
      </>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'x' }));
    expect((document.querySelector('select[name="sector"]') as HTMLSelectElement).value).toBe('');
  });
});
