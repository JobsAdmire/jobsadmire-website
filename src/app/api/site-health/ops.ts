import { z } from 'zod';
import { doorConfig } from '@/forms/env';
import type { CheckResult } from './checks';

export type OpsPing = {
  /** `ok` = the door answered the ping; `off` = 404 (module flag off — a failure since the door
   *  went live in production on 2026-09-24, W75); `unauthorized` = 401 (token rotated/missing); `unreachable` = 5xx, network,
   *  timeout or a 200 that is not the ping JSON; `unconfigured` = no `OPS_API_URL`/write token
   *  in this environment. */
  state: 'ok' | 'off' | 'unauthorized' | 'unreachable' | 'unconfigured';
  latencyMs: number | null;
  /** The door's own readiness facts (`WebsitePingResult`), surfaced for the owner's check — not
   *  folded into a reason code here (FORMS_DEGRADED/HANDLER_FAILED are WP3a/WP5's). */
  captcha: 'configured' | 'missing' | null;
  trippedForms: string[];
};

const PING_TIMEOUT_MS = 3000;
/** How much of an unused (non-200) body we read before cancelling the rest. */
const DISCARD_MAX_BYTES = 64 * 1024;

const PingSchema = z.object({
  data: z.object({
    captcha: z.enum(['configured', 'missing']).nullish(),
    trippedForms: z.array(z.string()).nullish(),
  }),
});

const NONE = { captcha: null, trippedForms: [] as string[] };

/** Reads and throws away a body we do not use — at most 64 KB, then cancels the rest (still
 *  under the request's 3 s signal) — so the connection goes back to the pool instead of
 *  waiting for the garbage collector. */
async function discardBody(res: Response): Promise<void> {
  const reader = res.body?.getReader();
  if (!reader) return;
  try {
    for (let read = 0; read < DISCARD_MAX_BYTES;) {
      const { done, value } = await reader.read();
      if (done) return;
      read += value.byteLength;
    }
    await reader.cancel();
  } catch {
    /* the state is already decided by the status */
  }
}

/** `GET ${OPS_API_URL}/api/website/v1/ping` with the write token (any class is accepted by
 *  the door; the write token is the one the forms use, so this proves the forms' credential). */
export async function pingOps(
  env: NodeJS.ProcessEnv = process.env,
  f: typeof fetch = fetch,
): Promise<OpsPing> {
  const door = doorConfig(env);
  if (!door) return { state: 'unconfigured', latencyMs: null, ...NONE };
  const started = Date.now();
  try {
    const res = await f(`${door.base}/api/website/v1/ping`, {
      headers: { Authorization: `Bearer ${door.token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(PING_TIMEOUT_MS),
    });
    const latencyMs = Date.now() - started;
    if (res.status === 200) {
      const parsed = PingSchema.safeParse(await res.json().catch(() => null));
      if (!parsed.success) return { state: 'unreachable', latencyMs, ...NONE };
      return {
        state: 'ok',
        latencyMs,
        captcha: parsed.data.data.captcha ?? null,
        trippedForms: parsed.data.data.trippedForms ?? [],
      };
    }
    await discardBody(res);
    if (res.status === 404) return { state: 'off', latencyMs, ...NONE };
    if (res.status === 401) return { state: 'unauthorized', latencyMs, ...NONE };
    return { state: 'unreachable', latencyMs, ...NONE };
  } catch {
    return { state: 'unreachable', latencyMs: null, ...NONE };
  }
}

/** W75: the door is live in production (since 2026-09-24), so a dark door (`off`, 404) is a
 *  failure like a rejected token or an unreachable host. Only `unconfigured` — no URL/token in
 *  this environment (local, a preview without secrets) — is `skip`. */
export function opsPingCheck(p: OpsPing): CheckResult {
  if (p.state === 'ok') return 'ok';
  if (p.state === 'unconfigured') return 'skip';
  return 'fail';
}
