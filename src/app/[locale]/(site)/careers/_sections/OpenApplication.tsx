import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { mailLink, waLink } from '@/lib/contact';
import type { Tf } from '../_lib/roles';

const WANTS = [
  ['jt.089', 'jt.090', 'bg-tint text-blue-safe'],
  ['jt.091', 'jt.092', 'bg-success-surface text-success-text'],
  ['jt.093', 'jt.094', 'bg-[#edf1f9] text-[#253063]'],
] as const;

/**
 * "No matching role?" (`#apply`, design `.ja-jt-apply`) — W3: WhatsApp + e-mail only in Phase A,
 * no form and no form key. The WhatsApp prefill is the package's own (`jt.286`) and the e-mail
 * goes to `settings.careersEmail`; both fire their contact event with `page_cta` (W12). The
 * design's form, its KVKK line, its success copy and the portal note (`jt.097`–`110`) are not
 * rendered (W3, W89).
 */
export function OpenApplication({
  t,
  settings,
}: {
  t: Tf;
  settings: { whatsappNumber: string; careersEmail: string };
}) {
  const sys = useTranslations('sys');
  return (
    <Section tone="light" id="apply" className="ja-reveal scroll-mt-24 border-t border-border-3">
      <div
        data-testid="careers-apply"
        className="container-site grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div>
          <Eyebrow>{t('jt.086')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 leading-[1.05] tracking-[-0.04em] max-md:text-[27px] max-md:leading-[1.12] max-md:tracking-[-0.9px]">
            {t('jt.087')}
          </h2>
          <p className="mb-6 text-body text-text-secondary">{t('jt.088')}</p>
          <ul className="flex flex-col gap-3">
            {WANTS.map(([title, body, tone]) => (
              <li key={title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-[10px] ${tone}`}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong className="block text-body font-extrabold text-ink">{t(title)}</strong>
                  <span className="text-body-sm text-text-tertiary">{t(body)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-lg border-[1.5px] border-tint-border bg-white shadow-[0_18px_44px_rgba(22,60,90,0.1)]">
          <div className="border-b border-border-2 bg-pale-1 px-6 py-4">
            <h3 className="text-body-lg text-ink">{t('jt.095')}</h3>
            <p className="mt-0.5 text-body-sm text-text-secondary">{t('jt.096')}</p>
          </div>
          <div className="flex flex-wrap gap-3 p-6 xl:[&>*]:grow">
            <ContactCta
              placement="page_cta"
              href={waLink(settings.whatsappNumber, t('jt.286'))}
              external
              size="lg"
            >
              {sys('careers.apply.whatsapp')}
            </ContactCta>
            <ContactCta
              placement="page_cta"
              href={mailLink(settings.careersEmail, sys('careers.apply.emailSubject'))}
              variant="secondary"
              size="lg"
            >
              {t('jt.104')}
            </ContactCta>
          </div>
        </div>
      </div>
    </Section>
  );
}
