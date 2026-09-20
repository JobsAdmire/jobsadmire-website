'use client';
import { useTranslations } from 'next-intl';
import { FormField } from '@/design/primitives';
import { useFieldError, useFieldValue } from './FormErrorsContext';

export type FieldOption = { value: string; label: string };

export type FieldProps = {
  /** the catalog field name — also the `sys.form.labels/placeholders/hints.<name>` key */
  name: string;
  /** required when `sys.form.labels.<name>` does not exist (W30) */
  label?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  as?: 'input' | 'textarea' | 'select';
  type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'file';
  options?: FieldOption[];
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'url';
  accept?: string;
  multiple?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  className?: string;
  /** defaults to `f-<name>`; pass one when the same field name appears twice on a page */
  id?: string;
};

export const INPUT_CLASS =
  'min-h-[44px] w-full rounded-input border border-border-1 bg-white px-3 text-body-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe aria-[invalid=true]:border-danger';

/** W30: a raw field name is never a label. Dev/test throw so the page task adds the key or
 *  passes `label`; production degrades to the name and logs, rather than crashing the page. */
function missingLabel(name: string): string {
  const message = `<Field name="${name}"> has no sys.form.labels.${name} entry — add it to src/messages/{tr,en}.json or pass label=`;
  if (process.env.NODE_ENV !== 'production') throw new Error(message);
  console.error(message);
  return name;
}

/** One labelled control wired to the shell: the label/placeholder/hint come from `sys.form.*`
 *  by name unless overridden, the error text from the action's field codes, and the default
 *  value from the echoed values so a failed submit never empties what the visitor typed. */
export function Field({
  name,
  label,
  hint,
  placeholder,
  required,
  as = 'input',
  type = 'text',
  options,
  autoComplete,
  inputMode,
  accept,
  multiple,
  rows = 4,
  min,
  max,
  className,
  id = `f-${name}`,
}: FieldProps) {
  const sys = useTranslations('sys');
  const error = useFieldError(name);
  const value = useFieldValue(name);
  const labelKey = `form.labels.${name}`;
  const labelText = label ?? (sys.has(labelKey) ? sys(labelKey) : missingLabel(name));
  const placeholderKey = `form.placeholders.${name}`;
  const placeholderText =
    placeholder ?? (sys.has(placeholderKey) ? sys(placeholderKey) : undefined);
  const hintKey = `form.hints.${name}`;
  const hintText =
    hint ?? (sys.has(hintKey) ? sys(hintKey) : required ? undefined : sys('form.hints.optional'));
  const cls = [INPUT_CLASS, className].filter(Boolean).join(' ');
  return (
    <FormField id={id} label={labelText} hint={hintText} error={error} required={required}>
      {(p) =>
        as === 'textarea' ? (
          <textarea
            {...p}
            name={name}
            rows={rows}
            placeholder={placeholderText}
            defaultValue={value}
            autoComplete={autoComplete}
            className={cls}
          />
        ) : as === 'select' ? (
          <select
            {...p}
            name={name}
            defaultValue={value ?? ''}
            autoComplete={autoComplete}
            className={cls}
          >
            <option value="">{sys('form.placeholders.select')}</option>
            {(options ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...p}
            name={name}
            type={type}
            placeholder={placeholderText}
            // a file input can never be given a value; everything else echoes the last submit
            defaultValue={type === 'file' ? undefined : value}
            autoComplete={autoComplete}
            inputMode={inputMode}
            accept={accept}
            multiple={multiple}
            min={min}
            max={max}
            className={cls}
          />
        )
      }
    </FormField>
  );
}
