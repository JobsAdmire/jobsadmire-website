import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { formatPhoneDisplay } from '@/lib/contact/partner-line';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FAQ_IDS, type Tf } from '../_lib/content';

/** The page's one FaqBlock (one FAQPage node — final-review page rule): six pairs, the first
 *  open, each its own white card with the 28 px tint "+" circle (S9.1, `variant="cards"`); the
 *  ask card is the design's three contact rows (S9.2, `layout: 'rows'`: a 34 px icon tile, the
 *  grey label, the bold number / address, a 3 px nudge under the pointer) — WhatsApp (the
 *  page's static prefill, W95), call and e-mail (W83: `email`/`emailLabelId`/`subject`, all
 *  `page_cta`). On phones (M8) the ask card is dropped and the six pairs fold into one r16
 *  card with inner dividers. */
export function Faq({
  bundle,
  locale,
  tf,
  whatsappNumber,
  whatsappText,
  phone,
  phoneDisplay,
  email,
  emailSubject,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: Tf;
  whatsappNumber: string;
  /** `sys.partner.faq.whatsappText` */
  whatsappText: string;
  phone: string;
  /** the partner line grouped for the eye ("+90 501 124 03 40", W176) */
  phoneDisplay: string;
  email: string;
  /** `sys.partner.faq.emailSubject` */
  emailSubject: string;
}) {
  const items: FaqItem[] = FAQ_IDS.pairs.map(([q, a], i) => ({
    id: `partner-faq-${i + 1}`,
    q: tf(q),
    a: tf(a),
  }));
  return (
    <Section tone="light">
      <div className="container-site" data-testid="partner-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq"
          items={items}
          eyebrowId={FAQ_IDS.eyebrow}
          headingId={FAQ_IDS.heading}
          bodyId={FAQ_IDS.lead}
          openFirst
          variant="cards"
          mobileAsk="hidden"
          mobileGrouped
          askCard={{
            layout: 'rows',
            whatsappDisplay: formatPhoneDisplay(`+${whatsappNumber}`),
            phoneDisplay,
            titleId: FAQ_IDS.askTitle,
            bodyId: FAQ_IDS.askBody,
            whatsappNumber,
            whatsappText,
            whatsappLabelId: FAQ_IDS.askWhatsApp,
            phone,
            callLabelId: FAQ_IDS.askCall,
            email,
            emailLabelId: FAQ_IDS.askEmail,
            subject: emailSubject,
          }}
        />
      </div>
    </Section>
  );
}
