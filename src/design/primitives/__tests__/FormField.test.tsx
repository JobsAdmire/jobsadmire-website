import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from '../FormField';

describe('FormField', () => {
  it('links label, hint and error to the control', () => {
    render(
      <FormField id="email" label="E-mail" hint="Work address" error="Required">
        {(p) => <input {...p} />}
      </FormField>,
    );
    const input = screen.getByLabelText('E-mail');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const described = input.getAttribute('aria-describedby')!.split(' ');
    expect(described).toContain('email-hint');
    expect(described).toContain('email-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
});
