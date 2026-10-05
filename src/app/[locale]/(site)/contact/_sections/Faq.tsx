import { useTranslations } from 'next-intl';
import { makeTf, metricValues } from '@/content/pure';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** "Before you write": the page's one FaqBlock (one FAQPage node, AEO only) with the design's
 *  WhatsApp ask card (W83 — the one door the design gives it). */
export function Faq({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const { replySlaHours } = metricValues(bundle, locale);
  // The package ships six questions but four answers (contact.196/198/201/204): answers 3 and 5 are
  // sys copy (W9); answer 3 takes the lines' hours (contact.135) and the SLA metric (D17).
  const items: FaqItem[] = [
    { id: 'q1', q: t('contact.195'), a: t('contact.196') },
    { id: 'q2', q: t('contact.197'), a: t('contact.198') },
    {
      id: 'q3',
      q: t('contact.199'),
      a: sys('contact.faq.a3', { hours: t('contact.135'), replyHours: replySlaHours ?? '' }),
    },
    { id: 'q4', q: t('contact.200'), a: t('contact.201') },
    { id: 'q5', q: t('contact.202'), a: sys('contact.faq.a5') },
    { id: 'q6', q: t('contact.203'), a: t('contact.204') },
  ];
  return (
    <Section tone="light">
      <div data-testid="contact-faq" className="container-site">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          items={items}
          eyebrowId="contact.119"
          headingId="contact.120"
          bodyId="contact.121"
          openFirst
          headingLevel={3}
          reveal
          panelClassName="ja-panel-soft"
          askCard={{
            titleId: 'contact.122',
            bodyId: 'contact.123',
            whatsappNumber: bundle.settings.whatsappNumber,
            whatsappText: sys('contact.wa.main'),
            whatsappLabelId: 'contact.124',
          }}
        />
      </div>
    </Section>
  );
}
