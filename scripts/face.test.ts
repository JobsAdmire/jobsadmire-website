/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { expectedRobots, lighthouseConfigFor, siteFace } from '../e2e/helpers/face';

// W135: the ONE site-face helper. It lives beside the e2e specs that assert robots.txt, and is
// tested here because Vitest never collects e2e/** (and Playwright would collect an e2e/*.test.ts).
const env = (o: Record<string, string>) => o as NodeJS.ProcessEnv;

describe('siteFace (W135)', () => {
  it('a *.vercel.app deployment URL is the preview face, whatever this shell says', () => {
    expect(siteFace('https://jobsadmire-web-v2-git-wp2-x.vercel.app', env({}))).toBe('preview');
    expect(
      siteFace(
        'https://jobsadmire-web-v2-abc123.vercel.app/en',
        env({ NEXT_PUBLIC_SITE_FACE: 'production' }),
      ),
    ).toBe('preview');
  });

  it('the staging.jobsadmire.com Preview alias is the preview face', () => {
    expect(siteFace('https://staging.jobsadmire.com', env({}))).toBe('preview');
    expect(siteFace('https://STAGING.jobsadmire.com/isci-talebi', env({}))).toBe('preview');
  });

  it('localhost is production unless NEXT_PUBLIC_SITE_FACE is set to anything but production', () => {
    // Unset (or blank) is production: robots.ts is VERCEL_ENV-driven and prerendered at build,
    // and a local build with VERCEL_ENV unset serves the production rules.
    expect(siteFace('http://localhost:3000', env({}))).toBe('production');
    expect(siteFace('http://localhost:3000', env({ NEXT_PUBLIC_SITE_FACE: '  ' }))).toBe(
      'production',
    );
    expect(siteFace('http://127.0.0.1:3100', env({ NEXT_PUBLIC_SITE_FACE: 'production' }))).toBe(
      'production',
    );
    expect(siteFace('http://localhost:3000', env({ NEXT_PUBLIC_SITE_FACE: 'preview' }))).toBe(
      'preview',
    );
  });

  it('the production host is production; expectedRobots is the site face', () => {
    expect(siteFace('https://www.jobsadmire.com', env({}))).toBe('production');
    expect(expectedRobots('https://staging.jobsadmire.com', env({}))).toBe('preview');
    expect(expectedRobots('http://localhost:3000', env({}))).toBe('production');
  });
});

describe('lighthouseConfigFor (W135/W137 — what gate.sh and js-size collect AND assert with)', () => {
  it('a preview face skips is-crawlable: lighthouserc.preview.json', () => {
    expect(lighthouseConfigFor('https://x-git-wp2.vercel.app', env({}))).toBe(
      'lighthouserc.preview.json',
    );
    expect(lighthouseConfigFor('https://staging.jobsadmire.com', env({}))).toBe(
      'lighthouserc.preview.json',
    );
    // The face wins over localhost: a server answering `Disallow: /` can never score SEO 1.0
    // with the audit live (the local stand-in / VERCEL_ENV=preview rehearsal).
    expect(
      lighthouseConfigFor('http://127.0.0.1:3200', env({ NEXT_PUBLIC_SITE_FACE: 'preview' })),
    ).toBe('lighthouserc.preview.json');
  });

  it('localhost with the production face: lighthouserc.local.json (R50)', () => {
    expect(lighthouseConfigFor('http://localhost:3000', env({}))).toBe('lighthouserc.local.json');
    expect(lighthouseConfigFor('http://127.0.0.1:3100/', env({}))).toBe('lighthouserc.local.json');
  });

  it('anything else: lighthouserc.json', () => {
    expect(lighthouseConfigFor('https://www.jobsadmire.com', env({}))).toBe('lighthouserc.json');
  });
});
