import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
// Blocks, primitives and chrome pieces by module path — never a barrel (W134/W147/W156).
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { ContactCta } from '@/design/blocks/ContactCta';
import { EmptyState } from '@/design/blocks/EmptyState';
import { FaqBlock } from '@/design/blocks/FaqBlock';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { ProcessSteps } from '@/design/blocks/ProcessSteps';
import { WhatsAppIcon } from '@/design/chrome/icons';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { FormShell } from '@/forms/client/FormShell';
import { START_WHEN_KEYS } from '@/forms/options';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { RequestFormFields } from './_components/RequestFormFields';
import { HERO_SIZE, HERO_SRC } from './_lib/assets';
import { afterSteps, verifiedSteps, workersFaqItems } from './_lib/content';
import { cardsVisible, poolSigned } from './_lib/pool';
import { submitWorkers } from './actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  // The package has no SEO string for this page, so `pages.workers` carries '' ids and the
  // sys.seo.workers.* fallbacks stand (W23/W38).
  return buildMetadata({
    locale,
    href: '/available-workers',
    bundle,
    pageKey: 'workers',
    fallbackTitle: sys('seo.workers.title'),
    fallbackDescription: sys('seo.workers.description'),
  });
}

/**
 * Available Workers (`design-package/design/Available Workers.dc.html`). Phase A ships the
 * request form, the sticky bar, the vetting steps, the after-you-pick timeline, the FAQ and the
 * closing band; `#pool` is the designed empty state. Everything the design derives from the
 * candidate pool — the "live" badge, the card-presupposing copy (048, 052/053, 107, 210/211),
 * the cards/filters/basket — renders by data and is absent here: `pool` is a fixture-only
 * collection LOCAL can never serve in production (D23), per-profile cards are off (D2), and the
 * stats strip waits for a signed source (W6). No `<main>` — the `(site)` layout owns it (R31).
 */
export default async function AvailableWorkersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const tf = makeTf(bundle, locale); // W1/D17: re-authored ids carry {metric} tokens
  const metrics = metricValues(bundle, locale);
  const s = bundle.settings;
  const live = poolSigned(bundle); // pool rows are served (never under LOCAL in production)
  const cardsOn = cardsVisible(bundle); // rows AND the D2 switch — false in this task
  const heroIsLcp = HERO_SRC !== null;
  // The page's one WhatsApp prefill (availworkers.224) on every hire-intent door; the design's
  // seven hard-coded English texts are not ported, and nothing typed ever rides here (W95).
  const waHire = waLink(s.whatsappNumber, tf('availworkers.224'));
  const startWhenOptions = START_WHEN_KEYS.map((key) => ({
    value: key,
    label: sys(`form.options.startWhen.${key}`),
  }));

  return (
    <>
      {/* 2–3 — the hero and the request card (design 474–578) */}
      <Section tone="dark" className="relative overflow-hidden">
        {/* D26/W129: the named hero slot. ImageSlot owns its 16:9 box, so the cover crop is this
            wrapper's job, clipped by the section. W187: the box never follows the text's height
            (a wrapper sized `h-full` or centred on a text-driven hero moves and resizes when the
            h1 rewraps) — it is anchored top-left at a fixed height per breakpoint, each above the
            tallest hero in its range (the stacked request card below 901 px, two columns from
            901) with ≥ 10 % to spare — measured at 320–1920 px in both locales, both roles, the
            error state and the fallback panel: ≤ 2,657 px below 701, ≤ 1,638 px at 701–900,
            ≤ 1,473 px from 901. While HERO_SRC is null it is a decorative placeholder and the h1
            is the LCP element; a photo first gets W189 A5's cover-mode slot. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 aspect-[16/9] h-[3000px] min-w-full md:h-[1900px] lg:h-[1700px]">
            <ImageSlot
              slot="aw-hero"
              lcp={heroIsLcp}
              src={HERO_SRC}
              alt=""
              width={HERO_SIZE.width}
              height={HERO_SIZE.height}
              sizes="100vw"
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70"
        />
        <div
          data-testid="workers-hero"
          className="container-site relative grid items-center gap-11 lg:grid-cols-[1fr_0.85fr]"
        >
          <div className="min-w-0">
            <Breadcrumbs
              locale={locale}
              tone="dark"
              className="mb-4"
              items={[
                { name: tf('availworkers.021'), href: '/' },
                { name: tf('availworkers.022'), href: '/available-workers' },
              ]}
            />
            {live ? (
              <p
                data-testid="pool-live"
                className="mb-4 inline-flex items-center gap-2 rounded-pill border border-success/35 bg-success/10 px-4 py-1.5 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-success-surface"
              >
                <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
                {tf('availworkers.023')}
              </p>
            ) : null}
            <h1
              data-testid="page-h1"
              data-lcp-slot={heroIsLcp ? undefined : 'h1'}
              className="text-h1 m-0 mb-4 leading-[1.02] tracking-[-0.03em]"
            >
              {tf('availworkers.024')} <span className="text-sky">{tf('availworkers.025')}</span>{' '}
              {tf('availworkers.026')}
            </h1>
            <p className="text-body-lg m-0 mb-6 max-w-[520px] text-white/80">
              {tf('availworkers.027')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href="#pool">
                {tf('availworkers.028')}
              </Button>
              <ContactCta placement="page_cta" variant="success" size="lg" external href={waHire}>
                <WhatsAppIcon size={16} />
                {tf('availworkers.029')}
              </ContactCta>
            </div>
            <p className="text-body-sm m-0 mt-5 max-w-[480px] text-white/70">
              {tf('availworkers.030')}
            </p>
          </div>

          <div
            id="pool-form"
            className="scroll-mt-20 overflow-hidden rounded-hero border border-white/10 bg-white text-ink shadow-hero-form"
          >
            {/* W79: checkbox consent, the site-wide /privacy link (no consentLinkHref). */}
            <FormShell
              action={submitWorkers}
              formKey="workers"
              locale={locale}
              turnstileSiteKey={s.turnstileSiteKey}
              whatsappNumber={s.whatsappNumber}
              whatsappIntro={tf('availworkers.224')}
              contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
              submitLabel={tf('availworkers.146')}
              consent="checkbox"
              testId="workers-form"
              className="p-6"
            >
              <RequestFormFields
                legend={sys('form.labels.iAm')}
                roles={{
                  direct_employer: {
                    tab: tf('availworkers.141'),
                    // 107 ("Request these candidates") presupposes visible cards (W6).
                    title: cardsOn
                      ? tf('availworkers.107')
                      : sys('workers.form.titles.direct_employer'),
                    subtitle: tf('availworkers.142'),
                    companyLabel: tf('availworkers.143'),
                    tradeLabel: tf('availworkers.144'),
                    messagePlaceholder: tf('availworkers.145'),
                  },
                  hr_agency: {
                    tab: tf('availworkers.147'),
                    title: tf('availworkers.148'),
                    subtitle: tf('availworkers.149'),
                    companyLabel: tf('availworkers.150'),
                    tradeLabel: tf('availworkers.151'),
                    messagePlaceholder: tf('availworkers.152'),
                  },
                }}
                labels={{
                  name: tf('availworkers.044'),
                  email: tf('availworkers.045'),
                  phone: tf('availworkers.046'),
                  city: tf('availworkers.047'),
                }}
                startWhenOptions={startWhenOptions}
              />
            </FormShell>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-3 px-6 py-3 text-body-sm text-text-tertiary">
              <ContactLink
                href={waHire}
                placement="page_cta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-extrabold text-success-text"
              >
                <WhatsAppIcon size={14} />
                {tf('availworkers.041')}
              </ContactLink>
              <span>
                {tf('availworkers.042')}{' '}
                <Link
                  href="/partner-with-us"
                  prefetch={false}
                  className="font-extrabold text-blue-safe underline"
                >
                  {tf('availworkers.043')}
                </Link>
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* 4 — the sticky desktop bar (design 583–597): the design's three buttons, the contact
          ones tracked by the bar itself (W81). Both messages carry the reply-time metric, so the
          bar is absent while it is unsigned (D17); 048 presupposes a visible profile. */}
      {metrics.homepageReplyHours ? (
        <StickyCtaBar
          live={live}
          message={
            cardsOn
              ? tf('availworkers.048')
              : sys('workers.sticky.message', { hours: metrics.homepageReplyHours })
          }
          ctas={[
            { label: tf('availworkers.049'), href: telLink(s.phone), variant: 'secondary' },
            { label: tf('availworkers.050'), href: waHire, variant: 'success', external: true },
            { label: tf('availworkers.051'), href: '#pool-form' },
          ]}
          hideNearId="pool-cta"
        />
      ) : null}

      {/* 5–8 — the pool (design 598–769): the header CTA and "Browse candidates" land on #pool
          (W17). Phase A renders the designed empty state; the v1.1 cards task renders the grid
          in its place. No stats strip until a signed source exists (W1/W6). */}
      <Section tone="light" id="pool" className="scroll-mt-20">
        <div data-testid="workers-pool" className="container-site">
          <div className="mb-6 max-w-[560px]">
            <h2 className="text-h2 m-0 mb-3">
              {cardsOn ? tf('availworkers.052') : sys('workers.pool.heading')}
            </h2>
            <p className="text-body m-0 text-text-secondary">
              {cardsOn ? tf('availworkers.053') : sys('workers.pool.intro')}
            </p>
          </div>
          {cardsOn ? null : (
            <EmptyState
              testId="pool-empty"
              tone="pale"
              title={sys('workers.empty.title')}
              body={sys('workers.empty.body')}
              cta={{ label: sys('workers.empty.cta'), href: '#pool-form' }}
            />
          )}
        </div>
      </Section>

      {/* 9 — what "verified" means (design 777–827) */}
      <Section tone="pale">
        <div data-testid="workers-verified" className="container-site">
          <h2 className="text-h2 m-0 mb-3 text-center">{tf('availworkers.072')}</h2>
          <p className="text-body mx-auto mt-0 mb-10 max-w-[580px] text-center text-text-secondary">
            {tf('availworkers.073')}
          </p>
          <div className="mx-auto max-w-[760px]">
            <ProcessSteps
              id="verified-steps"
              bundle={bundle}
              locale={locale}
              variant="cards"
              steps={verifiedSteps(tf)}
            />
          </div>
          <p className="text-body-sm mx-auto mt-7 mb-0 max-w-[640px] rounded-sm border border-border-2 bg-white px-5 py-3 text-center text-text-secondary">
            {tf('availworkers.083')} <strong className="text-ink">{tf('availworkers.084')}</strong>
          </p>
        </div>
      </Section>

      {/* 10 — after you pick (design 829–875) */}
      <Section tone="light">
        <div
          data-testid="workers-after"
          className="container-site grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14"
        >
          <div className="min-w-0">
            <Eyebrow>{tf('availworkers.085')}</Eyebrow>
            <h2 className="text-h2 mt-3 mb-3">{tf('availworkers.086')}</h2>
            <p className="text-body m-0 mb-6 text-text-secondary">{tf('availworkers.087')}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" href="/work-permit" prefetch={false}>
                {tf('availworkers.088')}
              </Button>
              <Button variant="primary" href="/hire-workers" prefetch={false}>
                {tf('availworkers.089')}
              </Button>
            </div>
          </div>
          <div className="min-w-0 rounded-lg border border-tint-border bg-white p-6 shadow-[0_20px_50px_rgba(22,60,90,0.10)] lg:p-8">
            <ProcessSteps
              bundle={bundle}
              locale={locale}
              variant="plain"
              steps={afterSteps(tf, {
                days1to3: sys('workers.timeline.days1to3'),
                arrival: metrics.firstDayWeeks
                  ? sys('workers.timeline.arrival', { weeks: metrics.firstDayWeeks })
                  : undefined,
              })}
            />
          </div>
        </div>
      </Section>

      {/* 11 — FAQ (design 877–912): side column + ask card (WhatsApp + e-mail, W83) + the
          accordion; the one FAQPage node is FaqBlock's */}
      <Section tone="pale">
        <div data-testid="workers-faq" className="container-site">
          <FaqBlock
            bundle={bundle}
            locale={locale}
            id="faq"
            eyebrowId="availworkers.100"
            headingId="availworkers.101"
            bodyId="availworkers.102"
            items={workersFaqItems(bundle, locale, cardsOn)}
            openFirst
            askCard={{
              titleId: 'availworkers.103',
              bodyId: 'availworkers.104',
              whatsappNumber: s.whatsappNumber,
              whatsappText: tf('availworkers.224'),
              whatsappLabelId: 'availworkers.050',
              email: s.email,
              emailLabelId: 'availworkers.045',
              subject: sys('workers.ask.emailSubject'),
            }}
          />
        </div>
      </Section>

      {/* 12 — the closing band (design 915–928) and the licence line with its tracked mailto */}
      <Section tone="band">
        <div data-testid="workers-closing" className="container-site">
          <ClosingCtaBand
            id="pool-cta"
            bundle={bundle}
            locale={locale}
            tone="gradient"
            titleId="availworkers.105"
            bodyId="availworkers.106"
            primary={{
              label: tf('availworkers.108'),
              href: waHire,
              external: true,
              variant: 'success',
            }}
            secondary={{
              label: tf('availworkers.109'),
              href: { pathname: '/hire-workers', hash: '#request-form' },
            }}
          />
          <p className="text-body-sm m-0 mt-6 text-center text-text-tertiary">
            {tf('availworkers.110')}{' '}
            <ContactLink
              href={mailLink(s.email)}
              placement="page_cta"
              className="font-bold text-blue-safe underline"
            >
              {s.email}
            </ContactLink>
          </p>
        </div>
      </Section>
    </>
  );
}
