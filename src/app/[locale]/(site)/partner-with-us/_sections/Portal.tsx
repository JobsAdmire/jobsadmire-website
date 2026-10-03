import { ImageSlot, type CoverHeights } from '@/design/blocks/ImageSlot';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { CheckIcon } from '@/design/chrome/icons';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PORTAL_IDS, type Tf } from '../_lib/content';

/** The laptop screen's fixed height per band (design ll. 380 / 999; ×0.75 from 1101, D19). */
const LAPTOP_COVER: CoverHeights = { base: 240, md: 340, xl: 255 };

/**
 * The partner-portal showcase. partner.159 is `{placed} placements` (W1); the store row is
 * `StoreBadges` with the Android link only (W8 — `ios` stays null; its micro-copy is hire.240,
 * never partner.162/163, W7). The laptop and phone shots are named placeholders until the owner
 * supplies them (W55) — never the LCP element. The laptop slot runs the W189 cover mode at the
 * design's fixed heights (240 px ≤ 700, the authored 340 px to 1100, 340 × 0.75 = 255 px from
 * 1101 — Partner With Us ll. 380/999, D19), never a width-driven 720 × 340 ratio box: that box
 * read ≈ 217 px in the 1440 column while the phone was 291 px, so the phone overshot the laptop
 * and hid the address bar (QA W220 P-03). The phone is a 150 px wrapper, 112.5 px from 1101
 * (`xl:` twin, W190 A1a / W194 A5), hidden ≤ 700 px by CSS (W10).
 */
export function Portal({
  bundle,
  locale,
  tf,
  androidUrl,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: Tf;
  androidUrl: string | null;
}) {
  return (
    <Section tone="light" className="pb-0">
      <div className="container-site">
        <div
          data-testid="partner-portal"
          className="grid items-center gap-8 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-[#e8f3f9] p-5 md:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:p-12"
        >
          <div className="min-w-0">
            <Eyebrow>{tf(PORTAL_IDS.eyebrow)}</Eyebrow>
            <h2 className="text-h2 m-0 mt-3 mb-3 max-md:text-[24px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
              {tf(PORTAL_IDS.heading)}
            </h2>
            <p className="m-0 mb-6 text-body text-text-secondary">{tf(PORTAL_IDS.lead)}</p>
            <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
              {PORTAL_IDS.features.map(([lead, tail]) => (
                <li key={lead} className="flex items-start gap-3 text-body-sm text-text-secondary">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-success" />
                  <span>
                    <strong className="font-extrabold text-ink">{tf(lead)}</strong> {tf(tail)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="m-0 mb-6 flex items-start gap-2 text-body-sm text-text-secondary">
              <CheckIcon size={16} className="mt-0.5 shrink-0 text-blue-safe" />
              <span>
                <strong className="font-extrabold text-ink">{tf(PORTAL_IDS.claimLead)}</strong>{' '}
                {tf(PORTAL_IDS.claimTail)}
              </span>
            </p>
            <p className="m-0 mb-2.5 text-body-sm font-bold text-text-secondary">
              {tf(PORTAL_IDS.mobileLine)}
            </p>
            <StoreBadges bundle={bundle} locale={locale} android={androidUrl} />
          </div>
          <div className="relative min-w-0 pb-6">
            <div className="overflow-hidden rounded-base border border-tint-border bg-white shadow-[0_26px_60px_rgba(22,60,90,0.16)] xl:shadow-[0_19.5px_45px_rgba(22,60,90,0.16)] md:mr-[70px] xl:mr-[52.5px]">
              <div
                aria-hidden="true"
                className="flex items-center gap-1.5 border-b border-border-4 bg-[#f0f6fa] px-3.5 py-2.5"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="ml-2 min-w-0 flex-1 truncate rounded-[6px] border border-border-4 bg-white px-2.5 py-1 text-[11.5px] xl:text-[11px] text-text-tertiary">
                  {tf(PORTAL_IDS.addressBar)}
                </span>
              </div>
              <ImageSlot
                slot="partner-portal-screen"
                alt={tf(PORTAL_IDS.screenAlt)}
                width={720}
                height={340}
                cover={LAPTOP_COVER}
              />
            </div>
            <div className="absolute right-0 bottom-0 w-[150px] xl:w-[112.5px] rounded-[24px] bg-[#0f2438] p-[7px] xl:p-[5.25px] shadow-[0_26px_56px_rgba(15,36,56,0.35)] xl:shadow-[0_19.5px_42px_rgba(15,36,56,0.35)] max-md:hidden">
              <ImageSlot
                slot="partner-portal-mobile"
                alt={tf(PORTAL_IDS.mobileAlt)}
                width={136}
                height={274}
                className="rounded-[17px]"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
