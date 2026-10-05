import { ContactLink } from '@/analytics/ContactLink';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CLOSING_IDS, type Tf } from '../_lib/content';

/** The band's id. */
export const CLOSING_ID = 'closing';

/** ≤ 700 px the design's two buttons are full-width pills and the primary wears the 135°
 *  gradient with its blue shadow (Partner With Us ll. 400–401) — in its contrast-safe form
 *  (#1073a8 → #0d5f8a, D20). The band renders its own r11 rectangles; these phone-only rules
 *  reach them from this wrapper (the primary is the first link of the band's button row). */
const PHONE_BUTTONS =
  'max-md:[&_#closing_a]:rounded-pill max-md:[&_#closing_a:first-child]:bg-gradient-to-br max-md:[&_#closing_a:first-child]:from-blue-safe max-md:[&_#closing_a:first-child]:to-blue-deep max-md:[&_#closing_a:first-child]:shadow-[0_12px_28px_rgba(24,153,213,0.36)]';

/**
 * The closing band (Partner With Us ll. 1051–1064, S10.1 / M9): the light, centred, full-bleed
 * band (`ClosingCtaBand tone="light"` — #f4f9fc → #e8f3f9 under a #d3e6f2 edge) with the h2,
 * the lede, "Apply as a partner →" (#tracks, the solid blue face) and the grouped partner line in
 * the white/#bfdff0 outline (tracked `call_click` `page_cta`, W12), r11; on phones the green
 * reply pill (partner.186, `{replySlaHours}`) sits above the h2 and the buttons stack full
 * width. The licence line closes the band with its tracked, underlined e-mail `ContactLink` —
 * a page row drawn into the band's bottom padding (26 px under the buttons, the band's own
 * bottom edge below it), since the band's `note` carries plain text only.
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
    <div data-testid="partner-closing" className={`bg-[#e8f3f9] ${PHONE_BUTTONS}`}>
      <ClosingCtaBand
        bundle={bundle}
        locale={locale}
        id={CLOSING_ID}
        tone="light"
        titleId={CLOSING_IDS.heading}
        bodyId={CLOSING_IDS.body}
        primary={{ label: tf(CLOSING_IDS.primary), href: '#tracks', variant: 'primary' }}
        secondary={{ label: phoneDisplay, href: telLink(phone) }}
        badge={tf(CLOSING_IDS.badge)}
        fullWidthOnPhone
      />
      <p className="container-site relative m-0 -mt-[38px] pb-16 text-center text-[13.5px] text-text-tertiary max-md:-mt-[26px] max-md:pb-12 max-md:text-[11.5px] max-md:leading-[1.6] xl:-mt-[28.5px] xl:text-[11px]">
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
  );
}
