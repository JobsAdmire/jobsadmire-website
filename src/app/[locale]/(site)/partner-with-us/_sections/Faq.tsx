import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FAQ_IDS, type Tf } from '../_lib/content';

/** The page's one FaqBlock (one FAQPage node — final-review page rule): six pairs, the first
 *  open; the ask card's three rows are WhatsApp (the page's static prefill, W95), call and
 *  e-mail (W83: `email`/`emailLabelId`/`subject`, all `page_cta`). */
export function Faq({
  bundle,
  locale,
  tf,
  whatsappNumber,
  whatsappText,
  phone,
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
          askCard={{
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
