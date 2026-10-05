import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
// Blocks, primitives and chrome pieces by module path — never a barrel (W134/W147/W156).
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { FaqBlock } from '@/design/blocks/FaqBlock';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { ProcessSteps } from '@/design/blocks/ProcessSteps';
import { SampleTag } from '@/design/blocks/SampleTag';
import { WhatsAppIcon } from '@/design/chrome/icons';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { FormShell } from '@/forms/client/FormShell';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { BasketBar } from './_components/BasketBar';
import { ClosingBand } from './_components/ClosingBand';
import { AFTER_ICONS, ShieldTickGlyph, VETTING_ICONS } from './_components/glyphs';
import { PoolExplorer } from './_components/PoolExplorer';
import { PoolProvider } from './_components/PoolContext';
import { PoolPill } from './_components/PoolPill';
import { PoolTools } from './_components/PoolTools';
import { PopularChips } from './_components/PopularChips';
import { RequestCard } from './_components/RequestCard';
import { RequestFormFields } from './_components/RequestFormFields';
import { HERO_SIZE, HERO_SRC } from './_lib/assets';
import { afterSteps, verifiedSteps, workersFaqItems } from './_lib/content';
import {
  fillSlots,
  poolStats,
  popularIndustries,
  type PoolCopy,
  type PoolWorker,
} from './_lib/pool-view';
import { SAMPLE_POOL, SAMPLE_TOTAL } from './_lib/sample-pool';
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

/** One stats-strip cell (design `.ja-pool-stats`, ll. 618–623): a coloured figure and its label.
 *  D20: the figures wear the contrast-safe tints of the design's blue, green and amber. */
function PoolStat({
  figure,
  label,
  tone,
  className,
}: {
  figure: string | number;
  label: string;
  tone: string;
  className?: string;
}) {
  return (
    <p
      className={['m-0 flex items-baseline gap-2.25 max-md:gap-1.75', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className={`text-[24px] font-extrabold tracking-[-0.5px] max-md:text-[21px] xl:text-[18px] xl:tracking-[-0.4px] ${tone}`}
      >
        {figure}
      </span>
      <span className="text-[13px] leading-[1.35] font-bold text-text-tertiary max-md:text-[12px] xl:text-[11px]">
        {label}
      </span>
    </p>
  );
}

/**
 * Available Workers (`design-package/design/Available Workers.dc.html`). The candidate pool and
 * everything the design derives from it — the hero's "live" pill and popular chips, the stats
 * strip, the filter panel, the 9 cards (6 on phones) whose "Add to request" fills the form's
 * basket, load-more, the phone pool pill and basket bar, FAQ 210/211 — render the design's own
 * sample (`_lib/sample-pool.ts`, a page-local constant) under the "örnek / sample" tag (owner
 * 2026-10-05). The real `pool` collection never reaches this page in production (D23) and real
 * profile cards stay off (D2, `_lib/pool.ts`). `PoolProvider` holds the one client state the
 * islands share; the sections around them stay server-rendered. No `<main>` — the `(site)` layout
 * owns it (R31).
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
  const raw = (key: string) => String(sys.raw(key));
  const heroIsLcp = HERO_SRC !== null;
  // The page's one WhatsApp prefill (availworkers.224) on every hire-intent door; the design's
  // seven hard-coded English texts are not ported, and nothing typed ever rides here (W95).
  const waHire = waLink(s.whatsappNumber, tf('availworkers.224'));

  // The design's sample pool, every label resolved here (W9: the islands read no bundle).
  const rows: PoolWorker[] = SAMPLE_POOL.map((r) => ({
    ref: r.ref,
    trade: tf(r.tradeId),
    tradeKey: r.tradeId,
    country: tf(r.countryId),
    countryKey: r.countryId,
    industry: tf(r.industryId),
    industryKey: r.industryId,
    exp: r.exp,
    langs: tf(r.langsId),
    lang: r.lang,
    avail: r.avail,
    tags: r.tags.map((t) => ('id' in t ? tf(t.id) : t.brand)),
    added: r.added,
  }));
  const stats = poolStats(rows);
  const popular = popularIndustries(rows).map((p) => ({
    key: p.key,
    label: `${p.label} · ${p.count}`,
  }));
  // The design's anonymised avatar is an image spot (photos are shared on request only): a
  // decorative `ImageSlot` per profile, rendered here because `ImageSlot` reads `sys.blocks`, a
  // server-only namespace (W148), and blurred under a lock by the card.
  const avatars = Object.fromEntries(
    rows.map((w) => [
      w.ref,
      <ImageSlot
        key={w.ref}
        slot={`aw-avatar-${w.ref.toLowerCase()}`}
        alt=""
        width={52}
        height={52}
      />,
    ]),
  );
  const poolCopy: PoolCopy = {
    shown: raw('workers.pool.shown'),
    sort: tf('availworkers.054'),
    sortOptions: {
      avail: tf('availworkers.227'),
      exp: tf('availworkers.228'),
      new: tf('availworkers.229'),
      az: tf('availworkers.230'),
    },
    filterTitle: tf('availworkers.059'),
    show: tf('availworkers.235'),
    hide: tf('availworkers.234'),
    active: raw('workers.pool.active'),
    clearAll: tf('availworkers.060'),
    labels: {
      trade: tf('availworkers.061'),
      country: tf('availworkers.062'),
      industry: tf('availworkers.063'),
      exp: tf('availworkers.064'),
      lang: tf('availworkers.017'),
      avail: tf('availworkers.065'),
    },
    all: {
      trade: tf('availworkers.236'),
      country: tf('availworkers.237'),
      industry: tf('availworkers.238'),
      exp: tf('availworkers.239'),
      lang: tf('availworkers.243'),
      avail: tf('availworkers.246'),
    },
    expBands: {
      '0-3': tf('availworkers.240'),
      '4-7': tf('availworkers.241'),
      '8+': tf('availworkers.242'),
    },
    langs: { tr: tf('availworkers.244'), en: tf('availworkers.245') },
    availLabels: [tf('availworkers.207'), tf('availworkers.208'), tf('availworkers.209')],
    newLabel: tf('availworkers.247'),
    cvOnRequest: sys('workers.pool.cvOnRequest'),
    yearsExp: tf('availworkers.248'),
    add: tf('availworkers.250'),
    added: tf('availworkers.249'),
    loadMore: raw('workers.pool.loadMore'),
    empty: {
      title: tf('availworkers.066'),
      body: tf('availworkers.067'),
      cta: tf('availworkers.068'),
      clear: tf('availworkers.069'),
    },
    filterShort: sys('workers.pool.filter'),
  };

  return (
    <PoolProvider rows={rows} locale={locale}>
      {/* 2–3 — the hero and the request card (design 474–578) */}
      <Section tone="dark" className="relative overflow-hidden max-md:pt-8.5 max-md:pb-10">
        {/* D26/W129: the named hero slot. ImageSlot owns its 16:9 box, so the cover crop is this
            wrapper's job, clipped by the section. W187: the box never follows the text's height
            (a wrapper sized `h-full` or centred on a text-driven hero moves and resizes when the
            h1 rewraps) — it is anchored top-left at a fixed height per breakpoint, each above the
            tallest hero in its range (the stacked request card below 901 px, two columns from
            901) with ≥ 10 % to spare. With the photo (HERO_SRC, licensed stock since W233) the
            image is the LCP element; while HERO_SRC is null it is a decorative placeholder and
            the h1 is. W189 A5's cover-mode slot, art-directed sources and true `sizes` are
            deferred to the later speed work by the owner (W233). */}
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
          className="container-site relative grid items-center gap-11 max-md:gap-5.5 lg:grid-cols-[1fr_0.85fr]"
        >
          <div className="min-w-0">
            <Breadcrumbs
              locale={locale}
              tone="dark"
              className="mb-4 max-md:mb-2.5"
              items={[
                { name: tf('availworkers.021'), href: '/' },
                { name: tf('availworkers.022'), href: '/available-workers' },
              ]}
            />
            {/* the design's live pill (l. 487) over the sample pool — the sample tag says so */}
            <div className="mb-4 flex flex-wrap items-center gap-2 max-md:mb-3">
              <p
                data-testid="pool-live"
                className="m-0 inline-flex items-center gap-2.25 rounded-pill border border-[rgba(74,222,128,0.35)] bg-[rgba(74,222,128,0.12)] px-4 py-1.5 text-[12px] font-extrabold tracking-[1.2px] text-[#86efac] uppercase max-md:px-3.25 max-md:py-1.25 max-md:text-[11px] max-md:tracking-[1px] xl:text-[11px] xl:tracking-[0.9px]"
              >
                <span aria-hidden="true" className="ja-live size-2 rounded-pill bg-success" />
                {tf('availworkers.023')}
              </p>
              <SampleTag tone="dark" />
            </div>
            <h1
              data-testid="page-h1"
              data-lcp-slot={heroIsLcp ? undefined : 'h1'}
              className="text-h1 m-0 mb-4 leading-[1.02] tracking-[-0.03em] max-md:mb-3 max-md:text-[31px] max-md:leading-[1.08] max-md:tracking-[-0.9px]"
            >
              {tf('availworkers.024')} <br className="hidden xl:inline" />
              <span className="text-sky">{tf('availworkers.025')}</span> {tf('availworkers.026')}
            </h1>
            <p className="text-body-lg m-0 mb-6 max-w-[520px] font-semibold text-white/80 max-md:mb-4 max-md:text-[15px] max-md:leading-[1.5]">
              {tf('availworkers.027')}
            </p>
            {/* M1: the two buttons and the KVKK note give way to the card's own CTA on phones */}
            <div className="flex flex-wrap gap-3 max-md:hidden">
              <Button variant="primary" size="lg" href="#pool">
                {tf('availworkers.028')}
              </Button>
              <ContactCta placement="page_cta" variant="success" size="lg" external href={waHire}>
                <WhatsAppIcon size={16} />
                {tf('availworkers.029')}
              </ContactCta>
            </div>
            <p className="text-body-sm m-0 mt-4.5 max-w-[480px] font-semibold text-white/70 max-md:hidden">
              {tf('availworkers.030')}
            </p>
            <PopularChips label={tf('availworkers.031')} chips={popular} />
          </div>

          <RequestCard
            head={{
              direct_employer: {
                title: tf('availworkers.107'),
                subtitle: tf('availworkers.142'),
              },
              hr_agency: { title: tf('availworkers.148'), subtitle: tf('availworkers.149') },
            }}
            cta={{
              ready: fillSlots(raw('workers.formCta.ready'), { count: stats.ready }),
              reply: tf('availworkers.032'),
              noFee: tf('availworkers.033'),
              start: tf('availworkers.034'),
              browse: tf('availworkers.035'),
            }}
          >
            {/* W79: checkbox consent, the site-wide /privacy link (no consentLinkHref). The
                design's r11 full-width submit (S3.6). */}
            <FormShell
              action={submitWorkers}
              formKey="workers"
              locale={locale}
              turnstileSiteKey={s.turnstileSiteKey}
              whatsappNumber={s.whatsappNumber}
              whatsappIntro={tf('availworkers.224')}
              contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
              submitLabel={tf('availworkers.146')}
              submitShape="rect"
              submitRadius={11}
              consent="checkbox"
              testId="workers-form"
              className="px-6 pb-3 max-md:px-4"
            >
              <RequestFormFields
                roles={{
                  direct_employer: {
                    tab: tf('availworkers.141'),
                    companyLabel: tf('availworkers.143'),
                    tradeLabel: tf('availworkers.144'),
                  },
                  hr_agency: {
                    tab: tf('availworkers.147'),
                    companyLabel: tf('availworkers.150'),
                    tradeLabel: tf('availworkers.151'),
                  },
                }}
                labels={{
                  name: tf('availworkers.044'),
                  email: tf('availworkers.045'),
                  phone: tf('availworkers.046'),
                  city: tf('availworkers.047'),
                }}
                basket={{
                  one: tf('availworkers.232'),
                  many: tf('availworkers.233'),
                  clear: tf('availworkers.036'),
                }}
              />
            </FormShell>
            <div className="mx-6 mb-4.5 flex flex-wrap items-center justify-between gap-2.5 border-t border-border-3 pt-3 text-[12.5px] text-text-tertiary max-md:mx-4 xl:text-[11px]">
              <ContactLink
                href={waHire}
                placement="page_cta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.75 text-[13px] font-extrabold text-success-text no-underline xl:text-[11px]"
              >
                <WhatsAppIcon size={14} />
                {tf('availworkers.041')}
              </ContactLink>
              <span>
                {tf('availworkers.042')}{' '}
                <Link
                  href="/partner-with-us"
                  prefetch={false}
                  className="font-extrabold text-blue-safe no-underline hover:underline"
                >
                  {tf('availworkers.043')}
                </Link>
              </span>
            </div>
          </RequestCard>
        </div>
      </Section>

      {/* 4 — the sticky desktop bar (design 583–597), SHARED 7.1's light face: the live dot, the
          message (048, over the reply-time metric — absent while it is unsigned, D17) and the
          three r10 CTAs, the contact ones tracked by the bar itself (W81). */}
      {metrics.homepageReplyHours ? (
        <StickyCtaBar
          tone="light"
          live
          message={tf('availworkers.048')}
          ctas={[
            {
              label: tf('availworkers.049'),
              href: telLink(s.phone),
              variant: 'outline-blue',
              icon: 'phone',
            },
            {
              label: tf('availworkers.050'),
              href: waHire,
              variant: 'outline-green',
              external: true,
            },
            { label: tf('availworkers.051'), href: '#pool-form' },
          ]}
          hideNearId="pool-cta"
        />
      ) : null}

      {/* 5–8 — the pool (design 598–772), the design's sample under the sample tag: the head
          tools, the stats strip, the collapsed filters, the cards with load-more, the
          "can't see the profession" band. The header CTA and "Browse candidates" land here. */}
      <Section tone="light" id="pool" className="scroll-mt-20 max-md:py-10.5">
        <div data-testid="workers-pool" className="container-site">
          <div className="mb-6.5 flex flex-wrap items-end justify-between gap-6 max-md:mb-4 max-md:block">
            <div className="min-w-0">
              <div className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 max-md:mb-2">
                <h2 className="text-h2 m-0 leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px] max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
                  {tf('availworkers.052')}
                </h2>
                <SampleTag />
              </div>
              <p className="text-body m-0 max-w-[560px] text-text-tertiary max-md:text-[14.5px] max-md:leading-[1.5]">
                {tf('availworkers.053')}
              </p>
            </div>
            <PoolTools
              copy={{
                shown: poolCopy.shown,
                sort: poolCopy.sort,
                sortOptions: poolCopy.sortOptions,
              }}
            />
          </div>

          <div
            data-testid="pool-stats"
            className="ja-card-in mb-5.5 grid grid-cols-2 items-center gap-x-3 gap-y-3.25 rounded-md border border-edge-soft bg-pale-1 px-4 py-3.75 max-md:mb-3.5 max-md:rounded-base md:px-6 md:py-4.5 lg:grid-cols-[repeat(4,1fr)_auto] lg:gap-5"
          >
            <PoolStat figure={SAMPLE_TOTAL} label={tf('availworkers.055')} tone="text-blue-safe" />
            <PoolStat
              figure={stats.ready}
              label={tf('availworkers.056')}
              tone="text-success-text"
            />
            <PoolStat
              figure={stats.countries}
              label={tf('availworkers.057')}
              tone="text-indigo"
              className="max-md:hidden"
            />
            <PoolStat
              figure={stats.trades}
              label={tf('availworkers.058')}
              tone="text-warning-text"
              className="max-md:hidden"
            />
            <p className="col-span-2 m-0 flex items-center gap-2 border-t border-field-border pt-2.75 text-[12.5px] font-bold whitespace-nowrap text-success-text lg:col-span-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5 xl:text-[11px]">
              <span
                aria-hidden="true"
                className="ja-live size-2 shrink-0 rounded-pill bg-success"
              />
              {tf('availworkers.225')}
            </p>
          </div>

          <PoolExplorer rows={rows} avatars={avatars} copy={poolCopy} waHire={waHire} />

          <div className="mt-6.5 rounded-lg bg-gradient-to-br from-blue-safe to-blue-deep px-8 py-7 text-white shadow-[0_20px_48px_rgba(24,153,213,0.25)] max-md:px-5 max-md:py-6">
            <h3 className="m-0 mb-2 text-[20px] font-extrabold tracking-[-0.3px] max-md:text-[18px] xl:text-[15px] xl:tracking-[-0.2px]">
              {tf('availworkers.070')}
            </h3>
            <p className="m-0 mb-4 text-[15px] leading-[1.6] text-white/90 xl:text-[11.25px]">
              {tf('availworkers.071')}
            </p>
            <Button
              variant="white"
              size="lg"
              shape="rect"
              radius={11}
              href="/hire-workers"
              prefetch={false}
            >
              {tf('availworkers.051')}
            </Button>
          </div>
        </div>
      </Section>

      {/* 9 — what "verified" means (design 776–826): SHARED 8.3's `row` — four cards over the
          blue → green connector, a glyph per card, the last card green, the caps "Goes live" */}
      <Section tone="pale" className="max-md:py-10.5">
        <div data-testid="workers-verified" className="container-site">
          <h2 className="text-h2 m-0 mb-3.5 text-center leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px] max-md:mb-2 max-md:text-left max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
            {tf('availworkers.072')}
          </h2>
          <p className="text-body mx-auto mt-0 mb-11 max-w-[580px] text-center text-text-tertiary max-md:mb-4.5 max-md:text-left max-md:text-[14.5px] max-md:leading-[1.5]">
            {tf('availworkers.073')}
          </p>
          <ProcessSteps
            id="verified-steps"
            bundle={bundle}
            locale={locale}
            variant="row"
            motion="steps"
            steps={verifiedSteps(tf).map((st, i) => ({ ...st, icon: VETTING_ICONS[i] }))}
          />
          <p className="mx-auto mt-7 mb-0 flex max-w-[640px] items-center justify-center gap-2.5 rounded-sm border border-edge-soft bg-white px-5.5 py-3.5 text-center text-[14px] leading-[1.5] text-text-secondary max-md:items-start max-md:text-left max-md:text-[13px] xl:text-[11px]">
            <ShieldTickGlyph />
            <span>
              {tf('availworkers.083')}{' '}
              <strong className="font-extrabold text-ink">{tf('availworkers.084')}</strong>
            </span>
          </p>
        </div>
      </Section>

      {/* 10 — after you pick (design 828–874): the white glyph markers and the inline caps
          badges (SHARED 8.4); the two CTAs are r11 rectangles, hidden on phones (M6) */}
      <Section tone="light" className="max-md:py-10.5">
        <div data-testid="workers-after" className="container-site">
          <div className="mx-auto grid max-w-[1080px] items-center gap-14 max-md:gap-5 lg:grid-cols-[0.95fr_1.05fr] xl:max-w-[84%]">
            <div className="min-w-0">
              <Eyebrow>{tf('availworkers.085')}</Eyebrow>
              <h2 className="text-h2 mt-3 mb-3.5 leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px] xl:text-balance max-md:mb-2.25 max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
                {tf('availworkers.086')}
              </h2>
              <p className="text-body m-0 mb-6 leading-[1.65] font-semibold text-text-secondary max-md:mb-0 max-md:text-[14.5px] max-md:leading-[1.55]">
                {tf('availworkers.087')}
              </p>
              <div className="flex flex-wrap gap-3 max-md:hidden">
                <Button
                  variant="outline-blue"
                  shape="rect"
                  radius={11}
                  href="/work-permit"
                  prefetch={false}
                >
                  {tf('availworkers.088')}
                </Button>
                <Button
                  variant="primary"
                  shape="rect"
                  radius={11}
                  href="/hire-workers"
                  prefetch={false}
                >
                  {tf('availworkers.089')}
                </Button>
              </div>
            </div>
            <div className="min-w-0 rounded-lg border border-edge bg-white px-8 py-7.5 shadow-[0_20px_50px_rgba(22,60,90,0.10)] max-md:rounded-base max-md:p-4 max-md:shadow-[0_6px_20px_rgba(22,60,90,0.07)]">
              <ProcessSteps
                bundle={bundle}
                locale={locale}
                variant="plain"
                marker="icon"
                whenStyle="caps"
                steps={afterSteps(tf, {
                  days1to3: sys('workers.timeline.days1to3'),
                  arrival: metrics.firstDayWeeks
                    ? sys('workers.timeline.arrival', { weeks: metrics.firstDayWeeks })
                    : undefined,
                }).map((st, i) => ({ ...st, icon: AFTER_ICONS[i] }))}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* 11 — FAQ (design 876–912): SHARED 6's white cards with the + circle, all eight pairs,
          the first open; the ask card's two contact rows (WhatsApp, e-mail — W83), after the
          list on phones (M7). The one FAQPage node is FaqBlock's. */}
      <Section tone="pale" className="max-md:py-10.5">
        <div data-testid="workers-faq" className="container-site">
          <FaqBlock
            bundle={bundle}
            locale={locale}
            id="faq"
            eyebrowId="availworkers.100"
            headingId="availworkers.101"
            bodyId="availworkers.102"
            items={workersFaqItems(bundle, locale)}
            openFirst
            variant="cards"
            mobileAsk="after"
            askCard={{
              titleId: 'availworkers.103',
              bodyId: 'availworkers.104',
              whatsappNumber: s.whatsappNumber,
              whatsappText: tf('availworkers.224'),
              whatsappLabelId: 'home.221',
              email: s.email,
              emailLabelId: 'availworkers.045',
              subject: sys('workers.ask.emailSubject'),
              layout: 'rows',
              // the bold value of the WhatsApp row: the shared line when it is the same number
              whatsappDisplay:
                s.phone.replace(/\D/g, '') === s.whatsappNumber
                  ? s.phoneDisplay
                  : `+${s.whatsappNumber}`,
            }}
          />
        </div>
      </Section>

      {/* 12 — the closing band (design 914–926), full-bleed, with the licence line */}
      <ClosingBand
        title={tf('availworkers.105')}
        body={tf('availworkers.106')}
        whatsapp={tf('availworkers.108')}
        hiring={tf('availworkers.109')}
        phoneCta={tf('availworkers.107')}
        licence={tf('availworkers.110')}
        email={s.email}
        waHire={waHire}
      />

      {/* phones: the pool pill while the cards are on screen, the basket face of the bottom bar */}
      <PoolPill shown={poolCopy.shown} filter={poolCopy.filterShort} />
      <BasketBar
        selected={sys('workers.pool.selected')}
        whatsapp={tf('home.221')}
        waHire={waHire}
      />
    </PoolProvider>
  );
}
