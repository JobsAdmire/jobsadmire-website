import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import type { Office } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ClockIcon, PhoneIcon, WhatsAppIcon } from '@/design/chrome/icons';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { formatPhoneDisplay } from '@/lib/contact/partner-line';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FlagPK, FlagTR } from './icons';

const ROW =
  'flex min-h-[44px] items-center gap-[9px] text-body-sm font-bold text-text-secondary no-underline max-md:py-1';
const LINK_ROW = `${ROW} hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe`;

/** Contact's office card, to the design (Contact Us l. 953–1000): flag + the full city name
 *  (`contact.098` / `103`), the live pill (a child — `LiveStatus` is a client island), the
 *  two-line address without the country, hours plus ONE door (Antalya the phone, Karachi the
 *  sourcing-desk WhatsApp, `contact.107`), a divider, the description and one tinted CTA.
 *  A page-local copy of `OfficeCard` (SHARED 14.8: copy + adapt; fold back later). The tel /
 *  WhatsApp rows are `ContactLink` placement `office_card` (W12). ≤ 700 px the pill rides the
 *  head's right edge and the hours / door rows sit in a tinted box with row dividers (M.8). */
export function ContactOfficeCard({
  bundle,
  locale,
  office,
  status,
}: {
  bundle: Bundle;
  locale: Locale;
  office: Office;
  /** the live open / closed pill */
  status: ReactNode;
}) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const hq = office.kind !== 'sourcing';
  const description = hq ? 'contact.101' : 'contact.108';
  return (
    <article className="flex min-h-full flex-1 flex-col rounded-[20px] bg-white px-[30px] py-7 shadow-[0_26px_54px_rgba(10,16,40,0.4)] max-md:px-5 max-md:py-[22px] xl:shadow-[0_19.5px_40.5px_rgba(10,16,40,0.4)]">
      <div className="mb-4 flex flex-wrap items-center gap-x-[11px] gap-y-[15px]">
        {hq ? (
          <FlagTR className="rounded-[3px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.12)]" />
        ) : (
          <FlagPK className="rounded-[3px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.12)]" />
        )}
        <div className="min-w-0">
          <h3 className="m-0 text-card-title tracking-[-0.3px]">
            {t(hq ? 'contact.098' : 'contact.103')}
          </h3>
          <p
            className={[
              'text-eyebrow m-0 font-extrabold uppercase tracking-[0.5px]',
              hq ? 'text-blue-safe' : 'text-success-text',
            ].join(' ')}
          >
            {t(office.labelId)}
          </p>
        </div>
        <div className="max-md:ml-auto md:order-last md:basis-full">{status}</div>
      </div>
      <p className="text-body m-0 mb-4 font-semibold text-text-secondary">
        {t(office.addressId)}
        <br />
        {hq ? t(office.addressLine2Id) : t(office.cityId)}
      </p>
      <div className="mb-[18px] flex flex-col gap-1 max-md:divide-y max-md:divide-edge-soft max-md:rounded-xs max-md:bg-pale-1 max-md:px-3.5 max-md:py-1">
        <span className={ROW}>
          <ClockIcon className="shrink-0 text-blue-safe" />
          {t(office.hoursId)}
        </span>
        {hq ? (
          <ContactLink href={telLink(office.phone)} placement="office_card" className={LINK_ROW}>
            <PhoneIcon className="shrink-0 text-blue-safe" />
            {formatPhoneDisplay(office.phone)}
          </ContactLink>
        ) : (
          <ContactLink
            href={waLink(office.whatsapp, sys('whatsapp.prefill'))}
            placement="office_card"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_ROW}
          >
            <WhatsAppIcon className="shrink-0 text-success-text" />
            {t('contact.107')}
          </ContactLink>
        )}
      </div>
      <p className="text-body-sm m-0 mb-[18px] border-t border-border-3 pt-4 text-text-tertiary">
        {t(description)}
      </p>
      <div className="mt-auto flex">
        {hq ? (
          <ContactCta
            placement="office_card"
            href={office.mapUrl}
            external
            variant="tint"
            shape="rect"
            radius={11}
            className="w-full"
          >
            {t('contact.102')}
          </ContactCta>
        ) : (
          // W195: a cross-route page link never prefetches in the viewport (hover still does).
          <ContactCta
            placement="page_cta"
            href="/available-workers"
            prefetch={false}
            variant="success"
            shape="rect"
            radius={11}
            className="w-full"
          >
            {t('contact.109')}
          </ContactCta>
        )}
      </div>
    </article>
  );
}
