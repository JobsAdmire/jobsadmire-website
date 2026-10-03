import { ContactCta } from '@/design/blocks/ContactCta';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CheckIcon, PhoneIcon, StarIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';

const DOT = 'inline-block h-2.5 w-2.5 rounded-pill bg-border-2';

export function PortalPreview({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const s = bundle.settings;
  const host = new URL(s.portal.host).host; // "portal.jobsadmire.com" — the mock's address bar
  const proofA = tf('hire.191');
  const proofB = tf('hire.192');
  return (
    <div className="bg-white pb-16">
      <div className="container-site">
        <div
          data-testid="hire-portal"
          className="flex flex-col gap-12 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint px-6 py-10 max-md:gap-6 max-md:rounded-lg max-md:px-4 max-md:py-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-14 lg:py-14"
        >
          <div>
            <Eyebrow>{tf('hire.182')}</Eyebrow>
            <h2 className="m-0 mb-4 mt-3 text-h2 leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px] xl:text-balance max-md:mb-2.5 max-md:text-[24px] max-md:leading-[1.14] max-md:tracking-[-0.5px]">
              {tf('hire.183')}
            </h2>
            <p className="m-0 mb-5 text-body text-text-secondary max-md:mb-4 max-md:text-[14.5px] max-md:leading-[1.55]">
              {tf('hire.184')}
            </p>
            <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
              {(['hire.185', 'hire.186'] as const).map((id) => (
                <li
                  key={id}
                  className="flex items-center gap-3 text-body text-ink max-md:text-[14px] max-md:leading-[1.35]"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-pill bg-success text-white"
                  >
                    <CheckIcon size={13} />
                  </span>
                  {tf(id)}
                </li>
              ))}
            </ul>
            <div className="mb-7 grid gap-3.5 sm:grid-cols-2">
              {(
                [
                  ['hire.187', 'hire.188', StarIcon],
                  ['hire.189', 'hire.190', PhoneIcon],
                ] as const
              ).map(([title, body, Icon]) => (
                <div
                  key={title}
                  className="rounded-sm border border-tint-border bg-pale-1 px-5 py-4"
                >
                  <div className="mb-2 flex items-center gap-2.5">
                    <Icon size={18} className="flex-none text-blue-safe" />
                    <p className="m-0 text-body font-extrabold text-ink">{tf(title)}</p>
                  </div>
                  <p className="m-0 text-body-sm text-text-secondary max-md:text-[12.5px] max-md:leading-[1.5]">
                    {tf(body)}
                  </p>
                </div>
              ))}
            </div>
            <p className="m-0 mb-6 flex items-start gap-2.5 text-body text-text-secondary max-md:text-[13px] max-md:leading-[1.45]">
              <CheckIcon size={17} className="mt-0.5 flex-none text-blue-safe" />
              <span>
                <strong className="text-ink">{proofA}</strong>
                {sp(proofA, proofB)}
                {proofB}
              </span>
            </p>
            <ContactCta
              placement="page_cta"
              href={waLink(s.whatsappNumber, tf('hire.251'))}
              external
              size="lg"
            >
              {tf('hire.193')}
            </ContactCta>
          </div>
          <div className="relative md:order-first md:min-h-[440px] xl:mx-auto xl:w-full xl:max-w-[413px]">
            <div className="overflow-hidden rounded-sm border border-tint-border bg-white shadow-card-hover md:absolute md:left-0 md:top-0 md:w-[80%]">
              <div className="flex items-center gap-1.5 border-b border-border-4 bg-pale-2 px-3.5 py-2.5">
                <span aria-hidden="true" className={DOT} />
                <span aria-hidden="true" className={DOT} />
                <span aria-hidden="true" className={DOT} />
                <span className="ml-2 flex-1 rounded-[6px] border border-border-4 bg-white px-2.5 py-1 text-eyebrow text-text-tertiary">
                  {host}
                </span>
              </div>
              {/* W129: the slot owns its box — the mock's full width at 800:310 */}
              <ImageSlot
                slot="portal-shortlist"
                src={null}
                alt={tf('hire.243')}
                width={800}
                height={310}
              />
            </div>
            {/* the phone frame sizes the slot (156×312 inside an 8 px bezel); ≤ 700 px it hides */}
            <div className="absolute bottom-0 right-6 z-[2] h-[328px] w-[172px] rounded-[26px] bg-navy p-2 shadow-card-hover max-md:hidden">
              <ImageSlot
                slot="portal-mobile-app"
                src={null}
                alt={tf('hire.244')}
                width={156}
                height={312}
                className="rounded-[19px]"
              />
            </div>
            <div className="mt-2.5 rounded-base border border-tint-border bg-white px-4 py-3.5 shadow-card-hover md:absolute md:bottom-6 md:left-0 md:z-[3] md:mt-0 md:max-w-[230px]">
              <p className="m-0 mb-1.5 flex items-center gap-2 text-body-sm font-extrabold text-ink">
                <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
                {tf('hire.180')}
              </p>
              <p className="m-0 text-body-sm text-text-tertiary">{tf('hire.181')}</p>
              {/* ≤ 700 px: the design's decorative 12-of-15 progress bar */}
              <span
                aria-hidden="true"
                className="mt-2.5 block h-[7px] overflow-hidden rounded-pill bg-tint md:hidden"
              >
                <span className="block h-full w-4/5 rounded-pill bg-success" />
              </span>
            </div>
            <div className="mt-2.5 md:hidden">
              <StoreBadges
                bundle={bundle}
                locale={locale}
                android={s.storeLinks.android}
                ios={s.storeLinks.ios}
                tone="light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
