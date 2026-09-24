import 'server-only';
import { doorBase, doorConfig } from './env';
import {
  FormActionError,
  FormDoorError,
  type FormErrorResult,
  type PostFormVisitor,
} from './types';
import { isTimeout, visitorHeaders } from './visitor';

/**
 * W29 — the two upload doors a page calls from an async `toFields` BEFORE the envelope is
 * built (docs/INTEGRATIONS.md I4/I5). Both return only the object KEY the catalog expects
 * (`cvKey`, `evidenceKeys[]`); the browser never talks to storage or to Operations.
 *
 * Refusals are visitor-side (`FormActionError` with `field` + code `file` → the error text
 * lands under the input) or door-side (`FormDoorError` → the same fallback panel `postForm`
 * would show). One attempt each — a retry would upload the bytes twice; the form post's own
 * retry rule (W74: once, connection-level failures only) does not apply here.
 */

/**
 * W73/W116: ONE cap for every file, 3 MB. The bytes travel browser → Vercel inside a server
 * action, and a Vercel function body is capped at 4.5 MB (`next.config.ts` raises Next's own
 * 1 MB server-action limit to `bodySizeLimit: '4mb'`), so the doors' own caps — careers-public
 * 5 MB, fraud-evidence 8 MB — are unreachable from this site. The cap sits 1 MB under that
 * body limit: the other fields and the multipart framing ride in the same body, and a file
 * just under a 4 MB cap would overflow it — Next would refuse the body before the action ran,
 * showing the `unavailable` panel instead of a `file` error under the input. A multi-file
 * form uploads ONE file per server-action call (docs/ARCHITECTURE.md § Forms flow, Uploads).
 */
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
/** The CV cap — `MAX_UPLOAD_BYTES` (W116; the careers door itself takes 5 MB). */
export const MAX_CV_BYTES = MAX_UPLOAD_BYTES;
/** The per-file evidence cap — `MAX_UPLOAD_BYTES` (W116; the door itself takes 8 MB). */
export const MAX_EVIDENCE_BYTES = MAX_UPLOAD_BYTES;
/** website/fraud-evidence-file.ts: three files per report. */
export const MAX_EVIDENCE_FILES = 3;
export const UPLOAD_TIMEOUT_MS = 15_000;

/** What the door hands back — mirrored from the catalog's `cvKey` / `evidenceKeys` patterns. */
const CV_KEY_RE = /^careers-cv\/[A-Za-z0-9._-]+\.pdf$/i;
const EVIDENCE_KEY_RE = /^website-fraud\/[A-Za-z0-9._-]+$/;

export type UploadDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };
type Opts = { field?: string } & UploadDeps;

/** A `FormData` entry that is a file (a string entry is never one). */
export function isFile(v: unknown): v is File {
  return typeof File !== 'undefined' && v instanceof File;
}

const refuse = (field: string, why: string) =>
  new FormActionError(why, { name: field, code: 'file' });

/** Non-2xx / no answer → the door-side result the fallback panel understands. */
function doorFailure(status: number): FormErrorResult {
  if (status === 401) return { kind: 'unauthorized' };
  if (status === 404) return { kind: 'off' };
  if (status === 429) return { kind: 'tripped' };
  return { kind: 'unavailable', cause: 'server' };
}

async function send(
  url: string,
  file: File,
  headers: Record<string, string> | undefined,
  deps: UploadDeps,
): Promise<{ status: number; json: unknown }> {
  const body = new FormData();
  body.append('file', file, file.name);
  const doFetch = deps.fetch ?? fetch;
  let res: Response;
  try {
    res = await doFetch(url, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(deps.timeoutMs ?? UPLOAD_TIMEOUT_MS),
    });
  } catch (err) {
    throw new FormDoorError({ kind: 'unavailable', cause: isTimeout(err) ? 'timeout' : 'network' });
  }
  return { status: res.status, json: await res.json().catch(() => null) };
}

const keyOf = (json: unknown): unknown =>
  typeof json === 'object' && json !== null && typeof (json as { data?: unknown }).data === 'object'
    ? ((json as { data: { key?: unknown } }).data?.key ?? null)
    : null;

/**
 * `POST ${OPS_API_URL}/api/careers/upload-cv` (public, multipart `file`, PDF ≤ 3 MB here). The
 * key comes back as `careers-cv/<uuid><ext>`, so the sent filename must end in `.pdf` for the
 * catalog's `cvKey` pattern to accept it — checked here, not left to the door.
 */
export async function uploadCv(file: File, opts: Opts = {}): Promise<{ cvKey: string }> {
  const field = opts.field ?? 'cv';
  if (file.size === 0) throw refuse(field, 'empty file');
  if (file.type !== 'application/pdf' || !/\.pdf$/i.test(file.name))
    throw refuse(field, 'not a PDF');
  if (file.size > MAX_CV_BYTES) throw refuse(field, 'over 3 MB');
  const base = doorBase(opts.env ?? process.env);
  if (!base) {
    console.error('[uploadCv] OPS_API_URL not configured');
    throw new FormDoorError({ kind: 'unauthorized' });
  }
  const { status, json } = await send(`${base}/api/careers/upload-cv`, file, undefined, opts);
  if (status === 400) throw refuse(field, 'door refused the file');
  if (status < 200 || status >= 300) {
    console.error('[uploadCv] door answered', { status });
    throw new FormDoorError(doorFailure(status));
  }
  const key = keyOf(json);
  if (typeof key !== 'string' || !CV_KEY_RE.test(key)) {
    console.error('[uploadCv] malformed answer from the door');
    throw new FormDoorError({ kind: 'unavailable', cause: 'server' });
  }
  return { cvKey: key };
}

/**
 * `POST ${OPS_API_URL}/api/website/v1/uploads/fraud-evidence` with the write token — the
 * door sniffs the bytes (JPEG/PNG/WEBP/PDF), so the client-declared type is not checked here;
 * the route takes ONLY the `file` part (any other part is a 400). A null `key` is the test
 * token's dry run, which the visitor path never uses — treated as an outage, never as success.
 */
export async function uploadFraudEvidence(
  file: File,
  visitor: PostFormVisitor,
  opts: Opts = {},
): Promise<{ key: string }> {
  const field = opts.field ?? 'evidence';
  if (file.size === 0) throw refuse(field, 'empty file');
  if (file.size > MAX_EVIDENCE_BYTES) throw refuse(field, 'over 3 MB');
  const door = doorConfig(opts.env ?? process.env);
  if (!door) {
    console.error('[uploadFraudEvidence] OPS_API_URL / OPS_WEBSITE_WRITE_TOKEN not configured');
    throw new FormDoorError({ kind: 'unauthorized' });
  }
  const headers = { Authorization: `Bearer ${door.token}`, ...visitorHeaders(visitor) };
  const { status, json } = await send(
    `${door.base}/api/website/v1/uploads/fraud-evidence`,
    file,
    headers,
    opts,
  );
  if (status === 400) throw refuse(field, 'door refused the file');
  if (status < 200 || status >= 300) {
    console.error('[uploadFraudEvidence] door answered', { status });
    throw new FormDoorError(doorFailure(status));
  }
  const key = keyOf(json);
  if (typeof key !== 'string' || !EVIDENCE_KEY_RE.test(key)) {
    console.error('[uploadFraudEvidence] no usable key from the door (dry run or malformed)');
    throw new FormDoorError({ kind: 'unavailable', cause: 'server' });
  }
  return { key };
}
