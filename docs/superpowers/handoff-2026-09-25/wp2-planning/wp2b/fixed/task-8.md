### Task 8: Available Workers (`/adaylar`, `/en/available-workers`)

**Why this task looks the way it does.** The design is a live candidate pool with filters, a basket and cards fed by a 12-record inline fixture. Phase A has no pool source (CRM `website-feed` is v1.1, spec §3.3; Operations has no pool service); `pool` is a `FIXTURE_ONLY_COLLECTIONS` entry (D23 — `assertServableInProduction` throws on a LOCAL bundle carrying pool rows under `NODE_ENV=production`, which Vercel sets on previews too); per-profile cards are off behind `pool.cards` (D2). So this page ships the **request form, the "what verified means" steps, the after-you-pick timeline, the FAQ, the sticky bar and the closing band**. Every pool-derived element (the hero "Live from our portal" badge, the stats strip, the "Request these candidates" form head, the "Found a profile that fits?" sticky message, the "live sample refreshed weekly" FAQ pair) is **rendered by data, not deleted**: it reads `poolSigned(bundle)` and falls back to `sys.workers.*` copy or to nothing while the collection is empty, so the day the pool is signed nothing here has to be un-deleted (W4/W5/W6). The stats strip stays hidden because no pool number is signed (W1/W6 — "200+" is not a metric key and "Updated weekly" is a cadence claim with no source, D17).

**Rulings applied.** W1, W3 (the door wins: `name`/`company`/`email`/`phone` required; `city` via catalog v1.1), W6, W9, W12, W13 amended, W16, W17 (`CTA_BY_PATHNAME['/available-workers']` targets `#pool` — this page renders that id), W19, W20, W21, W23, W30, W61, W71, **W77** (wire values are keys or typed text — the design's "Which roles and how many workers?" input is posted as `trade`, typed free text; no sector key rides as `trade`, and the `workers` catalog has no `sector` field, so the draft's sector select is gone), **W78** (`startWhen` uses the shared `START_WHEN_KEYS` from `@/forms/options` and the `sys.form.options.startWhen.*` labels — the page-local key set and its four sys keys are gone), **W79** (consent is a checkbox; the page omits `consentLinkHref`, so the site-wide `/privacy` default stands — T13 has built it, W99), **W81** (the sticky bar carries the design's Call / WhatsApp us / Request workers buttons; the bar renders `tel:`/`wa.me` CTAs through `ContactLink` with `page_cta`), **W82** (the closing band's "Send a hiring request" is the typed href `{ pathname: '/hire-workers', hash: '#request-form' }`), **W83** (the FAQ ask card carries the design's WhatsApp + e-mail rows), **W92** (previews are door-less except `staging`: the form e2e asserts the deterministic `unauthorized` panel and skips itself where a door is configured), **W95** (no visitor data in any DOM href — every `wa.me` link on this page carries only the catalogued prefill `availworkers.224`; the fallback panel's link is bare and composed at click time), **W98** (one shape per shared doc), **W99** (runs after T7, before T9), **W105** (T14's I4 instance map records what this spec sends: `country: 'TR'`, `city` required, `trade` required), **W109** (breadcrumbs are this page's own `availworkers.021`/`022`), **W113** (section test ids sit on inner `<div>`s), **W115** (the design's own field texts `availworkers.143/150`, `044`, `045`, `046`, `047`, `144/151` are passed as `label`; `sys.form.labels.*` only for `headcount`, `startWhen`, `message`, `iAm`). Accepted page-local (reconcile list): the pool row schema (T8) and `FormShell`'s single submit label.

**Where it runs.** Every command runs in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on `wp2/foundation` (never the shared `jobsadmire-website` checkout, which is on `main`). One heavy job at a time on this machine (one `next build`, one Playwright run, `vitest` alone).

**Files:**

Create
- `src/app/[locale]/(site)/available-workers/page.tsx` — the server page (metadata + the sections in design order)
- `src/app/[locale]/(site)/available-workers/actions.ts` — `'use server'` wrapper: `submitWorkers`
- `src/app/[locale]/(site)/available-workers/_lib/options.ts` — `ROLE_KEYS`, `RoleKey`, `isRoleKey`, `FIELD_MAX`
- `src/app/[locale]/(site)/available-workers/_lib/message.ts` — `MESSAGE_MAX`, `PROFILE_REF_PATTERN`, `PROFILE_REFS_PREFIX`, `parseProfileRefs`, `composeWorkersMessage`
- `src/app/[locale]/(site)/available-workers/_lib/pool.ts` — `POOL_CARDS`, `poolRows`, `poolSigned` (the D2/D23 gate every pool-derived element reads)
- `src/app/[locale]/(site)/available-workers/_lib/content.ts` — `VERIFIED_STEPS`, `WORKERS_FAQ`, `workersFaqItems`
- `src/app/[locale]/(site)/available-workers/_lib/spec.ts` — `workersSchema`, `WorkersInput`, `WORKERS_COUNTRY`, `toWorkersFields`, `WORKERS_SPEC` (pure; `actions.ts` wraps it)
- `src/app/[locale]/(site)/available-workers/_components/RequestFormFields.tsx` — `'use client'` island: role chips (→ `iAm`) swapping the form head, the company/roles labels and the message placeholder; the `Field`s
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
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.workers.{title,description}` inside the existing `sys.seo` object (WP2a Task 4 created it with `ogTagline`; earlier page tasks added theirs); a new `sys.workers` object beside the other page namespaces (key order is not asserted; anchor on object names, never line numbers — W45)
- `src/lib/seo/routes.ts` — delete the `'/available-workers',` entry of the `UNBUILT_PATHNAMES` literal (W20)
- `e2e/routes.ts` — two `GATE_ROUTE_TABLE` rows (W21)
- `docs/SEO.md` — one row in the `## Pages` table (W98)
- `docs/ANALYTICS.md` — one bullet under `### Page instrumentation (WP2b)` (W98)
- `docs/CONTENT-MODEL.md` — one bullet in the per-page list under `### Adding copy (W9, W23, W54)` (W98)
- `docs/PRD.md` — the Available Workers row of the §2 page table
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T8 ledger row

Test
- the seven Vitest files above (`vitest.config.mts` includes `src/**/*.test.{ts,tsx}`; `[locale]`/`(site)` are literal directory names the glob walks — WP2a keeps tests under `src/app/` already)
- `e2e/pages/workers.spec.ts` (Playwright, both projects, `testDir: './e2e'`)
- the foundation guards this task keeps green: `src/lib/seo/unbuilt.test.ts` (set ↔ filesystem), `src/lib/seo/routes.test.ts`, `src/messages/messages.test.ts` (identical key sets), `e2e/routing.spec.ts`'s page-contract loop, `e2e/seo.spec.ts`'s canonical/hreflang + sitemap sweep over `INDEXABLE_GATE_ROUTES`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts`

**Interfaces:**

Consumes (exact names; WP2a `produces-final.md` + the `task-{3,5,6,7}-additions.md` as landed, the real `src/forms/**` at HEAD `5891e30` where they differ)
- WP2a Task 1 — `src/content/pure.ts` (re-exported by `@/content/adapter`): `makeTf(bundle, locale)`, `metricValues(bundle, locale)` (`homepageReplyHours: '24'`, `firstDayWeeks: '6–8'`; `''` for an unsigned metric), `assertServableInProduction(bundle, source, env)` (message `collections … are never served from LOCAL in production (D23)`); `src/content/config.ts`: `FIXTURE_ONLY_COLLECTIONS` (`pool` included). `bundle.collections.pool` is read raw — there is no `pool` key in `CollectionSchemas` (accepted page-local, reconcile list). `bundle.pages.workers` = `{ titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb','faq'] }` → `buildMetadata` uses the `sys.seo.workers.*` fallbacks (W38). Re-authored ids read through `makeTf`: `availworkers.038/048/067/071/106/142/220`; `availworkers.026` is TR `Türkiye'de` / EN `in Türkiye` (W7).
- WP2a Task 2 (real code): `src/forms/action.ts` (`import 'server-only'`): `createFormAction(spec)`, `type FormActionState`, `type FormSpec<S>` = `{ key: FormKey; schema: S; toFields(parsed, data: FormData, ctx: FormActionContext): WireFields | Promise<WireFields>; consent?: 'checkbox' | 'notice' }`, `type FormActionContext = { visitor: PostFormVisitor; locale: Locale }`. `src/forms/wire.ts`: `type WireFields`. `src/forms/errors.ts`: `fieldErrorsFromIssues(issues)` (`.min(1)` on a string → `required`). `src/forms/client/FormShell.tsx`: `FormShell({ action, formKey, locale, turnstileSiteKey, whatsappNumber, whatsappIntro?, contact?, submitLabel?, consent? = 'checkbox', consentLinkHref? = '/privacy', title?, children, className?, testId?, id?, initialState?, idScope?, headingLevel? = 3 })` — `<form data-testid={testId} data-form-key>`, honeypot `f-<scope>-honeypot`, consent `f-<scope>-consent`, the form-level alert, and on an `error` state `FallbackPanel` (`data-testid="form-fallback"`, `data-kind`, focused, WhatsApp anchor href = bare `https://wa.me/<number>`, prefill composed on click via `window.open`, W76). With no `OPS_API_URL`/write token, `postForm` answers `{ kind: 'unauthorized' }` without a call. `src/forms/client/Field.tsx`: `Field({ name, label?, hint?, placeholder?, required?, as?, type?, options?, autoComplete?, inputMode?, rows?, min?, max?, minLength?, maxLength?, defaultValue?, disabled?, className?, id? })`, `type FieldOption` — label `sys.form.labels.<name>` unless `label` is passed (W30/W115); `hint=""` suppresses the optional hint; `placeholder=""` suppresses the sys placeholder; the select branch always prepends `sys.form.placeholders.select` and ignores `placeholder` (W111). `src/forms/client/FormErrorsContext.tsx`: `FormErrorsContext`, `useFieldValue(name)`. Existing sys keys: `sys.form.labels.{iAm,headcount,startWhen,message}`, `sys.thankYou.forms.workers`.
- WP2a Task 3: `src/analytics/ContactLink.tsx`: `ContactLink({ href, placement, children, ...anchorAttrs })`; `src/design/chrome/ctas.ts`: `CTA_BY_PATHNAME['/available-workers']` = `availworkers.016` + `home.003` → `{ pathname: '/available-workers', hash: '#pool' }` (this page renders `id="pool"`); `(site)/layout.tsx` owns `<main id="main">`. Task 3 addition W80 (`sys.nav.home`) — not read here.
- WP2a Task 4: `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` (`@/lib/seo/metadata`), `UNBUILT_PATHNAMES` (`@/lib/seo/routes`), `pageOgImageUrl` (through `buildMetadata`), `sys.seo` object with `ogTagline`.
- WP2a Task 5 (+ additions W78, W81–W84): `@/design/blocks`: `Breadcrumbs({ locale, items: Crumb[], tone?, className? })`, `ClosingCtaBand({ bundle, locale, titleId, bodyId?, primary: Cta, secondary?: Cta, tone?: 'navy'|'gradient'|'green', id? })`, `ContactCta({ placement, href, variant?, size?, external?, className?, children })`, `EmptyState({ title, body?, cta?: EmptyStateCta, tone?, headingLevel?, testId?, className? })`, `FaqBlock({ bundle, locale, items: FaqItem[], id?, eyebrowId?, headingId?, bodyId?, askCard?: FaqAskCard, openFirst? })` with `FaqAskCard` = `{ titleId, bodyId, whatsappNumber, whatsappText, whatsappLabelId, phone?, callLabelId?, email?, emailLabelId?, subject? }` (W83), `ImageSlot({ slot, alt, width, height, className?, lcp?, src? })` (no `src` + `alt=""` → aria-hidden `data-placeholder={slot}`), `ProcessSteps({ bundle, locale, steps: ProcessStep[], variant?, id? })`, `type Cta` / `EmptyStateCta` (`href: string | Exclude<Href, string>`, W82), `type FaqItem`, `type ProcessStep` (`when?` resolved string). `@/design/primitives`: `Button`, `Card`, `Eyebrow`, `Section({ tone: 'light'|'dark'|'pale'|'band', id?, className?, children })` (no test id prop — W113), `Stat({ value?, text?, label, locale, tone? })`, `Timeline({ steps, variant? })`, `type TimelineStep`, `RadioChips({ name, options, value, onChange, legend, legendHidden?, className? })`. `@/design/chrome/StickyCtaBar`: `StickyCtaBar({ message, ctas: StickyCta[], showAfterPx?, hideNearId?, live? })`, `type StickyCta = { label; href: string | Exclude<Href, string>; variant?; external? }` — `tel:`/`wa.me`/`mailto:` CTAs render through `ContactLink` `page_cta`, wrapper `data-testid="sticky-cta"` (W81). `@/forms/options`: `START_WHEN_KEYS = ['asap','month1','months1to3','planning']`, `type StartWhenKey`, labels `sys.form.options.startWhen.<key>` (W78). `src/test/bundle.ts`: `testBundle({ strings?, collections?, settings? })`.
- WP2a Task 7 (+ additions W91/W94): `e2e/routes.ts` `GATE_ROUTE_TABLE` (`{ path, indexable }`); `npm run gate` (sends `x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET`, uses `lighthouserc.preview.json` on a `*.vercel.app` host); `npm run js-size` (`SCRIPT_CEILING` 204,800, `LAZY_LINE` 194,560); the page-markup contract (`h1[data-testid="page-h1"]`, one `data-lcp-slot`, named `data-placeholder`).
- WP1: `getBundle` (`@/content/adapter`), `waLink`/`telLink`/`mailLink` (`@/lib/contact`), `Link` (`@/i18n/navigation`), `routing` (`@/i18n/routing`), `getTranslations`/`setRequestLocale` (`next-intl/server`), `renderWithIntl` (`@/test/render`), the page-file pattern (`generateMetadata` → `hasLocale` → `getBundle` → `buildMetadata`; default export → `setRequestLocale`; no `<main>`, R31). `/api/site-health` returns `ops.state` (`'unconfigured'` when door-less).
- Other page tasks: T2 renders `id="request-form"` on `/hire-workers` (the `DEFAULT_CTAS` contract); T13 has built `/privacy` (W99); T1 created the `## Pages` table in `docs/SEO.md`, `### Page instrumentation (WP2b)` in `docs/ANALYTICS.md`, the per-page list under `### Adding copy` in `docs/CONTENT-MODEL.md`, and the ledger row format (W98).
- Operations catalog `workers` (INQUIRY; `apps/backend/src/modules/website/website-form-catalog.ts` + WP2a Task 8's v1.1): `name` (req ≤120), `company` (req ≤200), `email` (req, ≤254), `phone` (req, ≥8 digits, ≤40), `country` (iso2), `iAm` (`direct_employer | hr_agency`), `trade` (≤200), `headcount` (≤10), `startWhen` (≤120), `message` (≤5000), `city` (≤120, v1.1). Unknown keys are dropped silently. Classification DIRECT_EMPLOYER by default, HR_AGENCY through `iAm`.

Produces
- For T14 (W105 — its I4 instance row copies this): the `workers` door instance on `/adaylar` lives in `#pool-form` (the hero card), `data-testid="workers-form"`; it always sends `iAm`, `name`, `company`, `email`, `phone`, `country: 'TR'`, `city` (page-required), `trade` (page-required, typed roles and volume), and `headcount` / `startWhen` (a W78 key) / `message` only when given; basket refs (v1.1) fold into `message` behind `Profiles: `. Consent `checkbox`.
- For the v1.1 cards task: `poolSigned` / `POOL_CARDS` / `poolRows` and the provisional row parsing in `PoolAggregate` — it adds `CollectionSchemas.pool` and switches to `getCollection(bundle, 'pool')`.
- Nothing else another task relies on.

**Design → build map (sections in the design's order; every package string by exact id through `tf = makeTf(bundle, locale)`, sys copy through `getTranslations('sys')`):**

| # | Design (`Available Workers.dc.html`) | Built as | Ids |
|---|---|---|---|
| 1 | Slim bar / header / hamburger (401–472) | shared chrome (`(site)` layout); header CTA from `CTA_BY_PATHNAME` → `#pool` | — |
| 2 | Hero (474–504): breadcrumb, "Live from our portal", H1, intro, Browse candidates → `#pool`, Ask for profiles (WhatsApp), KVKK note, popular chips | `Section tone="dark"` + `ImageSlot slot="aw-hero"` (decorative placeholder, never the LCP — §10 row 4) + `Breadcrumbs tone="dark"` (own ids, W109) + live badge **only when `poolSigned`** + `<h1 data-testid="page-h1" data-lcp-slot="h1">` + `Button href="#pool"` + `ContactCta` (wa.me, prefill 224) + note; popular chips not built (derived from pool trades — the cards task) | 021, 022, 023 (gated), 024–030, 224 |
| 3 | Hero form card `#pool-form` (506–578): gradient head, role tabs, mobile-collapsed CTA, basket, inline "Request sent", form (company, contact person, email, phone, city, roles-and-volume), consent, submit, footer | `FormShell` (`workers`, checkbox consent, `/privacy` default) + `RequestFormFields`: head title (107 when the pool is signed, else `sys.workers.form.titles.direct_employer`; HR: 148) + subtitle (142 / 149); role `RadioChips` → `iAm` (141 / 147); labels 143/150, 044, 045, 046, 047, 144/151 (W115); `headcount` + `startWhen` (W78) + optional `message` (placeholder 145 / 152) as design deltas the catalog carries; no collapse, no basket (cards off), no inline success (D13 → `/tesekkurler?form=workers`); submit 146; footer: Prefer WhatsApp? + Sourcing agency? Partner with us → | 041–047, 107 (gated), 141–152, 146; `sys.workers.form.titles.direct_employer`, `sys.form.labels.{iAm,headcount,startWhen,message}`, `sys.form.options.startWhen.*` |
| 4 | Sticky desktop bar (583–597): live dot, message, Call, WhatsApp us, Request workers → | `StickyCtaBar` (`live` = `poolSigned`): message 048 when the pool is signed, else `sys.workers.sticky.message` (both carry `homepageReplyHours`; the bar is hidden while that metric is unsigned, D17); CTAs Call (`tel:`), WhatsApp us (wa.me + 224), Request workers → `#pool-form` (W81 — the contact buttons fire `call_click`/`whatsapp_click` `page_cta`); `hideNearId="pool-cta"` | 048 (gated), 049, 050, 051; `sys.workers.sticky.message` |
| 5–8 | Pool header, stats strip, filters, card grid, empty state, "Can't see the profession" card (598–769) | `Section id="pool"`: `sys.workers.pool.{heading,intro}` → `PoolAggregate` (null while empty) → `EmptyState` (`sys.workers.empty.*`, CTA → `#pool-form`, `testId="pool-empty"`) while `!poolSigned`; the 070/071 card, filters and cards belong to the cards task | 055–058 (inside `PoolAggregate`, rows only) |
| 9 | What "verified" means (777–827) | h2 + p + `ProcessSteps variant="cards" id="verified-steps"` (step 4 `when` = 081) + footnote | 072–084 |
| 10 | After you pick (829–875) | `<div data-testid="after-you-pick">`: `Eyebrow` + h2 + p + `Button`s (→ `/work-permit`, `/hire-workers`) + `Card` with `Timeline variant="horizontal"`; "Days 1–3" / "Weeks 4–8" are not in the package → `sys.workers.timeline.days1to3`, `sys.workers.timeline.arrival` (`{weeks}` = `firstDayWeeks`; no badge while unsigned) | 085–099 |
| 11 | FAQ (877–912): side column + ask card (WhatsApp, e-mail) + accordion | `FaqBlock id="faq"` (`openFirst`); ask card WhatsApp (050, prefill 224) + e-mail (045, `settings.email`, subject `sys.workers.ask.emailSubject`) (W83); pairs from `WORKERS_FAQ`: 210/211 only when `poolSigned` (W6/D17); 218's and 221's answers exist only in the design's JS → the package's twins `wp.350` and `hire.302` (legal-flagged — listed for the WP-C legal review in this page's context) | 100–104, 210–224, wp.350, hire.302, 045, 050; `sys.workers.ask.emailSubject` |
| 12 | Closing CTA (915–928) | `ClosingCtaBand id="pool-cta" tone="gradient"`: primary WhatsApp 108 (wa.me + 224), secondary 109 → `{ pathname: '/hire-workers', hash: '#request-form' }` (W82); licence line 110 + `ContactLink` mailto; 107's mobile button not rendered (it presupposes cards) | 105, 106, 108, 109, 110 |
| 13 | Mobile floating filter pill + basket bar (930–949) | not built (cards off); the chrome's `MobileBottomBar` stands | — |
| 14 | Footer (951–1059) | shared chrome | — |

Not rendered on purpose (Phase A): 031–040 (popular chips, the hard-typed "Reply in 4 h" trust chip, the collapsed-CTA labels, the inline success panel, and the design's consent sentence 039/040 — the kernel's `sys.form.consent.*` checkbox row replaces it, W79), 052–054, 059–071, 138–140, 153 (the submit label is `FormShell`'s one static prop — 146 for both roles, accepted), 154–209, 225–250. Design deltas for the side-by-side review: visible field labels (D20), `headcount`/`startWhen`/`message` fields, the designed empty state in place of cards, the fallback panel / thank-you redirect in place of the inline "Request sent" (D11/D13), the sticky bar's "Request workers" jumps to the form on this page instead of the retired `/hire-workers-in-turkey` URL.

---

#### Cycle 1 — `sys.workers.*` + `sys.seo.workers.*` copy; the pure page libs (`options`, `message`, `pool`, `content`)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/available-workers/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { START_WHEN_KEYS } from '@/forms/options';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** The page's whole `sys.workers.*` set (W6/W23) — a key added to the page is added here and
 *  to BOTH message files (`src/messages/messages.test.ts` proves the files agree; this proves
 *  the page and the files agree). The `startWhen` labels are NOT here: they are the shared
 *  `sys.form.options.startWhen.*` (W78). */
const WORKERS_SYS_KEYS = [
  'pool.heading',
  'pool.intro',
  'empty.title',
  'empty.body',
  'empty.cta',
  'sticky.message',
  'form.titles.direct_employer',
  'timeline.days1to3',
  'timeline.arrival',
  'ask.emailSubject',
] as const;

/** sys keys the page reads but does not own — W30 labels and the W78 option labels. */
const CONSUMED_SYS_KEYS = [
  'form.labels.iAm',
  'form.labels.headcount',
  'form.labels.startWhen',
  'form.labels.message',
  ...START_WHEN_KEYS.map((k) => `form.options.startWhen.${k}`),
];

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
      }
      const seo = get(sys, 'seo.workers') as { title: string; description: string };
      expect(seo.title.length).toBeGreaterThan(10);
      // A snippet-length description (docs/SEO.md): the design's own was ~300 chars.
      expect(seo.description.length).toBeGreaterThan(50);
      expect(seo.description.length).toBeLessThanOrEqual(160);
    });

    it(`${name}: every sys key the page reads but does not own exists`, () => {
      for (const key of CONSUMED_SYS_KEYS)
        expect(typeof get(messages.sys, key), key).toBe('string');
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

  it('returns an empty string when there is neither a message nor a ref (the field is then omitted)', () => {
    expect(composeWorkersMessage(undefined)).toBe('');
    expect(composeWorkersMessage('   ', 'not-a-ref')).toBe('');
  });

  it('parses refs case-insensitively, de-duplicates, keeps order, drops junk', () => {
    expect(parseProfileRefs('ja-1042, JA-1050 ja-1042; JA-9; DROP TABLE; JA-1050')).toEqual([
      'JA-1042',
      'JA-1050',
    ]);
    expect(parseProfileRefs(undefined)).toEqual([]);
  });

  it('prepends the refs line and a blank line; refs alone when the message is empty', () => {
    expect(composeWorkersMessage('Two welders.', 'ja-1042, JA-1050')).toBe(
      `${PROFILE_REFS_PREFIX}JA-1042, JA-1050\n\nTwo welders.`,
    );
    expect(composeWorkersMessage('', 'JA-1042')).toBe(`${PROFILE_REFS_PREFIX}JA-1042`);
  });

  it('never exceeds the door cap (message ≤ 5000)', () => {
    expect(MESSAGE_MAX).toBe(5000);
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

// Every id the FAQ builder reads, as plain strings (no `{metric}` tokens — this test is about
// pairing and gating, not metrics).
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
    for (const item of items) {
      expect(item.q.startsWith('Q ')).toBe(true);
      expect(item.a.startsWith('A ')).toBe(true);
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

`cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx vitest run available-workers` → four files fail: `sys-keys` (`expected [] to deeply equal [ 'ask.emailSubject', … ]` — `sys.workers` is undefined — and `seo.workers` undefined), `pool`/`message`/`content` at import (`Failed to resolve import "../_lib/pool"` etc.).

- [ ] **Step 3: Implement**

`src/messages/tr.json` — inside the existing `"seo": { … }` object add a `workers` entry (keep every entry already there):

```json
      "workers": {
        "title": "Başlamaya hazır doğrulanmış işçiler | JobsAdmire",
        "description": "Beceri testli, belgeleri kontrol edilmiş, izne hazır adaylar. Pozisyonlarınızı yazın; kısa listeyi hazırlayıp her çalışma iznini İŞKUR lisansımızla sunalım."
      }
```

and add a `workers` key to `sys`, beside the other page namespaces (after the last page object present — order is not asserted):

```json
    "workers": {
      "pool": {
        "heading": "Aday havuzumuz",
        "intro": "Havuzdaki her aday beceri testinden geçer, belgeleri kontrol edilir ve çalışma iznine hazır hale getirilir. Profiller burada yayınlanana kadar ihtiyacınızı yazın; eşleşen adayları doğrudan size iletelim."
      },
      "empty": {
        "title": "Herkese açık profiller henüz yayında değil",
        "body": "Profiller, aday gizliliği (KVKK) ve iş ortaklarımızın onayı tamamlandıktan sonra bu sayfada görünecek. Talep formunu doldurun; tam CV’leri, belgeleri ve video mülakatları doğrudan sizinle paylaşalım.",
        "cta": "Talep formuna gidin"
      },
      "sticky": {
        "message": "İhtiyacınız olan pozisyonları yazın — {hours} saat içinde tam CV ve video mülakat."
      },
      "form": {
        "titles": {
          "direct_employer": "Havuzdan aday talep edin"
        }
      },
      "timeline": {
        "days1to3": "1–3. gün",
        "arrival": "{weeks}. hafta"
      },
      "ask": {
        "emailSubject": "Mevcut adaylar hakkında soru"
      }
    }
```

`src/messages/en.json` — the same two places:

```json
      "workers": {
        "title": "Verified workers ready to start in Türkiye | JobsAdmire",
        "description": "Skill-tested, document-checked, permit-ready candidates. Tell us the roles you need — we shortlist and file every work permit under our İŞKUR licence."
      }
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
        }
      },
      "timeline": {
        "days1to3": "Days 1–3",
        "arrival": "Weeks {weeks}"
      },
      "ask": {
        "emailSubject": "Question about available candidates"
      }
    }
```

(`form.titles` has only the employer entry on purpose: the HR-agency head is the package's own 148/149, and the design's employer head "Request these candidates" (107) presupposes visible cards, so it renders only once the pool is signed, W6. `sys.seo.*` is server-only and never reaches the client payload, W90.)

`src/app/[locale]/(site)/available-workers/_lib/options.ts`:

```ts
/** The `iAm` values the Operations `workers` catalog accepts (`EMPLOYER_I_AM_VALUES`) — the
 *  role chips post exactly these. `startWhen` keys are the shared W78 set in `@/forms/options`,
 *  never a page-local list. */
export const ROLE_KEYS = ['direct_employer', 'hr_agency'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const isRoleKey = (v: string | undefined): v is RoleKey =>
  (ROLE_KEYS as readonly string[]).includes(v ?? '');

/** The door's caps on the `workers` catalog entry (website-form-catalog.ts + v1.1 `city`) —
 *  one source for the schema and the inputs' `maxLength`. Client-safe (no zod). */
export const FIELD_MAX = {
  name: 120,
  company: 200,
  email: 254,
  phone: 40,
  city: 120,
  trade: 200,
  message: 5000,
} as const;
```

`src/app/[locale]/(site)/available-workers/_lib/message.ts`:

```ts
import { FIELD_MAX } from './options';

/** The door's `message` cap on the `workers` catalog entry. */
export const MESSAGE_MAX = FIELD_MAX.message;
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
 *  posted — the v1.1 cards task adds a hidden `profileRefs` input and nothing else changes.
 *  Returns '' when there is neither text nor a ref; the caller then omits the field. */
export function composeWorkersMessage(message: string | undefined, profileRefs?: string): string {
  const body = (message ?? '').trim();
  const refs = parseProfileRefs(profileRefs);
  const head = refs.length ? `${PROFILE_REFS_PREFIX}${refs.join(', ')}` : '';
  const text = head && body ? `${head}\n\n${body}` : head || body;
  return text.length > MESSAGE_MAX ? text.slice(0, MESSAGE_MAX) : text;
}
```

`src/app/[locale]/(site)/available-workers/_lib/pool.ts`:

```ts
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** D2: per-profile cards are OFF at launch. Flipping this is the v1.1 cards task (partner
 *  notice + consent + DPIA), never a content edit. */
export const POOL_CARDS = false as const;

/** The raw `pool` rows. There is no `CollectionSchemas.pool` (accepted page-local for Phase A:
 *  the collection is fixture-only and empty in production); the v1.1 cards task adds the schema
 *  and this becomes `getCollection(bundle, 'pool')`. */
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
 * The FAQ pairs (design `faqData`). Two answers exist only in the design's JavaScript: 218
 * ("Who files the work permit…") and 221 ("What if the worker leaves…"). The package carries
 * the same copy under `wp.350` and `hire.302` — both legal-flagged, so they sit behind the D8
 * APPROVE gate the JS-only text would have bypassed, and W9 forbids minting an id for copy the
 * package already has. The WP-C legal review checks them in this page's context (wp.350's
 * "track the status live on your portal", hire.302's replacement guarantee). 210/211 promise a
 * "live sample of our portal, refreshed weekly" with a hard-typed "200+": shown only once the
 * pool is signed (W6/D17).
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

`npx prettier --write src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/available-workers"` then `npx vitest run available-workers src/messages` → the four new files green (15 tests) and `src/messages/messages.test.ts` green (identical key sets). `npm run verify` → green (typecheck: the JSON imports now carry `sys.workers`/`sys.seo.workers`; lint: no `content/local` or `design-package` import under `src/`).

- [ ] **Step 5: Commit**

```bash
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 add src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/available-workers/_lib" "src/app/[locale]/(site)/available-workers/__tests__/sys-keys.test.ts" "src/app/[locale]/(site)/available-workers/__tests__/pool.test.ts" "src/app/[locale]/(site)/available-workers/__tests__/message.test.ts" "src/app/[locale]/(site)/available-workers/__tests__/content.test.ts"
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 commit -m "feat(workers): sys.workers/sys.seo.workers copy and the page libs — pool gate (D2/D23), role keys and caps, message folding, FAQ pairing

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — The `workers` form spec (Zod → exact catalog field names) and the `'use server'` action

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/available-workers/__tests__/spec.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { START_WHEN_KEYS } from '@/forms/options';
import { PROFILE_REFS_PREFIX } from '../_lib/message';
import { toWorkersFields, WORKERS_COUNTRY, WORKERS_SPEC, workersSchema } from '../_lib/spec';

/** The Operations `workers` catalog entry (website-form-catalog.ts, v1.0 + WP2a Task 8's v1.1
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
  trade: '4 housekeeping, 2 cooks',
  headcount: '6',
  startWhen: 'month1',
  message: 'Summer season, staff housing available.',
};

const ctx = { visitor: { ip: null, ua: null }, locale: 'tr' as const };

describe('workers form spec → Operations catalog `workers`', () => {
  it('sends exactly the catalog field names, the typed roles as `trade`, and TR as the country', () => {
    const fields = toWorkersFields(workersSchema.parse(valid));
    expect(fields).toEqual({
      iAm: 'direct_employer',
      name: 'Ayşe Yılmaz',
      company: 'Antalya Otel A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 501 124 03 40',
      country: 'TR',
      city: 'Antalya',
      trade: '4 housekeeping, 2 cooks',
      headcount: '6',
      startWhen: 'month1',
      message: 'Summer season, staff housing available.',
    });
    expect(WORKERS_COUNTRY).toBe('TR');
    for (const k of Object.keys(fields)) expect(CATALOG_WORKERS_FIELDS.has(k), k).toBe(true);
    // W77/W78: no sector key rides on `trade`, and `workers` has no `sector` field at all.
    expect(fields).not.toHaveProperty('sector');
  });

  it('omits the optional fields the visitor left blank instead of sending empty strings', () => {
    const fields = toWorkersFields(
      workersSchema.parse({ ...valid, headcount: '', startWhen: '', message: '' }),
    );
    expect(fields).not.toHaveProperty('headcount');
    expect(fields).not.toHaveProperty('startWhen');
    expect(fields).not.toHaveProperty('message');
    expect(fields.city).toBe('Antalya');
    expect(fields.trade).toBe('4 housekeeping, 2 cooks');
  });

  it('startWhen accepts exactly the shared W78 keys — the retired page-local keys fail', () => {
    for (const k of START_WHEN_KEYS)
      expect(workersSchema.safeParse({ ...valid, startWhen: k }).success, k).toBe(true);
    for (const k of ['month3', 'flexible', 'tomorrow'])
      expect(workersSchema.safeParse({ ...valid, startWhen: k }).success, k).toBe(false);
  });

  it('folds basket refs into `message` (W3) — also when the visitor typed no message', () => {
    expect(
      toWorkersFields(workersSchema.parse({ ...valid, message: 'Two welders.', profileRefs: 'ja-1042, JA-1050' }))
        .message,
    ).toBe(`${PROFILE_REFS_PREFIX}JA-1042, JA-1050\n\nTwo welders.`);
    expect(
      toWorkersFields(workersSchema.parse({ ...valid, message: '', profileRefs: 'JA-1042' })).message,
    ).toBe(`${PROFILE_REFS_PREFIX}JA-1042`);
  });

  it('requires role, name, company, email, phone, city and trade — a blank one reads `required`', () => {
    for (const key of ['name', 'company', 'email', 'phone', 'city', 'trade'] as const) {
      const r = workersSchema.safeParse({ ...valid, [key]: '' });
      expect(r.success, key).toBe(false);
      if (!r.success) expect(fieldErrorsFromIssues(r.error.issues)[key], key).toBe('required');
    }
    const badEmail = workersSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(badEmail.success).toBe(false);
    if (!badEmail.success) expect(fieldErrorsFromIssues(badEmail.error.issues).email).toBe('email');
    const badPhone = workersSchema.safeParse({ ...valid, phone: '12 34' });
    expect(badPhone.success).toBe(false);
    if (!badPhone.success) expect(fieldErrorsFromIssues(badPhone.error.issues).phone).toBe('phone');
    expect(workersSchema.safeParse({ ...valid, iAm: 'agency' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, iAm: 'sourcing_partner' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, headcount: '0' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, headcount: '10000' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, trade: 'x'.repeat(201) }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, city: 'x'.repeat(121) }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, message: 'x'.repeat(5001) }).success).toBe(false);
  });

  it('is the `workers` key with a consent checkbox (R55 / W79)', async () => {
    expect(WORKERS_SPEC.key).toBe('workers');
    expect(WORKERS_SPEC.consent).toBe('checkbox');
    expect(WORKERS_SPEC.schema).toBe(workersSchema);
    await expect(
      Promise.resolve(WORKERS_SPEC.toFields(workersSchema.parse(valid), new FormData(), ctx)),
    ).resolves.toHaveProperty('country', 'TR');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run available-workers/__tests__/spec` → fails at import: `Failed to resolve import "../_lib/spec"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/available-workers/_lib/spec.ts` (pure — no `server-only`, so it is unit-testable; `FormSpec` is a type-only import and is erased; never imported by a client file — the island imports `options.ts` only):

```ts
import { z } from 'zod';
import type { FormSpec } from '@/forms/action';
import { START_WHEN_KEYS } from '@/forms/options';
import type { WireFields } from '@/forms/wire';
import { composeWorkersMessage } from './message';
import { FIELD_MAX, ROLE_KEYS } from './options';

/** Field names are the catalog's (what each `Field name=…` posts). `.min(1)` precedes
 *  `.email()` so an empty value reads `required`, not `email` (`issueToCode` takes the first
 *  issue). The action trims every string before this runs. */
export const workersSchema = z.object({
  iAm: z.enum(ROLE_KEYS),
  company: z.string().min(1).max(FIELD_MAX.company),
  name: z.string().min(1).max(FIELD_MAX.name),
  email: z.string().min(1).max(FIELD_MAX.email).email(),
  phone: z
    .string()
    .min(1)
    .regex(/(\D*\d){8,}/, { message: 'phone' })
    .max(FIELD_MAX.phone),
  city: z.string().min(1).max(FIELD_MAX.city),
  /** W77: the design's "Which roles and how many workers?" — typed free text, so it travels
   *  as typed; the catalog's only role slot on `workers` is `trade`. */
  trade: z.string().min(1).max(FIELD_MAX.trade),
  // ≤ 10 chars at the door; the input bounds it to 1–9999 (`Field min/max`), the schema too.
  headcount: z
    .string()
    .regex(/^[1-9]\d{0,3}$/)
    .or(z.literal(''))
    .optional(),
  /** W78: the shared key set; a `<select>` left on its placeholder posts ''. */
  startWhen: z.enum(START_WHEN_KEYS).or(z.literal('')).optional(),
  message: z.string().max(FIELD_MAX.message).optional(),
  /** Basket refs (v1.1 cards task); never posted in Phase A. */
  profileRefs: z.string().max(500).optional(),
});
export type WorkersInput = z.infer<typeof workersSchema>;

/** The design's "City in Türkiye" field implies the country; the catalog's optional `country`
 *  is sent so the inbox classification never has to guess (W105 records it for T14). */
export const WORKERS_COUNTRY = 'TR';

/** EXACT Operations `workers` catalog names (v1.0 + v1.1 `city`); a blank optional is omitted,
 *  never sent as `''`. */
export function toWorkersFields(p: WorkersInput): WireFields {
  const fields: WireFields = {
    iAm: p.iAm,
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: WORKERS_COUNTRY,
    city: p.city,
    trade: p.trade,
  };
  if (p.headcount) fields.headcount = p.headcount;
  if (p.startWhen) fields.startWhen = p.startWhen;
  const message = composeWorkersMessage(p.message, p.profileRefs);
  if (message) fields.message = message;
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
 *  the factory call sits outside (Task 2 deviation 1). */
export async function submitWorkers(prev: FormActionState, data: FormData) {
  return run(prev, data);
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/available-workers"` then `npx vitest run available-workers` → 5 files, 22 tests green. `npm run verify` → green (`actions.ts` compiles against `createFormAction`; the `'use server'` export shape is proven by Cycle 4's build).

- [ ] **Step 5: Commit**

```bash
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 add "src/app/[locale]/(site)/available-workers/_lib/spec.ts" "src/app/[locale]/(site)/available-workers/actions.ts" "src/app/[locale]/(site)/available-workers/__tests__/spec.test.ts"
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 commit -m "feat(workers): form spec — Zod to the exact workers catalog fields (typed roles as trade, shared startWhen keys, city v1.1, TR country) and the submitWorkers action

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — Islands: `RequestFormFields` (role chips → `iAm`, role-dependent head/labels) and `PoolAggregate` (null while the pool is empty)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/available-workers/__tests__/RequestFormFields.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FormErrorsContext } from '@/forms/client/FormErrorsContext';
import { renderWithIntl } from '@/test/render';
import { RequestFormFields, type RequestFormFieldsProps } from '../_components/RequestFormFields';

const props: RequestFormFieldsProps = {
  legend: 'I am',
  roles: {
    direct_employer: {
      tab: 'Employer',
      title: 'Request candidates from the pool',
      subtitle: 'Full CVs within 4 working hours.',
      companyLabel: 'Company name',
      tradeLabel: 'Which roles and how many workers?',
      messagePlaceholder: 'City, sector and target start date (optional)',
    },
    hr_agency: {
      tab: 'HR agency',
      title: 'Supply for your clients',
      subtitle: 'We supply the workers and file the permits.',
      companyLabel: 'Agency name',
      tradeLabel: 'Which roles do your clients need, and what volume?',
      messagePlaceholder: 'Sectors you serve and cities (optional)',
    },
  },
  labels: { name: 'Contact person', email: 'Email', phone: 'Phone / WhatsApp', city: 'City in Türkiye' },
  startWhenOptions: [
    { value: 'asap', label: 'As soon as possible' },
    { value: 'month1', label: 'Within 1 month' },
  ],
};

describe('RequestFormFields', () => {
  it('renders every catalog-backed field under its catalog name, with the package labels (W115)', () => {
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    for (const name of ['company', 'name', 'email', 'phone', 'city', 'trade', 'headcount', 'startWhen', 'message'])
      expect(container.querySelector(`[name="${name}"]`), name).not.toBeNull();
    // W77/W78: no sector select on `workers`.
    expect(container.querySelector('[name="sector"]')).toBeNull();
    expect(screen.getByLabelText(/^Company name/)).toHaveAttribute('name', 'company');
    expect(screen.getByLabelText(/^Contact person/)).toHaveAttribute('name', 'name');
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^Phone \/ WhatsApp/)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/^City in Türkiye/)).toHaveAttribute('name', 'city');
    expect(screen.getByLabelText(/^Which roles and how many workers\?/)).toHaveAttribute('name', 'trade');
    // Fields without a package label read `sys.form.labels.*` (W30).
    expect(screen.getByLabelText(/^Number of workers/)).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText(/^When do you need them\?/).tagName).toBe('SELECT');
    // The kernel's placeholder option first, then the shared keys the page passes (W78).
    expect(container.querySelectorAll('select[name="startWhen"] option')).toHaveLength(3);
    expect(container.querySelector('[name="trade"]')).toHaveAttribute('maxlength', '200');
  });

  it('employer is selected by default; the head and the message placeholder are the employer copy', () => {
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    expect(screen.getByRole('radio', { name: 'Employer' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'HR agency' })).not.toBeChecked();
    expect(screen.getByRole('heading', { level: 2, name: 'Request candidates from the pool' })).toBeInTheDocument();
    expect(container.querySelector('[name="message"]')).toHaveAttribute(
      'placeholder',
      'City, sector and target start date (optional)',
    );
  });

  it('switching the role swaps the head, the company and roles labels and the message placeholder', async () => {
    const user = userEvent.setup();
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    await user.click(screen.getByRole('radio', { name: 'HR agency' }));
    expect(screen.getByRole('radio', { name: 'HR agency' })).toBeChecked();
    expect(screen.getByRole('heading', { level: 2, name: 'Supply for your clients' })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Agency name/)).toHaveAttribute('name', 'company');
    expect(screen.getByLabelText(/^Which roles do your clients need/)).toHaveAttribute('name', 'trade');
    expect(container.querySelector('[name="message"]')).toHaveAttribute(
      'placeholder',
      'Sectors you serve and cities (optional)',
    );
    // The radio group is what the form posts as `iAm` — no hidden input, no duplicate.
    expect(container.querySelectorAll('[name="iAm"]')).toHaveLength(2);
  });

  it('a failed submit echoes the chosen role back (useFieldValue)', () => {
    renderWithIntl(
      <FormErrorsContext.Provider value={{ errors: {}, values: { iAm: 'hr_agency' } }}>
        <RequestFormFields {...props} />
      </FormErrorsContext.Provider>,
      { locale: 'en' },
    );
    expect(screen.getByRole('radio', { name: 'HR agency' })).toBeChecked();
    expect(screen.getByRole('heading', { level: 2, name: 'Supply for your clients' })).toBeInTheDocument();
  });
});
```

`src/app/[locale]/(site)/available-workers/__tests__/PoolAggregate.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';
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
    const { container } = renderWithIntl(
      <PoolAggregate bundle={testBundle({ strings: STRINGS })} locale="en" />,
      { locale: 'en' },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('derives the four counts from rows and never prints a freshness claim (D17)', () => {
    expect(poolStats(ROWS)).toEqual({ total: 4, ready: 2, countries: 2, trades: 2 });
    renderWithIntl(
      <PoolAggregate bundle={testBundle({ strings: STRINGS, collections: { pool: ROWS } })} locale="en" />,
      { locale: 'en' },
    );
    expect(screen.getByTestId('pool-aggregate')).toBeInTheDocument();
    expect(screen.getByText('CVs in our portal')).toBeInTheDocument();
    expect(screen.getByText('professions listed')).toBeInTheDocument();
    expect(screen.queryByText(/weekly|haftalık/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run available-workers/__tests__/RequestFormFields available-workers/__tests__/PoolAggregate` → both fail at import (`Failed to resolve import "../_components/…"`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/available-workers/_components/RequestFormFields.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { RadioChips } from '@/design/primitives';
import { Field, type FieldOption } from '@/forms/client/Field';
import { useFieldValue } from '@/forms/client/FormErrorsContext';
import { FIELD_MAX, isRoleKey, ROLE_KEYS, type RoleKey } from '../_lib/options';

export type RoleCopy = {
  tab: string;
  title: string;
  subtitle: string;
  /** the package's company field text per role (143 / 150), passed as the label (W115) */
  companyLabel: string;
  /** the design's roles-and-volume field text per role (144 / 151) — the `trade` label */
  tradeLabel: string;
  /** the design's message prompt per role (145 / 152) */
  messagePlaceholder: string;
};

/** Every label is a prop (W9): the island reads no bundle and no package id — the page
 *  resolves the copy and hands it down; fields without a package label read their own
 *  `sys.form.labels.<name>` (W30). */
export type RequestFormFieldsProps = {
  legend: string;
  roles: Record<RoleKey, RoleCopy>;
  labels: { name: string; email: string; phone: string; city: string };
  startWhenOptions: FieldOption[];
};

/**
 * The design's two role tabs (Employer | HR agency) swapping one form's head, labels and
 * prompt. Built as a `RadioChips` group named `iAm` — the value the Operations `workers`
 * catalog expects — so the choice is posted by the form itself, survives a failed submit
 * (`useFieldValue` echoes it), and needs no hidden input. Lives inside `FormShell` (above the
 * fold), so it is a plain client import, not `next/dynamic` (W13).
 */
export function RequestFormFields({ legend, roles, labels, startWhenOptions }: RequestFormFieldsProps) {
  const echoed = useFieldValue('iAm');
  const [role, setRole] = useState<RoleKey>(() => (isRoleKey(echoed) ? echoed : 'direct_employer'));
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
          if (isRoleKey(v)) setRole(v);
        }}
        options={ROLE_KEYS.map((k) => ({ value: k, label: roles[k].tab }))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {/* placeholder="" — the label already names the field; the sys placeholder would repeat it */}
        <Field
          name="company"
          label={copy.companyLabel}
          placeholder=""
          required
          autoComplete="organization"
          maxLength={FIELD_MAX.company}
        />
        <Field
          name="name"
          label={labels.name}
          required
          autoComplete="name"
          maxLength={FIELD_MAX.name}
        />
        <Field
          name="email"
          label={labels.email}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={FIELD_MAX.email}
        />
        <Field
          name="phone"
          label={labels.phone}
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={FIELD_MAX.phone}
        />
        <Field
          name="city"
          label={labels.city}
          required
          autoComplete="address-level2"
          maxLength={FIELD_MAX.city}
        />
        <Field name="trade" label={copy.tradeLabel} required maxLength={FIELD_MAX.trade} />
        <Field name="headcount" type="number" inputMode="numeric" min={1} max={9999} />
        <Field name="startWhen" as="select" options={startWhenOptions} />
      </div>
      <Field
        name="message"
        as="textarea"
        rows={3}
        placeholder={copy.messagePlaceholder}
        maxLength={FIELD_MAX.message}
      />
    </>
  );
}
```

(If the primitives barrel in the tree does not export `RadioChips`, import it from `'@/design/primitives/RadioChips'` — Task 5's Produces lists it under `src/design/primitives`; never add a second component.)

`src/app/[locale]/(site)/available-workers/_components/PoolAggregate.tsx` (server component — no directive, no hooks):

```tsx
import { z } from 'zod';
import { makeTf } from '@/content/pure';
import { Stat } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { poolRows } from '../_lib/pool';

/** Provisional row shape for the counts only (accepted page-local for Phase A) — the v1.1
 *  cards task moves the real schema into `CollectionSchemas.pool`. A row that does not parse
 *  still counts as a CV; unknown keys pass. */
const PoolRowSchema = z
  .object({
    trade: z.string().optional(),
    country: z.string().optional(),
    availability: z.string().optional(),
  })
  .passthrough();
type PoolRow = z.infer<typeof PoolRowSchema>;

export function poolStats(rows: Record<string, unknown>[]) {
  const parsed: PoolRow[] = rows.map((r) => {
    const p = PoolRowSchema.safeParse(r);
    return p.success ? p.data : {};
  });
  const distinct = (pick: (r: PoolRow) => string | undefined) =>
    new Set(parsed.map(pick).filter((v): v is string => Boolean(v))).size;
  return {
    total: parsed.length,
    ready: parsed.filter((r) => r.availability === 'now').length,
    countries: distinct((r) => r.country),
    trades: distinct((r) => r.trade),
  };
}

/**
 * The design's stats strip: "200+ CVs in our portal · ready to start now · countries listed ·
 * professions listed · Updated weekly". W1/W6: no pool number is signed and "200+" is not a
 * metric key, so the strip renders ONLY from pool rows — which a LOCAL bundle can never carry
 * in production (D23) — and never the "Updated weekly" pill (a cadence claim with no source,
 * D17). Returns null while the collection is empty: hidden by data, not deleted.
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

`npx prettier --write "src/app/[locale]/(site)/available-workers"` then `npx vitest run available-workers` → 7 files, 28 tests green (the island renders under the real `sys.form.*` labels through `renderWithIntl`; outside a shell `useFieldValue` reads the context's empty default and `useRegisterField` is a no-op). `npm run verify` → green — in particular `eslint-config-next` 16's React Compiler rules: no state set in an effect, no ref read during render (the role state is seeded by the `useState` initialiser).

- [ ] **Step 5: Commit**

```bash
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 add "src/app/[locale]/(site)/available-workers/_components" "src/app/[locale]/(site)/available-workers/__tests__/RequestFormFields.test.tsx" "src/app/[locale]/(site)/available-workers/__tests__/PoolAggregate.test.tsx"
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 commit -m "feat(workers): RequestFormFields island (role chips → iAm, package labels) and PoolAggregate (null while the pool is empty, W6)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — The page: metadata + sections; `UNBUILT_PATHNAMES` entry deleted (W20); gate route rows (W21); `e2e/pages/workers.spec.ts`

- [ ] **Step 1: Write the failing test**

`e2e/routes.ts` — in `GATE_ROUTE_TABLE`, insert immediately before the `{ path: '/tesekkurler?form=hire', indexable: false }` row (the conversion page stays last):

```ts
  { path: '/adaylar', indexable: true },
  { path: '/en/available-workers', indexable: true },
```

`e2e/pages/workers.spec.ts`:

```ts
import { test, expect, type Page } from '@playwright/test';
import enBundle from '../../src/content/local/bundle.en.json';
import trBundle from '../../src/content/local/bundle.tr.json';
import trMessages from '../../src/messages/tr.json';

const ROUTES = { tr: '/adaylar', en: '/en/available-workers' } as const;
const STRINGS: Record<'tr' | 'en', Record<string, string>> = {
  tr: trBundle.strings,
  en: enBundle.strings,
};
const WA_NUMBER = trBundle.settings.whatsappNumber;
// A `{placed}`-style token = an unfilled W1 metric placeholder; `undefined` = a template leak.
const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;

/** W92: only `staging` carries the door. A door-less deployment answers `unconfigured` here
 *  and the kernel returns `unauthorized` without a network call — deterministic, no lead. */
async function doorless(page: Page): Promise<boolean> {
  const res = await page.request.get('/api/site-health');
  const body = (await res.json()) as { ops?: { state?: string } };
  return body.ops?.state === 'unconfigured';
}

for (const [locale, route] of Object.entries(ROUTES) as ['tr' | 'en', string][]) {
  test(`${route}: one h1, the designed sections in order, no pool-derived element, no leaked token`, async ({
    page,
  }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);

    // Page-markup contract (docs/ARCHITECTURE.md § Quality gate): one h1, tagged; the LCP slot
    // is the h1 (§10 row 4); the hero photo is a NAMED placeholder, never the LCP (D26).
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1[data-testid="page-h1"][data-lcp-slot="h1"]')).toHaveCount(1);
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder="aw-hero"]')).toHaveCount(1);

    // The sections, in the design's order. `#pool` is the header CTA's target (W17).
    const order = ['#pool-form', '#pool', '#verified-steps', '[data-testid="after-you-pick"]', '#faq', '#pool-cta'];
    for (const sel of order) await expect(page.locator(sel), sel).toHaveCount(1);
    const tops = await page.evaluate(
      (sels) => sels.map((s) => document.querySelector(s)!.getBoundingClientRect().top + window.scrollY),
      order,
    );
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);

    await expect(page.getByTestId('workers-form')).toBeVisible();
    await expect(page.getByTestId('workers-form-head')).toBeVisible();
    await expect(page.getByTestId('pool-empty')).toBeVisible();
    await expect(page.locator('#verified-steps li')).toHaveCount(4);
    await expect(page.locator('[data-testid="after-you-pick"] ol li')).toHaveCount(4);
    // Seven FAQ triggers in Phase A (210/211 hidden while the pool is unsigned).
    await expect(page.locator('#faq [data-accordion-trigger]')).toHaveCount(7);
    // W115: the form shows the package's own field texts as labels.
    await expect(page.getByTestId('workers-form').getByLabel(STRINGS[locale]['availworkers.044'])).toHaveCount(1);

    // W6/D2/D23: nothing pool-derived renders — no live badge, no aggregate strip, and the
    // form head is the sys title, not 107's "Request these candidates".
    await expect(page.getByTestId('pool-live')).toHaveCount(0);
    await expect(page.getByTestId('pool-aggregate')).toHaveCount(0);
    await expect(page.getByTestId('workers-form-head')).not.toContainText(STRINGS[locale]['availworkers.107']);

    // JSON-LD this page adds: BreadcrumbList + FAQPage (site-wide Organization is the layout's).
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((s) => s.includes('"BreadcrumbList"'))).toBe(true);
    expect(ld.some((s) => s.includes('"FAQPage"'))).toBe(true);

    // W95: every wa.me link on the page carries only the catalogued prefill (availworkers.224).
    for (const href of await page.locator('main a[href^="https://wa.me/"]').evaluateAll((as) =>
      as.map((a) => a.getAttribute('href') ?? ''),
    ))
      expect(href).toBe(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(STRINGS[locale]['availworkers.224'])}`);

    expect(await page.locator('main').innerText()).not.toMatch(LEAK);
  });
}

test('the request form: a door-less deployment answers the fallback panel, keeps what was typed, and never puts it in an href (W92/W95)', async ({
  page,
}) => {
  await page.goto('/adaylar');
  test.skip(!(await doorless(page)), 'a door is configured here (staging, W92) — real submissions belong to T14');
  const s = STRINGS.tr;
  const labels = trMessages.sys.form.labels;
  const form = page.getByTestId('workers-form');

  // The HR-agency role first: its labels are the package's 150/151 (W115).
  await form.getByRole('radio', { name: s['availworkers.147'] }).check({ force: true });
  await form.getByLabel(s['availworkers.150']).fill('Test Ajans A.Ş.');
  await form.getByLabel(s['availworkers.044']).fill('Gate Runner');
  await form.getByLabel(s['availworkers.045']).fill('gate@example.com');
  await form.getByLabel(s['availworkers.046']).fill('+90 501 124 03 40');
  await form.getByLabel(s['availworkers.047']).fill('Antalya');
  await form.getByLabel(s['availworkers.151']).fill('2 kaynakçı, 3 aşçı');
  await form.getByLabel(labels.headcount).fill('5');
  await form.getByLabel(labels.startWhen).selectOption('month1');
  await form.getByLabel(labels.message).fill('Gate run — please ignore.');
  await form.getByRole('checkbox').check();
  await form.locator('button[type="submit"]').click();

  const panel = form.getByTestId('form-fallback');
  await expect(panel).toBeVisible({ timeout: 15_000 });
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  await expect(panel).toBeFocused();
  // The echo: the role and the typed values survive the failed submit.
  await expect(form.getByRole('radio', { name: s['availworkers.147'] })).toBeChecked();
  await expect(form.getByLabel(s['availworkers.044'])).toHaveValue('Gate Runner');
  // W76/W95: the panel's WhatsApp link is the bare chat; nothing typed sits in any href.
  await expect(panel.locator(`a[href="https://wa.me/${WA_NUMBER}"]`)).toHaveCount(1);
  expect(await page.locator('a[href*="Gate"], a[href*="kaynak"]').count()).toBe(0);
  // …and the prefill is composed at click time (FallbackPanel → window.open).
  await page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
  await panel.locator('a[href^="https://wa.me/"]').click();
  const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(opened).toHaveLength(1);
  expect(decodeURIComponent(opened[0])).toContain('Gate Runner');
  expect(decodeURIComponent(opened[0])).toContain('2 kaynakçı, 3 aşçı');
});

test("the sticky bar carries the design's Call / WhatsApp / Request buttons and tracks the contact click (W81)", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', "the design's sticky bar is the desktop bar");
  await page.goto('/adaylar');
  await page.locator('#verified-steps').scrollIntoViewIfNeeded();
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toBeVisible();
  await expect(bar.locator('a[href^="tel:"]')).toHaveCount(1);
  await expect(bar.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
  await expect(bar.locator('a[href="#pool-form"]')).toHaveCount(1);
  // Keep the run on the page: React's handler (on the root) fires first, then this cancels.
  await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault()));
  await bar.locator('a[href^="tel:"]').click();
  const events = await page.evaluate(() =>
    ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
      (e) => e.event === 'call_click',
    ),
  );
  expect(events).toEqual([expect.objectContaining({ placement: 'page_cta', locale: 'tr' })]);
});

test('the language links keep the visitor on the page (W17)', async ({ page }) => {
  await page.goto('/adaylar');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://www.jobsadmire.com/en/available-workers',
  );
  // The switcher anchor is in the DOM at every viewport (hidden by CSS below the header row).
  await expect(page.locator('a[hreflang="en"]').first()).toHaveAttribute('href', /\/en\/available-workers$/);
  await page.goto('/en/available-workers');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  // `/tr/adaylar` (next-intl's prefixed fallback, folded by the middleware) or `/adaylar`.
  await expect(page.locator('a[hreflang="tr"]').first()).toHaveAttribute('href', /\/adaylar$/);
});
```

- [ ] **Step 2: Run to verify it fails**

One job at a time: `npm run build && npx next start -p 3100` in one terminal, then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/workers.spec.ts --project=desktop` → every case fails: `/adaylar` answers **404** through the `[...rest]` catch-all (`expect(res?.status()).toBe(200)` → 404), and the form/sticky cases find no `workers-form` / `sticky-cta`. `npx vitest run src/lib/seo/unbuilt.test.ts` is still green at this point (no page, key present) — it is the guard that must STAY green after Step 3. Stop the server.

- [ ] **Step 3: Implement**

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` literal, delete the line:

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
import { START_WHEN_KEYS } from '@/forms/options';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { PoolAggregate } from './_components/PoolAggregate';
import { RequestFormFields } from './_components/RequestFormFields';
import { VERIFIED_STEPS, workersFaqItems } from './_lib/content';
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
 * the request form, the vetting steps, the after-you-pick timeline, the FAQ, the sticky bar and
 * the closing band. Everything the design derives from the candidate pool — the "live" badge,
 * the stats strip, the card-presupposing copy (107, 048, 210/211), the cards/filters/basket —
 * renders by data and is therefore absent here: `pool` is a fixture-only collection that LOCAL
 * can never serve in production (D23), and per-profile cards are off behind `pool.cards` (D2).
 * No `<main>` — the `(site)` layout owns it (R31).
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
  // design's seven hard-coded English texts are not ported. No visitor data ever rides here (W95).
  const waHire = waLink(settings.whatsappNumber, tf('availworkers.224'));
  const startWhenOptions = START_WHEN_KEYS.map((k) => ({
    value: k,
    label: sys(`form.options.startWhen.${k}`),
  }));
  // After you pick (design lines 829–875). "Days 1–3" / "Weeks 4–8" are not in the package;
  // the arrival badge renders W1's `firstDayWeeks` and is absent while the metric is unsigned (D17).
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
        {/* The hero photo slot: a named placeholder until §10 row 4 ships — never the LCP
            (D26), decorative (alt ""), faded under the design's navy overlays. */}
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
            className="scroll-mt-5 overflow-hidden rounded-hero border border-white/10 bg-white text-ink shadow-hero-form"
          >
            {/* W79: checkbox consent, the site-wide /privacy link (no consentLinkHref). */}
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
              testId="workers-form"
              className="p-6"
            >
              <RequestFormFields
                legend={sys('form.labels.iAm')}
                roles={{
                  direct_employer: {
                    tab: tf('availworkers.141'),
                    // 107 ("Request these candidates") presupposes visible cards (W6).
                    title: live ? tf('availworkers.107') : sys('workers.form.titles.direct_employer'),
                    subtitle: tf('availworkers.142'),
                    companyLabel: tf('availworkers.143'),
                    tradeLabel: tf('availworkers.144'),
                    messagePlaceholder: tf('availworkers.145'),
                  },
                  hr_agency: {
                    tab: tf('availworkers.147'),
                    title: tf('availworkers.148'),
                    subtitle: tf('availworkers.149'),
                    companyLabel: tf('availworkers.150'),
                    tradeLabel: tf('availworkers.151'),
                    messagePlaceholder: tf('availworkers.152'),
                  },
                }}
                labels={{
                  name: tf('availworkers.044'),
                  email: tf('availworkers.045'),
                  phone: tf('availworkers.046'),
                  city: tf('availworkers.047'),
                }}
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

      {/* 4 — Sticky desktop bar (design 583–597): the design's three buttons (W81 — the bar
          renders tel:/wa.me through ContactLink `page_cta`). Both messages carry the reply-time
          metric, so the bar is absent while it is unsigned (D17); 048 presupposes a visible
          profile and replaces the sys message only once the pool is signed (W6). */}
      {metrics.homepageReplyHours ? (
        <StickyCtaBar
          live={live}
          message={
            live
              ? tf('availworkers.048')
              : sys('workers.sticky.message', { hours: metrics.homepageReplyHours })
          }
          ctas={[
            { label: tf('availworkers.049'), href: telLink(settings.phone), variant: 'secondary' },
            { label: tf('availworkers.050'), href: waHire, variant: 'secondary', external: true },
            { label: tf('availworkers.051'), href: '#pool-form' },
          ]}
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
            steps={VERIFIED_STEPS.map((s) => (s.n === 4 ? { ...s, when: tf('availworkers.081') } : s))}
          />
          <p className="text-body-sm mx-auto mt-7 max-w-[640px] rounded-sm border border-border-2 bg-white px-5 py-3 text-center text-text-secondary">
            {tf('availworkers.083')} <strong className="text-ink">{tf('availworkers.084')}</strong>
          </p>
        </div>
      </Section>

      {/* 10 — After you pick (design 829–875); the test id sits on the inner div (W113) */}
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

      {/* 11 — FAQ (design 877–912): side column + ask card (WhatsApp + e-mail, W83) + accordion;
          FAQPage node inside FaqBlock */}
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
              email: settings.email,
              emailLabelId: 'availworkers.045',
              subject: sys('workers.ask.emailSubject'),
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
            secondary={{
              label: tf('availworkers.109'),
              href: { pathname: '/hire-workers', hash: '#request-form' },
            }}
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
- Every package id goes through `tf` (`makeTf`), never `makeT`: 048/106/142/220 carry `{metric}` tokens after Task 1, and `fill` throws in dev on an unfilled one — the desired failure.
- The three H1 fragments (024/025/026) are the package's own split; 042 + 043 are two package strings side by side. Nothing else is composed from fragments (W23).
- `Button href="#pool"`, the sticky `#pool-form` CTA and the empty state's `#pool-form` render plain same-page anchors (not `/`-rooted); `Button href="/work-permit"`/`"/hire-workers"` and the closing band's object href render the typed next-intl `Link` (W82 → `/isci-talebi#request-form` under `tr`).
- Contact doors on this page, all `placement: 'page_cta'`: hero WhatsApp (`ContactCta`), form-footer WhatsApp (`ContactLink`), sticky Call + WhatsApp (`StickyCtaBar` → `ContactLink`, W81), FAQ ask card WhatsApp + e-mail (W83), closing WhatsApp (`ClosingCtaBand` → `ContactCta`), licence e-mail (`ContactLink`). Every `wa.me` href carries only `availworkers.224` (W95).
- The `ImageSlot` sits in a faded, `aria-hidden` layer; the LCP is the h1 (`data-lcp-slot="h1"`); the placeholder counter (Task 7) sees `data-placeholder="aw-hero"` on a non-LCP element.
- Do not reach for `getMetric`: `metricValues` already formats per locale; an unsigned value (`''`) hides the sticky bar / the arrival badge instead of printing an empty string (D17).
- `hideNearId="pool-cta"`, not the form: the form sits above the bar's 700 px threshold, and `isBarVisible` hides the bar while the named element's top is above 90 % of the viewport — naming the form would hide the bar for the rest of the page.

- [ ] **Step 4: Run tests + `npm run verify` + the e2e against a local build**

1. `npx prettier --write "src/app/[locale]/(site)/available-workers" e2e/pages/workers.spec.ts e2e/routes.ts src/lib/seo/routes.ts`
2. `npx vitest run src/lib/seo available-workers scripts` → green (the UNBUILT set and the filesystem agree again; the route table's derived lists still equal the table — if a `scripts/` test pins the row count, raise it by 2 in this commit).
3. `npm run verify` → green.
4. `npm run build` (the only job running) — expect `/[locale]/available-workers` in the route list (static or dynamic, whichever its `(site)` siblings show), no `'use server'` export error, no `server-only` import reached from a client file (the island imports only `_lib/options.ts`).
5. `npx next start -p 3100` (no `OPS_API_URL` in the shell or `.env.local` — the door-less case, W92), then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/workers.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts` (both projects) → green: the page contract and canonical/hreflang loops include the two new routes, the sitemap lists them and every `<loc>` answers 200, axe reports zero violations on both routes under both projects (check specifically: the radio group is labelled through its sr-only legend; the decorative slot is `aria-hidden`; the two `Section tone="pale"` blocks keep `text-text-secondary` on `pale-1`; the white form head text on `blue-safe → navy`), and no width in the sweep overflows (the hero grid stacks below `lg`; the `sm:grid-cols-2` field grid stacks below 561 px). Stop the server.
6. Local Lighthouse advisory (R50): `E2E_BASE_URL=http://localhost:3100 npm run gate` (server restarted) → the script-size assertion on `/adaylar` and `/en/available-workers` ≤ 204,800 B; `npm run js-size` prints the per-route row — note it for the ledger. If a route is over 194,560 B (the lazy line), wrap `StickyCtaBar` in a page-local `'use client'` file that `next/dynamic`s it with `ssr: false` (it renders `null` on the server anyway) **before** starting the next page — W13 amended.

- [ ] **Step 5: Commit**

```bash
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 add "src/app/[locale]/(site)/available-workers/page.tsx" src/lib/seo/routes.ts e2e/routes.ts e2e/pages/workers.spec.ts
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 commit -m "feat(workers): /adaylar + /en/available-workers — request form to the workers door, sticky bar, vetting steps, after-you-pick timeline, FAQ, closing band; pool-derived elements render by data (W6/D2/D23); gate rows + UNBUILT entry (W20/W21)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

(If step 2 raised a pinned row count in `scripts/`, add that file to this commit too.)

---

#### Cycle 5 — Preview gate + ledger numbers; docs in the same change set (SEO, ANALYTICS, CONTENT-MODEL, PRD)

- [ ] **Step 1: Run the binding gate against the Vercel preview (the local run is never sign-off, R50)**

`git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 push origin wp2/foundation` (a preview, never `main`); wait for the preview — a door-less deployment (every branch but `staging`, W92). Then, in the worktree: `E2E_BASE_URL=https://<preview>.vercel.app VERCEL_AUTOMATION_BYPASS_SECRET=<ACCESS.md — never pasted anywhere else> REVALIDATE_SECRET=<the server's> npm run gate` (the bypass header and `lighthouserc.preview.json` come from WP2a Task 7, W91), followed by `npm run js-size`. Record for **both** `/adaylar` and `/en/available-workers`: gzipped script bytes (worst run), the Lighthouse mobile scores performance / accessibility / best-practices / SEO, LCP ms, CLS. Expected: performance ≥ 0.95, the other three = 1.0, script ≤ 204,800 B, LCP ≤ 2,500 ms. The form e2e case runs (site-health reports `unconfigured`) and asserts `data-kind="unauthorized"` — it files no lead. `lighthouse-report/content-readiness.json` for these routes: `lcpSlot: "h1"`, `placeholders: ["aw-hero"]`, `problems: []`.

- [ ] **Step 2: Verify the numbers are within budget**

A failure is fixed in the component, never by lowering an assertion (D20). Script over the ceiling → the `StickyCtaBar` lazy wrapper from Cycle 4 step 6; an axe violation → fix the markup; an SEO miss → check the two `sys.seo.workers.*` strings against Lighthouse's `document-title`/`meta-description` audits. Re-run the gate after any fix and commit the fix with its own test before continuing.

- [ ] **Step 3: Implement — docs (anchored on headings and sentences, W45/W98)**

`docs/SEO.md` — append this row to the `## Pages` table T1 created (columns Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes):

```md
| Available Workers | `/adaylar` · `/en/available-workers` | `sys.seo.workers.{title,description}` — the package has no SEO string for this page, so `pages.workers.titleId`/`descriptionId` are `''` (W23/W38); OG image `/og/{locale}/workers.png` | self via `buildMetadata` (`absoluteUrl`, tr/en/x-default `localeAlternates`) | site-wide Organization/EmploymentAgency + WebSite (layout); `BreadcrumbList` (`Breadcrumbs`: availworkers.021 → 022, W109); `FAQPage` (`FaqBlock`: 7 pairs in Phase A, 8 once the pool is signed) | `h1` (`data-lcp-slot="h1"`); `aw-hero` is a named placeholder, never the LCP (D26) | Pool-derived elements render by data and are absent in Phase A (D2/D23/W6); filtered pool views (v1.1) canonicalise to this page (PRD) |
```

`docs/ANALYTICS.md` — append this bullet at the end of the list under `### Page instrumentation (WP2b)`:

```md
- **Available Workers (`/adaylar`, `/en/available-workers`, T8):** no page-specific event. `call_click` / `whatsapp_click` / `email_click` with `placement: 'page_cta'` from the hero "Ask for profiles", the form footer "Prefer WhatsApp?", the sticky bar's Call and WhatsApp buttons (`StickyCtaBar` → `ContactLink`, W81), the FAQ ask card's WhatsApp and e-mail rows (W83), the closing band's WhatsApp and the licence-line e-mail; the kernel's fallback panel adds its `placement: 'form_fallback'` clicks; the thank-you page's `ConversionPing` fires the `workers` conversion. Every `wa.me` link carries only the catalogued prefill `availworkers.224` — nothing typed ever sits in an href (W95). The design's `pool_filter` / `pool_sort` / `pool_load_more` / `pool_popular_pick` / `pool_form_role` / `pool_form_submit` / `profile_select` / `profile_unselect` are not ported: the cards are off (D2), and their `profiles` / `ref` / `trade` / `country` parameters are candidate identifiers or free text the allowlist forbids (D13).
```

`docs/CONTENT-MODEL.md` — append this bullet at the end of the per-page list under `### Adding copy (W9, W23, W54)`:

```md
- **Available Workers (`sys.workers.*`, T8):** `pool.{heading,intro}`, `empty.{title,body,cta}` (the designed empty state that stands in for the pool while no rows are signed, W6), `sticky.message` (ICU `{hours}` = `homepageReplyHours`; the package's `availworkers.048` replaces it once the pool is signed), `form.titles.direct_employer` (the employer form head; `availworkers.107` replaces it once the pool is signed), `timeline.{days1to3,arrival}` (`{weeks}` = `firstDayWeeks`), `ask.emailSubject` (the FAQ ask card's mailto subject); plus `seo.workers.{title,description}`. The `startWhen` labels are the shared `sys.form.options.startWhen.*` (W78). The form's field labels are the package's own texts (`availworkers.143/150`, `044`–`047`, `144/151`, W115). Package copy that presupposes visible cards (`availworkers.031`–`038`, `052`–`071`, `225`–`250`, and 023/048/107/210/211 until the pool is signed) is not rendered in Phase A; the two FAQ answers the design keeps only in JavaScript (218, 221) render their package twins `wp.350` and `hire.302`.
```

`docs/PRD.md` — in the §2 page table, replace the row whose second cell is `Available Workers` with:

```md
| 10  | Available Workers             | `/adaylar`                                 | `/en/available-workers`      | Request form (`INQUIRY`, key `workers`; role chips → `iAm`; the typed roles-and-volume field → `trade` (W77); `city` required (catalog v1.1); `country: TR`; optional `headcount`, `startWhen` (shared keys, W78), `message`) + sticky bar, vetting steps, after-you-pick timeline, FAQ. Aggregate strip and per-profile cards render only from signed pool data — hidden in Phase A (D2, W6); the `pool` fixture can never be served in production (D23) |
```

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append to the ledger table (T1's row format, W98) with the Step 1 numbers:

```md
| T8 Available Workers | `/adaylar` · `/en/available-workers` | script gz: `/adaylar` <n> B · `/en/available-workers` <n> B (ceiling 204,800; lazy line 194,560) | LH mobile: perf <x.xx> · a11y <x.xx> · bp <x.xx> · SEO <x.xx> · LCP <n> ms · CLS <n> (worst of both routes); preview <url> | pixel: n/a — not a D27 harness page (Homepage, Cost Calculator, Hire Workers, Blog Article); side-by-side review; named deltas: visible labels, headcount/startWhen/message fields, empty state for cards, fallback/thank-you instead of inline success, sticky "Request workers" → `#pool-form` | <YYYY-MM-DD> |
```

(also copied into the git-ignored `.superpowers/` progress file the controller keeps).

- [ ] **Step 4: Run `npm run verify`**

`npx prettier --write docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md` then `npm run verify` → green (`prettier --check .` is part of it — the tables get re-aligned by Prettier, which is expected).

- [ ] **Step 5: Commit**

```bash
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 commit -m "docs(workers): SEO pages row, page instrumentation bullet, sys.workers copy bullet, PRD row; T8 ledger row (script size, Lighthouse)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/SEO.md` — one row appended to the `## Pages` table (title source `sys.seo.workers.*`, self canonical, BreadcrumbList + FAQPage, LCP slot `h1`, `aw-hero` placeholder). `docs/ANALYTICS.md` — one bullet appended under `### Page instrumentation (WP2b)` (no page event; the `page_cta` contact doors incl. the sticky bar (W81) and the ask card's e-mail row (W83); the unported `pool_*`/`profile_*` events and why). `docs/CONTENT-MODEL.md` — one bullet appended to the per-page list under `### Adding copy (W9, W23, W54)` (`sys.workers.*` + `sys.seo.workers.*`, the shared `startWhen` labels, the package labels, the card-presupposing ids, the two reused legal twins). `docs/PRD.md` — the §2 table row whose second cell is "Available Workers" (form key and fields, hidden aggregate/cards, D23). `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T8 ledger row. Owner/legal asks recorded for WP-C: `availworkers.106` ("Send us the profile numbers you liked…") and `availworkers.222` ("…to see the profiles?") presuppose cards and render as authored — a Phase A rewording is a marketing decision; `wp.350` ("track the status live on your portal") and `hire.302` (replacement guarantee) are legal-flagged answers reused in this page's context and go on the legal review sheet.

**Sys keys added:** `sys.seo.workers.title`, `sys.seo.workers.description`, `sys.workers.pool.heading`, `sys.workers.pool.intro`, `sys.workers.empty.title`, `sys.workers.empty.body`, `sys.workers.empty.cta`, `sys.workers.sticky.message`, `sys.workers.form.titles.direct_employer`, `sys.workers.timeline.days1to3`, `sys.workers.timeline.arrival`, `sys.workers.ask.emailSubject` — 12 keys, each in both `src/messages/tr.json` and `src/messages/en.json`. Consumed, not added: `sys.form.labels.{iAm,headcount,startWhen,message}` (WP2a Task 2), `sys.form.options.startWhen.{asap,month1,months1to3,planning}` (WP2a Task 5, W78), `sys.form.consent.*`, `sys.form.fallback.*`, `sys.thankYou.forms.workers`.

**Package ids used:** 93 ids, every one verified present in `src/content/local/catalogue.json` (and in both bundles' `strings`) at `5891e30`: `availworkers.021`–`030` (023 only when the pool is signed), `041`–`051` (048 only when the pool is signed; 045 also as the ask card's e-mail label), `055`–`058` (inside `PoolAggregate`, rows only), `072`–`084`, `085`–`099`, `100`–`110` (107 only when the pool is signed, as the employer form head), `141`–`152`, `210`–`224` (210/211 only when the pool is signed); plus `hire.302` (221's answer) and `wp.350` (218's answer). First: `availworkers.021` · last: `wp.350`. Field labels passed per W115: 143/150 (company), 044 (name), 045 (email), 046 (phone), 047 (city), 144/151 (trade). Re-authored ids read through `makeTf`: 048, 106, 142, 220. Not rendered: 031–040, 052–054, 059–071, 138–140, 153, 154–209, 225–250.

**Foundation gaps:** none. Two accepted page-local items (reconcile list): (1) `CollectionSchemas` has no `pool` entry, so `poolRows` reads `bundle.collections.pool` raw and `PoolAggregate` parses a provisional row shape for the counts — the v1.1 cards task adds the schema and switches to `getCollection(bundle, 'pool')`; (2) `FormShell.submitLabel` is one static string, so the design's role-dependent submit label (146 employer / 153 HR agency) renders as 146 for both roles.

**Ledger line spec:** `| T8 Available Workers | /adaylar · /en/available-workers | script gz per route (ceiling 204,800 B; lazy line 194,560 B) from npm run js-size | Lighthouse mobile perf · a11y · best-practices · SEO (≥0.95 / 1.0 / 1.0 / 1.0), LCP ms, CLS, preview URL | pixel: n/a (not a D27 page) + named deltas | date |` — T1's row format (W98), filled from the Cycle 5 Step 1 preview run.
