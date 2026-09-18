# JobsAdmire website — project brief

*Context document. Paste or upload this to bring an assistant up to speed on the project
before asking questions about it. Everything below is the current state as of August 2026.*

---

## What the business is

JobsAdmire is a Turkish international recruitment agency, licensed by İŞKUR (the Turkish
Employment Agency) under Private Employment Agency Permit No. 1730, operating under labour law
No. 4904. Head office in Antalya, Türkiye; a sourcing office in Karachi, Pakistan.

What it actually does: Turkish employers (hotels, factories, farms, construction, logistics)
cannot fill jobs locally. JobsAdmire sources vetted workers from 13+ countries — Pakistan,
Uzbekistan, Nepal, India, Kyrgyzstan, the Philippines and others — and handles the entire Turkish
work-permit process end to end. The employer pays no upfront fee. Typical placement takes 6–8
weeks from abroad, 4–6 weeks if the worker is already in Türkiye.

Two audiences the website serves:
1. **Turkish employers** who need workers — the main conversion path.
2. **Overseas partners** — recruitment agencies, sourcing agents and training institutes who
   supply candidates.

There is also a third, quieter audience: workers themselves, who are deliberately *not* sold to
directly (placement happens through verified partners abroad, never by direct application), plus
employers checking whether a person claiming to represent JobsAdmire actually does.

## What exists today

A finished, copy-reviewed design for a 14-page website in four languages. It is a **design, not a
deployed site** — built in HTML as a high-fidelity prototype, now handed to a developer to rebuild
in a real stack.

| Page | Route | Purpose |
|---|---|---|
| Homepage | `/` | Hero + lead form, candidate pool, cost calculator preview, 5-step process, seasonal demand, network, blog teaser |
| Hire Workers | `/hire-workers` | Main employer conversion page, detailed request form |
| Hiring Cost Calculator | `/hiring-cost-calculator` | Live payroll + one-off cost calculator |
| Partner With Us | `/partner-with-us` | For overseas agencies sending candidates |
| Work Permit | `/work-permit` | Explainer: the Turkish permit process, law, timelines |
| About Us | `/about` | Company, licence, offices, team |
| Verify Representative | `/verify` | Employer check: is this person really ours? |
| Join Our Team | `/join-our-team` | Recruiting for JobsAdmire itself |
| Contact Us | `/contact` | Offices, live local clock, message form |
| Available Workers | `/available-workers` | Live candidate pool with filters |
| Success Stories | `/success-stories` | Real permit approvals with redacted proof scans |
| Blog | `/blog` | Article index |
| Blog Article | `/blog/:slug` | Article template with FAQ block |
| CRM Login | `/crm-login` | Entry to the internal Partner Portal |

## Visual design

Deliberately restrained: **two background colours carry the whole site** — white and deep navy
`#0e1a37`. Dark sections appear roughly every third section for rhythm.

- **Ink / text:** `#16202e` · **Brand blue:** `#1899D5` · **Sky accent on dark:** `#7fd0f5`
- **Headings:** Archivo, weight 800, tight negative letter-spacing (hero h1 at `-2.4px`)
- **Body:** system sans, **weight 600** — the design leans heavy throughout, not 400
- Pills (`999px`) for every button and chip; card radii 14–24px
- Icons are **inline SVG only** — no icon font, no icon library. Heavy strokes, round caps.
- Content max width 1280px; every animation has a `prefers-reduced-motion` off switch

**One important quirk:** desktop is authored at 1.333× and scaled down with
`@media (min-width: 1101px) { html { zoom: 0.75 } }`. So every desktop pixel value in the source
renders at 75% of its written size. Mobile (≤1100px) is 1:1. Anyone reading the source and
measuring values will be a third off unless they know this.

Breakpoints: 1101+ (desktop), 1100, 900, 700 (sub-pages), 560, 460. Mobile hit targets never
below 44px.

## The four-language system

English, Turkish, French, Russian. Arabic is planned but not built (it needs full RTL mirroring,
which is real work beyond copy).

How the prototype does it — **and this part is deliberately temporary**: English is the source of
truth in the markup. Turkish lives in a parallel in-page dictionary. French and Russian are
applied at runtime by a script that walks the DOM and swaps text nodes, keyed on the English
source string. This exists because the design tool has no build step; production should use the
framework's own i18n with real message catalogues instead.

The catalogues already exist as JSON — every string, every page, all four languages, with a
stable id and a revision hash of the English source. If the English changes, the hash changes,
which flags that translation as needing redoing. Three of the fourteen files carry the full id
scheme; eleven still need ids generated.

**Locale rules that are non-negotiable:**

| | Turkish | French | Russian |
|---|---|---|---|
| Thousands | `38.944 ₺` | `38 944 ₺` | `38 944 ₺` |
| Percent | `%21,75` (sign leads) | `21,75 %` | `21,75 %` |

- French needs a **narrow no-break space (U+202F)** before `? ! ; :` and inside guillemets —
  a plain space lets the punctuation wrap onto its own line. Ratios (`5:1`), times (`10:00`) and
  URLs are excluded.
- Russian needs **real plural forms** (1 / 2–4 / 5+) for counted phrases, not `n + " " + noun`.
- **Never translated:** İŞKUR, law No. 4904, SGK, JobsAdmire, Partner Portal, ChatAdmire, the
  `JA-` ID prefix, Tax No.
- App-store badge micro-copy ("GET IT ON", "DOWNLOAD ON THE") stays English — Apple/Google rules.
- The company always calls itself "JobsAdmire", never "we", in formal copy. Formal register
  throughout (Turkish "siz", Russian "вы").

## Data and integrations

**Two pages are live-data driven.** Success Stories and Verify Representative each fetch one
public JSON endpoint from the company CRM, so no code changes when records are added:

- Success Stories → published permit approvals: sector, roles, headcount, date, place, source
  countries, and scanned approval documents
- Verify Representative → the list of authorised representatives, searchable by ID, name, phone
  or city

Both fall back to bundled sample data and show a warning badge if the endpoint is unreachable.
**Whether that CRM API exists yet is an open question** — the URLs in the design are placeholders.

There is a real privacy constraint on Success Stories. The page draws a watermark and black
redaction boxes over the approval scans, but the original image file is still downloadable from
its URL. So the CRM must store and serve an **already-redacted copy** — the boxes flattened into
the JPEG before upload. The page's boxes are a second layer of safety, not the only one. Redaction
boxes are per-document, in percent of image size, because a box positioned for page 1 does not
cover the name on page 2.

For representatives, `level` decides what the person may and may not do (only a founder may sign
contracts), and a *former* representative deliberately stays visible with a red badge — employers
need to see that the person is no longer authorised.

**Forms have no backend yet.** Every form in the design assembles a plain-text summary and opens
WhatsApp with it prefilled. That was deliberate for a design with no server, but production needs
real handling: validation, spam protection, persistence, a CRM record, an autoresponder. The
endpoint and required fields are not yet decided.

The cost calculator is entirely client-side and computes live. Its rates are legal/numeric claims
and must be sourced from one config object so they can be updated in one place each January.

## How the copy was translated and reviewed

Worth knowing because it explains why the copy is trusted:

- Strings are generated *from* the page source into per-page JSON, never hand-edited in isolation
- A reviewer-facing sheet presents each string side by side (English vs target), grouped by page
  section, with keyboard-driven approve / needs-fix / question marking, and exports a CSV
- Rows containing legal or numeric claims (İŞKUR, law 4904, SGK, ₺ amounts, percentages,
  durations, guarantees) are flagged, and a reviewer may not change them alone — the client
  confirms
- An automated audit loads every page in French and Russian and checks seven defect classes:
  untranslated nodes, Russian numeral/noun disagreement, missing French no-break spaces, Latin
  leftovers inside Cyrillic, term inconsistency across pages, wrong number/currency format, and
  blog editorial copy
- That audit found and fixed four real bugs, including HTML entities sitting inside JS strings
  (which render as literal `&amp;` on screen) and percentages that were localised for Turkish
  only while the authored copy beside them was already localised

Current state: all 14 pages fully translated in Turkish, French and Russian. 2,742 dictionary
keys verified. Non-editorial defects: zero.

## Decisions already made

Listing these so they don't get re-opened:

- **Endonym.** Russian uses `Турция` / `Турции` / `Турецкая Республика`, declined per grammatical
  context. French uses `Turquie`. Turkish and English keep `Türkiye`. (Earlier the design kept
  `Türkiye` everywhere, reasoning from the English source; the client reversed that — each
  language uses what its own speakers say.)
- **Blog editorial copy stays English in French and Russian.** 32 article titles and excerpts.
  Deliberate, not an oversight.
- **Workers are not sold to directly.** Placement runs through verified overseas partners; the
  careers page is only for JobsAdmire's own staff roles.
- **Former representatives stay published** with a revoked badge, on purpose.
- **Two background colours only.** Resist adding more.

## What is open

1. **Stack.** Not chosen. A content site with a live calculator and two JSON feeds; the design is
   stack-agnostic.
2. **Form endpoint and fields.** Blocks the forms.
3. **Does the CRM API exist?** If not, building those two endpoints is a separate piece of work.
4. **Photography.** Not included — the design uses placeholders. Candidate cards, offices, team
   and blog headers all need real images from the client. Blocks launch, not development.
5. **Arabic** — in or out for v1.
6. **String ids for 11 of the 14 string files** — mechanical, but should be done before i18n keys
   are wired.

## Constraints worth knowing before suggesting anything

- The header and footer are **identical on every page** and must stay that way; drift between
  pages was a recurring bug during design.
- Mobile layouts were built and measured separately from desktop, with desktop explicitly frozen.
  Any change that touches desktop needs a deliberate decision.
- Legal and numeric claims (permit durations, costs, guarantee terms, the 5:1 rule, minimum-wage
  multiples) are not copy — they are compliance statements. They change only with client sign-off.
- İŞKUR licence details and the permit number appear in the header, footer and several page
  bodies. They belong in one config, not scattered.
