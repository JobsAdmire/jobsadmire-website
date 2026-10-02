import { useTranslations } from 'next-intl';
import { getOffice } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { OfficeCard } from '@/design/blocks/OfficeCard';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { BuildingIcon, PlaneIcon } from '../_components/icons';
import { LiveStatus } from '../_components/LiveStatus';
import type { FormAction } from '../_components/types';
import { VisitBooking } from '../_components/VisitBooking';
import { formDoor } from '../_lib/door';

const PILL =
  'rounded-pill border border-border-2 bg-pale-1 px-3 py-1.5 text-body-sm font-extrabold text-text-secondary';
const NOTE = 'm-0 mt-3 text-body-sm text-text-tertiary max-md:hidden';
const DASH = 'w-0 flex-1 border-l-2 border-dashed border-white/30';

/** "Two offices, one file": the navy card with both `OfficeCard`s (their tel / WhatsApp / mail
 *  rows fire `office_card`, W12), each with its live pill; the site-visit band; the visit card. */
export function Offices({
  bundle,
  locale,
  submitVisit,
}: {
  bundle: Bundle;
  locale: Locale;
  submitVisit: FormAction;
}) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const raw = (key: string) => String(sys.raw(key));
  const antalya = getOffice(bundle, 'antalya');
  const karachi = getOffice(bundle, 'karachi');
  const labels = {
    openNow: raw('contact.status.openNow'),
    closedOpensAt: raw('contact.status.closedOpensAt'),
    closedOpensTomorrow: raw('contact.status.closedOpensTomorrow'),
    closedOpensOn: raw('contact.status.closedOpensOn'),
  };
  return (
    <Section tone="pale">
      <div data-testid="contact-offices" className="container-site">
        <div className="relative overflow-hidden rounded-hero bg-gradient-to-br from-[#2c3a75] via-[#253063] to-[#16204a] p-6 md:p-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6 text-white">
            <div className="max-w-[560px]">
              <p className="m-0 mb-4 inline-block rounded-pill border border-white/30 bg-white/15 px-4 py-1.5 text-eyebrow font-extrabold uppercase tracking-[1.8px]">
                {t('contact.092')}
              </p>
              <h2 className="m-0 mb-3.5 text-h2 text-white max-md:text-[25px] max-md:leading-[1.13] max-md:tracking-[-0.6px]">
                {t('contact.093')}
              </h2>
              <p className="m-0 text-body text-white/90">{t('contact.094')}</p>
            </div>
            <p className="m-0 inline-flex items-center gap-2 rounded-pill border border-white/30 bg-white/15 px-4 py-2 text-body-sm font-extrabold max-md:hidden">
              <PlaneIcon size={14} />
              {t('contact.095')}
            </p>
          </div>
          {/* OfficeCard sets no text colour of its own: `text-ink` keeps its headings off the navy
              card's white. D20: the design's ≤ 700 px tabs are a stacked column (both cards in
              the HTML). */}
          <div className="grid grid-cols-1 gap-4 text-ink lg:grid-cols-[1fr_72px_1fr] lg:gap-0">
            <OfficeCard bundle={bundle} locale={locale} office={antalya}>
              <LiveStatus
                variant="office"
                hours={antalya.hours}
                locale={locale}
                fallback={t(antalya.hoursId)}
                labels={labels}
                className={PILL}
              />
              <p className={NOTE}>{t('contact.101')}</p>
            </OfficeCard>
            <div
              aria-hidden="true"
              className="flex flex-col items-center justify-center text-white max-lg:hidden"
            >
              <span className={DASH} />
              <span className="my-2.5 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-dashed border-white/45 bg-white/10">
                <PlaneIcon size={19} />
              </span>
              <span className={DASH} />
            </div>
            <OfficeCard bundle={bundle} locale={locale} office={karachi}>
              <LiveStatus
                variant="office"
                hours={karachi.hours}
                locale={locale}
                fallback={t(karachi.hoursId)}
                labels={labels}
                className={PILL}
              />
              <p className={NOTE}>{t('contact.108')}</p>
              {/* W195: a cross-route page link never prefetches in the viewport (hover still does). */}
              <Link
                href="/available-workers"
                prefetch={false}
                className="mt-2 inline-flex min-h-[44px] items-center text-body-sm font-extrabold text-success-text underline"
              >
                {t('contact.109')}
              </Link>
            </OfficeCard>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-5 rounded-md border border-white/25 bg-white/10 p-5 text-white md:p-6">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-white/20"
            >
              <BuildingIcon size={20} />
            </span>
            <div className="min-w-0 flex-1 basis-[280px]">
              <h3 className="m-0 mb-1 text-body text-white">{t('contact.110')}</h3>
              <p className="m-0 text-body-sm text-white/85">{t('contact.111')}</p>
            </div>
            <ContactCta
              placement="page_cta"
              href={waLink(bundle.settings.whatsappNumber, sys('contact.wa.visitSite'))}
              external
              variant="inverse"
            >
              {t('contact.112')}
            </ContactCta>
          </div>
        </div>
        <div className="mt-5">
          <VisitBooking
            {...formDoor(bundle, locale)}
            action={submitVisit}
            hours={antalya.hours}
            copy={{
              eyebrow: t('contact.113'),
              title: t('contact.114'),
              body: t('contact.115'),
              dayLegend: t('contact.116'),
              timeLegend: t('contact.117'),
              toggleOpen: t('contact.213'),
              toggleClose: t('contact.212'),
              nameLabel: t('contact.066'),
              emailLabel: t('contact.067'),
              phoneLabel: t('contact.068'),
              submit: sys('contact.visit.submit'),
              fallbackIntro: sys('contact.fallbackIntro.visit'),
            }}
          />
        </div>
      </div>
    </Section>
  );
}
