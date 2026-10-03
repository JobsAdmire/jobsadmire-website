/** @vitest-environment node */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ATTEMPT_TIMEOUT_MS, MAX_ATTEMPTS } from '@/forms/post';
// Relative on purpose: the `@/` alias covers `src/` only, and `scripts/` is a sibling.
import { smokeFields } from '../../../../../scripts/door-smoke.lib';
import { GET } from './route';
import {
  SYNTHETIC_LEAD_PATH,
  runSyntheticLead,
  stampOf,
  syntheticLeadEnvelope,
  testDoorEnv,
} from './run';

const SECRET = 'cron-secret-0123456789abcdef';
const TEST_TOKEN = 'wst_' + 'a'.repeat(48);
const WRITE_TOKEN = 'wsw_' + 'b'.repeat(48);
const env = {
  NODE_ENV: 'test',
  CRON_SECRET: SECRET,
  OPS_API_URL: 'https://operations.example.com/',
  OPS_WEBSITE_WRITE_TOKEN: WRITE_TOKEN,
  OPS_WEBSITE_TEST_TOKEN: TEST_TOKEN,
} as NodeJS.ProcessEnv;
const NOW = new Date('2026-10-01T06:00:07.123Z');
const now = () => NOW;
const AUTH = `Bearer ${SECRET}`;

/** The door's HTTP answer, as `postForm` reads it. */
const door = (status: number, body: unknown) =>
  vi.fn<typeof fetch>(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
  );
const ACCEPTED_BODY = (isTest: boolean) => ({
  data: {
    id: 'sub_9',
    status: 'HANDLED',
    isTest,
    replayed: false,
    captchaDegraded: false,
    error: null,
  },
});
const accepted = (isTest = true) => door(200, ACCEPTED_BODY(isTest));

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('synthetic lead — the CRON_SECRET guard (W172)', () => {
  it('answers 401 without a call for a missing, malformed or wrong Authorization header', async () => {
    const doorFetch = accepted();
    for (const header of [null, '', SECRET, `Basic ${SECRET}`, `Bearer ${SECRET}x`, 'Bearer ']) {
      expect(await runSyntheticLead(header, { env, fetch: doorFetch, now })).toEqual({
        status: 401,
        body: { error: 'unauthorized' },
      });
    }
    expect(doorFetch).not.toHaveBeenCalled();
  });

  it('stays shut (401) when CRON_SECRET is unset or shorter than 16 characters', async () => {
    const doorFetch = accepted();
    for (const CRON_SECRET of [undefined, '', 'short-secret']) {
      const res = await runSyntheticLead(`Bearer ${CRON_SECRET ?? ''}`, {
        env: { ...env, CRON_SECRET },
        fetch: doorFetch,
        now,
      });
      expect(res).toEqual({ status: 401, body: { error: 'unauthorized' } });
    }
    expect(doorFetch).not.toHaveBeenCalled();
  });

  it('the GET handler answers 401, no-store, when the request carries no secret', async () => {
    vi.stubEnv('CRON_SECRET', SECRET);
    const res = await GET(new Request('http://localhost/api/cron/synthetic-lead'));
    expect({
      status: res.status,
      cacheControl: res.headers.get('cache-control'),
      body: await res.json(),
    }).toEqual({ status: 401, cacheControl: 'no-store', body: { error: 'unauthorized' } });
  });
});

describe('synthetic lead — the body and the token class (W172)', () => {
  it("posts T14's smokeFields('hire') with the TEST token and answers 200 { data: { status, isTest } }", async () => {
    const doorFetch = accepted();
    expect(await runSyntheticLead(AUTH, { env, fetch: doorFetch, now })).toEqual({
      status: 200,
      body: { data: { status: 'HANDLED', isTest: true } },
    });
    expect(doorFetch).toHaveBeenCalledTimes(1);
    const [url, init] = doorFetch.mock.calls[0];
    expect(url).toBe('https://operations.example.com/api/website/v1/forms/hire');
    expect((init?.headers as Record<string, string>).Authorization).toBe(`Bearer ${TEST_TOKEN}`);
    const sent = JSON.parse(String(init?.body));
    expect(sent).toEqual(syntheticLeadEnvelope(stampOf(NOW)));
    expect(sent.fields).toEqual(smokeFields('hire', 'cron-20261001T060007Z'));
    expect(sent.sourcePath).toBe(SYNTHETIC_LEAD_PATH);
    expect(sent.captchaToken).toBeUndefined(); // a test-class call without one skips Turnstile
  });

  it('stamps every run apart, so two runs inside one clock hour never dedupe onto one row', () => {
    expect(stampOf(NOW)).toBe('cron-20261001T060007Z');
    expect(stampOf(new Date('2026-10-01T06:30:00Z'))).not.toBe(
      stampOf(new Date('2026-10-01T06:00:00Z')),
    );
  });

  it('never falls back to the write token: 503 without a call unless the test slot holds a wst_ token', async () => {
    const doorFetch = accepted();
    for (const OPS_WEBSITE_TEST_TOKEN of [undefined, '', 'wst_short', WRITE_TOKEN]) {
      expect(
        await runSyntheticLead(AUTH, {
          env: { ...env, OPS_WEBSITE_TEST_TOKEN },
          fetch: doorFetch,
          now,
        }),
      ).toEqual({ status: 503, body: { error: 'synthetic lead not configured' } });
    }
    expect(doorFetch).not.toHaveBeenCalled();
    expect(testDoorEnv({ ...env, OPS_API_URL: '' })).toBeNull();
    expect(testDoorEnv(env)?.OPS_WEBSITE_WRITE_TOKEN).toBe(TEST_TOKEN);
  });

  it('answers 502 with the postForm kind when the door does not accept the lead', async () => {
    const res = await runSyntheticLead(AUTH, { env, fetch: door(404, { message: 'off' }), now });
    expect(res).toEqual({ status: 502, body: { error: 'off' } });
  });

  it('answers 500 when the door says isTest:false — the slot held a write-class token', async () => {
    const res = await runSyntheticLead(AUTH, { env, fetch: accepted(false), now });
    expect(res).toEqual({ status: 500, body: { error: 'not test-class' } });
  });
});

describe('synthetic lead — under the Hobby 10 s function cap (W201, W74)', () => {
  it("postForm's ONE shared deadline is ≤ 9 s and covers the attempt and its single retry", () => {
    // The route passes no timeoutMs of its own, so this constant IS the cron path's worst case.
    expect(ATTEMPT_TIMEOUT_MS).toBeLessThanOrEqual(9_000);
    expect(MAX_ATTEMPTS).toBe(2);
  });

  it('a hanging door is abandoned at the deadline and never retried: one call, 502 unavailable', async () => {
    // Honours the AbortSignal exactly as undici does: rejects with the signal's own reason.
    const hanging = vi.fn<typeof fetch>(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
        }),
    );
    const started = Date.now();
    const res = await runSyntheticLead(AUTH, { env, fetch: hanging, now, timeoutMs: 30 });
    expect(res).toEqual({ status: 502, body: { error: 'unavailable' } });
    expect(hanging).toHaveBeenCalledTimes(1);
    expect(Date.now() - started).toBeLessThan(5_000);
  });

  it('a connection-level failure is retried once under the SAME deadline, then the 200 stands', async () => {
    const flaky = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(ACCEPTED_BODY(true)), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      );
    const res = await runSyntheticLead(AUTH, { env, fetch: flaky, now });
    expect(res).toEqual({ status: 200, body: { data: { status: 'HANDLED', isTest: true } } });
    expect(flaky).toHaveBeenCalledTimes(2);
    const [, first] = flaky.mock.calls[0];
    const [, second] = flaky.mock.calls[1];
    expect(first?.signal).toBeInstanceOf(AbortSignal);
    expect(second?.signal).toBe(first?.signal); // one deadline, not a fresh budget per attempt
  });
});

describe('vercel.json schedules the route (W172, W201)', () => {
  it('has one cron on /api/cron/synthetic-lead, daily at 06:00 UTC — the only cadence Hobby runs', () => {
    const file = join(__dirname, '..', '..', '..', '..', '..', 'vercel.json');
    const config = JSON.parse(readFileSync(file, 'utf8')) as {
      crons?: { path: string; schedule: string }[];
    };
    const crons = (config.crons ?? []).filter((c) => c.path === SYNTHETIC_LEAD_PATH);
    expect(crons).toHaveLength(1);
    // W201: a sub-daily expression fails a Hobby deployment. The Pro switch to `*/30 * * * *`
    // changes this line in the same commit as vercel.json.
    expect(crons[0].schedule).toBe('0 6 * * *');
  });
});
