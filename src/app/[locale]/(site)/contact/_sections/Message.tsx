import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ProcessSteps } from '@/design/blocks/ProcessSteps';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { QrCode } from '@/design/QrCode';
import type { Locale } from '@/i18n/routing';
import { mailLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { ContactEnquiry, type ContactEnquiryCopy } from '../_components/ContactEnquiry';
import type { FormAction } from '../_components/types';
import { formDoor } from '../_lib/door';

type T = (id: string) => string;

/** The job-seeker card (contact.075–085): the B2B refusal with the package's own bold splits
 *  (contact.076 | 077 | 078 | 079, W23) and the WhatsApp link for the verified partner list. */
function JobSeekerPanel({ t, href }: { t: T; href: string }) {
  return (
    <>
      <div className="mb-4 rounded-base border border-success-border bg-success-surface p-5">
        <h3 className="m-0 mb-1.5 text-card-title">{t('contact.075')}</h3>
        <p className="m-0 text-body-sm text-text-secondary xl:max-w-[560px]">
          <strong className="text-ink">{t('contact.076')}</strong> {t('contact.077')}{' '}
          <strong className="text-success-text">{t('contact.078')}</strong>
          {t('contact.079')}
        </p>
      </div>
      <div className="mb-4 grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <div className="rounded-sm border border-border-1 p-5">
          <h4 className="m-0 mb-1.5 text-body">{t('contact.080')}</h4>
          <p className="m-0 mb-3.5 text-body-sm text-text-tertiary">{t('contact.081')}</p>
          <ContactCta placement="page_cta" href={href} external variant="success">
            {t('contact.082')}
          </ContactCta>
        </div>
        <div className="rounded-sm border border-border-1 p-5">
          <h4 className="m-0 mb-1.5 text-body">{t('contact.083')}</h4>
          <p className="m-0 text-body-sm text-text-tertiary">{t('contact.084')}</p>
        </div>
      </div>
      <p className="m-0 text-body-sm text-text-tertiary">{t('contact.085')}</p>
    </>
  );
}

/** `section#message` — the header CTA's target (W17): "what happens after you press send", the
 *  "In a hurry?" card with the local QR, and the enquiry card. */
export function Message({
  bundle,
  locale,
  submitContact,
}: {
  bundle: Bundle;
  locale: Locale;
  submitContact: FormAction;
}) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  const waMain = waLink(settings.whatsappNumber, sys('contact.wa.main'));
  const copy: ContactEnquiryCopy = {
    legend: t('contact.057'),
    topics: {
      hire: { label: t('contact.058'), sub: t('contact.059') },
      permit: { label: t('contact.060'), sub: t('contact.061') },
      partner: { label: t('contact.062'), sub: t('contact.063') },
      job: { label: t('contact.064'), sub: t('contact.065') },
    },
    forms: {
      hire: {
        title: t('contact.162'),
        sub: t('contact.163'),
        desk: t('contact.161'),
        companyLabel: t('contact.164'),
        companyPlaceholder: t('contact.165'),
        subjectLabel: t('contact.166'),
        subjectPlaceholder: t('contact.167'),
        extraLabel: t('contact.168'),
        submit: t('contact.169'),
      },
      permit: {
        title: t('contact.171'),
        sub: t('contact.172'),
        desk: t('contact.170'),
        companyLabel: t('contact.164'),
        companyPlaceholder: t('contact.165'),
        subjectLabel: t('contact.173'),
        subjectPlaceholder: t('contact.174'),
        extraLabel: t('contact.175'),
        submit: t('contact.176'),
      },
      partner: {
        title: t('contact.063'),
        sub: t('contact.178'),
        desk: t('contact.177'),
        companyLabel: t('contact.179'),
        companyPlaceholder: t('contact.180'),
        subjectLabel: t('contact.181'),
        subjectPlaceholder: t('contact.182'),
        extraLabel: t('contact.183'),
        extraPlaceholder: t('contact.184'),
        submit: t('contact.185'),
      },
    },
    deskPrefix: t('contact.218'),
    nameLabel: t('contact.066'),
    namePlaceholder: t('contact.090'),
    emailLabel: t('contact.067'),
    phoneLabel: t('contact.068'),
    // The package splits the label from its "(optional)" marker (contact.069 + 070, W23).
    notesLabel: `${t('contact.069')} ${t('contact.070')}`,
    notesPlaceholder: t('contact.091'),
    replyLegend: t('contact.071'),
    reply: {
      whatsapp: sys('contact.channels.whatsapp'),
      email: t('contact.067'),
      call: t('contact.186'),
    },
    moreOpen: t('contact.211'),
    moreClose: t('contact.210'),
    fallbackIntro: sys('contact.fallbackIntro.contact'),
  };
  return (
    <Section tone="light" id="message" className="scroll-mt-24">
      <div
        data-testid="contact-message"
        className="container-site grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14"
      >
        {/* ≤ 700 px the enquiry card comes first (the design's order swap); the explainer then holds
            nothing focusable — its one card hides — so the focus order is unchanged. Not sticky
            (W231): the column is taller than the CSS viewport the liquid desktop's zoom leaves,
            stuck it travelled only ≈ 160 px, and a scroll box would clip its cards' shadows. */}
        <div className="ja-reveal min-w-0 max-md:order-2">
          <Eyebrow>{t('contact.050')}</Eyebrow>
          <h2 className="m-0 mb-4 mt-3 text-h2 max-md:text-[21px] max-md:leading-[1.13] max-md:tracking-[-0.6px] xl:text-balance">
            {t('contact.051')}
          </h2>
          <p className="m-0 mb-6 text-body text-text-secondary">{t('contact.052')}</p>
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            variant="plain"
            headingLevel={3}
            steps={[
              { n: 1, titleId: 'contact.187', bodyId: 'contact.188' },
              { n: 2, titleId: 'contact.189', bodyId: 'contact.190' },
              { n: 3, titleId: 'contact.191', bodyId: 'contact.192' },
              { n: 4, titleId: 'contact.193', bodyId: 'contact.194' },
            ]}
          />
          <div className="mt-6 rounded-base border border-border-1 bg-white p-5 max-md:hidden">
            <h3 className="m-0 mb-1 text-card-title">{t('contact.053')}</h3>
            <p className="m-0 mb-4 text-body-sm text-text-tertiary">{t('contact.054')}</p>
            <ContactCta
              placement="page_cta"
              href={waMain}
              external
              variant="success"
              className="w-full"
            >
              {t('contact.055')}
            </ContactCta>
            <div
              data-testid="contact-qr"
              className="mt-4 flex items-center gap-3 border-t border-border-3 pt-4"
            >
              {/* W14: the local encoder, server-rendered (QrCode → qrSvg); the design fetched
                  api.qrserver.com. The plain wa.me URL — no prefill, the shortest code. */}
              <QrCode
                text={`https://wa.me/${settings.whatsappNumber}`}
                label={t('contact.089')}
                size={86}
                className="shrink-0 overflow-hidden rounded-input border border-border-2"
              />
              <p className="m-0 text-body-sm text-text-tertiary">{t('contact.056')}</p>
            </div>
          </div>
        </div>
        <div
          className="ja-reveal min-w-0 overflow-hidden rounded-xl border border-border-1 bg-white shadow-[0_24px_60px_rgba(22,60,90,0.12)] max-md:order-1"
          style={{ transitionDelay: '0.12s' }}
        >
          <ContactEnquiry
            {...formDoor(bundle, locale)}
            action={submitContact}
            copy={copy}
            jobPanel={
              <JobSeekerPanel
                t={t}
                href={waLink(settings.whatsappNumber, sys('contact.wa.jobseeker'))}
              />
            }
            footer={
              <p className="m-0 text-right text-body-sm">
                <ContactLink
                  href={mailLink(settings.email)}
                  placement="page_cta"
                  className="inline-flex min-h-[44px] items-center font-extrabold text-blue-safe underline"
                >
                  {t('contact.074')}
                </ContactLink>
              </p>
            }
          />
        </div>
      </div>
    </Section>
  );
}
