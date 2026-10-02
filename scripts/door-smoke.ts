/**
 * `npm run door:smoke` — the headless, TEST-CLASS probe of the Operations door (T14; the
 * manual form of T15's synthetic lead). Refuses to run with a write token: a smoke that files
 * real inquiries is the incident it exists to prevent.
 *
 *   OPS_API_URL=https://operations.jobsadmire.com OPS_WEBSITE_TEST_TOKEN=wst_… npm run door:smoke [-- --careers] [--json]
 *
 * What it does, in order: GET /ping → one POST per form key (test class: full validation,
 * dedupe, a row with isTest:true, dryRun handler, no captcha when no token — Ops X16) → the
 * deliberate replay (hire, same body twice → replayed:true) → the deliberate 400 (hire with
 * country 'Turkey') → the unknown key → prints the Markdown table for the ledger. `--careers`
 * also reads the first live opening and uploads a 1-page PDF to the public
 * `/api/careers/upload-cv`, then smokes `careers` with THAT opening's own `country` (W105 — a
 * hardcoded 'TR' would 200+FAILED the residency rule against a non-TR opening and this script
 * would wrongly call the row `ok`); it leaves one orphan object in `careers-cv/` per run (off by
 * default — never in an automated run, W171). Exit 1 when any row's `pass` is false.
 */
import { FORM_KEYS, type FormKey } from '../src/analytics/forms';
import {
  classifySmoke,
  expectedSmokeKind,
  formatSmokeTable,
  smokeEnvelope,
  smokeFields,
  type SmokeRow,
} from './door-smoke.lib';

const MIN_TOKEN = 20;
const TIMEOUT_MS = 8000;

function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

async function main(): Promise<number> {
  const args = new Set(process.argv.slice(2));
  const base = env('OPS_API_URL')?.replace(/\/+$/, '');
  const token = env('OPS_WEBSITE_TEST_TOKEN');
  if (!base) throw new Error('OPS_API_URL is required');
  if (!token || token.length < MIN_TOKEN)
    throw new Error('OPS_WEBSITE_TEST_TOKEN (wst_…) is required — never the write token');
  if (token.startsWith('wsw_'))
    throw new Error(
      'refusing to smoke with a write-class token (wsw_…): it would file real inquiries',
    );
  if (env('OPS_WEBSITE_WRITE_TOKEN') === token)
    throw new Error('OPS_WEBSITE_TEST_TOKEN equals OPS_WEBSITE_WRITE_TOKEN — refusing');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const call = async (
    path: string,
    init?: RequestInit,
  ): Promise<{ status: number; body: unknown }> => {
    const res = await fetch(`${base}${path}`, {
      ...init,
      headers: { ...headers, ...(init?.headers ?? {}) },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body: unknown = await res.json().catch(() => null);
    return { status: res.status, body };
  };
  const post = (key: string, envelope: unknown) =>
    call(`/api/website/v1/forms/${key}`, { method: 'POST', body: JSON.stringify(envelope) });

  // 1. ping — the door's own facts, printed verbatim (no secret in them).
  const ping = await call('/api/website/v1/ping');
  console.log(`ping ${ping.status} ${JSON.stringify(ping.body)}`);
  if (ping.status === 404)
    console.log(
      'door is DARK (module flag off or unknown route) — every form row below will be `off`',
    );

  const stamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
  const rows: SmokeRow[] = [];
  const record = (
    formKey: string,
    http: number,
    body: unknown,
    expected: SmokeRow['expected'],
    label = formKey,
  ) => {
    const c = classifySmoke(formKey, http, body);
    // `ok` + FAILED is a handler failure (RC26 visitor error, or an infra failure with error null);
    // the kernel shows the visitor the `failed` panel for it, so the smoke never counts it a pass.
    const pass = c.kind === expected && c.doorStatus !== 'FAILED';
    rows.push({ ...c, formKey: label, expected, pass });
  };

  // 2. one body per key.
  for (const key of FORM_KEYS) {
    if (key === 'careers' && !args.has('--careers')) continue;
    let extra: { cvKey?: string; openingSlug?: string; country?: string } = {};
    if (key === 'careers') {
      const openings = await call('/api/careers/openings');
      const list = Array.isArray((openings.body as { data?: unknown[] })?.data)
        ? (openings.body as { data: Array<{ slug?: string; country?: string }> }).data
        : [];
      const first = list[0] ?? null;
      if (!first?.slug || !first?.country) {
        console.log('careers: no public opening — skipped');
        continue;
      }
      const pdf = new Blob(
        [
          `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n`,
        ],
        { type: 'application/pdf' },
      );
      const form = new FormData();
      form.append('file', pdf, 'door-smoke.pdf');
      const up = await fetch(`${base}/api/careers/upload-cv`, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const upBody = (await up.json().catch(() => null)) as { data?: { key?: string } } | null;
      if (!upBody?.data?.key) {
        console.log(`careers: upload-cv answered ${up.status} — skipped`);
        continue;
      }
      extra = {
        cvKey: upBody.data.key,
        openingSlug: first.slug,
        country: first.country.toUpperCase(),
      };
    }
    const r = await post(
      key,
      smokeEnvelope(key as FormKey, 'en', stamp, smokeFields(key as FormKey, stamp, extra)),
    );
    record(key, r.status, r.body, expectedSmokeKind(key as FormKey));
  }

  // 3. replay: identical body twice inside one clock hour → the second answers replayed:true.
  const replayBody = smokeEnvelope('hire', 'tr', `${stamp}-replay`);
  const first = await post('hire', replayBody);
  const second = await post('hire', replayBody);
  record('hire', first.status, first.body, 'ok', 'hire (replay #1)');
  const c2 = classifySmoke('hire', second.status, second.body);
  rows.push({
    ...c2,
    formKey: 'hire (replay #2)',
    expected: 'ok',
    pass:
      c2.kind === 'ok' &&
      c2.doorStatus !== 'FAILED' &&
      c2.replayed === true &&
      c2.id === classifySmoke('hire', first.status, first.body).id,
  });

  // 4. the deliberate 400 — the catalog's own message, proving the `invalid` mapping.
  const bad = await post(
    'hire',
    smokeEnvelope('hire', 'en', `${stamp}-bad`, {
      ...smokeFields('hire', `${stamp}-bad`),
      country: 'Turkey',
    }),
  );
  record('hire', bad.status, bad.body, 'invalid', 'hire (country: Turkey)');

  // 5. the unknown key → 404 'Unknown form.' (same `off` kind as a dark door).
  const unknown = await post('nope', smokeEnvelope('hire', 'en', `${stamp}-unknown`));
  record('nope', unknown.status, unknown.body, 'off', 'nope (unknown key)');

  const table = formatSmokeTable(rows);
  console.log(
    args.has('--json')
      ? JSON.stringify({ base, stamp, ping: ping.body, rows }, null, 2)
      : `\n${table}\n`,
  );
  return rows.every((r) => r.pass) ? 0 : 1;
}

main()
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(2);
  });
