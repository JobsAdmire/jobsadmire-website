/** @vitest-environment node */
import { execFileSync, spawnSync } from 'node:child_process';
import { describe, expect, it, vi } from 'vitest';
import { GATE_ROUTE_TABLE, GATE_ROUTES, INDEXABLE_GATE_ROUTES } from '../e2e/routes';
import { careersDetailRoutes } from './gate-routes.mjs';

// The .mjs is what scripts/gate.sh reads (W21); spawn it exactly as the shell does. tsx's
// loader may print an ExperimentalWarning on stderr — stdout is the contract, so stderr is dropped.
const run = (...args: string[]) =>
  execFileSync(process.execPath, ['scripts/gate-routes.mjs', ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    // W93: the child process must not accidentally reach a real door — OPS_API_URL is stripped
    // so every spawn below exercises the "detail rows skipped" path, whatever the shell running
    // this test happens to export.
    env: { ...process.env, OPS_API_URL: '' },
  });

const isEn = (p: string) => p === '/en' || p.startsWith('/en/');

/** Minimal env literal cast the way src/app/api/site-health/ops.test.ts casts `pingOps`'s. */
const env = (o: Record<string, string>) => o as NodeJS.ProcessEnv;

describe('gate routes (W21)', () => {
  it('every path is external, unique and starts with /', () => {
    for (const p of GATE_ROUTES) expect(p.startsWith('/')).toBe(true);
    expect(new Set(GATE_ROUTES).size).toBe(GATE_ROUTES.length);
    expect(GATE_ROUTES).toEqual(GATE_ROUTE_TABLE.map((r) => r.path));
  });

  it('carries both locales for every indexable page', () => {
    // Each page task appends its two locale paths (W21): the EN and TR halves must stay equal.
    const en = INDEXABLE_GATE_ROUTES.filter(isEn);
    const tr = INDEXABLE_GATE_ROUTES.filter((p) => !isEn(p));
    expect(en.length).toBe(tr.length);
    expect(tr).toContain('/');
    expect(en).toContain('/en');
  });

  it('sweeps the noindex conversion page but never audits it', () => {
    expect(GATE_ROUTES).toContain('/tesekkurler?form=hire');
    expect(INDEXABLE_GATE_ROUTES).not.toContain('/tesekkurler?form=hire');
    expect(INDEXABLE_GATE_ROUTES).toEqual(
      GATE_ROUTE_TABLE.filter((r) => r.indexable).map((r) => r.path),
    );
  });

  it('gate-routes.mjs prints the indexable routes, one per line', () => {
    expect(run().split('\n').filter(Boolean)).toEqual([...INDEXABLE_GATE_ROUTES]);
  }, 30_000);

  it('--all prints every gate route and --json prints an array', () => {
    expect(run('--all').split('\n').filter(Boolean)).toEqual([...GATE_ROUTES]);
    expect(JSON.parse(run('--json'))).toEqual([...INDEXABLE_GATE_ROUTES]);
  }, 30_000);

  it('refuses an unknown flag', () => {
    expect(() => run('--bogus')).toThrow();
  }, 30_000);

  it('says "detail rows skipped (door not configured)" on stderr, never on stdout (W93)', () => {
    // stdout is what gate.sh reads as LH_PATHS: the message must stay out of it.
    const r = spawnSync(process.execPath, ['scripts/gate-routes.mjs'], {
      encoding: 'utf8',
      env: { ...process.env, OPS_API_URL: '' },
    });
    expect(r.status).toBe(0);
    expect(r.stderr).toContain('gate-routes: detail rows skipped (door not configured)');
    expect(r.stdout.split('\n').filter(Boolean)).toEqual([...INDEXABLE_GATE_ROUTES]);
  }, 30_000);
});

// W93: the first open careers opening, fetched from the public Ops endpoint, becomes two detail
// gate rows — never a hand-maintained pair, since the slug is live content. gate-routes.mjs
// exports the fetcher directly (dependency-injected env/fetch, the pingOps(env, f) idiom already
// used by src/app/api/site-health/ops.ts) so this suite never spawns a child process or a
// network call to prove it.
describe('careersDetailRoutes (W93)', () => {
  it('returns no rows when OPS_API_URL is unset — no fetch attempted', async () => {
    const fetchMock = vi.fn();
    expect(await careersDetailRoutes(env({}), fetchMock as unknown as typeof fetch)).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('appends /kariyer/<slug> + /en/careers/<slug> for the first opening within 3s', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [{ slug: 'senior-welder-antalya' }, { slug: 'x' }] }), {
        status: 200,
      }),
    );
    const rows = await careersDetailRoutes(
      env({ OPS_API_URL: 'https://operations.example.com' }),
      fetchMock as unknown as typeof fetch,
    );
    expect(rows).toEqual(['/kariyer/senior-welder-antalya', '/en/careers/senior-welder-antalya']);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://operations.example.com/api/careers/openings');
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('returns no rows on a network error (the CLI then says so on stderr — spawn case above)', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('timeout'));
    const rows = await careersDetailRoutes(
      env({ OPS_API_URL: 'https://operations.example.com' }),
      fetchMock as unknown as typeof fetch,
    );
    expect(rows).toEqual([]);
  });

  it('gives up on a door that never answers after 3 s — the fetch honours the abort', async () => {
    vi.useFakeTimers();
    // AbortSignal.timeout runs on Node's internal timer list, out of fake timers' reach: rebuild
    // it on the (faked) global setTimeout so the 3 s can be stepped deterministically.
    const timeout = vi.spyOn(AbortSignal, 'timeout').mockImplementation((ms: number) => {
      const c = new AbortController();
      setTimeout(() => c.abort(new DOMException('The operation timed out.', 'TimeoutError')), ms);
      return c.signal;
    });
    try {
      // A door that never answers, but honours its signal the way fetch does.
      const fetchMock = vi.fn(
        (_url: string, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
          }),
      );
      const rows = careersDetailRoutes(
        env({ OPS_API_URL: 'https://x.test' }),
        fetchMock as unknown as typeof fetch,
      );
      expect(timeout).toHaveBeenCalledWith(3_000);
      let settled = false;
      void rows.finally(() => {
        settled = true;
      });
      await vi.advanceTimersByTimeAsync(2_999);
      expect(settled).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      await expect(rows).resolves.toEqual([]);
    } finally {
      timeout.mockRestore();
      vi.useRealTimers();
    }
  });

  it('returns no rows on a non-200, an empty list or a malformed body', async () => {
    const f = (status: number, body: unknown) =>
      vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
    expect(
      await careersDetailRoutes(
        env({ OPS_API_URL: 'https://x.test' }),
        f(500, {}) as unknown as typeof fetch,
      ),
    ).toEqual([]);
    expect(
      await careersDetailRoutes(
        env({ OPS_API_URL: 'https://x.test' }),
        f(200, { data: [] }) as unknown as typeof fetch,
      ),
    ).toEqual([]);
    expect(
      await careersDetailRoutes(
        env({ OPS_API_URL: 'https://x.test' }),
        f(200, { not: 'a list' }) as unknown as typeof fetch,
      ),
    ).toEqual([]);
  });
});
