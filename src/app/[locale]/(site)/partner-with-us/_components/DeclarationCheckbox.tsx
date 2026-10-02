'use client';
import {
  useFieldError,
  useFieldId,
  useFieldValue,
  useRegisterField,
} from '@/forms/client/FormErrorsContext';

/**
 * The sourcing form's licence/no-fee declaration (partner.114, legal — rendered verbatim): a
 * second required checkbox beside the kernel's consent (W79), marked up exactly like the
 * kernel's consent row. Validated by the page schema (`z.literal('on')` → `required`), its id
 * scoped by the shell (`f-<idScope>-licenceDeclaration`), echoed after a failed submit, its
 * error text the locale's `sys.form.errors.*` copy through `useFieldError`; it registers with
 * the shell so the form-level alert does not list its error a second time.
 */
export function DeclarationCheckbox({ name, label }: { name: string; label: string }) {
  const id = useFieldId(name);
  const error = useFieldError(name);
  const ticked = useFieldValue(name) === 'on';
  useRegisterField(name);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-body-sm">
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          defaultChecked={ticked}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-blue-safe"
        />
        <span>{label}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="m-0 text-body-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
