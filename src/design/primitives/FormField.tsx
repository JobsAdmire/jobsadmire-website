import type { ReactNode } from 'react';

type InputProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
};

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (p: InputProps) => ReactNode;
}) {
  const described =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
    undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-body-sm font-bold">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children({
        id,
        'aria-describedby': described,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })}
      {hint ? (
        <p id={`${id}-hint`} className="text-text-tertiary text-body-sm">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-danger text-body-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
