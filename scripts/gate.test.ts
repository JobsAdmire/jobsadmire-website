/** @vitest-environment node */
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

// N6 (final re-review): `gate.sh --profile=launch` runs its three launch checks — W20
// (`UNBUILT_PATHNAMES` empty), the W152/W158 dead-target sweep and the D26 content-readiness
// table — each to completion whatever the others return, so all three print even while W20 is
// red (it is, by design, until the last page lands); then it exits non-zero if any failed, before
// Playwright. `npx` is swapped for a stub that logs its arguments, fails the calls matching
// FAKE_NPX_FAIL and always fails `playwright` — so no case here ever gets past Playwright to
// `rm -rf .lighthouseci` or a Lighthouse run.
const ROOT = join(__dirname, '..');
const STUB = `#!/usr/bin/env bash
echo "$*" >> "$FAKE_NPX_LOG"
case "$*" in
  playwright*) exit 3 ;;
esac
if [ -n "\${FAKE_NPX_FAIL:-}" ] && printf '%s' "$*" | grep -Eq -- "$FAKE_NPX_FAIL"; then exit 1; fi
exit 0
`;

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function launch(fail: string) {
  const dir = mkdtempSync(join(tmpdir(), 'gate-launch-'));
  dirs.push(dir);
  const log = join(dir, 'npx.log');
  writeFileSync(join(dir, 'npx'), STUB);
  chmodSync(join(dir, 'npx'), 0o755);
  const run = spawnSync('bash', ['scripts/gate.sh', '--profile=launch'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${dir}:${process.env.PATH ?? ''}`,
      E2E_BASE_URL: 'http://127.0.0.1:9',
      REVALIDATE_SECRET: '',
      VERCEL_AUTOMATION_BYPASS_SECRET: '',
      FAKE_NPX_LOG: log,
      FAKE_NPX_FAIL: fail,
    },
  });
  const calls = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n') : [];
  return { status: run.status, output: `${run.stdout}${run.stderr}`, calls };
}

const W20 =
  'vitest run --config vitest.launch.config.mts scripts/launch/unbuilt-routes.launch-check.ts';
const SWEEP =
  'vitest run --config vitest.launch.config.mts scripts/launch/dead-targets.launch-check.ts';
const READINESS = 'tsx scripts/placeholder-count.ts';

describe('gate.sh --profile=launch (N6)', () => {
  it('runs all three launch checks while W20 and the sweep are red, then exits 1 before Playwright', () => {
    const { status, output, calls } = launch('vitest');
    expect(calls).toEqual([W20, SWEEP, READINESS]);
    expect(status).toBe(1);
    expect(output).toContain('gate: launch — FAILED: W20 dead-targets');
  }, 60_000);

  it('a red content-readiness table alone fails the profile too', () => {
    const { status, output, calls } = launch('placeholder-count');
    expect(calls).toEqual([W20, SWEEP, READINESS]);
    expect(status).toBe(1);
    expect(output).toContain('gate: launch — FAILED: content-readiness');
  }, 60_000);

  it('hands over to Playwright only when all three pass', () => {
    const { status, calls } = launch('');
    expect(calls).toEqual([W20, SWEEP, READINESS, 'playwright test']);
    expect(status).toBe(3); // the stub's Playwright — the script stops there, before Lighthouse
  }, 60_000);
});
