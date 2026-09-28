### Task 7: Contact — `/iletisim` · `/en/contact`

**Why this task exists.** The route is the site's contact page (design-package page 9, `design-package/design/Contact Us.dc.html`, strings `design-package/strings/contact.json`, ids `contact.001`–`contact.228`). No page exists yet: `/contact` is listed in `UNBUILT_PATHNAMES` and answers 404 through the `[...rest]` catch-all, while the header's CTA on this route already points at `#message` (W17). The design is a WhatsApp-only mock: every form opens `wa.me`, the live clocks tick in a 60 s `setInterval`, the QR is fetched from `api.qrserver.com`, the JSON-LD is injected after mount, and the callback/visit widgets collect no name, e-mail or consent. This task ports it onto the WP2a foundation: the live-status pills as client islands over the `offices` collection's hours (R18 — no door), the topic-picker enquiry → form key `contact` (`topic` catalog v1.1 enum + `iAm` + optional v1.1 `city`, W3/W16), the callback widget → `callback` (adds `name` + consent), book-a-visit → `visit` (adds name/e-mail/phone + consent), the local QR rendered on the server (`QrCode` → `qrSvg`, W14), the FAQ block, a `ContactPage` JSON-LD node built from data, and the two office cards whose contact rows fire `office_card` clicks (W12). Every number is a metric or an `offices` row (W1/D17), every string a package id through `makeTf` or a `sys.contact.*` key (W9/W23), every contact anchor fires its click event with a placement (W12).

**Where and in what order.** Every path is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` (HEAD ≥ `bc708a3`) — never the shared checkout `…/jobsadmire-website` (it is on `main`). Never push, never `git stash`, never amend/squash/rebase an existing commit (W118). Execution order (W99): T1 → T13 → T2 → T3 → T4 → T5 → T6 → **T7** → T8 …: when this task starts, T1 has created the shared doc shapes (W98: the `## Pages` table in `docs/SEO.md`, `### Page instrumentation (WP2b)` in `docs/ANALYTICS.md`, the per-page `sys.*` bullet list at the end of `### Adding copy (W9, W23, W54)` in `docs/CONTENT-MODEL.md`, the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`) and `e2e/pages/`; T13 has shipped `/privacy` (`/gizlilik` — the consent link target). `/available-workers` (the Karachi card's link) is T8's and still 404s when this task lands — the launch sweep lists it until T8 (by design, W152). WP2a is fully built and reviewed; where this text and the code disagree, **the code wins** — every import below was checked against `src/**` at `bc708a3`.

**Memory rule (owner, binding for every step).** One heavy job at a time. The per-commit verify is exactly
`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`
(never `npm run verify`, `npm test` or `npm run e2e`; `npm run format` is `prettier --check .`, so run `npx prettier --write <the files you touched>` first). The task ends with ONE proof session (W126, Cycle 6): one `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`, one `npm run start`, one `E2E_BASE_URL=http://localhost:3000 npm run gate`, `npm run js-size` and the launch anchor check, then the server is killed and no stray process is left. Playwright runs only inside that session (the page spec is written in Cycle 5 and executes there). This page is not a D27 pixel page (the four are T1, T2, T3, T12) — it gets the Fable side-by-side review, so no `npm run pixel`. Commits are conventional, cite their rulings and end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**Route facts (verified at `bc708a3` — read before touching anything).**
- Internal key `/contact` → TR `/iletisim`, EN `/en/contact` (`src/i18n/routing.ts` `pathnames`); the design's canonical `/contact-us` is already a 301 in `redirects/rules.json`. Private folders (`_lib`, `_components`, `_sections`, `__tests__`) never become routes (`unbuilt.test.ts` skips `_`-prefixed folders).
- Page record (both bundles): `bundle.pages.contact = { titleId: '', descriptionId: '', ogImage: null, canonical: null, robots: 'index', jsonLd: ['breadcrumb', 'faq'] }` → `buildMetadata` takes the page's `sys.seo.contact.{title,description}` (W23/W38; this task adds them). OG image `/og/{locale}/contact.png` — its title is `sys.seo.contact.title`, its subline `sys.seo.ogTagline` (CDN-cached, W123).
- `CTA_BY_PATHNAME['/contact']` (`src/design/chrome/ctas.ts`) = primary `contact.015` + tail `contact.016` → `{ pathname: '/contact', hash: '#message' }` (rendered `href="/iletisim#message"` / `"/en/contact#message"`), secondary `home.002` → `/hire-workers`. **This page must render `id="message"`** (W17/W152/W158: `gate:launch`'s anchor sweep prints `CTA_BY_PATHNAME['/contact'].primary (/contact#message): <locale> <path> → missing id="message" …` until this task lands). No edit to `ctas.ts` (W121).
- `src/lib/seo/routes.ts` `UNBUILT_PATHNAMES` contains `'/contact',` — this task deletes that line in the commit that adds `page.tsx` (W20; `src/lib/seo/unbuilt.test.ts` fails in either direction otherwise). `e2e/routes.ts` `GATE_ROUTE_TABLE` has no contact row — this task inserts the two locale paths (W21) and nowhere else.
- Settings (LOCAL bundles): `phone '+905011240340'`, `phoneDisplay '+90 501 124 03 40'`, `partnershipsPhone '+905533832549'` (the contract types it `string | null` — the Agencies card renders only when it is set), `email 'info@jobsadmire.com'`, `whatsappNumber '905011240340'`, `siteUrl 'https://www.jobsadmire.com'`, `turnstileSiteKey null` (overlaid from `NEXT_PUBLIC_TURNSTILE_SITE_KEY` only where set).
- `offices` collection (`getOffice(bundle, key)` — throws in every env when a row is missing): `antalya` — `kind 'hq'`, `cityId contact.096`, `labelId contact.099`, `addressId contact.133`, `addressLine2Id contact.134`, `hoursId contact.100` ("Mon–Fri · 09:00–18:00 (TRT)"), `phone '+905011240340'`, `whatsapp '905011240340'`, `hours { tz 'Europe/Istanbul', days [1,2,3,4,5], open '09:00', close '18:00' }`; `karachi` — `kind 'sourcing'`, `cityId contact.097`, `labelId contact.104`, `addressId contact.105`, `addressLine2Id contact.103`, `hoursId contact.106` ("Mon–Sat · 10:00–19:00 (PKT)"), the same phone/WhatsApp/e-mail, `hours { tz 'Asia/Karachi', days [1,2,3,4,5,6], open '10:00', close '19:00' }` — `days` are JS `getDay()` 0–6 (W43). Neither zone has DST.
- Metrics (`metricValues`): `replySlaHours '4'`, `homepageReplyHours '24'`. The importer re-authored `contact.040` ("Reply within ~{replySlaHours} business hours") and `contact.193` ("Written numbers within {homepageReplyHours} hours") — every package string goes through `makeTf` (D17). `contact.054`'s "15 minutes" and `contact.095`'s "3,700 km" are package copy, rendered verbatim (no metric exists for them; no sys string repeats them).
- Operations catalog (`P/operations-door-contract-as-built.md` v1.0 + `A/produces-final.md` § Task 8 v1.1, confirmed "as built" on Operations `main` `47a2160`): `contact` — `name*` ≤120, `email*` ≤254, `phone` (≥ 8 digits, ≤40), `company` ≤200, `country` iso2, `iAm` ∈ `direct_employer|hr_agency|sourcing_partner|job_seeker`, `subject` ≤200, `message*` ≤5000, **v1.1** `city` ≤120 and `topic` ∈ `hire|partner|permit|job|other` (exact lower-case; the inbox preview reads `subject: [<topic>] <subject>`); `callback` — `name*`, `phone*`, `email`, `preferredTime` ≤120, `topic` ≤200 (free text), **v1.1** `city` ≤120; `visit` — `name*`, `company`, `email*`, `phone*`, `office` ≤120, `preferredDate` ≤40, `preferredTime` ≤40, `message`. Every envelope carries `consentVersion`. An unknown key inside `fields` is dropped silently (a 200), so the mappers copy these names exactly.
- The forms kernel as built: `createFormAction({ key, schema, toFields(parsed, data, ctx), consent })` checks the consent tick itself (`errors.consent = 'consent'`), trims every string, parses the schema (the first Zod issue per field becomes a `sys.form.errors.*` code), posts, redirects `{ pathname: '/thank-you', query: { form: key } }` on a non-`FAILED` 200, and otherwise answers the D11 `error` state with the typed values echoed. `FormShell` renders `title` (h`headingLevel`) → children → honeypot → Turnstile (only with a site key) → consent row → form-level alert → submit → fallback panel; every id derives from `idScope ?? formKey` (`f-<scope>-<name>`, `f-<scope>-consent`); `consentLinkHref` accepts `'/privacy'` only (the default). `FallbackPanel`'s WhatsApp prefill carries only the fields named in its `WHATSAPP_FIELDS` (`name`, `company`, `email`, `phone`, `city`, `preferredDate`, `preferredTime`, `subject`, `topic`, `message`, …) — why the enquiry's inputs are named `subject`/`city` (W114).
- The design's breakpoints: its generic `≤ 900 px` rules → this repo's `lg:` (901 px); its `≤ 700 px` rules → `max-md:` / `md:` (701 px, `--breakpoint-md`; D19 — breakpoints are never scaled). The header is `sticky top-0`, so `#message` carries `scroll-mt-24`. `.container-site` is unlayered CSS (`max-width`, `margin-inline`, `padding-inline`): never put a `max-w-*`/`mx-*`/`px-*` utility on the same element.
- `OfficeCard` (frozen block) sets **no text colour** on its `<article>` — its `h3` inherits. Mounted inside the navy offices card, the grid around it must set `text-ink` (this task does), or the city names render white on white.

**Design deltas this page carries on purpose (named, so the Fable side-by-side reviewer files them under (a) D20 / (b) design delta — D20/D27):**
1. D13/W3: three door-backed forms replace the WhatsApp mocks; the inline "sent" states (`contact.086`–`088`, the callback's `contact.221`/`047`/`048`) become the navigation to `/tesekkurler?form=contact|callback|visit`; `contact.073` ("Sends through WhatsApp…") is not rendered.
2. W79: all three forms carry the kernel's consent **checkbox** (`sys.form.consent.label`, link `/privacy`); the package's KVKK sentence `contact.072` (legal) is not rendered → WP-C sheet; the callback and visit widgets gain a checkbox the design did not have.
3. W3: the callback gains a `name` input (`contact.066`); book-a-visit gains name / e-mail / phone (`contact.066`/`067`/`068` — the page's own labels, W115); its submit is `sys.contact.visit.submit` ("Request a visit slot") instead of `contact.118` "Book on WhatsApp" — the request now files through the door.
4. W114/W115: the enquiry's inputs carry the catalog names (`company`, `name`, `email`, `phone`, `subject`, `city` | `licence`, `message`) and show their package labels above them; the e-mail/phone placeholders are the kernel's (`sys.form.placeholders.*` — the design's `name@company.com` / `+90 5xx…` have no ids), and the permit topic's city placeholder is the kernel's "e.g. Antalya" (the design's "İstanbul" has no id); the reply-channel chips post `reply` keys that ride inside `message`; the partner licence rides inside `message` too (no catalog field).
5. W3 (as designed): the job-seeker topic files nothing — it swaps the form for the B2B explainer (`contact.075`–`085`) with a WhatsApp deep link.
6. D20: the topic cards are native radios in a `<fieldset>` whose legend is `contact.057`; the checked card keeps a white face with a coloured 2 px border (a tinted face drops `text-text-tertiary` below 4.5:1) and shows the ✓ badge as real markup at every width (the design's CSS `\2713` showed it ≤ 700 px only); the ≤ 700 px "picked" pill (`contact.217`) is not rendered.
7. D20: the WhatsApp card's ≤ 700 px "Open WhatsApp →" (the design's CSS `::after`) is real markup (`sys.contact.channels.open`); every status is text (the dot is decorative); the design's `#94a3b8` greys are `text-text-tertiary` on white.
8. D20/W127/W122: the design's solid-green WhatsApp buttons ("Chat on WhatsApp" `contact.055`, "Get the list on WhatsApp" `contact.082`, the FAQ ask card's `contact.124`) wear the `success` outline face (white on `#16a34a` is 3.3:1; a face is a variant, never caller colour classes); the site-visit band's white button (`contact.112`) is `inverse`; the Karachi "See who is available →" (`contact.109`) is an underlined text link.
9. `OfficeCard` (frozen block): the card shows the city (`contact.096`/`097`) — not "Antalya, Türkiye" (`contact.098`) — no flag, the page's live pill and note ABOVE the address (the block's only slot), and the block's own tel / WhatsApp (`home.221`, `sys.whatsapp.prefill`) / mail rows and directions (`home.192`); the design's "WhatsApp the sourcing desk" (`contact.107` → the partnerships line) and "Get directions →" (`contact.102`) are therefore not rendered; the ≤ 700 px Antalya/Karachi tabs become a stacked column (both cards in the HTML); the ≤ 700 px hiding of the office notes is kept.
10. §10 #4/D26: the hero photo slot `contact-hero` is a named gradient placeholder behind the design's two overlays — the **h1 is the LCP element**.
11. D17/R18: the design's WhatsApp line "typical reply in ~15 minutes" becomes `sys.contact.status.waWatched` without a figure (no metric); until the client clock is known each pill shows the office row's own hours string.
12. W9/W154: FAQ answers 3 and 5 have no package ids → `sys.contact.faq.a3`/`a5` in the "JobsAdmire" voice; answer 3 takes `contact.135` and the `replySlaHours` metric (the design's "15 minutes" figure is not carried).
13. The FAQ ask card shows at every width (the block has no per-width prop; the design hides it ≤ 700 px); the "In a hurry?" card hides ≤ 700 px as designed; ≤ 700 px the enquiry card renders before the explainer column (CSS `order`, as designed — the explainer then holds nothing focusable, so the focus order is unchanged).
14. R15/W5: the design's mobile bottom bar (`contact.125`, prefill `contact.214`) is the chrome's `MobileBottomBar`, not re-rendered; the footer newsletter handler (`contact.222`) is dropped.
15. SEO: the design's per-page `EmploymentAgency` block is not repeated (the site-wide Organization/EmploymentAgency node stays the only one); the `ContactPage` node carries the two contact points and the Antalya hours from data (never hand-typed); the canonical is `/iletisim` · `/en/contact`.
16. D13/W12: the design's `contact_form_submit`, `callback_open`, `callback_slot_pick`, `callback_request`, `visit_slot_pick`, `newsletter_subscribe` pushes are gone — only `contact_topic` (W26) and the three contact events; the conversion comes from `/tesekkurler`.
17. W13: the reveal, stagger, plane-fly and pulse animations are dropped, except the open-status dot's `motion-safe:animate-pulse`.

**Files:**

Create
- `src/app/[locale]/(site)/contact/page.tsx` — the route (server component; metadata, JSON-LD, the four sections)
- `src/app/[locale]/(site)/contact/actions.ts` — `'use server'`: `submitContact`, `submitCallback`, `submitVisit`
- `src/app/[locale]/(site)/contact/__tests__/actions.test.ts`
- `src/app/[locale]/(site)/contact/_lib/options.ts` — zod-free option keys (the only `_lib` module the islands import at runtime besides `office-status`/`live-status-text`)
- `src/app/[locale]/(site)/contact/_lib/forms.ts` — Zod schemas + catalog mappers (server action and tests only)
- `src/app/[locale]/(site)/contact/_lib/office-status.ts` — pure office-hours arithmetic
- `src/app/[locale]/(site)/contact/_lib/live-status-text.ts` — pure pill text per variant
- `src/app/[locale]/(site)/contact/_lib/phone.ts` — `formatPhoneDisplay`
- `src/app/[locale]/(site)/contact/_lib/jsonld.ts` — `contactPageJsonLd`
- `src/app/[locale]/(site)/contact/_lib/door.ts` — `formDoor(bundle, locale)`
- `src/app/[locale]/(site)/contact/_lib/__tests__/bundles.ts` — test helper: the committed LOCAL bundles, parsed
- `src/app/[locale]/(site)/contact/_lib/__tests__/forms.test.ts`, `office-status.test.ts`, `live-status-text.test.ts`, `phone.test.ts`, `jsonld.test.ts`, `copy.test.ts`, `ids.test.ts`
- `src/app/[locale]/(site)/contact/_components/types.ts` — `FormAction`, `FormDoor` (types only)
- `src/app/[locale]/(site)/contact/_components/icons.tsx` — six page glyphs (no directive)
- `src/app/[locale]/(site)/contact/_components/useMinuteTick.ts` (`'use client'`)
- `src/app/[locale]/(site)/contact/_components/LiveStatus.tsx` (`'use client'`)
- `src/app/[locale]/(site)/contact/_components/ContactEnquiry.tsx` (`'use client'`)
- `src/app/[locale]/(site)/contact/_components/CallbackWidget.tsx` (`'use client'`)
- `src/app/[locale]/(site)/contact/_components/VisitBooking.tsx` (`'use client'`)
- `src/app/[locale]/(site)/contact/_components/__tests__/LiveStatus.test.tsx`, `ContactEnquiry.test.tsx`, `CallbackWidget.test.tsx`, `VisitBooking.test.tsx`
- `src/app/[locale]/(site)/contact/_sections/Hero.tsx`, `Message.tsx`, `Offices.tsx`, `Faq.tsx` (server components, synchronous — testable in jsdom)
- `src/app/[locale]/(site)/contact/_sections/__tests__/sections.test.tsx`
- `e2e/pages/contact.spec.ts`

Modify
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.contact` (2 leaves, inside the existing `sys.seo` object) and a new `sys.contact` object (23 leaves) — identical key sets
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES`: delete the line `'/contact',` (nothing else)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: two rows inserted immediately before the line `// The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.`
- `docs/CONTENT-MODEL.md` — one bullet appended to the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (W98)
- `docs/SEO.md` — one row appended to T1's `## Pages` table (W98)
- `docs/ANALYTICS.md` — the `contact_topic` row's "Fires on" cell in `## Event schema`, and one bullet appended under `### Page instrumentation (WP2b)` (W98)
- `docs/PRD.md` — §2, the table row whose page cell is `Contact Us` (its last cell), and the §11 sentence beginning "**Not yet built, by design (WP2 and later):**", edited in place (W45)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T7 row of the `## Ledger` table (Cycle 6)

Test
- Vitest: the thirteen `__tests__` files above (`npx vitest run "src/app/\[locale\]/(site)/contact" --maxWorkers=1`)
- Playwright (both projects, in the gate only): `e2e/pages/contact.spec.ts`
- Existing, must stay green untouched: `src/lib/seo/unbuilt.test.ts` (W20), `scripts/gate-routes.test.ts` (W21 — EN/TR halves equal), `src/messages/{messages,voice}.test.ts` (key parity; W154 over all of `sys.*`), `src/i18n/client-messages.test.ts` (W148 — no client module of this task reads `sys`), `src/design/__tests__/class-collisions.test.ts` (W122/W155 — scans `src/app/**`, so every class string below is part of the gate), `src/design/__tests__/client-imports.test.ts` (W147/W156/W158 — no barrel anywhere, no message JSON in the client graph), `src/design/blocks/__tests__/rsc-imports.test.ts` (W125/W130/W134), `e2e/{routing,seo,a11y,width-sweep,chrome,headers,thank-you}.spec.ts`

**Interfaces:**

Consumes (exact names, verified in the code at `bc708a3`; import paths as written — never a barrel, W134/W147/W156, type-only imports included):
- Content: `getBundle`, `makeTf` from `@/content/adapter` (`server-only`; `export * from './pure'`); `makeTf`, `metricValues` from `@/content/pure` (the sections — synchronous and testable); `getOffice` from `@/content/collections` (returns an `Office`: `hours: { tz, days, open, close }`, `hoursId`, the ids `OfficeCard` reads); `BundleSchema`, `type Bundle` from `contract/website-bundle.v1` (relative: six levels up from `_lib/`, `_sections/`, `_components/`; seven from `_lib/__tests__/`).
- Forms kernel (`src/forms/**`): `createFormAction`, `type FormActionState` from `@/forms/action` (`FormSpec = { key: FormKey, schema, toFields(parsed, data, ctx: { visitor, locale }), consent?: 'checkbox' | 'notice' }` — a one-argument mapper type-checks); `IDLE_FORM_STATE`, `type FormActionState` from `@/forms/types`; `type WireFields` from `@/forms/wire` (`buildEnvelope` drops `''`); `CONSENT_VERSION` from `@/forms/consent`; `FormShell` from `@/forms/client/FormShell` — props used: `action, formKey, idScope, locale, turnstileSiteKey, whatsappNumber, whatsappIntro, contact, submitLabel, consent, title, headingLevel, testId, className` (no `consentLinkHref` — its only value `'/privacy'` is the default, W79; no `id`); `Field` from `@/forms/client/Field` — props used: `name, label, placeholder, hint, required, as, type, rows, autoComplete, inputMode, maxLength` (the default id `f-<idScope ?? formKey>-<name>`; `label` falls back to `sys.form.labels.<name>`, `placeholder` to `sys.form.placeholders.<name>`, `hint` to `sys.form.hints.<name>` / `hints.optional` for a non-required field, `hint=""` suppresses); the D11 `FallbackPanel` (`data-testid="form-fallback"`, `data-kind`, bare `https://wa.me/<n>` anchor, prefill via `window.open` on click — W76).
- Primitives/blocks/chrome by path: `Section` (`{ tone: 'light'|'dark'|'pale'|'band', id?, className?, children }` — `py-16`/`py-10` and the background), `Eyebrow`, `RadioChips` (`'use client'`; `{ name, options: { value, label }[], value, onChange, legend, legendHidden?, className? }` — native radios under `name`, ids from `useId`) from `@/design/primitives/<Name>`; `Breadcrumbs` (`{ locale, items: { name, href }[], tone?, className? }` — `BreadcrumbList` node, nav named `sys.nav.breadcrumbs`), `ContactCta` (`{ placement: 'page_cta' | 'office_card', href, variant?, size?, external?, className?, children }` — `contactKindOf` from `@/analytics/contact-kind` inside, W125), `FaqBlock` + `type FaqItem` (`{ bundle, locale, items, id? = 'faq', eyebrowId?, headingId?, bodyId?, askCard?: { titleId, bodyId, whatsappNumber, whatsappText, whatsappLabelId, phone?, callLabelId?, email?, emailLabelId?, subject? }, singleOpen?, openFirst?, headingLevel? }` — its root carries `id`, emits `FAQPage`), `ImageSlot` (`{ slot, lcp?, src?, alt, width, height, sizes?, className?, priority? }` — owns its box, W129), `OfficeCard` (`{ bundle, locale, office, children? }` — `<article>`: h3 `cityId`, `labelId`, children, `addressId`/`addressLine2Id`, `hoursId`, tel / WhatsApp / mail rows as `ContactLink` `office_card`, directions `home.192`), `ProcessSteps` (`{ bundle, locale, steps: { n, titleId, bodyId, when? }[], variant?: 'cards'|'plain', id?, headingLevel?: 3|4 }`) from `@/design/blocks/<Name>`; `QrCode` (`'server-only'`; `{ text, label, size = 86, className? }` — the door to `qrSvg` in `@/lib/qr`, W14) from `@/design/QrCode`; `CheckIcon`, `LinkIcon`, `MailIcon`, `PhoneIcon`, `WhatsAppIcon` (`{ size?, className? }`) from `@/design/chrome/icons`.
- Analytics: `ContactLink` from `@/analytics/ContactLink` (`'use client'`; `Omit<AnchorHTMLAttributes, 'href'|'onClick'|'onAuxClick'> & { href, placement, children }` — server sections render it as a client reference; no server module imports `@/analytics/useContactClick`, W125); `track`, `PARAM_ENUMS` from `@/analytics/track` (`ALLOWED_PARAMS.contact_topic = ['page','locale','topic']`, `PARAM_ENUMS.topic = ['hire','partner','permit','job','other']` — `track()` drops any other value).
- i18n/SEO/contact: `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `buildMetadata` from `@/lib/seo/metadata`; `absoluteUrl` from `@/lib/seo/routes`; `JsonLd` from `@/lib/seo/JsonLdScript`; `waLink`, `telLink`, `mailLink` from `@/lib/contact`; `renderWithIntl` from `@/test/render` (tests).
- Messages consumed, not added: `sys.form.labels.*`, `sys.form.placeholders.{email,phone,city,preferredDate}`, `sys.form.hints.{phone,optional}`, `sys.form.errors.*`, `sys.form.consent.label`, `sys.form.fallback.*`, `sys.nav.breadcrumbs`, `sys.whatsapp.prefill` (via `OfficeCard`), `sys.seo.ogTagline` (via the OG route), `sys.thankYou.forms.{contact,callback,visit}` (the thank-you page's).
- Gate tooling: `npm run gate` / `gate:launch` (`scripts/gate.sh`; `scripts/launch/dead-targets.ts` prints `… (/contact#message): <locale> <path> → missing id="message" …` while the anchor is absent), `npm run js-size`, Playwright projects `mobile` (Pixel 7, 412 px) and `desktop` (1440×900).

Produces (for T14's I4 instance map, T15's launch sweep and later pages that copy patterns — nothing imports these files across route folders):
- Routes `/iletisim`, `/en/contact` (key `/contact` gone from `UNBUILT_PATHNAMES`), both in `GATE_ROUTE_TABLE` as indexable.
- DOM: `section#message` (the header CTA target, W17), `#faq` (FaqBlock's root); section test ids `contact-hero`, `contact-message`, `contact-offices`, `contact-faq` (on inner `<div>`s, W113); `contact-jobseeker`, `contact-qr`, `contact-callback`, `contact-visit`; `live-status` on every pill (6 with the LOCAL settings — hero, WhatsApp, two phone lines, two offices; `data-variant`, and after hydration `data-open="true|false"`); one `data-lcp-slot` (the h1); one placeholder `contact-hero`.
- Forms: `form[data-testid="contact-enquiry-form"]` (`data-form-key="contact"`, `idScope` `contact-enquiry`), `contact-callback-form` (`callback`, `contact-callback`, mounted when the widget is opened), `contact-visit-form` (`visit`, `contact-visit`); every one with a consent checkbox `f-<scope>-consent`.
- Wire (T14's I4 rows): enquiry → `contact` · `name, email, phone, company, topic` (`hire|permit|partner`), `iAm` (`direct_employer` for hire and permit, `sourcing_partner` for partner), `subject` (the topic's detail line), `message` (subject + `licence: …` (partner) + `reply: <whatsapp|email|call>` + the notes), `city?` (hire/permit, v1.1); callback → `callback` · `name, phone, preferredTime?` (`"<today|tomorrow|this_week> <09-11|11-13|14-16|16-18|any>"`, keys); visit → `visit` · `name, email, phone, office: 'antalya', preferredDate?` (ISO date from the chips, or ≤ 40 typed characters before hydration), `preferredTime?` (`09:30|11:00|13:30|15:00|16:30`). Consent is a checkbox on all three (W79).
- Analytics: `contact_topic` wired (the picker, `hire|permit|partner|job`).

**Rulings applied:**
- W1/D17 — the SLA strings `contact.040`/`193` arrive re-authored and render through `makeTf`; FAQ answer 3 takes the `replySlaHours` metric; the live labels read the `offices` hours; no figure is typed into a `sys.contact.*` string (pinned by `copy.test.ts`).
- W3/W16/W77 — enquiry → `contact` + `topic` + `iAm` (+ v1.1 `city`); callback → `callback` with the added `name`; book-a-visit → `visit` with the added name/e-mail/phone and `office: 'antalya'`; option values are keys (`hire`, `today`, `14-16`, `11:00`, ISO dates), never labels; the job-seeker topic files nothing.
- W9/W23/W54 — 25 `sys.*` keys for id-less copy (`sys.contact.*` + `sys.seo.contact.*`); package fragments are composed only where the package splits them (`contact.025`/`026`, `152`/`153`, `218` + desk, `069` + `070`, `076`–`079`).
- W10 — the desktop/mobile paragraph variants (`contact.027`/`028`) are two spans toggled by CSS; every ≤ 700 px hide/show is `max-md:hidden` / `md:hidden` on server markup.
- W12/W26/W67 — `contact_topic { page, locale, topic }` fires for the picker keys only (the `hire` default fires nothing); every `tel:`/`wa.me`/`mailto:` anchor is a `ContactLink`/`ContactCta` with `page_cta`, the office rows `office_card` (inside `OfficeCard`).
- W13 amended/W120/W136 — the islands import `options.ts` (zod-free), never the schemas; the ledger's JS figure is `js-size`'s (ceiling 204,800 B, lazy line 194,560 B); the page ships no `LazyIsland` (see W132).
- W14 — no hot-linked asset: the QR is `QrCode` (server, `qrSvg`), the icons inline SVG.
- W17/W121/W152/W158 — no `ctas.ts` edit; the page renders `id="message"` in both locales; Cycle 6 proves the launch anchor sweep no longer lists it.
- W19/R31 — lives in the `(site)` group; no `<main>` (the layout owns it).
- W20/W21 — `'/contact'` leaves `UNBUILT_PATHNAMES` in the commit that adds `page.tsx`; the two locale paths join `GATE_ROUTE_TABLE` and nowhere else.
- W27/W55/D26/W129 — one named placeholder (`contact-hero`), exactly one `data-lcp-slot` (the h1); `ImageSlot` gets no width/height/aspect/object class — it sits in an `absolute inset-0` wrapper.
- W45/W98 — every doc edit anchors on T1's headings/sentences and appends a row/bullet; no line numbers.
- W73–W76/W116/W117 — kernel as built (9 s shared deadline, one connection-level retry, bare fallback href, click-time prefill); no uploads on this page.
- W78 — no `startWhen` field on this page (the design asks none), so `START_WHEN_KEYS` is not used.
- W79 — `consent: 'checkbox'` in all three specs and shells; no `consentLinkHref`; `contact.072` → WP-C sheet.
- W82 — not needed: every CTA href here is a string (`/available-workers` is a `Link`).
- W83 — the FAQ ask card carries the design's one door (WhatsApp); no `footer` workaround.
- W92 — the page e2e is deterministic without `OPS_API_URL`: a valid submit ends on the `unauthorized` panel; the submitting cases skip on a door face (`staging`, production — T14 owns real submissions).
- W95 — no visitor data in any DOM href: the page's own `wa.me` links carry only `sys.contact.wa.*` company-authored prefills; the fallback anchors are bare.
- W99 — T7 runs after T1, T13, T2–T6 and before T8. W109 — the crumbs are this page's own ids: `contact.023` → `/`, `contact.024` → this page.
- W111 — not applicable (no `Field as="select"`).
- W113 — section test ids sit on inner `<div>`s; `Section`'s props stay frozen.
- W114 — the enquiry's input names are the catalog names (`subject`, `city`); the licence declaration is its own `licence` input folded into `message`.
- W115 — every package field label is passed as `label` (`contact.066`–`068`, `164`, `166`, `168`, `173`, `175`, `179`, `181`, `183`, the visit day/time legends); `sys.form.labels.*` only where the page shows none (none on this page); e2e selects inputs by the rendered label.
- W118 — no history rewrite, no `wip` commit, no stash.
- W119/W122/W155 — hide ≤ 700 px with `max-md:hidden`, show ≤ 700 px with `md:hidden`, hide ≤ 900 px with `max-lg:hidden`; never `hidden` beside an unprefixed display utility; no class string sets one property twice at one variant (the channel cards share a colourless, borderless `CARD` frame and add their own border); no colour/display/width class reaches `Button`/`ContactCta`/`ImageSlot` other than `w-full` (a different face is a variant).
- W123 — the docs call the OG image CDN-cached, never ISR. W124 — not a template record.
- W125/W130/W134/W147/W156 — primitives, blocks, chrome pieces by module path everywhere; the page's hook module carries `'use client'` like every island; server files never import `@/analytics/useContactClick`.
- W126 — one build + one start + one gate as the proof (Cycle 6).
- W127/W128 — `success` for the WhatsApp outline buttons, `inverse` for the band's button; no green band on this page.
- W131/W133 — not applicable.
- W132/W85 — no `LazyIsland`: the enquiry form is the page's content and `#message` target, and the forms kernel (≈ 7.5 KB gz) is shared by all three shells, so viewport loading would not take it out of the first-load graph; Cycle 6 measures and names the levers if the route crosses the lazy line.
- W135/W145/W146 — a localhost run wears the production face (`lighthouserc.local.json` = production: DevTools throttling, three runs, median — LCP ≤ 2,500 ms and performance ≥ 0.95 are errors); GTM stays dark (no `NEXT_PUBLIC_GTM_ID` locally).
- W137/W139/W140 — no preview run by the implementer (never push); the controller's binding preview run uses `--settings.extraHeaders`.
- W148 — no `CLIENT_SYS` change: no client module of this task calls `useTranslations`; the islands receive every string resolved (the live-status templates as raw `sys.raw(...)` strings the island fills with `{time}`/`{open}`/`{close}`/`{day}`), and the kernel reads only `sys.form` (already listed).
- W150 — no D17 dated badge on this page → no `revalidate` export (SSG like every static page).
- W154 — no `sys.contact.*`/`sys.seo.contact.*` string speaks as "we"/"biz": the prefills and fallback intros are the visitor's first-person singular, the answers name "JobsAdmire" (`voice.test.ts` scans all of `sys.*`).
- W157/W160 — security headers come from the middleware; nothing for the page to do. W161 — no `url`-typed field is sent.
- Final-review page rule (§6) — exactly one `Breadcrumbs` and one `FaqBlock` (one `BreadcrumbList`, one `FAQPage`, one landmark label each); the site-wide Organization/EmploymentAgency node is not repeated.
- D11/D13/D19/D20/D23/D26/D27 and R15/R17/R18/R22/R35/R56 — fallback panel, thank-you navigation, unscaled breakpoints, accessibility over pixels, no fixtures, named LCP slot, Fable review (not a pixel page), the chrome renders its own canonical ids (`contact.001`–`022`, `125`–`149` are never read except `135`), typed internal links, browser facts through `useSyncExternalStore` (`null` on the server), same-tab contact anchors except `wa.me` (`target="_blank"` + `noopener`), `page` from `next/navigation`, no `src/content/local/*` import from `src/**` (tests read the bundles with `readFileSync`).

---

#### Cycle 1 — the pure pieces and the `sys.contact` copy: option keys, form specs → catalog fields, office-hours arithmetic, pill text, phone format, the `ContactPage` node

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/contact/_lib/__tests__/forms.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PARAM_ENUMS } from '@/analytics/track';
import {
  callbackSchema,
  composeContactMessage,
  contactSchema,
  toCallbackFields,
  toContactFields,
  toVisitFields,
  visitSchema,
} from '../forms';
import {
  CALLBACK_DAYS,
  CALLBACK_SLOT_KEYS,
  CALLBACK_SLOTS,
  CONTACT_TOPICS,
  EXTRA_FIELD,
  IAM_BY_TOPIC,
  LANGUAGE_CODES,
  PICKER_TOPICS,
  REPLY_CHANNELS,
  VISIT_OFFICE,
  VISIT_SLOTS,
} from '../options';

const OPTIONS = join(process.cwd(), 'src/app/[locale]/(site)/contact/_lib/options.ts');

/** The Operations catalog (v1.0 + the confirmed v1.1 `city`/`topic`) — anything else inside
 *  `fields` would be dropped silently with a 200. */
const CONTACT_CATALOG = ['name', 'email', 'phone', 'company', 'country', 'iAm', 'subject', 'message', 'city', 'topic'];
const CATALOG_TOPICS = ['hire', 'partner', 'permit', 'job', 'other'];

const base = {
  topic: 'hire',
  company: 'Akdeniz Otel A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@akdenizotel.com',
  phone: '+90 532 000 00 00',
  subject: '10 welders, 4 CNC operators',
};

describe('options — the stable keys (W3/W77), zod-free for the islands (W13)', () => {
  it('every option value is a key, never a label', () => {
    expect(CONTACT_TOPICS).toEqual(['hire', 'permit', 'partner']);
    expect(PICKER_TOPICS).toEqual(['hire', 'permit', 'partner', 'job']);
    expect(IAM_BY_TOPIC).toEqual({ hire: 'direct_employer', permit: 'direct_employer', partner: 'sourcing_partner' });
    expect(EXTRA_FIELD).toEqual({ hire: 'city', permit: 'city', partner: 'licence' });
    expect(REPLY_CHANNELS).toEqual(['whatsapp', 'email', 'call']);
    expect(CALLBACK_DAYS).toEqual(['today', 'tomorrow', 'this_week']);
    expect(CALLBACK_SLOT_KEYS).toEqual([...CALLBACK_SLOTS.map((s) => s.key), 'any']);
    expect(CALLBACK_SLOTS.map((s) => `${s.from}–${s.to}`)).toEqual(['09:00–11:00', '11:00–13:00', '14:00–16:00', '16:00–18:00']);
    expect(VISIT_SLOTS).toEqual(['09:30', '11:00', '13:30', '15:00', '16:30']);
    expect(VISIT_OFFICE).toBe('antalya');
    expect(LANGUAGE_CODES).toEqual(['tr', 'en', 'fr', 'hi', 'ru']);
  });

  it('every picker topic is a catalog v1.1 topic and a PARAM_ENUMS.topic value (W16/W67)', () => {
    for (const topic of PICKER_TOPICS) {
      expect(CATALOG_TOPICS).toContain(topic);
      expect(PARAM_ENUMS.topic as readonly string[]).toContain(topic);
    }
  });

  it('options.ts imports nothing — the islands read it, so zod never reaches the client bundle', () => {
    expect(readFileSync(OPTIONS, 'utf8')).not.toMatch(/^\s*import\s/m);
  });
});

describe('contact — schema', () => {
  it('accepts the designed minimum (topic, company, name, e-mail, phone, subject)', () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });
  it('an empty e-mail reads "required" before "not an e-mail" (.min(1) precedes .email())', () => {
    const r = contactSchema.safeParse({ ...base, email: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['email'], code: 'too_small' });
  });
  it('a phone with fewer than 8 digits carries the `phone` code (the door counts digits the same way)', () => {
    const r = contactSchema.safeParse({ ...base, phone: '+90 53' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['phone'], message: 'phone' });
  });
  it('an empty phone reads "required" first, not "phone"', () => {
    const r = contactSchema.safeParse({ ...base, phone: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['phone'], code: 'too_small' });
  });
  it('never files the job-seeker topic: it is a picker key, not a schema value (W3)', () => {
    expect(contactSchema.safeParse({ ...base, topic: 'job' }).success).toBe(false);
  });
  it('caps each input at its catalog length', () => {
    expect(contactSchema.safeParse({ ...base, company: 'c'.repeat(201) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, name: 'n'.repeat(121) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, subject: 's'.repeat(201) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, city: 'c'.repeat(121) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, licence: 'l'.repeat(201) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: 'm'.repeat(4001) }).success).toBe(false);
  });
});

describe('contact — toContactFields (catalog names exactly, W114)', () => {
  it('hire: topic + iAm + subject + message (+ reply line and notes) + v1.1 city', () => {
    const p = contactSchema.parse({ ...base, city: 'Antalya', reply: 'whatsapp', message: 'Start in March.' });
    expect(toContactFields(p)).toEqual({
      name: 'Ayşe Yılmaz',
      email: 'ayse@akdenizotel.com',
      phone: '+90 532 000 00 00',
      company: 'Akdeniz Otel A.Ş.',
      topic: 'hire',
      iAm: 'direct_employer',
      subject: '10 welders, 4 CNC operators',
      message: '10 welders, 4 CNC operators\nreply: whatsapp\n\nStart in March.',
      city: 'Antalya',
    });
  });
  it('permit: the employer of record is a direct employer; the workplace city rides as city', () => {
    const f = toContactFields(contactSchema.parse({ ...base, topic: 'permit', subject: '1 Uzbek chef, already in Türkiye', city: 'İstanbul' }));
    expect(f).toMatchObject({ topic: 'permit', iAm: 'direct_employer', city: 'İstanbul', message: '1 Uzbek chef, already in Türkiye' });
  });
  it('partner: sourcing_partner; the licence is a message line, never a field of its own', () => {
    const f = toContactFields(contactSchema.parse({ ...base, topic: 'partner', company: 'Skyline Manpower, Nepal', subject: 'welders and masons, 200 on file', licence: 'NP-1234' }));
    expect(f).toMatchObject({ topic: 'partner', iAm: 'sourcing_partner', message: 'welders and masons, 200 on file\nlicence: NP-1234' });
    expect(f).not.toHaveProperty('licence');
    expect(f).not.toHaveProperty('city');
  });
  it('a stray city on a partner post and a stray licence on a hire post are both ignored', () => {
    expect(toContactFields(contactSchema.parse({ ...base, topic: 'partner', city: 'Antalya' }))).not.toHaveProperty('city');
    expect(toContactFields(contactSchema.parse({ ...base, licence: 'X-1' })).message).toBe(base.subject);
  });
  it('an empty optional never becomes a field, and every key sent is a catalog name', () => {
    const f = toContactFields(contactSchema.parse({ ...base, city: '', licence: '', message: '' }));
    expect(f).not.toHaveProperty('city');
    expect(f.message).toBe(base.subject);
    for (const key of Object.keys(f)) expect(CONTACT_CATALOG).toContain(key);
  });
  it('composeContactMessage stays under the catalog cap of 5000 at the schema maxima', () => {
    const p = contactSchema.parse({ ...base, topic: 'partner', subject: 's'.repeat(200), licence: 'l'.repeat(200), reply: 'call', message: 'm'.repeat(4000) });
    expect(composeContactMessage(p).length).toBeLessThanOrEqual(5000);
  });
});

describe('callback', () => {
  it('requires the W3 name and a phone; preferredTime is "<day> <slot>" from keys', () => {
    expect(callbackSchema.safeParse({ phone: '+90 532 000 00 00' }).success).toBe(false);
    const p = callbackSchema.parse({ name: 'Mehmet Kaya', phone: '+90 532 000 00 00', day: 'tomorrow', slot: '14-16' });
    expect(toCallbackFields(p)).toEqual({ name: 'Mehmet Kaya', phone: '+90 532 000 00 00', preferredTime: 'tomorrow 14-16' });
  });
  it('the day alone, or no preferredTime at all when nothing is picked', () => {
    expect(toCallbackFields(callbackSchema.parse({ name: 'M', phone: '05320000000', day: 'today' })).preferredTime).toBe('today');
    expect(toCallbackFields(callbackSchema.parse({ name: 'M', phone: '05320000000' }))).not.toHaveProperty('preferredTime');
  });
  it('refuses a slot label in place of a key (W77)', () => {
    expect(callbackSchema.safeParse({ name: 'M', phone: '05320000000', slot: '09:00–11:00' }).success).toBe(false);
  });
});

describe('visit', () => {
  it('requires name / e-mail / phone (W3) and pins office = antalya', () => {
    expect(visitSchema.safeParse({ name: 'A', phone: '+90 532 000 00 00' }).success).toBe(false);
    const p = visitSchema.parse({ name: 'A', email: 'a@b.co', phone: '+90 532 000 00 00', preferredDate: '2026-10-01', preferredTime: '11:00' });
    expect(toVisitFields(p)).toEqual({ name: 'A', email: 'a@b.co', phone: '+90 532 000 00 00', office: 'antalya', preferredDate: '2026-10-01', preferredTime: '11:00' });
  });
  it('refuses a time outside the five slots and accepts a typed date of up to 40 characters', () => {
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '05320000000', preferredTime: '12:00' }).success).toBe(false);
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '05320000000', preferredDate: 'Wed 30 Sep' }).success).toBe(true);
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '05320000000', preferredDate: 'x'.repeat(41) }).success).toBe(false);
  });
  it('sends no field beyond the catalog', () => {
    const f = toVisitFields(visitSchema.parse({ name: 'A', email: 'a@b.co', phone: '05320000000' }));
    for (const key of Object.keys(f)) expect(['name', 'company', 'email', 'phone', 'office', 'preferredDate', 'preferredTime', 'message']).toContain(key);
  });
});
```

`src/app/[locale]/(site)/contact/_lib/__tests__/office-status.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatVisitDay, localParts, nextOpenDates, officeStatus, weekdayName } from '../office-status';

// The `offices` rows as imported (JS getDay(): 0 = Sun … 6 = Sat, W43).
const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const karachi = { tz: 'Asia/Karachi', days: [1, 2, 3, 4, 5, 6], open: '10:00', close: '19:00' };

describe('localParts', () => {
  it('reads the clock in the office zone, never the runtime zone', () => {
    // 07:32Z = 10:32 in Istanbul (UTC+3, no DST), a Wednesday; the same instant is 12:32 in Karachi.
    expect(localParts(new Date('2026-09-23T07:32:00Z'), antalya.tz)).toEqual({ day: 3, minutes: 632, clock: '10:32' });
    expect(localParts(new Date('2026-09-23T07:32:00Z'), karachi.tz).clock).toBe('12:32');
  });
  it('midnight reads 00:00', () => {
    expect(localParts(new Date('2026-09-22T21:00:00Z'), antalya.tz)).toEqual({ day: 3, minutes: 0, clock: '00:00' });
  });
});

describe('officeStatus', () => {
  it('open inside the hours of an open day, the opening minute included', () => {
    expect(officeStatus(new Date('2026-09-23T07:32:00Z'), antalya)).toEqual({ open: true, clock: '10:32' });
    expect(officeStatus(new Date('2026-09-23T06:00:00Z'), antalya)).toEqual({ open: true, clock: '09:00' });
  });
  it('before opening on an open day → beforeOpen, opens today', () => {
    expect(officeStatus(new Date('2026-09-23T05:10:00Z'), antalya)).toEqual({ open: false, clock: '08:10', reason: 'beforeOpen', nextOpenDay: 3, opensTomorrow: false });
  });
  it('the closing minute is closed; after closing on a weekday → opens tomorrow', () => {
    expect(officeStatus(new Date('2026-09-23T15:00:00Z'), antalya)).toMatchObject({ open: false, reason: 'afterClose', nextOpenDay: 4, opensTomorrow: true });
    expect(officeStatus(new Date('2026-09-23T16:00:00Z'), antalya)).toEqual({ open: false, clock: '19:00', reason: 'afterClose', nextOpenDay: 4, opensTomorrow: true });
  });
  it('Friday evening → opens Monday, not tomorrow', () => {
    expect(officeStatus(new Date('2026-09-25T16:00:00Z'), antalya)).toMatchObject({ open: false, reason: 'afterClose', nextOpenDay: 1, opensTomorrow: false });
  });
  it('Saturday is a closed day in Antalya and an open one in Karachi (Mon–Sat)', () => {
    expect(officeStatus(new Date('2026-09-26T09:00:00Z'), antalya)).toMatchObject({ open: false, reason: 'closedDay', nextOpenDay: 1, opensTomorrow: false });
    expect(officeStatus(new Date('2026-09-26T07:00:00Z'), karachi)).toEqual({ open: true, clock: '12:00' });
  });
  it('Sunday → closedDay, opens Monday (tomorrow)', () => {
    expect(officeStatus(new Date('2026-09-27T12:00:00Z'), karachi)).toMatchObject({ open: false, reason: 'closedDay', nextOpenDay: 1, opensTomorrow: true });
  });
  it('an office row with no open day is closed, never a throw (a data defect must not take the page down)', () => {
    expect(officeStatus(new Date('2026-09-23T07:32:00Z'), { ...antalya, days: [] })).toMatchObject({ open: false, reason: 'closedDay' });
  });
});

describe('weekdayName', () => {
  it('localized long names from a JS getDay() index', () => {
    expect(weekdayName(1, 'en')).toBe('Monday');
    expect(weekdayName(1, 'tr')).toBe('Pazartesi');
    expect(weekdayName(0, 'tr')).toBe('Pazar');
  });
});

describe('nextOpenDates / formatVisitDay', () => {
  it('the next five Antalya open days from a Friday night, as ISO dates in the office zone', () => {
    // 20:00Z Friday 25 Sep = 23:00 in Istanbul: today is over, Saturday and Sunday are closed.
    expect(nextOpenDates(new Date('2026-09-25T20:00:00Z'), antalya, 5)).toEqual(['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']);
  });
  it('never includes today (the design starts at tomorrow), even when UTC is still on the previous date', () => {
    expect(nextOpenDates(new Date('2026-09-23T07:32:00Z'), antalya, 3)).toEqual(['2026-09-24', '2026-09-25', '2026-09-28']);
    // 22:30Z Thursday = 01:30 Friday in Istanbul → Friday is "today", so Monday comes first.
    expect(nextOpenDates(new Date('2026-09-24T22:30:00Z'), antalya, 2)).toEqual(['2026-09-28', '2026-09-29']);
  });
  it('formats a calendar date day-first per locale, unshifted by the runtime zone', () => {
    expect(formatVisitDay('2026-09-28', 'en')).toMatch(/^Mon 28 Sept?$/);
    expect(formatVisitDay('2026-09-28', 'tr')).toBe('28 Eyl Pzt');
  });
});
```

`src/app/[locale]/(site)/contact/_lib/__tests__/live-status-text.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fillTemplate, liveStatusText } from '../live-status-text';
import { officeStatus } from '../office-status';

const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const karachi = { tz: 'Asia/Karachi', days: [1, 2, 3, 4, 5, 6], open: '10:00', close: '19:00' };
const at = (iso: string, hours = antalya) => officeStatus(new Date(iso), hours);

// The package fragments (contact.152–155, 215, 216) and the sys templates as the page passes them.
const hero = { variant: 'hero', labels: { openNow: 'Office open now ·', inCity: 'in Antalya', weekend: 'Weekend · WhatsApp is still watched', closedToday: 'Closed for today', opensAt: 'Opens {open}' } } as const;
const whatsapp = { variant: 'whatsapp', labels: { watched: 'Watched now', off: 'Off hours' } } as const;
const lines = { variant: 'lines', labels: { open: 'Lines open now', closed: 'Lines closed' } } as const;
const office = { variant: 'office', labels: { openNow: 'Open now · {time} local · closes {close}', closedOpensAt: 'Closed · opens {open} · {time} local', closedOpensTomorrow: 'Closed · opens {open} tomorrow', closedOpensOn: 'Closed · opens {day} {open}' } } as const;

describe('fillTemplate', () => {
  it('fills the named arguments and leaves an unknown one visible (a copy defect shows, never crashes)', () => {
    expect(fillTemplate('Opens {open} · {time}', { open: '09:00', time: '08:10' })).toBe('Opens 09:00 · 08:10');
    expect(fillTemplate('Opens {when}', { open: '09:00' })).toBe('Opens {when}');
  });
});

describe('liveStatusText', () => {
  it('hero: the package split around the clock (contact.152 + clock + contact.153)', () => {
    expect(liveStatusText(hero, at('2026-09-23T07:32:00Z'), antalya, 'en')).toBe('Office open now · 10:32 in Antalya');
  });
  it('hero: before opening, after closing and at the weekend', () => {
    expect(liveStatusText(hero, at('2026-09-23T05:10:00Z'), antalya, 'en')).toBe('Opens 09:00 · 08:10 in Antalya');
    expect(liveStatusText(hero, at('2026-09-23T16:05:00Z'), antalya, 'en')).toBe('Closed for today · 19:05 in Antalya');
    expect(liveStatusText(hero, at('2026-09-26T09:00:00Z'), antalya, 'en')).toBe('Weekend · WhatsApp is still watched');
  });
  it('whatsapp and lines follow the Antalya hours', () => {
    expect(liveStatusText(whatsapp, at('2026-09-23T07:32:00Z'), antalya, 'en')).toBe('Watched now');
    expect(liveStatusText(whatsapp, at('2026-09-26T09:00:00Z'), antalya, 'en')).toBe('Off hours');
    expect(liveStatusText(lines, at('2026-09-23T07:32:00Z'), antalya, 'en')).toBe('Lines open now');
    expect(liveStatusText(lines, at('2026-09-23T16:00:00Z'), antalya, 'en')).toBe('Lines closed');
  });
  it('office: open, before opening, closed until tomorrow', () => {
    expect(liveStatusText(office, at('2026-09-23T07:32:00Z'), antalya, 'en')).toBe('Open now · 10:32 local · closes 18:00');
    expect(liveStatusText(office, at('2026-09-23T05:10:00Z'), antalya, 'en')).toBe('Closed · opens 09:00 · 08:10 local');
    expect(liveStatusText(office, at('2026-09-23T16:00:00Z'), antalya, 'en')).toBe('Closed · opens 09:00 tomorrow');
  });
  it('office: Friday night names the next open weekday in the page locale; Karachi keeps its own hours', () => {
    expect(liveStatusText(office, at('2026-09-25T16:00:00Z'), antalya, 'en')).toBe('Closed · opens Monday 09:00');
    expect(liveStatusText(office, at('2026-09-25T16:00:00Z'), antalya, 'tr')).toBe('Closed · opens Pazartesi 09:00');
    expect(liveStatusText(office, at('2026-09-26T07:00:00Z', karachi), karachi, 'en')).toBe('Open now · 12:00 local · closes 19:00');
  });
});
```

`src/app/[locale]/(site)/contact/_lib/__tests__/phone.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatPhoneDisplay } from '../phone';

describe('formatPhoneDisplay', () => {
  it('groups a Turkish E.164 number the way settings.phoneDisplay does', () => {
    expect(formatPhoneDisplay('+905533832549')).toBe('+90 553 383 25 49');
    expect(formatPhoneDisplay('+905011240340')).toBe('+90 501 124 03 40');
  });
  it('leaves a non-Turkish or malformed number as stored', () => {
    expect(formatPhoneDisplay('+923001234567')).toBe('+923001234567');
    expect(formatPhoneDisplay('+90553')).toBe('+90553');
  });
});
```

`src/app/[locale]/(site)/contact/_lib/__tests__/jsonld.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { contactPageJsonLd } from '../jsonld';

const input = {
  name: 'Contact JobsAdmire',
  url: 'https://www.jobsadmire.com/en/contact',
  locale: 'en' as const,
  siteUrl: 'https://www.jobsadmire.com',
  phone: '+905011240340',
  partnershipsPhone: '+905533832549' as string | null,
  email: 'info@jobsadmire.com',
  hours: { days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
};
const hoursAvailable = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '09:00',
  closes: '18:00',
};
const availableLanguage = ['tr', 'en', 'fr', 'hi', 'ru'];

describe('contactPageJsonLd', () => {
  it('names the page, its canonical URL and language, and carries the two contact points from data', () => {
    expect(contactPageJsonLd(input)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact JobsAdmire',
      url: 'https://www.jobsadmire.com/en/contact',
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', url: 'https://www.jobsadmire.com' },
      mainEntity: {
        '@type': 'Organization',
        name: 'JobsAdmire',
        url: 'https://www.jobsadmire.com',
        contactPoint: [
          { '@type': 'ContactPoint', contactType: 'customer service', telephone: '+905011240340', email: 'info@jobsadmire.com', areaServed: 'TR', availableLanguage, hoursAvailable },
          { '@type': 'ContactPoint', contactType: 'partnerships', telephone: '+905533832549', availableLanguage, hoursAvailable },
        ],
      },
    });
  });
  it('drops the partnerships point when settings.partnershipsPhone is null', () => {
    const node = contactPageJsonLd({ ...input, partnershipsPhone: null });
    expect(node.mainEntity.contactPoint).toHaveLength(1);
  });
  it('carries no undefined value anywhere (JSON.stringify would drop it silently)', () => {
    const node = contactPageJsonLd({ ...input, locale: 'tr', url: 'https://www.jobsadmire.com/iletisim', name: 'JobsAdmire ile iletişime geçin' });
    expect(JSON.parse(JSON.stringify(node))).toEqual(node);
  });
});
```

`src/app/[locale]/(site)/contact/_lib/__tests__/copy.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every sys key this page adds (W9/W23) — `messages.test.ts` proves the two files share one key
 *  set; this pins the page's own set, so a renamed key fails here, not in a dev render. */
const KEYS = [
  'seo.contact.title',
  'seo.contact.description',
  'contact.languages.tr',
  'contact.languages.en',
  'contact.languages.fr',
  'contact.languages.hi',
  'contact.languages.ru',
  'contact.channels.whatsapp',
  'contact.channels.open',
  'contact.status.openNow',
  'contact.status.closedOpensAt',
  'contact.status.closedOpensTomorrow',
  'contact.status.closedOpensOn',
  'contact.status.opensAt',
  'contact.status.waWatched',
  'contact.status.waOff',
  'contact.visit.submit',
  'contact.wa.main',
  'contact.wa.jobseeker',
  'contact.wa.visitSite',
  'contact.fallbackIntro.contact',
  'contact.fallbackIntro.callback',
  'contact.fallbackIntro.visit',
  'contact.faq.a3',
  'contact.faq.a5',
] as const;

type Tree = Record<string, unknown>;
const get = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Tree)[k] : undefined), obj);
const leaves = (obj: Tree, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? leaves(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const FILES = [
  ['tr', tr.sys],
  ['en', en.sys],
] as const;

describe('sys.contact.* + sys.seo.contact.*', () => {
  it('pins 25 keys, each a non-empty string in both locales', () => {
    expect(KEYS).toHaveLength(25);
    for (const [, sys] of FILES)
      for (const key of KEYS) {
        const v = get(sys, key);
        expect(typeof v, key).toBe('string');
        expect((v as string).length, key).toBeGreaterThan(0);
      }
  });

  it('adds nothing else under sys.contact (the list above is the whole namespace)', () => {
    const expected = KEYS.filter((k) => k.startsWith('contact.')).map((k) => k.slice('contact.'.length)).sort();
    for (const [, sys] of FILES) expect(leaves(sys.contact as Tree).sort()).toEqual(expected);
  });

  it('is ICU-safe: no ASCII apostrophe (a quote escape in next-intl), typographic ’ only', () => {
    for (const [, sys] of FILES) for (const key of KEYS) expect(get(sys, key), key).not.toMatch(/'/);
  });

  it('the live-status templates carry only {time} {open} {close} {day} — LiveStatus fills them on the client without ICU, so sys.contact stays out of CLIENT_SYS (W148)', () => {
    for (const [, sys] of FILES)
      for (const key of ['openNow', 'closedOpensAt', 'closedOpensTomorrow', 'closedOpensOn', 'opensAt', 'waWatched', 'waOff']) {
        const v = get(sys, `contact.status.${key}`) as string;
        expect(v.replace(/\{(time|open|close|day)\}/g, ''), key).not.toMatch(/[{}#]/);
      }
  });

  it('declares exactly the arguments the page and the island pass', () => {
    for (const [, sys] of FILES) {
      const args = (key: string) => [...(get(sys, key) as string).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      expect(args('contact.status.openNow')).toEqual(['close', 'time']);
      expect(args('contact.status.closedOpensAt')).toEqual(['open', 'time']);
      expect(args('contact.status.closedOpensTomorrow')).toEqual(['open']);
      expect(args('contact.status.closedOpensOn')).toEqual(['day', 'open']);
      expect(args('contact.status.opensAt')).toEqual(['open']);
      expect(args('contact.faq.a3')).toEqual(['hours', 'replyHours']);
      expect(args('contact.faq.a5')).toEqual([]);
    }
  });

  it('the endonym chips are identical in both files (a language names itself)', () => {
    expect(get(tr.sys, 'contact.languages')).toEqual(get(en.sys, 'contact.languages'));
  });

  it('types no figure into the copy (D17): numbers come from the metrics and the offices rows', () => {
    for (const [, sys] of FILES) for (const key of KEYS) expect((get(sys, key) as string).replace('B2B', ''), key).not.toMatch(/\d/);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/\[locale\]/(site)/contact/_lib" --maxWorkers=1
```
Expected: FAIL — `forms.test.ts`, `office-status.test.ts`, `live-status-text.test.ts`, `phone.test.ts`, `jsonld.test.ts` fail at import (`Failed to resolve import "../forms"`, `"../office-status"`, `"../live-status-text"`, `"../phone"`, `"../jsonld"`); `copy.test.ts` fails "pins 25 keys" (`expected 'undefined' to be 'string'` at `seo.contact.title`) and the namespace/ICU/argument cases (`sys.contact` is undefined).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/contact/_lib/options.ts`:

```ts
// The Contact page's stable option keys (W3/W77): what the three forms post and what the islands
// render. No imports on purpose — the client islands read this module, so it must never pull zod
// (or anything else) into the route's client graph; the schemas live in ./forms.ts, which only
// the server action and the tests import (forms.test.ts pins the "no import" rule).

/** The three topics that file a `contact` inquiry — each one a catalog v1.1 `topic` value
 *  (`hire | partner | permit | job | other`, exact lower-case) and a `PARAM_ENUMS.topic` value. */
export const CONTACT_TOPICS = ['hire', 'permit', 'partner'] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

/** The picker adds the job-seeker card (contact.064/065): an explainer and a WhatsApp link, never
 *  a submission — the design refuses to file candidates and W3 keeps that. */
export const PICKER_TOPICS = ['hire', 'permit', 'partner', 'job'] as const;
export type PickerTopic = (typeof PICKER_TOPICS)[number];

/** The catalog `iAm` per topic: a permit-only client already employs the worker, so it is the
 *  employer of record (`direct_employer`); an agency or agent is a `sourcing_partner`. */
export const IAM_BY_TOPIC = {
  hire: 'direct_employer',
  permit: 'direct_employer',
  partner: 'sourcing_partner',
} as const satisfies Record<ContactTopic, 'direct_employer' | 'sourcing_partner'>;

/** The fourth, optional input per topic: the catalog v1.1 `city` for hire and permit; the partner
 *  topic's licence number instead, folded into `message` (W114 — the catalog has no licence). */
export const EXTRA_FIELD = {
  hire: 'city',
  permit: 'city',
  partner: 'licence',
} as const satisfies Record<ContactTopic, 'city' | 'licence'>;

/** "Reply me on" — rides as a `reply: <key>` line inside `message` (no catalog field). */
export const REPLY_CHANNELS = ['whatsapp', 'email', 'call'] as const;
export type ReplyChannel = (typeof REPLY_CHANNELS)[number];

export const CALLBACK_DAYS = ['today', 'tomorrow', 'this_week'] as const;
export type CallbackDay = (typeof CALLBACK_DAYS)[number];

/** The design's four call-back ranges as data: `key` is what `preferredTime` carries, the chip label
 *  is `from–to` (clock times read the same in both locales — no copy); `any` is labelled by
 *  contact.209. */
export const CALLBACK_SLOTS = [
  { key: '09-11', from: '09:00', to: '11:00' },
  { key: '11-13', from: '11:00', to: '13:00' },
  { key: '14-16', from: '14:00', to: '16:00' },
  { key: '16-18', from: '16:00', to: '18:00' },
] as const;
export const CALLBACK_SLOT_KEYS = ['09-11', '11-13', '14-16', '16-18', 'any'] as const;
export type CallbackSlot = (typeof CALLBACK_SLOT_KEYS)[number];

export const VISIT_SLOTS = ['09:30', '11:00', '13:30', '15:00', '16:30'] as const;
export type VisitSlot = (typeof VISIT_SLOTS)[number];

/** `visit.office` — the one office that takes visitors (the Antalya head office). */
export const VISIT_OFFICE = 'antalya' as const;

/** The hero's language chips and the ContactPage node's `availableLanguage` (BCP 47). */
export const LANGUAGE_CODES = ['tr', 'en', 'fr', 'hi', 'ru'] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];
```

`src/app/[locale]/(site)/contact/_lib/forms.ts`:

```ts
// The Contact page's three door-backed forms (W3): Zod schemas and the `toFields` mappers onto the
// door's catalog names (Ops `website-form-catalog.ts` v1.0 + the confirmed v1.1 `city`/`topic`;
// docs/INTEGRATIONS.md I4). Input names ARE the catalog names (W114) — `subject`, `city` — so the
// D11 fallback prefill (FallbackPanel's WHATSAPP_FIELDS) carries the visitor's main request; the
// partner licence is its own `licence` input folded into `message`. No directive: ../actions.ts
// wraps these in `'use server'`; client code imports ./options.ts, never this module.
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';
import {
  CALLBACK_DAYS,
  CALLBACK_SLOT_KEYS,
  CONTACT_TOPICS,
  IAM_BY_TOPIC,
  REPLY_CHANNELS,
  VISIT_OFFICE,
  VISIT_SLOTS,
} from './options';

// `.min(1)` before `.email()`: an empty value reads `required`, not `email` (src/forms/errors.ts).
const email = z.string().min(1).max(254).email();
// The door keeps the number as typed and counts digits (catalog type `phone`: ≥ 8) — the same rule
// here, so a short number is a field error, never a 400 `invalid` panel. `.min(1)` first: an empty
// phone reads `required`; the refinement's `phone` code follows only a typed value.
const phone = z
  .string()
  .min(1)
  .max(40)
  .refine((v) => v.replace(/\D/g, '').length >= 8, { message: 'phone' });

export const contactSchema = z.object({
  topic: z.enum(CONTACT_TOPICS),
  company: z.string().min(1).max(200),
  name: z.string().min(1).max(120),
  email,
  phone,
  /** The topic's required line: roles and headcount · worker and role · what you supply. */
  subject: z.string().min(1).max(200),
  /** Catalog v1.1 `city` (≤ 120): the city in Türkiye (hire) · the workplace city (permit). */
  city: z.string().max(120).optional(),
  /** The partner topic's licence number — folded into `message`. */
  licence: z.string().max(200).optional(),
  reply: z.enum(REPLY_CHANNELS).optional(),
  message: z.string().max(4000).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** The door requires `message` (≤ 5000): the subject first (so it is never empty), then the
 *  partner licence and the reply channel as `key: value` lines — language-neutral, the Ops inbox is
 *  not visitor copy (W77) — then the free notes after a blank line. At the schema maxima:
 *  200 + 1 + 209 + 1 + 12 + 2 + 4000 < 5000. */
export function composeContactMessage(p: ContactInput): string {
  const lines = [p.subject];
  if (p.topic === 'partner' && p.licence) lines.push(`licence: ${p.licence}`);
  if (p.reply) lines.push(`reply: ${p.reply}`);
  if (p.message) lines.push('', p.message);
  return lines.join('\n');
}

export function toContactFields(p: ContactInput): WireFields {
  const fields: WireFields = {
    name: p.name,
    email: p.email,
    phone: p.phone,
    company: p.company,
    topic: p.topic,
    iAm: IAM_BY_TOPIC[p.topic],
    subject: p.subject,
    message: composeContactMessage(p),
  };
  // Catalog v1.1 `city` — hire and permit only; a stray `city` on a partner post is ignored.
  if (p.topic !== 'partner' && p.city) fields.city = p.city;
  return fields;
}

export const callbackSchema = z.object({
  name: z.string().min(1).max(120),
  phone,
  day: z.enum(CALLBACK_DAYS).optional(),
  slot: z.enum(CALLBACK_SLOT_KEYS).optional(),
});
export type CallbackInput = z.infer<typeof callbackSchema>;

/** `preferredTime` (≤ 120) carries the chosen keys — `"tomorrow 14-16"`, `"today any"`, the day
 *  alone or nothing — never the localized chip labels (W77). */
export function toCallbackFields(p: CallbackInput): WireFields {
  const fields: WireFields = { name: p.name, phone: p.phone };
  const when = [p.day, p.slot].filter(Boolean).join(' ');
  if (when) fields.preferredTime = when;
  return fields;
}

export const visitSchema = z.object({
  name: z.string().min(1).max(120),
  email,
  phone,
  /** An ISO date from the day chips, or what the visitor typed before the chips hydrated. */
  preferredDate: z.string().max(40).optional(),
  preferredTime: z.enum(VISIT_SLOTS).optional(),
});
export type VisitInput = z.infer<typeof visitSchema>;

export function toVisitFields(p: VisitInput): WireFields {
  const fields: WireFields = { name: p.name, email: p.email, phone: p.phone, office: VISIT_OFFICE };
  if (p.preferredDate) fields.preferredDate = p.preferredDate;
  if (p.preferredTime) fields.preferredTime = p.preferredTime;
  return fields;
}
```

`src/app/[locale]/(site)/contact/_lib/office-status.ts`:

```ts
// Pure office-hours arithmetic over the `offices` rows' `hours` ({ tz, days — JS getDay() 0 = Sun
// … 6 = Sat (W43) — open, close }). Every function takes `now` as an argument, so the tests pin
// fixed instants and the islands feed it the page's minute clock (R18). `Intl` only — no date
// library reaches the client (W13). Both offices sit in zones without DST (Istanbul since 2016,
// Karachi), so a 24 h step is one calendar day.

export type OfficeHours = { tz: string; days: number[]; open: string; close: string };

export type OfficeStatus =
  | { open: true; clock: string }
  | {
      open: false;
      clock: string;
      reason: 'beforeOpen' | 'afterClose' | 'closedDay';
      /** JS getDay() index of the next open day — today when `beforeOpen`. */
      nextOpenDay: number;
      opensTomorrow: boolean;
    };

const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Weekday and wall clock of `now` in `tz` (`en-GB` parts are stable across engines; `h23` and the
 *  `% 24` guard keep midnight at `00`). */
export function localParts(now: Date, tz: string): { day: number; minutes: number; clock: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  const h = Number(get('hour')) % 24;
  const m = Number(get('minute'));
  const day = WEEKDAY_INDEX[get('weekday')];
  if (day === undefined) throw new RangeError(`localParts: no weekday for zone ${tz}`);
  return {
    day,
    minutes: h * 60 + m,
    clock: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
  };
}

const toMinutes = (hhmm: string): number => {
  const [h = 0, m = 0] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Open or closed at `now`, and when the office opens next. A row with no open day is a data
 *  defect: closed, never a throw on a live page. */
export function officeStatus(now: Date, hours: OfficeHours): OfficeStatus {
  const { day, minutes, clock } = localParts(now, hours.tz);
  const openAt = toMinutes(hours.open);
  const closeAt = toMinutes(hours.close);
  const todayOpen = hours.days.includes(day);
  if (todayOpen && minutes >= openAt && minutes < closeAt) return { open: true, clock };
  if (todayOpen && minutes < openAt)
    return { open: false, clock, reason: 'beforeOpen', nextOpenDay: day, opensTomorrow: false };
  for (let d = 1; d <= 7; d++) {
    const next = (day + d) % 7;
    if (hours.days.includes(next))
      return {
        open: false,
        clock,
        reason: todayOpen ? 'afterClose' : 'closedDay',
        nextOpenDay: next,
        opensTomorrow: d === 1,
      };
  }
  return { open: false, clock, reason: 'closedDay', nextOpenDay: day, opensTomorrow: false };
}

/** Localized long weekday name for a JS getDay() index (2023-01-01 was a Sunday). */
export function weekdayName(day: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2023, 0, 1 + day)),
  );
}

/** The next `count` open days AFTER today in the office's zone (the design's visit chips start
 *  tomorrow), as ISO calendar dates; looks at most 21 days ahead. */
export function nextOpenDates(now: Date, hours: OfficeHours, count: number): string[] {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: hours.tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  const out: string[] = [];
  for (let offset = 1; offset <= 21 && out.length < count; offset++) {
    const parts = fmt.formatToParts(new Date(now.getTime() + offset * 86_400_000));
    const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
    const day = WEEKDAY_INDEX[get('weekday')];
    if (day === undefined || !hours.days.includes(day)) continue;
    out.push(`${get('year')}-${get('month')}-${get('day')}`);
  }
  return out;
}

/** "Mon 28 Sept" / "28 Eyl Pzt" for an ISO calendar date — formatted in UTC so the runtime zone
 *  can never shift the day. */
export function formatVisitDay(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}
```

`src/app/[locale]/(site)/contact/_lib/live-status-text.ts`:

```ts
// The text of one live-status pill (pure — the island feeds it the minute clock). The labels arrive
// resolved from the server: the package's own split fragments (contact.152–155, 215, 216) and the
// raw `sys.contact.status.*` templates, whose only syntax is `{time}` `{open}` `{close}` `{day}`
// (copy.test.ts pins that), so `fillTemplate` is all the formatting they need and no client module
// has to read `sys.contact` — CLIENT_SYS stays as it is (W148).
import { weekdayName, type OfficeHours, type OfficeStatus } from './office-status';

export type HeroStatusLabels = {
  /** contact.152 "Office open now ·" */ openNow: string;
  /** contact.153 "in Antalya" */ inCity: string;
  /** contact.154 */ weekend: string;
  /** contact.155 */ closedToday: string;
  /** sys.contact.status.opensAt — "Opens {open}" */ opensAt: string;
};
export type WhatsappStatusLabels = { watched: string; off: string };
export type LinesStatusLabels = { open: string; closed: string };
export type OfficeStatusLabels = {
  openNow: string;
  closedOpensAt: string;
  closedOpensTomorrow: string;
  closedOpensOn: string;
};

export type LiveStatusSpec =
  | { variant: 'hero'; labels: HeroStatusLabels }
  | { variant: 'whatsapp'; labels: WhatsappStatusLabels }
  | { variant: 'lines'; labels: LinesStatusLabels }
  | { variant: 'office'; labels: OfficeStatusLabels };

/** `{name}` substitution; an unknown argument stays visible (a copy defect shows, never throws). */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) => values[key] ?? token);
}

export function liveStatusText(
  spec: LiveStatusSpec,
  status: OfficeStatus,
  hours: OfficeHours,
  locale: string,
): string {
  switch (spec.variant) {
    case 'hero': {
      const l = spec.labels;
      if (status.open) return `${l.openNow} ${status.clock} ${l.inCity}`;
      if (status.reason === 'closedDay') return l.weekend;
      if (status.reason === 'beforeOpen')
        return `${fillTemplate(l.opensAt, { open: hours.open })} · ${status.clock} ${l.inCity}`;
      return `${l.closedToday} · ${status.clock} ${l.inCity}`;
    }
    case 'whatsapp':
      return status.open ? spec.labels.watched : spec.labels.off;
    case 'lines':
      return status.open ? spec.labels.open : spec.labels.closed;
    case 'office': {
      const l = spec.labels;
      if (status.open) return fillTemplate(l.openNow, { time: status.clock, close: hours.close });
      if (status.reason === 'beforeOpen')
        return fillTemplate(l.closedOpensAt, { open: hours.open, time: status.clock });
      if (status.opensTomorrow) return fillTemplate(l.closedOpensTomorrow, { open: hours.open });
      return fillTemplate(l.closedOpensOn, {
        day: weekdayName(status.nextOpenDay, locale),
        open: hours.open,
      });
    }
  }
}
```

`src/app/[locale]/(site)/contact/_lib/phone.ts`:

```ts
/** `settings.phoneDisplay` exists for the main line only; the partnerships line
 *  (`settings.partnershipsPhone`, E.164) gets the same "+90 553 383 25 49" grouping the design
 *  shows. Turkish numbers (+90 and ten digits) only — anything else renders as stored. */
export function formatPhoneDisplay(e164: string): string {
  const m = /^\+90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return m ? `+90 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : e164;
}
```

`src/app/[locale]/(site)/contact/_lib/jsonld.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import { LANGUAGE_CODES } from './options';

/** schema.org day names by JS getDay() index (W43). */
const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export type ContactPageJsonLdInput = {
  /** contact.228 */
  name: string;
  /** absoluteUrl(locale, '/contact') — never the design's /contact-us */
  url: string;
  locale: Locale;
  siteUrl: string;
  phone: string;
  partnershipsPhone: string | null;
  email: string;
  /** the Antalya `offices` row's hours — the lines' hours */
  hours: { days: number[]; open: string; close: string };
};

/** The page's own node (docs/SEO.md § Pages). The site-wide Organization/EmploymentAgency node in
 *  the locale layout keeps the addresses, the permit and the social profiles; this node names the
 *  page and carries what only the contact page states — the two lines, their languages and hours —
 *  built from settings and the `offices` row, never hand-typed. */
export function contactPageJsonLd(input: ContactPageJsonLdInput) {
  const hoursAvailable = {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: input.hours.days.map((d) => SCHEMA_DAYS[d]),
    opens: input.hours.open,
    closes: input.hours.close,
  };
  const availableLanguage = [...LANGUAGE_CODES];
  const contactPoint: Record<string, unknown>[] = [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: input.phone,
      email: input.email,
      areaServed: 'TR',
      availableLanguage,
      hoursAvailable,
    },
  ];
  if (input.partnershipsPhone)
    contactPoint.push({
      '@type': 'ContactPoint',
      contactType: 'partnerships',
      telephone: input.partnershipsPhone,
      availableLanguage,
      hoursAvailable,
    });
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: input.name,
    url: input.url,
    inLanguage: input.locale,
    isPartOf: { '@type': 'WebSite', url: input.siteUrl },
    mainEntity: { '@type': 'Organization', name: 'JobsAdmire', url: input.siteUrl, contactPoint },
  };
}
```

`src/messages/en.json` — inside `"sys"`: add `"contact"` to the existing `"seo"` object (beside `"ogTagline"` and the `seo.<pageKey>` objects earlier page tasks added), and add a new top-level `"contact"` object in `"sys"` beside the other `sys.<page>` namespaces. Typographic apostrophes (’) only.

```json
"seo": {
  "contact": {
    "title": "Contact JobsAdmire — Licensed Recruitment Agency in Türkiye",
    "description": "Call or WhatsApp the JobsAdmire head office in Antalya: one number for worker requests, permits and partnerships, answered by a real person in office hours."
  }
},
"contact": {
  "languages": { "tr": "Türkçe", "en": "English", "fr": "Français", "hi": "हिन्दी", "ru": "Русский" },
  "channels": { "whatsapp": "WhatsApp", "open": "Open WhatsApp →" },
  "status": {
    "openNow": "Open now · {time} local · closes {close}",
    "closedOpensAt": "Closed · opens {open} · {time} local",
    "closedOpensTomorrow": "Closed · opens {open} tomorrow",
    "closedOpensOn": "Closed · opens {day} {open}",
    "opensAt": "Opens {open}",
    "waWatched": "Watched now — a live agent replies in office hours",
    "waOff": "Off hours — expect a reply the next business morning"
  },
  "visit": { "submit": "Request a visit slot" },
  "wa": {
    "main": "Hello JobsAdmire, I have a question about hiring workers in Türkiye.",
    "jobseeker": "Hello JobsAdmire, I am a candidate. My country: ___ / My trade: ___. Please send me the contact of your verified sourcing partner in my country.",
    "visitSite": "Hello JobsAdmire, I would like a site visit before deciding on worker numbers."
  },
  "fallbackIntro": {
    "contact": "Hello JobsAdmire, the contact form on your website did not go through. My enquiry:",
    "callback": "Hello JobsAdmire, the callback form did not go through — please call me back. My details:",
    "visit": "Hello JobsAdmire, the visit booking form did not go through — I would like to visit the Antalya office. My details:"
  },
  "faq": {
    "a3": "WhatsApp is the fastest channel in office hours ({hours}, Turkish time); e-mail is answered within about {replyHours} business hours. Messages sent at night or over the weekend are picked up the next business morning.",
    "a5": "Yes, but JobsAdmire does not take individual applications directly: it is a B2B agency and works through verified sourcing partners in your country. Pick “I am looking for a job” above and send a message; JobsAdmire replies with the verified partner’s contact. JobsAdmire never charges a worker a placement fee — if anyone asks you for money in its name, report it on WhatsApp."
  }
}
```

(The `"seo"` fragment shows only the key this task adds — keep every existing `seo` leaf.)

`src/messages/tr.json` — the same keys:

```json
"seo": {
  "contact": {
    "title": "JobsAdmire İletişim — Türkiye’de Lisanslı İşe Alım Ajansı",
    "description": "JobsAdmire Antalya merkez ofisini arayın ya da WhatsApp’tan yazın: işçi talebi, çalışma izni ve iş ortaklığı için tek numara, mesai saatlerinde gerçek bir kişi."
  }
},
"contact": {
  "languages": { "tr": "Türkçe", "en": "English", "fr": "Français", "hi": "हिन्दी", "ru": "Русский" },
  "channels": { "whatsapp": "WhatsApp", "open": "WhatsApp’ı açın →" },
  "status": {
    "openNow": "Şu anda açık · yerel saat {time} · kapanış {close}",
    "closedOpensAt": "Kapalı · açılış {open} · yerel saat {time}",
    "closedOpensTomorrow": "Kapalı · yarın açılış {open}",
    "closedOpensOn": "Kapalı · açılış {day} {open}",
    "opensAt": "Açılış {open}",
    "waWatched": "Şu anda takipte — mesai saatlerinde canlı temsilci yanıtlıyor",
    "waOff": "Mesai dışı — yanıt bir sonraki iş günü sabahı gelir"
  },
  "visit": { "submit": "Ziyaret saati talep edin" },
  "wa": {
    "main": "Merhaba JobsAdmire, Türkiye’de işçi istihdamı hakkında bir sorum var.",
    "jobseeker": "Merhaba JobsAdmire, adayım. Ülkem: ___ / Mesleğim: ___. Lütfen ülkemdeki doğrulanmış tedarik ortağınızın iletişim bilgisini gönderin.",
    "visitSite": "Merhaba JobsAdmire, işçi sayısına karar vermeden önce işyerime bir saha ziyareti istiyorum."
  },
  "fallbackIntro": {
    "contact": "Merhaba JobsAdmire, web sitenizdeki iletişim formu gönderilemedi. Talebim:",
    "callback": "Merhaba JobsAdmire, geri arama formu gönderilemedi — lütfen beni geri arayın. Bilgilerim:",
    "visit": "Merhaba JobsAdmire, ziyaret formu gönderilemedi — Antalya ofisini ziyaret etmek istiyorum. Bilgilerim:"
  },
  "faq": {
    "a3": "Mesai saatlerinde ({hours}, Türkiye saati) en hızlı kanal WhatsApp’tır; e-postalar yaklaşık {replyHours} iş saati içinde yanıtlanır. Gece ya da hafta sonu gönderilen mesajlar bir sonraki iş günü sabahı ele alınır.",
    "a5": "Evet, ancak JobsAdmire bireysel başvuruları doğrudan almaz: B2B bir ajanstır ve ülkenizdeki doğrulanmış tedarik ortakları aracılığıyla çalışır. Yukarıdan “İş arıyorum” seçeneğini seçip mesaj gönderin; JobsAdmire size doğrulanmış ortağın iletişim bilgisini iletir. JobsAdmire bir işçiden asla yerleştirme ücreti almaz — biri JobsAdmire adına sizden para isterse WhatsApp’tan bildirin."
  }
}
```

The TR status lines avoid a case suffix after a clock time (`09:00’da`/`08:00’de` would depend on the figure the data carries). Every string passes `src/messages/voice.test.ts` (W154): the prefills and fallback intros are the visitor's first-person singular (`sorum`, `adayım`, `istiyorum`, `Talebim`, "I have", "my"), never "we"/"biz"; the answers name "JobsAdmire".

`docs/CONTENT-MODEL.md` — in `### Adding copy (W9, W23, W54)`, append after the last bullet of the per-page `sys.*` list T1 created (the list introduced by "**Per-page `sys.*` copy (WP2b, W98).**"), before the heading `### Deliberately-empty Turkish fragments`:

```markdown
- **Contact (`sys.contact.*` + `sys.seo.contact.*`, WP2b T7):** `languages.{tr,en,fr,hi,ru}` (the hero's endonym chips — identical in both files on purpose, each chip carries its own `lang`; `contact.224`–`227` are exonyms the design used only in its JSON-LD), `channels.{whatsapp,open}` (the WhatsApp card's eyebrow and reply-chip label; the card's ≤ 700 px "Open WhatsApp →" — real markup instead of the design's CSS `::after`, D20), `status.{openNow,closedOpensAt,closedOpensTomorrow,closedOpensOn,opensAt,waWatched,waOff}` (templates whose only syntax is `{time}` `{open}` `{close}` `{day}` — the page passes them raw (`sys.raw`) and the `LiveStatus` island fills them from the `offices` hours on the client, so no client module reads `sys.contact` and `CLIENT_SYS` is unchanged, W148; the hero pill composes the package's own split fragments `contact.152`–`155`, the phone cards `contact.215`/`216` + `contact.135`), `visit.submit` (replaces `contact.118` "Book on WhatsApp" — the request now files through the door), `wa.{main,jobseeker,visitSite}` (company-authored WhatsApp prefills in the visitor's first-person singular — `jobseeker` keeps the design's `___` blanks; no visitor data ever joins them, W95), `fallbackIntro.{contact,callback,visit}` (each form's D11 WhatsApp intro, visitor voice), `faq.{a3,a5}` (the two FAQ answers the package ships without ids; `a3` takes `{hours}` = `contact.135` and `{replyHours}` = the `replySlaHours` metric, D17); plus `seo.contact.{title,description}` (the record carries no package SEO string). The callback slot labels are formatted from `CALLBACK_SLOTS` (`09:00–11:00` — clock times read the same in both locales) with `contact.209` for "any time"; the visit day chips come from `Intl` — neither needs a key. `src/app/[locale]/(site)/contact/_lib/__tests__/copy.test.ts` pins the 25 keys, their arguments and "no figure in the copy".
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/contact/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `forms.test.ts` (21), `office-status.test.ts` (13), `live-status-text.test.ts` (6), `phone.test.ts` (2), `jsonld.test.ts` (3), `copy.test.ts` (7) pass; `src/messages/messages.test.ts` (identical key sets), `voice.test.ts` (no first-person plural in any new string) and `client-messages.test.ts` (no client module added yet) stay green.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add "src/app/[locale]/(site)/contact/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md && git commit -m "feat(contact): form specs onto the door catalog, office-hours arithmetic, pill text, ContactPage node, sys.contact copy (T7 c1)

W3/W16/W77/W114: contact (topic + iAm + subject + v1.1 city), callback (name added,
preferredTime keys), visit (name/email/phone added, office antalya); input names are the
catalog names; the licence folds into message; the job-seeker topic never files. options.ts
is zod-free so the islands never ship the schemas (W13). 25 sys keys, both locales (W9/W23),
voice-clean (W154); CONTENT-MODEL per-page bullet (W98).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — the three server actions and the `contact`/`callback`/`visit` wire contract (Vitest, door stubbed)

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/contact/__tests__/actions.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { IDLE_FORM_STATE } from '@/forms/types';
import { submitCallback, submitContact, submitVisit } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each is
// a recorded stub (the pattern of src/forms/__tests__/action.test.ts). `postForm` is the door,
// stubbed door-less (`unauthorized` — what every face but `staging`/production answers, W92)
// unless a case says otherwise.
const mocks = vi.hoisted(() => ({
  getLocale: vi.fn(async (): Promise<string> => 'tr'),
  headersStore: new Map<string, string>(),
  redirect: vi.fn((args: unknown): never => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT', args });
  }),
  postForm: vi.fn(),
}));

vi.mock('next-intl/server', () => ({ getLocale: mocks.getLocale }));
vi.mock('next/headers', () => ({
  headers: async () => ({ get: (k: string) => mocks.headersStore.get(k.toLowerCase()) ?? null }),
}));
vi.mock('@/i18n/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/forms/post', () => ({ postForm: mocks.postForm }));

/** The Operations catalog per key — v1.0 + the confirmed v1.1 optional fields (A/produces-final
 *  § Task 8 as built). Anything else inside `fields` would be dropped silently with a 200. */
const CATALOG = {
  contact: ['name', 'email', 'phone', 'company', 'country', 'iAm', 'subject', 'message', 'city', 'topic'],
  callback: ['name', 'phone', 'email', 'preferredTime', 'topic', 'city'],
  visit: ['name', 'company', 'email', 'phone', 'office', 'preferredDate', 'preferredTime', 'message'],
} as const;

type Envelope = { locale: string; consentVersion: string; sourcePath?: string; fields: Record<string, string> };
function sent(): { key: string; envelope: Envelope } {
  expect(mocks.postForm).toHaveBeenCalledTimes(1);
  const [key, envelope] = mocks.postForm.mock.calls[0] as [string, Envelope];
  return { key, envelope };
}

function formData(entries: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.append(k, v);
  return fd;
}

const ok = { kind: 'ok', id: 'sub_1', status: 'RECEIVED', isTest: false, replayed: false, captchaDegraded: false, error: null } as const;

const hire = {
  topic: 'hire',
  company: 'Akdeniz Otel A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 532 000 00 00',
  subject: '10 kaynakçı, 4 CNC operatörü',
  city: 'Antalya',
  reply: 'whatsapp',
  message: 'Mart başında başlasınlar.',
  consent: 'on',
  honeypot: '',
};

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/iletisim');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
});

describe('submitContact — the topic enquiry → contact (W3/W16)', () => {
  it('sends contact catalog names only: topic, iAm, subject, the composed message, v1.1 city; no door → the D11 state', async () => {
    const state = await submitContact(IDLE_FORM_STATE, formData(hire));
    const { key, envelope } = sent();
    expect(key).toBe('contact');
    expect(envelope).toMatchObject({ locale: 'tr', consentVersion: CONSENT_VERSION, sourcePath: '/iletisim' });
    expect(envelope.fields).toEqual({
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      phone: '+90 532 000 00 00',
      company: 'Akdeniz Otel A.Ş.',
      topic: 'hire',
      iAm: 'direct_employer',
      subject: '10 kaynakçı, 4 CNC operatörü',
      message: '10 kaynakçı, 4 CNC operatörü\nreply: whatsapp\n\nMart başında başlasınlar.',
      city: 'Antalya',
    });
    for (const name of Object.keys(envelope.fields)) expect(CATALOG.contact).toContain(name);
    // D11/W92: no door → the fallback panel state, the typed values echoed for its prefill.
    expect(state).toMatchObject({ status: 'error', result: { kind: 'unauthorized' }, values: { company: 'Akdeniz Otel A.Ş.', subject: '10 kaynakçı, 4 CNC operatörü' } });
  });

  it('partner: sourcing_partner, the licence as a message line, no city even when one is posted', async () => {
    await submitContact(IDLE_FORM_STATE, formData({ ...hire, topic: 'partner', company: 'Skyline Manpower, Nepal', subject: 'kaynakçı ve duvarcı, 200 kişi', licence: 'NP-1234', city: 'Katmandu', reply: 'email', message: '' }));
    const { envelope } = sent();
    expect(envelope.fields).toMatchObject({ topic: 'partner', iAm: 'sourcing_partner', message: 'kaynakçı ve duvarcı, 200 kişi\nlicence: NP-1234\nreply: email' });
    expect(envelope.fields).not.toHaveProperty('city');
    expect(envelope.fields).not.toHaveProperty('licence');
  });

  it('a tampered job topic is a field error and never reaches the door (W3)', async () => {
    const state = await submitContact(IDLE_FORM_STATE, formData({ ...hire, topic: 'job' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { topic: 'invalid' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('an unticked consent box is the consent error (W79)', async () => {
    const unticked = Object.fromEntries(Object.entries(hire).filter(([key]) => key !== 'consent'));
    const state = await submitContact(IDLE_FORM_STATE, formData(unticked));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { consent: 'consent' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('a received submission navigates to /tesekkurler?form=contact (D13)', async () => {
    mocks.postForm.mockResolvedValue(ok);
    await expect(submitContact(IDLE_FORM_STATE, formData(hire))).rejects.toThrow('NEXT_REDIRECT');
    expect(mocks.redirect).toHaveBeenCalledWith({ href: { pathname: '/thank-you', query: { form: 'contact' } }, locale: 'tr' });
  });
});

describe('submitCallback — the callback widget → callback (W3: name added)', () => {
  it('sends name, phone and the day/slot keys as preferredTime', async () => {
    mocks.getLocale.mockResolvedValue('en');
    const state = await submitCallback(IDLE_FORM_STATE, formData({ name: 'Mehmet Kaya', phone: '+90 532 000 00 00', day: 'tomorrow', slot: '14-16', consent: 'on' }));
    const { key, envelope } = sent();
    expect(key).toBe('callback');
    expect(envelope.locale).toBe('en');
    expect(envelope.fields).toEqual({ name: 'Mehmet Kaya', phone: '+90 532 000 00 00', preferredTime: 'tomorrow 14-16' });
    for (const name of Object.keys(envelope.fields)) expect(CATALOG.callback).toContain(name);
    expect(state).toMatchObject({ status: 'error', result: { kind: 'unauthorized' } });
  });

  it('refuses a missing name before the door', async () => {
    const state = await submitCallback(IDLE_FORM_STATE, formData({ phone: '+90 532 000 00 00', day: 'today', consent: 'on' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { name: 'required' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });
});

describe('submitVisit — book-a-visit → visit (W3: name/email/phone added)', () => {
  it('sends the trio, office antalya and the chosen date/time', async () => {
    await submitVisit(IDLE_FORM_STATE, formData({ name: 'Ayşe Yılmaz', email: 'ayse@example.com', phone: '+90 532 000 00 00', preferredDate: '2026-10-01', preferredTime: '11:00', consent: 'on' }));
    const { key, envelope } = sent();
    expect(key).toBe('visit');
    expect(envelope.fields).toEqual({ name: 'Ayşe Yılmaz', email: 'ayse@example.com', phone: '+90 532 000 00 00', office: 'antalya', preferredDate: '2026-10-01', preferredTime: '11:00' });
    for (const name of Object.keys(envelope.fields)) expect(CATALOG.visit).toContain(name);
  });

  it('a time outside the five slots is a field error', async () => {
    const state = await submitVisit(IDLE_FORM_STATE, formData({ name: 'A', email: 'a@b.co', phone: '05320000000', preferredTime: '12:00', consent: 'on' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { preferredTime: 'invalid' } });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/\[locale\]/(site)/contact/__tests__/actions.test.ts" --maxWorkers=1
```
Expected: FAIL — `Failed to resolve import "../actions"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/contact/actions.ts`:

```ts
'use server';
// The Contact page's three server actions (W3): the kernel's `createFormAction` (server-only)
// wrapped in this `'use server'` module — one exported async function per form, the only exports
// a `'use server'` module may carry. The specs are pure and tested in ./_lib/forms.ts; the kernel
// checks the consent tick (W79), validates, posts, and redirects to /tesekkurler?form=<key> (D13).
import { createFormAction, type FormActionState } from '@/forms/action';
import {
  callbackSchema,
  contactSchema,
  toCallbackFields,
  toContactFields,
  toVisitFields,
  visitSchema,
} from './_lib/forms';

const runContact = createFormAction({
  key: 'contact',
  schema: contactSchema,
  toFields: toContactFields,
  consent: 'checkbox',
});
const runCallback = createFormAction({
  key: 'callback',
  schema: callbackSchema,
  toFields: toCallbackFields,
  consent: 'checkbox',
});
const runVisit = createFormAction({
  key: 'visit',
  schema: visitSchema,
  toFields: toVisitFields,
  consent: 'checkbox',
});

export async function submitContact(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runContact(prev, data);
}

export async function submitCallback(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runCallback(prev, data);
}

export async function submitVisit(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runVisit(prev, data);
}
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/contact/actions.ts" "src/app/[locale]/(site)/contact/__tests__" && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `actions.test.ts` (9) passes (the tampered topic reads `invalid`: Zod's `invalid_enum_value` with a non-empty value; the missing name reads `required`: `invalid_type` on `undefined`), and every Cycle 1 file stays green. `unbuilt.test.ts` is unaffected (no `page.tsx` yet).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add "src/app/[locale]/(site)/contact/actions.ts" "src/app/[locale]/(site)/contact/__tests__/actions.test.ts" && git commit -m "feat(contact): the three server actions — contact, callback, visit — with the wire contract pinned (T7 c2)

W3/W16/W79: consent checkbox on all three; every field sent is a catalog v1.0/v1.1 name;
a tampered job topic never reaches the door; no door → the D11 state (W92); success →
/tesekkurler?form=contact (D13).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — the client islands: the minute clock, `LiveStatus`, the topic enquiry, the callback widget, book-a-visit

Hydration rule (R18, the pattern `use-alternate-path.ts` and `useScrollProgress.ts` use): the server and the hydrating render show the neutral fallback (the office row's own hours string; the visit card's plain date input); the client value arrives through `useSyncExternalStore` — never through `setState` in an effect (`react-hooks/set-state-in-effect` is enforced by `eslint-config-next` 16). One module-level minute clock serves every pill and the visit chips. No island calls `useTranslations` (W148): every string arrives resolved from the server; the kernel reads `sys.form` itself.

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/contact/_components/__tests__/LiveStatus.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveStatus } from '../LiveStatus';

const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const officeLabels = {
  openNow: 'Open now · {time} local · closes {close}',
  closedOpensAt: 'Closed · opens {open} · {time} local',
  closedOpensTomorrow: 'Closed · opens {open} tomorrow',
  closedOpensOn: 'Closed · opens {day} {open}',
};
const FALLBACK = 'Mon–Fri · 09:00–18:00 (TRT)';

describe('LiveStatus', () => {
  // Only Date is faked: the page clock's interval stays real and is cleared on unmount.
  beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }));
  afterEach(() => vi.useRealTimers());

  it('server render: the office row’s hours, a neutral dot, no data-open — the markup hydration expects (R18)', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z'));
    const html = renderToStaticMarkup(
      <LiveStatus variant="office" hours={antalya} locale="en" fallback={FALLBACK} labels={officeLabels} />,
    );
    expect(html).toContain(FALLBACK);
    expect(html).toContain('bg-muted');
    expect(html).not.toContain('data-open');
  });

  it('client render: the computed line and data-open="true" inside the hours', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z')); // Wednesday 10:32 in Istanbul
    render(<LiveStatus variant="office" hours={antalya} locale="en" fallback={FALLBACK} labels={officeLabels} />);
    const pill = screen.getByTestId('live-status');
    expect(pill).toHaveTextContent('Open now · 10:32 local · closes 18:00');
    expect(pill).toHaveAttribute('data-open', 'true');
    expect(pill).toHaveAttribute('data-variant', 'office');
  });

  it('Friday night names Monday in the page locale', () => {
    vi.setSystemTime(new Date('2026-09-25T16:00:00Z'));
    render(<LiveStatus variant="office" hours={antalya} locale="tr" fallback={FALLBACK} labels={{ ...officeLabels, closedOpensOn: 'Kapalı · açılış {day} {open}' }} />);
    expect(screen.getByTestId('live-status')).toHaveTextContent('Kapalı · açılış Pazartesi 09:00');
    expect(screen.getByTestId('live-status')).toHaveAttribute('data-open', 'false');
  });

  it('lines appends the page’s hours suffix; hero composes the package split', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z'));
    render(
      <>
        <LiveStatus variant="lines" hours={antalya} locale="en" fallback="Mon–Fri 09:00–18:00" suffix="Mon–Fri 09:00–18:00" labels={{ open: 'Lines open now', closed: 'Lines closed' }} />
        <LiveStatus variant="hero" hours={antalya} locale="en" fallback={FALLBACK} labels={{ openNow: 'Office open now ·', inCity: 'in Antalya', weekend: 'Weekend · WhatsApp is still watched', closedToday: 'Closed for today', opensAt: 'Opens {open}' }} />
      </>,
    );
    const [lines, hero] = screen.getAllByTestId('live-status');
    expect(lines).toHaveTextContent('Lines open now · Mon–Fri 09:00–18:00');
    expect(hero).toHaveTextContent('Office open now · 10:32 in Antalya');
  });

  it('whatsapp: the off-hours line at the weekend', () => {
    vi.setSystemTime(new Date('2026-09-26T09:00:00Z')); // Saturday
    render(<LiveStatus variant="whatsapp" hours={antalya} locale="en" fallback={FALLBACK} labels={{ watched: 'Watched now', off: 'Off hours' }} />);
    expect(screen.getByTestId('live-status')).toHaveTextContent('Off hours');
  });
});
```

`src/app/[locale]/(site)/contact/_components/__tests__/ContactEnquiry.test.tsx`:

```tsx
import { fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import en from '@/messages/en.json';
import { renderWithIntl } from '@/test/render';
import { ContactEnquiry, type ContactEnquiryCopy } from '../ContactEnquiry';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));

const copy: ContactEnquiryCopy = {
  legend: 'What is this about?',
  topics: {
    hire: { label: 'I need workers', sub: 'Roles, headcount and a quote' },
    permit: { label: 'Work permit only', sub: 'You already have the worker' },
    partner: { label: 'Agency or agent', sub: 'Supply or partner with us' },
    job: { label: 'I am looking for a job', sub: 'Candidates start here' },
  },
  forms: {
    hire: { title: 'Tell us the roles', sub: 'Job titles and headcount are enough to start.', desk: 'employer desk', companyLabel: 'Company name', companyPlaceholder: 'Registered company name', subjectLabel: 'Roles and headcount', subjectPlaceholder: 'e.g. 10 welders', extraLabel: 'City in Türkiye', submit: 'Send my hiring request' },
    permit: { title: 'Permit file, no sourcing', sub: 'You already have the worker.', desk: 'permit team', companyLabel: 'Company name', companyPlaceholder: 'Registered company name', subjectLabel: 'Worker and role', subjectPlaceholder: 'e.g. 1 Uzbek chef', extraLabel: 'Workplace city', submit: 'Ask the permit team' },
    partner: { title: 'Supply or partner with us', sub: 'Tell us what you bring.', desk: 'partnerships desk', companyLabel: 'Agency name & country', companyPlaceholder: 'e.g. Skyline Manpower, Nepal', subjectLabel: 'What you supply', subjectPlaceholder: 'e.g. welders and masons', extraLabel: 'Licence no.', extraPlaceholder: 'If you have one', submit: 'Send partnership enquiry' },
  },
  deskPrefix: 'Goes to the',
  nameLabel: 'Your name',
  namePlaceholder: 'Who we should ask for',
  emailLabel: 'Email',
  phoneLabel: 'Phone / WhatsApp',
  notesLabel: 'Anything else (optional)',
  notesPlaceholder: 'Start date, shift pattern, accommodation, budget',
  replyLegend: 'Reply me on',
  reply: { whatsapp: 'WhatsApp', email: 'Email', call: 'A call' },
  moreOpen: '+ Add extra details (optional)',
  moreClose: 'Hide extra details',
  fallbackIntro: 'Hello JobsAdmire, the contact form did not go through. My enquiry:',
};

const renderEnquiry = () =>
  renderWithIntl(
    <ContactEnquiry
      action={idle}
      copy={copy}
      locale="en"
      turnstileSiteKey={null}
      whatsappNumber="905011240340"
      contact={{ phone: '+905011240340', email: 'info@jobsadmire.com' }}
      jobPanel={<p>B2B explainer</p>}
      footer={<a href="mailto:info@jobsadmire.com">Rather email? →</a>}
    />,
    { locale: 'en' },
  );

beforeEach(() => {
  window.dataLayer = [];
});

describe('ContactEnquiry', () => {
  it('hire by default: a contact form whose inputs carry the catalog names and the package labels (W114/W115)', () => {
    renderEnquiry();
    const form = screen.getByTestId('contact-enquiry-form');
    expect(form).toHaveAttribute('data-form-key', 'contact');
    expect(form.querySelector('input[name="topic"]')).toHaveValue('hire');
    expect(within(form).getByRole('heading', { level: 3, name: 'Tell us the roles' })).toBeInTheDocument();
    expect(within(form).getByRole('textbox', { name: /^Company name/ })).toHaveAttribute('name', 'company');
    expect(within(form).getByRole('textbox', { name: /^Your name/ })).toHaveAttribute('id', 'f-contact-enquiry-name');
    expect(within(form).getByRole('textbox', { name: /^Roles and headcount/ })).toHaveAttribute('name', 'subject');
    const city = within(form).getByRole('textbox', { name: /^City in Türkiye/ });
    expect(city).toHaveAttribute('name', 'city');
    expect(city).toHaveAttribute('placeholder', en.sys.form.placeholders.city);
    expect(form.querySelector('input[name="licence"]')).toBeNull();
    expect(within(form).getByText(/Goes to the employer desk/)).toBeInTheDocument();
    const reply = within(form).getAllByRole('radio') as HTMLInputElement[];
    expect(reply.map((r) => r.value)).toEqual(['whatsapp', 'email', 'call']);
    expect(reply[0].checked).toBe(true);
    // W79: one consent checkbox, scoped id.
    expect(within(form).getByRole('checkbox')).toHaveAttribute('id', 'f-contact-enquiry-consent');
    expect(within(form).getByRole('button', { name: 'Send my hiring request' })).toHaveAttribute('type', 'submit');
    // The "Rather email?" line sits under the card, outside the <form>.
    expect(form.contains(screen.getByRole('link', { name: 'Rather email? →' }))).toBe(false);
    expect(window.dataLayer).toEqual([]);
  });

  it('partner swaps city for the licence input and fires contact_topic with the key only (W12/W67)', () => {
    renderEnquiry();
    fireEvent.click(screen.getByRole('radio', { name: /Agency or agent/ }));
    const form = screen.getByTestId('contact-enquiry-form');
    expect(form.querySelector('input[name="topic"]')).toHaveValue('partner');
    const licence = within(form).getByRole('textbox', { name: /^Licence no\./ });
    expect(licence).toHaveAttribute('name', 'licence');
    expect(licence).toHaveAttribute('placeholder', 'If you have one');
    expect(form.querySelector('input[name="city"]')).toBeNull();
    expect(within(form).getByRole('button', { name: 'Send partnership enquiry' })).toBeInTheDocument();
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer?.[0]).toMatchObject({ event: 'contact_topic', locale: 'en', topic: 'partner' });
    expect(Object.keys(window.dataLayer?.[0] ?? {}).sort()).toEqual(['event', 'locale', 'page', 'topic']);
  });

  it('switching between filing topics keeps what the visitor typed', () => {
    renderEnquiry();
    fireEvent.change(screen.getByRole('textbox', { name: /^Company name/ }), { target: { value: 'Akdeniz Otel' } });
    fireEvent.click(screen.getByRole('radio', { name: /Work permit only/ }));
    expect(screen.getByRole('textbox', { name: /^Company name/ })).toHaveValue('Akdeniz Otel');
    expect(screen.getByRole('textbox', { name: /^Worker and role/ })).toHaveAttribute('name', 'subject');
  });

  it('the job card hides the form and shows the explainer — nothing can be filed (W3)', () => {
    renderEnquiry();
    fireEvent.click(screen.getByRole('radio', { name: /I am looking for a job/ }));
    expect(screen.queryByTestId('contact-enquiry-form')).toBeNull();
    expect(screen.getByTestId('contact-jobseeker')).toHaveTextContent('B2B explainer');
    expect(window.dataLayer?.[0]).toMatchObject({ event: 'contact_topic', topic: 'job' });
  });

  it('the ≤ 700 px "+ Add extra details" toggle controls the two optional wrappers', () => {
    renderEnquiry();
    const toggle = screen.getByRole('button', { name: '+ Add extra details (optional)' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const ids = (toggle.getAttribute('aria-controls') ?? '').split(' ');
    expect(ids).toHaveLength(2);
    for (const id of ids) expect(document.getElementById(id)).not.toBeNull();
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Hide extra details' })).toHaveAttribute('aria-expanded', 'true');
  });
});
```

`src/app/[locale]/(site)/contact/_components/__tests__/CallbackWidget.test.tsx`:

```tsx
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { CallbackWidget, type CallbackWidgetCopy } from '../CallbackWidget';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const copy: CallbackWidgetCopy = {
  title: 'Can’t talk right now?',
  sub: 'Pick a slot — we call you back on your number',
  dayLegend: 'Which day',
  slotLegend: 'Best time',
  days: { today: 'Today', tomorrow: 'Tomorrow', this_week: 'This week' },
  anyTime: 'any time',
  nameLabel: 'Your name',
  phoneLabel: 'Phone / WhatsApp',
  phonePlaceholder: 'Your number, e.g. +90 5xx xxx xx xx',
  submit: 'Request call',
  note: 'We call from +90 501 124 03 40.',
  fallbackIntro: 'Hello JobsAdmire, the callback form did not go through — please call me back. My details:',
};

const renderWidget = () =>
  renderWithIntl(
    <CallbackWidget action={idle} copy={copy} locale="en" turnstileSiteKey={null} whatsappNumber="905011240340" contact={{ phone: '+905011240340', email: 'info@jobsadmire.com' }} />,
    { locale: 'en' },
  );

describe('CallbackWidget', () => {
  it('is closed like the design: a toggle, its panel hidden, no form in the DOM', () => {
    renderWidget();
    const toggle = screen.getByRole('button', { name: /Can’t talk right now\?/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(toggle.getAttribute('aria-controls') ?? '')).toHaveAttribute('hidden');
    expect(screen.queryByTestId('contact-callback-form')).toBeNull();
  });

  it('opens to a callback form: day and slot chips posting keys, name + phone, a consent checkbox (W3/W79)', () => {
    renderWidget();
    fireEvent.click(screen.getByRole('button', { name: /Can’t talk right now\?/ }));
    const form = screen.getByTestId('contact-callback-form');
    expect(form).toHaveAttribute('data-form-key', 'callback');
    const days = [...form.querySelectorAll<HTMLInputElement>('input[name="day"]')];
    expect(days.map((d) => d.value)).toEqual(['today', 'tomorrow', 'this_week']);
    expect(days[0].checked).toBe(true);
    const slots = [...form.querySelectorAll<HTMLInputElement>('input[name="slot"]')];
    expect(slots.map((s) => s.value)).toEqual(['09-11', '11-13', '14-16', '16-18', 'any']);
    expect(within(form).getByText('14:00–16:00')).toBeInTheDocument();
    expect(within(form).getByText('any time')).toBeInTheDocument();
    expect(within(form).getByRole('textbox', { name: /^Your name/ })).toHaveAttribute('id', 'f-contact-callback-name');
    expect(within(form).getByRole('textbox', { name: /^Phone \/ WhatsApp/ })).toHaveAttribute('type', 'tel');
    expect(within(form).getByRole('checkbox')).toHaveAttribute('id', 'f-contact-callback-consent');
    expect(within(form).getByRole('button', { name: 'Request call' })).toHaveAttribute('type', 'submit');
  });
});
```

`src/app/[locale]/(site)/contact/_components/__tests__/VisitBooking.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { VisitBooking, type VisitBookingCopy } from '../VisitBooking';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const copy: VisitBookingCopy = {
  eyebrow: 'Ziyaret ayarlayın',
  title: 'Bizimle yüz yüze görüşmeyi mi tercih edersiniz?',
  body: 'Size uygun gün ve saati seçin.',
  dayLegend: 'Gün',
  timeLegend: 'Saat',
  toggleOpen: 'Bir gün ve saat seçin',
  toggleClose: 'Saatleri gizle',
  nameLabel: 'Adınız',
  emailLabel: 'E-posta',
  phoneLabel: 'Telefon / WhatsApp',
  submit: 'Ziyaret saati talep edin',
  fallbackIntro: 'Merhaba JobsAdmire, ziyaret formu gönderilemedi. Bilgilerim:',
};

describe('VisitBooking', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }));
  afterEach(() => vi.useRealTimers());

  it('offers the next five Antalya open days as ISO-valued chips, the five slots, the W3 trio and a consent checkbox', () => {
    vi.setSystemTime(new Date('2026-09-25T20:00:00Z')); // Friday 23:00 in Istanbul
    renderWithIntl(
      <VisitBooking action={idle} copy={copy} hours={antalya} locale="tr" turnstileSiteKey={null} whatsappNumber="905011240340" contact={{ phone: '+905011240340', email: 'info@jobsadmire.com' }} />,
      { locale: 'tr' },
    );
    const form = screen.getByTestId('contact-visit-form');
    expect(form).toHaveAttribute('data-form-key', 'visit');
    const days = [...form.querySelectorAll<HTMLInputElement>('input[name="preferredDate"]')];
    expect(days.map((d) => d.value)).toEqual(['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']);
    expect(days.every((d) => d.type === 'radio')).toBe(true);
    expect(within(form).getByText('28 Eyl Pzt')).toBeInTheDocument();
    expect([...form.querySelectorAll<HTMLInputElement>('input[name="preferredTime"]')].map((s) => s.value)).toEqual(['09:30', '11:00', '13:30', '15:00', '16:30']);
    for (const name of ['name', 'email', 'phone']) expect(form.querySelector(`#f-contact-visit-${name}`)).toHaveAttribute('name', name);
    expect(within(form).getByRole('checkbox')).toHaveAttribute('id', 'f-contact-visit-consent');
    expect(within(form).getByRole('button', { name: 'Ziyaret saati talep edin' })).toHaveAttribute('type', 'submit');
    expect(screen.getByRole('heading', { level: 3, name: copy.title })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bir gün ve saat seçin' })).toHaveAttribute('aria-expanded', 'false');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/\[locale\]/(site)/contact/_components" --maxWorkers=1
```
Expected: FAIL — all four files at import: `Failed to resolve import "../LiveStatus"` (and `"../ContactEnquiry"`, `"../CallbackWidget"`, `"../VisitBooking"`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/contact/_components/types.ts`:

```ts
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';

/** A page `'use server'` action as `FormShell` takes it (the three in ../actions.ts). */
export type FormAction = (prev: FormActionState, data: FormData) => Promise<FormActionState>;

/** What each of the page's three form shells takes besides its copy (../_lib/door.ts builds it). */
export type FormDoor = {
  locale: Locale;
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  contact: { phone: string; phoneDisplay?: string; email: string };
};
```

`src/app/[locale]/(site)/contact/_components/icons.tsx`:

```tsx
import type { ReactNode } from 'react';

// The Contact design's own glyphs (inline SVG, W14) that the chrome's icon set does not carry.
// Decorative everywhere — the card, link or button around each one carries the name (D20). No
// directive: the server sections and the client islands both render them.
type IconProps = { size?: number; className?: string };

function Glyph({ size = 18, className, filled = false, children }: IconProps & { filled?: boolean; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Glyph>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </Glyph>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Glyph>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m6 9 6 6 6-6" />
    </Glyph>
  );
}

export function PlaneIcon(props: IconProps) {
  return (
    <Glyph {...props} filled>
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </Glyph>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
    </Glyph>
  );
}
```

`src/app/[locale]/(site)/contact/_components/useMinuteTick.ts`:

```ts
'use client';
import { useSyncExternalStore } from 'react';

// R18: the one clock every live pill and the visit chips on this page share — `null` on the server
// and while hydrating (the server snapshot), the current minute after it; React re-renders the
// readers when the minute changes. One interval for the whole page, started by the first
// subscriber and stopped — its snapshot dropped — by the last, so a later mount reads a fresh
// clock. The directive follows W130 (every hook module that uses a client-only React API is a
// client module).
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
let snapshot: number | null = null;

const minuteNow = () => Math.floor(Date.now() / 60_000);

function tick() {
  const next = minuteNow();
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  timer ??= setInterval(tick, 15_000);
  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    if (timer !== null) clearInterval(timer);
    timer = null;
    snapshot = null;
  };
}

function getSnapshot(): number {
  snapshot ??= minuteNow();
  return snapshot;
}

const getServerSnapshot = (): number | null => null;

/** Minutes since the epoch on the client, `null` on the server and during hydration. */
export function useMinuteTick(): number | null {
  return useSyncExternalStore<number | null>(subscribe, getSnapshot, getServerSnapshot);
}
```

`src/app/[locale]/(site)/contact/_components/LiveStatus.tsx`:

```tsx
'use client';
import type { Locale } from '@/i18n/routing';
import { liveStatusText, type LiveStatusSpec } from '../_lib/live-status-text';
import { officeStatus, type OfficeHours } from '../_lib/office-status';
import { useMinuteTick } from './useMinuteTick';

export type LiveStatusProps = LiveStatusSpec & {
  hours: OfficeHours;
  locale: Locale;
  /** The server and hydration text — the office row's own hours string (contact.100/106/135) —
   *  shown until the client clock is known (R18). */
  fallback: string;
  /** Appended as ` · <suffix>` to the live text (the phone cards' contact.135). */
  suffix?: string;
  /** Face only — never a display/alignment/gap utility (the base sets them, W122). */
  className?: string;
};

const DOT = {
  unknown: 'bg-muted',
  open: 'bg-success motion-safe:animate-pulse',
  closed: 'bg-warning',
} as const;

/** One open/closed pill over an `offices` row's hours. The dot is decorative; the text carries the
 *  state (D20). No live region: the text changes once a minute and would chatter. */
export function LiveStatus(props: LiveStatusProps) {
  const { hours, locale, fallback, suffix, className } = props;
  const tick = useMinuteTick();
  const status = tick === null ? null : officeStatus(new Date(tick * 60_000), hours);
  const text =
    status === null
      ? fallback
      : [liveStatusText(props, status, hours, locale), suffix].filter(Boolean).join(' · ');
  const state = status === null ? 'unknown' : status.open ? 'open' : 'closed';
  return (
    <span
      data-testid="live-status"
      data-variant={props.variant}
      data-open={status === null ? undefined : String(status.open)}
      className={['inline-flex items-center gap-2', className].filter(Boolean).join(' ')}
    >
      <span aria-hidden="true" className={['inline-block h-2 w-2 shrink-0 rounded-full', DOT[state]].join(' ')} />
      {text}
    </span>
  );
}
```

`src/app/[locale]/(site)/contact/_components/ContactEnquiry.tsx`:

```tsx
'use client';
import { usePathname } from 'next/navigation';
import { useId, useState, type ReactNode } from 'react';
import { track } from '@/analytics/track';
import { CheckIcon, LinkIcon } from '@/design/chrome/icons';
import { RadioChips } from '@/design/primitives/RadioChips';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import {
  EXTRA_FIELD,
  PICKER_TOPICS,
  REPLY_CHANNELS,
  type ContactTopic,
  type PickerTopic,
  type ReplyChannel,
} from '../_lib/options';
import { DocumentIcon, SearchIcon, UsersIcon } from './icons';
import type { FormAction, FormDoor } from './types';

export type TopicCardCopy = { label: string; sub: string };

export type TopicFormCopy = {
  title: string;
  sub: string;
  desk: string;
  companyLabel: string;
  companyPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  /** hire/permit: the `city` label (its placeholder is the kernel's `sys.form.placeholders.city`);
   *  partner: the licence label and placeholder. */
  extraLabel: string;
  extraPlaceholder?: string;
  submit: string;
};

export type ContactEnquiryCopy = {
  legend: string;
  topics: Record<PickerTopic, TopicCardCopy>;
  forms: Record<ContactTopic, TopicFormCopy>;
  deskPrefix: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  phoneLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  replyLegend: string;
  reply: Record<ReplyChannel, string>;
  moreOpen: string;
  moreClose: string;
  fallbackIntro: string;
};

export type ContactEnquiryProps = FormDoor & {
  action: FormAction;
  copy: ContactEnquiryCopy;
  /** The job-seeker explainer (contact.075–085), server-rendered by the page. */
  jobPanel: ReactNode;
  /** The "Rather email? →" line (contact.074), rendered under the form, outside it. */
  footer: ReactNode;
};

const TOPIC_ICON: Record<PickerTopic, ReactNode> = {
  hire: <UsersIcon size={18} />,
  permit: <DocumentIcon size={18} />,
  partner: <LinkIcon size={18} />,
  job: <SearchIcon size={18} />,
};

const TILE: Record<PickerTopic, string> = {
  hire: 'bg-tint text-blue-safe',
  permit: 'bg-tint text-blue-safe',
  partner: 'bg-pale-1 text-navy',
  job: 'bg-success-surface text-success-text',
};

/** The checked face per topic: only the border colour moves (a tinted face would drop the sub
 *  line's text-tertiary below 4.5:1, D20). */
const CHECKED: Record<PickerTopic, string> = {
  hire: 'has-[:checked]:border-blue-safe',
  permit: 'has-[:checked]:border-blue-safe',
  partner: 'has-[:checked]:border-navy',
  job: 'has-[:checked]:border-success-text',
};

const CARD =
  'group relative flex cursor-pointer items-center gap-3 rounded-sm border-2 border-border-3 bg-white p-3 pr-8 text-left transition-colors hover:bg-pale-3 has-[:checked]:shadow-[0_8px_20px_rgba(22,60,90,0.1)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-safe max-md:flex-col max-md:items-start';
const TILE_BASE = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xs';

/** The design's message card: the topic picker (native radios — arrow keys, focus and the checked
 *  state come from the platform, D20) over the `contact` form, or the job-seeker explainer when the
 *  visitor picks "I am looking for a job" — which files nothing (W3). */
export function ContactEnquiry({
  action,
  copy,
  jobPanel,
  footer,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  contact,
}: ContactEnquiryProps) {
  // R35: `page` is the real URL (next/navigation), never next-intl's internal key.
  const page = usePathname() ?? '/';
  const extraId = useId();
  const notesId = useId();
  const [topic, setTopic] = useState<PickerTopic>('hire');
  const [reply, setReply] = useState<string>('whatsapp');
  const [more, setMore] = useState(false);
  const formTopic: ContactTopic | null = topic === 'job' ? null : topic;
  const form = formTopic ? copy.forms[formTopic] : null;

  const pick = (key: PickerTopic) => {
    setTopic(key);
    // W12/W67: the enum key only — never a label, never a field value.
    track('contact_topic', { page, locale, topic: key });
  };

  return (
    <>
      <div className="px-6 pt-6 md:px-8">
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-3 p-0 text-eyebrow font-extrabold uppercase tracking-[0.6px] text-text-tertiary">
            {copy.legend}
          </legend>
          <div className="grid grid-cols-2 gap-2.5">
            {PICKER_TOPICS.map((key) => (
              <label key={key} className={[CARD, CHECKED[key]].join(' ')}>
                <input
                  type="radio"
                  name="topicPick"
                  value={key}
                  checked={topic === key}
                  onChange={() => pick(key)}
                  className="sr-only"
                />
                <span aria-hidden="true" className={[TILE_BASE, TILE[key]].join(' ')}>
                  {TOPIC_ICON[key]}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-body-sm font-extrabold text-ink">{copy.topics[key].label}</span>
                  <span className="text-body-sm text-text-tertiary">{copy.topics[key].sub}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-blue-safe text-white group-has-[:checked]:flex"
                >
                  <CheckIcon size={12} />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div aria-hidden="true" className="mx-6 mt-5 h-px bg-border-3 md:mx-8" />
      {formTopic && form ? (
        <>
          <FormShell
            action={action}
            formKey="contact"
            idScope="contact-enquiry"
            locale={locale}
            turnstileSiteKey={turnstileSiteKey}
            whatsappNumber={whatsappNumber}
            whatsappIntro={copy.fallbackIntro}
            contact={contact}
            submitLabel={form.submit}
            consent="checkbox"
            title={form.title}
            headingLevel={3}
            testId="contact-enquiry-form"
            className="px-6 pt-6 md:px-8"
          >
            <input type="hidden" name="topic" value={formTopic} />
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="m-0 max-w-[46ch] text-body-sm text-text-tertiary">{form.sub}</p>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-border-2 bg-pale-1 px-3 py-1 text-body-sm font-extrabold text-text-secondary">
                <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-success" />
                {copy.deskPrefix} {form.desk}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field name="company" label={form.companyLabel} placeholder={form.companyPlaceholder} required autoComplete="organization" maxLength={200} />
              <Field name="name" label={copy.nameLabel} placeholder={copy.namePlaceholder} required autoComplete="name" maxLength={120} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field name="email" type="email" label={copy.emailLabel} required autoComplete="email" inputMode="email" maxLength={254} />
              <Field name="phone" type="tel" label={copy.phoneLabel} required autoComplete="tel" inputMode="tel" maxLength={40} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.3fr_0.7fr]">
              <Field name="subject" label={form.subjectLabel} placeholder={form.subjectPlaceholder} required maxLength={200} />
              {/* ≤ 700 px the optional inputs sit behind "+ Add extra details" (contact.211/210). */}
              <div id={extraId} className={more ? 'min-w-0' : 'min-w-0 max-md:hidden'}>
                {EXTRA_FIELD[formTopic] === 'city' ? (
                  <Field key="city" name="city" label={form.extraLabel} autoComplete="address-level2" maxLength={120} />
                ) : (
                  <Field key="licence" name="licence" label={form.extraLabel} placeholder={form.extraPlaceholder} maxLength={200} />
                )}
              </div>
            </div>
            <button
              type="button"
              aria-expanded={more}
              aria-controls={`${extraId} ${notesId}`}
              onClick={() => setMore((v) => !v)}
              className="flex min-h-[46px] w-full items-center justify-center rounded-xs border-[1.5px] border-dashed border-tint-border bg-pale-1 px-3 text-body-sm font-extrabold text-blue-safe md:hidden"
            >
              {more ? copy.moreClose : copy.moreOpen}
            </button>
            <div id={notesId} className={more ? 'min-w-0' : 'min-w-0 max-md:hidden'}>
              <Field name="message" as="textarea" rows={3} label={copy.notesLabel} placeholder={copy.notesPlaceholder} hint="" maxLength={4000} />
            </div>
            <RadioChips
              name="reply"
              legend={copy.replyLegend}
              value={reply}
              onChange={setReply}
              options={REPLY_CHANNELS.map((c) => ({ value: c, label: copy.reply[c] }))}
            />
          </FormShell>
          <div className="px-6 pb-7 pt-4 md:px-8">{footer}</div>
        </>
      ) : (
        <div data-testid="contact-jobseeker" className="px-6 pb-7 pt-6 md:px-8">
          {jobPanel}
        </div>
      )}
    </>
  );
}
```

`src/app/[locale]/(site)/contact/_components/CallbackWidget.tsx`:

```tsx
'use client';
import { useId, useState } from 'react';
import { PhoneIcon } from '@/design/chrome/icons';
import { RadioChips } from '@/design/primitives/RadioChips';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import { CALLBACK_DAYS, CALLBACK_SLOTS, type CallbackDay } from '../_lib/options';
import { ChevronDownIcon } from './icons';
import type { FormAction, FormDoor } from './types';

export type CallbackWidgetCopy = {
  title: string; // contact.041
  sub: string; // contact.042
  dayLegend: string; // contact.043
  slotLegend: string; // contact.044
  days: Record<CallbackDay, string>; // contact.205–207
  anyTime: string; // contact.209
  nameLabel: string; // contact.066
  phoneLabel: string; // contact.068
  phonePlaceholder: string; // contact.049
  submit: string; // contact.045
  note: string; // contact.046
  fallbackIntro: string; // sys.contact.fallbackIntro.callback
};

export type CallbackWidgetProps = FormDoor & { action: FormAction; copy: CallbackWidgetCopy };

/** The hero's collapsible "Can’t talk right now?" card → `callback` (W3: `name` added; W79: a
 *  consent checkbox). Closed on the server exactly like the design; the form mounts on open. */
export function CallbackWidget({ action, copy, locale, turnstileSiteKey, whatsappNumber, contact }: CallbackWidgetProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<string>('today');
  const [slot, setSlot] = useState<string | null>(null);
  const slotOptions = [
    ...CALLBACK_SLOTS.map((s) => ({ value: s.key, label: `${s.from}–${s.to}` })),
    { value: 'any', label: copy.anyTime },
  ];
  return (
    <div data-testid="contact-callback" className="rounded-md border border-border-1 bg-white p-5 text-ink">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3.5 rounded-xs text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
      >
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xs bg-pale-1 text-navy">
          <PhoneIcon size={19} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-card-title font-extrabold text-ink">{copy.title}</span>
          <span className="text-body-sm text-text-tertiary">{copy.sub}</span>
        </span>
        <ChevronDownIcon
          size={16}
          className={open ? 'shrink-0 rotate-180 text-text-tertiary transition-transform' : 'shrink-0 text-text-tertiary transition-transform'}
        />
      </button>
      <div id={panelId} hidden={!open} className="mt-4 border-t border-border-3 pt-4">
        {open ? (
          <FormShell
            action={action}
            formKey="callback"
            idScope="contact-callback"
            locale={locale}
            turnstileSiteKey={turnstileSiteKey}
            whatsappNumber={whatsappNumber}
            whatsappIntro={copy.fallbackIntro}
            contact={contact}
            submitLabel={copy.submit}
            consent="checkbox"
            headingLevel={3}
            testId="contact-callback-form"
          >
            <RadioChips name="day" legend={copy.dayLegend} value={day} onChange={setDay} options={CALLBACK_DAYS.map((d) => ({ value: d, label: copy.days[d] }))} />
            <RadioChips name="slot" legend={copy.slotLegend} value={slot} onChange={setSlot} options={slotOptions} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field name="name" label={copy.nameLabel} required autoComplete="name" maxLength={120} />
              <Field name="phone" type="tel" label={copy.phoneLabel} placeholder={copy.phonePlaceholder} required autoComplete="tel" inputMode="tel" maxLength={40} />
            </div>
            <p className="m-0 text-body-sm text-text-tertiary">{copy.note}</p>
          </FormShell>
        ) : null}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/contact/_components/VisitBooking.tsx`:

```tsx
'use client';
import { useId, useState } from 'react';
import { RadioChips } from '@/design/primitives/RadioChips';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import { formatVisitDay, nextOpenDates, type OfficeHours } from '../_lib/office-status';
import { VISIT_SLOTS } from '../_lib/options';
import type { FormAction, FormDoor } from './types';
import { useMinuteTick } from './useMinuteTick';

export type VisitBookingCopy = {
  eyebrow: string; // contact.113
  title: string; // contact.114
  body: string; // contact.115
  dayLegend: string; // contact.116
  timeLegend: string; // contact.117
  toggleOpen: string; // contact.213
  toggleClose: string; // contact.212
  nameLabel: string; // contact.066
  emailLabel: string; // contact.067
  phoneLabel: string; // contact.068
  submit: string; // sys.contact.visit.submit (replaces contact.118)
  fallbackIntro: string; // sys.contact.fallbackIntro.visit
};

export type VisitBookingProps = FormDoor & { action: FormAction; copy: VisitBookingCopy; hours: OfficeHours };

/** "Book a visit" → `visit` (W3: name / e-mail / phone added; office fixed to antalya; W79 consent).
 *  The day chips are the next five open days of the Antalya office in its own zone, computed from
 *  the client clock (R18): the server and a not-yet-hydrated page get a plain labelled input under
 *  the same `preferredDate` name. ≤ 700 px the form sits behind the design's "Pick a day & time"
 *  toggle (contact.213/212). */
export function VisitBooking({ action, copy, hours, locale, turnstileSiteKey, whatsappNumber, contact }: VisitBookingProps) {
  const bodyId = useId();
  const tick = useMinuteTick();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const days = tick === null ? null : nextOpenDates(new Date(tick * 60_000), hours, 5);
  return (
    <div data-testid="contact-visit" className="grid grid-cols-1 items-center gap-6 rounded-lg border border-border-1 bg-white p-6 md:p-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-9">
      <div>
        <p className="m-0 mb-3 inline-flex rounded-pill border border-tint-border bg-tint px-3 py-1 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-blue-safe">
          {copy.eyebrow}
        </p>
        <h3 className="m-0 mb-2 text-card-title">{copy.title}</h3>
        <p className="m-0 text-body-sm text-text-tertiary">{copy.body}</p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((v) => !v)}
          className="mt-4 flex min-h-[50px] w-full items-center justify-center rounded-xs border-[1.5px] border-tint-border bg-tint px-3 text-body-sm font-extrabold text-blue-safe md:hidden"
        >
          {open ? copy.toggleClose : copy.toggleOpen}
        </button>
      </div>
      <div id={bodyId} className={open ? 'min-w-0' : 'min-w-0 max-md:hidden'}>
        <FormShell
          action={action}
          formKey="visit"
          idScope="contact-visit"
          locale={locale}
          turnstileSiteKey={turnstileSiteKey}
          whatsappNumber={whatsappNumber}
          whatsappIntro={copy.fallbackIntro}
          contact={contact}
          submitLabel={copy.submit}
          consent="checkbox"
          headingLevel={3}
          testId="contact-visit-form"
        >
          {days ? (
            <RadioChips name="preferredDate" legend={copy.dayLegend} value={day} onChange={setDay} options={days.map((iso) => ({ value: iso, label: formatVisitDay(iso, locale) }))} />
          ) : (
            <Field name="preferredDate" label={copy.dayLegend} maxLength={40} />
          )}
          <RadioChips name="preferredTime" legend={copy.timeLegend} value={time} onChange={setTime} options={VISIT_SLOTS.map((s) => ({ value: s, label: s }))} />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field name="name" label={copy.nameLabel} required autoComplete="name" maxLength={120} />
            <Field name="email" type="email" label={copy.emailLabel} required autoComplete="email" inputMode="email" maxLength={254} />
            <Field name="phone" type="tel" label={copy.phoneLabel} required autoComplete="tel" inputMode="tel" maxLength={40} />
          </div>
        </FormShell>
      </div>
    </div>
  );
}
```

Notes for the implementer:
- Three shells, three form keys, three explicit `idScope`s (`contact-enquiry`, `contact-callback`, `contact-visit`) — every kernel id (`f-<scope>-<name>`, `f-<scope>-consent`, `f-<scope>-honeypot`, `f-<scope>-turnstile`) is unique on the page; `RadioChips` ids come from `useId`; the picker radios carry no id (the wrapping `<label>` names them).
- The picker radios (`topicPick`) live outside the `<form>` on purpose — the job card must stay when the form unmounts; `topic` reaches the action through the hidden input.
- Three `FormShell`s mean up to three Turnstile widgets on `staging`/production — accepted in `B/reconcile-rulings.md`'s "Accepted as page-local" list ("three Turnstile widgets on one page (T7, confirm on staging)"): the real `Turnstile.tsx` loads one script and mounts one widget per shell (`READY_EVENT`), and `useTurnstileReset` resets each shell independently; T14 confirms it on `staging`. Locally no site key → no widget.
- No module of this cycle calls `useTranslations`: `client-messages.test.ts` stays green without a `CLIENT_SYS` change (W148). `client-imports.test.ts` stays green: primitives by path, no message JSON, no `formatReadMinutes`.

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/contact/_components" && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `LiveStatus.test.tsx` (5), `ContactEnquiry.test.tsx` (5), `CallbackWidget.test.tsx` (2), `VisitBooking.test.tsx` (1); `class-collisions.test.ts` (the `CARD` + `CHECKED[key]` and `TILE_BASE` + `TILE[key]` compositions, the toggles' `flex … md:hidden`, the badge's `hidden … group-has-[:checked]:flex`, `LiveStatus`'s base + `DOT[state]` — one utility per property per variant), `client-imports.test.ts` and `client-messages.test.ts` stay green.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add "src/app/[locale]/(site)/contact/_components" && git commit -m "feat(contact): live-status pills on one hydration-safe minute clock, topic enquiry, callback widget, book-a-visit islands (T7 c3)

R18: null on the server, the clock after hydration; W148: no island reads sys (templates
arrive raw from the server); W3/W79/W114/W115: catalog input names, package labels, consent
checkbox, distinct idScopes; W12/W67: contact_topic with the key only.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — the four sections, the page, the route wiring (W20/W21), the package-id check; the SEO / analytics / PRD docs

The sections are synchronous server components (`makeTf` from `@/content/pure`, `useTranslations('sys')` from `next-intl` — the `Breadcrumbs`/`OfficeCard` pattern), so jsdom renders them under `renderWithIntl`; the page is the only async module and the only one that imports `./actions` (the sections take the actions as props, so their tests pass stubs).

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/contact/_lib/__tests__/bundles.ts` (test helper, not a test file):

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';

/** The committed LOCAL bundles, parsed through the contract (R13) — read from disk because
 *  `src/**` may not import `src/content/local/*` (ESLint, D23). They are what the page renders in
 *  Phase A, so the section tests assert the real copy, settings and `offices` rows. */
export function localBundle(locale: 'tr' | 'en'): Bundle {
  return BundleSchema.parse(
    JSON.parse(readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8')),
  );
}
```

`src/app/[locale]/(site)/contact/_lib/__tests__/ids.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROUTE = join(process.cwd(), 'src/app/[locale]/(site)/contact');
const strings = (locale: 'tr' | 'en') =>
  (JSON.parse(readFileSync(join(process.cwd(), `src/content/local/bundle.${locale}.json`), 'utf8')) as { strings: Record<string, string> }).strings;

/** Every non-test source file of the route. */
function sources(dir = ROUTE): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/** The package ids the page reads by exact id (W9/W23) — quoted literals in its own source (single-
 *  quoted in `t('…')`, double-quoted in JSX props such as FaqBlock's `eyebrowId`). The
 *  `offices` rows' ids (contact.096–106, 133, 134) and the blocks' own (home.192/221) are read
 *  through data and blocks, not listed here. */
const IDS = new Set(
  sources().flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/['"]((?:contact|home)\.\d{3})['"]/g)].map((m) => m[1])),
);

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `contact.${String(from + i).padStart(3, '0')}`);

/** Never read: the chrome's own ids (R15 — the layout renders contact.001–022 and 125–149; 015/016
 *  are the header CTA's, W17 — except contact.135, the lines' hours the page shows) and the ids
 *  the port retires on purpose: the KVKK sentence (W79), the WhatsApp-only labels and sent panels
 *  (W3/D13), the ≤ 700 px picked pill, the newsletter handler (W5), the design's office-card labels
 *  the frozen OfficeCard replaces with its own. */
const NOT_READ = [
  ...range(1, 22),
  ...range(125, 149).filter((id) => id !== 'contact.135'),
  'contact.047', 'contact.048', 'contact.072', 'contact.073', 'contact.086', 'contact.087', 'contact.088',
  'contact.098', 'contact.102', 'contact.107', 'contact.118', 'contact.217', 'contact.221', 'contact.222',
];

describe('package ids (W9/W23)', () => {
  it('reads 144 distinct ids, every one present in both LOCAL bundles', () => {
    expect(IDS.size).toBe(144);
    const tr = strings('tr');
    const en = strings('en');
    for (const id of IDS) {
      expect(tr[id], id).toBeTypeOf('string');
      expect(en[id], id).toBeTypeOf('string');
    }
  });

  it('never reads the chrome’s ids (R15) or the ones the port retires (W79/D13/W3)', () => {
    for (const id of NOT_READ) expect(IDS.has(id), id).toBe(false);
  });
});
```

`src/app/[locale]/(site)/contact/_sections/__tests__/sections.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { localBundle } from '../../_lib/__tests__/bundles';
import { Faq } from '../Faq';
import { Hero } from '../Hero';
import { Message } from '../Message';
import { Offices } from '../Offices';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const en = localBundle('en');
const tr = localBundle('tr');
const WA = 'https://wa.me/905011240340';
const prefillOf = (href: string | null) => decodeURIComponent((href ?? '').split('?text=')[1] ?? '');

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-09-23T07:32:00Z')); // Wednesday 10:32 in Istanbul, 12:32 in Karachi
  window.dataLayer = [];
});
afterEach(() => vi.useRealTimers());

describe('Hero', () => {
  it('EN: one h1 as the only LCP slot, the named photo placeholder, this page’s own crumbs (D26/W109)', () => {
    const { container } = renderWithIntl(<Hero bundle={en} locale="en" submitCallback={idle} />, { locale: 'en' });
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Talk to the people who do the work');
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    expect([...container.querySelectorAll('[data-placeholder]')].map((el) => el.getAttribute('data-placeholder'))).toEqual(['contact-hero']);
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(crumbs).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(crumbs).getByText('Contact')).toHaveAttribute('aria-current', 'page');
  });

  it('the channel cards carry the settings doors: WhatsApp with the company prefill, both lines, the e-mail with the metric SLA', () => {
    const { container } = renderWithIntl(<Hero bundle={en} locale="en" submitCallback={idle} />, { locale: 'en' });
    const wa = container.querySelector(`a[href^="${WA}?text="]`);
    expect(prefillOf(wa?.getAttribute('href') ?? null)).toBe('Hello JobsAdmire, I have a question about hiring workers in Türkiye.');
    expect(wa).toHaveAttribute('target', '_blank');
    expect(container.querySelector('a[href="tel:+905011240340"]')).toHaveTextContent('+90 501 124 03 40');
    expect(container.querySelector('a[href="tel:+905533832549"]')).toHaveTextContent('+90 553 383 25 49');
    expect(container.querySelector('a[href="mailto:info@jobsadmire.com"]')).toHaveTextContent('Reply within ~4 business hours');
    const pills = screen.getAllByTestId('live-status');
    expect(pills.map((p) => p.getAttribute('data-variant'))).toEqual(['hero', 'whatsapp', 'lines', 'lines']);
    expect(pills[0]).toHaveTextContent('Office open now · 10:32 in Antalya');
    expect(pills[2]).toHaveTextContent('Lines open now · Mon–Fri 09:00–18:00');
    expect([...container.querySelectorAll('li[lang]')].map((li) => li.getAttribute('lang'))).toEqual(['tr', 'en', 'fr', 'hi', 'ru']);
    expect(screen.getByRole('button', { name: /Can’t talk right now\?/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('the Agencies card is data: absent when settings.partnershipsPhone is null', () => {
    const noPartners = { ...en, settings: { ...en.settings, partnershipsPhone: null } };
    const { container } = renderWithIntl(<Hero bundle={noPartners} locale="en" submitCallback={idle} />, { locale: 'en' });
    expect(container.querySelector('a[href="tel:+905533832549"]')).toBeNull();
    expect(screen.getAllByTestId('live-status')).toHaveLength(3);
  });

  it('TR: the h1 is the package’s own split (contact.025 + contact.026)', () => {
    renderWithIntl(<Hero bundle={tr} locale="tr" submitCallback={idle} />, { locale: 'tr' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('İşi asıl yapan kişilerle konuşun');
  });
});

describe('Message', () => {
  it('is section#message (the header CTA target, W17): four steps with the metric SLA, the local QR (W14), the WhatsApp CTA', () => {
    const { container } = renderWithIntl(<Message bundle={en} locale="en" submitContact={idle} />, { locale: 'en' });
    expect(container.querySelector('section#message')).not.toBeNull();
    const steps = container.querySelectorAll('ol[data-variant="plain"] > li');
    expect(steps).toHaveLength(4);
    expect(steps[3]).toHaveTextContent('Written numbers within 24 hours');
    const qr = within(screen.getByTestId('contact-qr')).getByRole('img', { name: 'QR code — scan to open a WhatsApp chat with JobsAdmire' });
    expect(qr.tagName.toLowerCase()).toBe('svg');
    expect(prefillOf(screen.getByRole('link', { name: 'Chat on WhatsApp' }).getAttribute('href'))).toBe(
      'Hello JobsAdmire, I have a question about hiring workers in Türkiye.',
    );
  });

  it('holds the enquiry card: the hire form first, the e-mail line under it', () => {
    renderWithIntl(<Message bundle={en} locale="en" submitContact={idle} />, { locale: 'en' });
    const form = screen.getByTestId('contact-enquiry-form');
    expect(within(form).getByRole('heading', { level: 3, name: 'Tell us the roles' })).toBeInTheDocument();
    expect(within(form).getByRole('textbox', { name: /^City in Türkiye/ })).toHaveAttribute('name', 'city');
    expect(within(form).getByRole('textbox', { name: /^Anything else \(optional\)/ })).toHaveAttribute('name', 'message');
    expect(screen.getByRole('link', { name: 'Rather email? →' })).toHaveAttribute('href', 'mailto:info@jobsadmire.com');
  });
});

describe('Offices', () => {
  it('two office cards with pills from their own rows, the notes and the available-workers link', () => {
    const { container } = renderWithIntl(<Offices bundle={en} locale="en" submitVisit={idle} />, { locale: 'en' });
    const cards = [...container.querySelectorAll('article')] as HTMLElement[];
    expect(cards).toHaveLength(2);
    expect(within(cards[0]).getByRole('heading', { level: 3, name: 'Antalya' })).toBeInTheDocument();
    expect(within(cards[1]).getByRole('heading', { level: 3, name: 'Karachi' })).toBeInTheDocument();
    expect(screen.getAllByTestId('live-status').map((p) => p.textContent)).toEqual([
      'Open now · 10:32 local · closes 18:00',
      'Open now · 12:32 local · closes 19:00',
    ]);
    expect(within(cards[1]).getByRole('link', { name: 'See who is available →' })).toBeInTheDocument();
    // OfficeCard renders its own tel / WhatsApp / mail rows with the office_card placement (W12).
    expect(cards[0].querySelector('a[href="tel:+905011240340"]')).not.toBeNull();
  });

  it('the site-visit band links WhatsApp with the company prefill; the visit card carries the visit form', () => {
    const { container } = renderWithIntl(<Offices bundle={en} locale="en" submitVisit={idle} />, { locale: 'en' });
    expect(prefillOf(screen.getByRole('link', { name: 'Request a site visit' }).getAttribute('href'))).toBe(
      'Hello JobsAdmire, I would like a site visit before deciding on worker numbers.',
    );
    expect(screen.getByTestId('contact-visit-form')).toHaveAttribute('data-form-key', 'visit');
    expect(container.querySelectorAll('input[name="preferredDate"][type="radio"]')).toHaveLength(5);
  });
});

describe('Faq', () => {
  it('#faq with six pairs — answer 3 carries the lines’ hours and the SLA metric, answer 5 the JobsAdmire voice — and one FAQPage node', () => {
    const { container } = renderWithIntl(<Faq bundle={en} locale="en" />, { locale: 'en' });
    expect(container.querySelector('#faq')).not.toBeNull();
    expect(container.querySelectorAll('[data-accordion-trigger]')).toHaveLength(6);
    type Faq = { '@type': string; mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    const nodes = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent ?? '{}') as Faq);
    const faq = nodes.filter((n) => n['@type'] === 'FAQPage');
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(6);
    expect(faq[0].mainEntity[2].acceptedAnswer.text).toBe(
      'WhatsApp is the fastest channel in office hours (Mon–Fri 09:00–18:00, Turkish time); e-mail is answered within about 4 business hours. Messages sent at night or over the weekend are picked up the next business morning.',
    );
    expect(faq[0].mainEntity[4].acceptedAnswer.text).toMatch(/^Yes, but JobsAdmire does not take individual applications directly/);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/\[locale\]/(site)/contact/_lib/__tests__/ids.test.ts" "src/app/\[locale\]/(site)/contact/_sections" --maxWorkers=1
```
Expected: FAIL — `sections.test.tsx` at import (`Failed to resolve import "../Faq"`); `ids.test.ts` "reads 144 distinct ids" (`expected 0 to be 144` — the Cycle 1–3 modules quote no package id).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/contact/_lib/door.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { FormDoor } from '../_components/types';

/** What each of the page's three form shells takes besides its copy — one source, so the three
 *  D11 fallback panels offer the same numbers (the Turnstile site key is overlaid from the env
 *  only where set, R54). */
export function formDoor(bundle: Bundle, locale: Locale): FormDoor {
  const { settings } = bundle;
  return {
    locale,
    turnstileSiteKey: settings.turnstileSiteKey,
    whatsappNumber: settings.whatsappNumber,
    contact: { phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email },
  };
}
```

`src/app/[locale]/(site)/contact/_sections/Hero.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { getOffice } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { CheckIcon, MailIcon, PhoneIcon, WhatsAppIcon } from '@/design/chrome/icons';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CallbackWidget } from '../_components/CallbackWidget';
import { UsersIcon } from '../_components/icons';
import { LiveStatus } from '../_components/LiveStatus';
import type { FormAction } from '../_components/types';
import { formDoor } from '../_lib/door';
import { LANGUAGE_CODES } from '../_lib/options';
import { formatPhoneDisplay } from '../_lib/phone';

/** The channel cards' shared frame: colourless and borderless, so each card adds its own border,
 *  layout and padding without a second utility for one property (W122). */
const CARD =
  'rounded-md bg-white text-ink no-underline transition-shadow hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';
const PHONE_CARD = `${CARD} flex min-w-0 flex-col items-start gap-2 border border-border-1 p-4 md:p-5`;
const TILE = 'flex shrink-0 items-center justify-center';

/** The dark hero: live office pill, the h1 (the LCP element), the channel stack — WhatsApp, the
 *  two phone lines, e-mail — and the callback widget. Every door is a settings value. */
export function Hero({ bundle, locale, submitCallback }: { bundle: Bundle; locale: Locale; submitCallback: FormAction }) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const raw = (key: string) => String(sys.raw(key));
  const { settings } = bundle;
  const antalya = getOffice(bundle, 'antalya');
  const hoursText = t(antalya.hoursId);
  const partnersPhone = settings.partnershipsPhone;
  const lines = { open: t('contact.215'), closed: t('contact.216') };
  return (
    <Section tone="dark" className="relative overflow-hidden">
      {/* §10 #4/D26: the full-bleed photo slot is a named placeholder under the design's two
          overlays, so the h1 stays the LCP element. ImageSlot owns its box — its wrapper sizes it
          (W129). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <ImageSlot slot="contact-hero" alt="" width={1600} height={900} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/75" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70" />
      <div data-testid="contact-hero" className="container-site relative">
        <Breadcrumbs
          locale={locale}
          tone="dark"
          className="mb-5"
          items={[
            { name: t('contact.023'), href: '/' },
            { name: t('contact.024'), href: '/contact' },
          ]}
        />
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-13">
          <div className="min-w-0">
            <LiveStatus
              variant="hero"
              hours={antalya.hours}
              locale={locale}
              fallback={hoursText}
              labels={{
                openNow: t('contact.152'),
                inCity: t('contact.153'),
                weekend: t('contact.154'),
                closedToday: t('contact.155'),
                opensAt: raw('contact.status.opensAt'),
              }}
              className="mb-4 rounded-pill border border-border-1 bg-white px-4 py-1.5 text-body-sm font-extrabold text-text-secondary"
            />
            <h1 data-testid="page-h1" data-lcp-slot="h1" className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em] text-white">
              {t('contact.025')} <span className="text-sky">{t('contact.026')}</span>
            </h1>
            {/* W10: the desktop and phone paragraphs are both in the HTML, one shown per width. */}
            <p className="m-0 max-w-[520px] text-body-lg text-white/80">
              <span className="hidden md:inline">{t('contact.027')}</span>
              <span className="md:hidden">{t('contact.028')}</span>
            </p>
            <ul className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0 max-md:hidden">
              <li className="inline-flex items-center gap-2 rounded-pill border border-success-border bg-white px-3.5 py-1.5 text-body-sm font-extrabold text-success-text">
                <CheckIcon size={13} />
                {t('contact.029')}
              </li>
              <li className="inline-flex items-center rounded-pill border border-border-1 bg-white px-3.5 py-1.5 text-body-sm font-extrabold text-text-secondary">
                {t('contact.030')}
              </li>
            </ul>
            <div className="mt-5 max-w-[520px] rounded-base border border-border-1 bg-white p-5 text-ink max-md:hidden">
              <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1.4px] text-text-tertiary">{t('contact.031')}</p>
              <ul className="m-0 mb-3 flex list-none flex-wrap gap-2 p-0">
                {LANGUAGE_CODES.map((code) => (
                  <li key={code} lang={code} className="rounded-pill border border-tint-border bg-tint px-3.5 py-1 text-body-sm font-extrabold text-blue-safe">
                    {sys(`contact.languages.${code}`)}
                  </li>
                ))}
              </ul>
              <p className="m-0 text-body-sm text-text-tertiary">{t('contact.032')}</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-3.5">
            <ContactLink
              href={waLink(settings.whatsappNumber, sys('contact.wa.main'))}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              className={`${CARD} relative flex flex-col gap-2.5 border-[1.5px] border-success-border p-5 shadow-[0_14px_34px_rgba(22,60,90,0.09)] md:flex-row md:items-center md:gap-4 md:p-6`}
            >
              <span className="absolute right-4 top-3.5 rounded-pill border border-success-border bg-white px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[1px] text-success-text max-md:static max-md:self-start">
                {t('contact.033')}
              </span>
              <span aria-hidden="true" className={`${TILE} h-11 w-11 rounded-sm bg-success-surface text-success-text md:h-13 md:w-13`}>
                <WhatsAppIcon size={24} />
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-success-text">
                  {sys('contact.channels.whatsapp')}
                </span>
                <span className="text-card-title font-extrabold text-ink">{settings.phoneDisplay}</span>
                <span className="text-body-sm text-text-tertiary max-md:hidden">{t('contact.034')}</span>
                <LiveStatus
                  variant="whatsapp"
                  hours={antalya.hours}
                  locale={locale}
                  fallback={hoursText}
                  labels={{ watched: raw('contact.status.waWatched'), off: raw('contact.status.waOff') }}
                  className="mt-1 text-body-sm font-extrabold text-text-secondary"
                />
              </span>
              {/* D20: the design's ≤ 700 px CSS `::after` "Open WhatsApp →", as real text. */}
              <span className="flex min-h-[44px] items-center justify-center rounded-pill bg-success-text px-4 text-body-sm font-extrabold text-white md:hidden">
                {sys('contact.channels.open')}
              </span>
            </ContactLink>
            <div className={partnersPhone ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'}>
              <ContactLink href={telLink(settings.phone)} placement="page_cta" className={PHONE_CARD}>
                <span aria-hidden="true" className={`${TILE} h-9 w-9 rounded-xs bg-tint text-blue-safe md:h-11 md:w-11`}>
                  <PhoneIcon size={18} />
                </span>
                <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{t('contact.035')}</span>
                <span className="text-body-sm font-extrabold text-ink md:text-body">{settings.phoneDisplay}</span>
                <span className="text-body-sm text-text-tertiary max-md:hidden">{t('contact.036')}</span>
                <LiveStatus
                  variant="lines"
                  hours={antalya.hours}
                  locale={locale}
                  fallback={t('contact.135')}
                  suffix={t('contact.135')}
                  labels={lines}
                  className="text-body-sm font-extrabold text-text-secondary max-md:hidden"
                />
              </ContactLink>
              {partnersPhone ? (
                <ContactLink href={telLink(partnersPhone)} placement="page_cta" className={PHONE_CARD}>
                  <span aria-hidden="true" className={`${TILE} h-9 w-9 rounded-xs bg-pale-1 text-navy md:h-11 md:w-11`}>
                    <UsersIcon size={18} />
                  </span>
                  <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-navy">{t('contact.037')}</span>
                  <span className="text-body-sm font-extrabold text-ink md:text-body">{formatPhoneDisplay(partnersPhone)}</span>
                  <span className="text-body-sm text-text-tertiary max-md:hidden">{t('contact.038')}</span>
                  <LiveStatus
                    variant="lines"
                    hours={antalya.hours}
                    locale={locale}
                    fallback={t('contact.135')}
                    suffix={t('contact.135')}
                    labels={lines}
                    className="text-body-sm font-extrabold text-text-secondary max-md:hidden"
                  />
                </ContactLink>
              ) : null}
            </div>
            <ContactLink
              href={mailLink(settings.email)}
              placement="page_cta"
              className={`${CARD} flex items-center gap-3.5 border border-border-1 p-5 max-md:hidden`}
            >
              <span aria-hidden="true" className={`${TILE} h-11 w-11 rounded-xs bg-warning-surface text-warning-text`}>
                <MailIcon size={19} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-body font-extrabold text-ink">{settings.email}</span>
                <span className="text-body-sm text-text-tertiary">{t('contact.039')}</span>
                <span className="text-body-sm font-extrabold text-text-tertiary">{t('contact.040')}</span>
              </span>
            </ContactLink>
            <CallbackWidget
              {...formDoor(bundle, locale)}
              action={submitCallback}
              copy={{
                title: t('contact.041'),
                sub: t('contact.042'),
                dayLegend: t('contact.043'),
                slotLegend: t('contact.044'),
                days: { today: t('contact.205'), tomorrow: t('contact.206'), this_week: t('contact.207') },
                anyTime: t('contact.209'),
                nameLabel: t('contact.066'),
                phoneLabel: t('contact.068'),
                phonePlaceholder: t('contact.049'),
                submit: t('contact.045'),
                note: t('contact.046'),
                fallbackIntro: sys('contact.fallbackIntro.callback'),
              }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/contact/_sections/Message.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ProcessSteps } from '@/design/blocks/ProcessSteps';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { QrCode } from '@/design/QrCode';
import type { Locale } from '@/i18n/routing';
import { mailLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { ContactEnquiry, type ContactEnquiryCopy } from '../_components/ContactEnquiry';
import type { FormAction } from '../_components/types';
import { formDoor } from '../_lib/door';

type T = (id: string) => string;

/** The job-seeker card (contact.075–085): the B2B refusal with the package's own bold splits
 *  (contact.076 | 077 | 078 | 079, W23) and the WhatsApp link for the verified partner list. */
function JobSeekerPanel({ t, href }: { t: T; href: string }) {
  return (
    <>
      <div className="mb-4 rounded-base border border-success-border bg-success-surface p-5">
        <h3 className="m-0 mb-1.5 text-card-title">{t('contact.075')}</h3>
        <p className="m-0 text-body-sm text-text-secondary">
          <strong className="text-ink">{t('contact.076')}</strong> {t('contact.077')}{' '}
          <strong className="text-success-text">{t('contact.078')}</strong>
          {t('contact.079')}
        </p>
      </div>
      <div className="mb-4 grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <div className="rounded-sm border border-border-1 p-5">
          <h4 className="m-0 mb-1.5 text-body">{t('contact.080')}</h4>
          <p className="m-0 mb-3.5 text-body-sm text-text-tertiary">{t('contact.081')}</p>
          <ContactCta placement="page_cta" href={href} external variant="success">
            {t('contact.082')}
          </ContactCta>
        </div>
        <div className="rounded-sm border border-border-1 p-5">
          <h4 className="m-0 mb-1.5 text-body">{t('contact.083')}</h4>
          <p className="m-0 text-body-sm text-text-tertiary">{t('contact.084')}</p>
        </div>
      </div>
      <p className="m-0 text-body-sm text-text-tertiary">{t('contact.085')}</p>
    </>
  );
}

/** `section#message` — the header CTA's target (W17): "what happens after you press send", the
 *  "In a hurry?" card with the local QR, and the enquiry card. */
export function Message({ bundle, locale, submitContact }: { bundle: Bundle; locale: Locale; submitContact: FormAction }) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  const waMain = waLink(settings.whatsappNumber, sys('contact.wa.main'));
  const copy: ContactEnquiryCopy = {
    legend: t('contact.057'),
    topics: {
      hire: { label: t('contact.058'), sub: t('contact.059') },
      permit: { label: t('contact.060'), sub: t('contact.061') },
      partner: { label: t('contact.062'), sub: t('contact.063') },
      job: { label: t('contact.064'), sub: t('contact.065') },
    },
    forms: {
      hire: {
        title: t('contact.162'),
        sub: t('contact.163'),
        desk: t('contact.161'),
        companyLabel: t('contact.164'),
        companyPlaceholder: t('contact.165'),
        subjectLabel: t('contact.166'),
        subjectPlaceholder: t('contact.167'),
        extraLabel: t('contact.168'),
        submit: t('contact.169'),
      },
      permit: {
        title: t('contact.171'),
        sub: t('contact.172'),
        desk: t('contact.170'),
        companyLabel: t('contact.164'),
        companyPlaceholder: t('contact.165'),
        subjectLabel: t('contact.173'),
        subjectPlaceholder: t('contact.174'),
        extraLabel: t('contact.175'),
        submit: t('contact.176'),
      },
      partner: {
        title: t('contact.063'),
        sub: t('contact.178'),
        desk: t('contact.177'),
        companyLabel: t('contact.179'),
        companyPlaceholder: t('contact.180'),
        subjectLabel: t('contact.181'),
        subjectPlaceholder: t('contact.182'),
        extraLabel: t('contact.183'),
        extraPlaceholder: t('contact.184'),
        submit: t('contact.185'),
      },
    },
    deskPrefix: t('contact.218'),
    nameLabel: t('contact.066'),
    namePlaceholder: t('contact.090'),
    emailLabel: t('contact.067'),
    phoneLabel: t('contact.068'),
    // The package splits the label from its "(optional)" marker (contact.069 + 070, W23).
    notesLabel: `${t('contact.069')} ${t('contact.070')}`,
    notesPlaceholder: t('contact.091'),
    replyLegend: t('contact.071'),
    reply: { whatsapp: sys('contact.channels.whatsapp'), email: t('contact.067'), call: t('contact.186') },
    moreOpen: t('contact.211'),
    moreClose: t('contact.210'),
    fallbackIntro: sys('contact.fallbackIntro.contact'),
  };
  return (
    <Section tone="light" id="message" className="scroll-mt-24">
      <div data-testid="contact-message" className="container-site grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
        {/* ≤ 700 px the enquiry card comes first (the design's order swap); the explainer then holds
            nothing focusable — its one card hides — so the focus order is unchanged. */}
        <div className="min-w-0 max-md:order-2 lg:sticky lg:top-24">
          <Eyebrow>{t('contact.050')}</Eyebrow>
          <h2 className="m-0 mb-4 mt-3 text-h2">{t('contact.051')}</h2>
          <p className="m-0 mb-6 text-body text-text-secondary">{t('contact.052')}</p>
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            variant="plain"
            headingLevel={3}
            steps={[
              { n: 1, titleId: 'contact.187', bodyId: 'contact.188' },
              { n: 2, titleId: 'contact.189', bodyId: 'contact.190' },
              { n: 3, titleId: 'contact.191', bodyId: 'contact.192' },
              { n: 4, titleId: 'contact.193', bodyId: 'contact.194' },
            ]}
          />
          <div className="mt-6 rounded-base border border-border-1 bg-white p-5 max-md:hidden">
            <h3 className="m-0 mb-1 text-card-title">{t('contact.053')}</h3>
            <p className="m-0 mb-4 text-body-sm text-text-tertiary">{t('contact.054')}</p>
            <ContactCta placement="page_cta" href={waMain} external variant="success" className="w-full">
              {t('contact.055')}
            </ContactCta>
            <div data-testid="contact-qr" className="mt-4 flex items-center gap-3 border-t border-border-3 pt-4">
              {/* W14: the local encoder, server-rendered (QrCode → qrSvg); the design fetched
                  api.qrserver.com. The plain wa.me URL — no prefill, the shortest code. */}
              <QrCode
                text={`https://wa.me/${settings.whatsappNumber}`}
                label={t('contact.089')}
                size={86}
                className="shrink-0 overflow-hidden rounded-input border border-border-2"
              />
              <p className="m-0 text-body-sm text-text-tertiary">{t('contact.056')}</p>
            </div>
          </div>
        </div>
        <div className="min-w-0 overflow-hidden rounded-xl border border-border-1 bg-white shadow-[0_24px_60px_rgba(22,60,90,0.12)] max-md:order-1">
          <ContactEnquiry
            {...formDoor(bundle, locale)}
            action={submitContact}
            copy={copy}
            jobPanel={<JobSeekerPanel t={t} href={waLink(settings.whatsappNumber, sys('contact.wa.jobseeker'))} />}
            footer={
              <p className="m-0 text-right text-body-sm">
                <ContactLink href={mailLink(settings.email)} placement="page_cta" className="inline-flex min-h-[44px] items-center font-extrabold text-blue-safe underline">
                  {t('contact.074')}
                </ContactLink>
              </p>
            }
          />
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/contact/_sections/Offices.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { getOffice } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { OfficeCard } from '@/design/blocks/OfficeCard';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { BuildingIcon, PlaneIcon } from '../_components/icons';
import { LiveStatus } from '../_components/LiveStatus';
import type { FormAction } from '../_components/types';
import { VisitBooking } from '../_components/VisitBooking';
import { formDoor } from '../_lib/door';

const PILL = 'rounded-pill border border-border-2 bg-pale-1 px-3 py-1.5 text-body-sm font-extrabold text-text-secondary';
const NOTE = 'm-0 mt-3 text-body-sm text-text-tertiary max-md:hidden';
const DASH = 'w-0 flex-1 border-l-2 border-dashed border-white/30';

/** "Two offices, one file": the navy card with both `OfficeCard`s (their tel / WhatsApp / mail
 *  rows fire `office_card`, W12), each with its live pill; the site-visit band; the visit card. */
export function Offices({ bundle, locale, submitVisit }: { bundle: Bundle; locale: Locale; submitVisit: FormAction }) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const raw = (key: string) => String(sys.raw(key));
  const antalya = getOffice(bundle, 'antalya');
  const karachi = getOffice(bundle, 'karachi');
  const labels = {
    openNow: raw('contact.status.openNow'),
    closedOpensAt: raw('contact.status.closedOpensAt'),
    closedOpensTomorrow: raw('contact.status.closedOpensTomorrow'),
    closedOpensOn: raw('contact.status.closedOpensOn'),
  };
  return (
    <Section tone="pale">
      <div data-testid="contact-offices" className="container-site">
        <div className="relative overflow-hidden rounded-hero bg-gradient-to-br from-[#2c3a75] via-[#253063] to-[#16204a] p-6 md:p-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6 text-white">
            <div className="max-w-[560px]">
              <p className="m-0 mb-4 inline-block rounded-pill border border-white/30 bg-white/15 px-4 py-1.5 text-eyebrow font-extrabold uppercase tracking-[1.8px]">
                {t('contact.092')}
              </p>
              <h2 className="m-0 mb-3.5 text-h2 text-white">{t('contact.093')}</h2>
              <p className="m-0 text-body text-white/90">{t('contact.094')}</p>
            </div>
            <p className="m-0 inline-flex items-center gap-2 rounded-pill border border-white/30 bg-white/15 px-4 py-2 text-body-sm font-extrabold max-md:hidden">
              <PlaneIcon size={14} />
              {t('contact.095')}
            </p>
          </div>
          {/* OfficeCard sets no text colour of its own: `text-ink` keeps its headings off the navy
              card's white. D20: the design's ≤ 700 px tabs are a stacked column (both cards in
              the HTML). */}
          <div className="grid grid-cols-1 gap-4 text-ink lg:grid-cols-[1fr_72px_1fr] lg:gap-0">
            <OfficeCard bundle={bundle} locale={locale} office={antalya}>
              <LiveStatus variant="office" hours={antalya.hours} locale={locale} fallback={t(antalya.hoursId)} labels={labels} className={PILL} />
              <p className={NOTE}>{t('contact.101')}</p>
            </OfficeCard>
            <div aria-hidden="true" className="flex flex-col items-center justify-center text-white max-lg:hidden">
              <span className={DASH} />
              <span className="my-2.5 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-dashed border-white/45 bg-white/10">
                <PlaneIcon size={19} />
              </span>
              <span className={DASH} />
            </div>
            <OfficeCard bundle={bundle} locale={locale} office={karachi}>
              <LiveStatus variant="office" hours={karachi.hours} locale={locale} fallback={t(karachi.hoursId)} labels={labels} className={PILL} />
              <p className={NOTE}>{t('contact.108')}</p>
              <Link href="/available-workers" className="mt-2 inline-flex min-h-[44px] items-center text-body-sm font-extrabold text-success-text underline">
                {t('contact.109')}
              </Link>
            </OfficeCard>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-5 rounded-md border border-white/25 bg-white/10 p-5 text-white md:p-6">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-white/20">
              <BuildingIcon size={20} />
            </span>
            <div className="min-w-0 flex-1 basis-[280px]">
              <h3 className="m-0 mb-1 text-body text-white">{t('contact.110')}</h3>
              <p className="m-0 text-body-sm text-white/85">{t('contact.111')}</p>
            </div>
            <ContactCta placement="page_cta" href={waLink(bundle.settings.whatsappNumber, sys('contact.wa.visitSite'))} external variant="inverse">
              {t('contact.112')}
            </ContactCta>
          </div>
        </div>
        <div className="mt-5">
          <VisitBooking
            {...formDoor(bundle, locale)}
            action={submitVisit}
            hours={antalya.hours}
            copy={{
              eyebrow: t('contact.113'),
              title: t('contact.114'),
              body: t('contact.115'),
              dayLegend: t('contact.116'),
              timeLegend: t('contact.117'),
              toggleOpen: t('contact.213'),
              toggleClose: t('contact.212'),
              nameLabel: t('contact.066'),
              emailLabel: t('contact.067'),
              phoneLabel: t('contact.068'),
              submit: sys('contact.visit.submit'),
              fallbackIntro: sys('contact.fallbackIntro.visit'),
            }}
          />
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/contact/_sections/Faq.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf, metricValues } from '@/content/pure';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** "Before you write": the page's one FaqBlock (one FAQPage node, AEO only) with the design's
 *  WhatsApp ask card (W83 — the one door the design gives it). */
export function Faq({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const { replySlaHours } = metricValues(bundle, locale);
  // The package ships six questions but four answers (contact.196/198/201/204): answers 3 and 5 are
  // sys copy (W9); answer 3 takes the lines' hours (contact.135) and the SLA metric (D17).
  const items: FaqItem[] = [
    { id: 'q1', q: t('contact.195'), a: t('contact.196') },
    { id: 'q2', q: t('contact.197'), a: t('contact.198') },
    { id: 'q3', q: t('contact.199'), a: sys('contact.faq.a3', { hours: t('contact.135'), replyHours: replySlaHours ?? '' }) },
    { id: 'q4', q: t('contact.200'), a: t('contact.201') },
    { id: 'q5', q: t('contact.202'), a: sys('contact.faq.a5') },
    { id: 'q6', q: t('contact.203'), a: t('contact.204') },
  ];
  return (
    <Section tone="light">
      <div data-testid="contact-faq" className="container-site">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          items={items}
          eyebrowId="contact.119"
          headingId="contact.120"
          bodyId="contact.121"
          openFirst
          headingLevel={3}
          askCard={{
            titleId: 'contact.122',
            bodyId: 'contact.123',
            whatsappNumber: bundle.settings.whatsappNumber,
            whatsappText: sys('contact.wa.main'),
            whatsappLabelId: 'contact.124',
          }}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/contact/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getOffice } from '@/content/collections';
import { routing } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/seo/routes';
import { submitCallback, submitContact, submitVisit } from './actions';
import { contactPageJsonLd } from './_lib/jsonld';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Message } from './_sections/Message';
import { Offices } from './_sections/Offices';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations({ locale, namespace: 'sys' })]);
  // The record `contact` carries no package SEO string (titleId '') → the sys fallbacks (W23/W38).
  return buildMetadata({
    locale,
    href: '/contact',
    bundle,
    pageKey: 'contact',
    fallbackTitle: sys('seo.contact.title'),
    fallbackDescription: sys('seo.contact.description'),
  });
}

/** /iletisim · /en/contact — SSG (no dated badge, W150); the three forms post through ./actions. */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const t = makeTf(bundle, locale);
  const { settings } = bundle;
  return (
    <>
      <JsonLd
        data={contactPageJsonLd({
          name: t('contact.228'),
          url: absoluteUrl(locale, '/contact'),
          locale,
          siteUrl: settings.siteUrl,
          phone: settings.phone,
          partnershipsPhone: settings.partnershipsPhone,
          email: settings.email,
          hours: getOffice(bundle, 'antalya').hours,
        })}
      />
      <Hero bundle={bundle} locale={locale} submitCallback={submitCallback} />
      <Message bundle={bundle} locale={locale} submitContact={submitContact} />
      <Offices bundle={bundle} locale={locale} submitVisit={submitVisit} />
      <Faq bundle={bundle} locale={locale} />
    </>
  );
}
```

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` set literal, delete the line `  '/contact',` (between `'/careers/[slug]',` and `'/available-workers',` at WP2a close; find it with `grep -n "'/contact'" src/lib/seo/routes.ts`). Nothing else in the file changes.

`e2e/routes.ts` — in `GATE_ROUTE_TABLE`, immediately before the line `  // The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.`, insert:

```ts
  { path: '/iletisim', indexable: true },
  { path: '/en/contact', indexable: true },
```

`docs/SEO.md` — append this row after the last row of the `## Pages` table (T1's columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`, W98):

```markdown
| Contact | `/iletisim` · `/en/contact` | `sys.seo.contact.{title,description}` — the record `contact` carries no package SEO string (`titleId: ''`, W23/W38); OG image `/og/{locale}/contact.png` (title `sys.seo.contact.title`, subline `sys.seo.ogTagline`; CDN-cached, W123) | `absoluteUrl(locale, '/contact')` — the design's `/contact-us` is a 301 (`redirects/rules.json`) | `BreadcrumbList` (`Breadcrumbs`: `contact.023` → `/`, `contact.024` → this page, W109); `FAQPage` (`FaqBlock`, six pairs — answers 3 and 5 are `sys.contact.faq.*`; AEO only); `ContactPage` (`contact/_lib/jsonld.ts`: name `contact.228`, url, `inLanguage`, `isPartOf` WebSite, `mainEntity` Organization with the `ContactPoint`s from settings — the main line and, when `settings.partnershipsPhone` is set, the partnerships line — `availableLanguage` tr/en/fr/hi/ru and `hoursAvailable` from the Antalya `offices` row); the site-wide Organization/EmploymentAgency node is not repeated | `h1` (`data-lcp-slot="h1"`) while the full-bleed hero slot `contact-hero` is a named placeholder (§10 #4) | not a pixel page (Fable review); SSG, no `revalidate` (no dated badge, W150); the six live-status pills render the office rows' hours on the server and the computed state after hydration (R18) |
```

`docs/ANALYTICS.md` — two edits:
1. `## Event schema`, the `contact_topic` row: replace its "Fires on" cell `Contact page — a topic is chosen` with:

```markdown
Contact page (`/iletisim`, `/en/contact`) — the enquiry card's topic picker, on every change; `topic` is the picker key (`hire` \| `permit` \| `partner` \| `job`; `other` stays reserved), never a label; the `hire` default fires nothing
```

2. `### Page instrumentation (WP2b)`: append after the last bullet:

```markdown
- **Contact (`/iletisim`, `/en/contact`, T7):** `contact_topic` from the enquiry card's topic picker on every change (the picker key, never a label; the `hire` default fires nothing). `whatsapp_click` / `call_click` / `email_click` with `placement: 'page_cta'` from the hero's WhatsApp, Employers, Agencies and e-mail cards and the "Rather email? →" line (`ContactLink`), and from the "In a hurry?" and job-seeker WhatsApp buttons, the site-visit band and the FAQ ask card (`ContactCta`); with `placement: 'office_card'` from the two `OfficeCard`s' tel / WhatsApp / mail rows. The three forms fire nothing themselves: `conversion` for `form_key` `contact` / `callback` / `visit` comes from `ConversionPing` on `/tesekkurler`, and their fallback panels fire the contact events with `form_fallback`. Every page `wa.me` href carries only a company-authored `sys.contact.wa.*` prefill (W95); the fallback anchors are bare (W76). The design's `contact_form_submit`, `callback_open`, `callback_slot_pick`, `callback_request`, `visit_slot_pick` and `newsletter_subscribe` pushes are not ported (D13).
```

`docs/PRD.md` — two in-place edits (W45; `grep -n 'Contact Us\|Not yet built' docs/PRD.md`):
1. §2, the table row whose page cell is `Contact Us`: replace its last cell (`Message form (`INQUIRY`), site-visit request (`VISIT`), callback (`CALLBACK`)` at WP2a close) with:

```markdown
Topic enquiry → `contact` (`INQUIRY`: `topic` hire / permit / partner, `iAm` `direct_employer` (hire, permit) or `sourcing_partner` (partner), `subject` = the topic's detail line, `message` = subject + licence and reply-channel lines + notes, optional v1.1 `city`; the job-seeker topic files nothing — B2B explainer + WhatsApp link, W3), callback → `callback` (`CALLBACK`: `name` + `phone`, `preferredTime` = day/slot keys), book-a-visit → `visit` (`VISIT`: name, e-mail, phone, `office: antalya`, `preferredDate` ISO, `preferredTime`); consent checkbox on all three (W79); the site-visit request stays a WhatsApp link
```

2. §11, the sentence that begins "**Not yet built, by design (WP2 and later):**": in whatever wording T1, T13 and T2–T6 left it, count Contact Us as built — decrement the "N of the 14 core pages" figure by one and add "Contact Us (WP2b T7)" to the list of designed pages that sentence names — keeping the rest of the sentence as it stands (never re-add WP1 wording).

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/contact" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `ids.test.ts` (2: 144 distinct ids, all in both bundles; none of the chrome/retired ids), `sections.test.tsx` (9); `src/lib/seo/unbuilt.test.ts` green (the page and the set agree: `/contact` is built and gone from the set — it goes red if either half is missed), `src/lib/seo/routes.test.ts`, `src/app/sitemap.test.ts`, `src/app/robots.test.ts` green, `scripts/gate-routes.test.ts` green (the EN and TR indexable halves stay equal), `class-collisions.test.ts` (the `CARD` / `PHONE_CARD` / `TILE` compositions, `hidden md:inline` + `md:hidden`, every `max-md:hidden` beside a base display utility, `flex-1 basis-[280px]`, `ContactCta … className="w-full"` against every variant), `client-imports.test.ts` (no barrel anywhere; the sections are server modules, their client islands import primitives by path), `rsc-imports.test.ts`, `client-messages.test.ts` (the sections' `sys(...)`/`sys.raw(...)` reads are server-side — not scanned) and `voice.test.ts` stay green.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add "src/app/[locale]/(site)/contact" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md && git commit -m "feat(contact): /iletisim + /en/contact — hero channels with live status, #message enquiry, offices, book-a-visit, FAQ, ContactPage JSON-LD (T7 c4)

W17: the page renders id=\"message\" for the header CTA; W20/W21: /contact leaves
UNBUILT_PATHNAMES, both locale paths join GATE_ROUTE_TABLE; D26: the h1 is the LCP slot,
contact-hero a named placeholder; W109 own crumbs; W113 test ids on inner divs; W125/W156 by-path
imports. Docs: SEO page row, ANALYTICS contact_topic + page instrumentation, PRD forms row + §11.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — the page e2e (written here, run inside Cycle 6's gate)

- [ ] **Step 1: Write the failing test**

`e2e/pages/contact.spec.ts` (runs under both Playwright projects inside the Cycle 6 gate; it needs no door and no `OPS_API_URL` — W92):

```ts
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Locator, type Page } from '@playwright/test';

const ROUTES = { tr: '/iletisim', en: '/en/contact' } as const;
/** Canonicals, hreflang and JSON-LD URLs are built from SITE_URL, never the host this run hits. */
const ORIGIN = 'https://www.jobsadmire.com';
/** `bundle.settings` in the Phase A LOCAL bundle. */
const WA = 'https://wa.me/905011240340';
const isMobile = () => test.info().project.name === 'mobile';

/** W92: only `staging` and production carry the Operations door. Every other face — this task's
 *  localhost build (no door variables), any other Vercel preview — answers a valid submit with the
 *  D11 panel (`unauthorized`), deterministically and without filing a lead. On a door face the
 *  submitting cases skip: T14 owns real submissions. */
function onDoorFace(): boolean {
  const base = test.info().project.use.baseURL ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000';
  return /^(www\.|staging\.)?jobsadmire\.com$/.test(new URL(base).hostname);
}

/** The rendered names the selectors use (W115: the package labels sit on the inputs). */
const COPY = {
  tr: {
    h1: 'İşi asıl yapan kişilerle konuşun',
    company: /^Firma adı/,
    name: /^Adınız/,
    email: /^E-posta/,
    phone: /^Telefon \/ WhatsApp/,
    subject: /^Pozisyonlar ve kişi sayısı/,
    submitHire: /^İşe alım talebimi gönder/,
    jobTopic: /İş arıyorum/,
    partnerTopic: /Ajans veya temsilci/,
    callbackToggle: /Şu anda konuşamıyor musunuz/,
    callbackSubmit: /^Arama talep et/,
    visitToggle: /^Bir gün ve saat seçin/,
    visitSubmit: /^Ziyaret saati talep edin/,
  },
  en: {
    h1: 'Talk to the people who do the work',
    company: /^Company name/,
    name: /^Your name/,
    email: /^Email/,
    phone: /^Phone \/ WhatsApp/,
    subject: /^Roles and headcount/,
    submitHire: /^Send my hiring request/,
    jobTopic: /I am looking for a job/,
    partnerTopic: /Agency or agent/,
    callbackToggle: /Can’t talk right now/,
    callbackSubmit: /^Request call/,
    visitToggle: /^Pick a day & time/,
    visitSubmit: /^Request a visit slot/,
  },
} as const;

type Pushed = Record<string, unknown>;
function pushed(page: Page, event: string): Promise<Pushed[]> {
  return page.evaluate(
    (name) => ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter((e) => e.event === name),
    event,
  );
}

/** Lets a test click a tel:/mailto:/wa.me anchor without leaving the page: a capture-phase
 *  listener cancels the navigation; React's own click handler (the analytics push) still runs. */
async function neutraliseContactLinks(page: Page) {
  await page.evaluate(() => {
    document.addEventListener(
      'click',
      (e) => {
        const a = (e.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="mailto:"], a[href^="https://wa.me/"]');
        if (a) e.preventDefault();
      },
      true,
    );
  });
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

type JsonLdNode = Record<string, unknown> & { '@type'?: string | string[] };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}
const typesOf = (n: JsonLdNode): string[] => (Array.isArray(n['@type']) ? n['@type'] : n['@type'] ? [n['@type']] : []);
const valuesOf = (inputs: Locator) => inputs.evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value));

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 holding the only LCP slot, the named hero placeholder, #message once, the sections in design order, no leaked tokens (D26/W55/W17)`, async ({ page }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).toHaveText(COPY[locale].h1);
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1'); // the hero photo is a placeholder (§10 #4)
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    const placeholders = await page.locator('[data-placeholder]').evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder')));
    expect(placeholders).toEqual(['contact-hero']);
    await expect(page.locator('#message')).toHaveCount(1);
    await expect(page.locator('#faq')).toHaveCount(1);
    const tops = await page.evaluate(() =>
      ['contact-hero', 'contact-message', 'contact-offices', 'contact-faq'].map(
        (id) => document.querySelector(`[data-testid="${id}"]`)?.getBoundingClientRect().top ?? Number.NaN,
      ),
    );
    expect(tops.every((y) => Number.isFinite(y))).toBe(true);
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
    // After hydration (an unfilled template would read `{open}`) nothing leaks into the copy.
    await expect(page.getByTestId('live-status').first()).toHaveAttribute('data-open', /^(true|false)$/);
    expect(await page.locator('main').innerText()).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object |contact\.\d{3}/);
  });

  test(`${locale}: JSON-LD — one ContactPage on the canonical URL with both lines, one BreadcrumbList of this page’s crumbs, one FAQPage of six pairs`, async ({ page }) => {
    await page.goto(ROUTES[locale]);
    const nodes = await jsonLdNodes(page);
    const of = (type: string) => nodes.filter((n) => typesOf(n).includes(type));
    expect(of('ContactPage')).toHaveLength(1);
    expect(of('BreadcrumbList')).toHaveLength(1);
    expect(of('FAQPage')).toHaveLength(1);
    expect(of('Organization')).toHaveLength(1); // the site-wide node only — never repeated per page
    const contactPage = of('ContactPage')[0] as { url?: string; inLanguage?: string; mainEntity?: { contactPoint?: { telephone?: string }[] } };
    expect(contactPage.url).toBe(`${ORIGIN}${ROUTES[locale]}`);
    expect(contactPage.inLanguage).toBe(locale);
    expect(contactPage.mainEntity?.contactPoint?.map((p) => p.telephone)).toEqual(['+905011240340', '+905533832549']);
    const crumbs = of('BreadcrumbList')[0] as { itemListElement: { item: string }[] };
    expect(crumbs.itemListElement.map((i) => i.item)).toEqual([locale === 'tr' ? `${ORIGIN}/` : `${ORIGIN}/en`, `${ORIGIN}${ROUTES[locale]}`]);
    expect((of('FAQPage')[0] as { mainEntity: unknown[] }).mainEntity).toHaveLength(6);
  });
}

test('tr: the header CTA lands on #message (W17/W152/W158)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const cta = page.getByRole('banner').locator('a[href="/iletisim#message"]').first();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/\/iletisim#message$/);
  await expect(page.locator('#message')).toBeInViewport();
});

test('tr: every live pill hydrates from its offices row; the QR is inline SVG with no third-party image (R18/W14)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const pills = page.getByTestId('live-status');
  await expect(pills).toHaveCount(6); // hero, WhatsApp, the two phone lines, the two offices
  for (let i = 0; i < 6; i++) await expect(pills.nth(i)).toHaveAttribute('data-open', /^(true|false)$/);
  await expect(page.getByTestId('contact-qr').locator('svg[role="img"]')).toHaveCount(1);
  await expect(page.locator('img[src*="qrserver"]')).toHaveCount(0);
});

test('tr: the topic picker — the job card files nothing, partner swaps city for the licence, contact_topic carries the key only (W3/W12/W114)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const card = page.getByTestId('contact-message');
  const form = page.getByTestId('contact-enquiry-form');
  await expect(form.locator('input[name="topic"]')).toHaveValue('hire');
  await card.locator('label', { has: page.getByRole('radio', { name: COPY.tr.jobTopic }) }).click();
  await expect(page.getByTestId('contact-jobseeker')).toBeVisible();
  await expect(form).toHaveCount(0);
  await expect(page.getByTestId('contact-jobseeker').locator(`a[href^="${WA}?text="]`)).toHaveCount(1);
  await card.locator('label', { has: page.getByRole('radio', { name: COPY.tr.partnerTopic }) }).click();
  await expect(form.locator('input[name="topic"]')).toHaveValue('partner');
  await expect(form.locator('input[name="licence"]')).toHaveCount(1);
  await expect(form.locator('input[name="city"]')).toHaveCount(0);
  const events = await pushed(page, 'contact_topic');
  expect(events.map((e) => e.topic)).toEqual(['job', 'partner']);
  for (const e of events) {
    expect(Object.keys(e).sort()).toEqual(['event', 'locale', 'page', 'topic']);
    expect(e).toMatchObject({ locale: 'tr', page: ROUTES.tr });
  }
});

test('tr: the enquiry ends on the D11 panel without a door (W92) — values kept, bare wa.me href, click-time prefill (W76/W95)', async ({ page }) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('contact-enquiry-form');
  await form.getByRole('textbox', { name: COPY.tr.company }).fill('Akdeniz Otel A.Ş.');
  await form.getByRole('textbox', { name: COPY.tr.name }).fill('Ayşe Yılmaz');
  await form.getByRole('textbox', { name: COPY.tr.email }).fill('ayse@example.com');
  await form.getByRole('textbox', { name: COPY.tr.phone }).fill('+90 532 000 00 00');
  await form.getByRole('textbox', { name: COPY.tr.subject }).fill('10 kaynakçı, 4 CNC operatörü');
  await form.getByRole('checkbox').check(); // W79: the consent tick
  await form.getByRole('button', { name: COPY.tr.submitHire }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  await expect(form.getByRole('textbox', { name: COPY.tr.company })).toHaveValue('Akdeniz Otel A.Ş.');
  await expectBareWhatsAppFallback(page, panel, 'Ayşe Yılmaz');
});

test('en: a missing required field is reported on its input; the typed values survive; nothing navigates', async ({ page }) => {
  await page.goto(ROUTES.en);
  const form = page.getByTestId('contact-enquiry-form');
  await form.getByRole('textbox', { name: COPY.en.company }).fill('Acme Hotels');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: COPY.en.submitHire }).click();
  await expect(form.getByRole('textbox', { name: COPY.en.name })).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('#f-contact-enquiry-name-error')).toBeVisible();
  await expect(form.getByRole('textbox', { name: COPY.en.company })).toHaveValue('Acme Hotels');
  expect(new URL(page.url()).pathname).toBe(ROUTES.en);
});

test('en: the callback widget opens to a callback form — day and slot keys, name, phone, consent (W3/W79)', async ({ page }) => {
  await page.goto(ROUTES.en);
  const toggle = page.getByRole('button', { name: COPY.en.callbackToggle });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('contact-callback-form')).toHaveCount(0);
  await toggle.click();
  const form = page.getByTestId('contact-callback-form');
  await expect(form).toHaveAttribute('data-form-key', 'callback');
  expect(await valuesOf(form.locator('input[name="day"]'))).toEqual(['today', 'tomorrow', 'this_week']);
  expect(await valuesOf(form.locator('input[name="slot"]'))).toEqual(['09-11', '11-13', '14-16', '16-18', 'any']);
  await expect(form.getByRole('textbox', { name: COPY.en.name })).toBeVisible();
  await expect(form.getByRole('checkbox')).toBeVisible();
});

test('tr: the callback ends on the D11 panel without a door (W92)', async ({ page }) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  await page.getByRole('button', { name: COPY.tr.callbackToggle }).click();
  const form = page.getByTestId('contact-callback-form');
  await form.locator('input[name="slot"][value="14-16"]').check({ force: true }); // chips are sr-only radios
  await form.getByRole('textbox', { name: COPY.tr.name }).fill('Mehmet Kaya');
  await form.getByRole('textbox', { name: COPY.tr.phone }).fill('+90 532 000 00 00');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: COPY.tr.callbackSubmit }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  await expectBareWhatsAppFallback(page, panel, 'Mehmet Kaya');
});

test('tr: book-a-visit — five ISO day chips from the Istanbul clock, five slots, the W3 trio, the D11 panel without a door', async ({ page }) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const toggle = page.getByRole('button', { name: COPY.tr.visitToggle });
  if (await toggle.isVisible()) await toggle.click(); // ≤ 700 px the form sits behind the design's toggle
  const form = page.getByTestId('contact-visit-form');
  await expect(form).toHaveAttribute('data-form-key', 'visit');
  const days = form.locator('input[name="preferredDate"][type="radio"]');
  await expect(days).toHaveCount(5); // after hydration — the server sends a plain date input
  for (const value of await valuesOf(days)) expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await expect(form.locator('input[name="preferredTime"]')).toHaveCount(5);
  await days.first().check({ force: true });
  await form.locator('input[name="preferredTime"][value="11:00"]').check({ force: true });
  await form.getByRole('textbox', { name: COPY.tr.name }).fill('Ayşe Yılmaz');
  await form.getByRole('textbox', { name: COPY.tr.email }).fill('ayse@example.com');
  await form.getByRole('textbox', { name: COPY.tr.phone }).fill('+90 532 000 00 00');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: COPY.tr.visitSubmit }).click();
  await expect(form.getByTestId('form-fallback')).toHaveAttribute('data-kind', 'unauthorized');
});

test('tr: contact clicks fire their placements — page_cta from the hero cards, office_card from the office rows (W12)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  const hero = page.getByTestId('contact-hero');
  await hero.locator(`a[href^="${WA}?text="]`).first().click();
  await hero.locator('a[href="tel:+905011240340"]').first().click();
  await page.getByTestId('contact-offices').locator('article a[href^="tel:"]').first().click();
  expect(await pushed(page, 'whatsapp_click')).toEqual([expect.objectContaining({ placement: 'page_cta', locale: 'tr', page: ROUTES.tr })]);
  expect(await pushed(page, 'call_click')).toEqual([
    expect.objectContaining({ placement: 'page_cta' }),
    expect.objectContaining({ placement: 'office_card' }),
  ]);
});

test('en: axe stays clean with the callback open and the job-seeker panel shown (states the route sweep never opens)', async ({ page }) => {
  await page.goto(ROUTES.en);
  await page.getByRole('button', { name: COPY.en.callbackToggle }).click();
  await expect(page.getByTestId('contact-callback-form')).toBeVisible();
  await page.getByTestId('contact-message').locator('label', { has: page.getByRole('radio', { name: COPY.en.jobTopic }) }).click();
  await expect(page.getByTestId('contact-jobseeker')).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  expect(results.violations.map((v) => `${v.id} ×${v.nodes.length}`)).toEqual([]);
});

test('tr: the language switch keeps the visitor on the contact page (W17)', async ({ page }) => {
  test.skip(isMobile(), 'the header switcher shows from 901 px; the hamburger carries it below');
  await page.goto(ROUTES.tr);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}${ROUTES.en}`);
  await page.getByRole('banner').getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en\/contact$/);
  await expect(page.getByTestId('page-h1')).toHaveText(COPY.en.h1);
});
```

- [ ] **Step 2: Run to verify it fails**

Not run against a server here: Playwright needs a production build, and the task gets exactly one build + one start + one gate (W126, Cycle 6). Before this task every case failed by construction (`/iletisim` and `/en/contact` answered 404 through `[...rest]`); Cycle 6 runs it against the finished page. What this cycle proves locally is that the spec parses, type-checks and lints:

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx playwright test e2e/pages/contact.spec.ts --list
```
Expected: 15 tests listed per project (30 in total) — no server is contacted by `--list`.

- [ ] **Step 3: Implement**

The spec above is the whole change (the page already exists since Cycle 4).

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write e2e/pages/contact.spec.ts && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green (the spec is outside Vitest's `include`; `tsc` and ESLint cover it).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add e2e/pages/contact.spec.ts && git commit -m "test(contact): page e2e — contract, JSON-LD, #message CTA, live pills, topic picker, three door-less D11 submissions, placements, axe in opened states (T7 c5)

W92: deterministic without OPS_API_URL (the submitting cases skip on a door face); W76/W95: bare
fallback href, click-time prefill; W12: page_cta and office_card placements; W115: selectors
use the rendered package labels.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 6 — the W126 proof session: one build, one start, the gate, js-size, the launch anchor check; the ledger row

One heavy job at a time, in this order, and the server is killed at the end whatever the outcome.

- [ ] **Step 1: Pre-flight — no new test (the Cycle 5 page spec and the existing gate are the tests); check the facts this task relies on and must not edit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2
grep -n "iletisim\|/en/contact" e2e/routes.ts          # 2 hits, both `indexable: true` (W21)
grep -n "'/contact'" src/lib/seo/routes.ts             # no hit (the UNBUILT key is gone, W20)
grep -n "hash: '#message'" src/design/chrome/ctas.ts   # 1 hit — CTA_BY_PATHNAME['/contact'], untouched (W17/W121)
ls -a | grep '^\.env'                                  # only .env.example (Next never loads it)
env | grep -E '^(OPS_|NEXT_PUBLIC_TURNSTILE|NEXT_PUBLIC_GTM|NEXT_PUBLIC_GA4|NEXT_PUBLIC_ADS)' || echo 'door-less, GTM-dark'
git status --short                                     # clean: Cycles 1–5 are committed
```
Expected: exactly as annotated. A door variable or an `.env.local` must be removed from this shell/worktree before building — the page spec must meet the door-less face (W92) and a GTM id would put third-party script into the measured budget (W146). If a route fact differs, WP2a or an earlier page task drifted: stop and report; never "fix" the route list or the CTA table from this page task.

- [ ] **Step 2: Build and start (the one build, W126)**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2
rm -rf .next .lighthouseci lighthouse-report test-results playwright-report
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/contact-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/iletisim && echo up
```
(An agent shell may start the server with its own background-run facility instead of `&`; keep its PID for Step 4 either way, and wait with `curl --retry`, never a bare `sleep`.)

Expected: the build succeeds — it is the first time the RSC boundaries of `page.tsx` → the four server sections → the `'use client'` `LiveStatus`/`ContactEnquiry`/`CallbackWidget`/`VisitBooking`/`FormShell`/`Field`/`RadioChips`/`Accordion`/`ContactLink`, the three server actions passed through the sections as props, and the server-only `QrCode` are compiled (jsdom could not see them); the route table lists `/[locale]/contact` as prerendered for both locales (no `headers()`/`cookies()` in the page — only the actions read the request, at submit time); `up` is printed. A build error is fixed in the source, committed after the verify line, and the build re-run — that re-run is still "the" build of this session.

- [ ] **Step 3: The gate, js-size, the launch anchor check**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2
E2E_BASE_URL=http://localhost:3000 npm run gate
npm run js-size
E2E_BASE_URL=http://localhost:3000 npm run gate:launch > "$TMPDIR/contact-gate-launch.log" 2>&1 || true
grep -n 'missing id="message"' "$TMPDIR/contact-gate-launch.log" || echo 'no missing #message anchor'
grep -n '/iletisim\b\|/en/contact\b' "$TMPDIR/contact-gate-launch.log" || echo 'contact routes not listed as dead'
```
Expected:
- **Gate** (localhost wears the production face → `lighthouserc.local.json`, W135/W145): Playwright green under `mobile` and `desktop` — `e2e/pages/contact.spec.ts` 29 passed + 1 skipped (the language-switch case skips on `mobile` by design), and `routing` (page contract on `/iletisim`, `/en/contact`), `seo` (canonical/hreflang on both, the sitemap lists both, every sitemap URL 200), `a11y` (zero `wcag2a`/`wcag2aa`/`wcag22aa` violations on both routes under both projects; `region` clean at 390/1000/1440), `width-sweep` (no horizontal overflow at 1440…390 incl. 1101/1100 and 901/900), `chrome` (every earlier page's header CTA still lands), `headers`, `thank-you` all green; the two token cases of `ops.spec.ts` skip without `REVALIDATE_SECRET` (as at WP2a). `lhci assert` passes on every indexable gate route; on `/iletisim` and `/en/contact` (median of 3 DevTools-throttled runs): performance ≥ 0.95, accessibility 1, best-practices 1, SEO 1, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms (the h1), CLS ≤ 0.1.
- **js-size** (W136 — the ledger's figure): both contact routes below the 194,560 B lazy line. Projection: the WP2a close measured the shell at 176,132 B (TR) / 172,783 B (EN) locally; this page adds the forms kernel's client graph (`FormShell`, `Field`, `FormErrorsContext`, `FallbackPanel`, the `Turnstile` loader, `guardAction`, `echo`, `errors` — ≈ 7–8 KB gz, shared with T1/T2/T5's forms but counted per route), `RadioChips` (≈ 0.5 KB) and the page's islands (`LiveStatus` + the clock + `office-status`/`live-status-text`, `ContactEnquiry`, `CallbackWidget`, `VisitBooking`, the icons — ≈ 4–5 KB; `ContactLink`, `Accordion`, `Button`, `track` already ship with the chrome) → ≈ 188–190 KB (TR) / 185–187 KB (EN) locally, ≈ 191–193 KB on a preview. The LCP column should read the h1 at ≈ 1.5–2.0 s.
- **Over the lazy line** (either route > 194,560 B): do NOT start T8 and do NOT add a second build here — record the table and the route's client chunk list (`.next/server/app/[locale]/(site)/contact/page_client-reference-manifest.js`) and report to the controller (W13 amended: the lazy pass happens before the next page). The page's own levers are small: `VisitBooking` behind `LazyIsland` with a static card fallback (below the fold everywhere; ≈ 1 KB) and `CallbackWidget` loading its form subtree on first open (`React.lazy`; ≈ 0.5 KB) — the forms kernel stays in the first-load graph because the enquiry form is the page's content and the `#message` target; moving it behind an interaction needs a ruling.
- **Launch anchor check** (W152/W158): the launch profile stays RED by design (other pages' unbuilt routes and anchors), but the first grep prints `no missing #message anchor` — the anchor half's lines (`CTA_BY_PATHNAME['/contact'].primary (/contact#message): <locale> <path> → missing id="message" …`) are gone for both locales — and the second prints `contact routes not listed as dead`. The dead-href half still lists `/adaylar` and `/en/available-workers` (the chrome's nav and this page's Karachi link) until T8 lands — by design.

- [ ] **Step 4: Stop the server, record the numbers**

```bash
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: `no stray processes` (kill any survivor by PID). `.lighthouseci/` and `lighthouse-report/` hold no secret on a localhost run, but are never committed.

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T7 row to the `## Ledger` table in T1's row format (W98), filled from this session (the "**Ledger line**" template at the end of this task — every `<…>` from Steps 3–4; none typed from memory).

- [ ] **Step 5: Verify and commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 && git add docs/superpowers/plans/2026-09-20-wp2b-pages.md && git commit -m "docs(contact): T7 ledger row — gate, js-size, Lighthouse medians, launch anchor sweep (T7 c6)

Localhost proof session (W126/W145): one build, one gate, both contact routes measured
against the 194,560 B lazy line (W136); #message present for CTA_BY_PATHNAME['/contact'] in
both locales (W152/W158); named deltas and the WP-C sheet entries recorded.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:**
- `docs/CONTENT-MODEL.md` — the Contact bullet in the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (Cycle 1, with the keys).
- `docs/SEO.md` — the Contact row of T1's `## Pages` table, naming the LCP element (the h1 while `contact-hero` is a placeholder) and the three JSON-LD nodes (Cycle 4).
- `docs/ANALYTICS.md` — the `contact_topic` row's "Fires on" cell and the Contact bullet under `### Page instrumentation (WP2b)` (Cycle 4; no new event, parameter or enum value).
- `docs/PRD.md` — §2's Contact Us row, last cell (the three forms' door mapping, W3/W16/W79), and the §11 "Not yet built" sentence (page count, Contact Us built), edited in place (Cycle 4, W45).
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T7 `## Ledger` row (Cycle 6).
- No `docs/ARCHITECTURE.md` change (the page follows T1's private-folder paragraph and the forms-kernel pattern as documented; no new foundation behaviour). No `docs/INTEGRATIONS.md` change: every field sent is in catalog v1.0 + v1.1 (`contact.city`, `contact.topic`), and T14 writes the I4 instance map (the wire listed under **Interfaces → Produces**).

**Sys keys added:** 25, identical key set in `src/messages/tr.json` and `src/messages/en.json`, pinned by `_lib/__tests__/copy.test.ts`: `sys.seo.contact.title`, `sys.seo.contact.description`, `sys.contact.languages.tr`, `sys.contact.languages.en`, `sys.contact.languages.fr`, `sys.contact.languages.hi`, `sys.contact.languages.ru`, `sys.contact.channels.whatsapp`, `sys.contact.channels.open`, `sys.contact.status.openNow`, `sys.contact.status.closedOpensAt`, `sys.contact.status.closedOpensTomorrow`, `sys.contact.status.closedOpensOn`, `sys.contact.status.opensAt`, `sys.contact.status.waWatched`, `sys.contact.status.waOff`, `sys.contact.visit.submit`, `sys.contact.wa.main`, `sys.contact.wa.jobseeker`, `sys.contact.wa.visitSite`, `sys.contact.fallbackIntro.contact`, `sys.contact.fallbackIntro.callback`, `sys.contact.fallbackIntro.visit`, `sys.contact.faq.a3`, `sys.contact.faq.a5`. Consumed, not added: `sys.form.*` (labels, the `email`/`phone`/`city`/`preferredDate` placeholders, `hints.{phone,optional}`, `errors.*`, `consent.label`, `submit.sending`, `fallback.*`), `sys.nav.breadcrumbs` (Breadcrumbs), `sys.whatsapp.prefill` (OfficeCard), `sys.seo.ogTagline` (the OG route), `sys.thankYou.forms.{contact,callback,visit}` (the thank-you page).

**Package ids used:** 144 `contact.*` ids read by exact id in the route's own source (counted by the same scan `ids.test.ts` runs), every one verified present in `src/content/local/catalogue.json` and in both generated bundles (all 228 `contact.*` ids exist) — first `contact.023`, last `contact.228`: `contact.023`–`046`, `049` (hero, channels, callback copy), `050`–`071`, `074`–`085`, `089`–`091` (message section, picker, enquiry, job-seeker panel), `092`–`095`, `101`, `108`–`117` (offices, site visit, book-a-visit), `119`–`124` (FAQ head and ask card), `135` (the lines' hours), `152`–`155` (hero pill fragments), `161`–`186` (per-topic form copy and the reply chip), `187`–`194` (process steps), `195`–`204` (FAQ pairs), `205`–`207`, `209`–`213`, `215`, `216`, `218` (callback chips, the ≤ 700 px toggles, the phone-line status, the desk prefix), `228` (the ContactPage name). Read through data and blocks: `contact.096`/`097`, `099`/`104`, `133`/`105`, `134`/`103`, `100`/`106` (the `offices` rows — `OfficeCard` and the pills' fallbacks), `home.192`, `home.221` (`OfficeCard`). Not read (pinned by `ids.test.ts`): `contact.001`–`022` and `125`–`149` except `135` (chrome — R15/W17), `047`, `048`, `221` (the callback's WhatsApp confirmation — D13), `072` (KVKK — W79, WP-C sheet), `073`, `086`–`088` (the sent panel — D13), `098`, `102`, `107` (office-card labels the frozen `OfficeCard` replaces), `118` (→ `sys.contact.visit.submit`), `217` (the ≤ 700 px picked pill), `222` (newsletter — W5); also unused: `150`, `151` (weekday abbreviations — `Intl`), `156`–`160` (the WhatsApp message labels), `208`, `214` (the bottom bar's prefill — chrome), `219`, `220`, `223`–`227` (chrome licence line; exonyms — the JSON-LD uses BCP 47 codes).

**CLIENT_SYS additions:** none. No `'use client'` module of this task calls `useTranslations`: the islands receive every string resolved on the server — the live-status templates as raw strings (`sys.raw`) that `LiveStatus` fills with `{time}`/`{open}`/`{close}`/`{day}` — and the forms kernel reads only `sys.form`, already listed; `src/i18n/client-messages.ts` stays `consent, languageHint, errorTitle, errorRetry, form` (plus whatever T1–T6 legitimately added) and `client-messages.test.ts` needs no change (W148).

**Foundation gaps:** none blocking; every name this task consumes exists at `bc708a3` and was checked in the code. Notes: (a) the catalog v1.1 `contact.city` and `contact.topic` (and `callback.city`, not sent — the design collects no city there) are cited as `A/produces-final.md` § Task 8 spells them; the wire names are confirmed by the Task 8 report ("Task 8 — as built", Operations `main` `47a2160`: the names ride inside `fields` as strings; the preview reads `subject: [<topic>] …`). (b) `OfficeCard` sets no text colour on its `<article>` — its `h3` inherits, so a page that mounts it inside a dark container must set `text-ink` on a wrapper (this task does); one `text-ink` class on the block's article would remove the trap for T6/later pages. Its frozen layout also puts the page's `children` above the address, shows the office phone as stored E.164, and offers the main number's WhatsApp row for Karachi — accepted as design deltas here. (c) `FallbackPanel`'s `WHATSAPP_FIELDS` carries neither `licence` nor the callback's `day`/`slot` nor `reply`, so the D11 WhatsApp prefill loses the partner licence and the requested call-back slot (the door path carries both) — a one-line additive change in `src/forms/client/FallbackPanel.tsx` if the owner wants them in the fallback message. (d) `FaqBlock`'s ask card has no per-width visibility (the design hides it ≤ 700 px) — accepted. (e) `LazyIsland` is viewport-only; if a contact route crosses the lazy line, moving the enquiry form behind an interaction needs a ruling (Cycle 6's branch).

**Ledger line** (append to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`; fill every `<…>` from Cycle 6):

```markdown
| T7 Contact | `/iletisim` · `/en/contact` | js-size (local): `/iletisim` <n> B · `/en/contact` <n> B (ceiling 204,800; lazy line 194,560; projected ≈ 188–190 KB / 185–187 KB locally, ≈ 191–193 KB on a preview); binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production): `/iletisim` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n>; `/en/contact` perf <x.xx> · LCP <n> ms · CLS <n> | not a D27 page — Fable side-by-side; named deltas 1–17 (this task's header): (a) D20 faces (success/inverse WhatsApp buttons, white checked topic cards with the ✓ badge at every width, text-tertiary greys, the real "Open WhatsApp →"); (b) W3/W79/W114/W115 three door forms with package labels, consent checkboxes, name/e-mail/phone added to callback/visit, `sys.contact.visit.submit`, OfficeCard layout, stacked office cards, no sent panels, no design dataLayer pushes; (c) `contact-hero` placeholder, FAQ ask card at every width; WP-C sheet: `contact.072` (KVKK sentence the kernel consent replaces, W79), `contact.029`/`077`/`078`/`183`/`204` (legal, rendered verbatim), the package's first-person lines (`contact.042`, `046`, `052`, `076`–`079`, `081`, `084`, `115`, `123`, `197` … — W154: package copy waits for WP-C); owner notes: the Karachi office rows show the main number (`offices.karachi.phone`), `contact.046` carries the call-back number in copy; launch anchor sweep: `#message` present in both locales (W152/W158) | <YYYY-MM-DD> |
```
