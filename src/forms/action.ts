import 'server-only';
import { isIP } from 'node:net';
import { hasLocale } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import type { z } from 'zod';
import type { FormKey } from '@/analytics/forms';
import { redirect } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { echoValues, isInternalKey } from './echo';
import { fieldErrorsFromIssues } from './errors';
import { postForm } from './post';
import {
  CAPTCHA_FIELD,
  CONSENT_FIELD,
  FormActionError,
  FormDoorError,
  HONEYPOT_FIELD,
  IDLE_FORM_STATE,
  type FormActionState,
} from './types';
import { buildEnvelope, type WireFields } from './wire';

export type { FormActionState, FormErrorResult, FormFallbackKind } from './types';
export { IDLE_FORM_STATE, FormActionError, FormDoorError };

/**
 * One form's contract. `key` is `FormKey`-typed (R55) so an unlisted key is a compile error;
 * `schema` validates the posted string fields (Zod issues become `sys.form.errors.*` codes,
 * see `errors.ts`); `toFields` maps the parsed object onto the door's catalog names — it also
 * receives the raw `FormData` so a page can pull a `File` out and upload it first (careers CV,
 * fraud evidence — `uploads.ts`) and put the returned key on the wire. Throw `FormActionError`
 * from there for a visitor-side refusal (with `field` to land it on one input), `FormDoorError`
 * for a door-side failure; `uploads.ts` already does both.
 *
 * `consent: 'notice'` is for the designs that carry the KVKK line without a checkbox (the
 * Hire quick-quote card); the wire always carries `CONSENT_VERSION` either way.
 */
export type FormSpec<S extends z.ZodTypeAny> = {
  key: FormKey;
  schema: S;
  toFields: (parsed: z.infer<S>, data: FormData) => WireFields | Promise<WireFields>;
  consent?: 'checkbox' | 'notice';
};

/** FormData → the object the page schema parses. Repeated keys (checkbox groups, multi-file
 *  inputs) become arrays; single ones stay scalar (`File` included — the schema decides). */
function toObject(data: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of new Set(data.keys())) {
    if (isInternalKey(key)) continue;
    const all = data.getAll(key);
    out[key] = all.length > 1 ? all : all[0];
  }
  return out;
}

const str = (v: FormDataEntryValue | null): string | null => (typeof v === 'string' ? v : null);

/** The page path of the referer, for the door's `sourcePath` — never the query string. */
function sourcePathOf(referer: string | null): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).pathname;
  } catch {
    return null;
  }
}

/** The visitor's own address: the first `x-forwarded-for` hop when it is a bare IP (the door
 *  validates with `isIP` and would otherwise fall back to Vercel's egress), else `x-real-ip`,
 *  else nothing. Never logged here — the door hashes it and this module never persists it. */
function visitorOf(h: Awaited<ReturnType<typeof headers>>) {
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const real = h.get('x-real-ip')?.trim() ?? '';
  const ip = isIP(forwarded) ? forwarded : isIP(real) ? real : null;
  const ua = h.get('user-agent') || null;
  return { ip, ua };
}

/**
 * Builds the `(prev, FormData) => state` function `useActionState` drives. Pages wrap the
 * returned function in their own `'use server'` module (see docs/ARCHITECTURE.md § Forms flow)
 * — this file is `server-only`, not `'use server'`, because a `'use server'` module may export
 * only async functions and this is a factory.
 *
 * Success is a redirect to `/thank-you?form=<key>` (D13) for every 200 whose `status` is not
 * `FAILED` — RECEIVED, HANDLED, SPAM (a bot sees success) and `replayed` (the same submission
 * already landed this hour — a double submit, or a retry after a reset that did reach the door)
 * all count. Everything else is an `error` state the shell renders as the D11
 * fallback panel, with the typed values echoed for the WhatsApp prefill.
 */
export function createFormAction<S extends z.ZodTypeAny>(spec: FormSpec<S>) {
  const consentMode = spec.consent ?? 'checkbox';
  return async function formAction(
    _prev: FormActionState,
    data: FormData,
  ): Promise<FormActionState> {
    const values = echoValues(data);

    const errors: Record<string, string> = {};
    if (consentMode === 'checkbox' && data.get(CONSENT_FIELD) !== 'on')
      errors[CONSENT_FIELD] = 'consent';
    const parsed = spec.schema.safeParse(toObject(data));
    if (!parsed.success) Object.assign(errors, fieldErrorsFromIssues(parsed.error.issues));
    if (Object.keys(errors).length) return { status: 'fieldErrors', errors, values };

    let fields: WireFields;
    try {
      fields = await spec.toFields(parsed.data, data);
    } catch (err) {
      if (err instanceof FormActionError) {
        if (err.field)
          return { status: 'fieldErrors', errors: { [err.field.name]: err.field.code }, values };
        return { status: 'error', result: { kind: 'failed', error: err.visitorMessage }, values };
      }
      if (err instanceof FormDoorError) return { status: 'error', result: err.result, values };
      console.error('[formAction] toFields threw', { formKey: spec.key });
      return { status: 'error', result: { kind: 'unavailable', cause: 'server' }, values };
    }

    const requested = await getLocale();
    const locale: Locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;
    const h = await headers();
    const envelope = buildEnvelope({
      locale,
      fields,
      captchaToken: str(data.get(CAPTCHA_FIELD)),
      honeypot: str(data.get(HONEYPOT_FIELD)),
      sourcePath: sourcePathOf(h.get('referer')),
    });
    const result = await postForm(spec.key, envelope, visitorOf(h));

    if (result.kind === 'ok' && result.status !== 'FAILED') {
      // Throws NEXT_REDIRECT — deliberately outside any try/catch above.
      redirect({ href: { pathname: '/thank-you', query: { form: spec.key } }, locale });
    }
    if (result.kind === 'ok')
      return { status: 'error', result: { kind: 'failed', error: result.error }, values };
    return { status: 'error', result, values };
  };
}
