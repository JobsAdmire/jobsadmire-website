/**
 * The request body as text, read chunk by chunk through a byte counter: `null` as soon as it
 * runs past `limit` — the reader is cancelled at that chunk, so an oversized body is never
 * buffered whole (W158: a chunked request declares no Content-Length, so a declared-length
 * check alone never sees it; the cap holds whatever the headers say). A stream error reads as an
 * empty body (→ the caller's 400), as `request.text()`'s rejection did. Decoded once at the end,
 * so a multi-byte character split across chunks survives. Shared by `/api/form-beacon` and
 * `/api/newsletter/unsubscribe` (final pass P2-4).
 */
export async function readCapped(request: Request, limit: number): Promise<string | null> {
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
