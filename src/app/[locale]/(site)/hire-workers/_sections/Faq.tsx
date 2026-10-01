import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FAQ_PAIRS } from '../_lib/tables';

export function Faq({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const s = bundle.settings;
  const items: FaqItem[] = FAQ_PAIRS.map((p) => ({ id: p.id, q: tf(p.qId), a: tf(p.aId) }));
  return (
    <Section tone="pale" id="faq" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-faq">
        {/* the design's ask card has WhatsApp + call only — no W83 e-mail row */}
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq-list"
          items={items}
          eyebrowId="hire.194"
          headingId="hire.195"
          bodyId="hire.196"
          askCard={{
            titleId: 'hire.197',
            bodyId: 'hire.198',
            whatsappNumber: s.whatsappNumber,
            whatsappText: tf('hire.252'),
            whatsappLabelId: 'hire.041',
            phone: s.phone,
            callLabelId: 'hire.032',
          }}
          singleOpen
          openFirst
          headingLevel={3}
        />
      </div>
    </Section>
  );
}
