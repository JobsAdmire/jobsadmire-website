import { readCapped } from '@/lib/http/read-capped';
import { isOneClickValue, isPlausibleToken } from '@/lib/newsletter/classify';
import { forwardNewsletterToken } from '@/lib/newsletter/forward';

/**
 * RFC 8058 one-click unsubscribe (I12). Reached directly, or through `src/proxy.ts`'s rewrite of
 * a POST without `Next-Action` to the unsubscribe PAGE URL Operations prints in
 * `List-Unsubscribe` (`/abonelikten-cik`, `/en/newsletter/unsubscribe`). The body must be the
 * `List-Unsubscribe=One-Click` pair (urlencoded or multipart) and is never forwarded; the token
 * travels in the query as a body-less POST (`forwardNewsletterToken`). Mail clients read only the
 * status; the JSON names the reason for humans and tests.
 */
const HEADERS = { 'Cache-Control': 'private, no-store', 'Content-Type': 'application/json' };
const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: HEADERS });

// The one-click pair is a few bytes; the same 4 KB cap as /api/form-beacon (T13 review M4) holds
// on the declared length AND, through `readCapped`, on a chunked body that declares none (W158).
const MAX_BODY_BYTES = 4096;

/** The capped body text parsed as the form it claims to be (`content-type` kept — urlencoded or
 *  multipart, RFC 8058 §3.1): the pair's value, or `null` for anything that is not a form body
 *  (JSON, text, empty). */
async function oneClickValueOf(text: string, contentType: string | null) {
  try {
    const form = await new Request('http://localhost/', {
      method: 'POST',
      headers: contentType ? { 'content-type': contentType } : undefined,
      body: text,
    }).formData();
    return form.get('List-Unsubscribe');
  } catch {
    return null; // not a form body (JSON, text, empty) — not RFC 8058
  }
}

export async function POST(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get('token');
  if (!isPlausibleToken(token)) return json({ error: 'invalid' }, 400);
  // Refuse a declared body over the cap before reading a byte; count the bytes of one that
  // declares nothing and give up at the 4,097th.
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES)
    return json({ error: 'too-large' }, 413);
  const text = await readCapped(request, MAX_BODY_BYTES);
  if (text === null) return json({ error: 'too-large' }, 413);
  const value = await oneClickValueOf(text, request.headers.get('content-type'));
  if (!isOneClickValue(value)) return json({ error: 'not-one-click' }, 400);
  const result = await forwardNewsletterToken('unsubscribe', token);
  switch (result.kind) {
    case 'ok':
      return json({ outcome: result.outcome }, 200);
    case 'invalid':
    case 'expired':
      return json({ error: 'invalid' }, 400);
    case 'unconfigured':
    case 'off':
    case 'unauthorized':
      return json({ error: result.kind }, 503);
    default: // unavailable — no answer, a timeout or a 5xx
      return json({ error: 'unavailable' }, 502);
  }
}
