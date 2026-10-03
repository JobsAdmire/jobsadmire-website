# Task 2 — fix round 1 (controller brief, 2026-09-24 13:20 PKT)

The task review (spec ✅, quality ❌) is reproduced in full at the end of this file. Apply every item below on branch `wp2/foundation` in this worktree, in small commits (one per numbered group is fine), keeping `npm run verify` green at every commit and the **Produces** block of `task-2-brief.md` intact except where a ruling below changes it (say so in the fix report). Rulings W73–W76 are binding; cite them in commit messages.

## Rulings that settle the review's ⚠️ items

- **W73 Upload caps.** Server actions carry the file bytes, and Vercel caps a function body at 4.5 MB (Next's server-action default is 1 MB). Therefore: `next.config.ts` gains `experimental: { serverActions: { bodySizeLimit: '4mb' } }`; `src/forms/uploads.ts` caps EVERY file at `MAX_UPLOAD_BYTES = 4 * 1024 * 1024` (CV and evidence alike; the Ops door's 8 MB is not reachable through Vercel and is left as is); `sys.form.hints.cv` / `hints.evidence` (both locales) say 4 MB; ARCHITECTURE § Uploads states the 4 MB rule and that a multi-file form uploads ONE file per server-action call (the verify page's evidence island calls a small upload action per file, receives the key, stores it in a hidden input, and the final submit sends `evidenceKeys`) — a 3 × 4 MB single body would exceed the cap. Add a test: a 4 MB + 1 byte `File` is refused with the `file` code before any fetch.
- **W74 Retry rule (amends W3).** A Turnstile token is single-use and Ops waits up to 6 s for siteverify, so a retry after a request REACHED the door re-sends a spent token and gets 403, not `replayed`. New rule: `ATTEMPT_TIMEOUT_MS = 9000`; ONE retry only when the first attempt failed at the CONNECTION level (fetch rejected without a response: DNS, refused, reset — NOT a timeout, NOT a 5xx); a timeout or 5xx returns `unavailable` immediately with the matching `cause`. Worst case ≈ 9 s. Update `post.ts`, its tests (5xx-then-200 must now NOT retry; network-then-200 retries; timeout does not retry), `docs/ARCHITECTURE.md` § Forms flow (drop the sentence that a retry "lands on the same row"), `docs/INTEGRATIONS.md` I4 if it repeats the rule, and the rulings pointer in the docs (W74).
- **W75 `off` is a failure now.** The door is live in production since 2026-09-24. `opsPingCheck`: `ok → 'ok'`, `unconfigured → 'skip'`, `off | unauthorized | unreachable → 'fail'`. Update `ops.ts`, its test and the site-health doc line. (The external monitor's own threshold — alert on 2 consecutive failures at a 5-minute interval — absorbs the ~60 s Ops deploy window; add that sentence to `docs/OPERATING.md` § Site health, no code.)
- **W76 No visitor data in a DOM href (D13).** `FallbackPanel` renders the WhatsApp anchor with `href="https://wa.me/<number>"` only (no `?text=`) and composes the prefilled URL at click time (`onClick`: `track(...)`, then `window.open(fullUrl, '_blank', 'noopener')` / or set `window.location.href` on mobile — one path is enough: `window.open` with `noopener`), so neither GA4 enhanced-measurement outbound clicks nor a GTM click trigger can capture typed data. `docs/ANALYTICS.md` gets one sentence under D13 saying so, plus a note that GA4 enhanced measurement "Outbound clicks" must stay OFF (owner inventory item). Update the FallbackPanel test: the rendered href has no `text=`; clicking calls `window.open` with the composed URL.

## Fixes (review numbering)

1. **Critical — Turnstile token wiped.** In `Turnstile.tsx` remove `defaultValue=""` from the hidden input (uncontrolled, ref-managed; set `input.value = token` in the callback only). After EVERY action result (success or error — `FormShell` knows when `state` changes), call `turnstile.reset(widgetId)` so the next submit gets a fresh token; expose that through a small `useTurnstileReset` ref/callback the shell invokes in a `useEffect` keyed on `state`. Tests: (a) the token survives a shell re-render caused by a `fieldErrors` state (render with `initialState` then rerender with a different state — assert the hidden input still holds `tok_1`), (b) the widget's `reset` is called once per state change.
2. **Important — rejected action → panel, not the error boundary.** In `FormShell` wrap the action: a rejection that is not a Next redirect (`isRedirectError` from `next/dist/client/components/redirect-error` — or the documented `unstable_rethrow` pattern) becomes `{ status: 'error', result: { kind: 'unavailable', cause: 'network' }, values: <echo of the FormData strings> }`. Test: an action that rejects renders the `unavailable` panel and echoes the values.
3. **Important — `_form` / unrendered-field errors.** `Field` registers its `name` on mount in a `Set` held by `FormErrorsContext` (and unregisters on unmount). `FormShell` renders a form-level `role="alert"` block (new `sys.form.errors.form` key in both locales: TR "Lütfen formdaki alanları kontrol edin." / EN "Please check the highlighted fields.") whenever `fieldErrors` has `_form` or any key not registered by a `Field`; it lists the translated codes. Test both cases.
4. **Important — duplicate ids.** `FormShell` derives every internal id from `idScope ?? formKey`: `f-${scope}-consent`, `f-${scope}-honeypot`, `f-${scope}-turnstile`, and `Field` defaults its id to `f-${scope}-${name}` through context. New optional prop `idScope?: string` on `FormShell` (Produces addition — list it). Test: two shells with the same `formKey` and different `idScope` render distinct ids.
5. **Important — focus (D20).** Do not `disabled` the submit button; use `aria-disabled={pending}` + `aria-busy` on the form and ignore a second submit while pending. After a `fieldErrors` state, move focus to the first `[aria-invalid="true"]` control inside the form; after an `error` state, move focus to the panel (`tabIndex={-1}`). Tests for both.
6. **Important — W76 above.**
7. **Important — W73 above.**

## Minors to apply in the same round

- `failed` fallback body (both locales): no longer claims receipt — TR "Formunuz gönderilemedi. Aşağıdaki kanallardan bize ulaşabilirsiniz." / EN "Your form could not be sent. You can reach us through the channels below."
- `toObject` trims string values; add the test (whitespace-only required value → `required` code).
- `vitest.config.mts` `test.env` gains `OPS_WEBSITE_WRITE_TOKEN: ''`.
- Beacon: `kind` must be one of the seven `FormFallbackKind` values, else 400; test.
- `pingOps`: read (and discard, bounded) the body of a non-200 response before returning.
- The generic `toFields` catch logs `console.error('[forms] toFields threw', err)` before mapping.
- Extract `isTimeout`, `MAX_UA` and the visitor-header builder into `src/forms/visitor.ts` used by both `post.ts` and `uploads.ts`.
- Remove the unused `sys.form.fallback.retry` and `sys.form.consent.link` keys (both locales) — unless `consent.link` is what the notice's `<link>` renders through; check before deleting.
- `FormShell` and `FallbackPanel` headings: `headingLevel?: 2 | 3 | 4` prop, default 3 (Produces addition).
- Turkish copy: `fallback.whatsapp` → "WhatsApp'tan gönderin"; `labels.iAm` → "Rolünüz" (EN stays "I am"); `errors.min` → "Girdiğiniz değer çok kısa"; `errors.max` → "Girdiğiniz değer çok uzun"; `fallback.failed.title`/`unavailable.body` or wherever "Sorunu ekibimize ilettik" appears → "Formu gönderirken bir sorun oluştu."; replace "aynı gün dönüş yapar" with "en kısa sürede dönüş yaparız" (no SLA promise — the SLA is a metric, W1). Keep the EN equivalents aligned.
- Docs: `docs/ARCHITECTURE.md` "email, — the client…" typo and the stale "until WP3a/WP5/WP6 land the forms" clause; `docs/DEPLOYMENT.md` `OPS_API_URL` row → the bare origin `https://operations.jobsadmire.com` (the code appends `/api/website/v1/...`), with a sentence that a value ending in `/api/website/v1` yields 404 → `off`.
- Tests: add the "echoed values survive a real submit" assertion to `FormShell.test`.

## Not in scope (parked by the controller)
- Site-health exposing `ops.captcha` / `trippedForms` publicly: kept — the external monitor needs them and neither is sensitive (ruling recorded in the ledger).

## Report
Append a "## Fix round 1" section to `task-2-report.md`: per item, what changed, the covering test, the command and its output; list any Produces additions. Reply with the usual short status contract.

---

# The review (verbatim)

**Spec compliance:** ✅ compliant. The ⚠️ items below are design-level and need a ruling, not an implementer fix.

**Code quality:** ❌ changes required: 1 Critical, 6 Important, several Minor.

## Spec compliance evidence

- **Verbatim check.** I extracted every code block from the brief and diffed it against the files on disk. All of them are identical except the two recorded deviations: `Turnstile.tsx:27-29` and `ops.test.ts:2,84-85`. The `sys.form` objects in `tr.json` and `en.json` are also identical to the brief's. Each locale has 113 keys, the same set in both, and they match the Produces lists exactly: 42 labels, 28 placeholders, 8 hints, 10 errors, the `consent`, `submit` and `honeypot` keys, 7 × fallback title/body, and the 5 other fallback keys.
- **Produces.** Every export exists under its frozen name and signature, including the three field names `'honeypot'`, `'cf-turnstile-response'` and `'consent'`, and the `OpsPing` states.
- **Status map** (`post.ts:41-66`): 200 ok (a malformed 200 is unavailable/server), 401 unauthorized, 403 captcha, 404 off, 429 tripped, ≥500 unavailable, any other 4xx invalid. It retries only on `unavailable` and never on a 4xx (`post.ts:103-122`). The worst case is 2 × `AbortSignal.timeout(4000)`, which is the 8 s budget.
- **Success path:** D13 redirect through next-intl, outside any try (`action.ts:151-154`). `FormActionError` without a field becomes `failed`.
- **Beacon:** answers 204 or 400 with no-store and exposes no secret. `opsPingCheck` maps states as specified.
- **Server-only boundary:** the client islands import only `../types` and `../errors`. `errors.ts` imports Zod as a type only.
- **Docs** match the brief's Cycle 8 wording.
- **Deviations.** Both are accepted. Deviation 1: `setAttribute('async','')` behaves the same in browsers. Deviation 2: the typed `facts` is a correct test-only fix. The Cycle 3 RED message being a runtime TypeError is also fine.
- ⚠️ **Upload caps cannot work as specified (W29).** The helpers run inside a server action. Next's server-action body limit defaults to 1 MB, and `next.config.ts` has no `bodySizeLimit`. Vercel functions also cap request bodies at 4.5 MB. So the documented "PDF ≤ 5 MB" and "3 × 8 MB" limits (`uploads.ts:22-25`, `hints.cv`, `hints.evidence`, ARCHITECTURE § Uploads) cannot be reached. An oversized post fails before the action runs. This needs a ruling before the careers and verify page tasks.
- ⚠️ **W3 retry vs the Ops captcha timeout.** Ops waits up to 6 s for siteverify, longer than the 4 s per-attempt timeout here. Also, the retry re-sends a captcha token the first attempt may already have used. In both cases the retry gets a 403, not `replayed: true`. The doc line "the retry lands on the same row" only holds when the first attempt died before the captcha check.
- ⚠️ **`off` maps to `skip`** (`ops.ts:55`, `opsPingCheck`) even though the door is live today. If the door goes dark, site-health stays green until T15 changes the mapping.

## Findings

**Critical**
1. **The Turnstile token is wiped by the first failed submit and never comes back** (`Turnstile.tsx:104`, `:53-99`). The hidden input has `defaultValue=""`. On every re-render React 19 re-applies it, and for a hidden input that overwrites the token. Any `useActionState` answer re-renders `FormShell`. The `interaction-only` widget does not issue a new token until expiry (about 300 s), and nothing resets it after a submit. So a visitor with any field error, or anyone who submits before the script loads (the brief's own recovery path), gets a 403 on every retry.
   - I reproduced this with the repo's react-dom 19.2.8 under jsdom, using a script in the scratchpad (repo untouched): the token is `"tok_1"` before the answer and `""` after it.
   - Removing `defaultValue` keeps the token. The widget also needs `turnstile.reset(widget)` after each result that reached the door, because tokens are single-use.
   - No test covers a token surviving a submit.

**Important**
2. **A rejected action goes to the error boundary, not the D11 panel** (`FormShell.tsx:120`). If the browser-to-Vercel call fails (flaky mobile, function timeout, the body-limit case above), React re-throws in render. The visitor gets the generic error page and loses what they typed. The fix is to wrap the action: turn a non-redirect rejection into `{status:'error', result:{kind:'unavailable', cause:'network'}}`.
3. **Some field errors are never shown** (`errors.ts:51`, `FormShell.tsx`). `_form` errors, from object-level `.refine()` or `.strict()` extra keys, are never rendered. Neither are errors on fields without a rendered `Field` (for example the hidden `openingSlug`). The submit then does nothing visible. At minimum, render `_form` as a form-level alert.
4. **The consent checkbox id is hard-coded** (`FormShell.tsx:68`, `f-consent`), unlike the honeypot at `:130`. The Contact page has 3 forms (W3), so it gets duplicate ids, and label clicks toggle the first form's checkbox. Pages cannot override it. `Field`'s default `f-<name>` (`Field.tsx:63`) has the same problem, but pages can pass `id`.
5. **Focus management is missing (D20).**
   - `disabled={pending}` (`FormShell.tsx:45`) takes focus away from the clicked submit button (it falls to `body`).
   - After `fieldErrors` or `error`, nothing moves focus to the first `aria-invalid` field or to the panel.
   - Several `role=alert` regions appear at once.
6. **The WhatsApp fallback link carries personal data** (`FallbackPanel.tsx:127-128`). Its `wa.me?text=` href contains the visitor's name, phone, e-mail and message, and it is an outbound link. GA4's default outbound-click tracking would send it as `link_url` (as would a GTM Click URL trigger), bypassing `track()`'s allowlist, so the D13 "no typed content" rule breaks. `ANALYTICS.md` does not mention it. This depends on the GA4 stream settings, so it needs a decision: turn off outbound clicks, or set the href at click time.
7. **The upload-cap issue in ⚠️ above** is recorded here so it gets tracked.

**Minor**
- **`failed` body claims receipt it cannot guarantee** (`tr.json:181`, EN too). It says "Talebiniz bize ulaştı…", but a `FormActionError` without a field ends in `failed` without ever posting. Reword the body.
- **Whitespace-only required values pass `z.string().min(1)`** (`action.ts:65-70`). The door then trims them to empty, answers 400, and the visitor sees the generic `invalid` panel instead of a field error. Trimming in `toObject`, or `.trim()` in the page-schema pattern, fixes it.
- **Vitest env pin gap.** The `test.env` pin list does not include `OPS_WEBSITE_WRITE_TOKEN`, which `env.ts:19` reads. It has no effect today because `OPS_API_URL` is pinned to `''`.
- **Beacon endpoint is loose.** `kind` accepts any string up to 20 characters (`form-beacon/route.ts:16`), and anyone can raise the count and write log lines.
- **Site-health exposes door facts publicly** (`site-health/route.ts:49`): `ops.captcha` and `trippedForms`.
- **Ops deploys will page the owner.** The Ops deploy 502 window now turns `/api/site-health` into a 503.
- **`pingOps` never reads the body of a non-200 response** (`ops.ts:55-57`).
- **The generic `toFields` catch drops the error** (`action.ts:134`); it logs nothing about what threw.
- **Duplicated helpers:** `isTimeout`, `MAX_UA` and the visitor-header code exist in both `post.ts` and `uploads.ts`.
- **Unused keys:** `fallback.retry` and `consent.link` are never read.
- **Hard-coded `<h3>` headings** (`FormShell.tsx:140`, `FallbackPanel.tsx:119`) risk an axe `heading-order` warning.
- **Turkish copy:**
  - "WhatsApp'tan gönder" (`tr.json:187`) uses the informal imperative next to formal "Bizi arayın" and "E-posta gönderin".
  - The label "Ben" (`:65`) does not read as a field label.
  - "Bu alan çok kısa/uzun" (`:140-141`) sounds machine-translated.
  - "Sorunu ekibimize ilettik" (`:173`) claims a notification the site does not send.
  - "aynı gün dönüş yapar" (`:165`) is a service promise the owner should approve.
  - No wrong Turkish characters.
- **Docs:**
  - `ARCHITECTURE.md:158` reads "email, — the client…", and still says "until WP3a/WP5/WP6 land the forms".
  - `DEPLOYMENT.md:33` (an older row) says `OPS_API_URL` is ".../api/website/v1", but the code needs the bare origin. Setting it per the doc gives 404 → `off` → `skip`, a silent misconfiguration.
- **Test gaps:** nothing checks that the echoed values or the token survive a real submit.

## Named risks checked

- **`server-only` alias / `test.env` pins.** The alias and the empty stand-in module are correct. The only unpinned variable the new code reads is `OPS_WEBSITE_WRITE_TOKEN`, and it has no effect today (Minor above).
- **site-health check shape.** `Checks` and `CheckResult` are unchanged. `opsPingCheck` returns 'ok', 'fail' or 'skip', and `evaluate` turns a fail into `OPS_PING` and a 503 (`checks.ts`). Compatible.
- **Thank-you page vs the redirect.** The page uses `asFormKey(form[0]|form)` against `FORM_KEYS` (`thank-you/page.tsx:53`). The action redirects with `{form: spec.key}` typed as `FormKey`, and `/thank-you` maps to `/tesekkurler` (`routing.ts:27`). Consistent.
- **FormShell.test flakiness.** The submit test clicks the real submit button, and `Button` passes `type` through (`Button.tsx:30,54`). My jsdom reproduction settles in one `act()` and the echo survives the reset, so the flake risk is low. The same reproduction is what exposed the Critical token wipe.