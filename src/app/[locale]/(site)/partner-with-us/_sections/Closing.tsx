import { ContactLink } from '@/analytics/ContactLink';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CLOSING_IDS, type Tf } from '../_lib/content';

/** The band's id — also the sticky bar's `hideNearId` (delta 12). */
export const CLOSING_ID = 'closing';

/**
 * The closing band: the foundation's dark `ClosingCtaBand` (tone `gradient`, delta 11) with
 * "Apply as a partner →" (#tracks) and the phone (tracked `call_click` `page_cta`, W12); the
 * reply badge (partner.186, `{replySlaHours}`) is the band's ≤ 700 px tick line, as the design
 * shows it on phones only. The legal line's e-mail is a tracked, underlined `ContactLink`.
 */
export function Closing({
  bundle,
  locale,
  tf,
  phone,
  phoneDisplay,
  email,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: Tf;
  phone: string;
  phoneDisplay: string;
  email: string;
}) {
  return (
    <Section tone="band">
      <div className="container-site" data-testid="partner-closing">
        <ClosingCtaBand
          bundle={bundle}
          locale={locale}
          id={CLOSING_ID}
          tone="gradient"
          titleId={CLOSING_IDS.heading}
          bodyId={CLOSING_IDS.body}
          primary={{ label: tf(CLOSING_IDS.primary), href: '#tracks' }}
          secondary={{ label: phoneDisplay, href: telLink(phone) }}
          ticks={[tf(CLOSING_IDS.badge)]}
        />
        <p className="m-0 mt-6 text-center text-body-sm text-text-tertiary">
          {tf(CLOSING_IDS.legal)}{' '}
          <ContactLink
            href={mailLink(email)}
            placement="page_cta"
            className="font-bold text-blue-safe underline"
          >
            {email}
          </ContactLink>
        </p>
      </div>
    </Section>
  );
}
