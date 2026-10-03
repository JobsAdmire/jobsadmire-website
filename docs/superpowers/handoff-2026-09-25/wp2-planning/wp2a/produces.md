# WP2a — Produces blocks (verbatim from the drafts; the WP2b page writers consume exactly these)


## ### Task 1: Phase A data layer through the importer (T0b)

Produces (frozen for T0c/T0d/T0e and every WP2b page):

```ts
// src/content/collections.ts — client-safe (no server-only, no fs), Zod
export const METRIC_KEYS = ['placed','employers','countries','permitDays','firstDayWeeks','firstDayWeeksInCountry','replySlaHours','homepageReplyHours','sectors'] as const;
export type MetricKey = (typeof METRIC_KEYS)[number];
export const PAGE_KEYS = ['home','hire','calc','wp','partner','about','contact','workers','stories','verify','careers','careersDetail','blog','blogArticle','portal','privacy','terms','kvkk','cookiePolicy','thankYou','newsletterConfirm','newsletterUnsubscribe'] as const;
export type PageKey = (typeof PAGE_KEYS)[number];
export const PAGE_PATHNAME: Record<PageKey, keyof typeof pathnames>;   // pageKey → internal route
export type Metric = { key: MetricKey; value: number | null; text: string | null; suffix: '+' | ''; labelId: string | null; unitId: string | null };
export type RateConfig = { version: '2026-01'; effectiveFrom: '2026-01-01'; reviewDueAt: '2026-12-20'; updatedAt: string; currency: 'TRY'; legalMinGross: 33030; sgkEmployerRate: 0.2175; sgkRates: { manufacturing: number; other: number; none: number }; supportMonthly: 1270; permitFeeTRY: 16000; flightTRY: 12000; housingMonthlyTRY: number; quotaRatio: number };
export type CalculatorRole = { key: string; labelId: string; multiplier: number; group: 'general' | 'skilled' | 'specialist'; preset: boolean; industry: 'factory' | 'construction' | 'hotel' | 'agriculture' | null; industryLabelId: string | null; salaryMin: number | null; salaryMax: number | null };   // 12 roles (preset:false) + 3 homepage presets (preset:true, multipliers 1 / 1.5 / 2, labelIds home.240–242)
export type SourceCountry = { code: string /* ISO2 */; nameId: string | null; name: string /* locale-resolved */; lon: number; lat: number; flag: string /* emoji */ };   // 13 rows: PK NP IN UZ KG TM PH ID RU ML SN CM + LK
export type Office = { key: 'antalya' | 'karachi'; kind: 'hq' | 'sourcing'; cityId: string; labelId: string; addressId: string; addressLine2Id: string; hoursId: string; footerLabelId: string; phone: string; whatsapp: string; email: string; hours: { tz: string; days: number[]; open: string; close: string }; mapUrl: string };
export type Sector = { key: 'factory' | 'construction' | 'tourism' | 'agriculture' | 'textile' | 'logistics' | 'other'; labelId: string; subtitleId: string | null; icon: string };   // keys = the stable option values every form sends
export type BlogPost = { key: string /* EN slug */; slug: { tr: string | null; en: string | null }; title: { tr: string | null; en: string | null }; excerpt: { tr: string | null; en: string | null }; category: 'workPermits' | 'recruitment' | 'compliance' | 'marketNews'; categoryLabelId: string; author: string; publishedAt: string /* YYYY-MM-DD */; readMinutes: number; hasBody: { tr: boolean; en: boolean } };   // 22 rows (one per article, TR translation folded in), 1 EN body, 0 TR bodies
export const CollectionSchemas: { metrics; rateConfig; calculatorRoles; sourceCountries; offices; sectors; blog };   // Zod schemas
export type CollectionKey = keyof typeof CollectionSchemas;
export class CollectionError extends Error {}
export function getCollection<K extends CollectionKey>(bundle: Bundle, key: K): z.infer<(typeof CollectionSchemas)[K]>[];  // parses + caches per bundle object (WeakMap); dev: throws CollectionError on a schema miss; prod: console.error + []
export function getMetric(bundle: Bundle, key: MetricKey): Metric;      // dev: throws when absent; prod: {value:null,text:null,suffix:'',labelId:null,unitId:null}
export function getRateConfig(bundle: Bundle): RateConfig;              // throws CollectionError in every env when absent (money never degrades silently, D17)
export function getOffice(bundle: Bundle, key: 'antalya' | 'karachi'): Office;   // throws in every env when absent
export const BLOG_NAV_THRESHOLD = 6;
export function blogNavVisible(bundle: Bundle): boolean;               // TR bodies ≥ threshold (W4) — sitemap/robots/chrome read this
export function getPageSeo(bundle: Bundle, key: PageKey): Bundle['pages'][string] | undefined;

// src/content/pure.ts (additions)
export function fill(template: string, values: Record<string, string>): string;   // `{key}` replacement; unknown key throws in dev, left as-is in prod; `{{ mustache }}` (verify.050/119) untouched
export function metricValues(bundle: Bundle, locale: Locale): Record<string, string>;   // { placed:'470+', employers:'22+', countries:'13', permitDays:'45', firstDayWeeks:'6–8', firstDayWeeksInCountry:'4–6', replySlaHours:'4', homepageReplyHours:'24', sectors:'6' }
export function makeTf(bundle: Bundle, locale: Locale): (id: string) => string;    // = fill(t(id), metricValues(bundle, locale)) — the accessor pages use for re-authored ids

// src/content/lint.ts (changed signature)
export type MetricLiterals = Record<string, readonly string[]>;
export function findHardTypedMetrics(strings: Record<string, string>, literals: MetricLiterals, baseline?: Record<string, string>): string[];

// scripts/import-design-package.ts
export function buildBundles(): { tr: Bundle; en: Bundle; catalogue: Record<string, CatalogueRow>; report: ImportReport };
export function buildNav(blogVisible: boolean): NavItem[];
export function rev(en: string): string;   // djb2 base-36, the package's own algorithm
// catalogue.json row: { page, sec, legal, rev, k?, packageRev?, edits?: ('override'|'turkiye'|'placeholder')[] } — rev is recomputed over the emitted EN when the importer changed it; packageRev keeps the original
// bundle.nav: groups desktopNav (10 rows; 11 with /blog once the threshold is met), hamburger (desktopNav + portal login), slimBarRight (/blog·gated, /careers, /verify, portal), footerEmployers (6), footerCompany (6, /blog gated); slimBarLeft / footerContact / mobileBottomBar / socialRail are declared EMPTY (settings-driven, R15)
// bundle.pages: one record per PAGE_KEYS entry; titleId/descriptionId are '' where the package has no SEO string (only hire → hire.264/265, partner → partner.222/223 have them) → buildMetadata treats '' as "use the page's sys.seo.* fallback"; robots 'noindex' for blog, blogArticle, portal, thankYou, newsletterConfirm, newsletterUnsubscribe
// bundle.strings: W7 overrides applied (scripts/content-overrides.json, 22 ids), EN Turkey→Türkiye (93 values), 39 ids re-authored with {metric} placeholders (scripts/metric-placeholders.json); legal-flagged metric strings verbatim and listed in scripts/metric-lint-baseline.json
// src/lib/seo/metadata.ts: buildMetadata now uses fallbackTitle/fallbackDescription when the page record's titleId/descriptionId is ''
```

---


**Produces — deviations:** (1) `blog` rows pair each EN article with its TR translation (`slug/title/excerpt` as `{tr, en}` objects, inline text) instead of `titleId`/`excerptId` + `translationOf` — blog-posts.js copy has no package ids and W9 forbids minting them. (2) `sourceCountries.nameId` is nullable (Senegal has no package id) with a locale-resolved `name` alongside. (3) `calculatorRoles` carries 15 rows: the 12 design roles plus the three homepage presets as `preset: true` rows (no 2.0× role exists in the page table). (4) `pages` records use `''` (not `null` — the frozen `PageSeoSchema` requires strings) for missing SEO ids, and `buildMetadata` gained a two-line `''` → fallback rule. (5) `findHardTypedMetrics` takes a literal-spelling table (`MetricLiterals`) and the baseline instead of `Record<string, number>`; the baseline admits one `not-a-metric:` entry (jt.271) beside the legal ones. (6) Four of the nine nav groups are declared empty (settings-driven, R15) rather than filled. (7) `offices` keys are `antalya | karachi` only (the package has no third office). (8) Extras: `makeTf`, `getPageSeo`, `PAGE_KEYS`/`PAGE_PATHNAME`, `buildNav`/`rev` exports, `rateConfig.sgkRates/housingMonthlyTRY/quotaRatio/updatedAt`, `Metric.unitId`.


## ### Task 2: Forms kernel — `src/forms/` (postForm, envelope, server-action factory, FormShell/Turnstile/FallbackPanel islands, beacon, Ops ping, `sys.form.*` copy)

Produces (frozen for T3–T5 and every WP2b page):

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
export function fieldErrorsFromIssues(issues: ZodIssue[]): Record<string, string>;  // first issue per path; value = FormErrorCode

// src/forms/types.ts  (client-safe)
export const HONEYPOT_FIELD = 'honeypot'; export const CAPTCHA_FIELD = 'cf-turnstile-response'; export const CONSENT_FIELD = 'consent';
export type FormErrorResult = Exclude<PostFormResult, PostFormOk> | { kind: 'failed'; error: string | null };
export type FormFallbackKind = FormErrorResult['kind'];   // 'invalid'|'captcha'|'off'|'tripped'|'unauthorized'|'unavailable'|'failed'
export type FormActionState =
  | { status: 'idle' }
  | { status: 'error'; result: FormErrorResult; values: Record<string, string> }
  | { status: 'fieldErrors'; errors: Record<string, string>; values: Record<string, string> };
export const IDLE_FORM_STATE: FormActionState;

// src/forms/post.ts  (import 'server-only')
export type PostFormOk = { kind: 'ok'; id: string; status: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM'; isTest: boolean; replayed: boolean; captchaDegraded: boolean; error: string | null };
export type PostFormResult = PostFormOk | { kind: 'invalid'; message: string } | { kind: 'captcha' } | { kind: 'off' } | { kind: 'tripped' } | { kind: 'unauthorized' } | { kind: 'unavailable'; cause: 'network' | 'timeout' | 'server' };
export type PostFormVisitor = { ip: string | null; ua: string | null };
export type PostFormDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };   // tests only
export const ATTEMPT_TIMEOUT_MS = 4000; export const MAX_ATTEMPTS = 2;
export async function postForm(formKey: FormKey, envelope: WireEnvelope, visitor: PostFormVisitor, deps?: PostFormDeps): Promise<PostFormResult>;

// src/forms/action.ts  (import 'server-only' — NOT a 'use server' file; see the page-side snippet)
export type { FormActionState, FormErrorResult, FormFallbackKind } from './types'; export { IDLE_FORM_STATE } from './types';
export type FormSpec<S extends z.ZodTypeAny> = { key: FormKey; schema: S; toFields: (parsed: z.infer<S>, data: FormData) => WireFields | Promise<WireFields>; consent?: 'checkbox' | 'notice' };
export class FormActionError extends Error { readonly visitorMessage: string }   // thrown from toFields → { kind: 'failed', error: visitorMessage }
export function createFormAction<S extends z.ZodTypeAny>(spec: FormSpec<S>): (prev: FormActionState, data: FormData) => Promise<FormActionState>;

// src/forms/client/FormErrorsContext.tsx  ('use client')
export const FormErrorsContext: React.Context<{ errors: Record<string, string>; values: Record<string, string> }>;
export function useFieldError(name: string): string | undefined;   // translated sys.form.errors.<code>
export function useFieldValue(name: string): string | undefined;   // echoed value after a failed submit

// src/forms/client/Field.tsx  ('use client') — the one field component pages use
export type FieldOption = { value: string; label: string };
export type FieldProps = { name: string; label?: string; hint?: string; placeholder?: string; required?: boolean; as?: 'input' | 'textarea' | 'select'; type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'file'; options?: FieldOption[]; autoComplete?: string; inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'url'; accept?: string; rows?: number; min?: number; max?: number; className?: string; id?: string };
export function Field(props: FieldProps): React.JSX.Element;   // label defaults to sys.form.labels.<name>, placeholder to sys.form.placeholders.<name> when such keys exist

// src/forms/client/Turnstile.tsx  ('use client')
export function Turnstile({ siteKey, locale }: { siteKey: string; locale: Locale }): React.JSX.Element;

// src/forms/client/FallbackPanel.tsx  ('use client')
export type FallbackPanelProps = { result: FormErrorResult; values: Record<string, string>; formKey: FormKey; locale: Locale; whatsappNumber: string; whatsappIntro?: string; contact?: { phone: string; phoneDisplay?: string; email: string } };
export function FallbackPanel(props: FallbackPanelProps): React.JSX.Element;
export function whatsappFallbackText(intro: string, values: Record<string, string>, label: (key: string) => string): string;

// src/forms/client/FormShell.tsx  ('use client')
export type FormShellProps = { action: (prev: FormActionState, data: FormData) => Promise<FormActionState>; formKey: FormKey; locale: Locale; turnstileSiteKey: string | null; whatsappNumber: string; whatsappIntro?: string; contact?: { phone: string; phoneDisplay?: string; email: string }; submitLabel?: string; consent?: 'checkbox' | 'notice'; consentLinkHref?: '/privacy' | '/kvkk'; title?: string; children: ReactNode; className?: string; testId?: string; initialState?: FormActionState };
export function FormShell(props: FormShellProps): React.JSX.Element;

// src/app/api/form-beacon/state.ts
export function recordFormBeacon(): void; export function formBeaconCount(): number; export function resetFormBeacons(): void;
// src/app/api/form-beacon/route.ts — POST {formKey: FormKey, kind: string, page: string} → 204 (400 on a malformed body)

// src/app/api/site-health/ops.ts
export type OpsPing = { state: 'ok' | 'off' | 'unauthorized' | 'unreachable' | 'unconfigured'; latencyMs: number | null };
export async function pingOps(env?: NodeJS.ProcessEnv, f?: typeof fetch): Promise<OpsPing>;
export function opsPingCheck(p: OpsPing): CheckResult;   // ok→'ok'; unauthorized|unreachable→'fail'; off|unconfigured→'skip'
// GET /api/site-health body gains `ops: OpsPing` and `formBeacons: number`

// src/messages/{tr,en}.json — sys.form.* (identical key sets, asserted by src/messages/messages.test.ts):
// labels.{name,email,phone,company,city,country,sector,headcount,startWhen,roleNeeded,message,subject,iAm,preferredTime,cv,consent}
// placeholders.{name,email,phone,company,city,headcount,roleNeeded,message,subject,select}
// hints.{phone,cv,evidence,optional}
// errors.{required,email,phone,min,max,url,file,consent,captcha,invalid}
// consent.{label,notice,link}   (label/notice are rich: <link>…</link>)
// submit.{default,sending}  honeypot
// fallback.{captcha,off,tripped,unauthorized,unavailable,failed,invalid}.{title,body}
// fallback.{whatsapp,call,email,whatsappIntro,retry}
```

Page-side usage (the pattern every WP2b page follows; the kernel does not ship a page):

```ts
// src/app/[locale]/(site)/hire-workers/actions.ts
'use server';
import { z } from 'zod';
import { createFormAction, type FormActionState } from '@/forms/action';

const schema = z.object({
  name: z.string().min(1).max(120),
  company: z.string().min(1).max(200),
  email: z.string().min(1).max(254).email(),           // `.min(1)` first so an empty value reads 'required', not 'email'
  phone: z.string().min(1).regex(/(\D*\d){8,}/, { message: 'phone' }).max(40),
  message: z.string().max(5000).optional(),
});
const run = createFormAction({
  key: 'hire',
  schema,
  toFields: (p) => ({ name: p.name, company: p.company, email: p.email, phone: p.phone, message: p.message ?? '' }),
});
export async function submitHire(prev: FormActionState, data: FormData) {
  return run(prev, data);
}
```

```tsx
// inside the page (server component)
<FormShell action={submitHire} formKey="hire" locale={locale} turnstileSiteKey={bundle.settings.turnstileSiteKey}
  whatsappNumber={bundle.settings.whatsappNumber}
  contact={{ phone: bundle.settings.phone, phoneDisplay: bundle.settings.phoneDisplay, email: bundle.settings.email }}
  submitLabel={t('hire.063')}>
  <Field name="company" required autoComplete="organization" />
  <Field name="name" required autoComplete="name" />
  <Field name="email" type="email" required autoComplete="email" inputMode="email" />
  <Field name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
  <Field name="message" as="textarea" rows={4} />
</FormShell>
```

---

#### Cycle 1 — `consent.ts`, `wire.ts`, `errors.ts`, `types.ts`


**Produces — deviations:** (1) `src/forms/action.ts` is `import 'server-only'`, **not** a `'use server'` file — a `'use server'` module may export only async functions, so `createFormAction` (a sync factory) cannot live in one; each page wraps the returned function in its own `'use server'` module (snippet in Produces). (2) `FormShell`/`FallbackPanel` take `whatsappIntro?: string` instead of the skeleton's `whatsappText: (values) => string` — a function prop cannot cross the server→client boundary; the panel composes the text with `whatsappFallbackText(intro, values, label)`. (3) `FormShell` gains optional `contact`, `consent`, `initialState`, `submitLabel` (now optional, defaults to `sys.form.submit.default`) and `consentLinkHref` also accepts `'/kvkk'`; `FallbackPanel` gains optional `contact`. (4) Additions: `src/forms/errors.ts`, `src/forms/types.ts` (client-safe types/constants re-exported by `action.ts`), `src/forms/client/Field.tsx` (the field component pages use), `useFieldValue`, `postForm`'s optional 4th `deps` argument and the exported `ATTEMPT_TIMEOUT_MS`/`MAX_ATTEMPTS`, `FormSpec.toFields` may be async and receives the raw `FormData`, `FormSpec.consent`, `FormActionError`. (5) `formBeaconCount()` is exported from `src/app/api/form-beacon/state.ts`, not `route.ts` (Next's route type check refuses non-handler exports). (6) `OpsPing.state` adds `'unconfigured'` (no URL/token in this environment) beside the skeleton's four; `off` and `unconfigured` map to the `skip` check result, `unauthorized`/`unreachable` to `fail`. (7) The `sys.form.*` set adds `errors.invalid`, `consent.notice`, `hints.evidence`, `placeholders.select`, `fallback.whatsappIntro`, `fallback.retry`; `placeholders.*`/`hints.*` are the explicit key lists in Produces (the skeleton left them as `*`).


## ### Task 3: Chrome foundation — route groups, nav groups, per-page CTAs, 901 px header, contact-click analytics

Produces (copied from interfaces.md § T0c, chrome half, and completed)
```ts
// Route groups (W19) — src/app/[locale]/
//   (site)/layout.tsx     → <SiteChrome variant="default">; holds page.tsx, hire-workers/, [...rest]/, dev/, not-found.tsx, error.tsx
//                            and, in WP2b, every public page + careers/[slug] + blog/[slug]
//   (minimal)/layout.tsx  → <SiteChrome variant="minimal">; holds thank-you/ and, in WP2b, privacy/ terms/ kvkk/ cookie-policy/ newsletter/*
//   (bare)/layout.tsx     → no chrome, renders only <main id="main">{children}</main>; holds portal-login/ (T13)
//   The locale layout keeps html/body, Archivo, GtmLoader, site-wide JSON-LD, NextIntlClientProvider, ClientIslands, generateStaticParams.
//   A page's own `notFound()`/throw lands in its group's not-found/error boundary, so the chrome survives (R6 kept).

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
export function Header({ locale, bundle }: { locale: Locale; bundle: Bundle }): JSX.Element; // `primaryCta` prop REMOVED (W17)
// SiteChrome({ locale, bundle, variant?, children }) unchanged.

// src/design/chrome/nav.ts (server-safe)
export const BLOG_NAV_THRESHOLD = 6;                                     // W4: Turkish bodies needed before /blog joins any chrome list
export function blogNavVisible(bundle: Bundle): boolean;                 // counts bundle.collections.blog rows with hasBody.tr === true
export function navGroup(bundle: Bundle, group: NavItem['group'], t: (id: string) => string): ChromeNavItem[]; // sorted by order; /blog + /blog/[slug] dropped below the threshold

// src/lib/seo/routes.ts
export const NOINDEX_PATHNAMES = ['/thank-you', '/portal-login', '/newsletter/confirm', '/newsletter/unsubscribe', '/blog', '/blog/[slug]'] as const;
export function isNoindexPathname(href: keyof typeof pathnames): boolean;
export function noindexExternalPaths(locale: Locale): string[];         // localized, deduped; a dynamic key is covered by its parent ('/blog')
// (Task 4 adds UNBUILT_PATHNAMES and pageOgImageUrl to the same file — additive, below these.)

// src/analytics/useContactClick.ts (no directive; imported by client components only)
export const CONTACT_PLACEMENTS = ['slimbar', 'header', 'footer', 'social_rail', 'whatsapp_fab', 'bottom_bar', 'form_fallback', 'page_cta', 'office_card'] as const;
export type ContactPlacement = (typeof CONTACT_PLACEMENTS)[number];
export type ContactKind = 'call' | 'whatsapp' | 'email';
export function contactKindOf(href: string): ContactKind | null;        // tel: → call, mailto: → email, https://wa.me/ | https://api.whatsapp.com/ → whatsapp
export function useContactClick(placement: ContactPlacement): (kind: ContactKind) => void; // track('<kind>_click', { page (next/navigation usePathname, R35), locale (useLocale), placement })

// src/analytics/ContactLink.tsx ('use client') — the one anchor every tel:/mailto:/wa.me link in the chrome (and, in WP2b, pages/OfficeCard/FallbackPanel) renders through
export function ContactLink(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & { href: string; placement: ContactPlacement; children: ReactNode }): JSX.Element;

// src/design/primitives/Button.tsx — additive
export function buttonClassName(variant: ButtonVariant, size?: 'md' | 'lg', className?: string): string; // the exact class string <Button> renders; for callers that must render next-intl <Link> with an object href

// src/design/tokens.ts — additive
tokens.type.nav = { mobile: 13.5, desktop: 11, tablet: 12 };            // header links: authored / from 901 px (W11) / from 1101 px
tokens.layout.headerRowFrom = 901; tokens.layout.socialRailFrom = 1101;  // = breakpoint.lg / breakpoint.xl
// globals.css: `--fs-nav` (13.5px, 12px ≥901, 11px ≥1101) exposed as the `text-nav` utility via `@theme inline { --text-nav: var(--fs-nav) }`

// src/messages/{tr,en}.json — additive: sys.nav.legal ("Yasal" / "Legal") — aria-label of the footer's Privacy/Terms nav

// e2e/chrome.spec.ts — three cases (chrome variants, 404 inside chrome, 901/900 threshold + no overflow at 1100); width sweep gains 901.
```

---

#### Cycle 1 — Route groups (W19): `(site)` / `(minimal)` / `(bare)`, chrome leaves the locale layout


**Produces — deviations:** (1) `(bare)/layout.tsx` renders `<main id="main">{children}</main>` rather than a bare fragment, so R31's one-`<main>` guarantee stays with the layouts and the portal page (T13) does not render its own; (2) `PageCtas.secondary` is `CtaLink | null | undefined` (undefined inherits the default secondary, null removes it) and `CtaLink` gains optional `tailId`/`variant` — the skeleton's `{ labelId; href }` shape is a subset; (3) additive extras not in the skeleton: `resolveCtas`/`ctasFor`/`CtaTable`, `HeaderCtas`, `nav.ts` (`navGroup`, `blogNavVisible`, `BLOG_NAV_THRESHOLD`), `ContactLink`, `contactKindOf`, `isNoindexPathname`/`noindexExternalPaths` (robots consumes the latter instead of mapping `NOINDEX_PATHNAMES` directly, because `/blog/[slug]` is not a `getPathname` href), `buttonClassName`, `tokens.type.nav`/`tokens.layout.headerRowFrom`/`socialRailFrom`, `sys.nav.legal`; (4) `Header` loses its `primaryCta` prop (the skeleton says "resolves via usePathname", which makes the prop dead); (5) the `header` placement is enumerated but unused — every header CTA is an internal `Href`.


## ### Task 4: SEO foundation — OG image route, per-locale alternates, hreflang-aware language links, Article/JobPosting JSON-LD, sitemap/robots gating

Produces (frozen for WP2b — copy exactly):
```ts
// src/lib/seo/routes.ts (additions; SITE_URL/absoluteUrl/localeAlternates/NOINDEX_PATHNAMES unchanged)
export const UNBUILT_PATHNAMES: ReadonlySet<keyof typeof pathnames>;
//   W20. Initial set (19): '/hiring-cost-calculator', '/partner-with-us', '/work-permit', '/about',
//   '/verify', '/careers', '/careers/[slug]', '/contact', '/available-workers', '/success-stories',
//   '/blog', '/blog/[slug]', '/portal-login', '/privacy', '/terms', '/kvkk', '/cookie-policy',
//   '/newsletter/confirm', '/newsletter/unsubscribe'.
//   Each page task DELETES its own key(s) in the commit that adds the page — src/lib/seo/unbuilt.test.ts
//   walks src/app/[locale]/**/page.tsx (route groups stripped) and fails when the set and the
//   filesystem disagree in either direction. T15 asserts the set is empty.
export const OG_PAGE_KEYS: ReadonlySet<string>;
//   'site','home','hire','calc','wp','partner','about','contact','workers','stories','verify',
//   'careers','blog','portal','privacy','terms','kvkk','cookiePolicy','thankYou','newsletter'.
//   Every `pageKey` a page passes to buildMetadata and every key T0b writes into bundle.pages must
//   be in this set (add it here in the same commit if not); an unknown key renders the 'site' image.
export function pageOgImageUrl(locale: Locale, pageKey: string): string;
//   `${SITE_URL}/og/${locale}/${OG_PAGE_KEYS.has(pageKey) ? pageKey : 'site'}.png` — absolute.

// src/app/og/[locale]/[pageKey]/route.tsx — GET /og/{tr|en}/{pageKey}.png → 1200×630 image/png,
//   Node runtime, `export const revalidate = 86400`, Archivo Bold bytes from src/design/fonts.
//   Title = t(bundle.pages[pageKey].titleId) when the record exists, else sys.seo.<pageKey>.title
//   when that message exists, else 'JobsAdmire'; subline = t(descriptionId) else t('home.188').
//   404 for an unknown locale, a key outside OG_PAGE_KEYS, or a missing `.png` suffix.
//   The `.png` suffix is what keeps the URL out of proxy.ts's matcher (`.*\..*`) — no matcher change.

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
  pageKey: string;
  fallbackTitle: string;
  fallbackDescription: string;
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
  jobLocation: { city: string; country: string /* ISO-2 */ };
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
export function alternateHrefToPath(href: string | null): string | null;        // pathname+search, same host only
export function useAlternatePath(locale: Locale): string | null;               // null on the server and until hydrated
// LanguageSwitcher / LanguageHint: props unchanged. When useAlternatePath(l) returns a path they render a
// next/link anchor to that path (W17); otherwise the WP1 next-intl <Link href={alternatePath(pathname)} locale={l}> (R58).
```

---

- [ ] **Cycle 1 — `UNBUILT_PATHNAMES`, `OG_PAGE_KEYS`, `pageOgImageUrl`; sitemap + robots consume the set**


**Produces — deviations:**
1. `pageOgImageUrl` returns `…/og/{locale}/{pageKey}.png` — the route path is the skeleton's `src/app/og/[locale]/[pageKey]/route.tsx` unchanged, but the URL carries a `.png` suffix (stripped inside the handler) so it stays outside `proxy.ts`'s matcher without touching the matcher; `OG_PAGE_KEYS` is an added export (bounds the ISR cache; unknown keys → `site` in `pageOgImageUrl`, 404 in the route).
2. `buildMetadata.alternates` value type is `AlternateTarget = string | Exclude<Href, string>` (the skeleton said `string`): a string is an absolute URL or an already-localized external path; the object form is the typed dynamic `Href` — a bare `pathnames` key string is deliberately not accepted. `openGraph` override additionally accepts `images?: string[]`; `twitter.images` is set alongside.
3. `articleJsonLd` input adds optional `authorType?: 'Person' | 'Organization'`; `jobPostingJsonLd` adds optional `identifier?: string`; `employmentType` is the Google enum (`FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY | INTERN | OTHER`); `baseSalary.value` is `number | { min, max }` with `unitText`; invalid dates throw outside production and are omitted in production.
4. `LanguageSwitcher`/`LanguageHint` gain no props (W17: tag-read + `alternatePath` fallback); the tag-derived link renders through `next/link` (already-localized path), the fallback through next-intl's `Link` — a new file `src/design/chrome/use-alternate-path.ts` exports `readAlternateHref`, `alternateHrefToPath`, `useAlternatePath`.
5. `robots.ts` interprets "skip" (W20) as *do not name an unbuilt route* (NOINDEX minus UNBUILT) — a robots rule never points at a path that does not exist; the sitemap omits UNBUILT outright.
6. `next.config.ts` gains `outputFileTracingIncludes` for the OG route's font folder (belt-and-braces to the `join(process.cwd(), …)` tracer pattern); nothing else in the config changes.


## ### Task 5: Primitive extensions + shared blocks + `formatDate`

Produces (the WP2b pages rely on exactly these)

```ts
// src/lib/format/date.ts
export function formatDate(iso: string, locale: Locale): string;        // TR '12 Ocak 2026', EN '12 January 2026'
export function formatMonth(iso: string, locale: Locale): string;       // TR 'Ocak 2026', EN 'January 2026'
export function formatReadMinutes(n: number, locale: Locale): string;   // sys.readMinutes ICU: EN '5 min read', TR '5 dk okuma' (server-side only)
export function formatWeekdays(days: number[], locale: Locale): string; // ISO 1=Mon…7=Sun (0 accepted as Sunday): [1..5] → 'Pzt–Cum' / 'Mon–Fri'; non-contiguous → 'Mon, Wed, Fri'

// src/messages/{tr,en}.json — new sys keys (both files)
sys.readMinutes        // ICU plural on {n}
sys.nav.breadcrumbs    // 'Sayfa yolu' / 'Breadcrumb' (nav aria-label)
sys.office.hours       // '{days} · {open}–{close}'

// src/design/primitives (extended)
export function Section(p: { tone: 'light' | 'dark' | 'pale' | 'band'; id?: string; className?: string; children?: ReactNode }): JSX.Element;
//   light = bg-white text-ink py-16 · dark = bg-navy text-white py-16 · pale = bg-pale-1 text-ink py-16 · band = bg-white text-ink py-10 (hosts one full-width card)
export function Stat(p: { value?: number; text?: string; prefix?: string; suffix?: string; label: string; locale: Locale; tone?: 'light' | 'dark' }): JSX.Element | null;
//   `text` wins over `value` (rendered verbatim, no count-up); neither → null (W1 hidden metric)
export type TimelineStep = { when?: string; title: string; body: string };
export function Timeline(p: { steps: TimelineStep[]; variant?: 'vertical' | 'horizontal' }): JSX.Element; // <ol data-variant=…>
export function Tabs(p: { tabs: TabItem[]; defaultId: string; onChange?: (id: string) => void }): JSX.Element;
export type RadioChipOption = { value: string; label: string };
export function RadioChips(p: { name: string; options: RadioChipOption[]; value: string | null; onChange: (value: string) => void; legend: string; legendHidden?: boolean; className?: string }): JSX.Element;
//   'use client'; <fieldset role="radiogroup"> of native radios (arrow keys, form submission under `name`), chip-styled labels
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse'; // inverse = white outline for dark bands

// src/design/chrome/StickyCtaBar.tsx
export const STICKY_CTA_HEIGHT_VAR = '--sticky-cta-h';
export function isBarVisible(scrollY: number, showAfterPx: number, targetTop: number | null, viewportHeight: number): boolean;
export function StickyCtaBar(p: { message: string; ctas: StickyCta[]; showAfterPx?: number; hideNearId?: string; live?: boolean }): JSX.Element | null;
//   W18: publishes its rendered height as `--sticky-cta-h` on <html> while visible, '0px' otherwise; LanguageHint + WhatsAppFab add var(--sticky-cta-h,0px) to their bottom offset

// src/design/blocks (barrel: src/design/blocks/index.ts) — server components unless marked
export type Cta = { label: string; href: string; external?: boolean; variant?: ButtonVariant };
export type PageContactPlacement = 'page_cta' | 'office_card';
export function isContactHref(href: string): boolean; // tel: | mailto: | https://wa.me/
export function ContactCta(p: ButtonProps & { placement: PageContactPlacement; href: string }): JSX.Element; // 'use client' — Button + useContactClick

export type FaqItem = { id: string; q: string; a: string };                    // q/a already resolved through t()
export type FaqAskCard = { titleId: string; bodyId: string; whatsappNumber: string; whatsappText: string; whatsappLabelId: string; phone?: string; callLabelId?: string };
export function FaqBlock(p: { bundle: Bundle; items: FaqItem[]; id?: string; eyebrowId?: string; headingId?: string; bodyId?: string; askCard?: FaqAskCard; singleOpen?: boolean; openFirst?: boolean; headingLevel?: 2 | 3 | 4; footer?: ReactNode }): JSX.Element;
//   two-column (side sticky from lg) + Accordion + <JsonLd data={faqJsonLd(items)}/>

export type Crumb = { name: string; href: Href };                              // every crumb incl. the current page carries its href (JSON-LD needs the url)
export function Breadcrumbs(p: { locale: Locale; items: Crumb[]; tone?: 'light' | 'dark'; className?: string }): JSX.Element;
//   <nav aria-label={sys.nav.breadcrumbs}><ol>…</ol></nav>, last item aria-current="page" (text, not a link), + <JsonLd data={breadcrumbJsonLd(…absoluteUrl…)}/>

export function ClosingCtaBand(p: { bundle: Bundle; titleId: string; bodyId?: string; primary: Cta; secondary?: Cta; extra?: Cta[]; ticks?: string[]; tone?: 'navy' | 'gradient' | 'green'; id?: string }): JSX.Element;
//   dark rounded card; contact hrefs render through ContactCta placement 'page_cta'; `ticks` render `md:hidden` (design's mobile-only ticks, W10)

export type ProcessStep = { n: number; titleId: string; bodyId: string; when?: string }; // `when` is a resolved string (the page reads its id)
export function ProcessSteps(p: { bundle: Bundle; steps: ProcessStep[]; variant?: 'cards' | 'plain'; id?: string; headingLevel?: 3 | 4 }): JSX.Element;
//   numbered dots on a vertical gradient rail, last step green; cards = Hire Workers' boxed rows, plain = Homepage/Contact rows

export function MetricStrip(p: { bundle: Bundle; locale: Locale; metrics: MetricKey[]; tone?: 'light' | 'dark'; className?: string }): JSX.Element | null;
//   reads the `metrics` collection; a key with value=null & text=null, or labelId=null, is skipped (W1); all skipped → null

export type Office = ReturnType<typeof getOffice>;
export function OfficeCard(p: { bundle: Bundle; locale: Locale; office: Office; children?: ReactNode }): JSX.Element;
//   city (cityId) + kind label (hq → contact.099, sourcing → contact.104) + address + hours (sys.office.hours over formatWeekdays) + tel/WhatsApp/mail (ContactCta 'office_card') + directions (home.192, mapUrl); `children` = the page's live-status pill / note

export type BlogPost = z.infer<(typeof CollectionSchemas)['blog']>;
export function PostCard(p: { bundle: Bundle; locale: Locale; post: BlogPost; variant?: 'card' | 'row' | 'featured'; categoryLabel?: string; cover?: ReactNode; headingLevel?: 2 | 3 }): JSX.Element;
//   Card as="article"; title = Link to {pathname:'/blog/[slug]', params:{slug: post.slug[locale]}}; meta = formatDate · formatReadMinutes; alt-language pill (blog.081 on TR, blog.077 on EN) when post.hasBody[other]; cover slot carries data-placeholder when no cover is given (D26 counter)

export function NewsletterBand(p: { bundle: Bundle; active: boolean; id?: string; children?: ReactNode }): JSX.Element | null;
//   active=false (Phase A, W5) → null; active=true → band chrome (blog.036/037/038) + {children} (the page's FormShell)

export function StoreBadges(p: { bundle: Bundle; android: string | null; ios?: string | null; tone?: 'dark' | 'light' }): JSX.Element | null;
//   Google Play badge (hire.240) when android; App Store (hire.241) only when ios is a string (W8: null today); both null → null

export type Logo = { src: string; alt: string; width: number; height: number };
export function LogoMarquee(p: { logos: Logo[]; durationSec?: number; className?: string }): JSX.Element | null; // [] → null; else PausableMarquee of next/image logos with sys.marquee labels
```

---

#### Cycle 1 — `formatDate` / `formatMonth` / `formatReadMinutes` / `formatWeekdays` + the three sys keys


**Produces — deviations:** (1) every id-taking block (`FaqBlock`, `ClosingCtaBand`, `ProcessSteps`, `MetricStrip`, `OfficeCard`, `PostCard`, `NewsletterBand`, `StoreBadges`) takes a required `bundle: Bundle` — the skeleton listed ids without a resolver; this is the chrome's own pattern (`makeT(bundle)`). (2) `FaqBlock` takes no `locale` (nothing in it is locale-dependent; the JSON-LD text is the already-localised items) and its ask card gains `whatsappText` + `whatsappLabelId` (+ optional `phone`/`callLabelId`) because a WhatsApp link needs a prefill and a label. (3) `ProcessSteps.variant` is `'cards' | 'plain'` (the skeleton left it untyped); `ProcessStep.when` is a resolved string. (4) `Breadcrumbs` items are `{ name; href: Href }` with the current page included (the JSON-LD needs its URL) and it takes `locale`. (5) `NewsletterBand` is `{ bundle; active; id?; children? }` — the page mounts its own `<FormShell>` as `children` because the server action is created per page (T0a `createFormAction`); `active={false}` is the Phase A door (W5). (6) `StoreBadges` types `ios?: string | null` (renders it only when a URL exists) and takes `bundle` for `hire.240/241`. (7) `LogoMarquee` logos are `{ src; alt; width; height }` (next/image needs dimensions) and it reads `sys.marquee.*` itself. (8) `Stat` gains `tone?: 'light' | 'dark'`; `StickyCtaBar` gains `live?: boolean` and exports `isBarVisible`/`STICKY_CTA_HEIGHT_VAR`; `Button` gains the `inverse` variant; `RadioChips` gains `legendHidden?`/`className?`; `formatWeekdays` is an extra export of `date.ts`. (9) `ContactCta` assumes T0c's `useContactClick(placement)` returns a `MouseEventHandler<HTMLElement>`; if Task 3 landed another shape, `src/design/blocks/ContactCta.tsx` is the only file to adapt.


## ### Task 6: Client islands + build-time assets (T0d, last two bullets)

Produces (the WP2b pages and Task 5's blocks rely on these — exact names, paths, signatures)

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
export { ProgressBar, type ProgressBarProps, type ProgressTone } from './ProgressBar';   // no hooks: usable from server components too
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

// src/design/chrome/icons.tsx — additive
export function XIcon(props: IconProps): JSX.Element; export function LinkIcon(props: IconProps): JSX.Element;

// src/design/assets/source-map-codes.ts
export const SOURCE_MAP_CODES = ['pk','np','in','uz','kg','tm','ph','id','ru','ml','sn','cm','lk'] as const;   // W1: source-map.js's 12 + LK
export type SourceMapCode = (typeof SOURCE_MAP_CODES)[number];
export const SOURCE_MAP_POINTS: Record<SourceMapCode, { lon: number; lat: number; atlasId: string }>;   // design coordinates + world-atlas numeric id
export const TURKIYE_POINT: { lon: 35.2; lat: 39; atlasId: '792' };

// src/design/assets/source-map.ts  (what pages import: `import { SourceMap } from '@/design/assets/source-map'`)
export { SourceMap, SOURCE_MAP_MARKERS, SOURCE_MAP_VIEWBOX, type SourceMapProps } from './source-map.generated';
export { SOURCE_MAP_CODES, type SourceMapCode } from './source-map-codes';
//   SourceMap({ title, labels: Record<SourceMapCode, string>, id = 'source-map', className? })  — server component, inline <svg viewBox="0 0 640 397" role="img">;
//     every marker <g data-country="<code>"> carries <title>{labels[code]}</title>; Türkiye marker data-country="tr"; arcs dash in, dots pulse (CSS, reduced-motion + print safe)
//   SOURCE_MAP_MARKERS: Record<SourceMapCode | 'tr', { x: number; y: number }>;  SOURCE_MAP_VIEWBOX = { width: 640, height: 397 }

// src/design/assets/flag-codes.ts
export const FLAG_CODES = [...SOURCE_MAP_CODES, 'tr'] as const;  export type FlagCode = (typeof FLAG_CODES)[number];
// src/design/Flag.tsx (no hooks — server or client)
export function Flag({ code: FlagCode, size = 20, label?: string, className? }): JSX.Element   // <svg><use href="/brand/flags.svg#flag-<code>"/></svg>, 4:3, decorative unless label

// src/lib/qr.ts (pure, no 'server-only' so it is unit-testable; call it from server components only — QrCode.tsx is the door)
export type QrOptions = { size?: number; margin?: number; dark?: string; light?: string | null; label?: string };
export function qrSvg(text: string, options?: QrOptions): string   // deterministic <svg …> string, ECC M, `qrcode` package, no client JS
// src/design/QrCode.tsx ('server-only')
export function QrCode({ text, label, size = 86, className? }): JSX.Element

// src/design/assets/brand.ts
export const BRAND = {
  mark:       { src: '/brand/ja-mark.png',    width: 336, height: 285 },
  logo:       { src: '/brand/logo.png',       width: 742, height: 146 },   // JobsAdmire's own logo, fetched once from the live site
  iskur:      { src: '/brand/iskur.png',      width: 320, height: 320 },   // the İŞKUR licence mark the live site already displays
  googlePlay: { src: '/brand/google-play.svg', width: 24, height: 24 },   // the design's inline Play glyph; W8: no App Store file
  flags: '/brand/flags.svg',
} as const;

// package.json scripts
"assets:map":   "tsx scripts/build-source-map.ts"   // regenerates src/design/assets/source-map.generated.tsx
"assets:flags": "tsx scripts/build-flags.ts"        // regenerates public/brand/flags.svg from the flag-icons devDependency
"assets:brand": "bash scripts/fetch-brand.sh"       // one-time fetch of logo.png + iskur.png (committed; never runs in the build)

// CSS (src/app/globals.css): .source-map__arc / .source-map__pulse animations with @media print end-states;
//   body.print-isolating + .print-isolate / .print-hidden print isolation
```

---

#### Cycle 1 — form-control islands: `RangeSlider`, `Stepper`, `TriState`, `ProgressBar`


**Produces — deviations:**
(1) `public/brand/logo.png` + `iskur.png` (raster, fetched once from the company's own live site) instead of `logo.svg`/`logo-white.svg`/`iskur.svg` — no vector exists anywhere in the package or on the live site; the SVGs (and the white variant) become an owner ask recorded in ARCHITECTURE § Assets, and dark surfaces keep the chrome's `ja-mark.png` + HTML wordmark. (2) `google-play.svg` is the design's inline Play **glyph** (24×24), not a full badge bitmap — `StoreBadges` composes the badge from hire.240/241 per W7. (3) Additions beyond the skeleton: `useScrollProgress` hook, `ProgressBar.valueText` (page-formatted, D18), `Dialog.variant`, `XIcon`/`LinkIcon`, `src/design/assets/{source-map-codes,flag-codes,brand}.ts`, `src/design/assets/source-map.ts` as the import door, `src/design/QrCode.tsx`, `assets:brand` script, `.gitattributes`. (4) `src/lib/qr.ts` has no `server-only` import (so it is unit-testable, like `content/pure.ts` under R2); `QrCode.tsx` carries it. (5) `SourceMap` takes `labels` + `title` + optional `id` (the skeleton listed only "inline SVG server component … data-country").


## ### Task 7: Gate tooling — one route list, launch profile, JS ceiling, page-contract specs, pixel harness (T0e)

Produces (copied from interfaces.md § T0e and completed)
```ts
// e2e/routes.ts — the single gate route list (W21). Page tasks append here and nowhere else.
export type GateRoute = { path: string; indexable: boolean };
export const GATE_ROUTE_TABLE: readonly GateRoute[];   // both locales, every route as pages land
export const GATE_ROUTES: readonly string[];            // every path (axe, width sweep, placeholder counter)
export const INDEXABLE_GATE_ROUTES: readonly string[];  // indexable paths (Lighthouse, SEO spec, sitemap membership)

// scripts/gate-routes.mjs — `node scripts/gate-routes.mjs [--all] [--json]`
//   stdout: INDEXABLE_GATE_ROUTES one per line (default) | GATE_ROUTES with --all | JSON array with --json

// scripts/gate.sh — `npm run gate` | `npm run gate:launch` (= `bash scripts/gate.sh --profile=launch`)
//   default: playwright → lhci collect over `node scripts/gate-routes.mjs` → upload → assert → `node scripts/js-size.mjs`
//   launch : + `npx vitest run --config vitest.launch.config.mts` (UNBUILT_PATHNAMES empty, W20)
//            + `npx tsx scripts/placeholder-count.ts` (content-readiness table, D26)

// lighthouserc.json + lighthouserc.local.json
//   "resource-summary:script:size": ["error", { "maxNumericValue": 204800 }]   // W13 amended

// scripts/js-size.mjs — `node scripts/js-size.mjs [--dir=.lighthouseci]`
export const SCRIPT_CEILING = 204_800; export const LAZY_LINE = 194_560;
export type JsSizeRow = { path: string; runs: number; scriptBytes: number; headroomBytes: number; lcpMs: number | null; performance: number | null; overLazyLine: boolean; overCeiling: boolean };
export function summarizeLhrs(lhrs: unknown[]): JsSizeRow[];
export function formatJsSizeTable(rows: JsSizeRow[]): string;   // markdown, pasted into the ledger

// scripts/placeholder-count.ts — `npx tsx scripts/placeholder-count.ts` (E2E_BASE_URL required)
export type PlaceholderScan = { placeholders: string[]; lcpSlots: string[]; both: string[] };
export type RouteVerdict = { route: string; status: number | null; placeholders: string[]; lcpSlot: string | null; problems: string[] };
export function scanPlaceholders(html: string): PlaceholderScan;                 // pure; ignores <script> and comments
export function evaluateScan(route: string, status: number | null, scan: PlaceholderScan): RouteVerdict;
export function formatReadinessTable(verdicts: RouteVerdict[]): string;
// Page markup contract (every WP2b page): <h1 data-testid="page-h1">; the LCP element carries
// data-lcp-slot="<slot>" (hero <img> when the photo ships, else the h1 with "h1"); every image slot rendered
// without its asset carries data-placeholder="<design slot id>" — never on the LCP element (D26).

// scripts/launch/unbuilt-routes.launch-check.ts + vitest.launch.config.mts — launch profile only
//   asserts [...UNBUILT_PATHNAMES] equals [] (W20)

// scripts/pixel-compare.ts — `npm run pixel -- --page=home|hire|calc|blog-article [--locale=tr|en] [--base=<url>] [--route=<path>] [--widths=390,900,1440]`
export const PIXEL_WIDTHS: readonly [390, 900, 1440];
export type PixelLocale = 'tr' | 'en'; export type PixelPageKey = 'home' | 'hire' | 'calc' | 'blog-article';
export const PIXEL_PAGES: Record<PixelPageKey, { design: string; route: Record<PixelLocale, string> | 'blog' }>;
export function resolvePixelRoute(page: PixelPageKey, locale: PixelLocale, bundle: PixelBundle | null, override?: string | null): string;
export function comparePngs(design: PNG, built: PNG): { diff: PNG; width: number; height: number; diffPixels: number; match: number };
//   writes .pixel/<page>-<locale>-<w>.png (diff), .pixel/<page>-<locale>-<w>-design.png, .pixel/<page>-<locale>-<w>-built.png
//   and merges { [`${page}-${locale}`]: { base, generatedAt, results: [{ width, designHeight, builtHeight, diffPixels, match }] } } into .pixel/report.json

// package.json scripts: "gate", "gate:launch", "pixel", "js-size" (+ existing "content:import"; "assets:map" is T0d's)
```

---

- [ ] **Cycle 1 — One route list (W21): `e2e/routes.ts` table, `scripts/gate-routes.mjs`, `gate.sh` consumes it**


**Produces — deviations:** (1) `e2e/routes.ts` adds `GATE_ROUTE_TABLE` (`{ path, indexable }`) as the authored source; `GATE_ROUTES` and `INDEXABLE_GATE_ROUTES` are derived from it (both `readonly string[]`, source-compatible with the a11y/width-sweep imports). (2) Pixel output files carry the locale: `.pixel/<page>-<locale>-<w>.png` (diff) plus `-design.png`/`-built.png` siblings, and `report.json` is keyed `<page>-<locale>` — the skeleton's `<page>-<w>.png` had no locale axis; `--locale` defaults to `tr`, so `npm run pixel -- --page=home` still works as written. (3) The `UNBUILT_PATHNAMES`-empty check is a Vitest file under a launch-only config (`scripts/launch/unbuilt-routes.launch-check.ts` + `vitest.launch.config.mts`) rather than a `tsx` script, because `src/lib/seo/routes.ts` imports next-intl's navigation build, which only the Vitest resolver is proven to load outside Next (R19). (4) An extra `npm run js-size` alias and `scripts/js-size.mjs` exports (`summarizeLhrs`, `formatJsSizeTable`, `SCRIPT_CEILING`, `LAZY_LINE`) are additive. (5) The e2e rewrite asserts no package-id h1 text (the skeleton's "h1 text from the package ids"): W1 re-authors metric strings with `{token}` placeholders through the importer, so a literal-text assertion would break at T0b; the specs instead require exactly one `h1[data-testid="page-h1"]` with non-empty copy and no leaked `{token}`/`undefined`.


## ### Task 8: Operations catalog extension — catalog v1.1 (`city`, `partner.track`, `contact.topic`, `careers.portfolioUrl`)

- Produces (the T0f skeleton from `interfaces.md`, completed — this is the wire contract WP2b's forms and T14's `docs/INTEGRATIONS.md` I4 table rely on):
  - `apps/backend/src/modules/website/website-form-catalog.ts`:
    - `export type WebsiteFieldType = 'text' | 'email' | 'phone' | 'iso2' | 'enum' | 'url' | 'key' | 'array-of-key';` (adds `'url'`: http(s) only, a host containing a dot, no credentials; `https://` is prepended when the scheme is missing; the length cap applies to the value as typed).
    - `export const PARTNER_TRACK_VALUES = ['sourcing', 'institute'] as const;`
    - `export const CONTACT_TOPIC_VALUES = ['hire', 'partner', 'permit', 'job', 'other'] as const;`
    - New OPTIONAL fields inside `fields` (exact wire names): `city?: string` (≤120) on `hire`, `workers`, `partner`, `callback`, `contact` (`careers` keeps its own older `city` ≤100); `track?: 'sourcing' | 'institute'` on `partner`; `topic?: 'hire' | 'partner' | 'permit' | 'job' | 'other'` on `contact` (exact match, lower-case; `callback.topic` stays free text ≤200); `portfolioUrl?: string` (≤500 as typed) on `careers`.
    - Rejection reasons (in the 400's `errors[]`): `city is too long (max 120)`; `track must be one of sourcing, institute`; `topic must be one of hire, partner, permit, job, other`; `portfolioUrl must be a web address`; `portfolioUrl is too long (max 500)`. A stray `track`/`topic`/`portfolioUrl` on any other form is dropped, never an error.
  - `apps/backend/src/modules/website/handlers/website-inquiry.logic.ts` (`buildWebsiteInquiryDto` output): `messagePreview` first line = `[website:<formKey>]`, or `[website:<formKey>:<track>]` when `fields.track` is present (partner); second line = `subject: [<topic>] <subject>` when the form is `contact` and a topic and/or subject is present (`subject: [job]` alone when the visitor typed no subject); then one `<key>: <value>` line per remaining non-identity field, `city` included (`city: Antalya`). `classification` unchanged: partner → `SOURCING_PARTNER` for both tracks, contact → `iAm` or none.
  - `apps/backend/src/modules/website/handlers/careers-apply.logic.ts`: `export const PORTFOLIO_LINE_PREFIX = 'Portfolio: ' as const;` and `buildPublicApplyDto` sets `coverLetter = [coverLetter, 'Portfolio: <url>'].join('\n\n')` (the URL as the LAST paragraph; scheme added if missing; nothing else on the DTO changes; `DROPPABLE_APPLY_FIELDS` unchanged).
  - Docs: PRD §5.12 "Catalog v1.1 (2026-09-20, WP2 T0f, website ruling W16)" field table + gotcha, §12.2 changelog entry — pinned by `website-docs-guard.spec.ts`.
  - Unchanged and asserted: `PERMISSION_KEYS_HASH`, `WEBSITE_FORM_KEYS`, `schema.prisma`, `WebsiteFormSubmitDto`, `CreateInquiryDto`, `PublicApplyDto`, the `portfolioRequired` gate.

---

#### Step 0 — branch (run once, before Cycle 1)

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
git status --short                        # must print nothing (the worktree is clean; 6de20cb is COMMITTED on website/wp3a-intake and stays there)
git fetch origin
git switch -c website/catalog-ext origin/main
git log --oneline -1                      # 7ea2a93 fix(website): subscriber purge repeats the read predicate on the delete (final re-review nit)
```

Cherry-pick nothing: `6de20cb` (the WP3a gate record) touches only `docs/superpowers/plans/2026-09-19-wp3a-gate-record.md` and is not part of this change; it is pushed with the WP3a branch by its own session. The Mac memory rule applies throughout: one jest/tsc job at a time, `--maxWorkers=2`, no Docker build while jest runs.

---

#### Cycle 1 — `city` (≤120) on hire, workers, partner, callback, contact


**Produces — deviations:**
1. `portfolioUrl` is realised as a NEW catalog field type `url` (`WebsiteFieldType` gains `'url'`; http(s) only, host with a dot, no credentials, `https://` prepended when missing, cap on the value as typed) rather than a `text` + `pattern` — interfaces.md said "url ≤500" without fixing the mechanism. `linkedinUrl` is deliberately NOT retyped (a junk LinkedIn value stays a dropped optional, never a 400).
2. `portfolioUrl` is stored as the LAST paragraph of `coverLetter` (`Portfolio: <url>`) — there is no applicant column and no migration is allowed; `PublicApplyDto` is untouched. **The `Opening.portfolioRequired` gate in `CareersPublicService.apply()` is NOT relaxed**, so W16's stated purpose ("so portfolio openings can be applied to") is only half met: a portfolio-required opening still returns `status: 'FAILED'` + `error: 'This position requires at least one portfolio document'` (HTTP 200) through the door. Making a URL satisfy that gate is a hiring-policy change to careers-public (PRD §5.4/§6.5 owner rule: "≥ 1 portfolio document") and needs an owner yes; the recipe, if granted, is ~6 lines in a follow-up task — `PublicApplyDto.portfolioUrl?: string` (`@IsOptional() @Trim() @IsUrl({ require_protocol: true }) @MaxLength(500)`), `apply()` line 618 → `if (opening.portfolioRequired && portfolio.length === 0 && !dto.portfolioUrl)`, `apply()` folding the line into `coverLetter` itself instead of the website handler, PRD §5.4 lines 1361/4389/4813 amended. Until then the website (T11 Careers) keeps W3's "apply by e-mail" branch for `portfolioRequired` openings and sends `portfolioUrl` on the others.
3. "`topic` maps to `subject` prefix" is realised inside `messagePreview` as `subject: [<topic>] <subject>` (first line after the tag) — `Inquiry` has no `subject` column; `callback.topic` (older, free text) is untouched. "`track` prefixed in `messagePreview`" is realised as the tag `[website:partner:<track>]`.
4. The enum fields `track`/`topic` carry `max: 40` like `iAm` (a 41-char value reports `too long`, a wrong value reports the enum message).
5. The Operations repo has no `npm run verify`; Step 4s use its `CLAUDE.md` equivalents (`npm run type-check`, `npx eslint src/modules/website --ext .ts`, `npx jest <paths> --maxWorkers=2`).
