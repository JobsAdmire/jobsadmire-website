import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBlogBundle, getBlogFeed, redirectTarget } from '@/content/blog';
import { getCollection, type BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { articleAlternates, articleHref, findWritten, writtenPosts } from '../_lib/posts';
import { ArticleView } from './_components/ArticleView';
import { articleOgImage, articleSeo, authorOf } from './_lib/article';

type Params = { locale: string; slug: string };

/** B-1: only the slugs written in their locale are prerendered. Any other slug still renders on
 *  demand (`dynamicParams` stays true — an article Operations publishes needs no redeploy, W248)
 *  and answers 404 through `findWritten` (W151), or 308s when the feed says the slug moved.
 *  Bottom up (Next's "generate params from the bottom up"): complete `{ locale, slug }` pairs for
 *  every locale. Next 16.3.5 still calls this once per parent `[locale]` and merges each item over
 *  the parent, but a per-locale `[]` (TR on the LOCAL bundle) would pass `{ locale: 'tr' }` through
 *  WITHOUT a slug, and one incomplete combination stops Next prerendering ANY path of the route —
 *  the EN article included (T12 proof; `static-params.test.ts` models the expansion). */
export async function generateStaticParams(): Promise<{ locale: Locale; slug: string }[]> {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const bundle = await getBlogBundle(locale);
      return writtenPosts(getCollection(bundle, 'blog'), locale).flatMap((post) => {
        const slug = post.slug[locale];
        return slug ? [{ locale, slug }] : [];
      });
    }),
  );
  return perLocale.flat();
}

/** The article behind `slug`, or — W248 — a 308 to its current slug when Operations renamed it
 *  (the feed's `redirects`, one hop, only onto a written article), or a 404. Shared by the
 *  metadata and the page so both answer the same way. */
async function resolveArticle(
  locale: Locale,
  slug: string,
): Promise<{ bundle: Bundle; rows: BlogPost[]; post: BlogPost }> {
  const [bundle, feed] = await Promise.all([getBlogBundle(locale), getBlogFeed()]);
  const rows = getCollection(bundle, 'blog');
  const post = findWritten(rows, locale, slug);
  if (post) return { bundle, rows, post };
  const to = redirectTarget(feed.redirects, rows, locale, slug);
  if (to)
    permanentRedirect(
      getPathname({ locale, href: { pathname: '/blog/[slug]', params: { slug: to } } }),
    );
  notFound();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [{ bundle, post }, sys] = await Promise.all([
    resolveArticle(locale, slug),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const href = articleHref(post, locale);
  if (!href) notFound();
  const seo = articleSeo(post, locale, (title) => sys('blog.article.metaTitle', { title }));
  // W124/B-15: `blogArticle` is a template record without SEO fields, so the article's own
  // title, description, canonical (from `href`) and alternates win; hreflang only where it is
  // written. W248: the post's SEO overrides, its cover as the share image (else the index's,
  // W169), `modifiedTime` from its last edit; indexable (the record's `robots`).
  return buildMetadata({
    locale,
    href,
    bundle,
    pageKey: 'blogArticle',
    fallbackTitle: seo.title,
    fallbackDescription: seo.description,
    alternates: articleAlternates(post),
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [authorOf(post, makeT(bundle), locale).name],
      images: [articleOgImage(post, locale)],
    },
  });
}

export default async function BlogArticle({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const { bundle, rows, post } = await resolveArticle(locale, slug);
  return <ArticleView bundle={bundle} locale={locale} post={post} rows={rows} />;
}
