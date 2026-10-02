import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
// By module path everywhere (W125/W130/W134/W147/W156) — never the barrels `@/design/blocks`
// or `@/design/primitives`.
import { Breadcrumbs, type Crumb } from '@/design/blocks/Breadcrumbs';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { EmptyState } from '@/design/blocks/EmptyState';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { MetricStrip } from '@/design/blocks/MetricStrip';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { RadioChipOption } from '@/design/primitives/RadioChips';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { ApprovalsWall } from './_components/ApprovalsWall';
import { LiveBadge } from './_components/LiveBadge';
import { NumbersBox } from './_components/NumbersBox';
import { Testimonials } from './_components/Testimonials';
import { WorkerStories } from './_components/WorkerStories';
import { NEGATIVE_KPIS, STORIES_HERO_METRICS, WORKER_STORIES_CONSENTED } from './_lib/signoff';
import { readStories, readTestimonials, storyCards } from './_lib/stories';
import { ALL_SECTORS, type WallResultCopy } from './_lib/wall';

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

  // Phase A: `stories` is a FIXTURE_ONLY collection — empty on every Vercel build (D23), so the
  // wall is the W6 empty state and every data-gated section below returns null. Phase B fills
  // it from Operations (I10) and the same components render the cards.
  const stories = readStories(bundle);
  const cards = storyCards(bundle, locale, stories);
  const testimonials = readTestimonials(bundle);
  const published = stories.length > 0;
  const whatsapp = bundle.settings.whatsappNumber;

  // W109: the page's own package nav label (success.013) and its own Home label (success.022).
  const crumbs: Crumb[] = [
    { name: t('success.022'), href: '/' },
    { name: t('success.013'), href: '/success-stories' },
  ];
  // Delta 2: the site's sector taxonomy (the keys every form sends) plus the design's
  // "All sectors" chip — not the design's private hotels/food enum.
  const sectorOptions: RadioChipOption[] = [
    { value: ALL_SECTORS, label: t('success.124') },
    ...getCollection(bundle, 'sectors').map((s) => ({ value: s.key, label: t(s.labelId) })),
  ];
  // W148: the raw `{token}` templates only — the island (Cycle 4) does the substitution itself
  // against its own live filter state, so it never calls `useTranslations` and `sys.stories.*`
  // never joins `CLIENT_SYS`.
  const resultTemplates: WallResultCopy = {
    showingAll: sys.raw('stories.wall.showingAll') as string,
    showingFiltered: sys.raw('stories.wall.showingFiltered') as string,
  };
  // W76/W95: both prefills are static page copy — no visitor-chosen value ever sits in an href.
  const jobOrderHref = waLink(whatsapp, sys('stories.whatsappPrefill'));
  const exampleHref = waLink(whatsapp, sys('stories.empty.prefill'));
  const heroStats = STORIES_HERO_METRICS.length > 0;

  return (
    <>
      {/* ---- Hero (design .ja-ss-hero: navy + gradient overlay over the ss-hero slot) ---- */}
      <Section tone="dark" className="relative overflow-hidden">
        {/* §10 row 4 / delta 12: the hero photo is a named placeholder (W55) inside a
            positioning wrapper — `ImageSlot` owns its own box (W129), so the wrapper, not the
            slot, carries the full-bleed sizing; the h1 is the LCP element (D26). Decorative:
            alt "" → aria-hidden. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <ImageSlot slot="ss-hero" alt="" width={1440} height={620} className="opacity-60" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,26,55,0.96)_0%,rgba(14,26,55,0.9)_55%,rgba(14,26,55,0.78)_100%)]"
        />
        <div className="container-site relative">
          <Breadcrumbs locale={locale} items={crumbs} tone="dark" className="mb-6" />
          <div
            className={
              heroStats ? 'grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]' : 'max-w-[720px]'
            }
          >
            <div>
              <LiveBadge stories={stories} />
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em] text-white"
              >
                {t('success.023')} <span className="text-sky">{t('success.024')}</span>
              </h1>
              {/* Delta 7: success.025 says "Below are the actual approvals" — only true once one
                  is published. */}
              <p className="m-0 mb-7 max-w-[540px] text-body-lg text-white/80">
                {published ? t('success.025') : sys('stories.hero.bodyEmpty')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="lg" href="#talk">
                  {t('success.026')}
                </Button>
                {/* W195: a cross-route page link never viewport-prefetches (hover still does). */}
                <Button variant="inverse" size="lg" href="/hiring-cost-calculator" prefetch={false}>
                  {t('success.027')}
                </Button>
              </div>
            </div>
            {/* W1: the design's four stat cards (success.028–032 captions) — unsigned, so the
                strip reads an empty list and renders nothing. */}
            <MetricStrip
              bundle={bundle}
              locale={locale}
              metrics={STORIES_HERO_METRICS}
              tone="dark"
            />
          </div>
          {/* success.033/034 (the amber "still to replace" note) is a design-time instruction
              with a string id — deliberately not rendered. */}
        </div>
      </Section>

      {/* ---- Approvals wall (#cases) ---- */}
      <Section tone="light" id="cases" className="scroll-mt-24">
        <div className="container-site">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[640px]">
              <Eyebrow>{t('success.035')}</Eyebrow>
              <h2 className="m-0 mb-2 text-h2">{t('success.036')}</h2>
              {/* Delta 7: success.037 (legal-flagged) describes the v1.1 redacted documents. */}
              <p className="m-0 text-body text-text-secondary">{sys('stories.wall.intro')}</p>
            </div>
            <Button variant="primary" href="/work-permit" prefetch={false}>
              {t('success.038')}
            </Button>
          </div>
          <ApprovalsWall
            sectors={sectorOptions}
            stories={cards}
            locale={locale}
            legend={sys('stories.wall.legend')}
            resultTemplates={resultTemplates}
            emptyState={
              <EmptyState
                testId="stories-empty"
                tone="pale"
                title={sys('stories.empty.title')}
                body={sys('stories.empty.body')}
                cta={{ label: sys('stories.empty.cta'), href: exampleHref, external: true }}
              />
            }
            noneInSector={{
              title: t('success.043'),
              body: t('success.044'),
              reset: t('success.045'),
            }}
            approvedLabel={t('success.040')}
          />
        </div>
      </Section>

      {/* ---- "Numbers we do not hide" — hidden until a KPI is signed (W1) ---- */}
      <NumbersBox bundle={bundle} locale={locale} kpis={NEGATIVE_KPIS} />

      {/* ---- Employer testimonials — hidden until consented rows exist (§10 row 11) ---- */}
      <Testimonials bundle={bundle} locale={locale} items={testimonials} />

      {/* ---- "The other side" worker stories — an approval AND the owner's separate consent
          (§10 row 11, _lib/signoff.ts) ---- */}
      <WorkerStories
        bundle={bundle}
        locale={locale}
        visible={published && WORKER_STORIES_CONSENTED}
      />

      {/* ---- Closing CTA (#talk) ---- */}
      <Section tone="band" id="talk" className="scroll-mt-24">
        <div className="container-site" data-testid="stories-closing">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            tone="gradient"
            titleId="success.079"
            bodyId="success.080"
            primary={{
              label: t('success.081'),
              href: jobOrderHref,
              external: true,
              variant: 'success',
            }}
            secondary={{ label: t('success.082'), href: '/contact' }}
            extra={[{ label: t('success.083'), href: '/hiring-cost-calculator' }]}
          />
        </div>
      </Section>
    </>
  );
}
