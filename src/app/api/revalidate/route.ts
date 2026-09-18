import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { authorize, parseTags } from './auth';
import { recordRevalidate } from './state';

// Operations calls this after a publish (docs/INTEGRATIONS.md I2). It sits outside the proxy
// matcher on purpose: this target must never be redirected or locale-rewritten.
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function POST(request: Request) {
  const outcome = authorize(request.headers.get('authorization'), process.env.REVALIDATE_SECRET);
  // Never open: no configured secret means the door is closed, not unlocked (D6).
  if (outcome === 'disabled')
    return NextResponse.json({ error: 'revalidate disabled' }, { status: 503, headers: NO_STORE });
  if (outcome === 'unauthorized')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: NO_STORE });

  const body: unknown = await request.json().catch(() => null);
  const tags = parseTags(body);
  if (tags === null)
    return NextResponse.json({ error: 'invalid tags' }, { status: 400, headers: NO_STORE });

  // Validated in full before anything is purged, so a bad entry can never leave half the
  // tags revalidated and half not.
  for (const tag of tags) revalidateTag(tag, 'max');
  recordRevalidate();
  return NextResponse.json(
    { revalidated: tags, at: new Date().toISOString() },
    { headers: NO_STORE },
  );
}
