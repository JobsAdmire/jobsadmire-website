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
        {/* The design's FAQ (ll. 1118–1147, SHARED 6): one white card per question with the
            tint +/− circle; the ask card has WhatsApp + call only (no W83 e-mail row) as r10
            rectangles with their glyphs — WhatsApp white with the green edge. ≤ 700 px the
            list comes first and only the full-width WhatsApp button follows it (M10; the call
            lives in the mobile bottom bar). */}
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
            whatsappVariant: 'outline-green',
            buttonShape: 'rect',
            buttonRadius: 10,
            icons: true,
          }}
          variant="cards"
          toggle="plus"
          mobileAsk="whatsapp-after"
          singleOpen
          openFirst
          headingLevel={3}
        />
      </div>
    </Section>
  );
}
