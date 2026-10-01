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

async function isOneClick(request: Request): Promise<boolean> {
  try {
    return isOneClickValue((await request.formData()).get('List-Unsubscribe'));
  } catch {
    return false; // not a form body (JSON, text, empty) — not RFC 8058
  }
}

export async function POST(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get('token');
  if (!isPlausibleToken(token)) return json({ error: 'invalid' }, 400);
  if (!(await isOneClick(request))) return json({ error: 'not-one-click' }, 400);
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
