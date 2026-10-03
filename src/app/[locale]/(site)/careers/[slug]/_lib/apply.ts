import { z } from 'zod';
import { FormActionError } from '@/forms/types';
import type { WireFields } from '@/forms/wire';
import {
  OPENING_SLUG_RE,
  PORTFOLIO_GATE_RELAXED,
  salaryCurrencyOf,
  type PublicOpening,
} from '@/lib/careers-pure';

// Catalog v1.1 `careers.portfolioUrl` — the door's `url` type (website ruling W161; source read at
// Operations 47a2160, apps/backend/src/modules/website/website-form-catalog.ts), mirrored exactly:
// a value the door would 400 never leaves the site (a 400 is the visitor's `invalid` panel), and
// the site never refuses what the door accepts — a scheme-less link is fine, the door adds
// https:// BEFORE its ≤ 500 check.
const SCHEME_RE = /^[a-z][a-z0-9+.-]*:\/\//i;
const DIGITS_OR_PHONE_RE = /^[+\s()\d-]+$/;
const IPV6_LITERAL_RE = /^\[[0-9a-f:]+\]$/i;
export const PORTFOLIO_URL_MAX = 500;
/** The door's `phone` rule — at least eight digits anywhere — as the anchored pattern every
 *  phone field uses (W199: it accepts the same inputs and never backtracks on a long value). */
const PHONE_DIGITS = /^(?:\D*\d){8}/;

/** Why the door would refuse this portfolio link — `max` or `url` (a `sys.form.errors.*`
 *  code) — or null when it would take it. */
export function portfolioUrlProblem(value: string): 'url' | 'max' | null {
  if (value.length > PORTFOLIO_URL_MAX) return 'max';
  // Whitespace, or only digits/phone punctuation (WHATWG would read `123` as an IPv4 host).
  if (/\s/.test(value) || DIGITS_OR_PHONE_RE.test(value.replace(SCHEME_RE, ''))) return 'url';
  const normalised = SCHEME_RE.test(value) ? value : `https://${value}`;
  if (normalised.length > PORTFOLIO_URL_MAX) return 'max';
  let url: URL;
  try {
    url = new URL(normalised);
  } catch {
    return 'url';
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'url';
  if (url.username !== '' || url.password !== '') return 'url';
  if (IPV6_LITERAL_RE.test(url.hostname)) return null;
  return /^[^\s]+\.[a-z0-9-]{2,}$/i.test(url.hostname) ? null : 'url';
}

/** "150.000", "150 000", "150,000" → "150000": the separators people type are not the number. */
export const normaliseSalary = (value: string) => value.replace(/[\s.,'’_]/g, '');

const optionalText = (max: number) => z.string().max(max).optional();

/**
 * The apply form in the door's `careers` catalog names (v1.0 + the v1.1 `portfolioUrl`) plus the
 * CV file. `.min(1)` comes before `.email()` so an empty field reads `required`, not `email`
 * (src/forms/errors.ts). The kernel trims every string first. The residency lock, Pakistan's
 * salary and the portfolio gate need the opening, so they live in `applyToFields`.
 */
export const applySchema = z.object({
  openingSlug: z.string().regex(OPENING_SLUG_RE),
  name: z.string().min(1).max(200),
  email: z.string().min(1).max(254).email(),
  phone: z
    .string()
    .min(1)
    .max(40)
    .refine((v) => PHONE_DIGITS.test(v), { message: 'phone' }),
  country: z
    .string()
    .min(1)
    .regex(/^[A-Za-z]{2}$/)
    .transform((v) => v.toUpperCase()),
  city: optionalText(100),
  language: optionalText(300),
  expectedSalary: z
    .string()
    .optional()
    .transform((v) => (v ? normaliseSalary(v) : undefined))
    .refine((v) => v === undefined || (/^\d{1,9}$/.test(v) && Number(v) <= 100_000_000), {
      message: 'invalid',
    }),
  // Length only — the door does not retype LinkedIn (its handler adds https:// and drops junk).
  linkedinUrl: optionalText(500),
  portfolioUrl: z
    .string()
    .optional()
    .superRefine((v, issue) => {
      const problem = v ? portfolioUrlProblem(v) : null;
      if (problem) issue.addIssue({ code: z.ZodIssueCode.custom, message: problem });
    }),
  coverLetter: optionalText(5000),
  // The browser posts an empty File when nothing was picked: a missing and an empty file both
  // read `required` (one predicate, so nothing ever inspects a missing value).
  cv: z.custom<File>(
    (value) => typeof File !== 'undefined' && value instanceof File && value.size > 0,
    { message: 'required' },
  ),
});
export type ApplyInput = z.infer<typeof applySchema>;

export type ApplyContext = {
  /** The opening as Operations serves it now (`getOpening`) — null when it closed or never existed. */
  opening: PublicOpening | null;
  /** `uploadCv` in production: the form's one file, in this action call (W73/W116). */
  upload: (file: File) => Promise<{ cvKey: string }>;
  messages: { closed: string; portfolioGate: string };
};

/**
 * Parsed input → the exact wire fields of the `careers` catalog. Every rule the door would
 * enforce after the upload is enforced here first, so a visitor never lands on the fallback
 * panel for a mistake the page can name: a closed opening, W56's portfolio gate, the residency
 * rule (owner rule 2026-07-24 — the page offers only the opening's country, so only a crafted
 * request trips it), Pakistan's expected salary (owner rule 2026-07-23). Then the CV goes to
 * the public upload door; its refusal (`file`) or failure (the panel) propagates untouched.
 * Never `currentSalary*`: the design has no such field.
 */
export async function applyToFields(p: ApplyInput, ctx: ApplyContext): Promise<WireFields> {
  const { opening } = ctx;
  if (!opening || opening.slug !== p.openingSlug) throw new FormActionError(ctx.messages.closed);
  if (opening.portfolioRequired && !PORTFOLIO_GATE_RELAXED)
    throw new FormActionError(ctx.messages.portfolioGate);
  if (p.country !== opening.country)
    throw new FormActionError('', { name: 'country', code: 'invalid' });
  if (opening.country === 'PK' && !p.expectedSalary)
    throw new FormActionError('', { name: 'expectedSalary', code: 'required' });
  const { cvKey } = await ctx.upload(p.cv);

  const fields: WireFields = {
    openingSlug: opening.slug,
    cvKey,
    name: p.name,
    email: p.email,
    phone: p.phone,
    country: p.country,
  };
  if (p.city) fields.city = p.city;
  if (p.language) fields.language = p.language;
  if (p.expectedSalary) {
    fields.expectedSalary = p.expectedSalary;
    const currency = salaryCurrencyOf(opening);
    if (currency) fields.expectedSalaryCurrency = currency;
  }
  if (p.linkedinUrl) fields.linkedinUrl = p.linkedinUrl;
  if (p.portfolioUrl) fields.portfolioUrl = p.portfolioUrl;
  if (p.coverLetter) fields.coverLetter = p.coverLetter;
  return fields;
}
