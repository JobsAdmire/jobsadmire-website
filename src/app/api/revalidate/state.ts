/** When the last successful revalidate ran, for `/api/site-health`'s `REVALIDATE_STALE`
 *  check. Module-level and therefore best-effort on serverless: a cold instance reports
 *  `null` and a redeploy forgets, so a single `fail` is a hint, not proof. WP5 replaces this
 *  with a real store (a KV row written by the route, read by site-health). */
let lastAt: number | null = null;

export function recordRevalidate(at: number = Date.now()): void {
  lastAt = at;
}

export function lastRevalidateAt(): number | null {
  return lastAt;
}
