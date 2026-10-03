import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key the two blog routes read (W9/W23) — both files carry each one. */
const KEYS = [
  'seo.blog.title',
  'seo.blog.description',
  'blog.hero.title',
  'blog.hero.words',
  'blog.index.latest',
  'blog.index.guides', // QA W221 BLOG-02: the phone strip's count noun, ICU plural in EN
  'blog.empty.title',
  'blog.empty.body',
  'blog.empty.cta',
  'blog.tools.search',
  'blog.tools.results.one',
  'blog.tools.results.other',
  'blog.article.metaTitle',
  'blog.article.langNote',
  'blog.article.sections',
  'blog.article.copyFailed',
  'blog.article.print',
  'blog.article.backToTop',
  'blog.faq.a1',
  'blog.faq.q3',
  'blog.whatsapp.article',
  'blog.whatsapp.consult',
  'blog.whatsapp.permit',
] as const;

/** Legitimately identical in both files: a pure template and the design's mixed-language pill. */
const SAME = new Set<string>(['blog.article.metaTitle', 'blog.article.langNote']);

const read = (messages: { sys: unknown }, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      messages.sys,
    );

const leaves = (node: unknown, prefix: string): string[] =>
  typeof node === 'string'
    ? [prefix]
    : Object.entries((node ?? {}) as Record<string, unknown>).flatMap(([k, v]) =>
        leaves(v, `${prefix}.${k}`),
      );

describe('sys.blog.* and sys.seo.blog.* (T12)', () => {
  it.each(KEYS)('%s exists, non-empty, in both locales', (key) => {
    const e = read(en, key);
    const t = read(tr, key);
    expect(typeof e).toBe('string');
    expect(typeof t).toBe('string');
    expect((e as string).length).toBeGreaterThan(0);
    expect((t as string).length).toBeGreaterThan(0);
    if (!SAME.has(key)) expect(t).not.toBe(e);
  });

  it('sys.blog holds exactly the listed keys in both files', () => {
    const listed = KEYS.filter((k) => k.startsWith('blog.')).sort();
    expect(leaves(read(en, 'blog'), 'blog').sort()).toEqual(listed);
    expect(leaves(read(tr, 'blog'), 'blog').sort()).toEqual(listed);
  });

  it('the h1 template places the word per locale; five words split on | (B-4)', () => {
    expect(read(en, 'blog.hero.title')).toBe('{pre} <word></word>');
    expect(read(tr, 'blog.hero.title')).toBe('<word></word> {pre}');
    for (const m of [en, tr]) {
      expect((read(m, 'blog.hero.words') as string).split('|')).toHaveLength(5);
    }
  });

  it('the templates carry the placeholders the pages fill', () => {
    for (const m of [en, tr]) {
      expect(read(m, 'blog.article.metaTitle')).toBe('{title} | JobsAdmire');
      expect(read(m, 'blog.faq.a1')).toMatch(/\{permitDays\}[\s\S]*\{firstDayWeeks\}/);
      expect(read(m, 'blog.faq.q3')).toMatch(/\{ratio\}:1/);
      expect(read(m, 'blog.whatsapp.article')).toMatch(/\{title\}/);
      expect(read(m, 'blog.article.sections')).toMatch(/plural/);
      expect(read(m, 'blog.tools.results.one')).toMatch(/\{n\}/);
      expect(read(m, 'blog.tools.results.other')).toMatch(/\{n\}/);
    }
    // BLOG-02: "1 guide" / "2 guides" in EN; Turkish nouns stay singular after a numeral, so the
    // TR value is the invariant word (no ICU needed) — rendered as sys('blog.index.guides', { n })
    expect(read(en, 'blog.index.guides')).toMatch(
      /^\{n, plural, one \{guide\} other \{guides\}\}$/,
    );
    expect(read(tr, 'blog.index.guides')).not.toMatch(/[{}]/);
  });

  it('keeps the article title template out of sys.seo — the OG route reads sys.seo.<pageKey>.title with no arguments (B-15, W169)', () => {
    expect(read(en, 'seo.blogArticle')).toBeUndefined();
    expect(read(tr, 'seo.blogArticle')).toBeUndefined();
  });
});
