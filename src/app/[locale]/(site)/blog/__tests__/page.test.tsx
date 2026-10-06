import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { feedToRows, withBlogRows } from '@/content/blog-feed';
import type { Locale } from '@/i18n/routing';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { atvFixtureFeed, liveDoorFeed, type FeedJson } from '@/test/blog-fixtures';
import { renderWithIntl } from '@/test/render';
import { BundleSchema, type Bundle } from '../../../../../../contract/website-bundle.v1';

// W250 (owner 2026-10-06): the index is one uniform card grid — the featured post its first card,
// no separate full-width card, no "most read" panel. The page is rendered whole over the LOCAL
// bundle with the blog rows of a feed, the request scope stubbed.

vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async ({ locale }: { locale: Locale }) =>
    createTranslator({ locale, messages: locale === 'tr' ? tr : en, namespace: 'sys' }),
}));
vi.mock('next/dynamic', () => ({ default: () => () => null }));
vi.mock('@/forms/newsletter/actions', () => ({ submitNewsletter: vi.fn() }));

const local = (locale: Locale): Bundle =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
let feed: FeedJson = liveDoorFeed();
vi.mock('@/content/blog', () => ({
  getBlogBundle: async (locale: Locale) =>
    withBlogRows(local(locale), feedToRows(feed, vi.fn()).rows),
}));

const { default: BlogIndex } = await import('../page');

beforeAll(() => {
  // jsdom has no matchMedia (the rotating word reads reduced motion)
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

async function index(locale: Locale, next: FeedJson) {
  feed = next;
  const jsx = await BlogIndex({ params: Promise.resolve({ locale }) });
  return renderWithIntl(jsx, { locale });
}

/** Ten written English articles: the ATV post, the fixture's two English ones and seven more
 *  cloned from the first. */
function tenPerLanguage(): FeedJson {
  const base = atvFixtureFeed();
  const [first] = base.posts as Record<string, Record<string, unknown> | unknown>[];
  const more = Array.from({ length: 7 }, (_, i) => ({
    ...structuredClone(first),
    key: `extra-${i}`,
    featured: false,
    publishedAt: `2026-09-0${i + 1}T08:00:00.000Z`,
    slug: { tr: `ek-yazi-${i}`, en: `extra-post-${i}` },
  }));
  return { ...base, posts: [...base.posts, ...more] };
}

describe('the blog index (W250: one card grid, no "most read")', () => {
  it('TR with one article: one card in the grid — the featured one, with its pill', async () => {
    const { container } = await index('tr', liveDoorFeed());
    const grid = screen.getByTestId('blog-grid');
    const items = within(grid).getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByTestId('blog-featured')).toHaveTextContent('ÖNE ÇIKAN');
    expect(screen.queryByTestId('blog-most-read')).toBeNull();
    expect(screen.queryByRole('heading', { level: 2, name: 'En çok okunan' })).toBeNull();
    expect(screen.queryByTestId('blog-load-more')).toBeNull();
    expect(container.querySelectorAll('[data-featured]')).toHaveLength(1);
    // the featured card is a grid card like any other: an h3, never the old full-width h2 card
    expect(within(items[0]).getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('EN with two articles: two cards, the first featured, the grid at most four in a row', async () => {
    await index('en', liveDoorFeed());
    const grid = screen.getByTestId('blog-grid');
    expect(grid.className).toContain('xl:grid-cols-4');
    const items = within(grid).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0].querySelector('[data-featured]')).not.toBeNull();
    expect(items[1].querySelector('[data-featured]')).toBeNull();
    expect(screen.queryByTestId('blog-most-read')).toBeNull();
  });

  it('ten articles: eight shown (two rows of four), two behind "Load more", still no ranking', async () => {
    await index('en', tenPerLanguage());
    const items = within(screen.getByTestId('blog-grid')).getAllByRole('listitem', {
      hidden: true,
    });
    expect(items).toHaveLength(10);
    expect(items.filter((li) => li.hidden)).toHaveLength(2);
    expect(screen.getByTestId('blog-load-more')).toBeInTheDocument();
    expect(screen.queryByTestId('blog-most-read')).toBeNull();
  });
});
