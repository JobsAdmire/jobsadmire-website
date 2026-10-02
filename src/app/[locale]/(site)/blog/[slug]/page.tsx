import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBundle, makeT, makeTf, metricValues } from '@/content/adapter';
import { blogNavVisible, getCollection, getRateConfig } from '@/content/collections';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { ContactCta } from '@/design/blocks/ContactCta';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { NewsletterBand } from '@/design/blocks/NewsletterBand';
import { Section } from '@/design/primitives/Section';
import type { Href } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { formatDate } from '@/lib/format/date/formatDate';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import { formatInt } from '@/lib/format/money';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { articleJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl, pageOgImageUrl } from '@/lib/seo/routes';
import { ScrollEnhancementsLoader } from '../_components/ScrollEnhancementsLoader';
import {
  articleAlternates,
  articleHref,
  findWritten,
  isWritten,
  otherLocale,
  prevNext,
  relatedPosts,
  writtenPosts,
} from '../_lib/posts';
import { ARTICLE_H2, ArticleBody } from './_components/ArticleBody';
import type { ArticleSidebarProps } from './_components/ArticleSidebar';
import { ArticleSidebarFallback } from './_components/ArticleSidebarFallback';
import { ArticleSidebarIsland } from './_components/ArticleSidebarIsland';
import { RelatedPosts } from './_components/RelatedPosts';
import { headings, parseMarkdown } from './_lib/markdown';

type Params = { locale: string; slug: string };

/** W5/W97 (D14): hidden until counsel clears — nothing rendered, nothing wrapping it (B-6). */
const NEWSLETTER_ACTIVE = false;
/** W82: every "Request Workers →" lands on the Hire Workers form (T2 renders the anchor). */
const HIRE_FORM: Exclude<Href, string> = { pathname: '/hire-workers', hash: '#request-form' };
const FAQ_ID = 'faq';
const BAND_ID = 'blog-cta';
/** The page's own ids a body heading may never take (B-8). */
const RESERVED_IDS = [FAQ_ID, 'faq-list', BAND_ID, 'main'];

/** B-1: only the slugs written in that locale are prerendered (one EN, zero TR today). Any other
 *  slug still renders on demand (`dynamicParams` stays true — an article Operations publishes in
 *  Phase B needs no redeploy) and answers 404 through `findWritten` (W151). */
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) return [];
  const bundle = await getBundle(locale);
  return writtenPosts(getCollection(bundle, 'blog'), locale).flatMap((post) => {
    const slug = post.slug[locale];
    return slug ? [{ slug }] : [];
  });
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
  // W4/B-2: related and prev/next only once the blog is launched (six Turkish bodies).
  const written = writtenPosts(rows, locale);
  const launched = blogNavVisible(bundle);
  const related = launched ? relatedPosts(written, post) : [];
  const { prev, next } = launched ? prevNext(written, post) : { prev: null, next: null };
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
  const sidebar: ArticleSidebarProps = {
    headings: toc,
    tocLabel,
    readMinutes: post.readMinutes,
    // The package splits "≈ N min left" into the number and blogarticle.141; ScrollSpyToc fills
    // the literal {n} token itself (W85 string props).
    remaining: `≈ {n} ${t('blogarticle.141')}`,
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
    printLabel: sys('blog.article.print'),
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
        <Section tone="dark" className="relative overflow-hidden pb-32 md:pb-44">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-[6%] h-[340px] w-[340px] rounded-pill bg-[radial-gradient(circle,rgba(30,158,232,0.3),transparent_65%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-36 -left-16 h-[320px] w-[320px] rounded-pill bg-[radial-gradient(circle,rgba(22,163,74,0.16),transparent_65%)]"
          />
          <div className="container-site relative">
            <div className="mx-auto max-w-[980px]">
              <Breadcrumbs
                locale={locale}
                tone="dark"
                items={[
                  { name: t('blogarticle.022'), href: '/' },
                  { name: t('blogarticle.004'), href: '/blog' },
                  { name: title, href },
                ]}
              />
              <p className="mt-5 mb-4 flex flex-wrap gap-2.5">
                <span className="rounded-pill border border-sky/45 bg-blue/20 px-3.5 py-1 text-[12.5px] font-extrabold text-sky">
                  {t(post.categoryLabelId)}
                </span>
                {isWritten(post, other) ? (
                  <span
                    data-testid="article-lang-note"
                    className="rounded-pill border border-white/20 bg-white/10 px-3.5 py-1 text-[12.5px] font-bold text-white/75"
                  >
                    {locale === 'tr' ? t('blogarticle.143') : sys('blog.article.langNote')}
                  </span>
                ) : null}
              </p>
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="mt-0 mb-4 max-w-[880px] text-[27px] leading-[1.14] font-extrabold tracking-[-0.9px] md:text-[36px] lg:text-[44px] lg:leading-[1.1] xl:text-[33px]"
              >
                {title}
              </h1>
              <p className="text-body-lg mt-0 mb-6 max-w-[780px] font-semibold text-white/80">
                {excerpt}
              </p>
              <div className="flex items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-blue-safe text-[15px] font-extrabold text-white"
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

        {/* ---- Cover: overlaps the hero; a named placeholder, never the LCP slot (B-7, W103) ---- */}
        <div className="container-site relative z-[2] -mt-24 md:-mt-32">
          <div className="mx-auto max-w-[980px] overflow-hidden rounded-lg">
            <ImageSlot slot={`blog-cover-${post.key}`} alt="" width={980} height={430} />
          </div>
        </div>

        {/* ---- Body + sidebar ---- */}
        <Section tone="light">
          <div className="container-site">
            <div className="mx-auto grid max-w-[1180px] items-start gap-14 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="min-w-0">
                {/* ≤700 px: the TOC as a native disclosure — no JS (B-12) */}
                <details
                  data-testid="article-toc-mobile"
                  className="mb-5 overflow-hidden rounded-base border border-border-1 bg-white shadow-social md:hidden"
                >
                  <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-extrabold text-ink">{tocLabel}</span>
                      <span className="text-[12px] font-bold text-text-tertiary">
                        {`${sys('blog.article.sections', { n: toc.length })} · ${readTime}`}
                      </span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 font-extrabold text-blue-safe">
                      +
                    </span>
                  </summary>
                  <nav aria-label={tocLabel}>
                    <ul className="m-0 flex list-none flex-col px-2.5 pt-0 pb-2.5">
                      {toc.map((h) => (
                        <li key={h.id} className="border-t border-border-3">
                          <a
                            href={`#${h.id}`}
                            className="text-body-sm flex min-h-[46px] items-center px-2 font-bold text-text-secondary no-underline"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </details>

                {/* The printable region (B-16): a print-only title/byline + the body */}
                <div data-testid="article-body" className="print-isolate">
                  <div className="hidden print:block">
                    <p className="mt-0 mb-2 text-[22px] font-extrabold text-ink">{title}</p>
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
                        className="print-hidden"
                      >
                        {t('blogarticle.064')}
                      </ContactCta>
                    }
                  />
                </div>

                {/* FAQ (B-10): the design's section heading, then one FaqBlock → one FAQPage */}
                <h2 id={FAQ_ID} className={ARTICLE_H2}>
                  {t('blogarticle.065')}
                </h2>
                <FaqBlock
                  bundle={bundle}
                  locale={locale}
                  items={faq}
                  id="faq-list"
                  headingLevel={3}
                />

                {/* Author box (blogarticle.066–068; 068 is legal-flagged — verbatim) */}
                <div
                  data-testid="article-author"
                  className="mt-9 flex flex-wrap items-center gap-4 rounded-base border border-tint-border bg-pale-1 px-7 py-6"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-blue-safe text-[18px] font-extrabold text-white"
                  >
                    JA
                  </span>
                  <div className="min-w-[220px] flex-1">
                    <p className="mt-0 mb-1 font-extrabold text-ink">{t('blogarticle.066')}</p>
                    <p className="text-body-sm m-0 text-text-secondary">{t('blogarticle.067')}</p>
                  </div>
                  <p className="m-0 inline-flex items-center gap-2 rounded-pill border border-tint-border bg-white px-4 py-2 text-[13px] font-extrabold whitespace-nowrap text-blue-safe">
                    <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
                    {t('blogarticle.068')}
                  </p>
                </div>
              </div>

              {/* Sidebar: the lazy island (TOC, share, print — B-13) + the CTA card (≥701 px) */}
              <div
                data-testid="article-sidebar"
                className="flex flex-col gap-4 lg:sticky lg:top-24"
              >
                <ArticleSidebarIsland
                  {...sidebar}
                  fallback={<ArticleSidebarFallback {...sidebar} />}
                />
                <div className="rounded-base bg-gradient-to-br from-blue-safe to-navy p-6 text-white max-md:hidden">
                  <p className="mt-0 mb-1.5 text-[17px] leading-snug font-extrabold xl:text-[12.75px]">
                    {t('blogarticle.071')}
                  </p>
                  <p className="text-body-sm mt-0 mb-3.5">{t('blogarticle.072')}</p>
                  <ContactCta
                    placement="page_cta"
                    href={HIRE_FORM}
                    prefetch={false}
                    variant="secondary"
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

      {/* ---- Related + prev/next: nothing below the W4 threshold (B-2) ---- */}
      <RelatedPosts bundle={bundle} locale={locale} related={related} prev={prev} next={next} />

      {/* ---- Newsletter: hidden in Phase A, nothing rendered (W5/W97) ---- */}
      <NewsletterBand bundle={bundle} locale={locale} active={NEWSLETTER_ACTIVE} />

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
          />
        </div>
      </Section>

      {/* Progress bar, back-to-top (phones) and the sticky bar (lg+) — on the first scroll (B-13) */}
      <ScrollEnhancementsLoader
        backToTopLabel={sys('blog.article.backToTop')}
        stickyBar={{
          message: t('blogarticle.084'),
          hideNearId: BAND_ID,
          ctas: [
            {
              label: t('blogarticle.085'),
              href: wa(sys('blog.whatsapp.article', { title })),
              external: true,
              variant: 'success',
            },
            { label: t('blogarticle.073'), href: HIRE_FORM, variant: 'primary' },
          ],
        }}
      />
    </>
  );
}
