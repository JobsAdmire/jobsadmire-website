import { z } from 'zod';
import { doorConfig } from '@/forms/env';
import type { CheckResult } from './checks';

export type OpsPing = {
  /** `ok` = the door answered the ping; `off` = 404 (module flag off, the Phase A default until
   *  the WP3a flip); `unauthorized` = 401 (token rotated/missing); `unreachable` = 5xx, network,
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

const PingSchema = z.object({
  data: z.object({
    captcha: z.enum(['configured', 'missing']).nullish(),
    trippedForms: z.array(z.string()).nullish(),
  }),
});

const NONE = { captcha: null, trippedForms: [] as string[] };

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
    if (res.status === 404) return { state: 'off', latencyMs, ...NONE };
    if (res.status === 401) return { state: 'unauthorized', latencyMs, ...NONE };
    return { state: 'unreachable', latencyMs, ...NONE };
  } catch {
    return { state: 'unreachable', latencyMs: null, ...NONE };
  }
}

/** `off` is `skip`, not `fail`, while the door is dark by configuration (Phase A). After the
 *  WP3a flip, T15's launch checklist turns `off` into a `fail` here — one line. */
export function opsPingCheck(p: OpsPing): CheckResult {
  if (p.state === 'ok') return 'ok';
  if (p.state === 'unauthorized' || p.state === 'unreachable') return 'fail';
  return 'skip';
}
