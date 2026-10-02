import type { ReactNode } from 'react';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { DeclarationCheckbox } from '../_components/DeclarationCheckbox';
import { DECLARATION_ID, FIELD_LABELS, PANEL_COPY, PANEL_SHARED, type Tf } from '../_lib/content';
import { CAPS, DECLARATION_FIELD } from '../_lib/forms';
import { FORM_ANCHOR, FORM_ID_SCOPE, FORM_KEY_BY_TRACK, type TrackKey } from '../_lib/tracks';
import { submitHrAgency, submitInstitute, submitSourcingPartner } from '../actions';

/** What every shell takes from `bundle.settings`: the Turnstile key (null → no widget) and the
 *  D11 fallback panel's WhatsApp number and contact rows. */
export type FormDoor = {
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  contact: { phone: string; phoneDisplay: string; email: string };
};

/** The card heads: white copy at full opacity on AA grounds (D20 — white on the design's
 *  #1899D5 / #16a34a is 3.2 / 3.3:1). */
const HEAD: Record<TrackKey, string> = {
  hr: 'bg-blue-safe',
  sourcing: 'bg-success-text',
  institute: 'bg-gradient-to-br from-[#35468a] to-[#253063]',
};
const EDGE: Record<TrackKey, string> = {
  hr: 'border-tint-border',
  sourcing: 'border-[#c9e8d6]',
  institute: 'border-[#ccd6ea]',
};

/** The design's form card; its id is the design's anchor (`#apply-hr` …), the phone-only jump
 *  links' target — the card, so the head lands in view with the form. */
function FormCard({ track, tf, children }: { track: TrackKey; tf: Tf; children: ReactNode }) {
  return (
    <div
      id={FORM_ANCHOR[track]}
      className={`scroll-mt-24 overflow-hidden rounded-lg border bg-white shadow-[0_24px_60px_rgba(22,60,90,0.14)] xl:shadow-[0_18px_45px_rgba(22,60,90,0.14)] ${EDGE[track]}`}
    >
      <div className={`px-5 py-5 lg:px-7 ${HEAD[track]}`}>
        <h3 className="m-0 text-card-title font-extrabold text-white">
          {tf(PANEL_COPY[track].formTitle)}
        </h3>
        <p className="m-0 mt-1 text-body-sm text-white">{tf(PANEL_SHARED.sla)}</p>
      </div>
      <div className="px-5 py-6 lg:px-7">{children}</div>
    </div>
  );
}

/** The shell props every track shares: its door key (W3), its own id scope (W79), the package's
 *  submit copy (partner.092), the consent checkbox (W79; `consentLinkHref` left at `/privacy`),
 *  the fallback panel's heading one level under the card's h3. */
function shellProps(track: TrackKey, locale: Locale, tf: Tf, door: FormDoor) {
  return {
    formKey: FORM_KEY_BY_TRACK[track],
    idScope: FORM_ID_SCOPE[track],
    locale,
    turnstileSiteKey: door.turnstileSiteKey,
    whatsappNumber: door.whatsappNumber,
    contact: door.contact,
    submitLabel: tf(PANEL_SHARED.submit),
    consent: 'checkbox' as const,
    headingLevel: 4 as const,
    testId: `partner-form-${track}`,
  };
}

/** HR agency → `hire` + `iAm: 'hr_agency'` + `country: 'TR'` (W3, in the mapper — the form asks
 *  for the city in Türkiye only). Labels are the package's (W115). */
export function HrAgencyForm({ locale, tf, door }: { locale: Locale; tf: Tf; door: FormDoor }) {
  const l = FIELD_LABELS.hr;
  return (
    <FormCard track="hr" tf={tf}>
      <FormShell action={submitHrAgency} {...shellProps('hr', locale, tf, door)}>
        <Field
          name="company"
          label={tf(l.company)}
          required
          autoComplete="organization"
          maxLength={CAPS.company}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            name="name"
            label={tf(l.name)}
            required
            autoComplete="name"
            maxLength={CAPS.name}
          />
          <Field
            name="city"
            label={tf(l.city)}
            required
            autoComplete="address-level2"
            maxLength={CAPS.city}
          />
        </div>
        <Field
          name="email"
          type="email"
          label={tf(l.email)}
          required
          autoComplete="email"
          inputMode="email"
          maxLength={CAPS.email}
        />
        <Field
          name="phone"
          type="tel"
          label={tf(l.phone)}
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={CAPS.phone}
        />
        <Field
          name="message"
          as="textarea"
          rows={3}
          label={tf(l.message)}
          maxLength={CAPS.message}
        />
      </FormShell>
    </FormCard>
  );
}

/** Sourcing partner → `partner` + `track: 'sourcing'` (W16): the ISO-2 country select (W3/W25),
 *  the licence number (catalog `licence`, required here), `candidatesPerYear` (catalog, sys label)
 *  beside the free-text `trades`, and the licence/no-fee declaration as its own required tick
 *  before the kernel's consent row (W79). The phone placeholder is blank: the kernel's `+90`
 *  example would mislead an agent abroad (the phone hint asks for the country code). */
export function SourcingPartnerForm({
  locale,
  tf,
  door,
  countries,
}: {
  locale: Locale;
  tf: Tf;
  door: FormDoor;
  countries: FieldOption[];
}) {
  const l = FIELD_LABELS.sourcing;
  return (
    <FormCard track="sourcing" tf={tf}>
      <FormShell action={submitSourcingPartner} {...shellProps('sourcing', locale, tf, door)}>
        <Field
          name="company"
          label={tf(l.company)}
          required
          autoComplete="organization"
          maxLength={CAPS.company}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            name="name"
            label={tf(l.name)}
            required
            autoComplete="name"
            maxLength={CAPS.name}
          />
          <Field
            name="country"
            as="select"
            label={tf(l.country)}
            required
            options={countries}
            autoComplete="country"
          />
        </div>
        <Field
          name="licence"
          label={tf(l.licence)}
          required
          autoComplete="off"
          maxLength={CAPS.licence}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            name="email"
            type="email"
            label={tf(l.email)}
            required
            autoComplete="email"
            inputMode="email"
            maxLength={CAPS.email}
          />
          <Field
            name="phone"
            type="tel"
            label={tf(l.phone)}
            placeholder=""
            required
            autoComplete="tel"
            inputMode="tel"
            maxLength={CAPS.phone}
          />
        </div>
        <Field name="candidatesPerYear" maxLength={CAPS.candidatesPerYear} />
        <Field name="trades" as="textarea" rows={3} label={tf(l.trades)} maxLength={CAPS.trades} />
        <DeclarationCheckbox name={DECLARATION_FIELD} label={tf(DECLARATION_ID)} />
      </FormShell>
    </FormCard>
  );
}

/** Training institute → `partner` + `track: 'institute'` (W16): the design's one "City, country"
 *  box becomes an optional `city` (catalog v1.1, sys label) + the required ISO-2 select;
 *  `candidatesPerYear` beside `trades`; no licence, no declaration. Blank placeholders where the
 *  kernel's Turkish examples would mislead an institute abroad (the institute name — the
 *  `company` field —, `city`, `phone`; the contact person's `name` keeps its placeholder). */
export function InstituteForm({
  locale,
  tf,
  door,
  countries,
}: {
  locale: Locale;
  tf: Tf;
  door: FormDoor;
  countries: FieldOption[];
}) {
  const l = FIELD_LABELS.institute;
  return (
    <FormCard track="institute" tf={tf}>
      <FormShell action={submitInstitute} {...shellProps('institute', locale, tf, door)}>
        <Field
          name="company"
          label={tf(l.company)}
          placeholder=""
          required
          autoComplete="organization"
          maxLength={CAPS.company}
        />
        <Field name="name" label={tf(l.name)} required autoComplete="name" maxLength={CAPS.name} />
        <div className="grid gap-4 lg:grid-cols-2">
          <Field name="city" placeholder="" autoComplete="address-level2" maxLength={CAPS.city} />
          <Field
            name="country"
            as="select"
            label={tf(l.country)}
            required
            options={countries}
            autoComplete="country"
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            name="email"
            type="email"
            label={tf(l.email)}
            required
            autoComplete="email"
            inputMode="email"
            maxLength={CAPS.email}
          />
          <Field
            name="phone"
            type="tel"
            label={tf(l.phone)}
            placeholder=""
            required
            autoComplete="tel"
            inputMode="tel"
            maxLength={CAPS.phone}
          />
        </div>
        <Field name="candidatesPerYear" maxLength={CAPS.candidatesPerYear} />
        <Field name="trades" as="textarea" rows={3} label={tf(l.trades)} maxLength={CAPS.trades} />
      </FormShell>
    </FormCard>
  );
}
