### Task 7: Contact (`/iletisim`, `/en/contact`) — live-status islands, topic picker → `contact`, callback → `callback`, book-a-visit → `visit`, server QR, FAQ, ContactPage JSON-LD, office cards

**Why this shape.** The design (`design-package/design/Contact Us.dc.html`, strings `contact.001–228`) is a WhatsApp-only mock: every form opens `wa.me`, the live clocks are computed in a 60 s `setInterval`, the QR is fetched from `api.qrserver.com`, the JSON-LD is injected after mount, and the callback/visit widgets collect no name, e-mail or consent. Rulings that bind this port: **W3** (the door wins — Contact → `contact` with `topic` + `iAm`; callback gains `name`; book-a-visit gains name/e-mail/phone; option VALUES are stable keys), **W16/Task 8** (catalog v1.1: `topic` enum and `city` on `contact`), **W9/W23** (id-less copy → `sys.contact.*`, never a minted package id; a page composes fragments only where the package itself splits them — `contact.152/153`, `contact.218/219`, `contact.025/026`), **W12/W67** (`contact_topic` with `topic ∈ hire|partner|permit|job|other`; `call_click`/`whatsapp_click`/`email_click` with `page_cta`/`office_card` placements), **W14** (local QR through `qrSvg`, no runtime fetch), **W1/D17** (numbers through `makeTf`/`metricValues`, the reply SLA through the `replySlaHours` metric), **W13 amended** (204,800 B script ceiling), **W17** (the header CTA for `/contact` is `contact.015/016 → #message`, so this page MUST render `id="message"`), **W20/W21** (delete `/contact` from `UNBUILT_PATHNAMES`, append both locale paths to `e2e/routes.ts`), **D13** (success = redirect to `/tesekkurler?form=<key>`, never the design's inline "WhatsApp is open" panel), **D26/W55** (h1 is the LCP element; the `contact-hero` photo slot ships as a named gradient placeholder), **D20** (accessibility over pixel fidelity: the mobile-only CSS `::after "Open WhatsApp →"` and `✓` badges become real markup; the ≤700 px offices tabs become a stacked column; the hero paragraph's desktop/mobile variants stay two spans toggled by CSS — W10).

Design deltas this task accepts and records in the ledger: (1) three door-backed forms replace the WhatsApp mocks (W3/D13); the design's `contact.073` ("Sends through WhatsApp…") and `contact.086–088` (sent panel) are therefore not rendered; (2) the kernel's consent row (`sys.form.consent.label`, link to `/kvkk`) replaces the design's inline KVKK checkbox text `contact.072` — the legal sentence stays in the catalogue, verbatim, for the WP-C legal review; (3) the "Book on WhatsApp" label `contact.118` is replaced by `sys.contact.visit.submit` because the request no longer goes to WhatsApp; the design's WhatsApp deep links survive as the fallback panels' prefills (`sys.contact.wa.*`); (4) the job-seeker topic files nothing (design + W3) — it renders the B2B explainer with a WhatsApp deep link; (5) the "Agencies & agents" phone card renders only when `settings.partnershipsPhone` is non-null (hidden by data, W4-style, never deleted).

**Files:**

Create:
- `src/app/[locale]/(site)/contact/page.tsx` — the page (server component)
- `src/app/[locale]/(site)/contact/actions.ts` — `'use server'`: `submitContact`, `submitCallback`, `submitVisit`
- `src/app/[locale]/(site)/contact/forms.ts` — pure: Zod schemas, `toFields` mappers, option-key constants (unit-tested; imported by `actions.ts` and the islands)
- `src/app/[locale]/(site)/contact/jsonld.ts` — page-local `contactPageJsonLd`
- `src/app/[locale]/(site)/contact/_components/office-status.ts` — pure: `officeStatus`, `localParts`, `weekdayName`, `nextOpenDates`, `formatVisitDay`
- `src/app/[locale]/(site)/contact/_components/phone.ts` — pure: `formatPhoneDisplay`
- `src/app/[locale]/(site)/contact/_components/useMinuteTick.ts` — the R18 `useSyncExternalStore` minute clock (null on the server)
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
- `e2e/pages/contact.spec.ts`

Modify:
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.contact.*` under the existing `seo` object (T0c added `sys.seo.ogTagline`), new `sys.contact.*` block
- `src/lib/seo/routes.ts` — delete `'/contact'` from `UNBUILT_PATHNAMES` (the set literal T0c wrote; find the line with `grep -n "'/contact'" src/lib/seo/routes.ts`)
- `e2e/routes.ts` — append two rows to `GATE_ROUTE_TABLE` (after the `/en/hire-workers` row, before the conversion-page row — see Cycle 4)
- `docs/SEO.md` — page row (§ Pages table; create the table if this is the first page task to land)
- `docs/ANALYTICS.md` — `contact_topic` row "Fires on" + the placement note
- `docs/CONTENT-MODEL.md` — `sys.contact.*` / `sys.seo.contact.*` line under § The `sys.*` range
- `docs/PRD.md` line 28 — the Contact row's forms column (door mapping)

Test:
- Vitest: the six `__tests__` files above (`npx vitest run "src/app/\[locale\]/(site)/contact"`), plus the existing `src/lib/seo/unbuilt.test.ts` (goes red when the page exists and the key is still in the set) and `src/messages/messages.test.ts` (identical key sets)
- Playwright: `e2e/pages/contact.spec.ts` (both projects) + the page-contract loop in `e2e/routing.spec.ts` and `e2e/seo.spec.ts` picking up the two new indexable routes
- `npm run verify`; `npm run gate` against the preview; `npm run js-size`

**Interfaces:**

Consumes (exact names — WP2a `produces-final.md` unless marked WP1):
- WP1: `getBundle` (`@/content/adapter`, re-exports `pure.ts`), `routing`/`Locale` (`@/i18n/routing`), `buildMetadata` (`@/lib/seo/metadata`), `absoluteUrl` (`@/lib/seo/routes`), `JsonLd` (`@/lib/seo/JsonLdScript`), `waLink`/`telLink`/`mailLink` (`@/lib/contact`), `FormKey` (`@/analytics/forms`), `Button`/`Eyebrow`/`Section` (`@/design/primitives`), `Bundle`/`Settings` types (`contract/website-bundle.v1`).
- Task 1: `makeTf(bundle, locale)`, `metricValues(bundle, locale)` (via `@/content/adapter`), `getOffice(bundle, 'antalya' | 'karachi')`, `Office` type (`@/content/collections`), `PAGE_KEYS` entry `'contact'`.
- Task 2: `createFormAction`, `FormActionState` (`@/forms/action`); `WireFields` (`@/forms/wire`); `FormShell` (`@/forms/client/FormShell`); `Field`, `INPUT_CLASS` (`@/forms/client/Field`); `sys.form.labels.{name,email,phone,company,preferredDate}`, `sys.form.placeholders.{email,phone,preferredDate}`, `sys.form.consent.*`, `sys.form.fallback.*`; `FallbackPanel`'s `data-testid="form-fallback"`.
- Task 3: `track`, `PARAM_ENUMS` (`@/analytics/track`); `ContactLink` (`@/analytics/ContactLink`); `CTA_BY_PATHNAME['/contact']` → `#message` (this page renders `id="message"`); `(site)` route group.
- Task 4: `UNBUILT_PATHNAMES` (`@/lib/seo/routes`); `buildMetadata`'s `''`→fallback rule; `pageOgImageUrl` (implicit via `buildMetadata`).
- Task 5: `Section` tone `'pale'`; `RadioChips` (`@/design/primitives`); blocks `Breadcrumbs`, `ContactCta`, `FaqBlock`, `ImageSlot`, `OfficeCard`, `ProcessSteps` (`@/design/blocks`); `buttonClassName` (`@/design/primitives`).
- Task 6: `QrCode` (`@/design/QrCode`, server-only).
- Task 7: `GATE_ROUTE_TABLE` (`e2e/routes.ts`); page markup contract (`page-h1`, `data-lcp-slot`, `data-placeholder`); `npm run js-size`.
- Task 8 (Ops catalog v1.1): `contact.topic ∈ hire|partner|permit|job|other`, `contact.city ≤120`, and the v1.0 fields of `contact`/`callback`/`visit`.

Produces (for T14 forms E2E and T15 Gate A): the three form instances on `/contact` with `data-testid` `contact-enquiry-form` (`contact`), `contact-callback-form` (`callback`), `contact-visit-form` (`visit`); their wire field sets (Cycle 1 § Wire fields); section test ids `contact-hero`, `contact-message`, `contact-offices`, `contact-faq`, `contact-jobseeker`, `contact-qr`; the `#message` anchor W17's CTA table names.

---

#### Cycle 1 — pure pieces + sys copy: `forms.ts` (schemas → catalog fields), `office-status.ts`, `phone.ts`, `jsonld.ts`, `sys.contact.*` / `sys.seo.contact.*`

**Wire fields (the contract with the door — every name below exists in the catalog, `operations-door-contract-as-built.md` + Task 8):**

| Form key | Field sent | Source | Catalog rule |
| --- | --- | --- | --- |
| `contact` | `name` | "Your name" (`contact.066`) | ≤120 required |
| | `email` | e-mail | required |
| | `phone` | phone / WhatsApp (`contact.068`) | ≥8 digits, ≤40 |
| | `company` | company / agency name (`contact.164`/`contact.179`) | ≤200 |
| | `topic` | picker key `hire` / `permit` / `partner` | v1.1 enum, exact lower-case |
| | `iAm` | `IAM_BY_TOPIC[topic]` — `direct_employer` (hire, permit: the permit-only client is the employer of record) / `sourcing_partner` (partner) | enum |
| | `subject` | the required per-topic detail line (`contact.166`/`173`/`181`) | ≤200 |
| | `message` | detail + optional `licence:` line (partner) + `reply:` channel key + blank line + notes | ≤5000 required |
| | `city` | the optional third field for hire ("City in Turkey", `contact.168`) / permit ("Workplace city", `contact.175`) — the partner topic's "Licence no." goes into `message` instead | v1.1 ≤120 |
| `callback` | `name`, `phone` | new required name (W3) + the design's tel input | required |
| | `preferredTime` | `"<day> <slot>"` from stable keys: day ∈ `today` `tomorrow` `this_week`, slot ∈ `09-11` `11-13` `14-16` `16-18` `any` | ≤120 |
| `visit` | `name`, `email`, `phone` | new required trio (W3) | required |
| | `office` | `'antalya'` constant | ≤120 |
| | `preferredDate` | ISO `YYYY-MM-DD` from the day chips (or the visitor's typed text in the no-JS fallback) | ≤40 |
| | `preferredTime` | `09:30` `11:00` `13:30` `15:00` `16:30` | ≤40 |

Not sent (no catalog field, by design): the reply-channel chip (folded into `message`), the partner licence number (folded into `message`), `country` (the contact catalog has it but the design collects none — never guessed), `callback.topic`/`callback.email`, `visit.company`/`visit.message`.

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/contact/__tests__/forms.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  CALLBACK_DAYS,
  CALLBACK_SLOTS,
  CONTACT_TOPICS,
  IAM_BY_TOPIC,
  PICKER_TOPICS,
  VISIT_SLOTS,
  callbackSchema,
  composeContactMessage,
  contactSchema,
  toCallbackFields,
  toContactFields,
  toVisitFields,
  visitSchema,
} from '../forms';

const base = {
  topic: 'hire' as const,
  company: 'Akdeniz Otel A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@akdenizotel.com',
  phone: '+90 532 000 00 00',
  detail: '10 welders, 4 CNC operators',
};

describe('contact — schema', () => {
  it('accepts the designed minimum (topic, company, name, email, phone, detail)', () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });
  it('an empty e-mail is "required" before it is "not an e-mail" (W3: .min(1) precedes .email())', () => {
    const r = contactSchema.safeParse({ ...base, email: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['email'], code: 'too_small' });
  });
  it('refuses a phone with fewer than 8 digits with the phone code', () => {
    const r = contactSchema.safeParse({ ...base, phone: '+90 53' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['phone'], message: 'phone' });
  });
  it('never files the job-seeker topic (design + W3): it is a picker key, not a schema value', () => {
    expect(PICKER_TOPICS).toEqual(['hire', 'permit', 'partner', 'job']);
    expect(CONTACT_TOPICS).toEqual(['hire', 'permit', 'partner']);
    expect(contactSchema.safeParse({ ...base, topic: 'job' }).success).toBe(false);
  });
  it('option values are stable keys, never labels (W3)', () => {
    expect(CALLBACK_DAYS).toEqual(['today', 'tomorrow', 'this_week']);
    expect(CALLBACK_SLOTS).toEqual(['09-11', '11-13', '14-16', '16-18', 'any']);
    expect(VISIT_SLOTS).toEqual(['09:30', '11:00', '13:30', '15:00', '16:30']);
  });
});

describe('contact — toContactFields (catalog names exactly)', () => {
  it('hire: topic + iAm + subject/message + city', () => {
    const p = contactSchema.parse({ ...base, place: 'Antalya', reply: 'whatsapp', message: 'Start in March.' });
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
  it('permit: the employer of record is a direct employer; workplace city rides as city', () => {
    const p = contactSchema.parse({ ...base, topic: 'permit', detail: '1 Uzbek chef, already in Turkey', place: 'İstanbul' });
    const f = toContactFields(p);
    expect(f.iAm).toBe('direct_employer');
    expect(f.city).toBe('İstanbul');
    expect(f.message).toBe('1 Uzbek chef, already in Turkey');
  });
  it('partner: sourcing_partner; the licence number is a message line, never `city`', () => {
    const p = contactSchema.parse({ ...base, topic: 'partner', company: 'Skyline Manpower, Nepal', detail: 'welders and masons, 200 on file', place: 'NP-1234' });
    const f = toContactFields(p);
    expect(f.iAm).toBe('sourcing_partner');
    expect(f).not.toHaveProperty('city');
    expect(f.message).toBe('welders and masons, 200 on file\nlicence: NP-1234');
    expect(IAM_BY_TOPIC).toEqual({ hire: 'direct_employer', permit: 'direct_employer', partner: 'sourcing_partner' });
  });
  it('an empty optional never becomes a field (buildEnvelope drops empties, but we do not rely on it)', () => {
    const p = contactSchema.parse({ ...base, place: '', message: '' });
    const f = toContactFields(p);
    expect(f).not.toHaveProperty('city');
    expect(f.message).toBe(base.detail);
  });
  it('composeContactMessage stays under the 5000-char cap at the schema maxima', () => {
    const p = contactSchema.parse({ ...base, topic: 'partner', detail: 'd'.repeat(200), place: 'l'.repeat(120), reply: 'call', message: 'm'.repeat(4000) });
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
});

describe('visit', () => {
  it('requires name/email/phone (W3) and pins office=antalya', () => {
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '+90 532 000 00 00' }).success).toBe(true);
    expect(visitSchema.safeParse({ name: 'A', phone: '+90 532 000 00 00' }).success).toBe(false);
    const p = visitSchema.parse({ name: 'A', email: 'a@b.co', phone: '+90 532 000 00 00', preferredDate: '2026-09-28', preferredTime: '11:00' });
    expect(toVisitFields(p)).toEqual({ name: 'A', email: 'a@b.co', phone: '+90 532 000 00 00', office: 'antalya', preferredDate: '2026-09-28', preferredTime: '11:00' });
  });
  it('refuses a time outside the five slots and accepts the no-JS typed date (≤40 chars)', () => {
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '05320000000', preferredTime: '12:00' }).success).toBe(false);
    expect(visitSchema.safeParse({ name: 'A', email: 'a@b.co', phone: '05320000000', preferredDate: 'Wed 23 Sep' }).success).toBe(true);
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
  it('Saturday noon in Antalya is a closed day; the same instant is an open Saturday in Karachi (Mon–Sat)', () => {
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
    const from = new Date('2026-09-23T07:32:00Z'); // Wed morning
    expect(nextOpenDates(from, antalya, 3)).toEqual(['2026-09-24', '2026-09-25', '2026-09-28']);
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
    const node = contactPageJsonLd({ name: 'İletişim', url: 'https://www.jobsadmire.com/iletisim', locale: 'tr' });
    expect(Object.values(node).some((v) => v === undefined)).toBe(false);
  });
});
```

`src/app/[locale]/(site)/contact/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every sys key this page reads (W9/W23). `src/messages/messages.test.ts` already proves the two
 *  files share one key set; this pins the page's own set so a renamed key fails here, not in dev. */
export const CONTACT_SYS_KEYS = [
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
  'contact.form.reply.whatsapp',
  'contact.wa.main',
  'contact.wa.jobseeker',
  'contact.wa.partner',
  'contact.wa.visitSite',
  'contact.wa.visit',
  'contact.wa.callback',
  'contact.faq.a3',
  'contact.faq.a5',
] as const;

const get = (obj: unknown, path: string) =>
  path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);

describe('sys.contact.* / sys.seo.contact.*', () => {
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
  it('the ICU arguments the islands pass are the ones the strings declare', () => {
    expect(get(en.sys, 'contact.status.openNow')).toMatch(/\{time\}/);
    expect(get(en.sys, 'contact.status.openNow')).toMatch(/\{close\}/);
    expect(get(en.sys, 'contact.status.closedOpensAt')).toMatch(/\{open\}/);
    expect(get(en.sys, 'contact.status.closedOpensOn')).toMatch(/\{day\}/);
    expect(get(en.sys, 'contact.faq.a3')).toMatch(/\{replyHours\}/);
    expect(get(en.sys, 'contact.faq.a3')).toMatch(/\{hours\}/);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

`npx vitest run "src/app/\[locale\]/(site)/contact"` → five files fail at import (`Cannot find module '../forms'`, `'../_components/office-status'`, `'../_components/phone'`, `'../jsonld'`), and `sys-keys.test.ts` fails 31 cases (`expected 'undefined' to be 'string'`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/contact/forms.ts`:

```ts
// Pure form specs for the Contact page's three door-backed forms (W3): Zod schemas, the
// stable option keys the islands render, and the `toFields` mappers onto the door's catalog
// names (docs/INTEGRATIONS.md I4; Ops website-form-catalog.ts v1.1 — `topic`, `city`).
// No directive: `actions.ts` wraps these in `'use server'`, the tests import them directly.
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';

/** The three topics that file a `contact` inquiry. */
export const CONTACT_TOPICS = ['hire', 'permit', 'partner'] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];
/** The picker adds the job-seeker refusal (contact.064/065): an explainer + WhatsApp link,
 *  never a submission — the design refuses to file candidates and W3 keeps that. */
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

// `.min(1)` before `.email()` so an empty value reads `required`, not `email` (W3).
const email = z.string().min(1).max(254).email();
// The door wants ≥ 8 digits and keeps the number as typed; E.164 is the handler's job.
const phone = z.string().min(1).regex(/(\D*\d){8,}/, { message: 'phone' }).max(40);

export const contactSchema = z.object({
  topic: z.enum(CONTACT_TOPICS),
  company: z.string().min(1).max(200),
  name: z.string().min(1).max(120),
  email,
  phone,
  /** The required per-topic line (roles & headcount / worker & role / what you supply). */
  detail: z.string().min(1).max(200),
  /** City in Turkey (hire) · workplace city (permit) · licence no. (partner). */
  place: z.string().max(120).optional(),
  reply: z.enum(REPLY_CHANNELS).optional(),
  message: z.string().max(4000).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** detail, then the partner licence and the reply channel as `key: value` lines (internal,
 *  language-neutral — the Ops inbox is not visitor copy), then the free notes. ≤ 200 + 130 +
 *  16 + 4002 < 5000 (the catalog cap). */
export function composeContactMessage(p: ContactInput): string {
  const lines = [p.detail];
  if (p.topic === 'partner' && p.place) lines.push(`licence: ${p.place}`);
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
    subject: p.detail,
    message: composeContactMessage(p),
  };
  if (p.topic !== 'partner' && p.place) fields.city = p.place;
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
  /** ISO date from the day chips; free text (≤ 40) from the no-JS date input. */
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
 *  Organization/EmploymentAgency node in the layout already carries both offices' PostalAddress
 *  entries, the permit and the phone/e-mail — this node only identifies the page, so the
 *  addresses keep one source (`src/lib/seo/jsonld.ts`). */
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

`src/messages/en.json` — inside `"sys"`: add `"contact"` and `"description"`/`"title"` under the existing `"seo"` object (T0c created `"seo": { "ogTagline": … }`; keep `ogTagline`, add the `contact` object beside it). Typographic apostrophes (’) only — ICU treats `'` as an escape.

```json
"seo": {
  "ogTagline": "…(unchanged)…",
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
    "cityPlaceholder": { "hire": "Antalya", "permit": "İstanbul" },
    "reply": { "whatsapp": "WhatsApp" }
  },
  "wa": {
    "main": "Hello JobsAdmire, I have a question about hiring workers in Türkiye.",
    "jobseeker": "Hello JobsAdmire, I am a candidate. My country: ___ / My trade: ___. Please send me the contact of your verified sourcing partner in my country.",
    "partner": "Hello JobsAdmire, I represent an agency and want to supply candidates.",
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

`src/messages/tr.json` — the same keys:

```json
"seo": {
  "ogTagline": "…(unchanged)…",
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
    "cityPlaceholder": { "hire": "Antalya", "permit": "İstanbul" },
    "reply": { "whatsapp": "WhatsApp" }
  },
  "wa": {
    "main": "Merhaba JobsAdmire, Türkiye’de işçi istihdamı hakkında bir sorum var.",
    "jobseeker": "Merhaba JobsAdmire, adayım. Ülkem: ___ / Mesleğim: ___. Lütfen ülkemdeki doğrulanmış tedarik ortağınızın iletişim bilgisini gönderin.",
    "partner": "Merhaba JobsAdmire, bir ajansı temsil ediyorum ve aday tedarik etmek istiyorum.",
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

The `"{open}’da"` Turkish suffix is the locative for a clock time ("09:00’da"), correct for every `HH:MM` the collection can carry.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/\[locale\]/(site)/contact" src/messages` → 6 files green (the `LiveStatus.test.tsx` file does not exist yet; 5 + `messages.test.ts`). `npm run verify` → green (Prettier: run `npx prettier --write src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/contact"` first).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/contact/forms.ts" "src/app/[locale]/(site)/contact/jsonld.ts" "src/app/[locale]/(site)/contact/_components/office-status.ts" "src/app/[locale]/(site)/contact/_components/phone.ts" "src/app/[locale]/(site)/contact/__tests__" src/messages/tr.json src/messages/en.json
git commit -m "feat(contact): form specs onto the door catalog (topic/iAm/subject, callback, visit), office-hours arithmetic, ContactPage node, sys.contact copy

W3: the three Contact forms file through the door with stable option keys; the job-seeker
topic never files. Task 8's catalog v1.1 (topic, city) is the wire contract.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — client islands: `useMinuteTick`, `LiveStatus`, `ContactEnquiry`, `CallbackWidget`, `VisitBooking`

Hydration rule (R18, the pattern Task 4's `use-alternate-path.ts` uses): the server and the hydrating render show the neutral fallback (the package's own hours string, `contact.100`/`contact.106`); the client snapshot arrives through `useSyncExternalStore`, never through `setState` in an effect (`react-hooks/set-state-in-effect` is enforced by `eslint-config-next` 16). One module-level minute clock serves every pill on the page.

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/contact/__tests__/LiveStatus.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import en from '@/messages/en.json';
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

const ui = (node: React.ReactNode) => (
  <NextIntlClientProvider locale="en" messages={en}>
    {node}
  </NextIntlClientProvider>
);

describe('LiveStatus', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('office variant, open: the sys openNow line with the local clock and closing time', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z')); // Wed 10:32 Istanbul
    render(ui(<LiveStatus variant="office" hours={antalya} fallback="Mon–Fri · 09:00–18:00 (TRT)" fragments={fragments} />));
    expect(screen.getByTestId('live-status')).toHaveTextContent('Open now · 10:32 local · closes 18:00');
    expect(screen.getByTestId('live-status')).toHaveAttribute('data-open', 'true');
  });

  it('hero variant composes the package fragments the package itself splits (contact.152/153)', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z'));
    render(ui(<LiveStatus variant="hero" hours={antalya} fallback="fb" fragments={fragments} />));
    expect(screen.getByTestId('live-status')).toHaveTextContent('Office open now · 10:32 in Antalya');
  });

  it('hero variant on a weekend shows the weekend fragment, whatsapp variant the off-hours line', () => {
    vi.setSystemTime(new Date('2026-09-26T09:00:00Z')); // Sat
    render(ui(<><LiveStatus variant="hero" hours={antalya} fallback="fb" fragments={fragments} /><LiveStatus variant="whatsapp" hours={antalya} fallback="fb" fragments={fragments} /></>));
    const pills = screen.getAllByTestId('live-status');
    expect(pills[0]).toHaveTextContent('Weekend · WhatsApp is still watched');
    expect(pills[1]).toHaveTextContent('Off hours — expect a reply next business morning');
    expect(pills[1]).toHaveAttribute('data-open', 'false');
  });

  it('office variant, Friday night: opens Monday by localized weekday name', () => {
    vi.setSystemTime(new Date('2026-09-25T16:00:00Z'));
    render(ui(<LiveStatus variant="office" hours={antalya} fallback="fb" fragments={fragments} />));
    expect(screen.getByTestId('live-status')).toHaveTextContent('Closed · opens Monday 09:00');
  });

  it('lines variant: package fragment only, the hours suffix is the page’s (contact.135)', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z'));
    render(ui(<LiveStatus variant="lines" hours={antalya} fallback="fb" fragments={fragments} />));
    expect(screen.getByTestId('live-status')).toHaveTextContent('Lines open now');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/contact/__tests__/LiveStatus.test.tsx"` → fails at import: `Cannot find module '../_components/LiveStatus'`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/contact/_components/useMinuteTick.ts`:

```ts
// The one clock every live pill on the page shares (R18). `useSyncExternalStore` gives the
// server — and the hydrating client render — `null`, so the markup matches; the first client
// render after hydration gets the minute index and the pills switch from the package's hours
// string to the computed label. One interval per page, started by the first subscriber.
import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
let current = 0;
let timer: ReturnType<typeof setInterval> | null = null;

const minute = () => Math.floor(Date.now() / 60_000);

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    current = minute();
    timer = setInterval(() => {
      const next = minute();
      if (next !== current) {
        current = next;
        listeners.forEach((l) => l());
      }
    }, 60_000);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => current || minute();
const getServerSnapshot = (): number | null => null;

/** Minute index (`Date.now() / 60000`) on the client, `null` on the server and during hydration. */
export function useMinuteTick(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

`src/app/[locale]/(site)/contact/_components/LiveStatus.tsx`:

```tsx
'use client';
import { useLocale, useTranslations } from 'next-intl';
import { officeStatus, weekdayName, type OfficeHours } from './office-status';
import { useMinuteTick } from './useMinuteTick';

export type LiveStatusFragments = {
  /** contact.152 "Office open now ·" */ openNow: string;
  /** contact.153 "in Antalya" */ inCity: string;
  /** contact.154 */ weekend: string;
  /** contact.155 */ closedToday: string;
  /** contact.215 */ linesOpen: string;
  /** contact.216 */ linesClosed: string;
};

export type LiveStatusProps = {
  variant: 'hero' | 'whatsapp' | 'lines' | 'office';
  hours: OfficeHours;
  /** Server/hydration text: the package's own hours string (contact.100 / contact.106, W34). */
  fallback: string;
  fragments: LiveStatusFragments;
  className?: string;
};

const PILL =
  'inline-flex items-center gap-2 rounded-pill border border-border-2 bg-pale-1 px-3 py-1.5 text-body-sm font-extrabold text-text-secondary';

/** One live pill. The colour dot is decorative (aria-hidden); the text carries the state (D20). */
export function LiveStatus({ variant, hours, fallback, fragments, className }: LiveStatusProps) {
  const sys = useTranslations('sys');
  const locale = useLocale();
  const tick = useMinuteTick();
  const status = tick === null ? null : officeStatus(new Date(tick * 60_000), hours);

  let text = fallback;
  if (status) {
    if (variant === 'hero') {
      if (status.open) text = `${fragments.openNow} ${status.clock} ${fragments.inCity}`;
      else if (status.reason === 'closedDay') text = fragments.weekend;
      else if (status.reason === 'beforeOpen')
        text = `${sys('contact.status.opens', { open: hours.open })} · ${status.clock} ${fragments.inCity}`;
      else text = `${fragments.closedToday} · ${status.clock} ${fragments.inCity}`;
    } else if (variant === 'whatsapp') {
      text = status.open ? sys('contact.status.waWatched') : sys('contact.status.waOff');
    } else if (variant === 'lines') {
      text = status.open ? fragments.linesOpen : fragments.linesClosed;
    } else if (status.open) {
      text = sys('contact.status.openNow', { time: status.clock, close: hours.close });
    } else if (status.reason === 'beforeOpen') {
      text = sys('contact.status.closedOpensAt', { open: hours.open, time: status.clock });
    } else if (status.opensTomorrow) {
      text = sys('contact.status.closedOpensTomorrow', { open: hours.open });
    } else {
      text = sys('contact.status.closedOpensOn', { day: weekdayName(status.nextOpenDay, locale), open: hours.open });
    }
  }
  const open = status?.open ?? null;
  return (
    <span
      data-testid="live-status"
      data-variant={variant}
      data-open={open === null ? undefined : String(open)}
      className={[PILL, className].filter(Boolean).join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'inline-block h-2 w-2 rounded-full',
          open === null ? 'bg-muted' : open ? 'bg-success' : 'bg-warning',
        ].join(' ')}
      />
      {text}
    </span>
  );
}
```

`src/app/[locale]/(site)/contact/_components/ContactEnquiry.tsx`:

```tsx
'use client';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useId, useState, type ReactNode } from 'react';
import type { FormActionState } from '@/forms/action';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import { RadioChips } from '@/design/primitives';
import { track } from '@/analytics/track';
import type { Locale } from '@/i18n/routing';
import { PICKER_TOPICS, type PickerTopic } from '../forms';

/** Copy for one topic, resolved by the page through makeTf (package ids in the page file). */
export type TopicCopy = {
  key: PickerTopic;
  label: string;
  sub: string;
  /** The rest is absent for `job` (no form). */
  title?: string;
  formSub?: string;
  desk?: string;
  orgLabel?: string;
  orgPlaceholder?: string;
  detailLabel?: string;
  detailPlaceholder?: string;
  placeLabel?: string;
  placePlaceholder?: string;
  submit?: string;
};

export type ContactEnquiryCopy = {
  legend: string; // contact.057
  deskPrefix: string; // contact.218
  nameLabel: string; // contact.066
  namePlaceholder: string; // contact.090
  emailLabel: string; // contact.067
  phoneLabel: string; // contact.068
  notesLabel: string; // contact.069
  notesOptional: string; // contact.070
  notesPlaceholder: string; // contact.091
  replyLegend: string; // contact.071
  replyEmail: string; // contact.067
  replyCall: string; // contact.186
  moreOpen: string; // contact.211
  moreClose: string; // contact.210
};

export type ContactEnquiryProps = {
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
  locale: Locale;
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  whatsappIntro: string;
  contact: { phone: string; phoneDisplay?: string; email: string };
  topics: TopicCopy[];
  copy: ContactEnquiryCopy;
  /** The B2B refusal (contact.075–085), server-rendered by the page. */
  jobPanel: ReactNode;
  /** The "Rather email? →" link (contact.074), server-rendered ContactCta. */
  footer: ReactNode;
};

const CARD =
  'flex cursor-pointer items-center gap-3 rounded-md border-2 border-border-3 bg-white p-3 text-left transition-colors has-[:checked]:border-blue-safe has-[:checked]:bg-pale-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-safe';

export function ContactEnquiry({
  action,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  whatsappIntro,
  contact,
  topics,
  copy,
  jobPanel,
  footer,
}: ContactEnquiryProps) {
  const sys = useTranslations('sys');
  const pathname = usePathname() ?? '/';
  const currentLocale = useLocale();
  const legendId = useId();
  const [topic, setTopic] = useState<PickerTopic>('hire');
  const [reply, setReply] = useState<string | null>('whatsapp');
  const [more, setMore] = useState(false);
  const active = topics.find((t) => t.key === topic) ?? topics[0];

  const pick = (key: PickerTopic) => {
    setTopic(key);
    // W12/W67: enum key only, never the label or any field value.
    track('contact_topic', { page: pathname, locale: currentLocale, topic: key });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border-1 bg-white shadow-[0_24px_60px_rgba(22,60,90,0.12)]">
      <fieldset className="m-0 border-0 p-6 pb-0">
        <legend id={legendId} className="text-eyebrow mb-3 font-extrabold uppercase tracking-[0.6px] text-text-tertiary">
          {copy.legend}
        </legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {PICKER_TOPICS.map((key) => {
            const t = topics.find((x) => x.key === key);
            if (!t) return null;
            return (
              <label key={key} className={CARD}>
                <input
                  type="radio"
                  name="topicPick"
                  value={key}
                  checked={topic === key}
                  onChange={() => pick(key)}
                  className="sr-only"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-body-sm font-extrabold text-ink">{t.label}</span>
                  <span className="text-body-sm text-text-tertiary">{t.sub}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mx-6 mt-5 h-px bg-border-3" />

      {topic === 'job' ? (
        <div data-testid="contact-jobseeker" className="p-6">
          {jobPanel}
        </div>
      ) : (
        <FormShell
          action={action}
          formKey="contact"
          locale={locale}
          turnstileSiteKey={turnstileSiteKey}
          whatsappNumber={whatsappNumber}
          whatsappIntro={whatsappIntro}
          contact={contact}
          submitLabel={active.submit}
          consent="checkbox"
          consentLinkHref="/kvkk"
          title={active.title}
          testId="contact-enquiry-form"
          className="p-6"
        >
          <input type="hidden" name="topic" value={topic} />
          <div className="-mt-2 flex flex-wrap items-start justify-between gap-3">
            <p className="text-body-sm m-0 text-text-tertiary">{active.formSub}</p>
            <span className="inline-flex items-center gap-2 rounded-pill border border-border-2 bg-pale-1 px-3 py-1 text-body-sm font-extrabold text-text-secondary">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-success" />
              {copy.deskPrefix} {active.desk}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field id="f-ct-company" name="company" label={active.orgLabel} placeholder={active.orgPlaceholder} required autoComplete="organization" />
            <Field id="f-ct-name" name="name" label={copy.nameLabel} placeholder={copy.namePlaceholder} required autoComplete="name" />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field id="f-ct-email" name="email" type="email" label={copy.emailLabel} required autoComplete="email" inputMode="email" />
            <Field id="f-ct-phone" name="phone" type="tel" label={copy.phoneLabel} required autoComplete="tel" inputMode="tel" />
          </div>
          <Field id="f-ct-detail" name="detail" label={active.detailLabel} placeholder={active.detailPlaceholder} required />
          {/* ≤ 700 px the optional fields collapse behind the design's "+ Add extra details" (contact.211/210). */}
          <button
            type="button"
            aria-expanded={more}
            aria-controls="contact-optional"
            onClick={() => setMore((v) => !v)}
            className="flex min-h-[46px] w-full items-center justify-center rounded-xs border-[1.5px] border-dashed border-tint-border bg-pale-1 px-3 text-body-sm font-extrabold text-blue-safe md:hidden"
          >
            {more ? copy.moreClose : copy.moreOpen}
          </button>
          <div id="contact-optional" className={more ? 'flex flex-col gap-3' : 'hidden md:flex md:flex-col md:gap-3'}>
            <Field id="f-ct-place" name="place" label={active.placeLabel} placeholder={active.placePlaceholder} hint="" />
            <Field
              id="f-ct-message"
              name="message"
              as="textarea"
              rows={3}
              label={`${copy.notesLabel} ${copy.notesOptional}`}
              placeholder={copy.notesPlaceholder}
              hint=""
            />
          </div>
          <RadioChips
            name="reply"
            legend={copy.replyLegend}
            value={reply}
            onChange={setReply}
            options={[
              { value: 'whatsapp', label: sys('contact.form.reply.whatsapp') },
              { value: 'email', label: copy.replyEmail },
              { value: 'call', label: copy.replyCall },
            ]}
          />
          {footer}
        </FormShell>
      )}
    </div>
  );
}
```

`src/app/[locale]/(site)/contact/_components/CallbackWidget.tsx`:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import type { FormActionState } from '@/forms/action';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import { RadioChips } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { CALLBACK_DAYS, CALLBACK_SLOTS } from '../forms';

export type CallbackWidgetCopy = {
  title: string; // contact.041
  sub: string; // contact.042
  dayLegend: string; // contact.043
  slotLegend: string; // contact.044
  submit: string; // contact.045
  note: string; // contact.046
  phonePlaceholder: string; // contact.049
  days: Record<(typeof CALLBACK_DAYS)[number], string>; // contact.205 / 206 / 207
  anyTime: string; // contact.209
};

export type CallbackWidgetProps = {
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
  locale: Locale;
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  whatsappIntro: string;
  contact: { phone: string; phoneDisplay?: string; email: string };
  copy: CallbackWidgetCopy;
};

/** The hero's collapsible "Can’t talk right now?" card → `callback` (W3: name added, consent
 *  as a notice). Closed on the server exactly like the design; the form mounts on open. */
export function CallbackWidget({ action, locale, turnstileSiteKey, whatsappNumber, whatsappIntro, contact, copy }: CallbackWidgetProps) {
  const sys = useTranslations('sys');
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<string | null>('today');
  const [slot, setSlot] = useState<string | null>(null);
  const slotLabel: Record<(typeof CALLBACK_SLOTS)[number], string> = {
    '09-11': sys('contact.callback.slots.s1'),
    '11-13': sys('contact.callback.slots.s2'),
    '14-16': sys('contact.callback.slots.s3'),
    '16-18': sys('contact.callback.slots.s4'),
    any: copy.anyTime,
  };
  return (
    <div className="rounded-md border border-border-1 bg-white p-5" data-testid="contact-callback">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
      >
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-card-title font-extrabold text-ink">{copy.title}</span>
          <span className="text-body-sm text-text-tertiary">{copy.sub}</span>
        </span>
        <span aria-hidden="true" className={['transition-transform', open ? 'rotate-180' : ''].join(' ')}>
          ▾
        </span>
      </button>
      <div id={panelId} hidden={!open} className="mt-4 border-t border-border-3 pt-4">
        {open && (
          <FormShell
            action={action}
            formKey="callback"
            locale={locale}
            turnstileSiteKey={turnstileSiteKey}
            whatsappNumber={whatsappNumber}
            whatsappIntro={whatsappIntro}
            contact={contact}
            submitLabel={copy.submit}
            consent="notice"
            consentLinkHref="/kvkk"
            testId="contact-callback-form"
          >
            <RadioChips
              name="day"
              legend={copy.dayLegend}
              value={day}
              onChange={setDay}
              options={CALLBACK_DAYS.map((d) => ({ value: d, label: copy.days[d] }))}
            />
            <RadioChips
              name="slot"
              legend={copy.slotLegend}
              value={slot}
              onChange={setSlot}
              options={CALLBACK_SLOTS.map((s) => ({ value: s, label: slotLabel[s] }))}
            />
            <Field id="f-cb-name" name="name" required autoComplete="name" />
            <Field id="f-cb-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder={copy.phonePlaceholder} />
            <p className="text-body-sm m-0 text-muted">{copy.note}</p>
          </FormShell>
        )}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/contact/_components/VisitBooking.tsx`:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import type { FormActionState } from '@/forms/action';
import { Field, INPUT_CLASS } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import { RadioChips } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { VISIT_SLOTS } from '../forms';
import { formatVisitDay, nextOpenDates, type OfficeHours } from './office-status';
import { useMinuteTick } from './useMinuteTick';

export type VisitBookingCopy = {
  eyebrow: string; // contact.113
  title: string; // contact.114
  body: string; // contact.115
  dayLegend: string; // contact.116
  timeLegend: string; // contact.117
  toggleOpen: string; // contact.213
  toggleClose: string; // contact.212
};

export type VisitBookingProps = {
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
  locale: Locale;
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  whatsappIntro: string;
  contact: { phone: string; phoneDisplay?: string; email: string };
  /** The Antalya row's hours: the chips are the next five open days in Europe/Istanbul. */
  hours: OfficeHours;
  copy: VisitBookingCopy;
};

/** "Book a visit" → `visit` (W3: name/e-mail/phone added; office fixed to antalya). The day
 *  chips are computed from the client clock (R18): the server and no-JS visitors get a plain
 *  labelled date input under the same `preferredDate` name. ≤ 700 px the form sits behind the
 *  design's "Pick a day & time" toggle (contact.213/212). */
export function VisitBooking({ action, locale, turnstileSiteKey, whatsappNumber, whatsappIntro, contact, hours, copy }: VisitBookingProps) {
  const sys = useTranslations('sys');
  const bodyId = useId();
  const tick = useMinuteTick();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const days = tick === null ? null : nextOpenDates(new Date(tick * 60_000), hours, 5);
  return (
    <div data-testid="contact-visit" className="grid grid-cols-1 items-start gap-6 rounded-lg border border-border-1 bg-white p-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-9">
      <div>
        <p className="text-eyebrow m-0 mb-3 inline-flex rounded-pill border border-tint-border bg-tint px-3 py-1 font-extrabold uppercase tracking-[1.2px] text-blue-safe">{copy.eyebrow}</p>
        <h3 className="text-card-title m-0 mb-2">{copy.title}</h3>
        <p className="text-body-sm m-0 text-text-tertiary">{copy.body}</p>
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
      <div id={bodyId} className={open ? 'block' : 'hidden md:block'}>
        <FormShell
          action={action}
          formKey="visit"
          locale={locale}
          turnstileSiteKey={turnstileSiteKey}
          whatsappNumber={whatsappNumber}
          whatsappIntro={whatsappIntro}
          contact={contact}
          submitLabel={sys('contact.visit.submit')}
          consent="notice"
          consentLinkHref="/kvkk"
          testId="contact-visit-form"
        >
          {days ? (
            <RadioChips
              name="preferredDate"
              legend={copy.dayLegend}
              value={day}
              onChange={setDay}
              options={days.map((iso) => ({ value: iso, label: formatVisitDay(iso, locale) }))}
            />
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-vs-date" className="text-body-sm font-extrabold text-text-secondary">
                {sys('form.labels.preferredDate')}
              </label>
              <input id="f-vs-date" name="preferredDate" type="text" className={INPUT_CLASS} placeholder={sys('form.placeholders.preferredDate')} maxLength={40} />
            </div>
          )}
          <RadioChips
            name="preferredTime"
            legend={copy.timeLegend}
            value={time}
            onChange={setTime}
            options={VISIT_SLOTS.map((s) => ({ value: s, label: s }))}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field id="f-vs-name" name="name" required autoComplete="name" />
            <Field id="f-vs-email" name="email" type="email" required autoComplete="email" inputMode="email" />
            <Field id="f-vs-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
          </div>
        </FormShell>
      </div>
    </div>
  );
}
```

Notes for the implementer:
- `Field`'s default `id` is `f-${name}`; three forms share `name`/`email`/`phone`, so every `Field` here passes an explicit unique `id` (duplicate ids fail axe).
- `RadioChips` (Task 5) renders native radios under `name`, so `day`/`slot`/`reply`/`preferredDate`/`preferredTime` reach the server action through `FormData` with no hidden inputs.
- The `job` topic renders no `<form>`; the `topic` value reaches the action through the hidden input inside `FormShell` — the picker radios (`topicPick`) live outside the form on purpose.
- Three `FormShell`s means up to three Turnstile widgets on one page; Task 2's `Turnstile` appends the Cloudflare script once per document (it checks for an existing `<script src=TURNSTILE_SCRIPT>`) — the executor confirms that on the preview with a site key set; if a second widget fails to render, that is a Task 2 defect to fix in `src/forms/client/Turnstile.tsx`, not here.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run "src/app/\[locale\]/(site)/contact"` → 6 files green (LiveStatus 5 tests). `npm run verify` → green (the islands are typed against Task 2/5's real exports; a prop-name mismatch surfaces here — the names above are copied from `produces-final.md`).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/contact/_components" "src/app/[locale]/(site)/contact/__tests__/LiveStatus.test.tsx"
git commit -m "feat(contact): live-status pills (minute clock, hydration-safe), topic picker + enquiry shell, callback widget, visit booking islands

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — `actions.ts` + `page.tsx` (metadata, hero, message, offices, FAQ, JSON-LD) + `UNBUILT_PATHNAMES`

- [ ] **Step 1: Write the failing test**

The failing test is the foundation's own: create the page file first (Step 3) and run `npx vitest run src/lib/seo/unbuilt.test.ts` — it fails with `'/contact' is in UNBUILT_PATHNAMES but src/app/[locale]/(site)/contact/page.tsx exists` until the key is deleted. (There is no async-RSC render helper in the suite; the page's behaviour is proven by Cycle 4's Playwright spec.)

- [ ] **Step 2: Run to verify it fails**

After writing `page.tsx` and before touching `routes.ts`: `npx vitest run src/lib/seo/unbuilt.test.ts` → 1 failed (the set and the filesystem disagree).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/contact/actions.ts`:

```ts
'use server';
// The three Contact forms' server actions: `createFormAction` (server-only) wrapped in a
// `'use server'` module, one exported async function per form (Task 2's page-side pattern).
// The specs themselves are pure and tested in ./forms.ts.
import { createFormAction, type FormActionState } from '@/forms/action';
import { callbackSchema, contactSchema, toCallbackFields, toContactFields, toVisitFields, visitSchema } from './forms';

const runContact = createFormAction({
  key: 'contact',
  schema: contactSchema,
  toFields: (p) => toContactFields(p),
  consent: 'checkbox',
});
const runCallback = createFormAction({
  key: 'callback',
  schema: callbackSchema,
  toFields: (p) => toCallbackFields(p),
  consent: 'notice',
});
const runVisit = createFormAction({
  key: 'visit',
  schema: visitSchema,
  toFields: (p) => toVisitFields(p),
  consent: 'notice',
});

export async function submitContact(prev: FormActionState, data: FormData) {
  return runContact(prev, data);
}
export async function submitCallback(prev: FormActionState, data: FormData) {
  return runCallback(prev, data);
}
export async function submitVisit(prev: FormActionState, data: FormData) {
  return runVisit(prev, data);
}
```

`src/app/[locale]/(site)/contact/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
import { getOffice } from '@/content/collections';
import { Breadcrumbs, ContactCta, FaqBlock, ImageSlot, OfficeCard, ProcessSteps } from '@/design/blocks';
import { Button, Eyebrow, Section } from '@/design/primitives';
import { QrCode } from '@/design/QrCode';
import { routing, type Locale } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/seo/routes';
import { submitCallback, submitContact, submitVisit } from './actions';
import { CallbackWidget } from './_components/CallbackWidget';
import { ContactEnquiry, type TopicCopy } from './_components/ContactEnquiry';
import { LiveStatus, type LiveStatusFragments } from './_components/LiveStatus';
import { formatPhoneDisplay } from './_components/phone';
import { VisitBooking } from './_components/VisitBooking';
import { contactPageJsonLd } from './jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations({ locale, namespace: 'sys' })]);
  // The package ships no SEO strings for this page (contact.228 is the JSON-LD name only), so
  // the record's ids are '' and buildMetadata takes the sys.seo.contact.* fallbacks (W23/W38).
  return buildMetadata({
    locale,
    href: '/contact',
    bundle,
    pageKey: 'contact',
    fallbackTitle: sys('seo.contact.title'),
    fallbackDescription: sys('seo.contact.description'),
  });
}

const CHANNEL_CARD =
  'flex items-center gap-4 rounded-md border border-border-1 bg-white p-5 no-underline transition-shadow hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeTf(bundle, locale); // D17: every package id through the placeholder-filling accessor
  const metrics = metricValues(bundle, locale);
  const { settings } = bundle;
  const antalya = getOffice(bundle, 'antalya');
  const karachi = getOffice(bundle, 'karachi');
  const contact = { phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email };
  const waMain = waLink(settings.whatsappNumber, sys('contact.wa.main'));

  const fragments: LiveStatusFragments = {
    openNow: t('contact.152'),
    inCity: t('contact.153'),
    weekend: t('contact.154'),
    closedToday: t('contact.155'),
    linesOpen: t('contact.215'),
    linesClosed: t('contact.216'),
  };

  const topics: TopicCopy[] = [
    {
      key: 'hire',
      label: t('contact.058'),
      sub: t('contact.059'),
      title: t('contact.162'),
      formSub: t('contact.163'),
      desk: t('contact.161'),
      orgLabel: t('contact.164'),
      orgPlaceholder: t('contact.165'),
      detailLabel: t('contact.166'),
      detailPlaceholder: t('contact.167'),
      placeLabel: t('contact.168'),
      placePlaceholder: sys('contact.form.cityPlaceholder.hire'),
      submit: t('contact.169'),
    },
    {
      key: 'permit',
      label: t('contact.060'),
      sub: t('contact.061'),
      title: t('contact.171'),
      formSub: t('contact.172'),
      desk: t('contact.170'),
      orgLabel: t('contact.164'),
      orgPlaceholder: t('contact.165'),
      detailLabel: t('contact.173'),
      detailPlaceholder: t('contact.174'),
      placeLabel: t('contact.175'),
      placePlaceholder: sys('contact.form.cityPlaceholder.permit'),
      submit: t('contact.176'),
    },
    {
      key: 'partner',
      label: t('contact.062'),
      sub: t('contact.063'),
      title: t('contact.063'),
      formSub: t('contact.178'),
      desk: t('contact.177'),
      orgLabel: t('contact.179'),
      orgPlaceholder: t('contact.180'),
      detailLabel: t('contact.181'),
      detailPlaceholder: t('contact.182'),
      placeLabel: t('contact.183'),
      placePlaceholder: t('contact.184'),
      submit: t('contact.185'),
    },
    { key: 'job', label: t('contact.064'), sub: t('contact.065') },
  ];

  const faqItems = [
    { id: 'q1', q: t('contact.195'), a: t('contact.196') },
    { id: 'q2', q: t('contact.197'), a: t('contact.198') },
    // The package has no answer ids for Q3 and Q5 (sec SSS holds 6 questions, 4 answers) — W9: sys copy.
    { id: 'q3', q: t('contact.199'), a: sys('contact.faq.a3', { hours: t('contact.135'), replyHours: metrics.replySlaHours }) },
    { id: 'q4', q: t('contact.200'), a: t('contact.201') },
    { id: 'q5', q: t('contact.202'), a: sys('contact.faq.a5') },
    { id: 'q6', q: t('contact.203'), a: t('contact.204') },
  ];

  return (
    <>
      <JsonLd data={contactPageJsonLd({ name: t('contact.228'), url: absoluteUrl(locale, '/contact'), locale })} />

      {/* ===== HERO (dark, gradient-only photo slot — the h1 stays the LCP element, D26) ===== */}
      <Section tone="dark" className="relative overflow-hidden" data-testid="contact-hero">
        <ImageSlot slot="contact-hero" src={null} alt="" width={1440} height={720} className="absolute inset-0 h-full w-full opacity-40" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/75" />
        <div className="container-site relative">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-4"
            items={[
              { name: t('contact.023'), href: '/' },
              { name: t('contact.024'), href: '/contact' },
            ]}
          />
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-13">
            <div>
              <LiveStatus variant="hero" hours={antalya.hours} fallback={t(antalya.hoursId)} fragments={fragments} className="mb-4 bg-white" />
              <h1 data-testid="page-h1" data-lcp-slot="h1" className="text-h1 m-0 mb-4 leading-[1.02] tracking-[-0.03em] text-white">
                {t('contact.025')} <span className="text-sky">{t('contact.026')}</span>
              </h1>
              {/* W10: desktop/mobile paragraph variants are two spans, toggled by CSS, both in the HTML. */}
              <p className="text-body-lg m-0 mb-6 max-w-[520px] text-white/80">
                <span className="hidden md:inline">{t('contact.027')}</span>
                <span className="md:hidden">{t('contact.028')}</span>
              </p>
              <ul className="m-0 mb-5 flex list-none flex-wrap gap-2 p-0">
                <li className="inline-flex items-center gap-2 rounded-pill border border-success-border bg-white px-3.5 py-1.5 text-body-sm font-extrabold text-success-text">
                  <span aria-hidden="true">✓</span>
                  {t('contact.029')}
                </li>
                <li className="inline-flex items-center rounded-pill border border-border-1 bg-white px-3.5 py-1.5 text-body-sm font-extrabold text-text-secondary">{t('contact.030')}</li>
              </ul>
              <div className="hidden max-w-[520px] rounded-base border border-border-1 bg-white p-5 text-ink md:block">
                <p className="text-eyebrow m-0 mb-3 font-extrabold uppercase tracking-[1.4px] text-text-tertiary">{t('contact.031')}</p>
                <ul className="m-0 mb-3 flex list-none flex-wrap gap-2 p-0">
                  {(['tr', 'en', 'fr', 'hi', 'ru'] as const).map((code) => (
                    <li key={code} className="rounded-pill border border-tint-border bg-tint px-3.5 py-1 text-body-sm font-extrabold text-blue-safe">
                      {sys(`contact.languages.${code}`)}
                    </li>
                  ))}
                </ul>
                <p className="text-body-sm m-0 text-text-tertiary">{t('contact.032')}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              <ContactLink href={waMain} placement="page_cta" target="_blank" rel="noopener noreferrer" className={`${CHANNEL_CARD} relative border-[1.5px] border-success-border`}>
                <span className="absolute right-4 top-3 rounded-pill bg-success-surface px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[1px] text-success-text">{t('contact.033')}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-success-text">{sys('contact.channels.whatsapp')}</span>
                  <span className="text-card-title font-extrabold text-ink">{settings.phoneDisplay}</span>
                  <span className="text-body-sm text-text-tertiary">{t('contact.034')}</span>
                  <LiveStatus variant="whatsapp" hours={antalya.hours} fallback={t(antalya.hoursId)} fragments={fragments} className="mt-1 self-start" />
                </span>
              </ContactLink>
              <div className={settings.partnershipsPhone ? 'grid grid-cols-1 gap-3.5 sm:grid-cols-2' : 'grid grid-cols-1 gap-3.5'}>
                <ContactLink href={telLink(settings.phone)} placement="page_cta" className={`${CHANNEL_CARD} flex-col items-start gap-2`}>
                  <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-blue-safe">{t('contact.035')}</span>
                  <span className="text-card-title font-extrabold text-ink">{settings.phoneDisplay}</span>
                  <span className="text-body-sm text-text-tertiary">{t('contact.036')}</span>
                  <span className="flex flex-wrap items-center gap-1 text-body-sm font-extrabold text-text-secondary">
                    <LiveStatus variant="lines" hours={antalya.hours} fallback={t(antalya.hoursId)} fragments={fragments} />
                    <span>· {t('contact.135')}</span>
                  </span>
                </ContactLink>
                {settings.partnershipsPhone && (
                  <ContactLink href={telLink(settings.partnershipsPhone)} placement="page_cta" className={`${CHANNEL_CARD} flex-col items-start gap-2`}>
                    <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-navy">{t('contact.037')}</span>
                    <span className="text-card-title font-extrabold text-ink">{formatPhoneDisplay(settings.partnershipsPhone)}</span>
                    <span className="text-body-sm text-text-tertiary">{t('contact.038')}</span>
                    <span className="flex flex-wrap items-center gap-1 text-body-sm font-extrabold text-text-secondary">
                      <LiveStatus variant="lines" hours={antalya.hours} fallback={t(antalya.hoursId)} fragments={fragments} />
                      <span>· {t('contact.135')}</span>
                    </span>
                  </ContactLink>
                )}
              </div>
              <ContactLink href={mailLink(settings.email)} placement="page_cta" className={`${CHANNEL_CARD} hidden md:flex`}>
                <span className="flex flex-col gap-0.5">
                  <span className="text-card-title font-extrabold text-ink">{settings.email}</span>
                  <span className="text-body-sm text-text-tertiary">{t('contact.039')}</span>
                  <span className="text-body-sm font-extrabold text-muted">{t('contact.040')}</span>
                </span>
              </ContactLink>
              <CallbackWidget
                action={submitCallback}
                locale={locale}
                turnstileSiteKey={settings.turnstileSiteKey}
                whatsappNumber={settings.whatsappNumber}
                whatsappIntro={sys('contact.wa.callback')}
                contact={contact}
                copy={{
                  title: t('contact.041'),
                  sub: t('contact.042'),
                  dayLegend: t('contact.043'),
                  slotLegend: t('contact.044'),
                  submit: t('contact.045'),
                  note: t('contact.046'),
                  phonePlaceholder: t('contact.049'),
                  days: { today: t('contact.205'), tomorrow: t('contact.206'), this_week: t('contact.207') },
                  anyTime: t('contact.209'),
                }}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ===== MESSAGE (id="message" — the header CTA target, W17 CTA_BY_PATHNAME['/contact']) ===== */}
      <Section tone="light" id="message" className="scroll-mt-5" data-testid="contact-message">
        <div className="container-site grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="lg:sticky lg:top-6">
            <Eyebrow>{t('contact.050')}</Eyebrow>
            <h2 className="text-h2 m-0 mb-4">{t('contact.051')}</h2>
            <p className="text-body m-0 mb-6 text-text-secondary">{t('contact.052')}</p>
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
            <div className="mt-6 rounded-base border border-border-1 bg-white p-5">
              <h3 className="text-card-title m-0 mb-1">{t('contact.053')}</h3>
              <p className="text-body-sm m-0 mb-4 text-text-tertiary">{t('contact.054')}</p>
              <ContactCta placement="page_cta" href={waMain} external variant="primary" className="w-full bg-success-text hover:bg-ink">
                {t('contact.055')}
              </ContactCta>
              <div className="mt-4 flex items-center gap-3 border-t border-border-3 pt-4" data-testid="contact-qr">
                {/* W14: local encoder; the design fetched api.qrserver.com. Plain wa.me URL — the shortest QR. */}
                <QrCode text={`https://wa.me/${settings.whatsappNumber}`} label={t('contact.089')} size={86} className="shrink-0 rounded-input border border-border-2" />
                <p className="text-body-sm m-0 text-text-tertiary">{t('contact.056')}</p>
              </div>
            </div>
          </div>

          <ContactEnquiry
            action={submitContact}
            locale={locale}
            turnstileSiteKey={settings.turnstileSiteKey}
            whatsappNumber={settings.whatsappNumber}
            whatsappIntro={sys('contact.wa.main')}
            contact={contact}
            topics={topics}
            copy={{
              legend: t('contact.057'),
              deskPrefix: t('contact.218'),
              nameLabel: t('contact.066'),
              namePlaceholder: t('contact.090'),
              emailLabel: t('contact.067'),
              phoneLabel: t('contact.068'),
              notesLabel: t('contact.069'),
              notesOptional: t('contact.070'),
              notesPlaceholder: t('contact.091'),
              replyLegend: t('contact.071'),
              replyEmail: t('contact.067'),
              replyCall: t('contact.186'),
              moreOpen: t('contact.211'),
              moreClose: t('contact.210'),
            }}
            footer={
              <p className="text-body-sm m-0 text-right">
                <ContactLink href={mailLink(settings.email)} placement="page_cta" className="font-extrabold text-blue-safe no-underline hover:underline">
                  {t('contact.074')}
                </ContactLink>
              </p>
            }
            jobPanel={
              <>
                <div className="mb-4 rounded-base border border-success-border bg-success-surface p-5">
                  <h3 className="text-card-title m-0 mb-1.5">{t('contact.075')}</h3>
                  <p className="text-body-sm m-0 text-text-secondary">
                    <strong className="text-ink">{t('contact.076')}</strong>
                    {t('contact.077')}
                    <strong className="text-success-text">{t('contact.078')}</strong>
                    {t('contact.079')}
                  </p>
                </div>
                <div className="mb-4 grid grid-cols-1 gap-3.5 md:grid-cols-2">
                  <div className="rounded-sm border border-border-1 p-5">
                    <h4 className="text-body m-0 mb-1.5 font-extrabold">{t('contact.080')}</h4>
                    <p className="text-body-sm m-0 mb-3.5 text-text-tertiary">{t('contact.081')}</p>
                    <ContactCta placement="page_cta" href={waLink(settings.whatsappNumber, sys('contact.wa.jobseeker'))} external variant="primary" className="bg-success-text hover:bg-ink">
                      {t('contact.082')}
                    </ContactCta>
                  </div>
                  <div className="rounded-sm border border-border-1 p-5">
                    <h4 className="text-body m-0 mb-1.5 font-extrabold">{t('contact.083')}</h4>
                    <p className="text-body-sm m-0 text-text-tertiary">{t('contact.084')}</p>
                  </div>
                </div>
                <p className="text-body-sm m-0 text-text-tertiary">{t('contact.085')}</p>
              </>
            }
          />
        </div>
      </Section>

      {/* ===== OFFICES ===== */}
      <Section tone="pale" data-testid="contact-offices">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-hero bg-gradient-to-br from-[#2c3a75] via-navy to-[#16204a] p-8 text-white md:p-13">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[560px]">
                <p className="text-eyebrow m-0 mb-4 inline-block rounded-pill border border-white/30 bg-white/15 px-4 py-1.5 font-extrabold uppercase tracking-[1.8px]">{t('contact.092')}</p>
                <h2 className="text-h2 m-0 mb-3.5 text-white">{t('contact.093')}</h2>
                <p className="text-body m-0 text-white/90">{t('contact.094')}</p>
              </div>
              <p className="text-body-sm m-0 inline-flex items-center rounded-pill border border-white/30 bg-white/15 px-4 py-2 font-extrabold">{t('contact.095')}</p>
            </div>
            {/* D20: the design's ≤700 px Antalya/Karachi tabs become a stacked column — both cards stay in the HTML. */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_72px_1fr] md:gap-0">
              <OfficeCard bundle={bundle} locale={locale} office={antalya}>
                <LiveStatus variant="office" hours={antalya.hours} fallback={t(antalya.hoursId)} fragments={fragments} />
                <p className="text-body-sm m-0 mt-3 text-text-tertiary">{t('contact.101')}</p>
              </OfficeCard>
              <div aria-hidden="true" className="hidden flex-col items-center justify-center md:flex">
                <span className="w-0 flex-1 border-l-2 border-dashed border-white/30" />
                <span className="my-2.5 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-dashed border-white/45 bg-white/10">✈</span>
                <span className="w-0 flex-1 border-l-2 border-dashed border-white/30" />
              </div>
              <OfficeCard bundle={bundle} locale={locale} office={karachi}>
                <LiveStatus variant="office" hours={karachi.hours} fallback={t(karachi.hoursId)} fragments={fragments} />
                <p className="text-body-sm m-0 mt-3 text-text-tertiary">{t('contact.108')}</p>
                <Button variant="secondary" href="/available-workers" className="mt-3">
                  {t('contact.109')}
                </Button>
              </OfficeCard>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-5 rounded-md border border-white/25 bg-white/10 p-6">
              <div className="min-w-[280px] flex-1">
                <h3 className="text-body m-0 mb-1 font-extrabold text-white">{t('contact.110')}</h3>
                <p className="text-body-sm m-0 text-white/85">{t('contact.111')}</p>
              </div>
              <ContactCta placement="page_cta" href={waLink(settings.whatsappNumber, sys('contact.wa.visitSite'))} external variant="inverse">
                {t('contact.112')}
              </ContactCta>
            </div>
          </div>
          <div className="mt-5">
            <VisitBooking
              action={submitVisit}
              locale={locale}
              turnstileSiteKey={settings.turnstileSiteKey}
              whatsappNumber={settings.whatsappNumber}
              whatsappIntro={sys('contact.wa.visit')}
              contact={contact}
              hours={antalya.hours}
              copy={{
                eyebrow: t('contact.113'),
                title: t('contact.114'),
                body: t('contact.115'),
                dayLegend: t('contact.116'),
                timeLegend: t('contact.117'),
                toggleOpen: t('contact.213'),
                toggleClose: t('contact.212'),
              }}
            />
          </div>
        </div>
      </Section>

      {/* ===== FAQ (FaqBlock renders the FAQPage node) ===== */}
      <Section tone="light" data-testid="contact-faq">
        <div className="container-site">
          <FaqBlock
            bundle={bundle}
            locale={locale}
            id="faq"
            items={faqItems}
            eyebrowId="contact.119"
            headingId="contact.120"
            bodyId="contact.121"
            openFirst
            headingLevel={3}
            askCard={{
              titleId: 'contact.122',
              bodyId: 'contact.123',
              whatsappNumber: settings.whatsappNumber,
              whatsappText: sys('contact.wa.main'),
              whatsappLabelId: 'contact.124',
            }}
          />
        </div>
      </Section>
    </>
  );
}
```

Notes for the implementer:
- `Section` (Task 5) takes `tone | id | className | children` — if it does not spread `data-testid`, wrap each section's content in `<div data-testid="…">` instead of passing the attribute to `Section` (do not extend the primitive here).
- `QrCode` (Task 6) signature is `{ text, label, size = 86, className? }`; it is `server-only` and this page is a server component.
- `ImageSlot` with `src={null}` and `alt=""` renders an aria-hidden gradient `div` carrying `data-placeholder="contact-hero"` and no `data-lcp-slot` (only the h1 carries `data-lcp-slot="h1"`) — exactly what the launch-profile counter wants (Task 7 `evaluateScan`).
- `OfficeCard` renders the tel/WhatsApp/mail rows with `placement="office_card"` itself; the page adds nothing to them.
- `Button href="/available-workers"` is a `pathnames` key (Task 1's `PAGE_PATHNAME.workers`), so the R17 cast is safe; the route is still in `UNBUILT_PATHNAMES` until T8 lands — a 404 today, by design of the WP order.
- Tailwind 4 arbitrary values used: `gap-13`, `p-13` are not in the default scale — use `gap-[52px]`/`p-[52px]` if the build warns; `text-h1`/`text-h2`/`text-eyebrow`/`text-card-title`/`text-body*` are this repo's theme utilities (`globals.css` `@theme inline`).

`src/lib/seo/routes.ts` — Modify the `UNBUILT_PATHNAMES` literal (Task 4's 19-entry set): delete the line `'/contact',`. Nothing else in the file changes.

- [ ] **Step 4: Run tests + `npm run verify`**

`npx vitest run src/lib/seo/unbuilt.test.ts src/lib/seo/routes.test.ts` → green. `npm run verify` → green. Then `npm run build && npm run start` and open `http://localhost:3000/iletisim` and `/en/contact`: the hero pill switches from "Pzt–Cum · 09:00–18:00 (TRT)" to the live label within a second of hydration; no console error `unknown string id` (a typo in any `contact.nnn` throws in dev — `npm run dev` first if in doubt); the header's primary CTA reads "Mesaj gönder" / "Send a message" and scrolls to `#message`.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/contact/page.tsx" "src/app/[locale]/(site)/contact/actions.ts" src/lib/seo/routes.ts
git commit -m "feat(contact): /iletisim + /en/contact — hero channels with live status, topic enquiry, offices, book-a-visit, FAQ, ContactPage JSON-LD

Forms: contact (topic/iAm/subject/message/city), callback (name added, W3), visit
(name/email/phone added, office=antalya). /contact leaves UNBUILT_PATHNAMES (W20).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — gate: `e2e/routes.ts` rows, `e2e/pages/contact.spec.ts`, preview gate run

- [ ] **Step 1: Write the failing test**

`e2e/pages/contact.spec.ts`:

```ts
import { test, expect, type Page } from '@playwright/test';

type DataLayerEntry = Record<string, unknown>;
const dataLayer = (page: Page) =>
  page.evaluate(() => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? []) as Promise<DataLayerEntry[]>;

const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;

test.describe('Contact', () => {
  test('TR: the sections render in the design order with real copy', async ({ page }) => {
    const res = await page.goto('/iletisim');
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByTestId('page-h1')).toBeVisible();
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);
    // Design order: hero → message (#message, the header CTA target, W17) → offices → FAQ.
    const order = await page.evaluate(() =>
      ['contact-hero', 'contact-message', 'contact-offices', 'contact-faq'].map(
        (id) => document.querySelector(`[data-testid="${id}"]`)?.getBoundingClientRect().top ?? -1,
      ),
    );
    expect(order.every((y) => y >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    await expect(page.locator('#message')).toHaveCount(1);
    // D26: the h1 is the LCP slot; the hero photo slot is a named placeholder, never the LCP.
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('[data-lcp-slot="h1"]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder="contact-hero"]')).toHaveCount(1);
  });

  test('EN: answers under /en with the same contract', async ({ page }) => {
    const res = await page.goto('/en/contact');
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByTestId('page-h1')).toBeVisible();
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);
  });

  test('the live pills hydrate to a computed state and the QR is inline SVG (W14)', async ({ page }) => {
    await page.goto('/iletisim');
    const pill = page.getByTestId('live-status').first();
    await expect(pill).toHaveAttribute('data-open', /true|false/);
    await expect(page.locator('[data-testid="contact-qr"] svg')).toHaveCount(1);
    expect(await page.locator('img[src*="qrserver"]').count()).toBe(0);
  });

  test('JSON-LD: ContactPage, BreadcrumbList and FAQPage nodes are server-rendered', async ({ page }) => {
    await page.goto('/en/contact');
    const nodes = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = nodes.flatMap((n) => {
      const j = JSON.parse(n) as { '@type'?: string | string[] };
      return Array.isArray(j['@type']) ? j['@type'] : [j['@type']];
    });
    expect(types).toEqual(expect.arrayContaining(['ContactPage', 'BreadcrumbList', 'FAQPage']));
    const contactPage = nodes.map((n) => JSON.parse(n) as { '@type'?: string; url?: string }).find((j) => j['@type'] === 'ContactPage');
    expect(contactPage?.url).toBe('https://www.jobsadmire.com/en/contact');
  });

  test('topic picker: "job" swaps the form for the B2B explainer and fires contact_topic with the enum key only', async ({ page }) => {
    await page.goto('/iletisim');
    await expect(page.getByTestId('contact-enquiry-form')).toBeVisible();
    await page.locator('input[name="topicPick"][value="job"]').check({ force: true });
    await expect(page.getByTestId('contact-jobseeker')).toBeVisible();
    await expect(page.getByTestId('contact-enquiry-form')).toHaveCount(0);
    const events = (await dataLayer(page)).filter((e) => e.event === 'contact_topic');
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ topic: 'job', locale: 'tr', page: '/iletisim' });
    expect(Object.keys(events[0]).sort()).toEqual(['event', 'locale', 'page', 'topic']);
    await page.locator('input[name="topicPick"][value="partner"]').check({ force: true });
    await expect(page.getByTestId('contact-enquiry-form')).toBeVisible();
    await expect(page.getByTestId('contact-enquiry-form').locator('input[name="topic"]')).toHaveValue('partner');
  });

  test('enquiry form: with the door unreachable the visitor gets the fallback panel, never a fake success (D11)', async ({ page }) => {
    // Deterministic when OPS_API_URL is unset (kind 'unauthorized' without a call); with a dark
    // door it is 'off'; either way the panel — the success path would redirect to /tesekkurler.
    await page.goto('/iletisim');
    const form = page.getByTestId('contact-enquiry-form');
    await form.locator('#f-ct-company').fill('Akdeniz Otel A.Ş.');
    await form.locator('#f-ct-name').fill('Ayşe Yılmaz');
    await form.locator('#f-ct-email').fill('ayse@akdenizotel.com');
    await form.locator('#f-ct-phone').fill('+90 532 000 00 00');
    await form.locator('#f-ct-detail').fill('10 kaynakçı, 4 CNC operatörü');
    await form.locator('input[name="consent"]').check({ force: true });
    await form.locator('button[type="submit"]').click();
    await expect(page.getByTestId('form-fallback')).toBeVisible({ timeout: 15_000 });
    expect(new URL(page.url()).pathname).toBe('/iletisim');
    // The panel's WhatsApp link carries what the visitor typed (D11), never a candidate id.
    await expect(page.getByTestId('form-fallback').locator('a[href^="https://wa.me/"]')).toHaveCount(1);
  });

  test('a missing required field is reported inline, without a round trip to the door', async ({ page }) => {
    await page.goto('/en/contact');
    const form = page.getByTestId('contact-enquiry-form');
    await form.locator('#f-ct-company').fill('Acme');
    await form.locator('input[name="consent"]').check({ force: true });
    await form.locator('button[type="submit"]').click();
    await expect(form.locator('#f-ct-name-error')).toBeVisible();
    await expect(form.locator('#f-ct-company')).toHaveValue('Acme');
  });

  test('callback and visit forms exist and carry their keys', async ({ page }) => {
    await page.goto('/iletisim');
    await page.getByTestId('contact-callback').getByRole('button').first().click();
    await expect(page.getByTestId('contact-callback-form')).toHaveAttribute('data-form-key', 'callback');
    await expect(page.getByTestId('contact-callback-form').locator('input[name="day"]')).toHaveCount(3);
    await expect(page.getByTestId('contact-visit-form')).toHaveAttribute('data-form-key', 'visit');
    await expect(page.getByTestId('contact-visit-form').locator('input[name="preferredTime"]')).toHaveCount(5);
  });

  test('the language switch keeps the visitor on the contact page', async ({ page }, testInfo) => {
    await page.goto('/iletisim');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://www.jobsadmire.com/en/contact');
    if (testInfo.project.name === 'desktop') {
      await page.locator('a[hreflang="en"]').first().click();
      await expect(page).toHaveURL(/\/en\/contact$/);
      await expect(page.getByTestId('page-h1')).toBeVisible();
    }
  });
});
```

`e2e/routes.ts` — Modify `GATE_ROUTE_TABLE` (Task 7's literal): after the `{ path: '/en/hire-workers', indexable: true },` row (and after any rows earlier page tasks appended), before the conversion-page comment, add:

```ts
  { path: '/iletisim', indexable: true },
  { path: '/en/contact', indexable: true },
```

- [ ] **Step 2: Run to verify it fails**

Against the Cycle 3 build without the routes edit: `E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/contact.spec.ts` — the spec runs (the page exists) and the two seo/routing loops do not yet cover the route. With the routes rows added but the old build still serving: `npx playwright test e2e/seo.spec.ts` → the sitemap membership case fails for `/iletisim` (the running build predates the `UNBUILT_PATHNAMES` edit) — rebuild and it passes; that is the red→green of this cycle.

- [ ] **Step 3: Implement**

The spec above and the two rows. Run `npx prettier --write e2e/pages/contact.spec.ts e2e/routes.ts`.

- [ ] **Step 4: Run tests + `npm run verify` + the gate**

```
npm run build && (npm run start &) && sleep 4
E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/contact.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts
```
Expected: all green in both projects — axe zero violations on `/iletisim` and `/en/contact` (unique field ids, one h1, labelled radios), zero horizontal overflow at 1440…390. Then push the branch, wait for the Vercel preview, and:
```
E2E_BASE_URL=https://<preview-url> npm run gate
npm run js-size
```
Expected: Lighthouse on `/iletisim` and `/en/contact` ≥ 0.95 performance, 1.0 a11y/BP/SEO, `resource-summary:script:size` ≤ 204,800 B. If a route lands above 194,560 B (W13 amended lazy line): wrap `VisitBooking` (below the fold) in `next/dynamic` from the page — `const VisitBooking = dynamic(() => import('./_components/VisitBooking').then((m) => m.VisitBooking))` — and re-measure before continuing; do NOT use `ssr: false` (the form must exist in the HTML).

- [ ] **Step 5: Commit**

```bash
git add e2e/pages/contact.spec.ts e2e/routes.ts
git commit -m "test(contact): page-contract, live pills, JSON-LD, topic picker analytics, fallback panel, language switch; gate routes

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — docs (SEO, ANALYTICS, CONTENT-MODEL, PRD) + ledger

- [ ] **Step 1: Write the failing test**

Docs-only cycle: no test. The check is `npx prettier --check docs/*.md` and a re-read of each changed paragraph against the code.

- [ ] **Step 2: Run to verify it fails**

n/a.

- [ ] **Step 3: Implement**

`docs/SEO.md` — § Pages (the per-page table WP2b maintains). If the heading `## Pages` does not exist yet (this is the first WP2b page task to land), add it right after § OG images with this header, then the row; otherwise append the row:

```md
## Pages

One row per built route: where the title/description come from, the canonical, the JSON-LD nodes the page renders beyond the site-wide Organization/WebSite pair, and the element that carries `data-lcp-slot` (D26).

| Page | Routes | Title / description source | Canonical | JSON-LD on the page | LCP slot |
| --- | --- | --- | --- | --- | --- |
| Contact | `/iletisim` · `/en/contact` | `sys.seo.contact.{title,description}` — the package ships no SEO string for this page (`bundle.pages.contact.titleId === ''`) | `absoluteUrl(locale, '/contact')` (the design's `/contact-us` is a 301 in `redirects/rules.json`) | `BreadcrumbList` (Breadcrumbs), `FAQPage` (FaqBlock, 6 pairs — two answers are `sys.contact.faq.*`), `ContactPage` (page-local `contact/jsonld.ts`: name `contact.228`, url, inLanguage) | `h1` (`data-lcp-slot="h1"`); the `contact-hero` photo slot is a gradient placeholder (`data-placeholder="contact-hero"`) until §10 row 4 ships a photo |
```

`docs/ANALYTICS.md` — § Event schema table: the `contact_topic` row (added by WP2a Task 3). Replace its "Fires on" cell with: `The Contact page's topic picker (\`/iletisim\`, \`/en/contact\`), on every change — \`topic\` is the picker key (\`hire\` \`permit\` \`partner\` \`job\`; \`other\` is reserved), never a label or a field value`. After the table's trailing paragraph (the one beginning "`page` is `usePathname()`…"), add:

```md
**Contact page placements (WP2b T7).** The hero's WhatsApp / phone / e-mail cards and the "Rather email?" link fire `whatsapp_click` / `call_click` / `email_click` with `placement: 'page_cta'` through `ContactLink`; the two office cards' tel / WhatsApp / mail rows fire the same events with `placement: 'office_card'` (rendered by the `OfficeCard` block); the FAQ ask card and the "In a hurry?" / site-visit / job-seeker WhatsApp buttons are `ContactCta` `page_cta`. The three forms fire nothing themselves — `generate_lead` comes from the kernel's redirect and `conversion` from `/tesekkurler?form=contact|callback|visit` (D13).
```

`docs/CONTENT-MODEL.md` — § The `sys.*` range, after the "**Thank-you page:**" bullet (and after any bullets earlier WP2 tasks added; if T0b moved the namespace list under a "§ Adding copy" heading — CLAUDE.md now points there — the bullet goes at the end of that list instead), add:

```md
- **Contact page (`sys.contact.*`, WP2b T7):** `languages.{tr,en,fr,hi,ru}` (the hero's endonym chips — identical in both files on purpose; `contact.224–227` are the exonyms the design used only in JSON-LD), `channels.whatsapp`, `status.{openNow,closedOpensAt,closedOpensTomorrow,closedOpensOn,opens,waWatched,waOff}` (ICU `{time}` `{open}` `{close}` `{day}` — the office-card and WhatsApp pills; the hero pill composes the package's own split fragments `contact.152/153/154/155`, the phone cards `contact.215/216`), `callback.slots.{s1..s4}` (the four call-back ranges the design hard-codes), `visit.submit` (replaces `contact.118` "Book on WhatsApp" — the request now files through the door), `form.cityPlaceholder.{hire,permit}`, `form.reply.whatsapp`, `wa.{main,jobseeker,partner,visitSite,visit,callback}` (the design's id-less WhatsApp prefills, now the fallback panels' intros and the deep links), `faq.{a3,a5}` (the two FAQ answers the package never gave ids to; `a3` takes `{hours}` = `contact.135` and `{replyHours}` = the `replySlaHours` metric, D17). Plus `sys.seo.contact.{title,description}` (W23: the package has no SEO strings for this page).
```

`docs/PRD.md` — Modify line 28 (the Contact row of the pages table). Replace the forms cell `Message form (\`INQUIRY\`), site-visit request (\`VISIT\`), callback (\`CALLBACK\`)` with:

```md
Topic enquiry → `contact` (`INQUIRY`: `topic` hire/permit/partner + `iAm` direct_employer/sourcing_partner, `subject` = the detail line, `message`, optional `city`; the job-seeker topic never files — WhatsApp explainer only, W3), callback → `callback` (`CALLBACK`: name + phone, `preferredTime` "day slot" keys, consent notice), book-a-visit → `visit` (`VISIT`: name/e-mail/phone, `office: antalya`, `preferredDate` ISO, `preferredTime`); site-visit request = WhatsApp deep link
```

Ledger (`.superpowers/` — git-ignored, never committed) — append the T7 line, filled from the Cycle 4 gate run:

```
T7 Contact — /iletisim, /en/contact — script (gz): <N> B / <N> B (ceiling 204,800; lazy line 194,560) — Lighthouse perf/a11y/BP/SEO: <p>/<a>/<b>/<s> per route — pixel: n/a (not a D27 harness page; Fable side-by-side) — deltas: door-backed forms replace WhatsApp mocks (contact.073/086–088 not rendered; contact.072 superseded by sys.form.consent.label; contact.118 → sys.contact.visit.submit); ≤700 px office tabs → stacked column; agencies phone card hidden when settings.partnershipsPhone is null — sys keys +31 — package ids used 158
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md && npm run verify` → green.

- [ ] **Step 5: Commit**

```bash
git add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md
git commit -m "docs(contact): SEO page row, contact_topic + placements, sys.contact namespace, PRD form mapping

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:**
- `docs/SEO.md` § Pages — the Contact row (title source `sys.seo.contact.*`, canonical `/contact`, JSON-LD BreadcrumbList + FAQPage + ContactPage, LCP slot `h1`); the table itself if this is the first page task.
- `docs/ANALYTICS.md` § Event schema — `contact_topic` "Fires on" cell + the "Contact page placements" paragraph (`page_cta` / `office_card`).
- `docs/CONTENT-MODEL.md` § The `sys.*` range — the `sys.contact.*` / `sys.seo.contact.*` bullet.
- `docs/PRD.md` line 28 — the Contact row's forms column: the door mapping of the three forms and the WhatsApp-only paths.

**Sys keys added:** (31)
`sys.seo.contact.title`, `sys.seo.contact.description`, `sys.contact.languages.tr`, `sys.contact.languages.en`, `sys.contact.languages.fr`, `sys.contact.languages.hi`, `sys.contact.languages.ru`, `sys.contact.channels.whatsapp`, `sys.contact.status.openNow`, `sys.contact.status.closedOpensAt`, `sys.contact.status.closedOpensTomorrow`, `sys.contact.status.closedOpensOn`, `sys.contact.status.opens`, `sys.contact.status.waWatched`, `sys.contact.status.waOff`, `sys.contact.callback.slots.s1`, `sys.contact.callback.slots.s2`, `sys.contact.callback.slots.s3`, `sys.contact.callback.slots.s4`, `sys.contact.visit.submit`, `sys.contact.form.cityPlaceholder.hire`, `sys.contact.form.cityPlaceholder.permit`, `sys.contact.form.reply.whatsapp`, `sys.contact.wa.main`, `sys.contact.wa.jobseeker`, `sys.contact.wa.partner`, `sys.contact.wa.visitSite`, `sys.contact.wa.visit`, `sys.contact.wa.callback`, `sys.contact.faq.a3`, `sys.contact.faq.a5`

**Package ids used:** 158 (every one verified present in `src/content/local/catalogue.json`) — first `contact.023`, last `home.221` (via `OfficeCard`); the page file itself reads `contact.023`…`contact.228` (excluding the chrome group 001–022, the footer group 126–149 except `contact.135`, and the unrendered `contact.047/048/072/073/086–088/118/156–160/217/220/221/222`), plus `home.192`/`home.221` through the `OfficeCard` block.

**Foundation gaps:** none — every consumed name exists in `produces-final.md` (Tasks 1–8) or WP1. Two things to CONFIRM on the preview rather than gaps: (a) `Section` must forward `data-testid` (else wrap in a `div` — noted in Cycle 3); (b) three `FormShell`s on one page ⇒ up to three Turnstile widgets — Task 2's `Turnstile` must render a second widget from the one script (a defect there is fixed in `src/forms/client/Turnstile.tsx`, not in this page).
