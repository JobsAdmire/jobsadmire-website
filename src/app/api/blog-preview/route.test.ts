import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BLOG_PREVIEW_COOKIE, BLOG_PREVIEW_MAX_AGE } from '@/lib/blog-preview';

// Draft mode needs Next's request scope; the handlers only switch it, so a spy stands in.
const draft = { enable: vi.fn(), disable: vi.fn(), isEnabled: false };
vi.mock('next/headers', () => ({ draftMode: async () => draft }));

import { GET as enter } from './route';
import { GET as exit } from './exit/route';

const TOKEN = 'eyJwb3N0SWQiOiJ4IiwiZXhwIjoxfQ.c2lnbmF0dXJlLXZhbHVl';
const req = (path: string) => new NextRequest(`https://www.jobsadmire.com${path}`);

beforeEach(() => {
  draft.enable.mockClear();
  draft.disable.mockClear();
});

describe('GET /api/blog-preview (W248)', () => {
  it('turns draft mode on, keeps the token in an httpOnly cookie and lands on the TR preview', async () => {
    const res = await enter(req(`/api/blog-preview?token=${TOKEN}`));
    expect(draft.enable).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://www.jobsadmire.com/blog/preview');
    const cookie = res.cookies.get(BLOG_PREVIEW_COOKIE);
    expect(cookie?.value).toBe(TOKEN);
    expect(cookie).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: BLOG_PREVIEW_MAX_AGE,
    });
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(res.headers.get('referrer-policy')).toBe('no-referrer');
    // the token never travels on in a URL
    expect(res.headers.get('location')).not.toContain(TOKEN);
  });

  it('locale=en lands on the EN preview; anything else on TR', async () => {
    expect(
      (await enter(req(`/api/blog-preview?token=${TOKEN}&locale=en`))).headers.get('location'),
    ).toBe('https://www.jobsadmire.com/en/blog/preview');
    expect(
      (await enter(req(`/api/blog-preview?token=${TOKEN}&locale=de`))).headers.get('location'),
    ).toBe('https://www.jobsadmire.com/blog/preview');
  });

  it('a missing or malformed token stores nothing (the page then says the link is invalid)', async () => {
    for (const q of [
      '',
      '?token=',
      '?token=short',
      `?token=${encodeURIComponent('a b<script>xxxxxxxxxxxx')}`,
    ]) {
      const res = await enter(req(`/api/blog-preview${q}`));
      expect(res.status).toBe(307);
      expect(res.cookies.get(BLOG_PREVIEW_COOKIE)?.value ?? '').toBe('');
    }
  });
});

describe('GET /api/blog-preview/exit (W248)', () => {
  it('turns draft mode off, drops the token and goes back to the blog of that language', async () => {
    const res = await exit(req('/api/blog-preview/exit?locale=en'));
    expect(draft.disable).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://www.jobsadmire.com/en/blog');
    expect(res.cookies.get(BLOG_PREVIEW_COOKIE)?.value ?? '').toBe('');
    expect((await exit(req('/api/blog-preview/exit'))).headers.get('location')).toBe(
      'https://www.jobsadmire.com/blog',
    );
  });
});
