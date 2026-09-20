# Analytics — JobsAdmire Website

Full context: plan D13. IDs and the GTM container inventory are config values, not secrets — but still centralised, not hard-typed per page.

## Consent Mode v2 loading order

1. Consent Mode default state fires **inline**, before any tag loads — `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization` all default to `denied` until the visitor interacts with the consent banner.
2. `url_passthrough` and `ads_data_redaction` are enabled so Ads conversion measurement degrades gracefully under denial rather than breaking.
3. GTM loads via `@next/third-parties`.
4. **GA4 is loaded only through GTM** — never a direct `gtag.js`/`analytics.js` include anywhere in the codebase. This is a hard rule, not a preference: it's the only way the GTM container inventory (below) stays the single source of truth for what fires.

### How that order is realised in code

`src/analytics/GtmLoader.tsx` renders `CONSENT_DEFAULT_SCRIPT` (from `src/analytics/consent.ts`) through `next/script` at `strategy="beforeInteractive"`, then `GoogleTagManager` from `@next/third-parties/google`. It is mounted from `src/app/[locale]/layout.tsx` — the root layout, which is what makes `beforeInteractive` legal — and only when `settings.analytics.consentMode` is true. With `settings.analytics.gtmId === null` **only the defaults ship**: the container loads the moment that id is filled — from `NEXT_PUBLIC_GTM_ID` in Phase A (R54, below) or from the Integrations screen in Phase B — and the first tag it ever loads starts denied.

### The consent banner

`src/design/chrome/ConsentBanner.tsx` (client) is mounted from the same root layout, after `SiteChrome`, **and only when `analytics.consentMode && analytics.gtmId`** (R38): with no container id nothing can fire, so asking for consent would be theatre. It reads the choice through `useSyncExternalStore` — never during render, never from an effect — so a returning visitor never sees it flash (R27). The choice is stored twice: `localStorage.ja_consent_v1` and a 180-day `ja_consent_v1` cookie (`SameSite=Lax; Secure`), the cookie being the fallback when storage is blocked. `writeConsent` pushes `consent_update` to the `dataLayer`, calls `gtag('consent','update',…)` when the default script is present, and dispatches the `ja:consent` window event the banner subscribes to.

**Withdrawal (R36).** The banner's copy promises the visitor can change their mind, so `clearConsent()` removes the localStorage key, expires the cookie (`Max-Age=0`) and dispatches the same event — the state returns to `unknown` and the sheet re-opens. `src/design/chrome/CookiePreferencesButton.tsx` ("Çerez tercihleri" / "Cookie preferences", `sys.consent.manage`) sits in the footer's legal row and is the visitor's door to it; it is a leaf client component that receives only its label, so the server-rendered Footer stays a server component.

## IDs (config values — env in Phase A, CMS-driven in Phase B)

The WP1 generated bundle (`scripts/import-design-package.ts`'s `SETTINGS.analytics`) ships all four of these as `null` (only `consentMode: true` is set) — the design package carries no account ids. The values below are the real target account ids, recorded here so Phase A's env wiring and Phase B's Integrations screen both fill in the same numbers rather than someone re-discovering them:

| ID                       | Value            |
| ------------------------ | ---------------- |
| GA4 Measurement ID       | `G-77Y5KBV97L`   |
| GTM Container ID         | `GTM-N2CLWJWJ`   |
| Google Ads Conversion ID | `AW-17096273578` |

These are public identifiers (they ship in the page source by nature of how GTM/GA4/Ads work) — they are config values, not secrets, and belong in the Integrations screen (D12) in Phase B with a **test button** that fires a verifiable test event.

### How Phase A turns analytics on (R54)

The bundle's nulls are overlaid from the environment by `applyPublicSettings` (`src/content/pure.ts`), which `loadLocal` applies right after `BundleSchema.parse` — and `loadOps` never applies, because under `OPS` the CMS is the source of truth (D12). Set these on the Vercel project (Preview and/or Production) or in `.env.local`:

| Variable                           | Fills                                   |
| ---------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_GTM_ID`               | `settings.analytics.gtmId`              |
| `NEXT_PUBLIC_GA4_ID`               | `settings.analytics.ga4Id`              |
| `NEXT_PUBLIC_ADS_ID`               | `settings.analytics.adsId`              |
| `NEXT_PUBLIC_ADS_CONVERSION_LABEL` | `settings.analytics.adsConversionLabel` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`   | `settings.turnstileSiteKey`             |

An unset or empty variable leaves the bundle's own value alone, so "configured nowhere" stays "off" — the failure mode is a dark container, never a half-configured one. Filling `NEXT_PUBLIC_GTM_ID` is what makes the GTM container load, the consent banner mount (R38) and the withdrawal door appear, so a Phase A preview can rehearse consent → GTM → conversion end to end before WP2 instruments the pages. The `NEXT_PUBLIC_` prefix is honest here: every one of these values is visible in the page source by design.

**Inline consent defaults are not literally in `<head>` (M-12).** In the App Router, `next/script` at `beforeInteractive` with inline children renders as a `self.__next_s.push(...)` call in the body and is executed by the Next runtime before hydration — earlier than the `afterInteractive` GTM loader, which is what matters (`e2e/thank-you.spec.ts` proves `dataLayer[0]` is the default state). A raw GTM snippet pasted anywhere else would race it; don't add one.

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

**WP1 wired exactly one of these seven events: `conversion`**, fired from `ConversionPing` on the thank-you page. WP2a's forms kernel adds the visitor fallback panel's `whatsapp_click` / `call_click` / `email_click` with `placement: 'form_fallback'` (`src/forms/client/FallbackPanel.tsx`). The others (`generate_lead`, `calculator_use`, `language_switch`, and the chrome placements of the three contact events) are defined in `track.ts`'s allowlist — the contract is frozen — but no chrome component or page calls `track()` for them yet; the header/footer/mobile-bar phone, WhatsApp and email links render as plain `tel:`/`wa.me`/`mailto:` anchors with no click handler. Wiring the remaining six, on all 14 pages once they exist, is a Gate A checklist item (below), not something WP1 shipped. **Parameter allowlist rule (already enforced today, for every event including the six unwired ones):** no event, on any page, may ever carry a candidate name, phone number, email, free-text form content, or any other identifier a visitor typed into a form. This is enforced in `track()` itself, not by caller discipline — the event only ever sees `form_key` and page context, never submitted fields.

## Conversion

Fires on `/tesekkurler?form=<key>` — the single navigation target every form's success path uses (D13, `docs/PRD.md` §2). This is why the inline-success-panel pattern from the design package was explicitly overridden: Ads conversion measurement needs a real navigation to attach to, and GA4/GTM event-only conversions on an SPA-style panel are the failure mode the plan calls out ("conversion orphaned" risk, plan §9).

`src/app/[locale]/thank-you/page.tsx` whitelists `?form=` against the ten known keys — `hire`, `contact`, `partner`, `careers`, `newsletter`, `callback`, `visit`, `calculator`, `fraud`, `workers` (`FORM_KEYS` in `src/analytics/forms.ts`, one per PRD §2 handler type, R55) — and renders a form-specific line for each (`sys.thankYou.forms.<key>`). **Every WP2 server action types its redirect key as `FormKey`**, so a form redirecting with a key nobody added to `FORM_KEYS` is a compile error at the form rather than a silent zero in Ads. Adding a key means adding both the `FORM_KEYS` entry and its `sys.thankYou.forms.<key>` line in **both** message files. An unrecognised or missing key still renders the page, but **fires no conversion**: a stale or hand-typed link is not a lead. The event itself comes from `ConversionPing` (client, renders nothing). It is deduped twice over (R37): a `useRef` guard for React's dev double-invoke, and `sessionStorage['ja_conv:<formKey>:<pathname>']` for the whole session — so a reload, a back-forward restore or a re-render cannot inflate the count, while a different form key (or the same form on another path) still counts. The page renders it with `key={formKey}` so a client-side navigation between keys remounts it. With storage blocked (private mode) the dedupe is skipped and the event fires: losing a lead is worse than counting one twice. The page is `noindex` regardless of any later page record, and is absent from both `robots.txt` and the sitemap.

## Vercel Web Analytics as the consent-independent truth

GA4 numbers are consent-gated and will always undercount. **Vercel Web Analytics** (and Speed Insights) run independent of the consent banner and are the number used for the 12-week post-launch traffic watch (`docs/SEO.md`) and any GA4-vs-reality sanity check. **GA4 is never compared across the launch boundary** — old-site GA4 and new-site GA4 are different properties/configurations and a raw before/after comparison is not meaningful; use GSC clicks and Vercel Web Analytics for that comparison instead.

## Weekly three-way reconciliation

Form submissions (Operations `WebsiteFormSubmission` count) vs. `generate_lead` events (GA4) vs. Ads conversions — run weekly during the 12-week watch. A mismatch in either direction is the fastest signal that either the conversion page isn't being reached (forms work, no `generate_lead`) or forms are silently failing while WhatsApp absorbs the traffic (`generate_lead` low, WhatsApp clicks high).

## GTM container inventory (export in WP0)

_Placeholder — to be filled from the GTM `GTM-N2CLWJWJ` and Ads `AW-17096273578` export performed in WP0 (plan, WP0 item 0). Record here: every tag, its trigger, and whether it's still wired to a live destination, before any new tag is added for this rebuild._

| Tag                  | Trigger | Destination | Status |
| -------------------- | ------- | ----------- | ------ |
| _pending WP0 export_ |         |             |        |
