'use client';
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useTranslations } from 'next-intl';
import type { FormKey } from '@/analytics/forms';
import { Button } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { isFormErrorCode } from '../errors';
import { CONSENT_FIELD, HONEYPOT_FIELD, IDLE_FORM_STATE, type FormActionState } from '../types';
import { FallbackPanel } from './FallbackPanel';
import {
  FormErrorsContext,
  useFieldError,
  useFieldValue,
  useRegisterField,
} from './FormErrorsContext';
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
  /** every DOM id inside the form derives from `idScope ?? formKey` (`f-<scope>-<name>`); a page
   *  with two forms of the same key (Contact: W3) passes a distinct one to each */
  idScope?: string;
  /** the level of `title` and of the fallback panel's heading — match the surrounding outline
   *  (axe `heading-order`); default 3 */
  headingLevel?: 2 | 3 | 4;
};

/** D20: never `disabled` while pending — that drops the visitor's focus to `<body>`. The button
 *  stays focusable and announces itself as unavailable; the shell ignores a second submit. */
function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  const sys = useTranslations('sys');
  return (
    <Button
      variant="primary"
      size="lg"
      type="submit"
      aria-disabled={pending || undefined}
      className="aria-disabled:cursor-progress aria-disabled:opacity-60"
    >
      {pending ? sys('form.submit.sending') : label}
    </Button>
  );
}

/** D20: after an answer, focus goes where the visitor has to act — the first invalid control
 *  (else the form-level alert) after `fieldErrors`, the fallback panel after `error`. Only on a
 *  CHANGE of state: a starting state (dev gallery) never steals focus on mount. */
function useFocusAnswer(state: FormActionState) {
  const form = useRef<HTMLFormElement>(null);
  const seen = useRef(state);
  useEffect(() => {
    if (seen.current === state) return;
    seen.current = state;
    const el = form.current;
    if (!el) return;
    const target =
      state.status === 'fieldErrors'
        ? (el.querySelector<HTMLElement>('[aria-invalid="true"]') ??
          el.querySelector<HTMLElement>('[data-form-alert]'))
        : state.status === 'error'
          ? el.querySelector<HTMLElement>('[data-testid="form-fallback"]')
          : null;
    target?.focus();
  }, [state]);
  return form;
}

function ConsentCheckboxRegistration() {
  useRegisterField(CONSENT_FIELD);
  return null;
}

/** `_form` errors (an object-level `.refine()`, a `.strict()` extra key) and errors on names no
 *  rendered control shows (a hidden `openingSlug`) — listed once above the submit button so a
 *  submit never ends with nothing visible. */
function FormLevelErrors({ errors }: { errors: [string, string][] }) {
  const sys = useTranslations('sys');
  const lines = errors.map(([name, code]) => {
    const text = sys(`form.errors.${isFormErrorCode(code) ? code : 'invalid'}`);
    const labelKey = `form.labels.${name}`;
    return name !== '_form' && sys.has(labelKey) ? `${sys(labelKey)}: ${text}` : text;
  });
  return (
    <div
      role="alert"
      data-form-alert=""
      tabIndex={-1}
      className="rounded-base border border-danger p-4 text-body-sm text-danger focus:outline-none"
    >
      <p className="m-0 font-bold">{sys('form.errors.form')}</p>
      <ul className="mt-2 mb-0 pl-5">
        {[...new Set(lines)].map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function ConsentRow({
  mode,
  href,
  id,
}: {
  mode: 'checkbox' | 'notice';
  href: '/privacy' | '/kvkk';
  id: string;
}) {
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
  return (
    <div className="flex flex-col gap-1">
      <ConsentCheckboxRegistration />
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
  idScope,
  headingLevel = 3,
}: FormShellProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const scope = idScope ?? formKey;
  const sys = useTranslations('sys');
  // A rejected action renders the `unavailable` panel, never the error boundary (D11).
  const guarded = useMemo(() => guardAction(action), [action]);
  const [state, formAction, pending] = useActionState(guarded, initialState ?? IDLE_FORM_STATE);
  const turnstile = useTurnstileReset(state);
  const formRef = useFocusAnswer(state);
  // A second submit while the first is in flight would queue a second post (and re-send a
  // spent captcha token): cancelled here, before React dispatches the action.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (pending) e.preventDefault();
  };
  // How many mounted controls show each name's error themselves (Field, the consent row).
  const [shown, setShown] = useState<ReadonlyMap<string, number>>(() => new Map());
  const register = useCallback((name: string) => {
    setShown((prev) => new Map(prev).set(name, (prev.get(name) ?? 0) + 1));
    return () =>
      setShown((prev) => {
        const next = new Map(prev);
        const left = (prev.get(name) ?? 0) - 1;
        if (left > 0) next.set(name, left);
        else next.delete(name);
        return next;
      });
  }, []);
  const ctx = useMemo(
    () =>
      state.status === 'fieldErrors'
        ? { errors: state.errors, values: state.values, register, idScope: scope }
        : state.status === 'error'
          ? { errors: {}, values: state.values, register, idScope: scope }
          : { errors: {}, values: {}, register, idScope: scope },
    [state, register, scope],
  );
  const unshown =
    state.status === 'fieldErrors'
      ? Object.entries(state.errors).filter(([name]) => name === '_form' || !shown.has(name))
      : [];
  const honeypotId = `f-${scope}-${HONEYPOT_FIELD}`;
  return (
    <FormErrorsContext.Provider value={ctx}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={onSubmit}
        aria-busy={pending || undefined}
        noValidate
        data-testid={testId}
        data-form-key={formKey}
        className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}
      >
        {title ? <Heading className="m-0 text-card-title font-extrabold">{title}</Heading> : null}
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
          <Turnstile
            ref={turnstile}
            id={`f-${scope}-turnstile`}
            siteKey={turnstileSiteKey}
            locale={locale}
          />
        ) : null}
        <ConsentRow mode={consent} href={consentLinkHref} id={`f-${scope}-${CONSENT_FIELD}`} />
        {unshown.length ? <FormLevelErrors errors={unshown} /> : null}
        <div>
          <SubmitButton label={submitLabel ?? sys('form.submit.default')} pending={pending} />
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
            headingLevel={headingLevel}
          />
        ) : null}
      </form>
    </FormErrorsContext.Provider>
  );
}
