// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { readCmap } from '@/test/font-cmap';
import { BundleSchema } from '../../../../../contract/website-bundle.v1';

// WP2a T4-4 P5 (final pass P2-9): the OG route draws its title and subline in the vendored Archivo
// Bold alone (no fallback font is registered with `ImageResponse`), so a glyph the face lacks
// renders as a box. Every string the route can draw is checked against the font's own cmap: the
// `sys.seo.*` titles and descriptions, the tagline subline, the per-item title templates that
// W169 keeps under `sys.<page>.*`, the page records' package SEO strings of both LOCAL bundles
// (`t(titleId)` wins over `sys.seo` when the record has one), and the two literals in the route.
const ROOT = process.cwd();
const cmap = readCmap(readFileSync(join(ROOT, 'src/design/fonts/Archivo-Bold.ttf')));

type Seo = Record<string, string | { title?: string; description?: string }>;

function drawnStrings(messages: { sys: { seo: Seo; blog: unknown; careers: unknown } }): string[] {
  const out: string[] = ['JobsAdmire', 'jobsadmire.com'];
  for (const value of Object.values(messages.sys.seo)) {
    if (typeof value === 'string') out.push(value);
    else {
      if (value.title) out.push(value.title);
      if (value.description) out.push(value.description);
    }
  }
  const blog = messages.sys.blog as { article: { metaTitle: string } };
  const careers = messages.sys.careers as { detail: { metaTitle: string } };
  out.push(blog.article.metaTitle, careers.detail.metaTitle);
  return out;
}

function recordStrings(locale: 'tr' | 'en'): string[] {
  const bundle = BundleSchema.parse(
    JSON.parse(
      readFileSync(join(ROOT, 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
  const out: string[] = [];
  for (const page of Object.values(bundle.pages)) {
    for (const id of [page.titleId, page.descriptionId]) {
      const text = id ? bundle.strings[id] : undefined;
      if (text) out.push(text);
    }
  }
  return out;
}

describe('the cmap reader itself', () => {
  it('finds Latin and Latin Extended glyphs and refuses what Archivo does not carry', () => {
    expect(cmap.has('A'.codePointAt(0)!)).toBe(true);
    expect(cmap.has('İ'.codePointAt(0)!)).toBe(true); // U+0130, Turkish capital dotted I
    expect(cmap.has('ş'.codePointAt(0)!)).toBe(true);
    expect(cmap.has(0x4e00)).toBe(false); // 一 — no CJK in Archivo
    expect(cmap.has(0xffff)).toBe(false);
    expect(cmap.missing('Aş一')).toEqual(['一']);
  });
});

describe('every glyph the OG route can draw exists in Archivo Bold (WP2a T4-4 P5)', () => {
  for (const [locale, messages] of [
    ['tr', tr],
    ['en', en],
  ] as const) {
    it(`${locale}: sys.seo titles, descriptions, tagline, the W169 templates and the record SEO strings`, () => {
      const strings = [...drawnStrings(messages), ...recordStrings(locale)];
      expect(strings.length).toBeGreaterThan(20);
      const gaps = strings
        .map((s) => ({ s, missing: cmap.missing(s) }))
        .filter((g) => g.missing.length > 0)
        .map((g) => `${JSON.stringify(g.missing)} in ${JSON.stringify(g.s)}`);
      expect(gaps, gaps.join('\n')).toEqual([]);
    });
  }
});
