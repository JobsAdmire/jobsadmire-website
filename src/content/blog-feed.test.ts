import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { ATV_KEY, atvPost, atvFixtureFeed } from '@/test/blog-fixtures';
import { testBundle } from '@/test/bundle';
import { BlogFeedPostSchema } from '../../contract/blog-feed.v1';
import {
  BlogFeedContractError,
  coverVariant,
  estimateReadMinutes,
  feedToRows,
  istanbulDate,
  mapFeedPost,
  previewToRow,
  redirectTarget,
  withBlogRows,
} from './blog-feed';
import { BlogPostSchema, getCollection } from './collections';

/** The contract fixture (`contract/blog-feed.v1.fixture.json`) — the same file Operations' own
 *  fixture is diffed against. */
const FIXTURE = JSON.parse(
  readFileSync(join(process.cwd(), 'contract/blog-feed.v1.fixture.json'), 'utf8'),
) as { posts: Record<string, unknown>[]; redirects: Record<string, unknown>[] } & Record<
  string,
  unknown
>;
const clone = () => structuredClone(FIXTURE);
const quiet = () => vi.fn();

describe('feedToRows (contract blog.v1 → the site rows)', () => {
  it('maps every fixture post into a row BlogPostSchema accepts, in feed order', () => {
    const { rows, redirects } = feedToRows(clone(), quiet());
    expect(rows.map((r) => r.key)).toEqual([
      'cmgblog0000000000000000001',
      'cmgblog0000000000000000002',
      'cmgblog0000000000000000003',
    ]);
    for (const row of rows) expect(BlogPostSchema.safeParse(row).success).toBe(true);
    expect(redirects).toEqual([
      {
        locale: 'en',
        from: 'hiring-from-pakistan-guide',
        to: 'hiring-from-pakistan-employer-guide',
      },
      {
        locale: 'tr',
        from: 'pakistandan-isci-istihdami',
        to: 'pakistandan-isci-istihdami-rehberi',
      },
    ]);
  });

  it('carries every Operations field the pages read', () => {
    const [bilingual, trOnly, editorial] = feedToRows(clone(), quiet()).rows;
    expect(bilingual).toMatchObject({
      category: 'recruitment',
      categoryLabelId: 'home.265',
      featured: true,
      // 21:30 UTC on 5 Oct is 00:30 on 6 Oct in Türkiye — the post's day there
      publishedAt: '2026-10-06',
      updatedAt: '2026-10-06T07:30:00.000Z',
      author: 'Ayşe Demir',
      authorObj: { name: 'Ayşe Demir', title: 'Recruitment Lead' },
      cover: { width: 1600, height: 900 },
      coverAlt: { en: 'A hiring interview at the Antalya office' },
      seo: {
        title: { en: 'Hiring from Pakistan in 2026: employer guide' },
        description: { tr: null },
      },
      readMinutes: 4,
      readMinutesByLocale: { tr: 4, en: 4 },
      hasBody: { tr: true, en: true },
    });
    expect(bilingual.faq?.en).toHaveLength(2);
    expect(trOnly).toMatchObject({
      authorObj: { name: 'Mehmet Kaya', title: null },
      hasBody: { tr: true, en: false },
      slug: { tr: 'sgk-bildirimi-yabanci-isciler', en: null },
      readMinutes: 2,
      readMinutesByLocale: { tr: 2, en: null },
      cover: null,
    });
    // author: null → the editorial line the LOCAL row carries
    expect(editorial).toMatchObject({ author: 'JobsAdmire', authorObj: null, faq: { en: [] } });
  });

  it('nulls every field of a language that is not written, so no reader lists it', () => {
    const feed = clone();
    const post = feed.posts[0] as Record<string, Record<string, unknown>>;
    post.hasBody.tr = false; // the TR text exists in the draft but is not marked ready
    const [row] = feedToRows(feed, quiet()).rows;
    expect(row.hasBody).toEqual({ tr: false, en: true });
    expect([row.slug.tr, row.title.tr, row.excerpt.tr, row.body.tr]).toEqual([
      null,
      null,
      null,
      null,
    ]);
    expect(row.faq?.tr).toEqual([]);
    expect(row.readMinutesByLocale?.tr).toBeNull();
  });

  it('drops a post that breaks the contract, logs it, and keeps the rest (R28)', () => {
    const feed = clone();
    (feed.posts[1] as Record<string, unknown>).category = 'gossip';
    const log = quiet();
    const { rows } = feedToRows(feed, log);
    expect(rows).toHaveLength(2);
    expect(log).toHaveBeenCalledWith(
      'a post broke the contract and was left out',
      expect.objectContaining({ index: 1, path: 'category' }),
    );
  });

  it('a reserved slug (preview) demotes that language only', () => {
    const feed = clone();
    (feed.posts[0] as Record<string, Record<string, unknown>>).slug.en = 'preview';
    const log = quiet();
    const [row] = feedToRows(feed, log).rows;
    expect(row.hasBody).toEqual({ tr: true, en: false });
    expect(row.slug.en).toBeNull();
    expect(log).toHaveBeenCalledWith(
      'a post uses a reserved slug and was left out in that language',
      expect.objectContaining({ slug: 'preview', locale: 'en' }),
    );
  });

  it('a slug a newer post already holds is left out in that language (the feed is newest first)', () => {
    const feed = clone();
    // the older editorial post (EN only) claims the newer bilingual post's EN slug
    (feed.posts[2] as Record<string, Record<string, unknown>>).slug.en =
      'hiring-from-pakistan-employer-guide';
    const log = quiet();
    const { rows } = feedToRows(feed, log);
    // its only language is gone → nothing left to render → the row is left out
    expect(rows.map((r) => r.key)).toEqual([
      'cmgblog0000000000000000001',
      'cmgblog0000000000000000002',
    ]);
    expect(log).toHaveBeenCalledWith(
      'two posts share a slug; the older one was left out in that language',
      expect.objectContaining({ key: 'cmgblog0000000000000000003' }),
    );
  });

  it('a cover off the media route is dropped (next/image would refuse it), the post kept', () => {
    const feed = clone();
    (feed.posts[0] as Record<string, Record<string, unknown>>).cover.url =
      'https://cdn.example.com/a.webp';
    const [row] = feedToRows(feed, quiet()).rows;
    expect(row.cover).toBeNull();
  });

  it('refuses an envelope that is not blog.v1 — the caller falls back', () => {
    for (const bad of [null, [], { ...clone(), contractVersion: 'blog.v2' }, { posts: [] }])
      expect(() => feedToRows(bad, quiet())).toThrow(BlogFeedContractError);
  });

  it('drops a bad redirect and a self-redirect', () => {
    const feed = clone();
    feed.redirects.push({ locale: 'de', from: 'a', to: 'b' }, { locale: 'en', from: 'x', to: 'x' });
    expect(feedToRows(feed, quiet()).redirects).toHaveLength(2);
  });
});

describe('the small helpers', () => {
  it('istanbulDate is the calendar day in Türkiye', () => {
    expect(istanbulDate('2026-10-05T20:59:59.000Z')).toBe('2026-10-05');
    expect(istanbulDate('2026-10-05T21:00:00.000Z')).toBe('2026-10-06');
    expect(() => istanbulDate('soon')).toThrow(RangeError);
  });

  it('estimateReadMinutes: ~200 words a minute, never under one', () => {
    expect(estimateReadMinutes('')).toBe(1);
    expect(estimateReadMinutes(Array(1000).fill('w').join(' '))).toBe(5);
  });

  it('mapFeedPost: no written language → no row; zero reading time floors at one minute', () => {
    const [post] = clone().posts as Record<string, Record<string, unknown>>[];
    const none = { ...post, hasBody: { tr: false, en: false } };
    expect(mapFeedPost(none as never, { log: quiet() })).toBeNull();
    const zero = { ...post, readMinutes: { tr: 0, en: null } };
    expect(mapFeedPost(zero as never, { log: quiet() })?.readMinutesByLocale).toEqual({
      tr: 1,
      en: 1, // null → estimated from the body
    });
  });

  it('coverVariant swaps the media variant; any other URL stays', () => {
    const url = 'https://operations.jobsadmire.com/api/website/v1/media/a/1600.webp';
    expect(coverVariant(url, 1200)).toBe(
      'https://operations.jobsadmire.com/api/website/v1/media/a/1200.webp',
    );
    expect(coverVariant('/hero/blog.jpg', 1200)).toBe('/hero/blog.jpg');
  });

  it('withBlogRows replaces the blog collection only', () => {
    const bundle = testBundle();
    const { rows } = feedToRows(clone(), quiet());
    const next = withBlogRows(bundle, rows);
    expect(getCollection(next, 'blog').map((r) => r.key)).toEqual(rows.map((r) => r.key));
    expect(next.strings).toBe(bundle.strings);
    expect(next.collections.metrics).toBe(bundle.collections.metrics);
  });
});

describe('redirectTarget (W248: an old slug 308s to the new one)', () => {
  const { rows, redirects } = feedToRows(clone(), quiet());
  it('answers the new slug for an old one, per locale', () => {
    expect(redirectTarget(redirects, rows, 'en', 'hiring-from-pakistan-guide')).toBe(
      'hiring-from-pakistan-employer-guide',
    );
    expect(redirectTarget(redirects, rows, 'tr', 'pakistandan-isci-istihdami')).toBe(
      'pakistandan-isci-istihdami-rehberi',
    );
    expect(redirectTarget(redirects, rows, 'tr', 'hiring-from-pakistan-guide')).toBeNull();
    expect(redirectTarget(redirects, rows, 'en', 'unknown')).toBeNull();
  });
  it('never redirects onto a slug no written article holds (a 404 stays a 404)', () => {
    const gone = [{ locale: 'en' as const, from: 'a', to: 'unpublished-post' }];
    expect(redirectTarget(gone, rows, 'en', 'a')).toBeNull();
  });
});

describe('previewToRow (the draft preview)', () => {
  it('renders a draft in the asked language even before it is marked ready, with no slug yet', () => {
    const post = structuredClone(FIXTURE.posts[0]) as Record<string, Record<string, unknown>>;
    post.hasBody.en = false;
    post.slug.en = null;
    (post as Record<string, unknown>).publishedAt = null;
    const row = previewToRow({ post }, 'en', () => new Date('2026-10-06T10:00:00Z'));
    expect(row).toMatchObject({
      hasBody: { en: true },
      slug: { en: 'preview' },
      publishedAt: '2026-10-06',
    });
  });
  it('null when the language has no title or body; a contract error for anything else', () => {
    const post = structuredClone(FIXTURE.posts[1]);
    expect(previewToRow({ post }, 'en')).toBeNull();
    expect(() => previewToRow({ nope: true }, 'en')).toThrow(BlogFeedContractError);
  });
});

describe('the video poster as the cover (W249)', () => {
  const POSTER = '/media/blog/atv-vizyon-haris-jiva.jpg';
  type PostJson = Record<string, Record<string, unknown>>;
  const atv = () => atvPost() as PostJson;
  const map = (post: PostJson) => mapFeedPost(BlogFeedPostSchema.parse(post), { log: quiet() });

  it('a post without a cover but with a video shows the poster, its size, the video title as alt', () => {
    const row = map(atv()); // as Operations sends it: no cover, so no coverAlt either
    expect(row?.cover).toEqual({ url: POSTER, width: 1920, height: 1080 });
    // W250: marked as the poster, so the article's top leaves it out (the body plays the video)
    expect(row?.coverSource).toBe('video');
    expect(row?.coverAlt).toEqual({
      tr: 'ATV Vizyon: JobsAdmire kurucusu Haris Jiva ile röportaj',
      en: 'ATV Vizyon: interview with JobsAdmire founder Haris Jiva', // its English line (W250)
    });
    // a file of the site: BlogPostSchema (and so getCollection) takes it
    expect(BlogPostSchema.safeParse(row).success).toBe(true);
  });

  it('a coverAlt never describes the poster (it belongs to a cover photo)', () => {
    const post = atv();
    post.coverAlt = { tr: 'Silinen bir kapak fotoğrafı', en: null };
    expect(map(post)?.coverAlt?.tr).toBe('ATV Vizyon: JobsAdmire kurucusu Haris Jiva ile röportaj');
  });

  it('a cover of its own always wins, with its own alt; a post with neither keeps none', () => {
    const own = atv();
    own.cover = structuredClone(FIXTURE.posts[0].cover) as Record<string, unknown>;
    own.coverAlt = { tr: 'Kapak', en: null };
    expect(map(own)?.cover?.url).toMatch(/\/1600\.webp$/);
    expect(map(own)?.coverSource).toBe('post'); // W250
    expect(map(own)?.coverAlt?.tr).toBe('Kapak');
    const plain = atv();
    plain.body.tr = 'No video here.\n\n!video[Not yet](unknown-video)';
    plain.body.en = 'No video here either.';
    expect(map(plain)?.cover).toBeNull(); // the category cover shows
    expect(map(plain)).not.toHaveProperty('coverSource');
    expect(map(plain)?.coverAlt?.tr).toBeNull();
  });

  it('the English body’s video stands in when the Turkish one has none; its title per locale', () => {
    const post = atv();
    post.body = {
      tr: 'Türkçe metin.\n\n!video[Türkçe başlık](atv-vizyon-haris-jiva)',
      en: 'English text.\n\n!video[English title](atv-vizyon-haris-jiva)',
    };
    post.slug.en = 'atv-interview';
    post.title.en = 'The ATV interview';
    post.hasBody.en = true;
    expect(map(post)?.coverAlt).toEqual({ tr: 'Türkçe başlık', en: 'English title' });
    post.body.tr = 'Türkçe metin, videosuz.';
    expect(map(post)?.cover?.url).toBe(POSTER);
  });

  it('through the whole feed: the fixture door’s posts all map, the ATV post first', () => {
    const { rows } = feedToRows(atvFixtureFeed(), quiet());
    expect(rows.map((r) => r.key)).toEqual([
      ATV_KEY,
      'cmgblog0000000000000000001',
      'cmgblog0000000000000000002',
      'cmgblog0000000000000000003',
    ]);
    expect(rows[0]).toMatchObject({
      readMinutesByLocale: { tr: 2, en: 3 },
      featured: true,
      publishedAt: '2026-10-06',
      // W250: the English version, published from Operations the same day
      slug: {
        tr: 'atv-vizyon-jobsadmire-haris-jiva-roportaji',
        en: 'jobsadmire-on-atv-vizyon-founder-haris-jiva-interview',
      },
      hasBody: { tr: true, en: true },
      cover: { url: POSTER },
      coverSource: 'video',
      showCover: false, // its top cover switched off in Operations
      authorObj: null,
    });
    expect(rows[0].faq?.tr).toHaveLength(3);
    expect(rows[0].faq?.en).toHaveLength(3);
    for (const row of rows) expect(BlogPostSchema.safeParse(row).success).toBe(true);
    // the other three are unchanged: their own cover, or none (no video in their bodies)
    expect(rows.slice(1).map((r) => r.cover?.url ?? null)).toEqual([
      'https://operations.jobsadmire.com/api/website/v1/media/cmgmedia000000000000000001/1600.webp',
      null,
      null,
    ]);
  });
});

describe('`showCover` (W250, additive to blog.v1)', () => {
  const post = () => structuredClone(FIXTURE.posts[0]) as Record<string, unknown>;
  const read = (p: Record<string, unknown>) =>
    mapFeedPost(BlogFeedPostSchema.parse(p), { log: quiet() });

  it('passes the switch through; absent or null (a producer from before it) reads as true', () => {
    expect(read({ ...post(), showCover: false })?.showCover).toBe(false);
    expect(read({ ...post(), showCover: true })?.showCover).toBe(true);
    expect(read({ ...post(), showCover: null })?.showCover).toBe(true);
    const absent = post();
    delete absent.showCover;
    expect(read(absent)?.showCover).toBe(true);
    // off keeps the cover itself, for the cards and the share image
    expect(read({ ...post(), showCover: false })?.cover?.url).toMatch(/\/1600\.webp$/);
    expect(BlogPostSchema.safeParse(read({ ...post(), showCover: false })).success).toBe(true);
  });

  it('a feed with and a feed without the field both map whole; a non-boolean leaves that post out', () => {
    const withIt = clone();
    const without = clone();
    for (const p of without.posts as Record<string, unknown>[]) delete p.showCover;
    expect(feedToRows(withIt, quiet()).rows).toHaveLength(3);
    expect(feedToRows(without, quiet()).rows.map((r) => r.showCover)).toEqual([true, true, true]);
    const bad = clone();
    (bad.posts as Record<string, unknown>[])[1].showCover = 'yes';
    const log = quiet();
    expect(feedToRows(bad, log).rows).toHaveLength(2);
    expect(log).toHaveBeenCalledWith(
      'a post broke the contract and was left out',
      expect.objectContaining({ path: 'showCover' }),
    );
  });
});
