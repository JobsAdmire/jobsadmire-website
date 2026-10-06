import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import { feedToRows, withBlogRows } from '@/content/blog-feed';
import { getCollection } from '@/content/collections';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';

vi.mock('next-intl/server', () => ({
  getTranslations: async ({ locale }: { locale: 'tr' | 'en' }) =>
    createTranslator({ locale, messages: locale === 'tr' ? tr : en, namespace: 'sys' }),
}));
vi.mock('next/dynamic', () => ({ default: () => () => null }));

const { ArticleView } = await import('../_components/ArticleView');

const LOCAL_EN = BundleSchema.parse(
  JSON.parse(readFileSync(join(process.cwd(), 'src/content/local/bundle.en.json'), 'utf8')),
);
const FEED = feedToRows(
  JSON.parse(readFileSync(join(process.cwd(), 'contract/blog-feed.v1.fixture.json'), 'utf8')),
  vi.fn(),
);
const OPS_EN = withBlogRows(LOCAL_EN, FEED.rows);
const ROWS = getCollection(OPS_EN, 'blog');

async function show(key: string, opts: { preview?: boolean; bundle?: typeof OPS_EN } = {}) {
  const bundle = opts.bundle ?? OPS_EN;
  const rows = getCollection(bundle, 'blog');
  const post = rows.find((p) => p.key === key)!;
  const jsx = await ArticleView({ bundle, locale: 'en', post, rows, preview: opts.preview });
  const view = renderWithIntl(jsx!, { locale: 'en' });
  const nodes = [...view.container.querySelectorAll('script[type="application/ld+json"]')].map(
    (s) => JSON.parse(s.innerHTML) as Record<string, unknown>,
  );
  return { ...view, nodes, of: (t: string) => nodes.filter((n) => n['@type'] === t) };
}

describe('ArticleView — an Operations post (W248)', () => {
  it('its own FAQ (one FAQPage), its author, its cover photo, dateModified, the new grammar', async () => {
    const { container, of } = await show(ROWS[0].key);
    const faq = container.querySelector('#faq-list')!;
    expect(faq.querySelectorAll('[data-accordion-trigger]')).toHaveLength(2);
    expect(faq).toHaveTextContent('How long does hiring from Pakistan take?');
    expect(of('FAQPage')).toHaveLength(1);
    const author = screen.getByTestId('article-author');
    expect(author).toHaveTextContent('Written by Ayşe Demir');
    expect(author).toHaveTextContent('Recruitment Lead');
    expect(author).toHaveTextContent('AD');
    expect(author).toHaveTextContent('İŞKUR'); // the licence badge either way
    expect(
      screen.getByRole('img', { name: 'A hiring interview at the Antalya office' }),
    ).toBeInTheDocument();
    const [posting] = of('BlogPosting') as {
      dateModified: string;
      author: { '@type': string; name: string };
      image: string;
    }[];
    expect(posting.dateModified).toBe('2026-10-06T07:30:00.000Z');
    expect(posting.author).toEqual({ '@type': 'Person', name: 'Ayşe Demir' });
    expect(posting.image).toMatch(/\/1200\.webp$/);
    const body = screen.getByTestId('article-body');
    expect(within(body).getByRole('heading', { level: 3, name: 'Documents' })).toBeInTheDocument();
    expect(within(body).getByRole('link', { name: 'official rules' })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(within(body).getAllByTestId('article-image')).toHaveLength(1);
  });

  it('no FAQs: no FAQ block, no FAQPage node, no FAQ entry in the TOC; the editorial author', async () => {
    const { container, of } = await show(ROWS[2].key);
    expect(container.querySelector('#faq')).toBeNull();
    expect(of('FAQPage')).toHaveLength(0);
    expect(container.querySelector('a[href="#faq"]')).toBeNull();
    expect(screen.getByTestId('article-author')).toHaveTextContent(
      'Written by JobsAdmire Editorial',
    );
    expect((of('BlogPosting')[0] as { author: unknown }).author).toEqual({
      '@type': 'Organization',
      name: 'JobsAdmire Editorial',
    });
    expect(
      container.querySelector(`[data-placeholder="blog-cover-${ROWS[2].key}"]`),
    ).not.toBeNull();
    // related: the other written EN article; previous: the newer one
    expect(screen.getAllByTestId('article-related-card')).toHaveLength(1);
    expect(screen.getByTestId('article-prev')).toHaveAttribute(
      'href',
      '/en/blog/hiring-from-pakistan-employer-guide',
    );
  });

  it('the preview: the "not published" bar with its exit, and no JSON-LD', async () => {
    const { nodes } = await show(ROWS[0].key, { preview: true });
    const bar = screen.getByTestId('blog-preview-bar');
    expect(bar).toHaveTextContent('Preview — not published');
    expect(within(bar).getByRole('link', { name: 'Exit preview' })).toHaveAttribute(
      'href',
      '/api/blog-preview/exit?locale=en',
    );
    expect(nodes.filter((n) => n['@type'] === 'BlogPosting')).toHaveLength(0);
  });
});

describe('ArticleView — the LOCAL article keeps its generic FAQ (no `faq` field)', () => {
  it('four Q&As, one FAQPage, the editorial author, no preview bar', async () => {
    const { container, of } = await show('turkey-work-permit-process-employer-guide', {
      bundle: LOCAL_EN,
    });
    expect(container.querySelectorAll('#faq-list [data-accordion-trigger]')).toHaveLength(4);
    expect(of('FAQPage')).toHaveLength(1);
    expect(screen.getByTestId('article-author')).toHaveTextContent(
      'Written by JobsAdmire Editorial',
    );
    expect(screen.queryByTestId('blog-preview-bar')).toBeNull();
    expect(screen.queryAllByTestId('article-related-card')).toHaveLength(0);
  });
});
