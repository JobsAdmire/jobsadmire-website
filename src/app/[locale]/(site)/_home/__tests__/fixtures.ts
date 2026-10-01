import { readFileSync } from 'node:fs';
import type { BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { BundleSchema, type Bundle } from '../../../../../../contract/website-bundle.v1';

/** The committed LOCAL bundle, parsed: the page's real copy and collections. `readFileSync` is the
 *  sanctioned bypass of the D23 import rule (ESLint forbids importing `content/local/*`). */
export function homeBundle(locale: Locale): Bundle {
  return BundleSchema.parse(
    JSON.parse(readFileSync(`src/content/local/bundle.${locale}.json`, 'utf8')),
  );
}

/** A copy of `bundle` with extra collection rows — the FIXTURE_ONLY `stories`/`representatives`,
 *  a published founder, written blog bodies — for the render-by-data branches Phase A never shows.
 *  A new object, so `getCollection`'s per-bundle cache starts empty. */
export function withCollections(bundle: Bundle, collections: Bundle['collections']): Bundle {
  return { ...bundle, collections: { ...bundle.collections, ...collections } };
}

/** A `blog` row that satisfies `BlogPostSchema` (body present exactly when written); its
 *  category label is the package's own `home.265` ("Recruitment"), as the importer emits. */
export function blogPost(
  key: string,
  publishedAt: string,
  written: { tr: boolean; en: boolean },
): BlogPost {
  const perLocale = (tr: string, en: string) => ({
    tr: written.tr ? tr : null,
    en: written.en ? en : null,
  });
  return {
    key,
    slug: perLocale(`${key}-tr`, key),
    title: perLocale(`${key} TR`, `${key} EN`),
    excerpt: perLocale('Özet', 'Excerpt'),
    category: 'recruitment',
    categoryLabelId: 'home.265',
    author: 'JobsAdmire',
    publishedAt,
    readMinutes: 5,
    hasBody: written,
    body: perLocale('# tr', '# en'),
  };
}
