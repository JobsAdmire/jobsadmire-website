# Analytics — JobsAdmire Website

Full context: plan D13. IDs and the GTM container inventory are config values, not secrets — but still centralised, not hard-typed per page.

## Consent Mode v2 loading order

1. Consent Mode default state fires **inline**, before any tag loads — `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization` all default to `denied` until the visitor interacts with the consent banner.
2. `url_passthrough` and `ads_data_redaction` are enabled so Ads conversion measurement degrades gracefully under denial rather than breaking.
3. GTM loads via `@next/third-parties`.
4. **GA4 is loaded only through GTM** — never a direct `gtag.js`/`analytics.js` include anywhere in the codebase. This is a hard rule, not a preference: it's the only way the GTM container inventory (below) stays the single source of truth for what fires.

### How that order is realised in code

`src/analytics/GtmLoader.tsx` renders `CONSENT_DEFAULT_SCRIPT` (from `src/analytics/consent.ts`) through `next/script` at `strategy="beforeInteractive"`, then `GoogleTagManager` from `@next/third-parties/google`. It is mounted from `src/app/[locale]/layout.tsx` — the root layout, which is what makes `beforeInteractive` legal — and only when `settings.analytics.consentMode` is true. With `settings.analytics.gtmId === null` (the Phase A bundle) **only the defaults ship**: the container loads the moment the owner fills the id in the Integrations screen (Phase B), and the first tag it ever loads starts denied.

### The consent banner

`src/design/chrome/ConsentBanner.tsx` (client) is mounted from the same root layout, after `SiteChrome`, **and only when `analytics.consentMode && analytics.gtmId`** (R38): with no container id nothing can fire, so asking for consent would be theatre. It reads the choice through `useSyncExternalStore` — never during render, never from an effect — so a returning visitor never sees it flash (R27). The choice is stored twice: `localStorage.ja_consent_v1` and a 180-day `ja_consent_v1` cookie (`SameSite=Lax; Secure`), the cookie being the fallback when storage is blocked. `writeConsent` pushes `consent_update` to the `dataLayer`, calls `gtag('consent','update',…)` when the default script is present, and dispatches the `ja:consent` window event the banner subscribes to.

**Withdrawal (R36).** The banner's copy promises the visitor can change their mind, so `clearConsent()` removes the localStorage key, expires the cookie (`Max-Age=0`) and dispatches the same event — the state returns to `unknown` and the sheet re-opens. `src/design/chrome/CookiePreferencesButton.tsx` ("Çerez tercihleri" / "Cookie preferences", `sys.consent.manage`) sits in the footer's legal row and is the visitor's door to it; it is a leaf client component that receives only its label, so the server-rendered Footer stays a server component.

## IDs (config values — CMS-driven in Phase B, env/constants in Phase A)

| ID                       | Value            |
| ------------------------ | ---------------- |
| GA4 Measurement ID       | `G-77Y5KBV97L`   |
| GTM Container ID         | `GTM-N2CLWJWJ`   |
| Google Ads Conversion ID | `AW-17096273578` |

These are public identifiers (they ship in the page source by nature of how GTM/GA4/Ads work) — they are config values, not secrets, and belong in the Integrations screen (D12) in Phase B with a **test button** that fires a verifiable test event.

## Event schema

The allowlist lives in one place — `ALLOWED_PARAMS` in `src/analytics/track.ts` — and `track(event, params)` **drops every parameter not listed for that event** before pushing to `window.dataLayer`. An unknown event name throws. This table is that constant, in prose; change one and change the other.

| Event             | Fires on                                                                   | Parameter allowlist                   |
| ----------------- | -------------------------------------------------------------------------- | ------------------------------------- |
| `generate_lead`   | A form's successful submission                                             | `form_key`, `page`, `locale`          |
| `conversion`      | Arrival at `/tesekkurler?form=<key>`, once per mount, known form keys only | `form_key`, `page`, `locale`          |
| `call_click`      | Phone tap/click (header, footer, mobile bottom bar, page CTAs)             | `page`, `locale`, `placement`         |
| `whatsapp_click`  | WhatsApp CTA/FAB click                                                     | `page`, `locale`, `placement`         |
| `email_click`     | `mailto:` link click                                                       | `page`, `locale`, `placement`         |
| `calculator_use`  | Hiring-cost calculator interaction                                         | `page`, `locale`, `role`, `headcount` |
| `language_switch` | TR↔EN switch                                                               | `from`, `to`                          |

`page` is `usePathname()` from **`next/navigation`** — the real URL pathname the visitor's address bar shows (`/tesekkurler`, `/en/thank-you`), not next-intl's internal route key (R35). `track()` also copies only values whose `typeof` is `'string'` or `'number'`: an object, an array or a `null` under an allow-listed key is a caller handing over raw form state, and it is dropped rather than pushed.

**Coverage:** all 14 pages instrumented — this is a Gate A checklist item, not optional per-page. **Parameter allowlist rule:** no event, on any page, ever carries a candidate name, phone number, email, free-text form content, or any other identifier a visitor typed into a form. This is enforced in `track()` itself, not by caller discipline: the event only ever sees `form_key` and page context, never the submitted fields.

## Conversion

Fires on `/tesekkurler?form=<key>` — the single navigation target every form's success path uses (D13, `docs/PRD.md` §2). This is why the inline-success-panel pattern from the design package was explicitly overridden: Ads conversion measurement needs a real navigation to attach to, and GA4/GTM event-only conversions on an SPA-style panel are the failure mode the plan calls out ("conversion orphaned" risk, plan §9).

`src/app/[locale]/thank-you/page.tsx` whitelists `?form=` against the five known keys — `hire`, `contact`, `partner`, `careers`, `newsletter` — and renders a form-specific line for each. An unrecognised or missing key still renders the page, but **fires no conversion**: a stale or hand-typed link is not a lead. The event itself comes from `ConversionPing` (client, renders nothing). It is deduped twice over (R37): a `useRef` guard for React's dev double-invoke, and `sessionStorage['ja_conv:<formKey>:<pathname>']` for the whole session — so a reload, a back-forward restore or a re-render cannot inflate the count, while a different form key (or the same form on another path) still counts. The page renders it with `key={formKey}` so a client-side navigation between keys remounts it. With storage blocked (private mode) the dedupe is skipped and the event fires: losing a lead is worse than counting one twice. The page is `noindex` regardless of any later page record, and is absent from both `robots.txt` and the sitemap.

## Vercel Web Analytics as the consent-independent truth

GA4 numbers are consent-gated and will always undercount. **Vercel Web Analytics** (and Speed Insights) run independent of the consent banner and are the number used for the 12-week post-launch traffic watch (`docs/SEO.md`) and any GA4-vs-reality sanity check. **GA4 is never compared across the launch boundary** — old-site GA4 and new-site GA4 are different properties/configurations and a raw before/after comparison is not meaningful; use GSC clicks and Vercel Web Analytics for that comparison instead.

## Weekly three-way reconciliation

Form submissions (Operations `WebsiteFormSubmission` count) vs. `generate_lead` events (GA4) vs. Ads conversions — run weekly during the 12-week watch. A mismatch in either direction is the fastest signal that either the conversion page isn't being reached (forms work, no `generate_lead`) or forms are silently failing while WhatsApp absorbs the traffic (`generate_lead` low, WhatsApp clicks high).

## GTM container inventory (export in WP0)

_Placeholder — to be filled from the GTM `GTM-N2CLWJWJ` and Ads `AW-17096273578` export performed in WP0 (plan, WP0 item 0). Record here: every tag, its trigger, and whether it's still wired to a live destination, before any new tag is added for this rebuild._

| Tag                  | Trigger | Destination | Status |
| -------------------- | ------- | ----------- | ------ |
| _pending WP0 export_ |         |             |        |
