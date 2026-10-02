import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';
import { PORTFOLIO_GATE_RELAXED, type PublicOpening } from '@/lib/careers-pure';
import { mailLink, waLink } from '@/lib/contact';
import type { Tf } from '../../_lib/roles';
import { ApplyStartPing } from '../_components/ApplyStartPing';
import type { OpeningView } from '../_lib/view';

type ApplySettings = {
  whatsappNumber: string;
  careersEmail: string;
  phone: string;
  phoneDisplay: string;
  turnstileSiteKey: string | null;
};

/** W56: the apply-by-e-mail panel for an opening that needs a portfolio document. */
function EmailApply({
  t,
  settings,
  title,
  whatsappText,
}: {
  t: Tf;
  settings: ApplySettings;
  title: string;
  whatsappText: string;
}) {
  const sys = useTranslations('sys');
  const subject = sys('careers.emailPanel.subject', { title });
  return (
    <div
      data-testid="careers-email-apply"
      className="rounded-lg border-[1.5px] border-dashed border-tint-border bg-white p-6 md:p-8"
    >
      <h3 className="text-card-title text-ink">{sys('careers.emailPanel.title')}</h3>
      <p className="mt-2 mb-3 text-body-sm text-text-secondary">
        {sys('careers.emailPanel.body', { email: settings.careersEmail })}
      </p>
      <p className="mb-5 rounded-sm bg-pale-1 px-3 py-2 font-mono text-body-sm text-ink">
        {subject}
      </p>
      <div className="flex flex-wrap gap-3">
        <ContactCta placement="page_cta" href={mailLink(settings.careersEmail, subject)} size="lg">
          {sys('careers.emailPanel.email')}
        </ContactCta>
        <ContactCta
          placement="page_cta"
          href={waLink(settings.whatsappNumber, whatsappText)}
          external
          variant="secondary"
          size="lg"
        >
          {t('jt.117')}
        </ContactCta>
      </div>
    </div>
  );
}

/**
 * `#apply` on the detail page: the form → `careers` (W3), or — for a `portfolioRequired` opening —
 * the e-mail panel (W56). The country select offers ONLY the opening's country (the residency
 * lock — a `Field` with its `defaultValue`, W108); the expected salary is rendered and required
 * for Pakistan openings only; `portfolioUrl` is the v1.1 field; the consent tick links `/privacy`
 * (the kernel's default, W79/W102). Labels are `sys.form.labels.*` (W115: the package has none
 * for this form). The fallback panel's WhatsApp prefill starts with the role (page data) and
 * adds what the visitor typed only at click time (W76).
 */
export function ApplySection({
  t,
  locale,
  opening,
  view,
  settings,
  action,
}: {
  t: Tf;
  locale: Locale;
  opening: PublicOpening;
  view: OpeningView;
  settings: ApplySettings;
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
}) {
  const sys = useTranslations('sys');
  const whatsappIntro = sys('careers.detail.whatsappIntro', { title: opening.title });
  const byEmail = opening.portfolioRequired && !PORTFOLIO_GATE_RELAXED;
  return (
    <Section tone="pale" id="apply" className="scroll-mt-24 border-t border-border-3">
      <div className="container-site">
        <div data-testid="careers-detail-apply" className="max-w-[860px]">
          <h2 className="mb-2 text-h2 leading-[1.05] tracking-[-0.04em] max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px]">
            {t('jt.052')}
          </h2>
          <p className="mb-6 text-body text-text-secondary">{sys('careers.detail.applyLead')}</p>
          {byEmail ? (
            <EmailApply
              t={t}
              settings={settings}
              title={opening.title}
              whatsappText={whatsappIntro}
            />
          ) : (
            <div className="rounded-lg border-[1.5px] border-tint-border bg-white p-6 shadow-[0_18px_44px_rgba(22,60,90,0.1)] md:p-8">
              <FormShell
                action={action}
                formKey="careers"
                locale={locale}
                turnstileSiteKey={settings.turnstileSiteKey}
                whatsappNumber={settings.whatsappNumber}
                whatsappIntro={whatsappIntro}
                contact={{
                  phone: settings.phone,
                  phoneDisplay: settings.phoneDisplay,
                  email: settings.careersEmail,
                }}
                submitLabel={t('jt.103')}
                consent="checkbox"
                testId="careers-apply-form"
              >
                <ApplyStartPing slug={opening.slug} />
                <input type="hidden" name="openingSlug" defaultValue={opening.slug} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="name" required autoComplete="name" maxLength={200} />
                  <Field
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    maxLength={254}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={40}
                  />
                  <Field
                    name="country"
                    as="select"
                    required
                    defaultValue={opening.country}
                    options={[{ value: opening.country, label: view.countryName }]}
                    hint={sys('careers.form.residency', { country: view.countryName })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="city" autoComplete="address-level2" maxLength={100} />
                  <Field name="language" maxLength={300} />
                </div>
                {opening.country === 'PK' && (
                  <Field
                    name="expectedSalary"
                    required
                    inputMode="numeric"
                    maxLength={15}
                    hint={sys('careers.form.expectedSalaryHint', {
                      currency: view.salaryCurrency ?? 'PKR',
                    })}
                  />
                )}
                <Field name="cv" type="file" accept="application/pdf,.pdf" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="linkedinUrl" type="url" inputMode="url" maxLength={500} />
                  <Field name="portfolioUrl" type="url" inputMode="url" maxLength={500} />
                </div>
                <Field name="coverLetter" as="textarea" rows={5} maxLength={5000} />
              </FormShell>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
