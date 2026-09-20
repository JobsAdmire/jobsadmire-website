import type { ZodIssue } from 'zod';

/** The `sys.form.errors.*` keys. A field error travels server → client as one of these codes
 *  (never as English text), and `useFieldError` renders the locale's copy. `invalid` is the
 *  catch-all for an issue no other code describes. */
export const FORM_ERROR_CODES = [
  'required',
  'email',
  'phone',
  'min',
  'max',
  'url',
  'file',
  'consent',
  'captcha',
  'invalid',
] as const;
export type FormErrorCode = (typeof FORM_ERROR_CODES)[number];

export const isFormErrorCode = (v: unknown): v is FormErrorCode =>
  typeof v === 'string' && (FORM_ERROR_CODES as readonly string[]).includes(v);

/** Zod issue → error code. A schema can name the code directly (`.regex(RE, { message:
 *  'phone' })`, `.min(1, { message: 'file' })`) and that wins; otherwise the issue kind
 *  decides. Put `.min(1)` before `.email()`/`.url()` so an empty value reads `required`. */
export function issueToCode(issue: ZodIssue): FormErrorCode {
  if (isFormErrorCode(issue.message)) return issue.message;
  switch (issue.code) {
    case 'invalid_type':
      return issue.received === 'undefined' ? 'required' : 'invalid';
    case 'too_small':
      return issue.type === 'string' && issue.minimum === 1 ? 'required' : 'min';
    case 'too_big':
      return 'max';
    case 'invalid_string':
      if (issue.validation === 'email') return 'email';
      if (issue.validation === 'url') return 'url';
      return 'invalid';
    case 'invalid_enum_value':
      // a select left on its placeholder posts '' — that is "required", not "invalid"
      return issue.received === '' ? 'required' : 'invalid';
    default:
      return 'invalid';
  }
}

/** First issue per field wins; a root-level issue lands under `_form`. */
export function fieldErrorsFromIssues(issues: ZodIssue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const name = issue.path.length ? issue.path.join('.') : '_form';
    if (!(name in out)) out[name] = issueToCode(issue);
  }
  return out;
}
