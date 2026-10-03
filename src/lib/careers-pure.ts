// Client-safe — no `server-only`, no fetch, no message catalogue: the public-opening contract
// exactly as the Operations careers-public module emits it (`shapePublicOpening`,
// apps/backend/src/modules/careers-public/careers-public.service.ts) and the pure helpers both
// careers routes share. The server read lives in `./careers.ts`. A client module imports TYPES
// from here only (erased at compile time), so zod never reaches a careers island.
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';
import { formatTRY } from '@/lib/format/money';
import type { JobPostingJsonLdInput } from '@/lib/seo/jsonld';

/** Spec §3.1's reserved ISR tag and the openings time floor (docs/ARCHITECTURE.md § Freshness). */
export const OPENINGS_TAG = 'openings';
export const OPENINGS_REVALIDATE_SECONDS = 300;
/** `QueryPublicOpeningsDto` caps `limit` at 50; five pages bound a runaway `totalPages`. */
export const OPENINGS_PAGE_LIMIT = 50;
export const OPENINGS_MAX_PAGES = 5;
/** The API has no `isNew`: a role posted within this many days wears the design's "New" badge. */
export const NEW_WITHIN_DAYS = 14;
/** W56: an opening with `portfolioRequired` still needs an uploaded portfolio DOCUMENT the
 *  website door cannot carry — the door answers 200 + FAILED "This position requires at least
 *  one portfolio document" — so the detail page renders the apply-by-e-mail panel for it and
 *  the action refuses it. Flip to `true` once Operations lets `portfolioUrl` (catalog v1.1,
 *  already sent) satisfy the gate; nothing else changes. */
export const PORTFOLIO_GATE_RELAXED = false;
/** The door's `openingSlug` rule (catalog `careers`: ≤ 200, `/^[a-z0-9-]+$/`). */
export const OPENING_SLUG_RE = /^[a-z0-9-]{1,200}$/;

export const OPENING_CATEGORIES = [
  'FULL_TIME',
  'FREELANCER',
  'PROJECT_BASED',
  'COUNTRY_REPRESENTATIVE',
] as const;
export type OpeningCategory = (typeof OPENING_CATEGORIES)[number];
export const WORK_MODES = ['REMOTE', 'HYBRID', 'ON_SITE'] as const;
export type WorkMode = (typeof WORK_MODES)[number];
export const SALARY_PAY_TYPES = ['RANGE', 'STARTING', 'MAXIMUM', 'EXACT'] as const;
export const SALARY_PERIODS = ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'] as const;
export type SalaryPeriod = (typeof SALARY_PERIODS)[number];

/** Prisma returns `null`, and an older reader may omit a key: both read as `null`. */
const nullableString = z
  .string()
  .nullish()
  .transform((v) => v ?? null);
/** Prisma decimals arrive as strings (`salaryMin?.toString()`). */
const decimalString = z
  .string()
  .regex(/^\d+(\.\d+)?$/)
  .nullish()
  .transform((v) => v ?? null);

export const PublicOpeningSchema = z.object({
  slug: z.string().regex(OPENING_SLUG_RE),
  title: z.string().trim().min(1),
  // `Country.code` — upper-case ISO-2 (W40); a legacy free-text country fails the row.
  country: z
    .string()
    .regex(/^[A-Za-z]{2}$/)
    .transform((v) => v.toUpperCase()),
  city: nullableString,
  cities: z.array(z.string()).default([]),
  category: z.enum(OPENING_CATEGORIES),
  employmentArrangement: nullableString,
  employmentArrangements: z.array(z.string()).default([]),
  workMode: z
    .enum(WORK_MODES)
    .nullish()
    .transform((v) => v ?? null),
  workModes: z.array(z.enum(WORK_MODES)).default([]),
  description: nullableString,
  salaryMin: decimalString,
  salaryMax: decimalString,
  salaryCurrency: nullableString,
  salaryPayType: z
    .enum(SALARY_PAY_TYPES)
    .nullish()
    .transform((v) => v ?? null),
  salaryPeriod: z
    .enum(SALARY_PERIODS)
    .nullish()
    .transform((v) => v ?? null),
  salaryVisible: z.boolean(),
  payCurrency: nullableString,
  portfolioRequired: z.boolean(),
  requiredLanguage: nullableString,
  requiredLanguages: z.array(z.string()).default([]),
  postedAt: z.string().datetime({ offset: true }),
});
export type PublicOpening = z.infer<typeof PublicOpeningSchema>;

/** `GET /api/careers/openings`: the envelope; its rows are checked one by one (`parseOpenings`). */
export const OpeningsPageSchema = z.object({
  data: z.array(z.unknown()),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});
/** `GET /api/careers/openings/:slug`. */
export const OpeningDetailSchema = z.object({ data: z.unknown() });

/** The rows that honour the contract. A malformed row is reported and left out — one broken
 *  opening must never take the whole list down (the spirit of R28's `getCollection` rule). */
export function parseOpenings(
  rows: readonly unknown[],
  onInvalid: (index: number, issue: string) => void = () => {},
): PublicOpening[] {
  const out: PublicOpening[] = [];
  rows.forEach((row, index) => {
    const parsed = PublicOpeningSchema.safeParse(row);
    if (parsed.success) out.push(parsed.data);
    else {
      const issue = parsed.error.issues[0];
      onInvalid(index, `${issue?.path.join('.')}: ${issue?.message}`);
    }
  });
  return out;
}

/** The typed next-intl href of one opening's detail page — the same slug in both locales. */
export const detailHref = (slug: string) => ({
  pathname: '/careers/[slug]' as const,
  params: { slug },
});

/** The design's "Where" axis: Türkiye = the Antalya office, anywhere else = overseas. */
export type Place = 'office' | 'overseas';
export const placeOf = (o: Pick<PublicOpening, 'country'>): Place =>
  o.country === 'TR' ? 'office' : 'overseas';

/** The design's "Engagement" axis over Operations' four hiring categories. */
export type Engagement = 'fullTime' | 'partTime' | 'project';
export const ENGAGEMENT_OF: Record<OpeningCategory, Engagement> = {
  FULL_TIME: 'fullTime',
  COUNTRY_REPRESENTATIVE: 'fullTime',
  FREELANCER: 'partTime',
  PROJECT_BASED: 'project',
};

type EmploymentType = JobPostingJsonLdInput['employmentType'];
/** İŞKUR arrangement codes (Operations' admin-managed `EmploymentType.code`) → Google's enum. */
const ARRANGEMENT_EMPLOYMENT: Record<string, EmploymentType> = {
  PERMANENT: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACTOR',
  FREELANCER: 'CONTRACTOR',
  INTERNSHIP: 'INTERN',
};
const CATEGORY_EMPLOYMENT: Record<OpeningCategory, EmploymentType> = {
  FULL_TIME: 'FULL_TIME',
  COUNTRY_REPRESENTATIVE: 'FULL_TIME',
  FREELANCER: 'CONTRACTOR',
  PROJECT_BASED: 'TEMPORARY',
};

/** schema.org `JobPosting.employmentType`: the first arrangement code this map knows (codes are
 *  admin-managed, so an unknown one falls through), else the hiring category. */
export function employmentTypeOf(
  o: Pick<PublicOpening, 'employmentArrangements' | 'employmentArrangement' | 'category'>,
): EmploymentType {
  const codes = o.employmentArrangements.length
    ? o.employmentArrangements
    : o.employmentArrangement
      ? [o.employmentArrangement]
      : [];
  for (const code of codes) {
    const type = ARRANGEMENT_EMPLOYMENT[code.toUpperCase()];
    if (type) return type;
  }
  return CATEGORY_EMPLOYMENT[o.category];
}

export function isNewOpening(postedAt: string, now: Date, days = NEW_WITHIN_DAYS): boolean {
  const t = Date.parse(postedAt);
  return !Number.isNaN(t) && now.getTime() - t <= days * 86_400_000;
}

const BULLET = /^\s*[-*•]\s+/;
const unixLines = (text: string) => text.replace(/\r\n?/g, '\n');

/** The first paragraph of the description, cut at a word boundary to `max` characters. */
export function summaryOf(description: string | null, max = 160): string {
  if (!description) return '';
  const first =
    unixLines(description)
      .split(/\n\s*\n/)
      .map((p) => p.replace(BULLET, '').replace(/\s+/g, ' ').trim())
      .find((p) => p.length > 0) ?? '';
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return `${(at > max / 2 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

export type DescriptionBlock = { type: 'p'; text: string } | { type: 'ul'; items: string[] };

/** The opening's one description (Operations folded the requirements into it) as paragraphs and
 *  bullet lists — plain text rendered by React, never HTML. */
export function descriptionBlocks(text: string | null): DescriptionBlock[] {
  if (!text) return [];
  const out: DescriptionBlock[] = [];
  for (const line of unixLines(text).split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (BULLET.test(line)) {
      const item = line.replace(BULLET, '').trim();
      const last = out[out.length - 1];
      if (last?.type === 'ul') last.items.push(item);
      else out.push({ type: 'ul', items: [item] });
    } else {
      out.push({ type: 'p', text: trimmed });
    }
  }
  return out;
}

/** The `countries` collection's localized name first, Intl's region name second, the code last. */
export function countryNameOf(
  code: string,
  countries: ReadonlyArray<{ code: string; name: string }>,
  locale: Locale,
): string {
  const upper = code.toUpperCase();
  const row = countries.find((c) => c.code === upper);
  if (row) return row.name;
  try {
    const name = new Intl.DisplayNames([locale], { type: 'region' }).of(upper);
    if (name) return name;
  } catch {
    // not a region code Intl knows — fall through to the code itself
  }
  return upper;
}

export const citiesOf = (o: Pick<PublicOpening, 'city' | 'cities'>): string =>
  o.cities.length ? o.cities.join(', ') : (o.city ?? '');

export const locationOf = (o: Pick<PublicOpening, 'city' | 'cities'>, countryName: string) =>
  [citiesOf(o), countryName].filter((part) => part.length > 0).join(' · ');

export const workModesOf = (o: Pick<PublicOpening, 'workMode' | 'workModes'>): WorkMode[] =>
  o.workModes.length ? o.workModes : o.workMode ? [o.workMode] : [];

export const languagesOf = (
  o: Pick<PublicOpening, 'requiredLanguage' | 'requiredLanguages'>,
): string[] =>
  o.requiredLanguages.length ? o.requiredLanguages : o.requiredLanguage ? [o.requiredLanguage] : [];

type SalaryFields = Pick<
  PublicOpening,
  'salaryVisible' | 'salaryMin' | 'salaryMax' | 'salaryCurrency' | 'salaryPayType' | 'salaryPeriod'
>;

export type SalaryParts = {
  kind: 'range' | 'from' | 'upTo' | 'exact';
  min: number | null;
  max: number | null;
  currency: string;
  period: SalaryPeriod | null;
};

/** Null unless the opening shows its pay (Operations strips the numbers when it does not).
 *  Storage rule (schema.prisma `SalaryPayType`): EXACT writes both bounds, STARTING the minimum,
 *  MAXIMUM the maximum; a row without a pay type is read from the bounds it has. */
export function salaryPartsOf(o: SalaryFields): SalaryParts | null {
  if (!o.salaryVisible || !o.salaryCurrency) return null;
  const min = o.salaryMin === null ? null : Number(o.salaryMin);
  const max = o.salaryMax === null ? null : Number(o.salaryMax);
  if (min === null && max === null) return null;
  const base = { currency: o.salaryCurrency.toUpperCase(), period: o.salaryPeriod };
  if (o.salaryPayType === 'EXACT' || (min !== null && min === max)) {
    const value = min ?? max;
    return { ...base, kind: 'exact', min: value, max: value };
  }
  if (
    min !== null &&
    max !== null &&
    o.salaryPayType !== 'STARTING' &&
    o.salaryPayType !== 'MAXIMUM'
  )
    return { ...base, kind: 'range', min, max };
  if (max !== null && (o.salaryPayType === 'MAXIMUM' || min === null))
    return { ...base, kind: 'upTo', min: null, max };
  return { ...base, kind: 'from', min, max: null };
}

const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' };

/** D18 for lira (`formatTRY`); Intl's currency style for every other ISO code; whole units. */
export function formatMoney(amount: number, currency: string, locale: Locale): string {
  const code = currency.toUpperCase();
  if (code === 'TRY') return formatTRY(amount, locale);
  const whole = Math.round(amount);
  try {
    return new Intl.NumberFormat(INTL[locale], {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(whole);
  } catch {
    // Not an ISO currency Intl accepts: the number and the code as stored, never a guessed symbol.
    return `${new Intl.NumberFormat(INTL[locale], { maximumFractionDigits: 0 }).format(whole)} ${code}`;
  }
}

const UNIT_TEXT: Partial<Record<SalaryPeriod, 'HOUR' | 'MONTH' | 'YEAR'>> = {
  HOUR: 'HOUR',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
};

/** `JobPosting.baseSalary` — only for the periods schema.org's `unitText` names that Google
 *  reads here; DAY/WEEK, no period or a hidden salary → no node (never a guessed figure, D17). */
export function baseSalaryOf(o: SalaryFields): JobPostingJsonLdInput['baseSalary'] {
  const parts = salaryPartsOf(o);
  const unitText = parts?.period ? UNIT_TEXT[parts.period] : undefined;
  if (!parts || !unitText) return undefined;
  if (parts.kind === 'range' && parts.min !== null && parts.max !== null)
    return { currency: parts.currency, value: { min: parts.min, max: parts.max }, unitText };
  const single = parts.min ?? parts.max;
  return single === null ? undefined : { currency: parts.currency, value: single, unitText };
}

/** The currency an expected salary is quoted in: the opening's pay currency (Operations resolves
 *  it the same way); PKR for a Pakistan opening without one (the salary is compulsory there —
 *  owner rule 2026-07-23); otherwise none. */
export function salaryCurrencyOf(o: Pick<PublicOpening, 'payCurrency' | 'country'>): string | null {
  if (o.payCurrency) return o.payCurrency.toUpperCase();
  return o.country === 'PK' ? 'PKR' : null;
}
