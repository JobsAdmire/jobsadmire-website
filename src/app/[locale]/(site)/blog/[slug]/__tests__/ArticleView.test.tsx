import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import { feedToRows, withBlogRows } from '@/content/blog-feed';
import { getCollection } from '@/content/collections';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { ATV_KEY, atvFixtureFeed } from '@/test/blog-fixtures';
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
    // its own photo at the top (W250: `showCover` true), the hero leaving room for it
    const top = screen.getByTestId('article-cover');
    expect(
      within(top).getByRole('img', { name: 'A hiring interview at the Antalya office' }),
    ).toBeInTheDocument();
    expect(container.querySelector('section')?.className).toContain('pb-[118px]');
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

describe('ArticleView — the top cover (owner 2026-10-06, W250)', () => {
  it('`showCover: false`: no top cover even for a photo of its own — the share image keeps it', async () => {
    const off = withBlogRows(
      LOCAL_EN,
      ROWS.map((r, i) => (i === 0 ? { ...r, showCover: false } : r)),
    );
    const { container, of } = await show(ROWS[0].key, { bundle: off });
    expect(screen.queryByTestId('article-cover')).toBeNull();
    expect(container.querySelector(`[data-cover-photo="blog-cover-${ROWS[0].key}"]`)).toBeNull();
    expect(container.querySelector(`[data-placeholder="blog-cover-${ROWS[0].key}"]`)).toBeNull();
    expect(
      screen.queryByRole('img', { name: 'A hiring interview at the Antalya office' }),
    ).toBeNull();
    // the hero closes as tightly as it opens instead of leaving room for an overlap
    const hero = container.querySelector('section')!;
    expect(hero.className).toContain('pb-[40px]');
    expect(hero.className).not.toContain('pb-[118px]');
    expect((of('BlogPosting')[0] as { image: string }).image).toMatch(/\/1200\.webp$/);
  });

  it('no cover at all: the named category placeholder stays (the LOCAL article)', async () => {
    const { container } = await show('turkey-work-permit-process-employer-guide', {
      bundle: LOCAL_EN,
    });
    const top = screen.getByTestId('article-cover');
    expect(
      top.querySelector(
        '[data-placeholder="blog-cover-turkey-work-permit-process-employer-guide"]',
      ),
    ).not.toBeNull();
    expect(container.querySelector('section')?.className).toContain('pb-[118px]');
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

describe('ArticleView — the owner’s first post: the ATV interview (W249)', () => {
  const LOCAL_TR = BundleSchema.parse(
    JSON.parse(readFileSync(join(process.cwd(), 'src/content/local/bundle.tr.json'), 'utf8')),
  );
  const DOOR_TR = withBlogRows(LOCAL_TR, feedToRows(atvFixtureFeed(), vi.fn()).rows);
  const ORIGIN = 'https://www.jobsadmire.com';

  async function showTr(preview = false) {
    const rows = getCollection(DOOR_TR, 'blog');
    const post = rows.find((p) => p.key === ATV_KEY)!;
    const jsx = await ArticleView({ bundle: DOOR_TR, locale: 'tr', post, rows, preview });
    const view = renderWithIntl(jsx!, { locale: 'tr' });
    const nodes = [...view.container.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.innerHTML) as Record<string, unknown>,
    );
    return { ...view, post, of: (t: string) => nodes.filter((n) => n['@type'] === t) };
  }

  it('the video under the intro, no duplicate poster at the top, one VideoObject beside the BlogPosting', async () => {
    const { container, post, of } = await showTr();
    const video = within(screen.getByTestId('article-body')).getByTestId('article-video');
    expect(video.querySelector('video')).toHaveAttribute(
      'aria-label',
      'ATV Vizyon: JobsAdmire kurucusu Haris Jiva ile röportaj',
    );
    // W250: Turkish and English captions, the Turkish one on (a Turkish page)
    const tracks = [...video.querySelectorAll('track')];
    expect(tracks.map((t) => t.getAttribute('srclang'))).toEqual(['tr', 'en']);
    expect(tracks.filter((t) => t.hasAttribute('default')).map((t) => t.srclang)).toEqual(['tr']);
    // W250: the cover is only the video's poster — never shown again above the player (and the
    // post's `showCover` is off too); no placeholder either, the hero closes tightly
    expect(post.coverSource).toBe('video');
    expect(screen.queryByTestId('article-cover')).toBeNull();
    expect(container.querySelector(`[data-cover-photo="blog-cover-${ATV_KEY}"]`)).toBeNull();
    expect(container.querySelector(`[data-placeholder="blog-cover-${ATV_KEY}"]`)).toBeNull();
    expect(container.querySelector('section')?.className).toContain('pb-[40px]');
    // the poster is still the share image and the BlogPosting image
    const [posting] = of('BlogPosting') as { image: string }[];
    expect(posting.image).toBe(`${ORIGIN}/media/blog/atv-vizyon-haris-jiva.jpg`);
    expect(of('VideoObject')).toEqual([
      {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'ATV Vizyon: JobsAdmire kurucusu Haris Jiva ile röportaj',
        description: post.excerpt.tr,
        thumbnailUrl: `${ORIGIN}/media/blog/atv-vizyon-haris-jiva.jpg`,
        uploadDate: '2026-10-06T00:00:00.000Z',
        duration: 'PT3M25S',
        contentUrl: `${ORIGIN}/media/blog/atv-vizyon-haris-jiva.mp4`,
        inLanguage: 'tr',
      },
    ]);
    expect(of('FAQPage')).toHaveLength(1); // its own three Q&As
  });

  it('the poster alone keeps it off the top: `showCover` absent (a feed from before the switch)', async () => {
    const rows = getCollection(DOOR_TR, 'blog').map((r) =>
      r.key === ATV_KEY ? { ...r, showCover: undefined } : r,
    );
    const bundle = withBlogRows(LOCAL_TR, rows);
    const post = getCollection(bundle, 'blog').find((p) => p.key === ATV_KEY)!;
    expect(post.showCover).toBeUndefined();
    const jsx = await ArticleView({ bundle, locale: 'tr', post, rows, preview: false });
    renderWithIntl(jsx!, { locale: 'tr' });
    expect(screen.queryByTestId('article-cover')).toBeNull();
    expect(screen.getByTestId('article-video')).toBeInTheDocument();
  });

  it('the English version: English captions on, no top cover, its own English title on the player', async () => {
    const LOCAL_EN_DOOR = withBlogRows(LOCAL_EN, feedToRows(atvFixtureFeed(), vi.fn()).rows);
    const rows = getCollection(LOCAL_EN_DOOR, 'blog');
    const post = rows.find((p) => p.key === ATV_KEY)!;
    const jsx = await ArticleView({ bundle: LOCAL_EN_DOOR, locale: 'en', post, rows });
    renderWithIntl(jsx!, { locale: 'en' });
    const video = screen.getByTestId('article-video').querySelector('video')!;
    expect(video).toHaveAttribute(
      'aria-label',
      'ATV Vizyon: interview with JobsAdmire founder Haris Jiva',
    );
    const on = [...video.querySelectorAll('track')].filter((t) => t.hasAttribute('default'));
    expect(on.map((t) => t.getAttribute('srclang'))).toEqual(['en']);
    expect(screen.queryByTestId('article-cover')).toBeNull();
  });

  it('the preview shows the video but carries no JSON-LD at all', async () => {
    const { of } = await showTr(true);
    expect(screen.getByTestId('article-video')).toBeInTheDocument();
    expect(of('VideoObject')).toHaveLength(0);
    expect(of('BlogPosting')).toHaveLength(0);
  });
});
