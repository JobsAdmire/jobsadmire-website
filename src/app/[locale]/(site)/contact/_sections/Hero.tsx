import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { getOffice } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { CheckIcon, MailIcon, PhoneIcon, WhatsAppIcon } from '@/design/chrome/icons';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CallbackWidget } from '../_components/CallbackWidget';
import { UsersIcon } from '../_components/icons';
import { LiveStatus } from '../_components/LiveStatus';
import type { FormAction } from '../_components/types';
import { formDoor } from '../_lib/door';
import { LANGUAGE_CODES } from '../_lib/options';
import { partnerLineOf } from '@/lib/contact/partner-line';

/** The channel cards' shared frame: colourless and borderless, so each card adds its own border,
 *  layout and padding without a second utility for one property (W122). */
const CARD =
  'rounded-md bg-white text-ink no-underline transition-shadow hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';
const PHONE_CARD = `${CARD} flex min-w-0 flex-col items-start gap-2 border border-border-1 p-4 md:p-5`;
const TILE = 'flex shrink-0 items-center justify-center';

/** The dark hero: live office pill, the h1 (the LCP element), the channel stack — WhatsApp, the
 *  two phone lines, e-mail — and the callback widget. Every door is a settings value. */
export function Hero({
  bundle,
  locale,
  submitCallback,
}: {
  bundle: Bundle;
  locale: Locale;
  submitCallback: FormAction;
}) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const raw = (key: string) => String(sys.raw(key));
  const { settings } = bundle;
  const antalya = getOffice(bundle, 'antalya');
  const hoursText = t(antalya.hoursId);
  // W176: the Agencies card is the partner line, `settings.partnershipsPhone` with the main line
  // as the fallback while it is null — the same rule as the Partner page (T5).
  const partnerLine = partnerLineOf(settings);
  const lines = { open: t('contact.215'), closed: t('contact.216') };
  return (
    <Section tone="dark" className="relative overflow-hidden">
      {/* §10 #4/D26: the full-bleed photo slot is a named placeholder under the design's two
          overlays, so the h1 stays the LCP element. ImageSlot owns its box — its wrapper sizes it
          (W129). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <ImageSlot slot="contact-hero" alt="" width={1600} height={900} />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70"
      />
      <div data-testid="contact-hero" className="container-site relative">
        <Breadcrumbs
          locale={locale}
          tone="dark"
          className="mb-5"
          items={[
            { name: t('contact.023'), href: '/' },
            { name: t('contact.024'), href: '/contact' },
          ]}
        />
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-13">
          <div className="min-w-0">
            <LiveStatus
              variant="hero"
              hours={antalya.hours}
              locale={locale}
              fallback={hoursText}
              labels={{
                openNow: t('contact.152'),
                inCity: t('contact.153'),
                weekend: t('contact.154'),
                closedToday: t('contact.155'),
                opensAt: raw('contact.status.opensAt'),
              }}
              className="mb-4 rounded-pill border border-border-1 bg-white px-4 py-1.5 text-body-sm font-extrabold text-text-secondary"
            />
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em] text-white max-[601px]:text-[32px] max-[601px]:tracking-[-0.6px]"
            >
              {t('contact.025')} <span className="text-sky">{t('contact.026')}</span>
            </h1>
            {/* W10: the desktop and phone paragraphs are both in the HTML, one shown per width. */}
            <p className="m-0 max-w-[520px] text-body-lg text-white/80">
              <span className="hidden md:inline">{t('contact.027')}</span>
              <span className="md:hidden">{t('contact.028')}</span>
            </p>
            <ul className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0 max-md:hidden">
              <li className="inline-flex items-center gap-2 rounded-pill border border-success-border bg-white px-3.5 py-1.5 text-body-sm font-extrabold text-success-text">
                <CheckIcon size={13} />
                {t('contact.029')}
              </li>
              <li className="inline-flex items-center rounded-pill border border-border-1 bg-white px-3.5 py-1.5 text-body-sm font-extrabold text-text-secondary">
                {t('contact.030')}
              </li>
            </ul>
            <div className="mt-5 max-w-[520px] rounded-base border border-border-1 bg-white p-5 text-ink max-md:hidden">
              <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1.4px] text-text-tertiary">
                {t('contact.031')}
              </p>
              <ul className="m-0 mb-3 flex list-none flex-wrap gap-2 p-0">
                {LANGUAGE_CODES.map((code) => (
                  <li
                    key={code}
                    lang={code}
                    className="rounded-pill border border-tint-border bg-tint px-3.5 py-1 text-body-sm font-extrabold text-blue-safe"
                  >
                    {sys(`contact.languages.${code}`)}
                  </li>
                ))}
              </ul>
              <p className="m-0 text-body-sm text-text-tertiary">{t('contact.032')}</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-3.5">
            <ContactLink
              href={waLink(settings.whatsappNumber, sys('contact.wa.main'))}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              className={`${CARD} relative flex flex-col gap-2.5 border-[1.5px] border-success-border p-5 shadow-[0_14px_34px_rgba(22,60,90,0.09)] md:flex-row md:items-center md:gap-4 md:p-6`}
            >
              <span className="absolute right-4 top-3.5 rounded-pill border border-success-border bg-white px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[1px] text-success-text max-md:static max-md:self-start">
                {t('contact.033')}
              </span>
              <span
                aria-hidden="true"
                className={`${TILE} h-11 w-11 rounded-sm bg-success-surface text-success-text md:h-13 md:w-13`}
              >
                <WhatsAppIcon size={24} />
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-success-text">
                  {sys('contact.channels.whatsapp')}
                </span>
                <span className="text-card-title font-extrabold text-ink">
                  {settings.phoneDisplay}
                </span>
                <span className="text-body-sm text-text-tertiary max-md:hidden">
                  {t('contact.034')}
                </span>
                <LiveStatus
                  variant="whatsapp"
                  hours={antalya.hours}
                  locale={locale}
                  fallback={hoursText}
                  labels={{
                    watched: raw('contact.status.waWatched'),
                    off: raw('contact.status.waOff'),
                  }}
                  className="mt-1 text-body-sm font-extrabold text-text-secondary"
                />
              </span>
              {/* D20: the design's ≤ 700 px CSS `::after` "Open WhatsApp →", as real text. */}
              <span className="flex min-h-[44px] items-center justify-center rounded-pill bg-success-text px-4 text-body-sm font-extrabold text-white md:hidden">
                {sys('contact.channels.open')}
              </span>
            </ContactLink>
            <div className="grid grid-cols-2 gap-3">
              <ContactLink
                href={telLink(settings.phone)}
                placement="page_cta"
                className={PHONE_CARD}
              >
                <span
                  aria-hidden="true"
                  className={`${TILE} h-9 w-9 rounded-xs bg-tint text-blue-safe md:h-11 md:w-11`}
                >
                  <PhoneIcon size={18} />
                </span>
                <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">
                  {t('contact.035')}
                </span>
                <span className="text-body-sm font-extrabold text-ink md:text-body">
                  {settings.phoneDisplay}
                </span>
                <span className="text-body-sm text-text-tertiary max-md:hidden">
                  {t('contact.036')}
                </span>
                <LiveStatus
                  variant="lines"
                  hours={antalya.hours}
                  locale={locale}
                  fallback={t('contact.135')}
                  suffix={t('contact.135')}
                  labels={lines}
                  className="text-body-sm font-extrabold text-text-secondary max-md:hidden"
                />
              </ContactLink>
              <ContactLink
                href={telLink(partnerLine.phone)}
                placement="page_cta"
                className={PHONE_CARD}
              >
                <span
                  aria-hidden="true"
                  className={`${TILE} h-9 w-9 rounded-xs bg-pale-1 text-navy md:h-11 md:w-11`}
                >
                  <UsersIcon size={18} />
                </span>
                <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-navy">
                  {t('contact.037')}
                </span>
                <span className="text-body-sm font-extrabold text-ink md:text-body">
                  {partnerLine.phoneDisplay}
                </span>
                <span className="text-body-sm text-text-tertiary max-md:hidden">
                  {t('contact.038')}
                </span>
                <LiveStatus
                  variant="lines"
                  hours={antalya.hours}
                  locale={locale}
                  fallback={t('contact.135')}
                  suffix={t('contact.135')}
                  labels={lines}
                  className="text-body-sm font-extrabold text-text-secondary max-md:hidden"
                />
              </ContactLink>
            </div>
            <ContactLink
              href={mailLink(settings.email)}
              placement="page_cta"
              className={`${CARD} flex items-center gap-3.5 border border-border-1 p-5 max-md:hidden`}
            >
              <span
                aria-hidden="true"
                className={`${TILE} h-11 w-11 rounded-xs bg-warning-surface text-warning-text`}
              >
                <MailIcon size={19} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-body font-extrabold text-ink">{settings.email}</span>
                <span className="text-body-sm text-text-tertiary">{t('contact.039')}</span>
                <span className="text-body-sm font-extrabold text-text-tertiary">
                  {t('contact.040')}
                </span>
              </span>
            </ContactLink>
            <CallbackWidget
              {...formDoor(bundle, locale)}
              action={submitCallback}
              copy={{
                title: t('contact.041'),
                sub: t('contact.042'),
                dayLegend: t('contact.043'),
                slotLegend: t('contact.044'),
                days: {
                  today: t('contact.205'),
                  tomorrow: t('contact.206'),
                  this_week: t('contact.207'),
                },
                anyTime: t('contact.209'),
                nameLabel: t('contact.066'),
                phoneLabel: t('contact.068'),
                phonePlaceholder: t('contact.049'),
                submit: t('contact.045'),
                note: t('contact.046'),
                fallbackIntro: sys('contact.fallbackIntro.callback'),
              }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
