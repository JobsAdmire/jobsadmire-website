// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readCapped } from './read-capped';

const encode = (text: string) => new TextEncoder().encode(text);

/** A POST over a pull-based stream (nothing buffered ahead of the reader) that reports how many
 *  chunks the reader pulled and whether it cancelled — the form-beacon test's W158 helper. */
function streamed(chunks: Uint8Array[], init: { error?: boolean } = {}) {
  let pulled = 0;
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>(
    {
      pull(controller) {
        if (init.error && pulled === 1) return controller.error(new Error('boom'));
        const chunk = chunks[pulled];
        if (chunk === undefined) return controller.close();
        pulled += 1;
        controller.enqueue(chunk);
      },
      cancel() {
        cancelled = true;
      },
    },
    { highWaterMark: 0 },
  );
  const request = new Request('http://localhost/x', {
    method: 'POST',
    body,
    duplex: 'half',
  } as RequestInit);
  return { request, pulled: () => pulled, cancelled: () => cancelled };
}

describe('readCapped (W158 / final pass P2-4)', () => {
  it("reads a request without a body as ''", async () => {
    expect(await readCapped(new Request('http://localhost/x', { method: 'POST' }), 16)).toBe('');
  });

  it('returns the whole text at or under the cap, decoding a multi-byte character split across chunks', async () => {
    const bytes = encode('işçi-talebi');
    const split = bytes.indexOf(0xc5) + 1; // between the two bytes of "ş" (C5 9F)
    const { request } = streamed([bytes.slice(0, split), bytes.slice(split)]);
    expect(await readCapped(request, bytes.byteLength)).toBe('işçi-talebi');
  });

  it('gives up with null at the chunk that crosses the cap and cancels the stream — nothing more is pulled', async () => {
    const { request, pulled, cancelled } = streamed(
      Array.from({ length: 100 }, () => encode('x'.repeat(1024))),
    );
    expect(await readCapped(request, 4096)).toBeNull();
    expect(pulled()).toBe(5); // 4 × 1024 = 4096 is allowed; the 5th chunk crosses it
    expect(cancelled()).toBe(true);
  });

  it("reads a stream that errors as '' (the caller's 400), never as a crash", async () => {
    const { request } = streamed([encode('ab'), encode('cd')], { error: true });
    expect(await readCapped(request, 4096)).toBe('');
  });
});
