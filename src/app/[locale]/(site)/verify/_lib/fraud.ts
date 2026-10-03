import { z } from 'zod';
import type { WireFields } from '@/forms/wire';

/** The Operations catalog's `fraud` rules (website-form-catalog.ts, v1.0 — v1.1 adds nothing). */
export const DESCRIPTION_MIN = 20;
export const DESCRIPTION_MAX = 5000;
export const EVIDENCE_KEYS_MAX = 3;
/** The catalog's `evidenceKeys` item pattern; each key ≤ 300 characters. */
export const EVIDENCE_KEY = /^website-fraud\/[A-Za-z0-9._-]+$/;
const EVIDENCE_KEY_LENGTH_MAX = 300;

/** The door's `phone` rule: at least eight digits anywhere in the value — anchored (W199: the
 *  unanchored form backtracks quadratically on a long value; this one accepts the same inputs). */
const PHONE_DIGITS = /^(?:\D*\d){8}/;

/** The kernel hands a repeated FormData key over as an array, a single one as a string and an
 *  absent one as undefined; an empty value is not a key. */
const toKeyList = (v: unknown): unknown =>
  (v === undefined ? [] : Array.isArray(v) ? v : [v]).filter((k) => k !== '');

export const fraudSchema = z.object({
  suspectName: z.string().max(200).optional(),
  suspectContact: z.string().max(300).optional(),
  // `.min(1)` first, so an empty value reads `required` and a short one `min` (errors.ts).
  description: z.string().min(1).min(DESCRIPTION_MIN).max(DESCRIPTION_MAX),
  // V-2: the door requires only `description`, but the copy promises an answer (verify.093), so
  // the site asks for a reply channel — stricter than the door, never looser (W3/W105).
  reporterName: z.string().min(1).max(120),
  reporterEmail: z.string().min(1).max(254).email(),
  reporterPhone: z
    .string()
    .max(40)
    .refine((v) => v === '' || PHONE_DIGITS.test(v), { message: 'phone' })
    .optional(),
  // W101: the keys the evidence island got back — one hidden input per uploaded file.
  evidenceKeys: z.preprocess(
    toKeyList,
    z
      .array(z.string())
      .max(EVIDENCE_KEYS_MAX)
      .refine(
        (keys) => keys.every((k) => k.length <= EVIDENCE_KEY_LENGTH_MAX && EVIDENCE_KEY.test(k)),
        { message: 'invalid' },
      ),
  ),
});
export type FraudInput = z.infer<typeof fraudSchema>;

/** The catalog's exact `fraud` wire names — an unknown key would be dropped silently with a 200;
 *  `buildEnvelope` drops the empty strings and an empty key list. */
export function fraudFields(p: FraudInput): WireFields {
  return {
    reporterName: p.reporterName,
    reporterEmail: p.reporterEmail,
    reporterPhone: p.reporterPhone ?? '',
    suspectName: p.suspectName ?? '',
    suspectContact: p.suspectContact ?? '',
    description: p.description,
    evidenceKeys: [...new Set(p.evidenceKeys)],
  };
}
