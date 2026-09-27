import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
import { Accordion, Eyebrow } from '@/design/primitives';
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

/** FAQ section body: side column (eyebrow, h2, sub, ask card — sticky from lg) + the
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
}) {
  const t = makeTf(bundle, locale);
  const hasSide = Boolean(eyebrowId || headingId || bodyId || askCard);
  return (
    <div id={id} className={hasSide ? 'grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16' : ''}>
      {hasSide && (
        <div className="lg:sticky lg:top-8 lg:self-start">
          {eyebrowId && <Eyebrow>{t(eyebrowId)}</Eyebrow>}
          {headingId && <h2 className="text-h2 mt-3 mb-4">{t(headingId)}</h2>}
          {bodyId && <p className="text-body m-0 text-text-secondary">{t(bodyId)}</p>}
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
      <div>
        <Accordion
          items={items.map((it) => ({
            id: it.id,
            title: it.q,
            body: <p className="m-0">{it.a}</p>,
          }))}
          singleOpen={singleOpen}
          defaultOpenId={openFirst ? items[0]?.id : undefined}
          headingLevel={headingLevel}
        />
        {footer}
      </div>
      <JsonLd data={faqJsonLd(items.map(({ q, a }) => ({ q, a })))} />
    </div>
  );
}
