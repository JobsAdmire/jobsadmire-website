### Task 2: Hire Workers — `/isci-talebi` · `/en/hire-workers` (pixel-harness page, D27)

**Why this task exists.** The route is the site's main employer conversion page (design-package page 2, `design-package/design/Hire Workers.dc.html`, strings `hire.001`–`hire.302`). WP1 shipped it as a spike; WP2a Task 3 moved it into `(site)/` and WP2a Task 7 tagged its h1 `page-h1` + `data-lcp-slot="h1"`. This task replaces the spike with the designed page on the WP2a foundation: two `hire` forms through the forms kernel (W3 — the quick-quote gains the door's required contact `name`; `city` rides as the catalog v1.1 field, W16), the `sectors`/`sourceCountries`/`countries`/`metrics` collections (W1), the pre-rendered `SourceMap` + flag sprite (W14), the blocks (`Breadcrumbs`, `FaqBlock`, `ProcessSteps`, `ImageSlot`, `StoreBadges`, `LogoMarquee`, `ContactCta`), the page-mounted `StickyCtaBar` (W18/W81) and the D26 LCP/placeholder markup contract. Every number is a metric (W1/D17), every string is a package id read through `makeTf` or a `sys.*` key (W9/W23), every option value is a stable key (W3/W77/W78), every contact anchor fires its click event with a placement (W12).

Every path below is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` (never the shared `jobsadmire-website` checkout). **Execution order (W99):** T1 → T13 → **T2** → T3 → …; by the time this task runs, T1 has created the shared doc anchors (W98: the `docs/SEO.md` `## Pages` table, `docs/ANALYTICS.md` `### Page instrumentation (WP2b)`, the per-page bullet list under `docs/CONTENT-MODEL.md` `### Adding copy`, the WP2b ledger table), and T13 has made `/privacy` (the consent link target) and the footer legal links resolve. WP2a Tasks 3–9, with the additions in `.superpowers/sdd/2026-09-20-wp2a-foundation/task-{3,5,6,7}-additions.md`, are merged; this task consumes them as landed. For `src/forms/**` the real code at HEAD (`8a69889`, the Task 2 fix round + controller addendum) is the contract, not the older produces text.

**Rulings in force:** W1 (metrics from the collection; unsigned → hidden), W3 (door-required fields added as design deltas; stable option keys), W7 (`hire.043` via the importer override table; store-badge micro-copy English), W9/W23 (id-less copy → `sys.hire.*`; the page record carries `hire.264`/`hire.265`, so **no** `sys.seo.hire.*`), W10 (≤460 px / ≤700 px variants via CSS classes, both in the DOM), W12/W32 (every `tel:`/`wa.me`/`mailto:` anchor is a `ContactCta`/`ContactLink` with `placement: 'page_cta'`), W13 amended + W85 (204,800 B ceiling, 194,560 B lazy line, `LazyIsland` for any lazy pass), W14 (build-time map + local flag sprite), W16 (`city` on the wire), W17 (`CTA_BY_PATHNAME` has no `/hire-workers` entry → the header renders `DEFAULT_CTAS` → `{ pathname: '/hire-workers', hash: '#request-form' }`; this page **must** render the id `request-form`), W18 + W81 (the sticky bar publishes `--sticky-cta-h`, renders `tel:`/`wa.me` CTAs through `ContactLink` `page_cta`, and carries `data-testid="sticky-cta"`), W19 (`(site)` group), W20/W21 (no `UNBUILT_PATHNAMES` key for this route; both locale rows already in `GATE_ROUTE_TABLE`), W45/W98 (doc edits anchor on sentences/headings and append to T1's shared tables), W73/W74/W76 (kernel as built: 9 s single attempt + one connection-level retry; bare `wa.me` fallback href, prefill composed at click time), **W77/W78** (`sector` = the sector key; `startWhen` = the shared `START_WHEN_KEYS` from `@/forms/options` with the `sys.form.options.startWhen.*` labels — the page-local `'1-2m'`/`'3m+'` vocabulary is gone), **W79** (consent is a checkbox on BOTH forms; the kernel's `notice` mode is not used; the package KVKK sentences `hire.064`/`065`/`217`/`218` are not rendered and go to the WP-C legal sheet; pages omit `consentLinkHref` — the site-wide default `/privacy`), W82 (block hrefs accept typed hrefs — this page passes strings), W91/W92 (the binding gate reaches the protected preview through the automation-bypass header; previews are **door-less** except the `staging` branch, so this page's e2e asserts the `unauthorized` fallback deterministically), **W95** (no visitor data in any DOM href: the page's own `wa.me` links carry only package prefills; the "send this request by e-mail" link carries only the subject), **W109** (breadcrumbs use this page's own labels `hire.020` → `/`, `hire.002` → this page), W111 (`Field as="select"` ignores `placeholder` — accepted), W113 (section test ids sit on inner `<div>`s / raw `<section>`s — `Section`'s props stay frozen), **W115** (the package ships the field labels `hire.047`–`hire.058` — they are passed as `label`; `sys.form.labels.*` is the fallback only for `message`), D11/D13 (success → `/tesekkurler?form=hire`; failure → the D11 fallback panel), D17, D20 (accessibility over pixel fidelity), D26, D27.

**Route facts (read before touching anything):** internal key `/hire-workers` → TR `/isci-talebi`, EN `/en/hire-workers` (`src/i18n/routing.ts`, `pathnames`). The page record `bundle.pages.hire` = `{ titleId: 'hire.264', descriptionId: 'hire.265', robots: 'index', jsonLd: ['breadcrumb', 'faq'] }`. `CTA_BY_PATHNAME` has no `/hire-workers` entry (WP2a Task 3) → `DEFAULT_CTAS` → `#request-form`. `e2e/routes.ts` `GATE_ROUTE_TABLE` already lists `/isci-talebi` and `/en/hire-workers` as `indexable: true` (WP2a Task 7) and `UNBUILT_PATHNAMES` never contained `/hire-workers` (WP2a Task 4) — this task **adds no route and deletes no key**; Cycle 5 asserts both facts instead of editing them.

**Design deltas this page carries (named, so the pixel harness tolerates them — D20/D27):**
1. Success navigates to `/tesekkurler?form=hire` instead of the inline "Request sent" panel (`hire.045`/`046` unused); the request form's submit reads `hire.063` ("İşçi talep edin →" / "Request Workers →", the quick-quote's own CTA) instead of `hire.216` "Send Request on WhatsApp →" (D13). `hire.201`/`203`/`215` ("continues on WhatsApp") render as authored — `hire.201` is legal-flagged and goes to the WP-C sheet with a note that the form now posts to the team first.
2. Both forms gain the kernel's consent **checkbox** (W79) with the site-wide `sys.form.consent.label` sentence linking `/privacy`; the design's KVKK lines (`hire.064`+`065` under the quick-quote, `hire.217`+`065`+`218` under the request form) are not rendered (WP-C legal sheet).
3. The quick-quote card gains a required **Contact person** field (`hire.053`, W3); the design's placeholder-only inputs get visible labels (the package's own `hire.047`–`058`, W115) with the kernel's example placeholders.
4. The request form gains an optional **Message** textarea (label `sys.form.labels.message`; the brief names `message`; it replaces the free text the WhatsApp mock flow carried) and its dial select posts an ISO-2 code (the design's `+90`-valued options are not unique — `+1`/`+7`) with the full `countries` collection (64 rows) instead of the design's 13.
5. The "When do you need them?" options use the shared W78 vocabulary and labels (`sys.form.options.startWhen.{asap,month1,months1to3,planning}`) instead of the design's `hire.059`–`062` ("1–2 months", "3+ months" do not map onto the shared keys); `hire.059`–`062` go to the WP-C sheet as unused.
6. The industries rows use the foundation `Accordion` (string trigger), so the four visible role chips sit inside the panel with the "More roles" chips rather than in the trigger row (an interactive arrow nested in a clickable row fails axe).
7. The sourcing map is the build-time SVG without the hover tooltip (W14); the flag chips wrap statically from 701 px and scroll in a pausable marquee below it.
8. The client-logo band renders nothing until logos with consent exist (§10 #11, W6) — the `employers` stat that sits beside it is hidden with it.
9. The hero photo slot `hw-hero` is a named placeholder until the licensed stock pack lands (§10 #4) — the h1 is the LCP element until then (D26).
10. White-on-brand-blue surfaces (the quick-quote and request-card headers, the industries "More roles" panel, the numbered request steps) use `blue-safe` instead of the design's `#1899D5` → `#1073a8` gradient, and every grey text uses `text-tertiary` instead of `#94a3b8` (D20 contrast: `#94a3b8` and white-on-`#1899D5` fail AA for body-size text).
11. `hire.043` renders as corrected by the importer's override table (W7); the sticky bar is the foundation's navy bar (WP2a Task 5) rather than the design's white one.

**Files:**

Create
- `src/app/[locale]/(site)/hire-workers/actions.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/tables.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/fragments.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/phone.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/hire-spec.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/assets.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/tables.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/fragments.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/phone.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/hire-spec.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/hire-workers/_components/SectorPrefillLink.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hire-workers/_components/__tests__/SectorPrefillLink.test.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Hero.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/QuickQuote.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/JumpNav.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/ClientLogos.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Industries.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/SourceCountries.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Comparison.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Process.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/PortalPreview.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/Faq.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/RequestForm.tsx`
- `e2e/pages/hire-workers.spec.ts`

Modify
- `src/app/[locale]/(site)/hire-workers/page.tsx` — replace the whole file (the WP1 spike as moved by WP2a Task 3 and tagged by WP2a Task 7)
- `src/messages/tr.json`, `src/messages/en.json` — add the `sys.hire` object (6 keys) as a sibling of `sys.form`
- `docs/SEO.md` — one row in the `## Pages` table T1 created
- `docs/ANALYTICS.md` — one bullet under `### Page instrumentation (WP2b)`
- `docs/CONTENT-MODEL.md` — one bullet in the per-page list under `### Adding copy`
- `docs/PRD.md` — §2 row 2 (Hire Workers) and the §11 "Not yet built" sentence's Hire-Workers clause
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T2 ledger row

Test
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/*.test.ts` (5 files, Vitest)
- `src/app/[locale]/(site)/hire-workers/_components/__tests__/SectorPrefillLink.test.tsx` (Vitest + RTL)
- `e2e/pages/hire-workers.spec.ts` (Playwright, both projects)
- existing, must stay green untouched: `e2e/routing.spec.ts`, `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts`, `e2e/chrome.spec.ts`, `src/lib/seo/unbuilt.test.ts`, `src/messages/messages.test.ts`

**Interfaces:**

Consumes (exact names; verified against the real code where it exists, else against `wp2a/produces-final.md` + the WP2a additions):
- WP1: `getBundle`, `makeT`, `makeTf`, `metricValues` (`@/content/adapter` — `adapter.ts` does `export * from './pure'`), `routing`, `type Locale` (`@/i18n/routing`), `Link` (`@/i18n/navigation`), `buildMetadata` (`@/lib/seo/metadata`), `waLink`/`telLink`/`mailLink` (`@/lib/contact`), `Accordion`, `type AccordionItem`, `Eyebrow`, `PausableMarquee` (`{ children, durationSec, labelPause, labelPlay }`), `Section` (`@/design/primitives`), `sys.marquee.pause`/`sys.marquee.play`, `sys.form.labels.message`, `sys.form.hints.optional`, `sys.form.consent.label`, `sys.form.placeholders.*`, `sys.form.fallback.*`, `type Bundle` (`contract/website-bundle.v1`, six levels up from `_sections/`).
- WP2a Task 1 (`@/content/collections`): `getCollection(bundle, 'sectors' | 'sourceCountries' | 'countries')`, `type Sector`, `SECTOR_KEYS`, `type SectorKey`; `metricValues(bundle, locale)` keys `placed` (`'470+'`), `countries` (`'13'`), `employers` (`'22+'`); `settings.{phone, phoneDisplay, email, whatsappNumber, turnstileSiteKey, storeLinks.{android, ios}, portal.host}`.
- WP2a Task 2 (real code, `src/forms/**` at `8a69889`): `createFormAction`, `type FormActionState`, `type FormActionContext` (`{ visitor, locale }` — `toFields(parsed, data, ctx)`) from `@/forms/action`; `FormActionError` (`new FormActionError(visitorMessage, field?)`, `.field: { name; code }`) from `@/forms/types`; `fieldErrorsFromIssues` from `@/forms/errors`; `type WireFields` from `@/forms/wire`; `FormShell` (`@/forms/client/FormShell`) props `action, formKey, locale, turnstileSiteKey, whatsappNumber, whatsappIntro, contact, submitLabel, consent, idScope, headingLevel, testId` (ids derive from `idScope ?? formKey` → `f-<scope>-<name>`; honeypot `f-<scope>-honeypot`; consent `f-<scope>-consent`); `Field` (`@/forms/client/Field`) props `name, label, hint, placeholder, required, as, type, options, autoComplete, inputMode, min, rows, maxLength, defaultValue`; `type FieldOption`; the FallbackPanel `data-testid="form-fallback"` + `data-kind`, its WhatsApp anchor `href="https://wa.me/<number>"` (bare, W76) with the prefilled URL opened through `window.open` on click.
- WP2a Task 3: `ContactLink` (`@/analytics/ContactLink`, `{ href, placement, className, children }`), `PARAM_ENUMS.placement` value `page_cta`, `DEFAULT_CTAS` → `#request-form` contract, the `(site)` route group.
- WP2a Task 4: `buildMetadata` (`pageKey: 'hire'`; the record's non-empty `titleId`/`descriptionId` win over the fallbacks), `UNBUILT_PATHNAMES` (read only).
- WP2a Task 5 (+ additions W78/W81/W82): `Breadcrumbs` (`{ locale, items: Crumb[], tone?, className? }`), `FaqBlock` (`{ bundle, locale, items, id?, eyebrowId?, headingId?, bodyId?, askCard?, singleOpen?, openFirst?, headingLevel? }`), `type FaqItem`, `ProcessSteps` (`{ bundle, locale, steps, variant?, headingLevel? }`), `type ProcessStep`, `ImageSlot` (`{ slot, lcp?, src?, alt, width, height, sizes?, className?, priority? }`), `StoreBadges` (`{ bundle, locale, android, ios?, tone? }`), `LogoMarquee` (`{ logos, durationSec? }`), `type Logo`, `ContactCta` (`{ placement, href, variant?, size?, external?, className?, children }`) from `@/design/blocks`; `Section` tones `light | pale`, `ButtonVariant` `inverse`; `StickyCtaBar` (`{ message, ctas, showAfterPx?, hideNearId?, live? }`) + `type StickyCta` from `@/design/chrome/StickyCtaBar` (renders `null` while hidden; wrapper `data-testid="sticky-cta"`; `tel:`/`wa.me` CTAs through `ContactLink` `page_cta`); `START_WHEN_KEYS` (`['asap','month1','months1to3','planning']`) + `type StartWhenKey` from `@/forms/options`; `sys.form.options.startWhen.{asap,month1,months1to3,planning}`; `sys.nav.breadcrumbs` (read by `Breadcrumbs`).
- WP2a Task 6: `SourceMap` (`{ title, labels, turkiyeLabel, id?, className? }`, markers `<g data-country="<CODE>">` with `<title>`), `sourceMapLabels(rows)` from `@/design/assets/source-map`; `Flag` (`{ code, size?, label?, className? }`, `<use href="/brand/flags.svg#flag-<CODE>">`) from `@/design/Flag`; `isFlagCode` from `@/design/assets/flag-codes`; `LazyIsland` (`@/design/islands/LazyIsland`, W85 — only if the js-size pass needs it).
- WP2a Task 7 (+ W91/W94): `GATE_ROUTE_TABLE` (read only), `npm run gate` (bypass header on previews, `lighthouserc.preview.json`), `npm run js-size`, `npm run pixel -- --page=hire --locale=tr|en --base=<url>`, the page markup contract (`page-h1`, one `data-lcp-slot`, named `data-placeholder`s).
- WP2a Task 8: Operations catalog v1.1 `hire` fields — `name*` (≤120), `company*` (≤200), `email*` (≤254), `phone*` (≤40, ≥ 8 digits), `city` (≤120), `sector` (≤120), `roleNeeded` (≤200), `headcount` (≤10), `startWhen` (≤120), `message` (≤5000) (`apps/backend/src/modules/website/website-form-catalog.ts` + W16's `city`). Not sent: `country`, `iAm` (optional; the design never asks).
- WP2b T1/T13: the shared doc anchors (W98) and `/privacy`.

Produces (for T14's instance map and the header CTA — nothing imports these files):
- DOM: `#request-form` (the section the header CTA and the sticky bar target), `form[data-testid="hire-form-quick"]` (≥ 701 px only, `idScope` `hire-quick`) and `form[data-testid="hire-form-full"]` (`idScope` `hire-full`), both `data-form-key="hire"`, both with the consent checkbox (`#f-hire-quick-consent`, `#f-hire-full-consent`).
- Wire (`hire`): quick-quote → `name, company, email, phone` (a TR national number normalised to `+90…`), `city, roleNeeded, headcount`; request form → `name, company, email, phone` (dial + national number → one `+<dial><digits>` string), `sector` (sector key), `roleNeeded, headcount`, and when filled `city`, `startWhen` (W78 key), `message`.
- The Partner task (HR-agency track → `hire`) may copy the `phone.ts` pattern; it copies, never imports across route folders.

---

#### Cycle 1 — page-local tables, fragment joiner, phone composer, form specs, `sys.hire` copy (pure code, red → green)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/tables.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { SECTOR_KEYS } from '@/content/collections';
import { COMPARE_ROWS, FAQ_PAIRS, INDUSTRIES, PROCESS_STEPS } from '../tables';

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `hire.${String(from + i).padStart(3, '0')}`);

describe('INDUSTRIES (design rows 01–06 → sectors collection keys)', () => {
  it('lists the six placeable sectors in design order, never `other`', () => {
    expect(INDUSTRIES.map((r) => r.key)).toEqual([
      'factory',
      'construction',
      'tourism',
      'agriculture',
      'textile',
      'logistics',
    ]);
    for (const row of INDUSTRIES) expect(SECTOR_KEYS).toContain(row.key);
  });

  it('uses every one of the 41 role ids hire.089–hire.129 exactly once', () => {
    const used = INDUSTRIES.flatMap((r) => [...r.visibleRoleIds, ...r.moreRoleIds]);
    expect(new Set(used).size).toBe(used.length);
    expect([...used].sort()).toEqual(range(89, 129));
  });

  it('carries the six per-sector CTA ids hire.130–135 in order', () => {
    expect(INDUSTRIES.map((r) => r.ctaId)).toEqual(range(130, 135));
  });
});

describe('COMPARE_ROWS', () => {
  it('is 5 + 5 title/body pairs over hire.150–169 in order', () => {
    expect(COMPARE_ROWS.own.map((r) => r.titleId)).toEqual(
      [150, 152, 154, 156, 158].map((n) => `hire.${n}`),
    );
    expect(COMPARE_ROWS.own.map((r) => r.bodyId)).toEqual(
      [151, 153, 155, 157, 159].map((n) => `hire.${n}`),
    );
    expect(COMPARE_ROWS.with.map((r) => r.titleId)).toEqual(
      [160, 162, 164, 166, 168].map((n) => `hire.${n}`),
    );
    expect(COMPARE_ROWS.with.map((r) => r.bodyId)).toEqual(
      [161, 163, 165, 167, 169].map((n) => `hire.${n}`),
    );
  });
});

describe('PROCESS_STEPS', () => {
  it('is six numbered steps over hire.271–288 (when, title, body per step)', () => {
    expect(PROCESS_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PROCESS_STEPS.flatMap((s) => [s.whenId, s.titleId, s.bodyId])).toEqual(
      range(271, 288),
    );
  });
});

describe('FAQ_PAIRS', () => {
  it('is seven q/a pairs over hire.289–302 with unique ids', () => {
    expect(FAQ_PAIRS).toHaveLength(7);
    expect(FAQ_PAIRS.flatMap((p) => [p.qId, p.aId])).toEqual(range(289, 302));
    expect(new Set(FAQ_PAIRS.map((p) => p.id)).size).toBe(7);
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/fragments.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { sp } from '../fragments';

describe('sp — the joiner between two package fragments the design glues with {{ }}', () => {
  it('inserts one space between two words', () => {
    expect(sp('Hire verified overseas', 'workers')).toBe(' ');
    expect(sp("Türkiye'de", 'belgeli yabancı işçi')).toBe(' ');
  });
  it('inserts nothing before closing punctuation or after trailing whitespace', () => {
    expect(sp('470+ yerleştirme', ", Türkiye'deki işverenler")).toBe(''); // hire.191 + hire.192 (TR)
    expect(sp('hiring cost calculator', '.')).toBe(''); // hire.178 + hire.179 (EN)
    expect(sp('Vetted talent from ', '13')).toBe('');
  });
  it('inserts nothing when either side is empty (hire.141 TR is deliberately empty)', () => {
    expect(sp('', '13')).toBe('');
    expect(sp('13', '')).toBe('');
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/phone.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { composePhone, dialForCode, normalisePhone } from '../phone';

const countries = [
  { code: 'TR', name: 'Türkiye', dial: '+90' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'US', name: 'United States', dial: '+1' },
];

describe('dialForCode', () => {
  it('returns the dial for a known ISO2 code and null otherwise', () => {
    expect(dialForCode(countries, 'PK')).toBe('+92');
    expect(dialForCode(countries, 'tr')).toBe('+90'); // case-insensitive at the edge
    expect(dialForCode(countries, 'XX')).toBeNull();
    expect(dialForCode(countries, '')).toBeNull();
  });
});

describe('composePhone (request form: dial select + national number)', () => {
  it('concatenates dial + digits, dropping a trunk 0 and formatting noise', () => {
    expect(composePhone('+90', '0532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '(532) 000-00-00')).toBe('+905320000000');
    expect(composePhone('+92', '300 1234567')).toBe('+923001234567');
  });
  it('trusts a full international number the visitor typed (never doubles or swaps the dial)', () => {
    expect(composePhone('+90', '+90 532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '0090 532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '+49 151 2345678')).toBe('+491512345678');
  });
  it('keeps a bare digit string when the dial is empty, and returns "" for no digits', () => {
    expect(composePhone('', '5320000000')).toBe('5320000000');
    expect(composePhone('+90', 'abc')).toBe('');
  });
});

describe('normalisePhone (quick-quote: one free-text field, no dial)', () => {
  it('keeps an international number, strips noise', () => {
    expect(normalisePhone('+90 532 000 00 00')).toBe('+905320000000');
    expect(normalisePhone('0090 532 000 00 00')).toBe('+905320000000');
  });
  it('treats an 11-digit 0-led number as Turkish national (the card serves employers in Türkiye)', () => {
    expect(normalisePhone('0532 000 00 00')).toBe('+905320000000');
  });
  it('leaves anything else as digits only, so the door decides (≥ 8 digits rule)', () => {
    expect(normalisePhone('532 000 00 00')).toBe('5320000000');
    expect(normalisePhone('abc')).toBe('');
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/hire-spec.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { FormActionError } from '@/forms/types';
import { fullSchema, fullToFields, quickSchema, quickToFields } from '../hire-spec';

const countries = [
  { code: 'TR', name: 'Türkiye', dial: '+90' },
  { code: 'DE', name: 'Germany', dial: '+49' },
];

describe('quickSchema / quickToFields (hero quick-quote → `hire`)', () => {
  const ok = {
    company: 'Acme Tekstil A.Ş.',
    name: 'Ayşe Yılmaz',
    city: 'Bursa',
    roleNeeded: 'kaynakçı, paketleme',
    headcount: '12',
    phone: '0532 000 00 00',
    email: 'AYSE@ACME.COM.TR',
  };

  it('accepts the designed fields plus the W3 contact name', () => {
    expect(quickSchema.safeParse(ok).success).toBe(true);
  });

  it('reads empty values as `required` before any format rule (email, phone, headcount)', () => {
    const r = quickSchema.safeParse({ ...ok, name: '', email: '', phone: '', headcount: '' });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(fieldErrorsFromIssues(r.error.issues)).toMatchObject({
        name: 'required',
        email: 'required',
        phone: 'required',
        headcount: 'required',
      });
  });

  it('flags a bad email as `email`, a short phone as `phone`, a non-integer headcount as `invalid`', () => {
    const r = quickSchema.safeParse({ ...ok, email: 'nope', phone: '12 34', headcount: '10-15' });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(fieldErrorsFromIssues(r.error.issues)).toMatchObject({
        email: 'email',
        phone: 'phone',
        headcount: 'invalid',
      });
  });

  it('maps onto the exact catalog names and normalises the phone', () => {
    expect(quickToFields(quickSchema.parse(ok))).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Acme Tekstil A.Ş.',
      email: 'AYSE@ACME.COM.TR', // the door lower-cases; the website sends what was typed
      phone: '+905320000000',
      city: 'Bursa',
      roleNeeded: 'kaynakçı, paketleme',
      headcount: '12',
    });
  });
});

describe('fullSchema / fullToFields (request form → `hire`)', () => {
  const ok = {
    company: 'Acme',
    name: 'Mehmet Kaya',
    email: 'mehmet@acme.com',
    dial: 'TR',
    phone: '532 000 00 00',
    sector: 'factory',
    roleNeeded: 'welder',
    headcount: '5',
    city: '',
    startWhen: '',
    message: '',
  };

  it('accepts a minimal valid submission (city, startWhen, message optional)', () => {
    expect(fullSchema.safeParse(ok).success).toBe(true);
  });

  it('accepts the shared W78 startWhen keys and refuses the retired page-local ones', () => {
    for (const key of ['asap', 'month1', 'months1to3', 'planning'])
      expect(fullSchema.safeParse({ ...ok, startWhen: key }).success).toBe(true);
    const r = fullSchema.safeParse({ ...ok, startWhen: '1-2m' });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrorsFromIssues(r.error.issues).startWhen).toBe('invalid');
  });

  it('refuses a sector label or a malformed dial (W3/W77: stable keys only)', () => {
    const r = fullSchema.safeParse({ ...ok, sector: 'Fabrika / Üretim', dial: 'ZZZ' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrorsFromIssues(r.error.issues);
      expect(errors.sector).toBe('invalid');
      expect(errors.dial).toBe('invalid');
    }
  });

  it('reads an empty sector as `required` and a 33-character phone as `max`', () => {
    const r = fullSchema.safeParse({ ...ok, sector: '', phone: '5'.repeat(33) });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrorsFromIssues(r.error.issues);
      expect(errors.sector).toBe('required');
      expect(errors.phone).toBe('max');
    }
  });

  it('composes dial + phone into one value and omits empty optionals', () => {
    expect(fullToFields(fullSchema.parse(ok), countries)).toEqual({
      name: 'Mehmet Kaya',
      company: 'Acme',
      email: 'mehmet@acme.com',
      phone: '+905320000000',
      sector: 'factory',
      roleNeeded: 'welder',
      headcount: '5',
    });
  });

  it('sends city, startWhen and message when present', () => {
    const fields = fullToFields(
      fullSchema.parse({ ...ok, city: 'Antalya', startWhen: 'month1', message: 'Night shift.' }),
      countries,
    );
    expect(fields).toMatchObject({ city: 'Antalya', startWhen: 'month1', message: 'Night shift.' });
  });

  it('throws a field-scoped FormActionError when the dial code is not in the countries list', () => {
    const parsed = fullSchema.parse({ ...ok, dial: 'XX' });
    expect(() => fullToFields(parsed, countries)).toThrow(FormActionError);
    try {
      fullToFields(parsed, countries);
    } catch (e) {
      expect((e as FormActionError).field).toEqual({ name: 'dial', code: 'invalid' });
    }
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { START_WHEN_KEYS } from '@/forms/options';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** The page's composed copy (W9/W23) — the frozen key set both message files must carry. */
const SYS_HIRE_KEYS = [
  'whatsapp',
  'jump.label',
  'sc.titleTail',
  'sc.mapTitle',
  'sc.turkiye',
  'form.dial',
] as const;

type Tree = Record<string, unknown>;
const flatten = (o: Tree, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const sysOf = (file: unknown) => (file as { sys: Tree }).sys;

describe('sys.hire.*', () => {
  it('exists with the same key set in both locales', () => {
    const trKeys = flatten(sysOf(tr).hire as Tree).sort();
    const enKeys = flatten(sysOf(en).hire as Tree).sort();
    expect(trKeys).toEqual([...SYS_HIRE_KEYS].sort());
    expect(enKeys).toEqual(trKeys);
  });

  it('keeps the source-countries tail Turkish-only (EN is the empty string on purpose)', () => {
    const tail = (file: unknown) =>
      ((sysOf(file).hire as Tree).sc as Record<string, string>).titleTail;
    expect(tail(tr)).toBe(' belgeli işçiler');
    expect(tail(en)).toBe('');
  });

  it('can label every shared startWhen key (W78, WP2a Task 5) in both locales', () => {
    for (const file of [tr, en]) {
      const labels = ((sysOf(file).form as Tree).options as Tree).startWhen as Record<
        string,
        string
      >;
      for (const key of START_WHEN_KEYS) expect(labels[key]?.trim().length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test -- hire-workers
```
→ all five files fail: `../tables`, `../fragments`, `../phone`, `../hire-spec` cannot be resolved, and `sys-keys.test.ts` throws on `sysOf(tr).hire` being `undefined` (its third case already passes — WP2a Task 5 shipped the option labels).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_lib/tables.ts`:

```ts
import type { SectorKey } from '@/content/collections';

/**
 * The page's markup-only structures as id tables (docs/CONTENT-MODEL.md § Collections: the
 * grouping of role chips, the comparison pairs, the process steps and the FAQ pairs exist in
 * the design only as markup, so Phase A carries them as page-local constants over package
 * ids — never as copy). Every id here is a real `hire.*` id (asserted by tables.test.ts).
 */
export type IndustryRow = {
  key: Exclude<SectorKey, 'other'>;
  /** the four (three) chips the design shows in the row at rest */
  visibleRoleIds: readonly string[];
  /** the chips inside the expanded panel under hire.136 */
  moreRoleIds: readonly string[];
  ctaId: string;
};

export const INDUSTRIES: readonly IndustryRow[] = [
  {
    key: 'factory',
    visibleRoleIds: ['hire.089', 'hire.090', 'hire.091', 'hire.092'],
    moreRoleIds: ['hire.093', 'hire.094', 'hire.095', 'hire.096'],
    ctaId: 'hire.130',
  },
  {
    key: 'construction',
    visibleRoleIds: ['hire.097', 'hire.098', 'hire.099', 'hire.100'],
    moreRoleIds: ['hire.101', 'hire.102', 'hire.103', 'hire.104'],
    ctaId: 'hire.131',
  },
  {
    // The design repeats rRecept (hire.108) in the row and the panel; it is listed once.
    key: 'tourism',
    visibleRoleIds: ['hire.105', 'hire.106', 'hire.107', 'hire.108'],
    moreRoleIds: ['hire.109', 'hire.110', 'hire.111'],
    ctaId: 'hire.132',
  },
  {
    key: 'agriculture',
    visibleRoleIds: ['hire.112', 'hire.113', 'hire.114'],
    moreRoleIds: ['hire.115', 'hire.116', 'hire.117'],
    ctaId: 'hire.133',
  },
  {
    key: 'textile',
    visibleRoleIds: ['hire.118', 'hire.119', 'hire.120'],
    moreRoleIds: ['hire.121', 'hire.122', 'hire.123'],
    ctaId: 'hire.134',
  },
  {
    key: 'logistics',
    visibleRoleIds: ['hire.124', 'hire.125', 'hire.126'],
    moreRoleIds: ['hire.127', 'hire.128', 'hire.129'],
    ctaId: 'hire.135',
  },
];

export type CompareRow = { titleId: string; bodyId: string };
export const COMPARE_ROWS: { own: readonly CompareRow[]; with: readonly CompareRow[] } = {
  own: [
    { titleId: 'hire.150', bodyId: 'hire.151' },
    { titleId: 'hire.152', bodyId: 'hire.153' },
    { titleId: 'hire.154', bodyId: 'hire.155' },
    { titleId: 'hire.156', bodyId: 'hire.157' },
    { titleId: 'hire.158', bodyId: 'hire.159' },
  ],
  with: [
    { titleId: 'hire.160', bodyId: 'hire.161' },
    { titleId: 'hire.162', bodyId: 'hire.163' },
    { titleId: 'hire.164', bodyId: 'hire.165' },
    { titleId: 'hire.166', bodyId: 'hire.167' },
    { titleId: 'hire.168', bodyId: 'hire.169' },
  ],
};

export type ProcessStepIds = { n: number; whenId: string; titleId: string; bodyId: string };
export const PROCESS_STEPS: readonly ProcessStepIds[] = [1, 2, 3, 4, 5, 6].map((n) => {
  const base = 271 + (n - 1) * 3;
  return { n, whenId: `hire.${base}`, titleId: `hire.${base + 1}`, bodyId: `hire.${base + 2}` };
});

export type FaqPairIds = { id: string; qId: string; aId: string };
export const FAQ_PAIRS: readonly FaqPairIds[] = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  id: `q${n}`,
  qId: `hire.${289 + (n - 1) * 2}`,
  aId: `hire.${290 + (n - 1) * 2}`,
}));
```

`src/app/[locale]/(site)/hire-workers/_lib/fragments.ts`:

```ts
/**
 * The design glues split package fragments with bare `{{ a }}{{ b }}` and lets ja-i18n.js
 * space them. W23 allows composing exactly those fragments; this is the one joiner the page
 * uses, so "Hire verified overseas" + "workers" gets its space and "470+ yerleştirme" +
 * ", Türkiye'deki…" (hire.191 + hire.192 TR) does not.
 */
export function sp(prev: string, next: string): ' ' | '' {
  if (!prev || !next) return '';
  if (/\s$/.test(prev) || /^\s/.test(next)) return '';
  if (/^[,.;:!?)\]…]/.test(next)) return '';
  return ' ';
}
```

`src/app/[locale]/(site)/hire-workers/_lib/phone.ts`:

```ts
/** The catalog keeps `phone` as typed (≥ 8 digits, ≤ 40 chars); E.164 is the handler's job.
 *  The page still sends one clean value so the door's digit rule and the inbox read the same
 *  number. Pure — no copy, no collection access. */
export type DialCountry = { code: string; dial: string };

export function dialForCode(countries: readonly DialCountry[], code: string): string | null {
  const upper = code.trim().toUpperCase();
  if (upper.length !== 2) return null;
  return countries.find((c) => c.code === upper)?.dial ?? null;
}

const digitsOnly = (s: string) => s.replace(/\D/g, '');

/** Request form: `dial` from the country select (`+90`) + the national number as typed. A
 *  number the visitor typed in full international form (`+…` or `00…`) is trusted as is. */
export function composePhone(dial: string, national: string): string {
  let n = national.trim();
  if (n.startsWith('00')) n = `+${n.slice(2)}`;
  const digits = digitsOnly(n);
  if (!digits) return '';
  if (n.startsWith('+')) return `+${digits}`;
  const dialDigits = digitsOnly(dial);
  if (!dialDigits) return digits;
  return `+${dialDigits}${digits.replace(/^0+/, '')}`;
}

/** Quick-quote: one free-text field on a card for employers in Türkiye — an 11-digit 0-led
 *  number is national; anything else is sent as digits and the door decides. */
export function normalisePhone(raw: string): string {
  let n = raw.trim();
  if (n.startsWith('00')) n = `+${n.slice(2)}`;
  const digits = digitsOnly(n);
  if (!digits) return '';
  if (n.startsWith('+')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+90${digits.slice(1)}`;
  return digits;
}
```

`src/app/[locale]/(site)/hire-workers/_lib/hire-spec.ts`:

```ts
import { z } from 'zod';
import { SECTOR_KEYS } from '@/content/collections';
import { START_WHEN_KEYS } from '@/forms/options';
import { FormActionError } from '@/forms/types';
import type { WireFields } from '@/forms/wire';
import { composePhone, dialForCode, normalisePhone, type DialCountry } from './phone';

/** `.min(1)` before every format rule so an empty value reads `required` (kernel convention,
 *  src/forms/errors.ts). Caps mirror the Operations catalog (website-form-catalog.ts). */
const required = (max: number) => z.string().trim().min(1).max(max);
const email = z.string().trim().min(1).max(254).email();
const phoneOf = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .regex(/(\D*\d){8,}/, { message: 'phone' });
const headcount = z
  .string()
  .trim()
  .min(1)
  .max(10)
  .regex(/^[1-9]\d{0,9}$/, { message: 'invalid' });

/** Hero quick-quote: the design's six fields + the door-required contact `name` (W3). */
export const quickSchema = z.object({
  company: required(200),
  name: required(120),
  city: required(120),
  roleNeeded: required(200),
  headcount,
  phone: phoneOf(40),
  email,
});
export type QuickInput = z.infer<typeof quickSchema>;

export function quickToFields(p: QuickInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: normalisePhone(p.phone),
    city: p.city,
    roleNeeded: p.roleNeeded,
    headcount: p.headcount,
  };
}

/** Request form: dial + national number (≤ 32 chars, so dial + digits stay under the door's
 *  40), the sector KEY (W77), the shared startWhen KEY (W78), optional city (catalog v1.1,
 *  W16) and message. An empty select is `required`, a value outside the key set `invalid` —
 *  a localized label never travels on the wire. */
export const fullSchema = z.object({
  company: required(200),
  name: required(120),
  email,
  dial: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z]{2}$/, { message: 'invalid' }),
  phone: phoneOf(32),
  sector: z.string().trim().min(1).pipe(z.enum(SECTOR_KEYS, { message: 'invalid' })),
  roleNeeded: required(200),
  headcount,
  city: z.string().trim().max(120).optional(),
  startWhen: z
    .union([z.literal(''), z.enum(START_WHEN_KEYS, { message: 'invalid' })])
    .optional(),
  message: z.string().trim().max(5000).optional(),
});
export type FullInput = z.infer<typeof fullSchema>;

export function fullToFields(p: FullInput, countries: readonly DialCountry[]): WireFields {
  const dial = dialForCode(countries, p.dial);
  if (!dial) throw new FormActionError('', { name: 'dial', code: 'invalid' });
  const fields: WireFields = {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: composePhone(dial, p.phone),
    sector: p.sector,
    roleNeeded: p.roleNeeded,
    headcount: p.headcount,
  };
  if (p.city) fields.city = p.city;
  if (p.startWhen) fields.startWhen = p.startWhen;
  if (p.message) fields.message = p.message;
  return fields;
}
```

`FormActionError` is imported from `@/forms/types` (where it is defined; `@/forms/action` re-exports it but is `server-only` and pulls `next/headers` into a pure module). The empty `visitorMessage` is deliberate: with `field` set, the action answers `fieldErrors` and the message is never shown.

`src/app/[locale]/(site)/hire-workers/_lib/assets.ts`:

```ts
import type { Logo } from '@/design/blocks';

/** §10 #4: the licensed stock hero lands here as `/hero/hire-workers.jpg` (1440×640). Until
 *  then the slot is a named placeholder and the h1 is the LCP element (D26, WP2a Task 7). */
export const HERO_SRC: string | null = null;
export const HERO_SIZE = { width: 1440, height: 640 } as const;

/** §10 #11: client logos with consent are v1.1 — the band stays hidden (W6) until rows exist. */
export const CLIENT_LOGOS: readonly Logo[] = [];
```

`src/messages/tr.json` — insert as a sibling of `sys.form`: immediately before the line `    "form": {` (four spaces — the one followed by `      "labels": {`), add:

```json
    "hire": {
      "whatsapp": "WhatsApp",
      "jump": {
        "label": "Sayfa içi bölümler"
      },
      "sc": {
        "titleTail": " belgeli işçiler",
        "mapTitle": "Kaynak ülkeler haritası — Türkiye'ye işçi temin ettiğimiz ülkeler",
        "turkiye": "Türkiye"
      },
      "form": {
        "dial": "Ülke kodu"
      }
    },
```

`src/messages/en.json` — same position:

```json
    "hire": {
      "whatsapp": "WhatsApp",
      "jump": {
        "label": "On this page"
      },
      "sc": {
        "titleTail": "",
        "mapTitle": "Source countries map — where we source workers for Türkiye from",
        "turkiye": "Türkiye"
      },
      "form": {
        "dial": "Country code"
      }
    },
```

Why these six and nothing else: `whatsapp` is the design's literal brand-name CTA label (hero + sticky bar); `jump.label` is the mobile jump nav's `aria-label`; `sc.titleTail` is the runtime dictionary's `scTitleC`, which has no package id (TR ` belgeli işçiler`, EN empty); `sc.mapTitle` is the SVG's accessible name; `sc.turkiye` is `SourceMap`'s required `turkiyeLabel` (W60 — copy, not code); `form.dial` labels the dial select (the design's select is unlabelled and the package has no id for it). Every field label with a package id is that id (W115); the request form's submit reuses `hire.063`, so no `sys.hire.form.submit` exists. The page reads `sc.titleTail` through `sys.raw(...)` (an ICU-free read that returns `''` for the empty EN value). The two TR apostrophes (`Türkiye'ye`) are literal in ICU (an apostrophe quotes only before `{`, `}`, `#`, `|` or `'`).

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers/_lib" src/messages/tr.json src/messages/en.json
npm test -- hire-workers src/messages
npm run verify
```
→ the five page test files pass; `src/messages/messages.test.ts` still passes (identical key sets, no empty `sys.form` leaf); typecheck/lint/prettier clean. One job at a time (Mac Studio rule).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/_lib" src/messages/tr.json src/messages/en.json
git commit -m "feat(hire): page-local id tables, fragment joiner, phone composer, hire form specs, sys.hire copy

Stable keys on the wire: sector keys (W77) and the shared START_WHEN_KEYS (W78); field
caps mirror the Operations catalog v1.1 (city, W16).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — the sector prefill island

The design's dial select needs no island any more: `Field` now takes `defaultValue` (Task 2 addendum), so the request form's dial is a plain `Field as="select" defaultValue="TR"` (Cycle 3).

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/hire-workers/_components/__tests__/SectorPrefillLink.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SectorPrefillLink } from '../SectorPrefillLink';

const requestForm = (options: string[]) => (
  <section id="request-form">
    <form>
      <select name="sector" defaultValue="">
        <option value=""></option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </form>
  </section>
);

describe('SectorPrefillLink', () => {
  it('is a plain same-page anchor to #request-form', () => {
    render(<SectorPrefillLink sector="factory">Fabrika işçisi talep edin →</SectorPrefillLink>);
    expect(screen.getByRole('link', { name: 'Fabrika işçisi talep edin →' })).toHaveAttribute(
      'href',
      '#request-form',
    );
  });

  it('prefills the request form’s sector select on click and leaves the anchor navigation alone', async () => {
    render(
      <>
        {requestForm(['factory', 'textile'])}
        <SectorPrefillLink sector="textile">Tekstil</SectorPrefillLink>
      </>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Tekstil' }));
    expect((document.querySelector('select[name="sector"]') as HTMLSelectElement).value).toBe(
      'textile',
    );
  });

  it('does nothing when the option does not exist (never throws in front of a visitor)', async () => {
    render(
      <>
        {requestForm([])}
        <SectorPrefillLink sector="factory">x</SectorPrefillLink>
      </>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'x' }));
    expect((document.querySelector('select[name="sector"]') as HTMLSelectElement).value).toBe('');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test -- hire-workers/_components
```
→ the file fails to import `../SectorPrefillLink`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_components/SectorPrefillLink.tsx`:

```tsx
'use client';
import type { ReactNode } from 'react';
import type { SectorKey } from '@/content/collections';

/**
 * The industries panel's "Request <sector> workers →" CTA. The design (`requestInd1..6`)
 * pre-selects the request form's sector and scrolls to it; here it is a real anchor to
 * `#request-form` (works without JS, keyboard-reachable, tracked by nothing — it is not a
 * contact door) whose click also sets the form's `sector` select before the hash navigation
 * runs. The select is the kernel's uncontrolled `Field`, so setting `.value` and dispatching
 * `change` is the whole hand-off; no cross-island state, nothing in the URL (W95).
 */
export function SectorPrefillLink({
  sector,
  className,
  children,
}: {
  sector: SectorKey;
  className?: string;
  children: ReactNode;
}) {
  const prefill = () => {
    const select = document.querySelector<HTMLSelectElement>(
      '#request-form select[name="sector"]',
    );
    if (!select) return;
    if (!Array.from(select.options).some((o) => o.value === sector)) return;
    select.value = sector;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  };
  return (
    <a href="#request-form" onClick={prefill} className={className}>
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers/_components"
npm test -- hire-workers
npm run verify
```
→ six page test files green; verify clean.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/_components"
git commit -m "feat(hire): SectorPrefillLink island — the industries CTA prefills the request form's sector

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — the server actions and the two forms (quick-quote, request form)

- [ ] **Step 1: Write the failing test**

Create `e2e/pages/hire-workers.spec.ts` with the form cases (Cycle 4 appends the section cases to the same file):

```ts
import { test, expect, type Locator, type Page } from '@playwright/test';

const ROUTES = { tr: '/isci-talebi', en: '/en/hire-workers' } as const;
const WA = 'https://wa.me/905011240340';
const isMobile = () => test.info().project.name === 'mobile';

/** W92: page e2e runs against a door-less face (localhost without door variables, or any
 *  preview except `staging`), so every valid submit ends on the D11 fallback panel with
 *  `data-kind="unauthorized"` — never a spinner, never a fake thank-you. T14 proves the
 *  door end to end on `staging`. */
async function fillFull(form: Locator) {
  await form.getByLabel(/Firma adı|Company name/).fill('Acme A.Ş.');
  await form.getByLabel(/İletişim kişisi|Contact person/).fill('Ayşe Yılmaz');
  await form.getByLabel(/Kurumsal e-posta|Work email/).fill('ayse@acme.example');
  await form.getByLabel(/Ülke kodu|Country code/).selectOption('TR');
  await form.getByLabel(/Telefon \/ WhatsApp|Phone \/ WhatsApp/).fill('0532 000 00 00');
  await form.getByLabel(/Sektör|Industry/).selectOption('factory');
  await form.getByLabel(/İhtiyaç duyulan pozisyonlar|Roles needed/).fill('kaynakçı');
  await form.getByLabel(/İşçi sayısı|Number of workers/).fill('5');
  await form.getByRole('checkbox').check(); // W79: the consent tick
}

/** W76/W95: the fallback anchor's href is the bare chat; the prefilled URL (what the visitor
 *  typed) exists only in the window the click opens. */
async function expectBareWhatsAppFallback(page: Page, panel: Locator, typed: string) {
  const link = panel.getByRole('link', { name: /WhatsApp/ });
  await expect(link).toHaveAttribute('href', WA);
  await page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
  await link.click();
  const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(opened).toHaveLength(1);
  expect(opened[0].startsWith(`${WA}?text=`)).toBe(true);
  expect(decodeURIComponent(opened[0].split('?text=')[1])).toContain(typed);
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: the request form validates on the server and shows the fallback panel without a door`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const form = page.getByTestId('hire-form-full');
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute('data-form-key', 'hire');
    const submit = form.getByRole('button', { name: /İşçi talep edin|Request Workers/ });
    // 1. Empty submit → field errors (incl. the consent tick), no navigation.
    await submit.click();
    await expect(form.getByRole('alert').first()).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(ROUTES[locale]);
    // 2. Valid submit → the door is not configured → fallback panel (D11), still no navigation.
    await fillFull(form);
    await submit.click();
    const panel = form.getByTestId('form-fallback');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
    expect(new URL(page.url()).pathname).toBe(ROUTES[locale]);
    // 3. The typed values survive the failed submit (echo) and reach WhatsApp only on click.
    await expect(form.getByLabel(/Firma adı|Company name/)).toHaveValue('Acme A.Ş.');
    await expectBareWhatsAppFallback(page, panel, 'Acme A.Ş.');
  });
}

test('tr: the hero quick-quote is a second `hire` form on desktop and a CTA pair on mobile', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  // idScope keeps the two hire shells' ids apart (no duplicate id, no cross-wired label).
  await expect(page.locator('#f-hire-quick-consent')).toHaveCount(1);
  await expect(page.locator('#f-hire-full-consent')).toHaveCount(1);
  const quick = page.getByTestId('hire-form-quick');
  if (isMobile()) {
    await expect(quick).toBeHidden();
    await expect(
      page.getByTestId('hire-quick-mobile').getByRole('link', { name: /İşçi talep edin/ }),
    ).toHaveAttribute('href', '#request-form');
    return;
  }
  await expect(quick).toBeVisible();
  await quick.getByLabel(/Firma adı/).fill('Acme');
  await quick.getByLabel(/Hangi şehirde/).fill('Bursa');
  await quick.getByLabel(/İletişim kişisi/).fill('Ali Veli');
  await quick.getByLabel(/İhtiyaç duyulan pozisyonlar/).fill('kaynakçı');
  await quick.getByLabel(/Kaç kişi/).fill('3');
  await quick.getByLabel(/Telefon \/ WhatsApp/).fill('0532 000 00 00');
  await quick.getByLabel(/Kurumsal e-posta/).fill('ali@acme.example');
  await quick.getByRole('checkbox').check(); // W79: a checkbox here too, never the notice mode
  await quick.getByRole('button', { name: /İşçi talep edin/ }).click();
  const panel = quick.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  await expectBareWhatsAppFallback(page, panel, 'Ali Veli');
});
```

- [ ] **Step 2: Run to verify it fails**

The build must see no door variables (W92: page e2e is door-less) — no `OPS_API_URL`/`OPS_WEBSITE_WRITE_TOKEN` in the shell or a `.env.local`. One build/test job at a time (Mac Studio rule).

```bash
npm run build
npx next start -p 3100 & SERVER=$!; sleep 5
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/hire-workers.spec.ts
kill $SERVER
```
→ every case fails on `getByTestId('hire-form-full')` / `#f-hire-quick-consent` (the spike renders only an h1).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/actions.ts`:

```ts
'use server';
import { getBundle } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { createFormAction, type FormActionState } from '@/forms/action';
import { fullSchema, fullToFields, quickSchema, quickToFields } from './_lib/hire-spec';

/** Hero quick-quote → `hire`. W79: a consent checkbox like every door form (the kernel's
 *  `notice` mode is not used in Phase A). */
const runQuick = createFormAction({
  key: 'hire',
  schema: quickSchema,
  consent: 'checkbox',
  toFields: (p) => quickToFields(p),
});

/** Request form → `hire`. The dial → country lookup reads the request locale's `countries`
 *  collection (identical per locale except `name`). */
const runFull = createFormAction({
  key: 'hire',
  schema: fullSchema,
  consent: 'checkbox',
  toFields: async (p, _data, { locale }) =>
    fullToFields(p, getCollection(await getBundle(locale), 'countries')),
});

export async function submitHireQuick(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runQuick(prev, data);
}

export async function submitHireFull(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runFull(prev, data);
}
```

`src/app/[locale]/(site)/hire-workers/_sections/QuickQuote.tsx` (server component — the card in the hero's right column; the form is hidden ≤700 px by CSS and the CTA pair shown, exactly as the design does at ≤700 px):

```tsx
import { ContactCta } from '@/design/blocks';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { submitHireQuick } from '../actions';

export function QuickQuote({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const s = bundle.settings;
  const trust = (
    <p className="m-0 flex flex-wrap items-center justify-center gap-x-2 text-body-sm text-text-tertiary">
      <span>{tf('hire.042')}</span>
      <span aria-hidden="true">·</span>
      <span>{tf('hire.043')}</span>
      <span aria-hidden="true">·</span>
      <span>{tf('hire.044')}</span>
    </p>
  );
  return (
    <div
      data-testid="hire-quick-card"
      className="overflow-hidden rounded-hero border border-white/10 bg-white text-ink shadow-hero-form"
    >
      <div className="bg-blue-safe px-7 py-5 text-white">
        <h2 className="m-0 mb-1 text-card-title">{tf('hire.037')}</h2>
        <p className="m-0 text-body-sm text-white">
          <span className="hidden md:inline">{tf('hire.038')}</span>
          <span className="md:hidden">{tf('hire.039')}</span>
        </p>
      </div>
      <div className="px-7 pb-6 pt-6">
        {/* ≤700 px: the design replaces the form with two CTAs + the trust trio. */}
        <div data-testid="hire-quick-mobile" className="flex flex-col gap-2.5 md:hidden">
          <ContactCta placement="page_cta" href="#request-form" size="lg" className="w-full">
            {tf('hire.040')}
          </ContactCta>
          <ContactCta
            placement="page_cta"
            href={waLink(s.whatsappNumber, tf('hire.250'))}
            variant="secondary"
            external
            className="w-full"
          >
            {tf('hire.041')}
          </ContactCta>
          {trust}
        </div>
        <div className="hidden md:block">
          <FormShell
            action={submitHireQuick}
            formKey="hire"
            idScope="hire-quick"
            locale={locale}
            turnstileSiteKey={s.turnstileSiteKey}
            whatsappNumber={s.whatsappNumber}
            whatsappIntro={tf('hire.250')}
            contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
            submitLabel={tf('hire.063')}
            consent="checkbox"
            testId="hire-form-quick"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                name="company"
                label={tf('hire.047')}
                required
                autoComplete="organization"
                maxLength={200}
              />
              <Field
                name="city"
                label={tf('hire.048')}
                required
                autoComplete="address-level2"
                maxLength={120}
              />
            </div>
            <Field
              name="name"
              label={tf('hire.053')}
              required
              autoComplete="name"
              maxLength={120}
            />
            <Field name="roleNeeded" label={tf('hire.049')} required maxLength={200} />
            <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
              <Field
                name="headcount"
                label={tf('hire.050')}
                type="number"
                min={1}
                required
                inputMode="numeric"
              />
              {/* hint="" drops the kernel's "include the country code" hint: a Turkish
                  national number is normalised to +90 (phone.ts) */}
              <Field
                name="phone"
                label={tf('hire.051')}
                type="tel"
                required
                hint=""
                autoComplete="tel"
                inputMode="tel"
                maxLength={40}
              />
            </div>
            <Field
              name="email"
              label={tf('hire.052')}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              maxLength={254}
            />
          </FormShell>
          <div className="mt-3">{trust}</div>
          <a
            href="#request-form"
            className="mt-4 block border-t border-border-3 pt-4 text-center text-body-sm font-bold text-blue-safe no-underline hover:text-ink"
          >
            {tf('hire.066')}
          </a>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/RequestForm.tsx` (server component — section `#request-form`, the header CTA's and the sticky bar's target):

```tsx
import { ContactLink } from '@/analytics/ContactLink';
import { getCollection } from '@/content/collections';
import { Section } from '@/design/primitives';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { submitHireFull } from '../actions';

const STEPS = [
  ['hire.202', 'hire.203'],
  ['hire.204', 'hire.205'],
  ['hire.206', 'hire.207'],
] as const;

const TILE =
  'min-w-0 items-center gap-3 rounded-xs border border-border-2 bg-pale-1 px-3.5 py-3 no-underline hover:bg-tint';

export function RequestForm({
  bundle,
  locale,
  tf,
  dialLabel,
  startWhenOptions,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** sys.hire.form.dial — resolved by the page */
  dialLabel: string;
  /** START_WHEN_KEYS (W78) with their sys.form.options.startWhen.* labels — resolved by the page */
  startWhenOptions: FieldOption[];
}) {
  const s = bundle.settings;
  const sectors: FieldOption[] = getCollection(bundle, 'sectors').map((row) => ({
    value: row.key,
    label: tf(row.labelId),
  }));
  // T0b: file order = code order; sorted by the locale's collation at the edge.
  const dials: FieldOption[] = getCollection(bundle, 'countries')
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, locale))
    .map((c) => ({ value: c.code, label: `${c.name} ${c.dial}` }));
  return (
    <Section tone="pale" id="request-form" className="scroll-mt-20">
      <div
        className="container-site grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
        data-testid="hire-request"
      >
        <div>
          <p className="m-0 mb-4 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-4 py-1.5 text-body-sm font-extrabold text-success-text">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
            {tf('hire.199')}
          </p>
          <h2 className="m-0 mb-4 text-h2">{tf('hire.200')}</h2>
          <p className="m-0 mb-7 text-body-lg text-text-secondary">{tf('hire.201')}</p>
          {/* the three numbered steps are hidden ≤700 px in the design */}
          <ol className="m-0 hidden list-none flex-col gap-4 p-0 md:flex">
            {STEPS.map(([lead, tail], i) => (
              <li key={lead} className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-pill bg-blue-safe text-body-sm font-extrabold text-white"
                >
                  {i + 1}
                </span>
                <span className="text-body text-text-secondary">
                  <strong className="text-ink">{tf(lead)}</strong> {tf(tail)}
                </span>
              </li>
            ))}
          </ol>
          <ul className="m-0 mt-7 flex list-none flex-col gap-3 border-t border-border-1 p-0 pt-6 text-body text-text-secondary">
            <li>{tf('hire.208')}</li>
            <li>{tf('hire.209')}</li>
            <li>{tf('hire.210')}</li>
          </ul>
          <div className="mt-7 border-t border-border-1 pt-6">
            <p className="m-0 mb-3 text-body-sm font-extrabold uppercase tracking-[0.6px] text-text-tertiary">
              {tf('hire.211')}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* the phone tile is hidden ≤700 px (the mobile bottom bar carries the call) */}
              <ContactLink
                href={telLink(s.phone)}
                placement="page_cta"
                className={`hidden md:flex ${TILE}`}
              >
                <span className="block min-w-0">
                  <span className="block text-body-sm font-bold uppercase tracking-[0.5px] text-text-tertiary">
                    {tf('hire.212')}
                  </span>
                  <span className="block truncate text-body font-extrabold text-ink">
                    {s.phoneDisplay}
                  </span>
                </span>
              </ContactLink>
              <ContactLink
                href={mailLink(s.email, tf('hire.253'))}
                placement="page_cta"
                className={`flex ${TILE}`}
              >
                <span className="block min-w-0">
                  <span className="block text-body-sm font-bold uppercase tracking-[0.5px] text-text-tertiary">
                    {tf('hire.213')}
                  </span>
                  <span className="block truncate text-body font-extrabold text-ink">
                    {s.email}
                  </span>
                </span>
              </ContactLink>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-border-1 bg-white shadow-card-hover">
          <div className="bg-blue-safe px-8 py-6 text-white">
            <h3 className="m-0 mb-1 text-card-title">{tf('hire.214')}</h3>
            <p className="m-0 text-body-sm text-white">{tf('hire.215')}</p>
          </div>
          <div className="px-8 pb-6 pt-7">
            <FormShell
              action={submitHireFull}
              formKey="hire"
              idScope="hire-full"
              locale={locale}
              turnstileSiteKey={s.turnstileSiteKey}
              whatsappNumber={s.whatsappNumber}
              whatsappIntro={tf('hire.249')}
              contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
              submitLabel={tf('hire.063')}
              consent="checkbox"
              headingLevel={4}
              testId="hire-form-full"
            >
              <Field
                name="company"
                label={tf('hire.047')}
                required
                autoComplete="organization"
                maxLength={200}
              />
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="name"
                  label={tf('hire.053')}
                  required
                  autoComplete="name"
                  maxLength={120}
                />
                <Field
                  name="email"
                  label={tf('hire.052')}
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                />
              </div>
              <div className="grid gap-2.5 sm:grid-cols-[minmax(120px,0.45fr)_1fr]">
                {/* ISO-2 values (W3): `+1`/`+7` are shared by several countries */}
                <Field
                  name="dial"
                  label={dialLabel}
                  as="select"
                  options={dials}
                  defaultValue="TR"
                  required
                  autoComplete="tel-country-code"
                />
                {/* the dial select carries the country code: no "+90…" placeholder or hint */}
                <Field
                  name="phone"
                  label={tf('hire.051')}
                  type="tel"
                  required
                  hint=""
                  placeholder=""
                  autoComplete="tel-national"
                  inputMode="tel"
                  maxLength={32}
                />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="sector"
                  label={tf('hire.054')}
                  as="select"
                  required
                  options={sectors}
                />
                <Field name="roleNeeded" label={tf('hire.055')} required maxLength={200} />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="headcount"
                  label={tf('hire.056')}
                  type="number"
                  min={1}
                  required
                  inputMode="numeric"
                />
                <Field
                  name="city"
                  label={tf('hire.057')}
                  autoComplete="address-level2"
                  maxLength={120}
                />
              </div>
              <Field
                name="startWhen"
                label={tf('hire.058')}
                as="select"
                options={startWhenOptions}
              />
              <Field name="message" as="textarea" rows={3} maxLength={5000} />
            </FormShell>
            <p className="m-0 mt-2 text-center text-body-sm text-text-tertiary">
              {tf('hire.219')}
            </p>
            <p className="m-0 mt-1 text-center text-body-sm leading-snug text-text-tertiary">
              {tf('hire.220')}
            </p>
            <p className="m-0 mt-3 text-center text-body-sm text-text-tertiary">
              {tf('hire.221')}{' '}
              {/* W95: the subject only — the design's sendByEmail body with the typed fields
                  (hire.254–263) would put visitor data into a DOM href */}
              <ContactLink
                href={mailLink(s.email, tf('hire.253'))}
                placement="page_cta"
                className="font-extrabold text-blue-safe underline"
              >
                {tf('hire.222')}
              </ContactLink>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

Notes for the implementer:
- Both shells carry `formKey="hire"` (D13: one conversion key) and a distinct `idScope` (`hire-quick`, `hire-full`), so every kernel id — fields `f-hire-quick-company`, honeypot, Turnstile, consent `f-hire-quick-consent` — is unique on the page (axe `duplicate-id*`, W2a fix-round `6c35588`). No `Field` passes an explicit `id`.
- No `consentLinkHref` (W79): the shell's default `/privacy` is the only allowed value, and T13 has shipped that page.
- `Field` labels are the package's own `hire.047`–`058` (W115); `message` and `dial` have none, so `message` falls back to `sys.form.labels.message` and `dial` passes `sys.hire.form.dial`. `Field as="select"` renders the kernel's empty first option (`sys.form.placeholders.select`) and ignores `placeholder` (W111), so `defaultValue="TR"` is what pre-selects Türkiye.
- The fallback heading level follows the outline: the quick card's title is an `h2` → the panel's `h3` (the shell's default); the request card's title is an `h3` → `headingLevel={4}`.
- The contract import `'../../../../../../contract/website-bundle.v1'` is six levels up from `_sections/` (the `(site)` group adds one level to WP1's five, W41).

- [ ] **Step 4: Run tests + npm run verify**

Rendering waits for Cycle 4's `page.tsx`; this cycle proves the modules compile, lint and type-check against the real kernel:

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers" e2e/pages/hire-workers.spec.ts
npm run verify
```
→ clean. (The Playwright cases stay red until Cycle 4; e2e is not part of `verify`.)

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/actions.ts" "src/app/[locale]/(site)/hire-workers/_sections/QuickQuote.tsx" "src/app/[locale]/(site)/hire-workers/_sections/RequestForm.tsx" e2e/pages/hire-workers.spec.ts
git commit -m "feat(hire): quick-quote and request-form server actions on the forms kernel

Two hire shells with distinct idScopes; consent checkbox on both (W79); package field
labels (W115); sector and startWhen keys on the wire (W77/W78); city (W16); the e2e
asserts the bare wa.me fallback href and the click-time prefill (W76/W95).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — the page: hero, jump nav, sticky bar, sections in the design's order, e2e page contract

- [ ] **Step 1: Write the failing test**

Append to `e2e/pages/hire-workers.spec.ts` (after the Cycle 3 cases):

```ts
type JsonLdNode = Record<string, unknown> & { '@type'?: string };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 with real copy, no leaked tokens, the LCP slot named once`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).not.toBeEmpty();
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1'); // D26: the hero photo is a placeholder
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(body).not.toContain('undefined');
    expect(body).not.toMatch(/\bhire\.\d{3}\b/); // a package id leaking as text
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder="hw-hero"]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder=""]')).toHaveCount(0); // W55
    // W1: the hero pills are metrics, not literals — the placed figure renders formatted.
    await expect(page.getByTestId('hire-hero-pills')).toContainText('470+');
  });

  test(`${locale}: every designed section is present, in order`, async ({ page }) => {
    await page.goto(ROUTES[locale]);
    const ids = [
      'hire-hero',
      'hire-industries',
      'hire-source-countries',
      'hire-compare',
      'hire-process',
      'hire-portal',
      'hire-faq',
      'hire-request',
    ];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el).toHaveCount(1);
      const box = await el.boundingBox(); // null when hidden by CSS (W10: portal ≤460 px)
      if (box) tops.push(box.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    if (isMobile()) await expect(page.getByTestId('hire-portal')).toBeHidden();
    // W6: no consented logos → the client-logo band renders nothing at all.
    await expect(page.getByTestId('hire-logos')).toHaveCount(0);
    // the header CTA's target exists (WP2a Task 3: DEFAULT_CTAS → #request-form)
    await expect(page.locator('#request-form')).toHaveCount(1);
    await expect(page.locator('#industries, #compare, #process, #faq')).toHaveCount(4);
  });
}

test('tr: the source map carries every source country and the flag chips are sprite flags', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const map = page.locator('#source-map');
  await expect(map).toHaveCount(1);
  await expect(map.locator('g[data-country]')).toHaveCount(14); // 13 sources + TR
  await expect(map.locator('g[data-country="LK"] > title')).toHaveText(/Sri Lanka/);
  await expect(map.locator('g[data-country="TR"] > title')).toHaveText('Türkiye');
  const flags = page.getByTestId('hire-flags');
  expect(await flags.locator('svg use[href$="#flag-PK"]').count()).toBeGreaterThan(0);
  await expect(flags).toContainText('Pakistan');
});

test('tr: the industries accordion opens one sector at a time and its CTA prefills the request form', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const region = page.getByTestId('hire-industries');
  await expect(region.getByRole('button', { expanded: false })).toHaveCount(6);
  await region.getByRole('button', { name: /Tekstil/ }).click();
  await expect(region.getByRole('button', { name: /Tekstil/ })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await region.getByRole('link', { name: /Tekstil işçisi talep edin/ }).click();
  await expect(page.getByTestId('hire-form-full').getByLabel(/Sektör/)).toHaveValue('textile');
  expect(new URL(page.url()).hash).toBe('#request-form');
});

test('tr: FAQPage JSON-LD carries the seven pairs, breadcrumbs carry this page’s own labels', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const nodes = await jsonLdNodes(page);
  const faq = nodes.find((n) => n['@type'] === 'FAQPage');
  expect(faq?.mainEntity).toHaveLength(7);
  const crumbs = nodes.find((n) => n['@type'] === 'BreadcrumbList') as
    | { itemListElement: { name: string; item: string }[] }
    | undefined;
  expect(crumbs?.itemListElement).toHaveLength(2);
  // W109: hire.020 → '/', hire.002 → this page
  expect(crumbs?.itemListElement.map((i) => i.name)).toEqual(['Ana Sayfa', 'İşçi Talebi']);
  expect(crumbs?.itemListElement[1].item.endsWith('/isci-talebi')).toBe(true);
});

test('the language switch keeps the visitor on this page', async ({ page }) => {
  test.skip(isMobile(), 'the switcher lives in the hamburger below lg — covered by e2e/chrome.spec.ts');
  await page.goto(ROUTES.tr);
  await page.locator('a[hreflang="en"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/hire-workers$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('desktop: the sticky CTA bar appears after 700 px, hides near the request form, publishes its height and tracks its contact CTAs', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar is lg+ only; the mobile bottom bar carries the offer below lg');
  await page.goto(ROUTES.tr);
  const bar = page.getByTestId('sticky-cta'); // W81: the wrapper's test id (WP2a Task 5)
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(bar).toBeVisible();
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sticky-cta-h').trim(),
    ),
  ).not.toBe('0px');
  // W81/W12: the bar's tel: CTA is a ContactLink — its click pushes call_click page_cta.
  await bar.getByRole('link', { name: /Arayın/ }).evaluate((a) =>
    a.addEventListener('click', (e) => e.preventDefault(), { once: true }),
  );
  await bar.getByRole('link', { name: /Arayın/ }).click();
  const pushed = await page.evaluate(
    () => (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? [],
  );
  expect(pushed.some((e) => e.event === 'call_click' && e.placement === 'page_cta')).toBe(true);
  await page.locator('#request-form').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});
```

Note: the `call_click` assertion reads `window.dataLayer`, which `track()` pushes to whether or not consent is granted (WP1 R54 — GTM is dark by configuration, the push itself is unconditional; if the executor finds `track()` gated on consent, drop that one assertion and record it in the ledger, never add a page-side push).

- [ ] **Step 2: Run to verify it fails**

Same door-less build + `next start` + Playwright command as Cycle 3 → the new cases fail on `hire-hero` etc. (the Cycle 3 cases still fail too — no page renders the forms yet).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_sections/Hero.tsx`:

```tsx
import { Breadcrumbs, ContactCta, ImageSlot } from '@/design/blocks';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { HERO_SIZE, HERO_SRC } from '../_lib/assets';
import { sp } from '../_lib/fragments';
import { QuickQuote } from './QuickQuote';

export function Hero({
  bundle,
  locale,
  tf,
  metrics,
  whatsappLabel,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** metricValues(bundle, locale) — '' for an unsigned metric (W1: its pill is hidden) */
  metrics: Record<string, string>;
  /** sys.hire.whatsapp */
  whatsappLabel: string;
}) {
  const s = bundle.settings;
  const heroIsLcp = HERO_SRC !== null;
  const h1a = tf('hire.021');
  const h1b = tf('hire.022');
  const h1c = tf('hire.023');
  const lead = (a: string, b: string) => {
    const x = tf(a);
    const y = tf(b);
    return (
      <>
        {x}
        {sp(x, y)}
        <strong className="text-white">{y}</strong>
      </>
    );
  };
  return (
    <section data-testid="hire-hero" className="relative overflow-hidden bg-navy text-white">
      {/* D26/WP2a Task 7: the named hero slot. With a photo it is the LCP element
          (`data-lcp-slot="hw-hero"`); without one it is a decorative named placeholder and the
          h1 below carries `data-lcp-slot="h1"`. */}
      <ImageSlot
        slot="hw-hero"
        lcp={heroIsLcp}
        src={HERO_SRC}
        alt=""
        width={HERO_SIZE.width}
        height={HERO_SIZE.height}
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/75" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70" />
      <div className="container-site relative grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-16">
        <div>
          {/* W109: this page's own labels — hire.020 (crumbHome), hire.002 (navHire) */}
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-4"
            items={[
              { name: tf('hire.020'), href: '/' },
              { name: tf('hire.002'), href: '/hire-workers' },
            ]}
          />
          <h1
            data-testid="page-h1"
            data-lcp-slot={heroIsLcp ? undefined : 'h1'}
            className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em]"
          >
            {h1a}
            {sp(h1a, h1b)}
            <span className="text-sky">{h1b}</span>
            {sp(h1b, h1c)}
            {h1c}
          </h1>
          <p className="m-0 mb-7 max-w-[540px] text-body-lg text-white/80">
            <span className="hidden md:inline">{lead('hire.024', 'hire.025')}</span>
            <span className="md:hidden">{lead('hire.026', 'hire.027')}</span>
          </p>
          <ul className="m-0 mb-7 flex max-w-[560px] list-none flex-wrap gap-x-8 gap-y-3 p-0">
            {(
              [
                ['hire.028', 'hire.029'],
                ['hire.030', 'hire.031'],
              ] as const
            ).map(([strong, tail]) => (
              <li key={strong} className="flex items-start gap-2.5 text-body text-white/75">
                <span aria-hidden="true" className="mt-1 text-success">
                  ✓
                </span>
                <span>
                  <strong className="text-white">{tf(strong)}</strong>
                  {sp(tf(strong), tf(tail))}
                  {tf(tail)}
                </span>
              </li>
            ))}
          </ul>
          {/* the Call / WhatsApp row is hidden ≤700 px; the mobile bottom bar carries both */}
          <div className="mb-6 hidden flex-wrap gap-3 md:flex">
            <ContactCta placement="page_cta" href={telLink(s.phone)} variant="inverse">
              {tf('hire.032')}
            </ContactCta>
            <ContactCta
              placement="page_cta"
              href={waLink(s.whatsappNumber, tf('hire.249'))}
              variant="inverse"
              external
            >
              {whatsappLabel}
            </ContactCta>
          </div>
          <ul
            data-testid="hire-hero-pills"
            className="m-0 flex list-none flex-wrap gap-3 p-0 text-body-sm"
          >
            <li className="inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-2 font-bold text-white/80">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
              {tf('hire.034')}
            </li>
            {metrics.placed ? (
              <li className="inline-flex items-baseline gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-2 text-white/75">
                <span className="text-body font-extrabold text-sky">{metrics.placed}</span>
                {tf('hire.035')}
              </li>
            ) : null}
            {metrics.countries ? (
              <li className="inline-flex items-baseline gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-2 text-white/75">
                <span className="text-body font-extrabold text-success">{metrics.countries}</span>
                {tf('hire.036')}
              </li>
            ) : null}
          </ul>
        </div>
        <QuickQuote bundle={bundle} locale={locale} tf={tf} />
      </div>
    </section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/JumpNav.tsx` (mobile-only anchor chips, design `.ja-jump` — `md:hidden`, W10: CSS, not conditional rendering):

```tsx
const CHIPS = [
  ['#industries', 'hire.067'],
  ['#compare', 'hire.068'],
  ['#process', 'hire.069'],
  ['#faq', 'hire.070'],
] as const;

const CHIP =
  'flex-none whitespace-nowrap rounded-pill border px-4 py-2 text-body-sm font-extrabold no-underline';

export function JumpNav({ tf, label }: { tf: (id: string) => string; label: string }) {
  return (
    <nav aria-label={label} className="border-b border-border-4 bg-white md:hidden">
      <ul className="m-0 flex list-none gap-2 overflow-x-auto px-5 py-3.5 [scrollbar-width:none]">
        {CHIPS.map(([href, id]) => (
          <li key={href}>
            <a href={href} className={`${CHIP} border-tint-border bg-pale-1 text-blue-safe`}>
              {tf(id)}
            </a>
          </li>
        ))}
        <li>
          <a href="#request-form" className={`${CHIP} border-ink bg-ink text-white`}>
            {tf('hire.071')}
          </a>
        </li>
      </ul>
    </nav>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/ClientLogos.tsx` (returns `null` when there are no logos — W6; the `employers` stat rides with the band, so it is hidden with it rather than standing alone):

```tsx
import { LogoMarquee, type Logo } from '@/design/blocks';

export function ClientLogos({
  tf,
  employers,
  logos,
}: {
  tf: (id: string) => string;
  /** metricValues(...).employers — '' when unsigned (W1) */
  employers: string;
  logos: readonly Logo[];
}) {
  if (logos.length === 0) return null;
  return (
    <div data-testid="hire-logos" className="hidden border-b border-border-3 py-9 md:block">
      <div className="container-site grid items-center gap-12 md:grid-cols-[auto_1fr]">
        {employers ? (
          <div className="border-r border-border-2 pr-11">
            <p className="m-0 text-stat font-extrabold leading-none text-ink">{employers}</p>
            <p className="m-0 mt-1.5 max-w-[150px] text-body-sm font-bold text-text-tertiary">
              {tf('hire.073')}
            </p>
          </div>
        ) : null}
        <LogoMarquee logos={[...logos]} durationSec={38} />
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/Industries.tsx`:

```tsx
import { getCollection, type Sector } from '@/content/collections';
import { Accordion, type AccordionItem, Section } from '@/design/primitives';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { SectorPrefillLink } from '../_components/SectorPrefillLink';
import { INDUSTRIES } from '../_lib/tables';

const CHIP = 'inline-block rounded-pill border px-3 py-1 text-body-sm font-bold';

export function Industries({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const byKey = new Map<string, Sector>(getCollection(bundle, 'sectors').map((s) => [s.key, s]));
  const items: AccordionItem[] = INDUSTRIES.flatMap((row, i) => {
    const sector = byKey.get(row.key);
    if (!sector) return []; // rendered by data: a sector missing from the collection is not a row
    const n = String(i + 1).padStart(2, '0');
    return [
      {
        id: row.key,
        title: `${n} · ${tf(sector.labelId)}`,
        body: (
          <div className="flex flex-col gap-4">
            {sector.subtitleId ? (
              <p className="m-0 text-body-sm font-bold text-blue-safe">{tf(sector.subtitleId)}</p>
            ) : null}
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {row.visibleRoleIds.map((id) => (
                <li key={id} className={`${CHIP} border-border-2 bg-pale-1 text-text-secondary`}>
                  {tf(id)}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-end justify-between gap-6 rounded-sm bg-blue-safe p-5 text-white shadow-card-hover">
              <div>
                <p className="m-0 mb-2 text-eyebrow font-extrabold uppercase tracking-[1px] text-white">
                  {tf('hire.136')}
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {row.moreRoleIds.map((id) => (
                    <li key={id} className={`${CHIP} border-white/60 text-white`}>
                      {tf(id)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="m-0 text-body-sm font-bold text-white">{tf('hire.137')}</p>
                <SectorPrefillLink
                  sector={row.key}
                  className="inline-flex min-h-[44px] items-center rounded-input bg-white px-5 text-body-sm font-extrabold text-blue-safe no-underline hover:bg-tint"
                >
                  {tf(row.ctaId)}
                </SectorPrefillLink>
              </div>
            </div>
          </div>
        ),
      },
    ];
  });
  return (
    <Section tone="light" id="industries" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-industries">
        <h2 className="m-0 mb-4 text-center text-h2">{tf('hire.074')}</h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary">
          {tf('hire.075')}
        </p>
        <div className="rounded-lg border border-tint-border bg-white px-5">
          <Accordion items={items} singleOpen headingLevel={3} />
        </div>
        <p className="m-0 mt-7 text-center text-body text-text-tertiary">
          {tf('hire.138')}{' '}
          <a href="#request-form" className="font-extrabold text-blue-safe no-underline">
            {tf('hire.139')}
          </a>
        </p>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/SourceCountries.tsx`:

```tsx
import { getCollection } from '@/content/collections';
import { Flag } from '@/design/Flag';
import { isFlagCode } from '@/design/assets/flag-codes';
import { SourceMap, sourceMapLabels } from '@/design/assets/source-map';
import { Eyebrow, PausableMarquee } from '@/design/primitives';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { sp } from '../_lib/fragments';

export function SourceCountries({
  bundle,
  tf,
  countries,
  sys,
}: {
  bundle: Bundle;
  tf: (id: string) => string;
  /** metricValues(...).countries — '' when unsigned (W1: the "N+ countries" span hides) */
  countries: string;
  /** sys.hire.sc.* + sys.marquee.* resolved by the page */
  sys: { titleTail: string; mapTitle: string; turkiye: string; pause: string; play: string };
}) {
  const rows = getCollection(bundle, 'sourceCountries');
  const a = tf('hire.141'); // TR: deliberately '' (never the EN fallback — PRD §3)
  const b = tf('hire.142');
  const chips = (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
      {rows.map((c) => (
        <li
          key={c.code}
          className="inline-flex items-center gap-2 rounded-pill border border-tint-border bg-white px-3.5 py-1.5 text-body-sm font-bold text-text-secondary"
        >
          {isFlagCode(c.code) ? <Flag code={c.code} size={16} /> : null}
          {c.name}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="bg-white pb-16 pt-6">
      <div
        data-testid="hire-source-countries"
        className="container-site grid items-center gap-10 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-14 lg:py-12"
      >
        <div>
          <Eyebrow>{tf('hire.140')}</Eyebrow>
          <h2 className="m-0 mb-4 mt-3 text-h2">
            {a}
            {countries ? (
              <>
                {sp(a, countries)}
                <span className="text-blue-safe">
                  {countries}
                  {b}
                </span>
              </>
            ) : null}
            {sys.titleTail}
          </h2>
          <p className="m-0 mb-5 text-body text-text-secondary">{tf('hire.143')}</p>
          <div className="flex items-start gap-3 rounded-sm border border-tint-border bg-white px-5 py-4">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-input bg-success-surface text-success-text"
            >
              ●
            </span>
            <div>
              <p className="m-0 text-body font-extrabold text-ink">{tf('hire.144')}</p>
              <p className="m-0 mt-0.5 text-body-sm text-text-secondary">{tf('hire.145')}</p>
            </div>
          </div>
        </div>
        <div>
          <SourceMap
            title={sys.mapTitle}
            labels={sourceMapLabels(rows)}
            turkiyeLabel={sys.turkiye}
            id="source-map"
            className="w-full"
          />
          {/* flag chips: a static wrap from 701 px, the design's 34 s marquee below it (W10) */}
          <div data-testid="hire-flags" className="mt-4">
            <div className="hidden md:block">{chips}</div>
            <div className="md:hidden">
              <PausableMarquee durationSec={34} labelPause={sys.pause} labelPlay={sys.play}>
                {chips}
              </PausableMarquee>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Note: the heading renders TR `'' + '13' + '+ ülkeden' + ' belgeli işçiler'` → "13+ ülkeden belgeli işçiler", EN `'Vetted talent from' + ' ' + '13' + '+ countries' + ''` → "Vetted talent from 13+ countries". `hire.142`'s leading `+` is a package fragment rendered as authored (the `countries` metric carries no suffix) — recorded for the WP-C sheet, not "fixed" here.

`src/app/[locale]/(site)/hire-workers/_sections/Comparison.tsx`:

```tsx
import { Section } from '@/design/primitives';
import { COMPARE_ROWS } from '../_lib/tables';

export function Comparison({ tf }: { tf: (id: string) => string }) {
  return (
    <Section tone="light" id="compare" className="scroll-mt-20 pt-0">
      <div className="container-site" data-testid="hire-compare">
        <h2 className="m-0 mb-4 text-center text-h2">{tf('hire.146')}</h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary">
          {tf('hire.147')}
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border-2 bg-white p-8">
            <h3 className="m-0 mb-4 text-body-sm font-extrabold uppercase tracking-[1.5px] text-text-tertiary">
              {tf('hire.148')}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {COMPARE_ROWS.own.map((r) => (
                <li key={r.titleId} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-pill bg-border-3 text-body-sm font-extrabold text-text-tertiary"
                  >
                    ×
                  </span>
                  <div>
                    <p className="m-0 text-body font-bold text-text-secondary">{tf(r.titleId)}</p>
                    <p className="m-0 mt-0.5 text-body-sm text-text-tertiary">{tf(r.bodyId)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border-[1.5px] border-tint-border bg-gradient-to-b from-pale-1 to-tint p-8 shadow-card-hover">
            <h3 className="m-0 mb-4 text-body-sm font-extrabold uppercase tracking-[1.5px] text-blue-safe">
              {tf('hire.149')}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {COMPARE_ROWS.with.map((r) => (
                <li key={r.titleId} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-pill bg-success text-body-sm font-extrabold text-white"
                  >
                    ✓
                  </span>
                  <div>
                    <p className="m-0 text-body font-extrabold text-ink">{tf(r.titleId)}</p>
                    <p className="m-0 mt-0.5 text-body-sm text-text-secondary">{tf(r.bodyId)}</p>
                  </div>
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

`src/app/[locale]/(site)/hire-workers/_sections/Process.tsx` (the design's numbered rail = WP2a Task 5's `ProcessSteps variant="cards"`, whose Produces names "Hire Workers' boxed rows" as the origin of that variant; the brief's "horizontal Timeline" is not this design — accepted page-local by the WP2b reconcile):

```tsx
import { ProcessSteps, type ProcessStep } from '@/design/blocks';
import { Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { sp } from '../_lib/fragments';
import { PROCESS_STEPS } from '../_lib/tables';

export function Process({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const steps: ProcessStep[] = PROCESS_STEPS.map((s) => ({
    n: s.n,
    titleId: s.titleId,
    bodyId: s.bodyId,
    when: tf(s.whenId),
  }));
  const [ta, tb] = [tf('hire.170'), tf('hire.171')];
  const [l1a, l1b, l1c] = [tf('hire.174'), tf('hire.175'), tf('hire.176')];
  const [l2a, l2b, l2c] = [tf('hire.177'), tf('hire.178'), tf('hire.179')];
  return (
    <Section tone="pale" id="process" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-process">
        <h2 className="m-0 mb-4 text-center text-h2-process">
          {ta}
          {sp(ta, tb)}
          <span className="text-blue-safe">{tb}</span>
        </h2>
        <p className="mx-auto mb-4 mt-0 max-w-[540px] text-center text-body-lg text-text-tertiary">
          {tf('hire.172')}
        </p>
        <div className="mb-11 text-center">
          <p className="m-0 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-5 py-2 text-body-sm font-extrabold text-success-text">
            {tf('hire.173')}
          </p>
          {/* the design's two cross-links are absolute www.jobsadmire.com URLs — locale-aware here */}
          <p className="m-0 mt-3.5 text-body-sm text-text-secondary">
            {l1a}
            {sp(l1a, l1b)}
            <Link href="/work-permit" className="font-extrabold text-blue-safe no-underline">
              {l1b}
            </Link>
            {sp(l1b, l1c)}
            {l1c}
          </p>
          <p className="m-0 mt-2 text-body-sm text-text-secondary">
            {l2a}
            {sp(l2a, l2b)}
            <Link
              href="/hiring-cost-calculator"
              className="font-extrabold text-blue-safe no-underline"
            >
              {l2b}
            </Link>
            {sp(l2b, l2c)}
            {l2c}
          </p>
        </div>
        <div className="mx-auto max-w-[760px]">
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            steps={steps}
            variant="cards"
            headingLevel={3}
          />
        </div>
      </div>
    </Section>
  );
}
```

`/work-permit` and `/hiring-cost-calculator` are still in `UNBUILT_PATHNAMES` when T2 lands (T3/T4 build them next, W99): the links resolve to the `[...rest]` 404 inside the chrome until then — the width sweep and axe do not follow links, and `e2e/seo.spec.ts` sweeps only the sitemap, so the gate stays green; the ledger row records it.

`src/app/[locale]/(site)/hire-workers/_sections/PortalPreview.tsx` (hidden ≤460 px per W10 via `hidden xs:block`; the store badges are the design's ≤700 px extra → `md:hidden`; `ios` is `null` in settings → `StoreBadges` renders Android only, W8):

```tsx
import { ContactCta, ImageSlot, StoreBadges } from '@/design/blocks';
import { Eyebrow } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { sp } from '../_lib/fragments';

export function PortalPreview({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const s = bundle.settings;
  const host = new URL(s.portal.host).host; // "portal.jobsadmire.com" — the mock's address bar
  const proofA = tf('hire.191');
  const proofB = tf('hire.192');
  return (
    <div className="hidden bg-white pb-16 xs:block">
      <div
        data-testid="hire-portal"
        className="container-site grid items-center gap-12 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint px-6 py-10 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-14"
      >
        <div className="relative min-h-[440px]">
          <div className="absolute left-0 top-0 w-[80%] overflow-hidden rounded-sm border border-tint-border bg-white shadow-card-hover">
            <div className="flex items-center gap-1.5 border-b border-border-4 bg-pale-2 px-3.5 py-2.5">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-pill bg-border-2" />
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-pill bg-border-2" />
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-pill bg-border-2" />
              <span className="ml-2 flex-1 rounded-[6px] border border-border-4 bg-white px-2.5 py-1 text-eyebrow text-text-tertiary">
                {host}
              </span>
            </div>
            <ImageSlot
              slot="portal-shortlist"
              src={null}
              alt={tf('hire.243')}
              width={800}
              height={310}
              className="w-full"
            />
          </div>
          <div className="absolute bottom-0 right-6 z-[2] h-[328px] w-[172px] rounded-[26px] bg-navy p-2 shadow-card-hover">
            <ImageSlot
              slot="portal-mobile-app"
              src={null}
              alt={tf('hire.244')}
              width={156}
              height={312}
              className="h-full w-full rounded-[19px]"
            />
          </div>
          <div className="absolute bottom-6 left-0 z-[3] max-w-[230px] rounded-base border border-tint-border bg-white px-4 py-3.5 shadow-card-hover">
            <p className="m-0 mb-1.5 flex items-center gap-2 text-body-sm font-extrabold text-ink">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
              {tf('hire.180')}
            </p>
            <p className="m-0 text-body-sm text-text-tertiary">{tf('hire.181')}</p>
          </div>
        </div>
        <div>
          <Eyebrow>{tf('hire.182')}</Eyebrow>
          <h2 className="m-0 mb-4 mt-3 text-h2">{tf('hire.183')}</h2>
          <p className="m-0 mb-5 text-body text-text-secondary">{tf('hire.184')}</p>
          <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
            {(['hire.185', 'hire.186'] as const).map((id) => (
              <li key={id} className="flex items-center gap-3 text-body text-ink">
                <span
                  aria-hidden="true"
                  className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-pill bg-success text-body-sm font-extrabold text-white"
                >
                  ✓
                </span>
                {tf(id)}
              </li>
            ))}
          </ul>
          <div className="mb-7 grid gap-3.5 sm:grid-cols-2">
            {(
              [
                ['hire.187', 'hire.188'],
                ['hire.189', 'hire.190'],
              ] as const
            ).map(([title, body]) => (
              <div key={title} className="rounded-sm border border-tint-border bg-pale-1 px-5 py-4">
                <p className="m-0 mb-2 text-body font-extrabold text-ink">{tf(title)}</p>
                <p className="m-0 text-body-sm text-text-secondary">{tf(body)}</p>
              </div>
            ))}
          </div>
          <p className="m-0 mb-6 text-body text-text-secondary">
            <strong className="text-ink">{proofA}</strong>
            {sp(proofA, proofB)}
            {proofB}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <ContactCta
              placement="page_cta"
              href={waLink(s.whatsappNumber, tf('hire.251'))}
              external
              size="lg"
            >
              {tf('hire.193')}
            </ContactCta>
            <div className="md:hidden">
              <StoreBadges
                bundle={bundle}
                locale={locale}
                android={s.storeLinks.android}
                ios={s.storeLinks.ios}
                tone="light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/Faq.tsx`:

```tsx
import { FaqBlock, type FaqItem } from '@/design/blocks';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FAQ_PAIRS } from '../_lib/tables';

export function Faq({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const s = bundle.settings;
  const items: FaqItem[] = FAQ_PAIRS.map((p) => ({ id: p.id, q: tf(p.qId), a: tf(p.aId) }));
  return (
    <Section tone="pale" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-faq">
        {/* the design's ask card has WhatsApp + call only — no W83 e-mail row */}
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq"
          items={items}
          eyebrowId="hire.194"
          headingId="hire.195"
          bodyId="hire.196"
          askCard={{
            titleId: 'hire.197',
            bodyId: 'hire.198',
            whatsappNumber: s.whatsappNumber,
            whatsappText: tf('hire.252'),
            whatsappLabelId: 'hire.041',
            phone: s.phone,
            callLabelId: 'hire.032',
          }}
          singleOpen
          openFirst
          headingLevel={3}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/page.tsx` — replace the whole file:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf, metricValues } from '@/content/adapter';
import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';
import type { FieldOption } from '@/forms/client/Field';
import { START_WHEN_KEYS } from '@/forms/options';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { CLIENT_LOGOS } from './_lib/assets';
import { ClientLogos } from './_sections/ClientLogos';
import { Comparison } from './_sections/Comparison';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Industries } from './_sections/Industries';
import { JumpNav } from './_sections/JumpNav';
import { PortalPreview } from './_sections/PortalPreview';
import { Process } from './_sections/Process';
import { RequestForm } from './_sections/RequestForm';
import { SourceCountries } from './_sections/SourceCountries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  // The page record carries hire.264/hire.265 (WP2a Task 1), which win; the fallbacks are the
  // same ids so a record without them still renders the package's own SEO copy (W23: there is
  // no sys.seo.hire.*).
  return buildMetadata({
    locale,
    href: '/hire-workers',
    bundle,
    pageKey: 'hire',
    fallbackTitle: t('hire.264'),
    fallbackDescription: t('hire.265'),
  });
}

export default async function HireWorkers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  // D17/W1: every package id goes through makeTf so re-authored `{metric}` placeholders render
  // their values; the figures a page shows outside a string come from metricValues.
  const tf = makeTf(bundle, locale);
  const metrics = metricValues(bundle, locale);
  const s = bundle.settings;
  const whatsapp = sys('hire.whatsapp');
  // W78: one startWhen vocabulary site-wide, labelled by the shared sys copy.
  const startWhenOptions: FieldOption[] = START_WHEN_KEYS.map((key) => ({
    value: key,
    label: sys(`form.options.startWhen.${key}`),
  }));
  // W81: the bar renders the tel:/wa.me CTAs through ContactLink (page_cta); the request CTA
  // is a same-page anchor.
  const stickyCtas: StickyCta[] = [
    { label: tf('hire.033'), href: telLink(s.phone), variant: 'secondary' },
    {
      label: whatsapp,
      href: waLink(s.whatsappNumber, tf('hire.249')),
      variant: 'secondary',
      external: true,
    },
    { label: tf('hire.040'), href: '#request-form', variant: 'primary' },
  ];
  return (
    <>
      <Hero bundle={bundle} locale={locale} tf={tf} metrics={metrics} whatsappLabel={whatsapp} />
      <JumpNav tf={tf} label={sys('hire.jump.label')} />
      {/* design .ja-sticky: after 700 px of scroll, hidden while #request-form is near (W18) */}
      <StickyCtaBar
        message={tf('hire.072')}
        ctas={stickyCtas}
        showAfterPx={700}
        hideNearId="request-form"
        live
      />
      <ClientLogos tf={tf} employers={metrics.employers ?? ''} logos={CLIENT_LOGOS} />
      <Industries bundle={bundle} tf={tf} />
      <SourceCountries
        bundle={bundle}
        tf={tf}
        countries={metrics.countries ?? ''}
        sys={{
          titleTail: sys.raw('hire.sc.titleTail') as string,
          mapTitle: sys('hire.sc.mapTitle'),
          turkiye: sys('hire.sc.turkiye'),
          pause: sys('marquee.pause'),
          play: sys('marquee.play'),
        }}
      />
      <Comparison tf={tf} />
      <Process bundle={bundle} locale={locale} tf={tf} />
      <PortalPreview bundle={bundle} locale={locale} tf={tf} />
      <Faq bundle={bundle} locale={locale} tf={tf} />
      <RequestForm
        bundle={bundle}
        locale={locale}
        tf={tf}
        dialLabel={sys('hire.form.dial')}
        startWhenOptions={startWhenOptions}
      />
    </>
  );
}
```

Notes for the implementer:
- No `<main>` (R31 — the `(site)` layout's `SiteChrome` owns it); no `generateStaticParams` (the locale layout has it).
- `sys.raw('hire.sc.titleTail')` — next-intl's `raw` returns the message untouched; the EN value is the empty string on purpose and renders as nothing.
- `makeTf`/`metricValues` come from `@/content/adapter` (`export * from './pure'`); never import `design-package/**` or `content/local/*` (the ESLint `no-restricted-imports` rule, D23).
- Every `tel:`/`wa.me`/`mailto:` anchor on the page is a `ContactCta`/`ContactLink` with `placement="page_cta"` (W12/W32), the three sticky-bar CTAs included through the bar itself (W81). No `wa.me` href on the page carries visitor data (W95): the page's own links carry package prefills (`hire.249`–`252`), the forms' fallback anchors are bare (W76).
- The `hidden md:block` / `md:hidden` pairs mirror the design's 700 px rule at this repo's `md` (701 px); `hidden xs:block` on the portal block is W10's 460 px rule at `xs` (461 px). Breakpoints are never scaled (D19).
- The only colour literal left is none: the design's `#0f2438` phone shell is `bg-navy`, its `#dff3a6` arrival note is `text-white` on `blue-safe` (delta 10).

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers" e2e/pages/hire-workers.spec.ts
npm run verify
npm run build
npx next start -p 3100 & SERVER=$!; sleep 5
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/hire-workers.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts e2e/chrome.spec.ts
kill $SERVER
```
→ verify clean; the page spec green under both projects; `routing.spec`/`seo.spec` unchanged and green (page-h1 contract loop, canonical `/en/hire-workers`, hreflang `/isci-talebi`, sitemap); axe zero violations on `/isci-talebi` and `/en/hire-workers` under both projects (no `duplicate-id*` — the `idScope`s; no `color-contrast` — delta 10); no horizontal overflow at any width of the sweep (1440 … 390, incl. 901/900). Localhost is advisory (R50); Cycle 5's preview run is binding.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers" e2e/pages/hire-workers.spec.ts
git commit -m "feat(hire): the Hire Workers page — hero, quick-quote, industries, source map, comparison, process, portal, FAQ, request form

Replaces the WP1 spike. Two hire forms on the forms kernel, metrics from the collection
(W1), build-time map + sprite flags (W14), named LCP/placeholder slots (D26), breadcrumbs
on this page's own labels (W109), sticky bar with hide-near-form and tracked contact CTAs
(W18/W81), contrast-safe blue surfaces (D20).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — binding gate on the preview, budget, pixel harness, docs, ledger

- [ ] **Step 1: Write the failing test**

No new test file: the assertions are the existing gate plus the route facts this task relies on and must not edit:

```bash
grep -n "isci-talebi\|/en/hire-workers" e2e/routes.ts          # both rows present, indexable: true (WP2a Task 7)
grep -n "'/hire-workers'" src/lib/seo/routes.ts                # no hit inside UNBUILT_PATHNAMES (WP2a Task 4)
grep -n "'/hire-workers'" src/design/chrome/ctas.ts            # only DEFAULT_CTAS' { pathname, hash: '#request-form' } — no CTA_BY_PATHNAME key
npm test -- src/lib/seo/unbuilt.test.ts                        # filesystem ↔ set agree
```
Expected: two `e2e/routes.ts` hits; no `UNBUILT_PATHNAMES` hit; the one `DEFAULT_CTAS` hit in `ctas.ts`; `unbuilt.test.ts` green. If any differs, WP2a drifted — fix the route list in its owner file, not the page.

- [ ] **Step 2: Run to verify it fails**

The binding gate runs against this branch's Vercel preview (door-less, W92) — before the preview carries Cycle 4 it fails the page spec (`hire-form-full` missing). Push the branch per the controller's instruction (never `main`), then:

```bash
# W91: VERCEL_AUTOMATION_BYPASS_SECRET is exported in the shell by the controller (ACCESS.md) — never committed
E2E_BASE_URL=https://<wp2-foundation-preview>.vercel.app npm run gate
```
→ green once the preview is built from the Cycle 4 commit (Playwright both projects incl. `e2e/pages/hire-workers.spec.ts`; `lhci` with `lighthouserc.preview.json`).

- [ ] **Step 3: Implement** (measurements + docs)

Measurements (one job at a time — Mac Studio rule):

```bash
npm run js-size                                                                    # reads .lighthouseci → per-route script table
npm run pixel -- --page=hire --locale=tr --base=https://<wp2-foundation-preview>.vercel.app
npm run pixel -- --page=hire --locale=en --base=https://<wp2-foundation-preview>.vercel.app
```
Read `lighthouse-report/` for the Lighthouse numbers and `.pixel/report.json` (`hire-tr`, `hire-en`) for the match scores at 390/900/1440. **Two-iteration cap (D27):** at most two fix-and-re-run passes on pixel deltas that are not in this task's named list; anything left is logged as a named delta, never a third pass. **Lazy line (W13 amended, W85):** if `js-size` reports either hire route above 194,560 B, move the bar behind the shared helper before the next page starts — a page-local `'use client'` wrapper `_components/LazyStickyBar.tsx` that renders `<LazyIsland load={() => import('@/design/chrome/StickyCtaBar').then((m) => ({ default: m.StickyCtaBar }))} props={props} fallback={null} />` (the bar renders `null` until scrolled, so the fallback is DOM-identical), and page.tsx mounts `LazyStickyBar` with the same props; re-measure. Above 204,800 B the gate has already failed and the page does not merge.

`docs/SEO.md` — append one row to the `## Pages` table T1 created (columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`, W98), after the Homepage row:

```markdown
| Hire Workers | `/isci-talebi` · `/en/hire-workers` | page record `hire` → `hire.264` / `hire.265` (the package's own SEO strings; no `sys.seo.hire.*`, W23); OG image `/og/{locale}/hire.png` | `absoluteUrl(locale, '/hire-workers')` | site-wide `Organization` + `WebSite` (layout); `BreadcrumbList` (2: `hire.020` → `/`, `hire.002` → this page, W109); `FAQPage` (7 pairs `hire.289`–`302`, AEO only) | `h1` (`data-lcp-slot="h1"`) while `hw-hero` is a placeholder (§10 row 4); `HERO_SRC` in `_lib/assets.ts` moves the slot onto the image when it ships (D26) | two `hire` forms (quick-quote ≥ 701 px + request form), consent checkbox on both (W79); pixel page (D27) |
```

`docs/ANALYTICS.md` — under the `### Page instrumentation (WP2b)` heading T1 created, append after the Homepage bullet:

```markdown
- **Hire Workers (`/isci-talebi`, `/en/hire-workers`, T2):** `call_click` / `whatsapp_click` / `email_click` with `placement: 'page_cta'` from the hero Call/WhatsApp buttons, the quick-quote's mobile "Ask on WhatsApp", the request section's phone and e-mail tiles and its "send this request by e-mail" link, the FAQ ask card's WhatsApp/Call, the portal block's "Book a demo" and the sticky bar's Call/WhatsApp (the bar renders them through `ContactLink`, W81); `whatsapp_click` / `call_click` / `email_click` with `placement: 'form_fallback'` from the two forms' fallback panels; `generate_lead` and `conversion` for `form_key: 'hire'` from `ConversionPing` on `/tesekkurler` — the page fires none of them itself. The industries "Request <sector> workers →" links, the jump nav and the "Full request form ↓" link are same-page anchors and fire nothing. No page-specific event and no new parameter.
```

`docs/CONTENT-MODEL.md` — in the per-page list under `### Adding copy` (W98), append after the Homepage bullet:

```markdown
- **Hire Workers (`sys.hire.*`, WP2b T2):** `whatsapp` (the brand-name CTA label the design carries as a literal), `jump.label` (the mobile jump nav's `aria-label`), `sc.titleTail` (the source-countries heading's Turkish noun, the runtime dictionary's `scTitleC`, which has no package id — EN is the empty string on purpose and is read with `sys.raw`), `sc.mapTitle` (the SVG map's accessible name), `sc.turkiye` (`SourceMap`'s `turkiyeLabel`), `form.dial` (the request form's dial-select label). Everything else on the page is a `hire.*` id through `makeTf`: the field labels are the package's `hire.047`–`058` (W115), both submits read `hire.063`, the "When do you need them?" options read the shared `sys.form.options.startWhen.*` (W78). No `sys.seo.hire.*` — the page record carries `hire.264`/`hire.265`.
```

`docs/PRD.md` — §2, the row whose second cell is `Hire Workers`: replace its last cell (`Detailed employer request form (\`INQUIRY\`)`) with:

```markdown
Hero quick-quote (≥ 701 px) + detailed request form, both `INQUIRY` via `hire` — the quick-quote gains the door's required contact `name` (W3); both carry the consent checkbox (W79) and optional `city` on the request form (W16); `sector` is the sector key and `startWhen` the shared key set (W77/W78); success → `/tesekkurler?form=hire` (D13), failure → the D11 fallback panel; the industries CTAs prefill the request form's sector
```

and, in the §11 sentence that begins "**Not yet built, by design (WP2 and later):**", replace the Hire-Workers clause T1 left ("Hire Workers is still the spike placeholder until T2") with "Hire Workers is designed — WP2b T2" — edit the phrase in place in whatever wording T1/T13 left (`grep -n "spike" docs/PRD.md` first; W45), never re-add the WP1 wording.

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T2 row to the ledger table in T1's row format (see the ledger line spec below).

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx prettier --write docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run verify
E2E_BASE_URL=https://<wp2-foundation-preview>.vercel.app npm run gate
```
→ both green; `lhci assert` passes on `/isci-talebi` and `/en/hire-workers` (performance ≥ 0.95, accessibility/best-practices = 1.0, SEO = 1.0 minus the preview-only `is-crawlable` audit per `lighthouserc.preview.json`, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms on the preview, CLS ≤ 0.1).

- [ ] **Step 5: Commit**

```bash
git add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(hire): SEO page row, page instrumentation, sys.hire namespace, PRD Hire Workers row, T2 ledger

Gate, js-size and pixel numbers from the door-less wp2/foundation preview.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/SEO.md` — one row appended to the `## Pages` table T1 created (anchor: the table under the heading `## Pages`, after the Homepage row; W98). `docs/ANALYTICS.md` — one bullet appended under the heading `### Page instrumentation (WP2b)`, after the Homepage bullet. `docs/CONTENT-MODEL.md` — one bullet appended to the per-page list under the heading `### Adding copy`, after the Homepage bullet. `docs/PRD.md` — §2: the table row whose page cell reads "Hire Workers" (its last cell replaced); §11: inside the sentence beginning "**Not yet built, by design (WP2 and later):**", the clause "Hire Workers is still the spike placeholder until T2" → "Hire Workers is designed — WP2b T2" (W45: edited in place on the text T1/T13 left). `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T2 ledger row. No `docs/ARCHITECTURE.md` or `docs/INTEGRATIONS.md` change: the forms flow and the I4 `hire` contract are unchanged (T14 records the instance map).

**Ledger line spec (T1's row format, W98 — fill the measured numbers):**

```markdown
| T2 Hire Workers | `/isci-talebi` · `/en/hire-workers` | script gz: `/isci-talebi` <n> B · `/en/hire-workers` <n> B (ceiling 204,800; lazy line 194,560; LazyStickyBar: <no|yes>) | LH mobile (preview): perf <x.xx> · a11y 1.00 · BP 1.00 · SEO <x.xx> · LCP <n> ms · CLS <n> (both routes) | pixel: tr 390/900/1440 = <a>/<b>/<c> % · en <a>/<b>/<c> % (iterations: <1|2>); named deltas: D13 thank-you navigation + hire.063 submit, consent checkbox on both forms (W79), quick-quote contact person, package field labels (W115), optional message + ISO-2 dial on the request form, shared startWhen labels (W78), Accordion string triggers (chips in panel), map without hover, logo band hidden (W6), hero placeholder → h1 is LCP (§10 #4), blue-safe surfaces + tertiary greys (D20), hire.043 via override (W7), navy sticky bar; brief deviation: ProcessSteps "cards" instead of a horizontal Timeline; WP-C sheet: hire.142 "+ countries" after the `13` metric, hire.201/203/215 "continues on WhatsApp", unused hire.059–062/064/065/217/218; /work-permit and /hiring-cost-calculator cross-links 404 until T3/T4 | <date> |
```

**Sys keys added:** `sys.hire.whatsapp`, `sys.hire.jump.label`, `sys.hire.sc.titleTail`, `sys.hire.sc.mapTitle`, `sys.hire.sc.turkiye`, `sys.hire.form.dial` — 6 keys, identical key set in `src/messages/tr.json` and `src/messages/en.json` (EN `sc.titleTail` is `''` on purpose); pinned by `_lib/__tests__/sys-keys.test.ts`. No `sys.seo.hire.*` (the page record carries `hire.264`/`hire.265`). Consumed, not added: `sys.form.options.startWhen.{asap,month1,months1to3,planning}` (WP2a Task 5, W78), `sys.form.labels.message`, `sys.form.consent.label`, `sys.form.hints.optional`, `sys.form.placeholders.*`, `sys.form.fallback.*`, `sys.marquee.{pause,play}`, `sys.nav.breadcrumbs`.

**Package ids used:** 235 of the page's 302, every one verified present in `src/content/local/catalogue.json` (2026-09-24): `hire.002`, `hire.020`–`hire.044`, `hire.047`–`hire.058` (field labels, W115), `hire.063`, `hire.066`–`hire.075` (`073` renders only once logos exist), `hire.076`–`hire.082` (sector labels via the `sectors` collection's `labelId`; `082` "Other" only as a request-form option), `hire.083`–`hire.088` (subtitles via `subtitleId`), `hire.089`–`hire.139`, `hire.140`–`hire.145`, `hire.146`–`hire.169`, `hire.170`–`hire.193`, `hire.194`–`hire.198`, `hire.199`–`hire.215`, `hire.219`–`hire.222`, `hire.240` (through `StoreBadges`), `hire.243`, `hire.244`, `hire.249`–`hire.253`, `hire.264`–`hire.265` (metadata), `hire.271`–`hire.302`. Not rendered (and why): `hire.001`, `hire.003`–`hire.019`, `hire.223`–`hire.239`, `hire.246`–`hire.248` (chrome — the layout renders the canonical `home.*` ids per R15); `hire.045`/`046` (inline success panel — D13); `hire.059`–`062` (the shared W78 option labels replace them); `hire.064`/`065`/`217`/`218` (KVKK sentences — W79, WP-C legal sheet); `hire.216` (WhatsApp submit wording — D13); `hire.241` (App Store badge — `ios` is `null`, W8); `hire.242` (the hero placeholder's design caption — the slot is decorative, `alt=""`); `hire.245` (logo-slot caption — the band is hidden, W6); `hire.254`–`hire.263` (the mock's `sendByEmail` body labels — W95: the e-mail link carries only the subject `hire.253`); `hire.266`–`hire.270` (OG/schema strings — the OG route reads the page record's title/description; there is no Service node, §3.1).

**Foundation gaps:** none. Accepted page-local items (WP2b reconcile): `ProcessSteps variant="cards"` instead of a horizontal Timeline; `Field as="select"` ignoring `placeholder` (W111 — `defaultValue` pre-selects the dial); the package KVKK sentences not rendered (W79, one site-wide consent sentence); the `LazyStickyBar` wrapper only if the js-size pass needs it (W85's `LazyIsland` takes a function prop, so a server page needs a one-line client wrapper). Resolved since the draft: the consent-copy prop (W79 — not wanted), the `FormShell` id scope (`idScope`, fix round `6c35588`), the sticky bar's contact tracking and test id (W81, WP2a Task 5), the dial select island (`Field.defaultValue`, Task 2 addendum).
