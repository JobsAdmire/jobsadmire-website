import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf, metricValues } from '@/content/adapter';
import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';
import type { FieldOption } from '@/forms/client/Field';
import { START_WHEN_KEYS } from '@/forms/options';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { CLIENT_LOGOS, CLIENT_LOGO_SLOT_COUNT } from './_lib/assets';
import { ClientLogos } from './_sections/ClientLogos';
import { Comparison } from './_sections/Comparison';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Industries } from './_sections/Industries';
import { JumpNav } from './_sections/JumpNav';
import { PortalPreview } from './_sections/PortalPreview';
import { Process } from './_sections/Process';
import { RequestForm } from './_sections/RequestForm';
import { SourceCountries } from './_sections/SourceCountries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  // The page record (both bundles) carries hire.264/hire.265, which win; the fallbacks are the
  // same ids, so a record without them still renders the package's own SEO copy (W23: there is
  // no sys.seo.hire.*). OG image: /og/{locale}/hire.png, CDN-cached (W123).
  return buildMetadata({
    locale,
    href: '/hire-workers',
    bundle,
    pageKey: 'hire',
    fallbackTitle: t('hire.264'),
    fallbackDescription: t('hire.265'),
  });
}

export default async function HireWorkers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  // D17/W1: every package id goes through makeTf, so a re-authored `{metric}` placeholder
  // renders its value; the figures shown outside a string come from metricValues.
  const tf = makeTf(bundle, locale);
  const metrics = metricValues(bundle, locale);
  const s = bundle.settings;
  const whatsapp = sys('hire.whatsapp');
  // W78: one startWhen vocabulary site-wide, labelled by the shared sys copy.
  const startWhenOptions: FieldOption[] = START_WHEN_KEYS.map((key) => ({
    value: key,
    label: sys(`form.options.startWhen.${key}`),
  }));
  // W81: the bar renders its tel:/wa.me CTAs through ContactCta → ContactLink (page_cta); the
  // request CTA is a same-page anchor. Faces are variants (W122/W127), never caller classes.
  // Design ll. 680–692 (SHARED 7.1): the white bar — "Arayın" white with the blue edge and its
  // phone glyph, WhatsApp white with the green edge, the solid blue request; all pills here.
  const stickyCtas: StickyCta[] = [
    { label: tf('hire.033'), href: telLink(s.phone), variant: 'outline-blue', icon: 'phone' },
    {
      label: whatsapp,
      href: waLink(s.whatsappNumber, tf('hire.249')),
      variant: 'outline-green',
      external: true,
    },
    { label: tf('hire.040'), href: '#request-form', variant: 'primary' },
  ];
  const logoSlots = Array.from(
    { length: CLIENT_LOGO_SLOT_COUNT },
    (_, i) => `${tf('hire.245')} ${i + 1}`,
  );
  return (
    <>
      <Hero bundle={bundle} locale={locale} tf={tf} metrics={metrics} whatsappLabel={whatsapp} />
      <JumpNav tf={tf} label={sys('hire.jump.label')} />
      {/* design .ja-sticky: after 700 px of scroll, hidden while #request-form is near (W18) */}
      <StickyCtaBar
        message={tf('hire.072')}
        ctas={stickyCtas}
        showAfterPx={700}
        hideNearId="request-form"
        live
        tone="light"
        shape="pill"
      />
      <ClientLogos
        tf={tf}
        employers={metrics.employers ?? ''}
        logos={CLIENT_LOGOS}
        slotLabels={logoSlots}
      />
      <Industries bundle={bundle} tf={tf} />
      <SourceCountries
        bundle={bundle}
        tf={tf}
        countries={metrics.countries ?? ''}
        sys={{
          titleTail: sys.raw('hire.sc.titleTail') as string,
          mapTitle: sys('hire.sc.mapTitle'),
          pause: sys('marquee.pause'),
          play: sys('marquee.play'),
        }}
      />
      <Comparison tf={tf} />
      <Process bundle={bundle} locale={locale} tf={tf} />
      <PortalPreview bundle={bundle} locale={locale} tf={tf} />
      <Faq bundle={bundle} locale={locale} tf={tf} />
      <RequestForm
        bundle={bundle}
        locale={locale}
        tf={tf}
        dialLabel={sys('hire.form.dial')}
        startWhenOptions={startWhenOptions}
      />
    </>
  );
}
