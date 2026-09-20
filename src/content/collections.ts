// Client-safe (no `server-only`, no fs): typed accessors over `bundle.collections`, whose rows
// the frozen contract types only as `Record<string, unknown>[]` (additive within 1.x). The
// shapes below are what `scripts/import-design-package.ts` writes in Phase A and what the
// Operations bundle must satisfy in Phase B (docs/CONTENT-MODEL.md § Collections). Zod strips
// unknown fields, so a newer producer never breaks an older reader.
import { z } from 'zod';
import type { Bundle } from '../../contract/website-bundle.v1';
import type { pathnames } from '@/i18n/routing';

export const METRIC_KEYS = [
  'placed',
  'employers',
  'countries',
  'permitDays',
  'firstDayWeeks',
  'firstDayWeeksInCountry',
  'replySlaHours',
  'homepageReplyHours',
  'sectors',
] as const;
export type MetricKey = (typeof METRIC_KEYS)[number];

export const PAGE_KEYS = [
  'home',
  'hire',
  'calc',
  'wp',
  'partner',
  'about',
  'contact',
  'workers',
  'stories',
  'verify',
  'careers',
  'careersDetail',
  'blog',
  'blogArticle',
  'portal',
  'privacy',
  'terms',
  'kvkk',
  'cookiePolicy',
  'thankYou',
  'newsletterConfirm',
  'newsletterUnsubscribe',
] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

/** Page key → internal pathname (the `pathnames` key `buildMetadata`/`getPathname` take). */
export const PAGE_PATHNAME: Record<PageKey, keyof typeof pathnames> = {
  home: '/',
  hire: '/hire-workers',
  calc: '/hiring-cost-calculator',
  wp: '/work-permit',
  partner: '/partner-with-us',
  about: '/about',
  contact: '/contact',
  workers: '/available-workers',
  stories: '/success-stories',
  verify: '/verify',
  careers: '/careers',
  careersDetail: '/careers/[slug]',
  blog: '/blog',
  blogArticle: '/blog/[slug]',
  portal: '/portal-login',
  privacy: '/privacy',
  terms: '/terms',
  kvkk: '/kvkk',
  cookiePolicy: '/cookie-policy',
  thankYou: '/thank-you',
  newsletterConfirm: '/newsletter/confirm',
  newsletterUnsubscribe: '/newsletter/unsubscribe',
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HHMM = /^\d{2}:\d{2}$/;
const ISO2 = /^[A-Z]{2}$/; // W40: upper-case everywhere (Task 6's map/flag codes, the door's iso2)
const DIAL = /^\+\d{1,4}$/;
const id = z.string().min(1);
const nullableId = z.string().min(1).nullable();

/** W1: one row per headline number; `text` carries ranges ("6–8"), `value` is null then. */
export const MetricSchema = z.object({
  key: z.enum(METRIC_KEYS),
  value: z.number().nullable(),
  text: z.string().min(1).nullable(),
  suffix: z.enum(['+', '']),
  labelId: nullableId,
  unitId: nullableId,
});

/** W2 / D17: one versioned row; every calculator figure derives from it (Task 9's engine). */
export const RateConfigSchema = z.object({
  version: z.string().min(1),
  effectiveFrom: z.string().regex(ISO_DATE),
  reviewDueAt: z.string().regex(ISO_DATE),
  updatedAt: z.string().regex(ISO_DATE),
  currency: z.literal('TRY'),
  legalMinGross: z.number().positive(),
  sgkEmployerRate: z.number().min(0).max(1),
  sgkRates: z.object({
    manufacturing: z.number().min(0).max(1),
    other: z.number().min(0).max(1),
    none: z.number().min(0).max(1),
  }),
  supportMonthly: z.number().nonnegative(),
  permitFeeTRY: z.number().nonnegative(),
  flightTRY: z.number().nonnegative(),
  housingMonthlyTRY: z.number().nonnegative(),
  quotaRatio: z.number().int().positive(),
});

export const CalculatorRoleSchema = z.object({
  key: id,
  labelId: id,
  multiplier: z.number().positive(),
  group: z.enum(['general', 'skilled', 'specialist']),
  preset: z.boolean(),
  industry: z.enum(['factory', 'construction', 'hotel', 'agriculture']).nullable(),
  industryLabelId: nullableId,
  salaryMin: z.number().positive().nullable(),
  salaryMax: z.number().positive().nullable(),
});

/** W1 + W25: the 13 sourcing countries (map, flags, dial select); `name` is locale-resolved. */
export const SourceCountrySchema = z.object({
  code: z.string().regex(ISO2),
  nameId: nullableId,
  name: z.string().min(1),
  dial: z.string().regex(DIAL),
  lon: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
  flag: z.string().min(1),
});

/** W25: the general ISO-2 list every country/dial select reads — data, not copy (no package ids). */
export const CountrySchema = z.object({
  code: z.string().regex(ISO2),
  name: z.string().min(1),
  dial: z.string().regex(DIAL),
});

export const OFFICE_KEYS = ['antalya', 'karachi'] as const;
export type OfficeKey = (typeof OFFICE_KEYS)[number];
export const OfficeSchema = z.object({
  key: z.enum(OFFICE_KEYS),
  kind: z.enum(['hq', 'sourcing']),
  cityId: id,
  labelId: id,
  addressId: id,
  addressLine2Id: id,
  hoursId: id,
  footerLabelId: id,
  phone: z.string().regex(/^\+\d{8,15}$/),
  whatsapp: z.string().regex(/^\d{8,15}$/),
  email: z.string().email(),
  hours: z.object({
    tz: z.string().min(1),
    // W43: JS `Date#getDay()` numbering, 0 = Sunday … 6 = Saturday, everywhere
    days: z.array(z.number().int().min(0).max(6)).min(1),
    open: z.string().regex(HHMM),
    close: z.string().regex(HHMM),
  }),
  mapUrl: z.string().url(),
});

export const SECTOR_KEYS = [
  'factory',
  'construction',
  'tourism',
  'agriculture',
  'textile',
  'logistics',
  'other',
] as const;
export type SectorKey = (typeof SECTOR_KEYS)[number];
export const SectorSchema = z.object({
  key: z.enum(SECTOR_KEYS),
  labelId: id,
  subtitleId: nullableId,
  icon: z.string().min(1),
});

export const BLOG_CATEGORIES = ['workPermits', 'recruitment', 'compliance', 'marketNews'] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
const perLocale = z.object({ tr: z.string().min(1).nullable(), en: z.string().min(1).nullable() });
/** W4 + W28: one row per article; `body[locale]` (Markdown) is present exactly when `hasBody[locale]`. */
export const BlogPostSchema = z
  .object({
    key: id,
    slug: perLocale,
    title: perLocale,
    excerpt: perLocale,
    category: z.enum(BLOG_CATEGORIES),
    categoryLabelId: id,
    author: z.string().min(1),
    publishedAt: z.string().regex(ISO_DATE),
    readMinutes: z.number().int().positive(),
    hasBody: z.object({ tr: z.boolean(), en: z.boolean() }),
    body: perLocale,
  })
  .refine((p) => (p.body.tr !== null) === p.hasBody.tr && (p.body.en !== null) === p.hasBody.en, {
    message: 'body and hasBody disagree',
    path: ['body'],
  });

export const CollectionSchemas = {
  metrics: MetricSchema,
  rateConfig: RateConfigSchema,
  calculatorRoles: CalculatorRoleSchema,
  sourceCountries: SourceCountrySchema,
  countries: CountrySchema,
  offices: OfficeSchema,
  sectors: SectorSchema,
  blog: BlogPostSchema,
} as const;
export type CollectionKey = keyof typeof CollectionSchemas;
export type CollectionRow<K extends CollectionKey> = z.infer<(typeof CollectionSchemas)[K]>;
export type Metric = z.infer<typeof MetricSchema>;
export type RateConfig = z.infer<typeof RateConfigSchema>;
export type CalculatorRole = z.infer<typeof CalculatorRoleSchema>;
export type SourceCountry = z.infer<typeof SourceCountrySchema>;
export type Country = z.infer<typeof CountrySchema>;
export type Office = z.infer<typeof OfficeSchema>;
export type Sector = z.infer<typeof SectorSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;

export class CollectionError extends Error {}

const cache = new WeakMap<Bundle, Map<CollectionKey, unknown[]>>();

/**
 * Typed rows of one collection. Parsed once per bundle object (React `cache()` hands every
 * caller in a request the same object, so this is one parse per request per collection).
 * A schema miss throws in development and degrades to `[]` in production (R28 — a bad row
 * must never take a page down; the importer and the Ops publish path both validate first).
 */
export function getCollection<K extends CollectionKey>(bundle: Bundle, key: K): CollectionRow<K>[] {
  let perBundle = cache.get(bundle);
  if (!perBundle) {
    perBundle = new Map();
    cache.set(bundle, perBundle);
  }
  const hit = perBundle.get(key);
  if (hit) return hit as CollectionRow<K>[];
  const schema: z.ZodTypeAny = CollectionSchemas[key];
  const parsed = z.array(schema).safeParse(bundle.collections[key] ?? []);
  let rows: CollectionRow<K>[];
  if (parsed.success) rows = parsed.data as CollectionRow<K>[];
  else {
    const issue = parsed.error.issues[0];
    const message = `collection "${key}" does not match its schema at ${issue?.path.join('.')}: ${issue?.message}`;
    if (process.env.NODE_ENV !== 'production') throw new CollectionError(message);
    console.error(`[content] ${message}`);
    rows = [];
  }
  perBundle.set(key, rows);
  return rows;
}

const EMPTY_METRIC = (key: MetricKey): Metric => ({
  key,
  value: null,
  text: null,
  suffix: '',
  labelId: null,
  unitId: null,
});

export function getMetric(bundle: Bundle, key: MetricKey): Metric {
  const row = getCollection(bundle, 'metrics').find((m) => m.key === key);
  if (row) return row;
  if (process.env.NODE_ENV !== 'production')
    throw new CollectionError(`metric "${key}" is not in the bundle`);
  return EMPTY_METRIC(key);
}

/** Throws in every environment: a calculator with no rates must not render numbers (D17). */
export function getRateConfig(bundle: Bundle): RateConfig {
  const row = getCollection(bundle, 'rateConfig')[0];
  if (!row) throw new CollectionError('rateConfig collection is empty');
  return row;
}

export function getOffice(bundle: Bundle, key: OfficeKey): Office {
  const row = getCollection(bundle, 'offices').find((o) => o.key === key);
  if (!row) throw new CollectionError(`office "${key}" is not in the bundle`);
  return row;
}

/** W4: /blog joins nav, sitemap and robots only once this many Turkish bodies exist. */
export const BLOG_NAV_THRESHOLD = 6;
export function blogNavVisible(bundle: Bundle): boolean {
  return getCollection(bundle, 'blog').filter((p) => p.hasBody.tr).length >= BLOG_NAV_THRESHOLD;
}

export function getPageSeo(bundle: Bundle, key: PageKey): Bundle['pages'][string] | undefined {
  return bundle.pages[key];
}
