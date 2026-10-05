'use client';
import { useId, useState } from 'react';
import { RadioChips } from '@/design/primitives/RadioChips';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import { formatVisitDay, nextOpenDates, type OfficeHours } from '../_lib/office-status';
import { VISIT_SLOTS } from '../_lib/options';
import type { FormAction, FormDoor } from './types';
import { useMinuteTick } from './useMinuteTick';

export type VisitBookingCopy = {
  eyebrow: string; // contact.113
  title: string; // contact.114
  body: string; // contact.115
  dayLegend: string; // contact.116
  timeLegend: string; // contact.117
  toggleOpen: string; // contact.213
  toggleClose: string; // contact.212
  nameLabel: string; // contact.066
  emailLabel: string; // contact.067
  phoneLabel: string; // contact.068
  submit: string; // sys.contact.visit.submit (replaces contact.118)
  fallbackIntro: string; // sys.contact.fallbackIntro.visit
};

export type VisitBookingProps = FormDoor & {
  action: FormAction;
  copy: VisitBookingCopy;
  hours: OfficeHours;
};

/** "Book a visit" → `visit` (W3: name / e-mail / phone added; office fixed to antalya; W79 consent).
 *  The day chips are the next five open days of the Antalya office in its own zone, computed from
 *  the client clock (R18): the server and a not-yet-hydrated page get a plain labelled input under
 *  the same `preferredDate` name. ≤ 700 px the form sits behind the design's "Pick a day & time"
 *  toggle (contact.213/212). */
export function VisitBooking({
  action,
  copy,
  hours,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  contact,
}: VisitBookingProps) {
  const bodyId = useId();
  const tick = useMinuteTick();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const days = tick === null ? null : nextOpenDates(new Date(tick * 60_000), hours, 5);
  // The design opens with day 1 filled (Contact Us l. 1015); the visitor's own pick wins.
  const chosenDay = day ?? days?.[0] ?? null;
  return (
    <div
      data-testid="contact-visit"
      className="grid grid-cols-1 items-center gap-6 rounded-lg border border-border-1 bg-white p-6 md:p-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-9"
    >
      <div>
        <p className="m-0 mb-3 inline-flex rounded-pill border border-tint-border bg-tint px-3 py-1 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-blue-safe">
          {copy.eyebrow}
        </p>
        <h3 className="m-0 mb-2 text-card-title">{copy.title}</h3>
        <p className="m-0 text-body-sm text-text-tertiary">{copy.body}</p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((v) => !v)}
          className="mt-4 flex min-h-[50px] w-full items-center justify-center rounded-xs border-[1.5px] border-tint-border bg-tint px-3 text-body-sm font-extrabold text-blue-safe md:hidden"
        >
          {open ? copy.toggleClose : copy.toggleOpen}
        </button>
      </div>
      <div id={bodyId} className={open ? 'min-w-0' : 'min-w-0 max-md:hidden'}>
        <FormShell
          action={action}
          formKey="visit"
          idScope="contact-visit"
          locale={locale}
          turnstileSiteKey={turnstileSiteKey}
          whatsappNumber={whatsappNumber}
          whatsappIntro={copy.fallbackIntro}
          contact={contact}
          submitLabel={copy.submit}
          consent="checkbox"
          consentStyle="box"
          submitVariant="tint"
          submitShape="rect"
          submitRadius={11}
          submitFullWidth={false}
          headingLevel={3}
          testId="contact-visit-form"
        >
          {days ? (
            <RadioChips
              name="preferredDate"
              legend={copy.dayLegend}
              value={chosenDay}
              onChange={setDay}
              inlineLegend
              compact
              options={days.map((iso) => ({ value: iso, label: formatVisitDay(iso, locale) }))}
            />
          ) : (
            <Field name="preferredDate" label={copy.dayLegend} maxLength={40} />
          )}
          <RadioChips
            name="preferredTime"
            legend={copy.timeLegend}
            value={time}
            onChange={setTime}
            inlineLegend
            compact
            options={VISIT_SLOTS.map((s) => ({ value: s, label: s }))}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field
              name="name"
              label={copy.nameLabel}
              required
              autoComplete="name"
              maxLength={120}
            />
            <Field
              name="email"
              type="email"
              label={copy.emailLabel}
              required
              autoComplete="email"
              inputMode="email"
              maxLength={254}
            />
            <Field
              name="phone"
              type="tel"
              label={copy.phoneLabel}
              required
              autoComplete="tel"
              inputMode="tel"
              maxLength={40}
            />
          </div>
        </FormShell>
      </div>
    </div>
  );
}
