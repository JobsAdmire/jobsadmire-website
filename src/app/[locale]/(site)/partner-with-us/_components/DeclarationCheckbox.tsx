'use client';
import {
  useFieldError,
  useFieldId,
  useFieldValue,
  useRegisterField,
} from '@/forms/client/FormErrorsContext';

/**
 * The sourcing form's licence/no-fee declaration (partner.114, legal — rendered verbatim): a
 * second required checkbox beside the kernel's consent (W79), marked up and styled exactly like
 * the kernel's consent row (the design's 17 px box and 12.5 px grey line, S6.6 — the track's
 * accent comes from its form card). Validated by the page schema (`z.literal('on')` →
 * `required`), its id scoped by the shell (`f-<idScope>-licenceDeclaration`), echoed after a
 * failed submit, its
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
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-[1.55] text-text-tertiary xl:text-[11px]"
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          defaultChecked={ticked}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-px h-[17px] w-[17px] shrink-0 accent-blue-safe"
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
