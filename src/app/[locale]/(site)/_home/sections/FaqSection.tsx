import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import { LiveDot } from '../components/LiveDot';
import { H2 } from './styles';
import type { SectionProps } from './types';

const PAIRS = [
  ['home.294', 'home.295'],
  ['home.296', 'home.297'],
  ['home.298', 'home.299'],
  ['home.300', 'home.301'],
  ['home.302', 'home.303'],
  ['home.304', 'home.305'],
] as const;

/**
 * "Common questions" (design lines 1071–1089): the page's own eyebrow + h2 in the design's single
 * 880 px column, then `FaqBlock` without a side column — the accordion (`singleOpen={false}` keeps
 * the design's independent toggles) and the FAQPage node (AEO only, docs/SEO.md; the page's one
 * FaqBlock). The answers include the legal-flagged home.295/297/299/301/303, rendered as authored
 * (W1/W58/W142 — home.299's ₺38,944 is on the WP-C sheet beside the model's ₺40,214). The footer is
 * the design's own line + a tracked WhatsApp CTA with the fixed hire prefill.
 */
export function FaqSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const items: FaqItem[] = PAIRS.map(([q, a]) => ({ id: q, q: tf(q), a: tf(a) }));
  return (
    <Section tone="light">
      <div className="container-site">
        <div data-testid="faq" className="mx-auto max-w-[880px] xl:max-w-[660px]">
          <Eyebrow>{tf('home.180')}</Eyebrow>
          <h2 className={`${H2} mb-6 mt-3`}>{tf('home.181')}</h2>
          <FaqBlock
            bundle={bundle}
            locale={locale}
            items={items}
            singleOpen={false}
            headingLevel={3}
            footer={
              <div className="mt-[22px] flex flex-wrap items-center gap-3">
                <p className="m-0 text-body-sm font-bold text-text-tertiary">{tf('home.182')}</p>
                <ContactCta
                  placement="page_cta"
                  variant="success"
                  external
                  href={waLink(bundle.settings.whatsappNumber, sys('home.whatsapp.hire'))}
                >
                  <LiveDot />
                  {tf('home.183')}
                </ContactCta>
              </div>
            }
          />
        </div>
      </div>
    </Section>
  );
}
