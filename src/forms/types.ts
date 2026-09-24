import type { FormErrorCode } from './errors';

/** Wire names the shell renders and the action strips before validation. `honeypot` is the
 *  door's literal field name; `cf-turnstile-response` is the Turnstile widget's. */
export const HONEYPOT_FIELD = 'honeypot';
export const CAPTCHA_FIELD = 'cf-turnstile-response';
export const CONSENT_FIELD = 'consent';

/** The door's HTTP 200 body (`website-forms.service.ts`). `status: 'FAILED'` is still a 200:
 *  the row is durable and re-runnable from the Ops inbox; `error` is non-null only when the
 *  failure was the visitor's own (RC26) and is the visitor-safe text to show. */
export type PostFormOk = {
  kind: 'ok';
  id: string;
  status: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM';
  isTest: boolean;
  replayed: boolean;
  captchaDegraded: boolean;
  error: string | null;
};

export type PostFormResult =
  | PostFormOk
  | { kind: 'invalid'; message: string } // 400 — catalog/DTO rejection (client validation should make this unreachable)
  | { kind: 'captcha' } // 403 — Turnstile failed or missing while Ops holds a secret
  | { kind: 'off' } // 404 — module flag off, form inactive (newsletter in Phase A), or unknown key
  | { kind: 'tripped' } // 429 — abuse trip, `fallback: 'whatsapp'`
  | { kind: 'unauthorized' } // 401 or no usable token/URL here — an ops alarm, the visitor sees the panel
  | { kind: 'unavailable'; cause: 'network' | 'timeout' | 'server' }; // no answer, a timeout, or a 5xx — W74: only a connection-level failure is retried, once

export type PostFormVisitor = { ip: string | null; ua: string | null };

/** What the fallback panel renders (D11). `failed` is the door's HTTP 200 + `status: 'FAILED'`
 *  — the row is durable and re-runnable from the Ops inbox, `error` is the visitor-safe text
 *  when the failure was the visitor's own (a closed opening, a residency rule). */
export type FormErrorResult =
  Exclude<PostFormResult, PostFormOk> | { kind: 'failed'; error: string | null };
export type FormFallbackKind = FormErrorResult['kind'];

export type FormActionState =
  | { status: 'idle' }
  | { status: 'error'; result: FormErrorResult; values: Record<string, string> }
  | { status: 'fieldErrors'; errors: Record<string, string>; values: Record<string, string> };

export const IDLE_FORM_STATE: FormActionState = { status: 'idle' };

/**
 * Thrown from a page's `toFields` (or by `uploads.ts`) for a VISITOR-side refusal. With
 * `field`, the action answers a field error under that name with that `sys.form.errors.*`
 * code (an unreadable CV → `cv: 'file'`); without one, the `failed` panel with
 * `visitorMessage` (already localized by the thrower, or the door's own visitor-safe text).
 */
export class FormActionError extends Error {
  readonly visitorMessage: string;
  readonly field?: { name: string; code: FormErrorCode };
  constructor(visitorMessage: string, field?: { name: string; code: FormErrorCode }) {
    super(visitorMessage || (field ? `${field.name}: ${field.code}` : 'form action refused'));
    this.name = 'FormActionError';
    this.visitorMessage = visitorMessage;
    this.field = field;
  }
}

/** Thrown by `uploads.ts` when the DOOR failed (401/404/429/5xx/network/timeout) before the
 *  form itself was posted — the action renders the same fallback panel `postForm` would. */
export class FormDoorError extends Error {
  readonly result: FormErrorResult;
  constructor(result: FormErrorResult) {
    super(`door ${result.kind}`);
    this.name = 'FormDoorError';
    this.result = result;
  }
}
