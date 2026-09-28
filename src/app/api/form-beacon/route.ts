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
// gets near this; a declared size over it is refused BEFORE a byte is read, so an oversized body
// never gets buffered at all (the earlier version read the whole thing first and only then found
// it malformed — a free way to inflate this route's own memory/CPU use). W158: a chunked request
// declares no length, so the body is also read through a byte counter that gives up at the
// 4,097th byte (`readCapped`) — the cap holds whatever the headers say.
const MAX_BEACON_BYTES = 4096;

const BeaconSchema = z
  .object({
    formKey: z.enum(FORM_KEYS),
    kind: z.enum(FORM_FALLBACK_KINDS),
    page: z.string().min(1).max(300),
  })
  .strict();

/** The body as text, read chunk by chunk through a byte counter: `null` as soon as it runs past
 *  `limit` — the reader is cancelled at that chunk, so an oversized body is never buffered whole.
 *  A stream error reads as an empty body (→ 400), as `request.text()`'s rejection did. Decoded
 *  once at the end, so a multi-byte character split across chunks survives. */
async function readCapped(request: Request, limit: number): Promise<string | null> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
  } catch {
    return '';
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export async function POST(request: Request): Promise<Response> {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BEACON_BYTES) {
    return new Response(null, { status: 413, headers: NO_STORE });
  }
  const text = await readCapped(request, MAX_BEACON_BYTES);
  if (text === null) return new Response(null, { status: 413, headers: NO_STORE });
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
