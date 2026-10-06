import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { BlogPost } from '@/content/collections';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { BlogPostCard } from '../_components/BlogPostCard';
import { HeroArt } from '../_components/HeroArt';
import { MostRead } from '../_components/MostRead';
import { PostList } from '../_components/PostList';
import { POST_LIST_ID } from '../_lib/filter';

/** A full written row (both locales), per the T0b schema. */
const row = (key: string, over: Partial<BlogPost> = {}): BlogPost => ({
  key,
  slug: { tr: `${key}-tr`, en: key },
  title: { tr: `Başlık ${key}`, en: `Title ${key}` },
  excerpt: { tr: 'Özet', en: 'Excerpt' },
  category: 'workPermits',
  categoryLabelId: 'home.263',
  author: 'JobsAdmire',
  publishedAt: '2026-06-12',
  readMinutes: 5,
  hasBody: { tr: true, en: true },
  body: { tr: 'metin', en: 'text' },
  ...over,
});
/** A row written in English only. */
const enOnly = (key: string, over: Partial<BlogPost> = {}): BlogPost =>
  row(key, {
    slug: { tr: null, en: key },
    title: { tr: null, en: `Title ${key}` },
    hasBody: { tr: false, en: true },
    body: { tr: null, en: 'text' },
    ...over,
  });
const COVER_URL = 'https://operations.jobsadmire.com/api/website/v1/media/cmgmedia1/1600.webp';

const bundle = testBundle({
  strings: {
    ...BLOCK_STRINGS,
    'home.263': 'Work Permits',
    'home.265': 'Recruitment',
    'blog.011': 'Work Permits',
    'blog.027': 'Work permit guide for employers — 2026',
    'blog.028': 'JobsAdmire · 8 min read',
    'blog.029': 'Recruitment',
    'blog.030': 'Hiring overseas workers: 30-day checklist',
    'blog.031': 'Most read',
    'blog.032': '2 languages',
    'blog.034': 'FEATURED',
    'blog.077': "Türkçe'de de var",
    'blog.081': 'Also in English',
    'blog.084': 'Read article →',
  },
});

describe('HeroArt (S1.2 — both floating cards from the package ids)', () => {
  it('renders the two cards and the pill in either locale, decorative, floating and pausable', () => {
    const { container } = renderWithIntl(<HeroArt bundle={bundle} />, { locale: 'en' });
    const art = screen.getByTestId('blog-hero-art');
    expect(art).toHaveAttribute('aria-hidden', 'true');
    expect(art.className).toContain('max-md:hidden');
    for (const text of [
      'Work Permits',
      'Work permit guide for employers — 2026',
      'JobsAdmire · 8 min read',
      'Recruitment',
      'Hiring overseas workers: 30-day checklist',
      'Most read',
      '2 languages',
    ])
      expect(art).toHaveTextContent(text);
    const floats = ['ja-float-1', 'ja-float-2', 'ja-float-3'].map(
      (c) => art.querySelector(`.${c}`) as HTMLElement,
    );
    for (const f of floats) {
      expect(f).not.toBeNull();
      expect(f.className).toContain('group-data-[paused]/hero:[animation-play-state:paused]!');
    }
    expect(floats[0].className).toContain('[transform:rotate(-4deg)]');
    expect(floats[1].className).toContain('[transform:rotate(3deg)]');
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('BlogPostCard (S2.3–S2.6, S3.3, M5, M7)', () => {
  it('featured + written: the whole card is the title link, "Read article →", month-year meta', () => {
    const { container } = renderWithIntl(
      <BlogPostCard bundle={bundle} locale="en" post={row('guide')} variant="featured" />,
      { locale: 'en' },
    );
    const link = screen.getByRole('link', { name: 'Title guide' });
    expect(link).toHaveAttribute('href', '/en/blog/guide');
    expect(link.className).toContain('after:absolute');
    expect(screen.getByRole('heading', { level: 2, name: 'Title guide' })).toBeInTheDocument();
    expect(container).toHaveTextContent('FEATURED');
    expect(container).toHaveTextContent('Read article →');
    expect(container).toHaveTextContent('June 2026 · 5 min read');
    expect(container).not.toHaveTextContent('12 June 2026');
    expect(container.querySelector('[data-soon-tag]')).toBeNull();
    const cover = container.querySelector('[data-placeholder="blog-cover-guide"]') as HTMLElement;
    expect(cover).toHaveAttribute('aria-hidden', 'true');
    expect(cover.className).toContain('bg-[linear-gradient(135deg,#1899d5_0%,#0e5f8f_100%)]');
    expect(cover).toHaveTextContent('Work Permits');
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('renders nothing for a row with no article in the locale — no "yakında" card (W248)', () => {
    for (const variant of ['featured', 'card'] as const) {
      const { container, unmount } = renderWithIntl(
        <BlogPostCard
          bundle={bundle}
          locale="tr"
          post={row('guide', { hasBody: { tr: false, en: true }, body: { tr: null, en: 'x' } })}
          variant={variant}
        />,
        { locale: 'tr' },
      );
      expect(container).toBeEmptyDOMElement();
      unmount();
    }
  });

  it('card: the category face, the alt pill when the article is written in the other locale too, always a link', () => {
    const { container } = renderWithIntl(
      <>
        <BlogPostCard
          bundle={bundle}
          locale="en"
          post={row('a', { category: 'recruitment', categoryLabelId: 'home.265' })}
        />
        <BlogPostCard bundle={bundle} locale="en" post={enOnly('b')} />
        <BlogPostCard
          bundle={bundle}
          locale="en"
          post={row('c', {
            title: { tr: 'Başlık c', en: 'Title c' },
            hasBody: { tr: false, en: true },
            body: { tr: null, en: 'text' },
          })}
        />
      </>,
      { locale: 'en' },
    );
    const [a, b, c] = Array.from(container.querySelectorAll('article'));
    expect(within(a).getByRole('link', { name: 'Title a' })).toHaveAttribute('href', '/en/blog/a');
    expect(a).toHaveTextContent("Türkçe'de de var");
    expect(a.className).toContain('ja-hover-card');
    expect(
      within(a).getByText('Recruitment', { selector: 'span.rounded-pill' }).className,
    ).toContain('text-success-text');
    expect(b).not.toHaveTextContent("Türkçe'de de var");
    // a TR title without a TR article is not "also in Turkish"
    expect(c).not.toHaveTextContent("Türkçe'de de var");
    expect(container.querySelector('[data-soon-tag]')).toBeNull();
    // phones: a row card — 104 px cover, no excerpt, no alt pill
    expect(b.className).toContain('max-md:flex-row');
    expect(b.querySelector('[data-placeholder]')?.className).toContain('max-md:w-[104px]');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(collisionsInTree(container)).toEqual([]);
  });

  it("a post's cover photo replaces the category placeholder (W248)", () => {
    const { container } = renderWithIntl(
      <BlogPostCard
        bundle={bundle}
        locale="en"
        post={row('p', {
          cover: { url: COVER_URL, width: 1600, height: 900 },
          coverAlt: { tr: null, en: 'An interview' },
        })}
        variant="featured"
      />,
      { locale: 'en' },
    );
    expect(container.querySelector('[data-placeholder]')).toBeNull();
    const box = container.querySelector('[data-cover-photo="blog-cover-p"]') as HTMLElement;
    expect(box.className).toContain('h-[270px]');
    const img = within(box).getByRole('img', { name: 'An interview' });
    expect(img.getAttribute('src')).toContain(encodeURIComponent(COVER_URL));
    expect(img).toHaveAttribute('sizes');
  });
});

describe('MostRead (S2.2, M6)', () => {
  it('ranks the written rows under "Most read" with the sample tag, each a link', () => {
    const { container } = renderWithIntl(
      <MostRead
        bundle={bundle}
        locale="en"
        posts={[
          row('a', { readMinutes: 8 }),
          enOnly('b', { category: 'recruitment', categoryLabelId: 'home.265' }),
        ]}
      />,
      { locale: 'en' },
    );
    const panel = screen.getByTestId('blog-most-read');
    expect(within(panel).getByRole('heading', { level: 2, name: 'Most read' })).toBeInTheDocument();
    expect(panel.querySelector('[data-sample-tag]')).not.toBeNull();
    const items = within(panel).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('1');
    expect(within(items[0]).getByRole('link', { name: 'Title a' })).toHaveAttribute(
      'href',
      '/en/blog/a',
    );
    expect(items[0]).toHaveTextContent('Work Permits · 8 min read');
    expect(within(items[1]).getByRole('link', { name: 'Title b' })).toHaveAttribute(
      'href',
      '/en/blog/b',
    );
    expect(container.querySelector('[data-soon-tag]')).toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('renders nothing without rows', () => {
    const { container } = renderWithIntl(<MostRead bundle={bundle} locale="en" posts={[]} />, {
      locale: 'en',
    });
    expect(container).toBeEmptyDOMElement();
  });
});

describe('PostList (S3.1 — the grid LoadMore pages)', () => {
  it('renders nothing for an empty grid', () => {
    const { container } = renderWithIntl(
      <PostList bundle={bundle} locale="en" posts={[]} heading="Latest articles" pageSize={6} />,
      { locale: 'en' },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('lists every row under a screen-reader h2; rows past the first page start hidden', () => {
    const posts = Array.from({ length: 8 }, (_, i) => row(`p${i}`));
    const { container } = renderWithIntl(
      <PostList bundle={bundle} locale="en" posts={posts} heading="Latest articles" pageSize={6} />,
      { locale: 'en' },
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Latest articles' })).toBeInTheDocument();
    const list = screen.getByTestId('blog-grid');
    expect(list.id).toBe(POST_LIST_ID);
    expect(list.className).toContain('lg:grid-cols-3');
    const rows = Array.from(list.querySelectorAll<HTMLElement>('li[data-post-key]'));
    expect(rows).toHaveLength(8);
    expect(rows.map((r) => r.hidden)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
    ]);
    expect(collisionsInTree(container)).toEqual([]);
  });
});
