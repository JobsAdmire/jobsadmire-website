import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection, type BlogPost } from '@/content/collections';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import { ALL, countLabel, matchKeys, resultLine } from '../_lib/filter';
import {
  articleAlternates,
  articleHref,
  categoryOptions,
  filterItems,
  findWritten,
  indexPosts,
  isWritten,
  otherLocale,
  PAGE_SIZE,
  prevNext,
  relatedPosts,
  writtenPosts,
} from '../_lib/posts';

// R56: the committed bundles are read with readFileSync, never imported (the ESLint rule
// forbids `content/local` under src/**).
const load = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
    ),
  );

/** A full `BlogPost` row (the T0b schema) — override what a case needs. */
const post = (over: Partial<BlogPost> & { key: string }): BlogPost => ({
  slug: { tr: `${over.key}-tr`, en: over.key },
  title: { tr: 'Başlık', en: 'Title' },
  excerpt: { tr: 'Özet', en: 'Excerpt' },
  category: 'workPermits',
  categoryLabelId: 'home.263',
  author: 'JobsAdmire',
  publishedAt: '2026-01-01',
  readMinutes: 5,
  hasBody: { tr: true, en: true },
  body: { tr: 'metin', en: 'text' },
  ...over,
});

describe('the committed bundles (W4, W28, W64)', () => {
  it('EN has exactly one written article, TR has none', () => {
    expect(writtenPosts(getCollection(load('en'), 'blog'), 'en').map((p) => p.key)).toEqual([
      'turkey-work-permit-process-employer-guide',
    ]);
    expect(writtenPosts(getCollection(load('tr'), 'blog'), 'tr')).toEqual([]);
  });

  it('findWritten: the EN slug resolves; its TR slug, a dropped index-only slug and an unknown slug do not (B-1)', () => {
    const en = getCollection(load('en'), 'blog');
    const tr = getCollection(load('tr'), 'blog');
    expect(findWritten(en, 'en', 'turkey-work-permit-process-employer-guide')?.key).toBe(
      'turkey-work-permit-process-employer-guide',
    );
    expect(findWritten(tr, 'tr', 'yabanci-isciler-calisma-izni-rehberi')).toBeNull();
    expect(findWritten(en, 'en', 'hiring-from-pakistan-turkish-employers')).toBeNull();
    expect(findWritten(en, 'en', 'does-not-exist')).toBeNull();
  });

  it('the index lists the written articles only (W248): EN the one article, TR none (the W6 empty state)', () => {
    const en = indexPosts(getCollection(load('en'), 'blog'), 'en');
    const tr = indexPosts(getCollection(load('tr'), 'blog'), 'tr');
    expect(en.map((p) => p.key)).toEqual(['turkey-work-permit-process-employer-guide']);
    expect(tr).toEqual([]);
    // W250: two rows of four to a page
    expect(PAGE_SIZE).toBe(8);
  });

  it('the written article advertises only its own locale — no TR body, no TR hreflang (B-15)', () => {
    const [article] = writtenPosts(getCollection(load('en'), 'blog'), 'en');
    expect(articleAlternates(article)).toEqual({
      en: {
        pathname: '/blog/[slug]',
        params: { slug: 'turkey-work-permit-process-employer-guide' },
      },
    });
  });
});

describe('the pure helpers', () => {
  const a = post({
    key: 'a',
    publishedAt: '2026-03-01',
    category: 'recruitment',
    categoryLabelId: 'home.265',
  });
  const b = post({ key: 'b', publishedAt: '2026-02-01' });
  const c = post({
    key: 'c',
    publishedAt: '2026-02-01',
    hasBody: { tr: false, en: true },
    body: { tr: null, en: 'x' },
  });
  const d = post({
    key: 'd',
    publishedAt: '2026-01-01',
    slug: { tr: null, en: 'd' },
    title: { tr: null, en: 'D' },
  });
  const t = (id: string) => `<${id}>`;

  it('isWritten needs a body, a slug and a title in the locale (CONTENT-MODEL § Blog)', () => {
    expect(isWritten(c, 'tr')).toBe(false);
    expect(isWritten(c, 'en')).toBe(true);
    expect(isWritten(d, 'tr')).toBe(false);
    expect(otherLocale('tr')).toBe('en');
    expect(otherLocale('en')).toBe('tr');
  });

  it('writtenPosts: newest first, a same-day tie keeps the collection order', () => {
    expect(writtenPosts([d, c, b, a], 'en').map((p) => p.key)).toEqual(['a', 'c', 'b', 'd']);
    expect(writtenPosts([d, c, b, a], 'tr').map((p) => p.key)).toEqual(['a', 'b']);
  });

  it('relatedPosts: same category first, never the post itself, capped (B-2)', () => {
    const written = writtenPosts([a, b, c, d], 'en'); // a, b, c, d
    expect(relatedPosts(written, b).map((p) => p.key)).toEqual(['c', 'd', 'a']);
    expect(relatedPosts(written, b, 1).map((p) => p.key)).toEqual(['c']);
  });

  it('prevNext walks the newest-first list', () => {
    const written = writtenPosts([a, b, c, d], 'en');
    expect(prevNext(written, c)).toMatchObject({ prev: { key: 'b' }, next: { key: 'd' } });
    expect(prevNext(written, a).prev).toBeNull();
    expect(prevNext(written, post({ key: 'zzz' }))).toEqual({ prev: null, next: null });
  });

  it('categoryOptions: distinct categories in first-seen order, labels through t()', () => {
    expect(categoryOptions(writtenPosts([a, b, c], 'en'), t)).toEqual([
      { value: 'recruitment', label: '<home.265>' },
      { value: 'workPermits', label: '<home.263>' },
    ]);
  });

  it('articleHref / articleAlternates follow the per-locale slugs (D16)', () => {
    expect(articleHref(b, 'tr')).toEqual({ pathname: '/blog/[slug]', params: { slug: 'b-tr' } });
    expect(articleHref(d, 'tr')).toBeNull();
    expect(articleAlternates(b)).toEqual({
      tr: { pathname: '/blog/[slug]', params: { slug: 'b-tr' } },
      en: { pathname: '/blog/[slug]', params: { slug: 'b' } },
    });
    expect(articleAlternates(c)).toEqual({
      en: { pathname: '/blog/[slug]', params: { slug: 'c' } },
    });
  });

  it('filterItems lower-cases title + excerpt + category in the locale; matchKeys filters them (B-5)', () => {
    const x = post({ key: 'x', title: { tr: 'İŞÇİ Rehberi', en: 'X' } });
    const items = filterItems([x, a], 'tr', t);
    expect(items[0]).toEqual({
      key: 'x',
      category: 'workPermits',
      text: 'işçi rehberi özet <home.263>',
    });
    expect(matchKeys(items, ' REHBER ', ALL, 'tr')).toEqual(['x']);
    expect(matchKeys(items, '', 'recruitment', 'tr')).toEqual(['a']);
    expect(matchKeys(items, '', ALL, 'tr')).toEqual(['x', 'a']);
    expect(matchKeys(items, 'nothing', ALL, 'tr')).toEqual([]);
  });

  it('indexPosts: the written articles only, newest first; the newest flagged post leads (W248)', () => {
    expect(indexPosts([d, c, b, a], 'tr').map((p) => p.key)).toEqual(['a', 'b']);
    expect(indexPosts([d, c, b, a], 'en').map((p) => p.key)).toEqual(['a', 'c', 'b', 'd']);
    const flagged = { ...b, featured: true };
    expect(indexPosts([d, c, flagged, a], 'en').map((p) => p.key)).toEqual(['b', 'a', 'c', 'd']);
    expect(indexPosts([], 'en')).toEqual([]);
  });

  it("resultLine: the query, else the topic, else the total — the design's three lines", () => {
    const forms = { one: '{n} article', other: '{n} articles', forQuote: 'for “' };
    expect(resultLine({ shown: 3, total: 22, query: ' izin ', topic: 'Mevzuat', forms })).toBe(
      '3 articles for “izin”',
    );
    expect(resultLine({ shown: 1, total: 22, query: '', topic: 'Compliance', forms })).toBe(
      '1 article · Compliance',
    );
    expect(resultLine({ shown: 5, total: 22, query: '  ', topic: null, forms })).toBe(
      '22 articles',
    );
  });

  it('countLabel picks the singular only for exactly one', () => {
    const forms = { one: '{n} article', other: '{n} articles' };
    expect(countLabel(1, forms)).toBe('1 article');
    expect(countLabel(3, forms)).toBe('3 articles');
    expect(countLabel(0, forms)).toBe('0 articles');
  });
});
