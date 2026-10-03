import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormErrorsContext, type FormErrorsValue } from '@/forms/client/FormErrorsContext';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { DeclarationCheckbox } from '../DeclarationCheckbox';

const LABEL =
  'Geçerli bir lisansa sahip olduğumuzu ve adaylardan asla ücret almadığımızı beyan ederiz.';
/** What `FormShell` provides: the action's codes and echoed values, `register`, the id scope. */
const inShell = (value: Partial<FormErrorsValue>) => (
  <FormErrorsContext.Provider
    value={{ errors: {}, values: {}, idScope: 'partner-sourcing', ...value }}
  >
    <DeclarationCheckbox name="licenceDeclaration" label={LABEL} />
  </FormErrorsContext.Provider>
);

describe('DeclarationCheckbox', () => {
  it('is an unticked required checkbox named after the schema field, scoped like the kernel fields', () => {
    renderWithIntl(inShell({}));
    const box = screen.getByRole('checkbox', { name: LABEL });
    expect(box).toHaveAttribute('name', 'licenceDeclaration');
    expect(box).toHaveAttribute('id', 'f-partner-sourcing-licenceDeclaration');
    expect(box).toBeRequired();
    expect(box).not.toBeChecked();
    expect(box).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders the action error code as the copy of the locale and marks the box invalid', () => {
    renderWithIntl(inShell({ errors: { licenceDeclaration: 'required' } }));
    const box = screen.getByRole('checkbox', { name: LABEL });
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAttribute('aria-describedby', 'f-partner-sourcing-licenceDeclaration-error');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(tr.sys.form.errors.required);
    expect(alert).toHaveAttribute('id', 'f-partner-sourcing-licenceDeclaration-error');
  });

  it('stays ticked after a failed submit on another field (the echoed value)', () => {
    renderWithIntl(inShell({ errors: { email: 'email' }, values: { licenceDeclaration: 'on' } }));
    expect(screen.getByRole('checkbox', { name: LABEL })).toBeChecked();
  });

  it('registers its name with the shell, so the form-level alert never repeats its error', () => {
    const unregister = vi.fn();
    const register = vi.fn(() => unregister);
    const { unmount } = renderWithIntl(inShell({ register }));
    expect(register).toHaveBeenCalledWith('licenceDeclaration');
    unmount();
    expect(unregister).toHaveBeenCalled();
  });
});
