import 'server-only';
import { doorConfig } from '@/forms/env';
import { ATTEMPT_TIMEOUT_MS, MAX_ATTEMPTS } from '@/forms/post';
import { isTimeout } from '@/forms/visitor';
import { classifyNewsletterResponse, isPlausibleToken } from './classify';
import type { NewsletterForwardKind, NewsletterForwardResult } from './types';

/** Test seams only — production callers pass nothing. */
export type ForwardDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };

/**
 * Forwards a mail-link token to Operations (docs/INTEGRATIONS.md I12): `GET …/newsletter/confirm`
 * or a body-less `POST …/newsletter/unsubscribe` (the RFC 8058 shape the door accepts), token in
 * the query, the write token as Bearer. Called ONLY from a visitor's click (the two server
 * actions) or the one-click route handler — never during a render, where a mail-link scanner
 * would spend the one-shot confirm token (W5, I12). The forms kernel's rule (W74/W117): one
 * shared `ATTEMPT_TIMEOUT_MS` deadline, one retry only after a connection-level failure, a
 * timeout or any answer final. Logs name the kind and the status only — never the token.
 */
export async function forwardNewsletterToken(
  kind: NewsletterForwardKind,
  token: unknown,
  deps: ForwardDeps = {},
): Promise<NewsletterForwardResult> {
  if (!isPlausibleToken(token)) return { kind: 'invalid' };
  const door = doorConfig(deps.env ?? process.env);
  if (!door) {
    console.error('[newsletter] OPS_API_URL / OPS_WEBSITE_WRITE_TOKEN not configured', { kind });
    return { kind: 'unconfigured' };
  }
  const doFetch = deps.fetch ?? fetch;
  const url = `${door.base}/api/website/v1/newsletter/${kind}?token=${encodeURIComponent(token)}`;
  const method = kind === 'confirm' ? 'GET' : 'POST';
  const headers = { Authorization: `Bearer ${door.token}`, Accept: 'application/json' };
  // One deadline for the whole call — the retry gets what is left of it (W117).
  const signal = AbortSignal.timeout(deps.timeoutMs ?? ATTEMPT_TIMEOUT_MS);

  for (let attempt = 1; ; attempt++) {
    let res: Response;
    try {
      res = await doFetch(url, { method, headers, cache: 'no-store', signal });
    } catch (err) {
      if (!isTimeout(err) && attempt < MAX_ATTEMPTS) continue; // connection-level: retry once
      const cause = isTimeout(err) ? 'timeout' : 'network';
      console.error('[newsletter] unavailable', { kind, cause, attempt });
      return { kind: 'unavailable', cause };
    }
    const body: unknown = await res.json().catch(() => null);
    const result = classifyNewsletterResponse(kind, res.status, body);
    if (result.kind === 'off' || result.kind === 'unauthorized' || result.kind === 'unavailable')
      console.error('[newsletter] the door refused', { kind, status: res.status });
    return result;
  }
}
