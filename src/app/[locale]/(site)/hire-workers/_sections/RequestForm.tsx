import { ContactLink } from '@/analytics/ContactLink';
import { getCollection } from '@/content/collections';
import { Section } from '@/design/primitives/Section';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CheckIcon } from '../_components/icons';
import { dialOptions } from '../_lib/countries';
import { submitHireFull } from '../actions';

const STEPS = [
  ['hire.202', 'hire.203'],
  ['hire.204', 'hire.205'],
  ['hire.206', 'hire.207'],
] as const;

const TILE =
  'min-w-0 items-center gap-3 rounded-xs border border-border-2 bg-pale-1 px-3.5 py-3 no-underline hover:bg-tint';
// D20: the tiles are bg-pale-1, where text-tertiary is 4.49:1 — the labels use text-secondary
const TILE_LABEL = 'block text-body-sm font-bold uppercase tracking-[0.5px] text-text-secondary';
const TILE_VALUE = 'block truncate text-body font-extrabold text-ink';

export function RequestForm({
  bundle,
  locale,
  tf,
  dialLabel,
  startWhenOptions,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** sys.hire.form.dial — resolved by the page */
  dialLabel: string;
  /** START_WHEN_KEYS (W78) with their sys.form.options.startWhen.* labels — resolved by the page */
  startWhenOptions: FieldOption[];
}) {
  const s = bundle.settings;
  const sectors: FieldOption[] = getCollection(bundle, 'sectors').map((row) => ({
    value: row.key,
    label: tf(row.labelId),
  }));
  const dials = dialOptions(getCollection(bundle, 'countries'), locale);
  // W95: the subject only — the design's sendByEmail body (hire.254–263 + the typed fields)
  // would put visitor data into a DOM href.
  const mailto = mailLink(s.email, tf('hire.253'));
  return (
    <Section
      tone="light"
      id="request-form"
      className="scroll-mt-20 bg-gradient-to-b from-pale-1 to-white to-55%"
    >
      <div
        data-testid="hire-request"
        className="container-site grid lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-[auto_1fr] lg:gap-x-16"
      >
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="m-0 mb-4 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-4 py-1.5 text-body-sm font-extrabold text-success-text">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
            {tf('hire.199')}
          </p>
          <h2 className="m-0 mb-4 text-h2 leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px] max-md:mb-2.5 max-md:text-[25px] max-md:leading-[1.13] max-md:tracking-[-0.5px]">
            {tf('hire.200')}
          </h2>
          <p className="m-0 mb-7 text-body-lg text-text-secondary">{tf('hire.201')}</p>
        </div>
        <div className="mb-8 overflow-hidden rounded-lg border border-border-1 bg-white shadow-card-hover lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mb-0 lg:self-start">
          <div className="bg-blue-safe px-8 py-6 text-white max-md:px-5 max-md:py-4">
            <h3 className="m-0 mb-1 text-card-title">{tf('hire.214')}</h3>
            <p className="m-0 text-body-sm text-white">{tf('hire.215')}</p>
          </div>
          <div className="px-8 pb-6 pt-7 max-md:px-4 max-md:pb-5 max-md:pt-5">
            <FormShell
              action={submitHireFull}
              formKey="hire"
              idScope="hire-full"
              locale={locale}
              turnstileSiteKey={s.turnstileSiteKey}
              whatsappNumber={s.whatsappNumber}
              whatsappIntro={tf('hire.249')}
              contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
              submitLabel={tf('hire.063')}
              consent="checkbox"
              headingLevel={4}
              testId="hire-form-full"
            >
              <Field
                name="company"
                label={tf('hire.047')}
                required
                autoComplete="organization"
                maxLength={200}
              />
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="name"
                  label={tf('hire.053')}
                  required
                  autoComplete="name"
                  maxLength={120}
                />
                <Field
                  name="email"
                  label={tf('hire.052')}
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                />
              </div>
              <div className="grid gap-2.5 sm:grid-cols-[minmax(120px,0.45fr)_1fr]">
                {/* ISO-2 values (W3): +1/+7 are shared by several countries; W111: the select
                    ignores placeholder, defaultValue pre-selects Türkiye */}
                <Field
                  name="dial"
                  label={dialLabel}
                  as="select"
                  options={dials}
                  defaultValue="TR"
                  required
                  autoComplete="tel-country-code"
                />
                {/* the dial select carries the country code: no "+90 …" placeholder or hint */}
                <Field
                  name="phone"
                  label={tf('hire.051')}
                  type="tel"
                  required
                  hint=""
                  placeholder=""
                  autoComplete="tel-national"
                  inputMode="tel"
                  maxLength={32}
                />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="sector"
                  label={tf('hire.054')}
                  as="select"
                  required
                  options={sectors}
                />
                <Field name="roleNeeded" label={tf('hire.055')} required maxLength={200} />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="headcount"
                  label={tf('hire.056')}
                  type="number"
                  min={1}
                  required
                  inputMode="numeric"
                />
                <Field
                  name="city"
                  label={tf('hire.057')}
                  autoComplete="address-level2"
                  maxLength={120}
                />
              </div>
              <Field
                name="startWhen"
                label={tf('hire.058')}
                as="select"
                options={startWhenOptions}
              />
              <Field name="message" as="textarea" rows={3} maxLength={5000} />
            </FormShell>
            <p className="m-0 mt-2 text-center text-body-sm text-text-tertiary">{tf('hire.219')}</p>
            <p className="m-0 mt-1 text-center text-body-sm leading-snug text-text-tertiary">
              {tf('hire.220')}
            </p>
            <p className="m-0 mt-3 text-center text-body-sm text-text-tertiary">
              {tf('hire.221')}{' '}
              <ContactLink
                href={mailto}
                placement="page_cta"
                className="font-extrabold text-blue-safe underline"
              >
                {tf('hire.222')}
              </ContactLink>
            </p>
          </div>
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <ol className="m-0 flex list-none flex-col gap-4 p-0 max-md:hidden">
            {STEPS.map(([lead, tail], i) => (
              <li key={lead} className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-pill bg-blue-safe text-body-sm font-extrabold text-white"
                >
                  {i + 1}
                </span>
                <span className="text-body text-text-secondary">
                  <strong className="text-ink">{tf(lead)}</strong> {tf(tail)}
                </span>
              </li>
            ))}
          </ol>
          <ul className="m-0 mt-7 flex list-none flex-col gap-3 border-t border-border-1 p-0 pt-6 text-body text-text-secondary max-md:mt-0 max-md:border-t-0 max-md:pt-0">
            {(['hire.208', 'hire.209', 'hire.210'] as const).map((id) => (
              <li key={id} className="flex items-start gap-2.5">
                <CheckIcon size={15} className="mt-1 flex-none text-success" />
                <span>{tf(id)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 border-t border-border-1 pt-6">
            {/* on the section's pale → white gradient: text-secondary, never tertiary (D20) */}
            <p className="m-0 mb-3 text-body-sm font-extrabold uppercase tracking-[0.6px] text-text-secondary">
              {tf('hire.211')}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* ≤ 700 px the phone tile hides — the mobile bottom bar carries the call */}
              <ContactLink
                href={telLink(s.phone)}
                placement="page_cta"
                className={`flex ${TILE} max-md:hidden`}
              >
                <span className="block min-w-0">
                  <span className={TILE_LABEL}>{tf('hire.212')}</span>
                  <span className={TILE_VALUE}>{s.phoneDisplay}</span>
                </span>
              </ContactLink>
              <ContactLink href={mailto} placement="page_cta" className={`flex ${TILE}`}>
                <span className="block min-w-0">
                  <span className={TILE_LABEL}>{tf('hire.213')}</span>
                  <span className={TILE_VALUE}>{s.email}</span>
                </span>
              </ContactLink>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
