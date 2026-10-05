import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { buttonClassName } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { mailLink } from '@/lib/contact';
import {
  ExternalIcon,
  FileCheckIcon,
  FileIcon,
  LanguagesIcon,
  UsersIcon,
} from '../_components/icons';
import { opsCareersPortal } from '../_lib/links';
import type { Tf } from '../_lib/roles';

/** The three "who we want" rows, each with its own glyph (design ll. 902–924, parity S7.3). */
const WANTS: ReadonlyArray<readonly [string, string, string, ReactNode]> = [
  ['jt.089', 'jt.090', 'bg-tint text-blue-safe', <UsersIcon key="u" size={17} />],
  ['jt.091', 'jt.092', 'bg-success-soft text-success-text', <LanguagesIcon key="l" size={17} />],
  ['jt.093', 'jt.094', 'bg-[#edf1f9] text-indigo', <FileIcon key="f" lined size={17} />],
];

/**
 * "No matching role?" (`#apply`, design `.ja-jt-apply`): the pitch and the three wants (pale
 * cards with 30 px tiles below 901 px, M12), then the "Send us your details" card — its header
 * with the document-check tile (S7.2) and, in place of the design's speculative form, the two
 * doors (owner, 2026-10-06, W245): "Open application portal" (`jt.047`) opens the Operations
 * careers openings page in a new tab, in the page's locale, and "Email CV instead" (`jt.104`)
 * writes to `settings.careersEmail` (W102). Nothing is composed or posted here.
 */
export function OpenApplication({
  t,
  locale,
  settings,
}: {
  t: Tf;
  locale: Locale;
  settings: { careersEmail: string };
}) {
  const sys = useTranslations('sys');
  return (
    <Section tone="light" id="apply" className="ja-reveal scroll-mt-24 border-t border-border-3">
      <div
        data-testid="careers-apply"
        className="container-site grid items-start gap-12 max-lg:gap-[22px] lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div>
          <Eyebrow>{t('jt.086')}</Eyebrow>
          <h2 className="mt-3 mb-3.5 text-h2 leading-[1.05] tracking-[-0.04em] max-md:text-[27px] max-md:leading-[1.12] max-md:tracking-[-0.9px]">
            {t('jt.087')}
          </h2>
          <p className="mb-[22px] text-body text-text-secondary">{t('jt.088')}</p>
          <ul className="flex flex-col gap-[13px] max-lg:gap-[9px]">
            {WANTS.map(([title, body, tone, icon]) => (
              <li
                key={title}
                className="flex items-start gap-[13px] max-lg:gap-[11px] max-lg:rounded-sm max-lg:border max-lg:border-edge-soft max-lg:bg-pale-1 max-lg:px-3 max-lg:py-[11px]"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] max-lg:h-[30px] max-lg:w-[30px] max-lg:rounded-[9px] max-lg:[&>svg]:h-[15px] max-lg:[&>svg]:w-[15px] ${tone}`}
                >
                  {icon}
                </span>
                <span>
                  <strong className="mb-[3px] block text-[15px] font-extrabold text-ink xl:text-[11.25px] max-lg:mb-0.5 max-lg:text-[14.5px]">
                    {t(title)}
                  </strong>
                  <span className="block text-[14px] leading-[1.55] text-text-tertiary xl:text-[11px] max-lg:text-[12.5px] max-lg:leading-[1.45]">
                    {t(body)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-lg border-[1.5px] border-edge bg-white shadow-[0_18px_44px_rgba(22,60,90,0.1)]">
          <div className="flex items-center justify-between gap-3.5 border-b border-edge-soft bg-pale-1 px-[26px] py-[18px] max-lg:px-4 max-lg:py-[15px]">
            <div>
              <h3 className="text-[17px] font-extrabold tracking-[-0.3px] text-ink xl:text-[12.75px]">
                {t('jt.095')}
              </h3>
              <p className="mt-0.5 text-[13px] font-semibold text-text-secondary xl:text-[11px]">
                {t('jt.096')}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] border border-edge bg-white text-blue"
            >
              <FileCheckIcon size={18} />
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5 px-[26px] pt-6 pb-[26px] max-lg:flex-col max-lg:px-4 max-lg:pt-[18px] max-lg:pb-5">
            <a
              data-testid="careers-apply-portal"
              href={opsCareersPortal(locale)}
              target="_blank"
              rel="noopener"
              className={buttonClassName('primary', 'lg', 'max-lg:w-full max-lg:rounded-pill', {
                shape: 'rect',
                radius: 11,
              })}
            >
              {t('jt.047')}
              <ExternalIcon size={15} />
            </a>
            <ContactLink
              href={mailLink(settings.careersEmail, sys('careers.apply.emailSubject'))}
              placement="page_cta"
              className={buttonClassName('secondary', 'lg', 'max-lg:w-full')}
            >
              {t('jt.104')}
            </ContactLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
