# Task 2 report — Forms kernel (`src/forms/`)

**Status: DONE_WITH_CONCERNS** (two small, recorded deviations from the brief's snippets; no interface change).

Branch `wp2/foundation`, worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2`. Working tree clean after the last commit. `npm run verify` green at every one of the eight commits.

## Commits (in order, on top of Task 1's `45a3eee`)

| SHA | Cycle | Subject |
| --- | --- | --- |
| `948e37c` | 1 | feat(forms): consent version, wire envelope builder, Zod issue → sys.form.errors codes, action state types |
| `dc80036` | 2 | feat(forms): postForm door client — status map, visitor headers, W3 one-retry/8 s budget |
| `347c121` | 3 | feat(i18n): sys.form.* copy — labels for every catalog field (W30), placeholders, hints, errors, consent, fallback panel (W9/W23) |
| `335bba5` | 4 | feat(forms): createFormAction — Zod → field codes, consent/honeypot/captcha, visitor headers, D13 redirect |
| `02be2f1` | 5 | feat(forms): uploadCv / uploadFraudEvidence helpers for async toFields (W29) |
| `2aedb9d` | 6 | feat(forms): FormShell, Field (W30 labels), interaction-loaded Turnstile and the D11 FallbackPanel islands |
| `f22cf24` | 7 | feat(ops): /api/form-beacon counter and the Operations ping on /api/site-health |
| `f093fae` | 8 | docs(forms): forms flow as built (W3 retry rule, result kinds, FormShell, uploads), I4/I5/I12 wire contract, site-health ops ping, OPS_WEBSITE_TEST_TOKEN |

All eight carry the `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` line and the brief's commit subjects verbatim.

## What was implemented

Everything in the brief's **Files** and **Produces** blocks, with the code, tests, copy and values taken verbatim from the brief (except the two deviations below):

- **Pure, client-safe:** `src/forms/consent.ts` (`CONSENT_VERSION = 'kvkk-2026-09'`), `src/forms/wire.ts` (`buildEnvelope`, DTO caps 2048/500/300, empty-string/array pruning), `src/forms/errors.ts` (`FORM_ERROR_CODES`, `issueToCode`, `fieldErrorsFromIssues`, `_form` root), `src/forms/types.ts` (W44: `PostFormOk`/`PostFormResult`/`PostFormVisitor`, `FormErrorResult`, `FormFallbackKind`, `FormActionState`, `IDLE_FORM_STATE`, the three field-name constants, `FormActionError`, `FormDoorError`).
- **Server-only:** `src/forms/env.ts` (`doorBase`, `doorConfig`, 20-char token floor), `src/forms/post.ts` (`postForm` — W3: `AbortSignal.timeout(4000)` × `MAX_ATTEMPTS = 2`, retry only on network/timeout/5xx, R28 malformed-200 = outage, status map 400/401/403/404/429), `src/forms/action.ts` (`createFormAction` — NOT a `'use server'` file; consent check, Zod → codes, `toFields` throw mapping, visitor IP via `isIP`, referer → `sourcePath`, D13 `redirect` outside try/catch), `src/forms/uploads.ts` (W29: `uploadCv`, `uploadFraudEvidence`, `isFile`, byte caps, key-pattern checks, single attempt).
- **Client islands (`'use client'`):** `FormErrorsContext.tsx` (`useFieldError` translated, `useFieldValue`), `Field.tsx` (W30 label rule — throws outside production, degrades + logs in production; label/placeholder/hint by field name; `hints.optional` default for non-required; `hint=""` suppresses; textarea/select/input; file input never gets a value), `Turnstile.tsx` (W13 amended — script appended on the first `focusin`/`pointerdown` inside the enclosing form; `interaction-only`; token written to the hidden `cf-turnstile-response` input through a ref, no React state; reset on expiry/error; `remove` on unmount), `FallbackPanel.tsx` (D11 — per-kind copy, WhatsApp primary for `tripped|unavailable|unauthorized|off`, secondary otherwise, `whatsappFallbackText` in fixed field order, tel/mail escape hatches when `contact` is given, one `sendBeacon('/api/form-beacon')` per mount, W12 `track()` with `placement: 'form_fallback'` — W72: no `ContactLink`), `FormShell.tsx` (`useActionState`, `noValidate`, off-canvas `aria-hidden` honeypot, Turnstile when a site key is set, checkbox/notice consent row with rich `<link>`, pending submit button, panel keyed by `result.kind`).
- **Ops surface:** `src/app/api/form-beacon/{route,state}.ts` (plain `Response`, strict Zod body, 204 no-store / 400, counter in `state.ts`), `src/app/api/site-health/ops.ts` (`pingOps` with the write token, 3 s timeout, `OpsPing` with `unconfigured`, `captcha`, `trippedForms`; `opsPingCheck`), `src/app/api/site-health/route.ts` (ping in parallel with the bundle checks; body gains `ops` and `formBeacons`).
- **Copy:** `sys.form.*` in both `src/messages/tr.json` and `src/messages/en.json` — 42 labels, 28 placeholders, 8 hints, 10 errors, consent.{label,notice,link}, submit.{default,sending}, honeypot, 7 × fallback.{title,body} + fallback.{whatsapp,call,email,whatsappIntro,retry} — identical key sets, all values exactly as the brief gives them (the brief left nothing to me). Added after `thankYou` inside `sys`; no existing key touched.
- **Test plumbing:** `src/test/server-only.ts` (empty module) + the `server-only` alias in `vitest.config.mts` after the `'@'` entry (R2).
- **Env + docs (Cycle 8, all sentence-anchored per W45):** `.env.example` (`OPS_WEBSITE_TEST_TOKEN`), `docs/DEPLOYMENT.md` (write-token row rewritten, test-token row added, Turnstile site-key row extended), `docs/ARCHITECTURE.md` (§ Forms flow replaced wholesale; § Operations surface site-health bullet and "Not yet built" bullet), `docs/INTEGRATIONS.md` (I4 wire contract as built, I5, I12 click-only rule + shapes), `docs/PRD.md` (the WP1 sentence → "The forms kernel shipped in WP2a"; "Not yet built, by design" rewritten, trailing nav-groups clause dropped per W65, ends "…the synthetic-lead cron and daily digest."), `docs/OPERATING.md` (`opsPing` row, `formBeacons` paragraph, § Synthetic lead), `docs/CONTENT-MODEL.md` (the Forms bullet; "entire namespace as of WP2a"), `docs/ANALYTICS.md` (the `form_fallback` sentence — Task 3 appends after it), `CLAUDE.md` § Conventions ("Every page form goes through the forms kernel"). Verified while editing: `src/lib/seo/jsonld.ts` does carry `BreadcrumbList` and `FAQPage`, so the new PRD wording is true.

## Tests and results

- Brief's command `npx vitest run src/forms src/messages src/app/api` → **14 files, 91 tests passed** (the 12 new files: wire 4, errors 3, post 15, action 14, uploads 11, Field 5, Turnstile 2, FallbackPanel 11, FormShell 7, messages 3, beacon 2, ops 5 — plus the pre-existing auth/checks files).
- `npm run verify` → tsc clean, `eslint .` clean (no `eslint-disable` anywhere in `src/forms`), `prettier --check .` clean, **vitest 40 files / 255 tests passed** (baseline before this task: 28 files / 171 tests).
- Output pristine: no `act()` warnings, no stray stderr/stdout from any test (checked with a grep over the full-suite output).

## TDD evidence per cycle

| Cycle | RED (command → observed) | GREEN |
| --- | --- | --- |
| 1 | `npx vitest run src/forms/__tests__/wire.test.ts src/forms/__tests__/errors.test.ts` → `Failed to resolve import "../consent"` / `"../errors"`, 2 suites failed | same command → 2 files / 8 tests passed; `tsc` clean; `eslint src/forms` clean |
| 2 | `npx vitest run src/forms/__tests__/post.test.ts` → `Failed to resolve import "../post"` (Vite reports the first unresolved specifier it reaches; the brief names `../env` — same failure mode) | `npx vitest run src/forms` → 3 files / 24 tests; `tsc` clean |
| 3 | `npx vitest run src/messages/messages.test.ts` → 2 failed / 1 passed: `sys.form.labels.name: expected false to be true` and `TypeError: Cannot convert undefined or null to object` (the third test; under Vitest the missing `form` property is a runtime TypeError rather than the brief's compile error — Vitest does not type-check) | `npx vitest run src/messages src/design/chrome` → 6 files / 26 tests; `prettier --check src/messages` clean |
| 4 | `npx vitest run src/forms/__tests__/action.test.ts` → `Failed to resolve import "../action"` | `npx vitest run src/forms` → 4 files / 38 tests; `tsc`, `eslint src/forms` clean |
| 5 | `npx vitest run src/forms/__tests__/uploads.test.ts` → `Failed to resolve import "../uploads"` | `npx vitest run src/forms` → 5 files / 49 tests; `tsc`, `eslint` clean |
| 6 | the four island tests → all four `Failed to resolve import "../client/…"` | first run 73/74 (see deviation 1), after the one-line fix `npx vitest run src/forms` → 9 files / 74 tests; `tsc`, `eslint src/forms` clean, no `eslint-disable` |
| 7 | `npx vitest run src/app/api/form-beacon src/app/api/site-health/ops.test.ts` → `Failed to resolve import "./route"` / `"./ops"` | `npx vitest run src/app/api` → 4 files / 14 tests; `tsc` clean after deviation 2; `eslint src/app/api` clean |
| 8 | n/a (docs) | `npm run verify` → all green, 40 files / 255 tests |

## Deviations from the brief (both mechanical, neither touches a Produces interface)

1. **`src/forms/client/Turnstile.tsx` — `s.setAttribute('async', '')` instead of `s.async = true`.** The brief's own Turnstile test asserts the `async` *content attribute* (`toHaveAttribute('async')`), and jsdom's `HTMLScriptElement.async` setter only clears its internal force-async flag — it never writes the attribute (verified: `s.async = true; s.hasAttribute('async') === false` under jsdom 29, while `defer` reflects fine). In a browser the IDL setter and the attribute are the same thing, so behaviour is unchanged; the attribute form is the honest way to make the brief's test pass. A two-line comment in the file records why. `s.defer = true` kept as in the brief.
2. **`src/app/api/site-health/ops.test.ts` — the `facts` constant is typed, not `as const`.** The brief's snippet `const facts = { captcha: null, trippedForms: [] } as const;` does not type-check: `as const` makes `trippedForms` a `readonly []`, which is not assignable to `OpsPing['trippedForms']: string[]` (five TS2345 errors, one per `opsPingCheck` call). Replaced with `const facts: Pick<OpsPing, 'captcha' | 'trippedForms'> = { captcha: null, trippedForms: [] };` (+ `type OpsPing` added to the test's import). The assertions and the production code are unchanged. I chose to apply this trivial test-only fix rather than block, since it needs no design decision; flagging it here so the controller can rule otherwise.

Everything else — including the RED expectation texts noted in the TDD table (Vite's first-unresolved-import ordering in cycle 2 and the runtime-vs-compile phrasing in cycle 3) — matched the brief as written.

## Files changed

Created:
`src/forms/consent.ts`, `src/forms/wire.ts`, `src/forms/errors.ts`, `src/forms/types.ts`, `src/forms/env.ts`, `src/forms/post.ts`, `src/forms/action.ts`, `src/forms/uploads.ts`, `src/forms/client/FormErrorsContext.tsx`, `src/forms/client/Field.tsx`, `src/forms/client/Turnstile.tsx`, `src/forms/client/FallbackPanel.tsx`, `src/forms/client/FormShell.tsx`, `src/forms/__tests__/{wire,errors,post,action,uploads}.test.ts`, `src/forms/__tests__/{Field,Turnstile,FallbackPanel,FormShell}.test.tsx`, `src/messages/messages.test.ts`, `src/test/server-only.ts`, `src/app/api/form-beacon/{route,state}.ts`, `src/app/api/form-beacon/beacon.test.ts`, `src/app/api/site-health/ops.ts`, `src/app/api/site-health/ops.test.ts`.

Modified:
`vitest.config.mts`, `src/messages/tr.json`, `src/messages/en.json`, `src/app/api/site-health/route.ts`, `.env.example`, `docs/DEPLOYMENT.md`, `docs/ARCHITECTURE.md`, `docs/INTEGRATIONS.md`, `docs/PRD.md`, `docs/OPERATING.md`, `docs/CONTENT-MODEL.md`, `docs/ANALYTICS.md`, `CLAUDE.md`.

Not touched: `contract/`, `src/content/local/*`, `design-package/**`, anything in the Operations repo.

## Self-review findings

- **Completeness:** every file in the brief's Create/Modify lists exists; every name in the Produces block is exported under that exact name (checked by grep); every `sys.form.*` key the parity test enumerates is present in both locales with identical key sets.
- **Boundaries (R23/D6/R56):** the five client islands import only `../types`, `../errors`, React, next-intl, `next/navigation`, `@/design/primitives`, `@/i18n/{navigation,routing}`, `@/analytics/*`, `@/lib/contact` — never `post`/`env`/`action`/`uploads`. `errors.ts` imports Zod type-only, so Zod does not enter the browser (W13 amended). The only `process.env` read outside a `server-only` module is `NODE_ENV` in `Field.tsx` (Next-inlined, not a secret). Nothing imports `design-package/**` or `src/content/local/*`. `server-only` sits at the top of `env`, `post`, `action`, `uploads`; `'use client'` at the top of all five islands.
- **Discipline:** no `eslint-disable`; no code beyond the brief; the two deviations are the minimum that makes the brief's own tests honest and type-correct.
- **Docs:** all edits anchored on the brief's sentences (asserted `count == 1` before each replacement); prettier re-aligned the two Markdown tables; the PRD's "Not yet built" sentence now ends exactly "…the synthetic-lead cron and daily digest." so Task 4 can append after it (W45); the ANALYTICS sentence ends with the "…for them yet;" clause Task 3 appends to.
- `CLAUDE.md` carries no injected `nextjs-agent-rules` block (`npm run dev` was never run; `next build` was not run per the one-heavy-job rule and the brief does not ask for it).

## Concerns / notes for the controller

- Deviation 2 above: I applied the test-only typing fix instead of stopping — say if you would rather it be escalated.
- The Cycle 3 RED message differs in kind from the brief's ("fails to compile" vs a runtime `TypeError`) purely because Vitest transpiles without type-checking; the failing test is the same one.
- Not exercised here (out of scope, no gate route): a real `next build` and the Lighthouse `resource-summary:script:size` check that W13 amended targets. The Turnstile script is only ever appended after a form interaction, so the initial audit should not see it — worth confirming on the WP2a preview gate run.

## Fix round 1

**Status: DONE_WITH_CONCERNS.** Every numbered fix (1–7), every minor, rulings W73–W76 and the controller's mid-round addendum are applied, test-first wherever the brief names a test, in 13 commits on `wp2/foundation` (on top of the controller's own `f08467c`, which landed mid-run; none of my commits touch its file). Each commit cites its ruling and ends with the Fable co-author line.

### Commits

| SHA | Item | Subject |
| --- | --- | --- |
| `535c131` | 1 (Critical) | fix(forms): keep the Turnstile token across re-renders; reset the widget after every result (W74) |
| `c969c54` | 2 | fix(forms): a rejected server action renders the unavailable panel, not the error boundary |
| `dcd1959` | 3 | fix(forms): show _form errors and errors on unrendered names in a form-level alert |
| `6c35588` | 4 | fix(forms): derive every form id from idScope ?? formKey |
| `ea5c89e` | 5 | fix(forms): focus management and a focusable pending submit (D20) |
| `b2904c5` | 6 / W76 | fix(forms): W76 — no visitor data in the fallback panel's WhatsApp href (D13) |
| `f65563e` | 7 / W73 | fix(forms): W73 — one 4 MB cap per file; server-action body limit 4mb |
| `eb1eba9` | W74 (+ visitor.ts minor) | fix(forms): W74 — retry only after a connection-level failure, one 9 s deadline |
| `838abc8` | W75 (+ pingOps body minor) | fix(site-health): W75 — a dark door (off) is a failure; pingOps drains non-200 bodies |
| `7f7dea8` | code minors | fix(forms): review minors — trim before validation, beacon kind enum, toFields log, headingLevel, unused keys |
| `4df73a0` | copy + doc minors | fix(i18n,docs): review copy and doc minors — no false receipt/SLA claims, formal TR, bare OPS_API_URL |
| `8a69889` | controller addendum | feat(forms): controller addendum — toFields ctx, Field passthroughs, /privacy-only consent link (W79), FormShell id |
| `5891e30` | self-review | docs(forms): reattach FormSpec's doc comment; wrap two long comments |

### Verification

- **`npm run verify` literally fails at `eslint .` in this worktree for a reason outside the repo.** ESLint's flat config does not read `.gitignore`, so it walks the git-ignored planning artefacts under `.superpowers/sdd/wp2-planning-artefacts/**`. The result is 1 error (`react/jsx-no-undef` in `…/t5src/src/design/chrome/__tests__/LanguageHint.append.snippet.tsx`) and 1 warning. The failure was already there at `dcbde3c`, before any change of mine. These files are not in git, so the Vercel build never sees them.
- At every commit I ran the equivalent with the artefacts excluded: `npm run typecheck && npx eslint . --ignore-pattern '.superpowers/**' && npm run format && npm test`. Every run was green.
- Final: tsc clean, eslint clean, `prettier --check` "All matched files use Prettier code style!", **vitest 41 files / 286 tests passed**. The baseline was 40 / 255. The full-suite output has no stderr, no `act()` warnings and no jsdom "Not implemented".
- No `next build` was run (per the machine rule).

### Per item (change → covering test → RED → GREEN)

**1. Critical — Turnstile token wiped.**
- Changes:
  - `src/forms/client/Turnstile.tsx:152`: the hidden input has no `defaultValue`. It is uncontrolled, and only the widget callbacks write it.
  - `:89`: `useImperativeHandle` exposes `{ reset }` through a new `ref` prop (`TurnstileHandle`).
  - `:30`: `useTurnstileReset(state)` returns that ref and calls `reset()` once per *change* of `state`, never on mount.
  - `FormShell.tsx`: `const turnstile = useTurnstileReset(state)` → `<Turnstile ref={turnstile}>`.
  - The reset does **not** clear the input. The widget callback overwrites the token when the new one arrives, so a token the door never saw (a `fieldErrors` answer comes back before any post) stays usable in between.
- Tests (FormShell.test):
  - (a) "keeps the Turnstile token across a shell re-render": render, then rerender with a `fieldErrors` `initialState`; the hidden input still holds `tok_1`.
  - (b) "resets the Turnstile widget once per action result, and the token survives a real submit": two real submits → `reset` called with `'w1'` exactly 1 then 2 times, the FormData carried `tok_1`, and the input still holds `tok_1` after the answer.
- RED: `npx vitest run src/forms/__tests__/FormShell.test.tsx` → 2 failed / 7 passed:
  - (a): `Expected the element to have value: tok_1 / Received: ''`, on the assertion after the rerender. This is the reviewer's reproduction.
  - (b): `expected "vi.fn()" to be called 1 times, but got 0 times`.
- GREEN: `npx vitest run src/forms` → 9 files / 76 passed.

**2. Rejected action → panel.**
- Changes:
  - New `src/forms/client/guardAction.ts:16`. It wraps the action: a rejection becomes `{ status:'error', result:{kind:'unavailable',cause:'network'}, values: echoValues(data) }` plus a `console.error('[forms] the form action rejected', err)`.
  - Next router errors go through `unstable_rethrow` first. I checked `server-action-reducer.js`: the D13 redirect reaches the client as a *rejection*, so it must be rethrown.
  - `FormShell.tsx:214`: `useMemo(() => guardAction(action), [action])`.
  - `echoValues`/`isInternalKey` moved from `action.ts` to the client-safe `src/forms/echo.ts:13`, so the server and the browser echo with one helper.
- Tests:
  - FormShell.test: "a rejected action … renders the unavailable panel with the typed values" (name + email survive).
  - New `guardAction.test.ts` (3 tests): an answer passes through untouched; a rejection → unavailable/network with no internal keys and no files; a `NEXT_REDIRECT;push;/tesekkurler?form=hire;307;` digest error is rethrown untouched.
- RED:
  - guardAction.test → `Failed to resolve import "../client/guardAction"`.
  - FormShell → `Unable to find an element by: [data-testid="form-fallback"]`, with `TypeError: Failed to fetch` escaping.
- GREEN: 10 files / 80.

**3. `_form` / unrendered-field errors.**
- Changes:
  - `FormErrorsContext.tsx`: `FormErrorsValue.register?` plus `useRegisterField(name)` (`:29`).
  - `Field` registers its name. The consent row registers `consent` in checkbox mode.
  - `FormShell.tsx:225` keeps a counted `Map` of shown names (counted, so two controls with one name do not unregister each other).
  - `FormLevelErrors` (`:109`) renders one `role="alert"` block above the submit button. It shows whenever `fieldErrors` has `_form` or a name no control registered, headed by the new `sys.form.errors.form`: TR "Lütfen formdaki alanları kontrol edin." / EN "Please check the highlighted fields.".
  - Each line is the translated code, prefixed with `sys.form.labels.<name>` when the name has one. Duplicate lines are collapsed.
  - `messages.test` expects `errors.form`.
- Tests: `_form` → form-level alert; `openingSlug` (hidden input) listed in the alert while `name` keeps its own alert; no form-level alert when every errored name has its control.
- RED: 2 failed / 11 passed. The third test passes before and after; it is a guard.
- GREEN: `npx vitest run src/forms src/messages` → 11 files / 86.

**4. Duplicate ids.**
- Changes:
  - `FormShell.tsx:211`: `scope = idScope ?? formKey`. The shell's ids are `f-<scope>-consent`, `f-<scope>-honeypot` and `f-<scope>-turnstile` (the Turnstile host gets a new optional `id` prop).
  - `Field` defaults through `useFieldId` (`FormErrorsContext.tsx:23`): `f-<scope>-<name>` inside a shell, `f-<name>` outside one.
- Tests:
  - Two shells with the same `formKey` and different `idScope`: every id in the document is unique, the ids are the expected ones, and a label click toggles its own form's checkbox but not the first form's.
  - Without `idScope`, ids are `f-hire-name` / `f-hire-consent`.
- RED: `expected 4 to be 8` (4 unique ids out of 8), and `id="f-name"` where `f-hire-name` was expected.
- GREEN: 10 files / 85.

**5. Focus (D20).**
- Changes:
  - `SubmitButton` (`FormShell.tsx:63`) is never `disabled`. It gets `aria-disabled` while pending, plus `aria-disabled:` cursor/opacity classes.
  - The form gets `aria-busy`. `pending` comes from `useActionState`'s third element.
  - `onSubmit` (`:220`) calls `preventDefault()` while pending. I verified in react-dom's `FormActionEventPlugin` that a prevented submit does not dispatch the action.
  - `useFocusAnswer` (`:81`) acts only on a *change* of state:
    - after `fieldErrors`: the first `[aria-invalid="true"]` control, else the form-level alert (`tabIndex=-1`);
    - after `error`: the fallback panel (`tabIndex=-1`, `FallbackPanel.tsx`).
- Tests:
  - Pending: the button is not disabled, has `aria-disabled="true"` and keeps focus; the form is `aria-busy`; a second click does not call the action again, even after the first resolves.
  - Focus lands on the first invalid control / on the form alert (`_form` only) / on the panel.
  - No focus move on mount with an `initialState`.
- RED: 4 failed / 15 passed.
- GREEN: 10 files / 89.

**6. W76.**
- Changes:
  - `FallbackPanel.tsx:144`: the WhatsApp anchor's href is the bare `https://wa.me/<number>`.
  - `openWhatsApp` (`:114`): `track('whatsapp_click', …)`, then `preventDefault()`, then it composes the `whatsappFallbackText` and calls `window.open(waLink(number, text), '_blank', 'noopener')`.
  - `docs/ANALYTICS.md`: a D13 sentence in the allowlist paragraph (the Task 3 "…for them yet;" clause is untouched), plus an **owner inventory item** in § GTM container inventory: GA4 "Outbound clicks" stays OFF, and no GTM trigger forwards a `wa.me`/`tel:`/`mailto:` Click URL.
  - `docs/ARCHITECTURE.md` failure bullet updated.
- Tests:
  - FallbackPanel.test: the href is exactly `https://wa.me/905011240340`; no `text=` and no encoded name anywhere in the DOM.
  - Dispatching a click is `defaultPrevented`. `window.open` is called once with a `?text=` URL whose decoded text holds the intro plus `Ad Soyad: Ali Veli` and the message, `'_blank'` and `'noopener'`. The dataLayer holds exactly one `whatsapp_click`.
  - FormShell.test: the panel variant was updated the same way.
- RED: 3 failed (2 FallbackPanel, 1 FormShell).
- GREEN: 10 files / 90.

**7. W73.**
- Changes:
  - `next.config.ts:14`: `experimental.serverActions.bodySizeLimit: '4mb'`.
  - `src/forms/uploads.ts:29`: `MAX_UPLOAD_BYTES = 4 * 1024 * 1024`. `MAX_CV_BYTES` and `MAX_EVIDENCE_BYTES` are kept (Produces) and now *equal* it. Refusal messages say "over 4 MB".
  - `hints.cv` / `hints.evidence` say 4 MB in both locales.
  - ARCHITECTURE § Uploads states the 4 MB rule and the one-file-per-server-action-call pattern for the verify page's evidence island. INTEGRATIONS I4 adds the site-side cap after the doors' caps. The CLAUDE.md forms convention was adjusted to match.
- Tests (uploads.test, "W73" block):
  - the three constants;
  - **a 4 MB + 1 byte file is refused with `{ field: cv|evidence, code: 'file' }` before any fetch**, for both helpers;
  - exactly 4 MB reaches the door.
- RED: 2 failed / 12 passed. The "exactly 4 MB" test passed before the fix too, under the old 5 MB cap.
- GREEN: `uploads + messages` → 2 files / 17.

**W74 (+ minor: `visitor.ts`).**
- Changes:
  - `src/forms/post.ts:17`: `ATTEMPT_TIMEOUT_MS = 9000`.
  - `:101`: **one `AbortSignal.timeout` shared by both attempts**.
  - `:108`: a retry happens only when `fetch` rejected and the rejection is not a timeout. A timeout, a 5xx and a malformed 200 are all final.
  - The old "`unavailable after retry`" log became one `'[postForm] unavailable'` line carrying `cause` and `attempt`.
  - New `src/forms/visitor.ts` (`MAX_UA`, `isTimeout`, `visitorHeaders`) is used by `post.ts` and `uploads.ts`.
  - Stale W3 wording fixed in `types.ts`, `action.ts` and `uploads.ts`, and in the name of one action test.
  - ARCHITECTURE retry bullet rewritten ("lands on the same row" dropped; W3 as amended by W74). INTEGRATIONS I4 points at W3/W74.
- Tests (post.test "W74 retry rule"):
  - the constants 9000/2;
  - **5xx-then-200 does NOT retry** (1 call, unavailable/server);
  - **network-then-200 retries** (2 calls, ok);
  - two network failures → network, 2 calls;
  - network then 5xx → server;
  - **a timeout does not retry** (1 call);
  - the retry's signal *is* the first attempt's signal (the shared deadline);
  - the malformed 200 now makes 1 call.
- RED: 5 failed / 14 passed.
- GREEN: 10 files / 96.

**W75 (+ minor: pingOps body).**
- Changes:
  - `src/app/api/site-health/ops.ts:87`: `ok → ok`, `unconfigured → skip`, everything else → `fail`.
  - `discardBody` (`:34`) reads at most 64 KB of a non-200 body, then cancels the rest, under the ping's 3 s signal.
  - `route.ts` comment updated.
  - `docs/OPERATING.md`: table row, the stale "After the WP3a flip…" sentence removed, and the monitor sentence added (2 consecutive failures at a 5-minute interval absorb the ~60 s Ops deploy window). The ARCHITECTURE site-health bullet updated.
- Tests (ops.test): the W75 mapping (off → fail); for 404, 401 and 502, `res.bodyUsed` is true after `pingOps`.
- RED: 2 failed / 6 passed.
- GREEN: `npx vitest run src/app/api` → 4 files / 15.

**Minors (`7f7dea8`, `4df73a0`, and inside the commits above):**
- **Code:**
  - `toObject` trims (`action.ts:58`). Test: `'   '` → `required` with no door call, and `'  Ali Veli \n'` reaches the wire as `Ali Veli`.
  - The beacon `kind` is `z.enum(FORM_FALLBACK_KINDS)` (`route.ts:18`; `types.ts:51`, exhaustive through a `Record<FormFallbackKind, true>`). Test: `bogus` → 400; all seven kinds → 204.
  - `console.error('[forms] toFields threw', err, { formKey })` (`action.ts:141`); the test asserts the call.
  - `headingLevel` on `FormShell` (title + panel) and on `FallbackPanel`. Tests: default H3; 2 → H2 for both; the panel alone at 4 → H4.
  - `sys.form.consent.link` and `sys.form.fallback.retry` removed from both locales. I checked first: nothing reads them; the notice's `<link>` renders through the rich-tag function. `messages.test` and `CONTENT-MODEL.md` updated.
  - `vitest.config.mts:25` pins `OPS_WEBSITE_WRITE_TOKEN: ''`.
  - The "echoed value survives a real submit" assertion added to FormShell.test.
  - RED 5 failed / 110 passed → GREEN 15 files / 118 (`src/forms src/app/api src/messages`).
- **Copy (both locales, EN aligned):**
  - the `failed.body` rewording;
  - `unauthorized.body` "Sorunu ekibimize ilettik." → "Formu gönderirken bir sorun oluştu.";
  - `off.body` "…en kısa sürede dönüş yaparız." / "…we will get back to you as soon as possible.";
  - `fallback.whatsapp` "WhatsApp'tan gönderin";
  - `labels.iAm` "Rolünüz" (EN stays "I am");
  - `errors.min/max` "Girdiğiniz değer çok kısa./uzun." / "The value you entered is too short./long." I kept the trailing period used by the sibling error strings.
- **Docs:**
  - ARCHITECTURE: the "email, —" typo and the stale "until WP3a/WP5/WP6 land the forms" clause.
  - DEPLOYMENT: the `OPS_API_URL` row is now the bare origin, and says that a value ending in `/api/website/v1` doubles the path → 404 → `off` (a fail since W75). I checked that `src/content/adapter.ts` also appends `/api/website/v1`.

**Controller addendum (`8a69889`).**
- Changes:
  - `FormSpec.toFields(parsed, data, ctx: FormActionContext)` with `ctx = { visitor, locale }` (`action.ts:30`, `:133`). Locale and headers are now resolved before `toFields`; `visitorOf` stays private.
  - `Field` passes `minLength`/`maxLength`/`disabled` through, and `defaultValue` for input/textarea/select (never a file input). An echoed value wins (`Field.tsx:80`).
  - `consentLinkHref?: '/privacy'` only, defaulting to `/privacy` (W79).
  - `FormShell` `id?` goes on the `<form>`.
- Tests:
  - action.test: `toFields` receives the parsed object, the same FormData, and `{ visitor: { ip, ua }, locale: 'en' }`.
  - Field.test: the passthroughs, and an echo beating `defaultValue`.
  - FormShell.test: the form `id`, plus a `// @ts-expect-error` on `consentLinkHref="/kvkk"` (enforced by tsc).
- RED: 3 runtime failures, and tsc errors including `TS2578: Unused '@ts-expect-error' directive`, which proves `'/kvkk'` was still accepted.
- GREEN: 10 files / 103, tsc clean.

### Produces additions / changes

- **FormShell:**
  - new optional `idScope?: string`, `headingLevel?: 2 | 3 | 4` (default 3) and `id?: string`;
  - **`consentLinkHref` narrowed to `'/privacy'`** (W79 — `'/kvkk'` is now a type error);
  - the submit button is `aria-disabled` rather than `disabled` while pending.
- **FallbackPanel:** `headingLevel?: 2 | 3 | 4`. The WhatsApp href is bare, and the prefill is composed on click (W76).
- **Turnstile:** optional `id?: string` and `ref?: Ref<TurnstileHandle>`. New exports `TurnstileHandle` and `useTurnstileReset(state)`.
- **FormErrorsContext:** `FormErrorsValue` gains optional `register?` and `idScope?`. New exports `useRegisterField` and `useFieldId`.
- **Field:**
  - new `minLength`, `maxLength`, `defaultValue`, `disabled`;
  - the default id inside a shell is now `f-<idScope ?? formKey>-<name>` (still `f-<name>` outside one).
- **post.ts:** `ATTEMPT_TIMEOUT_MS` **4000 → 9000**, one deadline shared by both attempts; `MAX_ATTEMPTS` stays 2 (W74).
- **uploads.ts:**
  - new `MAX_UPLOAD_BYTES = 4 MiB`;
  - `MAX_CV_BYTES` / `MAX_EVIDENCE_BYTES` are **5 / 8 MiB → 4 MiB** (both equal `MAX_UPLOAD_BYTES`) (W73);
  - `uploadFraudEvidence` is now meant for a one-file upload action, not `toFields` (W73 pattern).
- **action.ts:** `FormSpec.toFields` gains a 3rd arg `ctx: FormActionContext` (new export `FormActionContext = { visitor: PostFormVisitor; locale: Locale }`).
- **types.ts:** new `FORM_FALLBACK_KINDS`.
- **New modules:** `src/forms/echo.ts` (`echoValues`, `isInternalKey`), `src/forms/visitor.ts` (`MAX_UA`, `isTimeout`, `visitorHeaders`), `src/forms/client/guardAction.ts` (`guardAction`).
- **opsPingCheck:** `off` → `'fail'` (was `'skip'`) (W75).
- **Beacon body:** `kind` is one of the seven `FormFallbackKind`s (was any string of 1–20 chars).
- **sys.form.\*:** added `errors.form`; removed `consent.link` and `fallback.retry`.
- **Config:** `next.config.ts` `experimental.serverActions.bodySizeLimit: '4mb'`; `vitest.config.mts` pins `OPS_WEBSITE_WRITE_TOKEN`.

### Self-review findings

- **Fixed in `5891e30`:** the addendum commit had inserted `FormActionContext` between `FormSpec`'s JSDoc and `FormSpec`, which detached the doc comment. Also in that commit: two comments over 100 columns re-wrapped, and a test's arbitrary visitor message changed from "5 MB" to "4 MB".
- Boundaries hold:
  - the client islands and `guardAction`/`echo` import only client-safe modules (`../types`, `../errors`, `../echo`, `next/navigation`);
  - `visitor.ts` is imported only by the two `server-only` modules;
  - no `eslint-disable` anywhere;
  - `process.env` is still read only in server modules (plus `NODE_ENV` in `Field`).
- Grep for stale wording: no "8 s" and no "same row" in tracked non-plan files. The remaining "5 MB" / "8 MB" mentions are the doors' own caps, labelled as such.

### Concerns

1. **Lint and the planning artefacts.** `npm run verify` as written fails in this worktree because ESLint walks the git-ignored `.superpowers/**` planning artefacts (see Verification). A one-line `globalIgnores(['.superpowers/**'])` in `eslint.config.mjs` would make the literal command green here. I left it alone because it is out of scope.
2. **Ops-side doc drift (CLAUDE.md checklist item 4).** `jobsadmire-operations/docs/PRD.md` §5.12 "Idempotency (P8)" still says "**contract: WP2 must retry on any non-2xx** … a retried submission must land on the same row". W74 changed that contract on the website side. Per W46 the Ops PRD corrections belong to Task 8; I did not touch the Ops repo.
3. **W74 interpretation.** I implemented "worst case ≈ 9 s" as **one shared 9 s deadline for both attempts**, not a fresh 9 s per attempt. With per-attempt timeouts, a slow connection failure followed by a hung retry could approach 18 s. Say if a per-attempt budget was intended.
4. **W73 edge.** `bodySizeLimit: '4mb'` is 4 MiB for the *whole* body, and `MAX_UPLOAD_BYTES` is 4 MiB per file. A file within a few KB of 4 MiB plus the other fields and multipart overhead exceeds the body limit, so Next refuses it before the action runs. Through fix 2 the visitor then sees the `unavailable` panel rather than a `file` field error. Both numbers are the ruling's.
5. **Copy register.** The briefed "en kısa sürede dönüş yaparız" — and the existing panel copy ("bize", "kapattık", "ekibimiz") — use first person plural. `docs/PRD.md` §3 says the company "refers to itself as 'JobsAdmire', never 'we'". I applied the brief as written; flagging it for the owner.
6. **Turnstile reset.** It runs after *every* result, per the brief, including `fieldErrors` answers that never reached the door. That re-runs an invisible challenge. The old token is kept until the new one arrives, so nothing is lost meanwhile.
7. **Form-level alert on first paint.** With a non-idle `initialState` (dev gallery only), the form-level alert lists every error for the first paint, until the `Field`s register in their effects. A real submit cannot reach this, because the fields are registered before any answer arrives.
8. **Not addressed.** Review Important 5's sub-bullet "several `role=alert` regions appear at once" is not addressed. Fix 5 asks for focus management only, and the per-field alerts remain.

## Fix round 2

Brief: `task-2-fix-round-2.md` (rulings W116, W117). Two commits on `wp2/foundation`, on top of `5891e30`:

- `7a362c8` fix(forms): W116 — 3 MB upload cap under the 4 MB server-action body; lint ignores .superpowers
- `d7aed7b` fix(i18n): sys.form copy never speaks as "we" — docs/PRD.md:53 copy rule, enforced by a test

`npm run verify` was green on each commit's tree. A final cold run at HEAD, after deleting `tsconfig.tsbuildinfo`, was also green:

```
> tsc --noEmit
> eslint .
> prettier --check .
All matched files use Prettier code style!
> NODE_ENV=test vitest run
 Test Files  42 passed (42)
      Tests  290 passed (290)
exit 0
```

### Item 1: local lint noise (`7a362c8`)

- **Changes:** `eslint.config.mjs:48` adds `'.superpowers/**'` to `globalIgnores`, with a comment. `.prettierignore:2` adds `.superpowers`.
- **RED before the change:** `npm run lint` reported `✖ 2 problems (1 error, 1 warning)`, both in `.superpowers/sdd/wp2-planning-artefacts/wp2a/t5src/…snippet.tsx`:
  - `react/jsx-no-undef`
  - `@typescript-eslint/no-unused-vars`
- `prettier --check` was already green, because Prettier 3 also reads `.gitignore`. The entry is there because the brief asks for it.
- **After the change:** `npm run verify` exits 0 with the planning artefacts still on disk (log above). No covering test is needed; the verify run is the check.

### Item 2: W116, 3 MiB upload cap (`7a362c8`)

- **Changes:**
  - `src/forms/uploads.ts:32`: `MAX_UPLOAD_BYTES = 3 * 1024 * 1024`. `MAX_CV_BYTES` and `MAX_EVIDENCE_BYTES` still equal it. All Produces names are unchanged; only the value changed.
  - `src/forms/uploads.ts:22-31`: the doc comment now explains the 1 MB of headroom under the 4 MB body: the other fields and the multipart framing share that body, and a file near a 4 MB cap would overflow it and get `unavailable` instead of a `file` error.
  - `:94`: the `uploadCv` doc comment now says "PDF ≤ 3 MB here".
  - `:103` and `:136`: the refusal reasons now say `'over 3 MB'`.
  - `next.config.ts:10-13`: the comment is rewritten. `bodySizeLimit: '4mb'` at `:15` is unchanged.
  - `sys.form.hints.cv` and `hints.evidence` (`tr.json:128-129`, `en.json:128-129`): "en fazla 3 MB" / "up to 3 MB".
  - `docs/ARCHITECTURE.md:82` (§ Forms flow, Uploads): the rule reads "3 MB per file, every file (W73, cap set by W116)". The `bodySizeLimit: '4mb'` mention is kept, and a new sentence explains the 1 MB headroom. "three 4 MB files" becomes "three 3 MB files".
  - **Beyond the brief, so the docs do not drift:**
    - `docs/INTEGRATIONS.md:44` (I4): the site-side cap is now 3 MB (W73/W116), with the headroom noted.
    - `CLAUDE.md:45`: "3 MB per file (W73/W116)".
    - `src/forms/__tests__/action.test.ts:197,201`: the sample visitor message now says "under 3 MB".
- **Covering test:** the "W73/W116" block in `src/forms/__tests__/uploads.test.ts:43-75`:
  - `MAX_UPLOAD_BYTES` is 3 MiB, and the CV and evidence caps equal it;
  - a **3 MiB + 1 byte** file is refused with `{ field, code: 'file' }` by both helpers before any fetch;
  - a file of exactly 3 MiB reaches the door.
- **RED:** `npx vitest run src/forms/__tests__/uploads.test.ts` → `Tests 2 failed | 12 passed (14)`. The failures were `expected 4194304 to be 3145728` and the 3 MiB + 1 byte file getting through.
- **GREEN:** `npx vitest run src/forms/__tests__/uploads.test.ts src/messages` → `Test Files 2 passed (2) · Tests 17 passed (17)`.
- **Grep:** `4 MB` now appears only where it means the body limit: in the uploads.ts comment and the test titles. The `bodySizeLimit '4mb'` value is unchanged.

### Item 3: no first person (docs/PRD.md line 53) (`d7aed7b`)

- **Copy, both locales:**

  | Key | TR | EN |
  |---|---|---|
  | `placeholders.message` | "Kısaca ihtiyacınızı yazın" | "Briefly describe what you need" |
  | `fallback.captcha.body` | unchanged (not first person) | "…or send what you typed directly on WhatsApp." |
  | `fallback.off.body` | brief's text ("…JobsAdmire en kısa sürede dönüş yapar.") | "You can send your request on WhatsApp, by phone or by e-mail; JobsAdmire will get back to you as soon as possible." |
  | `fallback.tripped.body` | brief's text ("Yoğun talep nedeniyle form kısa süreliğine kapalı. …") | "The form is paused briefly because of heavy demand. You can send what you typed on WhatsApp in one tap." |
  | `fallback.unauthorized.body` | brief's text ("…JobsAdmire'a…") | "…In the meantime, you can reach JobsAdmire on WhatsApp or by phone." |
  | `fallback.unavailable.body` | brief's text ("…JobsAdmire'a ulaşmadı…") | "…stopped your form from reaching JobsAdmire…" |
  | `fallback.failed.body` | brief's text ("…JobsAdmire'a ulaşabilirsiniz.") | "…You can reach JobsAdmire through the channels below." |
  | `fallback.invalid.body` | unchanged | "…or send a message on WhatsApp." |
  | `fallback.call` | "Arayın" | "Call" |
  | `fallback.email` | "E-posta gönderin" (unchanged) | "E-mail" |

  - Locations: `tr.json` / `en.json` lines 104, 161-189.
  - `fallback.whatsappIntro` (the visitor's voice) is kept as is.
  - No string needed a change of meaning, so there was no escalation.
  - No test pinned the old copy (checked with grep).
- **Docs:** `docs/CONTENT-MODEL.md:49` (the Forms bullet) now names the register rule and the new test.
- **Covering test:** new `src/messages/voice.test.ts`.
  - **Per locale** (`:80`), it scans every `sys.form.*` leaf except the allowlist `VISITOR_VOICE = ['fallback.whatsappIntro']`.
  - Words are extracted Unicode-aware, after `toLocaleLowerCase(locale)`. JS `\b` is ASCII-only, so the brief's literal `\bekibimiz\b` would miss "ekibimize" and would misbehave next to ı/ş/ğ.
  - **EN fails on** `we|us|our|ours|ourselves`.
  - **TR fails on:**
    - the pronouns `biz, bize, bizi, bizim, bizde, bizden, bizimle, bizler…` (never "bizzat");
    - any word starting with `ekibimiz`;
    - **first-person plural verb endings**: aorist `-rız/-riz/-ruz/-rüz`, `-yoruz`, `-acağız/-eceğiz`, `-malıyız/-meliyiz`, past `-dık/-tik/…`.
  - The verb check is there because the brief's pronoun list alone would not catch two of its own listed offenders, "yaparız" and "kapattık".
  - A short `TR_NOT_VERBS` list holds the non-verbs those endings catch. I found them by running the heuristic over the design package's 4,404 TR strings: artık, otomatik, lojistik, diplomatik, tasdik, plastik, pratik, sürpriz. I added kritik, elektrik and tanıdık.
  - `:88` checks that the allowlisted key exists in both locales.
  - `:95` is a self-test of the checker. It catches bizi, bize, ekibimize, ilettik, yaparız, yapıyoruz, yapacağız, yapmalıyız, us, we, our and ours. It leaves alone bizzat, iletebilirsiniz, artık, otomatik, yazdıklarınızı, kriz, gönderemedim, your, thus, users, yours and hours.
- **RED:** `npx vitest run src/messages/voice.test.ts` → `Tests 2 failed | 2 passed (4)`.
  - TR had 6 hits: off.body "yaparız", tripped.body "kapattık", unauthorized/unavailable/failed.body "bize", call "bizi".
  - EN had 12 hits across placeholders.message and captcha/off/tripped/unauthorized/unavailable/failed/invalid.body, plus call and email.
- **GREEN:** `npx vitest run src/messages src/forms` → `Test Files 12 passed (12) · Tests 110 passed (110)`.
- **Extra check:** a noisier scan of `sys.form` in both locales found nothing left. It also looked for possessives `-mız/-miz`, the imperative `-lım/-lim`, `-yız` and "let".

### Self-review

- **Produces:** unchanged except the value of `MAX_UPLOAD_BYTES`, and through it `MAX_CV_BYTES` and `MAX_EVIDENCE_BYTES` (W116).
- No `eslint-disable`. Nothing in `.superpowers/` touched except this report.
- W117 (one shared 9 s deadline) needed no change.

### Concerns

1. **Out of scope for this round (`sys.form` only), but the same rule applies elsewhere.** Other `sys.*` copy still speaks as "we":
   - `sys.consent.body`: TR "…reklamlarımızın… kullanıyoruz", EN "We use cookies… our ads";
   - `sys.thankYou.body` and all ten `sys.thankYou.forms.*`: TR "aldık / ekibimiz / döneceğiz", EN "We have your…";
   - `sys.thankYou.whatsapp`: "Message us on WhatsApp".

   The design package's own copy also uses first person: 12 "Bizi arayın" / "Call us" CTAs, "bize", "ekibimiz", and "hakkımızda" ×15. So the panel's new "Arayın" / "Call" differs from the package's CTA label. The owner should say whether the PRD rule covers package copy. If it does, widen `voice.test.ts` to all of `sys.*`.
2. **Ruling log:** W116 and W117 are not yet in `docs/superpowers/plans/2026-09-20-wp2-rulings.md`, which is the controller's file. Its W73 entry still says 4 MB.
