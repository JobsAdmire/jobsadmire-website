import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostCard } from '../PostCard';
import { getCollection } from '@/content/collections';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

// Rows satisfy T0b's `BlogPostSchema` exactly (`src/content/collections.ts`, W33): key +
// per-locale slug/title/excerpt/body (W28), the category enum and its label id.
const rows = [
  {
    key: 'turkey-work-permit-process-employer-guide',
    slug: { tr: 'calisma-izni-sureci', en: 'turkey-work-permit-process-employer-guide' },
    title: { tr: 'Çalışma izni süreci', en: 'Turkey work permit process' },
    excerpt: { tr: 'Adım adım.', en: 'Step by step.' },
    category: 'workPermits',
    categoryLabelId: 'p.cat',
    author: 'JobsAdmire Editorial',
    publishedAt: '2026-01-12',
    readMinutes: 5,
    // W28: Task 1's BlogPostSchema refines `(body.<l> !== null) === hasBody.<l>` per locale.
    hasBody: { tr: true, en: true },
    body: { tr: '# Gövde', en: '# Body' },
  },
];
const bundle = testBundle({
  strings: { ...BLOCK_STRINGS, 'p.cat': 'İş izinleri' },
  collections: { blog: rows },
});
// The parsed row through T0b's own accessor, never the literal.
const post = getCollection(bundle, 'blog')[0];

describe('PostCard', () => {
  it('links the title to the locale slug and formats the byline', () => {
    renderWithIntl(<PostCard bundle={bundle} locale="tr" post={post} />, { locale: 'tr' });
    expect(screen.getByRole('link', { name: 'Çalışma izni süreci' })).toHaveAttribute(
      'href',
      '/blog/calisma-izni-sureci',
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Çalışma izni süreci');
    expect(screen.getByText('İş izinleri')).toBeInTheDocument(); // t(categoryLabelId)
    expect(screen.getByText('Adım adım.')).toBeInTheDocument();
    expect(screen.getByText('12 Ocak 2026 · 5 dk okuma')).toBeInTheDocument();
    // W128(a), a D20 delta: the byline is text-tertiary (#64748b, 4.76:1 on white), never the
    // design's muted (#94a3b8, 2.56:1 — axe color-contrast on every card).
    const byline = screen.getByText('12 Ocak 2026 · 5 dk okuma').parentElement!;
    expect(byline).toHaveClass('text-text-tertiary');
    expect(byline).not.toHaveClass('text-muted');
    expect(screen.getByText("İngilizce'de de var")).toBeInTheDocument();
    // no cover given → the NAMED placeholder is what the launch profile counts (D26, W55)
    expect(document.querySelector('[data-placeholder]')).toHaveAttribute(
      'data-placeholder',
      'blog-cover-turkey-work-permit-process-employer-guide',
    );
  });

  it('uses the English slug/title under /en and drops the pill without a translation', () => {
    renderWithIntl(
      <PostCard
        bundle={bundle}
        locale="en"
        post={{ ...post, hasBody: { tr: false, en: true }, body: { tr: null, en: '# Body' } }}
        categoryLabel="Work permits"
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('link', { name: 'Turkey work permit process' })).toHaveAttribute(
      'href',
      '/en/blog/turkey-work-permit-process-employer-guide',
    );
    expect(screen.queryByText("Türkçe'de de var")).toBeNull();
    expect(screen.getByText('12 January 2026 · 5 min read')).toBeInTheDocument();
    expect(screen.getByText('Work permits')).toBeInTheDocument(); // categoryLabel override
  });

  it('featured variant adds the FEATURED pill, an h2 and the real cover', () => {
    renderWithIntl(
      <PostCard
        bundle={bundle}
        locale="tr"
        post={post}
        variant="featured"
        headingLevel={2}
        coverSrc="/brand/ja-mark.png"
      />,
      { locale: 'tr' },
    );
    expect(screen.getByText('ÖNE ÇIKAN')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(document.querySelector('[data-placeholder]')).toBeNull();
  });

  it('renders nothing for a locale the post is not written in (W33)', () => {
    const { container } = renderWithIntl(
      <PostCard
        bundle={bundle}
        locale="tr"
        post={{
          ...post,
          slug: { tr: null, en: post.slug.en },
          title: { tr: null, en: post.title.en },
        }}
      />,
      { locale: 'tr' },
    );
    expect(container).toBeEmptyDOMElement();
  });

  // W129/W122: `ImageSlot` owns its box (`w-full h-auto object-cover` + the width/height ratio)
  // and never receives a class for a property that box already sets from a caller — the row's
  // 104 px column is a wrapper around it. `object-{top,bottom,...}` positions are a different
  // property (object-position, not object-fit) and stay allowed.
  const callerBoxClasses = (el: Element) =>
    el
      .getAttribute('class')!
      .split(/\s+/)
      .filter(
        (c) =>
          (/^(?:(?:min-|max-)?[wh]|size|aspect)-/.test(c) ||
            /^object-(?:contain|cover|fill|none|scale-down)$/.test(c)) &&
          c !== 'w-full' &&
          c !== 'h-auto' &&
          c !== 'object-cover',
      );

  it('row: sizes the cover with a 104 px wrapper, never a width class on ImageSlot (W129)', () => {
    renderWithIntl(<PostCard bundle={bundle} locale="tr" post={post} variant="row" />, {
      locale: 'tr',
    });
    const cover = document.querySelector('[data-placeholder]')!;
    expect(cover.parentElement).toHaveClass('w-[104px]', 'shrink-0');
    expect(cover).not.toHaveClass('w-[104px]');
    expect(cover).not.toHaveClass('shrink-0');
    expect(cover).toHaveClass('w-full');
    // the text column may shrink below its content's width beside the fixed cover
    expect(screen.getByRole('heading', { level: 3 }).parentElement).toHaveClass(
      'min-w-0',
      'flex-1',
    );
  });

  it.each(['card', 'row', 'featured'] as const)(
    '%s: no width or aspect class reaches ImageSlot, placeholder or photo (W129)',
    (variant) => {
      const { unmount } = renderWithIntl(
        <PostCard bundle={bundle} locale="tr" post={post} variant={variant} />,
        { locale: 'tr' },
      );
      expect(callerBoxClasses(document.querySelector('[data-placeholder]')!)).toEqual([]);
      unmount();
      renderWithIntl(
        <PostCard
          bundle={bundle}
          locale="tr"
          post={post}
          variant={variant}
          coverSrc="/brand/ja-mark.png"
        />,
        { locale: 'tr' },
      );
      expect(callerBoxClasses(document.querySelector('article img')!)).toEqual([]);
    },
  );
});
