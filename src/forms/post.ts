import 'server-only';
import { z } from 'zod';
import type { FormKey } from '@/analytics/forms';
import { doorConfig } from './env';
import type { PostFormResult, PostFormVisitor } from './types';
import type { WireEnvelope } from './wire';

export type { PostFormOk, PostFormResult, PostFormVisitor } from './types';

/** Test seams only — production callers pass nothing. */
export type PostFormDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };

/** W3: per-attempt timeout × at most two attempts = the 8 s budget, no sleep in between. */
export const ATTEMPT_TIMEOUT_MS = 4000;
export const MAX_ATTEMPTS = 2;
const MAX_UA = 500;

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

const isTimeout = (err: unknown) =>
  err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');

const messageOf = (json: unknown): string =>
  typeof json === 'object' &&
  json !== null &&
  typeof (json as { message?: unknown }).message === 'string'
    ? (json as { message: string }).message
    : 'rejected';

/** HTTP status → result. `unavailable` is the only kind the caller retries. Logs carry the
 *  form key and the status class only — never the token, never a field. */
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
 * W3 retry rule: at most ONE immediate retry, and only after a network error, a per-attempt
 * timeout or a 5xx — never after a 4xx. Every Ops deploy is a 30–60 s 502 window and the door
 * dedupes on `(formKey, requestHash, hourBucket)`, so the retry lands on the same row
 * (`replayed: true`) rather than creating a second lead. After that the caller shows the
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
  const timeoutMs = deps.timeoutMs ?? ATTEMPT_TIMEOUT_MS;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${door.token}`,
    'Content-Type': 'application/json',
  };
  if (visitor.ip) headers['X-Website-Visitor-Ip'] = visitor.ip;
  if (visitor.ua) headers['X-Website-Visitor-Ua'] = visitor.ua.slice(0, MAX_UA);
  const url = `${door.base}/api/website/v1/forms/${formKey}`;
  const body = JSON.stringify(envelope);

  let last: Extract<PostFormResult, { kind: 'unavailable' }> = {
    kind: 'unavailable',
    cause: 'network',
  };
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let res: Response;
    try {
      res = await doFetch(url, {
        method: 'POST',
        headers,
        body,
        cache: 'no-store',
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      last = { kind: 'unavailable', cause: isTimeout(err) ? 'timeout' : 'network' };
      continue;
    }
    const mapped = await mapResponse(res, formKey);
    if (mapped.kind !== 'unavailable') return mapped;
    last = mapped;
  }
  console.error('[postForm] unavailable after retry', { formKey, cause: last.cause });
  return last;
}
