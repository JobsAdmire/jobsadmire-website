import type { ReactNode } from 'react';
import type { ButtonVariant } from '@/design/primitives/Button';
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

/** The card heads: the design's 135° track gradients (#1899D5 → #1073a8, #16a34a → #12813c,
 *  #35468a → #253063) in their contrast-safe forms — white copy at full opacity (D20: white on
 *  the design's #1899D5 / #16a34a is 3.2 / 3.3:1). */
const HEAD: Record<TrackKey, string> = {
  hr: 'bg-gradient-to-br from-blue-safe to-blue-deep',
  sourcing: 'bg-gradient-to-br from-success-text to-success-deep',
  institute: 'bg-gradient-to-br from-[#35468a] to-indigo',
};
const EDGE: Record<TrackKey, string> = {
  hr: 'border-tint-border',
  sourcing: 'border-[#c9e8d6]',
  institute: 'border-[#ccd6ea]',
};
/** The submit's face per track (S6.3: full width, r10, the track colour — `FormShell`'s
 *  `submitVariant`): the contrast-safe blue, the contrast-safe green; the institute's #35468a
 *  (8.6:1 under white, #253063 on hover) has no `Button` variant, so its card reaches the submit
 *  and the tick boxes from its own wrapper (`TRACK_FORM`). */
const SUBMIT: Record<TrackKey, ButtonVariant> = {
  hr: 'primary',
  sourcing: 'success-solid',
  institute: 'primary',
};
const TRACK_FORM: Record<TrackKey, string> = {
  hr: '',
  sourcing: '[&_input[type=checkbox]]:accent-success-text',
  institute:
    '[&_button[type=submit]]:bg-[#35468a] [&_button[type=submit]:hover]:bg-indigo [&_input[type=checkbox]]:accent-[#35468a]',
};

/** The design's form card (ll. 697–725): r20 (r18 on phones), the gradient head with the 21 px
 *  title and the reply line, the body padded 26/30/24. Its id is the design's anchor
 *  (`#apply-hr` …), the phone-only jump links' target — the card, so the head lands in view with
 *  the form. */
function FormCard({ track, tf, children }: { track: TrackKey; tf: Tf; children: ReactNode }) {
  return (
    <div
      id={FORM_ANCHOR[track]}
      className={`scroll-mt-24 overflow-hidden rounded-lg border bg-white shadow-[0_24px_60px_rgba(22,60,90,0.14)] max-md:rounded-md max-md:shadow-[0_10px_26px_rgba(22,60,90,0.1)] xl:shadow-[0_18px_45px_rgba(22,60,90,0.14)] ${EDGE[track]}`}
    >
      <div
        className={`px-[30px] py-[22px] max-md:px-[18px] max-md:py-[17px] xl:px-[22.5px] xl:py-[16.5px] ${HEAD[track]}`}
      >
        <h3 className="m-0 mb-[5px] text-[21px] font-extrabold text-white max-md:text-[18.5px] xl:mb-[3.75px] xl:text-[15.75px]">
          {tf(PANEL_COPY[track].formTitle)}
        </h3>
        <p className="m-0 text-[14px] text-white max-md:text-[13px] xl:text-[11px]">
          {tf(PANEL_SHARED.sla)}
        </p>
      </div>
      <div
        className={`px-[30px] pt-[26px] pb-6 max-md:px-[18px] max-md:pt-[18px] max-md:pb-5 xl:px-[22.5px] xl:pt-[19.5px] ${TRACK_FORM[track]}`}
      >
        {children}
      </div>
    </div>
  );
}

/** The shell props every track shares: its door key (W3), its own id scope (W79), the package's
 *  submit copy (partner.092 — it ends with its own →), the design's full-width r10 submit in the
 *  track colour (S6.3), the consent checkbox (W79; `consentLinkHref` left at `/privacy`) in the
 *  kernel's compact line (S6.6), the fallback panel's heading one level under the card's h3. */
function shellProps(track: TrackKey, locale: Locale, tf: Tf, door: FormDoor) {
  return {
    formKey: FORM_KEY_BY_TRACK[track],
    idScope: FORM_ID_SCOPE[track],
    locale,
    turnstileSiteKey: door.turnstileSiteKey,
    whatsappNumber: door.whatsappNumber,
    contact: door.contact,
    submitLabel: tf(PANEL_SHARED.submit),
    submitVariant: SUBMIT[track],
    submitShape: 'rect' as const,
    submitRadius: 10 as const,
    consent: 'checkbox' as const,
    headingLevel: 4 as const,
    testId: `partner-form-${track}`,
  };
}

/** The design's side-by-side pair (`grid 1fr 1fr`, gap 13), stacked below 901 px. */
const PAIR = 'grid gap-3 lg:grid-cols-2';

/** HR agency → `hire` + `iAm: 'hr_agency'` + `country: 'TR'` (W3, in the mapper — the form asks
 *  for the city in Türkiye only). The design's fields in its order (ll. 712–718): agency name;
 *  contact person | city; work e-mail; phone; the roles box. Labels are the package's (W115),
 *  visually hidden, their words the placeholders (SHARED 4.1). */
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
        <div className={PAIR}>
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

/** Sourcing partner → `partner` + `track: 'sourcing'` (W16), the design's fields in its order
 *  (ll. 792–800): agency name; contact person | country (the ISO-2 select, W3/W25); the licence
 *  number (catalog `licence`, required here); e-mail | phone; the trades box — then the
 *  licence/no-fee declaration as its own required tick before the kernel's consent row (W79).
 *  Placeholder-only (SHARED 4.1): each label is visually hidden and names the field. */
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
        <div className={PAIR}>
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
        <div className={PAIR}>
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
        </div>
        <Field name="trades" as="textarea" rows={3} label={tf(l.trades)} maxLength={CAPS.trades} />
        <DeclarationCheckbox name={DECLARATION_FIELD} label={tf(DECLARATION_ID)} />
      </FormShell>
    </FormCard>
  );
}

/** Training institute → `partner` + `track: 'institute'` (W16), the design's fields in its order
 *  (ll. 878–886): institute name; contact person | country — the design's one "City, country"
 *  box is the required ISO-2 select (the catalog's `country`); e-mail | phone; the trades box.
 *  No licence, no declaration. Placeholder-only (SHARED 4.1). */
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
          required
          autoComplete="organization"
          maxLength={CAPS.company}
        />
        <div className={PAIR}>
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
        <div className={PAIR}>
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
        </div>
        <Field name="trades" as="textarea" rows={3} label={tf(l.trades)} maxLength={CAPS.trades} />
      </FormShell>
    </FormCard>
  );
}
