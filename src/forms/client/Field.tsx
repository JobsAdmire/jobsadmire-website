'use client';
import { useTranslations } from 'next-intl';
import { FormField, type FieldLabelMode } from '@/design/primitives/FormField';
import { useFieldError, useFieldId, useFieldValue, useRegisterField } from './FormErrorsContext';

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
  minLength?: number;
  maxLength?: number;
  /** the starting value (input/textarea/select; never a file input) — an echoed value from a
   *  failed submit wins over it */
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
  /** defaults to `f-<idScope>-<name>` inside a `FormShell` (its `idScope ?? formKey`), `f-<name>`
   *  outside one; pass one only when the same field name appears twice in one form */
  id?: string;
  /** SHARED 4.1: `hidden` (default) is the design's placeholder-only face — the label stays,
   *  visually hidden, and its words become the placeholder; `small` is Contact's grey caption
   *  (4.8); `visible` the old bold label with its asterisk. */
  labelMode?: FieldLabelMode;
  /** Show the hint line under the field. Default: only a hint passed explicitly as `hint` shows;
   *  the catalogue's `sys.form.hints.<name>` and the "optional" line stay for assistive tech only
   *  (visually hidden, still in `aria-describedby`) — the design draws no hints (SHARED 4.1). */
  showHint?: boolean;
  /** SHARED 4.5: a narrow dial-code select beside a phone field (the design's 120 px "🇹🇷 +90",
   *  104 px on phones) — its own catalog field, with its own hidden label, error and echo. Build
   *  `options` with `dialSelectOptions` (`src/forms/client/dial.ts`). */
  dial?: DialSelect;
};

export type DialSelect = {
  /** the catalog field name of the select (the hire form's `dial`) */
  name: string;
  /** the select's accessible name (visually hidden) */
  label: string;
  options: FieldOption[];
  defaultValue?: string;
  required?: boolean;
  autoComplete?: string;
};

/** The design's field face (SHARED 4.2; Homepage v4 ll. 398–414, Hire 1219–1250): 1.5 px #dbe6ee
 *  edge, the brand blue on focus, 16 px type, a #f9fcfe fill, r12 and 50 px on phones (the
 *  ≤ 900 `.ja-form input` rule), white, r10 and 14.5 px from 901, × 0.75 type from 1101 on the
 *  11 px floor — keeping the 44 px target there (D20). The placeholder is the visible label in
 *  the placeholder-only face, so it wears the contrast-safe tertiary grey (#5f6e86, 4.9:1 —
 *  the design's #94a3b8 is 2.6:1, a D20 delta). A visible focus ring stays on every field. */
export const INPUT_FACE =
  'min-h-[50px] w-full min-w-0 rounded-xs border-[1.5px] border-field-border bg-field-fill py-2.5 text-input text-ink transition-colors placeholder:text-text-tertiary focus:border-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-safe aria-[invalid=true]:border-danger lg:min-h-[46px] lg:rounded-[10px] lg:bg-white xl:min-h-[44px]';
export const INPUT_CLASS = `${INPUT_FACE} px-3.5 xl:px-[10.5px]`;
/** A select's empty first option reads as a placeholder (the design's `select:invalid` grey);
 *  the option list itself stays ink. */
export const SELECT_CLASS = "has-[option[value='']:checked]:text-text-tertiary [&>option]:text-ink";

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
  minLength,
  maxLength,
  defaultValue,
  disabled,
  className,
  id: idProp,
  labelMode = 'hidden',
  showHint,
  dial,
}: FieldProps) {
  const sys = useTranslations('sys');
  const defaultId = useFieldId(name);
  const id = idProp ?? defaultId;
  const error = useFieldError(name);
  const value = useFieldValue(name) ?? defaultValue;
  useRegisterField(name);
  const labelKey = `form.labels.${name}`;
  const labelText = label ?? (sys.has(labelKey) ? sys(labelKey) : missingLabel(name));
  const placeholderKey = `form.placeholders.${name}`;
  // Placeholder-only face: the label's words are the placeholder (an explicit one wins; an empty
  // one never leaves the field without visible words). Otherwise the catalogue's example text.
  const placeholderText =
    labelMode === 'hidden'
      ? placeholder || labelText
      : (placeholder ?? (sys.has(placeholderKey) ? sys(placeholderKey) : undefined));
  const hintKey = `form.hints.${name}`;
  const hintText =
    hint ?? (sys.has(hintKey) ? sys(hintKey) : required ? undefined : sys('form.hints.optional'));
  const hintVisible = showHint ?? Boolean(hint);
  const cls = [INPUT_CLASS, as === 'select' ? SELECT_CLASS : null, className]
    .filter(Boolean)
    .join(' ');
  // W205 ⚠️3: a select locked on its one option (the careers form's residency country) offers
  // nothing to choose, so the empty placeholder `<option>` is not rendered; a single option
  // the visitor still has to pick keeps it.
  const locked = options?.length === 1 && defaultValue === options[0].value;
  // The select's empty option names the field in the placeholder-only face (the design's
  // disabled first option, "Sektör"); elsewhere it stays the generic "Select".
  const emptyOption = labelMode === 'hidden' ? labelText : sys('form.placeholders.select');
  const field = (
    <FormField
      id={id}
      label={labelText}
      hint={hintText}
      error={error}
      required={required}
      labelMode={labelMode}
      hintVisible={hintVisible}
      className={dial ? 'flex-1' : undefined}
    >
      {(p) =>
        as === 'textarea' ? (
          <textarea
            {...p}
            name={name}
            rows={rows}
            placeholder={placeholderText}
            defaultValue={value}
            autoComplete={autoComplete}
            minLength={minLength}
            maxLength={maxLength}
            disabled={disabled}
            className={cls}
          />
        ) : as === 'select' ? (
          <select
            // W193: a select applies defaultValue on mount only, so it is keyed on the echoed
            // value — the re-render after a failed action remounts it with the kept choice before
            // React 19 resets the form (inputs/textareas follow a changed defaultValue themselves).
            key={value ?? ''}
            {...p}
            name={name}
            defaultValue={value ?? ''}
            autoComplete={autoComplete}
            disabled={disabled}
            className={cls}
          >
            {locked ? null : <option value="">{emptyOption}</option>}
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
            minLength={minLength}
            maxLength={maxLength}
            disabled={disabled}
            className={cls}
          />
        )
      }
    </FormField>
  );
  if (!dial) return field;
  return (
    // SHARED 4.5: one row — the narrow dial select (120 px, 104 px on phones) beside the field
    <div className="grid grid-cols-[104px_minmax(0,1fr)] items-start gap-2.5 md:grid-cols-[120px_minmax(0,1fr)]">
      <DialField dial={dial} labelMode={labelMode} />
      {field}
    </div>
  );
}

/** The dial select: a catalog field of its own, registered with the shell so its error shows
 *  here, echoing the last submit, keyed on that value like every select (W193). */
function DialField({ dial, labelMode }: { dial: DialSelect; labelMode: FieldLabelMode }) {
  const id = useFieldId(dial.name);
  const error = useFieldError(dial.name);
  const value = useFieldValue(dial.name) ?? dial.defaultValue;
  useRegisterField(dial.name);
  return (
    <FormField
      id={id}
      label={dial.label}
      error={error}
      required={dial.required}
      labelMode={labelMode === 'small' ? 'small' : 'hidden'}
    >
      {(p) => (
        <select
          key={value ?? ''}
          {...p}
          name={dial.name}
          defaultValue={value ?? ''}
          autoComplete={dial.autoComplete ?? 'tel-country-code'}
          className={`${INPUT_FACE} ${SELECT_CLASS} px-2 xl:px-1.5`}
        >
          {value ? null : <option value="">{dial.label}</option>}
          {dial.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}
