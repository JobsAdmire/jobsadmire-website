import { useTranslations } from 'next-intl';
import type { Founder } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The FAQ at every width (V-4) — one source for the DOM and the FAQPage node, never the
 *  design's differently-worded JSON-LD twin. §10 row 3: verify.104 names the founder, so it
 *  answers "who can sign?" only once the W86 row is published; until then the name-less
 *  `sys.verify.faq.whoSigns`. */
export function Faq({
  bundle,
  locale,
  founder,
}: {
  bundle: Bundle;
  locale: Locale;
  founder: Founder | null;
}) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const items: FaqItem[] = [
    { id: 'q1', q: tf('verify.101'), a: tf('verify.102') },
    {
      id: 'q2',
      q: tf('verify.103'),
      a: founder ? tf('verify.104') : sys('verify.faq.whoSigns'),
    },
    { id: 'q3', q: tf('verify.105'), a: tf('verify.106') },
    { id: 'q4', q: tf('verify.107'), a: tf('verify.108') },
  ];
  return (
    <Section tone="pale">
      <div className="container-site" data-testid="verify-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          items={items}
          eyebrowId="verify.099"
          headingId="verify.100"
        />
      </div>
    </Section>
  );
}
