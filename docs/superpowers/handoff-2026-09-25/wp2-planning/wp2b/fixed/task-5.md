### Task 5: Partner With Us (`/ortak-olun`, `/en/partner-with-us`)

Repo: the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` — never the shared checkout `…/jobsadmire-website` (that one is on `main`), never switch a branch, never push `main`. Every path below is relative to that worktree root and every command runs from it. Execution order (W99): this task runs after T1 → T13 → T2 → T3 → T4 and after WP2a Tasks 1–9 including the additions files for Tasks 3/5/6/7, so `/privacy` exists (T13), the `## Pages` / `### Page instrumentation (WP2b)` / `### Adding copy` doc lists exist (T1, W98), and the WP2a additions W78/W81/W82/W83/W87/W91/W94 are in the tree. One build/test job at a time on this machine (Mac memory rule).

**Rulings in force here:** **W1** (only signed metrics render: `placed` 470+, `countries` 13, `replySlaHours` 4, `homepageReplyHours` 24 — the design's "5+ HR agencies", "20+ sourcing partners", "25+ partner companies" are unsigned → hidden), **W3** (the HR-agency track posts to `hire` with `iAm: 'hr_agency'`; sourcing + institute post to `partner` with `track`; ISO-2 country select; the door's required fields win over the design), **W6** (hidden sections return `null` from data), **W7/W8** (Android badge only; store micro-copy through `StoreBadges`, never partner.162/163), **W9/W23/W54** (no invented package ids; composed copy in `sys.partner.*`), **W10** (desk/mob string pairs render both, CSS visibility), **W12/W26/W67/W68** (`partner_track_select {page, locale, track ∈ sourcing|institute}` only; every `tel:`/`wa.me`/`mailto:` anchor is tracked with `placement: 'page_cta'`), **W13 amended + W96** (204,800 B script ceiling per route; the `TrackChooser` island is above the fold and server-renders the HR panel, so it stays a plain client component — not `next/dynamic` — with its own gzipped script ≤ 6,144 B, recorded in the ledger line), **W16** (catalog v1.1: `city` on hire/partner, `track` on partner), **W17** (the header CTA for this route is `CTA_BY_PATHNAME['/partner-with-us']` → `#tracks`; **this page renders `id="tracks"`**), **W18** (StickyCtaBar publishes `--sticky-cta-h`), **W20/W21** (delete the `UNBUILT_PATHNAMES` key; append the two paths to `GATE_ROUTE_TABLE` and nowhere else), **W25** (the country select reads the `countries` collection — 64 rows, data not copy — plus `sourceCountries`; no `sys.form.countries` list), **W27/W55/D26** (named placeholders only, never on the LCP element; no hero photo per §10 #4, so the LCP element is the h1), **W73–W76** (the forms kernel as it stands after the Task 2 fix round: 9 s / one connection-level retry, `off` fails site-health, bare `wa.me` fallback href composed at click time), **W78** (no `startWhen` field exists on this page — the design asks none; were one added it would read `START_WHEN_KEYS` from `@/forms/options`), **W79** (every form here is `consent: 'checkbox'`; the package's partner.090/091 KVKK sentence is not rendered and goes on the WP-C legal sheet; pages omit `consentLinkHref`, the kernel's `/privacy` default applies), **W81** (the sticky bar keeps the design's Call / WhatsApp buttons — the bar routes contact hrefs through `ContactLink`, `page_cta`), **W83** (the FAQ ask card's e-mail row comes from `FaqAskCard.email/emailLabelId/subject` — no `footer` workaround), **W87** (partner.059 and partner.077 arrive re-authored as `{replySlaHours} …` / `{countries} …` and render through `makeTf`), **W90** (`sys.partner.*` reaches the client provider — nothing secret in it), **W92** (previews other than `staging` are door-less, so this page's e2e asserts the `unauthorized` fallback deterministically), **W95** (no visitor data in any DOM href — every WhatsApp href on this page carries only the static `sys.partner.*` prefill; the fallback panel's prefill is composed at click time by the kernel), **W98** (one doc shape per shared doc; sentence anchors), **W109** (breadcrumbs use this page's own package labels: partner.016 "Ana Sayfa/Home" → partner.008 "İş Ortağı Olun/Partner With Us"), **W113** (section test ids sit on wrapper `<div>`s, `Section`'s props stay frozen), **W115** (every field with a package label gets it as `label`; `sys.form.labels.*` only for fields without one — `candidatesPerYear`, the institute `city`; e2e selects inputs by the rendered label), **D11/D13** (fallback panel on failure, `/tesekkurler?form=<key>` on success), **D17** (every number via the metrics collection/`makeTf`), **D20** (visible labels on every input, native radios for the track cards), **R15** (the chrome reads its own canonical ids — this page does NOT read the chrome's partner.001, 003–007, 009–015, 017–022 or 191–221; it DOES read partner.002 (the Hire Workers link inside the chain sentence the package splits around it), partner.008 and partner.016 (its own breadcrumb labels, W109)), **R22**, **R35**, **R56**.

**What the page is.** The design (`design-package/design/Partner With Us.dc.html`, strings `design-package/strings/partner.json`, ids partner.001–223) in section order: hero (dark, breadcrumb, h1 partner.023, desk/mob lead 024/025, two ticks 026–029, CTAs 030 → `#tracks` + 031 WhatsApp, languages 032/033, and the "Our network today" card 035–046) → partner logo marquee (hidden: no consented logos, §10 #11) → "Where you fit in the chain" 047–058 → sticky CTA bar 059 + Call 060 + WhatsApp 031 + 030 → `#tracks` "Three ways to partner" 061–070 with three track cards → `#track-detail` showing ONE panel (HR 071–098 / sourcing 099–118 / institute 119–136), each = eyebrow, h2, lead, mobile jump link, four benefit rows, "What we ask from you" card, form card → "How a partnership starts" 137–147 (four steps) → partner portal block 148–166 → FAQ 167–185 (six pairs + ask card with WhatsApp / Call / Email rows) → closing CTA 186–190. Three form instances, two door keys.

**Design deltas this task accepts (written into the ledger row; they are not defects):**
1. The inline success banners (partner.088/089) → navigation to `/tesekkurler?form=hire|partner` (D13).
2. The kernel's consent checkbox (`sys.form.consent.label`, link → `/privacy`) replaces partner.090/091 (W79; both ids listed for the WP-C legal sheet).
3. The sourcing form keeps its licence/no-fee declaration (partner.114) **as a second required checkbox** beside the kernel consent.
4. The network card renders the two signed rows (countries, placed) without count-up; the "5+"/"20+" rows and the "25+" logo caption are hidden (W1).
5. The hero is a gradient (no photo: §10 #4) and the h1 is the LCP element.
6. The track cards are native radios styled as cards (the design's `div onClick`); the choice is mirrored into `#track-<key>` so campaigns can deep-link.
7. The institute's single "City, country" input (partner.135) becomes a `city` text field (sys label) + the ISO-2 `country` select (partner.115).
8. `candidatesPerYear` (catalog field, `sys.form.labels.candidatesPerYear`) is its own optional input on the sourcing and institute forms beside the free-text `trades`; the design folds the count into the trades question (T14's I4 rows 7–8 send it).
9. The closing section uses the foundation's dark `ClosingCtaBand` (tone `gradient`) instead of the design's light band; the "we reply within {replySlaHours} working hours" badge (partner.186) sits as a pill above the card at every width (the band's own `ticks` are mobile-only, W10).
10. The header CTA is the W17 table's ("Apply to partner" → `#tracks`, secondary "Hire Workers"), not a page prop.
11. The sticky bar: the design hides it while `#tracks` is in view and shows it again after; the foundation's `isBarVisible` hides the bar as its target approaches and keeps it hidden past it — with `#tracks` about 1,300 px down, `hideNearId="tracks"` would leave the bar invisible on every desktop. The bar keys on the closing band instead (`hideNearId="closing"`, the band repeats the same Apply/Call pair), so it shows from 700 px until the closing band and stays up over the tracks section. (Recorded as an open item for the controller: a "hide while in view" mode on `StickyCtaBar`.)
12. The FAQ ask card's "Email" row label reads partner.117 ("E-posta" / "Email" — this page's own id carrying the identical word; the design's ask-card label has no id of its own and W83's row takes an id, W9).
13. The form-card anchors keep the design's ids (`#apply-hr`, `#apply-agent`, `#apply-inst`) and sit on the `<form>` elements (`FormShell id`).

**Files:**

Create
- `src/app/[locale]/(site)/partner-with-us/page.tsx`
- `src/app/[locale]/(site)/partner-with-us/actions.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/content.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/tracks.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/forms.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/country-options.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/logos.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/content.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/forms.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/country-options.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_components/Tick.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/HeroSection.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/NetworkCard.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/PartnerLogos.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/ChainSection.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/TracksSection.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/PortalSection.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/TrackPanel.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/FormCard.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/HrAgencyForm.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/SourcingPartnerForm.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/InstituteForm.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/DeclarationCheckbox.tsx` (`'use client'`)
- `src/app/[locale]/(site)/partner-with-us/_components/TrackChooser.tsx` (`'use client'`)
- `src/app/[locale]/(site)/partner-with-us/_components/__tests__/DeclarationCheckbox.test.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/__tests__/TrackChooser.test.tsx`
- `e2e/pages/partner.spec.ts`

Modify
- `src/messages/tr.json`, `src/messages/en.json` — new `sys.partner` object (identical key set in both files)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES`: delete the `'/partner-with-us'` entry (W20; `src/lib/seo/unbuilt.test.ts` fails in either direction otherwise)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: append `{ path: '/ortak-olun', indexable: true }` and `{ path: '/en/partner-with-us', indexable: true }` as the literal's last two entries
- `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md`, `docs/PRD.md` (sentence-anchored, listed under **Docs in this task**)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T5 ledger row (T1's row format, W98)

Test
- Vitest: the five test files above (`npx vitest run "src/app/\[locale\]/(site)/partner-with-us"`), plus the existing `src/lib/seo/unbuilt.test.ts`, `src/messages/messages.test.ts`, `scripts/gate-routes.test.ts`, `src/lib/seo/routes.test.ts`, which must stay green
- Playwright: `e2e/pages/partner.spec.ts` + the route-driven `e2e/routing.spec.ts` (page-contract loop), `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` against `next start`, then against the door-less preview (W92)
- `npm run gate` against the preview (W91 bypass header) for the Lighthouse triple + `npm run js-size`; the W96 island measurement (Cycle 5)

**Interfaces:**

Consumes (exact names; the real code under `src/forms/**` and `src/content/**` wins over produces-final text):
- WP1: `getBundle` from `@/content/adapter` (`server-only`); `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `waLink(number, text)`, `telLink(phone)`, `mailLink(email, subject?)` from `@/lib/contact`; `Button`, `Section`, `Eyebrow` from `@/design/primitives`; `WhatsAppIcon` (`{ size?, className? }`) from `@/design/chrome/icons`; `track(event, params)` from `@/analytics/track`; `renderWithIntl(ui, { locale? })` from `@/test/render`; `type Bundle` from `contract/website-bundle.v1` (six-level relative import `'../../../../../../contract/website-bundle.v1'` from `_components/` and `_lib/`, W41 precedent).
- WP2a Task 1 (in the tree): `makeT(bundle)`, `makeTf(bundle, locale)`, `metricValues(bundle, locale)` from `@/content/pure` (also re-exported by `@/content/adapter`); `getCollection(bundle, 'sourceCountries' | 'countries')`, `type SourceCountry`, `type Country` from `@/content/collections`; the `pages.partner` record `{ titleId: 'partner.222', descriptionId: 'partner.223', robots: 'index', jsonLd: ['breadcrumb','faq'] }`; the re-authored ids partner.078 (`{homepageReplyHours}`), 087/140/186 (`{replySlaHours}`), 159 (`{placed}`); `settings.{phone, phoneDisplay, email, whatsappNumber, turnstileSiteKey, storeLinks.android, storeLinks.ios}`.
- WP2a Task 2 (in the tree, post-fix-round + addendum): `createFormAction({ key, schema, toFields, consent })` and `type FormActionState` from `@/forms/action` (`toFields(parsed, data, ctx: { visitor, locale })` — this page's mappers use the first argument only); `type WireFields` from `@/forms/wire`; `fieldErrorsFromIssues` from `@/forms/errors` (codes `required | email | phone | min | max | … | invalid`); `FormShell` from `@/forms/client/FormShell` with props `action, formKey, locale, turnstileSiteKey, whatsappNumber, contact?, submitLabel?, consent?: 'checkbox' | 'notice', testId?, id?, idScope?, headingLevel?: 2 | 3 | 4, className?, children` (`consentLinkHref` omitted → `'/privacy'`); `Field` and `type FieldOption` from `@/forms/client/Field` (`{ name, label?, hint?, placeholder?, required?, as?, type?, options?, autoComplete?, inputMode?, rows?, minLength?, maxLength?, defaultValue?, disabled?, id? }`; the select branch ignores `placeholder`, W111); `FormErrorsContext`, `useFieldId`, `useRegisterField`, `useFieldError`, `useFieldValue` from `@/forms/client/FormErrorsContext`. Ids inside a shell are `f-<idScope ?? formKey>-<name>`; the fallback panel is `[data-testid="form-fallback"][data-kind=…]` with a bare `https://wa.me/<number>` href (W76).
- WP2a Task 3: `ContactLink` (`{ href, placement, children, …anchor attrs }`) from `@/analytics/ContactLink`; `PARAM_ENUMS.track = ['sourcing','institute']`, `ALLOWED_PARAMS.partner_track_select = ['page','locale','track']` in `@/analytics/track`; `CTA_BY_PATHNAME['/partner-with-us']` (partner.017+018 → `{ pathname: '/partner-with-us', hash: '#tracks' }`, secondary home.002 → `/hire-workers`); route group `src/app/[locale]/(site)/`; W87 (partner.059 → `{replySlaHours}`, partner.077 → `{countries}` in `scripts/metric-placeholders.json`, bundles regenerated); W90 client-message pick.
- WP2a Task 4: `UNBUILT_PATHNAMES` in `src/lib/seo/routes.ts` (contains `'/partner-with-us'` until this task); `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` from `@/lib/seo/metadata` (OG image → `pageOgImageUrl(locale, 'partner')` = `…/og/{locale}/partner.png`).
- WP2a Task 5 (+ additions W81/W82/W83): `Section` tones `'light' | 'dark' | 'pale' | 'band'`; `ButtonVariant` gains `'inverse'`; `StickyCtaBar` from `@/design/chrome/StickyCtaBar` (`{ message, ctas: StickyCta[], showAfterPx?, hideNearId?, live? }`, `StickyCta = { label, href: string | Exclude<Href, string>, variant?, external? }`; contact hrefs render through `ContactLink` `page_cta`; wrapper `data-testid="sticky-cta"`); from `@/design/blocks`: `Breadcrumbs` (`{ locale, items: Crumb[], tone?, className? }`), `FaqBlock` (`{ bundle, locale, items: FaqItem[], id?, eyebrowId?, headingId?, bodyId?, askCard?: FaqAskCard, singleOpen?, openFirst?, headingLevel?, footer? }`), `type FaqAskCard` (`{ titleId, bodyId, whatsappNumber, whatsappText, whatsappLabelId, phone?, callLabelId?, email?, emailLabelId?, subject? }`, W83), `ClosingCtaBand` (`{ bundle, locale, titleId, bodyId?, primary: Cta, secondary?: Cta, extra?, ticks?, tone?: 'navy' | 'gradient' | 'green', id? }`), `ProcessSteps` (`{ bundle, locale, steps: ProcessStep[], variant?, id?, headingLevel? }`, `ProcessStep = { n, titleId, bodyId, when? }`), `ContactCta` (`{ placement: 'page_cta', href, variant?, size?, external?, className?, children }`), `ImageSlot` (`{ slot, alt, width, height, className? }` → `data-placeholder={slot}` when no `src`), `StoreBadges` (`{ bundle, locale, android, ios? }`), `LogoMarquee` (`{ logos: Logo[] }`), `type Logo`.
- WP2a Task 7 (+ additions W91/W94): `GATE_ROUTE_TABLE` in `e2e/routes.ts`; the page markup contract (`h1[data-testid="page-h1"][data-lcp-slot="h1"]`, named `data-placeholder`s); `npm run gate` (Playwright/LHCI send `x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET`; `lighthouserc.preview.json` on previews); `npm run js-size`.
- WP2a Task 8 (Ops catalog v1.1, deployed): `hire` fields `name*, company*, email*, phone*, country, iAm (direct_employer|hr_agency), sector, roleNeeded, headcount, startWhen, message, city`; `partner` fields `name*, company*, email*, phone*, country* (iso2), candidatesPerYear ≤20, trades ≤500, licence ≤200, message, city ≤120, track ∈ sourcing|institute` (`website-form-catalog.ts` + v1.1). Door tag `[website:partner:<track>]`; `partner` → `SOURCING_PARTNER` for both tracks.
- WP2b T13 (W99, runs earlier): `/privacy` (`/gizlilik`, `/en/privacy`) exists, so the consent link resolves.

Produces (later tasks rely on):
- `id="tracks"` on this page (the W17 header-CTA contract for `/partner-with-us`); the design's form anchors `#apply-hr`, `#apply-agent`, `#apply-inst` and the deep links `#track-hr | #track-sourcing | #track-institute`.
- `src/app/[locale]/(site)/partner-with-us/_lib/country-options.ts` — `countryOptions(source, general, locale): FieldOption[]` (source countries first, the rest by Turkish/English collation); page-local on purpose (T11 builds its own options inline from `countries`).
- The wire each instance sends, for T14's I4 map (W105): HR agency → `hire` · `name, company, email, phone, country: 'TR', iAm: 'hr_agency', city` (**city required** on this page), `message?`; sourcing → `partner` · `name, company, email, phone, country (ISO-2), track: 'sourcing', licence` (**required**), `candidatesPerYear?, trades?` (no `city`, no `message`); institute → `partner` · `name, company, email, phone, country, track: 'institute', city?, candidatesPerYear?, trades?` (no `message`, no `licence`). Consent is a checkbox on all three (W79); the sourcing form also requires the declaration tick.
- `sys.partner.*` keys (list at the end); `e2e/pages/partner.spec.ts` (a reference "form → door-less fallback panel" e2e with click-time WhatsApp composition); two `GATE_ROUTE_TABLE` rows; `UNBUILT_PATHNAMES` minus `/partner-with-us`.

---

#### Cycle 1 — pure content: package-id table, track keys, sys copy, form schemas + mappers, country options

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/content.test.ts` — every package id the page reads exists in BOTH generated bundles (an unknown id throws in dev and renders `''` in production), the W87 re-authoring has landed, and every `sys.partner.*` key exists in both message files:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { PARTNER_PACKAGE_IDS, PARTNER_SYS_KEYS } from '../content';

// R56 forbids importing src/content/local/* from src/**; readFileSync is the sanctioned bypass
// for a test that pins page copy to the generated bundle (W40 precedent).
const bundle = (locale: 'tr' | 'en') =>
  JSON.parse(
    readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
  ) as { strings: Record<string, string> };

const pick = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>))
      return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);

describe('Partner With Us — package ids', () => {
  it('reads only ids the importer emitted, in both locales, with no empty value', () => {
    const trStrings = bundle('tr').strings;
    const enStrings = bundle('en').strings;
    for (const id of PARTNER_PACKAGE_IDS) {
      expect(trStrings[id], `${id} (tr)`).toBeTypeOf('string');
      expect(trStrings[id], `${id} (tr)`).not.toBe('');
      expect(enStrings[id], `${id} (en)`).toBeTypeOf('string');
      expect(enStrings[id], `${id} (en)`).not.toBe('');
    }
  });

  it('is a de-duplicated list of 162 partner.* ids, own crumb/link labels included (W109)', () => {
    expect(new Set(PARTNER_PACKAGE_IDS).size).toBe(PARTNER_PACKAGE_IDS.length);
    for (const id of PARTNER_PACKAGE_IDS) expect(id).toMatch(/^partner\.\d{3}$/);
    for (const id of ['partner.002', 'partner.008', 'partner.016', 'partner.060', 'partner.117', 'partner.223'])
      expect(PARTNER_PACKAGE_IDS).toContain(id);
    expect(PARTNER_PACKAGE_IDS).toHaveLength(162);
  });

  it('never reads the chrome ids (R15) or the ids the deltas retire', () => {
    for (const id of [
      'partner.001', 'partner.013', 'partner.017', 'partner.018', 'partner.019', 'partner.022', // chrome / W17 table
      'partner.034', // hero photo alt — no photo (§10 #4)
      'partner.037', 'partner.039', 'partner.045', // unsigned metrics (W1)
      'partner.088', 'partner.089', // inline success banner → /tesekkurler (D13)
      'partner.090', 'partner.091', // consent copy is the kernel's (W79)
      'partner.135', // "City, country" → city + ISO-2 country
      'partner.162', 'partner.163', // store micro-copy renders through StoreBadges (hire.240/241)
      'partner.191', 'partner.211', 'partner.221', // footer chrome
    ])
      expect(PARTNER_PACKAGE_IDS, id).not.toContain(id);
  });

  it('carries the W87 re-authored metric spellings (partner.059 reply time, partner.077 countries)', () => {
    for (const locale of ['tr', 'en'] as const) {
      const s = bundle(locale).strings;
      expect(s['partner.059'], `partner.059 (${locale})`).toContain('{replySlaHours}');
      expect(s['partner.077'], `partner.077 (${locale})`).toContain('{countries}');
      expect(s['partner.077']).not.toMatch(/12/);
    }
  });
});

describe('Partner With Us — sys.partner.* copy', () => {
  it('exists as a non-empty string in both locales', () => {
    for (const key of PARTNER_SYS_KEYS) {
      expect(pick(tr.sys, key), `${key} (tr)`).toBeTypeOf('string');
      expect(pick(en.sys, key), `${key} (en)`).toBeTypeOf('string');
      expect(pick(tr.sys, key), `${key} (tr)`).not.toBe('');
      expect(pick(en.sys, key), `${key} (en)`).not.toBe('');
    }
  });

  it('is not English in Turkish: every TR value differs from its EN twin', () => {
    for (const key of PARTNER_SYS_KEYS) expect(pick(tr.sys, key), key).not.toBe(pick(en.sys, key));
  });
});
```

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/forms.test.ts` — the three schemas, the kernel's error vocabulary, and the mappers onto the EXACT Ops catalog names:

```ts
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import {
  DECLARATION_FIELD,
  HR_COUNTRY,
  hrAgencySchema,
  hrAgencyToFields,
  instituteSchema,
  instituteToFields,
  sourcingSchema,
  sourcingToFields,
} from '../forms';
import { PARTNER_TRACKS, TRACK_KEYS } from '../tracks';

// The door keeps exactly these names (website-form-catalog.ts v1.0 + the v1.1 additions of WP2a
// Task 8 / W16) and silently DROPS anything else — so a typo here loses data with no error.
const HIRE_CATALOG = [
  'name', 'company', 'email', 'phone', 'country', 'iAm', 'sector', 'roleNeeded', 'headcount',
  'startWhen', 'message', 'city',
];
const PARTNER_CATALOG = [
  'name', 'company', 'email', 'phone', 'country', 'candidatesPerYear', 'trades', 'licence',
  'message', 'city', 'track',
];

const hrValid = {
  company: '  Akdeniz İK A.Ş. ',
  name: 'Ayşe Yılmaz',
  city: 'Antalya',
  email: 'ayse@example.com',
  phone: '+90 532 000 00 00',
  message: 'Kaynakçı ve CNC operatörü',
  consent: 'on',
};

describe('HR-agency track → hire (W3)', () => {
  it('maps onto the hire catalog names, forcing country TR and iAm hr_agency', () => {
    const fields = hrAgencyToFields(hrAgencySchema.parse(hrValid));
    expect(fields).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Akdeniz İK A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 532 000 00 00',
      country: HR_COUNTRY,
      iAm: 'hr_agency',
      city: 'Antalya',
      message: 'Kaynakçı ve CNC operatörü',
    });
    expect(HR_COUNTRY).toBe('TR');
    for (const key of Object.keys(fields)) expect(HIRE_CATALOG, key).toContain(key);
  });

  it('reports required / email / phone in the kernel vocabulary (required before email)', () => {
    const r = hrAgencySchema.safeParse({ company: '', name: '', city: '', email: 'nope', phone: '12' });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(fieldErrorsFromIssues(r.error.issues)).toEqual({
        company: 'required',
        name: 'required',
        city: 'required',
        email: 'email',
        phone: 'phone',
      });
    const empty = hrAgencySchema.safeParse({ ...hrValid, email: '' });
    expect(empty.success).toBe(false);
    if (!empty.success) expect(fieldErrorsFromIssues(empty.error.issues)).toEqual({ email: 'required' });
  });

  it('sends an empty message when the textarea is blank (buildEnvelope drops it)', () => {
    const fields = hrAgencyToFields(hrAgencySchema.parse({ ...hrValid, message: '' }));
    expect(fields.message).toBe('');
  });
});

const sourcingValid = {
  company: 'Karachi Manpower Ltd',
  name: 'Bilal Khan',
  country: 'pk',
  licence: 'OEP-1234',
  email: 'bilal@example.com',
  phone: '+92 300 1234567',
  candidatesPerYear: '250',
  trades: 'Welders, electricians — 20 a month',
  [DECLARATION_FIELD]: 'on',
  consent: 'on',
};

describe('sourcing-partner track → partner + track:sourcing (W3/W16)', () => {
  it('maps onto the partner catalog names with the upper-cased ISO-2 country and track sourcing', () => {
    const fields = sourcingToFields(sourcingSchema.parse(sourcingValid));
    expect(fields).toEqual({
      name: 'Bilal Khan',
      company: 'Karachi Manpower Ltd',
      email: 'bilal@example.com',
      phone: '+92 300 1234567',
      country: 'PK',
      track: 'sourcing',
      licence: 'OEP-1234',
      candidatesPerYear: '250',
      trades: 'Welders, electricians — 20 a month',
    });
    for (const key of Object.keys(fields)) expect(PARTNER_CATALOG, key).toContain(key);
    expect(PARTNER_TRACKS).toEqual(['sourcing', 'institute']);
    expect(TRACK_KEYS).toEqual(['hr', 'sourcing', 'institute']);
  });

  it('requires the licence declaration checkbox as its own field, beside the kernel consent', () => {
    const { [DECLARATION_FIELD]: _drop, ...noDeclaration } = sourcingValid;
    const r = sourcingSchema.safeParse(noDeclaration);
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrorsFromIssues(r.error.issues)).toEqual({ [DECLARATION_FIELD]: 'required' });
    expect(DECLARATION_FIELD).toBe('licenceDeclaration');
  });

  it('rejects a free-text country (the door would 400) and reads an empty select as required', () => {
    const free = sourcingSchema.safeParse({ ...sourcingValid, country: 'Pakistan' });
    expect(free.success).toBe(false);
    if (!free.success) expect(fieldErrorsFromIssues(free.error.issues)).toEqual({ country: 'invalid' });
    const blank = sourcingSchema.safeParse({ ...sourcingValid, country: '' });
    expect(blank.success).toBe(false);
    if (!blank.success) expect(fieldErrorsFromIssues(blank.error.issues)).toEqual({ country: 'required' });
  });

  it('caps trades at the catalog length (500) with the max code and requires the licence number', () => {
    const long = sourcingSchema.safeParse({ ...sourcingValid, trades: 'x'.repeat(501), licence: '' });
    expect(long.success).toBe(false);
    if (!long.success)
      expect(fieldErrorsFromIssues(long.error.issues)).toEqual({ trades: 'max', licence: 'required' });
  });
});

describe('institute track → partner + track:institute (W3/W16)', () => {
  it('maps city + country separately and sends track institute', () => {
    const fields = instituteToFields(
      instituteSchema.parse({
        company: 'Lahore Technical Institute',
        name: 'Sara Ahmed',
        city: 'Lahore',
        country: 'PK',
        email: 'sara@example.com',
        phone: '+92 42 1234567',
        trades: 'Plumbing, HVAC — 60 graduates per batch',
        consent: 'on',
      }),
    );
    expect(fields).toEqual({
      name: 'Sara Ahmed',
      company: 'Lahore Technical Institute',
      email: 'sara@example.com',
      phone: '+92 42 1234567',
      country: 'PK',
      track: 'institute',
      city: 'Lahore',
      candidatesPerYear: '',
      trades: 'Plumbing, HVAC — 60 graduates per batch',
    });
    for (const key of Object.keys(fields)) expect(PARTNER_CATALOG, key).toContain(key);
  });

  it('treats city as optional for an institute (the design asked "City, country" in one box)', () => {
    const r = instituteSchema.safeParse({
      company: 'X', name: 'Y', country: 'NP', email: 'a@b.co', phone: '+977 9812345678',
    });
    expect(r.success).toBe(true);
  });
});
```

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/country-options.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { countryOptions } from '../country-options';

const source = [
  { code: 'PK', name: 'Pakistan' },
  { code: 'NP', name: 'Nepal' },
  { code: 'IN', name: 'Hindistan' },
];
const general = [
  { code: 'AE', name: 'Birleşik Arap Emirlikleri' },
  { code: 'TR', name: 'Türkiye' },
  { code: 'PK', name: 'Pakistan' }, // also a source country — must not repeat
  { code: 'IR', name: 'İran' },
  { code: 'ID', name: 'Endonezya' },
];

describe('countryOptions', () => {
  it('lists the source countries first in their own order, then the rest sorted by name in the locale', () => {
    const opts = countryOptions(source, general, 'tr');
    expect(opts.map((o) => o.value)).toEqual(['PK', 'NP', 'IN', 'AE', 'ID', 'IR', 'TR']);
    expect(opts[0]).toEqual({ value: 'PK', label: 'Pakistan' });
  });

  it('sorts with the Turkish collation on TR (I before İ) and the English one on EN', () => {
    const rows = [
      { code: 'GB', name: 'İngiltere' },
      { code: 'IQ', name: 'Irak' },
      { code: 'IR', name: 'İran' },
    ];
    expect(countryOptions([], rows, 'tr').map((o) => o.label)).toEqual(['Irak', 'İngiltere', 'İran']);
    expect(countryOptions([], rows, 'en').map((o) => o.label)).toEqual(['İngiltere', 'Irak', 'İran']);
  });

  it('never emits a duplicate code and always keeps TR available (an HR agency abroad may pick it)', () => {
    const opts = countryOptions(source, general, 'en');
    expect(new Set(opts.map((o) => o.value)).size).toBe(opts.length);
    expect(opts.some((o) => o.value === 'TR')).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/partner-with-us/_lib"` → three files fail at import (`Failed to resolve import "../content"`, `"../forms"`, `"../country-options"`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/_lib/tracks.ts` — client-safe (no Zod, no React): the chooser island imports THIS file, never `forms.ts`, so the schemas never reach the client bundle (W96):

```ts
/** The three track cards. `hr` posts to `hire` with `iAm: 'hr_agency'`; the other two post to
 *  `partner` with `track` (W3/W16). */
export const TRACK_KEYS = ['hr', 'sourcing', 'institute'] as const;
export type TrackKey = (typeof TRACK_KEYS)[number];

/** Catalog v1.1 `partner.track` (W16) = `PARAM_ENUMS.track` of `partner_track_select` (W67). */
export const PARTNER_TRACKS = ['sourcing', 'institute'] as const;
export type PartnerTrack = (typeof PARTNER_TRACKS)[number];

export const isPartnerTrack = (key: TrackKey): key is PartnerTrack =>
  (PARTNER_TRACKS as readonly string[]).includes(key);

/** The form anchors — the design's own ids, so its campaign links keep working. */
export const FORM_ANCHOR: Record<TrackKey, string> = {
  hr: 'apply-hr',
  sourcing: 'apply-agent',
  institute: 'apply-inst',
};

/** `FormShell idScope` per track: sourcing and institute share the `partner` key, so each
 *  shell scopes its own ids (`f-partner-sourcing-consent` …) even though one mounts at a time. */
export const FORM_ID_SCOPE: Record<TrackKey, string> = {
  hr: 'partner-hr',
  sourcing: 'partner-sourcing',
  institute: 'partner-institute',
};

/** `#track-<key>` → the key; anything else → null. The hash is also the radio's id, so the
 *  browser's own anchor jump lands on the card. */
export function trackFromHash(hash: string): TrackKey | null {
  const key = /^#track-([a-z]+)$/.exec(hash)?.[1];
  return key && (TRACK_KEYS as readonly string[]).includes(key) ? (key as TrackKey) : null;
}
```

`src/app/[locale]/(site)/partner-with-us/_lib/content.ts` — the page's id table (one place; the sections read from it, the test pins it to the bundle):

```ts
/**
 * Every package id this page reads, grouped by section, plus the sys.partner.* keys. The
 * chrome's own ids (partner.001, 003–007, 009–015, 017–022, 191–221) are NOT here: the chrome
 * reads its canonical ids (R15) and the header CTA pair partner.017/018 belongs to
 * `CTA_BY_PATHNAME` (W17). partner.002 (the Hire Workers link the package splits the chain
 * sentence around, W23), partner.008 and partner.016 (this page's own breadcrumb labels, W109)
 * ARE read. `_lib/__tests__/content.test.ts` asserts each id exists in both generated bundles.
 */
export const HERO_IDS = {
  crumbHome: 'partner.016',
  crumbSelf: 'partner.008',
  h1: 'partner.023',
  leadDesk: 'partner.024',
  leadMob: 'partner.025',
  tick1Lead: 'partner.026',
  tick1Tail: 'partner.027',
  tick2Lead: 'partner.028',
  tick2Tail: 'partner.029',
  ctaTracks: 'partner.030',
  ctaWhatsApp: 'partner.031',
  speakLead: 'partner.032',
  speakTail: 'partner.033',
} as const;

export const NETWORK_IDS = {
  heading: 'partner.035',
  live: 'partner.036',
  footnote: 'partner.046',
} as const;

/** The design's four rows; only the two with a signed metric render (W1). `metric: null` rows
 *  are listed so the data says why they are absent; their desk ids (037/039) are never read. */
export const NETWORK_ROWS = [
  { metric: null, deskId: 'partner.037', mobId: 'partner.038', tone: 'text-blue' },
  { metric: null, deskId: 'partner.039', mobId: 'partner.040', tone: 'text-success' },
  { metric: 'countries', deskId: 'partner.041', mobId: 'partner.042', tone: 'text-[#35468a]' },
  { metric: 'placed', deskId: 'partner.043', mobId: 'partner.044', tone: 'text-warning-text' },
] as const;

export const CHAIN_IDS = {
  heading: 'partner.047',
  introLead: 'partner.048',
  introLink: 'partner.002', // the package splits the sentence around the Hire Workers link (W23)
  introTail: 'partner.049',
  nodes: [
    { eyebrow: 'partner.050', title: 'partner.051', body: 'partner.052', tone: 'supply' },
    { eyebrow: 'partner.053', title: 'partner.054', body: 'partner.055', tone: 'core' },
    { eyebrow: 'partner.056', title: 'partner.057', body: 'partner.058', tone: 'demand' },
  ],
} as const;

/** partner.059 is re-authored to `{replySlaHours} working hours` (W87) — read through makeTf. */
export const STICKY_IDS = {
  message: 'partner.059',
  call: 'partner.060',
  whatsapp: 'partner.031',
  cta: 'partner.030',
} as const;

export const TRACKS_IDS = {
  heading: 'partner.061',
  introDesk: 'partner.062',
  introMob: 'partner.063',
  wayfinderChoose: 'partner.064',
  wayfinderApply: 'partner.070',
  cardCta: 'partner.066',
  cards: {
    hr: { title: 'partner.038', body: 'partner.065' },
    sourcing: { title: 'partner.040', body: 'partner.067' },
    institute: { title: 'partner.068', body: 'partner.069' },
  },
} as const;

/** partner.077 is re-authored to `{countries}` (W87); 078/087 carry reply-time tokens. */
export const PANEL_IDS = {
  jump: 'partner.074',
  asksHeading: 'partner.082',
  sla: 'partner.087',
  submit: 'partner.092',
  hr: {
    eyebrow: 'partner.071',
    heading: 'partner.072',
    lead: 'partner.073',
    benefits: [
      ['partner.075', 'partner.076'],
      ['partner.077', 'partner.078'],
      ['partner.079', 'partner.080'],
      ['partner.028', 'partner.081'],
    ],
    asks: ['partner.083', 'partner.084', 'partner.085'],
    formTitle: 'partner.086',
    fields: {
      company: 'partner.093',
      name: 'partner.094',
      city: 'partner.095',
      email: 'partner.096',
      phone: 'partner.097',
      message: 'partner.098',
    },
  },
  sourcing: {
    eyebrow: 'partner.099',
    heading: 'partner.100',
    lead: 'partner.101',
    benefits: [
      ['partner.102', 'partner.103'],
      ['partner.104', 'partner.105'],
      ['partner.106', 'partner.107'],
      ['partner.108', 'partner.109'],
    ],
    asks: ['partner.110', 'partner.111', 'partner.112'],
    formTitle: 'partner.113',
    declaration: 'partner.114',
    fields: {
      company: 'partner.093',
      name: 'partner.094',
      country: 'partner.115',
      licence: 'partner.116',
      email: 'partner.117',
      phone: 'partner.097',
      trades: 'partner.118',
    },
  },
  institute: {
    eyebrow: 'partner.119',
    heading: 'partner.120',
    lead: 'partner.121',
    benefits: [
      ['partner.122', 'partner.123'],
      ['partner.124', 'partner.125'],
      ['partner.126', 'partner.127'],
      ['partner.128', 'partner.129'],
    ],
    asks: ['partner.130', 'partner.131', 'partner.132'],
    formTitle: 'partner.133',
    fields: {
      company: 'partner.134',
      name: 'partner.094',
      country: 'partner.115',
      email: 'partner.117',
      phone: 'partner.097',
      trades: 'partner.136',
    },
  },
} as const;

export const PROCESS_IDS = {
  heading: 'partner.137',
  intro: 'partner.138',
  steps: [
    { n: 1, titleId: 'partner.139', bodyId: 'partner.140' },
    { n: 2, titleId: 'partner.141', bodyId: 'partner.142' },
    { n: 3, titleId: 'partner.143', bodyId: 'partner.144' },
    { n: 4, titleId: 'partner.145', bodyId: 'partner.147', whenId: 'partner.146' },
  ],
} as const;

export const PORTAL_IDS = {
  eyebrow: 'partner.148',
  heading: 'partner.149',
  lead: 'partner.150',
  features: [
    ['partner.151', 'partner.152'],
    ['partner.153', 'partner.154'],
    ['partner.155', 'partner.156'],
    ['partner.157', 'partner.158'],
  ],
  claimLead: 'partner.159',
  claimTail: 'partner.160',
  mobileLine: 'partner.161',
  addressBar: 'partner.164',
  screenAlt: 'partner.165',
  mobileAlt: 'partner.166',
} as const;

export const FAQ_IDS = {
  eyebrow: 'partner.167',
  heading: 'partner.168',
  lead: 'partner.169',
  pairs: [
    ['partner.170', 'partner.171'],
    ['partner.172', 'partner.173'],
    ['partner.174', 'partner.175'],
    ['partner.176', 'partner.177'],
    ['partner.178', 'partner.179'],
    ['partner.180', 'partner.181'],
  ],
  askTitle: 'partner.182',
  askBody: 'partner.183',
  askWhatsApp: 'partner.184',
  askCall: 'partner.185',
  /** "E-posta" / "Email" — the page's own id with the identical word; the design's ask-card
   *  label has none of its own and W83's row takes an id (delta 12). */
  askEmail: 'partner.117',
} as const;

export const CLOSING_IDS = {
  badge: 'partner.186',
  heading: 'partner.187',
  body: 'partner.188',
  primary: 'partner.189',
  legal: 'partner.190',
} as const;

export const SEO_IDS = { title: 'partner.222', description: 'partner.223' } as const;

const flatten = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === 'string') {
    if (/^partner\.\d{3}$/.test(value)) out.push(value);
  } else if (Array.isArray(value)) value.forEach((v) => flatten(v, out));
  else if (value && typeof value === 'object')
    Object.values(value as Record<string, unknown>).forEach((v) => flatten(v, out));
  return out;
};

/** Every id resolved at render time (the unsigned network rows' desk ids are excluded; their
 *  mobile ids 038/040 are read as the track-card titles). */
export const PARTNER_PACKAGE_IDS: readonly string[] = [
  ...new Set(
    flatten([
      HERO_IDS,
      NETWORK_IDS,
      NETWORK_ROWS.filter((r) => r.metric !== null),
      CHAIN_IDS,
      STICKY_IDS,
      TRACKS_IDS,
      PANEL_IDS,
      PROCESS_IDS,
      PORTAL_IDS,
      FAQ_IDS,
      CLOSING_IDS,
      SEO_IDS,
    ]),
  ),
].sort();

/** `sys.partner.*` (W9/W23) — read through next-intl, never `t()`. */
export const PARTNER_SYS_KEYS = [
  'partner.whatsapp.prefill',
  'partner.faq.whatsappText',
  'partner.faq.emailSubject',
  'partner.tracks.legend',
] as const;
```

`src/app/[locale]/(site)/partner-with-us/_lib/forms.ts` — pure (no `server-only`, no React): the Zod schemas and the catalog mappings, so the server actions stay one-liners and the mapping is unit-tested. Server-side only by use (`actions.ts` and tests import it; no client component does):

```ts
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';

/** The sourcing form's licence/no-fee declaration (partner.114): its own required checkbox,
 *  beside the kernel's consent checkbox (W79). Not a catalog name — never sent on the wire. */
export const DECLARATION_FIELD = 'licenceDeclaration';

/** The HR-agency track is a Turkish company by definition (partner.083); the `hire` catalog
 *  takes an ISO-2 country, the design asks only for a city. */
export const HR_COUNTRY = 'TR';

// The kernel's vocabulary (src/forms/errors.ts): `.min(1)` before `.email()` so an empty value
// reads 'required', not 'email'; a custom `message` that is a FormErrorCode wins (phone/invalid).
const PHONE = /(\D*\d){8,}/;
const ISO2 = /^[A-Z]{2}$/;
const required = (max: number) => z.string().trim().min(1).max(max);
const optional = (max: number) => z.string().trim().max(max).optional();
const email = z.string().trim().min(1).max(254).email();
const phone = z.string().trim().min(1).regex(PHONE, { message: 'phone' }).max(40);
/** The `<select>` posts the ISO-2 code (W3/W40); anything else would be a door 400. */
const country = z.string().trim().toUpperCase().min(1).regex(ISO2, { message: 'invalid' });

// Caps = the catalog's (name 120, company 200, city 120, licence 200, candidatesPerYear 20,
// trades 500, message 5000), so the door never answers 400 for a length.
export const hrAgencySchema = z.object({
  company: required(200),
  name: required(120),
  city: required(120),
  email,
  phone,
  message: optional(5000),
});
export type HrAgencyInput = z.infer<typeof hrAgencySchema>;

export const sourcingSchema = z.object({
  company: required(200),
  name: required(120),
  country,
  licence: required(200),
  email,
  phone,
  candidatesPerYear: optional(20),
  trades: optional(500),
  // An unticked checkbox posts nothing → undefined → 'required' (the literal's message).
  [DECLARATION_FIELD]: z.literal('on', { message: 'required' }),
});
export type SourcingInput = z.infer<typeof sourcingSchema>;

export const instituteSchema = z.object({
  company: required(200),
  name: required(120),
  city: optional(120),
  country,
  email,
  phone,
  candidatesPerYear: optional(20),
  trades: optional(500),
});
export type InstituteInput = z.infer<typeof instituteSchema>;

// Wire names = the Ops catalog's, exactly (unknown keys are dropped silently). Empty strings
// are dropped by buildEnvelope, so optionals map to ''.

/** → `hire` with `iAm: 'hr_agency'` (W3): the HR track is an employer-side client and must
 *  reach the Turkey sales team, which the `partner` key (→ SOURCING_PARTNER) would not. */
export function hrAgencyToFields(p: HrAgencyInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: HR_COUNTRY,
    iAm: 'hr_agency',
    city: p.city,
    message: p.message ?? '',
  };
}

/** → `partner` with `track: 'sourcing'` (W16; inbox tag `[website:partner:sourcing]`). */
export function sourcingToFields(p: SourcingInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: p.country,
    track: 'sourcing',
    licence: p.licence,
    candidatesPerYear: p.candidatesPerYear ?? '',
    trades: p.trades ?? '',
  };
}

/** → `partner` with `track: 'institute'` (W16; classification stays SOURCING_PARTNER, the
 *  track rides in the inbox tag `[website:partner:institute]`). */
export function instituteToFields(p: InstituteInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: p.country,
    track: 'institute',
    city: p.city ?? '',
    candidatesPerYear: p.candidatesPerYear ?? '',
    trades: p.trades ?? '',
  };
}
```

`src/app/[locale]/(site)/partner-with-us/_lib/country-options.ts`:

```ts
import type { FieldOption } from '@/forms/client/Field';
import type { Locale } from '@/i18n/routing';

type CountryLike = { code: string; name: string };

const COLLATION: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' };

/** The ISO-2 `<select>` options (W3/W25): the 13 source countries first, in the collection's
 *  order, then every other country of the general list sorted by its locale name. Values are
 *  the upper-case codes the door validates; labels are the locale-resolved names (data, not
 *  copy). A type-only import from the client `Field` module — nothing reaches the client. */
export function countryOptions(
  source: ReadonlyArray<CountryLike>,
  general: ReadonlyArray<CountryLike>,
  locale: Locale,
): FieldOption[] {
  const seen = new Set<string>();
  const take = (rows: ReadonlyArray<CountryLike>): FieldOption[] => {
    const out: FieldOption[] = [];
    for (const c of rows) {
      if (seen.has(c.code)) continue; // a source country also in the general list appears once
      seen.add(c.code);
      out.push({ value: c.code, label: c.name });
    }
    return out;
  };
  const head = take(source);
  const collator = new Intl.Collator(COLLATION[locale]);
  const tail = take(general).sort((a, b) => collator.compare(a.label, b.label));
  return [...head, ...tail];
}
```

`src/app/[locale]/(site)/partner-with-us/_lib/logos.ts`:

```ts
import type { Logo } from '@/design/blocks';

/** §10 #11: partner logos ship in v1.1 with written consent. Empty in Phase A, so the logo
 *  strip (and its "25+" caption, an unsigned metric — W1) is hidden by data (W6). */
export const PARTNER_LOGOS: readonly Logo[] = [];
```

`src/messages/tr.json` — inside `"sys"`, a new sibling object `"partner"` added as the last key of `sys` (object order is not significant; `messages.test.ts` checks key-set parity):

```json
    "partner": {
      "whatsapp": {
        "prefill": "Merhaba JobsAdmire, bir iş ortaklığı hakkında görüşmek istiyorum."
      },
      "faq": {
        "whatsappText": "Merhaba JobsAdmire, iş ortaklığıyla ilgili bir sorum var.",
        "emailSubject": "İş ortaklığı sorusu"
      },
      "tracks": {
        "legend": "Ortaklık türünüzü seçin"
      }
    }
```

`src/messages/en.json` — the same position:

```json
    "partner": {
      "whatsapp": {
        "prefill": "Hello JobsAdmire, I would like to discuss a partnership."
      },
      "faq": {
        "whatsappText": "Hello JobsAdmire, I have a partnership question.",
        "emailSubject": "Partnership question"
      },
      "tracks": {
        "legend": "Choose your partnership type"
      }
    }
```

(Add the comma after the preceding sibling in each file; the prefills are static copy, never visitor data — W95.)

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/\[locale\]/(site)/partner-with-us/_lib" src/messages` → 4 files passed (content 6, forms 9, country-options 3, messages parity). `npx prettier --write "src/app/[locale]/(site)/partner-with-us" src/messages` then `npm run verify` → green (tsc, eslint, prettier --check, the whole vitest suite).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us/_lib" src/messages/tr.json src/messages/en.json
git commit -m "feat(partner): id table, track keys, sys.partner copy, track schemas → hire/partner catalog fields, ISO-2 country options (T5 c1)

HR-agency track → hire + iAm hr_agency + country TR (W3); sourcing/institute → partner + track
(W16) with the licence declaration as its own required checkbox; countries from the W25
collections, source countries first; W87 re-authored spellings pinned.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — page skeleton: metadata, hero + network card, chain, tracks heading (`#tracks`), process, portal, FAQ (ask card with e-mail row), closing, sticky bar; route wiring; the page-contract e2e

- [ ] **Step 1: Write the failing tests**

`e2e/pages/partner.spec.ts` — Cycle 2's cases (Cycle 4 appends the track and form cases to the same file):

```ts
import { test, expect, type Page } from '@playwright/test';

const ROUTE = { tr: '/ortak-olun', en: '/en/partner-with-us' } as const;
// Canonicals, hreflang and og:image are built from SITE_URL, not the host the run hits.
const ORIGIN = 'https://www.jobsadmire.com';
const PHONE_HREF = 'tel:+905011240340';

// Section wrappers in the design's order (W113); the logo strip is absent by data (W6, §10 #11).
const SECTIONS = [
  'partner-network',
  'partner-chain',
  'partner-tracks',
  'partner-process',
  'partner-portal',
  'partner-faq',
  'partner-closing',
];

type DataLayerEntry = Record<string, unknown>;
const dataLayer = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? [],
  ) as Promise<DataLayerEntry[]>;

/** Lets a test click a tel:/wa.me/mailto: anchor without leaving the page: a capture-phase
 *  listener cancels the navigation; React's own click handler (the analytics push) still runs. */
const neutraliseContactLinks = (page: Page) =>
  page.evaluate(() => {
    document.addEventListener(
      'click',
      (e) => {
        const a = (e.target as Element | null)?.closest?.(
          'a[href^="tel:"], a[href^="mailto:"], a[href^="https://wa.me/"]',
        );
        if (a) e.preventDefault();
      },
      true,
    );
  });

for (const [locale, route] of Object.entries(ROUTE) as ['tr' | 'en', string][]) {
  test(`${route}: page contract, sections in order, no leaked tokens, no logo strip`, async ({
    page,
  }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.locator('h1[data-testid="page-h1"]');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect((await h1.innerText()).trim().length).toBeGreaterThan(0);
    // W1/W87 placeholders filled (partner.059/077/078/087/140/159/186), no missing id, no object.
    expect(await page.locator('body').innerText()).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
    const tops: number[] = [];
    for (const id of SECTIONS) {
      await expect(page.getByTestId(id)).toHaveCount(1);
      tops.push((await page.getByTestId(id).boundingBox())?.y ?? -1);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    await expect(page.getByTestId('partner-logos')).toHaveCount(0);
    // W17: the header CTA for this route points at #tracks, so the page must render it.
    await expect(page.locator('#tracks')).toHaveCount(1);
    // Only the LCP h1 carries data-lcp-slot; the two portal mocks are the named placeholders (D26/W55).
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    const placeholders = await page
      .locator('main [data-placeholder]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder')));
    expect(placeholders.sort()).toEqual(['partner-portal-mobile', 'partner-portal-screen']);
    // The signed metrics render (W1): 13 source countries in the network card and in partner.077.
    await expect(page.getByTestId('partner-network')).toContainText('13');
  });
}

test('metadata: package SEO strings, canonical, hreflang pair, OG image, breadcrumb + FAQ JSON-LD', async ({
  page,
  request,
}) => {
  await page.goto(ROUTE.en);
  await expect(page).toHaveTitle(/Recruitment Agency Partnership in Türkiye/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}/en/partner-with-us`);
  await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', `${ORIGIN}/ortak-olun`);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', `${ORIGIN}/ortak-olun`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${ORIGIN}/og/en/partner.png`);
  const html = await (await request.get(ROUTE.tr)).text();
  expect(html).toContain('"@type":"BreadcrumbList"');
  expect(html).toContain('"@type":"FAQPage"');
  // The site-wide Organization node exactly once — the design's per-page EmploymentAgency block is not duplicated.
  expect(html.split('"@type":["Organization","EmploymentAgency"]').length - 1).toBe(1);
});

test('the breadcrumb uses the page own labels (W109) and the language links point at this page', async ({
  page,
}) => {
  await page.goto(ROUTE.tr);
  const crumbs = page.getByRole('navigation', { name: 'Sayfa yolu' });
  await expect(crumbs).toContainText('Ana Sayfa');
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText('İş Ortağı Olun');
  await expect(page.locator('a[href="/en/partner-with-us"]').first()).toBeAttached();
  await page.goto(ROUTE.en);
  await expect(page.locator('a[href="/ortak-olun"]').first()).toBeAttached();
});

test('every contact anchor on the page is tracked with page_cta (W12): the FAQ e-mail row', async ({
  page,
}) => {
  await page.goto(ROUTE.tr);
  await neutraliseContactLinks(page);
  const faq = page.getByTestId('partner-faq');
  const mail = faq.locator('a[href^="mailto:info@jobsadmire.com?subject="]');
  await expect(mail).toHaveCount(1); // W83: the ask card's third row, not a footer
  await mail.click();
  const events = (await dataLayer(page)).filter((e) => e.event === 'email_click');
  expect(events).toEqual([{ event: 'email_click', page: '/ortak-olun', locale: 'tr', placement: 'page_cta' }]);
});

test('the sticky bar carries the design Call / WhatsApp / tracks CTAs and tracks the call (W81)', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the bar renders from lg; below it the mobile bottom bar owns the space');
  await page.goto(ROUTE.tr);
  await neutraliseContactLinks(page);
  await page.evaluate(() => window.scrollTo(0, 900));
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toBeVisible();
  await expect(bar.locator(`a[href="${PHONE_HREF}"]`)).toHaveCount(1);
  // The static partnership prefill only — no visitor data in a DOM href (W95).
  await expect(bar.locator('a[href^="https://wa.me/905011240340?text="]')).toHaveCount(1);
  await expect(bar.locator('a[href="#tracks"]')).toHaveCount(1);
  await bar.locator(`a[href="${PHONE_HREF}"]`).click();
  const events = (await dataLayer(page)).filter((e) => e.event === 'call_click');
  expect(events).toEqual([{ event: 'call_click', page: '/ortak-olun', locale: 'tr', placement: 'page_cta' }]);
});
```

`e2e/routes.ts` — the two rows join `GATE_ROUTE_TABLE` in Step 3. The route-driven page-contract loop in `e2e/routing.spec.ts` and the canonical/hreflang/sitemap cases in `e2e/seo.spec.ts` pick the route up from there — no edit to those files.

- [ ] **Step 2: Run to verify it fails**

`npx vitest run src/lib/seo/unbuilt.test.ts` is green before the page exists (the set and the filesystem agree). Build and start, then run the spec:

```bash
npm run build && (npm run start -- -p 3100 > /tmp/t5-next.log 2>&1 & echo $! > /tmp/t5-next.pid) && sleep 5
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/partner.spec.ts --project=desktop; kill "$(cat /tmp/t5-next.pid)"
```

Every case fails: `/ortak-olun` answers 404 through the `[...rest]` catch-all (`expect(res?.status()).toBe(200)` → 404; the metadata case finds no title; the sticky case finds no `sticky-cta`).

- [ ] **Step 3: Implement**

`src/lib/seo/routes.ts` — in `UNBUILT_PATHNAMES` (Task 4's `new Set<keyof typeof pathnames>([...])` literal), delete the line `'/partner-with-us',`. Nothing else in the file changes.

`e2e/routes.ts` — append as the last two entries of the `GATE_ROUTE_TABLE` literal (after whatever row the previous page task left last):

```ts
  { path: '/ortak-olun', indexable: true },
  { path: '/en/partner-with-us', indexable: true },
```

`src/app/[locale]/(site)/partner-with-us/_components/Tick.tsx` (server, no directive — the design's check glyph, decorative):

```tsx
export function Tick({ className = 'text-success' }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`mt-1 shrink-0 ${className}`}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/NetworkCard.tsx` — the hero's "Our network today" card; a row renders only for a signed metric (W1), its figure from `metricValues` (D17):

```tsx
import { makeTf, metricValues } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { NETWORK_IDS, NETWORK_ROWS } from '../_lib/content';

export function NetworkCard({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const values = metricValues(bundle, locale); // '470+', '13' … formatted per locale
  const rows = NETWORK_ROWS.flatMap((row) => {
    if (row.metric === null) return []; // unsigned in Phase A (W1) — the desk ids are never read
    const value = values[row.metric];
    return value ? [{ ...row, metric: row.metric, value }] : [];
  });
  return (
    <div
      data-testid="partner-network"
      className="rounded-hero border border-white/10 bg-white p-7 text-ink shadow-hero-form md:p-8"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="m-0 text-card-title font-extrabold">{tf(NETWORK_IDS.heading)}</h2>
        <span className="inline-flex items-center gap-2 text-eyebrow font-extrabold tracking-[0.8px] text-success-text uppercase">
          <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
          {tf(NETWORK_IDS.live)}
        </span>
      </div>
      {rows.length > 0 && (
        <ul className="m-0 list-none p-0">
          {rows.map((row) => (
            <li
              key={row.metric}
              className="flex items-baseline gap-4 border-t border-border-4 py-4 last:border-b"
            >
              <span className={`min-w-[74px] text-stat font-extrabold tracking-[-0.5px] ${row.tone}`}>
                {row.value}
              </span>
              <span className="text-body-sm text-text-secondary">
                {/* W10: the design's desktop/mobile label pair, both in the DOM */}
                <span className="hidden sm:inline">{tf(row.deskId)}</span>
                <span className="sm:hidden">{tf(row.mobId)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 mb-0 text-body-sm text-text-tertiary">{tf(NETWORK_IDS.footnote)}</p>
    </div>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/HeroSection.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { Breadcrumbs, ContactCta } from '@/design/blocks';
import { WhatsAppIcon } from '@/design/chrome/icons';
import { Button, Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { HERO_IDS } from '../_lib/content';
import { NetworkCard } from './NetworkCard';
import { Tick } from './Tick';

/** The design's full-bleed photo hero renders as a gradient (§10 #4: photography only on the
 *  Homepage and Hire Workers), so the h1 is the LCP element (D26) — no hero placeholder. */
export function HeroSection({
  bundle,
  locale,
  whatsappPrefill,
}: {
  bundle: Bundle;
  locale: Locale;
  /** `sys.partner.whatsapp.prefill` — static copy, never visitor data (W95) */
  whatsappPrefill: string;
}) {
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  return (
    <Section tone="dark" className="relative overflow-hidden bg-linear-to-br from-navy to-[#0a1428]">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          {/* W109: this page's own labels — partner.016 "Home", partner.008 "Partner With Us" */}
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-4"
            items={[
              { name: tf(HERO_IDS.crumbHome), href: '/' },
              { name: tf(HERO_IDS.crumbSelf), href: '/partner-with-us' },
            ]}
          />
          <h1
            data-testid="page-h1"
            data-lcp-slot="h1"
            className="text-h1 mb-4 leading-[1.02] tracking-[-0.03em] text-white"
          >
            {tf(HERO_IDS.h1)}
          </h1>
          <p className="text-body-lg mb-7 max-w-[560px] text-white/80">
            <span className="hidden sm:inline">{tf(HERO_IDS.leadDesk)}</span>
            <span className="sm:hidden">{tf(HERO_IDS.leadMob)}</span>
          </p>
          <ul className="m-0 mb-7 flex max-w-[580px] list-none flex-wrap gap-x-8 gap-y-3 p-0">
            <li className="flex items-start gap-2 text-body-sm text-white/80">
              <Tick className="text-[#4ade80]" />
              <span>
                <strong className="text-white">{tf(HERO_IDS.tick1Lead)}</strong> {tf(HERO_IDS.tick1Tail)}
              </span>
            </li>
            <li className="flex items-start gap-2 text-body-sm text-white/80">
              <Tick className="text-[#4ade80]" />
              <span>
                <strong className="text-white">{tf(HERO_IDS.tick2Lead)}</strong> {tf(HERO_IDS.tick2Tail)}
              </span>
            </li>
          </ul>
          <div className="mb-6 flex flex-wrap gap-3">
            <Button variant="primary" size="lg" href="#tracks">
              {tf(HERO_IDS.ctaTracks)}
            </Button>
            <ContactCta
              placement="page_cta"
              variant="inverse"
              size="lg"
              external
              href={waLink(settings.whatsappNumber, whatsappPrefill)}
            >
              <WhatsAppIcon size={16} />
              {tf(HERO_IDS.ctaWhatsApp)}
            </ContactCta>
          </div>
          <p className="m-0 text-body-sm text-white/80">
            {tf(HERO_IDS.speakLead)} <strong className="text-white">{tf(HERO_IDS.speakTail)}</strong>
          </p>
        </div>
        <NetworkCard bundle={bundle} locale={locale} />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/PartnerLogos.tsx`:

```tsx
import { LogoMarquee, type Logo } from '@/design/blocks';
import { Section } from '@/design/primitives';

/** Hidden by data (W6): no consented logos in Phase A (§10 #11). The design's "25+ partner
 *  companies" caption (partner.045) is an unsigned metric and stays hidden with the strip (W1). */
export function PartnerLogos({ logos }: { logos: readonly Logo[] }) {
  if (logos.length === 0) return null;
  return (
    <Section tone="band" className="border-b border-border-3">
      <div className="container-site" data-testid="partner-logos">
        <LogoMarquee logos={[...logos]} />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/ChainSection.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CHAIN_IDS } from '../_lib/content';

const NODE = {
  supply: { card: 'border border-tint-border bg-pale-1 text-ink', eyebrow: 'text-blue-safe', body: 'text-text-secondary' },
  core: {
    card: 'bg-linear-to-br from-blue to-blue-safe text-white shadow-[0_18px_40px_rgba(24,153,213,0.28)]',
    eyebrow: 'text-white/85',
    body: 'text-white/85',
  },
  demand: { card: 'border border-tint-border bg-pale-1 text-ink', eyebrow: 'text-success-text', body: 'text-text-secondary' },
} as const;

/** Supply → Recruitment → Demand. The intro is the one sentence the package splits around the
 *  Hire Workers link (partner.048 + partner.002 + partner.049), so composing it is allowed (W23);
 *  the design's old-site href becomes the typed route. */
export function ChainSection({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="light" className="border-b border-border-3">
      <div className="container-site" data-testid="partner-chain">
        <h2 className="text-h2 mb-3 text-center">{tf(CHAIN_IDS.heading)}</h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body text-text-tertiary">
          {tf(CHAIN_IDS.introLead)}{' '}
          <Link href="/hire-workers" className="font-bold text-blue-safe">
            {tf(CHAIN_IDS.introLink)}
          </Link>{' '}
          {tf(CHAIN_IDS.introTail)}
        </p>
        <div className="mx-auto grid max-w-[1080px] gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          {CHAIN_IDS.nodes.map((node, i) => {
            const c = NODE[node.tone];
            return (
              <div key={node.eyebrow} className="contents">
                {i > 0 && (
                  <span aria-hidden="true" className="hidden text-[24px] font-extrabold text-tint-border md:block">
                    →
                  </span>
                )}
                <div className={`rounded-md px-6 py-6 text-center ${c.card}`}>
                  <p className={`mb-2 text-eyebrow font-extrabold tracking-[1.2px] uppercase ${c.eyebrow}`}>
                    {tf(node.eyebrow)}
                  </p>
                  <p className="mb-1 text-card-title font-extrabold">{tf(node.title)}</p>
                  <p className={`m-0 text-body-sm ${c.body}`}>{tf(node.body)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/TracksSection.tsx` — Cycle 2 version: the `#tracks` section with its heading and intro (the W17 anchor lands on real content from this commit on); Cycle 4 replaces the file with the version that mounts the chooser and the three panels:

```tsx
import { makeTf } from '@/content/pure';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { TRACKS_IDS } from '../_lib/content';

/** `#tracks`: the W17 header CTA, the hero, the sticky bar and the closing band all land here. */
export function TracksSection({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="light" id="tracks" className="scroll-mt-20">
      <div className="container-site" data-testid="partner-tracks">
        <h2 className="text-h2 mb-3 text-center">{tf(TRACKS_IDS.heading)}</h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body text-text-tertiary">
          <span className="hidden sm:inline">{tf(TRACKS_IDS.introDesk)}</span>
          <span className="sm:hidden">{tf(TRACKS_IDS.introMob)}</span>
        </p>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/PortalSection.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { ImageSlot, StoreBadges } from '@/design/blocks';
import { Eyebrow, Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PORTAL_IDS } from '../_lib/content';
import { Tick } from './Tick';

/** The partner-portal showcase. `partner.159` is re-authored to `{placed}` (W1) and resolves
 *  through makeTf; the store badges come from settings (Android only, W8; micro-copy from
 *  hire.240/241 through StoreBadges, never partner.162/163 — W7). The two screenshots are named
 *  placeholders until the owner supplies them (W55) — never the LCP element. */
export function PortalSection({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  return (
    <Section tone="light" className="pb-0">
      <div className="container-site">
        <div
          data-testid="partner-portal"
          className="grid items-center gap-10 rounded-hero border border-border-1 bg-linear-to-b from-pale-1 to-tint p-6 md:p-14 lg:grid-cols-[1fr_1.05fr] lg:gap-14"
        >
          <div>
            <Eyebrow>{tf(PORTAL_IDS.eyebrow)}</Eyebrow>
            <h2 className="text-h2 mt-3 mb-3">{tf(PORTAL_IDS.heading)}</h2>
            <p className="mb-6 text-body text-text-secondary">{tf(PORTAL_IDS.lead)}</p>
            <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
              {PORTAL_IDS.features.map(([lead, tail]) => (
                <li key={lead} className="flex items-start gap-3 text-body-sm text-text-secondary">
                  <Tick />
                  <span>
                    <strong className="text-ink">{tf(lead)}</strong> {tf(tail)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mb-6 flex items-start gap-2 text-body-sm text-text-secondary">
              <Tick className="text-blue-safe" />
              <span>
                <strong className="text-ink">{tf(PORTAL_IDS.claimLead)}</strong> {tf(PORTAL_IDS.claimTail)}
              </span>
            </p>
            <p className="mb-3 text-body-sm font-bold text-text-tertiary">{tf(PORTAL_IDS.mobileLine)}</p>
            <StoreBadges
              bundle={bundle}
              locale={locale}
              android={settings.storeLinks.android}
              ios={settings.storeLinks.ios}
            />
          </div>
          <div className="relative pb-6">
            <div className="overflow-hidden rounded-base border border-border-1 bg-white shadow-[0_26px_60px_rgba(22,60,90,0.16)] md:mr-[70px]">
              <div
                aria-hidden="true"
                className="flex items-center gap-1.5 border-b border-border-4 bg-[#f0f6fa] px-3.5 py-2.5"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="ml-2 flex-1 rounded-[6px] border border-border-4 bg-white px-2.5 py-1 text-[11.5px] text-text-tertiary">
                  {tf(PORTAL_IDS.addressBar)}
                </span>
              </div>
              <ImageSlot
                slot="partner-portal-screen"
                alt={tf(PORTAL_IDS.screenAlt)}
                width={720}
                height={340}
                className="w-full"
              />
            </div>
            {/* W10: the phone mock is hidden below md by CSS, not by conditional rendering */}
            <div className="absolute right-0 bottom-0 hidden w-[150px] rounded-[24px] bg-[#0f2438] p-[7px] shadow-[0_26px_56px_rgba(15,36,56,0.35)] md:block">
              <ImageSlot
                slot="partner-portal-mobile"
                alt={tf(PORTAL_IDS.mobileAlt)}
                width={136}
                height={274}
                className="rounded-[17px]"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/page.tsx` — the final composition (Cycle 4 only replaces `TracksSection`'s file; this file does not change again):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { getBundle, makeT, makeTf } from '@/content/adapter';
import { ClosingCtaBand, FaqBlock, ProcessSteps } from '@/design/blocks';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { Section } from '@/design/primitives';
import { routing } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { ChainSection } from './_components/ChainSection';
import { HeroSection } from './_components/HeroSection';
import { PartnerLogos } from './_components/PartnerLogos';
import { PortalSection } from './_components/PortalSection';
import { TracksSection } from './_components/TracksSection';
import { CLOSING_IDS, FAQ_IDS, PROCESS_IDS, SEO_IDS, STICKY_IDS } from './_lib/content';
import { PARTNER_LOGOS } from './_lib/logos';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  // The package ships this page's SEO pair (partner.222/223) and the page record names them;
  // the fallbacks repeat the same ids so the call stays honest if the record ever loses them
  // (no sys.seo.partner.* exists or is needed, W23).
  return buildMetadata({
    locale,
    href: '/partner-with-us',
    bundle,
    pageKey: 'partner',
    fallbackTitle: t(SEO_IDS.title),
    fallbackDescription: t(SEO_IDS.description),
  });
}

export default async function PartnerWithUs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  // Static partnership copy — the only text any WhatsApp href on this page carries (W95).
  const whatsappPrefill = sys('partner.whatsapp.prefill');

  return (
    <>
      <HeroSection bundle={bundle} locale={locale} whatsappPrefill={whatsappPrefill} />
      <PartnerLogos logos={PARTNER_LOGOS} />
      <ChainSection bundle={bundle} locale={locale} />

      {/* The design's sticky bar with its three CTAs (W81: tel/wa.me render through ContactLink,
          page_cta). It keys on the closing band, which repeats the Apply/Call pair — delta 11. */}
      <StickyCtaBar
        message={tf(STICKY_IDS.message)}
        ctas={[
          { label: tf(STICKY_IDS.call), href: telLink(settings.phone), variant: 'secondary' },
          {
            label: tf(STICKY_IDS.whatsapp),
            href: waLink(settings.whatsappNumber, whatsappPrefill),
            variant: 'secondary',
            external: true,
          },
          { label: tf(STICKY_IDS.cta), href: '#tracks' },
        ]}
        hideNearId="closing"
        live
      />

      <TracksSection bundle={bundle} locale={locale} />

      <Section tone="pale">
        <div className="container-site" data-testid="partner-process">
          <h2 className="text-h2 mb-3 text-center">{tf(PROCESS_IDS.heading)}</h2>
          <p className="mx-auto mb-11 max-w-[560px] text-center text-body text-text-tertiary">
            {tf(PROCESS_IDS.intro)}
          </p>
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            id="how-it-starts"
            variant="cards"
            steps={PROCESS_IDS.steps.map((s) => ({
              n: s.n,
              titleId: s.titleId,
              bodyId: s.bodyId,
              when: 'whenId' in s ? tf(s.whenId) : undefined,
            }))}
          />
        </div>
      </Section>

      <PortalSection bundle={bundle} locale={locale} />

      <Section tone="light">
        <div className="container-site" data-testid="partner-faq">
          <FaqBlock
            bundle={bundle}
            locale={locale}
            id="faq"
            eyebrowId={FAQ_IDS.eyebrow}
            headingId={FAQ_IDS.heading}
            bodyId={FAQ_IDS.lead}
            openFirst
            items={FAQ_IDS.pairs.map(([q, a], i) => ({ id: `partner-faq-${i + 1}`, q: tf(q), a: tf(a) }))}
            askCard={{
              titleId: FAQ_IDS.askTitle,
              bodyId: FAQ_IDS.askBody,
              whatsappNumber: settings.whatsappNumber,
              whatsappText: sys('partner.faq.whatsappText'),
              whatsappLabelId: FAQ_IDS.askWhatsApp,
              phone: settings.phone,
              callLabelId: FAQ_IDS.askCall,
              // W83: the design's third row — a ContactCta mailto, placement page_cta
              email: settings.email,
              emailLabelId: FAQ_IDS.askEmail,
              subject: sys('partner.faq.emailSubject'),
            }}
          />
        </div>
      </Section>

      <Section tone="light" className="pt-0">
        <div className="container-site" data-testid="partner-closing">
          {/* delta 9: the design's badge at every width (the band's ticks are mobile-only, W10) */}
          <p className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-pill border border-success-border bg-success-surface px-4 py-1.5 text-body-sm font-extrabold text-success-text">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
            {tf(CLOSING_IDS.badge)}
          </p>
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            id="closing"
            tone="gradient"
            titleId={CLOSING_IDS.heading}
            bodyId={CLOSING_IDS.body}
            primary={{ label: tf(CLOSING_IDS.primary), href: '#tracks' }}
            secondary={{ label: settings.phoneDisplay, href: telLink(settings.phone) }}
          />
          <p className="mt-6 mb-0 text-center text-body-sm text-text-tertiary">
            {tf(CLOSING_IDS.legal)}{' '}
            <ContactLink href={mailLink(settings.email)} placement="page_cta" className="font-bold text-blue-safe">
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
- No `<main>`: `(site)/layout.tsx`'s `SiteChrome` owns `<main id="main">` (R31).
- `makeTf` for every visible package string — partner.059/077/078/087/140/159/186 carry `{metric}` tokens (D17/W87); `makeT` only inside `generateMetadata` for the two SEO ids (plain strings, and what `buildMetadata` itself uses).
- `ProcessSteps.when` is a resolved string: step 4's "Full access" pill is `tf('partner.146')`.
- Every `tel:`/`mailto:`/`wa.me` anchor on this page goes through a tracked component — `ContactCta` (hero), the `StickyCtaBar` (W81), the `FaqBlock` ask card (W83), the `ClosingCtaBand` CTAs, `ContactLink` (legal line) — with `placement: 'page_cta'` (W12). None of their hrefs carries visitor data (W95).
- `Section tone="light" className="pb-0"` / `"pt-0"` collapse the design's tighter portal → FAQ → closing spacing; Tailwind v4 orders `pt-`/`pb-` after `py-` (accepted page-local, reconcile "Section … padding override").

- [ ] **Step 4: Run tests + `npm run verify`**

```bash
npx prettier --write "src/app/[locale]/(site)/partner-with-us" e2e/pages/partner.spec.ts e2e/routes.ts src/lib/seo/routes.ts
npm run verify        # green: unbuilt.test.ts agrees again (key deleted ↔ page.tsx exists); gate-routes.test.ts sees the two new rows
npm run build && (npm run start -- -p 3100 > /tmp/t5-next.log 2>&1 & echo $! > /tmp/t5-next.pid) && sleep 5
E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/partner.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts; kill "$(cat /tmp/t5-next.pid)"
```

Expected: `partner.spec.ts` green on both projects (page contract ×2, metadata, breadcrumb + language links, FAQ e-mail row, sticky bar — the last one skips on `mobile`); `routing.spec.ts`'s page-contract loop and `seo.spec.ts`'s canonical/hreflang/sitemap/200 sweep pass for `/ortak-olun` and `/en/partner-with-us`.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us" e2e/pages/partner.spec.ts e2e/routes.ts src/lib/seo/routes.ts
git commit -m "feat(partner): page skeleton — metadata, hero + network card, chain, #tracks heading, process, portal, FAQ, closing, sticky bar; route wired (T5 c2)

/partner-with-us leaves UNBUILT_PATHNAMES (W20); both locale paths join GATE_ROUTE_TABLE (W21);
h1 is the LCP element (no hero photo, §10 #4); logos hidden by data (W6); signed metrics only
(W1/W87); the sticky bar keeps Call/WhatsApp (W81) and the FAQ ask card its e-mail row (W83).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
