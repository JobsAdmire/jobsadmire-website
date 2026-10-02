import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Button } from '@/design/primitives/Button';
import { Link } from '@/i18n/navigation';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { BuildingIcon, UserCheckIcon } from '../_components/icons';
import { waPrefill } from '../_lib/prefill';

const ROUTE =
  'grid grid-cols-[38px_1fr_20px] items-center gap-x-3 rounded-sm px-3.5 py-3.5 text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** The closing band (#permit-cta). The header's "Apply for a permit" CTA (`CTA_BY_PATHNAME`)
 *  and the sticky bar's `hideNearId` both point here, so this id must exist (W17/W152/W158).
 *  Page-local (delta 8): the design's light, centred band — `ClosingCtaBand` is a dark card
 *  whose body cannot switch at ≤ 700 px. W10: the paragraph and the CTA set switch by CSS — two
 *  route cards ≤ 700 px, three buttons from 701 px — both server-rendered. */
export function PermitCta({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const s = bundle.settings;
  const permitOnly = waLink(s.whatsappNumber, waPrefill(sys, 'permitOnly'));
  return (
    <section
      id="permit-cta"
      data-testid="wp-cta"
      className="scroll-mt-24 border-t border-tint-border bg-gradient-to-b from-pale-1 to-tint py-16 max-md:py-10 lg:scroll-mt-32 xl:scroll-mt-40"
    >
      <div className="container-site">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="m-0 mb-3.5 text-h2 leading-[1.05] tracking-[-0.03em]">{tf('wp.359')}</h2>
          <p className="mx-auto mb-7 max-w-[620px] text-body-lg text-text-secondary max-md:mb-4">
            <span data-testid="wp-cta-desk" className="max-md:hidden">
              {tf('wp.360')}
            </span>
            <span data-testid="wp-cta-mob" className="md:hidden">
              {tf('wp.361')} <strong className="font-extrabold text-ink">{tf('wp.362')}</strong>
            </span>
          </p>
          <ul
            data-testid="wp-cta-routes"
            className="mb-4 flex flex-col gap-2.5 text-left md:hidden"
          >
            <li>
              <Link
                prefetch={false}
                href="/hire-workers"
                className={`${ROUTE} bg-blue-safe text-white`}
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 flex h-9.5 w-9.5 items-center justify-center rounded-xs bg-white/20"
                >
                  <BuildingIcon size={18} />
                </span>
                <span className="text-body font-extrabold">{tf('wp.363')}</span>
                <span
                  aria-hidden="true"
                  className="row-span-2 text-right text-body-lg font-extrabold"
                >
                  →
                </span>
                <span className="col-start-2 text-body-sm">{tf('wp.364')}</span>
              </Link>
            </li>
            <li>
              <ContactLink
                href={permitOnly}
                placement="page_cta"
                target="_blank"
                rel="noopener noreferrer"
                className={`${ROUTE} border-[1.5px] border-success-border bg-white text-ink`}
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 flex h-9.5 w-9.5 items-center justify-center rounded-xs bg-success-surface text-success-text"
                >
                  <UserCheckIcon size={18} />
                </span>
                <span className="text-body font-extrabold">{tf('wp.365')}</span>
                <span
                  aria-hidden="true"
                  className="row-span-2 text-right text-body-lg font-extrabold text-success-text"
                >
                  →
                </span>
                <span className="col-start-2 text-body-sm text-text-secondary">{tf('wp.089')}</span>
              </ContactLink>
            </li>
          </ul>
          <div
            data-testid="wp-cta-buttons"
            className="flex flex-wrap justify-center gap-3.5 max-md:hidden"
          >
            <Button variant="primary" size="lg" href="/hire-workers">
              {tf('wp.366')}
            </Button>
            <ContactCta placement="page_cta" variant="success" size="lg" external href={permitOnly}>
              {tf('wp.367')}
            </ContactCta>
            <ContactCta placement="page_cta" variant="secondary" size="lg" href={telLink(s.phone)}>
              {s.phoneDisplay}
            </ContactCta>
          </div>
          <p className="m-0 mt-6.5 text-body-sm text-text-secondary max-md:mt-4">
            {tf('wp.395')}{' '}
            <ContactLink
              href={mailLink(s.email)}
              placement="page_cta"
              className="font-bold text-blue-safe no-underline hover:underline"
            >
              {s.email}
            </ContactLink>
          </p>
        </div>
      </div>
    </section>
  );
}
