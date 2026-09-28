import { z } from 'zod';
import { FORM_KEYS } from '@/analytics/forms';
import { FORM_FALLBACK_KINDS } from '@/forms/types';
import { recordFormBeacon } from './state';

// The fallback panel's `navigator.sendBeacon` target (D11): a failed submission becomes
// visible here even if Sentry (WP6) is down. Text body (sendBeacon sends text/plain), never
// cached, never anything the visitor typed — the panel sends the form key, the kind (one of
// the seven `FormFallbackKind`s), the page, and the schema is `strict` so a body carrying
// anything else is refused.
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

// M11/§8 I: the beacon body is a fixed, tiny shape (formKey/kind/page) — a well-formed one never
// gets near this; a declared size over it is refused BEFORE `request.text()` reads a byte, so an
// oversized body never gets buffered at all (the earlier version read the whole thing first and
// only then found it malformed — a free way to inflate this route's own memory/CPU use).
const MAX_BEACON_BYTES = 4096;

const BeaconSchema = z
  .object({
    formKey: z.enum(FORM_KEYS),
    kind: z.enum(FORM_FALLBACK_KINDS),
    page: z.string().min(1).max(300),
  })
  .strict();

export async function POST(request: Request): Promise<Response> {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BEACON_BYTES) {
    return new Response(null, { status: 413, headers: NO_STORE });
  }
  const text = await request.text().catch(() => '');
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* not JSON */
  }
  const parsed = BeaconSchema.safeParse(json);
  if (!parsed.success) return new Response(null, { status: 400, headers: NO_STORE });
  console.error('[form-beacon]', parsed.data);
  recordFormBeacon();
  return new Response(null, { status: 204, headers: NO_STORE });
}
