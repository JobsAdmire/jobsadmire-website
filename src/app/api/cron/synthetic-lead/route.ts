import { NextResponse } from 'next/server';
import { runSyntheticLead } from './run';

// W172: Vercel Cron's target (`vercel.json` `crons`). Never cached, never prerendered: every
// invocation must reach the door. `api` is outside the proxy matcher, so it is never
// locale-rewritten.
//
// W201 (Hobby, 10 s function cap): the whole path is bounded by `postForm`'s ONE 9 s deadline
// (`ATTEMPT_TIMEOUT_MS`), which the first attempt and its single connection-level retry share
// (W74) — the retry can never push past it, so the retry stays on and no `maxDuration` is set.
// `run.test.ts` pins both facts.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { status, body } = await runSyntheticLead(request.headers.get('authorization'));
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
