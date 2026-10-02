import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf, metricValues } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { SEO_IDS, STICKY_IDS } from './_lib/content';
import { countryOptions } from './_lib/country-options';
import { PARTNER_LOGOS } from './_lib/logos';
import { partnerLineOf } from './_lib/partner-line';
import type { TrackKey } from './_lib/tracks';
import { Chain } from './_sections/Chain';
import { CLOSING_ID, Closing } from './_sections/Closing';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Logos } from './_sections/Logos';
import {
  HrAgencyForm,
  InstituteForm,
  SourcingPartnerForm,
  type FormDoor,
} from './_sections/PartnerForms';
import { Portal } from './_sections/Portal';
import { Process } from './_sections/Process';
import { TrackPanel } from './_sections/TrackPanel';
import { Tracks } from './_sections/Tracks';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  // The page record `partner` names the package's SEO pair (partner.222/223, W23 — no
  // sys.seo.partner.*); the fallbacks repeat the same ids so the call stays honest if the record
  // ever loses them. OG image: /og/{locale}/partner.png (CDN-cached, W123).
  return buildMetadata({
    locale,
    href: '/partner-with-us',
    bundle,
    pageKey: 'partner',
    fallbackTitle: t(SEO_IDS.title),
    fallbackDescription: t(SEO_IDS.description),
  });
}

/**
 * Partner With Us (WP2b T5). Server-rendered sections over the LOCAL/OPS bundle; one client
 * island (`TrackChooser`, W96) that shows one of three server-rendered track panels, each with
 * its own kernel form — HR agency → `hire` (W3), sourcing partner / training institute →
 * `partner` + `track` (W16). No `<main>` (the `(site)` layout owns it, R31); no `revalidate`
 * (no D17 dated badge, W150). The h1 is the LCP element (gradient hero, §10 #4).
 */
export default async function PartnerWithUs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  // W176: every tel: on this page is the partner line — settings.partnershipsPhone, the main line
  // as the fallback — resolved once; the closing band shows its grouped display form.
  const line = partnerLineOf(settings);
  // W95: the page's own wa.me links (hero, sticky bar) carry only this static copy.
  const whatsappHref = waLink(settings.whatsappNumber, sys('partner.whatsapp.prefill'));
  const door: FormDoor = {
    turnstileSiteKey: settings.turnstileSiteKey,
    whatsappNumber: settings.whatsappNumber,
    contact: { phone: line.phone, phoneDisplay: line.phoneDisplay, email: settings.email },
  };
  // W3/W25: the ISO-2 select — the 13 source countries first, the other rows by locale name.
  const countries = countryOptions(
    getCollection(bundle, 'sourceCountries'),
    getCollection(bundle, 'countries'),
    locale,
  );
  const panels: Record<TrackKey, ReactNode> = {
    hr: (
      <TrackPanel track="hr" tf={tf}>
        <HrAgencyForm locale={locale} tf={tf} door={door} />
      </TrackPanel>
    ),
    sourcing: (
      <TrackPanel track="sourcing" tf={tf}>
        <SourcingPartnerForm locale={locale} tf={tf} door={door} countries={countries} />
      </TrackPanel>
    ),
    institute: (
      <TrackPanel track="institute" tf={tf}>
        <InstituteForm locale={locale} tf={tf} door={door} countries={countries} />
      </TrackPanel>
    ),
  };

  return (
    <>
      <Hero
        locale={locale}
        tf={tf}
        metrics={metricValues(bundle, locale)}
        whatsappHref={whatsappHref}
      />
      <Logos logos={PARTNER_LOGOS} />
      <Chain tf={tf} />
      <Tracks tf={tf} panels={panels} />
      <Process bundle={bundle} locale={locale} tf={tf} />
      <Portal bundle={bundle} locale={locale} tf={tf} androidUrl={settings.storeLinks.android} />
      <Faq
        bundle={bundle}
        locale={locale}
        tf={tf}
        whatsappNumber={settings.whatsappNumber}
        whatsappText={sys('partner.faq.whatsappText')}
        phone={line.phone}
        email={settings.email}
        emailSubject={sys('partner.faq.emailSubject')}
      />
      <Closing
        bundle={bundle}
        locale={locale}
        tf={tf}
        phone={line.phone}
        phoneDisplay={line.phoneDisplay}
        email={settings.email}
      />
      {/* W18/W81: the design's bar — Call / WhatsApp / "Choose your partnership" (contact hrefs
          tracked page_cta by the bar itself). It keys on the closing band, which repeats the
          Apply/Call pair: `#tracks` sits ~1,000 px down, and a bar keyed on it would never show
          (delta 12); html's scroll-padding-bottom keeps focused fields above it. */}
      <StickyCtaBar
        message={tf(STICKY_IDS.message)}
        ctas={[
          { label: tf(STICKY_IDS.call), href: telLink(line.phone), variant: 'secondary' },
          {
            label: tf(STICKY_IDS.whatsapp),
            href: whatsappHref,
            variant: 'success',
            external: true,
          },
          { label: tf(STICKY_IDS.tracks), href: '#tracks' },
        ]}
        hideNearId={CLOSING_ID}
        live
      />
    </>
  );
}
