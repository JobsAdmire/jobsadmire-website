import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import type { StickyCta } from '@/design/chrome/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { submitCalculatorQuote } from './actions';
import { LazyStickyBar } from './_components/LazyBinders';
import { QuoteSheetHost } from './_components/QuoteSheetHost';
import { CalcSection } from './_sections/CalcSection';
import { ClosingBand } from './_sections/ClosingBand';
import {
  Basis,
  Compare,
  Faq,
  Incentives,
  JumpChips,
  PassCheck,
  Penalties,
  Quota,
  Salaries,
  Students,
} from './_sections/content';
import { loadCalcCtx } from './_sections/context';
import { CalculatorCard, Hero } from './_sections/Hero';

/** W150 (D17): the hero's dated rates badge switches off at `rateConfig.reviewDueAt`; the page is
 *  statically generated, so it re-renders daily. */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  // The page record `calc` carries '' ids (the package ships no SEO string for this page,
  // W23/W38), so sys.seo.calc.* is the title/description. buildMetadata adds the canonical, the
  // hreflang pair and the OG image — pageOgImageUrl(locale, 'calc') = /og/{locale}/calc.png,
  // CDN-cached (W123), whose title the OG route also reads from sys.seo.calc.title.
  return buildMetadata({
    locale,
    href: '/hiring-cost-calculator',
    bundle,
    pageKey: 'calc',
    fallbackTitle: sys('seo.calc.title'),
    fallbackDescription: sys('seo.calc.description'),
  });
}

/** The Cost Calculator (design/Hiring Cost Calculator), section for section in the design's
 *  order. No <main> here — SiteChrome owns it (R31). One Breadcrumbs (Hero) and one FaqBlock
 *  (Faq): one BreadcrumbList and one FAQPage node on the page. */
export default async function HiringCostCalculator({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const ctx = await loadCalcCtx(locale);
  const { t, sys, settings: s } = ctx;
  // W18/W81: the bar renders its tel:/wa.me CTAs through ContactCta (page_cta); its WhatsApp
  // prefill is the generic visitor-voice line, never the estimate (W95); faces are variants
  // (W122/W127), never caller classes.
  const stickyCtas: StickyCta[] = [
    { label: t('calc.051'), href: telLink(s.phone), variant: 'secondary' },
    {
      label: t('calc.052'),
      href: waLink(s.whatsappNumber, sys('calc.whatsapp.generic')),
      variant: 'success',
      external: true,
    },
    { label: t('calc.053'), href: '/hire-workers', variant: 'primary' },
  ];
  return (
    <>
      <Hero ctx={ctx}>
        <CalculatorCard ctx={ctx} />
      </Hero>
      <JumpChips ctx={ctx} />
      <CalcSection
        id="basis"
        tone="light"
        pad="basis"
        width="narrow"
        testId="calc-basis"
        toggle={{ title: t('calc.060'), subtitle: t('calc.061') }}
        head={{ title: t('calc.076'), sub: t('calc.077'), size: 'sm' }}
      >
        <Basis ctx={ctx} />
      </CalcSection>
      {/* design .ja-sticky: after 700 px, gone near the closing band (W18). The wrapper sits here,
          below the audit's first viewport, so the bar's chunk loads on the first scroll — or on a
          jump past it (its margin reaches far above the viewport, W13 amended) */}
      <LazyStickyBar
        message={t('calc.050')}
        ctas={stickyCtas}
        showAfterPx={700}
        hideNearId="calc-cta"
        live
      />
      <CalcSection
        id="salaries"
        tone="pale"
        testId="calc-salaries"
        toggle={{ title: t('calc.062'), subtitle: t('calc.063') }}
        head={{ title: t('calc.091'), sub: t('calc.092'), align: 'left' }}
      >
        <Salaries ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="compare"
        tone="light"
        testId="calc-compare"
        toggle={{ title: t('calc.064'), subtitle: t('calc.065') }}
        head={{ title: t('calc.189'), sub: t('calc.190') }}
      >
        <Compare ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="quota"
        tone="pale"
        testId="calc-quota"
        toggle={{ title: t('calc.066'), subtitle: t('calc.067') }}
        head={{ title: t('calc.138'), sub: t('calc.139') }}
      >
        <Quota ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="passcheck"
        tone="light"
        testId="calc-passcheck"
        toggle={{ title: t('calc.068'), subtitle: t('calc.069') }}
        head={{ title: t('calc.068'), sub: t('calc.382') }}
      >
        <PassCheck ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="incentives"
        tone="pale"
        testId="calc-incentives"
        toggle={{ title: t('calc.326'), subtitle: t('calc.327') }}
        head={{ title: t('calc.328'), sub: t('calc.329') }}
      >
        <Incentives ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="penalties"
        tone="light"
        testId="calc-penalties"
        toggle={{ title: t('calc.070'), subtitle: t('calc.071') }}
        head={{ title: t('calc.109'), sub: t('calc.110') }}
      >
        <Penalties ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="students"
        tone="pale"
        testId="calc-students"
        toggle={{ title: t('calc.072'), subtitle: t('calc.073') }}
        head={{ title: t('calc.260'), sub: t('calc.261') }}
      >
        <Students ctx={ctx} />
      </CalcSection>
      <CalcSection
        id="faq"
        tone="light"
        testId="calc-faq-section"
        toggle={{ title: t('calc.074'), subtitle: t('calc.075') }}
      >
        <Faq ctx={ctx} />
      </CalcSection>
      <ClosingBand ctx={ctx} />
      {/* W3: the one written-quote form, a bottom sheet mounted once; nothing (not even the
          forms kernel) loads until a quote button asks for it (W13 amended) */}
      <QuoteSheetHost
        action={submitCalculatorQuote}
        locale={locale}
        turnstileSiteKey={s.turnstileSiteKey}
        whatsappNumber={s.whatsappNumber}
        contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
        countries={ctx.countries}
        roles={ctx.roles}
        rateConfig={ctx.rateConfig}
        roleLabels={ctx.roleLabels}
        industryLabels={ctx.industryLabels}
        cardLabels={ctx.labels.cardView}
        recapLabels={ctx.labels.recap}
        labels={{ ...ctx.labels.sheet, close: sys('nav.close') }}
        loadingLabel={sys('calc.quote.loading')}
      />
    </>
  );
}
