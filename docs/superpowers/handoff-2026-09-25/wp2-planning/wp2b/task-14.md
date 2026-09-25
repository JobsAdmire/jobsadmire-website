### Task 14: Forms end-to-end on staging — every form instance through the real door, the failure paths, `generate_lead`, and the I4/I5/I12 + PRD §5.12 contract finalised

**What this task is.** T1–T13 ported the thirteen page forms onto the WP2a forms kernel (`createFormAction` → `postForm` → `/tesekkurler?form=<key>` or the visitor fallback panel) and every page's e2e proved the *fallback* path deterministically (`OPS_API_URL` unset → `unauthorized` panel). Nothing has yet proved the *success* path against the real Operations door with a real Turnstile token, a real inquiry/applicant in Operations, a real autoresponder, and exactly one `generate_lead` in the dataLayer — the Gate A sentence in the spec (§5, "forms create inquiries end to end on `staging.jobsadmire.com` with real Turnstile … all 13–15 forms produce exactly one `generate_lead` and one submission"). This task is that proof, run by the controller with the owner, plus the four failure paths (replay, 429, 404, 5xx) exercised on purpose, plus the two docs that were left "once frozen" in WP1 and "joins this section in T14" in WP2a: the per-form field table in the website's `docs/INTEGRATIONS.md` I4 (v1.1) and the matching table in the Operations `docs/PRD.md` §5.12.

**Two code deltas, both small, both tested — the rest is protocol and docs.**

1. **`generate_lead` is fired by nobody today** (foundation gap, closed here). WP1's `ConversionPing` fires only `conversion`; WP2a's kernel fires none of the lead events (a server action cannot push to a browser `dataLayer`, and `redirect()` unmounts the `FormShell` before it could); the WP2b page contract says pages never fire it. The one place that knows a submission succeeded *in the browser* is the thank-you page, so `ConversionPing` pushes `generate_lead` immediately before `conversion`, under the same R37 once-per-session-per-form+path dedupe. The GA4 key event and the Ads trigger therefore have the same count by construction, which is what `docs/ANALYTICS.md` § Weekly three-way reconciliation assumes.
2. **`npm run door:smoke`** (`scripts/door-smoke.ts`): a headless, test-class probe of the door — ping, one valid body per form key, the deliberate replay, the deliberate 400, the unknown key, the inactive newsletter — printing a Markdown table for the ledger. Test-class submissions skip Turnstile when they carry no token (Ops X16), run full validation + dedupe + the row with `isTest: true` and a `dryRun` handler (no Inquiry, no mail), and never count toward the abuse trip. Its pure half (`scripts/door-smoke.lib.ts`) is the I4 table in executable form — every required field per key — and is the seed of T15's synthetic-lead cron.

**Binding facts this task is written against** (read before starting; they decide the protocol below):

- **Test-class posts never count toward the abuse trip** (`website-forms.service.ts:265-271`: `recordVerified` runs only when `!isTest` and the captcha outcome was `passed`), so the brief's "trip a form with 26 test-class posts" cannot work. The 429 is exercised by setting the trip marker Redis key by hand on the VPS (`website:abuse:tripped:<form>`, `website-alarms.logic.ts:64-70` — the ONE key set the door and `ping` read) for the `visit` form, 15 minutes, then deleting it. No `announced` marker is written, so the alarms cron says nothing and the second human gets no e-mail.
- **The Vercel project is `jobsadmirewebsite`** (`prj_Ze3FSd1XbvNbIe2OF2UQjRZ2ZAD6`, team `tech-admire-apps`), NOT the spec's second project `jobsadmire-web-v2` (`docs/DEPLOYMENT.md` § Two Vercel projects, spec §5 WP0 item 7): on 2026-09-20 the owner connected `JobsAdmire/jobsadmire-website` to the existing project. Its production deployment is still the frozen old site (`dpl_hRVuY1faCQe8fQ44sqmw4t82Rs7A`, `isRollbackCandidate: true`); every branch build — including two from `main` — carries `target: null` (preview). The branch alias for the WP2 branch is `https://jobsadmirewebsite-git-wp2-foundation-tech-admire-apps.vercel.app`, behind Vercel Authentication (302 → `vercel.com/sso-api`). `staging.jobsadmire.com` does not resolve yet (no DNS). The prerequisites in Cycle 3 turn this into the staging the spec assumes without touching production.
- **The door is dark right now** (`GET https://operations.jobsadmire.com/api/website/v1/ping` → 404 on 2026-09-20 21:30). The owner's message says the Turnstile secret and the second alert recipient are saved on Ops → Integrations; the flip (`WEBSITE_MODULE_ENABLED=true`, Ops `docs/DEPLOYMENT.md` § Flipping) is the owner's move and is a prerequisite of Cycle 4, not something this task performs on its own. Cycle 3 records the state it finds.
- **Live public openings on 2026-09-20:** `satis-temsilcisi-plasiyer-tr` (TR, Antalya) and `operations-manager-international-recruitment` (PK, Karachi) — neither `portfolioRequired`. So the careers standard mode and the PK `expectedSalary` mode are exercisable for real; the portfolio ("apply by e-mail", W3/W56) mode is not, and is recorded as verified by T11's unit/e2e only.
- **Real write-class submissions on staging file REAL inquiries/applicants in production Operations**, ring the bell of every `website.forms:VIEW` holder (the three sales roles + super-admins), e-mail the second human on every `WEBSITE_FORM_RECEIVED`, and autorespond to the e-mail address typed. That is the point (Gate A wants the whole chain), so the run uses a controller-owned mailbox, a `[T14]` marker in every `name`, and a cleanup list (Cycle 4 step 6). `newsletter` stays 404 (D14) and produces no subscriber.
- **`sessionStorage` dedupe (R37)**: a second success of the same form key on the same thank-you path in one browser session fires NO second `generate_lead`/`conversion`. Every instance below runs in a fresh incognito window; a same-key repeat inside one session is the documented behaviour, not a defect.

**Files:**

Create (website repo, `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website`, branch `wp2/foundation`):
- `src/analytics/ConversionPing.test.tsx` — the two lead events, once, same dedupe
- `scripts/door-smoke.lib.ts` — pure: per-key smoke bodies (= the I4 required sets), outcome classification, the ledger table
- `scripts/door-smoke.test.ts` — the lib against the I4 table (required fields, caps, classification, table shape)
- `scripts/door-smoke.ts` — the runner (`npm run door:smoke`; test token only)

Modify (website repo):
- `src/analytics/ConversionPing.tsx` (lines 27–31: the `track('conversion', …)` call becomes the `generate_lead` + `conversion` pair)
- `e2e/thank-you.spec.ts` (lines 5–11 helper, 13–30 first test: assert `generate_lead` beside `conversion`)
- `package.json` (line 19: add `"door:smoke": "tsx scripts/door-smoke.ts"` after `"redirects:build"`)
- `docs/ANALYTICS.md` (line 56 the `generate_lead` row; line 66 the "wired" paragraph as T0a/T0c left it; § Weekly three-way reconciliation, line 80)
- `docs/INTEGRATIONS.md` (I4 = the paragraph at line 44 after T0a's rewrite; I5 line 48; I12 line 76 — append the tables and the verification record)
- `docs/DEPLOYMENT.md` (§ Two Vercel projects lines 5–12: the dated reality; § Environment variables: the `OPS_WEBSITE_TEST_TOKEN` row T0a added — now consumed; a new § Staging alias and Deployment Protection)
- `docs/OPERATING.md` (§ Synthetic lead, line 42: `door:smoke` is the manual probe and the cron's seed; the post-flip `opsPing` note)
- `docs/PRD.md` (line 46: append the "verified end to end on staging" sentence)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (the T14 ledger block)

Create/Modify (Operations repo — docs only, a separate commit, pushed to `main` = a production deploy that rebuilds containers without a code change):
- `docs/PRD.md` §5.12: the "Wire contract field table (v1.1)" after T0f's catalog v1.1 table; §12.2: the T14 entry
- `apps/backend/src/modules/website/website-docs-guard.spec.ts`: one `it` pinning the table heading and the §12.2 entry

Test:
- `src/analytics/ConversionPing.test.tsx`, `scripts/door-smoke.test.ts` (Vitest); `e2e/thank-you.spec.ts` (Playwright); Ops `website-docs-guard.spec.ts` (jest)

**Interfaces:**

Consumes (exact names — WP1 code as it exists, WP2a as `produces-final.md` freezes it):
- `src/analytics/track.ts`: `track(event, params)`, `ALLOWED_PARAMS.generate_lead = ['form_key','page','locale']` (WP1).
- `src/analytics/forms.ts`: `FORM_KEYS`, `FormKey` (WP1).
- `src/forms/consent.ts`: `CONSENT_VERSION = 'kvkk-2026-09'` (T0a).
- `src/forms/wire.ts`: `WireFields`, `WireEnvelope`, `buildEnvelope({ locale, fields, captchaToken?, honeypot?, sourcePath? })` (T0a) — the smoke script builds its envelope with it so the wire shape can never drift from the kernel's.
- `src/forms/types.ts`: `PostFormOk`, `PostFormResult` kinds (`ok | invalid | captcha | off | tripped | unauthorized | unavailable`) and `FormFallbackKind` (T0a) — the smoke classifier mirrors `postForm`'s status map (`src/forms/post.ts` `mapResponse`: 200 → ok, 401 → unauthorized, 403 → captcha, 404 → off, 429 → tripped, ≥500 → unavailable, else invalid).
- `src/forms/client/FallbackPanel.tsx`: `data-testid="form-fallback"`, `data-kind={kind}`; WhatsApp button `variant="primary"` for `tripped | unavailable | unauthorized | off`, `secondary` otherwise (T0a) — `Button` primary face is `bg-blue-safe text-white` (`src/design/primitives/Button.tsx:10`).
- `src/forms/client/FormShell.tsx`: `data-form-key={formKey}` on every form, `data-testid={testId}`; `Turnstile` host `data-testid="turnstile"` (T0a).
- `src/app/api/site-health/route.ts` body `{ ok, checks, ops: { state, latencyMs, captcha, trippedForms }, formBeacons, … }` (T0a `pingOps`/`OpsPing`).
- Page forms and their door keys (T1–T13, the instance map in Cycle 4): `hire-form-quick`/`hire-form-full` (T2), `contact-enquiry-form`/`contact-callback-form`/`contact-visit-form` (T7), `#quote` on the calculator (T3); every other instance is located by `form[data-form-key="<key>"]` inside its section id (`#proposal`, `#tracks`, `#pool`, `#report`, the careers detail's apply section).
- Operations door as built (`operations-door-contract-as-built.md`, produces-final § Task 8): `POST ${OPS_API_URL}/api/website/v1/forms/:formKey`, `GET …/ping`, `POST …/uploads/fraud-evidence`, `POST /api/careers/upload-cv`, `GET /api/careers/openings`; catalog v1.0 + v1.1 (`city`, `track`, `topic`, `portfolioUrl`); dedupe `(formKey, requestHash, hourBucket)`; `WEBSITE_ABUSE_TRIP_THRESHOLD = 25`; trip keys `website:abuse:{count,tripped,announced}:<form>`; inbox `/admin/website/inbox?row=<id>`; Integrations `/admin/website/integrations`; flip recipe in Ops `docs/DEPLOYMENT.md` § Flipping.
- Ops docs guard: `apps/backend/src/modules/website/website-docs-guard.spec.ts` (`prd` constant at line 72; T0f appended one `it` before the final `});`).

Produces:
- `ConversionPing` fires `generate_lead` + `conversion` (T15's Gate A checklist reads "exactly one `generate_lead` per submission" against this).
- `scripts/door-smoke.lib.ts` exports `SMOKE_KEYS`, `smokeFields(formKey, stamp, extra?)`, `smokeEnvelope(formKey, locale, stamp, fields?)`, `classifySmoke(formKey, status, body)`, `expectedSmokeKind(formKey)`, `formatSmokeTable(rows)` — T15's synthetic-lead cron (`/api/cron/synthetic-lead`) builds its body with `smokeFields('hire', stamp)` and never re-encodes the catalog.
- `npm run door:smoke` — the manual door probe (`docs/OPERATING.md` § Synthetic lead).
- `docs/INTEGRATIONS.md` I4 field table + instance map = the website-side contract of record; Ops `docs/PRD.md` §5.12 "Wire contract field table (v1.1)" = the Ops-side mirror (both pinned: the Ops one by the docs guard, the website one by `scripts/door-smoke.test.ts`'s required-set table).

---

#### Cycle 1 — `generate_lead` on the thank-you page (foundation gap closed)

- [ ] **Step 1: Write the failing test**

`src/analytics/ConversionPing.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryStorage } from '@/test/storage';
import { ConversionPing } from './ConversionPing';

// R35: the `page` param is the real URL, so the component reads next/navigation's pathname.
vi.mock('next/navigation', () => ({ usePathname: () => '/tesekkurler' }));

type Entry = Record<string, unknown>;
const layer = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;
const events = (name: string) => layer().filter((e) => e.event === name);

describe('ConversionPing (D13 lead events on the thank-you page)', () => {
  beforeEach(() => {
    (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
    // Node ≥23 ships a stub `sessionStorage` without the Storage API (src/test/storage.ts).
    Object.defineProperty(window, 'sessionStorage', { value: memoryStorage(), configurable: true });
  });

  it('pushes exactly one generate_lead and one conversion, generate_lead first, same params', () => {
    render(<ConversionPing formKey="hire" locale="tr" />);
    expect(events('generate_lead')).toHaveLength(1);
    expect(events('conversion')).toHaveLength(1);
    const expected = { form_key: 'hire', page: '/tesekkurler', locale: 'tr' };
    expect(events('generate_lead')[0]).toEqual({ event: 'generate_lead', ...expected });
    expect(events('conversion')[0]).toEqual({ event: 'conversion', ...expected });
    // GA4's key event before the Ads trigger — the GTM container's conversion tag fires on
    // `conversion`, and both must exist by the time it does.
    const names = layer().map((e) => e.event);
    expect(names.indexOf('generate_lead')).toBeLessThan(names.indexOf('conversion'));
  });

  it('dedupes both events per session per form+path (R37) — a remount fires neither again', () => {
    const first = render(<ConversionPing formKey="contact" locale="en" />);
    first.unmount();
    render(<ConversionPing formKey="contact" locale="en" />);
    expect(events('generate_lead')).toHaveLength(1);
    expect(events('conversion')).toHaveLength(1);
    expect(window.sessionStorage.getItem('ja_conv:contact:/tesekkurler')).toBe('1');
  });

  it('a different form key in the same session still counts', () => {
    render(<ConversionPing formKey="hire" locale="tr" />);
    render(<ConversionPing formKey="workers" locale="tr" />);
    expect(events('generate_lead').map((e) => e.form_key)).toEqual(['hire', 'workers']);
    expect(events('conversion').map((e) => e.form_key)).toEqual(['hire', 'workers']);
  });

  it('fires (rather than loses the lead) when storage throws', () => {
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });
    render(<ConversionPing formKey="calculator" locale="en" />);
    expect(events('generate_lead')).toHaveLength(1);
    expect(events('conversion')).toHaveLength(1);
  });
});
```

`e2e/thank-you.spec.ts` — Modify lines 5–11 (the helpers) and 13–30 (the first test) to:

```ts
const dataLayer = (page: import('@playwright/test').Page) =>
  page.evaluate(
    () => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? [],
  ) as Promise<DataLayerEntry[]>;

const eventsFor = async (page: import('@playwright/test').Page, event: string, formKey: string) =>
  (await dataLayer(page)).filter((e) => e.event === event && e.form_key === formKey);
const conversions = (page: import('@playwright/test').Page, formKey: string) =>
  eventsFor(page, 'conversion', formKey);
const leads = (page: import('@playwright/test').Page, formKey: string) =>
  eventsFor(page, 'generate_lead', formKey);

test('the Turkish conversion page is noindex and fires generate_lead + conversion once', async ({
  page,
}) => {
  const res = await page.goto('/tesekkurler?form=hire');
  expect(res?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('h1')).toHaveCount(1);

  await expect.poll(async () => conversions(page, 'hire')).toHaveLength(1);
  expect(await leads(page, 'hire')).toHaveLength(1);
  expect((await conversions(page, 'hire'))[0]).toMatchObject({
    page: '/tesekkurler',
    locale: 'tr',
  });
  expect((await leads(page, 'hire'))[0]).toMatchObject({ page: '/tesekkurler', locale: 'tr' });

  // R37: a reload (or a back-forward restore) must not re-count the same lead — the
  // per-session key survives the navigation, and the fresh dataLayer stays empty of both.
  await page.reload();
  await page.waitForTimeout(300);
  expect(await conversions(page, 'hire')).toHaveLength(0);
  expect(await leads(page, 'hire')).toHaveLength(0);
});
```

(The remaining three tests in the file are unchanged; the third one — "an unknown form key … without firing a conversion" — gains one line after its existing `expect`: `expect((await dataLayer(page)).filter((e) => e.event === 'generate_lead')).toHaveLength(0);`.)

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website && npx vitest run src/analytics/ConversionPing.test.tsx
```
Expected: 3 of 4 fail — `expected [] to have a length of 1` on `events('generate_lead')` (the component pushes only `conversion` today); the "different form key" case fails on `['hire','workers']` vs `[]`.

- [ ] **Step 3: Implement**

`src/analytics/ConversionPing.tsx` — Modify lines 27–31 (from `const k = …` through `sessionStorage.setItem(k, '1')`) so the effect body reads:

```tsx
    const k = `ja_conv:${formKey}:${pathname}`;
    try {
      if (sessionStorage.getItem(k)) return;
    } catch {
      // storage blocked (private mode): no dedupe available — fire rather than lose the lead.
    }
    // Two events, one trigger, one dedupe (T14): `generate_lead` is GA4's key event for a lead
    // form and what docs/ANALYTICS.md's weekly three-way reconciliation counts; `conversion` is
    // the GTM trigger of the Ads conversion tag. Neither can be fired by the server action
    // (no dataLayer there) nor by the FormShell (redirect() unmounts it), so the thank-you page
    // — the only place the browser learns a submission succeeded — fires both, key event first.
    const params = { form_key: formKey, page: pathname, locale };
    track('generate_lead', params);
    track('conversion', params);
    try {
      sessionStorage.setItem(k, '1');
    } catch {
      /* private mode */
    }
```

Also update the component's doc comment (lines 7–13) first sentence to: `/** The two lead events, fired on arrival at \`/tesekkurler?form=<key>\` (D13) — the single navigation every form's success path lands on: \`generate_lead\` (GA4 key event) then \`conversion\` (the Ads trigger). Renders nothing; carries only the form key, the path and the locale, never anything the visitor typed.`

`docs/ANALYTICS.md`:

- Modify line 56 (the `generate_lead` row) to: `` | `generate_lead`   | Arrival at `/tesekkurler?form=<key>` — the only navigation a successful submission makes (D13); pushed by `ConversionPing` immediately before `conversion`, same once-per-session dedupe (R37, T14) | `form_key`, `page`, `locale`          | ``
- Modify the "wired" paragraph at line 66 (as T0a/T0c left it — it begins `**WP1 wired exactly one of these seven events` or `**Wired today: \`conversion\``; find it with `grep -n "Wired today\|WP1 wired" docs/ANALYTICS.md`): replace the clause that lists `generate_lead` among the unfired events with: "`generate_lead` is wired since T14: `ConversionPing` pushes it beside `conversion` on the thank-you page, so a GA4 lead and an Ads conversion can never disagree by construction; `calculator_use` lands with T3, `language_switch` with the switcher work; page events join the allowlist only with enum-key params (W12)."
- Modify line 80 (§ Weekly three-way reconciliation) — append: "Two known, accepted skews: (1) `generate_lead` is deduped per browser session per form key (R37), so a visitor who sends two *different* requests through the same form in one session is one lead event and two submissions; (2) the door dedupes *identical* bodies within a clock hour (`replayed: true`), which the site treats as success, so a visitor who double-submits the same body is one submission and (in a fresh session) could be two lead events. Both are visitor-rare; neither is a wiring fault. Verified end to end on staging in T14 (`docs/INTEGRATIONS.md` I4 § Verification record)."

- [ ] **Step 4: Run tests + npm run verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website && npx vitest run src/analytics && npm run verify
```
Expected: `ConversionPing.test.tsx` 4 passed; `track.test.ts` unchanged; verify green (tsc, eslint, prettier — run `npx prettier --write docs/ANALYTICS.md src/analytics e2e/thank-you.spec.ts` first if the table row reflows).

- [ ] **Step 5: Commit**

```bash
git add src/analytics/ConversionPing.tsx src/analytics/ConversionPing.test.tsx e2e/thank-you.spec.ts docs/ANALYTICS.md
git commit -m "feat(analytics): generate_lead fires beside conversion on the thank-you page, same R37 dedupe (T14)

Nobody fired generate_lead: WP1's ConversionPing pushed only conversion, a
server action has no dataLayer and redirect() unmounts the FormShell. The
thank-you page is the one place the browser learns a submission succeeded,
so it pushes GA4's key event first and the Ads trigger second, once per
session per form+path. docs/ANALYTICS.md: the row, the wiring paragraph and
the two accepted reconciliation skews.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — `npm run door:smoke`: the test-class door probe and the I4 table as code

- [ ] **Step 1: Write the failing test**

`scripts/door-smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { FORM_KEYS, type FormKey } from '../src/analytics/forms';
import { CONSENT_VERSION } from '../src/forms/consent';
import {
  classifySmoke,
  expectedSmokeKind,
  formatSmokeTable,
  SMOKE_KEYS,
  smokeEnvelope,
  smokeFields,
  type SmokeRow,
} from './door-smoke.lib';

/** docs/INTEGRATIONS.md I4 (v1.1) — the REQUIRED field per key. A key missing here or a
 *  field missing from `smokeFields` is a 400 at the door, and this table is what the doc
 *  table is copied from. Keep the two in step. */
const REQUIRED: Record<FormKey, readonly string[]> = {
  hire: ['name', 'company', 'email', 'phone'],
  contact: ['name', 'email', 'message'],
  partner: ['name', 'company', 'email', 'phone', 'country'],
  workers: ['name', 'company', 'email', 'phone'],
  callback: ['name', 'phone'],
  visit: ['name', 'email', 'phone'],
  calculator: ['name', 'email'],
  careers: ['openingSlug', 'cvKey', 'name', 'email', 'phone', 'country'],
  fraud: ['description'],
  newsletter: ['email'],
};

/** Length caps of every field the smoke bodies send (catalog v1.0 + v1.1). */
const CAPS: Record<string, number> = {
  name: 120, company: 200, email: 254, phone: 40, country: 2, iAm: 40, sector: 120, roleNeeded: 200,
  headcount: 10, startWhen: 120, message: 5000, city: 120, subject: 200, topic: 40, candidatesPerYear: 20,
  trades: 500, licence: 200, track: 40, trade: 200, preferredTime: 120, office: 120, preferredDate: 40,
  durationMonths: 10, estimateSummary: 2000, openingSlug: 200, cvKey: 300, language: 300,
  expectedSalary: 20, expectedSalaryCurrency: 3, coverLetter: 5000, portfolioUrl: 500,
  reporterName: 120, reporterEmail: 254, reporterPhone: 40, description: 5000, suspectName: 200, suspectContact: 300,
};

describe('door-smoke.lib — the I4 table as code', () => {
  it('covers every FORM_KEY once, in FORM_KEYS order', () => {
    expect([...SMOKE_KEYS]).toEqual([...FORM_KEYS]);
  });

  it('every smoke body carries every required field of its key, non-empty, under its cap', () => {
    for (const key of FORM_KEYS) {
      const fields = smokeFields(key, '20260921T120000Z', { cvKey: 'careers-cv/smoke.pdf', openingSlug: 'some-opening' });
      for (const req of REQUIRED[key]) {
        expect({ key, req, present: typeof fields[req] === 'string' && fields[req].length > 0 }).toEqual({ key, req, present: true });
      }
      for (const [name, value] of Object.entries(fields)) {
        const cap = CAPS[name];
        expect({ key, name, capped: cap !== undefined }).toEqual({ key, name, capped: true });
        if (typeof value === 'string') expect(value.length).toBeLessThanOrEqual(cap);
      }
    }
  });

  it('stamps the body so two runs in one hour never replay (sourcePath is not hashed — a field must vary)', () => {
    const a = smokeFields('hire', 'A');
    const b = smokeFields('hire', 'B');
    expect(a).not.toEqual(b);
    expect(JSON.stringify(a)).toContain('A');
  });

  it('sends stable option keys, ISO-2 upper-case countries and ≥ 8-digit phones', () => {
    expect(smokeFields('hire', 's').iAm).toBe('direct_employer');
    expect(smokeFields('hire', 's').sector).toBe('factory');
    expect(smokeFields('partner', 's').country).toMatch(/^[A-Z]{2}$/);
    expect(smokeFields('partner', 's').track).toBe('sourcing');
    expect(smokeFields('contact', 's').topic).toBe('hire');
    expect((smokeFields('hire', 's').phone as string).replace(/\D/g, '').length).toBeGreaterThanOrEqual(8);
    expect(smokeFields('fraud', 's').description).toHaveLength(60);
  });

  it('careers needs the caller to supply a real cvKey and openingSlug', () => {
    expect(() => smokeFields('careers', 's')).toThrow(/cvKey/);
    expect(smokeFields('careers', 's', { cvKey: 'careers-cv/x.pdf', openingSlug: 'o' }).cvKey).toBe('careers-cv/x.pdf');
  });

  it('the envelope is the kernel’s wire shape with the site-wide consent version', () => {
    const env = smokeEnvelope('callback', 'en', 'S1');
    expect(env).toEqual({
      locale: 'en',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/door-smoke/S1',
      fields: smokeFields('callback', 'S1'),
    });
    expect(Object.keys(env).sort()).toEqual(['consentVersion', 'fields', 'locale', 'sourcePath']);
  });

  it('classifies the door’s answers like postForm does', () => {
    const ok = { data: { id: 'sub_1', formKey: 'hire', status: 'HANDLED', isTest: true, replayed: false, captchaDegraded: false, error: null } };
    expect(classifySmoke('hire', 200, ok)).toMatchObject({ kind: 'ok', doorStatus: 'HANDLED', isTest: true, replayed: false, id: 'sub_1' });
    expect(classifySmoke('hire', 200, { ...ok, data: { ...ok.data, replayed: true } })).toMatchObject({ kind: 'ok', replayed: true });
    expect(classifySmoke('hire', 200, { data: { ...ok.data, status: 'FAILED', error: 'nope' } })).toMatchObject({ kind: 'ok', doorStatus: 'FAILED', message: 'nope' });
    expect(classifySmoke('hire', 400, { message: 'Invalid form fields', errors: ['country must be a two-letter ISO code'] })).toMatchObject({ kind: 'invalid', errors: ['country must be a two-letter ISO code'] });
    expect(classifySmoke('hire', 401, { message: 'Invalid website token.' })).toMatchObject({ kind: 'unauthorized' });
    expect(classifySmoke('hire', 403, { message: 'Captcha verification failed. Please retry.' })).toMatchObject({ kind: 'captcha' });
    expect(classifySmoke('newsletter', 404, { message: 'This form is not accepting submissions.' })).toMatchObject({ kind: 'off', message: 'This form is not accepting submissions.' });
    expect(classifySmoke('hire', 404, null)).toMatchObject({ kind: 'off' });
    expect(classifySmoke('visit', 429, { statusCode: 429, message: 'paused', reason: 'tripped', fallback: 'whatsapp' })).toMatchObject({ kind: 'tripped', fallback: 'whatsapp' });
    expect(classifySmoke('hire', 502, null)).toMatchObject({ kind: 'unavailable' });
    expect(classifySmoke('hire', 200, { html: true })).toMatchObject({ kind: 'unavailable' }); // R28: a 200 that is not the door
  });

  it('expects ok everywhere except the D14-inactive newsletter', () => {
    for (const key of FORM_KEYS) expect(expectedSmokeKind(key)).toBe(key === 'newsletter' ? 'off' : 'ok');
  });

  it('formats a Markdown table the ledger can paste, with a pass column', () => {
    const rows: SmokeRow[] = [
      { formKey: 'hire', http: 200, kind: 'ok', doorStatus: 'HANDLED', isTest: true, replayed: false, id: 'sub_1', message: null, errors: [], fallback: null, expected: 'ok', pass: true },
      { formKey: 'newsletter', http: 404, kind: 'off', doorStatus: null, isTest: null, replayed: null, id: null, message: 'This form is not accepting submissions.', errors: [], fallback: null, expected: 'off', pass: true },
    ];
    const table = formatSmokeTable(rows);
    expect(table.split('\n')[0]).toBe('| form | http | kind | door status | isTest | replayed | id | message | pass |');
    expect(table).toContain('| hire | 200 | ok | HANDLED | true | false | sub_1 |  | ✓ |');
    expect(table).toContain('| newsletter | 404 | off | — | — | — | — | This form is not accepting submissions. | ✓ |');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run scripts/door-smoke.test.ts
```
Expected: the suite fails to load — `Cannot find module './door-smoke.lib'`.

- [ ] **Step 3: Implement**

`scripts/door-smoke.lib.ts`:

```ts
/**
 * The pure half of `npm run door:smoke` (T14) and the body builder T15's synthetic-lead cron
 * reuses. One valid body per form key = docs/INTEGRATIONS.md I4's REQUIRED sets, as code:
 * a 400 from the door means the table is wrong, not the door. Values are stable option KEYS
 * (W3), ISO-2 upper-case countries (W40), ≥ 8-digit phones — exactly what the pages send.
 *
 * No `server-only` here (unit-tested, like src/content/pure.ts — R2); the runner carries the
 * token and is never imported by src/**.
 */
import { FORM_KEYS, type FormKey } from '../src/analytics/forms';
import { CONSENT_VERSION } from '../src/forms/consent';
import { buildEnvelope, type WireEnvelope, type WireFields } from '../src/forms/wire';
import type { Locale } from '../src/i18n/routing';

export const SMOKE_KEYS: readonly FormKey[] = FORM_KEYS;

export type SmokeKind = 'ok' | 'invalid' | 'captcha' | 'off' | 'tripped' | 'unauthorized' | 'unavailable';

export type SmokeRow = {
  formKey: string;
  http: number;
  kind: SmokeKind;
  doorStatus: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM' | null;
  isTest: boolean | null;
  replayed: boolean | null;
  id: string | null;
  message: string | null;
  errors: string[];
  fallback: string | null;
  expected: SmokeKind;
  pass: boolean;
};

export type SmokeExtra = { cvKey?: string; openingSlug?: string };

const NAME = (stamp: string) => `[door-smoke ${stamp}]`;
const EMAIL = 'door-smoke@jobsadmire.com';
const PHONE = '+905000000000';
const MESSAGE = (stamp: string) => `Synthetic test-class submission ${stamp} — no action needed.`;

/** One valid, catalog-conformant body per key. `stamp` rides in `name`/`message` so two runs
 *  inside one clock hour never dedupe onto the same row (`sourcePath` is NOT hashed). */
export function smokeFields(formKey: FormKey, stamp: string, extra: SmokeExtra = {}): WireFields {
  const name = NAME(stamp);
  switch (formKey) {
    case 'hire':
      return { name, company: 'Door Smoke Ltd', email: EMAIL, phone: PHONE, country: 'TR', iAm: 'direct_employer', sector: 'factory', roleNeeded: 'welder', headcount: '5', startWhen: 'm1', city: 'Antalya', message: MESSAGE(stamp) };
    case 'contact':
      return { name, email: EMAIL, phone: PHONE, company: 'Door Smoke Ltd', country: 'TR', iAm: 'direct_employer', topic: 'hire', subject: 'door smoke', city: 'Antalya', message: MESSAGE(stamp) };
    case 'partner':
      return { name, company: 'Door Smoke Sourcing', email: EMAIL, phone: PHONE, country: 'PK', track: 'sourcing', candidatesPerYear: '50', trades: 'welder, cnc', licence: 'n/a', city: 'Karachi', message: MESSAGE(stamp) };
    case 'workers':
      return { name, company: 'Door Smoke Ltd', email: EMAIL, phone: PHONE, country: 'TR', iAm: 'direct_employer', trade: 'welder', headcount: '3', startWhen: 'm1', city: 'Antalya', message: MESSAGE(stamp) };
    case 'callback':
      return { name, phone: PHONE, email: EMAIL, preferredTime: 'weekday am', topic: 'door smoke', city: 'Antalya' };
    case 'visit':
      return { name, company: 'Door Smoke Ltd', email: EMAIL, phone: PHONE, office: 'antalya', preferredDate: '2026-10-01', preferredTime: 'am', message: MESSAGE(stamp) };
    case 'calculator':
      return { name, email: EMAIL, phone: PHONE, company: 'Door Smoke Ltd', country: 'TR', headcount: '10', trade: 'welder', durationMonths: '12', estimateSummary: `door smoke ${stamp}`, message: MESSAGE(stamp) };
    case 'careers': {
      if (!extra.cvKey || !extra.openingSlug) throw new Error('careers smoke needs { cvKey, openingSlug } — upload a PDF and read an opening first');
      return { openingSlug: extra.openingSlug, cvKey: extra.cvKey, name, email: EMAIL, phone: PHONE, country: 'TR', city: 'Antalya', language: 'tr,en', coverLetter: MESSAGE(stamp) };
    }
    case 'fraud':
      // description: min 20 — a fixed 60-char sentence + the stamp in reporterName only.
      return { reporterName: name, reporterEmail: EMAIL, reporterPhone: PHONE, description: 'Synthetic test-class fraud report; no evidence; ignore me.'.padEnd(60, '.'), suspectName: 'nobody', suspectContact: 'none' };
    case 'newsletter':
      return { email: EMAIL, name };
  }
}

export function smokeEnvelope(formKey: FormKey, locale: Locale, stamp: string, fields?: WireFields): WireEnvelope {
  return buildEnvelope({ locale, fields: fields ?? smokeFields(formKey, stamp), sourcePath: `/door-smoke/${stamp}` });
}

/** What a healthy door answers a test-class body: `ok` everywhere, `off` for the inactive newsletter (D14). */
export function expectedSmokeKind(formKey: FormKey): SmokeKind {
  return formKey === 'newsletter' ? 'off' : 'ok';
}

const OK_STATUSES = new Set(['RECEIVED', 'HANDLED', 'FAILED', 'SPAM']);
const str = (v: unknown): string | null => (typeof v === 'string' ? v : null);

/** postForm's status map (src/forms/post.ts `mapResponse`), without the retry. */
export function classifySmoke(formKey: string, http: number, body: unknown): Omit<SmokeRow, 'expected' | 'pass'> {
  const base = { formKey, http, doorStatus: null, isTest: null, replayed: null, id: null, message: null, errors: [] as string[], fallback: null };
  const obj = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const data = (typeof obj.data === 'object' && obj.data !== null ? obj.data : null) as Record<string, unknown> | null;
  if (http === 200) {
    if (data && typeof data.id === 'string' && typeof data.status === 'string' && OK_STATUSES.has(data.status)) {
      return { ...base, kind: 'ok', doorStatus: data.status as SmokeRow['doorStatus'], isTest: data.isTest === true, replayed: data.replayed === true, id: data.id, message: str(data.error) };
    }
    return { ...base, kind: 'unavailable', message: 'malformed 200 (not the door)' };
  }
  if (http === 401) return { ...base, kind: 'unauthorized', message: str(obj.message) };
  if (http === 403) return { ...base, kind: 'captcha', message: str(obj.message) };
  if (http === 404) return { ...base, kind: 'off', message: str(obj.message) };
  if (http === 429) return { ...base, kind: 'tripped', message: str(obj.message), fallback: str(obj.fallback) };
  if (http >= 500) return { ...base, kind: 'unavailable', message: str(obj.message) };
  const errors = Array.isArray(obj.errors) ? obj.errors.filter((e): e is string => typeof e === 'string') : [];
  return { ...base, kind: 'invalid', message: str(obj.message) ?? 'rejected', errors };
}

const cell = (v: unknown): string => (v === null || v === undefined || v === '' ? (v === '' ? '' : '—') : String(v)).replace(/\|/g, '\\|');

export function formatSmokeTable(rows: SmokeRow[]): string {
  const head = '| form | http | kind | door status | isTest | replayed | id | message | pass |';
  const sep = '|---|---|---|---|---|---|---|---|---|';
  const body = rows.map((r) =>
    `| ${r.formKey} | ${r.http} | ${r.kind} | ${cell(r.doorStatus)} | ${cell(r.isTest)} | ${cell(r.replayed)} | ${cell(r.id)} | ${r.message ?? ''}${r.errors.length ? ` (${r.errors.join('; ')})` : ''} | ${r.pass ? '✓' : '✗'} |`,
  );
  return [head, sep, ...body].join('\n');
}
```

`scripts/door-smoke.ts`:

```ts
/**
 * `npm run door:smoke` — the headless, TEST-CLASS probe of the Operations door (T14; the
 * manual form of T15's synthetic lead). Refuses to run with a write token: a smoke that files
 * real inquiries is the incident it exists to prevent.
 *
 *   OPS_API_URL=https://operations.jobsadmire.com OPS_WEBSITE_TEST_TOKEN=wst_… npm run door:smoke [-- --careers] [--json]
 *
 * What it does, in order: GET /ping → one POST per form key (test class: full validation,
 * dedupe, a row with isTest:true, dryRun handler, no captcha when no token — Ops X16) → the
 * deliberate replay (hire, same body twice → replayed:true) → the deliberate 400 (hire with
 * country 'Turkey') → the unknown key → prints the Markdown table for the ledger. `--careers`
 * also uploads a 1-page PDF to the public /api/careers/upload-cv (it leaves one orphan object
 * in careers-cv/ per run — off by default). Exit 1 when any row's `pass` is false.
 */
import { FORM_KEYS, type FormKey } from '../src/analytics/forms';
import { classifySmoke, expectedSmokeKind, formatSmokeTable, smokeEnvelope, smokeFields, type SmokeRow } from './door-smoke.lib';

const MIN_TOKEN = 20;
const TIMEOUT_MS = 8000;

function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

async function main(): Promise<number> {
  const args = new Set(process.argv.slice(2));
  const base = env('OPS_API_URL')?.replace(/\/+$/, '');
  const token = env('OPS_WEBSITE_TEST_TOKEN');
  if (!base) throw new Error('OPS_API_URL is required');
  if (!token || token.length < MIN_TOKEN) throw new Error('OPS_WEBSITE_TEST_TOKEN (wst_…) is required — never the write token');
  if (token.startsWith('wsw_')) throw new Error('refusing to smoke with a write-class token (wsw_…): it would file real inquiries');
  if (env('OPS_WEBSITE_WRITE_TOKEN') === token) throw new Error('OPS_WEBSITE_TEST_TOKEN equals OPS_WEBSITE_WRITE_TOKEN — refusing');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const call = async (path: string, init?: RequestInit): Promise<{ status: number; body: unknown }> => {
    const res = await fetch(`${base}${path}`, { ...init, headers: { ...headers, ...(init?.headers ?? {}) }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body: unknown = await res.json().catch(() => null);
    return { status: res.status, body };
  };
  const post = (key: string, envelope: unknown) => call(`/api/website/v1/forms/${key}`, { method: 'POST', body: JSON.stringify(envelope) });

  // 1. ping — the door's own facts, printed verbatim (no secret in them).
  const ping = await call('/api/website/v1/ping');
  console.log(`ping ${ping.status} ${JSON.stringify(ping.body)}`);
  if (ping.status === 404) console.log('door is DARK (module flag off or unknown route) — every form row below will be `off`');

  const stamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
  const rows: SmokeRow[] = [];
  const record = (formKey: string, http: number, body: unknown, expected: SmokeRow['expected'], label = formKey) => {
    const c = classifySmoke(formKey, http, body);
    const pass = c.kind === expected;
    rows.push({ ...c, formKey: label, expected, pass });
  };

  // 2. one body per key.
  for (const key of FORM_KEYS) {
    if (key === 'careers' && !args.has('--careers')) continue;
    let extra: { cvKey?: string; openingSlug?: string } = {};
    if (key === 'careers') {
      const openings = await call('/api/careers/openings');
      const first = Array.isArray((openings.body as { data?: unknown[] })?.data) ? ((openings.body as { data: Array<{ slug?: string }> }).data[0]?.slug ?? null) : null;
      if (!first) { console.log('careers: no public opening — skipped'); continue; }
      const pdf = new Blob([`%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n`], { type: 'application/pdf' });
      const form = new FormData();
      form.append('file', pdf, 'door-smoke.pdf');
      const up = await fetch(`${base}/api/careers/upload-cv`, { method: 'POST', body: form, signal: AbortSignal.timeout(TIMEOUT_MS) });
      const upBody = (await up.json().catch(() => null)) as { data?: { key?: string } } | null;
      if (!upBody?.data?.key) { console.log(`careers: upload-cv answered ${up.status} — skipped`); continue; }
      extra = { cvKey: upBody.data.key, openingSlug: first };
    }
    const r = await post(key, smokeEnvelope(key as FormKey, 'en', stamp, smokeFields(key as FormKey, stamp, extra)));
    record(key, r.status, r.body, expectedSmokeKind(key as FormKey));
  }

  // 3. replay: identical body twice inside one clock hour → the second answers replayed:true.
  const replayBody = smokeEnvelope('hire', 'tr', `${stamp}-replay`);
  const first = await post('hire', replayBody);
  const second = await post('hire', replayBody);
  record('hire', first.status, first.body, 'ok', 'hire (replay #1)');
  const c2 = classifySmoke('hire', second.status, second.body);
  rows.push({ ...c2, formKey: 'hire (replay #2)', expected: 'ok', pass: c2.kind === 'ok' && c2.replayed === true && c2.id === classifySmoke('hire', first.status, first.body).id });

  // 4. the deliberate 400 — the catalog's own message, proving the `invalid` mapping.
  const bad = await post('hire', smokeEnvelope('hire', 'en', `${stamp}-bad`, { ...smokeFields('hire', `${stamp}-bad`), country: 'Turkey' }));
  record('hire', bad.status, bad.body, 'invalid', 'hire (country: Turkey)');

  // 5. the unknown key → 404 'Unknown form.' (same `off` kind as a dark door).
  const unknown = await post('nope', smokeEnvelope('hire', 'en', `${stamp}-unknown`));
  record('nope', unknown.status, unknown.body, 'off', 'nope (unknown key)');

  const table = formatSmokeTable(rows);
  console.log(args.has('--json') ? JSON.stringify({ base, stamp, ping: ping.body, rows }, null, 2) : `\n${table}\n`);
  return rows.every((r) => r.pass) ? 0 : 1;
}

main().then((code) => process.exit(code)).catch((err) => { console.error(String(err?.message ?? err)); process.exit(2); });
```

`package.json` — Modify line 19 (`"redirects:build": "tsx scripts/build-redirects.ts"`) to add, after it:

```json
    "redirects:build": "tsx scripts/build-redirects.ts",
    "door:smoke": "tsx scripts/door-smoke.ts"
```

(If T0d/T0e already appended `assets:*`, `gate:launch`, `js-size`, `pixel` after `redirects:build`, add `door:smoke` as the last script instead — W42: additive edits only.)

`docs/OPERATING.md` — Modify line 42 (§ Synthetic lead, the paragraph beginning `**Not yet built**`): replace `**Not yet built** — no cron config exists in \`vercel.json\` and no form handlers exist yet to exercise (\`docs/ARCHITECTURE.md\` § Forms flow).` with `**The cron is not yet built** (T15 adds the \`vercel.json\` schedule); **the probe exists**: \`npm run door:smoke\` (\`scripts/door-smoke.ts\`, T14) posts one test-class body per form key to the real door — ping, ten keys, the deliberate replay, the deliberate 400, the unknown key — and prints the Markdown table the ledger keeps. It refuses a write-class token. Test-class rows appear in the Ops inbox under the *test* filter (\`isTest: true\`), run their handler as a dry run and skip Turnstile when they carry no token (Ops X16), so a green smoke proves the door up to the handler and nothing about the visitor's captcha path — the browser run in T14 / Gate A proves that.` Keep the rest of the paragraph.

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx vitest run scripts/door-smoke.test.ts && npm run verify
```
Expected: 9 passed; verify green (`scripts/**` is inside `tsconfig`'s `include` as today's `scripts/*.ts` are; eslint's `no-restricted-imports` rule does not fire — the lib imports `src/analytics/forms`, `src/forms/consent`, `src/forms/wire` and `src/i18n/routing`, none of them `content/local` or `design-package`).

Then, against the real door (does not need the flip — a dark door answers `off` on every row and the script says so):

```bash
OPS_API_URL=https://operations.jobsadmire.com OPS_WEBSITE_TEST_TOKEN='<wst_… from Ops → Integrations>' npm run door:smoke
```
Expected today (door dark): `ping 404 null`, then `off` on every row, exit 1 — paste the table into the ledger as the "before" state. After the flip (Cycle 3) the same command is the "after" state: `ping 200 {"data":{"tokenClass":"test","moduleEnabled":true,"captcha":"configured","secondHumanConfigured":true,"trippedForms":[],…}}`, every row `ok`/`HANDLED`/`isTest true` except `newsletter` → `off` (`This form is not accepting submissions.`), `hire (replay #2)` → `replayed true` with the same id as replay #1, `hire (country: Turkey)` → `invalid (country must be a two-letter ISO code)`, `nope` → `off (Unknown form.)`; exit 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/door-smoke.lib.ts scripts/door-smoke.ts scripts/door-smoke.test.ts package.json docs/OPERATING.md
git commit -m "feat(ops): npm run door:smoke — test-class probe of the Operations door, the I4 required sets as code (T14)

One catalog-conformant body per form key, the deliberate replay, the
deliberate 400 and the unknown key, classified like postForm and printed as
the ledger's table. Refuses a write-class token. The pure half is what T15's
synthetic-lead cron will build its body with.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — Prerequisites: staging exists, the door is on, the identities are ready (owner + controller)

This cycle writes no code. Each item is a check with a recorded answer; the ledger (Cycle 7) keeps the answers. Nothing in Cycle 4 starts until every item is ✓.

- [ ] **Step 1: The Vercel project and the production guard (owner + controller, 10 min)**

  1. In `vercel.com/tech-admire-apps/jobsadmirewebsite` → Settings → Git: record the **Production Branch**. It must NOT be a branch of `JobsAdmire/jobsadmire-website` until Phase A cutover (D24; the frozen old site is the production deployment). If it reads `main`, the owner changes it to a non-existent name (`production-cutover-pending`) so no push can replace the old site; record the before/after. Evidence: the deployments list shows `target: null` on every `jobsadmire-website` build (true on 2026-09-20 — verified via the Vercel API: the two `main` builds `dpl_Gchqqmvf…`/`dpl_9xG6AxfB…` are `target: null`).
  2. Deployment Protection (Settings → Deployment Protection): Vercel Authentication ON for previews (WP0). Leave it on. Create a **Protection Bypass for Automation** secret (same screen) and put it in the controller's shell as `VERCEL_AUTOMATION_BYPASS_SECRET` (never in the repo; `docs/DEPLOYMENT.md` gets its NAME in Cycle 7). Every `curl` below against a preview sends `-H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET"`; the browser runs sign in through the SSO wall instead.
  3. **`staging.jobsadmire.com`** (spec §5 WP0 item 7 — DNS + the Turnstile hostname): Settings → Domains → Add `staging.jobsadmire.com`, Git Branch = `wp2/foundation`; at the DNS provider add `staging CNAME cname.vercel-dns.com`; wait for the certificate. Check: `curl -sI https://staging.jobsadmire.com/ | head -1` → `HTTP/2 302` (the SSO redirect — protection applies to custom preview domains too) and, with the bypass header, `HTTP/2 200`. If the owner prefers the alias unprotected, add a Deployment Protection **exception** for `staging.jobsadmire.com` instead of using the bypass; record which.
  4. Preview environment variables (Settings → Environment Variables, scope **Preview**, all branches): `OPS_API_URL=https://operations.jobsadmire.com`, `OPS_WEBSITE_WRITE_TOKEN=<wsw_… from Ops → Integrations>`, `OPS_WEBSITE_TEST_TOKEN=<wst_…>`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<the widget whose secret sits in Ops>`, `NEXT_PUBLIC_GTM_ID=GTM-N2CLWJWJ`, `NEXT_PUBLIC_GA4_ID=G-77Y5KBV97L`, `NEXT_PUBLIC_ADS_ID=AW-17096273578`, `NEXT_PUBLIC_ADS_CONVERSION_LABEL=<label>`, `CONTENT_SOURCE=LOCAL`, `NEXT_PUBLIC_SITE_URL=https://www.jobsadmire.com` (the legacy value `https://jobsadmire.com` broke the routes tests once — `docs/DEPLOYMENT.md` § Deploy discipline). **`NEXT_PUBLIC_*` values are baked at build time: redeploy `wp2/foundation` after saving them** (Deployments → ⋯ → Redeploy). If the token values were never copied at generation (Ops shows them once), the owner rotates them on Ops → Integrations (`POST /api/website/integrations/rotate/:name`, `website:MANAGE_KEYS`) — rotating the write token keeps the previous one valid 24 h, rotating the test token has no window and nothing else consumes it yet.
  5. Two throwaway preview branches for the failure paths, each with ONE branch-scoped Preview variable (Environment Variables → Preview → "Git Branch" field): `preview/t14-off` with `OPS_API_URL=https://operations.jobsadmire.com/nope` (every submit → Nest 404 → `off`), `preview/t14-blackhole` with `OPS_API_URL=https://door.invalid` (`.invalid` never resolves → `unavailable`/`network`). Push them as empty commits off the current `wp2/foundation` HEAD:
     ```bash
     cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website && git fetch origin && \
       git branch preview/t14-off origin/wp2/foundation && git branch preview/t14-blackhole origin/wp2/foundation && \
       git push origin preview/t14-off preview/t14-blackhole
     ```
     (An empty commit is unnecessary — a new branch ref triggers a build.) Record the two preview URLs (`jobsadmirewebsite-git-preview-t14-off-tech-admire-apps.vercel.app`, `…-t14-blackhole-…`). Delete both branches (and their deployments) at the end of Cycle 5.

- [ ] **Step 2: Turnstile and GTM (owner, 5 min)**

  1. Cloudflare → Turnstile → the website widget: hostnames include `jobsadmire.com`, `www.jobsadmire.com` and **`staging.jobsadmire.com`**; widget mode *Managed*; the widget's **site key** is the `NEXT_PUBLIC_TURNSTILE_SITE_KEY` above and its **secret** is the one saved on Ops → Integrations (the owner's message of 2026-09-20 says it is). The `*.vercel.app` hosts are NOT added — the two throwaway previews never reach the door, so the widget's hostname error there is irrelevant.
  2. GTM `GTM-N2CLWJWJ`: the controller opens Tag Assistant (tagassistant.google.com) and connects it to `https://staging.jobsadmire.com` once the alias is up; GA4 → Admin → Data streams → the web stream → Configure tag settings → **Define internal traffic**: add a rule `hostname equals staging.jobsadmire.com` so the ~20 events of this run are `traffic_type=internal` and excludable in reports (the run is on a preview host; the events are real otherwise).

- [ ] **Step 3: Operations — Integrations, the flip, the ping proof (owner, with the Ops runbook)**

  1. Signed in as super-admin on `operations.jobsadmire.com` → Website → Integrations (`/admin/website/integrations`): chips `hasWriteToken`, `hasTestToken`, `hasTurnstileSecret` all ✓, `secondHumanEmail`/`Name` filled (the owner's message says both are), "public intake is OFF" banner present while the flag is off. Press **Test** on the Turnstile secret → `{ ok: true }`. Warn the second human by name that ~20 `WEBSITE_FORM_RECEIVED` mails and possibly one `WEBSITE_FORMS_UNAVAILABLE(tripped)` mail are coming within the hour.
  2. **The flip** — the owner runs Ops `docs/DEPLOYMENT.md` § "Flipping `WEBSITE_MODULE_ENABLED` on the VPS" verbatim (pre-checks: no `RUNNING` WhatsApp campaign, no deploy in flight; then the `.env` edit + `docker compose -f docker-compose.vps.yml up -d backend`; expected `health 200`, `ping-no-token 401`). Record the timestamp.
  3. The ping proof, from the controller's machine, one call per token class (values from the owner's screen, never pasted anywhere):
     ```bash
     for T in "$WRITE" "$TEST"; do curl -s -H "Authorization: Bearer $T" https://operations.jobsadmire.com/api/website/v1/ping; echo; done
     ```
     Expected: `{"data":{"tokenClass":"write",…}}` then `"tokenClass":"test"`, both with `moduleEnabled: true`, `captcha: "configured"`, `secondHumanConfigured: true`, `trippedForms: []`. Then `npm run door:smoke` (Cycle 2, Step 4) → the "after" table, exit 0. Paste both into the ledger.
  4. The site's own view: open `https://staging.jobsadmire.com/api/site-health` in the signed-in browser (or curl with the bypass header) → `ok: true`, `checks.opsPing: "ok"`, `ops.state: "ok"`, `ops.captcha: "configured"`, `ops.trippedForms: []`, `formBeacons: 0` (or the count so far). Record it. **Before the flip** the same body reads `ops.state: "off"`, `checks.opsPing: "skip"` — record that too if the run starts early (it is the "off is not fail yet" fact T15's checklist closes).

- [ ] **Step 4: Identities and the cleanup contract (controller + owner, 5 min)**

  - **Mailbox:** every instance uses `<owner-alias>+t14-<nn>@<owner domain>` (plus-addressing, one per instance, so autoresponders and dedupe never collide) — the owner names the mailbox; it receives up to 17 autoresponders (TR/EN) plus the careers-mailbox confirmation for the two applications. Never a stranger's address, never `@example.com` (the door's e-mail check accepts it and the autoresponder would bounce into the default mailbox).
  - **Name:** every `name`/`reporterName` starts with `[T14-<nn>]`; every free-text `message` starts with `T14 staging run — please ignore`. This is what the Ops inbox search (`payloadJson` name/company match, case-sensitive — RC24) and the Sales inquiry list are filtered on afterwards.
  - **Phone:** the controller's own mobile (the second human may call it); dial code chosen per instance.
  - **CV:** a one-page PDF named `t14-cv.pdf` (any real PDF < 5 MB; `application/pdf` mimetype is client-declared — the site's `uploadCv` refuses a non-PDF before the door sees it). **Evidence:** `t14-1.jpg`, `t14-2.png`, `t14-3.pdf` (< 8 MB each, real bytes — the door sniffs magic bytes).
  - **Cleanup owner:** the owner, within 24 h of the run — the Sales inquiries created (they are real leads on the sales dashboard; delete or mark them lost with reason "T14 test"), the two applicants (Internal Recruitment → the two openings → applicant `[T14-16]`/`[T14-17]` → delete), the Redis marker (Cycle 5 removes it itself). `website_form_submissions` rows are left (no UI delete; 90-day purge, X17) and are the durable evidence. Record every created id in the ledger table (Cycle 4, step 5).

Ledger for this cycle: a nine-line "Prerequisites" block — production branch (before/after), bypass secret name, staging alias + protection mode, the Preview variable NAMES set, the two throwaway previews, Turnstile hostnames, GTM/GA4 internal-traffic rule, flip timestamp + ping proof + door-smoke "after" table, site-health body.

---

#### Cycle 4 — The seventeen form instances, each through the real door

- [ ] **Step 1: Write the failing test** — none: the "test" of this cycle is the instance table below, filled with evidence; a row without all six evidence cells is a failing row. (The per-page e2e specs T1–T13 already cover the deterministic fallback path; nothing deterministic is added here — a Playwright run cannot obtain a real Turnstile token and a headless run with the test token would prove the door, not the visitor path, Ops X16.)

- [ ] **Step 2: The per-instance protocol (same for every row)**

  1. New **incognito window** (a fresh `sessionStorage` — R37 dedupes per session per form key, and four rows share the `hire` key). Sign in through Vercel SSO if prompted. Open the instance's URL from the table. Accept the consent sheet (so GA4 tags fire; the `dataLayer` push happens regardless).
  2. Open DevTools → Console. Tag Assistant is connected (Cycle 3). Scroll to the form; **click into a field** — the Turnstile script loads on the first `focusin`/`pointerdown` inside the form (T0a, W13 amended) and the widget appears in `[data-testid="turnstile"]` (Managed mode: normally a green tick within ~2 s; a challenge is fine).
  3. Fill the fields per the table's *Fields to type* column (option VALUES are stable keys; type the visible labels). Tick consent where the form has a checkbox (rows whose spec is `consent: 'notice'` have none). Submit.
  4. Expected: navigation to `/tesekkurler?form=<key>` (TR) or `/en/thank-you?form=<key>` (EN) — the URL, the page's form-specific line (`sys.thankYou.forms.<key>`), and in the console `window.dataLayer.filter(e => e.event === 'generate_lead').length === 1` and `…'conversion'…length === 1`, both with `form_key: '<key>'`, `page: '/tesekkurler'` or `'/en/thank-you'`, `locale`. Tag Assistant shows both events on that page once. Screenshot the console line (evidence cell E5).
  5. Operations → Website → Inbox: the newest row for that `formKey` — `isTest: false`, `status: HANDLED`, `captchaPassed: true`, `captchaDegraded: false`, `tokenClass: WRITE`, `payloadJson.fields` = exactly the *Fields sent* column (cross-check the names — an unknown key would have been dropped silently, so a MISSING expected key here is the finding this whole task exists to catch), `createdEntityType/Id` set (`inquiry` for the INQUIRY/CALLBACK/VISIT/CALCULATOR keys, `applicant` for careers, none for fraud), `handlerResultJson.attempts.length === 1`. Copy the submission id (E1) and the entity id (E2). For inquiry keys open Sales → Inquiries → the id: `contactName` = the typed name, `source: WEBSITE_FORM`, `messagePreview` first line `[website:<key>]` (or `[website:partner:<track>]`), the `subject: [<topic>] …` line for contact, the `city: …` line where sent, classification per the table, and an assignee where an assignment rule matched (E3). Bell: a `WEBSITE_FORM_RECEIVED` notification in the signed-in super-admin's bell (E4). Mailbox: the autoresponder in the instance's locale (E6) — careers gets the careers-mailbox confirmation instead (RC25); fraud and callback/visit get their own templates.
  6. Fill the row. Any deviation (a field missing in `payloadJson`, a wrong classification, a panel instead of the thank-you, two events) is recorded in the *Notes* cell and fixed in the owning page task's files before this task closes (a page fix is a normal commit on `wp2/foundation`, re-run that row afterwards).

- [ ] **Step 3: The instance table (fill every cell; TR/EN alternate so both locales' autoresponders are seen; every key runs in at least one locale — `hire` runs in both)**

| # | Page (task) | URL (locale) | Instance / mode | Door key · fields sent (exact wire names) | Fields to type | Expected in Operations | E1 sub id | E2 entity | E3 inquiry checks | E4 bell | E5 events | E6 mail |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Homepage (T1) | `/` (TR) | hero lead form, request mode (`#proposal`) | `hire` · name, company, email, phone, sector, headcount, startWhen, city, roleNeeded?, message? | `[T14-01] …`, company, e-mail +t14-01, phone, sector *Fabrika*, count, timeline, city Antalya | Inquiry, classification `DIRECT_EMPLOYER` (or none if the page sends no `iAm` — record which), preview `[website:hire]` + `city: Antalya` | | | | | | |
| 2 | Homepage (T1) | `/en` (EN) | hero "call me back" mode | `callback` · name, phone, preferredTime?, topic?, city? | `[T14-02] …`, phone, a time slot | Inquiry, classification none, preview `[website:callback]` | | | | | | |
| 3 | Hire Workers (T2) | `/isci-talebi` (TR, ≥ 701 px viewport) | quick-quote (`hire-form-quick`, consent notice, no checkbox) | `hire` · name, company, email, phone, city, roleNeeded, headcount | `[T14-03] …`, company, e-mail, phone, city, role, count | Inquiry, preview `[website:hire]`, `roleNeeded: …`, `city: …` | | | | | | |
| 4 | Hire Workers (T2) | `/en/hire-workers` (EN) | request form (`hire-form-full`, checkbox) | `hire` · name, company, email, phone (dial + number → one string), sector, roleNeeded, headcount, city?, startWhen?, message? | `[T14-04] …`, dial +90 + number, sector *Factory*, role, count, timeline, city, message | Inquiry; `phone` stored as `+90…` (dial composed), `sector: factory`, `startWhen: <key>` | | | | | | |
| 5 | Cost Calculator (T3) | `/maliyet-hesaplayici` (TR) | written quote (`#quote`) after using the calculator (role *CNC operatörü*, 8 workers, 12 months) | `calculator` · name, email, phone?, company?, country?, headcount, trade, durationMonths, estimateSummary, message? | `[T14-05] …`, e-mail, phone, company, country | Inquiry, classification none, preview `[website:calculator]` + `estimateSummary:` carrying `formatTRY` figures (TR `… ₺`) ≤ 2000 chars | | | | | | |
| 6 | Partner (T5) | `/en/partner-with-us` (EN) | HR-agency track (`#tracks`) | `hire` · name, company, email, phone, country `TR`, iAm `hr_agency`, city?, message? | `[T14-06] …`, agency name, e-mail, phone, city | Inquiry, classification `HR_AGENCY`, preview `[website:hire]` | | | | | | |
| 7 | Partner (T5) | `/ortak-olun` (TR) | sourcing-partner track | `partner` · name, company, email, phone, country (ISO-2 select, e.g. `PK`), track `sourcing`, candidatesPerYear?, trades?, licence?, city?, message? | `[T14-07] …`, company, e-mail, phone, country *Pakistan*, candidates/yr, trades, licence tick + consent tick | Inquiry, classification `SOURCING_PARTNER`, preview `[website:partner:sourcing]`, `country` stored `PK` | | | | | | |
| 8 | Partner (T5) | `/en/partner-with-us` (EN) | training-institute track | `partner` · name, company, email, phone, country, track `institute`, candidatesPerYear?, trades?, city?, message? | `[T14-08] …`, institute, e-mail, phone, country *Nepal* | Inquiry, `SOURCING_PARTNER`, preview `[website:partner:institute]` | | | | | | |
| 9 | Contact (T7) | `/iletisim` (TR) | enquiry, topic *hire* (`contact-enquiry-form`, `#message`) | `contact` · name, email, phone, company, topic `hire`, iAm `direct_employer`, subject, city?, message | `[T14-09] …`, e-mail, phone, company, topic chip *İşçi almak istiyorum*, detail, city | Inquiry, classification `DIRECT_EMPLOYER`, preview `[website:contact]` then `subject: [hire] <detail>` | | | | | | |
| 10 | Contact (T7) | `/en/contact` (EN) | enquiry, topic *permit* (the second topic proves the `[topic]` prefix + `iAm` map; also confirm the *job* topic HIDES the form) | `contact` · …, topic `permit`, iAm per T7's `IAM_BY_TOPIC`, subject, message | `[T14-10] …`, topic *Work permit*, detail | Inquiry, preview `subject: [permit] …`, classification per T7's map (record it) | | | | | | |
| 11 | Contact (T7) | `/iletisim` (TR) | callback widget (`contact-callback-form`, consent notice) | `callback` · name, phone, preferredTime (`<day> <slot>`) | `[T14-11] …`, phone, day chip, slot chip | Inquiry, preview `[website:callback]` + `preferredTime: …` | | | | | | |
| 12 | Contact (T7) | `/en/contact` (EN) | book a visit (`contact-visit-form`, consent notice) | `visit` · name, email, phone, office `antalya`, preferredDate?, preferredTime? | `[T14-12] …`, e-mail, phone, a day chip, a slot | Inquiry, preview `[website:visit]` + `office: antalya` | | | | | | |
| 13 | Available Workers (T8) | `/adaylar` (TR) | request form (`#pool`) | `workers` · name, company, email, phone, iAm, trade, headcount, startWhen, city?, message (basket refs folded in) | `[T14-13] …`, company, e-mail, phone, role tab, trade, count, timeline, city | Inquiry, classification per `iAm`, preview `[website:workers]` | | | | | | |
| 14 | Verify (T10) | `/en/verify` (EN) | fraud report, no evidence (`#report`) | `fraud` · reporterName, reporterEmail?, reporterPhone?, description (≥ 20), suspectName?, suspectContact? | `[T14-14] …`, e-mail, phone, description ≥ 20 chars, suspect | Row only (FRAUD_REPORT creates no entity), `evidenceKeys` absent/empty; bell + second-human mail still fire | | — | — | | | |
| 15 | Verify (T10) | `/temsilci-dogrulama` (TR) | fraud report with three evidence files | `fraud` · … + evidenceKeys `["website-fraud/…", ×3]` | as 14 + `t14-1.jpg`, `t14-2.png`, `t14-3.pdf` | Row with three keys; inbox detail → **View** streams each (`…/evidence/:index/view`), **Copy link** gives a 15-min presign; a 4th file is refused by the page before the door (`MAX_EVIDENCE_FILES = 3`) | | — | — | | | |
| 16 | Careers detail (T11) | `/kariyer/satis-temsilcisi-plasiyer-tr` (TR) | standard apply (CV PDF, country TR — residency lock) | `careers` · openingSlug, cvKey (`careers-cv/<uuid>.pdf`), name, email, phone, country `TR`, city?, language?, coverLetter?, linkedinUrl? | `[T14-16] …`, e-mail +t14-16, phone, city, `t14-cv.pdf`, cover letter | Applicant on the TR opening (`createdEntityType: applicant`), `skipNotification` (no `WEBSITE_FORM_RECEIVED`, no second-human mail — RC25), careers-mailbox confirmation to the applicant, `APPLICANT_RECEIVED` to the hiring owner | | | — | (none, by design) | | careers mail |
| 17 | Careers detail (T11) | `/en/careers/operations-manager-international-recruitment` (EN) | PK opening — `expectedSalary` branch (+ currency) | `careers` · … + expectedSalary, expectedSalaryCurrency `PKR` (and currentSalary/Currency if typed), country `PK` | `[T14-17] …`, e-mail +t14-17, phone, expected salary + PKR, CV | Applicant on the PK opening with the salary fields on the applicant record | | | — | (none) | | careers mail |

Rows that are **not door instances** and are recorded, not run: careers *portfolio* mode (no `portfolioRequired` opening is live; the "apply by e-mail" mailto branch is T11's unit/e2e — W3/W56); Join Our Team speculative application (WhatsApp + mailto only, no key — W3; click both, `email_click`/`whatsapp_click` with `page_cta` in the dataLayer); Verify lookup (client-only, neutral W6 result; `verify_lookup` outcome `register_unavailable`); the newsletter band (hidden on every page, W5 — assert no `form[data-form-key="newsletter"]` exists on `/blog`, `/en/blog`, `/`); the newsletter confirm/unsubscribe pages (I12 — Cycle 5, step 6). Total door instances: **17**, one per row above.

- [ ] **Step 4: Cross-checks after the seventeen rows**

  - Ops inbox, filter `isTest` off, `from` = the run's start: exactly 17 real rows (`status HANDLED`), plus whatever Cycle 5 adds; no `needsAttention`. CSV export (`website.forms:EXPORT`) → save `t14-inbox.csv` into `.superpowers/t14/` (git-ignored) — the durable artifact.
  - Sales → Inquiries filtered `source: WEBSITE_FORM`, created today: 13 (rows 1–13). Classifications: `DIRECT_EMPLOYER` ×(rows sending `iAm: direct_employer`), `HR_AGENCY` ×1 (row 6), `SOURCING_PARTNER` ×2 (rows 7–8), none for callback/visit/calculator (rows 2, 5, 11, 12).
  - GA4 DebugView / Tag Assistant: 17 `generate_lead`, 17 `conversion`, form_key distribution `hire` ×4, `callback` ×2, `calculator` ×1, `partner` ×2, `contact` ×2, `visit` ×1, `workers` ×1, `fraud` ×2, `careers` ×2.
  - Second human's mailbox: one `WEBSITE_FORM_RECEIVED` mail per row 1–15 (15; careers raises none).
  - `https://staging.jobsadmire.com/api/site-health` → `formBeacons` unchanged from Cycle 3 (no fallback panel was shown on a success path).
  - `ping.lastSubmissionAt` (via the write token) = the last row's time; `trippedForms: []`.

- [ ] **Step 5: Ledger** — the filled table + the cross-check block + the created-entity id list handed to the owner for cleanup (Cycle 3 Step 4).

- [ ] **Step 6: Commit** — none for the run itself (the evidence lives in `.superpowers/t14/` and the ledger); page fixes found by the run are committed on `wp2/foundation` under the owning page's scope (`fix(<page>): …`) before Cycle 7.

---

#### Cycle 5 — The failure paths, on purpose

- [ ] **Step 1: Write the failing test** — none new: each path is already a unit test in the kernel (`src/forms/__tests__/post.test.ts` maps 404/429/5xx/network/timeout; `FallbackPanel.test.tsx` renders every kind with its WhatsApp variant; `action.test.ts` redirects on `replayed: true`) and a Playwright case per page for the deterministic `unauthorized` panel. This cycle proves the same mappings against the real door and records them.

- [ ] **Step 2: Replay (same body twice → `replayed: true`)**

  1. Headless: `npm run door:smoke`'s rows `hire (replay #1)`/`hire (replay #2)` — same `id`, second `replayed true` (Cycle 3 already pasted it; re-run if the hour bucket rolled).
  2. Browser: on `/en/contact`, submit the callback widget (row 11's data with `[T14-R1]`), land on `/en/thank-you?form=callback`, go back, submit the **identical** body again within the same clock hour → thank-you again (the kernel treats `replayed` as success — `action.ts:152`). Ops inbox: **one** row, `handlerResultJson.attempts.length === 1`, one inquiry. dataLayer in that (same) session: `generate_lead` count stays **1** (R37 — same key, same path), which is the accepted skew recorded in ANALYTICS.md. Ledger: the row id and both timestamps.

- [ ] **Step 3: 429 — the tripped form (`visit`, by the Redis marker; 15-minute window)**

  ```bash
  ssh jobsadmire_portal "cd /var/www/html/jobsadmire-operations && PW=\$(grep '^REDIS_PASSWORD=' .env | cut -d= -f2-) && \
    docker exec jobsadmire_ops_redis redis-cli --no-auth-warning -a \"\$PW\" SET website:abuse:tripped:visit \"\$(date -u +%FT%TZ)\" EX 900 && \
    docker exec jobsadmire_ops_redis redis-cli --no-auth-warning -a \"\$PW\" TTL website:abuse:tripped:visit"
  ```
  Expected: `OK` then a TTL ≤ 900. (Only `tripped` is set — no `count`, no `announced` — so `WebsiteAlarmsCron` announces nothing and no `WEBSITE_FORMS_UNAVAILABLE` mail goes out; `ping.trippedForms` reads the same key — `website-abuse.service.ts:isTripped`.)
  1. `curl -s -H "Authorization: Bearer $TEST" https://operations.jobsadmire.com/api/website/v1/ping` → `"trippedForms":["visit"]`; `https://staging.jobsadmire.com/api/site-health` → `ops.trippedForms: ["visit"]` (`checks.opsPing` stays `ok` — the check is about reachability; the tripped list is a fact on the body).
  2. Browser, fresh session: `/en/contact` → book-a-visit → submit → **no navigation**; the panel `[data-testid="form-fallback"][data-kind="tripped"]` appears under the form with the `sys.form.fallback.tripped.*` copy, the WhatsApp button as the **primary** face (`bg-blue-safe`) whose `href` is `https://wa.me/<number>?text=…` prefilled with the typed name/e-mail/phone, the Call and E-mail buttons beside it; the typed values are still in the inputs. Click WhatsApp → dataLayer `whatsapp_click` with `placement: 'form_fallback'` (no name, no phone in the event). `formBeacons` on site-health +1. Ops inbox: **no row** (the 429 is answered before the row — order: form → trip → …). Screenshot.
  3. Remove the marker: `… redis-cli … DEL website:abuse:tripped:visit` → `1`; ping → `trippedForms: []`. Re-submit the same visit form → thank-you (a proof the marker was the only cause). Ledger: both ping bodies, the screenshot, the beacon count.

- [ ] **Step 4: 404 → the `off` panel (three proofs, take the ones available)**

  1. **Newsletter key** (D14, always available): `npm run door:smoke` row `newsletter` → `off (This form is not accepting submissions.)`; and `curl -s -o /dev/null -w '%{http_code}\n' -X POST -H "Authorization: Bearer $TEST" -H 'Content-Type: application/json' -d '{"locale":"en","consentVersion":"kvkk-2026-09","fields":{"email":"door-smoke@jobsadmire.com"}}' https://operations.jobsadmire.com/api/website/v1/forms/newsletter` → `404`. The site renders no newsletter form in Phase A (W5), so the visitor never meets this 404 — the panel is proven by proof 2.
  2. **The `preview/t14-off` preview** (`OPS_API_URL=…/nope` → every POST lands on an unknown Nest route → 404): `/en/contact` → callback widget → submit → `[data-kind="off"]` panel, WhatsApp primary, `sys.form.fallback.off.*` copy, beacon +1 on that preview's `/api/site-health` (which also reads `ops.state: "off"`, `checks.opsPing: "skip"` — the same base URL). Screenshot.
  3. **Pre-flip** (only if the run started before the owner's flip): the same submit on `staging.jobsadmire.com` while the door was dark → the same `off` panel — the honest Phase A shape the site would have shown on launch day without the flip. Record whether this proof was available.

- [ ] **Step 5: 5xx / unreachable → the `unavailable` panel (with the W3 retry budget)**

  1. **`preview/t14-blackhole`** (`OPS_API_URL=https://door.invalid`): `/en/contact` → callback → submit with a stopwatch → `[data-kind="unavailable"]` panel within **≤ 2 s** (DNS failure is immediate; two attempts, no sleep — `MAX_ATTEMPTS = 2`), WhatsApp primary, beacon +1. Screenshot + the Vercel function log line `[postForm] unavailable after retry { formKey: 'callback', cause: 'network' }` (Vercel → the deployment → Logs; the token never appears).
  2. **Timeout** (same preview, optional): change the branch variable to `OPS_API_URL=https://10.255.255.1` (non-routable), redeploy, submit with the stopwatch → the panel between **8 and 9 s** (2 × `AbortSignal.timeout(4000)`), log cause `timeout`. If Vercel's egress refuses the private range instantly, the cause is `network` again — record whichever.
  3. **A real 502 — opportunistic:** Cycle 6's Ops push redeploys Operations, which is a 30–60 s 502 window on `/api/website/*` (Ops PRD §5.12). Watch `tail -f deploy.log` over ssh; when `up -d` starts, submit a `[T14-502]` callback on staging: either the panel `unavailable` (both attempts inside the window, log cause `server`) or a thank-you (the retry landed after the window — then the inbox shows ONE row, possibly `replayed: false` on attempt 2 because attempt 1 never reached the door). Record which; both are the documented behaviour. If the window is missed, record "not observed — the black-hole proof stands".

- [ ] **Step 6: The remaining edges (each one line in the ledger)**

  - **403 captcha** (optional, deterministic in DevTools): Network → Request blocking → block `challenges.cloudflare.com` → reload `/iletisim` → callback widget (no widget can load, no token) → submit → `[data-kind="captcha"]` panel with the WhatsApp button as the **secondary** face and the `sys.form.fallback.retry` affordance; Ops writes **no row** (403 is before the row). Unblock, resubmit → thank-you. (Proves the "site key set, token missing" arm of the asymmetry; the "no site key" arm is what Cycle 3 step 1.4 prevents.)
  - **400 invalid**: the smoke's `hire (country: Turkey)` row — the site can never send it (its schema validates ISO-2 before the door), so the mapping is proven headless only.
  - **Honeypot**: fill the off-canvas `input[name="honeypot"]` via the console (`document.querySelector('form[data-form-key="callback"] input[name="honeypot"]').value = 'x'`) and submit → thank-you (a bot sees success), Ops row `status: SPAM`, `captchaPassed: null`, no inquiry, no bell, not counted toward the trip, `generate_lead` fires (a bot's dataLayer is nobody's problem — record it as known).
  - **I12 — newsletter pages (T13)**: open `/abone-onay?token=not-a-real-token-1234567890` — Network tab shows **no** call to Operations on load or on hover; click the confirm button → the server action forwards → 400 `NEWSLETTER_TOKEN_INVALID` → the page's error state with the `info@jobsadmire.com` fallback (never a silent no-op). Same on `/en/newsletter/unsubscribe?token=abc.def` (a bad HMAC → 400). `curl -s -o /dev/null -w '%{http_code}\n' -X POST -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" -H 'Content-Type: application/x-www-form-urlencoded' -d 'List-Unsubscribe=One-Click' 'https://staging.jobsadmire.com/api/newsletter/unsubscribe?token=abc.def'` → the route handler's non-2xx for a bad token (T13 defines it; record the code). A real subscriber token cannot exist while `newsletter` is inactive (D14) — the CONFIRMED/UNSUBSCRIBED outcomes are recorded as "deferred to the D14 flip" in I12.
  - **`ok` + `FAILED` + visitor `error`** (RC26): on the PK opening (row 17's URL), apply a second time with row 17's e-mail → careers-public answers 409 → the handler maps it to `alreadyReceived` (still `ok`, thank-you, no second applicant). For a **real** FAILED+error: apply on the TR opening with country `PK` — if T11's residency lock is a select restricted to the opening's country the site refuses first (record "not reachable from the UI"); otherwise the door answers 200 + `status: FAILED` + `error` (the residency message) and the site shows the `failed` panel with that sentence and the WhatsApp button as secondary.

- [ ] **Step 7: Tear down** — `DEL` the Redis marker (done in step 3); delete the two throwaway branches (`git push origin --delete preview/t14-off preview/t14-blackhole`) and their deployments in the dashboard; remove the two branch-scoped `OPS_API_URL` overrides; leave the Preview-wide variables. Ledger: the failure-path block (replay ids, 429 pings + screenshot, off ×3, unavailable ×2–3 with timings + log lines, the edges).

---

#### Cycle 6 — Operations: the wire-contract field table in PRD §5.12 (docs-only commit, pinned by the docs guard)

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog` if T0f's worktree (W47) still exists with its `node_modules`; otherwise `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website`. Never the shared main checkout (`jobsadmire-operations`). Branch off `origin/main`:

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog && git status --short && git fetch origin && git switch -c website/t14-forms-docs origin/main
```
(Expected: a clean tree; if T0f's branch is still un-merged there, stop — the table below assumes T0f's "Catalog v1.1" paragraph is on `main`.)

- [ ] **Step 1: Write the failing test** — append this `it` to `apps/backend/src/modules/website/website-docs-guard.spec.ts` before the file's final `});` (after T0f's `it('PRD §5.12 carries the catalog v1.1 field table …')`; `prd` is the file-level constant from line 72):

```ts
  it('PRD §5.12 carries the per-form wire-contract field table (v1.1) and §12.2 records the T14 staging verification', () => {
    expect(prd).toContain('**Wire contract field table (v1.1');
    expect(prd).toContain('| `hire` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 (≥ 8 digits)');
    expect(prd).toContain('| `newsletter` | NEWSLETTER | `email`* ≤254 · `name` ≤120 — **inactive (D14) → 404** |');
    expect(prd).toContain('Website forms verified end to end on staging (WP2 T14');
  });
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd apps/backend && npx jest src/modules/website/website-docs-guard.spec.ts --maxWorkers=2
```
Expected: the new `it` fails on the first `toContain` (`Wire contract field table`); everything else green.

- [ ] **Step 3: Implement** — `docs/PRD.md`:

(a) After T0f's v1.1 table (the four-row table under `**Catalog v1.1 (2026-09-20, WP2 T0f, website ruling W16)`; find its last row with `grep -n "does NOT satisfy \`Opening.portfolioRequired\` |" docs/PRD.md`) insert a blank line and:

```
**Wire contract field table (v1.1, verified end to end on staging 2026-09-<dd>, WP2 T14) — every field the website may send per key, in the catalog's order.** `*` = required; caps are characters of the normalised value; `enum` values must match exactly (lower-case keys, never a label); `iso2` is upper-cased then checked; `phone` needs ≥ 8 digits and is stored as typed; `email` is lowercased; `url` (`portfolioUrl` only) gets `https://` when the scheme is missing. Anything else inside `fields` is dropped silently, never an error. The website repo's `docs/INTEGRATIONS.md` I4 carries the same table plus the page → key instance map; `scripts/door-smoke.lib.ts` there is the required sets as code.

| formKey | Handler | Fields (wire names) |
|---|---|---|
| `hire` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 (≥ 8 digits) · `country` iso2 · `iAm` enum `direct_employer`\|`hr_agency` · `sector` ≤120 · `roleNeeded` ≤200 · `headcount` ≤10 · `startWhen` ≤120 · `city` ≤120 (v1.1) · `message` ≤5000 |
| `contact` | INQUIRY | `name`* ≤120 · `email`* ≤254 · `phone` ≤40 · `company` ≤200 · `country` iso2 · `iAm` enum `direct_employer`\|`hr_agency`\|`sourcing_partner`\|`job_seeker` · `subject` ≤200 · `topic` enum `hire`\|`partner`\|`permit`\|`job`\|`other` (v1.1) · `city` ≤120 (v1.1) · `message`* ≤5000 |
| `partner` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country`* iso2 · `candidatesPerYear` ≤20 · `trades` ≤500 · `licence` ≤200 · `track` enum `sourcing`\|`institute` (v1.1) · `city` ≤120 (v1.1) · `message` ≤5000 |
| `workers` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country` iso2 · `iAm` enum `direct_employer`\|`hr_agency` · `trade` ≤200 · `headcount` ≤10 · `startWhen` ≤120 · `city` ≤120 (v1.1) · `message` ≤5000 |
| `callback` | CALLBACK | `name`* ≤120 · `phone`* ≤40 · `email` ≤254 · `preferredTime` ≤120 · `topic` ≤200 (free text — unrelated to `contact.topic`) · `city` ≤120 (v1.1) |
| `visit` | VISIT | `name`* ≤120 · `company` ≤200 · `email`* ≤254 · `phone`* ≤40 · `office` ≤120 · `preferredDate` ≤40 · `preferredTime` ≤40 · `message` ≤5000 |
| `calculator` | CALCULATOR_QUOTE | `name`* ≤120 · `email`* ≤254 · `phone` ≤40 · `company` ≤200 · `country` iso2 · `headcount` ≤10 · `trade` ≤200 · `durationMonths` ≤10 · `estimateSummary` ≤2000 · `message` ≤5000 |
| `careers` | CAREERS_APPLY | `openingSlug`* ≤200 `/^[a-z0-9-]+$/` · `cvKey`* ≤300 `/^careers-cv\/[A-Za-z0-9._-]+\.pdf$/i` (from `POST /api/careers/upload-cv`) · `name`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country`* iso2 · `city` ≤100 · `language` ≤300 · `expectedSalary` ≤20 · `expectedSalaryCurrency` ≤3 · `currentSalary` ≤20 · `currentSalaryCurrency` ≤3 · `coverLetter` ≤5000 · `linkedinUrl` ≤500 · `portfolioUrl` url ≤500 (v1.1) — salaries/currencies outside `PublicApplyDto`'s rules are DROPPED, not rejected |
| `fraud` | FRAUD_REPORT | `reporterName` ≤120 · `reporterEmail` email ≤254 · `reporterPhone` phone ≤40 · `description`* ≤5000, min 20 · `suspectName` ≤200 · `suspectContact` ≤300 · `evidenceKeys` list ≤3 of `/^website-fraud\/[A-Za-z0-9._-]+$/` ≤300 each (from `POST /api/website/v1/uploads/fraud-evidence`, one file per call) |
| `newsletter` | NEWSLETTER | `email`* ≤254 · `name` ≤120 — **inactive (D14) → 404** |
```

(b) In §12.2, after T0f's entry `- **2026-09-20 — Website catalog v1.1 (WP2 T0f, W16).** …` add:

```
- **2026-09-<dd> — Website forms verified end to end on staging (WP2 T14).** All 17 form instances of the designed pages submitted through `staging.jobsadmire.com` with a real Turnstile token against the live door: 13 inquiries (classification per `iAm`/`partner`), 2 applicants (TR opening; PK opening with `expectedSalary`), 2 fraud rows (one with three evidence objects), every row `HANDLED` / `captchaPassed: true`, one `WEBSITE_FORM_RECEIVED` bell + second-human mail per non-careers row, one autoresponder per row in the visitor's locale, and exactly one `generate_lead` + one `conversion` on the site's thank-you page per submission. Failure paths exercised: dedupe replay (`replayed: true`, one row), 429 via the `website:abuse:tripped:visit` marker (no row, WhatsApp-primary panel), 404 (newsletter inactive; unknown route), 5xx/unreachable (the website's one-retry/8 s rule, then its panel). The per-form wire-contract field table above is the record; `docs/INTEGRATIONS.md` I4 in the website repo mirrors it.
```

- [ ] **Step 4: Run the docs guard + the website module's docs-adjacent specs**

```bash
cd apps/backend && npx jest src/modules/website/website-docs-guard.spec.ts src/modules/website/website-form-catalog.spec.ts --maxWorkers=2 && cd ../.. && npm run type-check
```
Expected: all green (the new `it` included); type-check unchanged (no code touched).

- [ ] **Step 5: Commit + push (a production deploy; docs only — and the opportunistic 502 window of Cycle 5 step 5.3)**

```bash
git add docs/PRD.md apps/backend/src/modules/website/website-docs-guard.spec.ts
git commit -m "docs(website): PRD §5.12 wire-contract field table v1.1 + T14 staging verification record

The per-form field table every website form is written against (required
sets, caps, enums, the v1.1 additions), pinned by the docs guard; §12.2
records the end-to-end run on staging. Docs only — no code, no migration.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git fetch origin && git rebase origin/main && git push origin HEAD:main
```
Then verify by artifact (`ssh jobsadmire_portal "tail -3 /var/www/html/jobsadmire-operations/deploy.log"` → `Deploy finished for <sha>`), and confirm the door survived the redeploy: ping → 200 with the test token; `WEBSITE_MODULE_ENABLED` persists (`.env`-driven — Ops DEPLOYMENT.md § Shutting the door). Delete the branch locally afterwards (`git switch --detach origin/main && git branch -D website/t14-forms-docs`).

---

#### Cycle 7 — Website docs: I4 (field table + instance map + verification record), I5, I12, DEPLOYMENT, PRD, ledger

- [ ] **Step 1: Write the failing test** — none (docs); `npx prettier --check docs` and the reviewer's diff are the check.

- [ ] **Step 2:** n/a.

- [ ] **Step 3: Implement**

`docs/INTEGRATIONS.md` — I4: after the paragraph at line 44 (T0a's rewrite, beginning `**Direction:** Website → Ops. **Auth:** write token + Turnstile. **Shape (as built, WP3a door / WP2a client`), append:

```markdown
**Field table per key (catalog v1.1 — the contract of record; mirrored in Ops `docs/PRD.md` §5.12 "Wire contract field table", pinned there by `website-docs-guard.spec.ts` and here by `scripts/door-smoke.test.ts`'s required sets).** `*` = required; caps are characters of the normalised value; enum values are lower-case keys (never a label — W3); `iso2` upper-case (W40); phones ≥ 8 digits, stored as typed (the page composes `+<dial><number>`); e-mails lowercased by the door; `url` (`portfolioUrl` only) gets `https://` when missing. A wire name not in the row is DROPPED silently — every page's `toFields` is typed against this table, and the T14 inbox check reads `payloadJson.fields` back against it.

| Key | Handler | Fields (wire names) |
| --- | --- | --- |
| `hire` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country` iso2 · `iAm` `direct_employer`\|`hr_agency` · `sector` ≤120 (the `sectors` collection key) · `roleNeeded` ≤200 · `headcount` ≤10 · `startWhen` ≤120 (stable key) · `city` ≤120 (v1.1) · `message` ≤5000 |
| `contact` | INQUIRY | `name`* ≤120 · `email`* ≤254 · `phone` ≤40 · `company` ≤200 · `country` iso2 · `iAm` `direct_employer`\|`hr_agency`\|`sourcing_partner`\|`job_seeker` · `subject` ≤200 · `topic` `hire`\|`partner`\|`permit`\|`job`\|`other` (v1.1) · `city` ≤120 (v1.1) · `message`* ≤5000 |
| `partner` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country`* iso2 · `candidatesPerYear` ≤20 · `trades` ≤500 · `licence` ≤200 · `track` `sourcing`\|`institute` (v1.1) · `city` ≤120 (v1.1) · `message` ≤5000 |
| `workers` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country` iso2 · `iAm` `direct_employer`\|`hr_agency` · `trade` ≤200 · `headcount` ≤10 · `startWhen` ≤120 · `city` ≤120 (v1.1) · `message` ≤5000 |
| `callback` | CALLBACK | `name`* ≤120 · `phone`* ≤40 · `email` ≤254 · `preferredTime` ≤120 · `topic` ≤200 (free text) · `city` ≤120 (v1.1) |
| `visit` | VISIT | `name`* ≤120 · `company` ≤200 · `email`* ≤254 · `phone`* ≤40 · `office` ≤120 (`antalya`) · `preferredDate` ≤40 · `preferredTime` ≤40 · `message` ≤5000 |
| `calculator` | CALCULATOR_QUOTE | `name`* ≤120 · `email`* ≤254 · `phone` ≤40 · `company` ≤200 · `country` iso2 · `headcount` ≤10 · `trade` ≤200 · `durationMonths` ≤10 · `estimateSummary` ≤2000 (serialised by the page's `toFields`, `formatTRY` figures) · `message` ≤5000 |
| `careers` | CAREERS_APPLY | `openingSlug`* ≤200 · `cvKey`* ≤300 `careers-cv/….pdf` (from `POST /api/careers/upload-cv`, filename must end in `.pdf`) · `name`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country`* iso2 (= the opening's country — residency) · `city` ≤100 · `language` ≤300 · `expectedSalary` ≤20 · `expectedSalaryCurrency` ≤3 · `currentSalary` ≤20 · `currentSalaryCurrency` ≤3 · `coverLetter` ≤5000 · `linkedinUrl` ≤500 · `portfolioUrl` url ≤500 (v1.1; does not satisfy `portfolioRequired` — W56) |
| `fraud` | FRAUD_REPORT | `reporterName` ≤120 · `reporterEmail` ≤254 · `reporterPhone` ≤40 · `description`* ≤5000 min 20 · `suspectName` ≤200 · `suspectContact` ≤300 · `evidenceKeys` ≤3 × `website-fraud/…` (one upload call per file, ≤ 8 MB, sniffed JPEG/PNG/WEBP/PDF) |
| `newsletter` | NEWSLETTER | `email`* ≤254 · `name` ≤120 — **inactive (D14) → 404 `off`**; the band is hidden on every page (W5) |

**Instance map (17 door instances across 13 pages — what T14 verified on staging):** Homepage hero → `hire` (request mode) and `callback` ("call me back" mode); Hire Workers quick-quote (`consent: 'notice'`) and request form → `hire`; Cost Calculator written quote → `calculator`; Partner With Us HR-agency track → `hire` + `iAm: 'hr_agency'`, sourcing / institute tracks → `partner` + `track`; Contact enquiry → `contact` + `topic` + `iAm` (topic `job` renders no form), callback widget → `callback`, book-a-visit → `visit` (`office: 'antalya'`); Available Workers request → `workers`; Verify fraud report → `fraud` (0–3 evidence uploads first); Careers detail apply → `careers` (CV upload first; PK openings add `expectedSalary`; portfolio-required openings show the "apply by e-mail" branch instead — W3/W56). Not door instances: Join Our Team speculative application (WhatsApp + mailto, W3), the Verify lookup (client-only, W6), the newsletter band (hidden, W5).

**Verification record (T14, staging, 2026-09-<dd>):** all 17 instances → real Turnstile (`captchaPassed: true`, `captchaDegraded: false`) → `HANDLED` row → thank-you → exactly one `generate_lead` and one `conversion` each; 13 inquiries (`source: WEBSITE_FORM`, `contactName`, `[website:<key>[:<track>]]` preview tag, `[topic]` subject prefix, `city:` line), 2 applicants (TR; PK with `expectedSalary`), 2 fraud rows (one with three evidence objects read back through the inbox's `/evidence/:index/view`), 15 `WEBSITE_FORM_RECEIVED` bells + second-human mails (careers raises none — RC25), 17 autoresponders. Failure paths: replay (`replayed: true`, one row), 429 (`website:abuse:tripped:visit` marker → `tripped` panel, WhatsApp primary, no row), 404 (newsletter inactive; unknown route → `off` panel), 5xx/unreachable (DNS black hole → `unavailable` panel after two attempts; the W3 8 s budget observed on the timeout variant), 403 (blocked widget → `captcha` panel, no row), honeypot (`SPAM` row, thank-you). Evidence: the ledger in `docs/superpowers/plans/2026-09-20-wp2b-pages.md` § T14 and `.superpowers/t14/` (git-ignored). The probe used for the headless half is `npm run door:smoke` (`docs/OPERATING.md` § Synthetic lead).
```

I5 (line 48, after T0a's sentence ending `\`CareersPublicModule\` exports \`apply\` (done in WP3a).`) — append: ` **Verified on staging (T14):** a real application on the TR opening (`careers-cv/<uuid>.pdf` from the public upload, `country: 'TR'`) and one on the PK opening with `expectedSalary` + `expectedSalaryCurrency: 'PKR'` each created an applicant (`createdEntityType: 'applicant'`), sent the careers-mailbox confirmation to the applicant and `APPLICANT_RECEIVED` to the hiring owner, and raised no `WEBSITE_FORM_RECEIVED` (RC25). A repeat application by the same e-mail on the same opening comes back `ok` + `alreadyReceived` (thank-you, no second applicant). The portfolio-required branch ("apply by e-mail", W3/W56) had no live opening to run against and is covered by T11's tests only.`

I12 (line 76, after T0a's appended rule) — append: ` **Verified on staging (T14):** `/abone-onay` and `/en/newsletter/unsubscribe` make no call to Operations on load, prefetch or hover (Network tab); the click forwards and a bad token renders the error state with the `info@jobsadmire.com` fallback (400 `NEWSLETTER_TOKEN_INVALID`); the RFC 8058 route handler answers a non-2xx for a bad token. The `CONFIRMED`/`ALREADY_CONFIRMED`/`UNSUBSCRIBED` outcomes cannot be exercised while `newsletter` is inactive (D14) — re-run this paragraph's check on the day the owner flips `WebsiteForm.isActive` (Ops PRD §5.12 gotcha).`

`docs/DEPLOYMENT.md`:

- § Two Vercel projects (lines 5–12): after the table add: `**As connected on 2026-09-20 (owner action, a deviation from spec §5 WP0 item 7 recorded here, not silently):** the repo `JobsAdmire/jobsadmire-website` is linked to the EXISTING project `jobsadmirewebsite` (`prj_Ze3FSd1XbvNbIe2OF2UQjRZ2ZAD6`, team `tech-admire-apps`) — no `jobsadmire-web-v2` was created. That is safe only while the project's **Production Branch is not a branch of this repo** (set to `<the value recorded in the T14 ledger>`; every build of this repo shows as Preview / `target: null`); the frozen old-site deployment `dpl_hRVuY1faCQe8fQ44sqmw4t82Rs7A` stays production until the Phase A cutover, which becomes "point the Production Branch at `main`" instead of a domain move. Branch previews: `https://jobsadmirewebsite-git-<branch>-tech-admire-apps.vercel.app`.`
- New section after § Deployment Protection (line 51):
  ```markdown
  ## Staging alias and Deployment Protection (T14)

  `staging.jobsadmire.com` is the project's custom preview domain assigned to the Git branch `wp2/foundation` (Settings → Domains; DNS `staging CNAME cname.vercel-dns.com`). It is the ONLY host the website's Turnstile widget lists besides production, so real-captcha form runs happen there, never on a `*.vercel.app` URL. Vercel Authentication stays on for previews; humans sign in, automation sends `x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET` (Settings → Deployment Protection → Protection Bypass for Automation; the value lives in the controller's shell and the external monitor, never in this repo). Failure-path rehearsals use throwaway branches with ONE branch-scoped Preview variable (`OPS_API_URL` pointed at an unknown route → `off`, at `https://door.invalid` → `unavailable`); delete the branch and the override afterwards.
  ```
- § Environment variables: the `OPS_WEBSITE_TEST_TOKEN` row T0a added — replace its trailing `Not consumed by any code yet` with `Consumed by \`npm run door:smoke\` (T14, from the developer's shell) and by the T15 synthetic-lead cron`. The `NEXT_PUBLIC_TURNSTILE_SITE_KEY` row — append `. Set on Preview since T14 (the widget listing \`staging.jobsadmire.com\`)`.

`docs/PRD.md` — Modify line 46 (the paragraph T0a rewrote to begin `**The forms kernel shipped in WP2a**`): append ` **Verified end to end on staging in T14 (2026-09-<dd>):** all 17 form instances through the real door with a real Turnstile token, one inquiry/applicant/row each, one \`generate_lead\` + one \`conversion\` each; the per-form field table is \`docs/INTEGRATIONS.md\` I4.`

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T14 ledger block under the plan's ledger section:

```markdown
### T14 — Forms end-to-end on staging (2026-09-<dd>)

- Prerequisites: production branch `<before>` → `<after>`; bypass secret `VERCEL_AUTOMATION_BYPASS_SECRET` (name only); `staging.jobsadmire.com` → `wp2/foundation`, protection `<sso|exception>`; Preview vars set: OPS_API_URL, OPS_WEBSITE_WRITE_TOKEN, OPS_WEBSITE_TEST_TOKEN, NEXT_PUBLIC_TURNSTILE_SITE_KEY, NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GA4_ID, NEXT_PUBLIC_ADS_ID, NEXT_PUBLIC_ADS_CONVERSION_LABEL, CONTENT_SOURCE, NEXT_PUBLIC_SITE_URL; throwaway previews `preview/t14-off`, `preview/t14-blackhole` (deleted <time>); Turnstile hostnames ✓; GA4 internal-traffic rule ✓; flip at <time> (ping write/test bodies pasted); door-smoke before/after tables pasted; site-health body pasted.
- Instances: the 17-row table (from Cycle 4) with E1–E6 filled; cross-checks (inbox 17, inquiries 13 + classifications, GA4 17/17, second human 15, formBeacons unchanged).
- Failure paths: replay (<ids>), 429 (<ping bodies>, <screenshot>), off ×<n>, unavailable ×<n> (<timings>, <log lines>), 403, honeypot, I12, RC26.
- Findings fixed in page tasks: <list of commits, or "none">.
- Cleanup handed to the owner: inquiries <ids>, applicants <ids>.
- Open for T15: `opsPingCheck` `off → fail` after the flip (OPERATING.md); the synthetic-lead cron on `smokeFields('hire', stamp)`; GA4 hostname filter for staging kept.
- Script size: n/a (no route). Lighthouse: n/a. Pixel: n/a.
```

- [ ] **Step 4: Run tests + npm run verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website && npx prettier --write docs && npm run verify
```
Expected: green (docs only in this cycle; prettier reflows the tables).

- [ ] **Step 5: Commit**

```bash
git add docs/INTEGRATIONS.md docs/DEPLOYMENT.md docs/PRD.md docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(forms): I4 field table v1.1 + instance map + staging verification record, I5/I12 verified, staging alias + project reality, T14 ledger

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/ANALYTICS.md` (the `generate_lead` row and wiring paragraph; the two accepted reconciliation skews); `docs/INTEGRATIONS.md` (I4 field table v1.1 + the 17-instance map + the verification record; I5 and I12 "verified on staging" paragraphs); `docs/DEPLOYMENT.md` (the `jobsadmirewebsite` project reality and the production-branch guard; new § Staging alias and Deployment Protection; `OPS_WEBSITE_TEST_TOKEN` now consumed; Turnstile site key on Preview); `docs/OPERATING.md` (§ Synthetic lead: `npm run door:smoke` is the probe, the cron is T15); `docs/PRD.md` (line 46: verified end to end); `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (the T14 ledger block); Operations `docs/PRD.md` §5.12 "Wire contract field table (v1.1)" + §12.2 entry, pinned by `website-docs-guard.spec.ts` (a docs-only Ops commit, pushed to `main`).

**Sys keys added:** none (this task ships no page copy; the fallback panels and the thank-you page read the existing `sys.form.fallback.*` / `sys.thankYou.*` keys).

**Package ids used:** 0 (no page rendered by this task).

**Foundation gaps:** (1) **`generate_lead` had no caller anywhere** — not WP1 (`ConversionPing` fires only `conversion`), not the WP2a kernel (a server action has no `dataLayer`; `redirect()` unmounts `FormShell`), and the WP2b page contract forbids pages from firing it — closed in Cycle 1 by editing WP1's `src/analytics/ConversionPing.tsx` (a WP1 file; no WP2a Produces changes). (2) **The brief's "26 test-class posts trip the form" is impossible against the door as built** — test-class submissions never reach `recordVerified` (`website-forms.service.ts:265-271`), so the 429 path is exercised by the Redis trip marker (`website:abuse:tripped:<form>`, `website-alarms.logic.ts:64-70`) set by hand for 15 minutes; no kernel change. (3) **No staging alias, no automation bypass and no Preview door variables exist yet**, and the repo is connected to the existing Vercel project `jobsadmirewebsite` rather than the spec's `jobsadmire-web-v2` — owner-side prerequisites, recorded in Cycle 3 and `docs/DEPLOYMENT.md`, not code. (4) **The door is still dark** (ping 404 on 2026-09-20) — the flip is the owner's move (Ops `docs/DEPLOYMENT.md` § Flipping), listed as a Cycle 3 prerequisite; the pre-flip `off` panel is recorded if the timing allows. (5) The `off` result kind cannot distinguish "module dark", "unknown key" and "inactive newsletter" (all 404) — the site's panel copy is one (`sys.form.fallback.off.*`); acceptable in Phase A since the newsletter form is hidden (W5), noted for the D14 flip. Everything else consumed above is spelled exactly as `produces-final.md` (Tasks 1–8) and the WP1 code freeze it.
