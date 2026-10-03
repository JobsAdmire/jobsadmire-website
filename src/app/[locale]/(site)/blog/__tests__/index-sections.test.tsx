import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { BlogPost } from '@/content/collections';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { HeroArt } from '../_components/HeroArt';
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

const bundle = testBundle({
  strings: { ...BLOCK_STRINGS, 'home.263': 'Work Permits', 'blog.032': '2 languages' },
});

describe('HeroArt (B-2, B-3)', () => {
  it('renders nothing without a featured article (the TR index in Phase A)', () => {
    const { container } = renderWithIntl(<HeroArt bundle={bundle} locale="en" featured={null} />, {
      locale: 'en',
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('builds its one float card from the featured row — no hard-typed year, read time or "Most read"', () => {
    const { container } = renderWithIntl(
      <HeroArt bundle={bundle} locale="en" featured={row('guide', { readMinutes: 8 })} />,
      { locale: 'en' },
    );
    const art = screen.getByTestId('blog-hero-art');
    expect(art).toHaveAttribute('aria-hidden', 'true');
    expect(art).toHaveTextContent('Work Permits');
    expect(art).toHaveTextContent('Title guide');
    expect(art).toHaveTextContent('JobsAdmire · 8 min read');
    expect(art).toHaveTextContent('2 languages');
    expect(art).not.toHaveTextContent('Most read');
    expect(art).not.toHaveTextContent('2026');
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('PostList (the grid the tools island filters)', () => {
  it('renders nothing for an empty grid (Phase A: the one written article is the featured card)', () => {
    const { container } = renderWithIntl(
      <PostList bundle={bundle} locale="en" posts={[]} heading="Latest articles" />,
      { locale: 'en' },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('lists the rows under a screen-reader h2, one li[data-post-key] per PostCard (h3)', () => {
    const { container } = renderWithIntl(
      <PostList
        bundle={bundle}
        locale="en"
        posts={[row('a'), row('b')]}
        heading="Latest articles"
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Latest articles' })).toBeInTheDocument();
    const list = screen.getByTestId('blog-grid');
    expect(list.id).toBe(POST_LIST_ID);
    expect(list.querySelectorAll('li[data-post-key]')).toHaveLength(2);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Title a' })).toHaveAttribute('href', '/en/blog/a');
    expect(collisionsInTree(container)).toEqual([]);
  });
});
