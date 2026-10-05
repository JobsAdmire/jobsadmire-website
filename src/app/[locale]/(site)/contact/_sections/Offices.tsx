import { useTranslations } from 'next-intl';
import { getOffice } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { BuildingIcon, PlaneIcon } from '../_components/icons';
import { ContactOfficeCard } from '../_components/ContactOfficeCard';
import { LiveStatus } from '../_components/LiveStatus';
import { OfficeTabs } from '../_components/OfficeTabs';
import type { FormAction } from '../_components/types';
import { VisitBooking } from '../_components/VisitBooking';
import { formDoor } from '../_lib/door';

const PILL =
  'rounded-pill border border-edge-soft bg-pale-1 px-[13px] py-1.5 text-body-sm font-extrabold text-text-secondary';
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
        <div className="ja-reveal relative overflow-hidden rounded-hero bg-gradient-to-br from-[#2c3a75] via-[#253063] to-[#16204a] p-6 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[100px] -top-[140px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(24,153,213,0.32)_0%,rgba(24,153,213,0)_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[160px] -left-[120px] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(24,153,213,0.14)_0%,rgba(24,153,213,0)_70%)]"
          />
          <div className="relative mb-8 flex flex-wrap items-end justify-between gap-6 text-white">
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
          {/* Both cards render once (e2e counts their live pills and rows); `OfficeTabs` shows
              one at a time ≤ 700 px (the design's Antalya | Karaçi tabs) and both side by side
              from there. `text-ink` keeps the cards' headings off the navy band's white. */}
          <OfficeTabs
            className="relative grid grid-cols-1 gap-4 text-ink md:grid-cols-1 lg:grid-cols-[1fr_72px_1fr] lg:items-stretch lg:gap-0"
            tabs={[
              {
                id: 'antalya',
                label: t('contact.096'),
                card: (
                  <ContactOfficeCard
                    bundle={bundle}
                    locale={locale}
                    office={antalya}
                    status={
                      <LiveStatus
                        variant="office"
                        hours={antalya.hours}
                        locale={locale}
                        fallback={t(antalya.hoursId)}
                        labels={labels}
                        className={PILL}
                      />
                    }
                  />
                ),
              },
              {
                id: 'karachi',
                label: t('contact.097'),
                card: (
                  <ContactOfficeCard
                    bundle={bundle}
                    locale={locale}
                    office={karachi}
                    status={
                      <LiveStatus
                        variant="office"
                        hours={karachi.hours}
                        locale={locale}
                        fallback={t(karachi.hoursId)}
                        labels={labels}
                        className={PILL}
                      />
                    }
                  />
                ),
              },
            ]}
            plane={
              <div
                aria-hidden="true"
                className="flex flex-col items-center justify-center text-white max-lg:hidden"
              >
                <span className={DASH} />
                {/* `.ja-plane`: the plane flies in once the card is revealed */}
                <span className="ja-plane my-2.5 flex h-[46px] w-[46px] items-center justify-center rounded-full border-[1.5px] border-dashed border-white/45 bg-white/10">
                  <PlaneIcon size={19} />
                </span>
                <span className={DASH} />
              </div>
            }
          />
          <div className="relative mt-6 flex flex-wrap items-center gap-5 rounded-[18px] border border-white/25 bg-white/10 px-7 py-[22px] text-white max-md:px-5">
            <span
              aria-hidden="true"
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] bg-white/20"
            >
              <BuildingIcon size={20} />
            </span>
            <div className="min-w-0 flex-1 basis-[280px] max-md:basis-[calc(100%-4.25rem)]">
              <h3 className="m-0 mb-1 text-body text-white">{t('contact.110')}</h3>
              <p className="m-0 text-body-sm text-white/85 xl:max-w-[640px]">{t('contact.111')}</p>
            </div>
            <ContactCta
              placement="page_cta"
              href={waLink(bundle.settings.whatsappNumber, sys('contact.wa.visitSite'))}
              external
              variant="white"
              shape="rect"
              radius={11}
              className="max-md:w-full"
            >
              {t('contact.112')}
            </ContactCta>
          </div>
        </div>
        <div className="ja-reveal mt-5" style={{ transitionDelay: '0.1s' }}>
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
