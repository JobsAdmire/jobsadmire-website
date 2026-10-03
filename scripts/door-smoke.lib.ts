/**
 * The pure half of `npm run door:smoke` (T14) and the body builder T15's synthetic-lead cron
 * reuses. One valid body per form key = docs/INTEGRATIONS.md I4's REQUIRED sets, as code: a
 * 400 from the door means this table is wrong, not the door. Values are stable option KEYS
 * (W77), the shared `START_WHEN_KEYS` (W78), ISO-2 upper-case countries, ≥ 8-digit phones —
 * exactly what the pages send (verified per page against the built pages under
 * `src/app/[locale]/(site)/**` and the Operations catalog as built, W199).
 *
 * No `server-only` here (unit-tested, like src/content/pure.ts — R2); the runner carries the
 * token and is never imported by src/**.
 */
import { FORM_KEYS, type FormKey } from '../src/analytics/forms';
import { START_WHEN_KEYS } from '../src/forms/options';
import { buildEnvelope, type WireEnvelope, type WireFields } from '../src/forms/wire';
import type { Locale } from '../src/i18n/routing';

export const SMOKE_KEYS: readonly FormKey[] = FORM_KEYS;

export type SmokeKind =
  'ok' | 'invalid' | 'captcha' | 'off' | 'tripped' | 'unauthorized' | 'unavailable';

export type SmokeRow = {
  formKey: string;
  http: number;
  kind: SmokeKind;
  doorStatus: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM' | null;
  isTest: boolean | null;
  replayed: boolean | null;
  id: string | null;
  message: string | null;
  errors: string[];
  fallback: string | null;
  expected: SmokeKind;
  pass: boolean;
};

export type SmokeExtra = { cvKey?: string; openingSlug?: string; country?: string };

const NAME = (stamp: string) => `[door-smoke ${stamp}]`;
const EMAIL = 'door-smoke@jobsadmire.com';
const PHONE = '+905000000000';
const MESSAGE = (stamp: string) => `Synthetic test-class submission ${stamp} — no action needed.`;
/** The second entry of the shared W78 vocabulary (`month1`) — never an invented key. */
const START_WHEN: (typeof START_WHEN_KEYS)[number] = START_WHEN_KEYS[1];

/** One valid, catalog-conformant body per key. `stamp` rides in `name`/`message` so two runs
 *  inside one clock hour never dedupe onto the same row (`sourcePath` is NOT hashed). */
export function smokeFields(formKey: FormKey, stamp: string, extra: SmokeExtra = {}): WireFields {
  const name = NAME(stamp);
  switch (formKey) {
    case 'hire':
      return {
        name,
        company: 'Door Smoke Ltd',
        email: EMAIL,
        phone: PHONE,
        country: 'TR',
        iAm: 'direct_employer',
        sector: 'factory',
        roleNeeded: 'welder',
        headcount: '5',
        startWhen: START_WHEN,
        city: 'Antalya',
        message: MESSAGE(stamp),
      };
    case 'contact':
      return {
        name,
        email: EMAIL,
        phone: PHONE,
        company: 'Door Smoke Ltd',
        country: 'TR',
        iAm: 'direct_employer',
        topic: 'hire',
        subject: 'door smoke',
        city: 'Antalya',
        message: MESSAGE(stamp),
      };
    case 'partner':
      return {
        name,
        company: 'Door Smoke Sourcing',
        email: EMAIL,
        phone: PHONE,
        country: 'PK',
        track: 'sourcing',
        licence: 'LIC-SMOKE',
        candidatesPerYear: '50',
        trades: 'welder, cnc',
        city: 'Karachi',
        message: MESSAGE(stamp),
      };
    case 'workers':
      return {
        name,
        company: 'Door Smoke Ltd',
        email: EMAIL,
        phone: PHONE,
        country: 'TR',
        iAm: 'direct_employer',
        trade: 'welder',
        headcount: '3',
        startWhen: START_WHEN,
        city: 'Antalya',
        message: MESSAGE(stamp),
      };
    case 'callback':
      return {
        name,
        phone: PHONE,
        email: EMAIL,
        preferredTime: 'weekday am',
        topic: 'door smoke',
        city: 'Antalya',
      };
    case 'visit':
      return {
        name,
        company: 'Door Smoke Ltd',
        email: EMAIL,
        phone: PHONE,
        office: 'antalya',
        preferredDate: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
        preferredTime: 'am',
        message: MESSAGE(stamp),
      };
    case 'calculator':
      return {
        name,
        email: EMAIL,
        phone: PHONE,
        company: 'Door Smoke Ltd',
        country: 'TR',
        headcount: '10',
        trade: 'welder',
        durationMonths: '12',
        estimateSummary: `door smoke ${stamp}`,
        message: MESSAGE(stamp),
      };
    case 'careers': {
      if (!extra.cvKey || !extra.openingSlug)
        throw new Error(
          'careers smoke needs { cvKey, openingSlug, country } — read a real opening first',
        );
      // W105: the residency rule checks `country === opening.country.toUpperCase()`; a
      // hardcoded value would 200+FAILED against any opening not in that country, and a naive
      // classifier would wrongly count that as `ok`. The caller (door-smoke.ts) always passes
      // the opening's own country. (A TEST-class body is a dry run that returns before that
      // check — Ops `careers-apply.handler.ts` — so the smoke cannot see it; the opening's own
      // country keeps the body valid for a write-class caller of the same builder.)
      if (!extra.country)
        throw new Error('careers smoke needs the opening’s own country (residency rule)');
      return {
        openingSlug: extra.openingSlug,
        cvKey: extra.cvKey,
        name,
        email: EMAIL,
        phone: PHONE,
        country: extra.country,
        city: 'Antalya',
        language: 'tr,en',
        coverLetter: MESSAGE(stamp),
      };
    }
    case 'fraud':
      // description: min 20 — a fixed 60-char sentence + the stamp in reporterName only.
      return {
        reporterName: name,
        reporterEmail: EMAIL,
        reporterPhone: PHONE,
        description: 'Synthetic test-class fraud report; no evidence; ignore me.'.padEnd(60, '.'),
        suspectName: 'nobody',
        suspectContact: 'none',
      };
    case 'newsletter':
      return { email: EMAIL, name };
  }
}

export function smokeEnvelope(
  formKey: FormKey,
  locale: Locale,
  stamp: string,
  fields?: WireFields,
): WireEnvelope {
  return buildEnvelope({
    locale,
    fields: fields ?? smokeFields(formKey, stamp),
    sourcePath: `/door-smoke/${stamp}`,
  });
}

/** What a healthy door answers a test-class body: `ok` everywhere, `off` for the inactive newsletter (D14). */
export function expectedSmokeKind(formKey: FormKey): SmokeKind {
  return formKey === 'newsletter' ? 'off' : 'ok';
}

const OK_STATUSES = new Set(['RECEIVED', 'HANDLED', 'FAILED', 'SPAM']);
const str = (v: unknown): string | null => (typeof v === 'string' ? v : null);

/** postForm's status map (src/forms/post.ts `mapResponse`), without the retry — this script
 *  makes ONE call per body; W74's retry rule is the website's own concern, not the door's. */
export function classifySmoke(
  formKey: string,
  http: number,
  body: unknown,
): Omit<SmokeRow, 'expected' | 'pass'> {
  const base = {
    formKey,
    http,
    doorStatus: null,
    isTest: null,
    replayed: null,
    id: null,
    message: null,
    errors: [] as string[],
    fallback: null,
  };
  const obj = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const data = (typeof obj.data === 'object' && obj.data !== null ? obj.data : null) as Record<
    string,
    unknown
  > | null;
  if (http === 200) {
    if (
      data &&
      typeof data.id === 'string' &&
      typeof data.status === 'string' &&
      OK_STATUSES.has(data.status)
    ) {
      return {
        ...base,
        kind: 'ok',
        doorStatus: data.status as SmokeRow['doorStatus'],
        isTest: data.isTest === true,
        replayed: data.replayed === true,
        id: data.id,
        message: str(data.error),
      };
    }
    return { ...base, kind: 'unavailable', message: 'malformed 200 (not the door)' };
  }
  if (http === 401) return { ...base, kind: 'unauthorized', message: str(obj.message) };
  if (http === 403) return { ...base, kind: 'captcha', message: str(obj.message) };
  if (http === 404) return { ...base, kind: 'off', message: str(obj.message) };
  if (http === 429)
    return { ...base, kind: 'tripped', message: str(obj.message), fallback: str(obj.fallback) };
  if (http >= 500) return { ...base, kind: 'unavailable', message: str(obj.message) };
  const errors = Array.isArray(obj.errors)
    ? obj.errors.filter((e): e is string => typeof e === 'string')
    : [];
  return { ...base, kind: 'invalid', message: str(obj.message) ?? 'rejected', errors };
}

/** A table cell: `null`/`undefined` print as an em dash, everything else verbatim (pipes escaped). */
const cell = (v: unknown): string =>
  (v === null || v === undefined ? '—' : String(v)).replace(/\|/g, '\\|');

export function formatSmokeTable(rows: SmokeRow[]): string {
  const head = '| form | http | kind | door status | isTest | replayed | id | message | pass |';
  const sep = '|---|---|---|---|---|---|---|---|---|';
  const body = rows.map(
    (r) =>
      `| ${r.formKey} | ${r.http} | ${r.kind} | ${cell(r.doorStatus)} | ${cell(r.isTest)} | ${cell(r.replayed)} | ${cell(r.id)} | ${r.message ?? ''}${r.errors.length ? ` (${r.errors.join('; ')})` : ''} | ${r.pass ? '✓' : '✗'} |`,
  );
  return [head, sep, ...body].join('\n');
}
