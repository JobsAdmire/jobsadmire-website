import { ContactCta } from '@/design/blocks/ContactCta';
import { Button } from '@/design/primitives/Button';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { submitHireQuick } from '../actions';

/** Design `.ja-quote-card`. ≤ 700 px the design swaps the form for "Request workers →" +
 *  "Ask on WhatsApp" + the trust trio; both halves are server-rendered and CSS decides (W10):
 *  the form half hides with `max-md:hidden`, the CTA half with `md:hidden` (W119 — never
 *  `hidden` beside a base display utility). */
export function QuickQuote({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const s = bundle.settings;
  const trust = (
    <p className="m-0 flex flex-wrap items-center justify-center gap-x-2 text-body-sm text-text-tertiary">
      <span>{tf('hire.042')}</span>
      <span aria-hidden="true">·</span>
      <span>{tf('hire.043')}</span>
      <span aria-hidden="true">·</span>
      <span>{tf('hire.044')}</span>
    </p>
  );
  return (
    <div
      data-testid="hire-quick-card"
      className="overflow-hidden rounded-hero border border-white/10 bg-white text-ink shadow-hero-form max-md:rounded-lg"
    >
      <div className="bg-blue-safe px-7 py-5 text-white max-md:px-5 max-md:py-4">
        <h2 className="m-0 mb-1 text-card-title">{tf('hire.037')}</h2>
        <p className="m-0 text-body-sm text-white">
          <span className="max-md:hidden">{tf('hire.038')}</span>
          <span className="md:hidden">{tf('hire.039')}</span>
        </p>
      </div>
      <div className="px-7 py-6 max-md:px-5 max-md:py-5">
        <div data-testid="hire-quick-mobile" className="flex flex-col gap-2.5 md:hidden">
          {/* D20: the design's green face is white on #16a34a (3.3:1) — the primary face instead */}
          <Button variant="primary" size="lg" href="#request-form" className="w-full">
            {tf('hire.040')}
          </Button>
          <ContactCta
            placement="page_cta"
            href={waLink(s.whatsappNumber, tf('hire.250'))}
            variant="success"
            external
            className="w-full"
          >
            {tf('hire.041')}
          </ContactCta>
          {trust}
        </div>
        <div data-testid="hire-quick-desktop" className="max-md:hidden">
          <FormShell
            action={submitHireQuick}
            formKey="hire"
            idScope="hire-quick"
            locale={locale}
            turnstileSiteKey={s.turnstileSiteKey}
            whatsappNumber={s.whatsappNumber}
            whatsappIntro={tf('hire.250')}
            contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
            submitLabel={tf('hire.063')}
            consent="checkbox"
            testId="hire-form-quick"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                name="company"
                label={tf('hire.047')}
                required
                autoComplete="organization"
                maxLength={200}
              />
              <Field
                name="city"
                label={tf('hire.048')}
                required
                autoComplete="address-level2"
                maxLength={120}
              />
            </div>
            <Field
              name="name"
              label={tf('hire.053')}
              required
              autoComplete="name"
              maxLength={120}
            />
            <Field name="roleNeeded" label={tf('hire.049')} required maxLength={200} />
            <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
              <Field
                name="headcount"
                label={tf('hire.050')}
                type="number"
                min={1}
                required
                inputMode="numeric"
              />
              {/* hint="" drops the kernel's "include the country code" hint: a Turkish national
                  number is normalised to +90 (phone.ts) */}
              <Field
                name="phone"
                label={tf('hire.051')}
                type="tel"
                required
                hint=""
                autoComplete="tel"
                inputMode="tel"
                maxLength={40}
              />
            </div>
            <Field
              name="email"
              label={tf('hire.052')}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              maxLength={254}
            />
          </FormShell>
          <div className="mt-3">{trust}</div>
          <a
            href="#request-form"
            className="mt-4 block border-t border-border-3 pt-4 text-center text-body-sm font-bold text-blue-safe no-underline hover:text-ink"
          >
            {tf('hire.066')}
          </a>
        </div>
      </div>
    </div>
  );
}
