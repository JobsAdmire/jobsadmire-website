import type { Metadata } from 'next';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { makeT, makeTf } from '@/content/adapter';
import { getBlogBundle } from '@/content/blog';
import { getCollection } from '@/content/collections';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { EmptyState } from '@/design/blocks/EmptyState';
import { ImageSlot, type CoverHeights } from '@/design/blocks/ImageSlot';
import { NewsletterBand } from '@/design/blocks/NewsletterBand';
import { CheckIcon } from '@/design/chrome/icons';
import { buttonClassName } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { getPathname, type Href } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { formatInt } from '@/lib/format/money';
import { buildMetadata } from '@/lib/seo/metadata';
import { BlogTools, type LangLink, type TopicOption } from './_components/BlogTools';
import { HeroArt } from './_components/HeroArt';
import { IndexState } from './_components/IndexState';
import { LoadMore } from './_components/LoadMore';
import { PostList } from './_components/PostList';
import { ResultLine } from './_components/ResultLine';
import { RotatingWord } from './_components/RotatingWord';
import { RotationToggle } from './_components/RotationToggle';
import { ScrollEnhancementsLoader } from './_components/ScrollEnhancementsLoader';
import { ALL_DOT, CATEGORY_FACE } from './_lib/category';
import { ALL, POST_LIST_ID, type ResultLineForms } from './_lib/filter';
import { categoryOptions, filterItems, indexPosts, otherLocale, PAGE_SIZE } from './_lib/posts';

/** The owner switched the `newsletter` form on (2026-10-05, after the W5/W97 hold): the band
 *  shows its own inline form (`src/forms/newsletter/`, KVKK checkbox, success →
 *  /tesekkurler?form=newsletter) under the design's proof line (blog.040). */
const NEWSLETTER_ACTIVE = true;

/** W233 (QA W220 contact-01's fix, W187 / final pass A8): the hero photo's fixed height per band,
 *  above the tallest hero in both locales (≤ 460 / 461–560 / 561–700 / 701–900 / 901–1100 /
 *  ≥ 1101 — 701–900 stacks the hero art under the text). Raised in the parity pass: the tools
 *  card, the cadence pill, the phone strip and the two-line h1 now live in the hero (W233's
 *  measures were 534 / 450 / 423 / 722 / 509 / 336 px without them). A box taller than the hero
 *  is clipped by the section, never the other way round. */
const HERO_COVER: CoverHeights = { base: 860, xs: 780, sm: 740, md: 1060, lg: 760, xl: 520 };

/** The hero element `RotationToggle` marks `data-paused` (the floats read it). */
const HERO_ID = 'blog-hero';

/** W82: the design's "Request Workers →" lands on the Hire Workers form (T2 renders the anchor). */
const HIRE_FORM: Exclude<Href, string> = { pathname: '/hire-workers', hash: '#request-form' };

const LANG_CODES: { locale: Locale; code: string }[] = [
  { locale: 'en', code: 'EN' },
  { locale: 'tr', code: 'TR' },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBlogBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  // The `blog` record has '' SEO ids (T0b) → the sys.seo.blog fallbacks (W23/W38); `noindex`
  // comes from the record itself (W4). Both locales have this page, so the default alternates
  // (tr, en, x-default = tr) are right.
  return buildMetadata({
    locale,
    href: '/blog',
    bundle,
    pageKey: 'blog',
    fallbackTitle: sys('seo.blog.title'),
    fallbackDescription: sys('seo.blog.description'),
  });
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([
    getBlogBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const rows = getCollection(bundle, 'blog');
  // W248: the written articles of this locale only; W250: one uniform grid, the featured post
  // its first card (no separate full-width card, no "most read" panel); a locale with none shows
  // the W6 empty state and the other locale's index.
  const listed = indexPosts(rows, locale);
  const words = sys('blog.hero.words').split('|');
  const whatsapp = waLink(
    bundle.settings.whatsappNumber,
    `${sys('whatsapp.prefill')}${sys('blog.whatsapp.consult')}`,
  );
  const forms: ResultLineForms = {
    one: String(sys.raw('blog.tools.results.one')),
    other: String(sys.raw('blog.tools.results.other')),
    forQuote: t('blog.085'),
  };
  const topics: TopicOption[] = [
    { value: ALL, label: t('blog.076'), dot: ALL_DOT },
    ...categoryOptions(listed, t).map((o) => ({ ...o, dot: CATEGORY_FACE[o.value].dot })),
  ];
  // The EN/TR pair links the two indexes: the paths are already localised (`/en/blog`), so they
  // go through next/link, as the chrome's LanguageSwitcher does (next-intl's Link would
  // localise them to this locale).
  const langs: LangLink[] = LANG_CODES.map(({ locale: l, code }) => ({
    code,
    href: getPathname({ locale: l, href: '/blog' }),
    hrefLang: l,
    current: l === locale,
  }));
  const other = otherLocale(locale);
  const otherIndex =
    indexPosts(rows, other).length > 0 ? getPathname({ locale: other, href: '/blog' }) : null;

  return (
    <>
      <IndexState locale={locale} items={filterItems(listed, locale, t)} pageSize={PAGE_SIZE}>
        {/* ---- Hero (Blog.dc.html 495–588): crumbs + the cadence pill, the rotating h1 (B-4, the
                LCP element) with its pause, sub, ticks, the phone strip, the hero art and the
                tools card ---- */}
        <Section
          tone="dark"
          id={HERO_ID}
          className="group/hero relative overflow-hidden max-md:pt-[30px] max-md:pb-[34px]"
        >
          {/* W233: the photo slot carries licensed stock (Istanbul at night, owner 2026-10-05) —
              decorative and preloaded under the two overlays, covering the whole hero (cover mode,
              HERO_COVER); the h1 keeps the one LCP slot. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <ImageSlot
              slot="blog-hero"
              src="/hero/blog.jpg"
              priority
              alt=""
              width={1440}
              height={520}
              sizes="100vw"
              cover={HERO_COVER}
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/75"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/50 via-transparent to-navy/70"
          />
          <div className="container-site relative">
            <div className="grid items-center gap-12 max-md:gap-[26px] lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 max-md:flex-col max-md:items-start max-md:gap-y-[9px]">
                  <Breadcrumbs
                    locale={locale}
                    tone="dark"
                    items={[
                      { name: t('blog.022'), href: '/' },
                      { name: t('blog.004'), href: '/blog' },
                    ]}
                  />
                  {/* S1.1: the cadence pill with its pulsing dot (blog.097) */}
                  <p
                    data-testid="blog-cadence"
                    className="m-0 inline-flex items-center gap-1.5 rounded-pill border border-white/20 bg-white/8 px-3 py-1 text-[12px] font-extrabold text-sky xl:text-[11px] max-md:px-[11px] max-md:py-[5px] max-md:text-[11px]"
                  >
                    <span
                      aria-hidden="true"
                      className="ja-live inline-block h-2 w-2 shrink-0 rounded-pill bg-success"
                    />
                    {t('blog.097')}
                  </p>
                </div>
                <div className="mt-4 mb-4 flex items-start gap-3 max-md:mt-3 max-md:mb-3">
                  {/* The design's own h1 — clamp(36px, 4.2vw, 54px), × 0.75 from 1101 (D19) — and
                      its min-height (108 px at 54 px, two lines): the word's reflow never moves
                      what follows the heading (S1.4). */}
                  <h1
                    data-testid="page-h1"
                    data-lcp-slot="h1"
                    className="m-0 min-h-[2.04em] min-w-0 flex-1 text-[clamp(36px,4.2vw,54px)] leading-[1.02] font-extrabold tracking-[-2.1px] text-white xl:text-[clamp(27px,3.15vw,40.5px)] xl:tracking-[-1.575px] max-md:min-h-[2.16em] max-md:text-[30px] max-md:leading-[1.08] max-md:tracking-[-1px]"
                  >
                    {sys.rich('blog.hero.title', {
                      pre: t('blog.095'),
                      word: () => <RotatingWord words={words} />,
                    })}
                  </h1>
                  <RotationToggle
                    pauseLabel={sys('marquee.pause')}
                    playLabel={sys('marquee.play')}
                    targetId={HERO_ID}
                  />
                </div>
                <p className="text-body-lg mt-0 mb-6.5 max-w-155 font-semibold text-white/80 max-md:mb-[18px] max-md:text-[15px] max-md:leading-[1.5]">
                  {t('blog.096')}
                </p>
                <ul className="m-0 flex max-w-150 list-none flex-wrap gap-x-8.5 gap-y-3.5 p-0 max-md:mt-0.5 max-md:flex-col max-md:gap-2">
                  <li className="text-body flex items-start gap-2.5 font-semibold text-white/75 max-md:text-[13.5px] max-md:leading-[1.4]">
                    <CheckIcon size={16} className="mt-1 shrink-0 text-[#4ade80]" />
                    <span>
                      {t('blog.023')}{' '}
                      <strong className="font-extrabold text-white">{t('blog.024')}</strong>
                    </span>
                  </li>
                  {/* QA W221 BLOG-04 / the design's ≤ 700 rule: the phone strip repeats the
                      two-languages fact, so this tick hides there. */}
                  <li className="text-body flex items-start gap-2.5 font-semibold text-white/75 max-md:hidden">
                    <CheckIcon size={16} className="mt-1 shrink-0 text-[#4ade80]" />
                    <span>
                      <strong className="font-extrabold text-white">{t('blog.025')}</strong>{' '}
                      {t('blog.026')}
                    </span>
                  </li>
                </ul>
                {/* M2: the design's phone strip — the listed count, the two languages and the
                    weekly cadence (blog.091–094; the count noun is sys.blog.index.guides, QA
                    W221 BLOG-02). */}
                <p
                  data-testid="blog-phone-strip"
                  className="m-0 mt-4 hidden flex-wrap items-center gap-x-3.5 gap-y-2 font-bold text-white/62 max-md:flex max-md:text-[12.5px]"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <strong className="font-extrabold text-white">
                      {formatInt(listed.length, locale)}
                    </strong>
                    {sys('blog.index.guides', { n: listed.length })}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block h-1 w-1 rounded-pill bg-white/30"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <strong className="font-extrabold text-sky">EN·TR</strong>
                    {t('blog.092')}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block h-1 w-1 rounded-pill bg-white/30"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <strong className="font-extrabold text-[#4ade80]">{t('blog.093')}</strong>
                    {t('blog.094')}
                  </span>
                </p>
              </div>
              <HeroArt bundle={bundle} />
            </div>
            {/* S1.3 / M3: the tools card inside the hero */}
            <BlogTools
              topics={topics}
              langs={langs}
              labels={{
                search: sys('blog.tools.search'),
                placeholder: t('blog.088'),
                clear: t('blog.033'),
                topic: t('blog.086'),
                pickTopic: t('blog.087'),
                close: t('blog.075'),
                language: t('blog.018'),
                results: forms,
              }}
            />
          </div>
        </Section>

        {/* ---- M4: the phone count line (+ "Temizle" while filtered) ---- */}
        <div className="container-site md:hidden">
          <ResultLine forms={forms} topics={topics} clearLabel={t('blog.089')} />
        </div>

        {listed.length > 0 ? (
          // ---- The grid (Blog.dc.html 636–669; owner 2026-10-06, W250): every article as one
          //      uniform card, four in a row from 1101 px, the featured post first with its pill;
          //      eight to a page, "Daha fazla yazı ↓" adds eight. It takes the design's featured
          //      row's top padding (599: 44 px, 22 on phones), the featured row being gone. ----
          <section className="bg-white pt-11 pb-8 max-md:pt-[22px] max-md:pb-[26px]">
            <div className="container-site">
              <PostList
                bundle={bundle}
                locale={locale}
                posts={listed}
                pageSize={PAGE_SIZE}
                heading={sys('blog.index.latest')}
              />
              <LoadMore
                listId={POST_LIST_ID}
                moreLabel={t('blog.090')}
                noResultsLabel={t('blog.035')}
              />
            </div>
          </section>
        ) : (
          // W6: a locale with no written article (TR on the LOCAL bundle, W248) shows the empty
          // state and the other locale's index.
          <Section tone="light" id="articles">
            <div className="container-site">
              <div data-testid="blog-empty-wrap" className="flex flex-col items-center gap-4">
                <EmptyState
                  testId="blog-empty"
                  headingLevel={2}
                  title={sys('blog.empty.title')}
                  body={sys('blog.empty.body')}
                  className="w-full"
                />
                {otherIndex ? (
                  <NextLink
                    href={otherIndex}
                    hrefLang={other}
                    prefetch={false}
                    data-testid="blog-empty-cta"
                    className={buttonClassName('secondary', 'md')}
                  >
                    {sys('blog.empty.cta')}
                  </NextLink>
                ) : null}
              </div>
            </div>
          </Section>
        )}
      </IndexState>

      {/* ---- Newsletter (671–692): the band with its own inline form (owner, 2026-10-05) ---- */}
      {NEWSLETTER_ACTIVE ? (
        <section className="bg-white pt-10 pb-2 max-md:pt-2">
          <div className="container-site">
            <NewsletterBand
              bundle={bundle}
              locale={locale}
              active={NEWSLETTER_ACTIVE}
              proofId="blog.040"
            />
          </div>
        </section>
      ) : null}

      {/* ---- Closing band (694–715, SHARED 9.2): the 115° gradient card, one-line title, the
              "WhatsApp" label (about.030, the package's own "WhatsApp" button id); phones hide
              WhatsApp and stretch the primary; ticks phone-only (blog.044 legal, verbatim;
              blog.045 re-authored with {homepageReplyHours} → makeTf, D17) ---- */}
      <section className="bg-white pt-12 pb-18 max-md:pt-[22px] max-md:pb-[26px]">
        <div className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            id="blog-cta"
            tone="gradient"
            titleId="blog.042"
            bodyId="blog.043"
            primary={{ label: t('blog.046'), href: HIRE_FORM, variant: 'secondary' }}
            secondary={{ label: t('about.030'), href: whatsapp, external: true }}
            ticks={[tf('blog.044'), tf('blog.045')]}
            hideSecondaryOnPhone
            fullWidthOnPhone
          />
        </div>
      </section>

      {/* The reading-progress bar, loaded on the first scroll (B-13). */}
      <ScrollEnhancementsLoader />
    </>
  );
}
