'use client';
import { useEffect, useRef, useState } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { ClockIcon, PhoneIcon } from '@/design/chrome/icons';
// By module path (W147/W156): a barrel import would drag every client primitive into this chunk.
import { Button, buttonClassName } from '@/design/primitives/Button';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';
import { LiveDot } from './LiveDot';

type Action = (prev: FormActionState, data: FormData) => Promise<FormActionState>;
type Mode = 'proposal' | 'callback';

export type HeroLeadFormProps = {
  locale: Locale;
  /** the page's 'use server' wrappers (`_home/actions.ts`) */
  actions: { hire: Action; callback: Action };
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  /** home.049's link: the FIXED hire prefill (`sys.home.whatsapp.hire`) — no visitor data, so it
   *  may sit in the href (W95 scopes the click-time rule to visitor-chosen data). */
  whatsappHref: string;
  contact: { phone: string; phoneDisplay: string; email: string };
  options: { sector: FieldOption[]; startWhen: FieldOption[] };
  /** every string resolved on the server: no `sys.home` reaches the client (W148) */
  copy: {
    title: string;
    titleMobile: string;
    badge: string;
    sub: string;
    openProposal: string;
    openCallback: string;
    callbackNote: string;
    labels: {
      company: string;
      name: string;
      phone: string;
      sector: string;
      headcount: string;
      city: string;
      startWhen: string;
    };
    submitHire: string;
    submitCallback: string;
    whatsapp: string;
  };
};

/** The first control a revealed form can take focus on (the honeypot is `tabIndex=-1`). */
const FIRST_FIELD = 'input:not([type="hidden"]):not([tabindex="-1"]), select, textarea';

/**
 * The hero's lead card (design id `proposal`, lines 381–422). Above 460 px the proposal form is
 * open and the design shows no mode buttons; at ≤ 460 px the card collapses behind "Get free
 * proposal" / "Ask us to call you" and the chosen mode opens (`.ja-form-open`) — the one
 * state-driven show/hide on the page, because the design removes the buttons once a mode is open
 * (W10's class rule still hides the body below xs until then). Proposal → `hire` with the door's
 * required `name` + `email` (W3) and optional `city` (W16); call me back → `callback`. Both use
 * the kernel's consent checkbox (W79) and fallback panel (D11). The id is the anchor the header
 * CTA and the launch sweep point at (CTA_BY_PATHNAME['/'], W17/W152).
 */
export function HeroLeadForm({
  locale,
  actions,
  turnstileSiteKey,
  whatsappNumber,
  whatsappHref,
  contact,
  options,
  copy,
}: HeroLeadFormProps) {
  const [mode, setMode] = useState<Mode>('proposal');
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  // D20: the mode buttons disappear once a mode is open, so focus moves to the revealed form's
  // first field instead of falling to <body> — only after the visitor's choice, never on mount.
  useEffect(() => {
    if (open) body.current?.querySelector<HTMLElement>(FIRST_FIELD)?.focus();
  }, [open, mode]);
  const choose = (next: Mode) => {
    setMode(next);
    setOpen(true);
  };
  const shell = { locale, turnstileSiteKey, whatsappNumber, contact, headingLevel: 3 as const };
  return (
    <div
      id="proposal"
      data-testid="hero-form"
      className="scroll-mt-[90px] rounded-hero bg-white px-[30px] pb-6 pt-7 text-ink shadow-hero-form max-xs:mt-1.5 max-xs:rounded-lg max-xs:px-[18px] max-xs:py-5 xl:px-[22.5px] xl:pb-[18px] xl:pt-[21px]"
    >
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="m-0 text-[23px] tracking-[-0.8px] xl:text-[17.25px]">
          <span className="max-xs:hidden">{copy.title}</span>
          <span className="xs:hidden">{copy.titleMobile}</span>
        </h2>
        <span className="inline-flex shrink-0 items-center gap-[7px] whitespace-nowrap rounded-pill border border-success-border bg-success-surface px-3 py-1 text-[11.5px] font-extrabold text-success-text">
          <LiveDot />
          {copy.badge}
        </span>
      </div>
      <p className="m-0 mb-4 text-body-sm text-text-tertiary max-xs:mb-3.5 max-xs:text-[14px]">
        {copy.sub}
      </p>
      {open ? null : (
        <div className="flex flex-col gap-[9px] xs:hidden">
          <Button
            variant="primary"
            size="lg"
            onClick={() => choose('proposal')}
            aria-expanded={false}
            aria-controls="hero-form-body"
            data-testid="hero-mode-proposal"
          >
            {copy.openProposal}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => choose('callback')}
            aria-expanded={false}
            aria-controls="hero-form-body"
            data-testid="hero-mode-callback"
          >
            <PhoneIcon size={16} />
            {copy.openCallback}
          </Button>
        </div>
      )}
      <div id="hero-form-body" ref={body} className={open ? undefined : 'max-xs:hidden'}>
        {mode === 'proposal' ? (
          <FormShell
            key="hire"
            {...shell}
            action={actions.hire}
            formKey="hire"
            idScope="hero-hire"
            testId="hire-form"
            submitLabel={copy.submitHire}
          >
            <div className="grid gap-[11px] xs:grid-cols-2">
              <div className="xs:col-span-2">
                <Field
                  name="company"
                  label={copy.labels.company}
                  required
                  autoComplete="organization"
                />
              </div>
              <Field name="name" label={copy.labels.name} required autoComplete="name" />
              <Field name="email" type="email" required autoComplete="email" inputMode="email" />
              <Field
                name="phone"
                type="tel"
                label={copy.labels.phone}
                required
                autoComplete="tel"
                inputMode="tel"
                hint=""
              />
              {/* The design hides its optional fields at ≤ 460 px (`.ja-f-opt`, W10). */}
              <div className="max-xs:hidden">
                <Field
                  name="sector"
                  as="select"
                  label={copy.labels.sector}
                  options={options.sector}
                  hint=""
                />
              </div>
              <Field
                name="headcount"
                type="number"
                label={copy.labels.headcount}
                required
                min={1}
                inputMode="numeric"
              />
              <div className="max-xs:hidden">
                <Field name="city" label={copy.labels.city} autoComplete="address-level2" hint="" />
              </div>
              <div className="max-xs:hidden xs:col-span-2">
                <Field
                  name="startWhen"
                  as="select"
                  label={copy.labels.startWhen}
                  options={options.startWhen}
                  hint=""
                />
              </div>
            </div>
          </FormShell>
        ) : (
          <FormShell
            key="callback"
            {...shell}
            action={actions.callback}
            formKey="callback"
            idScope="hero-callback"
            testId="callback-form"
            submitLabel={copy.submitCallback}
          >
            <p className="m-0 flex items-start gap-2.5 rounded-xs border border-tint-border bg-tint px-3.5 py-[11px] text-[13px] font-bold leading-normal text-blue-safe">
              <ClockIcon size={15} className="mt-0.5 shrink-0" />
              {copy.callbackNote}
            </p>
            <div className="grid gap-[11px] xs:grid-cols-2">
              <Field name="name" label={copy.labels.name} required autoComplete="name" />
              <Field
                name="phone"
                type="tel"
                label={copy.labels.phone}
                required
                autoComplete="tel"
                inputMode="tel"
                hint=""
              />
              <div className="max-xs:hidden">
                <Field
                  name="topic"
                  as="select"
                  label={copy.labels.sector}
                  options={options.sector}
                  hint=""
                />
              </div>
              <div className="max-xs:hidden">
                <Field name="city" label={copy.labels.city} autoComplete="address-level2" hint="" />
              </div>
            </div>
          </FormShell>
        )}
        {/* A column flex item stretches: the link is full-width without a width class on it. */}
        <div className="mt-3 flex flex-col">
          <ContactLink
            href={whatsappHref}
            placement="page_cta"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName('success', 'md')}
          >
            <LiveDot />
            {copy.whatsapp}
          </ContactLink>
        </div>
      </div>
    </div>
  );
}
