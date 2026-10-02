import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { EvidenceUpload } from '../_components/EvidenceUpload';
import type { UploadEvidenceAction } from '../_lib/evidence';
import { DESCRIPTION_MAX, DESCRIPTION_MIN } from '../_lib/fraud';

export type FraudAction = (prev: FormActionState, data: FormData) => Promise<FormActionState>;

/**
 * The `fraud` door form (W3/W79/W101/W115). The report box's three "send us" items are its first
 * three fields (V-7: the package's own labels verify.094–096, passed as `label`); the reporter
 * fields and the evidence input have no package label and read `sys.form.labels.*` (W30). Consent
 * is the kernel's checkbox (the default, W79); success navigates to `/tesekkurler?form=fraud`
 * (D13); every other answer is the D11 panel, its WhatsApp prefill (verify.229 + what was typed)
 * composed on click (W76). The fallback heading is an h4 under the box's h3.
 */
export function FraudForm({
  bundle,
  locale,
  submitFraud,
  uploadEvidence,
}: {
  bundle: Bundle;
  locale: Locale;
  submitFraud: FraudAction;
  uploadEvidence: UploadEvidenceAction;
}) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  return (
    <FormShell
      action={submitFraud}
      formKey="fraud"
      locale={locale}
      turnstileSiteKey={settings.turnstileSiteKey}
      whatsappNumber={settings.whatsappNumber}
      whatsappIntro={t('verify.229')}
      contact={{
        phone: settings.phone,
        phoneDisplay: settings.phoneDisplay,
        email: settings.email,
      }}
      submitLabel={sys('verify.report.submit')}
      headingLevel={4}
      testId="fraud-form"
      className="rounded-base bg-white p-5 text-ink"
    >
      <Field name="suspectName" label={t('verify.094')} maxLength={200} autoComplete="off" />
      <Field name="suspectContact" label={t('verify.095')} maxLength={300} autoComplete="off" />
      <Field
        name="description"
        as="textarea"
        rows={5}
        required
        minLength={DESCRIPTION_MIN}
        maxLength={DESCRIPTION_MAX}
        label={t('verify.096')}
      />
      <Field name="reporterName" required maxLength={120} autoComplete="name" />
      <Field
        name="reporterEmail"
        type="email"
        required
        maxLength={254}
        autoComplete="email"
        inputMode="email"
      />
      <Field name="reporterPhone" type="tel" maxLength={40} autoComplete="tel" inputMode="tel" />
      <EvidenceUpload upload={uploadEvidence} />
    </FormShell>
  );
}
