import { describe, expect, it } from 'vitest';
import { evaluate } from './checks';

describe('site-health evaluate', () => {
  it('is ok when every check passes', () => {
    expect(
      evaluate({ bundleTr: 'ok', bundleEn: 'ok', lastRevalidate: 'skip', opsPing: 'skip' }),
    ).toEqual({ ok: true, reasons: [] });
  });
  it('fails with reason codes', () => {
    expect(
      evaluate({ bundleTr: 'fail', bundleEn: 'ok', lastRevalidate: 'skip', opsPing: 'fail' }),
    ).toEqual({ ok: false, reasons: ['BUNDLE_TR', 'OPS_PING'] });
  });
});
