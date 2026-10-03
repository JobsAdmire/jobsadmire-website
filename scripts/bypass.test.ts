/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { BYPASS_HEADER, bypassWarning, protectionBypassHeaders } from '../e2e/helpers/bypass';

// W137: the ONE place the Vercel Deployment Protection bypass header is built. Tested here for
// the same reason as scripts/face.test.ts: Vitest never collects e2e/**.
const env = (o: Record<string, string>) => o as NodeJS.ProcessEnv;

describe('protectionBypassHeaders (W137)', () => {
  it('is empty when the secret is unset or blank — no header at all, not an empty one', () => {
    expect(protectionBypassHeaders(env({}))).toEqual({});
    expect(protectionBypassHeaders(env({ VERCEL_AUTOMATION_BYPASS_SECRET: '' }))).toEqual({});
    expect(protectionBypassHeaders(env({ VERCEL_AUTOMATION_BYPASS_SECRET: '   ' }))).toEqual({});
  });

  it('sends exactly the Vercel bypass header when the secret is set', () => {
    expect(protectionBypassHeaders(env({ VERCEL_AUTOMATION_BYPASS_SECRET: 'abc123' }))).toEqual({
      'x-vercel-protection-bypass': 'abc123',
    });
    expect(BYPASS_HEADER).toBe('x-vercel-protection-bypass');
  });

  it('never carries any other variable', () => {
    const h = protectionBypassHeaders(
      env({ VERCEL_AUTOMATION_BYPASS_SECRET: 's', OPS_WEBSITE_WRITE_TOKEN: 'never' }),
    );
    expect(Object.keys(h)).toEqual([BYPASS_HEADER]);
  });
});

describe('bypassWarning (W135/W137)', () => {
  it('warns only for a preview-face target without the secret', () => {
    expect(bypassWarning('https://x-git-wp2.vercel.app', env({}))).toMatch(
      /VERCEL_AUTOMATION_BYPASS_SECRET unset/,
    );
    expect(bypassWarning('https://staging.jobsadmire.com', env({}))).not.toBeNull();
    expect(
      bypassWarning(
        'https://staging.jobsadmire.com',
        env({ VERCEL_AUTOMATION_BYPASS_SECRET: 's' }),
      ),
    ).toBeNull();
    expect(bypassWarning('http://localhost:3000', env({}))).toBeNull();
    expect(bypassWarning('https://www.jobsadmire.com', env({}))).toBeNull();
  });
});
