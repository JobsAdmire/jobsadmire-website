'use client';
import { createContext, useContext } from 'react';
import { useTranslations } from 'next-intl';
import { isFormErrorCode } from '../errors';

export type FormErrorsValue = {
  /** field name → `sys.form.errors.*` code (never text) */
  errors: Record<string, string>;
  /** the visitor's typed values, echoed by the action after a failed submit */
  values: Record<string, string>;
};

export const FormErrorsContext = createContext<FormErrorsValue>({ errors: {}, values: {} });

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
