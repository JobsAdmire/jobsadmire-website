import type { Metadata } from 'next';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBundle, makeT, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { EmptyState } from '@/design/blocks/EmptyState';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { NewsletterBand } from '@/design/blocks/NewsletterBand';
import { PostCard } from '@/design/blocks/PostCard';
import { CheckIcon } from '@/design/chrome/icons';
import { buttonClassName } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { getPathname, type Href } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { formatInt } from '@/lib/format/money';
import { buildMetadata } from '@/lib/seo/metadata';
import { HeroArt } from './_components/HeroArt';
import { PostFilterLoader } from './_components/PostFilterLoader';
import { PostList } from './_components/PostList';
import { RotatingWord } from './_components/RotatingWord';
import { RotationToggle } from './_components/RotationToggle';
import { ScrollEnhancementsLoader } from './_components/ScrollEnhancementsLoader';
import { POST_LIST_ID } from './_lib/filter';
import {
  categoryOptions,
  filterItems,
  otherLocale,
  splitFeatured,
  TOOLS_MIN_POSTS,
  writtenPosts,
} from './_lib/posts';

/** W5/W97 (D14): the newsletter band stays hidden until counsel clears — it renders nothing and
 *  nothing wraps it; its form (checkbox consent + double opt-in, W79) lands with its activation. */
const NEWSLETTER_ACTIVE = false;

/** W82: the design's "Request Workers →" lands on the Hire Workers form (T2 renders the anchor). */
const HIRE_FORM: Exclude<Href, string> = { pathname: '/hire-workers', hash: '#request-form' };

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
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const rows = getCollection(bundle, 'blog');
  const written = writtenPosts(rows, locale);
  const { featured, rest } = splitFeatured(written);
  const other = otherLocale(locale);
  // W6: a locale with no written article links to the other locale's index when that one has
  // articles. The path is already localised (`/en/blog`), so it goes through next/link, as the
  // chrome's LanguageSwitcher does — next-intl's Link would localise it to this locale.
  const otherIndex =
    writtenPosts(rows, other).length > 0 ? getPathname({ locale: other, href: '/blog' }) : null;
  const words = sys('blog.hero.words').split('|');
  const whatsapp = waLink(
    bundle.settings.whatsappNumber,
    `${sys('whatsapp.prefill')}${sys('blog.whatsapp.consult')}`,
  );

  return (
    <>
      {/* ---- Hero: crumbs (W109), the rotating h1 (B-4 — the LCP element, B-7), sub, ticks ---- */}
      <Section tone="dark" className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <ImageSlot slot="blog-hero" alt="" width={1440} height={520} />
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
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Breadcrumbs
                locale={locale}
                tone="dark"
                items={[
                  { name: t('blog.022'), href: '/' },
                  { name: t('blog.004'), href: '/blog' },
                ]}
              />
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="text-h1 mt-4 mb-4 max-w-[760px] leading-[1.02] max-md:text-[30px] max-md:leading-[1.08] max-md:tracking-[-1px]"
              >
                {sys.rich('blog.hero.title', {
                  pre: t('blog.095'),
                  word: () => <RotatingWord words={words} />,
                })}
              </h1>
              <p className="text-body-lg mt-0 mb-6 max-w-[620px] font-semibold text-white/80">
                {t('blog.096')}
              </p>
              <ul className="m-0 flex max-w-[600px] list-none flex-wrap gap-x-8 gap-y-3 p-0">
                <li className="text-body flex items-start gap-2.5 font-semibold text-white/75">
                  <CheckIcon size={16} className="mt-1 shrink-0 text-success" />
                  <span>
                    {t('blog.023')}{' '}
                    <strong className="font-extrabold text-white">{t('blog.024')}</strong>
                  </span>
                </li>
                {/* QA W221 BLOG-04: the phone strip below repeats the two-languages fact, so this
                    tick hides ≤ 700 whenever the strip renders (a locale with no article has no
                    strip, and keeps the tick). */}
                <li
                  className={`text-body flex items-start gap-2.5 font-semibold text-white/75${written.length > 0 ? ' max-md:hidden' : ''}`}
                >
                  <CheckIcon size={16} className="mt-1 shrink-0 text-success" />
                  <span>
                    <strong className="font-extrabold text-white">{t('blog.025')}</strong>{' '}
                    {t('blog.026')}
                  </span>
                </li>
              </ul>
              <div className="mt-5">
                <RotationToggle pauseLabel={sys('marquee.pause')} playLabel={sys('marquee.play')} />
              </div>
              {/* The design's phone stats strip: the written count + the two languages; its
                  cadence chip (blog.093/094) has no data row (B-3). Nothing when there is no article. */}
              {written.length > 0 ? (
                <p className="text-body-sm mt-4 mb-0 flex flex-wrap items-center gap-x-3 gap-y-1 font-bold text-white/65 md:hidden">
                  <span>
                    <strong className="font-extrabold text-white">
                      {formatInt(written.length, locale)}
                    </strong>{' '}
                    {/* QA W221 BLOG-02: "1 guide" / "n guides" (ICU plural; TR invariant) —
                        blog.091 is the design's fixed plural "Guides" */}
                    {sys('blog.index.guides', { n: written.length })}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    <strong className="font-extrabold text-sky">EN·TR</strong> {t('blog.092')}
                  </span>
                </p>
              ) : null}
            </div>
            <HeroArt bundle={bundle} locale={locale} featured={featured} />
          </div>
        </div>
      </Section>

      {/* ---- Written articles only (W4): the tools (B-5, dormant), the featured card, the grid —
              or the W6 empty state with the other locale's index ---- */}
      <Section tone="light" id="articles">
        <div className="container-site">
          {featured ? (
            <>
              {rest.length >= TOOLS_MIN_POSTS ? (
                <div data-testid="blog-tools-slot" className="mb-8 min-h-[96px]">
                  <PostFilterLoader
                    listId={POST_LIST_ID}
                    locale={locale}
                    items={filterItems(rest, locale, t)}
                    categories={categoryOptions(rest, t)}
                    labels={{
                      search: sys('blog.tools.search'),
                      placeholder: t('blog.088'),
                      clear: t('blog.033'),
                      reset: t('blog.089'),
                      all: t('blog.076'),
                      topic: t('blog.086'),
                      pickTopic: t('blog.087'),
                      close: t('blog.075'),
                      noResults: t('blog.035'),
                      resultsOne: String(sys.raw('blog.tools.results.one')),
                      resultsOther: String(sys.raw('blog.tools.results.other')),
                    }}
                  />
                </div>
              ) : null}
              <div data-testid="blog-featured" className="mb-10 lg:max-w-[860px]">
                <PostCard
                  bundle={bundle}
                  locale={locale}
                  post={featured}
                  variant="featured"
                  headingLevel={2}
                />
              </div>
              <PostList
                bundle={bundle}
                locale={locale}
                posts={rest}
                heading={sys('blog.index.latest')}
              />
            </>
          ) : (
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
          )}
        </div>
      </Section>

      {/* ---- Newsletter: hidden in Phase A, nothing rendered, nothing wrapping it (W5/W97) ---- */}
      <NewsletterBand bundle={bundle} locale={locale} active={NEWSLETTER_ACTIVE} />

      {/* ---- Closing band (blog.042–046): the gradient card; ticks phone-only (blog.044 legal,
              verbatim; blog.045 re-authored with {homepageReplyHours} → makeTf, D17) ---- */}
      <Section tone="band">
        <div className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            id="blog-cta"
            tone="gradient"
            titleId="blog.042"
            bodyId="blog.043"
            primary={{ label: t('blog.046'), href: HIRE_FORM, variant: 'secondary' }}
            secondary={{ label: t('home.221'), href: whatsapp, external: true }}
            ticks={[tf('blog.044'), tf('blog.045')]}
          />
        </div>
      </Section>

      {/* The reading-progress bar, loaded on the first scroll (B-13). */}
      <ScrollEnhancementsLoader />
    </>
  );
}
