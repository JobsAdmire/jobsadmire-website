'use client';
import { createContext, useContext, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { isFormErrorCode } from '../errors';

export type FormErrorsValue = {
  /** field name → `sys.form.errors.*` code (never text) */
  errors: Record<string, string>;
  /** the visitor's typed values, echoed by the action after a failed submit */
  values: Record<string, string>;
  /** set by `FormShell`: a control that shows its own error registers its name on mount (and
   *  the returned function unregisters it), so the shell can list every OTHER error — `_form`,
   *  a hidden input — in its form-level alert instead of dropping it */
  register?: (name: string) => () => void;
};

export const FormErrorsContext = createContext<FormErrorsValue>({ errors: {}, values: {} });

/** Registers `name` with the enclosing shell for as long as the caller is mounted. */
export function useRegisterField(name: string): void {
  const { register } = useContext(FormErrorsContext);
  useEffect(() => register?.(name), [register, name]);
}

/** The locale's error text for one field, or undefined when it has none. */
export function useFieldError(name: string): string | undefined {
  const { errors } = useContext(FormErrorsContext);
  const sys = useTranslations('sys');
  const code = errors[name];
  if (!code) return undefined;
  return sys(`form.errors.${isFormErrorCode(code) ? code : 'invalid'}`);
}

/** What the visitor typed into this field before the last (failed) submit. */
export function useFieldValue(name: string): string | undefined {
  return useContext(FormErrorsContext).values[name];
}
