### Task 8: Available Workers (`/adaylar`, `/en/available-workers`)

**Why this task looks the way it does.** The design is a live candidate pool with filters, a basket and cards fed by a 12-record inline fixture. Phase A has no pool source (CRM `website-feed` is v1.1, spec §3.3; Ops has no pool service), `pool` is a `FIXTURE_ONLY` collection (D23 — `assertServableInProduction` throws on a LOCAL bundle carrying pool rows under `NODE_ENV=production`, which Vercel sets on previews too), and per-profile cards are OFF behind `pool.cards` (D2). So this page ships the **request form + the "what verified means" steps + the after-you-pick timeline + FAQ + closing band**, with every pool-derived element (the hero "Live from our portal" badge, the popular-industry chips, the stats strip, the cards/filters/basket, the "live sample refreshed weekly" FAQ pair) rendered **by data, not deleted**: a component that returns `null` while the pool collection is empty (W4/W5/W6 pattern), so the day the pool is signed nothing here has to be un-deleted. The aggregate strip stays hidden because no pool number is signed (W1/W6 — "200+" is not a metric key and "Updated weekly" is a cadence claim with no source, D17). Empty-state copy lives in `sys.workers.*` (W6/W9/W23). Rulings in force: W1, W3 (the door wins: `name`/`email` required; `city` via the v1.1 catalog; stable option keys), W6, W9, W12, W13 amended, W16 (catalog v1.1 `city`), W17 (the header CTA table names `#pool` — this page must render that id), W19 (`(site)` group), W20 (delete the `UNBUILT_PATHNAMES` key), W21 (append to `GATE_ROUTE_TABLE` only), W23 (sys namespaces), W30 (field copy by name), W61 (`ImageSlot` placeholder attributes), W71 (blocks resolve ids through `makeTf`).

**Files:**

Create
- `src/app/[locale]/(site)/available-workers/page.tsx` — the server page (metadata + the seven sections in design order)
- `src/app/[locale]/(site)/available-workers/actions.ts` — `'use server'` wrapper: `submitWorkers`
- `src/app/[locale]/(site)/available-workers/_lib/options.ts` — `ROLE_KEYS`, `START_WHEN_KEYS` (stable option keys, W3)
- `src/app/[locale]/(site)/available-workers/_lib/message.ts` — `composeWorkersMessage` (basket refs folded into `message`), `parseProfileRefs`
- `src/app/[locale]/(site)/available-workers/_lib/spec.ts` — `workersSchema`, `toWorkersFields`, `WORKERS_SPEC` (pure, unit-tested; `actions.ts` wraps it)
- `src/app/[locale]/(site)/available-workers/_lib/pool.ts` — `POOL_CARDS`, `poolRows`, `poolSigned` (the D2/D23 gate every pool-derived element reads)
- `src/app/[locale]/(site)/available-workers/_lib/content.ts` — `VERIFIED_STEPS`, `WORKERS_FAQ`, `workersFaqItems`
- `src/app/[locale]/(site)/available-workers/_components/RequestFormFields.tsx` — `'use client'` island: role chips (→ `iAm`) swapping the form head/placeholders, the `Field`s
- `src/app/[locale]/(site)/available-workers/_components/PoolAggregate.tsx` — the stats strip; returns `null` while the pool collection is empty (always, under LOCAL in production)
- `src/app/[locale]/(site)/available-workers/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/available-workers/__tests__/pool.test.ts`
- `src/app/[locale]/(site)/available-workers/__tests__/message.test.ts`
- `src/app/[locale]/(site)/available-workers/__tests__/content.test.ts`
- `src/app/[locale]/(site)/available-workers/__tests__/spec.test.ts`
- `src/app/[locale]/(site)/available-workers/__tests__/RequestFormFields.test.tsx`
- `src/app/[locale]/(site)/available-workers/__tests__/PoolAggregate.test.tsx`
- `e2e/pages/workers.spec.ts`

Modify
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.workers.{title,description}` inside the existing `seo` object (Task 4 created it with `ogTagline`); new `sys.workers.*` object after `thankYou` (the file's line numbers moved in WP2a Tasks 1–5; anchor on the object names)
- `src/lib/seo/routes.ts` — the `UNBUILT_PATHNAMES` literal (WP2a Task 4 cycle 1: `new Set<keyof typeof pathnames>([ '/hiring-cost-calculator', … ])`): delete the line `'/available-workers',` (W20)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE` (WP2a Task 7 cycle 1): insert two rows before the `// The conversion page (D13)` comment (W21)
- `docs/SEO.md` § Metadata — the per-page table row (see Cycle 5)
- `docs/ANALYTICS.md` § Event schema — one paragraph (see Cycle 5)
- `docs/CONTENT-MODEL.md` § The `sys.*` range — one bullet (see Cycle 5)
- `docs/PRD.md` line 29 — the Available Workers row of the page table (see Cycle 5)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` § Ledger — the T8 line (see Cycle 5)

Test
- the seven Vitest files above (matched by `vitest.config.mts`'s `src/**/*.test.{ts,tsx}`; `[locale]`/`(site)` in the path are literal directory names, the glob's `**` walks them — WP2a Tasks 2 and 4 already keep tests under `src/app/`)
- `e2e/pages/workers.spec.ts` (Playwright, both projects, picked up by `testDir: './e2e'`)
- the foundation's own guards that this task must keep green: `src/lib/seo/unbuilt.test.ts` (the set and the filesystem must agree), `src/messages/messages.test.ts` (identical `sys.*` key sets), `e2e/routing.spec.ts`'s page-contract loop and `e2e/seo.spec.ts`'s canonical/hreflang + sitemap 200-sweep over `INDEXABLE_GATE_ROUTES`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts`

**Interfaces:**

Consumes (exact names — WP2a `produces-final.md` unless marked WP1)
- T0b `src/content/collections.ts`: `getCollection(bundle, 'sectors')` → `Sector[]` (`key: 'factory'|'construction'|'tourism'|'agriculture'|'textile'|'logistics'|'other'`, `labelId` = hire.076–082), `SECTOR_KEYS`; `bundle.collections.pool` is read raw (there is **no** `pool` key in `CollectionSchemas` — see Foundation gaps). T0b `src/content/pure.ts` (re-exported by `@/content/adapter`): `makeTf(bundle, locale)`, `metricValues(bundle, locale)` (`homepageReplyHours: '24'`, `firstDayWeeks: '6–8'`), `assertServableInProduction` (WP1). T0b bundle facts: `availworkers.026` TR corrected to `Türkiye'de` and EN `in Türkiye` (W7, `content-overrides.json`); `availworkers.038/048/067/071/106/142/220` re-authored with `{replySlaHours}`/`{homepageReplyHours}`/`{countries}`/`{firstDayWeeks}`/`{firstDayWeeksInCountry}` — hence `makeTf` for every package id on this page; `bundle.pages.workers` exists with `titleId: ''`/`descriptionId: ''` → `buildMetadata` uses the `sys.seo.workers.*` fallbacks (W38).
- T0a `src/forms/action.ts` (`import 'server-only'`): `createFormAction(spec)`, `type FormActionState`, `type FormSpec<S>` (`{ key: FormKey; schema; toFields(parsed, data); consent? }` — `toFields` receives the parsed object and the raw `FormData`). `src/forms/wire.ts`: `type WireFields`. `src/forms/client/FormShell.tsx`: `FormShell({ action, formKey, locale, turnstileSiteKey, whatsappNumber, contact?, submitLabel?, consent?, consentLinkHref?, children, className?, testId? })` — renders the honeypot, the Turnstile widget when a site key exists, the consent row, the submit button and, on an `error` state, `FallbackPanel` (`data-testid="form-fallback"`, `data-kind=<FormFallbackKind>`); with no `OPS_API_URL`/token, `doorConfig()` is `null` → `postForm` answers `{ kind: 'unauthorized' }` without a call → the panel shows deterministically. `src/forms/client/Field.tsx`: `Field`, `type FieldOption` (label = `sys.form.labels.<name>` by default, W30; `as="select"` prepends the `sys.form.placeholders.select` option; a non-required field gets `sys.form.hints.optional`). `src/forms/client/FormErrorsContext.tsx`: `useFieldValue(name)`.
- T0c `src/analytics/ContactLink.tsx`: `ContactLink({ href, placement, children, ...anchorAttrs })` (placement `'page_cta'`). T0c `src/design/chrome/ctas.ts`: `CTA_BY_PATHNAME['/available-workers']` = availworkers.016 + home.003 → `{ pathname: '/available-workers', hash: '#pool' }` — **this page must render an element with `id="pool"`** (the contract line in Task 3's Produces). T0c route group `(site)/layout.tsx` (default chrome, `<main id="main">`).
- T0d `src/design/blocks` barrel: `Breadcrumbs({ locale, items: Crumb[], tone, className })`, `ClosingCtaBand({ bundle, locale, titleId, bodyId?, primary: Cta, secondary?, tone, id })`, `ContactCta({ placement, href, variant?, size?, external?, className?, children })`, `EmptyState({ title, body?, cta?, tone?, testId? })`, `FaqBlock({ bundle, locale, items: FaqItem[], id?, eyebrowId?, headingId?, bodyId?, askCard?, openFirst? })` (renders `<JsonLd data={faqJsonLd(items)}/>`), `ImageSlot({ slot, lcp?, src?, alt, width, height, className? })` (no `src` → `data-placeholder={slot}`; `alt=""` → `aria-hidden`, no role; W61), `ProcessSteps({ bundle, locale, steps: ProcessStep[], variant, id })`, `type Cta`, `type FaqItem`, `type ProcessStep`. `src/design/primitives`: `Button` (WP1; `href` starting with `/` → typed next-intl `Link`, `#…`/`tel:`/`wa.me` → plain anchor, R22), `Card` (WP1), `Eyebrow` (WP1), `Section({ tone: 'light'|'dark'|'pale'|'band' })`, `Stat({ value?, text?, label, locale })`, `Timeline({ steps, variant: 'horizontal' })`, `type TimelineStep`, `RadioChips({ name, options, value, onChange, legend, legendHidden? })`. `src/design/chrome/StickyCtaBar.tsx`: `StickyCtaBar({ message, ctas: StickyCta[], hideNearId? })` (its CTAs render through `Button`, not `ContactCta` — see Foundation gaps). `src/test/bundle.ts`: `testBundle({ strings?, collections?, settings? })`; `src/test/render.tsx` (WP1): `renderWithIntl`.
- T0c/T0d `src/lib/seo/metadata.ts`: `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })`; `src/lib/seo/routes.ts`: `UNBUILT_PATHNAMES`; T0e `e2e/routes.ts`: `GATE_ROUTE_TABLE` (`{ path, indexable }`), `scripts/js-size.mjs` (`npm run js-size`), `scripts/gate.sh` (`npm run gate`).
- WP1: `getBundle` (`@/content/adapter`), `waLink`/`mailLink` (`@/lib/contact`), `Link` (`@/i18n/navigation`), `routing`/`Locale` (`@/i18n/routing`), `FORM_KEYS` (`'workers'` is a `FormKey`, R55; `sys.thankYou.forms.workers` exists in both message files), `getTranslations('sys')`, the page-file pattern (`generateMetadata` → `hasLocale` → `getBundle` → `buildMetadata`; default export → `setRequestLocale`; no `<main>`, R31).
- Operations catalog `workers` (INQUIRY; `apps/backend/src/modules/website/website-form-catalog.ts`, v1.0 + T0f v1.1): `name` (req ≤120), `company` (req ≤200), `email` (req), `phone` (req, ≥8 digits, ≤40), `country` (iso2, optional), `iAm` (`direct_employer | hr_agency`), `trade` (≤200), `headcount` (≤10), `startWhen` (≤120), `message` (≤5000), `city` (≤120, v1.1). Unknown keys inside `fields` are dropped silently. The classification is DIRECT_EMPLOYER by default, HR_AGENCY through `iAm`; the inbox preview lists the non-identity fields in catalog order (`trade: tourism`, `headcount: 12`, `startWhen: month1`, `city: Antalya`, `message: …`).

Produces
- Nothing another task relies on. `poolSigned`/`POOL_CARDS` are page-local; the v1.1 cards task replaces `PoolAggregate`'s provisional row parsing with a `CollectionSchemas.pool` entry and builds the cards/filters/basket beside it.

**Design → build map (sections in the design's order; every string by exact id through `tf = makeTf(bundle, locale)` unless marked `sys`):**

| # | Design (`Available Workers.dc.html`) | Built as | Ids |
|---|---|---|---|
| 1 | Slim bar / header / hamburger (lines 401–472) | shared chrome (`(site)` layout); header CTA from `CTA_BY_PATHNAME` → `#pool` | — |
| 2 | Hero (474–504): breadcrumb, "Live from our portal", H1, intro, Browse candidates → `#pool`, Ask for profiles (WhatsApp), KVKK note, popular chips | `Section tone="dark"` + `ImageSlot slot="aw-hero"` (placeholder, decorative, **not** the LCP: §10 row 4 gives this page a gradient) + `Breadcrumbs tone="dark"` + live badge (**only when `poolSigned`**) + `<h1 data-testid="page-h1" data-lcp-slot="h1">` + `Button` + `ContactCta` + note; popular chips not built (they are derived from pool trades — the cards task) | 021, 022, 023 (gated), 024, 025, 026, 027, 028, 029, 030, 224 (WhatsApp prefill) |
| 3 | Hero form card `#pool-form` (506–578): role tabs, mobile-collapsed CTA, basket, inline "Request sent", form, footer | `FormShell` (`workers`) with the `RequestFormFields` island (role `RadioChips` → `iAm`; head title/subtitle, company/message placeholders by role); no collapse, no basket (cards off), no inline success (D13 → `/tesekkurler?form=workers`); footer: Prefer WhatsApp? + Sourcing agency? Partner with us → | 141, 142, 143, 144, 146, 147, 148, 149, 150, 151, 044, 045, 046, 047, 041, 042, 043; `sys.workers.form.titles.direct_employer`, `sys.form.labels.iAm` |
| 4 | Sticky desktop bar (583–597): message 048, Call, WhatsApp us, Request workers → | `StickyCtaBar` with `sys.workers.sticky.message` (048 presupposes a visible profile; `{hours}` = `homepageReplyHours` — hidden when the metric is unsigned) and the one internal CTA 051 → `#pool-form`; `hideNearId="pool-cta"` | 051; `sys.workers.sticky.message` |
| 5–8 | Pool header, stats strip, filters, card grid, empty state, "Can't see the profession" card (598–769) | `Section id="pool"`: `sys.workers.pool.{heading,intro}` → `PoolAggregate` (null while empty) → `EmptyState` (`sys.workers.empty.*`, CTA → `#pool-form`, `data-testid="pool-empty"`) while `!poolSigned`; the gradient 070/071 card and everything else in 5–8 belongs to the cards task | 055–058 (inside `PoolAggregate`, rows only) |
| 9 | What "verified" means (777–827): h2, intro, 4 step cards on a journey line, shield footnote | h2 + p + `ProcessSteps variant="cards" id="verified-steps"` (step 4 carries `when` = 081 "Goes live") + footnote | 072, 073, 074–080, 081, 082, 083, 084 |
| 10 | After you pick (829–875): eyebrow, h2, intro, 2 CTAs, vertical 4-step card | `Eyebrow` + h2 + p + `Button`s (→ `/work-permit`, `/hire-workers`) + `Card` with `Timeline variant="horizontal"`; "Days 1–3" and "Weeks 4–8" are not in the package → `sys.workers.timeline.days1to3`, `sys.workers.timeline.arrival` (`{weeks}` = `firstDayWeeks`, W1's 6–8; hidden when unsigned) | 085–099 |
| 11 | FAQ (877–912): side column + ask card + 8-item accordion | `FaqBlock` (`openFirst`); pairs from `WORKERS_FAQ`: 210/211 only when `poolSigned` (live-sample + "200+" + "refreshed weekly", W6/D17); 218's and 221's answers exist only in the design's JS → the package's own twins `wp.350` and `hire.302` (both legal-flagged, so they pass the D8 APPROVE gate; CLAUDE.md: never mint an id for copy the package carries) | 100–104, 210–223, wp.350, hire.302, 050, 049, 224 |
| 12 | Closing CTA (915–928): h2, body, mobile button, WhatsApp, hiring request, licence line + mailto | `ClosingCtaBand id="pool-cta" tone="gradient"` + licence line with `ContactLink` mailto; 107 (mobile "Request these candidates") not rendered — it presupposes cards | 105, 106, 108, 109, 110 |
| 13 | Mobile floating filter pill + basket bottom bar (930–949) | not built (cards off); the chrome's `MobileBottomBar` stands | — |
| 14 | Footer (951–1059) | shared chrome | — |

Not rendered on purpose (Phase A): 031–038 (popular chips, trust chips with a hard-typed "4 h", collapsed-CTA labels, inline success), 039/040 (the kernel's `sys.form.consent.*` row replaces the design's consent sentence), 052–054, 059–071, 107, 138–140, 145, 152, 153 (the submit label is `FormShell`'s one static prop — 146 for both roles), 154–209, 225–233, 234–250.

---

#### Cycle 1 — `sys.workers.*` + `sys.seo.workers.*` copy; the pure page libs (`pool`, `options`, `message`, `content`)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/available-workers/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** The page's whole `sys.workers.*` set (W23) — a key added to the page is added here and to
 *  BOTH message files (`src/messages/messages.test.ts` proves the two files agree; this proves
 *  the page and the files agree). */
export const WORKERS_SYS_KEYS = [
  'pool.heading',
  'pool.intro',
  'empty.title',
  'empty.body',
  'empty.cta',
  'sticky.message',
  'form.titles.direct_employer',
  'form.startWhen.asap',
  'form.startWhen.month1',
  'form.startWhen.month3',
  'form.startWhen.flexible',
  'timeline.days1to3',
  'timeline.arrival',
] as const;

const flatten = (o: unknown, prefix = ''): string[] =>
  typeof o === 'object' && o !== null
    ? Object.entries(o).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k))
    : [prefix];

const get = (o: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (acc, k) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined),
      o,
    );

describe('sys.workers.* and sys.seo.workers.* (W6/W23)', () => {
  for (const [name, messages] of [
    ['tr', tr],
    ['en', en],
  ] as const) {
    it(`${name}: carries exactly the page's keys, none empty`, () => {
      const sys = messages.sys as Record<string, unknown>;
      expect(flatten(sys.workers).sort()).toEqual([...WORKERS_SYS_KEYS].sort());
      for (const key of WORKERS_SYS_KEYS) {
        const v = get(sys.workers, key);
        expect(typeof v, key).toBe('string');
        expect((v as string).trim().length, key).toBeGreaterThan(0);
        expect(v as string, key).not.toMatch(/undefined|\[object /);
      }
      const seo = get(sys, 'seo.workers') as { title: string; description: string };
      expect(seo.title.length).toBeGreaterThan(10);
      // A snippet-length description (docs/SEO.md): the design's own was ~300 chars.
      expect(seo.description.length).toBeGreaterThan(50);
      expect(seo.description.length).toBeLessThanOrEqual(160);
    });
  }

  it('the two ICU messages name their single argument (the metric the page fills, D17)', () => {
    for (const messages of [tr, en]) {
      const sys = messages.sys as Record<string, unknown>;
      expect(get(sys, 'workers.sticky.message')).toContain('{hours}');
      expect(get(sys, 'workers.timeline.arrival')).toContain('{weeks}');
    }
  });
});
```

`src/app/[locale]/(site)/available-workers/__tests__/pool.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { assertServableInProduction } from '@/content/pure';
import { testBundle } from '@/test/bundle';
import { POOL_CARDS, poolRows, poolSigned } from '../_lib/pool';

const POOL_FIXTURE = [
  { publicRef: 'JA-1042', trade: 'Welder', country: 'PK', availability: 'now' },
  { publicRef: 'JA-1050', trade: 'Cook', country: 'NP', availability: '30d' },
];

describe('pool gating (D2 / D23 / W6)', () => {
  it('per-profile cards are off at launch (the D2 switch is code, not content)', () => {
    expect(POOL_CARDS).toBe(false);
  });

  it('an absent or empty pool collection hides every pool-derived element', () => {
    expect(poolSigned(testBundle())).toBe(false);
    expect(poolRows(testBundle())).toEqual([]);
    expect(poolSigned(testBundle({ collections: { pool: [] } }))).toBe(false);
  });

  it('a LOCAL bundle carrying pool rows can never be served in production — the fixture cannot reach a visitor', () => {
    const b = testBundle({ collections: { pool: POOL_FIXTURE } });
    expect(poolSigned(b)).toBe(true);
    expect(poolRows(b)).toHaveLength(2);
    // Vercel sets NODE_ENV=production on previews too, so this is the preview rule as well.
    expect(() => assertServableInProduction(b, 'LOCAL', 'production')).toThrow(
      /never served from LOCAL/,
    );
    // The only lawful source of pool rows is the Operations bundle (Phase B / v1.1).
    expect(() => assertServableInProduction(b, 'OPS', 'production')).not.toThrow();
    expect(() => assertServableInProduction(b, 'LOCAL', 'development')).not.toThrow();
  });
});
```

`src/app/[locale]/(site)/available-workers/__tests__/message.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  composeWorkersMessage,
  MESSAGE_MAX,
  parseProfileRefs,
  PROFILE_REFS_PREFIX,
} from '../_lib/message';

describe('composeWorkersMessage — basket refs folded into `message` (W3)', () => {
  it('returns the trimmed message alone when there are no refs (Phase A: no basket)', () => {
    expect(composeWorkersMessage('  Two welders for Antalya.  ')).toBe('Two welders for Antalya.');
    expect(composeWorkersMessage('x', '')).toBe('x');
    expect(composeWorkersMessage('x', undefined)).toBe('x');
  });

  it('parses refs case-insensitively, de-duplicates, keeps order, drops junk', () => {
    expect(parseProfileRefs('ja-1042, JA-1050 ja-1042; JA-9; DROP TABLE; JA-1050')).toEqual([
      'JA-1042',
      'JA-1050',
    ]);
    expect(parseProfileRefs(undefined)).toEqual([]);
  });

  it('prepends the refs line, blank line, then the message', () => {
    expect(composeWorkersMessage('Two welders.', 'ja-1042, JA-1050')).toBe(
      `${PROFILE_REFS_PREFIX}JA-1042, JA-1050\n\nTwo welders.`,
    );
  });

  it('never exceeds the door cap (message ≤ 5000)', () => {
    const out = composeWorkersMessage('a'.repeat(6000), 'JA-1042');
    expect(out.length).toBe(MESSAGE_MAX);
    expect(out.startsWith(`${PROFILE_REFS_PREFIX}JA-1042`)).toBe(true);
  });
});
```

`src/app/[locale]/(site)/available-workers/__tests__/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { VERIFIED_STEPS, WORKERS_FAQ, workersFaqItems } from '../_lib/content';

// Every id the FAQ builder reads, as plain strings (no `{metric}` tokens — `makeTf` would ask
// the `metrics` collection for them, and this test is about pairing and gating, not metrics).
const STRINGS = Object.fromEntries(
  WORKERS_FAQ.flatMap((f) => [
    [f.q, `Q ${f.q}`],
    [f.a, `A ${f.a}`],
  ]),
);

describe('Available Workers FAQ (W6 / D17)', () => {
  it('hides the live-sample pair while the pool is unsigned and pairs the two JS-only answers with their package twins', () => {
    const items = workersFaqItems(testBundle({ strings: STRINGS }), 'en');
    expect(items.map((i) => i.id)).toEqual([
      'availworkers.212',
      'availworkers.214',
      'availworkers.216',
      'availworkers.218',
      'availworkers.219',
      'availworkers.221',
      'availworkers.222',
    ]);
    expect(items.find((i) => i.id === 'availworkers.218')?.a).toBe('A wp.350');
    expect(items.find((i) => i.id === 'availworkers.221')?.a).toBe('A hire.302');
    for (const it of items) {
      expect(it.q.startsWith('Q ')).toBe(true);
      expect(it.a.startsWith('A ')).toBe(true);
    }
  });

  it('shows all eight pairs once the pool is signed (the 210/211 "live sample" answer becomes true)', () => {
    const items = workersFaqItems(
      testBundle({ strings: STRINGS, collections: { pool: [{ publicRef: 'JA-1' }] } }),
      'en',
    );
    expect(items).toHaveLength(8);
    expect(items[0].id).toBe('availworkers.210');
  });

  it('the four vetting steps are numbered 1–4 over the package ids', () => {
    expect(VERIFIED_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4]);
    expect(VERIFIED_STEPS[0]).toEqual({ n: 1, titleId: 'availworkers.074', bodyId: 'availworkers.075' });
    expect(VERIFIED_STEPS[3]).toEqual({ n: 4, titleId: 'availworkers.080', bodyId: 'availworkers.082' });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/[locale]/(site)/available-workers"` → four files fail: `sys-keys` (`expected [] to deeply equal [ 'empty.body', … ]` — `sys.workers` is undefined), and `pool`/`message`/`content` fail at import (`Cannot find module '../_lib/pool'` etc.).

- [ ] **Step 3: Implement**

`src/messages/tr.json` — inside the existing `"seo": { … }` object add the `workers` entry, and after the `"thankYou": { … }` object add the `workers` object (keep the file's 2-space JSON style; Prettier owns the formatting):

```json
    "seo": {
      "ogTagline": "…(unchanged, Task 4)…",
      "workers": {
        "title": "Başlamaya hazır doğrulanmış işçiler | JobsAdmire",
        "description": "Beceri testli, belgeleri kontrol edilmiş, izne hazır adaylar. Pozisyonlarınızı yazın; kısa listeyi hazırlayıp her çalışma iznini İŞKUR lisansımızla sunalım."
      }
    },
```

```json
    "workers": {
      "pool": {
        "heading": "Aday havuzumuz",
        "intro": "Havuzdaki her aday beceri testinden geçer, belgeleri kontrol edilir ve çalışma iznine hazır hale getirilir. Profiller burada yayınlanana kadar ihtiyacınızı yazın; eşleşen adayları doğrudan size iletelim."
      },
      "empty": {
        "title": "Herkese açık profiller henüz yayında değil",
        "body": "Profiller, aday gizliliği (KVKK) ve iş ortaklarımızın onayı tamamlandıktan sonra bu sayfada görünecek. Talep formunu doldurun; tam CV'leri, belgeleri ve video mülakatları doğrudan sizinle paylaşalım.",
        "cta": "Talep formuna gidin"
      },
      "sticky": {
        "message": "İhtiyacınız olan pozisyonları yazın — {hours} saat içinde tam CV ve video mülakat."
      },
      "form": {
        "titles": {
          "direct_employer": "Havuzdan aday talep edin"
        },
        "startWhen": {
          "asap": "En kısa sürede",
          "month1": "1 ay içinde",
          "month3": "1–3 ay içinde",
          "flexible": "Esnek"
        }
      },
      "timeline": {
        "days1to3": "1–3. gün",
        "arrival": "{weeks}. hafta"
      }
    }
```

`src/messages/en.json` — the same two places:

```json
    "seo": {
      "ogTagline": "…(unchanged, Task 4)…",
      "workers": {
        "title": "Verified workers ready to start in Türkiye | JobsAdmire",
        "description": "Skill-tested, document-checked, permit-ready candidates. Tell us the roles you need — we shortlist and file every work permit under our İŞKUR licence."
      }
    },
```

```json
    "workers": {
      "pool": {
        "heading": "Our candidate pool",
        "intro": "Every candidate in the pool is skill-tested, document-checked and permit-ready. Until profiles are published here, tell us what you need and we send matching candidates to you directly."
      },
      "empty": {
        "title": "Public profiles are not published yet",
        "body": "Profiles appear on this page once candidate privacy (KVKK) and partner consent are in place. Fill in the request form and we share full CVs, documents and video interviews with you directly.",
        "cta": "Go to the request form"
      },
      "sticky": {
        "message": "Tell us the roles you need — full CV and video interview within {hours} hours."
      },
      "form": {
        "titles": {
          "direct_employer": "Request candidates from the pool"
        },
        "startWhen": {
          "asap": "As soon as possible",
          "month1": "Within a month",
          "month3": "In 1–3 months",
          "flexible": "Flexible"
        }
      },
      "timeline": {
        "days1to3": "Days 1–3",
        "arrival": "Weeks {weeks}"
      }
    }
```

(`form.titles` has only the employer entry on purpose: the HR-agency head is the package's own 148/149, and the employer head in the design — "Request these candidates" — presupposes visible cards, W6.)

`src/app/[locale]/(site)/available-workers/_lib/options.ts`:

```ts
/** The `iAm` values the Operations `workers` catalog accepts — the role chips send exactly these. */
export const ROLE_KEYS = ['direct_employer', 'hr_agency'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

/** Stable `startWhen` option keys (W3: values are keys, labels are `sys.workers.form.startWhen.*`).
 *  The door stores the key (≤ 120 chars) and the inbox shows it as typed. */
export const START_WHEN_KEYS = ['asap', 'month1', 'month3', 'flexible'] as const;
export type StartWhenKey = (typeof START_WHEN_KEYS)[number];
```

`src/app/[locale]/(site)/available-workers/_lib/message.ts`:

```ts
/** The door's `message` cap on the `workers` catalog entry. */
export const MESSAGE_MAX = 5000;
/** A public candidate reference as the design prints it (`JA-1042`). */
export const PROFILE_REF_PATTERN = /^JA-\d{3,6}$/;
/** Not visitor copy: the line is read by the sales team in the Operations inbox. */
export const PROFILE_REFS_PREFIX = 'Profiles: ';

/** Basket refs as one string (`ja-1042, JA-1050`) → upper-cased, de-duplicated, order kept;
 *  anything that is not a reference is dropped (the visitor's free text never rides here). */
export function parseProfileRefs(raw: string | undefined): string[] {
  if (!raw) return [];
  const out: string[] = [];
  for (const part of raw.split(/[,\s;]+/)) {
    const ref = part.trim().toUpperCase();
    if (PROFILE_REF_PATTERN.test(ref) && !out.includes(ref)) out.push(ref);
  }
  return out;
}

/** W3: the `workers` catalog has no field for basket refs, so they are folded into `message`
 *  as its first line. In Phase A there is no basket (cards off, D2) and `profileRefs` is never
 *  posted — the v1.1 cards task adds a hidden `profileRefs` input and nothing else changes. */
export function composeWorkersMessage(message: string, profileRefs?: string): string {
  const body = message.trim();
  const refs = parseProfileRefs(profileRefs);
  const text = refs.length ? `${PROFILE_REFS_PREFIX}${refs.join(', ')}\n\n${body}` : body;
  return text.length > MESSAGE_MAX ? text.slice(0, MESSAGE_MAX) : text;
}
```

`src/app/[locale]/(site)/available-workers/_lib/pool.ts`:

```ts
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** D2: per-profile cards are OFF at launch. Flipping this is the v1.1 cards task (partner
 *  notice + consent + DPIA), never a content edit. */
export const POOL_CARDS = false as const;

/** The raw `pool` rows. There is no `CollectionSchemas.pool` yet (T0b ships the eight Phase A
 *  collections); the v1.1 cards task adds the schema and this becomes `getCollection`. */
export function poolRows(bundle: Bundle): Record<string, unknown>[] {
  return bundle.collections.pool ?? [];
}

/** True only when the pool collection carries rows. Under LOCAL in production that is
 *  impossible by construction — `assertServableInProduction` (D23) throws before the page
 *  renders — so every pool-derived element on this page is hidden in Phase A (W6). */
export function poolSigned(bundle: Bundle): boolean {
  return poolRows(bundle).length > 0;
}
```

`src/app/[locale]/(site)/available-workers/_lib/content.ts`:

```ts
import { makeTf } from '@/content/pure';
import type { FaqItem, ProcessStep } from '@/design/blocks';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { poolSigned } from './pool';

/** "What verified means" (design lines 777–827): four checks. Step 4's "Goes live" badge
 *  (availworkers.081) is passed as `when` by the page — `ProcessStep.when` is a resolved string. */
export const VERIFIED_STEPS: readonly ProcessStep[] = [
  { n: 1, titleId: 'availworkers.074', bodyId: 'availworkers.075' },
  { n: 2, titleId: 'availworkers.076', bodyId: 'availworkers.077' },
  { n: 3, titleId: 'availworkers.078', bodyId: 'availworkers.079' },
  { n: 4, titleId: 'availworkers.080', bodyId: 'availworkers.082' },
];

/**
 * The FAQ pairs (design `faqData`, lines 1291–1300). Two answers exist only in the design's
 * JavaScript: 218 ("Who files the work permit…") and 221 ("What if the worker leaves…"). The
 * package carries the same copy under `wp.350` and `hire.302` — both legal-flagged, so they sit
 * behind the D8 APPROVE gate the JS-only text would have bypassed — and CLAUDE.md forbids minting
 * an id for copy the package already has. 210/211 promise a "live sample of our portal, refreshed
 * weekly" with a hard-typed "200+": shown only once the pool is signed (W6/D17).
 */
export const WORKERS_FAQ: readonly { q: string; a: string; live?: true }[] = [
  { q: 'availworkers.210', a: 'availworkers.211', live: true },
  { q: 'availworkers.212', a: 'availworkers.213' },
  { q: 'availworkers.214', a: 'availworkers.215' },
  { q: 'availworkers.216', a: 'availworkers.217' },
  { q: 'availworkers.218', a: 'wp.350' },
  { q: 'availworkers.219', a: 'availworkers.220' },
  { q: 'availworkers.221', a: 'hire.302' },
  { q: 'availworkers.222', a: 'availworkers.223' },
];

export function workersFaqItems(bundle: Bundle, locale: Locale): FaqItem[] {
  const tf = makeTf(bundle, locale);
  const live = poolSigned(bundle);
  return WORKERS_FAQ.filter((f) => live || !f.live).map((f) => ({
    id: f.q,
    q: tf(f.q),
    a: tf(f.a),
  }));
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/available-workers"` then `npx vitest run "src/app/[locale]/(site)/available-workers" src/messages` → the four new files green (10 tests) and `src/messages/messages.test.ts` green (identical key sets). `npm run verify` → green (typecheck: the JSON imports now carry `sys.workers`/`sys.seo.workers`; lint: no `content/local` or `design-package` import anywhere here).

- [ ] **Step 5: Commit**

```bash
git add src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/available-workers/_lib" "src/app/[locale]/(site)/available-workers/__tests__/sys-keys.test.ts" "src/app/[locale]/(site)/available-workers/__tests__/pool.test.ts" "src/app/[locale]/(site)/available-workers/__tests__/message.test.ts" "src/app/[locale]/(site)/available-workers/__tests__/content.test.ts"
git commit -m "feat(workers): sys.workers/sys.seo.workers copy and the page libs — pool gate (D2/D23), option keys, message folding, FAQ pairing

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — The `workers` form spec (Zod → exact catalog field names) and the `'use server'` action

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/available-workers/__tests__/spec.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { PROFILE_REFS_PREFIX } from '../_lib/message';
import { toWorkersFields, WORKERS_COUNTRY, WORKERS_SPEC, workersSchema } from '../_lib/spec';

/** The Operations `workers` catalog entry (website-form-catalog.ts, v1.0 + the T0f v1.1
 *  `city`). Anything outside this set is dropped by the door without an error — so the wire
 *  keys are asserted, not just the values. */
const CATALOG_WORKERS_FIELDS = new Set([
  'name',
  'company',
  'email',
  'phone',
  'country',
  'iAm',
  'trade',
  'headcount',
  'startWhen',
  'message',
  'city',
]);

const valid = {
  iAm: 'direct_employer',
  company: 'Antalya Otel A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 501 124 03 40',
  city: 'Antalya',
  sector: 'tourism',
  headcount: '12',
  startWhen: 'month1',
  message: 'Housekeeping and kitchen staff for the summer season.',
};

describe('workers form spec → Operations catalog `workers`', () => {
  it('sends exactly the catalog field names, stable option keys, and TR as the country', () => {
    const fields = toWorkersFields(workersSchema.parse(valid));
    expect(fields).toEqual({
      iAm: 'direct_employer',
      name: 'Ayşe Yılmaz',
      company: 'Antalya Otel A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 501 124 03 40',
      country: 'TR',
      city: 'Antalya',
      trade: 'tourism',
      headcount: '12',
      startWhen: 'month1',
      message: 'Housekeeping and kitchen staff for the summer season.',
    });
    expect(WORKERS_COUNTRY).toBe('TR');
    for (const k of Object.keys(fields)) expect(CATALOG_WORKERS_FIELDS.has(k), k).toBe(true);
    // The design's `sector` select has no catalog field on `workers`; it rides as `trade`.
    expect(fields).not.toHaveProperty('sector');
  });

  it('omits the optional fields the visitor left blank instead of sending empty strings', () => {
    const fields = toWorkersFields(
      workersSchema.parse({ ...valid, sector: '', headcount: '', startWhen: '' }),
    );
    expect(fields).not.toHaveProperty('trade');
    expect(fields).not.toHaveProperty('headcount');
    expect(fields).not.toHaveProperty('startWhen');
    expect(fields.city).toBe('Antalya');
  });

  it('folds basket refs into `message` (W3) and trims it', () => {
    const fields = toWorkersFields(
      workersSchema.parse({ ...valid, message: '  Two welders.  ', profileRefs: 'ja-1042, JA-1050' }),
    );
    expect(fields.message).toBe(`${PROFILE_REFS_PREFIX}JA-1042, JA-1050\n\nTwo welders.`);
  });

  it('requires role, name, company, email, phone, city and message; `.min(1)` precedes `.email()` so a blank email reads "required"', () => {
    for (const key of ['name', 'company', 'email', 'phone', 'city', 'message'] as const) {
      const r = workersSchema.safeParse({ ...valid, [key]: '' });
      expect(r.success, key).toBe(false);
      if (!r.success) expect(r.error.issues[0]?.code, key).toBe('too_small');
    }
    expect(workersSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, phone: '12 34' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, iAm: 'agency' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, sector: 'mining' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, headcount: '0' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, headcount: '10000' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, startWhen: 'tomorrow' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, message: 'x'.repeat(5001) }).success).toBe(false);
  });

  it('is the `workers` key with a consent checkbox (R55 / D11)', () => {
    expect(WORKERS_SPEC.key).toBe('workers');
    expect(WORKERS_SPEC.consent).toBe('checkbox');
    expect(WORKERS_SPEC.schema).toBe(workersSchema);
    expect(WORKERS_SPEC.toFields(workersSchema.parse(valid), new FormData())).toHaveProperty(
      'country',
      'TR',
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/[locale]/(site)/available-workers/__tests__/spec.test.ts"` → fails at import: `Cannot find module '../_lib/spec'`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/available-workers/_lib/spec.ts` (pure — no `server-only`, so it is unit-testable; `FormSpec` is a type-only import and is erased):

```ts
import { z } from 'zod';
import { SECTOR_KEYS } from '@/content/collections';
import type { FormSpec } from '@/forms/action';
import type { WireFields } from '@/forms/wire';
import { composeWorkersMessage } from './message';
import { ROLE_KEYS, START_WHEN_KEYS } from './options';

/** A `<select>` posts `''` for its placeholder option; the door treats `''` as absent, but the
 *  schema accepts it explicitly so the field never reads "invalid" to the visitor. */
const optionalKey = <T extends readonly [string, ...string[]]>(keys: T) =>
  z.enum(keys).or(z.literal('')).optional();

/** Field names are the FORM's (what `Field name=…` posts); `toWorkersFields` renames to the
 *  catalog's where they differ (`sector` → `trade`). `.min(1)` precedes `.email()` so an empty
 *  value reads `required`, not `email` (the kernel's `issueToCode` takes the first issue). */
export const workersSchema = z.object({
  iAm: z.enum(ROLE_KEYS),
  company: z.string().min(1).max(200),
  name: z.string().min(1).max(120),
  email: z.string().min(1).max(254).email(),
  phone: z
    .string()
    .min(1)
    .regex(/(\D*\d){8,}/, { message: 'phone' })
    .max(40),
  city: z.string().min(1).max(120),
  sector: optionalKey(SECTOR_KEYS),
  // ≤ 10 chars at the door; the UI bounds it to 1–9999 (`Field min/max`), the schema too.
  headcount: z
    .string()
    .regex(/^[1-9]\d{0,3}$/)
    .or(z.literal(''))
    .optional(),
  startWhen: optionalKey(START_WHEN_KEYS),
  message: z.string().min(1).max(5000),
  /** Basket refs (v1.1 cards task); never posted in Phase A. */
  profileRefs: z.string().max(500).optional(),
});
export type WorkersInput = z.infer<typeof workersSchema>;

/** The design's "City in Turkey" field implies the country; the catalog's optional `country`
 *  is sent so the inbox classification never has to guess. */
export const WORKERS_COUNTRY = 'TR';

/** EXACT Operations `workers` catalog names (v1.0 + v1.1 `city`); a blank optional is omitted,
 *  never sent as `''`. `sector` travels as `trade` — the only role/sector slot `workers` has. */
export function toWorkersFields(p: WorkersInput): WireFields {
  const fields: WireFields = {
    iAm: p.iAm,
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: WORKERS_COUNTRY,
    city: p.city,
    message: composeWorkersMessage(p.message, p.profileRefs),
  };
  if (p.sector) fields.trade = p.sector;
  if (p.headcount) fields.headcount = p.headcount;
  if (p.startWhen) fields.startWhen = p.startWhen;
  return fields;
}

export const WORKERS_SPEC: FormSpec<typeof workersSchema> = {
  key: 'workers',
  schema: workersSchema,
  toFields: (p) => toWorkersFields(p),
  consent: 'checkbox',
};
```

`src/app/[locale]/(site)/available-workers/actions.ts`:

```ts
'use server';
import { createFormAction, type FormActionState } from '@/forms/action';
import { WORKERS_SPEC } from './_lib/spec';

const run = createFormAction(WORKERS_SPEC);

/** The Available Workers request → Operations `POST /api/website/v1/forms/workers` (INQUIRY).
 *  Success redirects to `/tesekkurler?form=workers` (D13); every failure is the kernel's
 *  fallback panel (D11). A `'use server'` module may export only async functions, which is why
 *  the factory call sits outside (T0a deviation 1). */
export async function submitWorkers(prev: FormActionState, data: FormData) {
  return run(prev, data);
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/available-workers"` then `npx vitest run "src/app/[locale]/(site)/available-workers"` → 5 files, 15 tests green. `npm run verify` → green (`actions.ts` compiles against `createFormAction`; `next build` is not part of verify — the `'use server'` export shape is proven by Cycle 4's build).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/available-workers/_lib/spec.ts" "src/app/[locale]/(site)/available-workers/actions.ts" "src/app/[locale]/(site)/available-workers/__tests__/spec.test.ts"
git commit -m "feat(workers): form spec — Zod to the exact workers catalog fields (sector→trade, city v1.1, TR country) and the submitWorkers action

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — Islands: `RequestFormFields` (role chips → `iAm`, role-dependent head/placeholders) and `PoolAggregate` (null while the pool is empty)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/available-workers/__tests__/RequestFormFields.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { RequestFormFields, type RequestFormFieldsProps } from '../_components/RequestFormFields';

const props: RequestFormFieldsProps = {
  legend: 'I am',
  roles: {
    direct_employer: {
      tab: 'Employer',
      title: 'Request candidates from the pool',
      subtitle: 'Full CVs within 4 working hours.',
      companyPlaceholder: 'Company name',
      messagePlaceholder: 'Which roles and how many workers?',
    },
    hr_agency: {
      tab: 'HR agency',
      title: 'Supply for your clients',
      subtitle: 'We supply the workers and file the permits.',
      companyPlaceholder: 'Agency name',
      messagePlaceholder: 'Which roles do your clients need, and what volume?',
    },
  },
  placeholders: { name: 'Contact person', email: 'Email', phone: 'Phone / WhatsApp', city: 'City in Turkey' },
  sectorOptions: [
    { value: 'factory', label: 'Factory / Manufacturing' },
    { value: 'tourism', label: 'Tourism / Hospitality' },
  ],
  startWhenOptions: [
    { value: 'asap', label: 'As soon as possible' },
    { value: 'month1', label: 'Within a month' },
  ],
};

describe('RequestFormFields', () => {
  it('posts every catalog-backed field under its form name, employer selected by default', () => {
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    for (const name of [
      'company',
      'name',
      'email',
      'phone',
      'city',
      'sector',
      'headcount',
      'startWhen',
      'message',
    ])
      expect(container.querySelector(`[name="${name}"]`), name).not.toBeNull();
    expect(screen.getByRole('radio', { name: 'Employer' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'HR agency' })).not.toBeChecked();
    expect(screen.getByRole('heading', { level: 2, name: 'Request candidates from the pool' })).toBeInTheDocument();
    expect(container.querySelector('[name="company"]')).toHaveAttribute('placeholder', 'Company name');
    // `sector`/`startWhen` are real <select>s with the kernel's placeholder option first.
    expect(container.querySelectorAll('select[name="sector"] option')).toHaveLength(3);
    expect(container.querySelector('input[name="headcount"]')).toHaveAttribute('type', 'number');
  });

  it('switching the role swaps the head, the company placeholder and the message placeholder', async () => {
    const user = userEvent.setup();
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    await user.click(screen.getByRole('radio', { name: 'HR agency' }));
    expect(screen.getByRole('radio', { name: 'HR agency' })).toBeChecked();
    expect(screen.getByRole('heading', { level: 2, name: 'Supply for your clients' })).toBeInTheDocument();
    expect(container.querySelector('[name="company"]')).toHaveAttribute('placeholder', 'Agency name');
    expect(container.querySelector('[name="message"]')).toHaveAttribute(
      'placeholder',
      'Which roles do your clients need, and what volume?',
    );
    // The radio group is what the form posts as `iAm` — no hidden input, no duplicate.
    expect(container.querySelectorAll('[name="iAm"]')).toHaveLength(2);
  });
});
```

`src/app/[locale]/(site)/available-workers/__tests__/PoolAggregate.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { PoolAggregate, poolStats } from '../_components/PoolAggregate';

const STRINGS = {
  'availworkers.055': 'CVs in our portal',
  'availworkers.056': 'ready to start now',
  'availworkers.057': 'countries listed',
  'availworkers.058': 'professions listed',
};
const ROWS = [
  { publicRef: 'JA-1', trade: 'Welder', country: 'PK', availability: 'now' },
  { publicRef: 'JA-2', trade: 'Welder', country: 'NP', availability: '30d' },
  { publicRef: 'JA-3', trade: 'Cook', country: 'PK', availability: 'now' },
  { publicRef: 'JA-4' }, // a row without facets still counts as a CV
];

describe('PoolAggregate (W6 — the aggregate strip renders by data)', () => {
  it('renders nothing while the pool collection is empty (Phase A, and LOCAL in production)', () => {
    const { container } = render(<PoolAggregate bundle={testBundle({ strings: STRINGS })} locale="en" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('derives the four counts from rows and never prints a freshness claim (D17)', () => {
    expect(poolStats(ROWS)).toEqual({ total: 4, ready: 2, countries: 2, trades: 2 });
    render(
      <PoolAggregate bundle={testBundle({ strings: STRINGS, collections: { pool: ROWS } })} locale="en" />,
    );
    expect(screen.getByTestId('pool-aggregate')).toBeInTheDocument();
    expect(screen.getByText('CVs in our portal')).toBeInTheDocument();
    expect(screen.getByText('professions listed')).toBeInTheDocument();
    expect(screen.queryByText(/weekly|haftalık/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/[locale]/(site)/available-workers/__tests__/RequestFormFields.test.tsx" "src/app/[locale]/(site)/available-workers/__tests__/PoolAggregate.test.tsx"` → both fail at import (`Cannot find module '../_components/…'`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/available-workers/_components/RequestFormFields.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { RadioChips } from '@/design/primitives';
import { Field, type FieldOption } from '@/forms/client/Field';
import { useFieldValue } from '@/forms/client/FormErrorsContext';
import { ROLE_KEYS, type RoleKey } from '../_lib/options';

export type RoleCopy = {
  tab: string;
  title: string;
  subtitle: string;
  companyPlaceholder: string;
  messagePlaceholder: string;
};

/** Every label is a prop (W9): the island reads no bundle and no package id — the page
 *  resolves the copy and hands it down; `Field` reads its own `sys.form.*` label by name (W30). */
export type RequestFormFieldsProps = {
  legend: string;
  roles: Record<RoleKey, RoleCopy>;
  placeholders: { name: string; email: string; phone: string; city: string };
  sectorOptions: FieldOption[];
  startWhenOptions: FieldOption[];
};

const isRole = (v: string | undefined): v is RoleKey => ROLE_KEYS.includes(v as RoleKey);

/**
 * The design's two role tabs (Employer | HR agency, lines 524–528 / 1407–1421) swapping one
 * form's head and placeholders. Built as a `RadioChips` group named `iAm` — the value the
 * Operations `workers` catalog expects — so the choice is posted by the form itself, survives a
 * failed submit (`useFieldValue` echoes it), and needs no hidden input. Lives inside `FormShell`
 * (above the fold), so it is a plain client import, not `next/dynamic` (W13).
 */
export function RequestFormFields({
  legend,
  roles,
  placeholders,
  sectorOptions,
  startWhenOptions,
}: RequestFormFieldsProps) {
  const echoed = useFieldValue('iAm');
  const [role, setRole] = useState<RoleKey>(() => (isRole(echoed) ? echoed : 'direct_employer'));
  const copy = roles[role];
  return (
    <>
      {/* The gradient head: `blue-safe` → `navy`, not the design's raw brand blue — white on
          #1899d5 is 3.2:1 and this subtitle is body-small (D20). Negative margins undo the
          shell's `p-6` so the band bleeds to the card's edge. */}
      <div
        data-testid="workers-form-head"
        className="-mx-6 -mt-6 bg-gradient-to-br from-blue-safe to-navy px-6 py-4 text-white"
      >
        <h2 className="text-card-title m-0 mb-1 text-white">{copy.title}</h2>
        <p className="text-body-sm m-0 text-white/90">{copy.subtitle}</p>
      </div>
      <RadioChips
        name="iAm"
        legend={legend}
        legendHidden
        value={role}
        onChange={(v) => {
          if (isRole(v)) setRole(v);
        }}
        options={ROLE_KEYS.map((k) => ({ value: k, label: roles[k].tab }))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="company"
          required
          autoComplete="organization"
          placeholder={copy.companyPlaceholder}
        />
        <Field name="name" required autoComplete="name" placeholder={placeholders.name} />
        <Field
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={placeholders.email}
        />
        <Field
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder={placeholders.phone}
        />
        <Field name="city" required autoComplete="address-level2" placeholder={placeholders.city} />
        <Field name="sector" as="select" options={sectorOptions} />
        <Field name="headcount" type="number" inputMode="numeric" min={1} max={9999} />
        <Field name="startWhen" as="select" options={startWhenOptions} />
      </div>
      <Field name="message" as="textarea" rows={3} required placeholder={copy.messagePlaceholder} />
    </>
  );
}
```

(If the primitives barrel does not export `RadioChips` in the tree you are on, import it from `'@/design/primitives/RadioChips'` — Task 5's Produces lists it under `src/design/primitives`; do not add a second component.)

`src/app/[locale]/(site)/available-workers/_components/PoolAggregate.tsx` (server component — no directive, no hooks):

```tsx
import { z } from 'zod';
import { makeTf } from '@/content/pure';
import { Stat } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { poolRows } from '../_lib/pool';

/** Provisional row shape for the counts only — the v1.1 cards task moves the real schema into
 *  `CollectionSchemas.pool`. A row that does not parse still counts as a CV; unknown keys pass. */
const PoolRowSchema = z
  .object({
    trade: z.string().optional(),
    country: z.string().optional(),
    availability: z.string().optional(),
  })
  .passthrough();

export function poolStats(rows: Record<string, unknown>[]) {
  const parsed = rows.map((r) => PoolRowSchema.safeParse(r)).flatMap((r) => (r.success ? [r.data] : [{}]));
  const distinct = (pick: (r: (typeof parsed)[number]) => string | undefined) =>
    new Set(parsed.map(pick).filter((v): v is string => Boolean(v))).size;
  return {
    total: parsed.length,
    ready: parsed.filter((r) => r.availability === 'now').length,
    countries: distinct((r) => r.country),
    trades: distinct((r) => r.trade),
  };
}

/**
 * The design's stats strip (lines 618–624): "200+ CVs in our portal · ready to start now ·
 * countries listed · professions listed · Updated weekly". W1/W6: no pool number is signed and
 * "200+" is not a metric key, so the strip renders ONLY from pool rows — which a LOCAL bundle can
 * never carry in production (D23) — and never the "Updated weekly" pill (a cadence claim with
 * no source, D17). Returns null while the collection is empty: hidden by data, not deleted.
 */
export function PoolAggregate({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const rows = poolRows(bundle);
  if (rows.length === 0) return null;
  const tf = makeTf(bundle, locale);
  const s = poolStats(rows);
  return (
    <div
      data-testid="pool-aggregate"
      className="mb-6 grid gap-5 rounded-lg border border-border-2 bg-pale-1 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      <Stat value={s.total} label={tf('availworkers.055')} locale={locale} />
      <Stat value={s.ready} label={tf('availworkers.056')} locale={locale} />
      <Stat value={s.countries} label={tf('availworkers.057')} locale={locale} />
      <Stat value={s.trades} label={tf('availworkers.058')} locale={locale} />
    </div>
  );
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/available-workers"` then `npx vitest run "src/app/[locale]/(site)/available-workers"` → 7 files, 19 tests green (the island test renders under the real `sys.form.*` labels through `renderWithIntl`; `useFieldValue` outside a shell reads the context's empty default). `npm run verify` → green — in particular `eslint-config-next` 16's React Compiler rules: no state set in an effect, no ref read during render (the role state is seeded by the `useState` initialiser).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/available-workers/_components" "src/app/[locale]/(site)/available-workers/__tests__/RequestFormFields.test.tsx" "src/app/[locale]/(site)/available-workers/__tests__/PoolAggregate.test.tsx"
git commit -m "feat(workers): RequestFormFields island (role chips → iAm) and PoolAggregate (null while the pool is empty, W6)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — The page: metadata + seven sections; `UNBUILT_PATHNAMES` entry deleted (W20); gate route rows (W21); `e2e/pages/workers.spec.ts`

- [ ] **Step 1: Write the failing test**

`e2e/routes.ts` — in `GATE_ROUTE_TABLE`, insert before the line `// The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.`:

```ts
  { path: '/adaylar', indexable: true },
  { path: '/en/available-workers', indexable: true },
```

`e2e/pages/workers.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const ROUTES = { tr: '/adaylar', en: '/en/available-workers' } as const;
// A `{placed}`-style token = an unfilled W1 metric placeholder; `undefined` = a missing package
// id rendered in production mode (makeT degrades to '' there, but a template literal would not).
const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;
const FALLBACK_KINDS = ['invalid', 'captcha', 'off', 'tripped', 'unauthorized', 'unavailable', 'failed'];

for (const [locale, route] of Object.entries(ROUTES) as ['tr' | 'en', string][]) {
  test(`${route}: one h1, the designed sections, no pool-derived element, no leaked token`, async ({
    page,
  }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);

    // Page-markup contract (docs/ARCHITECTURE.md § Quality gate): one h1, tagged, the LCP slot
    // is the h1 (gradient auto-default, §10 row 4), the hero photo is a NAMED placeholder.
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1[data-testid="page-h1"][data-lcp-slot="h1"]')).toHaveCount(1);
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder="aw-hero"]')).toHaveCount(1);

    // Sections in the design's order, by the ids/test ids the page contract names.
    for (const id of ['pool-form', 'pool', 'verified-steps', 'faq', 'pool-cta'])
      await expect(page.locator(`#${id}`), id).toHaveCount(1);
    await expect(page.getByTestId('workers-form')).toBeVisible();
    await expect(page.getByTestId('workers-form-head')).toBeVisible();
    await expect(page.getByTestId('pool-empty')).toBeVisible();
    await expect(page.getByTestId('after-you-pick')).toBeVisible();
    await expect(page.locator('#verified-steps li')).toHaveCount(4);
    await expect(page.locator('[data-testid="after-you-pick"] ol li')).toHaveCount(4);
    // Seven FAQ triggers in Phase A (210/211 hidden while the pool is unsigned).
    await expect(page.locator('#faq [data-accordion-trigger]')).toHaveCount(7);
    // The header CTA table points at #pool (W17) — the id must exist on this page.
    await expect(page.locator('#pool')).toHaveCount(1);

    // W6/D2/D23: nothing pool-derived renders — no live badge, no aggregate strip, no cards.
    await expect(page.getByTestId('pool-live')).toHaveCount(0);
    await expect(page.getByTestId('pool-aggregate')).toHaveCount(0);

    // JSON-LD this page adds: BreadcrumbList + FAQPage (site-wide Organization is the layout's).
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((s) => s.includes('"BreadcrumbList"'))).toBe(true);
    expect(ld.some((s) => s.includes('"FAQPage"'))).toBe(true);

    expect(await page.locator('main').innerText()).not.toMatch(LEAK);
  });
}

test('the request form: a valid submission reaches the visitor fallback panel (door unconfigured) or the conversion page (door on)', async ({
  page,
}) => {
  await page.goto('/adaylar');
  const form = page.getByTestId('workers-form');
  await form.locator('[name="company"]').fill('Test Otel A.Ş.');
  await form.locator('[name="name"]').fill('Gate Runner');
  await form.locator('[name="email"]').fill('gate@example.com');
  await form.locator('[name="phone"]').fill('+90 501 124 03 40');
  await form.locator('[name="city"]').fill('Antalya');
  await form.locator('[name="sector"]').selectOption('tourism');
  await form.locator('[name="headcount"]').fill('3');
  await form.locator('[name="startWhen"]').selectOption('month1');
  await form.locator('[name="message"]').fill('Gate run — please ignore.');
  await form.locator('[name="consent"]').check();
  await form.locator('button[type="submit"]').click();

  // Deterministic without a door: `doorConfig()` is null → `{ kind: 'unauthorized' }` without a
  // network call → the panel. With the door on (staging), the D13 redirect is the other lawful
  // outcome; a spinner or a silent stay on the page is the failure this test exists to catch.
  const panel = page.getByTestId('form-fallback');
  await expect
    .poll(
      async () => (await panel.count()) > 0 || /tesekkurler|thank-you/.test(page.url()),
      { timeout: 15_000 },
    )
    .toBe(true);
  if (/tesekkurler|thank-you/.test(page.url())) {
    expect(new URL(page.url()).searchParams.get('form')).toBe('workers');
  } else {
    await expect(panel).toBeVisible();
    expect(FALLBACK_KINDS).toContain(await panel.getAttribute('data-kind'));
    // D11: the WhatsApp door is always offered, prefilled with what was typed.
    await expect(panel.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
  }
});

test('the language links keep the visitor on the page (W17)', async ({ page }) => {
  await page.goto('/adaylar');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://www.jobsadmire.com/en/available-workers',
  );
  // The switcher anchor is in the DOM at every viewport (hidden by CSS below lg). Before
  // hydration it is next-intl's `/en/available-workers`; after, the tag-derived path — same.
  await expect(page.locator('a[hreflang="en"]').first()).toHaveAttribute(
    'href',
    /\/en\/available-workers$/,
  );
  await page.goto('/en/available-workers');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  // `/tr/adaylar` (next-intl's prefixed fallback, folded by the middleware) or `/adaylar`.
  await expect(page.locator('a[hreflang="tr"]').first()).toHaveAttribute('href', /\/adaylar$/);
});
```

- [ ] **Step 2: Run to verify it fails**

One job at a time (the Mac Studio memory rule): `npm run build && npx next start -p 3100` in one terminal, then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/workers.spec.ts --project=desktop` → every case fails: `/adaylar` answers **404** through the `[...rest]` catch-all (`expect(res?.status()).toBe(200)` → 404), the form test finds no `workers-form`. Also `npx vitest run src/lib/seo/unbuilt.test.ts` is still green at this point (the set and the filesystem agree: no page, key present) — it is the guard that must STAY green after Step 3.

- [ ] **Step 3: Implement**

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` literal (`new Set<keyof typeof pathnames>([ … ])`), delete the line:

```ts
  '/available-workers',
```

`src/app/[locale]/(site)/available-workers/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import {
  Breadcrumbs,
  ClosingCtaBand,
  ContactCta,
  EmptyState,
  FaqBlock,
  ImageSlot,
  ProcessSteps,
} from '@/design/blocks';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { Button, Card, Eyebrow, Section, Timeline, type TimelineStep } from '@/design/primitives';
import { FormShell } from '@/forms/client/FormShell';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { mailLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { PoolAggregate } from './_components/PoolAggregate';
import { RequestFormFields } from './_components/RequestFormFields';
import { VERIFIED_STEPS, workersFaqItems } from './_lib/content';
import { START_WHEN_KEYS } from './_lib/options';
import { poolSigned } from './_lib/pool';
import { submitWorkers } from './actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  // The package has no SEO string for this page (only Hire Workers and Partner have one), so
  // `bundle.pages.workers` carries '' ids and the sys.seo.workers.* fallbacks stand (W23/W38).
  return buildMetadata({
    locale,
    href: '/available-workers',
    bundle,
    pageKey: 'workers',
    fallbackTitle: sys('seo.workers.title'),
    fallbackDescription: sys('seo.workers.description'),
  });
}

/**
 * Available Workers (design: `design-package/design/Available Workers.dc.html`). Phase A ships
 * the request form, the vetting steps, the after-you-pick timeline, the FAQ and the closing
 * band. Everything the design derives from the candidate pool — the "live" badge, the popular
 * chips, the stats strip, the cards/filters/basket — renders by data and is therefore absent
 * here: `pool` is a FIXTURE_ONLY collection that LOCAL can never serve in production (D23), and
 * per-profile cards are off behind `pool.cards` (D2). No `<main>` — `SiteChrome` owns it (R31).
 */
export default async function AvailableWorkers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const tf = makeTf(bundle, locale); // W1/D17: re-authored ids carry {metric} tokens
  const metrics = metricValues(bundle, locale);
  const { settings } = bundle;
  const live = poolSigned(bundle);
  // One catalogued WhatsApp prefill for the page's hire-intent doors (availworkers.224); the
  // design's seven hard-coded English texts are not ported.
  const waHire = waLink(settings.whatsappNumber, tf('availworkers.224'));
  const sectorOptions = getCollection(bundle, 'sectors').map((s) => ({
    value: s.key,
    label: tf(s.labelId),
  }));
  const startWhenOptions = START_WHEN_KEYS.map((k) => ({
    value: k,
    label: sys(`workers.form.startWhen.${k}`),
  }));
  // After you pick (design lines 829–875). "Days 1–3" / "Weeks 4–8" are not in the package;
  // the arrival badge renders W1's `firstDayWeeks` and hides when the metric is unsigned (D17).
  const afterSteps: TimelineStep[] = [
    { when: tf('availworkers.091'), title: tf('availworkers.090'), body: tf('availworkers.092') },
    {
      when: sys('workers.timeline.days1to3'),
      title: tf('availworkers.093'),
      body: tf('availworkers.094'),
    },
    { when: tf('availworkers.096'), title: tf('availworkers.095'), body: tf('availworkers.097') },
    {
      when: metrics.firstDayWeeks
        ? sys('workers.timeline.arrival', { weeks: metrics.firstDayWeeks })
        : undefined,
      title: tf('availworkers.098'),
      body: tf('availworkers.099'),
    },
  ];

  return (
    <>
      {/* 2 — Hero (design 474–504) + 3 — the request form card (506–578) */}
      <Section tone="dark" className="relative overflow-hidden">
        {/* The hero photo slot: a named placeholder (gradient auto-default, §10 row 4) — never
            the LCP (D26), decorative (alt ""), faded under the design's two navy overlays. */}
        <div aria-hidden="true" className="absolute inset-0 opacity-15">
          <ImageSlot slot="aw-hero" alt="" width={1280} height={640} className="h-full" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/75"
        />
        <div className="container-site relative grid items-center gap-11 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <Breadcrumbs
              locale={locale}
              tone="dark"
              className="mb-4"
              items={[
                { name: tf('availworkers.021'), href: '/' },
                { name: tf('availworkers.022'), href: '/available-workers' },
              ]}
            />
            {live && (
              <span
                data-testid="pool-live"
                className="mb-4 inline-flex items-center gap-2 rounded-pill border border-success/35 bg-success/10 px-4 py-1.5 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-success-surface"
              >
                <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
                {tf('availworkers.023')}
              </span>
            )}
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="text-h1 m-0 mb-4 leading-[1.02] tracking-[-0.03em] text-white"
            >
              {tf('availworkers.024')} <span className="text-sky">{tf('availworkers.025')}</span>{' '}
              {tf('availworkers.026')}
            </h1>
            <p className="text-body-lg m-0 mb-6 max-w-[520px] text-white/80">
              {tf('availworkers.027')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href="#pool">
                {tf('availworkers.028')}
              </Button>
              <ContactCta
                placement="page_cta"
                variant="secondary"
                size="lg"
                external
                href={waHire}
                className="border-success-border bg-success-surface text-success-text hover:bg-white"
              >
                {tf('availworkers.029')}
              </ContactCta>
            </div>
            <p className="text-body-sm m-0 mt-5 max-w-[480px] text-white/55">
              {tf('availworkers.030')}
            </p>
          </div>

          <div
            id="pool-form"
            className="overflow-hidden rounded-hero border border-white/10 bg-white text-ink shadow-hero-form"
          >
            <FormShell
              action={submitWorkers}
              formKey="workers"
              locale={locale}
              turnstileSiteKey={settings.turnstileSiteKey}
              whatsappNumber={settings.whatsappNumber}
              contact={{
                phone: settings.phone,
                phoneDisplay: settings.phoneDisplay,
                email: settings.email,
              }}
              submitLabel={tf('availworkers.146')}
              consent="checkbox"
              consentLinkHref="/privacy"
              testId="workers-form"
              className="p-6"
            >
              <RequestFormFields
                legend={sys('form.labels.iAm')}
                roles={{
                  direct_employer: {
                    tab: tf('availworkers.141'),
                    title: sys('workers.form.titles.direct_employer'),
                    subtitle: tf('availworkers.142'),
                    companyPlaceholder: tf('availworkers.143'),
                    messagePlaceholder: tf('availworkers.144'),
                  },
                  hr_agency: {
                    tab: tf('availworkers.147'),
                    title: tf('availworkers.148'),
                    subtitle: tf('availworkers.149'),
                    companyPlaceholder: tf('availworkers.150'),
                    messagePlaceholder: tf('availworkers.151'),
                  },
                }}
                placeholders={{
                  name: tf('availworkers.044'),
                  email: tf('availworkers.045'),
                  phone: tf('availworkers.046'),
                  city: tf('availworkers.047'),
                }}
                sectorOptions={sectorOptions}
                startWhenOptions={startWhenOptions}
              />
            </FormShell>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-3 px-6 py-3 text-body-sm text-text-tertiary">
              <ContactLink
                href={waHire}
                placement="page_cta"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-success-text"
              >
                {tf('availworkers.041')}
              </ContactLink>
              <span>
                {tf('availworkers.042')}{' '}
                <Link href="/partner-with-us" className="font-extrabold text-blue-safe">
                  {tf('availworkers.043')}
                </Link>
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* 4 — Sticky desktop bar (design 583–597). 048 presupposes a visible profile, so the
          message is sys copy with the reply-time metric; the bar renders only `Button`s, so
          the design's Call / WhatsApp buttons (which need contact tracking, W12) stay out of it
          and live in the closing band and the FAQ card instead. Hidden while the metric is
          unsigned (D17). */}
      {metrics.homepageReplyHours ? (
        <StickyCtaBar
          message={sys('workers.sticky.message', { hours: metrics.homepageReplyHours })}
          ctas={[{ label: tf('availworkers.051'), href: '#pool-form' }]}
          hideNearId="pool-cta"
        />
      ) : null}

      {/* 5–8 — The pool (design 598–769): the header CTA table targets #pool (W17). Phase A
          renders the aggregate strip by data (null) and the designed empty state; the cards,
          filters, basket and the "Can't see the profession" card are the v1.1 cards task. */}
      <Section tone="light" id="pool" className="scroll-mt-5">
        <div className="container-site">
          <div className="mb-6 max-w-[560px]">
            <h2 className="text-h2 m-0 mb-3">{sys('workers.pool.heading')}</h2>
            <p className="text-body m-0 text-text-secondary">{sys('workers.pool.intro')}</p>
          </div>
          <PoolAggregate bundle={bundle} locale={locale} />
          {!live && (
            <EmptyState
              testId="pool-empty"
              tone="pale"
              title={sys('workers.empty.title')}
              body={sys('workers.empty.body')}
              cta={{ label: sys('workers.empty.cta'), href: '#pool-form' }}
            />
          )}
        </div>
      </Section>

      {/* 9 — What "verified" means (design 777–827) */}
      <Section tone="pale">
        <div className="container-site">
          <h2 className="text-h2 m-0 mb-3 text-center">{tf('availworkers.072')}</h2>
          <p className="text-body m-0 mx-auto mb-10 max-w-[580px] text-center text-text-secondary">
            {tf('availworkers.073')}
          </p>
          <ProcessSteps
            id="verified-steps"
            bundle={bundle}
            locale={locale}
            variant="cards"
            steps={VERIFIED_STEPS.map((s) =>
              s.n === 4 ? { ...s, when: tf('availworkers.081') } : s,
            )}
          />
          <p className="text-body-sm mx-auto mt-7 max-w-[640px] rounded-sm border border-border-2 bg-white px-5 py-3 text-center text-text-secondary">
            {tf('availworkers.083')} <strong className="text-ink">{tf('availworkers.084')}</strong>
          </p>
        </div>
      </Section>

      {/* 10 — After you pick (design 829–875) */}
      <Section tone="light">
        <div
          data-testid="after-you-pick"
          className="container-site grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14"
        >
          <div>
            <Eyebrow>{tf('availworkers.085')}</Eyebrow>
            <h2 className="text-h2 mt-3 mb-3">{tf('availworkers.086')}</h2>
            <p className="text-body m-0 mb-6 text-text-secondary">{tf('availworkers.087')}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" href="/work-permit">
                {tf('availworkers.088')}
              </Button>
              <Button variant="primary" href="/hire-workers">
                {tf('availworkers.089')}
              </Button>
            </div>
          </div>
          <Card className="shadow-[0_20px_50px_rgba(22,60,90,0.10)]">
            <Timeline variant="horizontal" steps={afterSteps} />
          </Card>
        </div>
      </Section>

      {/* 11 — FAQ (design 877–912): side column + ask card + accordion; FAQPage node inside */}
      <Section tone="pale">
        <div className="container-site">
          <FaqBlock
            bundle={bundle}
            locale={locale}
            id="faq"
            eyebrowId="availworkers.100"
            headingId="availworkers.101"
            bodyId="availworkers.102"
            items={workersFaqItems(bundle, locale)}
            openFirst
            askCard={{
              titleId: 'availworkers.103',
              bodyId: 'availworkers.104',
              whatsappNumber: settings.whatsappNumber,
              whatsappText: tf('availworkers.224'),
              whatsappLabelId: 'availworkers.050',
              phone: settings.phone,
              callLabelId: 'availworkers.049',
            }}
          />
        </div>
      </Section>

      {/* 12 — Closing band (design 915–928) + the licence line with its tracked mailto */}
      <Section tone="band">
        <div className="container-site">
          <ClosingCtaBand
            id="pool-cta"
            bundle={bundle}
            locale={locale}
            tone="gradient"
            titleId="availworkers.105"
            bodyId="availworkers.106"
            primary={{ label: tf('availworkers.108'), href: waHire, external: true }}
            secondary={{ label: tf('availworkers.109'), href: '/hire-workers' }}
          />
          <p className="text-body-sm m-0 mt-6 text-center text-text-tertiary">
            {tf('availworkers.110')}{' '}
            <ContactLink
              href={mailLink(settings.email)}
              placement="page_cta"
              className="font-bold text-blue-safe"
            >
              {settings.email}
            </ContactLink>
          </p>
        </div>
      </Section>
    </>
  );
}
```

Notes for the implementer:
- Every package id goes through `tf` (`makeTf`), never `makeT`: 038/048/067/071/106/142/220 carry `{metric}` tokens after T0b, and `fill` throws in dev on an unfilled one — which is the desired failure.
- The three H1 fragments (024/025/026) are the package's own split; nothing else is composed from fragments (W23). 042 + 043 are likewise two package strings side by side.
- `Button href="#pool"` / `href="#pool-form"` render plain same-page anchors (R22 branch: not `/`-rooted); `Button href="/work-permit"` and `"/hire-workers"` render the typed next-intl `Link`.
- `ContactCta`/`ContactLink` carry `placement="page_cta"` on every `wa.me`/`mailto:`/`tel:` door on this page (hero WhatsApp, form footer WhatsApp, FAQ ask card WhatsApp + call, closing WhatsApp, licence e-mail) — the only events this page fires beside the kernel's (`form_fallback`, `generate_lead`/`conversion`).
- `bg-gradient-to-r from-navy …` overlays a faint `ImageSlot` gradient: the LCP is the h1 text block (named `h1`); the placeholder counter (T0e) sees `data-placeholder="aw-hero"` on a non-LCP element and `data-lcp-slot="h1"` once.
- Do not reach for `getMetric` here: `metricValues` already formats per locale; a missing value hides the sticky bar / the arrival badge instead of printing an empty string (D17).

- [ ] **Step 4: Run tests + `npm run verify` + the e2e against a local build**

1. `npx prettier --write "src/app/[locale]/(site)/available-workers" e2e/pages/workers.spec.ts e2e/routes.ts src/lib/seo/routes.ts`
2. `npx vitest run src/lib/seo/unbuilt.test.ts src/lib/seo/routes.test.ts scripts/gate-routes.test.ts "src/app/[locale]/(site)/available-workers"` → green (the set and the filesystem agree again; the route table's derived lists still equal the table; if `scripts/gate-routes.test.ts` pins a row count, raise it by 2).
3. `npm run verify` → green.
4. `npm run build` (one job) — expect `○ /[locale]/available-workers` (or `ƒ`, whichever the group's siblings show) in the route list, no `'use server'` export error, no `server-only` import reached from a client file (the island imports only `_lib/options.ts`).
5. `npx next start -p 3100`, then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/workers.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts` (both projects) → green: the page contract loop and the canonical/hreflang loop now include the two new routes, the sitemap lists them and every `<loc>` answers 200, axe has zero violations on both routes under both projects (check specifically: the radio group is labelled through its sr-only legend; the decorative slot is `aria-hidden`; the two `Section tone="pale"` blocks keep `text-text-secondary` on `pale-1`), and no width in the sweep overflows (the hero grid stacks below `lg`; the `sm:grid-cols-2` field grid stacks below 561 px).
6. Local Lighthouse advisory (R50): `E2E_BASE_URL=http://localhost:3100 npm run gate` → the script-size assertion on `/adaylar` and `/en/available-workers` must be ≤ 204,800 B; `npm run js-size` prints the per-route row — note the number for the ledger. If the route is over 194,560 B (the lazy line), wrap `StickyCtaBar` in a page-local `'use client'` file that `next/dynamic`s it with `ssr: false` (it renders `null` on the server anyway) **before** starting the next page — W13 amended.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/available-workers/page.tsx" src/lib/seo/routes.ts e2e/routes.ts e2e/pages/workers.spec.ts
git commit -m "feat(workers): /adaylar + /en/available-workers — request form to the workers door, vetting steps, after-you-pick timeline, FAQ, closing band; pool-derived elements render by data (W6/D2/D23); gate route + UNBUILT entry (W20/W21)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — Preview gate + ledger numbers; docs in the same change set (SEO, ANALYTICS, CONTENT-MODEL, PRD)

- [ ] **Step 1: Run the binding gate against the Vercel preview (the local run is never sign-off, R50)**

Push the branch; wait for the preview; then `E2E_BASE_URL=https://<preview> REVALIDATE_SECRET=<the server's> npm run gate` followed by `npm run js-size`. Record for **both** `/adaylar` and `/en/available-workers`: gzipped script bytes (worst of the runs), the Lighthouse mobile triple performance / accessibility / best-practices / SEO, LCP ms. Expected: performance ≥ 0.95, the other three = 1.0, script ≤ 204,800 B, LCP ≤ 2500 ms. `lighthouse-report/content-readiness.json` (launch profile) for these routes: `lcpSlot: "h1"`, `placeholders: ["aw-hero"]`, `problems: []`.

- [ ] **Step 2: Verify the numbers are within budget**

A failure is fixed in the component, never by lowering an assertion (D20). Script over the ceiling → the `StickyCtaBar` lazy wrapper from Cycle 4 step 6; an axe violation → fix the markup; an SEO miss → check the two `sys.seo.workers.*` strings (title ≤ ~60 chars is not asserted, but Lighthouse's `document-title`/`meta-description` audits are). Re-run the gate after any fix.

- [ ] **Step 3: Implement — docs**

`docs/SEO.md` § Metadata — the per-page table. If the first WP2b page task has created it, append this row; if the table does not exist yet, create it directly under the § Metadata paragraph with the header `| Page | Route (tr · en) | Title / description source | Canonical | JSON-LD | LCP slot |` and this as its first row:

```md
| Available Workers | `/adaylar` · `/en/available-workers` | `sys.seo.workers.{title,description}` — the package has no SEO string for this page, so the page record's `titleId`/`descriptionId` are `''` (W23/W38); OG image `/og/{locale}/workers.png` | self (`absoluteUrl`), tr/en/x-default via `localeAlternates` | site-wide Organization/EmploymentAgency + WebSite (layout); `BreadcrumbList` (`Breadcrumbs`: Home / Available Workers); `FAQPage` (`FaqBlock`, 7 pairs in Phase A — 8 once the pool is signed) | `h1` (gradient auto-default, §10 row 4); `aw-hero` is a named placeholder and never the LCP (D26) |
```

`docs/ANALYTICS.md` § Event schema — append as the last paragraph of the section (before `## Conversion`):

```md
**Available Workers (`/adaylar`, WP2b T8).** No page-specific event: the design's `pool_filter` / `pool_sort` / `pool_load_more` / `pool_popular_pick` / `pool_form_role` / `pool_form_submit` / `profile_select` / `profile_unselect` are not ported — the cards are off (D2), and their `profiles` / `ref` / `trade` / `country` parameters are candidate identifiers the allowlist forbids (D13). The page fires only `call_click` / `whatsapp_click` / `email_click` with `placement: 'page_cta'` (hero WhatsApp, form-footer WhatsApp, FAQ ask card WhatsApp + call, closing band WhatsApp, licence-line e-mail) through `ContactCta` / `ContactLink`, `form_fallback` from the kernel's panel, and `generate_lead` / `conversion` through the D13 redirect. The sticky bar carries only the internal `#pool-form` CTA, because `StickyCtaBar` renders plain `Button`s that cannot fire a contact event (W12).
```

`docs/CONTENT-MODEL.md` § The `sys.*` range — add a bullet at the end of the namespace list (after the Thank-you bullet, or after the WP2a bullets if Tasks 1–5 appended theirs there):

```md
- **Available Workers (`sys.workers.*`, W6/W23):** `pool.{heading,intro}`, `empty.{title,body,cta}` (the designed empty state that stands in for the pool while no rows are signed), `sticky.message` (ICU `{hours}` = the `homepageReplyHours` metric), `form.titles.direct_employer`, `form.startWhen.{asap,month1,month3,flexible}` (labels for the stable `startWhen` keys the door receives — W3), `timeline.{days1to3,arrival}` (`{weeks}` = `firstDayWeeks`); plus `seo.workers.{title,description}` — the package has no SEO string for this page. Package copy that presupposes visible profile cards (`availworkers.031`–`038`, `048`, `052`–`071`, `107`, `210`/`211`, `225`–`250`) is not rendered in Phase A; the two FAQ answers the design keeps only in JavaScript (218, 221) render their package twins `wp.350` and `hire.302`.
```

`docs/PRD.md` line 29 — replace the row:

```md
| 10  | Available Workers             | `/adaylar`                                 | `/en/available-workers`      | Request form (`INQUIRY`, key `workers`; role chips → `iAm`; `sector` sent as `trade`, `city` via catalog v1.1) + vetting steps, after-you-pick timeline, FAQ. Aggregate strip and per-profile cards render only from signed pool data — hidden in Phase A (D2, W6); the `pool` fixture can never be served in production (D23) |
```

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` § Ledger — append the T8 line with the Step 1 numbers:

```md
| T8 · Available Workers | `/adaylar` · `/en/available-workers` | script <bytes> B gz (ceiling 204,800; lazy line 194,560) | LH mobile perf/a11y/bp/seo = <p>/<a>/<b>/<s> (tr) · <p>/<a>/<b>/<s> (en), LCP <ms> ms, preview <url> | pixel: n/a — not a D27 harness page (Homepage, Cost Calculator, Hire Workers, Blog Article); side-by-side review instead | <YYYY-MM-DD> |
```

(also copied into the git-ignored `.superpowers/` progress file the controller keeps).

- [ ] **Step 4: Run `npm run verify`**

`npx prettier --write docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md` then `npm run verify` → green (`prettier --check .` is part of it — the PRD table gets re-aligned by Prettier, which is expected).

- [ ] **Step 5: Commit**

```bash
git add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(workers): SEO row, analytics note, sys.workers namespace, PRD row; T8 ledger line (script size, Lighthouse triple)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/SEO.md` (§ Metadata page row: sys title source, self canonical, BreadcrumbList + FAQPage, LCP slot `h1`), `docs/ANALYTICS.md` (§ Event schema: no page event, `page_cta` contact clicks, the unported `pool_*`/`profile_*` events and why), `docs/CONTENT-MODEL.md` (§ `sys.*` range: the `sys.workers.*` + `sys.seo.workers.*` line, the unrendered card-presupposing ids, the two reused legal twins), `docs/PRD.md` (line 29, the page-table row: form key, hidden aggregate/cards, D23), `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (§ Ledger, the T8 line). Owner asks recorded for WP-C: `availworkers.106` ("Send us the profile numbers you liked…") and `availworkers.222` ("…to see the profiles?") presuppose cards and are rendered as authored; a Phase A rewording is a marketing decision, not a code change.

**Sys keys added:** `sys.seo.workers.title`, `sys.seo.workers.description`, `sys.workers.pool.heading`, `sys.workers.pool.intro`, `sys.workers.empty.title`, `sys.workers.empty.body`, `sys.workers.empty.cta`, `sys.workers.sticky.message`, `sys.workers.form.titles.direct_employer`, `sys.workers.form.startWhen.asap`, `sys.workers.form.startWhen.month1`, `sys.workers.form.startWhen.month3`, `sys.workers.form.startWhen.flexible`, `sys.workers.timeline.days1to3`, `sys.workers.timeline.arrival` — 15 keys, in both `src/messages/tr.json` and `src/messages/en.json`.

**Package ids used:** 89 ids read by literal id (96 counting the seven sector labels resolved through the collection) — `availworkers.021`, `022`, `023` (rendered only when the pool is signed), `024`, `025`, `026`, `027`, `028`, `029`, `030`, `041`, `042`, `043`, `044`, `045`, `046`, `047`, `049`, `050`, `051`, `055`, `056`, `057`, `058` (inside `PoolAggregate`, rows only), `072`, `073`, `074`, `075`, `076`, `077`, `078`, `079`, `080`, `081`, `082`, `083`, `084`, `085`, `086`, `087`, `088`, `089`, `090`, `091`, `092`, `093`, `094`, `095`, `096`, `097`, `098`, `099`, `100`, `101`, `102`, `103`, `104`, `105`, `106`, `108`, `109`, `110`, `141`, `142`, `143`, `144`, `146`, `147`, `148`, `149`, `150`, `151`, `210`, `211` (both only when the pool is signed), `212`, `213`, `214`, `215`, `216`, `217`, `218`, `219`, `220`, `221`, `222`, `223`, `224`; plus `hire.302` (221's answer), `wp.350` (218's answer), and `hire.076`–`hire.082` through the `sectors` collection's `labelId`s. First: `availworkers.021` · last: `wp.350`. Every id verified present in `src/content/local/catalogue.json` at `ad58fb8`; `availworkers.026` and the seven re-authored ids are read as T0b emits them.

**Foundation gaps:** (1) `StickyCtaBar` (T0d) renders its CTAs through `Button`, not `ContactCta`/`ContactLink`, so a `tel:`/`wa.me` button in the bar cannot fire `call_click`/`whatsapp_click` (W12) — this page keeps only the internal `#pool-form` CTA in the bar and moves the design's Call/WhatsApp to the FAQ ask card and closing band; a `StickyCta.placement`-aware bar would let Homepage/Hire/Calculator carry the design's three-button bar. (2) `CollectionSchemas` (T0b) has no `pool` entry, so `poolRows` reads `bundle.collections.pool` raw and `PoolAggregate` parses a provisional row shape for the counts; the v1.1 cards task should add `PoolRowSchema` to `collections.ts` and switch this page to `getCollection(bundle, 'pool')`. (3) `FormShell.submitLabel` is one static string, so the design's role-dependent submit label (146 employer / 153 HR agency) renders as 146 for both roles.
