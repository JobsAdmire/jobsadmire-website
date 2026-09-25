### Task 9: Success Stories — `/basari-hikayeleri` · `/en/success-stories` (the W6 empty approvals wall)

**Where this task runs.** Worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2`, branch `wp2/foundation` (never the main checkout, never `main`). Execution order W99: T1 → T13 → T2 → … → T8 → **T9** → T10 → … — so when this task starts, WP2a Tasks 1–9 (with the `task-3/5/6/7-additions`) and page tasks T1, T13, T2–T8 are in the tree: the `(site)` route group exists, `docs/SEO.md` has T1's `## Pages` table, `docs/ANALYTICS.md` has T1's `### Page instrumentation (WP2b)` list, `docs/CONTENT-MODEL.md` § Adding copy has T1's per-page bullet list, the WP2b plan has T1's ledger table, and `e2e/routes.ts` carries the rows T1–T8 appended. One build/test job at a time (Mac Studio rule).

**What this page is in Phase A.** The design (`design-package/design/Success Stories.dc.html`, strings `success.001–151`) is a CRM-fed wall of redacted permit approvals with four hero metrics (1,240+ / 68 / 41 days / 91 %), a "Numbers we do not hide" KPI box (7 % / +19 days / 4 % / 11), three employer quotes and two worker stories. None of that data is signed. W1 rules the page's figures **unsigned → hidden**. D23 forbids the `stories` fixture on every Vercel build (`assertServableInProduction`, `FIXTURE_ONLY_COLLECTIONS = ['pool', 'stories', 'representatives']` in `src/content/config.ts`). §10 row 11 keeps testimonials empty until consent. The design's own amber note (`success.033/034`) and disclaimer (`success.069`) call the metrics and quotes placeholders. So the page ships as the **designed empty wall (W6)**: the hero (h1 = LCP, no stat cards), the approvals wall with the site's sector chips and the "first approvals are on their way" state (`sys.stories.empty.*`), and the closing CTA band. Every hidden section is a component that **returns `null` on empty data** — nothing is deleted, so the day Ops publishes a `stories` row (Phase B, I10) the wall, the live badge and the worker-side section render without a code change.

**No form.** PRD §2 row 11: "none". The design has zero `<form>`; its lead exits are links (WhatsApp job order, a call booking → Contact, the calculator). There is therefore **no `actions.ts`**, no Zod form schema, no catalog mapping, no consent row (W79 does not apply), no `START_WHEN_KEYS` (W78 does not apply), no `Field` labels (W115 does not apply) and no door variables (W92: the branch preview this task gates against is door-less, which changes nothing here). The page's conversions are `whatsapp_click` (placement `page_cta`) through `ContactCta` (inside `ClosingCtaBand` and `EmptyState`) and the internal navigations. Both wa.me hrefs carry only a **static** sys prefill — no visitor-chosen value ever sits in a DOM href (W76/W95); the e2e spec asserts the decoded `text` equals the sys string.

**Design deltas (recorded for the Fable side-by-side review, D27 — not a pixel-harness page):**

1. Hero stat cards, live badge, "Numbers we do not hide" box, testimonials and worker stories are hidden by data (W1/W6/§10 row 11/D23) — the components exist and return `null`. With no signed hero metric the hero is one text column (the design's right-hand stat grid only renders when `STORIES_HERO_METRICS` is non-empty).
2. Sector chips use the site's one `sectors` taxonomy (WP2a Task 1 `sectors` collection, keys `factory|construction|tourism|agriculture|textile|logistics|other`, labels `hire.076–082`) plus the design's "All sectors" chip (`success.124`) — not the design's private `hotels|construction|factory|agriculture|logistics|food` enum, so a story row's `sector` is the same key every form sends. `success.125–130` are therefore not rendered.
3. The ≤700 px "Latest approvals" swipe slider, `:nth-child` hiding, show-more and the proof frame (redact bars, watermark, "1 / N") are v1.1 material (D9, D22 scope ladder) — the v1 wall is one responsive card grid; the chips are the `RadioChips` primitive (44 px targets, D20).
4. The band's third action ("Or estimate the cost yourself →", `success.083`) renders as an inverse button inside `ClosingCtaBand` (`extra`) rather than a bare text link (the block has no text-link slot).
5. The design's absolute `www.jobsadmire.com/contact-us`, `/work-permit`, `/available-workers`, `/hiring-cost-calculator` links become typed `pathnames` hrefs.
6. Filter state is not URL-addressable (PRD §4: facet views canonicalise to the base page); no `approval_filter` event (not allow-listed, W12).
7. **No false claim on an empty wall.** `success.025` ("Below are the actual work permit approvals we obtained…") renders only while at least one approval is published; on the empty wall the hero body is `sys.stories.hero.bodyEmpty` (W9). `success.037` (legal-flagged: "…Names, passport numbers and ID numbers are blacked out — the stamp, the date and the decision are not") describes the redacted proof documents, which are v1.1 (D9 v1 = cards, no scans), so it is **not rendered in v1**; the wall intro is `sys.stories.wall.intro`. Both ids are listed for the WP-C legal sheet.
8. The design's band prefill "Hello JobsAdmire, I saw your permit approvals. I need workers for: " (page line 1119, no id) becomes `sys.stories.whatsappPrefill` without the "I saw your permit approvals" clause (untrue on an empty wall); the empty state's "ask for an example" CTA gets its own prefill `sys.stories.empty.prefill`.
9. The live badge drops "· live from CRM / sample data" (`success.138–140`, which presume a browser feed): one ICU count (`sys.stories.hero.liveBadge`).
10. Card headcount = `formatInt(headcount) + ' ' + t('success.041')` because the package itself splits number and unit (W23 allows it); EN reads "1 work permits" for a one-person approval — accepted, noted for the marketing review.

**Files:**

Create

- `src/app/[locale]/(site)/success-stories/_lib/stories.ts` — `StorySchema`, `readStories`, `storyCards`, `StoryCardData`, `TestimonialSchema`, `readTestimonials` (the page-local `stories`/`testimonials` door — accepted page-local by the reconcile rulings)
- `src/app/[locale]/(site)/success-stories/_lib/metrics.ts` — `STORIES_HERO_METRICS`, `NEGATIVE_KPIS`, `NegativeKpi` (both lists empty under W1, typed against `MetricKey`)
- `src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx` — one approval card (no hooks, no directive)
- `src/app/[locale]/(site)/success-stories/_components/ApprovalsWall.tsx` — `'use client'` island: chips + result label + card grid + the per-sector empty state; the W6 empty state arrives as a server-rendered `ReactNode`
- `src/app/[locale]/(site)/success-stories/_components/LiveBadge.tsx` — hero pill, `null` on no stories
- `src/app/[locale]/(site)/success-stories/_components/NumbersBox.tsx` — the dark KPI box, `null` when no listed KPI is signed
- `src/app/[locale]/(site)/success-stories/_components/Testimonials.tsx` — `null` on an empty `testimonials` collection
- `src/app/[locale]/(site)/success-stories/_components/WorkerStories.tsx` — `null` while no approval is published
- `src/app/[locale]/(site)/success-stories/page.tsx` — the server page (metadata, hero, wall, hidden sections, closing band)
- `src/app/[locale]/(site)/success-stories/__tests__/stories.test.ts`
- `src/app/[locale]/(site)/success-stories/__tests__/metrics.test.ts`
- `src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx`
- `src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx`
- `e2e/pages/success-stories.spec.ts`

Modify

- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.stories.{title,description}` inside the existing `sys.seo` object (WP2a Task 4 created it with `ogTagline`; earlier page tasks added their own page keys) and a new `sys.stories` object as the last key of `sys` (both files, identical key sets — `src/messages/messages.test.ts` asserts parity)
- `src/lib/seo/routes.ts` — delete `'/success-stories',` from the `UNBUILT_PATHNAMES` set literal (WP2a Task 4; one line)
- `e2e/routes.ts` — append the two locale rows to `GATE_ROUTE_TABLE` (WP2a Task 7), directly above the comment `// The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.`
- `docs/SEO.md` — one row in T1's `## Pages` table (W98)
- `docs/ANALYTICS.md` — one bullet in T1's `### Page instrumentation (WP2b)` list (W98)
- `docs/CONTENT-MODEL.md` — one bullet in § Adding copy's per-page list (W98) + one paragraph in § Collections
- `docs/PRD.md` — the page-table row 11 Forms cell
- `docs/INTEGRATIONS.md` — the I10 **Shape** sentence
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T9 ledger row (T1's format, W22/W98)

Test

- Vitest: the five `__tests__` files above (matched by `src/**/*.test.{ts,tsx}` in `vitest.config.mts`), plus the existing `src/lib/seo/unbuilt.test.ts` (goes red when `page.tsx` exists while `/success-stories` is still in `UNBUILT_PATHNAMES` — the W20 mechanism), `src/messages/messages.test.ts` (key parity) and `scripts/gate-routes.test.ts` (both locale halves stay equal).
- Playwright: `e2e/pages/success-stories.spec.ts` (both projects, `mobile` and `desktop`), run by `npm run gate`; plus the page-contract loop in `e2e/routing.spec.ts`, the canonical/hreflang/sitemap loop in `e2e/seo.spec.ts`, `e2e/a11y.spec.ts` and `e2e/width-sweep.spec.ts`, which pick the two routes up from `GATE_ROUTES` / `INDEXABLE_GATE_ROUTES` automatically.

**Interfaces:**

Consumes (exact names; `src/content/**` checked against the real code at `4df73a0`, everything else per `wp2a/produces-final.md` + the Task 3/5/6/7 additions):

- Real code, `@/content/adapter`: `getBundle(locale: Locale): Promise<Bundle>` (server-only, React `cache`), `export * from './pure'` → `makeTf(bundle, locale): (id: string) => string`. `@/content/pure`: `makeTf`, `assertServableInProduction(bundle, source: ContentSource, env = process.env.NODE_ENV)` (throws `collections <keys> are never served from LOCAL in production (D23)`). `@/content/config`: `FIXTURE_ONLY_COLLECTIONS = ['pool', 'stories', 'representatives'] as const`. `@/content/collections`: `getCollection(bundle, 'sectors' | 'countries' | 'metrics')`, `SECTOR_KEYS`, `type SectorKey`, `METRIC_KEYS`, `type MetricKey`, `type Metric` (`{ key; value: number | null; text: string | null; suffix: '+' | ''; labelId: string | null; unitId: string | null }`), `Sector` rows `{ key, labelId, subtitleId, icon }`, `Country` rows `{ code, name, dial }`. `contract/website-bundle.v1`: `type Bundle` (`collections: Record<string, Record<string, unknown>[]>`, `settings.whatsappNumber`). `@/i18n/routing`: `routing`, `type Locale`. `@/i18n/navigation`: `Link`. `@/lib/contact`: `waLink(number, text)`. `@/lib/format/money`: `formatInt(n, locale)`. `@/test/render`: `renderWithIntl(ui, { locale })`. next-intl: `hasLocale`, `useTranslations`; `next-intl/server`: `getTranslations`, `setRequestLocale`. The LOCAL bundle's `pages.stories` record is `{ titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb'] }`; `settings.whatsappNumber` = `905011240340`.
- WP2a Task 3: the `(site)` route group (default chrome, owns `<main id="main">`, R31); `CTA_BY_PATHNAME` has no `/success-stories` entry → `DEFAULT_CTAS` (this page owns no header-CTA anchor id); the W90 client-message picker passes every `sys.*` namespace except `sys.legal`/`sys.seo`, so `sys.stories.*` reaches the island; `ContactLink` (indirect, through `ContactCta`).
- WP2a Task 4: `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` (`''` record ids → the fallbacks, W38); `UNBUILT_PATHNAMES` (edited); `OG_PAGE_KEYS` contains `'stories'` → `og:image` = `https://www.jobsadmire.com/og/<locale>/stories.png`, whose title is `sys.seo.stories.title` (`ogTitle`); `src/lib/seo/unbuilt.test.ts`.
- WP2a Task 5: `@/design/blocks` — `Breadcrumbs({ locale, items: Crumb[], tone?, className? })`, `type Crumb = { name: string; href: Href }`, `ClosingCtaBand({ bundle, locale, titleId, bodyId?, primary: Cta, secondary?, extra?, tone?: 'navy' | 'gradient' | 'green', id? })`, `type Cta = { label; href; external?; variant? }` (W82: `href: string | Exclude<Href, string>`), `EmptyState({ title, body?, cta?: EmptyStateCta, tone?: 'light' | 'pale' | 'dark', headingLevel?, testId?, className? })` (`role="status"`, CTA through `ContactCta` `page_cta`), `ImageSlot({ slot, alt, width, height, className? })` (no `src` → `data-placeholder={slot}`; `alt=""` → `aria-hidden`; no `data-lcp-slot` without `lcp`), `MetricStrip({ bundle, locale, metrics: MetricKey[], tone? })` (all skipped → `null`). Primitives: `Button` (`variant: 'primary' | … | 'inverse'`, string `href`; `#…` → same-tab `<a>`, `/…` → localized next-intl `Link`), `Card({ as?: 'article' | 'div', hover?, className? })`, `Eyebrow`, `Section({ tone: 'light' | 'dark' | 'pale' | 'band', id?, className?, children })` (props frozen — W113: test ids go on an inner `<div>`), `Stat({ value?, text?, prefix?, suffix?, label, locale, tone? })`, `RadioChips({ name, options, value, onChange, legend, legendHidden?, className? })` + `type RadioChipOption = { value: string; label: string }` in `src/design/primitives/RadioChips.tsx`. `sys.nav.breadcrumbs` (the `Breadcrumbs` nav's accessible name — the e2e spec scopes to it). `@/lib/format/date`: `formatMonth(iso, locale)` (TR `Haziran 2026`, EN `June 2026`; imports both message files → server/test only, never the island). `@/test/bundle`: `testBundle({ strings?, collections?, settings? })` (golden fixture: 20 strings, `collections: {}`; `makeT` throws on an unknown id outside production).
- WP2a Task 7: `e2e/routes.ts` `GATE_ROUTE_TABLE: readonly { path: string; indexable: boolean }[]` (edited), `GATE_ROUTES`, `INDEXABLE_GATE_ROUTES`; the page markup contract (one `<h1 data-testid="page-h1">`, `data-lcp-slot="h1"` on it while the hero photo is a placeholder, `data-placeholder="ss-hero"` on the slot, never on the LCP element — D26/W55); `npm run gate` (W91: `playwright.config.ts` sends `x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET`; `scripts/gate.sh` selects `lighthouserc.preview.json` for a `*.vercel.app` base); `npm run js-size` (`SCRIPT_CEILING` 204,800, `LAZY_LINE` 194,560).
- Page tasks: T15's placeholder inventory already lists this page as LCP `h1`, slot `ss-hero` (task-15 § content readiness) — the names below match it. T1's teaser links to `/success-stories` only when `stories` has rows — nothing to coordinate.
- Ops catalog (`apps/backend/src/modules/website/website-form-catalog.ts`, v1.0 + v1.1 `city`/`track`/`topic`/`portfolioUrl`): nothing — this page sends no form.

Produces: nothing later tasks import. `StorySchema`'s row shape — `{ id, sector: SectorKey, roles, headcount, approvedAt: 'YYYY-MM-DD', place (city only), countries: ISO-2[] }` — is the v1 `successStory` card shape D9 names; Phase B's CMS emits it under `collections.stories`, and Cycle 6 records it in `docs/CONTENT-MODEL.md` § Collections and `docs/INTEGRATIONS.md` I10. Page ids owned: `#cases` (the wall), `#talk` (the closing band).

**Cycle order (W106).** The page file imports every component, so the components land first and the page lands in Cycle 5 together with its route edits and its e2e spec; every commit leaves `npm run verify` green.

---

- [ ] **Cycle 1 — the data door: `stories`/`testimonials` readers, W1 metric pins, the production refusal test**

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
  { key: 'tourism', labelId: 'hire.078', subtitleId: null, icon: 'tourism' },
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
  it('accepts only the site sector keys, upper-case ISO-2 countries and full dates', () => {
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
    const row = {
      id: 't1',
      quote: '“…”',
      role: 'İK Müdürü',
      org: 'Otel grubu · Kemer',
      initials: 'HK',
    };
    expect(readTestimonials(testBundle({ collections: { testimonials: [row] } }))).toEqual([
      row,
    ]);
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
// means: the owner signs it, the importer / Ops CMS emits it under a METRIC_KEYS entry, and the
// key is listed here with its caption id — this pin is edited in the same commit.
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

```bash
npx vitest run "src/app/\[locale\]/(site)/success-stories"
```

Both files fail at import: `Failed to resolve import "../_lib/stories"` / `"../_lib/metrics"`.

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
```

`src/app/[locale]/(site)/success-stories/_lib/metrics.ts`:

```ts
import type { MetricKey } from '@/content/collections';

/**
 * W1: the design's four hero figures (1,240+ workers placed / 68 employers since 2019 /
 * 41 days to first shift / 91 % still employed at 12 months) are not signed metrics — and
 * success.029 ("since 2019") contradicts the licence date the About page carries. The hero
 * strip therefore reads an EMPTY list and `MetricStrip` renders nothing (W6). When the owner
 * signs a page metric it is emitted under a `METRIC_KEYS` entry and listed here;
 * `__tests__/metrics.test.ts` pins the current state.
 */
export const STORIES_HERO_METRICS: MetricKey[] = [];

/** The "Numbers we do not hide" box (success.046–057): four negative KPIs with a body line each.
 *  Unsigned (W1) → empty → `NumbersBox` returns null. Shape kept so signing one is a data edit. */
export type NegativeKpi = { key: MetricKey; labelId: string; bodyId: string };
export const NEGATIVE_KPIS: NegativeKpi[] = [];
```

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx vitest run "src/app/\[locale\]/(site)/success-stories"
npm run verify
```

Both files green (13 cases). `verify` green (typecheck, lint, format, the whole Vitest suite) — nothing imports the new modules yet.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/success-stories/_lib" "src/app/[locale]/(site)/success-stories/__tests__/stories.test.ts" "src/app/[locale]/(site)/success-stories/__tests__/metrics.test.ts"
git commit -m "feat(stories): stories/testimonials collection readers and the W1 metric pins (T9 c1)

The stories fixture is asserted refused from LOCAL in production (D23); the hero and KPI
metric lists are empty under W1 and pinned by test.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
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
  'stories.hero.bodyEmpty',
  'stories.hero.liveBadge',
  'stories.wall.intro',
  'stories.wall.legend',
  'stories.wall.showingAll',
  'stories.wall.showingFiltered',
  'stories.empty.title',
  'stories.empty.body',
  'stories.empty.cta',
  'stories.empty.prefill',
  'stories.whatsappPrefill',
  'stories.workers.card1Title',
] as const;

const get = (root: unknown, path: string) =>
  path
    .split('.')
    .reduce<unknown>(
      (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
      root,
    );

describe('sys.stories.* / sys.seo.stories.* (W9, W23)', () => {
  it.each(STORIES_SYS_KEYS)('%s exists in both locales as a non-empty string', (key) => {
    for (const messages of [tr, en]) {
      const v = get(messages.sys, key);
      expect(typeof v).toBe('string');
      expect((v as string).length).toBeGreaterThan(0);
    }
  });
  it('the ICU plurals carry the placeholders the page and the island pass', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'stories.hero.liveBadge')).toMatch(/\{count, plural,/);
      expect(get(messages.sys, 'stories.wall.showingAll')).toMatch(/\{count, plural,/);
      expect(get(messages.sys, 'stories.wall.showingFiltered')).toMatch(
        /\{shown\}.*\{total\}|\{total\}.*\{shown\}/,
      );
    }
  });
  it('the SEO title ends with the brand and says Türkiye, not Turkey (W7)', () => {
    expect(get(en.sys, 'seo.stories.title')).toMatch(/Türkiye.*\| JobsAdmire$/);
    expect(get(tr.sys, 'seo.stories.title')).toMatch(/\| JobsAdmire$/);
    expect(get(en.sys, 'seo.stories.description')).not.toMatch(/\bTurkey\b/);
  });
  it('the empty-wall copy never claims that approvals are shown (delta 7)', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'stories.hero.bodyEmpty')).not.toMatch(/Below|Aşağıda/);
      expect(get(messages.sys, 'stories.whatsappPrefill')).not.toMatch(/saw your|gördüm/);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/sys-keys.test.ts"
```

Every `it.each` row fails (`expected 'undefined' to be 'string'`), and the plural/SEO/claim cases fail on `undefined`.

- [ ] **Step 3: Implement**

`src/messages/tr.json` — inside the existing `"sys"` object: add the `"stories"` key inside the existing `"seo"` object (beside `"ogTagline"` and the page keys earlier tasks added — leave those untouched), and add a new `"stories"` object as the **last** key of `"sys"`. Exact JSON to merge (keep the file's 2-space indent; Prettier checks it):

```json
"seo": {
  "…existing keys unchanged…": "…",
  "stories": {
    "title": "Başarı Hikâyeleri — Türkiye'deki İşverenler için Çalışma İzni Onayları | JobsAdmire",
    "description": "JobsAdmire'ın Türkiye'deki işverenler için aldığı çalışma izni onayları sektör, kişi sayısı ve ay bilgisiyle yayınlanır; kişisel bilgiler çıkarılır."
  }
},
"stories": {
  "hero": {
    "bodyEmpty": "Türkiye'deki işverenler için aldığımız çalışma izni onayları burada yayınlanacak: sektör, kişi sayısı ve ay. Kişisel bilgiler çıkarılır.",
    "liveBadge": "{count, plural, one {# izin onaylandı} other {# izin onaylandı}}"
  },
  "wall": {
    "intro": "Yayınlanan her onay bir karttır: sektör, kişi sayısı, onay ayı ve şehir. Kişisel bilgiler ve belgeler gösterilmez.",
    "legend": "Sektöre göre filtreleyin",
    "showingAll": "{count, plural, one {# onayın tamamı gösteriliyor} other {# onayın tamamı gösteriliyor}}",
    "showingFiltered": "{total} onaydan {shown} tanesi gösteriliyor"
  },
  "empty": {
    "title": "İlk onaylar yolda",
    "body": "Yayınlanan her çalışma izni onayı burada sektörü, kişi sayısı ve ayıyla yer alacak. Şimdiden bir örnek görmek isterseniz bize yazın; size bir tanesini gösterelim.",
    "cta": "WhatsApp'tan bir örnek isteyin",
    "prefill": "Merhaba JobsAdmire, aldığınız çalışma izni onaylarından bir örnek görebilir miyim?"
  },
  "whatsappPrefill": "Merhaba JobsAdmire, şu pozisyonlar için işçiye ihtiyacım var: ",
  "workers": {
    "card1Title": "Kaynakçı · Özbekistan → Ankara"
  }
}
```

`src/messages/en.json` — same positions:

```json
"seo": {
  "…existing keys unchanged…": "…",
  "stories": {
    "title": "Success Stories — Work Permit Approvals for Employers in Türkiye | JobsAdmire",
    "description": "Work permit approvals JobsAdmire obtains for employers in Türkiye, published by sector, headcount and month with personal details removed."
  }
},
"stories": {
  "hero": {
    "bodyEmpty": "The work permit approvals we obtain for employers in Türkiye will be published here — the sector, the headcount and the month. Personal details are removed.",
    "liveBadge": "{count, plural, one {# permit approved} other {# permits approved}}"
  },
  "wall": {
    "intro": "Each published approval is a card: sector, headcount, approval month and city. Personal details and documents are never shown.",
    "legend": "Filter by sector",
    "showingAll": "Showing all {count, plural, one {# approval} other {# approvals}}",
    "showingFiltered": "Showing {shown} of {total} approvals"
  },
  "empty": {
    "title": "The first approvals are on their way",
    "body": "Every published work permit approval will appear here with its sector, headcount and month. If you would like to see one now, write to us and we will show you one.",
    "cta": "Ask for an example on WhatsApp",
    "prefill": "Hello JobsAdmire, could you show me an example of a work permit approval you obtained?"
  },
  "whatsappPrefill": "Hello JobsAdmire, I need workers for: ",
  "workers": {
    "card1Title": "Welder · Uzbekistan → Ankara"
  }
}
```

(The `"…existing keys unchanged…"` line is a marker for this plan, not JSON to paste — only the `"stories"` object is added inside `"seo"`.)

Why these keys and not package ids (W9/W23): the live badge's "N permits approved · live from CRM / sample data" (`success.138–140`) presumes a browser feed and must never render "sample data" — replaced by one ICU count; the result label's "of" / "approvals" words have no ids (`success.141/142` are only the fragments "Showing all" / "Showing"); the W6 empty state and the empty-wall hero body are new copy by ruling (delta 7); `success.037` describes the v1.1 redacted documents, so the v1 wall intro is sys copy (delta 7); the design's band prefill (page line 1119) has no id and its "I saw your permit approvals" clause is untrue on an empty wall (delta 8); worker card 1's title (page line 776) has no id; `sys.seo.stories.*` because the `stories` page record has `titleId: ''`/`descriptionId: ''` (the package carries no SEO strings for this page). All of `sys.stories.*` reaches the client provider (W90 withholds only `sys.legal`/`sys.seo`), which the island needs for the two result labels.

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx prettier --write src/messages/tr.json src/messages/en.json
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/sys-keys.test.ts" src/messages
npm run verify
```

`sys-keys.test.ts` green (17 cases), `messages.test.ts` green (identical key sets). `verify` green.

- [ ] **Step 5: Commit**

```bash
git add src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts"
git commit -m "feat(stories): sys.stories.* and sys.seo.stories.* copy, TR + EN (T9 c2)

W6 empty-wall copy, the empty-wall hero body and wall intro (no claim that approvals are
shown), the ICU count labels, the two static WhatsApp prefills and the id-less worker card
title (W9); SEO fallbacks because the page record has no SEO ids (W23/W38).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 3 — the approvals wall island: chips, result label, cards, the per-sector empty state**

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
// The page passes a server-rendered <EmptyState> here; the island only decides WHEN it shows.
const EMPTY = (
  <div role="status" data-testid="stories-empty">
    İlk onaylar yolda
  </div>
);
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
      emptyState={EMPTY}
      noneInSector={NONE}
      approvedLabel="Onaylandı"
    />,
  );

describe('ApprovalsWall (W6)', () => {
  it('renders the chips and the server-rendered empty state when the collection is empty', () => {
    wall([]);
    const group = screen.getByRole('radiogroup', { name: 'Sektöre göre filtreleyin' });
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
    expect(within(group).getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    expect(screen.getByTestId('stories-empty')).toHaveTextContent('İlk onaylar yolda');
    // Nothing to count, nothing to show: no result label, no grid, no per-sector state.
    expect(screen.queryByTestId('stories-result')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stories-grid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stories-none-in-sector')).not.toBeInTheDocument();
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
    expect(screen.getByTestId('stories-result')).toHaveTextContent(
      '2 onayın tamamı gösteriliyor',
    );
    const cards = within(screen.getByTestId('stories-grid')).getAllByRole('article');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Onaylandı');
    expect(cards[0]).toHaveTextContent('12 çalışma izni');
    expect(cards[0]).toHaveTextContent('Kat görevlileri');
    expect(cards[0]).toHaveTextContent('Haziran 2026');
    expect(cards[0]).toHaveTextContent('Antalya');
    expect(cards[0]).toHaveTextContent('Kırgızistan · Pakistan');
    expect(screen.queryByTestId('stories-empty')).not.toBeInTheDocument();
  });

  it('filters by sector and shows the per-sector empty state with a reset', async () => {
    wall([CARDS[0]]);
    await userEvent.click(screen.getByRole('radio', { name: 'Fabrika / Üretim' }));
    const none = screen.getByRole('status');
    expect(none).toHaveAttribute('data-testid', 'stories-none-in-sector');
    expect(
      within(none).getByRole('heading', { level: 3, name: NONE.title }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('stories-grid')).not.toBeInTheDocument();
    await userEvent.click(within(none).getByRole('button', { name: NONE.reset }));
    expect(screen.getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(1);
    expect(screen.getByTestId('stories-result')).toHaveTextContent(
      '1 onayın tamamı gösteriliyor',
    );
  });

  it('counts the filtered subset in the "showing X of N" line', async () => {
    wall(CARDS);
    await userEvent.click(screen.getByRole('radio', { name: 'Turizm / Konaklama' }));
    expect(screen.getByTestId('stories-result')).toHaveTextContent(
      '2 onaydan 1 tanesi gösteriliyor',
    );
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(1);
  });

  it('reads the EN result labels under the EN provider', () => {
    renderWithIntl(
      <ApprovalsWall
        sectors={SECTORS}
        stories={CARDS}
        legend="Filter by sector"
        emptyState={EMPTY}
        noneInSector={NONE}
        approvedLabel="Approved"
      />,
      { locale: 'en' },
    );
    expect(screen.getByTestId('stories-result')).toHaveTextContent('Showing all 2 approvals');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx"
```

Fails at import: `Failed to resolve import "../_components/ApprovalsWall"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx` (no directive — rendered from the client island, safe in both worlds):

```tsx
import { Card } from '@/design/primitives/Card';
import type { StoryCardData } from '../_lib/stories';

/** The v1 approval card (D9): approved pill + sector pill, headcount + unit, roles, month · place ·
 *  countries. No scan, no document track, no watermark (v1.1). Every string arrives resolved. */
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
      <p className="m-0 text-card-title font-extrabold text-ink">{card.headcountLabel}</p>
      <p className="m-0 text-body-sm text-text-secondary">{card.roles}</p>
      <p className="m-0 mt-auto text-body-sm font-bold text-text-tertiary">
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
import { useState, type ReactNode } from 'react';
// Direct file imports, never a barrel: `@/design/blocks` re-exports PostCard → `@/lib/format/date`
// → both message files, FaqBlock, Breadcrumbs and OfficeCard, and the primitives barrel carries
// every primitive — one barrel import from a client island would drag all of that into the
// client graph (W13; WP2b check, finding B-1). The W6 empty state is rendered on the server by
// the page and handed in as a node for the same reason.
import { Button } from '@/design/primitives/Button';
import { RadioChips, type RadioChipOption } from '@/design/primitives/RadioChips';
import type { StoryCardData } from '../_lib/stories';
import { StoryCard } from './StoryCard';

const ALL = 'all';

/**
 * The approvals wall (design #cases): single-select sector chips over the card grid. Two empty
 * states, both by data: the collection is empty → `emptyState` (the page's server-rendered
 * W6 "first approvals are on their way" card, `data-testid="stories-empty"`); a sector has no
 * card → the design's own "No approval published in that sector yet" (success.043–045) with a
 * reset. Filter state is component state only — facet views canonicalise to the base page
 * (PRD §4) and no filter event exists (W12: `approval_filter` is not allow-listed). A light
 * island without `next/dynamic`: it is the page's main content (W13).
 */
export function ApprovalsWall({
  sectors,
  stories,
  legend,
  emptyState,
  noneInSector,
  approvedLabel,
}: {
  /** `all` first, then the site's sector keys with their resolved labels. */
  sectors: RadioChipOption[];
  stories: StoryCardData[];
  legend: string;
  emptyState: ReactNode;
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
        emptyState
      ) : shown.length === 0 ? (
        <div
          role="status"
          data-testid="stories-none-in-sector"
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-1 bg-white px-6 py-10 text-center"
        >
          <h3 className="m-0 text-card-title text-ink">{noneInSector.title}</h3>
          <p className="m-0 max-w-[520px] text-body-sm text-text-secondary">{noneInSector.body}</p>
          <Button variant="primary" className="mt-2" onClick={() => setSector(ALL)}>
            {noneInSector.reset}
          </Button>
        </div>
      ) : (
        <>
          <p
            data-testid="stories-result"
            className="m-0 mb-4 text-body-sm font-extrabold text-text-tertiary"
          >
            {shown.length === stories.length
              ? sys('stories.wall.showingAll', { count: stories.length })
              : sys('stories.wall.showingFiltered', { shown: shown.length, total: stories.length })}
          </p>
          <ul
            data-testid="stories-grid"
            className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3"
          >
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

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx"
npm run verify
```

Six cases green; `verify` green (the island is not imported by any page yet — an unused module is legal for tsc and ESLint).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/success-stories/_components/ApprovalsWall.tsx" "src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx" "src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx"
git commit -m "feat(stories): approvals wall island — sector chips, card grid, per-sector empty state (T9 c3)

Direct primitive imports and a server-rendered W6 empty state keep the blocks barrel out of
the client graph (W13).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 4 — the data-gated sections: LiveBadge, NumbersBox, Testimonials, WorkerStories (null on empty)**

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';
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

  it('NumbersBox: null with no listed KPI, the box with a signed one', () => {
    const { container } = renderWithIntl(
      <NumbersBox bundle={testBundle()} locale="tr" kpis={[]} />,
    );
    expect(container).toBeEmptyDOMElement();

    // `placed` stands in for a future negative-KPI key: the test exercises the rendering path.
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
      <NumbersBox
        bundle={b}
        locale="tr"
        kpis={[{ key: 'placed', labelId: 'success.049', bodyId: 'success.050' }]}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('Testimonials: null on no rows, quote cards with rows — never the placeholder disclaimer', () => {
    const b = testBundle({ strings: QUOTE_STRINGS });
    const { container, rerender } = renderWithIntl(
      <Testimonials bundle={b} locale="tr" items={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <Testimonials
        bundle={b}
        locale="tr"
        items={[
          {
            id: 't1',
            quote: '“Evrak süreci kolay ilerledi.”',
            role: 'İK Müdürü',
            org: 'Otel grubu · Kemer',
            initials: 'HK',
          },
        ]}
      />,
    );
    const sec = screen.getByTestId('stories-testimonials');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Sezon bittiğinde işverenler ne diyor' }),
    ).toBeInTheDocument();
    expect(sec).toHaveTextContent('“Evrak süreci kolay ilerledi.”');
    expect(sec).toHaveTextContent('HK');
    expect(sec).toHaveTextContent('Otel grubu · Kemer');
    expect(sec).not.toHaveTextContent(/yer tutucu|placeholder/i);
  });

  it('WorkerStories: null while hidden, the two cards (one id-less title from sys) when visible', () => {
    const b = testBundle({ strings: WORKER_STRINGS });
    const { container, rerender } = renderWithIntl(
      <WorkerStories bundle={b} locale="tr" visible={false} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<WorkerStories bundle={b} locale="tr" visible />);
    const sec = screen.getByTestId('stories-workers');
    expect(
      screen.getByRole('heading', { level: 2, name: WORKER_STRINGS['success.071'] }),
    ).toBeInTheDocument();
    expect(sec).toHaveTextContent('Kaynakçı · Özbekistan → Ankara'); // sys.stories.workers.card1Title
    expect(sec).toHaveTextContent('Kat görevlisi · Nepal → Antalya'); // success.076
    expect(screen.getByRole('link', { name: WORKER_STRINGS['success.073'] })).toHaveAttribute(
      'href',
      '/adaylar',
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run "src/app/\[locale\]/(site)/success-stories/__tests__/hidden-sections.test.tsx"
```

Fails at import: `Failed to resolve import "../_components/LiveBadge"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/_components/LiveBadge.tsx` (server component; `useTranslations` is legal in a non-async RSC):

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
 *  from the `metrics` collection through the page's `NEGATIVE_KPIS` table — never typed (D17).
 *  Empty table, or no listed KPI signed (W1) → null. Test id on an inner div (W113). */
export function NumbersBox({
  bundle,
  locale,
  kpis,
}: {
  bundle: Bundle;
  locale: Locale;
  kpis: NegativeKpi[];
}) {
  if (kpis.length === 0) return null;
  const rows = getCollection(bundle, 'metrics');
  const shown = kpis
    .map((k) => ({ kpi: k, metric: rows.find((m) => m.key === k.key) }))
    .filter((x): x is { kpi: NegativeKpi; metric: Metric } => signed(x.metric));
  if (shown.length === 0) return null;
  const t = makeTf(bundle, locale);
  return (
    <Section tone="band">
      <div className="container-site">
        <div
          data-testid="stories-numbers"
          className="relative overflow-hidden rounded-hero bg-gradient-to-br from-[#253063] via-[#1c2652] to-[#131c40] px-6 py-8 text-white lg:px-11 lg:py-10"
        >
          <div className="mb-8 max-w-[640px]">
            <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-sky">
              {t('success.046')}
            </p>
            <h2 className="m-0 mb-3 text-h2 text-white">{t('success.047')}</h2>
            <p className="m-0 text-body text-white/75">{t('success.048')}</p>
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
                <p className="m-0 mt-2 text-body-sm text-white/65">{t(kpi.bodyId)}</p>
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
        <h2 className="m-0 mb-6 text-h2">{t('success.059')}</h2>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {items.map((q) => (
            <li key={q.id} className="min-w-0">
              <Card as="article" className="flex h-full flex-col gap-5">
                <blockquote className="m-0 text-body font-bold text-ink">{q.quote}</blockquote>
                <div className="mt-auto flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-tint text-body-sm font-extrabold text-blue-safe"
                  >
                    {q.initials}
                  </span>
                  <div>
                    <p className="m-0 text-body-sm font-extrabold text-ink">{q.role}</p>
                    <p className="m-0 text-body-sm text-text-tertiary">{q.org}</p>
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
 *  wall there is nothing to be "the other side" of, and the two named journeys stay off until
 *  the wall is live. Card 1's title has no package id (design line 776) →
 *  `sys.stories.workers.card1Title` (W9). */
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
              <h2 className="m-0 mb-3 text-h2">{t('success.071')}</h2>
              <p className="m-0 mb-4 text-body text-text-secondary">{t('success.072')}</p>
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
                    <h3 className="m-0 text-body-sm font-extrabold text-blue-safe">{c.title}</h3>
                    <p className="m-0 text-body-sm text-text-secondary">{t(c.bodyId)}</p>
                    <p className="m-0 mt-auto text-body-sm font-extrabold text-success-text">
                      {t(c.footId)}
                    </p>
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

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx vitest run "src/app/\[locale\]/(site)/success-stories"
npm run verify
```

All five page test files green (41 cases: 13 + 17 + 6 + 5). `verify` green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/success-stories/_components/LiveBadge.tsx" "src/app/[locale]/(site)/success-stories/_components/NumbersBox.tsx" "src/app/[locale]/(site)/success-stories/_components/Testimonials.tsx" "src/app/[locale]/(site)/success-stories/_components/WorkerStories.tsx" "src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx"
git commit -m "feat(stories): data-gated sections — live badge, KPI box, testimonials, worker stories return null on empty data (T9 c4)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 5 — the page: metadata, hero (LCP h1), wall, hidden sections, closing band; `UNBUILT_PATHNAMES` −1, gate rows +2; the page e2e spec (W106: the page and everything it imports are now in one green tree)**

- [ ] **Step 1: Write the failing test**

`e2e/pages/success-stories.spec.ts` (Playwright; `e2e/pages/` exists since T1):

```ts
import { test, expect } from '@playwright/test';
import en from '../../src/messages/en.json';
import tr from '../../src/messages/tr.json';

// Canonicals, hreflang and og:image are built from SITE_URL (the production origin), not the run host.
const ORIGIN = 'https://www.jobsadmire.com';
const SYS = { tr: tr.sys, en: en.sys } as const;

const ROUTES = [
  { path: '/basari-hikayeleri', locale: 'tr', alternate: '/en/success-stories' },
  { path: '/en/success-stories', locale: 'en', alternate: '/basari-hikayeleri' },
] as const;

type DataLayerEvent = Record<string, unknown>;

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

    test('canonical, hreflang, og:image and the language switch keep the page', async ({
      page,
    }, testInfo) => {
      await page.goto(r.path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${ORIGIN}${r.path}`,
      );
      await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/basari-hikayeleri`,
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/en/success-stories`,
      );
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/basari-hikayeleri`,
      );
      // 'stories' ∈ OG_PAGE_KEYS: the generated image, titled from sys.seo.stories.title.
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
        'content',
        `${ORIGIN}/og/${r.locale}/stories.png`,
      );
      await expect(page).toHaveTitle(SYS[r.locale].seo.stories.title);
      // The header switcher is in the desktop row only (below the threshold it lives in the
      // hamburger) — click it on the desktop project, and prove the target on both.
      if (testInfo.project.name === 'desktop') {
        // `exact`: the LanguageHint's "Switch to English" link would otherwise match too.
        await page
          .getByRole('link', { name: r.locale === 'tr' ? 'English' : 'Türkçe', exact: true })
          .first()
          .click();
        await expect(page).toHaveURL(new RegExp(`${r.alternate}$`));
      } else {
        await page.goto(r.alternate);
      }
      await expect(page.locator('h1[data-testid="page-h1"]')).toBeVisible();
    });

    test('carries a BreadcrumbList ending at this page and the closing band with its doors', async ({
      page,
    }) => {
      await page.goto(r.path);
      const nodes = (await page.locator('script[type="application/ld+json"]').allTextContents())
        .map((n) => JSON.parse(n) as Record<string, unknown>)
        .filter((n) => n['@type'] === 'BreadcrumbList');
      expect(nodes).toHaveLength(1);
      const items = nodes[0].itemListElement as { position: number; item: string }[];
      expect(items).toHaveLength(2);
      expect(items[1].item).toBe(`${ORIGIN}${r.path}`);
      // Scoped to the breadcrumb nav: the header's own nav marks /success-stories current too.
      const trail = page.getByRole('navigation', { name: SYS[r.locale].nav.breadcrumbs });
      await expect(trail.locator('[aria-current="page"]')).toHaveCount(1);

      const band = page.locator('#talk');
      await expect(band).toHaveCount(1);
      const wa = band.locator('a[href^="https://wa.me/"]');
      await expect(wa).toHaveCount(1);
      await expect(wa).toHaveAttribute('target', '_blank');
      await expect(wa).toHaveAttribute('rel', /noopener/);
      // W76/W95: the href carries only the static sys prefill — never a visitor-chosen value.
      const href = new URL((await wa.getAttribute('href')) ?? '');
      expect(href.searchParams.get('text')).toBe(SYS[r.locale].stories.whatsappPrefill);
      // The hero's "Discuss your case" is an in-page anchor to that band.
      await expect(page.locator('a[href="#talk"]')).toHaveCount(1);
    });

    test('the band WhatsApp door fires whatsapp_click with placement page_cta (W12)', async ({
      page,
      context,
    }) => {
      await context.route('https://wa.me/**', (route) =>
        route.fulfill({ status: 200, contentType: 'text/html', body: '' }),
      );
      await page.goto(r.path);
      const popup = page.waitForEvent('popup');
      await page.locator('#talk a[href^="https://wa.me/"]').click();
      await (await popup).close();
      const events = await page.evaluate(
        () =>
          (
            (window as unknown as { dataLayer?: DataLayerEvent[] }).dataLayer ?? []
          ).filter((e) => e.event === 'whatsapp_click'),
      );
      expect(events).toContainEqual(
        expect.objectContaining({ event: 'whatsapp_click', placement: 'page_cta', locale: r.locale }),
      );
    });

    test('shows the W6 empty wall with the site sector chips (no stories in Phase A)', async ({
      page,
    }) => {
      await page.goto(r.path);
      const wall = page.getByTestId('stories-wall');
      await expect(wall).toBeVisible();
      // "All sectors" + the seven site sectors (`sectors` collection), never the design's own six.
      await expect(wall.getByRole('radio')).toHaveCount(8);
      const empty = page.getByTestId('stories-empty');
      await expect(empty).toBeVisible();
      await expect(empty).toHaveAttribute('role', 'status');
      await expect(empty).toContainText(SYS[r.locale].stories.empty.title);
      const cta = empty.locator('a[href^="https://wa.me/"]');
      await expect(cta).toHaveCount(1);
      await expect(cta).toHaveAttribute('target', '_blank');
      const ctaHref = new URL((await cta.getAttribute('href')) ?? '');
      expect(ctaHref.searchParams.get('text')).toBe(SYS[r.locale].stories.empty.prefill);
      await expect(page.getByTestId('stories-grid')).toHaveCount(0);
      // Picking a chip on an empty collection keeps the empty wall — no per-sector text.
      // The native radio is sr-only under its chip face, so click the chip (the <label>).
      await wall.locator('label').nth(2).click();
      await expect(wall.getByRole('radio').nth(2)).toBeChecked();
      await expect(empty).toBeVisible();
      await expect(page.getByTestId('stories-none-in-sector')).toHaveCount(0);
      // The design's feed/sample wording never reaches the page body (the chrome's own
      // "CRM Login" label, home.012, lives outside <main>, so the check is scoped to it).
      const main = await page.locator('main').innerText();
      expect(main).not.toMatch(/sample data|örnek veri|live from CRM|CRM['’]den canlı/i);
    });

    test('hides the unsigned metrics, the KPI box, testimonials and worker stories by data (W1/W6)', async ({
      page,
    }) => {
      await page.goto(r.path);
      await expect(page.getByTestId('stories-live')).toHaveCount(0);
      await expect(page.getByTestId('stories-numbers')).toHaveCount(0);
      await expect(page.getByTestId('stories-testimonials')).toHaveCount(0);
      await expect(page.getByTestId('stories-workers')).toHaveCount(0);
      const main = await page.locator('main').innerText();
      // The design's unsigned figures, its design-time notes and the v1.1 document claims never render.
      expect(main).not.toMatch(
        /1[.,]240|\b68\b|\b91\s?%|%\s?91|\+19|Still to replace|Hâlâ değiştirilecek|Placeholder quotes|Yer tutucu yorumlar|blacked out|karartılır/,
      );
      // Delta 7: on the empty wall the hero body is the sys copy, not "Below are the actual…".
      await expect(page.locator('main')).toContainText(SYS[r.locale].stories.hero.bodyEmpty);
    });

    test('renders no <main> of its own (R31 — the (site) chrome owns #main)', async ({ page }) => {
      await page.goto(r.path);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);
    });
  });
}
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm run build
npx next start -p 3100 > /dev/null 2>&1 &
NEXT_PID=$!
until curl -s -o /dev/null http://localhost:3100/; do sleep 1; done
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/success-stories.spec.ts --project=desktop
kill $NEXT_PID
```

Every case fails: `/basari-hikayeleri` answers 404 from the `(site)/[...rest]` catch-all (`expect(res?.status()).toBe(200)` receives 404; the others time out on missing test ids). The second red of this cycle is W20's: once `page.tsx` exists (Step 3) and before the `UNBUILT_PATHNAMES` line is deleted, `npx vitest run src/lib/seo/unbuilt.test.ts` fails with the set still listing `/success-stories` while the filesystem walk finds `success-stories/page.tsx`.

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
  EmptyState,
  ImageSlot,
  MetricStrip,
  type Crumb,
} from '@/design/blocks';
import { Button, Eyebrow, Section } from '@/design/primitives';
import type { RadioChipOption } from '@/design/primitives/RadioChips';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { ApprovalsWall } from './_components/ApprovalsWall';
import { LiveBadge } from './_components/LiveBadge';
import { NumbersBox } from './_components/NumbersBox';
import { Testimonials } from './_components/Testimonials';
import { WorkerStories } from './_components/WorkerStories';
import { NEGATIVE_KPIS, STORIES_HERO_METRICS } from './_lib/metrics';
import { readStories, readTestimonials, storyCards } from './_lib/stories';

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
  // The `stories` page record has titleId/descriptionId '' (the package has no SEO strings for
  // this page), so these sys fallbacks are what renders (W23/W38); the OG route reads the same key.
  return buildMetadata({
    locale,
    href: '/success-stories',
    bundle,
    pageKey: 'stories',
    fallbackTitle: sys('seo.stories.title'),
    fallbackDescription: sys('seo.stories.description'),
  });
}

export default async function SuccessStories({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const t = makeTf(bundle, locale);

  // Phase A: `stories` is a FIXTURE_ONLY collection — empty on every Vercel build (D23), so the
  // wall is the W6 empty state and every data-gated section below returns null. Phase B fills
  // it from Operations (I10) and the same components render the cards.
  const stories = readStories(bundle);
  const cards = storyCards(bundle, locale, stories);
  const testimonials = readTestimonials(bundle);
  const published = stories.length > 0;
  const whatsapp = bundle.settings.whatsappNumber;

  // W109: the page's own package nav label (success.013) and its own Home label (success.022).
  const crumbs: Crumb[] = [
    { name: t('success.022'), href: '/' },
    { name: t('success.013'), href: '/success-stories' },
  ];
  // Delta 2: the site's sector taxonomy (the keys every form sends) plus the design's
  // "All sectors" chip — not the design's private hotels/food enum.
  const sectorOptions: RadioChipOption[] = [
    { value: 'all', label: t('success.124') },
    ...getCollection(bundle, 'sectors').map((s) => ({ value: s.key, label: t(s.labelId) })),
  ];
  // W76/W95: both prefills are static page copy — no visitor-chosen value ever sits in an href.
  const jobOrderHref = waLink(whatsapp, sys('stories.whatsappPrefill'));
  const exampleHref = waLink(whatsapp, sys('stories.empty.prefill'));
  const heroStats = STORIES_HERO_METRICS.length > 0;

  return (
    <>
      {/* ---- Hero (design .ja-ss-hero: navy + gradient overlay over the ss-hero slot) ---- */}
      <Section tone="dark" className="relative overflow-hidden">
        {/* §10 row 4: the hero photo is a named placeholder (W55) and the h1 is the LCP element
            (D26). Decorative: alt "" → aria-hidden. */}
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
          <div
            className={
              heroStats ? 'grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]' : 'max-w-[720px]'
            }
          >
            <div>
              <LiveBadge stories={stories} />
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em] text-white"
              >
                {t('success.023')} <span className="text-sky">{t('success.024')}</span>
              </h1>
              {/* Delta 7: success.025 says "Below are the actual approvals" — only true once one
                  is published. */}
              <p className="m-0 mb-7 max-w-[540px] text-body-lg text-white/80">
                {published ? t('success.025') : sys('stories.hero.bodyEmpty')}
              </p>
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
            <MetricStrip
              bundle={bundle}
              locale={locale}
              metrics={STORIES_HERO_METRICS}
              tone="dark"
            />
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
              <h2 className="m-0 mb-2 text-h2">{t('success.036')}</h2>
              {/* Delta 7: success.037 (legal-flagged) describes the v1.1 redacted documents. */}
              <p className="m-0 text-body text-text-secondary">{sys('stories.wall.intro')}</p>
            </div>
            <Button variant="primary" href="/work-permit">
              {t('success.038')}
            </Button>
          </div>
          <ApprovalsWall
            sectors={sectorOptions}
            stories={cards}
            legend={sys('stories.wall.legend')}
            emptyState={
              <EmptyState
                testId="stories-empty"
                tone="pale"
                title={sys('stories.empty.title')}
                body={sys('stories.empty.body')}
                cta={{ label: sys('stories.empty.cta'), href: exampleHref, external: true }}
              />
            }
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
      <WorkerStories bundle={bundle} locale={locale} visible={published} />

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
            primary={{ label: t('success.081'), href: jobOrderHref, external: true }}
            secondary={{ label: t('success.082'), href: '/contact' }}
            extra={[{ label: t('success.083'), href: '/hiring-cost-calculator' }]}
          />
        </div>
      </Section>
    </>
  );
}
```

Notes: `#talk` is neither `/`-rooted nor external, so `Button` renders a same-tab `<a href="#talk">` (R22); `/hiring-cost-calculator`, `/work-permit` and `/contact` are `pathnames` keys, so the next-intl `Link` branch localizes them (`/maliyet-hesaplayici`, `/calisma-izni`, `/iletisim` under TR). `ClosingCtaBand` routes every CTA through `ContactCta` `page_cta`, so the wa.me primary fires `whatsapp_click`; `EmptyState` does the same for its CTA. The island receives `EmptyState` as an already-rendered server node, so its client graph stays `RadioChips` + `Button` + `Card` (W13).

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` set literal, delete the one line `'/success-stories',`.

`e2e/routes.ts` — in `GATE_ROUTE_TABLE`, directly above the comment line `// The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.` (i.e. after the rows T1–T8 appended), add:

```ts
  { path: '/basari-hikayeleri', indexable: true },
  { path: '/en/success-stories', indexable: true },
```

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx vitest run src/lib/seo/unbuilt.test.ts scripts/gate-routes.test.ts "src/app/\[locale\]/(site)/success-stories"
npm run verify
npm run build
npx next start -p 3100 > /dev/null 2>&1 &
NEXT_PID=$!
until curl -s -o /dev/null http://localhost:3100/; do sleep 1; done
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/success-stories.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts
kill $NEXT_PID
```

`unbuilt.test.ts` green (set and filesystem agree again); `gate-routes.test.ts` green (the TR and EN halves of `INDEXABLE_GATE_ROUTES` stay equal); the page's five Vitest files still green. `verify` green. The spec's 8 cases × 2 routes × 2 projects = 32 green; `routing.spec.ts`'s page-contract loop and `seo.spec.ts`'s canonical/sitemap loop now include the two routes and pass (the sitemap lists `/basari-hikayeleri` and `/en/success-stories` because the key left `UNBUILT_PATHNAMES`). One build/test job at a time; the `kill` ends the server.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/success-stories/page.tsx" src/lib/seo/routes.ts e2e/routes.ts e2e/pages/success-stories.spec.ts
git commit -m "feat(stories): Success Stories page — W6 empty wall, hero h1 LCP, hidden-by-data sections, closing band (T9 c5)

/basari-hikayeleri + /en/success-stories leave UNBUILT_PATHNAMES (W20) and join the gate
route table (W21). sys.seo.stories fallbacks (W23/W38); BreadcrumbList via Breadcrumbs with
the page's own nav label (W109); static WhatsApp prefills only (W95).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 6 — the preview gate, docs, ledger**

- [ ] **Step 1: Write the failing test**

No new test: the checks of this cycle are the preview gate (`npm run gate`, which runs every spec including `e2e/pages/success-stories.spec.ts`, axe and the width sweep over `GATE_ROUTES`, and Lighthouse over `INDEXABLE_GATE_ROUTES`) and the docs, which are prose (Prettier-checked by `verify`). The doc anchors below must exist before editing — prove it (a missing anchor means an earlier task deviated; stop and ask the controller rather than invent a location):

```bash
grep -n "^## Pages" docs/SEO.md
grep -n "^### Page instrumentation (WP2b)" docs/ANALYTICS.md
grep -n "^### Adding copy" docs/CONTENT-MODEL.md
grep -n "become collections when an editor needs to reorder them" docs/CONTENT-MODEL.md
grep -n "no proof scans at launch (D9 v1)" docs/PRD.md
grep -n "item type \`successStory\`" docs/INTEGRATIONS.md
grep -n "T1 Homepage" docs/superpowers/plans/2026-09-20-wp2b-pages.md
```

- [ ] **Step 2: Run the gate against the branch preview (the binding run, R50)**

```bash
git push -u origin HEAD   # wp2/foundation → its Vercel preview (door-less, W92); never main
export VERCEL_AUTOMATION_BYPASS_SECRET=<from ACCESS.md — never committed, never echoed>
E2E_BASE_URL=https://<preview>.vercel.app npm run gate
npm run js-size
```

W91 (WP2a Task 7): `playwright.config.ts` sends the `x-vercel-protection-bypass` header, and `scripts/gate.sh` switches to `lighthouserc.preview.json` for a `*.vercel.app` base (the preview's `Disallow: /` robots would otherwise fail SEO's crawlable audit). Expected: Playwright green on both projects (every spec, including this page's 8 cases); axe over `GATE_ROUTES` with zero violations (the chips are native radios with a visually hidden legend, the empty state is `role="status"`, the decorative hero slot is `aria-hidden`); the width sweep clean at 1440…390 (the hero is one column, the card grid is `md:grid-cols-2 lg:grid-cols-3`); Lighthouse on both routes: performance ≥ 0.95, a11y/BP/SEO = 1.0, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms (the h1 over the gradient). If `npm run js-size` reports either route above 194,560 B (`LAZY_LINE`) — unlikely: the only page island is `ApprovalsWall` (+ `RadioChips`, `Button`, `Card`), a few KB over the shell — move `ApprovalsWall` behind `next/dynamic` **with SSR kept** (it is the main content) before T10 starts (W13 amended).

- [ ] **Step 3: Implement (docs + ledger)**

`docs/SEO.md` — append one row at the end of the `## Pages` table (T1 created it with the W98 columns Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes; append after the last row an earlier task added):

```markdown
| Success Stories | `/basari-hikayeleri` · `/en/success-stories` | `sys.seo.stories.{title,description}` — the `stories` record's ids are `''` (W23/W38); OG image `/og/{locale}/stories.png` | self per locale (`absoluteUrl(locale, '/success-stories')`); the sector chips are component state, never a URL (PRD §4 facets) | `BreadcrumbList` (Home → Success Stories, `Breadcrumbs`); no ItemList/Review in v1 | `h1` (`data-lcp-slot="h1"`); `ss-hero` is a named placeholder (§10 row 4, D26) | W6 empty wall; hero stats, live badge, KPI box, testimonials and worker stories hidden by data (W1, §10 row 11) |
```

`docs/ANALYTICS.md` — append one bullet at the end of the `### Page instrumentation (WP2b)` list (after the last bullet an earlier task added):

```markdown
- **Success Stories (`/basari-hikayeleri`, `/en/success-stories`, T9):** `whatsapp_click` with `placement: 'page_cta'` from the closing band's "Send us the job order" and from the empty wall's "Ask for an example on WhatsApp" (both `ContactCta`); both hrefs carry only a static `sys.stories.*` prefill, never a visitor-chosen value (W76/W95). The design's `approval_filter` event is **not** fired — it is not allow-listed (W12) and the sector chips are component state only. No form, so no `generate_lead`/`conversion` originates here; the hero, wall and band's other CTAs are internal links and fire nothing.
```

`docs/CONTENT-MODEL.md` — § `### Adding copy (W9, W23, W54)`: append one bullet at the end of the per-page list T1 started (after the last bullet an earlier task added):

```markdown
- **Success Stories (T9, W6/W9/W23):** `sys.stories.hero.{bodyEmpty,liveBadge}` (`bodyEmpty` replaces `success.025` — "Below are the actual approvals…" — while none is published; `liveBadge` is the ICU `{count}` that replaces the design's "N permits approved · live from CRM / sample data", which must never render), `sys.stories.wall.{intro,legend,showingAll,showingFiltered}` (`intro` replaces the legal-flagged `success.037`, which describes the v1.1 redacted documents; the result line's "of"/"approvals" words have no ids — `success.141/142` are only fragments), `sys.stories.empty.{title,body,cta,prefill}` (the W6 "first approvals are on their way" wall), `sys.stories.whatsappPrefill` (the band's job-order prefill — the design's line-1119 text without its "I saw your approvals" clause), `sys.stories.workers.card1Title` (design line 776, no id); `sys.seo.stories.{title,description}`. `success.025`/`success.037` are listed for the WP-C legal sheet.
```

`docs/CONTENT-MODEL.md` — § `## Collections`: after the paragraph whose last sentence ends "…become collections when an editor needs to reorder them." (and after any page-local collection paragraph an earlier page task appended), add:

```markdown
**`stories` / `testimonials` (Phase B, I10; page-local schemas in Phase A by ruling).** The Success Stories page reads `collections.stories` through `StorySchema` in `src/app/[locale]/(site)/success-stories/_lib/stories.ts`: `{ id, sector: SectorKey, roles, headcount, approvedAt: 'YYYY-MM-DD', place (city only, D9), countries: ISO-2[] }` — the v1 `successStory` card (no proof image until v1.1). It is a `FIXTURE_ONLY` collection: empty under `LOCAL` on every Vercel build (D23 — `assertServableInProduction` refuses rows), so Phase A renders the W6 empty wall. `testimonials` (§10 row 11): `{ id, quote, role, org, initials }`, consented rows only. A bad row throws in development and degrades to an empty wall in production (R28). Phase B moves both schemas into `collections.ts`.
```

`docs/PRD.md` — in the page table, row `| 11  | Success Stories …`, replace the Forms-cell text `none — CMS cards, no proof scans at launch (D9 v1)` with:

```
none — CMS cards, no proof scans at launch (D9 v1); Phase A ships the W6 empty wall (sector chips + "first approvals are on their way"), with hero metrics / KPI box / testimonials / worker stories hidden by data (W1, §10 row 11) until the `stories` collection is fed from Operations (I10)
```

`docs/INTEGRATIONS.md` — § `## I10 — Success stories (cards)`: after the sentence "**Shape:** part of the I1 bundle; `WebsiteCollection` item type `successStory`." insert: "Row shape = `StorySchema` in the Success Stories page's `_lib/stories.ts` (`docs/CONTENT-MODEL.md` § Collections); Phase A serves no rows (D23)."

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append to the ledger table (T1's row format):

```markdown
| T9 Success Stories | `/basari-hikayeleri` · `/en/success-stories` | script gz: `/basari-hikayeleri` <n> B · `/en/success-stories` <n> B (ceiling 204,800; lazy line 194,560) | LH mobile: perf <x.xx> · a11y <x.xx> · SEO <x.xx> · LCP <n> ms · CLS <n> (both routes) | pixel: n/a — not a D27 harness page (Fable side-by-side review); named deltas 1–10; hidden by data: hero stats, live badge, KPI box, testimonials, worker stories; UNBUILT −1 (`/success-stories`), gate routes +2 | <date> |
```

Fill the `<…>` from `npm run js-size`'s table and the gate's `lighthouse-report/`. Then:

```bash
npx prettier --write docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/INTEGRATIONS.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
```

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npm run verify
```

Green (`prettier --check .` covers the re-aligned tables). The gate numbers in the ledger row come from Step 2's run; nothing in this cycle changes code, so no re-run is needed.

- [ ] **Step 5: Commit**

```bash
git add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/INTEGRATIONS.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(stories): SEO page row, analytics placements, sys.stories copy, stories row shape, PRD Phase A behaviour, T9 ledger (T9 c6)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push
```

---

**Ledger line spec (W22/W98, T1's row format):** route `/basari-hikayeleri` · `/en/success-stories`; js-size = gzipped script bytes per route from `npm run js-size` against the preview gate run (ceiling 204,800, lazy line 194,560); Lighthouse triple on both routes = perf / a11y / SEO (+ LCP ms, CLS); pixel = **n/a** (D27 applies only to Homepage, Cost Calculator, Hire Workers, Blog Article — this page gets the Fable side-by-side review against the named deltas 1–10); plus the hidden-by-data list, UNBUILT −1, gate routes +2 and the date.

**Docs in this task:** `docs/SEO.md` — one row appended to the `## Pages` table (W98 columns): title source `sys.seo.stories.*`, self canonical, `BreadcrumbList`, LCP `h1`, `ss-hero` placeholder. `docs/ANALYTICS.md` — one bullet appended to `### Page instrumentation (WP2b)`: `whatsapp_click` `page_cta` from the band and the empty-wall CTA, static prefills (W95), no `approval_filter`. `docs/CONTENT-MODEL.md` — one bullet appended to § Adding copy's per-page list (`sys.stories.*` + `sys.seo.stories.*`, the two replaced ids) and one paragraph after the § Collections paragraph ending "…become collections when an editor needs to reorder them." (`stories`/`testimonials` shapes, D23). `docs/PRD.md` — the page-table row 11 Forms cell, anchored on "none — CMS cards, no proof scans at launch (D9 v1)". `docs/INTEGRATIONS.md` — I10, after the sentence ending "item type `successStory`." `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T9 ledger row.

**Sys keys added (14, both locales):** `sys.seo.stories.title`, `sys.seo.stories.description`, `sys.stories.hero.bodyEmpty`, `sys.stories.hero.liveBadge`, `sys.stories.wall.intro`, `sys.stories.wall.legend`, `sys.stories.wall.showingAll`, `sys.stories.wall.showingFiltered`, `sys.stories.empty.title`, `sys.stories.empty.body`, `sys.stories.empty.cta`, `sys.stories.empty.prefill`, `sys.stories.whatsappPrefill`, `sys.stories.workers.card1Title` — pinned by `__tests__/sys-keys.test.ts`.

**Package ids used:** 35 `success.*` ids, every one present in `src/content/local/catalogue.json` (checked 2026-09-24): `success.013, 022, 023, 024, 025, 026, 027, 035, 036, 038, 040, 041, 043, 044, 045, 046, 047, 048, 058, 059, 070, 071, 072, 073, 074, 075, 076, 077, 078, 079, 080, 081, 082, 083, 124`. Read conditionally: `025` only while an approval is published; `040/041/043–045` only when cards exist (the island / `storyCards`); `046–048`, `058–059` and `070–078` only inside the data-gated sections (`NumbersBox`, `Testimonials`, `WorkerStories`), which return `null` before any lookup today. `success.049–057` are named only by rows of the empty `NEGATIVE_KPIS` table, so none is read in Phase A. The sector chips read `hire.076–082` through the `sectors` collection's `labelId`s, not by literal id. Deliberately not rendered: `success.001–021` and `084–111` (chrome — the shared chrome reads the canonical `home.*` ids, R15), `028–034` (unsigned captions + the amber note), `037` (legal-flagged, v1.1 document claim — delta 7), `039`, `042`, `060–069` (placeholder quotes + disclaimer), `112–123` (sample-data role/country strings), `125–136` (the design's private sector enum, feed status, show-more), `137` (generic hire prefill), `138–151` (feed-status / slider / proof-frame wording that presumes a browser CRM fetch). For the WP-C legal sheet: `025`, `037`.

**Foundation gaps:** none. Accepted page-local by the reconcile rulings: the `stories`/`testimonials` Zod schemas (Phase B moves them into `collections.ts`).
