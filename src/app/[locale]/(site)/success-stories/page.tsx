import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
// By module path everywhere (W125/W130/W134/W147/W156) — never the barrels `@/design/blocks`
// or `@/design/primitives`.
import { Breadcrumbs, type Crumb } from '@/design/blocks/Breadcrumbs';
import { ArrowRightIcon, WhatsAppIcon } from '@/design/chrome/icons';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { ImageSlot, type CoverHeights } from '@/design/blocks/ImageSlot';
import { MetricStrip } from '@/design/blocks/MetricStrip';
import { SampleTag } from '@/design/blocks/SampleTag';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { RadioChipOption } from '@/design/primitives/RadioChips';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { ApprovalFrame } from './_components/ApprovalFrame';
import { ApprovalsWall, type WallCopy } from './_components/ApprovalsWall';
import { HeroStats } from './_components/HeroStats';
import { LiveBadge } from './_components/LiveBadge';
import { NumbersBox } from './_components/NumbersBox';
import { Testimonials, type QuoteItem } from './_components/Testimonials';
import { WorkerStories } from './_components/WorkerStories';
import { SAMPLE_APPROVALS, SAMPLE_QUOTES, SAMPLE_REDACT, WALL_SECTORS } from './_lib/sample';
import { NEGATIVE_KPIS, STORIES_HERO_METRICS, WORKER_STORIES_CONSENTED } from './_lib/signoff';
import { readStories, readTestimonials, sampleStoryCards, storyCards } from './_lib/stories';
import { ALL_SECTORS, type WallCard, type WallResultCopy } from './_lib/wall';

/** W233 (QA W220 contact-01's fix, W187 / final pass A8): the hero photo's fixed height per band,
 *  each ≥ 10 % above the tallest hero in both locales, so the photo never ends in a hard edge
 *  through the copy (the width-driven 1440 × 620 box is 43 % of the width tall). W233 measured
 *  561 / 479 / 383 / 393 / 453 / 358 px at ≤ 460 / 461–560 / 561–700 / 701–900 / 901–1100 /
 *  ≥ 1101. The parity pass (owner 2026-10-05) added the live badge and the 2 × 2 stat cards, which
 *  stack under the copy up to 900 px; its estimates (≈ 780 / 690 / 640 / 840 / 650 / 400 px,
 *  computed from the design's type and spacing — re-measure with a browser sweep) are covered
 *  with ≥ 20 % headroom: an overshoot only crops more of the 60 %-opacity photo. */
const HERO_COVER: CoverHeights = { base: 950, xs: 820, sm: 760, md: 1000, lg: 800, xl: 560 };

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
  // The `stories` page record has titleId/descriptionId '' (the package has no SEO strings for
  // this page), so these sys fallbacks are what renders (W23/W38); the OG route reads the same key.
  return buildMetadata({
    locale,
    href: '/success-stories',
    bundle,
    pageKey: 'stories',
    fallbackTitle: sys('seo.stories.title'),
    fallbackDescription: sys('seo.stories.description'),
  });
}

export default async function SuccessStories({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const t = makeTf(bundle, locale);

  // `stories` is a FIXTURE_ONLY collection — empty on every Vercel build (D23). Parity pass
  // (owner 2026-10-05): until Phase B fills it from Operations (I10), every data-gated section
  // shows the design's sample (`_lib/sample.ts`, page-local constants) with the sample badge or
  // tag; real rows replace the sample, untagged, through the same components.
  const stories = readStories(bundle);
  const published = stories.length > 0;
  const sample = !published;
  const cards = published ? storyCards(bundle, locale, stories) : sampleStoryCards(bundle, locale);
  const approvedLabel = t('success.040');
  // The document frames are server nodes (W148: `ImageSlot` and the watermark read `sys.*`
  // namespaces the client never receives); the island only places them.
  const wallCards: WallCard[] = cards.map((c) => {
    const frame = (variant: 'grid' | 'slide') => (
      <ApprovalFrame
        slot={variant === 'grid' ? `approval-${c.id}` : `approval-slide-${c.id}`}
        variant={variant}
        sectorLabel={c.sectorLabel}
        approvedLabel={approvedLabel}
        monthLabel={c.monthLabel}
        redact={sample ? SAMPLE_REDACT : []}
      />
    );
    return { ...c, frame: frame('grid'), slideFrame: frame('slide') };
  });
  const headcount = published
    ? stories.reduce((n, s) => n + s.headcount, 0)
    : SAMPLE_APPROVALS.reduce((n, s) => n + s.headcount, 0);

  const consented = readTestimonials(bundle);
  const quotes: QuoteItem[] =
    consented.length > 0
      ? consented
      : SAMPLE_QUOTES.map((q) => ({
          id: q.id,
          quote: t(q.quoteId),
          role: t(q.roleId),
          org: t(q.orgId),
          initials: q.initials,
          tone: q.tone,
        }));
  const whatsapp = bundle.settings.whatsappNumber;

  // W109: the page's own package nav label (success.013) and its own Home label (success.022).
  const crumbs: Crumb[] = [
    { name: t('success.022'), href: '/' },
    { name: t('success.013'), href: '/success-stories' },
  ];
  // Parity pass (owner 2026-10-05, retiring Delta 2): the design's seven chips — "All sectors"
  // plus its six sectors, each labelled by its package id (success.124–130). A published
  // story's site sector is filed under the chip that covers it (`WALL_SECTOR_OF`).
  const sectorOptions: RadioChipOption[] = [
    { value: ALL_SECTORS, label: t('success.124') },
    ...WALL_SECTORS.map((s) => ({ value: s.id, label: t(s.labelId) })),
  ];
  // W148: the raw `{token}` templates only — the island does the substitution itself against
  // its own live filter state, so it never calls `useTranslations` and `sys.stories.*` never
  // joins `CLIENT_SYS`.
  const resultTemplates: WallResultCopy = {
    showingAll: sys.raw('stories.wall.showingAll') as string,
    showingFiltered: sys.raw('stories.wall.showingFiltered') as string,
  };
  const wallCopy: WallCopy = {
    legend: sys('stories.wall.legend'),
    approved: approvedLabel,
    unit: t('success.041'),
    proofShow: t('success.147'),
    proofHide: t('success.146'),
    latestAll: t('success.144'),
    latestPrefix: t('success.145'),
    swipe: t('success.039'),
    moreShow: t('success.136'),
    moreHide: t('success.135'),
    watermarkNote: t('success.042'),
    sampleBadge: sample ? t('success.134') : undefined,
    noneInSector: { title: t('success.043'), body: t('success.044'), reset: t('success.045') },
  };
  // W76/W95: the prefill is static page copy — no visitor-chosen value ever sits in an href.
  const jobOrderHref = waLink(whatsapp, sys('stories.whatsappPrefill'));
  const heroMetrics = STORIES_HERO_METRICS.length > 0;

  return (
    <>
      {/* ---- Hero (design .ja-ss-hero: navy + gradient overlay over the ss-hero slot) ---- */}
      <Section tone="dark" className="relative overflow-hidden max-md:pt-6 max-md:pb-[34px]">
        {/* §10 row 4 / delta 12: the hero photo is licensed stock (owner 2026-10-05, W233) inside
            a positioning wrapper — `ImageSlot` owns its own box (W129): the wrapper pins it
            full-bleed and its cover mode (HERO_COVER) covers the whole hero; preloaded, while the
            h1 stays the page's one LCP slot (D26). Decorative: alt "" inside an aria-hidden
            wrapper. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <ImageSlot
            slot="ss-hero"
            src="/hero/success-stories.jpg"
            priority
            alt=""
            width={1440}
            height={620}
            sizes="100vw"
            cover={HERO_COVER}
            className="opacity-60"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,26,55,0.96)_0%,rgba(14,26,55,0.9)_55%,rgba(14,26,55,0.78)_100%)]"
        />
        <div className="container-site relative">
          {/* S1.7: the current crumb is white .85 on this hero (the shared dark tone keeps it at
              .55 — a page-local override until the block takes it). */}
          <Breadcrumbs
            locale={locale}
            items={crumbs}
            tone="dark"
            className="mb-[1.875rem] max-md:mb-3.5 [&_[aria-current=page]]:text-white/85"
          />
          <div className="grid items-center gap-8 max-md:gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            {/* the design's `.ja-up`: the copy column rises in */}
            <div className="ja-up min-w-0">
              <LiveBadge count={headcount} sampleLabel={sample ? t('success.140') : undefined} />
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em] text-white max-md:mb-3 max-md:text-[31px] max-md:leading-[1.05] max-md:tracking-[-1.1px]"
              >
                {t('success.023')} <span className="text-sky">{t('success.024')}</span>
              </h1>
              {/* Owner ruling (parity pass): success.025 ("Aşağıda… gerçek çalışma izni onayları
                  var…") over the wall, sample or real. */}
              <p className="m-0 mb-7 max-w-[33.75rem] text-body-lg leading-[1.55] font-semibold text-white/[0.78] max-md:mb-5 max-md:text-[15px]">
                {t('success.025')}
              </p>
              <div className="flex flex-wrap gap-3 max-md:grid max-md:grid-cols-1 max-md:gap-[9px]">
                <Button
                  variant="primary"
                  size="lg"
                  href="#talk"
                  iconEnd={<ArrowRightIcon />}
                  className="max-md:px-[22px] max-md:text-[15px]"
                >
                  {t('success.026')}
                </Button>
                {/* W195: a cross-route page link never viewport-prefetches (hover still does). */}
                <Button
                  variant="inverse"
                  size="lg"
                  href="/hiring-cost-calculator"
                  prefetch={false}
                  className="max-md:px-[22px] max-md:text-[15px]"
                >
                  {t('success.027')}
                </Button>
              </div>
            </div>
            {/* W1: a signed hero metric renders through MetricStrip; until then the design's
                four stat cards show their sample figures under the sample tag. */}
            {heroMetrics ? (
              <MetricStrip
                bundle={bundle}
                locale={locale}
                metrics={STORIES_HERO_METRICS}
                tone="dark"
              />
            ) : (
              <HeroStats bundle={bundle} locale={locale} />
            )}
          </div>
          {/* success.033/034 (the amber "still to replace" note) is a design-time instruction
              — not rendered; the sample tags say the same thing to a visitor. */}
        </div>
      </Section>

      {/* ---- Approvals wall (#cases) ---- */}
      <Section
        tone="light"
        id="cases"
        className="ja-reveal scroll-mt-24 pt-[4.625rem] pb-[4.875rem] max-md:pt-[34px] max-md:pb-10"
      >
        <div className="container-site">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-[1.625rem] max-md:mb-4 max-md:gap-3.5">
            <div className="max-w-[40rem]">
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <Eyebrow>{t('success.035')}</Eyebrow>
                {sample && <SampleTag />}
              </div>
              <h2 className="m-0 mb-2.5 text-h2 max-md:text-[25px] max-md:tracking-[-0.6px]">
                {t('success.036')}
              </h2>
              {/* Delta 7 (kept — COPY IS FROZEN): success.037 (legal-flagged) describes the v1.1
                  redacted documents; the site's own intro stays. */}
              <p className="m-0 text-body text-text-secondary max-md:text-[14.5px] max-md:leading-[1.55]">
                {sys('stories.wall.intro')}
              </p>
            </div>
            <Button
              variant="primary"
              href="/work-permit"
              prefetch={false}
              shape="rect"
              radius={11}
              iconEnd={<ArrowRightIcon size={15} />}
              className="max-md:min-h-12 max-md:w-full"
            >
              {t('success.038')}
            </Button>
          </div>
          <ApprovalsWall
            sectors={sectorOptions}
            cards={wallCards}
            locale={locale}
            copy={wallCopy}
            resultTemplates={resultTemplates}
          />
        </div>
      </Section>

      {/* ---- "Numbers we do not hide" — signed KPIs, else the design's sample (W1) ---- */}
      <NumbersBox bundle={bundle} locale={locale} kpis={NEGATIVE_KPIS} />

      {/* ---- Employer testimonials — consented rows, else the design's sample (§10 row 11) ---- */}
      <Testimonials
        bundle={bundle}
        locale={locale}
        items={quotes}
        sample={consented.length === 0}
      />

      {/* ---- "The other side" worker stories — untagged only with published approvals AND the
          owner's separate consent (§10 row 11, _lib/signoff.ts) ---- */}
      <WorkerStories
        bundle={bundle}
        locale={locale}
        sample={!(published && WORKER_STORIES_CONSENTED)}
      />

      {/* ---- Closing CTA (#talk): the design's blue split — copy left, the stacked white
          WhatsApp pill, the translucent call pill and the centred cost link right ---- */}
      <Section
        tone="band"
        id="talk"
        className="ja-reveal scroll-mt-24 pt-0 pb-[5.25rem] max-md:pb-11"
      >
        <div className="container-site" data-testid="stories-closing">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            tone="blue"
            titleId="success.079"
            bodyId="success.080"
            primary={{
              label: t('success.081'),
              href: jobOrderHref,
              external: true,
              icon: <WhatsAppIcon className="text-success" />,
            }}
            secondary={{ label: t('success.082'), href: '/contact' }}
            link={{ label: t('success.083'), href: '/hiring-cost-calculator' }}
            fullWidthOnPhone
          />
        </div>
      </Section>
    </>
  );
}
