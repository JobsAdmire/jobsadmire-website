### Task 7: Contact (`/iletisim`, `/en/contact`) — live-status islands, topic enquiry → `contact`, callback → `callback`, book-a-visit → `visit`, server QR, FAQ, ContactPage JSON-LD, office cards

**Why this shape.** The design (`design-package/design/Contact Us.dc.html`, strings `contact.001–228`) is a WhatsApp-only mock: every form opens `wa.me`, the live clocks are computed in a 60 s `setInterval`, the QR is fetched from `api.qrserver.com`, the JSON-LD is injected after mount, and the callback/visit widgets collect no name, e-mail or consent. Rulings that bind this port: **W3** (the door wins — Contact → `contact` with `topic` + `iAm`; callback gains `name`; book-a-visit gains name/e-mail/phone; option VALUES are stable keys), **W16/Task 8** (catalog v1.1: `topic` enum and `city` on `contact`), **W114** (the enquiry's inputs carry the catalog names `subject` and `city`, so the D11 fallback prefill — `FallbackPanel`'s `WHATSAPP_FIELDS` — keeps the visitor's main request; the partner licence is its own `licence` input folded into `message`), **W79** (a consent **checkbox** on all three forms; pages omit `consentLinkHref`, so the link is the site-wide `/privacy`; the package's KVKK sentence `contact.072` is not rendered and goes on the WP-C legal sheet), **W95/W76** (no visitor data in any DOM href: the page's own `wa.me` links carry only company prefills from `sys.contact.wa.*`; the fallback panel's anchor is the bare chat and its prefill is composed at click time — asserted in the e2e), **W109** (the crumbs are this page's own ids, `contact.023`/`contact.024`), **W113** (section test ids sit on a wrapping `<div>`; `Section`'s props stay `tone | id | className | children`), **W115** (every package field label is passed as `label`; `sys.form.labels.*` only where the package has none — the callback/visit identity fields; e2e selectors use the rendered labels), **W92** (previews are door-less; submission cases skip with `E2E_DOOR_ON`, T14 files real submissions on `staging`), **W98** (one shape per shared doc; sentence anchors), **W99** (this task runs after T6 and before T8 — `/privacy` exists from T13, `/available-workers` does not yet), **W9/W23** (id-less copy → `sys.contact.*`, never a minted package id; a page composes fragments only where the package itself splits them — `contact.152/153`, `contact.218` + desk, `contact.025/026`, `contact.069/070`), **W12/W67** (`contact_topic` with `topic ∈ hire|partner|permit|job|other`; `call_click`/`whatsapp_click`/`email_click` with `page_cta`/`office_card`), **W14** (local QR through `QrCode`, no runtime fetch), **W1/D17** (numbers through `makeTf`/`metricValues`, the reply SLA through the `replySlaHours` metric), **W13 amended** (204,800 B script ceiling; the islands import zod-free `options.ts`, never the schemas), **W17** (the header CTA for `/contact` is `contact.015/016 → #message`, so this page renders `id="message"`), **W20/W21** (delete `/contact` from `UNBUILT_PATHNAMES`, add both locale paths to `e2e/routes.ts`), **D13** (success = redirect to `/tesekkurler?form=<key>`, never the design's inline "WhatsApp is open" panel), **D26/W55** (h1 is the LCP element; the `contact-hero` photo slot ships as a named placeholder), **D20** (accessibility over pixel fidelity: the ≤700 px offices tabs become a stacked column; the `✓` badges are real markup; the hero paragraph's desktop/mobile variants stay two spans toggled by CSS — W10).

**Design deltas this task accepts and records in the ledger:** (1) three door-backed forms replace the WhatsApp mocks (W3/D13); the design's `contact.073` ("Sends through WhatsApp…"), `contact.086–088` (sent panel), `contact.047/048` (callback "press send in WhatsApp"/"change the slot") and `contact.221` are therefore not rendered; (2) all three forms carry the kernel's consent checkbox (`sys.form.consent.label`, link to `/privacy` — W79); the design's inline KVKK text `contact.072` stays in the catalogue, verbatim, for the WP-C legal review, and the callback/visit widgets gain a checkbox the design did not have; (3) the "Book on WhatsApp" label `contact.118` becomes `sys.contact.visit.submit` because the request no longer goes to WhatsApp; the design's id-less WhatsApp prefills survive as `sys.contact.wa.*` (the fallback panels' intros and the page's deep links); (4) the job-seeker topic files nothing (design + W3) — it renders the B2B explainer with a WhatsApp deep link; (5) the "Agencies & agents" phone card renders only when `settings.partnershipsPhone` is non-null (hidden by data, never deleted); (6) the design's mobile-only sticky Call/WhatsApp bar (`contact.125`, prefill `contact.214`) is the chrome's `MobileBottomBar` (R15) and is not re-rendered by the page; (7) the design's enquiry-time "reply on" chip rides as a `reply:` line in `message` (no catalog field), and the callback/visit forms carry no `topic`/`company`/`message` (the design collects none).

**Execution notes.** Worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2`, branch `wp2/foundation` (never the shared checkout). Every command below runs from that directory. One build/test job at a time (Vitest with `--maxWorkers=2`; never `next build` beside a Vitest run). Every commit leaves `npm run verify` green and ends with the trailer line `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**Files:**

Create:
- `src/app/[locale]/(site)/contact/page.tsx` — the page (server component)
- `src/app/[locale]/(site)/contact/actions.ts` — `'use server'`: `submitContact`, `submitCallback`, `submitVisit`
- `src/app/[locale]/(site)/contact/options.ts` — zod-free option keys (`CONTACT_TOPICS`, `PICKER_TOPICS`, `IAM_BY_TOPIC`, `REPLY_CHANNELS`, `CALLBACK_DAYS`, `CALLBACK_SLOTS`, `VISIT_SLOTS`, `VISIT_OFFICE`) — the ONLY contact module the client islands import besides `_components/*`
- `src/app/[locale]/(site)/contact/forms.ts` — Zod schemas + `toFields` mappers (server action + tests only)
- `src/app/[locale]/(site)/contact/jsonld.ts` — page-local `contactPageJsonLd`
- `src/app/[locale]/(site)/contact/_components/office-status.ts` — pure: `officeStatus`, `localParts`, `weekdayName`, `nextOpenDates`, `formatVisitDay`
- `src/app/[locale]/(site)/contact/_components/phone.ts` — pure: `formatPhoneDisplay`
- `src/app/[locale]/(site)/contact/_components/useMinuteTick.ts` — the R18 `useSyncExternalStore` minute clock (`null` on the server and during hydration)
- `src/app/[locale]/(site)/contact/_components/LiveStatus.tsx` — `'use client'` status pill (hero / whatsapp / lines / office variants)
- `src/app/[locale]/(site)/contact/_components/ContactEnquiry.tsx` — `'use client'` topic picker + `FormShell` (`contact`) + job-seeker panel
- `src/app/[locale]/(site)/contact/_components/CallbackWidget.tsx` — `'use client'` collapsible callback card + `FormShell` (`callback`)
- `src/app/[locale]/(site)/contact/_components/VisitBooking.tsx` — `'use client'` book-a-visit card + `FormShell` (`visit`)
- `src/app/[locale]/(site)/contact/__tests__/forms.test.ts`
- `src/app/[locale]/(site)/contact/__tests__/office-status.test.ts`
- `src/app/[locale]/(site)/contact/__tests__/phone.test.ts`
- `src/app/[locale]/(site)/contact/__tests__/jsonld.test.ts`
- `src/app/[locale]/(site)/contact/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/contact/__tests__/LiveStatus.test.tsx`
- `src/app/[locale]/(site)/contact/__tests__/ContactEnquiry.test.tsx`
- `src/app/[locale]/(site)/contact/__tests__/CallbackWidget.test.tsx`
- `src/app/[locale]/(site)/contact/__tests__/VisitBooking.test.tsx`
- `e2e/pages/contact.spec.ts`

Modify:
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.contact.{title,description}` inside the existing `sys.seo` object (WP2a Task 4 created it with `ogTagline`; earlier page tasks added their own `seo.<pageKey>` objects beside it), and a new `sys.contact` object
- `src/lib/seo/routes.ts` — delete the `'/contact',` entry from the `UNBUILT_PATHNAMES` set literal (find it with `grep -n "'/contact'" src/lib/seo/routes.ts`)
- `e2e/routes.ts` — two rows in `GATE_ROUTE_TABLE`, inserted immediately before the line `// The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.`
- `docs/SEO.md` — one row appended to the `## Pages` table T1 created
- `docs/ANALYTICS.md` — the `contact_topic` row's "Fires on" cell; one bullet in `### Page instrumentation (WP2b)`
- `docs/CONTENT-MODEL.md` — one bullet in the per-page list under `### Adding copy (W9, W23, W54)`
- `docs/PRD.md` — the Contact Us row's forms cell (anchored on its text)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T7 ledger row (T1's row format, W98)

Test:
- Vitest: the nine `__tests__` files above (`npx vitest run "src/app/\[locale\]/(site)/contact" --maxWorkers=2`), plus the existing `src/lib/seo/unbuilt.test.ts` (red while the page exists and the key is still in the set), `src/messages/messages.test.ts` (identical key sets) and `scripts/gate-routes.test.ts` (EN/TR halves equal)
- Playwright: `e2e/pages/contact.spec.ts` (both projects) + the page-contract loop in `e2e/routing.spec.ts`, `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` picking up the two new routes from `e2e/routes.ts`
- `npm run verify`; `npm run gate` against a door-less preview (W92) with the W91 bypass header; `npm run js-size`

**Interfaces:**

Consumes (exact names; WP2a `produces-final.md` unless marked; for `src/forms/**` the code at HEAD after the Task 2 fix round):
- WP1: `getBundle` (`@/content/adapter`, re-exports `pure.ts`), `routing` (`@/i18n/routing`), `Locale` (type, `@/i18n/routing`), `buildMetadata` (`@/lib/seo/metadata`), `absoluteUrl` (`@/lib/seo/routes`), `JsonLd` (`@/lib/seo/JsonLdScript`), `waLink`/`telLink`/`mailLink` (`@/lib/contact`), `Bundle['settings']` fields `phone`, `phoneDisplay`, `partnershipsPhone` (nullable E.164), `email`, `whatsappNumber`, `turnstileSiteKey`; `renderWithIntl` (`@/test/render`).
- Task 1: `makeTf(bundle, locale)`, `metricValues(bundle, locale)` (via `@/content/adapter`), `getOffice(bundle, 'antalya' | 'karachi')` (`@/content/collections`), `Office.hours` `{ tz, days (JS getDay), open, close }`, `Office.hoursId` (antalya `contact.100`, karachi `contact.106`), `PAGE_KEYS` entry `'contact'` (record with `titleId === ''`).
- Task 2 (code at HEAD): `createFormAction({ key, schema, toFields, consent })` (`@/forms/action`, `toFields(parsed, data, ctx)` — this page uses only `parsed`); `FormActionState` (`@/forms/types`); `WireFields` (`@/forms/wire`); `FormShell` (`@/forms/client/FormShell`) props `action`, `formKey`, `locale`, `turnstileSiteKey`, `whatsappNumber`, `whatsappIntro`, `contact`, `submitLabel`, `consent`, `title`, `testId`, `className`, `headingLevel` — `idScope` left at its default (the form key) so the three forms' ids are `f-contact-*`, `f-callback-*`, `f-visit-*`; `consentLinkHref` omitted (W79 default `/privacy`); `Field` (`@/forms/client/Field`) props `name`, `label`, `placeholder`, `hint`, `required`, `as`, `type`, `rows`, `autoComplete`, `inputMode`, `maxLength`, and the default id `f-<idScope>-<name>`; `sys.form.labels.{name,email,phone,preferredDate}`, `sys.form.placeholders.preferredDate`, `sys.form.consent.label`, `sys.form.fallback.*`; `FallbackPanel`'s `data-testid="form-fallback"` / `data-kind`, its bare `https://wa.me/<number>` anchor and click-time `window.open` (W76).
- Task 3: `track` (`@/analytics/track`) with `contact_topic: ['page','locale','topic']` and `PARAM_ENUMS.topic`; `ContactLink` (`@/analytics/ContactLink`); `CTA_BY_PATHNAME['/contact']` → `#message`; the `(site)` route group; W90 client messages (all of `sys.*` except `sys.legal.*`/`sys.seo.*` reach the islands).
- Task 4: `UNBUILT_PATHNAMES` (`@/lib/seo/routes`); `buildMetadata`'s `''` → fallback rule; `pageOgImageUrl` (implicit via `buildMetadata`); the `sys.seo` object; the switcher's `<link rel="alternate">` read (W17).
- Task 5: `Section` tones `'dark' | 'light' | 'pale'`; `RadioChips` (`@/design/primitives/RadioChips` — direct path in client islands); `Button`, `Eyebrow`, `Section` (`@/design/primitives`); blocks `Breadcrumbs` (`{ locale, items: Crumb[], tone, className }`), `ContactCta` (`{ placement, href, variant, external, className, children }`, `variant` incl. `'inverse'`), `FaqBlock` (`{ bundle, locale, items, id, eyebrowId, headingId, bodyId, askCard: { titleId, bodyId, whatsappNumber, whatsappText, whatsappLabelId }, openFirst, headingLevel }`), `ImageSlot` (`{ slot, src, alt, width, height, className }`), `OfficeCard` (`{ bundle, locale, office, children }` — renders its own `office_card` tel/WhatsApp/mail rows and `home.192`/`home.221`), `ProcessSteps` (`{ bundle, locale, steps, variant: 'plain', headingLevel }`) from `@/design/blocks`; `sys.nav.breadcrumbs`.
- Task 6: `QrCode` (`@/design/QrCode`, server-only, `{ text, label, size, className }`).
- Task 7: `GATE_ROUTE_TABLE` (`e2e/routes.ts`); the page markup contract (`h1[data-testid="page-h1"]`, `data-lcp-slot`, named `data-placeholder`); `npm run js-size`, `npm run gate` (W91 bypass header via `VERCEL_AUTOMATION_BYPASS_SECRET`; `lighthouserc.preview.json` on previews).
- Task 8 (Ops catalog v1.1, `website-form-catalog.ts`): `contact` = `name`* ≤120, `email`* ≤254, `phone` (≥ 8 digits, ≤40), `company` ≤200, `country`, `iAm` enum, `subject` ≤200, `message`* ≤5000, v1.1 `city` ≤120 and `topic ∈ hire|partner|permit|job|other`; `callback` = `name`*, `phone`*, `email`, `preferredTime` ≤120, `topic` ≤200; `visit` = `name`*, `company`, `email`*, `phone`*, `office` ≤120, `preferredDate` ≤40, `preferredTime` ≤40, `message`.
- WP2b T1 (W98): the `## Pages` table in `docs/SEO.md` (columns Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes), `### Page instrumentation (WP2b)` in `docs/ANALYTICS.md`, the per-page bullet list under `### Adding copy` in `docs/CONTENT-MODEL.md`, the ledger table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`, the `E2E_DOOR_ON` skip convention. WP2b T13: the `/privacy` page (`/gizlilik`) the consent link points at.

Produces (for T14 forms E2E and T15 Gate A):
- Routes `/iletisim` and `/en/contact` (key `/contact` gone from `UNBUILT_PATHNAMES`), both in `GATE_ROUTE_TABLE` as indexable.
- Three form instances: `data-testid="contact-enquiry-form"` (`data-form-key="contact"`), `contact-callback-form` (`callback`, mounted when the "Can’t talk right now?" card is opened), `contact-visit-form` (`visit`). **Each carries a consent checkbox** (`input[name="consent"]`, ids `f-contact-consent` / `f-callback-consent` / `f-visit-consent`) and posts the wire fields in Cycle 1 § Wire fields. `IAM_BY_TOPIC` (`options.ts`) is the topic → `iAm` map T14's row 10 records.
- Section test ids `contact-hero`, `contact-message`, `contact-offices`, `contact-faq` (on wrapping divs, W113), plus `contact-jobseeker`, `contact-qr`, `contact-callback`, `contact-visit`, `live-status` (every pill, with `data-variant` and, after hydration, `data-open`).
- The `#message` anchor W17's CTA table names; the FAQ block's `#faq`.

---

#### Cycle 1 — pure pieces + sys copy: `options.ts`, `forms.ts` (schemas → catalog fields), `office-status.ts`, `phone.ts`, `jsonld.ts`, `sys.contact.*` / `sys.seo.contact.*`

**Wire fields (the contract with the door — every name below exists in the catalog, Ops `website-form-catalog.ts` + Task 8 v1.1). Input names equal wire names (W114) except `licence`/`reply`, which fold into `message`:**

| Form key | Field sent | Source input | Catalog rule |
| --- | --- | --- | --- |
| `contact` | `name` | `name` — "Your name" (`contact.066`) | ≤120 required |
| | `email` | `email` (`contact.067`) | required |
| | `phone` | `phone` — "Phone / WhatsApp" (`contact.068`) | ≥8 digits, ≤40 |
| | `company` | `company` — company / agency name (`contact.164` / `contact.179`) | ≤200 |
| | `topic` | hidden `topic` = picker key `hire` / `permit` / `partner` | v1.1 enum, exact lower-case |
| | `iAm` | `IAM_BY_TOPIC[topic]` — `direct_employer` (hire; permit: the permit-only client is the employer of record) / `sourcing_partner` (partner) | enum |
| | `subject` | `subject` — the required per-topic line (`contact.166` / `173` / `181`) | ≤200 |
| | `message` | `subject` + (partner) `licence: <licence>` + `reply: <channel key>` + blank line + `message` notes | ≤5000 required |
| | `city` | `city` — the optional third input for hire ("City in Türkiye", `contact.168`) / permit ("Workplace city", `contact.175`); never sent for partner | v1.1 ≤120 |
| `callback` | `name`, `phone` | new required `name` (W3) + the design's tel input | required |
| | `preferredTime` | `"<day> <slot>"` from stable keys: `day` ∈ `today` `tomorrow` `this_week`, `slot` ∈ `09-11` `11-13` `14-16` `16-18` `any` | ≤120 |
| `visit` | `name`, `email`, `phone` | new required trio (W3) | required |
| | `office` | `'antalya'` constant | ≤120 |
| | `preferredDate` | ISO `YYYY-MM-DD` from the day chips (or the visitor's typed text in the pre-hydration/no-JS input) | ≤40 |
| | `preferredTime` | `09:30` `11:00` `13:30` `15:00` `16:30` | ≤40 |

All three carry `consentVersion` (envelope) and a ticked `consent` checkbox (W79 — the action refuses an unticked box with the `consent` field error). Not sent (no catalog field, by design): the reply-channel chip and the partner licence (both folded into `message`), `country` (the design collects none — never guessed), `callback.topic`/`callback.email`, `visit.company`/`visit.message`. No Contact form carries `startWhen`, so W78's `START_WHEN_KEYS` do not apply here.

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/contact/__tests__/forms.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
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
  CALLBACK_SLOTS,
  CONTACT_TOPICS,
  IAM_BY_TOPIC,
  PICKER_TOPICS,
  REPLY_CHANNELS,
  VISIT_SLOTS,
} from '../options';

const base = {
  topic: 'hire' as const,
  company: 'Akdeniz Otel A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@akdenizotel.com',
  phone: '+90 532 000 00 00',
  subject: '10 welders, 4 CNC operators',
};

describe('options — stable keys (W3), zod-free for the client islands (W13)', () => {
  it('option values are keys, never labels', () => {
    expect(PICKER_TOPICS).toEqual(['hire', 'permit', 'partner', 'job']);
    expect(CONTACT_TOPICS).toEqual(['hire', 'permit', 'partner']);
    expect(REPLY_CHANNELS).toEqual(['whatsapp', 'email', 'call']);
    expect(CALLBACK_DAYS).toEqual(['today', 'tomorrow', 'this_week']);
    expect(CALLBACK_SLOTS).toEqual(['09-11', '11-13', '14-16', '16-18', 'any']);
    expect(VISIT_SLOTS).toEqual(['09:30', '11:00', '13:30', '15:00', '16:30']);
    expect(IAM_BY_TOPIC).toEqual({ hire: 'direct_employer', permit: 'direct_employer', partner: 'sourcing_partner' });
  });
  it('options.ts imports nothing — the islands import it, so zod never reaches the client bundle', () => {
    const src = readFileSync(fileURLToPath(new URL('../options.ts', import.meta.url)), 'utf8');
    expect(src).not.toMatch(/^import /m);
  });
});

describe('contact — schema', () => {
  it('accepts the designed minimum (topic, company, name, email, phone, subject)', () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });
  it('an empty e-mail is "required" before it is "not an e-mail" (W3: .min(1) precedes .email())', () => {
    const r = contactSchema.safeParse({ ...base, email: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['email'], code: 'too_small' });
  });
  it('refuses a phone with fewer than 8 digits with the phone code (the door counts digits the same way)', () => {
    const r = contactSchema.safeParse({ ...base, phone: '+90 53' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['phone'], message: 'phone' });
  });
  it('an empty phone reads "required" first, not "phone"', () => {
    const r = contactSchema.safeParse({ ...base, phone: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['phone'], code: 'too_small' });
  });
  it('never files the job-seeker topic (design + W3): it is a picker key, not a schema value', () => {
    expect(contactSchema.safeParse({ ...base, topic: 'job' }).success).toBe(false);
  });
  it('caps each input at its catalog length', () => {
    expect(contactSchema.safeParse({ ...base, subject: 's'.repeat(201) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, city: 'c'.repeat(121) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, company: 'c'.repeat(201) }).success).toBe(false);
  });
});

describe('contact — toContactFields (catalog names exactly)', () => {
  it('hire: topic + iAm + subject/message + city', () => {
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
    const p = contactSchema.parse({ ...base, topic: 'permit', subject: '1 Uzbek chef, already in Türkiye', city: 'İstanbul' });
    const f = toContactFields(p);
    expect(f.iAm).toBe('direct_employer');
    expect(f.city).toBe('İstanbul');
    expect(f.message).toBe('1 Uzbek chef, already in Türkiye');
  });
  it('partner: sourcing_partner; the licence is a message line, never `city` (W114)', () => {
    const p = contactSchema.parse({ ...base, topic: 'partner', company: 'Skyline Manpower, Nepal', subject: 'welders and masons, 200 on file', licence: 'NP-1234' });
    const f = toContactFields(p);
    expect(f.iAm).toBe('sourcing_partner');
    expect(f).not.toHaveProperty('city');
    expect(f).not.toHaveProperty('licence');
    expect(f.message).toBe('welders and masons, 200 on file\nlicence: NP-1234');
  });
  it('a stray city on a partner post and a stray licence on a hire post are both ignored', () => {
    expect(toContactFields(contactSchema.parse({ ...base, topic: 'partner', city: 'Antalya' }))).not.toHaveProperty('city');
    expect(toContactFields(contactSchema.parse({ ...base, licence: 'X-1' })).message).toBe(base.subject);
  });
  it('an empty optional never becomes a field (buildEnvelope drops empties, but we do not rely on it)', () => {
    const f = toContactFields(contactSchema.parse({ ...base, city: '', licence: '', message: '' }));
    expect(f).not.toHaveProperty('city');
    expect(f.message).toBe(base.subject);
  });
  it('composeContactMessage stays under the 5000-char cap at the schema maxima', () => {
    const p = contactSchema.parse({ ...base, topic: 'partner', subject: 's'.repeat(200), licence: 'l'.repeat(200), reply: 'call', message: 'm'.repeat(4000) });
    expect(composeContactMessage(p).length).toBeLessThanOrEqual(5000);
  });
});

describe('callback', () => {
  it('requires the W3 name and a phone; preferredTime is "<day> <slot>" from keys', () => {
    expect(callbackSchema.safeParse({ phone: '+90 532 000 00 00' }).success).toBe(false);
    const p = callbackSchema.parse({ name: 'Mehmet', phone: '+90 532 000 00 00', day: 'tomorrow', slot: '14-16' });
    expect(toCallbackFields(p)).toEqual({ name: 'Mehmet', phone: '+90 532 000 00 00', preferredTime: 'tomorrow 14-16' });
  });
  it('no slot picked → preferredTime is the day alone; nothing picked → no preferredTime key', () => {
    expect(toCallbackFields(callbackSchema.parse({ name: 'M', phone: '05320000000', day: 'today' })).preferredTime).toBe('today');
    expect(toCallbackFields(callbackSchema.parse({ name: 'M', phone: '05320000000' }))).not.toHaveProperty('preferredTime');
  });
  it('refuses a slot label instead of a key', () => {
    expect(callbackSchema.safeParse({ name: 'M', phone: '05320000000', slot: '09:00–11:00' }).success).toBe(false);
  });
});

describe('visit', () => {
  it('requires name/email/phone (W3) and pins office=antalya', () => {
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '+90 532 000 00 00' }).success).toBe(true);
    expect(visitSchema.safeParse({ name: 'A', phone: '+90 532 000 00 00' }).success).toBe(false);
    const p = visitSchema.parse({ name: 'A', email: 'a@b.co', phone: '+90 532 000 00 00', preferredDate: '2026-09-28', preferredTime: '11:00' });
    expect(toVisitFields(p)).toEqual({ name: 'A', email: 'a@b.co', phone: '+90 532 000 00 00', office: 'antalya', preferredDate: '2026-09-28', preferredTime: '11:00' });
  });
  it('refuses a time outside the five slots and accepts the typed date (≤ 40 chars)', () => {
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '05320000000', preferredTime: '12:00' }).success).toBe(false);
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '05320000000', preferredDate: 'Wed 23 Sep' }).success).toBe(true);
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '05320000000', preferredDate: 'x'.repeat(41) }).success).toBe(false);
  });
});
```

`src/app/[locale]/(site)/contact/__tests__/office-status.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatVisitDay, localParts, nextOpenDates, officeStatus, weekdayName } from '../_components/office-status';

// Task 1's offices rows (JS getDay(): 0 = Sun … 6 = Sat, W43).
const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const karachi = { tz: 'Asia/Karachi', days: [1, 2, 3, 4, 5, 6], open: '10:00', close: '19:00' };

describe('localParts', () => {
  it('reads the clock in the office zone, never the runtime zone', () => {
    // 07:32Z = 10:32 in Istanbul (UTC+3, no DST since 2016), Wednesday
    expect(localParts(new Date('2026-09-23T07:32:00Z'), antalya.tz)).toEqual({ day: 3, minutes: 10 * 60 + 32, clock: '10:32' });
    // the same instant is 12:32 in Karachi (UTC+5)
    expect(localParts(new Date('2026-09-23T07:32:00Z'), karachi.tz).clock).toBe('12:32');
  });
});

describe('officeStatus', () => {
  it('open inside the hours on an open day', () => {
    expect(officeStatus(new Date('2026-09-23T07:32:00Z'), antalya)).toEqual({ open: true, clock: '10:32' });
  });
  it('before opening on an open day → beforeOpen, opens today', () => {
    expect(officeStatus(new Date('2026-09-23T05:10:00Z'), antalya)).toEqual({ open: false, clock: '08:10', reason: 'beforeOpen', nextOpenDay: 3, opensTomorrow: false });
  });
  it('after closing on a weekday → afterClose, opens tomorrow', () => {
    expect(officeStatus(new Date('2026-09-23T16:00:00Z'), antalya)).toEqual({ open: false, clock: '19:00', reason: 'afterClose', nextOpenDay: 4, opensTomorrow: true });
  });
  it('Friday evening → opens Monday (not tomorrow)', () => {
    expect(officeStatus(new Date('2026-09-25T16:00:00Z'), antalya)).toMatchObject({ open: false, reason: 'afterClose', nextOpenDay: 1, opensTomorrow: false });
  });
  it('Saturday noon in Antalya is a closed day; the same Saturday is open in Karachi (Mon–Sat)', () => {
    expect(officeStatus(new Date('2026-09-26T09:00:00Z'), antalya)).toMatchObject({ open: false, reason: 'closedDay', nextOpenDay: 1 });
    expect(officeStatus(new Date('2026-09-26T07:00:00Z'), karachi)).toEqual({ open: true, clock: '12:00' });
  });
  it('Sunday → closedDay, opens Monday', () => {
    expect(officeStatus(new Date('2026-09-27T12:00:00Z'), karachi)).toMatchObject({ open: false, reason: 'closedDay', nextOpenDay: 1, opensTomorrow: true });
  });
  it('an office with no open days is never open (data defect, never a crash)', () => {
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
  it('the next five open days of the Antalya office from a Friday night, as ISO dates in the office zone', () => {
    // 20:00Z Friday 25 Sep = 23:00 Istanbul: today is over, Sat/Sun are closed
    expect(nextOpenDates(new Date('2026-09-25T20:00:00Z'), antalya, 5)).toEqual(['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']);
  });
  it('never includes today (the design starts at tomorrow) and skips closed days', () => {
    expect(nextOpenDates(new Date('2026-09-23T07:32:00Z'), antalya, 3)).toEqual(['2026-09-24', '2026-09-25', '2026-09-28']);
  });
  it('formats a calendar date day-first per locale, unshifted by the runtime zone', () => {
    expect(formatVisitDay('2026-09-28', 'en')).toBe('Mon 28 Sept');
    expect(formatVisitDay('2026-09-28', 'tr')).toBe('28 Eyl Pzt');
  });
});
```

`src/app/[locale]/(site)/contact/__tests__/phone.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatPhoneDisplay } from '../_components/phone';

describe('formatPhoneDisplay', () => {
  it('groups a Turkish E.164 number the way the design and settings.phoneDisplay do', () => {
    expect(formatPhoneDisplay('+905533832549')).toBe('+90 553 383 25 49');
    expect(formatPhoneDisplay('+905011240340')).toBe('+90 501 124 03 40');
  });
  it('leaves a non-Turkish or malformed number as typed', () => {
    expect(formatPhoneDisplay('+923001234567')).toBe('+923001234567');
    expect(formatPhoneDisplay('+90 553')).toBe('+90 553');
  });
});
```

`src/app/[locale]/(site)/contact/__tests__/jsonld.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { contactPageJsonLd } from '../jsonld';

describe('contactPageJsonLd', () => {
  it('names the page, its canonical URL and its language (the addresses stay in the site-wide Organization node)', () => {
    expect(contactPageJsonLd({ name: 'Contact JobsAdmire', url: 'https://www.jobsadmire.com/en/contact', locale: 'en' })).toEqual({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact JobsAdmire',
      url: 'https://www.jobsadmire.com/en/contact',
      inLanguage: 'en',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.jobsadmire.com/en/contact' },
    });
  });
  it('has no undefined values (JSON.stringify would drop them silently)', () => {
    const node = contactPageJsonLd({ name: 'JobsAdmire ile iletişime geçin', url: 'https://www.jobsadmire.com/iletisim', locale: 'tr' });
    expect(Object.values(node).some((v) => v === undefined)).toBe(false);
  });
});
```

`src/app/[locale]/(site)/contact/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every sys key this page adds (W9/W23). `src/messages/messages.test.ts` already proves the two
 *  files share one key set; this pins the page's own set so a renamed key fails here, not in dev. */
const CONTACT_SYS_KEYS = [
  'seo.contact.title',
  'seo.contact.description',
  'contact.languages.tr',
  'contact.languages.en',
  'contact.languages.fr',
  'contact.languages.hi',
  'contact.languages.ru',
  'contact.channels.whatsapp',
  'contact.status.openNow',
  'contact.status.closedOpensAt',
  'contact.status.closedOpensTomorrow',
  'contact.status.closedOpensOn',
  'contact.status.opens',
  'contact.status.waWatched',
  'contact.status.waOff',
  'contact.callback.slots.s1',
  'contact.callback.slots.s2',
  'contact.callback.slots.s3',
  'contact.callback.slots.s4',
  'contact.visit.submit',
  'contact.form.cityPlaceholder.hire',
  'contact.form.cityPlaceholder.permit',
  'contact.wa.main',
  'contact.wa.jobseeker',
  'contact.wa.visitSite',
  'contact.wa.visit',
  'contact.wa.callback',
  'contact.faq.a3',
  'contact.faq.a5',
] as const;

const get = (obj: unknown, path: string) =>
  path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);

describe('sys.contact.* / sys.seo.contact.*', () => {
  it('pins 29 keys', () => {
    expect(CONTACT_SYS_KEYS).toHaveLength(29);
  });
  it.each(CONTACT_SYS_KEYS)('%s exists as a non-empty string in both locales', (key) => {
    for (const messages of [tr, en]) {
      const v = get(messages.sys, key);
      expect(typeof v).toBe('string');
      expect((v as string).length).toBeGreaterThan(0);
    }
  });
  it('ICU-safe: no bare ASCII apostrophe (next-intl treats it as an escape) in any contact string', () => {
    for (const messages of [tr, en])
      for (const key of CONTACT_SYS_KEYS) expect(get(messages.sys, key)).not.toMatch(/'/);
  });
  it('the ICU arguments the islands and the page pass are the ones the strings declare, in both locales', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'contact.status.openNow')).toMatch(/\{time\}.*\{close\}|\{close\}.*\{time\}/);
      expect(get(messages.sys, 'contact.status.closedOpensAt')).toMatch(/\{open\}/);
      expect(get(messages.sys, 'contact.status.closedOpensOn')).toMatch(/\{day\}/);
      expect(get(messages.sys, 'contact.faq.a3')).toMatch(/\{replyHours\}/);
      expect(get(messages.sys, 'contact.faq.a3')).toMatch(/\{hours\}/);
    }
  });
  it('the endonym chips are identical in both files (a language names itself)', () => {
    expect(get(tr.sys, 'contact.languages')).toEqual(get(en.sys, 'contact.languages'));
  });
});
```

- [ ] **Step 2: Run to verify they fail**

`npx vitest run "src/app/\[locale\]/(site)/contact" --maxWorkers=2` → four files fail at import (`Failed to resolve import "../forms"`, `"../_components/office-status"`, `"../_components/phone"`, `"../jsonld"`), and `sys-keys.test.ts` fails 29 `it.each` cases (`expected 'undefined' to be 'string'`) plus the ICU and endonym cases.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/contact/options.ts`:

```ts
// The Contact page's stable option keys (W3). No imports on purpose: the client islands read
// these, so this module must never pull zod (or anything else) into the page's client bundle
// (W13 amended) — the schemas live in ./forms.ts, which only the server action and tests import.

/** The three topics that file a `contact` inquiry. */
export const CONTACT_TOPICS = ['hire', 'permit', 'partner'] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

/** The picker adds the job-seeker refusal (contact.064/065): an explainer + WhatsApp link,
 *  never a submission — the design refuses to file candidates and W3 keeps that. Every value
 *  is in `PARAM_ENUMS.topic` (W67), so `contact_topic` carries it unchanged. */
export const PICKER_TOPICS = [...CONTACT_TOPICS, 'job'] as const;
export type PickerTopic = (typeof PICKER_TOPICS)[number];

/** Catalog `iAm` per topic. A permit-only client already employs the worker, so it is the
 *  employer of record (DIRECT_EMPLOYER); an agency/agent is a SOURCING_PARTNER. */
export const IAM_BY_TOPIC: Record<ContactTopic, 'direct_employer' | 'sourcing_partner'> = {
  hire: 'direct_employer',
  permit: 'direct_employer',
  partner: 'sourcing_partner',
};

export const REPLY_CHANNELS = ['whatsapp', 'email', 'call'] as const;
export type ReplyChannel = (typeof REPLY_CHANNELS)[number];

export const CALLBACK_DAYS = ['today', 'tomorrow', 'this_week'] as const;
export type CallbackDay = (typeof CALLBACK_DAYS)[number];
export const CALLBACK_SLOTS = ['09-11', '11-13', '14-16', '16-18', 'any'] as const;
export type CallbackSlot = (typeof CALLBACK_SLOTS)[number];

export const VISIT_SLOTS = ['09:30', '11:00', '13:30', '15:00', '16:30'] as const;
export type VisitSlot = (typeof VISIT_SLOTS)[number];
export const VISIT_OFFICE = 'antalya' as const;
```

`src/app/[locale]/(site)/contact/forms.ts`:

```ts
// Pure form specs for the Contact page's three door-backed forms (W3): Zod schemas and the
// `toFields` mappers onto the door's catalog names (docs/INTEGRATIONS.md I4; Ops
// website-form-catalog.ts v1.1 — `topic`, `city`). Input names ARE the catalog names (W114):
// `subject`, `city`; the partner licence is its own `licence` input folded into `message`
// because the contact catalog has no licence field. No directive: `actions.ts` wraps these in
// `'use server'`, the tests import them directly. Client code imports ./options.ts, never this.
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';
import {
  CALLBACK_DAYS,
  CALLBACK_SLOTS,
  CONTACT_TOPICS,
  IAM_BY_TOPIC,
  REPLY_CHANNELS,
  VISIT_OFFICE,
  VISIT_SLOTS,
} from './options';

// `.min(1)` before `.email()` so an empty value reads `required`, not `email` (W3).
const email = z.string().min(1).max(254).email();
// The door keeps the number as typed and counts digits (`website-form-catalog.ts`, type
// `phone`: ≥ 8); the same rule here, so a short number is a field error, never a 400 panel.
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
  /** The required per-topic line (roles & headcount / worker & role / what you supply). */
  subject: z.string().min(1).max(200),
  /** City in Türkiye (hire) · workplace city (permit). */
  city: z.string().max(120).optional(),
  /** Licence no. (partner) — folded into `message`. */
  licence: z.string().max(200).optional(),
  reply: z.enum(REPLY_CHANNELS).optional(),
  message: z.string().max(4000).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** subject, then the partner licence and the reply channel as `key: value` lines (internal,
 *  language-neutral — the Ops inbox is not visitor copy), then the free notes. The catalog
 *  requires `message`; starting with the subject keeps it non-empty. ≤ 200 + 210 + 16 + 4002
 *  < 5000 (the catalog cap). */
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
  if (p.topic !== 'partner' && p.city) fields.city = p.city;
  return fields;
}

export const callbackSchema = z.object({
  name: z.string().min(1).max(120),
  phone,
  day: z.enum(CALLBACK_DAYS).optional(),
  slot: z.enum(CALLBACK_SLOTS).optional(),
});
export type CallbackInput = z.infer<typeof callbackSchema>;

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
  /** ISO date from the day chips; free text (≤ 40) from the pre-hydration date input. */
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

`src/app/[locale]/(site)/contact/_components/office-status.ts`:

```ts
// Pure office-hours arithmetic over Task 1's `Office.hours` rows ({ tz, days (JS getDay), open,
// close }). Everything here takes `now` as an argument so the tests are fixed-instant and the
// island can feed it the minute tick. Intl only — no date library (W13).

export type OfficeHours = { tz: string; days: number[]; open: string; close: string };

export type OfficeStatus =
  | { open: true; clock: string }
  | {
      open: false;
      clock: string;
      reason: 'beforeOpen' | 'afterClose' | 'closedDay';
      /** JS getDay() index of the next open day (today when `beforeOpen`). */
      nextOpenDay: number;
      opensTomorrow: boolean;
    };

const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Weekday + wall clock of `now` in `tz`. `en-GB` parts are stable across engines; `% 24`
 *  guards the "24:xx" midnight quirk of `hour12: false`. */
export function localParts(now: Date, tz: string): { day: number; minutes: number; clock: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  const h = Number(get('hour')) % 24;
  const m = Number(get('minute'));
  const day = WEEKDAY_INDEX[get('weekday')];
  if (day === undefined) throw new RangeError(`localParts: unknown weekday for zone ${tz}`);
  return { day, minutes: h * 60 + m, clock: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` };
}

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};

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
      return { open: false, clock, reason: todayOpen ? 'afterClose' : 'closedDay', nextOpenDay: next, opensTomorrow: d === 1 };
  }
  // No open day at all: a data defect in the offices row — closed, never a throw on a live page.
  return { open: false, clock, reason: 'closedDay', nextOpenDay: day, opensTomorrow: false };
}

/** Localized long weekday name for a JS getDay() index. 2023-01-01 is a Sunday. */
export function weekdayName(day: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2023, 0, 1 + day)),
  );
}

/** The next `count` open days AFTER today (the design's visit chips start at tomorrow), as ISO
 *  calendar dates in the office's zone. Looks at most 21 days ahead. */
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

/** "Mon 28 Sept" / "28 Eyl Pzt" for a calendar date — UTC so the runtime zone cannot shift it. */
export function formatVisitDay(iso: string, locale: 'tr' | 'en'): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}
```

`src/app/[locale]/(site)/contact/_components/phone.ts`:

```ts
/** `settings.phoneDisplay` exists only for the main number; the partnerships line
 *  (`settings.partnershipsPhone`, E.164) needs the same "+90 553 383 25 49" grouping the
 *  design shows. Turkish numbers only (+90 + 10 digits) — anything else is returned as typed. */
export function formatPhoneDisplay(e164: string): string {
  const m = /^\+90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return m ? `+90 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : e164;
}
```

`src/app/[locale]/(site)/contact/jsonld.ts`:

```ts
import type { Locale } from '@/i18n/routing';

export type ContactPageJsonLdInput = { name: string; url: string; locale: Locale };

/** The page-level `ContactPage` node (docs/SEO.md § JSON-LD). The site-wide
 *  Organization/EmploymentAgency node in the locale layout already carries both offices'
 *  PostalAddress entries, the permit and the phone/e-mail — this node only identifies the page,
 *  so the addresses keep one source (`src/lib/seo/jsonld.ts`). */
export function contactPageJsonLd(input: ContactPageJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: input.name,
    url: input.url,
    inLanguage: input.locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
  };
}
```

`src/messages/en.json` — inside `"sys"`: add a `"contact"` object inside the existing `"seo"` object (keep `ogTagline` and the `seo.<pageKey>` objects earlier page tasks added), and a new top-level `"contact"` object beside the other `sys.<page>` objects. Typographic apostrophes (’) only — ICU treats `'` as an escape.

```json
"seo": {
  "…": "(existing keys unchanged)",
  "contact": {
    "title": "Contact — JobsAdmire",
    "description": "Call or WhatsApp our Antalya head office — one number for worker requests, work permits and partnerships. A real person answers in office hours."
  }
},
"contact": {
  "languages": { "tr": "Türkçe", "en": "English", "fr": "Français", "hi": "हिन्दी", "ru": "Русский" },
  "channels": { "whatsapp": "WhatsApp" },
  "status": {
    "openNow": "Open now · {time} local · closes {close}",
    "closedOpensAt": "Closed · opens {open} · {time} local",
    "closedOpensTomorrow": "Closed · opens {open} tomorrow",
    "closedOpensOn": "Closed · opens {day} {open}",
    "opens": "Opens {open}",
    "waWatched": "Watched now — a live agent replies during office hours",
    "waOff": "Off hours — expect a reply next business morning"
  },
  "callback": {
    "slots": { "s1": "09:00–11:00", "s2": "11:00–13:00", "s3": "14:00–16:00", "s4": "16:00–18:00" }
  },
  "visit": { "submit": "Request a visit slot" },
  "form": {
    "cityPlaceholder": { "hire": "Antalya", "permit": "İstanbul" }
  },
  "wa": {
    "main": "Hello JobsAdmire, I have a question about hiring workers in Türkiye.",
    "jobseeker": "Hello JobsAdmire, I am a candidate. My country: ___ / My trade: ___. Please send me the contact of your verified sourcing partner in my country.",
    "visitSite": "Hello JobsAdmire, we would like you to visit our site before we decide on numbers.",
    "visit": "Hello JobsAdmire, I would like to book a visit to the Antalya office.",
    "callback": "Hello JobsAdmire, please call me back."
  },
  "faq": {
    "a3": "WhatsApp is the fastest channel during office hours ({hours}, Turkish time); e-mail is answered within about {replyHours} business hours. Messages sent at night or over the weekend are picked up the next business morning.",
    "a5": "You can, but we do not take individual applications directly — we are a B2B agency and work through verified sourcing partners in your country. Pick “I am looking for a job” above and message us; we send you the verified partner’s contact. We never charge a worker a placement fee — if anyone asks you for money in our name, report it to us."
  }
}
```

(`"…": "(existing keys unchanged)"` is shorthand for this plan — do not write it into the file.)

`src/messages/tr.json` — the same keys:

```json
"seo": {
  "…": "(existing keys unchanged)",
  "contact": {
    "title": "İletişim — JobsAdmire",
    "description": "Antalya merkez ofisimizi arayın veya WhatsApp’tan yazın — işçi talebi, çalışma izni ve iş ortaklığı için tek numara. Mesai saatlerinde gerçek bir kişi yanıtlar."
  }
},
"contact": {
  "languages": { "tr": "Türkçe", "en": "English", "fr": "Français", "hi": "हिन्दी", "ru": "Русский" },
  "channels": { "whatsapp": "WhatsApp" },
  "status": {
    "openNow": "Şu anda açık · yerel saat {time} · kapanış {close}",
    "closedOpensAt": "Kapalı · açılış {open} · yerel saat {time}",
    "closedOpensTomorrow": "Kapalı · yarın {open}’da açılıyor",
    "closedOpensOn": "Kapalı · {day} {open}’da açılıyor",
    "opens": "Açılış {open}",
    "waWatched": "Şu anda takipte — mesai saatlerinde canlı bir temsilci yanıtlıyor",
    "waOff": "Mesai dışı — yanıt bir sonraki iş günü sabahı gelir"
  },
  "callback": {
    "slots": { "s1": "09:00–11:00", "s2": "11:00–13:00", "s3": "14:00–16:00", "s4": "16:00–18:00" }
  },
  "visit": { "submit": "Ziyaret saati talep edin" },
  "form": {
    "cityPlaceholder": { "hire": "Antalya", "permit": "İstanbul" }
  },
  "wa": {
    "main": "Merhaba JobsAdmire, Türkiye’de işçi istihdamı hakkında bir sorum var.",
    "jobseeker": "Merhaba JobsAdmire, adayım. Ülkem: ___ / Mesleğim: ___. Lütfen ülkemdeki doğrulanmış tedarik ortağınızın iletişim bilgisini gönderin.",
    "visitSite": "Merhaba JobsAdmire, sayılara karar vermeden önce sahamızı ziyaret etmenizi istiyoruz.",
    "visit": "Merhaba JobsAdmire, Antalya ofisine bir ziyaret ayarlamak istiyorum.",
    "callback": "Merhaba JobsAdmire, lütfen beni geri arayın."
  },
  "faq": {
    "a3": "Mesai saatlerinde ({hours}, Türkiye saati) en hızlı kanal WhatsApp’tır; e-postalar yaklaşık {replyHours} iş saati içinde yanıtlanır. Gece veya hafta sonu gönderilen mesajlar bir sonraki iş günü sabahı ele alınır.",
    "a5": "Yazabilirsiniz; ancak bireysel başvuruları doğrudan almıyoruz — B2B bir ajansız ve ülkenizdeki doğrulanmış tedarik ortakları aracılığıyla çalışıyoruz. Yukarıdan “İş arıyorum” seçeneğini seçip bize yazın; size doğrulanmış ortağın iletişim bilgisini gönderelim. Bir işçiden asla yerleştirme ücreti almıyoruz — biri bizim adımıza sizden para isterse bunu bize bildirin."
  }
}
```

The `"{open}’da"` Turkish suffix is the locative for a clock time ("09:00’da", "10:00’da"), correct for every `HH:MM` the offices collection carries. `sys.seo.contact.*` is server-only (W90 keeps `sys.seo.*` out of the client messages); every `sys.contact.*` key the islands read (`status.*`) reaches them through the W90 pick.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/contact"` first. Then `npx vitest run "src/app/\[locale\]/(site)/contact" src/messages --maxWorkers=2` → green: `forms.test.ts` (20 tests), `office-status.test.ts` (11), `phone.test.ts` (2), `jsonld.test.ts` (2), `sys-keys.test.ts` (33), `messages.test.ts`. Then `npm run verify` → green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/contact/options.ts" "src/app/[locale]/(site)/contact/forms.ts" "src/app/[locale]/(site)/contact/jsonld.ts" "src/app/[locale]/(site)/contact/_components/office-status.ts" "src/app/[locale]/(site)/contact/_components/phone.ts" "src/app/[locale]/(site)/contact/__tests__" src/messages/tr.json src/messages/en.json
git commit -m "feat(contact): form specs onto the door catalog (topic/iAm/subject/city, callback, visit), office-hours arithmetic, ContactPage node, sys.contact copy (T7 c1)

W3/W114: input names are the catalog names; the partner licence folds into message; the
job-seeker topic never files. options.ts is zod-free so the islands never ship the schemas.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — client islands: `useMinuteTick`, `LiveStatus`, `ContactEnquiry`, `CallbackWidget`, `VisitBooking`

Hydration rule (R18, the pattern Task 4's `use-alternate-path.ts` uses): the server and the hydrating render show the neutral fallback (the package's own hours string, `contact.100`/`contact.106`; the visit card's plain date input); the client snapshot arrives through `useSyncExternalStore`, never through `setState` in an effect (`react-hooks/set-state-in-effect` is enforced by `eslint-config-next` 16). One module-level clock serves every pill on the page. Every island's copy arrives resolved from the page (package ids through `makeTf`, sys copy through the server translator) except `LiveStatus`'s ICU templates, which need the live clock and so read `sys.contact.status.*` on the client.

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/contact/__tests__/LiveStatus.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { LiveStatus } from '../_components/LiveStatus';

const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const fragments = {
  openNow: 'Office open now ·',
  inCity: 'in Antalya',
  weekend: 'Weekend · WhatsApp is still watched',
  closedToday: 'Closed for today',
  linesOpen: 'Lines open now',
  linesClosed: 'Lines closed',
};

describe('LiveStatus', () => {
  // Only Date is faked: the minute clock's interval stays real and is cleared on unmount.
  beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }));
  afterEach(() => vi.useRealTimers());

  it('office variant, open: the sys openNow line with the local clock and closing time', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z')); // Wed 10:32 Istanbul
    renderWithIntl(<LiveStatus variant="office" hours={antalya} fallback="Mon–Fri · 09:00–18:00 (TRT)" fragments={fragments} />, { locale: 'en' });
    expect(screen.getByTestId('live-status')).toHaveTextContent('Open now · 10:32 local · closes 18:00');
    expect(screen.getByTestId('live-status')).toHaveAttribute('data-open', 'true');
  });

  it('hero variant composes the fragments the package itself splits (contact.152/153)', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z'));
    renderWithIntl(<LiveStatus variant="hero" hours={antalya} fallback="fb" fragments={fragments} />, { locale: 'en' });
    expect(screen.getByTestId('live-status')).toHaveTextContent('Office open now · 10:32 in Antalya');
  });

  it('on a weekend the hero pill shows the weekend fragment and the whatsapp pill the off-hours line', () => {
    vi.setSystemTime(new Date('2026-09-26T09:00:00Z')); // Sat
    renderWithIntl(
      <>
        <LiveStatus variant="hero" hours={antalya} fallback="fb" fragments={fragments} />
        <LiveStatus variant="whatsapp" hours={antalya} fallback="fb" fragments={fragments} />
      </>,
      { locale: 'en' },
    );
    const pills = screen.getAllByTestId('live-status');
    expect(pills[0]).toHaveTextContent('Weekend · WhatsApp is still watched');
    expect(pills[1]).toHaveTextContent('Off hours — expect a reply next business morning');
    expect(pills[1]).toHaveAttribute('data-open', 'false');
  });

  it('office variant, Friday night: opens Monday by localized weekday name (TR too)', () => {
    vi.setSystemTime(new Date('2026-09-25T16:00:00Z'));
    renderWithIntl(<LiveStatus variant="office" hours={antalya} fallback="fb" fragments={fragments} />, { locale: 'en' });
    expect(screen.getByTestId('live-status')).toHaveTextContent('Closed · opens Monday 09:00');
  });

  it('office variant in Turkish uses the Turkish weekday and suffix', () => {
    vi.setSystemTime(new Date('2026-09-25T16:00:00Z'));
    renderWithIntl(<LiveStatus variant="office" hours={antalya} fallback="fb" fragments={fragments} />, { locale: 'tr' });
    expect(screen.getByTestId('live-status')).toHaveTextContent('Kapalı · Pazartesi 09:00’da açılıyor');
  });

  it('lines variant: the package fragment only — the hours suffix is the page’s (contact.135)', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z'));
    renderWithIntl(<LiveStatus variant="lines" hours={antalya} fallback="fb" fragments={fragments} />, { locale: 'en' });
    expect(screen.getByTestId('live-status')).toHaveTextContent('Lines open now');
  });
});
```

`src/app/[locale]/(site)/contact/__tests__/ContactEnquiry.test.tsx`:

```tsx
import { fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { ContactEnquiry, type ContactEnquiryCopy, type TopicCopy } from '../_components/ContactEnquiry';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));

const formCopy = {
  formSub: 'sub',
  orgPlaceholder: 'Registered company name',
  subjectPlaceholder: 'e.g.',
};
const topics: TopicCopy[] = [
  { key: 'hire', label: 'I need workers', sub: 'Roles, headcount and a quote', title: 'Tell us the roles', desk: 'employer desk', orgLabel: 'Company name', subjectLabel: 'Roles and headcount', extraLabel: 'City in Türkiye', extraPlaceholder: 'Antalya', submit: 'Send my hiring request', ...formCopy },
  { key: 'permit', label: 'Work permit only', sub: 'You already have the worker', title: 'Permit file, no sourcing', desk: 'permit team', orgLabel: 'Company name', subjectLabel: 'Worker and role', extraLabel: 'Workplace city', extraPlaceholder: 'İstanbul', submit: 'Ask the permit team', ...formCopy },
  { key: 'partner', label: 'Agency or agent', sub: 'Supply or partner with us', title: 'Supply or partner with us', desk: 'partnerships desk', orgLabel: 'Agency name & country', subjectLabel: 'What you supply', extraLabel: 'Licence no.', extraPlaceholder: 'If you have one', submit: 'Send partnership enquiry', ...formCopy },
  { key: 'job', label: 'I am looking for a job', sub: 'Candidates start here' },
];
const copy: ContactEnquiryCopy = {
  legend: 'What is this about?',
  deskPrefix: 'Goes to the',
  nameLabel: 'Your name',
  namePlaceholder: 'Who we should ask for',
  emailLabel: 'Email',
  phoneLabel: 'Phone / WhatsApp',
  notesLabel: 'Anything else',
  notesOptional: '(optional)',
  notesPlaceholder: 'Start date…',
  replyLegend: 'Reply me on',
  reply: { whatsapp: 'WhatsApp', email: 'Email', call: 'A call' },
  moreOpen: '+ Add extra details (optional)',
  moreClose: 'Hide extra details',
};

const renderEnquiry = () =>
  renderWithIntl(
    <ContactEnquiry
      action={idle}
      locale="en"
      turnstileSiteKey={null}
      whatsappNumber="905011240340"
      whatsappIntro="Hello JobsAdmire"
      contact={{ phone: '+905011240340', email: 'info@jobsadmire.com' }}
      topics={topics}
      copy={copy}
      jobPanel={<p>B2B explainer</p>}
      footer={<a href="mailto:info@jobsadmire.com">Rather email? →</a>}
    />,
    { locale: 'en' },
  );

beforeEach(() => {
  window.dataLayer = [];
});

describe('ContactEnquiry', () => {
  it('hire by default: a `contact` form whose inputs carry the catalog names and the package labels (W114/W115)', () => {
    renderEnquiry();
    const form = screen.getByTestId('contact-enquiry-form');
    expect(form).toHaveAttribute('data-form-key', 'contact');
    expect(form.querySelector('input[name="topic"]')).toHaveValue('hire');
    expect(within(form).getByRole('textbox', { name: 'Company name' })).toHaveAttribute('name', 'company');
    expect(within(form).getByRole('textbox', { name: 'Roles and headcount' })).toHaveAttribute('name', 'subject');
    expect(within(form).getByRole('textbox', { name: 'City in Türkiye' })).toHaveAttribute('name', 'city');
    expect(within(form).getByRole('textbox', { name: 'Your name' })).toHaveAttribute('id', 'f-contact-name');
    expect(form.querySelector('input[name="licence"]')).toBeNull();
    // W79: a consent checkbox, linked to the site-wide privacy notice.
    expect(within(form).getByRole('checkbox')).toHaveAttribute('name', 'consent');
    expect(window.dataLayer).toEqual([]);
  });

  it('partner swaps city for the licence input and fires contact_topic with the key only (W12/W67)', () => {
    renderEnquiry();
    fireEvent.click(screen.getByRole('radio', { name: /Agency or agent/ }));
    const form = screen.getByTestId('contact-enquiry-form');
    expect(form.querySelector('input[name="topic"]')).toHaveValue('partner');
    expect(within(form).getByRole('textbox', { name: 'Licence no.' })).toHaveAttribute('name', 'licence');
    expect(form.querySelector('input[name="city"]')).toBeNull();
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer?.[0]).toMatchObject({ event: 'contact_topic', locale: 'en', topic: 'partner' });
    expect(Object.keys(window.dataLayer?.[0] ?? {}).sort()).toEqual(['event', 'locale', 'page', 'topic']);
  });

  it('job hides the form and shows the explainer — nothing can be filed (W3)', () => {
    renderEnquiry();
    fireEvent.click(screen.getByRole('radio', { name: /I am looking for a job/ }));
    expect(screen.queryByTestId('contact-enquiry-form')).toBeNull();
    expect(screen.getByTestId('contact-jobseeker')).toHaveTextContent('B2B explainer');
    expect(window.dataLayer?.[0]).toMatchObject({ event: 'contact_topic', topic: 'job' });
  });
});
```

`src/app/[locale]/(site)/contact/__tests__/CallbackWidget.test.tsx`:

```tsx
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { CallbackWidget, type CallbackWidgetCopy } from '../_components/CallbackWidget';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const copy: CallbackWidgetCopy = {
  title: 'Can’t talk right now?',
  sub: 'Pick a slot — we call you back on your number',
  dayLegend: 'Which day',
  slotLegend: 'Best time',
  submit: 'Request call',
  note: 'We call from +90 501 124 03 40.',
  phonePlaceholder: 'Your number, e.g. +90 5xx xxx xx xx',
  days: { today: 'Today', tomorrow: 'Tomorrow', this_week: 'This week' },
  slots: { '09-11': '09:00–11:00', '11-13': '11:00–13:00', '14-16': '14:00–16:00', '16-18': '16:00–18:00', any: 'any time' },
};
const renderWidget = () =>
  renderWithIntl(
    <CallbackWidget
      action={idle}
      locale="en"
      turnstileSiteKey={null}
      whatsappNumber="905011240340"
      whatsappIntro="Hello JobsAdmire, please call me back."
      contact={{ phone: '+905011240340', email: 'info@jobsadmire.com' }}
      copy={copy}
    />,
    { locale: 'en' },
  );

describe('CallbackWidget', () => {
  it('is closed like the design: a toggle, no form in the DOM', () => {
    renderWidget();
    expect(screen.getByRole('button', { name: /Can’t talk right now\?/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('contact-callback-form')).toBeNull();
  });

  it('opens to a `callback` form: day/slot chips posting keys, name + phone, a consent checkbox (W3/W79)', () => {
    renderWidget();
    fireEvent.click(screen.getByRole('button', { name: /Can’t talk right now\?/ }));
    const form = screen.getByTestId('contact-callback-form');
    expect(form).toHaveAttribute('data-form-key', 'callback');
    const days = form.querySelectorAll<HTMLInputElement>('input[name="day"]');
    expect([...days].map((d) => d.value)).toEqual(['today', 'tomorrow', 'this_week']);
    expect(form.querySelector<HTMLInputElement>('input[name="day"][value="today"]')?.checked).toBe(true);
    expect([...form.querySelectorAll<HTMLInputElement>('input[name="slot"]')].map((s) => s.value)).toEqual(['09-11', '11-13', '14-16', '16-18', 'any']);
    expect(form.querySelector('#f-callback-name')).toHaveAttribute('name', 'name');
    expect(form.querySelector('#f-callback-phone')).toHaveAttribute('type', 'tel');
    expect(within(form).getByRole('checkbox')).toHaveAttribute('id', 'f-callback-consent');
    expect(within(form).getByRole('button', { name: 'Request call' })).toHaveAttribute('type', 'submit');
  });
});
```

`src/app/[locale]/(site)/contact/__tests__/VisitBooking.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { VisitBooking, type VisitBookingCopy } from '../_components/VisitBooking';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const copy: VisitBookingCopy = {
  eyebrow: 'Book a visit',
  title: 'Prefer to sit down with us?',
  body: 'Pick a day and a time.',
  dayLegend: 'Day',
  timeLegend: 'Time',
  toggleOpen: 'Pick a day & time',
  toggleClose: 'Hide the slots',
  submit: 'Randevu talep et',
};

describe('VisitBooking', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }));
  afterEach(() => vi.useRealTimers());

  it('offers the next five Antalya open days as ISO-valued chips, the five slots, the W3 trio and a consent checkbox', () => {
    vi.setSystemTime(new Date('2026-09-25T20:00:00Z')); // Friday 23:00 Istanbul
    renderWithIntl(
      <VisitBooking
        action={idle}
        locale="tr"
        turnstileSiteKey={null}
        whatsappNumber="905011240340"
        whatsappIntro="Merhaba JobsAdmire"
        contact={{ phone: '+905011240340', email: 'info@jobsadmire.com' }}
        hours={antalya}
        copy={copy}
      />,
      { locale: 'tr' },
    );
    const form = screen.getByTestId('contact-visit-form');
    expect(form).toHaveAttribute('data-form-key', 'visit');
    const days = [...form.querySelectorAll<HTMLInputElement>('input[name="preferredDate"]')];
    expect(days.map((d) => d.value)).toEqual(['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']);
    expect(within(form).getByText('28 Eyl Pzt')).toBeInTheDocument();
    expect([...form.querySelectorAll<HTMLInputElement>('input[name="preferredTime"]')].map((s) => s.value)).toEqual(['09:30', '11:00', '13:30', '15:00', '16:30']);
    for (const name of ['name', 'email', 'phone']) expect(form.querySelector(`#f-visit-${name}`)).toHaveAttribute('name', name);
    expect(within(form).getByRole('checkbox')).toHaveAttribute('id', 'f-visit-consent');
    expect(within(form).getByRole('button', { name: 'Randevu talep et' })).toHaveAttribute('type', 'submit');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

`npx vitest run "src/app/\[locale\]/(site)/contact/__tests__/LiveStatus.test.tsx" "src/app/\[locale\]/(site)/contact/__tests__/ContactEnquiry.test.tsx" "src/app/\[locale\]/(site)/contact/__tests__/CallbackWidget.test.tsx" "src/app/\[locale\]/(site)/contact/__tests__/VisitBooking.test.tsx" --maxWorkers=2` → all four fail at import: `Failed to resolve import "../_components/LiveStatus"` (and `ContactEnquiry`, `CallbackWidget`, `VisitBooking`).
