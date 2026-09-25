# Task 12 report — Consent Mode v2, GTM loader, analytics helper, thank-you page

**Branch:** `wp1/foundation` (worktree `jobsadmire-website-wp1`) · **Commit:** `78d8b42` · **Status:** DONE_WITH_CONCERNS

## What I implemented

| File | What it does |
| --- | --- |
| `src/analytics/track.ts` | `ALLOWED_PARAMS` (7 events), `EventName`, `track()` — drops every non-allow-listed param before pushing to `window.dataLayer`, throws on an unknown event. Verbatim from the brief. |
| `src/analytics/consent.ts` | `ConsentState`, `CONSENT_KEY`, `CONSENT_EVENT`, `CONSENT_DEFAULT_SCRIPT` (verbatim), `readConsent()`, `writeConsent()`. |
| `src/analytics/GtmLoader.tsx` | Inline `beforeInteractive` consent-default script, then `GoogleTagManager` from `@next/third-parties/google` — only when a `gtmId` exists. No GA4 loader, no Ads tag. |
| `src/analytics/ConversionPing.tsx` | Client, renders nothing; fires `track('conversion', { form_key, page, locale })` once per mount (empty dep array + `useRef` guard against the StrictMode double-invoke). |
| `src/design/chrome/ConsentBanner.tsx` | Client bottom sheet, `role="region"`, `aria-label` = consent title, `z-[60]`, ≥44 px buttons (the `Button` primitive), cookie-policy `Link`. |
| `src/app/[locale]/thank-you/page.tsx` | Server component; whitelists `?form=` against the five keys, renders title/body/form line + home and WhatsApp CTAs; `generateMetadata` = `buildMetadata(...)` spread with forced `robots: { index: false, follow: false }`. |
| `src/app/[locale]/layout.tsx` | `<GtmLoader gtmId={analytics.gtmId} />` in `<body>` gated on `analytics.consentMode`; `<ConsentBanner />` after `SiteChrome`, inside the intl provider. |
| `src/messages/{tr,en}.json` | `sys.consent.{title,body,accept,reject,policy}` and `sys.thankYou.{title,body,home,whatsapp,forms.{hire,contact,partner,careers,newsletter}}`. |
| `e2e/thank-you.spec.ts` | 4 tests (below). |
| `docs/ANALYTICS.md` | Synced to what shipped: loading order in code, the banner, the real allowlist table, the conversion page's whitelist rule. |
| `src/test/storage.ts` | `memoryStorage()` helper — see the Node concern below. |

`npm install @next/third-parties` (16.3.5, runtime dep); lockfile committed. No other dependency.

## How R27 was realised

`ConsentBanner` holds no state and runs no effect. It reads:

```ts
type Snapshot = ConsentState | 'hydrating';
const subscribe = (onStoreChange: () => void) => {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_EVENT, onStoreChange);
};
const getServerSnapshot = (): Snapshot => 'hydrating';
const state = useSyncExternalStore<Snapshot>(subscribe, readConsent, getServerSnapshot);
if (state !== 'unknown') return null;
```

- Server render and the hydrating client both see `'hydrating'` → `null`, so a returning visitor gets no flash and hydration cannot mismatch.
- After hydration React re-reads with `getSnapshot` (`readConsent`): `'unknown'` opens the sheet, `'granted'`/`'denied'` render `null`.
- `writeConsent` stores, sets the cookie, pushes `consent_update`, calls `gtag('consent','update',…)` **when defined**, then `window.dispatchEvent(new Event('ja:consent'))` — that dispatch is what closes the sheet. No `setState`, so `react-hooks/set-state-in-effect` has nothing to fire on.
- `ConsentState` stays the public `'unknown' | 'granted' | 'denied'`; the `'hydrating'` sentinel lives only inside the component as `Snapshot`.

## RED → GREEN

RED (`npx vitest run src/analytics`, before the modules existed):

```
FAIL src/analytics/consent.test.ts — Failed to resolve import "./consent"
FAIL src/analytics/track.test.ts   — Failed to resolve import "./track"
Test Files  2 failed (2) · Tests  no tests
```

GREEN after implementing:

```
Test Files  2 passed (2) · Tests  8 passed (8)
```

(then, with the banner test added: `Test Files 3 passed (3) · Tests 11 passed (11)`)

## `npm run verify`

```
typecheck → tsc --noEmit: clean
lint      → eslint .: 0 problems
format    → prettier --check .: All matched files use Prettier code style!
test      → vitest run: Test Files 23 passed (23) · Tests 92 passed (92)
```

Only the pre-existing Vite `configLoader: 'native'` warning appears; no EBADENGINE noise outside `npm install`.

## Build

```
npm run build → ▲ Next.js 16.3.5 (Turbopack)
✓ Compiled successfully in 730ms · Finished TypeScript in 1696ms · 12/12 static pages
ƒ /[locale]/thank-you   (dynamic — it reads searchParams)
```

Clean; `@next/third-parties` printed nothing, as expected.

## Playwright

`next start -p 3100` (pid file in the scratchpad, killed afterwards), `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/thank-you.spec.ts e2e/routing.spec.ts e2e/smoke.spec.ts --project=desktop`:

```
13 passed (2.2s)
  routing.spec.ts     8 passed
  smoke.spec.ts       1 passed
  thank-you.spec.ts   4 passed
```

`thank-you.spec.ts` covers: `/tesekkurler?form=hire` → 200 + `<meta name="robots" content="noindex, nofollow">` + one `h1` + exactly one `dataLayer` entry with `event: 'conversion'`, `form_key: 'hire'`; `/en/thank-you?form=contact` → 200 + `html[lang=en]`; an unknown `?form=` → page renders, **no** conversion; the consent sheet visible on first visit with `gtag` defined and the denied defaults as the first `dataLayer` entry, gone after Accept, `localStorage.ja_consent_v1 === 'granted'`, still gone after a reload.

Runtime evidence captured while the server was up (`/tesekkurler?form=hire`):

```
["consent","default",{ad_storage:"denied",analytics_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",…}]
["set","url_passthrough",true] · ["set","ads_data_redaction",true]
{"event":"conversion","form_key":"hire","page":"/thank-you","locale":"tr"}
```

`googletagmanager.com` appears **zero** times in the served HTML (Phase A `gtmId` is `null`) — the defaults ship alone, as designed.

## Files changed

Added: `src/analytics/{track.ts,track.test.ts,consent.ts,consent.test.ts,GtmLoader.tsx,ConversionPing.tsx}`, `src/design/chrome/ConsentBanner.tsx`, `src/design/chrome/__tests__/ConsentBanner.test.tsx`, `src/app/[locale]/thank-you/page.tsx`, `e2e/thank-you.spec.ts`, `src/test/storage.ts`.
Modified: `src/app/[locale]/layout.tsx`, `src/messages/{tr,en}.json`, `docs/ANALYTICS.md`, `package.json`, `package-lock.json`.

## Self-review findings

Completeness: every "Produces" export exists; both message files carry the full `sys.consent.*` / `sys.thankYou.*` set; the layout mount is gated on `consentMode`; the thank-you page is `noindex` and absent from `robots.txt`/sitemap (both already excluded it); the e2e is in place.

Quality: nothing a caller passes can leak — the allowlist filter lives inside `track()`, and `ConversionPing` only ever receives a `form_key` already whitelisted against the five keys, plus the pathname and locale. Consent defaults are denied and verifiably first in the `dataLayer`. No GA4 loader and no Ads tag anywhere.

Deliberate deviations from the brief's literal code:

1. **`readConsent` hardened** — it validates the stored value and falls back to the `ja_consent_v1` cookie when storage throws or is unavailable. Without this, a private-mode visitor who clicks Accept would have the sheet re-open instantly (the snapshot would still read `'unknown'`), i.e. the banner could never be dismissed. Identical behaviour on the normal path.
2. `CONSENT_KEY` and `CONSENT_EVENT` exported (R27 needs the event name; tests and the e2e use the key), `MAX_AGE` extracted.
3. Two narrow eslint-disables, each with a reason comment: `@next/next/no-before-interactive-script-outside-document` (a Pages-Router-era rule; `beforeInteractive` in the App Router root layout is exactly what the brief mandates) and `react-hooks/exhaustive-deps` on the ConversionPing effect (the ruling mandates the empty dep array). Both keep `npm run lint` at zero problems.
4. Extras: a fourth e2e case (unknown form key fires nothing), `ConsentBanner.test.tsx`, and `data-testid="consent-banner"` for stable targeting.

## Concerns

1. **`page` is the internal pathname, not the localized slug.** The ruling said "the localized pathname (`usePathname()`)" — I used `usePathname()` as instructed, and next-intl with `pathnames` configured returns the internal template: `/thank-you` even on `/tesekkurler` (verified at runtime, above). That is arguably the better analytics key (one row per page, `locale` as the dimension) and `docs/ANALYTICS.md` now states it plainly. If the controller wants the localized slug instead, it is a one-line change: pass `getPathname({ locale, href })` from the server component as a prop.
2. **Node drift — affects every future test that touches storage.** The repo pins `node: 22.x`; this machine runs v25.8.2. Node ≥23 defines a stub `localStorage` global, and vitest's jsdom environment therefore never copies jsdom's real `Storage` — `localStorage.getItem` is *not a function* in unit tests, so any code reading storage silently takes its catch branch. `src/test/storage.ts` supplies a real in-memory `Storage`; `LanguageHint`'s storage path is currently untested for the same reason.
3. **`docs/ANALYTICS.md` drift resolved in favour of the brief.** The doc said `page_path` and `context`; the brief's `ALLOWED_PARAMS` (implemented verbatim) says `page` and `placement`, and adds `conversion`, `calculator_use`, `language_switch`. I synced the doc to the code. If the doc's names were the canonical ones, it is a rename in one constant plus the table.
4. **`beforeInteractive` emits as Next's `__next_s` bootstrap entry at the top of `<body>`**, not as a literal `<script>` inside `<head>`. It still executes before hydration and before any GTM tag — proven by `typeof window.gtag === 'function'` and the denied defaults being `dataLayer[0..2]` on a cold load. The brief's "in `<head>`" describes the intent, not the emitted markup.
5. **`npm run gate` (Playwright + axe + Lighthouse against a preview URL) was not run** — per `CLAUDE.md` it is a per-work-package gate outside the build, not a per-task one. The consent sheet is new fixed-position chrome above the mobile bar, so it deserves attention at the WP1 gate.
6. **The thank-you page renders the default chrome** (social rail + WhatsApp FAB). `SiteChrome` already supports `variant="minimal"` "for pages that must not compete with their own single action (legal, thank-you)", but the layout mounts it with the default and per-route variant wiring was not part of this task.

---

# Fix round 1 — review verdict "Approved with two Important items"

**Commit:** `4221bc9` `fix(analytics): consent withdrawal, per-session conversion dedupe, URL page param, banner gated on a container id`

## R35 — `page` is the real URL pathname

`src/analytics/ConversionPing.tsx:3,18` — `usePathname` now comes from `next/navigation`, not `@/i18n/navigation`, so the param is what the address bar shows. Verified in the browser: the pushed event is `{event:'conversion', form_key:'hire', page:'/tesekkurler', locale:'tr'}` (it was `/thank-you`).
`docs/ANALYTICS.md` — the caveat under the event table now reads "…from **`next/navigation`** — the real URL pathname the visitor's address bar shows (`/tesekkurler`, `/en/thank-you`), not next-intl's internal route key (R35)".
Covering test: `e2e/thank-you.spec.ts:22` asserts `toMatchObject({ page: '/tesekkurler', locale: 'tr' })`.

## IMPORTANT 1 (R36) — consent is now withdrawable

- `src/analytics/consent.ts:63` — `export function clearConsent()`: `localStorage.removeItem` (try/catch), cookie expired via `COOKIE('', 0)` → `Max-Age=0`, then `window.dispatchEvent(new Event(CONSENT_EVENT))`. State returns to `unknown`, so the subscribed sheet re-opens with no reload.
- `src/design/chrome/CookiePreferencesButton.tsx` — new client leaf, `<button type="button">`, `min-h-[44px]`, label prop only, `onClick={() => clearConsent()}`.
- `src/design/chrome/Footer.tsx:8,188` — mounted in the legal row, which became a `flex flex-wrap items-center justify-between` row; the Footer stays a server component and passes `sys('consent.manage')` as a plain string.
- `src/messages/{tr,en}.json` — new `sys.consent.manage`: "Çerez tercihleri" / "Cookie preferences".

Covering tests: `src/analytics/consent.test.ts` — "clearConsent → un-chooses: both records gone, subscribers told, banner back to unknown"; `src/design/chrome/__tests__/Footer.test.tsx:59` — the button renders in `contentinfo` with `type="button"`; `src/design/chrome/__tests__/ConsentBanner.test.tsx` — "re-opens when the visitor withdraws from the footer (R36)" (granted → `clearConsent()` → the region is back).

One judgement call, flagged rather than invented: `clearConsent` does **not** push a `gtag('consent','update', …denied)`. The ruling enumerates exactly three effects and the visitor is immediately asked again; nothing is stored, so the next page load starts from the denied defaults. The exposure is one page view if the visitor withdraws and then navigates away without choosing.

## IMPORTANT 2 (R37) — conversion deduped per session per form+path

`src/analytics/ConversionPing.tsx:25-37` — inside the effect: `const k = \`ja_conv:${formKey}:${pathname}\``; `sessionStorage.getItem(k)` set → return (no event); otherwise `track(...)` then `sessionStorage.setItem(k, '1')`. Both accesses are in their own try/catch — private mode falls through and fires, because losing a lead is worse than counting one twice. The `useRef` strict-mode guard is unchanged and still runs first.
`src/analytics/forms.ts` (new) — `FORM_KEYS`, `FormKey`, `asFormKey`; imports nothing, so page ↔ client component cannot form a cycle. `ConversionPing`'s prop is typed `FormKey`; `src/app/[locale]/thank-you/page.tsx:6,52,76` imports `asFormKey` from it and renders `<ConversionPing key={formKey} …>`.
Covering test: `e2e/thank-you.spec.ts:24-31` — after `page.reload()` the fresh `dataLayer` holds **zero** `conversion` entries for `hire` (one before the reload).

## MINOR

- `src/analytics/track.ts:23,30` — `Object.hasOwn(ALLOWED_PARAMS, event)` guard; only `typeof 'string' | 'number'` values are copied. `src/analytics/track.test.ts` gained "drops params that are not scalars — a raw form object can never reach GTM" (array, `null`, object under allow-listed keys → dropped) and a `'toString'` case on the unknown-event test.
- `src/analytics/consent.ts:9-12,23` — one `COOKIE()` builder emitting `SameSite=Lax; Secure`; the cookie regex is anchored `(granted|denied)(?:;|$)`. (Verified the `Secure` cookie still round-trips in jsdom and in the localhost e2e — localhost is a trustworthy origin.)
- `src/app/[locale]/thank-you/page.tsx:44,52` — `searchParams: Promise<{ form?: string | string[] }>`, normalised to the first value.
- **R38** `src/app/[locale]/layout.tsx:65` — `{analytics.consentMode && Boolean(analytics.gtmId) && <ConsentBanner />}`. The e2e banner case was rewritten to "no container id means no consent sheet, but the denied defaults still ship": banner count 0, `ja_consent_v1` unset, `gtag` still a function with the denied defaults as `dataLayer[0]`, zero `googletagmanager.com` script tags, and the footer's withdrawal button present. The accept/reject flow lives in `ConsentBanner.test.tsx`, which renders the banner directly.

## Commands and output

```
npm run test -- src/analytics src/design/chrome → Test Files 6 passed (6) · Tests 29 passed (29)

npm run verify
  typecheck → clean · lint → eslint . (0 problems) · format → All matched files use Prettier code style!
  test      → Test Files 23 passed (23) · Tests 96 passed (96)

npm run build → ✓ Compiled successfully · Finished TypeScript · 12/12 static pages
               ƒ /[locale]/thank-you (dynamic)

E2E (next start -p 3100, pid file in the scratchpad, killed after):
  13 passed (2.6s) — routing 8, smoke 1, thank-you 4
    ✓ the Turkish conversion page is noindex and fires the conversion once (incl. reload dedupe + page:'/tesekkurler')
    ✓ the English conversion page answers under /en
    ✓ an unknown form key renders the page without firing a conversion
    ✓ no container id means no consent sheet, but the denied defaults still ship
```

Only the pre-existing Vite `configLoader: 'native'` warning appears anywhere in the output.

## Files changed in this round

New: `src/analytics/forms.ts`, `src/design/chrome/CookiePreferencesButton.tsx`.
Modified: `src/analytics/{consent.ts,consent.test.ts,track.ts,track.test.ts,ConversionPing.tsx}`, `src/app/[locale]/{layout.tsx,thank-you/page.tsx}`, `src/design/chrome/Footer.tsx`, `src/design/chrome/__tests__/{Footer.test.tsx,ConsentBanner.test.tsx}`, `src/messages/{tr,en}.json`, `e2e/thank-you.spec.ts`, `docs/ANALYTICS.md`.

## Concerns after this round

1. Concerns 2 (Node ≥23 breaks `localStorage` in vitest), 5 (`npm run gate` is a WP-level gate, still unrun — and the footer now has a new interactive control) and 6 (thank-you uses the default chrome, not `SiteChrome variant="minimal"`) from the first report still stand. Concerns 1 and 3 are resolved by R35 and the doc sync.
2. With `gtmId: null` the consent sheet never renders in Phase A, so `ConsentBanner`'s live behaviour is covered only by unit tests until a container id is configured. The withdrawal button is visible in the footer regardless — it clears state that, today, only the banner would consume. Harmless, but worth a look the first time WP2 or the owner sets a real `gtmId`.
3. `clearConsent` does not re-deny via `gtag` (see R36 above) — a deliberate reading of the ruling, easy to add if you want withdrawal to take effect within the same page view.

---

# Fix round 2 — R39: `clearConsent()` re-denies immediately

**Commit:** `f1fe57e` `fix(analytics): clearConsent re-denies consent via gtag`

## The change

`src/analytics/consent.ts:41-49` — the optional-`gtag` call that lived inline in `writeConsent` is now a module helper, so both doors go through one place:

```ts
/** `gtag` comes from the inline default script, which only renders when
 *  `settings.analytics.consentMode` is on — so it stays optional here, never assumed. */
function updateGtag(v: 'granted' | 'denied') {
  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('consent', 'update', {
    ad_storage: v,
    analytics_storage: v,
    ad_user_data: v,
    ad_personalization: v,
  });
}
```

- `src/analytics/consent.ts:59` — `writeConsent` calls `updateGtag(state)`; behaviour unchanged (the old local `const v = state === 'granted' ? 'granted' : 'denied'` was a no-op on an already-narrowed union and is gone).
- `src/analytics/consent.ts:73-75` — `clearConsent` now calls `updateGtag('denied')` after removing the key and expiring the cookie, before dispatching `CONSENT_EVENT`. Any tag already running stops within the same page view instead of waiting for the visitor to choose again or reload — this closes concern 1 from fix round 1.

The optional-call (`?.`) is what keeps it safe when the consent-default script never rendered (`consentMode: false`, or the Phase A page where no banner is mounted).

## Tests

`src/analytics/consent.test.ts`, two new cases in the `clearConsent` block:

- "re-denies through gtag so tags stop within the same page view (R39)" — installs a `vi.fn()` spy, grants, clears the spy, calls `clearConsent()`, asserts `('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })`.
- "does not throw when the consent-default script never ran (gtag undefined)" — `w.gtag` absent, `clearConsent()` does not throw.

## Commands and output

```
npm run test -- src/analytics → Test Files 2 passed (2) · Tests 12 passed (12)

npm run verify
  typecheck → clean · lint → eslint . (0 problems) · format → All matched files use Prettier code style!
  test      → Test Files 23 passed (23) · Tests 98 passed (98)
```

No build or e2e run: nothing rendered changed (`ConsentBanner`, the footer button and the thank-you page are untouched), per the ruling.

## Files changed in this round

`src/analytics/consent.ts`, `src/analytics/consent.test.ts`.

## Concerns after this round

Concern 1 from round 1 is closed. Still standing: Node ≥23 breaks `localStorage` in vitest (worked around by `src/test/storage.ts`); `npm run gate` is unrun and is a WP-level gate, and the footer now carries a new interactive control; the thank-you page uses the default chrome rather than `SiteChrome variant="minimal"`; and with `gtmId: null` the consent sheet itself is exercised only by unit tests until a real container id is configured.
