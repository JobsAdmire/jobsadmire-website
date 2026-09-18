export type CheckResult = 'ok' | 'fail' | 'skip';
export type Checks = {
  bundleTr: CheckResult;
  bundleEn: CheckResult;
  lastRevalidate: CheckResult;
  opsPing: CheckResult;
};
const CODES: Record<keyof Checks, string> = {
  bundleTr: 'BUNDLE_TR',
  bundleEn: 'BUNDLE_EN',
  lastRevalidate: 'REVALIDATE_STALE',
  opsPing: 'OPS_PING',
};
export function evaluate(c: Checks) {
  const reasons = (Object.keys(c) as (keyof Checks)[])
    .filter((k) => c[k] === 'fail')
    .map((k) => CODES[k]);
  return { ok: reasons.length === 0, reasons };
}
