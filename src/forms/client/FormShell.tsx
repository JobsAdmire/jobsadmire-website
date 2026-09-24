'use client';
import { useActionState, useMemo, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import type { FormKey } from '@/analytics/forms';
import { Button } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { CONSENT_FIELD, HONEYPOT_FIELD, IDLE_FORM_STATE, type FormActionState } from '../types';
import { FallbackPanel } from './FallbackPanel';
import { FormErrorsContext, useFieldError, useFieldValue } from './FormErrorsContext';
import { guardAction } from './guardAction';
import { Turnstile, useTurnstileReset } from './Turnstile';

export type FormShellProps = {
  /** the page's `'use server'` wrapper around `createFormAction(spec)` */
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
  formKey: FormKey;
  locale: Locale;
  /** `bundle.settings.turnstileSiteKey` — null renders no widget and sends no token */
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  whatsappIntro?: string;
  contact?: { phone: string; phoneDisplay?: string; email: string };
  /** defaults to `sys.form.submit.default`; pages pass the package's own CTA copy */
  submitLabel?: string;
  /** must match the spec's `consent` — `notice` renders the KVKK line without a checkbox */
  consent?: 'checkbox' | 'notice';
  consentLinkHref?: '/privacy' | '/kvkk';
  title?: string;
  children: ReactNode;
  className?: string;
  testId?: string;
  /** dev gallery / tests only — the state to start from instead of idle */
  initialState?: FormActionState;
};

function SubmitButton({ label }: { label: string }) {
  const sys = useTranslations('sys');
  const { pending } = useFormStatus();
  return (
    <Button
      variant="primary"
      size="lg"
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
    >
      {pending ? sys('form.submit.sending') : label}
    </Button>
  );
}

function ConsentRow({ mode, href }: { mode: 'checkbox' | 'notice'; href: '/privacy' | '/kvkk' }) {
  const sys = useTranslations('sys');
  const error = useFieldError(CONSENT_FIELD);
  const ticked = useFieldValue(CONSENT_FIELD) === 'on';
  const link = (chunks: ReactNode) => (
    <Link href={href} prefetch={false} className="font-bold text-blue-safe underline">
      {chunks}
    </Link>
  );
  if (mode === 'notice')
    return (
      <p className="m-0 text-body-sm text-text-secondary">
        {sys.rich('form.consent.notice', { link })}
      </p>
    );
  const id = `f-${CONSENT_FIELD}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-body-sm">
        <input
          id={id}
          name={CONSENT_FIELD}
          type="checkbox"
          required
          defaultChecked={ticked}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-blue-safe"
        />
        <span>{sys.rich('form.consent.label', { link })}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="m-0 text-danger text-body-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The one form wrapper every page form uses (D11/D13): `useActionState` around the page's
 * server action, the children `Field`s, the honeypot, the Turnstile widget when a site key is
 * configured, the consent row, the submit button with its pending state, and — on an `error`
 * state — the `FallbackPanel`. `noValidate` on purpose: the server validates and the errors
 * come back as `sys.form.errors.*` codes through `FormErrorsContext`, so the copy is one set,
 * localized, and reachable by assistive tech (`role="alert"` per field).
 */
export function FormShell({
  action,
  formKey,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  whatsappIntro,
  contact,
  submitLabel,
  consent = 'checkbox',
  consentLinkHref = '/privacy',
  title,
  children,
  className,
  testId,
  initialState,
}: FormShellProps) {
  const sys = useTranslations('sys');
  // A rejected action renders the `unavailable` panel, never the error boundary (D11).
  const guarded = useMemo(() => guardAction(action), [action]);
  const [state, formAction] = useActionState(guarded, initialState ?? IDLE_FORM_STATE);
  const turnstile = useTurnstileReset(state);
  const ctx = useMemo(
    () =>
      state.status === 'fieldErrors'
        ? { errors: state.errors, values: state.values }
        : state.status === 'error'
          ? { errors: {}, values: state.values }
          : { errors: {}, values: {} },
    [state],
  );
  const honeypotId = `f-${HONEYPOT_FIELD}-${formKey}`;
  return (
    <FormErrorsContext.Provider value={ctx}>
      <form
        action={formAction}
        noValidate
        data-testid={testId}
        data-form-key={formKey}
        className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}
      >
        {title ? <h3 className="m-0 text-card-title font-extrabold">{title}</h3> : null}
        {children}
        {/* The honeypot: outside the accessibility tree and the tab order, visible to bots only.
            The door reads the literal `honeypot` key and answers 200/SPAM when it is filled. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor={honeypotId}>{sys('form.honeypot')}</label>
          <input
            id={honeypotId}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {turnstileSiteKey ? (
          <Turnstile ref={turnstile} siteKey={turnstileSiteKey} locale={locale} />
        ) : null}
        <ConsentRow mode={consent} href={consentLinkHref} />
        <div>
          <SubmitButton label={submitLabel ?? sys('form.submit.default')} />
        </div>
        {state.status === 'error' ? (
          <FallbackPanel
            key={state.result.kind}
            result={state.result}
            values={state.values}
            formKey={formKey}
            locale={locale}
            whatsappNumber={whatsappNumber}
            whatsappIntro={whatsappIntro}
            contact={contact}
          />
        ) : null}
      </form>
    </FormErrorsContext.Provider>
  );
}
