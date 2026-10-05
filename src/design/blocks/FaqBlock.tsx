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
import { ContactCta } from './ContactCta';

/** `q`/`a` arrive resolved (through the page's `makeTf`): FAQ pairs are package ids the page
 *  reads by exact id (W23). */
export type FaqItem = { id: string; q: string; a: string };

/** The design's "Question not listed?" card in the side column (Hire Workers, Contact,
 *  Available Workers). `whatsappText` is the page's own prefill id, resolved. `email`/
 *  `emailLabelId`/`subject` (W83) add a third, mailto, row — all three doors are optional so
 *  a page can offer just WhatsApp, WhatsApp+call, or all three. The WhatsApp row wears the
 *  `success` variant (the design's green outline), call/e-mail plain `secondary` (ink text, a
 *  D20 delta from the design's blue): no caller colour classes reach `ContactCta` (W122/W127). */
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
};

/** FAQ section body: side column (eyebrow, h2, sub, ask card — sticky from lg at `--sticky-top`
 *  like the site's other sticky columns: below the header at its real height, W232) + the
 *  accordion + the FAQPage node (AEO only, docs/SEO.md). Pages put it inside a
 *  `<Section tone="pale"><div className="container-site">…`. Ids resolve through
 *  `makeTf(bundle, locale)`, so a re-authored `{metric}` string (hire.198-style reply times)
 *  renders its number (D17). */
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
}) {
  const t = makeTf(bundle, locale);
  const hasSide = Boolean(eyebrowId || headingId || bodyId || askCard);
  return (
    <div id={id} className={hasSide ? 'grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16' : ''}>
      {hasSide && (
        <div
          className={
            reveal
              ? 'ja-reveal lg:sticky lg:top-(--sticky-top) lg:self-start'
              : 'lg:sticky lg:top-(--sticky-top) lg:self-start'
          }
        >
          {eyebrowId && <Eyebrow>{t(eyebrowId)}</Eyebrow>}
          {/* Final pass A7 (W189 A6): the design's section-h2 face (−1.6 px, × 0.75 from 1101;
              line-height 1.05) and its `.ja-faq-side h2` ≤ 700 px rule (24 px / −0.5 px / 1.14,
              10 px below), which beats the design's global ≤ 600 px h2 rule by specificity. */}
          {headingId && (
            <h2 className="text-h2 mt-3 mb-4 leading-[1.05] tracking-[-1.6px] max-md:mb-2.5 max-md:text-[24px] max-md:leading-[1.14] max-md:tracking-[-0.5px] xl:tracking-[-1.2px]">
              {t(headingId)}
            </h2>
          )}
          {bodyId && (
            <p className="text-body m-0 text-text-secondary xl:text-pretty">{t(bodyId)}</p>
          )}
          {askCard && (
            <div className="mt-6 rounded-base border border-border-1 bg-white p-6">
              <h3 className="text-card-title m-0 mb-1">{t(askCard.titleId)}</h3>
              <p className="text-body-sm m-0 mb-4 text-text-secondary">{t(askCard.bodyId)}</p>
              <div className="flex flex-wrap gap-2">
                <ContactCta
                  placement="page_cta"
                  variant="success"
                  external
                  href={waLink(askCard.whatsappNumber, askCard.whatsappText)}
                >
                  {t(askCard.whatsappLabelId)}
                </ContactCta>
                {askCard.phone && askCard.callLabelId && (
                  <ContactCta
                    placement="page_cta"
                    variant="secondary"
                    href={telLink(askCard.phone)}
                  >
                    {t(askCard.callLabelId)}
                  </ContactCta>
                )}
                {askCard.email && askCard.emailLabelId && (
                  <ContactCta
                    placement="page_cta"
                    variant="secondary"
                    href={mailLink(askCard.email, askCard.subject)}
                  >
                    {t(askCard.emailLabelId)}
                  </ContactCta>
                )}
              </div>
            </div>
          )}
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
            body: <p className={hasSide ? 'm-0 xl:max-w-[560px]' : 'm-0'}>{it.a}</p>,
          }))}
          singleOpen={singleOpen}
          defaultOpenId={openFirst ? items[0]?.id : undefined}
          headingLevel={headingLevel}
          panelClassName={panelClassName}
        />
        {footer}
      </div>
      <JsonLd data={faqJsonLd(items.map(({ q, a }) => ({ q, a })))} />
    </div>
  );
}
