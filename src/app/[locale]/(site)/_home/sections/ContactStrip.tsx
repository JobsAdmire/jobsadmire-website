import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { Section } from '@/design/primitives/Section';
import { telLink, waLink } from '@/lib/contact';
import type { SectionProps } from './types';

/**
 * The contact strip (design lines 1091–1106) as the shared `ClosingCtaBand` (`tone="navy"`): the
 * hero's "Request workers →" back to `#proposal` (the design reuses home.022), WhatsApp with the
 * fixed hire prefill, and "Call the office" — the design's Telegram button is gone (W226, owner:
 * WhatsApp is the messaging channel). Every CTA renders through `ContactCta`, so the WhatsApp and
 * phone actions fire `whatsapp_click`/`call_click` with `placement: 'page_cta'` (W12). At ≤ 460 px
 * all three stay (the design keeps two — a named delta; the block has no per-CTA breakpoint).
 */
export function ContactStrip({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const s = bundle.settings;
  return (
    <Section tone="band">
      <div data-testid="cta-band" className="container-site">
        <ClosingCtaBand
          bundle={bundle}
          locale={locale}
          titleId="home.184"
          bodyId="home.185"
          tone="navy"
          primary={{ label: tf('home.022'), href: '#proposal' }}
          secondary={{
            label: tf('home.221'),
            href: waLink(s.whatsappNumber, sys('home.whatsapp.hire')),
            external: true,
          }}
          extra={[{ label: tf('home.187'), href: telLink(s.phone) }]}
        />
      </div>
    </Section>
  );
}
