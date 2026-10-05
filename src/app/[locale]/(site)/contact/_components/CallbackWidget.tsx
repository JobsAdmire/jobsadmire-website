'use client';
import { useId, useState } from 'react';
import { RadioChips } from '@/design/primitives/RadioChips';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import { CALLBACK_DAYS, CALLBACK_SLOTS, type CallbackDay } from '../_lib/options';
import { ChevronDownIcon, PhoneOutgoingIcon } from './icons';
import type { FormAction, FormDoor } from './types';

export type CallbackWidgetCopy = {
  title: string; // contact.041
  sub: string; // contact.042
  dayLegend: string; // contact.043
  slotLegend: string; // contact.044
  days: Record<CallbackDay, string>; // contact.205–207
  anyTime: string; // contact.209
  nameLabel: string; // contact.066
  phoneLabel: string; // contact.068
  phonePlaceholder: string; // contact.049
  submit: string; // contact.045
  note: string; // contact.046
  fallbackIntro: string; // sys.contact.fallbackIntro.callback
};

export type CallbackWidgetProps = FormDoor & { action: FormAction; copy: CallbackWidgetCopy };

/** The hero's collapsible "Can’t talk right now?" card → `callback` (W3: `name` added; W79: a
 *  consent checkbox). Closed on the server exactly like the design; the form mounts on open. */
export function CallbackWidget({
  action,
  copy,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  contact,
}: CallbackWidgetProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<string>('today');
  const [slot, setSlot] = useState<string | null>(null);
  const slotOptions = [
    ...CALLBACK_SLOTS.map((s) => ({ value: s.key, label: `${s.from}–${s.to}` })),
    { value: 'any', label: copy.anyTime },
  ];
  return (
    <div
      data-testid="contact-callback"
      className="ja-card-in rounded-md border border-border-1 bg-white p-5 text-ink"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3.5 rounded-xs text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
      >
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xs bg-pale-1 text-navy"
        >
          <PhoneOutgoingIcon size={19} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-card-title font-extrabold text-ink">{copy.title}</span>
          <span className="text-body-sm text-text-tertiary">{copy.sub}</span>
        </span>
        <ChevronDownIcon
          size={16}
          className={
            open
              ? 'shrink-0 rotate-180 text-text-tertiary transition-transform'
              : 'shrink-0 text-text-tertiary transition-transform'
          }
        />
      </button>
      <div id={panelId} hidden={!open} className="ja-panel-soft mt-4 border-t border-border-3 pt-4">
        {open ? (
          <FormShell
            action={action}
            formKey="callback"
            idScope="contact-callback"
            locale={locale}
            turnstileSiteKey={turnstileSiteKey}
            whatsappNumber={whatsappNumber}
            whatsappIntro={copy.fallbackIntro}
            contact={contact}
            submitLabel={copy.submit}
            consent="checkbox"
            consentStyle="box"
            submitShape="rect"
            submitRadius={11}
            submitFullWidth={false}
            submitArrow={false}
            headingLevel={3}
            testId="contact-callback-form"
          >
            <RadioChips
              name="day"
              legend={copy.dayLegend}
              value={day}
              onChange={setDay}
              options={CALLBACK_DAYS.map((d) => ({ value: d, label: copy.days[d] }))}
              compact
            />
            <RadioChips
              name="slot"
              legend={copy.slotLegend}
              value={slot}
              onChange={setSlot}
              options={slotOptions}
              compact
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                name="name"
                label={copy.nameLabel}
                required
                autoComplete="name"
                maxLength={120}
              />
              <Field
                name="phone"
                type="tel"
                label={copy.phoneLabel}
                placeholder={copy.phonePlaceholder}
                required
                autoComplete="tel"
                inputMode="tel"
                maxLength={40}
              />
            </div>
            <p className="m-0 text-body-sm text-text-tertiary">{copy.note}</p>
          </FormShell>
        ) : null}
      </div>
    </div>
  );
}
