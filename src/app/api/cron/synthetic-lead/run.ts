import 'server-only';
import { authorize } from '@/app/api/revalidate/auth';
import { doorBase, WEBSITE_TOKEN_MIN_LENGTH } from '@/forms/env';
import { postForm, type PostFormVisitor } from '@/forms/post';
import { buildEnvelope, type WireEnvelope } from '@/forms/wire';
// Relative on purpose: the `@/` alias covers `src/` only, and `scripts/` is a sibling (the same
// reason site-health imports `contract/` relatively). T14's body builder, never re-encoded here.
import { smokeFields } from '../../../../../scripts/door-smoke.lib';

/** The route Vercel Cron calls, and the `sourcePath` the door records for each run. */
export const SYNTHETIC_LEAD_PATH = '/api/cron/synthetic-lead';
/** Ops mints test-class tokens as `wst_` + 48 hex (write-class: `wsw_`), so the prefix tells
 *  the two apart before any call is made. */
export const TEST_TOKEN_PREFIX = 'wst_';
/** No visitor: no IP header is sent; the UA names the caller on the door's row. */
const VISITOR: PostFormVisitor = { ip: null, ua: 'JobsAdmire synthetic-lead cron (W172)' };

export type SyntheticLeadDeps = {
  env?: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
  now?: () => Date;
  /** Test seam only (W201 pin): the route never passes one, so `postForm`'s own
   *  `ATTEMPT_TIMEOUT_MS` (≤ 9 s, shared by the attempt and its single retry) is the cron
   *  path's worst case — under Vercel Hobby's 10 s function cap with no retry change. */
  timeoutMs?: number;
};
export type SyntheticLeadResult = { status: number; body: Record<string, unknown> };

/** `cron-20261001T060007Z`. `smokeFields` puts it in `name`/`message`, so two runs inside one
 *  clock hour never dedupe onto one door row (`sourcePath` is not hashed). */
export function stampOf(now: Date): string {
  const iso = now.toISOString().replace(/\.\d{3}Z$/, 'Z'); // 2026-10-01T06:00:07Z
  return `cron-${iso.replace(/[-:]/g, '')}`;
}

/** T14's `hire` smoke body in the envelope every form post uses. No `captchaToken`: a
 *  test-class call without one skips Turnstile (Ops X16). */
export function syntheticLeadEnvelope(stamp: string): WireEnvelope {
  return buildEnvelope({
    locale: 'en',
    fields: smokeFields('hire', stamp),
    sourcePath: SYNTHETIC_LEAD_PATH,
  });
}

/** The env `postForm` reads, with the TEST-class token in the write-token slot, or null when
 *  the door URL is missing or `OPS_WEBSITE_TEST_TOKEN` is not a usable `wst_…` token. Never
 *  falls back to the write token: a write-class synthetic lead would file a real Inquiry,
 *  notification and autoresponder on every run. */
export function testDoorEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv | null {
  const token = env.OPS_WEBSITE_TEST_TOKEN?.trim();
  if (!doorBase(env) || !token) return null;
  if (token.length < WEBSITE_TOKEN_MIN_LENGTH || !token.startsWith(TEST_TOKEN_PREFIX)) return null;
  return { ...env, OPS_WEBSITE_WRITE_TOKEN: token };
}

/**
 * W172: Gate A row 8's synthetic lead. 401 unless `Authorization: Bearer $CRON_SECRET` (what
 * Vercel Cron sends; an unset or short secret keeps the route shut); 503 without a call when
 * the test-class door is not configured; 502 with the `postForm` kind when the door does not
 * accept the lead; 500 when the door answers `isTest: false`; 200 `{ data: { status, isTest } }`.
 * Never logs the secret, the token or a field.
 */
export async function runSyntheticLead(
  authorization: string | null,
  deps: SyntheticLeadDeps = {},
): Promise<SyntheticLeadResult> {
  const env = deps.env ?? process.env;
  const auth = authorize(authorization, env.CRON_SECRET);
  if (auth !== 'ok') {
    if (auth === 'disabled')
      console.error('[synthetic-lead] CRON_SECRET unset or shorter than 16 chars: route shut');
    return { status: 401, body: { error: 'unauthorized' } };
  }
  const doorEnv = testDoorEnv(env);
  if (!doorEnv) {
    console.error(
      '[synthetic-lead] OPS_API_URL or a wst_ OPS_WEBSITE_TEST_TOKEN missing: not posting',
    );
    return { status: 503, body: { error: 'synthetic lead not configured' } };
  }
  const stamp = stampOf((deps.now ?? (() => new Date()))());
  const result = await postForm('hire', syntheticLeadEnvelope(stamp), VISITOR, {
    env: doorEnv,
    fetch: deps.fetch,
    timeoutMs: deps.timeoutMs,
  });
  if (result.kind !== 'ok') {
    console.error('[synthetic-lead] the door did not accept the lead', {
      kind: result.kind,
      stamp,
    });
    return { status: 502, body: { error: result.kind } };
  }
  if (!result.isTest) {
    console.error('[synthetic-lead] the door answered isTest:false: the token is write-class', {
      id: result.id,
    });
    return { status: 500, body: { error: 'not test-class' } };
  }
  // No heartbeat mechanism exists yet (docs/OPERATING.md § Synthetic lead): this log line and the
  // 200 are the record until the external monitor issues a heartbeat URL.
  console.info('[synthetic-lead] ok', { status: result.status, id: result.id, stamp });
  return { status: 200, body: { data: { status: result.status, isTest: result.isTest } } };
}
