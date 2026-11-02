import { z } from 'zod';
import { isoDateTime } from './blog-feed.v1';

/**
 * The Operations → website candidates feed, contract `candidates.v1` (docs/INTEGRATIONS.md I7;
 * plan docs/superpowers/plans/2026-11-02-available-workers-feed.md § Contract, section 2).
 * Operations serves `GET /api/website/v1/candidates` publicly — the published profiles are public
 * content by the owner's decision of 2026-11-02, no website token — from its snapshot of the
 * portal's Connector door, and the site reads it server-side only (`src/content/pool-feed.ts`).
 * Like `blog-feed.v1.ts` this file is not vendored into Operations: Operations keeps its own
 * fixture of the same shape, diffed against `candidates-feed.v1.fixture.json` here.
 *
 * Reading is deliberately LENIENT on everything a card can live without: a missing or `null`
 * photo (or its size), experience, group, nationality, location, languages, skills, education or
 * age reads as absent (an empty string as `null`). Zod strips unknown keys (the portal's `id`, if
 * Operations ever forwarded it, never reaches a page), so an additive producer change never
 * breaks this reader; anything else is a new contract version. Strict where the site depends on
 * it: the `ref` is an opaque public reference of at most 32 safe characters (the request basket's
 * `PROFILE_REF_PATTERN` is this same pattern), the display name (one word is fine: "Rustam") must
 * be there, and a position, when sent, has a key.
 */
export const CANDIDATES_FEED_CONTRACT_VERSION = 'candidates.v1';

/** The public candidate reference — opaque, at most 32 characters (`JA-1042`, `C7K2M9QX`): a
 *  letter or digit, then letters, digits, `.`, `_`, `:` or `-`. Never whitespace or a comma, so a
 *  basket of refs travels as one comma-separated string. Also the request basket's
 *  `PROFILE_REF_PATTERN` (`available-workers/_lib/message.ts`). */
export const CANDIDATE_REF_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,31}$/;
const ISO2 = /^[A-Za-z]{2}$/;

/** `''` / whitespace → `null`; absent → `null`; anything else must be a string. */
const optText = z.preprocess(
  (v) => (v === undefined || (typeof v === 'string' && v.trim() === '') ? null : v),
  z.string().trim().nullable(),
);
const optIso2 = z.preprocess(
  (v) => (v === undefined || v === '' ? null : v),
  z
    .string()
    .regex(ISO2)
    .transform((s) => s.toUpperCase())
    .nullable(),
);
/** Any date the platform's `Date.parse` reads (`2026-12-01` or a full ISO date-time). */
const optDate = z.preprocess(
  (v) => (v === undefined || v === '' ? null : v),
  z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), 'not a date')
    .nullable(),
);
const perLocaleLabel = z.object({ tr: optText, en: optText });

export const CandidatePhotoSchema = z.object({
  /** absolute — Operations' media route, `…/api/website/v1/media/candidate/<ref>/<hash>.webp` */
  url: z.string().url(),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
  expiresAt: optDate.optional(),
});

export const CandidateFeedItemSchema = z.object({
  ref: z.string().trim().regex(CANDIDATE_REF_RE),
  /** first name + last initial ("Imran K.", owner 2026-11-02) — the portal never sends the full
   *  name; the card prints exactly this */
  displayName: z.string().trim().min(1).max(80),
  photo: CandidatePhotoSchema.nullish(),
  /** `null` when the candidate has no desired position yet (portal fixture 2026-11-02): the card
   *  then has no position line and the profession / industry filters skip the row */
  position: z
    .object({
      key: z.string().trim().min(1),
      label: perLocaleLabel,
      /** ASSUMED additive (not in the plan's section 1): the position's group — the page's
       *  "industry" filter. Absent → the industry filter and line drop out for that profile. */
      group: z.object({ key: z.string().trim().min(1), label: perLocaleLabel }).nullish(),
    })
    .nullish(),
  /** ISO-2 when the portal knows it (the flag and the localized country name) … */
  nationality: optIso2,
  /** … else the portal's stored label ("Pakistani"), printed as is, no flag */
  nationalityLabel: optText,
  yearsExperience: z.number().int().min(0).max(70).nullish(),
  /** `code` (ISO 639-1) when known → the language's name in the page's locale; else `label` */
  languages: z
    .array(
      z.object({
        code: z.preprocess(
          (v) => (v === undefined || v === '' ? null : v),
          z.string().trim().min(2).max(12).nullable(),
        ),
        label: optText,
        level: optText,
      }),
    )
    .nullish(),
  /** the portal sends `NOW` today; `FROM_DATE` is read for the day it starts to */
  availability: z.object({ status: z.enum(['NOW', 'FROM_DATE']), from: optDate }).nullish(),
  location: z.object({ country: optIso2, city: optText }).nullish(),
  /** short tags, at most 6 (the site keeps the first 6) */
  skills: z.array(z.string().trim().min(1)).nullish(),
  education: optText,
  age: z.number().int().positive().nullish(),
  /** ASSUMED additive: when the profile entered the published pool — the "New" pill and the
   *  "recently added" order. Absent → `updatedAt` orders, and no pill shows. */
  createdAt: optDate.optional(),
  updatedAt: isoDateTime,
});
export type CandidateFeedItem = z.infer<typeof CandidateFeedItemSchema>;

/** `GET /api/website/v1/candidates`: every published candidate (available, not on a live job,
 *  not hidden by the portal's `hideFromWebsite` switch). The site validates the envelope here and every candidate
 *  on its own (a bad one is logged and left out, the rest render — R28). `nextCursor` is followed
 *  if a producer ever pages (`?cursor=`); `stale` is true when Operations' snapshot is older than
 *  30 minutes (the site renders it all the same). */
export const CandidatesFeedEnvelopeSchema = z.object({
  contractVersion: z.literal(CANDIDATES_FEED_CONTRACT_VERSION),
  generatedAt: isoDateTime,
  total: z.number().int().nonnegative().nullish(),
  nextCursor: optText.optional(),
  stale: z.boolean().nullish(),
  candidates: z.array(z.unknown()),
});

/** The whole feed, strictly — what the fixture (and a well-behaved producer) satisfies. */
export const CandidatesFeedSchema = CandidatesFeedEnvelopeSchema.extend({
  candidates: z.array(CandidateFeedItemSchema),
});
export type CandidatesFeed = z.infer<typeof CandidatesFeedSchema>;
