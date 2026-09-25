### Task 2: Forms kernel — `src/forms/` (postForm, envelope, server-action factory, upload helpers, FormShell/Field/Turnstile/FallbackPanel islands, beacon, Ops ping, `sys.form.*` copy)

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website` (branch `wp2/foundation`, after Task 1's commits; `main @ ad58fb8` underneath). Every path below is relative to that root. Rulings applied: **W3** (the door wins; one immediate retry on network/timeout/5xx, 8 s total, then the D11 fallback panel — supersedes ARCHITECTURE.md's "not a retry queue / immediate panel"), **W9/W23** (all form copy under `sys.form.*` in both message files, never a package id), **W12** (`whatsapp_click`/`call_click`/`email_click` with `placement: 'form_fallback'`), **W13 amended** (client islands stay small, the Turnstile script never loads in the initial audit, Zod never enters the browser), **W29** (upload helpers `src/forms/uploads.ts`), **W30** (a `sys.form.labels.*` entry for every catalog field name; `Field` requires `label` otherwise), **W44** (`PostFormOk`/`PostFormResult`/`PostFormVisitor` live in `types.ts`, `post.ts` imports them), **W45** (doc edits anchor on sentences, never line numbers; Task 4 appends to this task's PRD wording, Task 3 to its ANALYTICS wording), **W46** (the Ops PRD §5.12 corrections are Task 8's, not a hand-off from here). WP1 rulings honoured: R22/R17 (Button href branches), R35 (analytics `page` = `next/navigation`'s `usePathname`), R55 (`FormKey`-typed redirect key), R56 (nothing imports `design-package/**` or `src/content/local/*`), R23 (client-safe modules never import the adapter), R2 (`server-only` stays a build-time guard; Vitest gets an empty stand-in).

**Why this shape (read before coding):**

- `src/forms/action.ts` is **not** a `'use server'` file. A `'use server'` module may only export async functions; a factory that returns a function fails Next's server-entry check. `createFormAction(spec)` is therefore `import 'server-only'` and each page wraps it in its own `'use server'` file (the exact page-side snippet is in **Produces**). This is the one structural deviation from `interfaces.md` § T0a and is repeated in the deviations line.
- A **function cannot cross the RSC boundary**, so `FormShell`'s skeleton prop `whatsappText: (values) => string` becomes `whatsappIntro?: string` (defaults to `sys.form.fallback.whatsappIntro`); the panel composes the WhatsApp text itself from the echoed values and `sys.form.labels.*`.
- Pages' fields must read the server's field errors and echo the typed values (React 19 resets an uncontrolled `<form action>` after the action resolves). `FormField` (WP1) is a render-prop server-side primitive and cannot read a client context, so this task adds one client wrapper, `src/forms/client/Field.tsx`, that pages use for every input; it renders `FormField` with `useFieldError(name)` / `useFieldValue(name)`. Per **W30** its label comes from `sys.form.labels.<name>` and a name without an entry must pass `label` — a raw field name is never shown (dev/test throw, production degrades to the name with a console error).
- Everything the client needs (`FormActionState`, the field-name constants, `IDLE_FORM_STATE`, the two error classes, and — per **W44** — `PostFormOk`/`PostFormResult`/`PostFormVisitor`) lives in `src/forms/types.ts` (client-safe, no runtime imports); `post.ts`, `action.ts` and `uploads.ts` import from it, never the other way round, so no client file ever pulls a `server-only` module and every cycle's commit type-checks on its own.
- `server-only` is a compiler-level marker: there is no top-level `node_modules/server-only` package here — Next ships `next/dist/compiled/server-only` (whose default export condition throws) and aliases the bare specifier at build time, and `next/types/global.d.ts` (reached through `next-env.d.ts`) declares the module for `tsc`. Vitest sees neither, so `vitest.config.mts` aliases `server-only` to an empty module (`src/test/server-only.ts`), exactly as R2 intends: the guard is enforced by the Next build, and the server modules are unit-tested as plain functions.
- The Turnstile script is third-party JavaScript that Lighthouse's `resource-summary:script:size` counts. Per **W13 amended** it loads on the visitor's **first interaction** with the form (`focusin`/`pointerdown`), never on page load and never through `next/script lazyOnload` (which fires at `load`, inside the audit trace). A visitor who submits faster than the script loads gets a `captcha` panel with "try again"; the second submit carries a token.

**Files:**

Create:

- `src/forms/consent.ts`
- `src/forms/wire.ts`
- `src/forms/errors.ts`
- `src/forms/types.ts`
- `src/forms/env.ts`
- `src/forms/post.ts`
- `src/forms/action.ts`
- `src/forms/uploads.ts`
- `src/forms/client/FormErrorsContext.tsx`
- `src/forms/client/Field.tsx`
- `src/forms/client/Turnstile.tsx`
- `src/forms/client/FallbackPanel.tsx`
- `src/forms/client/FormShell.tsx`
- `src/forms/__tests__/wire.test.ts`
- `src/forms/__tests__/errors.test.ts`
- `src/forms/__tests__/post.test.ts`
- `src/forms/__tests__/action.test.ts`
- `src/forms/__tests__/uploads.test.ts`
- `src/forms/__tests__/Field.test.tsx`
- `src/forms/__tests__/Turnstile.test.tsx`
- `src/forms/__tests__/FallbackPanel.test.tsx`
- `src/forms/__tests__/FormShell.test.tsx`
- `src/messages/messages.test.ts`
- `src/test/server-only.ts`
- `src/app/api/form-beacon/route.ts`
- `src/app/api/form-beacon/state.ts`
- `src/app/api/form-beacon/beacon.test.ts`
- `src/app/api/site-health/ops.ts`
- `src/app/api/site-health/ops.test.ts`

Modify:

- `vitest.config.mts` (the `resolve.alias` object: add the `server-only` entry after `'@'`)
- `src/messages/tr.json`, `src/messages/en.json` (add the `form` object after `thankYou`, inside `sys`)
- `src/app/api/site-health/route.ts` (wire `pingOps`, add `ops` + `formBeacons` to the body)
- `.env.example` (add `OPS_WEBSITE_TEST_TOKEN` after `OPS_WEBSITE_WRITE_TOKEN=`)
- `docs/DEPLOYMENT.md`, `docs/ARCHITECTURE.md`, `docs/INTEGRATIONS.md`, `docs/PRD.md`, `docs/OPERATING.md`, `docs/CONTENT-MODEL.md`, `docs/ANALYTICS.md`, `CLAUDE.md` (sentence-anchored edits, Cycle 8)

Test:

- `npx vitest run src/forms src/messages src/app/api`
- `npm run verify`

Formatting rule for every cycle: before Step 4, run `npx prettier --write <the files of the cycle>` and commit Prettier's output — the code below is written to Prettier's config (`printWidth: 100`, single quotes, trailing commas) but Prettier's result is the committed form, so `npm run format` is green at every commit.

**Interfaces:**

Consumes (WP1, as built — verified against `main @ ad58fb8`):

- `FORM_KEYS`, `type FormKey`, `asFormKey` — `src/analytics/forms.ts`
- `track(event: EventName, params: Partial<Record<string, string | number>>)` — `src/analytics/track.ts` (`call_click`/`whatsapp_click`/`email_click` allow `page`, `locale`, `placement`)
- `waLink(number, text)`, `telLink(phone)`, `mailLink(email, subject?)` — `src/lib/contact.ts`
- `Button`, `FormField` — `src/design/primitives` (Button: `variant: 'primary' | 'secondary' | 'ghost' | 'danger'` required, `size?: 'md' | 'lg'`, props extend `HTMLAttributes<HTMLElement>` so `onClick` passes through; `href` starting with `/` → next-intl `Link`; `https://wa.me/…`/`tel:`/`mailto:` → same-tab anchor; `external` → new tab; `disabled` → `<button>`. FormField: `{ id; label; hint?; error?; required?; children: (p: { id; 'aria-describedby'?; 'aria-invalid'?; 'aria-required'? }) => ReactNode }`, error rendered as `<p id="<id>-error" role="alert">`, label text is `label` + `" *"` when required)
- `Link`, `redirect` — `@/i18n/navigation` (`redirect({ href: { pathname, query }, locale })` throws `NEXT_REDIRECT`); `routing`, `type Locale` — `@/i18n/routing`
- `evaluate`, `type CheckResult`, `type Checks` — `src/app/api/site-health/checks.ts`; `lastRevalidateAt` — `src/app/api/revalidate/state.ts`
- `renderWithIntl(ui, { locale?, messages? })` — `src/test/render.tsx`
- `bundle.settings.{whatsappNumber, phone, phoneDisplay, email, turnstileSiteKey}` — `contract/website-bundle.v1.ts` `SettingsSchema` (`turnstileSiteKey: string | null`; pages read these and pass strings down)
- Operations door, as built on `website/wp3a-intake` (verified in `apps/backend/src/modules/website/*` and `careers-public/careers-public.controller.ts`): `POST /api/website/v1/forms/:formKey` (200 `{ data: { id, formKey, status, isTest, replayed, captchaDegraded, error } }`, 400 `{ message: 'Invalid form fields', errors }`, 401 `Invalid website token.`/`Website intake is not configured.`, 403 `Captcha verification failed. Please retry.`, 404 bare/`Unknown form.`/`This form is not accepting submissions.`, 429 `{ statusCode, message, reason: 'tripped', fallback: 'whatsapp' }`), `GET /api/website/v1/ping` (200 `{ data: { tokenClass, moduleEnabled, captcha: 'configured' | 'missing', secondHumanConfigured, trippedForms, lastSubmissionAt, … } }`), `POST /api/website/v1/uploads/fraud-evidence` (Bearer write token, multipart `file` **only** — any other part is a 400 — ≤ 8 MB, content-sniffed JPEG/PNG/WEBP/PDF, one file per call, 201 `{ data: { key: string | null, mimeType, sizeBytes, dryRun } }`, `key` null under the test token class), `POST /api/careers/upload-cv` (public, multipart `file`, client-declared `application/pdf`, ≤ 5 MB, 201 `{ data: { url, key, fileName } }`, key = `careers-cv/<uuid><ext of the sent filename>` — the catalog's `cvKey` pattern requires a `.pdf` suffix). Tokens shorter than 20 chars (`WEBSITE_TOKEN_MIN_LENGTH`) are "unset" on the Ops side.
- Not consumed (ordering): Task 3's `useContactClick`/`ContactLink` land after this task; `FallbackPanel` calls `track()` directly with `placement: 'form_fallback'` (W12), which is the same event contract.

Produces (frozen for Tasks 3–5 and every WP2b page):

```ts
// src/forms/consent.ts
export const CONSENT_VERSION = 'kvkk-2026-09' as const;

// src/forms/wire.ts  (pure, client-safe)
export type WireFields = Record<string, string | string[]>;
export type WireEnvelope = {
  locale: Locale;
  consentVersion: string;
  captchaToken?: string;
  honeypot?: string;
  sourcePath?: string;
  fields: WireFields;
};
export function buildEnvelope(input: {
  locale: Locale;
  fields: WireFields;
  captchaToken?: string | null;
  honeypot?: string | null;
  sourcePath?: string | null;
}): WireEnvelope;

// src/forms/errors.ts  (pure, client-safe)
export const FORM_ERROR_CODES = [
  'required',
  'email',
  'phone',
  'min',
  'max',
  'url',
  'file',
  'consent',
  'captcha',
  'invalid',
] as const;
export type FormErrorCode = (typeof FORM_ERROR_CODES)[number];
export function isFormErrorCode(v: unknown): v is FormErrorCode;
export function issueToCode(issue: ZodIssue): FormErrorCode; // a schema's `{ message: 'phone' }` wins
export function fieldErrorsFromIssues(issues: ZodIssue[]): Record<string, string>; // first issue per path; value = FormErrorCode; root issue → `_form`

// src/forms/types.ts  (client-safe — W44: the door result types live here)
export const HONEYPOT_FIELD = 'honeypot';
export const CAPTCHA_FIELD = 'cf-turnstile-response';
export const CONSENT_FIELD = 'consent';
export type PostFormOk = {
  kind: 'ok';
  id: string;
  status: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM';
  isTest: boolean;
  replayed: boolean;
  captchaDegraded: boolean;
  error: string | null;
};
export type PostFormResult =
  | PostFormOk
  | { kind: 'invalid'; message: string }
  | { kind: 'captcha' }
  | { kind: 'off' }
  | { kind: 'tripped' }
  | { kind: 'unauthorized' }
  | { kind: 'unavailable'; cause: 'network' | 'timeout' | 'server' };
export type PostFormVisitor = { ip: string | null; ua: string | null };
export type FormErrorResult =
  Exclude<PostFormResult, PostFormOk> | { kind: 'failed'; error: string | null };
export type FormFallbackKind = FormErrorResult['kind']; // 'invalid'|'captcha'|'off'|'tripped'|'unauthorized'|'unavailable'|'failed'
export type FormActionState =
  | { status: 'idle' }
  | { status: 'error'; result: FormErrorResult; values: Record<string, string> }
  | { status: 'fieldErrors'; errors: Record<string, string>; values: Record<string, string> };
export const IDLE_FORM_STATE: FormActionState;
export class FormActionError extends Error {
  readonly visitorMessage: string;
  readonly field?: { name: string; code: FormErrorCode };
}
//   thrown from a page's `toFields` (or by uploads.ts): with `field` → `{ status: 'fieldErrors', errors: { [field.name]: field.code } }`; without → `{ kind: 'failed', error: visitorMessage }`
export class FormDoorError extends Error {
  readonly result: FormErrorResult;
} // thrown by uploads.ts for a door-side failure → `{ status: 'error', result }`

// src/forms/env.ts  (import 'server-only')
export const WEBSITE_TOKEN_MIN_LENGTH = 20;
export function doorBase(env?: NodeJS.ProcessEnv): string | null; // OPS_API_URL without a trailing slash
export function doorConfig(env?: NodeJS.ProcessEnv): { base: string; token: string } | null; // null = unauthorized without a call

// src/forms/post.ts  (import 'server-only')
export type PostFormDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number }; // tests only
export const ATTEMPT_TIMEOUT_MS = 4000;
export const MAX_ATTEMPTS = 2;
export async function postForm(
  formKey: FormKey,
  envelope: WireEnvelope,
  visitor: PostFormVisitor,
  deps?: PostFormDeps,
): Promise<PostFormResult>;

// src/forms/uploads.ts  (import 'server-only' — W29; call from a page's async `toFields`)
export const MAX_CV_BYTES = 5 * 1024 * 1024;
export const MAX_EVIDENCE_BYTES = 8 * 1024 * 1024;
export const MAX_EVIDENCE_FILES = 3;
export type UploadDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };
export function isFile(v: unknown): v is File;
export async function uploadCv(
  file: File,
  opts?: { field?: string } & UploadDeps,
): Promise<{ cvKey: string }>;
//   POST ${OPS_API_URL}/api/careers/upload-cv (public), multipart `file`; refuses (FormActionError, field `cv`, code `file`) an empty file, a non-PDF, a name not ending in .pdf, > 5 MB, or a door 400; door 401/404/429/5xx/network → FormDoorError
export async function uploadFraudEvidence(
  file: File,
  visitor: PostFormVisitor,
  opts?: { field?: string } & UploadDeps,
): Promise<{ key: string }>;
//   POST ${OPS_API_URL}/api/website/v1/uploads/fraud-evidence, Bearer write token, multipart `file` only; refuses (field `evidence`, code `file`) an empty file, > 8 MB, or a door 400; a null key (test token dry run) → FormDoorError unavailable/server

// src/forms/action.ts  (import 'server-only' — NOT a 'use server' file; see the page-side snippet)
export type { FormActionState, FormErrorResult, FormFallbackKind } from './types';
export { IDLE_FORM_STATE, FormActionError, FormDoorError } from './types';
export type FormSpec<S extends z.ZodTypeAny> = {
  key: FormKey;
  schema: S;
  toFields: (parsed: z.infer<S>, data: FormData) => WireFields | Promise<WireFields>;
  consent?: 'checkbox' | 'notice';
};
export function createFormAction<S extends z.ZodTypeAny>(
  spec: FormSpec<S>,
): (prev: FormActionState, data: FormData) => Promise<FormActionState>;

// src/forms/client/FormErrorsContext.tsx  ('use client')
export type FormErrorsValue = { errors: Record<string, string>; values: Record<string, string> };
export const FormErrorsContext: React.Context<FormErrorsValue>;
export function useFieldError(name: string): string | undefined; // translated sys.form.errors.<code>
export function useFieldValue(name: string): string | undefined; // echoed value after a failed submit

// src/forms/client/Field.tsx  ('use client') — the one field component pages use
export type FieldOption = { value: string; label: string };
export type FieldProps = {
  name: string;
  label?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  as?: 'input' | 'textarea' | 'select';
  type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'file';
  options?: FieldOption[];
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'url';
  accept?: string;
  multiple?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  className?: string;
  id?: string;
};
export const INPUT_CLASS: string;
export function Field(props: FieldProps): React.JSX.Element;
//   label = `label` ?? sys.form.labels.<name> — REQUIRED one way or the other (W30: throws outside production);
//   placeholder = `placeholder` ?? sys.form.placeholders.<name> when present; hint = `hint` ?? sys.form.hints.<name> when present ?? sys.form.hints.optional for a non-required field (pass hint="" to suppress)

// src/forms/client/Turnstile.tsx  ('use client')
export const TURNSTILE_SCRIPT =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
export function Turnstile({
  siteKey,
  locale,
}: {
  siteKey: string;
  locale: Locale;
}): React.JSX.Element;
//   script appended on the first focusin/pointerdown inside the enclosing <form> (W13 amended); hidden `cf-turnstile-response` input filled through the widget callback

// src/forms/client/FallbackPanel.tsx  ('use client')
export type FallbackPanelProps = {
  result: FormErrorResult;
  values: Record<string, string>;
  formKey: FormKey;
  locale: Locale;
  whatsappNumber: string;
  whatsappIntro?: string;
  contact?: { phone: string; phoneDisplay?: string; email: string };
};
export function FallbackPanel(props: FallbackPanelProps): React.JSX.Element;
export function whatsappFallbackText(
  intro: string,
  values: Record<string, string>,
  label: (key: string) => string,
): string;

// src/forms/client/FormShell.tsx  ('use client')
export type FormShellProps = {
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
  formKey: FormKey;
  locale: Locale;
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  whatsappIntro?: string;
  contact?: { phone: string; phoneDisplay?: string; email: string };
  submitLabel?: string;
  consent?: 'checkbox' | 'notice';
  consentLinkHref?: '/privacy' | '/kvkk';
  title?: string;
  children: ReactNode;
  className?: string;
  testId?: string;
  initialState?: FormActionState;
};
export function FormShell(props: FormShellProps): React.JSX.Element;

// src/app/api/form-beacon/state.ts
export function recordFormBeacon(): void;
export function formBeaconCount(): number;
export function resetFormBeacons(): void;
// src/app/api/form-beacon/route.ts — POST {formKey: FormKey, kind: string, page: string} → 204 no-store (400 on a malformed body); plain `Response`, no next/server import

// src/app/api/site-health/ops.ts
export type OpsPing = {
  state: 'ok' | 'off' | 'unauthorized' | 'unreachable' | 'unconfigured';
  latencyMs: number | null;
  captcha: 'configured' | 'missing' | null;
  trippedForms: string[];
};
export async function pingOps(env?: NodeJS.ProcessEnv, f?: typeof fetch): Promise<OpsPing>;
export function opsPingCheck(p: OpsPing): CheckResult; // ok→'ok'; unauthorized|unreachable→'fail'; off|unconfigured→'skip'
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

Page-side usage (the pattern every WP2b page follows; the kernel does not ship a page):

```ts
// src/app/[locale]/(site)/hire-workers/actions.ts   ((site) exists after Task 3 — W19/W41)
'use server';
import { z } from 'zod';
import { createFormAction, type FormActionState } from '@/forms/action';

const schema = z.object({
  name: z.string().min(1).max(120),
  company: z.string().min(1).max(200),
  email: z.string().min(1).max(254).email(), // `.min(1)` first so an empty value reads 'required', not 'email'
  phone: z
    .string()
    .min(1)
    .regex(/(\D*\d){8,}/, { message: 'phone' })
    .max(40),
  message: z.string().max(5000).optional(),
});
const run = createFormAction({
  key: 'hire',
  schema,
  toFields: (p) => ({
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    message: p.message ?? '',
  }),
});
export async function submitHire(prev: FormActionState, data: FormData) {
  return run(prev, data);
}
```

```ts
// a page with an upload (careers, T11) — the file is pulled from the raw FormData inside toFields
import { isFile, uploadCv } from '@/forms/uploads';
import { FormActionError } from '@/forms/action';
const runCareers = createFormAction({
  key: 'careers',
  schema: careersSchema, // string fields only — the File is not in the Zod schema
  toFields: async (p, data) => {
    const cv = data.get('cv');
    if (!isFile(cv)) throw new FormActionError('', { name: 'cv', code: 'required' });
    const { cvKey } = await uploadCv(cv); // FormActionError(file) / FormDoorError on refusal — the action maps both
    return {
      openingSlug: p.openingSlug,
      cvKey,
      name: p.name,
      email: p.email,
      phone: p.phone,
      country: p.country,
    };
  },
});
```

```tsx
// inside the page (server component)
<FormShell
  action={submitHire}
  formKey="hire"
  locale={locale}
  turnstileSiteKey={bundle.settings.turnstileSiteKey}
  whatsappNumber={bundle.settings.whatsappNumber}
  contact={{
    phone: bundle.settings.phone,
    phoneDisplay: bundle.settings.phoneDisplay,
    email: bundle.settings.email,
  }}
  submitLabel={t('hire.063')}
>
  <Field name="company" required autoComplete="organization" />
  <Field name="name" required autoComplete="name" />
  <Field name="email" type="email" required autoComplete="email" inputMode="email" />
  <Field name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
  <Field name="message" as="textarea" rows={4} />
</FormShell>
```

---

#### Cycle 1 — `consent.ts`, `wire.ts`, `errors.ts`, `types.ts`

- [ ] **Step 1: Write the failing tests**

`src/forms/__tests__/wire.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { CONSENT_VERSION } from '../consent';
import { buildEnvelope } from '../wire';

describe('CONSENT_VERSION', () => {
  it('fits the door DTO (≤ 40 chars) and never changes shape by accident', () => {
    expect(CONSENT_VERSION).toBe('kvkk-2026-09');
    expect(CONSENT_VERSION.length).toBeLessThanOrEqual(40);
  });
});

describe('buildEnvelope', () => {
  it('always sends the site-wide consent version and the locale', () => {
    const env = buildEnvelope({ locale: 'tr', fields: { name: 'Ali' } });
    expect(env).toEqual({ locale: 'tr', consentVersion: CONSENT_VERSION, fields: { name: 'Ali' } });
  });

  it('drops empty strings, undefined and empty arrays from fields', () => {
    const env = buildEnvelope({
      locale: 'en',
      fields: {
        name: 'Ali',
        company: '',
        // a page's toFields may hand through an optional that is simply not there
        city: undefined as unknown as string,
        evidenceKeys: ['website-fraud/a.png', '', 'website-fraud/b.png'],
        empty: [],
      },
    });
    expect(env.fields).toEqual({
      name: 'Ali',
      evidenceKeys: ['website-fraud/a.png', 'website-fraud/b.png'],
    });
  });

  it('omits captchaToken/honeypot/sourcePath when null, undefined or blank, and clips them to the DTO caps', () => {
    expect(
      buildEnvelope({
        locale: 'tr',
        fields: {},
        captchaToken: null,
        honeypot: '',
        sourcePath: undefined,
      }),
    ).toEqual({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      fields: {},
    });
    const env = buildEnvelope({
      locale: 'tr',
      fields: {},
      captchaToken: 'x'.repeat(3000),
      honeypot: 'y'.repeat(600),
      sourcePath: '/'.padEnd(400, 'p'),
    });
    expect(env.captchaToken).toHaveLength(2048);
    expect(env.honeypot).toHaveLength(500);
    expect(env.sourcePath).toHaveLength(300);
  });

  it('never carries a key the door would reject at the top level', () => {
    const env = buildEnvelope({ locale: 'tr', fields: { a: 'b' }, sourcePath: '/isci-talebi' });
    expect(Object.keys(env).sort()).toEqual(['consentVersion', 'fields', 'locale', 'sourcePath']);
  });
});
```

`src/forms/__tests__/errors.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { fieldErrorsFromIssues, isFormErrorCode, issueToCode } from '../errors';

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().min(1).email(),
  phone: z.string().regex(/(\D*\d){8,}/, { message: 'phone' }),
  site: z.string().url().optional(),
  headcount: z.string().min(1),
  message: z.string().min(20).max(5000),
  iAm: z.enum(['direct_employer', 'hr_agency']),
  cv: z.string().min(1, { message: 'file' }),
});

describe('issueToCode / fieldErrorsFromIssues', () => {
  it('maps the common Zod issues to sys.form.errors.* codes, first issue per field', () => {
    const r = schema.safeParse({
      name: '',
      email: 'not-an-email',
      phone: '12',
      site: 'nope',
      message: 'short',
      iAm: '',
      cv: '',
    });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrorsFromIssues(r.error.issues)).toEqual({
      name: 'required',
      email: 'email',
      phone: 'phone',
      site: 'url',
      headcount: 'required',
      message: 'min',
      iAm: 'required',
      cv: 'file',
    });
  });

  it('reads a schema message that is itself a code, and falls back to invalid otherwise', () => {
    const r = z.object({ a: z.string().max(2), b: z.number() }).safeParse({ a: 'abc', b: 'x' });
    if (r.success) throw new Error('expected failure');
    expect(r.error.issues.map(issueToCode)).toEqual(['max', 'invalid']);
    expect(isFormErrorCode('phone')).toBe(true);
    expect(isFormErrorCode('Required')).toBe(false);
  });

  it('names a root-level issue _form', () => {
    const r = z.string().safeParse(5);
    if (r.success) throw new Error('expected failure');
    expect(fieldErrorsFromIssues(r.error.issues)).toEqual({ _form: 'invalid' });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

`npx vitest run src/forms/__tests__/wire.test.ts src/forms/__tests__/errors.test.ts` → both files fail to load: `Error: Failed to resolve import "../consent"` / `"../errors"`.

- [ ] **Step 3: Implement**

`src/forms/consent.ts`:

```ts
/** The one site-wide `consentVersion` every submission carries (the door's DTO requires it,
 *  ≤ 40 chars, even on forms whose design has no checkbox). Bump it when counsel changes the
 *  KVKK/privacy text (§10 item 6) — never per form, never per page. */
export const CONSENT_VERSION = 'kvkk-2026-09' as const;
```

`src/forms/wire.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import { CONSENT_VERSION } from './consent';

/** The `fields` object of the door envelope. Unknown keys inside it are silently DROPPED by
 *  the Operations catalog (never an error), so a mis-spelled key loses data with a 200 — page
 *  `toFields` mappers copy the catalog names exactly (docs/INTEGRATIONS.md I4). */
export type WireFields = Record<string, string | string[]>;

/** `POST /api/website/v1/forms/:formKey` body. Top-level keys are whitelisted with
 *  `forbidNonWhitelisted` on the Ops side — anything beyond these six is a 400, so this type
 *  is closed on purpose. */
export type WireEnvelope = {
  locale: Locale;
  consentVersion: string;
  captchaToken?: string;
  honeypot?: string;
  sourcePath?: string;
  fields: WireFields;
};

/** The door DTO's length caps (website-form-submit.dto.ts). */
const MAX = { captchaToken: 2048, honeypot: 500, sourcePath: 300 } as const;

const optional = (v: string | null | undefined, max: number): string | undefined => {
  if (typeof v !== 'string' || v === '') return undefined;
  return v.length > max ? v.slice(0, max) : v;
};

export function buildEnvelope(input: {
  locale: Locale;
  fields: WireFields;
  captchaToken?: string | null;
  honeypot?: string | null;
  sourcePath?: string | null;
}): WireEnvelope {
  const fields: WireFields = {};
  for (const [key, value] of Object.entries(input.fields)) {
    if (typeof value === 'string') {
      if (value !== '') fields[key] = value;
    } else if (Array.isArray(value)) {
      const kept = value.filter((s): s is string => typeof s === 'string' && s !== '');
      if (kept.length) fields[key] = kept;
    }
    // undefined / anything else: not a wire value, not sent
  }
  const envelope: WireEnvelope = { locale: input.locale, consentVersion: CONSENT_VERSION, fields };
  const captchaToken = optional(input.captchaToken, MAX.captchaToken);
  if (captchaToken) envelope.captchaToken = captchaToken;
  // A filled honeypot is the bot signal; an empty one is simply absent.
  const honeypot = optional(input.honeypot, MAX.honeypot);
  if (honeypot) envelope.honeypot = honeypot;
  const sourcePath = optional(input.sourcePath, MAX.sourcePath);
  if (sourcePath) envelope.sourcePath = sourcePath;
  return envelope;
}
```

`src/forms/errors.ts`:

```ts
import type { ZodIssue } from 'zod';

/** The `sys.form.errors.*` keys. A field error travels server → client as one of these codes
 *  (never as English text), and `useFieldError` renders the locale's copy. `invalid` is the
 *  catch-all for an issue no other code describes. */
export const FORM_ERROR_CODES = [
  'required',
  'email',
  'phone',
  'min',
  'max',
  'url',
  'file',
  'consent',
  'captcha',
  'invalid',
] as const;
export type FormErrorCode = (typeof FORM_ERROR_CODES)[number];

export const isFormErrorCode = (v: unknown): v is FormErrorCode =>
  typeof v === 'string' && (FORM_ERROR_CODES as readonly string[]).includes(v);

/** Zod issue → error code. A schema can name the code directly (`.regex(RE, { message:
 *  'phone' })`, `.min(1, { message: 'file' })`) and that wins; otherwise the issue kind
 *  decides. Put `.min(1)` before `.email()`/`.url()` so an empty value reads `required`. */
export function issueToCode(issue: ZodIssue): FormErrorCode {
  if (isFormErrorCode(issue.message)) return issue.message;
  switch (issue.code) {
    case 'invalid_type':
      return issue.received === 'undefined' ? 'required' : 'invalid';
    case 'too_small':
      return issue.type === 'string' && issue.minimum === 1 ? 'required' : 'min';
    case 'too_big':
      return 'max';
    case 'invalid_string':
      if (issue.validation === 'email') return 'email';
      if (issue.validation === 'url') return 'url';
      return 'invalid';
    case 'invalid_enum_value':
      // a select left on its placeholder posts '' — that is "required", not "invalid"
      return issue.received === '' ? 'required' : 'invalid';
    default:
      return 'invalid';
  }
}

/** First issue per field wins; a root-level issue lands under `_form`. */
export function fieldErrorsFromIssues(issues: ZodIssue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const name = issue.path.length ? issue.path.join('.') : '_form';
    if (!(name in out)) out[name] = issueToCode(issue);
  }
  return out;
}
```

`src/forms/types.ts` (W44 — the door result types live here, imported by `post.ts`, `action.ts`, `uploads.ts` and the client islands; this file imports only a type from `./errors`):

```ts
import type { FormErrorCode } from './errors';

/** Wire names the shell renders and the action strips before validation. `honeypot` is the
 *  door's literal field name; `cf-turnstile-response` is the Turnstile widget's. */
export const HONEYPOT_FIELD = 'honeypot';
export const CAPTCHA_FIELD = 'cf-turnstile-response';
export const CONSENT_FIELD = 'consent';

/** The door's HTTP 200 body (`website-forms.service.ts`). `status: 'FAILED'` is still a 200:
 *  the row is durable and re-runnable from the Ops inbox; `error` is non-null only when the
 *  failure was the visitor's own (RC26) and is the visitor-safe text to show. */
export type PostFormOk = {
  kind: 'ok';
  id: string;
  status: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM';
  isTest: boolean;
  replayed: boolean;
  captchaDegraded: boolean;
  error: string | null;
};

export type PostFormResult =
  | PostFormOk
  | { kind: 'invalid'; message: string } // 400 — catalog/DTO rejection (client validation should make this unreachable)
  | { kind: 'captcha' } // 403 — Turnstile failed or missing while Ops holds a secret
  | { kind: 'off' } // 404 — module flag off, form inactive (newsletter in Phase A), or unknown key
  | { kind: 'tripped' } // 429 — abuse trip, `fallback: 'whatsapp'`
  | { kind: 'unauthorized' } // 401 or no usable token/URL here — an ops alarm, the visitor sees the panel
  | { kind: 'unavailable'; cause: 'network' | 'timeout' | 'server' }; // no answer, or 5xx, after the one retry (W3)

export type PostFormVisitor = { ip: string | null; ua: string | null };

/** What the fallback panel renders (D11). `failed` is the door's HTTP 200 + `status: 'FAILED'`
 *  — the row is durable and re-runnable from the Ops inbox, `error` is the visitor-safe text
 *  when the failure was the visitor's own (a closed opening, a residency rule). */
export type FormErrorResult =
  Exclude<PostFormResult, PostFormOk> | { kind: 'failed'; error: string | null };
export type FormFallbackKind = FormErrorResult['kind'];

export type FormActionState =
  | { status: 'idle' }
  | { status: 'error'; result: FormErrorResult; values: Record<string, string> }
  | { status: 'fieldErrors'; errors: Record<string, string>; values: Record<string, string> };

export const IDLE_FORM_STATE: FormActionState = { status: 'idle' };

/**
 * Thrown from a page's `toFields` (or by `uploads.ts`) for a VISITOR-side refusal. With
 * `field`, the action answers a field error under that name with that `sys.form.errors.*`
 * code (an unreadable CV → `cv: 'file'`); without one, the `failed` panel with
 * `visitorMessage` (already localized by the thrower, or the door's own visitor-safe text).
 */
export class FormActionError extends Error {
  readonly visitorMessage: string;
  readonly field?: { name: string; code: FormErrorCode };
  constructor(visitorMessage: string, field?: { name: string; code: FormErrorCode }) {
    super(visitorMessage || (field ? `${field.name}: ${field.code}` : 'form action refused'));
    this.name = 'FormActionError';
    this.visitorMessage = visitorMessage;
    this.field = field;
  }
}

/** Thrown by `uploads.ts` when the DOOR failed (401/404/429/5xx/network/timeout) before the
 *  form itself was posted — the action renders the same fallback panel `postForm` would. */
export class FormDoorError extends Error {
  readonly result: FormErrorResult;
  constructor(result: FormErrorResult) {
    super(`door ${result.kind}`);
    this.name = 'FormDoorError';
    this.result = result;
  }
}
```

- [ ] **Step 4: Run the tests**

`npx prettier --write src/forms` then `npx vitest run src/forms/__tests__/wire.test.ts src/forms/__tests__/errors.test.ts` → `Test Files 2 passed`, 8 tests. `npx tsc --noEmit` → clean (`types.ts` has no forward import — W44).

- [ ] **Step 5: Commit**

```bash
git add src/forms/consent.ts src/forms/wire.ts src/forms/errors.ts src/forms/types.ts src/forms/__tests__/wire.test.ts src/forms/__tests__/errors.test.ts
git commit -m "feat(forms): consent version, wire envelope builder, Zod issue → sys.form.errors codes, action state types

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — `env.ts` + `post.ts` (the door client, W3 retry rule) + the `server-only` test alias

- [ ] **Step 1: Write the failing test**

`src/test/server-only.ts` (the Vitest stand-in for Next's compiler-level `server-only` marker — an empty module):

```ts
// Vitest stand-in for Next's `server-only` marker. There is no top-level `server-only` package
// in node_modules: Next ships `next/dist/compiled/server-only` (whose default export condition
// throws) and aliases the bare specifier at build time, and `next/types/global.d.ts` declares
// the module for tsc. Vitest sees neither, so `vitest.config.mts` points the specifier here.
// Empty on purpose (R2): the guard is a build-time one, and the modules that carry it are
// unit-tested here as plain functions.
export {};
```

`src/forms/__tests__/post.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '../consent';
import { doorBase, doorConfig } from '../env';
import { postForm, type PostFormDeps } from '../post';
import type { WireEnvelope } from '../wire';

const envelope: WireEnvelope = {
  locale: 'tr',
  consentVersion: CONSENT_VERSION,
  fields: { name: 'Ali Veli', email: 'ali@example.com' },
};
const visitor = { ip: '203.0.113.9', ua: 'Mozilla/5.0 test' };
const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com/',
  OPS_WEBSITE_WRITE_TOKEN: 'wsw_' + 'a'.repeat(48),
} as NodeJS.ProcessEnv;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
const okBody = (over: Partial<Record<string, unknown>> = {}) => ({
  data: {
    id: 'sub_1',
    formKey: 'hire',
    status: 'RECEIVED',
    isTest: false,
    replayed: false,
    captchaDegraded: false,
    error: null,
    ...over,
  },
});

let fetchMock: ReturnType<typeof vi.fn>;
let deps: PostFormDeps;

beforeEach(() => {
  fetchMock = vi.fn();
  deps = { fetch: fetchMock as unknown as typeof fetch, env };
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('doorConfig', () => {
  it('strips the trailing slash and treats a short or missing token as unset (Ops rule: 20 chars)', () => {
    expect(doorBase(env)).toBe('https://operations.example.com');
    expect(doorConfig(env)).toEqual({
      base: 'https://operations.example.com',
      token: env.OPS_WEBSITE_WRITE_TOKEN,
    });
    expect(doorConfig({ NODE_ENV: 'test' } as NodeJS.ProcessEnv)).toBeNull();
    expect(
      doorConfig({ ...env, OPS_WEBSITE_WRITE_TOKEN: 'short' } as NodeJS.ProcessEnv),
    ).toBeNull();
    expect(doorConfig({ ...env, OPS_API_URL: '' } as NodeJS.ProcessEnv)).toBeNull();
  });
});

describe('postForm — request shape', () => {
  it('posts the envelope to the door with the write token and the visitor headers', async () => {
    fetchMock.mockResolvedValueOnce(json(200, okBody()));
    const res = await postForm('hire', envelope, visitor, deps);
    expect(res).toEqual({
      kind: 'ok',
      id: 'sub_1',
      status: 'RECEIVED',
      isTest: false,
      replayed: false,
      captchaDegraded: false,
      error: null,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://operations.example.com/api/website/v1/forms/hire');
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(init.headers).toEqual({
      Authorization: `Bearer ${env.OPS_WEBSITE_WRITE_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Website-Visitor-Ip': '203.0.113.9',
      'X-Website-Visitor-Ua': 'Mozilla/5.0 test',
    });
    expect(JSON.parse(init.body as string)).toEqual(envelope);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('omits the visitor headers it does not have and truncates the UA to 500', async () => {
    fetchMock.mockResolvedValueOnce(json(200, okBody()));
    await postForm('hire', envelope, { ip: null, ua: 'u'.repeat(600) }, deps);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers['X-Website-Visitor-Ip']).toBeUndefined();
    expect(headers['X-Website-Visitor-Ua']).toHaveLength(500);
  });

  it('returns unauthorized without a network call when the URL or token is not configured', async () => {
    expect(
      await postForm('hire', envelope, visitor, {
        ...deps,
        env: { NODE_ENV: 'test' } as NodeJS.ProcessEnv,
      }),
    ).toEqual({ kind: 'unauthorized' });
    expect(
      await postForm('hire', envelope, visitor, {
        ...deps,
        env: { ...env, OPS_WEBSITE_WRITE_TOKEN: 'short' } as NodeJS.ProcessEnv,
      }),
    ).toEqual({ kind: 'unauthorized' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('postForm — status mapping', () => {
  it('200 with status FAILED is still kind ok (the row is durable) and carries the visitor error', async () => {
    fetchMock.mockResolvedValueOnce(
      json(200, okBody({ status: 'FAILED', error: 'This opening is closed.' })),
    );
    expect(await postForm('careers', envelope, visitor, deps)).toMatchObject({
      kind: 'ok',
      status: 'FAILED',
      error: 'This opening is closed.',
    });
  });

  it('200 SPAM and replayed both count as ok', async () => {
    fetchMock.mockResolvedValueOnce(json(200, okBody({ status: 'SPAM', replayed: true })));
    expect(await postForm('hire', envelope, visitor, deps)).toMatchObject({
      kind: 'ok',
      status: 'SPAM',
      replayed: true,
    });
  });

  it('400 → invalid with the door message, no retry', async () => {
    fetchMock.mockResolvedValueOnce(
      json(400, { message: 'Invalid form fields', errors: ['email must be an email'] }),
    );
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'invalid',
      message: 'Invalid form fields',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('401 → unauthorized, no retry', async () => {
    fetchMock.mockResolvedValueOnce(json(401, { message: 'Invalid website token.' }));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({ kind: 'unauthorized' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('403 → captcha, no retry', async () => {
    fetchMock.mockResolvedValueOnce(
      json(403, { message: 'Captcha verification failed. Please retry.' }),
    );
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({ kind: 'captcha' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('404 (module off / form inactive / unknown key) → off, no retry', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    expect(await postForm('newsletter', envelope, visitor, deps)).toEqual({ kind: 'off' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('429 → tripped, no retry', async () => {
    fetchMock.mockResolvedValueOnce(
      json(429, {
        statusCode: 429,
        message: 'This form is paused for a short while.',
        reason: 'tripped',
        fallback: 'whatsapp',
      }),
    );
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({ kind: 'tripped' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('a 200 that is not the door JSON (login wall, proxy page) is an outage, not a success (R28)', async () => {
    fetchMock.mockImplementation(() => new Response('<html>login</html>', { status: 200 }));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('postForm — W3 retry rule', () => {
  it('retries once after a 5xx and returns the second answer (a replayed row is a success)', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('Bad Gateway', { status: 502 }))
      .mockResolvedValueOnce(json(200, okBody({ replayed: true })));
    expect(await postForm('hire', envelope, visitor, deps)).toMatchObject({
      kind: 'ok',
      replayed: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('two network failures → unavailable/network, exactly two attempts', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'network',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('a 5xx then a network failure → unavailable/network', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockRejectedValueOnce(new TypeError('fetch failed'));
    expect(await postForm('hire', envelope, visitor, deps)).toEqual({
      kind: 'unavailable',
      cause: 'network',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('each attempt is bounded by its own timeout; two timeouts → unavailable/timeout inside the budget', async () => {
    // A fetch that never answers on its own — it only rejects when its signal aborts, which is
    // what a hung Operations looks like from the caller's side.
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_, reject) => {
          init.signal!.addEventListener('abort', () => reject(init.signal!.reason));
        }),
    );
    const started = Date.now();
    const res = await postForm('hire', envelope, visitor, { ...deps, timeoutMs: 20 });
    expect(res).toEqual({ kind: 'unavailable', cause: 'timeout' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(Date.now() - started).toBeLessThan(2000);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

`npx vitest run src/forms/__tests__/post.test.ts` → `Error: Failed to resolve import "../env"`.

- [ ] **Step 3: Implement**

`vitest.config.mts` — in the `resolve.alias` object, after the `'@': fileURLToPath(new URL('./src', import.meta.url)),` entry, add:

```ts
      // `server-only` is a compiler-level marker: Next aliases the bare specifier to its own
      // `next/dist/compiled/server-only` at build time and `next/types/global.d.ts` declares it
      // for tsc — there is no top-level package Vitest could resolve. The server modules that
      // carry it (`src/content/adapter.ts`, `src/forms/{env,post,action,uploads}.ts`) resolve
      // to an empty module here (R2: the guard is the build's job).
      'server-only': fileURLToPath(new URL('./src/test/server-only.ts', import.meta.url)),
```

`src/forms/env.ts`:

```ts
import 'server-only';

/** Ops treats a stored token shorter than this as unset (`WEBSITE_TOKEN_MIN_LENGTH` in
 *  website.constants.ts); a placeholder value here is the same thing. */
export const WEBSITE_TOKEN_MIN_LENGTH = 20;

export type DoorConfig = { base: string; token: string };

/** `OPS_API_URL` without a trailing slash, or null when unset. */
export function doorBase(env: NodeJS.ProcessEnv = process.env): string | null {
  const raw = env.OPS_API_URL?.trim();
  return raw ? raw.replace(/\/+$/, '') : null;
}

/** The forms' credential pair, or null — the caller answers `unauthorized`/`unconfigured`
 *  without a network call. Never logged, never sent to the browser. */
export function doorConfig(env: NodeJS.ProcessEnv = process.env): DoorConfig | null {
  const base = doorBase(env);
  const token = env.OPS_WEBSITE_WRITE_TOKEN?.trim();
  if (!base || !token || token.length < WEBSITE_TOKEN_MIN_LENGTH) return null;
  return { base, token };
}
```

`src/forms/post.ts`:

```ts
import 'server-only';
import { z } from 'zod';
import type { FormKey } from '@/analytics/forms';
import { doorConfig } from './env';
import type { PostFormResult, PostFormVisitor } from './types';
import type { WireEnvelope } from './wire';

export type { PostFormOk, PostFormResult, PostFormVisitor } from './types';

/** Test seams only — production callers pass nothing. */
export type PostFormDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };

/** W3: per-attempt timeout × at most two attempts = the 8 s budget, no sleep in between. */
export const ATTEMPT_TIMEOUT_MS = 4000;
export const MAX_ATTEMPTS = 2;
const MAX_UA = 500;

const OkSchema = z.object({
  data: z.object({
    id: z.string().min(1),
    status: z.enum(['RECEIVED', 'HANDLED', 'FAILED', 'SPAM']),
    isTest: z.boolean(),
    replayed: z.boolean(),
    captchaDegraded: z.boolean(),
    error: z.string().nullable(),
  }),
});

const isTimeout = (err: unknown) =>
  err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');

const messageOf = (json: unknown): string =>
  typeof json === 'object' &&
  json !== null &&
  typeof (json as { message?: unknown }).message === 'string'
    ? (json as { message: string }).message
    : 'rejected';

/** HTTP status → result. `unavailable` is the only kind the caller retries. Logs carry the
 *  form key and the status class only — never the token, never a field. */
async function mapResponse(res: Response, formKey: FormKey): Promise<PostFormResult> {
  const { status } = res;
  const json: unknown = await res.json().catch(() => null);
  if (status === 200) {
    const parsed = OkSchema.safeParse(json);
    if (parsed.success) return { kind: 'ok', ...parsed.data.data };
    // R28: a 200 that is not the door's JSON (a login wall, a proxy page) is an outage.
    console.error('[postForm] malformed 200 from the door', { formKey });
    return { kind: 'unavailable', cause: 'server' };
  }
  if (status === 401) {
    console.error('[postForm] 401 — write token rejected or not configured on the door', {
      formKey,
    });
    return { kind: 'unauthorized' };
  }
  if (status === 403) return { kind: 'captcha' };
  if (status === 404) {
    // Newsletter answers 404 by design in Phase A (D14); the module flag off is the same code.
    console.warn('[postForm] 404 — door off or form inactive', { formKey });
    return { kind: 'off' };
  }
  if (status === 429) return { kind: 'tripped' };
  if (status >= 500) return { kind: 'unavailable', cause: 'server' };
  console.error('[postForm] rejected', { formKey, status });
  return { kind: 'invalid', message: messageOf(json) };
}

/**
 * `POST ${OPS_API_URL}/api/website/v1/forms/${formKey}` with the write token (D6, D11).
 * Server-only: the browser never sees this URL, this token or this call.
 *
 * W3 retry rule: at most ONE immediate retry, and only after a network error, a per-attempt
 * timeout or a 5xx — never after a 4xx. Every Ops deploy is a 30–60 s 502 window and the door
 * dedupes on `(formKey, requestHash, hourBucket)`, so the retry lands on the same row
 * (`replayed: true`) rather than creating a second lead. After that the caller shows the
 * visitor fallback panel — there is no queue on Vercel.
 */
export async function postForm(
  formKey: FormKey,
  envelope: WireEnvelope,
  visitor: PostFormVisitor,
  deps: PostFormDeps = {},
): Promise<PostFormResult> {
  const door = doorConfig(deps.env ?? process.env);
  if (!door) {
    console.error('[postForm] OPS_API_URL / OPS_WEBSITE_WRITE_TOKEN not configured', { formKey });
    return { kind: 'unauthorized' };
  }
  const doFetch = deps.fetch ?? fetch;
  const timeoutMs = deps.timeoutMs ?? ATTEMPT_TIMEOUT_MS;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${door.token}`,
    'Content-Type': 'application/json',
  };
  if (visitor.ip) headers['X-Website-Visitor-Ip'] = visitor.ip;
  if (visitor.ua) headers['X-Website-Visitor-Ua'] = visitor.ua.slice(0, MAX_UA);
  const url = `${door.base}/api/website/v1/forms/${formKey}`;
  const body = JSON.stringify(envelope);

  let last: Extract<PostFormResult, { kind: 'unavailable' }> = {
    kind: 'unavailable',
    cause: 'network',
  };
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let res: Response;
    try {
      res = await doFetch(url, {
        method: 'POST',
        headers,
        body,
        cache: 'no-store',
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      last = { kind: 'unavailable', cause: isTimeout(err) ? 'timeout' : 'network' };
      continue;
    }
    const mapped = await mapResponse(res, formKey);
    if (mapped.kind !== 'unavailable') return mapped;
    last = mapped;
  }
  console.error('[postForm] unavailable after retry', { formKey, cause: last.cause });
  return last;
}
```

- [ ] **Step 4: Run the tests + typecheck**

`npx prettier --write vitest.config.mts src/test src/forms` then `npx vitest run src/forms` → `Test Files 3 passed`, 24 tests. `npx tsc --noEmit` → clean (`import 'server-only'` resolves through `next/types/global.d.ts`, exactly as `src/content/adapter.ts` already does).

- [ ] **Step 5: Commit**

```bash
git add vitest.config.mts src/test/server-only.ts src/forms/env.ts src/forms/post.ts src/forms/__tests__/post.test.ts
git commit -m "feat(forms): postForm door client — status map, visitor headers, W3 one-retry/8 s budget

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — `sys.form.*` copy in both message files (W9/W23/W30) + the key-parity test

- [ ] **Step 1: Write the failing test**

`src/messages/messages.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from './en.json';
import tr from './tr.json';

/** Every leaf path of a message object, `a.b.c` style. */
function leaves(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? leaves(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

/** W30: every field name the ten catalog forms use (v1 + Task 8's v1.1) has a label. */
const LABELS = [
  'name',
  'email',
  'phone',
  'company',
  'city',
  'country',
  'sector',
  'headcount',
  'startWhen',
  'roleNeeded',
  'message',
  'subject',
  'iAm',
  'preferredTime',
  'cv',
  'consent',
  'reporterName',
  'reporterEmail',
  'reporterPhone',
  'suspectName',
  'suspectContact',
  'description',
  'evidence',
  'office',
  'preferredDate',
  'trade',
  'candidatesPerYear',
  'trades',
  'licence',
  'durationMonths',
  'track',
  'topic',
  'portfolioUrl',
  'expectedSalary',
  'expectedSalaryCurrency',
  'currentSalary',
  'currentSalaryCurrency',
  'coverLetter',
  'linkedinUrl',
  'language',
  'openingSlug',
  'estimateSummary',
];
const PLACEHOLDERS = [
  'name',
  'email',
  'phone',
  'company',
  'city',
  'headcount',
  'roleNeeded',
  'message',
  'subject',
  'select',
  'description',
  'trade',
  'trades',
  'licence',
  'candidatesPerYear',
  'durationMonths',
  'portfolioUrl',
  'linkedinUrl',
  'expectedSalary',
  'coverLetter',
  'language',
  'suspectName',
  'suspectContact',
  'reporterName',
  'reporterEmail',
  'reporterPhone',
  'preferredDate',
  'preferredTime',
];
const HINTS = [
  'phone',
  'cv',
  'evidence',
  'optional',
  'description',
  'portfolioUrl',
  'linkedinUrl',
  'expectedSalary',
];
const ERRORS = [
  'required',
  'email',
  'phone',
  'min',
  'max',
  'url',
  'file',
  'consent',
  'captcha',
  'invalid',
];
const FALLBACK_KINDS = [
  'captcha',
  'off',
  'tripped',
  'unauthorized',
  'unavailable',
  'failed',
  'invalid',
];

describe('src/messages — sys.* parity (W9/W23)', () => {
  it('tr and en carry exactly the same key set', () => {
    expect(leaves(tr).sort()).toEqual(leaves(en).sort());
  });

  it('carries every sys.form.* key the forms kernel reads (W30)', () => {
    const keys = new Set(leaves(tr));
    const expectKey = (k: string) => expect(keys.has(k), k).toBe(true);
    for (const k of LABELS) expectKey(`sys.form.labels.${k}`);
    for (const k of PLACEHOLDERS) expectKey(`sys.form.placeholders.${k}`);
    for (const k of HINTS) expectKey(`sys.form.hints.${k}`);
    for (const k of ERRORS) expectKey(`sys.form.errors.${k}`);
    for (const kind of FALLBACK_KINDS) {
      expectKey(`sys.form.fallback.${kind}.title`);
      expectKey(`sys.form.fallback.${kind}.body`);
    }
    for (const k of [
      'sys.form.consent.label',
      'sys.form.consent.notice',
      'sys.form.consent.link',
      'sys.form.submit.default',
      'sys.form.submit.sending',
      'sys.form.honeypot',
      'sys.form.fallback.whatsapp',
      'sys.form.fallback.call',
      'sys.form.fallback.email',
      'sys.form.fallback.whatsappIntro',
      'sys.form.fallback.retry',
    ])
      expectKey(k);
  });

  it('no sys.form leaf is empty in either file, and the consent copy carries the <link> tag', () => {
    for (const file of [tr, en]) {
      const form = file.sys.form as Record<string, unknown>;
      for (const path of leaves(form)) {
        const value = path
          .split('.')
          .reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], form);
        expect(typeof value === 'string' && value.trim().length > 0, `sys.form.${path}`).toBe(true);
      }
      expect(file.sys.form.consent.label).toMatch(/<link>.+<\/link>/);
      expect(file.sys.form.consent.notice).toMatch(/<link>.+<\/link>/);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

`npx vitest run src/messages/messages.test.ts` → the third test fails to compile (`Property 'form' does not exist on type …`) and the second fails on `sys.form.labels.name` (`expected false to be true`).

- [ ] **Step 3: Implement**

`src/messages/tr.json` — inside `"sys"`, after the closing `}` of `"thankYou"`, add a comma and the `form` object (the file then ends `    }\n  }\n}`):

```json
    "form": {
      "labels": {
        "name": "Ad Soyad",
        "email": "E-posta",
        "phone": "Telefon",
        "company": "Şirket",
        "city": "Şehir",
        "country": "Ülke",
        "sector": "Sektör",
        "headcount": "İşçi sayısı",
        "startWhen": "Ne zaman başlamalı?",
        "roleNeeded": "Aranan pozisyonlar",
        "message": "Mesajınız",
        "subject": "Konu",
        "iAm": "Ben",
        "preferredTime": "Tercih ettiğiniz saat",
        "cv": "Özgeçmiş (PDF)",
        "consent": "Onay",
        "reporterName": "Adınız",
        "reporterEmail": "E-posta adresiniz",
        "reporterPhone": "Telefon numaranız",
        "suspectName": "Şüpheli kişi veya kurum",
        "suspectContact": "Şüphelinin iletişim bilgisi",
        "description": "Ne oldu?",
        "evidence": "Kanıt dosyaları",
        "office": "Ofis",
        "preferredDate": "Tercih ettiğiniz tarih",
        "trade": "Meslek",
        "candidatesPerYear": "Yılda kaç aday?",
        "trades": "Meslek alanları",
        "licence": "Lisans / ruhsat",
        "durationMonths": "Süre (ay)",
        "track": "Ortaklık türü",
        "topic": "Konu başlığı",
        "portfolioUrl": "Portföy bağlantısı",
        "expectedSalary": "Beklenen maaş",
        "expectedSalaryCurrency": "Para birimi",
        "currentSalary": "Mevcut maaş",
        "currentSalaryCurrency": "Para birimi",
        "coverLetter": "Ön yazı",
        "linkedinUrl": "LinkedIn profili",
        "language": "Diller",
        "openingSlug": "İlan",
        "estimateSummary": "Tahmin özeti"
      },
      "placeholders": {
        "name": "Adınız ve soyadınız",
        "email": "ad@sirket.com",
        "phone": "+90 5xx xxx xx xx",
        "company": "Şirket adı",
        "city": "Örn. Antalya",
        "headcount": "Örn. 10",
        "roleNeeded": "Örn. kaynakçı, garson, şoför",
        "message": "İhtiyacınızı kısaca anlatın",
        "subject": "Mesajınızın konusu",
        "select": "Seçiniz",
        "description": "Kim, ne zaman, ne istedi? Elinizdeki her ayrıntı yardımcı olur.",
        "trade": "Örn. CNC operatörü",
        "trades": "Örn. kaynak, inşaat, otel servisi",
        "licence": "Örn. ruhsat numarası ve veren kurum",
        "candidatesPerYear": "Örn. 200",
        "durationMonths": "Örn. 12",
        "portfolioUrl": "https://",
        "linkedinUrl": "https://linkedin.com/in/",
        "expectedSalary": "Örn. 45000",
        "coverLetter": "Neden bu pozisyon? Kısaca anlatın.",
        "language": "Örn. Türkçe (ana dil), İngilizce (B2)",
        "suspectName": "Kişi veya firma adı",
        "suspectContact": "Telefon, e-posta veya profil bağlantısı",
        "reporterName": "Adınız ve soyadınız",
        "reporterEmail": "ad@ornek.com",
        "reporterPhone": "+90 5xx xxx xx xx",
        "preferredDate": "Örn. 14 Ekim",
        "preferredTime": "Örn. 10:00–12:00"
      },
      "hints": {
        "phone": "Ülke koduyla birlikte yazın.",
        "cv": "Yalnızca PDF, en fazla 5 MB.",
        "evidence": "JPEG, PNG, WEBP veya PDF; dosya başına en fazla 8 MB, en çok üç dosya.",
        "optional": "İsteğe bağlı",
        "description": "En az 20 karakter.",
        "portfolioUrl": "https:// ile başlayan bir bağlantı.",
        "linkedinUrl": "İsteğe bağlı; https:// ile başlayan bir bağlantı.",
        "expectedSalary": "Aylık brüt, yalnızca rakam."
      },
      "errors": {
        "required": "Bu alan zorunludur.",
        "email": "Geçerli bir e-posta adresi girin.",
        "phone": "Geçerli bir telefon numarası girin (en az 8 rakam).",
        "min": "Bu alan çok kısa.",
        "max": "Bu alan çok uzun.",
        "url": "Geçerli bir bağlantı girin (https:// ile başlamalı).",
        "file": "Dosya kabul edilmedi; türünü ve boyutunu kontrol edin.",
        "consent": "Devam etmek için aydınlatma metnini onaylamanız gerekir.",
        "captcha": "Güvenlik doğrulaması tamamlanamadı. Lütfen tekrar deneyin.",
        "invalid": "Bu değer geçerli değil."
      },
      "consent": {
        "label": "Kişisel verilerimin <link>aydınlatma metni</link> kapsamında işlenmesini kabul ediyorum.",
        "notice": "Formu göndererek kişisel verilerinizin <link>aydınlatma metni</link> kapsamında işlenmesini kabul etmiş olursunuz.",
        "link": "Aydınlatma metni"
      },
      "submit": {
        "default": "Gönder",
        "sending": "Gönderiliyor…"
      },
      "honeypot": "Bu alanı boş bırakın",
      "fallback": {
        "captcha": {
          "title": "Güvenlik doğrulaması tamamlanamadı",
          "body": "Formu bir kez daha gönderebilir ya da yazdıklarınızı doğrudan WhatsApp'tan iletebilirsiniz."
        },
        "off": {
          "title": "Bu form şu anda kapalı",
          "body": "Talebinizi WhatsApp, telefon veya e-posta ile iletebilirsiniz; ekibimiz aynı gün dönüş yapar."
        },
        "tripped": {
          "title": "Form geçici olarak duraklatıldı",
          "body": "Yoğunluk nedeniyle formu kısa süreliğine kapattık. Yazdıklarınızı tek dokunuşla WhatsApp'tan gönderebilirsiniz."
        },
        "unauthorized": {
          "title": "Form şu anda gönderim kabul edemiyor",
          "body": "Sorunu ekibimize ilettik. Bu arada bize WhatsApp'tan veya telefonla ulaşabilirsiniz."
        },
        "unavailable": {
          "title": "Talebiniz iletilemedi",
          "body": "Bağlantı sorunu nedeniyle formunuz bize ulaşmadı. Lütfen tekrar deneyin ya da yazdıklarınızı WhatsApp'tan gönderin."
        },
        "failed": {
          "title": "Talebiniz işlenemedi",
          "body": "Talebiniz bize ulaştı ancak işlenirken bir sorun oluştu. Ekibimiz inceleyecek; dilerseniz WhatsApp'tan da yazabilirsiniz."
        },
        "invalid": {
          "title": "Form gönderilemedi",
          "body": "Bazı alanlar kabul edilmedi. Lütfen girdiğiniz bilgileri kontrol edip tekrar deneyin ya da WhatsApp'tan yazın."
        },
        "whatsapp": "WhatsApp'tan gönder",
        "call": "Bizi arayın",
        "email": "E-posta gönderin",
        "whatsappIntro": "Merhaba JobsAdmire, web sitesindeki formu gönderemedim. Bilgilerim:",
        "retry": "Tekrar deneyin"
      }
    }
```

`src/messages/en.json` — the same position, the same shape:

```json
    "form": {
      "labels": {
        "name": "Full name",
        "email": "E-mail",
        "phone": "Phone",
        "company": "Company",
        "city": "City",
        "country": "Country",
        "sector": "Sector",
        "headcount": "Number of workers",
        "startWhen": "When do you need them?",
        "roleNeeded": "Roles needed",
        "message": "Message",
        "subject": "Subject",
        "iAm": "I am",
        "preferredTime": "Preferred time",
        "cv": "CV (PDF)",
        "consent": "Consent",
        "reporterName": "Your name",
        "reporterEmail": "Your e-mail",
        "reporterPhone": "Your phone",
        "suspectName": "Person or company reported",
        "suspectContact": "Their contact details",
        "description": "What happened?",
        "evidence": "Evidence files",
        "office": "Office",
        "preferredDate": "Preferred date",
        "trade": "Trade",
        "candidatesPerYear": "Candidates per year",
        "trades": "Trades covered",
        "licence": "Licence / registration",
        "durationMonths": "Duration (months)",
        "track": "Partnership type",
        "topic": "Topic",
        "portfolioUrl": "Portfolio link",
        "expectedSalary": "Expected salary",
        "expectedSalaryCurrency": "Currency",
        "currentSalary": "Current salary",
        "currentSalaryCurrency": "Currency",
        "coverLetter": "Cover letter",
        "linkedinUrl": "LinkedIn profile",
        "language": "Languages",
        "openingSlug": "Opening",
        "estimateSummary": "Estimate summary"
      },
      "placeholders": {
        "name": "Your full name",
        "email": "name@company.com",
        "phone": "+90 5xx xxx xx xx",
        "company": "Company name",
        "city": "e.g. Antalya",
        "headcount": "e.g. 10",
        "roleNeeded": "e.g. welder, waiter, driver",
        "message": "Tell us briefly what you need",
        "subject": "What is your message about?",
        "select": "Select",
        "description": "Who, when, what did they ask for? Every detail helps.",
        "trade": "e.g. CNC operator",
        "trades": "e.g. welding, construction, hotel service",
        "licence": "e.g. licence number and issuing body",
        "candidatesPerYear": "e.g. 200",
        "durationMonths": "e.g. 12",
        "portfolioUrl": "https://",
        "linkedinUrl": "https://linkedin.com/in/",
        "expectedSalary": "e.g. 45000",
        "coverLetter": "Why this role? A few lines are enough.",
        "language": "e.g. Urdu (native), English (B2)",
        "suspectName": "Person or company name",
        "suspectContact": "Phone, e-mail or profile link",
        "reporterName": "Your full name",
        "reporterEmail": "name@example.com",
        "reporterPhone": "+90 5xx xxx xx xx",
        "preferredDate": "e.g. 14 October",
        "preferredTime": "e.g. 10:00–12:00"
      },
      "hints": {
        "phone": "Include the country code.",
        "cv": "PDF only, up to 5 MB.",
        "evidence": "JPEG, PNG, WEBP or PDF; up to 8 MB each, three files at most.",
        "optional": "Optional",
        "description": "At least 20 characters.",
        "portfolioUrl": "A link starting with https://.",
        "linkedinUrl": "Optional; a link starting with https://.",
        "expectedSalary": "Monthly gross, digits only."
      },
      "errors": {
        "required": "This field is required.",
        "email": "Enter a valid e-mail address.",
        "phone": "Enter a valid phone number (at least 8 digits).",
        "min": "This entry is too short.",
        "max": "This entry is too long.",
        "url": "Enter a valid link (starting with https://).",
        "file": "The file was not accepted; check its type and size.",
        "consent": "You need to accept the privacy notice to continue.",
        "captcha": "The security check could not be completed. Please try again.",
        "invalid": "This value is not valid."
      },
      "consent": {
        "label": "I agree to the processing of my personal data as described in the <link>privacy notice</link>.",
        "notice": "By sending this form you agree to the processing of your personal data as described in the <link>privacy notice</link>.",
        "link": "Privacy notice"
      },
      "submit": {
        "default": "Send",
        "sending": "Sending…"
      },
      "honeypot": "Leave this field empty",
      "fallback": {
        "captcha": {
          "title": "The security check did not go through",
          "body": "You can send the form once more, or message us what you typed directly on WhatsApp."
        },
        "off": {
          "title": "This form is currently closed",
          "body": "You can reach us on WhatsApp, by phone or by e-mail; our team replies the same day."
        },
        "tripped": {
          "title": "The form is paused for a short while",
          "body": "We have paused the form briefly because of heavy traffic. Send what you typed to us on WhatsApp in one tap."
        },
        "unauthorized": {
          "title": "The form cannot accept submissions right now",
          "body": "We have told our team. In the meantime, reach us on WhatsApp or by phone."
        },
        "unavailable": {
          "title": "Your request could not be sent",
          "body": "A connection problem stopped your form from reaching us. Please try again, or send what you typed on WhatsApp."
        },
        "failed": {
          "title": "Your request could not be processed",
          "body": "Your request reached us but could not be processed. Our team will look into it; you can also message us on WhatsApp."
        },
        "invalid": {
          "title": "The form could not be sent",
          "body": "Some of the fields were not accepted. Please check what you entered and try again, or message us on WhatsApp."
        },
        "whatsapp": "Send on WhatsApp",
        "call": "Call us",
        "email": "E-mail us",
        "whatsappIntro": "Hello JobsAdmire, I could not send the form on your website. My details:",
        "retry": "Try again"
      }
    }
```

(Do not touch the `sys.nav` block or any other existing key.)

- [ ] **Step 4: Run the tests**

`npx prettier --write src/messages` then `npx vitest run src/messages src/design/chrome` → every file passes (the chrome tests still render under the extended messages). `npx prettier --check src/messages` → clean.

- [ ] **Step 5: Commit**

```bash
git add src/messages/tr.json src/messages/en.json src/messages/messages.test.ts
git commit -m "feat(i18n): sys.form.* copy — labels for every catalog field (W30), placeholders, hints, errors, consent, fallback panel (W9/W23)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — `action.ts` (`createFormAction`)

- [ ] **Step 1: Write the failing test**

`src/forms/__tests__/action.test.ts` (the stubs are created inside `vi.hoisted` — a `vi.mock` factory is hoisted above the imports and may not reference a top-level `const`, which is why the draft's plain-`const` version would have thrown "cannot access before initialization"):

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { CONSENT_VERSION } from '../consent';
import { createFormAction, FormActionError, FormDoorError, IDLE_FORM_STATE } from '../action';

// The action reads the request through Next/next-intl; none of that exists under Vitest, so
// each is a recorded stub and the assertions are on what the action does with the answers.
// `vi.hoisted` + `vi.mock` are both lifted above the imports by Vitest, so the order below is
// only what `import/first` wants to see.
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
vi.mock('../post', () => ({ postForm: mocks.postForm }));

const { getLocale, headersStore, redirect, postForm } = mocks;

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().min(1).email(),
  phone: z.string().regex(/(\D*\d){8,}/, { message: 'phone' }),
  message: z.string().max(5000).optional(),
});
const action = createFormAction({
  key: 'hire',
  schema,
  toFields: (p) => ({ name: p.name, email: p.email, phone: p.phone, message: p.message ?? '' }),
});

const ok = {
  kind: 'ok',
  id: 'sub_1',
  status: 'RECEIVED',
  isTest: false,
  replayed: false,
  captchaDegraded: false,
  error: null,
} as const;

function formData(entries: Record<string, string | string[]>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries))
    for (const one of Array.isArray(v) ? v : [v]) fd.append(k, one);
  return fd;
}
const valid = {
  name: 'Ali Veli',
  email: 'ali@example.com',
  phone: '+90 532 000 00 00',
  message: 'Need 10 welders',
  consent: 'on',
  honeypot: '',
  'cf-turnstile-response': 'tok_123',
  $ACTION_ID_abc: '',
};
const echoed = {
  name: 'Ali Veli',
  email: 'ali@example.com',
  phone: '+90 532 000 00 00',
  message: 'Need 10 welders',
  consent: 'on',
};

beforeEach(() => {
  headersStore.clear();
  headersStore.set('x-forwarded-for', '203.0.113.9, 10.0.0.1');
  headersStore.set('user-agent', 'Mozilla/5.0 test');
  headersStore.set('referer', 'https://www.jobsadmire.com/isci-talebi?utm=x');
  getLocale.mockResolvedValue('tr');
  postForm.mockReset();
  redirect.mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('createFormAction', () => {
  it('posts the envelope with locale, visitor and sourcePath, then redirects to /thank-you?form=<key>', async () => {
    postForm.mockResolvedValueOnce(ok);
    await expect(action(IDLE_FORM_STATE, formData(valid))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(postForm).toHaveBeenCalledWith(
      'hire',
      {
        locale: 'tr',
        consentVersion: CONSENT_VERSION,
        captchaToken: 'tok_123',
        sourcePath: '/isci-talebi',
        fields: {
          name: 'Ali Veli',
          email: 'ali@example.com',
          phone: '+90 532 000 00 00',
          message: 'Need 10 welders',
        },
      },
      { ip: '203.0.113.9', ua: 'Mozilla/5.0 test' },
    );
    expect(redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'hire' } },
      locale: 'tr',
    });
  });

  it('redirects for SPAM and replayed answers too (a bot sees success; a retry landed on the same row)', async () => {
    postForm.mockResolvedValueOnce({ ...ok, status: 'SPAM' });
    await expect(
      action(IDLE_FORM_STATE, formData({ ...valid, honeypot: 'http://spam' })),
    ).rejects.toMatchObject({ digest: 'NEXT_REDIRECT' });
    expect(postForm.mock.calls[0][1]).toMatchObject({ honeypot: 'http://spam' });
    postForm.mockResolvedValueOnce({ ...ok, replayed: true });
    await expect(action(IDLE_FORM_STATE, formData(valid))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
  });

  it('returns fieldErrors with sys.form.errors codes and echoes the typed values — never calls the door', async () => {
    const state = await action(
      IDLE_FORM_STATE,
      formData({ ...valid, name: '', email: 'nope', phone: '12', consent: '' }),
    );
    expect(state).toEqual({
      status: 'fieldErrors',
      errors: { consent: 'consent', name: 'required', email: 'email', phone: 'phone' },
      values: { name: '', email: 'nope', phone: '12', message: 'Need 10 welders', consent: '' },
    });
    expect(postForm).not.toHaveBeenCalled();
  });

  it('skips the consent check for a notice-mode spec', async () => {
    const notice = createFormAction({
      key: 'callback',
      schema,
      consent: 'notice',
      toFields: (p) => ({ name: p.name }),
    });
    postForm.mockResolvedValueOnce(ok);
    await expect(
      notice(IDLE_FORM_STATE, formData({ ...valid, consent: '' })),
    ).rejects.toMatchObject({ digest: 'NEXT_REDIRECT' });
  });

  it('200 + FAILED → error/failed with the visitor-safe message', async () => {
    postForm.mockResolvedValueOnce({ ...ok, status: 'FAILED', error: 'This opening is closed.' });
    const state = await action(IDLE_FORM_STATE, formData(valid));
    expect(state).toEqual({
      status: 'error',
      result: { kind: 'failed', error: 'This opening is closed.' },
      values: echoed,
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it.each([
    [{ kind: 'tripped' }],
    [{ kind: 'captcha' }],
    [{ kind: 'off' }],
    [{ kind: 'unauthorized' }],
    [{ kind: 'unavailable', cause: 'timeout' }],
    [{ kind: 'invalid', message: 'Invalid form fields' }],
  ])('passes %o through as an error state with the echoed values', async (result) => {
    postForm.mockResolvedValueOnce(result);
    const state = await action(IDLE_FORM_STATE, formData(valid));
    expect(state).toEqual({ status: 'error', result, values: echoed });
  });

  it('maps the three kinds of throw from toFields: field-coded refusal, visitor refusal, door failure, crash', async () => {
    const make = (thrower: () => never) =>
      createFormAction({ key: 'careers', schema, toFields: thrower });
    expect(
      await make(() => {
        throw new FormActionError('', { name: 'cv', code: 'file' });
      })(IDLE_FORM_STATE, formData(valid)),
    ).toEqual({ status: 'fieldErrors', errors: { cv: 'file' }, values: echoed });
    expect(
      await make(() => {
        throw new FormActionError('CV must be a PDF under 5 MB.');
      })(IDLE_FORM_STATE, formData(valid)),
    ).toEqual({
      status: 'error',
      result: { kind: 'failed', error: 'CV must be a PDF under 5 MB.' },
      values: echoed,
    });
    expect(
      await make(() => {
        throw new FormDoorError({ kind: 'off' });
      })(IDLE_FORM_STATE, formData(valid)),
    ).toEqual({ status: 'error', result: { kind: 'off' }, values: echoed });
    expect(
      await make(() => {
        throw new Error('boom');
      })(IDLE_FORM_STATE, formData(valid)),
    ).toEqual({
      status: 'error',
      result: { kind: 'unavailable', cause: 'server' },
      values: echoed,
    });
    expect(postForm).not.toHaveBeenCalled();
  });

  it('never echoes a File and never validates the internal keys', async () => {
    const fd = formData({ ...valid });
    fd.append('cv', new File([new Uint8Array(8)], 'cv.pdf', { type: 'application/pdf' }));
    postForm.mockResolvedValueOnce({ kind: 'tripped' });
    const state = await action(IDLE_FORM_STATE, fd);
    expect(state).toEqual({ status: 'error', result: { kind: 'tripped' }, values: echoed });
  });

  it('falls back to the default locale, a null ip for a non-IP hop, and no sourcePath without a referer', async () => {
    getLocale.mockResolvedValueOnce('de');
    headersStore.set('x-forwarded-for', 'unknown');
    headersStore.delete('referer');
    postForm.mockResolvedValueOnce(ok);
    await expect(action(IDLE_FORM_STATE, formData(valid))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    const [, envelope, visitor] = postForm.mock.calls[0];
    expect(envelope.locale).toBe('tr');
    expect(envelope.sourcePath).toBeUndefined();
    expect(visitor).toEqual({ ip: null, ua: 'Mozilla/5.0 test' });
    expect(redirect.mock.calls[0][0]).toMatchObject({ locale: 'tr' });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

`npx vitest run src/forms/__tests__/action.test.ts` → `Error: Failed to resolve import "../action"`.

- [ ] **Step 3: Implement**

`src/forms/action.ts`:

```ts
import 'server-only';
import { isIP } from 'node:net';
import { hasLocale } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import type { z } from 'zod';
import type { FormKey } from '@/analytics/forms';
import { redirect } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { fieldErrorsFromIssues } from './errors';
import { postForm } from './post';
import {
  CAPTCHA_FIELD,
  CONSENT_FIELD,
  FormActionError,
  FormDoorError,
  HONEYPOT_FIELD,
  IDLE_FORM_STATE,
  type FormActionState,
} from './types';
import { buildEnvelope, type WireFields } from './wire';

export type { FormActionState, FormErrorResult, FormFallbackKind } from './types';
export { IDLE_FORM_STATE, FormActionError, FormDoorError };

/**
 * One form's contract. `key` is `FormKey`-typed (R55) so an unlisted key is a compile error;
 * `schema` validates the posted string fields (Zod issues become `sys.form.errors.*` codes,
 * see `errors.ts`); `toFields` maps the parsed object onto the door's catalog names — it also
 * receives the raw `FormData` so a page can pull a `File` out and upload it first (careers CV,
 * fraud evidence — `uploads.ts`) and put the returned key on the wire. Throw `FormActionError`
 * from there for a visitor-side refusal (with `field` to land it on one input), `FormDoorError`
 * for a door-side failure; `uploads.ts` already does both.
 *
 * `consent: 'notice'` is for the designs that carry the KVKK line without a checkbox (the
 * Hire quick-quote card); the wire always carries `CONSENT_VERSION` either way.
 */
export type FormSpec<S extends z.ZodTypeAny> = {
  key: FormKey;
  schema: S;
  toFields: (parsed: z.infer<S>, data: FormData) => WireFields | Promise<WireFields>;
  consent?: 'checkbox' | 'notice';
};

/** Keys the shell adds, and React's progressive-enhancement fields — never form data. */
const isInternalKey = (key: string) =>
  key === HONEYPOT_FIELD || key === CAPTCHA_FIELD || key.startsWith('$ACTION');

const MAX_ECHO = 5000;

/** The typed string values, echoed back so a failed submit never empties the form and the
 *  fallback panel can prefill WhatsApp. Files and internal keys are never echoed; the consent
 *  tick is (`'on'`), so the checkbox survives a field error on another input. */
function echoValues(data: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of data.entries()) {
    if (isInternalKey(key) || typeof value !== 'string') continue;
    if (!(key in out)) out[key] = value.slice(0, MAX_ECHO);
  }
  return out;
}

/** FormData → the object the page schema parses. Repeated keys (checkbox groups, multi-file
 *  inputs) become arrays; single ones stay scalar (`File` included — the schema decides). */
function toObject(data: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of new Set(data.keys())) {
    if (isInternalKey(key)) continue;
    const all = data.getAll(key);
    out[key] = all.length > 1 ? all : all[0];
  }
  return out;
}

const str = (v: FormDataEntryValue | null): string | null => (typeof v === 'string' ? v : null);

/** The page path of the referer, for the door's `sourcePath` — never the query string. */
function sourcePathOf(referer: string | null): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).pathname;
  } catch {
    return null;
  }
}

/** The visitor's own address: the first `x-forwarded-for` hop when it is a bare IP (the door
 *  validates with `isIP` and would otherwise fall back to Vercel's egress), else `x-real-ip`,
 *  else nothing. Never logged here — the door hashes it and this module never persists it. */
function visitorOf(h: Awaited<ReturnType<typeof headers>>) {
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const real = h.get('x-real-ip')?.trim() ?? '';
  const ip = isIP(forwarded) ? forwarded : isIP(real) ? real : null;
  const ua = h.get('user-agent') || null;
  return { ip, ua };
}

/**
 * Builds the `(prev, FormData) => state` function `useActionState` drives. Pages wrap the
 * returned function in their own `'use server'` module (see docs/ARCHITECTURE.md § Forms flow)
 * — this file is `server-only`, not `'use server'`, because a `'use server'` module may export
 * only async functions and this is a factory.
 *
 * Success is a redirect to `/thank-you?form=<key>` (D13) for every 200 whose `status` is not
 * `FAILED` — RECEIVED, HANDLED, SPAM (a bot sees success) and `replayed` (a retry landed on the
 * same row) all count. Everything else is an `error` state the shell renders as the D11
 * fallback panel, with the typed values echoed for the WhatsApp prefill.
 */
export function createFormAction<S extends z.ZodTypeAny>(spec: FormSpec<S>) {
  const consentMode = spec.consent ?? 'checkbox';
  return async function formAction(
    _prev: FormActionState,
    data: FormData,
  ): Promise<FormActionState> {
    const values = echoValues(data);

    const errors: Record<string, string> = {};
    if (consentMode === 'checkbox' && data.get(CONSENT_FIELD) !== 'on')
      errors[CONSENT_FIELD] = 'consent';
    const parsed = spec.schema.safeParse(toObject(data));
    if (!parsed.success) Object.assign(errors, fieldErrorsFromIssues(parsed.error.issues));
    if (Object.keys(errors).length) return { status: 'fieldErrors', errors, values };

    let fields: WireFields;
    try {
      fields = await spec.toFields(parsed.data, data);
    } catch (err) {
      if (err instanceof FormActionError) {
        if (err.field)
          return { status: 'fieldErrors', errors: { [err.field.name]: err.field.code }, values };
        return { status: 'error', result: { kind: 'failed', error: err.visitorMessage }, values };
      }
      if (err instanceof FormDoorError) return { status: 'error', result: err.result, values };
      console.error('[formAction] toFields threw', { formKey: spec.key });
      return { status: 'error', result: { kind: 'unavailable', cause: 'server' }, values };
    }

    const requested = await getLocale();
    const locale: Locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;
    const h = await headers();
    const envelope = buildEnvelope({
      locale,
      fields,
      captchaToken: str(data.get(CAPTCHA_FIELD)),
      honeypot: str(data.get(HONEYPOT_FIELD)),
      sourcePath: sourcePathOf(h.get('referer')),
    });
    const result = await postForm(spec.key, envelope, visitorOf(h));

    if (result.kind === 'ok' && result.status !== 'FAILED') {
      // Throws NEXT_REDIRECT — deliberately outside any try/catch above.
      redirect({ href: { pathname: '/thank-you', query: { form: spec.key } }, locale });
    }
    if (result.kind === 'ok')
      return { status: 'error', result: { kind: 'failed', error: result.error }, values };
    return { status: 'error', result, values };
  };
}
```

- [ ] **Step 4: Run the tests + typecheck**

`npx prettier --write src/forms` then `npx vitest run src/forms` → `Test Files 4 passed`, 38 tests. `npx tsc --noEmit` → clean. `npx eslint src/forms` → clean.

- [ ] **Step 5: Commit**

```bash
git add src/forms/action.ts src/forms/__tests__/action.test.ts
git commit -m "feat(forms): createFormAction — Zod → field codes, consent/honeypot/captcha, visitor headers, D13 redirect

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — `uploads.ts` (W29: the careers CV and fraud-evidence helpers)

- [ ] **Step 1: Write the failing test**

`src/forms/__tests__/uploads.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FormActionError, FormDoorError } from '../types';
import {
  isFile,
  MAX_CV_BYTES,
  MAX_EVIDENCE_BYTES,
  uploadCv,
  uploadFraudEvidence,
  type UploadDeps,
} from '../uploads';

const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com',
  OPS_WEBSITE_WRITE_TOKEN: 'wsw_' + 'a'.repeat(48),
} as NodeJS.ProcessEnv;
const visitor = { ip: '203.0.113.9', ua: 'Mozilla/5.0 test' };

const file = (name: string, type: string, size = 1024) =>
  new File([new Uint8Array(size)], name, { type });
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

let fetchMock: ReturnType<typeof vi.fn>;
let deps: UploadDeps;

beforeEach(() => {
  fetchMock = vi.fn();
  deps = { fetch: fetchMock as unknown as typeof fetch, env };
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('isFile', () => {
  it('tells a File from a string FormData entry', () => {
    expect(isFile(file('a.pdf', 'application/pdf'))).toBe(true);
    expect(isFile('a.pdf')).toBe(false);
    expect(isFile(null)).toBe(false);
  });
});

describe('uploadCv', () => {
  it('posts the PDF as multipart `file` to the public careers route (no token) and returns the key', async () => {
    fetchMock.mockResolvedValueOnce(
      json(201, {
        data: { url: 'https://x/y', key: 'careers-cv/abc-123.pdf', fileName: 'cv.pdf' },
      }),
    );
    const cv = file('cv.pdf', 'application/pdf');
    expect(await uploadCv(cv, deps)).toEqual({ cvKey: 'careers-cv/abc-123.pdf' });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://operations.example.com/api/careers/upload-cv');
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(init.headers).toBeUndefined();
    expect(init.signal).toBeInstanceOf(AbortSignal);
    const body = init.body as FormData;
    const sent = body.get('file');
    expect(isFile(sent) && sent.name).toBe('cv.pdf');
    expect([...body.keys()]).toEqual(['file']);
  });

  it('refuses an empty file, a non-PDF, a name without .pdf and an oversize file before any call', async () => {
    const cases = [
      file('cv.pdf', 'application/pdf', 0),
      file('cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
      file('cv', 'application/pdf'),
      file('cv.pdf', 'application/pdf', MAX_CV_BYTES + 1),
    ];
    for (const f of cases) {
      const err = await uploadCv(f, deps).catch((e: unknown) => e);
      expect(err).toBeInstanceOf(FormActionError);
      expect((err as FormActionError).field).toEqual({ name: 'cv', code: 'file' });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('lands the refusal on the field the page names', async () => {
    const err = await uploadCv(file('cv', 'application/pdf'), { ...deps, field: 'resume' }).catch(
      (e: unknown) => e,
    );
    expect((err as FormActionError).field).toEqual({ name: 'resume', code: 'file' });
  });

  it('a door 400 is a file refusal; a key that is not a careers-cv PDF key is an outage', async () => {
    fetchMock.mockResolvedValueOnce(json(400, { message: 'Please upload your CV as a PDF file.' }));
    await expect(uploadCv(file('cv.pdf', 'application/pdf'), deps)).rejects.toMatchObject({
      name: 'FormActionError',
      field: { name: 'cv', code: 'file' },
    });
    fetchMock.mockResolvedValueOnce(json(201, { data: { key: 'general/abc.pdf' } }));
    await expect(uploadCv(file('cv.pdf', 'application/pdf'), deps)).rejects.toMatchObject({
      name: 'FormDoorError',
      result: { kind: 'unavailable', cause: 'server' },
    });
  });

  it('maps door failures like postForm does, without a retry', async () => {
    const cv = file('cv.pdf', 'application/pdf');
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 503 }));
    await expect(uploadCv(cv, deps)).rejects.toMatchObject({
      result: { kind: 'unavailable', cause: 'server' },
    });
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(uploadCv(cv, deps)).rejects.toMatchObject({
      result: { kind: 'unavailable', cause: 'network' },
    });
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 429 }));
    await expect(uploadCv(cv, deps)).rejects.toMatchObject({ result: { kind: 'tripped' } });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('is unauthorized without OPS_API_URL, with no call', async () => {
    await expect(
      uploadCv(file('cv.pdf', 'application/pdf'), {
        ...deps,
        env: { NODE_ENV: 'test' } as NodeJS.ProcessEnv,
      }),
    ).rejects.toMatchObject({ result: { kind: 'unauthorized' } });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('uploadFraudEvidence', () => {
  it('posts to the door with the write token, the visitor headers and ONLY the `file` part', async () => {
    fetchMock.mockResolvedValueOnce(
      json(201, {
        data: {
          key: 'website-fraud/abc-123.png',
          mimeType: 'image/png',
          sizeBytes: 1024,
          dryRun: false,
        },
      }),
    );
    const shot = file('shot.png', 'image/png');
    expect(await uploadFraudEvidence(shot, visitor, deps)).toEqual({
      key: 'website-fraud/abc-123.png',
    });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://operations.example.com/api/website/v1/uploads/fraud-evidence');
    expect(init.headers).toEqual({
      Authorization: `Bearer ${env.OPS_WEBSITE_WRITE_TOKEN}`,
      'X-Website-Visitor-Ip': '203.0.113.9',
      'X-Website-Visitor-Ua': 'Mozilla/5.0 test',
    });
    expect([...(init.body as FormData).keys()]).toEqual(['file']);
  });

  it('refuses an empty or oversize file before any call, on the `evidence` field by default', async () => {
    for (const f of [
      file('a.png', 'image/png', 0),
      file('a.png', 'image/png', MAX_EVIDENCE_BYTES + 1),
    ]) {
      const err = await uploadFraudEvidence(f, visitor, deps).catch((e: unknown) => e);
      expect(err).toBeInstanceOf(FormActionError);
      expect((err as FormActionError).field).toEqual({ name: 'evidence', code: 'file' });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('a door 400 (sniff failed) is a file refusal; a null key (test-class dry run) is an outage', async () => {
    fetchMock.mockResolvedValueOnce(
      json(400, {
        code: 'FRAUD_EVIDENCE_TYPE',
        message: 'Only JPEG, PNG, WEBP or PDF files are accepted.',
      }),
    );
    await expect(
      uploadFraudEvidence(file('a.gif', 'image/gif'), visitor, deps),
    ).rejects.toMatchObject({
      field: { name: 'evidence', code: 'file' },
    });
    fetchMock.mockResolvedValueOnce(json(201, { data: { key: null, dryRun: true } }));
    await expect(
      uploadFraudEvidence(file('a.png', 'image/png'), visitor, deps),
    ).rejects.toMatchObject({
      result: { kind: 'unavailable', cause: 'server' },
    });
  });

  it('401 → unauthorized, 404 → off; no token → unauthorized without a call', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));
    await expect(
      uploadFraudEvidence(file('a.png', 'image/png'), visitor, deps),
    ).rejects.toMatchObject({
      result: { kind: 'unauthorized' },
    });
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    await expect(
      uploadFraudEvidence(file('a.png', 'image/png'), visitor, deps),
    ).rejects.toMatchObject({
      result: { kind: 'off' },
    });
    await expect(
      uploadFraudEvidence(file('a.png', 'image/png'), visitor, {
        ...deps,
        env: { ...env, OPS_WEBSITE_WRITE_TOKEN: '' } as NodeJS.ProcessEnv,
      }),
    ).rejects.toBeInstanceOf(FormDoorError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

`npx vitest run src/forms/__tests__/uploads.test.ts` → `Error: Failed to resolve import "../uploads"`.

- [ ] **Step 3: Implement**

`src/forms/uploads.ts`:

```ts
import 'server-only';
import { doorBase, doorConfig } from './env';
import {
  FormActionError,
  FormDoorError,
  type FormErrorResult,
  type PostFormVisitor,
} from './types';

/**
 * W29 — the two upload doors a page calls from an async `toFields` BEFORE the envelope is
 * built (docs/INTEGRATIONS.md I4/I5). Both return only the object KEY the catalog expects
 * (`cvKey`, `evidenceKeys[]`); the browser never talks to storage or to Operations.
 *
 * Refusals are visitor-side (`FormActionError` with `field` + code `file` → the error text
 * lands under the input) or door-side (`FormDoorError` → the same fallback panel `postForm`
 * would show). One attempt each — a retry would upload the bytes twice; W3's retry rule is
 * for the idempotent form post.
 */

/** careers-public's caps (`careers-public.controller.ts`): PDF only, 5 MB. */
export const MAX_CV_BYTES = 5 * 1024 * 1024;
/** website/fraud-evidence-file.ts: 8 MB per file, three files per report. */
export const MAX_EVIDENCE_BYTES = 8 * 1024 * 1024;
export const MAX_EVIDENCE_FILES = 3;
export const UPLOAD_TIMEOUT_MS = 15_000;

/** What the door hands back — mirrored from the catalog's `cvKey` / `evidenceKeys` patterns. */
const CV_KEY_RE = /^careers-cv\/[A-Za-z0-9._-]+\.pdf$/i;
const EVIDENCE_KEY_RE = /^website-fraud\/[A-Za-z0-9._-]+$/;
const MAX_UA = 500;

export type UploadDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };
type Opts = { field?: string } & UploadDeps;

/** A `FormData` entry that is a file (a string entry is never one). */
export function isFile(v: unknown): v is File {
  return typeof File !== 'undefined' && v instanceof File;
}

const refuse = (field: string, why: string) =>
  new FormActionError(why, { name: field, code: 'file' });

const isTimeout = (err: unknown) =>
  err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');

/** Non-2xx / no answer → the door-side result the fallback panel understands. */
function doorFailure(status: number): FormErrorResult {
  if (status === 401) return { kind: 'unauthorized' };
  if (status === 404) return { kind: 'off' };
  if (status === 429) return { kind: 'tripped' };
  return { kind: 'unavailable', cause: 'server' };
}

async function send(
  url: string,
  file: File,
  headers: Record<string, string> | undefined,
  deps: UploadDeps,
): Promise<{ status: number; json: unknown }> {
  const body = new FormData();
  body.append('file', file, file.name);
  const doFetch = deps.fetch ?? fetch;
  let res: Response;
  try {
    res = await doFetch(url, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(deps.timeoutMs ?? UPLOAD_TIMEOUT_MS),
    });
  } catch (err) {
    throw new FormDoorError({ kind: 'unavailable', cause: isTimeout(err) ? 'timeout' : 'network' });
  }
  return { status: res.status, json: await res.json().catch(() => null) };
}

const keyOf = (json: unknown): unknown =>
  typeof json === 'object' && json !== null && typeof (json as { data?: unknown }).data === 'object'
    ? ((json as { data: { key?: unknown } }).data?.key ?? null)
    : null;

/**
 * `POST ${OPS_API_URL}/api/careers/upload-cv` (public, multipart `file`, PDF ≤ 5 MB). The
 * key comes back as `careers-cv/<uuid><ext>`, so the sent filename must end in `.pdf` for the
 * catalog's `cvKey` pattern to accept it — checked here, not left to the door.
 */
export async function uploadCv(file: File, opts: Opts = {}): Promise<{ cvKey: string }> {
  const field = opts.field ?? 'cv';
  if (file.size === 0) throw refuse(field, 'empty file');
  if (file.type !== 'application/pdf' || !/\.pdf$/i.test(file.name))
    throw refuse(field, 'not a PDF');
  if (file.size > MAX_CV_BYTES) throw refuse(field, 'over 5 MB');
  const base = doorBase(opts.env ?? process.env);
  if (!base) {
    console.error('[uploadCv] OPS_API_URL not configured');
    throw new FormDoorError({ kind: 'unauthorized' });
  }
  const { status, json } = await send(`${base}/api/careers/upload-cv`, file, undefined, opts);
  if (status === 400) throw refuse(field, 'door refused the file');
  if (status < 200 || status >= 300) {
    console.error('[uploadCv] door answered', { status });
    throw new FormDoorError(doorFailure(status));
  }
  const key = keyOf(json);
  if (typeof key !== 'string' || !CV_KEY_RE.test(key)) {
    console.error('[uploadCv] malformed answer from the door');
    throw new FormDoorError({ kind: 'unavailable', cause: 'server' });
  }
  return { cvKey: key };
}

/**
 * `POST ${OPS_API_URL}/api/website/v1/uploads/fraud-evidence` with the write token — the
 * door sniffs the bytes (JPEG/PNG/WEBP/PDF), so the client-declared type is not checked here;
 * the route takes ONLY the `file` part (any other part is a 400). A null `key` is the test
 * token's dry run, which the visitor path never uses — treated as an outage, never as success.
 */
export async function uploadFraudEvidence(
  file: File,
  visitor: PostFormVisitor,
  opts: Opts = {},
): Promise<{ key: string }> {
  const field = opts.field ?? 'evidence';
  if (file.size === 0) throw refuse(field, 'empty file');
  if (file.size > MAX_EVIDENCE_BYTES) throw refuse(field, 'over 8 MB');
  const door = doorConfig(opts.env ?? process.env);
  if (!door) {
    console.error('[uploadFraudEvidence] OPS_API_URL / OPS_WEBSITE_WRITE_TOKEN not configured');
    throw new FormDoorError({ kind: 'unauthorized' });
  }
  const headers: Record<string, string> = { Authorization: `Bearer ${door.token}` };
  if (visitor.ip) headers['X-Website-Visitor-Ip'] = visitor.ip;
  if (visitor.ua) headers['X-Website-Visitor-Ua'] = visitor.ua.slice(0, MAX_UA);
  const { status, json } = await send(
    `${door.base}/api/website/v1/uploads/fraud-evidence`,
    file,
    headers,
    opts,
  );
  if (status === 400) throw refuse(field, 'door refused the file');
  if (status < 200 || status >= 300) {
    console.error('[uploadFraudEvidence] door answered', { status });
    throw new FormDoorError(doorFailure(status));
  }
  const key = keyOf(json);
  if (typeof key !== 'string' || !EVIDENCE_KEY_RE.test(key)) {
    console.error('[uploadFraudEvidence] no usable key from the door (dry run or malformed)');
    throw new FormDoorError({ kind: 'unavailable', cause: 'server' });
  }
  return { key };
}
```

- [ ] **Step 4: Run the tests + typecheck**

`npx prettier --write src/forms` then `npx vitest run src/forms` → `Test Files 5 passed`, 49 tests. `npx tsc --noEmit` → clean. `npx eslint src/forms` → clean.

- [ ] **Step 5: Commit**

```bash
git add src/forms/uploads.ts src/forms/__tests__/uploads.test.ts
git commit -m "feat(forms): uploadCv / uploadFraudEvidence helpers for async toFields (W29)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 6 — client islands: `FormErrorsContext`, `Field`, `Turnstile`, `FallbackPanel`, `FormShell`

- [ ] **Step 1: Write the failing tests**

`src/forms/__tests__/Field.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Field } from '../client/Field';
import { FormErrorsContext } from '../client/FormErrorsContext';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

const copy = tr.sys.form;

afterEach(() => vi.restoreAllMocks());

describe('Field', () => {
  it('reads label, placeholder and hint from sys.form.* by name', () => {
    renderWithIntl(<Field name="phone" type="tel" required />);
    const input = screen.getByLabelText(`${copy.labels.phone} *`);
    expect(input).toHaveAttribute('placeholder', copy.placeholders.phone);
    expect(input).toHaveAttribute('id', 'f-phone');
    expect(screen.getByText(copy.hints.phone)).toBeInTheDocument();
  });

  it('marks a non-required field "optional" unless a hint is passed, and hint="" silences it', () => {
    const { unmount } = renderWithIntl(<Field name="company" />);
    expect(screen.getByText(copy.hints.optional)).toBeInTheDocument();
    unmount();
    renderWithIntl(<Field name="city" hint="" />);
    expect(screen.queryByText(copy.hints.optional)).toBeNull();
  });

  it('W30: a name without a sys.form.labels entry must pass label — throws outside production', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderWithIntl(<Field name="cvKey" />)).toThrow(/sys\.form\.labels\.cvKey/);
    renderWithIntl(<Field name="cvKey" label="Attached CV" />);
    expect(screen.getByLabelText('Attached CV')).toBeInTheDocument();
  });

  it('renders the error text and echoed value from the context, never for a file input', () => {
    renderWithIntl(
      <FormErrorsContext.Provider
        value={{ errors: { email: 'email', cv: 'file' }, values: { email: 'nope', cv: 'x' } }}
      >
        <Field name="email" type="email" />
        <Field name="cv" type="file" accept="application/pdf" />
      </FormErrorsContext.Provider>,
    );
    const email = screen.getByLabelText(copy.labels.email);
    expect(email).toHaveValue('nope');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(copy.labels.cv)).not.toHaveAttribute('value');
    const alerts = screen.getAllByRole('alert').map((a) => a.textContent);
    expect(alerts).toEqual([copy.errors.email, copy.errors.file]);
  });

  it('renders a select with the placeholder option first and echoes the chosen value', () => {
    renderWithIntl(
      <FormErrorsContext.Provider value={{ errors: {}, values: { iAm: 'hr_agency' } }}>
        <Field
          name="iAm"
          as="select"
          options={[
            { value: 'direct_employer', label: 'Employer' },
            { value: 'hr_agency', label: 'HR agency' },
          ]}
        />
      </FormErrorsContext.Provider>,
    );
    const select = screen.getByLabelText(copy.labels.iAm);
    expect(select.tagName).toBe('SELECT');
    expect(select).toHaveValue('hr_agency');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      copy.placeholders.select,
      'Employer',
      'HR agency',
    ]);
  });
});
```

`src/forms/__tests__/Turnstile.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Turnstile, TURNSTILE_SCRIPT } from '../client/Turnstile';
import { CAPTCHA_FIELD } from '../types';

const scriptTags = () => document.querySelectorAll(`script[src="${TURNSTILE_SCRIPT}"]`);
const hidden = () => document.querySelector<HTMLInputElement>(`input[name="${CAPTCHA_FIELD}"]`)!;

afterEach(() => {
  delete window.turnstile;
  scriptTags().forEach((s) => s.remove());
});

// No intl provider: the widget carries no copy of its own.
function Harness({ siteKey = '1x00000000000000000000AA' }: { siteKey?: string }) {
  return (
    <form data-testid="f">
      <label htmlFor="n">Name</label>
      <input id="n" name="name" />
      <Turnstile siteKey={siteKey} locale="tr" />
    </form>
  );
}

describe('Turnstile', () => {
  it('renders the host and an empty hidden token input, and loads NO script until the visitor interacts (W13 amended)', async () => {
    render(<Harness />);
    expect(screen.getByTestId('turnstile')).toBeInTheDocument();
    expect(hidden()).toHaveValue('');
    expect(scriptTags()).toHaveLength(0);
    await userEvent.click(screen.getByLabelText('Name'));
    expect(scriptTags()).toHaveLength(1);
    expect(scriptTags()[0]).toHaveAttribute('async');
    await userEvent.click(screen.getByLabelText('Name'));
    expect(scriptTags()).toHaveLength(1);
  });

  it('renders the widget through the API when it is already on the page and fills the token from its callback', () => {
    const api = {
      render: vi.fn((_el: HTMLElement, opts: Record<string, unknown>) => {
        (opts.callback as (t: string) => void)('tok_abc');
        return 'w1';
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    };
    window.turnstile = api;
    const { unmount } = render(<Harness />);
    expect(api.render).toHaveBeenCalledTimes(1);
    const [el, opts] = api.render.mock.calls[0];
    expect(el).toBe(screen.getByTestId('turnstile'));
    expect(opts).toMatchObject({
      sitekey: '1x00000000000000000000AA',
      appearance: 'interaction-only',
      language: 'tr',
      'response-field': false,
    });
    expect(hidden()).toHaveValue('tok_abc');
    (opts['expired-callback'] as () => void)();
    expect(hidden()).toHaveValue('');
    expect(api.reset).toHaveBeenCalledWith('w1');
    expect(scriptTags()).toHaveLength(0);
    unmount();
    expect(api.remove).toHaveBeenCalledWith('w1');
  });
});
```

`src/forms/__tests__/FallbackPanel.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FallbackPanel, whatsappFallbackText } from '../client/FallbackPanel';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

// `usePathname()` from next/navigation is null outside the App Router (R35), so `page` is '/'.
const copy = tr.sys.form.fallback;
const values = {
  name: 'Ali Veli',
  phone: '+90 532 000 00 00',
  email: 'ali@example.com',
  message: 'Need 10 welders',
};
const base = {
  values,
  formKey: 'hire' as const,
  locale: 'tr' as const,
  whatsappNumber: '905011240340',
  contact: {
    phone: '+905011240340',
    phoneDisplay: '+90 501 124 03 40',
    email: 'info@jobsadmire.com',
  },
};

let sendBeacon: ReturnType<typeof vi.fn>;
beforeEach(() => {
  sendBeacon = vi.fn(() => true);
  Object.defineProperty(navigator, 'sendBeacon', {
    value: sendBeacon,
    configurable: true,
    writable: true,
  });
  window.dataLayer = [];
});
afterEach(() => {
  Reflect.deleteProperty(navigator, 'sendBeacon');
});

describe('FallbackPanel', () => {
  it('is an alert with the per-kind copy, WhatsApp primary for tripped, and the tel/mail escape hatches', () => {
    renderWithIntl(<FallbackPanel {...base} result={{ kind: 'tripped' }} />);
    const panel = screen.getByRole('alert');
    expect(within(panel).getByRole('heading', { name: copy.tripped.title })).toBeInTheDocument();
    expect(panel).toHaveTextContent(copy.tripped.body);
    const wa = within(panel).getByRole('link', { name: copy.whatsapp });
    expect(wa).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/wa\.me\/905011240340\?text=/),
    );
    expect(decodeURIComponent(wa.getAttribute('href')!)).toContain('Ali Veli');
    expect(wa.className).toContain('bg-blue-safe'); // primary face
    expect(within(panel).getByRole('link', { name: copy.call })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(within(panel).getByRole('link', { name: copy.email })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
  });

  it('demotes WhatsApp to secondary for captcha/failed/invalid and shows the visitor-safe door error', () => {
    renderWithIntl(
      <FallbackPanel {...base} result={{ kind: 'failed', error: 'Bu ilan kapatıldı.' }} />,
    );
    const panel = screen.getByRole('alert');
    expect(within(panel).getByRole('heading', { name: copy.failed.title })).toBeInTheDocument();
    expect(panel).toHaveTextContent('Bu ilan kapatıldı.');
    expect(within(panel).getByRole('link', { name: copy.whatsapp }).className).not.toContain(
      'bg-blue-safe',
    );
  });

  it.each(['captcha', 'off', 'unauthorized', 'unavailable', 'invalid'] as const)(
    'renders the %s copy',
    (kind) => {
      const result =
        kind === 'unavailable'
          ? ({ kind, cause: 'network' } as const)
          : kind === 'invalid'
            ? ({ kind, message: 'x' } as const)
            : ({ kind } as const);
      renderWithIntl(<FallbackPanel {...base} result={result} />);
      expect(screen.getByRole('heading', { name: copy[kind].title })).toBeInTheDocument();
    },
  );

  it('sends one beacon on mount with the form key, kind and page — never the values', () => {
    const { rerender } = renderWithIntl(
      <FallbackPanel {...base} result={{ kind: 'unavailable', cause: 'timeout' }} />,
    );
    rerender(<FallbackPanel {...base} result={{ kind: 'unavailable', cause: 'timeout' }} />);
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [url, body] = sendBeacon.mock.calls[0] as [string, string];
    expect(url).toBe('/api/form-beacon');
    expect(JSON.parse(body)).toEqual({ formKey: 'hire', kind: 'unavailable', page: '/' });
    expect(body).not.toContain('Ali');
  });

  it('tracks whatsapp_click with placement form_fallback on click (W12), nothing typed', async () => {
    renderWithIntl(<FallbackPanel {...base} result={{ kind: 'off' }} />);
    const wa = screen.getByRole('link', { name: copy.whatsapp });
    wa.addEventListener('click', (e) => e.preventDefault()); // jsdom has no navigation
    await userEvent.click(wa);
    expect(window.dataLayer).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'form_fallback' },
    ]);
  });

  it('renders without the escape hatches when no contact is given', () => {
    renderWithIntl(<FallbackPanel {...base} contact={undefined} result={{ kind: 'off' }} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});

describe('whatsappFallbackText', () => {
  it('lists the known fields in a fixed order under the intro, skipping blanks', () => {
    const text = whatsappFallbackText(
      'Intro:',
      { message: 'Hi', name: 'Ali', phone: '', company: 'ACME', consent: 'on' },
      (k) => k.toUpperCase(),
    );
    expect(text).toBe('Intro:\nNAME: Ali\nCOMPANY: ACME\nMESSAGE: Hi');
  });
});
```

`src/forms/__tests__/FormShell.test.tsx`:

```tsx
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Field } from '../client/Field';
import { FormShell } from '../client/FormShell';
import type { FormActionState } from '../types';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

const copy = tr.sys.form;
const base = {
  formKey: 'hire' as const,
  locale: 'tr' as const,
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  contact: { phone: '+905011240340', email: 'info@jobsadmire.com' },
  testId: 'hire-form',
};
const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));

beforeEach(() => {
  Object.defineProperty(navigator, 'sendBeacon', {
    value: vi.fn(() => true),
    configurable: true,
    writable: true,
  });
  window.dataLayer = [];
});
afterEach(() => {
  Reflect.deleteProperty(navigator, 'sendBeacon');
});

describe('FormShell', () => {
  it('renders the fields, the hidden honeypot, the consent checkbox with the privacy link and the submit button', () => {
    renderWithIntl(
      <FormShell {...base} action={idle}>
        <Field name="name" required autoComplete="name" />
        <Field name="email" type="email" required />
        <Field name="message" as="textarea" />
      </FormShell>,
    );
    const form = screen.getByTestId('hire-form');
    expect(form).toHaveAttribute('novalidate');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    expect(within(form).getByLabelText(`${copy.labels.name} *`)).toHaveAttribute(
      'autocomplete',
      'name',
    );
    expect(within(form).getByLabelText(`${copy.labels.email} *`)).toHaveAttribute('type', 'email');
    expect(within(form).getByLabelText(copy.labels.message).tagName).toBe('TEXTAREA');
    const honeypot = form.querySelector<HTMLInputElement>('input[name="honeypot"]')!;
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(honeypot).toHaveAttribute('autocomplete', 'off');
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
    const consent = within(form).getByRole('checkbox');
    expect(consent).toHaveAttribute('name', 'consent');
    expect(consent).toBeRequired();
    expect(within(form).getByRole('link', { name: 'aydınlatma metni' })).toHaveAttribute(
      'href',
      '/gizlilik',
    );
    expect(within(form).getByRole('button', { name: copy.submit.default })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(form.querySelector('input[name="cf-turnstile-response"]')).toBeNull();
  });

  it('renders the Turnstile slot and hidden token input when a site key is configured', () => {
    renderWithIntl(
      <FormShell {...base} turnstileSiteKey="1x00000000000000000000AA" action={idle}>
        <Field name="name" />
      </FormShell>,
    );
    const form = screen.getByTestId('hire-form');
    expect(form.querySelector('input[name="cf-turnstile-response"]')).not.toBeNull();
    expect(within(form).getByTestId('turnstile')).toBeInTheDocument();
  });

  it('shows field errors from the action state next to the fields, echoes the typed values and keeps the consent tick', () => {
    const state: FormActionState = {
      status: 'fieldErrors',
      errors: { name: 'required', email: 'email' },
      values: { name: '', email: 'nope', consent: 'on' },
    };
    renderWithIntl(
      <FormShell {...base} action={idle} initialState={state}>
        <Field name="name" required />
        <Field name="email" type="email" required />
      </FormShell>,
    );
    const alerts = screen.getAllByRole('alert').map((a) => a.textContent);
    expect(alerts).toEqual([copy.errors.required, copy.errors.email]);
    expect(screen.getByLabelText(`${copy.labels.email} *`)).toHaveValue('nope');
    expect(screen.getByLabelText(`${copy.labels.email} *`)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders the consent error under the checkbox', () => {
    renderWithIntl(
      <FormShell
        {...base}
        action={idle}
        initialState={{ status: 'fieldErrors', errors: { consent: 'consent' }, values: {} }}
      >
        <Field name="name" />
      </FormShell>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(copy.errors.consent);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders the fallback panel for an error state, with the echoed values in the WhatsApp link', () => {
    const state: FormActionState = {
      status: 'error',
      result: { kind: 'tripped' },
      values: { name: 'Ali Veli', email: 'ali@example.com' },
    };
    renderWithIntl(
      <FormShell {...base} action={idle} initialState={state}>
        <Field name="name" />
      </FormShell>,
    );
    const panel = screen.getByRole('alert');
    expect(
      within(panel).getByRole('heading', { name: copy.fallback.tripped.title }),
    ).toBeInTheDocument();
    expect(
      decodeURIComponent(
        within(panel).getByRole('link', { name: copy.fallback.whatsapp }).getAttribute('href')!,
      ),
    ).toContain('Ali Veli');
    expect(screen.getByLabelText(copy.labels.name)).toHaveValue('Ali Veli');
  });

  it('submits through the action and renders its answer (an error state here)', async () => {
    const action = vi.fn(
      async (_prev: FormActionState, data: FormData): Promise<FormActionState> => ({
        status: 'error',
        result: { kind: 'unavailable', cause: 'network' },
        values: { name: String(data.get('name')) },
      }),
    );
    renderWithIntl(
      <FormShell {...base} action={action}>
        <Field name="name" />
      </FormShell>,
    );
    await userEvent.type(screen.getByLabelText(copy.labels.name), 'Ayşe');
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: copy.submit.default }));
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(action).toHaveBeenCalledTimes(1);
    const data = action.mock.calls[0][1];
    expect(data.get('name')).toBe('Ayşe');
    expect(data.get('consent')).toBe('on');
    expect(data.get('honeypot')).toBe('');
    expect(
      screen.getByRole('heading', { name: copy.fallback.unavailable.title }),
    ).toBeInTheDocument();
  });

  it('notice mode renders the KVKK line instead of a checkbox, and the title/submitLabel props', () => {
    renderWithIntl(
      <FormShell
        {...base}
        action={idle}
        consent="notice"
        title="Hızlı teklif"
        submitLabel="Teklif al"
      >
        <Field name="name" />
      </FormShell>,
    );
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.getByTestId('hire-form')).toHaveTextContent('aydınlatma metni');
    expect(screen.getByRole('heading', { name: 'Hızlı teklif' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Teklif al' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

`npx vitest run src/forms/__tests__/Field.test.tsx src/forms/__tests__/Turnstile.test.tsx src/forms/__tests__/FallbackPanel.test.tsx src/forms/__tests__/FormShell.test.tsx` → all four fail to load: `Failed to resolve import "../client/Field"` / `"../client/Turnstile"` / `"../client/FallbackPanel"` / `"../client/FormShell"`.

- [ ] **Step 3: Implement**

`src/forms/client/FormErrorsContext.tsx`:

```tsx
'use client';
import { createContext, useContext } from 'react';
import { useTranslations } from 'next-intl';
import { isFormErrorCode } from '../errors';

export type FormErrorsValue = {
  /** field name → `sys.form.errors.*` code (never text) */
  errors: Record<string, string>;
  /** the visitor's typed values, echoed by the action after a failed submit */
  values: Record<string, string>;
};

export const FormErrorsContext = createContext<FormErrorsValue>({ errors: {}, values: {} });

/** The locale's error text for one field, or undefined when it has none. */
export function useFieldError(name: string): string | undefined {
  const { errors } = useContext(FormErrorsContext);
  const sys = useTranslations('sys');
  const code = errors[name];
  if (!code) return undefined;
  return sys(`form.errors.${isFormErrorCode(code) ? code : 'invalid'}`);
}

/** What the visitor typed into this field before the last (failed) submit. */
export function useFieldValue(name: string): string | undefined {
  return useContext(FormErrorsContext).values[name];
}
```

`src/forms/client/Field.tsx`:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { FormField } from '@/design/primitives';
import { useFieldError, useFieldValue } from './FormErrorsContext';

export type FieldOption = { value: string; label: string };

export type FieldProps = {
  /** the catalog field name — also the `sys.form.labels/placeholders/hints.<name>` key */
  name: string;
  /** required when `sys.form.labels.<name>` does not exist (W30) */
  label?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  as?: 'input' | 'textarea' | 'select';
  type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'file';
  options?: FieldOption[];
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'url';
  accept?: string;
  multiple?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  className?: string;
  /** defaults to `f-<name>`; pass one when the same field name appears twice on a page */
  id?: string;
};

export const INPUT_CLASS =
  'min-h-[44px] w-full rounded-input border border-border-1 bg-white px-3 text-body-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe aria-[invalid=true]:border-danger';

/** W30: a raw field name is never a label. Dev/test throw so the page task adds the key or
 *  passes `label`; production degrades to the name and logs, rather than crashing the page. */
function missingLabel(name: string): string {
  const message = `<Field name="${name}"> has no sys.form.labels.${name} entry — add it to src/messages/{tr,en}.json or pass label=`;
  if (process.env.NODE_ENV !== 'production') throw new Error(message);
  console.error(message);
  return name;
}

/** One labelled control wired to the shell: the label/placeholder/hint come from `sys.form.*`
 *  by name unless overridden, the error text from the action's field codes, and the default
 *  value from the echoed values so a failed submit never empties what the visitor typed. */
export function Field({
  name,
  label,
  hint,
  placeholder,
  required,
  as = 'input',
  type = 'text',
  options,
  autoComplete,
  inputMode,
  accept,
  multiple,
  rows = 4,
  min,
  max,
  className,
  id = `f-${name}`,
}: FieldProps) {
  const sys = useTranslations('sys');
  const error = useFieldError(name);
  const value = useFieldValue(name);
  const labelKey = `form.labels.${name}`;
  const labelText = label ?? (sys.has(labelKey) ? sys(labelKey) : missingLabel(name));
  const placeholderKey = `form.placeholders.${name}`;
  const placeholderText =
    placeholder ?? (sys.has(placeholderKey) ? sys(placeholderKey) : undefined);
  const hintKey = `form.hints.${name}`;
  const hintText =
    hint ?? (sys.has(hintKey) ? sys(hintKey) : required ? undefined : sys('form.hints.optional'));
  const cls = [INPUT_CLASS, className].filter(Boolean).join(' ');
  return (
    <FormField id={id} label={labelText} hint={hintText} error={error} required={required}>
      {(p) =>
        as === 'textarea' ? (
          <textarea
            {...p}
            name={name}
            rows={rows}
            placeholder={placeholderText}
            defaultValue={value}
            autoComplete={autoComplete}
            className={cls}
          />
        ) : as === 'select' ? (
          <select
            {...p}
            name={name}
            defaultValue={value ?? ''}
            autoComplete={autoComplete}
            className={cls}
          >
            <option value="">{sys('form.placeholders.select')}</option>
            {(options ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...p}
            name={name}
            type={type}
            placeholder={placeholderText}
            // a file input can never be given a value; everything else echoes the last submit
            defaultValue={type === 'file' ? undefined : value}
            autoComplete={autoComplete}
            inputMode={inputMode}
            accept={accept}
            multiple={multiple}
            min={min}
            max={max}
            className={cls}
          />
        )
      }
    </FormField>
  );
}
```

`src/forms/client/Turnstile.tsx`:

```tsx
'use client';
import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/routing';
import { CAPTCHA_FIELD } from '../types';

export const TURNSTILE_SCRIPT =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
/** Fired on `document` once the script has loaded, so every widget on the page mounts. */
const READY_EVENT = 'ja:turnstile-ready';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Appends the script once per document. */
function loadScript(): void {
  if (window.turnstile || document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`)) return;
  const s = document.createElement('script');
  s.src = TURNSTILE_SCRIPT;
  s.async = true;
  s.defer = true;
  s.addEventListener('load', () => document.dispatchEvent(new Event(READY_EVENT)));
  document.head.appendChild(s);
}

/**
 * Cloudflare Turnstile (I17). The SECRET is held by Operations; this component knows only
 * the public site key. The widget renders explicitly in `interaction-only` appearance so a
 * passing visitor sees nothing, and the token lands in a hidden `cf-turnstile-response` input
 * the action reads. On error/expiry the widget is reset so the next submit carries a fresh
 * token.
 *
 * W13 amended: the script is third-party JavaScript Lighthouse counts, so it is appended on
 * the visitor's FIRST interaction with the enclosing form (focusin/pointerdown) — never on
 * page load, never through `next/script lazyOnload` (that fires at `load`, inside the audit).
 * A visitor who submits before it has loaded gets the `captcha` panel and resubmits with a
 * token; the door answers 403 for a missing token only while Ops holds a secret.
 */
export function Turnstile({ siteKey, locale }: { siteKey: string; locale: Locale }) {
  const host = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const setToken = (t: string) => {
      if (input.current) input.current.value = t;
    };
    const mount = () => {
      const api = window.turnstile;
      if (!api || widget.current) return;
      widget.current = api.render(el, {
        sitekey: siteKey,
        appearance: 'interaction-only',
        language: locale,
        'response-field': false, // we own the hidden input below
        callback: setToken,
        'expired-callback': () => {
          setToken('');
          if (widget.current) api.reset(widget.current);
        },
        'error-callback': () => {
          setToken('');
          if (widget.current) api.reset(widget.current);
          return true; // handled — no console spam from the widget
        },
      });
    };
    const form = el.closest('form');
    const wake = () => {
      form?.removeEventListener('focusin', wake);
      form?.removeEventListener('pointerdown', wake);
      loadScript();
      mount();
    };
    document.addEventListener(READY_EVENT, mount);
    if (window.turnstile) mount();
    else {
      form?.addEventListener('focusin', wake);
      form?.addEventListener('pointerdown', wake);
    }
    return () => {
      document.removeEventListener(READY_EVENT, mount);
      form?.removeEventListener('focusin', wake);
      form?.removeEventListener('pointerdown', wake);
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, locale]);

  return (
    <>
      <div ref={host} data-testid="turnstile" />
      <input ref={input} type="hidden" name={CAPTCHA_FIELD} defaultValue="" />
    </>
  );
}
```

`src/forms/client/FallbackPanel.tsx`:

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import type { FormKey } from '@/analytics/forms';
import { track } from '@/analytics/track';
import { Button } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { FormErrorResult } from '../types';

export type FallbackPanelProps = {
  result: FormErrorResult;
  values: Record<string, string>;
  formKey: FormKey;
  locale: Locale;
  whatsappNumber: string;
  /** first line of the WhatsApp prefill; defaults to `sys.form.fallback.whatsappIntro` */
  whatsappIntro?: string;
  contact?: { phone: string; phoneDisplay?: string; email: string };
};

/** Kinds where the door cannot take the lead at all right now — WhatsApp is the primary action. */
const WHATSAPP_PRIMARY = new Set<FormErrorResult['kind']>([
  'tripped',
  'unavailable',
  'unauthorized',
  'off',
]);

/** The fields worth carrying into the WhatsApp message, in reading order. Anything else the
 *  page posted (consent, chips, hidden refs, object keys) stays out — the visitor is about to
 *  send this by hand. */
const WHATSAPP_FIELDS = [
  'name',
  'reporterName',
  'company',
  'email',
  'reporterEmail',
  'phone',
  'reporterPhone',
  'city',
  'country',
  'sector',
  'trade',
  'roleNeeded',
  'headcount',
  'startWhen',
  'preferredDate',
  'preferredTime',
  'subject',
  'topic',
  'description',
  'message',
] as const;

export function whatsappFallbackText(
  intro: string,
  values: Record<string, string>,
  label: (key: string) => string,
): string {
  const lines = [intro];
  for (const key of WHATSAPP_FIELDS) {
    const v = values[key]?.trim();
    if (v) lines.push(`${label(key)}: ${v}`);
  }
  return lines.join('\n');
}

/**
 * The D11 visitor-side fallback: never a spinner, never a fake success. Copy per result kind,
 * a WhatsApp deep link prefilled with what the visitor already typed (primary when the door is
 * closed/paused/unreachable, secondary when the visitor can fix and resend), the phone and
 * e-mail escape hatches, one `/api/form-beacon` ping per mount (so a failing door shows on
 * `/api/site-health` even with Sentry down — WP6 adds Sentry) and `whatsapp_click` /
 * `call_click` / `email_click` with `placement: 'form_fallback'` (W12). Nothing typed ever
 * reaches the beacon or the dataLayer.
 */
export function FallbackPanel({
  result,
  values,
  formKey,
  locale,
  whatsappNumber,
  whatsappIntro,
  contact,
}: FallbackPanelProps) {
  const sys = useTranslations('sys');
  // R35: the real URL, not next-intl's internal key.
  const page = usePathname() ?? '/';
  const kind = result.kind;
  const beaconed = useRef(false);
  useEffect(() => {
    // Once per mount: the shell keys this panel by `result.kind`, so a second failure of a
    // different kind re-mounts and re-pings while a re-render of the same one does not.
    if (beaconed.current) return;
    beaconed.current = true;
    try {
      navigator.sendBeacon?.('/api/form-beacon', JSON.stringify({ formKey, kind, page }));
    } catch {
      /* a blocked beacon must never break the panel */
    }
  }, [formKey, kind, page]);

  const primary = WHATSAPP_PRIMARY.has(kind);
  const text = whatsappFallbackText(
    whatsappIntro ?? sys('form.fallback.whatsappIntro'),
    values,
    (k) => sys(`form.labels.${k}`),
  );
  const doorError = kind === 'failed' ? result.error : null;
  return (
    <div
      role="alert"
      data-testid="form-fallback"
      data-kind={kind}
      className="mt-6 rounded-base border border-warning-border bg-warning-surface p-5 text-ink"
    >
      <h3 className="m-0 text-body-lg font-extrabold">{sys(`form.fallback.${kind}.title`)}</h3>
      <p className="mt-2 mb-0 text-body-sm text-text-secondary">
        {sys(`form.fallback.${kind}.body`)}
      </p>
      {doorError ? <p className="mt-2 mb-0 text-body-sm font-bold">{doorError}</p> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant={primary ? 'primary' : 'secondary'}
          href={waLink(whatsappNumber, text)}
          external
          onClick={() => track('whatsapp_click', { page, locale, placement: 'form_fallback' })}
        >
          {sys('form.fallback.whatsapp')}
        </Button>
        {contact ? (
          <>
            <Button
              variant="secondary"
              href={telLink(contact.phone)}
              onClick={() => track('call_click', { page, locale, placement: 'form_fallback' })}
            >
              {sys('form.fallback.call')}
            </Button>
            <Button
              variant="ghost"
              href={mailLink(contact.email)}
              onClick={() => track('email_click', { page, locale, placement: 'form_fallback' })}
            >
              {sys('form.fallback.email')}
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
```

`src/forms/client/FormShell.tsx`:

```tsx
'use client';
import { useActionState, useMemo, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import type { FormKey } from '@/analytics/forms';
import { Button } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { CONSENT_FIELD, HONEYPOT_FIELD, IDLE_FORM_STATE, type FormActionState } from '../types';
import { FallbackPanel } from './FallbackPanel';
import { FormErrorsContext, useFieldError, useFieldValue } from './FormErrorsContext';
import { Turnstile } from './Turnstile';

export type FormShellProps = {
  /** the page's `'use server'` wrapper around `createFormAction(spec)` */
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
  formKey: FormKey;
  locale: Locale;
  /** `bundle.settings.turnstileSiteKey` — null renders no widget and sends no token */
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  whatsappIntro?: string;
  contact?: { phone: string; phoneDisplay?: string; email: string };
  /** defaults to `sys.form.submit.default`; pages pass the package's own CTA copy */
  submitLabel?: string;
  /** must match the spec's `consent` — `notice` renders the KVKK line without a checkbox */
  consent?: 'checkbox' | 'notice';
  consentLinkHref?: '/privacy' | '/kvkk';
  title?: string;
  children: ReactNode;
  className?: string;
  testId?: string;
  /** dev gallery / tests only — the state to start from instead of idle */
  initialState?: FormActionState;
};

function SubmitButton({ label }: { label: string }) {
  const sys = useTranslations('sys');
  const { pending } = useFormStatus();
  return (
    <Button
      variant="primary"
      size="lg"
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
    >
      {pending ? sys('form.submit.sending') : label}
    </Button>
  );
}

function ConsentRow({ mode, href }: { mode: 'checkbox' | 'notice'; href: '/privacy' | '/kvkk' }) {
  const sys = useTranslations('sys');
  const error = useFieldError(CONSENT_FIELD);
  const ticked = useFieldValue(CONSENT_FIELD) === 'on';
  const link = (chunks: ReactNode) => (
    <Link href={href} prefetch={false} className="font-bold text-blue-safe underline">
      {chunks}
    </Link>
  );
  if (mode === 'notice')
    return (
      <p className="m-0 text-body-sm text-text-secondary">
        {sys.rich('form.consent.notice', { link })}
      </p>
    );
  const id = `f-${CONSENT_FIELD}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-body-sm">
        <input
          id={id}
          name={CONSENT_FIELD}
          type="checkbox"
          required
          defaultChecked={ticked}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-blue-safe"
        />
        <span>{sys.rich('form.consent.label', { link })}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="m-0 text-danger text-body-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The one form wrapper every page form uses (D11/D13): `useActionState` around the page's
 * server action, the children `Field`s, the honeypot, the Turnstile widget when a site key is
 * configured, the consent row, the submit button with its pending state, and — on an `error`
 * state — the `FallbackPanel`. `noValidate` on purpose: the server validates and the errors
 * come back as `sys.form.errors.*` codes through `FormErrorsContext`, so the copy is one set,
 * localized, and reachable by assistive tech (`role="alert"` per field).
 */
export function FormShell({
  action,
  formKey,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  whatsappIntro,
  contact,
  submitLabel,
  consent = 'checkbox',
  consentLinkHref = '/privacy',
  title,
  children,
  className,
  testId,
  initialState,
}: FormShellProps) {
  const sys = useTranslations('sys');
  const [state, formAction] = useActionState(action, initialState ?? IDLE_FORM_STATE);
  const ctx = useMemo(
    () =>
      state.status === 'fieldErrors'
        ? { errors: state.errors, values: state.values }
        : state.status === 'error'
          ? { errors: {}, values: state.values }
          : { errors: {}, values: {} },
    [state],
  );
  const honeypotId = `f-${HONEYPOT_FIELD}-${formKey}`;
  return (
    <FormErrorsContext.Provider value={ctx}>
      <form
        action={formAction}
        noValidate
        data-testid={testId}
        data-form-key={formKey}
        className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}
      >
        {title ? <h3 className="m-0 text-card-title font-extrabold">{title}</h3> : null}
        {children}
        {/* The honeypot: outside the accessibility tree and the tab order, visible to bots only.
            The door reads the literal `honeypot` key and answers 200/SPAM when it is filled. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor={honeypotId}>{sys('form.honeypot')}</label>
          <input
            id={honeypotId}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {turnstileSiteKey ? <Turnstile siteKey={turnstileSiteKey} locale={locale} /> : null}
        <ConsentRow mode={consent} href={consentLinkHref} />
        <div>
          <SubmitButton label={submitLabel ?? sys('form.submit.default')} />
        </div>
        {state.status === 'error' ? (
          <FallbackPanel
            key={state.result.kind}
            result={state.result}
            values={state.values}
            formKey={formKey}
            locale={locale}
            whatsappNumber={whatsappNumber}
            whatsappIntro={whatsappIntro}
            contact={contact}
          />
        ) : null}
      </form>
    </FormErrorsContext.Provider>
  );
}
```

Notes for the implementer:

- `Field` sets `hint` to `sys.form.hints.<name>` when such a key exists (phone, cv, evidence, description, portfolioUrl, linkedinUrl, expectedSalary), else to `sys.form.hints.optional` for a non-required field — pages that want neither pass `hint=""`.
- `Button` already spreads `onClick` (its props extend `HTMLAttributes<HTMLElement>`), so the tracking handlers need no change to the primitive. `href="tel:…"`/`mailto:` fall through to a same-tab anchor (R22); the WhatsApp link is `external`. Task 3's `ContactLink` lands after this task; the three links may be moved onto it in WP2b if Task 3 wants one anchor for every contact link — the event contract is identical either way.
- `FallbackPanel` is keyed by `result.kind` in the shell, so a second failure of a different kind re-beacons while a re-render of the same one does not.
- `eslint-plugin-react-hooks` 7 (the React Compiler rules `set-state-in-effect`, `refs`, `purity`, … are all `error` under `eslint-config-next` 16) is why `Turnstile` holds no React state (the token goes straight into the hidden input through a ref) and why no `ref.current` is read during render anywhere in these files.
- The `absolute -left-[9999px]` honeypot wrapper: the shell's `<form>` is deliberately not `relative`, so the input is off-canvas of the page, not of the card.

- [ ] **Step 4: Run the tests + lint**

`npx prettier --write src/forms` then `npx vitest run src/forms` → `Test Files 9 passed`, 74 tests. `npx eslint src/forms` → clean (no `eslint-disable` anywhere). `npx tsc --noEmit` → clean.

- [ ] **Step 5: Commit**

```bash
git add src/forms/client src/forms/__tests__/Field.test.tsx src/forms/__tests__/Turnstile.test.tsx src/forms/__tests__/FormShell.test.tsx src/forms/__tests__/FallbackPanel.test.tsx
git commit -m "feat(forms): FormShell, Field (W30 labels), interaction-loaded Turnstile and the D11 FallbackPanel islands

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 7 — `/api/form-beacon` + the Operations ping on `/api/site-health`

- [ ] **Step 1: Write the failing tests**

`src/app/api/form-beacon/beacon.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import { formBeaconCount, resetFormBeacons } from './state';

const post = (body: string) =>
  POST(new Request('http://localhost/api/form-beacon', { method: 'POST', body }));

beforeEach(() => {
  resetFormBeacons();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('POST /api/form-beacon', () => {
  it('counts a valid beacon, logs it, answers 204 no-store', async () => {
    const res = await post(
      JSON.stringify({ formKey: 'hire', kind: 'unavailable', page: '/isci-talebi' }),
    );
    expect(res.status).toBe(204);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(formBeaconCount()).toBe(1);
    expect(console.error).toHaveBeenCalledWith('[form-beacon]', {
      formKey: 'hire',
      kind: 'unavailable',
      page: '/isci-talebi',
    });
  });

  it('rejects a malformed body with 400 and counts nothing', async () => {
    expect((await post('not json')).status).toBe(400);
    expect((await post(JSON.stringify({ formKey: 'nope', kind: 'x', page: '/' }))).status).toBe(
      400,
    );
    expect(
      (await post(JSON.stringify({ formKey: 'hire', kind: 'x'.repeat(40), page: '/' }))).status,
    ).toBe(400);
    expect(
      (await post(JSON.stringify({ formKey: 'hire', kind: 'off', page: '/', name: 'Ali' }))).status,
    ).toBe(400);
    expect(formBeaconCount()).toBe(0);
  });
});
```

`src/app/api/site-health/ops.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { opsPingCheck, pingOps } from './ops';

const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com',
  OPS_WEBSITE_WRITE_TOKEN: 'wsw_' + 'a'.repeat(48),
} as NodeJS.ProcessEnv;
let fetchMock: ReturnType<typeof vi.fn>;
const f = () => fetchMock as unknown as typeof fetch;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('pingOps', () => {
  it('is unconfigured without a URL/token and makes no call', async () => {
    expect(await pingOps({ NODE_ENV: 'test' } as NodeJS.ProcessEnv, f())).toEqual({
      state: 'unconfigured',
      latencyMs: null,
      captcha: null,
      trippedForms: [],
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('GETs the ping with the write token and reports ok + latency + the door facts on 200', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            tokenClass: 'write',
            moduleEnabled: true,
            captcha: 'missing',
            trippedForms: ['hire'],
          },
        }),
        { status: 200 },
      ),
    );
    const out = await pingOps(env, f());
    expect(out.state).toBe('ok');
    expect(typeof out.latencyMs).toBe('number');
    expect(out.captcha).toBe('missing');
    expect(out.trippedForms).toEqual(['hire']);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://operations.example.com/api/website/v1/ping');
    expect((init.headers as Record<string, string>).Authorization).toBe(
      `Bearer ${env.OPS_WEBSITE_WRITE_TOKEN}`,
    );
    expect(init.cache).toBe('no-store');
  });

  it('a 200 that is not the ping JSON (a login wall) is unreachable, not ok (R28)', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<html>login</html>', { status: 200 }));
    expect(await pingOps(env, f())).toMatchObject({
      state: 'unreachable',
      captcha: null,
      trippedForms: [],
    });
  });

  it('maps 404 → off, 401 → unauthorized, 5xx/network → unreachable', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    expect((await pingOps(env, f())).state).toBe('off');
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));
    expect((await pingOps(env, f())).state).toBe('unauthorized');
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 502 }));
    expect((await pingOps(env, f())).state).toBe('unreachable');
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    expect(await pingOps(env, f())).toEqual({
      state: 'unreachable',
      latencyMs: null,
      captcha: null,
      trippedForms: [],
    });
  });
});

describe('opsPingCheck', () => {
  it('ok → ok; unauthorized/unreachable → fail; off/unconfigured → skip', () => {
    const facts = { captcha: null, trippedForms: [] } as const;
    expect(opsPingCheck({ state: 'ok', latencyMs: 12, ...facts })).toBe('ok');
    expect(opsPingCheck({ state: 'unauthorized', latencyMs: 12, ...facts })).toBe('fail');
    expect(opsPingCheck({ state: 'unreachable', latencyMs: null, ...facts })).toBe('fail');
    expect(opsPingCheck({ state: 'off', latencyMs: 9, ...facts })).toBe('skip');
    expect(opsPingCheck({ state: 'unconfigured', latencyMs: null, ...facts })).toBe('skip');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

`npx vitest run src/app/api/form-beacon src/app/api/site-health/ops.test.ts` → `Failed to resolve import "./route"` / `"./ops"`.

- [ ] **Step 3: Implement**

`src/app/api/form-beacon/state.ts`:

```ts
/** How many visitor fallback panels this instance has shown (D11's client beacon). Module-level
 *  and therefore best-effort on serverless, exactly like `revalidate/state.ts`: a cold instance
 *  starts at 0 and a redeploy forgets. It is a signal for `/api/site-health` and the console
 *  log beside it, not an audit trail — WP6's Sentry wiring carries the durable record. */
let count = 0;

export function recordFormBeacon(): void {
  count += 1;
}

export function formBeaconCount(): number {
  return count;
}

/** Tests only. */
export function resetFormBeacons(): void {
  count = 0;
}
```

`src/app/api/form-beacon/route.ts` (a plain `Response`, no `next/server` import — the handler is unit-tested as a function and needs nothing from Next):

```ts
import { z } from 'zod';
import { FORM_KEYS } from '@/analytics/forms';
import { recordFormBeacon } from './state';

// The fallback panel's `navigator.sendBeacon` target (D11): a failed submission becomes
// visible here even if Sentry (WP6) is down. Text body (sendBeacon sends text/plain), never
// cached, never anything the visitor typed — the panel sends the form key, the kind, the page,
// and the schema is `strict` so a body carrying anything else is refused.
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

const BeaconSchema = z
  .object({
    formKey: z.enum(FORM_KEYS),
    kind: z.string().min(1).max(20),
    page: z.string().min(1).max(300),
  })
  .strict();

export async function POST(request: Request): Promise<Response> {
  const text = await request.text().catch(() => '');
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* not JSON */
  }
  const parsed = BeaconSchema.safeParse(json);
  if (!parsed.success) return new Response(null, { status: 400, headers: NO_STORE });
  console.error('[form-beacon]', parsed.data);
  recordFormBeacon();
  return new Response(null, { status: 204, headers: NO_STORE });
}
```

`src/app/api/site-health/ops.ts`:

```ts
import { z } from 'zod';
import { doorConfig } from '@/forms/env';
import type { CheckResult } from './checks';

export type OpsPing = {
  /** `ok` = the door answered the ping; `off` = 404 (module flag off, the Phase A default until
   *  the WP3a flip); `unauthorized` = 401 (token rotated/missing); `unreachable` = 5xx, network,
   *  timeout or a 200 that is not the ping JSON; `unconfigured` = no `OPS_API_URL`/write token
   *  in this environment. */
  state: 'ok' | 'off' | 'unauthorized' | 'unreachable' | 'unconfigured';
  latencyMs: number | null;
  /** The door's own readiness facts (`WebsitePingResult`), surfaced for the owner's check — not
   *  folded into a reason code here (FORMS_DEGRADED/HANDLER_FAILED are WP3a/WP5's). */
  captcha: 'configured' | 'missing' | null;
  trippedForms: string[];
};

const PING_TIMEOUT_MS = 3000;

const PingSchema = z.object({
  data: z.object({
    captcha: z.enum(['configured', 'missing']).nullish(),
    trippedForms: z.array(z.string()).nullish(),
  }),
});

const NONE = { captcha: null, trippedForms: [] as string[] };

/** `GET ${OPS_API_URL}/api/website/v1/ping` with the write token (any class is accepted by
 *  the door; the write token is the one the forms use, so this proves the forms' credential). */
export async function pingOps(
  env: NodeJS.ProcessEnv = process.env,
  f: typeof fetch = fetch,
): Promise<OpsPing> {
  const door = doorConfig(env);
  if (!door) return { state: 'unconfigured', latencyMs: null, ...NONE };
  const started = Date.now();
  try {
    const res = await f(`${door.base}/api/website/v1/ping`, {
      headers: { Authorization: `Bearer ${door.token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(PING_TIMEOUT_MS),
    });
    const latencyMs = Date.now() - started;
    if (res.status === 200) {
      const parsed = PingSchema.safeParse(await res.json().catch(() => null));
      if (!parsed.success) return { state: 'unreachable', latencyMs, ...NONE };
      return {
        state: 'ok',
        latencyMs,
        captcha: parsed.data.data.captcha ?? null,
        trippedForms: parsed.data.data.trippedForms ?? [],
      };
    }
    if (res.status === 404) return { state: 'off', latencyMs, ...NONE };
    if (res.status === 401) return { state: 'unauthorized', latencyMs, ...NONE };
    return { state: 'unreachable', latencyMs, ...NONE };
  } catch {
    return { state: 'unreachable', latencyMs: null, ...NONE };
  }
}

/** `off` is `skip`, not `fail`, while the door is dark by configuration (Phase A). After the
 *  WP3a flip, T15's launch checklist turns `off` into a `fail` here — one line. */
export function opsPingCheck(p: OpsPing): CheckResult {
  if (p.state === 'ok') return 'ok';
  if (p.state === 'unauthorized' || p.state === 'unreachable') return 'fail';
  return 'skip';
}
```

`src/app/api/site-health/route.ts` — replace the whole file with:

```ts
import { NextResponse } from 'next/server';
import { contentSource, getBundle } from '@/content/adapter';
// Relative on purpose: the `@/` alias covers `src/` only, and `contract/` is a sibling.
import { CONTRACT_VERSION } from '../../../../contract/website-bundle.v1';
import { formBeaconCount } from '../form-beacon/state';
import { lastRevalidateAt } from '../revalidate/state';
import { evaluate, type CheckResult, type Checks } from './checks';
import { opsPingCheck, pingOps } from './ops';

// D25: this is what the external monitor watches, so it is never cached and never answers
// from a build-time snapshot — a health check that can be stale is not a health check.
export const dynamic = 'force-dynamic';

const REVALIDATE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const settled = (r: PromiseSettledResult<unknown>): CheckResult =>
  r.status === 'fulfilled' ? 'ok' : 'fail';

export async function GET() {
  const source = contentSource();
  // The ping (≤ 3 s) runs beside the bundle checks, not after them.
  const [[tr, en], ops] = await Promise.all([
    Promise.allSettled([getBundle('tr'), getBundle('en')]),
    pingOps(),
  ]);
  const last = lastRevalidateAt();
  const checks: Checks = {
    bundleTr: settled(tr),
    bundleEn: settled(en),
    // In LOCAL the bundle ships with the deploy: there is nothing to revalidate, so a
    // timestamp would be noise. In OPS a missing or day-old one means publishes are not
    // reaching the site. (Best-effort — see `revalidate/state.ts`.)
    lastRevalidate:
      source === 'LOCAL'
        ? 'skip'
        : last === null || Date.now() - last > REVALIDATE_MAX_AGE_MS
          ? 'fail'
          : 'ok',
    // The door's own ping with the forms' write token (docs/OPERATING.md): `off` and
    // `unconfigured` are `skip` in Phase A, `unauthorized`/`unreachable` are a `fail`.
    opsPing: opsPingCheck(ops),
  };
  const { ok, reasons } = evaluate(checks);
  return NextResponse.json(
    {
      ok,
      reasons,
      checks,
      ops,
      // Best-effort per instance (form-beacon/state.ts): fallback panels shown since this
      // instance started — a rising number with `ops.state: 'ok'` is a client-side problem.
      formBeacons: formBeaconCount(),
      contractVersion: CONTRACT_VERSION,
      source,
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      at: new Date().toISOString(),
    },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
```

- [ ] **Step 4: Run the tests**

`npx prettier --write src/app/api` then `npx vitest run src/app/api` → every file passes (auth, checks, beacon, ops). `npx tsc --noEmit` → clean (`route.ts` files export only `dynamic` and their handler — Next's route type check refuses a `formBeaconCount` export from a `route.ts`, which is why the counter lives in `state.ts`). `npx eslint src/app/api` → clean.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/form-beacon src/app/api/site-health/ops.ts src/app/api/site-health/ops.test.ts src/app/api/site-health/route.ts
git commit -m "feat(ops): /api/form-beacon counter and the Operations ping on /api/site-health

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 8 — env + docs (same change set, CLAUDE.md checklist items 3–4; every edit anchored on a sentence, W45)

- [ ] **Step 1: Write the failing test** — none; `npx prettier --check docs .env.example CLAUDE.md` and the reviewer's diff are the check for this cycle.

- [ ] **Step 2:** n/a.

- [ ] **Step 3: Implement**

`.env.example` — after the line `OPS_WEBSITE_WRITE_TOKEN=` insert:

```
# Test-class door token (wst_…): the T15 synthetic-lead cron and write-class smoke on Preview only —
# never a real lead (isTest, dry-run handlers). Not read by any code until T15.
OPS_WEBSITE_TEST_TOKEN=
```

`docs/DEPLOYMENT.md` — in the environment-variables table:

- the `OPS_WEBSITE_WRITE_TOKEN` row: replace its purpose cell "Form submissions (not yet consumed by any WP1 code — `docs/ARCHITECTURE.md` § Forms flow)" with: ``Form submissions — `src/forms/post.ts` sends it as `Authorization: Bearer` on every `POST /api/website/v1/forms/:formKey`, `src/forms/uploads.ts` on the fraud-evidence upload, and `/api/site-health` pings the door with it (`src/app/api/site-health/ops.ts`). Ops treats a value shorter than 20 chars as unset; so does `src/forms/env.ts` (`postForm` returns `unauthorized` without a call, the ping reports `unconfigured`)``
- insert a new row directly after it: `` `OPS_WEBSITE_TEST_TOKEN` `` → ``Test-class door token (`wst_…`): the T15 synthetic-lead cron and any write-class smoke on Preview. Test-class submissions run the full path with `isTest: true` and `dryRun` handlers — no Inquiry, no notification, no stored evidence object — and skip Turnstile when no token is sent, so a passing synthetic lead does **not** prove the visitor captcha path (see `NEXT_PUBLIC_TURNSTILE_SITE_KEY`). Not consumed by any code yet``
- the `NEXT_PUBLIC_TURNSTILE_SITE_KEY` row: append to its purpose cell: ``. **Must be set on `staging.jobsadmire.com` before any write-class form test**: when Operations holds a Turnstile secret and the site sends no token, every write-class submission is a 403 (`captcha`) — the asymmetry in `docs/ARCHITECTURE.md` § Forms flow. The widget script loads on the visitor's first interaction with a form, never on page load (W13 amended)``

`docs/ARCHITECTURE.md` — replace the whole `## Forms flow (D11)` section (from its heading up to, not including, `## D19 — desktop-scale port checklist`) with:

```markdown
## Forms flow (D11) — built in WP2a (`src/forms/`)

Every page form is a server action built by `createFormAction(spec)` (`src/forms/action.ts`, `server-only`) and rendered by the `FormShell` island (`src/forms/client/FormShell.tsx`). The kernel is one set of modules; pages contribute only a `FormSpec` (`key: FormKey`, a Zod `schema`, `toFields` onto the door's catalog names, optional `consent: 'notice'`) and their `Field`s (`src/forms/client/Field.tsx`, which reads `sys.form.labels/placeholders/hints.<name>` by field name — W30: a name without a label entry must pass `label`, a raw field name is never rendered).

`page.tsx (server) → <FormShell action={submitX}> → useActionState → submitX ('use server' wrapper) → createFormAction: consent + Zod → toFields (uploads here) → buildEnvelope → postForm → redirect('/thank-you?form=<key>') | FormActionState`

- **Wire:** `postForm` (`src/forms/post.ts`) posts `{ locale, consentVersion, captchaToken?, honeypot?, sourcePath?, fields }` to `POST ${OPS_API_URL}/api/website/v1/forms/${formKey}` with `Authorization: Bearer $OPS_WEBSITE_WRITE_TOKEN`, `X-Website-Visitor-Ip` (the first `x-forwarded-for` hop when it is a bare IP) and `X-Website-Visitor-Ua`, `cache: 'no-store'`. `consentVersion` is the one site-wide `CONSENT_VERSION` (`src/forms/consent.ts`). The credential pair is resolved once in `src/forms/env.ts` (`doorConfig`; a token under 20 chars is "unset", as on the Ops side). The full contract as built is `docs/INTEGRATIONS.md` I4.
- **Result kinds** (`PostFormResult`, `src/forms/types.ts`): `ok` (HTTP 200 — `status` RECEIVED/HANDLED/SPAM/FAILED, `replayed`, `captchaDegraded`, `error`), `invalid` (400), `captcha` (403), `off` (404: module off, form inactive — the newsletter in Phase A — or unknown key), `tripped` (429, `fallback: 'whatsapp'`), `unauthorized` (401, or no usable URL/token here — no call is made), `unavailable` (`network` | `timeout` | `server`).
- **Retry rule (W3 — supersedes the WP1 text "not a retry queue, fallback immediately"):** at most **one immediate retry**, only after a network error, a per-attempt timeout (`AbortSignal.timeout(4000)`) or a 5xx — never after a 4xx — so the whole call is bounded by **8 s**. Every Ops deploy is a 30–60 s 502 window and the door dedupes on `(formKey, requestHash, hourBucket)`, so the retry lands on the **same row** (`replayed: true`) and counts as success. After that the visitor gets the fallback panel; leads are still never buffered on Vercel.
- **Success:** every `ok` whose `status` is not `FAILED` — RECEIVED, HANDLED, **SPAM** (a bot sees success) and replayed rows alike — redirects to `/tesekkurler?form=<key>` (D13). `ok` + `FAILED` is the door's "row durable, handler failed" answer: the visitor sees the `failed` panel with the door's visitor-safe `error` when there is one (a closed opening, a residency rule) — never a thank-you.
- **Validation:** the server is the validator (`noValidate` on the form). Zod issues become `sys.form.errors.*` **codes** (`src/forms/errors.ts`: `required`, `email`, `phone`, `min`, `max`, `url`, `file`, `consent`, `captcha`, `invalid`; a schema's own `message` may name a code) that travel in `FormActionState.fieldErrors` and are rendered per field by `Field` through `FormErrorsContext`. The typed values (and the consent tick) are echoed back so a failed submit never empties the form. A missing consent tick is a field error on `consent` (skipped for `consent: 'notice'` specs, whose design carries the KVKK line without a checkbox — the wire always carries `CONSENT_VERSION`).
- **Captcha (Turnstile) behavior is asymmetric by design:** an **auth failure** (bad/expired write token) fails closed — the submission is rejected (`unauthorized`). A **captcha infrastructure failure** (secret missing, Cloudflare unreachable) **degrades** on the Ops side: the submission is accepted behind honeypot + dedupe + rate cap, flagged `captchaDegraded`, and raises `WEBSITE_FORMS_UNAVAILABLE`. The other direction does not degrade: if this site ships **without** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` while Operations holds a secret, every write-class submission is a 403 (`captcha`) — set the site key on staging before any write-class test. The widget (`src/forms/client/Turnstile.tsx`) appends Cloudflare's script on the visitor's **first interaction** with the form (W13 amended — third-party script stays out of the Lighthouse audit), renders `interaction-only`, and writes its token to the hidden `cf-turnstile-response` input; `null` site key = no widget, no token.
- **Honeypot:** `FormShell` renders an off-canvas, `aria-hidden`, `tabIndex=-1` input named `honeypot` (the door's literal key). A filled one is sent as-is; the door answers 200/`SPAM` and the bot is redirected like anyone else.
- **Failure — the visitor-side fallback panel (`src/forms/client/FallbackPanel.tsx`), never a spinner or fake success:** copy per kind from `sys.form.fallback.<kind>.*`; a WhatsApp deep link prefilled from what the visitor typed (name, company, e-mail, phone, city, …, message — `whatsappFallbackText`), **primary** when the door cannot take the lead (`tripped`, `unavailable`, `unauthorized`, `off`) and secondary when the visitor can fix and resend (`captcha`, `invalid`, `failed`); the phone and e-mail escape hatches; one `navigator.sendBeacon('/api/form-beacon', {formKey, kind, page})` per mount (visible on `/api/site-health` as `formBeacons`, even with Sentry — WP6 — down); `whatsapp_click`/`call_click`/`email_click` with `placement: 'form_fallback'` (W12). Nothing typed reaches the beacon or the dataLayer.
- **Dedupe (Ops):** `(formKey, requestHash, hourBucket)` over the sorted normalised `fields` — `sourcePath` is not hashed, so a synthetic monitor must vary a field value, not the path.
- **Uploads (W29, `src/forms/uploads.ts`):** `uploadCv(file)` → `POST /api/careers/upload-cv` (public, PDF ≤ 5 MB, filename must end in `.pdf`) → `fields.cvKey`; `uploadFraudEvidence(file, visitor)` → `POST /api/website/v1/uploads/fraud-evidence` (write token, multipart `file` only, ≤ 8 MB, content-sniffed, one file per call, ≤ 3 keys per report) → `fields.evidenceKeys[]`. Both run inside the page's async `toFields(parsed, formData)` before the envelope is built; a visitor-side refusal throws `FormActionError` with `field` + code `file` (the error lands under the input), a door-side failure throws `FormDoorError` (the same panel `postForm` would show). One attempt each — no retry re-uploads bytes.
- Handler types on the Ops side: `INQUIRY`, `CAREERS_APPLY`, `NEWSLETTER` (double opt-in, RFC 8058 — the confirm/unsubscribe pages forward the token **only on the visitor's click**, never on page load, I12), `FRAUD_REPORT`, `CALLBACK`, `VISIT`, `CALCULATOR_QUOTE`.
```

`docs/ARCHITECTURE.md` § Operations surface — in the `GET /api/site-health` bullet, replace the sentence fragment "both bundles loaded through the adapter, plus `lastRevalidate` and `opsPing`; answers `{ ok, reasons, checks, contractVersion, source, commit, at }`" with: "both bundles loaded through the adapter, `lastRevalidate`, and since WP2a the real Operations ping (`src/app/api/site-health/ops.ts`: `GET ${OPS_API_URL}/api/website/v1/ping` with the write token, 3 s timeout) reported as `ops: { state: 'ok' | 'off' | 'unauthorized' | 'unreachable' | 'unconfigured', latencyMs, captcha, trippedForms }` and folded into the `opsPing` check (`off`/`unconfigured` = `skip` while the door is dark by configuration, `unauthorized`/`unreachable` = `fail`), plus `formBeacons` (fallback panels shown on this instance — best-effort, like `lastRevalidate`); answers `{ ok, reasons, checks, ops, formBeacons, contractVersion, source, commit, at }`".

`docs/ARCHITECTURE.md` § Operations surface — in the "**Not yet built** (no cron config in `vercel.json`, no form handlers to exercise)" bullet: replace "(no cron config in `vercel.json`, no form handlers to exercise)" with "(no cron config in `vercel.json`; the form path itself shipped in WP2a)" and replace "and a client submit-failure beacon feeding `/api/site-health`'s future "handler failures" signal" with "— the client submit-failure beacon itself (`POST /api/form-beacon`, D11) shipped in WP2a and feeds `formBeacons`".

`docs/INTEGRATIONS.md` — replace the one paragraph under `## I4 — Forms (13–15)` (the line beginning "**Direction:** Website → Ops. **Auth:** write token + Turnstile. **Shape:** `POST /api/website/v1/forms/:formKey`, contract v1") with:

```markdown
**Direction:** Website → Ops. **Auth:** write token + Turnstile. **Shape (as built, WP3a door / WP2a client — `src/forms/post.ts`):** `POST ${OPS_API_URL}/api/website/v1/forms/:formKey`, `Authorization: Bearer <write|test|previous-write>`, `Content-Type: application/json`, optional `X-Website-Visitor-Ip` (first hop, must pass `isIP`) and `X-Website-Visitor-Ua` (≤500). Body, whitelist + `forbidNonWhitelisted` (an extra top-level key is a 400): `{ locale: 'tr'|'en', consentVersion: string ≤40 (required — `CONSENT_VERSION`), captchaToken?: ≤2048, honeypot?: ≤500 (literal key), sourcePath?: ≤300, fields: Record<string, string | string[]> }`; unknown keys **inside** `fields` are silently dropped. Keys: the ten `FORM_KEYS` (`WEBSITE_FORM_KEYS` on the Ops side, same order, case-sensitive). Responses: **200** `{ data: { id, formKey, status: 'RECEIVED'|'HANDLED'|'FAILED'|'SPAM', isTest, replayed, captchaDegraded, error: string|null } }` (FAILED is still 200 — row durable, `error` non-null only for a visitor-side cause); **400** `{ message: 'Invalid form fields', errors: string[] }`; **401** `Invalid website token.` / `Website intake is not configured.`; **403** `Captcha verification failed. Please retry.`; **404** bare (module off) / `Unknown form.` / `This form is not accepting submissions.` (newsletter until D14); **429** `{ statusCode: 429, message, reason: 'tripped', fallback: 'whatsapp' }`. Order of evaluation: form → trip → whitelist → honeypot → captcha → row; dedupe on `(formKey, requestHash = sha256(formKey, isTest, honeypot, locale, sorted fields), hourBucket)` — `sourcePath` is not hashed. Uploads (`src/forms/uploads.ts`, W29): careers CV `POST /api/careers/upload-cv` (public, multipart `file`, client-declared `application/pdf`, ≤5 MB, the sent filename must end in `.pdf` because the key inherits its extension) → 201 `{ data: { key } }` → `fields.cvKey`; fraud evidence `POST /api/website/v1/uploads/fraud-evidence` (write token, multipart `file` **only** — any other part is a 400 — ≤8 MB, content-sniffed JPEG/PNG/WEBP/PDF, one file per call) → 201 `{ data: { key | null (test-class dry run), mimeType, sizeBytes, dryRun } }` → ≤3 `fields.evidenceKeys`. Field catalog per key: `apps/backend/src/modules/website/website-form-catalog.ts` in Operations (Task 8 / T0f adds `city`, `track`, `topic`, `portfolioUrl` — catalog v1.1; the per-form table joins this section in T14). **Failure/degraded:** `docs/ARCHITECTURE.md` § Forms flow — W3 one-retry rule, captcha asymmetry, the visitor fallback panel on every non-success.
```

`docs/INTEGRATIONS.md` — replace the paragraph under `## I5 — Staff application + CV proxy` with: `**Direction:** Website → Ops → \`CareersPublicService.apply\`. **Auth:** write token. **Shape:** the \`careers\` key of I4 (\`CAREERS_APPLY\`; \`openingSlug\` + \`cvKey\` required); the CV is uploaded first through the public \`POST /api/careers/upload-cv\` from the page's async \`toFields\` (\`uploadCv\`, \`src/forms/uploads.ts\`), never from the browser to storage. **Failure/degraded:** same fallback panel as I4; a refused CV is a \`file\` error under the CV input; a closed opening or residency rule comes back as 200 + \`status: 'FAILED'\` + visitor-safe \`error\`. \`CareersPublicModule\` exports \`apply\` (done in WP3a).`

`docs/INTEGRATIONS.md` — append to the paragraph under `## I12 — Newsletter confirm/unsubscribe` (after "…never a silent no-op."): ` **Rule (WP2a; Task 8 records it in Ops PRD §5.12 — W46):** the website's \`/abone-onay\` / \`/abonelikten-cik\` pages forward the token to the door **only on the visitor's click** — never on page load, prefetch or render — because mail-link scanners would otherwise consume the one-shot confirm token; the RFC 8058 one-click POST is forwarded as a POST by a route handler. Shape as built: \`GET /api/website/v1/newsletter/confirm?token=\` → 200 \`{ data: { outcome: 'CONFIRMED'|'ALREADY_CONFIRMED' } }\` / 400 \`NEWSLETTER_TOKEN_INVALID\` / 410 expired (48 h); \`GET|POST …/newsletter/unsubscribe?token=\` → 200 \`{ data: { outcome: 'UNSUBSCRIBED'|'ALREADY_UNSUBSCRIBED'|'UNKNOWN' } }\` / 400. These routes run for real under any token class — never point a test-class smoke at a real subscriber token.`

`docs/PRD.md` — replace the sentence beginning "**No form handler is built in WP1** — this section is the WP2/WP3a contract. What WP1 does ship is" with "**The forms kernel shipped in WP2a** (`src/forms/` — `createFormAction`, `postForm`, `uploadCv`/`uploadFraudEvidence`, `FormShell`/`Field`/`Turnstile`/`FallbackPanel`, `docs/ARCHITECTURE.md` § Forms flow); each page's form lands with its page task. What WP1 shipped first is" (the rest of the sentence stays).

`docs/PRD.md` — in the paragraph beginning "**Not yet built, by design (WP2 and later):**", replace "every form handler and the Operations write path, Sentry, OG image generation, the `BreadcrumbList`/`FAQPage`/`Article`/`JobPosting` JSON-LD builders" with "the per-page form specs (the kernel and the Operations write path shipped in WP2a), Sentry, OG image generation, the `Article`/`JobPosting` JSON-LD builders (`BreadcrumbList`/`FAQPage` exist in `src/lib/seo/jsonld.ts` since WP1 — written, not yet called)", AND drop the sentence's trailing clause ", and per-route bundle nav groups beyond `desktopNav`" (Tasks 1/3 fill the nav groups — W65), so the sentence ends "…the `Article`/`JobPosting` JSON-LD builders (`BreadcrumbList`/`FAQPage` exist in `src/lib/seo/jsonld.ts` since WP1 — written, not yet called), the synthetic-lead cron and daily digest." (the last list item keeps its leading ", " and takes the final period). The exact current sentence on `docs/PRD.md` line 118 (verified) is: "**Not yet built, by design (WP2 and later):** 12 of the 14 core pages (only the homepage and Hire Workers exist, both still spike-era placeholder content), every form handler and the Operations write path, Sentry, OG image generation, the `BreadcrumbList`/`FAQPage`/`Article`/`JobPosting` JSON-LD builders, the synthetic-lead cron and daily digest, and per-route bundle nav groups beyond `desktopNav`." (W45: Task 4 APPENDS its OG/Article/JobPosting clause after that final period — after "…the synthetic-lead cron and daily digest."; it does not replace this wording.)

`docs/OPERATING.md` — replace the `opsPing` table row with: ``| `opsPing`        | `OPS_PING`         | `GET /api/website/v1/ping` with the write token, 3 s timeout (`src/app/api/site-health/ops.ts`); `ok` on a 200 that is the ping JSON; `fail` on 401 (`unauthorized`) or 5xx/network/timeout/non-JSON 200 (`unreachable`); `skip` on 404 (`off` — the Phase A default until the WP3a flip) and when no `OPS_API_URL`/write token is configured (`unconfigured`). The raw state, latency and the door's `captcha`/`trippedForms` facts are on the body as `ops` |`` and, after the paragraph that begins "The response also carries `source`", add a paragraph: "**`formBeacons`** (body field, not a check): the number of visitor fallback panels this instance has shown, from `POST /api/form-beacon` (D11 — each panel sends `{formKey, kind, page}` once). Best-effort per instance like `lastRevalidate`; each beacon is also a `[form-beacon]` line in the Vercel function log. A rising count with `ops.state: 'ok'` points at the client path (captcha, validation), a rising count with anything else at the door. **After the WP3a flip** `opsPingCheck` must treat `off` as `fail` — T15 checklist."

`docs/OPERATING.md` § Synthetic lead — replace "**Not yet built** — no cron config exists in `vercel.json` and no form handlers exist yet to exercise (`docs/ARCHITECTURE.md` § Forms flow)." with "**Not yet built** — no cron config exists in `vercel.json` yet; the form path it drives (`src/forms/`, `docs/ARCHITECTURE.md` § Forms flow) shipped in WP2a, and `OPS_WEBSITE_TEST_TOKEN` is reserved for it in `.env.example`."

`docs/CONTENT-MODEL.md` § The `sys.*` range — after the "**Thank-you page:**" bullet insert:

```markdown
- **Forms (WP2a, W9/W23/W30):** `form.labels.<field>` for every field name the ten catalog forms use (v1 + Task 8's v1.1 — `name`, `email`, `phone`, `company`, `city`, `country`, `sector`, `headcount`, `startWhen`, `roleNeeded`, `message`, `subject`, `iAm`, `preferredTime`, `cv`, `consent`, `reporterName`, `reporterEmail`, `reporterPhone`, `suspectName`, `suspectContact`, `description`, `evidence`, `office`, `preferredDate`, `trade`, `candidatesPerYear`, `trades`, `licence`, `durationMonths`, `track`, `topic`, `portfolioUrl`, `expectedSalary`, `expectedSalaryCurrency`, `currentSalary`, `currentSalaryCurrency`, `coverLetter`, `linkedinUrl`, `language`, `openingSlug`, `estimateSummary`), `form.placeholders.<field>` and `form.hints.<field>` where useful (+ `placeholders.select`, `hints.optional`), `form.errors.{required,email,phone,min,max,url,file,consent,captcha,invalid}` (the codes `src/forms/errors.ts` emits), `form.consent.{label,notice,link}` (rich — `<link>` wraps the privacy-notice anchor), `form.submit.{default,sending}`, `form.honeypot`, `form.fallback.<kind>.{title,body}` for the seven `FormFallbackKind`s and `form.fallback.{whatsapp,call,email,whatsappIntro,retry}`. `Field` reads all three by field name; a field whose name has no label entry must pass `label` (dev/test throw). Page-local form copy that is not one of these (a section title, a design's own CTA label) is a package id read through `t()`, never a new `sys.form.*` key; `src/messages/messages.test.ts` asserts the two files' key sets are identical.
```

and change the sentence "This is the entire namespace as of WP1." to "This is the entire namespace as of WP2a (Task 1's `sys.<page>.*`/`sys.seo.*` additions are listed under § Adding copy)."

`docs/ANALYTICS.md` — replace the sentence "**WP1 wires exactly one of these seven events: `conversion`**, fired from `ConversionPing` on the thank-you page. The other six (`generate_lead`, `call_click`, `whatsapp_click`, `email_click`, `calculator_use`, `language_switch`) are defined in `track.ts`'s allowlist — the contract is frozen — but no chrome component or page calls `track()` for them yet;" with "**WP1 wired exactly one of these seven events: `conversion`**, fired from `ConversionPing` on the thank-you page. WP2a's forms kernel adds the visitor fallback panel's `whatsapp_click` / `call_click` / `email_click` with `placement: 'form_fallback'` (`src/forms/client/FallbackPanel.tsx`). The others (`generate_lead`, `calculator_use`, `language_switch`, and the chrome placements of the three contact events) are defined in `track.ts`'s allowlist — the contract is frozen — but no chrome component or page calls `track()` for them yet;" (W45: Task 3 APPENDS the chrome placements and the W26 page events to this wording.)

`CLAUDE.md` § Conventions — after the bullet that begins "**Every form's success path navigates to `/tesekkurler?form=<key>`**" add: "- **Every page form goes through the forms kernel** (`src/forms/`, WP2a): a `'use server'` wrapper around `createFormAction(spec)`, rendered by `FormShell` with `Field`s — never a hand-rolled `fetch`, a second validation copy, or an input outside `Field`. Uploads go through `uploadCv`/`uploadFraudEvidence` inside `toFields`. Field copy is `sys.form.*` by field name (W30); the rules are in `docs/ARCHITECTURE.md` § Forms flow."

- [ ] **Step 4: Run the full verify**

```bash
npx prettier --write docs .env.example CLAUDE.md
npm run verify
```

Expected: `tsc` clean; `eslint .` clean; `prettier --check .` clean; `vitest run` → all files green, including the 12 new ones (`wire`, `errors`, `post`, `action`, `uploads`, `Field`, `Turnstile`, `FallbackPanel`, `FormShell`, `messages`, `beacon`, `ops`). Revert any `nextjs-agent-rules` block if `npm run dev` was ever run (CLAUDE.md hard rule).

- [ ] **Step 5: Commit**

```bash
git add .env.example docs/DEPLOYMENT.md docs/ARCHITECTURE.md docs/INTEGRATIONS.md docs/PRD.md docs/OPERATING.md docs/CONTENT-MODEL.md docs/ANALYTICS.md CLAUDE.md
git commit -m "docs(forms): forms flow as built (W3 retry rule, result kinds, FormShell, uploads), I4/I5/I12 wire contract, site-health ops ping, OPS_WEBSITE_TEST_TOKEN

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:**

- `docs/ARCHITECTURE.md` § Forms flow — rewritten (Cycle 8, sentence-anchored on the section heading): W3 one-retry/8 s rule supersedes "not a retry queue, fallback immediately"; the result kinds; `createFormAction`/`FormShell`/`Field`/`Turnstile`/`FallbackPanel`; the captcha asymmetry in both directions and the interaction-loaded widget (W13 amended); `ok`+`FAILED` handling; uploads through `uploads.ts` (W29). § Operations surface — the site-health bullet's `ops` + `formBeacons` sentence; the "Not yet built" bullet no longer claims the beacon or the form handlers are unbuilt.
- `docs/INTEGRATIONS.md` — I4 wire contract as built (URL, headers, envelope caps, response shapes, status codes, evaluation order, dedupe, both upload routes with their exact multipart rules); I5 (`apply` exported, CV through `uploadCv` in `toFields`); I12 the "token forwarded only on the visitor's click" rule + the confirm/unsubscribe shapes, with the note that Task 8 records the rule on the Ops side (W46).
- `docs/PRD.md` — the "No form handler is built in WP1" sentence → "The forms kernel shipped in WP2a"; the "Not yet built, by design" paragraph → per-page specs only, `BreadcrumbList`/`FAQPage` builders exist since WP1, the trailing "per-route bundle nav groups beyond `desktopNav`" clause dropped (W65 — Tasks 1/3 fill the groups) so the sentence ends "…the synthetic-lead cron and daily digest." Task 4 appends its OG/Article/JobPosting clause after that (W45).
- `docs/DEPLOYMENT.md` — `OPS_WEBSITE_WRITE_TOKEN` now consumed by three modules; new `OPS_WEBSITE_TEST_TOKEN` row; Turnstile site key must be set on staging before any write-class test, widget loads on interaction.
- `docs/OPERATING.md` — `opsPing` row rewritten (states, the non-JSON-200 rule, the surfaced door facts); `formBeacons` paragraph; the post-flip `off → fail` T15 item; § Synthetic lead no longer says the form path does not exist.
- `docs/CONTENT-MODEL.md` — the `sys.form.*` bullet (every label per W30, the `Field` resolution rule); "entire namespace as of WP2a" pointing at Task 1's § Adding copy for the page/seo namespaces.
- `docs/ANALYTICS.md` — `form_fallback` placement wired for the three contact events; Task 3 appends the chrome placements + W26 events to this sentence (W45).
- `CLAUDE.md` § Conventions — the "every page form goes through the forms kernel" rule.
- `.env.example` — `OPS_WEBSITE_TEST_TOKEN`.
- Operations repo: nothing from this task — Task 8 (W46) rewrites Ops PRD §5.12's retry sentence to the W3 rule, corrects the "vary a timestamp in `sourcePath`" heartbeat note (`sourcePath` is not hashed) and records the I12 click-only rule.

**Produces — deviations:** (1) `src/forms/action.ts` is `import 'server-only'`, **not** a `'use server'` file — a `'use server'` module may export only async functions, so `createFormAction` (a sync factory) cannot live in one; each page wraps the returned function in its own `'use server'` module (snippet in Produces). (2) `FormShell`/`FallbackPanel` take `whatsappIntro?: string` instead of the skeleton's `whatsappText: (values) => string` — a function prop cannot cross the server→client boundary; the panel composes the text with `whatsappFallbackText(intro, values, label)`. (3) `FormShell` gains optional `contact`, `consent`, `initialState`, `submitLabel` (now optional, defaults to `sys.form.submit.default`) and `consentLinkHref` also accepts `'/kvkk'`; `FallbackPanel` gains optional `contact`. (4) Additions: `src/forms/errors.ts`, `src/forms/types.ts` (W44 — `PostFormOk`/`PostFormResult`/`PostFormVisitor`, the client-safe state types/constants and the two error classes, all re-exported by `action.ts`/`post.ts`), `src/forms/env.ts` (`doorConfig`, shared by `post.ts`, `uploads.ts` and the site-health ping), `src/forms/uploads.ts` (W29: `uploadCv`, `uploadFraudEvidence`, `isFile`, the byte caps), `src/forms/client/Field.tsx` (the field component pages use; `multiple` prop; W30 label rule; hints resolved by name), `useFieldValue`, `postForm`'s optional 4th `deps` argument and the exported `ATTEMPT_TIMEOUT_MS`/`MAX_ATTEMPTS`, `FormSpec.toFields` may be async and receives the raw `FormData`, `FormSpec.consent`, `FormActionError` (with an optional `field` that turns a throw into a field error) and `FormDoorError`. (5) `formBeaconCount()` is exported from `src/app/api/form-beacon/state.ts`, not `route.ts` (Next's route type check refuses non-handler exports); the beacon body schema is `strict` and the route returns a plain `Response`. (6) `OpsPing.state` adds `'unconfigured'` (no URL/token in this environment) beside the skeleton's four, and `OpsPing` carries the door's `captcha` and `trippedForms` facts; `off` and `unconfigured` map to the `skip` check result, `unauthorized`/`unreachable` (which now includes a non-JSON 200) to `fail`. (7) The `sys.form.*` set adds `errors.invalid`, `consent.notice`, `placeholders.select`, `fallback.whatsappIntro`, `fallback.retry`, and — per W30 — a label for every catalog field name (42 labels), 28 placeholders and 8 hints; the explicit key lists are in Produces (the skeleton left `placeholders.*`/`hints.*` as `*`). (8) `Turnstile` loads Cloudflare's script on the visitor's first interaction with the enclosing form (`focusin`/`pointerdown`), not through `next/script` `lazyOnload` — W13 amended keeps third-party script out of the initial audit; the token is written to the hidden input through a ref (no React state, per the React Compiler lint rules `eslint-config-next` 16 enforces). (9) Echoed values include the consent tick (`consent: 'on'`) so the checkbox survives a field error on another input.

---

