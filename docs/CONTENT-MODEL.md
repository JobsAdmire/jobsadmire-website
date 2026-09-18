# Content model — JobsAdmire Website

Full rationale: plan D7, D8, D17. This doc describes the shape; `docs/ARCHITECTURE.md` describes how it's fetched and cached.

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

The design package ships **zero** field-label, error-message, consent-banner, or language-hint copy — it's a pure content catalogue for a mocked, backend-less prototype. Every string this build needs that isn't in the package (form validation errors, the consent banner, the language hint, `/tesekkurler` chrome, site-health-adjacent visitor-facing text) gets a new id in the reserved **`sys.*`** namespace, e.g. `sys.form.error.required`, `sys.consent.banner.title`. Never reuse a package id (`<page>.<nnn>`) for different copy, and never let `sys.*` ids collide with the package's own `<page>.<nnn>` pattern.

### Deliberately-empty Turkish fragments

Six ids ship with an intentionally empty `tr` value: `hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107`. Each is a sentence fragment that wraps around a live number or link; Turkish word order moves the words into a neighbouring fragment (example: `calc.041` "Can you hire" has no Turkish equivalent because Turkish puts the verb after the number, in `calc.042`'s "?"/"işçi alabilir misiniz?"). **The `t()` accessor must render an explicit empty string for these ids, never fall back to the English value.** This is a no-fallback flag per id, not a global "empty means missing" rule — a _different_ id with an accidentally-empty `tr` value is a real translation gap and should still surface as missing.

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

A **frozen directory**, `contract/`, containing `website-bundle.v1.schema.json` and a golden fixture. It is the single source of truth for the shape of every Ops → Website payload (bundle, forms request/response, preview). Frozen at the end of WP1; vendored into `jobsadmire-operations` in WP3c; both repos pin to it by a **hash spec** — a spec that fails the build in whichever repo's copy has drifted from the frozen hash. `contractVersion` is carried in every bundle response so a future breaking change becomes `v2` rather than an in-place mutation.

This is why `docs/INTEGRATIONS.md` marks every payload shape as "contract v1, see `contract/` once frozen in WP1" rather than inlining a shape here — inlining would create a second copy that drifts, which is exactly the failure the frozen directory + hash spec exists to prevent (plan §13 premortem: "Two contracts drift between repos").

## Import and round-trip

The package's `all-strings-en-tr.csv` (3,505 rows: id, page, route, section, legal, en, tr) is the WP1/WP6 import source. Import is diffed **by id** against whatever's already in Ops: same id + same `rev` + different target = a target-only edit (review, not re-translate); same id + different `rev` = English changed, re-translate; id present only in the new file = added string; id present only in the old = removed. The reviewer-sheet CSV export (design-package `docs/translation-process.md`) round-trips through the same id/`rev` join, so a human review pass never has to re-key anything.
