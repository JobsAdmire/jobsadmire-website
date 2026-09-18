# Content model — JobsAdmire Website

Full rationale: plan D7, D8, D17. This doc describes the shape; `docs/ARCHITECTURE.md` describes how it's fetched and cached.

## Bundle shape (v1.0)

`contract/website-bundle.v1.ts` is the Zod schema (`BundleSchema`) both adapters validate against; `type Bundle = z.infer<typeof BundleSchema>`. One bundle per locale:

| Field             | Shape                                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contractVersion` | `'1.0'` (literal)                        | bumps to `'1.1'`/`'2.0'` per `contract/CONTRACT.md`'s procedure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `locale`          | `'tr' \| 'en'`                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `generatedAt`     | ISO datetime string                      | **a fixed sentinel in Phase A** (`2026-09-18T00:00:00.000Z`, written by `scripts/import-design-package.ts`) — never a live timestamp; `docs/OPERATING.md`'s site-health note is explicit that bundle age must never be derived from it                                                                                                                                                                                                                                                                                                               |
| `strings`         | `Record<id, string>`                     | one flat map per locale — the string catalogue below, keyed by `id`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `nav`             | `NavItem[]`                              | `{ group, order, labelId, href, external, visibleOn }`; `group` is one of `slimBarLeft \| slimBarRight \| desktopNav \| hamburger \| footerEmployers \| footerCompany \| footerContact \| mobileBottomBar \| socialRail` (schema-level enum) — **WP1's importer only ever emits `desktopNav`** (11 items, README nav order); the other eight groups exist in the schema for WP2's chrome work but are not yet populated, which is why `Footer.tsx` and `MobileBottomBar` currently hard-code their own route lists rather than reading a `nav` group |
| `settings`        | `Settings`                               | contact numbers, social/Telegram URLs, licence (permit/law-ref/tax no.), store links, portal host/paths, office map links, `analytics` (`ga4Id`/`gtmId`/`adsId`/`adsConversionLabel`/`consentMode` — all `null` in the WP1 bundle except `consentMode: true`), `turnstileSiteKey` (`null`)                                                                                                                                                                                                                                                           |
| `pages`           | `Record<pageKey, PageSeo>`               | `{ titleId, descriptionId, ogImage, canonical, robots, jsonLd[] }` — **`{}`** in the WP1 generated bundles; `buildMetadata` falls back to its per-call defaults until WP2 populates this                                                                                                                                                                                                                                                                                                                                                             |
| `collections`     | `Record<key, Record<string, unknown>[]>` | typed loosely (`z.record(z.unknown())` per row) until each collection is ported; **`{}`** in WP1 — which is exactly why the D23 fixture guard is a no-op today (`pool`/`stories`/`representatives` are empty arrays or absent keys); it starts mattering the moment a later task adds rows                                                                                                                                                                                                                                                           |
| `redirects`       | `Redirect[]`                             | `{ from, to, status: 301 \| 308 }` — schema exists for a future Ops-driven redirect source; **`[]`** in WP1, since this build's redirects come from `redirects/legacy.json` (`docs/redirects.md`), not the bundle                                                                                                                                                                                                                                                                                                                                    |

`npm run content:import` (`scripts/import-design-package.ts`) is the WP1 importer: it reads `design-package/strings/*.json` across the 15 page files and writes `src/content/local/{bundle.tr.json, bundle.en.json, catalogue.json}` — the `LOCAL` adapter's only data source. It is not run automatically; re-run it by hand whenever `design-package/strings/` changes.

## String catalogue

Every UI string is a row: `{ id, k, rev, sec, legal, en, tr }` (design-package `docs/translation-process.md` "Content IDs" section, which this repo inherits as its schema).

| Field       | Meaning                                                                                                                                                                                                                                               |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `<page>.<nnn>` for UI copy (design-package convention) or `sys.<name>` for copy the package doesn't carry (see below). **Stable** — never changes when wording changes. Use directly as the i18n message key.                                         |
| `k`         | Original source key in the package's page dictionary — traceability back to the design only, not used at runtime.                                                                                                                                     |
| `rev`       | djb2 hash (base-36) of the English source. Changes when the English changes → that translation needs redoing. Unchanged `rev` = translation still valid. Algorithm: `let h=5381; for (c of s) h=((h*33)^c.charCodeAt(0))>>>0; return h.toString(36)`. |
| `sec`       | Page section, in Turkish, for grouping in the review/editor UI.                                                                                                                                                                                       |
| `legal`     | `true` on 380 rows containing a legal or numeric claim (İŞKUR, law 4904, SGK, ₺ amounts, percentages, durations, guarantees). Locked behind `website:APPROVE` — never editable by a `marketing-manager`-role editor directly.                         |
| `en` / `tr` | The locale rows. In Phase B this becomes `WebsiteString` + `WebsiteString.Value` (one row per locale) rather than flat columns.                                                                                                                       |

### The `sys.*` range

The design package ships **zero** field-label, error-message, consent-banner, or language-hint copy — it's a pure content catalogue for a mocked, backend-less prototype. Every string this build needs that isn't in the package gets a new id in the reserved **`sys.*`** namespace. Never reuse a package id (`<page>.<nnn>`) for different copy, and never let `sys.*` ids collide with the package's own `<page>.<nnn>` pattern.

**`sys.*` is not a `t()`/`makeT` id.** It lives in `src/messages/{tr,en}.json` (next-intl message files) and is read via `getTranslations('sys')` (server) / `useTranslations('sys')` (client) — a different accessor from the bundle string map entirely. As shipped in WP1, both locale files carry exactly the same key set:

- **Chrome:** `skipToContent`, `languageName`, `home`, `nav.main`, `nav.close`, `marquee.pause`, `marquee.play`, `whatsapp.prefill`
- **Language hint:** `languageHint.body`, `languageHint.switch`, `languageHint.dismiss` — **English in both locale files on purpose**: this copy is read by a visitor whose browser is set to English while they're looking at the Turkish site, so it must not itself be Turkish
- **Consent:** `consent.title`, `consent.body`, `consent.accept`, `consent.reject`, `consent.policy`, `consent.manage`
- **Error/404 boundaries:** `notFoundTitle`, `notFoundBody`, `errorTitle`, `errorRetry`
- **Thank-you page:** `thankYou.title`, `thankYou.body`, `thankYou.home`, `thankYou.whatsapp`, `thankYou.forms.{hire,contact,partner,careers,newsletter}`

This is the entire namespace as of WP1. New UI copy the package doesn't carry gets a new key here, never a new `<page>.<nnn>`-shaped id — and, per the point above, `sys.nav.verify` was **not** created: the Verify-a-Representative nav label reuses the package's own `home.011` (see below).

### Chrome canonical ids (Ruling R15)

The design package repeats chrome copy (header, footer, slim bar, mobile bar) inside every page file; the site has one chrome, so it reads **one canonical id per string** instead of re-deriving it per page. By the package's own `k` (traceability key):

| Chrome element                | Canonical id            | `k`                                                                                   |
| ----------------------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| Nav → Verify a Representative | `home.011`              | `navVerify` — not an invented `sys.nav.verify`; the package already carries this copy |
| Licence chip, long form       | `hire.019`              | `slimLic` (same text as `calc.418`)                                                   |
| Licence chip, short form      | `calc.419`              | `licShort` ("İŞKUR · 1730")                                                           |
| Hamburger menu label          | `hire.239`              | `aMenu`                                                                               |
| App store badge — Google Play | `hire.240`              |                                                                                       |
| App store badge — App Store   | `hire.241`              |                                                                                       |
| Telegram footer link          | `home.202`              |                                                                                       |
| Footer columns / office rows  | `home.188`–`home.199`   |                                                                                       |
| Footer legal line             | `home.228`              |                                                                                       |
| Primary CTA (two-part label)  | `home.014` / `home.015` |                                                                                       |
| Language switcher label       | `home.016`              |                                                                                       |

Anything the package does not carry at all is `sys.*`, above — never a chrome-specific package id invented to fill the gap.

### Deliberately-empty Turkish fragments

Six ids ship with an intentionally empty `tr` value: `hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107`. Each is a sentence fragment that wraps around a live number or link; Turkish word order moves the words into a neighbouring fragment (example: `calc.041` "Can you hire" has no Turkish equivalent because Turkish puts the verb after the number, in `calc.042`'s "?"/"işçi alabilir misiniz?"). **The `t()` accessor must render an explicit empty string for these ids, never fall back to the English value.** This is a no-fallback flag per id, not a global "empty means missing" rule — a _different_ id with an accidentally-empty `tr` value is a real translation gap and should still surface as missing.

## Catalogue lints and the ratchet baseline (D17, D18)

`src/content/lint.ts` runs three checks over the imported catalogue (`src/content/lint.test.ts`):

- **`findParityViolations`** — an id's `en` and `tr` values must contain the same numeric tokens (thousands/decimal-normalised); skips ids with a deliberately-empty `tr`.
- **`findLeadingLiraViolations`** — `tr` must never write `₺` before the digits (D18: Turkish is trailing-symbol, `38.944 ₺`).
- **`findHardTypedMetrics`** — a metric value hard-typed into copy instead of coming from `RateConfig`/a placeholder (D17).

**Baseline, not a hard gate.** `src/content/lint-baseline.json` freezes the ids that violate parity (**17**) or leading-lira (**26**) as of import — pre-existing package content, not something this build introduced — so the test asserts "no _new_ violations," not "zero violations." `src/content/lint-exceptions.json` is **`{}`**: every baseline id was checked by hand during Task 7 and found to be a real, accepted divergence rather than a false positive worth suppressing (e.g. `calc.042`'s bare "?" has no numbers to compare against `calc.041`'s "Can you hire"; `home.086` repeats the same figures, `16000`/`12000`, in both languages with Turkish trailing the lira sign correctly). The exceptions file exists for a genuine future ambiguity, not as a dumping ground, and starts empty rather than pre-seeded with guesses. **WP6 prunes the baseline**: an id fixed in a later translation pass should be removed from `lint-baseline.json`, not left there as permanent cover — the ratchet only ever tightens.

Generated files (`src/content/local/*.json`, `lint-baseline.json`) are **Prettier-ignored** (`.prettierignore`) — they are machine output (`JSON.stringify(…, null, 1)`), and reformatting them on every import would be churn without changing their content.

### ~160 identical-in-both-languages strings

Brand names, the licence chip, Turkish addresses, academic tier labels (`Ön lisans · Lisans`), and the reproduced Turkish government permit-document sample. Not defects — do not "fix" by editing the Turkish.

## Collections

Typed, schema-driven lists behind the `WebsiteCollection`/`Item`/`Locale` model (Phase B): `faq`, `processStep`, `metric`, `sourceCountry`, `sector` (with an `Industry`→`sector` mapping to the CRM's taxonomy), `roleTrade`, `office`, `testimonial`, `partnerTrack`, `engagementType`, `seasonRow`, `permitType`, `documentItem`, `comparisonRow`, `warningItem`, `logo`, `portalFeature`, `formOptionSet`, `whatsappTemplate`, `emailTemplate`, `successStory` (cards). In Phase A these are read directly from the package's per-page JSON files under the same shape.

## Page records

One record per page/locale carrying SEO fields (title, description, OG), the page's block/section composition, and its publish state (draft → review → published, D8). In Phase A, "published" is implicit (the whole package is the content); the state machine becomes real in Phase B.

## Blog

**v1 — Markdown.** Written articles only; the package's 26-card index (`design-package/design/blog-posts.js`) ships with exactly **one** written body — the rest are index-only entries with no article to link to. `/blog` stays **out of primary nav** and is `410`/`noindex` until at least 6 Turkish bodies exist (plan §5, WP2). Blog posts are plain Markdown (`WebsiteBlogPost.body`), rendered server-side, no rich block editor.

**v1.1 — block model.** A structured block editor replaces Markdown, enabling richer article layouts (pull quotes, embedded FAQ blocks, image galleries) without a code change per template. Deferred per the scope ladder (D22) — descends before pool cards but after representatives if the budget/content stop rules trip.

## The `contract/` bundle (D7)

A **frozen directory**, `contract/`, containing the Zod schema `website-bundle.v1.ts` (see Bundle shape above) and its golden fixture `website-bundle.v1.fixture.json` — not a separate `.schema.json` file. It is the single source of truth for the shape of every Ops → Website payload (bundle today; forms request/response and preview are added as those land). Frozen as of Task 5; vendored into `jobsadmire-operations` in WP3c; both repos pin to it by a **hash spec** (`contract/contract.test.ts`, SHA-256 over the Prettier-formatted file, pinned value and the prettier-ignore requirement in `docs/ARCHITECTURE.md` § Content adapter) — a spec that fails the build in whichever repo's copy has drifted from the frozen hash. `contractVersion` is carried in every bundle so a future breaking change becomes `v2` rather than an in-place mutation.

This is why `docs/INTEGRATIONS.md` marks every payload shape as "contract v1, see `contract/` once frozen in WP1" rather than inlining a shape here — inlining would create a second copy that drifts, which is exactly the failure the frozen directory + hash spec exists to prevent (plan §13 premortem: "Two contracts drift between repos").

## Import and round-trip

**WP1's importer reads the package's per-page JSON files directly** (`design-package/strings/*.json`, the 15 files in `scripts/import-design-package.ts`'s `PAGE_FILES` list) — not the CSV. `design-package/strings/all-strings-en-tr.csv` (3,505 rows: id, page, route, section, legal, en, tr) is the same catalogue in flat, reviewable form; it is the WP6/Phase B Ops import source and the reviewer-sheet round-trip format (design-package `docs/translation-process.md`), not what WP1's script consumes. Both describe the same 3,505 ids, so the join below applies to whichever form is in play: diffed **by id** against whatever's already in Ops — same id + same `rev` + different target = a target-only edit (review, not re-translate); same id + different `rev` = English changed, re-translate; id present only in the new file = added string; id present only in the old = removed. The reviewer-sheet CSV export round-trips through the same id/`rev` join, so a human review pass never has to re-key anything.
