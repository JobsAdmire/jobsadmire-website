import { useTranslations } from 'next-intl';
import type { Founder } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { Register } from '../_lib/register';

/** The FAQ — phones only (S5.1: the design's `.ja-vr-faq` is `display:none` from 701 px, Verify
 *  ll. 912–929, 456), as white bordered cards with the blue ⌄ (M10); the FAQPage node is in the
 *  HTML at every width — one source for the DOM and the node, never the design's
 *  differently-worded JSON-LD twin (V-4). Two Phase A fallbacks, each a whole `sys` string
 *  (W23 forbids composing a package sentence with a sys tail): §10 row 3 — verify.104 names the
 *  founder, so it answers "who can sign?" only once the W86 row is published, until then the
 *  name-less `sys.verify.faq.whoSigns`; QA W220 V-01 — verify.106 promises "the page shows the
 *  person's official record", which the empty register cannot do (`LookupCard` answers
 *  `register_unavailable`), so q3 reads `sys.verify.faq.howToCheck` until `representatives` has
 *  published rows — the same `register.active.length > 0` test the page, Hero and Structure use
 *  (W202). The FAQPage node is built from the same items, so AEO never claims the lookup. */
export function Faq({
  bundle,
  locale,
  founder,
  register,
}: {
  bundle: Bundle;
  locale: Locale;
  founder: Founder | null;
  register: Register;
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
    {
      id: 'q3',
      q: tf('verify.105'),
      a: register.active.length > 0 ? tf('verify.106') : sys('verify.faq.howToCheck'),
    },
    { id: 'q4', q: tf('verify.107'), a: tf('verify.108') },
  ];
  return (
    <Section tone="pale" className="border-t border-border-1 pt-[34px] pb-[30px] md:hidden">
      <div className="container-site" data-testid="verify-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          items={items}
          eyebrowId="verify.099"
          headingId="verify.100"
          variant="cards"
          toggle="chevron"
          layout="stacked"
          singleOpen
        />
      </div>
    </Section>
  );
}
