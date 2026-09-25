# WP2a — Produces blocks, FINAL (from the reconciled tasks; the WP2b page writers consume exactly these)


Note: the Operations catalog file is `apps/backend/src/modules/website/website-form-catalog.ts` (no `forms/` subdirectory). Rulings W58–W72 (`wp2a/open-rulings.md`) apply on top: ImageSlot forwards `data-lcp-slot` on both branches (W61), `OG_PAGE_KEYS` = every PAGE_KEYS entry + `site` (W66), analytics enum values per W67, `DETAIL_SITEMAP_SOURCES` is a frozen literal edited by the careers task (W70), blocks take `locale` and resolve via `makeTf` (W71).


## Task 1

Produces (frozen for Tasks 3–9 and every WP2b page):

```ts
// src/content/collections.ts — client-safe (no server-only, no fs), Zod
export const METRIC_KEYS = ['placed','employers','countries','permitDays','firstDayWeeks','firstDayWeeksInCountry','replySlaHours','homepageReplyHours','sectors'] as const;
export type MetricKey = (typeof METRIC_KEYS)[number];
export const PAGE_KEYS = ['home','hire','calc','wp','partner','about','contact','workers','stories','verify','careers','careersDetail','blog','blogArticle','portal','privacy','terms','kvkk','cookiePolicy','thankYou','newsletterConfirm','newsletterUnsubscribe'] as const;
export type PageKey = (typeof PAGE_KEYS)[number];
export const PAGE_PATHNAME: Record<PageKey, keyof typeof pathnames>;   // pageKey → internal route ('/blog/[slug]', '/careers/[slug]' for the details)
export type Metric = { key: MetricKey; value: number | null; text: string | null; suffix: '+' | ''; labelId: string | null; unitId: string | null };
export type RateConfig = { version: string; effectiveFrom: string; reviewDueAt: string; updatedAt: string; currency: 'TRY'; legalMinGross: number; sgkEmployerRate: number; sgkRates: { manufacturing: number; other: number; none: number }; supportMonthly: number; permitFeeTRY: number; flightTRY: number; housingMonthlyTRY: number; quotaRatio: number };
//   emitted row: version '2026-01', effectiveFrom '2026-01-01', reviewDueAt '2026-12-20', updatedAt '2026-01-15', legalMinGross 33030, sgkEmployerRate 0.2175, sgkRates {0.1875, 0.2175, 0.2375}, supportMonthly 1270, permitFeeTRY 16000, flightTRY 12000, housingMonthlyTRY 5000, quotaRatio 5 (Task 9's engine reads it through getRateConfig)
export type CalculatorRole = { key: string; labelId: string; multiplier: number; group: 'general' | 'skilled' | 'specialist'; preset: boolean; industry: 'factory' | 'construction' | 'hotel' | 'agriculture' | null; industryLabelId: string | null; salaryMin: number | null; salaryMax: number | null };
//   15 rows: the 12 design roles (preset:false, keys welder cnc machine textile electrician plumber labourer cook waiter housekeeping steward greenhouse) + 3 homepage presets (preset:true, keys generalPreset/skilledPreset/specialistPreset, multipliers 1 / 1.5 / 2, labelIds home.240–242)
export type SourceCountry = { code: string /* ISO2 UPPER-CASE, W40 */; nameId: string | null; name: string /* locale-resolved */; dial: string /* '+92' */; lon: number; lat: number; flag: string /* emoji */ };   // 13 rows in this order: PK NP IN UZ KG TM PH ID RU ML SN CM LK
export type Country = { code: string /* ISO2 upper-case */; name: string /* locale-resolved */; dial: string /* '+90' */ };   // W25: the general list, 64 rows from scripts/data/countries.json (data, not copy), file order = code order; sort by `name` at the edge; contains every sourceCountries code and TR
export type Office = { key: 'antalya' | 'karachi'; kind: 'hq' | 'sourcing'; cityId: string; labelId: string; addressId: string; addressLine2Id: string; hoursId: string; footerLabelId: string; phone: string; whatsapp: string; email: string; hours: { tz: string; days: number[] /* JS getDay() 0=Sun…6=Sat (W43) */; open: string; close: string }; mapUrl: string };
//   antalya: cityId contact.096, labelId contact.099 ('Head office'), addressId contact.133, addressLine2Id contact.134, hoursId contact.100, footerLabelId home.196, days [1..5]; karachi: contact.097, contact.104 ('Sourcing office'), contact.105, contact.103, contact.106, home.197, days [1..6]
export type Sector = { key: 'factory' | 'construction' | 'tourism' | 'agriculture' | 'textile' | 'logistics' | 'other'; labelId: string; subtitleId: string | null; icon: string };   // keys = the stable option values every form sends; labels hire.076–082, subtitles hire.083–088 ('other' → null)
export type BlogPost = { key: string /* EN slug */; slug: { tr: string | null; en: string | null }; title: { tr: string | null; en: string | null }; excerpt: { tr: string | null; en: string | null }; category: 'workPermits' | 'recruitment' | 'compliance' | 'marketNews'; categoryLabelId: string; author: string; publishedAt: string /* YYYY-MM-DD */; readMinutes: number; hasBody: { tr: boolean; en: boolean }; body: { tr: string | null; en: string | null } };
//   22 rows (one per EN article, the 4 TR translations folded in); W28: `body[locale]` is Markdown (paragraphs, `## ` headings, `- ` lists, `1. **lead** body` steps, `> ` quote/callout), non-null exactly when hasBody[locale] (schema-refined) — today 1 EN body, 0 TR; the body is composed from the Blog Article page's package ids (blogarticle.025–063), so render it through the page task's Markdown renderer and, defensively, `fill(body, metricValues(bundle, locale))`
export const MetricSchema, RateConfigSchema, CalculatorRoleSchema, SourceCountrySchema, CountrySchema, OfficeSchema, SectorSchema, BlogPostSchema;   // Zod
export const OFFICE_KEYS = ['antalya','karachi'] as const; export type OfficeKey; export const SECTOR_KEYS; export type SectorKey; export const BLOG_CATEGORIES; export type BlogCategory;
export const CollectionSchemas = { metrics, rateConfig, calculatorRoles, sourceCountries, countries, offices, sectors, blog };   // eight Phase A collections
export type CollectionKey = keyof typeof CollectionSchemas;
export type CollectionRow<K extends CollectionKey> = z.infer<(typeof CollectionSchemas)[K]>;
export class CollectionError extends Error {}
export function getCollection<K extends CollectionKey>(bundle: Bundle, key: K): CollectionRow<K>[];  // parses + caches per bundle object (WeakMap); absent key → []; dev/test: throws CollectionError on a schema miss; prod: console.error + []
export function getMetric(bundle: Bundle, key: MetricKey): Metric;      // dev: throws when absent; prod: {value:null,text:null,suffix:'',labelId:null,unitId:null}
export function getRateConfig(bundle: Bundle): RateConfig;              // throws CollectionError in every env when absent (money never degrades silently, D17)
export function getOffice(bundle: Bundle, key: OfficeKey): Office;      // throws in every env when absent
export const BLOG_NAV_THRESHOLD = 6;
export function blogNavVisible(bundle: Bundle): boolean;               // rows with hasBody.tr ≥ threshold (W4) — the ONE source; Task 3's nav.ts re-exports these two (W35)
export function getPageSeo(bundle: Bundle, key: PageKey): Bundle['pages'][string] | undefined;

// src/content/pure.ts (additions)
export function fill(template: string, values: Record<string, string>): string;   // `{key}` replacement; unknown key throws in dev, left as-is in prod; `{{ mustache }}` (verify.050/119) untouched
export function metricValues(bundle: Bundle, locale: Locale): Record<string, string>;   // { placed:'470+', employers:'22+', countries:'13', permitDays:'45', firstDayWeeks:'6–8', firstDayWeeksInCountry:'4–6', replySlaHours:'4', homepageReplyHours:'24', sectors:'6' } (TR/EN formatting via formatInt)
export function makeTf(bundle: Bundle, locale: Locale): (id: string) => string;    // = fill(t(id), metricValues(bundle, locale)) — the accessor pages use for re-authored ids

// src/content/lint.ts (changed signature + one new export)
export type MetricLiterals = Record<string, readonly string[]>;
export function parseMetricLiteral(literal: string): { text: string; pre: string; span: string; post: string };   // "[22+] clients" → text '22+ clients', span '22+'; no brackets = whole literal is the span
export function findHardTypedMetrics(strings: Record<string, string>, literals: MetricLiterals, baseline?: Record<string, string>): string[];   // case-insensitive match on literal `text` (markers ignored), ids in `baseline` skipped, sorted

// scripts/import-design-package.ts
export function buildBundles(): { tr: Bundle; en: Bundle; catalogue: Record<string, CatalogueRow>; report: ImportReport };
export function buildNav(blogVisible: boolean): NavItem[];
export function rev(en: string): string;   // djb2 base-36, the package's own algorithm
export type CatalogueRow = { page: string; sec: string; legal: boolean; rev: string; k?: string; packageRev?: string; edits?: ('override'|'turkiye'|'placeholder')[] };   // rev is recomputed over the emitted EN when the importer changed it; packageRev keeps the original
export type ImportReport = { overrides: { id; locale; before; after; reason }[]; turkiye: number; placeholders: { id; key; en; tr }[]; blog: { rows; trBodies; navVisible } };
// bundle.nav (W36: the portal row lives ONLY here — Task 3 renders the groups and drops its hard-coded anchors):
//   desktopNav      10 rows in README order: /hire-workers /available-workers /work-permit /hiring-cost-calculator /about /success-stories /verify /partner-with-us /careers /contact (labels home.002 003 004 005 001 006 011 008 009 007); /blog (home.010) joins between /success-stories and /verify once the threshold is met → 11
//   hamburger       desktopNav + { href: 'https://portal.jobsadmire.com/auth/login', labelId: 'home.012', external: true } → 11 (12 with /blog)
//   slimBarRight    /blog (home.013, gated) · /careers (home.009) · /verify (home.011) · portal (home.012, external) → 3 today (4 with /blog)
//   footerEmployers /hire-workers /available-workers /hiring-cost-calculator /work-permit /verify · portal (external) → 6
//   footerCompany   /about /success-stories · /blog (home.013, gated) · /partner-with-us /careers /contact → 5 today (6 with /blog)
//   slimBarLeft / footerContact / mobileBottomBar / socialRail are declared EMPTY (settings-driven, R15). Total 35 rows today, 39 once /blog clears W4.
//   `order` is 0-based within the group after gating; `visibleOn: ['desktop','mobile']` on every row.
// bundle.pages: one record per PAGE_KEYS entry (22); titleId/descriptionId are '' where the package has no SEO string (only hire → hire.264/265, partner → partner.222/223 have them) → buildMetadata treats '' as "use the page's sys.seo.<pageKey>.* fallback" (W23/W38); robots 'noindex' for blog, blogArticle, portal, thankYou, newsletterConfirm, newsletterUnsubscribe; ogImage/canonical null; jsonLd lists per PAGE_TABLE below
// bundle.strings: W7 overrides applied (scripts/content-overrides.json, 24 ids / 29 locale values, incl. hire.240/241 per W51), EN Turkey→Türkiye (93 values), 39 ids re-authored with {metric} placeholders (42 replacements; scripts/metric-placeholders.json); 31 legal-flagged metric strings + jt.271 verbatim and listed in scripts/metric-lint-baseline.json (32 entries)
// bundle.collections: metrics (9), rateConfig (1), calculatorRoles (15), sourceCountries (13), countries (64), offices (2), sectors (7), blog (22) — identical per locale except the locale-resolved `name` fields
// src/lib/seo/metadata.ts: buildMetadata uses fallbackTitle/fallbackDescription when the page record's titleId/descriptionId is '' (W38 — Task 4's rewrite and OG route keep `seo?.titleId ? t(seo.titleId) : fallback`)
```

**Produces — deviations:** (1) `blog` rows pair each EN article with its TR translation (`slug/title/excerpt` as `{tr, en}` objects, inline text) instead of `titleId`/`excerptId` + `translationOf` — blog-posts.js copy has no package ids and W9 forbids minting them. (2) W28 says the body is "Markdown text from `blog-posts.js`"; that file carries **no** body text (verified — cards only), so `body[locale]` is Markdown the importer composes from the Blog Article page's package ids (`blogarticle.025`–`063`, `ARTICLE_BODY` table), non-null exactly when `hasBody[locale]` (schema refinement) — 1 EN, 0 TR today; a TR body appears automatically the day the TR card is marked `full`. (3) `sourceCountries.nameId` is nullable (Senegal has no package id) with a locale-resolved `name` alongside, and every row carries `dial` (W25). (4) `countries` is the W25 general list: 64 rows (not "~60"), file order = code order, sorted by name at the edge; `Country = { code, name, dial }`. (5) `calculatorRoles` carries 15 rows: the 12 design roles plus the three homepage presets as `preset: true` rows (no 2.0× role exists in the page table). (6) `pages` records use `''` (not `null` — the frozen `PageSeoSchema` requires strings) for missing SEO ids, and `buildMetadata` gained a two-line `''` → fallback rule (W38). (7) `findHardTypedMetrics` takes a literal-spelling table (`MetricLiterals`) whose entries mark the value span in `[…]`, plus the baseline, instead of `Record<string, number>`; `parseMetricLiteral` is a new export; the baseline admits one `not-a-metric:` entry (jt.271) beside the legal ones. (8) Re-authoring swaps only the value span, so the copy keeps its unit word (`{employers} clients`, `{countries} ülkede`); three spellings are normalised to the ruled metric (`14+` → 22+, `13+` → 13, `8–10 weeks` → 6–8). (9) Four of the nine nav groups are declared empty (settings-driven, R15) rather than filled; the portal row is emitted in `hamburger`, `slimBarRight` and `footerEmployers` (W36); 35 rows today, 39 with `/blog`. (10) `offices` keys are `antalya | karachi` only (the package has no third office); `hours.days` use JS `getDay()` 0–6 (W43). (11) `content-overrides.json` has 24 ids (the draft's 22 + `hire.240`/`hire.241`, W51) → 29 logged locale values. (12) Extras: `makeTf`, `getPageSeo`, `PAGE_KEYS`/`PAGE_PATHNAME`, `buildNav`/`rev`/`CatalogueRow`/`ImportReport` exports, `rateConfig.sgkRates/housingMonthlyTRY/quotaRatio/updatedAt`, `Metric.unitId`, `CountrySchema`/`Country`.


## Task 2

Produces (frozen for Tasks 3–5 and every WP2b page):

```ts
// src/forms/consent.ts
export const CONSENT_VERSION = 'kvkk-2026-09' as const;

// src/forms/wire.ts  (pure, client-safe)
export type WireFields = Record<string, string | string[]>;
export type WireEnvelope = { locale: Locale; consentVersion: string; captchaToken?: string; honeypot?: string; sourcePath?: string; fields: WireFields };
export function buildEnvelope(input: { locale: Locale; fields: WireFields; captchaToken?: string | null; honeypot?: string | null; sourcePath?: string | null }): WireEnvelope;

// src/forms/errors.ts  (pure, client-safe)
export const FORM_ERROR_CODES = ['required','email','phone','min','max','url','file','consent','captcha','invalid'] as const;
export type FormErrorCode = (typeof FORM_ERROR_CODES)[number];
export function isFormErrorCode(v: unknown): v is FormErrorCode;
export function issueToCode(issue: ZodIssue): FormErrorCode;               // a schema's `{ message: 'phone' }` wins
export function fieldErrorsFromIssues(issues: ZodIssue[]): Record<string, string>;  // first issue per path; value = FormErrorCode; root issue → `_form`

// src/forms/types.ts  (client-safe — W44: the door result types live here)
export const HONEYPOT_FIELD = 'honeypot'; export const CAPTCHA_FIELD = 'cf-turnstile-response'; export const CONSENT_FIELD = 'consent';
export type PostFormOk = { kind: 'ok'; id: string; status: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM'; isTest: boolean; replayed: boolean; captchaDegraded: boolean; error: string | null };
export type PostFormResult = PostFormOk | { kind: 'invalid'; message: string } | { kind: 'captcha' } | { kind: 'off' } | { kind: 'tripped' } | { kind: 'unauthorized' } | { kind: 'unavailable'; cause: 'network' | 'timeout' | 'server' };
export type PostFormVisitor = { ip: string | null; ua: string | null };
export type FormErrorResult = Exclude<PostFormResult, PostFormOk> | { kind: 'failed'; error: string | null };
export type FormFallbackKind = FormErrorResult['kind'];   // 'invalid'|'captcha'|'off'|'tripped'|'unauthorized'|'unavailable'|'failed'
export type FormActionState =
  | { status: 'idle' }
  | { status: 'error'; result: FormErrorResult; values: Record<string, string> }
  | { status: 'fieldErrors'; errors: Record<string, string>; values: Record<string, string> };
export const IDLE_FORM_STATE: FormActionState;
export class FormActionError extends Error { readonly visitorMessage: string; readonly field?: { name: string; code: FormErrorCode } }
//   thrown from a page's `toFields` (or by uploads.ts): with `field` → `{ status: 'fieldErrors', errors: { [field.name]: field.code } }`; without → `{ kind: 'failed', error: visitorMessage }`
export class FormDoorError extends Error { readonly result: FormErrorResult }   // thrown by uploads.ts for a door-side failure → `{ status: 'error', result }`

// src/forms/env.ts  (import 'server-only')
export const WEBSITE_TOKEN_MIN_LENGTH = 20;
export function doorBase(env?: NodeJS.ProcessEnv): string | null;                       // OPS_API_URL without a trailing slash
export function doorConfig(env?: NodeJS.ProcessEnv): { base: string; token: string } | null;   // null = unauthorized without a call

// src/forms/post.ts  (import 'server-only')
export type PostFormDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };   // tests only
export const ATTEMPT_TIMEOUT_MS = 4000; export const MAX_ATTEMPTS = 2;
export async function postForm(formKey: FormKey, envelope: WireEnvelope, visitor: PostFormVisitor, deps?: PostFormDeps): Promise<PostFormResult>;

// src/forms/uploads.ts  (import 'server-only' — W29; call from a page's async `toFields`)
export const MAX_CV_BYTES = 5 * 1024 * 1024; export const MAX_EVIDENCE_BYTES = 8 * 1024 * 1024; export const MAX_EVIDENCE_FILES = 3;
export type UploadDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };
export function isFile(v: unknown): v is File;
export async function uploadCv(file: File, opts?: { field?: string } & UploadDeps): Promise<{ cvKey: string }>;
//   POST ${OPS_API_URL}/api/careers/upload-cv (public), multipart `file`; refuses (FormActionError, field `cv`, code `file`) an empty file, a non-PDF, a name not ending in .pdf, > 5 MB, or a door 400; door 401/404/429/5xx/network → FormDoorError
export async function uploadFraudEvidence(file: File, visitor: PostFormVisitor, opts?: { field?: string } & UploadDeps): Promise<{ key: string }>;
//   POST ${OPS_API_URL}/api/website/v1/uploads/fraud-evidence, Bearer write token, multipart `file` only; refuses (field `evidence`, code `file`) an empty file, > 8 MB, or a door 400; a null key (test token dry run) → FormDoorError unavailable/server

// src/forms/action.ts  (import 'server-only' — NOT a 'use server' file; see the page-side snippet)
export type { FormActionState, FormErrorResult, FormFallbackKind } from './types'; export { IDLE_FORM_STATE, FormActionError, FormDoorError } from './types';
export type FormSpec<S extends z.ZodTypeAny> = { key: FormKey; schema: S; toFields: (parsed: z.infer<S>, data: FormData) => WireFields | Promise<WireFields>; consent?: 'checkbox' | 'notice' };
export function createFormAction<S extends z.ZodTypeAny>(spec: FormSpec<S>): (prev: FormActionState, data: FormData) => Promise<FormActionState>;

// src/forms/client/FormErrorsContext.tsx  ('use client')
export type FormErrorsValue = { errors: Record<string, string>; values: Record<string, string> };
export const FormErrorsContext: React.Context<FormErrorsValue>;
export function useFieldError(name: string): string | undefined;   // translated sys.form.errors.<code>
export function useFieldValue(name: string): string | undefined;   // echoed value after a failed submit

// src/forms/client/Field.tsx  ('use client') — the one field component pages use
export type FieldOption = { value: string; label: string };
export type FieldProps = { name: string; label?: string; hint?: string; placeholder?: string; required?: boolean; as?: 'input' | 'textarea' | 'select'; type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'file'; options?: FieldOption[]; autoComplete?: string; inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'url'; accept?: string; multiple?: boolean; rows?: number; min?: number; max?: number; className?: string; id?: string };
export const INPUT_CLASS: string;
export function Field(props: FieldProps): React.JSX.Element;
//   label = `label` ?? sys.form.labels.<name> — REQUIRED one way or the other (W30: throws outside production);
//   placeholder = `placeholder` ?? sys.form.placeholders.<name> when present; hint = `hint` ?? sys.form.hints.<name> when present ?? sys.form.hints.optional for a non-required field (pass hint="" to suppress)

// src/forms/client/Turnstile.tsx  ('use client')
export const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
export function Turnstile({ siteKey, locale }: { siteKey: string; locale: Locale }): React.JSX.Element;
//   script appended on the first focusin/pointerdown inside the enclosing <form> (W13 amended); hidden `cf-turnstile-response` input filled through the widget callback

// src/forms/client/FallbackPanel.tsx  ('use client')
export type FallbackPanelProps = { result: FormErrorResult; values: Record<string, string>; formKey: FormKey; locale: Locale; whatsappNumber: string; whatsappIntro?: string; contact?: { phone: string; phoneDisplay?: string; email: string } };
export function FallbackPanel(props: FallbackPanelProps): React.JSX.Element;
export function whatsappFallbackText(intro: string, values: Record<string, string>, label: (key: string) => string): string;

// src/forms/client/FormShell.tsx  ('use client')
export type FormShellProps = { action: (prev: FormActionState, data: FormData) => Promise<FormActionState>; formKey: FormKey; locale: Locale; turnstileSiteKey: string | null; whatsappNumber: string; whatsappIntro?: string; contact?: { phone: string; phoneDisplay?: string; email: string }; submitLabel?: string; consent?: 'checkbox' | 'notice'; consentLinkHref?: '/privacy' | '/kvkk'; title?: string; children: ReactNode; className?: string; testId?: string; initialState?: FormActionState };
export function FormShell(props: FormShellProps): React.JSX.Element;

// src/app/api/form-beacon/state.ts
export function recordFormBeacon(): void; export function formBeaconCount(): number; export function resetFormBeacons(): void;
// src/app/api/form-beacon/route.ts — POST {formKey: FormKey, kind: string, page: string} → 204 no-store (400 on a malformed body); plain `Response`, no next/server import

// src/app/api/site-health/ops.ts
export type OpsPing = { state: 'ok' | 'off' | 'unauthorized' | 'unreachable' | 'unconfigured'; latencyMs: number | null; captcha: 'configured' | 'missing' | null; trippedForms: string[] };
export async function pingOps(env?: NodeJS.ProcessEnv, f?: typeof fetch): Promise<OpsPing>;
export function opsPingCheck(p: OpsPing): CheckResult;   // ok→'ok'; unauthorized|unreachable→'fail'; off|unconfigured→'skip'
// GET /api/site-health body gains `ops: OpsPing` and `formBeacons: number`

// src/messages/{tr,en}.json — sys.form.* (identical key sets, asserted by src/messages/messages.test.ts):
// labels.{name,email,phone,company,city,country,sector,headcount,startWhen,roleNeeded,message,subject,iAm,preferredTime,cv,consent,
//         reporterName,reporterEmail,reporterPhone,suspectName,suspectContact,description,evidence,office,preferredDate,trade,
//         candidatesPerYear,trades,licence,durationMonths,track,topic,portfolioUrl,expectedSalary,expectedSalaryCurrency,
//         currentSalary,currentSalaryCurrency,coverLetter,linkedinUrl,language,openingSlug,estimateSummary}   (W30: every catalog field name, v1 + Task 8's v1.1)
// placeholders.{name,email,phone,company,city,headcount,roleNeeded,message,subject,select,description,trade,trades,licence,
//               candidatesPerYear,durationMonths,portfolioUrl,linkedinUrl,expectedSalary,coverLetter,language,suspectName,
//               suspectContact,reporterName,reporterEmail,reporterPhone,preferredDate,preferredTime}
// hints.{phone,cv,evidence,optional,description,portfolioUrl,linkedinUrl,expectedSalary}
// errors.{required,email,phone,min,max,url,file,consent,captcha,invalid}
// consent.{label,notice,link}   (label/notice are rich: <link>…</link>)
// submit.{default,sending}  honeypot
// fallback.{captcha,off,tripped,unauthorized,unavailable,failed,invalid}.{title,body}
// fallback.{whatsapp,call,email,whatsappIntro,retry}
```

**Produces — deviations:** (1) `src/forms/action.ts` is `import 'server-only'`, **not** a `'use server'` file — a `'use server'` module may export only async functions, so `createFormAction` (a sync factory) cannot live in one; each page wraps the returned function in its own `'use server'` module (snippet in Produces). (2) `FormShell`/`FallbackPanel` take `whatsappIntro?: string` instead of the skeleton's `whatsappText: (values) => string` — a function prop cannot cross the server→client boundary; the panel composes the text with `whatsappFallbackText(intro, values, label)`. (3) `FormShell` gains optional `contact`, `consent`, `initialState`, `submitLabel` (now optional, defaults to `sys.form.submit.default`) and `consentLinkHref` also accepts `'/kvkk'`; `FallbackPanel` gains optional `contact`. (4) Additions: `src/forms/errors.ts`, `src/forms/types.ts` (W44 — `PostFormOk`/`PostFormResult`/`PostFormVisitor`, the client-safe state types/constants and the two error classes, all re-exported by `action.ts`/`post.ts`), `src/forms/env.ts` (`doorConfig`, shared by `post.ts`, `uploads.ts` and the site-health ping), `src/forms/uploads.ts` (W29: `uploadCv`, `uploadFraudEvidence`, `isFile`, the byte caps), `src/forms/client/Field.tsx` (the field component pages use; `multiple` prop; W30 label rule; hints resolved by name), `useFieldValue`, `postForm`'s optional 4th `deps` argument and the exported `ATTEMPT_TIMEOUT_MS`/`MAX_ATTEMPTS`, `FormSpec.toFields` may be async and receives the raw `FormData`, `FormSpec.consent`, `FormActionError` (with an optional `field` that turns a throw into a field error) and `FormDoorError`. (5) `formBeaconCount()` is exported from `src/app/api/form-beacon/state.ts`, not `route.ts` (Next's route type check refuses non-handler exports); the beacon body schema is `strict` and the route returns a plain `Response`. (6) `OpsPing.state` adds `'unconfigured'` (no URL/token in this environment) beside the skeleton's four, and `OpsPing` carries the door's `captcha` and `trippedForms` facts; `off` and `unconfigured` map to the `skip` check result, `unauthorized`/`unreachable` (which now includes a non-JSON 200) to `fail`. (7) The `sys.form.*` set adds `errors.invalid`, `consent.notice`, `placeholders.select`, `fallback.whatsappIntro`, `fallback.retry`, and — per W30 — a label for every catalog field name (42 labels), 28 placeholders and 8 hints; the explicit key lists are in Produces (the skeleton left `placeholders.*`/`hints.*` as `*`). (8) `Turnstile` loads Cloudflare's script on the visitor's first interaction with the enclosing form (`focusin`/`pointerdown`), not through `next/script` `lazyOnload` — W13 amended keeps third-party script out of the initial audit; the token is written to the hidden input through a ref (no React state, per the React Compiler lint rules `eslint-config-next` 16 enforces). (9) Echoed values include the consent tick (`consent: 'on'`) so the checkbox survives a field error on another input.


## Task 3

Produces (frozen for Task 4/5/6/7 and every WP2b page — copy exactly)
```ts
// Route groups (W19) — src/app/[locale]/
//   (site)/layout.tsx     → <SiteChrome variant="default">; holds page.tsx, hire-workers/, [...rest]/, dev/gallery/, not-found.tsx, error.tsx
//                            and, in WP2b, every public page + careers/[slug] + blog/[slug]
//   (minimal)/layout.tsx  → <SiteChrome variant="minimal">; holds thank-you/ and, in WP2b, privacy/ terms/ kvkk/ cookie-policy/ newsletter/*
//                            (its own error.tsx / not-found.tsx re-render the (site) views inside the minimal chrome)
//   (bare)/layout.tsx     → no chrome, renders only <main id="main">{children}</main>; holds portal-login/ (T13)
//   The locale layout keeps html/body, Archivo, GtmLoader, site-wide JSON-LD, NextIntlClientProvider, ClientIslands, generateStaticParams.
//   A page's own `notFound()`/throw lands in its group's not-found/error boundary, so the chrome survives (R6 kept).
//   The dev gallery is src/app/[locale]/(site)/dev/gallery/page.tsx (W41): contract import from a demo file there is
//   '../../../../../../contract/website-bundle.v1' (six levels).

// src/analytics/track.ts — additive (W12/W26)
export const PARAM_ENUMS = {
  placement: ['slimbar', 'header', 'footer', 'social_rail', 'whatsapp_fab', 'bottom_bar', 'form_fallback', 'page_cta', 'office_card'],
  track: ['sourcing', 'institute'],                       // partner_track_select (W16 enum)
  topic: ['hire', 'partner', 'permit', 'job', 'other'],   // contact_topic (T0f enum)
  result: ['eligible', 'conditional', 'ineligible'],      // eligibility_check_complete (the wizard maps its outcomes onto these three)
  outcome: ['verified', 'not_found', 'register_unavailable'], // verify_lookup (W6: Phase A always 'register_unavailable')
} as const;
export type EnumParam = keyof typeof PARAM_ENUMS;
export const ALLOWED_PARAMS = { …the seven WP1 events unchanged…,
  partner_track_select: ['page', 'locale', 'track'], contact_topic: ['page', 'locale', 'topic'],
  eligibility_check_complete: ['page', 'locale', 'result'], career_apply_start: ['page', 'locale', 'slug'],
  verify_lookup: ['page', 'locale', 'outcome'] } as const;   // `slug` = the opening's public URL segment, never a visitor identifier
// track(): a value under an enum-keyed param that is not in its set is DROPPED before the push (free text can never ride).
// Pages never add events or params; a new event is a ruling + an edit here + docs/ANALYTICS.md in the same change.

// src/analytics/useContactClick.ts (no directive; imported by client components only)
export const CONTACT_PLACEMENTS = PARAM_ENUMS.placement;                 // same tuple, re-exported for the chrome/blocks
export type ContactPlacement = (typeof CONTACT_PLACEMENTS)[number];
export type ContactKind = 'call' | 'whatsapp' | 'email';
export function contactKindOf(href: string): ContactKind | null;        // tel: → call, mailto: → email, https://wa.me/ | https://api.whatsapp.com/ → whatsapp, else null
export function useContactClick(placement: ContactPlacement): (kind: ContactKind) => void; // track('<kind>_click', { page (next/navigation usePathname ?? '/', R35), locale (useLocale), placement })
//   W32 — canonical shape. A Button-style caller does: const fire = useContactClick(p); const kind = contactKindOf(href); onClick={kind ? () => fire(kind) : undefined}

// src/analytics/ContactLink.tsx ('use client') — the one anchor every tel:/mailto:/wa.me link in the chrome (and, in WP2b, pages/OfficeCard/FallbackPanel) renders through
export function ContactLink(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & { href: string; placement: ContactPlacement; children: ReactNode }): JSX.Element;
//   same-tab by default (R22); callers pass target/rel for wa.me; a non-contact href renders a plain anchor with no handler

// src/design/chrome/nav.ts (server-safe)
export { BLOG_NAV_THRESHOLD, blogNavVisible } from '@/content/collections';   // W35: re-exports, not copies
export function navGroup(bundle: Bundle, group: NavItem['group'], t: (id: string) => string): ChromeNavItem[];
//   rows of one group sorted by `order`, labels through t(), `external` passed through; '/blog' and '/blog/[slug]' dropped while !blogNavVisible(bundle)

// src/design/chrome/ctas.ts (server-safe, no directive)
export type CtaVariant = 'primary' | 'danger';
export type CtaLink = { labelId: string; tailId?: string; href: Href; variant?: CtaVariant };
export type PageCtas = { primary: CtaLink; secondary?: CtaLink | null }; // undefined → DEFAULT secondary, null → none
export const DEFAULT_CTAS: PageCtas;                                     // home.014+home.015 → {pathname:'/hire-workers', hash:'#request-form'}; home.008 → '/partner-with-us'
export const CTA_BY_PATHNAME: Partial<Record<keyof typeof pathnames, PageCtas>>;
//   '/'                        home.014+home.015 → {'/',                      '#proposal'}      secondary default
//   '/hiring-cost-calculator'  calc.324           → {'/hiring-cost-calculator','#calculator'}    secondary home.002 → '/hire-workers'
//   '/partner-with-us'         partner.017+018    → {'/partner-with-us',       '#tracks'}        secondary home.002 → '/hire-workers'
//   '/work-permit'             wp.016+017         → {'/work-permit',           '#permit-cta'}    secondary default
//   '/contact'                 contact.015+016    → {'/contact',               '#message'}       secondary home.002 → '/hire-workers'
//   '/verify'                  verify.015+016     → {'/verify',                '#report'}, variant 'danger'; secondary home.002 → '/hire-workers'
//   '/available-workers'       availworkers.016 + home.003 → {'/available-workers', '#pool'}     secondary default
//   (every other key, incl. '/hire-workers', '/careers/[slug]', '/blog/[slug]' → DEFAULT_CTAS)
//   CONTRACT FOR WP2b PAGE TASKS: the page owning a key must render the element id its entry names
//   (`proposal`, `request-form`, `calculator`, `tracks`, `permit-cta`, `message`, `report`, `pool`), or edit its entry here in the same task.
export type ResolvedCta = { label: string; tail?: string; href: Href; variant: CtaVariant };
export type ResolvedPageCtas = { primary: ResolvedCta; secondary?: ResolvedCta };
export type CtaTable = { defaults: ResolvedPageCtas; byPathname: Partial<Record<keyof typeof pathnames, ResolvedPageCtas>> };
export function resolveCtas(t: (id: string) => string): CtaTable;      // Header (server) calls it; labels resolved once
export function ctasFor(table: CtaTable, pathname: string | null): ResolvedPageCtas; // pure; null/unknown → defaults

// src/design/chrome/HeaderCtas.tsx ('use client')
export function HeaderCtas({ table }: { table: CtaTable }): JSX.Element;   // usePathname() from @/i18n/navigation (internal key, SSR-consistent)

// src/design/chrome/Header.tsx — signature change
export function Header({ locale, bundle }: { locale: Locale; bundle: Bundle }): JSX.Element; // `primaryCta` prop and `ChromeCta` type REMOVED (W17)
//   desktop row = navGroup(bundle,'desktopNav') minus the four promoted routes (/blog, /careers, /verify, /partner-with-us); hamburger = navGroup(bundle,'hamburger')
// SiteChrome({ locale, bundle, variant?, children }) unchanged. SlimBar/Footer render slimBarRight / footerEmployers+footerCompany
//   through navGroup() — the portal login is the groups' `external` row (W36); no chrome file hard-codes a route list except the footer legal pair.

// src/lib/seo/routes.ts
export type StaticPathname = Exclude<keyof typeof pathnames, `${string}[${string}`>;   // exported (was local to sitemap.ts) — Task 4's type guards use it (W37)
export const NOINDEX_PATHNAMES = ['/thank-you', '/portal-login', '/newsletter/confirm', '/newsletter/unsubscribe', '/blog', '/blog/[slug]'] as const;
//   typed `satisfies readonly (keyof typeof pathnames)[]` — NOT `readonly Href[]` any more: '/blog/[slug]' is not a bare Href, so never pass this set to getPathname/absoluteUrl directly (W37)
export function isNoindexPathname(href: keyof typeof pathnames): boolean;
export function noindexExternalPaths(locale: Locale): string[];         // localized, deduped; a dynamic key is covered by its parent ('/blog/[slug]' → '/blog')
//   robots.ts consumes this in this task; Task 4 adds `UNBUILT_PATHNAMES`, `robotsDisallowPaths(locale)` (= this minus UNBUILT), `OG_PAGE_KEYS`, `pageOgImageUrl` below it and re-points robots.ts at robotsDisallowPaths — additive, no rename.
//   sitemap.ts's `EXCLUDED = new Set<string>(NOINDEX_PATHNAMES)` keeps working unchanged.

// src/design/primitives/Button.tsx — additive
export function buttonClassName(variant: ButtonVariant, size?: 'md' | 'lg', className?: string): string; // the exact class string <Button> renders; for callers that must render next-intl <Link> with an object href
// src/design/primitives/index.ts line 2: export { Button, buttonClassName, type ButtonProps, type ButtonVariant } from './Button';  (W39: Task 5 edits the barrel additively)

// src/design/tokens.ts — additive
tokens.type.nav = { mobile: 13.5, tablet: 12, desktop: 11 };            // header links: authored / from 901 px (W11) / from 1101 px
tokens.layout.headerRowFrom = 901; tokens.layout.socialRailFrom = 1101;  // = breakpoint.lg / breakpoint.xl
// globals.css: `--fs-nav` (13.5px, 12px ≥901, 11px ≥1101) exposed as the `text-nav` utility via `@theme inline { --text-nav: var(--fs-nav) }`

// src/messages/{tr,en}.json — additive: sys.nav.legal ("Yasal" / "Legal") — aria-label of the footer's Privacy/Terms nav. W39: Task 5's sys.nav block is { main, close, legal, breadcrumbs }.

// e2e/chrome.spec.ts — four cases (chrome variants, 404 inside chrome, 901/900 threshold + no overflow at 901/1000/1100, the CTA follows the page); width sweep gains 901.
// src/lib/seo/routes.test.ts line 2 after this task: import { absoluteUrl, localeAlternates, NOINDEX_PATHNAMES, noindexExternalPaths } from './routes';
//   Task 4 EXTENDS that line to the union (+ OG_PAGE_KEYS, pageOgImageUrl, UNBUILT_PATHNAMES, robotsDisallowPaths) — never replaces it (W37).
```

**Produces — deviations:** (1) `(bare)/layout.tsx` renders `<main id="main">{children}</main>` rather than a bare fragment, so R31's one-`<main>` guarantee stays with the layouts and the portal page (T13) does not render its own; (2) `PageCtas.secondary` is `CtaLink | null | undefined` (undefined inherits the default secondary, null removes it) and `CtaLink` gains optional `tailId`/`variant` — the skeleton's `{ labelId; href }` shape is a subset; (3) additive extras not in the skeleton: `resolveCtas`/`ctasFor`/`CtaTable`, `HeaderCtas`, `nav.ts` (`navGroup` + the W35 re-exports), `ContactLink`, `contactKindOf`, `isNoindexPathname`/`noindexExternalPaths`/`StaticPathname` (robots consumes `noindexExternalPaths` instead of mapping `NOINDEX_PATHNAMES` directly, because `/blog/[slug]` is not a `getPathname` href), `buttonClassName`, `tokens.type.nav`/`tokens.layout.headerRowFrom`/`socialRailFrom`, `sys.nav.legal`, `PARAM_ENUMS`/`EnumParam` + the value guard in `track()` (W26 asked for the events; the guard is what makes "enum-only" true in code rather than by discipline), `ContactPlacements.test.tsx`; (4) `Header` loses its `primaryCta` prop and the `ChromeCta` type (the skeleton says "resolves via usePathname", which makes the prop dead); (5) the `header` placement is enumerated but unused — every header CTA is an internal `Href`; (6) W35: `BLOG_NAV_THRESHOLD`/`blogNavVisible` are re-exports of Task 1's, not definitions — `nav.test.ts` therefore feeds full T0b blog rows; (7) W36: `SlimBar`/`Footer` render no hard-coded portal anchor — the skeleton's "Footer/SlimBar/MobileNav read `bundle.nav` groups" holds for SlimBar/Footer/Header; `MobileNav` itself still receives `items` from `Header` (the `hamburger` group) rather than reading the bundle, because no bundle crosses into the client island (D6); (8) `NOINDEX_PATHNAMES` is typed `satisfies readonly (keyof typeof pathnames)[]`, no longer `readonly Href[]` — consumers go through `noindexExternalPaths` (W37); (9) the `e2e/seo.spec.ts` edit is the sitemap case only — no `Disallow: /blog` assertion (W37); (10) `CONTACT_PLACEMENTS` is `PARAM_ENUMS.placement` (one tuple, two names) so the chrome's type and `track()`'s guard can never drift.


## Task 4

Produces (frozen for WP2b — copy exactly):

```ts
// src/lib/seo/routes.ts (additions; SITE_URL/absoluteUrl/localeAlternates/NOINDEX_PATHNAMES/
//   isNoindexPathname/noindexExternalPaths unchanged from Task 3)
export type StaticPathname = Exclude<keyof typeof pathnames, `${string}[${string}`>; // now exported
export const UNBUILT_PATHNAMES: ReadonlySet<keyof typeof pathnames>;
//   W20. Initial set (19): '/hiring-cost-calculator', '/partner-with-us', '/work-permit', '/about',
//   '/verify', '/careers', '/careers/[slug]', '/contact', '/available-workers', '/success-stories',
//   '/blog', '/blog/[slug]', '/portal-login', '/privacy', '/terms', '/kvkk', '/cookie-policy',
//   '/newsletter/confirm', '/newsletter/unsubscribe'.
//   Each page task DELETES its own key(s) in the commit that adds the page — src/lib/seo/unbuilt.test.ts
//   walks src/app/[locale]/**/page.tsx (route groups stripped) and fails when the set and the
//   filesystem disagree in either direction. T15 asserts the set is empty (Task 7's launch check).
export function robotsDisallowPaths(
  locale: Locale,
  unbuilt?: ReadonlySet<keyof typeof pathnames>, // default UNBUILT_PATHNAMES; tests only
): string[];
//   W37: noindexExternalPaths(locale) minus every NOINDEX key still in UNBUILT, deduped, subtracted
//   per key BEFORE the parent-prefix fold. app/robots.ts disallows ['/api/', ...tr, ...en] from it.
//   Today: ['/tesekkurler'] / ['/en/thank-you']; '/blog', '/portal-girisi', '/abone-onay',
//   '/abonelikten-cik' (and /en/…) appear by themselves when their page task deletes the key.
export const OG_PAGE_KEYS: ReadonlySet<string>;
//   'site' + every PAGE_KEYS entry (23): 'site','home','hire','calc','wp','partner','about','contact',
//   'workers','stories','verify','careers','careersDetail','blog','blogArticle','portal','privacy',
//   'terms','kvkk','cookiePolicy','thankYou','newsletterConfirm','newsletterUnsubscribe'.
//   routes.test.ts asserts OG_PAGE_KEYS === {'site', ...PAGE_KEYS}: a new page key is added to
//   PAGE_KEYS (Task 1) and here in the same commit. The `pageKey` a page passes to buildMetadata is
//   its PAGE_KEYS entry ('blogArticle' for /blog/[slug], 'careersDetail' for /careers/[slug]);
//   an unknown key renders the 'site' image.
export function pageOgImageUrl(locale: Locale, pageKey: string): string;
//   `${SITE_URL}/og/${locale}/${OG_PAGE_KEYS.has(pageKey) ? pageKey : 'site'}.png` — absolute.

// src/lib/seo/sitemap-sources.ts (W31)
export type SitemapSource = (locale: Locale) => Promise<MetadataRoute.Sitemap>;
export const DETAIL_SITEMAP_SOURCES: readonly SitemapSource[]   // Object.freeze([]) in the foundation (W70): the careers page task EDITS the literal to add its imported source — no runtime push;   // [] in the foundation
//   The careers page task pushes its openings source here (one function, one line, read from the
//   bundle under its ISR tag); blog joins when it leaves NOINDEX (W4). Nothing else may add URLs.
export function detailSitemapEntries(locale: Locale, sources?: readonly SitemapSource[]): Promise<MetadataRoute.Sitemap>;
// src/app/sitemap.ts is now `async` and returns [...static (pathnames − NOINDEX − UNBUILT) × locales,
//   ...detailSitemapEntries(tr), ...detailSitemapEntries(en)].

// src/lib/seo/og.ts (pure, R23) — the OG copy readers the route wraps; page tasks do not call these
export type SysCopy = { t: (key: string) => string; has: (key: string) => boolean };
export const OG_WORDMARK = 'JobsAdmire'; export const OG_SUBLINE_MAX = 140;
export function ogTitle(bundle: Bundle, pageKey: string, sys: SysCopy): string;
//   record.titleId non-empty → t(titleId); else sys.seo.<pageKey>.title when present (W23); else the wordmark
export function ogSubline(bundle: Bundle, pageKey: string, sys: SysCopy): string;
//   record.descriptionId non-empty → t(descriptionId); else sys.seo.ogTagline (W38 — never home.188); word-clamped to 140
export function clampWords(text: string, max: number): string;

// src/messages/{tr,en}.json — new: sys.seo.ogTagline (the OG subline for a page whose record has no
//   description). Page tasks add their sys.seo.<pageKey>.{title,description} under the same `seo` object.

// src/app/og/[locale]/[pageKey]/route.tsx — GET /og/{tr|en}/{pageKey}.png → 1200×630 image/png,
//   Node runtime, `export const revalidate = 86400`, `Cache-Control: public, max-age=86400`,
//   Archivo Bold bytes from src/design/fonts/Archivo-Bold.ttf (vendored, OFL; fonts.test.ts pins the hash).
//   Title = ogTitle(), subline = ogSubline() (above). 404 for an unknown locale, a key outside
//   OG_PAGE_KEYS, or a missing `.png` suffix. The `.png` suffix is what keeps the URL out of
//   proxy.ts's matcher (`.*\..*`) — no matcher change. next.config.ts traces the font folder for it.

// src/lib/seo/metadata.ts
export type AlternateTarget = string | Exclude<Href, string>;
//   string = absolute URL or an already-localized external path ('/en/blog/x'); object = typed
//   dynamic Href ({ pathname: '/blog/[slug]', params: { slug } }) resolved for that locale.
//   A bare pathnames key as a string is NOT accepted (ambiguous) — static pages omit `alternates`.
export type MetadataOpenGraphOverride = {
  type?: 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  images?: string[]; // absolute; wins over the page record's ogImage and the generated route
};
export function buildMetadata(args: {
  locale: Locale;
  href: Href;
  bundle: Bundle;
  pageKey: string;              // a PAGE_KEYS entry
  fallbackTitle: string;        // the page's sys.seo.<pageKey>.title — used when the record's titleId is ''
  fallbackDescription: string;  // the page's sys.seo.<pageKey>.description — likewise
  alternates?: Partial<Record<Locale, AlternateTarget>>;
  openGraph?: MetadataOpenGraphOverride;
}): Metadata;
//   alternates given → languages = the given locales (+ the page's own locale from `href` when
//   omitted, self-reference is never optional) + x-default = tr when present else the page's own;
//   alternates omitted → localeAlternates(href) as in WP1.
//   openGraph.images: override → record.ogImage → pageOgImageUrl(locale, pageKey); twitter.images = same.
//   openGraph.type 'article' adds publishedTime/modifiedTime/authors; otherwise 'website'.

// src/lib/seo/jsonld.ts (additions; organizationJsonLd/websiteJsonLd/breadcrumbJsonLd/faqJsonLd unchanged)
export type ArticleJsonLdInput = {
  headline: string; description: string; url: string; image: string | string[];
  datePublished: string | Date; dateModified?: string | Date;
  authorName: string; authorType?: 'Person' | 'Organization';
  publisherSettings: Settings; locale: Locale;
};
export function articleJsonLd(input: ArticleJsonLdInput): BlogPosting node
//   { '@context','@type':'BlogPosting', headline, description, image, url,
//     mainEntityOfPage:{'@type':'WebPage','@id':url}, datePublished (ISO 8601), dateModified? (ISO),
//     author:{'@type':authorType??'Person', name}, publisher:{'@type':'Organization', name:'JobsAdmire',
//     url: settings.siteUrl, logo:{'@type':'ImageObject', url:`${siteUrl}/brand/ja-mark.png`}}, inLanguage: locale }
export type JobPostingJsonLdInput = {
  title: string; description: string; url: string;
  datePosted: string | Date; validThrough?: string | Date;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN' | 'OTHER';
  hiringOrganization: Settings;
  jobLocation: { city: string; country: string /* ISO-2 upper-case, W40 */ };
  baseSalary?: { currency: string; value: number | { min: number; max: number }; unitText: 'MONTH' | 'YEAR' | 'HOUR' };
  identifier?: string;
};
export function jobPostingJsonLd(input: JobPostingJsonLdInput): JobPosting node
//   { '@context','@type':'JobPosting', title, description, url, datePosted (ISO), validThrough? (ISO),
//     employmentType, hiringOrganization:{'@type':'Organization', name:'JobsAdmire', sameAs: siteUrl, logo},
//     jobLocation:{'@type':'Place', address:{'@type':'PostalAddress', addressLocality: city, addressCountry: country}},
//     baseSalary?:{'@type':'MonetaryAmount', currency, value:{'@type':'QuantitativeValue', value | minValue+maxValue, unitText}},
//     identifier?:{'@type':'PropertyValue', name:'JobsAdmire', value} }
//   Both builders: no key is ever `undefined` (compacted); an invalid date THROWS RangeError outside
//   production and is OMITTED in production (makeT's own dev-throw/prod-degrade rule).

// src/design/chrome/use-alternate-path.ts ('use client')
export function readAlternateHref(locale: Locale, doc?: Document): string | null; // the tag's href or null
export function alternateHrefToPath(href: string | null): string | null;        // pathname+search only; the host is dropped
export function useAlternatePath(locale: Locale): string | null;               // null on the server and until hydrated
// LanguageSwitcher / LanguageHint: props unchanged. When useAlternatePath(l) returns a path they render a
// next/link anchor to that path (W17); otherwise the WP1 next-intl <Link href={alternatePath(pathname)} locale={l}> (R58).

// next.config.ts — outputFileTracingIncludes: { '/og/[locale]/[pageKey]': ['./src/design/fonts/*.ttf'] }; nothing else changes.
```

**Produces — deviations:**

1. `pageOgImageUrl` returns `…/og/{locale}/{pageKey}.png` — the route path is the skeleton's `src/app/og/[locale]/[pageKey]/route.tsx` unchanged, but the URL carries a `.png` suffix (stripped inside the handler) so it stays outside `proxy.ts`'s matcher without touching the matcher. `OG_PAGE_KEYS` is an added export and is `'site'` + Task 1's 22 `PAGE_KEYS` (the earlier draft's 20-key list with a single `newsletter` key is gone — the page-record keys are `careersDetail`, `blogArticle`, `newsletterConfirm`, `newsletterUnsubscribe`); `routes.test.ts` pins the equality.
2. `robotsDisallowPaths(locale, unbuilt?)` (W37) carries an optional injectable `unbuilt` set so the unit test can prove the blog/portal rules with "UNBUILT empty" without `vi.mock`; the subtraction runs per key before the parent-prefix fold (so a built `/blog` index stays disallowed while `/blog/[slug]` is unbuilt). `StaticPathname` (Task 3's private type) is now exported for the tests' type guard.
3. `app/sitemap.ts` is `async` (W31): it awaits `detailSitemapEntries(locale)` per locale after the static entries; `DETAIL_SITEMAP_SOURCES` is a frozen literal the careers page task edits (W70). No `generateStaticParams` hook — the detail pages own theirs.
4. `src/lib/seo/og.ts` is an added pure module (`ogTitle`, `ogSubline`, `clampWords`, `SysCopy`, `OG_WORDMARK`, `OG_SUBLINE_MAX`) because a Next route file may export only handlers and segment config, and because W38's copy rules deserve fixture-backed unit tests without mocking the renderer; the route wraps next-intl's translator into a `{ t, has }` object. `sys.seo.ogTagline` is the new key (both locales). The route also sets `Cache-Control: public, max-age=86400` explicitly (ImageResponse's own default is a year, immutable).
5. `buildMetadata.alternates` value type is `AlternateTarget = string | Exclude<Href, string>` (the skeleton said `string`): a string is an absolute URL or an already-localized external path; the object form is the typed dynamic `Href` — a bare `pathnames` key string is deliberately not accepted. `openGraph` override additionally accepts `images?: string[]`; `twitter.images` is set alongside. Task 1's `''` → fallback lines are carried verbatim (W38).
6. `articleJsonLd` input adds optional `authorType?: 'Person' | 'Organization'`; `jobPostingJsonLd` adds optional `identifier?: string`; `employmentType` is the Google enum (`FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY | INTERN | OTHER`); `baseSalary.value` is `number | { min, max }` with `unitText`; invalid dates throw outside production and are omitted in production.
7. `LanguageSwitcher`/`LanguageHint` gain no props (W17: tag-read + `alternatePath` fallback); the tag-derived link renders through `next/link` (already-localized path), the fallback through next-intl's `Link` (which always prefixes when `locale` is passed — `/tr` on an EN page, folded by the middleware; WP1 behaviour, now asserted) — a new file `src/design/chrome/use-alternate-path.ts` exports `readAlternateHref`, `alternateHrefToPath`, `useAlternatePath`. `alternateHrefToPath` drops the host (the skeleton's "same host only" wording meant exactly that).
8. `next.config.ts` gains `outputFileTracingIncludes` for the OG route's font folder (belt-and-braces to the `join(process.cwd(), …)` tracer pattern); nothing else in the config changes.
9. The two OG e2e tests are appended to `e2e/seo.spec.ts` in Cycles 3 and 4 (each with a local red→green against `next start`), not in the docs cycle; Task 7's later rewrite of the file carries them (W37/W50).


## Task 5

Produces (frozen for the WP2b pages — copy exactly)

```ts
// src/lib/format/date.ts — pure; imports both message files, so server components and tests only (never a client island)
export function formatDate(iso: string, locale: Locale): string;        // TR '12 Ocak 2026', EN '12 January 2026' (en-GB, day first); UTC calendar dates; RangeError on a non-date
export function formatMonth(iso: string, locale: Locale): string;       // TR 'Ocak 2026', EN 'January 2026' (D17 dated labels)
export function formatReadMinutes(n: number, locale: Locale): string;   // sys.blocks.readMinutes ICU: EN '5 min read', TR '5 dk okuma'; never below 1

// src/messages/{tr,en}.json — new sys keys (both files, W54 namespaces)
sys.nav.breadcrumbs        // 'Sayfa yolu' / 'Breadcrumb' — the <nav aria-label> of Breadcrumbs (existing chrome namespace, beside nav.main/close/legal)
sys.blocks.readMinutes     // ICU plural on {n} — the ONLY sys.blocks.* key today; every future block-composed string goes here

// src/design/primitives (extended; the barrel keeps Task 3's buttonClassName — W39)
export type SectionTone = 'light' | 'dark' | 'pale' | 'band';
export function Section(p: { tone: SectionTone; id?: string; className?: string; children?: ReactNode }): JSX.Element;
//   light = bg-white text-ink py-16 · dark = bg-navy text-white py-16 · pale = bg-pale-1 text-ink py-16 · band = bg-white text-ink py-10 (hosts one full-width card)
export function Stat(p: { value?: number; text?: string; prefix?: string; suffix?: string; label: string; locale: Locale; tone?: 'light' | 'dark' }): JSX.Element | null;
//   `text` wins over `value` (rendered verbatim, no count-up); neither → null (W1 hidden metric); dark tone = white figure, text-white/55 label
export type TimelineStep = { when?: string; title: string; body: string };
export function Timeline(p: { steps: TimelineStep[]; variant?: 'vertical' | 'horizontal' }): JSX.Element; // <ol data-variant=…>; horizontal = md:grid-flow-col row
export type TabItem = { id: string; label: string; panel: ReactNode };
export function Tabs(p: { tabs: TabItem[]; defaultId: string; onChange?: (id: string) => void }): JSX.Element; // onChange after every selection change (click, arrows, Home/End)
export type RadioChipOption = { value: string; label: string };
export function RadioChips(p: { name: string; options: RadioChipOption[]; value: string | null; onChange: (value: string) => void; legend: string; legendHidden?: boolean; className?: string }): JSX.Element;
//   'use client'; <fieldset role="radiogroup" aria-labelledby=legend> of native radios (arrow keys, form submission under `name`), chip-styled labels
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse'; // inverse = translucent white outline for navy/gradient bands

// src/design/chrome/StickyCtaBar.tsx ('use client', page-mounted)
export type StickyCta = { label: string; href: string; variant?: ButtonVariant; external?: boolean };
export const STICKY_CTA_HEIGHT_VAR = '--sticky-cta-h';
export function isBarVisible(scrollY: number, showAfterPx: number, targetTop: number | null, viewportHeight: number): boolean;
//   scrollY > showAfterPx, and (no target, or target's top ≥ 90% of the viewport height)
export function StickyCtaBar(p: { message: string; ctas: StickyCta[]; showAfterPx?: number /* 700 */; hideNearId?: string; live?: boolean }): JSX.Element | null;
//   W18: publishes its rendered height as `--sticky-cta-h` on <html> while visible, '0px' otherwise (and on unmount);
//   LanguageHint + WhatsAppFab add var(--sticky-cta-h,0px) to their bottom offset. `live` = the design's green dot (data-live-dot).
//   CONTRACT FOR PAGE TASKS: `hideNearId` names the element id the bar advertises (the page's form/section) — the bar hides while it is near.

// src/design/blocks (barrel: src/design/blocks/index.ts) — server components; no 'use client' anywhere in the folder.
// Every block that takes `bundle` also takes `locale` and resolves ids through makeTf(bundle, locale) (D17) — never makeT.
export type PageContactPlacement = 'page_cta' | 'office_card';
export type ContactCtaProps = { placement: PageContactPlacement; href: string; variant?: ButtonVariant /* 'primary' */; size?: 'md' | 'lg'; external?: boolean; className?: string; 'aria-label'?: string; children: ReactNode };
export function ContactCta(p: ContactCtaProps): JSX.Element;
//   contactKindOf(href) non-null → Task 3's <ContactLink placement className={buttonClassName(variant, size, className)}> (+ target/rel when external): the click fires
//   whatsapp_click/call_click/email_click with the placement; any other href → a plain <Button variant size href external>. Blocks and pages use it for EVERY CTA that may be a contact door.

export type Cta = { label: string; href: string; external?: boolean; variant?: ButtonVariant };
export type FaqItem = { id: string; q: string; a: string };                    // q/a already resolved by the page (makeTf)
export type FaqAskCard = { titleId: string; bodyId: string; whatsappNumber: string; whatsappText: string; whatsappLabelId: string; phone?: string; callLabelId?: string };
export function FaqBlock(p: { bundle: Bundle; locale: Locale; items: FaqItem[]; id?: string /* 'faq' */; eyebrowId?: string; headingId?: string; bodyId?: string; askCard?: FaqAskCard; singleOpen?: boolean /* true */; openFirst?: boolean; headingLevel?: 2 | 3 | 4 /* 3 */; footer?: ReactNode }): JSX.Element;
//   two-column (side sticky from lg) + Accordion + <JsonLd data={faqJsonLd(items)}/>; the ask card's WhatsApp/call buttons are ContactCta 'page_cta'

export type Crumb = { name: string; href: Href };                              // every crumb incl. the current page carries its href (JSON-LD needs the url); Href = @/lib/seo/routes
export function Breadcrumbs(p: { locale: Locale; items: Crumb[]; tone?: 'light' | 'dark'; className?: string }): JSX.Element;
//   <nav aria-label={sys.nav.breadcrumbs}><ol>…</ol></nav>, last item aria-current="page" (text, not a link), + <JsonLd data={breadcrumbJsonLd(…absoluteUrl…)}/>

export function ClosingCtaBand(p: { bundle: Bundle; locale: Locale; titleId: string; bodyId?: string; primary: Cta; secondary?: Cta; extra?: Cta[]; ticks?: string[]; tone?: 'navy' | 'gradient' | 'green'; id?: string }): JSX.Element;
//   dark rounded card; every CTA renders through ContactCta 'page_cta' (primary default variant 'primary', secondary/extra default 'inverse'); `ticks` render `md:hidden` (W10)

export type ProcessStep = { n: number; titleId: string; bodyId: string; when?: string }; // `when` is a resolved string (the page reads its id)
export function ProcessSteps(p: { bundle: Bundle; locale: Locale; steps: ProcessStep[]; variant?: 'cards' | 'plain' /* 'cards' */; id?: string; headingLevel?: 3 | 4 }): JSX.Element;
//   <ol data-variant> of <li data-last="true" on the last>; numbered aria-hidden dots on a vertical gradient rail, last step green; cards = Hire Workers' boxed rows, plain = Homepage/Contact rows

export function MetricStrip(p: { bundle: Bundle; locale: Locale; metrics: MetricKey[]; tone?: 'light' | 'dark'; className?: string }): JSX.Element | null;
//   reads the `metrics` collection; a key with value=null & text=null, or labelId=null, is skipped (W1); all skipped → null; unitId (when set) joins the suffix (`45 gün`)

export function OfficeCard(p: { bundle: Bundle; locale: Locale; office: Office; children?: ReactNode }): JSX.Element;
//   <article>: h3 t(cityId) · t(labelId) (green for 'sourcing') · t(addressId) <br/> t(addressLine2Id) · t(hoursId) (W34: the package's own hours string, nothing composed)
//   · tel / WhatsApp (home.221, sys.whatsapp.prefill) / mail rows as Task 3's ContactLink placement 'office_card' · directions (home.192, mapUrl); `children` = the page's live-status pill / note

export type ImageSlotProps = { slot: string; lcp?: boolean; src?: string | null; alt: string; width: number; height: number; sizes?: string; className?: string; priority?: boolean };
export function ImageSlot(p: ImageSlotProps): JSX.Element;
//   W27/W55/D26: `src` → next/image (priority ?? lcp, data-lcp-slot={slot} when lcp); no src → <div role="img" aria-label={alt} data-placeholder={slot} data-lcp-slot={lcp ? slot : undefined}> gradient box with aspect-ratio width/height;
//   alt '' = decorative → the placeholder is aria-hidden with no role

export type EmptyStateCta = { label: string; href: string; external?: boolean };
export function EmptyState(p: { title: string; body?: string; cta?: EmptyStateCta; tone?: 'light' | 'pale' | 'dark' /* 'light' */; icon?: ReactNode; headingLevel?: 2 | 3 /* 3 */; testId?: string; className?: string }): JSX.Element;
//   W6/W27: <div role="status" data-testid={testId}> dashed card, h{n} title, body, ContactCta 'page_cta' (secondary face; 'inverse' on dark); copy = the page's sys.<page>.empty.* (resolved by the page)

export function PostCard(p: { bundle: Bundle; locale: Locale; post: BlogPost; variant?: 'card' | 'row' | 'featured'; categoryLabel?: string; coverSrc?: string | null; headingLevel?: 2 | 3 }): JSX.Element | null;
//   W33: null when post.slug[locale] or post.title[locale] is null; <article>; title = Link to {pathname:'/blog/[slug]', params:{slug: post.slug[locale]}} showing post.title[locale];
//   excerpt = post.excerpt[locale] (card/featured only); category pill = categoryLabel ?? t(post.categoryLabelId); meta = formatDate · formatReadMinutes;
//   alt-language pill (blog.081 on TR, blog.077 on EN) when post.hasBody[other]; cover = <ImageSlot slot={`blog-cover-${post.key}`} src={coverSrc} alt="">

export function NewsletterBand(p: { bundle: Bundle; locale: Locale; active: boolean; id?: string /* 'newsletter' */; children?: ReactNode }): JSX.Element | null;
//   active=false (Phase A, W5) → null; active=true → band chrome (blog.036/037/038) + {children} (the page's FormShell)

export function StoreBadges(p: { bundle: Bundle; locale: Locale; android: string | null; ios?: string | null; tone?: 'dark' | 'light' /* 'dark' */ }): JSX.Element | null;
//   Google Play badge (hire.240) when android; App Store (hire.241) only when ios is a string (W8: null today); both null → null

export type Logo = { src: string; alt: string; width: number; height: number };
export function LogoMarquee(p: { logos: Logo[]; durationSec?: number /* 38 */; className?: string }): JSX.Element | null; // [] → null; else PausableMarquee of next/image logos with sys.marquee labels

// re-exported from the barrel for one-import pages (definitions stay in src/content/collections.ts):
export type { BlogPost, Metric, MetricKey, Office } from '@/content/collections';

// src/test/bundle.ts (test helper)
export function testBundle(overrides?: { strings?: Record<string, string>; collections?: Bundle['collections']; settings?: Partial<Bundle['settings']> }): Bundle; // BundleSchema.parse over the golden fixture (R13)
export const BLOCK_STRINGS: Record<string, string>; // the chrome ids the blocks read by canonical id (home.192/221, hire.240/241, blog.034/036/037/038/077/081)
```

**Produces — deviations:** (1) Every id-taking block (`FaqBlock`, `ClosingCtaBand`, `ProcessSteps`, `MetricStrip`, `OfficeCard`, `PostCard`, `NewsletterBand`, `StoreBadges`) takes `bundle: Bundle` AND `locale: Locale` and resolves ids through Task 1's `makeTf(bundle, locale)`, not `makeT` — the skeleton listed ids without a resolver, and D17's re-authored `{metric}` strings (home.024/107/305, hire.198-class reply times) would otherwise render raw tokens. (2) `ContactCta` is not `ButtonProps & { placement }` with a `MouseEventHandler` (the draft's shape, refused by W32): it wraps Task 3's `ContactLink` in `buttonClassName(variant, size)` for a contact href and falls back to a plain `Button` for any other href, so it has no directive and the blocks folder ships no client component of its own; `isContactHref` is gone — `contactKindOf` (Task 3) is the one classifier. (3) `OfficeCard` renders the row's `labelId`/`addressLine2Id`/`hoursId` (W34) — no `KIND_LABEL_ID`, no `sys.office.hours`, no `formatWeekdays` (dropped from `date.ts`); its three contact rows are `ContactLink` (`office_card`) directly. (4) `PostCard` follows Task 1's `BlogPost` (`title/excerpt/slug` per locale, `categoryLabelId`, `key`; W33), returns `null` for an unwritten locale, and takes `coverSrc?: string | null` rendered through `ImageSlot` `blog-cover-<key>` instead of a `cover?: ReactNode` slot (W27/W55 — the placeholder is named). (5) New per W27: `ImageSlot` and `EmptyState` (`tone` optional with `'light'`, `headingLevel` and `className` added; `cta.external` added). (6) `sys.readMinutes` → `sys.blocks.readMinutes` (W54); `sys.office.*` removed. (7) `FaqBlock` takes `locale` (see 1) and its ask card carries `whatsappText` + `whatsappLabelId` (+ optional `phone`/`callLabelId`) because a WhatsApp link needs a prefill and a label; `ProcessSteps.variant` is `'cards' | 'plain'`; `ProcessStep.when` is a resolved string; `Breadcrumbs` items are `{ name; href: Href }` with the current page included and it takes `locale`; `NewsletterBand` is `{ bundle; locale; active; id?; children? }` (the page mounts its own `<FormShell>`); `StoreBadges` types `ios?: string | null`; `LogoMarquee` logos are `{ src; alt; width; height }` and it reads `sys.marquee.*` itself. (8) `Stat` gains `tone`; `StickyCtaBar` gains `live` and exports `isBarVisible`/`STICKY_CTA_HEIGHT_VAR`/`StickyCta`; `Button` gains `inverse`; `RadioChips` gains `legendHidden?`/`className?`; the blocks barrel re-exports Task 1's `BlogPost`/`Metric`/`MetricKey`/`Office` types rather than defining its own. (9) `src/test/bundle.ts` (`testBundle`, `BLOCK_STRINGS`) is an added test helper.


## Task 6

```ts
// src/design/islands/index.ts  (every island is 'use client' unless noted; every label is a prop — W9)
export { RangeSlider, type RangeSliderProps } from './RangeSlider';
//   RangeSlider({ id, label, min, max, step = 1, value, onChange(value: number), formatValue?(v: number): string,
//                 minLabel?, maxLabel?, hint?, className? })   — real <input type="range">, aria-valuetext = formatValue(value)
export { Stepper, type StepperProps } from './Stepper';
//   Stepper({ id, label, value, onChange(value: number), min, max, step = 1, decrementLabel, incrementLabel, hint?, className? })
//     — real <input type="number"> + two labelled buttons; value clamped to [min,max] on every change; buttons disabled at bounds
export { TriState, type TriStateProps, type TriStateValue } from './TriState';
//   type TriStateValue = 'yes' | 'no' | 'unsure';
//   TriState({ name, legend, value: TriStateValue | null, onChange(v: TriStateValue), labels: Record<TriStateValue,string>, hideLegend?, className? })
//     — <fieldset>/<legend> + three real radios (sr-only) styled as chips
export { ProgressBar, type ProgressBarProps, type ProgressTone } from './ProgressBar';   // no hooks, no directive: usable from server components too
//   type ProgressTone = 'blue' | 'green' | 'amber' | 'red';
//   ProgressBar({ value, max = 100, label, valueText?, tone = 'blue', className? })  — role="progressbar" aria-valuenow/min/max, aria-label = label
export { BottomSheet, type BottomSheetProps } from './BottomSheet';
//   BottomSheet({ open, onClose, title, closeLabel, children, className? })  — Dialog variant="sheet": focus trap, Escape, scroll lock, restore
export { SearchInput, type SearchInputProps } from './SearchInput';
//   SearchInput({ id, label, value, onChange(value: string), placeholder?, clearLabel, resultText?, hideLabel?, className? })
//     — <input type="search">; clear button when non-empty; Escape clears; resultText in a polite live region
export { ScrollSpyToc, type ScrollSpyTocProps, type TocHeading } from './ScrollSpyToc';
//   type TocHeading = { id: string; text: string };
//   ScrollSpyToc({ headings, label, heading?, readMinutes?, remainingLabel?(minutesLeft: number): string, offsetPx = 96, className? })
//     — <nav aria-label={label}> of #id links; aria-current="location" on the active heading; "≈ N min left" from readMinutes × (1 − progress)
export { ShareRow, type ShareRowProps, type ShareLabels } from './ShareRow';
//   type ShareLabels = { heading: string; share: string; whatsapp: string; linkedin: string; x: string; copy: string; copied: string };
//   ShareRow({ url, title, labels, className? })  — Web Share button when navigator.share exists (client-only fact), else wa.me / LinkedIn / X intents; Copy → clipboard + role="status" "Copied"
export { PrintButton, type PrintButtonProps } from './PrintButton';
//   PrintButton({ label, variant = 'secondary', className? })  — adds body.print-isolating, window.print(), removes on afterprint;
//     the page marks the printable region with className="print-isolate" and non-printing controls with "print-hidden"
export { useScrollProgress } from './useScrollProgress';   // (): number — 0…1 document scroll progress, 0 on the server (R18)

// src/design/primitives/Dialog.tsx — additive
Dialog({ open, onClose, titleId, children, variant?: 'center' | 'sheet' })   // 'center' is the existing rendering; 'sheet' docks to the bottom edge

// src/design/chrome/icons.tsx — additive (IconProps = { size?: number; className?: string }, file-local as today)
export function XIcon(props: IconProps): React.JSX.Element; export function LinkIcon(props: IconProps): React.JSX.Element;

// src/design/assets/source-map-codes.ts  (client-safe, no fs; W40: upper-case ISO2, same order as Task 1's sourceCountries)
export const SOURCE_MAP_CODES = ['PK','NP','IN','UZ','KG','TM','PH','ID','RU','ML','SN','CM','LK'] as const;   // W1: source-map.js's 12 + LK
export type SourceMapCode = (typeof SOURCE_MAP_CODES)[number];
export function isSourceMapCode(code: string): code is SourceMapCode;
export const SOURCE_MAP_POINTS: Record<SourceMapCode, { lon: number; lat: number; atlasId: string }>;   // design coordinates + world-atlas numeric id
export const TURKIYE_POINT: { readonly lon: 35.2; readonly lat: 39; readonly atlasId: '792' };
export function sourceMapLabels(countries: ReadonlyArray<{ code: string; name: string }>): Record<SourceMapCode, string>;
//   = Object.fromEntries over Task 1's sourceCountries rows, checked complete: a missing code throws outside production, falls back to the code in production.
//   Pages: `labels={sourceMapLabels(getCollection(bundle, 'sourceCountries'))}`.

// src/design/assets/source-map.ts  (what pages import: `import { SourceMap, sourceMapLabels } from '@/design/assets/source-map'`)
export { SourceMap, SOURCE_MAP_MARKERS, SOURCE_MAP_VIEWBOX, type SourceMapProps } from './source-map.generated';
export { SOURCE_MAP_CODES, SOURCE_MAP_POINTS, isSourceMapCode, sourceMapLabels, type SourceMapCode } from './source-map-codes';
//   SourceMap({ title, labels: Record<SourceMapCode, string>, turkiyeLabel, id = 'source-map', className? })  — server component (no hooks, no directive),
//     inline <svg viewBox="0 0 640 397" role="img" aria-labelledby>; every marker <g data-country="<CODE>"> carries <title>{labels[CODE]}</title>;
//     the Türkiye marker is <g data-country="TR"> with <title>{turkiyeLabel}</title> and the visible map label {turkiyeLabel} (W9: the design's
//     hard-coded "Türkiye" becomes a prop — pass t('<package id>') or the literal, both locales spell it the same);
//     arcs dash in, dots pulse (CSS, reduced-motion + print safe)
//   SOURCE_MAP_MARKERS: Record<SourceMapCode | 'TR', { x: number; y: number }>;  SOURCE_MAP_VIEWBOX = { width: 640, height: 397 }

// src/design/assets/flag-codes.ts
export const FLAG_CODES = [...SOURCE_MAP_CODES, 'TR'] as const;  export type FlagCode = (typeof FLAG_CODES)[number];
export function isFlagCode(code: string): code is FlagCode;   // Task 1's `code: string` rows → `Flag` (which wants FlagCode) go through this guard
// src/design/Flag.tsx (no hooks, no directive — server or client)
export function Flag({ code: FlagCode, size = 20, label?: string, className? }): React.JSX.Element   // <svg><use href="/brand/flags.svg#flag-<CODE>"/></svg>, 4:3, decorative unless label

// src/lib/qr.ts (pure, no 'server-only' so it is unit-testable; call it from server components only — QrCode.tsx is the door)
export type QrOptions = { size?: number; margin?: number; dark?: string; light?: string | null; label?: string };
export function qrSvg(text: string, options?: QrOptions): string   // deterministic <svg …> string, ECC M, `qrcode` package, no client JS
// src/design/QrCode.tsx ('server-only')
export function QrCode({ text, label, size = 86, className? }): React.JSX.Element

// src/design/assets/brand.ts
export const BRAND = {
  mark:       { src: '/brand/ja-mark.png',    width: 336, height: 285 },
  logo:       { src: '/brand/logo.png',       width: 742, height: 146 },   // JobsAdmire's own logo, fetched once from the live site
  iskur:      { src: '/brand/iskur.png',      width: 320, height: 320 },   // the İŞKUR licence mark the live site already displays
  googlePlay: { src: '/brand/google-play.svg', width: 24, height: 24 },   // the design's inline Play glyph; W8: no App Store file
  flags: '/brand/flags.svg',
} as const;

// package.json scripts (added beside "redirects:build"; Task 7 lists them in its final block, W42)
"assets:brand": "bash scripts/fetch-brand.sh"       // one-time fetch of logo.png + iskur.png (committed; never runs in the build)
"assets:flags": "tsx scripts/build-flags.ts"        // regenerates public/brand/flags.svg from the flag-icons devDependency
"assets:map":   "tsx scripts/build-source-map.ts"   // regenerates src/design/assets/source-map.generated.tsx

// CSS (src/app/globals.css): .source-map__arc / .source-map__pulse animations with @media print end-states;
//   body.print-isolating + .print-isolate / .print-hidden print isolation

// Sprite ids (public/brand/flags.svg): <symbol id="flag-PK" viewBox="0 0 640 480"> … one per FLAG_CODES entry, upper-case (W40)
```

**Produces — deviations:**
(1) `public/brand/logo.png` + `iskur.png` (raster, fetched once from the company's own live site) instead of `logo.svg`/`logo-white.svg`/`iskur.svg` — no vector exists anywhere in the package or on the live site; the SVGs (and the white variant) become an owner ask recorded in ARCHITECTURE § Assets, and dark surfaces keep the chrome's `ja-mark.png` + HTML wordmark. (2) `google-play.svg` is the design's inline Play **glyph** (24×24), not a full badge bitmap — `StoreBadges` composes the badge from hire.240/241 per W7. (3) Additions beyond the skeleton: `useScrollProgress` hook, `ProgressBar.valueText` (page-formatted, D18), `Dialog.variant`, `XIcon`/`LinkIcon`, `src/design/assets/{source-map-codes,flag-codes,brand}.ts`, `src/design/assets/source-map.ts` as the import door, `src/design/QrCode.tsx`, `assets:brand` script, `.gitattributes`. (4) `src/lib/qr.ts` has no `server-only` import (so it is unit-testable, like `content/pure.ts` under R2); `QrCode.tsx` carries it. (5) `SourceMap` takes `labels` + `title` + **`turkiyeLabel`** (required — the design's hard-coded "Türkiye" text is copy, W9) + optional `id` (the skeleton listed only "inline SVG server component … data-country"). (6) **W40:** every code is upper-case ISO2 (`SOURCE_MAP_CODES = ['PK', …, 'LK']`, `FLAG_CODES` + `'TR'`, sprite ids `flag-PK`, `data-country="PK"`, `SOURCE_MAP_MARKERS.TR`) — the earlier draft's lower-case set is withdrawn; `isSourceMapCode`/`isFlagCode` type guards and `sourceMapLabels(rows)` are added so pages feed `Flag` and `SourceMap` straight from Task 1's `sourceCountries` rows (`code: string`), and `src/design/assets/__tests__/source-map-codes.test.ts` pins the list, order and coordinates to the committed TR bundle (replacing the earlier draft's unbacked "its test asserts it" claim). (7) The gallery demo lives at `src/app/[locale]/(site)/dev/gallery/IslandsDemo.tsx` and edits the moved `page.tsx` (W41), not the pre-move path.


## Task 7

Produces (copied from interfaces.md § T0e and completed)
```ts
// e2e/routes.ts — the single gate route list (W21). Page tasks append here and nowhere else.
export type GateRoute = { path: string; indexable: boolean };
export const GATE_ROUTE_TABLE: readonly GateRoute[];   // both locales, every route as pages land
export const GATE_ROUTES: readonly string[];            // every path (axe, width sweep, placeholder counter)
export const INDEXABLE_GATE_ROUTES: readonly string[];  // indexable paths (Lighthouse, SEO spec, sitemap membership, page-contract loop)
//   Today: '/', '/en', '/isci-talebi', '/en/hire-workers' (indexable) + '/tesekkurler?form=hire' (indexable: false).
//   A route in NOINDEX_PATHNAMES is appended with indexable: false.

// scripts/gate-routes.mjs — `node scripts/gate-routes.mjs [--all] [--json]`
//   stdout: INDEXABLE_GATE_ROUTES one per line (default) | GATE_ROUTES with --all | JSON array with --json; exit 2 on an unknown flag

// scripts/gate.sh — `npm run gate` | `npm run gate:launch` (= `bash scripts/gate.sh --profile=launch`)
//   default: playwright → lhci collect over `node scripts/gate-routes.mjs` → upload → assert → `node scripts/js-size.mjs || true`
//   launch : + `npx vitest run --config vitest.launch.config.mts` (UNBUILT_PATHNAMES empty, W20)
//            + `npx tsx scripts/placeholder-count.ts` (content-readiness table, D26/W55)

// lighthouserc.json + lighthouserc.local.json
//   "resource-summary:script:size": ["error", { "maxNumericValue": 204800 }]   // W13 amended

// scripts/js-size.mjs — `node scripts/js-size.mjs [--dir=.lighthouseci]`  (= `npm run js-size`)
export const SCRIPT_CEILING = 204_800; export const LAZY_LINE = 194_560;
export type JsSizeRow = { path: string; runs: number; scriptBytes: number; headroomBytes: number; lcpMs: number | null; performance: number | null; overLazyLine: boolean; overCeiling: boolean };
export function summarizeLhrs(lhrs: unknown[]): JsSizeRow[];        // worst script size, median LCP, lowest score per path; non-LHR input ignored
export function formatJsSizeTable(rows: JsSizeRow[]): string;      // markdown, pasted into the ledger

// scripts/placeholder-count.ts — `npx tsx scripts/placeholder-count.ts` (E2E_BASE_URL required; exit 1 when any route fails)
export type PlaceholderScan = { placeholders: string[]; lcpSlots: string[]; both: string[] };
export type RouteVerdict = { route: string; status: number | null; placeholders: string[]; lcpSlot: string | null; problems: string[] };
export function scanPlaceholders(html: string): PlaceholderScan;                 // pure; ignores <script> and comments
export function evaluateScan(route: string, status: number | null, scan: PlaceholderScan): RouteVerdict;
//   problems: 'no response' | 'HTTP <n>' | 'no data-lcp-slot on the page' | 'more than one data-lcp-slot: a, b'
//           | 'LCP slot "<slot>" is a placeholder (D26)' | 'unnamed data-placeholder (W55)'
export function formatReadinessTable(verdicts: RouteVerdict[]): string;
//   writes lighthouse-report/content-readiness.json { base, generatedAt, routes: RouteVerdict[] }
// Page markup contract (every WP2b page; docs/ARCHITECTURE.md § Quality gate):
//   <h1 data-testid="page-h1"> — exactly one h1 per page, real copy (no leaked `{token}` / `undefined`);
//   the LCP element carries data-lcp-slot="<slot>" (the hero <img>'s design slot id when the photo ships, else the h1 with "h1");
//   every image slot rendered without its asset carries data-placeholder="<design slot id>" (never empty — W55), never on
//   the LCP element (D26). Pages emit both attributes through Task 5's ImageSlot (W27); the h1 carries them by hand.

// scripts/launch/unbuilt-routes.launch-check.ts + vitest.launch.config.mts — launch profile only
//   asserts [...UNBUILT_PATHNAMES] equals [] (W20); vitest.launch.config.mts spreads `./vitest.config.mjs` (W50) with
//   include ['scripts/launch/**/*.launch-check.ts'], environment 'node', setupFiles []

// scripts/pixel-compare.ts — `npm run pixel -- --page=home|hire|calc|blog-article [--locale=tr|en] [--base=<url>] [--route=<path>] [--widths=390,900,1440]`
export const PIXEL_WIDTHS: readonly [390, 900, 1440];
export type PixelLocale = 'tr' | 'en'; export type PixelPageKey = 'home' | 'hire' | 'calc' | 'blog-article';
export type PixelBundle = { collections: { blog?: Array<{ slug: { tr: string | null; en: string | null }; hasBody: { tr: boolean; en: boolean } }> } };
export const PIXEL_PAGES: Record<PixelPageKey, { design: string; route: Record<PixelLocale, string> | 'blog' }>;
export function resolvePixelRoute(page: PixelPageKey, locale: PixelLocale, bundle: PixelBundle | null, override?: string | null): string;
//   'blog' → the first blog row with hasBody[locale] && slug[locale] → /blog/<slug.tr> | /en/blog/<slug.en>; none → throws (pass --route)
export function comparePngs(design: PNG, built: PNG): { diff: PNG; width: number; height: number; diffPixels: number; match: number };
//   writes .pixel/<page>-<locale>-<w>.png (diff), .pixel/<page>-<locale>-<w>-design.png, .pixel/<page>-<locale>-<w>-built.png
//   and merges { [`${page}-${locale}`]: { base, route, design, generatedAt, results: [{ width, designHeight, builtHeight, diffPixels, match }] } }
//   into .pixel/report.json. Never part of the gate or CI; needs network (unpkg, Google Fonts) and a running build.

// package.json scripts after this task: "gate", "gate:launch", "js-size", "pixel" beside the existing "content:import",
//   "redirects:build" and Task 6's "assets:brand", "assets:flags", "assets:map" (W42 — additive edits only)
// devDependencies added: pixelmatch ^5.3.0, pngjs ^7.0.0, @types/pixelmatch ^5.2.6, @types/pngjs ^6.0.5 (CJS majors — tsx runs this
//   non-"type":"module" repo's scripts as CJS)
```

**Produces — deviations:** (1) `e2e/routes.ts` adds `GATE_ROUTE_TABLE` (`{ path, indexable }`) as the authored source; `GATE_ROUTES` and `INDEXABLE_GATE_ROUTES` are derived from it (both `readonly string[]`, source-compatible with the a11y/width-sweep imports). (2) Pixel output files carry the locale: `.pixel/<page>-<locale>-<w>.png` (diff) plus `-design.png`/`-built.png` siblings, and `report.json` is keyed `<page>-<locale>` with `{ base, route, design, generatedAt, results }` — the skeleton's `<page>-<w>.png` had no locale axis; `--locale` defaults to `tr`, so `npm run pixel -- --page=home` still works as written; `PixelBundle` is an exported type and `resolvePixelRoute` skips blog rows whose slug is `null` for the locale (Task 1's nullable slugs, W33). (3) The `UNBUILT_PATHNAMES`-empty check is a Vitest file under a launch-only config (`scripts/launch/unbuilt-routes.launch-check.ts` + `vitest.launch.config.mts`, which imports `./vitest.config.mjs` per W50) rather than a `tsx` script, because `src/lib/seo/routes.ts` imports next-intl's navigation build, which only the Vitest resolver is proven to load outside Next (R19). (4) An extra `npm run js-size` alias and `scripts/js-size.mjs` exports (`summarizeLhrs`, `formatJsSizeTable`, `SCRIPT_CEILING`, `LAZY_LINE`) are additive; `gate.sh` runs it with `|| true` (informational). (5) The e2e rewrite asserts no package-id h1 text (the skeleton's "h1 text from the package ids"): W1 re-authors metric strings with `{token}` placeholders through the importer, so a literal-text assertion would break at T0b; the specs instead require exactly one `h1[data-testid="page-h1"]` with non-empty copy and no leaked `{token}`/`undefined`, and prove the localized hire link through the desktop nav row rather than a header CTA (W50). (6) `evaluateScan` additionally fails an unnamed `data-placeholder` (`'unnamed data-placeholder (W55)'`) — the skeleton only named the LCP-slot rule. (7) The thank-you page (`(minimal)/thank-you/page.tsx`) is tagged `page-h1` + `data-lcp-slot="h1"` in this task, not in a later page task, so the launch profile's counter passes on every gate route today. (8) `e2e/seo.spec.ts` carries Task 4's two OG-image tests verbatim (W37/W50) and asserts nothing about `/blog` in `robots.txt` (W37). (9) `package.json` `scripts` are edited additively; the block quoted in Cycle 5 is the expected end state including Task 6's `assets:*` lines (W42).


## Task 8

```markdown
- Produces (the T0f skeleton from `interfaces.md`, completed — this is the wire contract WP2b's forms (T3 Hire, T5 Partner, T7 Contact, T8 Available Workers, T11 Careers) and T14's `docs/INTEGRATIONS.md` I4 table rely on; the real catalog path is `apps/backend/src/modules/website/website-form-catalog.ts` — interfaces.md's `forms/` segment does not exist):
  - `apps/backend/src/modules/website/website-form-catalog.ts`:
    - `export type WebsiteFieldType = 'text' | 'email' | 'phone' | 'iso2' | 'enum' | 'url' | 'key' | 'array-of-key';` (adds `'url'`: http(s) only, a parseable host containing a dot, no embedded credentials; `https://` is prepended when the scheme is missing; the length cap applies to the value as typed, before the scheme is added).
    - `export const PARTNER_TRACK_VALUES = ['sourcing', 'institute'] as const;`
    - `export const CONTACT_TOPIC_VALUES = ['hire', 'partner', 'permit', 'job', 'other'] as const;`
    - New OPTIONAL fields inside `fields` (exact wire names): `city?: string` (≤120) on `hire`, `workers`, `partner`, `callback`, `contact` (`careers` keeps its own older `city` ≤100); `track?: 'sourcing' | 'institute'` on `partner`; `topic?: 'hire' | 'partner' | 'permit' | 'job' | 'other'` on `contact` (exact match, lower-case; `callback.topic` stays free text ≤200); `portfolioUrl?: string` (≤500 as typed) on `careers`.
    - Rejection reasons (in the 400's `errors[]`): `city is too long (max 120)`; `track must be one of sourcing, institute`; `track is too long (max 40)`; `topic must be one of hire, partner, permit, job, other`; `topic is too long (max 40)`; `portfolioUrl must be a web address`; `portfolioUrl is too long (max 500)`. A stray `city`/`track`/`topic`/`portfolioUrl` on a form that does not list it is dropped (reported in `dropped`), never an error.
  - `apps/backend/src/modules/website/handlers/website-inquiry.logic.ts` (`buildWebsiteInquiryDto` output): `messagePreview` first line = `[website:<formKey>]`, or `[website:<formKey>:<track>]` when `fields.track` is present (partner); next line = `subject: [<topic>] <subject>` when the form is `contact` and a topic and/or a subject is present (`subject: [job]` alone when the visitor typed no subject; the plain `subject: <subject>` when there is no topic); then one `<key>: <value>` line per remaining non-identity field in the catalog's field order, `city` included (`city: Antalya`). `classification` unchanged: partner → `SOURCING_PARTNER` for both tracks and without one; contact → `iAm` or none; callback/visit/calculator → none. `callback.topic` stays a plain `topic: …` line.
  - `apps/backend/src/modules/website/handlers/careers-apply.logic.ts`: `export const PORTFOLIO_LINE_PREFIX = 'Portfolio: ' as const;` and `buildPublicApplyDto` sets `coverLetter = [coverLetter, 'Portfolio: <url>'].join('\n\n')` (the URL as the LAST paragraph; the letter alone when no URL; the line alone when no letter; scheme added if missing; nothing else on the DTO changes; `DROPPABLE_APPLY_FIELDS` unchanged; `PublicApplyDto` has no `portfolioUrl` property).
  - Door behaviour that does NOT change (W56): `Opening.portfolioRequired` openings still answer `{ status: 'FAILED', error: 'This position requires at least one portfolio document' }` (HTTP 200) through `POST /api/website/v1/forms/careers`.
  - Docs (Ops `docs/PRD.md`, pinned by `website-docs-guard.spec.ts`): §5.12 "**Catalog v1.1 (2026-09-20, WP2 T0f, website ruling W16) — the OPTIONAL fields added for the designed pages.**" paragraph + four-row table; the gotcha "**Catalog v1.1 fields are additive and column-less (W16, 2026-09-20).**"; §12.2 "**2026-09-20 — Website catalog v1.1 (WP2 T0f, W16).**"; and per W46: the Idempotency sentence now reads "the website retries at most ONCE, immediately, and only after a network error, a per-attempt timeout or a 5xx — never after a 4xx — inside an 8 s total budget, then shows the visitor its fallback panel", the heartbeat note says "`sourcePath` is NOT part of `requestHash`", and the gotcha "**Newsletter confirm/unsubscribe tokens are forwarded only on the visitor's click (I12, WP2a).**" exists. T14 mirrors the field table into the website's `docs/INTEGRATIONS.md` I4.
  - Unchanged and asserted: `PERMISSION_KEYS_HASH`, `WEBSITE_FORM_KEYS`, `schema.prisma`, `WebsiteFormSubmitDto`, `CreateInquiryDto`, `PublicApplyDto`, the `portfolioRequired` gate, `DROPPABLE_APPLY_FIELDS`.
```

**Produces — deviations:** (1) `portfolioUrl` is a NEW catalog field type `url` (http(s) only, host with a dot, no credentials, `https://` prepended when missing, cap as typed) rather than `text` + `pattern`; `linkedinUrl` is deliberately NOT retyped. (2) `portfolioUrl` rides as the LAST paragraph of `coverLetter` (`Portfolio: <url>`); the `Opening.portfolioRequired` gate is NOT relaxed — settled by W56 (owner decision pending; ~6-line careers-public follow-up recipe recorded); T11 keeps W3's "apply by e-mail" branch for those openings. (3) "topic → subject prefix" is `subject: [<topic>] <subject>` inside `messagePreview` (no `subject` column); "track prefixed in messagePreview" is the tag `[website:partner:<track>]`. (4) `track`/`topic` carry `max: 40` like `iAm` (two extra `too long` reasons). (5) Ops has no `npm run verify`; Step 4s use `npm run type-check` + `npx jest <paths> --maxWorkers=2`; ESLint is not a gate and origin/main already has 5 errors under `src/modules/website` — this task adds none and fixes none. (6) Per W46 the task also lands the three §5.12 corrections (W3 retry sentence, `sourcePath` not hashed — normalised fields are what is hashed —, I12 click-only rule), docs-guard-pinned. (7) Per W47 it runs in a third Ops worktree `jobsadmire-operations-catalog` (branch `website/catalog-ext` off origin/main 7ea2a93) with `npm ci` + `prisma generate`. (8) interfaces.md T0f's `forms/` path is wrong; the real file is `apps/backend/src/modules/website/website-form-catalog.ts`.


## Task 9

```ts
// src/lib/calculator/types.ts — pure types + the one error class; no rate literal
export type { CalculatorRole, RateConfig } from '@/content/collections';
export class CalculatorError extends Error {}
export const SGK_TIERS = ['manufacturing', 'other', 'none'] as const;   // keys of rateConfig.sgkRates (calc.022 chips)
export type SgkTier = (typeof SGK_TIERS)[number];
export const LIMITS = { headcountMin: 1, headcountMax: 500, monthsMin: 1, monthsMax: 12 } as const;   // UI bounds from the design, not rates
export type EstimateInput = { role: CalculatorRole; headcount: number; months?: number /* default 12 */; grossSalary?: number | null /* null → salaryRange(role).min; clamped to the range */; sgkTier?: SgkTier /* default 'other' */; flight?: boolean /* default true */; housing?: boolean /* default false */; supportOptIn?: boolean /* default false — W2 */ };
export type MonthlyLines = { gross: number; sgk: number; housing: number; support: number; total: number };   // total = gross + sgk + housing − support (support is a positive deduction)
export type OneOffLines = { permitFee: number; flight: number; total: number };                                 // total = permitFee + flight
export type ResolvedInput = { role: CalculatorRole; headcount: number; months: number; grossSalary: number; sgkTier: SgkTier; sgkRate: number; flight: boolean; housing: boolean; supportOptIn: boolean };   // after clamping/defaults — what the UI should reflect
export type Estimate = { input: ResolvedInput; perWorker: { monthly: MonthlyLines; oneOff: OneOffLines }; monthly: MonthlyLines /* × headcount */; oneOff: OneOffLines /* × headcount */; contract: { months: number; payroll: number; oneOff: number; total: number; perWorkerPerMonth: number }; firstYearTotal: number /* = contract.total: "First-year total" at 12 months, "N-month season total" otherwise */; shares: { salaryPct: number; sgkPct: number } /* percent units, unrounded, of gross + sgk — the teaser bars home.084/085 */ };

// src/lib/calculator/engine.ts — unrounded numbers; nothing formatted here
export function salaryFloor(role: CalculatorRole, rateConfig: RateConfig): number;                 // legalMinGross × multiplier, EXACT (W2): 1.5× → 49545, never 50000
export function salaryRange(role: CalculatorRole, rateConfig: RateConfig): { min: number; max: number | null };   // min = max(floor, role.salaryMin ?? floor); max = max(role.salaryMax, min) or null (presets)
export function sgkRate(rateConfig: RateConfig, tier: SgkTier): number;                            // rateConfig.sgkRates[tier]; CalculatorError on an unknown tier
export function employerMonthlyCost(gross: number, rateConfig: RateConfig, tier?: SgkTier): number;   // gross × (1 + sgkRate) — calc.079's ₺40,214 at the minimum wage; the salary-guide cards
export function estimate(input: EstimateInput, rateConfig: RateConfig): Estimate;                 // the one model (see Estimate); inputs clamped to LIMITS / the salary range, never thrown
export function presets(roles: CalculatorRole[]): CalculatorRole[];                                // preset: true rows, ascending multiplier (1, 1.5, 2) — the homepage teaser chips
export function findRole(roles: CalculatorRole[], key: string): CalculatorRole | undefined;

// src/lib/calculator/quota.ts — the 5:1 rule (ratio from rateConfig.quotaRatio, never a literal)
export type QuotaCheck = { allowed: boolean; maxForeign: number; shortfall: number; overBy: number };
export function quotaCheck(turkishStaff: number, foreignRequested: number, quotaRatio: number): QuotaCheck;   // maxForeign = floor(staff ÷ ratio); allowed = requested ≤ maxForeign; shortfall = Turkish employees still needed (max(0, requested × ratio − staff)); overBy = max(0, requested − maxForeign); counts sanitised to non-negative integers; CalculatorError when ratio is not a positive integer
export function turkishStaffRequired(foreignRequested: number, quotaRatio: number): number;         // requested × ratio (calc.043–045 hint)
export const QUOTA_VIZ_CAP = 8;
export type QuotaBlocks = { full: number; remainder: number; shown: number; capped: boolean; nextUnlockIn: number };
export function quotaBlocks(turkishStaff: number, quotaRatio: number, cap?: number): QuotaBlocks;   // the block visualisation (calc.144–147, qvExact/None/Part/Cap): full = floor(staff ÷ ratio), remainder = staff mod ratio, shown = min(full, cap), capped = full > cap, nextUnlockIn = ratio − remainder (ratio when remainder is 0)

// src/lib/calculator/labels.ts — the ONLY formatting edge (formatTRY / formatPercent / Intl dates)
export function effectiveFromLabel(rateConfig: RateConfig, locale: Locale): string;   // 'Ocak 2026' / 'January 2026' (month + year, UTC)
export function updatedAtLabel(rateConfig: RateConfig, locale: Locale): string;       // '15 Ocak 2026' / '15 January 2026' (tr-TR / en-GB dates — the design's calc.089 pill)
export function effectiveYear(rateConfig: RateConfig): number;                        // 2026 — the "{year} rates" badges (calc.003, home.068/079)
export function isReviewDue(rateConfig: RateConfig, now?: Date): boolean;             // now ≥ reviewDueAt at 00:00 UTC → the dated badge hides (D17)
export function sgkRateLabel(rateConfig: RateConfig, tier: SgkTier, locale: Locale): string;   // formatPercent(rate × 100): '%21,75' / '18.75%'
export function multiplierLabel(multiplier: number, locale: Locale): string;          // '1,5×' / '1.5×' / '2×'
export type FormattedLines<T> = { [K in keyof T]: string };
export type FormattedEstimate = { grossSalary: string; perWorker: { monthly: FormattedLines<MonthlyLines>; oneOff: FormattedLines<OneOffLines> }; monthly: FormattedLines<MonthlyLines>; oneOff: FormattedLines<OneOffLines>; contract: { payroll: string; oneOff: string; total: string; perWorkerPerMonth: string }; shares: { salaryPct: string; sgkPct: string } };
export function formatEstimate(estimate: Estimate, locale: Locale): FormattedEstimate;   // every lira line through formatTRY, shares through formatPercent(·, locale, 0)

// src/lib/calculator/index.ts — the barrel pages import from ('@/lib/calculator'); re-exports everything above
```

**Produces — deviations:** (1) `estimate(input, rateConfig)` / `salaryFloor(role, rateConfig)` / `quotaCheck(…, quotaRatio)` take the rate data as an argument rather than W24's bare `estimate(input)` — Task 1's ARCHITECTURE rule forbids the engine from owning a rate. (2) `salaryFloor` is the legal floor only (exact `legalMinGross × multiplier`, 49 545 for 1.5×); the slider's composite `max(role.salaryMin, floor)` is the separate `salaryRange`. (3) `quotaCheck` adds `overBy` beside the ruled `allowed/maxForeign/shortfall`; `quotaBlocks`/`turkishStaffRequired` are additive. (4) `labels.ts` adds `updatedAtLabel`, `effectiveYear`, `sgkRateLabel`, `multiplierLabel`, `formatEstimate`; dates use tr-TR / en-GB (the design's pill) while money stays on `money.ts`'s en-US. (5) `estimate` clamps bad UI inputs (headcount, months, salary, NaN) and reflects them in `estimate.input` instead of throwing; only bad rate data throws. (6) Support is a positive `support` line subtracted in `total`, not a negative line. (7) `COPY_DELTAS` lives in `__tests__/copy-deltas.test.ts` (cycle 4, needs quota.ts) as a live table with an asserted `agrees` column, beside the generated-bundle cross-check. (8) Extras: `LIMITS`, `SGK_TIERS`, `employerMonthlyCost`, `findRole`, `QUOTA_VIZ_CAP`, `FormattedEstimate`/`FormattedLines`, `__tests__/fixtures.ts` (Task 1's seeded row + role table, asserted equal to the bundle).


## Task 9 — test fixtures (frozen for the page tasks, per the WP2b check)
`src/lib/calculator/__tests__/fixtures.ts` exports `RATE: RateConfig` (Task 1's emitted row), `ROLES: CalculatorRole[]` (the 15 rows) and `role(key: string): CalculatorRole` (throws on an unknown key). Pages' unit tests import them from `@/lib/calculator/__tests__/fixtures`.

## Task 2 — post-fix-round notes (2026-09-24)
Refreshed after the fix round lands: `idScope?`/`id?`/`headingLevel?` props on FormShell, `useFieldId`/`useRegisterField` in FormErrorsContext, form-level alert + `sys.form.errors.form`, `src/forms/echo.ts`, `src/forms/client/guardAction.ts`, `src/forms/visitor.ts`, Turnstile `useTurnstileReset`, `toFields(parsed, data, ctx: { visitor, locale })`, `Field` passthroughs (`minLength`, `maxLength`, `defaultValue`, `disabled`; the select branch ignores `placeholder` — W111), `consentLinkHref` = `'/privacy'` only, `MAX_UPLOAD_BYTES` 4 MB (W73), `ATTEMPT_TIMEOUT_MS` 9000 + one connection-level retry (W74), `opsPingCheck` `off → fail` (W75), the WhatsApp fallback href bare with click-time composition (W76). See the fix-round report for exact signatures.

### Task 2 — final additions as reviewed (2026-09-24 16:51, re-review verdict)
- Values: `ATTEMPT_TIMEOUT_MS` 9000 (W74/W117 one shared deadline); `MAX_UPLOAD_BYTES` = `MAX_CV_BYTES` = `MAX_EVIDENCE_BYTES` = 3 MiB (W73/W116).
- Narrowed: `FormShell.consentLinkHref` accepts `'/privacy'` only (W79); the beacon `kind` is `z.enum(FORM_FALLBACK_KINDS)`.
- Behaviour: `opsPingCheck` maps `off | unauthorized | unreachable → 'fail'`, `unconfigured → 'skip'` (W75); the WhatsApp fallback anchor is a bare `https://wa.me/<n>` and the prefilled URL opens via `window.open(url, '_blank', 'noopener')` at click time (W76).
- Signature: `FormSpec.toFields(parsed, data, ctx: FormActionContext)` where `FormActionContext = { visitor: PostFormVisitor; locale: Locale }` (2-arg callbacks still type-check).
- Message keys: `sys.form.errors.form` added; `sys.form.consent.link` and `sys.form.fallback.retry` removed; `sys.form.*` must never speak as "we" (`src/messages/voice.test.ts`).
- Additions: `FormShell` props `idScope?: string`, `headingLevel?: 2|3|4`, `id?: string`; `FallbackPanel` `headingLevel?`; `Turnstile` `id` + `ref` with exports `TurnstileHandle`, `useTurnstileReset`; `FormErrorsValue` `register?`/`idScope?` with exports `useFieldId(name)`, `useRegisterField(name)`; `Field` props `minLength`, `maxLength`, `defaultValue`, `disabled` (the select branch ignores `placeholder`, W111); constants/types `MAX_UPLOAD_BYTES`, `FormActionContext`, `FORM_FALLBACK_KINDS`; new modules `src/forms/echo.ts` (`echoValues`, `isInternalKey`), `src/forms/visitor.ts`, `src/forms/client/guardAction.ts`; `src/forms/env.ts` exports `type DoorConfig`; `src/forms/uploads.ts` exports `UPLOAD_TIMEOUT_MS`.
- Ids: every internal id derives from `idScope ?? formKey` — `f-<scope>-consent`, `f-<scope>-honeypot`, `f-<scope>-turnstile`, fields `f-<scope>-<name>`; a page with two shells of the same key passes distinct `idScope`s.
