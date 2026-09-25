### Task 10: Verify Representative (`/temsilci-dogrulama`, `/en/verify`)

**Route:** internal `/verify` (pathnames: tr `/temsilci-dogrulama`, en `/verify`) · pageKey `verify` · route group `(site)` (W19) · indexable · not a pixel-harness page (D27: side-by-side review). **Runs after T9 and before T11 (W99)** — T1 created the shared `docs/SEO.md` `## Pages` table, the `docs/ANALYTICS.md` `### Page instrumentation (WP2b)` list and the ledger table; T13 shipped `/privacy`, so the consent link resolves. **Worktree:** every path and command below runs in `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on `wp2/foundation`.

**What this page is in Phase A (D9 v1, W6, §10 rows 3 and 11):** an empty-state register plus a client-only lookup that always answers the neutral "register not yet published — verify with the office" result (never the design's red "Not on our authorised list" verdict); the founder strip, stats strip, register list and former strip are components that return `null` without data (the founder strip reads the W86 `founder` collection and stays hidden while its row is unpublished); the five red flags; a real fraud-report form to the `fraud` door (W3: reporter name/e-mail/phone) whose evidence files are uploaded **one server-action call per file by an island** that keeps each returned key in a hidden `evidenceKeys` input (W73/W101); a FAQ block with its FAQPage node; and a record `Dialog` scaffold that is dead behind a v1.1 flag. Nothing is deleted from the port.

**Rulings applied in this final form:** W3, W6, W9, W12, W13 amended, W19–W23, W29/W30, W45, W67, W73–W76, W78 (not applicable — the fraud form has no `startWhen`), W79 (`consent: 'checkbox'`, no `consentLinkHref` — the `/privacy` default), W81 (the sticky bar carries `data-testid="sticky-cta"`; its two CTAs here are in-page anchors), W86 (founder strip ← `getCollection(bundle, 'founder')`), W90 (the page's client islands read `sys.verify.*`/`sys.form.*`, both in the picked client messages), W92 (the fraud e2e runs only where the door is unconfigured), W95 (the lookup query never sits in a DOM href — the WhatsApp prefill is composed at click time; the record dialog does the same), W98 (one shape per shared doc; T1's ledger row format), W99, W101 (per-file evidence upload island; nothing uploads in `toFields`), W105 (T14's I4 map reads reporterName + reporterEmail as required, as here), W109 (breadcrumbs use this page's own `verify.021`/`verify.006`), W113 (section test ids on wrapping `<div>`s), W115 (the package's field labels `verify.094`–`096` are passed as `label`; the reporter and evidence fields have no package label and use `sys.form.labels.*`).

**Decisions this task records (write them into the docs in Cycle 8; cite as V-n):**

- **V-1 Record URL shape = `?id=<JA-…>` on the same route** (`/temsilci-dogrulama?id=JA-REP-001`, `/en/verify?id=…`), not a `/verify/[id]` route. The printed badge QR must encode a permanent URL (D9 v1.1 "stable public id"); a query on the existing route adds no `pathnames` entry, no sitemap/hreflang work and keeps the page static — the island reads the query **after hydration** (`useSyncExternalStore`, the R18/R27 pattern), never through the page's `searchParams` (which would make the route dynamic). Canonical stays the bare route. The v1.1 record fetch will be a **website** route handler (`src/app/api/verify/record/route.ts`, `no-store` per spec §3.1) called from the island — the browser never calls Operations (D6). `?rep=` and `#id=` are accepted as aliases (the design reads all three).
- **V-2 Reporter fields:** `reporterName` and `reporterEmail` are required on the site, `reporterPhone` optional — the copy promises "we tell you what we found" (verify.093), which needs a reply channel; the door itself requires only `description`, so the site is stricter than the door, never looser (W3). T14's I4 instance map records the same (W105).
- **V-3 The mobile "Show 2 more red flags" fold is not ported** — the design's CSS hides one flag while the label promises two; all five flags render at every width. `verify.230`/`verify.231` stay unused.
- **V-4 The FAQ block renders at every width** — the design shows it only ≤ 700 px while always emitting the FAQPage node; DOM and JSON-LD must agree.
- **V-5 The design's sticky mini search bar** (a second, unlabelled `<input>` after 620 px) becomes the foundation's `StickyCtaBar` with two in-page anchors (`#check`, `#report`) — D20 (no unlabelled input, no duplicate live region). Named delta.
- **V-6 "Print badge" is not ported** (a `document.write` popup with unescaped record fields); badge printing belongs to Operations with the v1.1 stable id. "Copy record link" survives in the dialog scaffold.
- **V-7 The fraud form's three "send us" items (verify.094–096) are the labels of `suspectName`, `suspectContact`, `description`** — the design's numbered list becomes the form itself (W115: the package's own labels, passed as `label`).
- **V-8 Evidence is uploaded by an island, one file per server action (W73/W101).** The file input carries **no `name`**, so the bytes never ride the final submit; each picked file (≤ 4 MB, JPEG/PNG/WEBP/PDF, at most three) is posted alone to the page's `'use server'` `uploadEvidence`, which calls `uploadFraudEvidence` and answers only the key; the island renders one hidden `evidenceKeys` input per key and holds the form's submit while an upload is in flight. A key whose report is never sent is an orphan the Ops purge removes after 7 days (`WEBSITE_FRAUD_ORPHAN_AGE_MS`).
- **V-9 The founder strip reads the W86 `founder` collection** (`{ name, titleId, photoSrc, published }`, one row, `published: false` until §10 row 3) — never the hard-coded hero claims and never `representatives[0]`; the strip's JA- id, "Authorised · no expiry" pill and "Open record" link appear only when the v1.1 register also carries the signing founder's row.

**Files:**

Create

- `src/app/[locale]/(site)/verify/page.tsx`
- `src/app/[locale]/(site)/verify/actions.ts` (`'use server'`: `submitFraud`, `uploadEvidence`)
- `src/app/[locale]/(site)/verify/fraud-schema.ts`
- `src/app/[locale]/(site)/verify/evidence.ts`
- `src/app/[locale]/(site)/verify/register.ts`
- `src/app/[locale]/(site)/verify/lookup.ts`
- `src/app/[locale]/(site)/verify/flags.ts`
- `src/app/[locale]/(site)/verify/faq.ts`
- `src/app/[locale]/(site)/verify/_components/LookupCard.tsx`
- `src/app/[locale]/(site)/verify/_components/StepsDisclosure.tsx`
- `src/app/[locale]/(site)/verify/_components/RecordDialog.tsx`
- `src/app/[locale]/(site)/verify/_components/DescriptionCounter.tsx`
- `src/app/[locale]/(site)/verify/_components/EvidenceUpload.tsx`
- `src/app/[locale]/(site)/verify/_sections/RegisterSection.tsx`
- `src/app/[locale]/(site)/verify/_sections/ReportSection.tsx`
- `src/app/[locale]/(site)/verify/_sections/FraudForm.tsx`
- `src/app/[locale]/(site)/verify/__tests__/fixtures.ts` (shared test rows — not a test file)
- `e2e/pages/verify.spec.ts` (`e2e/pages/` exists since T1)

Modify

- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.verify.*` (inside the existing `seo` object) and a new `sys.verify.*` object
- `src/lib/seo/routes.ts` — delete `'/verify'` from `UNBUILT_PATHNAMES` (W20)
- `src/forms/action.ts` — one keyword: `export` on the existing `visitorOf` (the upload action needs the same one visitor derivation `createFormAction` uses; see **Foundation gaps**)
- `e2e/routes.ts` — append the two locale paths to `GATE_ROUTE_TABLE` (W21)
- `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md`, `docs/ARCHITECTURE.md`, `docs/PRD.md`, `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (ledger row) — Cycle 8

Test

- `src/app/[locale]/(site)/verify/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/register.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/RegisterSection.test.tsx`
- `src/app/[locale]/(site)/verify/__tests__/lookup.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/LookupCard.test.tsx`
- `src/app/[locale]/(site)/verify/__tests__/RecordDialog.test.tsx`
- `src/app/[locale]/(site)/verify/__tests__/fraud-schema.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/evidence.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/actions.test.ts`
- `src/app/[locale]/(site)/verify/__tests__/EvidenceUpload.test.tsx`
- `src/app/[locale]/(site)/verify/__tests__/DescriptionCounter.test.tsx`
- `src/app/[locale]/(site)/verify/__tests__/faq.test.ts`
- `e2e/pages/verify.spec.ts`

**Interfaces:**

Consumes (exact names — WP1 and WP2a Tasks 1–2 as they are in the tree at HEAD; WP2a Tasks 3–9 as spelled in `produces-final.md` plus `task-{3,5,6,7}-additions.md`, which land before WP2b):

- WP1: `getBundle` (`@/content/adapter`), `makeT` (`@/content/pure`), `routing`, `type Locale` (`@/i18n/routing`), `Link` (`@/i18n/navigation`), `buildMetadata` (`@/lib/seo/metadata`), `waLink`, `telLink` (`@/lib/contact`), `formatInt` (`@/lib/format/money`), `track` (`@/analytics/track`), primitives `Button`, `Dialog`, `Eyebrow`, `FormField`, `Section`, `Stat` (`@/design/primitives`), `renderWithIntl` (`@/test/render` — `(ui, { locale })`), `type Bundle` (`contract/website-bundle.v1`; `settings.{phone, phoneDisplay, email, whatsappNumber, turnstileSiteKey}`), `FORM_KEYS` entry `'fraud'` (`@/analytics/forms`).
- WP2a T1 (+ W86 via Task 3's addition): `makeTf` (`@/content/pure`), `getCollection(bundle, 'founder')` → rows `{ name: string; titleId: string; photoSrc: string | null; published: boolean }`, `type CollectionRow` (`@/content/collections`); `bundle.pages.verify` (`titleId: ''`, `descriptionId: ''`, `jsonLd: ['breadcrumb','faq']`); raw `bundle.collections.representatives` (FIXTURE_ONLY — parsed page-locally, accepted in the reconcile list).
- WP2a T2 (at HEAD, post fix round): `createFormAction`, `FormActionError`, `FormDoorError`, `type FormActionState`, and — made public by this task — `visitorOf` (`@/forms/action`); `IDLE_FORM_STATE`, `type FormFallbackKind` (`@/forms/types`); `uploadFraudEvidence(file, visitor)`, `isFile`, `MAX_EVIDENCE_BYTES` (= `MAX_UPLOAD_BYTES`, 4 MB, W73), `MAX_EVIDENCE_FILES` (3) (`@/forms/uploads`, server-only); `type WireFields` (`@/forms/wire`); `fieldErrorsFromIssues` (`@/forms/errors`); `FormShell` (`@/forms/client/FormShell` — `action, formKey, locale, turnstileSiteKey, whatsappNumber, whatsappIntro, contact, submitLabel, consent, testId, className, headingLevel`; `consentLinkHref` omitted → `/privacy`, W79); `Field`, `INPUT_CLASS` (`@/forms/client/Field` — `id`, `label`, `as`, `rows`, `required`, `type`, `autoComplete`, `inputMode`, `minLength`, `maxLength`); `useFieldError`, `useFieldId`, `useRegisterField` (`@/forms/client/FormErrorsContext`); `sys.form.labels.{reporterName,reporterEmail,reporterPhone,evidence}`, `sys.form.hints.{description,evidence,optional}`, `sys.form.placeholders.{reporterName,reporterEmail,reporterPhone,suspectName,suspectContact,description}`, `sys.form.errors.*`, `sys.thankYou.forms.fraud` (all at HEAD in both locales); `next.config.ts` `serverActions.bodySizeLimit: '4mb'`.
- WP2a T3: `ContactLink` (`@/analytics/ContactLink`), `useContactClick(placement)` → `(kind) => void` (`@/analytics/useContactClick`), `verify_lookup` with `PARAM_ENUMS.outcome` value `'register_unavailable'` (`@/analytics/track`), `buttonClassName` (`@/design/primitives`), `CTA_BY_PATHNAME['/verify']` (this page MUST render `id="report"`), route group `(site)`, `sys.nav.home` (W80 — not read here: the crumb uses this package's own `verify.021`, W109), picked client messages (W90).
- WP2a T4: `UNBUILT_PATHNAMES` (`@/lib/seo/routes`) and `src/lib/seo/unbuilt.test.ts`; `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })`; the `sys.seo` object (`ogTagline`).
- WP2a T5 (+ additions W81/W82): `Section` tones `'light' | 'pale'`, `Stat({ value, label, locale })`, `ButtonVariant` incl. `'inverse'`, `StickyCtaBar({ message, ctas, showAfterPx, hideNearId, live })` (`@/design/chrome/StickyCtaBar`, wrapper `data-testid="sticky-cta"`), blocks `Breadcrumbs({ locale, items, tone })`, `EmptyState({ title, body, cta, tone, headingLevel, testId })`, `FaqBlock({ bundle, locale, items, id, eyebrowId, headingId })`, `ImageSlot({ slot, src, alt, width, height, sizes, className })`, `ContactCta({ placement, href, variant, external, children })`, `type FaqItem` (`@/design/blocks`), `formatDate` (`@/lib/format/date`, server only), `testBundle({ strings, collections })` (`@/test/bundle` — merges over the golden fixture, whose collections are empty).
- WP2a T6: `Dialog` (default `'center'` variant).
- WP2a T7 (+ W91): `GATE_ROUTE_TABLE` / `type GateRoute` (`e2e/routes.ts`), `node scripts/gate-routes.mjs`, `npm run gate`, `npm run js-size`, the page markup contract (`data-testid="page-h1"`, `data-lcp-slot`), the bypass header for previews.
- Ops catalog (`apps/backend/src/modules/website/website-form-catalog.ts`, `fraud`): `reporterName` ≤120, `reporterEmail` email ≤254, `reporterPhone` phone ≤40 (≥ 8 digits), `description` 20…5000 REQUIRED, `suspectName` ≤200, `suspectContact` ≤300, `evidenceKeys` `array-of-key` ≤3 items, each ≤300 and `/^website-fraud\/[A-Za-z0-9._-]+$/`; upload `POST /api/website/v1/uploads/fraud-evidence` (write token, multipart `file` only, one file per call, sniffed JPEG/PNG/WEBP/PDF; orphans purged after 7 days). The v1.1 additions (`city`/`track`/`topic`/`portfolioUrl`) do not touch `fraud`.

Produces (later tasks rely on): `id="report"` (the header CTA target, T1's "Report fraud" link `{ pathname: '/verify', hash: '#report' }`) and `id="check"`/`id="structure"`; `form[data-form-key="fraud"]` with inputs named by the catalog (T14's I4 map: rows 14–15, evidence via the island); placeholder slot `rep-founder` (T15's inventory — rendered only when the founder row is published, so 0 today is correct); the exported `visitorOf` (`@/forms/action`). The `Representative` page-local schema (`register.ts`) is the shape the v1.1 `WebsiteRepresentative` importer must emit — recorded in `docs/CONTENT-MODEL.md`.

---

#### Cycle 1 — Route skeleton, metadata, hero, `UNBUILT` removal, every `sys.verify.*` / `sys.seo.verify.*` key

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/verify/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key this page adds (W9/W23). Both files carry each one, non-empty, and — apart
 *  from the example ID — the Turkish is not a copy of the English. */
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
  'verify.report.submit',
  'verify.report.counter',
  'verify.record.close',
  'verify.evidence.uploading',
  'verify.evidence.attached',
  'verify.evidence.remove',
  'verify.evidence.tooBig',
  'verify.evidence.badType',
  'verify.evidence.tooMany',
  'verify.evidence.failed',
  'verify.evidence.wait',
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
    const args: Record<string, string[]> = {
      'verify.lookup.resultBody': ['{query}'],
      'verify.lookup.hint': ['{min}'],
      'verify.report.counter': ['{n}', '{min}'],
      'verify.evidence.uploading': ['{name}'],
      'verify.evidence.attached': ['{name}'],
      'verify.evidence.remove': ['{name}'],
      'verify.evidence.tooBig': ['{name}', '{maxMb}'],
      'verify.evidence.badType': ['{name}'],
      'verify.evidence.tooMany': ['{max}'],
      'verify.evidence.failed': ['{name}'],
    };
    for (const f of [tr, en])
      for (const [key, tokens] of Object.entries(args))
        for (const token of tokens) expect(read(f.sys, key), `${key} ${token}`).toContain(token);
  });

  it('no Phase A copy promises a reply time (the review-minors rule: no false SLA claims)', () => {
    for (const f of [tr, en])
      expect(JSON.stringify(read(f.sys, 'verify'))).not.toMatch(/minute|dakika/i);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/verify"` → every `exists in both locales` case fails with `expected 'undefined' to be 'string'` (no `sys.verify` object, no `sys.seo.verify`). `npx vitest run src/lib/seo/unbuilt.test.ts` is green now and would go RED the moment `page.tsx` exists unless `'/verify'` leaves `UNBUILT_PATHNAMES` in the same step — Step 3 does both.

- [ ] **Step 3: Implement**

`src/messages/tr.json` — two key-anchored edits inside `"sys"` (key order inside an object is not significant; `src/messages/messages.test.ts` compares key sets). (a) Inside the existing `"seo"` object (WP2a Task 4 created it with `ogTagline`; earlier page tasks added their own `seo.<pageKey>` objects — keep them) add:

```json
      "verify": {
        "title": "JobsAdmire Temsilcisi Doğrulama — Resmî Yetki Kontrolü",
        "description": "Karşınızdaki kişinin gerçekten JobsAdmire adına hareket edip etmediğini kontrol edin: bizim adımıza yalnızca kurucu imza atar, hiç kimse bir işçiden para almaz. JA- kimliğini sorgulayın, uyarı işaretlerini tanıyın, sahtekârı bildirin."
      }
```

(b) A new `"verify"` object as a direct child of `"sys"` (append it after the last page object earlier tasks added):

```json
    "verify": {
      "lookup": {
        "placeholder": "JA-REP-014",
        "hint": "Kimliğin, adın ya da numaranın en az {min} karakterini yazın.",
        "resultTitle": "Herkese açık kayıt defteri henüz yayımlanmadı",
        "resultBody": "“{query}” için çevrim içi doğrulama şu an yapılamıyor. Ofisimizi arayın ya da WhatsApp'tan yazın; bu kişinin JobsAdmire için çalışıp çalışmadığını size teyit ederiz. O zamana kadar belge ya da para vermeyin.",
        "whatsapp": "WhatsApp'tan sorun"
      },
      "empty": {
        "title": "Kayıt defteri henüz herkese açık değil",
        "body": "Her JobsAdmire temsilcisi bir JA- kimliği taşır. Fotoğrafların ve kayıtların yer aldığı herkese açık kayıt defteri, her kişinin onayıyla hazırlanıyor. Yayımlanana kadar bir adı ya da kimliği ofisimizle telefon veya WhatsApp üzerinden doğrulayın."
      },
      "register": {
        "former": "Artık yetkili değil"
      },
      "report": {
        "submit": "Bildirimi gönder",
        "counter": "{n} / {min} karakter"
      },
      "record": {
        "close": "Kaydı kapat"
      },
      "evidence": {
        "uploading": "{name} yükleniyor…",
        "attached": "{name} eklendi.",
        "remove": "{name} dosyasını kaldır",
        "tooBig": "{name} {maxMb} MB'tan büyük; daha küçük bir dosya seçin.",
        "badType": "{name} kabul edilmedi; JPEG, PNG, WEBP ya da PDF seçin.",
        "tooMany": "En fazla {max} dosya ekleyebilirsiniz.",
        "failed": "{name} şu anda yüklenemedi. Bildirimi dosyasız gönderebilir, kanıtı WhatsApp'tan iletebilirsiniz.",
        "wait": "Dosyalar hâlâ yükleniyor; bitince yeniden gönderin."
      }
    }
```

`src/messages/en.json` — the same two positions:

```json
      "verify": {
        "title": "Verify a JobsAdmire Representative — Official Authority Check",
        "description": "Check whether a person really acts for JobsAdmire: only the founder signs for us and nobody collects money from a worker. Look up a JA- ID, know the red flags, report an impostor."
      }
```

```json
    "verify": {
      "lookup": {
        "placeholder": "JA-REP-014",
        "hint": "Type at least {min} characters of the ID, name or number.",
        "resultTitle": "The public register is not published yet",
        "resultBody": "We cannot check “{query}” online yet. Call the office or write to us on WhatsApp and we will confirm whether this person works for JobsAdmire. Until then, do not hand over documents or money.",
        "whatsapp": "Ask on WhatsApp"
      },
      "empty": {
        "title": "The register is not public yet",
        "body": "Every JobsAdmire representative carries a JA- ID. The public register with photos and records is being prepared with each person's consent. Until it is published, confirm any name or ID with the office by phone or WhatsApp."
      },
      "register": {
        "former": "No longer authorised"
      },
      "report": {
        "submit": "Send the report",
        "counter": "{n} / {min} characters"
      },
      "record": {
        "close": "Close record"
      },
      "evidence": {
        "uploading": "Uploading {name}…",
        "attached": "{name} attached.",
        "remove": "Remove {name}",
        "tooBig": "{name} is larger than {maxMb} MB; choose a smaller file.",
        "badType": "{name} was not accepted; choose a JPEG, PNG, WEBP or PDF.",
        "tooMany": "You can attach up to {max} files.",
        "failed": "{name} could not be uploaded right now. You can send the report without it and share the evidence on WhatsApp.",
        "wait": "Files are still uploading; send again once they finish."
      }
    }
```

(The apostrophes in `MB'tan`/`WhatsApp'tan` are literal under ICU's DOUBLE_OPTIONAL rule — a single `'` quotes only before `{`, `}`, `#` or `|` — the same spelling the existing `sys.*` copy already uses.)

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` set literal (WP2a Task 4; fewer than 19 entries by now), **delete the line** `  '/verify',`. Nothing else in the file changes.

`src/app/[locale]/(site)/verify/page.tsx` — written once here in its Cycle 1 shape; each later cycle names the exact lines it adds, anchored on the comments below:

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
  // The package carries no SEO strings for this page (only hire/partner have them): the
  // record's titleId/descriptionId are '' and buildMetadata takes these fallbacks (W23/W38).
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
  // Cycle 2 adds the register/founder reads here.

  return (
    <>
      {/* ===== Hero (dark) — the LCP element is the h1: this hero has no photograph (D26). ===== */}
      <section className="relative overflow-hidden bg-navy pb-14 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgba(24,153,213,0.2),transparent_60%)]"
        />
        <div className="container-site relative pt-7">
          {/* W109: this package's own labels — verify.021 "Home", verify.006 the page's nav label. */}
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
      {/* Cycle 5: <ReportSection …/> (id="report" — CTA_BY_PATHNAME['/verify'] points here) */}
      {/* Cycle 6: FAQ block */}
      {/* Cycle 3: sticky bar */}
    </>
  );
}
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/verify" src/messages` → `npx vitest run "src/app/\[locale\]/(site)/verify" src/messages src/lib/seo` → the 21 key cases, the ICU case and the no-SLA case pass; `src/messages/messages.test.ts` (identical key sets) passes; `src/lib/seo/unbuilt.test.ts` passes (the filesystem now has `verify/page.tsx` and the set no longer lists it). `npm run verify` → typecheck, lint, format, unit tests all green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/verify" src/messages/tr.json src/messages/en.json src/lib/seo/routes.ts
git commit -m "feat(verify): route skeleton, metadata from sys.seo.verify, dark hero with breadcrumbs, sys.verify copy (T10 c1)

/temsilci-dogrulama and /en/verify leave UNBUILT_PATHNAMES (W20). The h1 is the LCP slot;
the desktop/mobile hero copy variants are CSS-gated (W10); the crumbs are this package's own
labels (W109).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — The register data layer and the structure section (stats, founder, register, former, firewall) — every part data-driven, empty in Phase A

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/verify/__tests__/fixtures.ts` (shared rows — not a `*.test.*` file, so Vitest does not collect it and importing it never re-registers another file's cases):

```ts
import type { CollectionRow } from '@/content/collections';
import type { Representative } from '../register';

/** A v1.1 register row for the signing founder (fixture data — no real person). */
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

/** The W86 `founder` collection row once §10 row 3 clears (published). */
export const FOUNDER_ROW: CollectionRow<'founder'> = {
  name: 'Founder Example',
  titleId: 'verify.243',
  photoSrc: null,
  published: true,
};
```

`src/app/[locale]/(site)/verify/__tests__/register.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { readRegister, RegisterError } from '../register';
import { FORMER, FOUNDER } from './fixtures';

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
    // production: the row is dropped and the page renders its empty state
    expect(readRegister(bundle, 'production').rows).toEqual([]);
  });

  it('a suspended founder, or one who may not sign, is not "the founder"', () => {
    const suspended = { ...FOUNDER, status: 'suspended' as const };
    expect(
      readRegister(testBundle({ collections: { representatives: [suspended] } })).founder,
    ).toBeNull();
    const noSign = { ...FOUNDER, canSign: false };
    expect(
      readRegister(testBundle({ collections: { representatives: [noSign] } })).founder,
    ).toBeNull();
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
import { FORMER, FOUNDER, FOUNDER_ROW } from './fixtures';

// `Stat` animates its count-up only in view; jsdom has no IntersectionObserver.
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
  'verify.046': 'Authorised',
  'verify.051': 'Call the office',
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
  'verify.068': 'Person',
  'verify.069': 'City',
  'verify.070': 'Representative ID',
  'verify.071': 'Status',
  'verify.073': 'No longer authorised:',
  'verify.074': 'Partner agencies are not on this chart on purpose.',
  'verify.075': 'They are suppliers abroad.',
  'verify.076': 'How partnering works',
  'verify.243': 'Founder',
  'verify.259': 'Suspended',
};

function renderSection(opts: {
  representatives?: unknown[];
  founder?: typeof FOUNDER_ROW | null;
  updatedLabel?: string | null;
}) {
  const bundle = testBundle({
    strings: STRINGS,
    collections: opts.representatives
      ? { representatives: opts.representatives as Record<string, unknown>[] }
      : {},
  });
  return renderWithIntl(
    <RegisterSection
      bundle={bundle}
      locale="en"
      register={readRegister(bundle)}
      founder={opts.founder ?? null}
      updatedLabel={opts.updatedLabel ?? null}
    />,
    { locale: 'en' },
  );
}

describe('RegisterSection', () => {
  it('Phase A: the designed empty state, no stats, no founder, no former strip', () => {
    renderSection({});
    expect(screen.getByTestId('verify-structure')).toBeInTheDocument();
    const empty = screen.getByTestId('verify-empty');
    expect(empty).toHaveAttribute('role', 'status');
    expect(empty).toHaveTextContent('The register is not public yet');
    expect(screen.queryByTestId('verify-stats')).toBeNull();
    expect(screen.queryByTestId('verify-founder')).toBeNull();
    expect(screen.queryByTestId('verify-former')).toBeNull();
    // the firewall note is static copy and always renders
    expect(
      screen.getByText('Partner agencies are not on this chart on purpose.'),
    ).toBeInTheDocument();
  });

  it('W86: a published founder row shows the strip without any register row — no id, no record link', () => {
    renderSection({ founder: FOUNDER_ROW });
    const strip = screen.getByTestId('verify-founder');
    expect(strip).toHaveTextContent('Founder Example');
    expect(strip).toHaveTextContent('Founder');
    expect(strip).toHaveTextContent('Sole signatory');
    expect(strip).toHaveTextContent('A contract signed by anyone else does not bind JobsAdmire.');
    expect(strip).not.toHaveTextContent('JA-REP');
    expect(screen.queryByRole('link', { name: 'Open record' })).toBeNull();
    // the photo slot is the named placeholder T15 inventories
    expect(strip.querySelector('[data-placeholder="rep-founder"]')).not.toBeNull();
  });

  it('with register rows: stats, the founder id + record link, the list and the former strip; no empty state', () => {
    renderSection({
      representatives: [FOUNDER, FORMER],
      founder: FOUNDER_ROW,
      updatedLabel: 'Register last updated: 29 July 2026',
    });
    expect(screen.queryByTestId('verify-empty')).toBeNull();
    expect(screen.getByTestId('verify-stats')).toHaveTextContent(
      'Register last updated: 29 July 2026',
    );
    const strip = screen.getByTestId('verify-founder');
    expect(strip).toHaveTextContent('JA-REP-001');
    expect(strip).toHaveTextContent('Authorised · no expiry');
    expect(screen.getAllByRole('link', { name: /JA-REP-001|Open record/ }).length).toBeGreaterThan(0);
    expect(screen.getByTestId('verify-register')).toHaveTextContent('JA-REP-001');
    expect(screen.getByTestId('verify-former')).toHaveTextContent('Former Example · JA-REP-018');
  });

  it('an unpublished founder row renders no strip even with register rows (§10 row 3)', () => {
    renderSection({ representatives: [FOUNDER], founder: null });
    expect(screen.queryByTestId('verify-founder')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/verify"` → `register.test.ts` and `RegisterSection.test.tsx` fail to import (`Cannot find module '../register'`, `'../_sections/RegisterSection'`); `fixtures.ts` fails to type-check for the same reason.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/verify/register.ts` (no directive — pure, unit-tested):

```ts
import { z } from 'zod';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/**
 * The page-local shape of one `representatives` row — the v1.1 `WebsiteRepresentative` record
 * (D9: consent record, stable public id, company contacts only). `representatives` is NOT one
 * of `CollectionSchemas`' keys (it is FIXTURE_ONLY, refused in production under LOCAL — D23;
 * the reconcile list accepts page-local parsing for Phase A), so it is parsed here with the
 * same dev-throw / prod-drop rule `getCollection` applies. Fail closed: `status` is an enum —
 * the design's "unknown = Authorised" fallback is exactly what this schema forbids.
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
  /** The one active founder who may sign — gives the founder strip its JA- id; null hides it. */
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
import type { CollectionRow } from '@/content/collections';
import { makeT, makeTf } from '@/content/pure';
import { EmptyState, ImageSlot } from '@/design/blocks';
import { Button, Eyebrow, Section, Stat } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { telLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { Register, Representative } from '../register';

type Props = {
  bundle: Bundle;
  locale: Locale;
  register: Register;
  /** W86: the published `founder` collection row, or null (the strip stays hidden — §10 row 3). */
  founder: CollectionRow<'founder'> | null;
  /** `Register last updated: <date>` composed by the page; null while there are no rows (D17). */
  updatedLabel: string | null;
};

/** `useTranslations` is legal in a non-async server component (next-intl). */
export function RegisterSection({ bundle, locale, register, founder, updatedLabel }: Props) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');

  return (
    <Section tone="pale" id="structure" className="scroll-mt-5">
      {/* W113: the test id sits on a wrapping div — Section's props stay frozen. */}
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
        <FounderStrip founder={founder} record={register.founder} t={t} />

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

/** V-9 / W86: rendered only from the published founder row (never from the hero copy). The JA-
 *  id, the no-expiry pill and the record link need the v1.1 register row as well. */
function FounderStrip({
  founder,
  record,
  t,
}: {
  founder: CollectionRow<'founder'> | null;
  record: Representative | null;
  t: (id: string) => string;
}) {
  if (!founder) return null;
  return (
    <article
      data-testid="verify-founder"
      className="mb-6 flex flex-wrap items-center gap-6 rounded-lg border border-border-1 bg-white p-6 shadow-card-hover"
    >
      <div className="size-[84px] shrink-0 overflow-hidden rounded-full ring-4 ring-tint">
        <ImageSlot
          slot="rep-founder"
          src={founder.photoSrc}
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
          <span className="rounded-pill bg-navy px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[1.1px] text-white">
            {t('verify.060')}
          </span>
        </div>
        <p className="mt-1 mb-0 text-body-sm font-bold text-text-secondary">
          {t(founder.titleId)}
        </p>
        {record ? (
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            {record.validUntil === null ? (
              <span className="inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-extrabold text-success-text">
                <span aria-hidden="true" className="inline-block size-2 rounded-full bg-success" />
                {t('verify.061')}
              </span>
            ) : null}
            <span className="text-body-sm font-extrabold text-muted">{record.id}</span>
          </div>
        ) : null}
      </div>
      <div className="ml-auto flex max-w-[340px] flex-col items-end gap-2.5">
        {record ? (
          // V-1: the record deep link is ?id= on this route.
          <Link
            href={{ pathname: '/verify', query: { id: record.id } }}
            className="inline-flex min-h-[44px] items-center rounded-xs border border-border-1 bg-white px-6 text-body-sm font-extrabold text-ink no-underline hover:bg-pale-1"
          >
            {t('verify.062')}
          </Link>
        ) : null}
        <p className="m-0 text-right text-body-sm font-bold text-danger">{t('verify.063')}</p>
      </div>
    </article>
  );
}

/** The v1.1 register, minimal: one accessible row per active person with the four design
 *  columns. The design's sidebar/panel/grouping UI is v1.1 work on top of this list. */
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
                  className="inline-block rounded-input border border-border-1 bg-pale-1 px-3 py-1.5 text-body-sm font-extrabold text-ink no-underline"
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
          <span className="text-body-sm font-extrabold text-ink">
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

`src/app/[locale]/(site)/verify/page.tsx` — Cycle 2 edits:

(a) After `import { buildMetadata } from '@/lib/seo/metadata';` add:

```tsx
import { getCollection } from '@/content/collections';
import { formatDate } from '@/lib/format/date';
import { RegisterSection } from './_sections/RegisterSection';
import { readRegister } from './register';
```

(b) Replace the line `  // Cycle 2 adds the register/founder reads here.` with:

```tsx
  const register = readRegister(bundle);
  // W86: the founder strip's one source; unpublished (Phase A) → null → the strip is hidden.
  const founder = getCollection(bundle, 'founder').find((row) => row.published) ?? null;
  // D17: the dated label exists only when the register has rows; today it is null.
  const updatedLabel = register.updatedAt
    ? `${t('verify.225')} ${formatDate(register.updatedAt.slice(0, 10), locale)}`
    : null;
```

(c) Replace the comment line `      {/* Cycle 2: <RegisterSection …/> (id="structure") */}` with:

```tsx
      <RegisterSection
        bundle={bundle}
        locale={locale}
        register={register}
        founder={founder}
        updatedLabel={updatedLabel}
      />
```

- [ ] **Step 4: Run tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/verify"` → `npx vitest run "src/app/\[locale\]/(site)/verify"` → `register.test.ts` 4 passed, `RegisterSection.test.tsx` 4 passed, `sys-keys.test.ts` 23 passed. `npm run verify` green. Notes: `testBundle()` merges `collections` over the golden fixture's empty ones, so `makeTf` inside the section resolves `metricValues` over an empty `metrics` list — fine, no `verify.*` string carries a metric placeholder (checked against the bundles); every `verify.*` id the section reads is in `STRINGS` (`makeT` throws on an unknown id under test). `getCollection(bundle, 'founder')` on a bundle without the key returns `[]` (Task 1's accessor rule).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/verify"
git commit -m "feat(verify): register data layer (fail-closed schema) and the structure section — empty state in Phase A (T10 c2)

Stats, register list and former strip render only from representatives rows (W6, §10 row 11,
D17); the founder strip reads the W86 founder collection and stays hidden while unpublished
(§10 row 3); with no rows the EmptyState carries the designed copy.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — The lookup island (client-only, neutral W6 result, `?id=` deep link, `verify_lookup`, click-time WhatsApp), the record dialog scaffold, the steps disclosure, the sticky bar

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/verify/__tests__/lookup.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { LOOKUP_MIN_CHARS, normaliseQuery, readDeepLinkId } from '../lookup';

describe('normaliseQuery', () => {
  it('trims and collapses whitespace, keeps case (ids are shown as typed)', () => {
    expect(normaliseQuery('  JA-REP-014 ')).toBe('JA-REP-014');
    expect(normaliseQuery('Ayşe   Yılmaz')).toBe('Ayşe Yılmaz');
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
  it('never throws on a malformed escape', () => {
    expect(readDeepLinkId('', '#id=%E0%A4%A')).toBe('%E0%A4%A');
  });
});
```

`src/app/[locale]/(site)/verify/__tests__/LookupCard.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

const events = (name: string) => (window.dataLayer ?? []).filter((e) => e.event === name);

describe('LookupCard (W6: the neutral result, never the red verdict)', () => {
  beforeEach(() => {
    window.dataLayer = [];
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => vi.restoreAllMocks());

  it('shows the neutral result after three characters, fires verify_lookup once, clears', () => {
    renderCard();
    const input = screen.getByLabelText(labels.inputLabel);
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();

    fireEvent.change(input, { target: { value: 'JA' } });
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
    expect(events('verify_lookup')).toHaveLength(0);

    fireEvent.change(input, { target: { value: 'JA-REP-014' } });
    const result = screen.getByTestId('verify-lookup-result');
    expect(result).toHaveAttribute('role', 'status');
    expect(result).toHaveAttribute('data-outcome', 'register_unavailable');
    expect(result).toHaveTextContent('The public register is not published yet');
    expect(result).toHaveTextContent('JA-REP-014');
    expect(result).not.toHaveTextContent('Not on our authorised list');
    expect(events('verify_lookup')).toEqual([
      { event: 'verify_lookup', page: '/', locale: 'en', outcome: 'register_unavailable' },
    ]);

    // more typing in the same query session does not re-fire
    fireEvent.change(input, { target: { value: 'JA-REP-0145' } });
    expect(events('verify_lookup')).toHaveLength(1);

    fireEvent.click(screen.getByTestId('verify-lookup-clear'));
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
    expect(input).toHaveValue('');

    // a new query is a new lookup
    fireEvent.change(input, { target: { value: 'Ali' } });
    expect(events('verify_lookup')).toHaveLength(2);
  });

  it('W95: no DOM href carries the query; the WhatsApp prefill is composed at click time', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { container } = renderCard();
    fireEvent.change(screen.getByLabelText(labels.inputLabel), {
      target: { value: 'JA-REP-014' },
    });
    for (const a of container.querySelectorAll('a'))
      expect(a.getAttribute('href') ?? '').not.toContain('JA-REP');

    // anchored: the card's own "Call the office instead" link shares the prefix
    const call = screen.getByRole('link', { name: /^Call the office$/ });
    expect(call).toHaveAttribute('href', 'tel:+905011240340');
    fireEvent.click(call);
    expect(events('call_click')).toEqual([
      { event: 'call_click', page: '/', locale: 'en', placement: 'page_cta' },
    ]);

    const wa = screen.getByRole('link', { name: /^Ask on WhatsApp$/ });
    expect(wa).toHaveAttribute('href', 'https://wa.me/905011240340');
    fireEvent.click(wa);
    expect(open).toHaveBeenCalledTimes(1);
    const [url, target, features] = open.mock.calls[0] as [string, string, string];
    expect(url.startsWith('https://wa.me/905011240340?text=')).toBe(true);
    expect(decodeURIComponent(url)).toContain(
      'Hello JobsAdmire, I want to check something about JA-REP-014',
    );
    expect([target, features]).toEqual(['_blank', 'noopener']);
    expect(events('whatsapp_click')).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'en', placement: 'page_cta' },
    ]);
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
    expect(events('verify_lookup')).toHaveLength(1);
  });

  it('hides the live pill and the updated label when the page passes null (D17)', () => {
    const { unmount } = renderCard();
    expect(screen.queryByTestId('verify-live-pill')).toBeNull();
    expect(screen.queryByTestId('verify-updated')).toBeNull();
    unmount();
    renderCard({
      livePill: '14 people authorised today',
      updatedLabel: 'Register last updated: 29 July 2026',
    });
    expect(screen.getByTestId('verify-live-pill')).toHaveTextContent('14 people authorised today');
    expect(screen.getByTestId('verify-updated')).toHaveTextContent('29 July 2026');
  });
});
```

`src/app/[locale]/(site)/verify/__tests__/RecordDialog.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import RecordDialog, { type RecordLabels } from '../_components/RecordDialog';
import { RECORD_DIALOG_ENABLED } from '../flags';
import { FOUNDER } from './fixtures';

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
  copyLink: 'Copy record link',
  copied: 'Link copied ✓',
  wrong: 'Something is wrong →',
  status: { active: 'Authorised', suspended: 'Suspended', former: 'No longer authorised' },
  whatsappIntro: 'Hello JobsAdmire, I want to check something about',
};

function renderDialog(record = FOUNDER, onClose = vi.fn()) {
  renderWithIntl(
    <RecordDialog
      open
      record={record}
      labels={labels}
      recordUrl="/en/verify?id=JA-REP-001"
      whatsappNumber="905011240340"
      onClose={onClose}
    />,
    { locale: 'en' },
  );
  return onClose;
}

describe('RecordDialog (v1.1 scaffold)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is off in Phase A', () => {
    expect(RECORD_DIALOG_ENABLED).toBe(false);
  });

  it('renders an accessible dialog for a record: status header, identity, meta, copy link, close', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onClose = renderDialog();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Founder Example');
    expect(dialog).toHaveTextContent('JA-REP-001');
    expect(dialog).toHaveTextContent('Authorised');
    expect(dialog).toHaveTextContent('Sole signatory');
    expect(dialog).toHaveTextContent('No expiry');
    expect(dialog).toHaveTextContent('Antalya');
    fireEvent.click(screen.getByRole('button', { name: 'Copy record link' }));
    expect(writeText).toHaveBeenCalledWith('/en/verify?id=JA-REP-001');
    expect(await screen.findByText('Link copied ✓')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close record' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('W95: the "something is wrong" link is a bare wa.me href; the record id joins at click time', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderDialog();
    const wrong = screen.getByRole('link', { name: 'Something is wrong →' });
    expect(wrong).toHaveAttribute('href', 'https://wa.me/905011240340');
    fireEvent.click(wrong);
    expect(decodeURIComponent((open.mock.calls[0] as [string])[0])).toContain(
      'Hello JobsAdmire, I want to check something about JA-REP-001',
    );
  });

  it('never fails open: a former record shows the former label and no signatory pill', () => {
    renderDialog({ ...FOUNDER, status: 'former', canSign: false });
    expect(screen.getByRole('dialog')).toHaveTextContent('No longer authorised');
    expect(screen.queryByText('Sole signatory')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/verify"` → `lookup.test.ts`, `LookupCard.test.tsx` and `RecordDialog.test.tsx` fail on the missing modules (`../lookup`, `../_components/LookupCard`, `../_components/RecordDialog`, `../flags`).

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
 *  malformed percent-escape in the hash falls back to the raw value. */
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
    if (c === null) continue;
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

`src/app/[locale]/(site)/verify/_components/RecordDialog.tsx` (default export — `LookupCard` imports it lazily through `next/dynamic`; the QR is a v1.1 server-rendered SVG string from the record handler, passed in as `qrSvg?`; the level-keyed May-do/May-never lists join in v1.1 with the handler's `level`):

```tsx
'use client';
import { useState, type MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useContactClick } from '@/analytics/useContactClick';
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
  /** v1.1: an `<svg>` string from the record handler (local encoder, never a third-party URL). */
  qrSvg?: string;
  onClose: () => void;
}) {
  const sys = useTranslations('sys');
  const fireContact = useContactClick('page_cta');
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
  // W95: the record id reached this dialog through the visitor's lookup, so the prefilled chat
  // is composed on click; the rendered href is the bare chat.
  const reportWrong = (e: MouseEvent<HTMLAnchorElement>) => {
    fireContact('whatsapp');
    e.preventDefault();
    window.open(waLink(whatsappNumber, `${labels.whatsappIntro} ${record.id}`), '_blank', 'noopener');
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
      <div
        className={`-m-6 mb-4 flex items-center justify-between px-6 py-3 text-white ${HEAD[record.status]}`}
      >
        <span className="text-body-sm font-extrabold uppercase tracking-[1.2px]">
          {labels.status[record.status]}
        </span>
        <span className="flex items-center gap-3">
          <span className="text-body-sm font-extrabold">{record.id}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={sys('verify.record.close')}
            className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-white/15 text-body font-extrabold hover:bg-white hover:text-ink"
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
            <p className="mt-2 mb-0 inline-flex rounded-pill bg-navy px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.6px] text-white">
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
          from the handler's `level`; not scaffolded — they are static package copy per level. */}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border-1 pt-4">
        <button
          type="button"
          onClick={copy}
          className="min-h-[44px] text-body-sm font-extrabold text-blue-safe"
        >
          {labels.copyLink}
        </button>
        <span role="status" className="text-body-sm font-bold text-success-text">
          {copied ? labels.copied : ''}
        </span>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={reportWrong}
          className="ml-auto inline-flex min-h-[44px] items-center text-body-sm font-extrabold text-danger"
        >
          {labels.wrong}
        </a>
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
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { track } from '@/analytics/track';
import { useContactClick } from '@/analytics/useContactClick';
import { buttonClassName } from '@/design/primitives';
import { INPUT_CLASS } from '@/forms/client/Field';
import { telLink, waLink } from '@/lib/contact';
import { RECORD_DIALOG_ENABLED } from '../flags';
import { LOOKUP_MIN_CHARS, normaliseQuery, readDeepLinkId } from '../lookup';
import type { Representative } from '../register';
import type { RecordLabels } from './RecordDialog';

// v1.1 chunk: declared here so the flag flip is one line; never fetched while the flag is off.
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
 * `RecordDialog`; nothing in this island talks to Operations (D6). W95: the typed query never
 * sits in a DOM href — the WhatsApp chat is prefilled at click time.
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
  const fireContact = useContactClick('page_cta');
  const inputId = useId();
  const hintId = `${inputId}-hint`;

  // V-1: the deep link is a browser fact read after hydration (R18/R27 — no setState in an
  // effect, no hydration mismatch). Once the visitor types, `typed` wins; Clear sets '' (not
  // null) so the URL id does not reassert itself.
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
  const openWhatsApp = (e: MouseEvent<HTMLAnchorElement>) => {
    fireContact('whatsapp');
    e.preventDefault();
    window.open(waLink(whatsappNumber, `${labels.whatsappIntro} ${query}`), '_blank', 'noopener');
  };

  return (
    <div
      id="check"
      data-testid="verify-check"
      className="scroll-mt-5 overflow-hidden rounded-lg bg-white text-ink shadow-hero-form"
    >
      <div
        aria-hidden="true"
        className="h-1 bg-[linear-gradient(90deg,#1899d5_55%,#d8ecf7_45%)] bg-[length:18px_4px]"
      />
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
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={openWhatsApp}
                className={buttonClassName('secondary')}
              >
                {sys('verify.lookup.whatsapp')}
              </a>
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

`src/app/[locale]/(site)/verify/_components/StepsDisclosure.tsx` — the design collapses the three steps behind a non-focusable `div onClick` at ≤ 700 px; this is the same fold as a real button (D20). The cards are server-rendered children, so the copy stays in the HTML at every width:

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
      <div id={panelId} className={`${open ? 'grid' : 'hidden'} mt-4 gap-4 md:grid md:grid-cols-3`}>
        {children}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/verify/page.tsx` — Cycle 3 edits:

(a) After the `import { readRegister } from './register';` line add:

```tsx
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { formatInt } from '@/lib/format/money';
import { LookupCard } from './_components/LookupCard';
import type { RecordLabels } from './_components/RecordDialog';
import { StepsDisclosure } from './_components/StepsDisclosure';
import { RECORD_DIALOG_ENABLED } from './flags';
```

(b) Below `const HERO_TICKS = …;` add:

```tsx
/** The three "Verify in one minute" cards: n, title id, and the body as the package's own
 *  fragments — [plain, bold, plain] (W23: the package itself splits these sentences). The bold
 *  fragment on step 3 is green (the design). */
const STEPS = [
  { n: 1, titleId: 'verify.037', body: ['verify.038', 'verify.039', 'verify.040'], bold: 'white' },
  { n: 2, titleId: 'verify.041', body: ['verify.042', 'verify.043', 'verify.234'], bold: 'white' },
  { n: 3, titleId: 'verify.044', body: ['verify.045', 'verify.046', 'verify.047'], bold: 'green' },
] as const;

const STEP_DOT = ['bg-navy', 'bg-blue', 'bg-success-text'] as const;
```

(c) After the `updatedLabel` constant (Cycle 2) add:

```tsx
  const sys = await getTranslations({ locale, namespace: 'sys' });
  const { settings } = bundle;
  // W6/D17: the pill exists only when the register has rows; today it is null.
  const livePill =
    register.active.length > 0
      ? `${formatInt(register.active.length, locale)} ${t('verify.224')}`
      : null;
  // v1.1 (D9): resolved only once the record dialog is switched on.
  const recordLabels: RecordLabels | null = RECORD_DIALOG_ENABLED
    ? {
        badgeQr: t('verify.109'),
        badgeQrHint: t('verify.110'),
        authorisedUntil: t('verify.111'),
        noExpiry: t('verify.241'),
        contact: t('verify.112'),
        languages: t('verify.113'),
        reportsTo: t('verify.114'),
        withJobsAdmire: t('verify.115'),
        desk: t('verify.116'),
        soleSignatory: t('verify.060'),
        copyLink: t('verify.226'),
        copied: t('verify.267'),
        wrong: t('verify.239'),
        status: {
          active: t('verify.046'),
          suspended: t('verify.259'),
          former: sys('verify.register.former'),
        },
        whatsappIntro: t('verify.228'),
      }
    : null;
```

(d) Replace the placeholder `<div id="check" />` and the comment line above it with:

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
              recordLabels={recordLabels}
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

(f) Replace the comment `{/* Cycle 3: sticky bar */}` with the sticky bar (V-5; `hideNearId="report"` so it leaves when the visitor reaches the form it advertises; `live` = the design's green dot; both CTAs are in-page anchors, so W81's contact tracking has nothing to wrap; the "Report" CTA uses `verify.015` alone — the `verify.015`+`verify.016` composition the header CTA table uses reads back-to-front in Turkish ("Bildir sahtekârı"), a W7 override candidate recorded in Cycle 8):

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

`npx prettier --write "src/app/[locale]/(site)/verify"` → `npx vitest run "src/app/\[locale\]/(site)/verify"` → `lookup.test.ts` 6 passed, `LookupCard.test.tsx` 5 passed, `RecordDialog.test.tsx` 4 passed (plus Cycles 1–2). `npm run verify` green — in particular ESLint under the React Compiler rules: no `setState` in an effect body (the deep link goes through `useSyncExternalStore`, the event through `track()` in an effect with a ref guard), no `ref.current` read during render, and `RECORD_DIALOG_ENABLED` typed `boolean` so the guarded branches are not constant conditions.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/verify"
git commit -m "feat(verify): lookup island with the neutral W6 result, ?id= deep link, verify_lookup; record dialog scaffold; steps disclosure; sticky bar (T10 c3)

Any query of 3+ chars shows 'register not published — verify with the office' with tel and
WhatsApp (page_cta), never the red verdict; verify_lookup fires once per query session with
outcome=register_unavailable (W12/W67). W95: the typed query never sits in a DOM href — the
WhatsApp prefill is composed on click. The record dialog is a lazy chunk behind
RECORD_DIALOG_ENABLED=false (D9 v1.1).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
