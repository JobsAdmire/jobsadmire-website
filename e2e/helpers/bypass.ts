import { siteFace } from './face';

/**
 * W137 — the ONE place the Vercel Deployment Protection bypass header is built.
 *
 * `VERCEL_AUTOMATION_BYPASS_SECRET` (Vercel → Deployment Protection → Protection Bypass for
 * Automation) lives only in the operator's shell for a run against a protected preview: never in
 * this repo, never a project variable, never logged. Blank or unset → `{}`, i.e. no header at
 * all: even an EMPTY non-safelisted header forces a CORS preflight on every cross-origin
 * CORS-mode request (web fonts, `fetch`), which third-party hosts refuse — it broke the design
 * page's Archivo and its map data in the pixel harness.
 *
 * Consumers: `playwright.config.ts` (`extraHTTPHeaders`), `scripts/gate.sh` and
 * `scripts/js-size.mjs` (`lhci collect --extra-headers`, through tsx), the placeholder counter
 * (its fetches) and `scripts/pixel-compare.ts` (the built origin's requests only, never the
 * design page's).
 * Playwright and Lighthouse attach it to every request the audited page makes, so third parties
 * the built page calls (GTM, Turnstile) may see it: accepted knowingly (W137, docs/DEPLOYMENT.md).
 */
export const BYPASS_HEADER = 'x-vercel-protection-bypass';

export function protectionBypassHeaders(
  env: NodeJS.ProcessEnv = process.env,
): Record<string, string> {
  const secret = env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  return secret ? { [BYPASS_HEADER]: secret } : {};
}

/** W135/W137: the one "you will hit the login wall" warning — for a preview-face target without
 *  the secret, and only then (a localhost or production run never needs it). Never the value. */
export function bypassWarning(
  baseUrl: string,
  env: NodeJS.ProcessEnv = process.env,
): string | null {
  if (siteFace(baseUrl, env) !== 'preview') return null;
  if (Object.keys(protectionBypassHeaders(env)).length) return null;
  return 'VERCEL_AUTOMATION_BYPASS_SECRET unset — a protected preview answers 401 (W137)';
}
