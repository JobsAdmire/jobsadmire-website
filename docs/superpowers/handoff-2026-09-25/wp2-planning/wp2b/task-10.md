### Task 10: Verify Representative (`/temsilci-dogrulama`, `/en/verify`)

**Route:** internal `/verify` (pathnames: tr `/temsilci-dogrulama`, en `/verify`) · pageKey `verify` · route group `(site)` (W19) · indexable · not a pixel-harness page (D27: side-by-side review).

**What this page is in Phase A (D9 v1, W6, §10 rows 3 and 11):** an empty-state register + a client-only lookup that always answers the neutral "register not yet published — verify with the office" result (never the design's red "Not on our authorised list" verdict), the founder strip hidden (returns `null` while the register has no founder row), the five red flags, a real fraud-report form to the `fraud` door (W3: reporter name/e-mail/phone + up to three evidence uploads), a FAQ block with its FAQPage node, and a record `Dialog` scaffold that is dead behind a v1.1 flag. Every hidden section is a component that returns `null` when the register is empty — nothing is deleted from the port.

**Decisions this task records (write them into the docs in Cycle 7; cite as V-n):**

- **V-1 Record URL shape = `?id=<JA-…>` on the same route** (`/temsilci-dogrulama?id=JA-REP-001`, `/en/verify?id=…`), not a `/verify/[id]` route. Why: the printed badge QR must encode a permanent URL (D9 v1.1 "stable public id"); a query on the existing route adds no `pathnames` entry, no sitemap/hreflang work and keeps the page static — the island reads the query **after hydration** (`useSyncExternalStore`, the R18/R27 pattern), never through the page's `searchParams` (which would make the whole route dynamic). Canonical stays the bare route. The v1.1 record fetch will be a **website** route handler (`src/app/api/verify/record/route.ts`, `no-store` per spec §3.1) called from the island — Operations is never called from the browser (D6). `?rep=` and `#id=` are accepted as aliases (the design reads all three).
- **V-2 Reporter fields:** `reporterName` and `reporterEmail` are required on the site, `reporterPhone` optional — the copy promises "we tell you what we found" (verify.093), which needs a reply channel; the door itself requires only `description` (catalog), so the site is stricter than the door, never looser (W3).
- **V-3 The mobile "Show 2 more red flags" fold is not ported** — the design's CSS hides one flag while the label promises two (page note, trap); all five flags render at every width. `verify.230`/`verify.231` stay unused.
- **V-4 The FAQ block renders at every width** — the design shows it only ≤700 px while always emitting the FAQPage node; DOM and JSON-LD must agree (SEO parity).
- **V-5 The design's sticky mini search bar** (a second, unlabelled `<input>` after 620 px) becomes the foundation's `StickyCtaBar` with two anchor CTAs (`#check`, `#report`) — D20 (no unlabelled input, no duplicate live region). Named delta.
- **V-6 "Print badge" is not ported** (a `document.write` popup with unescaped record fields); badge printing belongs to Operations with the v1.1 stable id. "Copy record link" survives in the dialog scaffold.
- **V-7 The fraud form's three "send us" items (verify.094–096) are the labels of `suspectName`, `suspectContact`, `description`** — the design's numbered list becomes the form itself; the reporter fields use `sys.form.labels.*` (W30).

**Files:**

Create

- `src/app/[locale]/(site)/verify/page.tsx`
- `src/app/[locale]/(site)/verify/actions.ts`
- `src/app/[locale]/(site)/verify/fraud-schema.ts`
- `src/app/[locale]/(site)/verify/register.ts`
- `src/app/[locale]/(site)/verify/lookup.ts`
- `src/app/[locale]/(site)/verify/flags.ts`
- `src/app/[locale]/(site)/verify/_components/LookupCard.tsx`
- `src/app/[locale]/(site)/verify/_components/StepsDisclosure.tsx`
- `src/app/[locale]/(site)/verify/_components/DescriptionCounter.tsx`
- `src/app/[locale]/(site)/verify/_components/RecordDialog.tsx`
- `src/app/[locale]/(site)/verify/_sections/RegisterSection.tsx`
- `src/app/[locale]/(site)/verify/_sections/ReportSection.tsx`
- `src/app/[locale]/(site)/verify/_sections/FraudForm.tsx`
- `e2e/pages/verify.spec.ts`

Modify

- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.verify.*` (inside the existing `seo` object, after `ogTagline`) and a new `sys.verify.*` object (directly after the `form` object)
- `src/lib/seo/routes.ts` — delete `'/verify'` from `UNBUILT_PATHNAMES` (W20)
- `e2e/routes.ts` — append the two locale paths to `GATE_ROUTE_TABLE` (W21)
- `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md`, `docs/ARCHITECTURE.md`, `docs/PRD.md` — Cycle 7

Test

- `src/app/[locale]/(site)/verify/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/register.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/RegisterSection.test.tsx`
- `src/app/[locale]/(site)/verify/__tests__/lookup.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/LookupCard.test.tsx`
- `src/app/[locale]/(site)/verify/__tests__/fraud-schema.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/RecordDialog.test.tsx`
- `e2e/pages/verify.spec.ts`

**Interfaces:**

Consumes (exact names — WP1 code as it exists on `main`, WP2a as spelled in `produces-final.md`):

- WP1: `getBundle` (`@/content/adapter`), `makeT` (`@/content/pure`), `routing`/`Locale` (`@/i18n/routing`), `Link` (`@/i18n/navigation`), `buildMetadata` (`@/lib/seo/metadata`), `JsonLd` is rendered by the blocks (not called directly here), `waLink`/`telLink` (`@/lib/contact`), `formatInt` (`@/lib/format/money`), `track` (`@/analytics/track`), `FormKey` (`@/analytics/forms`), primitives `Button`, `Card`, `Dialog`, `Eyebrow`, `Section`, `Stat` (`@/design/primitives`), `renderWithIntl` (`@/test/render`), `Bundle` type (`contract/website-bundle.v1`).
- WP2a T1: `makeTf` (`@/content/pure`), `Bundle['collections']` raw rows (`bundle.collections.representatives` — NOT a `CollectionSchemas` key; parsed page-locally, see `register.ts`).
- WP2a T2 (forms kernel): `createFormAction`, `FormActionError`, `type FormActionState` (`@/forms/action`); `uploadFraudEvidence`, `isFile`, `MAX_EVIDENCE_FILES` (`@/forms/uploads`); `type WireFields` (`@/forms/wire`); `fieldErrorsFromIssues` (`@/forms/errors`); `FormShell` (`@/forms/client/FormShell`); `Field`, `INPUT_CLASS` (`@/forms/client/Field`); `sys.form.labels.{reporterName,reporterEmail,reporterPhone,suspectName,suspectContact,description,evidence}`, `sys.form.hints.{description,evidence}`, `sys.form.placeholders.*` (all shipped by T2); the `'use server'` page-side wrapper pattern.
- WP2a T3: `ContactLink` (`@/analytics/ContactLink`), `PARAM_ENUMS.outcome` value `'register_unavailable'` and the `verify_lookup` event (`ALLOWED_PARAMS`), `buttonClassName` + `ButtonVariant` `'inverse'` (`@/design/primitives`), `CTA_BY_PATHNAME['/verify']` (this page MUST render `id="report"`), route group `(site)`.
- WP2a T4: `UNBUILT_PATHNAMES` (`@/lib/seo/routes`) and `src/lib/seo/unbuilt.test.ts`; `buildMetadata` with `pageKey` + `fallbackTitle`/`fallbackDescription`; `sys.seo.*` object.
- WP2a T5: `Section` tone `'pale'`, `Stat` with `tone`, `StickyCtaBar` (`@/design/chrome/StickyCtaBar` — `{ message, ctas, showAfterPx?, hideNearId?, live? }`), blocks `Breadcrumbs`, `EmptyState`, `FaqBlock`, `ImageSlot`, `ContactCta`, `type FaqItem` (`@/design/blocks`), `formatDate` (`@/lib/format/date`), `testBundle` (`@/test/bundle`).
- WP2a T6: `Dialog` `variant` (unchanged `'center'` here).
- WP2a T7: `GATE_ROUTE_TABLE` (`e2e/routes.ts`), the page markup contract (`data-testid="page-h1"`, `data-lcp-slot`), `npm run js-size`.
- Ops catalog (T8 / v1.0): form `fraud` — `reporterName` ≤120, `reporterEmail` email, `reporterPhone` phone (≥8 digits), `description` 20…5000 REQUIRED, `suspectName` ≤200, `suspectContact` ≤300, `evidenceKeys` array-of-key ≤3 (`website-fraud/…`); upload `POST /api/website/v1/uploads/fraud-evidence` (write token, multipart `file` only, ≤8 MB, JPEG/PNG/WEBP/PDF sniffed, one file per call).

Produces (later tasks rely on): nothing outside this route. `e2e/pages/` is created here if it does not exist yet (other page tasks add siblings). The `Representative` page-local schema (`register.ts`) is the shape the v1.1 `WebsiteRepresentative` importer must emit — recorded in `docs/CONTENT-MODEL.md`.

**Note on `src/forms/uploads.ts`:** the brief says "write the small server-only helper `src/forms/uploads.ts` in this task". It already exists in the foundation (WP2a Task 2, W29) with `uploadFraudEvidence(file, visitor, opts?)`; this task **consumes** it and does not recreate it (`produces-final.md` wins). What the foundation does not export is the visitor reader (`visitorOf` in `src/forms/action.ts` is module-private), so `actions.ts` re-derives `{ ip, ua }` from `headers()` in six lines — see **Foundation gaps** at the end.

---

#### Cycle 1 — Route skeleton, metadata, hero, `UNBUILT` removal, `sys.seo.verify.*`

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/verify/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key this page reads (W9/W23). Both files must carry each one, non-empty, and
 *  — apart from the example ID — the Turkish must not be a copy of the English. */
export const VERIFY_SYS_KEYS = [
  'seo.verify.title',
  'seo.verify.description',
  'verify.lookup.placeholder',
  'verify.lookup.hint',
  'verify.lookup.resultTitle',
  'verify.lookup.resultBody',
  'verify.lookup.whatsapp',
  'verify.empty.title',
  'verify.empty.body',
  'verify.register.former',
  'verify.register.people',
  'verify.report.submit',
  'verify.report.counter',
  'verify.record.close',
] as const;

const SAME_IN_BOTH = new Set(['verify.lookup.placeholder']);

function read(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object' && k in (acc as Record<string, unknown>))
      return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

describe('sys.verify.* / sys.seo.verify.*', () => {
  for (const key of VERIFY_SYS_KEYS) {
    it(`${key} exists in both locales`, () => {
      const trValue = read(tr.sys, key);
      const enValue = read(en.sys, key);
      expect(typeof trValue, 'tr').toBe('string');
      expect(typeof enValue, 'en').toBe('string');
      expect((trValue as string).length).toBeGreaterThan(0);
      expect((enValue as string).length).toBeGreaterThan(0);
      if (!SAME_IN_BOTH.has(key)) expect(trValue).not.toBe(enValue);
    });
  }

  it('the ICU arguments the page passes are present in both locales', () => {
    for (const f of [tr, en]) {
      expect(read(f.sys, 'verify.lookup.resultBody')).toContain('{query}');
      expect(read(f.sys, 'verify.lookup.hint')).toContain('{min}');
      expect(read(f.sys, 'verify.report.counter')).toContain('{n}');
      expect(read(f.sys, 'verify.report.counter')).toContain('{min}');
      expect(read(f.sys, 'verify.register.people')).toContain('plural');
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/verify"` → every `exists in both locales` case fails with `expected 'undefined' to be 'string'` (no `sys.verify` object yet). Also `npx vitest run src/lib/seo/unbuilt.test.ts` is green right now and will go RED the moment `page.tsx` exists unless `'/verify'` leaves `UNBUILT_PATHNAMES` in the same step — Step 3 does both.

- [ ] **Step 3: Implement**

`src/messages/tr.json` — two key-anchored edits inside `"sys"`. (a) Inside the existing `"seo": { "ogTagline": … }` object add `"verify"` after `"ogTagline"` (keep any `sys.seo.<otherPage>` objects earlier page tasks added):

```json
    "seo": {
      "ogTagline": "Türkiye'deki işverenler için lisanslı iş gücü temini — yurt dışından tedarik, kontrol ve çalışma izinleri.",
      "verify": {
        "title": "JobsAdmire Temsilcisi Doğrulama — Resmî Yetki Kontrolü",
        "description": "Karşınızdaki kişinin gerçekten JobsAdmire adına hareket edip etmediğini kontrol edin: bizim adımıza yalnızca kurucu imza atar, hiç kimse bir işçiden para almaz. JA- kimliğini sorgulayın, uyarı işaretlerini tanıyın, sahtekârı bildirin."
      }
    },
```

(b) Directly after the closing brace of the `"form": { … }` object add:

```json
    "verify": {
      "lookup": {
        "placeholder": "JA-REP-014",
        "hint": "Kimliğin, adın ya da numaranın en az {min} karakterini yazın.",
        "resultTitle": "Herkese açık kayıt defteri henüz yayımlanmadı",
        "resultBody": "“{query}” için çevrim içi doğrulama şu an yapılamıyor. Ofisimizi arayın ya da WhatsApp'tan yazın — bu kişinin JobsAdmire için çalışıp çalışmadığını dakikalar içinde teyit ederiz. O zamana kadar belge ya da para vermeyin.",
        "whatsapp": "WhatsApp'tan sorun"
      },
      "empty": {
        "title": "Kayıt defteri henüz herkese açık değil",
        "body": "Her JobsAdmire temsilcisi bir JA- kimliği taşır. Fotoğrafların ve kayıtların yer aldığı herkese açık kayıt defteri, her kişinin onayıyla hazırlanıyor. Yayımlanana kadar bir adı ya da kimliği ofisimizle telefon veya WhatsApp üzerinden doğrulayın."
      },
      "register": {
        "former": "Artık yetkili değil",
        "people": "{n, plural, one {# kişi} other {# kişi}}"
      },
      "report": {
        "submit": "Bildirimi gönder",
        "counter": "{n} / {min} karakter"
      },
      "record": {
        "close": "Kaydı kapat"
      }
    },
```

`src/messages/en.json` — the same two positions:

```json
    "seo": {
      "ogTagline": "Licensed workforce recruitment for employers in Türkiye — overseas sourcing, vetting and work permits.",
      "verify": {
        "title": "Verify a JobsAdmire Representative — Official Authority Check",
        "description": "Check whether a person really acts for JobsAdmire: only the founder signs for us and nobody collects money from a worker. Look up a JA- ID, know the red flags, report an impostor."
      }
    },
```

```json
    "verify": {
      "lookup": {
        "placeholder": "JA-REP-014",
        "hint": "Type at least {min} characters of the ID, name or number.",
        "resultTitle": "The public register is not published yet",
        "resultBody": "We cannot check “{query}” online yet. Call the office or write to us on WhatsApp — we confirm within minutes whether this person works for JobsAdmire. Until then, do not hand over documents or money.",
        "whatsapp": "Ask on WhatsApp"
      },
      "empty": {
        "title": "The register is not public yet",
        "body": "Every JobsAdmire representative carries a JA- ID. The public register with photos and records is being prepared with each person's consent. Until it is published, confirm any name or ID with the office by phone or WhatsApp."
      },
      "register": {
        "former": "No longer authorised",
        "people": "{n, plural, one {# person} other {# people}}"
      },
      "report": {
        "submit": "Send the report",
        "counter": "{n} / {min} characters"
      },
      "record": {
        "close": "Close record"
      }
    },
```

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES = new Set<keyof typeof pathnames>([ … ])` literal (WP2a Task 4; 19 entries at hand-over, fewer once earlier page tasks ran), **delete the line** `  '/verify',`. Nothing else in the file changes.

`src/app/[locale]/(site)/verify/register.ts` — created in Cycle 2; Cycle 1's page only needs the hero, so the page below imports nothing that does not exist yet. (The page file is written once, here, in its final shape **minus** the imports/sections that later cycles add; each later cycle names the exact lines it adds. Cycle 1 ships the hero + steps skeleton with the lookup card slot rendered as a plain server placeholder.)

`src/app/[locale]/(site)/verify/page.tsx` (Cycle 1 shape):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { makeT, makeTf } from '@/content/pure';
import { Breadcrumbs } from '@/design/blocks';
import { Button } from '@/design/primitives';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  // The package carries no SEO strings for this page (only hire/partner have them), so the
  // record's titleId is '' and buildMetadata takes the sys.seo.verify.* fallbacks (W23/W38).
  return buildMetadata({
    locale,
    href: '/verify',
    bundle,
    pageKey: 'verify',
    fallbackTitle: sys('seo.verify.title'),
    fallbackDescription: sys('seo.verify.description'),
  });
}

const HERO_TICKS = ['verify.027', 'verify.028', 'verify.029'] as const;

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[3px] shrink-0 text-success"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default async function VerifyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);

  return (
    <>
      {/* ===== Hero (dark) — the LCP element is the h1: this hero has no photograph (D26). ===== */}
      <section className="relative overflow-hidden bg-navy pb-14 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgba(24,153,213,0.2),transparent_60%)]"
        />
        <div className="container-site relative pt-7">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            items={[
              { name: t('verify.021'), href: '/' },
              { name: t('verify.006'), href: '/verify' },
            ]}
          />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/[0.07] px-4 py-2 text-body-sm font-bold text-white">
                <span aria-hidden="true" className="inline-block size-2 rounded-full bg-success" />
                {/* W10: the desktop/mobile copy variants are CSS-gated, never conditionally rendered. */}
                <span className="hidden md:inline">{t('verify.001')}</span>
                <span className="md:hidden">{t('verify.022')}</span>
              </p>
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="text-h1 leading-[1.02] tracking-[-0.04em] text-white"
              >
                {t('verify.023')} <span className="text-sky">{t('verify.024')}</span>
              </h1>
              <p className="mt-5 max-w-[540px] text-body-lg text-white/75">
                <span className="hidden md:inline">{tf('verify.025')}</span>
                <span className="md:hidden">{tf('verify.026')}</span>
              </p>
              <ul className="mt-6 flex list-none flex-col gap-2.5 p-0">
                {HERO_TICKS.map((id) => (
                  <li
                    key={id}
                    className="flex items-start gap-3 text-body-sm font-bold text-white/80"
                  >
                    <CheckIcon />
                    <span>{t(id)}</span>
                  </li>
                ))}
              </ul>
              <Button variant="inverse" size="lg" href="#structure" className="mt-6">
                {t('verify.030')}
              </Button>
            </div>
            {/* Cycle 3 replaces this placeholder with <LookupCard …/> (id="check"). */}
            <div id="check" />
          </div>
          {/* Cycle 3 mounts <StepsDisclosure> here. */}
        </div>
      </section>
      {/* Cycle 2: <RegisterSection …/> (id="structure") */}
      {/* Cycle 4: <ReportSection …/> (id="report" — CTA_BY_PATHNAME['/verify'] points here) */}
      {/* Cycle 5: FAQ block */}
    </>
  );
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/verify" src/messages` → `npx vitest run "src/app/\[locale\]/(site)/verify" src/messages src/lib/seo` → the 14 sys-key cases + the ICU case pass; `src/messages/messages.test.ts` (identical key sets) passes; `src/lib/seo/unbuilt.test.ts` passes (the filesystem now has `verify/page.tsx` and the set no longer lists it). `npm run verify` → typecheck, lint, format, unit tests all green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/verify" src/messages/tr.json src/messages/en.json src/lib/seo/routes.ts
git commit -m "feat(verify): route skeleton, metadata from sys.seo.verify, dark hero with breadcrumbs (T10 c1)

/temsilci-dogrulama and /en/verify leave UNBUILT_PATHNAMES (W20). The h1 is the LCP slot;
the desktop/mobile hero copy variants are CSS-gated (W10).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — The register data layer and the structure section (stats, founder, register, former, firewall) — every part data-driven, empty in Phase A

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/verify/__tests__/register.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { readRegister, RegisterError, type Representative } from '../register';

export const FOUNDER: Representative = {
  id: 'JA-REP-001',
  name: 'Founder Example',
  role: 'Founder · sole signatory',
  level: 'founder',
  desk: null,
  city: 'Antalya',
  country: 'TR',
  languages: ['tr', 'en'],
  contact: '+905011240340',
  validUntil: null,
  reportsTo: null,
  since: '2022-01',
  status: 'active',
  canSign: true,
  photo: null,
  updatedAt: '2026-07-29T08:00:00.000Z',
};

export const FORMER: Representative = {
  ...FOUNDER,
  id: 'JA-REP-018',
  name: 'Former Example',
  role: 'Coordinator',
  level: 'coordinator',
  city: 'Lahore',
  country: 'PK',
  status: 'former',
  canSign: false,
  since: null,
  updatedAt: '2026-02-14T00:00:00.000Z',
};

describe('readRegister', () => {
  it('is empty when the bundle has no representatives collection (Phase A)', () => {
    const r = readRegister(testBundle());
    expect(r).toEqual({ rows: [], active: [], former: [], founder: null, updatedAt: null });
  });

  it('parses rows, splits active/former, finds the signing founder and the latest update', () => {
    const bundle = testBundle({ collections: { representatives: [FOUNDER, FORMER] } });
    const r = readRegister(bundle);
    expect(r.rows).toHaveLength(2);
    expect(r.active.map((x) => x.id)).toEqual(['JA-REP-001']);
    expect(r.former.map((x) => x.id)).toEqual(['JA-REP-018']);
    expect(r.founder?.id).toBe('JA-REP-001');
    expect(r.updatedAt).toBe('2026-07-29T08:00:00.000Z');
  });

  it('fails closed: an unknown status is a schema miss, never "active"', () => {
    const bundle = testBundle({
      collections: { representatives: [{ ...FOUNDER, status: 'whatever' }] },
    });
    expect(() => readRegister(bundle, 'test')).toThrow(RegisterError);
    // production: the row is dropped, the page renders its empty state
    expect(readRegister(bundle, 'production').rows).toEqual([]);
  });

  it('a suspended founder or one who may not sign is not "the founder"', () => {
    const suspended = { ...FOUNDER, status: 'suspended' as const };
    expect(readRegister(testBundle({ collections: { representatives: [suspended] } })).founder).toBeNull();
    const noSign = { ...FOUNDER, canSign: false };
    expect(readRegister(testBundle({ collections: { representatives: [noSign] } })).founder).toBeNull();
  });
});
```

`src/app/[locale]/(site)/verify/__tests__/RegisterSection.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { testBundle } from '@/test/bundle';
import { RegisterSection } from '../_sections/RegisterSection';
import { readRegister } from '../register';
import { FOUNDER, FORMER } from './register.test';

// `Stat` (WP1) animates its count-up only in view; jsdom has no IntersectionObserver.
beforeAll(() => {
  if (!('IntersectionObserver' in globalThis)) {
    class IO {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    Object.assign(globalThis, { IntersectionObserver: IO });
  }
});

const STRINGS = {
  'verify.053': '01 · Our people',
  'verify.054': 'One signature at the top.',
  'verify.055': 'Trusted hands everywhere else.',
  'verify.056': 'Anyone not on this page does not act for JobsAdmire.',
  'verify.057': 'Authorised people',
  'verify.058': 'Office team',
  'verify.059': 'Countries',
  'verify.060': 'Sole signatory',
  'verify.061': 'Authorised · no expiry',
  'verify.062': 'Open record',
  'verify.063': 'A contract signed by anyone else does not bind JobsAdmire.',
  'verify.046': 'Authorised',
  'verify.051': 'Call the office',
  'verify.068': 'Person',
  'verify.069': 'City',
  'verify.070': 'Representative ID',
  'verify.071': 'Status',
  'verify.073': 'No longer authorised:',
  'verify.074': 'Partner agencies are not on this chart on purpose.',
  'verify.075': 'They are suppliers abroad.',
  'verify.076': 'How partnering works',
  'verify.225': 'Register last updated:',
  'verify.259': 'Suspended',
};

describe('RegisterSection', () => {
  it('Phase A: renders the designed empty state, no stats, no founder, no former strip', () => {
    const bundle = testBundle({ strings: STRINGS });
    renderWithIntl(
      <RegisterSection bundle={bundle} locale="en" register={readRegister(bundle)} />,
      { locale: 'en' },
    );
    expect(screen.getByTestId('verify-structure')).toBeInTheDocument();
    const empty = screen.getByTestId('verify-empty');
    expect(empty).toHaveAttribute('role', 'status');
    expect(empty).toHaveTextContent('The register is not public yet');
    expect(screen.queryByTestId('verify-stats')).toBeNull();
    expect(screen.queryByTestId('verify-founder')).toBeNull();
    expect(screen.queryByTestId('verify-former')).toBeNull();
    // the firewall note is static copy and always renders
    expect(screen.getByText('Partner agencies are not on this chart on purpose.')).toBeInTheDocument();
  });

  it('with rows: stats, founder strip, the register list and the former strip appear; no empty state', () => {
    const bundle = testBundle({
      strings: STRINGS,
      collections: { representatives: [FOUNDER, FORMER] },
    });
    renderWithIntl(
      <RegisterSection bundle={bundle} locale="en" register={readRegister(bundle)} />,
      { locale: 'en' },
    );
    expect(screen.queryByTestId('verify-empty')).toBeNull();
    expect(screen.getByTestId('verify-stats')).toHaveTextContent('Register last updated: 29 July 2026');
    expect(screen.getByTestId('verify-founder')).toHaveTextContent('Founder Example');
    expect(screen.getByTestId('verify-founder')).toHaveTextContent('Sole signatory');
    expect(screen.getByTestId('verify-register')).toHaveTextContent('JA-REP-001');
    expect(screen.getByTestId('verify-former')).toHaveTextContent('Former Example · JA-REP-018');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/verify"` → both new files fail to import (`Cannot find module '../register'`, `'../_sections/RegisterSection'`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/verify/register.ts` (no directive — pure, unit-tested):

```ts
import { z } from 'zod';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/**
 * The page-local shape of one `representatives` row — the v1.1 `WebsiteRepresentative` record
 * (D9: consent record, stable public id, company contacts only). `representatives` is NOT one
 * of `CollectionSchemas`' eight Phase A keys (it is a FIXTURE_ONLY collection, refused in
 * production under LOCAL — D23), so it is parsed here, with the same dev-throw / prod-drop
 * rule `getCollection` applies. Fail closed: `status` is an enum — the design's "unknown =
 * Authorised" fallback is exactly what this schema forbids.
 */
export const REPRESENTATIVE_LEVELS = ['founder', 'office', 'rep', 'coordinator'] as const;
export const REPRESENTATIVE_STATUSES = ['active', 'suspended', 'former'] as const;
export type RepresentativeLevel = (typeof REPRESENTATIVE_LEVELS)[number];
export type RepresentativeStatus = (typeof REPRESENTATIVE_STATUSES)[number];

export const RepresentativeSchema = z.object({
  id: z.string().regex(/^JA-[A-Z]{2,5}-\d{3}$/),
  name: z.string().min(1),
  /** Locale-resolved by the bundle (like `sourceCountries.name`), never a package id. */
  role: z.string().min(1),
  level: z.enum(REPRESENTATIVE_LEVELS),
  desk: z.string().nullable(),
  city: z.string().min(1),
  /** ISO-2 upper-case (W40). */
  country: z.string().regex(/^[A-Z]{2}$/),
  languages: z.array(z.string()),
  /** A company number or an @jobsadmire.com address only (D9 v1.1) — or nothing. */
  contact: z.string().nullable(),
  /** YYYY-MM-DD; null = no expiry. */
  validUntil: z.string().nullable(),
  /** Another JA- id. */
  reportsTo: z.string().nullable(),
  /** YYYY-MM. */
  since: z.string().nullable(),
  status: z.enum(REPRESENTATIVE_STATUSES),
  canSign: z.boolean(),
  photo: z.string().url().nullable(),
  updatedAt: z.string().datetime(),
});
export type Representative = z.infer<typeof RepresentativeSchema>;

export type Register = {
  rows: Representative[];
  active: Representative[];
  former: Representative[];
  /** The one active founder who may sign — the founder strip's source; null hides it (§10 row 3). */
  founder: Representative | null;
  /** The latest `updatedAt` across rows — the "Register last updated" label; null hides it (D17). */
  updatedAt: string | null;
};

export class RegisterError extends Error {}

export function readRegister(bundle: Bundle, env = process.env.NODE_ENV): Register {
  const raw = bundle.collections.representatives ?? [];
  const rows: Representative[] = [];
  raw.forEach((row, i) => {
    const parsed = RepresentativeSchema.safeParse(row);
    if (parsed.success) {
      rows.push(parsed.data);
      return;
    }
    const why = parsed.error.issues.map((x) => `${x.path.join('.')} ${x.message}`).join('; ');
    if (env !== 'production') throw new RegisterError(`representatives[${i}]: ${why}`);
    console.error('[verify] representatives row dropped (schema miss)', { index: i });
  });
  const active = rows.filter((r) => r.status === 'active');
  const former = rows.filter((r) => r.status !== 'active');
  const founder = active.find((r) => r.level === 'founder' && r.canSign) ?? null;
  const updatedAt = rows.length
    ? rows.map((r) => r.updatedAt).reduce((a, b) => (a > b ? a : b))
    : null;
  return { rows, active, former, founder, updatedAt };
}
```

`src/app/[locale]/(site)/verify/_sections/RegisterSection.tsx` (server component, no directive):

```tsx
import { useTranslations } from 'next-intl';
import { makeT, makeTf } from '@/content/pure';
import { EmptyState, ImageSlot } from '@/design/blocks';
import { Button, Eyebrow, Section, Stat } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { telLink } from '@/lib/contact';
import { formatDate } from '@/lib/format/date';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { Register, Representative } from '../register';

type Props = { bundle: Bundle; locale: Locale; register: Register };

/** `useTranslations` is legal in a server component (next-intl); the page passes nothing
 *  through the client boundary from here. */
export function RegisterSection({ bundle, locale, register }: Props) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const updatedLabel = register.updatedAt
    ? `${t('verify.225')} ${formatDate(register.updatedAt.slice(0, 10), locale)}`
    : null;

  return (
    <Section tone="pale" id="structure" className="scroll-mt-5">
      <div className="container-site" data-testid="verify-structure">
        <div className="mx-auto mb-10 max-w-[660px] text-center">
          <Eyebrow>{t('verify.053')}</Eyebrow>
          <h2 className="text-h2 mt-3 leading-[1.05] tracking-[-0.04em]">
            {t('verify.054')}
            <br />
            {t('verify.055')}
          </h2>
          <p className="mt-3 text-body-lg text-text-secondary">{tf('verify.056')}</p>
        </div>

        <StatsStrip register={register} locale={locale} t={t} updatedLabel={updatedLabel} />
        <FounderStrip founder={register.founder} t={t} />

        {register.active.length === 0 ? (
          <EmptyState
            testId="verify-empty"
            tone="light"
            headingLevel={3}
            title={sys('verify.empty.title')}
            body={sys('verify.empty.body')}
            cta={{ label: t('verify.051'), href: telLink(bundle.settings.phone) }}
          />
        ) : (
          <RegisterList rows={register.active} t={t} />
        )}

        <FormerStrip former={register.former} t={t} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-md border border-border-1 bg-gradient-to-b from-pale-1 to-tint p-6">
          <p className="m-0 max-w-[760px] text-body-sm font-bold text-text-secondary">
            <span className="font-extrabold text-ink">{t('verify.074')}</span> {tf('verify.075')}
          </p>
          <Button variant="secondary" href="/partner-with-us">
            {t('verify.076')}
          </Button>
        </div>
      </div>
    </Section>
  );
}

/** W1/D17: the three figures are register-derived; with no active rows there is nothing to
 *  claim, so the strip is not rendered. */
function StatsStrip({
  register,
  locale,
  t,
  updatedLabel,
}: {
  register: Register;
  locale: Locale;
  t: (id: string) => string;
  updatedLabel: string | null;
}) {
  if (register.active.length === 0) return null;
  const people = register.active.length;
  const desks = register.active.filter((r) => r.level === 'office').length;
  const countries = new Set(register.active.map((r) => r.country)).size;
  return (
    <div
      data-testid="verify-stats"
      className="mb-5 flex flex-wrap items-center gap-9 rounded-base border border-border-1 bg-white px-6 py-4 shadow-card"
    >
      <Stat value={people} label={t('verify.057')} locale={locale} />
      <Stat value={desks} label={t('verify.058')} locale={locale} />
      <Stat value={countries} label={t('verify.059')} locale={locale} />
      {updatedLabel ? (
        <p className="m-0 ml-auto text-body-sm font-bold text-muted">{updatedLabel}</p>
      ) : null}
    </div>
  );
}

/** §10 row 3 / W6: rendered only from a real founder row (never from the hard-coded claims). */
function FounderStrip({
  founder,
  t,
}: {
  founder: Representative | null;
  t: (id: string) => string;
}) {
  if (!founder) return null;
  return (
    <article
      data-testid="verify-founder"
      className="mb-6 flex flex-wrap items-center gap-6 rounded-lg border border-[#c9d3ec] bg-white p-6 shadow-card-hover"
    >
      <div className="size-[84px] shrink-0 overflow-hidden rounded-full ring-4 ring-tint">
        <ImageSlot
          slot="rep-founder"
          src={founder.photo}
          alt={founder.name}
          width={84}
          height={84}
          sizes="84px"
          className="size-full object-cover"
        />
      </div>
      <div className="min-w-[240px]">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="m-0 text-card-title">{founder.name}</h3>
          {founder.canSign ? (
            <span className="rounded-pill bg-[#253063] px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[1.1px] text-white">
              {t('verify.060')}
            </span>
          ) : null}
        </div>
        <p className="mt-1 mb-0 text-body-sm font-bold text-text-secondary">{founder.role}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          {founder.validUntil === null ? (
            <span className="inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-extrabold text-success-text">
              <span aria-hidden="true" className="inline-block size-2 rounded-full bg-success" />
              {t('verify.061')}
            </span>
          ) : null}
          <span className="text-body-sm font-extrabold text-muted">{founder.id}</span>
        </div>
      </div>
      <div className="ml-auto flex max-w-[340px] flex-col items-end gap-2.5">
        {/* V-1: the record deep link is ?id= on this route. */}
        <Link
          href={{ pathname: '/verify', query: { id: founder.id } }}
          className="inline-flex min-h-[44px] items-center rounded-xs border border-border-1 bg-white px-6 text-body-sm font-extrabold text-[#253063] no-underline hover:bg-pale-1"
        >
          {t('verify.062')}
        </Link>
        <p className="m-0 text-right text-body-sm font-bold text-danger">{t('verify.063')}</p>
      </div>
    </article>
  );
}

/** The v1.1 register, minimal: one accessible row per active person with the four design
 *  columns. The sidebar/panel/grouping UI of the design is v1.1 work on top of this list. */
function RegisterList({ rows, t }: { rows: Representative[]; t: (id: string) => string }) {
  return (
    <div
      data-testid="verify-register"
      className="overflow-hidden rounded-md border border-border-1 bg-white shadow-card"
    >
      <table className="w-full border-collapse text-left">
        <thead className="bg-pale-2 text-[11px] font-extrabold uppercase tracking-[1.1px] text-muted">
          <tr>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.068')}
            </th>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.069')}
            </th>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.070')}
            </th>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.071')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border-3">
              <td className="px-6 py-3">
                <span className="block font-extrabold">{r.name}</span>
                <span className="block text-body-sm text-text-tertiary">
                  {r.desk ? `${r.desk} · ` : ''}
                  {r.role}
                </span>
              </td>
              <td className="px-6 py-3 text-body-sm font-bold text-text-secondary">{r.city}</td>
              <td className="px-6 py-3">
                <Link
                  href={{ pathname: '/verify', query: { id: r.id } }}
                  className="inline-block rounded-input border border-border-1 bg-pale-1 px-3 py-1.5 text-body-sm font-extrabold text-[#253063] no-underline"
                >
                  {r.id} →
                </Link>
              </td>
              <td className="px-6 py-3 text-body-sm font-extrabold text-success-text">
                {t('verify.046')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** README rule: former representatives stay visible on purpose — but only when there are any. */
function FormerStrip({ former, t }: { former: Representative[]; t: (id: string) => string }) {
  if (former.length === 0) return null;
  return (
    <div
      data-testid="verify-former"
      className="mt-4 flex flex-wrap items-center gap-3 rounded-sm border border-danger-border bg-danger-surface px-4 py-3"
    >
      <span className="text-[11.5px] font-extrabold uppercase tracking-[1.2px] text-danger">
        {t('verify.073')}
      </span>
      {former.map((r) => (
        <span
          key={r.id}
          className="inline-flex items-center gap-2 rounded-pill border border-danger-border bg-white px-3.5 py-1.5"
        >
          <span aria-hidden="true" className="inline-block size-[7px] rounded-full bg-danger" />
          <span className="text-body-sm font-extrabold text-[#7f1d1d]">
            {r.name} · {r.id}
          </span>
          <span className="text-body-sm font-semibold text-danger">
            {r.status === 'suspended' ? t('verify.259') : r.role}
          </span>
        </span>
      ))}
    </div>
  );
}
```

`src/app/[locale]/(site)/verify/page.tsx` — Cycle 2 edits: add the imports

```tsx
import { RegisterSection } from './_sections/RegisterSection';
import { readRegister } from './register';
```

after `import { buildMetadata } from '@/lib/seo/metadata';`; in the default export, after `const tf = makeTf(bundle, locale);` add `const register = readRegister(bundle);`; replace the comment line `{/* Cycle 2: <RegisterSection …/> (id="structure") */}` with

```tsx
      <RegisterSection bundle={bundle} locale={locale} register={register} />
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/verify"` → `npx vitest run "src/app/\[locale\]/(site)/verify"` → `register.test.ts` 4 passed, `RegisterSection.test.tsx` 2 passed, `sys-keys.test.ts` 15 passed. `npm run verify` green. Notes: `testBundle()` (Task 5) parses the golden fixture, which carries the eight Phase A collections — `makeTf` inside the section resolves `metricValues` from it exactly as Task 5's own block tests do; `strings` overrides are merged over the fixture's, so every `verify.*` id the section reads is in `STRINGS` (makeT throws on an unknown id under test). If `next-intl`'s `useTranslations` complains that no provider is mounted, the test already wraps with `renderWithIntl` — check the `locale: 'en'` option is passed as shown.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/verify"
git commit -m "feat(verify): register data layer (fail-closed schema) and the structure section — empty state in Phase A (T10 c2)

Stats, founder strip, register list and former strip render only from representatives rows
(W6, §10 rows 3/11, D17); with none the EmptyState carries the designed copy.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — The lookup island (client-only, neutral W6 result, `?id=` deep link, `verify_lookup`), the steps disclosure, the sticky bar

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/verify/__tests__/lookup.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { LOOKUP_MIN_CHARS, normaliseQuery, readDeepLinkId } from '../lookup';

describe('normaliseQuery', () => {
  it('trims and collapses whitespace, keeps case (ids are shown as typed)', () => {
    expect(normaliseQuery('  JA-REP-014 ')).toBe('JA-REP-014');
    expect(normaliseQuery('Haris   Jiva')).toBe('Haris Jiva');
    expect(normaliseQuery('')).toBe('');
  });
  it('the result threshold is three characters', () => {
    expect(LOOKUP_MIN_CHARS).toBe(3);
  });
});

describe('readDeepLinkId (V-1: ?id= on this route; ?rep= and #id= as the design aliases)', () => {
  it('reads ?id=', () => {
    expect(readDeepLinkId('?id=JA-REP-001', '')).toBe('JA-REP-001');
  });
  it('reads ?rep= and #id=', () => {
    expect(readDeepLinkId('?rep=JA-REP-002', '')).toBe('JA-REP-002');
    expect(readDeepLinkId('', '#id=JA-REP-003')).toBe('JA-REP-003');
  });
  it('prefers ?id=, decodes, trims, caps the length and refuses an empty value', () => {
    expect(readDeepLinkId('?rep=B&id=A', '')).toBe('A');
    expect(readDeepLinkId('?id=JA%2DREP%2D004%20', '')).toBe('JA-REP-004');
    expect(readDeepLinkId('?id=', '#id=')).toBeNull();
    expect(readDeepLinkId(`?id=${'x'.repeat(200)}`, '')).toHaveLength(80);
    expect(readDeepLinkId('', '')).toBeNull();
  });
});
```

`src/app/[locale]/(site)/verify/__tests__/LookupCard.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { LookupCard, type LookupLabels } from '../_components/LookupCard';

// The record dialog is a v1.1 chunk behind RECORD_DIALOG_ENABLED; never loaded here.
vi.mock('next/dynamic', () => ({ default: () => () => null }));

const labels: LookupLabels = {
  heading: 'Check the ID before the meeting',
  inputLabel: 'Representative ID, name, city or number',
  clear: 'Clear',
  callOffice: 'Call the office instead',
  callOfficeShort: 'Call the office',
  note: 'The ID is printed on the badge every representative carries.',
  whatsappIntro: 'Hello JobsAdmire, I want to check something about',
};

function renderCard(extra: Partial<React.ComponentProps<typeof LookupCard>> = {}) {
  return renderWithIntl(
    <LookupCard
      labels={labels}
      phone="+905011240340"
      whatsappNumber="905011240340"
      livePill={null}
      updatedLabel={null}
      recordLabels={null}
      {...extra}
    />,
    { locale: 'en' },
  );
}

const lookups = () =>
  (window.dataLayer ?? []).filter((e) => e.event === 'verify_lookup');

describe('LookupCard (W6: the neutral result, never the red verdict)', () => {
  beforeEach(() => {
    window.dataLayer = [];
    window.history.replaceState(null, '', '/');
  });

  it('shows the neutral result after three characters, fires verify_lookup once, clears', () => {
    renderCard();
    const input = screen.getByLabelText(labels.inputLabel);
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();

    fireEvent.change(input, { target: { value: 'JA' } });
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
    expect(lookups()).toHaveLength(0);

    fireEvent.change(input, { target: { value: 'JA-REP-014' } });
    const result = screen.getByTestId('verify-lookup-result');
    expect(result).toHaveAttribute('role', 'status');
    expect(result).toHaveAttribute('data-outcome', 'register_unavailable');
    expect(result).toHaveTextContent('The public register is not published yet');
    expect(result).toHaveTextContent('JA-REP-014');
    expect(result).not.toHaveTextContent('Not on our authorised list');
    expect(lookups()).toEqual([
      { event: 'verify_lookup', page: '/', locale: 'en', outcome: 'register_unavailable' },
    ]);

    // more typing on the same query session does not re-fire
    fireEvent.change(input, { target: { value: 'JA-REP-0145' } });
    expect(lookups()).toHaveLength(1);

    fireEvent.click(screen.getByTestId('verify-lookup-clear'));
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
    expect(input).toHaveValue('');

    // a new query is a new lookup
    fireEvent.change(input, { target: { value: 'Ali' } });
    expect(lookups()).toHaveLength(2);
  });

  it('the two contact doors carry the page_cta placement and the WhatsApp prefill echoes the query', () => {
    renderCard();
    fireEvent.change(screen.getByLabelText(labels.inputLabel), {
      target: { value: 'JA-REP-014' },
    });
    // anchored: the card's own "Call the office instead" link shares the prefix
    const call = screen.getByRole('link', { name: /^Call the office$/ });
    expect(call).toHaveAttribute('href', 'tel:+905011240340');
    const wa = screen.getByRole('link', { name: /^Ask on WhatsApp$/ });
    expect(wa.getAttribute('href')).toContain('https://wa.me/905011240340?text=');
    expect(decodeURIComponent(wa.getAttribute('href') ?? '')).toContain(
      'Hello JobsAdmire, I want to check something about JA-REP-014',
    );
    fireEvent.click(call);
    expect(window.dataLayer?.some((e) => e.event === 'call_click' && e.placement === 'page_cta')).toBe(true);
  });

  it('Escape clears the query', () => {
    renderCard();
    const input = screen.getByLabelText(labels.inputLabel);
    fireEvent.change(input, { target: { value: 'JA-REP-014' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
  });

  it('a ?id= deep link prefills the query and shows the result on mount (V-1)', () => {
    window.history.replaceState(null, '', '/en/verify?id=JA-REP-001');
    renderCard();
    expect(screen.getByLabelText(labels.inputLabel)).toHaveValue('JA-REP-001');
    expect(screen.getByTestId('verify-lookup-result')).toHaveAttribute(
      'data-outcome',
      'register_unavailable',
    );
    expect(lookups()).toHaveLength(1);
  });

  it('hides the live pill and the updated label when the page passes null (D17)', () => {
    renderCard();
    expect(screen.queryByTestId('verify-live-pill')).toBeNull();
    expect(screen.queryByTestId('verify-updated')).toBeNull();
    renderCard({ livePill: '14 people authorised today', updatedLabel: 'Register last updated: 29 July 2026' });
    expect(screen.getByTestId('verify-live-pill')).toHaveTextContent('14 people authorised today');
    expect(screen.getByTestId('verify-updated')).toHaveTextContent('29 July 2026');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/verify"` → `lookup.test.ts` and `LookupCard.test.tsx` fail on the missing modules.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/verify/lookup.ts` (pure):

```ts
/** A result renders once the normalised query has this many characters (the design's `> 2`). */
export const LOOKUP_MIN_CHARS = 3;
/** Longest id/name the URL may prefill — a badge id is 10 characters; 80 covers a full name. */
export const DEEP_LINK_MAX = 80;
/** V-1: `?id=` is the canonical form; `?rep=` and `#id=` are the design's aliases. */
export const DEEP_LINK_PARAMS = ['id', 'rep'] as const;

export function normaliseQuery(q: string): string {
  return q.trim().replace(/\s+/g, ' ');
}

/** The prefilled query from `location.search` / `location.hash`, or null. Never throws: a
 *  malformed percent-escape falls back to the raw value. */
export function readDeepLinkId(search: string, hash: string): string | null {
  const params = new URLSearchParams(search);
  const candidates: (string | null)[] = DEEP_LINK_PARAMS.map((k) => params.get(k));
  const m = /^#id=(.*)$/.exec(hash);
  if (m) {
    let v = m[1];
    try {
      v = decodeURIComponent(v);
    } catch {
      /* keep raw */
    }
    candidates.push(v);
  }
  for (const c of candidates) {
    if (c === null || c === undefined) continue;
    const v = normaliseQuery(c).slice(0, DEEP_LINK_MAX);
    if (v.length > 0) return v;
  }
  return null;
}
```

`src/app/[locale]/(site)/verify/flags.ts`:

```ts
/**
 * D9 v1.1: the record dialog opens the moment `WebsiteRepresentative` rows ship with consent
 * and the website's `no-store` record handler exists (`src/app/api/verify/record/route.ts`,
 * V-1). Typed `boolean` (not the literal `false`) so the guarded branches type-check.
 */
export const RECORD_DIALOG_ENABLED: boolean = false;
```

`src/app/[locale]/(site)/verify/_components/RecordDialog.tsx` (default export — `next/dynamic` in `LookupCard` imports it lazily; the QR is a v1.1 server-rendered SVG string from the record handler (`qrSvg`, spec §3.1 local QR), passed in as `qrSvg?`; the May-do/May-never lists (verify.198–218, level-keyed) join in v1.1 with the handler's `level` — not scaffolded, see the comment):

```tsx
'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { Dialog } from '@/design/primitives';
import { waLink } from '@/lib/contact';
import type { Representative, RepresentativeStatus } from '../register';

/** Every label is a prop (W9); the page resolves the package ids when the flag is on. */
export type RecordLabels = {
  badgeQr: string; // verify.109
  badgeQrHint: string; // verify.110
  authorisedUntil: string; // verify.111
  noExpiry: string; // verify.241
  contact: string; // verify.112
  languages: string; // verify.113
  reportsTo: string; // verify.114
  withJobsAdmire: string; // verify.115
  desk: string; // verify.116
  soleSignatory: string; // verify.060
  servedFrom: string; // verify.238
  copyLink: string; // verify.226
  copied: string; // verify.267
  wrong: string; // verify.239
  status: Record<RepresentativeStatus, string>; // verify.046 · verify.259 · sys.verify.register.former
  whatsappIntro: string; // verify.228
};

const HEAD: Record<RepresentativeStatus, string> = {
  active: 'bg-success',
  suspended: 'bg-warning',
  former: 'bg-danger',
};

export default function RecordDialog({
  open,
  record,
  labels,
  recordUrl,
  whatsappNumber,
  qrSvg,
  onClose,
}: {
  open: boolean;
  record: Representative;
  labels: RecordLabels;
  /** V-1: the permanent `?id=` URL of this record — what the badge QR encodes. */
  recordUrl: string;
  whatsappNumber: string;
  /** v1.1: an `<svg>` string from the record handler (local encoder, never a data URL from a third party). */
  qrSvg?: string;
  onClose: () => void;
}) {
  const sys = useTranslations('sys');
  const [copied, setCopied] = useState(false);
  const titleId = `rec-${record.id}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(recordUrl);
      setCopied(true);
    } catch {
      /* clipboard blocked: the URL is visible in the address bar */
    }
  };
  const meta: [string, string][] = [
    [labels.authorisedUntil, record.validUntil ?? labels.noExpiry],
    [labels.contact, record.contact ?? '—'],
    [labels.languages, record.languages.join(', ') || '—'],
    [labels.reportsTo, record.reportsTo ?? '—'],
    [labels.withJobsAdmire, record.since ?? '—'],
    [labels.desk, record.desk ?? '—'],
  ];
  return (
    <Dialog open={open} onClose={onClose} titleId={titleId}>
      <div className={`-m-6 mb-4 flex items-center justify-between px-6 py-3 text-white ${HEAD[record.status]}`}>
        <span className="text-body-sm font-extrabold uppercase tracking-[1.2px]">
          {labels.status[record.status]}
        </span>
        <span className="flex items-center gap-3">
          <span className="text-body-sm font-extrabold">{record.id}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={sys('verify.record.close')}
            className="flex size-8 items-center justify-center rounded-full border border-white/40 bg-white/15 text-body font-extrabold hover:bg-white hover:text-ink"
          >
            ×
          </button>
        </span>
      </div>
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="m-0 text-card-title">
            {record.name}
          </h2>
          <p className="mt-1 mb-0 text-body-sm font-bold text-text-secondary">{record.role}</p>
          <p className="mt-0.5 mb-0 text-body-sm text-text-tertiary">
            {record.city}, {record.country}
          </p>
          {record.canSign && record.status === 'active' ? (
            <p className="mt-2 mb-0 inline-flex rounded-pill bg-[#253063] px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.6px] text-white">
              {labels.soleSignatory}
            </p>
          ) : null}
        </div>
        {qrSvg ? (
          <figure className="m-0 hidden shrink-0 text-center md:block">
            <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <figcaption className="mt-1 text-[11px] font-extrabold uppercase tracking-[1px] text-muted">
              {labels.badgeQr}
            </figcaption>
          </figure>
        ) : null}
      </div>
      <p className="mt-3 mb-0 text-body-sm text-text-tertiary">{labels.badgeQrHint}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {meta.map(([k, v]) => (
          <div key={k} className="rounded-xs border border-border-1 bg-pale-1 p-3">
            <dt className="text-[11px] font-extrabold uppercase tracking-[1px] text-muted">{k}</dt>
            <dd className="m-0 mt-1 text-body-sm font-bold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {/* v1.1: the level-keyed May do / May never lists (verify.117/118, verify.198–218) render here
          from the handler's `level`; not scaffolded — the lists are static package copy per level. */}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border-1 pt-4">
        <button type="button" onClick={copy} className="text-body-sm font-extrabold text-blue-safe">
          {labels.copyLink}
        </button>
        <span role="status" className="text-body-sm font-bold text-success-text">
          {copied ? labels.copied : ''}
        </span>
        <ContactLink
          href={waLink(whatsappNumber, `${labels.whatsappIntro} ${record.id}`)}
          placement="page_cta"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-body-sm font-extrabold text-danger"
        >
          {labels.wrong}
        </ContactLink>
      </div>
    </Dialog>
  );
}
```

`src/app/[locale]/(site)/verify/_components/LookupCard.tsx`:

```tsx
'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { track } from '@/analytics/track';
import { buttonClassName } from '@/design/primitives';
import { INPUT_CLASS } from '@/forms/client/Field';
import { telLink, waLink } from '@/lib/contact';
import { RECORD_DIALOG_ENABLED } from '../flags';
import { LOOKUP_MIN_CHARS, normaliseQuery, readDeepLinkId } from '../lookup';
import type { Representative } from '../register';
import type { RecordLabels } from './RecordDialog';

// v1.1 chunk: declared here so the flag flip is one line, never fetched while the flag is off.
const RecordDialog = dynamic(() => import('./RecordDialog'), { ssr: false });

/** Every label is a prop (W9): the page resolves the package ids server-side. */
export type LookupLabels = {
  heading: string; // verify.031
  inputLabel: string; // verify.032
  clear: string; // verify.033
  callOffice: string; // verify.034 (the card's button)
  callOfficeShort: string; // verify.051 (the result's button)
  note: string; // verify.035
  whatsappIntro: string; // verify.228
};

export type LookupCardProps = {
  labels: LookupLabels;
  phone: string;
  whatsappNumber: string;
  /** `<n> people authorised today` composed by the page from the register; null hides it (W6/D17). */
  livePill: string | null;
  /** `Register last updated: <date>`; null hides it (D17). */
  updatedLabel: string | null;
  /** Resolved only while RECORD_DIALOG_ENABLED (v1.1); null today. */
  recordLabels: RecordLabels | null;
};

const subscribeNoop = () => () => {};
const readClientDeepLink = () => readDeepLinkId(window.location.search, window.location.hash);
const readServerDeepLink = () => null;

/**
 * Phase A (W6): there is no published register, so every lookup answers the neutral
 * "register not published — verify with the office" result. The red "Not on our authorised
 * list" verdict (verify.048–050) is legal copy about a person and is never rendered here.
 * v1.1 fetches the record through the website's own no-store handler (V-1) and opens
 * `RecordDialog`; nothing in this island talks to Operations (D6).
 */
export function LookupCard({
  labels,
  phone,
  whatsappNumber,
  livePill,
  updatedLabel,
  recordLabels,
}: LookupCardProps) {
  const sys = useTranslations('sys');
  const locale = useLocale();
  // R35: the real URL, not next-intl's internal key.
  const page = usePathname() ?? '/';
  const inputId = useId();
  const hintId = `${inputId}-hint`;

  // V-1: the deep link is a browser fact read after hydration (R18/R27 pattern — no
  // setState in an effect, no hydration mismatch). Once the visitor types, `typed` wins;
  // Clear sets '' (not null) so the URL id does not reassert itself.
  const deepLinkId = useSyncExternalStore(subscribeNoop, readClientDeepLink, readServerDeepLink);
  const [typed, setTyped] = useState<string | null>(null);
  const raw = typed ?? deepLinkId ?? '';
  const query = normaliseQuery(raw);
  const showResult = query.length >= LOOKUP_MIN_CHARS;
  const outcome = 'register_unavailable' as const;

  // v1.1: set by the record fetch; always null while the flag is off.
  const [record, setRecord] = useState<Representative | null>(null);

  // One event per query session: fires when the result first appears, re-arms on clear.
  const fired = useRef(false);
  useEffect(() => {
    if (!showResult) {
      fired.current = false;
      return;
    }
    if (fired.current) return;
    fired.current = true;
    track('verify_lookup', { page, locale, outcome });
  }, [showResult, page, locale, outcome]);

  const clear = () => setTyped('');

  return (
    <div
      id="check"
      data-testid="verify-check"
      className="scroll-mt-5 overflow-hidden rounded-lg bg-white text-ink shadow-hero-form"
    >
      <div aria-hidden="true" className="h-1 bg-[linear-gradient(90deg,#1899d5_55%,#d8ecf7_45%)] bg-[length:18px_4px]" />
      <div className="px-7 pt-6 pb-1.5">
        <h2 className="m-0 text-card-title tracking-[-0.02em]">{labels.heading}</h2>
        {livePill ? (
          <p
            data-testid="verify-live-pill"
            className="mt-2 mb-0 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-bold text-success-text"
          >
            <span aria-hidden="true" className="inline-block size-2 rounded-full bg-success" />
            {livePill}
          </p>
        ) : null}
      </div>
      <div className="px-7 pt-5 pb-7">
        <label
          htmlFor={inputId}
          className="mb-2 block text-eyebrow font-extrabold uppercase tracking-[1.2px] text-text-tertiary"
        >
          {labels.inputLabel}
        </label>
        <input
          id={inputId}
          type="text"
          name="q"
          value={raw}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') clear();
          }}
          placeholder={sys('verify.lookup.placeholder')}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-describedby={hintId}
          className={`${INPUT_CLASS} font-extrabold tracking-[0.02em]`}
        />
        <p id={hintId} className="mt-1.5 mb-0 text-body-sm text-text-tertiary">
          {sys('verify.lookup.hint', { min: LOOKUP_MIN_CHARS })}
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <button
            type="button"
            data-testid="verify-lookup-clear"
            onClick={clear}
            className={buttonClassName('secondary')}
          >
            {labels.clear}
          </button>
          <ContactLink
            href={telLink(phone)}
            placement="page_cta"
            className={buttonClassName('secondary')}
          >
            {labels.callOffice}
          </ContactLink>
        </div>

        {showResult ? (
          <div
            role="status"
            data-testid="verify-lookup-result"
            data-outcome={outcome}
            className="mt-5 rounded-base border border-warning-border bg-warning-surface p-5"
          >
            <p className="m-0 text-body-lg font-extrabold">{sys('verify.lookup.resultTitle')}</p>
            <p className="mt-2 mb-0 text-body-sm text-text-secondary">
              {sys('verify.lookup.resultBody', { query })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <ContactLink
                href={telLink(phone)}
                placement="page_cta"
                className={buttonClassName('primary')}
              >
                {labels.callOfficeShort}
              </ContactLink>
              <ContactLink
                href={waLink(whatsappNumber, `${labels.whatsappIntro} ${query}`)}
                placement="page_cta"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName('secondary')}
              >
                {sys('verify.lookup.whatsapp')}
              </ContactLink>
            </div>
          </div>
        ) : null}

        <p className="mt-5 mb-0 border-t border-dashed border-border-1 pt-4 text-body-sm text-text-tertiary">
          {labels.note}
        </p>
        {updatedLabel ? (
          <p
            data-testid="verify-updated"
            className="mt-3 mb-0 text-[12px] font-extrabold tracking-[0.03em] text-muted"
          >
            {updatedLabel}
          </p>
        ) : null}
      </div>

      {RECORD_DIALOG_ENABLED && record && recordLabels ? (
        <RecordDialog
          open
          record={record}
          labels={recordLabels}
          recordUrl={`${page}?id=${encodeURIComponent(record.id)}`}
          whatsappNumber={whatsappNumber}
          onClose={() => setRecord(null)}
        />
      ) : null}
    </div>
  );
}
```

`src/app/[locale]/(site)/verify/_components/StepsDisclosure.tsx` — the design collapses the three steps behind a non-focusable `div onClick` at ≤700 px; this is the same fold as a real button (D20). The cards are server-rendered children (JSX crosses into a client component as a serialised tree), so the copy stays in the HTML at every width:

```tsx
'use client';
import { useId, useState, type ReactNode } from 'react';

export function StepsDisclosure({ heading, children }: { heading: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="mt-11 border-t border-white/15 pt-8">
      <h2 className="m-0 flex items-center gap-2.5 text-eyebrow font-extrabold uppercase tracking-[1.4px] text-sky">
        <span aria-hidden="true" className="inline-block size-2 rounded-full bg-blue" />
        <span className="hidden md:inline">{heading}</span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-[44px] items-center gap-2 text-left font-extrabold uppercase tracking-[1.4px] text-sky md:hidden"
        >
          {heading}
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h2>
      <div
        id={panelId}
        className={`${open ? 'grid' : 'hidden'} mt-4 gap-4 md:grid md:grid-cols-3`}
      >
        {children}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/verify/page.tsx` — Cycle 3 edits:

(a) Add the imports (after the `RegisterSection`/`readRegister` lines):

```tsx
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { formatInt } from '@/lib/format/money';
import { formatDate } from '@/lib/format/date';
import { LookupCard } from './_components/LookupCard';
import { StepsDisclosure } from './_components/StepsDisclosure';
```

(b) Below `const HERO_TICKS` add the three steps' composition (the package splits these sentences around a bold fragment — W23's "unless the package itself splits it"):

```tsx
/** The three "Verify in one minute" cards: n, title id, and the body as the package's own
 *  fragments — [plain, bold, plain]. The bold fragment on step 3 is green (the design). */
const STEPS = [
  { n: 1, titleId: 'verify.037', body: ['verify.038', 'verify.039', 'verify.040'], bold: 'white' },
  { n: 2, titleId: 'verify.041', body: ['verify.042', 'verify.043', 'verify.234'], bold: 'white' },
  { n: 3, titleId: 'verify.044', body: ['verify.045', 'verify.046', 'verify.047'], bold: 'green' },
] as const;

const STEP_DOT = ['bg-[#253063]', 'bg-blue', 'bg-success-text'] as const;
```

(c) In the default export, after `const register = readRegister(bundle);` add:

```tsx
  const { settings } = bundle;
  // W6/D17: both lines exist only when the register has rows; today both are null.
  const livePill =
    register.active.length > 0
      ? `${formatInt(register.active.length, locale)} ${t('verify.224')}`
      : null;
  const updatedLabel = register.updatedAt
    ? `${t('verify.225')} ${formatDate(register.updatedAt.slice(0, 10), locale)}`
    : null;
```

(d) Replace the placeholder `<div id="check" />` (and its comment line) with:

```tsx
            <LookupCard
              labels={{
                heading: t('verify.031'),
                inputLabel: t('verify.032'),
                clear: t('verify.033'),
                callOffice: t('verify.034'),
                callOfficeShort: t('verify.051'),
                note: tf('verify.035'),
                whatsappIntro: t('verify.228'),
              }}
              phone={settings.phone}
              whatsappNumber={settings.whatsappNumber}
              livePill={livePill}
              updatedLabel={updatedLabel}
              recordLabels={null}
            />
```

(e) Replace the comment `{/* Cycle 3 mounts <StepsDisclosure> here. */}` with:

```tsx
          <StepsDisclosure heading={t('verify.036')}>
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="flex flex-col gap-2.5 rounded-base border border-white/15 bg-white/[0.055] px-6 pt-5 pb-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex size-[30px] shrink-0 items-center justify-center rounded-input text-body-sm font-extrabold text-white ${STEP_DOT[i]}`}
                  >
                    {s.n}
                  </span>
                  <h3 className="m-0 text-card-title text-white">{t(s.titleId)}</h3>
                </div>
                <p className="m-0 text-body-sm text-white/70">
                  {tf(s.body[0])}{' '}
                  <strong className={s.bold === 'green' ? 'text-[#5ddfb0]' : 'text-white'}>
                    {t(s.body[1])}
                  </strong>{' '}
                  {tf(s.body[2])}
                </p>
              </div>
            ))}
          </StepsDisclosure>
```

(f) At the very end of the fragment (after the last section comment, before `</>`) add the sticky bar (V-5; `hideNearId="report"` so it leaves when the visitor reaches the form it advertises; `live` = the design's green dot; the "Report" CTA uses `verify.015` alone — the `verify.015`+`verify.016` composition the header CTA table uses reads awkwardly in Turkish ("Bildir sahtekârı"), a W7 override candidate noted in Cycle 7):

```tsx
      <StickyCtaBar
        message={t('verify.020')}
        showAfterPx={620}
        hideNearId="report"
        live
        ctas={[
          { label: t('verify.067'), href: '#check', variant: 'inverse' },
          { label: t('verify.015'), href: '#report', variant: 'danger' },
        ]}
      />
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/verify"` → `npx vitest run "src/app/\[locale\]/(site)/verify"` → `lookup.test.ts` 5 passed, `LookupCard.test.tsx` 5 passed (plus Cycle 1–2's). `RecordDialog.tsx` compiles (`npx tsc --noEmit`) — its own test lands in Cycle 5. `npm run verify` green — in particular `eslint` must be clean under the React Compiler rules: no `setState` in an effect body (the deep link goes through `useSyncExternalStore`, the event through `track()` in an effect with a ref guard), no `ref.current` read during render.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/verify"
git commit -m "feat(verify): lookup island with the neutral W6 result, ?id= deep link, verify_lookup; steps disclosure; sticky bar; record dialog scaffold (T10 c3)

Any query ≥ 3 chars shows 'register not published — verify with the office' with tel/WhatsApp
(page_cta), never the red verdict; the event fires once per query session with
outcome=register_unavailable (W12/W67). The record dialog is a lazy chunk behind
RECORD_DIALOG_ENABLED=false (D9 v1.1) — never fetched in Phase A.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — The fraud report: schema → catalog fields, the `'use server'` action with sequential evidence uploads, the report section and form

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/verify/__tests__/fraud-schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import {
  DESCRIPTION_MIN,
  EVIDENCE_ACCEPT,
  EVIDENCE_FIELD,
  evidenceFilesOf,
  fraudFields,
  fraudSchema,
} from '../fraud-schema';

const OK = {
  reporterName: 'Ayşe Yılmaz',
  reporterEmail: 'Ayse@Example.com',
  reporterPhone: '',
  suspectName: '',
  suspectContact: '',
  description: 'A man calling himself a JobsAdmire agent asked me for a 500 USD visa deposit.',
};

const codes = (input: Record<string, string>) => {
  const r = fraudSchema.safeParse(input);
  return r.success ? {} : fieldErrorsFromIssues(r.error.issues);
};

describe('fraudSchema (site rules ≥ door rules, W3/V-2)', () => {
  it('accepts the minimal report: name + e-mail + a ≥ 20-char description', () => {
    expect(fraudSchema.safeParse(OK).success).toBe(true);
    expect(DESCRIPTION_MIN).toBe(20);
  });

  it('description: empty → required, short → min, over the catalog cap → max', () => {
    expect(codes({ ...OK, description: '' })).toEqual({ description: 'required' });
    expect(codes({ ...OK, description: 'too short' })).toEqual({ description: 'min' });
    expect(codes({ ...OK, description: 'x'.repeat(5001) })).toEqual({ description: 'max' });
  });

  it('reporter e-mail: empty → required (min(1) before email), malformed → email', () => {
    expect(codes({ ...OK, reporterEmail: '' })).toEqual({ reporterEmail: 'required' });
    expect(codes({ ...OK, reporterEmail: 'not-an-email' })).toEqual({ reporterEmail: 'email' });
  });

  it('reporter phone is optional but, when given, needs ≥ 8 digits (the door rule) → phone', () => {
    expect(fraudSchema.safeParse({ ...OK, reporterPhone: '+90 501 124 03 40' }).success).toBe(true);
    expect(codes({ ...OK, reporterPhone: '123' })).toEqual({ reporterPhone: 'phone' });
  });

  it('suspect fields are optional and capped at the catalog lengths', () => {
    expect(codes({ ...OK, suspectName: 'x'.repeat(201) })).toEqual({ suspectName: 'max' });
    expect(codes({ ...OK, suspectContact: 'x'.repeat(301) })).toEqual({ suspectContact: 'max' });
  });
});

describe('fraudFields → the exact catalog names', () => {
  it('sends only catalog field names, in catalog order, evidenceKeys as an array', () => {
    const parsed = fraudSchema.parse(OK);
    const fields = fraudFields(parsed, ['website-fraud/a.png', 'website-fraud/b.pdf']);
    expect(Object.keys(fields)).toEqual([
      'reporterName',
      'reporterEmail',
      'reporterPhone',
      'suspectName',
      'suspectContact',
      'description',
      'evidenceKeys',
    ]);
    expect(fields.evidenceKeys).toEqual(['website-fraud/a.png', 'website-fraud/b.pdf']);
    expect(fields.reporterEmail).toBe('Ayse@Example.com'); // the door lowercases; the site does not pre-empt it
  });
});

describe('evidenceFilesOf', () => {
  it('drops the empty file an untouched <input type=file> submits, keeps real files in order', () => {
    const fd = new FormData();
    fd.append(EVIDENCE_FIELD, new File([], ''));
    fd.append(EVIDENCE_FIELD, new File(['a'], 'a.png', { type: 'image/png' }));
    fd.append(EVIDENCE_FIELD, new File(['b'], 'b.pdf', { type: 'application/pdf' }));
    fd.append('description', 'not a file');
    expect(evidenceFilesOf(fd).map((f) => f.name)).toEqual(['a.png', 'b.pdf']);
  });
  it('the accept list is exactly what the door sniffs', () => {
    expect(EVIDENCE_ACCEPT).toBe('image/jpeg,image/png,image/webp,application/pdf');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/verify/__tests__/fraud-schema.test.ts"` → fails on the missing module.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/verify/fraud-schema.ts` (pure — no `server-only`, unit-tested; the `'use server'` file below only wraps it):

```ts
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';

/** ≥ 8 digits anywhere — the door's own `phone` rule (website-form-catalog). */
const PHONE_RE = /(\D*\d){8,}/;

export const DESCRIPTION_MIN = 20; // catalog: description 20…5000, REQUIRED
export const DESCRIPTION_MAX = 5000;
export const EVIDENCE_FIELD = 'evidence'; // the <input type=file multiple> name (not a wire field)
/** What the door's sniffer accepts (JPEG/PNG/WEBP/PDF); HEIC is refused there, so it is not offered. */
export const EVIDENCE_ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf';

const optionalText = (max: number) => z.string().max(max).optional();

/** V-2: name + e-mail required on the site (the door requires only `description`); every
 *  `.min(1)` precedes the format check so an empty value reads `required`, not `email`. */
export const fraudSchema = z.object({
  reporterName: z.string().min(1).max(120),
  reporterEmail: z.string().min(1).max(254).email(),
  reporterPhone: z
    .string()
    .max(40)
    .refine((v) => v === '' || PHONE_RE.test(v), { message: 'phone' })
    .optional(),
  suspectName: optionalText(200),
  suspectContact: optionalText(300),
  description: z.string().min(1).min(DESCRIPTION_MIN).max(DESCRIPTION_MAX),
});
export type FraudInput = z.infer<typeof fraudSchema>;

/** The catalog's exact wire names, in catalog order (`buildEnvelope` drops the empties). */
export function fraudFields(p: FraudInput, evidenceKeys: readonly string[]): WireFields {
  return {
    reporterName: p.reporterName,
    reporterEmail: p.reporterEmail,
    reporterPhone: p.reporterPhone ?? '',
    suspectName: p.suspectName ?? '',
    suspectContact: p.suspectContact ?? '',
    description: p.description,
    evidenceKeys: [...evidenceKeys],
  };
}

/** The real files under `evidence`: an untouched file input submits one File with an empty
 *  name and zero bytes, which is not evidence. Order preserved (the door stores them as sent). */
export function evidenceFilesOf(data: FormData): File[] {
  return data
    .getAll(EVIDENCE_FIELD)
    .filter(
      (v): v is File =>
        typeof File !== 'undefined' && v instanceof File && v.size > 0 && v.name !== '',
    );
}
```

`src/app/[locale]/(site)/verify/actions.ts`:

```ts
'use server';
import { headers } from 'next/headers';
import { isIP } from 'node:net';
import { createFormAction, FormActionError, type FormActionState } from '@/forms/action';
import { MAX_EVIDENCE_FILES, uploadFraudEvidence } from '@/forms/uploads';
import { evidenceFilesOf, fraudFields, fraudSchema } from './fraud-schema';

/** The same reading `createFormAction` makes for `postForm` (module-private there): the first
 *  `x-forwarded-for` hop when it is a bare IP, else `x-real-ip`, else nothing — the door
 *  validates with `isIP` and hashes it; nothing here logs it. */
function visitorOf(h: Awaited<ReturnType<typeof headers>>) {
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const real = h.get('x-real-ip')?.trim() ?? '';
  const ip = isIP(forwarded) ? forwarded : isIP(real) ? real : null;
  const ua = h.get('user-agent') || null;
  return { ip, ua };
}

const run = createFormAction({
  key: 'fraud',
  schema: fraudSchema,
  // W29: the files never enter the Zod schema; they are pulled from the raw FormData and
  // uploaded one call each (the route takes a single `file` part), sequentially, before the
  // envelope is built. A visitor-side refusal lands under the `evidence` field (FormActionError
  // with a field), a door-side failure renders the same fallback panel postForm would
  // (FormDoorError) — both mapped by createFormAction. No retry re-uploads bytes.
  toFields: async (parsed, data) => {
    const files = evidenceFilesOf(data);
    if (files.length > MAX_EVIDENCE_FILES)
      throw new FormActionError('', { name: 'evidence', code: 'max' });
    const visitor = visitorOf(await headers());
    const evidenceKeys: string[] = [];
    for (const file of files) {
      const { key } = await uploadFraudEvidence(file, visitor);
      evidenceKeys.push(key);
    }
    return fraudFields(parsed, evidenceKeys);
  },
});

export async function submitFraud(prev: FormActionState, data: FormData) {
  return run(prev, data);
}
```

`src/app/[locale]/(site)/verify/_components/DescriptionCounter.tsx` — the "≥ 20 characters, client-validated" feedback. The kernel's `FormShell` is `noValidate` and the server's Zod `min(20)` is the enforcement (dev and prod); this island gives the visitor live feedback without a second validation copy. It subscribes to the textarea's `input` events through `useSyncExternalStore` (no `setState` in an effect — the React Compiler rules `eslint-config-next` 16 enforces); the counter is `aria-hidden` so a screen reader is not read a number on every keystroke — those users have the field's hint (`sys.form.hints.description`, "At least 20 characters.") and the `role="alert"` error:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useCallback, useSyncExternalStore, type ReactNode } from 'react';

export function DescriptionCounter({
  targetId,
  min,
  children,
}: {
  /** The `id` passed to the `<Field id=… as="textarea">` this wraps. */
  targetId: string;
  min: number;
  children: ReactNode;
}) {
  const sys = useTranslations('sys');
  const subscribe = useCallback(
    (onChange: () => void) => {
      const el = document.getElementById(targetId);
      el?.addEventListener('input', onChange);
      return () => el?.removeEventListener('input', onChange);
    },
    [targetId],
  );
  const read = useCallback(() => {
    const el = document.getElementById(targetId);
    return el instanceof HTMLTextAreaElement ? el.value.trim().length : 0;
  }, [targetId]);
  const n = useSyncExternalStore(subscribe, read, () => 0);
  const short = n < min;
  return (
    <div className="flex flex-col gap-1">
      {children}
      <p
        aria-hidden="true"
        data-testid="fraud-description-counter"
        data-short={short ? '' : undefined}
        className={`m-0 text-right text-body-sm ${short ? 'text-text-tertiary' : 'text-success-text'}`}
      >
        {sys('verify.report.counter', { n, min })}
      </p>
    </div>
  );
}
```

`src/app/[locale]/(site)/verify/_sections/FraudForm.tsx` (server component; the `'use server'` reference `submitFraud` crosses to the client `FormShell` as an action reference):

```tsx
import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { DescriptionCounter } from '../_components/DescriptionCounter';
import { submitFraud } from '../actions';
import { DESCRIPTION_MIN, EVIDENCE_ACCEPT, EVIDENCE_FIELD } from '../fraud-schema';

const DESCRIPTION_ID = 'fraud-description';

/** The `fraud` door form (W3): the design's three "send us" items are the first three fields
 *  (V-7), the reporter fields and the evidence input are the W3 additions. Copy: labels are
 *  the package's own ids where it has them, `sys.form.*` elsewhere (W30). */
export function FraudForm({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  return (
    <FormShell
      action={submitFraud}
      formKey="fraud"
      locale={locale}
      turnstileSiteKey={settings.turnstileSiteKey}
      whatsappNumber={settings.whatsappNumber}
      whatsappIntro={t('verify.229')}
      contact={{ phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email }}
      submitLabel={sys('verify.report.submit')}
      testId="fraud-form"
      className="rounded-lg border border-border-1 bg-white p-6 text-ink"
    >
      <Field name="suspectName" label={t('verify.094')} autoComplete="off" />
      <Field name="suspectContact" label={t('verify.095')} autoComplete="off" />
      <DescriptionCounter targetId={DESCRIPTION_ID} min={DESCRIPTION_MIN}>
        <Field
          id={DESCRIPTION_ID}
          name="description"
          as="textarea"
          rows={5}
          required
          label={t('verify.096')}
        />
      </DescriptionCounter>
      <Field name="reporterName" required autoComplete="name" />
      <Field name="reporterEmail" type="email" required autoComplete="email" inputMode="email" />
      <Field name="reporterPhone" type="tel" autoComplete="tel" inputMode="tel" />
      <Field name={EVIDENCE_FIELD} type="file" multiple accept={EVIDENCE_ACCEPT} />
    </FormShell>
  );
}
```

`src/app/[locale]/(site)/verify/_sections/ReportSection.tsx` (server component):

```tsx
import { makeT, makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks';
import { Eyebrow, Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FraudForm } from './FraudForm';

/** The five red flags as [bold lead id, body id] pairs — all five at every width (V-3). */
const RED_FLAGS = [
  ['verify.081', 'verify.082'],
  ['verify.083', 'verify.084'],
  ['verify.085', 'verify.086'],
  ['verify.087', 'verify.088'],
  ['verify.089', 'verify.090'],
] as const;

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      className="mt-[5px] shrink-0 text-danger"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ReportSection({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  return (
    // `id="report"` is the element CTA_BY_PATHNAME['/verify'] and the sticky bar point at.
    <Section tone="light" id="report" className="scroll-mt-5">
      <div className="container-site" data-testid="verify-report">
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-danger">
          {t('verify.077')}
        </p>
        <h2 className="text-h2 mt-3 leading-[1.06] tracking-[-0.04em]">{t('verify.078')}</h2>
        <p className="mt-3 mb-7 max-w-[680px] text-body-lg text-text-secondary">
          {tf('verify.079')}
        </p>

        <div className="grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-danger-border bg-white px-7 pt-6 pb-4 shadow-card-hover">
            <p className="m-0 flex items-center gap-2 pb-3.5 text-[11.5px] font-extrabold uppercase tracking-[1.3px] text-danger">
              <XIcon />
              {t('verify.080')}
            </p>
            <ul className="m-0 list-none p-0">
              {RED_FLAGS.map(([lead, body]) => (
                <li
                  key={lead}
                  className="flex items-start gap-3 border-t border-[#fbe3e3] py-3.5 text-body-sm text-text-secondary"
                >
                  <XIcon />
                  <p className="m-0">
                    <strong className="text-ink">{tf(lead)}</strong> {tf(body)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex flex-col overflow-hidden rounded-lg bg-navy p-7 text-white shadow-hero-form">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#dc2626_55%,transparent_45%)] bg-[length:22px_3px]"
            />
            <Eyebrow>
              <span className="text-[#fca5a5]">{t('verify.091')}</span>
            </Eyebrow>
            <h3 className="mt-3 mb-2 text-card-title leading-[1.25] text-white">{t('verify.092')}</h3>
            <p className="mt-0 mb-5 text-body-sm text-white/70">{tf('verify.093')}</p>

            <FraudForm bundle={bundle} locale={locale} />

            {/* Co-primary doors (D11): report on WhatsApp or call — always beside the form. */}
            <div className="mt-4 flex flex-col gap-2.5">
              <ContactCta
                placement="page_cta"
                variant="danger"
                external
                href={waLink(settings.whatsappNumber, t('verify.229'))}
              >
                {t('verify.097')}
              </ContactCta>
              <ContactCta placement="page_cta" variant="inverse" href={telLink(settings.phone)}>
                {t('verify.051')}
              </ContactCta>
            </div>
            <p className="mt-4 mb-0 border-t border-dashed border-white/20 pt-3.5 text-body-sm text-white/60">
              {tf('verify.098')}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/verify/page.tsx` — Cycle 4 edits: add `import { ReportSection } from './_sections/ReportSection';` after the `RegisterSection` import; replace the comment `{/* Cycle 4: <ReportSection …/> … */}` with

```tsx
      <ReportSection bundle={bundle} locale={locale} />
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/verify"` → `npx vitest run "src/app/\[locale\]/(site)/verify"` → `fraud-schema.test.ts` 8 passed (+ the earlier files). `npm run verify` green. `actions.ts` is a `'use server'` module exporting only the async `submitFraud` (Next refuses anything else); `npx tsc --noEmit` proves `submitFraud` types as `(prev: FormActionState, data: FormData) => Promise<FormActionState>` and that `'fraud'` is a `FormKey` (R55).

Manual check (one build, no dev server left running): `npm run build && npm run start -- -p 3100` → open `http://localhost:3100/temsilci-dogrulama#report`, submit the form with a 25-character description, name and e-mail, consent ticked → with no `OPS_API_URL` the fallback panel (`data-kind="unauthorized"`) renders inside the form, no navigation; typing in the description moves the counter; the `evidence` input accepts up to three files (a fourth → `sys.form.errors.max` under the input after submit). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/verify"
git commit -m "feat(verify): fraud report form → 'fraud' door with reporter fields and up to 3 evidence uploads (T10 c4)

Zod schema → exact catalog names (reporterName/reporterEmail/reporterPhone/suspectName/
suspectContact/description/evidenceKeys); toFields uploads each File through
uploadFraudEvidence (one call per file, write token) then sends the keys (W3/W29). Red flags:
all five at every width (V-3).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — The FAQ block; the record `Dialog` scaffold (written in Cycle 3, v1.1 behind the flag) proven by test

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/verify/__tests__/RecordDialog.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import RecordDialog, { type RecordLabels } from '../_components/RecordDialog';
import { RECORD_DIALOG_ENABLED } from '../flags';
import { FOUNDER } from './register.test';

const labels: RecordLabels = {
  badgeQr: 'Badge QR',
  badgeQrHint: 'Scan the QR on their badge — it must open this same record.',
  authorisedUntil: 'Authorised until',
  noExpiry: 'No expiry',
  contact: 'Official contact',
  languages: 'Languages',
  reportsTo: 'Reports to',
  withJobsAdmire: 'With JobsAdmire',
  desk: 'Desk',
  soleSignatory: 'Sole signatory',
  servedFrom: 'Record served from our internal system ·',
  copyLink: 'Copy record link',
  copied: 'Link copied ✓',
  wrong: 'Something is wrong →',
  status: { active: 'Authorised', suspended: 'Suspended', former: 'No longer authorised' },
  whatsappIntro: 'Hello JobsAdmire, I want to check something about',
};

describe('RecordDialog (v1.1 scaffold)', () => {
  it('is off in Phase A', () => {
    expect(RECORD_DIALOG_ENABLED).toBe(false);
  });

  it('renders an accessible dialog for a record: status header, identity, meta, copy link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onClose = vi.fn();
    renderWithIntl(
      <RecordDialog
        open
        record={FOUNDER}
        labels={labels}
        recordUrl="/en/verify?id=JA-REP-001"
        whatsappNumber="905011240340"
        onClose={onClose}
      />,
      { locale: 'en' },
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Founder Example');
    expect(dialog).toHaveTextContent('JA-REP-001');
    expect(dialog).toHaveTextContent('Authorised');
    expect(dialog).toHaveTextContent('Sole signatory');
    expect(dialog).toHaveTextContent('No expiry');
    expect(dialog).toHaveTextContent('Antalya');
    fireEvent.click(screen.getByRole('button', { name: 'Copy record link' }));
    expect(writeText).toHaveBeenCalledWith('/en/verify?id=JA-REP-001');
    fireEvent.click(screen.getByRole('button', { name: 'Close record' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('never fails open: a former record shows the former label, no signatory pill', () => {
    renderWithIntl(
      <RecordDialog
        open
        record={{ ...FOUNDER, status: 'former', canSign: false }}
        labels={labels}
        recordUrl="/en/verify?id=JA-REP-001"
        whatsappNumber="905011240340"
        onClose={() => {}}
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('dialog')).toHaveTextContent('No longer authorised');
    expect(screen.queryByText('Sole signatory')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/verify/__tests__/RecordDialog.test.tsx"` → the `is off in Phase A` and dialog cases run against the scaffold Cycle 3 shipped (the file had to exist for `LookupCard`'s lazy import to type-check) — the red here is the FAQ: `grep -c FaqBlock "src/app/[locale]/(site)/verify/page.tsx"` prints `0`, and `e2e/pages/verify.spec.ts` (Cycle 6) will look for `verify-faq` and the FAQPage node. If any RecordDialog case fails, fix the scaffold now, not the test.

- [ ] **Step 3: Implement**

`RecordDialog.tsx` already exists (Cycle 3). This cycle adds the FAQ block:

`src/app/[locale]/(site)/verify/page.tsx` — Cycle 5 edits: extend the blocks import to `import { Breadcrumbs, FaqBlock, type FaqItem } from '@/design/blocks';`; below `STEP_DOT` add

```tsx
/** verify.101–108: the in-page FAQ pairs. The design's JSON-LD twin used different wording;
 *  FaqBlock builds the FAQPage node from these same strings (one source). */
const FAQ_IDS = [
  ['verify.101', 'verify.102'],
  ['verify.103', 'verify.104'],
  ['verify.105', 'verify.106'],
  ['verify.107', 'verify.108'],
] as const;
```

in the default export, after the `updatedLabel` constant add

```tsx
  const faqItems: FaqItem[] = FAQ_IDS.map(([q, a]) => ({ id: q, q: tf(q), a: tf(a) }));
```

and replace the comment `{/* Cycle 5: FAQ block */}` with (V-4: at every width):

```tsx
      <div data-testid="verify-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq"
          eyebrowId="verify.099"
          headingId="verify.100"
          items={faqItems}
        />
      </div>
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/verify"` → `npx vitest run "src/app/\[locale\]/(site)/verify"` → `RecordDialog.test.tsx` 3 passed; the whole folder green (register 4, RegisterSection 2, lookup 5, LookupCard 5, fraud-schema 8, RecordDialog 3, sys-keys 15). `npm run verify` green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/verify"
git commit -m "feat(verify): FAQ block with its FAQPage node; record Dialog scaffold proven (T10 c5)

FAQ renders at every width (V-4) from verify.101–108 — one source for DOM and JSON-LD.
The dialog's status is an enum that never defaults to Authorised; its test pins the flag off.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 6 — Gate: route table, the page e2e spec, a local gate run

- [ ] **Step 1: Write the failing test**

`e2e/routes.ts` — append to `GATE_ROUTE_TABLE` (WP2a Task 7's `readonly GateRoute[]`; keep the thank-you row last if the file orders noindex routes last, otherwise just append):

```ts
  { path: '/temsilci-dogrulama', indexable: true },
  { path: '/en/verify', indexable: true },
```

`e2e/pages/verify.spec.ts`:

```ts
import { test, expect, type Page } from '@playwright/test';

const ORIGIN = 'https://www.jobsadmire.com';
const TR = '/temsilci-dogrulama';
const EN = '/en/verify';

type DataLayerEntry = Record<string, unknown>;
const dataLayer = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? [],
  ) as Promise<DataLayerEntry[]>;
const lookups = async (page: Page) =>
  (await dataLayer(page)).filter((e) => e.event === 'verify_lookup');

const DESCRIPTION =
  'Someone calling himself a JobsAdmire agent asked me for a visa deposit of 500 dollars by transfer.';

for (const [path, lang] of [
  [TR, 'tr'],
  [EN, 'en'],
] as const) {
  test(`${path}: one h1, no leaked tokens, the sections in design order`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    const h1 = page.locator('h1[data-testid="page-h1"]');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(body).not.toContain('undefined');
    // design order: check card (hero) → structure → report → faq
    const order = await page.evaluate(() =>
      ['verify-check', 'verify-structure', 'verify-report', 'verify-faq'].map(
        (id) => document.querySelector(`[data-testid="${id}"]`)?.getBoundingClientRect().top ?? -1,
      ),
    );
    expect(order.every((t) => t >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    // Phase A: the empty register, no stats/founder/former (W6, §10 rows 3/11)
    await expect(page.getByTestId('verify-empty')).toBeVisible();
    await expect(page.getByTestId('verify-stats')).toHaveCount(0);
    await expect(page.getByTestId('verify-founder')).toHaveCount(0);
    await expect(page.getByTestId('verify-former')).toHaveCount(0);
    // the header CTA table's target and the sticky bar's anchors exist
    await expect(page.locator('#report')).toHaveCount(1);
    await expect(page.locator('#check')).toHaveCount(1);
    await expect(page.locator('#structure')).toHaveCount(1);
  });
}

test('canonical, hreflang and the two JSON-LD nodes', async ({ page, request }) => {
  await page.goto(TR);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}${TR}`);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}${EN}`);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', `${ORIGIN}${TR}`);
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/);
  const html = await (await request.get(TR)).text();
  expect(html).toContain('"@type":"BreadcrumbList"');
  expect(html).toContain('"@type":"FAQPage"');
});

test('a lookup shows the neutral result — never the red verdict — and fires verify_lookup once', async ({
  page,
}) => {
  await page.goto(TR);
  const card = page.getByTestId('verify-check');
  const input = card.getByRole('textbox');
  await expect(page.getByTestId('verify-lookup-result')).toHaveCount(0);

  await input.fill('JA');
  await expect(page.getByTestId('verify-lookup-result')).toHaveCount(0);

  await input.fill('JA-REP-014');
  const result = page.getByTestId('verify-lookup-result');
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute('role', 'status');
  await expect(result).toHaveAttribute('data-outcome', 'register_unavailable');
  await expect(result).toContainText('JA-REP-014');
  await expect(result).not.toContainText('Yetkili listemizde değil');
  await expect(result).not.toContainText('Not on our authorised list');
  await expect(result.locator('a[href^="tel:"]')).toHaveCount(1);
  await expect(result.locator('a[href^="https://wa.me/"]')).toHaveCount(1);

  await expect.poll(async () => lookups(page)).toHaveLength(1);
  expect((await lookups(page))[0]).toMatchObject({
    page: TR,
    locale: 'tr',
    outcome: 'register_unavailable',
  });
  await input.fill('JA-REP-0145');
  await page.waitForTimeout(200);
  expect(await lookups(page)).toHaveLength(1);

  await card.getByTestId('verify-lookup-clear').click();
  await expect(page.getByTestId('verify-lookup-result')).toHaveCount(0);
  await expect(input).toHaveValue('');
});

test('?id= opens the lookup prefilled (V-1) and the canonical ignores the query', async ({
  page,
}) => {
  await page.goto(`${EN}?id=JA-REP-001`);
  await expect(page.getByTestId('verify-check').getByRole('textbox')).toHaveValue('JA-REP-001');
  await expect(page.getByTestId('verify-lookup-result')).toHaveAttribute(
    'data-outcome',
    'register_unavailable',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}${EN}`);
});

test('the fraud form validates on the server and shows the fallback panel when the door is not configured', async ({
  page,
}) => {
  await page.goto(`${TR}#report`);
  const form = page.getByTestId('fraud-form');
  await expect(form).toHaveAttribute('data-form-key', 'fraud');

  // 1) a short description → a field error, no panel, no navigation
  await form.locator('[name="reporterName"]').fill('Test Reporter');
  await form.locator('[name="reporterEmail"]').fill('reporter@example.com');
  await form.locator('[name="description"]').fill('too short');
  await expect(form.getByTestId('fraud-description-counter')).toHaveAttribute('data-short', '');
  await form.locator('input[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(form.getByRole('alert').first()).toBeVisible();
  await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp(`${TR}`));

  // 2) a valid report → OPS_API_URL is unset in this environment, so postForm answers
  //    'unauthorized' without a call (doorConfig() === null) — the D11 panel, deterministic.
  //    React 19 resets uncontrolled inputs after a form action; the kernel echoes the typed
  //    values as defaultValue, but the fills below do not depend on that.
  await form.locator('[name="reporterName"]').fill('Test Reporter');
  await form.locator('[name="reporterEmail"]').fill('reporter@example.com');
  await form.locator('[name="description"]').fill(DESCRIPTION);
  await expect(form.getByTestId('fraud-description-counter')).not.toHaveAttribute('data-short', '');
  const consent = form.locator('input[name="consent"]');
  if (!(await consent.isChecked())) await consent.check();
  await form.locator('button[type="submit"]').click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  await expect(panel.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
  await expect(page).not.toHaveURL(/tesekkurler/);
});

test('the language switch keeps the visitor on the verify page', async ({ page, isMobile }) => {
  await page.goto(TR);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    `${ORIGIN}${EN}`,
  );
  // The desktop row carries the switcher (≥ 901 px, W11); the hamburger copy is chrome.spec.ts's.
  test.skip(isMobile, 'switcher is in the hamburger on mobile — covered by e2e/chrome.spec.ts');
  await page.locator('a[hreflang="en"]:visible').first().click();
  await expect(page).toHaveURL(new RegExp(`${EN}$`));
  await expect(page.getByTestId('page-h1')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
```

- [ ] **Step 2: Run to verify it fails**

Two reds, both before the `e2e/routes.ts` edit: (a) `node scripts/gate-routes.mjs` does not print `/temsilci-dogrulama` or `/en/verify` — the gate would silently skip the page, which is the failure W21 exists to catch; (b) `npx playwright test e2e/pages/verify.spec.ts --list` fails with "No tests found" (the spec does not exist). The page spec's own red→green is its first run in Step 4 — the page already exists from Cycles 1–5, so there is no meaningful "page missing" red to stage; do not fake one.

- [ ] **Step 3: Implement**

Write the two files above. `node scripts/gate-routes.mjs` now prints both paths. Build and serve the tree: `npm run build && npm run start -- -p 3100` (one job at a time).

- [ ] **Step 4: Run tests + `npm run verify`**

`E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/verify.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts --project=desktop` then `--project=mobile` → all green: the page-contract loop (Task 7) now covers the two new routes; axe reports zero violations on both; the width sweep has no overflow at 1440…390 on both (the register table is inside an `overflow-hidden` card; the hero grid stacks below `lg`). Then the local gate: `E2E_BASE_URL=http://localhost:3100 npm run gate` → Lighthouse over `node scripts/gate-routes.mjs` (the two new indexable paths included): performance ≥ 0.95, a11y/best-practices/SEO 1.0, `resource-summary:script:size` ≤ 204,800 on both (LCP is a warning locally, R50). `npm run js-size` → paste the two rows into the ledger line (Cycle 7). If a route is above 194,560 B (`LAZY_LINE`), the fix is to move `StepsDisclosure`/`DescriptionCounter` behind `next/dynamic` before the next page starts (W13 amended) — not expected: the page adds one small island above the fold (`LookupCard`), the forms kernel islands, and two ~1 KB helpers. Stop the server. `npm run verify` green.

- [ ] **Step 5: Commit**

```bash
git add e2e/routes.ts e2e/pages/verify.spec.ts
git commit -m "test(verify): gate routes for /temsilci-dogrulama and /en/verify; page e2e (lookup, deep link, fraud fallback, language switch) (T10 c6)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 7 — Docs in the same change set, the ledger line

- [ ] **Step 1: Write the failing test**

No unit test — the docs are prose. The check is the grep at the end of Step 3 (every anchor found once) plus `npm run format` (Prettier formats Markdown tables).

- [ ] **Step 2: Run to verify it fails**

`grep -n "temsilci-dogrulama" docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md` → no hits in SEO/ANALYTICS/CONTENT-MODEL yet (PRD row 7 already carries the slug).

- [ ] **Step 3: Implement**

`docs/SEO.md` — under `## Metadata`, a `## Pages` table lists every built page (an earlier page task creates it; if it does not exist yet, add it directly after the Metadata paragraph with exactly this header). Append this row (columns: Page · Routes · Title/description source · Canonical · JSON-LD · LCP slot):

```md
| Verify Representative | `/temsilci-dogrulama` · `/en/verify` | `sys.seo.verify.{title,description}` — the package has no SEO strings for this page (W23) | `absoluteUrl(locale, '/verify')` — the `?id=<JA-…>` record deep link (V-1) is never canonical | `BreadcrumbList` (`Breadcrumbs`), `FAQPage` (`FaqBlock`, verify.101–108 — the design's differently-worded JSON-LD twin is not used) | `h1` (no hero photograph; no placeholder on the page while the founder strip is hidden) |
```

`docs/ANALYTICS.md` — § Event schema table: replace the `verify_lookup` row's "Fires on" cell (Task 3 wrote `Verify page — a lookup is submitted`) with `Verify page — the lookup result appears: once per query session when the normalised query first reaches 3 characters, or on a `?id=`/`?rep=`/`#id=` deep link at mount; Clear re-arms it. **Phase A always sends `register_unavailable`** (W6 — there is no published register; `verified`/`not_found` arrive with the v1.1 record handler)`. In the paragraph that lists which events are wired (Task 3's "…are declared but still uncalled — they land with … the pages that own them in WP2b."), append the sentence: `The Verify page (T10) wires \`verify_lookup\` from its lookup island and renders every tel/WhatsApp CTA — lookup card, neutral result, empty-state register, report box, fallback panel — through \`ContactLink\`/\`ContactCta\` with \`placement: 'page_cta'\` (the panel's own \`form_fallback\`); the query the visitor typed reaches the WhatsApp prefill only, never an event.`

`docs/CONTENT-MODEL.md` — § The `sys.*` range: in the per-page namespace list (W23; Task 1/2's "Adding copy" paragraph enumerates `sys.form.*`, `sys.<page>.*`, `sys.seo.<pageKey>.*` — append this bullet where page namespaces are listed, or directly after that paragraph if no list exists yet):

```md
- **`sys.verify.*` (T10):** `lookup.{placeholder,hint,resultTitle,resultBody,whatsapp}` — the Phase A neutral lookup result (W6; `resultBody` takes `{query}`, `hint` takes `{min}`), `empty.{title,body}` — the unpublished-register empty state, `register.{former,people}` — the per-row "no longer authorised" label and an ICU plural, `report.{submit,counter}` — the fraud form's submit and its `{n} / {min}` counter, `record.close` — the record dialog's close label; plus `sys.seo.verify.{title,description}` (the package carries no SEO strings for the page). The Verify page never composes the design's red verdict (verify.048–050) and reads `verify.015` alone for its sticky "Report" CTA — the `verify.015`+`verify.016` split ("Bildir" + "sahtekârı") reads back-to-front in Turkish and is a `content-overrides.json` candidate for the marketing review (W7).
```

Also in § Collections append one sentence: `**`representatives` (v1.1, D9):** not one of the eight Phase A `CollectionSchemas` keys and refused in production under `LOCAL` (D23); the Verify page parses it page-locally with `RepresentativeSchema` (`src/app/[locale]/(site)/verify/register.ts` — `id` `JA-XXX-000`, locale-resolved `role`, `level` founder|office|rep|coordinator, `desk`, `city`, ISO-2 `country`, `languages[]`, company-only `contact`, `validUntil`, `reportsTo`, `since`, `status` active|suspended|former (an unknown status is a schema miss, never "active"), `canSign`, `photo`, `updatedAt`), the shape the v1.1 `WebsiteRepresentative` importer must emit. Empty today → the page renders its empty state; the founder strip, stats strip, register list and former strip are components that return `null` without rows.`

`docs/ARCHITECTURE.md` — § Routing, after the paragraph about the OG image route (Task 4's "The Open Graph image route … Do not add an extension-less route outside `[locale]` without extending the matcher."), add:

```md
**Verify record deep link (V-1, T10).** A representative's record URL is the page itself with a query — `/temsilci-dogrulama?id=JA-REP-001`, `/en/verify?id=…` (`?rep=` and `#id=` accepted as aliases) — not a `/verify/[id]` route. The badge QR (D9 v1.1) encodes this URL forever; the query adds nothing to `pathnames`, the sitemap or hreflang; and the page stays static because the lookup island reads the query **after hydration** through `useSyncExternalStore` — never via the page's `searchParams`, which would make the whole route dynamic. The v1.1 record fetch is a website route handler (`src/app/api/verify/record/route.ts`, `Cache-Control: no-store` per spec §3.1) the island calls with the id; the browser never calls Operations (D6). Until that handler and the consented rows exist, `RECORD_DIALOG_ENABLED` (`src/app/[locale]/(site)/verify/flags.ts`) keeps the record dialog an unfetched chunk and every lookup answers the neutral W6 result.
```

`docs/PRD.md` — the pages table row whose first cells read `| 7 | Verify Representative |` (line 25 on `main`): replace its last cell `Fraud report (\`FRAUD_REPORT\`); empty-state register at launch (D9 v1)` with `Fraud report (\`FRAUD_REPORT\`: \`suspectName\`/\`suspectContact\`/\`description\` ≥ 20 + reporter name/e-mail required, phone optional (V-2), up to 3 evidence uploads via \`POST /api/website/v1/uploads/fraud-evidence\` — W3); empty-state register at launch (D9 v1, W6): the lookup is client-only and always answers "register not published — verify with the office" (never the red verdict), founder strip/stats/former strip render only from \`representatives\` rows (§10 rows 3/11); record deep link \`?id=<JA-…>\` on the same route (V-1); the design's mobile red-flag fold, its second sticky search input and "Print badge" are not ported (V-3/V-5/V-6)`.

Verification grep (each must print exactly one line):

```bash
grep -c "temsilci-dogrulama\` · \`/en/verify" docs/SEO.md
grep -c "Phase A always sends \`register_unavailable\`" docs/ANALYTICS.md
grep -c "sys.verify.\*\` (T10)" docs/CONTENT-MODEL.md
grep -c "Verify record deep link (V-1, T10)" docs/ARCHITECTURE.md
grep -c "record deep link \`?id=<JA-…>\` on the same route (V-1)" docs/PRD.md
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write docs` → `npm run verify` green (format included).

- [ ] **Step 5: Commit**

```bash
git add docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/ARCHITECTURE.md docs/PRD.md
git commit -m "docs(verify): SEO page row, verify_lookup semantics, sys.verify namespace + representatives shape, V-1 record URL decision, PRD row 7 (T10 c7)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

**Ledger line (append to the WP2b ledger after Cycle 6's gate run; fill the measured numbers from `npm run js-size` and `lighthouse-report/`):**

`T10 Verify · /temsilci-dogrulama + /en/verify · script gz: <tr bytes> / <en bytes> (ceiling 204,800; lazy line 194,560) · Lighthouse perf/a11y/bp/seo: <tr triple> / <en triple> · pixel: n/a (not a D27 harness page — side-by-side review) · placeholders: 0, LCP slot h1 · cycles 7 · decisions V-1…V-7`

---

**Docs in this task:** `docs/SEO.md` (§ Pages row), `docs/ANALYTICS.md` (§ Event schema `verify_lookup` cell + the wired-events sentence), `docs/CONTENT-MODEL.md` (§ `sys.*` range bullet; § Collections `representatives` sentence), `docs/ARCHITECTURE.md` (§ Routing: V-1 record deep link), `docs/PRD.md` (pages table row 7). No INTEGRATIONS.md change: every field sent is already in the Ops catalog v1.0 `fraud` entry and the upload route is documented there by T14.

**Sys keys added (14):** `sys.seo.verify.title`, `sys.seo.verify.description`, `sys.verify.lookup.placeholder`, `sys.verify.lookup.hint`, `sys.verify.lookup.resultTitle`, `sys.verify.lookup.resultBody`, `sys.verify.lookup.whatsapp`, `sys.verify.empty.title`, `sys.verify.empty.body`, `sys.verify.register.former`, `sys.verify.register.people`, `sys.verify.report.submit`, `sys.verify.report.counter`, `sys.verify.record.close` — in BOTH `src/messages/tr.json` and `src/messages/en.json` (asserted by `sys-keys.test.ts` and Task 2's `messages.test.ts`).

**Package ids used (103; first `verify.001`, last `verify.267`):** `verify.001`, `006`, `015`, `020`, `021`, `022`, `023`, `024`, `025`, `026`, `027`, `028`, `029`, `030`, `031`, `032`, `033`, `034`, `035`, `036`, `037`, `038`, `039`, `040`, `041`, `042`, `043`, `044`, `045`, `046`, `047`, `051`, `053`, `054`, `055`, `056`, `057`, `058`, `059`, `060`, `061`, `062`, `063`, `067`, `068`, `069`, `070`, `071`, `073`, `074`, `075`, `076`, `077`, `078`, `079`, `080`, `081`, `082`, `083`, `084`, `085`, `086`, `087`, `088`, `089`, `090`, `091`, `092`, `093`, `094`, `095`, `096`, `097`, `098`, `099`, `100`, `101`, `102`, `103`, `104`, `105`, `106`, `107`, `108`, `109`, `110`, `111`, `112`, `113`, `114`, `115`, `116`, `224`, `225`, `226`, `228`, `229`, `234`, `238`, `239`, `241`, `259`, `267` (all present in `src/content/local/catalogue.json`, verified against the file; the record-dialog ids 109–116/226/238/239/241/259/267 and 060/046 are resolved by the page only when `RECORD_DIALOG_ENABLED` is flipped — the scaffold's `RecordLabels` type names them). Deliberately unused: `verify.048`–`050`/`235`/`236` (the red verdict, W6), `verify.230`/`231` (the mobile fold, V-3), `verify.120` (Print badge, V-6), `verify.016` (see the CONTENT-MODEL note), `verify.117`/`118` + `verify.198`–`218` (the v1.1 level-keyed May do / May never lists), `verify.148`–`197`/`240`–`258` (staff-data strings, page-note trap), `verify.219`–`222`/`266` (CRM feed badges — replaced by the empty state).

**Foundation gaps:** (1) `visitorOf` is module-private in `src/forms/action.ts`; `uploadFraudEvidence(file, visitor)` needs it inside a page's `toFields`, so `actions.ts` re-derives `{ ip, ua }` from `headers()` in six lines — exporting `visitorOf` from `src/forms/action.ts` (or passing the visitor as a third `toFields` argument) removes the duplicate. (2) `Field` has no `minLength`/`maxLength` passthrough, so the "≥ 20 characters, client-validated" feedback is the page-local `DescriptionCounter` island around the `Field`; a `minLength` prop on `Field` would make it native. (3) The brief's "write `src/forms/uploads.ts` in this task" is superseded — the helper is Task 2's (W29) and is consumed as published.
