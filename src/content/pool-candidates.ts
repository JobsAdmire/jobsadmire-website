// Runtime-agnostic (no `server-only`): the Operations candidates feed (contract `candidates.v1`,
// `contract/candidates-feed.v1.ts`) mapped into the site's `PoolCandidate` rows. The fetching, the
// source switch and the sample fallback live in `./pool-feed.ts`; this module only validates and
// maps, so the unit suite can run it against the contract fixture. The page-specific shaping (one
// locale's labels, the availability band, the filter keys) is the page's own
// (`available-workers/_lib/real-pool.ts`); the home marquee reads these rows directly.
import {
  CandidateFeedItemSchema,
  CandidatesFeedEnvelopeSchema,
  type CandidateFeedItem,
} from '../../contract/candidates-feed.v1';
import { isBlogImageSrc } from '@/lib/blog-media';

export type PoolLocale = 'tr' | 'en';
export type PerLocale = { tr: string; en: string };

/**
 * One published candidate as every reader on the site sees it (the page's cards, the home
 * marquee). It generalises the design sample's row (`available-workers/_lib/sample-pool.ts`:
 * ref, trade, country, industry, years, languages, availability, tags) with what the real feed
 * adds — the name and the photo (owner 2026-11-02) — and keeps labels per locale, so one feed
 * read serves both languages. Never a phone, an e-mail, a document or who sourced the candidate:
 * the contract carries none of them (firewall).
 */
export type PoolCandidate = {
  /** the public reference — shown on the card, posted by the request basket (`profileRefs`) */
  ref: string;
  /** the feed's `displayName` exactly — first name + last initial ("Imran K."); the portal
   *  never sends a full name (owner 2026-11-02) */
  name: string;
  /** Operations' media route only (`isBlogImageSrc`); `null` → the avatar placeholder */
  photo: { url: string; width: number; height: number } | null;
  /** the position (the page's "profession" filter key and card heading), both languages filled */
  position: { key: string; label: PerLocale };
  /** the position's group (the page's "industry" filter), when the feed sends one */
  group: { key: string; label: PerLocale } | null;
  /** ISO-2, upper case, when the portal knows it (flag + localized name) … */
  nationality: string | null;
  /** … else the portal's stored label, printed as is (no flag); both may be `null` */
  nationalityLabel: string | null;
  yearsExperience: number | null;
  /** `code` (lower case) → the language's name in the page's locale; else `label` as sent */
  languages: { code: string | null; label: string | null; level: string | null }[];
  /** `from` is an ISO string for `FROM_DATE`, `null` for `NOW` */
  availability: { status: 'NOW' | 'FROM_DATE'; from: string | null };
  /** where the candidate is now; both may be `null` */
  location: { country: string | null; city: string | null };
  /** at most six short tags */
  skills: string[];
  /** carried for completeness — no card shows them */
  education: string | null;
  age: number | null;
  /** when the profile entered the pool, if the feed says (the "New" pill) */
  createdAt: string | null;
  /** `createdAt ?? updatedAt` — the "recently added" order (home: newest first) */
  addedAt: string;
};

/** The feed answered, but not with a `candidates.v1` envelope (R28: one class, one fallback). */
export class PoolFeedContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PoolFeedContractError';
  }
}

export type PoolFeedLog = (message: string, detail?: Record<string, unknown>) => void;
const defaultLog: PoolFeedLog = (message, detail) =>
  console.error(`[pool] ${message}`, detail ?? '');

export const MAX_SKILLS = 6;

/** Both locales filled: the missing one takes the other's words, then `fallback`. */
function bothLocales(label: { tr: string | null; en: string | null }, fallback: string): PerLocale {
  return { tr: label.tr ?? label.en ?? fallback, en: label.en ?? label.tr ?? fallback };
}

/** One validated feed item → one site row. A photo off the media route is dropped (and logged):
 *  `next/image` refuses any other host (`next.config.ts`), and a refused src takes the page down. */
export function mapCandidate(
  item: CandidateFeedItem,
  log: PoolFeedLog = defaultLog,
): PoolCandidate {
  const photoOk = item.photo ? isBlogImageSrc(item.photo.url) : false;
  if (item.photo && !photoOk)
    log('a photo is not on the media route and was left out', { ref: item.ref });
  const group = item.position.group
    ? {
        key: item.position.group.key,
        label: bothLocales(item.position.group.label, item.position.group.key),
      }
    : null;
  return {
    ref: item.ref,
    name: item.displayName,
    photo:
      item.photo && photoOk
        ? {
            url: item.photo.url,
            width: item.photo.width ?? 480,
            height: item.photo.height ?? 480,
          }
        : null,
    position: {
      key: item.position.key,
      label: bothLocales(item.position.label, item.position.key),
    },
    group,
    nationality: item.nationality,
    nationalityLabel: item.nationality ? null : item.nationalityLabel,
    yearsExperience: item.yearsExperience ?? null,
    // a language with neither a code nor a label names nothing and is left out
    languages: (item.languages ?? [])
      .filter((l) => l.code !== null || l.label !== null)
      .map((l) => ({ code: l.code?.toLowerCase() ?? null, label: l.label, level: l.level })),
    availability: {
      status: item.availability?.status ?? 'NOW',
      from: item.availability?.status === 'FROM_DATE' ? (item.availability.from ?? null) : null,
    },
    location: {
      country: item.location?.country ?? null,
      city: item.location?.city ?? null,
    },
    skills: (item.skills ?? []).slice(0, MAX_SKILLS),
    education: item.education,
    age: item.age ?? null,
    createdAt: item.createdAt ?? null,
    addedAt: item.createdAt ?? item.updatedAt,
  };
}

export type PoolFeedPage = { candidates: PoolCandidate[]; nextCursor: string | null };

/**
 * A `GET /api/website/v1/candidates` body → the site's rows and the next page's cursor. The
 * envelope must be `candidates.v1` (else `PoolFeedContractError`, the caller's fallback path);
 * each candidate is then validated on its own — a bad one is logged and left out, the rest
 * render (R28). A ref already taken (by an earlier row, or `seen` from an earlier page) is left
 * out the same way: the basket posts refs, so one ref must be one person.
 */
export function feedToCandidates(
  raw: unknown,
  log: PoolFeedLog = defaultLog,
  seen: Set<string> = new Set(),
): PoolFeedPage {
  const envelope = CandidatesFeedEnvelopeSchema.safeParse(raw);
  if (!envelope.success) {
    const issue = envelope.error.issues[0];
    throw new PoolFeedContractError(
      `feed: contract violation at ${issue?.path.join('.') || '(root)'}: ${issue?.message}`,
    );
  }
  const candidates: PoolCandidate[] = [];
  envelope.data.candidates.forEach((item, index) => {
    const parsed = CandidateFeedItemSchema.safeParse(item);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      log('a candidate broke the contract and was left out', {
        index,
        path: issue?.path.join('.'),
        issue: issue?.message,
      });
      return;
    }
    const row = mapCandidate(parsed.data, log);
    if (seen.has(row.ref)) {
      log('two candidates share a ref; the later one was left out', { ref: row.ref });
      return;
    }
    seen.add(row.ref);
    candidates.push(row);
  });
  return { candidates, nextCursor: envelope.data.nextCursor ?? null };
}

/** Newest first (`addedAt`), ties by ref — the home marquee's order. */
export function newestFirst(rows: readonly PoolCandidate[]): PoolCandidate[] {
  return rows
    .slice()
    .sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt) || a.ref.localeCompare(b.ref));
}

/** A country's name in `locale`: the bundle's `sourceCountries` name when it lists the code (the
 *  site's own words), else the platform's (`Intl.DisplayNames`), else the code. */
export function countryName(
  code: string,
  locale: PoolLocale,
  known?: ReadonlyMap<string, string>,
): string {
  const own = known?.get(code);
  if (own) return own;
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** A language's name in `locale` (`en` → "İngilizce" / "English"), else the code upper-cased. */
export function languageName(code: string, locale: PoolLocale): string {
  try {
    const name = new Intl.DisplayNames([locale], { type: 'language' }).of(code);
    if (!name || name.toLowerCase() === code.toLowerCase()) return code.toUpperCase();
    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  } catch {
    return code.toUpperCase();
  }
}

/** One language's words: its name in `locale` when the feed sends a code, else its label. */
export function languageLabel(l: PoolCandidate['languages'][number], locale: PoolLocale): string {
  return l.code ? languageName(l.code, locale) : (l.label ?? '');
}

/** "İngilizce (B1) · Türkçe (A2)" — the card's languages line; '' when the feed lists none. */
export function languagesLine(langs: PoolCandidate['languages'], locale: PoolLocale): string {
  return langs
    .map((l) => (l.level ? `${languageLabel(l, locale)} (${l.level})` : languageLabel(l, locale)))
    .join(' · ');
}

/** The nationality's words in `locale`: the country's name for an ISO code, else the portal's
 *  label, else ''. */
export function nationalityName(
  c: Pick<PoolCandidate, 'nationality' | 'nationalityLabel'>,
  locale: PoolLocale,
  known?: ReadonlyMap<string, string>,
): string {
  return c.nationality ? countryName(c.nationality, locale, known) : (c.nationalityLabel ?? '');
}
