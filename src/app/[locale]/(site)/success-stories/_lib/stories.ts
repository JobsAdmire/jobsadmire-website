import { z } from 'zod';
import { getCollection, SECTOR_KEYS } from '@/content/collections';
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
// By module path, never the barrel `@/lib/format/date` (W156): the barrel's `formatDate.ts`
// and `formatReadMinutes.ts` import both message JSON files — dead weight this page-local
// module has no reason to carry, and a guard now fails a barrel import of this folder anyway.
import { formatMonth } from '@/lib/format/date/formatMonth';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { SAMPLE_APPROVALS, WALL_SECTOR_OF, WALL_SECTORS, type WallSector } from './sample';

/**
 * One published permit approval — the v1 card (D9): sector, roles, headcount, approval month,
 * city-only place, source countries. No scan, no document, no name (v1.1 adds the proof image).
 * `stories` is a FIXTURE_ONLY collection (D23): under LOCAL it is empty on every Vercel build,
 * so Phase A renders the design's sample approvals (`sampleStoryCards`, page-local constants
 * with the sample badge — parity pass, owner 2026-10-05); Phase B's Ops bundle fills it (I10)
 * and the same cards render the real rows, untagged. The schema is page-local by ruling
 * (reconcile § Accepted as page-local); Phase B moves it to collections.ts.
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

/** Consented employer quotes (§10 row 11, v1.1). Empty until then — the page then shows the
 *  design's three quotes (success.060–068, `SAMPLE_QUOTES`) under the sample tag instead. */
export function readTestimonials(bundle: Bundle): Testimonial[] {
  return readRows(bundle, 'testimonials', TestimonialSchema);
}

/** What the client island renders — every label resolved on the server, so the island imports
 *  no bundle, no date formatter and no message file (D6/W13). The island imports this TYPE only
 *  (`import type`, erased at compile time), never this module's runtime. */
export type StoryCardData = {
  id: string;
  /** The wall chip the card files under (`WALL_SECTORS`); a site sector no chip covers
   *  (`other`) keeps its own key and shows under "All sectors" only. */
  sector: string;
  sectorLabel: string;
  roles: string;
  /** `formatInt(headcount)` — the design sets the number and its unit (`success.041`, passed to
   *  the island once) apart, the unit smaller on the same baseline. */
  headcount: string;
  /** `formatMonth(approvedAt)` — TR "Haziran 2026", EN "June 2026". */
  monthLabel: string;
  place: string;
  countries: string[];
  /** The phone list's document line: `success.150` + n + `success.151` ("Dosyada onay · 45
   *  işçiyi kapsıyor"). */
  docLabel: string;
};

/** One approval in the shape every card is built from, real or sample. */
type CardRow = {
  id: string;
  sector: string;
  sectorLabel: string;
  roles: string;
  headcount: number;
  approvedAt: string;
  place: string;
  countries: string[];
};

function toCards(bundle: Bundle, locale: Locale, rows: CardRow[]): StoryCardData[] {
  const t = makeTf(bundle, locale);
  const countryName = new Map(getCollection(bundle, 'countries').map((c) => [c.code, c.name]));
  const onFile = t('success.150');
  const covered = t('success.151');
  return rows.map((r) => {
    const n = formatInt(r.headcount, locale);
    return {
      id: r.id,
      sector: r.sector,
      sectorLabel: r.sectorLabel,
      roles: r.roles,
      headcount: n,
      monthLabel: formatMonth(r.approvedAt, locale),
      place: r.place,
      countries: r.countries.map((code) => countryName.get(code) ?? code),
      docLabel: `${onFile} ${n} ${covered}`,
    };
  });
}

/** The real path (Phase B, I10): published stories, newest first, each filed under the design
 *  chip that covers its site sector (`WALL_SECTOR_OF`) and labelled with that chip's package id. */
export function storyCards(bundle: Bundle, locale: Locale, stories: Story[]): StoryCardData[] {
  const t = makeTf(bundle, locale);
  const siteLabel = new Map(getCollection(bundle, 'sectors').map((s) => [s.key, t(s.labelId)]));
  const sorted = [...stories].sort((a, b) =>
    a.approvedAt < b.approvedAt ? 1 : a.approvedAt > b.approvedAt ? -1 : 0,
  );
  return toCards(
    bundle,
    locale,
    sorted.map((s) => {
      const chip = WALL_SECTOR_OF[s.sector];
      return {
        ...s,
        sector: chip ?? s.sector,
        sectorLabel: chip ? t(wallSectorLabelId(chip)) : (siteLabel.get(s.sector) ?? s.sector),
      };
    }),
  );
}

/** The sample path (Phase A — the `stories` collection is empty on every build, D23): the
 *  design's nine approvals (`SAMPLE_APPROVALS`), in the design's order, shown with the sample
 *  badge and tag. */
export function sampleStoryCards(bundle: Bundle, locale: Locale): StoryCardData[] {
  const t = makeTf(bundle, locale);
  return toCards(
    bundle,
    locale,
    SAMPLE_APPROVALS.map((a) => ({
      id: a.id,
      sector: a.sector,
      sectorLabel: t(wallSectorLabelId(a.sector)),
      roles: t(a.rolesId),
      headcount: a.headcount,
      approvedAt: a.approvedAt,
      place: a.place,
      countries: a.countries,
    })),
  );
}

/** A wall chip's package label id (`success.125–130`). */
export function wallSectorLabelId(id: WallSector): string {
  const chip = WALL_SECTORS.find((s) => s.id === id);
  if (!chip) throw new Error(`unknown wall sector: ${id}`);
  return chip.labelId;
}
