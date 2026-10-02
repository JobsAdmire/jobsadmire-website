import { z } from 'zod';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * The page-local shape of one `representatives` row — what the v1.1 `WebsiteRepresentative`
 * record must emit (D9 v1.1: a consent record, a stable public id for the badge QR, company
 * contacts only). `representatives` is FIXTURE_ONLY (`src/content/config.ts`): absent from the
 * LOCAL bundles and refused under LOCAL in production by `getBundle` (D23), so Phase A never has
 * a row and every reader below renders its empty state. Parsed here rather than in
 * `collections.ts` (reconcile: page-local for Phase A), with `getCollection`'s rule — a schema
 * miss throws outside production and drops the row in production. Fail closed: `status` is an
 * enum; the design's "unknown status = Authorised" fallback is exactly what this forbids.
 */
export const REPRESENTATIVE_LEVELS = ['founder', 'office', 'rep', 'coordinator'] as const;
export const REPRESENTATIVE_STATUSES = ['active', 'suspended', 'former'] as const;
export type RepresentativeLevel = (typeof REPRESENTATIVE_LEVELS)[number];
export type RepresentativeStatus = (typeof REPRESENTATIVE_STATUSES)[number];

/** The public badge id: `JA-` + a 2–5 letter desk code + three digits (`JA-REP-014`). */
export const REPRESENTATIVE_ID = /^JA-[A-Z]{2,5}-\d{3}$/;

export const RepresentativeSchema = z.object({
  id: z.string().regex(REPRESENTATIVE_ID),
  name: z.string().min(1),
  /** Locale-resolved by the bundle (like `sourceCountries.name`), never a package id: the
   *  design's staff-data strings (verify.148–197, 240–258) are sample rows, not copy. */
  role: z.string().min(1),
  level: z.enum(REPRESENTATIVE_LEVELS),
  desk: z.string().min(1).nullable(),
  city: z.string().min(1),
  /** ISO-2, upper-case (W40). */
  country: z.string().regex(/^[A-Z]{2}$/),
  languages: z.array(z.string().min(1)),
  /** A company number or an @jobsadmire.com address (D9 v1.1) — or nothing. */
  contact: z.string().min(1).nullable(),
  /** `YYYY-MM-DD`; null = no expiry. */
  validUntil: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  /** Another public id. */
  reportsTo: z.string().regex(REPRESENTATIVE_ID).nullable(),
  /** `YYYY-MM`. */
  since: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable(),
  status: z.enum(REPRESENTATIVE_STATUSES),
  canSign: z.boolean(),
  photo: z.string().url().nullable(),
  updatedAt: z.string().datetime(),
});
export type Representative = z.infer<typeof RepresentativeSchema>;

export type Register = {
  rows: Representative[];
  active: Representative[];
  /** `suspended` and `former` rows — they stay visible on purpose (the package README's rule). */
  former: Representative[];
  /** The active founder row that may sign: the founder strip's public id and record link. */
  founder: Representative | null;
  /** The latest `updatedAt` across the rows — the "Register last updated" line; null hides it
   *  (D17: never "today"). */
  updatedAt: string | null;
};

export class RegisterError extends Error {}

export function readRegister(
  bundle: Bundle,
  env: string | undefined = process.env.NODE_ENV,
): Register {
  const rows: Representative[] = [];
  (bundle.collections.representatives ?? []).forEach((row, index) => {
    const parsed = RepresentativeSchema.safeParse(row);
    if (parsed.success) {
      rows.push(parsed.data);
      return;
    }
    const why = parsed.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ');
    if (env !== 'production') throw new RegisterError(`representatives[${index}]: ${why}`);
    console.error('[verify] representatives row dropped (schema miss)', { index });
  });
  const active = rows.filter((r) => r.status === 'active');
  const former = rows.filter((r) => r.status !== 'active');
  const founder = active.find((r) => r.level === 'founder' && r.canSign) ?? null;
  const updatedAt = rows.reduce<string | null>(
    (latest, r) => (latest === null || r.updatedAt > latest ? r.updatedAt : latest),
    null,
  );
  return { rows, active, former, founder, updatedAt };
}
