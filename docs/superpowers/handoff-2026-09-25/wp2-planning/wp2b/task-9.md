### Task 9: Success Stories — `/basari-hikayeleri` · `/en/success-stories` (empty approvals wall, W6)

**What this page is in Phase A.** The design (`design-package/design/Success Stories.dc.html`, strings `success.001–151`) is a CRM-fed wall of redacted permit approvals with four hero metrics (1,240+ / 68 / 41 days / 91 %), a "Numbers we do not hide" KPI box (7 % / +19 days / 4 % / 11), three employer quotes and two worker stories. None of that data is signed: W1 rules the page's figures **unsigned → hidden**, D23/CLAUDE.md forbid the `stories` fixture on every Vercel build (`assertServableInProduction`, `FIXTURE_ONLY_COLLECTIONS = ['pool','stories','representatives']`), §10 row 11 keeps testimonials in their empty state until consent, and the design's own amber note (`success.033/034`) and disclaimer (`success.069`) call the metrics and quotes placeholders. So the page ships as the **designed empty wall (W6)**: hero (h1 = LCP, no stat cards), the approvals wall with the site's sector chips and the "first approvals are on their way" state (`sys.stories.empty.*`), and the closing CTA band. Every hidden section is a component that **returns `null` on empty data** — nothing is deleted, so the day Ops publishes a `stories` row (Phase B, I10) the wall, the live badge and the worker-side section render without a code change.

**No form.** PRD §2 row 11: "none". The design has zero `<form>`; its lead exits are links (WhatsApp job order, a call booking → Contact, the calculator). There is therefore **no `actions.ts`**, no Zod schema and no catalog mapping in this task; the page's conversions are `whatsapp_click` (placement `page_cta`) through `ContactCta`/`ClosingCtaBand` and the internal navigations. The "fallback panel after submit" contract item does not apply and the e2e spec says so in a comment.

**Design deltas (recorded for the Fable side-by-side review, D27 — not a harness page):**

1. Hero stat cards, live badge, "Numbers we do not hide" box, testimonials and worker stories are hidden by data (W1/W6/§10 row 11/D23) — components exist and return `null`.
2. Sector chips use the site's one `sectors` taxonomy (T0b `sectors` collection, keys `factory|construction|tourism|agriculture|textile|logistics|other`, labels `hire.076–082`) plus the design's "All sectors" chip (`success.124`) — not the design's private `hotels|construction|factory|agriculture|logistics|food` enum, so a story row's `sector` is the same key every form sends (CONTENT-MODEL § Collections: one `sector` list with the CRM `Industry` mapping). `success.125–130` are therefore not rendered.
3. The ≤700 px "Latest approvals" swipe slider, `:nth-child` hiding, show-more and the proof frame (redact bars, watermark, "1 / N") are v1.1 material (D9, D22 scope ladder) — the v1 wall is one responsive card grid; the chips are the `RadioChips` primitive (44 px targets, D20).
4. The band's third action ("Or estimate the cost yourself →", `success.083`) renders as an inverse button inside `ClosingCtaBand` rather than a bare text link (the block has no text-link slot).
5. The design's absolute `www.jobsadmire.com/contact-us`, `/work-permit`, `/available-workers`, `/hiring-cost-calculator` links become typed `pathnames` hrefs.
6. Filter state is not URL-addressable (PRD §4: facet views canonicalise to the base page); no `approval_filter` event (not allow-listed, W12).

**Files:**

Create

- `src/app/[locale]/(site)/success-stories/page.tsx` — the server page (metadata, hero, wall, hidden sections, closing band)
- `src/app/[locale]/(site)/success-stories/_lib/stories.ts` — `StorySchema`, `readStories`, `storyCards` (the `stories` collection door), `TestimonialSchema`, `readTestimonials`
- `src/app/[locale]/(site)/success-stories/_lib/metrics.ts` — `STORIES_HERO_METRICS`, `NEGATIVE_KPIS` (both empty under W1, typed against `MetricKey`)
- `src/app/[locale]/(site)/success-stories/_components/ApprovalsWall.tsx` — `'use client'` island: chips + result label + card grid + the two empty states
- `src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx` — one approval card (no hooks, no directive)
- `src/app/[locale]/(site)/success-stories/_components/LiveBadge.tsx` — hero pill, `null` on no stories
- `src/app/[locale]/(site)/success-stories/_components/NumbersBox.tsx` — the dark KPI box, `null` when no KPI is signed
- `src/app/[locale]/(site)/success-stories/_components/Testimonials.tsx` — `null` on an empty `testimonials` collection
- `src/app/[locale]/(site)/success-stories/_components/WorkerStories.tsx` — `null` while the `stories` collection is empty
- `src/app/[locale]/(site)/success-stories/__tests__/stories.test.ts`
- `src/app/[locale]/(site)/success-stories/__tests__/metrics.test.ts`
- `src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx`
- `src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx`
- `e2e/pages/success-stories.spec.ts`

Modify

- `src/messages/tr.json`, `src/messages/en.json` — add `sys.seo.stories.{title,description}` under the existing `seo` object (T0d created it with `ogTagline`) and the new `sys.stories.*` object (both files, identical key sets — `src/messages/messages.test.ts` asserts parity)
- `src/lib/seo/routes.ts` — delete `'/success-stories'` from `UNBUILT_PATHNAMES` (T0d's set; the literal is the `new Set<keyof typeof pathnames>([...])` block that starts at the `export const UNBUILT_PATHNAMES` line — one line removed)
- `e2e/routes.ts` — append `{ path: '/basari-hikayeleri', indexable: true }` and `{ path: '/en/success-stories', indexable: true }` to `GATE_ROUTE_TABLE` (T0e's table, after the `/en/hire-workers` row and any rows earlier page tasks added; before the `/tesekkurler?form=hire` row)
- `docs/SEO.md` — page row (see Cycle 6)
- `docs/ANALYTICS.md` — page instrumentation line (Cycle 6)
- `docs/CONTENT-MODEL.md` — `sys.stories.*` / `sys.seo.stories.*` namespace line (Cycle 6)
- `docs/PRD.md` line 30 (row 11) — Phase A behaviour sentence (Cycle 6)

Test

- Vitest: the five `__tests__` files above (all matched by `src/**/*.test.{ts,tsx}`), plus the existing `src/lib/seo/unbuilt.test.ts` (goes red when `page.tsx` exists and the `UNBUILT_PATHNAMES` entry is still there — the W20 mechanism), `src/messages/messages.test.ts` (key parity) and `scripts/gate-routes.test.ts` (both locales present).
- Playwright: `e2e/pages/success-stories.spec.ts` (both projects) — run by `npm run gate`; plus the existing page-contract loop in `e2e/routing.spec.ts` and the canonical/hreflang/sitemap loop in `e2e/seo.spec.ts`, which pick the two new routes up from `INDEXABLE_GATE_ROUTES` automatically.

**Interfaces:**

Consumes (exact names — WP1 code read at `ad58fb8`, WP2a per `produces-final.md`):

- WP1 `@/content/adapter`: `getBundle(locale)` (server-only, React `cache`), re-exports of `@/content/pure` (`makeT`, `assertServableInProduction`). `@/content/config`: `FIXTURE_ONLY_COLLECTIONS`. `@/i18n/routing`: `routing`, `type Locale`. `@/i18n/navigation`: `Link`. `@/lib/contact`: `waLink(number, text)`. `@/lib/format/money`: `formatInt(n, locale)`. `@/lib/seo/JsonLdScript`: `JsonLd` (used through `Breadcrumbs`). `contract/website-bundle.v1`: `type Bundle`, `BundleSchema`.
- T0b `@/content/collections`: `getCollection(bundle, 'sectors' | 'countries')`, `SECTOR_KEYS`, `type SectorKey`, `type MetricKey`, `METRIC_KEYS`. `@/content/pure`: `makeTf(bundle, locale)` (D17 — every package id on this page goes through it).
- T0c `@/design/chrome/ctas.ts`: no `/success-stories` entry → `DEFAULT_CTAS` (home.014+015 → `/hire-workers#request-form`); this page owns no header-CTA anchor id. Route group `(site)` layout mounts the default chrome; the page renders no `<main>` (R31).
- T0d `@/lib/seo/metadata`: `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` — the page record `stories` has `titleId: ''`/`descriptionId: ''` (only hire/partner carry SEO strings), so the `sys.seo.stories.*` fallbacks are what render (W23/W38). `@/lib/seo/routes`: `UNBUILT_PATHNAMES` (edited), `pageOgImageUrl` (indirect — `stories` ∈ `OG_PAGE_KEYS`).
- T0d `@/design/blocks`: `Breadcrumbs({ locale, items: Crumb[], tone })`, `ClosingCtaBand({ bundle, locale, titleId, bodyId, primary, secondary, extra, tone, id })`, `EmptyState({ title, body, cta, tone, headingLevel, testId })`, `ImageSlot({ slot, alt, width, height, className })`, `MetricStrip({ bundle, locale, metrics, tone })`, `ContactCta`. `@/design/primitives`: `Button` (variants incl. `inverse`), `Eyebrow`, `RadioChips({ name, options, value, onChange, legend, legendHidden })` + `type RadioChipOption`, `Section({ tone: 'light'|'dark'|'pale'|'band' })`, `Card`. `@/lib/format/date`: `formatMonth(iso, locale)` (server/test only — never imported by the island).
- T0e `e2e/routes.ts`: `GATE_ROUTE_TABLE` (edited). Page markup contract: one `<h1 data-testid="page-h1">`, `data-lcp-slot="h1"` on it (gradient hero, §10 row 4), named `data-placeholder="ss-hero"` on the hero image slot (W55) and never on the LCP element (D26).
- T5 test helper `@/test/bundle`: `testBundle({ strings, collections, settings })`. WP1 `@/test/render`: `renderWithIntl(ui, { locale })`.
- Ops catalog: nothing — the page sends no form.

Produces: nothing later tasks rely on. (`StorySchema`'s row shape — `{ id, sector: SectorKey, roles, headcount, approvedAt 'YYYY-MM-DD', place, countries: ISO-2[] }` — is the v1 `successStory` card shape D9 names; Phase B's importer/CMS emits it under `collections.stories`, and I10 in `docs/INTEGRATIONS.md` gets the shape line in Cycle 6.)

---

- [ ] **Cycle 1 — the data door: `stories`/`testimonials` readers, W1 metric pins, and the production refusal test**

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/success-stories/__tests__/stories.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FIXTURE_ONLY_COLLECTIONS } from '@/content/config';
import { assertServableInProduction } from '@/content/pure';
import { testBundle } from '@/test/bundle';
import {
  readStories,
  readTestimonials,
  storyCards,
  StorySchema,
  type Story,
} from '../_lib/stories';

// The v1 card shape (D9): sector, roles, headcount, approval month, city-only place, countries.
const ROW: Story = {
  id: 'AP-2026-118',
  sector: 'tourism',
  roles: 'Kat görevlileri, mutfak yardımcıları',
  headcount: 12,
  approvedAt: '2026-06-01',
  place: 'Antalya',
  countries: ['KG', 'PK'],
};

const SECTORS = [
  { key: 'tourism', labelId: 'hire.078', subtitleId: null, icon: 'hotel' },
  { key: 'factory', labelId: 'hire.076', subtitleId: null, icon: 'factory' },
];
const COUNTRIES = [
  { code: 'KG', name: 'Kırgızistan', dial: '+996' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
];
const STRINGS = {
  'hire.078': 'Turizm / Konaklama',
  'hire.076': 'Fabrika / Üretim',
  'success.041': 'çalışma izni',
};

describe('the stories collection can never be served from LOCAL in production (D23)', () => {
  it('is a fixture-only collection', () => {
    expect(FIXTURE_ONLY_COLLECTIONS).toContain('stories');
  });
  it('is refused by the adapter guard when it carries rows', () => {
    const bundle = testBundle({ collections: { stories: [ROW] } });
    expect(() => assertServableInProduction(bundle, 'LOCAL', 'production')).toThrow(
      /stories.*never served from LOCAL/,
    );
    // The same rows from Operations (Phase B) are fine — that is the whole point of the guard.
    expect(() => assertServableInProduction(bundle, 'OPS', 'production')).not.toThrow();
  });
});

describe('readStories', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('is empty when the bundle has no stories key (Phase A)', () => {
    expect(readStories(testBundle())).toEqual([]);
  });
  it('parses well-formed rows', () => {
    expect(readStories(testBundle({ collections: { stories: [ROW] } }))).toEqual([ROW]);
  });
  it('throws outside production on a row that misses the schema', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const bad = { ...ROW, headcount: 'twelve' };
    expect(() => readStories(testBundle({ collections: { stories: [bad] } }))).toThrow(
      /stories.*schema/,
    );
  });
  it('degrades to an empty wall in production on a bad row', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bad = { ...ROW, sector: 'hotels' }; // the design's private enum, not the site's
    expect(readStories(testBundle({ collections: { stories: [bad] } }))).toEqual([]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('accepts only the site sector keys and upper-case ISO-2 countries', () => {
    expect(StorySchema.safeParse({ ...ROW, sector: 'hotels' }).success).toBe(false);
    expect(StorySchema.safeParse({ ...ROW, countries: ['kg'] }).success).toBe(false);
    expect(StorySchema.safeParse({ ...ROW, approvedAt: '2026-06' }).success).toBe(false);
  });
});

describe('storyCards', () => {
  it('resolves labels for the island: sector label, localized month, country names, headcount', () => {
    const bundle = testBundle({
      strings: STRINGS,
      collections: { stories: [ROW], sectors: SECTORS, countries: COUNTRIES },
    });
    const [card] = storyCards(bundle, 'tr', readStories(bundle));
    expect(card).toEqual({
      id: 'AP-2026-118',
      sector: 'tourism',
      sectorLabel: 'Turizm / Konaklama',
      roles: 'Kat görevlileri, mutfak yardımcıları',
      headcountLabel: '12 çalışma izni',
      monthLabel: 'Haziran 2026',
      place: 'Antalya',
      countries: ['Kırgızistan', 'Pakistan'],
    });
  });
  it('formats the headcount per locale (D18) and falls back to the code for an unknown country', () => {
    const bundle = testBundle({
      strings: { ...STRINGS, 'success.041': 'work permits' },
      collections: {
        stories: [{ ...ROW, headcount: 1240, countries: ['ZZ'] }],
        sectors: SECTORS,
        countries: COUNTRIES,
      },
    });
    const [card] = storyCards(bundle, 'en', readStories(bundle));
    expect(card.headcountLabel).toBe('1,240 work permits');
    expect(card.monthLabel).toBe('June 2026');
    expect(card.countries).toEqual(['ZZ']);
  });
  it('sorts newest approval first', () => {
    const older: Story = { ...ROW, id: 'AP-2025-063', approvedAt: '2025-08-01' };
    const bundle = testBundle({
      strings: STRINGS,
      collections: { stories: [older, ROW], sectors: SECTORS, countries: COUNTRIES },
    });
    expect(storyCards(bundle, 'tr', readStories(bundle)).map((c) => c.id)).toEqual([
      'AP-2026-118',
      'AP-2025-063',
    ]);
  });
});

describe('readTestimonials', () => {
  it('is empty in Phase A (§10 row 11) and parses a consented row', () => {
    expect(readTestimonials(testBundle())).toEqual([]);
    const row = { id: 't1', quote: '“…”', role: 'İK Müdürü', org: 'Otel grubu · Kemer', initials: 'HK' };
    expect(readTestimonials(testBundle({ collections: { testimonials: [row] } }))).toEqual([row]);
  });
});
```

`src/app/[locale]/(site)/success-stories/__tests__/metrics.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { METRIC_KEYS } from '@/content/collections';
import { NEGATIVE_KPIS, STORIES_HERO_METRICS } from '../_lib/metrics';

// W1: the page's 1,240+ / 68 / 41 days / 91 % and the four negative KPIs are NOT signed. The
// hero strip and the KPI box therefore read empty lists and render nothing. Signing a metric
// means: the owner signs it, T0b's importer emits it under a METRIC_KEYS entry, and the key is
// listed here with its caption id — at which point this pin is edited in the same commit.
describe('Success Stories metric lists (W1)', () => {
  it('lists no hero metric and no negative KPI until the owner signs them', () => {
    expect(STORIES_HERO_METRICS).toEqual([]);
    expect(NEGATIVE_KPIS).toEqual([]);
  });
  it('can only ever name real metric keys', () => {
    for (const k of STORIES_HERO_METRICS) expect(METRIC_KEYS).toContain(k);
    for (const k of NEGATIVE_KPIS) expect(METRIC_KEYS).toContain(k.key);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```
npx vitest run "src/app/\[locale\]/(site)/success-stories"
```

Both files fail at import: `Cannot find module '../_lib/stories'` / `'../_lib/metrics'`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/_lib/stories.ts`:

```ts
import { z } from 'zod';
import { getCollection, SECTOR_KEYS, type SectorKey } from '@/content/collections';
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import { formatMonth } from '@/lib/format/date';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * One published permit approval — the v1 card (D9): sector, roles, headcount, approval month,
 * city-only place, source countries. No scan, no document, no name (v1.1 adds the keep-crop
 * proof image). `stories` is a FIXTURE_ONLY collection (D23): under LOCAL it is empty on every
 * Vercel build, so Phase A renders the W6 empty wall; Phase B's Ops bundle fills it (I10).
 */
export const StorySchema = z.object({
  id: z.string().min(1),
  /** The site's one sector taxonomy (T0b `sectors`), never the design's private enum. */
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

/** The same dev-throw / prod-degrade rule as T0b's `getCollection` (which types only the eight
 *  Phase A collections; `stories` and `testimonials` are Phase B rows read here). */
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
 *  no bundle, no date formatter and no message file (D6/W13). */
export type StoryCardData = {
  id: string;
  sector: SectorKey;
  sectorLabel: string;
  roles: string;
  /** `formatInt(headcount) + ' ' + t('success.041')` — the package splits number and unit. */
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
```

`src/app/[locale]/(site)/success-stories/_lib/metrics.ts`:

```ts
import type { MetricKey } from '@/content/collections';

/**
 * W1: the design's four hero figures (1,240+ workers placed / 68 employers since 2019 /
 * 41 days to first shift / 91 % still employed at 12 months) are not signed metrics — and
 * success.029 ("since 2019") contradicts the licence date the About page carries. The hero
 * strip therefore reads an EMPTY list and `MetricStrip` renders nothing (W6). When the owner
 * signs a page metric it is emitted by T0b's importer under a `METRIC_KEYS` entry and listed
 * here; `__tests__/metrics.test.ts` pins the current state.
 */
export const STORIES_HERO_METRICS: MetricKey[] = [];

/** The "Numbers we do not hide" box (success.046–057): four negative KPIs with a body line each.
 *  Unsigned (W1) → empty → `NumbersBox` returns null. Shape kept so signing one is a data edit. */
export type NegativeKpi = { key: MetricKey; labelId: string; bodyId: string };
export const NEGATIVE_KPIS: NegativeKpi[] = [];
```

- [ ] **Step 4: Run tests + `npm run verify`**

```
npx vitest run "src/app/\[locale\]/(site)/success-stories"
npm run verify
```

Both test files green (13 cases). `verify` green — nothing else changed yet.

- [ ] **Step 5: Commit**

```
git add "src/app/[locale]/(site)/success-stories/_lib" "src/app/[locale]/(site)/success-stories/__tests__/stories.test.ts" "src/app/[locale]/(site)/success-stories/__tests__/metrics.test.ts"
git commit -m "feat(stories): stories/testimonials collection readers and the W1 metric pins (T9 c1)

The stories fixture is asserted refused from LOCAL in production (D23); the hero and KPI
metric lists are empty under W1 and pinned by test.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 2 — `sys.stories.*` + `sys.seo.stories.*` copy in both message files**

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key this page reads (W9/W23) — the page never reads a key outside this list,
 *  and both locale files carry every key (messages.test.ts asserts the two sets are identical;
 *  this pins that the page's own keys exist at all). */
export const STORIES_SYS_KEYS = [
  'seo.stories.title',
  'seo.stories.description',
  'stories.hero.liveBadge',
  'stories.wall.legend',
  'stories.wall.showingAll',
  'stories.wall.showingFiltered',
  'stories.empty.title',
  'stories.empty.body',
  'stories.empty.cta',
  'stories.whatsappPrefill',
  'stories.workers.card1Title',
] as const;

const get = (root: unknown, path: string) =>
  path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), root);

describe('sys.stories.* / sys.seo.stories.* (W9, W23)', () => {
  it.each(STORIES_SYS_KEYS)('%s exists in both locales as a non-empty string', (key) => {
    for (const messages of [tr, en]) {
      const v = get(messages.sys, key);
      expect(typeof v).toBe('string');
      expect((v as string).length).toBeGreaterThan(0);
    }
  });
  it('the ICU plurals carry the placeholders the island passes', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'stories.hero.liveBadge')).toMatch(/\{count, plural,/);
      expect(get(messages.sys, 'stories.wall.showingAll')).toMatch(/\{count, plural,/);
      expect(get(messages.sys, 'stories.wall.showingFiltered')).toMatch(/\{shown\}.*\{total\}|\{total\}.*\{shown\}/);
    }
  });
  it('the SEO title ends with the brand and says Türkiye, not Turkey (W7)', () => {
    expect(get(en.sys, 'seo.stories.title')).toMatch(/Türkiye.*\| JobsAdmire$/);
    expect(get(tr.sys, 'seo.stories.title')).toMatch(/\| JobsAdmire$/);
    expect(get(en.sys, 'seo.stories.description')).not.toMatch(/\bTurkey\b/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/sys-keys.test.ts"
```

Every `it.each` row fails (`expected "undefined" to be "string"`).

- [ ] **Step 3: Implement**

`src/messages/tr.json` — inside the existing `"sys"` object. Add the two `stories` keys inside the existing `"seo"` object (T0d created `"seo": { "ogTagline": "…" }`), and add a new top-level `"stories"` object as a sibling of `"thankYou"`. Exact JSON to merge (keep the file's 2-space indent; Prettier checks it):

```json
"seo": {
  "ogTagline": "<unchanged>",
  "stories": {
    "title": "Başarı Hikâyeleri — Türkiye'de Onaylanmış Yabancı İşçi Yerleştirmeleri | JobsAdmire",
    "description": "Türkiye'deki işverenler için aldığımız çalışma izni onayları: sektör, kişi sayısı ve ay. Kişisel bilgiler çıkarılır; onaylar çıkarılmaz."
  }
},
"stories": {
  "hero": {
    "liveBadge": "{count, plural, one {# izin onaylandı} other {# izin onaylandı}}"
  },
  "wall": {
    "legend": "Sektöre göre filtreleyin",
    "showingAll": "{count, plural, one {# onayın tamamı gösteriliyor} other {# onayın tamamı gösteriliyor}}",
    "showingFiltered": "{total} onaydan {shown} tanesi gösteriliyor"
  },
  "empty": {
    "title": "İlk onaylar yolda",
    "body": "Yayınlanan her çalışma izni onayı burada sektörü, kişi sayısı ve ayıyla yer alacak. Şimdiden bir örnek görmek isterseniz bize yazın; size bir tanesini gösterelim.",
    "cta": "WhatsApp'tan bir örnek isteyin"
  },
  "whatsappPrefill": "Merhaba JobsAdmire, izin onaylarınızı gördüm. Şu pozisyonlar için işçiye ihtiyacım var: ",
  "workers": {
    "card1Title": "Kaynakçı · Özbekistan → Ankara"
  }
}
```

`src/messages/en.json` — same positions:

```json
"seo": {
  "ogTagline": "<unchanged>",
  "stories": {
    "title": "Success Stories — Approved Foreign Worker Placements in Türkiye | JobsAdmire",
    "description": "The work permit approvals we obtained for employers in Türkiye — sector, headcount and month. Personal details are removed; the approvals are not."
  }
},
"stories": {
  "hero": {
    "liveBadge": "{count, plural, one {# permit approved} other {# permits approved}}"
  },
  "wall": {
    "legend": "Filter by sector",
    "showingAll": "Showing all {count, plural, one {# approval} other {# approvals}}",
    "showingFiltered": "Showing {shown} of {total} approvals"
  },
  "empty": {
    "title": "The first approvals are on their way",
    "body": "Every published work permit approval will appear here with its sector, headcount and month. If you would like to see one now, write to us and we will show you one.",
    "cta": "Ask for an example on WhatsApp"
  },
  "whatsappPrefill": "Hello JobsAdmire, I saw your permit approvals. I need workers for: ",
  "workers": {
    "card1Title": "Welder · Uzbekistan → Ankara"
  }
}
```

Why these keys and not package ids (W9/W23): the live badge's "N permits approved · live from CRM / sample data" (`success.138–140`) presumes a browser feed and must never render "sample data" — replaced by one ICU count; the result label's "of" / "approvals" words have no ids (`success.141/142` are the fragments "Showing all" / "Showing"); the W6 empty state is new copy by ruling; the design's CTA prefill (page line 1119) has no id (`success.137` is the generic hire text); worker card 1's title (page line 776) has no id. `sys.seo.stories.*` because `success.json` carries no title/description (page head lines 11–12 have no ids).

- [ ] **Step 4: Run tests + `npm run verify`**

```
npx prettier --write src/messages/tr.json src/messages/en.json
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/sys-keys.test.ts" src/messages
npm run verify
```

`sys-keys.test.ts` green (13 cases), `messages.test.ts` green (identical key sets). `verify` green.

- [ ] **Step 5: Commit**

```
git add src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts"
git commit -m "feat(stories): sys.stories.* and sys.seo.stories.* copy, TR + EN (T9 c2)

W6 empty-wall copy, the ICU count labels, the WhatsApp prefill and the id-less worker
card title (W9); SEO fallbacks because the package has no SEO strings for the page (W23).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 3 — the page: metadata, hero (LCP h1), closing band; gate route + unbuilt set; the e2e spec's contract cases**

- [ ] **Step 1: Write the failing tests**

`e2e/pages/success-stories.spec.ts` (Playwright; the wall/hidden-section cases are appended in Cycles 4–5 — write the file now with the contract cases):

```ts
import { test, expect } from '@playwright/test';

// Canonicals and hreflang are built from SITE_URL (the production origin), not the run host.
const ORIGIN = 'https://www.jobsadmire.com';

const ROUTES = [
  { path: '/basari-hikayeleri', locale: 'tr', alternate: '/en/success-stories' },
  { path: '/en/success-stories', locale: 'en', alternate: '/basari-hikayeleri' },
] as const;

// No form on this page (PRD §2 row 11: "none"): there is no fallback-panel case here on
// purpose — the page's only doors are WhatsApp / internal links.
for (const r of ROUTES) {
  test.describe(`Success Stories ${r.path}`, () => {
    test('answers 200 with one tagged h1 of real copy and no leaked tokens', async ({ page }) => {
      const res = await page.goto(r.path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', r.locale);
      await expect(page.locator('h1')).toHaveCount(1);
      const h1 = page.locator('h1[data-testid="page-h1"]');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
      const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
      expect(body.length).toBeGreaterThan(0);
      expect(body).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
    });

    test('names the hero image slot as a placeholder, never as the LCP element (D26/W55)', async ({
      page,
    }) => {
      await page.goto(r.path);
      const slot = page.locator('[data-placeholder="ss-hero"]');
      await expect(slot).toHaveCount(1);
      await expect(slot).not.toHaveAttribute('data-lcp-slot', /.+/);
      await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    });

    test('canonical + hreflang point at the localized URLs and the switch keeps the page', async ({
      page,
    }, testInfo) => {
      await page.goto(r.path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}${r.path}`);
      await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/basari-hikayeleri`,
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/en/success-stories`,
      );
      // The header switcher is in the desktop row only (below the threshold it lives in the
      // hamburger) — click it on the desktop project, and prove the target on both.
      if (testInfo.project.name === 'desktop') {
        // `exact`: the LanguageHint's "Switch to English" link would otherwise match too.
        await page
          .getByRole('link', { name: r.locale === 'tr' ? 'English' : 'Türkçe', exact: true })
          .first()
          .click();
        await expect(page).toHaveURL(new RegExp(`${r.alternate}$`));
        await expect(page.locator('h1[data-testid="page-h1"]')).toBeVisible();
      } else {
        await page.goto(r.alternate);
        await expect(page.locator('h1[data-testid="page-h1"]')).toBeVisible();
      }
    });

    test('carries a BreadcrumbList node and the closing band with a tracked WhatsApp door', async ({
      page,
    }) => {
      await page.goto(r.path);
      const nodes = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(nodes.some((n) => n.includes('"BreadcrumbList"'))).toBe(true);
      const band = page.locator('#talk');
      await expect(band).toHaveCount(1);
      const wa = band.locator('a[href^="https://wa.me/"]');
      await expect(wa).toHaveCount(1);
      await expect(wa).toHaveAttribute('target', '_blank');
      await expect(wa).toHaveAttribute('rel', /noopener/);
      // The hero's "Discuss your case" is an in-page anchor to that band.
      await expect(page.locator('a[href="#talk"]')).toHaveCount(1);
    });
  });
}
```

Also: creating `page.tsx` without editing `UNBUILT_PATHNAMES` makes T0d's `src/lib/seo/unbuilt.test.ts` red (the filesystem walk finds `success-stories/page.tsx` while the set still lists `/success-stories`) — that is the W20 mechanism; it is the second failing test of this cycle.

- [ ] **Step 2: Run to verify they fail**

```
npx playwright test e2e/pages/success-stories.spec.ts --project=desktop
```

Every case fails with status 404 (the `(site)/[...rest]` catch-all) — `expect(res?.status()).toBe(200)` receives 404.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import {
  Breadcrumbs,
  ClosingCtaBand,
  ImageSlot,
  MetricStrip,
  type Crumb,
} from '@/design/blocks';
import { Button, Eyebrow, Section, type RadioChipOption } from '@/design/primitives';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { NEGATIVE_KPIS, STORIES_HERO_METRICS } from './_lib/metrics';
import { readStories, readTestimonials, storyCards } from './_lib/stories';
import { ApprovalsWall } from './_components/ApprovalsWall';
import { LiveBadge } from './_components/LiveBadge';
import { NumbersBox } from './_components/NumbersBox';
import { Testimonials } from './_components/Testimonials';
import { WorkerStories } from './_components/WorkerStories';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  // The package has no SEO strings for this page (success.json head lines have no ids), so the
  // record's titleId/descriptionId are '' and these sys fallbacks are what renders (W23/W38).
  return buildMetadata({
    locale,
    href: '/success-stories',
    bundle,
    pageKey: 'stories',
    fallbackTitle: sys('seo.stories.title'),
    fallbackDescription: sys('seo.stories.description'),
  });
}

export default async function SuccessStories({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeTf(bundle, locale);

  // Phase A: `stories` is a FIXTURE_ONLY collection — empty on every Vercel build (D23), so the
  // wall is the W6 empty state and every data-gated section below returns null. Phase B fills
  // it from Operations (I10) and the same components render the cards.
  const stories = readStories(bundle);
  const cards = storyCards(bundle, locale, stories);
  const testimonials = readTestimonials(bundle);
  const whatsapp = bundle.settings.whatsappNumber;

  const crumbs: Crumb[] = [
    { name: t('success.022'), href: '/' },
    { name: t('success.013'), href: '/success-stories' },
  ];
  // Delta 2: the site's sector taxonomy (T0b `sectors`, the keys every form sends), plus the
  // design's "All sectors" chip — not the design's private hotels/food enum.
  const sectorOptions: RadioChipOption[] = [
    { value: 'all', label: t('success.124') },
    ...getCollection(bundle, 'sectors').map((s) => ({ value: s.key, label: t(s.labelId) })),
  ];
  const exampleHref = waLink(whatsapp, sys('stories.whatsappPrefill'));

  return (
    <>
      {/* ---- Hero (design: .ja-ss-hero, navy + two gradient overlays) ---- */}
      <Section tone="dark" className="relative overflow-hidden">
        {/* §10 row 4: gradients everywhere but the two photo heroes — the slot stays a named
            placeholder (W55) and the h1 is the LCP element (D26). Decorative: alt "". */}
        <ImageSlot
          slot="ss-hero"
          alt=""
          width={1440}
          height={620}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,26,55,0.96)_0%,rgba(14,26,55,0.9)_55%,rgba(14,26,55,0.78)_100%)]"
        />
        <div className="container-site relative">
          <Breadcrumbs locale={locale} items={crumbs} tone="dark" className="mb-6" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <LiveBadge stories={stories} />
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="text-h1 m-0 mb-4 leading-[1.02] tracking-[-0.03em] text-white"
              >
                {t('success.023')} <span className="text-sky">{t('success.024')}</span>
              </h1>
              <p className="text-body-lg m-0 mb-7 max-w-[540px] text-white/80">{t('success.025')}</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="lg" href="#talk">
                  {t('success.026')}
                </Button>
                <Button variant="inverse" size="lg" href="/hiring-cost-calculator">
                  {t('success.027')}
                </Button>
              </div>
            </div>
            {/* W1: the design's four stat cards (success.028–032 captions) — unsigned, so the
                strip reads an empty list and renders nothing. */}
            <MetricStrip bundle={bundle} locale={locale} metrics={STORIES_HERO_METRICS} tone="dark" />
          </div>
          {/* success.033/034 (the amber "still to replace" note) is a design-time instruction
              with a string id — deliberately not rendered. */}
        </div>
      </Section>

      {/* ---- Approvals wall (#cases) ---- */}
      <Section tone="light" id="cases">
        <div className="container-site">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[640px]">
              <Eyebrow>{t('success.035')}</Eyebrow>
              <h2 className="text-h2 m-0 mb-2">{t('success.036')}</h2>
              <p className="text-body m-0 text-text-secondary">{t('success.037')}</p>
            </div>
            <Button variant="primary" href="/work-permit">
              {t('success.038')}
            </Button>
          </div>
          <ApprovalsWall
            sectors={sectorOptions}
            stories={cards}
            legend={sys('stories.wall.legend')}
            empty={{
              title: sys('stories.empty.title'),
              body: sys('stories.empty.body'),
              cta: { label: sys('stories.empty.cta'), href: exampleHref, external: true },
            }}
            noneInSector={{
              title: t('success.043'),
              body: t('success.044'),
              reset: t('success.045'),
            }}
            approvedLabel={t('success.040')}
          />
        </div>
      </Section>

      {/* ---- "Numbers we do not hide" — hidden until a KPI is signed (W1) ---- */}
      <NumbersBox bundle={bundle} locale={locale} kpis={NEGATIVE_KPIS} />

      {/* ---- Employer testimonials — hidden until consented rows exist (§10 row 11) ---- */}
      <Testimonials bundle={bundle} locale={locale} items={testimonials} />

      {/* ---- "The other side" worker stories — hidden while no approval is published ---- */}
      <WorkerStories bundle={bundle} locale={locale} visible={stories.length > 0} />

      {/* ---- Closing CTA (#talk) ---- */}
      <Section tone="band">
        <div className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            id="talk"
            tone="gradient"
            titleId="success.079"
            bodyId="success.080"
            primary={{
              label: t('success.081'),
              href: exampleHref,
              external: true,
            }}
            secondary={{ label: t('success.082'), href: '/contact' }}
            extra={[{ label: t('success.083'), href: '/hiring-cost-calculator' }]}
          />
        </div>
      </Section>
    </>
  );
}
```

Note on `Button` hrefs: `#talk` is neither `/`-rooted nor `external`, so `Button` renders a same-tab `<a href="#talk">` (R22); `/hiring-cost-calculator`, `/work-permit` and `/contact` are `pathnames` keys, so the next-intl `Link` branch localizes them (`/maliyet-hesaplayici`, `/calisma-izni`, `/iletisim` under TR).

The four `_components` files the page imports are written in Cycles 4–5; for this cycle's build to type-check, create them now as **the final files** from Cycles 4 and 5 (Step 3 there) — or, if you prefer a strictly green build per cycle, create the Cycle 4/5 files first and run this cycle's Step 4 last. The commit boundaries below assume the latter is not needed: Cycle 3's commit includes only `page.tsx`, the route edits and the spec; the component files land with their own tests in Cycles 4–5. (Either order is fine; `npm run verify` at the end of Cycle 5 is the binding check.)

`src/lib/seo/routes.ts` — in `UNBUILT_PATHNAMES`'s `new Set<keyof typeof pathnames>([ … ])` literal, delete the line `'/success-stories',`.

`e2e/routes.ts` — in `GATE_ROUTE_TABLE`, after the `/en/hire-workers` row (and after any rows earlier page tasks appended), before the `/tesekkurler?form=hire` row, add:

```ts
  { path: '/basari-hikayeleri', indexable: true },
  { path: '/en/success-stories', indexable: true },
```

- [ ] **Step 4: Run tests + `npm run verify`**

```
npx vitest run src/lib/seo/unbuilt.test.ts scripts/gate-routes.test.ts
npm run verify
npm run build && (npx next start -p 3100 &) && sleep 4
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/success-stories.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts
```

`unbuilt.test.ts` green once the set entry is deleted; `gate-routes.test.ts` green (both locales present). The page spec's four cases pass under both projects; `routing.spec.ts`'s page-contract loop and `seo.spec.ts`'s canonical/sitemap loop now include the two routes and pass (the sitemap lists `/basari-hikayeleri` and `/en/success-stories` because the key left `UNBUILT_PATHNAMES`). Kill the `next start` afterwards.

- [ ] **Step 5: Commit**

```
git add "src/app/[locale]/(site)/success-stories/page.tsx" src/lib/seo/routes.ts e2e/routes.ts e2e/pages/success-stories.spec.ts
git commit -m "feat(stories): Success Stories page — hero (h1 LCP), wall header, closing band, gate route (T9 c3)

/basari-hikayeleri + /en/success-stories leave UNBUILT_PATHNAMES (W20) and join the gate
list (W21). sys.seo.stories fallbacks (W23); BreadcrumbList via Breadcrumbs.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 4 — the approvals wall island: chips, result label, cards, the two empty states**

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { ApprovalsWall } from '../_components/ApprovalsWall';
import type { StoryCardData } from '../_lib/stories';

const SECTORS = [
  { value: 'all', label: 'Tüm sektörler' },
  { value: 'tourism', label: 'Turizm / Konaklama' },
  { value: 'factory', label: 'Fabrika / Üretim' },
];
const EMPTY = {
  title: 'İlk onaylar yolda',
  body: 'Yayınlanan her onay burada yer alacak.',
  cta: { label: "WhatsApp'tan bir örnek isteyin", href: 'https://wa.me/905011240340?text=x', external: true },
};
const NONE = {
  title: 'Bu sektörde henüz yayınlanmış onay yok',
  body: 'Bize sorun, size bir tanesini gösterelim.',
  reset: 'Tüm sektörleri göster',
};
const CARDS: StoryCardData[] = [
  {
    id: 'AP-2026-118',
    sector: 'tourism',
    sectorLabel: 'Turizm / Konaklama',
    roles: 'Kat görevlileri',
    headcountLabel: '12 çalışma izni',
    monthLabel: 'Haziran 2026',
    place: 'Antalya',
    countries: ['Kırgızistan', 'Pakistan'],
  },
  {
    id: 'AP-2025-063',
    sector: 'factory',
    sectorLabel: 'Fabrika / Üretim',
    roles: 'Makine operatörleri',
    headcountLabel: '8 çalışma izni',
    monthLabel: 'Ağustos 2025',
    place: 'Gaziantep',
    countries: ['Hindistan'],
  },
];

const wall = (stories: StoryCardData[]) =>
  renderWithIntl(
    <ApprovalsWall
      sectors={SECTORS}
      stories={stories}
      legend="Sektöre göre filtreleyin"
      empty={EMPTY}
      noneInSector={NONE}
      approvedLabel="Onaylandı"
    />,
  );

describe('ApprovalsWall (W6)', () => {
  it('renders the chips and the "first approvals" state when the collection is empty', () => {
    wall([]);
    const group = screen.getByRole('radiogroup', { name: 'Sektöre göre filtreleyin' });
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
    expect(within(group).getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    const empty = screen.getByRole('status');
    expect(empty).toHaveAttribute('data-testid', 'stories-empty');
    expect(within(empty).getByRole('heading', { level: 3, name: 'İlk onaylar yolda' })).toBeInTheDocument();
    const cta = within(empty).getByRole('link', { name: "WhatsApp'tan bir örnek isteyin" });
    expect(cta).toHaveAttribute('href', 'https://wa.me/905011240340?text=x');
    expect(cta).toHaveAttribute('target', '_blank');
    // Nothing to count, nothing to show: no result label, no grid.
    expect(screen.queryByTestId('stories-result')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stories-grid')).not.toBeInTheDocument();
  });

  it('keeps the same state whichever chip is picked while the collection is empty', async () => {
    wall([]);
    await userEvent.click(screen.getByRole('radio', { name: 'Fabrika / Üretim' }));
    expect(screen.getByRole('radio', { name: 'Fabrika / Üretim' })).toBeChecked();
    expect(screen.getByTestId('stories-empty')).toBeInTheDocument();
    expect(screen.queryByText(NONE.title)).not.toBeInTheDocument();
  });

  it('renders every card with its resolved labels and the ICU "showing all" line', () => {
    wall(CARDS);
    expect(screen.getByTestId('stories-result')).toHaveTextContent('2 onayın tamamı gösteriliyor');
    const grid = screen.getByTestId('stories-grid');
    const cards = within(grid).getAllByRole('article');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Onaylandı');
    expect(cards[0]).toHaveTextContent('12 çalışma izni');
    expect(cards[0]).toHaveTextContent('Kat görevlileri');
    expect(cards[0]).toHaveTextContent('Haziran 2026');
    expect(cards[0]).toHaveTextContent('Antalya');
    expect(cards[0]).toHaveTextContent('Kırgızistan · Pakistan');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('filters by sector and shows the per-sector empty state with a reset', async () => {
    wall([CARDS[0]]);
    await userEvent.click(screen.getByRole('radio', { name: 'Fabrika / Üretim' }));
    const none = screen.getByRole('status');
    expect(none).toHaveAttribute('data-testid', 'stories-none-in-sector');
    expect(within(none).getByRole('heading', { level: 3, name: NONE.title })).toBeInTheDocument();
    expect(screen.queryByTestId('stories-grid')).not.toBeInTheDocument();
    await userEvent.click(within(none).getByRole('button', { name: NONE.reset }));
    expect(screen.getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(1);
    expect(screen.getByTestId('stories-result')).toHaveTextContent('1 onayın tamamı gösteriliyor');
  });

  it('counts the filtered subset in the "showing X of N" line', async () => {
    wall(CARDS);
    await userEvent.click(screen.getByRole('radio', { name: 'Turizm / Konaklama' }));
    expect(screen.getByTestId('stories-result')).toHaveTextContent('2 onaydan 1 tanesi gösteriliyor');
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx"
```

Fails at import: `Cannot find module '../_components/ApprovalsWall'`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx` (no directive — used from the client island, renders in both worlds):

```tsx
import { Card } from '@/design/primitives';
import type { StoryCardData } from '../_lib/stories';

/** The v1 approval card (D9): sector pill, headcount + unit, roles, month · place · countries.
 *  No scan, no document track, no watermark (v1.1). Every string arrives resolved. */
export function StoryCard({ card, approvedLabel }: { card: StoryCardData; approvedLabel: string }) {
  return (
    <Card as="article" hover className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-extrabold text-success-text">
          <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
          {approvedLabel}
        </span>
        <span className="rounded-pill border border-border-1 bg-pale-1 px-3 py-1 text-body-sm font-bold text-text-secondary">
          {card.sectorLabel}
        </span>
      </div>
      <p className="text-card-title m-0 font-extrabold text-ink">{card.headcountLabel}</p>
      <p className="text-body-sm m-0 text-text-secondary">{card.roles}</p>
      <p className="text-body-sm m-0 mt-auto font-bold text-text-tertiary">
        <span>{card.monthLabel}</span>
        <span aria-hidden="true"> · </span>
        <span>{card.place}</span>
        {card.countries.length > 0 && (
          <>
            <span aria-hidden="true"> · </span>
            <span>{card.countries.join(' · ')}</span>
          </>
        )}
      </p>
    </Card>
  );
}
```

`src/app/[locale]/(site)/success-stories/_components/ApprovalsWall.tsx`:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { EmptyState, type EmptyStateCta } from '@/design/blocks';
import { Button, RadioChips, type RadioChipOption } from '@/design/primitives';
import type { StoryCardData } from '../_lib/stories';
import { StoryCard } from './StoryCard';

const ALL = 'all';

/**
 * The approvals wall (design #cases): single-select sector chips over the card grid. Two empty
 * states, both by data: the collection is empty → the W6 "first approvals are on their way"
 * card (`sys.stories.empty.*`, `data-testid="stories-empty"`); a sector has no card → the
 * design's own "No approval published in that sector yet" (success.043–045) with a reset.
 * Filter state is component state only — facet views canonicalise to the base page (PRD §4)
 * and no filter event exists (W12: `approval_filter` is not allow-listed). Light island: no
 * `next/dynamic` — it is the page's main content, above the fold on desktop (W13).
 */
export function ApprovalsWall({
  sectors,
  stories,
  legend,
  empty,
  noneInSector,
  approvedLabel,
}: {
  /** `all` first, then the site's sector keys with their resolved labels. */
  sectors: RadioChipOption[];
  stories: StoryCardData[];
  legend: string;
  empty: { title: string; body: string; cta: EmptyStateCta };
  noneInSector: { title: string; body: string; reset: string };
  approvedLabel: string;
}) {
  const sys = useTranslations('sys');
  const [sector, setSector] = useState<string>(ALL);
  const shown = sector === ALL ? stories : stories.filter((s) => s.sector === sector);

  return (
    <div data-testid="stories-wall">
      <RadioChips
        name="sector"
        options={sectors}
        value={sector}
        onChange={setSector}
        legend={legend}
        legendHidden
        className="mb-5"
      />

      {stories.length === 0 ? (
        <EmptyState
          testId="stories-empty"
          tone="pale"
          title={empty.title}
          body={empty.body}
          cta={empty.cta}
        />
      ) : shown.length === 0 ? (
        <div
          role="status"
          data-testid="stories-none-in-sector"
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-1 bg-white px-6 py-10 text-center"
        >
          <h3 className="text-card-title m-0 text-ink">{noneInSector.title}</h3>
          <p className="text-body-sm m-0 max-w-[520px] text-text-secondary">{noneInSector.body}</p>
          <Button variant="primary" className="mt-2" onClick={() => setSector(ALL)}>
            {noneInSector.reset}
          </Button>
        </div>
      ) : (
        <>
          <p data-testid="stories-result" className="text-body-sm m-0 mb-4 font-extrabold text-text-tertiary">
            {shown.length === stories.length
              ? sys('stories.wall.showingAll', { count: stories.length })
              : sys('stories.wall.showingFiltered', { shown: shown.length, total: stories.length })}
          </p>
          <ul data-testid="stories-grid" className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((card) => (
              <li key={card.id} className="min-w-0">
                <StoryCard card={card} approvedLabel={approvedLabel} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
```

Append to `e2e/pages/success-stories.spec.ts`, inside the `for` loop's `test.describe` (after the BreadcrumbList case):

```ts
    test('shows the W6 empty wall with the site sector chips (no stories in Phase A)', async ({
      page,
    }) => {
      await page.goto(r.path);
      const wall = page.getByTestId('stories-wall');
      await expect(wall).toBeVisible();
      // "All sectors" + the seven site sectors (T0b `sectors`), never the design's own six.
      await expect(wall.getByRole('radio')).toHaveCount(8);
      const empty = page.getByTestId('stories-empty');
      await expect(empty).toBeVisible();
      await expect(empty).toHaveAttribute('role', 'status');
      await expect(empty.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
      await expect(page.getByTestId('stories-grid')).toHaveCount(0);
      // Picking a chip on an empty collection keeps the empty wall — no per-sector text.
      await wall.getByRole('radio').nth(2).check();
      await expect(empty).toBeVisible();
      await expect(page.getByTestId('stories-none-in-sector')).toHaveCount(0);
      // The design's feed/sample wording must never reach a visitor.
      const body = await page.locator('body').innerText();
      expect(body).not.toMatch(/sample data|örnek veri|CRM/i);
    });
```

- [ ] **Step 4: Run tests + `npm run verify`**

```
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx"
npm run verify
```

Five cases green; `verify` green. (If Cycle 3's page already imports the island, `tsc` was red until this file existed — it is green now.)

- [ ] **Step 5: Commit**

```
git add "src/app/[locale]/(site)/success-stories/_components/ApprovalsWall.tsx" "src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx" "src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx" e2e/pages/success-stories.spec.ts
git commit -m "feat(stories): approvals wall island — sector chips, card grid, W6 empty wall + per-sector empty state (T9 c4)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 5 — the data-gated sections: LiveBadge, NumbersBox, Testimonials, WorkerStories (null on empty)**

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { testBundle } from '@/test/bundle';
import { LiveBadge } from '../_components/LiveBadge';
import { NumbersBox } from '../_components/NumbersBox';
import { Testimonials } from '../_components/Testimonials';
import { WorkerStories } from '../_components/WorkerStories';
import type { Story } from '../_lib/stories';

const STORY: Story = {
  id: 'AP-2026-118',
  sector: 'tourism',
  roles: 'Kat görevlileri',
  headcount: 12,
  approvedAt: '2026-06-01',
  place: 'Antalya',
  countries: ['KG'],
};

const WORKER_STRINGS = {
  'success.070': 'Diğer taraf',
  'success.071': 'İşçi oraya gitmek için hiçbir şey ödemedi',
  'success.072': 'Bir yerleştirme, ancak iki taraf için de işe yaradıysa başarılıdır.',
  'success.073': 'Şimdi kimlerin müsait olduğunu görün →',
  'success.074': 'Partner bir enstitüde meslek sınavına girdi.',
  'success.075': '0 ödedi · 22 aydır işte',
  'success.076': 'Kat görevlisi · Nepal → Antalya',
  'success.077': 'Bizi bulmadan önce yerel bir aracı ondan “vize ücreti” istedi.',
  'success.078': '0 ödedi · aynı otelde ikinci sezon',
};
const KPI_STRINGS = {
  'success.046': 'Sakladığımız sayılar değil',
  'success.047': 'Kimse insanların %100’ünü zamanında yerleştiremez',
  'success.048': 'Bunlar bizimkiler.',
  'success.049': 'İlk seferde reddedilen izinler',
  'success.050': 'Tümü yeniden sunuldu ve onaylandı.',
};
const QUOTE_STRINGS = {
  'success.058': 'Kendi sözleriyle',
  'success.059': 'Sezon bittiğinde işverenler ne diyor',
};

describe('data-gated sections render nothing on empty data (W6/W1/§10 row 11)', () => {
  it('LiveBadge: null without stories, the ICU headcount total with them', () => {
    const { container, rerender } = renderWithIntl(<LiveBadge stories={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<LiveBadge stories={[STORY, { ...STORY, id: 'b', headcount: 30 }]} />);
    expect(screen.getByTestId('stories-live')).toHaveTextContent('42 izin onaylandı');
  });

  it('NumbersBox: null with no signed KPI, the box with one', () => {
    const empty = testBundle();
    const { container } = renderWithIntl(<NumbersBox bundle={empty} locale="tr" kpis={[]} />);
    expect(container).toBeEmptyDOMElement();

    const signed = testBundle({
      strings: KPI_STRINGS,
      collections: {
        metrics: [
          { key: 'placed', value: 7, text: null, suffix: '', labelId: 'success.049', unitId: null },
        ],
      },
    });
    renderWithIntl(
      <NumbersBox
        bundle={signed}
        locale="tr"
        kpis={[{ key: 'placed', labelId: 'success.049', bodyId: 'success.050' }]}
      />,
    );
    const box = screen.getByTestId('stories-numbers');
    expect(box).toHaveTextContent('Kimse insanların %100’ünü zamanında yerleştiremez');
    expect(box).toHaveTextContent('7');
    expect(box).toHaveTextContent('İlk seferde reddedilen izinler');
    expect(box).toHaveTextContent('Tümü yeniden sunuldu ve onaylandı.');
  });

  it('NumbersBox: a listed KPI whose metric is unsigned (value and text null) is skipped', () => {
    const b = testBundle({
      strings: KPI_STRINGS,
      collections: {
        metrics: [{ key: 'placed', value: null, text: null, suffix: '', labelId: null, unitId: null }],
      },
    });
    const { container } = renderWithIntl(
      <NumbersBox bundle={b} locale="tr" kpis={[{ key: 'placed', labelId: 'success.049', bodyId: 'success.050' }]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('Testimonials: null on no rows, quote cards with rows — and never the placeholder disclaimer', () => {
    const b = testBundle({ strings: QUOTE_STRINGS });
    const { container, rerender } = renderWithIntl(<Testimonials bundle={b} locale="tr" items={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(
      <Testimonials
        bundle={b}
        locale="tr"
        items={[{ id: 't1', quote: '“Evrak süreci kolay ilerledi.”', role: 'İK Müdürü', org: 'Otel grubu · Kemer', initials: 'HK' }]}
      />,
    );
    const sec = screen.getByTestId('stories-testimonials');
    expect(screen.getByRole('heading', { level: 2, name: 'Sezon bittiğinde işverenler ne diyor' })).toBeInTheDocument();
    expect(sec).toHaveTextContent('“Evrak süreci kolay ilerledi.”');
    expect(sec).toHaveTextContent('HK');
    expect(sec).toHaveTextContent('Otel grubu · Kemer');
    expect(sec).not.toHaveTextContent(/yer tutucu|placeholder/i);
  });

  it('WorkerStories: null while hidden, the two cards (one id-less title from sys) when visible', () => {
    const b = testBundle({ strings: WORKER_STRINGS });
    const { container, rerender } = renderWithIntl(<WorkerStories bundle={b} locale="tr" visible={false} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<WorkerStories bundle={b} locale="tr" visible />);
    const sec = screen.getByTestId('stories-workers');
    expect(screen.getByRole('heading', { level: 2, name: WORKER_STRINGS['success.071'] })).toBeInTheDocument();
    expect(sec).toHaveTextContent('Kaynakçı · Özbekistan → Ankara'); // sys.stories.workers.card1Title
    expect(sec).toHaveTextContent('Kat görevlisi · Nepal → Antalya'); // success.076
    expect(screen.getByRole('link', { name: WORKER_STRINGS['success.073'] })).toHaveAttribute('href', '/adaylar');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/hidden-sections.test.tsx"
```

Fails at import: `Cannot find module '../_components/LiveBadge'`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/_components/LiveBadge.tsx` (server component; `useTranslations` is legal in RSC):

```tsx
import { useTranslations } from 'next-intl';
import type { Story } from '../_lib/stories';

/** The hero's green live pill. The design summed headcounts and appended "live from CRM" /
 *  "sample data" (success.138–140) — wording that presumes a browser feed and must never
 *  render. Here: the ICU total only, and nothing at all while no approval is published. */
export function LiveBadge({ stories }: { stories: Story[] }) {
  const sys = useTranslations('sys');
  if (stories.length === 0) return null;
  const count = stories.reduce((n, s) => n + s.headcount, 0);
  return (
    <p
      data-testid="stories-live"
      className="m-0 mb-5 inline-flex items-center gap-2 rounded-pill border border-success/40 bg-success/10 px-4 py-1.5 text-body-sm font-extrabold text-success-surface"
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
      {sys('stories.hero.liveBadge', { count })}
    </p>
  );
}
```

`src/app/[locale]/(site)/success-stories/_components/NumbersBox.tsx`:

```tsx
import { getCollection, type Metric } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { Section, Stat } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { NegativeKpi } from '../_lib/metrics';

const signed = (m: Metric | undefined): m is Metric =>
  Boolean(m && (m.value !== null || m.text !== null));

/** "Numbers we do not hide" (success.046–057): the design's dark KPI box. Every figure comes
 *  from the `metrics` collection through the page's `NEGATIVE_KPIS` table — never typed
 *  (D17). Empty table, or no listed KPI signed (W1) → null. */
export function NumbersBox({
  bundle,
  locale,
  kpis,
}: {
  bundle: Bundle;
  locale: Locale;
  kpis: NegativeKpi[];
}) {
  const t = makeTf(bundle, locale);
  const rows = getCollection(bundle, 'metrics');
  const shown = kpis
    .map((k) => ({ kpi: k, metric: rows.find((m) => m.key === k.key) }))
    .filter((x): x is { kpi: NegativeKpi; metric: Metric } => signed(x.metric));
  if (shown.length === 0) return null;
  return (
    <Section tone="band">
      <div className="container-site">
        <div
          data-testid="stories-numbers"
          className="relative overflow-hidden rounded-hero bg-gradient-to-br from-[#253063] via-[#1c2652] to-[#131c40] px-6 py-8 text-white lg:px-11 lg:py-10"
        >
          <div className="mb-8 max-w-[640px]">
            <p className="text-eyebrow m-0 mb-3 font-extrabold uppercase tracking-[1.6px] text-sky">
              {t('success.046')}
            </p>
            <h2 className="text-h2 m-0 mb-3 text-white">{t('success.047')}</h2>
            <p className="text-body m-0 text-white/75">{t('success.048')}</p>
          </div>
          <ul className="m-0 grid list-none gap-px overflow-hidden rounded-md border border-white/15 bg-white/15 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map(({ kpi, metric }) => (
              <li key={kpi.key} className="bg-navy/60 px-6 py-6">
                <Stat
                  value={metric.value ?? undefined}
                  text={metric.text ?? undefined}
                  suffix={metric.unitId ? `${metric.suffix} ${t(metric.unitId)}` : metric.suffix}
                  label={t(kpi.labelId)}
                  locale={locale}
                  tone="dark"
                />
                <p className="text-body-sm m-0 mt-2 text-white/65">{t(kpi.bodyId)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/success-stories/_components/Testimonials.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { Card, Eyebrow, Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { Testimonial } from '../_lib/stories';

/** "In their words" (success.058–068). Only consented rows render (§10 row 11 — the design's
 *  three quotes are self-declared placeholders, success.069, never shown); no rows → null.
 *  No Review JSON-LD in v1. */
export function Testimonials({
  bundle,
  locale,
  items,
}: {
  bundle: Bundle;
  locale: Locale;
  items: Testimonial[];
}) {
  if (items.length === 0) return null;
  const t = makeTf(bundle, locale);
  return (
    <Section tone="light" className="pt-0">
      <div className="container-site" data-testid="stories-testimonials">
        <Eyebrow>{t('success.058')}</Eyebrow>
        <h2 className="text-h2 m-0 mb-6">{t('success.059')}</h2>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {items.map((q) => (
            <li key={q.id} className="min-w-0">
              <Card as="article" className="flex h-full flex-col gap-5">
                <blockquote className="text-body m-0 font-bold text-ink">{q.quote}</blockquote>
                <div className="mt-auto flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-tint text-body-sm font-extrabold text-blue-safe"
                  >
                    {q.initials}
                  </span>
                  <div>
                    <p className="text-body-sm m-0 font-extrabold text-ink">{q.role}</p>
                    <p className="text-body-sm m-0 text-text-tertiary">{q.org}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/success-stories/_components/WorkerStories.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { Card, Eyebrow, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** "The other side" (success.070–078): two worker stories framing the published approvals.
 *  The design gates it on a `showWorkerStories` prop defaulting to true; here it renders only
 *  while an approval is published (`visible` = stories.length > 0) — with no approvals on the
 *  wall there is nothing to be "the other side" of, and the two named journeys (an
 *  identifiable "she reported it") stay off until the wall is live. Card 1's title has no
 *  package id (design line 776) → `sys.stories.workers.card1Title` (W9). */
export function WorkerStories({
  bundle,
  locale,
  visible,
}: {
  bundle: Bundle;
  locale: Locale;
  visible: boolean;
}) {
  const sys = useTranslations('sys');
  if (!visible) return null;
  const t = makeTf(bundle, locale);
  const cards = [
    { title: sys('stories.workers.card1Title'), bodyId: 'success.074', footId: 'success.075' },
    { title: t('success.076'), bodyId: 'success.077', footId: 'success.078' },
  ];
  return (
    <Section tone="light" className="pt-0">
      <div className="container-site" data-testid="stories-workers">
        <div className="rounded-hero border border-border-1 bg-gradient-to-b from-pale-1 to-tint px-6 py-8 lg:px-9 lg:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Eyebrow>{t('success.070')}</Eyebrow>
              <h2 className="text-h2 m-0 mb-3">{t('success.071')}</h2>
              <p className="text-body m-0 mb-4 text-text-secondary">{t('success.072')}</p>
              <Link
                href="/available-workers"
                className="text-body-sm font-extrabold text-blue-safe no-underline hover:underline"
              >
                {t('success.073')}
              </Link>
            </div>
            <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
              {cards.map((c) => (
                <li key={c.bodyId} className="min-w-0">
                  <Card as="article" className="flex h-full flex-col gap-2">
                    <h3 className="text-body-sm m-0 font-extrabold text-blue-safe">{c.title}</h3>
                    <p className="text-body-sm m-0 text-text-secondary">{t(c.bodyId)}</p>
                    <p className="text-body-sm m-0 mt-auto font-extrabold text-success-text">{t(c.footId)}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

Append to `e2e/pages/success-stories.spec.ts` inside the `test.describe` (after the empty-wall case):

```ts
    test('hides the unsigned metrics, the KPI box, testimonials and worker stories by data (W1/W6)', async ({
      page,
    }) => {
      await page.goto(r.path);
      await expect(page.getByTestId('stories-live')).toHaveCount(0);
      await expect(page.getByTestId('stories-numbers')).toHaveCount(0);
      await expect(page.getByTestId('stories-testimonials')).toHaveCount(0);
      await expect(page.getByTestId('stories-workers')).toHaveCount(0);
      const body = await page.locator('body').innerText();
      // The design's unsigned figures and its design-time notes never reach the page.
      expect(body).not.toMatch(/1[.,]240|\b68\b|\b91\s?%|%\s?91|\+19|Still to replace|Hâlâ değiştirilecek|Placeholder quotes|Yer tutucu yorumlar/);
    });
```

- [ ] **Step 4: Run tests + `npm run verify`**

```
npx vitest run "src/app/\[locale\]/(site)/success-stories"
npm run verify
npm run build && (npx next start -p 3100 &) && sleep 4
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/success-stories.spec.ts
```

All five page test files green (36 cases in total); `verify` green; the six spec cases × two routes × two projects green. Kill `next start`.

- [ ] **Step 5: Commit**

```
git add "src/app/[locale]/(site)/success-stories/_components" "src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx" e2e/pages/success-stories.spec.ts
git commit -m "feat(stories): data-gated sections — live badge, KPI box, testimonials, worker stories return null on empty data (T9 c5)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Cycle 6 — gate against the preview, docs, ledger**

- [ ] **Step 1: Write the failing test**

None new — this cycle's checks are the gate (`npm run gate`) and the docs guard is review. The one assertion added: in `e2e/pages/success-stories.spec.ts`, inside the `test.describe`, an axe-independent check that the page has no `<main>` of its own (R31 — the chrome owns it):

```ts
    test('renders no <main> of its own (R31 — SiteChrome owns #main)', async ({ page }) => {
      await page.goto(r.path);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);
    });
```

- [ ] **Step 2: Run to verify it passes** (it should already — it is a regression guard): `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/success-stories.spec.ts` after a `next start`.

- [ ] **Step 3: Implement (docs)**

`docs/SEO.md` — if the file has no `## Pages` section yet (an earlier page task may have created it; look for the heading), insert this section immediately before `## Redirects policy (summary)`; otherwise append only the table row:

```markdown
## Pages

One row per built page: where its title comes from, the canonical, the JSON-LD nodes beyond the site-wide Organization/WebSite pair, and the element named as LCP (D26; `data-lcp-slot`). Each page task adds its row in the commit that adds the page.

| Page | Routes | Title / description source | Canonical | JSON-LD | LCP slot |
| --- | --- | --- | --- | --- | --- |
| Success Stories | `/basari-hikayeleri`, `/en/success-stories` | `sys.seo.stories.*` (the package has no SEO strings for the page; the `stories` record's ids are `''`, W23/W38) | self, per locale; facet (sector) state is component state, never a URL | `BreadcrumbList` (Home → Success Stories) via `Breadcrumbs`; no ItemList/Review in v1 | the `h1` (`data-lcp-slot="h1"`, gradient hero per §10 row 4); the `ss-hero` image slot is a named placeholder (`data-placeholder="ss-hero"`) |
```

`docs/ANALYTICS.md` — after the `## Event schema` table's closing paragraph (the one ending "…never submitted fields."), if no `### Page instrumentation (WP2b)` subsection exists yet, add it; then add the page's line:

```markdown
### Page instrumentation (WP2b)

Which of the allow-listed events each built page fires, and from where (`placement` per W12). No page adds an event or a parameter; a new one is a ruling plus an edit to `ALLOWED_PARAMS` and this file.

- **Success Stories** (`/basari-hikayeleri`, `/en/success-stories`): `whatsapp_click` with `placement: 'page_cta'` from the closing band's "Send us the job order" button and from the empty wall's "ask for an example" CTA (both `ContactCta`); the chrome's own placements as everywhere. The design's `approval_filter` event is **not** fired — it is not allow-listed (W12) and the sector chips are component state only. No form, so no `generate_lead`/`conversion` originates here.
```

`docs/CONTENT-MODEL.md` — § "The `sys.*` range", append a bullet to the WP1 list (before the sentence "This is the entire namespace as of WP1…", which an earlier WP2 task may already have rewritten; keep the bullet either way):

```markdown
- **Success Stories (WP2b T9, W6/W9/W23):** `stories.hero.liveBadge` (ICU `{count}` — replaces the design's "N permits approved · live from CRM / sample data", which must never render), `stories.wall.legend`, `stories.wall.showingAll` (ICU `{count}`), `stories.wall.showingFiltered` (`{shown}`/`{total}` — the design's "of"/"approvals" words have no ids; `success.141/142` are only the fragments), `stories.empty.{title,body,cta}` (the W6 "first approvals are on their way" wall), `stories.whatsappPrefill` (the band's prefill, design line 1119, no id), `stories.workers.card1Title` (design line 776, no id); `seo.stories.{title,description}` (no SEO strings in `success.json`)
```

Also in § Collections, after the existing paragraph, add:

```markdown
**`stories` (Phase B, I10) — the v1 card row the Success Stories page reads** (`src/app/[locale]/(site)/success-stories/_lib/stories.ts`, `StorySchema`): `{ id, sector: SectorKey, roles, headcount, approvedAt: 'YYYY-MM-DD', place (city only, D9), countries: ISO-2[] }`. It is a `FIXTURE_ONLY` collection: empty under `LOCAL` on every Vercel build (D23 — `assertServableInProduction` refuses rows), so Phase A renders the W6 empty wall. `testimonials` (v1.1, §10 row 11): `{ id, quote, role, org, initials }`, consented rows only.
```

`docs/PRD.md` line 30 (page table row 11) — replace the Forms cell text `none — CMS cards, no proof scans at launch (D9 v1)` with:

```
none — CMS cards, no proof scans at launch (D9 v1); Phase A ships the W6 empty wall (sector chips + "first approvals are on their way"), hero metrics / KPI box / testimonials / worker stories hidden by data (W1, §10 row 11) until the `stories` collection is fed from Operations (I10)
```

`docs/INTEGRATIONS.md` — in the I10 row (Success stories (cards), Ops → Website, Phase B), append to its notes cell: `row shape = StorySchema in the page's _lib/stories.ts (see CONTENT-MODEL § Collections)`. (Table cell text only; no structural change.)

Then:

```
npx prettier --write docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/INTEGRATIONS.md e2e/pages/success-stories.spec.ts
```

- [ ] **Step 4: Run tests + `npm run verify` + gate on the preview**

```
npm run verify
git push -u origin HEAD          # the branch's Vercel preview builds (verify runs inside the build)
E2E_BASE_URL=https://<preview-url> npm run gate
npm run js-size
```

`verify` green. The gate: Playwright (both projects, every spec incl. `e2e/pages/success-stories.spec.ts`), axe over `GATE_ROUTES` (now incl. the two routes — zero violations; the chips are native radios with a visually-hidden legend, the empty state is `role="status"`), the width sweep at 1440…390 (the hero grid stacks below `lg`, the card grid is `md:grid-cols-2 lg:grid-cols-3`), Lighthouse over `INDEXABLE_GATE_ROUTES` (performance ≥ 0.95, a11y/BP/SEO = 1.0, script ≤ 204,800 B, LCP ≤ 2500 ms on the preview — the h1 over the gradient). If `js-size` reports the route above 194,560 B (LAZY_LINE) — unlikely: the only page island is `ApprovalsWall` + `RadioChips` + `EmptyState`/`ContactCta`, a few KB over the shell — move `ApprovalsWall` behind `next/dynamic` **with `ssr: true`** (it is the main content; SSR must stay) before the next page task starts (W13 amended).

- [ ] **Step 5: Commit**

```
git add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/INTEGRATIONS.md e2e/pages/success-stories.spec.ts
git commit -m "docs(stories): SEO page row, analytics placements, sys.stories namespace, stories row shape, PRD Phase A behaviour (T9 c6)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

**Ledger line (append to `docs/superpowers/plans/2026-09-20-wp2b-pages.md`'s ledger, W22):**

`T9 Success Stories · /basari-hikayeleri + /en/success-stories · script <N> B gz per route from `npm run js-size` (ceiling 204,800; lazy line 194,560) · Lighthouse perf/a11y/SEO = <x>/<1.0>/<1.0> (LCP <ms> on the preview) · pixel score: n/a (not a D27 harness page — Fable side-by-side review; deltas 1–6 above logged) · sections hidden by data: hero stats, live badge, KPI box, testimonials, worker stories · UNBUILT −1 (`/success-stories`) · gate routes +2.`

---

**Docs in this task:** `docs/SEO.md` (§ Pages row: title source `sys.seo.stories.*`, canonical self per locale, BreadcrumbList, LCP = h1), `docs/ANALYTICS.md` (§ Page instrumentation: `whatsapp_click`/`page_cta` from the band and the empty-wall CTA; no `approval_filter`), `docs/CONTENT-MODEL.md` (§ `sys.*` range bullet for `sys.stories.*` + `sys.seo.stories.*`; § Collections: the `stories`/`testimonials` row shapes and the D23 rule), `docs/PRD.md` row 11 (Phase A = W6 empty wall, sections hidden by data), `docs/INTEGRATIONS.md` I10 (row shape pointer).

**Sys keys added:** `sys.seo.stories.title`, `sys.seo.stories.description`, `sys.stories.hero.liveBadge`, `sys.stories.wall.legend`, `sys.stories.wall.showingAll`, `sys.stories.wall.showingFiltered`, `sys.stories.empty.title`, `sys.stories.empty.body`, `sys.stories.empty.cta`, `sys.stories.whatsappPrefill`, `sys.stories.workers.card1Title` — 11 keys, both locales.

**Package ids used:** 36 — first `success.013`, last `success.124`. Full list: `success.013, 022, 023, 024, 025, 026, 027, 035, 036, 037, 038, 040, 041, 043, 044, 045, 046, 047, 048, 058, 059, 070, 071, 072, 073, 074, 075, 076, 077, 078, 079, 080, 081, 082, 083, 124`. Of these, `046–048`, `058–059` and `070–078` are read only inside the data-gated sections (`NumbersBox`, `Testimonials`, `WorkerStories`), which return `null` before any lookup today; `success.049–057` (KPI captions/bodies) are named only by rows of the empty `NEGATIVE_KPIS` table, so none is read in Phase A. The sector chips read `hire.076–082` through the `sectors` collection rows, not by literal id. Every id above exists in `src/content/local/catalogue.json` (verified 2026-09-20 against the WP1 import). Deliberately not rendered: `success.028–034` (unsigned captions + the amber note), `039`, `042`, `060–069` (placeholder quotes + disclaimer), `112–123` (sample-data role/country strings), `125–136`, `138–151` (feed-status / slider / proof-frame wording that presumes a browser CRM fetch).

**Foundation gaps:** none.
