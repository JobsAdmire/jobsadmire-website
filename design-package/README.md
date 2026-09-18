# JobsAdmire website — design + copy package (English & Turkish)

Everything needed to build the JobsAdmire public website: 14 page designs, the full string
catalogue in English and Turkish, the two data feed contracts, and the business context.

No tooling, no review app, no server dependency. Open it, read it, build.

---

## Start here

1. Read this README end to end, then `docs/project-brief.md` for business context.
2. Serve `design/` over HTTP and click through all 14 pages in both languages.
3. Read `docs/crm-feed.md` — it is a contract, not a note.
4. Build the shared chrome (header, footer, mobile bottom bar) first — it is on every page.
5. Then pages in this order: Homepage → Hire Workers → Cost Calculator → the rest → the two
   CRM-fed pages last (they need live endpoints).

**Three things are deliberately not solved in the design and need real engineering:** form
handling (everything currently opens WhatsApp), the two CRM feeds, and production i18n.
Everything else is a port.

---

## About the design files

**The files in `design/` are design references created in HTML — prototypes showing intended look
and behaviour. They are not production code to copy directly.**

They are written as "Design Components" (`.dc.html`) and need a small runtime (`support.js`,
included) to render. They are an excellent visual and behavioural specification — open them,
click through them, read their inline styles for exact values — but their structure is not a
production architecture.

**Recreate these designs in the target codebase's own environment** — React, Vue, Next.js,
Laravel/Blade, WordPress, whatever the project uses — following its established patterns and
conventions. If no codebase exists yet, pick the framework that fits (a content site with a live
calculator and two JSON feeds suits Next.js or Astro well).

Do not ship the `.dc.html` files.

### Previewing

The pages reference `./support.js` and sibling scripts, so they need HTTP, not `file://`:

```
cd jobsadmire_website_package/design
python3 -m http.server 8080
# open http://localhost:8080/JobsAdmire%20Homepage%20v4.dc.html
```

Force a language with a query parameter: `?lang=tr` or `?lang=en`.

---

## Fidelity

**High-fidelity.** Final colours, typography, spacing, copy, interaction and responsive
behaviour. Every value below was read out of the design source, not estimated. Recreate the UI to
match; use the codebase's own primitives where they produce the same result.

---

## ⚠ Read this before measuring anything

The desktop layout is authored at 1.333× and scaled down in the browser:

```css
@media (min-width: 1101px) { html { zoom: 0.75; } }
```

So **every desktop pixel value in the source renders at 75% of its written size.** A `font-size:
16px` body paragraph is 12px on screen at 1400px wide. Mobile and tablet (≤1100px) are authored
1:1 and are not scaled.

Two valid ways to handle this:

1. **Keep the rule.** Port values verbatim and keep a single `zoom: 0.75` (or `transform: scale`)
   on the desktop breakpoint. Simplest, guarantees a pixel match.
2. **Normalise.** Multiply every desktop value by 0.75 as you port and drop the rule. Cleaner
   long-term; more work, easy to get subtly wrong.

Pick one and be consistent. Do not port values verbatim *and* drop the rule — the site will
render a third larger than intended.

---

## Pages

| # | Page | Route | Purpose |
|---|---|---|---|
| 1 | Homepage | `/` | Hero + lead form, candidate pool, cost calculator preview, 5-step process, seasonal demand, network, blog teaser |
| 2 | Hire Workers | `/hire-workers` | Main employer conversion page; detailed request form |
| 3 | Hiring Cost Calculator | `/hiring-cost-calculator` | Live payroll + one-off cost calculator |
| 4 | Partner With Us | `/partner-with-us` | For overseas agencies wanting to send candidates |
| 5 | Work Permit | `/work-permit` | Explainer: Turkish work permit process, law, timelines |
| 6 | About Us | `/about` | Company, licence, offices, team |
| 7 | Verify Representative | `/verify` | Employer-facing check: is this person really ours? (CRM-fed) |
| 8 | Join Our Team | `/join-our-team` | Recruiting for JobsAdmire itself |
| 9 | Contact Us | `/contact` | Offices, live local clock, message form |
| 10 | Available Workers | `/available-workers` | Live candidate pool with filters |
| 11 | Success Stories | `/success-stories` | Published permit approvals with redacted proof scans (CRM-fed) |
| 12 | Blog | `/blog` | Article index |
| 13 | Blog Article | `/blog/:slug` | Article template with FAQ block |
| 14 | CRM Login | `/crm-login` | Entry point to the internal Partner Portal |

Every page links to the others through the shared header and footer, so all 14 routes must exist
before launch (or the links need trimming).

---

## Shared chrome

The header and footer are **identical on every page** and must stay that way. They are the
single most-copied part of the design, and drift between pages was a recurring bug during design.

### Header (three stacked parts)

1. **Slim bar** (`.ja-slim`) — dark `#0e1a37`, padding `9px 20px`. Licence line
   ("İŞKUR Licensed · Permit No. 1730"), phone, email, and on mobile the language switcher.
   The licence text has a long desktop form and a short mobile form (`.ja-t-desk` / `.ja-t-mob`).
2. **Main nav** (`.ja-nav`) — white, padding `10px 14px` (`10px 12px` at ≤460px). Logo, page
   links, secondary CTA (hidden ≤1100px), primary CTA.
3. **Hamburger panel** — full-width dropdown on mobile; each row min-height `46px`.

Nav item order: Hire Workers · Available Workers · Work Permit · Cost Calculator · About ·
Success Stories · Blog & Guides · Verify Representative · Partner With Us · Join Our Team ·
Contact Us.

### Footer

Dark `#0e1a37`. Four link columns (accordions on mobile), office blocks, Telegram callout,
social row (Instagram, WhatsApp, Telegram, TikTok, LinkedIn), legal line.

### Mobile bottom bar

Fixed two-column strip (Call / WhatsApp) below 900px, `grid-template-columns: 1fr 1fr`, plus a
spacer element so it never covers page content.

---

## Design tokens

### Colour

| Role | Hex |
|---|---|
| Ink / primary text | `#16202e` |
| Brand blue | `#1899D5` |
| Brand blue, text-safe on light | `#1073a8` |
| Deep navy (dark sections, footer, slim bar) | `#0e1a37` |
| Sky accent (on dark) | `#7fd0f5` |
| Blue tint surface / border | `#e8f4fb` / `#bfdff0` |
| Pale surfaces | `#f4f9fc`, `#f7fbfe`, `#fbfdff` |
| Secondary text | `#556377` |
| Tertiary text | `#64748b` |
| Muted / placeholder | `#94a3b8` |
| Borders | `#dbe8f2`, `#e2ebf2`, `#eef4f8`, `#e6eef4` |
| Success | `#16a34a` · text `#12813c` · surface `#dcfce7` · border `#bbf7d0` |
| Warning | `#f59e0b` · text `#b45309` · surface `#fff7ed` · border `#fed7aa` |
| Danger | `#b91c1c` · surface `#fef2f2` · border `#fecaca` |

Two background colours carry the whole site: white and `#0e1a37`. Dark sections are used for
rhythm — roughly every third section. Do not add more.

### Typography

- **Display / headings:** `Archivo` (Google Fonts), weights 500 / 600 / 700 / 800
- **Body:** system stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`

| Element | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Hero h1 | `clamp(40px, 4.6vw, 66px)` | 800 | `-2.4px` | 1.0 |
| Section h2 | `clamp(28px, 3.2vw, 42px)` | 800 | `-1.6px` | 1.05 |
| Process h2 | `clamp(30px, 3.4vw, 46px)` | 800 | `-1.8px` | 1.02 |
| Card / timeline title | 18–19px | 800 | `-0.5px` | 1.1–1.3 |
| Stat number | 34px | 800 | `-1.4px` | 1 |
| Eyebrow label | 12px | 800 | `1.6px`, uppercase, `#1899D5` | — |
| Body large | 16–17.5px | 600 | — | 1.55–1.65 |
| Body small | 13–13.5px | 600 | — | 1.45–1.55 |
| Micro / badge | 11–12.5px | 700–800 | `0.3–1.1px` | — |

Body copy is weight 600, not 400 — the design leans heavy throughout. Headings are 800.

### Layout

- Content max width **1280px**, horizontal padding `48px` desktop / `20px` mobile
- Section vertical padding: `54px` top on mobile (`.ja-sec-top`), larger on desktop
- Grids use `display: grid` + `gap`, collapsing to `1fr` at `560px`

### Radius

`999px` (pills, buttons, chips) · `24px` (hero form) · `22px` · `20px` · `18px` · `16px` ·
`14px` · `12px` · `9px` (inputs)

### Shadow

- Hero form: `0 34px 80px rgba(3,10,26,0.5)`
- Floating social icon: `0 6px 18px rgba(22,60,90,0.10)`
- Card resting: `0 1px 3px rgba(22,32,46,0.04)`
- Card hover: `0 2px 10px rgba(22,32,46,0.06)`

### Breakpoints

| Query | What changes |
|---|---|
| `min-width: 1101px` | Desktop; `html { zoom: 0.75 }` |
| `max-width: 1100px` | Social rail, secondary nav CTA and long CTA hidden; WhatsApp FAB appears |
| `max-width: 900px` | Main mobile layout: section padding 20px, hamburger, bottom bar, accordions |
| `max-width: 700px` | Sub-page tuning (the sub-pages use 700 where the homepage uses 900) |
| `max-width: 560px` | 4-up grids → 1 column; hero stats → 2 columns |
| `max-width: 460px` | Tightest nav paddings |

Mobile hit targets are never below **44px**; nav and accordion rows use `min-height: 46px`.

### Motion

Reveal-on-scroll, staggered card entrances, a slow glow on the hero, an auto-scrolling candidate
pool. **Every animation has a `prefers-reduced-motion: reduce` override that disables it** —
carry these across; they are not optional polish.

---

## English & Turkish

### What you are given

`strings/` holds every string on every page, in both languages, with a stable id:

```
strings/
  messages.en.json        flat { id: "English text" }   — 3,505 entries
  messages.tr.json        flat { id: "Türkçe metin" }   — same ids
  all-strings-en-tr.csv   one row per string: id, page, route, section, legal, en, tr
  homepage.json           per-page files with the full metadata (see below)
  hireworkers.json
  calculator.json
  … one per page, 15 files
```

The per-page files carry the metadata the flat catalogues drop:

```json
{ "id": "home.001", "k": "navAbout", "sec": "Menü ve genel etiketler",
  "rev": "6iiw1a", "en": "About Us", "tr": "Hakkımızda" }
```

- `id` — `<page>.<nnn>`. **Stable:** it does not change when the wording changes. Use these
  directly as your message keys.
- `k` — the original source key in the page's dictionary, for tracing a string back to the design.
- `rev` — djb2 hash of the English source, base-36. If English changes, `rev` changes → that
  translation needs redoing. Same `rev` = translation still valid. **Keep this field**; it is how
  the site stays translated over time. Every row carries one, recomputed from the English in this
  package, so the whole catalogue starts from a clean baseline. The algorithm is four lines:

  ```js
  const rev = s => { let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return h.toString(36); };
  ```
- `legal` — present and `true` on **380 strings** that contain a legal or numeric claim (İŞKUR,
  law 4904, SGK, ₺ amounts, percentages, durations, guarantees). **These may never be edited
  without client approval.**
- `sec` — page section (labelled in Turkish), useful for grouping.

`docs/translation-process.md` is the full contract: how strings are generated, how revisions are
diffed, and how this maps onto a real CMS. Read it before touching copy.

### How the design does it (and what to build instead)

In the design, English is authored in the markup; Turkish comes from in-page dictionaries on
three pages (Homepage, Hire Workers, Cost Calculator) and from `design/ja-i18n.js` — a runtime
script that walks the DOM and swaps text nodes — on the other eleven.

**Do not port that approach.** It exists only because the design tool had no build step. Use the
framework's own i18n (next-intl, vue-i18n, Laravel translations…) with `messages.en.json` and
`messages.tr.json` as the catalogues.

Language choice persists in `localStorage` under `ja-lang`; a `?lang=` parameter overrides it.
That behaviour is worth keeping.

### Turkish rules that must survive the port

| Rule | EN | TR |
|---|---|---|
| Thousands | `38,944` | `38.944 ₺` |
| Percent | `21.75%` | `%21,75` — the sign leads |
| Decimal | `.` | `,` |

- **Never translated:** `İŞKUR`, `law No. 4904`, `SGK`, `JobsAdmire`, `Partner Portal`,
  `ChatAdmire`, the `JA-` ID prefix, `Tax No`.
- **App-store badge micro-copy** ("GET IT ON", "DOWNLOAD ON THE") stays English — Apple/Google
  brand guidelines.
- The language switcher shows each language in its own name: English · Türkçe.
- The company refers to itself as "JobsAdmire", never "we", in formal copy. Formal register
  throughout (Turkish "siz").
- Both languages keep `Türkiye`, never "Turkey".

### Six strings have an empty Turkish value — on purpose

`hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107`.

Each is a fragment of a sentence that wraps around a live number or a link, and Turkish word
order moves the words into the neighbouring fragment. For example:

| id | English | Turkish |
|---|---|---|
| `calc.041` | "Can you hire" | *(empty)* |
| `calc.042` | "?" | "işçi alabilir misiniz?" |

Rendered, both languages read correctly — English puts the verb before the number, Turkish after.
Do not "fix" these by copying the English in. If your i18n library treats an empty string as a
missing translation and falls back to English, mark them explicitly (`""` with a no-fallback flag,
or restructure that sentence as a single interpolated message — the cleaner option if you are
rewriting the markup anyway).

### Around 160 strings are identical in both languages

Also deliberate: brand names (`JobsAdmire`, `Telegram`), the licence chip (`İŞKUR · 1730`),
Turkish addresses, Turkish academic tiers on the permit-rule cards (`Ön lisans · Lisans`), and
the sample work-permit document on the Work Permit page, which is reproduced as the real Turkish
government document it is. These are not untranslated rows.

### A gotcha worth inheriting

HTML entities (`&amp;`, `&middot;`) are safe in markup and in `href` values, but **a JS string
renders verbatim** — `"Blog &amp; Guides"` in a dictionary prints the literal `&amp;` on screen.
This shipped as a real bug during design. Use the actual characters in data.

### French, Russian, Arabic

Out of scope for this build. Complete French and Russian translations exist and can be supplied
separately if the client wants them later — the `id` and `rev` scheme above is what makes that a
drop-in rather than a re-do. The design files in `design/` still carry FR/RU in their runtime
dictionary; ignore it, or strip the switcher down to two languages as you port.

Arabic was never built. It needs full RTL mirroring (layout, icons, arrows), which is real work
beyond copy. If it is on the roadmap, choose a framework with solid RTL support now.

---

## Copy status — read before launch

Turkish was reviewed line by line by a native speaker across all 14 pages, and 85 strings were
rewritten to the reviewer's wording. That work is **already applied** to everything in this
package — `strings/` and `design/` agree.

One caveat to carry into implementation. The Turkish review was spot-tested by planting 21
deliberate meaning errors (wrong numbers, reversed claims) and seeing how many came back flagged.
**Two were caught.** The reviewer reads Turkish for fluency and catches mismatched figures, but
was not systematically comparing each Turkish claim against its English source. All 21 planted
errors were corrected before this package was produced — the strings here are clean — but:

> Treat the Turkish as **fluent but not independently accuracy-verified.** Before launch, run one
> pass over the 380 `legal` strings and every string containing a number, price, duration,
> guarantee or who-does-what claim, comparing against the English side by side. That is a few
> hundred rows, not 3,505.

A content task for the client, not a blocker on implementation — but it should happen before the
site is public, because the claims are legal and commercial ones.

Two reviewer suggestions were deliberately **not** applied:

1. Homepage `nowLabel` — the reviewer asked to change "Şimdi:" (Now:) to "Bu Ay:" (This month:).
   The label sits on a live activity ticker and the English says "Now:", so the change would make
   the two languages claim different things. Confirm which is intended.
2. Contact page, site-visit block — the reviewer supplied a new heading and button label
   alongside the body copy. Only the body was replaced; adding a heading and a button is a layout
   change, not a string change.

---

## Data & integrations

### Two public CRM feeds

Success Stories and Verify Representative are **data-driven** — no code change when the CRM
updates. Both take a `feedUrl` setting; both fall back to bundled sample data and show a warning
badge if the endpoint is unreachable.

| Page | Endpoint (example) | Sample file |
|---|---|---|
| Success Stories | `https://crm.jobsadmire.com/api/public/permit-approvals` | `data/approvals.sample.json` |
| Verify Representative | `https://crm.jobsadmire.com/api/public/representatives` | `data/representatives.sample.json` |

Requirements for both: `GET`, no auth, JSON, CORS enabled for the production origin, and only
records the CRM has explicitly marked publishable.

**`docs/crm-feed.md` is the full API contract** — every field, its meaning, and the privacy
rules. Read it before implementing these two pages. The short version of the privacy rule:

> The page draws a watermark and black redaction boxes over approval scans, but **the original
> file is still downloadable from its URL.** Store and serve an already-redacted copy — flatten
> the boxes into the JPEG before upload. The page's boxes are a second layer, not the only one.

Redaction boxes are per-document and expressed in **percent** of image size. A box positioned for
page 1 does not cover the name on page 2.

Representatives: `level` decides the "may / may never" lists (only `founder` may sign contracts);
`status` drives the badge; a former representative **stays visible on purpose** so employers can
see the person is no longer authorised. Revoking in the CRM must take effect immediately — the
page has no cache.

### Forms — needs building

**Every form in the design is a front-end mock.** On submit it assembles a plain-text summary and
opens WhatsApp with it prefilled:

```js
window.open("https://wa.me/" + waNumber + "?text=" + encodeURIComponent(msg), "_blank");
```

Deliberate for a design with no backend. **Production needs real handling** for the homepage lead
form, the Hire Workers request form, Join Our Team, Contact Us and Partner With Us: server-side
validation, spam protection, persistence, a CRM record, and an autoresponder. Confirm the
endpoint and required fields with the client — they are not specified in the design.

Keep the WhatsApp path as a secondary CTA; it converts well for this audience.

### Cost calculator

Client-side, live, no network. It computes monthly payroll and one-off costs from headcount, role
and sector. Percentages and currency are computed at render time — which is exactly why they must
go through the locale formatter (see the table above); the authored copy beside them is already
localised, so an unformatted computed figure sits visibly wrong next to it.

The rates are **legal/numeric claims**. Do not change them; source them from one config object so
the client can update them in one place.

### Contact constants

| | |
|---|---|
| Phone | `+90 501 124 03 40` → `tel:+905011240340` |
| Email | `info@jobsadmire.com` |
| Telegram | `https://t.me/jobsadmire` |
| WhatsApp | `https://wa.me/<number>?text=<prefilled>` |
| Social | Instagram, TikTok, LinkedIn, all `/jobsadmire` |
| Licence | İŞKUR licensed, Permit No. 1730 |
| Head office | Antalya |

Put every one of these in a single config/constants module — they appear in the header, footer,
mobile bar, FAB and several page bodies, and they will change.

---

## State

Small and local; no global store needed.

| State | Where | Notes |
|---|---|---|
| `lang` | Every page | `localStorage["ja-lang"]`; `?lang=` param wins |
| Language hint dismissal | Every page | `localStorage["ja-lang-hint"] = "off"` — offers Turkish to `tr-*` browsers, once |
| Nav / hamburger open | Header | |
| Footer accordion open | Footer | Mobile only |
| Calculator inputs | Calculator, Homepage | Headcount, role, sector |
| Filter chips | Available Workers, Success Stories | |
| Proof slider index | Success Stories | `1 / N` counter per card |
| Search query | Verify Representative | Matches id, name, contact, city |
| Feed data + reachability | Success Stories, Verify | Fallback to sample + amber badge |

---

## Assets

| Asset | Notes |
|---|---|
| `assets/ja-mark.png` | JobsAdmire logo mark |
| Sourcing map | `design/source-map.js` draws the countries-we-source-from map on the Homepage and Hire Workers. Small and self-contained — read it for the country list and styling, then rebuild with whatever mapping approach your stack prefers. |
| Icons | **Inline SVG throughout**, 1.5–3.4 stroke width, `stroke-linecap/linejoin: round`, sized 11–22px. No icon font, no icon package. Port as inline SVG or move to the codebase's icon system — but keep the round caps and heavy strokes; they carry the visual identity. |
| Photography | **Not included.** The design uses drop-in placeholders (`image-slot.js`). Real photography for candidate cards, offices, team and blog headers must come from the client. |
| `Archivo` | Google Fonts. Self-host in production for performance and privacy. |

---

## Files in this package

```
design/                     the 14 page designs + the runtime they need
  JobsAdmire Homepage v4.dc.html
  Hire Workers.dc.html
  Hiring Cost Calculator.dc.html
  Partner With Us.dc.html
  Work Permit.dc.html
  About Us.dc.html
  Verify Representative.dc.html
  Join Our Team.dc.html
  Contact Us.dc.html
  Available Workers.dc.html
  Success Stories.dc.html
  Blog.dc.html
  Blog Article.dc.html
  CRM Login.dc.html
  support.js                design-component runtime (required to render)
  ja-i18n.js                runtime text swap + locale formatting (design only — do not port)
  source-map.js             the sourcing-countries map (Homepage, Hire Workers)
  image-slot.js             image placeholder component
  qr.js                     QR code generator (CRM Login)
  blog-posts.js             blog article data
  ja-mark.png

strings/                    every string, English + Turkish, 3,505 entries
  messages.en.json          flat id → text, ready to use as a message catalogue
  messages.tr.json          same ids
  all-strings-en-tr.csv     spreadsheet view: id, page, route, section, legal, en, tr
  <page>.json               15 per-page files with id / k / rev / legal / sec metadata

data/
  approvals.sample.json         Success Stories feed sample
  representatives.sample.json   Verify Representative feed sample

docs/
  crm-feed.md               full API contract for both CRM feeds — required reading
  translation-process.md    the i18n contract: ids, revisions, CMS mapping
  project-brief.md          business context: what JobsAdmire is, who the site is for

assets/
  ja-mark.png
```

Nothing here depends on a running service. The only external dependencies are the two CRM
endpoints, and both ship with sample data so the pages can be built and tested before the CRM is
ready.

---

## Open decisions (not blockers, but confirm before launch)

1. **The two held-back Turkish suggestions** — see "Copy status" above.
2. **Form endpoint and CRM fields** — see "Forms".
3. **French / Russian** — in or out for a later phase; the catalogues exist.
4. **Arabic** — in or out at all; it changes the framework decision.

---

## Quality bar the design was held to

For context on what "done" meant here, and what to re-check after implementation:

- All 14 pages fully translated, every string carrying a stable id and a source-revision hash
- Mobile layouts were built and measured separately from desktop, at real device widths, with
  desktop explicitly frozen
- Every animation has a reduced-motion override; every mobile hit target is ≥44px

An implementation is not done until it passes the same checks.
