import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
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

/** The kernel's light field face, turned dark inside the navy report box (S4.1) WITHOUT
 *  touching `src/forms/client/*` or appending a colliding class to a field (W122): descendant
 *  rules on the form outrank the fields' single-class utilities by specificity — `.box input`
 *  (0,1,1) over `bg-field-fill`/`lg:bg-white`/`text-ink` (0,1,0) — while the kernel's own
 *  `focus:border-blue` and the invalid edge (0,2,0) still win over the dark edge, and the
 *  invalid edge is re-tinted (0,2,1) for the navy. Errors, the consent copy and its link take
 *  contrast-safe tints on navy (#fca5a5 9:1, white/75, sky); the D11 fallback panel keeps its own
 *  light card. */
const DARK_FORM = [
  '[&_:is(input,textarea)]:border-white/20',
  '[&_:is(input,textarea)]:bg-white/[0.07]',
  '[&_:is(input,textarea)]:text-white',
  '[&_:is(input,textarea)]:placeholder:text-white/65',
  '[&_:is(input,textarea)[aria-invalid=true]]:border-[#fca5a5]',
  '[&_p[role=alert]]:text-[#fca5a5]',
  '[&_[data-form-alert]]:border-[#fca5a5]',
  '[&_[data-form-alert]]:text-[#fca5a5]',
  '[&_label]:text-white/75',
  '[&_label_a]:text-sky',
].join(' ');

/** The design's 24 px numbered badge (Verify ll. 886–899; 22 px ≤ 700, l. 438), centred on the
 *  first line of the field beside it (50 / 46 / 44 px tall by band). */
function Numbered({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex items-start gap-[11px] max-md:gap-2.5">
      <span
        aria-hidden="true"
        className="mt-[13px] flex size-6 shrink-0 items-center justify-center rounded-[7px] border border-white/[0.28] bg-white/[0.14] text-[12px] font-extrabold text-white max-md:size-[22px] max-md:rounded-[6px] max-md:text-[11px] lg:mt-[11px] xl:mt-[10px] xl:text-[11px]"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/**
 * The `fraud` door form (W3/W79/W101/W115) in the report box's look (S4.1): no white inner panel —
 * dark, placeholder-only fields with visually hidden labels (the kernel's default face, SHARED
 * 4.1), the box's three "send us" items as its first three fields with the design's 1–3 badges
 * (V-7: the package's own labels verify.094–096, passed as `label`), then the reply channel the
 * site requires (V-2: name + e-mail, `sys.form.labels.*`, W30), the localised evidence button, the
 * kernel's consent checkbox (W79) and an r12 white submit. The design shows no phone field and the
 * catalog does not require one, so `reporterPhone` is not asked (the schema keeps it optional).
 * Success navigates to `/tesekkurler?form=fraud` (D13); every other answer is the D11 panel, its
 * WhatsApp prefill (verify.229 + what was typed) composed on click (W76). The fallback heading is
 * an h4 under the box's h3.
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
      submitVariant="white"
      submitShape="rect"
      submitRadius={12}
      headingLevel={4}
      testId="fraud-form"
      className={`mb-[22px] ${DARK_FORM}`}
    >
      <Numbered n={1}>
        <Field name="suspectName" label={t('verify.094')} maxLength={200} autoComplete="off" />
      </Numbered>
      <Numbered n={2}>
        <Field name="suspectContact" label={t('verify.095')} maxLength={300} autoComplete="off" />
      </Numbered>
      <Numbered n={3}>
        <Field
          name="description"
          as="textarea"
          rows={3}
          required
          minLength={DESCRIPTION_MIN}
          maxLength={DESCRIPTION_MAX}
          label={t('verify.096')}
        />
      </Numbered>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Field name="reporterName" required maxLength={120} autoComplete="name" />
        <Field
          name="reporterEmail"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          inputMode="email"
        />
      </div>
      <EvidenceUpload upload={uploadEvidence} />
    </FormShell>
  );
}
