import 'server-only';
import { cache } from 'react';
import { doorBase } from '@/forms/env';
import {
  OPENING_SLUG_RE,
  OpeningDetailSchema,
  OPENINGS_MAX_PAGES,
  OPENINGS_PAGE_LIMIT,
  OPENINGS_REVALIDATE_SECONDS,
  OPENINGS_TAG,
  OpeningsPageSchema,
  parseOpenings,
  PublicOpeningSchema,
  type PublicOpening,
} from './careers-pure';

/**
 * The public careers API answered with something other than openings or a 404: an HTTP error, a
 * network failure, a body that is not JSON, a broken envelope (R28 — one class, one path, like
 * `BundleUnavailableError`). Thrown, never swallowed: during an ISR revalidation Next keeps
 * serving the last good page and retries on the next request, so an Operations outage never
 * replaces live openings with the empty state or drops them from the sitemap. A
 * door-configured BUILD (staging, production) fails loudly instead — docs/ARCHITECTURE.md
 * § Freshness.
 */
export class OpeningsUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpeningsUnavailableError';
  }
}

/** Tests inject both; production reads the real `fetch` and `process.env`. */
export type CareersDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv };

// Spec §3.1's reserved tag and the 300 s floor (D8) on every openings read. A publish/close
// reaches the site early only if Operations sends the tag to `/api/revalidate` (I2); the floor
// bounds the staleness either way.
const NEXT = { tags: [OPENINGS_TAG], revalidate: OPENINGS_REVALIDATE_SECONDS };
const HEADERS = { accept: 'application/json' };

const reason = (err: unknown) => (err instanceof Error ? err.message : String(err));

async function get(f: typeof fetch, url: string, what: string): Promise<Response> {
  try {
    return await f(url, { headers: HEADERS, next: NEXT });
  } catch (err) {
    throw new OpeningsUnavailableError(`${what}: ${reason(err)}`);
  }
}

async function body(res: Response, what: string): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    // An HTML error or login page served with a 200 is the same outage as a 500 (R28).
    throw new OpeningsUnavailableError(`${what}: the body is not JSON`);
  }
}

export async function listOpeningsUncached(deps: CareersDeps = {}): Promise<PublicOpening[]> {
  const base = doorBase(deps.env);
  // No door here (a door-less preview, a local build, the unit suite): no openings is the truth.
  if (!base) return [];
  const f = deps.fetch ?? fetch;
  const out: PublicOpening[] = [];
  for (let page = 1; page <= OPENINGS_MAX_PAGES; page++) {
    const what = `openings page ${page}`;
    const res = await get(
      f,
      `${base}/api/careers/openings?page=${page}&limit=${OPENINGS_PAGE_LIMIT}`,
      what,
    );
    if (!res.ok) throw new OpeningsUnavailableError(`${what}: HTTP ${res.status}`);
    const envelope = OpeningsPageSchema.safeParse(await body(res, what));
    if (!envelope.success)
      throw new OpeningsUnavailableError(
        `${what}: contract violation at ${envelope.error.issues[0]?.path.join('.')}`,
      );
    out.push(
      ...parseOpenings(envelope.data.data, (index, issue) =>
        console.error('[careers] an opening broke the contract and was left out', {
          page,
          index,
          issue,
        }),
      ),
    );
    if (page >= envelope.data.meta.totalPages) break;
  }
  return out;
}

export async function getOpeningUncached(
  slug: string,
  deps: CareersDeps = {},
): Promise<PublicOpening | null> {
  // A slug the door would refuse is not an opening — no call, a 404 page.
  if (!OPENING_SLUG_RE.test(slug)) return null;
  const base = doorBase(deps.env);
  if (!base) return null;
  const f = deps.fetch ?? fetch;
  const what = `opening ${slug}`;
  const res = await get(f, `${base}/api/careers/openings/${slug}`, what);
  // Unknown, closed or unlisted: the one answer that is a real 404.
  if (res.status === 404) return null;
  if (!res.ok) throw new OpeningsUnavailableError(`${what}: HTTP ${res.status}`);
  const envelope = OpeningDetailSchema.safeParse(await body(res, what));
  const row = envelope.success ? PublicOpeningSchema.safeParse(envelope.data.data) : null;
  if (!row?.success) throw new OpeningsUnavailableError(`${what}: contract violation`);
  return row.data;
}

/** One read per request (React `cache`) — the page, its metadata, `generateStaticParams`, the
 *  sitemap source and the apply action share it; across requests Next's data cache answers
 *  under the `openings` tag. */
export const listOpenings = cache((): Promise<PublicOpening[]> => listOpeningsUncached());
export const getOpening = cache((slug: string): Promise<PublicOpening | null> =>
  getOpeningUncached(slug),
);
