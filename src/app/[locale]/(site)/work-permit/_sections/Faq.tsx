import { useTranslations } from 'next-intl';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { waPrefill } from '../_lib/prefill';
import { FAQ_PAIRS } from '../_lib/tables';

/** "Work permit questions" (#faq): nine pairs, the first open, one open at a time (as designed),
 *  one FAQPage node (AEO only). The fourth answer is `sys.wp.faq.exemptionAnswer` — `wp.340`
 *  has no answer id (delta 6, WP-C). The ask card is the design's WhatsApp + e-mail rows (W83 —
 *  no call row); hidden ≤ 700 px as designed (rows layout, `variant="cards"`). */
export function Faq({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const sys = useTranslations('sys');
  const s = bundle.settings;
  const items: FaqItem[] = FAQ_PAIRS.map((p) => ({
    id: p.id,
    q: tf(p.qId),
    a: p.aId ? tf(p.aId) : sys('wp.faq.exemptionAnswer'),
  }));
  return (
    <Section tone="pale" id="faq" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq-list"
          items={items}
          panelClassName="ja-panel"
          eyebrowId="wp.064"
          headingId="wp.328"
          bodyId="wp.329"
          askCard={{
            titleId: 'wp.330',
            bodyId: 'wp.331',
            whatsappNumber: s.whatsappNumber,
            whatsappText: waPrefill(sys, 'question'),
            whatsappLabelId: 'wp.332',
            email: s.email,
            emailLabelId: 'wp.333',
            subject: sys('wp.faq.emailSubject'),
            layout: 'rows',
            // the bold value of the WhatsApp row: the shared line when it is the same number
            whatsappDisplay:
              s.phone.replace(/\D/g, '') === s.whatsappNumber
                ? s.phoneDisplay
                : `+${s.whatsappNumber}`,
          }}
          variant="cards"
          mobileAsk="hidden"
          singleOpen
          openFirst
          headingLevel={3}
        />
      </div>
    </Section>
  );
}
