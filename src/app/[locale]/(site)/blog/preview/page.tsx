import type { Metadata } from 'next';
import { cookies, draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fetchBlogPreview, getBlogBundle, type BlogPreviewResult } from '@/content/blog';
import { getCollection } from '@/content/collections';
import { Section } from '@/design/primitives/Section';
import { routing, type Locale } from '@/i18n/routing';
import { BLOG_PREVIEW_COOKIE } from '@/lib/blog-preview';
import { ArticleView } from '../[slug]/_components/ArticleView';
import { PreviewBar } from '../[slug]/_components/PreviewBar';

/** Per request, never cached: a draft is read with the visitor's own preview token. */
export const dynamic = 'force-dynamic';

type Params = { locale: string };

/** Never indexed, never followed — a draft is not content (W248). */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const sys = await getTranslations({ locale, namespace: 'sys' });
  return {
    title: sys('blog.preview.metaTitle'),
    robots: { index: false, follow: false },
  };
}

type Failure = Exclude<BlogPreviewResult['status'], 'ok'>;

/** The friendly answer when there is no draft to show: an expired or malformed link, a language
 *  with no text yet, or Operations out of reach — each says what to do, and offers the way out
 *  of draft mode. */
async function PreviewMessage({ locale, status }: { locale: Locale; status: Failure }) {
  const sys = await getTranslations({ locale, namespace: 'sys' });
  return (
    <>
      <PreviewBar locale={locale} />
      <Section tone="light">
        <div className="container-site">
          <div
            data-testid="blog-preview-message"
            data-status={status}
            className="mx-auto max-w-[720px]"
          >
            <h1
              data-testid="page-h1"
              className="text-h2 max-[601px]:text-[32px] max-[601px]:tracking-[-0.6px]"
            >
              {sys(`blog.preview.${status}.title`)}
            </h1>
            <p className="mt-3 text-body-lg text-text-secondary">
              {sys(`blog.preview.${status}.body`)}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

/**
 * `/blog/preview` and `/en/blog/preview` (W248, docs/INTEGRATIONS.md I21): the draft behind the
 * preview token that `/api/blog-preview` stored, fetched from Operations per request
 * (`GET /api/website/v1/blog/preview/:token`, `no-store`) and rendered exactly as the published
 * article will be, under the "Preview — not published" bar. Without draft mode or a token, the
 * invalid-link message.
 */
export default async function BlogPreview({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [draft, jar] = await Promise.all([draftMode(), cookies()]);
  const token = draft.isEnabled ? (jar.get(BLOG_PREVIEW_COOKIE)?.value ?? '') : '';
  const result: BlogPreviewResult = token
    ? await fetchBlogPreview(token, locale)
    : { status: 'invalid' };
  if (result.status !== 'ok') return <PreviewMessage locale={locale} status={result.status} />;
  const bundle = await getBlogBundle(locale);
  return (
    <ArticleView
      bundle={bundle}
      locale={locale}
      post={result.post}
      rows={getCollection(bundle, 'blog')}
      preview
    />
  );
}
