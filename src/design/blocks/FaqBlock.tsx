import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
// By module path, not the barrel (W147): a server component's barrel import makes every
// 'use client' primitive the barrel re-exports a client reference of the page.
import { Accordion } from '@/design/primitives/Accordion';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { faqJsonLd } from '@/lib/seo/jsonld';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/design/chrome/icons';
import type { AccordionToggle } from '@/design/primitives/Accordion';
import type { ButtonRadius, ButtonShape, ButtonVariant } from '@/design/primitives/Button';
import { ContactLink } from '@/analytics/ContactLink';
import { ContactCta } from './ContactCta';

/** `q`/`a` arrive resolved (through the page's `makeTf`): FAQ pairs are package ids the page
 *  reads by exact id (W23). */
export type FaqItem = { id: string; q: string; a: string };

/** One contact row of the design's ask card (SHARED 6.2; Hiring Cost Calculator ll. 1505–1513):
 *  a 34 px icon tile, a small grey label ("WhatsApp", "E-posta", "Arayın") and the bold value
 *  ("+90 501 124 03 40", "info@jobsadmire.com"). `href` is the door (wa.me / tel: / mailto:);
 *  `label` is resolved copy or a brand name, `labelId` a package id. */
export type FaqAskRow = {
  kind: 'whatsapp' | 'phone' | 'email';
  href: string;
  value: string;
  label?: string;
  labelId?: string;
};

/** The design's "Question not listed?" card in the side column (Hire Workers, Contact,
 *  Available Workers, Calculator, Permit, Partner). `whatsappText` is the page's own prefill id,
 *  resolved. `email`/`emailLabelId`/`subject` (W83) add a third, mailto, door — all three are
 *  optional so a page can offer just WhatsApp, WhatsApp+call, or all three.
 *  - `layout: 'buttons'` (default): label-only buttons — WhatsApp in the pale green `success` face
 *    (or `whatsappVariant`), call/e-mail plain `secondary` (a D20 delta from the design's blue);
 *    `buttonShape`/`buttonRadius` give Hire its r10 rectangles, `icons` the WA glyph + phone icon
 *    (SHARED 6.2 exceptions: Hire r10 + glyphs; Contact `success-solid` r11).
 *  - `layout: 'rows'`: the design's contact rows (`rows`, or built from the doors above with
 *    `whatsappDisplay` / `phoneDisplay` as the bold values). No caller colour classes ever reach
 *    `ContactCta` (W122/W127). */
export type FaqAskCard = {
  titleId: string;
  bodyId: string;
  whatsappNumber: string;
  whatsappText: string;
  whatsappLabelId: string;
  phone?: string;
  callLabelId?: string;
  email?: string;
  emailLabelId?: string;
  subject?: string;
  layout?: 'buttons' | 'rows';
  /** rows layout: the bold values of the WhatsApp / call rows (e-mail shows `email`) */
  whatsappDisplay?: string;
  phoneDisplay?: string;
  /** rows layout: explicit rows instead of the ones built from the doors (Partner's three) */
  rows?: FaqAskRow[];
  whatsappVariant?: ButtonVariant;
  buttonShape?: ButtonShape;
  buttonRadius?: ButtonRadius;
  icons?: boolean;
};

/** FAQ section body: side column (eyebrow, h2, sub, ask card — sticky from lg at `--sticky-top`
 *  like the site's other sticky columns: below the header at its real height, W232) + the
 *  accordion + the FAQPage node (AEO only, docs/SEO.md). Pages put it inside a
 *  `<Section tone="pale"><div className="container-site">…`. Ids resolve through
 *  `makeTf(bundle, locale)`, so a re-authored `{metric}` string (hire.198-style reply times)
 *  renders its number (D17).
 *
 *  Parity pass (SHARED 6): `variant="cards"` renders each pair as its own white card (the
 *  design's FAQ face on every page) with `toggle` choosing the + circle (default) or the ⌄;
 *  `layout="centered"` puts the eyebrow + h2 centred over one 900 px column (Join Our Team);
 *  `mobileAsk` moves or hides the ask card on phones; `mobileGrouped` folds the cards into one
 *  r16 card with inner dividers ≤ 700 px (Partner M8). */
export function FaqBlock({
  bundle,
  locale,
  items,
  id = 'faq',
  eyebrowId,
  headingId,
  bodyId,
  askCard,
  singleOpen = true,
  openFirst = false,
  headingLevel = 3,
  footer,
  reveal = false,
  panelClassName,
  variant = 'list',
  toggle,
  layout = 'side',
  mobileAsk = 'side',
  mobileGrouped = false,
}: {
  bundle: Bundle;
  locale: Locale;
  items: FaqItem[];
  id?: string;
  eyebrowId?: string;
  headingId?: string;
  bodyId?: string;
  askCard?: FaqAskCard;
  /** Hire Workers/Contact: one open at a time; the Homepage's six toggles are independent. */
  singleOpen?: boolean;
  openFirst?: boolean;
  /** 3 under an h2 side column; 2 when the page renders no h2 of its own above the list. */
  headingLevel?: 2 | 3 | 4;
  /** Page-specific line under the list (the Homepage's `faqFoot` + WhatsApp link). */
  footer?: ReactNode;
  /** Contact: the side column and the list each rise into view, the list 120 ms later (the
   *  design's `.ja-reveal` on both columns, src/design/motion/motion.css). */
  reveal?: boolean;
  /** The accordion panels' open animation (`ja-panel` / `ja-panel-soft`). */
  panelClassName?: string;
  /** `list` (hairline rows, the pre-parity face) or `cards` (SHARED 6.1) */
  variant?: 'list' | 'cards';
  /** `plus` (26 px tint circle, default for cards), `chevron` (blue ⌄: Home, Verify, Article),
   *  `chevron-muted` (grey ⌄: Join) */
  toggle?: AccordionToggle;
  /** `side` (0.8fr/1.2fr side column, default), `centered` (eyebrow + h2 centred over one
   *  900 px column — Join S8.1), `stacked` (heading over a full-width list — Home) */
  layout?: 'side' | 'centered' | 'stacked';
  /** Phones (below 901 px, where the columns stack): `side` keeps the ask card under the side
   *  copy; `after` moves it below the list (Available Workers M7); `whatsapp-after` shows only
   *  a full-width WhatsApp button below the list (Hire Workers M10); `hidden` drops it ≤ 700 px
   *  (Work Permit M.13, Partner M8, Contact M.10). */
  mobileAsk?: 'side' | 'after' | 'whatsapp-after' | 'hidden';
  /** ≤ 700 px the cards fold into one r16 card with inner dividers (Partner M8) */
  mobileGrouped?: boolean;
}) {
  const t = makeTf(bundle, locale);
  const centered = layout === 'centered';
  const stacked = layout === 'stacked' || centered;
  const hasSide = Boolean(eyebrowId || headingId || bodyId || askCard);
  const twoCol = hasSide && !stacked;
  const askInSide = askCard && !stacked;
  const label = (row: FaqAskRow) => row.label ?? (row.labelId ? t(row.labelId) : '');
  const askRows = (card: FaqAskCard): FaqAskRow[] =>
    card.rows ?? [
      {
        kind: 'whatsapp',
        href: waLink(card.whatsappNumber, card.whatsappText),
        value: card.whatsappDisplay ?? card.whatsappNumber,
        labelId: card.whatsappLabelId,
      },
      ...(card.phone && card.callLabelId
        ? [
            {
              kind: 'phone' as const,
              href: telLink(card.phone),
              value: card.phoneDisplay ?? card.phone,
              labelId: card.callLabelId,
            },
          ]
        : []),
      ...(card.email && card.emailLabelId
        ? [
            {
              kind: 'email' as const,
              href: mailLink(card.email, card.subject),
              value: card.email,
              labelId: card.emailLabelId,
            },
          ]
        : []),
    ];
  const askBody = (card: FaqAskCard) =>
    card.layout === 'rows' ? (
      <div className="flex flex-col gap-2">
        {askRows(card).map((row) => (
          <ContactLink
            key={`${row.kind}-${row.href}`}
            href={row.href}
            placement="page_cta"
            {...(row.kind === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`ja-hover-nudge flex min-h-[44px] items-center gap-3 rounded-xs border border-edge-soft bg-pale-1 px-4 py-3 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe ${
              row.kind === 'whatsapp'
                ? 'hover:border-success-soft-border'
                : 'hover:border-tint-border'
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] ${
                row.kind === 'whatsapp'
                  ? 'bg-success-soft text-success-text'
                  : 'bg-tint text-blue-safe'
              }`}
            >
              {row.kind === 'whatsapp' ? (
                <WhatsAppIcon size={16} />
              ) : row.kind === 'phone' ? (
                <PhoneIcon size={15} />
              ) : (
                <MailIcon size={15} />
              )}
            </span>
            <span className="flex min-w-0 flex-col leading-[1.3]">
              <span className="text-[12px] font-bold text-text-tertiary xl:text-[11px]">
                {label(row)}
              </span>
              <span className="truncate text-[14px] font-extrabold text-ink xl:text-[11px]">
                {row.value}
              </span>
            </span>
          </ContactLink>
        ))}
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">
        <ContactCta
          placement="page_cta"
          variant={card.whatsappVariant ?? 'success'}
          external
          href={waLink(card.whatsappNumber, card.whatsappText)}
          shape={card.buttonShape}
          radius={card.buttonRadius}
          icon={card.icons ? <WhatsAppIcon size={16} /> : undefined}
        >
          {t(card.whatsappLabelId)}
        </ContactCta>
        {card.phone && card.callLabelId && (
          <ContactCta
            placement="page_cta"
            variant="secondary"
            href={telLink(card.phone)}
            shape={card.buttonShape}
            radius={card.buttonRadius}
            icon={card.icons ? <PhoneIcon size={15} /> : undefined}
          >
            {t(card.callLabelId)}
          </ContactCta>
        )}
        {card.email && card.emailLabelId && (
          <ContactCta
            placement="page_cta"
            variant="secondary"
            href={mailLink(card.email, card.subject)}
            shape={card.buttonShape}
            radius={card.buttonRadius}
            icon={card.icons ? <MailIcon size={15} /> : undefined}
          >
            {t(card.emailLabelId)}
          </ContactCta>
        )}
      </div>
    );
  const askCardEl = (card: FaqAskCard, className: string) => (
    <div
      className={`rounded-base border border-edge bg-white px-6 py-[22px] xl:px-[18px] xl:py-[16.5px] ${className}`}
    >
      <h3 className="m-0 mb-1.5 text-[15.5px] font-extrabold xl:text-[11.6px]">
        {t(card.titleId)}
      </h3>
      <p className="m-0 mb-4 text-[14px] leading-[1.6] text-text-secondary xl:text-[11px]">
        {t(card.bodyId)}
      </p>
      {askBody(card)}
    </div>
  );
  // where the side-column copy of the ask card shows: everywhere (`side`), from lg up (`after` /
  // `whatsapp-after` — the phone copy sits below the list), from md up (`hidden`)
  const sideAskClass =
    mobileAsk === 'after' || mobileAsk === 'whatsapp-after'
      ? 'mt-6 max-lg:hidden'
      : mobileAsk === 'hidden'
        ? 'mt-6 max-md:hidden'
        : 'mt-6';
  const sticky = 'lg:sticky lg:top-(--sticky-top) lg:self-start';
  const headingClass = [
    'text-h2 mt-3 mb-4 leading-[1.05] tracking-[-1.6px] max-md:mb-2.5 max-md:text-[24px] max-md:leading-[1.14] max-md:tracking-[-0.5px] xl:tracking-[-1.2px]',
    centered ? 'text-center' : null,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div
      id={id}
      data-variant={variant}
      className={
        twoCol
          ? 'grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16'
          : centered
            ? 'mx-auto max-w-[900px] xl:max-w-[675px]'
            : undefined
      }
    >
      {hasSide && (
        <div
          className={
            [
              reveal ? 'ja-reveal' : null,
              twoCol ? sticky : null,
              centered ? 'text-center' : null,
              stacked ? 'mb-6' : null,
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
        >
          {eyebrowId && <Eyebrow>{t(eyebrowId)}</Eyebrow>}
          {/* Final pass A7 (W189 A6): the design's section-h2 face (−1.6 px, × 0.75 from 1101;
              line-height 1.05) and its `.ja-faq-side h2` ≤ 700 px rule (24 px / −0.5 px / 1.14,
              10 px below), which beats the design's global ≤ 600 px h2 rule by specificity. */}
          {headingId && <h2 className={headingClass}>{t(headingId)}</h2>}
          {bodyId && (
            <p
              className={`text-body m-0 text-text-secondary xl:text-pretty${centered ? ' mx-auto max-w-[640px]' : ''}`}
            >
              {t(bodyId)}
            </p>
          )}
          {askInSide && askCardEl(askCard, sideAskClass)}
        </div>
      )}
      <div
        className={reveal ? 'ja-reveal' : undefined}
        style={reveal ? { transitionDelay: '0.12s' } : undefined}
      >
        <Accordion
          items={items.map((it) => ({
            id: it.id,
            title: it.q,
            // W229: the answer keeps a ~95-character measure beside the ask card in the wider box.
            body: (
              <p className={twoCol && variant === 'list' ? 'm-0 xl:max-w-[560px]' : 'm-0'}>
                {it.a}
              </p>
            ),
          }))}
          singleOpen={singleOpen}
          defaultOpenId={openFirst ? items[0]?.id : undefined}
          headingLevel={headingLevel}
          panelClassName={panelClassName ?? (variant === 'cards' ? 'ja-panel' : undefined)}
          variant={variant}
          toggle={toggle}
          className={
            mobileGrouped
              ? 'max-md:gap-0 max-md:overflow-hidden max-md:rounded-base max-md:border max-md:border-border-4 max-md:bg-white'
              : undefined
          }
          itemClassName={
            mobileGrouped
              ? 'max-md:rounded-none max-md:border-x-0 max-md:border-b-0 max-md:first:border-t-0 max-md:hover:shadow-none'
              : undefined
          }
        />
        {/* phones: the ask card below the list (Available Workers M7), or only a full-width
            WhatsApp button there (Hire Workers M10, 46 px) */}
        {askCard &&
          (mobileAsk === 'after' || (stacked && mobileAsk === 'side')) &&
          askCardEl(askCard, stacked ? 'mt-6' : 'mt-6 lg:hidden')}
        {askCard && mobileAsk === 'whatsapp-after' && (
          <ContactCta
            placement="page_cta"
            variant={askCard.whatsappVariant ?? 'success'}
            external
            href={waLink(askCard.whatsappNumber, askCard.whatsappText)}
            shape={askCard.buttonShape}
            radius={askCard.buttonRadius}
            icon={<WhatsAppIcon size={16} />}
            className="mt-4 w-full lg:hidden"
          >
            {t(askCard.whatsappLabelId)}
          </ContactCta>
        )}
        {footer}
      </div>
      <JsonLd data={faqJsonLd(items.map(({ q, a }) => ({ q, a })))} />
    </div>
  );
}
