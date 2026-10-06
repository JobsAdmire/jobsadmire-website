import { getTranslations } from 'next-intl/server';
import { makeT, makeTf, metricValues } from '@/content/pure';
import { getRateConfig, readMinutesOf, type BlogPost } from '@/content/collections';
import { videosOf } from '@/content/videos';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { ContactCta } from '@/design/blocks/ContactCta';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { NewsletterBand } from '@/design/blocks/NewsletterBand';
import { Section } from '@/design/primitives/Section';
import { liquidSizes } from '@/design/zoom';
import type { Href } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { formatDate } from '@/lib/format/date/formatDate';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import { formatInt } from '@/lib/format/money';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { articleJsonLd, videoObjectJsonLd } from '@/lib/seo/jsonld';
import { absoluteFileUrl, absoluteUrl } from '@/lib/seo/routes';
import type { Bundle } from '../../../../../../../contract/website-bundle.v1';
import {
  articleHref,
  isWritten,
  otherLocale,
  prevNext,
  relatedPosts,
  writtenPosts,
} from '../../_lib/posts';
import { articleOgImage, authorOf } from '../_lib/article';
import { headings, parseMarkdown } from '../_lib/markdown';
import { remainingText } from '../_lib/sidebar';
import { ARTICLE_H2_SECTION, ArticleBody } from './ArticleBody';
import { ArticleCrumbs } from './ArticleCrumbs';
import { ArticleScrollEnhancementsLoader } from './ArticleScrollEnhancementsLoader';
import type { ArticleSidebarProps } from './ArticleSidebar';
import { ArticleSidebarFallback } from './ArticleSidebarFallback';
import { ArticleSidebarIsland } from './ArticleSidebarIsland';
import { CategoryCover } from './CategoryCover';
import { CollapsibleSection } from './CollapsibleSection';
import { MobileToc } from './MobileToc';
import { PreviewBar } from './PreviewBar';
import { RelatedPosts } from './RelatedPosts';

/** The owner switched the `newsletter` form on (2026-10-05): the band shows its own inline form
 *  (`src/forms/newsletter/`, success → /tesekkurler?form=newsletter) under the design's proof line. */
const NEWSLETTER_ACTIVE = true;
/** W82: every "Request Workers →" lands on the Hire Workers form (T2 renders the anchor). */
const HIRE_FORM: Exclude<Href, string> = { pathname: '/hire-workers', hash: '#request-form' };
const FAQ_ID = 'faq';
const BAND_ID = 'blog-cta';
/** The page's own ids a body heading may never take (B-8). */
const RESERVED_IDS = [FAQ_ID, 'faq-list', BAND_ID, 'main'];
/** The cover box's rendered widths: the 980 px column (735 px from 1101, D19), the screen below,
 *  growing with the liquid desktop past 1440 (`liquidSizes`, W231). */
const COVER_SIZES = liquidSizes(735, '(min-width: 1101px) 735px, (min-width: 1029px) 980px, 100vw');

/**
 * One blog article (B-1…B-16), shared by `/blog/[slug]` and the draft preview (`/blog/preview`,
 * W248): the hero (crumbs, pills, the h1 — the LCP element — and the byline), the cover, the body
 * with its TOC sidebar, the FAQ (the post's own, or the LOCAL article's generic four), the author
 * box, related + previous/next from `rows`, the newsletter and closing bands. `preview` adds the
 * "not published" bar and leaves out the JSON-LD (the page is noindex) — the BlogPosting and one
 * VideoObject per video the body shows (W249). The caller has resolved the post: it is written in
 * `locale` (a slug, a title and a body).
 */
export async function ArticleView({
  bundle,
  locale,
  post,
  rows,
  preview = false,
}: {
  bundle: Bundle;
  locale: Locale;
  post: BlogPost;
  rows: readonly BlogPost[];
  preview?: boolean;
}) {
  const sys = await getTranslations({ locale, namespace: 'sys' });
  const href = articleHref(post, locale);
  const title = post.title[locale];
  const body = post.body[locale];
  if (!href || !title || !body) return null;
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const values = metricValues(bundle, locale);
  const excerpt = post.excerpt[locale] ?? '';
  const blocks = parseMarkdown(body, RESERVED_IDS);
  const videos = videosOf(blocks);
  // W248: the post's own FAQ when the feed sends one (none = no FAQ block and no FAQPage node);
  // the LOCAL article, which carries no `faq`, keeps the four generic Q&As (B-10: A1 and Q3 have
  // no package id; their numbers come from data, D17).
  const faq: FaqItem[] = post.faq
    ? post.faq[locale].map((item, i) => ({ id: `q${i + 1}`, q: item.q, a: item.a }))
    : [
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
  // The design's TOC: the body's sections + the FAQ (its own short label, blogarticle.126).
  const toc = [
    ...headings(blocks),
    ...(faq.length > 0 ? [{ id: FAQ_ID, text: t('blogarticle.126') }] : []),
  ];
  const tocLabel = t('blogarticle.024');
  const url = absoluteUrl(locale, href);
  const other = otherLocale(locale);
  const author = authorOf(post, t, locale);
  const minutes = readMinutesOf(post, locale);
  const readTime = formatReadMinutes(minutes, locale);
  const byline = `${formatDate(post.publishedAt, locale)} · ${readTime}`;
  // W248: related and previous/next come from the written articles of this locale only (same
  // category first) — no "yakında" cards; fewer posts, fewer cards, none at all for one post.
  const written = writtenPosts(rows, locale);
  const related = relatedPosts(written, post);
  const { prev, next } = prevNext(written, post);
  const categoryLabel = t(post.categoryLabelId);
  // W76/W95: static prefills only — page copy and the article's own title, never visitor input.
  const wa = (tail: string) =>
    waLink(bundle.settings.whatsappNumber, `${sys('whatsapp.prefill')}${tail}`);
  const remainingTemplate = `≈ {n} ${t('blogarticle.141')}`;
  const sidebar: ArticleSidebarProps = {
    headings: toc,
    tocLabel,
    readMinutes: minutes,
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
      {preview ? <PreviewBar locale={locale} /> : null}
      <article>
        {preview ? null : (
          <>
            <JsonLd
              data={articleJsonLd({
                headline: title,
                description: excerpt,
                url,
                image: articleOgImage(post, locale),
                datePublished: post.publishedAt,
                dateModified: post.updatedAt,
                authorName: author.name,
                authorType: author.person ? 'Person' : 'Organization',
                publisherSettings: bundle.settings,
                locale,
              })}
            />
            {videos.map(({ key, title: name, video }) => (
              <JsonLd
                key={key}
                data={videoObjectJsonLd({
                  name,
                  description: excerpt,
                  thumbnailUrl: absoluteFileUrl(video.poster),
                  uploadDate: post.publishedAt,
                  durationSec: video.durationSec,
                  contentUrl: absoluteFileUrl(video.src),
                  inLanguage: video.lang,
                })}
              />
            ))}
          </>
        )}

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
                  {author.initials}
                </span>
                <p className="m-0">
                  <strong className="text-body block font-extrabold text-white">
                    {author.name}
                  </strong>
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
              photo={
                post.cover ? { src: post.cover.url, alt: post.coverAlt?.[locale] ?? '' } : null
              }
              sizes={COVER_SIZES}
              preload
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
                  sub={`${sys('blog.article.sections', { n: toc.length })} · ${remainingText(minutes, remainingTemplate)}`}
                />

                {/* The printable region (B-16): a print-only title/byline + the body */}
                <div data-testid="article-body" className="print-isolate">
                  <div className="hidden print:block">
                    <p className="mt-0 mb-2 text-[22px] xl:text-[16.5px] font-extrabold text-ink">
                      {title}
                    </p>
                    <p className="text-body-sm mt-0 mb-6 text-text-tertiary">{`${author.name} · ${byline}`}</p>
                  </div>
                  <ArticleBody
                    blocks={blocks}
                    locale={locale}
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
                    design's separate-card face (rotating ⌄) → one FAQPage. A post without FAQs has
                    neither (W248). */}
                {faq.length > 0 ? (
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
                ) : null}

                {/* Author box: the named author (W248 — "Written by" + their title), else the
                    editorial team (blogarticle.066–067); the licence badge (blogarticle.068,
                    legal-flagged — verbatim) either way */}
                <div
                  data-testid="article-author"
                  className="mt-9 flex flex-wrap items-center gap-[18px] xl:gap-[13.5px] rounded-base border border-tint-border bg-pale-1 px-7 py-6 max-md:mt-7 max-md:grid max-md:grid-cols-[42px_1fr] max-md:gap-x-3 max-md:gap-y-1 max-md:px-[18px] max-md:py-4"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-gradient-to-br from-[#1E9EE8] to-[#146fa1] text-[18px] max-md:h-[42px] max-md:w-[42px] max-md:text-[14.5px] xl:text-[13.5px] font-extrabold text-white"
                  >
                    {author.initials}
                  </span>
                  <div className="min-w-[220px] flex-1 max-md:min-w-0">
                    <p className="mt-0 mb-1 font-extrabold text-ink max-md:mb-0 max-md:text-[14.5px]">
                      {author.person
                        ? sys('blog.article.writtenBy', { name: author.name })
                        : t('blogarticle.066')}
                    </p>
                    {author.bio ? (
                      <p className="text-body-sm m-0 text-text-secondary max-md:mt-[3px] max-md:text-[13px] max-md:leading-[1.55]">
                        {author.bio}
                      </p>
                    ) : null}
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
