import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  BLOG_FEED_CONTRACT_VERSION,
  BlogFeedPostSchema,
  BlogFeedSchema,
  BlogPreviewSchema,
} from './blog-feed.v1';

const fixture = JSON.parse(
  readFileSync(join(__dirname, 'blog-feed.v1.fixture.json'), 'utf8'),
) as Record<string, unknown> & { posts: Record<string, unknown>[] };

describe('blog feed contract (blog.v1)', () => {
  it('the golden fixture validates strictly', () => {
    expect(fixture.contractVersion).toBe(BLOG_FEED_CONTRACT_VERSION);
    expect(() => BlogFeedSchema.parse(fixture)).not.toThrow();
  });

  it('is sorted newest first, as Operations promises', () => {
    const dates = fixture.posts.map((p) => Date.parse(String(p.publishedAt)));
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
  });

  it('reads an empty string as null and strips unknown keys (additive producer changes)', () => {
    const post = {
      ...fixture.posts[1],
      excerpt: { tr: 'x', en: '' },
      extra: 'ignored',
    };
    const parsed = BlogFeedPostSchema.parse(post);
    expect(parsed.excerpt.en).toBeNull();
    expect(parsed).not.toHaveProperty('extra');
  });

  it('refuses a slug that is not lower-case ASCII words and hyphens', () => {
    const post = { ...fixture.posts[1], slug: { tr: 'Çalışma İzni', en: null } };
    expect(BlogFeedPostSchema.safeParse(post).success).toBe(false);
  });

  it('a preview post may carry no publishedAt (a draft never published)', () => {
    expect(
      BlogPreviewSchema.safeParse({ post: { ...fixture.posts[0], publishedAt: null } }).success,
    ).toBe(true);
  });
});
