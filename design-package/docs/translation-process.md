# Translation & review process

How every page on this site gets translated and reviewed. Same format for every language — Turkish first, then Russian / Arabic / anything later.

## Files per page + language

- `review-<page>-<lang>.json` — the string pairs, generated FROM the page source (never hand-edited)
  e.g. `review-homepage-tr.json`
- `Reviewer Sheet v2.dc.html` — the reviewer-facing sheet. All 14 pages and TR/FR/RU live in one
  file: `CR_PAGES` lists the pages, the language tabs switch the target column, and the whole
  interface follows the language being reviewed. Served next to `api.php` it syncs progress to the
  server (per-reviewer password login); opened as a plain file it falls back to localStorage.

To make a new sheet: add an entry to `CR_PAGES` pointing at the new JSON. Nothing else changes.

## Row shape in the JSON

`[{ "k": "<key or 'data'/'faq-q'/'faq-a'>", "en": "<source English>", "tr": "<target text>", "sec": "<page section name, in the target language>", "legal": true|false }]`

`sec` groups the sheet into page sections (Hero, Talep formu, Maliyet hesaplama, …) so the reviewer works section by section and each section shows its own progress.
`legal` flags rows containing İŞKUR / 4904 / SGK / ₺ / percentages / durations / guarantee terms — the sheet marks them "hukuki — dikkat" and the reviewer may not change them alone.

The target column is always the key `tr` regardless of language (keeps the sheet code identical); the sheet labels it with `targetLang`.

## How the strings live in a page

Each page DC holds:
1. `HP_T = { en: {...}, tr: {...} }` — UI copy, one key per string
2. `TRX = { "<English data string>": "<target>" }` — strings that live in data arrays (job titles, season notes, approvals wall, blog cards, read times)
3. FAQ arrays behind `lang === "TR" ? [...] : [...]`
4. Helpers that must be localised too: `money()` (₺ position + thousands separator), `MONTHS`, relative times ("3 gün önce"), headcount ("N işçi")

Regenerate the JSON after ANY copy change (parse en/tr blocks + TRX + FAQ arrays).

## Rules that apply to every language

- Company refers to itself by name: **JobsAdmire** (never "we/biz" in formal copy)
- Formal register (TR: "siz"; RU: "вы"; AR: formal MSA)
- Never translate: İŞKUR, law No. 4904, SGK, JobsAdmire, Partner Portal, ChatAdmire, JA- ID prefix, Tax No
- Number/currency format follows the target locale (TR: 38.944 ₺ · RU: 38 944 ₺ · AR: keep Latin digits + ₺ per client preference)
- Store badge micro-copy ("GET IT ON", "DOWNLOAD ON THE") stays English — Apple/Google brand guidelines
- Language switcher shows each language in its own name (English / Türkçe / Русский / العربية)
- Arabic requires full RTL mirroring (layout, icons, arrows) — decided with the client, extra work beyond copy

## Reviewer workflow

1. Reviewer gets the sheet (link or printed PDF)
2. They write **row number + corrected text** only — no full rewrites
3. Additions go in the "NEW" block: section name + the sentence, target language only
4. Their list comes back to Claude → applied to the page → JSON + sheet regenerated
5. Legal/《numbers》claims (permit duration, costs, guarantee terms) are never changed by the reviewer alone — client confirms

## Automated FR / RU audit

`QA FR-RU Audit.dc.html` loads every page in a hidden frame at `?lang=fr` and `?lang=ru` — the
same review-link mode a reviewer uses — and reports seven classes of defect. Run it after any
copy or dictionary change; it takes about six minutes for 28 passes.

What it checks, and why each class exists:

- **untranslated** — a node carrying two or more words that exist in neither French nor Russian
- **RU numeral / noun disagreement** — a count followed by a nominative noun ("18 работники"),
  which is what a naive number + phrase join produces
- **FR narrow no-break space** — French sets U+202F before `? ! ; :`; a plain space lets the
  mark wrap onto its own line
- **RU Latin leftovers** — a mostly-Cyrillic sentence still carrying an English word
- **FR term inconsistency** — agreed wording drifting between pages
- **number / currency format** — comma-grouped thousands surviving into a locale that groups
  with `.` or a narrow space, and percentages left with a dot decimal or no space before `%`
- **blog editorial** — article titles and excerpts, matched against `blog-posts.js` and bucketed
  separately so a held-out decision never masks a real defect

Two traps the harness itself had to solve, worth knowing before editing it:

- `\s` in JavaScript matches U+202F and U+00A0, so normalising whitespace with `\s+` destroys
  the very French spacing being audited. Collapse `[ \t\n\r\f\v]+` instead.
- `JA_I18N.apply()` cannot be called twice to read back `missing[]`: the first swap leaves the
  translated text in the per-node original cache, so the second pass reports French as an
  untranslated key. Detect leftovers from the DOM, never by re-applying.

### Findings from the first full run (Aug 2026)

Fixed:

- `frSpacing()` refused to insert the no-break space when the character before the colon was a
  digit ("tarifs 2026 : salaire minimum"). The `(?!\d)` lookahead already guards ratios and
  times, so the left-hand digit guard was removed — 9 nodes across Home, Calculator and Permit.
- `localiseAmounts()` only grouped figures carrying a currency symbol, so a bare count stayed
  comma-grouped ("1,240"). Bare thousands are now grouped with the target separator.
- Percentages were localised for Turkish only. The calculator computes them live, so they
  reached French and Russian in English form ("21.75%") while the authored copy in the same
  sentence beside them already read "21,75 %". Both locales now get a comma decimal and a
  no-break space before the sign — narrow (U+202F) in French, ordinary (U+00A0) in Russian —
  and Turkish keeps the leading sign. The rule is idempotent in all three.
- Literal HTML entities sat inside JS strings on Hire Workers (`navBlog: "Blog &amp; Guides"`,
  `footOfficeAntalya: "Antalya &middot; Head office"` in both the EN and TR tables). React
  prints a JS string verbatim, so these rendered as visible `&amp;` / `&middot;` on every
  language. Entities are safe in template markup and in `href` values — only JS strings break.
- Four strings had no dictionary entry: the Available Workers pool counter ("ready now"), the
  Contact Us office clock (composed from two live times, now a `SENTENCES` shape), and the
  Blog Article FAQ block (4 question/answer pairs).

Verified correct, deliberately left alone:

- Turkish official terms glossed in Russian — `Özel İstihdam Bürosu (частное агентство
  занятости)`, `e-Muafiyet`, `denklik`, `KOSGEB`, `teşvikler`, `nitelikli eleman`
- borrowings standard in Russian business copy — `white-label`, `Push-уведомление`, `e-mail`
- `Türkiye` as the endonym (later reversed for French and Russian — see "Endonym decision,
  reversed" below)
- `sourcing` in French — standard French HR vocabulary, not an anglicism to replace

### Endonym decision, reversed (Aug 2026)

The first audit left `Türkiye` in French and Russian, reasoning from the English source. The
client's call was the opposite: each language uses what its own speakers say. Three values per
language, and in Russian each one sits in a different grammatical case — a flat find-and-replace
would have produced exactly the numeral/noun class of defect the audit exists to catch.

Russian:

- `по всей Türkiye` → `по всей Турции` (dative after `по всей`)
- the country-list entry `Türkiye` → `Турция` (nominative, alongside `Непал`, `Гана`, `Шри-Ланка`)
- `Республика Türkiye` → `Турецкая Республика` (the official Russian name of the state; not
  `Республика Турция`, which is a literal translation nobody writes)

French:

- `dans toute la Türkiye` → `dans toute la Turquie`
- the country-list entry `Türkiye` → `Turquie`
- `République de Türkiye` → `République de Turquie`

Both languages already read `Turquie` / `Турция` everywhere else — these three were the only
holdouts in each, which is why they read as inconsistencies rather than as a choice. Turkish
keeps `Türkiye` and `Türkiye Cumhuriyeti`; English keeps `Türkiye`.

Russian plural handling came out clean: zero numeral/noun disagreements, because every counted
phrase already routes through `ruPlural()` in `PATTERNS` or `SENTENCES`.

## Adding a new language to a page

1. Add a `<code>` block to `HP_T` (same keys), extend `TRX`, add the FAQ array branch
2. Add the locale to `LANGS` and to `money()` / `MONTHS` / relative-time helpers
3. Generate `review-<page>-<lang>.json`, point a sheet at it
4. Default language and the "view this page in X" hint logic live in the page's `componentDidMount` + `langHint`

## Content IDs (the CMS foundation)

Every string carries a permanent id and a revision hash:

`{ "id": "home.heroBadge", "rev": "1kf3xq", "sec": "…", "legal": false, "en": "…", "tr": "…" }`

- `id` — `<page>.<key>` for UI copy, `<page>.data.<slug-of-english>` for data-array strings, `<page>.faq.<n>.q|a` for FAQ. Stable across edits: the id does NOT change when the wording changes.
- `rev` — djb2 hash of the English source. If the English changes, `rev` changes → that string needs re-translation and re-review. Unchanged `rev` = translation still valid.
- Row numbers in the sheet are positional and may shift; **ids never do**. Always refer to ids in tooling, numbers only in human conversation.

### Diffing two generations (add / remove / change tracking)

Regenerate the JSON, then compare against the previous file by id:
- id present in new, missing in old → **added string** (needs translation)
- id in old, missing in new → **removed string** (copy deleted from the page)
- same id, different `rev` → **English changed** (re-translate + re-review)
- same id, same `rev`, different target → target was edited (review only)

Keep the previous JSON as `history/review-<page>-<lang>-<date>.json` before overwriting, so this diff is always possible.

### When a real CMS arrives

The id is the join key. A CMS row becomes `{ id, page, section, legal, source_en, target_<lang>, rev, status, reviewed_by, reviewed_at }` — exactly the columns the review sheet already produces, so the sheet's CSV can be imported directly. Nothing about the page has to be restructured: `HP_T` keys map 1:1 to `home.<key>` ids.
