import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Json = Record<string, unknown>;
export type FeedJson = Json & { posts: Json[]; redirects: Json[] };

const read = <T>(path: string): T =>
  JSON.parse(readFileSync(join(process.cwd(), path), 'utf8')) as T;

/** The contract fixture (`contract/blog-feed.v1.fixture.json`), a fresh copy per call. */
export const blogFeedFixture = (): FeedJson => read<FeedJson>('contract/blog-feed.v1.fixture.json');

/** W249: the owner's first real post (`e2e/mocks/blog-atv-post.json`, built from the authored
 *  Turkish post): TR only, featured, no cover, the ATV interview video line under its intro. */
export const atvPost = (): Json => read<Json>('e2e/mocks/blog-atv-post.json');

export const ATV_KEY = 'cmgblog0000000000000000004';
export const ATV_SLUG = 'atv-vizyon-jobsadmire-haris-jiva-roportaji';
export const ATV_VIDEO = 'atv-vizyon-haris-jiva';

/** The fixture door's feed (`e2e/mocks/careers-door.mjs`): the ATV post, then the contract
 *  fixture's three posts — newest first, as Operations sends them. */
export function doorFeed(): FeedJson {
  const feed = blogFeedFixture();
  return { ...feed, posts: [atvPost(), ...feed.posts] };
}
