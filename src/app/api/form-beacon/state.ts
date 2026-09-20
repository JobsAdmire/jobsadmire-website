/** How many visitor fallback panels this instance has shown (D11's client beacon). Module-level
 *  and therefore best-effort on serverless, exactly like `revalidate/state.ts`: a cold instance
 *  starts at 0 and a redeploy forgets. It is a signal for `/api/site-health` and the console
 *  log beside it, not an audit trail — WP6's Sentry wiring carries the durable record. */
let count = 0;

export function recordFormBeacon(): void {
  count += 1;
}

export function formBeaconCount(): number {
  return count;
}

/** Tests only. */
export function resetFormBeacons(): void {
  count = 0;
}
