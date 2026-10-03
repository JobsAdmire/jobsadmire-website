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

/** W230: Operations stores the description as rich-text HTML (its editor since 2026-06 — H2–H3,
 *  bold/italic, lists, links; Operations PRD "Rich-text job content"); an older one is plain
 *  text. One of these tags marks the HTML form. */
const HTML_TAG = /<\/?(?:p|br|div|ul|ol|li|h[1-6]|strong|b|em|i|u|span|a|blockquote)\b[^>]*>/i;

/** The first paragraph of the description, cut at a word boundary to `max` characters. In the
 *  HTML form: the first block that is not a heading, its lines joined by " · ". */
export function summaryOf(description: string | null, max = 160): string {
  if (!description) return '';
  let first: string;
  if (HTML_TAG.test(description)) {
    const blocks = htmlBlocks(description);
    const block = blocks.find((b) => b.type !== 'h') ?? blocks[0];
    first = !block
      ? ''
      : 'items' in block
        ? block.items.join(' · ')
        : block.text.split('\n').join(' · ');
  } else {
    first =
      unixLines(description)
        .split(/\n\s*\n/)
        .map((p) => p.replace(BULLET, '').replace(/\s+/g, ' ').trim())
        .find((p) => p.length > 0) ?? '';
  }
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return `${(at > max / 2 ? cut.slice(0, at) : cut).replace(/[\s·,;:–—-]+$/u, '')}…`;
}

export type DescriptionBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul' | 'ol'; items: string[] };

/** Elements dropped with everything inside them. */
const DROPPED = /<(script|style|template|noscript|iframe|object|svg|head)\b[\s\S]*?<\/\1\s*>/gi;
const TAG = /<(\/?)([a-z][a-z0-9]*)\b[^>]*>/gi;
const BLOCK_TAGS = new Set([
  'p',
  'div',
  'section',
  'article',
  'header',
  'footer',
  'main',
  'aside',
  'blockquote',
  'pre',
  'figure',
  'figcaption',
  'table',
  'tr',
  'dl',
  'dt',
  'dd',
  'hr',
]);
const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  laquo: '«',
  raquo: '»',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  bull: '•',
  middot: '·',
  euro: '€',
};
const decodeEntities = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] !== '#') return ENTITIES[code.toLowerCase()] ?? entity;
    const n = /^#x/i.test(code) ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : entity;
  });

/** W230: the rich-text description as text blocks — headings, paragraphs (a `<br>` keeps its
 *  line) and lists. Tags only shape the blocks; the text is decoded and rendered by React, never
 *  as markup, and script/style content is dropped. An `<li>` whose first child is a heading or a
 *  second block gives those their own blocks (Operations' editor can wrap a whole posting in one
 *  list item). */
function htmlBlocks(html: string): DescriptionBlock[] {
  const out: DescriptionBlock[] = [];
  const lists: Array<'ul' | 'ol'> = [];
  let kind: 'p' | 'h' | 'li' = 'p';
  let liOpen = false; // inside an <li> whose own text has not been emitted yet
  let buf = '';
  const pushItem = (type: 'ul' | 'ol', item: string) => {
    const last = out[out.length - 1];
    if (last && last.type === type) last.items.push(item);
    else out.push({ type, items: [item] });
  };
  const flush = () => {
    const lines = buf
      .split('\n')
      .map((l) => l.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    buf = '';
    if (!lines.length) return;
    if (kind === 'h') {
      out.push({ type: 'h', text: lines.join(' ') });
    } else if (kind === 'li') {
      pushItem(lists[lists.length - 1] ?? 'ul', lines.join(' ').replace(BULLET, ''));
      liOpen = false;
    } else {
      // a typed "- " line inside a paragraph is a list item, as in the plain-text form
      let para: string[] = [];
      const endPara = () => {
        if (para.length) out.push({ type: 'p', text: para.join('\n') });
        para = [];
      };
      for (const line of lines) {
        if (BULLET.test(line)) {
          endPara();
          pushItem('ul', line.replace(BULLET, ''));
        } else para.push(line);
      }
      endPara();
    }
  };
  const src = html.replace(/<!--[\s\S]*?-->/g, '').replace(DROPPED, '');
  let at = 0;
  for (const m of src.matchAll(TAG)) {
    const index = m.index ?? at;
    buf += decodeEntities(src.slice(at, index)).replace(/\s+/g, ' ');
    at = index + m[0].length;
    const closing = m[1] === '/';
    const tag = m[2]!.toLowerCase();
    if (tag === 'br') {
      buf += '\n';
    } else if (tag === 'li') {
      flush();
      kind = closing ? 'p' : 'li';
      liOpen = !closing;
    } else if (tag === 'ul' || tag === 'ol') {
      flush();
      if (closing) lists.pop();
      else lists.push(tag);
      kind = 'p';
      liOpen = false;
    } else if (/^h[1-6]$/.test(tag)) {
      flush();
      kind = closing ? 'p' : 'h';
      if (closing) liOpen = false;
    } else if (BLOCK_TAGS.has(tag)) {
      flush();
      kind = !closing && liOpen ? 'li' : 'p';
    } else if ((tag === 'td' || tag === 'th') && !closing && buf.trim()) {
      buf += ' · ';
    }
  }
  buf += decodeEntities(src.slice(at)).replace(/\s+/g, ' ');
  flush();
  return out;
}

/** The opening's one description (Operations folded the requirements into it) as headings,
 *  paragraphs and lists — text rendered by React, never HTML: the rich-text form through
 *  `htmlBlocks` (W230), the plain-text form line by line. */
export function descriptionBlocks(text: string | null): DescriptionBlock[] {
  if (!text) return [];
  if (HTML_TAG.test(text)) return htmlBlocks(text);
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
