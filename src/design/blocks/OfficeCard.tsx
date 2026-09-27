import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import type { Office } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '@/design/chrome/icons';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';

const ROW =
  'inline-flex min-h-[44px] items-center gap-2 text-body-sm font-bold text-text-secondary no-underline hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** The white office card (Contact offices band, About): city, kind, address, hours, the
 *  contact doors and directions — every text field is the row's own package id (`labelId`,
 *  `addressId`/`addressLine2Id`, `hoursId`: contact.099/104, contact.133/134, contact.100/106
 *  — W9/R15, nothing composed), so body, footer and JSON-LD agree. The three contact rows are
 *  T0c's `ContactLink` with placement `office_card` (W12). `children` is the page's own line
 *  under the header (Contact's live open/closed pill is a client island that reads
 *  `office.hours` — `days` are JS `getDay()` 0–6, W43; the card itself stays a server
 *  component). */
export function OfficeCard({
  bundle,
  locale,
  office,
  children,
}: {
  bundle: Bundle;
  locale: Locale;
  office: Office;
  children?: ReactNode;
}) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  return (
    <article className="flex flex-col rounded-lg bg-white p-7 shadow-[0_26px_54px_rgba(10,16,40,0.4)]">
      <div className="mb-4">
        <h3 className="text-card-title m-0">{t(office.cityId)}</h3>
        <p
          className={[
            'text-eyebrow m-0 font-extrabold uppercase tracking-[0.5px]',
            office.kind === 'sourcing' ? 'text-success-text' : 'text-blue-safe',
          ].join(' ')}
        >
          {t(office.labelId)}
        </p>
      </div>
      {children && <div className="mb-4">{children}</div>}
      <p className="text-body-sm m-0 mb-4 text-text-secondary">
        {t(office.addressId)}
        <br />
        {t(office.addressLine2Id)}
      </p>
      <div className="mb-4 flex flex-col gap-1">
        <span className={ROW}>
          <ClockIcon className="text-blue-safe" />
          {t(office.hoursId)}
        </span>
        <ContactLink href={telLink(office.phone)} placement="office_card" className={ROW}>
          <PhoneIcon className="text-blue-safe" />
          {office.phone}
        </ContactLink>
        <ContactLink
          href={waLink(office.whatsapp, sys('whatsapp.prefill'))}
          placement="office_card"
          target="_blank"
          rel="noopener noreferrer"
          className={ROW}
        >
          <WhatsAppIcon className="text-success-text" />
          {t('home.221')}
        </ContactLink>
        <ContactLink href={mailLink(office.email)} placement="office_card" className={ROW}>
          <MailIcon className="text-blue-safe" />
          {office.email}
        </ContactLink>
      </div>
      <a
        href={office.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-input border border-tint-border bg-tint px-4 text-body-sm font-extrabold text-blue-safe no-underline hover:bg-sky/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
      >
        <MapPinIcon />
        {t('home.192')}
      </a>
    </article>
  );
}
