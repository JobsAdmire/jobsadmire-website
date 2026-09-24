import 'server-only';
import { z } from 'zod';
import type { FormKey } from '@/analytics/forms';
import { doorConfig } from './env';
import type { PostFormResult, PostFormVisitor } from './types';
import { isTimeout, visitorHeaders } from './visitor';
import type { WireEnvelope } from './wire';

export type { PostFormOk, PostFormResult, PostFormVisitor } from './types';

/** Test seams only — production callers pass nothing. */
export type PostFormDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };

/** W74 (amends W3): the call's deadline — longer than Ops' own 6 s wait on Cloudflare's
 *  siteverify, so a slow captcha check answers instead of timing out. ONE deadline for the
 *  whole call: the one retry runs under what is left of it, so the worst case is ≈ 9 s. */
export const ATTEMPT_TIMEOUT_MS = 9000;
/** The first attempt plus the one retry after a connection-level failure (W74). */
export const MAX_ATTEMPTS = 2;

const OkSchema = z.object({
  data: z.object({
    id: z.string().min(1),
    status: z.enum(['RECEIVED', 'HANDLED', 'FAILED', 'SPAM']),
    isTest: z.boolean(),
    replayed: z.boolean(),
    captchaDegraded: z.boolean(),
    error: z.string().nullable(),
  }),
});

const messageOf = (json: unknown): string =>
  typeof json === 'object' &&
  json !== null &&
  typeof (json as { message?: unknown }).message === 'string'
    ? (json as { message: string }).message
    : 'rejected';

/** HTTP status → result. An answer is never retried (W74). Logs carry the form key and the
 *  status class only — never the token, never a field. */
async function mapResponse(res: Response, formKey: FormKey): Promise<PostFormResult> {
  const { status } = res;
  const json: unknown = await res.json().catch(() => null);
  if (status === 200) {
    const parsed = OkSchema.safeParse(json);
    if (parsed.success) return { kind: 'ok', ...parsed.data.data };
    // R28: a 200 that is not the door's JSON (a login wall, a proxy page) is an outage.
    console.error('[postForm] malformed 200 from the door', { formKey });
    return { kind: 'unavailable', cause: 'server' };
  }
  if (status === 401) {
    console.error('[postForm] 401 — write token rejected or not configured on the door', {
      formKey,
    });
    return { kind: 'unauthorized' };
  }
  if (status === 403) return { kind: 'captcha' };
  if (status === 404) {
    // Newsletter answers 404 by design in Phase A (D14); the module flag off is the same code.
    console.warn('[postForm] 404 — door off or form inactive', { formKey });
    return { kind: 'off' };
  }
  if (status === 429) return { kind: 'tripped' };
  if (status >= 500) return { kind: 'unavailable', cause: 'server' };
  console.error('[postForm] rejected', { formKey, status });
  return { kind: 'invalid', message: messageOf(json) };
}

/**
 * `POST ${OPS_API_URL}/api/website/v1/forms/${formKey}` with the write token (D6, D11).
 * Server-only: the browser never sees this URL, this token or this call.
 *
 * W74 retry rule (amends W3): at most ONE immediate retry, and only when the first attempt
 * failed at the CONNECTION level — `fetch` rejected without any response (DNS, refused,
 * reset). A timeout or any answer (5xx included) is final: a request that reached the door
 * may already have spent its single-use Turnstile token (Ops waits up to 6 s for siteverify),
 * and re-sending it would earn a 403, not `replayed`. Both attempts share one
 * `ATTEMPT_TIMEOUT_MS` deadline, so the worst case is ≈ 9 s. After that the caller shows the
 * visitor fallback panel — there is no queue on Vercel.
 */
export async function postForm(
  formKey: FormKey,
  envelope: WireEnvelope,
  visitor: PostFormVisitor,
  deps: PostFormDeps = {},
): Promise<PostFormResult> {
  const door = doorConfig(deps.env ?? process.env);
  if (!door) {
    console.error('[postForm] OPS_API_URL / OPS_WEBSITE_WRITE_TOKEN not configured', { formKey });
    return { kind: 'unauthorized' };
  }
  const doFetch = deps.fetch ?? fetch;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${door.token}`,
    'Content-Type': 'application/json',
    ...visitorHeaders(visitor),
  };
  const url = `${door.base}/api/website/v1/forms/${formKey}`;
  const body = JSON.stringify(envelope);
  // One deadline for the whole call — the retry gets what is left of it, not a fresh budget.
  const signal = AbortSignal.timeout(deps.timeoutMs ?? ATTEMPT_TIMEOUT_MS);

  for (let attempt = 1; ; attempt++) {
    let res: Response;
    try {
      res = await doFetch(url, { method: 'POST', headers, body, cache: 'no-store', signal });
    } catch (err) {
      if (!isTimeout(err) && attempt < MAX_ATTEMPTS) continue; // connection-level: retry once
      const cause = isTimeout(err) ? 'timeout' : 'network';
      console.error('[postForm] unavailable', { formKey, cause, attempt });
      return { kind: 'unavailable', cause };
    }
    const mapped = await mapResponse(res, formKey);
    if (mapped.kind === 'unavailable')
      console.error('[postForm] unavailable', { formKey, cause: mapped.cause, attempt });
    return mapped;
  }
}
