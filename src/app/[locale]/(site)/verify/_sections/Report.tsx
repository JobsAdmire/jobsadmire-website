import { useTranslations } from 'next-intl';
import { makeT, makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { WhatsAppIcon } from '@/design/chrome/icons';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FlagList } from '../_components/FlagList';
import { CrossIcon, WarningIcon } from '../_components/icons';
import motion from '../_components/motion.module.css';
import type { UploadEvidenceAction } from '../_lib/evidence';
import type { Register } from '../_lib/register';
import { FraudForm, type FraudAction } from './FraudForm';

/** The five red flags as [bold lead, body] id pairs — all five in the HTML at every width (V-3);
 *  the last two fold behind "Show 2 more red flags" ≤ 700 px (M8). */
const RED_FLAGS = [
  ['verify.081', 'verify.082'],
  ['verify.083', 'verify.084'],
  ['verify.085', 'verify.086'],
  ['verify.087', 'verify.088'],
  ['verify.089', 'verify.090'],
] as const;
const FOLD_FROM = 3;
/** Red flag 2's body promises "a record on this page" — the same lookup V-01's FAQ q3 and steps
 *  2–3 promise; while `representatives` has no rows it reads `sys.verify.flags.qr` (W222 (2)). */
const RECORD_PROMISE = 'verify.084';

/** `#report` — "02 · Fraud report" (Verify ll. 841–910): the heading, then a stretched two-column
 *  grid (S4.2, `align-items: stretch`): the red-flags card and the navy report box (eyebrow,
 *  question, the fraud form, the WhatsApp and phone doors, the footnote). The section is the
 *  design's white → #fdf6f6 fade (S4.5); the box's red dashed strip runs (`jaDashMove`). */
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
    // `id="report"`: CTA_BY_PATHNAME['/verify'] (the header's red CTA) lands here.
    <Section
      tone="alert-fade"
      id="report"
      className="ja-reveal scroll-mt-24 max-md:pt-10 max-md:pb-11"
    >
      <div className="container-site" data-testid="verify-report">
        {/* QA W221 V-07: the design numbers its sections — verify.053 carries its own "01 · ",
            the report's "02" is its own span beside the eyebrow (Verify ll. 844–847). */}
        <p className="m-0 mb-3 flex items-baseline gap-3.5 text-eyebrow font-extrabold tracking-[1.6px] text-danger uppercase max-md:mb-[9px] max-md:gap-[9px] max-md:tracking-[1.2px]">
          <span>02</span>
          <span>{t('verify.077')}</span>
        </p>
        <h2 className="m-0 mb-3.5 text-[clamp(26px,2.9vw,36px)] leading-[1.06] tracking-[-1.5px] max-md:text-[25px] max-md:leading-[1.13] max-md:tracking-[-0.6px] xl:text-[clamp(19.5px,2.175vw,27px)] xl:tracking-[-1.1px]">
          {t('verify.078')}
        </h2>
        <p className="m-0 mb-7 max-w-[680px] text-[17px] leading-[1.62] text-text-secondary max-md:mb-[18px] max-md:text-[14.5px] max-md:leading-[1.55] xl:max-w-[510px] xl:text-[12.75px]">
          {tf('verify.079')}
        </p>

        <div className="grid items-stretch gap-5 max-md:gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border-[1.5px] border-danger-border bg-white px-[30px] pt-6 pb-4 shadow-[0_16px_40px_rgba(127,29,29,0.07)] max-md:rounded-base max-md:px-4 max-md:pt-4 max-md:pb-2">
            <h3 className="m-0 flex items-center gap-[9px] pb-3.5 text-[11.5px] font-extrabold tracking-[1.3px] text-danger uppercase max-md:mb-1 max-md:inline-flex max-md:gap-2 max-md:rounded-pill max-md:border max-md:border-danger-border max-md:bg-danger-surface max-md:py-1.5 max-md:pr-[13px] max-md:pl-[11px] max-md:text-[10.5px] max-md:tracking-[1.1px] xl:text-[11px]">
              <WarningIcon className="shrink-0" />
              {t('verify.080')}
            </h3>
            <FlagList
              foldFrom={FOLD_FROM}
              moreLabel={t('verify.231')}
              lessLabel={t('verify.230')}
              items={RED_FLAGS.map(([lead, body]) => ({
                key: lead,
                content: (
                  <>
                    {/* ≤ 700 the ✕ sits in a 22 px tinted chip (Verify l. 428) */}
                    <span className="mt-[5px] flex shrink-0 text-danger max-md:mt-px max-md:size-[22px] max-md:items-center max-md:justify-center max-md:rounded-[8px] max-md:border max-md:border-[#fbe3e3] max-md:bg-danger-surface">
                      <CrossIcon />
                    </span>
                    <p className="m-0 text-[14.5px] leading-[1.55] font-semibold text-text-secondary max-md:text-[13.5px] max-md:leading-[1.5] xl:max-w-[520px] xl:text-[11px] xl:text-pretty">
                      <strong className="font-extrabold text-ink">{tf(lead)}</strong>{' '}
                      {body === RECORD_PROMISE && !hasRows ? sys('verify.flags.qr') : tf(body)}
                    </p>
                  </>
                ),
              }))}
            />
          </div>

          <div className="relative flex flex-col overflow-hidden rounded-lg bg-navy px-[30px] py-7 text-white shadow-[0_24px_56px_rgba(3,10,26,0.35)] max-md:rounded-base max-md:bg-[linear-gradient(160deg,#0e1a37_0%,#253063_100%)] max-md:px-[18px] max-md:py-5 max-md:shadow-[0_16px_36px_rgba(3,10,26,0.32)]">
            <div
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#dc2626_55%,transparent_45%)] bg-[length:22px_3px] opacity-90 ${motion.dash}`}
            />
            <p className="m-0 mb-3.5 text-[11.5px] font-extrabold tracking-[1.3px] text-[#fca5a5] uppercase max-md:mb-2.5 max-md:text-[10.5px] max-md:tracking-[1.2px] xl:text-[11px]">
              {t('verify.091')}
            </p>
            <h3 className="m-0 mb-2.5 text-[20px] leading-[1.25] tracking-[-0.4px] text-white max-md:text-[18.5px] max-md:leading-[1.22] xl:text-[15px]">
              {t('verify.092')}
            </h3>
            <p className="m-0 mb-[18px] text-[14.5px] leading-[1.6] font-semibold text-white/[0.72] max-md:mb-3.5 max-md:text-[13.5px] max-md:leading-[1.55] xl:text-[11px]">
              {tf('verify.093')}
            </p>
            <FraudForm
              bundle={bundle}
              locale={locale}
              submitFraud={submitFraud}
              uploadEvidence={uploadEvidence}
            />
            {/* D11: the co-primary doors stay beside the form, r12 rectangles (S1.6) with the WA
                glyph (S4.3). The prefill is company copy (verify.229) — never anything the
                visitor typed (W95). */}
            <div className="mt-auto flex flex-col gap-2.5">
              <ContactCta
                placement="page_cta"
                variant="danger"
                size="lg"
                shape="rect"
                radius={12}
                external
                icon={<WhatsAppIcon size={16} />}
                href={waLink(settings.whatsappNumber, t('verify.229'))}
                className="max-md:min-h-[50px]"
              >
                {t('verify.097')}
              </ContactCta>
              <ContactCta
                placement="page_cta"
                variant="inverse"
                size="lg"
                shape="rect"
                radius={12}
                href={telLink(settings.phone)}
                className="max-md:min-h-[50px]"
              >
                {t('verify.051')}
              </ContactCta>
            </div>
            <p className="mt-[18px] mb-0 border-t border-dashed border-white/[0.18] pt-3.5 text-[12.5px] leading-[1.55] font-semibold text-white/60 max-md:mt-3.5 max-md:pt-3 max-md:text-[12px] max-md:leading-[1.5] xl:text-[11px]">
              {tf('verify.098')}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
