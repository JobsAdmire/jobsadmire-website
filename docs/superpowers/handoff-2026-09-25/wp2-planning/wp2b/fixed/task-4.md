### Task 4: Work Permit (`/calisma-izni`, `/en/work-permit`)

Port of `design-package/design/Work Permit.dc.html` (strings `wp.001`–`wp.398`, 63 legal-flagged) onto the WP1 page pattern + the WP2a foundation. Every path below is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation`. **Execution order (W99):** T1 → T13 → T2 → T3 → **T4**; by the time this task runs, T1 has created the shared doc anchors (W98: `docs/SEO.md` `## Pages` table, `docs/ANALYTICS.md` `### Page instrumentation (WP2b)`, the per-page bullet list under `docs/CONTENT-MODEL.md` `### Adding copy`, the WP2b ledger table), T13 has made `/privacy` and the footer legal links resolve, and T2/T3 have appended their `GATE_ROUTE_TABLE` rows. WP2a Tasks 3–9 (with the additions in `.superpowers/sdd/2026-09-20-wp2a-foundation/task-{3,5,6,7}-additions.md`) are merged: the task consumes them as landed.

**No door form** (PRD §2 row 5: "none (explainer)"; the Operations catalog has no `permit` key — never invent one), so W3/W78/W79/W115 hold vacuously: no `actions.ts`, no `FormShell`, no consent row, no `START_WHEN_KEYS`, no field labels. The page's conversion path is WhatsApp (D11 Phase A co-primary) plus the Hire Workers cross-links.

Rulings in force: W1 (numbers from the collection, `makeTf` on every id — `wp.030`, `wp.264`, `wp.274` carry `{placed}`/`{firstDayWeeks}`/`{firstDayWeeksInCountry}`), W2 (the eligibility wizard makes **no** timing claim about the 1:5 ratio; `wp.050`/`wp.051`/`wp.201`/`wp.339` render as authored where they appear outside the wizard; `wp.066` is not read), W4 (related-articles block hidden below `blogNavVisible`), W5 (no employer-updates/newsletter block — `wp.398` stays an orphan), W9/W23 (id-less copy → `sys.wp.*`, `sys.seo.wp.*`), W10 (desktop/mobile copy variants via CSS classes, both in the DOM), W12/W26/W67 (`eligibility_check_complete` with `result ∈ eligible|conditional|ineligible`, nothing else), W13 (the wizard is above the fold and small → SSR'd `'use client'`, not `next/dynamic`), W17 (`CTA_BY_PATHNAME['/work-permit']` targets `#permit-cta` — this page **must** render that id), W18 + W81 (`StickyCtaBar` page-mounted with `hideNearId="permit-cta"`; it keeps the design's Call / WhatsApp buttons because the bar now renders `tel:`/`wa.me` CTAs through `ContactLink` with `placement: 'page_cta'` and carries `data-testid="sticky-cta"`), W19 (route group `(site)`), W20/W21 (delete `'/work-permit'` from `UNBUILT_PATHNAMES`; two rows in `GATE_ROUTE_TABLE`), W45/W98 (doc edits anchor on sentences and append to the shared tables T1 created), W82 (block CTAs accept typed hrefs — the page's internal CTAs pass pathname strings, which `Button` localizes), W83 (the FAQ ask card's e-mail row is `FaqAskCard.email`/`emailLabelId`/`subject` — no `footer` workaround), W90 (the wizard reads only `sys.wp.wizard.*`/`sys.whatsapp.prefill`, which the picked client messages carry; `sys.seo.wp.*` stays server-only), W91/W92 (the binding preview gate reaches the protected preview through the automation-bypass header, with `lighthouserc.preview.json`; previews are door-less except `staging` — this page sends nothing to the door, so its e2e is identical on either face), W95/W76 (the wizard's WhatsApp result link carries only the bare `https://wa.me/<number>` in its href; the prefill with the four answers is composed at click time and opened with `noopener`), W109 (breadcrumbs use this page's own package labels `wp.021`/`wp.011`), W113 (section test ids sit on inner `<div>`s — `Section`'s props stay frozen), D17 (dated badge from `rateConfig`, hidden when review is due), D20 (accessibility over fidelity: **no tab switchers** — the routes comparison and the timeline pair stack on mobile instead of hiding a column; the CSS `::before` "Work permit / e-Muafiyet" labels become real strings `wp.099`/`wp.100`), D26 (LCP = the h1, `data-lcp-slot="h1"`; the `wp-hero` slot renders as a named placeholder behind the hero, never the LCP), D27 (not a pixel-harness page — side-by-side review).

Design deltas this task records (side-by-side review, not a pixel-harness page — D27): (1) tabs → stacked cards on mobile; (2) the hero's 4th stat chip ("₺100,000+ fine without a permit") is **not rendered** — the figure has no package id and no data source (`RateConfig` carries no fine amount), so D17 forbids typing it (accepted by the WP2b reconcile: a fine field in `RateConfig` is a later content task if the owner wants the chip back); the legal-flagged penalty line (`wp.196`) and FAQ answer (`wp.342`) carry the fine verbatim; `wp.052` is not read; (3) the dated badge `wp.022` ("Updated July 2026 · …") is replaced by `sys.wp.hero.updated` filled from `rateConfig.updatedAt` and hidden when `isReviewDue(rateConfig)` (D17); (4) the process steps render as a page-local server grid (the foundation's `ProcessSteps` has no badge slot for `wp.255` "SGK day one" and no horizontal variant — accepted page-local); the IntersectionObserver reveal animation is dropped (no JS, reduced-motion parity); (5) the renewal banner's big "60 / days" numeral is dropped — "60" has no id; `wp.322` and `wp.326` carry the window in words; `wp.325` is not read; (6) the FAQ pair "What is e-Muafiyet and who can use it?" has a question id (`wp.340`) but **no answer id** in the package — the answer lives in `sys.wp.faq.exemptionAnswer` and is listed for the WP-C legal review; (7) the wizard's WhatsApp result button keeps the design's prefilled message but no longer carries it in the DOM href (W95/W76): the href is the bare chat, the answers ride only in the URL opened on click; (8) the closing band's two mobile "route cards" (`wp.363`–`wp.365`) collapse into the same three CTAs on every width; `wp.361`/`wp.362` render as the band's `ticks` (`md:hidden`, W10); (9) the design's static related-article cards (`wp.353`–`wp.358`) are not used — when the block is visible it reads the `blog` collection filtered to `workPermits`; (10) the sample permit card is rendered from markup with fictional data and is flagged for counsel sign-off (README: the reproduction is deliberate; `wp.160` caption always shown); (11) the closing band sits on a page-local gradient wrapper (`#f4f9fc → #e8f3f9`) because `Section` has no gradient tone (accepted page-local).

**Files:**

Create
- `src/app/[locale]/(site)/work-permit/page.tsx`
- `src/app/[locale]/(site)/work-permit/_content.ts` — the page's package-id tables (pure, no imports)
- `src/app/[locale]/(site)/work-permit/_content.test.ts`
- `src/app/[locale]/(site)/work-permit/eligibility.ts` — pure wizard logic (client-safe)
- `src/app/[locale]/(site)/work-permit/eligibility.test.ts`
- `src/app/[locale]/(site)/work-permit/fragments.ts` — fragment-spacing helper (pure)
- `src/app/[locale]/(site)/work-permit/fragments.test.ts`
- `src/app/[locale]/(site)/work-permit/badge.ts` — the D17 dated-badge rule (server-only by use: it formats through `@/lib/format/date`)
- `src/app/[locale]/(site)/work-permit/badge.test.ts`
- `src/app/[locale]/(site)/work-permit/_components/icons.tsx` — page-local decorative glyphs
- `src/app/[locale]/(site)/work-permit/_components/Frag.tsx`
- `src/app/[locale]/(site)/work-permit/_components/EligibilityWizard.tsx` (`'use client'`)
- `src/app/[locale]/(site)/work-permit/_components/EligibilityWizard.test.tsx`
- `src/app/[locale]/(site)/work-permit/_components/Hero.tsx`
- `src/app/[locale]/(site)/work-permit/_components/JumpNav.tsx`
- `src/app/[locale]/(site)/work-permit/_components/AudienceRouter.tsx`
- `src/app/[locale]/(site)/work-permit/_components/RoutesComparison.tsx`
- `src/app/[locale]/(site)/work-permit/_components/SampleCard.tsx`
- `src/app/[locale]/(site)/work-permit/_components/PermitTypes.tsx`
- `src/app/[locale]/(site)/work-permit/_components/Rules.tsx`
- `src/app/[locale]/(site)/work-permit/_components/Exemptions.tsx`
- `src/app/[locale]/(site)/work-permit/_components/ProcessGrid.tsx`
- `src/app/[locale]/(site)/work-permit/_components/TimelinePair.tsx`
- `src/app/[locale]/(site)/work-permit/_components/Costs.tsx`
- `src/app/[locale]/(site)/work-permit/_components/Documents.tsx`
- `src/app/[locale]/(site)/work-permit/_components/Renewal.tsx`
- `src/app/[locale]/(site)/work-permit/_components/PermitFaq.tsx`
- `src/app/[locale]/(site)/work-permit/_components/RelatedArticles.tsx`
- `src/app/[locale]/(site)/work-permit/_components/RelatedArticles.test.tsx`
- `src/app/[locale]/(site)/work-permit/_components/PermitCta.tsx`
- `e2e/pages/work-permit.spec.ts`

Modify
- `src/lib/seo/routes.ts` — delete the one element `'/work-permit'` from the `UNBUILT_PATHNAMES` literal (W20; find it by its text, never by line number)
- `e2e/routes.ts` — append two rows at the end of the `GATE_ROUTE_TABLE` literal, after whichever page rows T1/T13/T2/T3 left there (W21)
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.wp.*` under the existing `sys.seo` object (beside WP2a Task 4's `ogTagline` and the earlier pages' `seo.<pageKey>` objects) and a new `sys.wp` object
- `docs/SEO.md` (one row in T1's `## Pages` table), `docs/ANALYTICS.md` (the `eligibility_check_complete` row's "Fires on" cell + one bullet under `### Page instrumentation (WP2b)`), `docs/CONTENT-MODEL.md` (one bullet in the per-page list under `### Adding copy (W9, W23, W54)`), `docs/PRD.md` (the §2 row 5 "Forms carried" cell; the core-page count in the sentence beginning "**Not yet built, by design (WP2 and later):**")
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — ledger row (T1's row format, W98)

Test
- `src/app/[locale]/(site)/work-permit/_content.test.ts`, `eligibility.test.ts`, `fragments.test.ts`, `badge.test.ts`, `_components/EligibilityWizard.test.tsx`, `_components/RelatedArticles.test.tsx` (Vitest)
- `e2e/pages/work-permit.spec.ts` (Playwright, both projects)
- `src/lib/seo/unbuilt.test.ts` and `src/messages/messages.test.ts` (existing WP2a tests — they must stay green: the filesystem and the set agree, the two message files carry identical key sets)

No `actions.ts`: the page sends nothing to the door. Every `tel:`/`wa.me`/`mailto:` anchor renders through `ContactCta` (server), `ContactLink` (the router's permit-only card), the blocks (`FaqBlock` ask card, `ClosingCtaBand`, `StickyCtaBar` — W81/W83) or, for the one link whose prefill carries visitor answers, the wizard's own click-time anchor that fires through `useContactClick('page_cta')` (W95). Every such click fires `whatsapp_click`/`call_click`/`email_click` with `placement: 'page_cta'`.

**Interfaces:**

Consumes (WP1, as built — verified in the tree): `getBundle` and the `makeTf` re-export (`@/content/adapter`; `export * from './pure'`); `makeTf(bundle, locale): (id: string) => string` (`@/content/pure`); `Section`, `Eyebrow`, `Button` (`@/design/primitives`); `Link`, `type Href` (`@/i18n/navigation`); `routing`, `type Locale` (`@/i18n/routing`; `pathnames['/work-permit'] = { tr: '/calisma-izni', en: '/work-permit' }`); `buildMetadata` (`@/lib/seo/metadata`); `waLink(number, text)`, `telLink(phone)`, `mailLink(email, subject?)` (`@/lib/contact`); `track(event, params)` (`@/analytics/track`); `renderWithIntl(ui, { locale? })` (`@/test/render`); `type Bundle` (`contract/website-bundle.v1`, imported relatively as `'../../../../../../contract/website-bundle.v1'` from `_components/`, `'../../../../../contract/website-bundle.v1'` from the route folder); `bundle.settings.{whatsappNumber,phone,phoneDisplay,email}` (`905011240340`, `+905011240340`, `+90 501 124 03 40`, `info@jobsadmire.com` in the local bundle); `sys.whatsapp.prefill` ("Merhaba JobsAdmire, " / "Hello JobsAdmire, ").
Consumes (WP2a, exactly as `produces-final.md` + the Task 3/5/6/7 additions spell them):
- Task 1: `getCollection(bundle, 'blog')`, `getRateConfig(bundle)`, `blogNavVisible(bundle)`, `type BlogPost`, `type RateConfig` (`@/content/collections`); `bundle.pages.wp` = `{ titleId: '', descriptionId: '', jsonLd: ['breadcrumb','faq'] }` → the W38 fallback.
- Task 3: `PARAM_ENUMS.result` + `ALLOWED_PARAMS.eligibility_check_complete = ['page','locale','result']` (`@/analytics/track`); `useContactClick(placement): (kind: ContactKind) => void` (`@/analytics/useContactClick`); `ContactLink` (`@/analytics/ContactLink`); `buttonClassName(variant, size?, className?)` (`@/design/primitives`); `CTA_BY_PATHNAME['/work-permit']` = `wp.016`+`wp.017` → `{ pathname: '/work-permit', hash: '#permit-cta' }` (`@/design/chrome/ctas`) → **this page renders `id="permit-cta"`**; the `(site)` route group.
- Task 4: `UNBUILT_PATHNAMES` (`@/lib/seo/routes`) + `src/lib/seo/unbuilt.test.ts`; `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })`; the `sys.seo` object (`ogTagline`); `OG_PAGE_KEYS` contains `'wp'`.
- Task 5: `Section` tones `'light' | 'dark' | 'pale' | 'band'`; `ButtonVariant` (incl. `'inverse'`); `formatMonth(iso, locale)` (`@/lib/format/date`); `ContactCta`, `FaqBlock`, `type FaqItem`, `type FaqAskCard` (+ W83 `email?`, `emailLabelId?`, `subject?`), `Breadcrumbs`, `type Crumb`, `ClosingCtaBand`, `type Cta` (W82 typed hrefs), `ImageSlot`, `PostCard` (`@/design/blocks`); `StickyCtaBar({ message, ctas, showAfterPx?, hideNearId?, live? })` + `type StickyCta` (`@/design/chrome/StickyCtaBar`, W81: contact CTAs via `ContactLink` `page_cta`, wrapper `data-testid="sticky-cta"`); `testBundle` (`@/test/bundle`).
- Task 6: `ProgressBar({ value, max, label, valueText?, tone? })` — imported from `@/design/islands/ProgressBar` directly (not the islands barrel, so no other island rides into the wizard's chunk).
- Task 7: `GATE_ROUTE_TABLE` (`e2e/routes.ts`); the page markup contract (`page-h1`, one `data-lcp-slot`, named `data-placeholder`, D26); `npm run gate`, `npm run js-size` (`SCRIPT_CEILING` 204,800 / `LAZY_LINE` 194,560); W91's bypass header in `playwright.config.ts`/`scripts/gate.sh` and `lighthouserc.preview.json`.
- Task 9: `isReviewDue(rateConfig, now?)` (`@/lib/calculator`); `RATE` (`@/lib/calculator/__tests__/fixtures`: `updatedAt '2026-01-15'`, `reviewDueAt '2026-12-20'`).

Produces: nothing later tasks import. Contracts other tasks rely on: the element `id="permit-cta"` (T0c's `CTA_BY_PATHNAME` entry and this page's sticky bar), the named placeholder `data-placeholder="wp-hero"` with the h1 as the LCP slot (T15's placeholder inventory row for `/calisma-izni` · `/en/work-permit`), the two `GATE_ROUTE_TABLE` rows (T15's gate), and `'/work-permit'` gone from `UNBUILT_PATHNAMES` (T15 asserts the set empty). (`fragments.ts`'s `needsGap` may be lifted to `src/lib/` by a later page that composes package fragments the same way — leave it page-local here.)

---

- [ ] **Cycle 1 — Route skeleton, metadata, id tables, sys copy, gate registration**

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/work-permit/_content.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { WP_COSTS, WP_DOCS, WP_EXEMPTIONS, WP_FAQ, WP_IDS, WP_RULES, WP_TIMELINE } from './_content';

// The bundles are read with readFileSync (not imported) — the D23 lint rule forbids importing
// src/content/local/* from src/**, and this test only needs to prove the ids exist (a missing
// id throws in dev through makeTf and renders '' in production: silent copy loss).
const root = join(__dirname, '../../../../content/local');
const strings = (locale: 'tr' | 'en') =>
  JSON.parse(readFileSync(join(root, `bundle.${locale}.json`), 'utf8')).strings as Record<
    string,
    string
  >;

describe('Work Permit id tables', () => {
  const trS = strings('tr');
  const enS = strings('en');
  it('every id the page reads exists in both bundles', () => {
    const missing = WP_IDS.filter((id) => !(id in trS) || !(id in enS));
    expect(missing).toEqual([]);
  });
  it('reads only wp.* ids (no chrome or foreign-page ids re-derived here)', () => {
    expect(WP_IDS.every((id) => id.startsWith('wp.'))).toBe(true);
  });
  it('never reads the ids the page replaces or drops on purpose', () => {
    // wp.022 dated badge (D17), wp.066 ratio timing inside the wizard (W2), wp.052 4th chip,
    // wp.261/262 tab labels (D20), wp.300 typed count, wp.325 numeral, wp.353–365 static cards,
    // wp.398 newsletter orphan (W5), wp.016/017 header CTA (chrome reads them).
    const dropped = ['wp.016', 'wp.017', 'wp.022', 'wp.052', 'wp.066', 'wp.261', 'wp.262', 'wp.300', 'wp.325', 'wp.353', 'wp.363', 'wp.398'];
    expect(WP_IDS.filter((id) => dropped.includes(id))).toEqual([]);
  });
  it('the FAQ has nine pairs: eight package answers plus the one sys answer', () => {
    expect(WP_FAQ).toHaveLength(9);
    expect(WP_FAQ.filter((f) => f.aId !== null)).toHaveLength(8);
    expect(WP_FAQ.find((f) => f.qId === 'wp.340')?.aId).toBeNull();
  });
  it('rules, documents, exemptions, timeline and cost tables have the design counts', () => {
    expect(WP_RULES).toHaveLength(6);
    expect(WP_DOCS.employer.items).toHaveLength(6);
    expect(WP_DOCS.worker.items).toHaveLength(6);
    expect(WP_EXEMPTIONS.cards).toHaveLength(5);
    expect(WP_EXEMPTIONS.facts).toHaveLength(4);
    expect(WP_TIMELINE.abroad.rows).toHaveLength(4);
    expect(WP_TIMELINE.here.rows).toHaveLength(3);
    expect(WP_COSTS).toHaveLength(3);
  });
});

describe('sys.wp.* copy', () => {
  const keys = (o: unknown, prefix = ''): string[] =>
    typeof o === 'object' && o !== null
      ? Object.entries(o as Record<string, unknown>).flatMap(([k, v]) => keys(v, `${prefix}${k}.`))
      : [prefix.slice(0, -1)];
  it('carries the same key set in both locales', () => {
    expect(keys(tr.sys.wp).sort()).toEqual(keys(en.sys.wp).sort());
    expect(keys(tr.sys.seo.wp).sort()).toEqual(keys(en.sys.seo.wp).sort());
  });
  it('is the pinned set', () => {
    expect(keys(en.sys.seo.wp).sort()).toEqual(['description', 'title']);
    expect(keys(en.sys.wp).sort()).toEqual(
      [
        'documents.count',
        'faq.emailSubject',
        'faq.exemptionAnswer',
        'hero.updated',
        'sample.foreignerId',
        'sample.label',
        'sample.validity',
        'whatsapp.exemption',
        'whatsapp.permitOnly',
        'whatsapp.permitType',
        'whatsapp.question',
        'whatsapp.quote',
        'whatsapp.renewal',
        'wizard.options.abroad',
        'wizard.options.fivePlus',
        'wizard.options.no',
        'wizard.options.underFive',
        'wizard.options.yes',
        'wizard.points.ratio',
        'wizard.prefill.intro',
        'wizard.prefill.result',
        'wizard.progress',
        'wizard.progressLabel',
        'wizard.resultLabel',
      ].sort(),
    );
  });
  it('the ratio point makes no timing claim (W2)', () => {
    // No number besides the ratio itself, and no month/day/week (TR: ay/gün/hafta) word.
    expect(en.sys.wp.wizard.points.ratio.replace('1:5', '')).not.toMatch(/\d|\b(month|day|week)s?\b/i);
    expect(tr.sys.wp.wizard.points.ratio.replace('1:5', '')).not.toMatch(/\d|\bay\b|aydan|ayından|gün|hafta/i);
  });
  it('the TR WhatsApp tails continue the "Merhaba JobsAdmire, " opener in lower case', () => {
    const tails = [...Object.values(tr.sys.wp.whatsapp), tr.sys.wp.wizard.prefill.intro];
    expect(tails.filter((t) => t[0] !== t[0].toLocaleLowerCase('tr'))).toEqual([]);
  });
});
```

`e2e/pages/work-permit.spec.ts` (first version — Cycles 3–5 extend it):

```ts
import { test, expect } from '@playwright/test';

const ROUTES = [
  { path: '/calisma-izni', lang: 'tr' },
  { path: '/en/work-permit', lang: 'en' },
] as const;

for (const r of ROUTES) {
  test(`${r.path}: one h1 tagged page-h1, real copy, no leaked tokens`, async ({ page }) => {
    const res = await page.goto(r.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', r.lang);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.locator('h1[data-testid="page-h1"][data-lcp-slot="h1"]');
    await expect(h1).toHaveCount(1);
    expect((await h1.innerText()).trim().length).toBeGreaterThan(0);
    const body = await page.locator('main').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
  });
}
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/work-permit"` → fails at import: `Cannot find module './_content'`.
`E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/work-permit.spec.ts --project=desktop` (against `next dev` of the current branch) → `expect(res?.status()).toBe(200)` fails with `404` (the `[...rest]` catch-all).
`npx vitest run src/lib/seo/unbuilt.test.ts` stays green for now (the set and the filesystem still agree) — it goes red the moment the page file exists without the set edit, which is why Step 3 does both in one commit.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/_content.ts` — every package id the page reads, as data. Fragments are composed only where the package itself splits them (W23).

```ts
/** The Work Permit page's package-id tables. Pure data — no imports — so the wizard island
 *  (client) and the server sections share one source, and `_content.test.ts` can prove every
 *  id exists in both bundles before a dev-mode `makeTf` throw or a production '' does. */

export type Fragment = { id: string; strong?: boolean };

/** Hero benefit bullets: strong lead + rest (the package splits them). wp.030 carries
 *  `{placed}` (W1) — makeTf fills it. */
export const WP_HERO_BENEFITS: readonly (readonly [string, string])[] = [
  ['wp.028', 'wp.029'],
  ['wp.030', 'wp.031'],
  ['wp.032', 'wp.033'],
];

/** Hero stat chips: strong figure + label. The design's 4th chip ("₺100,000+" + wp.052) has
 *  no figure id and no data source (D17) — see the task's delta (2). wp.050/051 render as
 *  authored (W2: only the wizard stays silent on the ratio's timing). */
export const WP_HERO_CHIPS: readonly (readonly [string, string])[] = [
  ['wp.046', 'wp.047'],
  ['wp.048', 'wp.049'],
  ['wp.050', 'wp.051'],
];

export const WP_JUMP: readonly { id: string; hash: string }[] = [
  { id: 'wp.057', hash: '#eligibility' },
  { id: 'wp.058', hash: '#routes' },
  { id: 'wp.059', hash: '#rules' },
  { id: 'wp.060', hash: '#muafiyet' },
  { id: 'wp.061', hash: '#timeline' },
  { id: 'wp.062', hash: '#costs' },
  { id: 'wp.063', hash: '#documents' },
  { id: 'wp.064', hash: '#faq' },
];

export type RouterCard = {
  key: 'hire' | 'permitOnly' | 'partner' | 'calculator';
  titleId: string;
  bodyId: string;
  ctaId: string;
};
export const WP_ROUTER: readonly RouterCard[] = [
  { key: 'hire', titleId: 'wp.085', bodyId: 'wp.086', ctaId: 'wp.087' },
  { key: 'permitOnly', titleId: 'wp.088', bodyId: 'wp.089', ctaId: 'wp.090' },
  { key: 'partner', titleId: 'wp.091', bodyId: 'wp.092', ctaId: 'wp.093' },
  { key: 'calculator', titleId: 'wp.094', bodyId: 'wp.095', ctaId: 'wp.096' },
];

/** Permit-vs-exemption comparison: five rows, each a label + two fragment lists. */
export type CompareRow = { labelId: string; permit: Fragment[]; exempt: Fragment[] };
export const WP_COMPARE: readonly CompareRow[] = [
  {
    labelId: 'wp.110',
    permit: [{ id: 'wp.108' }, { id: 'wp.109', strong: true }],
    exempt: [{ id: 'wp.111' }, { id: 'wp.112', strong: true }],
  },
  {
    labelId: 'wp.115',
    permit: [{ id: 'wp.113', strong: true }, { id: 'wp.114' }],
    exempt: [{ id: 'wp.116', strong: true }, { id: 'wp.117' }],
  },
  {
    labelId: 'wp.120',
    permit: [{ id: 'wp.118', strong: true }, { id: 'wp.119' }],
    exempt: [{ id: 'wp.121', strong: true }, { id: 'wp.122' }],
  },
  {
    labelId: 'wp.125',
    permit: [{ id: 'wp.123' }, { id: 'wp.124', strong: true }],
    exempt: [{ id: 'wp.126' }, { id: 'wp.127', strong: true }, { id: 'wp.128' }],
  },
  {
    labelId: 'wp.132',
    permit: [{ id: 'wp.129' }, { id: 'wp.130', strong: true }, { id: 'wp.131' }],
    exempt: [{ id: 'wp.133' }, { id: 'wp.130', strong: true }, { id: 'wp.134' }],
  },
];

/** Featured fixed-term permit bullets (fragment lists). */
export const WP_FIXED_TERM_BULLETS: readonly Fragment[][] = [
  [{ id: 'wp.167' }, { id: 'wp.168', strong: true }, { id: 'wp.169' }],
  [{ id: 'wp.170' }, { id: 'wp.130', strong: true }, { id: 'wp.171' }],
  [{ id: 'wp.172' }, { id: 'wp.173', strong: true }, { id: 'wp.174' }],
];
export const WP_OTHER_TYPES: readonly (readonly [string, string])[] = [
  ['wp.176', 'wp.177'],
  ['wp.178', 'wp.179'],
  ['wp.180', 'wp.181'],
  ['wp.182', 'wp.183'],
];

export const WP_PENALTIES: readonly string[] = ['wp.196', 'wp.197', 'wp.198', 'wp.199'];
export const WP_RULES: readonly (readonly [string, string])[] = [
  ['wp.200', 'wp.201'],
  ['wp.202', 'wp.203'],
  ['wp.204', 'wp.205'],
  ['wp.206', 'wp.207'],
  ['wp.208', 'wp.209'],
  ['wp.210', 'wp.211'],
];

export type ExemptionIcon = 'wrench' | 'globe' | 'leaf' | 'award' | 'package';
export type ExemptionCard = { badgeId: string; titleId: string; bodyId: string; icon: ExemptionIcon };
export type ExemptionFact = { labelId: string; strongId: string; restId: string };
export const WP_EXEMPTIONS: { cards: readonly ExemptionCard[]; facts: readonly ExemptionFact[] } = {
  cards: [
    { badgeId: 'wp.219', titleId: 'wp.220', bodyId: 'wp.221', icon: 'wrench' },
    { badgeId: 'wp.219', titleId: 'wp.222', bodyId: 'wp.223', icon: 'globe' },
    { badgeId: 'wp.224', titleId: 'wp.225', bodyId: 'wp.226', icon: 'leaf' },
    { badgeId: 'wp.227', titleId: 'wp.228', bodyId: 'wp.229', icon: 'award' },
    { badgeId: 'wp.219', titleId: 'wp.230', bodyId: 'wp.231', icon: 'package' },
  ],
  facts: [
    { labelId: 'wp.234', strongId: 'wp.235', restId: 'wp.236' },
    { labelId: 'wp.237', strongId: 'wp.238', restId: 'wp.239' },
    { labelId: 'wp.240', strongId: 'wp.241', restId: 'wp.242' },
    { labelId: 'wp.243', strongId: 'wp.244', restId: 'wp.245' },
  ],
};

export const WP_PROCESS: readonly { titleId: string; bodyId: string; badgeId?: string }[] = [
  { titleId: 'wp.248', bodyId: 'wp.249' },
  { titleId: 'wp.250', bodyId: 'wp.251' },
  { titleId: 'wp.252', bodyId: 'wp.253' },
  { titleId: 'wp.254', bodyId: 'wp.256', badgeId: 'wp.255' },
];

export type TimelineRow = readonly [string, string];
export type TimelineCard = {
  titleId: string;
  /** wp.264 / wp.274 carry `{firstDayWeeks}` / `{firstDayWeeksInCountry}` (W1). */
  durationId: string;
  rows: readonly TimelineRow[];
  noteId: string | null;
};
export const WP_TIMELINE: { abroad: TimelineCard; here: TimelineCard } = {
  abroad: {
    titleId: 'wp.263',
    durationId: 'wp.264',
    rows: [
      ['wp.265', 'wp.266'],
      ['wp.267', 'wp.268'],
      ['wp.269', 'wp.270'],
      ['wp.271', 'wp.272'],
    ],
    noteId: null,
  },
  here: {
    titleId: 'wp.273',
    durationId: 'wp.274',
    rows: [
      ['wp.265', 'wp.275'],
      ['wp.276', 'wp.277'],
      ['wp.278', 'wp.279'],
    ],
    noteId: 'wp.280',
  },
};

export type CostCard = { eyebrowId: string; titleId: string; body: Fragment[]; ours: boolean };
export const WP_COSTS: readonly CostCard[] = [
  {
    eyebrowId: 'wp.283',
    titleId: 'wp.284',
    body: [{ id: 'wp.285' }, { id: 'wp.286' }, { id: 'wp.287' }],
    ours: false,
  },
  {
    eyebrowId: 'wp.288',
    titleId: 'wp.289',
    body: [{ id: 'wp.290' }, { id: 'wp.291' }, { id: 'wp.292' }],
    ours: false,
  },
  { eyebrowId: 'wp.293', titleId: 'wp.294', body: [{ id: 'wp.295' }], ours: true },
];

export type DocItem = { id: string; noteId?: string };
export type DocList = { titleId: string; items: readonly DocItem[] };
export const WP_DOCS: { employer: DocList; worker: DocList } = {
  employer: {
    titleId: 'wp.299',
    items: [
      { id: 'wp.301', noteId: 'wp.302' },
      { id: 'wp.303', noteId: 'wp.304' },
      { id: 'wp.305' },
      { id: 'wp.306' },
      { id: 'wp.307', noteId: 'wp.308' },
      { id: 'wp.309', noteId: 'wp.310' },
    ],
  },
  worker: {
    titleId: 'wp.311',
    items: [
      { id: 'wp.312' },
      { id: 'wp.313' },
      { id: 'wp.314' },
      { id: 'wp.315' },
      { id: 'wp.316' },
      { id: 'wp.317' },
    ],
  },
};

/** FAQ pairs in design order. `aId: null` = the answer has no package id (the design's
 *  faqData[3].a was never catalogued) — it lives in `sys.wp.faq.exemptionAnswer` (W9). */
export const WP_FAQ: readonly { qId: string; aId: string | null }[] = [
  { qId: 'wp.334', aId: 'wp.335' },
  { qId: 'wp.336', aId: 'wp.337' },
  { qId: 'wp.338', aId: 'wp.339' },
  { qId: 'wp.340', aId: null },
  { qId: 'wp.341', aId: 'wp.342' },
  { qId: 'wp.343', aId: 'wp.344' },
  { qId: 'wp.345', aId: 'wp.346' },
  { qId: 'wp.347', aId: 'wp.348' },
  { qId: 'wp.349', aId: 'wp.350' },
];

/** The single ids the sections read directly (not through a table above). */
const WP_SINGLE_IDS: readonly string[] = [
  // breadcrumbs (W109: this page's own labels) · hero · wizard chrome · sticky bar · jump label
  'wp.011', 'wp.021', 'wp.023', 'wp.024', 'wp.025', 'wp.026', 'wp.027', 'wp.034', 'wp.035',
  'wp.036', 'wp.037', 'wp.038', 'wp.039', 'wp.040', 'wp.041', 'wp.042', 'wp.043', 'wp.044',
  'wp.045', 'wp.053', 'wp.054', 'wp.055', 'wp.056',
  // wizard points, verdict titles, questions and option labels (eligibility.ts reads them)
  'wp.065', 'wp.067', 'wp.068', 'wp.069', 'wp.070', 'wp.071', 'wp.072', 'wp.073', 'wp.074',
  'wp.075', 'wp.076', 'wp.077', 'wp.078', 'wp.079', 'wp.080', 'wp.081', 'wp.082',
  // router · routes comparison · sample card
  'wp.083', 'wp.084', 'wp.097', 'wp.098', 'wp.099', 'wp.100', 'wp.101', 'wp.102', 'wp.103',
  'wp.104', 'wp.105', 'wp.106', 'wp.107', 'wp.135', 'wp.136', 'wp.137', 'wp.138', 'wp.139',
  'wp.140', 'wp.141', 'wp.142', 'wp.143', 'wp.144', 'wp.145', 'wp.146', 'wp.147', 'wp.148',
  'wp.149', 'wp.150', 'wp.151', 'wp.152', 'wp.153', 'wp.154', 'wp.155', 'wp.156', 'wp.157',
  'wp.158', 'wp.159', 'wp.160',
  // permit types · rules · exemptions · process
  'wp.161', 'wp.162', 'wp.163', 'wp.164', 'wp.165', 'wp.166', 'wp.175', 'wp.184', 'wp.185',
  'wp.186', 'wp.187', 'wp.188', 'wp.189', 'wp.190', 'wp.191', 'wp.192', 'wp.193', 'wp.194',
  'wp.195', 'wp.212', 'wp.213', 'wp.214', 'wp.215', 'wp.216', 'wp.217', 'wp.218', 'wp.232',
  'wp.233', 'wp.246', 'wp.247', 'wp.257', 'wp.258',
  // timeline · costs · documents · renewal · FAQ side · related · closing band
  'wp.259', 'wp.260', 'wp.281', 'wp.282', 'wp.296', 'wp.297', 'wp.298', 'wp.318', 'wp.319',
  'wp.320', 'wp.321', 'wp.322', 'wp.323', 'wp.324', 'wp.326', 'wp.327', 'wp.328', 'wp.329',
  'wp.330', 'wp.331', 'wp.332', 'wp.333', 'wp.351', 'wp.352', 'wp.359', 'wp.360', 'wp.361',
  'wp.362', 'wp.366', 'wp.367', 'wp.395',
];

/** Every id above, for the existence test. */
export const WP_IDS: readonly string[] = Array.from(
  new Set<string>([
    ...WP_SINGLE_IDS,
    ...WP_HERO_BENEFITS.flat(),
    ...WP_HERO_CHIPS.flat(),
    ...WP_JUMP.map((j) => j.id),
    ...WP_ROUTER.flatMap((r) => [r.titleId, r.bodyId, r.ctaId]),
    ...WP_COMPARE.flatMap((r) => [r.labelId, ...r.permit.map((f) => f.id), ...r.exempt.map((f) => f.id)]),
    ...WP_FIXED_TERM_BULLETS.flat().map((f) => f.id),
    ...WP_OTHER_TYPES.flat(),
    ...WP_PENALTIES,
    ...WP_RULES.flat(),
    ...WP_EXEMPTIONS.cards.flatMap((c) => [c.badgeId, c.titleId, c.bodyId]),
    ...WP_EXEMPTIONS.facts.flatMap((f) => [f.labelId, f.strongId, f.restId]),
    ...WP_PROCESS.flatMap((s) => [s.titleId, s.bodyId, ...(s.badgeId ? [s.badgeId] : [])]),
    ...[WP_TIMELINE.abroad, WP_TIMELINE.here].flatMap((c) => [
      c.titleId,
      c.durationId,
      ...c.rows.flat(),
      ...(c.noteId ? [c.noteId] : []),
    ]),
    ...WP_COSTS.flatMap((c) => [c.eyebrowId, c.titleId, ...c.body.map((f) => f.id)]),
    ...[WP_DOCS.employer, WP_DOCS.worker].flatMap((l) => [
      l.titleId,
      ...l.items.flatMap((d) => [d.id, ...(d.noteId ? [d.noteId] : [])]),
    ]),
    ...WP_FAQ.flatMap((f) => [f.qId, ...(f.aId ? [f.aId] : [])]),
  ]),
);
```

(Prettier reflows `WP_SINGLE_IDS` to one id per line — let it; the content is what matters. The table types are explicit instead of `as const` so the sections can spread and map them without literal-type friction.)

`src/app/[locale]/(site)/work-permit/page.tsx` (Cycle 1 skeleton — Cycle 3 grows it, Cycle 5 writes the final file):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { Section } from '@/design/primitives';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';

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
  // The package carries no <title>/description for this page, so the bundle's `pages.wp`
  // record has '' ids and W38 routes to these (W23).
  return buildMetadata({
    locale,
    href: '/work-permit',
    bundle,
    pageKey: 'wp',
    fallbackTitle: sys('seo.wp.title'),
    fallbackDescription: sys('seo.wp.description'),
  });
}

export default async function WorkPermit({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="dark">
      <div className="container-site">
        <h1 data-testid="page-h1" data-lcp-slot="h1" className="text-h1">
          {tf('wp.023')} <span className="text-sky">{tf('wp.024')}</span>
        </h1>
      </div>
    </Section>
  );
}
```

`src/lib/seo/routes.ts` — inside the `UNBUILT_PATHNAMES` literal, delete the element `'/work-permit',` (W20). Nothing else in the file changes.

`e2e/routes.ts` — append at the end of the `GATE_ROUTE_TABLE` literal (after the last row the earlier page tasks added, before the closing `]`):

```ts
  { path: '/calisma-izni', indexable: true },
  { path: '/en/work-permit', indexable: true },
```

`src/messages/en.json` — inside `"sys"`: add a `"wp"` member to the existing `"seo"` object (beside `ogTagline` and the earlier pages' objects), and a new top-level `"wp"` object (all keys land now so the pinned-set test passes; later cycles only read them):

```json
"seo": {
  "…": "(existing members unchanged)",
  "wp": {
    "title": "Work permit in Türkiye for foreign workers (2026) — rules, e-Muafiyet and process | JobsAdmire",
    "description": "How a Turkish work permit is obtained under Law No. 6735: the standard permit versus the e-Muafiyet exemption, the 1:5 ratio and the other employer criteria, the consulate and Ministry stages, timelines, costs and documents — filed for you under JobsAdmire's İŞKUR licence, with workers we place or permit-only for workers you already have."
  }
},
"wp": {
  "hero": {
    "updated": "Updated {month} · Reviewed by our permit team"
  },
  "wizard": {
    "progress": "{current} / {total}",
    "progressLabel": "Eligibility check progress",
    "resultLabel": "Your result",
    "options": {
      "yes": "Yes",
      "no": "No",
      "fivePlus": "5 or more",
      "underFive": "Fewer than 5",
      "abroad": "Abroad"
    },
    "points": {
      "ratio": "Fewer than five Turkish employees on SGK per foreign worker: the 1:5 ratio applies to the standard permit — we check how it applies to your workplace before anything is filed, and some sectors are exempt."
    },
    "prefill": {
      "intro": "I did the eligibility check on your site. My answers:",
      "result": "Result: {title}"
    }
  },
  "sample": {
    "label": "Illustrative sample of a Turkish work permit card with fictional details",
    "foreignerId": "99•• ••• ••44",
    "validity": "15.08.2026 — 14.08.2027"
  },
  "documents": {
    "count": "{n, plural, one {# document} other {# docs}}"
  },
  "faq": {
    "exemptionAnswer": "e-Muafiyet is the Ministry's online work permit exemption system (emuafiyet.csgb.gov.tr). Foreigners whose work fits an Article 48 category — machinery installation and training, cross-border services, seasonal agriculture, scientific or sporting activities and others — can work without a full permit for a limited period, typically up to 3 months. The foreigner applies within 30 days of entering Türkiye; no employer criteria apply. If the work will run past the exemption period, a full work permit is needed from the start.",
    "emailSubject": "Work permit question"
  },
  "whatsapp": {
    "question": "I have a work permit question.",
    "permitOnly": "I have my own worker — can you handle the work permit?",
    "permitType": "which work permit type applies to my case?",
    "exemption": "does my case qualify for a work permit exemption?",
    "quote": "what would a work permit cost for my case?",
    "renewal": "I need help renewing a work permit."
  }
}
```

`src/messages/tr.json` — the same shape (the `"…"` line above is not a key — edit the existing `seo` object in place):

```json
"seo": {
  "…": "(existing members unchanged)",
  "wp": {
    "title": "Yabancı işçiler için Türkiye çalışma izni (2026) — kurallar, e-Muafiyet ve süreç | JobsAdmire",
    "description": "6735 sayılı Kanun kapsamında çalışma izni nasıl alınır: standart izin ile e-Muafiyet istisnası, 1:5 oranı ve diğer işveren kriterleri, konsolosluk ve Bakanlık aşamaları, süreler, maliyetler ve belgeler — yerleştirdiğimiz işçiler için ya da kendi işçiniz için yalnızca izin olarak, JobsAdmire'ın İŞKUR lisansıyla sizin adınıza dosyalanır."
  }
},
"wp": {
  "hero": {
    "updated": "Güncelleme: {month} · İzin ekibimiz tarafından incelendi"
  },
  "wizard": {
    "progress": "{current} / {total}",
    "progressLabel": "Uygunluk kontrolü ilerlemesi",
    "resultLabel": "Sonucunuz",
    "options": {
      "yes": "Evet",
      "no": "Hayır",
      "fivePlus": "5 veya daha fazla",
      "underFive": "5'ten az",
      "abroad": "Yurt dışında"
    },
    "points": {
      "ratio": "Her yabancı işçi için SGK'da beşten az Türk çalışan: standart izinde 1:5 oranı geçerlidir — dosyalamadan önce iş yerinize nasıl uygulandığını kontrol ederiz; bazı sektörler muaftır."
    },
    "prefill": {
      "intro": "sitenizdeki uygunluk kontrolünü yaptım. Cevaplarım:",
      "result": "Sonuç: {title}"
    }
  },
  "sample": {
    "label": "Kurgusal bilgilerle hazırlanmış temsili Türkiye çalışma izni kartı",
    "foreignerId": "99•• ••• ••44",
    "validity": "15.08.2026 — 14.08.2027"
  },
  "documents": {
    "count": "{n} belge"
  },
  "faq": {
    "exemptionAnswer": "e-Muafiyet, Bakanlığın çevrim içi çalışma izni muafiyet sistemidir (emuafiyet.csgb.gov.tr). İşi 48. madde kategorilerinden birine giren yabancılar — makine montajı ve eğitimi, sınır ötesi hizmetler, mevsimlik tarım, bilimsel veya sportif faaliyetler ve diğerleri — sınırlı bir süre için, genellikle 3 aya kadar, tam izin olmadan çalışabilir. Başvuruyu yabancı, Türkiye'ye girişten sonraki 30 gün içinde kendisi yapar; işveren kriteri aranmaz. İş, muafiyet süresini aşacaksa baştan itibaren tam çalışma izni gerekir.",
    "emailSubject": "Çalışma izni sorusu"
  },
  "whatsapp": {
    "question": "çalışma izniyle ilgili bir sorum var.",
    "permitOnly": "kendi işçim var — çalışma iznini siz yürütebilir misiniz?",
    "permitType": "benim durumumda hangi çalışma izni türü geçerli?",
    "exemption": "benim durumum çalışma izni muafiyetine giriyor mu?",
    "quote": "benim durumumda çalışma izni ne kadar tutar?",
    "renewal": "bir çalışma iznini yenilemek için yardıma ihtiyacım var."
  }
}
```

(The `sys.whatsapp.prefill` opener — "Merhaba JobsAdmire, " / "Hello JobsAdmire, " — is prepended to every `sys.wp.whatsapp.*` tail and to `sys.wp.wizard.prefill.intro` by the page; the TR tails start lower-case for that reason, and the `_content.test.ts` case pins it.)

- [ ] **Step 4: Run tests + npm run verify**

`npx vitest run "src/app/\[locale\]/(site)/work-permit" src/lib/seo/unbuilt.test.ts src/messages/messages.test.ts` → green (the id table exists in both bundles; the set and the filesystem agree; both message files carry the same keys).
`npm run verify` → green. `npx playwright test e2e/pages/work-permit.spec.ts` against `next dev` → both routes 200 with the tagged h1.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit" src/lib/seo/routes.ts e2e/routes.ts e2e/pages/work-permit.spec.ts src/messages/tr.json src/messages/en.json
git commit -m "feat(work-permit): route skeleton, metadata, id tables, gate registration (W20/W21/W23)

/calisma-izni and /en/work-permit render the hero h1 (page-h1, LCP slot) with
sys.seo.wp.* metadata; the page's package-id tables and the full sys.wp.* copy land
with a test that proves every id exists in both bundles. '/work-permit' leaves
UNBUILT_PATHNAMES; both locale paths join GATE_ROUTE_TABLE.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 2 — Eligibility wizard: pure logic + client island (stores nothing, no door, result bucket only, click-time WhatsApp prefill)**

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/work-permit/eligibility.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { PARAM_ENUMS } from '@/analytics/track';
import { evaluate, POINT_ID, VERDICT_TITLE_ID, WIZARD_QUESTIONS, type Answers } from './eligibility';

const base: Answers = { company: 'yes', staff: 'five_plus', location: 'abroad', debts: 'no' };

describe('WIZARD_QUESTIONS', () => {
  it('keeps the design order and option order (the verdict rules key on option keys)', () => {
    expect(WIZARD_QUESTIONS.map((q) => q.key)).toEqual(['company', 'staff', 'location', 'debts']);
    expect(WIZARD_QUESTIONS.map((q) => q.options.map((o) => o.key))).toEqual([
      ['yes', 'no'],
      ['five_plus', 'under_five'],
      ['abroad', 'resident', 'no_permit'],
      ['no', 'yes'],
    ]);
  });
});

describe("evaluate (the design's eligResult, option indices replaced by stable keys)", () => {
  it('eligible: company, 5+ staff, no debts', () => {
    expect(evaluate(base)).toEqual({ verdict: 'eligible', points: ['locationAbroad', 'thresholds'] });
  });
  it('conditional: fewer than five Turkish staff', () => {
    expect(evaluate({ ...base, staff: 'under_five', location: 'resident' })).toEqual({
      verdict: 'conditional',
      points: ['ratio', 'locationResident', 'thresholds'],
    });
  });
  it('ineligible: no company (thresholds point suppressed)', () => {
    expect(evaluate({ ...base, company: 'no', location: 'no_permit' })).toEqual({
      verdict: 'ineligible',
      points: ['company', 'locationNoPermit'],
    });
  });
  it('ineligible: overdue debts win over the staff rule', () => {
    expect(evaluate({ ...base, staff: 'under_five', debts: 'yes' })).toEqual({
      verdict: 'ineligible',
      points: ['ratio', 'locationAbroad', 'debts'],
    });
  });
  it('the ratio point reads sys copy, never wp.066 (W2: no timing claim)', () => {
    expect(POINT_ID.ratio).toBeNull();
    expect(Object.values(POINT_ID)).not.toContain('wp.066');
  });
  it('every verdict is a W67 result bucket', () => {
    expect(Object.keys(VERDICT_TITLE_ID).sort()).toEqual([...PARAM_ENUMS.result].sort());
  });
});
```

`src/app/[locale]/(site)/work-permit/_components/EligibilityWizard.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { EligibilityWizard, type WizardProps } from './EligibilityWizard';

// R35: the real URL pathname; keep every other next/navigation export (next-intl's Link uses them).
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/calisma-izni',
}));

const props: WizardProps = {
  locale: 'tr',
  whatsappNumber: '905011240340',
  hireHref: '/hire-workers',
  questions: [
    { key: 'company', question: 'Company?', options: [{ key: 'yes', label: 'Yes' }, { key: 'no', label: 'No' }] },
    { key: 'staff', question: 'Staff?', options: [{ key: 'five_plus', label: '5+' }, { key: 'under_five', label: '<5' }] },
    {
      key: 'location',
      question: 'Where?',
      options: [
        { key: 'abroad', label: 'Abroad' },
        { key: 'resident', label: 'Resident' },
        { key: 'no_permit', label: 'No permit' },
      ],
    },
    { key: 'debts', question: 'Debts?', options: [{ key: 'no', label: 'No' }, { key: 'yes', label: 'Yes' }] },
  ],
  copy: {
    heading: 'Can you hire?',
    subtitle: 'Free check',
    back: 'Back',
    restart: 'Start again',
    whatsappCta: 'Get an exact answer',
    needWorkers: 'Need workers too?',
    seeHiring: 'See hiring',
    footer: 'nothing is stored',
    titles: { eligible: 'Eligible', conditional: 'Conditional', ineligible: 'Fixable' },
    points: {
      company: 'P company',
      ratio: 'P ratio',
      locationAbroad: 'P abroad',
      locationResident: 'P resident',
      locationNoPermit: 'P nopermit',
      debts: 'P debts',
      thresholds: 'P thresholds',
    },
  },
};

const dataLayer = () => window.dataLayer ?? [];
let open: ReturnType<typeof vi.spyOn<Window, 'open'>>;

beforeEach(() => {
  window.dataLayer = [];
  open = vi.spyOn(window, 'open').mockImplementation(() => null);
});
afterEach(() => vi.restoreAllMocks());

async function answer(labels: string[]) {
  const user = userEvent.setup();
  for (const name of labels) await user.click(screen.getByRole('button', { name }));
  return user;
}

describe('EligibilityWizard', () => {
  it('server-renders the first question with progress 1 / 4 and no Back', () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    expect(screen.getByText('Company?')).toBeInTheDocument();
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('advances, goes back and finishes on the verdict with its points', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    const user = await answer(['Yes']);
    expect(screen.getByText('Staff?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Company?')).toBeInTheDocument();
    await answer(['Yes', '<5', 'Resident', 'No']);
    expect(screen.getByRole('heading', { name: 'Conditional' })).toBeInTheDocument();
    expect(screen.getByText('P ratio')).toBeInTheDocument();
    expect(screen.getByText('P resident')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See hiring' })).toHaveAttribute('href', '/isci-talebi');
  });

  it('W95/W76: the WhatsApp href is the bare chat; the answers are composed only at click time', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer(['Yes', '<5', 'Resident', 'No']);
    const wa = screen.getByRole('link', { name: 'Get an exact answer' });
    expect(wa).toHaveAttribute('href', 'https://wa.me/905011240340');
    expect(document.body.innerHTML).not.toContain('text=');
    const clicked = new MouseEvent('click', { bubbles: true, cancelable: true });
    wa.dispatchEvent(clicked);
    expect(clicked.defaultPrevented).toBe(true); // the bare href never navigates on a click
    expect(open).toHaveBeenCalledTimes(1);
    const [url, target, features] = open.mock.calls[0] as [string, string, string];
    expect(url).toMatch(/^https:\/\/wa\.me\/905011240340\?text=/);
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text.startsWith(`${tr.sys.whatsapp.prefill}${tr.sys.wp.wizard.prefill.intro}`)).toBe(true);
    expect(text).toContain('Company?: Yes');
    expect(text).toContain('Staff?: <5');
    expect(text).toContain('Where?: Resident');
    expect(text).toContain('Debts?: No');
    expect(text).toContain('Sonuç: Conditional');
    expect(target).toBe('_blank');
    expect(features).toBe('noopener');
  });

  it('fires eligibility_check_complete with the result bucket only, then whatsapp_click page_cta (W12/W67)', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer(['No', '5+', 'Abroad', 'Yes']);
    expect(dataLayer()).toEqual([
      { event: 'eligibility_check_complete', page: '/calisma-izni', locale: 'tr', result: 'ineligible' },
    ]);
    screen.getByRole('link', { name: 'Get an exact answer' }).dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    expect(dataLayer()).toEqual([
      { event: 'eligibility_check_complete', page: '/calisma-izni', locale: 'tr', result: 'ineligible' },
      { event: 'whatsapp_click', page: '/calisma-izni', locale: 'tr', placement: 'page_cta' },
    ]);
  });

  it('Start again returns to the first question and clears the answers', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    const user = await answer(['Yes', '5+', 'Abroad', 'No']);
    await user.click(screen.getByRole('button', { name: 'Start again' }));
    expect(screen.getByText('Company?')).toBeInTheDocument();
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
    expect(screen.queryByTestId('wp-eligibility-result')).not.toBeInTheDocument();
  });
});
```

(`window.dataLayer` is typed by the `declare global` in `src/analytics/track.ts`. `See hiring` resolves to `/isci-talebi` because `renderWithIntl` defaults to `tr` and next-intl's `Link` localizes the internal pathname — if the test runner renders the `tr` prefix-less href differently, assert `toHaveAttribute('href', expect.stringMatching(/isci-talebi$/))`.)

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/work-permit"` → `eligibility.test.ts` fails at import (`./eligibility` missing); `EligibilityWizard.test.tsx` fails at import (`./EligibilityWizard` missing).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/eligibility.ts`:

```ts
/** The eligibility wizard's rules — the design's `eligResult()` with option INDICES replaced by
 *  stable option keys (a translated or reordered option list can no longer flip a verdict).
 *  Pure and client-safe: the island runs it in the browser, the test runs it in Node. Nothing
 *  here is ever sent to the door (wp.045: "nothing is stored"). */

export const QUESTION_KEYS = ['company', 'staff', 'location', 'debts'] as const;
export type QuestionKey = (typeof QUESTION_KEYS)[number];

export const WIZARD_QUESTIONS = [
  { key: 'company', qId: 'wp.075', options: [{ key: 'yes', sys: 'yes' }, { key: 'no', id: 'wp.081' }] },
  {
    key: 'staff',
    qId: 'wp.076',
    options: [
      { key: 'five_plus', sys: 'fivePlus' },
      { key: 'under_five', sys: 'underFive' },
    ],
  },
  {
    key: 'location',
    qId: 'wp.077',
    options: [
      { key: 'abroad', sys: 'abroad' },
      { key: 'resident', id: 'wp.078' },
      { key: 'no_permit', id: 'wp.079' },
    ],
  },
  { key: 'debts', qId: 'wp.080', options: [{ key: 'no', sys: 'no' }, { key: 'yes', id: 'wp.082' }] },
] as const satisfies readonly {
  key: QuestionKey;
  qId: string;
  options: readonly ({ key: string; id: string } | { key: string; sys: string })[];
}[];

export type Answers = {
  company: 'yes' | 'no';
  staff: 'five_plus' | 'under_five';
  location: 'abroad' | 'resident' | 'no_permit';
  debts: 'no' | 'yes';
};
export type PartialAnswers = Partial<Answers>;

/** W67: the three buckets `eligibility_check_complete.result` may carry. */
export type Verdict = 'eligible' | 'conditional' | 'ineligible';
export const VERDICT_TITLE_ID: Record<Verdict, string> = {
  eligible: 'wp.074',
  conditional: 'wp.073',
  ineligible: 'wp.072',
};

export const POINT_KEYS = [
  'company',
  'ratio',
  'locationAbroad',
  'locationResident',
  'locationNoPermit',
  'debts',
  'thresholds',
] as const;
export type PointKey = (typeof POINT_KEYS)[number];
/** Package id per point; `ratio` is `null` — W2: the wizard makes no claim about WHEN the 1:5
 *  ratio is checked, so wp.066 ("only checked from the 7th month") is not read here; the copy
 *  is `sys.wp.wizard.points.ratio`. */
export const POINT_ID: Record<PointKey, string | null> = {
  company: 'wp.065',
  ratio: null,
  locationAbroad: 'wp.067',
  locationResident: 'wp.068',
  locationNoPermit: 'wp.069',
  debts: 'wp.070',
  thresholds: 'wp.071',
};

export function evaluate(a: Answers): { verdict: Verdict; points: PointKey[] } {
  const points: PointKey[] = [];
  if (a.company === 'no') points.push('company');
  if (a.staff === 'under_five') points.push('ratio');
  if (a.location === 'abroad') points.push('locationAbroad');
  if (a.location === 'resident') points.push('locationResident');
  if (a.location === 'no_permit') points.push('locationNoPermit');
  if (a.debts === 'yes') points.push('debts');
  if (a.company === 'yes' && a.debts === 'no') points.push('thresholds');
  if (a.company === 'no' || a.debts === 'yes') return { verdict: 'ineligible', points };
  if (a.staff === 'under_five') return { verdict: 'conditional', points };
  return { verdict: 'eligible', points };
}

export function isComplete(a: PartialAnswers): a is Answers {
  return QUESTION_KEYS.every((k) => a[k] !== undefined);
}
```

`src/app/[locale]/(site)/work-permit/_components/EligibilityWizard.tsx`:

```tsx
'use client';
import { useState, type MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import { useContactClick } from '@/analytics/useContactClick';
import { ProgressBar } from '@/design/islands/ProgressBar';
import { buttonClassName } from '@/design/primitives';
import { Link, type Href } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import {
  evaluate,
  isComplete,
  QUESTION_KEYS,
  type Answers,
  type PartialAnswers,
  type PointKey,
  type QuestionKey,
  type Verdict,
} from '../eligibility';

export type WizardOption = { key: string; label: string };
export type WizardQuestion = { key: QuestionKey; question: string; options: WizardOption[] };
export type WizardCopy = {
  heading: string;
  subtitle: string;
  back: string;
  restart: string;
  whatsappCta: string;
  needWorkers: string;
  seeHiring: string;
  footer: string;
  titles: Record<Verdict, string>;
  points: Record<PointKey, string>;
};
export type WizardProps = {
  locale: Locale;
  whatsappNumber: string;
  /** Internal pathname of the hire cross-link — `'/hire-workers'`. */
  hireHref: Href;
  questions: WizardQuestion[];
  copy: WizardCopy;
};

const OPTION =
  'flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xs border-[1.5px] border-border-1 bg-white px-4 py-3 text-left text-body font-bold text-ink transition-colors hover:border-tint-border hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
const GHOST =
  'text-body-sm font-bold text-text-secondary hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** Four single-choice questions, a verdict, a WhatsApp deep link. Every label arrives as a
 *  prop (W9); `sys.wp.wizard.*` is read here for the composed strings (W90: in the picked
 *  client messages). State lives in React only — no storage, no door (wp.045). Side effects:
 *  one `eligibility_check_complete` carrying the verdict bucket (W12/W67), never the answers,
 *  and a `whatsapp_click` (`page_cta`) when the visitor opens the chat. */
export function EligibilityWizard({ locale, whatsappNumber, hireHref, questions, copy }: WizardProps) {
  const sys = useTranslations('sys');
  // R35: the real URL pathname the address bar shows, not next-intl's internal key.
  const pathname = usePathname() ?? '/';
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [done, setDone] = useState(false);
  const total = questions.length;
  const current = questions[step];

  const pick = (optionKey: string) => {
    const next = { ...answers, [current.key]: optionKey } as PartialAnswers;
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
      return;
    }
    if (!isComplete(next)) return;
    setDone(true);
    track('eligibility_check_complete', { page: pathname, locale, result: evaluate(next).verdict });
  };
  const restart = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  const pct = done ? 100 : Math.round((step / total) * 100);
  const progressText = sys('wp.wizard.progress', { current: done ? total : step + 1, total });

  return (
    <div
      id="eligibility"
      data-testid="wp-eligibility"
      className="scroll-mt-24 overflow-hidden rounded-lg border border-tint-border bg-white text-ink shadow-hero-form"
    >
      <div className="bg-gradient-to-br from-blue to-blue-safe px-6 pt-6 pb-5 text-white sm:px-8">
        <div className="mb-1 flex items-center justify-between gap-3">
          {/* h2, not the design's h3: the card follows the h1 directly (D20 outline). */}
          <h2 className="m-0 text-card-title font-extrabold text-white">{copy.heading}</h2>
          <span className="rounded-pill border border-white/35 bg-white/20 px-3 py-1 text-eyebrow font-extrabold whitespace-nowrap">
            {progressText}
          </span>
        </div>
        <p className="m-0 mb-3 text-body-sm text-white/85">{copy.subtitle}</p>
        <ProgressBar
          value={pct}
          max={100}
          label={sys('wp.wizard.progressLabel')}
          valueText={progressText}
          tone="blue"
        />
      </div>
      <div className="px-6 py-7 sm:px-8">
        {done && isComplete(answers) ? (
          <Result
            answers={answers}
            questions={questions}
            copy={copy}
            whatsappNumber={whatsappNumber}
            hireHref={hireHref}
            restart={restart}
          />
        ) : (
          <div role="group" aria-labelledby="wp-elig-q">
            {/* polite: the next question is announced after a pick (the buttons re-render). */}
            <p id="wp-elig-q" aria-live="polite" className="m-0 mb-4 text-body-lg font-extrabold leading-snug">
              {current.question}
            </p>
            <div className="flex flex-col gap-2.5">
              {current.options.map((o) => (
                <button key={`${current.key}-${o.key}`} type="button" className={OPTION} onClick={() => pick(o.key)}>
                  <span>{o.label}</span>
                  <span aria-hidden="true" className="text-blue-safe">
                    {answers[current.key] === o.key ? '✓' : ''}
                  </span>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button type="button" className={`mt-4 ${GHOST}`} onClick={() => setStep(step - 1)}>
                {copy.back}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-border-3 bg-pale-2 px-6 py-3 text-body-sm text-text-tertiary sm:px-8">
        <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
        <span>{copy.footer}</span>
      </div>
    </div>
  );
}

function Result({
  answers,
  questions,
  copy,
  whatsappNumber,
  hireHref,
  restart,
}: {
  answers: Answers;
  questions: WizardQuestion[];
  copy: WizardCopy;
  whatsappNumber: string;
  hireHref: Href;
  restart: () => void;
}) {
  const sys = useTranslations('sys');
  const fire = useContactClick('page_cta');
  const { verdict, points } = evaluate(answers);
  const title = copy.titles[verdict];
  // W95/W76 (D13): the answers never sit in a DOM href — GA4 enhanced-measurement outbound
  // clicks and a GTM Click URL trigger both read the href. The anchor points at the bare chat;
  // the prefilled URL is composed on click and opened directly (a modifier/middle click still
  // reaches the bare chat). ContactLink is not used here: it owns onClick.
  const openWhatsApp = (e: MouseEvent<HTMLAnchorElement>) => {
    fire('whatsapp');
    e.preventDefault();
    const lines = QUESTION_KEYS.map((k) => {
      const q = questions.find((x) => x.key === k);
      const o = q?.options.find((x) => x.key === answers[k]);
      return `${q?.question ?? k}: ${o?.label ?? answers[k]}`;
    });
    const text = [
      `${sys('whatsapp.prefill')}${sys('wp.wizard.prefill.intro')}`,
      ...lines,
      sys('wp.wizard.prefill.result', { title }),
    ].join('\n');
    window.open(waLink(whatsappNumber, text), '_blank', 'noopener');
  };
  const tone = verdict === 'eligible' ? 'bg-success' : 'bg-warning';
  return (
    <div role="region" aria-label={sys('wp.wizard.resultLabel')} data-testid="wp-eligibility-result">
      <div className="mb-3 flex items-center gap-2.5">
        <span aria-hidden="true" className={`flex h-8 w-8 items-center justify-center rounded-pill text-white ${tone}`}>
          {verdict === 'eligible' ? '✓' : '!'}
        </span>
        <h3 className="m-0 text-body-lg font-extrabold">{title}</h3>
      </div>
      <ul className="m-0 mb-5 flex list-none flex-col gap-2.5 p-0">
        {points.map((p) => (
          <li key={p} className="flex gap-2.5 text-body-sm text-text-secondary">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-pill bg-blue" />
            <span>{copy.points[p]}</span>
          </li>
        ))}
      </ul>
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={openWhatsApp}
        className={buttonClassName('primary', 'lg', 'w-full')}
      >
        {copy.whatsappCta}
      </a>
      <p className="m-0 mt-3 text-center text-body-sm text-text-tertiary">
        {copy.needWorkers}{' '}
        <Link href={hireHref} className="font-extrabold text-blue-safe no-underline">
          {copy.seeHiring}
        </Link>
      </p>
      <button type="button" className={`mt-3 w-full ${GHOST}`} onClick={restart}>
        {copy.restart}
      </button>
    </div>
  );
}
```

Notes for the executor: `useContactClick('page_cta')` (WP2a Task 3, W32) fires `whatsapp_click` with `{ page, locale, placement: 'page_cta' }` — do not add a second `track()` call. `ProgressBar` (Task 6) has no directive and no hooks, so it renders inside this island; import it from its file, not the islands barrel. Option buttons are keyed `${question}-${option}` so React remounts them per question (no stale ✓ from a same-key option on the next question).

- [ ] **Step 4: Run tests + npm run verify**

`npx vitest run "src/app/\[locale\]/(site)/work-permit"` → green (verdict table; render/advance/back/restart; the bare href + click-time prefill; the pushed events are `{event, page, locale, result}` then `{event, page, locale, placement}` only). `npm run verify` green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit/eligibility.ts" "src/app/[locale]/(site)/work-permit/eligibility.test.ts" "src/app/[locale]/(site)/work-permit/_components/EligibilityWizard.tsx" "src/app/[locale]/(site)/work-permit/_components/EligibilityWizard.test.tsx"
git commit -m "feat(work-permit): eligibility wizard — stable option keys, result bucket only, click-time WhatsApp prefill (W2/W12/W67/W95)

Pure evaluate() replaces the design's index-based eligResult; the ratio point reads
sys copy with no timing claim (W2). The island stores nothing and sends nothing to the
door; eligibility_check_complete carries page/locale/result and never the answers. The
result link's href is the bare wa.me chat — the answers ride only in the URL opened
on click (W95/W76), and the click fires whatsapp_click page_cta.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 3 — Hero (wizard, D17 badge), chips, jump nav, audience router, routes comparison, sample card**

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/work-permit/fragments.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { needsGap } from './fragments';

describe('needsGap (package fragment spacing)', () => {
  it('inserts a space between two words', () => {
    expect(needsGap('The employer', 'on the system')).toBe(true);
  });
  it('inserts none before leading punctuation', () => {
    expect(needsGap('The employer', ', on the system')).toBe(false);
    expect(needsGap('fee', '. If the worker')).toBe(false);
    expect(needsGap('fee', ';')).toBe(false);
  });
  it('inserts none after an opening bracket or at the ends', () => {
    expect(needsGap('(', 'vergi levhası)')).toBe(false);
    expect(needsGap('', 'x')).toBe(false);
    expect(needsGap('x', '')).toBe(false);
  });
});
```

`src/app/[locale]/(site)/work-permit/badge.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { RATE } from '@/lib/calculator/__tests__/fixtures';
import { updatedMonth } from './badge';

// RATE: updatedAt '2026-01-15', reviewDueAt '2026-12-20' (Task 1's emitted row).
describe('updatedMonth (the D17 dated badge)', () => {
  it('names the month of rateConfig.updatedAt while the review is not due', () => {
    const now = new Date('2026-09-24T12:00:00Z');
    expect(updatedMonth(RATE, 'tr', now)).toBe('Ocak 2026');
    expect(updatedMonth(RATE, 'en', now)).toBe('January 2026');
  });
  it('hides the badge (null) from reviewDueAt on — never a stale date', () => {
    expect(updatedMonth(RATE, 'tr', new Date('2026-12-20T00:00:00Z'))).toBeNull();
    expect(updatedMonth(RATE, 'en', new Date('2027-02-01T00:00:00Z'))).toBeNull();
  });
});
```

Extend `e2e/pages/work-permit.spec.ts` (inside the `for` loop, after the h1 test):

```ts
  test(`${r.path}: hero card, dated badge, jump nav, router and routes comparison are present`, async ({ page }) => {
    await page.goto(r.path);
    await expect(page.getByTestId('wp-eligibility')).toBeVisible();
    // D17: the badge reads rateConfig (updated January 2026, review due 2026-12-20).
    await expect(page.getByTestId('wp-updated')).toContainText(r.lang === 'tr' ? 'Ocak 2026' : 'January 2026');
    await expect(page.getByTestId('wp-jump').locator('a')).toHaveCount(8);
    await expect(page.getByTestId('wp-router').locator('a')).toHaveCount(4);
    await expect(page.getByTestId('wp-routes')).toBeVisible();
    await expect(page.getByTestId('wp-sample-card')).toHaveCount(1);
    // D26: the hero photo slot is a named placeholder; the LCP is the h1, never the slot.
    await expect(page.locator('[data-placeholder="wp-hero"]')).toHaveCount(1);
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    // W109: the trail is this page's own labels — Home → Work Permits.
    const crumbs = page.getByRole('navigation', { name: r.lang === 'tr' ? 'Sayfa yolu' : 'Breadcrumb' });
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText(r.lang === 'tr' ? 'Çalışma İzinleri' : 'Work Permits');
  });
```

(The `wp-updated` assertion is date-bound: from 2026-12-20 the badge disappears by design — rewrite the case to `toHaveCount(0)` in the same commit that ships the next `rateConfig` row, or when the review date passes.)

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/work-permit/fragments" "src/app/\[locale\]/(site)/work-permit/badge"` → both fail at import. The e2e case fails on `wp-eligibility` (not rendered by the skeleton).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/fragments.ts`:

```ts
/** The package splits some sentences into fragments (a strong lead + the rest, a link in the
 *  middle). W23 lets a page recompose exactly those. EN fragments carry their own leading
 *  punctuation (", on the Ministry's…"), so the join adds a space only between two words. */
export function needsGap(prev: string, next: string): boolean {
  if (!prev || !next) return false;
  if (/^[,.;:!?)\]]/.test(next)) return false;
  if (/[(\[]$/.test(prev)) return false;
  return true;
}
```

`src/app/[locale]/(site)/work-permit/badge.ts`:

```ts
import type { RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { isReviewDue } from '@/lib/calculator';
import { formatMonth } from '@/lib/format/date';

/** D17: the hero's "Updated {month}" badge renders from `rateConfig.updatedAt` and disappears
 *  once the review is due — wp.022's hard-typed "July 2026" is never read. Server-side only
 *  (formatMonth reads the message files). */
export function updatedMonth(rateConfig: RateConfig, locale: Locale, now: Date = new Date()): string | null {
  return isReviewDue(rateConfig, now) ? null : formatMonth(rateConfig.updatedAt, locale);
}
```

`src/app/[locale]/(site)/work-permit/_components/Frag.tsx`:

```tsx
import { Fragment as ReactFragment } from 'react';
import type { Fragment } from '../_content';
import { needsGap } from '../fragments';

/** Renders a fragment list resolved through `tf`, `strong` fragments in bold ink. */
export function Frag({
  parts,
  tf,
  strongClass = 'font-extrabold text-ink',
}: {
  parts: readonly Fragment[];
  tf: (id: string) => string;
  strongClass?: string;
}) {
  const texts = parts.map((p) => tf(p.id));
  return (
    <>
      {parts.map((p, i) => (
        <ReactFragment key={`${p.id}-${i}`}>
          {i > 0 && needsGap(texts[i - 1], texts[i]) ? ' ' : ''}
          {p.strong ? <strong className={strongClass}>{texts[i]}</strong> : texts[i]}
        </ReactFragment>
      ))}
    </>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/icons.tsx` — decorative glyphs lifted from the design (all `aria-hidden`, stroke `currentColor`):

```tsx
import type { JSX } from 'react';
import type { ExemptionIcon } from '../_content';

type IconProps = { size?: number; className?: string };
const base = ({ size = 16, className }: IconProps) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  'aria-hidden': true as const,
  focusable: false,
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});
export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
export const DocIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);
export const UsersIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
export const BuildingIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
  </svg>
);
export const UserCheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M20 8l2 2-4.5 4.5L15 12" />
  </svg>
);
export const CalculatorIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 6h8" />
    <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h4M8 18h8" />
  </svg>
);
export const WarningIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const WrenchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const GlobeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2v8" />
    <path d="M4.9 10.6c-.6 5 2.6 9.4 7.1 9.4s7.7-4.4 7.1-9.4" />
    <path d="M2 12h20" />
  </svg>
);
const AwardIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.5 13.9L17 22l-5-3-5 3 1.5-8.1" />
  </svg>
);
const PackageIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M16.5 9.4L7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96L12 12.01l8.73-5.05" />
    <path d="M12 22.08V12" />
  </svg>
);
export const EXEMPTION_ICON: Record<ExemptionIcon, (p: IconProps) => JSX.Element> = {
  wrench: WrenchIcon,
  globe: GlobeIcon,
  leaf: LeafIcon,
  award: AwardIcon,
  package: PackageIcon,
};
```

`src/app/[locale]/(site)/work-permit/_components/Hero.tsx` (server component):

```tsx
import { getTranslations } from 'next-intl/server';
import { getRateConfig } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { Breadcrumbs, ContactCta, ImageSlot } from '@/design/blocks';
import { Button } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_HERO_BENEFITS, WP_HERO_CHIPS } from '../_content';
import { updatedMonth } from '../badge';
import { EligibilityWizard, type WizardProps } from './EligibilityWizard';
import { CheckIcon, ClockIcon, DocIcon, UsersIcon } from './icons';

const CHIP_ICON = [ClockIcon, DocIcon, UsersIcon] as const;

export async function Hero({ bundle, locale, wizard }: { bundle: Bundle; locale: Locale; wizard: WizardProps }) {
  const tf = makeTf(bundle, locale);
  const sys = await getTranslations('sys');
  const month = updatedMonth(getRateConfig(bundle), locale);
  const wa = bundle.settings.whatsappNumber;
  return (
    <section className="relative overflow-hidden bg-navy py-16 text-white">
      {/* D26/W55: the hero photo has no asset at launch (§10 row 4) — a named placeholder behind
          the gradients, decorative, never the LCP. */}
      <div aria-hidden="true" className="absolute inset-0">
        <ImageSlot slot="wp-hero" alt="" width={1600} height={900} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70" />
      </div>
      <div className="container-site relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-body-sm text-white/55">
              {/* W109: this page's own package labels — wp.021 "Home", wp.011 "Work Permits". */}
              <Breadcrumbs
                locale={locale}
                tone="dark"
                items={[
                  { name: tf('wp.021'), href: '/' },
                  { name: tf('wp.011'), href: '/work-permit' },
                ]}
              />
              {/* D17: from rateConfig, hidden once the review is due (never wp.022's typed date). */}
              {month && (
                <span
                  data-testid="wp-updated"
                  className="inline-flex items-center gap-1.5 rounded-pill border border-white/20 bg-white/10 px-3 py-1 text-eyebrow font-extrabold text-white/80"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill bg-success" />
                  {sys('wp.hero.updated', { month })}
                </span>
              )}
            </div>
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="mb-4 text-h1 leading-[1.03] tracking-[-0.03em] text-white"
            >
              {tf('wp.023')} <span className="text-sky">{tf('wp.024')}</span>
            </h1>
            <p className="mb-5 max-w-[520px] text-body-lg text-white/75">
              {/* W10: both variants in the DOM, switched by CSS. */}
              <span className="hidden md:inline">{tf('wp.025')}</span>
              <span className="md:hidden">
                {tf('wp.026')} <strong className="font-extrabold text-white">{tf('wp.027')}</strong>.
              </span>
            </p>
            <ul className="m-0 mb-5 flex max-w-[540px] list-none flex-col gap-2 p-0">
              {WP_HERO_BENEFITS.map(([lead, rest]) => (
                <li key={lead} className="flex items-start gap-2.5 text-body text-white/75">
                  <CheckIcon size={15} className="mt-1 flex-none text-[#4ade80]" />
                  <span>
                    <strong className="font-extrabold text-white">{tf(lead)}</strong> {tf(rest)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mb-5 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href="#eligibility">
                {tf('wp.034')}
              </Button>
              <ContactCta
                placement="page_cta"
                variant="inverse"
                size="lg"
                external
                href={waLink(wa, `${sys('whatsapp.prefill')}${sys('wp.whatsapp.question')}`)}
              >
                {tf('wp.035')}
              </ContactCta>
            </div>
            <p className="m-0 max-w-[480px] text-body-sm text-muted">
              <span className="hidden md:inline">{tf('wp.036')}</span>
              <span className="md:hidden">{tf('wp.037')}</span>
            </p>
          </div>
          <EligibilityWizard {...wizard} />
        </div>
        <ul className="m-0 mt-9 grid list-none gap-3.5 p-0 sm:grid-cols-3">
          {WP_HERO_CHIPS.map(([strong, rest], i) => {
            const Icon = CHIP_ICON[i];
            return (
              <li
                key={strong}
                className="flex items-center gap-3 rounded-sm border border-tint-border bg-white/75 px-4 py-3 text-body-sm text-text-secondary"
              >
                <Icon size={18} className="flex-none text-blue-safe" />
                <span>
                  <strong className="font-extrabold text-ink">{tf(strong)}</strong> {tf(rest)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

(`Section` is not used for the hero because the placeholder + gradients need `relative overflow-hidden` on the section itself; the class set equals `Section tone="dark"`'s `bg-navy text-white py-16`. The WhatsApp prefill here is the static `sys.wp.whatsapp.question` tail — no visitor data, so it may sit in the href.)

`src/app/[locale]/(site)/work-permit/_components/JumpNav.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_JUMP } from '../_content';

/** "On this page" — in-page anchors only; sticky under the header from lg (the WP1 header
 *  renders 69 px tall: py-3 + a 44 px button + the border). */
export function JumpNav({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  return (
    <nav
      aria-label={tf('wp.056')}
      data-testid="wp-jump"
      className="z-30 border-b border-border-4 bg-white/95 backdrop-blur lg:sticky lg:top-[69px]"
    >
      <div className="container-site flex items-center gap-1.5 overflow-x-auto py-2.5">
        <span className="mr-2 whitespace-nowrap text-eyebrow font-extrabold uppercase tracking-[0.8px] text-muted">
          {tf('wp.056')}
        </span>
        {WP_JUMP.map((j) => (
          <a
            key={j.hash}
            href={j.hash}
            className="whitespace-nowrap rounded-pill px-3.5 py-2 text-body-sm font-bold text-text-secondary no-underline hover:bg-tint hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
          >
            {tf(j.id)}
          </a>
        ))}
      </div>
    </nav>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/AudienceRouter.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { ContactLink } from '@/analytics/ContactLink';
import { makeTf } from '@/content/pure';
import { Section } from '@/design/primitives';
import { Link, type Href } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_ROUTER, type RouterCard } from '../_content';
import { BuildingIcon, CalculatorIcon, UserCheckIcon, UsersIcon } from './icons';

const CARD =
  'block rounded-base border border-border-2 bg-white p-5 no-underline transition-shadow hover:shadow-card-hover hover:border-tint-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
const ICON: Record<RouterCard['key'], { Icon: typeof BuildingIcon; wrap: string; cta: string }> = {
  hire: { Icon: BuildingIcon, wrap: 'bg-tint text-blue-safe', cta: 'text-blue-safe' },
  permitOnly: { Icon: UserCheckIcon, wrap: 'bg-success-surface text-success-text', cta: 'text-success-text' },
  partner: { Icon: UsersIcon, wrap: 'bg-[#edf1f9] text-navy', cta: 'text-navy' },
  calculator: { Icon: CalculatorIcon, wrap: 'bg-warning-surface text-warning-text', cta: 'text-warning-text' },
};
const HREF: Record<Exclude<RouterCard['key'], 'permitOnly'>, Href> = {
  hire: '/hire-workers',
  partner: '/partner-with-us',
  calculator: '/hiring-cost-calculator',
};

export async function AudienceRouter({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const sys = await getTranslations('sys');
  // Static prefill (sys copy, no visitor data) — allowed in the href (W95 scope).
  const wa = waLink(bundle.settings.whatsappNumber, `${sys('whatsapp.prefill')}${sys('wp.whatsapp.permitOnly')}`);
  return (
    <Section tone="light" className="border-b border-border-3 pt-14 pb-14">
      <div className="container-site">
        <h2 className="mb-2 text-center text-h2 tracking-[-0.02em]">{tf('wp.083')}</h2>
        <p className="mb-7 text-center text-body text-text-tertiary">{tf('wp.084')}</p>
        <div data-testid="wp-router" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WP_ROUTER.map((c) => {
            const { Icon, wrap, cta } = ICON[c.key];
            const body = (
              <>
                <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xs ${wrap}`}>
                  <Icon size={18} />
                </span>
                <span className="mb-1 block text-body font-extrabold text-ink">{tf(c.titleId)}</span>
                <span className="block text-body-sm text-text-tertiary">{tf(c.bodyId)}</span>
                <span className={`mt-2.5 block text-body-sm font-extrabold ${cta}`}>{tf(c.ctaId)}</span>
              </>
            );
            return c.key === 'permitOnly' ? (
              <ContactLink
                key={c.key}
                href={wa}
                placement="page_cta"
                target="_blank"
                rel="noopener noreferrer"
                className={CARD}
              >
                {body}
              </ContactLink>
            ) : (
              <Link key={c.key} href={HREF[c.key]} className={CARD}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
```

(`ContactLink` is a client component; rendering it from a server component with plain-string props is how the chrome uses it. `pt-14 pb-14` narrows `Section`'s `py-16` to the design's tighter router band — Tailwind v4 emits `pt-`/`pb-` after `py-`, the reconcile-accepted override, no `!important`.)

`src/app/[locale]/(site)/work-permit/_components/RoutesComparison.tsx` — the D20 delta: one grid on `md+`, stacked cards below (nothing hidden, no tabs):

```tsx
import { makeTf } from '@/content/pure';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_COMPARE } from '../_content';
import { Frag } from './Frag';
import { CheckIcon, WarningIcon } from './icons';
import { SampleCard } from './SampleCard';

const HEAD_L = 'bg-gradient-to-br from-blue to-blue-safe p-6 text-white';
const HEAD_R = 'bg-gradient-to-br from-[#253063] to-[#16204a] p-6 text-white md:text-right';
const LABEL =
  'flex items-center justify-center bg-pale-2 px-2.5 py-2 text-center text-eyebrow font-extrabold uppercase tracking-[0.8px] text-muted md:border-x md:border-border-3';
const CELL = 'px-5 py-4 text-body-sm leading-relaxed text-text-secondary';
const PILL =
  'mt-2 inline-block rounded-pill border border-white/35 bg-white/20 px-2.5 py-0.5 text-eyebrow font-extrabold uppercase';

export function RoutesComparison({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="light" id="routes" className="scroll-mt-24">
      <div className="container-site" data-testid="wp-routes">
        <h2 className="mb-3 text-center text-h2 tracking-[-0.03em]">{tf('wp.097')}</h2>
        <p className="mx-auto mb-10 max-w-[620px] text-center text-body-lg text-text-tertiary">{tf('wp.098')}</p>
        <div className="mx-auto max-w-[1080px] overflow-hidden rounded-xl border border-border-1 bg-white shadow-card-hover">
          <div className="grid md:grid-cols-[1fr_150px_1fr]">
            <div className={HEAD_L}>
              <p className="m-0 mb-1 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-white/80">{tf('wp.101')}</p>
              <p className="m-0 text-card-title font-extrabold">{tf('wp.102')}</p>
              <span className={PILL}>{tf('wp.103')}</span>
            </div>
            <div className="hidden items-center justify-center bg-ink md:flex">
              <span
                aria-hidden="true"
                className="flex h-13 w-13 items-center justify-center rounded-pill bg-white text-body-sm font-extrabold text-ink ring-[6px] ring-white/15"
              >
                {tf('wp.104')}
              </span>
            </div>
            <div className={HEAD_R}>
              <p className="m-0 mb-1 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-white/80">{tf('wp.105')}</p>
              <p className="m-0 text-card-title font-extrabold">{tf('wp.106')}</p>
              <span className={PILL}>{tf('wp.107')}</span>
            </div>
          </div>
          {/* One row per criterion. On md+ the label sits between the two columns; below md
              the label leads and each side is captioned with wp.099 / wp.100 — the design's
              CSS ::before labels as real, translated text (D20). */}
          {WP_COMPARE.map((row) => (
            <div key={row.labelId} className="grid border-t border-border-3 md:grid-cols-[1fr_150px_1fr]">
              <div className={`${LABEL} md:order-2`}>{tf(row.labelId)}</div>
              <div className={`${CELL} md:order-1`}>
                <span className="mb-1 block text-eyebrow font-extrabold uppercase text-blue-safe md:hidden">{tf('wp.099')}</span>
                <Frag parts={row.permit} tf={tf} />
              </div>
              <div className={`${CELL} md:order-3 md:text-right`}>
                <span className="mb-1 block text-eyebrow font-extrabold uppercase text-navy md:hidden">{tf('wp.100')}</span>
                <Frag parts={row.exempt} tf={tf} />
              </div>
            </div>
          ))}
          <div className="grid border-t border-border-3 md:grid-cols-2">
            <p className="m-0 flex items-center gap-2.5 bg-[#f4fafd] px-6 py-4 text-body-sm font-bold text-blue-safe">
              <CheckIcon size={15} className="flex-none" />
              {tf('wp.135')}
            </p>
            <p className="m-0 flex items-center gap-2.5 bg-[#f0f3fa] px-6 py-4 text-body-sm font-bold text-navy md:justify-end md:border-l md:border-border-3 md:text-right">
              {tf('wp.136')}
              <CheckIcon size={15} className="flex-none" />
            </p>
          </div>
        </div>
        <p className="mx-auto mt-6 flex max-w-[1080px] items-start gap-3 rounded-sm border border-warning-border bg-warning-surface px-5 py-4 text-body-sm leading-relaxed text-warning-text">
          <WarningIcon size={18} className="mt-0.5 flex-none" />
          <span>
            <strong className="font-extrabold text-ink">{tf('wp.137')}</strong> {tf('wp.138')}
          </span>
        </p>
        <SampleCard bundle={bundle} locale={locale} />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/SampleCard.tsx` — the mock ÇALIŞMA İZNİ card (README: deliberate reproduction; fictional data; counsel sign-off item):

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/pure';
import { Eyebrow } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CheckIcon } from './icons';

const FIELD = 'text-[8px] font-extrabold uppercase tracking-[0.5px] text-[#7a91a8]';
const VALUE = 'text-[12px] font-extrabold text-ink';
const BARCODE = [2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2];

export async function SampleCard({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const sys = await getTranslations('sys');
  return (
    <div className="mx-auto mt-14 grid max-w-[1080px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <Eyebrow>{tf('wp.139')}</Eyebrow>
        <h3 className="mt-3 mb-3 text-h2-process tracking-[-0.02em]">{tf('wp.140')}</h3>
        <p className="mb-4 text-body text-text-secondary">{tf('wp.141')}</p>
        <p className="m-0 flex items-start gap-2.5 text-body-sm text-text-secondary">
          <CheckIcon size={16} className="mt-0.5 flex-none text-success" />
          <span>{tf('wp.142')}</span>
        </p>
      </div>
      <div>
        <figure className="m-0 rounded-lg border border-tint-border bg-white p-6 shadow-hero-form" data-testid="wp-sample-card">
          {/* role=img + label: the card is one picture to assistive tech; its fields are not
              a data table (D20). */}
          <div
            role="img"
            aria-label={sys('wp.sample.label')}
            className="relative flex flex-col overflow-hidden rounded-sm border border-[#b9cfe3] bg-gradient-to-br from-[#eef4fa] via-[#dce9f5] to-[#cfe0f0] px-5 py-4"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] text-[44px] font-extrabold tracking-[6px] whitespace-nowrap text-[rgba(22,60,90,0.09)]"
            >
              {tf('wp.143')}
            </span>
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true" focusable="false">
                  <circle cx="15" cy="15" r="14" fill="#E30A17" />
                  <circle cx="13" cy="15" r="6.5" fill="#fff" />
                  <circle cx="14.7" cy="15" r="5.3" fill="#E30A17" />
                  <path d="M23.2 15l-4.4 1.4 2.7-3.7v4.6l-2.7-3.7z" fill="#fff" />
                </svg>
                <div className="leading-tight">
                  <div className="text-[10px] font-extrabold tracking-[0.6px] text-ink">{tf('wp.144')}</div>
                  <div className="text-[8.5px] font-bold tracking-[0.4px] text-text-secondary">{tf('wp.145')}</div>
                </div>
              </div>
              <div className="rounded-[6px] border-[1.5px] border-blue-safe px-2.5 py-1 text-[12px] font-extrabold tracking-[1.5px] whitespace-nowrap text-blue-safe">
                {tf('wp.146')}
              </div>
            </div>
            <div className="relative mt-3 grid grid-cols-[76px_1fr_1fr] gap-3">
              <div className="aspect-[0.8] self-start overflow-hidden rounded-[8px] border border-[#b9cfe3] bg-[#dfe9f2]">
                <svg viewBox="0 0 80 100" className="block h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
                  <rect width="80" height="100" fill="#dfe9f2" />
                  <path d="M12 100c0-16 12-25 28-25s28 9 28 25z" fill="#3c4a5d" />
                  <path d="M33 72h14v10c0 4-3.5 6-7 6s-7-2-7-6z" fill="#c99e7c" />
                  <ellipse cx="40" cy="46" rx="17" ry="21" fill="#d9af8b" />
                  <path d="M23 42c-1-14 8-22 17-22s18 8 17 22c-2-9-7-12-17-12s-15 3-17 12z" fill="#2e2620" />
                  <ellipse cx="33" cy="47" rx="2" ry="2.4" fill="#2e2620" />
                  <ellipse cx="47" cy="47" rx="2" ry="2.4" fill="#2e2620" />
                  <path d="M34.5 61c3 2.2 8 2.2 11 0" stroke="#a06a48" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  <path d="M30 84h20v16H30z" fill="#fff" />
                  <path d="M36 84l4 5 4-5 3 3-7 8-7-8z" fill="#1f4d7a" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <div className={FIELD}>{tf('wp.147')}</div>
                  <div className={VALUE}>{tf('wp.148')}</div>
                </div>
                <div>
                  <div className={FIELD}>{tf('wp.149')}</div>
                  <div className={VALUE}>{tf('wp.150')}</div>
                </div>
                <div>
                  <div className={FIELD}>{tf('wp.151')}</div>
                  <div className={VALUE}>{tf('wp.152')}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <div className={FIELD}>{tf('wp.153')}</div>
                  <div className={`${VALUE} tracking-[0.5px]`}>{sys('wp.sample.foreignerId')}</div>
                </div>
                <div>
                  <div className={FIELD}>{tf('wp.154')}</div>
                  <div className={VALUE}>{tf('wp.155')}</div>
                </div>
                <div>
                  <div className={FIELD}>{tf('wp.156')}</div>
                  <div className={VALUE}>{sys('wp.sample.validity')}</div>
                </div>
              </div>
            </div>
            <div className="relative mt-2.5 flex items-end justify-between gap-3">
              <div className="text-[9.5px] font-bold text-text-secondary">
                {tf('wp.157')} <span className="font-extrabold text-ink">{tf('wp.158')}</span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div aria-hidden="true" className="flex gap-[1.5px]">
                  {BARCODE.map((w, i) => (
                    <span key={i} className="h-3.5 bg-ink" style={{ width: w }} />
                  ))}
                </div>
                <span className="text-[7px] font-bold tracking-[1px] text-[#7a91a8]">{tf('wp.159')}</span>
              </div>
            </div>
          </div>
          <figcaption className="mt-3 text-center text-body-sm text-muted">{tf('wp.160')}</figcaption>
        </figure>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/work-permit/page.tsx` — the Cycle 3 file (imports grow; the skeleton's `Section` import goes):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { AudienceRouter } from './_components/AudienceRouter';
import type { WizardProps } from './_components/EligibilityWizard';
import { Hero } from './_components/Hero';
import { JumpNav } from './_components/JumpNav';
import { RoutesComparison } from './_components/RoutesComparison';
import { POINT_ID, POINT_KEYS, VERDICT_TITLE_ID, WIZARD_QUESTIONS } from './eligibility';

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
  // The package carries no <title>/description for this page, so the bundle's `pages.wp`
  // record has '' ids and W38 routes to these (W23).
  return buildMetadata({
    locale,
    href: '/work-permit',
    bundle,
    pageKey: 'wp',
    fallbackTitle: sys('seo.wp.title'),
    fallbackDescription: sys('seo.wp.description'),
  });
}

/** Resolves every wizard label on the server (W9: labels are props) — package ids through
 *  `tf`, the id-less option words and the W2 ratio point through `sys.wp.wizard.*`. */
function buildWizardProps(
  tf: (id: string) => string,
  sys: (key: string) => string,
): Omit<WizardProps, 'locale' | 'whatsappNumber'> {
  const points = Object.fromEntries(
    POINT_KEYS.map((k) => {
      const id = POINT_ID[k];
      return [k, id ? tf(id) : sys('wp.wizard.points.ratio')];
    }),
  ) as WizardProps['copy']['points'];
  return {
    hireHref: '/hire-workers',
    questions: WIZARD_QUESTIONS.map((q) => ({
      key: q.key,
      question: tf(q.qId),
      options: q.options.map((o) => ({
        key: o.key,
        label: 'id' in o ? tf(o.id) : sys(`wp.wizard.options.${o.sys}`),
      })),
    })),
    copy: {
      heading: tf('wp.038'),
      subtitle: tf('wp.039'),
      back: tf('wp.040'),
      restart: tf('wp.044'),
      whatsappCta: tf('wp.041'),
      needWorkers: tf('wp.042'),
      seeHiring: tf('wp.043'),
      footer: tf('wp.045'),
      titles: {
        eligible: tf(VERDICT_TITLE_ID.eligible),
        conditional: tf(VERDICT_TITLE_ID.conditional),
        ineligible: tf(VERDICT_TITLE_ID.ineligible),
      },
      points,
    },
  };
}

export default async function WorkPermit({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const tf = makeTf(bundle, locale);
  const wizard: WizardProps = {
    ...buildWizardProps(tf, sys),
    locale,
    whatsappNumber: bundle.settings.whatsappNumber,
  };
  // No <main>: SiteChrome owns it (R31). Section order = the design's.
  return (
    <>
      <Hero bundle={bundle} locale={locale} wizard={wizard} />
      <JumpNav bundle={bundle} locale={locale} />
      <AudienceRouter bundle={bundle} locale={locale} />
      <RoutesComparison bundle={bundle} locale={locale} />
    </>
  );
}
```

(`sys` from `getTranslations` has the call signature `(key, values?) => string`; `src/messages` carries no next-intl type augmentation, so it is assignable to `(key: string) => string`. JumpNav's `#rules`…`#faq` targets land in Cycles 4–5; until then those anchors scroll nowhere, which is harmless.)

- [ ] **Step 4: Run tests + npm run verify**

`npx vitest run "src/app/\[locale\]/(site)/work-permit"` green; `npm run verify` green; `npx playwright test e2e/pages/work-permit.spec.ts` → the new case passes on both projects (the router has 4 anchors; the jump nav 8; exactly one `data-lcp-slot`; the `wp-hero` placeholder is present; the badge reads January 2026).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit" e2e/pages/work-permit.spec.ts
git commit -m "feat(work-permit): hero with wizard, dated badge from rateConfig, jump nav, router, routes comparison, sample card

The comparison stacks both columns below md with wp.099/wp.100 as real captions (D20,
no tabs). wp.022's hard-typed date gives way to sys.wp.hero.updated filled from
rateConfig.updatedAt and hidden when the review is due (D17, badge.ts). The hero's 4th
chip is dropped — no id, no data source for the fine. Breadcrumbs use the page's own
wp.021/wp.011 labels (W109).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 4 — Permit types, rules + penalties, exemptions, process grid, timeline pair, costs, documents, renewal**

- [ ] **Step 1: Write the failing test**

Extend `e2e/pages/work-permit.spec.ts` (inside the loop):

```ts
  test(`${r.path}: rules, exemptions, process, timeline, costs, documents and renewal render by data`, async ({ page }) => {
    await page.goto(r.path);
    await expect(page.getByTestId('wp-rules').locator('ol > li')).toHaveCount(6);
    await expect(page.getByTestId('wp-muafiyet').locator('[data-exemption]')).toHaveCount(5);
    await expect(page.getByTestId('wp-process').locator('ol > li')).toHaveCount(4);
    // Both timeline cards are in the DOM and visible on every width — nothing behind a tab (D20).
    await expect(page.getByTestId('wp-timeline-abroad')).toBeVisible();
    await expect(page.getByTestId('wp-timeline-here')).toBeVisible();
    // W1: the durations come from the metrics collection (firstDayWeeks 6–8, in-country 4–6).
    await expect(page.getByTestId('wp-timeline-abroad')).toContainText('6–8');
    await expect(page.getByTestId('wp-timeline-here')).toContainText('4–6');
    await expect(page.getByTestId('wp-costs').locator('article')).toHaveCount(3);
    await expect(page.getByTestId('wp-documents').locator('ul > li')).toHaveCount(12);
    await expect(page.getByTestId('wp-renewal')).toBeVisible();
    // Every jump-nav target now exists except #faq (Cycle 5).
    for (const id of ['eligibility', 'routes', 'rules', 'muafiyet', 'timeline', 'costs', 'documents']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
```

- [ ] **Step 2: Run to verify it fails**

`npx playwright test e2e/pages/work-permit.spec.ts --project=desktop` → fails on `wp-rules` (0 elements).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/_components/PermitTypes.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_FIXED_TERM_BULLETS, WP_OTHER_TYPES } from '../_content';
import { Frag } from './Frag';
import { CheckIcon } from './icons';

export async function PermitTypes({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const sys = await getTranslations('sys');
  return (
    <Section tone="pale">
      <div className="container-site" data-testid="wp-types">
        <h2 className="mb-3 text-center text-h2 tracking-[-0.03em]">{tf('wp.161')}</h2>
        <p className="mx-auto mb-10 max-w-[560px] text-center text-body-lg text-text-tertiary">{tf('wp.162')}</p>
        <div className="mx-auto grid max-w-[1080px] gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-lg border-[1.5px] border-tint-border bg-white p-7 shadow-card-hover sm:p-8">
            <span className="mb-3 inline-block rounded-pill border border-tint-border bg-tint px-3 py-1 text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">
              {tf('wp.163')}
            </span>
            <h3 className="mb-2.5 text-card-title tracking-[-0.01em]">
              {tf('wp.164')} <span className="text-body font-bold text-muted">{tf('wp.165')}</span>
            </h3>
            <p className="mb-4 text-body text-text-secondary">{tf('wp.166')}</p>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {WP_FIXED_TERM_BULLETS.map((parts) => (
                <li key={parts[0].id} className="flex items-start gap-2.5 text-body-sm text-text-secondary">
                  <CheckIcon size={16} className="mt-0.5 flex-none text-success" />
                  <span>
                    <Frag parts={parts} tf={tf} />
                  </span>
                </li>
              ))}
            </ul>
          </article>
          <div className="flex flex-col gap-5">
            <div className="rounded-lg border border-border-2 bg-white p-6">
              <p className="mb-3 text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{tf('wp.175')}</p>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-body-sm text-text-secondary">
                {WP_OTHER_TYPES.map(([name, rest]) => (
                  <li key={name}>
                    <strong className="font-extrabold text-ink">{tf(name)}</strong> {tf(rest)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-1 flex-col justify-center rounded-lg bg-gradient-to-br from-blue to-blue-safe p-6 text-white">
              <p className="mb-1.5 text-body font-extrabold">{tf('wp.184')}</p>
              <p className="mb-3.5 text-body-sm text-white/85">{tf('wp.185')}</p>
              <ContactCta
                placement="page_cta"
                variant="secondary"
                external
                className="self-start"
                href={waLink(bundle.settings.whatsappNumber, `${sys('whatsapp.prefill')}${sys('wp.whatsapp.permitType')}`)}
              >
                {tf('wp.186')}
              </ContactCta>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/Rules.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { Eyebrow, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_PENALTIES, WP_RULES } from '../_content';
import { needsGap } from '../fragments';

export function Rules({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const intro = tf('wp.189');
  const link = tf('wp.190');
  const tail = tf('wp.191');
  return (
    <Section tone="light" id="rules" className="scroll-mt-24">
      <div className="container-site grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" data-testid="wp-rules">
        <div className="lg:sticky lg:top-24">
          <Eyebrow>{tf('wp.187')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 tracking-[-0.03em]">{tf('wp.188')}</h2>
          <p className="mb-6 text-body text-text-secondary">
            {/* W10: the package's desktop/mobile variants, switched by CSS, both in the DOM;
                wp.189–191 and wp.192–194 are package-split sentences (W23). */}
            <span className="hidden md:inline">
              {intro}
              {needsGap(intro, link) ? ' ' : ''}
              <Link href="/hire-workers" className="font-extrabold text-blue-safe no-underline">
                {link}
              </Link>
              {needsGap(link, tail) ? ' ' : ''}
              {tail}
            </span>
            <span className="md:hidden">
              {tf('wp.192')} <strong className="font-extrabold text-ink">{tf('wp.193')}</strong>
              {tf('wp.194')}
            </span>
          </p>
          <div className="rounded-base border border-danger-border bg-danger-surface p-6">
            <p className="mb-3 text-body font-extrabold text-[#991b1b]">{tf('wp.195')}</p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-body-sm text-[#7f1d1d]">
              {WP_PENALTIES.map((id) => (
                <li key={id}>{tf(id)}</li>
              ))}
            </ul>
          </div>
        </div>
        <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
          {WP_RULES.map(([title, body], i) => (
            <li key={title} className="flex items-start gap-4 rounded-base border border-border-2 bg-white px-6 py-5">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-pill bg-blue-safe text-body-sm font-extrabold text-white"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="mb-1 text-body font-extrabold">{tf(title)}</h3>
                <p className="m-0 text-body-sm text-text-secondary">{tf(body)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/Exemptions.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks';
import { Eyebrow, Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_EXEMPTIONS } from '../_content';
import { EXEMPTION_ICON } from './icons';

const A = 'font-extrabold text-blue-safe no-underline';

export async function Exemptions({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const sys = await getTranslations('sys');
  return (
    <Section tone="pale" id="muafiyet" className="scroll-mt-24">
      <div className="container-site" data-testid="wp-muafiyet">
        <div className="mx-auto mb-10 max-w-[720px] text-center">
          <Eyebrow>{tf('wp.100')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 tracking-[-0.03em]">{tf('wp.212')}</h2>
          <p className="mb-3 text-body-lg text-text-tertiary">{tf('wp.213')}</p>
          {/* wp.214–218: the package splits this sentence around two in-page links (W23). */}
          <p className="m-0 text-body text-text-secondary">
            {tf('wp.214')}{' '}
            <a href="#rules" className={A}>
              {tf('wp.215')}
            </a>{' '}
            {tf('wp.216')}{' '}
            <a href="#eligibility" className={A}>
              {tf('wp.217')}
            </a>{' '}
            {tf('wp.218')}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WP_EXEMPTIONS.cards.map((c) => {
            const Icon = EXEMPTION_ICON[c.icon];
            return (
              <article
                key={c.titleId}
                data-exemption=""
                className="rounded-base border border-border-2 bg-white p-6 transition-shadow hover:shadow-card-hover"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xs bg-[#edf1f9] text-navy">
                    <Icon size={20} />
                  </span>
                  <span className="rounded-pill bg-tint px-2.5 py-1 text-eyebrow font-extrabold text-blue-safe">{tf(c.badgeId)}</span>
                </div>
                <h3 className="mb-1 text-body font-extrabold">{tf(c.titleId)}</h3>
                <p className="m-0 text-body-sm text-text-secondary">{tf(c.bodyId)}</p>
              </article>
            );
          })}
          <div className="flex flex-col justify-center rounded-base bg-gradient-to-br from-[#253063] to-[#16204a] p-6 text-white">
            <p className="mb-1.5 text-body font-extrabold">{tf('wp.232')}</p>
            <p className="mb-3.5 text-body-sm text-white/85">{tf('wp.233')}</p>
            <ContactCta
              placement="page_cta"
              variant="secondary"
              external
              className="self-start"
              href={waLink(bundle.settings.whatsappNumber, `${sys('whatsapp.prefill')}${sys('wp.whatsapp.exemption')}`)}
            >
              {tf('wp.186')}
            </ContactCta>
          </div>
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WP_EXEMPTIONS.facts.map((f) => (
            <div key={f.labelId} className="rounded-base border border-border-2 bg-white p-5">
              <dt className="mb-1.5 text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{tf(f.labelId)}</dt>
              <dd className="m-0 text-body-sm text-text-secondary">
                <strong className="font-extrabold text-ink">{tf(f.strongId)}</strong> {tf(f.restId)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/ProcessGrid.tsx` (page-local, server; delta (4) — the reconcile accepted this over `ProcessSteps`):

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_PROCESS } from '../_content';

export async function ProcessGrid({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const sys = await getTranslations('sys');
  const last = WP_PROCESS.length - 1;
  return (
    <Section tone="light">
      <div className="container-site" data-testid="wp-process">
        <h2 className="mb-3 text-center text-h2-process tracking-[-0.03em]">{tf('wp.246')}</h2>
        <p className="mx-auto mb-12 max-w-[560px] text-center text-body-lg text-text-tertiary">{tf('wp.247')}</p>
        <div className="relative">
          {/* The connector: a static gradient rail on lg (the design animates it in with an
              IntersectionObserver — dropped: no JS, reduced-motion parity). Outside the <ol>
              so the list holds only <li> children. */}
          <span
            aria-hidden="true"
            className="absolute top-4 right-[12.5%] left-[12.5%] hidden h-0.5 bg-gradient-to-r from-blue via-blue-safe to-success lg:block"
          />
          <ol className="relative m-0 grid list-none gap-8 p-0 md:grid-cols-2 lg:grid-cols-4">
            {WP_PROCESS.map((s, i) => (
              <li key={s.titleId} className="relative">
                <span
                  aria-hidden="true"
                  className={`relative z-10 mb-4 flex h-8 w-8 items-center justify-center rounded-pill text-body-sm font-extrabold text-white ${i === last ? 'bg-success' : 'bg-blue-safe'}`}
                >
                  {i + 1}
                </span>
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h3 className="m-0 text-card-title">{tf(s.titleId)}</h3>
                  {s.badgeId && (
                    <span className="rounded-pill border border-success-border bg-success-surface px-2.5 py-0.5 text-eyebrow font-extrabold text-success-text">
                      {tf(s.badgeId)}
                    </span>
                  )}
                </div>
                <p className="m-0 text-body-sm text-text-secondary">{tf(s.bodyId)}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-12 flex flex-col gap-4 rounded-base border border-success-border bg-success-surface px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="m-0 text-body-sm text-ink">
            <strong className="font-extrabold">{tf('wp.257')}</strong> {tf('wp.258')}
          </p>
          <ContactCta
            placement="page_cta"
            variant="primary"
            external
            className="flex-none"
            href={waLink(bundle.settings.whatsappNumber, `${sys('whatsapp.prefill')}${sys('wp.whatsapp.permitOnly')}`)}
          >
            {tf('wp.090')}
          </ContactCta>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/TimelinePair.tsx` — two cards, side by side from `md`, stacked below (nothing hidden; delta (1)):

```tsx
import { makeTf } from '@/content/pure';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_TIMELINE, type TimelineCard } from '../_content';

function Card({
  tf,
  card,
  tone,
  testId,
}: {
  tf: (id: string) => string;
  card: TimelineCard;
  tone: 'blue' | 'green';
  testId: string;
}) {
  const head = tone === 'blue' ? 'bg-gradient-to-br from-blue to-blue-safe' : 'bg-gradient-to-br from-[#22c55e] to-[#15803d]';
  return (
    <article data-testid={testId} className="overflow-hidden rounded-xl border border-border-1 bg-white">
      <div className={`flex items-center justify-between gap-3 px-6 py-5 text-white ${head}`}>
        <h3 className="m-0 text-card-title text-white">{tf(card.titleId)}</h3>
        {/* wp.264/274 carry {firstDayWeeks}/{firstDayWeeksInCountry} — filled by makeTf (W1). */}
        <span className="rounded-pill border border-white/35 bg-white/20 px-3 py-1 text-body-sm font-extrabold whitespace-nowrap">
          {tf(card.durationId)}
        </span>
      </div>
      <dl className="m-0 divide-y divide-border-3">
        {card.rows.map(([when, what]) => (
          <div key={what} className="grid gap-1 px-6 py-4 sm:grid-cols-[110px_1fr] sm:gap-4">
            <dt className="text-eyebrow font-extrabold uppercase tracking-[0.8px] text-blue-safe">{tf(when)}</dt>
            <dd className="m-0 text-body-sm text-text-secondary">{tf(what)}</dd>
          </div>
        ))}
      </dl>
      {card.noteId && (
        <p className="m-0 border-t border-border-3 bg-pale-2 px-6 py-4 text-body-sm font-bold text-success-text">{tf(card.noteId)}</p>
      )}
    </article>
  );
}

export function TimelinePair({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="pale" id="timeline" className="scroll-mt-24">
      <div className="container-site" data-testid="wp-timeline">
        <h2 className="mb-3 text-center text-h2 tracking-[-0.03em]">{tf('wp.259')}</h2>
        <p className="mb-10 text-center text-body-lg text-text-tertiary">{tf('wp.260')}</p>
        <div className="mx-auto grid max-w-[1080px] gap-5 md:grid-cols-2">
          <Card tf={tf} tone="blue" testId="wp-timeline-abroad" card={WP_TIMELINE.abroad} />
          <Card tf={tf} tone="green" testId="wp-timeline-here" card={WP_TIMELINE.here} />
        </div>
      </div>
    </Section>
  );
}
```

(`wp.261`/`wp.262` — the design's tab labels — are not rendered; the cards' own headings `wp.263`/`wp.273` carry the same meaning.)

`src/app/[locale]/(site)/work-permit/_components/Costs.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_COSTS } from '../_content';
import { Frag } from './Frag';

/** Three cost lines and, by design, NO amounts — the state fees change every January and the
 *  service fee is quoted in writing (wp.282/wp.295). D17 has nothing to lint here. */
export async function Costs({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const sys = await getTranslations('sys');
  return (
    <Section tone="light" id="costs" className="scroll-mt-24">
      <div className="container-site" data-testid="wp-costs">
        <h2 className="mb-3 text-center text-h2 tracking-[-0.03em]">{tf('wp.281')}</h2>
        <p className="mx-auto mb-10 max-w-[620px] text-center text-body-lg text-text-tertiary">{tf('wp.282')}</p>
        <div className="mx-auto grid max-w-[1080px] gap-5 md:grid-cols-3">
          {WP_COSTS.map((c) => (
            <article
              key={c.titleId}
              className={`flex flex-col rounded-lg border p-6 ${c.ours ? 'border-tint-border bg-tint' : 'border-border-2 bg-white'}`}
            >
              <p className="mb-2 text-eyebrow font-extrabold uppercase tracking-[1px] text-muted">{tf(c.eyebrowId)}</p>
              <h3 className="mb-2 text-card-title">{tf(c.titleId)}</h3>
              <p className="m-0 text-body-sm text-text-secondary">
                <Frag parts={c.body} tf={tf} strongClass="font-bold text-text-tertiary" />
              </p>
              {c.ours && (
                <ContactCta
                  placement="page_cta"
                  variant="primary"
                  external
                  className="mt-5 self-start"
                  href={waLink(bundle.settings.whatsappNumber, `${sys('whatsapp.prefill')}${sys('wp.whatsapp.quote')}`)}
                >
                  {tf('wp.296')}
                </ContactCta>
              )}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/Documents.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/pure';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { WP_DOCS, type DocList } from '../_content';
import { BuildingIcon, CheckIcon, UsersIcon } from './icons';

function List({
  tf,
  count,
  list,
  Icon,
  tone,
}: {
  tf: (id: string) => string;
  count: string;
  list: DocList;
  Icon: typeof BuildingIcon;
  tone: string;
}) {
  return (
    <article className="rounded-lg border border-border-2 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xs ${tone}`}>
          <Icon size={20} />
        </span>
        <h3 className="m-0 text-card-title">{tf(list.titleId)}</h3>
        {/* The count is computed from the list (never wp.300's typed "6 docs"). */}
        <span className="ml-auto rounded-pill bg-pale-1 px-2.5 py-1 text-eyebrow font-extrabold text-text-secondary">{count}</span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {list.items.map((d) => (
          <li key={d.id} className="flex items-start gap-2.5 text-body-sm text-text-secondary">
            <CheckIcon size={16} className="mt-0.5 flex-none text-success" />
            <span>
              {tf(d.id)}
              {d.noteId ? <span className="text-text-tertiary"> {tf(d.noteId)}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export async function Documents({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const sys = await getTranslations('sys');
  const count = (n: number) => sys('wp.documents.count', { n });
  return (
    <Section tone="pale" id="documents" className="scroll-mt-24">
      <div className="container-site" data-testid="wp-documents">
        <h2 className="mb-3 text-center text-h2 tracking-[-0.03em]">{tf('wp.297')}</h2>
        <p className="mx-auto mb-10 max-w-[560px] text-center text-body-lg text-text-tertiary">{tf('wp.298')}</p>
        <div className="mx-auto grid max-w-[1080px] gap-5 md:grid-cols-2">
          <List
            tf={tf}
            list={WP_DOCS.employer}
            count={count(WP_DOCS.employer.items.length)}
            Icon={BuildingIcon}
            tone="bg-tint text-blue-safe"
          />
          <List
            tf={tf}
            list={WP_DOCS.worker}
            count={count(WP_DOCS.worker.items.length)}
            Icon={UsersIcon}
            tone="bg-success-surface text-success-text"
          />
        </div>
        <p className="mx-auto mt-6 max-w-[1080px] text-center text-body-sm text-text-tertiary">{tf('wp.318')}</p>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/Renewal.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

export async function Renewal({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const sys = await getTranslations('sys');
  return (
    <Section tone="band">
      <div className="container-site">
        <div
          data-testid="wp-renewal"
          className="flex flex-col gap-6 rounded-xl bg-gradient-to-br from-blue to-navy p-8 text-white lg:flex-row lg:items-center lg:justify-between lg:p-10"
        >
          <div className="max-w-[720px]">
            <p className="mb-2 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-sky">{tf('wp.319')}</p>
            <h2 className="mb-3 text-h2 tracking-[-0.03em] text-white">{tf('wp.320')}</h2>
            <p className="mb-4 text-body text-white/80">
              {tf('wp.321')} <strong className="font-extrabold text-white">{tf('wp.322')}</strong>
              {/* W10: desktop continues with wp.323 ("— miss the window…"); mobile ends the
                  sentence and starts wp.324 ("Miss the window…"), as the design does. */}
              <span className="hidden md:inline"> {tf('wp.323')}</span>
              <span className="md:hidden">. {tf('wp.324')}</span>
            </p>
            {/* The design's mobile-only "60 / days" numeral has no id; wp.326 carries the window. */}
            <p className="m-0 rounded-sm border border-white/20 bg-white/10 px-4 py-3 text-body-sm text-white/85">{tf('wp.326')}</p>
          </div>
          <ContactCta
            placement="page_cta"
            variant="secondary"
            size="lg"
            external
            className="flex-none self-start lg:self-center"
            href={waLink(bundle.settings.whatsappNumber, `${sys('whatsapp.prefill')}${sys('wp.whatsapp.renewal')}`)}
          >
            {tf('wp.327')}
          </ContactCta>
        </div>
      </div>
    </Section>
  );
}
```

`page.tsx` — add the eight imports (`PermitTypes`, `Rules`, `Exemptions`, `ProcessGrid`, `TimelinePair`, `Costs`, `Documents`, `Renewal` from `./_components/…`) and append after `<RoutesComparison …/>`:

```tsx
      <PermitTypes bundle={bundle} locale={locale} />
      <Rules bundle={bundle} locale={locale} />
      <Exemptions bundle={bundle} locale={locale} />
      <ProcessGrid bundle={bundle} locale={locale} />
      <TimelinePair bundle={bundle} locale={locale} />
      <Costs bundle={bundle} locale={locale} />
      <Documents bundle={bundle} locale={locale} />
      <Renewal bundle={bundle} locale={locale} />
```

- [ ] **Step 4: Run tests + npm run verify**

`npm run verify` green. `npx playwright test e2e/pages/work-permit.spec.ts` → the counts case passes on both projects; both timeline cards are visible on Pixel 7 (the stacked ruling); the durations read `6–8` / `4–6` from the metrics collection.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit" e2e/pages/work-permit.spec.ts
git commit -m "feat(work-permit): permit types, rules + penalties, Article-48 exemptions, process grid, timeline pair, costs, documents, renewal

Every section renders from _content.ts id tables through makeTf (the timeline
durations fill {firstDayWeeks}/{firstDayWeeksInCountry}, W1); the timeline pair stacks
on mobile instead of hiding a card behind a tab (D20); document counts are computed
from the lists (sys.wp.documents.count), never wp.300's typed figure.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

