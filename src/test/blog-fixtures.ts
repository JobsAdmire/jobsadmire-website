import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Json = Record<string, unknown>;
export type FeedJson = Json & { posts: Json[]; redirects: Json[] };

const read = <T>(path: string): T =>
  JSON.parse(readFileSync(join(process.cwd(), path), 'utf8')) as T;

/** The contract fixture (`contract/blog-feed.v1.fixture.json`), a fresh copy per call. */
export const blogFeedFixture = (): FeedJson => read<FeedJson>('contract/blog-feed.v1.fixture.json');

/** W249: the owner's first real post (`e2e/mocks/blog-atv-post.json`, built from the authored
 *  posts) as Operations serves it once the English version is published (W250): Turkish and
 *  English, featured, no cover, `showCover: false`, the ATV interview's video line under each
 *  intro. */
export const atvPost = (): Json => read<Json>('e2e/mocks/blog-atv-post.json');

export const ATV_KEY = 'cmgblog0000000000000000004';
export const ATV_SLUG = 'atv-vizyon-jobsadmire-haris-jiva-roportaji';
export const ATV_EN_SLUG = 'jobsadmire-on-atv-vizyon-founder-haris-jiva-interview';
export const ATV_VIDEO = 'atv-vizyon-haris-jiva';

/** The fixture door's default feed (`e2e/mocks/careers-door.mjs`, W250): the live blog once the
 *  English interview is published — the ATV post and the English work-permit guide (the contract
 *  fixture's third post), no redirects: one Turkish article, two English ones. */
export function liveDoorFeed(): FeedJson {
  const feed = blogFeedFixture();
  return { ...feed, posts: [atvPost(), feed.posts[2]], redirects: [] };
}

/** The ATV post, then the contract fixture's three posts — newest first, as Operations sends
 *  them (the head of the door's `/grid` feed, which adds `e2e/mocks/blog-grid-posts.json`). */
export function atvFixtureFeed(): FeedJson {
  const feed = blogFeedFixture();
  return { ...feed, posts: [atvPost(), ...feed.posts] };
}
