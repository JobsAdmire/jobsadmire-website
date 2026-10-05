import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBundle, makeT, makeTf, metricValues } from '@/content/adapter';
import { getCollection, getRateConfig } from '@/content/collections';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { ContactCta } from '@/design/blocks/ContactCta';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { NewsletterBand } from '@/design/blocks/NewsletterBand';
import { Section } from '@/design/primitives/Section';
import type { Href } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { formatDate } from '@/lib/format/date/formatDate';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import { formatInt } from '@/lib/format/money';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { articleJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl, pageOgImageUrl } from '@/lib/seo/routes';
import {
  articleAlternates,
  articleHref,
  findWritten,
  isWritten,
  otherLocale,
  writtenPosts,
} from '../_lib/posts';
import { ArticleCrumbs } from './_components/ArticleCrumbs';
import { ARTICLE_H2_SECTION, ArticleBody } from './_components/ArticleBody';
import { ArticleScrollEnhancementsLoader } from './_components/ArticleScrollEnhancementsLoader';
import type { ArticleSidebarProps } from './_components/ArticleSidebar';
import { ArticleSidebarFallback } from './_components/ArticleSidebarFallback';
import { ArticleSidebarIsland } from './_components/ArticleSidebarIsland';
import { CategoryCover } from './_components/CategoryCover';
import { CollapsibleSection } from './_components/CollapsibleSection';
import { MobileToc } from './_components/MobileToc';
import { RelatedPosts } from './_components/RelatedPosts';
import { headings, parseMarkdown } from './_lib/markdown';
import { listedPosts, neighboursListed, relatedListed } from './_lib/neighbours';
import { remainingText } from './_lib/sidebar';

type Params = { locale: string; slug: string };

/** The owner switched the `newsletter` form on (2026-10-05): the band shows its own inline form
 *  (`src/forms/newsletter/`, success → /tesekkurler?form=newsletter) under the design's proof line. */
const NEWSLETTER_ACTIVE = true;
/** W82: every "Request Workers →" lands on the Hire Workers form (T2 renders the anchor). */
const HIRE_FORM: Exclude<Href, string> = { pathname: '/hire-workers', hash: '#request-form' };
const FAQ_ID = 'faq';
const BAND_ID = 'blog-cta';
/** The page's own ids a body heading may never take (B-8). */
const RESERVED_IDS = [FAQ_ID, 'faq-list', BAND_ID, 'main'];

/** B-1: only the slugs written in their locale are prerendered (one EN, zero TR today). Any other
 *  slug still renders on demand (`dynamicParams` stays true — an article Operations publishes in
 *  Phase B needs no redeploy) and answers 404 through `findWritten` (W151).
 *  Bottom up (Next's "generate params from the bottom up"): complete `{ locale, slug }` pairs for
 *  every locale. Next 16.3.5 still calls this once per parent `[locale]` and merges each item over
 *  the parent, but a per-locale `[]` (TR today) would pass `{ locale: 'tr' }` through WITHOUT a
 *  slug, and one incomplete combination stops Next prerendering ANY path of the route — the EN
 *  article included (T12 proof; `static-params.test.ts` models the expansion). */
export async function generateStaticParams(): Promise<{ locale: Locale; slug: string }[]> {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const bundle = await getBundle(locale);
      return writtenPosts(getCollection(bundle, 'blog'), locale).flatMap((post) => {
        const slug = post.slug[locale];
        return slug ? [{ locale, slug }] : [];
      });
    }),
  );
  return perLocale.flat();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const post = findWritten(getCollection(bundle, 'blog'), locale, slug);
  const href = post ? articleHref(post, locale) : null;
  const title = post?.title[locale];
  if (!post || !href || !title) notFound();
  // W124/B-15: `blogArticle` is a template record without SEO fields, so the article's own
  // title, description, canonical (from `href`) and alternates win; hreflang only where it is
  // written. W169: the image is the index's; `sys.seo.blogArticle.title` does not exist on purpose.
  return buildMetadata({
    locale,
    href,
    bundle,
    pageKey: 'blogArticle',
    fallbackTitle: sys('blog.article.metaTitle', { title }),
    fallbackDescription: post.excerpt[locale] ?? title,
    alternates: articleAlternates(post),
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [makeT(bundle)('blogarticle.023')],
      images: [pageOgImageUrl(locale, 'blog')],
    },
  });
}

export default async function BlogArticle({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const rows = getCollection(bundle, 'blog');
  const post = findWritten(rows, locale, slug);
  const href = post ? articleHref(post, locale) : null;
  const title = post?.title[locale];
  const body = post?.body[locale];
  if (!post || !href || !title || !body) notFound();

  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const values = metricValues(bundle, locale);
  const excerpt = post.excerpt[locale] ?? '';
  const blocks = parseMarkdown(body, RESERVED_IDS);
  // The design's TOC: the body's sections + the FAQ (its own short label, blogarticle.126).
  const toc = [...headings(blocks), { id: FAQ_ID, text: t('blogarticle.126') }];
  const tocLabel = t('blogarticle.024');
  const url = absoluteUrl(locale, href);
  const other = otherLocale(locale);
  const author = t('blogarticle.023');
  const readTime = formatReadMinutes(post.readMinutes, locale);
  const byline = `${formatDate(post.publishedAt, locale)} · ${readTime}`;
  // Owner ruling 2026-10-05: related and previous/next come from every bundle row that has a title
  // here (same category first); the cards of rows without a body are not links (`sys.blog.soon`).
  const listed = listedPosts(rows, locale);
  const related = relatedListed(listed, post);
  const { prev, next } = neighboursListed(listed, post);
  const categoryLabel = t(post.categoryLabelId);
  // W76/W95: static prefills only — page copy and the article's own title, never visitor input.
  const wa = (tail: string) =>
    waLink(bundle.settings.whatsappNumber, `${sys('whatsapp.prefill')}${tail}`);
  // B-10: A1 and Q3 have no package id; their numbers come from data (D17).
  const faq: FaqItem[] = [
    {
      id: 'q1',
      q: t('blogarticle.127'),
      a: sys('blog.faq.a1', {
        permitDays: values.permitDays,
        firstDayWeeks: values.firstDayWeeks,
      }),
    },
    { id: 'q2', q: t('blogarticle.128'), a: t('blogarticle.129') },
    {
      id: 'q3',
      q: sys('blog.faq.q3', { ratio: formatInt(getRateConfig(bundle).quotaRatio, locale) }),
      a: t('blogarticle.130'),
    },
    { id: 'q4', q: t('blogarticle.131'), a: t('blogarticle.132') },
  ];
  const remainingTemplate = `≈ {n} ${t('blogarticle.141')}`;
  const sidebar: ArticleSidebarProps = {
    headings: toc,
    tocLabel,
    readMinutes: post.readMinutes,
    // The package splits "≈ N min left" into the number and blogarticle.141; ScrollSpyToc fills
    // the literal {n} token itself (W85 string props).
    remaining: remainingTemplate,
    url,
    title,
    share: {
      heading: t('blogarticle.069'),
      share: t('blogarticle.069'),
      whatsapp: t('blogarticle.074'),
      linkedin: t('blogarticle.075'),
      x: t('blogarticle.076'),
      copy: t('blogarticle.145'),
      copied: t('blogarticle.144'),
      copyFailed: sys('blog.article.copyFailed'),
    },
    shareThis: sys('blog.article.shareThis'),
  };

  return (
    <>
      <article>
        <JsonLd
          data={articleJsonLd({
            headline: title,
            description: excerpt,
            url,
            image: pageOgImageUrl(locale, 'blog'),
            datePublished: post.publishedAt,
            authorName: author,
            authorType: 'Organization',
            publisherSettings: bundle.settings,
            locale,
          })}
        />

        {/* ---- Hero: crumbs (W109, B-9), pills, the h1 (the LCP element, B-7), byline ---- */}
        <Section
          tone="dark"
          className="relative overflow-hidden pt-[34px] pb-[118px] md:pt-[52px] md:pb-[200px] xl:pt-[39px] xl:pb-[150px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-[6%] h-[340px] w-[340px] xl:w-[255px] rounded-pill bg-[radial-gradient(circle,rgba(30,158,232,0.3),transparent_65%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-36 -left-16 h-[320px] w-[320px] xl:w-[240px] rounded-pill bg-[radial-gradient(circle,rgba(22,163,74,0.16),transparent_65%)]"
          />
          <div className="container-site relative">
            <div className="mx-auto max-w-[980px] xl:max-w-[735px]">
              <ArticleCrumbs
                locale={locale}
                home={t('blogarticle.022')}
                blog={t('blogarticle.004')}
                category={categoryLabel}
                title={title}
                href={href}
              />
              <p className="mt-5 mb-4 flex flex-wrap gap-2.5">
                <span className="rounded-pill border border-sky/45 bg-blue/20 px-3.5 py-1 text-[12.5px] xl:text-[11px] font-extrabold text-sky">
                  {categoryLabel}
                </span>
                {isWritten(post, other) ? (
                  <span
                    data-testid="article-lang-note"
                    className="rounded-pill border border-white/20 bg-white/10 px-3.5 py-1 text-[12.5px] xl:text-[11px] font-bold text-white/75"
                  >
                    {locale === 'tr' ? t('blogarticle.143') : sys('blog.article.langNote')}
                  </span>
                ) : null}
              </p>
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="mt-0 mb-4 max-w-[880px] text-[27px] leading-[1.14] font-extrabold tracking-[-0.9px] md:text-[clamp(30px,3.6vw,44px)] md:leading-[1.1] md:tracking-[-1.4px] xl:mb-3 xl:max-w-[660px] xl:text-[clamp(22.5px,2.7vw,33px)] xl:tracking-[-1.05px]"
              >
                {title}
              </h1>
              <p className="text-body-lg mt-0 mb-6 max-w-[780px] font-semibold text-white/80 max-md:mb-5 max-md:text-[15.5px] xl:max-w-[585px]">
                {excerpt}
              </p>
              <div className="flex items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-gradient-to-br from-[#1E9EE8] to-[#146fa1] text-[15px] xl:text-[11.25px] font-extrabold text-white"
                >
                  JA
                </span>
                <p className="m-0">
                  <strong className="text-body block font-extrabold text-white">{author}</strong>
                  <span className="text-body-sm font-semibold text-white/65">{byline}</span>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ---- Cover: overlaps the hero; a named placeholder, never the LCP slot (B-7, W103).
             Final pass C1 (W206/W209, W189 A3): the slot's own cover mode gives the design's fixed
             heights — 190 px ≤ 700, 430 px at 701–1100, 322.5 px from 1101 — independent of the
             box's width (the ratio box read 154 / 290–377 / 323 px). ---- */}
        <div className="container-site relative z-[2] -mt-[92px] md:-mt-[150px] xl:-mt-[112.5px]">
          <div className="mx-auto max-w-[980px] xl:max-w-[735px]">
            <CategoryCover
              slot={`blog-cover-${post.key}`}
              category={post.category}
              label={categoryLabel}
              imageWidth={980}
              imageHeight={430}
              className="h-[190px] overflow-hidden rounded-lg shadow-[0_26px_60px_rgba(22,60,90,0.18)] xl:shadow-[0_19.5px_45px_rgba(22,60,90,0.18)] md:h-[430px] xl:h-[322.5px]"
            />
          </div>
        </div>

        {/* ---- Body + sidebar ---- */}
        <Section tone="light">
          <div className="container-site">
            {/* Final pass C2 (W206): stacked at 701–900 the design's body/sidebar gap is ≈ 30 px, not
                the two-column 56 px — `max-lg:gap-8`. */}
            <div className="mx-auto grid max-w-[1180px] items-start gap-14 max-lg:gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:max-w-[885px] xl:grid-cols-[minmax(0,1fr)_225px] xl:gap-[42px]">
              <div className="min-w-0">
                {/* ≤700 px: the TOC as a disclosure — works before hydration (B-12) */}
                <MobileToc
                  headings={toc}
                  label={tocLabel}
                  sub={`${sys('blog.article.sections', { n: toc.length })} · ${remainingText(post.readMinutes, remainingTemplate)}`}
                />

                {/* The printable region (B-16): a print-only title/byline + the body */}
                <div data-testid="article-body" className="print-isolate">
                  <div className="hidden print:block">
                    <p className="mt-0 mb-2 text-[22px] xl:text-[16.5px] font-extrabold text-ink">
                      {title}
                    </p>
                    <p className="text-body-sm mt-0 mb-6 text-text-tertiary">{`${author} · ${byline}`}</p>
                  </div>
                  <ArticleBody
                    blocks={blocks}
                    closingCta={
                      <ContactCta
                        placement="page_cta"
                        href={wa(sys('blog.whatsapp.permit'))}
                        external
                        variant="primary"
                        shape="rect"
                        radius={10}
                        className="print-hidden"
                      >
                        {t('blogarticle.064')}
                      </ContactCta>
                    }
                  />
                </div>

                {/* FAQ (B-10): a collapsible section on phones like every h2, then one FaqBlock in the
                    design's separate-card face (rotating ⌄) → one FAQPage */}
                <CollapsibleSection
                  id={FAQ_ID}
                  title={t('blogarticle.065')}
                  headingClassName={ARTICLE_H2_SECTION}
                >
                  <FaqBlock
                    bundle={bundle}
                    locale={locale}
                    items={faq}
                    id="faq-list"
                    headingLevel={3}
                    variant="cards"
                    toggle="chevron"
                    layout="stacked"
                  />
                </CollapsibleSection>

                {/* Author box (blogarticle.066–068; 068 is legal-flagged — verbatim) */}
                <div
                  data-testid="article-author"
                  className="mt-9 flex flex-wrap items-center gap-[18px] xl:gap-[13.5px] rounded-base border border-tint-border bg-pale-1 px-7 py-6 max-md:mt-7 max-md:grid max-md:grid-cols-[42px_1fr] max-md:gap-x-3 max-md:gap-y-1 max-md:px-[18px] max-md:py-4"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-gradient-to-br from-[#1E9EE8] to-[#146fa1] text-[18px] max-md:h-[42px] max-md:w-[42px] max-md:text-[14.5px] xl:text-[13.5px] font-extrabold text-white"
                  >
                    JA
                  </span>
                  <div className="min-w-[220px] flex-1 max-md:min-w-0">
                    <p className="mt-0 mb-1 font-extrabold text-ink max-md:mb-0 max-md:text-[14.5px]">
                      {t('blogarticle.066')}
                    </p>
                    <p className="text-body-sm m-0 text-text-secondary max-md:mt-[3px] max-md:text-[13px] max-md:leading-[1.55]">
                      {t('blogarticle.067')}
                    </p>
                  </div>
                  <p className="m-0 inline-flex items-center gap-2 rounded-pill border border-tint-border bg-white px-[18px] xl:px-[13.5px] py-2 text-[13px] xl:text-[11px] font-extrabold whitespace-nowrap text-blue-safe max-md:col-span-full max-md:mt-2 max-md:justify-self-start max-md:px-[13px] max-md:py-1.5 max-md:text-[11.5px]">
                    <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
                    {t('blogarticle.068')}
                  </p>
                </div>
              </div>

              {/* Sidebar: the lazy island (TOC, share, print — B-13) + the CTA card (≥701 px).
                  Stuck below the header at its real height (`--sticky-top`, W232), it is capped
                  to the height it can show — the screen less that top, 1.5rem of air and the
                  sticky bar — and scrolls inside: the column is taller than the CSS viewport
                  the liquid desktop's zoom leaves (W231). The 0.25rem inline bleed keeps focus
                  rings at its edges inside the scroll box's clip. */}
              <div
                data-testid="article-sidebar"
                className="flex flex-col gap-4 lg:sticky lg:top-(--sticky-top) lg:-mx-1 lg:max-h-[calc(100vh/var(--zoom,1)_-_var(--sticky-top)_-_1.5rem_-_var(--sticky-cta-h,0px))] lg:overflow-y-auto lg:overscroll-contain lg:px-1"
              >
                <ArticleSidebarIsland
                  {...sidebar}
                  fallback={<ArticleSidebarFallback {...sidebar} />}
                />
                <div className="rounded-base bg-[linear-gradient(160deg,var(--color-blue-safe),var(--color-blue-deep))] p-6 text-white max-md:hidden">
                  <p className="mt-0 mb-1.5 text-[17px] leading-snug font-extrabold xl:text-[12.75px]">
                    {t('blogarticle.071')}
                  </p>
                  <p className="text-body-sm mt-0 mb-3.5">{t('blogarticle.072')}</p>
                  <ContactCta
                    placement="page_cta"
                    href={HIRE_FORM}
                    prefetch={false}
                    variant="white"
                    shape="rect"
                    radius={10}
                    className="w-full"
                  >
                    {t('blogarticle.073')}
                  </ContactCta>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </article>

      {/* ---- Related + prev/next: every titled bundle row; bodiless ones are tagged, not linked ---- */}
      <RelatedPosts bundle={bundle} locale={locale} related={related} prev={prev} next={next} />

      {/* ---- Newsletter band (DC 774–795): the band's own inline form + the proof line (blog.040) ---- */}
      {NEWSLETTER_ACTIVE ? (
        <Section tone="band">
          <div className="container-site">
            <div className="mx-auto xl:max-w-[885px]">
              <NewsletterBand
                bundle={bundle}
                locale={locale}
                active={NEWSLETTER_ACTIVE}
                id="newsletter"
                proofId="blog.040"
              />
            </div>
          </div>
        </Section>
      ) : null}

      {/* ---- Closing band (blogarticle.092–095; 094 legal verbatim, 095 {homepageReplyHours} → makeTf) ---- */}
      <Section tone="band">
        <div className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            id={BAND_ID}
            tone="gradient"
            titleId="blogarticle.092"
            bodyId="blogarticle.093"
            primary={{ label: t('blogarticle.073'), href: HIRE_FORM, variant: 'secondary' }}
            secondary={{
              label: t('home.221'),
              href: wa(sys('blog.whatsapp.consult')),
              external: true,
            }}
            ticks={[tf('blogarticle.094'), tf('blogarticle.095')]}
            hideSecondaryOnPhone
            fullWidthOnPhone
          />
        </div>
      </Section>

      {/* Progress bar, back-to-top (phones) and the white sticky bar (lg+) — on the first scroll (B-13) */}
      <ArticleScrollEnhancementsLoader
        backToTopLabel={sys('blog.article.backToTop')}
        stickyBar={{
          message: t('blogarticle.084'),
          hideNearId: BAND_ID,
          ctas: [
            {
              label: t('blogarticle.085'),
              href: wa(sys('blog.whatsapp.article', { title })),
              external: true,
              variant: 'success-solid',
              icon: 'whatsapp',
              radius: 9,
            },
            { label: t('blogarticle.073'), href: HIRE_FORM, variant: 'primary', radius: 9 },
          ],
        }}
      />
    </>
  );
}
