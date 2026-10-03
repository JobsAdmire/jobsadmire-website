import { z } from 'zod';
import { getCollection, SECTOR_KEYS, type SectorKey } from '@/content/collections';
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
// By module path, never the barrel `@/lib/format/date` (W156): the barrel's `formatDate.ts`
// and `formatReadMinutes.ts` import both message JSON files — dead weight this page-local
// module has no reason to carry, and a guard now fails a barrel import of this folder anyway.
import { formatMonth } from '@/lib/format/date/formatMonth';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * One published permit approval — the v1 card (D9): sector, roles, headcount, approval month,
 * city-only place, source countries. No scan, no document, no name (v1.1 adds the proof image).
 * `stories` is a FIXTURE_ONLY collection (D23): under LOCAL it is empty on every Vercel build,
 * so Phase A renders the W6 empty wall; Phase B's Ops bundle fills it (I10). The schema is
 * page-local by ruling (reconcile § Accepted as page-local); Phase B moves it to collections.ts.
 */
export const StorySchema = z.object({
  id: z.string().min(1),
  /** The site's one sector taxonomy (`sectors` collection), never the design's private enum. */
  sector: z.enum(SECTOR_KEYS),
  /** Free text, locale-resolved by the bundle ("Kat görevlileri, mutfak yardımcıları"). */
  roles: z.string().min(1),
  headcount: z.number().int().positive(),
  /** Calendar date of the approval; rendered as a month (D17 dated label) — never typed. */
  approvedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** City only (D9) — never a company name. */
  place: z.string().min(1),
  /** Upper-case ISO-2 (W40), resolved to names through the `countries` collection. */
  countries: z.array(z.string().regex(/^[A-Z]{2}$/)),
});
export type Story = z.infer<typeof StorySchema>;

export const TestimonialSchema = z.object({
  id: z.string().min(1),
  quote: z.string().min(1),
  role: z.string().min(1),
  org: z.string().min(1),
  initials: z.string().min(1).max(3),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

/** The same dev-throw / prod-degrade rule as `getCollection` (which types only the eight Phase A
 *  collections; `stories` and `testimonials` are Phase B rows read here, R28). */
function readRows<T>(bundle: Bundle, key: string, schema: z.ZodType<T>): T[] {
  const parsed = z.array(schema).safeParse(bundle.collections[key] ?? []);
  if (parsed.success) return parsed.data;
  const issue = parsed.error.issues[0];
  const message = `collection "${key}" does not match its schema at ${issue?.path.join('.')}: ${issue?.message}`;
  if (process.env.NODE_ENV !== 'production') throw new Error(message);
  console.error(`[content] ${message}`);
  return [];
}

export function readStories(bundle: Bundle): Story[] {
  return readRows(bundle, 'stories', StorySchema);
}

/** Consented employer quotes (§10 row 11, v1.1). Empty until then — the design's three quotes
 *  (success.060–068) are self-declared placeholders (success.069) and are never rendered. */
export function readTestimonials(bundle: Bundle): Testimonial[] {
  return readRows(bundle, 'testimonials', TestimonialSchema);
}

/** What the client island renders — every label resolved on the server, so the island imports
 *  no bundle, no date formatter and no message file (D6/W13). The island imports this TYPE only
 *  (`import type`, erased at compile time), never this module's runtime. */
export type StoryCardData = {
  id: string;
  sector: SectorKey;
  sectorLabel: string;
  roles: string;
  /** `formatInt(headcount) + ' ' + t('success.041')` — the package itself splits number and unit. */
  headcountLabel: string;
  /** `formatMonth(approvedAt)` — TR "Haziran 2026", EN "June 2026". */
  monthLabel: string;
  place: string;
  countries: string[];
};

export function storyCards(bundle: Bundle, locale: Locale, stories: Story[]): StoryCardData[] {
  const t = makeTf(bundle, locale);
  const sectorLabel = new Map(getCollection(bundle, 'sectors').map((s) => [s.key, t(s.labelId)]));
  const countryName = new Map(getCollection(bundle, 'countries').map((c) => [c.code, c.name]));
  const unit = t('success.041');
  return [...stories]
    .sort((a, b) => (a.approvedAt < b.approvedAt ? 1 : a.approvedAt > b.approvedAt ? -1 : 0))
    .map((s) => ({
      id: s.id,
      sector: s.sector,
      sectorLabel: sectorLabel.get(s.sector) ?? s.sector,
      roles: s.roles,
      headcountLabel: `${formatInt(s.headcount, locale)} ${unit}`,
      monthLabel: formatMonth(s.approvedAt, locale),
      place: s.place,
      countries: s.countries.map((code) => countryName.get(code) ?? code),
    }));
}
