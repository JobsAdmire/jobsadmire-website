import { useTranslations } from 'next-intl';
import { makeT, makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CrossIcon, WarningIcon } from '../_components/icons';
import type { UploadEvidenceAction } from '../_lib/evidence';
import type { Register } from '../_lib/register';
import { FraudForm, type FraudAction } from './FraudForm';

/** The five red flags as [bold lead, body] id pairs — all five at every width (V-3). */
const RED_FLAGS = [
  ['verify.081', 'verify.082'],
  ['verify.083', 'verify.084'],
  ['verify.085', 'verify.086'],
  ['verify.087', 'verify.088'],
  ['verify.089', 'verify.090'],
] as const;
/** Red flag 2's body promises "a record on this page" — the same lookup V-01's FAQ q3 and steps
 *  2–3 promise; while `representatives` has no rows it reads `sys.verify.flags.qr` (W222 (2)). */
const RECORD_PROMISE = 'verify.084';

/** `#report` — the red flags and the report box (eyebrow, question, the fraud form, the WhatsApp
 *  and phone doors, the footnote). */
export function Report({
  bundle,
  locale,
  register,
  submitFraud,
  uploadEvidence,
}: {
  bundle: Bundle;
  locale: Locale;
  register: Register;
  submitFraud: FraudAction;
  uploadEvidence: UploadEvidenceAction;
}) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  const hasRows = register.active.length > 0;
  return (
    // `id="report"`: CTA_BY_PATHNAME['/verify'] (the header's red CTA) and the sticky bar land here.
    <Section tone="light" id="report" className="scroll-mt-24">
      <div className="container-site" data-testid="verify-report">
        {/* QA W221 V-07: the design numbers its sections — verify.053 carries its own "01 · ",
            the report eyebrow takes "02 · " in the markup (Verify l. 845). */}
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-danger">
          02 · {t('verify.077')}
        </p>
        <h2 className="mt-3 mb-0 text-h2 leading-[1.06] tracking-[-0.04em] max-md:text-[25px] max-md:leading-[1.13] max-md:tracking-[-0.6px]">
          {t('verify.078')}
        </h2>
        <p className="mt-3 mb-0 max-w-[680px] text-body-lg text-text-secondary">
          {tf('verify.079')}
        </p>

        <div className="mt-7 grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-danger-border bg-white px-7 pt-6 pb-4 shadow-card-hover">
            <h3 className="m-0 flex items-center gap-2 pb-3.5 text-eyebrow font-extrabold uppercase tracking-[1.3px] text-danger">
              <WarningIcon className="shrink-0" />
              {t('verify.080')}
            </h3>
            <ul className="m-0 list-none p-0">
              {RED_FLAGS.map(([lead, body]) => (
                <li
                  key={lead}
                  className="flex items-start gap-3 border-t border-danger-surface py-3.5 text-body-sm text-text-secondary"
                >
                  <CrossIcon className="mt-[5px] shrink-0 text-danger" />
                  <p className="m-0 xl:max-w-[520px] xl:text-pretty">
                    <strong className="font-extrabold text-ink">{tf(lead)}</strong>{' '}
                    {body === RECORD_PROMISE && !hasRows ? sys('verify.flags.qr') : tf(body)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex flex-col overflow-hidden rounded-lg bg-navy p-7 text-white shadow-hero-form">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#dc2626_55%,transparent_45%)] bg-[length:22px_3px]"
            />
            <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1.3px] text-[#fca5a5]">
              {t('verify.091')}
            </p>
            <h3 className="mt-3 mb-2 text-card-title leading-[1.25] text-white">
              {t('verify.092')}
            </h3>
            <p className="mt-0 mb-5 text-body-sm text-white/70">{tf('verify.093')}</p>
            <FraudForm
              bundle={bundle}
              locale={locale}
              submitFraud={submitFraud}
              uploadEvidence={uploadEvidence}
            />
            {/* D11: the co-primary doors stay beside the form. The prefill is company copy
                (verify.229) — never anything the visitor typed (W95). */}
            <div className="mt-4 flex flex-col gap-2.5">
              <ContactCta
                placement="page_cta"
                variant="danger"
                external
                href={waLink(settings.whatsappNumber, t('verify.229'))}
              >
                {t('verify.097')}
              </ContactCta>
              <ContactCta placement="page_cta" variant="inverse" href={telLink(settings.phone)}>
                {t('verify.051')}
              </ContactCta>
            </div>
            <p className="mt-4 mb-0 border-t border-dashed border-white/20 pt-3.5 text-body-sm text-white/60">
              {tf('verify.098')}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
