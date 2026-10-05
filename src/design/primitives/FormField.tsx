import type { ReactNode } from 'react';

type InputProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
};

/** How the label shows (SHARED 4.1/4.8). `hidden`: the design's placeholder-only face — the
 *  `<label>` stays in the DOM, tied by `htmlFor`, visually hidden; the field's placeholder
 *  carries the same words. `small`: the Contact page's small grey caption above the field (no
 *  asterisk — the design shows none; `aria-required` carries it). `visible`: the original bold
 *  label with its asterisk (dev gallery, page-local fields that ask for it). */
export type FieldLabelMode = 'hidden' | 'small' | 'visible';

const LABEL: Record<FieldLabelMode, string> = {
  hidden: 'sr-only',
  small: 'text-[12.5px] font-bold text-text-tertiary xl:text-[11px]',
  visible: 'text-body-sm font-bold',
};

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  labelMode = 'visible',
  hintVisible = true,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  labelMode?: FieldLabelMode;
  /** false keeps the hint for assistive tech only (`sr-only`, still in `aria-describedby`) —
   *  the design shows no hint lines under its fields (SHARED 4.1) */
  hintVisible?: boolean;
  className?: string;
  children: (p: InputProps) => ReactNode;
}) {
  const described =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
    undefined;
  return (
    <div className={['flex min-w-0 flex-col gap-1', className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={LABEL[labelMode]}>
        {label}
        {/* the mark is decorative everywhere (`aria-required` is the programmatic one): the
            placeholder-only face keeps it inside the visually hidden label only, the small
            caption never draws it */}
        {required && labelMode !== 'small' ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children({
        id,
        'aria-describedby': described,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })}
      {hint ? (
        <p
          id={`${id}-hint`}
          className={hintVisible ? 'm-0 text-text-tertiary text-body-sm' : 'sr-only'}
        >
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="m-0 text-[12.5px] font-bold text-danger xl:text-[11px]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
