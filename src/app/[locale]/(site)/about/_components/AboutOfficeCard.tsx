import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import type { Office } from '@/content/collections';
import { MapPinIcon } from '@/design/chrome/icons';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { mailLink, waLink } from '@/lib/contact';

/** The About office card's per-kind accents: the head office's pale-blue pill and blue WhatsApp
 *  line, the sourcing office's pale-green pill and green line (About l. 856 / 883). The design's
 *  #1899D5 pill text is 2.9:1 on #e8f4fb, so the pill and line wear the contrast-safe blue (D20). */
const KIND = {
  hq: { pill: 'bg-tint text-blue-safe', line: 'text-blue-safe' },
  sourcing: { pill: 'bg-success-soft text-success-text', line: 'text-success-text' },
} as const;

/** The design slot ids of the two office photos (About l. 847 / 874). */
export const OFFICE_PHOTO_SLOT: Record<Office['key'], string> = {
  antalya: 'antalya-office',
  karachi: 'karachi-office',
};

/**
 * About's own office card (SHARED 14.8, a page-local face of the shared `OfficeCard` — the
 * Contact page keeps that one). Desktop (About l. 846–866): one white r20 card, the 180 × 180
 * photo on the left (r16, its own shadow), on the right the tinted pill badge (about.091 /
 * about.101), the 23 px city, the address on one line, the function chips, the WhatsApp line
 * (about.098) and the e-mail — the design's density, so no hours, phone or directions button;
 * the shadow deepens on hover. Phones and tablets (≤ 900, l. 364–377): the photo runs full width
 * on top (160 px, 150 from 701) under a dark caption with a glass pill and the 24 px city; the
 * contact lines give way to a "Yol tarifi alın →" text link. The caption is the visual twin of
 * the badge and city, so it is `aria-hidden` and the real badge/heading stay in the tree
 * (`max-lg:sr-only`). Every text field is the row's own package id (W9/R15); the WhatsApp and
 * e-mail lines are `ContactLink` with placement `office_card` (W12).
 */
export function AboutOfficeCard({
  office,
  t,
  badgeId,
  chipIds,
  photoAlt,
}: {
  office: Office;
  /** `makeTf(bundle, locale)` from the page. */
  t: (id: string) => string;
  /** about.091 (head office) / about.101 (sourcing office) */
  badgeId: string;
  chipIds: readonly string[];
  photoAlt: string;
}) {
  const sys = useTranslations('sys');
  const kind = office.kind === 'sourcing' ? KIND.sourcing : KIND.hq;
  const city = t(office.cityId);
  const badge = t(badgeId);
  return (
    <article className="relative grid grid-cols-[180px_1fr] items-start gap-6 rounded-lg bg-white p-6.5 shadow-[0_10px_30px_rgba(22,60,90,0.08)] transition-shadow duration-200 hover:shadow-[0_18px_44px_rgba(22,60,90,0.14)] xl:grid-cols-[135px_1fr] xl:shadow-[0_7.5px_22.5px_rgba(22,60,90,0.08)] xl:hover:shadow-[0_13.5px_33px_rgba(22,60,90,0.14)] max-lg:block max-lg:overflow-hidden max-lg:rounded-md max-lg:p-0 max-lg:shadow-[0_10px_28px_rgba(22,60,90,0.09)]">
      <div className="min-w-0">
        <ImageSlot
          slot={OFFICE_PHOTO_SLOT[office.key]}
          alt={photoAlt}
          width={180}
          height={180}
          sizes="(max-width: 900px) 100vw, (min-width: 1441px) 9.38vw, 180px"
          cover={{ base: 160, md: 150, lg: 180, xl: 135 }}
          className="rounded-base shadow-[0_10px_26px_rgba(22,60,90,0.16)] max-lg:rounded-none max-lg:shadow-none"
        />
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-40 flex-col justify-end gap-[7px] bg-[linear-gradient(180deg,rgba(10,20,40,0)_30%,rgba(10,20,40,0.88)_100%)] px-3.5 pb-[13px] max-lg:flex md:h-[150px]"
      >
        <span className="inline-flex w-fit items-center rounded-pill border border-white/35 bg-night/45 px-[11px] py-1 text-[11px] font-extrabold tracking-[0.8px] text-white uppercase backdrop-blur-sm">
          {badge}
        </span>
        <span className="text-[24px] leading-none font-extrabold tracking-[-0.7px] text-white">
          {city}
        </span>
      </span>
      <div className="min-w-0 max-lg:p-3.5">
        <p
          className={`m-0 mb-2.5 inline-block rounded-pill px-3.5 py-[5px] text-[11.5px] font-extrabold tracking-[0.8px] xl:py-[3.75px] xl:text-[11px] xl:tracking-[0.6px] max-lg:sr-only ${kind.pill}`}
        >
          {badge}
        </p>
        <h3 className="m-0 mb-1.5 text-[23px] font-extrabold xl:text-[17.25px] max-lg:sr-only">
          {city}
        </h3>
        <p className="m-0 mb-3 text-[14px] leading-[1.6] text-text-secondary xl:text-[11px] max-lg:mb-[11px] max-lg:text-[13.5px] max-lg:leading-[1.5]">
          {t(office.addressId)}, {t(office.addressLine2Id)}
        </p>
        <ul className="m-0 mb-3.5 flex list-none flex-wrap gap-2 p-0 max-lg:mb-3 max-lg:gap-1.5">
          {chipIds.map((id) => (
            <li
              key={id}
              className="rounded-pill border border-edge-soft bg-pale-1 px-3 py-[5px] text-[12.5px] font-bold text-text-secondary xl:py-[3.75px] xl:text-[11px] max-lg:px-2.5 max-lg:text-[11.5px]"
            >
              {t(id)}
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-start gap-[5px] xl:gap-[3.75px] max-lg:hidden">
          <ContactLink
            href={waLink(office.whatsapp, sys('whatsapp.prefill'))}
            placement="office_card"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-6 items-center text-[14.5px] font-extrabold no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px] ${kind.line}`}
          >
            {t('about.098')}
          </ContactLink>
          <ContactLink
            href={mailLink(office.email)}
            placement="office_card"
            className="inline-flex min-h-6 items-center text-[13.5px] font-bold text-text-secondary no-underline hover:text-blue-safe hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px]"
          >
            {office.email}
          </ContactLink>
        </div>
        <a
          href={office.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-[44px] items-center gap-[7px] text-[14px] font-extrabold text-blue-safe no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-lg:inline-flex"
        >
          <MapPinIcon />
          <span className="border-b border-tint-border pb-px">{t('home.192')}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
