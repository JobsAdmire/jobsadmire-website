import 'server-only';

/** Ops treats a stored token shorter than this as unset (`WEBSITE_TOKEN_MIN_LENGTH` in
 *  website.constants.ts); a placeholder value here is the same thing. */
export const WEBSITE_TOKEN_MIN_LENGTH = 20;

export type DoorConfig = { base: string; token: string };

/** `OPS_API_URL` without a trailing slash, or null when unset. */
export function doorBase(env: NodeJS.ProcessEnv = process.env): string | null {
  const raw = env.OPS_API_URL?.trim();
  return raw ? raw.replace(/\/+$/, '') : null;
}

/** The forms' credential pair, or null — the caller answers `unauthorized`/`unconfigured`
 *  without a network call. Never logged, never sent to the browser. */
export function doorConfig(env: NodeJS.ProcessEnv = process.env): DoorConfig | null {
  const base = doorBase(env);
  const token = env.OPS_WEBSITE_WRITE_TOKEN?.trim();
  if (!base || !token || token.length < WEBSITE_TOKEN_MIN_LENGTH) return null;
  return { base, token };
}
